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

const AdminStaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState(initialState);
  const [message, setMessage] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState('');
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
    portalApi
      .get(`/admin-portal/staff/${selectedStaffId}/summary`, 'admin')
      .then((response) => setStaffSummary(response.data))
      .catch((err) => setMessage(err.message))
      .finally(() => setSummaryLoading(false));
  }, [selectedStaffId]);

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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin-portal/staff/${staffId}/report`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
        }
      );
      if (!response.ok) throw new Error('Export failed.');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `staff-report-${staffId}.csv`;
      anchor.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setMessage(err.message || 'Export failed.');
    }
  };

  const activeCount = staff.filter((member) => member.isActive).length;
  const inactiveCount = staff.length - activeCount;
  const selectedStaff = staff.find((member) => member._id === selectedStaffId);
  const drillLinks = selectedStaffId
    ? [
        { href: `/admin/attendance?user=${selectedStaffId}`, label: 'Attendance' },
        { href: `/admin/reports?user=${selectedStaffId}`, label: 'Reports' },
        { href: `/admin/orders?user=${selectedStaffId}`, label: 'Orders' },
        { href: `/admin/expenses?user=${selectedStaffId}`, label: 'Expenses' },
        { href: `/admin/visits?user=${selectedStaffId}`, label: 'Visits' },
        { href: `/admin/collections?user=${selectedStaffId}`, label: 'Collections' },
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
        <div className="portal-staff-roster" style={{ marginTop: '1rem' }}>
          {staff.length ? (
            staff.map((member) => (
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
              Choose a staff member to review performance, recent activity, pending work, and export a single report for office use.
            </p>
          </div>
          <div className="portal-inline-actions tight">
            <select value={selectedStaffId} onChange={(e) => setSelectedStaffId(e.target.value)}>
              <option value="">Select staff</option>
              {staff.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name || member.username}
                </option>
              ))}
            </select>
            {selectedStaffId && (
              <button className="portal-inline-button ghost" type="button" onClick={() => exportStaffReport(selectedStaffId)}>
                Export Staff Report
              </button>
            )}
          </div>
        </div>

        {summaryLoading ? (
          <div className="portal-empty-state" style={{ marginTop: '1rem' }}>
            <h3 className="portal-empty-title">Loading summary...</h3>
            <p className="portal-empty-copy">Pulling attendance, reports, orders, expenses, and activity for this staff member.</p>
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
                  Download Full Staff Report
                </button>
              </div>
            </div>

            <div className="portal-staff-summary-grid">
              {[
                ['Attendance', staffSummary.metrics.attendanceCount],
                ['Schedules', staffSummary.metrics.schedulesCount],
                ['Reports', staffSummary.metrics.reportsCount],
                ['Orders', staffSummary.metrics.ordersCount],
                ['Expenses', staffSummary.metrics.expensesCount],
                ['Visits', staffSummary.metrics.visitsCount],
                ['Collections', staffSummary.metrics.collectionsCount],
                ['Unread Notifications', staffSummary.metrics.unreadNotifications],
              ].map(([label, value]) => (
                <div className="portal-stat light" key={label}>
                  <div className="portal-stat-value">{value}</div>
                  <div className="portal-stat-label">{label}</div>
                </div>
                ))}
            </div>

            <div className="portal-staff-report-sheet">
              <div className="portal-staff-report-grid">
                <div className="portal-staff-report-block">
                  <div className="portal-brand-kicker">Latest Attendance</div>
                  <div className="portal-staff-report-list">
                    <div className="portal-staff-report-row">
                      <strong>Last date</strong>
                      <span>{staffSummary.latest.attendance?.date ? formatPortalDate(staffSummary.latest.attendance.date) : 'No attendance yet'}</span>
                    </div>
                    <div className="portal-staff-report-row">
                      <strong>Check in</strong>
                      <span>{staffSummary.latest.attendance?.checkInTime ? formatPortalDateTime(staffSummary.latest.attendance.checkInTime) : 'Not recorded'}</span>
                    </div>
                    <div className="portal-staff-report-row">
                      <strong>Check out</strong>
                      <span>{staffSummary.latest.attendance?.checkOutTime ? formatPortalDateTime(staffSummary.latest.attendance.checkOutTime) : 'Not recorded'}</span>
                    </div>
                  </div>
                </div>

                <div className="portal-staff-report-block">
                  <div className="portal-brand-kicker">Work Queue</div>
                  <div className="portal-staff-report-list">
                    <div className="portal-staff-report-row">
                      <strong>Next schedule</strong>
                      <span>
                        {staffSummary.latest.nextSchedule
                          ? `${staffSummary.latest.nextSchedule.title} • ${formatPortalDate(staffSummary.latest.nextSchedule.assignedDate)}`
                          : 'No upcoming schedule'}
                      </span>
                    </div>
                    <div className="portal-staff-report-row">
                      <strong>Pending orders</strong>
                      <span>{staffSummary.metrics.pendingOrders}</span>
                    </div>
                    <div className="portal-staff-report-row">
                      <strong>Pending expenses</strong>
                      <span>{staffSummary.metrics.pendingExpenses}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="portal-staff-report-grid">
                <div className="portal-staff-report-block">
                  <div className="portal-brand-kicker">Latest Activity</div>
                  <div className="portal-staff-report-list">
                    <div className="portal-staff-report-row">
                      <strong>Report</strong>
                      <span>{staffSummary.latest.report ? formatPortalDate(staffSummary.latest.report.date) : 'No report yet'}</span>
                    </div>
                    <div className="portal-staff-report-row">
                      <strong>Order</strong>
                      <span>{staffSummary.latest.order ? formatPortalDateTime(staffSummary.latest.order.createdAt) : 'No order yet'}</span>
                    </div>
                    <div className="portal-staff-report-row">
                      <strong>Expense</strong>
                      <span>{staffSummary.latest.expense ? formatPortalDateTime(staffSummary.latest.expense.createdAt) : 'No expense yet'}</span>
                    </div>
                    <div className="portal-staff-report-row">
                      <strong>Visit</strong>
                      <span>{staffSummary.latest.visit ? formatPortalDate(staffSummary.latest.visit.visitDate) : 'No visit yet'}</span>
                    </div>
                  </div>
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
              </div>
            </div>

            <div className="portal-record-list">
              {staffSummary.recentActivity.length ? (
                staffSummary.recentActivity.map((entry) => (
                  <div className="portal-record-card" key={entry._id}>
                    <h3 className="portal-record-title">{entry.action.replaceAll('_', ' ')}</h3>
                    <div className="portal-record-meta">
                      <span>{entry.module}</span>
                      <span>{formatPortalDateTime(entry.createdAt)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="portal-empty-state">
                  <h3 className="portal-empty-title">No staff activity yet</h3>
                  <p className="portal-empty-copy">Once this staff member starts using the portal, their recent actions will appear here for quick review.</p>
                </div>
              )}
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
