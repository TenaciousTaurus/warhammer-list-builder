import { useState } from 'react';
import type { Unit, Ability, Weapon } from '../types/database';
import { DatasheetView } from './DatasheetView';

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
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  unit?: Unit & { abilities: Ability[] };
  weapons?: Weapon[];
}

export function RosterItem({
  unitName, modelCount, points, enhancementName, enhancementPoints,
  wargearSummary, isSelected, onClick, onRemove, onMoveUp, onMoveDown, unit, weapons,
}: RosterItemProps) {
  const [expanded, setExpanded] = useState(false);
  const totalPoints = points + (enhancementPoints ?? 0);
  const displayName = modelCount > 1 ? `${modelCount} ${unitName}` : unitName;
  const hasSubline = wargearSummary || enhancementName;

  function handleExpandToggle(e: React.MouseEvent) {
    e.stopPropagation();
    setExpanded(!expanded);
  }

  return (
    <div
      className={`roster-item${isSelected ? ' roster-item--selected' : ''}${expanded ? ' roster-item--expanded' : ''}`}
      onClick={onClick}
    >
      <div className="roster-item__row1">
        {/* Drag handle + move buttons */}
        <div className="roster-item__drag-handle" title="Drag to reorder">
          <span className="roster-item__grip">&#8942;&#8942;</span>
          {(onMoveUp || onMoveDown) && (
            <div className="roster-item__movers">
              <button
                className="roster-item__move-btn"
                onClick={(e) => { e.stopPropagation(); onMoveUp?.(); }}
                disabled={!onMoveUp}
                title="Move up"
              >&uarr;</button>
              <button
                className="roster-item__move-btn"
                onClick={(e) => { e.stopPropagation(); onMoveDown?.(); }}
                disabled={!onMoveDown}
                title="Move down"
              >&darr;</button>
            </div>
          )}
        </div>
        <span className="roster-item__name">{displayName}</span>
        <div className="roster-item__right">
          <span className="roster-item__points">{totalPoints} pts</span>
          {unit && (
            <button
              className="roster-item__expand"
              onClick={handleExpandToggle}
              title={expanded ? 'Collapse datasheet' : 'Expand datasheet'}
            >
              {expanded ? '\u25B2' : '\u25BC'}
            </button>
          )}
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
      {expanded && unit && weapons && (
        <div className="roster-item__datasheet">
          <DatasheetView unit={unit} weapons={weapons} compact />
        </div>
      )}
    </div>
  );
}
