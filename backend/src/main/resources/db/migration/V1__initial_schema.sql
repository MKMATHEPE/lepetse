-- PostgreSQL foundation. Applied once by Flyway; timestamps are UTC instants.
CREATE TABLE brand (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name text NOT NULL UNIQUE CHECK (btrim(name) <> '')
);
CREATE TABLE category (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code text NOT NULL UNIQUE,
    name text NOT NULL,
    parent_id bigint REFERENCES category(id),
    CHECK (parent_id IS NULL OR parent_id <> id)
);
CREATE TABLE product (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    legacy_id text UNIQUE,
    sku text UNIQUE,
    name text NOT NULL CHECK (btrim(name) <> ''),
    description text,
    brand_id bigint REFERENCES brand(id),
    category_id bigint NOT NULL REFERENCES category(id),
    ordering_unit text NOT NULL CHECK (btrim(ordering_unit) <> ''),
    pack_quantity integer CHECK (pack_quantity > 0),
    specifications jsonb NOT NULL DEFAULT '{}' CHECK (jsonb_typeof(specifications) = 'object'),
    active boolean NOT NULL DEFAULT true,
    checkout_enabled boolean NOT NULL DEFAULT false,
    selling_price numeric(14,2) CHECK (selling_price >= 0),
    currency char(3) NOT NULL DEFAULT 'ZAR' CHECK (currency = 'ZAR'),
    price_includes_vat boolean,
    vat_rate numeric(5,4) CHECK (vat_rate BETWEEN 0 AND 1),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CHECK (NOT checkout_enabled OR (selling_price IS NOT NULL AND price_includes_vat IS NOT NULL AND vat_rate IS NOT NULL))
);
CREATE TABLE product_image (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id bigint NOT NULL REFERENCES product(id),
    asset_path text NOT NULL,
    alt_text text NOT NULL,
    match_status text NOT NULL CHECK (match_status IN ('matched','reference','pending')),
    source_url text,
    display_order integer NOT NULL DEFAULT 0
);
CREATE TABLE supplier (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name text NOT NULL UNIQUE
);
CREATE TABLE supplier_product (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    supplier_id bigint NOT NULL REFERENCES supplier(id),
    product_id bigint NOT NULL REFERENCES product(id),
    supplier_sku text,
    source_url text,
    reference_price numeric(14,2) CHECK (reference_price >= 0),
    reference_vat_basis text CHECK (reference_vat_basis IN ('inclusive','exclusive','unknown')),
    checked_at timestamptz,
    source_document text,
    source_row integer CHECK (source_row > 0),
    UNIQUE (supplier_id, product_id)
);
CREATE TABLE customer (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    organisation text,
    contact_name text NOT NULL,
    email text NOT NULL CHECK (btrim(email) <> ''),
    phone text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);
-- RFQ data has no retail prices. Quotations are separate, owner-issued records.
CREATE TABLE rfq (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    reference text NOT NULL UNIQUE,
    customer_id bigint NOT NULL REFERENCES customer(id),
    buyer_type text NOT NULL CHECK (buyer_type IN ('business','government')),
    purchase_type text NOT NULL CHECK (purchase_type IN ('once_off','repeat')),
    recurring_requested boolean NOT NULL DEFAULT false,
    recurrence_notes text,
    procurement_reference text,
    response_deadline timestamptz,
    alternatives_allowed boolean NOT NULL DEFAULT false,
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','submitted','in_review','quoted','closed','cancelled')),
    contact_snapshot jsonb NOT NULL CHECK (jsonb_typeof(contact_snapshot) = 'object'),
    notes text,
    submitted_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    CHECK (NOT recurring_requested OR purchase_type = 'repeat')
);
CREATE TABLE rfq_item (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    rfq_id bigint NOT NULL REFERENCES rfq(id),
    product_id bigint REFERENCES product(id),
    description text NOT NULL CHECK (btrim(description) <> ''),
    quantity integer NOT NULL CHECK (quantity > 0),
    ordering_unit text NOT NULL,
    school_context jsonb,
    replacement_notes text,
    display_order integer NOT NULL DEFAULT 0,
    UNIQUE (rfq_id, id)
);
CREATE TABLE rfq_delivery (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    rfq_id bigint NOT NULL REFERENCES rfq(id),
    street text NOT NULL,
    suburb text,
    city text NOT NULL,
    province text NOT NULL CHECK (province IN ('Eastern Cape','Free State','Gauteng','KwaZulu-Natal','Limpopo','Mpumalanga','North West','Northern Cape','Western Cape')),
    postal_code text NOT NULL CHECK (postal_code ~ '^[0-9]{4}$'),
    contact_name text NOT NULL,
    phone text NOT NULL,
    required_date date,
    date_flexibility text NOT NULL CHECK (date_flexibility IN ('fixed','flexible','to_confirm'))
);
CREATE TABLE rfq_attachment (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    rfq_id bigint NOT NULL REFERENCES rfq(id),
    original_filename text NOT NULL,
    storage_key text NOT NULL UNIQUE,
    content_type text NOT NULL,
    size_bytes bigint NOT NULL CHECK (size_bytes > 0),
    scan_status text NOT NULL DEFAULT 'pending' CHECK (scan_status IN ('pending','clean','rejected')),
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE quotation (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    rfq_id bigint NOT NULL REFERENCES rfq(id),
    reference text NOT NULL UNIQUE,
    revision integer NOT NULL CHECK (revision > 0),
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','issued','accepted','declined','expired','superseded')),
    currency char(3) NOT NULL DEFAULT 'ZAR' CHECK (currency = 'ZAR'),
    delivery_ex_vat numeric(14,2) NOT NULL DEFAULT 0 CHECK (delivery_ex_vat >= 0),
    delivery_vat numeric(14,2) NOT NULL DEFAULT 0 CHECK (delivery_vat >= 0),
    valid_until date NOT NULL,
    terms text NOT NULL,
    issued_at timestamptz,
    emailed_at timestamptz,
    UNIQUE (rfq_id, revision),
    UNIQUE (id, rfq_id)
);
CREATE TABLE quotation_item (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    quotation_id bigint NOT NULL,
    rfq_id bigint NOT NULL,
    rfq_item_id bigint NOT NULL,
    description text NOT NULL,
    quantity integer NOT NULL CHECK (quantity > 0),
    ordering_unit text NOT NULL,
    unit_price_ex_vat numeric(14,2) NOT NULL CHECK (unit_price_ex_vat >= 0),
    vat_rate numeric(5,4) NOT NULL CHECK (vat_rate BETWEEN 0 AND 1),
    FOREIGN KEY (quotation_id, rfq_id) REFERENCES quotation(id, rfq_id),
    FOREIGN KEY (rfq_id, rfq_item_id) REFERENCES rfq_item(rfq_id, id),
    UNIQUE (quotation_id, rfq_item_id)
);
CREATE TABLE sales_order (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    reference text NOT NULL UNIQUE,
    customer_id bigint NOT NULL REFERENCES customer(id),
    quotation_id bigint UNIQUE REFERENCES quotation(id),
    source text NOT NULL CHECK (source IN ('checkout','quotation')),
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','awaiting_payment','confirmed','processing','dispatched','completed','cancelled')),
    contact_snapshot jsonb NOT NULL CHECK (jsonb_typeof(contact_snapshot) = 'object'),
    delivery_snapshot jsonb NOT NULL CHECK (jsonb_typeof(delivery_snapshot) IN ('object','array')),
    currency char(3) NOT NULL DEFAULT 'ZAR' CHECK (currency = 'ZAR'),
    subtotal_ex_vat numeric(14,2) NOT NULL CHECK (subtotal_ex_vat >= 0),
    vat_total numeric(14,2) NOT NULL CHECK (vat_total >= 0),
    delivery_ex_vat numeric(14,2) NOT NULL CHECK (delivery_ex_vat >= 0),
    total numeric(14,2) NOT NULL CHECK (total = subtotal_ex_vat + vat_total + delivery_ex_vat),
    purchase_order_storage_key text,
    authorised_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    CHECK ((source = 'quotation') = (quotation_id IS NOT NULL))
);
CREATE TABLE sales_order_item (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id bigint NOT NULL REFERENCES sales_order(id),
    product_id bigint REFERENCES product(id),
    description text NOT NULL,
    ordering_unit text NOT NULL,
    quantity integer NOT NULL CHECK (quantity > 0),
    unit_price_ex_vat numeric(14,2) NOT NULL CHECK (unit_price_ex_vat >= 0),
    vat_rate numeric(5,4) NOT NULL CHECK (vat_rate BETWEEN 0 AND 1)
);
CREATE TABLE payment (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id bigint NOT NULL REFERENCES sales_order(id),
    provider text NOT NULL DEFAULT 'peach',
    provider_reference text UNIQUE,
    idempotency_key text NOT NULL UNIQUE,
    amount numeric(14,2) NOT NULL CHECK (amount > 0),
    currency char(3) NOT NULL DEFAULT 'ZAR' CHECK (currency = 'ZAR'),
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','successful','failed','cancelled','refunded')),
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE payment_event (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    payment_id bigint NOT NULL REFERENCES payment(id),
    provider_event_id text NOT NULL UNIQUE,
    event_type text NOT NULL,
    received_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE school (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slug text NOT NULL UNIQUE,
    name text NOT NULL,
    active boolean NOT NULL DEFAULT true
);
CREATE TABLE school_list (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    school_id bigint NOT NULL REFERENCES school(id),
    grade text NOT NULL,
    academic_year integer CHECK (academic_year BETWEEN 2000 AND 2200),
    version integer NOT NULL DEFAULT 1 CHECK (version > 0),
    source_document text,
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived'))
);
CREATE UNIQUE INDEX school_list_version ON school_list (school_id, grade, COALESCE(academic_year, 0), version);
CREATE TABLE school_list_item (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    school_list_id bigint NOT NULL REFERENCES school_list(id),
    subject text,
    requested_description text NOT NULL,
    quantity_per_learner integer CHECK (quantity_per_learner > 0),
    requested_unit text NOT NULL,
    proposed_product_id bigint REFERENCES product(id),
    replacement_notes text,
    optional boolean NOT NULL DEFAULT false,
    reuse_existing boolean NOT NULL DEFAULT false,
    display_order integer NOT NULL DEFAULT 0
);
CREATE INDEX product_category ON product(category_id) WHERE active;
CREATE INDEX product_brand ON product(brand_id);
CREATE INDEX product_search ON product USING gin (to_tsvector('simple', name || ' ' || COALESCE(description,'')));
CREATE INDEX supplier_product_product ON supplier_product(product_id);
CREATE INDEX product_image_product ON product_image(product_id);
CREATE INDEX rfq_customer ON rfq(customer_id);
CREATE INDEX rfq_queue ON rfq(status, created_at DESC);
CREATE INDEX rfq_item_parent ON rfq_item(rfq_id);
CREATE INDEX rfq_delivery_parent ON rfq_delivery(rfq_id);
CREATE INDEX rfq_attachment_parent ON rfq_attachment(rfq_id);
CREATE INDEX quotation_item_parent ON quotation_item(quotation_id);
CREATE INDEX order_customer ON sales_order(customer_id);
CREATE INDEX order_item_parent ON sales_order_item(order_id);
CREATE INDEX payment_order ON payment(order_id);
CREATE INDEX payment_event_payment ON payment_event(payment_id);
CREATE INDEX school_list_item_parent ON school_list_item(school_list_id);
