import { useState } from 'react';
import StatePanel from '../Common/StatePanel';
import './Careers.css';

// Careers page with application form
const Careers = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', nationality: '', cv: null });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
    if (submitting) return;
    setError('');
    setSubmitting(true);
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
        setError('Failed to submit application. Please try again.');
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit application. Please try again.');
      setSubmitting(false);
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
          <StatePanel
            eyebrow="Application Sent"
            title="Application received"
            description="Thank you for your application. Our team will contact you soon."
            variant="success"
            className="careers-success"
          />
        ) : (
          <form className="careers-form" onSubmit={handleSubmit}>
            {error ? (
              <StatePanel
                eyebrow="Submission Error"
                title="We couldn’t send your application"
                description={error}
                variant="error"
                className="careers-feedback"
              />
            ) : null}
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
              <div className="careers-file-input">
                <input
                  id="careers-cv-upload"
                  type="file"
                  name="cv"
                  accept=".pdf,.doc,.docx"
                  onChange={handleChange}
                  required
                  className="careers-file-native"
                />
                <label htmlFor="careers-cv-upload" className="careers-file-trigger">
                  Choose File
                </label>
                <span className="careers-file-name">
                  {form.cv?.name || 'No file chosen'}
                </span>
              </div>
            </label>
            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? 'Sending Application...' : 'Submit Application'}
            </button>
          </form>
        )}
      </section>
    </main>
  );
};

export default Careers;
