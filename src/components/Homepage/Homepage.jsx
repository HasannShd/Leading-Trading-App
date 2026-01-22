import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import './Homepage.css';

// HomePage: Main landing page for the app
const HomePage = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

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
        <div className="home-category-band-viewport">
          <div className="home-category-band-inner">
            {[...featuredProducts, ...featuredProducts].map((product, index) => {
              const isDuplicate = index >= featuredProducts.length;
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
    </main>
  );
};

export default HomePage;
