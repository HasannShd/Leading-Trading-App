import { useEffect, useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiBookOpen, FiFileText, FiFilter, FiX } from 'react-icons/fi';
import Seo from '../Common/Seo';
import StatePanel from '../Common/StatePanel';
import {
  buildBreadcrumbSchema,
  buildCollectionSchema,
  buildFaqSchema,
  localBusinessSchema,
  organizationSchema,
} from '../../utils/seoSchemas';
import { normalizeImageSrc } from '../../utils/normalizeImageSrc';
import { buildProductPath } from '../../utils/productUrls';
import { useLanguage } from '../../context/LanguageContext';
import './CatalogPage.css';

const CatalogPage = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const { t, categoryName, categoryDescription } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadCatalog = async () => {
      setLoading(true);
      setError('');
      try {
        const [categoryResponse, productResponse] = await Promise.all([
          fetch(`${API_URL}/categories`, { signal: controller.signal, cache: 'no-store' }),
          fetch(`${API_URL}/products?limit=120`, { signal: controller.signal, cache: 'no-store' }),
        ]);
        const [categoryData, productData] = await Promise.all([
          categoryResponse.json(),
          productResponse.json(),
        ]);

        if (!categoryResponse.ok || !productResponse.ok) {
          throw new Error('Catalog could not be loaded.');
        }

        setCategories(Array.isArray(categoryData) ? categoryData : []);
        setProducts(Array.isArray(productData) ? productData : productData.items || []);
      } catch (err) {
        if (err.name !== 'AbortError') setError(t('Catalog could not be loaded right now.'));
      } finally {
        setLoading(false);
      }
    };

    loadCatalog();
    return () => controller.abort();
  }, [API_URL, t]);

  const topCategories = useMemo(
    () => categories.filter((c) => !c.parent).slice(0, 12),
    [categories]
  );

  const groupedProducts = useMemo(() => {
    const groups = new Map();
    products.forEach((product) => {
      const parentName = product.categorySlug?.parent?.name || product.categorySlug?.name || 'Catalog';
      if (!groups.has(parentName)) groups.set(parentName, []);
      groups.get(parentName).push(product);
    });
    return Array.from(groups.entries()).slice(0, 10);
  }, [products]);

  const filteredGroups = useMemo(() => {
    if (activeCategory === 'all') return groupedProducts;
    return groupedProducts.filter(([group]) =>
      group.toLowerCase().replace(/[^a-z0-9]+/g, '-') === activeCategory ||
      group === activeCategory
    );
  }, [groupedProducts, activeCategory]);

  const sidebarCategories = useMemo(() => {
    const names = groupedProducts.map(([group]) => group);
    return [{ key: 'all', label: t('All categories') }, ...names.map((n) => ({
      key: n.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      label: n,
    }))];
  }, [groupedProducts, t]);

  const selectCategory = useCallback((key) => {
    setActiveCategory(key);
    setSidebarOpen(false);
  }, []);

  return (
    <main className="catalog-page">
      <Seo
        title="Medical and Industrial Supply Catalog Bahrain | Leading Trading Est"
        description="Browse the Leading Trading Est procurement catalog for Bahrain medical, dental, laboratory, PPE, surgical, sterile consumable, and industrial supply requirements."
        canonicalPath="/catalog"
        keywords="Bahrain medical supply catalog, dental supplies catalog Bahrain, PPE catalog Bahrain, laboratory supplies Bahrain, surgical consumables Bahrain, Leading Trading Est catalog"
        structuredData={[
          organizationSchema,
          localBusinessSchema,
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Catalog', path: '/catalog' },
          ]),
          buildCollectionSchema({
            name: 'Leading Trading Est Supply Catalog',
            description: 'Medical, dental, laboratory, PPE, surgical, sterile consumable, and industrial supply catalog for Bahrain buyers.',
            path: '/catalog',
            items: products.slice(0, 24).map((product) => ({
              name: product.name,
              path: buildProductPath(product),
            })),
          }),
          buildFaqSchema([
            {
              question: 'Can buyers download the LTE catalog?',
              answer: 'Yes. Buyers can use the catalog page print button to save a clean PDF copy, then contact LTE for quotation support.',
            },
          ]),
        ]}
      />

      {/* ── Hero ── */}
      <section className="catalog-hero">
        <div className="catalog-hero-copy">
          <span className="catalog-eyebrow">{t('LTE Procurement Catalog')}</span>
          <h1>{t('Medical, dental, laboratory, PPE, and industrial supply catalog for Bahrain buyers.')}</h1>
          <p>{t('Browse by category, review representative products, and contact LTE directly for sourcing and quotation support.')}</p>
          <div className="catalog-hero-actions">
            <Link className="catalog-hero-action catalog-hero-action--primary" to="/catalog/pdf">
              <FiBookOpen aria-hidden="true" />
              <span>{t('Open PDF Catalogue')}</span>
            </Link>
            <Link className="catalog-hero-action" to="/contact?source=catalog">
              <FiFileText aria-hidden="true" />
              <span>{t('Request a Quote')}</span>
            </Link>
          </div>
        </div>
      </section>

      {loading ? (
        <StatePanel eyebrow={t('Loading')} title={t('Preparing catalog')} description={t('Loading the latest products and categories.')} variant="loading" />
      ) : error ? (
        <StatePanel eyebrow={t('Unavailable')} title={t('Catalog unavailable')} description={error} variant="error" />
      ) : (
        <>
          {/* ── Category index ── */}
          <section className="catalog-section">
            <div className="catalog-section-head">
              <span className="catalog-eyebrow catalog-eyebrow--ink">{t('Category index')}</span>
              <h2>{t('Browse by supply department.')}</h2>
            </div>
            <div className="catalog-category-grid">
              {topCategories.map((category) => (
                <Link key={category._id} to={`/categories/${category.slug || category._id}`} className="catalog-category-card">
                  <span className="catalog-card-kicker">{t('Open section')}</span>
                  <strong>{categoryName(category.name)}</strong>
                  <p>{categoryDescription(category.description) || t('Browse products, specifications, and quote support.')}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Products with sidebar ── */}
          <section className="catalog-section catalog-section--products">
            <div className="catalog-section-head">
              <span className="catalog-eyebrow catalog-eyebrow--ink">{t('Representative products')}</span>
              <h2>{t('A product sample for fast procurement review.')}</h2>
            </div>

            <div className="catalog-layout">
              {/* Mobile filter toggle */}
              <button
                className="catalog-filter-toggle"
                onClick={() => setSidebarOpen((v) => !v)}
                aria-expanded={sidebarOpen}
                aria-controls="catalog-sidebar"
              >
                {sidebarOpen ? <FiX aria-hidden="true" /> : <FiFilter aria-hidden="true" />}
                {sidebarOpen ? t('Close filter') : t('Filter by category')}
                {activeCategory !== 'all' && (
                  <span className="catalog-filter-badge">1</span>
                )}
              </button>

              {/* Sidebar */}
              <aside
                id="catalog-sidebar"
                className={`catalog-sidebar${sidebarOpen ? ' catalog-sidebar--open' : ''}`}
                aria-label={t('Category filter')}
              >
                <div className="catalog-sidebar__head">
                  <span>{t('Filter')}</span>
                  {activeCategory !== 'all' && (
                    <button className="catalog-sidebar__clear" onClick={() => selectCategory('all')}>
                      {t('Clear')}
                    </button>
                  )}
                </div>
                <ul className="catalog-sidebar__list" role="list">
                  {sidebarCategories.map(({ key, label }) => (
                    <li key={key}>
                      <button
                        className={`catalog-sidebar__item${activeCategory === key ? ' catalog-sidebar__item--active' : ''}`}
                        onClick={() => selectCategory(key)}
                        aria-current={activeCategory === key ? 'true' : undefined}
                      >
                        {categoryName(label)}
                        {activeCategory === key && <span className="catalog-sidebar__tick" aria-hidden="true">✓</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              </aside>

              {/* Product grid */}
              <div className="catalog-main">
                {filteredGroups.length === 0 ? (
                  <StatePanel
                    eyebrow={t('No results')}
                    title={t('No products in this category')}
                    description={t('Select a different category or reset the filter.')}
                  />
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeCategory}
                      className="catalog-product-matrix"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                    {filteredGroups.map(([group, items]) => (
                      <article key={group} className="catalog-product-group">
                        <h3>{categoryName(group)}</h3>
                        <div className="catalog-product-grid-inner">
                          {items.slice(0, 8).map((product, pIdx) => {
                            const image = product.image || product.images?.[0] || '';
                            return (
                              <motion.div
                                key={product._id}
                                initial={{ opacity: 0, scale: 0.94 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.28, delay: pIdx * 0.04, ease: 'easeOut' }}
                                whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(15,28,46,0.12)' }}
                              >
                                <Link to={buildProductPath(product)} className="catalog-product-card">
                                  <div className="catalog-product-card__media">
                                    {image ? (
                                      <img
                                        src={normalizeImageSrc(image, { width: 200 })}
                                        alt={product.name}
                                        width="200"
                                        height="200"
                                        loading="lazy"
                                        decoding="async"
                                      />
                                    ) : (
                                      <span className="catalog-product-card__initial">{product.name?.[0] || 'P'}</span>
                                    )}
                                  </div>
                                  <div className="catalog-product-card__body">
                                    <strong>{product.name}</strong>
                                    {product.sku && <code className="catalog-product-card__sku">{product.sku}</code>}
                                    <small>{product.categorySlug?.name || t('Catalog item')}</small>
                                  </div>
                                  <Link
                                    to={`/contact?source=catalog&product=${product._id}&productName=${encodeURIComponent(product.name)}`}
                                    className="catalog-product-card__rfq"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {t('Add to RFQ')} +
                                  </Link>
                                </Link>
                              </motion.div>
                            );
                          })}
                        </div>
                      </article>
                    ))}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
};

export default CatalogPage;
