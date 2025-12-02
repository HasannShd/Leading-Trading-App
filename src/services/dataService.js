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

// Products list with category slug
export const products = [
  { name: "Pipettes", category: "lab-devices-consumables", image: "pipettes.webp", description: "Precision pipettes for lab work" },
  { name: "Swabs", category: "lab-devices-consumables", image: "swabs.webp", description: "Sterile swabs for sampling" },
  { name: "Blood Collection Tubes", category: "lab-devices-consumables", image: "blood-tubes.webp", description: "Various blood collection tubes" },
  { name: "Surgical Gowns", category: "non-woven-surgical-disposables", image: "gowns.webp", description: "Disposable surgical gowns" },
  { name: "Masks", category: "non-woven-surgical-disposables", image: "masks.webp", description: "Medical masks" },
  { name: "Aprons", category: "non-woven-surgical-disposables", image: "aprons.webp", description: "Protective aprons" },
  { name: "Venturi Masks", category: "respiratory-anesthesia", image: "venturi-masks.webp", description: "Oxygen delivery masks" },
  { name: "Tracheostomy Tubes", category: "respiratory-anesthesia", image: "tracheostomy.webp", description: "Tracheostomy equipment" },
  { name: "Anesthesia Masks", category: "respiratory-anesthesia", image: "anesthesia-masks.webp", description: "Anesthesia delivery masks" },
  { name: "Syringes", category: "hypodermic-disposables", image: "syringes.webp", description: "Various size syringes" },
  { name: "Hypodermic Needles", category: "hypodermic-disposables", image: "needles.webp", description: "Sterile hypodermic needles" },
  { name: "Scalp Vein Sets", category: "hypodermic-disposables", image: "scalp-vein.webp", description: "IV scalp vein infusion sets" },
  { name: "Surgical Blades", category: "Surgical-instruments", image: "blades.webp", description: "Surgical grade blades" },
  { name: "Forceps", category: "Surgical-instruments", image: "forceps.webp", description: "Surgical forceps" },
  { name: "Scissors", category: "Surgical-instruments", image: "scissors.webp", description: "Surgical scissors" },
  { name: "Gauze", category: "medical-dressings", image: "gauze.webp", description: "Sterile gauze pads" },
  { name: "Bandages", category: "medical-dressings", image: "bandages.webp", description: "Medical bandages" },
  { name: "Gloves", category: "examination-disp", image: "gloves.webp", description: "Medical examination gloves" },
  { name: "Lancets", category: "examination-disp", image: "lancets.webp", description: "Sterile lancets" },
  { name: "Test Strips", category: "examination-disp", image: "test-strips.webp", description: "Laboratory test strips" },
  { name: "Wheelchairs", category: "hospital-furnitures-apparatus", image: "wheelchairs.webp", description: "Hospital wheelchairs" },
  { name: "Hospital Beds", category: "hospital-furnitures-apparatus", image: "beds.webp", description: "Adjustable hospital beds" },
  { name: "Commodes", category: "hospital-furnitures-apparatus", image: "commodes.webp", description: "Hospital commodes" },
  { name: "First Aid Kits", category: "first-aid-kit-others", image: "first-aid.webp", description: "Complete first aid kits" },
  { name: "Biohazard Bags", category: "first-aid-kit-others", image: "biohazard.webp", description: "Biohazard waste bags" }
];

// Expose simple getters (sync; no fetch)
export function getCategories() {
  return categories;
}

export function getCategory(slug) {
  return categories.find(c => c.slug === slug) || null;
}
