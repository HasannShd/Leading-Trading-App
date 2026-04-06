import { useEffect, useState } from 'react';
import { portalApi } from '../../services/portalApi';
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

  const load = () =>
    portalApi
      .get('/admin-portal/staff', 'admin')
      .then((response) => setStaff(response.data.staff))
      .catch((err) => setMessage(err.message));

  useEffect(() => {
    load();
  }, []);

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

  return (
    <section className="portal-page">
      <div className="portal-card">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Staff Access</div>
            <h1 className="portal-section-title" style={{ fontSize: '1.8rem' }}>Create sales staff users</h1>
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
        <div className="portal-record-list" style={{ marginTop: '1rem' }}>
          {staff.map((member) => (
            <div className="portal-record-card" key={member._id}>
              <h3 className="portal-record-title">{member.name || member.username}</h3>
              <div className="portal-record-meta">
                <span>{member.email}</span>
                <span>{member.phone}</span>
                <span>{member.department || 'No department'}</span>
                <span className="portal-badge status">{member.isActive ? 'active' : 'inactive'}</span>
              </div>
              <button className="portal-inline-button secondary" type="button" onClick={() => toggleStatus(member)}>
                {member.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminStaffPage;
