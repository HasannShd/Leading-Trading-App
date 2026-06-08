import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useContext, useEffect, useMemo, useState } from 'react';
import { StaffContext } from '../../context/StaffContext';
import { portalApi } from '../../services/portalApi';
import { formatPortalPrettyDate } from '../../utils/portalDate';
import { resetPageScroll, schedulePageScrollReset } from '../../utils/scrollReset';
import './PortalShell.css';

const navItems = [
  { to: '/staff/dashboard',      label: 'Dashboard' },
  { to: '/staff/attendance',     label: 'Attendance' },
  { to: '/staff/reports',        label: 'Reports' },
  { to: '/staff/orders',         label: 'New Order' },
  { to: '/staff/order-history',  label: 'My Orders' },
  { to: '/staff/clients',        label: 'Clients' },
  { to: '/staff/visits',         label: 'Visits' },
  { to: '/staff/messages',       label: 'Messages',      badge: true },
  { to: '/staff/notifications',  label: 'Notifications' },
  { to: '/staff/account',        label: 'Account' },
];

const mobileQuickNav = navItems.filter((item) =>
  ['/staff/dashboard', '/staff/attendance', '/staff/orders', '/staff/clients'].includes(item.to)
);

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const toToday = () => new Date().toISOString().slice(0, 10);

const StaffLayout = () => {
  const location = useLocation();
  const { logout, staff } = useContext(StaffContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [todayRecord, setTodayRecord] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const staffName = staff?.name || staff?.username || '';

  const activeItem = useMemo(
    () => navItems.find((item) => location.pathname.startsWith(item.to)) || navItems[0],
    [location.pathname]
  );

  const closeMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    setMobileMenuOpen(false);
    return schedulePageScrollReset();
  }, [location.pathname]);

  // Fetch today's check-in record
  useEffect(() => {
    if (!staff) return;
    let cancelled = false;
    portalApi.get('/staff-portal/attendance', 'sales_staff')
      .then((records) => {
        if (cancelled || !Array.isArray(records)) return;
        const today = toToday();
        setTodayRecord(records.find((r) => r.date === today) || null);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [staff, location.pathname]);

  // Fetch unread message count
  useEffect(() => {
    if (!staff) return;
    let cancelled = false;
    portalApi.get('/staff-portal/messages', 'sales_staff')
      .then((threads) => {
        if (cancelled) return;
        const thread = Array.isArray(threads) ? threads[0] : threads;
        setUnreadMessages(thread?.unreadAdminCount || 0);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [staff, location.pathname]);

  const checkInLabel = useMemo(() => {
    if (!todayRecord) return null;
    if (todayRecord.checkOutTime) return { text: 'Checked out', time: todayRecord.checkOutTime, state: 'out' };
    if (todayRecord.checkInTime)  return { text: 'Checked in',  time: todayRecord.checkInTime,  state: 'in' };
    return null;
  }, [todayRecord]);

  const formatTime = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="portal-shell staff-shell">
      <header className="portal-topbar portal-staff-topbar">
        <div className="portal-brand">
          <span className="portal-brand-kicker">LTE Field Portal</span>
          <span className="portal-brand-title">Sales Staff</span>
        </div>
        <div className="portal-topbar-meta">
          {/* Greeting chip — desktop only */}
          {staffName && (
            <span className="portal-staff-greeting-chip">
              {getGreeting()}, {staffName.split(' ')[0]}
            </span>
          )}
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

      {/* Status hero strip */}
      {checkInLabel && (
        <div className="portal-staff-status-strip">
          <div className="portal-content">
            <div className={`portal-staff-status-hero portal-staff-status-hero--${checkInLabel.state}`}>
              <span className="portal-staff-status-dot" aria-hidden="true" />
              <span className="portal-staff-status-text">{checkInLabel.text}</span>
              <span className="portal-staff-status-time">{formatTime(checkInLabel.time)}</span>
            </div>
          </div>
        </div>
      )}

      <div className={`portal-staff-nav-wrap${mobileMenuOpen ? ' open' : ''}`}>
        <div className="portal-content">
          <nav id="staff-mobile-nav" className={`portal-staff-nav${mobileMenuOpen ? ' open' : ''}`}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => {
                  closeMenu();
                  resetPageScroll();
                }}
                className={({ isActive }) => `portal-staff-link${isActive || location.pathname.startsWith(item.to) ? ' active' : ''}`}
              >
                {item.label}
                {item.badge && unreadMessages > 0 && (
                  <span className="portal-staff-badge" aria-label={`${unreadMessages} unread`}>
                    {unreadMessages > 9 ? '9+' : unreadMessages}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      <div className="portal-content">
        <Outlet />
      </div>

      <div className="portal-mobile-bottom-nav">
        {mobileQuickNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={resetPageScroll}
            className={({ isActive }) => `portal-mobile-bottom-link${isActive || location.pathname.startsWith(item.to) ? ' active' : ''}`}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default StaffLayout;
