/*
  Extend quotesys_custom_items so user-added items can target any catalog
  category (hardware, software, setup, delivery, custom) — not just the
  generic "custom" bucket. Also store an optional subcategory so the new
  items group correctly alongside the built-in catalog rows.

  Existing rows default to 'custom' to preserve current behavior.
*/

ALTER TABLE quotesys_custom_items
  ADD COLUMN IF NOT EXISTS category    text NOT NULL DEFAULT 'custom',
  ADD COLUMN IF NOT EXISTS subcategory text;

-- Match the CategoryId union enforced in the app.
ALTER TABLE quotesys_custom_items
  DROP CONSTRAINT IF EXISTS quotesys_custom_items_category_check;

ALTER TABLE quotesys_custom_items
  ADD CONSTRAINT quotesys_custom_items_category_check
  CHECK (category IN ('hardware', 'software', 'setup', 'delivery', 'custom'));

CREATE INDEX IF NOT EXISTS idx_quotesys_custom_items_category
  ON quotesys_custom_items(tool, category);
