import { create } from 'zustand';
import { supabase } from '../../../shared/lib/supabase';
import type {
  Campaign,
  CampaignMember,
  CrusadeRoster,
  CrusadeUnit,
  CrusadeUnitWithDetails,
  CrusadeBattle,
  RequisitionLogEntry,
  Faction,
  BattleHonour,
  BattleScar,
} from '../../../shared/types/database';

interface CrusadeState {
  campaigns: Campaign[];
  activeCampaign: Campaign | null;
  members: CampaignMember[];
  roster: CrusadeRoster | null;
  units: CrusadeUnitWithDetails[];
  battles: CrusadeBattle[];
  factions: Faction[];
  loading: boolean;
  error: string | null;

  loadMyCampaigns: (userId: string) => Promise<void>;
  createCampaign: (
    name: string,
    userId: string,
    opts?: { description?: string; max_players?: number; points_limit?: number }
  ) => Promise<string | null>;
  joinCampaign: (shareCode: string, userId: string, displayName: string) => Promise<boolean>;
  loadCampaign: (campaignId: string) => Promise<void>;
  loadRoster: (memberId: string) => Promise<void>;
  addUnit: (unit: {
    crusade_roster_id: string;
    unit_id: string;
    custom_name?: string | null;
    model_count?: number;
    points_cost?: number;
    unit_name?: string;
    unit_role?: string;
  }) => Promise<void>;
  removeUnit: (unitId: string) => Promise<void>;
  updateUnit: (unitId: string, updates: Partial<CrusadeUnit>) => Promise<void>;
  loadBattles: (campaignId: string) => Promise<void>;
  logBattle: (battle: {
    campaign_id: string;
    player1_member_id: string;
    player2_member_id: string;
    player1_vp?: number;
    player2_vp?: number;
    winner_member_id?: string | null;
    is_draw?: boolean;
    mission_id?: string | null;
    notes?: string | null;
    participants?: { crusade_unit_id: string }[];
  }) => Promise<string | null>;
  awardXP: (battleId: string) => Promise<void>;
  spendRP: (
    memberId: string,
    type: RequisitionLogEntry['type'],
    amount: number,
    description: string
  ) => Promise<void>;
  addHonour: (unitId: string, honour: BattleHonour) => Promise<void>;
  addScar: (unitId: string, scar: BattleScar) => Promise<void>;
  removeScar: (unitId: string, scarIndex: number) => Promise<void>;
  updateCampaign: (campaignId: string, updates: Partial<Campaign>) => Promise<void>;
}

export const useCrusadeStore = create<CrusadeState>()((set, get) => ({
  campaigns: [],
  activeCampaign: null,
  members: [],
  roster: null,
  units: [],
  battles: [],
  factions: [],
  loading: false,
  error: null,

  loadMyCampaigns: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const [membershipRes, ownedRes, factionsRes] = await Promise.all([
        supabase
          .from('campaign_members')
          .select('campaign_id')
          .eq('user_id', userId),
        supabase
          .from('campaigns')
          .select('*')
          .eq('owner_id', userId),
        supabase
          .from('factions')
          .select('*')
          .order('name', { ascending: true }),
      ]);

      const memberCampaignIds = (membershipRes.data ?? []).map((m) => m.campaign_id);
      const ownedCampaigns = (ownedRes.data as Campaign[]) ?? [];
      const ownedIds = new Set(ownedCampaigns.map((c) => c.id));

      // Load campaigns where user is a member but not the owner
      const joinedIds = memberCampaignIds.filter((id) => !ownedIds.has(id));
      let joinedCampaigns: Campaign[] = [];
      if (joinedIds.length > 0) {
        const { data } = await supabase
          .from('campaigns')
          .select('*')
          .in('id', joinedIds);
        joinedCampaigns = (data as Campaign[]) ?? [];
      }

      set({
        campaigns: [...ownedCampaigns, ...joinedCampaigns],
        factions: (factionsRes.data as Faction[]) ?? [],
        loading: false,
      });
    } catch {
      set({ loading: false, error: 'Failed to load campaigns' });
    }
  },

  createCampaign: async (name, userId, opts = {}) => {
    set({ error: null });
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .insert({
        owner_id: userId,
        name,
        description: opts.description,
        max_players: opts.max_players,
        points_limit: opts.points_limit,
      })
      .select()
      .single();

    if (campaignError || !campaign) {
      set({ error: 'Failed to create campaign' });
      return null;
    }

    const typedCampaign = campaign as Campaign;

    const { error: memberError } = await supabase
      .from('campaign_members')
      .insert({
        campaign_id: typedCampaign.id,
        user_id: userId,
        role: 'owner' as const,
        display_name: name,
      });

    if (memberError) {
      set({ error: 'Campaign created but failed to add owner as member' });
      return typedCampaign.id;
    }

    set((state) => ({
      campaigns: [typedCampaign, ...state.campaigns],
    }));

    return typedCampaign.id;
  },

  joinCampaign: async (shareCode, userId, displayName) => {
    set({ error: null });
    const { data: campaign, error: findError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('share_code', shareCode)
      .single();

    if (findError || !campaign) {
      set({ error: 'Campaign not found' });
      return false;
    }

    const { error: joinError } = await supabase
      .from('campaign_members')
      .insert({
        campaign_id: (campaign as Campaign).id,
        user_id: userId,
        role: 'player' as const,
        display_name: displayName,
      });

    if (joinError) {
      set({ error: 'Failed to join campaign' });
      return false;
    }

    set((state) => ({
      campaigns: [campaign as Campaign, ...state.campaigns],
    }));

    return true;
  },

  loadCampaign: async (campaignId: string) => {
    set({ loading: true, error: null });
    try {
      const [campaignRes, membersRes, battlesRes] = await Promise.all([
        supabase
          .from('campaigns')
          .select('*')
          .eq('id', campaignId)
          .single(),
        supabase
          .from('campaign_members')
          .select('*')
          .eq('campaign_id', campaignId),
        supabase
          .from('crusade_battles')
          .select('*')
          .eq('campaign_id', campaignId)
          .order('played_at', { ascending: false }),
      ]);

      set({
        activeCampaign: (campaignRes.data as Campaign) ?? null,
        members: (membersRes.data as CampaignMember[]) ?? [],
        battles: (battlesRes.data as CrusadeBattle[]) ?? [],
        loading: false,
      });
    } catch {
      set({ loading: false, error: 'Failed to load campaign' });
    }
  },

  loadRoster: async (memberId: string) => {
    set({ loading: true, error: null });
    try {
      const { data: rosterData } = await supabase
        .from('crusade_rosters')
        .select('*')
        .eq('campaign_member_id', memberId)
        .single();

      const roster = rosterData as CrusadeRoster | null;

      if (!roster) {
        set({ roster: null, units: [], loading: false });
        return;
      }

      const { data: unitsData } = await supabase
        .from('crusade_units')
        .select('*, units(name, role, keywords)')
        .eq('crusade_roster_id', roster.id)
        .order('sort_order', { ascending: true });

      set({
        roster,
        units: (unitsData as CrusadeUnitWithDetails[]) ?? [],
        loading: false,
      });
    } catch {
      set({ loading: false, error: 'Failed to load roster' });
    }
  },

  addUnit: async (unit) => {
    const optimisticId = crypto.randomUUID();
    const now = new Date().toISOString();
    const optimistic: CrusadeUnitWithDetails = {
      id: optimisticId,
      crusade_roster_id: unit.crusade_roster_id,
      unit_id: unit.unit_id,
      custom_name: unit.custom_name ?? null,
      model_count: unit.model_count ?? 1,
      points_cost: unit.points_cost ?? 0,
      xp: 0,
      rank: 'battle_ready',
      battles_played: 0,
      battles_survived: 0,
      kills: 0,
      honours: [],
      scars: [],
      is_destroyed: false,
      destroyed_in_battle_id: null,
      notes: null,
      sort_order: get().units.length,
      created_at: now,
      updated_at: now,
      units: unit.unit_name ? { name: unit.unit_name, role: unit.unit_role ?? '', keywords: [] } : null,
    };

    set((state) => ({ units: [...state.units, optimistic] }));

    const { data, error } = await supabase
      .from('crusade_units')
      .insert({
        crusade_roster_id: unit.crusade_roster_id,
        unit_id: unit.unit_id,
        custom_name: unit.custom_name,
        model_count: unit.model_count ?? 1,
        points_cost: unit.points_cost ?? 0,
        sort_order: get().units.length - 1,
      })
      .select('*, units(name, role, keywords)')
      .single();

    if (error || !data) {
      set((state) => ({
        units: state.units.filter((u) => u.id !== optimisticId),
        error: 'Failed to add unit',
      }));
      return;
    }

    set((state) => ({
      units: state.units.map((u) =>
        u.id === optimisticId ? (data as CrusadeUnitWithDetails) : u
      ),
    }));
  },

  removeUnit: async (unitId: string) => {
    const prev = get().units;
    set((state) => ({
      units: state.units.filter((u) => u.id !== unitId),
    }));

    const { error } = await supabase
      .from('crusade_units')
      .delete()
      .eq('id', unitId);

    if (error) {
      set({ units: prev, error: 'Failed to remove unit' });
    }
  },

  updateUnit: async (unitId: string, updates: Partial<CrusadeUnit>) => {
    const prev = get().units.find((u) => u.id === unitId);
    if (!prev) return;

    set((state) => ({
      units: state.units.map((u) =>
        u.id === unitId ? { ...u, ...updates, updated_at: new Date().toISOString() } : u
      ),
    }));

    const { error } = await supabase
      .from('crusade_units')
      .update(updates)
      .eq('id', unitId);

    if (error) {
      set((state) => ({
        units: state.units.map((u) => (u.id === unitId ? prev : u)),
        error: 'Failed to update unit',
      }));
    }
  },

  loadBattles: async (campaignId: string) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from('crusade_battles')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('played_at', { ascending: false });

    if (error) {
      set({ loading: false, error: 'Failed to load battles' });
      return;
    }

    set({
      battles: (data as CrusadeBattle[]) ?? [],
      loading: false,
    });
  },

  logBattle: async (battle) => {
    set({ error: null });
    const { data, error } = await supabase
      .from('crusade_battles')
      .insert({
        campaign_id: battle.campaign_id,
        player1_member_id: battle.player1_member_id,
        player2_member_id: battle.player2_member_id,
        player1_vp: battle.player1_vp ?? 0,
        player2_vp: battle.player2_vp ?? 0,
        winner_member_id: battle.winner_member_id,
        is_draw: battle.is_draw ?? false,
        mission_id: battle.mission_id,
        notes: battle.notes,
      })
      .select()
      .single();

    if (error || !data) {
      set({ error: 'Failed to log battle' });
      return null;
    }

    const typedBattle = data as CrusadeBattle;

    // Insert battle participants if provided
    if (battle.participants && battle.participants.length > 0) {
      const participantRows = battle.participants.map((p) => ({
        crusade_battle_id: typedBattle.id,
        crusade_unit_id: p.crusade_unit_id,
      }));
      const { error: partError } = await supabase
        .from('crusade_battle_participants')
        .insert(participantRows);
      if (partError) {
        console.error('Failed to insert battle participants:', partError);
      }
    }

    set((state) => ({
      battles: [typedBattle, ...state.battles],
    }));

    return typedBattle.id;
  },

  awardXP: async (battleId: string) => {
    set({ error: null });
    const { error } = await supabase.rpc('award_crusade_xp', {
      p_battle_id: battleId,
    });

    if (error) {
      set({ error: 'Failed to award XP' });
    }
  },

  spendRP: async (memberId, type, amount, description) => {
    const prevMembers = get().members;
    const member = prevMembers.find((m) => m.id === memberId);
    if (!member) return;

    // Optimistic update on member RP
    set((state) => ({
      members: state.members.map((m) =>
        m.id === memberId
          ? { ...m, requisition_points: m.requisition_points - amount }
          : m
      ),
    }));

    const { error: logError } = await supabase
      .from('requisition_log')
      .insert({
        campaign_member_id: memberId,
        type,
        rp_change: -amount,
        description,
      });

    if (logError) {
      set({ members: prevMembers, error: 'Failed to log requisition' });
      return;
    }

    const { error: updateError } = await supabase
      .from('campaign_members')
      .update({ requisition_points: member.requisition_points - amount })
      .eq('id', memberId);

    if (updateError) {
      set({ members: prevMembers, error: 'Failed to update requisition points' });
    }
  },

  addHonour: async (unitId: string, honour: BattleHonour) => {
    const unit = get().units.find((u) => u.id === unitId);
    if (!unit) return;

    const updatedHonours = [...unit.honours, honour];
    await get().updateUnit(unitId, { honours: updatedHonours });
  },

  addScar: async (unitId: string, scar: BattleScar) => {
    const unit = get().units.find((u) => u.id === unitId);
    if (!unit) return;

    const updatedScars = [...unit.scars, scar];
    await get().updateUnit(unitId, { scars: updatedScars });
  },

  removeScar: async (unitId: string, scarIndex: number) => {
    const unit = get().units.find((u) => u.id === unitId);
    if (!unit) return;

    const updatedScars = unit.scars.filter((_, i) => i !== scarIndex);
    await get().updateUnit(unitId, { scars: updatedScars });
  },

  updateCampaign: async (campaignId: string, updates: Partial<Campaign>) => {
    const prev = get().activeCampaign;

    if (prev && prev.id === campaignId) {
      set({ activeCampaign: { ...prev, ...updates, updated_at: new Date().toISOString() } });
    }

    const { error } = await supabase
      .from('campaigns')
      .update(updates)
      .eq('id', campaignId);

    if (error) {
      set({
        activeCampaign: prev,
        error: 'Failed to update campaign',
      });
    } else {
      // Also update in campaigns list
      set((state) => ({
        campaigns: state.campaigns.map((c) =>
          c.id === campaignId ? { ...c, ...updates, updated_at: new Date().toISOString() } : c
        ),
      }));
    }
  },
}));
