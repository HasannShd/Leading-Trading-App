import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBookOpen, FiFileText } from 'react-icons/fi';
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
    () => categories.filter((category) => !category.parent).slice(0, 12),
    [categories]
  );

  const groupedProducts = useMemo(() => {
    const groups = new Map();
    products.forEach((product) => {
      const groupName = product.categorySlug?.parent?.name || product.categorySlug?.name || 'Catalog';
      if (!groups.has(groupName)) groups.set(groupName, []);
      groups.get(groupName).push(product);
    });
    return Array.from(groups.entries()).slice(0, 10);
  }, [products]);


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

          {/* ── Products ── */}
          <section className="catalog-section">
            <div className="catalog-section-head">
              <span className="catalog-eyebrow catalog-eyebrow--ink">{t('Representative products')}</span>
              <h2>{t('A product sample for fast procurement review.')}</h2>
            </div>
            <div className="catalog-product-groups">
              {groupedProducts.map(([group, items]) => (
                <article key={group} className="catalog-product-group">
                  <h3>{categoryName(group)}</h3>
                  <div className="catalog-product-list">
                    {items.slice(0, 8).map((product) => {
                      const image = product.image || product.images?.[0] || '';
                      return (
                        <Link key={product._id} to={buildProductPath(product)} className="catalog-product-row">
                          {image ? (
                            <img src={normalizeImageSrc(image, { width: 180 })} alt={product.name} loading="lazy" decoding="async" />
                          ) : (
                            <span className="catalog-product-initial">{product.name?.[0] || 'P'}</span>
                          )}
                          <span>
                            <strong>{product.name}</strong>
                            <small>{product.brand || product.categorySlug?.name || t('Catalog item')}</small>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
};

export default CatalogPage;
