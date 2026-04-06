import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCrusadeStore } from './crusadeStore';
import { supabase } from '../../../shared/lib/supabase';
import type { CrusadeUnitWithDetails } from '../../../shared/types/database';

// Helper to mock supabase chained queries
function mockChain(result: { data: unknown; error: unknown }) {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {};
  chain.select = vi.fn().mockReturnValue(chain);
  chain.insert = vi.fn().mockReturnValue(chain);
  chain.update = vi.fn().mockReturnValue(chain);
  chain.delete = vi.fn().mockReturnValue(chain);
  chain.eq = vi.fn().mockReturnValue(chain);
  chain.in = vi.fn().mockReturnValue(chain);
  chain.order = vi.fn().mockResolvedValue(result);
  chain.single = vi.fn().mockResolvedValue(result);
  chain.then = vi.fn((cb: (v: unknown) => void) => cb(result));
  return chain;
}

function mockUnit(overrides?: Partial<CrusadeUnitWithDetails>): CrusadeUnitWithDetails {
  return {
    id: 'cu-1',
    crusade_roster_id: 'roster-1',
    unit_id: 'unit-1',
    custom_name: null,
    model_count: 5,
    points_cost: 90,
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
    sort_order: 0,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    units: { name: 'Intercessors', role: 'battleline', keywords: ['Infantry'] },
    ...overrides,
  } as CrusadeUnitWithDetails;
}

beforeEach(() => {
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
  vi.spyOn(crypto, 'randomUUID').mockReturnValue(
    '00000000-0000-0000-0000-000000000001' as `${string}-${string}-${string}-${string}-${string}`
  );
});

describe('initial state', () => {
  it('starts with empty state', () => {
    const state = useCrusadeStore.getState();
    expect(state.campaigns).toEqual([]);
    expect(state.activeCampaign).toBeNull();
    expect(state.roster).toBeNull();
    expect(state.units).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });
});

describe('addUnit', () => {
  it('optimistically adds a unit then replaces with server data', async () => {
    useCrusadeStore.setState({
      roster: { id: 'roster-1' } as never,
      units: [],
    });

    const serverUnit = mockUnit({ id: 'server-cu-1' });
    const chain = mockChain({ data: serverUnit, error: null });
    vi.mocked(supabase.from).mockReturnValue(chain as never);

    await useCrusadeStore.getState().addUnit({
      crusade_roster_id: 'roster-1',
      unit_id: 'unit-1',
      unit_name: 'Intercessors',
      model_count: 5,
      points_cost: 90,
    });

    const units = useCrusadeStore.getState().units;
    expect(units).toHaveLength(1);
    expect(units[0].id).toBe('server-cu-1');
  });

  it('rolls back on server error', async () => {
    useCrusadeStore.setState({ units: [] });

    const chain = mockChain({ data: null, error: { message: 'DB error' } });
    vi.mocked(supabase.from).mockReturnValue(chain as never);

    await useCrusadeStore.getState().addUnit({
      crusade_roster_id: 'roster-1',
      unit_id: 'unit-1',
    });

    expect(useCrusadeStore.getState().units).toEqual([]);
    expect(useCrusadeStore.getState().error).toBe('Failed to add unit');
  });
});

describe('removeUnit', () => {
  it('optimistically removes then confirms', async () => {
    const unit = mockUnit();
    useCrusadeStore.setState({ units: [unit] });

    const chain = mockChain({ data: null, error: null });
    vi.mocked(supabase.from).mockReturnValue(chain as never);

    await useCrusadeStore.getState().removeUnit('cu-1');

    expect(useCrusadeStore.getState().units).toEqual([]);
  });

  it('rolls back on server error', async () => {
    const unit = mockUnit();
    useCrusadeStore.setState({ units: [unit] });

    const chain = mockChain({ data: null, error: { message: 'DB error' } });
    vi.mocked(supabase.from).mockReturnValue(chain as never);

    await useCrusadeStore.getState().removeUnit('cu-1');

    expect(useCrusadeStore.getState().units).toHaveLength(1);
    expect(useCrusadeStore.getState().error).toBe('Failed to remove unit');
  });
});

describe('updateUnit', () => {
  it('optimistically updates unit fields', async () => {
    const unit = mockUnit({ kills: 0 });
    useCrusadeStore.setState({ units: [unit] });

    const chain = mockChain({ data: null, error: null });
    vi.mocked(supabase.from).mockReturnValue(chain as never);

    await useCrusadeStore.getState().updateUnit('cu-1', { kills: 3 });

    expect(useCrusadeStore.getState().units[0].kills).toBe(3);
  });

  it('rolls back on error', async () => {
    const unit = mockUnit({ kills: 0 });
    useCrusadeStore.setState({ units: [unit] });

    const chain = mockChain({ data: null, error: { message: 'fail' } });
    vi.mocked(supabase.from).mockReturnValue(chain as never);

    await useCrusadeStore.getState().updateUnit('cu-1', { kills: 5 });

    expect(useCrusadeStore.getState().units[0].kills).toBe(0);
    expect(useCrusadeStore.getState().error).toBe('Failed to update unit');
  });

  it('does nothing for unknown unit', async () => {
    useCrusadeStore.setState({ units: [] });

    await useCrusadeStore.getState().updateUnit('nonexistent', { kills: 1 });

    expect(useCrusadeStore.getState().units).toEqual([]);
  });
});

describe('addHonour', () => {
  it('appends honour to unit', async () => {
    const unit = mockUnit({ honours: [{ name: 'First Blood', description: 'First kill', type: 'battle_honour' }] });
    useCrusadeStore.setState({ units: [unit] });

    const chain = mockChain({ data: null, error: null });
    vi.mocked(supabase.from).mockReturnValue(chain as never);

    await useCrusadeStore.getState().addHonour('cu-1', {
      name: 'Veteran',
      description: 'Survived 5 battles',
      type: 'battle_honour',
    });

    expect(useCrusadeStore.getState().units[0].honours).toHaveLength(2);
    expect(useCrusadeStore.getState().units[0].honours[1].name).toBe('Veteran');
  });
});

describe('addScar / removeScar', () => {
  it('appends scar to unit', async () => {
    const unit = mockUnit({ scars: [] });
    useCrusadeStore.setState({ units: [unit] });

    const chain = mockChain({ data: null, error: null });
    vi.mocked(supabase.from).mockReturnValue(chain as never);

    await useCrusadeStore.getState().addScar('cu-1', {
      name: 'Battle Wound',
      description: 'Injured in combat',
      type: 'battle_scar',
    });

    expect(useCrusadeStore.getState().units[0].scars).toHaveLength(1);
  });

  it('removes scar by index', async () => {
    const unit = mockUnit({
      scars: [
        { name: 'Scar A', description: 'a', type: 'battle_scar' as const },
        { name: 'Scar B', description: 'b', type: 'battle_scar' as const },
      ],
    });
    useCrusadeStore.setState({ units: [unit] });

    const chain = mockChain({ data: null, error: null });
    vi.mocked(supabase.from).mockReturnValue(chain as never);

    await useCrusadeStore.getState().removeScar('cu-1', 0);

    const scars = useCrusadeStore.getState().units[0].scars;
    expect(scars).toHaveLength(1);
    expect(scars[0].name).toBe('Scar B');
  });
});

describe('spendRP', () => {
  it('optimistically decreases RP', async () => {
    useCrusadeStore.setState({
      members: [
        {
          id: 'member-1',
          campaign_id: 'camp-1',
          user_id: 'user-1',
          role: 'player',
          display_name: 'Jeff',
          requisition_points: 5,
        } as never,
      ],
    });

    const chain = mockChain({ data: null, error: null });
    vi.mocked(supabase.from).mockReturnValue(chain as never);

    await useCrusadeStore.getState().spendRP('member-1', 'increase_supply', 2, 'More units');

    expect(useCrusadeStore.getState().members[0].requisition_points).toBe(3);
  });
});

describe('updateCampaign', () => {
  it('optimistically updates active campaign', async () => {
    useCrusadeStore.setState({
      activeCampaign: {
        id: 'camp-1',
        name: 'Old Name',
        owner_id: 'user-1',
      } as never,
      campaigns: [
        { id: 'camp-1', name: 'Old Name', owner_id: 'user-1' } as never,
      ],
    });

    const chain = mockChain({ data: null, error: null });
    vi.mocked(supabase.from).mockReturnValue(chain as never);

    await useCrusadeStore.getState().updateCampaign('camp-1', { name: 'New Name' });

    expect(useCrusadeStore.getState().activeCampaign!.name).toBe('New Name');
    expect(useCrusadeStore.getState().campaigns[0].name).toBe('New Name');
  });

  it('rolls back on error', async () => {
    useCrusadeStore.setState({
      activeCampaign: { id: 'camp-1', name: 'Original' } as never,
    });

    const chain = mockChain({ data: null, error: { message: 'fail' } });
    vi.mocked(supabase.from).mockReturnValue(chain as never);

    await useCrusadeStore.getState().updateCampaign('camp-1', { name: 'Changed' });

    expect(useCrusadeStore.getState().activeCampaign!.name).toBe('Original');
    expect(useCrusadeStore.getState().error).toBe('Failed to update campaign');
  });
});

describe('resetGame (no data loss)', () => {
  it('resetGame is not on crusade store', () => {
    // Verify crusade store doesn't have a resetGame — that's the game session store
    expect((useCrusadeStore.getState() as unknown as Record<string, unknown>).resetGame).toBeUndefined();
  });
});
