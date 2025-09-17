import './About.css';

const About = () => (
  <main className="about-section">
    <div className="about-row">
      <div className="about-col about-col-text">
        <div className="about-block">
          <div className="about-block-title">
            <span className="about-block-accent">▮</span> YOUR TRUSTED PARTNER
          </div>
          <div className="about-block-desc">
            Since 2012, Leading Trading Est has established itself as a leading provider of medical and industrial supplies in Bahrain. We specialize in offering a wide range of high-quality medical equipment, consumables, and spare parts tailored for hospitals, clinics, and pharmacies. Our extensive product lineup includes dental, lab devices, respiratory equipment, surgical instruments, and wound care items. Additionally, we provide industrial safety products. By partnering with top international brands, we ensure that our customers receive reliable and superior quality products every time.
          </div>
        </div>
      </div>
      <div className="about-col about-col-img">
        <img src={import.meta.env.BASE_URL + 'about page.webp'} alt="LTE Office" className="about-img" />
      </div>
    </div>

    <div className="about-row about-row-message">
      <div className="about-block">
        <div className="about-block-title">
          <span className="about-block-accent">▮</span> MESSAGE FROM OUR CEO
        </div>
        <div className="about-block-desc">
          At Leading Trading Est, we are committed to delivering world-class medical, equipments, devices and industrial solutions that drive progress and excellence. Our focus always has been on quality, innovation, and reliability, ensuring our clients receive only the best.<br /><br />
          Our success is built on strong partnerships, customer trust, and an unwavering dedication to service. As we continue to grow, we remain committed to setting new industry standards and empowering businesses with the right solutions.<br /><br />
          I extend my heartfelt gratitude to our loyal customers and dedicated team for their unwavering support. Together, we will continue to drive progress, set new standards, and contribute to a healthier, safer future.<br /><br />
          <strong>Shahid Majeed<br />CEO, Leading Trading Est</strong>
        </div>
      </div>
    </div>
  </main>
);

export default About;
