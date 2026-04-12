import { NavLink, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import './PortalShell.css';

const links = [
  { section: 'Operations' },
  { to: '/admin/dashboard', label: 'Overview' },
  { to: '/admin/staff', label: 'Staff Team' },
  { to: '/admin/attendance', label: 'Attendance' },
  { to: '/admin/schedules', label: 'Schedules' },
  { to: '/admin/reports', label: 'Reports' },
  { to: '/admin/orders', label: 'Staff Orders' },
  { to: '/admin/expenses', label: 'Expenses' },
  { to: '/admin/clients', label: 'Clients' },
  { to: '/admin/visits', label: 'Visits' },
  { to: '/admin/collections', label: 'Collections' },
  { to: '/admin/logs', label: 'Logs' },
  { section: 'Website Control' },
  { to: '/admin/catalog', label: 'Catalog Overview' },
  { to: '/admin/catalog/categories', label: 'Categories' },
  { to: '/admin/catalog/products', label: 'Products' },
  { to: '/admin/catalog/import', label: 'Import' },
  { to: '/admin/site-orders', label: 'Website Orders' },
  { to: '/admin/marketing', label: 'Marketing' },
  { to: '/admin/account', label: 'Account' },
];

const AdminPortalLayout = () => {
  const { logout } = useContext(AdminContext);

  return (
    <div className="portal-shell admin-shell">
      <header className="portal-topbar">
        <div className="portal-brand">
          <span className="portal-brand-kicker">LTE Operations</span>
          <span className="portal-brand-title">Admin Control</span>
        </div>
        <div className="portal-topbar-meta">
          <button className="portal-inline-button ghost" type="button" onClick={logout}>
            Sign Out
          </button>
        </div>
      </header>
      <div className="portal-content portal-admin-layout">
        <aside className="portal-admin-sidebar">
          <div className="portal-card portal-admin-sidebar-card">
            <div className="portal-brand-kicker">Admin Navigation</div>
            <h2 className="portal-section-title" style={{ fontSize: '1.35rem' }}>Everything in one place</h2>
            <p className="portal-section-copy">
              Start with staff operations, then move to website control. Each section below opens a full page with clear actions and recent records.
            </p>
            <nav className="portal-admin-nav">
              {links.map((link) => (
                link.section ? (
                  <div key={link.section} className="portal-admin-nav-section">{link.section}</div>
                ) : (
                  <NavLink key={link.to} to={link.to} className={({ isActive }) => `portal-admin-link${isActive ? ' active' : ''}`}>
                    {link.label}
                  </NavLink>
                )
              ))}
            </nav>
          </div>
        </aside>
        <main className="portal-admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminPortalLayout;
