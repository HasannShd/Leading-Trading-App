import { Link, useLocation } from 'react-router-dom';
import { FiFileText, FiGrid, FiMessageCircle, FiPhone } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

const MobileActionBar = () => {
  const { pathname } = useLocation();
  const { t } = useLanguage();

  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/staff') ||
    pathname.startsWith('/categories') ||
    pathname.startsWith('/catalog/pdf') ||
    pathname.startsWith('/sign-in') ||
    pathname.startsWith('/sign-up') ||
    pathname.startsWith('/checkout')
  ) {
    return null;
  }

  return (
    <nav className="mobile-action-bar" aria-label="Quick actions">
      <a href="tel:+97339939582" aria-label="Call LTE">
        <FiPhone aria-hidden="true" />
        <span>{t('Call')}</span>
      </a>
      <a href="https://wa.me/97317210665" target="_blank" rel="noreferrer">
        <FiMessageCircle aria-hidden="true" />
        <span>{t('WhatsApp')}</span>
      </a>
      <Link to="/contact?source=mobile-sticky">
        <FiFileText aria-hidden="true" />
        <span>{t('Quote')}</span>
      </Link>
      <Link to="/categories">
        <FiGrid aria-hidden="true" />
        <span>{t('Categories')}</span>
      </Link>
    </nav>
  );
};

export default MobileActionBar;
