import { useEffect } from 'react';
import { absoluteUrl, normalizeCanonicalPath, SITE_ORIGIN } from '../../utils/seoSchemas';

const DEFAULT_TITLE = 'Leading Trading Est | Medical & Industrial Supplies Bahrain';
const DEFAULT_DESCRIPTION =
  'Leading Trading Est supplies Bahrain medical, dental, laboratory, PPE, safety, and industrial buyers with sourcing, quotations, and delivery.';
const DEFAULT_IMAGE = `${SITE_ORIGIN}/company-logo.png`;
const DEFAULT_KEYWORDS =
  'Leading Trading Est, Shahid Majeed, Leading Trading Est owner, LTE Bahrain, medical supplies Bahrain, dental supplies Bahrain, laboratory equipment Bahrain, industrial safety supplies Bahrain, healthcare procurement Bahrain';
const JSON_LD_ID = 'lte-page-structured-data';

const upsertMeta = (selector, attributes) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
};

const upsertCanonical = (href) => {
  let element = document.head.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
};

const upsertJsonLd = (data) => {
  const existing = document.getElementById(JSON_LD_ID);
  const entries = Array.isArray(data) ? data.filter(Boolean) : [data].filter(Boolean);

  if (!entries.length) {
    existing?.remove();
    return;
  }

  const element = existing || document.createElement('script');
  element.id = JSON_LD_ID;
  element.type = 'application/ld+json';
  element.textContent = JSON.stringify(entries.length === 1 ? entries[0] : entries);
  if (!existing) document.head.appendChild(element);
};

export default function Seo({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  canonicalPath = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  robots = 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
  structuredData = [],
  keywords = DEFAULT_KEYWORDS,
}) {
  useEffect(() => {
    const canonicalUrl = absoluteUrl(normalizeCanonicalPath(canonicalPath));
    const imageUrl = absoluteUrl(image);

    document.title = title;
    document.documentElement.lang = document.documentElement.lang || 'en';
    upsertCanonical(canonicalUrl);
    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[name="keywords"]', { name: 'keywords', content: keywords });
    upsertMeta('meta[name="robots"]', { name: 'robots', content: robots });
    upsertMeta('meta[name="author"]', { name: 'author', content: 'Leading Trading Est' });
    upsertMeta('meta[name="geo.region"]', { name: 'geo.region', content: 'BH' });
    upsertMeta('meta[name="geo.placename"]', { name: 'geo.placename', content: 'Bahrain' });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type });
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'Leading Trading Est' });
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'en_BH' });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: imageUrl });
    upsertMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: title });
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: imageUrl });
    upsertJsonLd(structuredData);
  }, [canonicalPath, description, image, keywords, robots, structuredData, title, type]);

  return null;
}
