import { BUSINESS_HOURS, businessAddress, businessContact, businessMapsUrl } from './businessProfile.js';
import { buildProductPath } from './productUrls.js';

export const SITE_ORIGIN = 'https://www.lte-bh.com';

export const normalizeCanonicalPath = (value = '/') => {
  if (!value) return '/';
  if (/^https?:\/\//i.test(value)) return value;

  const normalized = value.startsWith('/') ? value : `/${value}`;
  const [pathWithQuery, hash = ''] = normalized.split('#');
  const [pathname, query = ''] = pathWithQuery.split('?');

  if (pathname === '/' || pathname.endsWith('/') || /\.[a-z0-9]+$/i.test(pathname)) {
    return `${pathname}${query ? `?${query}` : ''}${hash ? `#${hash}` : ''}`;
  }

  return `${pathname}/${query ? `?${query}` : ''}${hash ? `#${hash}` : ''}`;
};

export const shahidMajeedSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE_ORIGIN}/#shahid-majeed`,
  name: 'Shahid Majeed',
  jobTitle: ['Owner', 'Managing Director', 'Chief Executive Officer'],
  worksFor: { '@id': `${SITE_ORIGIN}/#organization` },
};

export const companyCertificationSchema = {
  '@type': 'Certification',
  name: 'NHRA approved and certified company',
  issuedBy: {
    '@type': 'Organization',
    name: 'National Health Regulatory Authority Bahrain',
  },
};

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
    'Leading Trading Est is an NHRA approved and certified Bahrain medical, dental, laboratory, safety, and industrial supplier led by Shahid Majeed. The company provides structured sourcing, international supplier and distributor relationships, Medstar own-brand supply, ROMSONS and SMI sole-agent support, quotation support, and local service.',
  founder: { '@id': `${SITE_ORIGIN}/#shahid-majeed` },
  employee: [shahidMajeedSchema],
  hasCredential: companyCertificationSchema,
  award: 'NHRA approved and certified company',
  brand: [
    {
      '@type': 'Brand',
      name: 'Medstar',
      description:
        'Medstar is Leading Trading Est’s own medical supply brand, developed around practical quality, repeat healthcare procurement, and dependable local support.',
    },
    {
      '@type': 'Brand',
      name: 'ROMSONS',
      description: 'ROMSONS brand support through Leading Trading Est in Bahrain.',
    },
    {
      '@type': 'Brand',
      name: 'SMI',
      description: 'SMI brand support through Leading Trading Est in Bahrain.',
    },
  ],
  sameAs: [
    'https://www.instagram.com/leadingtradingest/',
    'https://www.linkedin.com/company/leading-trading-est/',
  ],
  foundingDate: '2012',
  department: [
    { '@type': 'Organization', name: 'Sales Department' },
    { '@type': 'Organization', name: 'Accounts & HR' },
    { '@type': 'Organization', name: 'Delivery Team' },
    { '@type': 'Organization', name: 'IT Department' },
    { '@type': 'Organization', name: 'Digital Marketing' },
  ],
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
    'ROMSONS Bahrain',
    'SMI Bahrain',
    'medical distributors Bahrain',
    'medical gloves Bahrain',
    'nitrile gloves Bahrain',
    'vinyl gloves Bahrain',
    'PPE supplier Bahrain',
    'dental supplies Bahrain',
    'laboratory equipment Bahrain',
    'industrial safety supplies Bahrain',
    'healthcare procurement Bahrain',
  ],
};

export const businessApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  '@id': `${SITE_ORIGIN}/#business-application`,
  name: 'Leading Trading Est',
  alternateName: ['Leading Trading Est staff portal', 'Leading Trading Est admin portal'],
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: SITE_ORIGIN,
  creator: { '@id': `${SITE_ORIGIN}/#organization` },
  publisher: { '@id': `${SITE_ORIGIN}/#organization` },
  description:
    'Leading Trading Est is the official business website and operations app for authorized staff and admins to manage catalog workflows, orders, clients, attendance, messages, notifications, and backup coordination.',
};

export const warehousingWorldSchema = {
  '@context': 'https://schema.org',
  '@type': 'Place',
  '@id': `${SITE_ORIGIN}/solutions/warehousing-world-bahrain/#place`,
  name: 'Warehousing World Bahrain',
  alternateName: ['Warehouse World Bahrain', 'Warehousing World Sitra'],
  description:
    'Warehousing World in Um Al-Baidh, Sitra, Bahrain, is the business location containing the Leading Trading Est office.',
  hasMap: businessMapsUrl,
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 26.1151676,
    longitude: 50.6307677,
  },
  address: {
    '@type': 'PostalAddress',
    ...businessAddress,
  },
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
  founder: organizationSchema.founder,
  employee: organizationSchema.employee,
  hasCredential: organizationSchema.hasCredential,
  award: organizationSchema.award,
  sameAs: organizationSchema.sameAs,
  telephone: businessContact.telephone,
  email: businessContact.email,
  hasMap: businessMapsUrl,
  containedInPlace: { '@id': warehousingWorldSchema['@id'] },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 26.1151676,
    longitude: 50.6307677,
  },
  address: {
    '@type': 'PostalAddress',
    ...businessAddress,
  },
  areaServed: {
    '@type': 'Country',
    name: 'Bahrain',
  },
  priceRange: '$$',
  openingHoursSpecification: BUSINESS_HOURS.map((item) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: item.day,
    opens: item.opens,
    closes: item.closes,
  })),
};

export const medicalOrganizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'MedicalOrganization',
  '@id': `${SITE_ORIGIN}/#medical-organization`,
  name: 'Leading Trading Est',
  url: SITE_ORIGIN,
  logo: `${SITE_ORIGIN}/company-logo.png`,
  description: organizationSchema.description,
  parentOrganization: { '@id': `${SITE_ORIGIN}/#organization` },
  address: localBusinessSchema.address,
  telephone: localBusinessSchema.telephone,
  email: localBusinessSchema.email,
  hasMap: localBusinessSchema.hasMap,
  openingHoursSpecification: localBusinessSchema.openingHoursSpecification,
  areaServed: localBusinessSchema.areaServed,
  sameAs: organizationSchema.sameAs,
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
    item: absoluteUrl(normalizeCanonicalPath(item.path)),
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
  const hasPrice = Number.isFinite(priceValue) && priceValue > 0;
  const productPath = buildProductPath(product);
  const productUrl = absoluteUrl(normalizeCanonicalPath(productPath));
  const productSku = product?.sku || product?._id;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${SITE_ORIGIN}${productPath}#product`,
    name: product?.name,
    description:
      product?.description ||
      `Request specifications and quotation support for ${product?.name || 'this product'} from Leading Trading Est Bahrain.`,
    image: [image || product?.image || product?.images?.[0]].filter(Boolean).map(absoluteUrl),
    brand: product?.brand ? { '@type': 'Brand', name: product.brand } : { '@type': 'Brand', name: 'Leading Trading Est' },
    sku: productSku,
    mpn: productSku,
    category: categoryName || product?.categorySlug?.name,
    url: productUrl,
  };

  if (hasPrice) {
    schema.offers = {
      '@type': 'Offer',
      url: productUrl,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      price: priceValue.toFixed(3),
      priceCurrency: 'BHD',
      seller: { '@id': `${SITE_ORIGIN}/#organization` },
    };
  }

  return schema;
};
