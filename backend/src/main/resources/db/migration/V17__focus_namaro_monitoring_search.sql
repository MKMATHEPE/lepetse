-- Keep monitoring tied to Namaro's technical scope, preserving owner-edited profiles.
UPDATE opportunity_search SET keywords=replace(keywords,', monitoring',', server monitoring')
WHERE name='Namaro IT' AND keywords='website development, website hosting, web development, linux, database, automation, application support, software development, monitoring, hosting';
