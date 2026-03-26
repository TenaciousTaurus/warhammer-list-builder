import { useState } from 'react';

interface Stratagem {
  name: string;
  phase: string;
  cp: number;
  when: string;
  effect: string;
  restrictions?: string;
}

// 10th Edition Core Stratagems
const CORE_STRATAGEMS: Stratagem[] = [
  {
    name: 'Command Re-roll',
    phase: 'Any',
    cp: 1,
    when: 'Any phase, just after you have made a Hit roll, a Wound roll, a Damage roll, a saving throw, an Advance roll, a Charge roll, a Desperate Escape test, a Hazardous test, or just after you have rolled the dice to determine the number of attacks made with a weapon.',
    effect: 'You re-roll that roll, test or saving throw.',
  },
  {
    name: 'Counter-offensive',
    phase: 'Fight',
    cp: 2,
    when: 'Fight phase, just after an enemy unit has fought.',
    effect: 'Select one of your units that is within Engagement Range of one or more enemy units and that has not already been selected to fight this phase. That unit fights next.',
  },
  {
    name: 'Epic Challenge',
    phase: 'Fight',
    cp: 1,
    when: 'Fight phase, when a Character unit from your army that is within Engagement Range of one or more Attached units is selected to fight.',
    effect: 'Until the end of the phase, melee attacks made by Character models in your unit can only target the enemy Character unit.',
  },
  {
    name: 'Fire Overwatch',
    phase: 'Opponent\'s Movement/Charge',
    cp: 1,
    when: 'Your opponent\'s Movement or Charge phase, just after an enemy unit is set up or when an enemy unit starts or ends a Normal, Advance, Fall Back, or Charge move.',
    effect: 'Your unit can shoot that enemy unit as if it were your Shooting phase, but hit on unmodified 6s only and cannot use Hazardous weapons.',
    restrictions: 'Cannot be used during a phase in which your unit has already been selected to shoot.',
  },
  {
    name: 'Go to Ground',
    phase: 'Opponent\'s Shooting',
    cp: 1,
    when: 'Your opponent\'s Shooting phase, just after an enemy unit has selected its targets.',
    effect: 'Until the end of the phase, all models in your unit have a 6+ invulnerable save and have the Benefit of Cover.',
  },
  {
    name: 'Grenade',
    phase: 'Shooting',
    cp: 1,
    when: 'Your Shooting phase, select one unit from your army that is not within Engagement Range of any enemy units and has not been selected to shoot this phase.',
    effect: 'Select one enemy unit within 8" of and visible to your unit. Roll six D6: for each 4+, that enemy unit suffers 1 mortal wound.',
    restrictions: 'Unit must have the Grenades keyword.',
  },
  {
    name: 'Heroic Intervention',
    phase: 'Opponent\'s Charge',
    cp: 2,
    when: 'Your opponent\'s Charge phase, just after an enemy unit ends a Charge move.',
    effect: 'Select one of your units that is within 6" of that enemy unit and not within Engagement Range of any enemy units. Your unit can make a D6" move but must end closer to the nearest enemy model.',
  },
  {
    name: 'Insane Bravery',
    phase: 'Any',
    cp: 1,
    when: 'Any phase, just after you fail a Battle-shock test for a unit from your army.',
    effect: 'That unit is no longer Battle-shocked.',
  },
  {
    name: 'Rapid Ingress',
    phase: 'Opponent\'s Movement',
    cp: 1,
    when: 'End of your opponent\'s Movement phase.',
    effect: 'Select one of your units in Reserves. Set it up anywhere on the battlefield that is more than 9" from all enemy models.',
  },
  {
    name: 'Smokescreen',
    phase: 'Opponent\'s Shooting',
    cp: 1,
    when: 'Your opponent\'s Shooting phase, just after an enemy unit selects its targets.',
    effect: 'Until the end of the phase, each time an attack targets your unit, subtract 1 from the Hit roll.',
    restrictions: 'Unit must have the Smoke keyword.',
  },
  {
    name: 'Tank Shock',
    phase: 'Charge',
    cp: 1,
    when: 'Your Charge phase, just after a Vehicle or Monster unit from your army ends a Charge move.',
    effect: 'Select one enemy unit within Engagement Range and roll a number of D6 equal to the Strength characteristic of your charging model. For each 5+, that enemy unit suffers 1 mortal wound.',
    restrictions: 'Unit must be a Vehicle or Monster.',
  },
];

const PHASE_ORDER = ['Any', 'Command', 'Movement', 'Shooting', 'Charge', 'Fight', "Opponent's Movement", "Opponent's Movement/Charge", "Opponent's Shooting", "Opponent's Charge"];

export function StratagemReference() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  const filtered = CORE_STRATAGEMS.filter(s =>
    !filter || s.name.toLowerCase().includes(filter.toLowerCase()) || s.phase.toLowerCase().includes(filter.toLowerCase())
  );

  // Group by phase
  const byPhase: Record<string, Stratagem[]> = {};
  for (const s of filtered) {
    if (!byPhase[s.phase]) byPhase[s.phase] = [];
    byPhase[s.phase].push(s);
  }

  const sortedPhases = Object.keys(byPhase).sort((a, b) =>
    PHASE_ORDER.indexOf(a) - PHASE_ORDER.indexOf(b)
  );

  return (
    <div className="stratagem-ref">
      <div className="stratagem-ref__header">
        <span className="stratagem-ref__title">Stratagems</span>
        <input
          className="form-input stratagem-ref__search"
          type="text"
          placeholder="Filter..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {sortedPhases.map(phase => (
        <div key={phase}>
          <div className="stratagem-ref__phase-header">{phase} Phase</div>
          {byPhase[phase].map(s => (
            <div
              key={s.name}
              className={`stratagem-ref__card${expanded === s.name ? ' stratagem-ref__card--expanded' : ''}`}
              onClick={() => setExpanded(expanded === s.name ? null : s.name)}
            >
              <div className="stratagem-ref__card-header">
                <span className="stratagem-ref__card-name">{s.name}</span>
                <span className="stratagem-ref__card-cp">{s.cp} CP</span>
              </div>
              {expanded === s.name && (
                <div className="stratagem-ref__card-body">
                  <div className="stratagem-ref__when">
                    <strong>When:</strong> {s.when}
                  </div>
                  <div className="stratagem-ref__effect">
                    <strong>Effect:</strong> {s.effect}
                  </div>
                  {s.restrictions && (
                    <div className="stratagem-ref__restrictions">
                      <strong>Restrictions:</strong> {s.restrictions}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
