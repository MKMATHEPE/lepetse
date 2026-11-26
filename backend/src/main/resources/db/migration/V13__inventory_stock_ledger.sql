CREATE TABLE inventory_balance (
 product_id bigint PRIMARY KEY REFERENCES product(id),
 on_hand bigint NOT NULL DEFAULT 0 CHECK(on_hand BETWEEN 0 AND 999999999),
 reserved bigint NOT NULL DEFAULT 0 CHECK(reserved>=0 AND reserved<=on_hand),
 initialized boolean NOT NULL DEFAULT false,
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE inventory_movement (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 submission_key uuid NOT NULL UNIQUE,
 product_id bigint NOT NULL REFERENCES product(id),
 movement_type text NOT NULL CHECK(movement_type IN ('opening','receive','dispatch','adjust','reserve','release')),
 quantity bigint NOT NULL,
 from_reserved boolean NOT NULL DEFAULT false,
 on_hand_delta bigint NOT NULL,
 reserved_delta bigint NOT NULL,
 balance_after bigint NOT NULL,
 reserved_after bigint NOT NULL,
 reference text NOT NULL DEFAULT '',
 reason text NOT NULL,
 actor text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX inventory_movement_product_date ON inventory_movement(product_id,id DESC);
