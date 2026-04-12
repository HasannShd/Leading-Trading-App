import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';

const ProtectedAdminRoute = ({ element }) => {
  const { admin, loading } = useContext(AdminContext);
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--bg)',
        fontSize: '1.2rem',
        color: 'var(--navy-800)'
      }}>
        Loading...
      </div>
    );
  }

  if (!admin) {
    return <Navigate to={location.pathname.startsWith('/admin') ? '/admin/login' : '/.well-known/admin-access-sh123456'} replace />;
  }

  return element;
};

export default ProtectedAdminRoute;
