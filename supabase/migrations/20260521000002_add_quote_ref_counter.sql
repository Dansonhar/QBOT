/*
  # Quote ref running number

  Replace the random ref scheme (QSYS-YYYYMMDD-XXXX, QS-<public_id>) with a
  predictable running number per tool:
    - QuoteSys    → QF0001, QF0002, ...
    - QuoteStudio → QS0001, QS0002, ...

  Two tools, two counters, claimed via an atomic SQL function.

  1. Counter table   — quotesys_quote_counters (tool PK, last_seq int)
  2. Claim function  — quotesys_claim_next_seq(p_tool) returns the next int
  3. seq_no column   — added to quotestudio_requests so the running number
                       is permanently associated with each submitted quote
*/

CREATE TABLE IF NOT EXISTS quotesys_quote_counters (
  tool text PRIMARY KEY CHECK (tool IN ('quotesys', 'quotestudio')),
  last_seq integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO quotesys_quote_counters (tool, last_seq) VALUES
  ('quotesys', 0),
  ('quotestudio', 0)
ON CONFLICT (tool) DO NOTHING;

ALTER TABLE quotesys_quote_counters ENABLE ROW LEVEL SECURITY;

-- We only ever mutate via the SECURITY DEFINER function below; lock down
-- direct table access except read.
DROP POLICY IF EXISTS "Anon read counters" ON quotesys_quote_counters;
CREATE POLICY "Anon read counters" ON quotesys_quote_counters FOR SELECT TO anon USING (true);

-- Atomic increment + return.
CREATE OR REPLACE FUNCTION quotesys_claim_next_seq(p_tool text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_seq integer;
BEGIN
  IF p_tool NOT IN ('quotesys', 'quotestudio') THEN
    RAISE EXCEPTION 'Invalid tool: %', p_tool;
  END IF;

  INSERT INTO quotesys_quote_counters (tool, last_seq)
  VALUES (p_tool, 1)
  ON CONFLICT (tool) DO UPDATE
    SET last_seq = quotesys_quote_counters.last_seq + 1,
        updated_at = now()
  RETURNING last_seq INTO v_seq;

  RETURN v_seq;
END $$;

GRANT EXECUTE ON FUNCTION quotesys_claim_next_seq(text) TO anon, authenticated;

-- Add seq_no to quotestudio_requests so the running number sticks with the
-- quote. Nullable: existing rows pre-migration won't have one and will fall
-- back to a public_id-based display.
ALTER TABLE quotestudio_requests
  ADD COLUMN IF NOT EXISTS seq_no integer;

CREATE INDEX IF NOT EXISTS idx_quotestudio_seq_no ON quotestudio_requests(seq_no);
