CREATE TABLE work_opportunity (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 buyer text NOT NULL,
 reference text NOT NULL,
 details jsonb NOT NULL,
 progress text NOT NULL DEFAULT 'new' CHECK(progress IN ('new','pursuing','submitted','closed','dismissed')),
 rfq_id bigint UNIQUE REFERENCES rfq(id),
 version integer NOT NULL DEFAULT 1,
 change_notice text NOT NULL DEFAULT '',
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX work_opportunity_identity ON work_opportunity(lower(btrim(buyer)),lower(btrim(reference)));
