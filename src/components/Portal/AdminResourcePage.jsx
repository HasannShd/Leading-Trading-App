import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { portalApi } from '../../services/portalApi';
import { authFetch, API_URL } from '../../services/authFetch';
import { formatOrderItem } from '../../utils/orderItems';
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
  const selectedRecordRef = useRef(null);
  const [searchParams] = useSearchParams();
  const focusedRecordId = searchParams.get('focus') || '';
  const statusOptions = config.statusOptions || [];
  const prettyStatus = (value) => String(value || '-').replace(/_/g, ' ');
  const getOrderFacilityName = (record) =>
    record.companyName || record.client?.name || record.customerName || record.contactPerson || 'Order';

  const buildQuery = useCallback(() => {
    const params = new URLSearchParams();
    if (config.supportsUser && filters.user) params.set('user', filters.user);
    if (config.supportsStatus && filters.status) params.set('status', filters.status);
    if (config.supportsDate && filters.date) params.set('date', filters.date);
    const query = params.toString();
    return query ? `${config.endpoint}?${query}` : config.endpoint;
  }, [config.endpoint, config.supportsDate, config.supportsStatus, config.supportsUser, filters.date, filters.status, filters.user]);

  const load = useCallback(() =>
    portalApi
      .get(buildQuery(), 'admin')
      .then((response) => setRecords(response.data[Object.keys(response.data)[0]] || []))
      .catch((err) => setMessage(err.message)), [buildQuery]);

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
  }, [load]);

  useEffect(() => {
    setSelectedRecordId('');
  }, [config.endpoint, filters.user, filters.status, filters.date]);

  useEffect(() => {
    if (!focusedRecordId) return;
    if (records.some((record) => record._id === focusedRecordId)) {
      setSelectedRecordId(focusedRecordId);
    }
  }, [focusedRecordId, records]);

  useEffect(() => {
    if (!selectedReport || !selectedRecordRef.current) return;
    selectedRecordRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [selectedReport]);

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
      const response = await authFetch(`/admin-portal/exports/${config.exportKey || configKey}`, { scope: 'admin' });
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
  const isOrdersPage = (config.exportKey || configKey) === 'orders';
  const isClientsPage = (config.exportKey || configKey) === 'clients';
  const isVisitsPage = (config.exportKey || configKey) === 'visits';

  const recordTitle = (record) =>
    record.title ||
    record.name ||
    record.companyName ||
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
      record.mileageWeekStart !== undefined && record.mileageWeekStart !== null ? `Day start km ${record.mileageWeekStart}` : '',
      record.mileageWeekEnd !== undefined && record.mileageWeekEnd !== null ? `Day end km ${record.mileageWeekEnd}` : '',
    ].filter(Boolean);

  const renderAttendanceRecord = (record) => {
    const attendanceStatus = record.checkInTime && record.checkOutTime ? 'Complete day' : record.checkInTime ? 'Checked in only' : 'No check-in';
    return (
      <div className="portal-record-card portal-attendance-record-card" key={record._id}>
        <div className="portal-attendance-record-head">
          <div className="portal-attendance-record-identity">
            <strong>{record.user?.name || record.user?.username || 'Staff'}</strong>
            <span>{record.date ? formatPortalDate(record.date) : 'No date'}</span>
          </div>
          <span className="portal-badge status">{attendanceStatus}</span>
        </div>
        <div className="portal-record-meta portal-attendance-record-meta">
          <span>Logged: {record.createdAt ? formatPortalDateTime(record.createdAt) : '-'}</span>
          <span>Total worked: {record.totalWorkedMinutes || 0} min</span>
        </div>
        <div className="portal-attendance-detail-grid">
          <div className="portal-detail-item compact">
            <span className="portal-detail-label">Check in</span>
            <span className="portal-detail-value">{record.checkInTime ? formatPortalDateTime(record.checkInTime) : 'Not recorded'}</span>
          </div>
          <div className="portal-detail-item compact">
            <span className="portal-detail-label">Check out</span>
            <span className="portal-detail-value">{record.checkOutTime ? formatPortalDateTime(record.checkOutTime) : 'Not recorded'}</span>
          </div>
          <div className="portal-detail-item compact">
            <span className="portal-detail-label">Day start mileage</span>
            <span className="portal-detail-value">
              {record.mileageWeekStart ?? '-'}
              {record.mileageWeekStartAt ? ` • entered ${formatPortalDateTime(record.mileageWeekStartAt)}` : ''}
            </span>
          </div>
          <div className="portal-detail-item compact">
            <span className="portal-detail-label">Day end mileage</span>
            <span className="portal-detail-value">
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
  const selectedReport = useMemo(
    () => records.find((record) => record._id === selectedRecordId) || null,
    [records, selectedRecordId]
  );

  return (
    <div className="portal-admin-page">
      <section className="portal-page">
      <div className={`portal-card${isAttendancePage ? ' portal-resource-card compact' : ''}`}>
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Admin View</div>
            <h1 className="portal-section-title" style={{ fontSize: '1.8rem' }}>{config.title}</h1>
          </div>
          {['attendance', 'reports', 'orders', 'visits'].includes(config.exportKey || configKey) && (
            <button className="portal-inline-button ghost" type="button" onClick={handleExport}>Export CSV</button>
          )}
        </div>
        <div className={`portal-grid stats portal-module-stats${isAttendancePage ? ' compact' : ''}`} style={{ marginTop: '1rem' }}>
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
          <div className={`portal-filter-bar${isAttendancePage ? ' compact' : ''}`}>
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
                {statusOptions.map((value) => (
                  <option key={value} value={value}>
                    {prettyStatus(value)}
                  </option>
                ))}
              </select>
            )}
            {config.supportsDate && (
              <input type="date" value={filters.date} onChange={(e) => setFilters((current) => ({ ...current, date: e.target.value }))} />
            )}
          </div>
        )}
        {staffSummary?.staff && !isClientsPage && !isVisitsPage && (
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
              {!isOrdersPage && (
                <div className="portal-stat light">
                  <div className="portal-stat-value">{filters.date ? staffSummary.metrics.filteredReportsCount : staffSummary.metrics.reportsCount}</div>
                  <div className="portal-stat-label">{filters.date ? 'Reports on selected date' : 'Reports'}</div>
                </div>
              )}
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
            {isOrdersPage && (
              <div className="portal-staff-report-block" style={{ marginTop: '0.5rem' }}>
                <div className="portal-brand-kicker">Latest Order</div>
                  <div className="portal-staff-report-list">
                  <div className="portal-staff-report-row">
                    <strong>Client</strong>
                    <span>{getOrderFacilityName(staffSummary.latest.order || {}) || 'No order yet'}</span>
                  </div>
                  <div className="portal-staff-report-row">
                    <strong>Submitted</strong>
                    <span>{staffSummary.latest.order?.createdAt ? formatPortalDateTime(staffSummary.latest.order.createdAt) : 'No order yet'}</span>
                  </div>
                  <div className="portal-staff-report-row">
                    <strong>Status</strong>
                    <span>{staffSummary.latest.order?.status || 'No order yet'}</span>
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
                  <div className="portal-record-card" ref={selectedRecordRef}>
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
            ) : isOrdersPage ? (
              <>
                <div className="portal-inline-list compact">
                  {records.map((record) => (
                    <button
                      key={record._id}
                      type="button"
                      className={`portal-record-card portal-record-card-button${selectedReport?._id === record._id ? ' is-selected' : ''}`}
                      onClick={() => setSelectedRecordId((current) => (current === record._id ? '' : record._id))}
                    >
                      <h3 className="portal-record-title">{getOrderFacilityName(record)}</h3>
                      <div className="portal-record-meta">
                        <span>{record.createdAt ? formatPortalDateTime(record.createdAt) : '-'}</span>
                        {record.status && <span className="portal-badge status">{prettyStatus(record.status)}</span>}
                      </div>
                    </button>
                  ))}
                </div>
                {selectedReport && (
                  <div className="portal-record-card" ref={selectedRecordRef}>
                    <h3 className="portal-record-title">{getOrderFacilityName(selectedReport)}</h3>
                    <div className="portal-record-meta">
                      <span>{selectedReport.createdAt ? formatPortalDateTime(selectedReport.createdAt) : '-'}</span>
                      <span>{prettyStatus(selectedReport.status)}</span>
                      <span>{selectedReport.urgency || '-'}</span>
                    </div>
                    <div className="portal-detail-grid">
                      <div className="portal-detail-item">
                        <span className="portal-detail-label">Facility</span>
                        <span className="portal-detail-value">{getOrderFacilityName(selectedReport)}</span>
                      </div>
                      <div className="portal-detail-item">
                        <span className="portal-detail-label">Contact</span>
                        <span className="portal-detail-value">{selectedReport.contactPerson || '-'}</span>
                      </div>
                      <div className="portal-detail-item">
                        <span className="portal-detail-label">VAT</span>
                        <span className="portal-detail-value">
                          {selectedReport.vatApplicable ? selectedReport.vatAmount ?? 'Applicable' : 'Not applied'}
                        </span>
                      </div>
                    </div>
                    <div className="portal-note-block">
                      <div className="portal-detail-label">Items</div>
                      <div className="portal-record-copy">
                        {(selectedReport.items || []).map((item) => formatOrderItem(item)).join(' | ') || '-'}
                      </div>
                    </div>
                    {selectedReport.deliveryNote && (
                      <div className="portal-note-block">
                        <div className="portal-detail-label">Delivery Note</div>
                        <div className="portal-record-copy">{selectedReport.deliveryNote}</div>
                      </div>
                    )}
                    {selectedReport.notes && (
                      <div className="portal-note-block">
                        <div className="portal-detail-label">Notes</div>
                        <div className="portal-record-copy">{selectedReport.notes}</div>
                      </div>
                    )}
                    {selectedReport.attachments?.length ? (
                      <div className="portal-note-block">
                        <div className="portal-detail-label">Attachments</div>
                        <div className="portal-attachment-list">
                          {selectedReport.attachments.map((attachment, index) => (
                            <a
                              key={`${selectedReport._id}-${attachment.url || index}`}
                              className="portal-attachment-chip"
                              href={attachment.url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {attachment.name || attachment.url?.split('/').pop() || `Attachment ${index + 1}`}
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : null}
                    {config.statusPatch && selectedReport.status && (
                      <div className="portal-inline-actions" style={{ marginTop: '0.5rem' }}>
                        <div className="portal-badge status" style={{ textTransform: 'capitalize' }}>
                          Current: {prettyStatus(selectedReport.status)}
                        </div>
                        <select
                          value={statusDrafts[selectedReport._id] || selectedReport.status}
                          onChange={(e) => setStatusDrafts((current) => ({ ...current, [selectedReport._id]: e.target.value }))}
                        >
                          {statusOptions.map((value) => (
                            <option key={value} value={value}>{prettyStatus(value)}</option>
                          ))}
                        </select>
                        <button className="portal-inline-button secondary" type="button" onClick={() => handleStatusUpdate(selectedReport)}>
                          Update
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : isClientsPage ? (
              <>
                <div className="portal-inline-list compact">
                  {records.map((record) => (
                    <button
                      key={record._id}
                      type="button"
                      className={`portal-record-card portal-record-card-button${selectedReport?._id === record._id ? ' is-selected' : ''}`}
                      onClick={() => setSelectedRecordId((current) => (current === record._id ? '' : record._id))}
                    >
                      <h3 className="portal-record-title">{record.name || 'Client'}</h3>
                      <div className="portal-record-meta">
                        <span>{record.companyType || 'Client'}</span>
                        <span>{record.location || 'No location'}</span>
                        <span>{record.updatedAt ? formatPortalDateTime(record.updatedAt) : '-'}</span>
                      </div>
                    </button>
                  ))}
                </div>
                {selectedReport && (
                  <div className="portal-record-card" ref={selectedRecordRef}>
                    <h3 className="portal-record-title">{selectedReport.name || 'Client'}</h3>
                    <div className="portal-detail-grid">
                      <div className="portal-detail-item">
                        <span className="portal-detail-label">Assigned Staff</span>
                        <span className="portal-detail-value">{selectedReport.assignedTo?.name || selectedReport.assignedTo?.username || '-'}</span>
                      </div>
                      <div className="portal-detail-item">
                        <span className="portal-detail-label">Created By</span>
                        <span className="portal-detail-value">{selectedReport.createdBy?.name || selectedReport.createdBy?.username || '-'}</span>
                      </div>
                      <div className="portal-detail-item">
                        <span className="portal-detail-label">Type</span>
                        <span className="portal-detail-value">{selectedReport.companyType || '-'}</span>
                      </div>
                      <div className="portal-detail-item">
                        <span className="portal-detail-label">Department</span>
                        <span className="portal-detail-value">{selectedReport.department || '-'}</span>
                      </div>
                      <div className="portal-detail-item">
                        <span className="portal-detail-label">Contact</span>
                        <span className="portal-detail-value">{selectedReport.contactPerson || '-'}</span>
                      </div>
                      <div className="portal-detail-item">
                        <span className="portal-detail-label">Phone</span>
                        <span className="portal-detail-value">{selectedReport.phone || '-'}</span>
                      </div>
                      <div className="portal-detail-item">
                        <span className="portal-detail-label">Email</span>
                        <span className="portal-detail-value">{selectedReport.email || '-'}</span>
                      </div>
                      <div className="portal-detail-item">
                        <span className="portal-detail-label">Location</span>
                        <span className="portal-detail-value">{selectedReport.location || '-'}</span>
                      </div>
                      <div className="portal-detail-item">
                        <span className="portal-detail-label">Created</span>
                        <span className="portal-detail-value">{selectedReport.createdAt ? formatPortalDateTime(selectedReport.createdAt) : '-'}</span>
                      </div>
                      <div className="portal-detail-item">
                        <span className="portal-detail-label">Updated</span>
                        <span className="portal-detail-value">{selectedReport.updatedAt ? formatPortalDateTime(selectedReport.updatedAt) : '-'}</span>
                      </div>
                    </div>
                    {selectedReport.address && (
                      <div className="portal-note-block">
                        <div className="portal-detail-label">Address</div>
                        <div className="portal-record-copy">{selectedReport.address}</div>
                      </div>
                    )}
                    {selectedReport.notes && (
                      <div className="portal-note-block">
                        <div className="portal-detail-label">Notes</div>
                        <div className="portal-record-copy">{selectedReport.notes}</div>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : isVisitsPage ? (
              <>
                <div className="portal-inline-list compact">
                  {records.map((record) => (
                    <button
                      key={record._id}
                      type="button"
                      className={`portal-record-card portal-record-card-button${selectedReport?._id === record._id ? ' is-selected' : ''}`}
                      onClick={() => setSelectedRecordId((current) => (current === record._id ? '' : record._id))}
                    >
                      <h3 className="portal-record-title">{record.client?.name || record.clientName || 'Visit'}</h3>
                      <div className="portal-record-meta">
                        <span>{record.visitDate ? formatPortalDate(record.visitDate) : '-'}</span>
                        <span>{record.visitTime || '-'}</span>
                        <span>{record.location || 'No location'}</span>
                      </div>
                    </button>
                  ))}
                </div>
                {selectedReport && (
                  <div className="portal-record-card" ref={selectedRecordRef}>
                    <h3 className="portal-record-title">{selectedReport.client?.name || selectedReport.clientName || 'Visit'}</h3>
                    <div className="portal-detail-grid">
                      <div className="portal-detail-item">
                        <span className="portal-detail-label">Visit date</span>
                        <span className="portal-detail-value">{selectedReport.visitDate ? formatPortalDate(selectedReport.visitDate) : '-'}</span>
                      </div>
                      <div className="portal-detail-item">
                        <span className="portal-detail-label">Visit time</span>
                        <span className="portal-detail-value">{selectedReport.visitTime || '-'}</span>
                      </div>
                      <div className="portal-detail-item">
                        <span className="portal-detail-label">Logged</span>
                        <span className="portal-detail-value">{selectedReport.createdAt ? formatPortalDateTime(selectedReport.createdAt) : '-'}</span>
                      </div>
                      <div className="portal-detail-item">
                        <span className="portal-detail-label">Met person</span>
                        <span className="portal-detail-value">{selectedReport.metPerson || '-'}</span>
                      </div>
                      <div className="portal-detail-item">
                        <span className="portal-detail-label">Location</span>
                        <span className="portal-detail-value">{selectedReport.location || '-'}</span>
                      </div>
                      <div className="portal-detail-item">
                        <span className="portal-detail-label">Purpose</span>
                        <span className="portal-detail-value">{selectedReport.purpose || '-'}</span>
                      </div>
                    </div>
                    {selectedReport.discussionSummary && (
                      <div className="portal-note-block">
                        <div className="portal-detail-label">Discussion</div>
                        <div className="portal-record-copy">{selectedReport.discussionSummary}</div>
                      </div>
                    )}
                    {selectedReport.outcome && (
                      <div className="portal-note-block">
                        <div className="portal-detail-label">Outcome</div>
                        <div className="portal-record-copy">{selectedReport.outcome}</div>
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
