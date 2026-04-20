import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { portalApi } from '../../services/portalApi';
import { formatOrderItem } from '../../utils/orderItems';
import { formatPortalDateTime } from '../../utils/portalDate';
import './PortalShell.css';

const attachmentLabel = (attachment) => attachment?.name || attachment?.url?.split('/').pop() || 'Attachment';

const StaffOrderHistoryPage = () => {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [orderQuery, setOrderQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [focusedOrderId, setFocusedOrderId] = useState('');

  useEffect(() => {
    setFocusedOrderId(new URLSearchParams(location.search).get('focus') || '');
  }, [location.search]);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const response = await portalApi.get('/staff-portal/orders', 'sales_staff');
        setOrders(response.data.orders || []);
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const query = orderQuery.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      if (!matchesStatus) return false;
      if (!query) return true;
      return [
        order.customerName,
        order.companyName,
        order.contactPerson,
        order.client?.name,
        ...(order.items || []).map((item) => item.productName),
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  }, [orderQuery, orders, statusFilter]);

  return (
    <section className="portal-page">
      <div className="portal-card dark">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Order Review</div>
            <h1 className="portal-section-title">My previous orders</h1>
            <p className="portal-section-copy" style={{ color: 'rgba(255,255,255,0.76)' }}>
              Review your older orders, track status changes, and reopen attachments or order details whenever you need them.
            </p>
          </div>
        </div>
        <div className="portal-grid stats" style={{ marginTop: '1rem' }}>
          <div className="portal-stat">
            <div className="portal-stat-value">{orders.length}</div>
            <div className="portal-stat-label">Orders submitted</div>
          </div>
          <div className="portal-stat">
            <div className="portal-stat-value">{orders.filter((order) => ['submitted', 'reviewed', 'emailed', 'confirmed'].includes(order.status)).length}</div>
            <div className="portal-stat-label">Active pipeline</div>
          </div>
          <div className="portal-stat">
            <div className="portal-stat-value">{orders.filter((order) => order.status === 'delivered').length}</div>
            <div className="portal-stat-label">Delivered</div>
          </div>
        </div>
      </div>

      <div className="portal-card">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">History</div>
            <h2 className="portal-section-title" style={{ fontSize: '1.45rem' }}>Your order history</h2>
          </div>
        </div>
        {message ? <div className="portal-message-banner success">{message}</div> : null}
        <div className="portal-filter-bar" style={{ marginTop: '1rem' }}>
          <input
            type="search"
            value={orderQuery}
            onChange={(e) => setOrderQuery(e.target.value)}
            placeholder="Search by company, customer, contact, or item"
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All statuses</option>
            {['submitted', 'reviewed', 'emailed', 'confirmed', 'delivered', 'cancelled'].map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div className="portal-record-list" style={{ marginTop: '1rem' }}>
          {loading ? (
            <div className="portal-record-card">Loading...</div>
          ) : filteredOrders.length ? (
            filteredOrders.map((order) => (
              <div className={`portal-record-card${focusedOrderId === order._id ? ' is-selected' : ''}`} key={order._id}>
                <h3 className="portal-record-title">{order.companyName || order.client?.name || order.customerName}</h3>
                <div className="portal-record-meta">
                  <span className="portal-badge status">{order.status}</span>
                  <span>{formatPortalDateTime(order.createdAt)}</span>
                </div>
                <div className="portal-staff-report-list">
                  <div className="portal-staff-report-row">
                    <strong>Customer</strong>
                    <span>{order.customerName || '-'}</span>
                  </div>
                  <div className="portal-staff-report-row">
                    <strong>Contact person</strong>
                    <span>{order.contactPerson || '-'}</span>
                  </div>
                  <div className="portal-staff-report-row">
                    <strong>Urgency</strong>
                    <span>{order.urgency || 'normal'}</span>
                  </div>
                  <div className="portal-staff-report-row">
                    <strong>Items</strong>
                    <span>{(order.items || []).length}</span>
                  </div>
                </div>
                <div className="portal-record-copy">
                  {(order.items || []).map((item) => formatOrderItem(item)).join(' | ')}
                </div>
                {order.attachments?.length ? (
                  <div className="portal-attachment-list" style={{ marginTop: '0.85rem' }}>
                    {order.attachments.map((attachment) => (
                      <a
                        key={`${order._id}-${attachment.url}`}
                        className="portal-attachment-chip"
                        href={attachment.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {attachmentLabel(attachment)}
                      </a>
                    ))}
                  </div>
                ) : null}
                {(order.notes || order.deliveryNote) && (
                  <div className="portal-record-copy">
                    {order.deliveryNote ? <div><strong>Delivery:</strong> {order.deliveryNote}</div> : null}
                    {order.notes ? <div><strong>Notes:</strong> {order.notes}</div> : null}
                  </div>
                )}
                {!!order.statusHistory?.length && (
                  <div className="portal-record-copy" style={{ marginTop: '0.85rem' }}>
                    <strong>Status history</strong>
                    <div style={{ marginTop: '0.4rem' }}>
                      {order.statusHistory
                        .slice()
                        .reverse()
                        .map((entry, index) => (
                          <div key={`${order._id}-${entry.changedAt || index}`}>
                            {entry.status || 'updated'}
                            {entry.note ? ` • ${entry.note}` : ''}
                            {entry.changedAt ? ` • ${formatPortalDateTime(entry.changedAt)}` : ''}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="portal-empty-state">
              <h3 className="portal-empty-title">No matching orders</h3>
              <p className="portal-empty-copy">Change the filters or submit a new order from the order form page.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default StaffOrderHistoryPage;
