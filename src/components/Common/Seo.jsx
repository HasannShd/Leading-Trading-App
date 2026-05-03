import { useEffect } from 'react';

const SITE_ORIGIN = 'https://www.lte-bh.com';
const DEFAULT_TITLE = 'Leading Trading Est | Medical & Industrial Supplies Bahrain';
const DEFAULT_DESCRIPTION =
  'Leading Trading Est provides medical, dental, and industrial supplies in Bahrain with structured sourcing, quotation support, and local service.';
const DEFAULT_IMAGE = `${SITE_ORIGIN}/company-logo.png`;

const toAbsoluteUrl = (value = '/') => {
  if (!value) return SITE_ORIGIN;
  if (/^https?:\/\//i.test(value)) return value;
  return `${SITE_ORIGIN}${value.startsWith('/') ? value : `/${value}`}`;
};

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

export default function Seo({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  canonicalPath = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  robots = 'index,follow',
}) {
  useEffect(() => {
    const canonicalUrl = toAbsoluteUrl(canonicalPath);
    const imageUrl = toAbsoluteUrl(image);

    document.title = title;
    upsertCanonical(canonicalUrl);
    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[name="robots"]', { name: 'robots', content: robots });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: imageUrl });
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: imageUrl });
  }, [canonicalPath, description, image, robots, title, type]);

  return null;
}
