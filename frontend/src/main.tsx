import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './themes.css'
import App from './App.tsx'
import { useAuthStore } from './shared/stores/authStore.ts'
import { initSentry } from './sentry.ts'

// Initialize Sentry before anything else so it captures all errors.
initSentry();

// Initialize auth listener once, before React renders.
// This ensures exactly one onAuthStateChange subscription for the app lifetime.
useAuthStore.getState().init();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
