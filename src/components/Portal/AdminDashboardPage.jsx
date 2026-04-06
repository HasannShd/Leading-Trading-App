import { useEffect, useState } from 'react';
import { portalApi } from '../../services/portalApi';
import './PortalShell.css';

const AdminDashboardPage = () => {
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

  return (
    <section className="portal-page">
      <div className="portal-card dark">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Operations Summary</div>
            <h1 className="portal-section-title">Admin Dashboard</h1>
            <p className="portal-section-copy" style={{ color: 'rgba(255,255,255,0.76)' }}>
              Cross-team visibility across attendance, field activity, requests, orders, and approvals.
            </p>
          </div>
        </div>
        <div className="portal-grid stats" style={{ marginTop: '1rem' }}>
          {[
            ['Checked In Today', metrics.checkedInToday],
            ['Not Checked In', metrics.notCheckedIn],
            ['Pending Expenses', metrics.pendingExpenses],
            ['Pending Orders', metrics.pendingOrders],
            ['Due Follow-Ups', metrics.dueFollowUps],
            ['Field Staff', metrics.staffCount],
          ].map(([label, value]) => (
            <div className="portal-stat" key={label}>
              <div className="portal-stat-value">{value ?? 0}</div>
              <div className="portal-stat-label">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="portal-card">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Latest Activity</div>
            <h2 className="portal-section-title" style={{ fontSize: '1.5rem' }}>Audit snapshot</h2>
          </div>
        </div>
        <div className="portal-record-list" style={{ marginTop: '1rem' }}>
          {(data.recentActivity || []).map((item) => (
            <div className="portal-record-card" key={item._id}>
              <h3 className="portal-record-title">{item.action}</h3>
              <div className="portal-record-meta">
                <span>{item.user?.name || item.user?.username || '-'}</span>
                <span>{item.module}</span>
                <span>{new Date(item.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminDashboardPage;
