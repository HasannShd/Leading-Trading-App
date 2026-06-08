import { useEffect, useMemo, useState } from 'react';
import Seo from '../Common/Seo';
import StatePanel from '../Common/StatePanel';
import { buildBreadcrumbSchema, buildCollectionSchema, localBusinessSchema, organizationSchema } from '../../services/../utils/seoSchemas';
import { fetchCategories } from '../../services/categoriesService';
import { fetchProducts } from '../../services/productsService';
import { buildProductPath } from '../../utils/productUrls';
import { normalizeImageSrc } from '../../utils/normalizeImageSrc';
import { buildCategoryTree, getCategoryId, getCategoryParentId } from '../../utils/categoryTree';
import './PdfCatalogPage.css';

const COPYRIGHT_NOTICE =
  '© Leading Trading Est. All rights reserved. This catalogue is for informational and business use only. Unauthorised reproduction or redistribution is prohibited.';

const AVAILABILITY_NOTICE =
  'Product availability, specifications, packaging, and branding may vary. Contact LTE for current details and quotations.';

const serviceSteps = [
  ['Requirement Review', 'LTE reviews the requested product, department, specification, brand preference, and quantity context to ensure the correct product scope is understood before sourcing begins.'],
  ['Sourcing & Availability', 'The team checks suitable product options, stock levels, supplier access, certification documentation, and expected lead times from relevant supply channels.'],
  ['Quotation Support', 'A structured quotation is prepared with available product details, pricing indicators, and commercial follow-up so buyers can make informed purchasing decisions.'],
  ['Order Coordination', 'Sales, accounts, and delivery teams coordinate order handling, confirmation, invoicing, and customer communication through a single accountable workflow.'],
  ['Delivery & Repeat Support', 'Orders are fulfilled with local coordination and ongoing repeat procurement support to maintain consistent supply for ongoing operational needs.'],
];

const catalogueBrands = [
  { name: 'Medstar', logo: 'Brands/medstar.jpg', note: 'LTE own-brand for routine healthcare procurement.' },
  { name: 'Rogin', logo: 'Brands/rogin.png', note: 'Dental and clinical supply products.' },
  { name: 'SMI', logo: 'Brands/Smi.png', note: 'Sole-agent support in Bahrain.' },
  { name: 'ROMSONS', logo: 'Brands/romsons.png', note: 'Sole-agent support in Bahrain.' },
  { name: 'Hermann Meditech', logo: 'Brands/Hermann.png', note: 'Surgical and diagnostic instruments.' },
  { name: 'Zogear', logo: 'Brands/Zogear.png', note: 'Laboratory and clinical accessories.' },
  { name: 'ADC', logo: 'Brands/adc.png', note: 'Diagnostic devices.' },
  { name: 'Osseous', logo: 'Brands/osseous.png', note: 'Orthopaedic and rehabilitation supply.' },
  { name: 'Berger', logo: 'Brands/berger.jpg', note: 'Safety and industrial supply.' },
  { name: 'Bastos-Viegas', logo: 'Brands/bastosviegas.webp', note: 'Wound care and consumables.' },
];

const contactRows = [
  ['Phone', '+973 17210665'],
  ['WhatsApp', '+973 17210665'],
  ['Email', 'admin@lte-bh.com'],
  ['Website', 'www.lte-bh.com'],
  ['Location', 'Warehousing World, Um Al-Baidh, Sitra, Bahrain'],
  ['Social', 'Instagram: @leadingtradingest  |  LinkedIn: Leading Trading Est.'],
];

const chunk = (items, size) => {
  const pages = [];
  for (let i = 0; i < items.length; i += size) pages.push(items.slice(i, i + size));
  return pages;
};

const clean = (v) => String(v || '').trim();

const buildSpecText = (product) => {
  const variantSizes = (product.variants || [])
    .flatMap((v) => v.sizes || [])
    .map((s) => [s.size, s.inches, s.color].filter(Boolean).join(' / '))
    .filter(Boolean);
  const specRows = (product.specs || [])
    .map((s) => [s.label, s.value].filter(Boolean).join(': '))
    .filter(Boolean);
  return [...variantSizes, ...specRows].slice(0, 3).join(' | ');
};

const findPacking = (product) => {
  const match = (product.specs || []).find((s) => /pack|packing|box|carton|unit/i.test(`${s.label} ${s.value}`));
  return match ? [match.label, match.value].filter(Boolean).join(': ') : '';
};

const buildCategoryPath = (product) =>
  [product.categorySlug?.parent?.name, product.categorySlug?.name].filter(Boolean).join(' › ') ||
  product.categorySlug?.name || 'Catalog';

const ProductCard = ({ product }) => {
  const image = product.image || product.images?.[0] || '';
  const details = [
    ['Brand', product.brand],
    ['SKU', product.sku || product.variants?.find((v) => v.sku)?.sku],
    ['Spec', buildSpecText(product)],
    ['Packing', findPacking(product)],
  ].filter(([, v]) => clean(v));

  return (
    <article className="pdf-product-card">
      <div className="pdf-product-media">
        {image
          ? <img src={normalizeImageSrc(image, { width: 400 })} alt={product.name} loading="lazy" decoding="async" />
          : <span>{product.name?.[0] || 'P'}</span>}
      </div>
      <div className="pdf-product-copy">
        <p className="pdf-product-cat">{buildCategoryPath(product)}</p>
        <h3>{product.name}</h3>
        {details.length > 0 && (
          <dl>
            {details.map(([label, value]) => (
              <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
            ))}
          </dl>
        )}
        {product.description && !details.length ? <p className="pdf-product-desc">{product.description}</p> : null}
      </div>
    </article>
  );
};

const PdfPage = ({ children, className = '', section: _section = '', pageNum = '' }) => (
  <section className={`pdf-sheet ${className}`}>
    {children}
    <footer className="pdf-sheet-footer">
      <span className="pdf-sheet-pagenum">{pageNum}</span>
      <div className="pdf-sheet-right">
        <span className="pdf-sheet-notice">{AVAILABILITY_NOTICE}</span>
      </div>
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
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const categoryData = await fetchCategories();
        const collected = [];
        const limit = 200;
        let page = 1;
        for (;;) {
          const data = await fetchProducts({ page: String(page), limit: String(limit) });
          const items = Array.isArray(data) ? data : data.items || [];
          collected.push(...items);
          const total = Array.isArray(data) ? collected.length : Number(data.total || collected.length);
          if (!items.length || collected.length >= total) break;
          page += 1;
        }
        if (!alive) return;
        setCategories(Array.isArray(categoryData) ? categoryData : []);
        setProducts(collected);
      } catch (err) {
        if (alive) setError(err.message || 'Catalogue data could not be loaded.');
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => { alive = false; };
  }, []);

  const topCategories = useMemo(() => categories.filter((c) => !c.parent), [categories]);
  const categoryTree = useMemo(() => buildCategoryTree(categories), [categories]);
  const categoryById = useMemo(() => {
    const map = new Map();
    categories.forEach((c) => map.set(getCategoryId(c), c));
    return map;
  }, [categories]);

  const productSections = useMemo(() => {
    const map = new Map();
    products.forEach((product) => {
      const cat = product.categorySlug || {};
      const parentId = getCategoryParentId(cat);
      const parent = parentId ? categoryById.get(parentId) || cat.parent : null;
      const rootName = parent?.name || cat.name || 'Catalog';
      const subName = parent ? cat.name : rootName;
      const key = `${rootName}::${subName}`;
      if (!map.has(key)) map.set(key, { rootName, subName, products: [] });
      map.get(key).products.push(product);
    });
    return Array.from(map.values()).sort((a, b) =>
      `${a.rootName} ${a.subName}`.localeCompare(`${b.rootName} ${b.subName}`)
    );
  }, [categoryById, products]);

  const productPages = useMemo(() => {
    const pages = [];
    productSections.forEach((section) => {
      chunk(section.products, 8).forEach((group, i) => {
        pages.push({ ...section, products: group, part: i + 1 });
      });
    });
    return pages;
  }, [productSections]);

  const tocEntries = useMemo(() => {
    const fixed = [
      { num: '01', label: 'Company Profile', type: 'section' },
      { num: '02', label: 'Category Overview', type: 'section' },
    ];
    const rootNames = [...new Set(productSections.map((s) => s.rootName))];
    const productSectionEntries = rootNames.map((name, i) => ({
      num: String(i + 3).padStart(2, '0'),
      label: name,
      type: 'product',
      count: productSections
        .filter((s) => s.rootName === name)
        .reduce((total, s) => total + s.products.length, 0),
    }));
    const appendix = [
      { num: 'A', label: 'Order Workflow', type: 'appendix' },
      { num: 'B', label: 'Brand Directory', type: 'appendix' },
      { num: 'C', label: 'Contact & Quotation Support', type: 'appendix' },
    ];
    return { fixed, productSectionEntries, appendix };
  }, [productSections]);

  const sectionNumMap = useMemo(() => {
    const map = new Map();
    const rootNames = [...new Set(productSections.map((s) => s.rootName))];
    rootNames.forEach((name, i) => map.set(name, String(i + 3).padStart(2, '0')));
    return map;
  }, [productSections]);

  // Page numbers: cover = 1 (no PdfPage), toc = 2, profile = 3, catoverview = 4,
  // products = 5 … 4+productPages.length, appendix A/B/C after that
  const pn = useMemo(() => ({
    toc: 2,
    profile: 3,
    categoryOverview: 4,
    appendixA: 5 + productPages.length,
    appendixB: 6 + productPages.length,
    appendixC: 7 + productPages.length,
  }), [productPages.length]);

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
        description="Professional PDF-ready product catalogue for Leading Trading Est."
        canonicalPath="/catalog/pdf"
        keywords="Leading Trading Est PDF catalogue, Bahrain medical supplies catalogue"
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
            description: 'PDF-ready product catalogue for medical, dental, laboratory, PPE, and industrial supply buyers.',
            path: '/catalog/pdf',
            items: products.slice(0, 24).map((p) => ({ name: p.name, path: buildProductPath(p) })),
          }),
        ]}
      />

      {/* Toolbar */}
      <div className="pdf-toolbar">
        <div>
          <strong>PDF Catalogue Preview</strong>
          <span>Use A4 paper size and enable background graphics for best export quality.</span>
        </div>
        <button type="button" onClick={handlePrint}>Export PDF</button>
      </div>

      {/* ── Page 1: Cover ── */}
      <section className="pdf-sheet pdf-cover">
        <div className="pdf-cover-top">
          <div className="pdf-cover-logo">
            <img src={`${import.meta.env.BASE_URL}company-logo.png`} alt="Leading Trading Est." />
          </div>
          <div className="pdf-cover-badge">Professional Product Catalogue</div>
        </div>
        <div className="pdf-cover-copy">
          <p className="pdf-cover-year">{new Date().getFullYear()}</p>
          <h1>Leading<br />Trading Est.</h1>
          <p className="pdf-cover-tagline">Quality. Reliability. Trust.</p>
          <div className="pdf-cover-rule" />
          <p className="pdf-cover-sectors-line">Medical · Dental · Laboratory · PPE · Surgical · Industrial</p>
        </div>
        <div className="pdf-cover-meta">
          <span>Bahrain-based procurement and quotation support</span>
          <span>www.lte-bh.com · admin@lte-bh.com · +973 17210665</span>
        </div>
      </section>

      {/* ── Page 2: Table of Contents ── */}
      <PdfPage className="pdf-toc-page" section="Table of Contents" pageNum={pn.toc}>
        <div className="pdf-page-heading">
          <span className="pdf-eyebrow">Contents</span>
          <h2>Table of Contents</h2>
        </div>
        <div className="pdf-toc">
          <div className="pdf-toc-group">
            <p className="pdf-toc-group-label">Introduction</p>
            {tocEntries.fixed.map((entry) => (
              <div key={entry.num} className="pdf-toc-row">
                <span className="pdf-toc-label">{entry.label}</span>
                <span className="pdf-toc-dots" />
                <span className="pdf-toc-num">§ {entry.num}</span>
              </div>
            ))}
          </div>
          <div className="pdf-toc-group">
            <p className="pdf-toc-group-label">Product Listings</p>
            {tocEntries.productSectionEntries.map((entry) => (
              <div key={entry.num} className="pdf-toc-row">
                <span className="pdf-toc-label">{entry.label}</span>
                <span className="pdf-toc-count">{entry.count} products</span>
                <span className="pdf-toc-dots" />
                <span className="pdf-toc-num">§ {entry.num}</span>
              </div>
            ))}
          </div>
          <div className="pdf-toc-group">
            <p className="pdf-toc-group-label">Appendix</p>
            {tocEntries.appendix.map((entry) => (
              <div key={entry.num} className="pdf-toc-row pdf-toc-row--appendix">
                <span className="pdf-toc-label">{entry.label}</span>
                <span className="pdf-toc-dots" />
                <span className="pdf-toc-num">App. {entry.num}</span>
              </div>
            ))}
          </div>
        </div>
      </PdfPage>

      {/* ── Section 01: Company Profile ── */}
      <PdfPage section="§ 01 — Company Profile" pageNum={pn.profile}>
        <div className="pdf-page-heading">
          <span className="pdf-eyebrow">Section 01 — Company Profile</span>
          <h2>Structured supply support for healthcare and industrial buyers.</h2>
        </div>
        <div className="pdf-profile-statement">
          <p>
            Leading Trading Est. supports hospitals, clinics, laboratories, dental centers, and industrial clients across Bahrain with medical, dental, laboratory, PPE, sterile consumable, and operational supply requirements.
          </p>
          <p>
            The company combines international supplier access, distributor relationships, quotation handling, and local coordination to help customers move requirements into clear purchasing decisions.
          </p>
        </div>
        <div className="pdf-profile-stats">
          <article>
            <strong>2012</strong>
            <span>Established in Bahrain</span>
          </article>
          <article>
            <strong>{topCategories.length}</strong>
            <span>Supply categories</span>
          </article>
          <article>
            <strong>{products.length}</strong>
            <span>Active products</span>
          </article>
          <article>
            <strong>Sitra</strong>
            <span>Warehousing World, Bahrain</span>
          </article>
        </div>
        <div className="pdf-profile-supply">
          <p className="pdf-profile-supply-label">Supply sectors</p>
          <div className="pdf-profile-sectors">
            {['Medical Equipment', 'Dental Supply', 'Laboratory', 'PPE & Safety', 'Sterile Consumables', 'Surgical Instruments', 'Hospital Furniture', 'Industrial Supply'].map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </div>
        <div className="pdf-profile-contact-strip">
          <span>admin@lte-bh.com</span>
          <span>+973 17210665</span>
          <span>www.lte-bh.com</span>
          <span>Warehousing World, Sitra, Bahrain</span>
        </div>
      </PdfPage>

      {/* ── Section 02: Category Overview ── */}
      <PdfPage section="§ 02 — Category Overview" pageNum={pn.categoryOverview}>
        <div className="pdf-page-heading">
          <span className="pdf-eyebrow">Section 02 — Category Overview</span>
          <h2>Catalogue sections by procurement area.</h2>
        </div>
        <div className="pdf-category-toc">
          {categoryTree.map((category) => (
            <article key={category._id}>
              <div className="pdf-cat-header">
                <strong>{category.name}</strong>
                <span>
                  {productSections
                    .filter((s) => s.rootName === category.name)
                    .reduce((t, s) => t + s.products.length, 0)}{' '}
                  products
                </span>
              </div>
              {category.description ? <p>{category.description}</p> : null}
              {category.children?.length ? (
                <ul>
                  {category.children.map((child) => {
                    const count = productSections.find(
                      (s) => s.rootName === category.name && s.subName === child.name
                    )?.products.length || 0;
                    return (
                      <li key={child._id}>
                        <span>{child.name}</span>
                        <em>{count}</em>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </PdfPage>

      {/* ── Product listing pages ── */}
      {productPages.map((page, pageIndex) => {
        const secNum = sectionNumMap.get(page.rootName) || '--';
        const isSubcat = page.subName !== page.rootName;
        const sectionLabel = isSubcat
          ? `§ ${secNum} — ${page.rootName} › ${page.subName}`
          : `§ ${secNum} — ${page.rootName}`;
        return (
          <PdfPage
            key={`${page.rootName}-${page.subName}-${page.part}-${pageIndex}`}
            section={sectionLabel}
            pageNum={5 + pageIndex}
          >
            <div className="pdf-page-heading pdf-product-heading">
              <span className="pdf-eyebrow">
                {isSubcat ? `${page.rootName} — Section ${secNum}` : `Product Listings — Section ${secNum}`}
              </span>
              <h2>{page.subName}</h2>
              {page.part > 1 ? <p className="pdf-continued">Continued — part {page.part}</p> : null}
            </div>
            <div className="pdf-product-grid">
              {page.products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </PdfPage>
        );
      })}

      {/* ── Appendix A: Order Workflow ── */}
      <PdfPage section="Appendix A — Order Workflow" pageNum={pn.appendixA}>
        <div className="pdf-page-heading">
          <span className="pdf-eyebrow">Appendix A — Order Workflow</span>
          <h2>How Leading Trading Est. handles customer requirements.</h2>
        </div>
        <div className="pdf-workflow">
          {serviceSteps.map(([title, body], i) => (
            <article key={title}>
              <span className="pdf-workflow-num">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <strong>{title}</strong>
                <p>{body}</p>
              </div>
            </article>
          ))}
        </div>
      </PdfPage>

      {/* ── Appendix B: Brand Directory ── */}
      <PdfPage section="Appendix B — Brand Directory" pageNum={pn.appendixB}>
        <div className="pdf-page-heading">
          <span className="pdf-eyebrow">Appendix B — Brand Directory</span>
          <h2>Brands and suppliers represented by LTE.</h2>
        </div>
        <div className="pdf-brand-directory">
          {catalogueBrands.map((brand) => (
            <div key={brand.name} className="pdf-brand-item">
              <div className="pdf-brand-logo-wrap">
                <img src={`${import.meta.env.BASE_URL}${brand.logo}`} alt={brand.name} />
              </div>
              <div className="pdf-brand-copy">
                <strong>{brand.name}</strong>
                {brand.note ? <p>{brand.note}</p> : null}
              </div>
            </div>
          ))}
        </div>
      </PdfPage>

      {/* ── Appendix C: Contact ── */}
      <PdfPage className="pdf-contact-page" section="Appendix C — Contact & Quotation" pageNum={pn.appendixC}>
        <div className="pdf-page-heading">
          <span className="pdf-eyebrow">Appendix C — Contact & Quotation Support</span>
          <h2>Contact Leading Trading Est. for product details and quotations.</h2>
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
