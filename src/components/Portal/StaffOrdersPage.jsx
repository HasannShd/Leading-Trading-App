import { useEffect, useMemo, useRef, useState } from 'react';
import { portalApi } from '../../services/portalApi';
import { formatPortalDateTime } from '../../utils/portalDate';
import { parseLineItems } from '../../utils/orderItems';
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
  vatApplicable: false,
  vatAmount: '',
  deliveryNote: '',
  notes: '',
};

const attachmentLabel = (attachment) => attachment?.name || attachment?.url?.split('/').pop() || 'Attachment';

const StaffOrdersPage = () => {
  const [clients, setClients] = useState([]);
  const [clientQuery, setClientQuery] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [clientForm, setClientForm] = useState(blankClient);
  const [orderForm, setOrderForm] = useState(blankOrder);
  const [showClientForm, setShowClientForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [orderAttachments, setOrderAttachments] = useState([]);
  const draftKey = 'staff-draft:orders-workspace';
  const orderFormRef = useRef(null);
  const customerNameInputRef = useRef(null);

  const jumpToOrderForm = (focusField = false) => {
    window.requestAnimationFrame(() => {
      orderFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (focusField) {
        window.requestAnimationFrame(() => {
          customerNameInputRef.current?.focus();
        });
      }
    });
  };

  const load = async () => {
    setLoading(true);
    try {
      const clientsResponse = await portalApi.get('/staff-portal/clients', 'sales_staff');
      setClients(clientsResponse.data.clients || []);
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

  useEffect(() => {
    if (!selectedClient) return;
    setOrderForm((current) => ({
      ...current,
      client: selectedClient._id,
      companyName: selectedClient.name || '',
      contactPerson: selectedClient.contactPerson || '',
      customerName: selectedClient.contactPerson || selectedClient.name || '',
    }));
    jumpToOrderForm(true);
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
      jumpToOrderForm(true);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  };

  const saveDraft = () => {
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
    setMessage('Draft saved on this device.');
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
        vatApplicable: Boolean(orderForm.vatApplicable),
        vatAmount:
          orderForm.vatApplicable && orderForm.vatAmount !== ''
            ? Number(orderForm.vatAmount)
            : undefined,
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
              Pick a client from your own list before submitting an order. If the client is new, create it here first and use the separate order history page to review older submissions.
            </p>
          </div>
        </div>
        <div className="portal-grid stats" style={{ marginTop: '1rem' }}>
          <div className="portal-stat">
            <div className="portal-stat-value">{clients.length}</div>
            <div className="portal-stat-label">Clients in your list</div>
          </div>
          <div className="portal-stat">
            <div className="portal-stat-value">{selectedClient ? 'Ready' : 'Pick one'}</div>
            <div className="portal-stat-label">{selectedClient ? selectedClient.name : 'Client selection'}</div>
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
            {loading ? (
              <div className="portal-record-card">Loading clients...</div>
            ) : filteredClients.length ? (
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

        <div className="portal-card" ref={orderFormRef}>
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
                <input
                  ref={customerNameInputRef}
                  value={orderForm.customerName}
                  onChange={(e) => updateOrderForm('customerName', e.target.value)}
                  placeholder="Main contact or customer name"
                />
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
              <div className="portal-field">
                <label>VAT Applicable</label>
                <select
                  value={orderForm.vatApplicable ? 'yes' : 'no'}
                  onChange={(e) => {
                    const nextValue = e.target.value === 'yes';
                    setOrderForm((current) => ({
                      ...current,
                      vatApplicable: nextValue,
                      vatAmount: nextValue ? current.vatAmount : '',
                    }));
                  }}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              <div className="portal-field">
                <label>VAT Amount / Rate</label>
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  value={orderForm.vatAmount}
                  onChange={(e) => updateOrderForm('vatAmount', e.target.value)}
                  placeholder="Optional"
                  disabled={!orderForm.vatApplicable}
                />
              </div>
              <div className="portal-field" style={{ gridColumn: '1 / -1' }}>
                <label>Items</label>
                <textarea
                  value={orderForm.itemsText}
                  onChange={(e) => updateOrderForm('itemsText', e.target.value)}
                  placeholder="One line per item: Product Name | Quantity | UOM | Price. Example: Ultrasound Gel | 7 | pcs | 2.500"
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
              <div className="portal-field" style={{ gridColumn: '1 / -1' }}>
                <label>Attachments</label>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
                  onChange={handleOrderFiles}
                  disabled={busy}
                />
              </div>
            </div>
            {orderAttachments.length ? (
              <div className="portal-attachment-list editor" style={{ marginTop: '0.9rem' }}>
                {orderAttachments.map((attachment) => (
                  <div key={attachment.url} className="portal-inline-actions" style={{ gap: '0.5rem' }}>
                    <a className="portal-attachment-chip" href={attachment.url} target="_blank" rel="noreferrer">
                      {attachmentLabel(attachment)}
                    </a>
                    <button
                      type="button"
                      className="portal-attachment-chip removable"
                      onClick={() => removeOrderAttachment(attachment.url)}
                    >
                      Remove ×
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
            {message && <div className="portal-message-banner success">{message}</div>}
            <div className="portal-submit-bar">
              <div className="portal-actions-two portal-order-actions">
                <button className="portal-button secondary portal-save-button" type="button" onClick={saveDraft} disabled={busy}>
                  Save Draft
                </button>
                <button className="portal-button ghost portal-save-button portal-save-button-ghost" type="button" onClick={clearDraft} disabled={busy}>
                  Clear Draft
                </button>
                <button className="portal-button primary portal-save-button" type="submit" disabled={busy}>
                  {busy ? 'Submitting...' : 'Confirm and Send Order'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default StaffOrdersPage;
