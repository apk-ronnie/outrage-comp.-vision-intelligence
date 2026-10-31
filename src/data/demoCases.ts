import { DiagnosisRecord } from '../types/agrilens';

// High-fidelity SVG visual proxies representing actual field specimens
function createLeafSvg(type: 'early_blight' | 'rice_blast' | 'potato_late_blight' | 'cotton_curl' | 'healthy_wheat'): string {
  if (type === 'early_blight') {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
        <defs>
          <radialGradient id="halo1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#3d2010" />
            <stop offset="45%" stop-color="#704214" />
            <stop offset="70%" stop-color="#b08a28" />
            <stop offset="100%" stop-color="#3f6f3a" stop-opacity="0" />
          </radialGradient>
          <radialGradient id="halo2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#2c140a" />
            <stop offset="50%" stop-color="#693b16" />
            <stop offset="75%" stop-color="#c9a032" />
            <stop offset="100%" stop-color="#3f6f3a" stop-opacity="0" />
          </radialGradient>
        </defs>
        <rect width="500" height="500" fill="#2d281e" />
        <!-- Leaf Silhouette -->
        <path d="M 250,40 C 370,120 420,280 280,440 C 230,470 210,480 200,490 C 210,430 180,380 130,340 C 60,260 80,120 250,40 Z" fill="#467c3b" stroke="#315829" stroke-width="6"/>
        <!-- Main Vein -->
        <path d="M 250,50 Q 235,260 205,480" stroke="#7eb866" stroke-width="7" fill="none" stroke-linecap="round"/>
        <!-- Lateral Veins -->
        <path d="M 245,120 Q 320,160 365,190" stroke="#6ca655" stroke-width="3" fill="none"/>
        <path d="M 240,170 Q 170,210 120,240" stroke="#6ca655" stroke-width="3" fill="none"/>
        <path d="M 235,240 Q 310,280 340,320" stroke="#6ca655" stroke-width="3" fill="none"/>
        <path d="M 225,310 Q 170,350 140,380" stroke="#6ca655" stroke-width="3" fill="none"/>
        <!-- Lesion 1: Alternaria solani Concentric Target Rings -->
        <circle cx="210" cy="200" r="48" fill="url(#halo1)" />
        <ellipse cx="210" cy="200" rx="36" ry="32" fill="#583112" stroke="#8a4f1d" stroke-width="3"/>
        <ellipse cx="210" cy="200" rx="26" ry="22" fill="#3b1f09" stroke="#663b15" stroke-width="2"/>
        <ellipse cx="210" cy="200" rx="14" ry="12" fill="#221004" stroke="#46250b" stroke-width="2"/>
        <circle cx="210" cy="200" r="4" fill="#0f0702"/>
        <!-- Lesion 2: Secondary Target Spot -->
        <circle cx="310" cy="260" r="38" fill="url(#halo2)" />
        <ellipse cx="310" cy="260" rx="28" ry="24" fill="#5a3314" stroke="#8c511f" stroke-width="3"/>
        <ellipse cx="310" cy="260" rx="18" ry="15" fill="#3d210b" stroke="#6e3e18" stroke-width="2"/>
        <circle cx="310" cy="260" r="6" fill="#1f0f03"/>
        <!-- Minor necrotic specks -->
        <circle cx="270" cy="150" r="8" fill="#46260d" />
        <circle cx="170" cy="290" r="10" fill="#46260d" />
      </svg>
    `);
  }
  if (type === 'rice_blast') {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
        <rect width="500" height="500" fill="#1b241c" />
        <!-- Rice Blade -->
        <path d="M 230,20 C 270,140 280,300 240,480 L 210,480 C 240,300 230,140 200,20 Z" fill="#5b9347" stroke="#3b692c" stroke-width="4"/>
        <path d="M 225,20 L 225,480" stroke="#79ba60" stroke-width="4" fill="none"/>
        <!-- Spindle shaped diamond lesions with grey centers and brown borders -->
        <path d="M 235,160 C 255,180 255,210 235,230 C 215,210 215,180 235,160 Z" fill="#c4b897" stroke="#783416" stroke-width="5"/>
        <ellipse cx="235" cy="195" rx="7" ry="16" fill="#9e9784"/>
        <path d="M 225,280 C 248,295 248,325 225,340 C 202,325 202,295 225,280 Z" fill="#c7bb9c" stroke="#6e2e12" stroke-width="4"/>
        <ellipse cx="225" cy="310" rx="6" ry="14" fill="#a19b88"/>
      </svg>
    `);
  }
  if (type === 'potato_late_blight') {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
        <rect width="500" height="500" fill="#1e221b" />
        <!-- Potato Leaf -->
        <path d="M 250,50 C 390,100 410,290 300,430 C 240,465 210,470 200,480 C 205,420 160,370 120,320 C 50,230 110,90 250,50 Z" fill="#44733b" stroke="#2b5223" stroke-width="5"/>
        <path d="M 240,60 Q 235,260 210,470" stroke="#74b05a" stroke-width="6" fill="none"/>
        <!-- Water-soaked dark necrotic blotch -->
        <path d="M 260,140 Q 360,160 370,260 Q 340,320 270,300 Q 220,270 230,200 Q 240,150 260,140 Z" fill="#282218" stroke="#4a3e29" stroke-width="6"/>
        <!-- Pale water-soaked margin -->
        <path d="M 250,130 Q 375,150 385,265 Q 355,335 265,315 Q 210,280 220,195 Q 230,140 250,130 Z" fill="none" stroke="#a3b35f" stroke-width="5" stroke-dasharray="8,4"/>
      </svg>
    `);
  }
  if (type === 'cotton_curl') {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
        <rect width="500" height="500" fill="#20231e" />
        <!-- Cotton Palmate Leaf with Upward Cupping -->
        <path d="M 250,70 L 320,170 L 420,180 L 340,270 L 360,390 L 250,330 L 140,390 L 160,270 L 80,180 L 180,170 Z" fill="#699b4f" stroke="#487834" stroke-width="6"/>
        <!-- Hypertrophied Thickened Veins -->
        <path d="M 250,330 L 250,85" stroke="#a9e08b" stroke-width="8" fill="none"/>
        <path d="M 250,300 L 400,190" stroke="#a9e08b" stroke-width="7" fill="none"/>
        <path d="M 250,300 L 100,190" stroke="#a9e08b" stroke-width="7" fill="none"/>
        <path d="M 250,310 L 345,370" stroke="#9dd480" stroke-width="6" fill="none"/>
        <path d="M 250,310 L 155,370" stroke="#9dd480" stroke-width="6" fill="none"/>
        <!-- Cupped margin shading -->
        <path d="M 120,210 Q 250,290 380,210" stroke="#40632d" stroke-width="12" fill="none" opacity="0.6"/>
      </svg>
    `);
  }
  // healthy_wheat
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
      <rect width="500" height="500" fill="#1b241d" />
      <path d="M 210,480 Q 240,250 290,30 L 310,35 Q 260,255 230,480 Z" fill="#5ca846" stroke="#417d30" stroke-width="4"/>
      <path d="M 170,480 Q 210,310 150,110 L 165,105 Q 225,305 185,480 Z" fill="#68b850" stroke="#4a8a37" stroke-width="3"/>
      <path d="M 270,480 Q 275,340 370,160 L 385,168 Q 290,345 285,480 Z" fill="#62b04c" stroke="#468535" stroke-width="3"/>
    </svg>
  `);
}

export const DEMO_CASES: DiagnosisRecord[] = [
  {
    id: 'demo_case_01',
    requestId: 'diag_demo_tomatoblight',
    timestamp: '2026-10-30T10:15:00Z',
    imageUri: createLeafSvg('early_blight'),
    cropName: 'Tomato (Solanum lycopersicum)',
    conditionCategory: 'diseased',
    conditionName: 'Early Blight (Alternaria solani)',
    pathogenType: 'fungal',
    confidenceScore: 0.94,
    confidenceLevel: 'high',
    severityEstimate: 'moderate',
    visibleSymptoms: [
      'Circular to oval dark brown necrotic lesions exhibiting classic concentric "target-board" rings.',
      'Prominent chlorotic (yellow) halos encircling mature lesions caused by alternaric acid phytotoxin.',
      'Symptom progression initiating from the lower, physiologically mature leaflets.',
      'Marginal coalescing of necrotic tissue leading to partial leaflet senescence.',
    ],
    symptomRegions: [
      {
        regionName: 'Primary Target Lesion',
        description: 'Distinct concentric brown rings with yellow halo on mid-lamina.',
        boxNormalized: [320, 360, 520, 520],
      },
      {
        regionName: 'Secondary Lesion',
        description: 'Expanding secondary necrotic patch along lateral vein axis.',
        boxNormalized: [460, 560, 620, 700],
      },
    ],
    diagnosticEvidence:
      'The concentric dark brown rings (bullseye pattern) accompanied by marked chlorotic zones on tomato foliage are morphological hallmarks of Alternaria solani. The lesions originate on older leaves during warm, humid conditions.',
    diagnosticLimitations: [
      'Visual leaf photography cannot differentiate with 100% molecular certainty between Alternaria solani and Alternaria alternata without laboratory spore microscopy.',
      'Bacterial speck (Pseudomonas syringae) may occasionally produce small dark spots before concentric rings form.',
      'Stem canker and collar rot symptoms cannot be verified from a single foliar photograph.',
    ],
    isUncertain: false,
    advisory: {
      aiObservation:
        'Foliar inspection reveals characteristic concentric necrotic target spots with chlorotic margins indicative of Alternaria solani fungal infection at moderate severity.',
      potentialDiagnosis:
        'Early Blight (Alternaria solani). Favored by temperatures between 24°C–29°C and prolonged leaf wetness (>8 hours).',
      fieldInspectionSteps: [
        'Check the lower canopy of adjacent tomato plants for similar concentric target spots.',
        'Inspect stems and petioles for dark, elongated sunken cankers.',
        'Examine fruit calyxes and green fruit shoulders for dark leathery sunken lesions.',
      ],
      culturalPractices: [
        'Prune and destroy heavily infected lower leaflets; bury or burn plant debris away from the field.',
        'Shift irrigation to drip systems or early morning furrow watering to minimize canopy wetness duration.',
        'Maintain 60 cm plant-to-plant spacing and stake indeterminate varieties for optimal airflow.',
      ],
      biologicalControls: [
        'Soil application of Trichoderma viride or Trichoderma harzianum enriched farmyard manure (2.5 kg/ha).',
        'Foliar spray of Pseudomonas fluorescens (0.5% formulation) at 10-day intervals as a preventive bio-barrier.',
        'Neem seed kernel extract (NSKE 5%) foliar spray to suppress spore germination.',
      ],
      approvedManagementGuidance: [
        'Refer to state agricultural university package of practices (e.g., TNAU / PAU) for registered protective fungicides such as Mancozeb 75 WP or Chlorothalonil 75 WP.',
        'In persistent high-humidity conditions, registered systemic fungicides (e.g., Azoxystrobin + Difenoconazole) may be scheduled according to local extension advisories.',
        'Always adhere strictly to statutory waiting periods (pre-harvest intervals) before picking fruit.',
      ],
      safetyAndPpeWarnings: [
        'Always wear nitrile gloves, protective eye goggles, and a respiratory mask when handling spray equipment.',
        'Do not spray during peak midday heat or when wind exceeds 10 km/h to prevent spray drift onto non-target crops.',
      ],
      whenToConsultExpert:
        'If necrotic lesions exceed 25% of canopy foliage or begin appearing on fruit calyxes within 5 days of cultural sanitation, contact your local Krishi Vigyan Kendra (KVK).',
      authoritativeReferences: [
        'Indian Council of Agricultural Research (ICAR) - Crop Protection Bulletin No. 42 (Tomato)',
        'Tamil Nadu Agricultural University (TNAU) Agritech Portal - Integrated Disease Management',
        'Punjab Agricultural University (PAU) Vegetable Production Guidelines',
      ],
    },
    modelInfo: {
      modelName: 'gemini-3.8-flash',
      pipeline: 'AgriLens Multimodal Vision v2.4 (Benchmark Case)',
      inferenceLatencyMs: 410,
    },
    fieldAssociation: {
      fieldId: 'FIELD-NORTH-01',
      plantId: 'PLT-B03',
    },
    notes: 'Sample benchmark case curated for ICAR validation standard.',
    isDemoCase: true,
  },
  {
    id: 'demo_case_02',
    requestId: 'diag_demo_riceblast',
    timestamp: '2026-10-30T10:20:00Z',
    imageUri: createLeafSvg('rice_blast'),
    cropName: 'Rice / Paddy (Oryza sativa)',
    conditionCategory: 'diseased',
    conditionName: 'Rice Blast (Magnaporthe oryzae)',
    pathogenType: 'fungal',
    confidenceScore: 0.91,
    confidenceLevel: 'high',
    severityEstimate: 'moderate',
    visibleSymptoms: [
      'Spindle-shaped / diamond-shaped lesions with ash-grey or whitish centers and dark reddish-brown borders.',
      'Lesions oriented parallel to the longitudinal leaf venation.',
      'Coalescing of multiple lesions on the leaf blade causing apical blighting and desiccated leaf tips.',
    ],
    symptomRegions: [
      {
        regionName: 'Spindle Blast Lesion',
        description: 'Classic eye-shaped lesion with necrotic center and reddish border.',
        boxNormalized: [320, 420, 460, 520],
      },
    ],
    diagnosticEvidence:
      'The spindle-shaped lesions with grey center and dark margin on narrow rice leaf blades are the hallmark of Magnaporthe oryzae (Pyricularia oryzae). Common during high nitrogen application coupled with cool nights and cloudy days.',
    diagnosticLimitations: [
      'Brown Spot (Bipolaris oryzae) produces smaller oval spots without distinct pointed spindle tips, but can co-occur in poor nutrient soils.',
      'Neck blast and nodal blast must be physically inspected at the panicle emergence stage.',
    ],
    isUncertain: false,
    advisory: {
      aiObservation:
        'Distinct spindle-shaped foliar lesions with characteristic necrotic borders confirming foliar blast in paddy.',
      potentialDiagnosis:
        'Rice Foliar Blast (Magnaporthe oryzae / Pyricularia oryzae).',
      fieldInspectionSteps: [
        'Scout 20 random hills across the field in a "W" pattern.',
        'Inspect leaf collar and flag leaf during booting/panicle emergence.',
        'Check nodes and neck regions for dark brown constrictions (neck blast warning).',
      ],
      culturalPractices: [
        'Avoid excessive split applications of nitrogenous fertilizer (urea); balance with potash (MOP).',
        'Maintain a shallow water layer (2-5 cm) to reduce moisture stress predisposing plants to infection.',
        'Clear paddy bund weeds which act as alternate collateral hosts for the fungus.',
      ],
      biologicalControls: [
        'Seed treatment and nursery seedling dip with Pseudomonas fluorescens (10g/kg seed).',
        'Foliar spray of bio-formulations containing Bacillus subtilis at early tillering.',
      ],
      approvedManagementGuidance: [
        'Refer to ICAR-National Rice Research Institute (NRRI) protocols for registered fungicides (e.g., Tricyclazole 75 WP or Isoprothiolane 40 EC).',
        'Apply sprays early in the morning before sun evaporates systemic uptake droplets.',
      ],
      safetyAndPpeWarnings: [
        'Do not release spray drainage water directly into natural fish ponds or aquaculture canals.',
        'Wear full protective boots and gloves while spraying standing water fields.',
      ],
      whenToConsultExpert:
        'Seek emergency extension assistance if spindle lesions cover >5% of flag leaf area before heading stage.',
      authoritativeReferences: [
        'ICAR-National Rice Research Institute (NRRI), Cuttack - Blast Management Manual',
        'Directorate of Rice Research (IIRR), Hyderabad',
      ],
    },
    modelInfo: {
      modelName: 'gemini-3.8-flash',
      pipeline: 'AgriLens Multimodal Vision v2.4 (Benchmark Case)',
      inferenceLatencyMs: 380,
    },
    fieldAssociation: {
      fieldId: 'FIELD-NORTH-01',
      plantId: 'PLT-C06',
    },
    notes: 'Benchmark case: Rice leaf blast with spindle morphology.',
    isDemoCase: true,
  },
  {
    id: 'demo_case_03',
    requestId: 'diag_demo_potatoblight',
    timestamp: '2026-10-30T10:25:00Z',
    imageUri: createLeafSvg('potato_late_blight'),
    cropName: 'Potato (Solanum tuberosum)',
    conditionCategory: 'diseased',
    conditionName: 'Late Blight (Phytophthora infestans)',
    pathogenType: 'fungal',
    confidenceScore: 0.96,
    confidenceLevel: 'high',
    severityEstimate: 'severe',
    visibleSymptoms: [
      'Large, irregular, water-soaked necrotic patches rapidly turning purplish-brown to black.',
      'Pale green or yellowish translucent borders encircling the wet rot margins.',
      'Rapid leaflet blighting under low temperature (15°C–20°C) and relative humidity (>90%).',
    ],
    symptomRegions: [
      {
        regionName: 'Water-soaked Necrosis',
        description: 'Large irregular blotch with chlorotic translucent boundary.',
        boxNormalized: [280, 450, 650, 780],
      },
    ],
    diagnosticEvidence:
      'Water-soaked dark lesions with diffuse pale margins rapidly consuming leaf area are characteristic of the oomycete Phytophthora infestans. Under morning dew, fine white downy mildew growth is visible on the abaxial (underside) surface.',
    diagnosticLimitations: [
      'Late blight can destroy an entire field within 7–10 days; photographic visual diagnosis must be followed by immediate field quarantine inspection.',
      'Tuber rot cannot be evaluated from foliar photographs alone.',
    ],
    isUncertain: false,
    advisory: {
      aiObservation:
        'High-priority necrotic water-soaked lesion matching Phytophthora infestans late blight profile.',
      potentialDiagnosis:
        'Late Blight of Potato (Phytophthora infestans) - Oomycete class.',
      fieldInspectionSteps: [
        'Examine the underside of symptomatic leaves during early morning hours for white cottony sporulation.',
        'Inspect stems for dark brown girdling lesions.',
        'Dig sample tubers in affected patch to check for dry granular copper-brown rot under the skin.',
      ],
      culturalPractices: [
        'Cease overhead sprinkler irrigation immediately.',
        'Earth up soil ridges to create a 10 cm soil barrier preventing spores from washing into developing tubers.',
        'Cut and destroy (dehaulm) infected potato vines 10-14 days prior to harvest.',
      ],
      biologicalControls: [
        'Prophylactic applications of bio-agents like Trichoderma viride can slow secondary spread in organic systems.',
      ],
      approvedManagementGuidance: [
        'Prophylactic protection with Mancozeb 75 WP or Cymoxanil + Mancozeb formulations per ICAR-CPRI recommendations.',
        'Ensure comprehensive coverage of both upper and lower leaf surfaces.',
      ],
      safetyAndPpeWarnings: [
        'Use proper respirators and eye protection; observe withholding period prior to tuber lifting.',
      ],
      whenToConsultExpert:
        'Late blight is a community-level threat; notify neighboring farms and district agriculture officer immediately upon verification.',
      authoritativeReferences: [
        'ICAR-Central Potato Research Institute (CPRI), Shimla - Late Blight Warning System',
      ],
    },
    modelInfo: {
      modelName: 'gemini-3.8-flash',
      pipeline: 'AgriLens Multimodal Vision v2.4 (Benchmark Case)',
      inferenceLatencyMs: 440,
    },
    fieldAssociation: {
      fieldId: 'FIELD-NORTH-01',
      plantId: 'PLT-D02',
    },
    notes: 'Priority alert benchmark case: Potato late blight.',
    isDemoCase: true,
  },
  {
    id: 'demo_case_04',
    requestId: 'diag_demo_cottoncurl',
    timestamp: '2026-10-30T10:30:00Z',
    imageUri: createLeafSvg('cotton_curl'),
    cropName: 'Cotton (Gossypium hirsutum)',
    conditionCategory: 'diseased',
    conditionName: 'Cotton Leaf Curl Virus (CLCuV)',
    pathogenType: 'viral',
    confidenceScore: 0.89,
    confidenceLevel: 'high',
    severityEstimate: 'moderate',
    visibleSymptoms: [
      'Upward and downward curling of leaf margins creating a cup-like appearance.',
      'Marked thickening and swelling of main and secondary veins on the lower leaf surface.',
      'Enation (leaf-like outgrowths) occasionally forming along veins under severe viral load.',
      'Stunted terminal shoot growth and shortened internodes.',
    ],
    symptomRegions: [
      {
        regionName: 'Hypertrophied Vein & Curl',
        description: 'Swollen network of primary veins with upward margin curling.',
        boxNormalized: [200, 200, 750, 750],
      },
    ],
    diagnosticEvidence:
      'Upward leaf cupping paired with hypertrophied, swollen dark green veins is diagnostic of Cotton Leaf Curl Begomovirus, transmitted primarily by the whitefly vector (Bemisia tabaci).',
    diagnosticLimitations: [
      'Phenoxy herbicide injury (e.g. 2,4-D drift) can cause strap-like curling, but does not induce continuous vein swelling or enations.',
      'Severe aphid or jassid infestation can cause leaf crumpling, requiring checking for insect presence under leaf surfaces.',
    ],
    isUncertain: false,
    advisory: {
      aiObservation:
        'Foliar deformation showing typical begomovirus vein thickening and leaf curling.',
      potentialDiagnosis:
        'Cotton Leaf Curl Virus (CLCuV), transmitted by Whitefly (Bemisia tabaci).',
      fieldInspectionSteps: [
        'Turn over 10 leaves across the canopy to count adult whiteflies and nymphs.',
        'Check field borders for weed hosts like Abutilon indicum and Xanthium strumarium.',
      ],
      culturalPractices: [
        'Eradicate infected plants (roguing) during the first 45 days after sowing to suppress virus reservoirs.',
        'Install yellow sticky traps (15-20 traps per hectare) 15 cm above crop canopy for whitefly monitoring.',
        'Grow barrier crops (such as 2-3 rows of pearl millet, maize, or sorghum) around cotton fields.',
      ],
      biologicalControls: [
        'Conserve natural predators such as ladybird beetles and chrysoperla.',
        'Foliar spray of Verticillium lecanii or Beauveria bassiana (5g/liter) during humid morning conditions.',
      ],
      approvedManagementGuidance: [
        'Direct management is focused on vector control rather than viricides. Use ICAR-CICR recommended whitefly management schedules (e.g., Pyriproxyfen or Diafenthiuron if whitefly crosses economic threshold level of 6-8 adults/leaf).',
      ],
      safetyAndPpeWarnings: [
        'Do not spray neonics indiscriminately during blooming to safeguard honeybees and wild pollinators.',
      ],
      whenToConsultExpert:
        'Consult state agricultural university extension if vector population exceeds ETL across >20% of plants.',
      authoritativeReferences: [
        'ICAR-Central Institute for Cotton Research (CICR), Nagpur',
        'Punjab Agricultural University (PAU) Cotton Protection Advisory',
      ],
    },
    modelInfo: {
      modelName: 'gemini-3.8-flash',
      pipeline: 'AgriLens Multimodal Vision v2.4 (Benchmark Case)',
      inferenceLatencyMs: 395,
    },
    fieldAssociation: {
      fieldId: 'FIELD-NORTH-01',
      plantId: 'PLT-A05',
    },
    notes: 'Benchmark case: Viral leaf curl with insect vector dynamics.',
    isDemoCase: true,
  },
  {
    id: 'demo_case_05',
    requestId: 'diag_demo_healthywheat',
    timestamp: '2026-10-30T10:35:00Z',
    imageUri: createLeafSvg('healthy_wheat'),
    cropName: 'Wheat (Triticum aestivum)',
    conditionCategory: 'healthy',
    conditionName: 'Healthy Crop Foliage',
    pathogenType: 'none',
    confidenceScore: 0.97,
    confidenceLevel: 'high',
    severityEstimate: 'none',
    visibleSymptoms: [
      'Uniform deep green chlorophyll distribution across the leaf blade.',
      'No necrotic spots, rust pustules, powdery mildew lesions, or chlorotic streaking.',
      'Healthy turgid lamina with regular parallel venation.',
    ],
    symptomRegions: [],
    diagnosticEvidence:
      'The leaf exhibits optimal physiological turgor, uniform chlorophyll saturation, and an absence of biotic pathogens (Puccinia rusts, Blumeria mildew) or abiotic nutrient streaks.',
    diagnosticLimitations: [
      'Visual health at vegetative stage does not preclude latent crown infections or root-knot nematode activity in rhizosphere.',
      'Regular scouting remains essential through flag leaf and heading stages.',
    ],
    isUncertain: false,
    advisory: {
      aiObservation:
        'Plant foliage appears vibrant, well-nourished, and free of visible fungal, bacterial, or viral disease symptoms.',
      potentialDiagnosis:
        'Healthy standing wheat crop at active vegetative tillering stage.',
      fieldInspectionSteps: [
        'Maintain routine weekly scouting, specifically checking the lower leaf sheaths for early signs of yellow rust (Puccinia striiformis).',
        'Monitor crown root initiation (CRI) moisture levels.',
      ],
      culturalPractices: [
        'Ensure timely irrigation at critical growth stages: Crown Root Initiation (20-25 DAS) and Flowering.',
        'Keep field borders weed-free to prevent aphid migration.',
      ],
      biologicalControls: [
        'No corrective pesticide intervention needed. Foster beneficial ground beetles and parasitoid wasps.',
      ],
      approvedManagementGuidance: [
        'Follow recommended fertilizer schedule (NPK 120:60:40 kg/ha or as per soil health card).',
        'Avoid unnecessary prophylactic pesticide spraying to protect beneficial soil microflora.',
      ],
      safetyAndPpeWarnings: [
        'Store all farm inputs in dry, elevated, locked farm storage away from children and livestock.',
      ],
      whenToConsultExpert:
        'Notify your agricultural extension officer if orange-yellow linear pustule stripes emerge on upper leaves.',
      authoritativeReferences: [
        'ICAR-Indian Institute of Wheat and Barley Research (IIWBR), Karnal',
      ],
    },
    modelInfo: {
      modelName: 'gemini-3.8-flash',
      pipeline: 'AgriLens Multimodal Vision v2.4 (Benchmark Case)',
      inferenceLatencyMs: 350,
    },
    fieldAssociation: {
      fieldId: 'FIELD-NORTH-01',
      plantId: 'PLT-A01',
    },
    notes: 'Benchmark case: Verified healthy crop baseline.',
    isDemoCase: true,
  },
];
