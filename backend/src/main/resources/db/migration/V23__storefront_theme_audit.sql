alter table storefront_settings
    add column applied_by text,
    add column applied_at timestamp with time zone;
