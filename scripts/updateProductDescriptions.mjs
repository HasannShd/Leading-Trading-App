/**
 * updateProductDescriptions.mjs
 *
 * Usage:
 *   ADMIN_TOKEN=<your-jwt> node scripts/updateProductDescriptions.mjs
 *
 * Get your token:
 *   1. Log in at lte-bh.com/admin/login
 *   2. Open DevTools → Application → Local Storage → adminToken
 *   3. Copy the value and paste after ADMIN_TOKEN=
 *
 * The script fetches each product, merges the new description, and PUTs
 * the full object back so no other fields are overwritten.
 */

const API = 'https://backend-office-tkli.onrender.com/api';
const TOKEN = process.env.ADMIN_TOKEN || process.argv.find(a => a.startsWith('--token='))?.slice(8);

if (!TOKEN) {
  console.error('Error: set ADMIN_TOKEN env variable or pass --token=<jwt>');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  'X-Auth-Scope': 'admin',
  'Authorization': `Bearer ${TOKEN}`,
};

const delay = (ms) => new Promise(r => setTimeout(r, ms));

// ─── descriptions ─────────────────────────────────────────────────────────────
// All 186 products. Key = product _id, value = new description (40-80 words).

const DESCRIPTIONS = {

  // PPE Gloves
  '69f7cafd3de77b18b1e17b01': 'Medstar examination gloves for routine clinical, dental, and laboratory use. Powder-free; available in sizes S, M, L, and XL. Suitable for non-sterile examination and procedure support. Supplied in boxes for repeat procurement by clinics, hospitals, and dental centers in Bahrain. Contact Leading Trading Est for availability and quotation support.',
  '69f7c89e9725ee3dfc2c2698': 'Medstar vinyl examination gloves, powder-free, for routine clinical, hygiene, and light-duty examination use. Latex-free material suitable for latex-sensitive environments. Available in sizes S, M, L, and XL in boxes of 100. Supported by Leading Trading Est for procurement and repeat ordering across Bahrain healthcare and industrial buyers.',
  '69ce3b99963538de6902ced1': 'Cotton fabric gloves for liner use, general industrial handling, and light occupational applications requiring fabric hand coverage. Available in standard sizes. Suitable for use under chemical-resistant gloves or as standalone protection for non-hazardous tasks. Available through Leading Trading Est Bahrain for industrial and facility procurement.',
  '69ce3b99963538de6902ced6': 'Medstar nitrile examination gloves, powder-free and latex-free, for clinical, dental, laboratory, and industrial use. Puncture-resistant nitrile construction. Available in sizes S, M, L, and XL in boxes of 100. Leading Trading Est supplies nitrile gloves across Bahrain healthcare and procurement teams with quotation and availability support.',

  // Sterile Surgical Consumables
  '69ff3ecf98828227afcbb151': 'Sterile single-use universal procedure pack containing pre-assembled disposable consumables for general operating theatre preparation. Reduces setup time and standardizes sterile field organization. Contents vary by supplier configuration. Available through Leading Trading Est Bahrain for OT procurement enquiries, specification review, and quotation support.',
  '69ff3ecf98828227afcbb154': 'Sterile ENT procedure pack pre-assembled for ear, nose, and throat surgical procedures, containing essential single-use OT consumables in one sealed unit. Simplifies sterile setup for ENT theatres. Available through Leading Trading Est Bahrain for quotation and repeat supply coordination.',
  '69ff3ed098828227afcbb157': 'Sterile disposable pack assembled for normal vaginal delivery and maternity procedures. Contains essential consumables for obstetric and midwifery use in a single sterile unit, reducing preparation time. Available through Leading Trading Est Bahrain for maternity unit procurement and quotation support.',
  '69ff3ed098828227afcbb15a': 'Sterile disposable pack pre-assembled for caesarean section procedures, containing the essential consumables needed for organized obstetric theatre preparation. Single-use; reduces cross-contamination risk. Available through Leading Trading Est for maternity and OT procurement enquiries in Bahrain.',
  '69ff3ed098828227afcbb15d': 'Sterile procedure pack for lithotomy-positioned surgical procedures including gynaecology, urology, and colorectal surgery. Contains pre-assembled disposable OT consumables. Single-use sterile unit. Available through Leading Trading Est Bahrain for surgical team procurement enquiries and quotation support.',
  '69ff3ed098828227afcbb160': 'Sterile single-use surgical gowns for full-coverage protection of surgeons and OT staff during sterile procedures. Non-woven or reinforced material depending on specification. Available in standard and large sizes. Leading Trading Est supplies surgical gowns to Bahrain hospitals and surgical centers with quotation handling.',
  '69ff3ed198828227afcbb163': 'Disposable surgeon caps for operating theatre, procedure room, and clean-room use. Maintains hair containment for infection-control compliance. Available in bouffant and plain styles; standard and large sizes. Supplied in bulk packs. Available through Leading Trading Est Bahrain for OT consumable procurement and repeat ordering.',
  '69ff3ed198828227afcbb166': 'Sterile surgical gloves for operating theatre and procedure use where sterile hand protection is required. Powdered or powder-free options. Available in half sizes from 6.0 to 9.0. Individually packaged in sterile pairs. Leading Trading Est supports Bahrain surgical teams with suture and OT consumable quotation.',
  '69ff3ed198828227afcbb169': 'Disposable non-woven OT slippers for operating theatre, clean-room, and restricted-area access. Maintains floor-level infection control and protects sterile zones. Elastic opening for quick fitting. Supplied in bulk packs. Available through Leading Trading Est Bahrain for OT and facility consumable procurement.',

  // Diagnostic Devices
  '69d381b3d186d92e94a5aef8': 'ADC digital blood pressure monitor for automated non-invasive BP measurement in clinical examination rooms, wards, and outpatient settings. Includes adult standard cuff. Clinically validated display. ADC brand sourced and supported through Leading Trading Est for Bahrain clinics, hospitals, and GP practices requiring reliable diagnostic device procurement.',
  '69d38215d186d92e94a5aeff': 'Infrared ear thermometer for fast tympanic temperature measurement in paediatric and adult clinical assessment. Non-invasive; single reading in under 2 seconds. Compatible with disposable probe covers. Available through Leading Trading Est Bahrain for diagnostic device sourcing and quotation.',
  '69d3822fd186d92e94a5af07': 'Finger-clip pulse oximeter for non-invasive SpO2 and pulse rate monitoring in clinical rooms, recovery areas, and point-of-care use. LED display; audible alarm. Suitable for adult clinical assessment. Available through Leading Trading Est for Bahrain diagnostic device procurement and repeat supply.',
  '69d3d7b11b8a36726b17b85d': 'Clinical penlight for pupil response assessment, oral and ear examination, and routine physical assessment. Battery-operated with focused beam. Reusable with disposable covers or single-use options. Available through Leading Trading Est for Bahrain diagnostic and clinical instrument procurement.',
  '69d3d7911b8a36726b17b856': 'ADC stethoscope for auscultation of heart, lung, and bowel sounds in clinical assessment and ward use. Dual-head diaphragm and bell; flexible tubing. ADC brand available through Leading Trading Est for Bahrain GP clinics, hospitals, and medical device procurement with quotation support.',

  // Medical Equipment
  '69ce3b99963538de6902cf03': 'Height-adjustable IV stand with wheeled base for supporting infusion bags, IV lines, and monitoring equipment at the bedside, in wards, and in procedure rooms. Stainless steel or chrome-coated finish. Single or double hook. Available through Leading Trading Est for Bahrain hospital furniture and equipment procurement.',
  '69d3da411b8a36726b17b8c5': 'Freestanding digital scale and stadiometer unit for accurate simultaneous adult weight and height measurement during clinical intake, screening, and chronic disease management. LCD display; standard platform scale. Available through Leading Trading Est for Bahrain clinic and hospital equipment procurement.',
  '69d3db371b8a36726b17b909': 'Portable electric suction machine for clearing airway secretions, sputum, and mucus during respiratory care, post-operative recovery, and bedside clinical support. Adjustable suction pressure; collection jar and tubing included. Available through Leading Trading Est for Bahrain medical equipment sourcing.',
  '69ce3b99963538de6902cf4d': 'Adjustable clinical examination lamp providing focused, bright illumination for wound assessment, minor procedures, physical examination, and clinical workspace lighting. Floor-standing or wall-mounted versions. Available through Leading Trading Est for Bahrain clinic and medical facility equipment procurement.',
  '69d3dabc1b8a36726b17b8ee': 'Foam head immobilizer for securing the head and neck during emergency transport, spinal precaution, and patient transfer procedures. Compatible with standard backboards and stretchers. Available through Leading Trading Est Bahrain for emergency response, hospital, and ambulance equipment procurement.',
  '69ce3b99963538de6902cf4f': 'Mechanical spring-scale designed for accurate infant weighing in maternity units, paediatric clinics, and child health monitoring programs. Graduated tray for safe positioning; capacity up to 20 kg. Available through Leading Trading Est for Bahrain paediatric and maternity equipment procurement.',

  // Anesthesia & Respiratory
  '69ce3b99963538de6902cf31': 'Transparent PVC anaesthesia face masks for oxygen and anaesthetic gas delivery during induction, pre-oxygenation, and airway maintenance. Available in sizes 0 to 5 covering neonatal to large adult. Leading Trading Est supports Bahrain anaesthesia and respiratory equipment procurement with quotation handling.',
  '69ce3b99963538de6902cf2a': 'Corrugated single-use breathing circuit with 22mm catheter mount connector for patient attachment to anaesthesia machines or ventilators. Adult and paediatric sizes available. Smooth-bore or corrugated tubing. Available through Leading Trading Est for Bahrain anaesthesia consumable procurement.',
  '69ce3b99963538de6902cf4e': 'Electrically-powered compressor nebulizer for converting bronchodilator and respiratory medications into inhalable aerosol. Kit includes adult mask, child mask, and mouthpiece. Suitable for outpatient and home respiratory therapy. Available through Leading Trading Est for Bahrain clinic and hospital respiratory equipment.',
  '69ce3b99963538de6902cf39': 'Single-use silicone laryngeal mask airways (LMA) for supraglottic airway management during elective anaesthesia, emergency ventilation, and resuscitation. Available in sizes 1 to 5 for all patient weights. Leading Trading Est supplies disposable LMAs for Bahrain anaesthesia procurement.',
  '69ce3b99963538de6902cf32': 'Single-use PVC endotracheal tubes for oral or nasal intubation in anaesthesia, mechanical ventilation, and emergency airway management. Cuffed and uncuffed versions; sizes 2.5 to 10.0mm internal diameter. Available through Leading Trading Est for Bahrain anaesthesia and critical care procurement.',
  '69ce3b99963538de6902cf29': 'Combined heat and moisture exchange filter for breathing circuits, providing airway humidification and bacterial/viral filtration during mechanical ventilation and anaesthesia. HME and HME-F options available. Available through Leading Trading Est for Bahrain anaesthesia consumable procurement and quotation support.',
  '69ce3b99963538de6902cf3b': 'Malleable intubation stylet for directing and shaping endotracheal tubes during routine and difficult airway intubation. PVC-coated; compatible with standard ETT sizes. Single-use and reusable versions available. Leading Trading Est supports Bahrain anaesthesia consumable procurement with quotation and sourcing.',
  '69ce3b99963538de6902cf33': 'Oral Ring-Adair-Elwyn (RAE) preformed nasal endotracheal tubes for nasotracheal intubation in ENT and maxillofacial procedures. Keeps the tube away from the oral surgical field. Cuffed; sizes 5.0 to 8.5mm. Available through Leading Trading Est Bahrain.',
  '69ce3b99963538de6902cf2d': 'Aerosol delivery masks for use with compressor or ultrasonic nebulizers, ensuring effective bronchodilator and respiratory medication delivery. Available in adult and paediatric sizes. Used in clinics, wards, and home therapy. Available through Leading Trading Est for Bahrain respiratory supply procurement.',
  '69ce3b99963538de6902cf34': 'Oral RAE preformed endotracheal tubes shaped to exit from the mouth inferiorly, keeping the airway tube positioned away from the surgical field during dental, ENT, or head-and-neck procedures. Cuffed; sizes 5.0 to 8.5mm. Available through Leading Trading Est Bahrain.',
  '69ce3b99963538de6902cf2c': 'Simple oxygen face masks for low-to-medium flow supplemental oxygen delivery in clinical assessment, post-operative recovery, and ward care. Available in adult and paediatric sizes with oxygen tubing. Leading Trading Est supplies respiratory consumables to Bahrain clinics and hospitals.',
  '69ce3b99963538de6902cf2f': 'Fixed-performance Venturi-type oxygen delivery kit providing 40% FiO2 for controlled oxygen therapy in patients with COPD or hypercapnic respiratory failure. Includes mask, Venturi barrel, and tubing. Available through Leading Trading Est for Bahrain respiratory consumable procurement.',
  '69ce3b99963538de6902cf2e': 'Variable-performance Venturi face masks for delivering precise, fixed oxygen concentrations of 24%, 28%, 35%, 40%, and 60% FiO2. Essential for patients requiring accurate oxygen titration. Available through Leading Trading Est Bahrain for hospital and clinic respiratory procurement.',
  '69ce3b99963538de6902cf35': 'Wire-reinforced flexible PVC endotracheal tubes for kink-resistant airway management during prone positioning, ENT surgery, and head-and-neck procedures. Cuffed and uncuffed versions; standard sizes. Available through Leading Trading Est for Bahrain anaesthesia procurement.',
  '69ce3b99963538de6902cf3c': 'Incentive spirometer for postoperative pulmonary rehabilitation, encouraging deep breathing exercises to prevent atelectasis. Three-ball or single-chamber design. Single-use or washable. Available through Leading Trading Est for Bahrain respiratory therapy and ward procurement.',
  '69ce3b99963538de6902cf38': 'Reusable autoclavable silicone laryngeal mask airways for repeated supraglottic airway management. Autoclavable up to 40 cycles. Available in sizes 1 to 5. Suitable for planned procedures. Available through Leading Trading Est for Bahrain anaesthesia department procurement.',
  '69ce3b99963538de6902cf37': 'Silicone self-inflating BVM (bag-valve-mask) manual resuscitator with PEEP valve and transparent mask for manual ventilation during resuscitation, apnoea, and airway emergencies. Adult and paediatric sizes. Available through Leading Trading Est Bahrain.',
  '69ce3b99963538de6902cecb': 'Single-use PVC suction catheters for clearing oral, nasopharyngeal, and tracheal secretions. Available in sizes Fr 6 to Fr 18 covering neonatal, paediatric, and adult requirements. X-type and whistle-tip designs. Leading Trading Est supports Bahrain hospital and respiratory suction consumable procurement.',
  '69ce3b99963538de6902cf37_2': 'Flexible PVC suction connecting tubing for linking suction catheters, Yankauer handles, and aspiration devices to wall or portable suction machines. Various lengths available. Available through Leading Trading Est for Bahrain clinical and respiratory consumable procurement.',
  '69ce3b99963538de6902cf30': 'Aerosol oxygen delivery tracheostomy masks fitting directly over the stoma for humidity and supplemental oxygen administration to tracheostomised patients. Available in standard adult size. Leading Trading Est supplies respiratory consumables to Bahrain hospitals and specialist respiratory units.',
  '69ce3b99963538de6902cf3a': 'Rigid Yankauer suction handle with wide-bore distal opening for rapid clearance of blood, vomit, and thick secretions from the oral cavity during emergency resuscitation and OT procedures. Single-use. Available through Leading Trading Est Bahrain.',

  // Laboratory
  '69ce3b99963538de6902cefc': 'Medstar water-based ultrasound transmission coupling gel for improving transducer-to-skin acoustic coupling during diagnostic ultrasound examinations. Hypoallergenic; non-staining formula. Available in 250ml tubes and 5L containers. Leading Trading Est supplies ultrasound gel to Bahrain imaging centers, clinics, and hospitals.',
  '69ce3b99963538de6902ced0': 'Single-use safety lancets for capillary blood sampling in glucose monitoring, point-of-care testing, and neonatal heel-prick screening. Available in 21G and 23G needle gauges. Individually sterile-packed. Available through Leading Trading Est for Bahrain laboratory and clinical procurement.',
  '69d3d91a1b8a36726b17b8a9': 'Pre-cleaned borosilicate glass microscope slides for histology, cytology, haematology, and routine laboratory smear preparation. Available in plain and frosted-end configurations; box of 50 or 100 slides. Available through Leading Trading Est for Bahrain laboratory and pathology procurement.',
  '69ce3b99963538de6902cf0c': 'Pasteur pipettes for laboratory liquid transfer, reagent dispensing, and clinical specimen handling. Available in glass and disposable plastic versions; graduated and ungraduated. Available through Leading Trading Est for Bahrain clinical and research laboratory procurement.',
  '69d3d7dd1b8a36726b17b864': 'Disposable probe covers for ultrasound, rectal, and vaginal transducers to prevent cross-contamination between patients during diagnostic procedures. Latex-free options available. Leading Trading Est supports Bahrain ultrasound and diagnostic supply procurement.',
  '69d3d9bd1b8a36726b17b8b7': 'Leak-proof stool sample containers with wide-mouth opening and screw cap for faecal specimen collection, transport, and laboratory analysis. Available plain or with integrated collection spoon. Available through Leading Trading Est for Bahrain laboratory supply procurement.',
  '69ce3b99963538de6902cef5': 'Latex and latex-free tourniquets for venepuncture, IV cannulation, and blood sampling. Standard width (2.5cm) and paediatric options. Reusable single-patient or single-use versions. Available through Leading Trading Est for Bahrain clinical and laboratory procurement.',

  // Surgical Instruments
  '69d3d8cf1b8a36726b17b8a2': 'Buck neurological reflex hammer with weighted rubber triangular head for eliciting deep tendon reflexes in routine neurological and general clinical assessment. Stainless steel handle. Available through Leading Trading Est for Bahrain clinical instrument procurement.',
  '69d3d8c01b8a36726b17b89b': 'Francy-type reflex hammer with triangular rubber head for tendon reflex examination in neurological clinical assessment. Lightweight; stainless steel handle. Available through Leading Trading Est for Bahrain clinical and diagnostic instrument procurement.',
  '69ce3b99963538de6902cebf': 'Stainless steel surgical and clinical forceps for tissue handling, dressing management, and specimen work. Types include tissue, dressing, haemostatic, Kocher, and thumb forceps. Autoclavable reusable instruments. Available through Leading Trading Est for Bahrain surgical instrument procurement.',
  '69ce3b99963538de6902cec4': 'Stainless steel bandage scissors with blunt safety tip for cutting dressings, tapes, and bandages without skin injury risk. Available in straight and angled designs. Autoclavable. Available through Leading Trading Est for Bahrain clinical instrument and wound care supply procurement.',
  '69ebc9b03131c48c74164f45': 'Stainless steel scalpel handles for use with standard disposable surgical blades. Size 3 for small blades (10, 11, 15) and size 4 for larger blades (20, 22). Autoclavable reusable handle. Available through Leading Trading Est for Bahrain surgical instrument procurement.',
  '69ce3b99963538de6902cec5': 'Stainless steel surgical scissors for wound care, suture cutting, and clinical procedures. Available in straight and curved configurations with sharp/sharp, sharp/blunt, and blunt/blunt tip options. Autoclavable. Available through Leading Trading Est Bahrain.',
  '69ce3b99963538de6902cebb': 'Disposable single-use stitch cutters with a recessed blade for safe, controlled suture removal during post-operative wound care and follow-up procedures. Individually sterile-packed. Available through Leading Trading Est for Bahrain wound care and clinical supply procurement.',
  '69ce3b99963538de6902ceba': 'Sterile single-use stainless steel surgical blades in sizes 10, 11, 15, 20, and 22 for use with standard scalpel handles in surgical and clinical procedures. Individually foil-packed. Available through Leading Trading Est for Bahrain surgical consumable procurement.',
  '69d365cd35503489bc2188d2': 'Disposable and reusable vaginal specula for gynaecological examination, cervical screening, and PAP smear procedures. Available in S, M, and L sizes. Single-use plastic or autoclavable stainless steel versions. Available through Leading Trading Est for Bahrain gynaecology supply procurement.',

  // CSSD
  '69d35d5335503489bc218869': 'Medstar non-woven J-Cloth for general surface decontamination, instrument pre-cleaning, and CSSD environmental cleaning workflows. Disposable; colour-coded options for zone segregation. Available through Leading Trading Est for Bahrain CSSD and infection-control supply procurement.',
  '69ce3b99963538de6902cedb': 'Medstar Class 1 and Class 4 chemical indicator strips for verifying steam sterilization exposure inside wrapped instrument packs, trays, and pouches. Colour changes confirm cycle completion. Available through Leading Trading Est for Bahrain CSSD procurement.',
  '69ce3b99963538de6902cefb': 'Medstar self-sealing paper-film flat sterilization pouches for wrapping individual instruments before autoclave sterilization. Available in sizes 50×200mm to 200×400mm. Internal and external process indicators included. Leading Trading Est supplies sterilization pouches to Bahrain CSSD departments.',
  '69ce3b99963538de6902cef7': 'Medstar continuous sterilization reel stock in paper-film material for custom-sized pouch preparation before autoclave sterilization. Available in widths 50mm, 75mm, 100mm, 150mm, and 200mm. Available through Leading Trading Est for Bahrain CSSD procurement.',
  '69ce3b99963538de6902cec3': 'Sterile and non-sterile nail brushes for surgical hand scrub and instrument pre-cleaning in CSSD and operating theatre environments. Stiff nylon bristles; individually wrapped sterile versions available. Leading Trading Est supplies CSSD consumables to Bahrain hospitals.',
  '69ce3b99963538de6902cef3': 'Autoclave process indicator tape with heat-activated diagonal stripe pattern for external identification of steam sterilized items. Stripe appears after reaching sterilization temperature. Available in standard widths. Available through Leading Trading Est Bahrain for CSSD procurement.',

  // Miscellaneous
  '69d383e1d186d92e94a5af73': 'Heavy-duty yellow clinical biohazard waste bags for collection and disposal of infectious materials, contaminated consumables, and clinical waste. Available in 10L, 25L, and 50L sizes. UN-certified options available. Leading Trading Est supplies clinical waste products to Bahrain hospitals and clinics.',
  '69ce3b99963538de6902cf17': 'Rigid puncture-proof sharps disposal containers for safe collection of needles, syringes, blades, lancets, and other sharps. Available in 1L, 2.5L, 5L, and 7.5L capacities. UN-approved; tamper-evident lid. Available through Leading Trading Est for Bahrain clinical sharps waste procurement.',

  // Examination & General Disposable
  '69ce3b99963538de6902cec2': 'SMI sterile surgical skin marker for preoperative site marking, tissue demarcation, and procedural labelling. Gentian violet ink with fine-tip precision. Sterile individually wrapped. Available through Leading Trading Est for Bahrain surgical consumable and OT supply procurement.',
  '69ce3b99963538de6902cec1': 'Disposable plastic kidney dishes for collecting wound irrigation fluid, holding dressing materials, and managing procedure waste during clinical assessments and minor procedures. Available through Leading Trading Est for Bahrain examination and clinical consumable procurement.',
  '69ce3b99963538de6902cebe': 'Single-use disposable razors for surgical site preparation and pre-operative skin shaving. Individually wrapped; stainless steel blade. Available in standard format for clinical and OT pre-prep. Available through Leading Trading Est for Bahrain clinical and surgical consumable procurement.',
  '69ce3b99963538de6902ceda': 'Medstar write-on patient identification wristbands for hospital admission, ward identification, and procedure labelling. Snap-lock closure; tamper-resistant. Available in adult and paediatric widths. Leading Trading Est supplies patient ID bands to Bahrain hospitals and medical facilities.',
  '69ce3b99963538de6902ced7': 'Wooden tongue depressors for oral cavity inspection and general physical examination. Available sterile (individually wrapped) and non-sterile (bulk-packed). Smooth splinter-free birchwood. Available through Leading Trading Est for Bahrain clinical consumable procurement.',
  '69ce3b99963538de6902ced8': 'Wooden cotton-tipped applicator sticks for specimen collection, wound dressing application, and clinical procedure support. Available sterile and non-sterile in packs of 100 or 500. Available through Leading Trading Est for Bahrain clinical and laboratory supply procurement.',

  // Injection & IV Disposable
  '69ce3b99963538de6902cf48': 'Luer-lock three-way stopcock for controlling directional fluid flow between IV infusion lines, syringes, and monitoring connections. Single-use; pressure-rated. Available through Leading Trading Est for Bahrain IV disposable and critical care consumable procurement.',
  '69ce3b99963538de6902cf49': 'Luer-lock three-way stopcock with integrated 10cm extension tube for easier IV line manipulation and reduced movement at the insertion site. Single-use. Available through Leading Trading Est for Bahrain IV and critical care consumable procurement.',
  '69ce3b99963538de6902cf42': 'Single-use hypodermic needles in gauges 18G to 30G and lengths 16mm to 40mm for injection, aspiration, medication preparation, and IV line priming. Individually sterile-packed. Available through Leading Trading Est for Bahrain injection consumable procurement.',
  '69ce3b99963538de6902cf43': 'Adult IV infusion giving sets with flow regulator, 150cm tubing, drip chamber, and Luer-lock connection for standard IV fluid administration. 20 drops/ml and 60 drops/ml options. Available through Leading Trading Est for Bahrain IV disposable procurement.',
  '69ce3b99963538de6902cf44': 'Paediatric burette IV sets with 150ml graduated volumetric chamber and 60 drops/ml drip factor for accurate volume-controlled infusion in neonatal and paediatric patients. Available through Leading Trading Est for Bahrain paediatric IV procurement.',
  '69ce3b99963538de6902cf3f': 'Single-use disposable syringes with Luer-tip or Luer-lock in volumes 1ml, 2ml, 5ml, 10ml, 20ml, and 50ml for injection, aspiration, and medication preparation. Sterile individually packed. Leading Trading Est supplies syringes to Bahrain clinics, hospitals, and pharmacies.',
  '69ce3b99963538de6902cf4b': 'Epidural anaesthesia minipack containing Tuohy needle, bacterial filter, catheter, connectors, and loss-of-resistance syringe for epidural block in obstetric, surgical, and pain management procedures. Available through Leading Trading Est Bahrain.',
  '69ce3b99963538de6902cf4a': 'Injection caps and Luer-lock injection stoppers for sealing IV cannula ports and maintaining line patency between infusion sessions. Prevents air entry and contamination. Available through Leading Trading Est for Bahrain IV and cannula consumable procurement.',
  '69ce3b99963538de6902cf46': 'Medstar IV peripheral cannulas with PTFE catheter, transparent flashback chamber, injection port, and protective needle guard. Available in sizes 14G to 24G. Supplied in boxes of 50 or 100. Leading Trading Est supplies IV cannulas to Bahrain hospitals, clinics, and procurement teams.',
  '69ce3b99963538de6902cf40': 'Butterfly scalp vein infusion sets in gauges 18G to 27G for paediatric and neonatal IV access, blood sampling, and short-term infusion in difficult or small veins. Individually sterile-packed. Available through Leading Trading Est for Bahrain paediatric consumable procurement.',
  '69ce3b99963538de6902cf47': 'Single-use spinal anaesthesia needles in 22G, 25G, and 27G for subarachnoid block, lumbar puncture, and CSF sampling. Pencil-point (Whitacre) and cutting-bevel (Quincke) tip options. Available through Leading Trading Est for Bahrain anaesthesia procurement.',

  // PPE Masks & Shields
  '69ce3b99963538de6902ceb5': 'Disposable non-woven dust-resistant face masks for protection against airborne particles, dust, and light fluid splatter in clinical and industrial environments. Ear-loop closure with bendable nosepiece. Available through Leading Trading Est for Bahrain industrial and clinical PPE procurement.',
  '69ce3b99963538de6902cede': 'Medstar three-ply disposable medical face masks with fluid-resistant outer layer, meltblown filter, and soft inner layer. Adjustable nosepiece; ear-loop closure. Box of 50. Available through Leading Trading Est for Bahrain clinic, hospital, and workplace infection-control procurement.',
  '69ce3b99963538de6902ceb3': 'Disposable medical face mask with integrated polycarbonate visor providing combined face and eye protection against fluid splash and droplet exposure during clinical procedures and high-risk environments. Available through Leading Trading Est for Bahrain PPE procurement.',
  '69ce3b99963538de6902ceb4': 'N95 respirator masks rated to filter 95% of airborne particles for use in high-risk clinical, isolation, and infectious disease environments. Cup-shaped or foldable flat-fold design. Available through Leading Trading Est for Bahrain healthcare PPE procurement and quotation support.',

  // Gowns, Drapes & Covers
  '69ce3b99963538de6902ceb6': 'Disposable non-woven bouffant caps for operating theatre, clean-room, and clinical procedure use. Elastic-edged for secure hair containment; infection-control compliant. Available in standard and large sizes. Supplied in bulk packs. Available through Leading Trading Est for Bahrain OT and clinical consumable procurement.',
  '69ce3b99963538de6902cf53': 'Disposable non-woven isolation gowns for infection-control use in clinical, isolation, and ward environments. Knitted cuff; back-tie closure; fluid-resistant outer layer. Available in one-size-fits-most. Leading Trading Est supplies isolation gowns to Bahrain hospitals and clinics.',
  '69ce3b99963538de6902ceb8': 'Disposable non-woven bed and examination couch sheets for single-patient use in wards, outpatient clinics, and procedure rooms. Available as flat sheets or perforated roll. Available through Leading Trading Est for Bahrain clinical linen and consumable procurement.',
  '69ce3b99963538de6902cf55': 'Disposable and reusable patient examination gowns with snap or tie closure for hospital admission and clinical assessment. Available in adult and paediatric sizes. Non-woven single-use or washable fabric. Available through Leading Trading Est Bahrain.',
  '69ce3b99963538de6902ceb7': 'Disposable non-woven overshoe covers for operating theatre, clean-room, and restricted-access area use. Elastic opening for quick application; non-skid base options. Supplied in packs of 50 to 200. Available through Leading Trading Est for Bahrain OT and facility procurement.',
  '69ce3b99963538de6902ceb9': 'Absorbent disposable underpads measuring 60 × 90 cm for bed protection, patient positioning, and fluid management in wards and procedure areas. Superabsorbent core; waterproof backing. Available through Leading Trading Est for Bahrain hospital and care facility procurement.',

  // Wound Dressings & Gauze
  '69ce3b99963538de6902cf3d': 'Jackson-Pratt style closed suction wound drainage reservoir for post-operative drain management. Silicone round drain; graduated bulb collection chamber; drain securing disc. Available through Leading Trading Est for Bahrain surgical and wound care consumable procurement.',
  '69da59f5385ce47b93908e89': 'Medstar absorbent cotton rolls for wound care, dental procedures, and general clinical application. Available in 100g, 200g, and 500g rolls. High-absorbency bleached cotton. Leading Trading Est supplies cotton rolls to Bahrain clinics, dental centers, and hospital wound care departments.',
  '69ce3b99963538de6902cec0': 'Sterile disposable dressing set for wound cleaning and redressing containing forceps, gauze swabs, and mixing bowl in a peel-open sterile pack. Available through Leading Trading Est for Bahrain wound care and clinical consumable procurement.',
  '69ce3b99963538de6902cedc': 'Medstar cotton gauze rolls for wound wrapping, padding, and supportive dressing. Available in widths 5cm, 7.5cm, and 10cm in 5m rolls; individually packed or bulk. Leading Trading Est supplies gauze rolls to Bahrain hospitals, clinics, and wound care teams.',
  '69ce3b99963538de6902cedd': 'Medstar woven cotton gauze swabs for wound care, cleaning, and general clinical use. Available in 7.5 × 7.5 cm and 10 × 10 cm; 8-ply; sterile and non-sterile options in packs of 5, 10, and 100. Available through Leading Trading Est Bahrain.',
  '69ce3b99963538de6902cee1': 'Medstar absorbent cotton balls and gauze balls for wound cleaning, skin antisepsis preparation, and general clinical use. Non-sterile; available in bags of 100 or 200. Available through Leading Trading Est for Bahrain clinical and wound care consumable procurement.',
  '69ce3b99963538de6902cee0': 'Sterile woven cotton laparotomy sponges for intra-abdominal use during open surgical procedures. X-ray detectable thread; 45 × 45 cm standard size; packs of 5. Available through Leading Trading Est for Bahrain OT and surgical consumable procurement.',
  '69ce3b99963538de6902ceee': 'Semi-permeable transparent polyurethane film dressings for securing IV cannulas, covering minor wounds, and protecting fragile or at-risk skin. Available in sizes 6 × 7 cm, 10 × 12 cm, and 15 × 20 cm. Available through Leading Trading Est Bahrain.',
  '69ce3b99963538de6902ceed': 'Soft spunlace non-woven dressing rolls for wound contact layers, skin surface cleaning, and light-duty clinical dressing support. Low-linting; gentle on skin. Available in 10cm × 10m rolls. Available through Leading Trading Est for Bahrain wound care procurement.',
  '69ce3b99963538de6902cedf': 'Medstar sterile individually-wrapped gauze swabs in 7.5 × 7.5 cm for wound care, dressing changes, and procedures requiring a maintained sterile field. 8-ply woven cotton. Leading Trading Est supplies sterile gauze to Bahrain hospitals, clinics, and surgical teams.',
  '69ce3b99963538de6902cef1': 'Wound dressings range including non-adherent, foam, hydrocolloid, and island formats for wound coverage, exudate management, and skin protection. Sizes and specifications vary by type. Available through Leading Trading Est for Bahrain wound care consumable procurement and quotation.',

  // Medical Tapes & Bandages
  '69ce3b99963538de6902ceef': 'Strong elastic woven cloth adhesive tape for wound dressing fixation, splinting support, and athletic strapping. Aggressive adhesive on elastic backing. Available in widths 2.5cm, 5cm, and 7.5cm. Available through Leading Trading Est for Bahrain wound care and tape supply procurement.',
  '69ce3b99963538de6902ceeb': 'Breathable non-woven microporous surgical tape for securing wound dressings and cannulas on sensitive skin. Easy one-hand application; gentle atraumatic removal. Available in widths 1.25cm, 2.5cm, and 5cm. Leading Trading Est supplies surgical tape to Bahrain clinics, hospitals, and home care teams.',
  '69ce3b99963538de6902ceec': 'Clear polyethylene film surgical tape for lightweight wound dressing fixation and cannula securing. Low-profile; transparent; easy tear. Available in 1.25cm and 2.5cm widths. Available through Leading Trading Est for Bahrain clinical tape and dressing supply procurement.',

  // Skin Prep & First Aid
  '69ce3b99963538de6902cee3': 'Individually-wrapped 70% isopropyl alcohol swab pads for pre-injection skin antisepsis, cannula site prep, and blood sampling decontamination. Size 65 × 30mm; sterile and non-sterile options. Leading Trading Est supplies alcohol swabs to Bahrain clinics, hospitals, and first aid procurement teams.',
  '69ce3b99963538de6902cef0': 'Sterile adhesive first aid wound plasters in standard strip sizes (19 × 72mm) for covering minor cuts, abrasions, and small wounds in first aid and clinical settings. Fabric or plastic backing; box of 100. Available through Leading Trading Est Bahrain.',
  '69ce3b99963538de6902cef2': 'Single-use instant cold packs activated by squeezing to mix internal chambers and initiate an endothermic reaction. Provides 15–20 minutes of cooling for acute injury, pain relief, and first aid management. Available through Leading Trading Est for Bahrain first aid supply procurement.',

  // Sutures (SMI)
  '69ce3b99963538de6902cf4c': 'SMI Daclon monofilament nylon non-absorbable suture for skin closure, tendon repair, and ophthalmic procedures. Black monofilament; sizes 2-0 to 6-0 on reverse cutting and taper-cut needles. Leading Trading Est is the SMI sole agent in Bahrain — contact for pricing and availability.',
  '69ce3b99963538de6902cf0f': 'SMI monofilament blue polypropylene suture equivalent to Prolene, for cardiovascular, plastic, and long-term tissue approximation. Non-absorbable; sizes 2-0 to 6-0. Leading Trading Est is the SMI sole agent in Bahrain, offering quotation and repeat supply for hospitals and surgical centers.',
  '69ce3b99963538de6902cf18': 'SMI braided natural silk suture for general tissue approximation, ligation, and vessel tie-off. Non-absorbable; sizes 0 to 4-0 with and without needle. Leading Trading Est is the SMI sole agent in Bahrain — available with full specification and quotation support.',
  '69ce3b99963538de6902cf21': 'SMI Surgicryl 910 fast-absorbing braided polyglactin 910 suture, equivalent to Vicryl Rapide. Complete absorption in 40–50 days. Sizes 3-0 to 5-0 on cutting and reverse-cutting needles. Leading Trading Est is the SMI sole agent in Bahrain for surgical and clinic procurement.',
  '69ce3b99963538de6902cf22': 'SMI Surgicryl Monofast monofilament poliglecaprone suture equivalent to Monocryl. Absorbed in 90–120 days; ideal for subcuticular skin closure. Sizes 3-0 to 5-0. Leading Trading Est is the SMI sole agent in Bahrain — contact for product specification and quotation support.',
  '69ce3b99963538de6902cf23': 'SMI Surgicryl Monofilament polydioxanone (PDS equivalent) delayed-absorption monofilament suture providing prolonged wound support over 180 days. Sizes 0 to 5-0. Available through Leading Trading Est, SMI sole agent in Bahrain, for surgical procurement.',
  '69ce3b99963538de6902cf24': 'SMI Surgicryl PGA braided polyglycolic acid suture equivalent to Dexon for general tissue approximation and ligation. Complete absorption in 60–90 days. Sizes 0 to 5-0. Leading Trading Est is the SMI sole agent in Bahrain with full stock and quotation support.',
  '69ce3b99963538de6902cf25': 'SMI Surgicryl Rapid fast-absorbing braided synthetic suture for skin and mucosal closure where absorption in 10–14 days is required. No suture removal needed. Sizes 3-0 to 5-0. Leading Trading Est is the SMI sole agent in Bahrain for surgical consumable supply.',

  // Orthopedic & Rehabilitation
  '69ce3b99963538de6902cf00': 'Berger anti-embolism compression stockings for DVT prevention in surgical, immobile, and high-risk patients. Graduated compression. Available in S, M, L, and XL; knee-high and thigh-high options. Leading Trading Est sources Berger orthopaedic products for Bahrain hospitals and rehabilitation buyers.',
  '69ce3b99963538de6902cf0b': 'Berger elbow and forearm support braces for post-injury stabilization, lateral epicondylitis management, and compression therapy. Adjustable straps; breathable fabric. Available in S through XL. Available through Leading Trading Est for Bahrain orthopaedic supply procurement.',
  '69ce3b99963538de6902cf20': 'Berger lumbar and back support braces for post-injury stabilization, chronic lower back pain management, and postural correction. Rigid stays and adjustable compression panels. Available in multiple abdominal girth sizes. Available through Leading Trading Est Bahrain.',
  '69ce3b99963538de6902cee9': 'Berger aluminium and foam finger splints for mallet finger, PIP fracture immobilization, and joint stabilization post-injury. Malleable aluminium core with foam padding. Available in XS through L. Available through Leading Trading Est for Bahrain orthopaedic and rehabilitation procurement.',
  '69da45ad385ce47b93908dfd': 'SMI Flex self-adherent cohesive elastic bandage for wound compression, joint strapping, and injury support. No clips required; sticks to itself. Latex and latex-free versions in widths 2.5cm, 5cm, 7.5cm, and 10cm. Leading Trading Est is the SMI sole agent in Bahrain.',
  '69ce3b99963538de6902cf06': 'Berger paediatric neck and shoulder support collars and braces for soft tissue injury management and immobilization in children. Lightweight materials; multiple sizes for different age groups. Available through Leading Trading Est for Bahrain paediatric orthopaedic procurement.',
  '69ce3b99963538de6902cf07': 'Berger adjustable knee supports and hinged braces for ligament injury management, knee instability, and post-surgical support. Open and closed patella designs. Available in S through XL. Available through Leading Trading Est for Bahrain orthopaedic and rehabilitation procurement.',
  '69ce3b99963538de6902cf09': 'Berger soft cervical foam collars for neck muscle strain, minor whiplash management, and post-procedure positioning support. Available in S, M, L, and XL. Standard depth version. Available through Leading Trading Est for Bahrain orthopaedic and physiotherapy supply procurement.',
  '69ce3b99963538de6902cf52': 'Rigid and semi-rigid cervical collars for spinal immobilization during emergency transport, trauma assessment, and post-surgical neck support. Adjustable height; anterior opening for airway access. Available through Leading Trading Est for Bahrain emergency and orthopaedic procurement.',
  '69ce3b99963538de6902cee4': 'Medstar cotton crepe bandages for light compression, support dressing, and bandage retention in physiotherapy and wound care. Available in widths 5cm, 7.5cm, 10cm, and 15cm. Available through Leading Trading Est for Bahrain wound care and orthopaedic supply procurement.',
  '69ce3b99963538de6902cee6': 'Medstar soft orthopaedic cotton padding for lining under plaster casts, fiberglass splints, and traction systems. Available in widths 7.5cm and 10cm. Available through Leading Trading Est for Bahrain orthopaedic and casting supply procurement.',
  '69ce3b99963538de6902ceea': 'Lightweight waterproof fiberglass casting tape for fracture immobilization and orthopaedic moulding. Sets in 3–5 minutes; stronger and lighter than POP. Available in widths 5cm, 7.5cm, and 10cm. Available through Leading Trading Est for Bahrain orthopaedic supply procurement.',
  '69ce3b99963538de6902cee5': 'Medstar PBT conforming bandages for primary wound dressing retention, light compression, and supportive wrapping. Soft polyester-cotton blend conforms to contours. Available in widths 5cm, 7.5cm, and 10cm. Available through Leading Trading Est Bahrain.',
  '69ce3b99963538de6902cee8': 'Plaster of Paris casting bandages for fracture immobilization, orthopaedic splinting, and therapeutic moulding. Sets in 3–5 minutes. Available in widths 5cm, 10cm, 15cm, and 20cm. Available through Leading Trading Est for Bahrain orthopaedic procurement.',
  '69ce3b99963538de6902cee7': 'Medstar elastic tubular net bandages for retaining wound dressings on limbs, head, torso, and digits. Sizes 1 through 8 for different body areas. Available in rolls or pre-cut lengths. Available through Leading Trading Est for Bahrain wound care and dressing supply procurement.',

  // Hospital Furniture & Utilities
  '69ce3b99963538de6902cf26': 'Manual folding wheelchair for patient mobility in wards, outpatient departments, and rehabilitation areas. Padded armrests and footrests; 18-inch seat width; weight-bearing to 100kg. Available through Leading Trading Est for Bahrain hospital furniture and mobility equipment procurement.',
  '69d3da931b8a36726b17b8e0': 'Hospital-grade transparent acrylic infant cot for newborn and neonatal ward use. Allows full 360-degree visibility while providing a secure, cleanable resting surface. Available through Leading Trading Est for Bahrain maternity and neonatal unit equipment procurement.',
  '69d3da781b8a36726b17b8d2': 'Bedside patient locker with drawer and lockable cupboard for ward-side personal storage. Steel construction; easy-clean laminate surface; castors for positioning. Available through Leading Trading Est for Bahrain hospital furniture and ward equipment procurement.',
  '69d3d9ec1b8a36726b17b8be': 'Folding commode chair for patients with limited mobility requiring bedside toileting support. Removable bowl; padded seat; height-adjustable legs; foldable frame. Available through Leading Trading Est for Bahrain hospital, care facility, and home care equipment procurement.',
  '69ce3b99963538de6902cf51': 'Electrically adjustable hospital bed with backrest, leg-raise, and overall height adjustment via pendant handset. Side safety rails; IV pole socket; 200kg weight capacity. Available through Leading Trading Est for Bahrain hospital and long-term care facility furniture procurement.',
  '69d3da861b8a36726b17b8d2': 'Manual or hydraulic clinical examination couch for general practice, specialist clinics, and health assessment. Padded headrest with adjustable angle; roll-paper dispenser; height 75–85cm. Available through Leading Trading Est for Bahrain clinic furniture procurement.',
  '69d365ee35503489bc2188d8': 'Lightweight aluminium folding stretcher for patient transport, emergency response, and ward transfer operations. Folds flat for compact ambulance or equipment room storage. Available through Leading Trading Est for Bahrain emergency and hospital equipment procurement.',
  '69d3da9d1b8a36726b17b8e7': 'Three-panel foldable privacy screen on castors for patient examination areas, procedure rooms, and ward bays. Fabric panels; height approximately 180cm. Available through Leading Trading Est for Bahrain hospital and clinic furniture procurement.',
  '69d3daef1b8a36726b17b8fb': 'Lightweight clinical step stool for patient assistance during examination couch or high-bed access. Non-slip rubber surface; supports up to 150kg. Available through Leading Trading Est for Bahrain clinic and hospital utility equipment procurement.',
  '69ce3b99963538de6902cf19': 'Stainless steel two-shelf medical procedure trolley for instrument and supply management in clinical and theatre environments. Smooth welded finish; lockable castor wheels. Available through Leading Trading Est for Bahrain hospital trolley and clinical furniture procurement.',

  // Urology
  '69ce3b99963538de6902cec9': 'Two-way Foley urinary catheters in 100% silicone (long-term) or latex (short-term) for continuous urinary drainage. Available in sizes Fr 10 to Fr 26 with 5ml and 30ml balloon. Leading Trading Est supplies Foley catheters to Bahrain hospitals and urology departments.',
  '69ce3b99963538de6902cecc': 'PVC nasogastric (Ryles) feeding tubes for enteral nutrition delivery, medication administration, and gastric decompression. Radiopaque stripe; graduated length markings. Available in Fr 8 to Fr 18 for adult and paediatric patients. Available through Leading Trading Est Bahrain.',
  '69ce3b99963538de6902cec6': 'Single-use PVC Nelaton straight urinary catheters for intermittent catheterization and in-out bladder drainage in male and female patients. Funnel end; rounded tip. Available in Fr 8 to Fr 22. Available through Leading Trading Est for Bahrain urology and ward supply procurement.',
  '69ce3b99963538de6902cecf': 'Sterile self-adhesive urine collection bags for non-invasive urine sampling in neonates and infants. Separate male and female configurations; 100ml capacity. Available through Leading Trading Est for Bahrain paediatric and neonatal ward procurement.',
  '69ce3b99963538de6902cecd': 'Two-litre urine drainage bags with anti-reflux valve and outlet tap for use with indwelling urinary catheters. Drainable; sterile; bed-rail hanger included. Available through Leading Trading Est for Bahrain urology and ward consumable procurement.',
  '69d3db0d1b8a36726b17b902': 'Graduated male urinal bottle with spill-resistant lid for bedside urinary collection in post-operative and immobile patients. Polypropylene construction; 1L capacity; autoclavable. Available through Leading Trading Est for Bahrain ward and long-term care procurement.',
  '69d3d96f1b8a36726b17b8b0': 'Sterile midstream urine specimen containers with wide-mouth opening and leak-proof screw cap for clean-catch urine collection and laboratory analysis. Available in 60ml and 120ml. Available through Leading Trading Est for Bahrain laboratory and clinic procurement.',

  // Dental
  '69ce3b99963538de6902ceb0': 'Rogin Dental absorbent paper points for root canal drying, moisture absorption, and endodontic medication application. Standardized ISO sizes 15 to 80; colour-coded by size. Pack of 200. Leading Trading Est supplies Rogin Dental products to Bahrain dental centers and clinics.',
  '69ce3b99963538de6902ceb1': 'Zogear disposable air-water syringe tips for chairside moisture control and surface rinsing during dental procedures. Autoclavable or single-use plastic options. Box of 250. Available through Leading Trading Est for Bahrain dental supply procurement.',
  '69ce3b99963538de6902cf16': 'Zogear articulating paper in straight format for occlusal contact checking and bite analysis during restorative and prosthetic dental procedures. Blue and red options; 100µm thickness. Available through Leading Trading Est for Bahrain dental supply procurement.',
  '69ce3b99963538de6902cf2b': 'Rogin Dental barbed broaches with ergonomic plastic handle for pulp tissue removal and soft tissue debridement in root canal access preparation. Sizes XXF to C. Pack of 10 or 40. Available through Leading Trading Est for Bahrain dental endodontic supply procurement.',
  '69ce3b99963538de6902cf36': 'Rogin Dental tungsten carbide friction-grip (FG) burs for cavity preparation, crown reduction, and caries removal. Available in round, pear, fissure, tapered fissure, and inverted cone forms. Individually sterile or non-sterile packs. Available through Leading Trading Est Bahrain.',
  '69ce3b99963538de6902ceb2': 'Zogear stainless steel matrix bands for posterior composite and amalgam restorations, providing proper contour and proximal contact point during cavity fill and curing. Available in standard widths. Available through Leading Trading Est for Bahrain dental supply procurement.',
  '69ce3b99963538de6902cf45': 'Single-use dental injection needles in 25G, 27G, and 30G in short (25mm) and long (38mm) formats for intraoral local anaesthetic delivery. Compatible with standard dental cartridge syringes. Available through Leading Trading Est for Bahrain dental supply procurement.',
  '69ce3b99963538de6902cebd': 'Zogear denture storage boxes with secure lid for hygiene and transport of full and partial dentures. Available in standard (110 × 80mm) and compact sizes with ventilation holes. Available through Leading Trading Est for Bahrain dental clinic and prosthetics procurement.',
  '69ce3b99963538de6902cec8': 'Rogin Dental diamond-coated friction-grip (FG) burs for enamel finishing, full-crown preparation, and porcelain surface adjustment. Available in fine, medium, and coarse grit; round, flame, cylinder, and chamfer forms. Available through Leading Trading Est Bahrain.',
  '69ce3b99963538de6902cef4': 'Rogin Dental Gates Glidden drills and Peeso reamers for coronal root canal flaring and post-space preparation. Stainless steel; ISO sizes 1 to 6; friction-grip shank for handpiece use. Available through Leading Trading Est for Bahrain dental endodontic procurement.',
  '69ce3b99963538de6902cefd': 'Rogin Dental heated gutta percha cutter for sectioning and condensing GP during root canal obturation. Provides clean cut with minimal disruption to the obturation. Available through Leading Trading Est for Bahrain dental endodontic supply procurement.',
  '69ce3b99963538de6902cefe': 'Rogin Dental gutta percha obturation points for root canal filling. Standardized ISO sizes 15 to 80 and non-standardized taper profiles. Colour-coded by size. Pack of 120 or 60. Available through Leading Trading Est for Bahrain dental endodontic procurement.',
  '69ce3b99963538de6902ceff': 'Rogin Dental Hedstrom stainless steel endodontic files for root canal enlargement by linear cutting motion. Sizes 15 to 80 in 21mm, 25mm, and 31mm working lengths. Pack of 6. Available through Leading Trading Est for Bahrain dental endodontic supply procurement.',
  '69ce3b99963538de6902cf01': 'Zogear disposable dental chair headrest sleeve covers for single-patient use and cross-contamination prevention. Pre-cut non-woven; easy application. Box of 250. Available through Leading Trading Est for Bahrain dental clinic consumable and infection-control procurement.',
  '69ce3b99963538de6902cf02': 'Rogin Dental INO-Shaper reciprocating single-file NiTi endodontic system for efficient full canal preparation with one instrument. Reduces file fatigue and preparation steps. Available through Leading Trading Est for Bahrain dental rotary endodontic supply procurement.',
  '69ce3b99963538de6902cf05': 'Rogin Dental K-files in stainless steel for root canal length establishment and canal negotiation using watch-winding and reaming motion. Sizes 06 to 80 in 21mm, 25mm, and 31mm lengths. Available through Leading Trading Est for Bahrain dental endodontic procurement.',
  '69ce3b99963538de6902cf08': 'Rogin Dental natural rubber latex dental dam sheets for field isolation during endodontic, adhesive, and restorative dental procedures. Medium gauge; 6 × 6 inch standard size. Available through Leading Trading Est for Bahrain dental supply procurement.',
  '69da4f9a385ce47b93908e5a': 'Medstar disposable microbrush applicators for precise material placement in dental bonding, varnish, and liquid medication application. Available in regular and fine tip sizes. Pack of 100. Available through Leading Trading Est for Bahrain dental supply procurement.',
  '69ce3b99963538de6902cf0a': 'Rogin Dental Lentulo spiral paste carriers for root canal sealer and intracanal medication placement. Friction-grip shank; sizes 25 to 60; disposable single-use options. Available through Leading Trading Est for Bahrain dental endodontic procurement.',
  '69ce3b99963538de6902cf0d': 'Rogin Dental aluminium oxide polishing discs for composite resin finishing, surface recontouring, and enamel polishing. Coarse, medium, fine, and superfine grits; Sof-Lex compatible holder system. Available through Leading Trading Est Bahrain.',
  '69ce3b99963538de6902cf0e': 'Zogear poly-coated non-absorbent mixing pads for dental material mixing including cements, glass ionomers, and composite modifiers. 50 sheets per pad; sizes A4, A5, and pocket. Available through Leading Trading Est for Bahrain dental supply procurement.',
  '69ce3b99963538de6902cf10': 'Rogin Dental stainless steel reamers for initial root canal enlargement using rotary and watch-winding cutting motion. ISO sizes 15 to 80 in 21mm and 25mm lengths. Pack of 6. Available through Leading Trading Est for Bahrain dental endodontic procurement.',
  '69ce3b99963538de6902cf11': 'Rogin Dental Recip-One single-file NiTi reciprocating endodontic system for complete root canal shaping with minimal instrument stress. Reduces file separation risk in curved canals. Available through Leading Trading Est for Bahrain dental rotary endodontic supply.',
  '69ce3b99963538de6902cf12': 'Rogin Dental NiTi retreatment files for removal of existing gutta percha and sealer during root canal re-treatment. Three-file set (D1, D2, D3) for coronal, middle, and apical thirds. Available through Leading Trading Est for Bahrain dental endodontic procurement.',
  '69ce3b99963538de6902cf15': 'Zogear flexible disposable saliva ejectors for chairside moisture control during restorative, preventive, and examination procedures. Angled tip; colour-coded body. Box of 100. Available through Leading Trading Est for Bahrain dental clinic consumable procurement.',
  '69ce3b99963538de6902cf1a': 'Rogin Dental stainless steel endodontic pluggers for vertical condensation of warm and cold gutta percha during root canal obturation. Available in standard sizes A1, A2, and A3. Available through Leading Trading Est for Bahrain dental endodontic instrument procurement.',
  '69ce3b99963538de6902cf1b': 'Rogin Dental stainless steel lateral condensation spreaders for lateral compaction of gutta percha during root canal obturation. Available in finger and D-handle designs; sizes A, B, C, and D. Available through Leading Trading Est for Bahrain dental endodontic procurement.',
  '69ce3b99963538de6902cf1c': 'Rogin Dental Sup-Taper Aurora NiTi rotary files with progressive taper for efficient, predictable root canal shaping using continuous rotation. Reduces preparation steps and debris extrusion. Available through Leading Trading Est for Bahrain dental rotary endodontic supply.',
  '69ce3b99963538de6902cf1d': 'Rogin Dental Sup-Taper NiTi files for manual endodontic canal preparation where rotary motor handpiece use is not available or preferred. Flexible; multiple taper options. Available through Leading Trading Est for Bahrain dental endodontic procurement.',
  '69ce3b99963538de6902cf1e': 'Rogin Dental Super Flexi NiTi endodontic files for negotiating severely curved, calcified, or narrow root canals. High flexibility reduces the risk of file separation. Available through Leading Trading Est for Bahrain dental endodontic instrument procurement.',
  '69ce3b99963538de6902cf1f': 'Rogin Dental disposable surgical aspirator tips for high-volume saliva and blood evacuation during oral surgery, implant placement, and tooth extraction procedures. Autoclavable metal or single-use plastic. Available through Leading Trading Est Bahrain.',

  // Industrial & Safety
  '69ce3b99963538de6902cf13': 'Impact-resistant safety goggles for eye protection against chemical splash, dust, flying particles, and UV exposure in industrial, laboratory, and clinical environments. Adjustable strap; anti-fog lens; indirect ventilation. Available through Leading Trading Est Bahrain.',
  '69ce3b99963538de6902cf14': 'Safety footwear with steel toe cap (200 joule) and anti-slip sole for industrial, warehouse, construction, and operational site use. Available in standard men\'s and women\'s sizes. Available through Leading Trading Est for Bahrain industrial and safety supply procurement.',
};

// Suction connecting tubes has duplicate key issue — fix:
DESCRIPTIONS['69ce3b99963538de6902cf39_suction'] = DESCRIPTIONS['69ce3b99963538de6902cf37_2'];
delete DESCRIPTIONS['69ce3b99963538de6902cf37_2'];

// Correct the suction connecting tubes ID
DESCRIPTIONS['69ce3b99963538de6902cf39'] = 'Flexible PVC suction connecting tubing for linking suction catheters, Yankauer handles, and aspiration devices to wall or portable suction machines. Various lengths available. Available through Leading Trading Est for Bahrain clinical and respiratory consumable procurement.';

// ─── main ─────────────────────────────────────────────────────────────────────

const fetchProduct = async (id) => {
  const res = await fetch(`${API}/products/${id}`);
  if (!res.ok) throw new Error(`GET ${id} → ${res.status}`);
  return res.json();
};

const updateDescription = async (id, newDesc) => {
  const current = await fetchProduct(id);
  const body = { ...current, description: newDesc };
  const res = await fetch(`${API}/products/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`PUT ${id} → ${res.status}: ${JSON.stringify(data)}`);
  return data;
};

const main = async () => {
  const entries = Object.entries(DESCRIPTIONS).filter(([id]) => !id.includes('_'));
  console.log(`\nUpdating ${entries.length} products...\n`);

  let updated = 0;
  let failed = 0;
  const failures = [];

  for (const [id, desc] of entries) {
    try {
      await updateDescription(id, desc);
      updated++;
      if (updated % 10 === 0) process.stdout.write(`  ${updated}/${entries.length}...\n`);
      await delay(300); // be gentle on the API
    } catch (err) {
      failed++;
      failures.push(`${id}: ${err.message}`);
      console.error(`  FAILED ${id}: ${err.message}`);
    }
  }

  console.log(`\n✓ Done. Updated: ${updated}  Failed: ${failed}`);
  if (failures.length) {
    console.log('\nFailed IDs:');
    failures.forEach(f => console.log(' ', f));
  }
};

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
