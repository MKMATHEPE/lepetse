ALTER TABLE product ADD COLUMN source_snapshot jsonb NOT NULL DEFAULT '{}';
ALTER TABLE school_list_item ADD COLUMN source_key text;
ALTER TABLE school_list_item ADD COLUMN source_snapshot jsonb NOT NULL DEFAULT '{}';
ALTER TABLE school_list_item ADD COLUMN conversion_required integer NOT NULL DEFAULT 1 CHECK (conversion_required > 0);
ALTER TABLE school_list_item ADD COLUMN conversion_supplied integer NOT NULL DEFAULT 1 CHECK (conversion_supplied > 0);
CREATE UNIQUE INDEX school_item_source ON school_list_item(school_list_id, source_key);
ALTER TABLE supplier_product ADD COLUMN source_snapshot jsonb NOT NULL DEFAULT '{}';
ALTER TABLE product_image ADD COLUMN source_snapshot jsonb NOT NULL DEFAULT '{}';
CREATE TABLE product_replacement (
    original_product_id bigint PRIMARY KEY REFERENCES product(id),
    proposed_product_id bigint NOT NULL REFERENCES product(id),
    CHECK (original_product_id <> proposed_product_id)
);
-- Research references are never selling prices and need not be wholesale suppliers.
CREATE TABLE product_price_reference (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id bigint NOT NULL REFERENCES product(id),
    retailer text NOT NULL,
    amount numeric(14,2) NOT NULL CHECK (amount >= 0),
    currency char(3) NOT NULL CHECK (currency = 'ZAR'),
    source_url text NOT NULL,
    checked_on date,
    source_snapshot jsonb NOT NULL,
    UNIQUE (product_id, retailer, source_url)
);
