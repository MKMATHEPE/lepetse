# Online hosting

The root Dockerfile packages the existing customer website and Spring Boot API together. Customers use `https://<host>/#business`, `/#government` or `/#schools`; staff use `/admin/index.html`. Same-origin requests need no CORS configuration or public database credentials.

The default `render.yaml` is for the free pilot described below. The disk-backed settings in the next sections are an alternative for paid or self-managed hosting.

## Disk-backed hosting requirements

- An always-on Docker web service (Java 21), with HTTPS.
- PostgreSQL with durable storage and backups, in the same region.
- A persistent disk mounted at `/var/data`, writable by the container's `lepetse` user, for private RFQ attachments. Never expose this directory as static files. Database-only backups do not include these attachments.

## Environment

Set these in the hosting dashboard, never in Git:

- `DB_URL`: JDBC URL, e.g. `jdbc:postgresql://<internal-host>:5432/lepetse` (use the provider's required verified TLS settings for external connections).
- `DB_USERNAME`, `DB_PASSWORD`: supplied by PostgreSQL hosting.
- `SERVER_ADDRESS=0.0.0.0`
- `SESSION_COOKIE_SECURE=true`
- `RFQ_STORAGE_DIRECTORY=/var/data/rfq-files`
- `PORT`: supplied by the platform.
- `SERVER_FORWARD_HEADERS_STRATEGY=native` only behind the host's trusted proxy, with direct untrusted access blocked.

Configure `/actuator/health` as the health-check path. Run one instance while attachment storage and scheduled discovery are local to the service. Flyway applies schema migrations on startup. No local admin account or local customer/supplier records are copied automatically.

Create the owner account using the existing BCrypt bootstrap process in ADMIN.md. Set `ADMIN_BOOTSTRAP_USERNAME` and `ADMIN_BOOTSTRAP_PASSWORD_HASH` privately for the first startup; remove those bootstrap variables after verifying sign-in. Do not put plain passwords in configuration.

## Release checks

1. Confirm provider, region, paid plan and backup policy before provisioning.
2. Build the container from the repository root and deploy with PostgreSQL and disk configured.
3. Verify login redirects, secure session cookies and unauthenticated admin API denial.
4. Submit a labelled test RFQ from the public catalogue, verify its reference in the online admin inbox, and test a private attachment download while signed in.
5. Restart the service and confirm both the request and attachment remain available.
6. Publish the connected URL only after these checks. The existing ChatGPT Sites URL is a separate static deployment and does not automatically become connected. Use the connected site URL, or explicitly configure a frontend proxy and update that deployment.

Do not import the whole local database without reviewing test records, owner credentials and supplier banking information. A fresh cloud database is a separate database: use the online admin inbox for online requests.

## Free pilot on Render, Neon and Cloudflare R2

The repository's Render Blueprint selects Free compute and uses an external
database and object storage. Create a Neon Free project and a private R2
Standard bucket. Use a bucket-scoped R2 token with object read/write access.
Keep public bucket access disabled. Review the R2 usage terms before enabling
it, since usage beyond the free allowance can incur charges.

Set the following values in Render, using its secret fields:

- `DB_URL`: the Neon direct connection as a JDBC URL, for example
  `jdbc:postgresql://<neon-host>:5432/<database>?sslmode=verify-full`.
- `DB_USERNAME` and `DB_PASSWORD`: the Neon role and password.
- `R2_ACCOUNT_ID`, `R2_BUCKET`, `R2_ACCESS_KEY_ID`, and `R2_SECRET_ACCESS_KEY`:
  the R2 account, private bucket and bucket-scoped credentials.
- The owner bootstrap values described above. Set
  `QUOTATION_BANK_ACCOUNT_NUMBER` privately if needed.

Use the Render URL for both the storefront and `/admin/index.html` initially.
Check a test RFQ with an attachment end to end, including its receipt, inbox
entry and private R2 object. RFQ attachments are quarantined and there is
currently no admin download route for them. The free app sleeps when idle and
sign-in sessions reset on restart. Point the paid domain at Render after testing.

## Vercel storefront with the admin dashboard on Render

Deploy the Render Blueprint first. Set `STOREFRONT_ORIGINS` on Render to the
exact HTTPS storefront origin, or a comma-separated list of storefront
origins. Include only domains you control. This enables cross-origin requests
to the public catalogue and RFQ intake endpoints. Staff sign in on Render.

In Vercel, import the same repository using its root directory. Set
`LEPETSE_API_ORIGIN` to the Render HTTPS origin (without a path). The build
writes this public address into the storefront configuration. Keep Neon, R2
and admin credentials in Render. Verify customer submission and staff receipt
on the hosted URLs before switching your domain.
