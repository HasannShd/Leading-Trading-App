import { useEffect, useMemo, useState } from 'react';
import { portalApi } from '../../services/portalApi';
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

const parseLineItems = (value) =>
  String(value || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [productName = '', quantity = '1', price = ''] = line.split('|').map((part) => part.trim());
      return {
        productName,
        quantity: Number(quantity) || 1,
        ...(price !== '' ? { price: Number(price) || 0 } : {}),
      };
    })
    .filter((item) => item.productName);

const StaffOrdersPage = () => {
  const [clients, setClients] = useState([]);
  const [orders, setOrders] = useState([]);
  const [clientQuery, setClientQuery] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [clientForm, setClientForm] = useState(blankClient);
  const [orderForm, setOrderForm] = useState(blankOrder);
  const [showClientForm, setShowClientForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

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
      };
      await portalApi.post('/staff-portal/orders', payload, 'sales_staff');
      setOrderForm(blankOrder);
      setSelectedClientId('');
      setMessage('Order submitted.');
      await load();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  };

  const downloadExport = async (path, filename) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}${path}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('staffToken')}` },
      });
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
            <div className="portal-brand-kicker">Reports</div>
            <h2 className="portal-section-title" style={{ fontSize: '1.45rem' }}>Export your own client and order history</h2>
            <p className="portal-section-copy">
              Download a CSV report whenever you need a record of your current client list or submitted orders.
            </p>
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
              <h2 className="portal-section-title" style={{ fontSize: '1.45rem' }}>Choose an existing client</h2>
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
              <button className="portal-button primary" type="submit" disabled={busy}>
                {busy ? 'Saving...' : 'Create Client'}
              </button>
            </form>
          )}
        </div>

        <div className="portal-card">
          <div className="portal-section-head">
            <div>
              <div className="portal-brand-kicker">New Order</div>
              <h2 className="portal-section-title" style={{ fontSize: '1.45rem' }}>Submit order from selected client</h2>
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
            {message && <div className="portal-badge status">{message}</div>}
            <button className="portal-button primary" type="submit" disabled={busy}>
              {busy ? 'Submitting...' : 'Submit Order'}
            </button>
          </form>
        </div>
      </div>

      <div className="portal-card">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Order History</div>
            <h2 className="portal-section-title" style={{ fontSize: '1.45rem' }}>Everything you already submitted</h2>
          </div>
        </div>
        <div className="portal-record-list" style={{ marginTop: '1rem' }}>
          {loading ? (
            <div className="portal-record-card">Loading...</div>
          ) : orders.length ? (
            orders.map((order) => (
              <div className="portal-record-card" key={order._id}>
                <h3 className="portal-record-title">{order.companyName || order.client?.name || order.customerName}</h3>
                <div className="portal-record-meta">
                  <span className="portal-badge status">{order.status}</span>
                  <span>{order.customerName}</span>
                  {order.contactPerson && <span>{order.contactPerson}</span>}
                  <span>{formatPortalDateTime(order.createdAt)}</span>
                  <span>{order.urgency}</span>
                </div>
                <div className="portal-record-copy">
                  {(order.items || []).map((item) => `${item.productName} x${item.quantity}${item.price !== undefined ? ` @ ${item.price}` : ''}`).join(' | ')}
                </div>
                {(order.notes || order.deliveryNote) && (
                  <div className="portal-record-copy">
                    {order.deliveryNote ? <div><strong>Delivery:</strong> {order.deliveryNote}</div> : null}
                    {order.notes ? <div><strong>Notes:</strong> {order.notes}</div> : null}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="portal-empty-state">
              <h3 className="portal-empty-title">No orders yet</h3>
              <p className="portal-empty-copy">Select or create a client above, then submit the first order from this workspace.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default StaffOrdersPage;
