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

describe('createCampaign', () => {
  it('returns the new campaign id and adds it to the campaigns list', async () => {
    const newCampaign = { id: 'camp-new', name: 'Crimson Crusade', owner_id: 'user-1' };

    // First call: campaigns insert (returns the new campaign)
    // Second call: campaign_members insert (success)
    vi.mocked(supabase.from)
      .mockReturnValueOnce(mockChain({ data: newCampaign, error: null }) as never)
      .mockReturnValueOnce(mockChain({ data: null, error: null }) as never);

    const id = await useCrusadeStore.getState().createCampaign('Crimson Crusade', 'user-1');

    expect(id).toBe('camp-new');
    expect(useCrusadeStore.getState().campaigns).toHaveLength(1);
    expect(useCrusadeStore.getState().campaigns[0].name).toBe('Crimson Crusade');
  });

  it('returns null and sets error when campaign insert fails', async () => {
    vi.mocked(supabase.from).mockReturnValueOnce(
      mockChain({ data: null, error: { message: 'DB error' } }) as never
    );

    const id = await useCrusadeStore.getState().createCampaign('Doomed', 'user-1');

    expect(id).toBeNull();
    expect(useCrusadeStore.getState().error).toBe('Failed to create campaign');
    expect(useCrusadeStore.getState().campaigns).toEqual([]);
  });

  it('returns the campaign id but sets a warning error when member insert fails', async () => {
    const newCampaign = { id: 'camp-orphan', name: 'Orphan', owner_id: 'user-1' };
    vi.mocked(supabase.from)
      .mockReturnValueOnce(mockChain({ data: newCampaign, error: null }) as never)
      .mockReturnValueOnce(mockChain({ data: null, error: { message: 'member fail' } }) as never);

    const id = await useCrusadeStore.getState().createCampaign('Orphan', 'user-1');

    expect(id).toBe('camp-orphan');
    expect(useCrusadeStore.getState().error).toBe('Campaign created but failed to add owner as member');
  });
});

describe('joinCampaign', () => {
  it('finds the campaign by share code and adds the user as a member', async () => {
    const campaign = { id: 'camp-found', name: 'Open Crusade', share_code: 'ABC123' };
    vi.mocked(supabase.from)
      .mockReturnValueOnce(mockChain({ data: campaign, error: null }) as never)
      .mockReturnValueOnce(mockChain({ data: null, error: null }) as never);

    const ok = await useCrusadeStore.getState().joinCampaign('ABC123', 'user-2', 'Greg');

    expect(ok).toBe(true);
    expect(useCrusadeStore.getState().campaigns).toHaveLength(1);
    expect(useCrusadeStore.getState().campaigns[0].id).toBe('camp-found');
  });

  it('returns false and sets error when share code does not match', async () => {
    vi.mocked(supabase.from).mockReturnValueOnce(
      mockChain({ data: null, error: { message: 'not found' } }) as never
    );

    const ok = await useCrusadeStore.getState().joinCampaign('BADCODE', 'user-2', 'Greg');

    expect(ok).toBe(false);
    expect(useCrusadeStore.getState().error).toBe('Campaign not found');
  });

  it('returns false when adding the membership fails', async () => {
    const campaign = { id: 'camp-found', name: 'Open Crusade', share_code: 'ABC123' };
    vi.mocked(supabase.from)
      .mockReturnValueOnce(mockChain({ data: campaign, error: null }) as never)
      .mockReturnValueOnce(mockChain({ data: null, error: { message: 'already member' } }) as never);

    const ok = await useCrusadeStore.getState().joinCampaign('ABC123', 'user-2', 'Greg');

    expect(ok).toBe(false);
    expect(useCrusadeStore.getState().error).toBe('Failed to join campaign');
  });
});

describe('loadBattles', () => {
  it('populates the battles list on success', async () => {
    const battles = [
      { id: 'b1', campaign_id: 'camp-1', player1_vp: 5, player2_vp: 3 },
      { id: 'b2', campaign_id: 'camp-1', player1_vp: 2, player2_vp: 8 },
    ];
    vi.mocked(supabase.from).mockReturnValueOnce(
      mockChain({ data: battles, error: null }) as never
    );

    await useCrusadeStore.getState().loadBattles('camp-1');

    expect(useCrusadeStore.getState().battles).toHaveLength(2);
    expect(useCrusadeStore.getState().loading).toBe(false);
  });

  it('sets error and clears loading on failure', async () => {
    vi.mocked(supabase.from).mockReturnValueOnce(
      mockChain({ data: null, error: { message: 'db down' } }) as never
    );

    await useCrusadeStore.getState().loadBattles('camp-1');

    expect(useCrusadeStore.getState().error).toBe('Failed to load battles');
    expect(useCrusadeStore.getState().loading).toBe(false);
  });
});

describe('logBattle', () => {
  it('returns the new battle id and prepends to battles list', async () => {
    const newBattle = {
      id: 'battle-1',
      campaign_id: 'camp-1',
      player1_member_id: 'm1',
      player2_member_id: 'm2',
      player1_vp: 10,
      player2_vp: 6,
    };
    vi.mocked(supabase.from).mockReturnValueOnce(
      mockChain({ data: newBattle, error: null }) as never
    );

    const id = await useCrusadeStore.getState().logBattle({
      campaign_id: 'camp-1',
      player1_member_id: 'm1',
      player2_member_id: 'm2',
      player1_vp: 10,
      player2_vp: 6,
    });

    expect(id).toBe('battle-1');
    expect(useCrusadeStore.getState().battles).toHaveLength(1);
    expect(useCrusadeStore.getState().battles[0].id).toBe('battle-1');
  });

  it('also inserts participant rows when participants are provided', async () => {
    const newBattle = { id: 'battle-2', campaign_id: 'camp-1' };
    const battleChain = mockChain({ data: newBattle, error: null });
    const participantsChain = mockChain({ data: null, error: null });

    vi.mocked(supabase.from)
      .mockReturnValueOnce(battleChain as never)
      .mockReturnValueOnce(participantsChain as never);

    const id = await useCrusadeStore.getState().logBattle({
      campaign_id: 'camp-1',
      player1_member_id: 'm1',
      player2_member_id: 'm2',
      participants: [
        { crusade_unit_id: 'cu-1' },
        { crusade_unit_id: 'cu-2' },
      ],
    });

    expect(id).toBe('battle-2');
    expect(participantsChain.insert).toHaveBeenCalledWith([
      { crusade_battle_id: 'battle-2', crusade_unit_id: 'cu-1' },
      { crusade_battle_id: 'battle-2', crusade_unit_id: 'cu-2' },
    ]);
  });

  it('returns null and sets error when battle insert fails', async () => {
    vi.mocked(supabase.from).mockReturnValueOnce(
      mockChain({ data: null, error: { message: 'fail' } }) as never
    );

    const id = await useCrusadeStore.getState().logBattle({
      campaign_id: 'camp-1',
      player1_member_id: 'm1',
      player2_member_id: 'm2',
    });

    expect(id).toBeNull();
    expect(useCrusadeStore.getState().error).toBe('Failed to log battle');
  });
});

describe('awardXP', () => {
  it('calls the award_crusade_xp RPC and clears error on success', async () => {
    useCrusadeStore.setState({ error: 'previous error' });
    vi.mocked(supabase.rpc).mockResolvedValueOnce({ data: null, error: null } as never);

    await useCrusadeStore.getState().awardXP('battle-1');

    expect(supabase.rpc).toHaveBeenCalledWith('award_crusade_xp', { p_battle_id: 'battle-1' });
    expect(useCrusadeStore.getState().error).toBeNull();
  });

  it('sets error when the RPC fails', async () => {
    vi.mocked(supabase.rpc).mockResolvedValueOnce({ data: null, error: { message: 'fail' } } as never);

    await useCrusadeStore.getState().awardXP('battle-1');

    expect(useCrusadeStore.getState().error).toBe('Failed to award XP');
  });
});

describe('spendRP edge cases', () => {
  it('is a no-op when the member is not found', async () => {
    useCrusadeStore.setState({ members: [] });

    await useCrusadeStore.getState().spendRP('ghost-id', 'increase_supply', 1, 'nope');

    // No supabase calls should have been made; state untouched
    expect(useCrusadeStore.getState().members).toEqual([]);
  });

  it('rolls back when the requisition_log insert fails', async () => {
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

    vi.mocked(supabase.from).mockReturnValueOnce(
      mockChain({ data: null, error: { message: 'log fail' } }) as never
    );

    await useCrusadeStore.getState().spendRP('member-1', 'increase_supply', 2, 'More units');

    expect(useCrusadeStore.getState().members[0].requisition_points).toBe(5);
    expect(useCrusadeStore.getState().error).toBe('Failed to log requisition');
  });

  it('rolls back when the campaign_members update fails', async () => {
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

    vi.mocked(supabase.from)
      .mockReturnValueOnce(mockChain({ data: null, error: null }) as never)
      .mockReturnValueOnce(mockChain({ data: null, error: { message: 'update fail' } }) as never);

    await useCrusadeStore.getState().spendRP('member-1', 'increase_supply', 2, 'More units');

    expect(useCrusadeStore.getState().members[0].requisition_points).toBe(5);
    expect(useCrusadeStore.getState().error).toBe('Failed to update requisition points');
  });
});

describe('honour/scar guards', () => {
  it('addHonour does nothing when unit not found', async () => {
    useCrusadeStore.setState({ units: [] });
    await useCrusadeStore.getState().addHonour('missing', {
      name: 'X', description: 'y', type: 'battle_honour',
    });
    expect(useCrusadeStore.getState().units).toEqual([]);
  });

  it('addScar does nothing when unit not found', async () => {
    useCrusadeStore.setState({ units: [] });
    await useCrusadeStore.getState().addScar('missing', {
      name: 'X', description: 'y', type: 'battle_scar',
    });
    expect(useCrusadeStore.getState().units).toEqual([]);
  });

  it('removeScar does nothing when unit not found', async () => {
    useCrusadeStore.setState({ units: [] });
    await useCrusadeStore.getState().removeScar('missing', 0);
    expect(useCrusadeStore.getState().units).toEqual([]);
  });
});
