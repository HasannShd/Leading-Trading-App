import { useEffect, useState } from 'react';
import { portalApi } from '../../services/portalApi';
import AdminTopNav from '../Admin/AdminTopNav';
import '../Admin/AdminCategories.css';
import './PortalShell.css';

const emptyForm = {
  user: '',
  title: '',
  description: '',
  assignedDate: '',
  startTime: '',
  endTime: '',
  clientLabel: '',
  location: '',
  status: 'pending',
  notes: '',
};

const AdminSchedulesPage = () => {
  const [staff, setStaff] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      const [staffResponse, scheduleResponse] = await Promise.all([
        portalApi.get('/admin-portal/staff', 'admin'),
        portalApi.get('/admin-portal/schedules', 'admin'),
      ]);
      setStaff(staffResponse.data.staff);
      setSchedules(scheduleResponse.data.schedules);
      if (!form.user && staffResponse.data.staff[0]?._id) {
        setForm((current) => ({ ...current, user: staffResponse.data.staff[0]._id }));
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await portalApi.post('/admin-portal/schedules', form, 'admin');
      setForm((current) => ({ ...emptyForm, user: current.user }));
      setMessage('Schedule assigned.');
      load();
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="admin-categories">
      <AdminTopNav />
      <section className="portal-page">
      <div className="portal-card portal-help-card">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Schedule Planning</div>
            <h2 className="portal-section-title" style={{ fontSize: '1.45rem' }}>Assign work clearly</h2>
            <p className="portal-section-copy">
              Keep schedules short and clear. Staff should be able to read the task name and understand what to do immediately.
            </p>
          </div>
        </div>
        <ul className="portal-help-list">
          <li>Use simple titles like “Visit King Hamad Hospital” or “Follow up with Bapco clinic”.</li>
          <li>Add a location and time whenever possible.</li>
          <li>Keep the description focused on what the staff member should do next.</li>
        </ul>
      </div>

      <div className="portal-card">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Schedule Assignment</div>
            <h1 className="portal-section-title" style={{ fontSize: '1.8rem' }}>Assign daily tasks</h1>
          </div>
        </div>
        <form className="portal-form" onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          <div className="portal-form-grid two">
            <div className="portal-field">
              <label>Staff User</label>
              <select value={form.user} onChange={(e) => setForm((current) => ({ ...current, user: e.target.value }))}>
                {staff.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name || member.username}
                  </option>
                ))}
              </select>
            </div>
            <div className="portal-field">
              <label>Title</label>
              <input value={form.title} onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))} />
            </div>
            <div className="portal-field">
              <label>Assigned Date</label>
              <input type="date" value={form.assignedDate} onChange={(e) => setForm((current) => ({ ...current, assignedDate: e.target.value }))} />
            </div>
            <div className="portal-field">
              <label>Status</label>
              <select value={form.status} onChange={(e) => setForm((current) => ({ ...current, status: e.target.value }))}>
                {['pending', 'in_progress', 'completed', 'cancelled', 'missed'].map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>
            <div className="portal-field">
              <label>Start Time</label>
              <input type="time" value={form.startTime} onChange={(e) => setForm((current) => ({ ...current, startTime: e.target.value }))} />
            </div>
            <div className="portal-field">
              <label>End Time</label>
              <input type="time" value={form.endTime} onChange={(e) => setForm((current) => ({ ...current, endTime: e.target.value }))} />
            </div>
            <div className="portal-field">
              <label>Client / Facility</label>
              <input value={form.clientLabel} onChange={(e) => setForm((current) => ({ ...current, clientLabel: e.target.value }))} />
            </div>
            <div className="portal-field">
              <label>Location</label>
              <input value={form.location} onChange={(e) => setForm((current) => ({ ...current, location: e.target.value }))} />
            </div>
            <div className="portal-field" style={{ gridColumn: '1 / -1' }}>
              <label>Description</label>
              <textarea value={form.description} onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))} />
            </div>
            <div className="portal-field" style={{ gridColumn: '1 / -1' }}>
              <label>Notes</label>
              <textarea value={form.notes} onChange={(e) => setForm((current) => ({ ...current, notes: e.target.value }))} />
            </div>
          </div>
          {message && <div className="portal-badge status">{message}</div>}
          <button className="portal-button primary" type="submit">Assign Schedule</button>
        </form>
      </div>

      <div className="portal-card">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Assigned Items</div>
            <h2 className="portal-section-title" style={{ fontSize: '1.5rem' }}>Current schedules</h2>
          </div>
        </div>
        <div className="portal-record-list" style={{ marginTop: '1rem' }}>
          {schedules.length ? (
            schedules.map((schedule) => (
              <div className="portal-record-card" key={schedule._id}>
                <h3 className="portal-record-title">{schedule.title}</h3>
                <div className="portal-record-meta">
                  <span>{schedule.user?.name || schedule.user?.username}</span>
                  <span>{schedule.assignedDate}</span>
                  {schedule.startTime && <span>{schedule.startTime}</span>}
                  {schedule.location && <span>{schedule.location}</span>}
                  <span className="portal-badge status">{schedule.status}</span>
                </div>
                {(schedule.description || schedule.notes) && (
                  <div className="portal-record-copy">
                    {schedule.description || schedule.notes}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="portal-empty-state">
              <h3 className="portal-empty-title">No schedules assigned yet</h3>
              <p className="portal-empty-copy">
                Create the first schedule above. Assigned tasks will appear here and on the staff member&apos;s phone.
              </p>
            </div>
          )}
        </div>
      </div>
      </section>
    </div>
  );
};

export default AdminSchedulesPage;
