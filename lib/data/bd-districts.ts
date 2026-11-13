/**
 * The 64 districts of Bangladesh, grouped into the 8 administrative divisions.
 * `id` is the stable key used by the map geometry, saved visits and spots.
 */

export const BD_DIVISIONS = [
  'Dhaka', 'Chattogram', 'Rajshahi', 'Khulna', 'Barishal', 'Sylhet', 'Rangpur', 'Mymensingh',
] as const

export type BdDivision = (typeof BD_DIVISIONS)[number]

export const BD_DIVISION_BN: Record<BdDivision, string> = {
  Dhaka: 'ঢাকা',
  Chattogram: 'চট্টগ্রাম',
  Rajshahi: 'রাজশাহী',
  Khulna: 'খুলনা',
  Barishal: 'বরিশাল',
  Sylhet: 'সিলেট',
  Rangpur: 'রংপুর',
  Mymensingh: 'ময়মনসিংহ',
}

export interface BdDistrict {
  id: string
  name: string
  bn: string
  division: BdDivision
}

const RAW: Array<[string, string, string, BdDivision]> = [
  ['dhaka', 'Dhaka', 'ঢাকা', 'Dhaka'],
  ['faridpur', 'Faridpur', 'ফরিদপুর', 'Dhaka'],
  ['gazipur', 'Gazipur', 'গাজীপুর', 'Dhaka'],
  ['gopalganj', 'Gopalganj', 'গোপালগঞ্জ', 'Dhaka'],
  ['kishoreganj', 'Kishoreganj', 'কিশোরগঞ্জ', 'Dhaka'],
  ['madaripur', 'Madaripur', 'মাদারীপুর', 'Dhaka'],
  ['manikganj', 'Manikganj', 'মানিকগঞ্জ', 'Dhaka'],
  ['munshiganj', 'Munshiganj', 'মুন্সীগঞ্জ', 'Dhaka'],
  ['narayanganj', 'Narayanganj', 'নারায়ণগঞ্জ', 'Dhaka'],
  ['narsingdi', 'Narsingdi', 'নরসিংদী', 'Dhaka'],
  ['rajbari', 'Rajbari', 'রাজবাড়ী', 'Dhaka'],
  ['shariatpur', 'Shariatpur', 'শরীয়তপুর', 'Dhaka'],
  ['tangail', 'Tangail', 'টাঙ্গাইল', 'Dhaka'],
  ['bandarban', 'Bandarban', 'বান্দরবান', 'Chattogram'],
  ['brahmanbaria', 'Brahmanbaria', 'ব্রাহ্মণবাড়িয়া', 'Chattogram'],
  ['chandpur', 'Chandpur', 'চাঁদপুর', 'Chattogram'],
  ['chattogram', 'Chattogram', 'চট্টগ্রাম', 'Chattogram'],
  ['cumilla', 'Cumilla', 'কুমিল্লা', 'Chattogram'],
  ['coxs-bazar', "Cox's Bazar", 'কক্সবাজার', 'Chattogram'],
  ['feni', 'Feni', 'ফেনী', 'Chattogram'],
  ['khagrachhari', 'Khagrachhari', 'খাগড়াছড়ি', 'Chattogram'],
  ['lakshmipur', 'Lakshmipur', 'লক্ষ্মীপুর', 'Chattogram'],
  ['noakhali', 'Noakhali', 'নোয়াখালী', 'Chattogram'],
  ['rangamati', 'Rangamati', 'রাঙ্গামাটি', 'Chattogram'],
  ['bogura', 'Bogura', 'বগুড়া', 'Rajshahi'],
  ['chapai-nawabganj', 'Chapai Nawabganj', 'চাঁপাইনবাবগঞ্জ', 'Rajshahi'],
  ['joypurhat', 'Joypurhat', 'জয়পুরহাট', 'Rajshahi'],
  ['naogaon', 'Naogaon', 'নওগাঁ', 'Rajshahi'],
  ['natore', 'Natore', 'নাটোর', 'Rajshahi'],
  ['pabna', 'Pabna', 'পাবনা', 'Rajshahi'],
  ['rajshahi', 'Rajshahi', 'রাজশাহী', 'Rajshahi'],
  ['sirajganj', 'Sirajganj', 'সিরাজগঞ্জ', 'Rajshahi'],
  ['bagerhat', 'Bagerhat', 'বাগেরহাট', 'Khulna'],
  ['chuadanga', 'Chuadanga', 'চুয়াডাঙ্গা', 'Khulna'],
  ['jashore', 'Jashore', 'যশোর', 'Khulna'],
  ['jhenaidah', 'Jhenaidah', 'ঝিনাইদহ', 'Khulna'],
  ['khulna', 'Khulna', 'খুলনা', 'Khulna'],
  ['kushtia', 'Kushtia', 'কুষ্টিয়া', 'Khulna'],
  ['magura', 'Magura', 'মাগুরা', 'Khulna'],
  ['meherpur', 'Meherpur', 'মেহেরপুর', 'Khulna'],
  ['narail', 'Narail', 'নড়াইল', 'Khulna'],
  ['satkhira', 'Satkhira', 'সাতক্ষীরা', 'Khulna'],
  ['barguna', 'Barguna', 'বরগুনা', 'Barishal'],
  ['barishal', 'Barishal', 'বরিশাল', 'Barishal'],
  ['bhola', 'Bhola', 'ভোলা', 'Barishal'],
  ['jhalokathi', 'Jhalokathi', 'ঝালকাঠি', 'Barishal'],
  ['patuakhali', 'Patuakhali', 'পটুয়াখালী', 'Barishal'],
  ['pirojpur', 'Pirojpur', 'পিরোজপুর', 'Barishal'],
  ['habiganj', 'Habiganj', 'হবিগঞ্জ', 'Sylhet'],
  ['moulvibazar', 'Moulvibazar', 'মৌলভীবাজার', 'Sylhet'],
  ['sunamganj', 'Sunamganj', 'সুনামগঞ্জ', 'Sylhet'],
  ['sylhet', 'Sylhet', 'সিলেট', 'Sylhet'],
  ['dinajpur', 'Dinajpur', 'দিনাজপুর', 'Rangpur'],
  ['gaibandha', 'Gaibandha', 'গাইবান্ধা', 'Rangpur'],
  ['kurigram', 'Kurigram', 'কুড়িগ্রাম', 'Rangpur'],
  ['lalmonirhat', 'Lalmonirhat', 'লালমনিরহাট', 'Rangpur'],
  ['nilphamari', 'Nilphamari', 'নীলফামারী', 'Rangpur'],
  ['panchagarh', 'Panchagarh', 'পঞ্চগড়', 'Rangpur'],
  ['rangpur', 'Rangpur', 'রংপুর', 'Rangpur'],
  ['thakurgaon', 'Thakurgaon', 'ঠাকুরগাঁও', 'Rangpur'],
  ['jamalpur', 'Jamalpur', 'জামালপুর', 'Mymensingh'],
  ['mymensingh', 'Mymensingh', 'ময়মনসিংহ', 'Mymensingh'],
  ['netrokona', 'Netrokona', 'নেত্রকোনা', 'Mymensingh'],
  ['sherpur', 'Sherpur', 'শেরপুর', 'Mymensingh'],
]

export const BD_DISTRICTS: readonly BdDistrict[] = RAW.map(([id, name, bn, division]) => ({ id, name, bn, division }))

export const BD_DISTRICT_IDS: ReadonlySet<string> = new Set(BD_DISTRICTS.map((d) => d.id))

const BY_ID = new Map(BD_DISTRICTS.map((d) => [d.id, d]))

export function getDistrict(id: string): BdDistrict | undefined {
  return BY_ID.get(id)
}

export function districtsByDivision(): Array<{ division: BdDivision; districts: BdDistrict[] }> {
  return BD_DIVISIONS.map((division) => ({
    division,
    districts: BD_DISTRICTS.filter((d) => d.division === division),
  }))
}
