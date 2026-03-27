import type { ModelVariant } from '../../types/database';

interface ModelCompositionSectionProps {
  variants: ModelVariant[];
  composition: Map<string, number>; // variant_id -> count
  totalModels: number;
  onUpdateCount: (variantId: string, count: number) => void;
}

export function ModelCompositionSection({
  variants, composition, totalModels, onUpdateCount,
}: ModelCompositionSectionProps) {
  if (variants.length === 0) return null;

  const leaders = variants.filter(v => v.is_leader);
  const nonLeaders = variants.filter(v => !v.is_leader);

  // Group non-leaders by group_name
  const groups: { name: string | null; variants: ModelVariant[] }[] = [];
  const groupMap = new Map<string | null, ModelVariant[]>();
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
    const isAtMin = count <= variant.min_count;
    const isAtMax = count >= variant.max_count;

    return (
      <div key={variant.id} className="comp__row">
        {isFixed ? (
          <div className="comp__fixed">
            <span className="comp__fixed-count">{count}×</span>
          </div>
        ) : (
          <div className="comp__controls">
            <span className="comp__bound comp__bound--min">{variant.min_count} ≤</span>
            <button
              className="comp__btn"
              onClick={() => onUpdateCount(variant.id, Math.max(variant.min_count, count - 1))}
              disabled={isAtMin}
            >−</button>
            <span className={`comp__count${isAtMin ? ' comp__count--min' : ''}${isAtMax ? ' comp__count--max' : ''}`}>
              {count}
            </span>
            <button
              className="comp__btn"
              onClick={() => onUpdateCount(variant.id, Math.min(variant.max_count, count + 1))}
              disabled={isAtMax}
            >+</button>
            <span className="comp__bound comp__bound--max">≤ {variant.max_count}</span>
          </div>
        )}
        <div className="comp__name">
          <span>{variant.name}</span>
        </div>
        {!isFixed && (
          <div className="comp__bar">
            <div
              className="comp__bar-fill"
              style={{
                width: `${variant.max_count > 0 ? (count / variant.max_count) * 100 : 0}%`,
              }}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="detail-section detail-section--composition">
      <div className="detail-section__header">
        <span className="detail-section__icon">&#9881;</span>
        <span className="detail-section__title">Model Composition</span>
        <span className="detail-section__badge">{totalModels} models</span>
      </div>
      <div className="detail-section__content">
        {leaders.map(renderVariantRow)}
        {groups.map(({ name, variants: groupVariants }) => {
          const groupTotal = groupVariants.reduce((sum, v) => sum + getCount(v.id), 0);
          return (
            <div key={name ?? 'default'} className="comp__group">
              {name && (
                <div className="comp__group-header">
                  <span className="comp__group-name">{name}</span>
                  <span className="comp__group-count">{groupTotal}</span>
                </div>
              )}
              {groupVariants.map(renderVariantRow)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
