import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBookOpen, FiDownload, FiFileText } from 'react-icons/fi';
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="catalog-page">
      <Seo
        title="Medical and Industrial Supply Catalog Bahrain | Leading Trading Est"
        description="Browse the Leading Trading Est procurement catalog for Bahrain medical, dental, laboratory, PPE, surgical, sterile consumable, and industrial supply requirements, including Medstar own-brand products and ROMSONS and SMI sole-agent brand support."
        canonicalPath="/catalog"
        keywords="Bahrain medical supply catalog, dental supplies catalog Bahrain, PPE catalog Bahrain, laboratory supplies Bahrain, surgical consumables Bahrain, ROMSONS Bahrain, SMI Bahrain, Leading Trading Est catalog"
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
              answer:
                'Yes. Buyers can use the catalog page print button to save a clean PDF copy from the browser, then contact LTE for quotation support.',
            },
            {
              question: 'What catalog template does LTE use?',
              answer:
                'The catalog uses a procurement-first template with category sections, representative product cards, brand signals, and quote paths instead of a decorative brochure format.',
            },
          ]),
        ]}
      />

      <section className="catalog-hero">
        <div>
          <span>LTE procurement catalog</span>
          <h1>{t('Medical, dental, laboratory, PPE, and industrial supply catalog for Bahrain buyers.')}</h1>
          <p>
            {t('This catalog uses a procurement-first template: category overview, representative products, brand cues, international supplier access, and direct quote paths so buyers can move from browsing to inquiry quickly.')}
          </p>
        </div>
        <div className="catalog-hero-actions">
          <button type="button" className="catalog-hero-action catalog-hero-action--primary" onClick={handlePrint}>
            <FiDownload aria-hidden="true" />
            <span>{t('Download / Print Catalog')}</span>
          </button>
          <Link className="catalog-hero-action" to="/catalog/pdf">
            <FiBookOpen aria-hidden="true" />
            <span>{t('Open PDF Catalogue')}</span>
          </Link>
          <Link className="catalog-hero-action" to="/contact?source=catalog">
            <FiFileText aria-hidden="true" />
            <span>{t('Request Catalog Quote')}</span>
          </Link>
        </div>
      </section>

      {loading ? (
        <StatePanel eyebrow={t('Loading')} title={t('Preparing catalog')} description={t('We are loading the latest active products and categories.')} variant="loading" />
      ) : error ? (
        <StatePanel eyebrow={t('Unavailable')} title={t('Catalog unavailable')} description={error} variant="error" />
      ) : (
        <>
          <section className="catalog-summary">
            <article>
              <strong>{topCategories.length}</strong>
              <span>{t('main catalog sections')}</span>
            </article>
            <article>
              <strong>{products.length}</strong>
              <span>{t('active products sampled')}</span>
            </article>
            <article>
              <strong>Medstar</strong>
              <span>{t('own-brand supply support')}</span>
            </article>
            <article>
              <strong>ROMSONS & SMI</strong>
              <span>{t('sole-agent support in Bahrain')}</span>
            </article>
          </section>

          <section className="catalog-section">
            <div className="catalog-section-head">
              <span>{t('Category index')}</span>
              <h2>{t('Start with the buyer department, then open the detailed product list.')}</h2>
            </div>
            <div className="catalog-category-grid">
              {topCategories.map((category) => (
                <Link key={category._id} to={`/categories/${category.slug || category._id}`} className="catalog-category-card">
                  <span>{t('Catalog section')}</span>
                  <strong>{categoryName(category.name)}</strong>
                  <p>{categoryDescription(category.description) || t('Open this section for products, specifications, and quote support.')}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="catalog-section">
            <div className="catalog-section-head">
              <span>{t('Representative products')}</span>
              <h2>{t('A practical product sample for fast procurement review.')}</h2>
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
