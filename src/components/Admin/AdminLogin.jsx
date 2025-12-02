import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext';
import './AdminLogin.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, error } = useContext(AdminContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login(username, password);
    setIsLoading(false);
    if (success) {
      navigate('/.well-known/admin-dashboard-sh123456');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h1 className="admin-login-title">Admin Login</h1>
        
        {error && <div className="admin-error-message">{error}</div>}
        
        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label className="admin-form-label">
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="admin-form-input"
              placeholder="Enter your username"
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
          <p>Need to promote a user to admin? Use the backend script:</p>
          <code>node scripts/promoteAdmin.js &lt;username&gt;</code>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
