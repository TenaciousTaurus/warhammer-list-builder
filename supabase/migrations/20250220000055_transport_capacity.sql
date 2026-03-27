-- Structured transport capacity for dedicated transports.
-- Adds columns to units table + seeds data for all transport units.

ALTER TABLE public.units
  ADD COLUMN IF NOT EXISTS transport_capacity integer DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS transport_keywords_allowed text[] DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS transport_keywords_excluded text[] DEFAULT NULL;

-- ==============================================
-- SPACE MARINES
-- ==============================================
-- Drop Pod: 12 capacity, Infantry only, no Jump Pack/Gravis/Centurion/Terminator
UPDATE public.units SET
  transport_capacity = 12,
  transport_keywords_allowed = '{"Adeptus Astartes", "Infantry"}',
  transport_keywords_excluded = '{"Jump Pack", "Gravis", "Centurion", "Terminator"}'
WHERE id = '59eb2b1b-2490-0287-a46f-effeff1881e9';

-- Impulsor: 6 capacity, Infantry only, no Jump Pack/Gravis/Centurion/Terminator
UPDATE public.units SET
  transport_capacity = 6,
  transport_keywords_allowed = '{"Adeptus Astartes", "Infantry"}',
  transport_keywords_excluded = '{"Jump Pack", "Gravis", "Centurion", "Terminator"}'
WHERE id = '06f1d0f1-22bb-4cf2-2496-8c4b36ebefec';

-- Rhino: 12 capacity
UPDATE public.units SET
  transport_capacity = 12,
  transport_keywords_allowed = '{"Adeptus Astartes", "Infantry"}',
  transport_keywords_excluded = '{"Jump Pack", "Gravis", "Centurion", "Terminator"}'
WHERE id = '87268d61-fb46-c7d9-640b-701cedd08dc9';

-- Razorback: 6 capacity
UPDATE public.units SET
  transport_capacity = 6,
  transport_keywords_allowed = '{"Adeptus Astartes", "Infantry"}',
  transport_keywords_excluded = '{"Jump Pack", "Gravis", "Centurion", "Terminator"}'
WHERE id = '2d829aef-6015-e35c-e811-64de018113be';

-- Relic Razorback [Legends]: 6 capacity
UPDATE public.units SET
  transport_capacity = 6,
  transport_keywords_allowed = '{"Adeptus Astartes", "Infantry"}',
  transport_keywords_excluded = '{"Jump Pack", "Gravis", "Centurion", "Terminator"}'
WHERE id = '903de9aa-9177-79e4-c0fb-659a529f5e57';

-- ==============================================
-- DEATHWATCH / SPACE MARINE VARIANTS (shared chassis)
-- ==============================================
-- Razorback (variant)
UPDATE public.units SET
  transport_capacity = 6,
  transport_keywords_allowed = '{"Adeptus Astartes", "Infantry"}',
  transport_keywords_excluded = '{"Jump Pack", "Gravis", "Centurion", "Terminator"}'
WHERE id = '0b882e92-30ec-d1a8-cf2e-cf416d0f5384';

-- Rhino (variant)
UPDATE public.units SET
  transport_capacity = 12,
  transport_keywords_allowed = '{"Adeptus Astartes", "Infantry"}',
  transport_keywords_excluded = '{"Jump Pack", "Gravis", "Centurion", "Terminator"}'
WHERE id = '312f9279-ccb0-12e6-fa67-8d16e9e28367';

-- Grey Knights Relic Razorback [Legends]
UPDATE public.units SET
  transport_capacity = 6,
  transport_keywords_allowed = '{"Adeptus Astartes", "Infantry"}',
  transport_keywords_excluded = '{"Jump Pack", "Terminator"}'
WHERE id = 'e9a165cc-84d5-3084-a7c5-3b0285156741';

-- Impulsor (variant)
UPDATE public.units SET
  transport_capacity = 6,
  transport_keywords_allowed = '{"Adeptus Astartes", "Infantry"}',
  transport_keywords_excluded = '{"Jump Pack", "Gravis", "Centurion", "Terminator"}'
WHERE id = '27f9a26a-995c-2ffb-f4b0-e9f776f3a40e';

-- ==============================================
-- ADEPTA SORORITAS
-- ==============================================
-- Immolator: 6 capacity
UPDATE public.units SET
  transport_capacity = 6,
  transport_keywords_allowed = '{"Adepta Sororitas", "Infantry"}',
  transport_keywords_excluded = '{}'
WHERE id = '3420d8de-c7a6-033b-734b-a3c24d4cedac';

-- Sororitas Rhino: 12 capacity
UPDATE public.units SET
  transport_capacity = 12,
  transport_keywords_allowed = '{"Adepta Sororitas", "Infantry"}',
  transport_keywords_excluded = '{}'
WHERE id = 'cb2d00d9-add7-f7cf-d093-61f77241df52';

-- Repressor [Legends]: 12 capacity
UPDATE public.units SET
  transport_capacity = 12,
  transport_keywords_allowed = '{"Adepta Sororitas", "Infantry"}',
  transport_keywords_excluded = '{}'
WHERE id = '23a5af09-8f3b-82ce-53d2-341bfda8523c';

-- ==============================================
-- AGENTS OF THE IMPERIUM
-- ==============================================
-- Anathema Psykana Rhino: 12 capacity
UPDATE public.units SET
  transport_capacity = 12,
  transport_keywords_allowed = '{"Imperium", "Infantry"}',
  transport_keywords_excluded = '{}'
WHERE id = '5da90688-1b63-8afc-bdcd-0987d4b14a10';

-- ==============================================
-- ADEPTUS MECHANICUS
-- ==============================================
-- Skorpius Dunerider: 12 capacity
UPDATE public.units SET
  transport_capacity = 12,
  transport_keywords_allowed = '{"Adeptus Mechanicus", "Infantry"}',
  transport_keywords_excluded = '{}'
WHERE id = 'ccffa9fa-db06-9231-33f0-9780ca2c2b68';

-- Terrax-Pattern Termite [Legends]: 12 capacity
UPDATE public.units SET
  transport_capacity = 12,
  transport_keywords_allowed = '{"Adeptus Mechanicus", "Infantry"}',
  transport_keywords_excluded = '{}'
WHERE id = '0952d9ec-ca75-cac7-4360-9efd974d96c6';

-- ==============================================
-- ASTRA MILITARUM
-- ==============================================
-- Chimera: 12 capacity
UPDATE public.units SET
  transport_capacity = 12,
  transport_keywords_allowed = '{"Astra Militarum", "Infantry"}',
  transport_keywords_excluded = '{"Ogryns"}'
WHERE id = 'b610d2d3-f482-1186-9033-d6f43c9e3ff7';

-- Taurox: 12 capacity
UPDATE public.units SET
  transport_capacity = 12,
  transport_keywords_allowed = '{"Astra Militarum", "Infantry"}',
  transport_keywords_excluded = '{"Ogryns"}'
WHERE id = '23a65bcc-8b15-753d-3c5c-1cff1613191d';

-- Taurox Prime: 12 capacity
UPDATE public.units SET
  transport_capacity = 12,
  transport_keywords_allowed = '{"Astra Militarum", "Infantry"}',
  transport_keywords_excluded = '{"Ogryns"}'
WHERE id = '2d8650ae-c2a3-a902-af27-aa09f43a252e';

-- Storm Chimera [Legends]: 12 capacity
UPDATE public.units SET
  transport_capacity = 12,
  transport_keywords_allowed = '{"Astra Militarum", "Infantry"}',
  transport_keywords_excluded = '{"Ogryns"}'
WHERE id = '9095b9b5-65b3-4dad-f841-099a46f8c17d';

-- ==============================================
-- CHAOS SPACE MARINES / DEATH GUARD / WORLD EATERS / THOUSAND SONS
-- ==============================================
-- Chaos Rhino (CSM)
UPDATE public.units SET
  transport_capacity = 12,
  transport_keywords_allowed = '{"Heretic Astartes", "Infantry"}',
  transport_keywords_excluded = '{"Jump Pack", "Terminator"}'
WHERE id = '5b5cf51d-d984-a05a-aff6-a0294465b70a';

-- Chaos Rhino (Death Guard)
UPDATE public.units SET
  transport_capacity = 12,
  transport_keywords_allowed = '{"Death Guard", "Infantry"}',
  transport_keywords_excluded = '{"Terminator"}'
WHERE id = '8d2a2fff-09bb-f0d8-c796-19baca9230c1';

-- Chaos Rhino (World Eaters)
UPDATE public.units SET
  transport_capacity = 12,
  transport_keywords_allowed = '{"Heretic Astartes", "Infantry"}',
  transport_keywords_excluded = '{"Jump Pack", "Terminator"}'
WHERE id = '819b24e2-a39f-6fe2-4a7a-80dc786fd9d1';

-- Chaos Rhino (Thousand Sons)
UPDATE public.units SET
  transport_capacity = 12,
  transport_keywords_allowed = '{"Heretic Astartes", "Infantry"}',
  transport_keywords_excluded = '{"Terminator"}'
WHERE id = '6e29a959-c024-3798-9e6c-d680a6e25654';

-- ==============================================
-- AELDARI / DRUKHARI / HARLEQUINS / YNNARI
-- ==============================================
-- Wave Serpent (Aeldari)
UPDATE public.units SET
  transport_capacity = 12,
  transport_keywords_allowed = '{"Aeldari", "Infantry"}',
  transport_keywords_excluded = '{}'
WHERE id = '09126e14-78dd-65fe-217c-fb606587862d';

-- Wave Serpent (Ynnari variant)
UPDATE public.units SET
  transport_capacity = 12,
  transport_keywords_allowed = '{"Aeldari", "Infantry"}',
  transport_keywords_excluded = '{}'
WHERE id = '77063aab-7532-4595-edee-82636e77feb3';

-- Starweaver (Harlequins): 6 capacity
UPDATE public.units SET
  transport_capacity = 6,
  transport_keywords_allowed = '{"Aeldari", "Infantry"}',
  transport_keywords_excluded = '{}'
WHERE id = 'd9bbec3a-d63a-8868-f81e-b6a817db3878';

-- Starweaver (variant)
UPDATE public.units SET
  transport_capacity = 6,
  transport_keywords_allowed = '{"Aeldari", "Infantry"}',
  transport_keywords_excluded = '{}'
WHERE id = '847e093b-6d71-bcd9-e1fc-9d2012398618';

-- Raider (Drukhari): 11 capacity
UPDATE public.units SET
  transport_capacity = 11,
  transport_keywords_allowed = '{"Aeldari", "Infantry"}',
  transport_keywords_excluded = '{"Grotesques"}'
WHERE id = '48e4a069-bdc1-02de-e0a6-1d2e1cf47ec2';

-- Raider (Ynnari variant)
UPDATE public.units SET
  transport_capacity = 11,
  transport_keywords_allowed = '{"Aeldari", "Infantry"}',
  transport_keywords_excluded = '{"Grotesques"}'
WHERE id = '2b6e642b-4fa5-f651-3fe6-1e2e322be0f9';

-- Venom (Drukhari): 6 capacity
UPDATE public.units SET
  transport_capacity = 6,
  transport_keywords_allowed = '{"Aeldari", "Infantry"}',
  transport_keywords_excluded = '{"Grotesques"}'
WHERE id = '82d4fa88-837c-2f2e-7364-538ac0387f31';

-- Venom (Ynnari variant)
UPDATE public.units SET
  transport_capacity = 6,
  transport_keywords_allowed = '{"Aeldari", "Infantry"}',
  transport_keywords_excluded = '{"Grotesques"}'
WHERE id = 'ebdd18ad-c530-86f4-2d36-00071ba1ce64';

-- Ynnari Raider
UPDATE public.units SET
  transport_capacity = 11,
  transport_keywords_allowed = '{"Aeldari", "Infantry"}',
  transport_keywords_excluded = '{"Grotesques"}'
WHERE id = '1b1e413a-3cad-f876-20eb-67b60e4cc92d';

-- Ynnari Raider (variant)
UPDATE public.units SET
  transport_capacity = 11,
  transport_keywords_allowed = '{"Aeldari", "Infantry"}',
  transport_keywords_excluded = '{"Grotesques"}'
WHERE id = 'e43d982c-d37e-a9aa-680c-666d961b2b73';

-- Ynnari Venom
UPDATE public.units SET
  transport_capacity = 6,
  transport_keywords_allowed = '{"Aeldari", "Infantry"}',
  transport_keywords_excluded = '{"Grotesques"}'
WHERE id = '4099500d-0393-b802-5b93-10ba1682816d';

-- ==============================================
-- LEAGUES OF VOTANN
-- ==============================================
-- Sagitaur: 6 capacity
UPDATE public.units SET
  transport_capacity = 6,
  transport_keywords_allowed = '{"Leagues of Votann", "Infantry"}',
  transport_keywords_excluded = '{}'
WHERE id = '730413f9-8a20-6bc2-c969-c87c00ca6596';

-- Kapricus Carrier: 12 capacity
UPDATE public.units SET
  transport_capacity = 12,
  transport_keywords_allowed = '{"Leagues of Votann", "Infantry"}',
  transport_keywords_excluded = '{}'
WHERE id = '1aa85c6a-72a5-d641-0aa3-c4dbcc5b9cd9';

-- ==============================================
-- GENESTEALER CULTS
-- ==============================================
-- Goliath Truck: 12 capacity
UPDATE public.units SET
  transport_capacity = 12,
  transport_keywords_allowed = '{"Genestealer Cults", "Infantry"}',
  transport_keywords_excluded = '{"Aberrants"}'
WHERE id = '269d3136-9417-371d-f616-5dbe160a8bd7';

-- ==============================================
-- TYRANIDS
-- ==============================================
-- Tyrannocyte: 20 capacity (monsters + infantry)
UPDATE public.units SET
  transport_capacity = 20,
  transport_keywords_allowed = '{"Tyranids"}',
  transport_keywords_excluded = '{"Titanic"}'
WHERE id = 'a5c89138-c311-28d3-43fe-b8df108bb8b4';

-- Tyrannocyte (variant)
UPDATE public.units SET
  transport_capacity = 20,
  transport_keywords_allowed = '{"Tyranids"}',
  transport_keywords_excluded = '{"Titanic"}'
WHERE id = '2dbe323c-cf5a-35a1-d065-43a588f30c92';

-- ==============================================
-- NECRONS
-- ==============================================
-- Ghost Ark: 12 capacity (Necron Warriors and Characters only)
UPDATE public.units SET
  transport_capacity = 12,
  transport_keywords_allowed = '{"Necrons", "Infantry"}',
  transport_keywords_excluded = '{}'
WHERE id = 'b9eab6f3-6dd2-4c6e-dcd7-a21a1a1c1b3f';

-- ==============================================
-- ORKS
-- ==============================================
-- Trukk: 12 capacity
UPDATE public.units SET
  transport_capacity = 12,
  transport_keywords_allowed = '{"Orks", "Infantry"}',
  transport_keywords_excluded = '{"Mega Armour", "Ghazghkull Thraka"}'
WHERE id = '86102f68-d12c-f389-4172-8e79e6b0c25c';

-- ==============================================
-- T'AU EMPIRE
-- ==============================================
-- Devilfish: 12 capacity
UPDATE public.units SET
  transport_capacity = 12,
  transport_keywords_allowed = '{"T''au Empire", "Infantry"}',
  transport_keywords_excluded = '{"Battlesuit"}'
WHERE id = 'dd54804b-39ff-6dbf-a94d-dc0d796d650b';
