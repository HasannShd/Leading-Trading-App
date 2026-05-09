import { FaInstagram, FaLinkedinIn, FaLocationDot, FaPhone, FaRegClock } from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';
import { useLanguage } from '../../context/LanguageContext';
import './Footer.css';

// Footer: App-wide footer with contact info, location, hours, and social links
const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-shell">
        <div className="footer-intro">
          <div className="footer-brand">
            <div className="footer-logo">
              <img
                src={`${import.meta.env.BASE_URL}company-logo.png`}
                alt="Leading Trading Est"
              />
            </div>
            <div className="footer-brand-copy">
              <span className="footer-eyebrow">{t('Leading Trading Est')}</span>
              <h2>{t('Supply support built for clinical, dental, and operational teams.')}</h2>
            </div>
          </div>
          <p className="footer-tagline">
            {t('Trusted sourcing, dependable manufacturer access, and responsive account support for organizations across Bahrain.')}
          </p>
          <div className="footer-cta-row">
            <a className="footer-cta" href="tel:+97317210665">{t('Call Us')}</a>
            <a className="footer-cta outline" href="https://wa.me/97317210665" target="_blank" rel="noopener noreferrer">{t('WhatsApp')}</a>
            <a className="footer-cta outline" href="/catalog">{t('Catalog')}</a>
          </div>
        </div>

        <div className="footer-grid">
          <div className="footer-col">
            <div className="footer-title"><FaLocationDot /> {t('Location')}</div>
            <div className="footer-text">
              <a href="https://maps.app.goo.gl/1Qw2Qw3Qw4Qw5Qw6A" target="_blank" rel="noopener noreferrer">
                Warehousing world, Um Al-Baidh<br />Sitra, Capital Governorate BH
              </a>
            </div>
          </div>

          <div className="footer-col">
            <div className="footer-title"><MdEmail /> {t('Reach Out')}</div>
            <div className="footer-text">
              <a href="mailto:admin@lte-bh.com">admin@lte-bh.com</a><br />
              <a href="tel:+97317210665">+97317210665</a>
            </div>
          </div>

          <div className="footer-col">
            <div className="footer-title"><FaPhone /> {t('Direct')}</div>
            <div className="footer-text">
              <a href="tel:+97317210665">{t('Office')}: +97317210665</a><br />
              <a href="https://wa.me/97317210665" target="_blank" rel="noopener noreferrer">{t('WhatsApp support')}</a>
            </div>
          </div>

          <div className="footer-col">
            <div className="footer-title"><FaRegClock /> {t('Hours')}</div>
            <div className="footer-hours-list">
              <div>{t('Sat – Thu: 8:00am – 4:00pm')}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div>© {new Date().getFullYear()} {t('Leading Trading Est')}. {t('All rights reserved.')}</div>
        <div className="footer-socials">
          <a href="https://www.instagram.com/leadingtradingest/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="footer-social-icon"><FaInstagram /></a>
          <a href="https://www.linkedin.com/company/leading-trading-est/?viewAsMember=true" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="footer-social-icon"><FaLinkedinIn /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
