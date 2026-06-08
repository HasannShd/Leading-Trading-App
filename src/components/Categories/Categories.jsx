import { useState, useMemo, useEffect, useCallback, useDeferredValue, useRef } from 'react';
import { Link } from 'react-router-dom';
import Card from '../Common/Card';
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
              const categoryKey = (c.slug || c.name || '')
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');

              return (
                <Link
                  key={c._id}
                  to={`/categories/${c.slug || c._id}`}
                  className="categories-card-link animate-on-scroll"
                  aria-label={`${t('Open')} ${categoryName(c.name)}`}
                >
                  <Card className="categories-card">
                    <div className="categories-card-image" data-category={categoryKey}>
                      {c.image ? (
                        <img
                          className={`categories-card-img${categoryKey ? ` categories-card-img--${categoryKey}` : ''}`}
                          src={
                            c.image.startsWith('http')
                              ? c.image
                              : `${import.meta.env.BASE_URL}${c.image.replace(/^\//, '')}`
                          }
                          alt={c.name}
                          loading="lazy"
                        />
                      ) : (
                        <span>{categoryName(c.name)[0]}</span>
                      )}
                    </div>
                    <div className="categories-card-content">
                      <div className="categories-card-topline">
                        <span>{t('Category')}</span>
                        <strong>{t('Open')}</strong>
                      </div>
                      <h3 className="categories-card-title">{categoryName(c.name)}</h3>
                      <p className="categories-card-desc">
                        {categoryDescription(c.description?.trim()) || t('Browse the products available inside this main category.')}
                      </p>
                      {c.children?.length ? (
                        <div className="categories-card-children">
                          {c.children.slice(0, 3).map((child) => (
                            <span key={child._id}>{categoryName(child.name)}</span>
                          ))}
                          {c.children.length > 3 ? <strong>+{c.children.length - 3}</strong> : null}
                        </div>
                      ) : null}
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

export default Categories;
