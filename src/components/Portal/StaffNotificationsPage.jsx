import { useEffect, useState } from 'react';
import { portalApi } from '../../services/portalApi';
import './PortalShell.css';

const StaffNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState('');

  const load = () =>
    portalApi
      .get('/staff-portal/notifications', 'sales_staff')
      .then((response) => setNotifications(response.data.notifications))
      .catch((err) => setMessage(err.message));

  useEffect(() => {
    load();
  }, []);

  const markRead = async (notificationId) => {
    try {
      await portalApi.patch(`/staff-portal/notifications/${notificationId}/read`, {}, 'sales_staff');
      load();
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <section className="portal-page">
      <div className="portal-card portal-help-card">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Alerts</div>
            <h2 className="portal-section-title" style={{ fontSize: '1.4rem' }}>Read your office updates here</h2>
            <p className="portal-section-copy">
              This page shows reminders, schedule updates, status changes, and office updates. Open this page regularly and press <strong>Mark as Read</strong> after you have seen the message.
            </p>
          </div>
        </div>
      </div>
      <div className="portal-card">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Notifications</div>
            <h1 className="portal-section-title" style={{ fontSize: '1.8rem' }}>Staff Alerts</h1>
          </div>
        </div>
        {message && <div className="portal-badge status" style={{ marginTop: '1rem' }}>{message}</div>}
        <div className="portal-record-list" style={{ marginTop: '1rem' }}>
          {notifications.length ? (
            notifications.map((notification) => (
              <div className="portal-record-card" key={notification._id}>
                <h3 className="portal-record-title">{notification.title}</h3>
                <div className="portal-record-meta">
                  <span>{notification.message}</span>
                  <span>{new Date(notification.createdAt).toLocaleString()}</span>
                  <span className="portal-badge status">{notification.read ? 'read' : 'unread'}</span>
                </div>
                {!notification.read && (
                  <button className="portal-inline-button primary" type="button" onClick={() => markRead(notification._id)}>
                    Mark as Read
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="portal-empty-state">
              <h3 className="portal-empty-title">No notifications right now</h3>
              <p className="portal-empty-copy">
                When the office assigns a schedule, changes a status, or sends a reminder, it will appear here automatically.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default StaffNotificationsPage;
