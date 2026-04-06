import { useEffect, useState } from 'react';
import { portalApi } from '../../services/portalApi';
import './PortalShell.css';

const StaffAttendance = () => {
  const [records, setRecords] = useState([]);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () =>
    portalApi
      .get('/staff-portal/attendance', 'sales_staff')
      .then((response) => setRecords(response.data.records))
      .catch((err) => setStatus(err.message));

  useEffect(() => {
    load();
  }, []);

  const submit = async (path) => {
    setBusy(true);
    setStatus('');
    try {
      const response = await portalApi.post(path, { note }, 'sales_staff');
      setStatus(response.message);
      setNote('');
      await load();
    } catch (err) {
      setStatus(err.message);
    } finally {
      setBusy(false);
    }
  };

  const today = new Date().toISOString().slice(0, 10);
  const todayRecord = records.find((record) => record.date === today);

  return (
    <section className="portal-page">
      <div className="portal-card dark">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Attendance</div>
            <h1 className="portal-section-title">Check In / Check Out</h1>
            <p className="portal-section-copy" style={{ color: 'rgba(255,255,255,0.76)' }}>
              Designed for fast field use from a phone. One check-in and one check-out each day.
            </p>
          </div>
        </div>
        <div className="portal-grid stats" style={{ marginTop: '1rem' }}>
          <div className="portal-stat">
            <div className="portal-stat-value">{todayRecord?.checkInTime ? 'In' : 'Pending'}</div>
            <div className="portal-stat-label">Check-in status</div>
          </div>
          <div className="portal-stat">
            <div className="portal-stat-value">{todayRecord?.checkOutTime ? 'Out' : 'Pending'}</div>
            <div className="portal-stat-label">Check-out status</div>
          </div>
        </div>
        <div className="portal-field" style={{ marginTop: '1rem' }}>
          <label>Optional note</label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add location or field note" />
        </div>
        <div className="portal-actions" style={{ marginTop: '1rem' }}>
          <button className="portal-button primary" onClick={() => submit('/staff-portal/attendance/check-in')} disabled={busy || !!todayRecord?.checkInTime}>
            Check In
          </button>
          <button className="portal-button ghost" onClick={() => submit('/staff-portal/attendance/check-out')} disabled={busy || !todayRecord?.checkInTime || !!todayRecord?.checkOutTime}>
            Check Out
          </button>
        </div>
        {status && <div className="portal-badge status" style={{ marginTop: '1rem' }}>{status}</div>}
      </div>

      <div className="portal-card">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">History</div>
            <h2 className="portal-section-title" style={{ fontSize: '1.5rem' }}>Last 30 entries</h2>
          </div>
        </div>
        <div className="portal-record-list" style={{ marginTop: '1rem' }}>
          {records.map((record) => (
            <div className="portal-record-card" key={record._id}>
              <h3 className="portal-record-title">{record.date}</h3>
              <div className="portal-record-meta">
                <span>In: {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-'}</span>
                <span>Out: {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-'}</span>
                <span>{record.totalWorkedMinutes || 0} mins</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StaffAttendance;
