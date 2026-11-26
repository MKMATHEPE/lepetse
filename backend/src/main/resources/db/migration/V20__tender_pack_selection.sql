ALTER TABLE tender_file ADD COLUMN pack_included boolean NOT NULL DEFAULT false;
UPDATE tender_file SET pack_included=true WHERE kind IN ('returnable','supporting');
