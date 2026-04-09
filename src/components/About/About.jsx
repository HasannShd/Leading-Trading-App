import { Link } from 'react-router-dom';
import './About.css';

const teamUnits = [
  {
    label: 'Managing Director & CEO',
    title: 'Shahid Majeed',
    description:
      'Provides strategic direction, strengthens supplier relationships, and sets the operational and quality standards the company is expected to maintain.',
  },
  {
    label: 'Accounts & HR',
    title: 'Operational control and internal continuity',
    description:
      'Supports financial discipline, internal administration, people coordination, and the controls required to keep daily operations consistent and dependable.',
  },
  {
    label: 'Sales Department',
    title: 'Customer-facing commercial execution',
    description:
      'Handles enquiries, quotations, account follow-up, and customer coordination to ensure requirements are translated into the right commercial and product decisions.',
  },
  {
    label: 'Delivery Team',
    title: 'Final-mile fulfillment and handoff',
    description:
      'Coordinates dispatch and handover so confirmed orders are delivered on time, in the correct condition, and with proper follow-through.',
  },
];

const companyPillars = [
  'Medical, dental, and industrial sourcing managed under one operating structure',
  'Supplier assessment based on quality, price, reliability, and documentation standards',
  'Inventory-aware coordination from procurement through delivery',
  'A team model built around leadership, sales, administration, and delivery execution',
];

const About = () => (
  <main className="about-shell">
    <section className="about-hero">
      <div className="about-hero-copy">
        <span className="about-eyebrow">About Leading Trading Est</span>
        <h1>Built to support procurement with stronger supplier discipline, quality control, and dependable delivery.</h1>
        <p>
          Since 2012, Leading Trading Est has supported organizations in Bahrain across medical, dental,
          industrial, and safety requirements with a focus on quality, reliability, and professional execution.
        </p>
        <div className="about-hero-actions">
          <Link className="btn primary" to="/contact">Talk to Our Team</Link>
          <Link className="btn" to="/products">Explore Categories</Link>
        </div>
      </div>

      <div className="about-hero-panel">
        <span className="about-hero-panel-label">Operating profile</span>
        <strong>Supplier-led sourcing, structured procurement, and dependable operational follow-through.</strong>
        <p>
          Our workflow covers requirement assessment, supplier review, product evaluation, procurement alignment,
          logistics coordination, stock handling, and final delivery support.
        </p>
        <div className="about-hero-metrics">
          <div>
            <strong>2012</strong>
            <span>company foundation</span>
          </div>
          <div>
            <strong>Medical</strong>
            <span>clinical and equipment supply</span>
          </div>
          <div>
            <strong>Industrial</strong>
            <span>safety and operational support</span>
          </div>
        </div>
      </div>
    </section>

    <section className="about-story">
      <div className="about-section-heading">
        <span className="about-eyebrow">Company profile</span>
        <h2>A Bahrain-based supply business built around continuity, accountability, and service reliability.</h2>
      </div>

      <div className="about-story-grid">
        <article className="about-story-card about-story-card--lead">
          <p>
            Leading Trading Est serves hospitals, clinics, practices, and operational teams that require dependable
            access to the right products supported by a workflow that remains organized from sourcing through delivery.
            Our focus is not only on what is supplied, but also on whether the sourcing path, documentation, timing,
            and handling process are strong enough to support day-to-day operations without disruption.
          </p>
          <p>
            The company operates across medical, dental, and industrial categories, combining supplier access
            with practical coordination on pricing, quality, lead times, stock readiness, and delivery planning.
            This allows us to support both recurring demand and urgent procurement requirements with greater control.
          </p>
        </article>

        <article className="about-story-card about-story-card--pillars">
          <span className="about-card-kicker">What defines the company</span>
          <ul className="about-pillar-list">
            {companyPillars.map((pillar) => (
              <li key={pillar}>{pillar}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>

    <section className="about-leadership">
      <div className="about-section-heading">
        <span className="about-eyebrow">Leadership</span>
        <h2>Leadership that sets the company’s standard for quality, coordination, and service.</h2>
      </div>

      <div className="about-leadership-card">
        <div className="about-leadership-signature">
          <span className="about-card-kicker">Message from leadership</span>
          <strong>Shahid Majeed</strong>
          <small>Managing Director & CEO</small>
        </div>

        <div className="about-leadership-copy">
          <p>
            At Leading Trading Est, the objective has always been clear: build a supply business that customers
            can rely on when product quality, timing, and service standards matter. That requires disciplined
            sourcing, careful supplier evaluation, and operational follow-through that matches what has been committed.
          </p>
          <p>
            Our growth has been built on trust, consistency, and a team structure that supports execution from
            enquiry to delivery. We continue to strengthen supplier relationships, maintain service standards,
            and support customers with solutions that are dependable in practice as well as on paper.
          </p>
        </div>
      </div>
    </section>

    <section className="about-team">
      <div className="about-section-heading">
        <span className="about-eyebrow">Team structure</span>
        <h2>A team structure built around leadership, administration, sales coordination, and delivery execution.</h2>
      </div>

      <div className="about-team-grid">
        {teamUnits.map((unit) => (
          <article className="about-team-card" key={unit.label}>
            <span>{unit.label}</span>
            <h3>{unit.title}</h3>
            <p>{unit.description}</p>
          </article>
        ))}
      </div>
    </section>
  </main>
);

export default About;
