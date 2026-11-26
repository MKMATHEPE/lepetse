-- Broaden the initial phrase without overwriting owner-edited search terms.
UPDATE opportunity_search SET keywords=keywords||', hosting'
WHERE name='Namaro IT' AND keywords='website development, website hosting, web development, linux, database, automation, application support, software development, monitoring';
