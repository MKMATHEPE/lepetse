package za.co.lepetse.rfq;

import jakarta.validation.Valid;
import java.io.IOException;
import java.util.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/rfqs")
public class RfqController {
    private final RfqService service;
    public RfqController(RfqService service){this.service=service;}
    @PostMapping(consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RfqService.Receipt> submit(@RequestHeader("Idempotency-Key") UUID key,
            @Valid @RequestPart("request") RfqRequest request,
            @RequestPart(value="files",required=false) List<MultipartFile> files) throws IOException {
        return ResponseEntity.status(HttpStatus.CREATED).cacheControl(CacheControl.noStore()).body(service.submit(key,request,files==null?List.of():files));
    }
}
