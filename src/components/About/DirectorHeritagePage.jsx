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
    title: 'Al Qala\'a and the first carpentry workshop',
    body: 'The family history begins at the historic Manama Police Fort. During the 1950s, as Bahrain\'s police force modernized under the British advisory administration, Haji Allah Ditta served as a master craftsman establishing and managing the first carpentry workshop for the force — providing the structural woodwork, secure installations, and specialized furniture that defined early institutional discipline.',
  },
  {
    period: '1960s – 1970s',
    title: 'Mechanical service, AC, and refrigeration',
    body: 'Haji Abdul Majeed, son of Haji Allah Ditta, carried the family standard into engineering and maintenance at Al Qala\'a. He helped establish the first AC and refrigeration workshop for the force, brought modern cooling maintenance into the operating framework, and trained early technical apprentices during Bahrain\'s transition toward national independence in 1971.',
  },
  {
    period: 'Present',
    title: 'Shahid Majeed and Leading Trading Est',
    body: 'Shahid Majeed, son of Haji Abdul Majeed, carries this lineage into the modern corporate sector as Owner, Managing Director, and CEO of Leading Trading Est. The tools have changed — from wood and mechanical workshops to supplier networks, compliance, and healthcare procurement — but the operating standard remains the same: reliability, accountability, and service to Bahrain.',
  },
];

const DirectorHeritagePage = () => {
  const rootRef = useRef(null);
  const { t } = useLanguage();

  useScrollReveal(rootRef);

  return (
    <main className="about-shell director-shell" ref={rootRef}>
      <Seo
        title="Shahid Majeed Director Heritage | Leading Trading Est Bahrain"
        description="Learn about Shahid Majeed, Owner, Managing Director, and CEO of Leading Trading Est, and the family heritage connecting LTE to generations of institutional service in Bahrain."
        canonicalPath="/about/director"
        keywords="Shahid Majeed, Leading Trading Est director, LTE Bahrain owner, Bahrain family business, Al Qala'a Bahrain, heritage Bahrain"
        structuredData={[
          organizationSchema, localBusinessSchema, shahidMajeedSchema,
          buildBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }, { name: 'Director Heritage', path: '/about/director' }]),
          buildFaqSchema([
            { question: 'Who is Shahid Majeed?', answer: 'Shahid Majeed is the Owner, Managing Director, and CEO of Leading Trading Est in Bahrain.' },
            { question: 'What is the family heritage behind Leading Trading Est?', answer: 'Three generations of institutional service in Bahrain — beginning at Al Qala\'a in the 1950s and carried forward by Shahid Majeed through Leading Trading Est.' },
          ]),
          { '@context': 'https://schema.org', '@type': 'ProfilePage', name: 'Shahid Majeed Director Heritage', url: 'https://www.lte-bh.com/about/director', mainEntity: { '@id': 'https://www.lte-bh.com/#shahid-majeed' } },
        ]}
      />

      {/* ── Hero ── */}
      <section className="director-hero animate-stagger" data-stagger-step="110ms">
        <Link className="director-back animate-on-scroll" to="/about">← {t('About Leading Trading Est')}</Link>
        <span className="about-eyebrow animate-on-scroll">{t('Director Heritage')}</span>
        <h1 className="animate-on-scroll">{t('Three generations of institutional service in Bahrain.')}</h1>
        <p className="director-hero-lead animate-on-scroll">
          {t('Leading Trading Est carries a family legacy shaped by nearly eighty years of technical discipline and public service in the Kingdom of Bahrain — from the carpentry workshops of Al Qala\'a to modern healthcare and industrial supply.')}
        </p>
        <div className="about-hero-actions animate-on-scroll">
          <Link className="btn primary" to="/contact">{t('Contact LTE')}</Link>
          <Link className="btn" to="/about">{t('Back to About')}</Link>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="about-section animate-stagger" data-stagger-step="110ms">
        <div className="about-section-head animate-stagger" data-stagger-step="100ms">
          <span className="about-eyebrow about-eyebrow--ink animate-on-scroll">{t('Family history')}</span>
          <h2 className="animate-on-scroll">{t('From Al Qala\'a workshops to modern supply networks.')}</h2>
        </div>
        <div className="director-timeline animate-stagger" data-stagger-step="120ms">
          {heritageChapters.map((chapter, i) => (
            <article className="director-chapter animate-on-scroll" key={chapter.period}>
              <div className="director-chapter-marker">
                <span className="director-chapter-num">0{i + 1}</span>
                <div className="director-chapter-line" />
              </div>
              <div className="director-chapter-body">
                <span className="director-chapter-period">{t(chapter.period)}</span>
                <h3>{t(chapter.title)}</h3>
                <p>{t(chapter.body)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Values statement ── */}
      <section className="about-section animate-stagger" data-stagger-step="110ms">
        <div className="director-values-card animate-stagger" data-stagger-step="100ms">
          <div className="director-values-left animate-on-scroll">
            <span className="about-card-kicker">{t('The same standard')}</span>
            <strong>{t('Disciplined work. Technical respect. Service to Bahrain.')}</strong>
          </div>
          <div className="director-values-right animate-on-scroll">
            <p>{t('LTE moved from a family background of physical institutional engineering into a modern corporate structure built around global supply networks, healthcare procurement, and compliance-led service.')}</p>
            <p>{t('By meeting professional expectations across NHRA healthcare supply requirements and Ministry of Industry and Commerce business standards, the company continues to protect the reliability and precision that shaped the family legacy nearly a century ago.')}</p>
            <Link className="about-inline-action" to="/contact">{t('Discuss a requirement with LTE →')}</Link>
          </div>
        </div>
      </section>

    </main>
  );
};

export default DirectorHeritagePage;
