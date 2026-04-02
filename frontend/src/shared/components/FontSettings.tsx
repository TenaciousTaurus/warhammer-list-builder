import { useThemeStore } from '../stores/themeStore';

export function FontSettings() {
  const { fontSize, setFontSize } = useThemeStore();

  return (
    <div className="font-settings">
      <div className="font-settings__row">
        <label className="font-settings__label">
          Font Size: {fontSize}%
        </label>
        <input
          type="range"
          className="font-settings__slider"
          min={75}
          max={150}
          step={5}
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
        />
        <div className="font-settings__range-labels">
          <span>75%</span>
          <span>100%</span>
          <span>150%</span>
        </div>
      </div>
      {fontSize !== 100 && (
        <button className="btn btn--sm" onClick={() => setFontSize(100)}>
          Reset Font Size
        </button>
      )}
    </div>
  );
}
