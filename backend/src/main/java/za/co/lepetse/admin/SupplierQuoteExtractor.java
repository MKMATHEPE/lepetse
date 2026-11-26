package za.co.lepetse.admin;

import java.io.*;
import java.math.*;
import java.nio.charset.*;
import java.time.*;
import java.time.format.*;
import java.util.*;
import java.util.regex.*;
import java.util.zip.*;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Component;

/** Local document parsing only. Uploaded text is data, never instructions. */
@Component
public class SupplierQuoteExtractor {
 static final int MAX_BYTES=10*1024*1024,MAX_ROWS=500,MAX_TEXT=200000;
 private static final String MONEY="([0-9][0-9 ,.\\u00a0]*[.,][0-9]{2,4})";
 private static final Pattern ITEM=Pattern.compile("^(\\d+)\\s+([A-Za-z0-9][A-Za-z0-9._/-]{2,})\\s+(.+?)\\s+"+MONEY+"\\s+([A-Za-z][A-Za-z0-9-_/]*)\\s+"+MONEY+"\\s*$");
 public record Extracted(String format,String supplier,String reference,String quoteDate,String validUntil,String terms,String deliveryNotes,String vatBasis,BigDecimal subtotal,BigDecimal vat,BigDecimal total,List<Map<String,Object>> lines,List<String> warnings,String sourceText){}
 public String format(byte[] bytes,String filename){
  if(bytes.length==0||bytes.length>MAX_BYTES)throw new IllegalArgumentException("Choose a non-empty file up to 10 MB.");
  String ext=filename==null?"":filename.toLowerCase(Locale.ROOT);
  if(bytes.length>=5&&new String(bytes,0,5,StandardCharsets.US_ASCII).equals("%PDF-"))return "pdf";
  if(ext.endsWith(".xlsx")&&bytes.length>4&&bytes[0]=='P'&&bytes[1]=='K')return "xlsx";
  if(ext.endsWith(".csv"))return "csv";
  throw new IllegalArgumentException("Upload a PDF, XLSX or UTF-8 CSV file. Scanned images need OCR first.");
 }
 public Extracted extract(byte[] bytes,String filename)throws IOException{
  return extract(bytes,filename,Map.of());
 }
 public Extracted extract(byte[] bytes,String filename,Map<String,String> savedColumns)throws IOException{
 String format=format(bytes,filename);return switch(format){case "pdf"->pdf(bytes);case "xlsx"->spreadsheet(bytes,savedColumns);default->table(csv(bytes),"csv",List.of(),savedColumns);};
 }
 private Extracted pdf(byte[] bytes)throws IOException{
  String text;
  try(var doc=Loader.loadPDF(bytes)){
   if(!doc.getCurrentAccessPermission().canExtractContent())throw new IllegalArgumentException("This PDF restricts text extraction. Ask the supplier for an extractable copy.");
   if(doc.getNumberOfPages()>30)throw new IllegalArgumentException("Import PDFs of up to 30 pages.");
   var writer=new StringWriter(){@Override public void write(String value){if(getBuffer().length()+value.length()>MAX_TEXT)throw new IllegalArgumentException("This PDF contains too much text for one import.");super.write(value);}@Override public void write(char[] value,int off,int len){if(getBuffer().length()+len>MAX_TEXT)throw new IllegalArgumentException("This PDF contains too much text for one import.");super.write(value,off,len);}@Override public void write(String value,int off,int len){if(getBuffer().length()+len>MAX_TEXT)throw new IllegalArgumentException("This PDF contains too much text for one import.");super.write(value,off,len);}};
   var stripper=new PDFTextStripper();stripper.setSortByPosition(true);stripper.writeText(doc,writer);text=writer.toString();
  }
  if(text.isBlank())throw new IllegalArgumentException("This PDF has no readable text. Upload a text-based PDF, XLSX or CSV; scanned PDFs need OCR first.");
  var lines=new ArrayList<Map<String,Object>>();var warnings=new ArrayList<String>();Map<String,Object> previous=null;boolean inItems=false;
  for(String raw:text.split("\\R")){
   String row=raw.trim();var m=ITEM.matcher(row);
   if(m.matches()){
    if(lines.size()>=MAX_ROWS)throw new IllegalArgumentException("Import up to 500 item rows at a time.");
    previous=line(m.group(2),m.group(3),m.group(1),m.group(4),m.group(5),"",lines.size()+1);lines.add(previous);inItems=true;
    BigDecimal extended=amount(m.group(6));BigDecimal calculated=amount(m.group(4)).multiply(new BigDecimal(m.group(1)));
    if(extended!=null&&calculated!=null&&extended.subtract(calculated).abs().compareTo(new BigDecimal("0.01"))>0)warnings.add("Row "+lines.size()+": quantity × pack price differs from the printed line total.");
   }else if(inItems&&previous!=null&&!row.isBlank()){
    if(row.matches("(?i).*(quotation|continued on (?:next )?page|comments:|tax summary|subtotal|total order|BSC Stationery|less).*")){inItems=false;previous=null;}
    else if(!row.matches("(?i)^(?:Qty\\.?|Description\\s+Unit Price|Item Number\\s+Description|Extended Price).*")){
     String description=previous.get("description").toString();if(description.length()+row.length()<1000)previous.put("description",description+" "+row);
    }
   }
  }
  String supplier=Arrays.stream(text.split("\\R")).map(String::trim).filter(s->!s.isBlank()).findFirst().orElse("");supplier=supplier.split("(?i)\\s+Quotation\\b")[0].trim();if(supplier.length()>200)supplier="";
  String reference=find(text,"\\b(QT[0-9]{4,})\\b");if(reference.isEmpty())reference=find(text,"(?i)(?:quotation|quote)\\s*(?:no\\.?|number|reference|#)\\s*[:#]?\\s*([A-Z0-9][A-Z0-9/-]{2,})");
  String date=find(text,"(?i)\\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\s+\\d{1,2},?\\s+20\\d{2})\\b");
  String valid=find(text,"(?i)(?:valid until|expiry|expires)\\s*:?\\s*([0-9]{4}-[0-9]{2}-[0-9]{2}|[0-9]{1,2}/[0-9]{1,2}/20[0-9]{2})");
  BigDecimal subtotal=amount(find(text,"(?im)^\\s*Subtotal\\s+"+MONEY+"\\s*$")),vat=amount(find(text,"(?im)^\\s*Total sales tax\\s+"+MONEY+"\\s*$")),total=amount(find(text,"(?im)^\\s*Total order\\s+"+MONEY+"\\s*$"));
  String basis=text.toLowerCase(Locale.ROOT).matches("(?s).*excl(?:uding)?[ .]*vat.*")?"exclusive":text.toLowerCase(Locale.ROOT).matches("(?s).*incl(?:uding)?[ .]*vat.*")?"inclusive":"unknown";
  if(subtotal!=null&&vat!=null&&total!=null&&subtotal.add(vat).subtract(total).abs().compareTo(new BigDecimal("0.01"))<=0){
   BigDecimal sum=lines.stream().map(l->new BigDecimal(l.get("packPrice").toString()).multiply(new BigDecimal(l.get("quotedPacks").toString()))).reduce(BigDecimal.ZERO,BigDecimal::add);
   if(sum.subtract(subtotal).abs().compareTo(new BigDecimal("0.01"))<=0)basis="exclusive";else warnings.add("Extracted item totals do not match the printed subtotal. Check for missing or misread rows.");
  }
  if(lines.isEmpty())warnings.add("No item rows could be recognised automatically. Use the extracted text to add or correct rows below.");
  warnings.add("PDF layouts vary. Check the original document against every extracted row before saving.");
  return result("pdf",supplier,reference,date(date),date(valid),text.matches("(?s).*\\bCOD\\b.*")?"COD":"","",basis,subtotal,vat,total,lines,warnings,text);
 }
 private Extracted spreadsheet(byte[] bytes,Map<String,String> savedColumns)throws IOException{
  // Bound expanded ZIP content before handing OOXML to POI. No archive files are written.
  long expanded=0;int entries=0;try(var zip=new ZipInputStream(new ByteArrayInputStream(bytes))){while(zip.getNextEntry()!=null){if(++entries>2000)throw new IllegalArgumentException("This workbook has too many internal files.");byte[] block=new byte[8192];int n;while((n=zip.read(block))!=-1){expanded+=n;if(expanded>25L*1024*1024)throw new IllegalArgumentException("This workbook expands beyond the import limit.");}}}
  var rows=new ArrayList<List<String>>();var warnings=new ArrayList<String>();
  try(var book=new XSSFWorkbook(new ByteArrayInputStream(bytes))){
   if(book.getNumberOfSheets()==0)throw new IllegalArgumentException("The workbook has no sheets.");
   if(book.getNumberOfSheets()>1)warnings.add("Only the first worksheet was read. Import other sheets as separate files.");
   var formatter=new DataFormatter(Locale.US);int count=0;
   for(var row:book.getSheetAt(0)){if(++count>MAX_ROWS+20)throw new IllegalArgumentException("Import up to 500 item rows at a time.");if(row.getLastCellNum()>40)throw new IllegalArgumentException("Import a table with at most 40 columns.");var cells=new ArrayList<String>();for(int c=0;c<Math.max(0,row.getLastCellNum());c++){var cell=row.getCell(c);if(cell!=null&&cell.getCellType()==CellType.FORMULA){cells.add("");warnings.add("Spreadsheet row "+row.getRowNum()+": a formula was not evaluated. Enter its value in review.");}else cells.add(cell==null?"":cell.getCellType()==CellType.NUMERIC&&DateUtil.isCellDateFormatted(cell)?cell.getLocalDateTimeCellValue().toLocalDate().toString():formatter.formatCellValue(cell));}rows.add(cells);}
  }
  return table(rows,"xlsx",warnings,savedColumns);
 }
 private List<List<String>> csv(byte[] bytes){
  String text;try{text=StandardCharsets.UTF_8.newDecoder().onMalformedInput(CodingErrorAction.REPORT).decode(java.nio.ByteBuffer.wrap(bytes)).toString().replaceFirst("^\\uFEFF","");}catch(CharacterCodingException e){throw new IllegalArgumentException("Save CSV files as UTF-8 before importing.");}
  if(text.length()>MAX_TEXT)throw new IllegalArgumentException("This CSV contains too much text for one import.");
  char delimiter=text.lines().findFirst().orElse("").contains(";")?';':',';var rows=new ArrayList<List<String>>();var cells=new ArrayList<String>();var value=new StringBuilder();boolean quoted=false,closed=false;
  for(int i=0;i<text.length();i++){char c=text.charAt(i);if(quoted){if(c=='"'){if(i+1<text.length()&&text.charAt(i+1)=='"'){value.append('"');i++;}else{quoted=false;closed=true;}}else value.append(c);}else if(c=='"'&&value.isEmpty()&&!closed){quoted=true;}else if(c==delimiter){cells.add(value.toString());value.setLength(0);closed=false;}else if(c=='\n'||c=='\r'){if(c=='\r'&&i+1<text.length()&&text.charAt(i+1)=='\n')i++;cells.add(value.toString());rows.add(cells);cells=new ArrayList<>();value.setLength(0);closed=false;if(rows.size()>MAX_ROWS+20)throw new IllegalArgumentException("Import up to 500 item rows at a time.");}else{if(closed&&!Character.isWhitespace(c))throw new IllegalArgumentException("Check CSV quoting and separators.");value.append(c);}if(cells.size()>40)throw new IllegalArgumentException("Import a table with at most 40 columns.");}
  if(quoted)throw new IllegalArgumentException("The CSV contains an unclosed quoted field.");if(!value.isEmpty()||!cells.isEmpty()){cells.add(value.toString());rows.add(cells);}return rows;
 }
 private static final Map<String,List<String>> ALIASES=Map.ofEntries(
  Map.entry("description",List.of("description","itemdescription","product","item","productname")),Map.entry("packPrice",List.of("packprice","unitprice","price","cost","packcost","unitcost","priceexvat","costexvat")),Map.entry("sku",List.of("sku","itemnumber","itemcode","productcode","suppliercode","code")),Map.entry("quotedPacks",List.of("quantity","qty","quotedpacks","qtyord")),Map.entry("packLabel",List.of("uom","unit","pack","packlabel","packsize")),Map.entry("unitsPerPack",List.of("unitsperpack","packquantity")),Map.entry("supplier",List.of("supplier","suppliername","vendor")),Map.entry("reference",List.of("reference","quotereference","quotenumber")),Map.entry("quoteDate",List.of("quotedate","date")),Map.entry("validUntil",List.of("validuntil","expirydate")),Map.entry("terms",List.of("terms","paymentterms")),Map.entry("vatBasis",List.of("vatbasis","pricebasis")));
 private Extracted table(List<List<String>> rows,String format,List<String> initial,Map<String,String> savedColumns){
  Map<String,Integer> columns=new HashMap<>();int header=-1;
  for(int i=0;i<Math.min(rows.size(),20);i++){var mapping=new HashMap<String,Integer>();for(int c=0;c<rows.get(i).size();c++){String name=rows.get(i).get(c).toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]","");for(var key:ALIASES.keySet())if(savedColumns.getOrDefault(key,"").isBlank()?ALIASES.get(key).contains(name):savedColumns.get(key).toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]","").equals(name))mapping.putIfAbsent(key,c);}if(mapping.containsKey("description")&&mapping.containsKey("packPrice")){columns=mapping;header=i;break;}}
  if(header<0)throw new IllegalArgumentException("Add column headings Description and Pack price (or Unit price). Optional: SKU, Quantity, UOM, Units per pack, Supplier, Reference, Quote date, VAT basis.");
  var lines=new ArrayList<Map<String,Object>>();var warnings=new ArrayList<>(initial);List<String> first=List.of();
  for(int i=header+1;i<rows.size();i++){var row=rows.get(i);if(row.stream().allMatch(String::isBlank))continue;if(lines.size()>=MAX_ROWS)throw new IllegalArgumentException("Import up to 500 item rows at a time.");if(first.isEmpty())first=row;String description=cell(row,columns,"description");if(description.isBlank()){warnings.add("Source row "+(i+1)+" has no description and was not imported.");continue;}var parsed=line(cell(row,columns,"sku"),description,cell(row,columns,"quotedPacks"),cell(row,columns,"packPrice"),cell(row,columns,"packLabel"),cell(row,columns,"unitsPerPack"),i+1);if(format.equals("csv")&&row.size()>rows.get(header).size()){parsed.put("packPrice",null);warnings.add("Source row "+(i+1)+" has extra columns. Check its CSV separators and enter the price in review.");}lines.add(parsed);}
  String basis=cell(first,columns,"vatBasis").toLowerCase(Locale.ROOT);if(!List.of("exclusive","inclusive").contains(basis))basis="unknown";
  return result(format,cell(first,columns,"supplier"),cell(first,columns,"reference"),date(cell(first,columns,"quoteDate")),date(cell(first,columns,"validUntil")),cell(first,columns,"terms"),"",basis,null,null,null,lines,warnings,"");
 }
 private String cell(List<String> row,Map<String,Integer> columns,String key){Integer i=columns.get(key);return i==null||i>=row.size()?"":row.get(i).trim();}
 private Map<String,Object> line(String sku,String description,String quantity,String price,String unit,String units,int sourceRow){
  var l=new LinkedHashMap<String,Object>();l.put("sku",sku);l.put("description",description);l.put("packLabel",unit);l.put("quotedPacks",integer(quantity));l.put("packPrice",amount(price));Integer count=integer(units);if(count==null){var m=Pattern.compile("(?i)(?:box|disp|pkt|pack|carton|wallet)[- ]+(\\d+)").matcher(unit);if(m.matches())count=integer(m.group(1));else if(unit.equalsIgnoreCase("each"))count=1;}
  l.put("unitsPerPack",count);l.put("productId",null);l.put("matchType","unmatched");l.put("availability","Unconfirmed");l.put("leadTime","");l.put("sourceRow",sourceRow);return l;
 }
 private Extracted result(String f,String supplier,String reference,String date,String valid,String terms,String delivery,String basis,BigDecimal subtotal,BigDecimal vat,BigDecimal total,List<Map<String,Object>> lines,List<String> warnings,String source){
  var codes=new HashSet<String>();for(var l:lines){String sku=l.get("sku").toString();if(!sku.isBlank()&&!codes.add(sku))warnings.add("Repeated supplier code "+sku+" is preserved as a separate row.");Integer q=(Integer)l.get("quotedPacks");if(q!=null&&q>100)warnings.add("Check "+q+" whole packs for "+sku+"; this may represent many individual items.");}
  warnings.add("Check units per pack against your catalogue ordering unit. Pack counts are suggestions, not confirmed product matches.");if(basis.equals("unknown"))warnings.add("VAT basis was not identified. Choose whether the source prices include VAT before saving.");
  return new Extracted(f,supplier,reference,date,valid,terms,delivery,basis,subtotal,vat,total,lines,warnings.stream().distinct().limit(100).toList(),source);
 }
 static BigDecimal amount(String text){
  if(text==null||text.isBlank())return null;String s=text.trim().replaceAll("[Rr\\s\\u00a0]","");if(!s.matches("[0-9.,]+"))return null;int comma=s.lastIndexOf(','),dot=s.lastIndexOf('.');if(comma>=0&&dot>=0){if(comma>dot)s=s.replace(".","").replace(',','.');else s=s.replace(",","");}else if(comma>=0)s=s.replace(',','.');try{BigDecimal n=new BigDecimal(s);return n.scale()>4||n.compareTo(new BigDecimal("9999999999"))>0?null:n;}catch(NumberFormatException e){return null;}
 }
 private static Integer integer(String s){try{return s==null||s.isBlank()?null:new BigDecimal(s.trim().replace(",",".")).intValueExact();}catch(ArithmeticException|NumberFormatException e){return null;}}
 private String find(String text,String regex){var m=Pattern.compile(regex).matcher(text);return m.find()?m.group(1):"";}
 private String date(String value){for(String pattern:List.of("uuuu-MM-dd","d/M/uuuu","d-M-uuuu","MMM d, uuuu","MMM d uuuu","MMMM d, uuuu","MMMM d uuuu")){try{return LocalDate.parse(value,new DateTimeFormatterBuilder().parseCaseInsensitive().appendPattern(pattern).toFormatter(Locale.ENGLISH).withResolverStyle(ResolverStyle.STRICT)).toString();}catch(DateTimeParseException ignored){}}return "";}
}
