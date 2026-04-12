import { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import AdminTopNav from './AdminTopNav';
import './AdminCategories.css';
import { authFetch } from '../../services/authFetch';

const AdminAccount = () => {
  const { admin } = useContext(AdminContext);
  const [mfaStatus, setMfaStatus] = useState(null);
  const [setupState, setSetupState] = useState(null);
  const [backupCodes, setBackupCodes] = useState([]);
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadMfaStatus = async () => {
    try {
      const response = await authFetch('/auth/admin/mfa/status', { scope: 'admin' });
      const data = await response.json();
      if (!response.ok) {
        setError(data.err || 'Could not load MFA status.');
        return;
      }
      setMfaStatus(data);
    } catch (err) {
      setError('Could not load MFA status.');
    }
  };

  useEffect(() => {
    loadMfaStatus();
  }, []);

  const startSetup = async () => {
    setError('');
    setMessage('');
    try {
      const response = await authFetch('/auth/admin/mfa/setup/start', { method: 'POST', scope: 'admin' });
      const data = await response.json();
      if (!response.ok) {
        setError(data.err || 'Could not start MFA setup.');
        return;
      }
      setSetupState(data);
      setBackupCodes([]);
    } catch (err) {
      setError('Could not start MFA setup.');
    }
  };

  const confirmSetup = async () => {
    setError('');
    setMessage('');
    try {
      const response = await authFetch('/auth/admin/mfa/setup/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        scope: 'admin',
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.err || 'Could not enable MFA.');
        return;
      }
      setBackupCodes(data.backupCodes || []);
      setSetupState(null);
      setCode('');
      setMessage('MFA enabled. Save the backup codes below.');
      loadMfaStatus();
    } catch (err) {
      setError('Could not enable MFA.');
    }
  };

  const disableMfa = async () => {
    setError('');
    setMessage('');
    try {
      const response = await authFetch('/auth/admin/mfa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        scope: 'admin',
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.err || 'Could not disable MFA.');
        return;
      }
      setCode('');
      setBackupCodes([]);
      setMessage('MFA disabled.');
      loadMfaStatus();
    } catch (err) {
      setError('Could not disable MFA.');
    }
  };

  return (
    <div className="admin-categories">
      <AdminTopNav />
      <div className="admin-page-header">
        <h1>👤 Account</h1>
      </div>
      <div className="admin-categories-list">
        <h2>Admin Profile</h2>
        <p><strong>Username:</strong> {admin?.username}</p>
        <p><strong>Role:</strong> {admin?.role}</p>
        <p><strong>Email:</strong> {admin?.email || '-'}</p>
      </div>

      <div className="admin-categories-list">
        <h2>MFA Security</h2>
        {error && <div className="admin-error">{error}</div>}
        {message && <div className="admin-success">{message}</div>}
        <p><strong>Status:</strong> {mfaStatus?.mfaEnabled ? 'Enabled' : 'Disabled'}</p>
        {mfaStatus?.mfaEnabled && (
          <p><strong>Backup codes remaining:</strong> {mfaStatus.backupCodesRemaining}</p>
        )}

        {!mfaStatus?.mfaEnabled && !setupState && (
          <button className="admin-add-btn" onClick={startSetup}>Start MFA Setup</button>
        )}

        {setupState && (
          <div className="admin-form-container">
            <h2>Set up authenticator app</h2>
            <p>Add this key in Google Authenticator, Microsoft Authenticator, 1Password, or another TOTP app.</p>
            <p><strong>Manual key:</strong> <code>{setupState.manualKey}</code></p>
            <p><strong>OTP URI:</strong> <code>{setupState.otpAuthUrl}</code></p>
            <div className="admin-form-group">
              <label>Enter the 6-digit code from the app</label>
              <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="123456" />
            </div>
            <div className="admin-form-actions">
              <button className="admin-btn-primary" onClick={confirmSetup}>Enable MFA</button>
            </div>
          </div>
        )}

        {mfaStatus?.mfaEnabled && (
          <div className="admin-form-container">
            <h2>Disable MFA</h2>
            <p>Enter a current authenticator code or one backup code to turn MFA off.</p>
            <div className="admin-form-group">
              <label>MFA code</label>
              <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="123456 or backup code" />
            </div>
            <div className="admin-form-actions">
              <button className="admin-btn-primary" onClick={disableMfa}>Disable MFA</button>
            </div>
          </div>
        )}

        {!!backupCodes.length && (
          <div className="admin-form-container">
            <h2>Backup Codes</h2>
            <p>Save these in a secure place. Each code works once.</p>
            <ul>
              {backupCodes.map((entry) => (
                <li key={entry}><code>{entry}</code></li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAccount;
