import { useEffect, useState } from 'react';
import { portalApi } from '../../services/portalApi';
import './PortalShell.css';

const StaffSchedulePage = () => {
  const [schedules, setSchedules] = useState([]);
  const [message, setMessage] = useState('');

  const load = () =>
    portalApi
      .get('/staff-portal/schedules', 'sales_staff')
      .then((response) => setSchedules(response.data.schedules))
      .catch((err) => setMessage(err.message));

  useEffect(() => {
    load();
  }, []);

  const updateSchedule = async (schedule, status) => {
    try {
      await portalApi.patch(`/staff-portal/schedules/${schedule._id}`, { status }, 'sales_staff');
      setMessage('Schedule updated.');
      load();
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <section className="portal-page">
      <div className="portal-card dark">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Assignments</div>
            <h1 className="portal-section-title">Daily Schedule</h1>
            <p className="portal-section-copy" style={{ color: 'rgba(255,255,255,0.76)' }}>
              Open, update, and complete assigned field activity without switching screens.
            </p>
          </div>
        </div>
      </div>
      {message && <div className="portal-badge status">{message}</div>}
      <div className="portal-record-list">
        {schedules.map((schedule) => (
          <div className="portal-record-card" key={schedule._id}>
            <h3 className="portal-record-title">{schedule.title}</h3>
            <div className="portal-record-meta">
              <span>{schedule.assignedDate}</span>
              {schedule.startTime && <span>{schedule.startTime}</span>}
              {schedule.location && <span>{schedule.location}</span>}
              <span className="portal-badge status">{schedule.status}</span>
            </div>
            <div className="portal-file-row">
              {['pending', 'in_progress', 'completed'].map((status) => (
                <button key={status} className="portal-inline-button ghost" type="button" onClick={() => updateSchedule(schedule, status)}>
                  {status}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StaffSchedulePage;
