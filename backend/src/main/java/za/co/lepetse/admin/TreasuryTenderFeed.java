package za.co.lepetse.admin;
import com.fasterxml.jackson.databind.*;
import org.springframework.stereotype.Component;
import java.net.*;
import java.net.http.*;
import java.time.*;
import java.util.*;

/** Uses only the official, fixed-host public API. Document links are never fetched. */
@Component
public class TreasuryTenderFeed {
 static final String BASE="https://ocds-api.etenders.gov.za/api/OCDSReleases";
 private final ObjectMapper mapper;private final HttpClient client=HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(15)).followRedirects(HttpClient.Redirect.NEVER).build();
 public TreasuryTenderFeed(ObjectMapper mapper){this.mapper=mapper;}
 public record Batch(List<JsonNode> releases,boolean complete) {}
 interface PageReader {JsonNode read(int page,int size)throws Exception;}
 public Batch fetch(LocalDate from,LocalDate to)throws Exception{return collect((page,size)->page(from,to,page,size));}
 static Batch collect(PageReader reader)throws Exception{
  var releases=new ArrayList<JsonNode>();long stopAt=System.nanoTime()+Duration.ofMinutes(2).toNanos();
  int size=50,page=1,failedInARow=0;boolean incomplete=false;
  while(page<=3000){
   if(System.nanoTime()>stopAt)return new Batch(releases,false);
   JsonNode json;
   try{json=reader.read(page,size);}catch(Exception e){
    if(size>2){size=2;page=releases.size()/2+1;continue;}
    incomplete=true;failedInARow++;page++;
    if(failedInARow>=3){if(releases.isEmpty())throw e;return new Batch(releases,false);}
    continue;
   }
   failedInARow=0;JsonNode items=json.path("releases");items.forEach(releases::add);
   if(items.size()<size||json.path("links").path("next").asText().isBlank())return new Batch(releases,!incomplete);
   page++;
  }
  return new Batch(releases,false);
 }
 private JsonNode page(LocalDate from,LocalDate to,int page,int size)throws Exception{
  var uri=URI.create(BASE+"?PageNumber="+page+"&PageSize="+size+"&dateFrom="+from+"&dateTo="+to);Exception failure=null;
  for(int attempt=0;attempt<4;attempt++){
   if(attempt>0)Thread.sleep(1000L*attempt);
   try{
    var response=client.send(HttpRequest.newBuilder(uri).timeout(Duration.ofSeconds(30)).header("Accept","application/json").header("User-Agent","LepetseTenderDiscovery/1.0").GET().build(),HttpResponse.BodyHandlers.ofInputStream());
    try(var body=response.body()){
     if(response.statusCode()!=200){if(response.statusCode()<500&&response.statusCode()!=429)throw new IllegalStateException("Treasury returned HTTP "+response.statusCode());throw new java.io.IOException("Treasury returned HTTP "+response.statusCode());}
     byte[] bytes=body.readNBytes(12_000_001);if(bytes.length>12_000_000)throw new IllegalStateException("Tender response exceeded the safe size limit");
     JsonNode json=mapper.readTree(bytes);if(!json.path("releases").isArray())throw new java.io.IOException("Treasury response did not contain releases");return json;
    }
   }catch(java.io.IOException e){failure=e;}
  }
  throw failure;
 }
}
