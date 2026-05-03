import { useCallback, useEffect, useMemo, useState } from 'react';
import './AdminCategories.css';
import AdminTopNav from './AdminTopNav';
import { authFetch } from '../../services/authFetch';

const LINKEDIN_URL = 'https://www.linkedin.com/company/leading-trading-est/';
const INSTAGRAM_URL = 'https://www.instagram.com/leadingtradingest/';

const emptyCampaign = {
  subject: 'Follow Leading Trading Est for product updates',
  previewText: 'Stay connected with LTE on Instagram and LinkedIn.',
  instagramUrl: INSTAGRAM_URL,
  linkedinUrl: LINKEDIN_URL,
};

const parseCsvLine = (line) => {
  const cells = [];
  let current = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];
    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      cells.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  cells.push(current.trim());
  return cells;
};

const parseCsv = (text) => {
  const rows = String(text || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (!rows.length) return [];

  const headers = parseCsvLine(rows[0]).map((header) => header.trim());
  return rows.slice(1).map((row) => {
    const values = parseCsvLine(row);
    return headers.reduce((record, header, index) => {
      record[header] = values[index] || '';
      return record;
    }, {});
  });
};

const AdminMarketing = () => {
  const [contacts, setContacts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [totals, setTotals] = useState({ total: 0, eligible: 0, unsubscribed: 0 });
  const [smtpConfigured, setSmtpConfigured] = useState(false);
  const [campaign, setCampaign] = useState(emptyCampaign);
  const [csvRows, setCsvRows] = useState([]);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const eligibleContacts = useMemo(
    () => contacts.filter((contact) => contact.email && !contact.unsubscribedAt && contact.consentStatus !== 'unsubscribed'),
    [contacts]
  );

  const fetchMarketing = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [contactsResponse, campaignsResponse] = await Promise.all([
        authFetch('/marketing/contacts', { scope: 'admin' }),
        authFetch('/marketing/campaigns', { scope: 'admin' }),
      ]);
      const contactsData = await contactsResponse.json().catch(() => ({}));
      const campaignsData = await campaignsResponse.json().catch(() => []);

      if (!contactsResponse.ok) {
        throw new Error(contactsData.err || contactsData.message || 'Failed to load marketing contacts.');
      }

      setContacts(Array.isArray(contactsData.contacts) ? contactsData.contacts : []);
      setTotals(contactsData.totals || { total: 0, eligible: 0, unsubscribed: 0 });
      setSmtpConfigured(Boolean(contactsData.smtpConfigured));
      setCampaign((prev) => ({
        ...prev,
        instagramUrl: contactsData.defaultInstagramUrl || prev.instagramUrl || INSTAGRAM_URL,
        linkedinUrl: contactsData.defaultLinkedinUrl || prev.linkedinUrl || LINKEDIN_URL,
      }));
      setCampaigns(Array.isArray(campaignsData) ? campaignsData : []);
    } catch (err) {
      setError(err.message || 'Failed to load marketing contacts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketing();
  }, [fetchMarketing]);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    setStatus('');
    setError('');
    if (!file) {
      setCsvRows([]);
      return;
    }

    try {
      const text = await file.text();
      const rows = parseCsv(text);
      setCsvRows(rows);
      setStatus(`${rows.length} contacts ready to import from CSV.`);
    } catch {
      setCsvRows([]);
      setError('Could not read that CSV file.');
    }
  };

  const importCsv = async () => {
    if (!csvRows.length) {
      setError('Choose a CSV file first.');
      return;
    }

    setLoading(true);
    setError('');
    setStatus('');
    try {
      const response = await authFetch('/marketing/contacts/import', {
        scope: 'admin',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contacts: csvRows }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.err || 'CSV import failed.');
      setStatus(`Import complete: ${data.created} created, ${data.updated} updated, ${data.skipped} skipped.`);
      setCsvRows([]);
      await fetchMarketing();
    } catch (err) {
      setError(err.message || 'CSV import failed.');
    } finally {
      setLoading(false);
    }
  };

  const syncClients = async () => {
    setLoading(true);
    setError('');
    setStatus('');
    try {
      const response = await authFetch('/marketing/contacts/sync-clients', {
        scope: 'admin',
        method: 'POST',
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.err || 'Client sync failed.');
      setStatus(`Client sync complete: ${data.created} created, ${data.updated} updated, ${data.skipped} skipped.`);
      await fetchMarketing();
    } catch (err) {
      setError(err.message || 'Client sync failed.');
    } finally {
      setLoading(false);
    }
  };

  const sendCampaign = async () => {
    if (!eligibleContacts.length) {
      setError('There are no eligible contacts to send to.');
      return;
    }
    if (!campaign.instagramUrl && !campaign.linkedinUrl) {
      setError('Add Instagram or LinkedIn before sending.');
      return;
    }

    const confirmed = window.confirm(
      `Send one individual email to each eligible contact (${eligibleContacts.length} recipients)?`
    );
    if (!confirmed) return;

    setSending(true);
    setError('');
    setStatus('');
    try {
      const response = await authFetch('/marketing/campaigns/social-follow/send', {
        scope: 'admin',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaign),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.err || 'Campaign send failed.');
      setStatus(`Campaign finished: ${data.totals.sent} sent, ${data.totals.skipped} skipped, ${data.totals.failed} failed.`);
      await fetchMarketing();
    } catch (err) {
      setError(err.message || 'Campaign send failed.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="admin-categories admin-surface">
      <AdminTopNav />
      <section className="admin-surface-hero">
        <div className="admin-surface-eyebrow">Marketing Campaigns</div>
        <div className="admin-surface-hero-row">
          <div className="admin-surface-copy">
            <h1>Send professional one-to-one social follow campaigns.</h1>
            <p>
              Import client contacts, sync existing client records, and send each recipient their own individual email
              with separate unsubscribe tracking.
            </p>
          </div>
          <div className="admin-surface-actions">
            <button className="admin-btn-secondary" onClick={fetchMarketing} disabled={loading || sending}>Refresh</button>
            <button className="admin-add-btn" onClick={syncClients} disabled={loading || sending}>Sync Clients</button>
          </div>
        </div>
        <div className="admin-surface-stats">
          <div className="admin-surface-stat">
            <strong>{totals.total}</strong>
            <span>Total contacts</span>
          </div>
          <div className="admin-surface-stat">
            <strong>{totals.eligible}</strong>
            <span>Eligible to email</span>
          </div>
          <div className="admin-surface-stat">
            <strong>{totals.unsubscribed}</strong>
            <span>Unsubscribed</span>
          </div>
          <div className="admin-surface-stat">
            <strong>{smtpConfigured ? 'Ready' : 'Missing'}</strong>
            <span>SMTP status</span>
          </div>
        </div>
      </section>

      {error ? <div className="admin-error">{error}</div> : null}
      {status ? <div className="admin-success">{status}</div> : null}
      {!smtpConfigured ? (
        <div className="admin-error">
          SMTP is not configured on the backend. Imports will work, but campaigns will be skipped until SMTP is set.
        </div>
      ) : null}

      <section className="admin-surface-grid admin-marketing-grid">
        <div className="admin-form-container">
          <div className="admin-panel-heading">
            <div>
              <h2>Import client emails</h2>
              <p>CSV headers supported: email, name, companyName, phone, source, notes, consentStatus.</p>
            </div>
          </div>
          <div className="admin-form">
            <div className="admin-form-group">
              <label>CSV file</label>
              <input type="file" accept=".csv,text/csv" onChange={handleFile} />
              <small>{csvRows.length ? `${csvRows.length} rows parsed and ready.` : 'Upload a CSV exported from your client list.'}</small>
            </div>
            <div className="admin-form-actions">
              <button className="admin-add-btn" type="button" onClick={importCsv} disabled={loading || sending || !csvRows.length}>
                Import CSV
              </button>
            </div>
          </div>
        </div>

        <div className="admin-form-container">
          <div className="admin-panel-heading">
            <div>
              <h2>Follow-us campaign</h2>
              <p>Each eligible client receives a separate email with individual unsubscribe handling.</p>
            </div>
          </div>
          <div className="admin-form">
            <div className="admin-form-group">
              <label>Subject</label>
              <input value={campaign.subject} onChange={(e) => setCampaign((prev) => ({ ...prev, subject: e.target.value }))} />
            </div>
            <div className="admin-form-group">
              <label>Preview text</label>
              <input value={campaign.previewText} onChange={(e) => setCampaign((prev) => ({ ...prev, previewText: e.target.value }))} />
            </div>
            <div className="admin-form-group">
              <label>Instagram URL</label>
              <input placeholder="https://www.instagram.com/..." value={campaign.instagramUrl} onChange={(e) => setCampaign((prev) => ({ ...prev, instagramUrl: e.target.value }))} />
            </div>
            <div className="admin-form-group">
              <label>LinkedIn URL</label>
              <input value={campaign.linkedinUrl} onChange={(e) => setCampaign((prev) => ({ ...prev, linkedinUrl: e.target.value }))} />
            </div>
            <div className="admin-form-actions">
              <button className="admin-add-btn" type="button" onClick={sendCampaign} disabled={sending || loading || !eligibleContacts.length}>
                {sending ? 'Sending...' : `Send to ${eligibleContacts.length} contacts`}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="admin-categories-list">
        <div className="admin-panel-heading">
          <div>
            <h2>Marketing Contacts ({contacts.length})</h2>
            <p>Only eligible contacts are included when you send a campaign.</p>
          </div>
        </div>
        {loading ? (
          <p className="loading">Loading...</p>
        ) : (
          <div className="categories-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Company</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Last sent</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact._id || contact.email}>
                    <td className="col-name" data-label="Name">{contact.name || '-'}</td>
                    <td data-label="Company">{contact.companyName || '-'}</td>
                    <td data-label="Email">{contact.email}</td>
                    <td data-label="Status">
                      <span className={`status-badge ${contact.unsubscribedAt ? 'inactive' : 'active'}`}>
                        {contact.unsubscribedAt ? 'Unsubscribed' : contact.consentStatus || 'Eligible'}
                      </span>
                    </td>
                    <td data-label="Last sent">{contact.lastCampaignSentAt ? new Date(contact.lastCampaignSentAt).toLocaleString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-categories-list">
        <div className="admin-panel-heading">
          <div>
            <h2>Recent Campaigns</h2>
            <p>Use these totals to confirm delivery attempts and skipped recipients.</p>
          </div>
        </div>
        <div className="categories-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Status</th>
                <th>Sent</th>
                <th>Skipped</th>
                <th>Failed</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((item) => (
                <tr key={item._id}>
                  <td className="col-name" data-label="Subject">{item.subject}</td>
                  <td data-label="Status"><span className="status-badge active">{item.status}</span></td>
                  <td data-label="Sent">{item.totals?.sent || 0}</td>
                  <td data-label="Skipped">{item.totals?.skipped || 0}</td>
                  <td data-label="Failed">{item.totals?.failed || 0}</td>
                  <td data-label="Date">{item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminMarketing;
