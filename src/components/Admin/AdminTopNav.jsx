import { Link, useLocation } from 'react-router-dom';
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

  if (isVisibleAdminRoute) {
    return null;
  }

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  return (
    <div className={`admin-topnav${mobileOpen ? ' is-open' : ''}`}>
      <div className="admin-topnav-left">
        <Link to={paths.dashboard} className="admin-topnav-logo" onClick={handleLinkClick}>
          Admin Panel
        </Link>
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
      <nav id="admin-topnav-links" className={`admin-topnav-links${mobileOpen ? ' open' : ''}`}>
        <Link to={paths.dashboard} onClick={handleLinkClick}>Overview</Link>
        <Link to={paths.categories} onClick={handleLinkClick}>Categories</Link>
        <Link to={paths.products} onClick={handleLinkClick}>Products</Link>
        <Link to={paths.import} onClick={handleLinkClick}>Import</Link>
        <Link to={paths.siteOrders} onClick={handleLinkClick}>Orders</Link>
        <Link to={paths.marketing} onClick={handleLinkClick}>Marketing</Link>
        <Link to={paths.account} onClick={handleLinkClick}>Account</Link>
      </nav>
      <div className="admin-topnav-right">
        <div className="admin-topnav-user">
          {admin?.username}
        </div>
      </div>
    </div>
  );
};

export default AdminTopNav;
