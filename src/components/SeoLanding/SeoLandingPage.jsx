import { Link, useParams } from 'react-router-dom';
import Seo from '../Common/Seo';
import StatePanel from '../Common/StatePanel';
import {
  buildBreadcrumbSchema,
  buildCollectionSchema,
  buildFaqSchema,
  localBusinessSchema,
  organizationSchema,
  warehousingWorldSchema,
} from '../../utils/seoSchemas';
import { getSeoLandingPage, seoLandingPages } from '../../utils/seoLandingPages';
import './SeoLandingPage.css';

const getRelatedPages = (activeSlug) =>
  seoLandingPages.filter((page) => page.slug !== activeSlug).slice(0, 4);

const SEO_OVERRIDES = {
  'medical-suppliers-bahrain': {
    title: 'Medical Equipment & Consumables Supplier Bahrain',
    description:
      'Source urology, anesthesia, surgical, and medical consumables in Bahrain with LTE quotation support, documentation review, and local follow-up.',
  },
  'laboratory-supplies-bahrain': {
    title: 'Laboratory Sourcing & Diagnostic Devices Bahrain',
    description:
      'Clinical lab equipment, diagnostics, and testing consumables for Bahrain healthcare facilities with specification review and quotation support.',
  },
};

const buildProcurementDepth = (page) => page.locationPage ? [
  {
    title: 'Leading Trading Est inside Warehousing World Bahrain',
    body:
      'Leading Trading Est operates from Office 109, Building 658, Road 16, Block 616, inside Warehousing World in Um Al-Baidh, Sitra. This location page connects the LTE business name, office address, map location, medical and industrial supply activity, and Bahrain service area in one crawlable source.',
  },
  {
    title: 'A local point of contact for Bahrain procurement teams',
    body:
      'Customers searching for Warehousing World, Warehouse World, Sitra suppliers, or the LTE office can use the contact and map links to reach the correct location. LTE supports medical, dental, laboratory, safety, and industrial procurement enquiries from this Bahrain office.',
  },
] : [
  {
    title: `${page.categoryLabel} procurement standards in Bahrain`,
    body:
      `For ${page.categoryLabel.toLowerCase()} enquiries, LTE keeps the buying process focused on specification fit, product suitability, packaging, brand preference, and documentation needs before a quotation is prepared. Bahrain procurement teams often compare items across clinical, laboratory, dental, safety, and industrial use cases, so this page connects the category context with direct catalogue search, related supply guides, and a contact route that preserves the buyer requirement. The goal is to help hospitals, clinics, labs, offices, and operations teams move from a broad search into a clear RFQ without losing the category or product context.`,
  },
  {
    title: 'Brand access, documentation, and quotation workflow',
    body:
      'Leading Trading Est supports local buyers with Medstar own-brand supply, international supplier and distributor relationships, and dedicated support for ROMSONS and SMI where relevant. Requirements can include model references, SKU details, preferred brand, quantity, urgency, delivery expectations, and supporting documents such as RFQ spreadsheets or technical schedules. The quotation workflow is built for B2B purchasing rather than retail checkout: buyers shortlist products, share requirements, and receive follow-up from the LTE team for availability, specifications, and commercial handling.',
  },
  {
    title: 'Local supply support for Sitra and Bahrain buyers',
    body:
      'LTE operates from Sitra with a Bahrain-based team covering leadership, sales, accounts, HR, IT, digital marketing, and delivery coordination. That local structure matters for procurement teams that need responsive communication, repeat-order continuity, and better follow-up than a generic catalogue site can provide. Buyers can use this guide to understand the category, open the relevant catalogue section, compare related supply guides, and submit an online enquiry with enough detail for the team to respond accurately.',
  },
];

const SeoLandingPage = () => {
  const { slug } = useParams();
  const page = getSeoLandingPage(slug);

  if (!page) {
    return (
      <main className="seo-landing">
        <Seo
          title="Supply Guide Not Found | Leading Trading Est"
          description="The requested supply guide is not available."
          canonicalPath="/categories"
          robots="noindex,follow,noarchive"
          structuredData={[]}
        />
        <section className="seo-landing-shell seo-landing-empty">
          <StatePanel
            eyebrow="Unavailable"
            title="Supply guide not available"
            description="Open the main category catalog to find the right product group."
            action={<Link className="btn primary" to="/categories">Browse categories</Link>}
          />
        </section>
      </main>
    );
  }

  const canonicalPath = `/solutions/${page.slug}`;
  const related = getRelatedPages(page.slug);
  const seoOverride = SEO_OVERRIDES[page.slug] || {};

  return (
    <main className="seo-landing">
      <Seo
        title={seoOverride.title || `${page.title} | Leading Trading Est`}
        description={seoOverride.description || page.description}
        canonicalPath={canonicalPath}
        keywords={page.keywords}
        structuredData={[
          organizationSchema,
          localBusinessSchema,
          ...(page.locationPage ? [warehousingWorldSchema] : []),
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Solutions', path: '/categories' },
            { name: page.title, path: canonicalPath },
          ]),
          buildCollectionSchema({
            name: page.title,
            description: page.description,
            path: canonicalPath,
            items: [
              { name: page.categoryLabel, path: page.categoryPath },
              { name: 'Product catalog', path: `/shop?q=${encodeURIComponent(page.shopQuery)}` },
              ...(page.catalogPicks || []).map((item) => ({
                name: item.name,
                path: `/shop?q=${encodeURIComponent(item.query || item.name)}`,
              })),
              ...related.map((item) => ({ name: item.title, path: `/solutions/${item.slug}` })),
            ],
          }),
          buildFaqSchema(page.faqs),
        ]}
      />

      <section className="seo-landing-hero">
        <div className="seo-landing-shell seo-landing-hero-grid">
          <div className="seo-landing-copy">
            <span className="seo-landing-eyebrow">{page.locationPage ? 'Bahrain Business Location' : 'Bahrain Supply Guide'}</span>
            <h1>{page.title}</h1>
            <p>{page.description}</p>
            <div className="seo-landing-actions">
              <Link
                className="home-btn home-btn--primary"
                to={`/contact?source=seo&categoryName=${encodeURIComponent(page.categoryLabel)}`}
              >
                Request a Quote
              </Link>
              <Link className="home-btn home-btn--ghost" to={page.categoryPath}>
                Browse {page.categoryLabel}
              </Link>
            </div>
          </div>

          <aside className="seo-landing-panel">
            <span>Buyer terms</span>
            <div>
              {page.buyerTerms.map((term) => (
                <strong key={term}>{term}</strong>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="seo-landing-shell seo-landing-content">
        <div className="seo-landing-article">
          {page.sections.map((section) => (
            <article key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </article>
          ))}
          {buildProcurementDepth(page).map((section) => (
            <article key={section.title} className="seo-landing-depth">
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </article>
          ))}
        </div>

        <aside className="seo-landing-side">
          <h2>Fast paths</h2>
          <Link to={page.categoryPath}>Open category</Link>
          <Link to={`/shop?q=${encodeURIComponent(page.shopQuery)}`}>Search products</Link>
          <Link to="/contact?source=seo">Send requirement</Link>
        </aside>
      </section>

      {!!page.catalogPicks?.length && (
        <section className="seo-landing-shell seo-landing-products">
          <div>
            <span className="seo-landing-eyebrow">Catalogue Picks</span>
            <h2>{page.catalogPicksTitle || 'Relevant catalogue items'}</h2>
          </div>
          <div className="seo-landing-product-grid">
            {page.catalogPicks.map((item) => (
              <Link
                key={`${item.name}-${item.category}`}
                className="seo-landing-product-card"
                to={`/shop?q=${encodeURIComponent(item.query || item.name)}`}
              >
                <small>{item.category}</small>
                <strong>{item.name}</strong>
                <p>{item.useCase}</p>
                <span>Search catalogue</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="seo-landing-shell seo-landing-faq">
        <div>
          <span className="seo-landing-eyebrow">Common Questions</span>
          <h2>Helpful answers before requesting a quote</h2>
        </div>
        <div className="seo-landing-faq-grid">
          {page.faqs.map((item) => (
            <article key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="seo-landing-shell seo-landing-related">
        <div>
          <span className="seo-landing-eyebrow">Related Guides</span>
          <h2>More Bahrain supply categories</h2>
        </div>
        <div className="seo-landing-related-grid">
          {related.map((item) => (
            <Link key={item.slug} to={`/solutions/${item.slug}`}>
              <small>{item.shortTitle}</small>
              <strong>{item.title}</strong>
              <span>Open guide</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};

export default SeoLandingPage;
