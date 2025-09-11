// Product list with categorySlug for mapping and image for each product
export const products = [
  // Anesthesia
  { name: "Buction Catheters", categorySlug: "anesthesia", image: "products/buction-catheters.jpg" },
  { name: "Guedel Airways", categorySlug: "anesthesia", image: "products/guedel-airways.jpg" },
  { name: "Face Mask (Oxygen Mask)", categorySlug: "anesthesia", image: "products/face-mask.jpg" },
  { name: "Nasal Oxygen Set (Nasal Set)", categorySlug: "anesthesia", image: "products/nasal-oxygen-set.jpg" },
  { name: "Aeromist / Aerojox / Poor (Nebulizer)", categorySlug: "anesthesia", image: "products/nebulizer.jpg" },
  { name: "Hi Fac / Oxy Look Oxygen Mask", categorySlug: "anesthesia", image: "products/hi-fac-oxygen-mask.jpg" },
  { name: "T Piece Set (T Set)", categorySlug: "anesthesia", image: "products/t-piece-set.jpg" },
  { name: "Bag Mask (Manual Resuscitator)", categorySlug: "anesthesia", image: "products/bag-mask.jpg" },

  // Surgery
  { name: "Romo Set, Mini Romo Wound, Suction Unit", categorySlug: "surgery", image: "products/romo-set.jpg" },
  { name: "Chest Drainage Set (Chest Drainage System)", categorySlug: "surgery", image: "products/chest-drainage-set.jpg" },
  { name: "Yankaur Suction Catheter", categorySlug: "surgery", image: "products/yankaur-suction-catheter.jpg" },
  { name: "Suction Tubes/Handles", categorySlug: "surgery", image: "products/suction-tubes.jpg" },
  { name: "Surgical Blades", categorySlug: "surgery", image: "products/surgical-blades.jpg" },
  { name: "Surgical Scissors", categorySlug: "surgery", image: "products/surgical-scissors.jpg" },
  { name: "Surgical Forceps", categorySlug: "surgery", image: "products/surgical-forceps.jpg" },
  { name: "Surgical Needle Holders", categorySlug: "surgery", image: "products/surgical-needle-holders.jpg" },
  { name: "Surgical Sutures & Threads", categorySlug: "surgery", image: "products/surgical-sutures.jpg" },
  { name: "Tracheostomy Tubes (Plain / Cuffed)", categorySlug: "surgery", image: "products/tracheostomy-tubes.jpg" },

  // Urology
  { name: "Urine Collecting Bags", categorySlug: "urology", image: "products/urine-collecting-bags.jpg" },
  { name: "Urine Cath / Silicone Male Catheter", categorySlug: "urology", image: "products/urine-cath.jpg" },
  { name: "Urometer", categorySlug: "urology", image: "products/urometer.jpg" },
  { name: "Nelaton Catheter / Female Catheter", categorySlug: "urology", image: "products/nelaton-catheter.jpg" },
  { name: "Foley Cath (Foley Balloon Catheter)", categorySlug: "urology", image: "products/foley-cath.jpg" },

  // Transfusion
  { name: "IV Cannula", categorySlug: "transfusion", image: "products/iv-cannula.jpg" },
  { name: "RMS Venufix Infusion Set", categorySlug: "transfusion", image: "products/rms-venufix-infusion-set.jpg" },
  { name: "IV Set (Measured Volume Set)", categorySlug: "transfusion", image: "products/iv-set.jpg" },
  { name: "Cytiva (Measured Volume Set)", categorySlug: "transfusion", image: "products/cytiva.jpg" },
  { name: "Burette (Measured Volume Set)", categorySlug: "transfusion", image: "products/burette.jpg" },
  { name: "Blood Transfusion Set", categorySlug: "transfusion", image: "products/blood-transfusion-set.jpg" },
  { name: "Micro Drip Set", categorySlug: "transfusion", image: "products/micro-drip-set.jpg" },
  { name: "Extension Tube (IV Extension)", categorySlug: "transfusion", image: "products/extension-tube.jpg" },
  { name: "Pressure Infusion Bag (Pressure Monitoring Lines)", categorySlug: "transfusion", image: "products/pressure-infusion-bag.jpg" },
  { name: "Heparin Cap / Stopper", categorySlug: "transfusion", image: "products/heparin-cap.jpg" },

  // Gastroenterology
  { name: "Ryle's Tube / Ryles Tube (Levin's)", categorySlug: "gastroenterology", image: "products/ryles-tube.jpg" },
  { name: "Infant Feeding Tube", categorySlug: "gastroenterology", image: "products/infant-feeding-tube.jpg" },
  { name: "Rectal Tube", categorySlug: "gastroenterology", image: "products/rectal-tube.jpg" },

  // Miscellaneous
  { name: "Mouthpiece (Breathing Exerciser)", categorySlug: "miscellaneous", image: "products/mouthpiece.jpg" },
  { name: "ECG Clamp / Limb Clamp", categorySlug: "miscellaneous", image: "products/ecg-clamp.jpg" },
  { name: "ECG Electrodes", categorySlug: "miscellaneous", image: "products/ecg-electrodes.jpg" },
  { name: "Mucus Extractor", categorySlug: "miscellaneous", image: "products/mucus-extractor.jpg" },
  { name: "Vita Sheet (IV Dressing)", categorySlug: "miscellaneous", image: "products/vita-sheet.jpg" }
];

export function getProducts() {
  return products;
}

export function getProductsByCategory(slug) {
  return products.filter(p => p.categorySlug === slug);
}
