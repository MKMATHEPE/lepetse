alter table storefront_settings
    add column rotate_catalogue_banner boolean not null default true,
    add column show_footer_whatsapp boolean not null default true;
