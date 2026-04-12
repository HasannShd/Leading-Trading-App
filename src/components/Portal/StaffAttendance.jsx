import { useEffect, useState } from 'react';
import { portalApi } from '../../services/portalApi';
import { formatPortalDate, formatPortalDateTime, getPortalDateKey } from '../../utils/portalDate';
import './PortalShell.css';

const StaffAttendance = () => {
  const [records, setRecords] = useState([]);
  const [note, setNote] = useState('');
  const [mileageNote, setMileageNote] = useState('');
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

  const today = getPortalDateKey();
  const todayRecord = records.find((record) => record.date === today);
  const formatStamp = (value) => (value ? formatPortalDateTime(value) : 'Not recorded');

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
      };
      const response = await portalApi.post(path, payload, 'sales_staff');
      setStatus(response.message);
      setNote('');
      await load();
    } catch (err) {
      setStatus(err.message);
    } finally {
      setBusy(false);
    }
  };

  const saveMileage = async () => {
    setBusy(true);
    setStatus('');
    try {
      const payload = {
        ...(mileageWeekStart !== '' ? { mileageWeekStart: Number(mileageWeekStart) } : {}),
        ...(mileageWeekEnd !== '' ? { mileageWeekEnd: Number(mileageWeekEnd) } : {}),
        note: mileageNote,
      };
      const response = await portalApi.post('/staff-portal/attendance/mileage', payload, 'sales_staff');
      setStatus(response.message);
      setMileageNote('');
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
              Button-first attendance for field teams, with optional notes. Weekly car mileage is saved separately below.
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
            <div className="portal-stat-label">
              Week start km
              {todayRecord?.mileageWeekStartAt ? ` • ${formatStamp(todayRecord.mileageWeekStartAt)}` : ''}
            </div>
          </div>
          <div className="portal-stat">
            <div className="portal-stat-value">{todayRecord?.mileageWeekEnd ?? '-'}</div>
            <div className="portal-stat-label">
              Week end km
              {todayRecord?.mileageWeekEndAt ? ` • ${formatStamp(todayRecord.mileageWeekEndAt)}` : ''}
            </div>
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

      <div className="portal-card portal-help-card">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Weekly Mileage</div>
            <h2 className="portal-section-title" style={{ fontSize: '1.45rem' }}>Save this only once at the start and end of the week</h2>
            <p className="portal-section-copy">
              Use <strong>week start km</strong> one time when the work week begins and <strong>week end km</strong> one time when the work week finishes. You do not need to fill this every day.
            </p>
          </div>
        </div>
        <div className="portal-form-grid two" style={{ marginTop: '1rem' }}>
          <div className="portal-field">
            <label>Car mileage week start</label>
            <input type="number" value={mileageWeekStart} onChange={(e) => setMileageWeekStart(e.target.value)} placeholder="Enter week start mileage" />
          </div>
          <div className="portal-field">
            <label>Car mileage week end</label>
            <input type="number" value={mileageWeekEnd} onChange={(e) => setMileageWeekEnd(e.target.value)} placeholder="Enter week end mileage" />
          </div>
        </div>
        <div className="portal-field" style={{ marginTop: '1rem' }}>
          <label>Mileage note</label>
          <textarea value={mileageNote} onChange={(e) => setMileageNote(e.target.value)} placeholder="Optional note for office records" />
        </div>
        <div className="portal-actions" style={{ marginTop: '1rem' }}>
          <button className="portal-button secondary" type="button" onClick={saveMileage} disabled={busy}>
            {busy ? 'Saving...' : 'Save Weekly Mileage'}
          </button>
        </div>
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
              <h3 className="portal-record-title">{formatPortalDate(record.date)}</h3>
              <div className="portal-record-meta">
                <span>In: {record.checkInTime ? formatPortalDateTime(record.checkInTime) : '-'}</span>
                <span>Out: {record.checkOutTime ? formatPortalDateTime(record.checkOutTime) : '-'}</span>
                <span>{record.totalWorkedMinutes || 0} mins</span>
                {record.mileageWeekStart !== undefined && record.mileageWeekStart !== null && <span>Start km: {record.mileageWeekStart}</span>}
                {record.mileageWeekStartAt && <span>Start entered: {formatPortalDateTime(record.mileageWeekStartAt)}</span>}
                {record.mileageWeekEnd !== undefined && record.mileageWeekEnd !== null && <span>End km: {record.mileageWeekEnd}</span>}
                {record.mileageWeekEndAt && <span>End entered: {formatPortalDateTime(record.mileageWeekEndAt)}</span>}
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
