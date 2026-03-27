import type { Unit, UnitPointsTier } from '../../../../shared/types/database';

interface EligibleLeader {
  armyListUnitId: string;
  unit: Unit & { unit_points_tiers: UnitPointsTier[] };
  points: number;
  isAttachedHere: boolean;
  isAttachedElsewhere: boolean;
}

interface LeaderAttachmentSectionProps {
  eligibleLeaders: EligibleLeader[];
  onAttach: (leaderArmyListUnitId: string) => void;
  onDetach: (leaderArmyListUnitId: string) => void;
}

export function LeaderAttachmentSection({
  eligibleLeaders,
  onAttach,
  onDetach,
}: LeaderAttachmentSectionProps) {
  if (eligibleLeaders.length === 0) return null;

  return (
    <div className="detail-section detail-section--leaders">
      <div className="detail-section__header">
        <span className="detail-section__icon">&#9733;</span>
        <span className="detail-section__title">Leaders</span>
      </div>
      <div className="detail-section__content">
        {eligibleLeaders.map((leader) => {
          const isActive = leader.isAttachedHere;
          const isDisabled = leader.isAttachedElsewhere;

          return (
            <div
              key={leader.armyListUnitId}
              className={`leader-card${isActive ? ' leader-card--attached' : ''}${isDisabled ? ' leader-card--disabled' : ''}`}
            >
              <div className="leader-card__info">
                <span className="leader-card__name">{leader.unit.name}</span>
                <span className="leader-card__stats">
                  T{leader.unit.toughness} W{leader.unit.wounds} Sv{leader.unit.save}
                </span>
              </div>
              <div className="leader-card__right">
                <span className="leader-card__pts">{leader.points} pts</span>
                <button
                  className={`leader-card__toggle${isActive ? ' leader-card__toggle--active' : ''}`}
                  onClick={() => isActive ? onDetach(leader.armyListUnitId) : onAttach(leader.armyListUnitId)}
                  disabled={isDisabled}
                  title={isDisabled ? 'Already attached to another unit' : isActive ? 'Detach leader' : 'Attach leader'}
                >
                  {isActive ? '✓' : '+'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
