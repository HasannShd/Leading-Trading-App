// Category list with description (placeholder)
export const categories = [
  { slug: "anesthesia", name: "Anesthesia", description: "Description for Anesthesia." },
  { slug: "surgery", name: "Surgery", description: "Description for Surgery." },
  { slug: "urology", name: "Urology", description: "Description for Urology." },
  { slug: "transfusion", name: "Transfusion", description: "Description for Transfusion." },
  { slug: "gastroenterology", name: "Gastroenterology", description: "Description for Gastroenterology." },
  { slug: "miscellaneous", name: "Miscellaneous", description: "Description for Miscellaneous." }
];

// Expose simple getters (sync; no fetch)
export function getCategories() {
  return categories;
}

export function getCategory(slug) {
  return categories.find(c => c.slug === slug) || null
}
