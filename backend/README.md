# Lepetse database foundation

Stack: Java 21, Spring Boot 3.5.16, PostgreSQL and Flyway. This folder contains the backend application, database migrations and read-only catalogue/school endpoints. Spring Boot now serves the existing website with database-backed catalogue and school data. The hosted static prototype remains on its bundled snapshot until a public backend is deployed.

## Run locally

Create an empty local PostgreSQL database named `lepetse` and a dedicated role with permission to migrate that database. Set `DB_URL`, `DB_USERNAME` and `DB_PASSWORD` in your shell or IDE (see `.env.example`). Do not use production credentials for development.

The machine's Maven startup configuration selects Java 8, so the commands below explicitly use Java 21 without changing your global settings:

```sh
export JAVA_HOME="$(/usr/libexec/java_home -v 21)"
export MAVEN_SKIP_RC=true
mvn -s maven-settings.xml spring-boot:run
```

By default the app binds to `127.0.0.1:8080`. `GET /actuator/health` checks database connectivity. `GET /api/catalogue/products?page=0&size=10` returns active products with pagination (maximum 100). `categoryId` is an optional numeric category filter. Unapproved products return no selling price. Migrations import the current 256-product catalogue automatically. Business/government RFQ submission and private staff sign-in are available locally. See [RFQ.md](RFQ.md) and [ADMIN.md](ADMIN.md).

Open `http://127.0.0.1:8080/` to use the connected website. Maven packages `../dist` into the application jar, so pages, images and API share one origin; a separate frontend server and CORS configuration are unnecessary. Rebuild after changing frontend files. `/runtime-config.js` is served by Spring Boot with API mode enabled. The static copy uses snapshot mode for the current Sites/Vercel prototype.

`GET /api/site-data` is a versioned compatibility response for this frontend. It reads products, image paths, reference prices and school requirements from PostgreSQL in a consistent read transaction. `GET /api/schools` returns published school lists and requirement rows. The browser loads data before restoring baskets and rendering the initial route, retaining the existing IDs, filters and layout. An API failure displays a retry action; API mode does not silently fall back to the snapshot. The existing small catalogue still filters and paginates on the client after its initial data request.

Catalogue and school data remain read-only. Business/government RFQs can now be submitted from the local Spring Boot website and saved with a reference number. Cart/basket selections remain on the device; contact details and attachments are transmitted only on explicit submission. Order creation, email delivery and payments remain unavailable. Catalogue prices continue to be clearly labelled research references; no approved selling prices or live checkout have been activated. A public Spring Boot host and persistent PostgreSQL service are still required before the published website can use this backend. Do not configure the public site with a localhost API URL. The application binds to loopback by default; a hosting deployment will need its own bind address, database credentials and HTTPS configuration.

For integration tests, use a separate empty test database, set the same DB environment variables to it, and run:

```sh
LEPETSE_DB_TEST=true mvn -s maven-settings.xml verify
```

Tests intentionally skip unless `LEPETSE_DB_TEST=true`; they must not target a production database. Tests apply migrations and roll back fixture data. `mvn package` produces the runnable jar under `target/`. The optional Maven settings file uses public dependency repositories rather than machine-specific corporate settings. No credentials are included.

## Main records

| Area | Tables | Purpose |
| --- | --- | --- |
| Catalogue | brand, category, product, product_image | Brand-specific products, pack sizes, category-specific specifications and image provenance |
| Sourcing | supplier, supplier_product | Supplier codes, source documents and researched reference prices, separate from selling prices |
| Research and replacements | product_price_reference, product_replacement | Retail price evidence and explicit proposed replacements for old product IDs |
| Customers | customer | Contact and organisation information; email is not a unique customer identity |
| RFQs | rfq, rfq_item, rfq_delivery, rfq_attachment | Business and government requirements, including uploaded lists and multiple delivery sites |
| Your quotations | quotation, quotation_item | Your prices, revisions, validity, delivery charges and email timestamps |
| Purchases | sales_order, sales_order_item | Checkout orders or orders resulting from approved quotations |
| Payments | payment, payment_event | Payment attempts and duplicate webhook protection; no card details |
| Schools | school, school_list, school_list_item | Versioned grade lists, optional subjects, reused items and proposed replacements |

## Business rules

- RFQs accept only business or government buyers. Customers submit quantities and specifications, not prices. You create and issue the quotation separately.
- A repeat requirement is not permission to charge automatically. `recurring_requested` records interest only. Scheduling, customer approval and payment mandates require a later implementation.
- A product's `selling_price` remains empty until approved. Supplier reference prices must never automatically activate checkout. Checkout eligibility requires a selling price and explicit VAT treatment.
- Use integer quantities of ordering units: for example, 2 reams or 1 pack of 12. `pack_quantity` is null when contents are unknown.
- Store exact submitted descriptions and ordering units on RFQ and order lines. Preserve delivery and contact snapshots. Subsequent catalogue changes must not rewrite historical records.
- Glenanda's list year can remain null. Curro can use 2027. Do not guess missing source details.
- School requirements retain their original wording separately from the proposed product, replacement notes and per-learner quantity. Whole-pack conversion belongs in the service, using confirmed pack contents only.
- Existing frontend IDs go in `product.legacy_id` so saved device baskets can be mapped during migration.
- The order's `vat_total` includes all applicable VAT, including delivery VAT. Calculate each line with decimal arithmetic and round to cents consistently; reconcile the stored total in the order transaction.

## Spring Boot integration next

1. Application scaffolding is complete with Web, Validation, Data JPA, PostgreSQL and Flyway support (including Flyway's PostgreSQL module).
2. Credentials use environment variables. Hibernate schema management is `validate`; Flyway owns schema changes. Never commit credentials.
3. Flyway applies `src/main/resources/db/migration/V1__initial_schema.sql` on startup. Once applied to a shared database, add V2 migrations rather than modifying V1.
4. Catalogue and school-list imports are complete. Selling prices remain unapproved and checkout disabled until reviewed. Provenance and image match status are retained.
5. Catalogue reads and transactional RFQ submission are complete locally. Next add authenticated owner quotation management, then checkout and verified Peach payment events.

## Required service controls

The schema is a foundation, not the complete application. The service must validate RFQs before submission (contact details, at least one line or clean attachment, delivery details and date constraints). Validate address inconsistencies without silently changing them.

Enforce authenticated staff access for pricing and status changes. Validate legal state transitions, lock records while finalising quotations/orders, prevent editing issued quotations (create a revision), and verify purchase-order authorisation where required. Confirm order totals and payment currency/amount against server-side prices, never browser values. Verify payment webhook signatures before recording a successful payment; event IDs prevent duplicates.

Use private object storage for attachments; store only keys here. Apply file size/type limits, malware checks, expiring download links, access controls, retention/deletion rules and backups. Do not log personal details or payment secrets. Staff sign-in and the Reviewing action's audit history are implemented locally. Email retry/outbox, inventory/reservations, refunds and delivery allocation across sites remain follow-on work.

## Validation status

Verified on 14 November 2026 against isolated local PostgreSQL 17.5, without Docker: the initial three Flyway migrations applied, Hibernate schema validation passed, all five integration tests passed, and Maven produced the runnable jar. Tests cover catalogue reads, pagination validation, hidden unapproved prices, checkout price requirements, restricted RFQ buyer types, import coverage, whole-pack conversion, unknown school-list years, reused books, replay without duplicates or overwriting approved selling prices, database-backed website responses and packaged frontend resources. Browser verification covered PostgreSQL mode, ten-product pagination, category filters, cart refresh retention, Curro subject selection and quote retention, Glenanda replacements and connection-error handling. No live database has been created or changed. Nothing has been pushed to GitHub.

## Imported source snapshot

`V2__import_provenance.sql` adds source metadata, replacement mappings, price references and per-school-item conversion factors. `V3__import_prototype_catalogue_and_schools.sql` imports the existing prototype data without changing its files:

- 256 active catalogue products, plus 233 inactive legacy/source-only requirements retained for existing basket IDs. Inactive requirements do not appear in the catalogue endpoint.
- 62 researched retail price references; zero approved selling prices and no enabled checkout products.
- Two schools: Glenanda Primary (Grades R–7, year unknown) and Curro Serengeti (Grades 8–12, 2027).
- 13 grade lists and 422 requirement rows, preserving general requirements separately from subject requirements. Do not add every subject to one learner's basket.
- Glenanda replacement notes and conversion ratios are preserved. Quantity calculation remains `ceil(perLearner × learners × conversion_required / conversion_supplied)`.
- Curro art quantities remain null where unspecified; the optional easel and reused Grade 12 English books retain their flags. Curro source requirements are not represented as confirmed catalogue matches.
- Existing local image paths and source/match metadata are retained. Images are still files in `dist/images/`; no image binaries are stored in PostgreSQL and no photos were invented for missing images.

`import-manifest.json` records counts and hashes of the source files. `node scripts/generate-import.cjs` reproduces V3 from trusted local prototype files; it is a development tool, not a runtime importer. Once V3 has been deployed to a shared database, preserve it and create a new migration for updates. Source snapshots retain original specifications, spreadsheet row numbers, image provenance and source descriptions. The replay check confirms inserts do not duplicate rows or reset an approved price; it does not treat V3 as an ongoing catalogue synchronisation mechanism.

The private admin sign-in and RFQ inbox are now implemented locally. See [ADMIN.md](ADMIN.md) to create your owner account and open `/admin/`. Next application work is owner pricing and quotation documents. Hosting the backend and database is separate from publishing the static prototype.

RFQ update, 18 November 2026: V4 adds submission keys and metadata; all ten integration tests passed. Catalogue submission was verified through the browser and directly in PostgreSQL. The document-upload browser check was interrupted; automated multipart tests passed. See [RFQ.md](RFQ.md) for setup, guarantees and remaining deployment work.

Admin update, 18 November 2026: V5 adds private admin accounts and an activity log. Spring Security protects the admin pages and API with password sign-in and sessions. The inbox supports search, buyer/status filters and request detail; New requests can be marked Reviewing. All 15 integration tests passed, and sign-in → inbox → review action → sign-out was browser-verified. No real admin account or default password is created. See [ADMIN.md](ADMIN.md) for setup and limits.

Notes and deadline update, 18 November 2026: V6 adds private append-only staff notes and audited response targets. The admin inbox/detail view highlights approaching or passed closing/response dates and urgent requested delivery dates, using South African time, with a Needs attention filter. These are dashboard indicators only; no notification service is connected. All 22 tests passed, and saved notes/targets, refresh retention and attention filtering were browser-verified. Public customer pages are unchanged.

Workspace redesign, 18 November 2026: the private admin now uses saved per-account view tabs and a desktop side reader/full-page mode, with compact properties and Items/Notes/Details/Activity sections. V7 stores validated private view preferences. All 24 tests passed, and desktop/mobile browser checks confirmed the existing RFQ actions still work. Public website pages are unchanged.
