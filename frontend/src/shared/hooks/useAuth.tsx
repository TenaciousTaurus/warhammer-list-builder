import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

export function useAuth() {
  const store = useAuthStore();

  // Initialize auth listener on first use
  useEffect(() => {
    if (!store.initialized) {
      const unsubscribe = store.init();
      return unsubscribe;
    }
  }, [store.initialized, store.init]);

  return {
    user: store.user,
    session: store.session,
    loading: store.loading,
    signIn: store.signIn,
    signUp: store.signUp,
    signOut: store.signOut,
  };
}
