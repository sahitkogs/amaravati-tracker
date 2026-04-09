const LOCATIONS = [
  {
    id: "loc_001", name: "AP Secretariat Complex", nameLocal: "ఏపీ సచివాలయం",
    category: "government", lat: 16.5062, lng: 80.5099, status: "under_construction",
    description: "Main administrative headquarters for the AP state government, being constructed as the centerpiece of the new capital.",
    searchKeywords: "Amaravati Secretariat building construction update", lastUpdated: "2026-03-15"
  },
  {
    id: "loc_002", name: "AP Legislative Assembly", nameLocal: "ఏపీ శాసనసభ",
    category: "government", lat: 16.5105, lng: 80.5165, status: "under_construction",
    description: "State legislative assembly building, designed as an iconic structure for AP's democratic proceedings in the new capital.",
    searchKeywords: "Amaravati Legislative Assembly building construction", lastUpdated: "2026-03-15"
  },
  {
    id: "loc_003", name: "AP High Court", nameLocal: "ఏపీ హైకోర్టు",
    category: "government", lat: 16.5180, lng: 80.5050, status: "planned",
    description: "Proposed High Court of AP to be relocated to the new capital city of Amaravati.",
    searchKeywords: "Amaravati High Court AP construction latest", lastUpdated: "2026-03-01"
  },
  {
    id: "loc_004", name: "Seed Access Road (SAR) — Segment 1", nameLocal: "సీడ్ యాక్సెస్ రోడ్",
    category: "road", lat: 16.5215, lng: 80.4950, status: "completed",
    description: "Critical initial road infrastructure connecting Amaravati capital area to NH-5.",
    searchKeywords: "Amaravati seed access road completed", lastUpdated: "2026-02-20"
  },
  {
    id: "loc_005", name: "Vijayawada-Amaravati Expressway", nameLocal: "విజయవాడ-అమరావతి ఎక్స్‌ప్రెస్‌వే",
    category: "road", lat: 16.5290, lng: 80.5480, status: "under_construction",
    description: "High-speed expressway corridor connecting Vijayawada city to the new Amaravati capital region.",
    searchKeywords: "Vijayawada Amaravati expressway construction update 2026", lastUpdated: "2026-03-10"
  },
  {
    id: "loc_006", name: "Capital Region Inner Ring Road", nameLocal: "రాజధాని ఇన్నర్ రింగ్ రోడ్",
    category: "road", lat: 16.5050, lng: 80.5250, status: "under_construction",
    description: "Internal ring road encircling the core capital area for seamless connectivity between major zones.",
    searchKeywords: "Amaravati inner ring road construction progress", lastUpdated: "2026-03-05"
  },
  {
    id: "loc_007", name: "Krishna River Bridge (New)", nameLocal: "కృష్ణా నది వంతెన",
    category: "bridge", lat: 16.5095, lng: 80.5520, status: "under_construction",
    description: "New bridge across the Krishna river connecting Amaravati capital zone to Vijayawada side.",
    searchKeywords: "Krishna river new bridge Amaravati Vijayawada construction", lastUpdated: "2026-03-12"
  },
  {
    id: "loc_008", name: "Kanaka Durga Flyover Extension", nameLocal: "కనకదుర్గ ఫ్లైఓవర్",
    category: "bridge", lat: 16.5170, lng: 80.6170, status: "completed",
    description: "Extended flyover near the iconic Kanaka Durga temple, improving traffic flow between Vijayawada and Amaravati.",
    searchKeywords: "Kanaka Durga flyover Vijayawada extension completed", lastUpdated: "2026-01-20"
  },
  {
    id: "loc_009", name: "Icons of Amaravati (Towers)", nameLocal: "అమరావతి ఐకాన్స్",
    category: "commercial", lat: 16.5135, lng: 80.5090, status: "planned",
    description: "Proposed iconic tower structures as the visual landmark of the new capital. Mixed-use development.",
    searchKeywords: "Icons of Amaravati towers landmark construction", lastUpdated: "2026-02-15"
  },
  {
    id: "loc_010", name: "Krishna Riverfront Development", nameLocal: "కృష్ణా రివర్‌ఫ్రంట్",
    category: "commercial", lat: 16.5040, lng: 80.5180, status: "under_construction",
    description: "Riverfront beautification along the Krishna river, including promenades, parks, and commercial spaces.",
    searchKeywords: "Amaravati Krishna riverfront development progress", lastUpdated: "2026-03-08"
  },
  {
    id: "loc_011", name: "AIIMS Mangalagiri", nameLocal: "ఎయిమ్స్ మంగళగిరి",
    category: "government", lat: 16.4310, lng: 80.5530, status: "under_construction",
    description: "All India Institute of Medical Sciences campus at Mangalagiri, a premier medical institution near the new capital.",
    searchKeywords: "AIIMS Mangalagiri Amaravati construction update", lastUpdated: "2026-03-14"
  },
  {
    id: "loc_012", name: "Amaravati Government Housing", nameLocal: "ప్రభుత్వ గృహ సముదాయం",
    category: "residential", lat: 16.5190, lng: 80.5110, status: "under_construction",
    description: "Government employee housing colonies for officials and staff relocating to the new capital.",
    searchKeywords: "Amaravati government housing colony construction", lastUpdated: "2026-02-28"
  },
  {
    id: "loc_013", name: "Amaravati Solar Power Plant", nameLocal: "సోలార్ విద్యుత్ కేంద్రం",
    category: "utility", lat: 16.4890, lng: 80.4750, status: "completed",
    description: "Solar power generation facility providing renewable energy to the capital region.",
    searchKeywords: "Amaravati solar power plant renewable energy", lastUpdated: "2026-01-10"
  },
  {
    id: "loc_014", name: "Capital Water Supply Project", nameLocal: "రాజధాని నీటి సరఫరా",
    category: "utility", lat: 16.5000, lng: 80.4920, status: "under_construction",
    description: "Major water supply infrastructure including intake wells, treatment plants, and distribution network.",
    searchKeywords: "Amaravati capital water supply project construction", lastUpdated: "2026-03-01"
  },
  {
    id: "loc_015", name: "Seed Access Road — Segment 2", nameLocal: "సీడ్ యాక్సెస్ రోడ్ 2",
    category: "road", lat: 16.4970, lng: 80.5150, status: "under_construction",
    description: "Second major segment of the seed access road network, expanding connectivity within the capital zone.",
    searchKeywords: "Amaravati seed access road phase 2 construction", lastUpdated: "2026-03-06"
  },
  {
    id: "loc_016", name: "Amaravati IT Hub / Startup Area", nameLocal: "ఐటీ హబ్",
    category: "commercial", lat: 16.5230, lng: 80.5310, status: "planned",
    description: "Planned IT and startup park zone, aimed at attracting tech companies to the capital region.",
    searchKeywords: "Amaravati IT hub startup park development", lastUpdated: "2026-02-20"
  },
  {
    id: "loc_017", name: "Undavalli-Penumaka Arterial Road", nameLocal: "ఉండవల్లి-పెనుమాక రోడ్",
    category: "road", lat: 16.4950, lng: 80.5420, status: "under_construction",
    description: "Key arterial road connecting the historic Undavalli area to Penumaka, opening the southern corridor.",
    searchKeywords: "Undavalli Penumaka road Amaravati construction", lastUpdated: "2026-03-02"
  },
  {
    id: "loc_018", name: "Capital Drainage & Sewerage Network", nameLocal: "డ్రైనేజీ నెట్‌వర్క్",
    category: "utility", lat: 16.5110, lng: 80.5000, status: "under_construction",
    description: "Underground drainage and sewerage system, a fundamental utility project for the capital city.",
    searchKeywords: "Amaravati capital drainage sewerage infrastructure", lastUpdated: "2026-02-25"
  },
  {
    id: "loc_019", name: "Happy Nest Township (APCRDA)", nameLocal: "హ్యాపీ నెస్ట్ టౌన్‌షిప్",
    category: "residential", lat: 16.4600, lng: 80.5120, status: "completed",
    description: "APCRDA's residential township offering housing units. One of the first completed residential developments.",
    searchKeywords: "Happy Nest Amaravati APCRDA township", lastUpdated: "2026-01-15"
  },
  {
    id: "loc_020", name: "Amaravati Trunk Infrastructure", nameLocal: "ట్రంక్ ఇన్‌ఫ్రాస్ట్రక్చర్",
    category: "road", lat: 16.5150, lng: 80.4870, status: "under_construction",
    description: "Major trunk road and utility corridor forming the backbone of the capital's infrastructure grid.",
    searchKeywords: "Amaravati trunk infrastructure road construction update", lastUpdated: "2026-03-10"
  }
];

const CATEGORY_COLORS = {
  government: '#e05555', road: '#4a9eda', bridge: '#e0943a',
  residential: '#5bb868', commercial: '#a07ad4', utility: '#7a8899'
};

const CATEGORY_LABELS = {
  government: 'Government', road: 'Roads', bridge: 'Bridges',
  residential: 'Residential', commercial: 'Commercial', utility: 'Utilities'
};

const STATUS_CONFIG = {
  completed: { label: 'Completed', color: '#5bb868' },
  under_construction: { label: 'Under Construction', color: '#e0943a' },
  planned: { label: 'Planned', color: '#4a9eda' },
  stalled: { label: 'Stalled', color: '#e05555' }
};
