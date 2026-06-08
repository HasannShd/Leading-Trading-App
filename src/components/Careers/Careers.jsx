import { useState } from 'react';
import Seo from '../Common/Seo';
import { buildBreadcrumbSchema } from '../../utils/seoSchemas';
import StatePanel from '../Common/StatePanel';
import { useLanguage } from '../../context/LanguageContext';
import './Careers.css';

const CV_ACCEPT = '.pdf,.doc,.docx';
const ALLOWED_CV_EXTENSIONS = ['pdf', 'doc', 'docx'];
const ALLOWED_CV_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const isAllowedCvFile = (file) => {
  if (!file) return false;
  const extension = file.name.split('.').pop()?.toLowerCase();
  const typeAllowed = file.type ? ALLOWED_CV_TYPES.includes(file.type) : true;
  return ALLOWED_CV_EXTENSIONS.includes(extension) && typeAllowed;
};

const whyItems = [
  {
    index: '01',
    title: 'Focused work environment',
    body: 'A lean, focused team means your contribution is visible and directly tied to the company\'s delivery performance.',
  },
  {
    index: '02',
    title: 'Cross-sector exposure',
    body: 'Working across medical, dental, laboratory, industrial, and safety supply gives you breadth that a single-sector role rarely offers.',
  },
  {
    index: '03',
    title: 'Accountability-led culture',
    body: 'LTE runs on clear roles, honest follow-through, and consistent standards — the kind of environment where reliable people thrive.',
  },
];

const Careers = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', phone: '', nationality: '', cv: null });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'cv') {
      const file = files?.[0] || null;
      if (file && !isAllowedCvFile(file)) {
        e.target.value = '';
        setForm(f => ({ ...f, cv: null }));
        setError(t('Please upload your CV as a PDF, DOC, or DOCX file.'));
        return;
      }
      setError('');
      setForm(f => ({ ...f, cv: file }));
      return;
    }
    setForm(f => ({ ...f, [name]: files ? files[0] : value }));
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleSubmit = async e => {
    e.preventDefault();
    if (submitting) return;
    setError('');
    if (!isAllowedCvFile(form.cv)) {
      setError(t('Please upload your CV as a PDF, DOC, or DOCX file.'));
      return;
    }
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
    } catch {
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

      <div className="careers-shell">

        {/* ── Hero ── */}
        <section className="careers-hero">
          <div className="careers-hero-copy">
            <span className="careers-eyebrow">{t('Leading Trading Est. | Bahrain')}</span>
            <h1>{t('Join Our Team')}</h1>
            <p>
              {t('We\'re always looking for reliable, focused people to support healthcare and industrial supply operations across Bahrain. Share your details and we\'ll be in touch.')}
            </p>
          </div>
          <div className="careers-hero-panel">
            <p className="careers-hero-panel-label">{t('What we look for')}</p>
            <ul className="careers-hero-panel-list">
              <li>{t('Accountability and follow-through')}</li>
              <li>{t('Clear, professional communication')}</li>
              <li>{t('Comfort working in a structured, lean team')}</li>
              <li>{t('Interest in the healthcare & industrial sector')}</li>
            </ul>
          </div>
        </section>

        {/* ── Why LTE ── */}
        <section className="careers-why">
          <div className="careers-section-head">
            <span className="careers-eyebrow careers-eyebrow--ink">{t('Why LTE')}</span>
            <h2>{t('A focused team with real operational scope.')}</h2>
          </div>
          <div className="careers-why-grid">
            {whyItems.map(item => (
              <article key={item.index} className="careers-why-card">
                <span className="careers-why-index">{item.index}</span>
                <h3>{t(item.title)}</h3>
                <p>{t(item.body)}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Application Form ── */}
        <section className="careers-apply">
          <div className="careers-section-head">
            <span className="careers-eyebrow careers-eyebrow--ink">{t('Apply Now')}</span>
            <h2>{t('Send us your application.')}</h2>
            <p className="careers-section-desc">
              {t('Fill in your details and attach your CV. Our team reviews every application and will contact suitable candidates directly.')}
            </p>
          </div>

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
              {error && (
                <StatePanel
                  eyebrow={t('Submission Error')}
                  title={t('We couldn\'t send your application')}
                  description={error}
                  variant="error"
                  className="careers-feedback"
                />
              )}
              <div className="careers-form-row">
                <label className="careers-label">
                  <span>{t('Full Name')}</span>
                  <input type="text" name="name" value={form.name} onChange={handleChange} required className="careers-input" placeholder={t('Your full name')} />
                </label>
                <label className="careers-label">
                  <span>{t('Email Address')}</span>
                  <input type="email" name="email" value={form.email} onChange={handleChange} className="careers-input" placeholder={t('your@email.com')} />
                </label>
              </div>
              <div className="careers-form-row">
                <label className="careers-label">
                  <span>{t('Phone Number')}</span>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} required className="careers-input" placeholder={t('+973 XXXX XXXX')} />
                </label>
                <label className="careers-label">
                  <span>{t('Nationality')}</span>
                  <input type="text" name="nationality" value={form.nationality} onChange={handleChange} required className="careers-input" placeholder={t('e.g. Bahraini')} />
                </label>
              </div>
              <label className="careers-label">
                <span>{t('Upload CV')}</span>
                <div className="careers-file-input">
                  <input
                    id="careers-cv-upload"
                    type="file"
                    name="cv"
                    accept={CV_ACCEPT}
                    onChange={handleChange}
                    required
                    aria-describedby="careers-cv-help"
                    className="careers-file-native"
                  />
                  <label htmlFor="careers-cv-upload" className="careers-file-trigger">
                    {t('Choose File')}
                  </label>
                  <span className="careers-file-name">
                    {form.cv?.name || t('No file chosen')}
                  </span>
                </div>
                <small id="careers-cv-help" className="careers-file-help">
                  {t('Accepted formats: PDF, DOC, or DOCX.')}
                </small>
              </label>
              <div className="careers-form-footer">
                <button type="submit" className="careers-submit" disabled={submitting}>
                  {submitting ? t('Sending Application…') : t('Submit Application')}
                </button>
              </div>
            </form>
          )}
        </section>

      </div>
    </main>
  );
};

export default Careers;
