import json
import os

countries_data = [
    # ── ASIA ──
    ("Afghanistan", "AF", "Asia", "embassy_visa", "Embassy Visa", "Embassy visa required prior to travel"),
    ("Armenia", "AM", "Asia", "evisa_easy", "e-Visa / VoA", "Official e-Visa portal or Visa on Arrival for eligible travel"),
    ("Azerbaijan", "AZ", "Asia", "evisa_easy", "ASAN e-Visa", "ASAN e-Visa online in 3 working days"),
    ("Bahrain", "BH", "Asia", "evisa_easy", "e-Visa", "Online e-Visa or sponsor processing"),
    ("Bangladesh", "BD", "Asia", "visa_free", "Home Country", "Domestic destinations"),
    ("Bhutan", "BT", "Asia", "visa_free", "Entry Permit on Arrival", "Entry permit on arrival with SDF fee"),
    ("Brunei", "BN", "Asia", "embassy_visa", "Embassy Visa", "High Commission application required"),
    ("Cambodia", "KH", "Asia", "visa_free", "Visa on Arrival / eVisa", "VoA or online eVisa in 3 days"),
    ("China", "CN", "Asia", "embassy_visa", "Chinese Visa Centre", "Dhaka Chinese Visa Application Center"),
    ("Cyprus", "CY", "Asia", "embassy_visa", "Embassy Visa", "National visa or valid Schengen visa"),
    ("Georgia", "GE", "Asia", "evisa_easy", "e-Visa / Valid Visa", "Online e-Visa or exempt with valid US/UK/Schengen visa"),
    ("India", "IN", "Asia", "evisa_easy", "Sticker Visa", "Sticker visa via IVAC centres across Bangladesh"),
    ("Indonesia", "ID", "Asia", "evisa_easy", "e-Visa / VoA", "Online e-Visa / VoA portal for tourism"),
    ("Iran", "IR", "Asia", "evisa_easy", "e-Visa", "Official Iran e-Visa portal"),
    ("Iraq", "IQ", "Asia", "embassy_visa", "Embassy Visa", "Embassy processing or approval permit"),
    ("Israel", "IL", "Asia", "embassy_visa", "Special Visa", "Special permit required"),
    ("Japan", "JP", "Asia", "embassy_visa", "Embassy Sticker Visa", "VFS / Embassy submission with financial proof"),
    ("Jordan", "JO", "Asia", "evisa_easy", "e-Visa / MOI", "MOI online visa portal"),
    ("Kazakhstan", "KZ", "Asia", "evisa_easy", "e-Visa", "Online e-Visa for tourist invitation holders"),
    ("Kuwait", "KW", "Asia", "embassy_visa", "Embassy Visa", "NOC / Embassy processing required"),
    ("Kyrgyzstan", "KG", "Asia", "evisa_easy", "e-Visa", "Official e-Visa portal"),
    ("Laos", "LA", "Asia", "evisa_easy", "e-Visa / VoA", "Online e-Visa or Visa on Arrival"),
    ("Lebanon", "LB", "Asia", "evisa_easy", "Approval / Visa", "Approval permit required"),
    ("Malaysia", "MY", "Asia", "evisa_easy", "e-Visa / Sticker", "Online e-Visa (eVisa) or sticker visa in 3-5 days"),
    ("Maldives", "MV", "Asia", "visa_free", "Visa on Arrival", "Free 30-day Visa on Arrival for BD passport"),
    ("Mongolia", "MN", "Asia", "evisa_easy", "e-Visa", "Official e-Visa portal"),
    ("Myanmar", "MM", "Asia", "embassy_visa", "Embassy Visa", "Embassy of Myanmar in Dhaka"),
    ("Nepal", "NP", "Asia", "visa_free", "Visa Free / VoA", "Visa on Arrival / Gratis first annual visit"),
    ("North Korea", "KP", "Asia", "embassy_visa", "Embassy Visa", "Authorized tour operator visa only"),
    ("Oman", "OM", "Asia", "evisa_easy", "e-Visa", "Official Royal Oman Police e-Visa portal"),
    ("Pakistan", "PK", "Asia", "evisa_easy", "e-Visa", "Online Pakistan e-Visa portal"),
    ("Palestine", "PS", "Asia", "embassy_visa", "Entry Permit", "Subject to Israeli border authority approval"),
    ("Philippines", "PH", "Asia", "embassy_visa", "Embassy Visa", "Philippine Embassy Dhaka application"),
    ("Qatar", "QA", "Asia", "evisa_easy", "Hayya e-Visa", "Online e-Visa via Hayya portal"),
    ("Saudi Arabia", "SA", "Asia", "evisa_easy", "Umrah / Tourist eVisa", "Umrah visa or e-Visa (with Schengen/US/UK visa)"),
    ("Singapore", "SG", "Asia", "evisa_easy", "e-Visa via Agent", "Submitted online via authorized agency"),
    ("South Korea", "KR", "Asia", "embassy_visa", "Embassy Sticker Visa", "Korean Embassy application in Dhaka"),
    ("Sri Lanka", "LK", "Asia", "visa_free", "ETA / VoA", "Easy online ETA or Visa on Arrival"),
    ("Syria", "SY", "Asia", "embassy_visa", "Embassy Visa", "Embassy processing required"),
    ("Taiwan", "TW", "Asia", "embassy_visa", "e-Code / Embassy", "Online e-Code or TECO submission"),
    ("Tajikistan", "TJ", "Asia", "evisa_easy", "e-Visa", "Official e-Visa portal"),
    ("Thailand", "TH", "Asia", "evisa_easy", "e-Visa / Sticker", "Accessible sticker visa / e-Visa via VFS Thailand"),
    ("Timor-Leste", "TL", "Asia", "visa_free", "Visa on Arrival", "30-day Visa on Arrival at Dili airport"),
    ("Turkey", "TR", "Asia", "evisa_easy", "Sticker / e-Visa", "Sticker via Gateway; e-Visa if holding Schengen/US/UK visa"),
    ("Turkmenistan", "TM", "Asia", "embassy_visa", "Embassy Visa", "Letter of Invitation required"),
    ("United Arab Emirates", "AE", "Asia", "evisa_easy", "Tourist e-Visa", "Easy 30/60-day tourist visa via airlines/agents"),
    ("Uzbekistan", "UZ", "Asia", "evisa_easy", "e-Visa", "Official e-Visa portal"),
    ("Vietnam", "VN", "Asia", "evisa_easy", "e-Visa", "Official 90-day single/multiple entry e-Visa online"),
    ("Yemen", "YE", "Asia", "embassy_visa", "Embassy Visa", "Sponsor visa required"),

    # ── EUROPE ──
    ("Albania", "AL", "Europe", "evisa_easy", "e-Visa", "Official e-Visa portal"),
    ("Andorra", "AD", "Europe", "embassy_visa", "Schengen Access", "Access via France/Spain Schengen visa"),
    ("Austria", "AT", "Europe", "embassy_visa", "Schengen Visa", "Austria Schengen visa via VFS Dhaka"),
    ("Belarus", "BY", "Europe", "embassy_visa", "Embassy Visa", "Embassy application with invitation"),
    ("Belgium", "BE", "Europe", "embassy_visa", "Schengen Visa", "Belgium Schengen visa via VFS Dhaka"),
    ("Bosnia and Herzegovina", "BA", "Europe", "embassy_visa", "Embassy Visa", "Embassy visa or valid Schengen visa"),
    ("Bulgaria", "BG", "Europe", "embassy_visa", "Schengen / National", "Bulgarian national visa or Schengen"),
    ("Croatia", "HR", "Europe", "embassy_visa", "Schengen Visa", "Croatia Schengen visa via VFS"),
    ("Czech Republic", "CZ", "Europe", "embassy_visa", "Schengen Visa", "Czechia Schengen visa via VFS"),
    ("Denmark", "DK", "Europe", "embassy_visa", "Schengen Visa", "Denmark Schengen visa via VFS Dhaka"),
    ("Estonia", "EE", "Europe", "embassy_visa", "Schengen Visa", "Estonia Schengen visa via VFS"),
    ("Finland", "FI", "Europe", "embassy_visa", "Schengen Visa", "Finland Schengen visa processing"),
    ("France", "FR", "Europe", "embassy_visa", "Schengen Visa", "France Schengen visa via VFS Dhaka"),
    ("Germany", "DE", "Europe", "embassy_visa", "Schengen Visa", "Germany Schengen visa via VFS Dhaka"),
    ("Greece", "GR", "Europe", "embassy_visa", "Schengen Visa", "Greece Schengen visa via VFS Dhaka"),
    ("Hungary", "HU", "Europe", "embassy_visa", "Schengen Visa", "Hungary Schengen visa via Embassy/VFS"),
    ("Iceland", "IS", "Europe", "embassy_visa", "Schengen Visa", "Iceland Schengen visa via VFS"),
    ("Ireland", "IE", "Europe", "embassy_visa", "Irish Visa", "AVATS online application + VFS Dhaka"),
    ("Italy", "IT", "Europe", "embassy_visa", "Schengen Visa", "Italy Schengen visa via VFS Dhaka"),
    ("Kosovo", "XK", "Europe", "embassy_visa", "Embassy / Schengen", "Embassy visa or valid Schengen visa"),
    ("Latvia", "LV", "Europe", "embassy_visa", "Schengen Visa", "Latvia Schengen visa via VFS"),
    ("Liechtenstein", "LI", "Europe", "embassy_visa", "Schengen Visa", "Access via Swiss Schengen visa"),
    ("Lithuania", "LT", "Europe", "embassy_visa", "Schengen Visa", "Lithuania Schengen visa via VFS"),
    ("Luxembourg", "LU", "Europe", "embassy_visa", "Schengen Visa", "Luxembourg Schengen visa via VFS"),
    ("Malta", "MT", "Europe", "embassy_visa", "Schengen Visa", "Malta Schengen visa via VFS"),
    ("Moldova", "MD", "Europe", "evisa_easy", "e-Visa", "Official e-Visa portal"),
    ("Monaco", "MC", "Europe", "embassy_visa", "Schengen Access", "Access via France Schengen visa"),
    ("Montenegro", "ME", "Europe", "embassy_visa", "Embassy / Schengen", "Embassy visa or valid Schengen/US/UK visa"),
    ("Netherlands", "NL", "Europe", "embassy_visa", "Schengen Visa", "Netherlands Schengen visa via VFS Dhaka"),
    ("North Macedonia", "MK", "Europe", "embassy_visa", "Embassy / Schengen", "Embassy visa or valid Schengen visa"),
    ("Norway", "NO", "Europe", "embassy_visa", "Schengen Visa", "Norway Schengen visa via VFS Dhaka"),
    ("Poland", "PL", "Europe", "embassy_visa", "Schengen Visa", "Poland Schengen visa via Embassy/VFS"),
    ("Portugal", "PT", "Europe", "embassy_visa", "Schengen Visa", "Portugal Schengen visa processing"),
    ("Romania", "RO", "Europe", "embassy_visa", "Schengen / National", "Romania national visa or Schengen"),
    ("Russia", "RU", "Europe", "evisa_easy", "e-Visa", "Official Russian unified e-Visa online"),
    ("San Marino", "SM", "Europe", "embassy_visa", "Schengen Access", "Access via Italy Schengen visa"),
    ("Serbia", "RS", "Europe", "embassy_visa", "Embassy Visa", "Embassy application required"),
    ("Slovakia", "SK", "Europe", "embassy_visa", "Schengen Visa", "Slovakia Schengen visa via VFS"),
    ("Slovenia", "SI", "Europe", "embassy_visa", "Schengen Visa", "Slovenia Schengen visa via VFS"),
    ("Spain", "ES", "Europe", "embassy_visa", "Schengen Visa", "Spain Schengen visa via BLS Dhaka"),
    ("Sweden", "SE", "Europe", "embassy_visa", "Schengen Visa", "Sweden Schengen visa via VFS Dhaka"),
    ("Switzerland", "CH", "Europe", "embassy_visa", "Schengen Visa", "Switzerland Schengen visa via VFS Dhaka"),
    ("Ukraine", "UA", "Europe", "evisa_easy", "e-Visa", "e-Visa system (when operational)"),
    ("United Kingdom", "GB", "Europe", "embassy_visa", "UK Standard Visitor", "VFS Global application in Dhaka/Sylhet"),
    ("Vatican City", "VA", "Europe", "embassy_visa", "Schengen Access", "Access via Italy Schengen visa"),

    # ── AFRICA ──
    ("Algeria", "DZ", "Africa", "embassy_visa", "Embassy Visa", "Embassy of Algeria application"),
    ("Angola", "AO", "Africa", "evisa_easy", "e-Visa", "Pre-visa online approval"),
    ("Benin", "BJ", "Africa", "evisa_easy", "e-Visa", "Official e-Visa portal"),
    ("Botswana", "BW", "Africa", "evisa_easy", "e-Visa", "Official e-Visa portal"),
    ("Burkina Faso", "BF", "Africa", "evisa_easy", "e-Visa", "Official e-Visa portal"),
    ("Burundi", "BI", "Africa", "visa_free", "Visa on Arrival", "Visa on arrival at Bujumbura Airport"),
    ("Cabo Verde", "CV", "Africa", "visa_free", "EASE / VoA", "Pre-registration EASE or VoA"),
    ("Cameroon", "CM", "Africa", "evisa_easy", "e-Visa", "Official e-Visa portal"),
    ("Central African Republic", "CF", "Africa", "embassy_visa", "Embassy Visa", "Embassy visa required"),
    ("Chad", "TD", "Africa", "embassy_visa", "Embassy Visa", "Embassy visa required"),
    ("Comoros", "KM", "Africa", "visa_free", "Visa on Arrival", "Visa on arrival for 45 days"),
    ("Congo (Republic)", "CG", "Africa", "embassy_visa", "Embassy Visa", "Embassy processing"),
    ("Congo (DRC)", "CD", "Africa", "evisa_easy", "e-Visa", "e-Visa online system"),
    ("Cote d'Ivoire", "CI", "Africa", "evisa_easy", "e-Visa", "Official e-Visa portal"),
    ("Djibouti", "DJ", "Africa", "visa_free", "e-Visa / VoA", "Official e-Visa portal or VoA"),
    ("Egypt", "EG", "Africa", "evisa_easy", "Sticker / e-Visa", "Embassy sticker visa or e-Visa with Schengen/US visa"),
    ("Equatorial Guinea", "GQ", "Africa", "evisa_easy", "e-Visa", "Official e-Visa portal"),
    ("Eritrea", "ER", "Africa", "embassy_visa", "Embassy Visa", "Embassy visa required"),
    ("Eswatini", "SZ", "Africa", "embassy_visa", "Embassy Visa", "High Commission application"),
    ("Ethiopia", "ET", "Africa", "evisa_easy", "e-Visa", "Official Ethiopia e-Visa portal"),
    ("Gabon", "GA", "Africa", "evisa_easy", "e-Visa", "Official e-Visa portal"),
    ("Gambia", "GM", "Africa", "visa_free", "Visa Free / Clearance", "Visa clearance or free entry"),
    ("Ghana", "GH", "Africa", "embassy_visa", "Embassy Visa", "High Commission application"),
    ("Guinea", "GN", "Africa", "evisa_easy", "e-Visa", "Official e-Visa portal"),
    ("Guinea-Bissau", "GW", "Africa", "visa_free", "Visa on Arrival", "Visa on arrival for 90 days"),
    ("Kenya", "KE", "Africa", "visa_free", "eTA / Visa Free", "Electronic Travel Authorisation online"),
    ("Lesotho", "LS", "Africa", "evisa_easy", "e-Visa", "Official e-Visa portal"),
    ("Liberia", "LR", "Africa", "embassy_visa", "Embassy Visa", "Embassy visa required"),
    ("Libya", "LY", "Africa", "embassy_visa", "Embassy Visa", "Approval permit required"),
    ("Madagascar", "MG", "Africa", "visa_free", "Visa on Arrival", "Visa on arrival up to 60 days"),
    ("Malawi", "MW", "Africa", "evisa_easy", "e-Visa", "Official e-Visa portal"),
    ("Mali", "ML", "Africa", "embassy_visa", "Embassy Visa", "Embassy visa required"),
    ("Mauritania", "MR", "Africa", "visa_free", "Visa on Arrival", "Visa on arrival at Nouakchott Airport"),
    ("Mauritius", "MU", "Africa", "visa_free", "Visa on Arrival", "Free 60-day visa on arrival for tourists"),
    ("Morocco", "MA", "Africa", "evisa_easy", "e-Visa", "Official e-Visa portal for BD passport holders"),
    ("Mozambique", "MZ", "Africa", "visa_free", "e-Visa / VoA", "e-Visa or Visa on Arrival"),
    ("Namibia", "NA", "Africa", "evisa_easy", "e-Visa / VoA", "Online e-Visa or VoA"),
    ("Niger", "NE", "Africa", "embassy_visa", "Embassy Visa", "Embassy visa required"),
    ("Nigeria", "NG", "Africa", "evisa_easy", "e-Visa", "Official Nigeria e-Visa portal"),
    ("Rwanda", "RW", "Africa", "visa_free", "Visa on Arrival", "30-day visa on arrival for all nationalities"),
    ("Sao Tome and Principe", "ST", "Africa", "evisa_easy", "e-Visa", "Official e-Visa portal"),
    ("Senegal", "SN", "Africa", "visa_free", "Visa on Arrival", "Visa on arrival"),
    ("Seychelles", "SC", "Africa", "visa_free", "Visitor Permit", "Free visitor permit on arrival"),
    ("Sierra Leone", "SL", "Africa", "visa_free", "Visa on Arrival / eVisa", "Visa on arrival or eVisa"),
    ("Somalia", "SO", "Africa", "visa_free", "Visa on Arrival", "Visa on arrival at major airports"),
    ("South Africa", "ZA", "Africa", "embassy_visa", "Embassy Visa", "Application via VFS Global"),
    ("South Sudan", "SS", "Africa", "evisa_easy", "e-Visa", "Official e-Visa portal"),
    ("Sudan", "SD", "Africa", "embassy_visa", "Embassy Visa", "Embassy visa required"),
    ("Tanzania", "TZ", "Africa", "evisa_easy", "e-Visa", "Official Tanzania e-Visa portal"),
    ("Togo", "TG", "Africa", "visa_free", "Visa on Arrival", "Visa on arrival for 7 days"),
    ("Tunisia", "TN", "Africa", "embassy_visa", "Embassy Visa", "Embassy of Tunisia processing"),
    ("Uganda", "UG", "Africa", "evisa_easy", "e-Visa", "Official Uganda e-Visa portal"),
    ("Zambia", "ZM", "Africa", "evisa_easy", "e-Visa", "Official Zambia e-Visa portal"),
    ("Zimbabwe", "ZW", "Africa", "evisa_easy", "e-Visa", "Official eVisa Zimbabwe portal"),

    # ── NORTH AMERICA & CARIBBEAN ──
    ("Antigua and Barbuda", "AG", "North America", "evisa_easy", "e-Visa", "Official e-Visa portal"),
    ("Bahamas", "BS", "North America", "evisa_easy", "e-Visa", "Official Bahamas e-Visa portal"),
    ("Barbados", "BB", "North America", "visa_free", "Visa Free", "Visa free for 6 months"),
    ("Belize", "BZ", "North America", "embassy_visa", "Embassy Visa", "Visa required or exempt with US visa"),
    ("Canada", "CA", "North America", "embassy_visa", "Visitor Visa (V-1)", "Online IRCC portal + VFS biometrics"),
    ("Costa Rica", "CR", "North America", "embassy_visa", "Embassy Visa", "Exempt if holding valid US/Canada/Schengen visa"),
    ("Cuba", "CU", "North America", "embassy_visa", "Tourist Card", "Tourist card required"),
    ("Dominica", "DM", "North America", "visa_free", "Visa Free", "Visa free entry for 21 days"),
    ("Dominican Republic", "DO", "North America", "embassy_visa", "Tourist Card / Visa", "Tourist card or valid US/Schengen visa"),
    ("El Salvador", "SV", "North America", "embassy_visa", "Embassy Visa", "Exempt if holding valid US/Schengen visa"),
    ("Grenada", "GD", "North America", "visa_free", "Visa Free", "Visa free entry for 3 months"),
    ("Guatemala", "GT", "North America", "embassy_visa", "Embassy Visa", "Exempt if holding valid US/Schengen visa"),
    ("Haiti", "HT", "North America", "visa_free", "Visa Free", "Visa free entry for 3 months"),
    ("Honduras", "HN", "North America", "embassy_visa", "Embassy Visa", "Exempt if holding valid US/Schengen visa"),
    ("Jamaica", "JM", "North America", "embassy_visa", "Embassy / VoA", "Visa required or VoA with US visa"),
    ("Mexico", "MX", "North America", "embassy_visa", "Embassy Visa", "Exempt if holding valid US/Canada/UK/Schengen visa"),
    ("Nicaragua", "NI", "North America", "visa_free", "Visa on Arrival", "Visa on arrival for 90 days"),
    ("Panama", "PA", "North America", "embassy_visa", "Stamped Visa", "Stamped visa or exempt with valid US visa"),
    ("Saint Kitts and Nevis", "KN", "North America", "evisa_easy", "e-Visa", "Official e-Visa portal"),
    ("Saint Lucia", "LC", "North America", "evisa_easy", "e-Visa", "e-Visa or entry permit"),
    ("Saint Vincent and the Grenadines", "VC", "North America", "visa_free", "Visa Free", "Visa free entry for 1 month"),
    ("Trinidad and Tobago", "TT", "North America", "embassy_visa", "Embassy Visa", "Embassy visa required"),
    ("United States", "US", "North America", "embassy_visa", "B1/B2 Visitor Visa", "US Embassy Dhaka interview & DS-160"),

    # ── SOUTH AMERICA ──
    ("Argentina", "AR", "South America", "embassy_visa", "Embassy / AVE", "Embassy visa or electronic AVE if holding US visa"),
    ("Bolivia", "BO", "South America", "visa_free", "Visa on Arrival", "Visa on arrival for 90 days"),
    ("Brazil", "BR", "South America", "embassy_visa", "Embassy Visa", "Embassy of Brazil in Dhaka"),
    ("Chile", "CL", "South America", "embassy_visa", "SAC e-Visa", "Online SAC visa system"),
    ("Colombia", "CO", "South America", "evisa_easy", "e-Visa", "Official Colombia e-Visa portal"),
    ("Ecuador", "EC", "South America", "evisa_easy", "e-Visa", "Online e-Visa registration"),
    ("Guyana", "GY", "South America", "embassy_visa", "Embassy Visa", "Embassy visa required"),
    ("Paraguay", "PY", "South America", "embassy_visa", "Embassy Visa", "Embassy visa required"),
    ("Peru", "PE", "South America", "embassy_visa", "Embassy Visa", "Exempt if holding US/Canada/UK/Schengen visa"),
    ("Suriname", "SR", "South America", "evisa_easy", "Entry Fee / eVisa", "Online entry fee / e-Visa"),
    ("Uruguay", "UY", "South America", "embassy_visa", "Embassy Visa", "Embassy visa required"),
    ("Venezuela", "VE", "South America", "embassy_visa", "Embassy Visa", "Embassy visa required"),

    # ── OCEANIA ──
    ("Australia", "AU", "Oceania", "embassy_visa", "Visitor Visa (600)", "Online ImmiAccount application + biometrics"),
    ("Fiji", "FJ", "Oceania", "visa_free", "Visa Free", "Visa free entry for 4 months"),
    ("Kiribati", "KI", "Oceania", "visa_free", "Visa Free", "Visa free entry for 90 days"),
    ("Marshall Islands", "MH", "Oceania", "visa_free", "Visa on Arrival", "Visa on arrival"),
    ("Micronesia", "FM", "Oceania", "visa_free", "Visa Free", "Visa free entry for 30 days"),
    ("Nauru", "NR", "Oceania", "embassy_visa", "Embassy Visa", "Embassy visa required"),
    ("New Zealand", "NZ", "Oceania", "embassy_visa", "Visitor Visa", "Online RealMe portal application"),
    ("Palau", "PW", "Oceania", "visa_free", "Visa on Arrival", "Free 30-day visa on arrival"),
    ("Papua New Guinea", "PG", "Oceania", "evisa_easy", "e-Visa", "Official e-Visa portal"),
    ("Samoa", "WS", "Oceania", "visa_free", "Entry Permit on Arrival", "Entry permit on arrival for 60 days"),
    ("Solomon Islands", "SB", "Oceania", "visa_free", "Permit on Arrival", "Visitors permit on arrival"),
    ("Tonga", "TO", "Oceania", "visa_free", "Visa on Arrival", "Visa on arrival for 31 days"),
    ("Tuvalu", "TV", "Oceania", "visa_free", "Visa on Arrival", "Visa on arrival for 1 month"),
    ("Vanuatu", "VU", "Oceania", "visa_free", "Visa Free", "Visa free entry for 30 days"),
]

def get_flag(code):
    if code == "XK": return "🇽🇰"
    return chr(0x1F1E6 + ord(code[0]) - ord('A')) + chr(0x1F1E6 + ord(code[1]) - ord('A'))

code_output = []
code_output.append("export type VisaEaseCategory = 'visa_free' | 'evisa_easy' | 'embassy_visa'\n")
code_output.append("export interface CountryData {")
code_output.append("  name: string")
code_output.append("  code: string")
code_output.append("  flag: string")
code_output.append("  continent: 'Asia' | 'Europe' | 'Africa' | 'North America' | 'South America' | 'Oceania'")
code_output.append("  visaCategory: VisaEaseCategory")
code_output.append("  visaLabel: string")
code_output.append("  visaNotes: string")
code_output.append("}\n")

code_output.append("export const VISA_CATEGORY_META: Record<VisaEaseCategory, { label: string; badgeClass: string; icon: string; description: string }> = {")
code_output.append("  visa_free: {")
code_output.append("    label: 'Visa Free / On Arrival',")
code_output.append("    badgeClass: 'live',")
code_output.append("    icon: '⚡',")
code_output.append("    description: 'Countries offering Visa-Free entry, Visa on Arrival (VoA), or instant eTA for Bangladeshi passport holders.',")
code_output.append("  },")
code_output.append("  evisa_easy: {")
code_output.append("    label: 'e-Visa / Easy Visa',")
code_output.append("    badgeClass: 'feat',")
code_output.append("    icon: '📑',")
code_output.append("    description: 'Countries with streamlined online e-Visa or fast processing for Bangladeshis.',")
code_output.append("  },")
code_output.append("  embassy_visa: {")
code_output.append("    label: 'Embassy / Standard Visa',")
code_output.append("    badgeClass: 'draft',")
code_output.append("    icon: '🏛️',")
code_output.append("    description: 'Countries requiring formal embassy or VFS application with documentation and financial proof.',")
code_output.append("  },")
code_output.append("}\n")

code_output.append("export const WORLD_COUNTRIES: CountryData[] = [")
for name, code, cont, visa_cat, visa_lbl, visa_nts in countries_data:
    flag = get_flag(code)
    # escape quotes if needed
    name_esc = name.replace("'", "\\'")
    visa_lbl_esc = visa_lbl.replace("'", "\\'")
    visa_nts_esc = visa_nts.replace("'", "\\'")
    code_output.append(f"  {{ name: '{name_esc}', code: '{code}', flag: '{flag}', continent: '{cont}', visaCategory: '{visa_cat}', visaLabel: '{visa_lbl_esc}', visaNotes: '{visa_nts_esc}' }},")

code_output.append("]\n")

code_output.append("""export function getCountryByName(name: string): CountryData | undefined {
  const clean = name.trim().toLowerCase()
  return WORLD_COUNTRIES.find((c) => c.name.toLowerCase() === clean || c.code.toLowerCase() === clean)
}
""")

target_path = "c:/portfolio/lib/data/world-countries.ts"
with open(target_path, "w", encoding="utf-8") as f:
    f.write("\n".join(code_output))

print(f"Generated {len(countries_data)} countries in {target_path}")
