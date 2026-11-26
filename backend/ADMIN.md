# Private admin sign-in and RFQ inbox

Implemented and tested locally on 18 November 2026. This phase provides sign-in, an RFQ inbox, request details and a **Mark as reviewing** action. Pricing, quotation documents, email delivery and attachment downloads remain separate future work. The public website layout is unchanged.

## Open the workspace

Run the Spring Boot application using the database setup in `README.md`, then open:

`http://127.0.0.1:8080/admin/`

The admin area is served only by Spring Boot, not by the static Sites/Vercel prototype. Unauthenticated requests to admin pages redirect to sign-in; private API calls return 401. No real owner account, default password or public registration flow is supplied.

## Create your owner account

Do this in your own terminal; do not paste your password into a chat. First build the application with Java 21. From `backend/`, run this local password-hashing utility:

```sh
java -Dloader.main=za.co.lepetse.admin.AdminPasswordHash \
  -cp target/lepetse-backend-0.0.1-SNAPSHOT.jar \
  org.springframework.boot.loader.launch.PropertiesLauncher
```

It prompts for a password without displaying the characters, asks for confirmation, then prints a BCrypt hash with cost 12. Choose a password of at least 14 characters. Only the generated hash is used for setup; never put a plain password into application configuration.

Set these environment variables in the terminal or your IDE before starting Spring Boot:

```sh
export ADMIN_BOOTSTRAP_USERNAME='your-admin-username'
export ADMIN_BOOTSTRAP_PASSWORD_HASH='paste-the-generated-bcrypt-hash-here'
```

Use single quotes around the hash so the shell does not expand its dollar signs. Startup creates the account if it does not already exist. It does not change an existing account's password or enabled status. Remove both bootstrap environment variables after the first successful startup; the account persists in PostgreSQL. No password reset, account-management UI or multi-factor authentication is implemented in this phase.

## Using the inbox

- Sign in, then search by RFQ reference, organisation or contact name.
- Filter by business/government buyer and status. Inbox pages contain 20 requests by default.
- Open a request to see the submitted buyer details, quantities, ordering units, delivery sites, formal procurement instructions, repeat-schedule requests, documents and staff activity.
- Select **Mark as reviewing** to change a new request to Reviewing. Repeating that action does not duplicate the activity entry. Closed, quoted or cancelled requests cannot be moved back by this action.
- Documents show filenames and safety-check status. No storage keys, disk paths or download links are exposed. Pending documents remain quarantined.
- Sign out when finished.

Status mapping: `submitted` → New, `in_review` → Reviewing, `quoted` → Quoted, `closed` → Closed. This phase can only move New to Reviewing; the other statuses are displayed for future quotation/order work. No quotation is issued by changing to Reviewing.

## Internal notes and deadline alerts

Added on 18 November 2026:

- Open an RFQ and use **Internal notes** for supplier checks, buyer conversations or outstanding questions. Notes accept up to 4,000 characters and record the signed-in author and time. They are append-only in this version, private to the admin API and absent from customer receipts and public catalogue responses.
- A note retry reuses its submission key, so a lost response does not create duplicate notes. Unsent draft text stays in page memory across an in-page refresh or response-target save; a full browser reload or sign-out clears that unsent draft. Saved notes remain in PostgreSQL.
- Set **Respond by (SAST)** to an optional internal response target. This does not modify the buyer's formal RFQ closing deadline. Leave it blank and save to clear it. Each change records the staff actor, old/new values and time; repeating the same save does not duplicate the change record.
- Inbox badges and the request's **Needs attention** panel flag response targets and formal RFQ closing dates within 48 hours, plus dates that have already passed. Requested delivery dates are flagged within two South African calendar days or when passed. These are planning indicators, not delivery commitments or evidence that a bid was submitted.
- Only New and Reviewing requests produce these alerts. Quoted, Closed, Cancelled and Draft requests do not. New response targets cannot be assigned to finished requests.
- Select **Needs attention only** to filter the inbox. The count is across all active requests; normal search/buyer/status filters still apply to the result list. Alerts are evaluated using server time on load or Refresh. No email, WhatsApp, push notification or scheduled reminder service has been added. No response SLA is assumed when a target is absent.

V6 adds `rfq_internal_note`, `rfq.admin_response_due_at` and `rfq_response_target_change`. Private note and target endpoints require ADMIN access and CSRF tokens. Request bodies are validated without echoing rejected private-note contents into error responses or validation logs.

Additional endpoints:

| Endpoint | Access | Purpose |
| --- | --- | --- |
| `POST /api/admin/rfqs/{id}/notes` | ADMIN + CSRF | Save `{submissionKey: UUID, body: text}` |
| `POST /api/admin/rfqs/{id}/response-target` | ADMIN + CSRF | Set `{dueAt: ISO offset date/time}` or clear with null |

`GET /api/admin/rfqs?attention=true` filters before pagination. List/detail responses include `deadlineAlerts`; detail adds `internalNotes` and `responseTargetHistory`. Customer-supplied `notes` remain a separate field.

## Redesigned workspace

The admin layout now uses a compact document-style workspace with a quieter sidebar, lighter dividers and four view tabs: **All requests**, **New**, **Reviewing** and **Needs attention**. The old summary cards have been removed. The exact matching count appears above the results, rather than mixing global counts into filtered view tabs.

Each tab remembers its applied search and buyer filter. All requests also supports status filtering; New and Reviewing keep their fixed status so their names remain meaningful. Needs attention is restricted to active requests with deadline flags. Applied view settings and the last active tab are saved per admin account in PostgreSQL (`admin_workspace_preference`, Flyway V7), not in browser storage. Saved searches can contain organisation/contact terms and remain private to their owner. Other admins cannot read those settings. Page position is retained in memory while moving between views.

On desktop, selecting an RFQ opens a reader beside the inbox. The inbox remains interactive, with the selected row highlighted. Close the reader to return to the same filters and list position, or use **Open full page** for a wider document. Previous/next request controls follow the current result page. Opening a request does not change its review status.

The reader keeps key properties near its heading and separates content into **Items**, **Notes**, **Details** and **Activity**. Secondary delivery/document sections are expandable. Matched products show their current catalogue name for quick scanning, with the originally submitted requirement preserved under **Original specification**. Notes, response targets, alerts and review actions use the same protected endpoints as before. Unsaved note/target drafts remain in page memory while changing sections; saved values persist in the database.

Recently opened requests appear in the sidebar for the current page session only. No customer data or recent-request list is written to local storage. Refreshing rebuilds the current reader from the URL; it does not retain other recent requests or unsaved drafts. Cmd/Ctrl+K focuses inbox search, view/section tabs support arrow keys, and Escape closes the reader. On narrower screens the reader becomes a focused overlay with an inert background, keyboard focus containment and a full-page option.

`GET/POST /api/admin/workspace` loads/saves only the signed-in admin's validated view preferences. Changes require CSRF protection. This is a Spring Boot admin redesign; the public static website and its enquiry flow are unchanged.

Verification: all 24 tests passed (21 database integration tests plus three deadline-rule tests), including saved-view isolation, validation and fixed-status semantics. Browser checks covered filtering across refresh and server restart, side/full-page modes, closing back to the inbox, unsaved note retention across sections, saved notes/review actions, response-target updates, next-request navigation, keyboard tab focus, mobile overflow/focus and sign-out. No browser console errors were observed. Temporary demo RFQs and the test admin account were removed after verification. No GitHub push or public deployment was performed.

## Access controls

Spring Security handles password verification, session creation/rotation and logout. Admin credentials are BCrypt hashes in `admin_user`; no password is stored in plaintext. Admin pages and `/api/admin/rfqs` require the ADMIN role. Protected responses use `Cache-Control: no-store`, same-origin content restrictions and no-referrer headers. The session cookie is HttpOnly and SameSite Strict, with a 20-minute server-side idle timeout. Login and all admin changes require CSRF tokens. The existing anonymous RFQ intake POST is the only CSRF exemption; its validation and database transaction remain unchanged.

Sign-in is limited to ten attempts per client IP in a 15-minute window, resetting after successful sign-in. This limit is in process memory, not shared between multiple servers. Sessions are also in memory. There is no hardcoded production account. Disabled accounts cannot sign in; disabling an account in the database does not revoke an already active session immediately. Restart the application to revoke in-memory sessions when needed until explicit session revocation is implemented.

When deploying behind HTTPS, set `SESSION_COOKIE_SECURE=true`. Keep the database and upload storage private. A public backend, HTTPS setup and a production owner account have not been provisioned by this change.

## Database and endpoints

Flyway V5 adds `admin_user` and `rfq_activity`. Staff actions record the authenticated username, old/new status and timestamp. Existing RFQ and catalogue data are preserved.

| Endpoint | Access | Purpose |
| --- | --- | --- |
| `GET /admin/login.html` | Public | Sign-in form |
| `POST /admin/login` | CSRF token + credentials | Start admin session |
| `POST /admin/logout` | CSRF token | End session |
| `GET /api/admin/session` | Public, no request data | Authentication state and CSRF token |
| `GET /api/admin/rfqs` | ADMIN | Paginated inbox with search/filter counts |
| `GET /api/admin/rfqs/{id}` | ADMIN | Submitted RFQ detail |
| `POST /api/admin/rfqs/{id}/review` | ADMIN + CSRF | Mark New as Reviewing |

## Verification

All 15 PostgreSQL integration tests passed: the existing ten catalogue/import/submission tests plus five admin access tests. Coverage includes anonymous blocking, incorrect credentials, real password sign-in, disabled accounts, logout/session invalidation, role restrictions, search/filtering, private document metadata, CSRF enforcement, status transition rules and a single recorded action on retry.

Browser checks verified redirecting an unauthenticated inbox visit to sign-in, signing in with a temporary test account, loading the saved RFQ, opening buyer/items/delivery details, marking it Reviewing, filtering/searching including an empty result, signing out and blocking inbox access again. The temporary test account was removed after verification. Screenshots use test data. No GitHub push or public admin deployment was performed.

Notes/alerts verification: all 22 tests passed (19 database integration tests and three deterministic deadline-rule tests). Additional coverage checks private-note access, content validation, saved author, duplicate retries, absence from public responses, target change history/clearing, quoted-request exclusions and the exact 48-hour/South African calendar boundaries. Browser verification saved a note and response target, reloaded to confirm persistence, showed the overdue flag and filtered the inbox to the flagged request, then signed out. The temporary test account was removed.

## Supplier quotes and catalogue pricing

Open **Suppliers & pricing** from the workspace sidebar. V8 adds private, database-backed supplier quotes, lines and append-only price decisions. Multiple quotes from multiple suppliers may be matched to one catalogue product.

1. Record supplier, quote reference, date, expiry, payment terms and delivery/minimum-order conditions. Attach the original PDF (up to 10 MB). The PDF remains admin-only, downloads as an attachment and is never served inline. Extraction is **manual** in this version: capture and review the line fields from the PDF. No supplier PDF has been automatically imported.
2. Capture supplier SKU, description, pack cost **excluding VAT**, quoted pack count, availability and lead time. Match a catalogue product as exact or alternative, or leave it unmatched. Units per pack means the number of that product's **catalogue ordering units**, which may themselves be packs. Duplicate SKU lines are preserved and flagged; large quoted pack counts prompt review.
3. Compare costs for a selected catalogue product. Rows show cost per selling unit, original pack prices, quote date/expiry, terms and availability. Alternatives remain visibly labelled. Expired quotes cannot be used for price approval; missing validity is explicitly unconfirmed. Freight/minimum orders are conditions, not automatically allocated landed costs.
4. Choose a supplier line, enter allocated extra cost per selling unit, your markup and explicit output VAT treatment/rate. The calculator suggests a selling price; you can adjust it. Check specification, conversion and terms before approving. Where supplier VAT is not recoverable, include it in extra cost after confirming the business's tax treatment.
5. Approval stores the selected supplier, actual markup after overrides, cost, selling price, VAT basis, staff username and timestamp, and updates the backend product price. It does not enable checkout, issue a customer quotation, email anyone, place supplier orders or update the separately hosted static prototype. Public catalogue APIs continue their existing checkout-price eligibility rules. Supplier costs stay private.

Supplier API routes are under `/api/admin/supply/`, covered by existing ADMIN/session and CSRF protections. PDFs are stored in PostgreSQL with the quote for this initial version; include them in database backup/access policies. The stored document is not declared virus-scanned. Quotes and price decisions are preserved as historical records; quote-line editing/deletion and automatic PDF extraction are not yet implemented.

Validation: all 27 backend tests passed, including multiple suppliers/pack normalization, private documents and CSRF, alternative approval, expired quotes, below-cost rejection and price-decision persistence. JavaScript syntax checks passed. Authenticated browser verification was not completed because automatic approval review rejected creation of a temporary privileged test account.

## Buying-list comparison and bulk price review

**Compare & price** now accepts up to 100 products and the quantity needed in each catalogue ordering unit. The private comparison API (`POST /api/admin/supply/comparison-plan`) calculates whole packs using ceiling division, acquired units, extras, and extended pack cost. Offers are arranged by product and supplier. “Lowest exact item cost” excludes expired quotes and alternatives and compares the cost of buying enough whole packs, before delivery. It does not promise availability.

Enter one delivery/collection charge and an optional minimum goods-order amount per supplier for the current scenario. Blank delivery is unknown, not zero. Blank minimum order is unconfirmed. The selected mix and single-supplier exact-match scenarios show coverage, goods cost, delivery once per supplier, and estimated totals. Partial coverage, unknown costs and unmet minimums stay visible; scenarios are not supplier orders. Mixing different quotes requires supplier confirmation. Comparison quantities and freight inputs remain in browser memory for this workspace session; no browser persistent storage is used.

**Review selling prices** shows the existing price and VAT basis alongside supplier unit cost, allocated delivery/extra cost, markup, proposed selling price, profit, margin and actual markup after price overrides. Delivery is allocated by purchased goods value and then across purchased units. When goods values are zero it is allocated across purchased units instead. Unknown allocation requires an explicit extra-cost entry. Output VAT treatment is chosen explicitly. Products may be unchecked to exclude them from approval.

`POST /api/admin/supply/approve-prices` approves selected rows in one transaction, locks products in ID order, checks the reviewed update timestamp, and rejects stale versions. Existing expiry, alternative, cost and audit protections apply to every row. Successful approval changes only backend catalogue pricing and records supplier choices; it does not enable checkout, place purchase orders, send emails, push GitHub or deploy the hosted prototype.

Verification covers quantity normalization, extras, delivery once per supplier, unknown-cost totals, minimum orders, expiry, duplicate requirements, security and stale-price rejection. The separate sample preview uses illustrative data and does not write to the database. Browser checks of that preview do not replace authenticated backend integration tests.

The supplier workspace has its own `suppliers.css`, loaded only on the supplier page. Request-inbox styles remain in `admin.css`. Supplier tables use pinned product columns and table headers, contained horizontal scrolling, consistent 42–44 px inputs/buttons, explicit selected-offer styling, and larger text. Narrow screens hide the sidebar and stack form controls. This styling change does not alter comparisons, pricing calculations or saved data.

Comparison presentation: shared guidance appears once in a disclosure. Each offer shows one availability line; unit/pack costs and supplied-unit counts remain under Offer details. Selected offers use a status label rather than a redundant action button. The buying-list editor collapses after comparison and remains available for quantity changes. Browser checks confirmed selection feedback, quantity editing, focus return and no console errors; pricing calculations are unchanged.

## Extract supplier files before saving

The Supplier quotes tab now starts with **Import a supplier quote**. Text PDFs, XLSX workbooks and UTF-8 CSV files up to 10 MB are parsed by the signed-in Spring Boot backend using Apache PDFBox 3.0.8 and Apache POI 6.0.0. Files are not sent to an AI provider or external extraction service. CSV/XLSX tables need Description and Pack price (or Unit price) headings; common aliases for SKU, Quantity, UOM, Units per pack, Supplier, Reference, Quote date and VAT basis are recognised. XLSX imports read the first worksheet and flag additional sheets. Formulas are not evaluated. Scanned PDFs need OCR separately; unreadable or extraction-restricted documents produce an explicit error. PDF layouts outside the recognised line patterns may require manual row entry from the extracted source text.

`POST /api/admin/supply/imports/extract` is ADMIN/CSRF protected and returns extracted header fields, rows, warnings, optional printed totals, text and a SHA-256 file fingerprint. It writes nothing to the database. Supplier codes repeated in the source are preserved, large whole-pack quantities are flagged, missing values stay empty, and pack counts are suggestions requiring review. PDF limits are 30 pages / 200,000 text characters; table limits are 500 rows / 40 columns; XLSX expanded ZIP content is bounded before parsing.

The editable review supports row inclusion/exclusion, corrections, adding missing rows, pagination and explicit product matches. Unmatched lines may be saved for sourcing. Select the source VAT basis; inclusive source costs require a rate and are converted to ex-VAT costs at four decimals on save. All amounts are ZAR. Checking the review confirmation and **Save reviewed quote** sends original file plus reviewed data to `POST /api/admin/supply/imports`. The server validates every included line, checks the fingerprint, and saves quote, lines and original document in one transaction. No selling prices, catalogue products or supplier orders are created automatically. Existing catalogue price approval remains separate. Original CSV/XLSX documents download as attachments with their correct extension.

This supersedes the earlier manual-extraction limitation. The standalone visual preview remains read-only; **Try sample review** demonstrates editing using illustrative data. Actual uploads/extraction require a signed-in backend session. No dashboard account was created for verification.

## Unified quote entry

**Add supplier quote** replaces the separate Record/Import sections. Upload is the default entry method; **Enter manually** opens the same fields with a blank header and one item row. Both methods use one **Save quote** action, one row editor, the same confirmation and VAT controls, and the same transactional persistence helper. Manual saves use `POST /api/admin/supply/imports/manual` with reviewed JSON and no document/fingerprint; uploaded saves keep their original-file fingerprint checks. Both routes require ADMIN access and CSRF protection, validate complete included rows, and leave catalogue selling prices unchanged. In-memory drafts reappear when returning to Supplier quotes. The user must discard a draft explicitly to start fresh.

Verification: 41 backend tests passed, including manual creation without a file, VAT conversion, confirmation, row validation and CSRF. Browser checks on the sample preview verified blank manual fields and a single shared Save quote action.


## Requests and Approved Requests

The admin now separates supplier-cost approval from preparing a customer quotation. **Requests** lists submitted/reviewing requests from business, government and schools. Open a request to inspect its contact, delivery, instructions and existing attachment safety status, match each requirement to a catalogue product, and compare current supplier DB offers. **Use lowest goods costs** is an optional starting selection of unexpired exact matches; it compares whole-pack goods totals, not supplier transport or unconfirmed availability. Staff can select different suppliers per item, adjust the quantity to quote and check catalogue-unit conversion. Original submitted quantities remain unchanged. Costs for whole packs, including spare units, are spread over the quoted quantity.

**Save sourcing** stores a versioned draft. **Approve sourcing** revalidates all item matches, reviewed pack prices, expiry and permitted alternatives, freezes the internal sourcing snapshot and changes status to `approved`. It does not publish retail prices or generate an order. A changed price must be refreshed and reviewed. Approval moves the record into **Approved Requests**, which includes approved and sent records. An explicit button opens the same request in that stage.

Approved Requests contains the customer quotation editor: customer descriptions, per-item markup or selling-price override, customer transport excl. VAT, explicitly entered VAT rate, validity and terms. Selling prices cannot be below the approved unit cost; rounding cannot conceal a loss. Products, quantities, units or supplier costs require **Return to Requests for sourcing** with a reason and a new approval. Returning supersedes prepared/issued quotation versions; immutable history remains. Saved quotation drafts survive refresh, and optimistic versions reject stale saves.

**Finalise & preview** verifies current approval and supplier-source freshness, then snapshots a new customer quotation revision. Finalised is distinct from sent. PDF/preview contain only customer-facing amounts, original requester details, delivery, validity and terms. Supplier costs and markup are private. Source edits, quantity changes, expired supplier offers and changed drafts prevent stale versions being prepared for sending. Finalisation keys are idempotent, and quotations are scoped to their parent request.

No email provider has been connected. **Download email draft** generates a private `.eml` addressed to the original requester with the PDF attached. It never sends an email or marks it sent. After sending in their mail app, staff must explicitly confirm **I have emailed this quotation…** and choose **Record as sent**. This records the recipient and timestamp and sets the RFQ to `quoted` (displayed as Sent). A future connected send adapter must record successful delivery separately; the UI must not imply live sending before configuration. Existing government submission instructions remain visible in the customer details.

V9 adds `rfq_pricing_work`, `rfq_pricing_event`, sourcing approval/quotation snapshot columns, the approved status and school buyer type. V1–V8 are unchanged. API routes under `/api/admin/rfqs/{id}/pricing` are ADMIN-only, CSRF-protected and no-store. The public intake accepts schools as well as business/government; scheduled repeats remain business-only. Attachment quarantine and protected-download limitations are unchanged.

Verification uses an isolated PostgreSQL database and security-aware backend tests, plus an explicitly labelled sample browser with illustrative data. The sample does not call live APIs, change real RFQs or send email. No dashboard account or access permissions were created. The implementation is local and has not been pushed or deployed.

Final checks: 51 backend tests passed with no skips, including sourcing/quotation separation, school intake/queues, stale versions, whole packs, quantity overrides, changed/expired offers, alternative permissions, cost rounding, idempotency, PDF privacy, `.eml` attachments and explicit sending records. Sample desktop/mobile checks verified the full stage transition, quotation totals, return-to-sourcing path and contained mobile tables.

### Quotation-style sourcing layout

The sourcing request page uses a single document sheet: company/reference header, one customer strip and a four-column Item / Quantity / Selected supplier / Buying total table. Supplier offers stay behind Compare; product matching, quoted quantity and conversion stay behind Item details. Delivery and documents have separate header disclosures; Notes opens the existing notes/history area. A single totals block and Save draft / Approve sourcing footer replace the stacked sourcing cards. Sourcing tools remain available in a compact disclosure. Mobile rows stack without page overflow. Source selection, saved drafts, costing, approval and the Approved Requests quotation editor retain their existing behaviour. The change is local only.

The selected reference is Template 4 (Editorial quotation): sourcing uses a large serif RFQ reference, italic Quotation title, compact customer metadata, navy sidebar, numbered product rows and always-visible supplier comparison radio rows. The selected amount is aligned at the right of each item and the goods total is presented with a double rule. Documents/Notes sit in the footer. Technical item/offer metadata remains expandable; source costs, selection, saving and approval behaviour are retained. The prior collapsed-comparison sheet was replaced only in the sourcing stage. Approved Requests is also directly reachable from the sidebar.

Editorial spacing refinement: the RFQ heading is approximately 30% smaller, customer metadata occupies four compact columns, supplier names/pack counts/prices align on compact rows, and repeated offer-detail links are consolidated under each product's Item details. The selected-total column is narrower and the footer sits directly below the goods total. Two sample products, totals and approval actions fit together on the checked desktop viewport; the 390 px mobile check has no page overflow. Supplier selection, draft saving and expanded offer metadata were verified on the illustrative preview. No backend rules changed.

### Shared Requests dashboard appearance

Request detail now uses the inbox's neutral workspace appearance: shared light sidebar and navigation, sans-serif heading scale, muted metadata, fine grey table rules, matching status badges and button styling. The large serif reference, duplicate document logo, gold editorial rules and double-line total treatment are removed from this view. The compact supplier comparison, item-detail disclosures, calculations, saved drafts and stage transitions are retained. Styling is scoped to sourcing request detail in `request-dashboard.css`; the Requests inbox and customer quotation editor are unchanged.

Item-detail repetition cleanup: editing now opens a full-width sibling table row instead of expanding inside the product column. It contains the catalogue selector, quoted quantity and an optional Change ordering unit disclosure, with no repeated product title or supplier list. A materially different original customer specification stays available in a disclosure; quantity overrides display the original request only when different. Each supplier's reference, availability, expiry and lead time are shown once under Offer information beside that offer. Native disclosures and labelled numeric controls retain keyboard access, and Close details restores focus to its originating toggle. Expanded item panels and offer disclosures survive pricing redraws. UI checks verified supplier selection, quantity/conversion recalculation, saved totals and responsive width; no database or pricing rules changed.

Supplier comparison simplification: each offer now shows supplier, supplied quantity/extras and buying total in a compact row. References, original stock status, validity and optional lead time live in one full-width Compare details panel per product, replacing separate Offer information disclosures. Opening Compare details closes that product's Item details panel, and opening Item details closes the comparison; other products are independent. Expired, out-of-stock, stock-unconfirmed and alternative-product warnings remain visible beside the affected offer. Pack rounding and source-cost calculations are unchanged. Comparison tables stack labelled fields on mobile. Browser checks verified selection, totals, mutually exclusive panels and close/focus behaviour on the illustrative sample.

Direct quantity layout: the sourcing table now has Product & specification, Quantity to quote, Supplier comparison and Selected total columns. Catalogue product selectors, row numbering and Item details panels are removed. Existing stored product matches remain in the source draft; quantity is edited in the row and ordering-unit conversion remains optional beneath it. A differing original customer specification remains accessible; original requested quantity is shown only when overridden. Requests without a linked supplier offer show a neutral no-offers message. No source-cost, approval or database rules changed.

## Opportunity discovery

Work Opportunities → Saved searches contains Lepetse stationery and Namaro IT keyword profiles. Both default to 08:00 Africa/Johannesburg daily. Edit terms/exclusions and review guidance with Settings; pause using Search daily. Fetch now starts a background run and the page polls its status. Spring's scheduler checks persisted due times every minute; a missed run executes after the backend starts again. The computer/backend must remain running for scheduled searches. This does not connect to or resume the ChatGPT Namaro task.

Source: National Treasury public OCDS API (`https://ocds-api.etenders.gov.za/api/OCDSReleases`), documented by `https://data.etenders.gov.za/Home/LearnMore`. No paid API key is required. Initial discovery covers the last 14 days of releases; later runs overlap the last successful day by two days (maximum 14 days). At most 3,000 pages within two minutes are retrieved per run, starting with 50 releases per page and falling back to two-release pages if Treasury rejects larger pages; an incomplete scan is reported as partial and does not advance the successful-run watermark. Some tender notices/documents may be absent from the feed. PDF links are retained, not downloaded or analysed. Capital, references, certifications and regional suitability remain manual checks; all keyword matches start as Possible with unverified requirements.

OCIDs and buyer/reference matching prevent duplicate records across profiles. Human progress and eligibility decisions are retained; updates flag changed official deadlines/documents. Source title/scope updates preserve edited title/scope values. Search leases prevent simultaneous duplicate runs and recover after interruption. Failures are visible in each saved search. Tests use isolated PostgreSQL fixtures and roll back.

The local backend has not been deployed to an always-on host. Deploying the existing Java service requires a persistent PostgreSQL database, persistent RFQ-file storage, HTTPS, private admin access, and the existing runtime environment settings. No public cron endpoint or credential bypass was added. Do not place admin credentials in Vercel's static frontend. No new hosting service or paid subscription was provisioned.

Local Treasury fetches require the newer installed Java 21 runtime (21.0.12.1); the older 21.0.1 runtime lacks the certificate chain used by Treasury. Use `/usr/libexec/java_home -v 21` or a supported up-to-date Java 21 installation. Certificate and hostname validation remain enabled. Treasury intermittently returns HTTP 500; discovery uses 50-release pages, retries temporary failures up to four attempts, and continues past failed pages, stopping after three consecutive page failures, and reports incomplete coverage whenever a page is missing.

Supply-only workspace update: the local Namaro IT profile is archived and cannot run or be edited through the API. Its unpursued exclusive discoveries are hidden from the opportunity inbox; source/history records remain retained. The separate ChatGPT scheduled task is untouched. Supply opportunities replaces Lepetse stationery, retains its daily schedule, and includes office, hygiene, cleaning, PPE, furniture and general supply-and-delivery keywords. Service-contract exclusions are keyword filters, not verified tender classification.

## Tender applications

Each opportunity now has Prepare application: upload a tender PDF, extract local rule-based checklist suggestions with page evidence, select/edit them and explicitly confirm review before saving. Scanned PDFs need OCR or manual requirements. The extractor does not verify legal eligibility, fill tender forms, or change the closing date. Requirements support mandatory/optional, outstanding/complete/not applicable (reason required), linked evidence and explicit signature checks; source wording is retained. Optimistic versions prevent lost edits and source keys prevent repeated extraction from adding the same requirement twice.

Company documents are reusable private uploads (PDF/PNG/JPEG up to 10 MB). Expiry is shown in the library; expired mandatory linked evidence blocks readiness. Upload a replacement version and link it explicitly rather than overwriting old evidence. No email expiry reminders are scheduled. Documents are stored privately in PostgreSQL, not under the public static site; admin-only attachment downloads set nosniff. Public customer uploads remain on their existing separate path. Back up the database to retain these files.

Download draft/submission pack produces a ZIP with the checklist, selected linked evidence, completed forms/supporting documents marked for inclusion and the current finalised quotation (reusing the quotation renderer). Unused company documents, original tender files and submission proofs are excluded unless deliberately linked as evidence. Extra documents can be excluded without deletion. Packs are limited to 50 MB of source documents and are labelled DRAFT when checks are outstanding. Review required filenames, signatures, portal limits and official returnables; the ZIP is a preparation aid, not an automatic filing or compliance guarantee.

Submission record stores the actual date/time, channel, recipient/portal, confirmation and optional proof after explicit confirmation that the owner already submitted. Retries are idempotent. It does not send email, upload to a procurement portal, sign a form, or accept a tender. Existing requests still handle sourcing, approval and customer quotation pricing.
