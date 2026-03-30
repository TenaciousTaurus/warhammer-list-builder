-- ============================================================
-- Phase 3: Collection & Hobby Tracker
-- ============================================================

-- ============================================================
-- GAME DATA: Paint Library (public read)
-- ============================================================

CREATE TABLE public.paint_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  range_name text NOT NULL DEFAULT '',
  paint_name text NOT NULL,
  paint_type text NOT NULL CHECK (paint_type IN (
    'base', 'layer', 'shade', 'dry', 'contrast', 'technical',
    'air', 'spray', 'ink', 'wash', 'primer', 'varnish', 'medium'
  )),
  hex_color text,
  is_metallic boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.paint_library ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read paint library" ON public.paint_library FOR SELECT USING (true);

CREATE INDEX idx_paint_library_brand ON public.paint_library (brand);
CREATE INDEX idx_paint_library_type ON public.paint_library (paint_type);

-- ============================================================
-- USER DATA: Collection (owner-only via RLS)
-- ============================================================

-- Collection entries — what minis you physically own
CREATE TABLE public.collection_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  unit_id uuid REFERENCES public.units(id),
  faction_id uuid REFERENCES public.factions(id),
  custom_name text,
  quantity integer NOT NULL DEFAULT 1,
  painting_status text NOT NULL CHECK (painting_status IN (
    'unbuilt', 'assembled', 'primed', 'basecoated', 'detailed', 'based', 'finished'
  )) DEFAULT 'unbuilt',
  purchase_price numeric(10, 2),
  purchase_date date,
  finished_date date,
  notes text,
  photos text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.collection_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner select collection" ON public.collection_entries
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Owner insert collection" ON public.collection_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner update collection" ON public.collection_entries
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner delete collection" ON public.collection_entries
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_collection_entries_user ON public.collection_entries (user_id);
CREATE INDEX idx_collection_entries_status ON public.collection_entries (user_id, painting_status);
CREATE INDEX idx_collection_entries_faction ON public.collection_entries (user_id, faction_id);

CREATE TRIGGER collection_entries_updated_at
  BEFORE UPDATE ON public.collection_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Wishlist items
CREATE TABLE public.wishlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  unit_id uuid REFERENCES public.units(id),
  faction_id uuid REFERENCES public.factions(id),
  name text NOT NULL,
  estimated_price numeric(10, 2),
  priority integer NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner select wishlist" ON public.wishlist_items
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Owner insert wishlist" ON public.wishlist_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner update wishlist" ON public.wishlist_items
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner delete wishlist" ON public.wishlist_items
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_wishlist_items_user ON public.wishlist_items (user_id);

-- Paint recipes
CREATE TABLE public.paint_recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  unit_id uuid REFERENCES public.units(id),
  faction_id uuid REFERENCES public.factions(id),
  is_public boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.paint_recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner select own recipes" ON public.paint_recipes
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public read shared recipes" ON public.paint_recipes
  FOR SELECT USING (is_public = true);
CREATE POLICY "Owner insert recipes" ON public.paint_recipes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner update recipes" ON public.paint_recipes
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner delete recipes" ON public.paint_recipes
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_paint_recipes_user ON public.paint_recipes (user_id);

CREATE TRIGGER paint_recipes_updated_at
  BEFORE UPDATE ON public.paint_recipes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Paint recipe steps
CREATE TABLE public.paint_recipe_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid NOT NULL REFERENCES public.paint_recipes(id) ON DELETE CASCADE,
  step_order integer NOT NULL,
  paint_id uuid REFERENCES public.paint_library(id),
  technique text NOT NULL CHECK (technique IN (
    'base', 'layer', 'shade', 'drybrush', 'edge_highlight',
    'wash', 'contrast', 'airbrush', 'glaze', 'stipple', 'wetblend', 'other'
  )) DEFAULT 'base',
  area_description text,
  notes text,
  photo_url text,
  UNIQUE(recipe_id, step_order)
);

ALTER TABLE public.paint_recipe_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner select recipe steps" ON public.paint_recipe_steps
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.paint_recipes pr
      WHERE pr.id = paint_recipe_steps.recipe_id
      AND (pr.user_id = auth.uid() OR pr.is_public = true)
    )
  );
CREATE POLICY "Owner insert recipe steps" ON public.paint_recipe_steps
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.paint_recipes pr
      WHERE pr.id = paint_recipe_steps.recipe_id
      AND pr.user_id = auth.uid()
    )
  );
CREATE POLICY "Owner update recipe steps" ON public.paint_recipe_steps
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.paint_recipes pr
      WHERE pr.id = paint_recipe_steps.recipe_id
      AND pr.user_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.paint_recipes pr
      WHERE pr.id = paint_recipe_steps.recipe_id
      AND pr.user_id = auth.uid()
    )
  );
CREATE POLICY "Owner delete recipe steps" ON public.paint_recipe_steps
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.paint_recipes pr
      WHERE pr.id = paint_recipe_steps.recipe_id
      AND pr.user_id = auth.uid()
    )
  );

CREATE INDEX idx_paint_recipe_steps_recipe ON public.paint_recipe_steps (recipe_id);

-- User paint inventory (what paints you own)
CREATE TABLE public.user_paint_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  paint_id uuid NOT NULL REFERENCES public.paint_library(id),
  in_stock boolean NOT NULL DEFAULT true,
  quantity integer NOT NULL DEFAULT 1,
  UNIQUE(user_id, paint_id)
);

ALTER TABLE public.user_paint_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner select paint inventory" ON public.user_paint_inventory
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Owner insert paint inventory" ON public.user_paint_inventory
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner update paint inventory" ON public.user_paint_inventory
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner delete paint inventory" ON public.user_paint_inventory
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_user_paint_inventory_user ON public.user_paint_inventory (user_id);

-- ============================================================
-- SEED: Common Citadel paints (subset — full library is large)
-- ============================================================

INSERT INTO public.paint_library (brand, range_name, paint_name, paint_type, hex_color, is_metallic) VALUES
-- Citadel Base
('Citadel', 'Base', 'Abaddon Black', 'base', '#231F20', false),
('Citadel', 'Base', 'Averland Sunset', 'base', '#FDB825', false),
('Citadel', 'Base', 'Balthasar Gold', 'base', '#A47552', true),
('Citadel', 'Base', 'Bugman''s Glow', 'base', '#834F44', false),
('Citadel', 'Base', 'Caliban Green', 'base', '#003D15', false),
('Citadel', 'Base', 'Celestra Grey', 'base', '#90A8A8', false),
('Citadel', 'Base', 'Corax White', 'base', '#FFFFFF', false),
('Citadel', 'Base', 'Death Guard Green', 'base', '#6D7144', false),
('Citadel', 'Base', 'Grey Seer', 'base', '#A2A5A7', false),
('Citadel', 'Base', 'Kantor Blue', 'base', '#02134E', false),
('Citadel', 'Base', 'Khorne Red', 'base', '#6A0001', false),
('Citadel', 'Base', 'Leadbelcher', 'base', '#888B8D', true),
('Citadel', 'Base', 'Macragge Blue', 'base', '#0D407F', false),
('Citadel', 'Base', 'Mechanicus Standard Grey', 'base', '#39484A', false),
('Citadel', 'Base', 'Mephiston Red', 'base', '#960C09', false),
('Citadel', 'Base', 'Mournfang Brown', 'base', '#640909', false),
('Citadel', 'Base', 'Naggaroth Night', 'base', '#3B2B50', false),
('Citadel', 'Base', 'Rakarth Flesh', 'base', '#A29E91', false),
('Citadel', 'Base', 'Retributor Armour', 'base', '#C39E3A', true),
('Citadel', 'Base', 'Screamer Pink', 'base', '#7C1645', false),
('Citadel', 'Base', 'The Fang', 'base', '#405B71', false),
('Citadel', 'Base', 'Warplock Bronze', 'base', '#927D7B', true),
('Citadel', 'Base', 'Wraithbone', 'base', '#DBD1B2', false),
('Citadel', 'Base', 'Zandri Dust', 'base', '#9E915C', false),
-- Citadel Shade
('Citadel', 'Shade', 'Agrax Earthshade', 'shade', '#63452A', false),
('Citadel', 'Shade', 'Nuln Oil', 'shade', '#14100E', false),
('Citadel', 'Shade', 'Reikland Fleshshade', 'shade', '#CA6C4D', false),
('Citadel', 'Shade', 'Druchii Violet', 'shade', '#7A468C', false),
('Citadel', 'Shade', 'Biel-Tan Green', 'shade', '#1BA169', false),
('Citadel', 'Shade', 'Carroburg Crimson', 'shade', '#A82A70', false),
('Citadel', 'Shade', 'Drakenhof Nightshade', 'shade', '#125899', false),
-- Citadel Layer (common)
('Citadel', 'Layer', 'Evil Sunz Scarlet', 'layer', '#C01411', false),
('Citadel', 'Layer', 'Calgar Blue', 'layer', '#2A497F', false),
('Citadel', 'Layer', 'Warpstone Glow', 'layer', '#1F7A1D', false),
('Citadel', 'Layer', 'Ushabti Bone', 'layer', '#BBAC84', false),
('Citadel', 'Layer', 'Administratum Grey', 'layer', '#949B95', false),
('Citadel', 'Layer', 'Auric Armour Gold', 'layer', '#C7A94C', true),
('Citadel', 'Layer', 'Ironbreaker', 'layer', '#A1A6A9', true),
('Citadel', 'Layer', 'Stormhost Silver', 'layer', '#BCCCC9', true),
('Citadel', 'Layer', 'White Scar', 'layer', '#FFFFFF', false),
-- Vallejo basics
('Vallejo', 'Game Color', 'Dead White', 'base', '#FFFFFF', false),
('Vallejo', 'Game Color', 'Black', 'base', '#000000', false),
('Vallejo', 'Game Color', 'Bloody Red', 'base', '#A91B0D', false),
('Vallejo', 'Game Color', 'Ultramarine Blue', 'base', '#1B3F8B', false),
('Vallejo', 'Game Color', 'Goblin Green', 'base', '#3C8527', false),
('Vallejo', 'Model Color', 'German Grey', 'base', '#2D3332', false),
('Vallejo', 'Model Color', 'Flat Earth', 'base', '#7C5D3A', false),
-- Army Painter basics
('The Army Painter', 'Warpaints', 'Matt Black', 'base', '#1B1B1B', false),
('The Army Painter', 'Warpaints', 'Matt White', 'base', '#FCFCFC', false),
('The Army Painter', 'Warpaints', 'Dragon Red', 'base', '#991810', false),
('The Army Painter', 'Warpaints', 'Crystal Blue', 'base', '#2F6399', false),
('The Army Painter', 'Quickshade Wash', 'Dark Tone', 'wash', '#261E16', false),
('The Army Painter', 'Quickshade Wash', 'Strong Tone', 'wash', '#503D2A', false),
('The Army Painter', 'Quickshade Wash', 'Soft Tone', 'wash', '#7A6840', false);
