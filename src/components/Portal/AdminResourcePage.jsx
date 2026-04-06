import { useEffect, useState } from 'react';
import { portalApi } from '../../services/portalApi';
import './PortalShell.css';

const AdminResourcePage = ({ config }) => {
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState('');
  const [statusDrafts, setStatusDrafts] = useState({});
  const [staff, setStaff] = useState([]);
  const [filters, setFilters] = useState({ user: '', status: '', date: '' });

  const buildQuery = () => {
    const params = new URLSearchParams();
    if (config.supportsUser && filters.user) params.set('user', filters.user);
    if (config.supportsStatus && filters.status) params.set('status', filters.status);
    if (config.supportsDate && filters.date) params.set('date', filters.date);
    const query = params.toString();
    return query ? `${config.endpoint}?${query}` : config.endpoint;
  };

  const load = () =>
    portalApi
      .get(buildQuery(), 'admin')
      .then((response) => setRecords(response.data[Object.keys(response.data)[0]] || []))
      .catch((err) => setMessage(err.message));

  useEffect(() => {
    if (config.supportsUser) {
      portalApi
        .get('/admin-portal/staff', 'admin')
        .then((response) => setStaff(response.data.staff))
        .catch(() => {});
    }
  }, [config.supportsUser]);

  useEffect(() => {
    load();
  }, [config.endpoint, filters.user, filters.status, filters.date]);

  const handleStatusUpdate = async (record) => {
    try {
      await portalApi.patch(`${config.statusPatch}/${record._id}`, { status: statusDrafts[record._id] || record.status }, 'admin');
      setMessage('Status updated.');
      load();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin-portal/exports/${config.exportKey || configKey}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${config.exportKey || config.title.toLowerCase().replace(/\s+/g, '-')}.csv`;
      anchor.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setMessage('Export failed.');
    }
  };

  const configKey = config.endpoint.split('/').pop();

  const recordTitle = (record) =>
    record.title ||
    record.name ||
    record.customerName ||
    record.clientName ||
    record.action ||
    record.item ||
    record.productName ||
    record.issueType ||
    'Record';

  const recordMeta = (record) =>
    [
      record.user?.name || record.user?.username,
      record.department,
      record.date,
      record.assignedDate,
      record.visitDate,
      record.visitTime,
      record.startTime,
      record.endTime,
      record.checkInTime ? `In ${new Date(record.checkInTime).toLocaleString()}` : '',
      record.checkOutTime ? `Out ${new Date(record.checkOutTime).toLocaleString()}` : '',
      record.expenseDate,
      record.dueDate,
      record.createdAt ? new Date(record.createdAt).toLocaleString() : '',
      record.amount !== undefined ? `${record.amount} BHD` : '',
      record.mileageWeekStart !== undefined && record.mileageWeekStart !== null ? `Start km ${record.mileageWeekStart}` : '',
      record.mileageWeekEnd !== undefined && record.mileageWeekEnd !== null ? `End km ${record.mileageWeekEnd}` : '',
      record.proposedPrice !== undefined && record.proposedPrice !== null ? `${record.proposedPrice} BHD` : '',
    ].filter(Boolean);

  return (
    <section className="portal-page">
      <div className="portal-card">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Admin View</div>
            <h1 className="portal-section-title" style={{ fontSize: '1.8rem' }}>{config.title}</h1>
          </div>
          {['attendance', 'reports', 'expenses', 'orders', 'visits', 'followups'].includes(config.exportKey || configKey) && (
            <button className="portal-inline-button ghost" type="button" onClick={handleExport}>Export CSV</button>
          )}
        </div>
        {(config.supportsUser || config.supportsStatus || config.supportsDate) && (
          <div className="portal-filter-bar">
            {config.supportsUser && (
              <select value={filters.user} onChange={(e) => setFilters((current) => ({ ...current, user: e.target.value }))}>
                <option value="">All staff</option>
                {staff.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name || member.username}
                  </option>
                ))}
              </select>
            )}
            {config.supportsStatus && (
              <select value={filters.status} onChange={(e) => setFilters((current) => ({ ...current, status: e.target.value }))}>
                <option value="">All statuses</option>
                {(config.statusOptions || []).map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            )}
            {config.supportsDate && (
              <input type="date" value={filters.date} onChange={(e) => setFilters((current) => ({ ...current, date: e.target.value }))} />
            )}
          </div>
        )}
        {message && <div className="portal-badge status" style={{ marginTop: '1rem' }}>{message}</div>}
        <div className="portal-record-list" style={{ marginTop: '1rem' }}>
          {records.map((record) => (
            <div className="portal-record-card" key={record._id}>
              <h3 className="portal-record-title">{recordTitle(record)}</h3>
              <div className="portal-record-meta">
                {recordMeta(record).map((item) => (
                  <span key={`${record._id}-${item}`}>{item}</span>
                ))}
                {record.status && <span className="portal-badge status">{record.status}</span>}
              </div>
              {(record.notes || record.note || record.description || record.summary || record.message) && (
                <div className="portal-record-copy">
                  {record.notes || record.note || record.description || record.summary || record.message}
                </div>
              )}
              {config.statusPatch && record.status && (
                <div className="portal-inline-actions">
                  <select
                    value={statusDrafts[record._id] || record.status}
                    onChange={(e) => setStatusDrafts((current) => ({ ...current, [record._id]: e.target.value }))}
                  >
                    {(config.statusOptions || ['submitted', 'under_review', 'approved', 'rejected', 'paid', 'reviewed', 'emailed', 'confirmed', 'delivered', 'cancelled', 'pending', 'partial', 'collected', 'overdue', 'resolved', 'closed', 'fulfilled']).map((value) => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </select>
                  <button className="portal-inline-button secondary" type="button" onClick={() => handleStatusUpdate(record)}>Update</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminResourcePage;
