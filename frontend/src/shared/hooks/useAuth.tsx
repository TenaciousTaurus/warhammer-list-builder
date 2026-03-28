import { useAuthStore } from '../stores/authStore';

// Auth is initialized once in main.tsx before React renders.
// This hook just reads from the store — no side effects.
export function useAuth() {
  const { user, session, loading, signIn, signUp, signOut } = useAuthStore();
  return { user, session, loading, signIn, signUp, signOut };
}
