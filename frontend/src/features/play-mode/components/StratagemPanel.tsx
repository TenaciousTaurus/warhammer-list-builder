import { useState, useMemo } from 'react';
import { useGameSessionStore, PHASES } from '../stores/gameSessionStore';
import type { Stratagem } from '../../../shared/types/database';

export function StratagemPanel() {
  const stratagems = useGameSessionStore((s) => s.stratagems);
  const currentPhase = useGameSessionStore((s) => s.session?.current_phase ?? 0);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const currentPhaseName = PHASES[currentPhase] ?? PHASES[0];

  const filtered = useMemo(() => {
    let list = stratagems;

    if (search.trim()) {
      const term = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(term) ||
          s.effect_text.toLowerCase().includes(term),
      );
    }

    // Sort: current-phase stratagems first, then alphabetical
    return [...list].sort((a, b) => {
      const aRelevant = isPhaseRelevant(a, currentPhaseName);
      const bRelevant = isPhaseRelevant(b, currentPhaseName);
      if (aRelevant && !bRelevant) return -1;
      if (!aRelevant && bRelevant) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [stratagems, search, currentPhaseName]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="stratagem-panel">
      <div className="stratagem-panel__search">
        <input
          className="stratagem-panel__search-input"
          type="text"
          placeholder="Search stratagems..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="stratagem-panel__list">
        {filtered.length === 0 && (
          <p className="stratagem-panel__empty">No stratagems found.</p>
        )}
        {filtered.map((stratagem) => {
          const relevant = isPhaseRelevant(stratagem, currentPhaseName);
          const expanded = expandedId === stratagem.id;

          return (
            <div
              key={stratagem.id}
              className={`stratagem-card ${relevant ? 'stratagem-card--relevant' : ''}`}
            >
              <button
                className="stratagem-card__header"
                onClick={() => toggleExpand(stratagem.id)}
                aria-expanded={expanded}
              >
                <span className="stratagem-card__cp">{stratagem.cp_cost} CP</span>
                <span className="stratagem-card__name">{stratagem.name}</span>
                <span className="stratagem-card__phase-badge">{stratagem.phase}</span>
              </button>

              {expanded && (
                <div className="stratagem-card__body">
                  <div className="stratagem-card__type">{stratagem.type}</div>
                  <div className="stratagem-card__section">
                    <strong className="stratagem-card__section-label">When:</strong>
                    <span className="stratagem-card__section-text">{stratagem.when_text}</span>
                  </div>
                  <div className="stratagem-card__section">
                    <strong className="stratagem-card__section-label">Effect:</strong>
                    <span className="stratagem-card__section-text">{stratagem.effect_text}</span>
                  </div>
                  {stratagem.restrictions && (
                    <div className="stratagem-card__section">
                      <strong className="stratagem-card__section-label">Restrictions:</strong>
                      <span className="stratagem-card__section-text">{stratagem.restrictions}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function isPhaseRelevant(stratagem: Stratagem, currentPhaseName: string): boolean {
  const phase = stratagem.phase.toLowerCase();
  const current = currentPhaseName.toLowerCase();
  return phase.includes(current) || phase === 'any' || phase === 'either player\'s';
}
