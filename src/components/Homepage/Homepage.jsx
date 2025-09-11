import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import Brands from '../Brands/Brands';
import Categories from '../Categories/Categories';
import '../Brands/Brands.css';



// HomePage: Main landing page for the app
const HomePage = () => {
  return (
    <main>
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
            <img src={import.meta.env.BASE_URL + 'stethoscope.jpg'} alt="Stethoscope" className="homepage-hero-img-main" />
          </div>
        </div>
      </section>


      {/* Brands Section */}
      <Brands />
    </main>
  );
};

export default HomePage;
