import { Link, useParams } from 'react-router-dom';
import Seo from '../Common/Seo';
import StatePanel from '../Common/StatePanel';
import { buildBreadcrumbSchema, buildFaqSchema, organizationSchema, localBusinessSchema } from '../../utils/seoSchemas';
import { getResourceGuide } from '../../utils/resourceGuides';
import './ResourcesPage.css';

const ResourceArticlePage = () => {
  const { slug } = useParams();
  const guide = getResourceGuide(slug);

  if (!guide) {
    return (
      <main className="resources-page">
        <Seo
          title="Resource Not Found | Leading Trading Est"
          description="The requested procurement guide is not available."
          canonicalPath="/resources"
          robots="noindex,follow,noarchive"
          structuredData={[]}
        />
        <section className="resources-shell">
          <StatePanel
            eyebrow="Unavailable"
            title="Guide not available"
            description="Open the resource hub to browse available procurement guides."
            action={<Link className="btn primary" to="/resources">Open resources</Link>}
          />
        </section>
      </main>
    );
  }

  return (
    <main className="resources-page">
      <Seo
        title={`${guide.title} | Leading Trading Est`}
        description={guide.description}
        canonicalPath={`/resources/${guide.slug}`}
        keywords={guide.keywords}
        structuredData={[
          organizationSchema,
          localBusinessSchema,
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Resources', path: '/resources' },
            { name: guide.title, path: `/resources/${guide.slug}` },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: guide.title,
            description: guide.description,
            author: { '@id': 'https://www.lte-bh.com/#organization' },
            publisher: { '@id': 'https://www.lte-bh.com/#organization' },
            mainEntityOfPage: `https://www.lte-bh.com/resources/${guide.slug}`,
          },
          buildFaqSchema([
            {
              question: `Can LTE help with ${guide.category.toLowerCase()} requirements in Bahrain?`,
              answer:
                'Yes. Buyers can send product requirements, quantities, preferred brands, and supporting RFQ files through the LTE contact form for review.',
            },
          ]),
        ]}
      />
      <article className="resources-shell resources-article">
        <Link className="resources-back" to="/resources">Resources</Link>
        <span className="resources-eyebrow">{guide.category}</span>
        <h1>{guide.title}</h1>
        <p>{guide.description}</p>
        <div className="resources-article-grid">
          {guide.sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>
        <div className="resources-cta">
          <strong>Ready to send a requirement?</strong>
          <Link className="home-btn home-btn--primary" to="/contact?source=resource">Request a Quote</Link>
        </div>
      </article>
    </main>
  );
};

export default ResourceArticlePage;
