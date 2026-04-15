import { useContext, useEffect, useState } from 'react';
import { StaffContext } from '../../context/StaffContext';
import { authFetch } from '../../services/authFetch';
import { formatPortalDateTime } from '../../utils/portalDate';
import { isPushSupported, registerStaffPush, unregisterStaffPush } from '../../utils/pushNotifications';
import './PortalShell.css';

const StaffAccount = () => {
  const { staff } = useContext(StaffContext);
  const [pushStatus, setPushStatus] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadStatus = async () => {
    try {
      const response = await authFetch('/auth/staff/push/status', { scope: 'sales_staff' });
      const data = await response.json();
      if (!response.ok) {
        setError(data.err || 'Could not load staff push status.');
        return;
      }
      setPushStatus(data);
    } catch (err) {
      setError('Could not load staff push status.');
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const enablePushNotifications = async () => {
    const token = localStorage.getItem('staffToken');
    if (!token) {
      setError('Staff session expired. Please sign in again.');
      return;
    }
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await registerStaffPush(token);
      setMessage('Staff push notifications enabled on this device.');
      await loadStatus();
    } catch (err) {
      setError(err.message || 'Could not enable staff push notifications.');
    } finally {
      setBusy(false);
    }
  };

  const sendTestPushNotification = async () => {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const response = await authFetch('/auth/staff/push/test', {
        method: 'POST',
        scope: 'sales_staff',
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.err || 'Could not send a test notification.');
        return;
      }
      setMessage(data.message || 'Test notification sent.');
    } catch (err) {
      setError(err.message || 'Could not send a test notification.');
    } finally {
      setBusy(false);
    }
  };

  const disablePushNotifications = async (endpoint) => {
    const token = localStorage.getItem('staffToken');
    if (!token) {
      setError('Staff session expired. Please sign in again.');
      return;
    }
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await unregisterStaffPush(token, endpoint);
      setMessage('Staff push notifications disabled for this device.');
      await loadStatus();
    } catch (err) {
      setError(err.message || 'Could not disable staff push notifications.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="portal-page">
      <div className="portal-card dark">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Account</div>
            <h1 className="portal-section-title">Staff profile and mobile alerts</h1>
            <p className="portal-section-copy" style={{ color: 'rgba(255,255,255,0.76)' }}>
              Manage staff web push notifications so order updates and office replies reach your phone directly from the website.
            </p>
          </div>
        </div>
        <div className="portal-grid stats" style={{ marginTop: '1rem' }}>
          <div className="portal-stat">
            <div className="portal-stat-value">{staff?.name || staff?.username || '-'}</div>
            <div className="portal-stat-label">Signed-in staff account</div>
          </div>
          <div className="portal-stat">
            <div className="portal-stat-value">{pushStatus?.pushConfigured ? 'Ready' : 'Missing'}</div>
            <div className="portal-stat-label">Server push config</div>
          </div>
          <div className="portal-stat">
            <div className="portal-stat-value">{pushStatus?.pushSubscriptions?.length || 0}</div>
            <div className="portal-stat-label">Push devices</div>
          </div>
          <div className="portal-stat">
            <div className="portal-stat-value">{pushStatus?.pushSessionTtl || '7d'}</div>
            <div className="portal-stat-label">Staff session window</div>
          </div>
        </div>
      </div>

      <div className="portal-card">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Profile</div>
            <h2 className="portal-section-title" style={{ fontSize: '1.45rem' }}>Account details</h2>
          </div>
        </div>
        <div className="admin-profile-list">
          <div className="admin-profile-row"><span>Name</span><strong>{staff?.name || '-'}</strong></div>
          <div className="admin-profile-row"><span>Username</span><strong>{staff?.username || '-'}</strong></div>
          <div className="admin-profile-row"><span>Email</span><strong>{staff?.email || '-'}</strong></div>
          <div className="admin-profile-row"><span>Department</span><strong>{staff?.department || '-'}</strong></div>
        </div>
      </div>

      <div className="portal-card">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Push alerts</div>
            <h2 className="portal-section-title" style={{ fontSize: '1.45rem' }}>Mobile and browser notifications</h2>
            <p className="portal-section-copy">
              Enable push on this device to receive office replies and sales order status updates from the staff portal.
            </p>
          </div>
        </div>

        {error ? <div className="portal-message-banner">{error}</div> : null}
        {message ? <div className="portal-message-banner success">{message}</div> : null}

        <div className="admin-profile-list">
          <div className="admin-profile-row"><span>Server push status</span><strong>{pushStatus?.pushConfigured ? 'Configured' : 'Not configured'}</strong></div>
          <div className="admin-profile-row"><span>Browser support</span><strong>{isPushSupported() ? 'Supported on this device' : 'Not supported in this browser'}</strong></div>
          <div className="admin-profile-row"><span>Push devices</span><strong>{pushStatus?.pushSubscriptions?.length || 0} active</strong></div>
        </div>

        <div className="portal-inline-actions" style={{ marginTop: '1rem' }}>
          <button
            className="portal-inline-button primary"
            type="button"
            onClick={enablePushNotifications}
            disabled={busy || !pushStatus?.pushConfigured || !isPushSupported()}
          >
            {busy ? 'Saving...' : 'Enable Push on This Device'}
          </button>
          <button
            className="portal-inline-button ghost"
            type="button"
            onClick={sendTestPushNotification}
            disabled={busy || !pushStatus?.pushConfigured || !pushStatus?.pushSubscriptions?.length}
          >
            Send Test Notification
          </button>
        </div>

        {!!pushStatus?.pushSubscriptions?.length && (
          <div style={{ marginTop: '1rem' }}>
            <h3 className="portal-section-title" style={{ fontSize: '1.1rem' }}>Active push devices</h3>
            <div className="admin-profile-list">
              {pushStatus.pushSubscriptions.map((entry) => (
                <div className="admin-profile-row" key={entry.endpoint}>
                  <span>
                    {entry.label || 'Browser device'}
                    {entry.lastUsedAt ? ` • ${formatPortalDateTime(entry.lastUsedAt)}` : ''}
                  </span>
                  <button
                    type="button"
                    className="portal-inline-button ghost"
                    onClick={() => disablePushNotifications(entry.endpoint)}
                    disabled={busy}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default StaffAccount;
