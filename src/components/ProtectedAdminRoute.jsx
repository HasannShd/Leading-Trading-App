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
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return element;
};

export default ProtectedAdminRoute;
