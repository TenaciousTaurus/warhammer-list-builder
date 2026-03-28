import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from './authStore';
import { supabase } from '../lib/supabase';

// Reset store between tests
beforeEach(() => {
  useAuthStore.setState({
    user: null,
    session: null,
    loading: true,
    initialized: false,
  });
});

describe('authStore', () => {
  it('initializes with correct default state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.session).toBeNull();
    expect(state.loading).toBe(true);
    expect(state.initialized).toBe(false);
  });

  describe('signIn', () => {
    it('calls supabase.auth.signInWithPassword', async () => {
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: null, session: null },
        error: null,
      } as never);

      const result = await useAuthStore.getState().signIn('test@example.com', 'password');

      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
      });
      expect(result.error).toBeNull();
    });

    it('returns error message on failure', async () => {
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials' },
      } as never);

      const result = await useAuthStore.getState().signIn('test@example.com', 'wrong');

      expect(result.error).toBe('Invalid credentials');
    });
  });

  describe('signUp', () => {
    it('calls supabase.auth.signUp', async () => {
      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: null, session: null },
        error: null,
      } as never);

      const result = await useAuthStore.getState().signUp('new@example.com', 'password123');

      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'password123',
      });
      expect(result.error).toBeNull();
    });
  });

  describe('signOut', () => {
    it('calls supabase.auth.signOut', async () => {
      vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null } as never);

      await useAuthStore.getState().signOut();

      expect(supabase.auth.signOut).toHaveBeenCalled();
    });
  });
});
