import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Seo from '../Common/Seo';
import { buildBreadcrumbSchema, localBusinessSchema } from '../../utils/seoSchemas';
import { useLanguage } from '../../context/LanguageContext';
import './ContactPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ContactPage = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const quoteSearch = searchParams.toString();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [quoteContext, setQuoteContext] = useState({
    source: '',
    productId: '',
    productName: '',
    sku: '',
    categoryId: '',
    categoryName: '',
    pageUrl: '',
  });
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    const params = new URLSearchParams(quoteSearch);
    const nextContext = {
      source: params.get('source') || '',
      productId: params.get('product') || '',
      productName: params.get('productName') || params.get('name') || '',
      sku: params.get('sku') || '',
      categoryId: params.get('category') || '',
      categoryName: params.get('categoryName') || '',
      pageUrl: params.get('pageUrl') || '',
    };

    if (!nextContext.source) {
      nextContext.source = nextContext.productId ? 'product' : nextContext.categoryId ? 'category' : '';
    }

    setQuoteContext(nextContext);
  }, [quoteSearch]);

  useEffect(() => {
    if (!quoteContext.productId || quoteContext.productName) return undefined;

    const controller = new AbortController();

    const fetchProductContext = async () => {
      try {
        const response = await fetch(`${API_URL}/products/${quoteContext.productId}`, {
          signal: controller.signal,
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data?._id) return;

        setQuoteContext((prev) => ({
          ...prev,
          productName: data.name || prev.productName,
          sku: data.sku || data.variants?.[0]?.sku || prev.sku,
          categoryId: data.categorySlug?._id || prev.categoryId,
          categoryName: data.categorySlug?.name || prev.categoryName,
          pageUrl: prev.pageUrl || (typeof window !== 'undefined' ? `${window.location.origin}/product/${data._id}` : `/product/${data._id}`),
        }));
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Failed to load quote product context', err);
        }
      }
    };

    fetchProductContext();

    return () => controller.abort();
  }, [quoteContext.productId, quoteContext.productName]);

  const quoteLabel = useMemo(
    () => quoteContext.productName || quoteContext.categoryName || '',
    [quoteContext.categoryName, quoteContext.productName]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, quoteContext }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.err || t('Could not submit your inquiry. Please try again.'));
      } else {
        setSuccess(
          quoteLabel
            ? `${t("We've received your request for")} ${quoteLabel}. ${t('Our team will get back to you shortly.')}`
            : data.message || t('Thank you! We will get back to you shortly.')
        );
        setForm({ name: '', email: '', phone: '', message: '' });
        setConsent(false);
      }
    } catch {
      setError(t('Network error. Please check your connection and try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <Seo
        title="Request a Quote | Leading Trading Est Bahrain"
        description="Contact Leading Trading Est in Bahrain for medical, dental, laboratory, industrial, and safety supply quotations and sourcing support."
        canonicalPath="/contact"
        keywords="request quote Bahrain medical supplies, contact Leading Trading Est, Bahrain dental supplies quote, industrial supplies quote Bahrain, laboratory equipment quote Bahrain"
        structuredData={[
          localBusinessSchema,
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Request a Quote from Leading Trading Est',
            url: 'https://www.lte-bh.com/contact',
            mainEntity: { '@id': 'https://www.lte-bh.com/#local-business' },
          },
        ]}
      />
      <div className="contact-form-block">
        <div className="contact-form-title-row">
          <span className="contact-form-accent"></span>
          <span className="contact-form-title">{t('GET IN TOUCH')}</span>
        </div>
        <h2 className="contact-form-head">{t("We're here to assist you!")}</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          {quoteLabel ? (
            <div className="contact-quote-context" aria-live="polite">
              <span>{t('Interested in')}</span>
              <strong>{quoteLabel}</strong>
              {quoteContext.sku ? <small>{t('SKU')}: {quoteContext.sku}</small> : null}
            </div>
          ) : null}
          {Object.entries(quoteContext).map(([key, value]) => (
            <input key={key} type="hidden" name={`quoteContext[${key}]`} value={value} readOnly />
          ))}
          <label>{t('Name')} <span className="required">*</span>
            <input type="text" name="name" placeholder="Jane Smith" required value={form.name} onChange={handleChange} />
          </label>
          <label>{t('Email address')} <span className="required">*</span>
            <input type="email" name="email" placeholder="email@website.com" required value={form.email} onChange={handleChange} />
          </label>
          <label>{t('Phone number')} <span className="required">*</span>
            <input type="tel" name="phone" placeholder="5555 5555 555" required value={form.phone} onChange={handleChange} />
          </label>
          <label>{t('Message')}
            <textarea name="message" rows="4" value={form.message} onChange={handleChange} />
          </label>
          <label className="contact-form-checkbox">
            <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span>{t('I allow this website to store my submission so they can respond to my inquiry.')} <span className="required">*</span></span>
          </label>
          {error && <div className="contact-form-error">{error}</div>}
          {success && <div className="contact-form-success">{success}</div>}
          <button type="submit" className="contact-form-submit" disabled={loading}>
            {loading ? t('Sending…') : t('Submit')}
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
          <div className="contact-info-title">{t('Get in touch')}</div>
          <div><a href="tel:+97339939582">+97339939582</a></div>
          <div><a href="mailto:admin@lte-bh.com">admin@lte-bh.com</a></div>
          <div className="contact-info-socials">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a> &nbsp;
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
          <div className="contact-info-title">{t('Location')}</div>
          <div>
            <a href="https://maps.app.goo.gl/1Qw2Qw3Qw4Qw5Qw6A" target="_blank" rel="noopener noreferrer">
              Warehousing world, Um Al-Baidh<br />Sitra, Capital Governorate BH
            </a>
          </div>
          <div className="contact-info-title">{t('Hours')}</div>
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
