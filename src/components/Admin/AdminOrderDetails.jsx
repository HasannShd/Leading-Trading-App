import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import './AdminCategories.css';
import AdminTopNav from './AdminTopNav';
import { authFetch } from '../../services/authFetch';

const AdminOrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  const downloadInvoice = async () => {
    try {
      const response = await authFetch(`/orders/${id}/invoice`, { scope: 'admin' });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        alert(data.message || 'Failed to download invoice');
        return;
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${order?.invoiceNumber || 'order'}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download invoice');
    }
  };

  const fetchOrder = useCallback(async () => {
    try {
      const response = await authFetch(`/orders/${id}`, { scope: 'admin' });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Failed to load order');
        return;
      }
      setOrder(data);
      setError(null);
    } catch (err) {
      setError('Failed to load order');
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  if (!order) {
    return (
      <div className="admin-categories admin-surface">
        <AdminTopNav />
        {error && <div className="admin-error">{error}</div>}
        <p className="loading">Loading...</p>
      </div>
    );
  }

  return (
    <div className="admin-categories admin-surface">
      <AdminTopNav />
      <section className="admin-surface-hero">
        <div className="admin-surface-eyebrow">Order Review</div>
        <div className="admin-surface-hero-row">
          <div className="admin-surface-copy">
            <h1>Review order {order.invoiceNumber} in one place.</h1>
            <p>
              Check the customer details, shipping address, line items, and invoice action without jumping between separate admin pages.
            </p>
          </div>
          <div className="admin-surface-actions">
            <button className="admin-btn-primary" onClick={downloadInvoice}>
              Download Invoice
            </button>
          </div>
        </div>
        <div className="admin-surface-stats">
          <div className="admin-surface-stat">
            <strong>{order.status || '-'}</strong>
            <span>Order status</span>
          </div>
          <div className="admin-surface-stat">
            <strong>{Number(order.total || 0).toFixed(3)} BHD</strong>
            <span>Total amount</span>
          </div>
          <div className="admin-surface-stat">
            <strong>{order.items?.length || 0}</strong>
            <span>Line items</span>
          </div>
          <div className="admin-surface-stat">
            <strong>{order.paymentMethod || '-'}</strong>
            <span>Payment method</span>
          </div>
        </div>
      </section>

      <section className="admin-profile-grid">
        <div className="admin-profile-card">
          <h3>Customer</h3>
          <div className="admin-profile-list">
            <div className="admin-profile-row"><span>Name</span><strong>{order.customer?.name || '-'}</strong></div>
            <div className="admin-profile-row"><span>Email</span><strong>{order.customer?.email || '-'}</strong></div>
            <div className="admin-profile-row"><span>Phone</span><strong>{order.customer?.phone || '-'}</strong></div>
          </div>
        </div>
        <div className="admin-profile-card">
          <h3>Shipping Address</h3>
          <div className="admin-profile-list">
            <div className="admin-profile-row"><span>Recipient</span><strong>{order.shippingAddress?.fullName || '-'}</strong></div>
            <div className="admin-profile-row"><span>Address</span><strong>{[order.shippingAddress?.line1, order.shippingAddress?.line2].filter(Boolean).join(', ') || '-'}</strong></div>
            <div className="admin-profile-row"><span>City / Country</span><strong>{[order.shippingAddress?.city, order.shippingAddress?.country].filter(Boolean).join(', ') || '-'}</strong></div>
            <div className="admin-profile-row"><span>Postal Code</span><strong>{order.shippingAddress?.postalCode || '-'}</strong></div>
          </div>
        </div>
        <div className="admin-profile-card">
          <h3>Order Summary</h3>
          <div className="admin-profile-list">
            <div className="admin-profile-row"><span>Invoice</span><strong>{order.invoiceNumber || '-'}</strong></div>
            <div className="admin-profile-row"><span>Status</span><strong>{order.status || '-'}</strong></div>
            <div className="admin-profile-row"><span>Total</span><strong>{Number(order.total || 0).toFixed(3)} BHD</strong></div>
            <div className="admin-profile-row"><span>Payment</span><strong>{order.paymentMethod || '-'}</strong></div>
          </div>
        </div>
      </section>

      <div className="admin-categories-list">
        <div className="admin-panel-heading">
          <div>
            <h2>Items</h2>
            <p>Each line item shows the selected product, variant reference, quantity, and unit price.</p>
          </div>
        </div>
        <div className="categories-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Variant</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map(item => (
                <tr key={item._id}>
                  <td className="col-name" data-label="Product">{item.name}</td>
                  <td data-label="Variant">{item.size || item.sku || '-'}</td>
                  <td data-label="Qty">{item.quantity}</td>
                  <td data-label="Price">{Number(item.price).toFixed(3)} BHD</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
