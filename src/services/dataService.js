// Category list with description and image
export const categories = [
  { slug: "lab-devices-consumables", name: "Lab Devices & Consumables", description: "Pipettes, swabs, blood collection tubes, and more.", image: "/Categories/lab devices and consumables.webp" },
  { slug: "non-woven-surgical-disposables", name: "Non-Woven Surgical Disposables", description: "Gowns, masks, aprons, and more.", image: "/Categories/non woven surgical disposables.webp" },
  { slug: "respiratory-anesthesia", name: "Respiratory & Anesthesia", description: "Venturi masks, tracheostomy, anesthesia masks, and more.", image: "/Categories/respiratory and anesthesia.webp" },
  { slug: "hypodermic-disposables", name: "Hypodermic Disposables", description: "Syringes, scalp vein sets, hypodermic needles, and more.", image: "/Categories/hypodermic disposables.webp" },
  { slug: "Surgical-instruments", name: "Surgical Instruments", description: "Surgical blades, forceps, scissors, and more.", image: "/Categories/surgical instruments.webp" },
  { slug: "medical-dressings", name: "Medical Dressings", description: "Gauze, swabs, bandages, and more.", image: "/Categories/medical dressings.webp" },
  { slug: "examination-disp", name: "Examination Disposables", description: "Gloves, lancets, test strips, and more.", image: "/Categories/examination disp.webp" },
  { slug: "hospital-furnitures-apparatus", name: "Hospital Furnitures & Apparatus", description: "Wheel chairs, beds, commodes, and more.", image: "/Categories/hospital furnitures and apparatus.webp" },
  { slug: "first-aid-kit-others", name: "First Aid Kit & Others", description: "First aid, sterilization, biohazard bags, and more.", image: "/Categories/first aid kit and others.webp" }
];

// Expose simple getters (sync; no fetch)
export function getCategories() {
  return categories;
}

export function getCategory(slug) {
  return categories.find(c => c.slug === slug) || null
}
