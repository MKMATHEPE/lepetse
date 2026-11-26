-- Supplier-specific purchasing and banking details; text preserves leading zeros.
ALTER TABLE supplier
 ADD COLUMN cod_number text NOT NULL DEFAULT '',
 ADD COLUMN sales_person text NOT NULL DEFAULT '',
 ADD COLUMN bank_name text NOT NULL DEFAULT '',
 ADD COLUMN account_name text NOT NULL DEFAULT '',
 ADD COLUMN account_number text NOT NULL DEFAULT '',
 ADD COLUMN branch_name text NOT NULL DEFAULT '',
 ADD COLUMN branch_code text NOT NULL DEFAULT '',
 ADD COLUMN electronic_branch_code text NOT NULL DEFAULT '';
