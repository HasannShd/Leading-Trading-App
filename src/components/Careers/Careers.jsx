import { useState } from 'react';
import Seo from '../Common/Seo';
import { buildBreadcrumbSchema } from '../../utils/seoSchemas';
import StatePanel from '../Common/StatePanel';
import { useLanguage } from '../../context/LanguageContext';
import './Careers.css';

// Careers page with application form
const Careers = () => {
  const { t } = useLanguage();
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
        setError(t('Failed to submit application. Please try again.'));
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch (err) {
      setError(t('Failed to submit application. Please try again.'));
      setSubmitting(false);
    }
  };

  return (
    <main>
      <Seo
        title="Careers | Leading Trading Est Bahrain"
        description="Apply to join Leading Trading Est in Bahrain and support healthcare, dental, industrial, and safety supply operations."
        canonicalPath="/careers"
        keywords="Leading Trading Est careers, LTE Bahrain jobs, medical supplies jobs Bahrain, sales jobs Bahrain healthcare, procurement jobs Bahrain"
        structuredData={[
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Careers', path: '/careers' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Careers at Leading Trading Est',
            url: 'https://www.lte-bh.com/careers',
          },
        ]}
      />
      <section className="careers-hero">
        <div className="careers-hero-content">
          <h1>{t('Join Our Team')}</h1>
          <p>
            {t('We’re always looking for passionate people to help improve healthcare access. Share your details and CV and we’ll get back to you.')}
          </p>
        </div>
      </section>

      <section className="careers-section">
        {submitted ? (
          <StatePanel
            eyebrow={t('Application Sent')}
            title={t('Application received')}
            description={t('Thank you for your application. Our team will contact you soon.')}
            variant="success"
            className="careers-success"
          />
        ) : (
          <form className="careers-form" onSubmit={handleSubmit}>
            {error ? (
              <StatePanel
                eyebrow={t('Submission Error')}
                title={t('We couldn’t send your application')}
                description={error}
                variant="error"
                className="careers-feedback"
              />
            ) : null}
            <div className="careers-form-row">
              <label>
                {t('Name')}
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
                {t('Email')}
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
                {t('Phone Number')}
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
                {t('Nationality')}
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
              {t('Upload CV')}
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
                  {t('Choose File')}
                </label>
                <span className="careers-file-name">
                  {form.cv?.name || t('No file chosen')}
                </span>
              </div>
            </label>
            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? t('Sending Application...') : t('Submit Application')}
            </button>
          </form>
        )}
      </section>
    </main>
  );
};

export default Careers;
