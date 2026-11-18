package za.co.lepetse.rfq;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

public record RfqRequest(
        @NotBlank @Pattern(regexp="catalogue|document") String source,
        @NotNull @Valid Buyer buyer,
        @NotNull @Size(max=250) List<@NotNull @Valid Item> items,
        @NotNull @Size(min=1,max=50) List<@NotNull @Valid Delivery> deliveries) {
    public record Buyer(
            @NotBlank @Size(max=250) String organisation,
            @NotBlank @Size(max=150) String contact,
            @NotBlank @Email @Size(max=254) String email,
            @Size(max=40) String phone,
            @NotBlank @Pattern(regexp="business|government") String buyerType,
            @NotBlank @Pattern(regexp="once_off|repeat|scheduled_repeat") String purchaseType,
            @Size(max=120) String reference,
            @Future OffsetDateTime deadline,
            @Size(max=1000) String channel,
            @Size(max=2000) String briefing,
            @Size(max=120) String previousReference,
            @Size(max=120) String poNumber,
            @Size(max=120) String costCentre,
            @NotBlank @Size(max=120) String alternatives,
            @Size(max=10000) String notes,
            @Size(max=30) String scheduleFrequency,
            @Size(max=120) String scheduleCustom,
            LocalDate scheduleStart,
            @Size(max=30) String scheduleEndRule,
            LocalDate scheduleEnd) {}
    public record Item(
            @Size(max=120) String productId,
            @NotBlank @Size(max=4000) String description,
            @NotNull @Min(1) @Max(999999) Integer quantity,
            @NotBlank @Size(max=250) String unit) {}
    public record Delivery(
            @Size(max=250) String street,
            @Size(max=250) String building,
            @Size(max=250) String suburb,
            @NotBlank @Size(max=250) String town,
            @NotBlank @Pattern(regexp="Eastern Cape|Free State|Gauteng|KwaZulu-Natal|Limpopo|Mpumalanga|North West|Northern Cape|Western Cape") String province,
            @NotBlank @Pattern(regexp="[0-9]{4}") String postcode,
            @NotBlank @Size(max=150) String contact,
            @Size(max=40) String phone,
            @Size(max=2000) String instructions,
            @NotNull LocalDate requiredDate,
            @NotBlank @Pattern(regexp="fixed|flexible") String flexibility) {}
}
