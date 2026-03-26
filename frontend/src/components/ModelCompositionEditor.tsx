import type { ModelVariant } from '../types/database';

interface ModelCompositionEditorProps {
  variants: ModelVariant[];
  composition: Map<string, number>;  // variant_id -> count
  totalModels: number;
  onUpdateCount: (variantId: string, count: number) => void;
}

export function ModelCompositionEditor({
  variants, composition, totalModels, onUpdateCount,
}: ModelCompositionEditorProps) {
  if (variants.length === 0) return null;

  // Group variants by group_name
  const groups: { name: string | null; variants: ModelVariant[] }[] = [];
  const groupMap = new Map<string | null, ModelVariant[]>();

  // Leaders first (ungrouped), then grouped
  const leaders = variants.filter(v => v.is_leader);
  const nonLeaders = variants.filter(v => !v.is_leader);

  for (const v of nonLeaders) {
    const key = v.group_name;
    if (!groupMap.has(key)) groupMap.set(key, []);
    groupMap.get(key)!.push(v);
  }

  for (const [name, vars] of groupMap) {
    groups.push({ name, variants: vars.sort((a, b) => a.sort_order - b.sort_order) });
  }

  function getCount(variantId: string): number {
    return composition.get(variantId) ?? 0;
  }

  function renderVariantRow(variant: ModelVariant) {
    const count = variant.is_leader ? variant.min_count : getCount(variant.id);
    const isFixed = variant.is_leader && variant.min_count === variant.max_count;

    return (
      <div key={variant.id} className="composition__row">
        <div className="composition__row-left">
          {!isFixed && (
            <div className="composition__controls">
              <button
                className="composition__btn"
                onClick={() => onUpdateCount(variant.id, Math.max(variant.min_count, count - 1))}
                disabled={count <= variant.min_count}
              >-</button>
              <span className="composition__count">{count}</span>
              <button
                className="composition__btn"
                onClick={() => onUpdateCount(variant.id, Math.min(variant.max_count, count + 1))}
                disabled={count >= variant.max_count}
              >+</button>
            </div>
          )}
          {isFixed && (
            <span className="composition__fixed-count">{count}x</span>
          )}
        </div>
        <div className="composition__row-right">
          <span className="composition__variant-name">{variant.name}</span>
          {!isFixed && (
            <span className="composition__constraint">
              {variant.min_count}-{variant.max_count}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="composition">
      <div className="composition__header">
        <span className="composition__title">Model Composition</span>
        <span className="composition__total">{totalModels} models</span>
      </div>

      {/* Leaders */}
      {leaders.map(renderVariantRow)}

      {/* Grouped variants */}
      {groups.map(({ name, variants: groupVariants }) => {
        const groupTotal = groupVariants.reduce((sum, v) => sum + getCount(v.id), 0);
        return (
          <div key={name ?? 'default'} className="composition__group">
            {name && (
              <div className="composition__group-header">
                <span className="composition__group-name">{name}</span>
                <span className="composition__group-count">{groupTotal}</span>
              </div>
            )}
            {groupVariants.map(renderVariantRow)}
          </div>
        );
      })}
    </div>
  );
}
