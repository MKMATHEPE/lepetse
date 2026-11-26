CREATE TABLE opportunity_search (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 name text NOT NULL UNIQUE,
 keywords text NOT NULL,
 exclusions text NOT NULL DEFAULT '',
 criteria text NOT NULL DEFAULT '',
 daily_enabled boolean NOT NULL DEFAULT true,
 run_time time NOT NULL DEFAULT '08:00',
 next_run_at timestamptz NOT NULL DEFAULT now(),
 running_until timestamptz,
 last_started_at timestamptz,
 last_success_at timestamptz,
 last_finished_at timestamptz,
 last_status text NOT NULL DEFAULT 'not_run',
 last_message text NOT NULL DEFAULT '',
 version integer NOT NULL DEFAULT 1
);
INSERT INTO opportunity_search(name,keywords,exclusions,criteria) VALUES
 ('Lepetse stationery','stationery, office supplies, exercise books, photocopy paper, writing materials','', 'Stationery supply for offices, schools and government. Confirm buying costs, available stock, delivery area, capital required and mandatory returnables before pursuing.'),
 ('Namaro IT','website development, website hosting, web development, linux, database, automation, application support, software development, monitoring','hardware supply, printer supply, adobe licences','One-person delivery capacity; approximately R10,000 upfront-capital ceiling; limited company-reference history. Prefer website development, hosting, Linux/server support, databases and automation. Verify mandatory experience, certifications, briefing, submission method and payment terms in official documents.');
CREATE TABLE opportunity_discovery_source (
 ocid text PRIMARY KEY,
 opportunity_id bigint NOT NULL REFERENCES work_opportunity(id),
 source_date timestamptz,
 fingerprint text NOT NULL,
 last_checked_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE opportunity_search_match (
 search_id bigint NOT NULL REFERENCES opportunity_search(id),
 opportunity_id bigint NOT NULL REFERENCES work_opportunity(id),
 PRIMARY KEY(search_id,opportunity_id)
);
UPDATE opportunity_search SET next_run_at=((now() AT TIME ZONE 'Africa/Johannesburg')::date + CASE WHEN (now() AT TIME ZONE 'Africa/Johannesburg')::time<'08:00'::time THEN 0 ELSE 1 END + '08:00'::time) AT TIME ZONE 'Africa/Johannesburg';
