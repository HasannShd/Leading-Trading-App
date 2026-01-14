import './Footer.css';

// Footer: App-wide footer with contact info, location, hours, and social links
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <img
              src={`${import.meta.env.BASE_URL}company%20logo.png`}
              alt="Leading Trading Est"
            />
          </div>
          <p className="footer-tagline">Supplying trusted medical and industrial essentials across Bahrain.</p>
          <div className="footer-cta-row">
            <a className="footer-cta" href="tel:+97339939582">Call Us</a>
            <a className="footer-cta outline" href="https://wa.me/97317210665" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
        </div>

        <div className="footer-col">
          <div className="footer-title">Location</div>
          <div className="footer-text">
            <a href="https://maps.app.goo.gl/1Qw2Qw3Qw4Qw5Qw6A" target="_blank" rel="noopener noreferrer">
              Warehousing world, Um Al-Baidh<br />Sitra, Capital Governorate BH
            </a>
          </div>
        </div>

        <div className="footer-col">
          <div className="footer-title">Reach out</div>
          <div className="footer-text">
            <a href="mailto:admin@lte-bh.com">admin@lte-bh.com</a><br />
            <a href="tel:+97339939582">+97317210665</a>
          </div>
        </div>

        <div className="footer-col">
          <div className="footer-title">Hours</div>
          <div className="footer-hours-list">
            <div>Mon – Thu: 8:00am – 4:00pm</div>
            <div>Sat – Sun: 8:00am – 4:00pm</div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div>© {new Date().getFullYear()} Leading Trading Est. All rights reserved.</div>
        <div className="footer-socials">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="footer-social-icon">f</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="footer-social-icon">◎</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="footer-social-icon">in</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
