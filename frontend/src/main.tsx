import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from '@sentry/react'
import './index.css'
import './themes.css'
import App from './App.tsx'
import { useAuthStore } from './shared/stores/authStore.ts'

// Initialize Sentry before anything else.
// Only runs in production — no noise during local dev.
if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 0.2,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
  });
}

// Initialize auth listener once, before React renders.
// This ensures exactly one onAuthStateChange subscription for the app lifetime.
useAuthStore.getState().init();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
