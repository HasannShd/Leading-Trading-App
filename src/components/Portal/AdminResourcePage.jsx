import { useEffect, useState } from 'react';
import { portalApi } from '../../services/portalApi';
import AdminTopNav from '../Admin/AdminTopNav';
import '../Admin/AdminCategories.css';
import { formatPortalDate, formatPortalDateTime } from '../../utils/portalDate';
import './PortalShell.css';

const AdminResourcePage = ({ config }) => {
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState('');
  const [statusDrafts, setStatusDrafts] = useState({});
  const [staff, setStaff] = useState([]);
  const [filters, setFilters] = useState({ user: '', status: '', date: '' });
  const [staffSummary, setStaffSummary] = useState(null);
  const [selectedRecordId, setSelectedRecordId] = useState('');

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

  useEffect(() => {
    setSelectedRecordId('');
  }, [config.endpoint, filters.user, filters.status, filters.date]);

  useEffect(() => {
    if (!filters.user) {
      setStaffSummary(null);
      return;
    }
    const params = new URLSearchParams();
    if (filters.date) params.set('date', filters.date);
    portalApi
      .get(`/admin-portal/staff/${filters.user}/summary${params.toString() ? `?${params.toString()}` : ''}`, 'admin')
      .then((response) => setStaffSummary(response.data))
      .catch(() => setStaffSummary(null));
  }, [filters.user, filters.date]);

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
  const isAttendancePage = (config.exportKey || configKey) === 'attendance';
  const isReportsPage = (config.exportKey || configKey) === 'reports';

  const recordTitle = (record) =>
    record.title ||
    record.name ||
    record.customerName ||
    record.clientName ||
    record.action ||
    record.item ||
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
      record.checkInTime ? `In ${formatPortalDateTime(record.checkInTime)}` : '',
      record.checkOutTime ? `Out ${formatPortalDateTime(record.checkOutTime)}` : '',
      record.expenseDate,
      record.createdAt ? formatPortalDateTime(record.createdAt) : '',
      record.amount !== undefined ? `${record.amount} BHD` : '',
      record.mileageWeekStart !== undefined && record.mileageWeekStart !== null ? `Start km ${record.mileageWeekStart}` : '',
      record.mileageWeekEnd !== undefined && record.mileageWeekEnd !== null ? `End km ${record.mileageWeekEnd}` : '',
    ].filter(Boolean);

  const renderAttendanceRecord = (record) => {
    const attendanceStatus = record.checkInTime && record.checkOutTime ? 'Complete day' : record.checkInTime ? 'Checked in only' : 'No check-in';
    return (
      <div className="portal-record-card" key={record._id}>
        <div className="portal-staff-report-row">
          <strong>{record.user?.name || record.user?.username || 'Staff'}</strong>
          <span>{record.date ? formatPortalDate(record.date) : 'No date'}</span>
        </div>
        <div className="portal-record-meta">
          <span className="portal-badge status">{attendanceStatus}</span>
          <span>Logged: {record.createdAt ? formatPortalDateTime(record.createdAt) : '-'}</span>
          <span>Total worked: {record.totalWorkedMinutes || 0} min</span>
        </div>
        <div className="portal-staff-report-list">
          <div className="portal-staff-report-row">
            <strong>Check in</strong>
            <span>{record.checkInTime ? formatPortalDateTime(record.checkInTime) : 'Not recorded'}</span>
          </div>
          <div className="portal-staff-report-row">
            <strong>Check out</strong>
            <span>{record.checkOutTime ? formatPortalDateTime(record.checkOutTime) : 'Not recorded'}</span>
          </div>
          <div className="portal-staff-report-row">
            <strong>Week start mileage</strong>
            <span>
              {record.mileageWeekStart ?? '-'}
              {record.mileageWeekStartAt ? ` • entered ${formatPortalDateTime(record.mileageWeekStartAt)}` : ''}
            </span>
          </div>
          <div className="portal-staff-report-row">
            <strong>Week end mileage</strong>
            <span>
              {record.mileageWeekEnd ?? '-'}
              {record.mileageWeekEndAt ? ` • entered ${formatPortalDateTime(record.mileageWeekEndAt)}` : ''}
            </span>
          </div>
        </div>
        {(record.checkInNote || record.checkOutNote) && (
          <div className="portal-record-copy">
            {[record.checkInNote ? `Check-in note: ${record.checkInNote}` : '', record.checkOutNote ? `Check-out note: ${record.checkOutNote}` : '']
              .filter(Boolean)
              .join(' | ')}
          </div>
        )}
      </div>
    );
  };

  const renderDefaultRecord = (record) => (
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
  );
  const pendingStatuses = new Set(['submitted', 'pending', 'under_review', 'reviewed', 'partial', 'overdue']);
  const pendingCount = records.filter((record) => pendingStatuses.has(record.status)).length;
  const assignedPeople = new Set(records.map((record) => record.user?._id).filter(Boolean)).size;
  const selectedReport = records.find((record) => record._id === selectedRecordId) || null;

  return (
    <div className="admin-categories">
      <AdminTopNav />
      <section className="portal-page">
      <div className="portal-card portal-help-card">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">How To Use This Page</div>
            <h2 className="portal-section-title" style={{ fontSize: '1.45rem' }}>Simple admin view</h2>
            <p className="portal-section-copy">
              Use the filters first, then review the latest entries below. If nothing is showing yet, it usually means staff have not submitted anything in this section yet.
            </p>
          </div>
        </div>
        <ul className="portal-help-list">
          <li>Use `All staff` to see everything, or choose one person to focus on.</li>
          {config.supportsStatus && <li>Use the status filter to find pending work faster.</li>}
          {config.supportsDate && <li>Use the date filter to review one day at a time.</li>}
          {config.statusPatch && <li>You can update statuses directly from the cards below.</li>}
        </ul>
      </div>

      <div className="portal-card">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Admin View</div>
            <h1 className="portal-section-title" style={{ fontSize: '1.8rem' }}>{config.title}</h1>
            <p className="portal-section-copy">
              {isAttendancePage
                ? 'Review check-in, check-out, mileage, and worked time clearly for each staff member. Use the filters to inspect one staff member or one working day.'
                : isReportsPage
                  ? 'Review daily reports only. Click one report to open its full details and notes.'
                : 'Review entries below, use the filters to narrow the list, and update statuses from the cards when needed.'}
            </p>
          </div>
          {['attendance', 'reports', 'orders', 'visits'].includes(config.exportKey || configKey) && (
            <button className="portal-inline-button ghost" type="button" onClick={handleExport}>Export CSV</button>
          )}
        </div>
        <div className="portal-grid stats portal-module-stats" style={{ marginTop: '1rem' }}>
          <div className="portal-stat light">
            <div className="portal-stat-value">{records.length}</div>
            <div className="portal-stat-label">Visible records</div>
          </div>
          <div className="portal-stat light">
            <div className="portal-stat-value">{pendingCount}</div>
            <div className="portal-stat-label">Need review</div>
          </div>
          <div className="portal-stat light">
            <div className="portal-stat-value">{assignedPeople}</div>
            <div className="portal-stat-label">Staff shown</div>
          </div>
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
        {staffSummary?.staff && (
          <div className="portal-admin-staff-focus">
            <div className="portal-admin-staff-focus-head">
              <div>
                <div className="portal-brand-kicker">Selected Staff</div>
                <h3 className="portal-record-title" style={{ fontSize: '1.2rem' }}>
                  {staffSummary.staff.name || staffSummary.staff.username}
                </h3>
                <div className="portal-record-meta">
                  <span>{staffSummary.staff.department || 'No department'}</span>
                  <span>{staffSummary.staff.phone || 'No phone'}</span>
                  <span>{staffSummary.staff.email}</span>
                </div>
              </div>
              <div className="portal-inline-actions tight">
                <span className="portal-badge status">
                  {staffSummary.staff.isActive ? 'Active staff account' : 'Inactive staff account'}
                </span>
                <button
                  className="portal-inline-button ghost"
                  type="button"
                  onClick={() => window.open(`/admin/staff`, '_self')}
                >
                  Open Full Staff Summary
                </button>
              </div>
            </div>
            <div className="portal-staff-summary-grid compact">
              <div className="portal-stat light">
                <div className="portal-stat-value">{filters.date ? staffSummary.metrics.filteredReportsCount : staffSummary.metrics.reportsCount}</div>
                <div className="portal-stat-label">{filters.date ? 'Reports on selected date' : 'Reports'}</div>
              </div>
              <div className="portal-stat light">
                <div className="portal-stat-value">{filters.date ? staffSummary.metrics.filteredOrdersCount : staffSummary.metrics.ordersCount}</div>
                <div className="portal-stat-label">{filters.date ? 'Orders on selected date' : 'Orders'}</div>
              </div>
              <div className="portal-stat light">
                <div className="portal-stat-value">{filters.date ? staffSummary.metrics.filteredClientsCount : staffSummary.metrics.clientsCount}</div>
                <div className="portal-stat-label">{filters.date ? 'Clients added on selected date' : 'Clients'}</div>
              </div>
            </div>
            {isReportsPage && (
              <div className="portal-staff-report-block" style={{ marginTop: '0.5rem' }}>
                <div className="portal-brand-kicker">Latest Report</div>
                <div className="portal-staff-report-list">
                  <div className="portal-staff-report-row">
                    <strong>Report date</strong>
                    <span>{staffSummary.latest.report?.date ? formatPortalDate(staffSummary.latest.report.date) : 'No report yet'}</span>
                  </div>
                  <div className="portal-staff-report-row">
                    <strong>Submitted</strong>
                    <span>{staffSummary.latest.report?.createdAt ? formatPortalDateTime(staffSummary.latest.report.createdAt) : 'No report yet'}</span>
                  </div>
                  <div className="portal-staff-report-row">
                    <strong>Summary</strong>
                    <span>{staffSummary.latest.report?.summary || 'No report yet'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {message && <div className="portal-badge status" style={{ marginTop: '1rem' }}>{message}</div>}
        <div className="portal-record-list" style={{ marginTop: '1rem' }}>
          {records.length ? (
            isReportsPage ? (
              <>
                <div className="portal-inline-list compact">
                  {records.map((record) => (
                    <button
                      key={record._id}
                      type="button"
                      className={`portal-record-card portal-record-card-button${selectedReport?._id === record._id ? ' is-selected' : ''}`}
                      onClick={() => setSelectedRecordId((current) => (current === record._id ? '' : record._id))}
                    >
                      <h3 className="portal-record-title">{record.user?.name || record.user?.username || 'Staff'}</h3>
                      <div className="portal-record-meta">
                        <span>{record.date ? formatPortalDate(record.date) : '-'}</span>
                        <span>{record.createdAt ? formatPortalDateTime(record.createdAt) : '-'}</span>
                      </div>
                    </button>
                  ))}
                </div>
                {selectedReport && (
                  <div className="portal-record-card">
                    <h3 className="portal-record-title">{selectedReport.user?.name || selectedReport.user?.username || 'Daily Report'}</h3>
                    <div className="portal-record-meta">
                      <span>{selectedReport.date ? formatPortalDate(selectedReport.date) : '-'}</span>
                      <span>{selectedReport.createdAt ? formatPortalDateTime(selectedReport.createdAt) : '-'}</span>
                      <span>Follow up: {selectedReport.followUpNeeded ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="portal-note-block">
                      <div className="portal-detail-label">Summary</div>
                      <div className="portal-record-copy">{selectedReport.summary || '-'}</div>
                    </div>
                    {selectedReport.notes && (
                      <div className="portal-note-block">
                        <div className="portal-detail-label">Notes</div>
                        <div className="portal-record-copy">{selectedReport.notes}</div>
                      </div>
                    )}
                    {!!selectedReport.visits?.length && (
                      <div className="portal-note-block">
                        <div className="portal-detail-label">Visits Mentioned</div>
                        <div className="portal-record-copy">
                          {selectedReport.visits.map((visit) => `${visit.clientName || 'Client'}: ${visit.outcome || '-'}`).join(' | ')}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              records.map((record) => (isAttendancePage ? renderAttendanceRecord(record) : renderDefaultRecord(record)))
            )
          ) : (
            <div className="portal-empty-state">
              <h3 className="portal-empty-title">Nothing to review yet</h3>
              <p className="portal-empty-copy">
                Nothing has been submitted in <strong>{config.title}</strong> yet. Once staff start using the portal, their entries will appear here automatically. If this is your first setup, create staff users first and guide them to the staff portal.
              </p>
            </div>
          )}
        </div>
      </div>
      </section>
    </div>
  );
};

export default AdminResourcePage;
