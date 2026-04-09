import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { normalizeImageSrc } from '../../utils/normalizeImageSrc';
import { useHomepageScroll } from './useHomepageScroll';
import './Homepage.css';

const homepageCategories = [
  {
    name: 'Medical Equipment',
    label: 'Clinical systems',
    description: 'Diagnostic and treatment support equipment for hospitals, clinics, and operational care environments.',
  },
  {
    name: 'Anesthesia & Respiratory',
    label: 'Airway and respiratory care',
    description: 'Products selected for respiratory support, airway control, and procedure-critical environments.',
  },
  {
    name: 'Dental',
    label: 'Practice continuity',
    description: 'Dental consumables and specialist tools that keep practices supplied without disrupting workflow.',
  },
  {
    name: 'Consumables & Disposables',
    label: 'Recurring essentials',
    description: 'High-rotation products that support daily care, infection control, and procedure readiness.',
  },
  {
    name: 'Industrial & Safety',
    label: 'Operational protection',
    description: 'Industrial and safety sourcing for disciplined operations where reliability and availability matter.',
  },
  {
    name: 'Hospital Furniture & Utilities',
    label: 'Facility support',
    description: 'Furniture, transport, and utility items that support day-to-day movement, care, and storage.',
  },
];

const sectors = [
  {
    key: 'medical',
    eyebrow: 'Medical solutions',
    title: 'For hospitals, clinics, and practices where procurement decisions affect care continuity.',
    body: 'LTE supports regulated medical environments with clearer sourcing, dependable availability, and better control over product suitability, timing, and documentation.',
    points: ['Hospitals and specialist centers', 'Clinics and outpatient facilities', 'Routine and urgent replenishment'],
  },
  {
    key: 'industrial',
    eyebrow: 'Industrial solutions',
    title: 'For operational teams that need disciplined supply support, not fragmented vendor follow-up.',
    body: 'The same structured workflow extends into industrial and safety sourcing, giving buyers a steadier path from request to delivery without noise or wasted coordination.',
    points: ['Safety and utility products', 'Operational supply continuity', 'Consistent delivery planning'],
  },
];

const capabilityCards = [
  {
    title: 'Trusted product selection',
    body: 'Known brands, suitable alternatives, and procurement choices that stay aligned to real use cases instead of broad catalog clutter.',
  },
  {
    title: 'Clearer commercial follow-through',
    body: 'Quotation handling, supplier coordination, and order timing stay visible so teams spend less time chasing updates.',
  },
  {
    title: 'Built for repeat accounts',
    body: 'LTE is structured for continuing buyer relationships where continuity, clarity, and responsiveness matter more than one-off transactions.',
  },
];

const mainBrands = [
  { name: 'Medstar', logo: 'Brands/medstar.jpg' },
  { name: 'Rogin', logo: 'Brands/rogin.png' },
  { name: 'SMI', logo: 'Brands/Smi.png' },
  { name: 'ROMSONS', logo: 'Brands/romsons.png' },
  { name: 'Hermann Meditech', logo: 'Brands/Hermann.png' },
  { name: 'Zogear', logo: 'Brands/Zogear.png' },
  { name: 'ADC', logo: 'Brands/adc.png' },
  { name: 'Osseous', logo: 'Brands/osseous.png' },
  { name: 'Berger', logo: 'Brands/berger.jpg' },
  { name: 'Bastos-Viegas', logo: 'Brands/bastosviegas.webp' },
];

const clients = [
  { name: 'Ministry of Health', logo: 'clients/ministry.jpg' },
  { name: 'King Hamad University Hospital', logo: 'clients/khuh.png' },
  { name: 'Bapco', logo: 'clients/bapco.jpg' },
  { name: 'Bahrain Defence Force', logo: 'clients/bdf.png' },
  { name: 'Royal Specialized Center', logo: 'clients/rsci.png' },
  { name: 'American Mission', logo: 'clients/american mission.png' },
  { name: 'Aster', logo: 'clients/aster.jpg' },
  { name: 'Al Salam', logo: 'clients/al salam.jpg' },
  { name: 'Al Rayan', logo: 'clients/al rayan.jpg' },
  { name: 'Shifa Al Jazeera', logo: 'clients/shifa al jazeera.jpg' },
];

const HomePage = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const baseUrl = import.meta.env.BASE_URL;
  const rootRef = useRef(null);

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPreference = () => setPrefersReducedMotion(media.matches);

    syncPreference();
    media.addEventListener('change', syncPreference);

    return () => media.removeEventListener('change', syncPreference);
  }, []);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch(`${API_URL}/products?featured=true&limit=5`);
        const data = await response.json();
        const items = Array.isArray(data) ? data : data.items || [];
        setFeaturedProducts(items);
      } catch (error) {
        console.error('Failed to load featured products', error);
      }
    };

    fetchFeatured();
  }, [API_URL]);

  useHomepageScroll(rootRef, !prefersReducedMotion);

  const leadProduct = featuredProducts[0] || null;
  const secondaryProducts = featuredProducts.slice(1, 5);

  const spotlightStats = useMemo(
    () => [
      { value: '10+', label: 'Years serving Bahrain-based buyers' },
      { value: 'Medical + Industrial', label: 'Two operationally different sectors, one disciplined workflow' },
      { value: 'Supplier-led clarity', label: 'Known manufacturer relationships and dependable coordination' },
    ],
    []
  );

  return (
    <main className="cinematic-home" ref={rootRef}>
      <section className="home-hero">
        <div className="home-hero__backdrop" />

        <div className="home-shell home-hero__grid">
          <div className="home-hero__copy js-hero-copy">
            <span className="home-eyebrow">Leading Trading Est. | Bahrain</span>
            <h1>Trusted medical and industrial supply, presented with the confidence your customers expect.</h1>
            <p>
              Leading Trading Est. delivers dependable sourcing, stronger supplier relationships, and measured service for organizations that cannot afford uncertainty.
            </p>

            <div className="home-hero__actions">
              <Link className="home-btn home-btn--primary" to="/contact">Request a Quote</Link>
              <Link className="home-btn home-btn--ghost" to="/products">Explore Categories</Link>
            </div>

            <div className="home-hero__notes">
              <span>NHRA-aware procurement</span>
              <span>Medical and industrial sourcing</span>
              <span>Dependable local support</span>
            </div>
          </div>

          <div className="home-hero__stage js-hero-stage">
            <article className="hero-stage hero-stage--primary">
              <img src={`${baseUrl}lp.jpg`} alt="Operational procurement and care environment" loading="eager" />
              <div className="hero-stage__overlay">
                <span>Operational view</span>
                <strong>Structured support for hospitals, clinics, and demanding teams.</strong>
              </div>
            </article>

            <article className="hero-stage hero-stage--secondary">
              <img src={`${baseUrl}Stethescope.webp`} alt="Medical detail" loading="lazy" />
              <div className="hero-stage__caption">
                <span>Precision matters</span>
                <strong>Products, timing, and service aligned to real use.</strong>
              </div>
            </article>

            <article className="hero-stage hero-stage--panel">
              <span className="hero-stage__tag">Service posture</span>
              <h2>Measured, reliable, and built for repeat trust.</h2>
              <ul>
                <li>Fast quotation handling</li>
                <li>Supplier and stock coordination</li>
                <li>Support that stays responsive after the first order</li>
              </ul>
            </article>
          </div>
        </div>

        <div className="home-shell home-hero__stats js-fade-up">
          {spotlightStats.map((item) => (
            <article className="hero-stat" key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section home-intro js-fade-up">
        <div className="home-shell home-intro__panel">
          <div className="home-intro__copy">
            <span className="home-eyebrow home-eyebrow--ink">Brand position</span>
            <h2>LTE is a supply partner for organizations that need reliability before reassurance.</h2>
            <p>
              The business already serves medical and industrial buyers in Bahrain. The homepage should reflect that same level of discipline: clear priorities, calm pacing, and stronger confidence in every section.
            </p>
          </div>

          <div className="home-intro__aside">
            <article>
              <small>Leadership</small>
              <strong>Shahid Majeed</strong>
              <p>Managing Director & CEO guiding supplier relationships, direction, and long-term commercial trust.</p>
            </article>
            <article>
              <small>Operating teams</small>
              <strong>Sales, accounts, HR, and delivery</strong>
              <p>Commercial response and customer service stay connected so the workflow remains visible end to end.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="home-story js-story-pin">
        <div className="home-shell story-shell js-story-shell">
          <div className="story-rail">
            <span className="home-eyebrow home-eyebrow--ink">Scroll narrative</span>
            <div className="story-progress">
              <div className="story-progress__fill js-story-progress-fill" />
            </div>
          </div>

          <div className="story-content">
            <div className="story-copy">
              <div className="story-copy__block story-copy__block--base js-story-copy-intro">
                <span className="story-copy__step">01</span>
                <h2>One message at a time. First trust. Then sector relevance. Then proof.</h2>
                <p>
                  The homepage should not behave like a crowded catalog. It should establish confidence first, then reveal where LTE is strongest and why buyers stay.
                </p>
              </div>

              <div className="story-copy__block js-story-copy-medical">
                <span className="story-copy__step">02</span>
                <span className="home-eyebrow home-eyebrow--ink">{sectors[0].eyebrow}</span>
                <h2>{sectors[0].title}</h2>
                <p>{sectors[0].body}</p>
                <ul>
                  {sectors[0].points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>

              <div className="story-copy__block js-story-copy-industrial">
                <span className="story-copy__step">03</span>
                <span className="home-eyebrow home-eyebrow--ink">{sectors[1].eyebrow}</span>
                <h2>{sectors[1].title}</h2>
                <p>{sectors[1].body}</p>
                <ul>
                  {sectors[1].points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="story-visual">
              <article className="story-panel story-panel--medical js-story-panel-medical">
                <div className="story-panel__top">
                  <span>Medical solutions</span>
                  <strong>Hospitals, clinics, and repeat-use environments</strong>
                </div>
                <p>
                  Better sourcing decisions come from product fit, supplier confidence, and procurement clarity, not just from having stock on a list.
                </p>
                <div className="story-panel__media">
                  <img src={`${baseUrl}Stethescope.webp`} alt="Medical supply detail" loading="lazy" />
                </div>
              </article>

              <article className="story-panel story-panel--industrial js-story-panel-industrial">
                <div className="story-panel__top">
                  <span>Industrial solutions</span>
                  <strong>Operational products where continuity matters as much as price.</strong>
                </div>
                <p>
                  Industrial teams need disciplined supply support too. The same workflow extends into safety, utilities, and operational continuity with less friction.
                </p>
                <div className="story-panel__stack">
                  <div>
                    <small>Operational support</small>
                    <strong>Safety, utilities, and industrial essentials</strong>
                  </div>
                  <div>
                    <small>Service rhythm</small>
                    <strong>Reliable sourcing, inventory alignment, and delivery follow-through</strong>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section home-trust js-trust">
        <div className="home-shell">
          <div className="section-heading js-fade-up">
            <span className="home-eyebrow home-eyebrow--ink">Brands and institutions</span>
            <h2>Credibility should arrive before the catalog does.</h2>
            <p>
              LTE works with selected manufacturers and supplies institutions whose standards require more than a broad product list.
            </p>
          </div>

          <div className="trust-grid">
            <article className="trust-card trust-card--copy js-logo-block">
              <small>Trusted manufacturers</small>
              <h3>Established brands, selected for fit and continuity.</h3>
              <p>
                The strongest supplier relationship is not just access, it is confidence that the product, documentation, and timing will stay aligned when orders repeat.
              </p>
            </article>

            <div className="trust-card trust-card--logos js-logo-block">
              {mainBrands.map((brand) => (
                <div className={`logo-chip logo-chip--brand logo-chip--${brand.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} key={brand.name}>
                  <img src={`${baseUrl}${brand.logo}`} alt={brand.name} loading="lazy" />
                </div>
              ))}
            </div>
          </div>

          <div className="trust-grid trust-grid--clients">
            <article className="trust-card trust-card--copy js-logo-block">
              <small>Institutions supplied</small>
              <h3>Built to support organizations that expect steadier service.</h3>
              <p>
                From major hospitals to recognized specialist institutions, the customer mix signals the level of confidence the business is already trusted with.
              </p>
            </article>

            <div className="trust-card trust-card--logos trust-card--clients js-logo-block">
              {clients.map((client) => (
                <div className={`logo-chip logo-chip--client logo-chip--${client.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} key={client.name}>
                  <img src={`${baseUrl}${client.logo}`} alt={client.name} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="home-section home-categories js-categories">
        <div className="home-shell">
          <div className="section-heading section-heading--inline js-fade-up">
            <div>
              <span className="home-eyebrow home-eyebrow--ink">Featured categories</span>
              <h2>The catalog should feel curated, not dropped onto the page all at once.</h2>
            </div>
            <Link className="home-inline-link" to="/products">Browse all categories</Link>
          </div>

          <div className="category-grid">
            {homepageCategories.map((category) => (
              <Link className="category-card js-category-card" key={category.name} to="/products">
                <small>{category.label}</small>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <span>Explore category</span>
              </Link>
            ))}
          </div>

          <div className="featured-band js-fade-up">
            {leadProduct ? (
              <>
                <Link className="featured-band__lead" to={`/product/${leadProduct._id}`}>
                  <div className="featured-band__lead-copy">
                    <small>Product spotlight</small>
                    <h3>{leadProduct.name}</h3>
                    <p>
                      {leadProduct.description?.trim() ||
                        'A selected featured product representing the current strength of the catalog.'}
                    </p>
                    <span>{leadProduct.brand || leadProduct.categorySlug?.name || 'Featured selection'}</span>
                  </div>
                  <div className="featured-band__lead-media">
                    {leadProduct.image ? (
                      <img src={normalizeImageSrc(leadProduct.image)} alt={leadProduct.name} loading="lazy" />
                    ) : (
                      <div className="featured-fallback">{leadProduct.name?.[0] || 'P'}</div>
                    )}
                  </div>
                </Link>

                <div className="featured-band__rail">
                  {secondaryProducts.map((product) => (
                    <Link className="featured-mini" key={product._id} to={`/product/${product._id}`}>
                      <div className="featured-mini__media">
                        {product.image ? (
                          <img src={normalizeImageSrc(product.image)} alt={product.name} loading="lazy" />
                        ) : (
                          <div className="featured-fallback">{product.name?.[0] || 'P'}</div>
                        )}
                      </div>
                      <div className="featured-mini__copy">
                        <small>{product.brand || 'Featured'}</small>
                        <strong>{product.name}</strong>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="featured-band__empty">Featured products will appear here as they are marked in the catalog.</div>
            )}
          </div>
        </div>
      </section>

      <section className="home-section home-credibility js-credibility">
        <div className="home-shell">
          <div className="section-heading js-fade-up">
            <span className="home-eyebrow home-eyebrow--ink">Why LTE</span>
            <h2>A supplier should think beyond the invoice when the buying environment is critical.</h2>
            <p>
              What keeps buyers loyal is not just product access. It is confidence in how the supplier thinks, responds, and follows through when details matter.
            </p>
          </div>

          <div className="credibility-grid">
            {capabilityCards.map((card) => (
              <article className="credibility-card js-credibility-card" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-cta js-fade-up">
        <div className="home-shell cta-panel">
          <div>
            <span className="home-eyebrow">Closing step</span>
            <h2>When the business already operates with confidence, the website should close with the same clarity.</h2>
            <p>
              For quotations, category support, or account enquiries, the next move should be simple and immediate.
            </p>
          </div>

          <div className="cta-panel__actions">
            <Link className="home-btn home-btn--primary" to="/contact">Request a Quote</Link>
            <Link className="home-btn home-btn--ghost-light" to="/about">Learn More About LTE</Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
