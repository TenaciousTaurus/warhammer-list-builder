import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const THEMES = [
  // Presets — no faction association
  { id: 'void-dark',    label: 'Void Dark',    accent: '#c9a84c', group: '' },
  { id: 'crimson-forge', label: 'Crimson Forge', accent: '#c94c4c', group: '' },
  { id: 'warpstorm',   label: 'Void Storm',    accent: '#4cb8b8', group: '' },
  { id: 'iron-citadel', label: 'Iron Citadel', accent: '#6090b8', group: '' },
  // Imperium
  { id: 'azure-crusade',    label: 'Azure Crusade',    accent: '#1a5cb8', group: 'Imperium' },
  { id: 'fenrisian-frost',  label: 'Tundra Frost',     accent: '#c88030', group: 'Imperium' },
  { id: 'ravenwing-shroud', label: 'Shadow Wing',      accent: '#c8b48a', group: 'Imperium' },
  { id: 'sanguine-wings',   label: 'Sanguine Wings',   accent: '#c89040', group: 'Imperium' },
  { id: 'argent-ward',      label: 'Argent Ward',      accent: '#8ab0d0', group: 'Imperium' },
  { id: 'vigil-eternal',    label: 'Vigil Eternal',    accent: '#b0b8c4', group: 'Imperium' },
  { id: 'cog-and-coil',     label: 'Cog and Coil',     accent: '#a0a8b4', group: 'Imperium' },
  { id: 'sacred-flame',     label: 'Sacred Flame',     accent: '#e06070', group: 'Imperium' },
  { id: 'cadian-wall',      label: 'Bastion Wall',     accent: '#8aaa50', group: 'Imperium' },
  { id: 'auric-palace',     label: 'Auric Palace',     accent: '#d4980a', group: 'Imperium' },
  { id: 'iron-throne',      label: 'Iron Throne',      accent: '#7030b8', group: 'Imperium' },
  // Chaos
  { id: 'blood-tithe',      label: 'Blood Tithe',      accent: '#c03820', group: 'Chaos' },
  { id: 'perfections-edge', label: "Perfection's Edge", accent: '#d050b0', group: 'Chaos' },
  { id: 'rubric-dust',      label: 'Ashen Dust',       accent: '#b8902a', group: 'Chaos' },
  { id: 'plague-garden',    label: 'Blighted Grove',   accent: '#78be3c', group: 'Chaos' },
  { id: 'night-lords',      label: 'Night Terror',     accent: '#3a7fff', group: 'Chaos' },
  { id: 'sons-of-horus',    label: 'Jade Pact',        accent: '#4c9b7a', group: 'Chaos' },
  { id: 'daemon-host',      label: 'Daemon Host',      accent: '#9a20c8', group: 'Chaos' },
  { id: 'corrupted-throne', label: 'Corrupted Throne', accent: '#a83060', group: 'Chaos' },
  // Xenos
  { id: 'necron-tomb',       label: 'Star Tomb',         accent: '#3cd672', group: 'Xenos' },
  { id: 'tau-sept',          label: 'Ember Sept',         accent: '#d4762a', group: 'Xenos' },
  { id: 'waaagh-tide',       label: 'Green Tide',         accent: '#5a9e14', group: 'Xenos' },
  { id: 'leviathan-tide',    label: 'Devourer Tide',      accent: '#e0d8c8', group: 'Xenos' },
  { id: 'ghost-halls',       label: 'Ghost Halls',        accent: '#c8a220', group: 'Xenos' },
  { id: 'thorned-rose',      label: 'Thorned Rose',       accent: '#50b840', group: 'Xenos' },
  { id: 'farseers-veil',     label: "Oracle's Veil",      accent: '#d4c8a0', group: 'Xenos' },
  { id: 'alaitoc-dusk',      label: "Wanderer's Dusk",    accent: '#d0c020', group: 'Xenos' },
  { id: 'spirit-spiral',     label: 'Spirit Spiral',      accent: '#e8e0d8', group: 'Xenos' },
  { id: 'commorrite-blade',  label: 'Dark City Blade',    accent: '#9040d8', group: 'Xenos' },
  { id: 'masque-eternal',    label: 'Masque Eternal',     accent: '#e030a0', group: 'Xenos' },
  { id: 'ancestor-core',     label: 'Ancestor Core',      accent: '#b87828', group: 'Xenos' },
  { id: 'genestealer-veil',  label: 'Brood Veil',         accent: '#7050c8', group: 'Xenos' },
] as const;

export type PresetThemeId = typeof THEMES[number]['id'];
export type ThemeId = PresetThemeId | 'custom';

/** Customizable CSS variable keys for the custom theme editor */
export const CUSTOM_THEME_VARS = {
  accent: { label: 'Accent Color', cssVar: '--color-gold', rgbVar: '--gold-rgb' },
  accentDim: { label: 'Accent Dim', cssVar: '--color-gold-dim', rgbVar: null },
  accentBright: { label: 'Accent Bright', cssVar: '--color-gold-bright', rgbVar: null },
  bgPrimary: { label: 'Background', cssVar: '--color-bg-primary', rgbVar: null },
  bgSecondary: { label: 'Background Alt', cssVar: '--color-bg-secondary', rgbVar: null },
  bgCard: { label: 'Card Background', cssVar: '--color-bg-card', rgbVar: null },
  textPrimary: { label: 'Text Color', cssVar: '--color-text-primary', rgbVar: null },
  textSecondary: { label: 'Text Secondary', cssVar: '--color-text-secondary', rgbVar: null },
  border: { label: 'Border Color', cssVar: '--color-border', rgbVar: null },
} as const;

export type CustomThemeKey = keyof typeof CUSTOM_THEME_VARS;

export type CustomTheme = Partial<Record<CustomThemeKey, string>>;

interface ThemeState {
  themeId: ThemeId;
  customTheme: CustomTheme;
  fontSize: number; // percentage, 100 = default

  setTheme: (id: ThemeId) => void;
  setCustomColor: (key: CustomThemeKey, hex: string) => void;
  setFontSize: (pct: number) => void;
  clearCustomTheme: () => void;
  exportTheme: () => string;
  importTheme: (json: string) => boolean;
}

/** Convert hex (#rrggbb) to "r, g, b" string for rgba() */
function hexToRgb(hex: string): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

function applyPresetTheme(id: PresetThemeId) {
  // Clear any custom inline styles
  const el = document.documentElement;
  Object.values(CUSTOM_THEME_VARS).forEach(({ cssVar, rgbVar }) => {
    el.style.removeProperty(cssVar);
    if (rgbVar) el.style.removeProperty(rgbVar);
  });
  el.style.removeProperty('--focus-ring');
  el.style.removeProperty('font-size');

  if (id === 'void-dark') {
    delete el.dataset.theme;
  } else {
    el.dataset.theme = id;
  }
}

function applyCustomTheme(custom: CustomTheme, fontSize: number) {
  const el = document.documentElement;
  el.dataset.theme = 'custom';

  // Apply each custom color
  Object.entries(custom).forEach(([key, hex]) => {
    if (!hex) return;
    const varDef = CUSTOM_THEME_VARS[key as CustomThemeKey];
    if (varDef) {
      el.style.setProperty(varDef.cssVar, hex);
      if (varDef.rgbVar) {
        el.style.setProperty(varDef.rgbVar, hexToRgb(hex));
      }
    }
  });

  // Update focus ring if accent changed
  if (custom.accent) {
    el.style.setProperty('--focus-ring', `0 0 0 2px rgba(${hexToRgb(custom.accent)}, 0.4)`);
  }

  // Font size
  if (fontSize !== 100) {
    el.style.setProperty('font-size', `${fontSize}%`);
  } else {
    el.style.removeProperty('font-size');
  }
}

function applyTheme(id: ThemeId, custom: CustomTheme, fontSize: number) {
  if (id === 'custom') {
    applyCustomTheme(custom, fontSize);
  } else {
    applyPresetTheme(id);
    // Apply font size even for presets
    if (fontSize !== 100) {
      document.documentElement.style.setProperty('font-size', `${fontSize}%`);
    }
  }
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      themeId: 'void-dark' as ThemeId,
      customTheme: {},
      fontSize: 100,

      setTheme: (id: ThemeId) => {
        const { customTheme, fontSize } = get();
        applyTheme(id, customTheme, fontSize);
        set({ themeId: id });
      },

      setCustomColor: (key: CustomThemeKey, hex: string) => {
        const custom = { ...get().customTheme, [key]: hex };
        const fontSize = get().fontSize;
        applyCustomTheme(custom, fontSize);
        set({ themeId: 'custom', customTheme: custom });
      },

      setFontSize: (pct: number) => {
        const { themeId, customTheme } = get();
        applyTheme(themeId, customTheme, pct);
        set({ fontSize: pct });
      },

      clearCustomTheme: () => {
        applyPresetTheme('void-dark');
        set({ themeId: 'void-dark', customTheme: {}, fontSize: 100 });
      },

      exportTheme: () => {
        const { customTheme, fontSize } = get();
        return JSON.stringify({ customTheme, fontSize }, null, 2);
      },

      importTheme: (json: string) => {
        try {
          const data = JSON.parse(json);
          if (typeof data !== 'object' || !data) return false;
          const custom: CustomTheme = data.customTheme ?? {};
          const fontSize: number = typeof data.fontSize === 'number' ? data.fontSize : 100;
          applyCustomTheme(custom, fontSize);
          set({ themeId: 'custom', customTheme: custom, fontSize });
          return true;
        } catch {
          return false;
        }
      },
    }),
    {
      name: 'warforge-theme',
      partialize: (state) => ({
        themeId: state.themeId,
        customTheme: state.customTheme,
        fontSize: state.fontSize,
      }),
      onRehydrateStorage: () => (rehydratedState) => {
        if (rehydratedState) {
          applyTheme(rehydratedState.themeId, rehydratedState.customTheme, rehydratedState.fontSize);
        }
      },
    },
  ),
);

// Apply theme from persisted state on store rehydration.
useThemeStore.subscribe((state) => {
  applyTheme(state.themeId, state.customTheme, state.fontSize);
});
