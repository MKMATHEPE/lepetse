create table storefront_settings (
    singleton boolean primary key default true check (singleton),
    theme text not null check (theme in ('classic', 'charcoal'))
);

insert into storefront_settings (theme) values ('classic');
