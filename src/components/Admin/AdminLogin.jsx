import { useState, useContext, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext';
import { authFetch, API_URL } from '../../services/authFetch';
import './AdminLogin.css';

const AdminLogin = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [trustDevice, setTrustDevice] = useState(true);
  const { login, error, mfaChallenge, verifyMfa } = useContext(AdminContext);
  const navigate = useNavigate();
  const location = useLocation();
  const resetToken = useMemo(() => new URLSearchParams(location.search).get('resetToken') || '', [location.search]);
  const [mode, setMode] = useState(resetToken ? 'reset' : 'login');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login(identifier, password);
    setIsLoading(false);
    if (success === true) {
      navigate(window.location.pathname.startsWith('/admin') ? '/admin/dashboard' : '/.well-known/admin-dashboard-sh123456');
    }
  };

  const handleMfaSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await verifyMfa(mfaCode, trustDevice);
    setIsLoading(false);
    if (success) {
      navigate(window.location.pathname.startsWith('/admin') ? '/admin/dashboard' : '/.well-known/admin-dashboard-sh123456');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setForgotError('');
    setForgotMessage('');
    try {
      const response = await authFetch('/auth/admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        scope: 'admin',
        body: JSON.stringify({
          identifier: forgotIdentifier,
          appUrl: `${window.location.origin}${window.location.pathname}`,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setForgotError(data.err || 'Could not start password reset.');
      } else {
        setForgotMessage(data.message || 'If an admin account matches, a reset link has been sent.');
      }
    } catch (err) {
      setForgotError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetMessage('');
    if (!resetToken) {
      setResetError('Reset token is missing.');
      return;
    }
    if (resetPassword.length < 10) {
      setResetError('Password must be at least 10 characters.');
      return;
    }
    if (resetPassword !== resetConfirmPassword) {
      setResetError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await authFetch('/auth/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        scope: 'admin',
        body: JSON.stringify({
          token: resetToken,
          password: resetPassword,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setResetError(data.err || 'Could not reset password.');
      } else {
        setResetMessage(data.message || 'Password updated. You can now log in.');
        setMode('login');
        setResetPassword('');
        setResetConfirmPassword('');
        navigate(window.location.pathname, { replace: true });
      }
    } catch (err) {
      setResetError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <div className="admin-login-kicker">LTE Admin Access</div>
        <h1 className="admin-login-title">{mode === 'reset' ? 'Set New Password' : mode === 'forgot' ? 'Forgot Password' : 'Admin Login'}</h1>
        <p className="admin-login-subtitle">
          {mfaChallenge
            ? 'Enter the 6-digit code from your authenticator app to finish admin login.'
            : mode === 'reset'
            ? 'Choose a new admin password to complete the reset.'
            : mode === 'forgot'
              ? 'Enter your admin email or username and we will send a reset link.'
              : 'Use your admin email or username to sign in.'}
        </p>

        {!mfaChallenge && <div className="admin-login-mode-switch">
          <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Login</button>
          <button type="button" className={mode === 'forgot' ? 'active' : ''} onClick={() => setMode('forgot')}>Forgot Password</button>
        </div>}

        {mfaChallenge && (
          <>
            {error && <div className="admin-error-message">{error}</div>}
            <form className="admin-login-form" onSubmit={handleMfaSubmit}>
              <label className="admin-form-label">
                MFA code
                <input
                  type="text"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  className="admin-form-input"
                  placeholder="123456 or backup code"
                  autoComplete="one-time-code"
                  required
                />
              </label>
              <label className="admin-form-label" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.75rem' }}>
                <input
                  type="checkbox"
                  checked={trustDevice}
                  onChange={(e) => setTrustDevice(e.target.checked)}
                  style={{ width: '18px', height: '18px' }}
                />
                Trust this device for 30 days
              </label>
              <button type="submit" className="admin-login-button" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify MFA'}
              </button>
            </form>
          </>
        )}

        {!mfaChallenge && mode === 'login' && (
          <>
            {error && <div className="admin-error-message">{error}</div>}
            <form className="admin-login-form" onSubmit={handleSubmit}>
              <label className="admin-form-label">
                Email or username
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="admin-form-input"
                  placeholder="Enter your admin email or username"
                  autoComplete="username"
                  required
                />
              </label>

              <label className="admin-form-label">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="admin-form-input"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
              </label>

              <button
                type="submit"
                className="admin-login-button"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </>
        )}

        {!mfaChallenge && mode === 'forgot' && (
          <>
            {forgotError && <div className="admin-error-message">{forgotError}</div>}
            {forgotMessage && <div className="admin-success-message">{forgotMessage}</div>}
            <form className="admin-login-form" onSubmit={handleForgotPassword}>
              <label className="admin-form-label">
                Admin email or username
                <input
                  type="text"
                  value={forgotIdentifier}
                  onChange={(e) => setForgotIdentifier(e.target.value)}
                  className="admin-form-input"
                  placeholder="Enter your admin email or username"
                  autoComplete="username"
                  required
                />
              </label>
              <button type="submit" className="admin-login-button" disabled={isLoading}>
                {isLoading ? 'Sending reset link...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}

        {!mfaChallenge && mode === 'reset' && (
          <>
            {resetError && <div className="admin-error-message">{resetError}</div>}
            {resetMessage && <div className="admin-success-message">{resetMessage}</div>}
            <form className="admin-login-form" onSubmit={handleResetPassword}>
              <div className="admin-success-message">Use at least 10 characters with uppercase, lowercase, number, and symbol.</div>
              <label className="admin-form-label">
                New password
                <input
                  type="password"
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  className="admin-form-input"
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  required
                />
              </label>
              <label className="admin-form-label">
                Confirm password
                <input
                  type="password"
                  value={resetConfirmPassword}
                  onChange={(e) => setResetConfirmPassword(e.target.value)}
                  className="admin-form-input"
                  placeholder="Repeat new password"
                  autoComplete="new-password"
                  required
                />
              </label>
              <button type="submit" className="admin-login-button" disabled={isLoading}>
                {isLoading ? 'Updating password...' : 'Update Password'}
              </button>
            </form>
          </>
        )}

        <div className="admin-login-help">
          <p>Use the same account email and password created on the website. The account must have role <code>admin</code>.</p>
          <p>Need to promote a user to admin? Use the backend script:</p>
          <code>node scripts/promoteAdmin.js &lt;username&gt;</code>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
