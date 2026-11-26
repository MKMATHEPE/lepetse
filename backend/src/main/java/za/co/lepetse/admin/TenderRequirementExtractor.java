package za.co.lepetse.admin;

import java.util.*;
import java.util.regex.Pattern;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Component;

/** Conservative local suggestions with original page evidence; never a compliance decision. */
@Component
public class TenderRequirementExtractor {
 public record Suggestion(String title,String category,boolean mandatory,boolean signatureRequired,int page,String excerpt) {}
 public record Extraction(List<Suggestion> suggestions,String warning) {}
 private static final Pattern CUE=Pattern.compile("(?i)\\b(must|mandatory|required|compulsory|shall|SBD\\s*\\d|CSD|B.?BBEE|tax compliance|closing date|closing time|briefing|evaluation criteria|functionality|submit|submission|signature|signed)\\b");
 public Extraction extract(byte[] bytes)throws java.io.IOException{
  try(var pdf=Loader.loadPDF(bytes)){
   if(pdf.isEncrypted())throw new IllegalArgumentException("Use an unencrypted PDF.");
   if(pdf.getNumberOfPages()>200)throw new IllegalArgumentException("Use a PDF with no more than 200 pages.");
   var stripper=new PDFTextStripper();stripper.setSortByPosition(true);
   var found=new ArrayList<Suggestion>();var seen=new HashSet<String>();int chars=0;
   for(int page=1;page<=pdf.getNumberOfPages();page++){
    stripper.setStartPage(page);stripper.setEndPage(page);String text=stripper.getText(pdf);chars+=text.trim().length();
    if(chars>1_500_000)throw new IllegalArgumentException("This PDF contains too much text. Upload the relevant tender sections.");
    var lines=text.split("\\R");
    for(int i=0;i<lines.length;i++){
     String line=lines[i].trim().replaceAll("\\s+"," ");if(line.length()<8||!CUE.matcher(line).find())continue;
     String excerpt=line;if(i+1<lines.length&&!lines[i+1].isBlank()&&!CUE.matcher(lines[i+1]).find())excerpt+=" "+lines[i+1].trim();if(excerpt.length()>1400)excerpt=excerpt.substring(0,1400);
     String key=line.toLowerCase(Locale.ROOT);if(!seen.add(key))continue;
     String lower=line.toLowerCase(Locale.ROOT),category=lower.matches(".*\\b(briefing|site visit)\\b.*")?"briefing":lower.matches(".*\\b(evaluation|functionality|scoring|points)\\b.*")?"evaluation":lower.matches(".*\\b(sbd|csd|certificate|document|declaration|tax|bbbee|b-bbee|signed|signature)\\b.*")?"document":lower.matches(".*\\b(submit|submission|closing|tender box|email address)\\b.*")?"submission":"eligibility";
     boolean required=Pattern.compile("(?i)\\b(must|mandatory|required|compulsory|shall)\\b").matcher(line).find();
     boolean signed=Pattern.compile("(?i)\\b(sign|signed|signature)\\b").matcher(line).find();
     found.add(new Suggestion(line.substring(0,Math.min(250,line.length())),category,required,signed,page,excerpt));
     if(found.size()>=80)return new Extraction(found,"Showing the first 80 suggestions. Review every page of the original tender for additional requirements.");
    }
   }
   if(chars<40)return new Extraction(List.of(),"This PDF has little readable text. Add requirements manually or upload a text-based PDF; scanned pages need OCR.");
   return new Extraction(found,"Suggestions only. Review wording, page references, deadlines and mandatory status against the original PDF. Extraction may miss requirements.");
  }
 }
}
