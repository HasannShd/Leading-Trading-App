import { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../Common/Seo';
import { buildFaqSchema, businessApplicationSchema, localBusinessSchema, organizationSchema, webSiteSchema } from '../../utils/seoSchemas';
import { useLanguage } from '../../context/LanguageContext';
import { useHomepageScroll } from './useHomepageScroll';
import './Homepage.css';

const homepageCategories = [
  {
    name: 'Medical Equipment',
    slug: 'medical-equipment',
    icon: '+',
    label: 'Clinical systems',
    description: 'Diagnostic and treatment support equipment for hospitals, clinics, and operational care environments.',
  },
  {
    name: 'Anesthesia & Respiratory',
    slug: 'anesthesia-respiratory',
    icon: '▲',
    label: 'Airway and respiratory care',
    description: 'Products selected for respiratory support, airway control, and procedure-critical environments.',
  },
  {
    name: 'Dental',
    slug: 'dental',
    icon: '◆',
    label: 'Practice continuity',
    description: 'Dental consumables and specialist tools that keep practices supplied without disrupting workflow.',
  },
  {
    name: 'Consumables & Disposables',
    slug: 'consumables-disposables',
    icon: '●',
    label: 'Recurring essentials',
    description: 'High-rotation products that support daily care, infection control, and procedure readiness.',
  },
  {
    name: 'Industrial & Safety',
    slug: 'industrial-safety',
    icon: '◉',
    label: 'Operational protection',
    description: 'Industrial and safety sourcing for disciplined operations where reliability and availability matter.',
  },
  {
    name: 'Hospital Furniture & Utilities',
    slug: 'hospital-furniture-utilities',
    icon: '⌂',
    label: 'Facility support',
    description: 'Furniture, transport, and utility items that support day-to-day movement, care, and storage.',
  },
];

const valuePillars = [
  {
    title: 'Vendor Relations',
    body: 'Supplier relationships are developed around continuity, access, and dependable repeat supply rather than short-term opportunistic buying.',
    detail: 'Established manufacturer and vendor network',
  },
  {
    title: 'Quality Assurance',
    body: 'Product suitability, documentation, and specification control are reviewed before quotation and fulfillment decisions are made.',
    detail: 'Specification and documentation discipline',
  },
  {
    title: 'Logistics',
    body: 'Orders move through a structured path with inventory awareness, delivery coordination, and clearer visibility on timing.',
    detail: 'Inventory and delivery coordination',
  },
  {
    title: 'Customer Commitment',
    body: 'Sales, accounts, and delivery remain aligned so customer support continues beyond quotation and procurement.',
    detail: 'Commercial follow-through and local support',
  },
];

const workflowSteps = [
  {
    title: 'Inquiry',
    body: 'Requirements are clarified at the outset so product selection, pricing, and delivery expectations are aligned from the beginning.',
  },
  {
    title: 'Sourcing',
    body: 'Suitable suppliers are shortlisted against quality, availability, compliance, and the operational demands of the end user.',
  },
  {
    title: 'Procurement',
    body: 'Commercial terms, documentation, and product details are consolidated into a clear procurement decision with fewer uncertainties.',
  },
  {
    title: 'Logistics',
    body: 'Lead times, inventory handling, and delivery coordination are planned before the order moves into execution.',
  },
  {
    title: 'Delivery & Support',
    body: 'Orders are completed with reliable handover, responsive support, and readiness for repeat demand when required.',
  },
];

const sectors = [
  {
    key: 'medical',
    eyebrow: 'Medical solutions',
    title: 'Supporting hospitals, clinics, and practices where continuity of care depends on supply reliability.',
    body: 'LTE supports regulated medical environments with disciplined sourcing, dependable availability, and close attention to product suitability, timing, and documentation.',
    points: ['Hospitals and specialist centers', 'Clinics and outpatient facilities', 'Routine and urgent replenishment'],
    image: 'Stethescope.webp',
    visualTitle: 'Medical procurement with operational discipline',
    visualBody: 'Clinical supply decisions require more than stock visibility. They depend on specification fit, supplier confidence, and dependable execution.',
  },
  {
    key: 'industrial',
    eyebrow: 'Industrial solutions',
    title: 'Supporting industrial and safety teams that need structured supply, not fragmented vendor follow-up.',
    body: 'The same disciplined workflow extends into industrial and safety sourcing, giving buyers a more dependable path from request to delivery.',
    points: ['Safety and utility products', 'Operational supply continuity', 'Consistent delivery planning'],
    image: 'industrial.png',
    visualTitle: 'Industrial continuity backed by reliable coordination',
    visualBody: 'Operational teams need dependable product flow, practical coordination, and local follow-through that supports day-to-day performance.',
  },
];


const credibilityPillars = [
  {
    title: 'Commercial ownership',
    body: 'Every enquiry is handled through a coordinated path between leadership, sales, accounts, and delivery instead of fragmented follow-up.',
  },
  {
    title: 'Quality discipline',
    body: 'Supplier review, documentation checks, specification fit, and delivery planning remain part of the decision process before orders move forward.',
  },
];

const mainBrands = [
  { name: 'Medstar', logo: 'Brands/medstar.jpg' },
  { name: 'Rogin', logo: 'Brands/rogin.png' },
  { name: 'SMI', logo: 'Brands/Smi.png' },
  { name: 'ROMSONS', logo: 'Brands/romsons.png' },
  { name: 'Hermann Meditech', logo: 'Brands/Hermann.png' },
  { name: 'Zogear', logo: 'Brands/Zogear.png' },
  { name: 'ADC', logo: 'Brands/adc.png' },
  { name: 'Osseous', logo: 'Brands/osseous.png' },
  { name: 'Berger', logo: 'Brands/berger.jpg' },
  { name: 'Bastos-Viegas', logo: 'Brands/bastosviegas.webp' },
];

const clients = [
  { name: 'Ministry of Health', logo: 'clients/ministry.jpg' },
  { name: 'King Hamad University Hospital', logo: 'clients/khuh.png' },
  { name: 'Bapco', logo: 'clients/bapco.jpg' },
  { name: 'Bahrain Defence Force', logo: 'clients/bdf.png' },
  { name: 'Royal Specialized Center', logo: 'clients/rsci.png' },
  { name: 'American Mission', logo: 'clients/american mission.png' },
  { name: 'Aster', logo: 'clients/aster.jpg' },
  { name: 'Al Salam', logo: 'clients/al salam.jpg' },
  { name: 'Al Rayan', logo: 'clients/al rayan.jpg' },
  { name: 'Shifa Al Jazeera', logo: 'clients/shifa al jazeera.jpg' },
];

const HomePage = () => {
  const baseUrl = import.meta.env.BASE_URL;
  const { t, categoryName } = useLanguage();
  const rootRef = useRef(null);
  useHomepageScroll(rootRef, true);

  const marqueeBrands = useMemo(() => [...mainBrands, ...mainBrands], []);
  const marqueeClients = useMemo(() => [...clients, ...clients], []);

  return (
    <main className="cinematic-home" ref={rootRef}>
      <Seo
        title="Leading Trading Est | Bahrain Medical & Industrial Supplies"
        description="Leading Trading Est is an NHRA approved and certified Bahrain supplier for medical, dental, laboratory, PPE, safety, and industrial supply enquiries, quotation support, and procurement coordination."
        canonicalPath="/"
        keywords="Leading Trading Est, Leading Trading Est Bahrain, medical suppliers in Bahrain, Bahrain medical supplier, Leading Trading Est owner, Shahid Majeed, LTE Bahrain, Medstar Bahrain, Medstar medical supplies, ROMSONS Bahrain, SMI Bahrain, medical distributors Bahrain, medical supplies Bahrain, dental supplies Bahrain, laboratory equipment Bahrain, industrial supplies Bahrain, safety supplies Bahrain, hospital supplies Bahrain, Bahrain procurement"
        structuredData={[
          organizationSchema,
          localBusinessSchema,
          businessApplicationSchema,
          webSiteSchema,
          buildFaqSchema([
            {
              question: 'What is the purpose of the Leading Trading Est website and app?',
              answer:
                'Leading Trading Est helps Bahrain buyers send supply enquiries and helps authorized staff and admins manage business operations including catalog workflows, orders, clients, attendance, messages, notifications, and backup coordination.',
            },
            {
              question: 'Who owns and leads Leading Trading Est?',
              answer:
                'Leading Trading Est is owned and led by Shahid Majeed, Managing Director and CEO of the company in Bahrain.',
            },
            {
              question: 'Is Leading Trading Est NHRA approved?',
              answer:
                'Leading Trading Est is an NHRA approved and certified company supporting regulated medical supply requirements and procurement enquiries in Bahrain.',
            },
            {
              question: 'Does Leading Trading Est supply medical products in Bahrain?',
              answer:
                'Leading Trading Est supports Bahrain clinics, hospitals, dental centers, laboratories, and industrial buyers with medical, dental, laboratory, safety, and industrial supply enquiries.',
            },
          ]),
        ]}
      />
      <section className="home-hero">
        <div className="home-hero__ambient" />
        <div className="home-hero__depth" aria-hidden="true" data-hero-parallax="bg" />
        <div className="home-shell home-hero__layout">
          <div className="home-hero__editorial">
            <div className="home-hero__copy animate-stagger" data-stagger-step="120ms">
              <span className="home-eyebrow animate-on-scroll">{t('Leading Trading Est. | Bahrain')}</span>
              <h1 className="animate-on-scroll">Medical, Dental <em>&amp;</em> Industrial Supply.</h1>
              <p className="home-hero__lead animate-on-scroll">
                {t('Local sourcing for medical, dental, laboratory, PPE, safety, and industrial requirements — structured quotation support and dependable delivery coordination across Bahrain.')}
              </p>
              <div className="home-hero__actions animate-on-scroll">
                <Link className="home-btn home-btn--primary" to="/contact?source=home">→ {t('Request a Quote')}</Link>
                <Link className="home-btn home-btn--ghost" to="/categories">{t('Explore Categories')}</Link>
              </div>
              <div className="home-hero__cats animate-on-scroll">
                {homepageCategories.map((cat) => (
                  <Link key={cat.slug} className="home-hero__cat-chip" to={`/categories/${cat.slug}`}>
                    <span className="home-hero__cat-icon" aria-hidden="true">{cat.icon}</span>
                    {categoryName(cat.name)}
                  </Link>
                ))}
              </div>
              <div className="home-hero__since animate-on-scroll">
                <div className="home-hero__since-block">
                  <span className="home-hero__since-num">2012</span>
                  <span className="home-hero__since-label">{t('Since')}</span>
                </div>
                <div className="home-hero__since-divider" />
                <div className="home-hero__since-cert">
                  <span className="home-hero__since-cert-v">
                    <span className="home-hero__cert-dot" />
                    {t('NHRA Certified')}
                  </span>
                  <span className="home-hero__since-cert-l">{t('National Health Regulatory Authority — Bahrain')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section business-model">
        <div className="home-shell">
          <div className="section-heading animate-stagger" data-stagger-step="110ms">
            <span className="home-eyebrow home-eyebrow--ink animate-on-scroll">{t('How LTE creates value')}</span>
            <h2 className="animate-on-scroll">{t('Our business model combines supplier access, quality review, logistics planning, and customer follow-through.')}</h2>
            <p className="animate-on-scroll">
              {t('LTE is structured to support procurement decisions with better supplier visibility, clearer specification control, coordinated logistics, and responsive account management.')}
            </p>
          </div>

          <div className="pillar-grid animate-stagger" data-stagger-step="120ms">
            {valuePillars.map((pillar, index) => (
              <article className="pillar-card animate-on-scroll" key={pillar.title}>
                <span className="pillar-card__index">{`0${index + 1}`}</span>
                <h3>{t(pillar.title)}</h3>
                <p>{t(pillar.body)}</p>
                <strong>{t(pillar.detail)}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section workflow-stage">
        <div className="home-shell workflow-stage__grid">
          <div className="workflow-stage__intro animate-stagger" data-stagger-step="110ms">
            <span className="home-eyebrow home-eyebrow--ink animate-on-scroll">{t('Workflow')}</span>
            <h2 className="animate-on-scroll">{t('A clear operating workflow supports every enquiry, quotation, procurement decision, and delivery commitment.')}</h2>
            <p className="animate-on-scroll">
              {t('Each requirement moves through review, sourcing, procurement alignment, logistics coordination, and delivery support so the customer receives a more dependable service path.')}
            </p>
            <div className="workflow-stage__line">
              <span className="workflow-stage__line-fill" />
            </div>
          </div>

          <div className="workflow-stage__steps animate-stagger" data-stagger-step="140ms">
            {workflowSteps.map((step, index) => (
              <article className="workflow-step animate-on-scroll" key={step.title}>
                <span className="workflow-step__index">{`0${index + 1}`}</span>
                <div>
                  <h3>{t(step.title)}</h3>
                  <p>{t(step.body)}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section sector-sequence">
        <div className="home-shell">
          <div className="section-heading animate-stagger" data-stagger-step="110ms">
            <span className="home-eyebrow home-eyebrow--ink animate-on-scroll">{t('Sector focus')}</span>
            <h2 className="animate-on-scroll">{t('One operating model supporting two sectors with different technical needs but the same requirement for dependable execution.')}</h2>
            <p className="animate-on-scroll">
              {t('LTE serves medical and industrial buyers through the same standards of supplier assessment, quality review, logistics coordination, and local customer support.')}
            </p>
          </div>

          <div className="sector-sequence__list">
            {sectors.map((sector, index) => (
              <article
                className={`sector-shot sector-shot--${sector.key}${index % 2 ? ' sector-shot--reverse' : ''} animate-stagger`}
                data-stagger-step="120ms"
                key={sector.key}
              >
                <div className="sector-shot__copy animate-on-scroll">
                  <span className="home-eyebrow home-eyebrow--ink">{t(sector.eyebrow)}</span>
                  <h2>{t(sector.title)}</h2>
                  <p>{t(sector.body)}</p>
                  <ul>
                    {sector.points.map((point) => (
                      <li key={point}>{t(point)}</li>
                    ))}
                  </ul>
                </div>

                <div className="sector-shot__visual animate-on-scroll" data-parallax={sector.key === 'medical' ? 'soft' : 'lift'}>
                  <div className="sector-shot__frame">
                    <div className="sector-shot__frame-copy">
                      <span>{t(sector.eyebrow)}</span>
                      <strong>{t(sector.visualTitle)}</strong>
                      <p>{t(sector.visualBody)}</p>
                    </div>
                    <div className="sector-shot__media">
                      <img src={`${baseUrl}${sector.image}`} alt={sector.eyebrow} loading="lazy" decoding="async" />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section trust-stage">
        <div className="home-shell">
          <div className="section-heading animate-stagger" data-stagger-step="110ms">
            <span className="home-eyebrow home-eyebrow--ink animate-on-scroll">{t('Trusted brands and institutions')}</span>
            <h2 className="animate-on-scroll">{t('Our supplier network and institutional customer base reflect the standards we are expected to maintain.')}</h2>
            <p className="animate-on-scroll">
              {t('LTE works with selected manufacturers and supports institutions that require reliability, product quality, and professional service standards.')}
            </p>
          </div>

          <div className="trust-stage__copy animate-on-scroll">
            <p>
              {t('Our relationships with established brands, international suppliers, distributors, and respected institutions demonstrate the level of trust placed in our sourcing, coordination, and delivery performance. LTE also supports dedicated brand representation, including sole-agent support for ROMSONS and SMI in Bahrain.')}
            </p>
          </div>

          <div className="medstar-spotlight animate-stagger" data-stagger-step="100ms">
            <div className="medstar-spotlight__brand animate-on-scroll">
              <img src={`${baseUrl}Brands/medstar.jpg`} alt="Medstar" loading="lazy" decoding="async" />
            </div>

            <div className="medstar-spotlight__copy animate-on-scroll">
              <span className="home-eyebrow home-eyebrow--ink">{t('Our own brand')}</span>
              <h3>{t('Medstar is LTE’s own trusted medical supply brand, built around consistency, practical quality, and dependable market confidence.')}</h3>
              <p>
                {t('Medstar supports day-to-day clinical purchasing with products selected for routine healthcare use, repeat procurement, and the service expectations of Bahrain medical and dental buyers.')}
              </p>
            </div>

            <div className="medstar-spotlight__points animate-stagger" data-stagger-step="80ms">
              {[
                'LTE-owned brand with local accountability',
                'Recognized by buyers for dependable routine supply',
                'Supported by LTE supplier access, brand relationships, and delivery workflow',
              ].map((point) => (
                <span className="animate-on-scroll" key={point}>{t(point)}</span>
              ))}
            </div>
          </div>

          <div className="logo-marquee animate-on-scroll">
            <div className="logo-marquee__track">
              {marqueeBrands.map((brand, index) => (
                <div className={`logo-chip logo-chip--brand logo-chip--${brand.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} key={`${brand.name}-${index}`}>
                  <img src={`${baseUrl}${brand.logo}`} alt={brand.name} loading="lazy" decoding="async" />
                </div>
              ))}
            </div>
          </div>

          <div className="logo-marquee logo-marquee--reverse animate-on-scroll">
            <div className="logo-marquee__track">
              {marqueeClients.map((client, index) => (
                <div className={`logo-chip logo-chip--client logo-chip--${client.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} key={`${client.name}-${index}`}>
                  <img src={`${baseUrl}${client.logo}`} alt={client.name} loading="lazy" decoding="async" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      <section className="home-section why-lte-editorial">
        <div className="home-shell">
          <div className="why-lte-editorial__card animate-stagger" data-stagger-step="110ms">
            <div className="why-lte-editorial__year animate-on-scroll">
              <span className="why-lte-editorial__year-num">2012</span>
              <span className="why-lte-editorial__year-sub">{t('Est. Bahrain')}</span>
            </div>
            <div className="why-lte-editorial__statement animate-on-scroll">
              <span className="home-eyebrow home-eyebrow--ink">{t('Why LTE')}</span>
              <h2>{t('A Bahrain supply partner structured for accountability, quality control, and follow-through from enquiry to delivery.')}</h2>
              <p>{t("Led by Shahid Majeed, LTE operates with coordinated teams across sourcing, accounts, logistics, and delivery — so support doesn't end at the quotation stage.")}</p>
            </div>
          </div>

          <div className="why-lte-editorial__pillars animate-stagger" data-stagger-step="120ms">
            {credibilityPillars.map((pillar, i) => (
              <article className="why-lte-pillar animate-on-scroll" key={pillar.title}>
                <span className="why-lte-pillar__index">{`0${i + 1}`}</span>
                <h3>{t(pillar.title)}</h3>
                <p>{t(pillar.body)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section final-cta-centered">
        <div className="home-shell">
          <div className="final-cta-centered__panel animate-stagger" data-stagger-step="110ms">
            <div className="final-cta-centered__eyebrow animate-on-scroll">
              <span className="final-cta-centered__rule" />
              <span>{t('Next Step')}</span>
              <span className="final-cta-centered__rule" />
            </div>
            <h2 className="animate-on-scroll">{t('Ready to source with a partner that follows through?')}</h2>
            <p className="animate-on-scroll">
              {t('Send a requirement, request a catalog reference, or contact the LTE team for availability, quotation support, and delivery coordination across Bahrain.')}
            </p>
            <div className="final-cta-centered__actions animate-stagger" data-stagger-step="100ms">
              <Link className="home-btn home-btn--primary animate-on-scroll" to="/contact?source=home">{t('Request a Quote')}</Link>
              <Link className="home-btn home-btn--ghost-light animate-on-scroll" to="/categories">{t('Explore Categories')}</Link>
              <Link className="home-btn home-btn--ghost-light animate-on-scroll" to="/catalog">{t('Open Catalog')}</Link>
            </div>
            <div className="final-cta-centered__trust animate-on-scroll">
              <span>{t('NHRA Certified')}</span>
              <span>{t('Since 2012')}</span>
              <span>{t('Bahrain-Based')}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
