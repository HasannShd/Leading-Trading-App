import { Link } from 'react-router-dom';
import Seo from '../Common/Seo';
import { brandPages } from '../../utils/brandPages';
import {
  buildBreadcrumbSchema,
  buildCollectionSchema,
  localBusinessSchema,
  organizationSchema,
} from '../../utils/seoSchemas';
import './BrandsPage.css';

const BrandsPage = () => {
  const medstar = brandPages.find((brand) => brand.slug === 'medstar');
  const partners = brandPages.filter((brand) => brand.slug !== 'medstar');

  return (
    <main className="brands-page">
      <Seo
        title="Medical, Dental & Surgical Brands Bahrain | Leading Trading Est"
        description="Explore Medstar, ROMSONS, SMI and specialist medical, dental, ENT, orthopaedic and diagnostic brand lines supported by Leading Trading Est in Bahrain."
        canonicalPath="/brands"
        keywords="medical brands Bahrain, Medstar Bahrain, ROMSONS Bahrain, SMI Bahrain, dental brands Bahrain, orthopedic brands Bahrain, ENT instruments Bahrain"
        structuredData={[
          organizationSchema,
          localBusinessSchema,
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Brands', path: '/brands' },
          ]),
          buildCollectionSchema({
            name: 'Brands supported by Leading Trading Est',
            description: 'Medical, dental, surgical, diagnostic, ENT and orthopaedic brand lines supported in Bahrain.',
            path: '/brands',
            items: brandPages.map((brand) => ({ name: brand.name, path: `/brands/${brand.slug}` })),
          }),
        ]}
      />

      <section className="brands-hero">
        <div className="brands-shell brands-hero__grid">
          <div>
            <span className="brands-eyebrow">LTE Brand Portfolio</span>
            <h1>Specialist medical brands, supported locally in Bahrain.</h1>
            <p>
              Explore LTE's own Medstar range, sole-agent support for ROMSONS and SMI,
              and selected supply lines across diagnostics, surgery, dental, ENT and orthopaedics.
            </p>
          </div>
          <aside className="brands-hero__summary" aria-label="Brand portfolio summary">
            <strong>{brandPages.length}</strong>
            <span>focused brand profiles</span>
            <p>Clear specialties, relevant catalogue paths and direct quotation support.</p>
          </aside>
        </div>
      </section>

      <section className="brands-shell brands-featured">
        <div className="brands-featured__logo">
          <img src={medstar.logo} alt="Medstar medical supplies" width="420" height="240" />
          <span>{medstar.relationship}</span>
        </div>
        <div className="brands-featured__copy">
          <span className="brands-eyebrow">Priority Brand</span>
          <h2>{medstar.title}</h2>
          <p>{medstar.description}</p>
          <div className="brands-actions">
            <Link className="brands-button brands-button--primary" to="/brands/medstar">Explore Medstar</Link>
            <Link className="brands-button brands-button--secondary" to="/shop?q=Medstar">Search Medstar range</Link>
          </div>
        </div>
      </section>

      <section className="brands-shell brands-directory">
        <div className="brands-section-heading">
          <span className="brands-eyebrow">Brand Directory</span>
          <h2>Browse by clinical specialty.</h2>
          <p>Each profile connects the brand to its relevant Bahrain supply category and enquiry route.</p>
        </div>
        <div className="brands-grid">
          {partners.map((brand) => (
            <Link className="brand-tile" to={`/brands/${brand.slug}`} key={brand.slug}>
              <div className="brand-tile__logo">
                <img src={brand.logo} alt={`${brand.name} logo`} loading="lazy" decoding="async" />
              </div>
              <div className="brand-tile__content">
                <span className="brand-tile__relationship">{brand.relationship}</span>
                <h3>{brand.name}</h3>
                <p>{brand.specialty}</p>
                <span className="brand-tile__link">View brand profile <span aria-hidden="true">→</span></span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};

export default BrandsPage;
