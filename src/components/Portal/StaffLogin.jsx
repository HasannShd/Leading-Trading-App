import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StaffContext } from '../../context/StaffContext';
import './PortalShell.css';

const StaffLogin = () => {
  const { login, error, loading } = useContext(StaffContext);
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const ok = await login(identifier, password);
    if (ok) navigate('/staff/dashboard', { replace: true });
  };

  return (
    <div className="portal-shell">
      <div className="portal-content">
        <section className="portal-card dark" style={{ maxWidth: '32rem', margin: '4rem auto 0' }}>
          <div className="portal-section-head">
            <div>
              <div className="portal-brand-kicker">LTE Field Access</div>
              <h1 className="portal-section-title">Staff Sign In</h1>
              <p className="portal-section-copy" style={{ color: 'rgba(255,255,255,0.76)' }}>
                Simple sign-in for schedules, visits, orders, reports, and daily field work.
              </p>
            </div>
          </div>
          <div className="portal-badge status" style={{ marginBottom: '1rem', width: 'fit-content' }}>
            Use your staff username and password given by the office
          </div>
          <form className="portal-form" onSubmit={handleSubmit}>
            <div className="portal-field">
              <label>Username, email, or phone</label>
              <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="Enter your username" autoComplete="username" />
            </div>
            <div className="portal-field">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" />
            </div>
            {error && <div className="portal-badge status">{error}</div>}
            <button className="portal-button primary" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default StaffLogin;
