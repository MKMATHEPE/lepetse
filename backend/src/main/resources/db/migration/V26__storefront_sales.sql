create table storefront_sale (
    product_id bigint primary key references product(id) on delete cascade,
    amount_minor bigint not null check (amount_minor > 0),
    starts_at timestamptz not null,
    ends_at timestamptz not null,
    check (ends_at > starts_at)
);
