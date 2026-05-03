export const SITE_ORIGIN = 'https://www.lte-bh.com';

export const absoluteUrl = (value = '/') => {
  if (!value) return SITE_ORIGIN;
  if (/^https?:\/\//i.test(value)) return value;
  return `${SITE_ORIGIN}${value.startsWith('/') ? value : `/${value}`}`;
};

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_ORIGIN}/#organization`,
  name: 'Leading Trading Est',
  alternateName: ['LTE Bahrain', 'Leading Trading Establishment'],
  url: SITE_ORIGIN,
  logo: `${SITE_ORIGIN}/company-logo.png`,
  description:
    'Leading Trading Est provides medical, dental, and industrial supplies in Bahrain with structured sourcing, quotation support, and local service.',
  foundingDate: '2012',
  areaServed: [
    { '@type': 'Country', name: 'Bahrain' },
    { '@type': 'Place', name: 'GCC' },
  ],
  knowsAbout: [
    'medical supplies Bahrain',
    'dental supplies Bahrain',
    'laboratory equipment Bahrain',
    'industrial safety supplies Bahrain',
    'healthcare procurement Bahrain',
  ],
};

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'MedicalBusiness'],
  '@id': `${SITE_ORIGIN}/#local-business`,
  name: 'Leading Trading Est',
  url: SITE_ORIGIN,
  image: `${SITE_ORIGIN}/company-logo.png`,
  logo: `${SITE_ORIGIN}/company-logo.png`,
  description: organizationSchema.description,
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'BH',
    addressRegion: 'Bahrain',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Bahrain',
  },
  priceRange: '$$',
};

export const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_ORIGIN}/#website`,
  name: 'Leading Trading Est',
  url: SITE_ORIGIN,
  publisher: { '@id': `${SITE_ORIGIN}/#organization` },
  inLanguage: ['en', 'ar'],
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_ORIGIN}/shop?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export const buildBreadcrumbSchema = (items = []) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

export const buildCollectionSchema = ({ name, description, path, items = [] }) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name,
  description,
  url: absoluteUrl(path),
  isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: items
      .filter((item) => item?.name && item?.path)
      .slice(0, 24)
      .map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: absoluteUrl(item.path),
      })),
  },
});

export const buildProductSchema = (product, { image, categoryName } = {}) => {
  const priceValue = Number(product?.price || product?.basePrice || product?.variants?.[0]?.sizes?.[0]?.price || 0);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${SITE_ORIGIN}/product/${product?._id}#product`,
    name: product?.name,
    description:
      product?.description ||
      `Request specifications and quotation support for ${product?.name || 'this product'} from Leading Trading Est Bahrain.`,
    image: [image || product?.image || product?.images?.[0]].filter(Boolean).map(absoluteUrl),
    brand: product?.brand ? { '@type': 'Brand', name: product.brand } : { '@type': 'Brand', name: 'Leading Trading Est' },
    sku: product?.sku || product?._id,
    category: categoryName || product?.categorySlug?.name,
    url: absoluteUrl(`/product/${product?._id}`),
    offers: {
      '@type': 'Offer',
      url: absoluteUrl(`/contact?source=product&product=${product?._id || ''}`),
      availability: 'https://schema.org/InStock',
      priceCurrency: 'BHD',
      seller: { '@id': `${SITE_ORIGIN}/#organization` },
    },
  };

  if (Number.isFinite(priceValue) && priceValue > 0) {
    schema.offers.price = priceValue.toFixed(3);
  }

  return schema;
};
