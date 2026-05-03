import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../Common/Seo';
import { useLanguage } from '../../context/LanguageContext';
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
  const { t } = useLanguage();

  useScrollReveal(rootRef);

  return (
  <main className="about-shell" ref={rootRef}>
    <Seo
      title="About Leading Trading Est | Bahrain Medical & Industrial Supply"
      description="Learn about Leading Trading Est, a Bahrain-based medical, dental, industrial, and safety supply business focused on quality sourcing and dependable delivery."
      canonicalPath="/about"
    />
    <section className="about-hero">
      <div className="about-hero-copy animate-stagger" data-stagger-step="100ms">
        <span className="about-eyebrow animate-on-scroll">{t('About Leading Trading Est')}</span>
        <h1 className="animate-on-scroll">{t('Supporting procurement in Bahrain with disciplined sourcing, quality assurance, and dependable delivery coordination.')}</h1>
        <p className="animate-on-scroll">
          {t('Since 2012, Leading Trading Est has supported organizations in Bahrain across medical, dental, industrial, and safety requirements with a focus on product quality, service reliability, and professional execution.')}
        </p>
        <div className="about-hero-actions animate-on-scroll">
          <Link className="btn primary" to="/contact">{t('Talk to Our Team')}</Link>
          <Link className="btn" to="/categories">{t('Explore Categories')}</Link>
        </div>
      </div>

      <div className="about-hero-panel animate-stagger" data-stagger-step="100ms">
        <span className="about-hero-panel-label animate-on-scroll">{t('Operating profile')}</span>
        <strong className="animate-on-scroll">{t('Supplier-led sourcing, structured procurement, and dependable operational follow-through.')}</strong>
        <p className="animate-on-scroll">
          {t('Our business model combines supplier access, quality review, procurement discipline, logistics planning, and local account support under one coordinated operating workflow.')}
        </p>
        <div className="about-hero-metrics animate-stagger" data-stagger-step="90ms">
          <div className="animate-on-scroll">
            <strong>2012</strong>
            <span>{t('company foundation')}</span>
          </div>
          <div className="animate-on-scroll">
            <strong>{t('Medical')}</strong>
            <span>{t('clinical and equipment supply')}</span>
          </div>
          <div className="animate-on-scroll">
            <strong>{t('Industrial')}</strong>
            <span>{t('safety and operational support')}</span>
          </div>
        </div>
      </div>
    </section>

    <section className="about-story">
      <div className="about-section-heading animate-stagger" data-stagger-step="100ms">
        <span className="about-eyebrow animate-on-scroll">{t('Company profile')}</span>
        <h2 className="animate-on-scroll">{t('A Bahrain-based supply business built around continuity, accountability, and service reliability.')}</h2>
      </div>

      <div className="about-story-grid animate-stagger" data-stagger-step="110ms">
        <article className="about-story-card about-story-card--lead animate-on-scroll">
          <p>
            {t('Leading Trading Est serves hospitals, clinics, practices, and operational teams that require dependable access to the right products supported by a workflow that remains organized from sourcing through delivery. The company’s focus is not only on what is supplied, but also on whether the sourcing path, documentation, timing, and handling process are strong enough to support daily operations without unnecessary disruption.')}
          </p>
          <p>
            {t('The company operates across medical, dental, and industrial categories, combining supplier access with practical coordination on pricing, quality, lead times, stock readiness, and delivery planning. This allows LTE to support both recurring demand and urgent procurement requirements with better control and clearer accountability.')}
          </p>
        </article>

        <article className="about-story-card about-story-card--pillars animate-on-scroll">
          <span className="about-card-kicker">{t('What defines the company')}</span>
          <ul className="about-pillar-list">
            {companyPillars.map((pillar) => (
              <li key={pillar}>{t(pillar)}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>

    <section className="about-workflow">
      <div className="about-section-heading animate-stagger" data-stagger-step="100ms">
        <span className="about-eyebrow animate-on-scroll">{t('Workflow')}</span>
        <h2 className="animate-on-scroll">{t('A structured workflow supporting quality, clarity, and dependable execution from enquiry to delivery.')}</h2>
      </div>

      <div className="about-workflow-grid animate-stagger" data-stagger-step="110ms">
        {workflowSteps.map((step, index) => (
          <article className="about-workflow-card animate-on-scroll" key={step.title}>
            <span className="about-workflow-index">{`0${index + 1}`}</span>
            <h3>{t(step.title)}</h3>
            <p>{t(step.description)}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="about-leadership">
      <div className="about-section-heading animate-stagger" data-stagger-step="100ms">
        <span className="about-eyebrow animate-on-scroll">{t('Leadership')}</span>
        <h2 className="animate-on-scroll">{t('Leadership that sets the standard for quality, coordination, and long-term customer confidence.')}</h2>
      </div>

      <div className="about-leadership-card animate-stagger" data-stagger-step="100ms">
        <div className="about-leadership-signature animate-on-scroll">
          <span className="about-card-kicker">{t('Message from leadership')}</span>
          <strong>Shahid Majeed</strong>
          <small>{t('Managing Director & CEO')}</small>
        </div>

        <div className="about-leadership-copy animate-on-scroll">
          <p>
            {t('At Leading Trading Est, the objective has always been clear: build a supply business that customers can rely on when product quality, timing, and service standards matter. That requires disciplined sourcing, careful supplier evaluation, and operational follow-through that matches what has been committed.')}
          </p>
          <p>
            {t('Our growth has been built on trust, consistency, and a team structure that supports execution from enquiry to delivery. We continue to strengthen supplier relationships, maintain service standards, and support customers with solutions that remain dependable in practice as well as on paper.')}
          </p>
        </div>
      </div>
    </section>

    <section className="about-team">
      <div className="about-section-heading animate-stagger" data-stagger-step="100ms">
        <span className="about-eyebrow animate-on-scroll">{t('Team structure')}</span>
        <h2 className="animate-on-scroll">{t('A team structure built around leadership, commercial coordination, administrative control, and delivery execution.')}</h2>
      </div>

      <div className="about-team-grid animate-stagger" data-stagger-step="110ms">
        {teamUnits.map((unit) => (
          <article className="about-team-card animate-on-scroll" key={unit.label}>
            <span>{t(unit.label)}</span>
            <h3>{t(unit.title)}</h3>
            <p>{t(unit.description)}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="about-story">
      <div className="about-story-grid animate-stagger" data-stagger-step="110ms">
        <article className="about-story-card about-story-card--lead animate-on-scroll">
          <span className="about-card-kicker">{t('Quality commitment')}</span>
          <p>
            {t('Quality at LTE is reflected in the way suppliers are reviewed, products are assessed, documentation is considered, and delivery commitments are handled. The objective is not simply to fulfil an order, but to do so with the level of control and reliability professional buyers expect.')}
          </p>
        </article>

        <article className="about-story-card about-story-card--pillars animate-on-scroll">
          <span className="about-card-kicker">{t('Working relationship')}</span>
          <ul className="about-pillar-list">
            <li>{t('Responsive commercial follow-up from enquiry through quotation and order handling')}</li>
            <li>{t('Operational coordination between sales, accounts, and delivery teams')}</li>
            <li>{t('Support for repeat accounts and longer-term procurement relationships')}</li>
          </ul>
        </article>
      </div>
    </section>
  </main>
  );
};

export default About;
