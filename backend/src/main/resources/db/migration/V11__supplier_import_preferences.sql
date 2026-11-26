ALTER TABLE supplier ADD COLUMN import_columns jsonb NOT NULL DEFAULT '{}';
ALTER TABLE supplier_quote ADD COLUMN source_sha256 text;
CREATE UNIQUE INDEX supplier_quote_source_unique ON supplier_quote(supplier_id,source_sha256) WHERE source_sha256 IS NOT NULL;
