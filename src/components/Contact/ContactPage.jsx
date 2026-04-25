import { useState } from 'react';
import './ContactPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.err || 'Could not submit your inquiry. Please try again.');
      } else {
        setSuccess(data.message || 'Thank you! We will get back to you shortly.');
        setForm({ name: '', email: '', phone: '', message: '' });
        setConsent(false);
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-form-block">
        <div className="contact-form-title-row">
          <span className="contact-form-accent"></span>
          <span className="contact-form-title">GET IN TOUCH</span>
        </div>
        <h2 className="contact-form-head">We're here to assist you!</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>Name <span className="required">*</span>
            <input type="text" name="name" placeholder="Jane Smith" required value={form.name} onChange={handleChange} />
          </label>
          <label>Email address <span className="required">*</span>
            <input type="email" name="email" placeholder="email@website.com" required value={form.email} onChange={handleChange} />
          </label>
          <label>Phone number <span className="required">*</span>
            <input type="tel" name="phone" placeholder="5555 5555 555" required value={form.phone} onChange={handleChange} />
          </label>
          <label>Message
            <textarea name="message" rows="4" value={form.message} onChange={handleChange} />
          </label>
          <label className="contact-form-checkbox">
            <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span>I allow this website to store my submission so they can respond to my inquiry. <span className="required">*</span></span>
          </label>
          {error && <div className="contact-form-error">{error}</div>}
          {success && <div className="contact-form-success">{success}</div>}
          <button type="submit" className="contact-form-submit" disabled={loading}>
            {loading ? 'Sending…' : 'Submit'}
          </button>
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
};

export default ContactPage;
