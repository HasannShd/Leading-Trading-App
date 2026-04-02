import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
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
    { name: 'KIMS Muharraq', logo: `${baseUrl}clients/Kims-Muharraq.png` },
    { name: 'Al Rayan', logo: `${baseUrl}clients/al rayan.jpg` },
    { name: 'Al Salam', logo: `${baseUrl}clients/al salam.jpg` },
    { name: 'Hilal Hospital', logo: `${baseUrl}clients/hilal.jpg` },
    { name: 'Ibn Al Nafees', logo: `${baseUrl}clients/ibn al nafees.png` },
    { name: 'American Mission', logo: `${baseUrl}clients/american mission.png` },
    { name: 'Aster', logo: `${baseUrl}clients/aster.jpg` },
    { name: 'Dar Al Hayat', logo: `${baseUrl}clients/dar al hayat.jpg` },
    { name: 'Resalah', logo: `${baseUrl}clients/resalah.jpg` },
    { name: 'Shifa Al Jazeera', logo: `${baseUrl}clients/shifa al jazeera.jpg` },
  ];

  const heroStats = [
    { value: '10+', label: 'Years supporting mission-critical buyers' },
    { value: '3,000+', label: 'Medical, dental & industrial SKUs' },
    { value: 'NHRA', label: 'Documentation-aware procurement approach' },
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
      label: 'Brief',
      title: 'Define the requirement clearly',
      description: 'We align on department, use case, certifications, quantities, and brand preferences before pricing or sourcing commitments are made.',
    },
    {
      label: 'Source',
      title: 'Verify availability and documentation',
      description: 'Our team validates lead times, origin, and supporting paperwork to keep procurement decisions grounded and defensible.',
    },
    {
      label: 'Deliver',
      title: 'Fulfill with follow-through',
      description: 'Orders are coordinated around urgency, continuity, and long-term account support rather than a simple handoff.',
    },
  ];

  const proofTiles = [
    { title: 'Trusted sourcing', body: 'Selected manufacturers across medical, dental, and industrial categories.' },
    { title: 'Local market familiarity', body: 'Built around the expectations of buyers operating in Bahrain.' },
    { title: 'Critical response mindset', body: 'Designed for environments where delays affect care or operations.' },
  ];

  const spotlightProducts = shuffledFeatured.slice(0, 6);

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
              <span>NHRA-aware sourcing</span>
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
          <h2>Structured enough for regulated environments. Flexible enough for urgent supply needs.</h2>
          <p>
            The process is straightforward on purpose: understand the requirement, verify the sourcing path, and deliver with accountability.
          </p>
          <Link className="premium-inline-link" to="/about">Learn more about our company</Link>
        </div>

        <div className="premium-workflow-rail">
          {workflowSteps.map((step) => (
            <article className="premium-workflow-step" key={step.label}>
              <span>{step.label}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="premium-section premium-featured">
        <div className="premium-section-heading premium-section-heading-inline">
          <div>
            <span className="premium-eyebrow">Product spotlight</span>
            <h2>Featured categories and products from the catalog.</h2>
          </div>
          <Link className="premium-inline-link" to="/shop">View full catalog</Link>
        </div>

        <div className="premium-product-grid">
          {spotlightProducts.length > 0 ? (
            spotlightProducts.map((product) => (
              <Link className="premium-product-card" key={product._id} to={`/product/${product._id}`}>
                <div className="premium-product-media">
                  {product.image ? (
                    <img
                      src={
                        product.image.startsWith('http')
                          ? product.image
                          : `${baseUrl}${product.image.replace(/^\//, '')}`
                      }
                      alt={product.name}
                      loading="lazy"
                    />
                  ) : (
                    <span>{product.name?.[0] || 'P'}</span>
                  )}
                </div>
                <div className="premium-product-copy">
                  <strong>{product.name}</strong>
                  <span>{product.brand || 'Featured product'}</span>
                </div>
              </Link>
            ))
          ) : (
            <div className="premium-product-empty">
              Featured products will appear here once catalog items are marked as featured.
            </div>
          )}
        </div>
      </section>

      <section className="premium-section premium-trust">
        <div className="premium-section-heading">
          <span className="premium-eyebrow">Selected relationships</span>
          <h2>Supported by established manufacturers and trusted by local institutions.</h2>
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
