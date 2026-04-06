import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCrusadeStore } from './crusadeStore';
import { supabase } from '../../../shared/lib/supabase';
import type { CrusadeUnitWithDetails, CampaignMember, Campaign } from '../../../shared/types/database';

// Mock crypto.randomUUID
let uuidCounter = 0;
vi.stubGlobal('crypto', {
  randomUUID: () => `mock-uuid-${++uuidCounter}`,
});

/**
 * Creates a chainable mock that resolves as a promise at the end of the chain.
 * Every method returns `this`, and when awaited it resolves to `{ data, error }`.
 */
function createChainableMock(resolvedValue: { data: unknown; error: unknown } = { data: null, error: null }) {
  const chain: Record<string, unknown> = {};
  const methods = ['select', 'insert', 'update', 'delete', 'upsert', 'eq', 'in', 'or', 'order', 'single'];
  for (const method of methods) {
    chain[method] = vi.fn(() => chain);
  }
  // Make it thenable so `await` resolves
  chain.then = (resolve: (val: unknown) => void) => {
    return Promise.resolve(resolvedValue).then(resolve);
  };
  return chain;
}

function mockSupabaseFrom(resolvedValue?: { data: unknown; error: unknown }) {
  (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(createChainableMock(resolvedValue));
}

const mockCrusadeUnit: CrusadeUnitWithDetails = {
  id: 'cu-1',
  crusade_roster_id: 'roster-1',
  unit_id: 'unit-1',
  custom_name: 'Squad Alpha',
  model_count: 5,
  points_cost: 90,
  xp: 10,
  rank: 'battle_ready',
  battles_played: 3,
  battles_survived: 2,
  kills: 5,
  honours: [],
  scars: [],
  is_destroyed: false,
  destroyed_in_battle_id: null,
  notes: null,
  sort_order: 0,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
  units: { name: 'Intercessors', role: 'battleline', keywords: ['Infantry'] },
};

const mockMember: CampaignMember = {
  id: 'member-1',
  campaign_id: 'campaign-1',
  user_id: 'user-1',
  role: 'owner',
  display_name: 'Jeff',
  requisition_points: 5,
  supply_limit: 1000,
  joined_at: '2025-01-01T00:00:00Z',
};

const mockCampaign: Campaign = {
  id: 'campaign-1',
  owner_id: 'user-1',
  name: 'Test Campaign',
  description: null,
  share_code: 'ABC123',
  max_players: 8,
  points_limit: 2000,
  status: 'active',
  settings: {},
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
};

beforeEach(() => {
  uuidCounter = 0;
  vi.clearAllMocks();
  useCrusadeStore.setState({
    campaigns: [],
    activeCampaign: null,
    members: [],
    roster: null,
    units: [],
    battles: [],
    factions: [],
    loading: false,
    error: null,
  });
  // Default: all supabase calls resolve with no data, no error
  mockSupabaseFrom();
});

describe('crusadeStore', () => {
  describe('initial state', () => {
    it('has correct default values', () => {
      const state = useCrusadeStore.getState();
      expect(state.campaigns).toEqual([]);
      expect(state.activeCampaign).toBeNull();
      expect(state.members).toEqual([]);
      expect(state.roster).toBeNull();
      expect(state.units).toEqual([]);
      expect(state.battles).toEqual([]);
      expect(state.factions).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('addUnit', () => {
    it('optimistically adds a unit to state', async () => {
      mockSupabaseFrom({ data: null, error: null });

      const addPromise = useCrusadeStore.getState().addUnit({
        crusade_roster_id: 'roster-1',
        unit_id: 'unit-2',
        custom_name: 'Squad Bravo',
        model_count: 10,
        points_cost: 180,
        unit_name: 'Hellblasters',
        unit_role: 'battleline',
      });

      // Unit should appear immediately (optimistic)
      const units = useCrusadeStore.getState().units;
      expect(units).toHaveLength(1);
      expect(units[0].id).toBe('mock-uuid-1');
      expect(units[0].custom_name).toBe('Squad Bravo');
      expect(units[0].model_count).toBe(10);
      expect(units[0].points_cost).toBe(180);
      expect(units[0].xp).toBe(0);
      expect(units[0].rank).toBe('battle_ready');
      expect(units[0].honours).toEqual([]);
      expect(units[0].scars).toEqual([]);
      expect(units[0].units).toEqual({ name: 'Hellblasters', role: 'battleline', keywords: [] });

      await addPromise;

      // Since supabase returned null data, optimistic unit is removed (treated as error)
      // Verify supabase was called
      expect(supabase.from).toHaveBeenCalledWith('crusade_units');
    });

    it('replaces optimistic unit with real data on success', async () => {
      const realUnit: CrusadeUnitWithDetails = {
        ...mockCrusadeUnit,
        id: 'real-id-from-db',
        custom_name: 'Squad Bravo',
      };
      mockSupabaseFrom({ data: realUnit, error: null });

      await useCrusadeStore.getState().addUnit({
        crusade_roster_id: 'roster-1',
        unit_id: 'unit-2',
        custom_name: 'Squad Bravo',
        model_count: 10,
        points_cost: 180,
        unit_name: 'Hellblasters',
        unit_role: 'battleline',
      });

      const units = useCrusadeStore.getState().units;
      expect(units).toHaveLength(1);
      expect(units[0].id).toBe('real-id-from-db');
    });

    it('uses default values for optional fields', async () => {
      mockSupabaseFrom({ data: null, error: null });

      const addPromise = useCrusadeStore.getState().addUnit({
        crusade_roster_id: 'roster-1',
        unit_id: 'unit-3',
      });

      const units = useCrusadeStore.getState().units;
      expect(units[0].custom_name).toBeNull();
      expect(units[0].model_count).toBe(1);
      expect(units[0].points_cost).toBe(0);
      expect(units[0].units).toBeNull();

      await addPromise;
    });

    it('reverts optimistic add on supabase error', async () => {
      mockSupabaseFrom({ data: null, error: { message: 'DB error' } });

      await useCrusadeStore.getState().addUnit({
        crusade_roster_id: 'roster-1',
        unit_id: 'unit-2',
        custom_name: 'Squad Bravo',
      });

      // Unit should be reverted
      expect(useCrusadeStore.getState().units).toHaveLength(0);
      expect(useCrusadeStore.getState().error).toBe('Failed to add unit');
    });
  });

  describe('removeUnit', () => {
    it('optimistically removes a unit from state', async () => {
      useCrusadeStore.setState({ units: [mockCrusadeUnit] });

      const removePromise = useCrusadeStore.getState().removeUnit('cu-1');

      // Unit should be gone immediately
      expect(useCrusadeStore.getState().units).toHaveLength(0);

      await removePromise;

      expect(supabase.from).toHaveBeenCalledWith('crusade_units');
    });

    it('only removes the targeted unit', async () => {
      const secondUnit: CrusadeUnitWithDetails = {
        ...mockCrusadeUnit,
        id: 'cu-2',
        custom_name: 'Squad Bravo',
      };
      useCrusadeStore.setState({ units: [mockCrusadeUnit, secondUnit] });

      const removePromise = useCrusadeStore.getState().removeUnit('cu-1');

      const units = useCrusadeStore.getState().units;
      expect(units).toHaveLength(1);
      expect(units[0].id).toBe('cu-2');

      await removePromise;
    });

    it('reverts on supabase error', async () => {
      useCrusadeStore.setState({ units: [mockCrusadeUnit] });
      mockSupabaseFrom({ data: null, error: { message: 'DB error' } });

      await useCrusadeStore.getState().removeUnit('cu-1');

      // Unit should be restored
      expect(useCrusadeStore.getState().units).toHaveLength(1);
      expect(useCrusadeStore.getState().units[0].id).toBe('cu-1');
      expect(useCrusadeStore.getState().error).toBe('Failed to remove unit');
    });
  });

  describe('updateUnit', () => {
    it('optimistically updates a unit in state', async () => {
      useCrusadeStore.setState({ units: [mockCrusadeUnit] });

      const updatePromise = useCrusadeStore.getState().updateUnit('cu-1', {
        xp: 15,
        kills: 8,
      });

      const unit = useCrusadeStore.getState().units[0];
      expect(unit.xp).toBe(15);
      expect(unit.kills).toBe(8);
      // updated_at should be changed
      expect(unit.updated_at).not.toBe('2025-01-01T00:00:00Z');

      await updatePromise;

      expect(supabase.from).toHaveBeenCalledWith('crusade_units');
    });

    it('does nothing if unit not found', async () => {
      useCrusadeStore.setState({ units: [mockCrusadeUnit] });

      await useCrusadeStore.getState().updateUnit('nonexistent', { xp: 99 });

      // Unit should be unchanged
      expect(useCrusadeStore.getState().units[0].xp).toBe(10);
    });

    it('reverts on supabase error', async () => {
      useCrusadeStore.setState({ units: [mockCrusadeUnit] });
      mockSupabaseFrom({ data: null, error: { message: 'DB error' } });

      await useCrusadeStore.getState().updateUnit('cu-1', { xp: 99 });

      // Should revert to original
      expect(useCrusadeStore.getState().units[0].xp).toBe(10);
      expect(useCrusadeStore.getState().error).toBe('Failed to update unit');
    });
  });

  describe('spendRP', () => {
    it('optimistically deducts RP from member', async () => {
      useCrusadeStore.setState({ members: [mockMember] });

      const spendPromise = useCrusadeStore.getState().spendRP(
        'member-1',
        'increase_supply',
        2,
        'Increased supply limit'
      );

      // RP should be deducted immediately
      const member = useCrusadeStore.getState().members[0];
      expect(member.requisition_points).toBe(3); // 5 - 2

      await spendPromise;

      expect(supabase.from).toHaveBeenCalledWith('requisition_log');
    });

    it('does nothing if member not found', async () => {
      useCrusadeStore.setState({ members: [mockMember] });

      await useCrusadeStore.getState().spendRP(
        'nonexistent',
        'increase_supply',
        1,
        'test'
      );

      expect(useCrusadeStore.getState().members[0].requisition_points).toBe(5);
    });

    it('reverts on requisition log error', async () => {
      useCrusadeStore.setState({ members: [mockMember] });
      mockSupabaseFrom({ data: null, error: { message: 'Log failed' } });

      await useCrusadeStore.getState().spendRP(
        'member-1',
        'increase_supply',
        2,
        'test'
      );

      // Should revert
      expect(useCrusadeStore.getState().members[0].requisition_points).toBe(5);
      expect(useCrusadeStore.getState().error).toBe('Failed to log requisition');
    });
  });

  describe('addHonour', () => {
    it('appends an honour to the unit honours array', async () => {
      useCrusadeStore.setState({ units: [mockCrusadeUnit] });

      const honour = {
        name: 'Marked for Greatness',
        description: 'This unit has been marked for greatness',
        type: 'battle_honour' as const,
        acquired_battle_id: 'battle-1',
      };

      await useCrusadeStore.getState().addHonour('cu-1', honour);

      const unit = useCrusadeStore.getState().units[0];
      expect(unit.honours).toHaveLength(1);
      expect(unit.honours[0]).toEqual(honour);
    });

    it('appends to existing honours', async () => {
      const existingHonour = {
        name: 'Veteran Warriors',
        description: 'Battle hardened',
        type: 'battle_honour' as const,
      };
      const unitWithHonour: CrusadeUnitWithDetails = {
        ...mockCrusadeUnit,
        honours: [existingHonour],
      };
      useCrusadeStore.setState({ units: [unitWithHonour] });

      const newHonour = {
        name: 'Blooded',
        description: 'First blood drawn',
        type: 'battle_honour' as const,
      };

      await useCrusadeStore.getState().addHonour('cu-1', newHonour);

      const unit = useCrusadeStore.getState().units[0];
      expect(unit.honours).toHaveLength(2);
      expect(unit.honours[0]).toEqual(existingHonour);
      expect(unit.honours[1]).toEqual(newHonour);
    });
  });

  describe('addScar', () => {
    it('appends a scar to the unit scars array', async () => {
      useCrusadeStore.setState({ units: [mockCrusadeUnit] });

      const scar = {
        name: 'Deep Scars',
        description: 'This unit bears deep scars',
        type: 'battle_scar' as const,
        acquired_battle_id: 'battle-1',
      };

      await useCrusadeStore.getState().addScar('cu-1', scar);

      const unit = useCrusadeStore.getState().units[0];
      expect(unit.scars).toHaveLength(1);
      expect(unit.scars[0]).toEqual(scar);
    });

    it('appends to existing scars', async () => {
      const existingScar = {
        name: 'Battle Weary',
        description: 'Tired from battle',
        type: 'battle_scar' as const,
      };
      const unitWithScar: CrusadeUnitWithDetails = {
        ...mockCrusadeUnit,
        scars: [existingScar],
      };
      useCrusadeStore.setState({ units: [unitWithScar] });

      const newScar = {
        name: 'Mark of Shame',
        description: 'Disgraced in battle',
        type: 'battle_scar' as const,
      };

      await useCrusadeStore.getState().addScar('cu-1', newScar);

      const unit = useCrusadeStore.getState().units[0];
      expect(unit.scars).toHaveLength(2);
      expect(unit.scars[1]).toEqual(newScar);
    });
  });

  describe('removeScar', () => {
    it('removes a scar at the specified index', async () => {
      const scars = [
        { name: 'Scar A', description: 'First scar', type: 'battle_scar' as const },
        { name: 'Scar B', description: 'Second scar', type: 'battle_scar' as const },
        { name: 'Scar C', description: 'Third scar', type: 'battle_scar' as const },
      ];
      const unitWithScars: CrusadeUnitWithDetails = {
        ...mockCrusadeUnit,
        scars,
      };
      useCrusadeStore.setState({ units: [unitWithScars] });

      await useCrusadeStore.getState().removeScar('cu-1', 1);

      const unit = useCrusadeStore.getState().units[0];
      expect(unit.scars).toHaveLength(2);
      expect(unit.scars[0].name).toBe('Scar A');
      expect(unit.scars[1].name).toBe('Scar C');
    });

    it('removes first scar when index is 0', async () => {
      const scars = [
        { name: 'Scar A', description: 'First', type: 'battle_scar' as const },
        { name: 'Scar B', description: 'Second', type: 'battle_scar' as const },
      ];
      useCrusadeStore.setState({
        units: [{ ...mockCrusadeUnit, scars }],
      });

      await useCrusadeStore.getState().removeScar('cu-1', 0);

      const unit = useCrusadeStore.getState().units[0];
      expect(unit.scars).toHaveLength(1);
      expect(unit.scars[0].name).toBe('Scar B');
    });
  });

  describe('updateCampaign', () => {
    it('optimistically updates the active campaign', async () => {
      useCrusadeStore.setState({
        activeCampaign: mockCampaign,
        campaigns: [mockCampaign],
      });

      const updatePromise = useCrusadeStore.getState().updateCampaign('campaign-1', {
        name: 'Renamed Campaign',
        description: 'A new description',
      });

      // Active campaign should be updated immediately
      const active = useCrusadeStore.getState().activeCampaign;
      expect(active?.name).toBe('Renamed Campaign');
      expect(active?.description).toBe('A new description');
      expect(active?.updated_at).not.toBe('2025-01-01T00:00:00Z');

      await updatePromise;

      // Campaigns list should also be updated (after supabase resolves without error)
      const campaign = useCrusadeStore.getState().campaigns[0];
      expect(campaign.name).toBe('Renamed Campaign');

      expect(supabase.from).toHaveBeenCalledWith('campaigns');
    });

    it('does not update activeCampaign if campaignId does not match', async () => {
      useCrusadeStore.setState({
        activeCampaign: mockCampaign,
        campaigns: [mockCampaign],
      });

      await useCrusadeStore.getState().updateCampaign('other-campaign', {
        name: 'Other Name',
      });

      // Active campaign should be unchanged
      expect(useCrusadeStore.getState().activeCampaign?.name).toBe('Test Campaign');
    });

    it('reverts activeCampaign on supabase error', async () => {
      useCrusadeStore.setState({
        activeCampaign: mockCampaign,
        campaigns: [mockCampaign],
      });
      mockSupabaseFrom({ data: null, error: { message: 'DB error' } });

      await useCrusadeStore.getState().updateCampaign('campaign-1', {
        name: 'Should Revert',
      });

      expect(useCrusadeStore.getState().activeCampaign?.name).toBe('Test Campaign');
      expect(useCrusadeStore.getState().error).toBe('Failed to update campaign');
    });
  });
});
