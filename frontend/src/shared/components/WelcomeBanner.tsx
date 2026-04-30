import type { ReactNode } from 'react';
import { useOnboardingStore } from '../stores/onboardingStore';

interface WelcomeBannerProps {
  /** Unique key used to persist dismissal across reloads. Once dismissed, never shown again. */
  bannerKey: string;
  title: string;
  children: ReactNode;
}

export function WelcomeBanner({ bannerKey, title, children }: WelcomeBannerProps) {
  const isDismissed = useOnboardingStore((s) => s.isDismissed(bannerKey));
  const dismiss = useOnboardingStore((s) => s.dismiss);

  if (isDismissed) return null;

  return (
    <div className="welcome-banner" role="region" aria-label={title}>
      <div className="welcome-banner__body">
        <h3 className="welcome-banner__title">{title}</h3>
        <div className="welcome-banner__content">{children}</div>
      </div>
      <button
        type="button"
        className="welcome-banner__dismiss"
        onClick={() => dismiss(bannerKey)}
        aria-label="Dismiss"
        title="Dismiss"
      >
        &times;
      </button>
    </div>
  );
}
