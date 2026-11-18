CREATE SEQUENCE rfq_reference_number;
ALTER TABLE rfq ADD COLUMN submission_key uuid UNIQUE;
ALTER TABLE rfq ADD COLUMN submission_hash text;
ALTER TABLE rfq ADD COLUMN submission_source text CHECK (submission_source IN ('catalogue','document'));
ALTER TABLE rfq ADD COLUMN requirement_snapshot jsonb NOT NULL DEFAULT '{}';
ALTER TABLE rfq_delivery ADD COLUMN address_complete boolean NOT NULL DEFAULT true;
ALTER TABLE rfq_delivery ADD COLUMN instructions text;
ALTER TABLE rfq_delivery ADD COLUMN building text;
ALTER TABLE rfq_attachment ADD COLUMN sha256 text;
