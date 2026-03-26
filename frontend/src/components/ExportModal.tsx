import { useState } from 'react';
import type { ArmyList, Unit, UnitPointsTier, ArmyListUnit, Enhancement, Detachment, Ability } from '../types/database';
import { supabase } from '../lib/supabase';

type UnitWithRelations = Unit & { unit_points_tiers: UnitPointsTier[]; abilities: Ability[] };

type ArmyListUnitWithDetails = ArmyListUnit & {
  units: UnitWithRelations;
};

export interface ParsedUnit {
  name: string;
  modelCount: number;
  enhancementName: string | null;
}

function parseImportText(text: string): ParsedUnit[] {
  const units: ParsedUnit[] = [];
  const lines = text.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Match unit lines:  "  Unit Name - 100 pts" or "  Unit Name (5 models) - 100 pts"
    const unitMatch = line.match(/^\s{2}(.+?)(?:\s+\((\d+)\s+models?\))?\s+-\s+\d+\s+pts\s*$/);
    if (!unitMatch) continue;

    const name = unitMatch[1].trim();
    const modelCount = unitMatch[2] ? parseInt(unitMatch[2], 10) : 1;

    // Check if next line has an enhancement
    let enhancementName: string | null = null;
    if (i + 1 < lines.length) {
      const enhMatch = lines[i + 1].match(/^\s{4}Enhancement:\s+(.+?)\s+\(\+\d+\s+pts\)\s*$/);
      if (enhMatch) {
        enhancementName = enhMatch[1].trim();
        i++; // skip the enhancement line
      }
    }

    units.push({ name, modelCount, enhancementName });
  }

  return units;
}

interface ExportModalProps {
  list: ArmyList & { detachments: Detachment };
  listUnits: ArmyListUnitWithDetails[];
  enhancements: Enhancement[];
  listEnhancements: { id: string; enhancement_id: string; army_list_unit_id: string }[];
  totalPoints: number;
  getUnitPoints: (unit: Unit & { unit_points_tiers: UnitPointsTier[] }, modelCount: number) => number;
  onClose: () => void;
  onImport?: (parsed: ParsedUnit[]) => Promise<{ success: boolean; matched: number; unmatched: string[] }>;
}

function generateExportText(
  list: ArmyList & { detachments: Detachment },
  listUnits: ArmyListUnitWithDetails[],
  enhancements: Enhancement[],
  listEnhancements: { id: string; enhancement_id: string; army_list_unit_id: string }[],
  totalPoints: number,
  getUnitPoints: (unit: Unit & { unit_points_tiers: UnitPointsTier[] }, modelCount: number) => number,
): string {
  const lines: string[] = [];

  lines.push(`++ ${list.name} [${totalPoints}/${list.points_limit} pts] ++`);
  lines.push(`Detachment: ${list.detachments?.name ?? 'Unknown'}`);
  lines.push('');

  const roleOrder = ['epic_hero', 'character', 'battleline', 'infantry', 'mounted', 'beast', 'vehicle', 'monster', 'fortification', 'dedicated_transport', 'allied'];
  const roleLabels: Record<string, string> = {
    epic_hero: 'Epic Heroes',
    character: 'Characters',
    battleline: 'Battleline',
    infantry: 'Infantry',
    mounted: 'Mounted',
    beast: 'Beasts',
    vehicle: 'Vehicles',
    monster: 'Monsters',
    fortification: 'Fortifications',
    dedicated_transport: 'Dedicated Transports',
    allied: 'Allied Units',
  };

  const grouped = new Map<string, ArmyListUnitWithDetails[]>();
  for (const lu of listUnits) {
    const role = lu.units.role;
    if (!grouped.has(role)) grouped.set(role, []);
    grouped.get(role)!.push(lu);
  }

  for (const role of roleOrder) {
    const units = grouped.get(role);
    if (!units || units.length === 0) continue;

    lines.push(`= ${roleLabels[role] ?? role} =`);
    for (const lu of units) {
      const pts = getUnitPoints(lu.units, lu.model_count);
      const enhAssignment = listEnhancements.find(le => le.army_list_unit_id === lu.id);
      const enh = enhAssignment ? enhancements.find(e => e.id === enhAssignment.enhancement_id) : null;

      let line = `  ${lu.units.name}`;
      if (lu.model_count > 1) line += ` (${lu.model_count} models)`;
      line += ` - ${pts} pts`;
      lines.push(line);

      if (enh) {
        lines.push(`    Enhancement: ${enh.name} (+${enh.points} pts)`);
      }
    }
    lines.push('');
  }

  lines.push(`Total: ${totalPoints} / ${list.points_limit} pts`);
  return lines.join('\n');
}

function generateShareCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let code = '';
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export function ExportModal({ list, listUnits, enhancements, listEnhancements, totalPoints, getUnitPoints, onClose, onImport }: ExportModalProps) {
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<'export' | 'import' | 'share'>('export');
  const [importText, setImportText] = useState('');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ success: boolean; matched: number; unmatched: string[] } | null>(null);
  const [shareCode, setShareCode] = useState<string | null>(list.share_code ?? null);
  const [shareCopied, setShareCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  const exportText = generateExportText(list, listUnits, enhancements, listEnhancements, totalPoints, getUnitPoints);

  function handleCopy() {
    navigator.clipboard.writeText(exportText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  async function handleGenerateShareLink() {
    if (shareCode) return;
    setSharing(true);
    const code = generateShareCode();
    const { error } = await supabase
      .from('army_lists')
      .update({ share_code: code })
      .eq('id', list.id);
    if (!error) {
      setShareCode(code);
    }
    setSharing(false);
  }

  function handleCopyShareLink() {
    if (!shareCode) return;
    const url = `${window.location.origin}/shared/${shareCode}`;
    navigator.clipboard.writeText(url).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    });
  }

  function handlePrint() {
    window.print();
  }

  const textareaStyles = {
    width: '100%',
    minHeight: '300px',
    padding: 'var(--space-md)',
    backgroundColor: 'rgba(10, 10, 15, 0.6)',
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--color-text-primary)',
    fontFamily: 'monospace',
    fontSize: 'var(--text-sm)',
    resize: 'vertical' as const,
    flex: 1,
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-panel modal-panel--md"
        style={{ maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="export-modal__tabs">
          <button className={`export-modal__tab${tab === 'export' ? ' export-modal__tab--active' : ''}`} onClick={() => setTab('export')}>Export</button>
          <button className={`export-modal__tab${tab === 'share' ? ' export-modal__tab--active' : ''}`} onClick={() => setTab('share')}>Share</button>
          <button className={`export-modal__tab${tab === 'import' ? ' export-modal__tab--active' : ''}`} onClick={() => setTab('import')}>Import</button>
        </div>

        {tab === 'export' && (
          <>
            <textarea
              readOnly
              value={exportText}
              style={textareaStyles}
            />
            <div className="modal-panel__actions">
              <button className="btn" onClick={handlePrint}>Print / PDF</button>
              <button className="btn" onClick={onClose}>Close</button>
              <button className="btn btn--primary" onClick={handleCopy}>
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
          </>
        )}

        {tab === 'share' && (
          <>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 'var(--space-lg)', padding: 'var(--space-xl)' }}>
              {shareCode ? (
                <>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
                    Share this link with anyone to view your list:
                  </p>
                  <div style={{
                    padding: 'var(--space-md)',
                    background: 'rgba(10, 10, 15, 0.6)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-md)',
                    fontFamily: 'monospace',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-gold)',
                    wordBreak: 'break-all',
                    textAlign: 'center',
                  }}>
                    {window.location.origin}/shared/{shareCode}
                  </div>
                  <button className="btn btn--primary" onClick={handleCopyShareLink}>
                    {shareCopied ? 'Link Copied!' : 'Copy Share Link'}
                  </button>
                </>
              ) : (
                <>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
                    Generate a shareable link for this list. Anyone with the link can view it (read-only).
                  </p>
                  <button className="btn btn--primary" onClick={handleGenerateShareLink} disabled={sharing}>
                    {sharing ? 'Generating...' : 'Generate Share Link'}
                  </button>
                </>
              )}
            </div>
            <div className="modal-panel__actions">
              <button className="btn" onClick={onClose}>Close</button>
            </div>
          </>
        )}

        {tab === 'import' && (
          <>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-md)' }}>
              Paste an exported list below. Units are matched by name against the current faction.
            </p>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste exported list text here..."
              style={textareaStyles}
            />
            {importResult && (
              <div
                className={`validation-banner ${importResult.success ? 'validation-banner--warning' : 'validation-banner--error'}`}
                style={{ marginTop: 'var(--space-sm)' }}
              >
                {importResult.success ? (
                  <>
                    <div>Imported {importResult.matched} unit{importResult.matched !== 1 ? 's' : ''} successfully.</div>
                    {importResult.unmatched.length > 0 && (
                      <div style={{ marginTop: 'var(--space-xs)', fontSize: 'var(--text-xs)' }}>
                        Could not match: {importResult.unmatched.join(', ')}
                      </div>
                    )}
                  </>
                ) : (
                  <div>Import failed. Check the text format and try again.</div>
                )}
              </div>
            )}

            <div className="modal-panel__actions">
              <button className="btn" onClick={onClose}>Close</button>
              <button
                className="btn btn--primary"
                disabled={!importText.trim() || importing || !onImport}
                onClick={async () => {
                  if (!onImport) return;
                  setImporting(true);
                  setImportResult(null);
                  try {
                    const parsed = parseImportText(importText);
                    const result = await onImport(parsed);
                    setImportResult(result);
                    if (result.success) {
                      setTimeout(onClose, 1500);
                    }
                  } catch {
                    setImportResult({ success: false, matched: 0, unmatched: [] });
                  } finally {
                    setImporting(false);
                  }
                }}
              >
                {importing ? 'Importing...' : 'Import List'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
