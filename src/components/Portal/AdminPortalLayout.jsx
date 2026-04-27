import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useContext, useEffect, useMemo, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { resetPageScroll, schedulePageScrollReset } from '../../utils/scrollReset';
import './PortalShell.css';

const linkGroups = [
  {
    section: 'Staff Operations',
    items: [
      { to: '/admin/dashboard', label: 'Overview', icon: '⌂' },
      { to: '/admin/staff', label: 'Staff Team', icon: '◉' },
      { to: '/admin/messages', label: 'Messages', icon: '✉' },
      { to: '/admin/attendance', label: 'Attendance', icon: '◌' },
      { to: '/admin/reports', label: 'Reports', icon: '▤' },
      { to: '/admin/orders', label: 'Staff Orders', icon: '▣' },
      { to: '/admin/clients', label: 'Clients', icon: '◎' },
      { to: '/admin/visits', label: 'Visits', icon: '◍' },
      { to: '/admin/logs', label: 'Logs', icon: '⋯' },
    ],
  },
  {
    section: 'Website Control',
    items: [
      { to: '/admin/website', label: 'Website', icon: '◫' },
      { to: '/admin/catalog', label: 'Catalog', icon: '◫' },
      { to: '/admin/catalog/categories', label: 'Categories', icon: '□' },
      { to: '/admin/catalog/products', label: 'Products', icon: '◇' },
      { to: '/admin/catalog/import', label: 'Import', icon: '↥' },
      { to: '/admin/site-orders', label: 'Website Orders', icon: '▥' },
      { to: '/admin/marketing', label: 'Marketing', icon: '✦' },
      { to: '/admin/account', label: 'Account', icon: '⚙' },
    ],
  },
];

const mobileQuickLinks = [
  { to: '/admin/dashboard', label: 'Home', icon: '⌂' },
  { to: '/admin/staff', label: 'Staff', icon: '◉' },
  { to: '/admin/messages', label: 'Messages', icon: '✉' },
  { to: '/admin/orders', label: 'Orders', icon: '▣' },
  { to: '/admin/account', label: 'Account', icon: '⚙' },
];

const getNavBreadcrumb = (pathname) => {
  let best = null;
  for (const group of linkGroups) {
    for (const item of group.items) {
      if (pathname === item.to || pathname.startsWith(item.to + '/')) {
        if (!best || item.to.length > best.item.to.length) {
          best = { group, item };
        }
      }
    }
  }
  return best ? { section: best.group.section, label: best.item.label } : null;
};

const getInitials = (name) =>
  String(name || 'Admin')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'AD';

const AdminPortalLayout = () => {
  const { admin, logout } = useContext(AdminContext);
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);
  const adminDisplayName = admin?.name || admin?.username || 'Admin';
  const initials = useMemo(() => getInitials(adminDisplayName), [adminDisplayName]);
  const breadcrumb = useMemo(() => getNavBreadcrumb(location.pathname), [location.pathname]);
  const todayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }).format(new Date()),
    []
  );

  useEffect(() => {
    setNavOpen(false);
    return schedulePageScrollReset();
  }, [location.pathname]);

  return (
    <div className="portal-shell admin-shell">
      <header className="portal-topbar portal-admin-topbar">
        <div className="portal-brand portal-admin-brand">
          <span className="portal-brand-kicker">LTE Operations</span>
          <span className="portal-brand-title">Admin Control</span>
          <span className="portal-admin-date">{todayLabel}</span>
        </div>
        <div className="portal-topbar-meta portal-admin-topbar-meta">
          <span className="portal-chip admin-user-chip">
            <span className="admin-avatar" aria-hidden="true">{initials}</span>
            {adminDisplayName}
          </span>
          <button className="portal-inline-button ghost" type="button" onClick={logout}>
            Sign Out
          </button>
          <button
            className="portal-mobile-menu-button portal-inline-button ghost"
            type="button"
            onClick={() => setNavOpen((current) => !current)}
            aria-label={navOpen ? 'Close admin navigation' : 'Open admin navigation'}
          >
            {navOpen ? '×' : '☰'}
          </button>
        </div>
      </header>
      <div className="portal-content portal-admin-app-shell">
        <aside className={`portal-admin-sidebar${navOpen ? ' open' : ''}`}>
          <div className="portal-card portal-admin-sidebar-card">
            <div className="portal-admin-sidebar-header">
              <div>
                <div className="portal-brand-kicker">Office Console</div>
                <h2 className="portal-section-title portal-admin-nav-title">Everything in one place</h2>
                <p className="portal-section-copy portal-admin-nav-copy">
                  Keep staff control, website operations, and account settings inside one admin workspace.
                </p>
              </div>
              <div className="portal-admin-status-pill">Live</div>
            </div>
            {linkGroups.map((group) => (
              <div key={group.section} className="portal-admin-nav-group">
                <div className="portal-admin-nav-section">{group.section}</div>
                <nav className="portal-admin-nav">
                  {group.items.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={resetPageScroll}
                      className={({ isActive }) => `portal-admin-link${isActive ? ' active' : ''}`}
                    >
                      <span className="portal-admin-link-icon" aria-hidden="true">{link.icon}</span>
                      <span>{link.label}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </aside>
        <main className="portal-admin-main">
          {breadcrumb && (
            <nav className="portal-admin-breadcrumb" aria-label="breadcrumb">
              <span>{breadcrumb.section}</span>
              <span className="portal-admin-breadcrumb-sep" aria-hidden="true">›</span>
              <span className="portal-admin-breadcrumb-page">{breadcrumb.label}</span>
            </nav>
          )}
          <Outlet />
        </main>
      </div>
      <div className="portal-mobile-bottom-nav admin-mobile-bottom-nav">
        {mobileQuickLinks.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={resetPageScroll}
            className={({ isActive }) => `portal-mobile-bottom-link${isActive || location.pathname.startsWith(item.to) ? ' active' : ''}`}
          >
            <span className="portal-mobile-bottom-icon" aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default AdminPortalLayout;
