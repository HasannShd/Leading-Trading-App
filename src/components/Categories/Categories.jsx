import { useState, useMemo, useEffect, useCallback, useDeferredValue, useRef } from 'react';
import { Link } from 'react-router-dom';
import Input from '../Common/Input';
import StatePanel from '../Common/StatePanel';
import Seo from '../Common/Seo';
import { buildBreadcrumbSchema, buildCollectionSchema } from '../../utils/seoSchemas';
import { useLanguage } from '../../context/LanguageContext';
import { asCategoryArray, buildCategoryTree } from '../../utils/categoryTree';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import './Categories.css';

const Categories = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const { t, categoryName, categoryDescription } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const rootRef = useRef(null);

  const deferredQuery = useDeferredValue(q);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/categories`);
      const data = await response.json();
      setCategories(asCategoryArray(data));
    } catch {
      setError('We could not load the category catalog right now.');
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useScrollReveal(rootRef);

  const list = useMemo(() => {
    const s = deferredQuery.toLowerCase().trim();
    const tree = buildCategoryTree(categories);
    return s
      ? tree.filter((parent) =>
          parent.name.toLowerCase().includes(s) ||
          categoryName(parent.name).toLowerCase().includes(s) ||
          (parent.description || '').toLowerCase().includes(s) ||
          (categoryDescription(parent.description || '') || '').toLowerCase().includes(s) ||
          parent.children.some((child) =>
            child.name.toLowerCase().includes(s) ||
            categoryName(child.name).toLowerCase().includes(s) ||
            (child.description || '').toLowerCase().includes(s)
          )
        )
      : tree;
  }, [deferredQuery, categories, categoryName, categoryDescription]);

  return (
    <main>
      <Seo
        title="Medical, Dental & Industrial Supply Categories Bahrain | LTE"
        description="Explore Leading Trading Est categories for medical equipment, laboratory, CSSD, surgical instruments, dental, disposables, and industrial safety sourcing in Bahrain."
        canonicalPath="/categories"
        keywords="medical equipment categories Bahrain, dental supply categories Bahrain, laboratory supplies Bahrain, surgical instruments Bahrain, disposable medical supplies Bahrain, industrial safety supplies Bahrain"
        structuredData={[
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Categories', path: '/categories' },
          ]),
          buildCollectionSchema({
            name: 'Medical, Dental and Industrial Supply Categories',
            description: 'Browse LTE Bahrain supply categories for healthcare, dental, laboratory, CSSD, disposables, and industrial safety procurement.',
            path: '/categories',
            items: categories.map((category) => ({
              name: category.name,
              path: `/categories/${category.slug || category._id}`,
            })),
          }),
        ]}
      />
      <section className="categories-shell" ref={rootRef}>

        {/* ── Hero ── */}
        <section className="categories-hero animate-stagger" data-stagger-step="110ms">
          <div className="categories-hero-copy animate-stagger" data-stagger-step="110ms">
            <span className="categories-eyebrow animate-on-scroll">{t('Our Categories')}</span>
            <h1 className="categories-title animate-on-scroll">{t("Browse LTE's medical, dental, and industrial categories.")}</h1>
            <p className="categories-subtitle animate-on-scroll">
              {t('Open a main category to browse the products available inside that operating group.')}
            </p>
          </div>
          <div className="categories-hero-search animate-on-scroll">
            <Input
              className="categories-search"
              placeholder={t('Search categories, departments, or supply types')}
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            {!loading && (
              <div className="categories-hero-meta">
                <span><strong>{categories.length}</strong> {t('categories')}</span>
                {q.trim() && <span><strong>{list.length}</strong> {t('matched')}</span>}
              </div>
            )}
          </div>
        </section>

        {loading ? (
          <StatePanel
            eyebrow={t('Loading')}
            title={t('Preparing the category catalog')}
            description={t("We're pulling the current category structure and matching assets.")}
            variant="loading"
          />
        ) : error ? (
          <StatePanel
            eyebrow={t('Unavailable')}
            title={t('Category catalog not available')}
            description={t(error)}
            variant="error"
            action={<button className="btn primary" onClick={fetchCategories}>{t('Try Again')}</button>}
          />
        ) : list.length === 0 ? (
          <StatePanel
            eyebrow={t('No Match')}
            title={t('No categories match that search')}
            description={q.trim()
              ? `${t('Nothing matched')} "${q.trim()}". ${t('Try a broader term or browse the full catalog.')}`
              : t('No categories are available yet.')}
            action={q.trim() ? <button className="btn" onClick={() => setQ('')}>{t('Clear Search')}</button> : null}
          />
        ) : (
          <div className="categories-grid animate-stagger" data-stagger-step="80ms">
            {list.map((c) => {
              return (
                <Link
                  key={c._id}
                  to={`/categories/${c.slug || c._id}`}
                  className="categories-card-link animate-on-scroll"
                  aria-label={`${t('Open')} ${categoryName(c.name)}`}
                >
                  <article className="categories-tile">
                    {c.image ? (
                      <img
                        className="categories-tile__img"
                        src={
                          c.image.startsWith('http')
                            ? c.image
                            : `${import.meta.env.BASE_URL}${c.image.replace(/^\//, '')}`
                        }
                        alt={categoryName(c.name)}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="categories-tile__fallback">
                        <span>{categoryName(c.name)[0]}</span>
                      </div>
                    )}
                    <div className="categories-tile__overlay" aria-hidden="true" />
                    <div className="categories-tile__content">
                      <span className="categories-tile__kicker">{t('Category')}</span>
                      <h3 className="categories-tile__title">{categoryName(c.name)}</h3>
                      {c.children?.length ? (
                        <div className="categories-tile__subs">
                          {c.children.slice(0, 3).map((child) => (
                            <span key={child._id}>{categoryName(child.name)}</span>
                          ))}
                          {c.children.length > 3 ? <strong>+{c.children.length - 3}</strong> : null}
                        </div>
                      ) : null}
                      <span className="categories-tile__open">{t('Open')} →</span>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
        <section className="categories-guides animate-stagger" data-stagger-step="80ms">
          <span className="categories-eyebrow animate-on-scroll">{t('Supply Guides')}</span>
          <h2 className="animate-on-scroll">{t('Bahrain procurement guides by supply type')}</h2>
          <div className="categories-guides-grid">
            {[
              { label: t('Medical Equipment Supplier Bahrain'), to: '/solutions/medical-equipment-supplier-bahrain' },
              { label: t('Dental Supplies Bahrain'), to: '/solutions/dental-supplies-bahrain' },
              { label: t('Laboratory Equipment Bahrain'), to: '/solutions/laboratory-equipment-supplier-bahrain' },
              { label: t('PPE Supplier Bahrain'), to: '/solutions/ppe-supplier-bahrain' },
              { label: t('Gloves Bahrain'), to: '/solutions/gloves-bahrain' },
              { label: t('Face Masks Bahrain'), to: '/solutions/face-masks-bahrain' },
              { label: t('Sutures Bahrain'), to: '/solutions/sutures-bahrain' },
              { label: t('Surgical Instruments Bahrain'), to: '/solutions/surgical-instruments-bahrain' },
              { label: t('Anesthesia & Respiratory Bahrain'), to: '/solutions/anesthesia-respiratory-bahrain' },
              { label: t('Orthopedic Supplies Bahrain'), to: '/solutions/orthopedic-supplies-bahrain' },
              { label: t('Industrial Safety Supplies Bahrain'), to: '/solutions/industrial-safety-supplies-bahrain' },
              { label: t('Disposable Consumables Bahrain'), to: '/solutions/disposable-consumables-bahrain' },
            ].map((g) => (
              <Link key={g.to} to={g.to} className="categories-guide-chip animate-on-scroll">
                {g.label} →
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
};

export default Categories;
