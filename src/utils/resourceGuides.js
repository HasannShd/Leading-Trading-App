export const resourceGuides = [
  {
    slug: 'bahrain-medical-equipment-procurement-checklist',
    title: 'Medical Equipment Procurement Checklist for Bahrain Buyers',
    description:
      'A practical checklist for Bahrain clinics, hospitals, and procurement teams reviewing medical equipment, consumables, documentation, and quotation requirements.',
    category: 'Healthcare Procurement',
    keywords:
      'Bahrain medical equipment procurement checklist, medical supplies Bahrain, hospital procurement Bahrain, clinic supply checklist, healthcare procurement Bahrain',
    sections: [
      {
        title: 'Start with intended use and clinical fit',
        body:
          'Before requesting a quotation, define where the product will be used, who will use it, the expected volume, preferred brand or equivalent, and whether the item is routine stock or tied to a specific procedure. This reduces back-and-forth and helps the supplier confirm suitability before pricing.',
      },
      {
        title: 'Prepare documentation and quantity context',
        body:
          'Procurement teams should include model references, SKU numbers, packaging requirements, quantity ranges, urgency, and any technical schedule or RFQ spreadsheet. If product documentation or regulatory paperwork is required, note that upfront so the request can be routed correctly.',
      },
      {
        title: 'Use local follow-up for repeat requirements',
        body:
          'For repeat medical, dental, laboratory, and consumable requirements, local account support helps preserve quotation history, product preferences, and delivery expectations. LTE uses the quote workflow to capture product context and support follow-up from its Bahrain team.',
      },
    ],
  },
  {
    slug: 'industrial-safety-footwear-bahrain-guide',
    title: 'Choosing Industrial Safety Footwear for Bahrain Worksites',
    description:
      'A buyer-focused guide for selecting industrial safety shoes and worksite PPE for Bahrain warehouses, manufacturing teams, and maintenance environments.',
    category: 'Industrial Safety',
    keywords:
      'industrial safety shoes Bahrain, safety footwear Bahrain, PPE supplier Bahrain, warehouse safety shoes Sitra, industrial safety supplier Bahrain',
    sections: [
      {
        title: 'Match footwear to the worksite risk',
        body:
          'Safety footwear should be selected around the environment: warehouse movement, wet surfaces, oil exposure, outdoor heat, electrical risk, toe protection, sole grip, and daily wear duration. A general shoe may not be enough for heavy operational areas.',
      },
      {
        title: 'Check comfort, durability, and sizing',
        body:
          'Industrial buyers should confirm size ranges, material, toe-cap style, sole construction, and expected replacement cycles. Comfort matters because poorly fitted PPE is less likely to be worn consistently across long shifts.',
      },
      {
        title: 'Bundle footwear with broader PPE planning',
        body:
          'Safety shoes are usually part of a wider PPE requirement that can include gloves, masks, eye protection, and workwear. Sending the full requirement in one RFQ helps the supplier confirm availability, alternatives, and delivery planning.',
      },
    ],
  },
  {
    slug: 'laboratory-consumables-clinic-startup-checklist',
    title: 'Laboratory Consumables Checklist for Modern Clinics',
    description:
      'A starter checklist for Bahrain clinics and laboratories planning diagnostic consumables, sample handling supplies, PPE, and recurring procurement workflows.',
    category: 'Laboratory Supplies',
    keywords:
      'laboratory consumables Bahrain, clinic laboratory supplies Bahrain, diagnostic supplies Bahrain, lab startup checklist Bahrain, medical lab supplies Bahrain',
    sections: [
      {
        title: 'Separate equipment, consumables, and repeat stock',
        body:
          'Clinic and laboratory purchasing works best when durable equipment, sample handling consumables, PPE, and repeat-use supplies are separated into clear lines. This makes quotation review faster and helps identify which products need specification checks.',
      },
      {
        title: 'Document sample flow and testing volume',
        body:
          'Share expected testing volume, sample types, storage requirements, and preferred packaging units. This helps the supplier recommend suitable consumables and confirm whether items are appropriate for routine diagnostic workflows.',
      },
      {
        title: 'Plan replenishment early',
        body:
          'Consumables run down quickly once a clinic or lab is active. A procurement plan should include reorder triggers, preferred alternatives, and a clear contact route for urgent requirements so operations are not interrupted.',
      },
    ],
  },
];

export const getResourceGuide = (slug) => resourceGuides.find((guide) => guide.slug === slug);

export const resourceGuideRoutes = [
  { path: '/resources', changefreq: 'monthly', priority: '0.72' },
  ...resourceGuides.map((guide) => ({
    path: `/resources/${guide.slug}`,
    changefreq: 'monthly',
    priority: '0.68',
  })),
];
