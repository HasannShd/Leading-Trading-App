import './Brands.css';

// Main brands (primary partners)
const mainBrands = [
  { name: 'Medstar', logo: '/public/Brands/medstar.jpg', url: '#' },
  { name: 'ROMSONS', logo: '/public/Brands/romsons.png', url: '#' },
  { name: 'SMI', logo: '/public/Brands/Smi.png', url: '#' },
  { name: 'Hermann Meditech', logo: '/public/Brands/Hermann.png', url: '#' },
  { name: 'Rogin', logo: '/public/Brands/rogin.png', url: '#' },
  { name: 'Zogear', logo: '/public/Brands/Zogear.png', url: '#' },
  { name: 'Osseous', logo: '/public/Brands/osseous.png', url: '#' },
];

// Secondary brands (add/replace as needed)
const secondaryBrands = [
  { name: 'OptimaCast', logo: '/public/Brands/brand-c.png', url: '#' },
  { name: 'Secondary Brand 01', url: '#' },
  { name: 'Secondary Brand 02', url: '#' },
  { name: 'Secondary Brand 03', url: '#' },
  { name: 'Secondary Brand 04', url: '#' },
];

const Brands = () => (
  <section className="brands-section">
    <div className="brands-header">
      <h2 className="brands-title">Our Brands</h2>
      <p className="brands-subtitle">Main partners and our trusted secondary brands.</p>
    </div>

    <div className="brands-grid">
      {mainBrands.map(brand => (
        <a className="brand-card" href={brand.url} key={brand.name} target="_blank" rel="noopener noreferrer">
          {brand.logo ? (
            <img src={brand.logo} alt={brand.name} className="brand-logo" />
          ) : (
            <div className="brand-fallback">{brand.name.slice(0, 2).toUpperCase()}</div>
          )}
          <div className="brand-name">{brand.name}</div>
        </a>
      ))}
    </div>

    <div className="brands-secondary">
      <div className="brands-secondary-title">Secondary Brands</div>
      <div className="brands-secondary-grid">
        {secondaryBrands.map(brand => (
          <a className="brand-card secondary" href={brand.url} key={brand.name} target="_blank" rel="noopener noreferrer">
            {brand.logo ? (
              <img src={brand.logo} alt={brand.name} className="brand-logo" />
            ) : (
              <div className="brand-fallback">{brand.name.slice(0, 2).toUpperCase()}</div>
            )}
            <div className="brand-name">{brand.name}</div>
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default Brands;
