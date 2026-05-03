import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import './Auth.css';

const SignUp = () => {
  const { register, error } = useContext(AuthContext);
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    marketingOptIn: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await register(form);
    setIsLoading(false);
    if (success) {
      navigate('/cart');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>{t('Create Account')}</h1>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            {t('Full Name')}
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            {t('Username')}
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder={t('Choose a username')}
              autoComplete="username"
              required
            />
          </label>
          <label>
            {t('Email')}
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </label>
          <label>
            {t('Phone')}
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              autoComplete="tel"
              required
            />
          </label>
          <label>
            {t('Password')}
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </label>
          <label className="auth-checkbox">
            <input
              type="checkbox"
              name="marketingOptIn"
              checked={form.marketingOptIn}
              onChange={handleChange}
            />
            {t('Subscribe to updates and offers')}
          </label>
          <button type="submit" className="btn primary" disabled={isLoading}>
            {isLoading ? t('Creating account...') : t('Create Account')}
          </button>
        </form>
        <p className="auth-switch">
          {t('Already have an account?')} <Link to="/sign-in">{t('Sign in')}</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
