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
  'Supplier assessment guided by quality, suitability, reliability, and documentation standards',
  'Procurement and delivery coordination shaped around continuity, timing, and service accountability',
  'A team model that aligns leadership, sales, accounts, and delivery execution',
];

const workflowSteps = [
  {
    title: 'Requirement review',
    description:
      'Customer requirements are clarified early so product selection, quotations, and expected delivery conditions are aligned from the outset.',
  },
  {
    title: 'Supplier and product evaluation',
    description:
      'Suitable suppliers and products are reviewed against quality, availability, documentation, and the operational needs of the customer.',
  },
  {
    title: 'Procurement alignment',
    description:
      'Commercial terms, quantities, lead times, and specification details are consolidated into a clearer procurement decision.',
  },
  {
    title: 'Logistics and delivery coordination',
    description:
      'Inventory handling, dispatch planning, and final delivery timing are organized before fulfilment moves into execution.',
  },
];

const About = () => (
  <main className="about-shell">
    <section className="about-hero">
      <div className="about-hero-copy">
        <span className="about-eyebrow">About Leading Trading Est</span>
        <h1>Built to support procurement with stronger supplier discipline, quality assurance, and dependable delivery coordination.</h1>
        <p>
          Since 2012, Leading Trading Est has supported organizations in Bahrain across medical, dental,
          industrial, and safety requirements with a focus on product quality, service reliability, and professional execution.
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
          Our business model combines supplier access, quality review, procurement discipline, logistics planning, and local account support under one operating workflow.
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
            The company operates across medical, dental, and industrial categories, combining supplier access with
            practical coordination on pricing, quality, lead times, stock readiness, and delivery planning. This
            enables us to support both recurring demand and urgent procurement requirements with better control.
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

    <section className="about-workflow">
      <div className="about-section-heading">
        <span className="about-eyebrow">Workflow</span>
        <h2>A structured workflow that supports quality, clarity, and dependable execution from enquiry to delivery.</h2>
      </div>

      <div className="about-workflow-grid">
        {workflowSteps.map((step, index) => (
          <article className="about-workflow-card" key={step.title}>
            <span className="about-workflow-index">{`0${index + 1}`}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="about-leadership">
      <div className="about-section-heading">
        <span className="about-eyebrow">Leadership</span>
        <h2>Leadership that sets the company’s standards for quality, coordination, and long-term customer confidence.</h2>
      </div>

      <div className="about-leadership-card">
        <div className="about-leadership-signature">
          <span className="about-card-kicker">Message from leadership</span>
          <strong>Shahid Majeed</strong>
          <small>Managing Director & CEO</small>
        </div>

        <div className="about-leadership-copy">
          <p>
            At Leading Trading Est, the objective has always been clear: build a supply business that customers can
            rely on when product quality, timing, and service standards matter. That requires disciplined sourcing,
            careful supplier evaluation, and operational follow-through that matches what has been committed.
          </p>
          <p>
            Our growth has been built on trust, consistency, and a team structure that supports execution from enquiry
            to delivery. We continue to strengthen supplier relationships, maintain service standards, and support
            customers with solutions that are dependable in practice as well as on paper.
          </p>
        </div>
      </div>
    </section>

    <section className="about-team">
      <div className="about-section-heading">
        <span className="about-eyebrow">Team structure</span>
        <h2>A team structure built around leadership, commercial coordination, administrative control, and delivery execution.</h2>
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

    <section className="about-story">
      <div className="about-story-grid">
        <article className="about-story-card about-story-card--lead">
          <span className="about-card-kicker">Quality commitment</span>
          <p>
            Quality at LTE is reflected in the way suppliers are reviewed, products are assessed, documentation is
            considered, and delivery commitments are handled. The objective is not simply to fulfil an order, but to
            do so with the level of control and reliability that professional buyers expect.
          </p>
        </article>

        <article className="about-story-card about-story-card--pillars">
          <span className="about-card-kicker">Working relationship</span>
          <ul className="about-pillar-list">
            <li>Responsive commercial follow-up from enquiry to quotation</li>
            <li>Operational coordination between sales, accounts, and delivery</li>
            <li>Support for repeat accounts and long-term procurement relationships</li>
          </ul>
        </article>
      </div>
    </section>
  </main>
);

export default About;
