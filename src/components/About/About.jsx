import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../Common/Seo';
import { buildBreadcrumbSchema, buildFaqSchema, localBusinessSchema, organizationSchema, shahidMajeedSchema } from '../../utils/seoSchemas';
import { useLanguage } from '../../context/LanguageContext';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import './About.css';

const teamUnits = [
  { label: 'Owner, Managing Director & CEO', title: 'Shahid Majeed', description: 'Sets strategic direction, strengthens supplier relationships, and maintains the service and quality standards clients expect.' },
  { label: 'Accounts & HR', title: 'Operational control', description: 'Supports financial discipline, internal administration, and the controls that keep day-to-day operations stable and dependable.' },
  { label: 'Sales Department', title: 'Commercial execution', description: 'Manages enquiries, quotations, and account follow-up so requirements are converted into sourcing and procurement decisions.' },
  { label: 'Delivery Team', title: 'Final-mile fulfillment', description: 'Coordinates dispatch and handover so confirmed orders are delivered on time and in the correct condition.' },
  { label: 'IT Department', title: 'Digital operations', description: 'Maintains the website, admin tools, and technical controls that support secure and reliable customer-facing service.' },
  { label: 'Digital Marketing', title: 'Brand & visibility', description: 'Supports LTE\'s digital presence, social channels, and product visibility so customers can discover and stay connected.' },
];

const workflowSteps = [
  { index: '01', title: 'Requirement review', description: 'Requirements are clarified early so product selection, quotations, and delivery expectations are aligned from the outset.' },
  { index: '02', title: 'Supplier evaluation', description: 'Suppliers and products are assessed against quality, availability, documentation, and end-user operating conditions.' },
  { index: '03', title: 'Procurement alignment', description: 'Commercial terms, quantities, lead times, and specifications are consolidated into a decision with clear visibility.' },
  { index: '04', title: 'Delivery coordination', description: 'Inventory handling, dispatch planning, and delivery timing are coordinated before fulfilment moves into execution.' },
];

const About = () => {
  const rootRef = useRef(null);
  const { t } = useLanguage();
  const baseUrl = import.meta.env.BASE_URL;

  useScrollReveal(rootRef);

  return (
    <main className="about-shell" ref={rootRef}>
      <Seo
        title="About Leading Trading Est | Bahrain Medical & Industrial Supply"
        description="Learn about Leading Trading Est, a Bahrain-based medical, dental, industrial, and safety supply business led by Shahid Majeed with a team focused on quality sourcing and dependable delivery."
        canonicalPath="/about"
        keywords="about Leading Trading Est, Shahid Majeed, Leading Trading Est owner, Bahrain medical supplier, healthcare sourcing Bahrain, ROMSONS Bahrain, SMI Bahrain, LTE Bahrain"
        structuredData={[
          organizationSchema,
          localBusinessSchema,
          shahidMajeedSchema,
          buildBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }]),
          buildFaqSchema([
            { question: 'Who owns and leads Leading Trading Est?', answer: 'Leading Trading Est is owned and led by Shahid Majeed, Managing Director and CEO.' },
            { question: 'What does Leading Trading Est supply?', answer: 'LTE supplies medical, dental, laboratory, PPE, safety, and industrial products across Bahrain.' },
          ]),
          { '@context': 'https://schema.org', '@type': 'AboutPage', name: 'About Leading Trading Est', url: 'https://www.lte-bh.com/about', about: { '@id': 'https://www.lte-bh.com/#organization' } },
        ]}
      />

      {/* ── Hero ── */}
      <section className="about-hero animate-stagger" data-stagger-step="110ms">
        <div className="about-hero-copy">
          <span className="about-eyebrow animate-on-scroll">{t('About Leading Trading Est')}</span>
          <h1 className="animate-on-scroll">{t('A Bahrain supply partner built on accountability, quality, and follow-through.')}</h1>
          <p className="animate-on-scroll">
            {t('Since 2012, Leading Trading Est has supported hospitals, clinics, and operational teams across medical, dental, industrial, and safety requirements — with structured sourcing, reliable delivery, and a team that follows through.')}
          </p>
          <div className="about-hero-actions animate-on-scroll">
            <Link className="btn primary" to="/contact">{t('Talk to Our Team')}</Link>
            <Link className="btn" to="/categories">{t('Explore Categories')}</Link>
            <Link className="btn" to="/about/director">{t('Director Heritage')}</Link>
          </div>
        </div>

        <div className="about-hero-panel animate-on-scroll">
          <p className="about-hero-panel-label">{t('Operating since')}</p>
          <strong className="about-hero-year">2012</strong>
          <ul className="about-hero-panel-list">
            <li>{t('Medical, dental & industrial sourcing')}</li>
            <li>{t('NHRA certified supply operations')}</li>
            <li>{t('ROMSONS & SMI sole agent — Bahrain')}</li>
            <li>{t('Medstar own-brand medical supply')}</li>
          </ul>
        </div>
      </section>

      {/* ── Workflow ── */}
      <section className="about-section animate-stagger" data-stagger-step="110ms">
        <div className="about-section-head animate-stagger" data-stagger-step="100ms">
          <span className="about-eyebrow about-eyebrow--ink animate-on-scroll">{t('How we work')}</span>
          <h2 className="animate-on-scroll">{t('A clear workflow from enquiry to delivery.')}</h2>
        </div>
        <div className="about-workflow-grid animate-stagger" data-stagger-step="100ms">
          {workflowSteps.map(step => (
            <article className="about-workflow-card animate-on-scroll" key={step.index}>
              <span className="about-workflow-index">{step.index}</span>
              <h3>{t(step.title)}</h3>
              <p>{t(step.description)}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Medstar ── */}
      <section className="about-section animate-stagger" data-stagger-step="110ms">
        <div className="about-section-head animate-stagger" data-stagger-step="100ms">
          <span className="about-eyebrow about-eyebrow--ink animate-on-scroll">{t('Own brand')}</span>
          <h2 className="animate-on-scroll">{t('Medstar — practical quality backed by LTE.')}</h2>
        </div>
        <div className="about-medstar-card animate-stagger" data-stagger-step="100ms">
          <div className="about-medstar-logo animate-on-scroll">
            <img src={`${baseUrl}Brands/medstar.jpg`} alt="Medstar" loading="lazy" decoding="async" />
          </div>
          <div className="about-medstar-copy animate-on-scroll">
            <p>{t('Medstar is LTE\'s own medical supply brand, developed for recurring healthcare purchasing with products selected for steady availability and dependable day-to-day performance.')}</p>
            <p>{t('For Bahrain buyers, Medstar provides a consistent local option backed by LTE\'s full sourcing, quotation, delivery, and account support workflow.')}</p>
          </div>
        </div>
      </section>

      {/* ── Leadership ── */}
      <section className="about-section animate-stagger" data-stagger-step="110ms">
        <div className="about-section-head animate-stagger" data-stagger-step="100ms">
          <span className="about-eyebrow about-eyebrow--ink animate-on-scroll">{t('Leadership')}</span>
          <h2 className="animate-on-scroll">{t('Directed by Shahid Majeed.')}</h2>
        </div>
        <div className="about-leadership-card animate-stagger" data-stagger-step="100ms">
          <div className="about-leadership-signature animate-on-scroll">
            <span className="about-card-kicker">{t('Managing Director & CEO')}</span>
            <strong>Shahid Majeed</strong>
            <small>{t('Owner of Leading Trading Est')}</small>
            <Link className="about-inline-action" to="/about/director">{t('Read director heritage →')}</Link>
          </div>
          <div className="about-leadership-copy animate-on-scroll">
            <p>{t('The objective has always been clear: build a supply business that customers can rely on when product quality, timing, and service standards matter. That requires disciplined sourcing, careful supplier evaluation, and operational follow-through that matches what has been committed.')}</p>
            <p>{t('Growth has been built on trust, consistency, and a team structure that supports execution from enquiry to delivery. We continue to strengthen international supplier relationships and maintain service standards that remain dependable in practice as well as on paper.')}</p>
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="about-section animate-stagger" data-stagger-step="110ms">
        <div className="about-section-head animate-stagger" data-stagger-step="100ms">
          <span className="about-eyebrow about-eyebrow--ink animate-on-scroll">{t('Our team')}</span>
          <h2 className="animate-on-scroll">{t('A focused team built around commercial, operational, and delivery execution.')}</h2>
        </div>
        <div className="about-team-grid animate-stagger" data-stagger-step="100ms">
          {teamUnits.map(unit => (
            <article className="about-team-card animate-on-scroll" key={unit.label}>
              <span>{t(unit.label)}</span>
              <h3>{t(unit.title)}</h3>
              <p>{t(unit.description)}</p>
            </article>
          ))}
        </div>
      </section>

    </main>
  );
};

export default About;
