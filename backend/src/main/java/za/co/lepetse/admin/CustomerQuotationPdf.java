package za.co.lepetse.admin;
import java.io.*;
import java.math.*;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.awt.Color;
import org.apache.pdfbox.pdmodel.*;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.*;
/** Uses only the immutable customer-facing projection, shared by download and email attachment. */
final class CustomerQuotationPdf implements AutoCloseable {
 static final Map<String,String> BANKING=Map.of("accountHolder","LEPETSE BUSINESS ENTERPRISE AND PROJECT","bank","FNB","accountNumber",System.getenv().getOrDefault("QUOTATION_BANK_ACCOUNT_NUMBER",""),"branchName","IRENE MALL SERVICE CENTRE","branchCode","210529","swiftCode","FIRNZAJJ");
 static final float LEFT=34,RIGHT=808,TOP=555,BOTTOM=42;
 static final Color INK=new Color(42,45,50),MUTED=new Color(125,128,136),RULE=new Color(228,230,234),GOLD=new Color(177,142,65);
 final PDDocument doc=new PDDocument();final PDFont regular=new PDType1Font(Standard14Fonts.FontName.HELVETICA),bold=new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
 PDPageContentStream stream;float y;String reference="";
 CustomerQuotationPdf(){}
 void page()throws IOException{if(stream!=null)stream.close();var page=new PDPage(new PDRectangle(PDRectangle.A4.getHeight(),PDRectangle.A4.getWidth()));doc.addPage(page);stream=new PDPageContentStream(doc,page);y=TOP;}
 String clean(Object value){String s=Objects.toString(value,"");var out=new StringBuilder();for(char c:s.toCharArray()){if(c=='\r'||c=='\n'||c=='\t')c=' ';try{regular.encode(String.valueOf(c));out.append(c);}catch(Exception e){out.append(c=='—'||c=='–'?'-':'?');}}return out.toString();}
 float width(String s,PDFont font,float size)throws IOException{return font.getStringWidth(s)/1000*size;}
 void text(Object value,float x,float baseline,float size,boolean strong,Color color)throws IOException{stream.beginText();stream.setNonStrokingColor(color);stream.setFont(strong?bold:regular,size);stream.newLineAtOffset(x,baseline);stream.showText(clean(value));stream.endText();}
 void right(Object value,float edge,float baseline,float size,boolean strong,Color color)throws IOException{String s=clean(value);text(s,edge-width(s,strong?bold:regular,size),baseline,size,strong,color);}
 void rule(float baseline)throws IOException{stream.setStrokingColor(RULE);stream.setLineWidth(.6f);stream.moveTo(LEFT,baseline);stream.lineTo(RIGHT,baseline);stream.stroke();}
 List<String> wrap(Object value,float max,float size,boolean strong)throws IOException{
  PDFont font=strong?bold:regular;var result=new ArrayList<String>();
  for(String paragraph:Objects.toString(value,"").split("\\R",-1)){String line="";for(String word:clean(paragraph).split(" +")){if(word.isBlank())continue;
   if(!line.isEmpty()&&width(line+" "+word,font,size)>max){result.add(line);line="";}
   while(width(word,font,size)>max){int end=1;while(end<word.length()&&width(word.substring(0,end+1),font,size)<=max)end++;if(!line.isEmpty()){result.add(line);line="";}result.add(word.substring(0,end));word=word.substring(end);}
   line+=line.isEmpty()?word:" "+word;
  }result.add(line);}return result;
 }
 float block(Object value,float x,float baseline,float max,float size,boolean strong,Color color)throws IOException{for(String line:wrap(value,max,size,strong)){text(line,x,baseline,size,strong,color);baseline-=14;}return baseline;}
 void section(String label,float x,float baseline)throws IOException{text(label,x,baseline,9,true,MUTED);stream.setStrokingColor(GOLD);stream.setLineWidth(1.5f);stream.moveTo(x,baseline-12);stream.lineTo(x+24,baseline-12);stream.stroke();}
 String money(Object value){var format=new java.text.DecimalFormat("#,##0.00",java.text.DecimalFormatSymbols.getInstance(Locale.US));format.setGroupingSize(3);return "R "+format.format(new BigDecimal(value.toString()).setScale(2,RoundingMode.HALF_UP)).replace(',',' ').replace('.',',');}
 String date(Object value){if(value==null)return "—";LocalDate d;if(value instanceof java.sql.Timestamp t)d=t.toInstant().atZone(ZoneId.of("Africa/Johannesburg")).toLocalDate();else if(value instanceof java.sql.Date t)d=t.toLocalDate();else{String s=value.toString();try{d=Instant.parse(s).atZone(ZoneId.of("Africa/Johannesburg")).toLocalDate();}catch(Exception e){d=LocalDate.parse(s.substring(0,10));}}return d.format(DateTimeFormatter.ofPattern("dd MMM uuuu",Locale.ENGLISH));}
 void footer()throws IOException{rule(28);text("LEPETSE · Business Enterprise and Projects (Pty) Ltd",LEFT,16,7,false,MUTED);right(reference+" · "+doc.getNumberOfPages(),RIGHT,16,7,false,MUTED);}
 void next()throws IOException{footer();page();text(reference+" · continued",LEFT,y,11,true,INK);y-=27;}
 void tableHeader()throws IOException{String[] labels={"Description","Qty / unit","Price excl. VAT","Total excl. VAT"};float[] positions={LEFT,372,490,RIGHT};for(int i=0;i<3;i++)text(labels[i],positions[i],y,9,true,MUTED);right(labels[3],RIGHT,y,9,true,MUTED);y-=13;rule(y);y-=20;}
 @SuppressWarnings("unchecked") void header(Map<String,Object> q)throws IOException{
  reference=Objects.toString(q.get("reference"),"");page();text("Customer quotation",LEFT,y,9,false,MUTED);right(reference,RIGHT,y,18,true,INK);text("Admin@lepetse.co.za · Tel: 084 030 3307 or 063 140 5757",LEFT,y-14,8,false,MUTED);y-=27;rule(y);y-=26;
  var customer=(Map<String,Object>)q.getOrDefault("customer",Map.of());var buyer=customer.get("buyer") instanceof Map<?,?> b?b:Map.of();
  float baseline=y;section("CUSTOMER",LEFT,baseline);section("DELIVERY ADDRESS",288,baseline);section("QUOTATION DETAILS",572,baseline);baseline-=33;
  var columns=new ArrayList<List<List<HeaderText>>>();
  var recipient=new ArrayList<List<HeaderText>>();headerLines(recipient,buyer.get("organisation"),LEFT,230,12,true,INK);headerLines(recipient,buyer.get("contact"),LEFT,230,10,false,INK);headerLines(recipient,buyer.get("email"),LEFT,230,9,false,MUTED);columns.add(recipient);
  var addresses=new ArrayList<List<HeaderText>>();
  if(customer.get("deliveries") instanceof List<?> locations&&!locations.isEmpty())for(Object location:locations){var d=(Map<String,Object>)location;for(List<String> keys:List.of(List.of("building","street","suburb"),List.of("city","province","postal_code"))){String address=String.join(", ",keys.stream().map(k->Objects.toString(d.get(k),"")).filter(v->!v.isBlank()).toList());headerLines(addresses,address,288,250,10,false,INK);}if(locations.size()>1)addresses.add(List.of());}
  else headerLines(addresses,"Not supplied",288,250,10,false,INK);columns.add(addresses);
  var details=new ArrayList<List<HeaderText>>();String[] labels={"Quotation date","Valid until","RFQ"};String[] values={date(q.get("created_at")),date(q.get("valid_until")),Objects.toString(customer.get("requestReference"),"")};
  for(int i=0;i<3;i++){var valueLines=wrap(values[i],145,9,false);for(int n=0;n<valueLines.size();n++)details.add(List.of(new HeaderText(n==0?labels[i]:"",572,9,false,MUTED),new HeaderText(valueLines.get(n),663,9,false,INK)));}columns.add(details);
  int count=columns.stream().mapToInt(List::size).max().orElse(0);y=baseline;
  for(int n=0;n<count;n++){if(y<BOTTOM+30)next();for(var column:columns)if(n<column.size())for(var cell:column.get(n))text(cell.text(),cell.x(),y,cell.size(),cell.strong(),cell.color());y-=17;}
  y-=28;if(y<BOTTOM+65)next();tableHeader();
 }
 record HeaderText(String text,float x,float size,boolean strong,Color color){}
 void headerLines(List<List<HeaderText>> rows,Object value,float x,float max,float size,boolean strong,Color color)throws IOException{for(String line:wrap(value,max,size,strong))rows.add(List.of(new HeaderText(line,x,size,strong,color)));}
 void item(Map<String,Object> item)throws IOException{
  var cells=List.of(wrap(item.get("description"),318,10,false),wrap(item.get("quantity")+" × "+item.get("ordering_unit"),103,10,false),wrap(money(item.get("unit_price_ex_vat")),135,10,false),wrap(money(item.get("lineTotal")),138,9,false));
  int total=cells.stream().mapToInt(List::size).max().orElse(1),offset=0;
  while(offset<total){int capacity=(int)((y-BOTTOM-18)/14);if(capacity<1){next();tableHeader();capacity=(int)((y-BOTTOM-18)/14);}int take=Math.min(total-offset,capacity);
   for(int n=0;n<take;n++){int k=offset+n;float lineY=y-n*14;for(int c=0;c<4;c++)if(k<cells.get(c).size()){String line=cells.get(c).get(k);if(c==3)right(line,RIGHT,lineY,9,false,MUTED);else text(line,new float[]{LEFT,372,490}[c],lineY,10,false,INK);}}
   y-=take*14+8;rule(y);y-=12;offset+=take;
  }
 }
 void totals(Map<String,Object> q)throws IOException{if(y<BOTTOM+110)next();y-=4;String[] labels={"Goods excl. VAT","Transport excl. VAT","VAT","Total"};Object[] values={q.get("subtotal"),q.get("delivery_ex_vat"),q.get("vatTotal"),q.get("total")};for(int i=0;i<4;i++){text(labels[i],465,y,11,false,INK);right(money(values[i]),RIGHT,y,i==3?18:11,i==3,INK);y-=i==3?33:25;}}
 void termsAndBanking(Object value)throws IOException{
  var termLines=wrap(value,365,10,false);
  if(y<BOTTOM+95)next();float top=y;
  text("Terms",LEFT,top,12,true,INK);text("Banking details",465,top,12,true,INK);
  float bankY=top-24;
  String[] bankLines={"Account holder: "+BANKING.get("accountHolder"),"Bank: "+BANKING.get("bank"),"Account number: "+BANKING.get("accountNumber"),"Branch: "+BANKING.get("branchName"),"Branch code: "+BANKING.get("branchCode")+" · SWIFT: "+BANKING.get("swiftCode")};
  for(String line:bankLines)for(String part:wrap(line,RIGHT-465,9,false)){text(part,465,bankY,9,false,INK);bankY-=13;}
  int startPage=doc.getNumberOfPages();float ty=top-24;
  for(String line:termLines){if(ty<BOTTOM+12){next();ty=y;}text(line,LEFT,ty,10,false,INK);ty-=15;}
  y=doc.getNumberOfPages()==startPage?Math.min(ty,bankY):ty;
 }
 @SuppressWarnings("unchecked") static byte[] render(Map<String,Object> q)throws IOException{try(var pdf=new CustomerQuotationPdf();var out=new ByteArrayOutputStream()){pdf.header(q);for(var item:(List<Map<String,Object>>)q.get("items"))pdf.item(item);pdf.totals(q);pdf.termsAndBanking(q.get("terms"));pdf.footer();pdf.stream.close();pdf.stream=null;pdf.doc.save(out);return out.toByteArray();}}
 public void close()throws IOException{if(stream!=null)stream.close();doc.close();}
}
