import './ContactPage.css';

const ContactPage = () => (
  <div className="contact-page">
    <div className="contact-form-block">
      <div className="contact-form-title-row">
        <span className="contact-form-accent"></span>
        <span className="contact-form-title">GET IN TOUCH</span>
      </div>
      <h2 className="contact-form-head">We're here to assist you!</h2>
      <form className="contact-form">
        <label>Name <span className="required">*</span>
          <input type="text" name="name" placeholder="Jane Smith" required />
        </label>
        <label>Email address <span className="required">*</span>
          <input type="email" name="email" placeholder="email@website.com" required />
        </label>
        <label>Phone number <span className="required">*</span>
          <input type="tel" name="phone" placeholder="5555 5555 555" required />
        </label>
        <label>Message
          <textarea name="message" rows="4" />
        </label>
        <label className="contact-form-checkbox">
          <input type="checkbox" required />
          <span>I allow this website to store my submission so they can respond to my inquiry. <span className="required">*</span></span>
        </label>
        <button type="submit" className="contact-form-submit">Submit</button>
      </form>
    </div>
    <div className="contact-info-block">
      <iframe
        className="contact-map"
        src="https://www.google.com/maps?q=Warehousing%20world%2C%20Um%20Al-Baidh%2C%20Sitra%2C%20Bahrain&output=embed"
        title="LTE Location"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
      <div className="contact-info-details">
        <div className="contact-info-title">Get in touch</div>
        <div><a href="tel:+97339939582">+97339939582</a></div>
        <div><a href="mailto:admin@lte-bh.com">admin@lte-bh.com</a></div>
        <div className="contact-info-socials">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a> &nbsp;
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
        <div className="contact-info-title">Location</div>
        <div>
          <a href="https://maps.app.goo.gl/1Qw2Qw3Qw4Qw5Qw6A" target="_blank" rel="noopener noreferrer">
            Warehousing world, Um Al-Baidh<br />Sitra, Capital Governorate BH
          </a>
        </div>
        <div className="contact-info-title">Hours</div>
        <div className="contact-info-hours">
          <div>Monday&nbsp;&nbsp;&nbsp;8:00am – 4:00pm</div>
          <div>Tuesday&nbsp;&nbsp;&nbsp;8:00am – 4:00pm</div>
          <div>Wednesday&nbsp;&nbsp;&nbsp;8:00am – 4:00pm</div>
          <div>Thursday&nbsp;&nbsp;&nbsp;8:00am – 4:00pm</div>
          <div>Saturday&nbsp;&nbsp;&nbsp;8:00am – 4:00pm</div>
          <div>Sunday&nbsp;&nbsp;&nbsp;8:00am – 4:00pm</div>
        </div>
      </div>
    </div>
  </div>
);

export default ContactPage;
