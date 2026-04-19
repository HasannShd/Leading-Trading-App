import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { portalApi } from '../../services/portalApi';
import { AdminContext } from '../../context/AdminContext';
import './PortalShell.css';

const AdminDashboardPage = () => {
  const { admin } = useContext(AdminContext);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    portalApi
      .get('/admin-portal/dashboard', 'admin')
      .then((response) => setData(response.data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="portal-card">{error}</div>;
  if (!data) return <div className="portal-loading">Loading admin dashboard...</div>;

  const metrics = data.metrics || {};
  const adminName = admin?.name || admin?.username || 'Admin';
  const operationsLinks = [
    { label: 'Staff Team', to: '/admin/staff', meta: `${metrics.staffCount ?? 0} active`, icon: '◉' },
    { label: 'Attendance', to: '/admin/attendance', meta: `${metrics.checkedInToday ?? 0} checked in`, icon: '◌' },
    { label: 'Reports', to: '/admin/reports', meta: `${metrics.pendingReports ?? 0} pending`, icon: '▤' },
    { label: 'Staff Orders', to: '/admin/orders', meta: `${metrics.pendingOrders ?? 0} pending`, icon: '▣' },
    { label: 'Clients', to: '/admin/clients', meta: 'Shared list', icon: '◎' },
    { label: 'Visits', to: '/admin/visits', meta: 'Field records', icon: '◍' },
  ];

  const snapshotMetrics = [
    ['Staff Ready', metrics.checkedInToday ?? 0],
    ['Open Orders', metrics.pendingOrders ?? 0],
    ['Pending Reports', metrics.pendingReports ?? 0],
    ['Team Size', metrics.staffCount ?? 0],
  ];

  return (
    <section className="portal-page portal-admin-dashboard">
      <div className="portal-card portal-admin-hero">
        <div className="portal-admin-hero-copy-wrap">
          <div className="portal-brand-kicker">Office Command Center</div>
          <h1 className="portal-section-title">Hi, {adminName}</h1>
          <p className="portal-section-copy portal-admin-hero-copy">
            Watch the team, review incoming work, and stay focused on staff operations from one smaller command view.
          </p>
          <div className="portal-admin-hero-pills">
            <span className="portal-admin-hero-pill">Daily control</span>
            <span className="portal-admin-hero-pill soft">Smooth on laptop and phone</span>
          </div>
        </div>
        <div className="portal-admin-snapshot-grid">
          {snapshotMetrics.map(([label, value]) => (
            <div className="portal-admin-snapshot-card" key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="portal-card portal-admin-tile-section">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Staff Operations</div>
            <h2 className="portal-section-title portal-admin-panel-title">Open a team workspace</h2>
            <p className="portal-section-copy">
              Start with staff control, then move into attendance, reports, visits, and orders as the team submits work.
            </p>
          </div>
        </div>
        <div className="portal-admin-module-grid operations">
          {operationsLinks.map((item) => (
            <Link key={item.to} to={item.to} className="portal-admin-module-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="portal-admin-module-icon" aria-hidden="true">{item.icon}</div>
              <div className="portal-admin-module-copy">
                <strong>{item.label}</strong>
                <span>{item.meta}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="portal-admin-lower-grid focus-only">
        <div className="portal-card portal-admin-focus-panel">
          <div className="portal-brand-kicker">Today’s Focus</div>
          <h2 className="portal-section-title portal-admin-panel-title">Keep the day moving</h2>
          <div className="portal-admin-focus-list">
            <div className="portal-admin-focus-row">
              <strong>{metrics.checkedInToday ?? 0}</strong>
              <span>Staff checked in and ready for field work.</span>
            </div>
            <div className="portal-admin-focus-row">
              <strong>{metrics.pendingOrders ?? 0}</strong>
              <span>Staff orders still need review or follow-up.</span>
            </div>
            <div className="portal-admin-focus-row">
              <strong>{metrics.pendingReports ?? 0}</strong>
              <span>Daily reports are waiting for office review.</span>
            </div>
            <div className="portal-admin-focus-row">
              <strong>{metrics.notCheckedIn ?? 0}</strong>
              <span>Team members have not checked in yet today.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboardPage;
