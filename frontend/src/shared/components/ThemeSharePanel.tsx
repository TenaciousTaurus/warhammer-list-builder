import { useState } from 'react';
import { useThemeStore } from '../stores/themeStore';

export function ThemeSharePanel() {
  const { exportTheme, importTheme, themeId } = useThemeStore();
  const [importValue, setImportValue] = useState('');
  const [copied, setCopied] = useState(false);
  const [importError, setImportError] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  const handleExport = async () => {
    const json = exportTheme();
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text in a temporary textarea
      const ta = document.createElement('textarea');
      ta.value = json;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleImport = () => {
    setImportError(false);
    setImportSuccess(false);
    if (!importValue.trim()) return;

    const ok = importTheme(importValue.trim());
    if (ok) {
      setImportSuccess(true);
      setImportValue('');
      setTimeout(() => setImportSuccess(false), 2000);
    } else {
      setImportError(true);
    }
  };

  return (
    <div className="theme-share">
      <div className="theme-share__section">
        <h4 className="theme-share__heading">Export Theme</h4>
        <p className="theme-share__hint">
          Copy your custom theme as JSON to share with others.
        </p>
        <button
          className="btn btn--sm btn--primary"
          onClick={handleExport}
          disabled={themeId !== 'custom'}
        >
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </button>
        {themeId !== 'custom' && (
          <p className="theme-share__hint">Select a custom theme first to export.</p>
        )}
      </div>

      <div className="theme-share__section">
        <h4 className="theme-share__heading">Import Theme</h4>
        <textarea
          className="form-input theme-share__textarea"
          placeholder="Paste theme JSON here..."
          value={importValue}
          onChange={(e) => {
            setImportValue(e.target.value);
            setImportError(false);
          }}
          rows={4}
        />
        <button className="btn btn--sm" onClick={handleImport}>
          Apply Theme
        </button>
        {importError && (
          <p className="theme-share__error">Invalid theme JSON. Please check and try again.</p>
        )}
        {importSuccess && (
          <p className="theme-share__success">Theme applied!</p>
        )}
      </div>
    </div>
  );
}
