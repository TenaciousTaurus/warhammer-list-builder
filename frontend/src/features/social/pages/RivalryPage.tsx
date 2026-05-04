import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../../shared/lib/supabase';
import type { UserProfile, HeadToHeadStats } from '../../../shared/types/database';
import '../social.css';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export function RivalryPage() {
  const { user1Id, user2Id } = useParams<{ user1Id: string; user2Id: string }>();

  const [profile1, setProfile1] = useState<UserProfile | null>(null);
  const [profile2, setProfile2] = useState<UserProfile | null>(null);
  const [h2h, setH2h] = useState<HeadToHeadStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user1Id || !user2Id) return;
    (async () => {
      const [p1Res, p2Res, h2hRes] = await Promise.all([
        supabase.from('user_profiles').select('*').eq('id', user1Id).single(),
        supabase.from('user_profiles').select('*').eq('id', user2Id).single(),
        supabase.rpc('get_head_to_head', { user1_id: user1Id, user2_id: user2Id }),
      ]);

      if (p1Res.error || p2Res.error) {
        setError('Could not load player profiles.');
        setLoading(false);
        return;
      }

      setProfile1(p1Res.data as UserProfile);
      setProfile2(p2Res.data as UserProfile);

      if (!h2hRes.error && h2hRes.data) {
        setH2h(h2hRes.data as HeadToHeadStats);
      }
      setLoading(false);
    })();
  }, [user1Id, user2Id]);

  if (loading) {
    return (
      <div className="rivalry-page" style={{ padding: 'var(--space-lg)' }}>
        <div className="skeleton skeleton--header" />
        <div className="skeleton skeleton--bar" style={{ marginTop: 'var(--space-md)' }} />
      </div>
    );
  }

  if (error || !profile1 || !profile2) {
    return (
      <div className="rivalry-page">
        <div className="empty-state card">
          <div className="empty-state__title">Rivalry Not Found</div>
          <p>{error ?? 'One or both players could not be found.'}</p>
          <Link to="/stats" className="btn btn--primary" style={{ marginTop: 'var(--space-md)' }}>
            Back to Stats
          </Link>
        </div>
      </div>
    );
  }

  const total = h2h?.total_games ?? 0;
  const p1wins = h2h?.user1_wins ?? 0;
  const p2wins = h2h?.user2_wins ?? 0;
  const draws = h2h?.draws ?? 0;

  const p1pct = total > 0 ? Math.round((p1wins / total) * 100) : 0;
  const p2pct = total > 0 ? Math.round((p2wins / total) * 100) : 0;

  // Bar widths for the split bar
  const p1bar = total > 0 ? Math.round(((p1wins + draws * 0.5) / total) * 100) : 50;

  const initials = (name: string) => name.charAt(0).toUpperCase();

  return (
    <div className="rivalry-page">
      {/* Header */}
      <div className="rivalry-page__header">
        <div className="rivalry-page__player rivalry-page__player--1">
          <div className="rivalry-page__avatar">{initials(profile1.display_name)}</div>
          <div className="rivalry-page__name">{profile1.display_name}</div>
          {profile1.preferred_factions.length > 0 && (
            <div className="rivalry-page__faction">{profile1.preferred_factions[0]}</div>
          )}
          <Link to={`/profile/${user1Id}`} className="rivalry-page__profile-link">View Profile</Link>
        </div>

        <div className="rivalry-page__vs-block">
          <div className="rivalry-page__vs-label">⚔</div>
          <div className="rivalry-page__total-label">{total} game{total !== 1 ? 's' : ''} played</div>
        </div>

        <div className="rivalry-page__player rivalry-page__player--2">
          <div className="rivalry-page__avatar">{initials(profile2.display_name)}</div>
          <div className="rivalry-page__name">{profile2.display_name}</div>
          {profile2.preferred_factions.length > 0 && (
            <div className="rivalry-page__faction">{profile2.preferred_factions[0]}</div>
          )}
          <Link to={`/profile/${user2Id}`} className="rivalry-page__profile-link">View Profile</Link>
        </div>
      </div>

      {total === 0 ? (
        <div className="empty-state card" style={{ marginTop: 'var(--space-lg)' }}>
          <div className="empty-state__icon">⚔</div>
          <div className="empty-state__title">No Games Yet</div>
          <p className="empty-state__description">
            These two players haven't faced each other in WarForge yet.
          </p>
        </div>
      ) : (
        <>
          {/* Record split */}
          <div className="rivalry-page__record card">
            <div className="rivalry-page__record-row">
              <div className="rivalry-page__record-stat rivalry-page__record-stat--left">
                <span className="rivalry-page__record-wins">{p1wins}</span>
                <span className="rivalry-page__record-label">wins ({p1pct}%)</span>
              </div>
              <div className="rivalry-page__record-center">
                <span className="rivalry-page__record-draws">{draws}</span>
                <span className="rivalry-page__record-label">draws</span>
              </div>
              <div className="rivalry-page__record-stat rivalry-page__record-stat--right">
                <span className="rivalry-page__record-wins">{p2wins}</span>
                <span className="rivalry-page__record-label">wins ({p2pct}%)</span>
              </div>
            </div>

            {/* Split bar */}
            <div className="rivalry-page__split-bar">
              <div
                className="rivalry-page__split-bar-p1"
                style={{ width: `${p1bar}%` }}
              />
              <div
                className="rivalry-page__split-bar-p2"
                style={{ width: `${100 - p1bar}%` }}
              />
            </div>
            <div className="rivalry-page__split-labels">
              <span>{profile1.display_name}</span>
              <span>{profile2.display_name}</span>
            </div>
          </div>

          {/* Recent battles */}
          {h2h?.recent_battles && h2h.recent_battles.length > 0 && (
            <div className="rivalry-page__section">
              <h3 className="rivalry-page__section-title">Recent Battles</h3>
              <div className="rivalry-page__battles">
                {h2h.recent_battles.map((battle, i) => {
                  const winner = battle.winner === 'draw'
                    ? 'Draw'
                    : battle.winner === 'user1'
                      ? profile1.display_name
                      : profile2.display_name;
                  const winnerClass = battle.winner === 'draw'
                    ? 'draw'
                    : battle.winner === 'user1' ? 'p1' : 'p2';
                  return (
                    <div key={i} className="rivalry-page__battle-row">
                      <div className="rivalry-page__battle-score">
                        <span className={`rivalry-page__battle-vp rivalry-page__battle-vp--${battle.winner === 'user1' ? 'win' : ''}`}>
                          {battle.player1_vp}
                        </span>
                        <span className="rivalry-page__battle-sep">–</span>
                        <span className={`rivalry-page__battle-vp rivalry-page__battle-vp--${battle.winner === 'user2' ? 'win' : ''}`}>
                          {battle.player2_vp}
                        </span>
                      </div>
                      <div className={`rivalry-page__battle-result rivalry-page__battle-result--${winnerClass}`}>
                        {winner} won
                      </div>
                      <div className="rivalry-page__battle-date">{formatDate(battle.played_at)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
