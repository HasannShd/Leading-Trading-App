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
    'Leading Trading Est is a Bahrain medical, dental, laboratory, safety, and industrial supplier providing structured sourcing, Medstar own-brand supply, quotation support, and local service.',
  brand: {
    '@type': 'Brand',
    name: 'Medstar',
    description:
      'Medstar is Leading Trading Est’s own medical supply brand, developed around practical quality, repeat healthcare procurement, and dependable local support.',
  },
  sameAs: [
    'https://www.instagram.com/leadingtradingest/',
    'https://www.linkedin.com/company/leading-trading-est/',
  ],
  foundingDate: '2012',
  areaServed: [
    { '@type': 'Country', name: 'Bahrain' },
    { '@type': 'Place', name: 'GCC' },
  ],
  knowsAbout: [
    'medical supplies Bahrain',
    'medical suppliers in Bahrain',
    'medical equipment supplier Bahrain',
    'hospital supplies Bahrain',
    'Medstar Bahrain',
    'Medstar medical supplies',
    'medical gloves Bahrain',
    'nitrile gloves Bahrain',
    'PPE supplier Bahrain',
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
  sameAs: organizationSchema.sameAs,
  telephone: '+97339939582',
  email: 'admin@lte-bh.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Warehousing World, Um Al-Baidh, Sitra',
    addressLocality: 'Sitra',
    addressCountry: 'BH',
    addressRegion: 'Bahrain',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Bahrain',
  },
  priceRange: '$$',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday', 'Sunday'],
      opens: '08:00',
      closes: '16:00',
    },
  ],
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

export const buildFaqSchema = (questions = []) => {
  const mainEntity = questions
    .filter((item) => item?.question && item?.answer)
    .slice(0, 8)
    .map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    }));

  if (!mainEntity.length) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity,
  };
};

export const buildProductSchema = (product, { image, categoryName } = {}) => {
  const priceValue = Number(product?.price || product?.basePrice || product?.variants?.[0]?.price || product?.variants?.[0]?.sizes?.[0]?.price || 0);
  const offerPrice = Number.isFinite(priceValue) && priceValue > 0 ? priceValue.toFixed(3) : '0.000';
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
      price: offerPrice,
      priceCurrency: 'BHD',
      seller: { '@id': `${SITE_ORIGIN}/#organization` },
    },
  };

  return schema;
};
