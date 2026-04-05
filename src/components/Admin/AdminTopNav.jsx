import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import './AdminTopNav.css';

const AdminTopNav = () => {
  const { admin } = useContext(AdminContext);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  return (
    <div className={`admin-topnav${mobileOpen ? ' is-open' : ''}`}>
      <div className="admin-topnav-left">
        <Link to="/.well-known/admin-dashboard-sh123456" className="admin-topnav-logo" onClick={handleLinkClick}>
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
        <Link to="/.well-known/admin-dashboard-sh123456" onClick={handleLinkClick}>Overview</Link>
        <Link to="/.well-known/admin-categories-sh123456" onClick={handleLinkClick}>Categories</Link>
        <Link to="/.well-known/admin-products-sh123456" onClick={handleLinkClick}>Products</Link>
        <Link to="/.well-known/admin-import-sh123456" onClick={handleLinkClick}>Import</Link>
        <Link to="/.well-known/admin-orders-sh123456" onClick={handleLinkClick}>Orders</Link>
        <Link to="/.well-known/admin-marketing-sh123456" onClick={handleLinkClick}>Marketing</Link>
        <Link to="/.well-known/admin-account-sh123456" onClick={handleLinkClick}>Account</Link>
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
