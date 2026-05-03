import { useEffect, useState } from 'react';
import { supabase } from '../../../shared/lib/supabase';
import type { FactionWinRate, DetachmentPlayRate } from '../../../shared/types/database';
import '../social.css';

type MetaTab = 'factions' | 'detachments';
type DayRange = 30 | 60 | 90;

export function MetaPage() {
  const [tab, setTab] = useState<MetaTab>('factions');
  const [days, setDays] = useState<DayRange>(30);
  const [factionRates, setFactionRates] = useState<FactionWinRate[]>([]);
  const [detachmentRates, setDetachmentRates] = useState<DetachmentPlayRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const factionReq = supabase.rpc('faction_win_rates', { p_days: days });
    const detachmentReq = supabase.rpc('detachment_play_rates', { p_days: days });

    Promise.all([factionReq, detachmentReq]).then(([fr, dr]) => {
      if (fr.error) {
        setError(fr.error.message);
      } else {
        setFactionRates((fr.data as FactionWinRate[]) ?? []);
      }
      if (dr.error && !error) {
        setError(dr.error.message);
      } else {
        setDetachmentRates((dr.data as DetachmentPlayRate[]) ?? []);
      }
      setLoading(false);
    });
  }, [days]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="meta-page">
      <div className="meta-page__header">
        <h1 className="meta-page__title">Meta Snapshot</h1>
        <div className="meta-page__range-selector">
          {([30, 60, 90] as DayRange[]).map((d) => (
            <button
              key={d}
              className={`meta-page__range-btn${days === d ? ' meta-page__range-btn--active' : ''}`}
              onClick={() => setDays(d)}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      <p className="meta-page__subtitle">
        Based on completed tournament games in the last {days} days. Minimum 3 games required per entry.
      </p>

      <div className="meta-page__tabs">
        <button
          className={`meta-page__tab${tab === 'factions' ? ' meta-page__tab--active' : ''}`}
          onClick={() => setTab('factions')}
        >
          Faction Win Rates
        </button>
        <button
          className={`meta-page__tab${tab === 'detachments' ? ' meta-page__tab--active' : ''}`}
          onClick={() => setTab('detachments')}
        >
          Detachment Play Rates
        </button>
      </div>

      {error && <div className="meta-page__error">{error}</div>}

      {loading ? (
        <div className="meta-page__skeleton">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton" style={{ height: '48px', marginBottom: '8px' }} />
          ))}
        </div>
      ) : tab === 'factions' ? (
        <FactionWinRates data={factionRates} />
      ) : (
        <DetachmentPlayRates data={detachmentRates} />
      )}
    </div>
  );
}

function FactionWinRates({ data }: { data: FactionWinRate[] }) {
  if (data.length === 0) {
    return (
      <div className="meta-page__empty">
        Not enough tournament data yet. Results appear once at least 3 games have been played per faction.
      </div>
    );
  }

  const maxRate = Math.max(...data.map((d) => d.win_rate));

  return (
    <div className="meta-page__table">
      <div className="meta-page__table-header">
        <span>Faction</span>
        <span>Win Rate</span>
        <span>Games</span>
      </div>
      {data.map((row, i) => (
        <div key={row.faction_id} className="meta-page__table-row">
          <span className="meta-page__rank">#{i + 1}</span>
          <span className="meta-page__faction-name">{row.faction_name}</span>
          <div className="meta-page__bar-cell">
            <div
              className="meta-page__bar"
              style={{ width: `${(row.win_rate / maxRate) * 100}%` }}
            />
            <span className="meta-page__bar-label">{Math.round(row.win_rate * 100)}%</span>
          </div>
          <span className="meta-page__games">{row.total_games}g</span>
        </div>
      ))}
    </div>
  );
}

function DetachmentPlayRates({ data }: { data: DetachmentPlayRate[] }) {
  if (data.length === 0) {
    return (
      <div className="meta-page__empty">
        Not enough tournament data yet. Results appear once at least 3 games have been played per detachment.
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.play_count));

  return (
    <div className="meta-page__table">
      <div className="meta-page__table-header">
        <span>Detachment</span>
        <span>Plays</span>
        <span>Faction</span>
      </div>
      {data.map((row, i) => (
        <div key={row.detachment_id} className="meta-page__table-row">
          <span className="meta-page__rank">#{i + 1}</span>
          <span className="meta-page__faction-name">{row.detachment_name}</span>
          <div className="meta-page__bar-cell">
            <div
              className="meta-page__bar meta-page__bar--blue"
              style={{ width: `${(row.play_count / maxCount) * 100}%` }}
            />
            <span className="meta-page__bar-label">{row.play_count}</span>
          </div>
          <span className="meta-page__games">{row.faction_name}</span>
        </div>
      ))}
    </div>
  );
}
