export type VisaEaseCategory = 'visa_free' | 'evisa_easy' | 'embassy_visa'

export interface CountryData {
  name: string
  code: string
  flag: string
  continent: 'Asia' | 'Europe' | 'Africa' | 'North America' | 'South America' | 'Oceania'
  capital: string
  currency: string
  bestTime: string
  visaCategory: VisaEaseCategory
  visaLabel: string
  visaNotes: string
  visaProcessSteps: string[]
  estimatedCost: {
    flight: string
    dailyBudget: string
    visaFee: string
    totalEstimate: string
  }
  touristSpots: string[]
}

export const VISA_CATEGORY_META: Record<VisaEaseCategory, { label: string; badgeClass: string; icon: string; description: string }> = {
  visa_free: {
    label: 'Visa Free / On Arrival',
    badgeClass: 'live',
    icon: '⚡',
    description: 'Countries offering Visa-Free entry, Visa on Arrival (VoA), or instant eTA for Bangladeshi passport holders.',
  },
  evisa_easy: {
    label: 'e-Visa / Easy Visa',
    badgeClass: 'feat',
    icon: '📑',
    description: 'Countries with streamlined online e-Visa or fast processing for Bangladeshis.',
  },
  embassy_visa: {
    label: 'Embassy / Standard Visa',
    badgeClass: 'draft',
    icon: '🏛️',
    description: 'Countries requiring formal embassy or VFS application with documentation and financial proof.',
  },
}

export const WORLD_COUNTRIES: CountryData[] = [
  {
    "name": "Bangladesh",
    "code": "BD",
    "flag": "\ud83c\udde7\ud83c\udde9",
    "continent": "Asia",
    "capital": "Capital of Bangladesh",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "visa_free",
    "visaLabel": "Home Country",
    "visaNotes": "Domestic destinations",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Bangladesh",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Bangladesh",
      "Historic City Center of Bangladesh",
      "Natural Parks & Scenery in Bangladesh",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Barbados",
    "code": "BB",
    "flag": "\ud83c\udde7\ud83c\udde7",
    "continent": "North America",
    "capital": "Capital of Barbados",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "visa_free",
    "visaLabel": "Visa Free",
    "visaNotes": "Visa free for 6 months",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Barbados",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Barbados",
      "Historic City Center of Barbados",
      "Natural Parks & Scenery in Barbados",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Bhutan",
    "code": "BT",
    "flag": "\ud83c\udde7\ud83c\uddf9",
    "continent": "Asia",
    "capital": "Thimphu",
    "currency": "BTN (Ngultrum / INR)",
    "bestTime": "Mar \u2013 May & Sep \u2013 Nov",
    "visaCategory": "visa_free",
    "visaLabel": "Entry Permit on Arrival",
    "visaNotes": "Entry permit on arrival with SDF fee",
    "visaProcessSteps": [
      "1. Apply for Bhutan entry permit online or via registered Bhutanese tour operator",
      "2. Pay the daily Sustainable Development Fee (SDF)",
      "3. Present passport at Paro Airport (PBH) or Samdrup Jongkhar land border",
      "4. Receive Entry Permit stamp"
    ],
    "estimatedCost": {
      "flight": "BDT 22,000 - 32,000 (Direct Drukair ~1h from DAC to PBH)",
      "dailyBudget": "SDF USD 100/day + BDT 5,000 hotel/food",
      "visaFee": "SDF USD 100 per night (Sustainable Development Fee)",
      "totalEstimate": "BDT 80,000 - 130,000 (4-5 days)"
    },
    "touristSpots": [
      "Tiger's Nest Monastery (Paro Taktsang)",
      "Thimphu Buddha Dordenma Statue",
      "Punakha Dzong & Suspension Bridge",
      "Dochula Pass 108 Chortens",
      "Phobjikha Valley"
    ]
  },
  {
    "name": "Bolivia",
    "code": "BO",
    "flag": "\ud83c\udde7\ud83c\uddf4",
    "continent": "South America",
    "capital": "Capital of Bolivia",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "visa_free",
    "visaLabel": "Visa on Arrival",
    "visaNotes": "Visa on arrival for 90 days",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Bolivia",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Bolivia",
      "Historic City Center of Bolivia",
      "Natural Parks & Scenery in Bolivia",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Burundi",
    "code": "BI",
    "flag": "\ud83c\udde7\ud83c\uddee",
    "continent": "Africa",
    "capital": "Capital of Burundi",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "visa_free",
    "visaLabel": "Visa on Arrival",
    "visaNotes": "Visa on arrival at Bujumbura Airport",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Burundi",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Burundi",
      "Historic City Center of Burundi",
      "Natural Parks & Scenery in Burundi",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Cabo Verde",
    "code": "CV",
    "flag": "\ud83c\udde8\ud83c\uddfb",
    "continent": "Africa",
    "capital": "Capital of Cabo Verde",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "visa_free",
    "visaLabel": "EASE / VoA",
    "visaNotes": "Pre-registration EASE or VoA",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Cabo Verde",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Cabo Verde",
      "Historic City Center of Cabo Verde",
      "Natural Parks & Scenery in Cabo Verde",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Cambodia",
    "code": "KH",
    "flag": "\ud83c\uddf0\ud83c\udded",
    "continent": "Asia",
    "capital": "Capital of Cambodia",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "visa_free",
    "visaLabel": "Visa on Arrival / eVisa",
    "visaNotes": "VoA or online eVisa in 3 days",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Cambodia",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Cambodia",
      "Historic City Center of Cambodia",
      "Natural Parks & Scenery in Cambodia",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Comoros",
    "code": "KM",
    "flag": "\ud83c\uddf0\ud83c\uddf2",
    "continent": "Africa",
    "capital": "Capital of Comoros",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "visa_free",
    "visaLabel": "Visa on Arrival",
    "visaNotes": "Visa on arrival for 45 days",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Comoros",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Comoros",
      "Historic City Center of Comoros",
      "Natural Parks & Scenery in Comoros",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Djibouti",
    "code": "DJ",
    "flag": "\ud83c\udde9\ud83c\uddef",
    "continent": "Africa",
    "capital": "Capital of Djibouti",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "visa_free",
    "visaLabel": "e-Visa / VoA",
    "visaNotes": "Official e-Visa portal or VoA",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Djibouti",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Djibouti",
      "Historic City Center of Djibouti",
      "Natural Parks & Scenery in Djibouti",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Dominica",
    "code": "DM",
    "flag": "\ud83c\udde9\ud83c\uddf2",
    "continent": "North America",
    "capital": "Capital of Dominica",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "visa_free",
    "visaLabel": "Visa Free",
    "visaNotes": "Visa free entry for 21 days",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Dominica",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Dominica",
      "Historic City Center of Dominica",
      "Natural Parks & Scenery in Dominica",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Fiji",
    "code": "FJ",
    "flag": "\ud83c\uddeb\ud83c\uddef",
    "continent": "Oceania",
    "capital": "Capital of Fiji",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "visa_free",
    "visaLabel": "Visa Free",
    "visaNotes": "Visa free entry for 4 months",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Fiji",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Fiji",
      "Historic City Center of Fiji",
      "Natural Parks & Scenery in Fiji",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Gambia",
    "code": "GM",
    "flag": "\ud83c\uddec\ud83c\uddf2",
    "continent": "Africa",
    "capital": "Capital of Gambia",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "visa_free",
    "visaLabel": "Visa Free / Clearance",
    "visaNotes": "Visa clearance or free entry",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Gambia",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Gambia",
      "Historic City Center of Gambia",
      "Natural Parks & Scenery in Gambia",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Grenada",
    "code": "GD",
    "flag": "\ud83c\uddec\ud83c\udde9",
    "continent": "North America",
    "capital": "Capital of Grenada",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "visa_free",
    "visaLabel": "Visa Free",
    "visaNotes": "Visa free entry for 3 months",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Grenada",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Grenada",
      "Historic City Center of Grenada",
      "Natural Parks & Scenery in Grenada",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Guinea-Bissau",
    "code": "GW",
    "flag": "\ud83c\uddec\ud83c\uddfc",
    "continent": "Africa",
    "capital": "Capital of Guinea-Bissau",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "visa_free",
    "visaLabel": "Visa on Arrival",
    "visaNotes": "Visa on arrival for 90 days",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Guinea-Bissau",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Guinea-Bissau",
      "Historic City Center of Guinea-Bissau",
      "Natural Parks & Scenery in Guinea-Bissau",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Haiti",
    "code": "HT",
    "flag": "\ud83c\udded\ud83c\uddf9",
    "continent": "North America",
    "capital": "Capital of Haiti",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "visa_free",
    "visaLabel": "Visa Free",
    "visaNotes": "Visa free entry for 3 months",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Haiti",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Haiti",
      "Historic City Center of Haiti",
      "Natural Parks & Scenery in Haiti",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Kenya",
    "code": "KE",
    "flag": "\ud83c\uddf0\ud83c\uddea",
    "continent": "Africa",
    "capital": "Capital of Kenya",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "visa_free",
    "visaLabel": "eTA / Visa Free",
    "visaNotes": "Electronic Travel Authorisation online",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Kenya",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Kenya",
      "Historic City Center of Kenya",
      "Natural Parks & Scenery in Kenya",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Kiribati",
    "code": "KI",
    "flag": "\ud83c\uddf0\ud83c\uddee",
    "continent": "Oceania",
    "capital": "Capital of Kiribati",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "visa_free",
    "visaLabel": "Visa Free",
    "visaNotes": "Visa free entry for 90 days",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Kiribati",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Kiribati",
      "Historic City Center of Kiribati",
      "Natural Parks & Scenery in Kiribati",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Madagascar",
    "code": "MG",
    "flag": "\ud83c\uddf2\ud83c\uddec",
    "continent": "Africa",
    "capital": "Capital of Madagascar",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "visa_free",
    "visaLabel": "Visa on Arrival",
    "visaNotes": "Visa on arrival up to 60 days",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Madagascar",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Madagascar",
      "Historic City Center of Madagascar",
      "Natural Parks & Scenery in Madagascar",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Maldives",
    "code": "MV",
    "flag": "\ud83c\uddf2\ud83c\uddfb",
    "continent": "Asia",
    "capital": "Mal\u00e9",
    "currency": "MVR (Maldivian Rufiyaa / USD)",
    "bestTime": "Nov \u2013 Apr",
    "visaCategory": "visa_free",
    "visaLabel": "Visa on Arrival",
    "visaNotes": "Free 30-day Visa on Arrival for BD passport",
    "visaProcessSteps": [
      "1. Fill out IMUGA Traveler Declaration online within 96 hours before departure",
      "2. Ensure confirmed hotel/resort booking and return flight ticket",
      "3. Present passport at Velana Airport (MLE) immigration desk",
      "4. Get 30-day free Visa on Arrival stamp"
    ],
    "estimatedCost": {
      "flight": "BDT 35,000 - 50,000 (Direct ~3h 45m US-Bangla / Maldivian)",
      "dailyBudget": "BDT 7,000 - 15,000 ($60-$130/day)",
      "visaFee": "Free (30-day Visa on Arrival)",
      "totalEstimate": "BDT 75,000 - 140,000 (4-5 days)"
    },
    "touristSpots": [
      "Mal\u00e9 City & Grand Friday Mosque",
      "Maafushi Local Island",
      "Ari Atoll Overwater Bungalows",
      "Baa Atoll Biosphere Reserve",
      "Hulhumal\u00e9 Beach",
      "Vaadhoo Sea of Stars"
    ]
  },
  {
    "name": "Marshall Islands",
    "code": "MH",
    "flag": "\ud83c\uddf2\ud83c\udded",
    "continent": "Oceania",
    "capital": "Capital of Marshall Islands",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "visa_free",
    "visaLabel": "Visa on Arrival",
    "visaNotes": "Visa on arrival",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Marshall Islands",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Marshall Islands",
      "Historic City Center of Marshall Islands",
      "Natural Parks & Scenery in Marshall Islands",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Mauritania",
    "code": "MR",
    "flag": "\ud83c\uddf2\ud83c\uddf7",
    "continent": "Africa",
    "capital": "Capital of Mauritania",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "visa_free",
    "visaLabel": "Visa on Arrival",
    "visaNotes": "Visa on arrival at Nouakchott Airport",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Mauritania",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Mauritania",
      "Historic City Center of Mauritania",
      "Natural Parks & Scenery in Mauritania",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Mauritius",
    "code": "MU",
    "flag": "\ud83c\uddf2\ud83c\uddfa",
    "continent": "Africa",
    "capital": "Capital of Mauritius",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "visa_free",
    "visaLabel": "Visa on Arrival",
    "visaNotes": "Free 60-day visa on arrival for tourists",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Mauritius",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Mauritius",
      "Historic City Center of Mauritius",
      "Natural Parks & Scenery in Mauritius",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Micronesia",
    "code": "FM",
    "flag": "\ud83c\uddeb\ud83c\uddf2",
    "continent": "Oceania",
    "capital": "Capital of Micronesia",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "visa_free",
    "visaLabel": "Visa Free",
    "visaNotes": "Visa free entry for 30 days",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Micronesia",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Micronesia",
      "Historic City Center of Micronesia",
      "Natural Parks & Scenery in Micronesia",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Mozambique",
    "code": "MZ",
    "flag": "\ud83c\uddf2\ud83c\uddff",
    "continent": "Africa",
    "capital": "Capital of Mozambique",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "visa_free",
    "visaLabel": "e-Visa / VoA",
    "visaNotes": "e-Visa or Visa on Arrival",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Mozambique",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Mozambique",
      "Historic City Center of Mozambique",
      "Natural Parks & Scenery in Mozambique",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Nepal",
    "code": "NP",
    "flag": "\ud83c\uddf3\ud83c\uddf5",
    "continent": "Asia",
    "capital": "Kathmandu",
    "currency": "NPR (Nepalese Rupee)",
    "bestTime": "Oct \u2013 Nov & Mar \u2013 May",
    "visaCategory": "visa_free",
    "visaLabel": "Visa Free / VoA",
    "visaNotes": "Visa on Arrival / Gratis first annual visit",
    "visaProcessSteps": [
      "1. Arrive at Tribhuvan International Airport (KTM) or land border",
      "2. Complete online VoA kiosk form at airport arrival hall",
      "3. Present passport (min 6 months validity), passport photo, and return air ticket",
      "4. Receive 15/30-day Gratis Visa stamp on passport"
    ],
    "estimatedCost": {
      "flight": "BDT 18,000 - 26,000 (Direct ~1h 15m from DAC)",
      "dailyBudget": "BDT 2,500 - 4,500 ($25-$40/day)",
      "visaFee": "Gratis (Free for 1st visit of calendar year)",
      "totalEstimate": "BDT 35,000 - 55,000 (5-7 days)"
    },
    "touristSpots": [
      "Kathmandu Valley & Durbar Square",
      "Pokhara & Phewa Lake",
      "Nagarkot Sunrise Viewpoint",
      "Chitwan National Park",
      "Annapurna Circuit Trek",
      "Sarangkot Paragliding"
    ]
  },
  {
    "name": "Nicaragua",
    "code": "NI",
    "flag": "\ud83c\uddf3\ud83c\uddee",
    "continent": "North America",
    "capital": "Capital of Nicaragua",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "visa_free",
    "visaLabel": "Visa on Arrival",
    "visaNotes": "Visa on arrival for 90 days",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Nicaragua",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Nicaragua",
      "Historic City Center of Nicaragua",
      "Natural Parks & Scenery in Nicaragua",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Palau",
    "code": "PW",
    "flag": "\ud83c\uddf5\ud83c\uddfc",
    "continent": "Oceania",
    "capital": "Capital of Palau",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "visa_free",
    "visaLabel": "Visa on Arrival",
    "visaNotes": "Free 30-day visa on arrival",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Palau",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Palau",
      "Historic City Center of Palau",
      "Natural Parks & Scenery in Palau",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Rwanda",
    "code": "RW",
    "flag": "\ud83c\uddf7\ud83c\uddfc",
    "continent": "Africa",
    "capital": "Capital of Rwanda",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "visa_free",
    "visaLabel": "Visa on Arrival",
    "visaNotes": "30-day visa on arrival for all nationalities",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Rwanda",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Rwanda",
      "Historic City Center of Rwanda",
      "Natural Parks & Scenery in Rwanda",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Saint Vincent and the Grenadines",
    "code": "VC",
    "flag": "\ud83c\uddfb\ud83c\udde8",
    "continent": "North America",
    "capital": "Capital of Saint Vincent and the Grenadines",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "visa_free",
    "visaLabel": "Visa Free",
    "visaNotes": "Visa free entry for 1 month",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Saint Vincent and the Grenadines",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Saint Vincent and the Grenadines",
      "Historic City Center of Saint Vincent and the Grenadines",
      "Natural Parks & Scenery in Saint Vincent and the Grenadines",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Samoa",
    "code": "WS",
    "flag": "\ud83c\uddfc\ud83c\uddf8",
    "continent": "Oceania",
    "capital": "Capital of Samoa",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "visa_free",
    "visaLabel": "Entry Permit on Arrival",
    "visaNotes": "Entry permit on arrival for 60 days",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Samoa",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Samoa",
      "Historic City Center of Samoa",
      "Natural Parks & Scenery in Samoa",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Senegal",
    "code": "SN",
    "flag": "\ud83c\uddf8\ud83c\uddf3",
    "continent": "Africa",
    "capital": "Capital of Senegal",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "visa_free",
    "visaLabel": "Visa on Arrival",
    "visaNotes": "Visa on arrival",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Senegal",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Senegal",
      "Historic City Center of Senegal",
      "Natural Parks & Scenery in Senegal",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Seychelles",
    "code": "SC",
    "flag": "\ud83c\uddf8\ud83c\udde8",
    "continent": "Africa",
    "capital": "Capital of Seychelles",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "visa_free",
    "visaLabel": "Visitor Permit",
    "visaNotes": "Free visitor permit on arrival",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Seychelles",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Seychelles",
      "Historic City Center of Seychelles",
      "Natural Parks & Scenery in Seychelles",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Sierra Leone",
    "code": "SL",
    "flag": "\ud83c\uddf8\ud83c\uddf1",
    "continent": "Africa",
    "capital": "Capital of Sierra Leone",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "visa_free",
    "visaLabel": "Visa on Arrival / eVisa",
    "visaNotes": "Visa on arrival or eVisa",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Sierra Leone",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Sierra Leone",
      "Historic City Center of Sierra Leone",
      "Natural Parks & Scenery in Sierra Leone",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Solomon Islands",
    "code": "SB",
    "flag": "\ud83c\uddf8\ud83c\udde7",
    "continent": "Oceania",
    "capital": "Capital of Solomon Islands",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "visa_free",
    "visaLabel": "Permit on Arrival",
    "visaNotes": "Visitors permit on arrival",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Solomon Islands",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Solomon Islands",
      "Historic City Center of Solomon Islands",
      "Natural Parks & Scenery in Solomon Islands",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Somalia",
    "code": "SO",
    "flag": "\ud83c\uddf8\ud83c\uddf4",
    "continent": "Africa",
    "capital": "Capital of Somalia",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "visa_free",
    "visaLabel": "Visa on Arrival",
    "visaNotes": "Visa on arrival at major airports",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Somalia",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Somalia",
      "Historic City Center of Somalia",
      "Natural Parks & Scenery in Somalia",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Sri Lanka",
    "code": "LK",
    "flag": "\ud83c\uddf1\ud83c\uddf0",
    "continent": "Asia",
    "capital": "Colombo / Sri Jayawardenepura Kotte",
    "currency": "LKR (Sri Lankan Rupee)",
    "bestTime": "Dec \u2013 Apr (West/South), May \u2013 Sep (East)",
    "visaCategory": "visa_free",
    "visaLabel": "ETA / VoA",
    "visaNotes": "Easy online ETA or Visa on Arrival",
    "visaProcessSteps": [
      "1. Apply for ETA online at srilankaeta.lk",
      "2. Pay $50 fee online",
      "3. Receive ETA approval via email within 24 hours",
      "4. Present passport, return ticket, and hotel booking at Colombo (CMB) airport"
    ],
    "estimatedCost": {
      "flight": "BDT 32,000 - 45,000 (Direct / 1-stop ~3h 30m)",
      "dailyBudget": "BDT 3,000 - 6,000 ($25-$50/day)",
      "visaFee": "USD 50 (~BDT 6,000 ETA online)",
      "totalEstimate": "BDT 60,000 - 95,000 (6-8 days)"
    },
    "touristSpots": [
      "Sigiriya Rock Fortress",
      "Kandy Temple of the Sacred Tooth Relic",
      "Ella Scenic Train Journey",
      "Galle Dutch Fort",
      "Mirissa Whale Watching & Beach"
    ]
  },
  {
    "name": "Timor-Leste",
    "code": "TL",
    "flag": "\ud83c\uddf9\ud83c\uddf1",
    "continent": "Asia",
    "capital": "Capital of Timor-Leste",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "visa_free",
    "visaLabel": "Visa on Arrival",
    "visaNotes": "30-day Visa on Arrival at Dili airport",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Timor-Leste",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Timor-Leste",
      "Historic City Center of Timor-Leste",
      "Natural Parks & Scenery in Timor-Leste",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Togo",
    "code": "TG",
    "flag": "\ud83c\uddf9\ud83c\uddec",
    "continent": "Africa",
    "capital": "Capital of Togo",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "visa_free",
    "visaLabel": "Visa on Arrival",
    "visaNotes": "Visa on arrival for 7 days",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Togo",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Togo",
      "Historic City Center of Togo",
      "Natural Parks & Scenery in Togo",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Tonga",
    "code": "TO",
    "flag": "\ud83c\uddf9\ud83c\uddf4",
    "continent": "Oceania",
    "capital": "Capital of Tonga",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "visa_free",
    "visaLabel": "Visa on Arrival",
    "visaNotes": "Visa on arrival for 31 days",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Tonga",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Tonga",
      "Historic City Center of Tonga",
      "Natural Parks & Scenery in Tonga",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Tuvalu",
    "code": "TV",
    "flag": "\ud83c\uddf9\ud83c\uddfb",
    "continent": "Oceania",
    "capital": "Capital of Tuvalu",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "visa_free",
    "visaLabel": "Visa on Arrival",
    "visaNotes": "Visa on arrival for 1 month",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Tuvalu",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Tuvalu",
      "Historic City Center of Tuvalu",
      "Natural Parks & Scenery in Tuvalu",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Vanuatu",
    "code": "VU",
    "flag": "\ud83c\uddfb\ud83c\uddfa",
    "continent": "Oceania",
    "capital": "Capital of Vanuatu",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "visa_free",
    "visaLabel": "Visa Free",
    "visaNotes": "Visa free entry for 30 days",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Vanuatu",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Vanuatu",
      "Historic City Center of Vanuatu",
      "Natural Parks & Scenery in Vanuatu",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Albania",
    "code": "AL",
    "flag": "\ud83c\udde6\ud83c\uddf1",
    "continent": "Europe",
    "capital": "Capital of Albania",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Official e-Visa portal",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Albania",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Albania",
      "Historic City Center of Albania",
      "Natural Parks & Scenery in Albania",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Angola",
    "code": "AO",
    "flag": "\ud83c\udde6\ud83c\uddf4",
    "continent": "Africa",
    "capital": "Capital of Angola",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Pre-visa online approval",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Angola",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Angola",
      "Historic City Center of Angola",
      "Natural Parks & Scenery in Angola",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Antigua and Barbuda",
    "code": "AG",
    "flag": "\ud83c\udde6\ud83c\uddec",
    "continent": "North America",
    "capital": "Capital of Antigua and Barbuda",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Official e-Visa portal",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Antigua and Barbuda",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Antigua and Barbuda",
      "Historic City Center of Antigua and Barbuda",
      "Natural Parks & Scenery in Antigua and Barbuda",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Armenia",
    "code": "AM",
    "flag": "\ud83c\udde6\ud83c\uddf2",
    "continent": "Asia",
    "capital": "Capital of Armenia",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa / VoA",
    "visaNotes": "Official e-Visa portal or Visa on Arrival for eligible travel",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Armenia",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Armenia",
      "Historic City Center of Armenia",
      "Natural Parks & Scenery in Armenia",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Azerbaijan",
    "code": "AZ",
    "flag": "\ud83c\udde6\ud83c\uddff",
    "continent": "Asia",
    "capital": "Capital of Azerbaijan",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "ASAN e-Visa",
    "visaNotes": "ASAN e-Visa online in 3 working days",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Azerbaijan",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Azerbaijan",
      "Historic City Center of Azerbaijan",
      "Natural Parks & Scenery in Azerbaijan",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Bahamas",
    "code": "BS",
    "flag": "\ud83c\udde7\ud83c\uddf8",
    "continent": "North America",
    "capital": "Capital of Bahamas",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Official Bahamas e-Visa portal",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Bahamas",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Bahamas",
      "Historic City Center of Bahamas",
      "Natural Parks & Scenery in Bahamas",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Bahrain",
    "code": "BH",
    "flag": "\ud83c\udde7\ud83c\udded",
    "continent": "Asia",
    "capital": "Capital of Bahrain",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Online e-Visa or sponsor processing",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Bahrain",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Bahrain",
      "Historic City Center of Bahrain",
      "Natural Parks & Scenery in Bahrain",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Benin",
    "code": "BJ",
    "flag": "\ud83c\udde7\ud83c\uddef",
    "continent": "Africa",
    "capital": "Capital of Benin",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Official e-Visa portal",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Benin",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Benin",
      "Historic City Center of Benin",
      "Natural Parks & Scenery in Benin",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Botswana",
    "code": "BW",
    "flag": "\ud83c\udde7\ud83c\uddfc",
    "continent": "Africa",
    "capital": "Capital of Botswana",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Official e-Visa portal",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Botswana",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Botswana",
      "Historic City Center of Botswana",
      "Natural Parks & Scenery in Botswana",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Burkina Faso",
    "code": "BF",
    "flag": "\ud83c\udde7\ud83c\uddeb",
    "continent": "Africa",
    "capital": "Capital of Burkina Faso",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Official e-Visa portal",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Burkina Faso",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Burkina Faso",
      "Historic City Center of Burkina Faso",
      "Natural Parks & Scenery in Burkina Faso",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Cameroon",
    "code": "CM",
    "flag": "\ud83c\udde8\ud83c\uddf2",
    "continent": "Africa",
    "capital": "Capital of Cameroon",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Official e-Visa portal",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Cameroon",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Cameroon",
      "Historic City Center of Cameroon",
      "Natural Parks & Scenery in Cameroon",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Colombia",
    "code": "CO",
    "flag": "\ud83c\udde8\ud83c\uddf4",
    "continent": "South America",
    "capital": "Capital of Colombia",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Official Colombia e-Visa portal",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Colombia",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Colombia",
      "Historic City Center of Colombia",
      "Natural Parks & Scenery in Colombia",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Congo (DRC)",
    "code": "CD",
    "flag": "\ud83c\udde8\ud83c\udde9",
    "continent": "Africa",
    "capital": "Capital of Congo (DRC)",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "e-Visa online system",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Congo (DRC)",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Congo (DRC)",
      "Historic City Center of Congo (DRC)",
      "Natural Parks & Scenery in Congo (DRC)",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Cote d'Ivoire",
    "code": "CI",
    "flag": "\ud83c\udde8\ud83c\uddee",
    "continent": "Africa",
    "capital": "Capital of Cote d'Ivoire",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Official e-Visa portal",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Cote d'Ivoire",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Cote d'Ivoire",
      "Historic City Center of Cote d'Ivoire",
      "Natural Parks & Scenery in Cote d'Ivoire",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Ecuador",
    "code": "EC",
    "flag": "\ud83c\uddea\ud83c\udde8",
    "continent": "South America",
    "capital": "Capital of Ecuador",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Online e-Visa registration",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Ecuador",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Ecuador",
      "Historic City Center of Ecuador",
      "Natural Parks & Scenery in Ecuador",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Egypt",
    "code": "EG",
    "flag": "\ud83c\uddea\ud83c\uddec",
    "continent": "Africa",
    "capital": "Capital of Egypt",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "Sticker / e-Visa",
    "visaNotes": "Embassy sticker visa or e-Visa with Schengen/US visa",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Egypt",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Egypt",
      "Historic City Center of Egypt",
      "Natural Parks & Scenery in Egypt",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Equatorial Guinea",
    "code": "GQ",
    "flag": "\ud83c\uddec\ud83c\uddf6",
    "continent": "Africa",
    "capital": "Capital of Equatorial Guinea",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Official e-Visa portal",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Equatorial Guinea",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Equatorial Guinea",
      "Historic City Center of Equatorial Guinea",
      "Natural Parks & Scenery in Equatorial Guinea",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Ethiopia",
    "code": "ET",
    "flag": "\ud83c\uddea\ud83c\uddf9",
    "continent": "Africa",
    "capital": "Capital of Ethiopia",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Official Ethiopia e-Visa portal",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Ethiopia",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Ethiopia",
      "Historic City Center of Ethiopia",
      "Natural Parks & Scenery in Ethiopia",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Gabon",
    "code": "GA",
    "flag": "\ud83c\uddec\ud83c\udde6",
    "continent": "Africa",
    "capital": "Capital of Gabon",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Official e-Visa portal",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Gabon",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Gabon",
      "Historic City Center of Gabon",
      "Natural Parks & Scenery in Gabon",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Georgia",
    "code": "GE",
    "flag": "\ud83c\uddec\ud83c\uddea",
    "continent": "Asia",
    "capital": "Capital of Georgia",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa / Valid Visa",
    "visaNotes": "Online e-Visa or exempt with valid US/UK/Schengen visa",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Georgia",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Georgia",
      "Historic City Center of Georgia",
      "Natural Parks & Scenery in Georgia",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Guinea",
    "code": "GN",
    "flag": "\ud83c\uddec\ud83c\uddf3",
    "continent": "Africa",
    "capital": "Capital of Guinea",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Official e-Visa portal",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Guinea",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Guinea",
      "Historic City Center of Guinea",
      "Natural Parks & Scenery in Guinea",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "India",
    "code": "IN",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "continent": "Asia",
    "capital": "Capital of India",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "Sticker Visa",
    "visaNotes": "Sticker visa via IVAC centres across Bangladesh",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for India",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in India",
      "Historic City Center of India",
      "Natural Parks & Scenery in India",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Indonesia",
    "code": "ID",
    "flag": "\ud83c\uddee\ud83c\udde9",
    "continent": "Asia",
    "capital": "Capital of Indonesia",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa / VoA",
    "visaNotes": "Online e-Visa / VoA portal for tourism",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Indonesia",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Indonesia",
      "Historic City Center of Indonesia",
      "Natural Parks & Scenery in Indonesia",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Iran",
    "code": "IR",
    "flag": "\ud83c\uddee\ud83c\uddf7",
    "continent": "Asia",
    "capital": "Capital of Iran",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Official Iran e-Visa portal",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Iran",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Iran",
      "Historic City Center of Iran",
      "Natural Parks & Scenery in Iran",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Jordan",
    "code": "JO",
    "flag": "\ud83c\uddef\ud83c\uddf4",
    "continent": "Asia",
    "capital": "Capital of Jordan",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa / MOI",
    "visaNotes": "MOI online visa portal",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Jordan",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Jordan",
      "Historic City Center of Jordan",
      "Natural Parks & Scenery in Jordan",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Kazakhstan",
    "code": "KZ",
    "flag": "\ud83c\uddf0\ud83c\uddff",
    "continent": "Asia",
    "capital": "Capital of Kazakhstan",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Online e-Visa for tourist invitation holders",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Kazakhstan",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Kazakhstan",
      "Historic City Center of Kazakhstan",
      "Natural Parks & Scenery in Kazakhstan",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Kyrgyzstan",
    "code": "KG",
    "flag": "\ud83c\uddf0\ud83c\uddec",
    "continent": "Asia",
    "capital": "Capital of Kyrgyzstan",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Official e-Visa portal",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Kyrgyzstan",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Kyrgyzstan",
      "Historic City Center of Kyrgyzstan",
      "Natural Parks & Scenery in Kyrgyzstan",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Laos",
    "code": "LA",
    "flag": "\ud83c\uddf1\ud83c\udde6",
    "continent": "Asia",
    "capital": "Capital of Laos",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa / VoA",
    "visaNotes": "Online e-Visa or Visa on Arrival",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Laos",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Laos",
      "Historic City Center of Laos",
      "Natural Parks & Scenery in Laos",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Lebanon",
    "code": "LB",
    "flag": "\ud83c\uddf1\ud83c\udde7",
    "continent": "Asia",
    "capital": "Capital of Lebanon",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "Approval / Visa",
    "visaNotes": "Approval permit required",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Lebanon",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Lebanon",
      "Historic City Center of Lebanon",
      "Natural Parks & Scenery in Lebanon",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Lesotho",
    "code": "LS",
    "flag": "\ud83c\uddf1\ud83c\uddf8",
    "continent": "Africa",
    "capital": "Capital of Lesotho",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Official e-Visa portal",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Lesotho",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Lesotho",
      "Historic City Center of Lesotho",
      "Natural Parks & Scenery in Lesotho",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Malawi",
    "code": "MW",
    "flag": "\ud83c\uddf2\ud83c\uddfc",
    "continent": "Africa",
    "capital": "Capital of Malawi",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Official e-Visa portal",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Malawi",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Malawi",
      "Historic City Center of Malawi",
      "Natural Parks & Scenery in Malawi",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Malaysia",
    "code": "MY",
    "flag": "\ud83c\uddf2\ud83c\uddfe",
    "continent": "Asia",
    "capital": "Kuala Lumpur",
    "currency": "MYR (Malaysian Ringgit)",
    "bestTime": "Year-round (Best Mar \u2013 Oct)",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa / Sticker",
    "visaNotes": "Online e-Visa (eVisa) or sticker visa in 3-5 days",
    "visaProcessSteps": [
      "1. Apply online via Malaysia eVisa official portal (malaysiavisa.imi.gov.my)",
      "2. Upload passport photo, passport bio page, flight ticket, hotel booking",
      "3. Submit 3-month bank statement with solvency certificate",
      "4. Receive eVISA approval PDF via email in 2-4 working days"
    ],
    "estimatedCost": {
      "flight": "BDT 28,000 - 40,000 (Direct ~3h 45m Biman/AirAsia/Batik)",
      "dailyBudget": "BDT 4,000 - 7,500 ($35-$70/day)",
      "visaFee": "BDT 3,500 - 5,000 (eVisa online)",
      "totalEstimate": "BDT 60,000 - 100,000 (5-7 days)"
    },
    "touristSpots": [
      "Petronas Twin Towers & KL Tower",
      "Batu Caves Hindu Temple",
      "Genting Highlands Cable Car",
      "Langkawi Cable Car & Sky Bridge",
      "Penang George Town Street Art"
    ]
  },
  {
    "name": "Moldova",
    "code": "MD",
    "flag": "\ud83c\uddf2\ud83c\udde9",
    "continent": "Europe",
    "capital": "Capital of Moldova",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Official e-Visa portal",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Moldova",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Moldova",
      "Historic City Center of Moldova",
      "Natural Parks & Scenery in Moldova",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Mongolia",
    "code": "MN",
    "flag": "\ud83c\uddf2\ud83c\uddf3",
    "continent": "Asia",
    "capital": "Capital of Mongolia",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Official e-Visa portal",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Mongolia",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Mongolia",
      "Historic City Center of Mongolia",
      "Natural Parks & Scenery in Mongolia",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Morocco",
    "code": "MA",
    "flag": "\ud83c\uddf2\ud83c\udde6",
    "continent": "Africa",
    "capital": "Capital of Morocco",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Official e-Visa portal for BD passport holders",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Morocco",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Morocco",
      "Historic City Center of Morocco",
      "Natural Parks & Scenery in Morocco",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Namibia",
    "code": "NA",
    "flag": "\ud83c\uddf3\ud83c\udde6",
    "continent": "Africa",
    "capital": "Capital of Namibia",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa / VoA",
    "visaNotes": "Online e-Visa or VoA",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Namibia",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Namibia",
      "Historic City Center of Namibia",
      "Natural Parks & Scenery in Namibia",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Nigeria",
    "code": "NG",
    "flag": "\ud83c\uddf3\ud83c\uddec",
    "continent": "Africa",
    "capital": "Capital of Nigeria",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Official Nigeria e-Visa portal",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Nigeria",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Nigeria",
      "Historic City Center of Nigeria",
      "Natural Parks & Scenery in Nigeria",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Oman",
    "code": "OM",
    "flag": "\ud83c\uddf4\ud83c\uddf2",
    "continent": "Asia",
    "capital": "Capital of Oman",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Official Royal Oman Police e-Visa portal",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Oman",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Oman",
      "Historic City Center of Oman",
      "Natural Parks & Scenery in Oman",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Pakistan",
    "code": "PK",
    "flag": "\ud83c\uddf5\ud83c\uddf0",
    "continent": "Asia",
    "capital": "Capital of Pakistan",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Online Pakistan e-Visa portal",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Pakistan",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Pakistan",
      "Historic City Center of Pakistan",
      "Natural Parks & Scenery in Pakistan",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Papua New Guinea",
    "code": "PG",
    "flag": "\ud83c\uddf5\ud83c\uddec",
    "continent": "Oceania",
    "capital": "Capital of Papua New Guinea",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Official e-Visa portal",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Papua New Guinea",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Papua New Guinea",
      "Historic City Center of Papua New Guinea",
      "Natural Parks & Scenery in Papua New Guinea",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Qatar",
    "code": "QA",
    "flag": "\ud83c\uddf6\ud83c\udde6",
    "continent": "Asia",
    "capital": "Capital of Qatar",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "Hayya e-Visa",
    "visaNotes": "Online e-Visa via Hayya portal",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Qatar",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Qatar",
      "Historic City Center of Qatar",
      "Natural Parks & Scenery in Qatar",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Russia",
    "code": "RU",
    "flag": "\ud83c\uddf7\ud83c\uddfa",
    "continent": "Europe",
    "capital": "Capital of Russia",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Official Russian unified e-Visa online",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Russia",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Russia",
      "Historic City Center of Russia",
      "Natural Parks & Scenery in Russia",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Saint Kitts and Nevis",
    "code": "KN",
    "flag": "\ud83c\uddf0\ud83c\uddf3",
    "continent": "North America",
    "capital": "Capital of Saint Kitts and Nevis",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Official e-Visa portal",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Saint Kitts and Nevis",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Saint Kitts and Nevis",
      "Historic City Center of Saint Kitts and Nevis",
      "Natural Parks & Scenery in Saint Kitts and Nevis",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Saint Lucia",
    "code": "LC",
    "flag": "\ud83c\uddf1\ud83c\udde8",
    "continent": "North America",
    "capital": "Capital of Saint Lucia",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "e-Visa or entry permit",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Saint Lucia",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Saint Lucia",
      "Historic City Center of Saint Lucia",
      "Natural Parks & Scenery in Saint Lucia",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Sao Tome and Principe",
    "code": "ST",
    "flag": "\ud83c\uddf8\ud83c\uddf9",
    "continent": "Africa",
    "capital": "Capital of Sao Tome and Principe",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Official e-Visa portal",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Sao Tome and Principe",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Sao Tome and Principe",
      "Historic City Center of Sao Tome and Principe",
      "Natural Parks & Scenery in Sao Tome and Principe",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Saudi Arabia",
    "code": "SA",
    "flag": "\ud83c\uddf8\ud83c\udde6",
    "continent": "Asia",
    "capital": "Capital of Saudi Arabia",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "Umrah / Tourist eVisa",
    "visaNotes": "Umrah visa or e-Visa (with Schengen/US/UK visa)",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Saudi Arabia",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Saudi Arabia",
      "Historic City Center of Saudi Arabia",
      "Natural Parks & Scenery in Saudi Arabia",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Singapore",
    "code": "SG",
    "flag": "\ud83c\uddf8\ud83c\uddec",
    "continent": "Asia",
    "capital": "Capital of Singapore",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa via Agent",
    "visaNotes": "Submitted online via authorized agency",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Singapore",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Singapore",
      "Historic City Center of Singapore",
      "Natural Parks & Scenery in Singapore",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "South Sudan",
    "code": "SS",
    "flag": "\ud83c\uddf8\ud83c\uddf8",
    "continent": "Africa",
    "capital": "Capital of South Sudan",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Official e-Visa portal",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for South Sudan",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in South Sudan",
      "Historic City Center of South Sudan",
      "Natural Parks & Scenery in South Sudan",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Suriname",
    "code": "SR",
    "flag": "\ud83c\uddf8\ud83c\uddf7",
    "continent": "South America",
    "capital": "Capital of Suriname",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "Entry Fee / eVisa",
    "visaNotes": "Online entry fee / e-Visa",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Suriname",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Suriname",
      "Historic City Center of Suriname",
      "Natural Parks & Scenery in Suriname",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Tajikistan",
    "code": "TJ",
    "flag": "\ud83c\uddf9\ud83c\uddef",
    "continent": "Asia",
    "capital": "Capital of Tajikistan",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Official e-Visa portal",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Tajikistan",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Tajikistan",
      "Historic City Center of Tajikistan",
      "Natural Parks & Scenery in Tajikistan",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Tanzania",
    "code": "TZ",
    "flag": "\ud83c\uddf9\ud83c\uddff",
    "continent": "Africa",
    "capital": "Capital of Tanzania",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Official Tanzania e-Visa portal",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Tanzania",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Tanzania",
      "Historic City Center of Tanzania",
      "Natural Parks & Scenery in Tanzania",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Thailand",
    "code": "TH",
    "flag": "\ud83c\uddf9\ud83c\udded",
    "continent": "Asia",
    "capital": "Bangkok",
    "currency": "THB (Thai Baht)",
    "bestTime": "Nov \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa / Sticker",
    "visaNotes": "Accessible sticker visa / e-Visa via VFS Thailand",
    "visaProcessSteps": [
      "1. Apply online via official Thai E-Visa portal or VFS Global Thailand Dhaka",
      "2. Required: Passport (6m+), 6m Bank Statement (min BDT 60k/person or 150k/family), Bank Solvency Certificate",
      "3. Job NOC / Business Trade License, Air Ticket & Hotel Booking",
      "4. Processing time: 3-5 working days"
    ],
    "estimatedCost": {
      "flight": "BDT 24,000 - 35,000 (Direct ~2h 30m Thai Airways/Biman/US-Bangla)",
      "dailyBudget": "BDT 3,500 - 7,000 ($35-$65/day)",
      "visaFee": "BDT 4,000 - 5,500 (Single Entry Sticker/eVisa)",
      "totalEstimate": "BDT 55,000 - 90,000 (5-7 days)"
    },
    "touristSpots": [
      "Bangkok Grand Palace & Wat Arun",
      "Phuket Patong Beach & Phi Phi Islands",
      "Chiang Mai Old City & Night Bazaar",
      "Pattaya Floating Market & Coral Island",
      "Krabi Railay Beach"
    ]
  },
  {
    "name": "Turkey",
    "code": "TR",
    "flag": "\ud83c\uddf9\ud83c\uddf7",
    "continent": "Asia",
    "capital": "Ankara",
    "currency": "TRY (Turkish Lira)",
    "bestTime": "Apr \u2013 May & Sep \u2013 Nov",
    "visaCategory": "evisa_easy",
    "visaLabel": "Sticker / e-Visa",
    "visaNotes": "Sticker via Gateway; e-Visa if holding Schengen/US/UK visa",
    "visaProcessSteps": [
      "1. If holding valid US/UK/Schengen visa: Apply instantly online at evisa.gov.tr ($50)",
      "2. Otherwise: Apply for sticker visa via Gateway Management Dhaka",
      "3. Documents: 6m bank statement, job NOC/business documents, biometric photo, flight & hotel",
      "4. Processing time: 7-12 working days"
    ],
    "estimatedCost": {
      "flight": "BDT 55,000 - 80,000 (Direct Turkish Airlines ~7h from DAC)",
      "dailyBudget": "BDT 6,000 - 12,000 ($50-$100/day)",
      "visaFee": "BDT 16,000 - 22,000 (Sticker Visa via Gateway) or $50 (eVisa if US/UK/Schengen held)",
      "totalEstimate": "BDT 120,000 - 200,000 (7-10 days)"
    },
    "touristSpots": [
      "Istanbul Hagia Sophia & Blue Mosque",
      "Cappadocia Hot Air Balloon Ride",
      "Pamukkale Thermal Travertines",
      "Ephesus Ancient Greek Ruins",
      "Antalya Turquoise Coast"
    ]
  },
  {
    "name": "Uganda",
    "code": "UG",
    "flag": "\ud83c\uddfa\ud83c\uddec",
    "continent": "Africa",
    "capital": "Capital of Uganda",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Official Uganda e-Visa portal",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Uganda",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Uganda",
      "Historic City Center of Uganda",
      "Natural Parks & Scenery in Uganda",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Ukraine",
    "code": "UA",
    "flag": "\ud83c\uddfa\ud83c\udde6",
    "continent": "Europe",
    "capital": "Capital of Ukraine",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "e-Visa system (when operational)",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Ukraine",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Ukraine",
      "Historic City Center of Ukraine",
      "Natural Parks & Scenery in Ukraine",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "United Arab Emirates",
    "code": "AE",
    "flag": "\ud83c\udde6\ud83c\uddea",
    "continent": "Asia",
    "capital": "Abu Dhabi",
    "currency": "AED (Emirati Dirham)",
    "bestTime": "Nov \u2013 Mar",
    "visaCategory": "evisa_easy",
    "visaLabel": "Tourist e-Visa",
    "visaNotes": "Easy 30/60-day tourist visa via airlines/agents",
    "visaProcessSteps": [
      "1. Apply online via Emirates/Flydubai airlines, UAE ICP portal, or authorized travel agent",
      "2. Upload passport color copy, passport photo, return ticket",
      "3. Receive e-Visa approval PDF in 2-4 working days",
      "4. Present printed e-Visa at Dubai (DXB) or Abu Dhabi (AUH) airport"
    ],
    "estimatedCost": {
      "flight": "BDT 35,000 - 55,000 (Direct ~4h 45m Emirates/Flydubai/Air Arabia)",
      "dailyBudget": "BDT 7,000 - 15,000 ($60-$130/day)",
      "visaFee": "BDT 8,000 - 12,000 (30-day Tourist Visa)",
      "totalEstimate": "BDT 85,000 - 150,000 (4-6 days)"
    },
    "touristSpots": [
      "Burj Khalifa & Dubai Mall",
      "Sheikh Zayed Grand Mosque Abu Dhabi",
      "Dubai Desert Safari & Dunes",
      "Museum of the Future",
      "Palm Jumeirah & Atlantis"
    ]
  },
  {
    "name": "Uzbekistan",
    "code": "UZ",
    "flag": "\ud83c\uddfa\ud83c\uddff",
    "continent": "Asia",
    "capital": "Capital of Uzbekistan",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Official e-Visa portal",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Uzbekistan",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Uzbekistan",
      "Historic City Center of Uzbekistan",
      "Natural Parks & Scenery in Uzbekistan",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Vietnam",
    "code": "VN",
    "flag": "\ud83c\uddfb\ud83c\uddf3",
    "continent": "Asia",
    "capital": "Hanoi",
    "currency": "VND (Vietnamese Dong)",
    "bestTime": "Dec \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Official 90-day single/multiple entry e-Visa online",
    "visaProcessSteps": [
      "1. Apply on official Vietnam E-Visa portal (evisa.xuatnhapcanh.gov.vn)",
      "2. Upload passport scan and passport photo",
      "3. Pay $25 fee via card",
      "4. Receive 90-day e-Visa PDF in 3 working days"
    ],
    "estimatedCost": {
      "flight": "BDT 35,000 - 48,000 (Direct / 1-stop ~4h 30m)",
      "dailyBudget": "BDT 3,000 - 5,500 ($25-$50/day)",
      "visaFee": "USD 25 (~BDT 3,000 for 90-day single entry eVisa)",
      "totalEstimate": "BDT 55,000 - 85,000 (6-8 days)"
    },
    "touristSpots": [
      "Ha Long Bay Cruise",
      "Hanoi Old Quarter & Hoan Kiem Lake",
      "Hoi An Ancient Town & Lanterns",
      "Da Nang Ba Na Hills & Golden Bridge",
      "Ho Chi Minh City Ben Thanh Market"
    ]
  },
  {
    "name": "Zambia",
    "code": "ZM",
    "flag": "\ud83c\uddff\ud83c\uddf2",
    "continent": "Africa",
    "capital": "Capital of Zambia",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Official Zambia e-Visa portal",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Zambia",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Zambia",
      "Historic City Center of Zambia",
      "Natural Parks & Scenery in Zambia",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Zimbabwe",
    "code": "ZW",
    "flag": "\ud83c\uddff\ud83c\uddfc",
    "continent": "Africa",
    "capital": "Capital of Zimbabwe",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "evisa_easy",
    "visaLabel": "e-Visa",
    "visaNotes": "Official eVisa Zimbabwe portal",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Zimbabwe",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Zimbabwe",
      "Historic City Center of Zimbabwe",
      "Natural Parks & Scenery in Zimbabwe",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Afghanistan",
    "code": "AF",
    "flag": "\ud83c\udde6\ud83c\uddeb",
    "continent": "Asia",
    "capital": "Capital of Afghanistan",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "Embassy visa required prior to travel",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Afghanistan",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Afghanistan",
      "Historic City Center of Afghanistan",
      "Natural Parks & Scenery in Afghanistan",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Algeria",
    "code": "DZ",
    "flag": "\ud83c\udde9\ud83c\uddff",
    "continent": "Africa",
    "capital": "Capital of Algeria",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "Embassy of Algeria application",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Algeria",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Algeria",
      "Historic City Center of Algeria",
      "Natural Parks & Scenery in Algeria",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Andorra",
    "code": "AD",
    "flag": "\ud83c\udde6\ud83c\udde9",
    "continent": "Europe",
    "capital": "Capital of Andorra",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Schengen Access",
    "visaNotes": "Access via France/Spain Schengen visa",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Andorra",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Andorra",
      "Historic City Center of Andorra",
      "Natural Parks & Scenery in Andorra",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Argentina",
    "code": "AR",
    "flag": "\ud83c\udde6\ud83c\uddf7",
    "continent": "South America",
    "capital": "Capital of Argentina",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy / AVE",
    "visaNotes": "Embassy visa or electronic AVE if holding US visa",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Argentina",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Argentina",
      "Historic City Center of Argentina",
      "Natural Parks & Scenery in Argentina",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Australia",
    "code": "AU",
    "flag": "\ud83c\udde6\ud83c\uddfa",
    "continent": "Oceania",
    "capital": "Capital of Australia",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Visitor Visa (600)",
    "visaNotes": "Online ImmiAccount application + biometrics",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Australia",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Australia",
      "Historic City Center of Australia",
      "Natural Parks & Scenery in Australia",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Austria",
    "code": "AT",
    "flag": "\ud83c\udde6\ud83c\uddf9",
    "continent": "Europe",
    "capital": "Capital of Austria",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Schengen Visa",
    "visaNotes": "Austria Schengen visa via VFS Dhaka",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Austria",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Austria",
      "Historic City Center of Austria",
      "Natural Parks & Scenery in Austria",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Belarus",
    "code": "BY",
    "flag": "\ud83c\udde7\ud83c\uddfe",
    "continent": "Europe",
    "capital": "Capital of Belarus",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "Embassy application with invitation",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Belarus",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Belarus",
      "Historic City Center of Belarus",
      "Natural Parks & Scenery in Belarus",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Belgium",
    "code": "BE",
    "flag": "\ud83c\udde7\ud83c\uddea",
    "continent": "Europe",
    "capital": "Capital of Belgium",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Schengen Visa",
    "visaNotes": "Belgium Schengen visa via VFS Dhaka",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Belgium",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Belgium",
      "Historic City Center of Belgium",
      "Natural Parks & Scenery in Belgium",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Belize",
    "code": "BZ",
    "flag": "\ud83c\udde7\ud83c\uddff",
    "continent": "North America",
    "capital": "Capital of Belize",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "Visa required or exempt with US visa",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Belize",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Belize",
      "Historic City Center of Belize",
      "Natural Parks & Scenery in Belize",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Bosnia and Herzegovina",
    "code": "BA",
    "flag": "\ud83c\udde7\ud83c\udde6",
    "continent": "Europe",
    "capital": "Capital of Bosnia and Herzegovina",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "Embassy visa or valid Schengen visa",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Bosnia and Herzegovina",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Bosnia and Herzegovina",
      "Historic City Center of Bosnia and Herzegovina",
      "Natural Parks & Scenery in Bosnia and Herzegovina",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Brazil",
    "code": "BR",
    "flag": "\ud83c\udde7\ud83c\uddf7",
    "continent": "South America",
    "capital": "Capital of Brazil",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "Embassy of Brazil in Dhaka",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Brazil",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Brazil",
      "Historic City Center of Brazil",
      "Natural Parks & Scenery in Brazil",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Brunei",
    "code": "BN",
    "flag": "\ud83c\udde7\ud83c\uddf3",
    "continent": "Asia",
    "capital": "Capital of Brunei",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "High Commission application required",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Brunei",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Brunei",
      "Historic City Center of Brunei",
      "Natural Parks & Scenery in Brunei",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Bulgaria",
    "code": "BG",
    "flag": "\ud83c\udde7\ud83c\uddec",
    "continent": "Europe",
    "capital": "Capital of Bulgaria",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Schengen / National",
    "visaNotes": "Bulgarian national visa or Schengen",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Bulgaria",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Bulgaria",
      "Historic City Center of Bulgaria",
      "Natural Parks & Scenery in Bulgaria",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Canada",
    "code": "CA",
    "flag": "\ud83c\udde8\ud83c\udde6",
    "continent": "North America",
    "capital": "Capital of Canada",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Visitor Visa (V-1)",
    "visaNotes": "Online IRCC portal + VFS biometrics",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Canada",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Canada",
      "Historic City Center of Canada",
      "Natural Parks & Scenery in Canada",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Central African Republic",
    "code": "CF",
    "flag": "\ud83c\udde8\ud83c\uddeb",
    "continent": "Africa",
    "capital": "Capital of Central African Republic",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "Embassy visa required",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Central African Republic",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Central African Republic",
      "Historic City Center of Central African Republic",
      "Natural Parks & Scenery in Central African Republic",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Chad",
    "code": "TD",
    "flag": "\ud83c\uddf9\ud83c\udde9",
    "continent": "Africa",
    "capital": "Capital of Chad",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "Embassy visa required",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Chad",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Chad",
      "Historic City Center of Chad",
      "Natural Parks & Scenery in Chad",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Chile",
    "code": "CL",
    "flag": "\ud83c\udde8\ud83c\uddf1",
    "continent": "South America",
    "capital": "Capital of Chile",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "SAC e-Visa",
    "visaNotes": "Online SAC visa system",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Chile",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Chile",
      "Historic City Center of Chile",
      "Natural Parks & Scenery in Chile",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "China",
    "code": "CN",
    "flag": "\ud83c\udde8\ud83c\uddf3",
    "continent": "Asia",
    "capital": "Capital of China",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Chinese Visa Centre",
    "visaNotes": "Dhaka Chinese Visa Application Center",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for China",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in China",
      "Historic City Center of China",
      "Natural Parks & Scenery in China",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Congo (Republic)",
    "code": "CG",
    "flag": "\ud83c\udde8\ud83c\uddec",
    "continent": "Africa",
    "capital": "Capital of Congo (Republic)",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "Embassy processing",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Congo (Republic)",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Congo (Republic)",
      "Historic City Center of Congo (Republic)",
      "Natural Parks & Scenery in Congo (Republic)",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Costa Rica",
    "code": "CR",
    "flag": "\ud83c\udde8\ud83c\uddf7",
    "continent": "North America",
    "capital": "Capital of Costa Rica",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "Exempt if holding valid US/Canada/Schengen visa",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Costa Rica",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Costa Rica",
      "Historic City Center of Costa Rica",
      "Natural Parks & Scenery in Costa Rica",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Croatia",
    "code": "HR",
    "flag": "\ud83c\udded\ud83c\uddf7",
    "continent": "Europe",
    "capital": "Capital of Croatia",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Schengen Visa",
    "visaNotes": "Croatia Schengen visa via VFS",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Croatia",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Croatia",
      "Historic City Center of Croatia",
      "Natural Parks & Scenery in Croatia",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Cuba",
    "code": "CU",
    "flag": "\ud83c\udde8\ud83c\uddfa",
    "continent": "North America",
    "capital": "Capital of Cuba",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Tourist Card",
    "visaNotes": "Tourist card required",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Cuba",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Cuba",
      "Historic City Center of Cuba",
      "Natural Parks & Scenery in Cuba",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Cyprus",
    "code": "CY",
    "flag": "\ud83c\udde8\ud83c\uddfe",
    "continent": "Asia",
    "capital": "Capital of Cyprus",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "National visa or valid Schengen visa",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Cyprus",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Cyprus",
      "Historic City Center of Cyprus",
      "Natural Parks & Scenery in Cyprus",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Czech Republic",
    "code": "CZ",
    "flag": "\ud83c\udde8\ud83c\uddff",
    "continent": "Europe",
    "capital": "Capital of Czech Republic",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Schengen Visa",
    "visaNotes": "Czechia Schengen visa via VFS",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Czech Republic",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Czech Republic",
      "Historic City Center of Czech Republic",
      "Natural Parks & Scenery in Czech Republic",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Denmark",
    "code": "DK",
    "flag": "\ud83c\udde9\ud83c\uddf0",
    "continent": "Europe",
    "capital": "Capital of Denmark",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Schengen Visa",
    "visaNotes": "Denmark Schengen visa via VFS Dhaka",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Denmark",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Denmark",
      "Historic City Center of Denmark",
      "Natural Parks & Scenery in Denmark",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Dominican Republic",
    "code": "DO",
    "flag": "\ud83c\udde9\ud83c\uddf4",
    "continent": "North America",
    "capital": "Capital of Dominican Republic",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Tourist Card / Visa",
    "visaNotes": "Tourist card or valid US/Schengen visa",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Dominican Republic",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Dominican Republic",
      "Historic City Center of Dominican Republic",
      "Natural Parks & Scenery in Dominican Republic",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "El Salvador",
    "code": "SV",
    "flag": "\ud83c\uddf8\ud83c\uddfb",
    "continent": "North America",
    "capital": "Capital of El Salvador",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "Exempt if holding valid US/Schengen visa",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for El Salvador",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in El Salvador",
      "Historic City Center of El Salvador",
      "Natural Parks & Scenery in El Salvador",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Eritrea",
    "code": "ER",
    "flag": "\ud83c\uddea\ud83c\uddf7",
    "continent": "Africa",
    "capital": "Capital of Eritrea",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "Embassy visa required",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Eritrea",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Eritrea",
      "Historic City Center of Eritrea",
      "Natural Parks & Scenery in Eritrea",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Estonia",
    "code": "EE",
    "flag": "\ud83c\uddea\ud83c\uddea",
    "continent": "Europe",
    "capital": "Capital of Estonia",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Schengen Visa",
    "visaNotes": "Estonia Schengen visa via VFS",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Estonia",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Estonia",
      "Historic City Center of Estonia",
      "Natural Parks & Scenery in Estonia",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Eswatini",
    "code": "SZ",
    "flag": "\ud83c\uddf8\ud83c\uddff",
    "continent": "Africa",
    "capital": "Capital of Eswatini",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "High Commission application",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Eswatini",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Eswatini",
      "Historic City Center of Eswatini",
      "Natural Parks & Scenery in Eswatini",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Finland",
    "code": "FI",
    "flag": "\ud83c\uddeb\ud83c\uddee",
    "continent": "Europe",
    "capital": "Capital of Finland",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Schengen Visa",
    "visaNotes": "Finland Schengen visa processing",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Finland",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Finland",
      "Historic City Center of Finland",
      "Natural Parks & Scenery in Finland",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "France",
    "code": "FR",
    "flag": "\ud83c\uddeb\ud83c\uddf7",
    "continent": "Europe",
    "capital": "Paris",
    "currency": "EUR (Euro)",
    "bestTime": "Apr \u2013 Oct",
    "visaCategory": "embassy_visa",
    "visaLabel": "Schengen Visa",
    "visaNotes": "France Schengen visa via VFS Dhaka",
    "visaProcessSteps": [
      "1. Create France-Visas account online and fill Schengen application",
      "2. Book appointment at VFS Global France Dhaka",
      "3. Documents: 6m bank statement + solvency, tax certificate, NOC, Schengen travel insurance (\u20ac30k coverage), confirmed flight/hotel",
      "4. Processing time: 15 calendar days"
    ],
    "estimatedCost": {
      "flight": "BDT 65,000 - 100,000 (1-stop ~10-12h via Middle East)",
      "dailyBudget": "BDT 9,000 - 18,000 (\u20ac70-\u20ac140/day)",
      "visaFee": "EUR 90 (~BDT 11,500 Schengen Visa Fee) + VFS Service Fee",
      "totalEstimate": "BDT 170,000 - 290,000 (7-10 days)"
    },
    "touristSpots": [
      "Eiffel Tower & Champ de Mars",
      "Louvre Museum & Mona Lisa",
      "Palace of Versailles",
      "French Riviera & Nice Promenade",
      "Mont Saint-Michel"
    ]
  },
  {
    "name": "Germany",
    "code": "DE",
    "flag": "\ud83c\udde9\ud83c\uddea",
    "continent": "Europe",
    "capital": "Capital of Germany",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Schengen Visa",
    "visaNotes": "Germany Schengen visa via VFS Dhaka",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Germany",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Germany",
      "Historic City Center of Germany",
      "Natural Parks & Scenery in Germany",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Ghana",
    "code": "GH",
    "flag": "\ud83c\uddec\ud83c\udded",
    "continent": "Africa",
    "capital": "Capital of Ghana",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "High Commission application",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Ghana",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Ghana",
      "Historic City Center of Ghana",
      "Natural Parks & Scenery in Ghana",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Greece",
    "code": "GR",
    "flag": "\ud83c\uddec\ud83c\uddf7",
    "continent": "Europe",
    "capital": "Capital of Greece",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Schengen Visa",
    "visaNotes": "Greece Schengen visa via VFS Dhaka",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Greece",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Greece",
      "Historic City Center of Greece",
      "Natural Parks & Scenery in Greece",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Guatemala",
    "code": "GT",
    "flag": "\ud83c\uddec\ud83c\uddf9",
    "continent": "North America",
    "capital": "Capital of Guatemala",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "Exempt if holding valid US/Schengen visa",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Guatemala",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Guatemala",
      "Historic City Center of Guatemala",
      "Natural Parks & Scenery in Guatemala",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Guyana",
    "code": "GY",
    "flag": "\ud83c\uddec\ud83c\uddfe",
    "continent": "South America",
    "capital": "Capital of Guyana",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "Embassy visa required",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Guyana",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Guyana",
      "Historic City Center of Guyana",
      "Natural Parks & Scenery in Guyana",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Honduras",
    "code": "HN",
    "flag": "\ud83c\udded\ud83c\uddf3",
    "continent": "North America",
    "capital": "Capital of Honduras",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "Exempt if holding valid US/Schengen visa",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Honduras",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Honduras",
      "Historic City Center of Honduras",
      "Natural Parks & Scenery in Honduras",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Hungary",
    "code": "HU",
    "flag": "\ud83c\udded\ud83c\uddfa",
    "continent": "Europe",
    "capital": "Capital of Hungary",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Schengen Visa",
    "visaNotes": "Hungary Schengen visa via Embassy/VFS",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Hungary",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Hungary",
      "Historic City Center of Hungary",
      "Natural Parks & Scenery in Hungary",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Iceland",
    "code": "IS",
    "flag": "\ud83c\uddee\ud83c\uddf8",
    "continent": "Europe",
    "capital": "Capital of Iceland",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Schengen Visa",
    "visaNotes": "Iceland Schengen visa via VFS",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Iceland",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Iceland",
      "Historic City Center of Iceland",
      "Natural Parks & Scenery in Iceland",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Iraq",
    "code": "IQ",
    "flag": "\ud83c\uddee\ud83c\uddf6",
    "continent": "Asia",
    "capital": "Capital of Iraq",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "Embassy processing or approval permit",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Iraq",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Iraq",
      "Historic City Center of Iraq",
      "Natural Parks & Scenery in Iraq",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Ireland",
    "code": "IE",
    "flag": "\ud83c\uddee\ud83c\uddea",
    "continent": "Europe",
    "capital": "Capital of Ireland",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Irish Visa",
    "visaNotes": "AVATS online application + VFS Dhaka",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Ireland",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Ireland",
      "Historic City Center of Ireland",
      "Natural Parks & Scenery in Ireland",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Israel",
    "code": "IL",
    "flag": "\ud83c\uddee\ud83c\uddf1",
    "continent": "Asia",
    "capital": "Capital of Israel",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Special Visa",
    "visaNotes": "Special permit required",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Israel",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Israel",
      "Historic City Center of Israel",
      "Natural Parks & Scenery in Israel",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Italy",
    "code": "IT",
    "flag": "\ud83c\uddee\ud83c\uddf9",
    "continent": "Europe",
    "capital": "Capital of Italy",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Schengen Visa",
    "visaNotes": "Italy Schengen visa via VFS Dhaka",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Italy",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Italy",
      "Historic City Center of Italy",
      "Natural Parks & Scenery in Italy",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Jamaica",
    "code": "JM",
    "flag": "\ud83c\uddef\ud83c\uddf2",
    "continent": "North America",
    "capital": "Capital of Jamaica",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy / VoA",
    "visaNotes": "Visa required or VoA with US visa",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Jamaica",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Jamaica",
      "Historic City Center of Jamaica",
      "Natural Parks & Scenery in Jamaica",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Japan",
    "code": "JP",
    "flag": "\ud83c\uddef\ud83c\uddf5",
    "continent": "Asia",
    "capital": "Tokyo",
    "currency": "JPY (Japanese Yen)",
    "bestTime": "Mar \u2013 May (Cherry Blossom) & Sep \u2013 Nov (Autumn)",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Sticker Visa",
    "visaNotes": "VFS / Embassy submission with financial proof",
    "visaProcessSteps": [
      "1. Prepare application for Embassy of Japan in Dhaka / VFS Japan",
      "2. Required: Passport, Japan visa form, passport photo, 6m bank statement & solvency",
      "3. Income Tax Return (TIN/Tax Certificate), Job NOC/Business Trade License, Schedule of Stay (day-by-day itinerary)",
      "4. Processing time: 5-8 working days"
    ],
    "estimatedCost": {
      "flight": "BDT 55,000 - 85,000 (1-stop ~7-9h via BKK/SIN/CAN)",
      "dailyBudget": "BDT 7,000 - 14,000 ($60-$120/day)",
      "visaFee": "Free / BDT 1,000 (Embassy Fee)",
      "totalEstimate": "BDT 140,000 - 230,000 (7-10 days)"
    },
    "touristSpots": [
      "Tokyo Senso-ji & Shibuya Crossing",
      "Kyoto Fushimi Inari & Arashiyama Bamboo Grove",
      "Mount Fuji & Lake Kawaguchiko",
      "Osaka Dotonbori & Castle",
      "Nara Deer Park"
    ]
  },
  {
    "name": "Kosovo",
    "code": "XK",
    "flag": "\ud83c\uddfd\ud83c\uddf0",
    "continent": "Europe",
    "capital": "Capital of Kosovo",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy / Schengen",
    "visaNotes": "Embassy visa or valid Schengen visa",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Kosovo",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Kosovo",
      "Historic City Center of Kosovo",
      "Natural Parks & Scenery in Kosovo",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Kuwait",
    "code": "KW",
    "flag": "\ud83c\uddf0\ud83c\uddfc",
    "continent": "Asia",
    "capital": "Capital of Kuwait",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "NOC / Embassy processing required",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Kuwait",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Kuwait",
      "Historic City Center of Kuwait",
      "Natural Parks & Scenery in Kuwait",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Latvia",
    "code": "LV",
    "flag": "\ud83c\uddf1\ud83c\uddfb",
    "continent": "Europe",
    "capital": "Capital of Latvia",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Schengen Visa",
    "visaNotes": "Latvia Schengen visa via VFS",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Latvia",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Latvia",
      "Historic City Center of Latvia",
      "Natural Parks & Scenery in Latvia",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Liberia",
    "code": "LR",
    "flag": "\ud83c\uddf1\ud83c\uddf7",
    "continent": "Africa",
    "capital": "Capital of Liberia",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "Embassy visa required",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Liberia",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Liberia",
      "Historic City Center of Liberia",
      "Natural Parks & Scenery in Liberia",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Libya",
    "code": "LY",
    "flag": "\ud83c\uddf1\ud83c\uddfe",
    "continent": "Africa",
    "capital": "Capital of Libya",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "Approval permit required",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Libya",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Libya",
      "Historic City Center of Libya",
      "Natural Parks & Scenery in Libya",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Liechtenstein",
    "code": "LI",
    "flag": "\ud83c\uddf1\ud83c\uddee",
    "continent": "Europe",
    "capital": "Capital of Liechtenstein",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Schengen Visa",
    "visaNotes": "Access via Swiss Schengen visa",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Liechtenstein",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Liechtenstein",
      "Historic City Center of Liechtenstein",
      "Natural Parks & Scenery in Liechtenstein",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Lithuania",
    "code": "LT",
    "flag": "\ud83c\uddf1\ud83c\uddf9",
    "continent": "Europe",
    "capital": "Capital of Lithuania",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Schengen Visa",
    "visaNotes": "Lithuania Schengen visa via VFS",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Lithuania",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Lithuania",
      "Historic City Center of Lithuania",
      "Natural Parks & Scenery in Lithuania",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Luxembourg",
    "code": "LU",
    "flag": "\ud83c\uddf1\ud83c\uddfa",
    "continent": "Europe",
    "capital": "Capital of Luxembourg",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Schengen Visa",
    "visaNotes": "Luxembourg Schengen visa via VFS",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Luxembourg",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Luxembourg",
      "Historic City Center of Luxembourg",
      "Natural Parks & Scenery in Luxembourg",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Mali",
    "code": "ML",
    "flag": "\ud83c\uddf2\ud83c\uddf1",
    "continent": "Africa",
    "capital": "Capital of Mali",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "Embassy visa required",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Mali",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Mali",
      "Historic City Center of Mali",
      "Natural Parks & Scenery in Mali",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Malta",
    "code": "MT",
    "flag": "\ud83c\uddf2\ud83c\uddf9",
    "continent": "Europe",
    "capital": "Capital of Malta",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Schengen Visa",
    "visaNotes": "Malta Schengen visa via VFS",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Malta",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Malta",
      "Historic City Center of Malta",
      "Natural Parks & Scenery in Malta",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Mexico",
    "code": "MX",
    "flag": "\ud83c\uddf2\ud83c\uddfd",
    "continent": "North America",
    "capital": "Capital of Mexico",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "Exempt if holding valid US/Canada/UK/Schengen visa",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Mexico",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Mexico",
      "Historic City Center of Mexico",
      "Natural Parks & Scenery in Mexico",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Monaco",
    "code": "MC",
    "flag": "\ud83c\uddf2\ud83c\udde8",
    "continent": "Europe",
    "capital": "Capital of Monaco",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Schengen Access",
    "visaNotes": "Access via France Schengen visa",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Monaco",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Monaco",
      "Historic City Center of Monaco",
      "Natural Parks & Scenery in Monaco",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Montenegro",
    "code": "ME",
    "flag": "\ud83c\uddf2\ud83c\uddea",
    "continent": "Europe",
    "capital": "Capital of Montenegro",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy / Schengen",
    "visaNotes": "Embassy visa or valid Schengen/US/UK visa",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Montenegro",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Montenegro",
      "Historic City Center of Montenegro",
      "Natural Parks & Scenery in Montenegro",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Myanmar",
    "code": "MM",
    "flag": "\ud83c\uddf2\ud83c\uddf2",
    "continent": "Asia",
    "capital": "Capital of Myanmar",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "Embassy of Myanmar in Dhaka",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Myanmar",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Myanmar",
      "Historic City Center of Myanmar",
      "Natural Parks & Scenery in Myanmar",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Nauru",
    "code": "NR",
    "flag": "\ud83c\uddf3\ud83c\uddf7",
    "continent": "Oceania",
    "capital": "Capital of Nauru",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "Embassy visa required",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Nauru",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Nauru",
      "Historic City Center of Nauru",
      "Natural Parks & Scenery in Nauru",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Netherlands",
    "code": "NL",
    "flag": "\ud83c\uddf3\ud83c\uddf1",
    "continent": "Europe",
    "capital": "Capital of Netherlands",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Schengen Visa",
    "visaNotes": "Netherlands Schengen visa via VFS Dhaka",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Netherlands",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Netherlands",
      "Historic City Center of Netherlands",
      "Natural Parks & Scenery in Netherlands",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "New Zealand",
    "code": "NZ",
    "flag": "\ud83c\uddf3\ud83c\uddff",
    "continent": "Oceania",
    "capital": "Capital of New Zealand",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Visitor Visa",
    "visaNotes": "Online RealMe portal application",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for New Zealand",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in New Zealand",
      "Historic City Center of New Zealand",
      "Natural Parks & Scenery in New Zealand",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Niger",
    "code": "NE",
    "flag": "\ud83c\uddf3\ud83c\uddea",
    "continent": "Africa",
    "capital": "Capital of Niger",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "Embassy visa required",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Niger",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Niger",
      "Historic City Center of Niger",
      "Natural Parks & Scenery in Niger",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "North Korea",
    "code": "KP",
    "flag": "\ud83c\uddf0\ud83c\uddf5",
    "continent": "Asia",
    "capital": "Capital of North Korea",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "Authorized tour operator visa only",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for North Korea",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in North Korea",
      "Historic City Center of North Korea",
      "Natural Parks & Scenery in North Korea",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "North Macedonia",
    "code": "MK",
    "flag": "\ud83c\uddf2\ud83c\uddf0",
    "continent": "Europe",
    "capital": "Capital of North Macedonia",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy / Schengen",
    "visaNotes": "Embassy visa or valid Schengen visa",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for North Macedonia",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in North Macedonia",
      "Historic City Center of North Macedonia",
      "Natural Parks & Scenery in North Macedonia",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Norway",
    "code": "NO",
    "flag": "\ud83c\uddf3\ud83c\uddf4",
    "continent": "Europe",
    "capital": "Capital of Norway",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Schengen Visa",
    "visaNotes": "Norway Schengen visa via VFS Dhaka",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Norway",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Norway",
      "Historic City Center of Norway",
      "Natural Parks & Scenery in Norway",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Palestine",
    "code": "PS",
    "flag": "\ud83c\uddf5\ud83c\uddf8",
    "continent": "Asia",
    "capital": "Capital of Palestine",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Entry Permit",
    "visaNotes": "Subject to Israeli border authority approval",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Palestine",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Palestine",
      "Historic City Center of Palestine",
      "Natural Parks & Scenery in Palestine",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Panama",
    "code": "PA",
    "flag": "\ud83c\uddf5\ud83c\udde6",
    "continent": "North America",
    "capital": "Capital of Panama",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Stamped Visa",
    "visaNotes": "Stamped visa or exempt with valid US visa",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Panama",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Panama",
      "Historic City Center of Panama",
      "Natural Parks & Scenery in Panama",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Paraguay",
    "code": "PY",
    "flag": "\ud83c\uddf5\ud83c\uddfe",
    "continent": "South America",
    "capital": "Capital of Paraguay",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "Embassy visa required",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Paraguay",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Paraguay",
      "Historic City Center of Paraguay",
      "Natural Parks & Scenery in Paraguay",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Peru",
    "code": "PE",
    "flag": "\ud83c\uddf5\ud83c\uddea",
    "continent": "South America",
    "capital": "Capital of Peru",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "Exempt if holding US/Canada/UK/Schengen visa",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Peru",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Peru",
      "Historic City Center of Peru",
      "Natural Parks & Scenery in Peru",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Philippines",
    "code": "PH",
    "flag": "\ud83c\uddf5\ud83c\udded",
    "continent": "Asia",
    "capital": "Capital of Philippines",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "Philippine Embassy Dhaka application",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Philippines",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Philippines",
      "Historic City Center of Philippines",
      "Natural Parks & Scenery in Philippines",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Poland",
    "code": "PL",
    "flag": "\ud83c\uddf5\ud83c\uddf1",
    "continent": "Europe",
    "capital": "Capital of Poland",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Schengen Visa",
    "visaNotes": "Poland Schengen visa via Embassy/VFS",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Poland",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Poland",
      "Historic City Center of Poland",
      "Natural Parks & Scenery in Poland",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Portugal",
    "code": "PT",
    "flag": "\ud83c\uddf5\ud83c\uddf9",
    "continent": "Europe",
    "capital": "Capital of Portugal",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Schengen Visa",
    "visaNotes": "Portugal Schengen visa processing",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Portugal",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Portugal",
      "Historic City Center of Portugal",
      "Natural Parks & Scenery in Portugal",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Romania",
    "code": "RO",
    "flag": "\ud83c\uddf7\ud83c\uddf4",
    "continent": "Europe",
    "capital": "Capital of Romania",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Schengen / National",
    "visaNotes": "Romania national visa or Schengen",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Romania",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Romania",
      "Historic City Center of Romania",
      "Natural Parks & Scenery in Romania",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "San Marino",
    "code": "SM",
    "flag": "\ud83c\uddf8\ud83c\uddf2",
    "continent": "Europe",
    "capital": "Capital of San Marino",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Schengen Access",
    "visaNotes": "Access via Italy Schengen visa",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for San Marino",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in San Marino",
      "Historic City Center of San Marino",
      "Natural Parks & Scenery in San Marino",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Serbia",
    "code": "RS",
    "flag": "\ud83c\uddf7\ud83c\uddf8",
    "continent": "Europe",
    "capital": "Capital of Serbia",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "Embassy application required",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Serbia",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Serbia",
      "Historic City Center of Serbia",
      "Natural Parks & Scenery in Serbia",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Slovakia",
    "code": "SK",
    "flag": "\ud83c\uddf8\ud83c\uddf0",
    "continent": "Europe",
    "capital": "Capital of Slovakia",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Schengen Visa",
    "visaNotes": "Slovakia Schengen visa via VFS",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Slovakia",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Slovakia",
      "Historic City Center of Slovakia",
      "Natural Parks & Scenery in Slovakia",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Slovenia",
    "code": "SI",
    "flag": "\ud83c\uddf8\ud83c\uddee",
    "continent": "Europe",
    "capital": "Capital of Slovenia",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Schengen Visa",
    "visaNotes": "Slovenia Schengen visa via VFS",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Slovenia",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Slovenia",
      "Historic City Center of Slovenia",
      "Natural Parks & Scenery in Slovenia",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "South Africa",
    "code": "ZA",
    "flag": "\ud83c\uddff\ud83c\udde6",
    "continent": "Africa",
    "capital": "Capital of South Africa",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "Application via VFS Global",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for South Africa",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in South Africa",
      "Historic City Center of South Africa",
      "Natural Parks & Scenery in South Africa",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "South Korea",
    "code": "KR",
    "flag": "\ud83c\uddf0\ud83c\uddf7",
    "continent": "Asia",
    "capital": "Capital of South Korea",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Sticker Visa",
    "visaNotes": "Korean Embassy application in Dhaka",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for South Korea",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in South Korea",
      "Historic City Center of South Korea",
      "Natural Parks & Scenery in South Korea",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Spain",
    "code": "ES",
    "flag": "\ud83c\uddea\ud83c\uddf8",
    "continent": "Europe",
    "capital": "Capital of Spain",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Schengen Visa",
    "visaNotes": "Spain Schengen visa via BLS Dhaka",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Spain",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Spain",
      "Historic City Center of Spain",
      "Natural Parks & Scenery in Spain",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Sudan",
    "code": "SD",
    "flag": "\ud83c\uddf8\ud83c\udde9",
    "continent": "Africa",
    "capital": "Capital of Sudan",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "Embassy visa required",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Sudan",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Sudan",
      "Historic City Center of Sudan",
      "Natural Parks & Scenery in Sudan",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Sweden",
    "code": "SE",
    "flag": "\ud83c\uddf8\ud83c\uddea",
    "continent": "Europe",
    "capital": "Capital of Sweden",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Schengen Visa",
    "visaNotes": "Sweden Schengen visa via VFS Dhaka",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Sweden",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Sweden",
      "Historic City Center of Sweden",
      "Natural Parks & Scenery in Sweden",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Switzerland",
    "code": "CH",
    "flag": "\ud83c\udde8\ud83c\udded",
    "continent": "Europe",
    "capital": "Capital of Switzerland",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Schengen Visa",
    "visaNotes": "Switzerland Schengen visa via VFS Dhaka",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Switzerland",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Switzerland",
      "Historic City Center of Switzerland",
      "Natural Parks & Scenery in Switzerland",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Syria",
    "code": "SY",
    "flag": "\ud83c\uddf8\ud83c\uddfe",
    "continent": "Asia",
    "capital": "Capital of Syria",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "Embassy processing required",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Syria",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Syria",
      "Historic City Center of Syria",
      "Natural Parks & Scenery in Syria",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Taiwan",
    "code": "TW",
    "flag": "\ud83c\uddf9\ud83c\uddfc",
    "continent": "Asia",
    "capital": "Capital of Taiwan",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "e-Code / Embassy",
    "visaNotes": "Online e-Code or TECO submission",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Taiwan",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Taiwan",
      "Historic City Center of Taiwan",
      "Natural Parks & Scenery in Taiwan",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Trinidad and Tobago",
    "code": "TT",
    "flag": "\ud83c\uddf9\ud83c\uddf9",
    "continent": "North America",
    "capital": "Capital of Trinidad and Tobago",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "Embassy visa required",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Trinidad and Tobago",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Trinidad and Tobago",
      "Historic City Center of Trinidad and Tobago",
      "Natural Parks & Scenery in Trinidad and Tobago",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Tunisia",
    "code": "TN",
    "flag": "\ud83c\uddf9\ud83c\uddf3",
    "continent": "Africa",
    "capital": "Capital of Tunisia",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "Embassy of Tunisia processing",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Tunisia",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Tunisia",
      "Historic City Center of Tunisia",
      "Natural Parks & Scenery in Tunisia",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Turkmenistan",
    "code": "TM",
    "flag": "\ud83c\uddf9\ud83c\uddf2",
    "continent": "Asia",
    "capital": "Capital of Turkmenistan",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "Letter of Invitation required",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Turkmenistan",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Turkmenistan",
      "Historic City Center of Turkmenistan",
      "Natural Parks & Scenery in Turkmenistan",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "United Kingdom",
    "code": "GB",
    "flag": "\ud83c\uddec\ud83c\udde7",
    "continent": "Europe",
    "capital": "London",
    "currency": "GBP (British Pound)",
    "bestTime": "May \u2013 Sep",
    "visaCategory": "embassy_visa",
    "visaLabel": "UK Standard Visitor",
    "visaNotes": "VFS Global application in Dhaka/Sylhet",
    "visaProcessSteps": [
      "1. Complete online visa application at gov.uk/standard-visitor-visa",
      "2. Pay visa fee online and book biometrics appointment at VFS Global Dhaka or Sylhet",
      "3. Upload financial evidence (6m bank statements, salary slips, tax returns, property assets)",
      "4. Attend VFS appointment for biometric scan & passport submission (Processing: 3-6 weeks)"
    ],
    "estimatedCost": {
      "flight": "BDT 65,000 - 110,000 (Direct Biman / 1-stop Emirates/Qatar/Etihad)",
      "dailyBudget": "BDT 10,000 - 20,000 (\u00a370-\u00a3140/day)",
      "visaFee": "GBP 115 (~BDT 18,000 for 6-month Standard Visitor Visa)",
      "totalEstimate": "BDT 180,000 - 320,000 (7-10 days)"
    },
    "touristSpots": [
      "London Eye & Big Ben",
      "Tower of London & Tower Bridge",
      "Edinburgh Castle & Royal Mile",
      "Stonehenge & Bath",
      "Loch Ness & Scottish Highlands"
    ]
  },
  {
    "name": "United States",
    "code": "US",
    "flag": "\ud83c\uddfa\ud83c\uddf8",
    "continent": "North America",
    "capital": "Washington, D.C.",
    "currency": "USD (US Dollar)",
    "bestTime": "May \u2013 Sep & Oct \u2013 Nov",
    "visaCategory": "embassy_visa",
    "visaLabel": "B1/B2 Visitor Visa",
    "visaNotes": "US Embassy Dhaka interview & DS-160",
    "visaProcessSteps": [
      "1. Complete online DS-160 Nonimmigrant Visa application form at ceac.state.gov",
      "2. Create account on ustraveldocs.com/bd, pay $185 visa fee at EBL bank",
      "3. Schedule interview appointment at US Embassy Dhaka (Madani Avenue)",
      "4. Attend in-person interview with passport, DS-160 confirmation, photo, and supporting documents"
    ],
    "estimatedCost": {
      "flight": "BDT 90,000 - 150,000 (1-stop ~16-20h via Qatar/Emirates/Turkish)",
      "dailyBudget": "BDT 12,000 - 25,000 ($100-$200/day)",
      "visaFee": "USD 185 (~BDT 22,500 B1/B2 Visitor Visa Fee)",
      "totalEstimate": "BDT 250,000 - 450,000 (10-14 days)"
    },
    "touristSpots": [
      "New York Statue of Liberty & Times Square",
      "Grand Canyon National Park",
      "Washington D.C. National Mall & Capitol",
      "Niagara Falls",
      "Yellowstone National Park"
    ]
  },
  {
    "name": "Uruguay",
    "code": "UY",
    "flag": "\ud83c\uddfa\ud83c\uddfe",
    "continent": "South America",
    "capital": "Capital of Uruguay",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "Embassy visa required",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Uruguay",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Uruguay",
      "Historic City Center of Uruguay",
      "Natural Parks & Scenery in Uruguay",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Vatican City",
    "code": "VA",
    "flag": "\ud83c\uddfb\ud83c\udde6",
    "continent": "Europe",
    "capital": "Capital of Vatican City",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Schengen Access",
    "visaNotes": "Access via Italy Schengen visa",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Vatican City",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Vatican City",
      "Historic City Center of Vatican City",
      "Natural Parks & Scenery in Vatican City",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Venezuela",
    "code": "VE",
    "flag": "\ud83c\uddfb\ud83c\uddea",
    "continent": "South America",
    "capital": "Capital of Venezuela",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "Embassy visa required",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Venezuela",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Venezuela",
      "Historic City Center of Venezuela",
      "Natural Parks & Scenery in Venezuela",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  },
  {
    "name": "Yemen",
    "code": "YE",
    "flag": "\ud83c\uddfe\ud83c\uddea",
    "continent": "Asia",
    "capital": "Capital of Yemen",
    "currency": "Local Currency / USD",
    "bestTime": "Oct \u2013 Apr",
    "visaCategory": "embassy_visa",
    "visaLabel": "Embassy Visa",
    "visaNotes": "Sponsor visa required",
    "visaProcessSteps": [
      "1. Check official visa portal or embassy requirement for Yemen",
      "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
      "3. Submit application online (eVisa) or via official visa processing center / embassy",
      "4. Allow 3-10 working days for processing"
    ],
    "estimatedCost": {
      "flight": "BDT 45,000 - 80,000 (1-2 stops from DAC)",
      "dailyBudget": "BDT 4,000 - 8,000 ($35-$70/day)",
      "visaFee": "Check official embassy/eVisa portal",
      "totalEstimate": "BDT 80,000 - 150,000 (5-7 days)"
    },
    "touristSpots": [
      "Famous Landmarks in Yemen",
      "Historic City Center of Yemen",
      "Natural Parks & Scenery in Yemen",
      "Local Cultural Heritage Sites",
      "Popular Beach / Mountain Resort"
    ]
  }
];

export function getCountryByName(name: string): CountryData | undefined {
  const clean = name.trim().toLowerCase()
  return WORLD_COUNTRIES.find((c) => c.name.toLowerCase() === clean || c.code.toLowerCase() === clean)
}
