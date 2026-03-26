interface RosterItemProps {
  unitName: string;
  modelCount: number;
  points: number;
  enhancementName?: string;
  enhancementPoints?: number;
  wargearSummary?: string;
  isSelected: boolean;
  onClick: () => void;
  onRemove: () => void;
}

export function RosterItem({
  unitName, modelCount, points, enhancementName, enhancementPoints,
  wargearSummary, isSelected, onClick, onRemove,
}: RosterItemProps) {
  const totalPoints = points + (enhancementPoints ?? 0);
  const displayName = modelCount > 1 ? `${modelCount} ${unitName}` : unitName;
  const hasSubline = wargearSummary || enhancementName;

  return (
    <div
      className={`roster-item${isSelected ? ' roster-item--selected' : ''}`}
      onClick={onClick}
    >
      <div className="roster-item__row1">
        <span className="roster-item__name">{displayName}</span>
        <div className="roster-item__right">
          <span className="roster-item__points">{totalPoints} pts</span>
          <button
            className="roster-item__remove"
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            title="Remove unit"
          >
            &times;
          </button>
        </div>
      </div>
      {hasSubline && (
        <div className="roster-item__row2">
          {wargearSummary && <span>{wargearSummary}</span>}
          {wargearSummary && enhancementName && <span> &middot; </span>}
          {enhancementName && (
            <span className="roster-item__enhancement">
              {enhancementName}{enhancementPoints ? ` (+${enhancementPoints} pts)` : ''}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
