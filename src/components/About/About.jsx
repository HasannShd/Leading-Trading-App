import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import './About.css';

const teamUnits = [
  {
    label: 'Managing Director & CEO',
    title: 'Shahid Majeed',
    description:
      'Sets the company’s strategic direction, strengthens supplier relationships, and maintains the service, quality, and operating standards clients expect from LTE.',
  },
  {
    label: 'Accounts & HR',
    title: 'Operational control and internal continuity',
    description:
      'Supports financial discipline, internal administration, staff coordination, and the controls required to keep day-to-day operations stable, accurate, and dependable.',
  },
  {
    label: 'Sales Department',
    title: 'Customer-facing commercial execution',
    description:
      'Manages enquiries, quotations, account follow-up, and commercial coordination so customer requirements are converted into suitable sourcing and procurement decisions.',
  },
  {
    label: 'Delivery Team',
    title: 'Final-mile fulfillment and handoff',
    description:
      'Coordinates dispatch and handover so confirmed orders are delivered on time, in the correct condition, and with the follow-through required for repeat business.',
  },
];

const companyPillars = [
  'Medical, dental, and industrial sourcing managed through one accountable operating structure',
  'Supplier review guided by quality, suitability, reliability, and documentation discipline',
  'Procurement and delivery coordination organized around continuity, timing, and service accountability',
  'A team model that aligns leadership, sales, accounts, and delivery under one workflow',
];

const workflowSteps = [
  {
    title: 'Requirement review',
    description:
      'Requirements are clarified early so product selection, quotations, and delivery expectations are aligned from the outset.',
  },
  {
    title: 'Supplier and product evaluation',
    description:
      'Suppliers and products are assessed against quality, availability, documentation, and the operating conditions of the end user.',
  },
  {
    title: 'Procurement alignment',
    description:
      'Commercial terms, quantities, lead times, and specification details are consolidated into a procurement decision with better visibility and control.',
  },
  {
    title: 'Logistics and delivery coordination',
    description:
      'Inventory handling, dispatch planning, and final delivery timing are coordinated before fulfilment moves into execution.',
  },
];

const About = () => {
  const rootRef = useRef(null);

  useScrollReveal(rootRef);

  return (
  <main className="about-shell" ref={rootRef}>
    <section className="about-hero">
      <div className="about-hero-copy animate-stagger" data-stagger-step="100ms">
        <span className="about-eyebrow animate-on-scroll">About Leading Trading Est</span>
        <h1 className="animate-on-scroll">Supporting procurement in Bahrain with disciplined sourcing, quality assurance, and dependable delivery coordination.</h1>
        <p className="animate-on-scroll">
          Since 2012, Leading Trading Est has supported organizations in Bahrain across medical, dental,
          industrial, and safety requirements with a focus on product quality, service reliability, and professional execution.
        </p>
        <div className="about-hero-actions animate-on-scroll">
          <Link className="btn primary" to="/contact">Talk to Our Team</Link>
          <Link className="btn" to="/products">Explore Categories</Link>
        </div>
      </div>

      <div className="about-hero-panel animate-stagger" data-stagger-step="100ms">
        <span className="about-hero-panel-label animate-on-scroll">Operating profile</span>
        <strong className="animate-on-scroll">Supplier-led sourcing, structured procurement, and dependable operational follow-through.</strong>
        <p className="animate-on-scroll">
          Our business model combines supplier access, quality review, procurement discipline, logistics planning, and local account support under one coordinated operating workflow.
        </p>
        <div className="about-hero-metrics animate-stagger" data-stagger-step="90ms">
          <div className="animate-on-scroll">
            <strong>2012</strong>
            <span>company foundation</span>
          </div>
          <div className="animate-on-scroll">
            <strong>Medical</strong>
            <span>clinical and equipment supply</span>
          </div>
          <div className="animate-on-scroll">
            <strong>Industrial</strong>
            <span>safety and operational support</span>
          </div>
        </div>
      </div>
    </section>

    <section className="about-story">
      <div className="about-section-heading animate-stagger" data-stagger-step="100ms">
        <span className="about-eyebrow animate-on-scroll">Company profile</span>
        <h2 className="animate-on-scroll">A Bahrain-based supply business built around continuity, accountability, and service reliability.</h2>
      </div>

      <div className="about-story-grid animate-stagger" data-stagger-step="110ms">
        <article className="about-story-card about-story-card--lead animate-on-scroll">
          <p>
            Leading Trading Est serves hospitals, clinics, practices, and operational teams that require dependable
            access to the right products supported by a workflow that remains organized from sourcing through delivery.
            The company’s focus is not only on what is supplied, but also on whether the sourcing path, documentation,
            timing, and handling process are strong enough to support daily operations without unnecessary disruption.
          </p>
          <p>
            The company operates across medical, dental, and industrial categories, combining supplier access with
            practical coordination on pricing, quality, lead times, stock readiness, and delivery planning. This
            allows LTE to support both recurring demand and urgent procurement requirements with better control and clearer accountability.
          </p>
        </article>

        <article className="about-story-card about-story-card--pillars animate-on-scroll">
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
      <div className="about-section-heading animate-stagger" data-stagger-step="100ms">
        <span className="about-eyebrow animate-on-scroll">Workflow</span>
        <h2 className="animate-on-scroll">A structured workflow supporting quality, clarity, and dependable execution from enquiry to delivery.</h2>
      </div>

      <div className="about-workflow-grid animate-stagger" data-stagger-step="110ms">
        {workflowSteps.map((step, index) => (
          <article className="about-workflow-card animate-on-scroll" key={step.title}>
            <span className="about-workflow-index">{`0${index + 1}`}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="about-leadership">
      <div className="about-section-heading animate-stagger" data-stagger-step="100ms">
        <span className="about-eyebrow animate-on-scroll">Leadership</span>
        <h2 className="animate-on-scroll">Leadership that sets the standard for quality, coordination, and long-term customer confidence.</h2>
      </div>

      <div className="about-leadership-card animate-stagger" data-stagger-step="100ms">
        <div className="about-leadership-signature animate-on-scroll">
          <span className="about-card-kicker">Message from leadership</span>
          <strong>Shahid Majeed</strong>
          <small>Managing Director & CEO</small>
        </div>

        <div className="about-leadership-copy animate-on-scroll">
          <p>
            At Leading Trading Est, the objective has always been clear: build a supply business that customers can
            rely on when product quality, timing, and service standards matter. That requires disciplined sourcing,
            careful supplier evaluation, and operational follow-through that matches what has been committed.
          </p>
          <p>
            Our growth has been built on trust, consistency, and a team structure that supports execution from enquiry
            to delivery. We continue to strengthen supplier relationships, maintain service standards, and support
            customers with solutions that remain dependable in practice as well as on paper.
          </p>
        </div>
      </div>
    </section>

    <section className="about-team">
      <div className="about-section-heading animate-stagger" data-stagger-step="100ms">
        <span className="about-eyebrow animate-on-scroll">Team structure</span>
        <h2 className="animate-on-scroll">A team structure built around leadership, commercial coordination, administrative control, and delivery execution.</h2>
      </div>

      <div className="about-team-grid animate-stagger" data-stagger-step="110ms">
        {teamUnits.map((unit) => (
          <article className="about-team-card animate-on-scroll" key={unit.label}>
            <span>{unit.label}</span>
            <h3>{unit.title}</h3>
            <p>{unit.description}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="about-story">
      <div className="about-story-grid animate-stagger" data-stagger-step="110ms">
        <article className="about-story-card about-story-card--lead animate-on-scroll">
          <span className="about-card-kicker">Quality commitment</span>
          <p>
            Quality at LTE is reflected in the way suppliers are reviewed, products are assessed, documentation is
            considered, and delivery commitments are handled. The objective is not simply to fulfil an order, but to
            do so with the level of control and reliability professional buyers expect.
          </p>
        </article>

        <article className="about-story-card about-story-card--pillars animate-on-scroll">
          <span className="about-card-kicker">Working relationship</span>
          <ul className="about-pillar-list">
            <li>Responsive commercial follow-up from enquiry through quotation and order handling</li>
            <li>Operational coordination between sales, accounts, and delivery teams</li>
            <li>Support for repeat accounts and longer-term procurement relationships</li>
          </ul>
        </article>
      </div>
    </section>
  </main>
  );
};

export default About;
