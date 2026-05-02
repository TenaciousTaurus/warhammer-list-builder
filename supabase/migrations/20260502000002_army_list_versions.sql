-- W1-2: Army list versioning
-- Stores a full JSONB snapshot of a list after every meaningful change.
-- Enables the future list history UI (W2-10) to show diffs and restore.

CREATE TABLE IF NOT EXISTS army_list_versions (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id     UUID        NOT NULL REFERENCES army_lists(id) ON DELETE CASCADE,
  snapshot    JSONB       NOT NULL,
  changed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  change_note TEXT
);

CREATE INDEX IF NOT EXISTS idx_army_list_versions_list_id    ON army_list_versions(list_id);
CREATE INDEX IF NOT EXISTS idx_army_list_versions_changed_at ON army_list_versions(list_id, changed_at DESC);

-- Owner-only RLS
ALTER TABLE army_list_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_select_versions" ON army_list_versions
  FOR SELECT USING (
    list_id IN (SELECT id FROM army_lists WHERE user_id = auth.uid())
  );

CREATE POLICY "owner_insert_versions" ON army_list_versions
  FOR INSERT WITH CHECK (
    list_id IN (SELECT id FROM army_lists WHERE user_id = auth.uid())
  );

CREATE POLICY "owner_delete_versions" ON army_list_versions
  FOR DELETE USING (
    list_id IN (SELECT id FROM army_lists WHERE user_id = auth.uid())
  );
