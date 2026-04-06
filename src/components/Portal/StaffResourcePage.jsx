import { useMemo, useState, useEffect } from 'react';
import { portalApi } from '../../services/portalApi';
import './PortalShell.css';

const initialValues = (fields) =>
  fields.reduce((acc, field) => {
    acc[field.name] = field.type === 'select' && field.options?.[0] ? field.options[0].value : '';
    return acc;
  }, {});

const StaffResourcePage = ({ config }) => {
  const [values, setValues] = useState(() => initialValues(config.fields));
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [statusDrafts, setStatusDrafts] = useState({});

  const load = () => {
    setLoading(true);
    portalApi
      .get(config.endpoint, 'sales_staff')
      .then((response) => setRecords(response.data[Object.keys(response.data)[0]] || []))
      .catch((err) => setMessage(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [config.endpoint]);

  const fieldMap = useMemo(() => config.fields, [config.fields]);

  const handleChange = (name, value) => setValues((current) => ({ ...current, [name]: value }));

  const handleFile = async (fieldName, file) => {
    if (!file) return;
    setBusy(true);
    setMessage('Uploading file...');
    try {
      const url = await portalApi.uploadFile(file, 'sales_staff');
      handleChange(fieldName, url);
      setMessage('File uploaded.');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const payload = config.transformPayload ? config.transformPayload(values) : values;
      await portalApi.post(config.endpoint, payload, 'sales_staff');
      setValues(initialValues(fieldMap));
      setMessage(`${config.title.slice(0, -1) || 'Record'} saved.`);
      load();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleStatusUpdate = async (record) => {
    if (!config.statusPatch) return;
    setBusy(true);
    setMessage('');
    try {
      await portalApi.patch(`${config.statusPatch}/${record._id}`, { status: statusDrafts[record._id] || record.status }, 'sales_staff');
      setMessage('Status updated.');
      load();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  };

  const recordTitle = (record) =>
    record.title ||
    record.name ||
    record.customerName ||
    record.clientName ||
    record.productName ||
    record.issueType ||
    record.item ||
    record.summary ||
    'Record';

  const recordMeta = (record) =>
    [
      record.companyName,
      record.contactPerson,
      record.date,
      record.expenseDate,
      record.visitDate,
      record.visitTime,
      record.dueDate,
      record.collectionDate,
      record.assignedDate,
      record.startTime,
      record.endTime,
      record.createdAt ? new Date(record.createdAt).toLocaleString() : '',
      record.amount !== undefined ? `${record.amount} BHD` : '',
      record.proposedPrice !== undefined && record.proposedPrice !== null ? `${record.proposedPrice} BHD` : '',
    ].filter(Boolean);

  return (
    <section className="portal-page">
      <div className="portal-card dark">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Field Module</div>
            <h1 className="portal-section-title">{config.title}</h1>
            <p className="portal-section-copy" style={{ color: 'rgba(255,255,255,0.76)' }}>{config.description}</p>
          </div>
        </div>
      </div>

      <div className="portal-card portal-help-card">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Easy Use</div>
            <h2 className="portal-section-title" style={{ fontSize: '1.4rem' }}>Fill this in like a simple form</h2>
            <p className="portal-section-copy">
              Complete the main details, then press save. If you have a receipt or document, upload it first. Your saved entries will appear below so you can review what you already submitted.
            </p>
          </div>
        </div>
      </div>

      <div className="portal-card">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">New Entry</div>
            <h2 className="portal-section-title" style={{ fontSize: '1.45rem' }}>Create New Entry</h2>
          </div>
        </div>
        <form className="portal-form" onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          <div className="portal-form-grid two">
            {fieldMap.map((field) => (
              <div className="portal-field" key={field.name} style={field.type === 'textarea' ? { gridColumn: '1 / -1' } : undefined}>
                <label>{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea value={values[field.name] || ''} onChange={(e) => handleChange(field.name, e.target.value)} placeholder={field.placeholder} />
                ) : field.type === 'select' ? (
                  <select value={String(values[field.name] ?? '')} onChange={(e) => handleChange(field.name, e.target.value === 'true' ? true : e.target.value === 'false' ? false : e.target.value)}>
                    {field.options?.map((option) => (
                      <option key={String(option.value)} value={String(option.value)}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'file' ? (
                  <div className="portal-file-row">
                    <input type="file" accept="image/*,.pdf" onChange={(e) => handleFile(field.name, e.target.files?.[0])} />
                    {values[field.name] && <span className="portal-badge">Uploaded</span>}
                  </div>
                ) : (
                  <input
                    type={field.type || 'text'}
                    value={values[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </div>
          {message && <div className="portal-badge status">{message}</div>}
          <button className="portal-button primary" type="submit" disabled={busy}>
            {busy ? 'Saving...' : `Save ${config.title.replace(/s$/, '')}`}
          </button>
        </form>
      </div>

      <div className="portal-card">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">History</div>
            <h2 className="portal-section-title" style={{ fontSize: '1.45rem' }}>Recent Entries</h2>
          </div>
        </div>
        <div className="portal-record-list" style={{ marginTop: '1rem' }}>
          {loading ? (
            <div className="portal-record-card">Loading...</div>
          ) : records.length ? (
            records.map((record) => (
              <div className="portal-record-card" key={record._id}>
                <h3 className="portal-record-title">{recordTitle(record)}</h3>
                <div className="portal-record-meta">
                  {record.status && <span className="portal-badge status">{record.status}</span>}
                  {recordMeta(record).map((item) => (
                    <span key={`${record._id}-${item}`}>{item}</span>
                  ))}
                </div>
                {(record.notes || record.note || record.description || record.summary) && (
                  <div className="portal-record-copy">
                    {record.notes || record.note || record.description || record.summary}
                  </div>
                )}
                {config.statusPatch && record.status && config.statusOptions?.length ? (
                  <div className="portal-inline-actions">
                    <select
                      value={statusDrafts[record._id] || record.status}
                      onChange={(e) => setStatusDrafts((current) => ({ ...current, [record._id]: e.target.value }))}
                    >
                      {config.statusOptions.map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                    <button className="portal-inline-button secondary" type="button" onClick={() => handleStatusUpdate(record)} disabled={busy}>
                      Update
                    </button>
                  </div>
                ) : null}
              </div>
            ))
          ) : (
            <div className="portal-empty-state">
              <h3 className="portal-empty-title">No entries yet</h3>
              <p className="portal-empty-copy">
                Use the form above to create your first <strong>{config.title.replace(/s$/, '').toLowerCase()}</strong>. After saving, it will appear here in your history.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default StaffResourcePage;
