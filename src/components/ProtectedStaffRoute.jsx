import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { StaffContext } from '../context/StaffContext';

const ProtectedStaffRoute = ({ element }) => {
  const { staff, loading } = useContext(StaffContext);

  if (loading) {
    return <div className="portal-loading">Loading...</div>;
  }

  if (!staff) {
    return <Navigate to="/staff/login" replace />;
  }

  return element;
};

export default ProtectedStaffRoute;
