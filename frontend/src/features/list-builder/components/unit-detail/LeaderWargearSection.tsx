import type { WargearOption, ModelVariant } from '../../../../shared/types/database';
import { WargearToggle } from './WargearToggle';

interface LeaderWargearSectionProps {
  leaderVariant: ModelVariant;
  wargearOptions: WargearOption[];
  selected: Map<string, string>; // groupName -> optionId
  onSelect: (groupName: string, optionId: string) => void;
}

export function LeaderWargearSection({
  leaderVariant,
  wargearOptions,
  selected,
  onSelect,
}: LeaderWargearSectionProps) {
  // Filter wargear options that belong to this leader variant
  const leaderOptions = wargearOptions.filter(
    wo => wo.model_variant_id === leaderVariant.id
  );

  if (leaderOptions.length === 0) return null;

  // Group by group_name
  const groups = new Map<string, WargearOption[]>();
  for (const opt of leaderOptions) {
    if (!groups.has(opt.group_name)) groups.set(opt.group_name, []);
    groups.get(opt.group_name)!.push(opt);
  }

  // Only show groups with 2+ options (single-option groups are fixed)
  const displayGroups = [...groups.entries()].filter(([, opts]) => opts.length > 1);

  if (displayGroups.length === 0) return null;

  return (
    <div className="detail-section detail-section--leader-wargear">
      <div className="detail-section__header">
        <span className="detail-section__icon">&#9876;</span>
        <span className="detail-section__title">{leaderVariant.name}</span>
      </div>
      <div className="detail-section__content">
        {displayGroups.map(([groupName, opts]) => (
          <WargearToggle
            key={groupName}
            groupName={groupName.replace(`${leaderVariant.name}: `, '').replace(`${leaderVariant.name} wargear`, 'Wargear')}
            options={opts}
            selectedId={selected.get(groupName) ?? opts.find(o => o.is_default)?.id ?? ''}
            onSelect={(optionId) => onSelect(groupName, optionId)}
          />
        ))}
      </div>
    </div>
  );
}
