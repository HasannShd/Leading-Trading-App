import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import './Homepage.css';

// HomePage: Main landing page for the app
const HomePage = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories`);
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, [API_URL]);

  const featuredCategories = categories.slice(0, 4);
  const mainBrands = [
    { name: 'Medstar', logo: `${import.meta.env.BASE_URL}Brands/medstar.jpg` },
    { name: 'ROMSONS', logo: `${import.meta.env.BASE_URL}Brands/romsons.png` },
    { name: 'SMI', logo: `${import.meta.env.BASE_URL}Brands/Smi.png` },
    { name: 'Hermann Meditech', logo: `${import.meta.env.BASE_URL}Brands/Hermann.png` },
    { name: 'Rogin', logo: `${import.meta.env.BASE_URL}Brands/rogin.png` },
    { name: 'Zogear', logo: `${import.meta.env.BASE_URL}Brands/Zogear.png` },
    { name: 'Osseous', logo: `${import.meta.env.BASE_URL}Brands/osseous.png` },
    { name: 'ADC', logo: `${import.meta.env.BASE_URL}Brands/adc.png` },
    { name: 'Berger', logo: `${import.meta.env.BASE_URL}Brands/berger.jpg` },
    { name: 'OptimaCast', logo: `${import.meta.env.BASE_URL}Brands/brand-c.png` },
  ];
  const secondaryBrands = [
    { name: 'Secondary Brand 01' },
    { name: 'Secondary Brand 02' },
    { name: 'Secondary Brand 03' },
    { name: 'Secondary Brand 04' },
  ];
  const clients = [
    { name: 'KIMS Muharraq', logo: `${import.meta.env.BASE_URL}clients/Kims-Muharraq.png` },
    { name: 'Hilal Hospital', logo: `${import.meta.env.BASE_URL}clients/hilal.jpg` },
    { name: 'Ibn Al Nafees', logo: `${import.meta.env.BASE_URL}clients/ibn al nafees.png` },
    { name: 'American Mission', logo: `${import.meta.env.BASE_URL}clients/american mission.png` },
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
      </section>

      <section className="home-category-band">
        <div className="home-category-band-inner">
          {featuredCategories.map(category => (
            <Link
              key={category._id}
              to={`/categories/${category.slug || category._id}`}
              className="home-category-card"
            >
              <div className="home-category-icon">
                {category.image ? (
                  <img
                    src={
                      category.image.startsWith('http')
                        ? category.image
                        : `${import.meta.env.BASE_URL}${category.image.replace(/^\//, '')}`
                    }
                    alt={category.name}
                    loading="lazy"
                  />
                ) : (
                  <span>{category.name?.[0] || 'C'}</span>
                )}
              </div>
              <div className="home-category-title">{category.name}</div>
              <div className="home-category-desc">{category.description || 'Explore our range of supplies.'}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-trusted">
        <div className="home-trusted-inner">
          <h2>Trusted by our customers</h2>
          <p>Proud to present the best to you.</p>
          <div className="home-trusted-logos">
            {[...mainBrands, ...secondaryBrands].map(brand => (
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
    </main>
  );
};

export default HomePage;
