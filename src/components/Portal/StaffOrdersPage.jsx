import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { portalApi } from '../../services/portalApi';
import { authFetch } from '../../services/authFetch';
import { formatPortalDateTime } from '../../utils/portalDate';
import './PortalShell.css';

const blankClient = {
  name: '',
  companyType: '',
  department: '',
  contactPerson: '',
  phone: '',
  email: '',
  location: '',
  address: '',
  notes: '',
};

const blankOrder = {
  client: '',
  customerName: '',
  companyName: '',
  contactPerson: '',
  itemsText: '',
  urgency: 'normal',
  deliveryNote: '',
  notes: '',
};

const parseQuantity = (value) => {
  const normalized = String(value || '').trim();
  if (!normalized) return 1;

  const directNumber = Number(normalized);
  if (Number.isFinite(directNumber) && directNumber > 0) return directNumber;

  const numericMatch = normalized.match(/-?\d+(?:\.\d+)?/);
  if (!numericMatch) return 1;

  const parsedNumber = Number(numericMatch[0]);
  return Number.isFinite(parsedNumber) && parsedNumber > 0 ? parsedNumber : 1;
};

const parseLineItems = (value) =>
  String(value || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [productName = '', quantity = '1', price = ''] = line.split('|').map((part) => part.trim());
      return {
        productName,
        quantity: parseQuantity(quantity),
        ...(price !== '' ? { price: Number(price) || 0 } : {}),
      };
    })
    .filter((item) => item.productName);

const attachmentLabel = (attachment) => attachment?.name || attachment?.url?.split('/').pop() || 'Attachment';

const StaffOrdersPage = () => {
  const location = useLocation();
  const [clients, setClients] = useState([]);
  const [orders, setOrders] = useState([]);
  const [clientQuery, setClientQuery] = useState('');
  const [orderQuery, setOrderQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [clientForm, setClientForm] = useState(blankClient);
  const [orderForm, setOrderForm] = useState(blankOrder);
  const [showClientForm, setShowClientForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [focusedOrderId, setFocusedOrderId] = useState('');
  const [orderAttachments, setOrderAttachments] = useState([]);
  const draftKey = 'staff-draft:orders-workspace';

  const load = async () => {
    setLoading(true);
    try {
      const [clientsResponse, ordersResponse] = await Promise.all([
        portalApi.get('/staff-portal/clients', 'sales_staff'),
        portalApi.get('/staff-portal/orders', 'sales_staff'),
      ]);
      setClients(clientsResponse.data.clients || []);
      setOrders(ordersResponse.data.orders || []);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setFocusedOrderId(new URLSearchParams(location.search).get('focus') || '');
  }, [location.search]);

  useEffect(() => {
    const raw = localStorage.getItem(draftKey);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed.clientForm) setClientForm((current) => ({ ...current, ...parsed.clientForm }));
      if (parsed.orderForm) setOrderForm((current) => ({ ...current, ...parsed.orderForm }));
      if (Array.isArray(parsed.orderAttachments)) setOrderAttachments(parsed.orderAttachments);
      if (parsed.clientQuery) setClientQuery(parsed.clientQuery);
      if (parsed.selectedClientId) setSelectedClientId(parsed.selectedClientId);
      if (parsed.showClientForm) setShowClientForm(Boolean(parsed.showClientForm));
      setMessage('Saved client/order draft restored on this device.');
    } catch (error) {
      // ignore malformed draft
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      draftKey,
      JSON.stringify({
        clientForm,
        orderForm,
        orderAttachments,
        clientQuery,
        selectedClientId,
        showClientForm,
      })
    );
  }, [clientForm, clientQuery, draftKey, orderAttachments, orderForm, selectedClientId, showClientForm]);

  const filteredClients = useMemo(() => {
    const query = clientQuery.trim().toLowerCase();
    if (!query) return clients;
    return clients.filter((client) =>
      [client.name, client.contactPerson, client.phone, client.email, client.location]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [clients, clientQuery]);

  const selectedClient = useMemo(
    () => clients.find((client) => client._id === (selectedClientId || orderForm.client)),
    [clients, selectedClientId, orderForm.client]
  );

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

  useEffect(() => {
    if (!selectedClient) return;
    setOrderForm((current) => ({
      ...current,
      client: selectedClient._id,
      companyName: selectedClient.name || '',
      contactPerson: selectedClient.contactPerson || '',
      customerName: selectedClient.contactPerson || selectedClient.name || '',
    }));
  }, [selectedClient]);

  const updateClientForm = (field, value) =>
    setClientForm((current) => ({ ...current, [field]: value }));

  const updateOrderForm = (field, value) =>
    setOrderForm((current) => ({ ...current, [field]: value }));

  const createClient = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const response = await portalApi.post('/staff-portal/clients', clientForm, 'sales_staff');
      const client = response.data.client;
      setClients((current) => [client, ...current]);
      setSelectedClientId(client._id);
      setOrderForm((current) => ({
        ...current,
        client: client._id,
        companyName: client.name || '',
        contactPerson: client.contactPerson || '',
        customerName: client.contactPerson || client.name || '',
      }));
      setClientForm(blankClient);
      setShowClientForm(false);
      setMessage('Client created and selected for the order.');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  };

  const submitOrder = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const payload = {
        ...orderForm,
        items: parseLineItems(orderForm.itemsText),
        attachments: orderAttachments,
      };
      await portalApi.post('/staff-portal/orders', payload, 'sales_staff');
      setOrderForm(blankOrder);
      setOrderAttachments([]);
      setClientForm(blankClient);
      setSelectedClientId('');
      localStorage.removeItem(draftKey);
      setMessage('Order submitted.');
      await load();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(draftKey);
    setClientForm(blankClient);
    setOrderForm(blankOrder);
    setOrderAttachments([]);
    setClientQuery('');
    setSelectedClientId('');
    setShowClientForm(false);
    setMessage('Client and order draft cleared.');
  };

  const downloadExport = async (path, filename) => {
    try {
      const response = await authFetch(path, { scope: 'sales_staff' });
      if (!response.ok) throw new Error('Export failed.');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      anchor.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setMessage(err.message || 'Export failed.');
    }
  };

  const handleOrderFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setBusy(true);
    setMessage('');
    try {
      const uploaded = await Promise.all(
        files.map(async (file) => {
          const url = await portalApi.uploadFile(file, 'sales_staff');
          return {
            name: file.name,
            url,
            mimeType: file.type,
          };
        })
      );
      setOrderAttachments((current) => [...current, ...uploaded]);
    } catch (err) {
      setMessage(err.message || 'Order attachment upload failed.');
    } finally {
      setBusy(false);
      event.target.value = '';
    }
  };

  const removeOrderAttachment = (url) => {
    setOrderAttachments((current) => current.filter((entry) => entry.url !== url));
  };

  return (
    <section className="portal-page">
      <div className="portal-card dark">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Sales Workspace</div>
            <h1 className="portal-section-title">Clients and Orders</h1>
            <p className="portal-section-copy" style={{ color: 'rgba(255,255,255,0.76)' }}>
              Pick a client from your own list before submitting an order. If the client is new, create it here first and keep the full order history under your account.
            </p>
          </div>
        </div>
        <div className="portal-grid stats" style={{ marginTop: '1rem' }}>
          <div className="portal-stat">
            <div className="portal-stat-value">{clients.length}</div>
            <div className="portal-stat-label">Clients in your list</div>
          </div>
          <div className="portal-stat">
            <div className="portal-stat-value">{orders.length}</div>
            <div className="portal-stat-label">Orders submitted</div>
          </div>
          <div className="portal-stat">
            <div className="portal-stat-value">{orders.filter((order) => ['submitted', 'reviewed', 'emailed', 'confirmed'].includes(order.status)).length}</div>
            <div className="portal-stat-label">Active order pipeline</div>
          </div>
          <div className="portal-stat">
            <div className="portal-stat-value">{selectedClient ? 'Ready' : 'Pick one'}</div>
            <div className="portal-stat-label">{selectedClient ? selectedClient.name : 'Client selection'}</div>
          </div>
        </div>
      </div>

      <div className="portal-card portal-help-card">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Simple steps</div>
            <h2 className="portal-section-title" style={{ fontSize: '1.45rem' }}>How to place an order</h2>
            <p className="portal-section-copy">
              1. Choose a client. 2. If the client is new, press <strong>Add New Client</strong>. 3. Fill the order. 4. Press the big save button.
            </p>
          </div>
        </div>
        <div className="portal-section-head" style={{ marginTop: '1rem' }}>
          <div>
            <div className="portal-brand-kicker">Reports</div>
            <p className="portal-section-copy">Download your own client list or order history whenever needed.</p>
          </div>
          <div className="portal-inline-actions">
            <button className="portal-inline-button ghost" type="button" onClick={() => downloadExport('/staff-portal/clients/export', 'my-clients.csv')}>
              Export Clients CSV
            </button>
            <button className="portal-inline-button ghost" type="button" onClick={() => downloadExport('/staff-portal/orders/export', 'my-orders.csv')}>
              Export Orders CSV
            </button>
          </div>
        </div>
      </div>

      <div className="portal-sales-grid">
        <div className="portal-card">
          <div className="portal-section-head">
            <div>
              <div className="portal-brand-kicker">Your Clients</div>
              <h2 className="portal-section-title" style={{ fontSize: '1.45rem' }}>Step 1: Choose a client</h2>
            </div>
            <button className="portal-inline-button secondary" type="button" onClick={() => setShowClientForm((current) => !current)}>
              {showClientForm ? 'Close Client Form' : 'Add New Client'}
            </button>
          </div>

          <div className="portal-filter-bar" style={{ marginTop: '1rem' }}>
            <input
              type="text"
              value={clientQuery}
              onChange={(e) => setClientQuery(e.target.value)}
              placeholder="Search by client, contact, phone, or location"
            />
          </div>

          <div className="portal-record-list" style={{ marginTop: '1rem' }}>
            {filteredClients.length ? (
              filteredClients.map((client) => (
                <button
                  key={client._id}
                  type="button"
                  className={`portal-record-card portal-record-card-button${(selectedClientId || orderForm.client) === client._id ? ' is-selected' : ''}`}
                  onClick={() => setSelectedClientId(client._id)}
                >
                  <h3 className="portal-record-title">{client.name}</h3>
                  <div className="portal-record-meta">
                    {client.contactPerson && <span>{client.contactPerson}</span>}
                    {client.phone && <span>{client.phone}</span>}
                    {client.location && <span>{client.location}</span>}
                    <span>{formatPortalDateTime(client.updatedAt)}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="portal-empty-state">
                <h3 className="portal-empty-title">No matching clients</h3>
                <p className="portal-empty-copy">Create a new client below if this customer is not already in your list.</p>
              </div>
            )}
          </div>

          {showClientForm && (
            <form className="portal-form" onSubmit={createClient} style={{ marginTop: '1rem' }}>
              <div className="portal-form-grid two">
                {[
                  ['name', 'Client / Facility Name'],
                  ['companyType', 'Company Type'],
                  ['department', 'Department'],
                  ['contactPerson', 'Contact Person'],
                  ['phone', 'Phone'],
                  ['email', 'Email'],
                  ['location', 'Location'],
                ].map(([field, label]) => (
                  <div className="portal-field" key={field}>
                    <label>{label}</label>
                    <input value={clientForm[field]} onChange={(e) => updateClientForm(field, e.target.value)} />
                  </div>
                ))}
                <div className="portal-field" style={{ gridColumn: '1 / -1' }}>
                  <label>Address</label>
                  <textarea value={clientForm.address} onChange={(e) => updateClientForm('address', e.target.value)} />
                </div>
                <div className="portal-field" style={{ gridColumn: '1 / -1' }}>
                  <label>Notes</label>
                  <textarea value={clientForm.notes} onChange={(e) => updateClientForm('notes', e.target.value)} />
                </div>
              </div>
              <div className="portal-submit-bar">
                <div className="portal-submit-note">If the client does not already exist, fill these boxes and press save. Your draft stays on this phone until you clear it.</div>
                <div className="portal-actions-two">
                  <button className="portal-button ghost portal-save-button portal-save-button-ghost" type="button" onClick={clearDraft} disabled={busy}>
                    Clear Draft
                  </button>
                  <button className="portal-button primary portal-save-button" type="submit" disabled={busy}>
                    {busy ? 'Saving...' : 'Save New Client'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        <div className="portal-card">
          <div className="portal-section-head">
            <div>
              <div className="portal-brand-kicker">New Order</div>
              <h2 className="portal-section-title" style={{ fontSize: '1.45rem' }}>Step 2: Fill the order</h2>
            </div>
          </div>
          {selectedClient ? (
            <div className="portal-badge status">
              Selected client: {selectedClient.name}{selectedClient.contactPerson ? ` • ${selectedClient.contactPerson}` : ''}
            </div>
          ) : null}
          <form className="portal-form" onSubmit={submitOrder} style={{ marginTop: '1rem' }}>
            <div className="portal-form-grid two">
              <div className="portal-field">
                <label>Customer Name</label>
                <input value={orderForm.customerName} onChange={(e) => updateOrderForm('customerName', e.target.value)} placeholder="Main contact or customer name" />
              </div>
              <div className="portal-field">
                <label>Hospital / Company</label>
                <input value={orderForm.companyName} onChange={(e) => updateOrderForm('companyName', e.target.value)} placeholder="Company or facility name" />
              </div>
              <div className="portal-field">
                <label>Contact Person</label>
                <input value={orderForm.contactPerson} onChange={(e) => updateOrderForm('contactPerson', e.target.value)} placeholder="Person receiving the order" />
              </div>
              <div className="portal-field">
                <label>Urgency</label>
                <select value={orderForm.urgency} onChange={(e) => updateOrderForm('urgency', e.target.value)}>
                  {['low', 'normal', 'high', 'urgent'].map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </div>
              <div className="portal-field" style={{ gridColumn: '1 / -1' }}>
                <label>Items</label>
                <textarea
                  value={orderForm.itemsText}
                  onChange={(e) => updateOrderForm('itemsText', e.target.value)}
                  placeholder="One line per item: Product Name | Quantity | Price"
                />
              </div>
              <div className="portal-field">
                <label>Delivery Note</label>
                <input value={orderForm.deliveryNote} onChange={(e) => updateOrderForm('deliveryNote', e.target.value)} />
              </div>
              <div className="portal-field">
                <label>Internal Notes</label>
                <input value={orderForm.notes} onChange={(e) => updateOrderForm('notes', e.target.value)} />
              </div>
            </div>
            <div className="portal-inline-actions" style={{ marginTop: '1rem' }}>
              <label className="portal-inline-button secondary portal-file-label">
                {busy ? 'Uploading...' : 'Attach Images or Files'}
                <input type="file" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt" onChange={handleOrderFiles} hidden />
              </label>
            </div>
            {orderAttachments.length ? (
              <div className="portal-attachment-list editor" style={{ marginTop: '0.9rem' }}>
                {orderAttachments.map((attachment) => (
                  <button
                    key={attachment.url}
                    type="button"
                    className="portal-attachment-chip removable"
                    onClick={() => removeOrderAttachment(attachment.url)}
                  >
                    {attachmentLabel(attachment)} ×
                  </button>
                ))}
              </div>
            ) : null}
            {message && <div className="portal-message-banner success">{message}</div>}
            <div className="portal-submit-bar">
              <div className="portal-submit-note">Check the selected client, order items, and any supporting files, then press this button once. Drafts are saved on this phone until you submit or clear them.</div>
              <div className="portal-actions-two">
                <button className="portal-button ghost portal-save-button portal-save-button-ghost" type="button" onClick={clearDraft} disabled={busy}>
                  Clear Draft
                </button>
                <button className="portal-button primary portal-save-button" type="submit" disabled={busy}>
                  {busy ? 'Submitting...' : 'Save Order'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="portal-card">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Order History</div>
            <h2 className="portal-section-title" style={{ fontSize: '1.45rem' }}>Your order history</h2>
          </div>
        </div>
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
                  {(order.items || []).map((item) => `${item.productName} x${item.quantity}${item.price !== undefined ? ` @ ${item.price}` : ''}`).join(' | ')}
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
              <p className="portal-empty-copy">Change the filters or submit a new order from this workspace.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default StaffOrdersPage;
