import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import './Account.css';

export function Account() {
  const { user, loading, configured, signUpWithEmail, signInWithEmail, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(false);

  if (!configured) {
    return (
      <div className="account-page">
        <h1>Account</h1>
        <p className="account-hint">
          Supabase is not configured. Add <code>VITE_SUPABASE_URL</code> and{' '}
          <code>VITE_SUPABASE_ANON_KEY</code> to your environment to enable sign-in and cloud saves.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="account-page">
        <p>Loading session…</p>
      </div>
    );
  }

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setPending(true);
    const { error: err } = await signUpWithEmail(email.trim(), password);
    setPending(false);
    if (err) {
      setError(err.message);
      return;
    }
    setMessage('Check your email to confirm your account if required by your project settings.');
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setPending(true);
    const { error: err } = await signInWithEmail(email.trim(), password);
    setPending(false);
    if (err) {
      setError(err.message);
      return;
    }
    setMessage('Signed in.');
  };

  const handleSignOut = async () => {
    setError(null);
    setMessage(null);
    setPending(true);
    const { error: err } = await signOut();
    setPending(false);
    if (err) {
      setError(err.message);
      return;
    }
    setMessage('Signed out.');
  };

  if (user) {
    return (
      <div className="account-page">
        <h1>Account</h1>
        <p className="account-email">
          Signed in as <strong>{user.email ?? user.id}</strong>
        </p>
        <p className="account-hint">
          Game progress stays on this device until you sign in; after that, finished runs can be saved to your account for use on other devices.
        </p>
        {message && <p className="account-success">{message}</p>}
        {error && <p className="account-error">{error}</p>}
        <button type="button" className="account-button" onClick={handleSignOut} disabled={pending}>
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="account-page">
      <h1>Account</h1>
      <p className="account-hint">
        Play without signing in — progress is stored locally in your browser. Sign in to sync finished game results across devices.
      </p>
      <form className="account-form" onSubmit={handleSignIn}>
        <label className="account-label">
          Email
          <input
            className="account-input"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="account-label">
          Password
          <input
            className="account-input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </label>
        {message && <p className="account-success">{message}</p>}
        {error && <p className="account-error">{error}</p>}
        <div className="account-actions">
          <button type="submit" className="account-button" disabled={pending}>
            Sign in
          </button>
          <button type="button" className="account-button account-button-secondary" onClick={handleSignUp} disabled={pending}>
            Create account
          </button>
        </div>
      </form>
    </div>
  );
}
