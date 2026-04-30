import { useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

export function AuthPage() {
  const { user, loading, signIn, signUp } = useAuth();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Already logged in — redirect home
  if (user && !loading) return <Navigate to="/" replace />;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = mode === 'login'
      ? await signIn(email, password)
      : await signUp(email, password);

    if (result.error) {
      setError(result.error);
    } else if (mode === 'signup') {
      setSignupSuccess(true);
    }
    // On login success, onAuthStateChange will fire and user state updates → redirect
    setSubmitting(false);
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
    } else {
      setResetSent(true);
    }
    setSubmitting(false);
  }

  if (loading) {
    return (
      <div className="auth-page">
        <div className="skeleton-list" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div className="skeleton skeleton--header" />
          <div className="skeleton" style={{ height: '44px', width: '100%' }} />
          <div className="skeleton" style={{ height: '44px', width: '100%' }} />
        </div>
      </div>
    );
  }

  if (signupSuccess) {
    return (
      <div className="auth-page">
        <div className="auth-card card glass">
          <div className="auth-card__icon">&#9876;</div>
          <h2 className="auth-card__title">Account Created</h2>
          <p className="auth-card__subtitle">
            Your account has been created. Check your email to confirm your account before signing in.
          </p>
          <button
            className="btn btn--primary auth-card__submit"
            onClick={() => {
              setSignupSuccess(false);
              setMode('login');
              setPassword('');
            }}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'forgot') {
    return (
      <div className="auth-page">
        <div className="auth-card card glass">
          <div className="auth-card__icon">&#9876;</div>
          <h2 className="auth-card__title">Reset Password</h2>
          {resetSent ? (
            <>
              <p className="auth-card__subtitle">
                Check your email for a password reset link. It may take a minute to arrive.
              </p>
              <button
                className="btn btn--primary auth-card__submit"
                onClick={() => { setMode('login'); setResetSent(false); setError(null); }}
              >
                Back to Sign In
              </button>
            </>
          ) : (
            <>
              <p className="auth-card__subtitle">
                Enter your email and we'll send you a link to reset your password.
              </p>
              <form onSubmit={handleForgotPassword} className="auth-form">
                <div className="form-group">
                  <label htmlFor="reset-email">Email</label>
                  <input
                    id="reset-email"
                    className="form-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="commander@imperium.mil"
                    required
                    autoComplete="email"
                  />
                </div>
                {error && (
                  <div className="validation-banner validation-banner--error">{error}</div>
                )}
                <button
                  type="submit"
                  className="btn btn--primary auth-card__submit"
                  disabled={submitting || !email}
                >
                  {submitting ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
              <div className="auth-card__toggle">
                <button
                  type="button"
                  className="auth-card__toggle-btn"
                  onClick={() => { setMode('login'); setError(null); }}
                >
                  Back to Sign In
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card card glass">
        <div className="auth-card__icon">&#9876;</div>
        <h2 className="auth-card__title">
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </h2>
        <p className="auth-card__subtitle">
          {mode === 'login'
            ? 'Enter your credentials to access your army lists.'
            : 'Create an account to save and manage your army lists.'}
        </p>

        <form onSubmit={handleSubmit} method="post" action="#" className="auth-form">
          <div className="form-group">
            <label htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="commander@imperium.mil"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'signup' ? 'Min 8 characters' : ''}
              required
              minLength={8}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {mode === 'login' && (
            <div style={{ textAlign: 'right', marginTop: 'calc(var(--space-xs) * -1)' }}>
              <button
                type="button"
                className="auth-card__toggle-btn"
                style={{ fontSize: 'var(--text-xs)' }}
                onClick={() => { setMode('forgot'); setError(null); }}
              >
                Forgot password?
              </button>
            </div>
          )}

          {error && (
            <div className="validation-banner validation-banner--error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn--primary auth-card__submit"
            disabled={submitting || !email || !password}
          >
            {submitting
              ? (mode === 'login' ? 'Signing in...' : 'Creating account...')
              : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="auth-card__toggle">
          {mode === 'login' ? (
            <span>
              No account?{' '}
              <button
                type="button"
                className="auth-card__toggle-btn"
                onClick={() => { setMode('signup'); setError(null); }}
              >
                Create one
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                className="auth-card__toggle-btn"
                onClick={() => { setMode('login'); setError(null); }}
              >
                Sign in
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
