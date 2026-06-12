import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Seo from '../Common/Seo';
import { buildBreadcrumbSchema, localBusinessSchema, medicalOrganizationSchema, organizationSchema } from '../../utils/seoSchemas';
import { useLanguage } from '../../context/LanguageContext';
import { BUSINESS_HOURS, businessMapsEmbedUrl, businessMapsUrl } from '../../utils/businessProfile';
import { buildProductPath } from '../../utils/productUrls';
import './ContactPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
const GOOGLE_MAPS_MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || '';
const RFQ_FILE_ACCEPT = '.pdf,.doc,.docx,.xls,.xlsx,.csv';
const RFQ_ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv'];
const RFQ_MAX_SIZE_MB = 8;

const STORE_LOCATOR_CONFIGURATION = {
  locations: [
    {
      title: 'Leading Trading Est',
      address1: 'Office 109, Building 658, Road 16, Block 616, Warehousing World',
      address2: 'Um Al-Baidh, Sitra, Bahrain',
      coords: { lat: 26.1151676, lng: 50.6307677 },
      placeId: 'ChIJKzQkkBirST4RQLnYDx5O4Zc',
    },
  ],
  mapOptions: {
    center: { lat: 26.1151676, lng: 50.6307677 },
    fullscreenControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    zoom: 15,
    zoomControl: true,
    maxZoom: 17,
    mapId: GOOGLE_MAPS_MAP_ID,
  },
  mapsApiKey: GOOGLE_MAPS_API_KEY,
  capabilities: {
    input: true,
    autocomplete: true,
    directions: true,
    distanceMatrix: true,
    details: true,
    actions: false,
  },
};

const ContactPage = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const quoteSearch = searchParams.toString();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    quantity: '',
    urgency: 'Standard',
    preferredContact: 'WhatsApp',
    message: '',
  });
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
  const [turnstileToken, setTurnstileToken] = useState('');
  const [rfqFile, setRfqFile] = useState(null);
  const turnstileRef = useRef(null);
  const turnstileWidgetIdRef = useRef(null);
  const locatorRef = useRef(null);
  const apiLoaderRef = useRef(null);
  const rfqFileInputRef = useRef(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRfqFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setError('');
    if (!file) {
      setRfqFile(null);
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    if (!RFQ_ALLOWED_EXTENSIONS.includes(extension)) {
      setRfqFile(null);
      event.target.value = '';
      setError(t('Please upload RFQ documents as PDF, Word, Excel, or CSV files only.'));
      return;
    }
    if (file.size > RFQ_MAX_SIZE_MB * 1024 * 1024) {
      setRfqFile(null);
      event.target.value = '';
      setError(t('RFQ attachment must be 8 MB or smaller.'));
      return;
    }

    setRfqFile(file);
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
          cache: 'no-store',
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data?._id) return;

        setQuoteContext((prev) => ({
          ...prev,
          productName: data.name || prev.productName,
          sku: data.sku || data.variants?.[0]?.sku || prev.sku,
          categoryId: data.categorySlug?._id || prev.categoryId,
          categoryName: data.categorySlug?.name || prev.categoryName,
          pageUrl: prev.pageUrl || (typeof window !== 'undefined' ? `${window.location.origin}${buildProductPath(data)}` : buildProductPath(data)),
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

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !turnstileRef.current) return undefined;

    let cancelled = false;

    const renderTurnstile = () => {
      if (cancelled || !window.turnstile || !turnstileRef.current || turnstileWidgetIdRef.current) return;
      turnstileWidgetIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token) => setTurnstileToken(token),
        'expired-callback': () => setTurnstileToken(''),
        'error-callback': () => setTurnstileToken(''),
      });
    };

    if (window.turnstile) {
      renderTurnstile();
    } else {
      const existing = document.querySelector('script[data-turnstile-script="true"]');
      if (existing) {
        existing.addEventListener('load', renderTurnstile, { once: true });
      } else {
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        script.dataset.turnstileScript = 'true';
        script.addEventListener('load', renderTurnstile, { once: true });
        document.head.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      if (window.turnstile && turnstileWidgetIdRef.current) {
        window.turnstile.remove(turnstileWidgetIdRef.current);
      }
      turnstileWidgetIdRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY || !locatorRef.current || !apiLoaderRef.current) return undefined;

    let cancelled = false;
    apiLoaderRef.current.setAttribute('key', GOOGLE_MAPS_API_KEY);

    const configureLocator = async () => {
      if (typeof customElements === 'undefined' || !customElements.whenDefined) return;
      await customElements.whenDefined('gmpx-store-locator');
      if (cancelled || !locatorRef.current?.configureFromQuickBuilder) return;
      locatorRef.current.configureFromQuickBuilder(STORE_LOCATOR_CONFIGURATION);
    };

    const loadScript = () => {
      const existing = document.querySelector('script[data-google-store-locator="true"]');
      if (existing) {
        existing.addEventListener('load', configureLocator, { once: true });
        configureLocator();
        return;
      }

      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://ajax.googleapis.com/ajax/libs/@googlemaps/extended-component-library/0.6.11/index.min.js';
      script.dataset.googleStoreLocator = 'true';
      script.addEventListener('load', configureLocator, { once: true });
      document.head.appendChild(script);
    };

    loadScript();

    return () => {
      cancelled = true;
    };
  }, []);

  const quoteLabel = useMemo(
    () => quoteContext.productName || quoteContext.categoryName || '',
    [quoteContext.categoryName, quoteContext.productName]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!consent) {
      setError(t('Please allow this website to store your submission so we can respond to your inquiry.'));
      return;
    }
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setError(t('Please complete the bot verification before submitting.'));
      return;
    }

    setLoading(true);
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      payload.append('consent', String(consent));
      payload.append('turnstileToken', turnstileToken);
      payload.append('quoteContext', JSON.stringify(quoteContext));
      if (rfqFile) payload.append('rfqFile', rfqFile);

      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        body: payload,
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
        setForm({
          name: '',
          email: '',
          phone: '',
          company: '',
          quantity: '',
          urgency: 'Standard',
          preferredContact: 'WhatsApp',
          message: '',
        });
        setConsent(false);
        setRfqFile(null);
        if (rfqFileInputRef.current) {
          rfqFileInputRef.current.value = '';
        }
        setTurnstileToken('');
        if (window.turnstile && turnstileWidgetIdRef.current) {
          window.turnstile.reset(turnstileWidgetIdRef.current);
        }
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
          organizationSchema,
          localBusinessSchema,
          medicalOrganizationSchema,
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Request a Quote from Leading Trading Est',
            url: 'https://www.lte-bh.com/contact',
            mainEntity: [
              { '@id': 'https://www.lte-bh.com/#local-business' },
              { '@id': 'https://www.lte-bh.com/#medical-organization' },
            ],
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
          <label>{t('Company / facility')}
            <input type="text" name="company" placeholder="Clinic, hospital, company, or department" value={form.company} onChange={handleChange} />
          </label>
          <div className="contact-form-grid">
            <label>{t('Quantity')}
              <input type="text" name="quantity" placeholder="Example: 10 boxes" value={form.quantity} onChange={handleChange} />
            </label>
            <label>{t('Urgency')}
              <select name="urgency" value={form.urgency} onChange={handleChange}>
                <option value="Standard">{t('Standard')}</option>
                <option value="Urgent">{t('Urgent')}</option>
                <option value="Repeat order">{t('Repeat order')}</option>
                <option value="Planning ahead">{t('Planning ahead')}</option>
              </select>
            </label>
          </div>
          <label>{t('Preferred contact method')}
            <select name="preferredContact" value={form.preferredContact} onChange={handleChange}>
              <option value="WhatsApp">{t('WhatsApp')}</option>
              <option value="Phone call">{t('Phone call')}</option>
              <option value="Email">{t('Email')}</option>
            </select>
          </label>
          <label>{t('Message')}
            <textarea name="message" rows="4" value={form.message} onChange={handleChange} />
          </label>
          <label>{t('Attach RFQ or requirement file')}
            <input
              ref={rfqFileInputRef}
              type="file"
              name="rfqFile"
              accept={RFQ_FILE_ACCEPT}
              onChange={handleRfqFileChange}
              aria-describedby="rfq-file-help"
            />
            <small id="rfq-file-help" className="contact-file-help">
              {rfqFile ? rfqFile.name : t('Optional: PDF, Word, Excel, or CSV up to 8 MB.')}
            </small>
          </label>
          <label className="contact-form-checkbox">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span>{t('I allow this website to store my submission so they can respond to my inquiry.')} <span className="required">*</span></span>
          </label>
          {TURNSTILE_SITE_KEY ? (
            <div className="contact-turnstile" ref={turnstileRef} />
          ) : null}
          {error && <div className="contact-form-error">{error}</div>}
          {success && <div className="contact-form-success">{success}</div>}
          <button type="submit" className="contact-form-submit" disabled={loading}>
            {loading ? t('Sending…') : t('Submit')}
          </button>
        </form>
      </div>
      <div className="contact-info-block">
        {GOOGLE_MAPS_API_KEY ? (
          <div className="contact-store-locator">
            <gmpx-api-loader ref={apiLoaderRef} solution-channel="GMP_QB_locatorplus_v11_cABCDE"></gmpx-api-loader>
            <gmpx-store-locator ref={locatorRef} map-id={GOOGLE_MAPS_MAP_ID}></gmpx-store-locator>
          </div>
        ) : (
          <iframe
            className="contact-map"
            src={businessMapsEmbedUrl}
            title="LTE Location"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        )}
        <div className="contact-info-details">
          <div className="contact-info-title">{t('Get in touch')}</div>
          <div><a href="tel:+97339939582">+97339939582</a></div>
          <div><a href="mailto:admin@lte-bh.com">admin@lte-bh.com</a></div>
          <div className="contact-info-socials">
            <a href="https://www.instagram.com/leadingtradingest/" target="_blank" rel="noopener noreferrer">Instagram</a> &nbsp;
            <a href="https://www.linkedin.com/company/leading-trading-est/?viewAsMember=true" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
          <div className="contact-info-title">{t('Location')}</div>
          <div>
            <a href={businessMapsUrl} target="_blank" rel="noopener noreferrer">
              Office 109, Building 658, Road 16, Block 616<br />
              Warehousing World, Um Al-Baidh<br />
              Sitra, Capital Governorate BH
            </a>
          </div>
          <div>
            <Link to="/solutions/warehousing-world-bahrain">View LTE at Warehousing World Bahrain</Link>
          </div>
          <div className="contact-info-title">{t('Hours')}</div>
          <table className="contact-info-hours">
            <tbody>
              {BUSINESS_HOURS.map((item) => (
                <tr key={item.day}>
                  <th scope="row">{item.day}</th>
                  <td>{item.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
