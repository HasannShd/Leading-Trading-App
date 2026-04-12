import { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import AdminTopNav from './AdminTopNav';
import './AdminCategories.css';
import { authFetch } from '../../services/authFetch';
import { formatPortalDateTime } from '../../utils/portalDate';

const AdminAccount = () => {
  const { admin } = useContext(AdminContext);
  const [mfaStatus, setMfaStatus] = useState(null);
  const [setupState, setSetupState] = useState(null);
  const [backupCodes, setBackupCodes] = useState([]);
  const [code, setCode] = useState('');
  const [refreshCode, setRefreshCode] = useState('');
  const [trustThisDevice, setTrustThisDevice] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const qrUrl = setupState?.otpAuthUrl
    ? `https://quickchart.io/qr?text=${encodeURIComponent(setupState.otpAuthUrl)}&size=220`
    : '';

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
        body: JSON.stringify({ code, trustDevice: trustThisDevice }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.err || 'Could not enable MFA.');
        return;
      }
      setBackupCodes(data.backupCodes || []);
      if (data.trustedDeviceToken) {
        localStorage.setItem('adminTrustedDeviceToken', data.trustedDeviceToken);
      }
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

  const refreshRecoveryCodes = async () => {
    setError('');
    setMessage('');
    try {
      const response = await authFetch('/auth/admin/mfa/recovery-codes/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        scope: 'admin',
        body: JSON.stringify({ code: refreshCode }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.err || 'Could not refresh backup codes.');
        return;
      }
      setBackupCodes(data.backupCodes || []);
      setRefreshCode('');
      setMessage('New backup codes generated. Save them now.');
      loadMfaStatus();
    } catch (err) {
      setError('Could not refresh backup codes.');
    }
  };

  const revokeTrustedDevices = async () => {
    setError('');
    setMessage('');
    try {
      const response = await authFetch('/auth/admin/mfa/trusted-devices', {
        method: 'DELETE',
        scope: 'admin',
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.err || 'Could not revoke trusted devices.');
        return;
      }
      localStorage.removeItem('adminTrustedDeviceToken');
      setMessage(data.message || 'Trusted devices removed.');
      loadMfaStatus();
    } catch (err) {
      setError('Could not revoke trusted devices.');
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
        {mfaStatus && (
          <div className="admin-category-grid" style={{ marginTop: '16px' }}>
            <div className="admin-category-tile" style={{ cursor: 'default' }}>
              <span>🛡️</span>
              <div>
                <strong>MFA</strong>
                <div>{mfaStatus.mfaEnabled ? 'Protected' : 'Needs setup'}</div>
              </div>
            </div>
            <div className="admin-category-tile" style={{ cursor: 'default' }}>
              <span>⏱️</span>
              <div>
                <strong>Admin session</strong>
                <div>{mfaStatus.adminSessionTtl || '8h'}</div>
              </div>
            </div>
            <div className="admin-category-tile" style={{ cursor: 'default' }}>
              <span>🔐</span>
              <div>
                <strong>Password updated</strong>
                <div>{mfaStatus.passwordChangedAt ? formatPortalDateTime(mfaStatus.passwordChangedAt) : 'Unknown'}</div>
              </div>
            </div>
            <div className="admin-category-tile" style={{ cursor: 'default' }}>
              <span>✉️</span>
              <div>
                <strong>Reset email</strong>
                <div>{mfaStatus.smtpConfigured ? 'Configured' : 'Missing SMTP'}</div>
              </div>
            </div>
            <div className="admin-category-tile" style={{ cursor: 'default' }}>
              <span>📱</span>
              <div>
                <strong>Trusted devices</strong>
                <div>{mfaStatus.trustedDevices?.length || 0} active</div>
              </div>
            </div>
          </div>
        )}
        {!!mfaStatus?.recommendedActions?.length && (
          <div className="admin-form-container">
            <h2>Recommended Security Actions</h2>
            <ul>
              {mfaStatus.recommendedActions.map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>
          </div>
        )}

        {!mfaStatus?.mfaEnabled && !setupState && (
          <button className="admin-add-btn" onClick={startSetup}>Start MFA Setup</button>
        )}

        {setupState && (
          <div className="admin-form-container">
            <h2>Set up authenticator app</h2>
            <p>Add this key in Google Authenticator, Microsoft Authenticator, 1Password, or another TOTP app.</p>
            {qrUrl && (
              <div style={{ marginBottom: '16px' }}>
                <img src={qrUrl} alt="MFA QR code" style={{ width: '220px', maxWidth: '100%', borderRadius: '18px', border: '1px solid rgba(23,48,77,0.12)', background: '#fff', padding: '12px' }} />
              </div>
            )}
            <p><strong>Manual key:</strong> <code>{setupState.manualKey}</code></p>
            <p><strong>OTP URI:</strong> <code>{setupState.otpAuthUrl}</code></p>
            <div className="admin-form-group">
              <label>Enter the 6-digit code from the app</label>
              <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="123456" />
            </div>
            <div className="admin-form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input type="checkbox" checked={trustThisDevice} onChange={(e) => setTrustThisDevice(e.target.checked)} />
                Trust this device for 30 days after setup
              </label>
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

        {mfaStatus?.mfaEnabled && (
          <div className="admin-form-container">
            <h2>Recovery and Trusted Devices</h2>
            <p>Backup codes help if your phone is unavailable. Trusted devices can sign in without asking for the OTP each time for 30 days.</p>
            <div className="admin-form-group">
              <label>Enter current MFA code to generate new backup codes</label>
              <input type="text" value={refreshCode} onChange={(e) => setRefreshCode(e.target.value)} placeholder="123456" />
            </div>
            <div className="admin-form-actions">
              <button className="admin-btn-primary" onClick={refreshRecoveryCodes}>Generate New Backup Codes</button>
              <button className="admin-btn-secondary" onClick={revokeTrustedDevices}>Remove Trusted Devices</button>
            </div>
            {!!mfaStatus?.trustedDevices?.length && (
              <div style={{ marginTop: '1rem' }}>
                <strong>Trusted devices</strong>
                <ul>
                  {mfaStatus.trustedDevices.map((entry, index) => (
                    <li key={`${entry.label}-${entry.expiresAt}-${index}`}>
                      {entry.label} | Last used {entry.lastUsedAt ? formatPortalDateTime(entry.lastUsedAt) : 'Unknown'} | Expires {entry.expiresAt ? formatPortalDateTime(entry.expiresAt) : 'Unknown'}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAccount;
