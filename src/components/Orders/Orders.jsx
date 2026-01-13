import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Orders = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const downloadInvoice = async (orderId, invoiceNumber) => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/invoice`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        alert('Failed to download invoice');
        return;
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download invoice');
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, []);

  return (
    <main>
      <section className="orders-section">
        <h1>My Orders</h1>
        {loading ? (
          <p className="shop-empty">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="shop-empty">No orders yet.</p>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div>
                  <h3>{order.invoiceNumber}</h3>
                  <p>Status: {order.status}</p>
                  <p>Total: {Number(order.total).toFixed(3)} BHD</p>
                </div>
                <div className="order-actions">
                  <button
                    className="btn"
                    onClick={() => downloadInvoice(order._id, order.invoiceNumber)}
                  >
                    Download Invoice
                  </button>
                  <Link className="btn" to="/shop">Shop again</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Orders;
