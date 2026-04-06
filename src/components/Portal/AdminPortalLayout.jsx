import { NavLink, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import './PortalShell.css';

const links = [
  { section: 'Operations' },
  { to: '/admin/dashboard', label: 'Overview' },
  { to: '/admin/staff', label: 'Staff' },
  { to: '/admin/attendance', label: 'Attendance' },
  { to: '/admin/schedules', label: 'Schedules' },
  { to: '/admin/reports', label: 'Reports' },
  { to: '/admin/orders', label: 'Staff Orders' },
  { to: '/admin/expenses', label: 'Expenses' },
  { to: '/admin/clients', label: 'Clients' },
  { to: '/admin/visits', label: 'Visits' },
  { to: '/admin/followups', label: 'Follow-ups' },
  { to: '/admin/quotations', label: 'Quotations' },
  { to: '/admin/collections', label: 'Collections' },
  { to: '/admin/requests', label: 'Requests' },
  { to: '/admin/demand', label: 'Demand' },
  { to: '/admin/issues', label: 'Issues' },
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
      <div className="portal-content portal-page">
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
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPortalLayout;
