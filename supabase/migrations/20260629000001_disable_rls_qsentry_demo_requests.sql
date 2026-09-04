/*
  # Disable RLS on qsentry_demo_requests

  This project uses service-layer isolation (RLS disabled on all tables). The
  qsentry table was created with RLS enabled + an anon-INSERT-only policy, which
  meant submissions saved but could not be read back with the public anon key.
  Disable RLS so leads are readable, matching the rest of the project.
*/

ALTER TABLE qsentry_demo_requests DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit a qsentry demo request" ON qsentry_demo_requests;
DROP POLICY IF EXISTS "Authenticated users can manage qsentry demo requests" ON qsentry_demo_requests;
