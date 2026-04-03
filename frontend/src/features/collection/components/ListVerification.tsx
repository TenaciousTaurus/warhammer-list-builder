import { useState } from 'react';

interface UnitVerification {
  unitId: string;
  unitName: string;
  required: number;
  available: number;
  shortage: number;
}

interface ListVerificationProps {
  loading: boolean;
  verified: boolean;
  status: 'full' | 'partial' | 'none';
  missingUnits: UnitVerification[];
  matchedUnits: UnitVerification[];
  totalShortages: number;
}

export function ListVerification({
  loading,
  verified,
  status,
  missingUnits,
  matchedUnits,
  totalShortages,
}: ListVerificationProps) {
  const [expanded, setExpanded] = useState(false);

  if (loading) {
    return (
      <div className="list-verification list-verification--loading">
        Checking collection...
      </div>
    );
  }

  if (!verified) return null;

  const statusClass = status === 'full' ? 'list-verification--full'
    : status === 'partial' ? 'list-verification--partial'
    : 'list-verification--none';

  const statusText = status === 'full'
    ? 'All units in collection'
    : status === 'partial'
    ? `${missingUnits.length} unit${missingUnits.length !== 1 ? 's' : ''} missing (${totalShortages} models short)`
    : 'No matched units in collection';

  return (
    <div className={`list-verification ${statusClass}`}>
      <button
        className="list-verification__header"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="list-verification__icon">
          {status === 'full' ? '\u2713' : status === 'partial' ? '\u26A0' : '\u2717'}
        </span>
        <span className="list-verification__text">{statusText}</span>
        <span className={`list-verification__arrow ${expanded ? 'list-verification__arrow--open' : ''}`}>
          &#9662;
        </span>
      </button>

      {expanded && (
        <div className="list-verification__details">
          {missingUnits.length > 0 && (
            <div className="list-verification__group">
              <div className="list-verification__group-label list-verification__group-label--missing">
                Missing
              </div>
              {missingUnits.map((u) => (
                <div key={u.unitId} className="list-verification__row list-verification__row--missing">
                  <span className="list-verification__unit-name">{u.unitName}</span>
                  <span className="list-verification__count">
                    {u.available}/{u.required}
                  </span>
                </div>
              ))}
            </div>
          )}
          {matchedUnits.length > 0 && (
            <div className="list-verification__group">
              <div className="list-verification__group-label list-verification__group-label--matched">
                In Collection
              </div>
              {matchedUnits.map((u) => (
                <div key={u.unitId} className="list-verification__row list-verification__row--matched">
                  <span className="list-verification__unit-name">{u.unitName}</span>
                  <span className="list-verification__count">
                    {u.available}/{u.required}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
