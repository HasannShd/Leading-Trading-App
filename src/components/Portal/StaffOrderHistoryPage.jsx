import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { portalApi } from '../../services/portalApi';
import { formatOrderItem } from '../../utils/orderItems';
import { formatPortalDateTime } from '../../utils/portalDate';
import './PortalShell.css';

const attachmentLabel = (attachment) => attachment?.name || attachment?.url?.split('/').pop() || 'Attachment';
const getFacilityName = (order) => order.companyName || order.client?.name || 'Facility not set';

const StaffOrderHistoryPage = () => {
  const location = useLocation();
  const selectedOrderRef = useRef(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [orderQuery, setOrderQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedOrderId, setSelectedOrderId] = useState('');

  useEffect(() => {
    const focusedOrderId = new URLSearchParams(location.search).get('focus') || '';
    if (focusedOrderId) setSelectedOrderId(focusedOrderId);
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
    const nextOrders = orders.filter((order) => {
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesDate = !dateFilter || (order.requestedForDate || order.createdAt?.slice?.(0, 10)) === dateFilter;
      if (!matchesStatus || !matchesDate) return false;
      if (!query) return true;
      return [
        getFacilityName(order),
        order.customerName,
        order.contactPerson,
        order.requestedForDate,
        ...(order.items || []).map((item) => item.productName),
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });

    return nextOrders.sort((left, right) => {
      const leftKey = `${left.requestedForDate || ''}|${left.createdAt || ''}`;
      const rightKey = `${right.requestedForDate || ''}|${right.createdAt || ''}`;
      return sortOrder === 'oldest' ? leftKey.localeCompare(rightKey) : rightKey.localeCompare(leftKey);
    });
  }, [dateFilter, orderQuery, orders, sortOrder, statusFilter]);

  const selectedOrder = useMemo(
    () => filteredOrders.find((order) => order._id === selectedOrderId) || filteredOrders[0] || null,
    [filteredOrders, selectedOrderId]
  );

  useEffect(() => {
    if (!selectedOrder) return;
    setSelectedOrderId((current) => (current === selectedOrder._id ? current : selectedOrder._id));
  }, [selectedOrder]);

  useEffect(() => {
    if (!selectedOrder || !selectedOrderRef.current) return;
    selectedOrderRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [selectedOrder]);

  return (
    <section className="portal-page">
      <div className="portal-card dark">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Order Review</div>
            <h1 className="portal-section-title">My previous orders</h1>
            <p className="portal-section-copy" style={{ color: 'rgba(255,255,255,0.76)' }}>
              Review your older orders, sort them by requested date, and open only the one you need instead of scrolling through the whole history.
            </p>
          </div>
        </div>
        <div className="portal-grid stats" style={{ marginTop: '1rem' }}>
          <div className="portal-stat">
            <div className="portal-stat-value">{orders.length}</div>
            <div className="portal-stat-label">Orders submitted</div>
          </div>
          <div className="portal-stat">
            <div className="portal-stat-value">{orders.filter((order) => order.orderTiming === 'tomorrow').length}</div>
            <div className="portal-stat-label">Queued for tomorrow</div>
          </div>
          <div className="portal-stat">
            <div className="portal-stat-value">{orders.filter((order) => ['submitted', 'reviewed', 'emailed', 'confirmed'].includes(order.status)).length}</div>
            <div className="portal-stat-label">Active pipeline</div>
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
            placeholder="Search by facility, contact, requested date, or item"
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All statuses</option>
            {['submitted', 'reviewed', 'emailed', 'confirmed', 'delivered', 'cancelled'].map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="newest">Newest requested date</option>
            <option value="oldest">Oldest requested date</option>
          </select>
        </div>

        <div className="portal-record-list" style={{ marginTop: '1rem' }}>
          {loading ? (
            <div className="portal-record-card">Loading...</div>
          ) : filteredOrders.length ? (
            <>
              <div className="portal-inline-list compact">
                {filteredOrders.map((order) => (
                  <button
                    key={order._id}
                    type="button"
                    className={`portal-record-card portal-record-card-button${selectedOrder?._id === order._id ? ' is-selected' : ''}`}
                    onClick={() => setSelectedOrderId(order._id)}
                  >
                    <h3 className="portal-record-title">{getFacilityName(order)}</h3>
                    <div className="portal-record-meta">
                      <span className="portal-badge status">{order.status}</span>
                      <span>{order.requestedForDate || '-'}</span>
                      {order.orderTiming === 'tomorrow' ? <span>Order for tomorrow</span> : null}
                    </div>
                  </button>
                ))}
              </div>

              {selectedOrder ? (
                <div className="portal-record-card" ref={selectedOrderRef}>
                  <h3 className="portal-record-title">{getFacilityName(selectedOrder)}</h3>
                  <div className="portal-record-meta">
                    <span className="portal-badge status">{selectedOrder.status}</span>
                    <span>Requested for {selectedOrder.requestedForDate || '-'}</span>
                    <span>{selectedOrder.orderTiming === 'tomorrow' ? 'Order for tomorrow' : 'Order for today'}</span>
                    <span>{formatPortalDateTime(selectedOrder.createdAt)}</span>
                  </div>
                  <div className="portal-detail-grid">
                    <div className="portal-detail-item">
                      <span className="portal-detail-label">Facility</span>
                      <span className="portal-detail-value">{getFacilityName(selectedOrder)}</span>
                    </div>
                    <div className="portal-detail-item">
                      <span className="portal-detail-label">Contact person</span>
                      <span className="portal-detail-value">{selectedOrder.contactPerson || '-'}</span>
                    </div>
                    <div className="portal-detail-item">
                      <span className="portal-detail-label">Customer name</span>
                      <span className="portal-detail-value">{selectedOrder.customerName || '-'}</span>
                    </div>
                    <div className="portal-detail-item">
                      <span className="portal-detail-label">Urgency</span>
                      <span className="portal-detail-value">{selectedOrder.urgency || 'normal'}</span>
                    </div>
                  </div>
                  <div className="portal-note-block">
                    <div className="portal-detail-label">Items</div>
                    <div className="portal-record-copy">
                      {(selectedOrder.items || []).map((item) => formatOrderItem(item)).join(' | ')}
                    </div>
                  </div>
                  {selectedOrder.attachments?.length ? (
                    <div className="portal-note-block">
                      <div className="portal-detail-label">Attachments</div>
                      <div className="portal-attachment-list">
                        {selectedOrder.attachments.map((attachment) => (
                          <a
                            key={`${selectedOrder._id}-${attachment.url}`}
                            className="portal-attachment-chip"
                            href={attachment.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {attachmentLabel(attachment)}
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {(selectedOrder.notes || selectedOrder.deliveryNote) && (
                    <div className="portal-record-copy">
                      {selectedOrder.deliveryNote ? <div><strong>Delivery:</strong> {selectedOrder.deliveryNote}</div> : null}
                      {selectedOrder.notes ? <div><strong>Notes:</strong> {selectedOrder.notes}</div> : null}
                    </div>
                  )}
                </div>
              ) : null}
            </>
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
