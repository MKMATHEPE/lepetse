CREATE TABLE admin_workspace_preference (
    admin_user_id bigint PRIMARY KEY REFERENCES admin_user(id) ON DELETE CASCADE,
    preferences jsonb NOT NULL CHECK (jsonb_typeof(preferences)='object'),
    updated_at timestamptz NOT NULL DEFAULT now()
);
