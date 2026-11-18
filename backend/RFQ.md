# RFQ submission

Implemented locally on 18 November 2026. This is business/government quotation intake, not order acceptance, a government bid submission or a payment flow. Staff pricing, notifications and email remain separate future work.

## Request and receipt

`POST /api/rfqs` accepts multipart form data:

- `Idempotency-Key`: a random UUID for one logical submission. The browser retains this in memory for retries of an unchanged request.
- `request`: JSON part with `Content-Type: application/json`, containing `source` (`catalogue` or `document`), `buyer`, `items` and `deliveries`. See `RfqRequest.java` for bounded fields and validation.
- `files`: zero to five file parts, maximum 10 MB each. Document-only enquiries require at least one file. Catalogue enquiries require items or files.

Successful requests return HTTP 201 with `reference`, `status: submitted`, `receivedAt`, `itemCount` and `attachmentCount`. No customer details, storage keys or prices are returned. There is no public RFQ lookup or attachment download endpoint. A reference is a receipt identifier, not an access credential.

The server validates business/government buyer type, positive whole quantities, delivery province/postcode, requested dates and mandatory government reference/deadline/submission instructions. Catalogue enquiries require full physical delivery addresses and contact numbers. The shorter document form may provide locality only; those rows are marked `address_complete=false` for later follow-up. The complete validated requirement snapshot retains optional purchase-order, cost-centre, alternative-brand and schedule instructions. Repeat requests are recorded only; no scheduled orders or charges are activated.

All customer, RFQ, item, delivery and attachment metadata writes form one PostgreSQL transaction. A sequence supplies references such as `RFQ-20261118-000005`; gaps are normal after rollbacks. A per-key transaction lock serialises concurrent retries, and the unique submission key prevents duplicates. Reusing a key with changed contents returns 409. A lost response can be retried safely with the same key. Refreshing clears the browser's contact information and retry-key memory; this is not cross-session duplicate detection.

## Documents

Configure `RFQ_STORAGE_DIRECTORY` to a private, persistent directory outside web resources. Local default: `backend/var/rfq-files`, ignored by Git. Files receive random storage names rather than browser-supplied paths. On POSIX filesystems the directory is owner-only and files are owner-readable/writable. File extension and basic content signatures are checked; Office ZIP containers have entry and expanded-size limits. CSV input must be UTF-8 text.

Every document is stored with `scan_status=pending` and a SHA-256 digest. These checks are not malware scanning. No automatic opening, rendering, email forwarding or download is implemented. A scanner and protected staff review flow must be added before documents can be released. If persistence fails, the database transaction rolls back and stored files are removed where possible. A process crash or deletion failure can leave an orphan; production operations need a reconciliation task and retention policy.

For public launch, configure private persistent storage, backups, retention rules, request-rate controls and authenticated staff access. No public backend has been provisioned by this change. Keep test database and test-upload directories separate from real customer data.

## Frontend behaviour

Spring Boot's runtime config enables `rfqSubmission`. The final catalogue review uses **Submit RFQ**; the shorter document journey adds that action after the existing review. Errors leave entered details available on the page. A successful save displays a reference and downloadable HTML receipt. The basket is retained on the device; it is not cleared as a side effect of submission. Schools and other buyer types retain their existing preparation flow.

The static Sites/Vercel prototype does not enable submission and continues to use its preparation/download flow. No email service is connected. No confirmation email is claimed or sent. The local API-enabled privacy page describes the submission/storage behaviour.

## Verification

Ten integration tests passed against isolated PostgreSQL 17.5. New tests cover business persistence and replay, changed-payload conflict, government details, pending/private attachment metadata, invalid buyers and quantities, document-only requests, disguised files, and rollback after a simulated storage failure. Existing catalogue/import tests continue to pass.

Browser verification completed the catalogue review → POST → saved RFQ → receipt journey. The displayed reference `RFQ-20261118-000005` was confirmed directly in PostgreSQL with 11 item rows and one delivery row. There were no browser console errors. The government document-upload browser check was interrupted at the file chooser; do not count that journey as browser-verified. Multipart upload coverage is from the passing integration tests.
