import './Brands.css';

// Example brands data
const brands = [
  { name: 'Medstar', logo: '/public/medstar.jpg', url: '#' },
  { name: 'ROMSONS', logo: '/public/romsons.png', url: '#' },
//   { name: 'SPM', logo: '/public/brand-b.png', url: '#' },
  { name: 'SMI', logo: '/public/Smi.png', url: '#' },
  { name: 'Hermann Meditech', logo: '/public/Hermann.png', url: '#' },
  { name: 'Rogin', logo: '/public/rogin.png', url: '#' },
  { name: 'Zogear', logo: '/public/Zogear.png', url: '#' },
  { name: 'OptimaCast', logo: '/public/brand-c.png', url: '#' },
  { name: 'Osseous', logo: '/public/osseous.png', url: '#' },
];

const Brands = () => (
  <section className="brands-section">
    <h2 className="brands-title">Our Brands</h2>
    <div className="brands-marquee-outer">
      <div className="brands-marquee-inner">
        {[...brands, ...brands].map((brand, idx) => (
          <a className="brand-card" href={brand.url} key={brand.name + idx} target="_blank" rel="noopener noreferrer">
            <img src={brand.logo} alt={brand.name} className="brand-logo" />
            <div className="brand-name">{brand.name}</div>
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default Brands;
