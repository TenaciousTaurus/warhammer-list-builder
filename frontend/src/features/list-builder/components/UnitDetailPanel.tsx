import type { Unit, UnitPointsTier, Ability, Enhancement, Weapon, WargearOption, ModelVariant } from '../../../shared/types/database';
import { StatLine } from '../../../shared/components/StatLine';
import { cleanGameText } from '../../../shared/lib/cleanGameText';
import { WargearToggle } from './unit-detail/WargearToggle';
import { LeaderWargearSection } from './unit-detail/LeaderWargearSection';
import { ModelCompositionSection } from './unit-detail/ModelCompositionSection';
import { VariantWargearSection } from './unit-detail/VariantWargearSection';
import { LeaderAttachmentSection } from './unit-detail/LeaderAttachmentSection';
import { LoadoutDatasheet } from './unit-detail/LoadoutDatasheet';

interface EligibleLeader {
  armyListUnitId: string;
  unit: Unit & { unit_points_tiers: UnitPointsTier[] };
  points: number;
  isAttachedHere: boolean;
  isAttachedElsewhere: boolean;
}

interface UnitDetailPanelProps {
  unit: Unit & { abilities: Ability[] };
  weapons: Weapon[];
  modelCount: number;
  points: number;
  availableTiers: UnitPointsTier[];
  onModelCountChange: (count: number) => void;
  onRemove: () => void;
  onClose: () => void;
  enhancement?: {
    assigned: Enhancement | null;
    available: Enhancement[];
    onAssign: (enhancementId: string) => void;
    limitReached?: boolean;
  };
  wargear?: {
    options: WargearOption[];
    selected: Map<string, string>;
    onSelect: (groupName: string, optionId: string) => void;
  };
  composition?: {
    variants: ModelVariant[];
    counts: Map<string, number>;
    onUpdateCount: (variantId: string, count: number) => void;
  };
  leaderAttachment?: {
    eligibleLeaders: EligibleLeader[];
    onAttach: (leaderArmyListUnitId: string) => void;
    onDetach: (leaderArmyListUnitId: string) => void;
  };
}

export function UnitDetailPanel({
  unit, weapons, modelCount, points, availableTiers,
  onModelCountChange, onRemove, onClose,
  enhancement, wargear, composition, leaderAttachment,
}: UnitDetailPanelProps) {
  const sortedTiers = [...availableTiers].sort((a, b) => a.model_count - b.model_count);
  const enhancementPoints = enhancement?.assigned?.points ?? 0;
  const totalPoints = points + enhancementPoints;

  const groupedAbilities = {
    core: unit.abilities.filter(a => a.type === 'core'),
    faction: unit.abilities.filter(a => a.type === 'faction'),
    unique: unit.abilities.filter(a => a.type === 'unique'),
    invulnerable: unit.abilities.filter(a => a.type === 'invulnerable'),
  };

  const hasAbilities = groupedAbilities.core.length > 0
    || groupedAbilities.faction.length > 0
    || groupedAbilities.unique.length > 0
    || groupedAbilities.invulnerable.length > 0;

  // Identify leader variant for leader-specific wargear section
  const leaderVariant = composition?.variants.find(v => v.is_leader) ?? null;

  // Compute loadout weapons with counts
  const loadoutWeapons = weapons.map(w => ({
    ...w,
    count: modelCount, // default: all models have each weapon
  }));

  return (
    <div className="detail-panel">
      {/* Header */}
      <div className="detail-panel__header">
        <div>
          <h3 className="detail-panel__name">{unit.name}</h3>
          <div className="detail-panel__meta">
            <span className={`role-badge role-badge--${unit.role}`}>
              {unit.role.replace('_', ' ')}
            </span>
            {unit.max_per_list === 1 && (
              <span className="unit-card__unique-tag">Unique</span>
            )}
          </div>
        </div>
        <div className="detail-panel__header-right">
          <span className="detail-panel__points">{totalPoints} pts</span>
          <button className="detail-panel__close" onClick={onClose} title="Close">
            &times;
          </button>
        </div>
      </div>

      {/* Stat Line */}
      <div className="detail-panel__section">
        <StatLine unit={unit} />
      </div>

      {/* Leader/Champion Wargear Section */}
      {leaderVariant && wargear && (
        <LeaderWargearSection
          leaderVariant={leaderVariant}
          wargearOptions={wargear.options}
          selected={wargear.selected}
          onSelect={wargear.onSelect}
        />
      )}

      {/* Model Composition */}
      {composition && composition.variants.length > 0 && (
        <ModelCompositionSection
          variants={composition.variants}
          composition={composition.counts}
          totalModels={modelCount}
          onUpdateCount={composition.onUpdateCount}
        />
      )}

      {/* Model Count (for units without composition but with tiers) */}
      {sortedTiers.length > 1 && (!composition || composition.variants.length === 0) && (
        <div className="detail-section detail-section--models">
          <div className="detail-section__header">
            <span className="detail-section__icon">&#9881;</span>
            <span className="detail-section__title">Models</span>
          </div>
          <div className="detail-section__content">
            <select
              className="form-select"
              value={modelCount}
              onChange={(e) => onModelCountChange(Number(e.target.value))}
            >
              {sortedTiers.map((tier) => (
                <option key={tier.id} value={tier.model_count}>
                  {tier.model_count} models ({tier.points} pts)
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Variant Wargear (non-leader) */}
      {wargear && composition && (
        <VariantWargearSection
          variants={composition.variants}
          wargearOptions={wargear.options}
          selected={wargear.selected}
          onSelect={wargear.onSelect}
          composition={composition.counts}
        />
      )}

      {/* Unit-level Wargear (for units without composition/variants) */}
      {wargear && (!composition || composition.variants.length === 0) && (() => {
        const wargearGroups: [string, WargearOption[]][] = [];
        const groups = new Map<string, WargearOption[]>();
        for (const opt of wargear.options) {
          if (!groups.has(opt.group_name)) groups.set(opt.group_name, []);
          groups.get(opt.group_name)!.push(opt);
        }
        for (const [name, opts] of groups) {
          if (opts.length > 1) wargearGroups.push([name, opts]);
        }
        if (wargearGroups.length === 0) return null;
        return (
          <div className="detail-section detail-section--wargear">
            <div className="detail-section__header">
              <span className="detail-section__icon">&#128296;</span>
              <span className="detail-section__title">Wargear</span>
            </div>
            <div className="detail-section__content">
              {wargearGroups.map(([groupName, opts]) => (
                <WargearToggle
                  key={groupName}
                  groupName={groupName}
                  options={opts}
                  selectedId={wargear.selected.get(groupName) ?? opts.find(o => o.is_default)?.id ?? ''}
                  onSelect={(optionId) => wargear.onSelect(groupName, optionId)}
                />
              ))}
            </div>
          </div>
        );
      })()}

      {/* Leader Attachment */}
      {leaderAttachment && leaderAttachment.eligibleLeaders.length > 0 && (
        <LeaderAttachmentSection
          eligibleLeaders={leaderAttachment.eligibleLeaders}
          onAttach={leaderAttachment.onAttach}
          onDetach={leaderAttachment.onDetach}
        />
      )}

      {/* Enhancement */}
      {enhancement && (
        <div className="detail-section detail-section--enhancement">
          <div className="detail-section__header">
            <span className="detail-section__icon">&#10022;</span>
            <span className="detail-section__title">Enhancement</span>
          </div>
          <div className="detail-section__content">
            <select
              className="form-select"
              value={enhancement.assigned?.id ?? ''}
              onChange={(e) => enhancement.onAssign(e.target.value)}
              disabled={enhancement.limitReached}
            >
              <option value="">{enhancement.limitReached ? 'Max 3 enhancements reached' : 'None'}</option>
              {enhancement.available.map(e => (
                <option key={e.id} value={e.id}>{e.name} (+{e.points} pts)</option>
              ))}
            </select>
            {enhancement.assigned && (
              <div className="detail-panel__enhancement-detail">
                <div className="detail-panel__enhancement-name">
                  <span>{enhancement.assigned.name}</span>
                  <span>+{enhancement.assigned.points} pts</span>
                </div>
                <div className="detail-panel__enhancement-desc">
                  {cleanGameText(enhancement.assigned.description)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loadout Datasheet */}
      <LoadoutDatasheet weapons={loadoutWeapons} />

      {/* Abilities */}
      {hasAbilities && (
        <div className="detail-section detail-section--abilities">
          <div className="detail-section__header">
            <span className="detail-section__icon">&#9733;</span>
            <span className="detail-section__title">Abilities</span>
          </div>
          <div className="detail-section__content">
            <div className="detail-panel__ability-list">
              {groupedAbilities.invulnerable.map(a => renderAbility(a))}
              {groupedAbilities.core.map(a => renderAbility(a))}
              {groupedAbilities.faction.map(a => renderAbility(a))}
              {groupedAbilities.unique.map(a => renderAbility(a))}
            </div>
          </div>
        </div>
      )}

      {/* Transport Info */}
      {unit.transport_capacity != null && (
        <div className="detail-panel__section">
          <div className="detail-panel__section-label">Transport Capacity</div>
          <div className="transport-info">
            <div className="transport-info__capacity">
              <span className="transport-info__number">{unit.transport_capacity}</span>
              <span className="transport-info__label">models</span>
            </div>
            {unit.transport_keywords_allowed && unit.transport_keywords_allowed.length > 0 && (
              <div className="transport-info__rule">
                <span className="transport-info__rule-label">Allowed:</span>
                {unit.transport_keywords_allowed.map((kw, i) => (
                  <span key={i} className="transport-info__keyword transport-info__keyword--allowed">{kw}</span>
                ))}
              </div>
            )}
            {unit.transport_keywords_excluded && unit.transport_keywords_excluded.length > 0 && (
              <div className="transport-info__rule">
                <span className="transport-info__rule-label">Excluded:</span>
                {unit.transport_keywords_excluded.map((kw, i) => (
                  <span key={i} className="transport-info__keyword transport-info__keyword--excluded">{kw}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Keywords */}
      {unit.keywords.length > 0 && (
        <div className="detail-panel__section">
          <div className="detail-panel__section-label">Keywords</div>
          <div className="detail-panel__keywords">
            {unit.keywords.map((kw, i) => (
              <span key={i} className="detail-panel__keyword">{kw}</span>
            ))}
          </div>
        </div>
      )}

      {/* Remove Button */}
      <div className="detail-panel__section detail-panel__section--footer">
        <button
          className="btn btn--danger"
          onClick={onRemove}
        >
          Remove Unit
        </button>
      </div>
    </div>
  );
}

function renderAbility(ability: { id: string; name: string; type: string; description: string }) {
  return (
    <div key={ability.id} className="detail-panel__ability-item">
      <div className="detail-panel__ability-header">
        <span className={`ability-tag ability-tag--${ability.type === 'invulnerable' ? 'invuln' : ability.type}`}>
          {ability.type === 'invulnerable' ? 'Invuln' : ability.type}
        </span>
        <span className="detail-panel__ability-name">{ability.name}</span>
      </div>
      {ability.description && (
        <div className="detail-panel__ability-desc">{cleanGameText(ability.description)}</div>
      )}
    </div>
  );
}
