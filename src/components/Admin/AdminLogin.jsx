import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext';
import './AdminLogin.css';

const AdminLogin = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, error } = useContext(AdminContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login(identifier, password);
    setIsLoading(false);
    if (success) {
      navigate(window.location.pathname.startsWith('/admin') ? '/admin/dashboard' : '/.well-known/admin-dashboard-sh123456');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h1 className="admin-login-title">Admin Login</h1>
        
        {error && <div className="admin-error-message">{error}</div>}
        
        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label className="admin-form-label">
            Email or username
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="admin-form-input"
              placeholder="Enter your account email"
              autoComplete="username"
              required
            />
          </label>

          <label className="admin-form-label">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-form-input"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </label>

          <button
            type="submit"
            className="admin-login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="admin-login-help">
          <p>Use the same account email and password created on the website. The account must have role <code>admin</code>.</p>
          <p>Need to promote a user to admin? Use the backend script:</p>
          <code>node scripts/promoteAdmin.js &lt;username&gt;</code>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
