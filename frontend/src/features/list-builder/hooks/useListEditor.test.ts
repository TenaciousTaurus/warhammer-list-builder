import { describe, it, expect } from 'vitest';
import { getUnitPoints } from '../stores/listEditorStore';

// Unit tests for pure functions exported from useListEditor
describe('getUnitPoints', () => {
  const mockUnit = {
    id: 'unit-1',
    faction_id: 'faction-1',
    name: 'Intercessors',
    role: 'battleline',
    movement: '6"',
    toughness: 4,
    save: '3+',
    wounds: 2,
    leadership: 6,
    objective_control: 2,
    keywords: ['Infantry', 'Battleline'],
    max_per_list: 6,
    is_legends: false,
    transport_capacity: null,
    transport_keywords_allowed: null,
    transport_keywords_excluded: null,
    created_at: '2025-01-01T00:00:00Z',
    unit_points_tiers: [
      { id: 't1', unit_id: 'unit-1', model_count: 5, points: 90 },
      { id: 't2', unit_id: 'unit-1', model_count: 10, points: 180 },
    ],
  };

  it('returns the correct points for the minimum model count', () => {
    expect(getUnitPoints(mockUnit, 5)).toBe(90);
  });

  it('returns the higher tier points when model count meets the threshold', () => {
    expect(getUnitPoints(mockUnit, 10)).toBe(180);
  });

  it('returns the last matched tier for model counts between tiers', () => {
    expect(getUnitPoints(mockUnit, 7)).toBe(90);
  });

  it('returns 0 for model counts below any tier', () => {
    expect(getUnitPoints(mockUnit, 2)).toBe(0);
  });

  it('returns 0 when there are no point tiers', () => {
    const unitNoTiers = { ...mockUnit, unit_points_tiers: [] };
    expect(getUnitPoints(unitNoTiers, 5)).toBe(0);
  });

  it('handles a single tier correctly', () => {
    const unitOneTier = {
      ...mockUnit,
      unit_points_tiers: [
        { id: 't1', unit_id: 'unit-1', model_count: 1, points: 70 },
      ],
    };
    expect(getUnitPoints(unitOneTier, 1)).toBe(70);
    expect(getUnitPoints(unitOneTier, 5)).toBe(70);
  });

  it('handles three tiers correctly', () => {
    const unitThreeTiers = {
      ...mockUnit,
      unit_points_tiers: [
        { id: 't1', unit_id: 'unit-1', model_count: 3, points: 65 },
        { id: 't2', unit_id: 'unit-1', model_count: 6, points: 130 },
        { id: 't3', unit_id: 'unit-1', model_count: 10, points: 200 },
      ],
    };
    expect(getUnitPoints(unitThreeTiers, 3)).toBe(65);
    expect(getUnitPoints(unitThreeTiers, 5)).toBe(65);
    expect(getUnitPoints(unitThreeTiers, 6)).toBe(130);
    expect(getUnitPoints(unitThreeTiers, 10)).toBe(200);
  });
});
