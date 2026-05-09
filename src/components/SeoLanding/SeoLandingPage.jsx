import { Link, useParams } from 'react-router-dom';
import Seo from '../Common/Seo';
import StatePanel from '../Common/StatePanel';
import {
  buildBreadcrumbSchema,
  buildCollectionSchema,
  buildFaqSchema,
  localBusinessSchema,
  organizationSchema,
} from '../../utils/seoSchemas';
import { getSeoLandingPage, seoLandingPages } from '../../utils/seoLandingPages';
import './SeoLandingPage.css';

const getRelatedPages = (activeSlug) =>
  seoLandingPages.filter((page) => page.slug !== activeSlug).slice(0, 4);

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

  return (
    <main className="seo-landing">
      <Seo
        title={`${page.title} | Leading Trading Est`}
        description={page.description}
        canonicalPath={canonicalPath}
        keywords={page.keywords}
        structuredData={[
          organizationSchema,
          localBusinessSchema,
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
              ...related.map((item) => ({ name: item.title, path: `/solutions/${item.slug}` })),
            ],
          }),
          buildFaqSchema(page.faqs),
        ]}
      />

      <section className="seo-landing-hero">
        <div className="seo-landing-shell seo-landing-hero-grid">
          <div className="seo-landing-copy">
            <span className="seo-landing-eyebrow">Bahrain Supply Guide</span>
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
        </div>

        <aside className="seo-landing-side">
          <h2>Fast paths</h2>
          <Link to={page.categoryPath}>Open category</Link>
          <Link to={`/shop?q=${encodeURIComponent(page.shopQuery)}`}>Search products</Link>
          <Link to="/contact?source=seo">Send requirement</Link>
        </aside>
      </section>

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
