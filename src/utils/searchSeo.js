const cleanText = (value = '') =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const profileMatches = (profile, haystack) =>
  profile.match.some((term) => haystack.includes(cleanText(term)));

const profiles = [
  {
    id: 'gloves',
    match: ['glove', 'gloves', 'nitrile', 'latex', 'vinyl', 'examination glove', 'ppe gloves'],
    terms: [
      'medical gloves Bahrain',
      'nitrile gloves Bahrain',
      'latex gloves Bahrain',
      'vinyl gloves Bahrain',
      'examination gloves Bahrain',
      'disposable gloves Bahrain',
      'PPE gloves supplier Bahrain',
      'clinic gloves Bahrain',
      'dental gloves Bahrain',
      'hospital gloves Bahrain',
    ],
    requests: [
      'Nitrile examination gloves',
      'Latex disposable gloves',
      'Vinyl gloves for clinical use',
      'Powder-free medical gloves',
      'Dental and clinic glove supply',
    ],
    pageTitle: 'Medical Gloves Supplier in Bahrain',
    pageDescription:
      'Browse glove requirements for clinics, dental centers, hospitals, and procurement teams in Bahrain with LTE quotation and sourcing support.',
    guidanceTitle: 'Glove sourcing support for Bahrain healthcare buyers',
    guidanceBody:
      'This category supports buyers comparing disposable glove options by material, clinical use, repeat demand, and quotation requirements before purchasing.',
    points: ['Nitrile, latex, vinyl, and examination glove enquiries', 'Quotation support for clinics, hospitals, and dental centers', 'Local follow-up for repeat procurement requirements'],
    faq: [
      {
        question: 'Can Leading Trading Est support medical glove enquiries in Bahrain?',
        answer:
          'Leading Trading Est supports Bahrain clinics, dental centers, hospitals, and procurement teams with glove sourcing, availability checks, and quotation support.',
      },
      {
        question: 'Which glove types can buyers request?',
        answer:
          'Buyers can request support for common disposable glove requirements such as nitrile, latex, vinyl, examination, dental, and PPE glove supply.',
      },
    ],
  },
  {
    id: 'ppe',
    match: ['ppe', 'mask', 'masks', 'shield', 'face shield', 'gown', 'non woven', 'protective'],
    terms: [
      'PPE supplier Bahrain',
      'medical PPE Bahrain',
      'disposable PPE Bahrain',
      'face masks Bahrain',
      'face shields Bahrain',
      'clinic PPE Bahrain',
      'hospital PPE Bahrain',
    ],
    requests: [
      'Disposable PPE for clinics',
      'Face masks and shields',
      'Protective clinical consumables',
      'Non-woven medical disposables',
    ],
    pageTitle: 'PPE Supplier in Bahrain',
    pageDescription:
      'Review PPE and protective disposable supply options for Bahrain clinics, hospitals, dental centers, and operational procurement teams.',
    guidanceTitle: 'PPE procurement support with local quotation handling',
    guidanceBody:
      'This category helps buyers move from general PPE requirements to specific products, specifications, and quotation requests with fewer follow-up steps.',
    points: ['Medical PPE, masks, shields, gowns, and disposable protection', 'Useful for clinical, dental, and facility procurement', 'Sourcing support where specification or availability needs confirmation'],
    faq: [
      {
        question: 'Can LTE quote PPE products for Bahrain healthcare buyers?',
        answer:
          'Leading Trading Est can support PPE enquiries with product availability, specification review, and quotation handling for Bahrain buyers.',
      },
    ],
  },
  {
    id: 'surgical',
    match: ['surgical', 'scissor', 'forcep', 'instrument', 'blade', 'scalpel'],
    terms: [
      'surgical instruments Bahrain',
      'medical instruments Bahrain',
      'surgical supplies Bahrain',
      'clinic instruments Bahrain',
      'hospital instruments Bahrain',
    ],
    requests: [
      'Surgical instruments',
      'Clinical instrument sourcing',
      'Specification-led quotation support',
    ],
    pageTitle: 'Surgical Instruments Supplier in Bahrain',
    pageDescription:
      'Browse surgical and clinical instrument requirements with specification-led quotation support from Leading Trading Est Bahrain.',
    guidanceTitle: 'Surgical instrument sourcing for specification-led buyers',
    guidanceBody:
      'This category supports procurement teams that need clear product details, instrument types, brand context, and quotation follow-up before ordering.',
    points: ['Surgical and clinical instrument enquiries', 'Specification checks before quotation', 'Support for clinics, hospitals, and specialist centers'],
    faq: [
      {
        question: 'Can buyers request surgical instrument quotations?',
        answer:
          'Buyers can request quotation support for surgical and clinical instruments with product details, specifications, and availability checked by LTE.',
      },
    ],
  },
  {
    id: 'dental',
    match: ['dental', 'orthodontic', 'endodontic', 'impression', 'bur'],
    terms: [
      'dental supplies Bahrain',
      'dental clinic supplies Bahrain',
      'dental materials Bahrain',
      'dental equipment Bahrain',
      'dental consumables Bahrain',
    ],
    requests: [
      'Dental clinic consumables',
      'Dental materials and equipment',
      'Repeat procurement support',
    ],
    pageTitle: 'Dental Supplies Supplier in Bahrain',
    pageDescription:
      'Browse dental clinic supplies, consumables, and sourcing support for Bahrain dental centers and procurement teams.',
    guidanceTitle: 'Dental supply support for clinics and specialist centers',
    guidanceBody:
      'This category is structured for dental buyers who need a faster route from routine consumable needs to product review and quotation support.',
    points: ['Dental consumables, materials, and clinic supply enquiries', 'Repeat procurement support for dental centers', 'Product review before quote requests'],
    faq: [
      {
        question: 'Does LTE support dental clinic procurement in Bahrain?',
        answer:
          'Leading Trading Est supports dental centers and clinics in Bahrain with catalog sourcing, quotation support, and repeat procurement coordination.',
      },
    ],
  },
  {
    id: 'laboratory',
    match: ['lab', 'laboratory', 'microscope', 'slide', 'tube', 'pipette', 'beaker'],
    terms: [
      'laboratory supplies Bahrain',
      'lab equipment Bahrain',
      'laboratory consumables Bahrain',
      'clinic laboratory supplies Bahrain',
      'medical lab supplies Bahrain',
    ],
    requests: [
      'Laboratory consumables',
      'Lab equipment sourcing',
      'Clinical laboratory supply support',
    ],
    pageTitle: 'Laboratory Supplies Supplier in Bahrain',
    pageDescription:
      'Browse laboratory equipment and consumable requirements for Bahrain medical, clinic, and operational procurement teams.',
    guidanceTitle: 'Laboratory sourcing support for clinical and operational buyers',
    guidanceBody:
      'This category helps buyers review laboratory consumables and equipment needs while keeping specification and quotation follow-up clear.',
    points: ['Laboratory consumables and equipment enquiries', 'Support for clinical and medical lab buyers', 'Quotation handling for product availability and specifications'],
    faq: [
      {
        question: 'Can LTE source laboratory products in Bahrain?',
        answer:
          'Leading Trading Est supports laboratory product enquiries with catalog browsing, specification review, and quotation handling.',
      },
    ],
  },
  {
    id: 'industrial',
    match: ['industrial', 'safety', 'bearing', 'bearings', 'tools', 'facility'],
    terms: [
      'industrial supplies Bahrain',
      'industrial safety supplier Bahrain',
      'facility supplies Bahrain',
      'industrial procurement Bahrain',
      'safety products Bahrain',
    ],
    requests: [
      'Industrial safety supplies',
      'Facility and maintenance sourcing',
      'Operational procurement support',
    ],
    pageTitle: 'Industrial Safety Supplies Supplier in Bahrain',
    pageDescription:
      'Browse industrial, safety, facility, and operational supply requirements with Bahrain-based sourcing and quotation support.',
    guidanceTitle: 'Industrial and safety sourcing for operational teams',
    guidanceBody:
      'This category supports buyers who need reliable supply coordination for safety, facility, and industrial procurement requirements.',
    points: ['Industrial safety and facility supply enquiries', 'Operational sourcing and follow-up', 'Support for repeat procurement and availability checks'],
    faq: [
      {
        question: 'Can LTE support industrial supply enquiries?',
        answer:
          'Leading Trading Est supports industrial and facility buyers with structured sourcing, quotation support, and Bahrain-based follow-up.',
      },
    ],
  },
];

export const generalSeoTerms = [
  'medical supplies Bahrain',
  'dental supplies Bahrain',
  'laboratory supplies Bahrain',
  'industrial supplies Bahrain',
  'medical equipment Bahrain',
  'clinic supplies Bahrain',
  'hospital supplies Bahrain',
  'Bahrain medical supplier',
  'Leading Trading Est Bahrain',
];

export const getSeoProfile = (...values) => {
  const haystack = cleanText(values.filter(Boolean).join(' '));
  return profiles.find((profile) => profileMatches(profile, haystack)) || null;
};

export const buildSeoKeywords = (...values) => {
  const profile = getSeoProfile(...values);
  return Array.from(new Set([...(profile?.terms || []), ...generalSeoTerms, ...values.filter(Boolean)]))
    .filter(Boolean)
    .join(', ');
};

export const buildSeoFaqs = (...values) => getSeoProfile(...values)?.faq || [];

export const buildCommonRequests = (...values) => getSeoProfile(...values)?.requests || [];

export const buildSeoContent = (...values) => {
  const profile = getSeoProfile(...values);
  if (!profile) return null;
  return {
    pageTitle: profile.pageTitle,
    pageDescription: profile.pageDescription,
    guidanceTitle: profile.guidanceTitle,
    guidanceBody: profile.guidanceBody,
    points: profile.points || [],
  };
};
