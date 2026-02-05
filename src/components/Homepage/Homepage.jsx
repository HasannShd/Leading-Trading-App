import { Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from "react";
import './Homepage.css';

// HomePage: Main landing page for the app
const HomePage = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
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
      setShuffleTick(tick => tick + 1);
    }, 8000);
    return () => clearInterval(id);
  }, []);

  const shuffledFeatured = useMemo(() => {
    const next = [...featuredProducts];
    for (let i = next.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
    return next;
  }, [featuredProducts, shuffleTick]);
  const mainBrands = [
    { name: 'Medstar', logo: `${import.meta.env.BASE_URL}Brands/medstar.jpg` },
    { name: 'Rogin', logo: `${import.meta.env.BASE_URL}Brands/rogin.png` },
    { name: 'SMI', logo: `${import.meta.env.BASE_URL}Brands/Smi.png` },
    { name: 'ROMSONS', logo: `${import.meta.env.BASE_URL}Brands/romsons.png` },
    { name: 'Hermann Meditech', logo: `${import.meta.env.BASE_URL}Brands/Hermann.png` },
    { name: 'Zogear', logo: `${import.meta.env.BASE_URL}Brands/Zogear.png` },
    { name: 'ADC', logo: `${import.meta.env.BASE_URL}Brands/adc.png` },
    { name: 'Osseous', logo: `${import.meta.env.BASE_URL}Brands/osseous.png` },
    { name: 'Berger', logo: `${import.meta.env.BASE_URL}Brands/berger.jpg` },
    { name: 'Bastos-Viegas', logo: `${import.meta.env.BASE_URL}Brands/bastosviegas.webp` },
    { name: 'Optimacast', logo: `${import.meta.env.BASE_URL}Brands/optimacast.png` },
    
  ];
  const clients = [
    { name: 'KIMS Muharraq', logo: `${import.meta.env.BASE_URL}clients/Kims-Muharraq.png` },
    { name: 'Al Rayan', logo: `${import.meta.env.BASE_URL}clients/al rayan.jpg` },
    { name: 'Al Salam', logo: `${import.meta.env.BASE_URL}clients/al salam.jpg` },
    { name: 'Hilal Hospital', logo: `${import.meta.env.BASE_URL}clients/hilal.jpg` },
    { name: 'Ibn Al Nafees', logo: `${import.meta.env.BASE_URL}clients/ibn al nafees.png` },
    { name: 'American Mission', logo: `${import.meta.env.BASE_URL}clients/american mission.png` },
    { name: 'Aster', logo: `${import.meta.env.BASE_URL}clients/aster.jpg` },
    { name: 'Dar Al Hayat', logo: `${import.meta.env.BASE_URL}clients/dar al hayat.jpg` },
    { name: 'Resalah', logo: `${import.meta.env.BASE_URL}clients/resalah.jpg` },
    { name: 'Shifa Al Jazeera', logo: `${import.meta.env.BASE_URL}clients/shifa al jazeera.jpg` },
  ];
  const heroStats = [
    { value: '10+', label: 'Years of trusted supply' },
    { value: '3,000+', label: 'Medical & industrial SKUs' },
    { value: '24h', label: 'Rapid quotation turnaround' },
    { value: '99%', label: 'On-time fulfillment rate' },
  ];
  const valueProps = [
    {
      title: 'Regulatory-ready sourcing',
      description: 'NHRA aligned procurement with full documentation and product traceability.'
    },
    {
      title: 'Specialist product advisors',
      description: 'Dedicated team to match hospitals and industry with the right equipment.'
    },
    {
      title: 'End-to-end logistics',
      description: 'Warehousing, inventory planning, and delivery built for critical timelines.'
    },
  ];
  const processSteps = [
    {
      step: 'Step 01',
      title: 'Discover & scope',
      description: 'Align on requirements, compliance, and preferred brands.'
    },
    {
      step: 'Step 02',
      title: 'Source & verify',
      description: 'Confirm availability, certifications, and lead times before quoting.'
    },
    {
      step: 'Step 03',
      title: 'Deliver & support',
      description: 'Coordinate fulfillment and after-sales assistance for long-term success.'
    },
  ];

  return (
    <main>
      {/* Modern Hero Section */}
      <section className="modern-hero">
        <div className="modern-hero-bg" />
        <div className="modern-hero-swoosh" />
        <div className="modern-hero-inner">
          <div className="modern-hero-content">
            <div className="modern-hero-topline">Leading Trading Est</div>
            <h1 className="modern-hero-title">World‑class medical & industrial supplies to meet all your needs.</h1>
            <p className="modern-hero-subtitle">
              We are recognized as a trusted supplier of medical, dental, & industrial products across the Kingdom Of Bahrain.
            </p>
          <div className="modern-hero-btn-row">
            <Link className="modern-hero-btn primary" to="/products">Explore Categories</Link>
            <Link className="modern-hero-btn outline" to="/contact">Request a Quote</Link>
          </div>
          <Link className="modern-hero-link" to="/about">
            Learn more about us <span aria-hidden="true">→</span>
          </Link>
          <div className="modern-hero-cert-row">
            <span className="modern-hero-cert"><span className="modern-hero-cert-icon">✓</span> ISO Certified</span>
            <span className="modern-hero-cert"><span className="modern-hero-cert-icon">✓</span> NHRA Approved</span>
            <span className="modern-hero-cert"><span className="modern-hero-cert-icon">✓</span> 10+ Years of Experience</span>
          </div>
          </div>
          <div className="modern-hero-media">
            {/* <img
              src={`${import.meta.env.BASE_URL}Brands/Stethescope.webp`}
              alt="Medical supplies"
              loading="lazy"
            /> */}
          </div>
        </div>
        <div className="modern-hero-stats">
          {heroStats.map(stat => (
            <div className="modern-hero-stat" key={stat.label}>
              <div className="modern-hero-stat-num">{stat.value}</div>
              <div className="modern-hero-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-inner">
          <div className="home-section-head">
            <span className="home-section-eyebrow">Why Leading Trading</span>
            <h2>Enterprise-grade supply for healthcare and industry.</h2>
            <p>
              We combine deep product access with regulatory discipline to keep your teams fully equipped and compliant.
            </p>
          </div>
          <div className="home-feature-grid">
            {valueProps.map((item, index) => (
              <div className="home-feature-card" key={item.title}>
                <div className="home-feature-icon">0{index + 1}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-process">
        <div className="home-section-inner home-process-grid">
          <div className="home-process-copy">
            <span className="home-section-eyebrow">How we work</span>
            <h3>Structured procurement, built for mission-critical environments.</h3>
            <p>
              From consultation to delivery, our process is designed to reduce risk and accelerate fulfillment.
            </p>
          </div>
          <div className="home-process-steps">
            {processSteps.map(item => (
              <div className="home-process-step" key={item.step}>
                <span>{item.step}</span>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-category-band">
        <div className="home-category-band-viewport">
          <div className="home-category-band-inner">
            {[...shuffledFeatured, ...shuffledFeatured].map((product, index) => {
              const isDuplicate = index >= shuffledFeatured.length;
              return (
                <Link
                  key={`${product._id}-${index}`}
                  to={`/product/${product._id}`}
                  className="home-category-card"
                  aria-hidden={isDuplicate}
                  tabIndex={isDuplicate ? -1 : 0}
                >
                  <div className="home-category-icon">
                    {product.image ? (
                      <img
                        src={
                          product.image.startsWith('http')
                            ? product.image
                            : `${import.meta.env.BASE_URL}${product.image.replace(/^\//, '')}`
                        }
                        alt={product.name}
                        loading="lazy"
                      />
                    ) : (
                      <span>{product.name?.[0] || 'P'}</span>
                    )}
                  </div>
                  <div className="home-category-title">{product.name}</div>
                  <div className="home-category-desc">{product.brand || 'Featured product'}</div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="home-trusted">
        <div className="home-trusted-inner">
          <h2>Trusted by our customers</h2>
          <p>Proud to present the best to you.</p>
          <div className="home-trusted-logos">
            {mainBrands.map(brand => (
              brand.logo ? (
                <img src={brand.logo} alt={brand.name} key={brand.name} />
              ) : (
                <div className="home-trusted-fallback" key={brand.name}>
                  {brand.name.slice(0, 2).toUpperCase()}
                </div>
              )
            ))}
          </div>
          <div className="home-trusted-subtitle">Our Patrons</div>
          <div className="home-trusted-logos">
            {clients.map(client => (
              client.logo ? (
                <img src={client.logo} alt={client.name} key={client.name} />
              ) : (
                <div className="home-trusted-fallback" key={client.name}>
                  {client.name.slice(0, 2).toUpperCase()}
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      <section className="home-cta">
        <div className="home-cta-inner">
          <div>
            <h2>Ready to build a resilient supply plan?</h2>
            <p>Let us help you source and scale with confidence.</p>
          </div>
          <div className="home-cta-actions">
            <Link className="primary" to="/contact">Request a Quote</Link>
            <Link className="outline" to="/products">Browse Catalog</Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
