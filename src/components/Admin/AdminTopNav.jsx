import { NavLink, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { getAdminPaths } from './adminPaths';
import './AdminTopNav.css';

const AdminTopNav = () => {
  const { admin } = useContext(AdminContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isVisibleAdminRoute = location.pathname.startsWith('/admin');
  const paths = getAdminPaths(isVisibleAdminRoute);
  const navGroups = isVisibleAdminRoute
    ? [
        {
          label: 'Staff Operations',
          links: [
            { to: paths.dashboard, label: 'Overview' },
            { to: '/admin/staff', label: 'Staff' },
            { to: '/admin/attendance', label: 'Attendance' },
            { to: '/admin/reports', label: 'Reports' },
            { to: '/admin/orders', label: 'Staff Orders' },
            { to: '/admin/clients', label: 'Clients' },
            { to: '/admin/visits', label: 'Visits' },
            { to: '/admin/messages', label: 'Messages' },
            { to: '/admin/logs', label: 'Logs' },
          ],
        },
        {
          label: 'Website Control',
          links: [
            { to: paths.categories, label: 'Categories' },
            { to: paths.products, label: 'Products' },
            { to: paths.import, label: 'Import' },
            { to: paths.siteOrders, label: 'Website Orders' },
            { to: paths.marketing, label: 'Marketing' },
            { to: paths.account, label: 'Account' },
          ],
        },
      ]
    : [
        {
          label: 'Website Control',
          links: [
            { to: paths.dashboard, label: 'Overview' },
            { to: paths.categories, label: 'Categories' },
            { to: paths.products, label: 'Products' },
            { to: paths.import, label: 'Import' },
            { to: paths.siteOrders, label: 'Orders' },
            { to: paths.marketing, label: 'Marketing' },
            { to: paths.account, label: 'Account' },
          ],
        },
      ];

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  return (
    <div className={`admin-topnav${mobileOpen ? ' is-open' : ''}`}>
      <div className="admin-topnav-left">
        <NavLink to={paths.dashboard} className="admin-topnav-logo" onClick={handleLinkClick}>
          Admin Panel
        </NavLink>
        <button
          type="button"
          className="admin-topnav-toggle"
          aria-expanded={mobileOpen}
          aria-controls="admin-topnav-links"
          onClick={() => setMobileOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <div id="admin-topnav-links" className={`admin-topnav-links${mobileOpen ? ' open' : ''}`}>
        {navGroups.map((group) => (
          <nav key={group.label} className="admin-topnav-group" aria-label={group.label}>
            <div className="admin-topnav-group-label">{group.label}</div>
            <div className="admin-topnav-group-links">
              {group.links.map((link) => (
                <NavLink key={link.to} to={link.to} onClick={handleLinkClick} className={({ isActive }) => (isActive ? 'active' : '')}>
                  {link.label}
                </NavLink>
              ))}
            </div>
          </nav>
        ))}
      </div>
      <div className="admin-topnav-right">
        <div className="admin-topnav-user">
          {admin?.username}
        </div>
      </div>
    </div>
  );
};

export default AdminTopNav;
