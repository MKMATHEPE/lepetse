CREATE TABLE tender_file (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 opportunity_id bigint REFERENCES work_opportunity(id),
 kind text NOT NULL CHECK(kind IN ('company','tender','returnable','supporting','proof')),
 label text NOT NULL,
 document_type text NOT NULL DEFAULT 'other',
 filename text NOT NULL,
 content_type text NOT NULL,
 content bytea NOT NULL,
 sha256 text NOT NULL,
 expires_on date,
 uploaded_by text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 CHECK((kind='company')=(opportunity_id IS NULL))
);
CREATE TABLE tender_requirement (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 opportunity_id bigint NOT NULL REFERENCES work_opportunity(id),
 title text NOT NULL,
 category text NOT NULL CHECK(category IN ('document','eligibility','briefing','submission','evaluation','other')),
 mandatory boolean NOT NULL DEFAULT true,
 status text NOT NULL DEFAULT 'todo' CHECK(status IN ('todo','done','not_applicable')),
 notes text NOT NULL DEFAULT '',
 document_id bigint REFERENCES tender_file(id),
 signature_required boolean NOT NULL DEFAULT false,
 signature_confirmed boolean NOT NULL DEFAULT false,
 source_file_id bigint REFERENCES tender_file(id),
 source_page integer,
 source_excerpt text NOT NULL DEFAULT '',
 source_key text,
 version integer NOT NULL DEFAULT 1,
 updated_by text NOT NULL,
 updated_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(opportunity_id,source_key)
);
CREATE TABLE tender_submission (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 opportunity_id bigint NOT NULL REFERENCES work_opportunity(id),
 submitted_at timestamptz NOT NULL,
 channel text NOT NULL,
 recipient text NOT NULL,
 confirmation text NOT NULL DEFAULT '',
 proof_file_id bigint REFERENCES tender_file(id),
 recorded_by text NOT NULL,
 submission_key uuid NOT NULL UNIQUE,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX tender_requirement_opportunity ON tender_requirement(opportunity_id,id);
CREATE INDEX tender_file_opportunity ON tender_file(opportunity_id,id);
