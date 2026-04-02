import { SettingsSection } from '../components/SettingsSection';
import { ToggleSetting } from '../components/ToggleSetting';
import { ThemePicker } from '../components/ThemePicker';
import { CustomThemeEditor } from '../components/CustomThemeEditor';
import { FontSettings } from '../components/FontSettings';
import { ThemeSharePanel } from '../components/ThemeSharePanel';
import { useSettingsStore } from '../stores/settingsStore';
import type { DisplayDensity } from '../stores/settingsStore';

const BATTLE_SIZES = [
  { value: '', label: 'None' },
  { value: 'Combat Patrol', label: 'Combat Patrol (500)' },
  { value: 'Incursion', label: 'Incursion (1000)' },
  { value: 'Strike Force', label: 'Strike Force (2000)' },
  { value: 'Onslaught', label: 'Onslaught (3000)' },
];

export function SettingsPage() {
  const {
    displayDensity,
    defaultBattleSize,
    showConstantSelections,
    showEmptyCategories,
    showUnitConstantSelections,
    useRadioButtons,
    showOptionTypeIcons,
    autoFixErrors,
    displayCascadingWarnings,
    setSetting,
    resetToDefaults,
  } = useSettingsStore();

  return (
    <div className="settings-page">
      <div className="settings-page__header">
        <h1>Settings</h1>
        <button className="btn btn--sm" onClick={resetToDefaults}>
          Reset to Defaults
        </button>
      </div>

      <SettingsSection title="General">
        <div className="settings-row">
          <label className="settings-row__label">Display Density</label>
          <div className="settings-row__control">
            <select
              className="form-select"
              value={displayDensity}
              onChange={(e) => setSetting('displayDensity', e.target.value as DisplayDensity)}
            >
              <option value="comfortable">Comfortable</option>
              <option value="compact">Compact</option>
            </select>
          </div>
        </div>
        <div className="settings-row">
          <label className="settings-row__label">Default Battle Size</label>
          <div className="settings-row__control">
            <select
              className="form-select"
              value={defaultBattleSize ?? ''}
              onChange={(e) => setSetting('defaultBattleSize', e.target.value || null)}
            >
              {BATTLE_SIZES.map((bs) => (
                <option key={bs.value} value={bs.value}>{bs.label}</option>
              ))}
            </select>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Army Edition"
        description="Controls how army lists display in the list builder."
      >
        <ToggleSetting
          label="Display constant selections"
          description="Show selections that are always included (e.g., default wargear)"
          checked={showConstantSelections}
          onChange={(v) => setSetting('showConstantSelections', v)}
        />
        <ToggleSetting
          label="Show empty categories"
          description="Display unit role categories even when they contain no units"
          checked={showEmptyCategories}
          onChange={(v) => setSetting('showEmptyCategories', v)}
        />
      </SettingsSection>

      <SettingsSection
        title="Unit Edition"
        description="Controls how individual units display when editing."
      >
        <ToggleSetting
          label="Show constant selections"
          description="Show wargear options that cannot be changed"
          checked={showUnitConstantSelections}
          onChange={(v) => setSetting('showUnitConstantSelections', v)}
        />
        <ToggleSetting
          label="Use radio buttons"
          description="Use radio buttons instead of dropdowns for single-choice wargear"
          checked={useRadioButtons}
          onChange={(v) => setSetting('useRadioButtons', v)}
        />
        <ToggleSetting
          label="Display option type icons"
          description="Show icons indicating wargear option types"
          checked={showOptionTypeIcons}
          onChange={(v) => setSetting('showOptionTypeIcons', v)}
        />
        <ToggleSetting
          label="Automatically fix errors"
          description="Auto-correct invalid selections when possible"
          checked={autoFixErrors}
          onChange={(v) => setSetting('autoFixErrors', v)}
        />
        <ToggleSetting
          label="Display warnings in cascading mode"
          description="Show warnings when selections affect other units"
          checked={displayCascadingWarnings}
          onChange={(v) => setSetting('displayCascadingWarnings', v)}
        />
      </SettingsSection>

      <SettingsSection
        title="Appearance"
        description="Customize the look and feel of WarForge."
      >
        <div className="settings-row">
          <label className="settings-row__label">Preset Theme</label>
          <div className="settings-row__control">
            <ThemePicker />
          </div>
        </div>

        <h4 className="settings-subheading">Custom Colors</h4>
        <CustomThemeEditor />

        <h4 className="settings-subheading">Font Size</h4>
        <FontSettings />

        <h4 className="settings-subheading">Share Theme</h4>
        <ThemeSharePanel />
      </SettingsSection>
    </div>
  );
}
