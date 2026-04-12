import { useEffect, useState } from 'react';
import { portalApi } from '../../services/portalApi';
import AdminTopNav from '../Admin/AdminTopNav';
import '../Admin/AdminCategories.css';
import { formatPortalDate, formatPortalDateTime } from '../../utils/portalDate';
import './PortalShell.css';

const initialState = {
  username: '',
  name: '',
  email: '',
  phone: '',
  password: '',
  department: '',
};

const matchesStaffSearch = (member, search) => {
  const term = String(search || '').trim().toLowerCase();
  if (!term) return true;
  return [member.name, member.username, member.email, member.phone, member.department]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(term));
};

const formatItems = (items = []) =>
  items.map((item) => `${item.productName} x${item.quantity}${item.price ? ` @ ${item.price}` : ''}`).join(' | ');

const formatActivityLabel = (value) =>
  String(value || 'activity')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

const AdminStaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState(initialState);
  const [message, setMessage] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [staffSearch, setStaffSearch] = useState('');
  const [summaryDate, setSummaryDate] = useState('');
  const [staffSummary, setStaffSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const load = () =>
    portalApi
      .get('/admin-portal/staff', 'admin')
      .then((response) => {
        setStaff(response.data.staff);
        if (!selectedStaffId && response.data.staff[0]?._id) {
          setSelectedStaffId(response.data.staff[0]._id);
        }
      })
      .catch((err) => setMessage(err.message));

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!selectedStaffId) {
      setStaffSummary(null);
      return;
    }
    setSummaryLoading(true);
    const params = new URLSearchParams();
    if (summaryDate) params.set('date', summaryDate);
    portalApi
      .get(`/admin-portal/staff/${selectedStaffId}/summary${params.toString() ? `?${params.toString()}` : ''}`, 'admin')
      .then((response) => setStaffSummary(response.data))
      .catch((err) => setMessage(err.message))
      .finally(() => setSummaryLoading(false));
  }, [selectedStaffId, summaryDate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      await portalApi.post('/admin-portal/staff', form, 'admin');
      setForm(initialState);
      setMessage('Staff user created.');
      load();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const toggleStatus = async (record) => {
    try {
      await portalApi.patch(`/admin-portal/staff/${record._id}`, { isActive: !record.isActive }, 'admin');
      load();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const exportStaffReport = async (staffId) => {
    try {
      const params = new URLSearchParams();
      if (summaryDate) params.set('date', summaryDate);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin-portal/staff/${staffId}/report${params.toString() ? `?${params.toString()}` : ''}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
        }
      );
      if (!response.ok) throw new Error('Export failed.');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      const disposition = response.headers.get('content-disposition') || '';
      const matchedName = disposition.match(/filename="([^"]+)"/i)?.[1];
      anchor.download = matchedName || `staff-report-${staffId}.xlsx`;
      anchor.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setMessage(err.message || 'Export failed.');
    }
  };

  const activeCount = staff.filter((member) => member.isActive).length;
  const inactiveCount = staff.length - activeCount;
  const filteredStaff = staff.filter((member) => matchesStaffSearch(member, staffSearch));
  const selectedStaff = staff.find((member) => member._id === selectedStaffId);
  const compactActivity = (staffSummary?.recentActivity || []).slice(0, 6);
  const drillLinks = selectedStaffId
    ? [
        { href: `/admin/attendance?user=${selectedStaffId}`, label: 'Attendance' },
        { href: `/admin/reports?user=${selectedStaffId}`, label: 'Reports' },
        { href: `/admin/orders?user=${selectedStaffId}`, label: 'Orders' },
        { href: `/admin/visits?user=${selectedStaffId}`, label: 'Visits' },
        { href: `/admin/clients`, label: 'Clients' },
        { href: `/admin/logs?user=${selectedStaffId}`, label: 'Activity Logs' },
      ]
    : [];

  return (
    <div className="admin-categories">
      <AdminTopNav />
      <section className="portal-page">
      <div className="portal-card portal-help-card">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Staff Setup</div>
            <h2 className="portal-section-title" style={{ fontSize: '1.45rem' }}>Make access simple</h2>
            <p className="portal-section-copy">
              Create staff users here. Give them a simple username and password, then ask them to sign in from the staff portal on their phone.
            </p>
          </div>
        </div>
        <ul className="portal-help-list">
          <li>Use short usernames staff can remember easily.</li>
          <li>Keep department names simple, like Sales, Medical, Dental, or Delivery.</li>
          <li>If someone should stop using the portal, press Deactivate instead of deleting them.</li>
        </ul>
      </div>

      <div className="portal-card">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Staff Access</div>
            <h1 className="portal-section-title" style={{ fontSize: '1.8rem' }}>Create sales staff users</h1>
          </div>
        </div>
        <div className="portal-grid stats portal-module-stats" style={{ marginTop: '1rem' }}>
          <div className="portal-stat light">
            <div className="portal-stat-value">{staff.length}</div>
            <div className="portal-stat-label">Total staff</div>
          </div>
          <div className="portal-stat light">
            <div className="portal-stat-value">{activeCount}</div>
            <div className="portal-stat-label">Active staff</div>
          </div>
          <div className="portal-stat light">
            <div className="portal-stat-value">{inactiveCount}</div>
            <div className="portal-stat-label">Inactive staff</div>
          </div>
        </div>
        <form className="portal-form" onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          <div className="portal-form-grid two">
            {Object.entries({
              username: 'Username',
              name: 'Name',
              email: 'Email',
              phone: 'Phone',
              password: 'Password',
              department: 'Department',
            }).map(([field, label]) => (
              <div className="portal-field" key={field}>
                <label>{label}</label>
                <input
                  type={field === 'password' ? 'password' : 'text'}
                  value={form[field]}
                  onChange={(e) => setForm((current) => ({ ...current, [field]: e.target.value }))}
                />
              </div>
            ))}
          </div>
          {message && <div className="portal-badge status">{message}</div>}
          <button className="portal-button primary" type="submit">Create Staff User</button>
        </form>
      </div>

      <div className="portal-card">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Current Team</div>
            <h2 className="portal-section-title" style={{ fontSize: '1.5rem' }}>Sales staff roster</h2>
          </div>
        </div>
        <div className="portal-filter-bar" style={{ marginTop: '1rem' }}>
          <input
            type="search"
            placeholder="Search staff by name, email, phone, or department"
            value={staffSearch}
            onChange={(e) => setStaffSearch(e.target.value)}
          />
          <div className="portal-badge status">{filteredStaff.length} shown</div>
        </div>
        <div className="portal-staff-roster" style={{ marginTop: '1rem' }}>
          {filteredStaff.length ? (
            filteredStaff.map((member) => (
              <div className="portal-staff-member-card" key={member._id}>
                <div className="portal-staff-member-head">
                  <div>
                    <h3 className="portal-record-title">{member.name || member.username}</h3>
                    <div className="portal-record-meta">
                      <span>{member.email}</span>
                      <span>{member.phone || 'No phone'}</span>
                      <span>{member.department || 'No department'}</span>
                      <span className="portal-badge status">{member.isActive ? 'active' : 'inactive'}</span>
                    </div>
                  </div>
                  <div className="portal-staff-member-actions">
                    <button className="portal-inline-button ghost" type="button" onClick={() => setSelectedStaffId(member._id)}>
                      View Summary
                    </button>
                    <button className="portal-inline-button secondary" type="button" onClick={() => exportStaffReport(member._id)}>
                      Export Report
                    </button>
                  </div>
                </div>
                <button className="portal-inline-button secondary" type="button" onClick={() => toggleStatus(member)}>
                  {member.isActive ? 'Deactivate User' : 'Activate User'}
                </button>
              </div>
            ))
          ) : (
            <div className="portal-empty-state">
              <h3 className="portal-empty-title">No staff users yet</h3>
              <p className="portal-empty-copy">
                Create the first staff user above. After that, they can sign in at <strong>/staff/login</strong> and start using the field portal.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="portal-card">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Staff Summary</div>
            <h2 className="portal-section-title" style={{ fontSize: '1.5rem' }}>Everything for one staff member</h2>
            <p className="portal-section-copy">
              Choose a staff member, then filter by date when you need to inspect one working day with full attendance, reports, orders, visits, clients, and activity.
            </p>
          </div>
          <div className="portal-inline-actions tight" style={{ width: '100%', justifyContent: 'flex-end' }}>
            <input
              type="search"
              placeholder="Search before selecting staff"
              value={staffSearch}
              onChange={(e) => setStaffSearch(e.target.value)}
              style={{ minWidth: '18rem', flex: '1 1 18rem' }}
            />
            <select value={selectedStaffId} onChange={(e) => setSelectedStaffId(e.target.value)} style={{ minWidth: '16rem', flex: '1 1 16rem' }}>
              <option value="">Select staff</option>
              {filteredStaff.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name || member.username} {member.phone ? `• ${member.phone}` : ''}
                </option>
              ))}
            </select>
            <input type="date" value={summaryDate} onChange={(e) => setSummaryDate(e.target.value)} />
            {selectedStaffId && (
              <button className="portal-inline-button ghost" type="button" onClick={() => exportStaffReport(selectedStaffId)}>
                Export Excel Report
              </button>
            )}
          </div>
        </div>

        {summaryLoading ? (
          <div className="portal-empty-state" style={{ marginTop: '1rem' }}>
            <h3 className="portal-empty-title">Loading summary...</h3>
            <p className="portal-empty-copy">Pulling attendance, reports, orders, visits, and activity for this staff member.</p>
          </div>
        ) : staffSummary?.staff ? (
          <div className="portal-staff-report" style={{ marginTop: '1rem' }}>
            <div className="portal-staff-report-head">
              <div>
                <h3 className="portal-record-title" style={{ fontSize: '1.35rem' }}>{staffSummary.staff.name || staffSummary.staff.username}</h3>
                <div className="portal-record-meta">
                  <span>{staffSummary.staff.email}</span>
                  <span>{staffSummary.staff.phone || 'No phone'}</span>
                  <span>{staffSummary.staff.department || 'No department'}</span>
                  <span className="portal-badge status">{staffSummary.staff.isActive ? 'active' : 'inactive'}</span>
                </div>
              </div>
              <div className="portal-staff-summary-actions">
                <div className="portal-badge status">{selectedStaff?.isActive ? 'Ready for field work' : 'Inactive user'}</div>
                <button className="portal-inline-button secondary" type="button" onClick={() => exportStaffReport(selectedStaffId)}>
                  Download Full Excel Report
                </button>
              </div>
            </div>

            <div className="portal-staff-summary-grid">
              {[
                ['Attendance', summaryDate ? staffSummary.metrics.filteredAttendanceCount : staffSummary.metrics.attendanceCount],
                ['Reports', summaryDate ? staffSummary.metrics.filteredReportsCount : staffSummary.metrics.reportsCount],
                ['Orders', summaryDate ? staffSummary.metrics.filteredOrdersCount : staffSummary.metrics.ordersCount],
                ['Visits', summaryDate ? staffSummary.metrics.filteredVisitsCount : staffSummary.metrics.visitsCount],
                ['Clients', summaryDate ? staffSummary.metrics.filteredClientsCount : staffSummary.metrics.clientsCount],
                ['Unread Notifications', staffSummary.metrics.unreadNotifications],
              ].map(([label, value]) => (
                <div className="portal-stat light" key={label}>
                  <div className="portal-stat-value">{value}</div>
                  <div className="portal-stat-label">{summaryDate ? `${label} on ${formatPortalDate(summaryDate)}` : label}</div>
                </div>
                ))}
            </div>

            <div className="portal-staff-report-block">
              <div className="portal-brand-kicker">Open Directly</div>
              <div className="portal-drill-links">
                {drillLinks.map((link) => (
                  <a key={link.href} className="portal-inline-button ghost" href={link.href}>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="portal-staff-report-grid">
              <div className="portal-staff-report-block">
                <div className="portal-brand-kicker">Attendance Log</div>
                <div className="portal-record-list">
                  {staffSummary.records.attendance.length ? (
                    staffSummary.records.attendance.map((entry) => (
                      <div className="portal-record-card" key={entry._id}>
                        <h3 className="portal-record-title">{formatPortalDate(entry.date)}</h3>
                        <div className="portal-record-meta">
                          <span>Check in: {entry.checkInTime ? formatPortalDateTime(entry.checkInTime) : 'Not recorded'}</span>
                          <span>Check out: {entry.checkOutTime ? formatPortalDateTime(entry.checkOutTime) : 'Not recorded'}</span>
                          <span>Worked: {entry.totalWorkedMinutes || 0} min</span>
                        </div>
                        <div className="portal-record-meta">
                          <span>Week start km: {entry.mileageWeekStart ?? '-'}</span>
                          <span>Entered: {entry.mileageWeekStartAt ? formatPortalDateTime(entry.mileageWeekStartAt) : '-'}</span>
                          <span>Week end km: {entry.mileageWeekEnd ?? '-'}</span>
                          <span>Entered: {entry.mileageWeekEndAt ? formatPortalDateTime(entry.mileageWeekEndAt) : '-'}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="portal-empty-state">
                      <h3 className="portal-empty-title">No attendance found</h3>
                      <p className="portal-empty-copy">No attendance entries match the current filter.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="portal-staff-report-block">
                <div className="portal-brand-kicker">Daily Reports</div>
                <div className="portal-record-list">
                  {staffSummary.records.reports.length ? (
                    staffSummary.records.reports.map((entry) => (
                      <div className="portal-record-card" key={entry._id}>
                        <h3 className="portal-record-title">{formatPortalDate(entry.date)}</h3>
                        <div className="portal-record-meta">
                          <span>Created: {formatPortalDateTime(entry.createdAt)}</span>
                          <span>Follow up: {entry.followUpNeeded ? 'Yes' : 'No'}</span>
                          <span>Visits in report: {entry.visits?.length || 0}</span>
                        </div>
                        <div className="portal-record-copy">{entry.summary}</div>
                        {entry.notes && <div className="portal-record-copy">{entry.notes}</div>}
                      </div>
                    ))
                  ) : (
                    <div className="portal-empty-state">
                      <h3 className="portal-empty-title">No reports found</h3>
                      <p className="portal-empty-copy">No daily reports match the current filter.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="portal-staff-report-grid">
              <div className="portal-staff-report-block">
                <div className="portal-brand-kicker">Orders</div>
                <div className="portal-record-list">
                  {staffSummary.records.orders.length ? (
                    staffSummary.records.orders.map((entry) => (
                      <div className="portal-record-card" key={entry._id}>
                        <h3 className="portal-record-title">{entry.customerName || entry.companyName || 'Order'}</h3>
                        <div className="portal-record-meta">
                          <span>Submitted: {formatPortalDateTime(entry.submittedAt || entry.createdAt)}</span>
                          <span>Status: {entry.status}</span>
                          <span>Urgency: {entry.urgency}</span>
                          <span>Client: {entry.client?.name || '-'}</span>
                        </div>
                        <div className="portal-record-meta">
                          <span>Contact: {entry.contactPerson || '-'}</span>
                          <span>Items: {entry.items?.length || 0}</span>
                        </div>
                        <div className="portal-record-copy">{formatItems(entry.items)}</div>
                        {entry.notes && <div className="portal-record-copy">{entry.notes}</div>}
                      </div>
                    ))
                  ) : (
                    <div className="portal-empty-state">
                      <h3 className="portal-empty-title">No orders found</h3>
                      <p className="portal-empty-copy">No orders match the current filter.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="portal-staff-report-block">
                <div className="portal-brand-kicker">Visits</div>
                <div className="portal-record-list">
                  {staffSummary.records.visits.length ? (
                    staffSummary.records.visits.map((entry) => (
                      <div className="portal-record-card" key={entry._id}>
                        <h3 className="portal-record-title">{entry.client?.name || entry.clientName || 'Visit'}</h3>
                        <div className="portal-record-meta">
                          <span>Date: {formatPortalDate(entry.visitDate)}</span>
                          <span>Time: {entry.visitTime || '-'}</span>
                          <span>Logged: {formatPortalDateTime(entry.createdAt)}</span>
                        </div>
                        <div className="portal-record-meta">
                          <span>Met: {entry.metPerson || '-'}</span>
                          <span>Location: {entry.location || '-'}</span>
                          <span>Purpose: {entry.purpose || '-'}</span>
                        </div>
                        {entry.discussionSummary && <div className="portal-record-copy">{entry.discussionSummary}</div>}
                        {entry.outcome && <div className="portal-record-copy">{entry.outcome}</div>}
                      </div>
                    ))
                  ) : (
                    <div className="portal-empty-state">
                      <h3 className="portal-empty-title">No visits found</h3>
                      <p className="portal-empty-copy">No visits match the current filter.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="portal-staff-report-grid">
              <div className="portal-staff-report-block">
                <div className="portal-brand-kicker">Client List</div>
                <div className="portal-record-list">
                  {staffSummary.records.clients.length ? (
                    staffSummary.records.clients.map((entry) => (
                      <div className="portal-record-card" key={entry._id}>
                        <h3 className="portal-record-title">{entry.name}</h3>
                        <div className="portal-record-meta">
                          <span>Created: {formatPortalDateTime(entry.createdAt)}</span>
                          <span>Updated: {formatPortalDateTime(entry.updatedAt)}</span>
                          <span>Type: {entry.companyType || '-'}</span>
                          <span>Department: {entry.department || '-'}</span>
                        </div>
                        <div className="portal-record-meta">
                          <span>Contact: {entry.contactPerson || '-'}</span>
                          <span>Phone: {entry.phone || '-'}</span>
                          <span>Email: {entry.email || '-'}</span>
                          <span>Location: {entry.location || '-'}</span>
                        </div>
                        {entry.address && <div className="portal-record-copy">{entry.address}</div>}
                        {entry.notes && <div className="portal-record-copy">{entry.notes}</div>}
                      </div>
                    ))
                  ) : (
                    <div className="portal-empty-state">
                      <h3 className="portal-empty-title">No clients found</h3>
                      <p className="portal-empty-copy">No clients match the current filter.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="portal-staff-report-block">
                <div className="portal-brand-kicker">Recent Activity</div>
                <div className="portal-inline-list compact">
                  {compactActivity.length ? (
                    compactActivity.map((entry) => (
                      <div className="portal-compact-row" key={entry._id}>
                        <div className="portal-compact-row-main">
                          <strong>{formatActivityLabel(entry.action)}</strong>
                          <span>{entry.module}</span>
                        </div>
                        <span>{formatPortalDateTime(entry.createdAt)}</span>
                      </div>
                    ))
                  ) : (
                    <div className="portal-empty-state">
                      <h3 className="portal-empty-title">No activity found</h3>
                      <p className="portal-empty-copy">No logged activity matches the current filter.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="portal-empty-state" style={{ marginTop: '1rem' }}>
            <h3 className="portal-empty-title">Select a staff member</h3>
            <p className="portal-empty-copy">Choose one staff user above to view a full wrapped summary and export their report.</p>
          </div>
        )}
      </div>
      </section>
    </div>
  );
};

export default AdminStaffPage;
