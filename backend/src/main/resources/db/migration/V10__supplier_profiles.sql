ALTER TABLE supplier ADD COLUMN contact_name text NOT NULL DEFAULT '';
ALTER TABLE supplier ADD COLUMN email text NOT NULL DEFAULT '';
ALTER TABLE supplier ADD COLUMN phone text NOT NULL DEFAULT '';
ALTER TABLE supplier ADD COLUMN address text NOT NULL DEFAULT '';
ALTER TABLE supplier ADD COLUMN payment_terms text NOT NULL DEFAULT '';
ALTER TABLE supplier ADD COLUMN delivery_notes text NOT NULL DEFAULT '';
ALTER TABLE supplier ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
