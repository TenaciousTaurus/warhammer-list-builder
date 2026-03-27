import type { WargearOption, ModelVariant } from '../../types/database';
import { WargearToggle } from './WargearToggle';
import { WeaponPoolIndicator } from './WeaponPoolIndicator';

interface VariantWargearSectionProps {
  variants: ModelVariant[];
  wargearOptions: WargearOption[];
  selected: Map<string, string>; // groupName -> optionId
  onSelect: (groupName: string, optionId: string) => void;
  composition: Map<string, number>; // variantId -> count
}

export function VariantWargearSection({
  variants,
  wargearOptions,
  selected,
  onSelect,
  composition,
}: VariantWargearSectionProps) {
  // Get non-leader variants' wargear
  const nonLeaderVariantIds = new Set(variants.filter(v => !v.is_leader).map(v => v.id));

  // Wargear for non-leader variants (has model_variant_id matching a non-leader)
  const variantWargear = wargearOptions.filter(
    wo => wo.model_variant_id && nonLeaderVariantIds.has(wo.model_variant_id)
  );

  // Also include unit-level wargear (no model_variant_id) that isn't leader wargear
  const leaderVariantIds = new Set(variants.filter(v => v.is_leader).map(v => v.id));
  const unitLevelWargear = wargearOptions.filter(
    wo => !wo.model_variant_id && !leaderVariantIds.has(wo.model_variant_id ?? '')
  );

  const allWargear = [...variantWargear, ...unitLevelWargear];

  if (allWargear.length === 0) return null;

  // Group by group_name
  const groups = new Map<string, WargearOption[]>();
  for (const opt of allWargear) {
    if (!groups.has(opt.group_name)) groups.set(opt.group_name, []);
    groups.get(opt.group_name)!.push(opt);
  }

  // Only show groups with 2+ options
  const displayGroups = [...groups.entries()].filter(([, opts]) => opts.length > 1);

  if (displayGroups.length === 0) return null;

  // Calculate pool usage
  const pools = new Map<string, { used: number; max: number }>();
  for (const [, opts] of displayGroups) {
    for (const opt of opts) {
      if (opt.pool_group && opt.pool_max) {
        if (!pools.has(opt.pool_group)) {
          pools.set(opt.pool_group, { used: 0, max: opt.pool_max });
        }
        // Count selected options in this pool
        const selectedInGroup = selected.get(opt.group_name);
        if (selectedInGroup === opt.id) {
          const pool = pools.get(opt.pool_group)!;
          // Count based on variant composition
          const variant = variants.find(v => v.id === opt.model_variant_id);
          if (variant) {
            pool.used += composition.get(variant.id) ?? 0;
          } else {
            pool.used += 1;
          }
        }
      }
    }
  }

  return (
    <div className="detail-section detail-section--wargear">
      <div className="detail-section__header">
        <span className="detail-section__icon">&#128296;</span>
        <span className="detail-section__title">Wargear</span>
      </div>
      <div className="detail-section__content">
        {/* Pool indicators */}
        {pools.size > 0 && (
          <div className="variant-wargear__pools">
            {[...pools.entries()].map(([name, { used, max }]) => (
              <WeaponPoolIndicator key={name} poolName={name} used={used} max={max} />
            ))}
          </div>
        )}

        {displayGroups.map(([groupName, opts]) => {
          // Clean up group name for display
          const displayName = groupName
            .replace(/^.*?: /, '')
            .replace(/ wargear$/i, ' Wargear');

          return (
            <WargearToggle
              key={groupName}
              groupName={displayName}
              options={opts}
              selectedId={selected.get(groupName) ?? opts.find(o => o.is_default)?.id ?? ''}
              onSelect={(optionId) => onSelect(groupName, optionId)}
            />
          );
        })}
      </div>
    </div>
  );
}
