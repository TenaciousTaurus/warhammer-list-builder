import { useMemo, useState } from 'react';
import type { CollectionEntry, Faction } from '../../../shared/types/database';
import { PAINTING_STATUSES } from '../stores/collectionStore';
import type { PaintingStatus } from '../stores/collectionStore';

interface CollectionStatsProps {
  entries: CollectionEntry[];
  factions: Faction[];
  factionNames: Map<string, string>;
}

const STATUS_LABELS: Record<PaintingStatus, string> = {
  unbuilt: 'Unbuilt',
  assembled: 'Assembled',
  primed: 'Primed',
  basecoated: 'Basecoated',
  detailed: 'Detailed',
  based: 'Based',
  finished: 'Finished',
};

export function CollectionStats({ entries, factionNames }: CollectionStatsProps) {
  const [expanded, setExpanded] = useState(false);

  const stats = useMemo(() => {
    const totalModels = entries.reduce((sum, e) => sum + e.quantity, 0);
    const finishedModels = entries
      .filter((e) => e.painting_status === 'finished')
      .reduce((sum, e) => sum + e.quantity, 0);
    const paintedPercent = totalModels > 0 ? Math.round((finishedModels / totalModels) * 100) : 0;
    const totalValue = entries.reduce((sum, e) => sum + (e.purchase_price ?? 0), 0);
    const avgCostPerModel = totalModels > 0 ? totalValue / totalModels : 0;
    const totalEntries = entries.length;

    // Per-status breakdown (by model count)
    const statusCounts = new Map<PaintingStatus, number>();
    for (const s of PAINTING_STATUSES) {
      statusCounts.set(s, 0);
    }
    for (const e of entries) {
      const current = statusCounts.get(e.painting_status as PaintingStatus) ?? 0;
      statusCounts.set(e.painting_status as PaintingStatus, current + e.quantity);
    }

    // Per-faction breakdown
    const factionCounts = new Map<string, { total: number; finished: number; value: number }>();
    for (const e of entries) {
      const fid = e.faction_id ?? '__none__';
      const existing = factionCounts.get(fid) ?? { total: 0, finished: 0, value: 0 };
      existing.total += e.quantity;
      if (e.painting_status === 'finished') existing.finished += e.quantity;
      existing.value += e.purchase_price ?? 0;
      factionCounts.set(fid, existing);
    }

    // Sort factions by total model count descending
    const factionBreakdown = Array.from(factionCounts.entries())
      .map(([fid, data]) => ({
        factionId: fid,
        name: fid === '__none__' ? 'Unassigned' : factionNames.get(fid) ?? 'Unknown',
        ...data,
      }))
      .sort((a, b) => b.total - a.total);

    return {
      totalModels,
      finishedModels,
      paintedPercent,
      totalValue,
      avgCostPerModel,
      totalEntries,
      statusCounts,
      factionBreakdown,
    };
  }, [entries, factionNames]);

  if (entries.length === 0) return null;

  return (
    <div className="collection-stats">
      {/* Summary cards row */}
      <div className="collection-stats__summary">
        <div className="collection-stats__card">
          <span className="collection-stats__card-value">{stats.totalModels}</span>
          <span className="collection-stats__card-label">Models</span>
        </div>
        <div className="collection-stats__card">
          <span className="collection-stats__card-value">{stats.totalEntries}</span>
          <span className="collection-stats__card-label">Units</span>
        </div>
        <div className="collection-stats__card">
          <span className="collection-stats__card-value">{stats.paintedPercent}%</span>
          <span className="collection-stats__card-label">Painted</span>
        </div>
        {stats.totalValue > 0 && (
          <div className="collection-stats__card">
            <span className="collection-stats__card-value">${stats.totalValue.toFixed(0)}</span>
            <span className="collection-stats__card-label">Invested</span>
          </div>
        )}
        {stats.totalValue > 0 && (
          <div className="collection-stats__card">
            <span className="collection-stats__card-value">${stats.avgCostPerModel.toFixed(2)}</span>
            <span className="collection-stats__card-label">Avg / Model</span>
          </div>
        )}
      </div>

      {/* Overall painting progress bar */}
      <div className="collection-stats__progress">
        <div className="collection-stats__progress-header">
          <span className="collection-stats__progress-title">Painting Progress</span>
          <span className="collection-stats__progress-count">
            {stats.finishedModels} / {stats.totalModels}
          </span>
        </div>
        <div className="collection-stats__progress-track">
          <div
            className="collection-stats__progress-fill"
            style={{ width: `${stats.paintedPercent}%` }}
          />
        </div>
      </div>

      {/* Expand toggle */}
      <button
        className="collection-stats__toggle"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? 'Hide Details' : 'Show Details'}
        <span className={`collection-stats__toggle-icon ${expanded ? 'collection-stats__toggle-icon--open' : ''}`}>
          &#9662;
        </span>
      </button>

      {expanded && (
        <div className="collection-stats__details">
          {/* Per-status breakdown */}
          <div className="collection-stats__section">
            <h3 className="collection-stats__section-title">By Status</h3>
            <div className="collection-stats__status-bars">
              {PAINTING_STATUSES.map((s) => {
                const count = stats.statusCounts.get(s) ?? 0;
                const pct = stats.totalModels > 0 ? (count / stats.totalModels) * 100 : 0;
                return (
                  <div key={s} className="collection-stats__status-row">
                    <div className="collection-stats__status-label">
                      <span className="collection-stats__status-dot" data-status={s} />
                      <span>{STATUS_LABELS[s]}</span>
                    </div>
                    <div className="collection-stats__status-track">
                      <div
                        className="collection-stats__status-fill"
                        data-status={s}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="collection-stats__status-count">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Per-faction breakdown */}
          {stats.factionBreakdown.length > 0 && (
            <div className="collection-stats__section">
              <h3 className="collection-stats__section-title">By Faction</h3>
              <div className="collection-stats__faction-list">
                {stats.factionBreakdown.map((f) => {
                  const pct = stats.totalModels > 0 ? (f.total / stats.totalModels) * 100 : 0;
                  const paintedPct = f.total > 0 ? Math.round((f.finished / f.total) * 100) : 0;
                  return (
                    <div key={f.factionId} className="collection-stats__faction-row">
                      <div className="collection-stats__faction-header">
                        <span className="collection-stats__faction-name">{f.name}</span>
                        <span className="collection-stats__faction-meta">
                          {f.total} models &middot; {paintedPct}% painted
                          {f.value > 0 && <> &middot; ${f.value.toFixed(0)}</>}
                        </span>
                      </div>
                      <div className="collection-stats__faction-track">
                        <div
                          className="collection-stats__faction-fill collection-stats__faction-fill--total"
                          style={{ width: `${pct}%` }}
                        />
                        <div
                          className="collection-stats__faction-fill collection-stats__faction-fill--painted"
                          style={{ width: `${(f.finished / stats.totalModels) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
