alter table storefront_settings
    add column featured_product_ids text[] not null default array[
        'waltons-801215', 'waltons-21924804', 'waltons-578138',
        'waltons-811436', 'waltons-723117', 'waltons-302116'
    ];
