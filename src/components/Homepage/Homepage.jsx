import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { normalizeImageSrc } from '../../utils/normalizeImageSrc';
import './Homepage.css';

const HomePage = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const baseUrl = import.meta.env.BASE_URL;

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [shuffleTick, setShuffleTick] = useState(0);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch(`${API_URL}/products?featured=true&limit=6`);
        const data = await response.json();
        const items = Array.isArray(data) ? data : (data.items || []);
        setFeaturedProducts(items);
      } catch (err) {
        console.error('Failed to load featured products', err);
      }
    };

    fetchFeatured();
  }, [API_URL]);

  useEffect(() => {
    const id = setInterval(() => {
      setShuffleTick((tick) => tick + 1);
    }, 8000);

    return () => clearInterval(id);
  }, []);

  const shuffledFeatured = useMemo(() => {
    const next = [...featuredProducts];
    if (next.length < 2) return next;

    const offset = shuffleTick % next.length;
    return [...next.slice(offset), ...next.slice(0, offset)];
  }, [featuredProducts, shuffleTick]);

  const mainBrands = [
    { name: 'Medstar', logo: `${baseUrl}Brands/medstar.jpg` },
    { name: 'Rogin', logo: `${baseUrl}Brands/rogin.png` },
    { name: 'SMI', logo: `${baseUrl}Brands/Smi.png` },
    { name: 'ROMSONS', logo: `${baseUrl}Brands/romsons.png` },
    { name: 'Hermann Meditech', logo: `${baseUrl}Brands/Hermann.png` },
    { name: 'Zogear', logo: `${baseUrl}Brands/Zogear.png` },
    { name: 'ADC', logo: `${baseUrl}Brands/adc.png` },
    { name: 'Osseous', logo: `${baseUrl}Brands/osseous.png` },
    { name: 'Berger', logo: `${baseUrl}Brands/berger.jpg` },
    { name: 'Bastos-Viegas', logo: `${baseUrl}Brands/bastosviegas.webp` },
    { name: 'Optimacast', logo: `${baseUrl}Brands/optimacast.png` },
  ];

  const clients = [
    { name: 'Ministry of Health', logo: `${baseUrl}clients/ministry.jpg` },
    { name: 'King Hamad University Hospital', logo: `${baseUrl}clients/khuh.png` },
    { name: 'Bapco', logo: `${baseUrl}clients/bapco.jpg` },
    { name: 'Bahrain Defence Force', logo: `${baseUrl}clients/bdf.png` },
    { name: 'Royal Specialized Center', logo: `${baseUrl}clients/rsci.png` },
    { name: 'KIMS Muharraq', logo: `${baseUrl}clients/Kims-Muharraq.png` },
    { name: 'American Mission', logo: `${baseUrl}clients/american mission.png` },
    { name: 'Aster', logo: `${baseUrl}clients/aster.jpg` },
    { name: 'Ibn Al Nafees', logo: `${baseUrl}clients/ibn al nafees.png` },
    { name: 'Al Rayan', logo: `${baseUrl}clients/al rayan.jpg` },
    { name: 'Al Salam', logo: `${baseUrl}clients/al salam.jpg` },
    { name: 'Hilal Hospital', logo: `${baseUrl}clients/hilal.jpg` },
    { name: 'Dar Al Hayat', logo: `${baseUrl}clients/dar al hayat.jpg` },
    { name: 'Resalah', logo: `${baseUrl}clients/resalah.jpg` },
    { name: 'Shifa Al Jazeera', logo: `${baseUrl}clients/shifa al jazeera.jpg` },
  ];

  const heroStats = [
    { value: '10+', label: 'Years supporting mission-critical buyers' },
    { value: '3,000+', label: 'Medical, dental & industrial SKUs' },
    { value: 'NHRA Licensed & Certified'},
    { value: '24h', label: 'Fast quotation response for priority requests' },
  ];

  const sectorCards = [
    {
      tag: 'Healthcare',
      title: 'Hospital and clinic procurement with traceability built in.',
      description: 'Equipment, disposables, and recurring supply programs aligned to regulated care environments.',
    },
    {
      tag: 'Dental',
      title: 'Dental sourcing that balances premium brands with day-to-day reliability.',
      description: 'Tools, consumables, and specialist products selected for professional practice continuity.',
    },
    {
      tag: 'Industrial',
      title: 'Industrial supply support with the discipline of a critical operation.',
      description: 'Consistent sourcing, verified availability, and delivery coordination for operational teams.',
    },
  ];

  const capabilityCards = [
    {
      index: '01',
      title: 'Procurement with clinical precision',
      description: 'We do more than supply products. We help teams source the right specification, paperwork, and timing so procurement decisions stand up operationally.',
    },
    {
      index: '02',
      title: 'Brand access without catalog chaos',
      description: 'Your teams get access to known manufacturers and dependable alternatives without spending cycles on fragmented vendor coordination.',
    },
    {
      index: '03',
      title: 'A partner for repeat orders, not one-off transactions',
      description: 'From urgent requests to scheduled replenishment, our process is designed to reduce friction across the full supply relationship.',
    },
  ];

  const workflowSteps = [
    {
      phase: '01',
      label: 'Market demand',
      title: 'Demand is identified before sourcing starts',
      description: 'We track what the market, our sectors, and our customers actively need so procurement starts from real demand instead of guesswork.',
      note: 'Signals from hospitals, clinics, practices, and operational buyers',
    },
    {
      phase: '02',
      label: 'Supplier search',
      title: 'Suitable suppliers are shortlisted',
      description: 'Once a product need is clear, we search for manufacturers and suppliers that can meet the expected quality, reliability, and documentation level.',
      note: 'Supplier network review, origin review, product fit',
    },
    {
      phase: '03',
      label: 'Assessment',
      title: 'Quality, pricing, and suitability are validated',
      description: 'Product quality, commercial value, and supply practicality are assessed together before a sourcing decision is confirmed.',
      note: 'Quality, price, documentation, continuity',
    },
    {
      phase: '04',
      label: 'Order confirmation',
      title: 'Orders are placed with a defined arrival window',
      description: 'Once approved, orders are confirmed with supplier timing and expected delivery duration so downstream planning is clear.',
      note: 'Lead time and arrival commitment established',
    },
    {
      phase: '05',
      label: 'Logistics and stock',
      title: 'Logistics, inventory, and storage are prepared',
      description: 'Incoming goods are coordinated against stock count, handling readiness, storage conditions, and internal inventory control.',
      note: 'Stock checks, storage readiness, inventory discipline',
    },
    {
      phase: '06',
      label: 'Fulfillment',
      title: 'Orders move into delivery execution',
      description: 'Once stock is ready, products are allocated and handed to delivery operations for final fulfillment to the customer.',
      note: 'Prepared inventory flows into delivery teams',
    },
  ];

  const proofTiles = [
    { title: 'Trusted sourcing', body: 'Selected manufacturers across medical, dental, and industrial categories.' },
    { title: 'Local market familiarity', body: 'Built around the expectations of buyers operating in Bahrain.' },
    { title: 'Critical response mindset', body: 'Designed for environments where delays affect care or operations.' },
  ];

  const spotlightProducts = shuffledFeatured.slice(0, 6);
  const leadProduct = spotlightProducts[0] || null;
  const secondaryProducts = spotlightProducts.slice(1, 5);
  const overflowCount = Math.max(0, featuredProducts.length - 5);

  return (
    <main className="premium-home">
      <section className="premium-hero">
        <div className="premium-hero-noise" />
        <div className="premium-hero-grid">
          <div className="premium-hero-copy">
            <span className="premium-eyebrow">Leading Trading Est | Bahrain</span>
            <h1>Critical supply, delivered with the confidence your teams expect.</h1>
            <p className="premium-hero-lead">
              Premium medical, dental, and industrial sourcing for organizations that cannot afford procurement friction, unclear documentation, or missed timelines.
            </p>
            <div className="premium-hero-actions">
              <Link className="premium-btn premium-btn-primary" to="/contact">Request a Quote</Link>
              <Link className="premium-btn premium-btn-secondary" to="/products">Explore Categories</Link>
            </div>
            <div className="premium-hero-notes">
              <span>NHRA-Approved</span>
              <span>Trusted manufacturer network</span>
              <span>Responsive account support</span>
            </div>
          </div>

          <div className="premium-hero-stage">
            <div className="premium-stage-panel premium-stage-main">
              <div className="premium-stage-chip">Mission-ready supply partner</div>
              <img src={`${baseUrl}lp.jpg`} alt="Clinical and professional supply environment" loading="eager" />
              <div className="premium-stage-overlay">
                <div>
                  <span>Operational focus</span>
                  <strong>Medical, dental & industrial</strong>
                </div>
                <p>Structured sourcing for facilities, clinics, hospitals, and demanding operational teams.</p>
              </div>
            </div>

            <div className="premium-stage-stack">
              <div className="premium-stage-panel premium-stage-detail">
                <img src={`${baseUrl}Stethescope.webp`} alt="Medical supply detail" loading="lazy" />
                <div className="premium-stage-caption">
                  <span>Precision where it matters</span>
                  <strong>High-trust product selection</strong>
                </div>
              </div>

              <div className="premium-stage-panel premium-stage-metric">
                <span className="premium-stage-label">Supply posture</span>
                <strong>Reliable under pressure</strong>
                <p>Clear sourcing, clear communication, and support that matches the seriousness of your field.</p>
                <ul>
                  <li>Fast quotation cycles</li>
                  <li>Documentation-conscious workflow</li>
                  <li>Repeat-order friendly accounts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="premium-hero-stats">
          {heroStats.map((stat) => (
            <div className="premium-stat-card" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="premium-sector-strip">
        {sectorCards.map((sector) => (
          <article className="premium-sector-card" key={sector.tag}>
            <span>{sector.tag}</span>
            <h2>{sector.title}</h2>
            <p>{sector.description}</p>
          </article>
        ))}
      </section>

      <section className="premium-section premium-story">
        <div className="premium-section-heading">
          <span className="premium-eyebrow">Why buyers stay with us</span>
          <h2>Built for organizations that need a supplier to think beyond the invoice.</h2>
          <p>
            Your business is not buying generic stock. You are protecting continuity, compliance, and service quality. The website should reflect that standard.
          </p>
        </div>

        <div className="premium-proof-grid">
          {proofTiles.map((tile) => (
            <article className="premium-proof-tile" key={tile.title}>
              <h3>{tile.title}</h3>
              <p>{tile.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="premium-section premium-capabilities">
        <div className="premium-section-heading">
          <span className="premium-eyebrow">Service posture</span>
          <h2>A more premium presentation, anchored in real procurement value.</h2>
        </div>

        <div className="premium-capability-grid">
          {capabilityCards.map((card) => (
            <article className="premium-capability-card" key={card.title}>
              <span>{card.index}</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="premium-section premium-workflow">
        <div className="premium-workflow-copy">
          <span className="premium-eyebrow">How we operate</span>
          <h2>From market demand to final delivery, the workflow stays visible all the way through.</h2>
          <p>
            The process is designed to reduce blind spots. Demand is identified first, suppliers are evaluated properly, logistics are coordinated early, and stock is controlled before delivery moves.
          </p>
        </div>

        <div className="premium-workflow-diagram">
          <div className="premium-workflow-spine">
            <span className="premium-workflow-spine-label">Operations flow</span>
            <strong>Demand → Source → Assess → Confirm → Stock → Deliver</strong>
            <p>
              Every stage is connected so sourcing decisions, arrival timing, inventory handling, and delivery execution stay aligned.
            </p>
            <div className="premium-workflow-track">
              {workflowSteps.map((step) => (
                <div className="premium-workflow-track-node" key={`track-${step.phase}`}>
                  <span>{step.phase}</span>
                  <small>{step.label}</small>
                </div>
              ))}
            </div>
          </div>

          <div className="premium-workflow-rail">
            {workflowSteps.map((step) => (
              <article className="premium-workflow-step" key={step.label}>
                <div className="premium-workflow-step-top">
                  <span>{step.label}</span>
                  <strong>{step.phase}</strong>
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <small>{step.note}</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-section premium-featured">
        <div className="premium-section-heading premium-section-heading-inline">
          <div>
            <span className="premium-eyebrow">Product spotlight</span>
            <h2>A curated look at selected products, not the whole catalog at once.</h2>
          </div>
          <Link className="premium-inline-link" to="/shop">View full catalog</Link>
        </div>

        <div className="premium-featured-showcase">
          {leadProduct ? (
            <>
              <Link className="premium-featured-lead" key={leadProduct._id} to={`/product/${leadProduct._id}`}>
                <div className="premium-featured-lead-media">
                  {leadProduct.image ? (
                    <img
                      src={normalizeImageSrc(leadProduct.image)}
                      alt={leadProduct.name}
                      loading="lazy"
                    />
                  ) : (
                    <span>{leadProduct.name?.[0] || 'P'}</span>
                  )}
                </div>

                <div className="premium-featured-lead-copy">
                  <div className="premium-featured-lead-top">
                    <span>{leadProduct.brand || leadProduct.categorySlug?.name || 'Featured selection'}</span>
                    <strong>Lead feature</strong>
                  </div>
                  <h3>{leadProduct.name}</h3>
                  <p>
                    {leadProduct.description?.trim() ||
                      'A highlighted catalog product selected to represent the range, quality, and direction of the current featured lineup.'}
                  </p>
                  <div className="premium-featured-lead-meta">
                    <small>{leadProduct.categorySlug?.name || 'Catalog product'}</small>
                    <em>Open product</em>
                  </div>
                </div>
              </Link>

              <div className="premium-featured-rail">
                <div className="premium-featured-rail-intro">
                  <span>Current shortlist</span>
                  <p>Rotate the featured lineup while keeping the homepage focused and premium.</p>
                </div>

                <div className="premium-featured-stack">
                  {secondaryProducts.map((product) => (
                    <Link className="premium-featured-mini" key={product._id} to={`/product/${product._id}`}>
                      <div className="premium-featured-mini-media">
                        {product.image ? (
                          <img
                            src={normalizeImageSrc(product.image)}
                            alt={product.name}
                            loading="lazy"
                          />
                        ) : (
                          <span>{product.name?.[0] || 'P'}</span>
                        )}
                      </div>

                      <div className="premium-featured-mini-copy">
                        <span>{product.brand || 'Featured product'}</span>
                        <strong>{product.name}</strong>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="premium-featured-rail-footer">
                  <div>
                    <span>Catalog flow</span>
                    <strong>
                      {overflowCount > 0
                        ? `+${overflowCount} more featured products available in the full catalog`
                        : 'Explore the full catalog for the wider product range'}
                    </strong>
                  </div>
                  <Link className="premium-btn premium-btn-dark" to="/shop">Browse Products</Link>
                </div>
              </div>
            </>
          ) : (
            <div className="premium-product-empty">
              Featured products will appear here once catalog items are marked as featured.
            </div>
          )}
        </div>
      </section>

      <section className="premium-section premium-trust">
        <div className="premium-trust-top">
          <div className="premium-section-heading">
            <span className="premium-eyebrow">Selected relationships</span>
            <h2>Supported by established manufacturers and trusted by local institutions.</h2>
          </div>

          <aside className="premium-about-callout">
            <small>Company profile</small>
            <h3>See the people and departments behind the supply operation.</h3>
            <p>Learn more about the company, leadership, sales, accounts, HR, and delivery structure behind LTE.</p>
            <Link className="premium-inline-link" to="/about">Learn more about our company</Link>
          </aside>
        </div>

        <div className="premium-logo-block">
          <div className="premium-logo-title">Manufacturers</div>
          <div className="premium-logo-grid premium-logo-grid--brands">
            {mainBrands.map((brand) => (
              brand.logo ? (
                <div
                  className={`premium-logo-card premium-logo-card--brand premium-logo-card--${brand.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                  key={brand.name}
                >
                  <div className="premium-logo-media">
                    <img src={brand.logo} alt={brand.name} loading="lazy" />
                  </div>
                </div>
              ) : (
                <div className="premium-logo-card premium-logo-card--brand premium-logo-fallback" key={brand.name}>
                  {brand.name.slice(0, 2).toUpperCase()}
                </div>
              )
            ))}
          </div>
        </div>

        <div className="premium-logo-block">
          <div className="premium-logo-title">Institutions supplied</div>
          <div className="premium-logo-grid premium-logo-grid--clients">
            {clients.map((client) => (
              client.logo ? (
                <div
                  className={`premium-logo-card premium-logo-card--client premium-logo-card--${client.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                  key={client.name}
                >
                  <div className="premium-logo-media">
                    <img src={client.logo} alt={client.name} loading="lazy" />
                  </div>
                </div>
              ) : (
                <div className="premium-logo-card premium-logo-card--client premium-logo-fallback" key={client.name}>
                  {client.name.slice(0, 2).toUpperCase()}
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      <section className="premium-section premium-cta">
        <div className="premium-cta-card">
          <div>
            <span className="premium-eyebrow">Start a conversation</span>
            <h2>Give the brand the same level of confidence your customers expect from your service.</h2>
            <p>For quotations, category inquiries, or account support, the next step is direct and simple.</p>
          </div>

          <div className="premium-cta-actions">
            <Link className="premium-btn premium-btn-primary" to="/contact">Request a Quote</Link>
            <Link className="premium-btn premium-btn-secondary" to="/shop">Browse Products</Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
