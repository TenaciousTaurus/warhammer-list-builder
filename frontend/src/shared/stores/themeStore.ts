import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const THEMES = [
  { id: 'void-dark', label: 'Void Dark', accent: '#c9a84c' },
  { id: 'crimson-forge', label: 'Crimson Forge', accent: '#c94c4c' },
  { id: 'warpstorm', label: 'Warpstorm', accent: '#4cb8b8' },
  { id: 'iron-citadel', label: 'Iron Citadel', accent: '#6090b8' },
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
    },
  ),
);

// Apply theme from persisted state on store rehydration.
useThemeStore.subscribe((state) => {
  applyTheme(state.themeId, state.customTheme, state.fontSize);
});
