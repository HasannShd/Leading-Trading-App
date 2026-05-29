import { FaInstagram, FaLinkedinIn, FaLocationDot, FaPhone, FaRegClock } from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';
import { useLanguage } from '../../context/LanguageContext';
import { businessMapsEmbedUrl, businessMapsUrl } from '../../utils/businessProfile';
import './Footer.css';

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
              <h2>{t('Ready for the next quotation?')}</h2>
              <p>
                {t('Send a requirement, request a catalog reference, or contact the LTE team for availability and sourcing support.')}
              </p>
            </div>
          </div>
          <div className="footer-cta-row">
            <a className="footer-cta" href="tel:+97317210665">{t('Call Us')}</a>
            <a className="footer-cta outline" href="https://wa.me/97317210665" target="_blank" rel="noopener noreferrer">{t('WhatsApp')}</a>
            <a className="footer-cta outline" href="/catalog">{t('Catalog')}</a>
            <a className="footer-cta outline" href="/privacy">{t('Privacy Policy')}</a>
          </div>
        </div>

        <div className="footer-grid">
          <div className="footer-col">
            <div className="footer-title"><MdEmail /> {t('Contact')}</div>
            <div className="footer-text">
              <a href="mailto:admin@lte-bh.com">admin@lte-bh.com</a><br />
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

          <div className="footer-col">
            <div className="footer-title"><FaPhone /> {t('Resources')}</div>
            <div className="footer-text">
              <a href="/catalog">{t('Catalog')}</a><br />
              <a href="/resources">{t('Resources')}</a><br />
              <a href="/privacy">{t('Privacy Policy')}</a>
            </div>
          </div>
        </div>

        <div className="footer-trust">
          <span>{t('Established 2012')}</span>
          <span>{t('Bahrain supply support')}</span>
          <span>{t('Documents shared during quotation review')}</span>
        </div>

        <div className="footer-map">
          <div className="footer-map__copy">
            <span className="footer-title"><FaLocationDot /> {t('Google Maps')}</span>
            <p>{t('Find Leading Trading Est at Warehousing World, Um Al-Baidh, Sitra.')}</p>
            <a href={businessMapsUrl} target="_blank" rel="noopener noreferrer">
              {t('Open Google Maps')}
            </a>
          </div>
          <iframe
            title="Leading Trading Est Google Maps location"
            src={businessMapsEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>

      <div className="footer-bottom">
        <div>© {new Date().getFullYear()} {t('Leading Trading Est')}. {t('All rights reserved.')}</div>
        <div className="footer-bottom-links">
          <a href="/resources">{t('Resources')}</a>
          <a href="/privacy">{t('Privacy Policy')}</a>
          <div className="footer-socials">
            <a href="https://www.instagram.com/leadingtradingest/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="footer-social-icon"><FaInstagram /></a>
            <a href="https://www.linkedin.com/company/leading-trading-est/?viewAsMember=true" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="footer-social-icon"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
