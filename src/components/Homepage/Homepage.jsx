import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import Brands from '../Brands/Brands';
import Categories from '../Categories/Categories';
import '../Brands/Brands.css';



// HomePage: Main landing page for the app
const HomePage = () => {
  return (
    <main>

      {/* Modern Hero Section */}
      <section className="modern-hero">
        <div className="modern-hero-bg" />
        <div className="modern-hero-overlay" />
        <div className="modern-hero-content">
          <div className="modern-hero-topline">Empowering <span className="modern-hero-accent">Bahrain's</span> Healthcare with Trusted Supplies.</div>
          <h1 className="modern-hero-title">Your Source For Reliable<br /> Healthcare Supplies.</h1>
          <div className="modern-hero-btn-row">
            <Link className="modern-hero-btn primary" to="/products">View Our Categories</Link>
            <Link className="modern-hero-btn outline" to="/contact">Request a Quote</Link>
          </div>
          <div className="modern-hero-cert-row">
            <span className="modern-hero-cert"><span className="modern-hero-cert-icon">✅</span> ISO Certified</span>
            <span className="modern-hero-cert"><span className="modern-hero-cert-icon">✅</span> NHRA Approved</span>
            <span className="modern-hero-cert"><span className="modern-hero-cert-icon">✅</span> 10+ Years of Experience</span>
          </div>
        </div>
        {/* Ensure stats are always visible and not hidden by overoflow */}
        <div className="modern-hero-stats" style={{ position: 'relative', zIndex: 5 }}>
          <div className="modern-hero-stat">
            <div className="modern-hero-stat-num">200+</div>
            <div className="modern-hero-stat-label">HOSPITALS & CLINICS SERVED</div>
          </div>
          <div className="modern-hero-stat">
            <div className="modern-hero-stat-num">65000+</div>
            <div className="modern-hero-stat-label">PRODUCTS DELIVERED</div>
          </div>
          <div className="modern-hero-stat">
            <div className="modern-hero-stat-label">SERVING BAHRAIN FOR OVER A DECADE</div>
          </div>
        </div>
      </section>

      <section className="homepage-hero-img">
        <div className="homepage-hero-content homepage-hero-content-row">
          <div className="homepage-hero-text">
            <div className="homepage-hero-title-row">
              <span className="homepage-hero-accent">▮</span>
              <span className="homepage-hero-title">WELCOME TO LEADING TRADING EST</span>
            </div>
            <div className="homepage-hero-desc">
              At LTE, we are committed to achieving excellence. We continuously strive to meet and exceed customers expectations by providing high-quality medical and industrial solutions tailored to every need. Our dedication to innovation, reliability, and efficiency ensures that we deliver products and services that uphold the highest quality standards.<br /><br />
              <em>"Excellence is not just our goal, it’s our commitment."</em>
            </div>
            <Link className="homepage-hero-btn" to="/about">Learn more about us</Link>
          </div>
          <div className="homepage-hero-img-col">
            <img src={import.meta.env.BASE_URL + 'Brands/Stethescope.webp'} alt="Stethoscope" className="homepage-hero-img-main" loading="lazy" />
          </div>
        </div>
      </section>
      {/* Brands Section */}
      <Brands />
    </main>
  );
};

export default HomePage;
