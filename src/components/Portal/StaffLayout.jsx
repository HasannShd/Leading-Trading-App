import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { StaffContext } from '../../context/StaffContext';
import './PortalShell.css';

const navItems = [
  { to: '/staff/dashboard', label: 'Home' },
  { to: '/staff/schedule', label: 'Schedule' },
  { to: '/staff/orders', label: 'Orders' },
  { to: '/staff/followups', label: 'Follow-up' },
  { to: '/staff/notifications', label: 'Alerts' },
];

const menuItems = [
  { to: '/staff/dashboard', label: 'Dashboard' },
  { to: '/staff/attendance', label: 'Attendance' },
  { to: '/staff/schedule', label: 'Schedule' },
  { to: '/staff/reports', label: 'Reports' },
  { to: '/staff/orders', label: 'Orders' },
  { to: '/staff/expenses', label: 'Expenses' },
  { to: '/staff/clients', label: 'Clients' },
  { to: '/staff/visits', label: 'Visits' },
  { to: '/staff/followups', label: 'Follow-ups' },
  { to: '/staff/quotations', label: 'Quotations' },
  { to: '/staff/collections', label: 'Collections' },
  { to: '/staff/requests', label: 'Requests' },
  { to: '/staff/demand', label: 'Demand' },
  { to: '/staff/issues', label: 'Issues' },
  { to: '/staff/notifications', label: 'Notifications' },
];

const StaffLayout = () => {
  const location = useLocation();
  const { logout } = useContext(StaffContext);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="portal-shell staff-shell">
      <header className="portal-topbar">
        <div className="portal-brand">
          <span className="portal-brand-kicker">LTE Field Portal</span>
          <span className="portal-brand-title">Sales Staff</span>
        </div>
        <div className="portal-topbar-meta">
          <button className="portal-inline-button ghost" type="button" onClick={() => setMenuOpen((open) => !open)}>
            Menu
          </button>
          <button className="portal-inline-button ghost" type="button" onClick={logout}>
            Sign Out
          </button>
          <span className="portal-chip">{new Date().toLocaleDateString()}</span>
        </div>
      </header>
      {menuOpen && (
        <div className="portal-content">
          <div className="portal-card portal-quick-links">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `portal-quick-link${isActive || location.pathname.startsWith(item.to) ? ' active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
      <div className="portal-content">
        <Outlet />
      </div>
      <nav className="portal-bottom-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `portal-bottom-link${isActive || location.pathname.startsWith(item.to) ? ' active' : ''}`}
          >
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default StaffLayout;
