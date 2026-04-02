import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DisplayDensity = 'comfortable' | 'compact';

interface SettingsState {
  // General
  displayDensity: DisplayDensity;
  defaultBattleSize: string | null;

  // List Builder — Army Edition
  showConstantSelections: boolean;
  showEmptyCategories: boolean;

  // List Builder — Unit Edition
  showUnitConstantSelections: boolean;
  useRadioButtons: boolean;
  showOptionTypeIcons: boolean;
  autoFixErrors: boolean;
  displayCascadingWarnings: boolean;

  // Actions
  setSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
  resetToDefaults: () => void;
}

const DEFAULTS = {
  displayDensity: 'comfortable' as DisplayDensity,
  defaultBattleSize: null,
  showConstantSelections: true,
  showEmptyCategories: true,
  showUnitConstantSelections: false,
  useRadioButtons: false,
  showOptionTypeIcons: true,
  autoFixErrors: true,
  displayCascadingWarnings: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULTS,

      setSetting: (key, value) => set({ [key]: value } as Partial<SettingsState>),

      resetToDefaults: () => set(DEFAULTS),
    }),
    {
      name: 'warforge-settings',
      partialize: (state) => {
        // Exclude actions from persistence
        const { setSetting: _a, resetToDefaults: _b, ...rest } = state;
        return rest;
      },
    },
  ),
);
