import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { seoLandingRoutes } from '../src/utils/seoLandingPages.js';

const root = resolve(new URL('..', import.meta.url).pathname);
const envPath = resolve(root, '.env');
const sitemapPath = resolve(root, 'public/sitemap.xml');
const siteUrl = (process.env.SITE_URL || 'https://www.lte-bh.com').replace(/\/+$/, '');
const today = new Date().toISOString().slice(0, 10);

const staticRoutes = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/shop', changefreq: 'daily', priority: '0.9' },
  { path: '/catalog', changefreq: 'weekly', priority: '0.85' },
  { path: '/categories', changefreq: 'daily', priority: '0.9' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/careers', changefreq: 'weekly', priority: '0.6' },
  { path: '/contact', changefreq: 'monthly', priority: '0.6' },
  ...seoLandingRoutes,
];

const blockedSitemapPrefixes = [
  '/admin',
  '/staff',
  '/cart',
  '/checkout',
  '/orders',
  '/sign-in',
  '/sign-up',
  '/.well-known/',
];

const isIndexablePath = (path = '/') =>
  !blockedSitemapPrefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`) || path.startsWith(prefix));

const escapeXml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const readEnvApiUrl = async () => {
  try {
    const env = await readFile(envPath, 'utf8');
    const match = env
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find((line) => line.startsWith('VITE_API_URL='));
    return match ? match.slice('VITE_API_URL='.length).trim() : '';
  } catch {
    return '';
  }
};

const fetchJson = async (url) => {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
};

const collectDynamicRoutes = async (apiUrl) => {
  const routes = [];

  const categories = await fetchJson(`${apiUrl}/categories`);
  if (Array.isArray(categories)) {
    categories.forEach((category) => {
      if (!category?.slug && !category?._id) return;
      routes.push({
        path: `/categories/${category.slug || category._id}`,
        changefreq: 'weekly',
        priority: category.parent ? '0.7' : '0.8',
      });
    });
  }

  let page = 1;
  const limit = 200;
  for (;;) {
    const data = await fetchJson(`${apiUrl}/products?page=${page}&limit=${limit}`);
    const items = Array.isArray(data) ? data : data.items || [];
    items.forEach((product) => {
      if (!product?._id) return;
      routes.push({
        path: `/product/${product._id}`,
        changefreq: 'weekly',
        priority: product.featured ? '0.8' : '0.7',
      });
    });

    const total = Array.isArray(data) ? items.length : Number(data.total || items.length);
    if (!items.length || page * limit >= total) break;
    page += 1;
  }

  return routes;
};

const renderSitemap = (routes) => {
  const seen = new Set();
  const uniqueRoutes = routes.filter((route) => {
    const path = route.path || '/';
    if (!isIndexablePath(path)) return false;
    if (seen.has(path)) return false;
    seen.add(path);
    return true;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueRoutes
  .map(
    (route) => `  <url>
    <loc>${escapeXml(`${siteUrl}${route.path}`)}</loc>
    <lastmod>${route.lastmod || today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;
};

const main = async () => {
  const envApiUrl = await readEnvApiUrl();
  const apiUrl = (process.env.VITE_API_URL || envApiUrl || '').replace(/\/+$/, '');
  let dynamicRoutes = [];

  if (apiUrl) {
    try {
      dynamicRoutes = await collectDynamicRoutes(apiUrl);
      console.log(`[sitemap] Added ${dynamicRoutes.length} dynamic category/product URLs.`);
    } catch (error) {
      console.warn(`[sitemap] Dynamic URLs skipped: ${error.message}`);
    }
  } else {
    console.warn('[sitemap] VITE_API_URL is not set; writing static sitemap only.');
  }

  await writeFile(sitemapPath, renderSitemap([...staticRoutes, ...dynamicRoutes]), 'utf8');
};

main().catch((error) => {
  console.warn(`[sitemap] Failed to update sitemap: ${error.message}`);
});
