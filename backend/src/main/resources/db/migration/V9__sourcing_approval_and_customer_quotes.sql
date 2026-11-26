ALTER TABLE rfq DROP CONSTRAINT rfq_status_check;
ALTER TABLE rfq ADD CONSTRAINT rfq_status_check CHECK(status IN ('draft','submitted','in_review','approved','quoted','closed','cancelled'));
ALTER TABLE rfq DROP CONSTRAINT rfq_buyer_type_check;
ALTER TABLE rfq ADD CONSTRAINT rfq_buyer_type_check CHECK(buyer_type IN ('business','government','schools'));
CREATE TABLE rfq_pricing_work (
 rfq_id bigint PRIMARY KEY REFERENCES rfq(id),
 sourcing_version bigint NOT NULL DEFAULT 0,
 sourcing_draft jsonb NOT NULL DEFAULT '{"lines":[]}',
 approval_version bigint NOT NULL DEFAULT 0,
 approval jsonb,
 approved_by text, approved_at timestamptz,
 quote_version bigint NOT NULL DEFAULT 0,
 quote_draft jsonb,
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE rfq_pricing_event (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 rfq_id bigint NOT NULL REFERENCES rfq(id), actor text NOT NULL,
 event_type text NOT NULL, summary text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX rfq_pricing_event_parent ON rfq_pricing_event(rfq_id,id DESC);
ALTER TABLE quotation ADD COLUMN creation_key uuid UNIQUE;
ALTER TABLE quotation ADD COLUMN customer_snapshot jsonb;
ALTER TABLE quotation ADD COLUMN created_by text;
ALTER TABLE quotation ADD COLUMN created_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE quotation ADD COLUMN sent_to text;
ALTER TABLE quotation ADD COLUMN approval_version bigint;
ALTER TABLE quotation ADD COLUMN draft_version bigint;
ALTER TABLE quotation_item ADD COLUMN supplier_cost_snapshot jsonb;
