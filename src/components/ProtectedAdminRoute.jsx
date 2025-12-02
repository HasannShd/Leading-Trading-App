import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';

const ProtectedAdminRoute = ({ element }) => {
  const { admin, loading } = useContext(AdminContext);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f4f5f7',
        fontSize: '1.2rem',
        color: '#0548ac'
      }}>
        Loading...
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/.well-known/admin-access-sh123456" replace />;
  }

  return element;
};

export default ProtectedAdminRoute;
