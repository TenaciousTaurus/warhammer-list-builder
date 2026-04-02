import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeStore, THEMES } from '../stores/themeStore';
import type { ThemeId } from '../stores/themeStore';

export function ThemePicker() {
  const { themeId, setTheme, customTheme } = useThemeStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const currentAccent =
    themeId === 'custom'
      ? customTheme.accent ?? '#c9a84c'
      : (THEMES.find((t) => t.id === themeId)?.accent ?? '#c9a84c');

  const currentLabel =
    themeId === 'custom'
      ? 'Custom'
      : (THEMES.find((t) => t.id === themeId)?.label ?? 'Void Dark');

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  return (
    <div className="theme-picker" ref={ref}>
      <button
        className="theme-picker__trigger"
        onClick={() => setOpen(!open)}
        aria-label={`Theme: ${currentLabel}`}
        aria-expanded={open}
        title="Change theme"
      >
        <span
          className="theme-picker__swatch"
          style={{ backgroundColor: currentAccent }}
        />
        <svg
          className="theme-picker__icon"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      </button>

      {open && (
        <div className="theme-picker__dropdown">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              className={`theme-picker__option${theme.id === themeId ? ' theme-picker__option--active' : ''}`}
              onClick={() => {
                setTheme(theme.id as ThemeId);
                setOpen(false);
              }}
            >
              <span
                className="theme-picker__option-swatch"
                style={{ backgroundColor: theme.accent }}
              />
              <span className="theme-picker__option-label">{theme.label}</span>
              {theme.id === themeId && (
                <svg className="theme-picker__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}

          <div className="theme-picker__divider" />

          <button
            className={`theme-picker__option${themeId === 'custom' ? ' theme-picker__option--active' : ''}`}
            onClick={() => {
              setOpen(false);
              navigate('/settings#appearance');
            }}
          >
            <span
              className="theme-picker__option-swatch theme-picker__option-swatch--custom"
              style={themeId === 'custom' ? { backgroundColor: currentAccent } : undefined}
            />
            <span className="theme-picker__option-label">Custom...</span>
            {themeId === 'custom' && (
              <svg className="theme-picker__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
