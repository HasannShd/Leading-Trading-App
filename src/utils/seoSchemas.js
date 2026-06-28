import { BUSINESS_HOURS, businessAddress, businessContact, businessMapsUrl } from './businessProfile.js';

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
  name: 'LTE',
  legalName: 'Leading Trading Est',
  alternateName: ['Leading Trading Est', 'LTE Bahrain', 'Leading Trading Establishment'],
  url: SITE_ORIGIN,
  logo: `${SITE_ORIGIN}/company-logo.png`,
  description:
    'LTE, legally Leading Trading Est, is an NHRA approved and certified Bahrain medical business operating from Sitra. LTE manages B2B medical procurement, quotation workflows, and brand-led supply across its Medstar proprietary wholesale consumables portfolio, SMI Sutures exclusive licensed distributorship in Bahrain, and Romsons authorized regional supply partnership.',
  founder: { '@id': `${SITE_ORIGIN}/#shahid-majeed` },
  employee: [shahidMajeedSchema],
  hasCredential: companyCertificationSchema,
  award: 'NHRA approved and certified company',
  owns: [{ '@id': `${SITE_ORIGIN}/brands/medstar/#brand` }],
  brand: [
    {
      '@id': `${SITE_ORIGIN}/brands/medstar/#brand`,
      '@type': 'Brand',
      name: 'Medstar',
      description:
        'Medstar is LTE’s proprietary wholesale consumables brand for recurring healthcare procurement and local Bahrain supply accountability.',
    },
    {
      '@id': `${SITE_ORIGIN}/brands/romsons/#brand`,
      '@type': 'Brand',
      name: 'Romsons',
      alternateName: ['ROMSONS'],
      description:
        'Romsons is supplied by LTE as an authorized regional supply partner for Bahrain healthcare buyers seeking hospital care and disposable medical products.',
    },
    {
      '@id': `${SITE_ORIGIN}/brands/smi/#brand`,
      '@type': 'Brand',
      name: 'SMI Sutures',
      alternateName: ['SMI', 'SMI AG'],
      description:
        'SMI Sutures is represented by LTE as the exclusive licensed distributor in Bahrain for surgical suture and wound-closure procurement.',
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
    'Leading Trading Est Bahrain',
    'LTE Bahrain medical wholesaler',
    'LTE Sitra medical supply',
    'LTE NHRA approved wholesaler',
    'NHRA approved medical supplier Bahrain',
    'medical supplies Bahrain',
    'medical suppliers in Bahrain',
    'medical equipment supplier Bahrain',
    'hospital supplies Bahrain',
    'Medstar Bahrain',
    'Medstar brand proprietary wholesale consumables by LTE',
    'Medstar consumables wholesale Bahrain',
    'Medstar medical supplies Bahrain',
    'SMI Sutures Bahrain',
    'SMI Sutures exclusive licensed distributor Bahrain LTE',
    'SMI surgical sutures Bahrain',
    'absorbable sutures Bahrain',
    'non-absorbable sutures Bahrain',
    'Romsons Bahrain',
    'Romsons medical devices bulk sourcing LTE',
    'Romsons sole agent Bahrain',
    'Romsons catheters Bahrain',
    'medical distributors Bahrain',
    'medical gloves Bahrain',
    'nitrile gloves Bahrain',
    'vinyl gloves Bahrain',
    'PPE supplier Bahrain',
    'dental supplies Bahrain',
    'laboratory equipment Bahrain',
    'industrial safety supplies Bahrain',
    'healthcare procurement Bahrain',
    'bulk medical supply Bahrain',
    'wholesale medical consumables Bahrain',
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
  name: 'LTE',
  alternateName: ['Leading Trading Est', 'LTE Bahrain'],
  url: SITE_ORIGIN,
  image: `${SITE_ORIGIN}/company-logo.png`,
  logo: `${SITE_ORIGIN}/company-logo.png`,
  description: organizationSchema.description,
  parentOrganization: { '@id': `${SITE_ORIGIN}/#organization` },
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
  brand: [
    { '@id': `${SITE_ORIGIN}/brands/medstar/#brand` },
    { '@id': `${SITE_ORIGIN}/brands/smi/#brand` },
    { '@id': `${SITE_ORIGIN}/brands/romsons/#brand` },
  ],
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
  name: 'LTE',
  alternateName: ['Leading Trading Est', 'LTE Bahrain'],
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

export const medstarBrandSchema = {
  '@context': 'https://schema.org',
  '@type': 'Brand',
  '@id': `${SITE_ORIGIN}/brands/medstar/#brand`,
  name: 'Medstar',
  url: `${SITE_ORIGIN}/brands/medstar/`,
  logo: `${SITE_ORIGIN}/Brands/medstar.jpg`,
  description:
    'Medstar is LTE’s proprietary wholesale consumables brand for routine healthcare procurement and repeat B2B medical supply demand in Bahrain.',
  isBrandOf: { '@id': `${SITE_ORIGIN}/#local-business` },
  owner: { '@id': `${SITE_ORIGIN}/#organization` },
};

export const smiSuturesBrandSchema = {
  '@context': 'https://schema.org',
  '@type': 'Brand',
  '@id': `${SITE_ORIGIN}/brands/smi/#brand`,
  name: 'SMI Sutures',
  alternateName: ['SMI', 'SMI AG'],
  url: `${SITE_ORIGIN}/brands/smi/`,
  logo: `${SITE_ORIGIN}/Brands/Smi.png`,
  description:
    'SMI Sutures is represented by LTE as the exclusive licensed distributor in Bahrain for surgical suture and wound-closure procurement.',
  isBrandOf: { '@id': `${SITE_ORIGIN}/#local-business` },
  distributor: { '@id': `${SITE_ORIGIN}/#organization` },
};

export const romsonsBrandSchema = {
  '@context': 'https://schema.org',
  '@type': 'Brand',
  '@id': `${SITE_ORIGIN}/brands/romsons/#brand`,
  name: 'Romsons',
  alternateName: ['ROMSONS'],
  url: `${SITE_ORIGIN}/brands/romsons/`,
  logo: `${SITE_ORIGIN}/Brands/romsons.png`,
  description:
    'Romsons is supplied by LTE as an authorized regional supply partner for Bahrain healthcare buyers seeking hospital care and disposable medical products.',
  isBrandOf: { '@id': `${SITE_ORIGIN}/#local-business` },
  distributor: { '@id': `${SITE_ORIGIN}/#organization` },
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
