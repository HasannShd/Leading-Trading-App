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

  const websiteLinks = [
    { label: 'Categories', to: '/admin/catalog/categories', meta: 'Structure catalog', icon: '□' },
    { label: 'Products', to: '/admin/catalog/products', meta: 'Manage stock list', icon: '◇' },
    { label: 'Import', to: '/admin/catalog/import', meta: 'Bulk upload', icon: '↥' },
    { label: 'Website Orders', to: '/admin/site-orders', meta: 'Customer orders', icon: '▥' },
    { label: 'Marketing', to: '/admin/marketing', meta: 'Lead contacts', icon: '✦' },
    { label: 'Account', to: '/admin/account', meta: 'Security + profile', icon: '⚙' },
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
            Watch the team, review work coming in, and move into the catalog or customer side without leaving this panel.
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

      <div className="portal-card portal-admin-tile-section">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Website Control</div>
            <h2 className="portal-section-title portal-admin-panel-title">Catalog and site tools</h2>
            <p className="portal-section-copy">
              Switch from team operations into products, categories, imports, website orders, and marketing without leaving the panel.
            </p>
          </div>
        </div>
        <div className="portal-admin-module-grid website">
          {websiteLinks.map((item) => (
            <Link key={item.to} to={item.to} className="portal-admin-module-card soft" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="portal-admin-module-icon" aria-hidden="true">{item.icon}</div>
              <div className="portal-admin-module-copy">
                <strong>{item.label}</strong>
                <span>{item.meta}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="portal-admin-lower-grid">
        <div className="portal-card portal-admin-activity-panel">
          <div className="portal-section-head">
            <div>
              <div className="portal-brand-kicker">Latest Activity</div>
              <h2 className="portal-section-title portal-admin-panel-title">Audit snapshot</h2>
            </div>
          </div>
          {data.recentActivity?.length ? (
            <div className="portal-record-list portal-admin-activity-list">
              {data.recentActivity.slice(0, 5).map((item) => (
                <div className="portal-record-card portal-admin-activity-row" key={item._id}>
                  <div className="portal-admin-activity-main">
                    <h3 className="portal-record-title">{item.action}</h3>
                    <div className="portal-record-meta">
                      <span>{item.user?.name || item.user?.username || '-'}</span>
                      <span>{item.module}</span>
                    </div>
                  </div>
                  <span className="portal-admin-activity-time">{new Date(item.createdAt).toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="portal-section-copy">
              No staff activity has been logged yet. Create staff users, review attendance, or open the website control tools above.
            </p>
          )}
        </div>

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
