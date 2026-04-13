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
    <div className="admin-categories">
      <AdminTopNav />
      <div className="admin-page-header">
        <h1>📣 Marketing Emails</h1>
        <button className="admin-add-btn" onClick={copyEmails}>Copy Emails</button>
      </div>

      {error && <div className="admin-error">{error}</div>}
      {status && <div className="admin-success">{status}</div>}

      <div className="admin-categories-list">
        <h2>Opted-in Users ({list.length})</h2>
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
                    <td className="col-name">{user.name || '-'}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || '-'}</td>
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
