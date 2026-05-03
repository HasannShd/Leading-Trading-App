import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Orders.css';
import { authFetch } from '../../services/authFetch';
import { useLanguage } from '../../context/LanguageContext';

const Orders = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');

  const downloadInvoice = async (orderId, invoiceNumber) => {
    setNotice('');
    try {
      const response = await authFetch(`/orders/${orderId}/invoice`, { scope: 'user' });
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          if (response.status === 401) {
            setNotice(t('Session expired. Please sign in again.'));
            return;
          }
          setNotice(data.message || t('Failed to download invoice'));
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
      setNotice(t('Failed to download invoice'));
    }
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await authFetch('/orders', { scope: 'user' });
      if (response.status === 401) {
        navigate('/sign-in');
        return;
      }
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <main>
      <section className="orders-section">
        <h1>{t('My Orders')}</h1>
        {loading ? (
          <p className="shop-empty">{t('Loading orders...')}</p>
        ) : orders.length === 0 ? (
          <p className="shop-empty">{t('No orders yet.')}</p>
        ) : (
          <>
            {notice ? <div className="orders-notice" role="alert">{notice}</div> : null}
            <div className="orders-list">
              {orders.map(order => (
                <div key={order._id} className="order-card">
                  <div>
                    <h3>{order.invoiceNumber}</h3>
                    <div className={`order-status ${order.status}`}>{order.status}</div>
                    <p>{t('Total')}: {Number(order.total).toFixed(3)} BHD</p>
                  </div>
                  <div className="order-actions">
                    <button
                      className="btn"
                      onClick={() => downloadInvoice(order._id, order.invoiceNumber)}
                    >
                      {t('Download Invoice')}
                    </button>
                    <Link className="btn" to="/shop">{t('Shop again')}</Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default Orders;
