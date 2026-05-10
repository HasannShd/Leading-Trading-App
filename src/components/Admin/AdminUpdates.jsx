import './AdminUpdates.css';

const releaseNotes = [
  {
    version: '2.8.0',
    title: 'Scheduled Marketing Campaigns',
    date: 'May 2026',
    status: 'Released',
    summary: 'Marketing emails can now be scheduled for a future time and limited to tagged audiences.',
    highlights: [
      'Added scheduled social-follow campaigns for selected contact tags.',
      'Added campaign status tracking for scheduled, sending, completed, failed, and completed with errors.',
      'Added new-client campaign tagging so old recipients are not contacted again by mistake.',
      'Added admin schedule controls for choosing a local date and time before sending.',
    ],
  },
  {
    version: '2.7.0',
    title: 'Professional PDF Catalogue',
    date: 'May 2026',
    status: 'Released',
    summary: 'The product catalogue was redesigned into a PDF-ready corporate catalogue for customer sharing.',
    highlights: [
      'Added A4 catalogue pages with cover, company intro, category index, service flow, and contact page.',
      'Grouped consumables and disposables into clearer subcategories such as PPE, gloves, gowns, dressings, and sutures.',
      'Added brand portfolio presentation and Medstar positioning in the catalogue.',
      'Improved PDF spacing to reduce awkward page splits on mobile PDF viewers.',
    ],
  },
  {
    version: '2.6.0',
    title: 'SEO And Search Visibility Upgrade',
    date: 'May 2026',
    status: 'Released',
    summary: 'Search visibility was improved with Bahrain-focused landing pages, sitemap work, and structured data fixes.',
    highlights: [
      'Added SEO landing URLs for medical suppliers, dental supplies, and sterile surgical consumables in Bahrain.',
      'Added stronger organization, local business, website, FAQ, and product structured data.',
      'Fixed product snippet pricing validation by treating quote-based products cleanly.',
      'Added Google Search Console verification support and sitemap improvements.',
    ],
  },
  {
    version: '2.5.0',
    title: 'Admin Data And Backup Controls',
    date: 'May 2026',
    status: 'Released',
    summary: 'Admin operations were improved with safer data handling, exports, backup access, and client records.',
    highlights: [
      'Added database backup access from the admin panel.',
      'Improved private API cache headers and noindex protections for admin and staff data.',
      'Added client import and marketing contact history support.',
      'Improved product Excel import behavior to update records without duplicate catalog rows.',
    ],
  },
  {
    version: '2.4.0',
    title: 'Mobile And Catalogue Browsing Improvements',
    date: 'April 2026',
    status: 'Released',
    summary: 'The public website was made easier to browse on phones and cleaner for category navigation.',
    highlights: [
      'Improved mobile hero spacing, tap targets, and category layout.',
      'Added cleaner category pages with subcategory descriptions.',
      'Improved predictive catalog filtering and product descriptions in category cards.',
      'Improved contextual quote flows so product interest can be captured with the request.',
    ],
  },
];

const upcomingPatches = [
  {
    version: '2.9.0',
    title: 'Campaign Analytics',
    priority: 'High',
    points: [
      'Show sent, failed, skipped, and opened counts in one dashboard.',
      'Add resend only to failed recipients.',
      'Add CSV export for each campaign result.',
    ],
  },
  {
    version: '3.0.0',
    title: 'Editable Release Notes',
    priority: 'Medium',
    points: [
      'Move this update log into database-managed records.',
      'Allow admin users to publish internal release notes from the panel.',
      'Show unread update badges for staff/admin users.',
    ],
  },
  {
    version: '3.1.0',
    title: 'Buyer Conversion Tracking',
    priority: 'High',
    points: [
      'Track quote button source by product, category, and SEO page.',
      'Show top converting products and search terms.',
      'Create monthly sales and marketing performance snapshots.',
    ],
  },
];

const AdminUpdates = () => (
  <div className="admin-updates-page">
    <section className="admin-updates-hero">
      <div>
        <span className="admin-updates-kicker">App Patch Notes</span>
        <h1>Leading Trading Est. app updates.</h1>
        <p>
          A version history for major improvements, operational fixes, and planned upgrades across the website,
          admin panel, staff tools, catalogue, SEO, security, and marketing system.
        </p>
      </div>
      <div className="admin-updates-version-card">
        <span>Current Major Patch</span>
        <strong>v2.8.0</strong>
        <p>Scheduled campaigns and cleaner admin marketing control.</p>
      </div>
    </section>

    <section className="admin-updates-grid">
      <div className="admin-updates-timeline">
        <div className="admin-updates-section-heading">
          <span>Released</span>
          <h2>Major app updates</h2>
        </div>
        {releaseNotes.map((release) => (
          <article className="admin-update-card" key={release.version}>
            <div className="admin-update-card-top">
              <div>
                <span className="admin-update-version">{release.version}</span>
                <h3>{release.title}</h3>
              </div>
              <div className="admin-update-meta">
                <span>{release.status}</span>
                <small>{release.date}</small>
              </div>
            </div>
            <p>{release.summary}</p>
            <ul>
              {release.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <aside className="admin-updates-roadmap">
        <div className="admin-updates-section-heading">
          <span>Next</span>
          <h2>Recommended patches</h2>
        </div>
        {upcomingPatches.map((patch) => (
          <article className="admin-roadmap-card" key={patch.version}>
            <div>
              <span>{patch.version}</span>
              <strong>{patch.title}</strong>
            </div>
            <em>{patch.priority} priority</em>
            <ul>
              {patch.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        ))}
      </aside>
    </section>
  </div>
);

export default AdminUpdates;
