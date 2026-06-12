/**
 * generateStaticPages.mjs
 *
 * Runs after `vite build`. Reads the product/category cache saved by
 * generateSitemap.mjs, then writes a static index.html into every public
 * route directory inside dist/.
 *
 * Netlify serves static files before checking _redirects, so Google's
 * first-wave crawler (no JS) gets correct title/description/canonical/
 * JSON-LD for every product, category, and solution page. React hydrates
 * on top for real users.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { existsSync } from 'node:fs';
import { seoLandingPages } from '../src/utils/seoLandingPages.js';
import { resourceGuides } from '../src/utils/resourceGuides.js';
import { buildProductPath } from '../src/utils/productUrls.js';
import { normalizeCanonicalPath } from '../src/utils/seoSchemas.js';

const SITE = 'https://www.lte-bh.com';
const root  = resolve(new URL('..', import.meta.url).pathname);
const dist  = resolve(root, 'dist');
const cache = resolve(root, 'scripts/seo-data-cache.json');

// ─── helpers ────────────────────────────────────────────────────────────────

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const getName = (n) => {
  if (typeof n === 'string') return n;
  if (n && typeof n === 'object') return n.en || n.ar || Object.values(n)[0] || '';
  return '';
};

const write = async (path, content) => {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content, 'utf8');
};

const readCache = async () => {
  if (!existsSync(cache)) return { categories: [], products: [] };
  try { return JSON.parse(await readFile(cache, 'utf8')); }
  catch { return { categories: [], products: [] }; }
};

// Extract Vite-hashed asset tags from the built dist/index.html so our
// static pages reference the same CSS/JS bundles.
const extractViteAssets = (html) => {
  const head = [
    ...[...html.matchAll(/<link[^>]+rel="modulepreload"[^>]*\/?>/g)].map((m) => m[0]),
    ...[...html.matchAll(/<link[^>]+rel="stylesheet"[^>]*\/?>/g)].map((m) => m[0]),
  ].join('\n    ');

  const body =
    html.match(/<script[^>]+type="module"[^>]+src="\/assets\/[^"]*"[^>]*><\/script>/)?.[0] ??
    html.match(/<script[^>]+type="module"[^>]+src="[^"]*"[^>]*><\/script>/)?.[0] ??
    '';

  return { head, body };
};

// ─── HTML template ───────────────────────────────────────────────────────────

const page = ({
  title, description, keywords = '', canonical,
  ogType = 'website', ogImage = `${SITE}/company-logo.png`,
  schemas = [], fallback = '', viteHead = '', viteBody = '',
}) => {
  const ld = schemas.length
    ? `<script type="application/ld+json">${JSON.stringify(schemas.length === 1 ? schemas[0] : schemas, null, 0)}</script>`
    : '';

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
    <link rel="apple-touch-icon" href="/company-logo.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#0c1d32" />
    <meta name="google-site-verification" content="WiG5IDwXpxX-hfhW6D2F5JxZ9KKA9HoomDSOyNWnZqY" />
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
    <link rel="preconnect" href="https://res.cloudinary.com" />
    <link rel="dns-prefetch" href="https://res.cloudinary.com" />
    <style>#root>main[data-seo-fallback]{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap}</style>
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    ${keywords ? `<meta name="keywords" content="${esc(keywords)}" />` : ''}
    <link rel="canonical" href="${esc(canonical)}" />
    <meta property="og:site_name" content="Leading Trading Est" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:url" content="${esc(canonical)}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:image" content="${esc(ogImage)}" />
    <meta property="og:locale" content="en_BH" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${esc(ogImage)}" />
    ${ld}
    ${viteHead}
  </head>
  <body>
    <div id="root"><main data-seo-fallback>${fallback}</main></div>
    ${viteBody}
  </body>
</html>`;
};

// ─── schema builders ─────────────────────────────────────────────────────────

const breadcrumb = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: item.url,
  })),
});

const productSchema = (product, categoryName, canonicalUrl) => {
  const priceValue = Number(
    product?.price || product?.basePrice || product?.variants?.[0]?.price || product?.variants?.[0]?.sizes?.[0]?.price || 0,
  );
  const hasPrice = Number.isFinite(priceValue) && priceValue > 0;
  const productSku = product?.sku || product?._id;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    ...(product.description ? { description: product.description } : {}),
    ...(productSku ? { sku: productSku, mpn: productSku } : {}),
    brand: { '@type': 'Brand', name: product.brand || 'Leading Trading Est' },
    ...(product.image
      ? { image: [product.image.startsWith('http') ? product.image : `${SITE}${product.image}`] }
      : {}),
    category: categoryName,
    url: canonicalUrl,
  };

  if (hasPrice) {
    schema.offers = {
      '@type': 'Offer',
      price: priceValue.toFixed(3),
      priceCurrency: 'BHD',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      url: canonicalUrl,
      seller: { '@type': 'Organization', name: 'Leading Trading Est', url: SITE },
    };
  }

  return schema;
};

const faqSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
});

// ─── page generators ─────────────────────────────────────────────────────────

const genProduct = (product, catMap, viteHead, viteBody) => {
  const path      = buildProductPath(product);
  const canonical = `${SITE}${normalizeCanonicalPath(path)}`;
  const cat       = catMap[product.category] || catMap[product.categoryId] || null;
  const catName   = cat ? getName(cat.name) : 'Medical Supplies';
  const catSlug   = cat?.slug || null;

  const title       = `${product.name} | Leading Trading Est — Bahrain`;
  const description = product.description
    ? `${product.description.slice(0, 155).trimEnd()}… Buy from Leading Trading Est, NHRA certified supplier in Bahrain.`
    : `${product.name} — available from Leading Trading Est, NHRA approved medical & industrial supplier in Bahrain. Request a quote today.`;

  const keywords = [product.name, catName, 'Bahrain', 'Leading Trading Est', 'medical supplies Bahrain']
    .filter(Boolean).join(', ');

  const schemas = [
    productSchema(product, catName, canonical),
    breadcrumb([
      { name: 'Home', url: `${SITE}/` },
      { name: 'Categories', url: `${SITE}/categories/` },
      ...(cat ? [{ name: catName, url: `${SITE}${normalizeCanonicalPath(`/categories/${catSlug || cat._id}`)}` }] : []),
      { name: product.name, url: canonical },
    ]),
  ];

  const fallback = [
    `<h1>${esc(product.name)}</h1>`,
    product.description ? `<p>${esc(product.description.slice(0, 300))}</p>` : '',
    `<p>Category: ${esc(catName)}</p>`,
    product.brand ? `<p>Brand: ${esc(product.brand)}</p>` : '',
    `<nav><a href="/categories">Browse categories</a> <a href="/contact">Request a quote</a></nav>`,
  ].filter(Boolean).join('');

  return {
    filePath: resolve(dist, ...path.replace(/^\//, '').split('/'), 'index.html'),
    html: page({ title, description, keywords, canonical, ogType: 'product', schemas, fallback, viteHead, viteBody }),
  };
};

const genCategory = (category, viteHead, viteBody) => {
  const slug      = category.slug || category._id;
  const canonical = `${SITE}${normalizeCanonicalPath(`/categories/${slug}`)}`;
  const name      = getName(category.name) || 'Category';

  const title       = `${name} | Leading Trading Est — Bahrain`;
  const description = category.description
    ? category.description.slice(0, 160).trimEnd()
    : `Browse ${name} products from Leading Trading Est, NHRA approved medical & industrial supplier in Bahrain. Request quotations online.`;

  const keywords = `${name}, Bahrain, Leading Trading Est, medical supplies, procurement Bahrain`;

  const schemas = [
    breadcrumb([
      { name: 'Home', url: `${SITE}/` },
      { name: 'Categories', url: `${SITE}/categories/` },
      { name: name, url: canonical },
    ]),
  ];

  const fallback = [
    `<h1>${esc(name)}</h1>`,
    `<p>${esc(description)}</p>`,
    `<nav><a href="/categories">All categories</a> <a href="/contact">Request a quote</a></nav>`,
  ].join('');

  return {
    filePath: resolve(dist, 'categories', slug, 'index.html'),
    html: page({ title, description, keywords, canonical, schemas, fallback, viteHead, viteBody }),
  };
};

const genSolution = (landingPage, viteHead, viteBody) => {
  const canonical = `${SITE}${normalizeCanonicalPath(`/solutions/${landingPage.slug}`)}`;

  const schemas = [];
  if (landingPage.faqs?.length) schemas.push(faqSchema(landingPage.faqs));
  schemas.push(
    breadcrumb([
      { name: 'Home', url: `${SITE}/` },
      { name: 'Solutions', url: `${SITE}/solutions/` },
      { name: landingPage.title, url: canonical },
    ])
  );

  const fallbackParts = [
    `<h1>${esc(landingPage.title)}</h1>`,
    `<p>${esc(landingPage.description)}</p>`,
  ];
  if (landingPage.sections?.length) {
    const s = landingPage.sections[0];
    fallbackParts.push(`<h2>${esc(s.title)}</h2><p>${esc(s.body)}</p>`);
  }
  if (landingPage.faqs?.length) {
    fallbackParts.push('<dl>');
    landingPage.faqs.forEach((f) => {
      fallbackParts.push(`<dt>${esc(f.question)}</dt><dd>${esc(f.answer)}</dd>`);
    });
    fallbackParts.push('</dl>');
  }
  fallbackParts.push(`<nav><a href="/categories">Browse categories</a> <a href="/contact">Request a quote</a></nav>`);

  return {
    filePath: resolve(dist, 'solutions', landingPage.slug, 'index.html'),
    html: page({
      title: `${landingPage.title} | Leading Trading Est`,
      description: landingPage.description,
      keywords: landingPage.keywords,
      canonical,
      schemas,
      fallback: fallbackParts.join(''),
      viteHead,
      viteBody,
    }),
  };
};

const genResourceGuide = (guide, viteHead, viteBody) => {
  const canonical = `${SITE}${normalizeCanonicalPath(`/resources/${guide.slug}`)}`;
  const schemas   = [
    breadcrumb([
      { name: 'Home', url: `${SITE}/` },
      { name: 'Resources', url: `${SITE}/resources/` },
      { name: guide.title, url: canonical },
    ]),
  ];

  const fallbackParts = [
    `<h1>${esc(guide.title)}</h1>`,
    `<p>${esc(guide.description)}</p>`,
  ];
  if (guide.sections?.length) {
    const s = guide.sections[0];
    fallbackParts.push(`<h2>${esc(s.title)}</h2><p>${esc(s.body)}</p>`);
  }
  fallbackParts.push(`<nav><a href="/resources">All resources</a> <a href="/contact">Request a quote</a></nav>`);

  return {
    filePath: resolve(dist, 'resources', guide.slug, 'index.html'),
    html: page({
      title: `${guide.title} | Leading Trading Est`,
      description: guide.description,
      keywords: guide.keywords || guide.title,
      canonical,
      schemas,
      fallback: fallbackParts.join(''),
      viteHead,
      viteBody,
    }),
  };
};

const STATIC_ROUTES = [
  {
    path: '/categories',
    title: 'Product Categories | Leading Trading Est — Bahrain',
    description: 'Browse all product categories from Leading Trading Est — NHRA approved medical, dental, laboratory, PPE, and industrial supplier in Bahrain.',
    keywords: 'product categories Bahrain, medical supplies Bahrain, Leading Trading Est categories',
    crumbs: [{ name: 'Home', url: `${SITE}/` }, { name: 'Categories', url: `${SITE}/categories/` }],
  },
  {
    path: '/shop',
    title: 'Search Products | Leading Trading Est — Bahrain',
    description: 'Search the full product catalogue from Leading Trading Est, NHRA approved supplier of medical, dental, laboratory, PPE, and industrial supplies in Bahrain.',
    keywords: 'search products Bahrain, medical products Bahrain, Leading Trading Est shop',
    crumbs: [{ name: 'Home', url: `${SITE}/` }, { name: 'Shop', url: `${SITE}/shop/` }],
  },
  {
    path: '/catalog',
    title: 'Product Catalog | Leading Trading Est — Bahrain',
    description: 'Download or browse the Leading Trading Est product catalog — medical, dental, laboratory, PPE, safety, and industrial supplies available in Bahrain.',
    keywords: 'product catalog Bahrain, medical catalog Bahrain, Leading Trading Est catalog',
    crumbs: [{ name: 'Home', url: `${SITE}/` }, { name: 'Catalog', url: `${SITE}/catalog/` }],
  },
  {
    path: '/about',
    title: 'About Leading Trading Est | Bahrain Medical & Industrial Supplier',
    description: 'Leading Trading Est is an NHRA approved Bahrain supplier of medical, dental, laboratory, and industrial supplies. Learn about the company, its history, and team.',
    keywords: 'about Leading Trading Est, LTE Bahrain, NHRA approved supplier Bahrain',
    crumbs: [{ name: 'Home', url: `${SITE}/` }, { name: 'About', url: `${SITE}/about/` }],
  },
  {
    path: '/about/director',
    title: 'Director — Shahid Majeed | Leading Trading Est Bahrain',
    description: 'Shahid Majeed is the owner and managing director of Leading Trading Est, Bahrain\'s NHRA certified medical and industrial supply company.',
    keywords: 'Shahid Majeed, Leading Trading Est director, LTE Bahrain owner',
    crumbs: [{ name: 'Home', url: `${SITE}/` }, { name: 'About', url: `${SITE}/about/` }, { name: 'Director', url: `${SITE}/about/director/` }],
  },
  {
    path: '/contact',
    title: 'Contact & Quote Request | Leading Trading Est — Bahrain',
    description: 'Contact Leading Trading Est to request a quotation for medical, dental, laboratory, PPE, and industrial supplies in Bahrain. Call, WhatsApp, or email.',
    keywords: 'contact Leading Trading Est, medical supplies quote Bahrain, LTE Bahrain contact',
    crumbs: [{ name: 'Home', url: `${SITE}/` }, { name: 'Contact', url: `${SITE}/contact/` }],
  },
  {
    path: '/careers',
    title: 'Careers at Leading Trading Est | Bahrain',
    description: 'Explore career opportunities at Leading Trading Est, a growing NHRA approved medical and industrial supplier based in Bahrain.',
    keywords: 'careers Leading Trading Est, jobs Bahrain, LTE Bahrain careers',
    crumbs: [{ name: 'Home', url: `${SITE}/` }, { name: 'Careers', url: `${SITE}/careers/` }],
  },
  {
    path: '/resources',
    title: 'Procurement Resources | Leading Trading Est — Bahrain',
    description: 'Guides and resources for Bahrain healthcare and industrial procurement. Written by Leading Trading Est to help buyers plan and source effectively.',
    keywords: 'procurement resources Bahrain, medical procurement guides, Leading Trading Est resources',
    crumbs: [{ name: 'Home', url: `${SITE}/` }, { name: 'Resources', url: `${SITE}/resources/` }],
  },
  {
    path: '/privacy',
    title: 'Privacy Policy | Leading Trading Est',
    description: 'Privacy policy for Leading Trading Est — how we collect, use, and protect personal information submitted through our website.',
    keywords: 'Leading Trading Est privacy policy',
    crumbs: [{ name: 'Home', url: `${SITE}/` }, { name: 'Privacy', url: `${SITE}/privacy/` }],
  },
];

const genStaticRoute = (route, viteHead, viteBody) => {
  const canonical = `${SITE}${normalizeCanonicalPath(route.path)}`;
  const schemas   = [breadcrumb(route.crumbs)];
  const fallback  = `<h1>${esc(route.title.split(' | ')[0])}</h1><p>${esc(route.description)}</p><nav><a href="/">Home</a></nav>`;

  return {
    filePath: resolve(dist, ...route.path.replace(/^\//, '').split('/'), 'index.html'),
    html: page({
      title: route.title,
      description: route.description,
      keywords: route.keywords,
      canonical,
      schemas,
      fallback,
      viteHead,
      viteBody,
    }),
  };
};

// ─── main ────────────────────────────────────────────────────────────────────

const main = async () => {
  // Verify dist exists
  if (!existsSync(dist)) {
    console.error('[static] dist/ not found. Run vite build first.');
    process.exit(1);
  }

  // Read Vite asset tags from the built index.html
  const builtIndex = await readFile(resolve(dist, 'index.html'), 'utf8');
  const { head: viteHead, body: viteBody } = extractViteAssets(builtIndex);

  // Read API data cache
  const { categories, products } = await readCache();
  if (!categories.length && !products.length) {
    console.warn('[static] Cache is empty — product/category pages will not be generated. Run generateSitemap.mjs with API access first.');
  }

  // Build category lookup map
  const catMap = {};
  for (const cat of categories) {
    if (cat._id) catMap[cat._id] = cat;
    if (cat.slug) catMap[cat.slug] = cat;
  }

  const jobs = [];

  // Products
  for (const product of products) {
    if (!product?._id || !product?.name) continue;
    jobs.push(genProduct(product, catMap, viteHead, viteBody));
  }

  // Categories
  for (const category of categories) {
    if (!category?.slug && !category?._id) continue;
    jobs.push(genCategory(category, viteHead, viteBody));
  }

  // SEO landing pages
  for (const lp of seoLandingPages) {
    jobs.push(genSolution(lp, viteHead, viteBody));
  }

  // Resource guides
  for (const guide of resourceGuides) {
    jobs.push(genResourceGuide(guide, viteHead, viteBody));
  }

  // Static routes
  for (const route of STATIC_ROUTES) {
    jobs.push(genStaticRoute(route, viteHead, viteBody));
  }

  // Write all files (batched to avoid fd exhaustion)
  const BATCH = 50;
  let written = 0;
  for (let i = 0; i < jobs.length; i += BATCH) {
    await Promise.all(jobs.slice(i, i + BATCH).map(({ filePath, html }) => write(filePath, html)));
    written += Math.min(BATCH, jobs.length - i);
  }

  console.log(`[static] Generated ${written} static HTML pages in dist/.`);
};

main().catch((err) => {
  console.error(`[static] Failed: ${err.message}`);
  process.exit(1);
});
