interface ToggleSettingProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ToggleSetting({ label, description, checked, onChange }: ToggleSettingProps) {
  return (
    <label className="toggle-setting">
      <div className="toggle-setting__text">
        <span className="toggle-setting__label">{label}</span>
        {description && (
          <span className="toggle-setting__description">{description}</span>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={`toggle-setting__switch${checked ? ' toggle-setting__switch--on' : ''}`}
        onClick={() => onChange(!checked)}
      >
        <span className="toggle-setting__thumb" />
      </button>
    </label>
  );
}
