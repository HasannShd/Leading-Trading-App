import { useEffect, useState } from 'react';
import './AdminCategories.css';
import AdminTopNav from './AdminTopNav';

const AdminMarketing = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('adminToken');
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/users/marketing`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.err || 'Failed to fetch list');
        return;
      }
      setList(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const copyEmails = async () => {
    const emails = list.map(item => item.email).filter(Boolean).join(', ');
    try {
      await navigator.clipboard.writeText(emails);
      alert('Emails copied');
    } catch (err) {
      alert('Copy failed');
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
