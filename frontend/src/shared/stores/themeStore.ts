import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const THEMES = [
  { id: 'void-dark', label: 'Void Dark', accent: '#c9a84c' },
  { id: 'crimson-forge', label: 'Crimson Forge', accent: '#c94c4c' },
  { id: 'warpstorm', label: 'Warpstorm', accent: '#4cb8b8' },
  { id: 'iron-citadel', label: 'Iron Citadel', accent: '#6090b8' },
] as const;

export type ThemeId = typeof THEMES[number]['id'];

interface ThemeState {
  themeId: ThemeId;
  setTheme: (id: ThemeId) => void;
}

function applyTheme(id: ThemeId) {
  if (id === 'void-dark') {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = id;
  }
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themeId: 'void-dark',
      setTheme: (id: ThemeId) => {
        applyTheme(id);
        set({ themeId: id });
      },
    }),
    {
      name: 'warforge-theme',
    },
  ),
);

// Apply theme from persisted state on store rehydration.
// The inline script in index.html handles the initial paint;
// this covers the Zustand side so the store and DOM stay in sync.
useThemeStore.subscribe((state) => {
  applyTheme(state.themeId);
});
