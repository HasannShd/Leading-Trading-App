import { useEffect, useState, useCallback } from 'react';
import './AdminCategories.css';
import AdminTopNav from './AdminTopNav';
import { authFetch } from '../../services/authFetch';

const AdminMarketing = () => {
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const handleAdminPrecondition = (message) => {
    setList([]);
    setError(message || 'Admin setup is required before using this section.');
  };

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const response = await authFetch('/users/marketing', { scope: 'admin' });
      const data = await response.json();
      if (response.status === 428) {
        handleAdminPrecondition(data.message);
        return;
      }
      if (!response.ok) {
        setList([]);
        setError(data.err || 'Failed to fetch list');
        return;
      }
      setList(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setList([]);
      setError('Failed to fetch list');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const copyEmails = async () => {
    const emails = list.map(item => item.email).filter(Boolean).join(', ');
    try {
      await navigator.clipboard.writeText(emails);
      setStatus('Emails copied to clipboard.');
    } catch (err) {
      setStatus('Copy failed. Please try again.');
    }
  };

  return (
    <div className="admin-categories admin-surface">
      <AdminTopNav />
      <section className="admin-surface-hero">
        <div className="admin-surface-eyebrow">Audience List</div>
        <div className="admin-surface-hero-row">
          <div className="admin-surface-copy">
            <h1>Keep outreach contacts tidy and ready to export.</h1>
            <p>Use this page to quickly copy the opted-in list for campaigns while checking the contact quality before sending anything out.</p>
          </div>
          <div className="admin-surface-actions">
            <button className="admin-add-btn" onClick={copyEmails}>Copy Emails</button>
          </div>
        </div>
        <div className="admin-surface-stats">
          <div className="admin-surface-stat">
            <strong>{list.length}</strong>
            <span>Opted-in contacts</span>
          </div>
          <div className="admin-surface-stat">
            <strong>{list.filter((entry) => entry.email).length}</strong>
            <span>With email</span>
          </div>
          <div className="admin-surface-stat">
            <strong>{list.filter((entry) => entry.phone).length}</strong>
            <span>With phone</span>
          </div>
          <div className="admin-surface-stat">
            <strong>{status ? 'Ready' : 'Live'}</strong>
            <span>Clipboard tools</span>
          </div>
        </div>
      </section>

      {error && <div className="admin-error">{error}</div>}
      {status && <div className="admin-success">{status}</div>}

      <div className="admin-categories-list">
        <div className="admin-panel-heading">
          <div>
            <h2>Opted-in Users ({list.length})</h2>
            <p>Review names, emails, and phone numbers before copying the list into your mailing workflow.</p>
          </div>
        </div>
        {loading ? (
          <p className="loading">Loading...</p>
        ) : (
          <div className="categories-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {list.map(user => (
                  <tr key={user._id}>
                    <td className="col-name" data-label="Name">{user.name || '-'}</td>
                    <td data-label="Email">{user.email}</td>
                    <td data-label="Phone">{user.phone || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMarketing;
