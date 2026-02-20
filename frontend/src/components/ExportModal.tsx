import { useState } from 'react';
import type { ArmyList, Unit, UnitPointsTier, ArmyListUnit, Enhancement, Detachment, Ability } from '../types/database';

type UnitWithRelations = Unit & { unit_points_tiers: UnitPointsTier[]; abilities: Ability[] };

type ArmyListUnitWithDetails = ArmyListUnit & {
  units: UnitWithRelations;
};

interface ExportModalProps {
  list: ArmyList & { detachments: Detachment };
  listUnits: ArmyListUnitWithDetails[];
  enhancements: Enhancement[];
  listEnhancements: { id: string; enhancement_id: string; army_list_unit_id: string }[];
  totalPoints: number;
  getUnitPoints: (unit: Unit & { unit_points_tiers: UnitPointsTier[] }, modelCount: number) => number;
  onClose: () => void;
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

  // Group by role
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

export function ExportModal({ list, listUnits, enhancements, listEnhancements, totalPoints, getUnitPoints, onClose }: ExportModalProps) {
  const [copied, setCopied] = useState(false);
  const [importMode, setImportMode] = useState(false);
  const [importText, setImportText] = useState('');

  const exportText = generateExportText(list, listUnits, enhancements, listEnhancements, totalPoints, getUnitPoints);

  function handleCopy() {
    navigator.clipboard.writeText(exportText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{ width: '100%', maxWidth: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
          <h2 style={{ fontSize: '1.1rem', color: 'var(--color-gold)' }}>
            {importMode ? 'Import List' : 'Export List'}
          </h2>
          <button
            className="btn"
            onClick={() => setImportMode(!importMode)}
            style={{ fontSize: '0.8rem' }}
          >
            {importMode ? 'Back to Export' : 'Switch to Import'}
          </button>
        </div>

        {!importMode ? (
          <>
            <textarea
              readOnly
              value={exportText}
              style={{
                width: '100%',
                minHeight: '300px',
                padding: 'var(--space-md)',
                backgroundColor: 'var(--color-bg-tertiary)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-text-primary)',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                resize: 'vertical',
                flex: 1,
              }}
            />
            <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'flex-end', marginTop: 'var(--space-md)' }}>
              <button className="btn" onClick={onClose}>Close</button>
              <button className="btn btn--primary" onClick={handleCopy}>
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
          </>
        ) : (
          <>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-md)' }}>
              Paste an exported list below. Note: importing will match units by name against the current faction's available units.
            </p>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste exported list text here..."
              style={{
                width: '100%',
                minHeight: '300px',
                padding: 'var(--space-md)',
                backgroundColor: 'var(--color-bg-tertiary)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-text-primary)',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                resize: 'vertical',
                flex: 1,
              }}
            />
            <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'flex-end', marginTop: 'var(--space-md)' }}>
              <button className="btn" onClick={onClose}>Close</button>
              <button
                className="btn btn--primary"
                disabled={!importText.trim()}
                onClick={() => {
                  // Import is informational for now - users can use the text format for reference
                  alert('Import parsing is not yet implemented. Use the export text to share lists manually.');
                }}
              >
                Import (Coming Soon)
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
