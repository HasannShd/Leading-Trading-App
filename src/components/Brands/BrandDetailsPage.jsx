import { Link, useParams } from 'react-router-dom';
import Seo from '../Common/Seo';
import StatePanel from '../Common/StatePanel';
import { brandPages, getBrandPage } from '../../utils/brandPages';
import {
  absoluteUrl,
  buildBreadcrumbSchema,
  buildCollectionSchema,
  buildFaqSchema,
  localBusinessSchema,
  organizationSchema,
} from '../../utils/seoSchemas';
import './BrandsPage.css';

const BrandDetailsPage = () => {
  const { slug } = useParams();
  const brand = getBrandPage(slug);

  if (!brand) {
    return (
      <main className="brands-page brand-empty">
        <Seo
          title="Brand Not Found | Leading Trading Est"
          description="The requested brand profile is not available."
          canonicalPath="/brands"
          robots="noindex,follow,noarchive"
          structuredData={[]}
        />
        <div className="brands-shell">
          <StatePanel
            eyebrow="Unavailable"
            title="Brand profile not found"
            description="Open the brand directory to browse supported medical, dental and specialist supply lines."
            action={<Link className="brands-button brands-button--primary" to="/brands">Browse brands</Link>}
          />
        </div>
      </main>
    );
  }

  const canonicalPath = `/brands/${brand.slug}`;
  const related = brandPages.filter((item) => item.slug !== brand.slug).slice(0, 4);
  const brandSchema = {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    '@id': `${absoluteUrl(canonicalPath)}#brand`,
    name: brand.name,
    logo: absoluteUrl(brand.logo),
    url: absoluteUrl(canonicalPath),
    description: brand.description,
  };

  return (
    <main className={`brands-page brand-detail brand-detail--${brand.slug}`}>
      <Seo
        title={`${brand.title} | Leading Trading Est`}
        description={brand.description}
        canonicalPath={canonicalPath}
        image={brand.logo}
        keywords={brand.keywords}
        structuredData={[
          organizationSchema,
          localBusinessSchema,
          brandSchema,
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Brands', path: '/brands' },
            { name: brand.name, path: canonicalPath },
          ]),
          buildCollectionSchema({
            name: `${brand.name} supply focus in Bahrain`,
            description: brand.description,
            path: canonicalPath,
            items: [
              ...brand.categoryLinks.map((item) => ({ name: item.label, path: item.path })),
              { name: `Search ${brand.name}`, path: `/shop?q=${encodeURIComponent(brand.searchQuery)}` },
            ],
          }),
          buildFaqSchema(brand.faqs),
        ]}
      />

      <section className="brand-detail__hero">
        <div className="brands-shell brand-detail__hero-grid">
          <div className="brand-detail__copy">
            <Link className="brand-detail__back" to="/brands">← Brand directory</Link>
            <span className="brands-eyebrow">{brand.relationship}</span>
            <h1>{brand.title}</h1>
            <p>{brand.description}</p>
            <div className="brands-actions">
              <Link className="brands-button brands-button--primary" to={`/shop?q=${encodeURIComponent(brand.searchQuery)}`}>
                Search {brand.name}
              </Link>
              <Link className="brands-button brands-button--secondary brands-button--on-dark" to={`/contact?source=brand&brand=${encodeURIComponent(brand.name)}`}>
                Request a quotation
              </Link>
            </div>
          </div>
          <div className="brand-detail__logo-panel">
            <img src={brand.logo} alt={`${brand.name} brand`} width="520" height="320" />
            <span>{brand.specialty}</span>
          </div>
        </div>
      </section>

      <section className="brands-shell brand-detail__intro">
        <div>
          <span className="brands-eyebrow">Bahrain Brand Support</span>
          <h2>{brand.name} expertise connected to local supply.</h2>
        </div>
        <p>{brand.intro}</p>
      </section>

      <section className="brands-shell brand-detail__focus">
        <div className="brands-section-heading">
          <span className="brands-eyebrow">Supply Focus</span>
          <h2>Relevant products and procurement paths.</h2>
        </div>
        <div className="brand-focus-grid">
          {brand.focusAreas.map((area) => (
            <article key={area.title}>
              <h3>{area.title}</h3>
              <p>{area.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="brands-shell brand-detail__paths">
        <div className="brand-detail__terms">
          <span className="brands-eyebrow">Common Enquiries</span>
          <h2>Search terms buyers use for {brand.name}.</h2>
          <div className="brand-term-list">
            {brand.productTerms.map((term) => <span key={term}>{term}</span>)}
          </div>
        </div>
        <aside className="brand-detail__categories">
          <span>Relevant categories</span>
          {brand.categoryLinks.map((item) => (
            <Link to={item.path} key={item.path}>{item.label}<span aria-hidden="true">→</span></Link>
          ))}
          <Link to={`/contact?source=brand&brand=${encodeURIComponent(brand.name)}`}>Send brand requirement<span aria-hidden="true">→</span></Link>
        </aside>
      </section>

      <section className="brands-shell brand-detail__faq">
        <div className="brands-section-heading">
          <span className="brands-eyebrow">Buyer Questions</span>
          <h2>{brand.name} supply support in Bahrain.</h2>
        </div>
        <div className="brand-faq-grid">
          {brand.faqs.map((faq) => (
            <article key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="brands-shell brand-related">
        <div className="brands-section-heading">
          <span className="brands-eyebrow">Related Brand Lines</span>
          <h2>Continue through the LTE portfolio.</h2>
        </div>
        <div className="brand-related__grid">
          {related.map((item) => (
            <Link to={`/brands/${item.slug}`} key={item.slug}>
              <img src={item.logo} alt="" loading="lazy" decoding="async" />
              <span>{item.name}</span>
              <small>{item.specialty}</small>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};

export default BrandDetailsPage;
