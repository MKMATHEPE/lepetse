ALTER TABLE rfq ADD COLUMN admin_response_due_at timestamptz;
CREATE TABLE rfq_internal_note (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    rfq_id bigint NOT NULL REFERENCES rfq(id),
    author_username text NOT NULL,
    body text NOT NULL CHECK (char_length(btrim(body)) BETWEEN 1 AND 4000),
    submission_key uuid NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (rfq_id,submission_key)
);
CREATE INDEX rfq_internal_note_request ON rfq_internal_note(rfq_id,id);
CREATE INDEX rfq_response_target ON rfq(admin_response_due_at) WHERE status IN ('submitted','in_review');
CREATE TABLE rfq_response_target_change (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    rfq_id bigint NOT NULL REFERENCES rfq(id),
    actor_username text NOT NULL,
    previous_due_at timestamptz,
    new_due_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX rfq_target_change_request ON rfq_response_target_change(rfq_id,id);
