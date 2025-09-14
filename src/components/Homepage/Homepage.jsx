import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import Brands from '../Brands/Brands';
import Categories from '../Categories/Categories';
import '../Brands/Brands.css';



// HomePage: Main landing page for the app
const HomePage = () => {
  return (
    <main>
      {/* Full-width hero background with overlay and centered text */}
      <section className="homepage-full-hero" style={{ position: 'relative', overflow: 'hidden' }}>
        <img 
          src={import.meta.env.BASE_URL + 'home file.gif'} 
          alt="Animated visual" 
          className="homepage-full-hero-bg-gif" 
          loading="lazy"
        />
        <div className="homepage-full-hero-overlay" style={{ zIndex: 2 }} />
        <div className="homepage-full-hero-content" style={{ zIndex: 3, position: 'relative' }}>
          <h1 className="homepage-full-hero-title">Empowering Healthcare with Trusted Supplies.</h1>
          <p className="homepage-full-hero-desc">Your source for reliable healthcare supplies.</p>
          <Link className="homepage-hero-btn" to="/products">View Our Categories List</Link>
        </div>
      </section>
      {/* Hero Section with background image */}
      <section className="homepage-hero-img">
        <div className="homepage-hero-content homepage-hero-content-row">
          <div className="homepage-hero-text">
            <div className="homepage-hero-title-row">
              <span className="homepage-hero-accent">▮</span>
              <span className="homepage-hero-title">WELCOME TO LEADING TRADING EST</span>
            </div>
            <div className="homepage-hero-desc">
              At LTE, we are committed to achieving excellence in every aspect of our services. We continuously strive to meet and exceed customers expectations by providing high-quality medical and industrial solutions tailored to every need. Our dedication to innovation, reliability, and efficiency ensures that we deliver products and services that uphold the highest quality standards.<br /><br />
              <em>"Excellence is not just our goal, it’s our commitment."</em>
            </div>
            <Link className="homepage-hero-btn" to="/about">Learn more about us</Link>
          </div>
          <div className="homepage-hero-img-col">
            <img src={import.meta.env.BASE_URL + 'Stethescope.webp'} alt="Stethoscope" className="homepage-hero-img-main" loading="lazy" />
          </div>
        </div>
      </section>


      {/* Brands Section */}
      <Brands />
    </main>
  );
};

export default HomePage;
