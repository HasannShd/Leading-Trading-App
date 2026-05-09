import { useEffect, useMemo, useState } from 'react';
import Seo from '../Common/Seo';
import StatePanel from '../Common/StatePanel';
import { buildBreadcrumbSchema, buildCollectionSchema, localBusinessSchema, organizationSchema } from '../../utils/seoSchemas';
import { fetchCategories } from '../../services/categoriesService';
import { fetchProducts } from '../../services/productsService';
import { normalizeImageSrc } from '../../utils/normalizeImageSrc';
import './PdfCatalogPage.css';

const COPYRIGHT_NOTICE =
  '© Leading Trading Est. All rights reserved. This catalogue is intended for informational and business use only. Product images, descriptions, layout, and company branding are the property of Leading Trading Est. or their respective brand owners. Unauthorized copying, reproduction, editing, redistribution, or commercial use of this catalogue without written permission is prohibited.';

const AVAILABILITY_NOTICE =
  'Product availability, specifications, packaging, and branding may vary. Please contact Leading Trading Est. for the latest product details and quotations.';

const serviceSteps = [
  ['Requirement Review', 'LTE reviews the requested product, department, specification, brand preference, and quantity context.'],
  ['Sourcing & Availability', 'The team checks suitable options, stock, supplier access, documentation, and expected timing.'],
  ['Quotation Support', 'A clear quotation path is prepared with available product details and commercial follow-up.'],
  ['Order Coordination', 'Sales, accounts, and delivery coordinate order handling, confirmation, and customer communication.'],
  ['Delivery & Repeat Support', 'Orders are handed over with local support and repeat procurement planning when needed.'],
];

const whyChoose = [
  'Bahrain-based medical, dental, laboratory, PPE, safety, and industrial supply support.',
  'Medstar own-brand supply backed by local accountability and repeat procurement support.',
  'Structured sourcing workflow for clinics, hospitals, laboratories, dental centers, and industrial buyers.',
  'Supplier relationships, quotation handling, and delivery coordination through one accountable team.',
  'Product-focused communication that helps buyers confirm availability, specifications, and fit before purchase.',
];

const contactRows = [
  ['Phone', '+973 17210665'],
  ['WhatsApp', '+973 17210665'],
  ['Email', 'admin@lte-bh.com'],
  ['Website', 'www.lte-bh.com'],
  ['Location', 'Warehousing World, Um Al-Baidh, Sitra, Bahrain'],
  ['Social', 'Instagram: @leadingtradingest | LinkedIn: Leading Trading Est.'],
];

const chunk = (items, size) => {
  const pages = [];
  for (let index = 0; index < items.length; index += size) {
    pages.push(items.slice(index, index + size));
  }
  return pages;
};

const clean = (value) => String(value || '').trim();

const buildSpecText = (product) => {
  const variantSizes = (product.variants || [])
    .flatMap((variant) => variant.sizes || [])
    .map((size) => [size.size, size.inches, size.color].filter(Boolean).join(' / '))
    .filter(Boolean);
  const specRows = (product.specs || [])
    .map((spec) => [spec.label, spec.value].filter(Boolean).join(': '))
    .filter(Boolean);
  return [...variantSizes, ...specRows].slice(0, 3).join(' | ');
};

const findPacking = (product) => {
  const match = (product.specs || []).find((spec) => /pack|packing|box|carton|unit/i.test(`${spec.label} ${spec.value}`));
  return match ? [match.label, match.value].filter(Boolean).join(': ') : '';
};

const productCategoryName = (product) =>
  product.categorySlug?.parent?.name || product.categorySlug?.name || 'Catalog';

const ProductCard = ({ product }) => {
  const image = product.image || product.images?.[0] || '';
  const details = [
    ['Category', product.categorySlug?.name],
    ['Brand', product.brand],
    ['Code / SKU', product.sku || product.variants?.find((variant) => variant.sku)?.sku],
    ['Size / Specification', buildSpecText(product)],
    ['Packing', findPacking(product)],
  ].filter(([, value]) => clean(value));

  return (
    <article className="pdf-product-card">
      <div className="pdf-product-media">
        {image ? (
          <img src={normalizeImageSrc(image, { width: 360 })} alt={product.name} loading="lazy" decoding="async" />
        ) : (
          <span>{product.name?.[0] || 'P'}</span>
        )}
      </div>
      <div className="pdf-product-copy">
        <h3>{product.name}</h3>
        <dl>
          {details.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        {product.description ? <p>{product.description}</p> : null}
      </div>
    </article>
  );
};

const PdfPage = ({ children, className = '' }) => (
  <section className={`pdf-sheet ${className}`}>
    {children}
    <footer className="pdf-sheet-footer">
      <span>Leading Trading Est. | Quality. Reliability. Trust.</span>
      <span>{AVAILABILITY_NOTICE}</span>
    </footer>
  </section>
);

const PdfCatalogPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;

    const loadCatalogueData = async () => {
      setLoading(true);
      setError('');
      try {
        /*
          Catalogue data source:
          - categories come from /api/categories via fetchCategories()
          - products come from /api/products via fetchProducts(), paged until all active products are loaded
          Export:
          - open /catalog/pdf in the browser
          - use the "Export PDF" button or Ctrl/Cmd+P
          - choose "Save as PDF" with A4 paper size and background graphics enabled
        */
        const categoryData = await fetchCategories();
        const collectedProducts = [];
        const limit = 200;
        let page = 1;

        for (;;) {
          const data = await fetchProducts({ page: String(page), limit: String(limit) });
          const items = Array.isArray(data) ? data : data.items || [];
          collectedProducts.push(...items);
          const total = Array.isArray(data) ? collectedProducts.length : Number(data.total || collectedProducts.length);
          if (!items.length || collectedProducts.length >= total) break;
          page += 1;
        }

        if (!alive) return;
        setCategories(Array.isArray(categoryData) ? categoryData : []);
        setProducts(collectedProducts);
      } catch (err) {
        if (alive) setError(err.message || 'Catalogue data could not be loaded.');
      } finally {
        if (alive) setLoading(false);
      }
    };

    loadCatalogueData();
    return () => {
      alive = false;
    };
  }, []);

  const topCategories = useMemo(() => categories.filter((category) => !category.parent), [categories]);

  const groupedProducts = useMemo(() => {
    const map = new Map();
    products.forEach((product) => {
      const group = productCategoryName(product);
      if (!map.has(group)) map.set(group, []);
      map.get(group).push(product);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [products]);

  const productPages = useMemo(() => {
    const pages = [];
    groupedProducts.forEach(([category, items]) => {
      chunk(items, 6).forEach((group, index) => {
        pages.push({ category, products: group, part: index + 1 });
      });
    });
    return pages;
  }, [groupedProducts]);

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <main className="pdf-catalog-status">
        <StatePanel eyebrow="Loading" title="Preparing PDF catalogue" description="Loading the latest category and product data." variant="loading" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="pdf-catalog-status">
        <StatePanel eyebrow="Unavailable" title="Catalogue could not be prepared" description={error} variant="error" />
      </main>
    );
  }

  return (
    <main className="pdf-catalog">
      <Seo
        title="PDF Product Catalogue | Leading Trading Est Bahrain"
        description="Professional PDF-ready product catalogue for Leading Trading Est. using live product and category data."
        canonicalPath="/catalog/pdf"
        keywords="Leading Trading Est PDF catalogue, Bahrain medical supplies catalogue, dental supplies catalogue Bahrain, LTE product catalogue"
        structuredData={[
          organizationSchema,
          localBusinessSchema,
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Catalog', path: '/catalog' },
            { name: 'PDF Catalog', path: '/catalog/pdf' },
          ]),
          buildCollectionSchema({
            name: 'Leading Trading Est PDF Product Catalogue',
            description: 'PDF-ready product catalogue for medical, dental, laboratory, PPE, sterile consumable, and industrial supply buyers.',
            path: '/catalog/pdf',
            items: products.slice(0, 24).map((product) => ({ name: product.name, path: `/product/${product._id}` })),
          }),
        ]}
      />

      <div className="pdf-toolbar">
        <div>
          <strong>PDF Catalogue Preview</strong>
          <span>Use A4 paper size and enable background graphics for best export quality.</span>
        </div>
        <button type="button" onClick={handlePrint}>Export PDF</button>
      </div>

      <PdfPage className="pdf-cover">
        <div className="pdf-cover-logo">
          <img src={`${import.meta.env.BASE_URL}company-logo.png`} alt="Leading Trading Est." />
        </div>
        <div className="pdf-cover-copy">
          <span>Professional Product Catalogue</span>
          <h1>Leading Trading Est.</h1>
          <p>Quality. Reliability. Trust.</p>
        </div>
        <div className="pdf-cover-meta">
          <strong>Medical | Dental | Laboratory | PPE | Industrial Supply</strong>
          <span>Bahrain-based procurement and quotation support</span>
        </div>
      </PdfPage>

      <PdfPage>
        <div className="pdf-page-heading">
          <span>Company Introduction</span>
          <h2>Structured supply support for healthcare and industrial buyers.</h2>
        </div>
        <div className="pdf-intro-grid">
          <p>
            Leading Trading Est. supports hospitals, clinics, laboratories, dental centers, and industrial clients across Bahrain with medical, dental, laboratory, PPE, sterile consumable, and operational supply requirements.
          </p>
          <p>
            The company combines supplier access, quotation handling, local coordination, and Medstar own-brand support to help customers review suitable products and move requirements into clear purchasing decisions.
          </p>
        </div>
        <div className="pdf-stats-row">
          <article><strong>{topCategories.length}</strong><span>main category groups</span></article>
          <article><strong>{products.length}</strong><span>active products loaded</span></article>
          <article><strong>Medstar</strong><span>own-brand support</span></article>
        </div>
      </PdfPage>

      <PdfPage>
        <div className="pdf-page-heading">
          <span>Category Overview</span>
          <h2>Catalogue sections by procurement area.</h2>
        </div>
        <div className="pdf-category-overview">
          {topCategories.map((category) => (
            <article key={category._id}>
              <strong>{category.name}</strong>
              {category.description ? <p>{category.description}</p> : null}
            </article>
          ))}
        </div>
      </PdfPage>

      {productPages.map((page, pageIndex) => (
        <PdfPage key={`${page.category}-${page.part}-${pageIndex}`}>
          <div className="pdf-page-heading pdf-product-heading">
            <span>Product Listings</span>
            <h2>{page.category}</h2>
          </div>
          <div className="pdf-product-grid">
            {page.products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </PdfPage>
      ))}

      <PdfPage>
        <div className="pdf-page-heading">
          <span>Order Workflow</span>
          <h2>How Leading Trading Est. handles customer requirements.</h2>
        </div>
        <div className="pdf-workflow">
          {serviceSteps.map(([title, body], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{title}</strong>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </PdfPage>

      <PdfPage>
        <div className="pdf-page-heading">
          <span>Why Choose Leading Trading Est.</span>
          <h2>Practical reasons customers rely on LTE for repeat procurement.</h2>
        </div>
        <div className="pdf-why-list">
          {whyChoose.map((item) => (
            <article key={item}>
              <span>✓</span>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </PdfPage>

      <PdfPage className="pdf-contact-page">
        <div className="pdf-page-heading">
          <span>Contact</span>
          <h2>Contact Leading Trading Est. for latest product details and quotations.</h2>
        </div>
        <div className="pdf-contact-grid">
          {contactRows.map(([label, value]) => (
            <article key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </article>
          ))}
        </div>
        <div className="pdf-notice">
          <p>{AVAILABILITY_NOTICE}</p>
          <p>{COPYRIGHT_NOTICE}</p>
        </div>
      </PdfPage>
    </main>
  );
};

export default PdfCatalogPage;
