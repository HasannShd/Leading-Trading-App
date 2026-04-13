import { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminCategories.css';
import AdminTopNav from './AdminTopNav';
import { getAdminPaths } from './adminPaths';
import { authFetch } from '../../services/authFetch';

const AdminOrders = () => {
  const location = useLocation();
  const adminPaths = getAdminPaths(location.pathname.startsWith('/admin'));
  const adminLoginPath = adminPaths.login;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUnauthorized = useCallback(() => {
    setError('Admin session expired. Please sign in again.');
    window.location.href = adminLoginPath;
  }, [adminLoginPath]);

  const handleAdminPrecondition = (message) => {
    setOrders([]);
    setError(message || 'Admin setup is required before using this section.');
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await authFetch('/orders/admin', { scope: 'admin' });
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }
      const data = await response.json();
      if (response.status === 428) {
        handleAdminPrecondition(data.message);
        return;
      }
      if (!response.ok) {
        setOrders([]);
        setError(data.message || 'Failed to fetch orders');
        return;
      }
      setOrders(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setOrders([]);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [handleUnauthorized]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const pendingCount = orders.filter((order) => ['pending', 'processing'].includes(order.status)).length;
  const deliveredCount = orders.filter((order) => order.status === 'delivered').length;
  const revenueTotal = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);

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
        if (response.status === 401) {
          handleUnauthorized();
          return;
        }
        if (response.status === 428) {
          handleAdminPrecondition(data.message);
          return;
        }
        setError(data.message || 'Failed to update status');
        return;
      }
      fetchOrders();
    } catch (err) {
      setError('Failed to update status');
    }
  };

  return (
    <div className="admin-categories admin-surface">
      <AdminTopNav />
      <section className="admin-surface-hero">
        <div className="admin-surface-eyebrow">Website Orders</div>
        <div className="admin-surface-hero-row">
          <div className="admin-surface-copy">
            <h1>Track customer orders without losing status context.</h1>
            <p>
              Review payment method, shipping progress, and total volume in one place, then move into the full order record only when needed.
            </p>
          </div>
        </div>
        <div className="admin-surface-stats">
          <div className="admin-surface-stat">
            <strong>{orders.length}</strong>
            <span>Total orders</span>
          </div>
          <div className="admin-surface-stat">
            <strong>{pendingCount}</strong>
            <span>Need action</span>
          </div>
          <div className="admin-surface-stat">
            <strong>{deliveredCount}</strong>
            <span>Delivered</span>
          </div>
          <div className="admin-surface-stat">
            <strong>{revenueTotal.toFixed(3)} BHD</strong>
            <span>Total value</span>
          </div>
        </div>
      </section>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-categories-list">
        <div className="admin-panel-heading">
          <div>
            <h2>All Orders ({orders.length})</h2>
            <p>Update fulfillment status quickly, then open the full order page for invoice and shipping details.</p>
          </div>
          <div className="admin-summary-pills">
            <span className="admin-summary-pill"><strong>{pendingCount}</strong> pending or processing</span>
            <span className="admin-summary-pill"><strong>{deliveredCount}</strong> delivered</span>
          </div>
        </div>
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
                    <td className="col-name" data-label="Invoice">{order.invoiceNumber}</td>
                    <td data-label="Customer">{order.customer?.name || '-'}</td>
                    <td data-label="Total">{Number(order.total).toFixed(3)} BHD</td>
                    <td data-label="Status">
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
                    <td data-label="Payment">{order.paymentMethod}</td>
                    <td className="col-date" data-label="Created">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="col-actions" data-label="Actions">
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
