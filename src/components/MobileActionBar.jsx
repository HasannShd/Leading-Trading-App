import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const MobileActionBar = () => {
  const { pathname } = useLocation();
  const { t } = useLanguage();

  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/staff') ||
    pathname.startsWith('/sign-in') ||
    pathname.startsWith('/sign-up') ||
    pathname.startsWith('/checkout')
  ) {
    return null;
  }

  return (
    <nav className="mobile-action-bar" aria-label="Quick actions">
      <a href="tel:+97317210665">{t('Call')}</a>
      <a href="https://wa.me/97317210665" target="_blank" rel="noreferrer">{t('WhatsApp')}</a>
      <Link to="/contact?source=mobile-sticky">{t('Quote')}</Link>
      <Link to="/categories">{t('Categories')}</Link>
    </nav>
  );
};

export default MobileActionBar;
