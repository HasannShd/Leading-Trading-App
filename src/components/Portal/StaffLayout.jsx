import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useContext, useMemo, useState } from 'react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeItem = useMemo(
    () => navItems.find((item) => location.pathname.startsWith(item.to)) || navItems[0],
    [location.pathname]
  );

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className="portal-shell staff-shell">
      <header className="portal-topbar">
        <div className="portal-brand">
          <span className="portal-brand-kicker">LTE Field Portal</span>
          <span className="portal-brand-title">Sales Staff</span>
        </div>
        <div className="portal-topbar-meta">
          <button
            className="portal-inline-button ghost portal-mobile-menu-button"
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-expanded={mobileMenuOpen}
            aria-controls="staff-mobile-nav"
          >
            {mobileMenuOpen ? 'Close Menu' : `${activeItem.label} Menu`}
          </button>
          <button className="portal-inline-button ghost" type="button" onClick={logout}>
            Sign Out
          </button>
          <span className="portal-chip">{formatPortalPrettyDate()}</span>
        </div>
      </header>
      <div className={`portal-staff-nav-wrap${mobileMenuOpen ? ' open' : ''}`}>
        <div className="portal-content">
          <nav id="staff-mobile-nav" className={`portal-staff-nav${mobileMenuOpen ? ' open' : ''}`}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeMenu}
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
