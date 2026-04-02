import { useThemeStore, CUSTOM_THEME_VARS } from '../stores/themeStore';
import type { CustomThemeKey } from '../stores/themeStore';

/** Default colors from the Void Dark theme (used as placeholders) */
const DEFAULT_COLORS: Record<CustomThemeKey, string> = {
  accent: '#c9a84c',
  accentDim: '#a08030',
  accentBright: '#e0c060',
  bgPrimary: '#0a0a0f',
  bgSecondary: '#12121a',
  bgCard: '#15151f',
  textPrimary: '#e8e6e3',
  textSecondary: '#9a9aaa',
  border: '#2a2a3a',
};

export function CustomThemeEditor() {
  const { customTheme, setCustomColor, clearCustomTheme, themeId } = useThemeStore();

  const isCustom = themeId === 'custom';

  return (
    <div className="custom-theme-editor">
      <div className="custom-theme-editor__grid">
        {(Object.entries(CUSTOM_THEME_VARS) as [CustomThemeKey, typeof CUSTOM_THEME_VARS[CustomThemeKey]][]).map(
          ([key, { label }]) => (
            <div key={key} className="custom-theme-editor__field">
              <label className="custom-theme-editor__label">{label}</label>
              <div className="custom-theme-editor__input-wrap">
                <input
                  type="color"
                  className="custom-theme-editor__color-input"
                  value={customTheme[key] ?? DEFAULT_COLORS[key]}
                  onChange={(e) => setCustomColor(key, e.target.value)}
                />
                <span className="custom-theme-editor__hex">
                  {customTheme[key] ?? DEFAULT_COLORS[key]}
                </span>
              </div>
            </div>
          ),
        )}
      </div>
      {isCustom && (
        <button className="btn btn--sm" onClick={clearCustomTheme}>
          Reset to Default
        </button>
      )}
    </div>
  );
}
