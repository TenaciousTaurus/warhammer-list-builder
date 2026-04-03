-- Organisations: clubs, gaming groups, communities
CREATE TABLE organisations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id),
  name text NOT NULL,
  description text,
  is_public boolean NOT NULL DEFAULT false,
  share_code text UNIQUE NOT NULL DEFAULT substring(md5(random()::text), 1, 8),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE organisation_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id uuid NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  display_name text NOT NULL,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(organisation_id, user_id)
);

-- Indexes
CREATE INDEX idx_organisations_owner ON organisations (owner_id);
CREATE INDEX idx_organisations_public ON organisations (is_public) WHERE is_public = true;
CREATE INDEX idx_org_members_org ON organisation_members (organisation_id);
CREATE INDEX idx_org_members_user ON organisation_members (user_id);

-- Auto-update updated_at
CREATE TRIGGER organisations_updated_at
  BEFORE UPDATE ON organisations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- RLS
ALTER TABLE organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organisation_members ENABLE ROW LEVEL SECURITY;

-- Organisations: owner CRUD
CREATE POLICY "Owner can manage own organisations"
  ON organisations FOR ALL
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Organisations: members can view
CREATE POLICY "Members can view their organisations"
  ON organisations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organisation_members
      WHERE organisation_members.organisation_id = organisations.id
        AND organisation_members.user_id = auth.uid()
    )
  );

-- Organisations: public read
CREATE POLICY "Anyone can view public organisations"
  ON organisations FOR SELECT
  TO authenticated
  USING (is_public = true);

-- Members: visible to other members of same org
CREATE POLICY "Members can view org members"
  ON organisation_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organisation_members AS om
      WHERE om.organisation_id = organisation_members.organisation_id
        AND om.user_id = auth.uid()
    )
  );

-- Members: users can join via insert (if org allows)
CREATE POLICY "Users can join organisations"
  ON organisation_members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Members: users can leave (delete own membership)
CREATE POLICY "Users can leave organisations"
  ON organisation_members FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Members: owner/admin can manage members
CREATE POLICY "Org admins can manage members"
  ON organisation_members FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organisation_members AS om
      WHERE om.organisation_id = organisation_members.organisation_id
        AND om.user_id = auth.uid()
        AND om.role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organisation_members AS om
      WHERE om.organisation_id = organisation_members.organisation_id
        AND om.user_id = auth.uid()
        AND om.role IN ('owner', 'admin')
    )
  );
