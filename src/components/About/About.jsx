import { Link } from 'react-router-dom';
import './About.css';

const teamUnits = [
  {
    label: 'Managing Director & CEO',
    title: 'Shahid Majeed',
    description:
      'Provides strategic direction, supplier alignment, business development oversight, and the quality standard the company operates against.',
  },
  {
    label: 'Accounts & HR',
    title: 'Operational control and internal continuity',
    description:
      'Supports finance discipline, people coordination, internal administration, and the structure required to keep day-to-day operations reliable.',
  },
  {
    label: 'Sales Department',
    title: 'Customer-facing commercial execution',
    description:
      'Handles inquiries, quotation workflows, account follow-up, and the commercial side of helping customers source the right products.',
  },
  {
    label: 'Delivery Team',
    title: 'Final-mile fulfillment and handoff',
    description:
      'Moves confirmed orders from prepared inventory to delivery execution, helping ensure products arrive on time and in the right condition.',
  },
];

const companyPillars = [
  'Medical, dental, and industrial sourcing under one operating structure',
  'Supplier assessment focused on quality, price, and reliability',
  'Inventory-aware handling from inbound logistics to final delivery',
  'A team model built around leadership, sales, administration, and delivery execution',
];

const About = () => (
  <main className="about-shell">
    <section className="about-hero">
      <div className="about-hero-copy">
        <span className="about-eyebrow">About Leading Trading Est</span>
        <h1>Built as an operating partner for buyers who need more than a catalog.</h1>
        <p>
          Since 2012, Leading Trading Est has supported organizations in Bahrain with medical, dental,
          industrial, and supply-related sourcing that prioritizes quality, reliability, and execution.
        </p>
        <div className="about-hero-actions">
          <Link className="btn primary" to="/contact">Talk to Our Team</Link>
          <Link className="btn" to="/products">Explore Categories</Link>
        </div>
      </div>

      <div className="about-hero-panel">
        <span className="about-hero-panel-label">Operating profile</span>
        <strong>Demand-led sourcing. Structured procurement. Controlled delivery.</strong>
        <p>
          We work across product identification, supplier search, evaluation, order confirmation,
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
        <h2>A Bahrain-based supply business shaped around continuity, not just transactions.</h2>
      </div>

      <div className="about-story-grid">
        <article className="about-story-card about-story-card--lead">
          <p>
            Leading Trading Est was built to serve hospitals, clinics, practices, and operational teams
            that need dependable access to the right products with a workflow that stays organized from
            sourcing through delivery. Our focus is not only on what product is supplied, but also on
            whether the sourcing path, timing, documentation, and handling process are strong enough to
            support real business operations.
          </p>
          <p>
            The company works across medical, dental, and industrial categories, combining supplier access
            with practical coordination on price, quality, lead times, and stock readiness. That is what
            allows us to support both recurring demand and urgent procurement needs with more discipline.
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
        <h2>Direction led by the managing director and CEO.</h2>
      </div>

      <div className="about-leadership-card">
        <div className="about-leadership-signature">
          <span className="about-card-kicker">Message from leadership</span>
          <strong>Shahid Majeed</strong>
          <small>Managing Director & CEO</small>
        </div>

        <div className="about-leadership-copy">
          <p>
            At Leading Trading Est, the objective has always been clear: build a supply business that
            customers can rely on when product quality, timing, and service standards matter. That means
            approaching sourcing with more care, evaluating suppliers properly, and making sure operational
            follow-through matches what was promised.
          </p>
          <p>
            Our growth is built on trust, consistency, and a team structure that supports execution from
            inquiry to delivery. We continue to focus on raising standards, strengthening supplier
            relationships, and supporting customers with solutions that are dependable in practice, not
            only on paper.
          </p>
        </div>
      </div>
    </section>

    <section className="about-team">
      <div className="about-section-heading">
        <span className="about-eyebrow">Team structure</span>
        <h2>A company structure designed around leadership, coordination, sales, and delivery.</h2>
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
