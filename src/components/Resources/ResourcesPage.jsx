import { Link } from 'react-router-dom';
import Seo from '../Common/Seo';
import { buildBreadcrumbSchema, buildCollectionSchema, organizationSchema, localBusinessSchema } from '../../utils/seoSchemas';
import { resourceGuides } from '../../utils/resourceGuides';
import './ResourcesPage.css';

const ResourcesPage = () => (
  <main className="resources-page">
    <Seo
      title="Bahrain Procurement Guides | Leading Trading Est"
      description="Buyer guides for Bahrain medical, laboratory, dental, and industrial procurement teams reviewing product requirements, RFQs, documentation, and safety supplies."
      canonicalPath="/resources"
      keywords="Bahrain procurement guides, medical supplies guide Bahrain, laboratory consumables guide, industrial safety shoes Bahrain"
      structuredData={[
        organizationSchema,
        localBusinessSchema,
        buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Resources', path: '/resources' },
        ]),
        buildCollectionSchema({
          name: 'Leading Trading Est Procurement Resources',
          description: 'Educational guides for Bahrain B2B medical, laboratory, dental, and industrial buyers.',
          path: '/resources',
          items: resourceGuides.map((guide) => ({ name: guide.title, path: `/resources/${guide.slug}` })),
        }),
      ]}
    />
    <section className="resources-shell">
      <span className="resources-eyebrow">Procurement Resources</span>
      <h1>Guides for Bahrain healthcare and industrial buyers</h1>
      <p>
        Practical buying notes for teams preparing RFQs, reviewing product categories, and planning repeat supply.
      </p>
      <div className="resources-grid">
        {resourceGuides.map((guide) => (
          <Link className="resources-card" to={`/resources/${guide.slug}`} key={guide.slug}>
            <small>{guide.category}</small>
            <strong>{guide.title}</strong>
            <p>{guide.description}</p>
            <span>Read guide</span>
          </Link>
        ))}
      </div>
    </section>
  </main>
);

export default ResourcesPage;
