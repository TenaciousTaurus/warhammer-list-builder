import { useState, useEffect } from 'react';

interface BattleReportData {
  id: string;
  date: string;
  listName: string;
  opponent: string;
  opponentFaction: string;
  result: 'win' | 'loss' | 'draw';
  myVP: number;
  opponentVP: number;
  notes: string;
  mission: string;
}

interface BattleReportProps {
  listId: string;
  listName: string;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function BattleReport({ listId, listName }: BattleReportProps) {
  const storageKey = `battle-reports-${listId}`;

  function getStored(): BattleReportData[] {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  const [reports, setReports] = useState<BattleReportData[]>(getStored);
  const [showForm, setShowForm] = useState(false);
  const [expandedReport, setExpandedReport] = useState<string | null>(null);

  // Form state
  const [opponent, setOpponent] = useState('');
  const [opponentFaction, setOpponentFaction] = useState('');
  const [result, setResult] = useState<'win' | 'loss' | 'draw'>('win');
  const [myVP, setMyVP] = useState(0);
  const [opponentVP, setOpponentVP] = useState(0);
  const [mission, setMission] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(reports));
  }, [reports, storageKey]);

  function handleSave() {
    const report: BattleReportData = {
      id: generateId(),
      date: new Date().toISOString(),
      listName,
      opponent: opponent || 'Unknown',
      opponentFaction: opponentFaction || 'Unknown',
      result,
      myVP,
      opponentVP,
      mission,
      notes,
    };
    setReports([report, ...reports]);
    resetForm();
  }

  function resetForm() {
    setShowForm(false);
    setOpponent('');
    setOpponentFaction('');
    setResult('win');
    setMyVP(0);
    setOpponentVP(0);
    setMission('');
    setNotes('');
  }

  function deleteReport(id: string) {
    setReports(reports.filter(r => r.id !== id));
  }

  // Stats
  const wins = reports.filter(r => r.result === 'win').length;
  const losses = reports.filter(r => r.result === 'loss').length;
  const draws = reports.filter(r => r.result === 'draw').length;
  const winRate = reports.length > 0 ? Math.round((wins / reports.length) * 100) : 0;

  return (
    <div className="battle-report">
      {/* Stats Summary */}
      {reports.length > 0 && (
        <div className="battle-report__stats">
          <div className="battle-report__stat">
            <span className="battle-report__stat-value battle-report__stat-value--win">{wins}</span>
            <span className="battle-report__stat-label">Wins</span>
          </div>
          <div className="battle-report__stat">
            <span className="battle-report__stat-value battle-report__stat-value--loss">{losses}</span>
            <span className="battle-report__stat-label">Losses</span>
          </div>
          <div className="battle-report__stat">
            <span className="battle-report__stat-value battle-report__stat-value--draw">{draws}</span>
            <span className="battle-report__stat-label">Draws</span>
          </div>
          <div className="battle-report__stat">
            <span className="battle-report__stat-value">{winRate}%</span>
            <span className="battle-report__stat-label">Win Rate</span>
          </div>
        </div>
      )}

      {/* Add Report Button / Form */}
      {showForm ? (
        <div className="battle-report__form">
          <h4 className="battle-report__form-title">Log Game Result</h4>
          <div className="battle-report__form-grid">
            <div className="form-group">
              <label>Opponent</label>
              <input className="form-input" type="text" placeholder="Player name" value={opponent} onChange={e => setOpponent(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Opponent Faction</label>
              <input className="form-input" type="text" placeholder="e.g. Space Marines" value={opponentFaction} onChange={e => setOpponentFaction(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Result</label>
              <select className="form-select" value={result} onChange={e => setResult(e.target.value as 'win' | 'loss' | 'draw')}>
                <option value="win">Win</option>
                <option value="loss">Loss</option>
                <option value="draw">Draw</option>
              </select>
            </div>
            <div className="form-group">
              <label>Mission</label>
              <input className="form-input" type="text" placeholder="Mission name" value={mission} onChange={e => setMission(e.target.value)} />
            </div>
            <div className="form-group">
              <label>My VP</label>
              <input className="form-input" type="number" min="0" max="100" value={myVP} onChange={e => setMyVP(Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label>Opponent VP</label>
              <input className="form-input" type="number" min="0" max="100" value={opponentVP} onChange={e => setOpponentVP(Number(e.target.value))} />
            </div>
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea
              className="form-input"
              placeholder="Key moments, lessons learned..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>
          <div className="battle-report__form-actions">
            <button className="btn" onClick={resetForm}>Cancel</button>
            <button className="btn btn--primary" onClick={handleSave}>Save Report</button>
          </div>
        </div>
      ) : (
        <button className="secondary-objectives__add-btn" onClick={() => setShowForm(true)}>
          + Log Game Result
        </button>
      )}

      {/* Report History */}
      {reports.map(report => {
        const isExpanded = expandedReport === report.id;
        const dateStr = new Date(report.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        return (
          <div
            key={report.id}
            className={`battle-report__card battle-report__card--${report.result}`}
            onClick={() => setExpandedReport(isExpanded ? null : report.id)}
          >
            <div className="battle-report__card-header">
              <div className="battle-report__card-left">
                <span className={`battle-report__result-badge battle-report__result-badge--${report.result}`}>
                  {report.result.toUpperCase()}
                </span>
                <span className="battle-report__card-opponent">
                  vs {report.opponent}
                  {report.opponentFaction && <span className="battle-report__card-faction"> ({report.opponentFaction})</span>}
                </span>
              </div>
              <div className="battle-report__card-right">
                <span className="battle-report__card-score">{report.myVP} - {report.opponentVP}</span>
                <span className="battle-report__card-date">{dateStr}</span>
              </div>
            </div>
            {isExpanded && (
              <div className="battle-report__card-body" onClick={e => e.stopPropagation()}>
                {report.mission && <div><strong>Mission:</strong> {report.mission}</div>}
                {report.notes && <div><strong>Notes:</strong> {report.notes}</div>}
                <button className="btn btn--danger" style={{ marginTop: 'var(--space-sm)', fontSize: 'var(--text-xs)' }} onClick={() => deleteReport(report.id)}>
                  Delete Report
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
