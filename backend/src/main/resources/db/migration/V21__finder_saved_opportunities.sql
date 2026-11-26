ALTER TABLE work_opportunity DROP CONSTRAINT work_opportunity_progress_check;
ALTER TABLE work_opportunity ADD CONSTRAINT work_opportunity_progress_check CHECK(progress IN ('new','saved','pursuing','submitted','closed','dismissed'));
