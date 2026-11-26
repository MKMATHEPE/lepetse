CREATE TABLE supplier_quote (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 supplier_id bigint NOT NULL REFERENCES supplier(id),
 reference text NOT NULL, quote_date date NOT NULL, valid_until date,
 terms text NOT NULL DEFAULT '', delivery_notes text NOT NULL DEFAULT '',
 created_by text NOT NULL, created_at timestamptz NOT NULL DEFAULT now(),
 document bytea, document_name text,
 UNIQUE(supplier_id,reference),
 CHECK(valid_until IS NULL OR valid_until>=quote_date)
);
CREATE TABLE supplier_quote_line (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 quote_id bigint NOT NULL REFERENCES supplier_quote(id),
 supplier_sku text NOT NULL, description text NOT NULL,
 product_id bigint REFERENCES product(id),
 match_type text NOT NULL CHECK(match_type IN ('exact','alternative','unmatched')),
 pack_label text NOT NULL, units_per_pack integer NOT NULL CHECK(units_per_pack>0),
 pack_price_ex_vat numeric(14,4) NOT NULL CHECK(pack_price_ex_vat>=0),
 quoted_packs integer NOT NULL CHECK(quoted_packs>0),
 availability text NOT NULL DEFAULT 'Unconfirmed',
 lead_time text NOT NULL DEFAULT '',
 CHECK((product_id IS NULL)=(match_type='unmatched'))
);
CREATE INDEX supplier_quote_supplier_idx ON supplier_quote(supplier_id);
CREATE INDEX supplier_quote_line_quote_idx ON supplier_quote_line(quote_id);
CREATE INDEX supplier_quote_line_product_idx ON supplier_quote_line(product_id) WHERE product_id IS NOT NULL;
CREATE TABLE product_price_decision (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 product_id bigint NOT NULL REFERENCES product(id),
 supplier_quote_line_id bigint NOT NULL REFERENCES supplier_quote_line(id),
 landed_cost numeric(14,4) NOT NULL CHECK(landed_cost>=0),
 markup_percent numeric(8,3) NOT NULL CHECK(markup_percent BETWEEN 0 AND 10000),
 selling_price numeric(14,2) NOT NULL CHECK(selling_price>=0),
 price_includes_vat boolean NOT NULL, vat_rate numeric(5,4) NOT NULL CHECK(vat_rate BETWEEN 0 AND 1),
 actor text NOT NULL, approved_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX product_price_decision_product_idx ON product_price_decision(product_id,approved_at DESC);
