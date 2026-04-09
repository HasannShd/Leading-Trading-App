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
    body: 'Supplier relationships are developed around continuity, access, and dependable repeat supply rather than short-term opportunistic buying.',
    detail: 'Established manufacturer and vendor network',
  },
  {
    title: 'Quality Assurance',
    body: 'Product suitability, documentation, and specification control are reviewed before quotation and fulfillment decisions are made.',
    detail: 'Specification and documentation discipline',
  },
  {
    title: 'Logistics',
    body: 'Orders move through a structured path with inventory awareness, delivery coordination, and clearer visibility on timing.',
    detail: 'Inventory and delivery coordination',
  },
  {
    title: 'Customer Commitment',
    body: 'Sales, accounts, and delivery remain aligned so customer support continues beyond quotation and procurement.',
    detail: 'Commercial follow-through and local support',
  },
];

const workflowSteps = [
  {
    title: 'Inquiry',
    body: 'Requirements are clarified at the outset so product selection, pricing, and delivery expectations are aligned from the beginning.',
  },
  {
    title: 'Sourcing',
    body: 'Suitable suppliers are shortlisted against quality, availability, compliance, and the operational demands of the end user.',
  },
  {
    title: 'Procurement',
    body: 'Commercial terms, documentation, and product details are consolidated into a clear procurement decision with fewer uncertainties.',
  },
  {
    title: 'Logistics',
    body: 'Lead times, inventory handling, and delivery coordination are planned before the order moves into execution.',
  },
  {
    title: 'Delivery & Support',
    body: 'Orders are completed with reliable handover, responsive support, and readiness for repeat demand when required.',
  },
];

const sectors = [
  {
    key: 'medical',
    eyebrow: 'Medical solutions',
    title: 'Supporting hospitals, clinics, and practices where continuity of care depends on supply reliability.',
    body: 'LTE supports regulated medical environments with disciplined sourcing, dependable availability, and close attention to product suitability, timing, and documentation.',
    points: ['Hospitals and specialist centers', 'Clinics and outpatient facilities', 'Routine and urgent replenishment'],
    image: 'Stethescope.webp',
    visualTitle: 'Medical procurement with operational discipline',
    visualBody: 'Clinical supply decisions require more than stock visibility. They depend on specification fit, supplier confidence, and dependable execution.',
  },
  {
    key: 'industrial',
    eyebrow: 'Industrial solutions',
    title: 'Supporting industrial and safety teams that need structured supply, not fragmented vendor follow-up.',
    body: 'The same disciplined workflow extends into industrial and safety sourcing, giving buyers a more dependable path from request to delivery.',
    points: ['Safety and utility products', 'Operational supply continuity', 'Consistent delivery planning'],
    image: 'about page.webp',
    visualTitle: 'Industrial continuity backed by reliable coordination',
    visualBody: 'Operational teams need dependable product flow, practical coordination, and local follow-through that supports day-to-day performance.',
  },
];

const whyStats = [
  { value: '10+', label: 'Years serving Bahrain-based buyers' },
  { value: 'Medical + Industrial', label: 'Two sectors supported through one structured operating model' },
  { value: 'Quality-led sourcing', label: 'Supplier assessment shaped around specification, documentation, and reliability' },
  { value: 'Long-term account support', label: 'Built for recurring business relationships, not only one-off transactions' },
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
            <h1 className="animate-on-scroll">Trusted medical and industrial supply for organizations that expect quality, continuity, and dependable support.</h1>
            <p className="animate-on-scroll">
              Leading Trading Est. supports hospitals, clinics, practices, and industrial buyers with disciplined sourcing, established supplier relationships, and reliable local execution.
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
              <strong>Supplier coordination, delivery planning, and account support aligned under one operating team.</strong>
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
            <h2 className="animate-on-scroll">LTE is built around supplier discipline, quality control, and dependable execution.</h2>
            <p className="animate-on-scroll">
              The business model combines supplier relationships, specification control, logistics coordination, and customer support so procurement decisions are backed by a stronger operating structure.
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
            <h2 className="animate-on-scroll">A clear workflow from inquiry through delivery is central to how LTE operates.</h2>
            <p className="animate-on-scroll">
              Every request moves through a structured sequence: need identification, supplier review, procurement alignment, logistics planning, and dependable delivery support.
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
            <h2 className="animate-on-scroll">One company serving two distinct sectors with the same operating discipline.</h2>
            <p className="animate-on-scroll">
              LTE supports medical and industrial buyers through the same standards of supplier assessment, quality review, logistics coordination, and customer follow-through.
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
            <h2 className="animate-on-scroll">Our supplier network and customer base reflect the standards we operate against.</h2>
            <p className="animate-on-scroll">
              LTE works with selected manufacturers and serves institutions that require reliability, product quality, and professional service standards.
            </p>
          </div>

          <div className="trust-stage__copy animate-on-scroll">
            <p>
              Our relationships with established brands and respected institutions demonstrate the level of trust placed in our sourcing, coordination, and delivery performance.
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
              <h2 className="animate-on-scroll">A focused view of the categories that define our supply capability.</h2>
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

          {featuredProducts.length > 0 ? (
            <div className="featured-band animate-stagger" data-stagger-step="120ms">
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
            </div>
          ) : (
            <div className="catalog-stage__note animate-on-scroll">
              Featured products will appear here once products are marked as featured in the catalog.
            </div>
          )}
        </div>
      </section>

      <section className="home-section credibility-stage">
        <div className="home-shell credibility-stage__grid">
          <div className="credibility-stage__statement animate-stagger" data-stagger-step="110ms">
            <span className="home-eyebrow animate-on-scroll">Why LTE</span>
            <h2 className="animate-on-scroll">Procurement support should combine product access, quality assurance, and dependable follow-through.</h2>
            <p className="animate-on-scroll">
              Long-term customer relationships are built through responsiveness, operational clarity, and a team structure that remains engaged from inquiry through delivery.
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
            <span className="home-eyebrow animate-on-scroll">Next step</span>
            <h2 className="animate-on-scroll">Speak with the team behind LTE’s sourcing, coordination, and delivery support.</h2>
            <p className="animate-on-scroll">
              For quotations, category guidance, or account enquiries, our team is available to support your requirement with a clear and practical next step.
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
