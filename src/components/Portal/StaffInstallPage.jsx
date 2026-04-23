import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './PortalShell.css';

const isStandaloneMode = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true);

const StaffInstallPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isStandaloneMode()) return;

    const hasStaffSession = Boolean(localStorage.getItem('staffToken'));
    navigate(hasStaffSession ? '/staff/dashboard' : '/staff/login', { replace: true });
  }, [navigate]);

  return (
    <div className="portal-shell">
      <div className="portal-content">
        <section className="portal-card dark" style={{ maxWidth: '36rem', margin: '4rem auto 0' }}>
          <div className="portal-section-head">
            <div>
              <div className="portal-brand-kicker">LTE Field Access</div>
              <h1 className="portal-section-title">Install Staff App</h1>
              <p className="portal-section-copy" style={{ color: 'rgba(255,255,255,0.76)' }}>
                On iPhone, add this exact page to the home screen. The installed icon will then open the staff app instead of the public website.
              </p>
            </div>
          </div>

          <ol className="portal-help-list" style={{ color: 'rgba(255,255,255,0.84)', marginBottom: '1.25rem' }}>
            <li>Open this page in Safari.</li>
            <li>Tap Share, then choose Add to Home Screen.</li>
            <li>Launch the new icon from your home screen.</li>
          </ol>

          <div className="portal-inline-actions">
            <Link className="portal-inline-button secondary" to="/staff/login">
              Open Staff Login
            </Link>
            <Link className="portal-inline-button ghost" to="/">
              Back to Website
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StaffInstallPage;
