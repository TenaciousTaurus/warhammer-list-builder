import { useState } from 'react';
import type { ArmyList, Detachment, ValidateArmyListResult } from '../types/database';
import { PointsBar } from './PointsBar';

interface ListSummaryProps {
  list: ArmyList & { detachments: Detachment };
  totalPoints: number;
  overLimit: boolean;
  unitLimitWarnings: string[];
  enhancementWarnings: string[];
  pointsMismatch: boolean;
  serverValidation: ValidateArmyListResult | null;
  serverValidationError: boolean;
  onBack: () => void;
  onExport: () => void;
  onPlay: () => void;
}

export function ListSummary({
  list, totalPoints, overLimit, unitLimitWarnings, enhancementWarnings,
  pointsMismatch, serverValidation, serverValidationError, onBack, onExport, onPlay,
}: ListSummaryProps) {
  const [showDetachmentRules, setShowDetachmentRules] = useState(false);

  const hasValidationIssues = overLimit || unitLimitWarnings.length > 0
    || enhancementWarnings.length > 0 || pointsMismatch || serverValidationError
    || (serverValidation && !serverValidation.is_valid && !overLimit);

  return (
    <div className="list-editor__summary">
      <div className="list-editor__summary-header">
        <div>
          <h2 className="list-editor__army-name">{list.name}</h2>
          <span className="list-editor__detachment">{list.detachments?.name}</span>
        </div>
        <div className="list-editor__summary-actions">
          <button className="btn" onClick={onBack}>
            &larr; Back
          </button>
          <button className="btn" onClick={onExport}>
            Export
          </button>
          <button className="btn btn--primary" onClick={onPlay}>
            Play
          </button>
        </div>
      </div>

      <div className={`list-editor__points-display${overLimit ? ' list-editor__points-display--over' : ''}`}>
        {totalPoints}
        <span className="list-editor__points-limit"> / {list.points_limit} pts</span>
        {overLimit && (
          <span className="list-editor__points-over"> ({totalPoints - list.points_limit})</span>
        )}
      </div>

      <PointsBar current={totalPoints} limit={list.points_limit} />

      {/* Detachment Rules */}
      {list.detachments?.rule_text && (
        <div className="detachment-rules">
          <button
            className="detachment-rules__toggle"
            onClick={() => setShowDetachmentRules(!showDetachmentRules)}
          >
            <span className="detachment-rules__arrow">{showDetachmentRules ? '\u25BC' : '\u25B6'}</span>
            <span>Detachment Rules</span>
          </button>
          {showDetachmentRules && (
            <div className="detachment-rules__content">
              {list.detachments.rule_text}
            </div>
          )}
        </div>
      )}

      {/* Validation banners */}
      {hasValidationIssues && (
        <div className="list-editor__validations">
          {overLimit && (
            <div className="validation-banner validation-banner--error">
              Over limit by {totalPoints - list.points_limit} points!
            </div>
          )}
          {unitLimitWarnings.length > 0 && (
            <div className="validation-banner validation-banner--error">
              {unitLimitWarnings.map((w, i) => <div key={i}>{w}</div>)}
            </div>
          )}
          {enhancementWarnings.length > 0 && (
            <div className="validation-banner validation-banner--warning">
              {enhancementWarnings.map((w, i) => <div key={i}>{w}</div>)}
            </div>
          )}
          {pointsMismatch && (
            <div className="validation-banner validation-banner--warning">
              Points mismatch: client {totalPoints} vs server {serverValidation!.total_points}
            </div>
          )}
          {serverValidationError && (
            <div className="validation-banner validation-banner--warning">
              Server validation unavailable
            </div>
          )}
          {serverValidation && !serverValidation.is_valid && !overLimit && (
            <div className="validation-banner validation-banner--error">
              Server: exceeds {serverValidation.points_limit} pts ({serverValidation.total_points} pts)
            </div>
          )}
        </div>
      )}
    </div>
  );
}
