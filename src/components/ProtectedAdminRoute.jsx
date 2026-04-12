import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';

const ProtectedAdminRoute = ({ element }) => {
  const { admin, loading, mfaSetupRequired } = useContext(AdminContext);
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

  if (
    mfaSetupRequired &&
    location.pathname !== '/admin/account' &&
    location.pathname !== '/.well-known/admin-account-sh123456'
  ) {
    return <Navigate to={location.pathname.startsWith('/admin') ? '/admin/account' : '/.well-known/admin-account-sh123456'} replace />;
  }

  return element;
};

export default ProtectedAdminRoute;
