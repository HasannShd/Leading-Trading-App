import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../Common/Seo';
import { buildBreadcrumbSchema, buildFaqSchema, localBusinessSchema, organizationSchema, shahidMajeedSchema } from '../../utils/seoSchemas';
import { useLanguage } from '../../context/LanguageContext';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import './About.css';

const heritageChapters = [
  {
    period: '1950s',
    title: 'Al Qala\'a and the first police carpentry workshop',
    description:
      'The family history begins at the historic Manama Police Fort, known as Al Qala\'a. During the 1950s, as Bahrain\'s police force modernized under the British advisory administration, Haji Allah Ditta served as a master craftsman tasked with establishing and managing the first carpentry workshop for the force.',
    detail:
      'His work supported early police stations and government quarters with structural woodwork, secure installations, and specialized office furniture. That discipline of practical quality became the first blueprint for the family\'s service legacy in Bahrain.',
  },
  {
    period: '1960s-1970s',
    title: 'Mechanical service, AC, and refrigeration',
    description:
      'As Bahrain grew through the 1960s and 1970s, the country\'s climate and expanding government infrastructure created a new technical demand. Haji Abdul Majeed, son of Haji Allah Ditta, carried the family standard into engineering and maintenance at Al Qala\'a.',
    detail:
      'He helped establish the first AC and refrigeration workshop for the force, brought modern cooling maintenance into the operating framework, and trained early technical apprentices during Bahrain\'s transition toward national independence in 1971.',
  },
  {
    period: 'Present',
    title: 'Shahid Majeed and Leading Trading Est',
    description:
      'Shahid Majeed, son of Haji Abdul Majeed, carries this lineage into the modern corporate sector as Owner, Managing Director, and CEO of Leading Trading Est.',
    detail:
      'The tools have changed from wood and mechanical workshops to supplier networks, compliance, product sourcing, and healthcare procurement. The operating standard remains the same: reliability, accountability, and service to the Kingdom of Bahrain.',
  },
];

const legacyValues = [
  'Three generations connected by institutional service, technical discipline, and practical execution',
  'A family history shaped by Bahrain\'s public infrastructure, from structural workshops to modern supply networks',
  'A leadership standard built around reliability, compliance, and long-term customer trust',
  'A modern LTE operation serving medical, dental, safety, and industrial buyers with the same precision-led mindset',
];

const DirectorHeritagePage = () => {
  const rootRef = useRef(null);
  const { t } = useLanguage();

  useScrollReveal(rootRef);

  return (
    <main className="about-shell director-shell" ref={rootRef}>
      <Seo
        title="Shahid Majeed Director Heritage | Leading Trading Est Bahrain"
        description="Learn about Shahid Majeed, Owner, Managing Director, and CEO of Leading Trading Est, and the family heritage that connects LTE to generations of technical service in Bahrain."
        canonicalPath="/about/director"
        keywords="Shahid Majeed, Leading Trading Est director, Leading Trading Est CEO, LTE Bahrain owner, Bahrain family business, Bahrain medical supplier heritage, Al Qala'a Bahrain, Ministry of Interior Bahrain, NHRA Bahrain supplier"
        structuredData={[
          organizationSchema,
          localBusinessSchema,
          shahidMajeedSchema,
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
            { name: 'Director Heritage', path: '/about/director' },
          ]),
          buildFaqSchema([
            {
              question: 'Who is Shahid Majeed?',
              answer:
                'Shahid Majeed is the Owner, Managing Director, and CEO of Leading Trading Est in Bahrain.',
            },
            {
              question: 'What is the family heritage behind Leading Trading Est?',
              answer:
                'The family heritage connects three generations of service in Bahrain, beginning with Haji Allah Ditta at Al Qala\'a in the 1950s, continuing through Haji Abdul Majeed in AC and refrigeration workshops, and now carried forward by Shahid Majeed through Leading Trading Est.',
            },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'ProfilePage',
            name: 'Shahid Majeed Director Heritage',
            url: 'https://www.lte-bh.com/about/director',
            mainEntity: { '@id': 'https://www.lte-bh.com/#shahid-majeed' },
            about: { '@id': 'https://www.lte-bh.com/#organization' },
          },
        ]}
      />

      <section className="about-hero director-hero">
        <div className="about-hero-copy animate-stagger" data-stagger-step="100ms">
          <Link className="director-back animate-on-scroll" to="/about">{t('About Leading Trading Est')}</Link>
          <span className="about-eyebrow animate-on-scroll">{t('Director heritage')}</span>
          <h1 className="animate-on-scroll">{t('Shahid Majeed, director heritage, and the family roots behind LTE.')}</h1>
          <p className="animate-on-scroll">
            {t('Leading Trading Est carries a family legacy shaped by nearly eighty years of technical service, institutional discipline, and practical execution in the Kingdom of Bahrain. That heritage now guides the company under Shahid Majeed, Owner, Managing Director, and CEO.')}
          </p>
          <div className="about-hero-actions animate-on-scroll">
            <Link className="btn primary" to="/contact">{t('Contact LTE')}</Link>
            <Link className="btn" to="/about">{t('Back to About')}</Link>
          </div>
        </div>

        <div className="about-hero-panel director-profile-panel animate-stagger" data-stagger-step="100ms">
          <span className="about-hero-panel-label animate-on-scroll">{t('Leadership profile')}</span>
          <strong className="animate-on-scroll">Shahid Majeed</strong>
          <p className="animate-on-scroll">
            {t('Owner, Managing Director, and CEO of Leading Trading Est, leading a Bahrain-based operation across medical, dental, safety, and industrial supply.')}
          </p>
          <div className="about-hero-metrics animate-stagger" data-stagger-step="90ms">
            <div className="animate-on-scroll">
              <strong>1950s</strong>
              <span>{t('family service roots at Al Qala\'a')}</span>
            </div>
            <div className="animate-on-scroll">
              <strong>1971</strong>
              <span>{t('Bahrain independence era technical transition')}</span>
            </div>
            <div className="animate-on-scroll">
              <strong>LTE</strong>
              <span>{t('modern healthcare and safety supply')}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="about-story director-intro">
        <div className="about-story-grid animate-stagger" data-stagger-step="110ms">
          <article className="about-story-card about-story-card--lead animate-on-scroll">
            <span className="about-card-kicker">{t('Honoring the roots')}</span>
            <p>
              {t('In the fast-paced world of national enterprise and medical distribution, the foundations of a company matter. Leading Trading Est is built on a proud, multi-generational legacy of institutional service in Bahrain.')}
            </p>
            <p>
              {t('The history begins at Manama Police Fort, where the early Bahrain Police Force was building the technical infrastructure required for self-sufficiency. Skilled master tradesmen from South Asia played an important role in that modernization, and Haji Allah Ditta was among those early pioneers.')}
            </p>
            <p>
              {t('Today, Shahid Majeed channels that same spirit of structural reliability and specialized expertise into medical, dental, safety, and industrial supply across Bahrain.')}
            </p>
          </article>

          <article className="about-story-card about-story-card--pillars animate-on-scroll">
            <span className="about-card-kicker">{t('Lineage of trust')}</span>
            <ul className="about-pillar-list">
              {legacyValues.map((value) => (
                <li key={value}>{t(value)}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="about-workflow director-timeline">
        <div className="about-section-heading animate-stagger" data-stagger-step="100ms">
          <span className="about-eyebrow animate-on-scroll">{t('Family history')}</span>
          <h2 className="animate-on-scroll">{t('From Al Qala\'a workshops to modern medical and safety supply networks.')}</h2>
        </div>

        <div className="director-timeline-grid animate-stagger" data-stagger-step="110ms">
          {heritageChapters.map((chapter, index) => (
            <article className="about-workflow-card director-timeline-card animate-on-scroll" key={chapter.period}>
              <span className="about-workflow-index">{`0${index + 1}`}</span>
              <small>{t(chapter.period)}</small>
              <h3>{t(chapter.title)}</h3>
              <p>{t(chapter.description)}</p>
              <p>{t(chapter.detail)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-leadership director-values">
        <div className="about-leadership-card animate-stagger" data-stagger-step="100ms">
          <div className="about-leadership-signature animate-on-scroll">
            <span className="about-card-kicker">{t('The blueprint of values')}</span>
            <strong>{t('Wood and wrenches to advanced medical technology')}</strong>
            <small>{t('Innovation changes across generations, but foundational values do not.')}</small>
          </div>

          <div className="about-leadership-copy animate-on-scroll">
            <p>
              {t('LTE moved from a family background of physical institutional engineering into a modern corporate structure built around global supply networks, healthcare procurement, and compliance-led service.')}
            </p>
            <p>
              {t('By meeting professional expectations across NHRA-related healthcare supply requirements and Ministry of Industry and Commerce business standards, the company continues to protect the reliability and precision that shaped the family legacy nearly a century ago.')}
            </p>
            <p>
              {t('The past guides the company\'s precision today: disciplined work, technical respect, service to Bahrain, and a direct commitment to dependable execution.')}
            </p>
            <Link className="about-inline-action" to="/contact">{t('Discuss a requirement with LTE')}</Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DirectorHeritagePage;
