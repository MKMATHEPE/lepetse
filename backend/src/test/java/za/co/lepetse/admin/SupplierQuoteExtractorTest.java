package za.co.lepetse.admin;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import java.nio.charset.StandardCharsets;
import java.io.*;
import java.nio.file.*;
import org.apache.pdfbox.pdmodel.*;
import org.apache.pdfbox.pdmodel.font.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import static org.assertj.core.api.Assertions.*;
class SupplierQuoteExtractorTest {
 final SupplierQuoteExtractor extractor=new SupplierQuoteExtractor();
 byte[] pdf(String... lines)throws Exception{try(var doc=new PDDocument();var out=new ByteArrayOutputStream()){var page=new PDPage();doc.addPage(page);try(var text=new PDPageContentStream(doc,page)){text.beginText();text.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA),10);text.setLeading(15);text.newLineAtOffset(30,750);for(String line:lines){text.showText(line);text.newLine();}text.endText();}doc.save(out);return out.toByteArray();}}
 @Test void customSupplierColumnsAreReusedWithoutChangingOtherSuppliers()throws Exception{byte[] csv="Article,Trade amount,Vendor ref,Carton\nBlue pens,170.00,PEN-1,Box-50\n".getBytes(StandardCharsets.UTF_8);var mapping=java.util.Map.of("description","Article","packPrice","Trade amount","sku","Vendor ref","packLabel","Carton");var result=extractor.extract(csv,"prices.csv",mapping);assertThat(result.lines()).hasSize(1);assertThat(result.lines().getFirst().get("sku")).isEqualTo("PEN-1");assertThat(result.lines().getFirst().get("unitsPerPack")).isEqualTo(50);assertThatThrownBy(()->extractor.extract(csv,"prices.csv")).isInstanceOf(IllegalArgumentException.class);}
 @Test void pdfExtractsWrappedDescriptionsDuplicateCodesPackCountsAndTotals()throws Exception{
  var x=extractor.extract(pdf("Example Supplier Quotation","Nov 18, 2026","QT1234567","1 43-1851-02 Blue pens 189,00 Box-60 189,00","1 43-1851-02 More blue pens 189,00 Box-60 189,00","230 66-0408-00 Maths set 219,60 Box-12 50 508,00","continued description","Subtotal 50886,00","Total sales tax 7632,90","Total order 58518,90"),"quote.pdf");
  assertThat(x.supplier()).isEqualTo("Example Supplier");assertThat(x.reference()).isEqualTo("QT1234567");assertThat(x.quoteDate()).isEqualTo("2026-11-18");assertThat(x.lines()).hasSize(3);assertThat(x.vatBasis()).isEqualTo("exclusive");assertThat(x.lines().get(0).get("unitsPerPack")).isEqualTo(60);assertThat(x.lines().get(2).get("description")).asString().contains("continued description");assertThat(x.warnings()).anyMatch(s->s.contains("Repeated supplier code")).anyMatch(s->s.contains("230 whole packs"));
 }
 @Test void csvSupportsQuotedDescriptionsSemicolonAndDecimalCommaWithoutInventingMissingValues()throws Exception{
  String csv="Supplier;Reference;Quote date;SKU;Description;Quantity;Unit price;UOM;VAT basis\r\nExample;Q-1;2026-11-18;P1;\"Blue, fine pens\";2;189,00;Box-60;exclusive\r\nExample;Q-1;2026-11-18;;Glue;;12,50;;exclusive\r\n";
  var x=extractor.extract(csv.getBytes(StandardCharsets.UTF_8),"quote.csv");assertThat(x.lines()).hasSize(2);assertThat(x.lines().get(0).get("packPrice")).asString().isEqualTo("189.00");assertThat(x.lines().get(0).get("description")).isEqualTo("Blue, fine pens");assertThat(x.lines().get(1).get("quotedPacks")).isNull();assertThat(x.lines().get(1).get("unitsPerPack")).isNull();assertThat(x.quoteDate()).isEqualTo("2026-11-18");
 }
 @Test void workbookReadsFirstSheetAndDoesNotEvaluateFormulaPrices()throws Exception{
  byte[] bytes;try(var book=new XSSFWorkbook();var out=new ByteArrayOutputStream()){var sheet=book.createSheet("Quote");var h=sheet.createRow(0);String[] names={"SKU","Description","Quantity","Price","UOM"};for(int i=0;i<names.length;i++)h.createCell(i).setCellValue(names[i]);var r=sheet.createRow(1);r.createCell(0).setCellValue("X-1");r.createCell(1).setCellValue("Pens");r.createCell(2).setCellValue(1);r.createCell(3).setCellFormula("100*2");r.createCell(4).setCellValue("Box-60");book.createSheet("Not imported");book.write(out);bytes=out.toByteArray();}
  var x=extractor.extract(bytes,"quote.xlsx");assertThat(x.lines()).hasSize(1);assertThat(x.lines().getFirst().get("packPrice")).isNull();assertThat(x.warnings()).anyMatch(s->s.contains("formula")).anyMatch(s->s.contains("first worksheet"));
 }
 @Test void blankPdfInvalidCsvAndUnsupportedFilesAreRejected()throws Exception{
  assertThatThrownBy(()->extractor.extract(pdf(" "),"scan.pdf")).isInstanceOf(IllegalArgumentException.class).hasMessageContaining("no readable text");
  assertThatThrownBy(()->extractor.extract("Description,Price\n\"broken,1".getBytes(),"quote.csv")).isInstanceOf(IllegalArgumentException.class).hasMessageContaining("unclosed");
  assertThatThrownBy(()->extractor.extract("<script>".getBytes(),"quote.html")).isInstanceOf(IllegalArgumentException.class).hasMessageContaining("PDF, XLSX");
 }
 @Test @EnabledIfEnvironmentVariable(named="LEPETSE_SUPPLIER_SAMPLE",matches=".+") void suppliedPdfReconcilesAllRowsToPrintedSubtotal()throws Exception{
  var x=extractor.extract(Files.readAllBytes(Path.of(System.getenv("LEPETSE_SUPPLIER_SAMPLE"))),"sample.pdf");
  assertThat(x.lines()).hasSize(44);assertThat(x.subtotal()).isEqualByComparingTo("55702.24");assertThat(x.total()).isEqualByComparingTo("64057.61");assertThat(x.vatBasis()).isEqualTo("exclusive");
  assertThat(x.warnings()).noneMatch(w->w.contains("do not match"));
 }
}
