import { useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import AdminTopNav from './AdminTopNav';
import './AdminCategories.css';

const AdminAccount = () => {
  const { admin } = useContext(AdminContext);

  return (
    <div className="admin-categories">
      <AdminTopNav />
      <div className="admin-page-header">
        <h1>👤 Account</h1>
      </div>
      <div className="admin-categories-list">
        <h2>Admin Profile</h2>
        <p><strong>Username:</strong> {admin?.username}</p>
        <p><strong>Role:</strong> {admin?.role}</p>
      </div>
    </div>
  );
};

export default AdminAccount;
