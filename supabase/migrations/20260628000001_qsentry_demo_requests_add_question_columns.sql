/*
  # Add missing columns to qsentry_demo_requests

  The table was created from an earlier version of the migration, before the
  multi-step demo form added the demo type + 3 qualifying questions. The /qsentry
  form now sends these fields, so the insert failed with PGRST204
  ("Could not find the 'access_gate' column"). This patch adds them idempotently.

  - `demo_type`      — 'onsite' (Klang Valley) or 'virtual'
  - `current_system` — what system the gym uses now (Manual / SaaS: x / Others: x)
  - `access_gate`    — 'turnstile' / 'door' / 'manual'
  - `interests`      — array of products they're interested in
*/

ALTER TABLE qsentry_demo_requests
  ADD COLUMN IF NOT EXISTS demo_type text,
  ADD COLUMN IF NOT EXISTS current_system text,
  ADD COLUMN IF NOT EXISTS access_gate text,
  ADD COLUMN IF NOT EXISTS interests jsonb NOT NULL DEFAULT '[]'::jsonb;
