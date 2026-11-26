package za.co.lepetse.admin;

import java.util.Map;
import org.springframework.dao.DataAccessException;
import org.springframework.http.*;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.server.ResponseStatusException;

/** Do not echo rejected private-note values into validation responses or logs. */
@RestControllerAdvice(assignableTypes={AdminTenderApplications.class,AdminOpportunitySearches.class,AdminOpportunities.class,AdminRfqController.class,AdminWorkspaceController.class,AdminSupplierController.class,AdminComparisonController.class,AdminQuoteImportController.class,AdminPricingWorkflow.class})
class AdminErrors {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<?> invalidNote(MethodArgumentNotValidException e){return ResponseEntity.badRequest().body(Map.of("message",e.getBindingResult().getTarget() instanceof AdminRfqController.InternalNote?"Enter a non-empty note of up to 4,000 characters.":"Check the required fields and allowed amounts."));}
    @ExceptionHandler({HttpMessageNotReadableException.class,HandlerMethodValidationException.class})
    ResponseEntity<?> invalidRequest(){return ResponseEntity.badRequest().body(Map.of("message","Check your request details, response target or filters."));}
    @ExceptionHandler(ResponseStatusException.class)
    ResponseEntity<?> rejected(ResponseStatusException e){return ResponseEntity.status(e.getStatusCode()).body(Map.of("message",e.getReason()==null?"Unable to complete this action.":e.getReason()));}
    @ExceptionHandler(org.springframework.web.multipart.MaxUploadSizeExceededException.class)
    ResponseEntity<?> oversized(){return ResponseEntity.status(413).body(Map.of("message","Choose a file no larger than 10 MB."));}
    @ExceptionHandler(DataAccessException.class)
    ResponseEntity<?> unavailable(){return ResponseEntity.status(503).body(Map.of("message","Unable to save or load this request. Your unsaved note stays on this page. Please try again."));}
}
