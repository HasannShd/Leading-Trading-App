import { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminCategories.css';
import AdminTopNav from './AdminTopNav';
import { getAdminPaths } from './adminPaths';
import { authFetch } from '../../services/authFetch';

const AdminOrders = () => {
  const location = useLocation();
  const adminPaths = getAdminPaths(location.pathname.startsWith('/admin'));
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await authFetch('/orders/admin', { scope: 'admin' });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Failed to fetch orders');
        return;
      }
      setOrders(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString();
  };

  const updateStatus = async (orderId, status) => {
    try {
      const response = await authFetch(`/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        scope: 'admin',
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Failed to update status');
        return;
      }
      fetchOrders();
    } catch (err) {
      setError('Failed to update status');
    }
  };

  return (
    <div className="admin-categories">
      <AdminTopNav />
      <div className="admin-page-header">
        <h1>📦 Orders</h1>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-categories-list">
        <h2>All Orders ({orders.length})</h2>
        {loading ? (
          <p className="loading">Loading...</p>
        ) : (
          <div className="categories-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td className="col-name">{order.invoiceNumber}</td>
                    <td>{order.customer?.name || '-'}</td>
                    <td>{Number(order.total).toFixed(3)} BHD</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>{order.paymentMethod}</td>
                    <td className="col-date">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="col-actions">
                      <Link className="btn-edit" to={adminPaths.siteOrderDetails(order._id)}>
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
