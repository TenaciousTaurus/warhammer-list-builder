const SKIP_KEY = 'warforge-skip-pregame-checklist';

export function shouldShowChecklist(): boolean {
  return localStorage.getItem(SKIP_KEY) !== '1';
}
