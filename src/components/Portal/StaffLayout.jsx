import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { StaffContext } from '../../context/StaffContext';
import { formatPortalPrettyDate } from '../../utils/portalDate';
import './PortalShell.css';

const navItems = [
  { to: '/staff/dashboard', label: 'Dashboard' },
  { to: '/staff/attendance', label: 'Attendance' },
  { to: '/staff/reports', label: 'Reports' },
  { to: '/staff/orders', label: 'Orders' },
  { to: '/staff/clients', label: 'Clients' },
  { to: '/staff/visits', label: 'Visits' },
  { to: '/staff/notifications', label: 'Notifications' },
];

const StaffLayout = () => {
  const location = useLocation();
  const { logout } = useContext(StaffContext);

  return (
    <div className="portal-shell staff-shell">
      <header className="portal-topbar">
        <div className="portal-brand">
          <span className="portal-brand-kicker">LTE Field Portal</span>
          <span className="portal-brand-title">Sales Staff</span>
        </div>
        <div className="portal-topbar-meta">
          <button className="portal-inline-button ghost" type="button" onClick={logout}>
            Sign Out
          </button>
          <span className="portal-chip">{formatPortalPrettyDate()}</span>
        </div>
      </header>
      <div className="portal-staff-nav-wrap">
        <div className="portal-content">
          <nav className="portal-staff-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `portal-staff-link${isActive || location.pathname.startsWith(item.to) ? ' active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
      <div className="portal-content">
        <Outlet />
      </div>
    </div>
  );
};

export default StaffLayout;
