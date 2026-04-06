import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { portalApi } from '../../services/portalApi';
import './PortalShell.css';

const quickLinks = [
  { to: '/staff/attendance', label: 'Check In / Out' },
  { to: '/staff/reports', label: 'Submit Report' },
  { to: '/staff/orders', label: 'Submit Order' },
  { to: '/staff/expenses', label: 'Submit Expense' },
  { to: '/staff/visits', label: 'Log Visit' },
  { to: '/staff/followups', label: 'View Follow-ups' },
];

const StaffDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    portalApi
      .get('/staff-portal/dashboard', 'sales_staff')
      .then((response) => setData(response.data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="portal-card">{error}</div>;
  if (!data) return <div className="portal-loading">Loading dashboard...</div>;

  return (
    <section className="portal-page">
      <div className="portal-card dark">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Field Summary</div>
            <h1 className="portal-section-title">Welcome back{data.user?.name ? `, ${data.user.name}` : ''}</h1>
            <p className="portal-section-copy" style={{ color: 'rgba(255,255,255,0.76)' }}>
              Today is {data.today}. Keep check-ins, schedules, visits, orders, and follow-ups moving from one mobile workspace.
            </p>
          </div>
        </div>
        <div className="portal-grid stats" style={{ marginTop: '1rem' }}>
          <div className="portal-stat">
            <div className="portal-stat-value">{data.attendanceStatus?.checkedIn ? 'Checked In' : 'Not In'}</div>
            <div className="portal-stat-label">
              {data.attendanceStatus?.checkInTime ? new Date(data.attendanceStatus.checkInTime).toLocaleString() : 'Attendance today'}
            </div>
          </div>
          <div className="portal-stat">
            <div className="portal-stat-value">{data.quickStats.pendingFollowUps}</div>
            <div className="portal-stat-label">Pending follow-ups</div>
          </div>
          <div className="portal-stat">
            <div className="portal-stat-value">{data.quickStats.unreadNotifications}</div>
            <div className="portal-stat-label">Unread notifications</div>
          </div>
          <div className="portal-stat">
            <div className="portal-stat-value">{data.schedules.length}</div>
            <div className="portal-stat-label">Schedule items today</div>
          </div>
        </div>
        <div className="portal-actions" style={{ marginTop: '1rem' }}>
          <Link className="portal-button primary" to="/staff/attendance">
            {data.attendanceStatus?.checkedOut ? 'Attendance Complete' : data.attendanceStatus?.checkedIn ? 'Open Check Out' : 'Open Check In'}
          </Link>
          <Link className="portal-button ghost" to="/staff/schedule">
            View Today&apos;s Schedule
          </Link>
        </div>
      </div>

      <div className="portal-actions">
        {quickLinks.map((link) => (
          <Link key={link.to} className="portal-button ghost" to={link.to}>
            {link.label}
          </Link>
        ))}
      </div>

      <div className="portal-card">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Today</div>
            <h2 className="portal-section-title" style={{ fontSize: '1.5rem' }}>Schedule</h2>
          </div>
        </div>
        <div className="portal-record-list" style={{ marginTop: '1rem' }}>
          {data.schedules.length ? (
            data.schedules.map((item) => (
              <div className="portal-record-card" key={item._id}>
                <h3 className="portal-record-title">{item.title}</h3>
                <div className="portal-record-meta">
                  <span>{item.assignedDate}</span>
                  {item.startTime && <span>{item.startTime}</span>}
                  {item.location && <span>{item.location}</span>}
                </div>
                <span className="portal-badge status">{item.status}</span>
              </div>
            ))
          ) : (
            <div className="portal-record-card">No schedule items assigned for today.</div>
          )}
        </div>
      </div>

      <div className="portal-card">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Activity</div>
            <h2 className="portal-section-title" style={{ fontSize: '1.5rem' }}>Recent history</h2>
          </div>
        </div>
        <div className="portal-record-list" style={{ marginTop: '1rem' }}>
          {data.recentActivity.length ? (
            data.recentActivity.map((item) => (
              <div className="portal-record-card" key={`${item.label}-${item.id}`}>
                <h3 className="portal-record-title">{item.label}</h3>
                <div className="portal-record-meta">
                  <span>{new Date(item.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="portal-record-card">No recent activity yet.</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default StaffDashboard;
