import type { ReactNode } from 'react';

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <section className="settings-section card">
      <h3 className="settings-section__title">{title}</h3>
      {description && (
        <p className="settings-section__description">{description}</p>
      )}
      <div className="settings-section__body">{children}</div>
    </section>
  );
}
