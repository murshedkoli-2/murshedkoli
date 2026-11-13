/**
 * Rough per-person minimum for a 5–7 day trip from Dhaka, by travel zone (BDT).
 * Used when a country only has the generic placeholder estimate, so ranking
 * and "within my savings" still reflect distance from Bangladesh.
 */
export type TravelZone =
  | 'south-asia' | 'southeast-asia' | 'east-asia' | 'gulf' | 'middle-east' | 'central-asia'
  | 'europe' | 'north-africa' | 'east-africa' | 'indian-ocean' | 'southern-africa' | 'west-central-africa'
  | 'oceania' | 'pacific-islands' | 'north-america' | 'caribbean-central-america' | 'south-america'

export const ZONE_MIN_TRIP_BDT: Record<TravelZone, number> = {
  'south-asia': 40000,
  'southeast-asia': 65000,
  gulf: 95000,
  'central-asia': 110000,
  'east-asia': 120000,
  'middle-east': 120000,
  'north-africa': 140000,
  'indian-ocean': 150000,
  'east-africa': 160000,
  'southern-africa': 180000,
  europe: 200000,
  'west-central-africa': 200000,
  oceania: 230000,
  'north-america': 280000,
  'pacific-islands': 280000,
  'caribbean-central-america': 300000,
  'south-america': 320000,
}

const ZONES: Record<TravelZone, string> = {
  'south-asia': 'BD IN PK AF NP BT LK MV',
  'southeast-asia': 'TH MY SG ID VN KH LA MM PH BN TL',
  'east-asia': 'CN JP KR KP MN TW',
  gulf: 'AE QA OM BH KW SA',
  'middle-east': 'JO LB IR IQ IL PS SY YE CY TR',
  'central-asia': 'KZ KG TJ UZ TM AZ AM GE',
  europe: 'AL MD RU UA AD AT BY BE BA BG HR CZ DK EE FI FR DE GR HU IS IE IT XK LV LI LT LU MT MC ME NL MK NO PL PT RO SM RS SK SI ES SE CH VA GB',
  'north-africa': 'EG MA TN DZ LY SD MR',
  'east-africa': 'KE TZ UG RW BI ET SO DJ ER SS',
  'indian-ocean': 'MG MU SC KM',
  'southern-africa': 'ZA NA BW LS SZ AO MZ MW ZM ZW',
  'west-central-africa': 'NG GH SN GM GW GN SL LR CI ML BF NE TG BJ CV CM GA GQ CG CD CF TD ST',
  oceania: 'AU NZ PG FJ',
  'pacific-islands': 'SB VU WS TO TV KI MH FM PW NR',
  'north-america': 'US CA MX',
  'caribbean-central-america': 'BB DM GD HT AG BS KN LC VC JM TT CU DO BZ CR SV GT HN NI PA',
  'south-america': 'BO CO EC SR GY AR BR CL PY PE UY VE',
}

export const ZONE_BY_CODE: ReadonlyMap<string, TravelZone> = new Map(
  (Object.entries(ZONES) as Array<[TravelZone, string]>).flatMap(([zone, codes]) => codes.split(' ').map((code) => [code, zone] as const)),
)
