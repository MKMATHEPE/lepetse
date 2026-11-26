package za.co.lepetse.admin;
import org.junit.jupiter.api.Test;
import org.apache.pdfbox.pdmodel.*;
import org.apache.pdfbox.pdmodel.font.*;
import java.io.ByteArrayOutputStream;
import java.util.List;
import static org.assertj.core.api.Assertions.*;
class TenderRequirementExtractorTest {
 @Test void adjacentRequirementsDoNotLeakCategoriesOrSignatureFlags()throws Exception{
  byte[] bytes;try(var pdf=new PDDocument()){var page=new PDPage();pdf.addPage(page);try(var stream=new PDPageContentStream(pdf,page)){stream.beginText();stream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA),11);stream.newLineAtOffset(40,720);for(String line:List.of("Mandatory: bidders must submit a current CSD report.","All bidders must submit a signed SBD 4 declaration.","A compulsory briefing must be attended.","Submission must be through the procurement portal.","Evaluation criteria: functionality must meet the threshold.")){stream.showText(line);stream.newLineAtOffset(0,-24);}stream.endText();}var out=new ByteArrayOutputStream();pdf.save(out);bytes=out.toByteArray();}
  var result=new TenderRequirementExtractor().extract(bytes);assertThat(result.suggestions()).hasSize(5);assertThat(result.suggestions().stream().map(TenderRequirementExtractor.Suggestion::category).toList()).containsExactly("document","document","briefing","submission","evaluation");assertThat(result.suggestions().getFirst().signatureRequired()).isFalse();assertThat(result.suggestions().get(1).signatureRequired()).isTrue();assertThat(result.suggestions().getFirst().excerpt()).doesNotContain("SBD");
 }
}
