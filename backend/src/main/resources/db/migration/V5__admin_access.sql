CREATE TABLE admin_user (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username text NOT NULL UNIQUE CHECK (btrim(username) <> ''),
    password_hash text NOT NULL,
    enabled boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    CHECK (username=lower(username))
);
CREATE TABLE rfq_activity (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    rfq_id bigint NOT NULL REFERENCES rfq(id),
    actor_username text NOT NULL,
    previous_status text NOT NULL,
    new_status text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX rfq_activity_request ON rfq_activity(rfq_id,created_at);
