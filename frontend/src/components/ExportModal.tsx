import { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { ArmyList, Enhancement, Detachment, WargearOption } from '../types/database';
import { supabase } from '../lib/supabase';
import { ROLE_ORDER, getUnitPoints, type ArmyListUnitWithDetails } from '../hooks/useListEditor';

export interface ParsedUnit {
  name: string;
  modelCount: number;
  enhancementName: string | null;
}

// ============================================================
// Parsers
// ============================================================

function parseImportText(text: string): ParsedUnit[] {
  // Try BattleScribe-style first, then fall back to native format
  const bsUnits = parseBattleScribeText(text);
  if (bsUnits.length > 0) return bsUnits;
  return parseNativeText(text);
}

/** Parse our native export format */
function parseNativeText(text: string): ParsedUnit[] {
  const units: ParsedUnit[] = [];
  const lines = text.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const unitMatch = line.match(/^\s{2}(.+?)(?:\s+\((\d+)\s+models?\))?\s+-\s+\d+\s+pts\s*$/);
    if (!unitMatch) continue;

    const name = unitMatch[1].trim();
    const modelCount = unitMatch[2] ? parseInt(unitMatch[2], 10) : 1;

    let enhancementName: string | null = null;
    if (i + 1 < lines.length) {
      const enhMatch = lines[i + 1].match(/^\s{4}Enhancement:\s+(.+?)\s+\(\+\d+\s+pts\)\s*$/);
      if (enhMatch) {
        enhancementName = enhMatch[1].trim();
        i++;
      }
    }

    units.push({ name, modelCount, enhancementName });
  }

  return units;
}

/**
 * Parse BattleScribe plain-text export format.
 * Typical format:
 *   Unit Name [X pts]: Enhancement Name
 *   . Model count x Model Name
 *   . Weapon Name
 *
 * We extract unit name, model count (from header brackets or model lines), and enhancement.
 */
function parseBattleScribeText(text: string): ParsedUnit[] {
  const units: ParsedUnit[] = [];
  const lines = text.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // BattleScribe unit header: "Unit Name [Xpts]" or "Unit Name [X pts]"
    // Can also have selections after colon
    const bsMatch = line.match(/^([A-Z][A-Za-z0-9' \-]+?)\s*\[(\d+)\s*pts?\]/);
    if (!bsMatch) continue;

    const name = bsMatch[1].trim();
    let modelCount = 1;
    let enhancementName: string | null = null;

    // Check for enhancement on same line (after colon): "Unit Name [pts]: Enhancement, ..."
    const colonPart = line.split(']:')[1];
    if (colonPart) {
      // Enhancement is usually the first selection that doesn't look like a weapon
      const selections = colonPart.split(',').map(s => s.trim()).filter(Boolean);
      for (const sel of selections) {
        // Skip weapon-like entries and model count entries
        if (!sel.match(/^\d+x /)) {
          enhancementName = sel;
          break;
        }
      }
    }

    // Look at following lines for model count (". 5x Intercessor" pattern)
    for (let j = i + 1; j < lines.length && j < i + 15; j++) {
      const modelLine = lines[j];
      if (!modelLine.match(/^\s*[.•]/)) break;

      const countMatch = modelLine.match(/(\d+)x\s/);
      if (countMatch) {
        modelCount = Math.max(modelCount, parseInt(countMatch[1], 10));
      }
    }

    units.push({ name, modelCount, enhancementName });
  }

  return units;
}

// ============================================================
// Export generators
// ============================================================

const ROLE_LABELS_PLURAL: Record<string, string> = {
  epic_hero: 'Epic Heroes', character: 'Characters', battleline: 'Battleline',
  infantry: 'Infantry', mounted: 'Mounted', beast: 'Beasts',
  vehicle: 'Vehicles', monster: 'Monsters', fortification: 'Fortifications',
  dedicated_transport: 'Dedicated Transports', allied: 'Allied Units',
};

const BATTLE_SIZE_LABELS: Record<string, string> = {
  combat_patrol: 'Combat Patrol', incursion: 'Incursion',
  strike_force: 'Strike Force', onslaught: 'Onslaught',
};

interface ExportData {
  list: ArmyList & { detachments: Detachment };
  listUnits: ArmyListUnitWithDetails[];
  enhancements: Enhancement[];
  listEnhancements: { id: string; enhancement_id: string; army_list_unit_id: string }[];
  totalPoints: number;
  wargearOptions: WargearOption[];
  unitWargearSelections: Map<string, Map<string, string>>;
}

function groupByRole(listUnits: ArmyListUnitWithDetails[]) {
  const grouped = new Map<string, ArmyListUnitWithDetails[]>();
  for (const lu of listUnits) {
    const role = lu.units.role;
    if (!grouped.has(role)) grouped.set(role, []);
    grouped.get(role)!.push(lu);
  }
  return grouped;
}

function generateStandardExport(data: ExportData): string {
  const { list, listUnits, enhancements, listEnhancements, totalPoints, wargearOptions, unitWargearSelections } = data;
  const lines: string[] = [];

  lines.push(`++ ${list.name} [${totalPoints}/${list.points_limit} pts] ++`);
  lines.push(`Detachment: ${list.detachments?.name ?? 'Unknown'}`);
  if (list.battle_size) lines.push(`Battle Size: ${BATTLE_SIZE_LABELS[list.battle_size] ?? list.battle_size}`);
  lines.push('');

  const grouped = groupByRole(listUnits);

  for (const role of ROLE_ORDER) {
    const units = grouped.get(role);
    if (!units || units.length === 0) continue;

    lines.push(`= ${ROLE_LABELS_PLURAL[role] ?? role} =`);
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

      // Wargear selections
      const wargear = unitWargearSelections.get(lu.id);
      if (wargear && wargear.size > 0) {
        for (const [, optionId] of wargear) {
          const opt = wargearOptions.find(w => w.id === optionId);
          if (opt && !opt.is_default) {
            lines.push(`    Wargear: ${opt.name}${opt.points > 0 ? ` (+${opt.points} pts)` : ''}`);
          }
        }
      }
    }
    lines.push('');
  }

  lines.push(`Total: ${totalPoints} / ${list.points_limit} pts`);
  return lines.join('\n');
}

function generateTournamentExport(data: ExportData): string {
  const { list, listUnits, enhancements, listEnhancements, totalPoints } = data;
  const lines: string[] = [];

  // GW/ITC-style compact tournament format
  lines.push(`${list.name}`);
  lines.push(`${list.detachments?.name ?? 'Unknown Detachment'}`);
  lines.push(`${totalPoints}/${list.points_limit} pts`);
  lines.push('---');

  const grouped = groupByRole(listUnits);

  for (const role of ROLE_ORDER) {
    const units = grouped.get(role);
    if (!units || units.length === 0) continue;

    for (const lu of units) {
      const pts = getUnitPoints(lu.units, lu.model_count);
      const enhAssignment = listEnhancements.find(le => le.army_list_unit_id === lu.id);
      const enh = enhAssignment ? enhancements.find(e => e.id === enhAssignment.enhancement_id) : null;
      const totalPts = pts + (enh?.points ?? 0);

      let line = lu.units.name;
      if (lu.model_count > 1) line += ` (${lu.model_count})`;
      if (enh) line += ` w/ ${enh.name}`;
      line += ` [${totalPts}]`;
      lines.push(line);
    }
  }

  lines.push('---');
  lines.push(`Total: ${totalPoints} pts`);
  return lines.join('\n');
}

// ============================================================
// Component
// ============================================================

interface ExportModalProps extends ExportData {
  onClose: () => void;
  onImport?: (parsed: ParsedUnit[]) => Promise<{ success: boolean; matched: number; unmatched: string[] }>;
}

function generateShareCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let code = '';
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export function ExportModal(props: ExportModalProps) {
  const { list, onClose, onImport } = props;
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<'export' | 'import' | 'share'>('export');
  const [exportFormat, setExportFormat] = useState<'standard' | 'tournament'>('standard');
  const [importText, setImportText] = useState('');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ success: boolean; matched: number; unmatched: string[] } | null>(null);
  const [shareCode, setShareCode] = useState<string | null>(list.share_code ?? null);
  const [shareCopied, setShareCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  const exportText = exportFormat === 'tournament'
    ? generateTournamentExport(props)
    : generateStandardExport(props);

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

  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    dialogRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const shareUrl = shareCode ? `${window.location.origin}/shared/${shareCode}` : null;

  const tabLabels: Record<string, string> = { export: 'Export', share: 'Share', import: 'Import' };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        ref={dialogRef}
        className="modal-panel modal-panel--md export-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="export-modal-title" className="sr-only">{tabLabels[tab]}</h3>
        <div className="export-modal__tabs">
          <button className={`export-modal__tab${tab === 'export' ? ' export-modal__tab--active' : ''}`} onClick={() => setTab('export')}>Export</button>
          <button className={`export-modal__tab${tab === 'share' ? ' export-modal__tab--active' : ''}`} onClick={() => setTab('share')}>Share</button>
          <button className={`export-modal__tab${tab === 'import' ? ' export-modal__tab--active' : ''}`} onClick={() => setTab('import')}>Import</button>
        </div>

        {tab === 'export' && (
          <>
            <div className="export-modal__format-toggle">
              <button
                className={`export-modal__format-btn${exportFormat === 'standard' ? ' export-modal__format-btn--active' : ''}`}
                onClick={() => setExportFormat('standard')}
              >
                Standard
              </button>
              <button
                className={`export-modal__format-btn${exportFormat === 'tournament' ? ' export-modal__format-btn--active' : ''}`}
                onClick={() => setExportFormat('tournament')}
              >
                Tournament
              </button>
            </div>
            <textarea
              readOnly
              value={exportText}
              className="export-modal__textarea"
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
            <div className="export-modal__share-body">
              {shareCode && shareUrl ? (
                <>
                  <div className="export-modal__qr">
                    <QRCodeSVG
                      value={shareUrl}
                      size={180}
                      bgColor="transparent"
                      fgColor="#c9a84c"
                      level="M"
                    />
                  </div>
                  <p className="export-modal__help-text">
                    Scan the QR code or share the link below:
                  </p>
                  <div className="export-modal__share-url">
                    {shareUrl}
                  </div>
                  <button className="btn btn--primary" onClick={handleCopyShareLink}>
                    {shareCopied ? 'Link Copied!' : 'Copy Share Link'}
                  </button>
                </>
              ) : (
                <>
                  <p className="export-modal__help-text">
                    Generate a shareable link and QR code for this list. Anyone with the link can view it (read-only).
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
            <p className="export-modal__help-text export-modal__help-text--spaced">
              Paste an exported list below. Supports our native format and BattleScribe plain-text output. Units are matched by name against the current faction.
            </p>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste exported list text here..."
              className="export-modal__textarea"
            />
            {importResult && (
              <div
                className={`validation-banner validation-banner--spaced ${importResult.success ? 'validation-banner--warning' : 'validation-banner--error'}`}
              >
                {importResult.success ? (
                  <>
                    <div>Imported {importResult.matched} unit{importResult.matched !== 1 ? 's' : ''} successfully.</div>
                    {importResult.unmatched.length > 0 && (
                      <div className="validation-banner__detail">
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
