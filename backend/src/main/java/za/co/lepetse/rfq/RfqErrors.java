package za.co.lepetse.rfq;

import java.io.IOException;
import java.util.Map;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice(assignableTypes=RfqController.class)
class RfqErrors {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<?> invalid(MethodArgumentNotValidException e){return ResponseEntity.badRequest().body(Map.of("message","Please check your contact, item and delivery details before submitting."));}
    @ExceptionHandler(ResponseStatusException.class)
    ResponseEntity<?> rejected(ResponseStatusException e){return ResponseEntity.status(e.getStatusCode()).body(Map.of("message",e.getReason()==null?"Unable to submit this request.":e.getReason()));}
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    ResponseEntity<?> tooLarge(){return ResponseEntity.status(413).body(Map.of("message","Choose up to five documents, each no larger than 10 MB."));}
    @ExceptionHandler({IOException.class,org.springframework.dao.DataAccessException.class})
    ResponseEntity<?> unavailable(){return ResponseEntity.status(503).body(Map.of("message","The request could not be saved. Your details are still on this page. Please try again."));}
}
