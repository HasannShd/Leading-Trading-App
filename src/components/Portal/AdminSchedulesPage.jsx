import { useEffect, useState } from 'react';
import { portalApi } from '../../services/portalApi';
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
    <section className="portal-page">
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
          {schedules.map((schedule) => (
            <div className="portal-record-card" key={schedule._id}>
              <h3 className="portal-record-title">{schedule.title}</h3>
              <div className="portal-record-meta">
                <span>{schedule.user?.name || schedule.user?.username}</span>
                <span>{schedule.assignedDate}</span>
                {schedule.startTime && <span>{schedule.startTime}</span>}
                <span className="portal-badge status">{schedule.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminSchedulesPage;
