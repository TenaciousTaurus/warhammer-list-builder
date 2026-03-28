import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../test/helpers';
import { UnitPicker } from './UnitPicker';
import type { UnitWithRelations } from '../stores/listEditorStore';

function createMockUnit(overrides?: Partial<UnitWithRelations>): UnitWithRelations {
  return {
    id: `unit-${Math.random().toString(36).slice(2)}`,
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
    ],
    abilities: [],
    weapons: [],
    ...overrides,
  } as UnitWithRelations;
}

const defaultProps = {
  listName: 'Test List',
  totalPoints: 500,
  filteredUnits: [] as UnitWithRelations[],
  filteredAlliedUnits: [] as UnitWithRelations[],
  unitsByRole: {} as Record<string, UnitWithRelations[]>,
  unitCountsInList: new Map<string, number>(),
  collapsedPickerRoles: new Set<string>(),
  unitPickerFilter: '',
  showLegends: false,
  onFilterChange: vi.fn(),
  onAddUnit: vi.fn(),
  onToggleRole: vi.fn(),
  onToggleLegends: vi.fn(),
};

describe('UnitPicker', () => {
  it('renders the list name and points', () => {
    render(<UnitPicker {...defaultProps} />);

    expect(screen.getByText('Test List')).toBeInTheDocument();
    expect(screen.getByText('500 pts')).toBeInTheDocument();
  });

  it('renders units grouped by role', () => {
    const unit1 = createMockUnit({ name: 'Intercessors', role: 'battleline' });
    const unit2 = createMockUnit({ name: 'Captain', role: 'character' });

    render(
      <UnitPicker
        {...defaultProps}
        filteredUnits={[unit1, unit2]}
        unitsByRole={{
          battleline: [unit1],
          character: [unit2],
        }}
      />
    );

    expect(screen.getByText('Intercessors')).toBeInTheDocument();
    expect(screen.getByText('Captain')).toBeInTheDocument();
    expect(screen.getByText('Battleline')).toBeInTheDocument();
    expect(screen.getByText('Character')).toBeInTheDocument();
  });

  it('calls onAddUnit when a unit is clicked', () => {
    const onAddUnit = vi.fn();
    const unit = createMockUnit({ name: 'Intercessors' });

    render(
      <UnitPicker
        {...defaultProps}
        filteredUnits={[unit]}
        unitsByRole={{ battleline: [unit] }}
        onAddUnit={onAddUnit}
      />
    );

    fireEvent.click(screen.getByText('Intercessors'));
    expect(onAddUnit).toHaveBeenCalledWith(unit);
  });

  it('disables unit at max limit', () => {
    const unit = createMockUnit({ id: 'hero-1', name: 'Guilliman', max_per_list: 1 });
    const counts = new Map([['hero-1', 1]]);

    render(
      <UnitPicker
        {...defaultProps}
        filteredUnits={[unit]}
        unitsByRole={{ epic_hero: [unit] }}
        unitCountsInList={counts}
      />
    );

    expect(screen.getByText('(1/1)')).toBeInTheDocument();
  });

  it('renders the search input', () => {
    render(<UnitPicker {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search units...');
    expect(searchInput).toBeInTheDocument();
  });

  it('calls onFilterChange when searching', () => {
    const onFilterChange = vi.fn();
    render(<UnitPicker {...defaultProps} onFilterChange={onFilterChange} />);

    fireEvent.change(screen.getByPlaceholderText('Search units...'), {
      target: { value: 'captain' },
    });

    expect(onFilterChange).toHaveBeenCalledWith('captain');
  });

  it('renders the Legends toggle', () => {
    render(<UnitPicker {...defaultProps} />);

    expect(screen.getByText('Legends')).toBeInTheDocument();
  });

  it('calls onToggleLegends when checkbox clicked', () => {
    const onToggleLegends = vi.fn();
    render(<UnitPicker {...defaultProps} onToggleLegends={onToggleLegends} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(onToggleLegends).toHaveBeenCalled();
  });

  it('shows unit counts', () => {
    const unit = createMockUnit({ id: 'unit-1', name: 'Intercessors', max_per_list: 6 });
    const counts = new Map([['unit-1', 2]]);

    render(
      <UnitPicker
        {...defaultProps}
        filteredUnits={[unit]}
        unitsByRole={{ battleline: [unit] }}
        unitCountsInList={counts}
      />
    );

    expect(screen.getByText('(2/6)')).toBeInTheDocument();
  });

  it('renders allied units section', () => {
    const alliedUnit = createMockUnit({ name: 'Knight Errant' });

    render(
      <UnitPicker
        {...defaultProps}
        filteredAlliedUnits={[alliedUnit]}
      />
    );

    expect(screen.getByText('Allied Units')).toBeInTheDocument();
    expect(screen.getByText('Knight Errant')).toBeInTheDocument();
  });
});
