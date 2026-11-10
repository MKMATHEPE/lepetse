# Shopping and RFQ implementation handoff

The static prototype has two independent journeys. No orders, enquiries, payments or customer details are transmitted. Existing enquiry summaries remain downloadable; live receiving service is still to be chosen with the owner.

## Frontend routes and state
- `#stationery`: shopping preview; priced benchmark products use Add to cart. Unpriced products use Add to quote.
- `#stationery?mode=quote&buyer=business` or `buyer=government`: quotation catalogue. Filters and product pages preserve this context.
- `#cart`: separate local product IDs/quantities under `lepetse-shopping-cart-v1`. Existing quote storage is unchanged. Clearing either basket never clears the other.
- `#checkout`: contact/delivery form and purchase review. Personal details remain in memory and clear on refresh. Payment is disabled; no confirmation or order number is invented.
- `#basket`, `#quote`, `#upload?buyer=business|government`: existing quotation journey. School lists remain quote-only.

## Spring Boot and PostgreSQL integration boundary
Implement as a Java Spring Boot API backed by PostgreSQL. Do not move business pricing or payment confirmation into frontend code.

Suggested API contracts (not connected yet):
- GET /api/products: active products with confirmed sellingPriceMinor, currency, tax treatment, ordering unit, purchaseEnabled, quoteEnabled and availability.
- POST /api/checkouts/preview: product IDs, integer quantities and delivery address; server returns revalidated line prices, shipping, tax, total and expiry. Reject unavailable/unpriced products for direct purchase.
- POST /api/orders: server-issued checkout preview ID and idempotency key; create a pending-payment order from server price snapshots.
- POST /api/orders/{id}/payment-session: Peach Payments Orchestration creates a hosted payment session. Never collect card details in this frontend.
- POST /api/payments/webhook: verify provider signature, amount, currency and order before marking paid; handle duplicate events idempotently.
- POST /api/quote-requests: buyer type, contact/organisation, delivery requirement, item specifications or attachment references, deadline and RFQ reference where relevant.
- GET /api/orders/{reference} and /api/quote-requests/{reference}: authenticated or scoped-token access only.

Suggested relational records: products, product_prices, orders, order_lines, order_delivery_addresses, payments, payment_events, quote_requests, quote_lines, quote_attachments and status_history. Keep order and quote workflows separate. Store monetary values in integer minor units; use immutable order-line snapshots and transactions. Use foreign keys, unique provider event IDs and idempotency keys. Access to customer data and uploads requires authentication, retention rules and server validation.

Order states: PENDING_PAYMENT -> PAID -> PROCESSING -> DISPATCHED -> COMPLETED, with explicit cancellation/refund paths. RFQ states: DRAFT -> RECEIVED -> UNDER_REVIEW -> QUOTED -> ACCEPTED/DECLINED/EXPIRED. An accepted quotation may produce an order under its agreed payment or purchase-order terms; submission alone never implies acceptance.

## Required before live checkout
Owner-approved selling prices (benchmark references are not selling prices), VAT treatment, delivery coverage and charges, stock/lead-time policy, trading terms and privacy notice, Peach Payments merchant approval and activation, Spring Boot hosting/PostgreSQL provisioning, receiving service, verified payment webhook and end-to-end order/notification tests. Do not enable payment from the static prototype.

## Selected provider: Peach Payments Growth

Owner selected Growth; no merchant account exists yet. Status: pending registration. This selection is not an active payment integration. Use Orchestration Hosted Checkout for the new integration, not the classic Checkout API. Confirm availability under the approved merchant agreement.

Registration: https://www.peachpayments.com/get-started/
Current integration entry point: https://playground.peachpayments.com/
Pricing: https://www.peachpayments.com/fees/?country=za

Request test/sandbox access and confirm cards, Pay by Bank and Capitec Pay activation. After backend provisioning, store credentials in the Spring Boot server's secret configuration; never in frontend files, local storage or Git. Confirm current API authentication, session creation, payment-status and webhook verification contracts against the account's Orchestration documentation before writing the adapter. Register an HTTPS backend webhook, validate its authenticity and the order amount/currency, and process notifications idempotently. A shopper returning to a success URL is not payment confirmation.

Test successful, declined, cancelled, timed-out, duplicated and delayed notifications plus refunds before switching to live credentials. Growth is a commercial plan, not a separate API endpoint. Keep existing quotation acceptance and purchase-order terms separate from gateway payment. Final prices, tax treatment and delivery remain launch prerequisites.
