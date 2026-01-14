import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './AdminCategories.css';
import AdminTopNav from './AdminTopNav';

const AdminOrderDetails = () => {
  const { id } = useParams();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('adminToken');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  const downloadInvoice = async () => {
    if (!token) {
      alert('Please sign in to download the invoice.');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/orders/${id}/invoice`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  const fetchOrder = async () => {
    try {
      const response = await fetch(`${API_URL}/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (!order) {
    return (
      <div className="admin-categories">
        <AdminTopNav />
        {error && <div className="admin-error">{error}</div>}
        <p className="loading">Loading...</p>
      </div>
    );
  }

  return (
    <div className="admin-categories">
      <AdminTopNav />
      <div className="admin-page-header">
        <h1>🧾 Order {order.invoiceNumber}</h1>
      </div>

      <div className="admin-categories-list">
        <h2>Customer</h2>
        <p>{order.customer?.name}</p>
        <p>{order.customer?.email}</p>
        <p>{order.customer?.phone}</p>

        <h2>Shipping Address</h2>
        <p>{order.shippingAddress?.fullName}</p>
        <p>{order.shippingAddress?.line1}</p>
        <p>{order.shippingAddress?.line2}</p>
        <p>{order.shippingAddress?.city}</p>
        <p>{order.shippingAddress?.country}</p>
        <p>{order.shippingAddress?.postalCode}</p>

        <h2>Items</h2>
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
                  <td className="col-name">{item.name}</td>
                  <td>{item.size || item.sku || '-'}</td>
                  <td>{item.quantity}</td>
                  <td>{Number(item.price).toFixed(3)} BHD</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-form-actions">
          <button className="admin-btn-primary" onClick={downloadInvoice}>
            Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
