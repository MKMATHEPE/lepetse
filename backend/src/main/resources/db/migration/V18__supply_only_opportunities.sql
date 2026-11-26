-- Retain search history while removing the IT profile from this supplies workspace.
ALTER TABLE opportunity_search ADD COLUMN archived boolean NOT NULL DEFAULT false;
UPDATE opportunity_search SET archived=true,daily_enabled=false,running_until=null,version=version+1 WHERE name='Namaro IT';
UPDATE opportunity_search SET name='Supply opportunities',
 keywords='stationery, office supplies, office consumables, exercise books, photocopy paper, writing materials, tissues, tissue paper, toilet paper, paper towels, hygiene products, hygiene supplies, sanitary products, cleaning supplies, cleaning materials, cleaning chemicals, detergents, disinfectants, refuse bags, bin liners, mops, brooms, janitorial supplies, personal protective equipment, PPE, office furniture, supply and delivery, supply & delivery',
 exclusions='consulting services, consultancy services, professional services, construction works, civil works, building construction, cleaning services, janitorial services, IT services, software development, website hosting, web development',
 criteria='Goods that Lepetse can source and resell: stationery, office consumables, tissues, toilet paper, hygiene products, cleaning chemicals, cleaning equipment, protective equipment, furniture and other supply-and-delivery requirements. Focus on goods, not labour or service contracts. Verify quantities, approved alternatives, supplier costs and stock, transport, upfront capital, delivery locations and mandatory tender documents before pursuing.',
 version=version+1 WHERE name='Lepetse stationery';
