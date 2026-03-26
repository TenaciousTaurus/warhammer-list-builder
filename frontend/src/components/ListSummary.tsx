import { useState, useRef, useEffect } from 'react';
import type { ArmyList, Detachment, ValidateArmyListResult } from '../types/database';
import { PointsBar } from './PointsBar';

const STANDARD_POINTS = [500, 1000, 1500, 2000, 2500, 3000];

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
  onUpdateName?: (name: string) => void;
  onUpdatePointsLimit?: (limit: number) => void;
}

export function ListSummary({
  list, totalPoints, overLimit, unitLimitWarnings, enhancementWarnings,
  pointsMismatch, serverValidation, serverValidationError, onBack, onExport, onPlay,
  onUpdateName, onUpdatePointsLimit,
}: ListSummaryProps) {
  const [showDetachmentRules, setShowDetachmentRules] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(list.name);
  const [editingPoints, setEditingPoints] = useState(false);
  const [pointsValue, setPointsValue] = useState(String(list.points_limit));
  const nameInputRef = useRef<HTMLInputElement>(null);
  const pointsInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingName && nameInputRef.current) nameInputRef.current.focus();
  }, [editingName]);

  useEffect(() => {
    if (editingPoints && pointsInputRef.current) {
      pointsInputRef.current.focus();
      pointsInputRef.current.select();
    }
  }, [editingPoints]);

  function handleNameSubmit() {
    const trimmed = nameValue.trim();
    if (trimmed && trimmed !== list.name && onUpdateName) {
      onUpdateName(trimmed);
    } else {
      setNameValue(list.name);
    }
    setEditingName(false);
  }

  function handlePointsSubmit() {
    const num = parseInt(pointsValue);
    if (num > 0 && num !== list.points_limit && onUpdatePointsLimit) {
      onUpdatePointsLimit(num);
    } else {
      setPointsValue(String(list.points_limit));
    }
    setEditingPoints(false);
  }

  const hasValidationIssues = overLimit || unitLimitWarnings.length > 0
    || enhancementWarnings.length > 0 || pointsMismatch || serverValidationError
    || (serverValidation && !serverValidation.is_valid && !overLimit);

  return (
    <div className="list-editor__summary">
      <div className="list-editor__summary-header">
        <div>
          {editingName ? (
            <input
              ref={nameInputRef}
              className="list-editor__name-input"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleNameSubmit();
                if (e.key === 'Escape') { setNameValue(list.name); setEditingName(false); }
              }}
            />
          ) : (
            <h2
              className="list-editor__army-name list-editor__army-name--editable"
              onClick={() => { if (onUpdateName) { setNameValue(list.name); setEditingName(true); } }}
              title={onUpdateName ? 'Click to edit name' : undefined}
            >
              {list.name}
            </h2>
          )}
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
        <span
          className="list-editor__points-limit list-editor__points-limit--editable"
          onClick={() => {
            if (onUpdatePointsLimit) {
              setPointsValue(String(list.points_limit));
              setEditingPoints(true);
            }
          }}
          title={onUpdatePointsLimit ? 'Click to change points limit' : undefined}
        >
          {editingPoints ? (
            <>
              {' / '}
              <input
                ref={pointsInputRef}
                className="list-editor__points-input"
                type="number"
                min="100"
                max="10000"
                step="100"
                value={pointsValue}
                onChange={(e) => setPointsValue(e.target.value)}
                onBlur={handlePointsSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handlePointsSubmit();
                  if (e.key === 'Escape') { setPointsValue(String(list.points_limit)); setEditingPoints(false); }
                }}
                onClick={(e) => e.stopPropagation()}
              />
              {' pts'}
            </>
          ) : (
            <> / {list.points_limit} pts</>
          )}
        </span>
        {overLimit && (
          <span className="list-editor__points-over"> ({totalPoints - list.points_limit})</span>
        )}
      </div>

      {/* Quick points presets */}
      {editingPoints && (
        <div className="list-editor__points-presets">
          {STANDARD_POINTS.map(pts => (
            <button
              key={pts}
              className={`list-editor__points-preset${pts === list.points_limit ? ' list-editor__points-preset--active' : ''}`}
              onClick={() => {
                if (onUpdatePointsLimit) onUpdatePointsLimit(pts);
                setPointsValue(String(pts));
                setEditingPoints(false);
              }}
            >
              {pts}
            </button>
          ))}
        </div>
      )}

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
