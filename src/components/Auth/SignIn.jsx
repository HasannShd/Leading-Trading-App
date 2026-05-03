import { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import './Auth.css';

const SignIn = () => {
  const { user, login, error } = useContext(AuthContext);
  const { t } = useLanguage();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/cart', { replace: true });
    }
  }, [navigate, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login(identifier, password);
    setIsLoading(false);
    if (success) {
      navigate('/cart');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>{t('Sign In')}</h1>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            {t('Email or Username')}
            <input
              type="text"
              name="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={t('Enter your email or username')}
              autoComplete="username webauthn"
              required
            />
          </label>
          <label>
            {t('Password')}
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          <button type="submit" className="btn primary" disabled={isLoading}>
            {isLoading ? t('Signing in...') : t('Sign In')}
          </button>
        </form>
        <p className="auth-switch">
          {t('New here?')} <Link to="/sign-up">{t('Create an account')}</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
