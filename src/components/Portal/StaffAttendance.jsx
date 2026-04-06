import { useEffect, useState } from 'react';
import { portalApi } from '../../services/portalApi';
import './PortalShell.css';

const StaffAttendance = () => {
  const [records, setRecords] = useState([]);
  const [note, setNote] = useState('');
  const [mileageWeekStart, setMileageWeekStart] = useState('');
  const [mileageWeekEnd, setMileageWeekEnd] = useState('');
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

  const today = new Date().toISOString().slice(0, 10);
  const todayRecord = records.find((record) => record.date === today);
  const formatStamp = (value) => (value ? new Date(value).toLocaleString() : 'Not recorded');

  useEffect(() => {
    if (!todayRecord) return;
    setMileageWeekStart(todayRecord.mileageWeekStart ?? '');
    setMileageWeekEnd(todayRecord.mileageWeekEnd ?? '');
  }, [todayRecord]);

  const submit = async (path) => {
    setBusy(true);
    setStatus('');
    try {
      const payload = {
        note,
        ...(mileageWeekStart !== '' ? { mileageWeekStart: Number(mileageWeekStart) } : {}),
        ...(mileageWeekEnd !== '' ? { mileageWeekEnd: Number(mileageWeekEnd) } : {}),
      };
      const response = await portalApi.post(path, payload, 'sales_staff');
      setStatus(response.message);
      await load();
    } catch (err) {
      setStatus(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="portal-page">
      <div className="portal-card dark">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Attendance</div>
            <h1 className="portal-section-title">Check In / Check Out</h1>
            <p className="portal-section-copy" style={{ color: 'rgba(255,255,255,0.76)' }}>
              Button-first attendance for field teams, with optional instructions and weekly car mileage capture.
            </p>
          </div>
        </div>
        <div className="portal-grid stats" style={{ marginTop: '1rem' }}>
          <div className="portal-stat">
            <div className="portal-stat-value">{todayRecord?.checkInTime ? 'Checked In' : 'Pending'}</div>
            <div className="portal-stat-label">{todayRecord?.checkInTime ? formatStamp(todayRecord.checkInTime) : 'Check-in status'}</div>
          </div>
          <div className="portal-stat">
            <div className="portal-stat-value">{todayRecord?.checkOutTime ? 'Checked Out' : 'Pending'}</div>
            <div className="portal-stat-label">{todayRecord?.checkOutTime ? formatStamp(todayRecord.checkOutTime) : 'Check-out status'}</div>
          </div>
          <div className="portal-stat">
            <div className="portal-stat-value">{todayRecord?.mileageWeekStart ?? '-'}</div>
            <div className="portal-stat-label">Week start mileage</div>
          </div>
          <div className="portal-stat">
            <div className="portal-stat-value">{todayRecord?.mileageWeekEnd ?? '-'}</div>
            <div className="portal-stat-label">Week end mileage</div>
          </div>
        </div>
        <div className="portal-form-grid two" style={{ marginTop: '1rem' }}>
          <div className="portal-field">
            <label>Car mileage week start</label>
            <input type="number" value={mileageWeekStart} onChange={(e) => setMileageWeekStart(e.target.value)} placeholder="Enter start mileage" />
          </div>
          <div className="portal-field">
            <label>Car mileage week end</label>
            <input type="number" value={mileageWeekEnd} onChange={(e) => setMileageWeekEnd(e.target.value)} placeholder="Enter end mileage" />
          </div>
        </div>
        <div className="portal-field" style={{ marginTop: '1rem' }}>
          <label>Instruction / note</label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add field instruction, location note, or handover detail" />
        </div>
        <div className="portal-actions" style={{ marginTop: '1rem' }}>
          <button className="portal-button primary" onClick={() => submit('/staff-portal/attendance/check-in')} disabled={busy || !!todayRecord?.checkInTime}>
            {busy ? 'Working...' : 'Check In'}
          </button>
          <button className="portal-button ghost" onClick={() => submit('/staff-portal/attendance/check-out')} disabled={busy || !todayRecord?.checkInTime || !!todayRecord?.checkOutTime}>
            {busy ? 'Working...' : 'Check Out'}
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
                <span>In: {record.checkInTime ? new Date(record.checkInTime).toLocaleString() : '-'}</span>
                <span>Out: {record.checkOutTime ? new Date(record.checkOutTime).toLocaleString() : '-'}</span>
                <span>{record.totalWorkedMinutes || 0} mins</span>
                {record.mileageWeekStart !== undefined && record.mileageWeekStart !== null && <span>Start km: {record.mileageWeekStart}</span>}
                {record.mileageWeekEnd !== undefined && record.mileageWeekEnd !== null && <span>End km: {record.mileageWeekEnd}</span>}
              </div>
              {(record.checkInNote || record.checkOutNote) && (
                <div className="portal-record-copy">
                  {record.checkInNote && <div><strong>Check-in note:</strong> {record.checkInNote}</div>}
                  {record.checkOutNote && <div><strong>Check-out note:</strong> {record.checkOutNote}</div>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StaffAttendance;
