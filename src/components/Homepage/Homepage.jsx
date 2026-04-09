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

const valuePillars = [
  {
    title: 'Vendor Relations',
    body: 'Supplier relationships are managed for continuity, access, and dependable repeat ordering rather than opportunistic sourcing.',
    detail: 'Selected manufacturer relationships',
  },
  {
    title: 'Quality Assurance',
    body: 'Product fit, documentation, and suitability matter before quotation speed. The workflow is built around reducing avoidable friction.',
    detail: 'Product and documentation discipline',
  },
  {
    title: 'Logistics',
    body: 'Requests move through a clearer delivery path with timing visibility, inventory awareness, and practical coordination.',
    detail: 'Operational movement without noise',
  },
  {
    title: 'Customer Commitment',
    body: 'Sales, accounts, and delivery remain connected so support does not disappear once an order is placed.',
    detail: 'Local follow-through after sourcing',
  },
];

const workflowSteps = [
  {
    title: 'Inquiry',
    body: 'Requirements are clarified first so the request is commercially and operationally useful from the beginning.',
  },
  {
    title: 'Sourcing',
    body: 'Suppliers are screened against fit, quality, availability, and the level of confidence required for the end use.',
  },
  {
    title: 'Procurement',
    body: 'Commercial terms, product details, and documentation move into a cleaner buying decision with fewer unknowns.',
  },
  {
    title: 'Logistics',
    body: 'Expected timing, inventory handling, and delivery coordination are aligned before the order lands on the customer side.',
  },
  {
    title: 'Delivery & Support',
    body: 'The process closes with visible handover, repeat-order readiness, and support that remains responsive after the first purchase.',
  },
];

const sectors = [
  {
    key: 'medical',
    eyebrow: 'Medical solutions',
    title: 'For hospitals, clinics, and practices where procurement decisions affect care continuity.',
    body: 'LTE supports regulated medical environments with clearer sourcing, dependable availability, and better control over product suitability, timing, and documentation.',
    points: ['Hospitals and specialist centers', 'Clinics and outpatient facilities', 'Routine and urgent replenishment'],
    image: 'Stethescope.webp',
    visualTitle: 'Hospitals, clinics, and repeat-use environments',
    visualBody: 'Better sourcing decisions come from product fit, supplier confidence, and procurement clarity, not just from having stock on a list.',
  },
  {
    key: 'industrial',
    eyebrow: 'Industrial solutions',
    title: 'For operational teams that need disciplined supply support, not fragmented vendor follow-up.',
    body: 'The same structured workflow extends into industrial and safety sourcing, giving buyers a steadier path from request to delivery without noise or wasted coordination.',
    points: ['Safety and utility products', 'Operational supply continuity', 'Consistent delivery planning'],
    image: 'about page.webp',
    visualTitle: 'Industrial continuity without procurement drag',
    visualBody: 'Operational teams need the same level of supply discipline: selected products, cleaner coordination, and dependable local follow-through.',
  },
];

const whyStats = [
  { value: '10+', label: 'Years serving Bahrain-based buyers' },
  { value: 'Medical + Industrial', label: 'Two sectors supported with one measured workflow' },
  { value: 'Supplier-led clarity', label: 'Known manufacturer relationships and dependable coordination' },
  { value: 'Repeat-account focus', label: 'Built for recurring trust, not only one-off transactions' },
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

  useHomepageScroll(rootRef, true);

  const leadProduct = featuredProducts[0] || null;
  const secondaryProducts = featuredProducts.slice(1, 5);
  const marqueeBrands = useMemo(() => [...mainBrands, ...mainBrands], []);
  const marqueeClients = useMemo(() => [...clients, ...clients], []);

  return (
    <main className="cinematic-home" ref={rootRef}>
      <section className="home-hero">
        <div className="home-hero__ambient" />
        <div className="home-shell home-hero__grid">
          <div className="home-hero__copy animate-stagger" data-stagger-step="120ms">
            <span className="home-eyebrow animate-on-scroll">Leading Trading Est. | Bahrain</span>
            <h1 className="animate-on-scroll">Trusted medical and industrial supply, presented with the confidence your customers expect.</h1>
            <p className="animate-on-scroll">
              Leading Trading Est. delivers dependable sourcing, stronger supplier relationships, and measured service for organizations that cannot afford uncertainty.
            </p>

            <div className="home-hero__actions animate-on-scroll">
              <Link className="home-btn home-btn--primary" to="/contact">Request a Quote</Link>
              <Link className="home-btn home-btn--ghost" to="/products">Explore Categories</Link>
            </div>

            <div className="home-hero__notes animate-stagger" data-stagger-step="90ms">
              <span className="animate-on-scroll">NHRA-aware procurement</span>
              <span className="animate-on-scroll">Medical and industrial sourcing</span>
              <span className="animate-on-scroll">Dependable Bahrain-based support</span>
            </div>
          </div>

          <div className="home-hero__visual animate-on-scroll" data-hero-parallax="slow">
            <div className="hero-orb" />
            <div className="hero-visual__frame">
              <img src={`${baseUrl}lp.jpg`} alt="Leading Trading Est operational environment" loading="eager" />
            </div>
            <article className="hero-visual__panel" data-hero-parallax="fast">
              <small>Operational confidence</small>
              <strong>Better supplier control, clearer delivery rhythm, stronger repeat trust.</strong>
            </article>
          </div>
        </div>

        <div className="home-shell home-hero__metrics animate-stagger" data-stagger-step="120ms">
          {whyStats.slice(0, 3).map((item) => (
            <article className="hero-metric animate-on-scroll" key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section business-model">
        <div className="home-shell">
          <div className="section-heading animate-stagger" data-stagger-step="110ms">
            <span className="home-eyebrow home-eyebrow--ink animate-on-scroll">How LTE creates value</span>
            <h2 className="animate-on-scroll">A stronger supplier is defined by how the workflow holds together, not just by what appears in the catalog.</h2>
            <p className="animate-on-scroll">
              The business model is simple to understand and difficult to replace: selected vendor relationships, controlled quality, disciplined logistics, and customer support that does not disappear after the first order.
            </p>
          </div>

          <div className="pillar-grid animate-stagger" data-stagger-step="120ms">
            {valuePillars.map((pillar, index) => (
              <article className="pillar-card animate-on-scroll" key={pillar.title}>
                <span className="pillar-card__index">{`0${index + 1}`}</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.body}</p>
                <strong>{pillar.detail}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section workflow-stage">
        <div className="home-shell workflow-stage__grid">
          <div className="workflow-stage__intro animate-stagger" data-stagger-step="110ms">
            <span className="home-eyebrow home-eyebrow--ink animate-on-scroll">Workflow</span>
            <h2 className="animate-on-scroll">The process should feel visible from inquiry to delivery, not improvised in the middle.</h2>
            <p className="animate-on-scroll">
              LTE’s operating rhythm starts with a clear need, moves through sourcing and procurement with supplier control, and closes with logistics and support that stay responsive.
            </p>
            <div className="workflow-stage__line">
              <span className="workflow-stage__line-fill" />
            </div>
          </div>

          <div className="workflow-stage__steps animate-stagger" data-stagger-step="140ms">
            {workflowSteps.map((step, index) => (
              <article className="workflow-step animate-on-scroll" key={step.title}>
                <span className="workflow-step__index">{`0${index + 1}`}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section sector-sequence">
        <div className="home-shell">
          <div className="section-heading animate-stagger" data-stagger-step="110ms">
            <span className="home-eyebrow home-eyebrow--ink animate-on-scroll">Sector focus</span>
            <h2 className="animate-on-scroll">One business, two operational realities, presented with the same discipline.</h2>
            <p className="animate-on-scroll">
              The website should reveal medical and industrial capabilities as distinct chapters, each with its own mood, but both connected by the same service posture.
            </p>
          </div>

          <div className="sector-sequence__list">
            {sectors.map((sector, index) => (
              <article
                className={`sector-shot sector-shot--${sector.key}${index % 2 ? ' sector-shot--reverse' : ''} animate-stagger`}
                data-stagger-step="120ms"
                key={sector.key}
              >
                <div className="sector-shot__copy animate-on-scroll">
                  <span className="home-eyebrow home-eyebrow--ink">{sector.eyebrow}</span>
                  <h2>{sector.title}</h2>
                  <p>{sector.body}</p>
                  <ul>
                    {sector.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>

                <div className="sector-shot__visual animate-on-scroll" data-parallax={sector.key === 'medical' ? 'soft' : 'lift'}>
                  <div className="sector-shot__frame">
                    <div className="sector-shot__frame-copy">
                      <span>{sector.eyebrow}</span>
                      <strong>{sector.visualTitle}</strong>
                      <p>{sector.visualBody}</p>
                    </div>
                    <div className="sector-shot__media">
                      <img src={`${baseUrl}${sector.image}`} alt={sector.eyebrow} loading="lazy" />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section trust-stage">
        <div className="home-shell">
          <div className="section-heading animate-stagger" data-stagger-step="110ms">
            <span className="home-eyebrow home-eyebrow--ink animate-on-scroll">Trusted brands and institutions</span>
            <h2 className="animate-on-scroll">Credibility should arrive before the catalog does.</h2>
            <p className="animate-on-scroll">
              LTE works with selected manufacturers and serves institutions whose standards require more than a broad product list and a quick quotation.
            </p>
          </div>

          <div className="trust-stage__copy animate-on-scroll">
            <p>
              Premium positioning comes from proof. The supplier mix and institutional customer base should communicate that proof slowly, clearly, and without clutter.
            </p>
          </div>

          <div className="logo-marquee animate-on-scroll">
            <div className="logo-marquee__track">
              {marqueeBrands.map((brand, index) => (
                <div className={`logo-chip logo-chip--brand logo-chip--${brand.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} key={`${brand.name}-${index}`}>
                  <img src={`${baseUrl}${brand.logo}`} alt={brand.name} loading="lazy" />
                </div>
              ))}
            </div>
          </div>

          <div className="logo-marquee logo-marquee--reverse animate-on-scroll">
            <div className="logo-marquee__track">
              {marqueeClients.map((client, index) => (
                <div className={`logo-chip logo-chip--client logo-chip--${client.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} key={`${client.name}-${index}`}>
                  <img src={`${baseUrl}${client.logo}`} alt={client.name} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="home-section catalog-stage">
        <div className="home-shell">
          <div className="section-heading section-heading--inline animate-stagger" data-stagger-step="110ms">
            <div className="animate-stagger" data-stagger-step="110ms">
              <span className="home-eyebrow home-eyebrow--ink animate-on-scroll">Featured categories</span>
              <h2 className="animate-on-scroll">The catalog should feel curated, not dropped onto the page all at once.</h2>
            </div>
            <Link className="home-inline-link animate-on-scroll" to="/products">Browse all categories</Link>
          </div>

          <div className="category-grid animate-stagger" data-stagger-step="100ms">
            {homepageCategories.map((category) => (
              <Link className="category-card animate-on-scroll" key={category.name} to="/products">
                <small>{category.label}</small>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <span>Explore category</span>
              </Link>
            ))}
          </div>

          <div className="featured-band animate-stagger" data-stagger-step="120ms">
            {leadProduct ? (
              <>
                <Link className="featured-band__lead animate-on-scroll" to={`/product/${leadProduct._id}`}>
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

                <div className="featured-band__rail animate-stagger" data-stagger-step="100ms">
                  {secondaryProducts.map((product) => (
                    <Link className="featured-mini animate-on-scroll" key={product._id} to={`/product/${product._id}`}>
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
              <div className="featured-band__empty animate-on-scroll">Featured products will appear here as they are marked in the catalog.</div>
            )}
          </div>
        </div>
      </section>

      <section className="home-section credibility-stage">
        <div className="home-shell credibility-stage__grid">
          <div className="credibility-stage__statement animate-stagger" data-stagger-step="110ms">
            <span className="home-eyebrow animate-on-scroll">Why LTE</span>
            <h2 className="animate-on-scroll">A supplier should think beyond the invoice when the buying environment is critical.</h2>
            <p className="animate-on-scroll">
              What keeps buyers loyal is not just product access. It is confidence in how the supplier thinks, responds, and follows through when details matter.
            </p>
          </div>

          <div className="credibility-stage__stats animate-stagger" data-stagger-step="120ms">
            {whyStats.map((item) => (
              <article className="credibility-stat animate-on-scroll" key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section final-cta">
        <div className="home-shell final-cta__panel">
          <div className="animate-stagger" data-stagger-step="110ms">
            <span className="home-eyebrow animate-on-scroll">Closing step</span>
            <h2 className="animate-on-scroll">When the business already operates with confidence, the website should close with the same clarity.</h2>
            <p className="animate-on-scroll">
              For quotations, category support, or account enquiries, the next move should feel direct and immediate, not buried after the story ends.
            </p>
          </div>

          <div className="final-cta__actions animate-stagger" data-stagger-step="120ms">
            <Link className="home-btn home-btn--primary animate-on-scroll" to="/contact">Request a Quote</Link>
            <Link className="home-btn home-btn--ghost-light animate-on-scroll" to="/about">Learn More About LTE</Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
