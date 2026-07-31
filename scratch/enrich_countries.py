import os
import json

# Comprehensive world countries data with capital, currency, best time, flight, budget, visa process, and top tourist spots
country_details = {
    # ── ASIA ──
    "Nepal": {
        "capital": "Kathmandu", "currency": "NPR (Nepalese Rupee)", "bestTime": "Oct – Nov & Mar – May",
        "flight": "BDT 18,000 - 26,000 (Direct ~1h 15m from DAC)", "dailyBudget": "BDT 2,500 - 4,500 ($25-$40/day)",
        "visaFee": "Gratis (Free for 1st visit of calendar year)", "totalEstimate": "BDT 35,000 - 55,000 (5-7 days)",
        "visaProcess": [
            "1. Arrive at Tribhuvan International Airport (KTM) or land border",
            "2. Complete online VoA kiosk form at airport arrival hall",
            "3. Present passport (min 6 months validity), passport photo, and return air ticket",
            "4. Receive 15/30-day Gratis Visa stamp on passport"
        ],
        "spots": ["Kathmandu Valley & Durbar Square", "Pokhara & Phewa Lake", "Nagarkot Sunrise Viewpoint", "Chitwan National Park", "Annapurna Circuit Trek", "Sarangkot Paragliding"]
    },
    "Maldives": {
        "capital": "Malé", "currency": "MVR (Maldivian Rufiyaa / USD)", "bestTime": "Nov – Apr",
        "flight": "BDT 35,000 - 50,000 (Direct ~3h 45m US-Bangla / Maldivian)", "dailyBudget": "BDT 7,000 - 15,000 ($60-$130/day)",
        "visaFee": "Free (30-day Visa on Arrival)", "totalEstimate": "BDT 75,000 - 140,000 (4-5 days)",
        "visaProcess": [
            "1. Fill out IMUGA Traveler Declaration online within 96 hours before departure",
            "2. Ensure confirmed hotel/resort booking and return flight ticket",
            "3. Present passport at Velana Airport (MLE) immigration desk",
            "4. Get 30-day free Visa on Arrival stamp"
        ],
        "spots": ["Malé City & Grand Friday Mosque", "Maafushi Local Island", "Ari Atoll Overwater Bungalows", "Baa Atoll Biosphere Reserve", "Hulhumalé Beach", "Vaadhoo Sea of Stars"]
    },
    "Thailand": {
        "capital": "Bangkok", "currency": "THB (Thai Baht)", "bestTime": "Nov – Apr",
        "flight": "BDT 24,000 - 35,000 (Direct ~2h 30m Thai Airways/Biman/US-Bangla)", "dailyBudget": "BDT 3,500 - 7,000 ($35-$65/day)",
        "visaFee": "BDT 4,000 - 5,500 (Single Entry Sticker/eVisa)", "totalEstimate": "BDT 55,000 - 90,000 (5-7 days)",
        "visaProcess": [
            "1. Apply online via official Thai E-Visa portal or VFS Global Thailand Dhaka",
            "2. Required: Passport (6m+), 6m Bank Statement (min BDT 60k/person or 150k/family), Bank Solvency Certificate",
            "3. Job NOC / Business Trade License, Air Ticket & Hotel Booking",
            "4. Processing time: 3-5 working days"
        ],
        "spots": ["Bangkok Grand Palace & Wat Arun", "Phuket Patong Beach & Phi Phi Islands", "Chiang Mai Old City & Night Bazaar", "Pattaya Floating Market & Coral Island", "Krabi Railay Beach"]
    },
    "Malaysia": {
        "capital": "Kuala Lumpur", "currency": "MYR (Malaysian Ringgit)", "bestTime": "Year-round (Best Mar – Oct)",
        "flight": "BDT 28,000 - 40,000 (Direct ~3h 45m Biman/AirAsia/Batik)", "dailyBudget": "BDT 4,000 - 7,500 ($35-$70/day)",
        "visaFee": "BDT 3,500 - 5,000 (eVisa online)", "totalEstimate": "BDT 60,000 - 100,000 (5-7 days)",
        "visaProcess": [
            "1. Apply online via Malaysia eVisa official portal (malaysiavisa.imi.gov.my)",
            "2. Upload passport photo, passport bio page, flight ticket, hotel booking",
            "3. Submit 3-month bank statement with solvency certificate",
            "4. Receive eVISA approval PDF via email in 2-4 working days"
        ],
        "spots": ["Petronas Twin Towers & KL Tower", "Batu Caves Hindu Temple", "Genting Highlands Cable Car", "Langkawi Cable Car & Sky Bridge", "Penang George Town Street Art"]
    },
    "Vietnam": {
        "capital": "Hanoi", "currency": "VND (Vietnamese Dong)", "bestTime": "Dec – Apr",
        "flight": "BDT 35,000 - 48,000 (Direct / 1-stop ~4h 30m)", "dailyBudget": "BDT 3,000 - 5,500 ($25-$50/day)",
        "visaFee": "USD 25 (~BDT 3,000 for 90-day single entry eVisa)", "totalEstimate": "BDT 55,000 - 85,000 (6-8 days)",
        "visaProcess": [
            "1. Apply on official Vietnam E-Visa portal (evisa.xuatnhapcanh.gov.vn)",
            "2. Upload passport scan and passport photo",
            "3. Pay $25 fee via card",
            "4. Receive 90-day e-Visa PDF in 3 working days"
        ],
        "spots": ["Ha Long Bay Cruise", "Hanoi Old Quarter & Hoan Kiem Lake", "Hoi An Ancient Town & Lanterns", "Da Nang Ba Na Hills & Golden Bridge", "Ho Chi Minh City Ben Thanh Market"]
    },
    "Bhutan": {
        "capital": "Thimphu", "currency": "BTN (Ngultrum / INR)", "bestTime": "Mar – May & Sep – Nov",
        "flight": "BDT 22,000 - 32,000 (Direct Drukair ~1h from DAC to PBH)", "dailyBudget": "SDF USD 100/day + BDT 5,000 hotel/food",
        "visaFee": "SDF USD 100 per night (Sustainable Development Fee)", "totalEstimate": "BDT 80,000 - 130,000 (4-5 days)",
        "visaProcess": [
            "1. Apply for Bhutan entry permit online or via registered Bhutanese tour operator",
            "2. Pay the daily Sustainable Development Fee (SDF)",
            "3. Present passport at Paro Airport (PBH) or Samdrup Jongkhar land border",
            "4. Receive Entry Permit stamp"
        ],
        "spots": ["Tiger's Nest Monastery (Paro Taktsang)", "Thimphu Buddha Dordenma Statue", "Punakha Dzong & Suspension Bridge", "Dochula Pass 108 Chortens", "Phobjikha Valley"]
    },
    "Sri Lanka": {
        "capital": "Colombo / Sri Jayawardenepura Kotte", "currency": "LKR (Sri Lankan Rupee)", "bestTime": "Dec – Apr (West/South), May – Sep (East)",
        "flight": "BDT 32,000 - 45,000 (Direct / 1-stop ~3h 30m)", "dailyBudget": "BDT 3,000 - 6,000 ($25-$50/day)",
        "visaFee": "USD 50 (~BDT 6,000 ETA online)", "totalEstimate": "BDT 60,000 - 95,000 (6-8 days)",
        "visaProcess": [
            "1. Apply for ETA online at srilankaeta.lk",
            "2. Pay $50 fee online",
            "3. Receive ETA approval via email within 24 hours",
            "4. Present passport, return ticket, and hotel booking at Colombo (CMB) airport"
        ],
        "spots": ["Sigiriya Rock Fortress", "Kandy Temple of the Sacred Tooth Relic", "Ella Scenic Train Journey", "Galle Dutch Fort", "Mirissa Whale Watching & Beach"]
    },
    "Turkey": {
        "capital": "Ankara", "currency": "TRY (Turkish Lira)", "bestTime": "Apr – May & Sep – Nov",
        "flight": "BDT 55,000 - 80,000 (Direct Turkish Airlines ~7h from DAC)", "dailyBudget": "BDT 6,000 - 12,000 ($50-$100/day)",
        "visaFee": "BDT 16,000 - 22,000 (Sticker Visa via Gateway) or $50 (eVisa if US/UK/Schengen held)", "totalEstimate": "BDT 120,000 - 200,000 (7-10 days)",
        "visaProcess": [
            "1. If holding valid US/UK/Schengen visa: Apply instantly online at evisa.gov.tr ($50)",
            "2. Otherwise: Apply for sticker visa via Gateway Management Dhaka",
            "3. Documents: 6m bank statement, job NOC/business documents, biometric photo, flight & hotel",
            "4. Processing time: 7-12 working days"
        ],
        "spots": ["Istanbul Hagia Sophia & Blue Mosque", "Cappadocia Hot Air Balloon Ride", "Pamukkale Thermal Travertines", "Ephesus Ancient Greek Ruins", "Antalya Turquoise Coast"]
    },
    "United Arab Emirates": {
        "capital": "Abu Dhabi", "currency": "AED (Emirati Dirham)", "bestTime": "Nov – Mar",
        "flight": "BDT 35,000 - 55,000 (Direct ~4h 45m Emirates/Flydubai/Air Arabia)", "dailyBudget": "BDT 7,000 - 15,000 ($60-$130/day)",
        "visaFee": "BDT 8,000 - 12,000 (30-day Tourist Visa)", "totalEstimate": "BDT 85,000 - 150,000 (4-6 days)",
        "visaProcess": [
            "1. Apply online via Emirates/Flydubai airlines, UAE ICP portal, or authorized travel agent",
            "2. Upload passport color copy, passport photo, return ticket",
            "3. Receive e-Visa approval PDF in 2-4 working days",
            "4. Present printed e-Visa at Dubai (DXB) or Abu Dhabi (AUH) airport"
        ],
        "spots": ["Burj Khalifa & Dubai Mall", "Sheikh Zayed Grand Mosque Abu Dhabi", "Dubai Desert Safari & Dunes", "Museum of the Future", "Palm Jumeirah & Atlantis"]
    },
    "Japan": {
        "capital": "Tokyo", "currency": "JPY (Japanese Yen)", "bestTime": "Mar – May (Cherry Blossom) & Sep – Nov (Autumn)",
        "flight": "BDT 55,000 - 85,000 (1-stop ~7-9h via BKK/SIN/CAN)", "dailyBudget": "BDT 7,000 - 14,000 ($60-$120/day)",
        "visaFee": "Free / BDT 1,000 (Embassy Fee)", "totalEstimate": "BDT 140,000 - 230,000 (7-10 days)",
        "visaProcess": [
            "1. Prepare application for Embassy of Japan in Dhaka / VFS Japan",
            "2. Required: Passport, Japan visa form, passport photo, 6m bank statement & solvency",
            "3. Income Tax Return (TIN/Tax Certificate), Job NOC/Business Trade License, Schedule of Stay (day-by-day itinerary)",
            "4. Processing time: 5-8 working days"
        ],
        "spots": ["Tokyo Senso-ji & Shibuya Crossing", "Kyoto Fushimi Inari & Arashiyama Bamboo Grove", "Mount Fuji & Lake Kawaguchiko", "Osaka Dotonbori & Castle", "Nara Deer Park"]
    },
    "United Kingdom": {
        "capital": "London", "currency": "GBP (British Pound)", "bestTime": "May – Sep",
        "flight": "BDT 65,000 - 110,000 (Direct Biman / 1-stop Emirates/Qatar/Etihad)", "dailyBudget": "BDT 10,000 - 20,000 (£70-£140/day)",
        "visaFee": "GBP 115 (~BDT 18,000 for 6-month Standard Visitor Visa)", "totalEstimate": "BDT 180,000 - 320,000 (7-10 days)",
        "visaProcess": [
            "1. Complete online visa application at gov.uk/standard-visitor-visa",
            "2. Pay visa fee online and book biometrics appointment at VFS Global Dhaka or Sylhet",
            "3. Upload financial evidence (6m bank statements, salary slips, tax returns, property assets)",
            "4. Attend VFS appointment for biometric scan & passport submission (Processing: 3-6 weeks)"
        ],
        "spots": ["London Eye & Big Ben", "Tower of London & Tower Bridge", "Edinburgh Castle & Royal Mile", "Stonehenge & Bath", "Loch Ness & Scottish Highlands"]
    },
    "France": {
        "capital": "Paris", "currency": "EUR (Euro)", "bestTime": "Apr – Oct",
        "flight": "BDT 65,000 - 100,000 (1-stop ~10-12h via Middle East)", "dailyBudget": "BDT 9,000 - 18,000 (€70-€140/day)",
        "visaFee": "EUR 90 (~BDT 11,500 Schengen Visa Fee) + VFS Service Fee", "totalEstimate": "BDT 170,000 - 290,000 (7-10 days)",
        "visaProcess": [
            "1. Create France-Visas account online and fill Schengen application",
            "2. Book appointment at VFS Global France Dhaka",
            "3. Documents: 6m bank statement + solvency, tax certificate, NOC, Schengen travel insurance (€30k coverage), confirmed flight/hotel",
            "4. Processing time: 15 calendar days"
        ],
        "spots": ["Eiffel Tower & Champ de Mars", "Louvre Museum & Mona Lisa", "Palace of Versailles", "French Riviera & Nice Promenade", "Mont Saint-Michel"]
    },
    "United States": {
        "capital": "Washington, D.C.", "currency": "USD (US Dollar)", "bestTime": "May – Sep & Oct – Nov",
        "flight": "BDT 90,000 - 150,000 (1-stop ~16-20h via Qatar/Emirates/Turkish)", "dailyBudget": "BDT 12,000 - 25,000 ($100-$200/day)",
        "visaFee": "USD 185 (~BDT 22,500 B1/B2 Visitor Visa Fee)", "totalEstimate": "BDT 250,000 - 450,000 (10-14 days)",
        "visaProcess": [
            "1. Complete online DS-160 Nonimmigrant Visa application form at ceac.state.gov",
            "2. Create account on ustraveldocs.com/bd, pay $185 visa fee at EBL bank",
            "3. Schedule interview appointment at US Embassy Dhaka (Madani Avenue)",
            "4. Attend in-person interview with passport, DS-160 confirmation, photo, and supporting documents"
        ],
        "spots": ["New York Statue of Liberty & Times Square", "Grand Canyon National Park", "Washington D.C. National Mall & Capitol", "Niagara Falls", "Yellowstone National Park"]
    }
}

# Helper to generate generic country data if specific detail isn't in predefined map
def generate_country_entry(name, code, cont, visa_cat, visa_lbl, visa_nts):
    flag = chr(0x1F1E6 + ord(code[0]) - ord('A')) + chr(0x1F1E6 + ord(code[1]) - ord('A')) if code != "XK" else "🇽🇰"
    detail = country_details.get(name, {})
    
    capital = detail.get("capital", f"Capital of {name}")
    currency = detail.get("currency", "Local Currency / USD")
    best_time = detail.get("bestTime", "Oct – Apr")
    flight = detail.get("flight", f"BDT 45,000 - 80,000 (1-2 stops from DAC)")
    daily_budget = detail.get("dailyBudget", "BDT 4,000 - 8,000 ($35-$70/day)")
    visa_fee = detail.get("visaFee", "Check official embassy/eVisa portal")
    total_est = detail.get("totalEstimate", "BDT 80,000 - 150,000 (5-7 days)")
    
    visa_proc = detail.get("visaProcess", [
        f"1. Check official visa portal or embassy requirement for {name}",
        "2. Prepare passport (min 6m validity), 6-month bank statement, and return ticket",
        "3. Submit application online (eVisa) or via official visa processing center / embassy",
        "4. Allow 3-10 working days for processing"
    ])
    
    spots = detail.get("spots", [
        f"Famous Landmarks in {name}",
        f"Historic City Center of {name}",
        f"Natural Parks & Scenery in {name}",
        f"Local Cultural Heritage Sites",
        f"Popular Beach / Mountain Resort"
    ])
    
    return {
        "name": name,
        "code": code,
        "flag": flag,
        "continent": cont,
        "capital": capital,
        "currency": currency,
        "bestTime": best_time,
        "visaCategory": visa_cat,
        "visaLabel": visa_lbl,
        "visaNotes": visa_nts,
        "visaProcessSteps": visa_proc,
        "estimatedCost": {
            "flight": flight,
            "dailyBudget": daily_budget,
            "visaFee": visa_fee,
            "totalEstimate": total_est
        },
        "touristSpots": spots
    }

from generate_countries import countries_data

all_countries_enriched = []
for name, code, cont, visa_cat, visa_lbl, visa_nts in countries_data:
    entry = generate_country_entry(name, code, cont, visa_cat, visa_lbl, visa_nts)
    all_countries_enriched.append(entry)

visa_priority = {
    "visa_free": 1,
    "evisa_easy": 2,
    "embassy_visa": 3
}

all_countries_enriched.sort(key=lambda x: (visa_priority.get(x["visaCategory"], 99), x["name"]))


ts_content = []
ts_content.append("export type VisaEaseCategory = 'visa_free' | 'evisa_easy' | 'embassy_visa'\n")
ts_content.append("export interface CountryData {")
ts_content.append("  name: string")
ts_content.append("  code: string")
ts_content.append("  flag: string")
ts_content.append("  continent: 'Asia' | 'Europe' | 'Africa' | 'North America' | 'South America' | 'Oceania'")
ts_content.append("  capital: string")
ts_content.append("  currency: string")
ts_content.append("  bestTime: string")
ts_content.append("  visaCategory: VisaEaseCategory")
ts_content.append("  visaLabel: string")
ts_content.append("  visaNotes: string")
ts_content.append("  visaProcessSteps: string[]")
ts_content.append("  estimatedCost: {")
ts_content.append("    flight: string")
ts_content.append("    dailyBudget: string")
ts_content.append("    visaFee: string")
ts_content.append("    totalEstimate: string")
ts_content.append("  }")
ts_content.append("  touristSpots: string[]")
ts_content.append("}\n")

ts_content.append("export const VISA_CATEGORY_META: Record<VisaEaseCategory, { label: string; badgeClass: string; icon: string; description: string }> = {")
ts_content.append("  visa_free: {")
ts_content.append("    label: 'Visa Free / On Arrival',")
ts_content.append("    badgeClass: 'live',")
ts_content.append("    icon: '⚡',")
ts_content.append("    description: 'Countries offering Visa-Free entry, Visa on Arrival (VoA), or instant eTA for Bangladeshi passport holders.',")
ts_content.append("  },")
code_str = """  evisa_easy: {
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
"""
ts_content.append(code_str)

ts_content.append("export const WORLD_COUNTRIES: CountryData[] = " + json.dumps(all_countries_enriched, indent=2) + ";\n")

ts_content.append("""export function getCountryByName(name: string): CountryData | undefined {
  const clean = name.trim().toLowerCase()
  return WORLD_COUNTRIES.find((c) => c.name.toLowerCase() === clean || c.code.toLowerCase() === clean)
}
""")

target_path = "c:/portfolio/lib/data/world-countries.ts"
with open(target_path, "w", encoding="utf-8") as f:
    f.write("\n".join(ts_content))

print(f"Enriched dataset written to {target_path} with {len(all_countries_enriched)} countries")
