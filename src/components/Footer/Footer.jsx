
// Footer: App-wide footer with contact info, location, hours, and social links
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container footer-main">
        <div className="footer-col">
          <div className="footer-title">Location</div>
          <div>
            <a href="https://maps.app.goo.gl/1Qw2Qw3Qw4Qw5Qw6A" target="_blank" rel="noopener noreferrer">
              Warehousing world, Um Al-Baidh<br />Sitra, Capital Governorate BH
            </a>
          </div>
        </div>
        <div className="footer-col">
          <div className="footer-title">Reach out</div>
          <div>
            <a href="mailto:admin@lte-bh.com">admin@lte-bh.com</a><br />
            <a href="tel:+97339939582">+97339939582</a>
          </div>
        </div>
        <div className="footer-col">
          <div className="footer-title">Connect</div>
          <div className="footer-socials">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="footer-social-icon">&#xf09a;</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="footer-social-icon">&#xf16d;</a>
          </div>
        </div>
      </div>
      <div className="footer-hours">
        <div className="footer-title">Hours</div>
        <div className="footer-hours-list">
          <div>Monday&nbsp;&nbsp;&nbsp;8:00am &ndash; 4:00pm</div>
          <div>Tuesday&nbsp;&nbsp;&nbsp;8:00am &ndash; 4:00pm</div>
          <div>Wednesday&nbsp;&nbsp;&nbsp;8:00am &ndash; 4:00pm</div>
          <div>Thursday&nbsp;&nbsp;&nbsp;8:00am &ndash; 4:00pm</div>
          <div>Saturday&nbsp;&nbsp;&nbsp;8:00am &ndash; 4:00pm</div>
          <div>Sunday&nbsp;&nbsp;&nbsp;8:00am &ndash; 4:00pm</div>
        </div>
      </div>
      <div className="footer-brand-center">Leading Trading Est</div>
    </footer>
  );
};

export default Footer;
