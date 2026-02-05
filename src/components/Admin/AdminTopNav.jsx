import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import './AdminTopNav.css';

const AdminTopNav = () => {
  const { admin } = useContext(AdminContext);

  return (
    <div className="admin-topnav">
      <div className="admin-topnav-left">
        <Link to="/.well-known/admin-dashboard-sh123456" className="admin-topnav-logo">
          Admin Panel
        </Link>
        <nav className="admin-topnav-links">
          <Link to="/.well-known/admin-dashboard-sh123456">Overview</Link>
          <Link to="/.well-known/admin-categories-sh123456">Categories</Link>
          <Link to="/.well-known/admin-products-sh123456">Products</Link>
          <Link to="/.well-known/admin-import-sh123456">Import</Link>
          <Link to="/.well-known/admin-orders-sh123456">Orders</Link>
          <Link to="/.well-known/admin-marketing-sh123456">Marketing</Link>
          <Link to="/.well-known/admin-account-sh123456">Account</Link>
        </nav>
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
