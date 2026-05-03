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
