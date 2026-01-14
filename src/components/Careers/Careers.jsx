import { useState } from 'react';
import './Careers.css';

// Careers page with application form
const Careers = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', nationality: '', cv: null });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(f => ({
      ...f,
      [name]: files ? files[0] : value
    }));
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', form.name);
      data.append('email', form.email);
      data.append('phone', form.phone);
      data.append('nationality', form.nationality);
      data.append('cv', form.cv);
      const response = await fetch(`${API_URL}/careers/apply`, {
        method: 'POST',
        body: data,
      });
      if (!response.ok) {
        alert('Failed to submit application.');
        return;
      }
      setSubmitted(true);
    } catch (err) {
      alert('Failed to submit application.');
    }
  };

  return (
    <main>
      <section className="careers-hero">
        <div className="careers-hero-content">
          <h1>Join Our Team</h1>
          <p>
            We’re always looking for passionate people to help improve healthcare access.
            Share your details and CV and we’ll get back to you.
          </p>
        </div>
      </section>

      <section className="careers-section">
        {submitted ? (
          <div className="careers-success">
            <h2>Application received</h2>
            <p>Thank you for your application. Our team will contact you soon.</p>
          </div>
        ) : (
          <form className="careers-form" onSubmit={handleSubmit}>
            <div className="careers-form-row">
              <label>
                Name
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="input"
                />
              </label>
            </div>
            <div className="careers-form-row">
              <label>
                Phone Number
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </label>
              <label>
                Nationality
                <input
                  type="text"
                  name="nationality"
                  value={form.nationality}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </label>
            </div>
            <label>
              Upload CV
              <input
                type="file"
                name="cv"
                accept=".pdf,.doc,.docx"
                onChange={handleChange}
                required
                className="input"
              />
            </label>
            <button type="submit" className="btn">Submit Application</button>
          </form>
        )}
      </section>
    </main>
  );
};

export default Careers;
