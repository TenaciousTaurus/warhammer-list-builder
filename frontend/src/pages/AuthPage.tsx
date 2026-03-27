import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function AuthPage() {
  const { user, loading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

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
            Your account has been created. You can now sign in.
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

        <form onSubmit={handleSubmit} className="auth-form">
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
              placeholder={mode === 'signup' ? 'Min 6 characters' : ''}
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

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
