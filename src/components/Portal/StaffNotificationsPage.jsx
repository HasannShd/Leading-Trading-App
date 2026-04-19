import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { portalApi } from '../../services/portalApi';
import { formatPortalDateTime } from '../../utils/portalDate';
import './PortalShell.css';

const getNotificationTarget = (notification) => {
  if (notification.relatedModule === 'sales_order' && notification.relatedRecord) {
    return `/staff/order-history?focus=${encodeURIComponent(String(notification.relatedRecord))}`;
  }

  if (notification.relatedModule === 'messages') {
    return '/staff/messages';
  }

  if (notification.relatedModule === 'client_visit') {
    return '/staff/visits';
  }

  if (notification.relatedModule === 'client') {
    return '/staff/clients';
  }

  if (notification.relatedModule === 'daily_report') {
    return '/staff/reports';
  }

  return '';
};

const StaffNotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const [busy, setBusy] = useState(false);

  const load = () =>
    portalApi
      .get('/staff-portal/notifications', 'sales_staff')
      .then((response) => setNotifications(response.data.notifications))
      .catch((err) => setMessage(err.message));

  useEffect(() => {
    load();
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  );

  const visibleNotifications = useMemo(() => {
    if (filter === 'unread') return notifications.filter((notification) => !notification.read);
    return notifications;
  }, [filter, notifications]);

  const markRead = async (notificationId) => {
    try {
      setBusy(true);
      await portalApi.patch(`/staff-portal/notifications/${notificationId}/read`, {}, 'sales_staff');
      await load();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  };

  const markAllRead = async () => {
    try {
      setBusy(true);
      setMessage('');
      const response = await portalApi.patch('/staff-portal/notifications/read-all', {}, 'sales_staff');
      setMessage(response.message || 'All notifications marked as read.');
      await load();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  };

  const openNotification = async (notification) => {
    const target = getNotificationTarget(notification);
    try {
      if (!notification.read) {
        await markRead(notification._id);
      }
    } catch (error) {
      // ignore read failure and still try to navigate
    }

    if (target) {
      navigate(target);
    }
  };

  return (
    <section className="portal-page">
      <div className="portal-card dark">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Alerts</div>
            <h1 className="portal-section-title">Staff notifications</h1>
            <p className="portal-section-copy" style={{ color: 'rgba(255,255,255,0.76)' }}>
              Review office replies, order updates, and staff alerts here. Open any notification to jump to the related screen.
            </p>
          </div>
        </div>
        <div className="portal-grid stats" style={{ marginTop: '1rem' }}>
          <div className="portal-stat">
            <div className="portal-stat-value">{notifications.length}</div>
            <div className="portal-stat-label">Recent alerts</div>
          </div>
          <div className="portal-stat">
            <div className="portal-stat-value">{unreadCount}</div>
            <div className="portal-stat-label">Unread</div>
          </div>
        </div>
      </div>

      <div className="portal-card portal-help-card">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Actions</div>
            <h2 className="portal-section-title" style={{ fontSize: '1.4rem' }}>Stay on top of updates</h2>
            <p className="portal-section-copy">
              Use the filter to focus on unread items, open a notification to jump into the related order or message thread, and clear the whole unread list once you are done.
            </p>
          </div>
          <div className="portal-inline-actions">
            <select value={filter} onChange={(e) => setFilter(e.target.value)} disabled={busy}>
              <option value="all">All notifications</option>
              <option value="unread">Unread only</option>
            </select>
            <button
              className="portal-inline-button secondary"
              type="button"
              onClick={markAllRead}
              disabled={busy || !unreadCount}
            >
              Mark All Read
            </button>
          </div>
        </div>
      </div>

      <div className="portal-card">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Notifications</div>
            <h2 className="portal-section-title" style={{ fontSize: '1.8rem' }}>Recent staff alerts</h2>
          </div>
        </div>
        {message && <div className="portal-badge status" style={{ marginTop: '1rem' }}>{message}</div>}
        <div className="portal-record-list" style={{ marginTop: '1rem' }}>
          {visibleNotifications.length ? (
            visibleNotifications.map((notification) => {
              const target = getNotificationTarget(notification);
              return (
                <div className="portal-record-card" key={notification._id}>
                  <h3 className="portal-record-title">{notification.title}</h3>
                  <div className="portal-record-meta">
                    <span>{formatPortalDateTime(notification.createdAt)}</span>
                    <span className="portal-badge status">{notification.read ? 'read' : 'unread'}</span>
                    {notification.relatedModule ? <span>{notification.relatedModule.replace(/_/g, ' ')}</span> : null}
                  </div>
                  <div className="portal-record-copy">{notification.message}</div>
                  <div className="portal-inline-actions" style={{ marginTop: '0.85rem' }}>
                    {!notification.read ? (
                      <button className="portal-inline-button primary" type="button" onClick={() => markRead(notification._id)} disabled={busy}>
                        Mark as Read
                      </button>
                    ) : null}
                    {target ? (
                      <button className="portal-inline-button ghost" type="button" onClick={() => openNotification(notification)} disabled={busy}>
                        Open
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="portal-empty-state">
              <h3 className="portal-empty-title">No notifications right now</h3>
              <p className="portal-empty-copy">
                When the office updates an order or replies in chat, it will appear here automatically.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default StaffNotificationsPage;
