import { FaInstagram, FaLinkedinIn } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { businessMapsEmbedUrl, businessMapsUrl } from '../../utils/businessProfile';
import './Footer.css';

const supplyGuideLinks = [
  { label: 'Medical Supplies Bahrain', to: '/solutions/medical-supplies-bahrain' },
  { label: 'Medical Equipment Supplier Bahrain', to: '/solutions/medical-equipment-supplier-bahrain' },
  { label: 'Hospital Supplies Bahrain', to: '/solutions/hospital-supplies-bahrain' },
  { label: 'PPE Supplier Bahrain', to: '/solutions/ppe-supplier-bahrain' },
  { label: 'Dental Supplier Bahrain', to: '/solutions/dental-supplier-bahrain' },
  { label: 'Laboratory Equipment Supplier Bahrain', to: '/solutions/laboratory-equipment-supplier-bahrain' },
  { label: 'Orthopedic Supplies Bahrain', to: '/solutions/orthopedic-supplies-bahrain' },
  { label: 'Surgical Instruments Bahrain', to: '/solutions/surgical-instruments-bahrain' },
  { label: 'Anesthesia & Respiratory Supplies', to: '/solutions/anesthesia-respiratory-bahrain' },
  { label: 'Disposable Consumables Bahrain', to: '/solutions/disposable-consumables-bahrain' },
  { label: 'Beauty Care Supplies Bahrain', to: '/solutions/beauty-care-supplies-bahrain' },
  { label: 'Industrial Supplies Bahrain', to: '/solutions/industrial-safety-supplies-bahrain' },
];

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-shell">

        {/* ── Top row: brand statement + CTA ── */}
        <div className="footer-top">
          <div className="footer-top-copy">
            <span className="footer-eyebrow">{t('Leading Trading Est')}</span>
            <h2>{t('Medical, dental & industrial supply — Bahrain.')}</h2>
          </div>
          <div className="footer-top-actions">
            <Link className="footer-cta" to="/contact">{t('Get a Quote')}</Link>
            <a className="footer-cta footer-cta--outline" href="https://wa.me/97317210665" target="_blank" rel="noopener noreferrer">{t('WhatsApp')}</a>
          </div>
        </div>

        {/* ── Info + Map ── */}
        <div className="footer-body">
          <div className="footer-info">
            <div className="footer-info-group">
              <p className="footer-info-label">{t('Contact')}</p>
              <a href="mailto:admin@lte-bh.com">admin@lte-bh.com</a>
              <a href="tel:+97317210665">+973 1721 0665</a>
              <a href="https://wa.me/97317210665" target="_blank" rel="noopener noreferrer">{t('WhatsApp')}</a>
            </div>
            <div className="footer-info-group">
              <p className="footer-info-label">{t('Hours')}</p>
              <span>{t('Sat – Thu')}</span>
              <span>{t('8:00am – 4:00pm')}</span>
            </div>
            <div className="footer-info-group">
              <p className="footer-info-label">{t('Navigate')}</p>
              <Link to="/categories">{t('Categories')}</Link>
              <Link to="/catalog">{t('Catalog')}</Link>
              <Link to="/brands">{t('Brands')}</Link>
              <Link to="/resources">{t('Resources')}</Link>
              <Link to="/about">{t('About')}</Link>
              <Link to="/careers">{t('Careers')}</Link>
            </div>
          </div>

          <div className="footer-map">
            <a className="footer-map-open" href={businessMapsUrl} target="_blank" rel="noopener noreferrer">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s-8-6.5-8-12a8 8 0 0 1 16 0c0 5.5-8 12-8 12z"/><circle cx="12" cy="9" r="2.5"/></svg>
              {t('Open in Maps')}
            </a>
            <iframe
              title="Leading Trading Est location"
              src={businessMapsEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>

        {/* ── Supply guides strip ── */}
        <div className="footer-guides">
          <span className="footer-guides__label">{t('Supply Guides')}</span>
          <div className="footer-guides__chips">
            {supplyGuideLinks.map((item) => (
              <Link key={item.to} to={item.to} className="footer-guide-chip">{t(item.label)}</Link>
            ))}
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {t('Leading Trading Est')}. {t('All rights reserved.')} · <a href="https://www.webiqq.com" target="_blank" rel="noopener noreferrer" style={{color:'inherit',opacity:0.6}}>Built by Webiqq</a></span>
          <div className="footer-bottom-right">
            <a href="/privacy">{t('Privacy Policy')}</a>
            <div className="footer-socials">
              <a href="https://www.instagram.com/leadingtradingest/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="footer-social-icon"><FaInstagram /></a>
              <a href="https://www.linkedin.com/company/leading-trading-est/?viewAsMember=true" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="footer-social-icon"><FaLinkedinIn /></a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
