import { useState } from 'react';
import type { ArmyList, Unit, UnitPointsTier, ArmyListUnit, Enhancement, Detachment, Ability } from '../types/database';

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

export function ExportModal({ list, listUnits, enhancements, listEnhancements, totalPoints, getUnitPoints, onClose, onImport }: ExportModalProps) {
  const [copied, setCopied] = useState(false);
  const [importMode, setImportMode] = useState(false);
  const [importText, setImportText] = useState('');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ success: boolean; matched: number; unmatched: string[] } | null>(null);

  const exportText = generateExportText(list, listUnits, enhancements, listEnhancements, totalPoints, getUnitPoints);

  function handleCopy() {
    navigator.clipboard.writeText(exportText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
          <h2 className="modal-panel__title" style={{ marginBottom: 0 }}>
            {importMode ? 'Import List' : 'Export List'}
          </h2>
          <button
            className="btn"
            onClick={() => setImportMode(!importMode)}
          >
            {importMode ? 'Back to Export' : 'Switch to Import'}
          </button>
        </div>

        {!importMode ? (
          <>
            <textarea
              readOnly
              value={exportText}
              style={textareaStyles}
            />
            <div className="modal-panel__actions">
              <button className="btn" onClick={onClose}>Close</button>
              <button className="btn btn--primary" onClick={handleCopy}>
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
          </>
        ) : (
          <>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-md)' }}>
              Paste an exported list below. Note: importing will match units by name against the current faction's available units.
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
