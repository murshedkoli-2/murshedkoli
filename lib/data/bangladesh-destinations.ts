import { getDistrict, type BdDivision } from '@/lib/data/bd-districts'

/**
 * Tourist spots across all 64 districts of Bangladesh.
 *
 * `budget` is a rough per-person estimate in BDT for a typical trip from Dhaka
 * (shared transport, mid-range stay, food), not a quote. Day trips near Dhaka
 * sit at the bottom; hill-tract treks and islands at the top.
 */

export type SpotCategory =
  | 'beach' | 'island' | 'hills' | 'forest' | 'water' | 'tea' | 'heritage' | 'religious' | 'park' | 'city'

export type Season = 'winter' | 'monsoon' | 'year-round'

export interface BangladeshSpot {
  id: string
  name: string
  districtId: string
  district: string
  division: BdDivision
  category: SpotCategory
  budget: number
  season: Season
  description: string
}

export const SPOT_CATEGORY_LABEL: Record<SpotCategory, string> = {
  beach: 'Beach', island: 'Island', hills: 'Hills & treks', forest: 'Forest & wildlife', water: 'Rivers, haors & falls',
  tea: 'Tea country', heritage: 'Heritage', religious: 'Religious site', park: 'Park & garden', city: 'City',
}

export const SEASON_LABEL: Record<Season, string> = {
  winter: 'Best Oct – Mar', monsoon: 'Best Jun – Oct', 'year-round': 'Year-round',
}

type Row = [name: string, districtId: string, category: SpotCategory, budget: number, season: Season, description: string]

const W: Season = 'winter'
const M: Season = 'monsoon'
const Y: Season = 'year-round'

const ROWS: Row[] = [
  // ── Dhaka division ───────────────────────────────────────────────
  ['Lalbagh Fort', 'dhaka', 'heritage', 1200, Y, 'Unfinished 17th-century Mughal fort in Old Dhaka'],
  ['Ahsan Manzil', 'dhaka', 'heritage', 1200, Y, 'Pink Nawab palace museum on the Buriganga'],
  ['National Parliament House', 'dhaka', 'heritage', 800, Y, "Louis Kahn's monumental parliament complex"],
  ['Star Mosque', 'dhaka', 'religious', 800, Y, 'Mosaic-tiled mosque decorated with stars'],
  ['Dhakeshwari Temple', 'dhaka', 'religious', 800, Y, "Dhaka's national Hindu temple"],
  ['Armenian Church', 'dhaka', 'heritage', 800, Y, '18th-century church in Armanitola'],
  ['Liberation War Museum', 'dhaka', 'heritage', 1000, Y, 'Story of the 1971 Liberation War'],
  ['Bangladesh National Museum', 'dhaka', 'heritage', 1000, Y, 'Art, history and natural history at Shahbagh'],
  ['Hatirjheel', 'dhaka', 'city', 600, Y, 'Lakeside promenade and waterbus rides'],
  ['National Botanical Garden', 'dhaka', 'park', 800, Y, 'Large garden beside Mirpur zoo'],
  ['Bhawal National Park', 'gazipur', 'forest', 2000, W, 'Sal forest picnic spots near Dhaka'],
  ['Bangabandhu Sheikh Mujib Safari Park', 'gazipur', 'park', 2500, W, 'Drive-through safari park in Sreepur'],
  ['Nuhash Polli', 'gazipur', 'park', 2500, W, "Humayun Ahmed's garden estate"],
  ['Sonargaon Folk Art Museum', 'narayanganj', 'heritage', 1800, W, 'Folk-art museum in the old Bengal capital'],
  ['Panam City', 'narayanganj', 'heritage', 1800, W, 'Abandoned 19th-century merchant street'],
  ['Goaldi Mosque', 'narayanganj', 'religious', 1800, Y, 'Sultanate-era single-dome mosque'],
  ['Mawa Ghat & Padma Bridge View', 'munshiganj', 'water', 1800, Y, 'Hilsa lunch by the Padma Bridge'],
  ['Idrakpur Fort', 'munshiganj', 'heritage', 1800, W, 'Mughal river fort in Munshiganj town'],
  ['Atish Dipankar Birthplace', 'munshiganj', 'heritage', 2000, W, 'Vajrayogini, birthplace of the Buddhist scholar'],
  ['Arial Beel', 'munshiganj', 'water', 2200, M, 'Huge seasonal wetland with lotus fields'],
  ['Wari-Bateshwar', 'narsingdi', 'heritage', 2500, W, '2,500-year-old fortified archaeological site'],
  ['Baliati Zamindar Palace', 'manikganj', 'heritage', 2200, W, 'Grand colonnaded zamindar palace complex'],
  ['Teota Zamindar Bari', 'manikganj', 'heritage', 2500, W, 'Riverside estate linked to Nazrul and Pramila'],
  ['Mohera Zamindar Bari', 'tangail', 'heritage', 2800, W, 'Restored palace complex with lakes'],
  ['Atia Mosque', 'tangail', 'religious', 2800, Y, 'Ornate 17th-century mosque on the old 10-taka note'],
  ['Dhanbari Nawab Palace', 'tangail', 'heritage', 3200, W, 'Nawab palace with mosque and ponds'],
  ['Madhupur National Park', 'tangail', 'forest', 3500, W, 'Sal forest home to Garo communities'],
  ['Karotia Zamindar Bari', 'tangail', 'heritage', 2800, W, 'Wajed Ali Khan Panni estate'],
  ['Nikli Haor', 'kishoreganj', 'water', 3500, M, 'Monsoon haor with submersible roads'],
  ['Itna–Mithamoin–Austagram Road', 'kishoreganj', 'water', 4000, M, 'All-weather road across the haor'],
  ['Egarosindur Fort', 'kishoreganj', 'heritage', 3000, W, 'Isa Khan-era fort on the Brahmaputra'],
  ['Jangalbari Fort', 'kishoreganj', 'heritage', 3200, W, 'Isa Khan stronghold in Karimganj'],
  ['Sholakia Eidgah', 'kishoreganj', 'religious', 3000, Y, "Bangladesh's largest Eid congregation ground"],
  ['Pallikabi Jasimuddin House', 'faridpur', 'heritage', 3500, W, "The folk poet's home on the Kumar river"],
  ['Mathurapur Deul', 'faridpur', 'heritage', 3800, W, 'Terracotta temple tower in Madhukhali'],
  ['Tungipara Mausoleum', 'gopalganj', 'heritage', 4000, Y, 'Mausoleum complex in Tungipara'],
  ['Orakandi Thakurbari', 'gopalganj', 'religious', 4500, Y, 'Pilgrimage site of the Matua community'],
  ['Shakuni Lake', 'madaripur', 'water', 3500, W, 'Town lake at the heart of Madaripur'],
  ['Khalia Rajaram Temple', 'madaripur', 'heritage', 3800, W, 'Terracotta temple in Rajoir'],
  ['Goalanda Ghat', 'rajbari', 'water', 3000, Y, 'Historic Padma–Jamuna ferry ghat'],
  ['Jajira Padma Bridge View', 'shariatpur', 'water', 2500, Y, 'South bank of the Padma Bridge'],
  ['Dhanuka Monosha Bari', 'shariatpur', 'heritage', 3500, W, 'Old Hindu temple and estate'],

  // ── Chattogram division ──────────────────────────────────────────
  ['Patenga Beach', 'chattogram', 'beach', 3500, W, 'City seafront at the Karnaphuli mouth'],
  ["Foy's Lake", 'chattogram', 'park', 4000, Y, 'Hill-ringed lake and amusement park'],
  ['Chandranath Hill, Sitakunda', 'chattogram', 'hills', 4000, W, 'Hilltop temple trek above Sitakunda'],
  ['Guliakhali Sea Beach', 'chattogram', 'beach', 4200, W, 'Grass-carpeted shore with tidal channels'],
  ['Khoiyachora Waterfall', 'chattogram', 'water', 4500, M, 'Multi-step waterfall trek in Mirsharai'],
  ['Mohamaya Lake', 'chattogram', 'water', 4500, M, 'Kayaking on a hill-fringed reservoir'],
  ['Bayezid Bostami Shrine', 'chattogram', 'religious', 3500, Y, 'Hilltop shrine with sacred turtles'],
  ['Chattogram War Cemetery', 'chattogram', 'heritage', 3500, Y, 'Commonwealth WWII cemetery'],
  ['Parki Beach', 'chattogram', 'beach', 4200, W, 'Casuarina-lined beach in Anwara'],
  ['Banshkhali Eco Park', 'chattogram', 'forest', 4800, W, 'Hill forest with lakes and hanging bridge'],
  ["Cox's Bazar Sea Beach", 'coxs-bazar', 'beach', 9000, W, "World's longest natural sandy sea beach"],
  ['Marine Drive', 'coxs-bazar', 'beach', 9500, W, '80 km coastal road from Cox’s Bazar to Teknaf'],
  ['Himchari National Park', 'coxs-bazar', 'hills', 9500, W, 'Sea-facing hills and seasonal falls'],
  ['Inani Beach', 'coxs-bazar', 'beach', 10000, W, 'Coral-stone shore south of Cox’s Bazar'],
  ['Ramu Buddhist Temples', 'coxs-bazar', 'religious', 9000, Y, 'Historic kyangs and reclining Buddha'],
  ['Dulahazara Safari Park', 'coxs-bazar', 'park', 9500, W, 'Large wildlife safari park in Chakaria'],
  ['Maheshkhali Island', 'coxs-bazar', 'island', 10500, W, 'Adinath Temple, mangroves and salt fields'],
  ['Sonadia Island', 'coxs-bazar', 'island', 12500, W, 'Remote dunes, mangroves and migratory birds'],
  ["Shah Porir Dwip", 'coxs-bazar', 'beach', 12500, W, "Teknaf's southern tip on the Naf estuary"],
  ["Saint Martin's Island", 'coxs-bazar', 'island', 17000, W, "Bangladesh's only coral island"],
  ['Chhera Dwip', 'coxs-bazar', 'island', 19000, W, "Coral islet beyond Saint Martin's"],
  ['Meghla Tourist Complex', 'bandarban', 'park', 9500, W, 'Lake, hanging bridges and hill views'],
  ['Nilachal', 'bandarban', 'hills', 9500, W, 'Sunrise and sunset viewpoint above town'],
  ['Shoilo Propat', 'bandarban', 'water', 9800, M, 'Roadside stream waterfall near Milonchhari'],
  ['Buddha Dhatu Jadi (Golden Temple)', 'bandarban', 'religious', 9800, Y, 'Golden hilltop Theravada temple'],
  ['Chimbuk Hill', 'bandarban', 'hills', 10500, W, 'Classic viewpoint on the Thanchi road'],
  ['Nilgiri', 'bandarban', 'hills', 11500, W, 'Above-the-clouds resort hill'],
  ['Debotakhum', 'bandarban', 'water', 14000, W, 'Narrow gorge pool explored by raft'],
  ['Boga Lake', 'bandarban', 'hills', 14500, W, 'Crater-like lake trek from Ruma'],
  ['Remakri', 'bandarban', 'water', 15500, W, 'Rocky cascades on the Sangu river'],
  ['Keokradong', 'bandarban', 'hills', 16500, W, 'Classic summit trek via Boga Lake'],
  ['Nafakhum Waterfall', 'bandarban', 'water', 17500, M, 'Wide waterfall on the Remakri river'],
  ['Amiakhum Waterfall', 'bandarban', 'water', 20000, M, 'Remote waterfall deep in Thanchi'],
  ['Rangamati Hanging Bridge', 'rangamati', 'park', 7500, Y, 'Iconic bridge over Kaptai Lake'],
  ['Rajban Vihara', 'rangamati', 'religious', 7500, Y, 'Major Chakma Buddhist monastery'],
  ['Kaptai Lake', 'rangamati', 'water', 8500, M, 'Boat cruises across a vast hill lake'],
  ['Shuvolong Waterfall', 'rangamati', 'water', 8500, M, 'Lakeside waterfall reached by boat'],
  ['Peda Ting Ting', 'rangamati', 'water', 8800, W, 'Island restaurant on Kaptai Lake'],
  ['Kaptai National Park', 'rangamati', 'forest', 8800, W, 'Hill forest by the Karnaphuli'],
  ['Sajek Valley', 'rangamati', 'hills', 11500, Y, 'Cloud-sea ridge villages in Baghaichhari'],
  ['Alutila Cave', 'khagrachhari', 'hills', 7500, W, 'Dark tunnel cave walked by torchlight'],
  ['Risang Waterfall', 'khagrachhari', 'water', 7800, M, 'Natural rock slide waterfall'],
  ['Debota Pukur', 'khagrachhari', 'hills', 8200, W, 'Sacred hilltop lake in Matiranga'],
  ['Shalban Vihara, Mainamati', 'cumilla', 'heritage', 3200, W, '8th-century Buddhist monastery ruins'],
  ['Mainamati War Cemetery', 'cumilla', 'heritage', 3000, Y, 'Commonwealth WWII cemetery'],
  ['BARD, Kotbari', 'cumilla', 'park', 3200, W, 'Green rural academy campus'],
  ['Dharmasagar', 'cumilla', 'water', 2800, Y, '15th-century reservoir in Cumilla town'],
  ['Arifail Mosque', 'brahmanbaria', 'religious', 3200, Y, 'Mughal-era mosque in Sarail'],
  ['Kal Bhairab Temple', 'brahmanbaria', 'religious', 3000, Y, 'Temple with a towering Shiva idol'],
  ['Haripur Zamindar Bari', 'brahmanbaria', 'heritage', 3800, W, 'Riverside palace in Nasirnagar'],
  ['Chandpur Boro Station', 'chandpur', 'water', 3200, Y, 'Meghna–Padma–Dakatia confluence point'],
  ['Hajiganj Boro Mosque', 'chandpur', 'religious', 3200, Y, 'One of the largest mosques in the country'],
  ['Muhuri Project', 'feni', 'water', 4200, W, 'Irrigation dam, reservoir and birdlife'],
  ['Bijoy Singh Dighi', 'feni', 'water', 3800, Y, 'Large historic pond near Feni town'],
  ['Nijhum Dwip', 'noakhali', 'island', 11500, W, 'Deer-filled mangrove island in Hatiya'],
  ['Gandhi Ashram', 'noakhali', 'heritage', 4800, Y, 'Museum of Gandhi’s 1946 peace mission'],
  ['Bajra Shahi Mosque', 'noakhali', 'religious', 4800, Y, 'Mughal mosque with china-mosaic domes'],
  ['Musapur Closure', 'noakhali', 'water', 5500, W, 'Sea-meets-river dam in Companiganj'],
  ['Khoa Sagar Dighi', 'lakshmipur', 'water', 4800, Y, 'Large historic pond in Lakshmipur'],
  ['Alexander Meghna Beach', 'lakshmipur', 'water', 5200, W, 'Meghna riverbank promenade in Ramgati'],

  // ── Rajshahi division ────────────────────────────────────────────
  ['Padma Garden, Rajshahi', 'rajshahi', 'water', 5500, Y, 'Sunset on the Padma riverbank'],
  ['Varendra Research Museum', 'rajshahi', 'heritage', 5500, Y, "Bangladesh's oldest museum"],
  ['Puthia Temple Complex', 'rajshahi', 'heritage', 6000, W, 'Cluster of terracotta temples and palaces'],
  ['Bagha Mosque', 'rajshahi', 'religious', 6000, Y, 'Terracotta mosque from 1523'],
  ['Choto Sona Mosque', 'chapai-nawabganj', 'religious', 6500, Y, 'Sultanate-era "gem of Gaur"'],
  ['Darasbari Mosque', 'chapai-nawabganj', 'religious', 6800, W, 'Brick ruins near the Indian border'],
  ['Kansat Mango Orchards', 'chapai-nawabganj', 'park', 6500, M, 'Mango country — visit in June'],
  ['Paharpur Somapura Mahavihara', 'naogaon', 'heritage', 7500, W, 'UNESCO World Heritage Buddhist monastery'],
  ['Kusumba Mosque', 'naogaon', 'religious', 7000, Y, 'Black-stone mosque on the 5-taka note'],
  ['Patisar Rabindra Kachharibari', 'naogaon', 'heritage', 7500, W, "Tagore's estate office"],
  ['Dibar Dighi', 'naogaon', 'heritage', 7500, W, 'Lake with an 11th-century stone pillar'],
  ['Alta Dighi', 'naogaon', 'water', 7500, W, 'Long lake beside a sal forest'],
  ['Mahasthangarh', 'bogura', 'heritage', 5500, W, 'Ancient Pundranagara citadel ruins'],
  ['Gokul Medh (Behula’s Basor Ghar)', 'bogura', 'heritage', 5500, W, 'Terraced brick mound of legend'],
  ['Vasu Vihara', 'bogura', 'heritage', 5800, W, 'Buddhist monastery ruins'],
  ['Lakma Rajbari', 'joypurhat', 'heritage', 6500, W, 'Ruined zamindar palace near the border'],
  ['Barashibalay Temple', 'joypurhat', 'religious', 6500, Y, 'Old Shiva temple at Belamla'],
  ['Natore Rajbari', 'natore', 'heritage', 5500, W, 'Palace estate of Rani Bhabani'],
  ['Uttara Gonobhaban', 'natore', 'heritage', 5500, W, 'Dighapatia palace and gardens'],
  ['Chalan Beel', 'natore', 'water', 6000, M, "One of the country's largest wetlands"],
  ['Hardinge Bridge', 'pabna', 'heritage', 5000, Y, '1915 railway bridge over the Padma'],
  ['Jor Bangla Temple', 'pabna', 'heritage', 5000, W, 'Twin-hut terracotta temple'],
  ['Suchitra Sen Ancestral Home', 'pabna', 'heritage', 5000, Y, "Film legend's childhood house"],
  ['Shahzadpur Rabindra Kachharibari', 'sirajganj', 'heritage', 4500, W, "Tagore's estate house"],
  ['Hatikumrul Navaratna Temple', 'sirajganj', 'heritage', 4500, W, 'Nine-spired 18th-century temple'],
  ['Jamuna Bridge & Eco Park', 'sirajganj', 'water', 4200, Y, 'Bangabandhu Bridge riverside park'],

  // ── Khulna division ──────────────────────────────────────────────
  ['Dakshindihi Rabindra Complex', 'khulna', 'heritage', 6500, W, "Tagore's in-laws' house in Phultala"],
  ['Sundarbans (Kotka & Kochikhali)', 'khulna', 'forest', 17000, W, 'Multi-day boat safari in the mangroves'],
  ['Sixty Dome Mosque', 'bagerhat', 'heritage', 6500, Y, 'UNESCO-listed Mosque City of Bagerhat'],
  ['Khan Jahan Ali Mazar', 'bagerhat', 'religious', 6500, Y, 'Shrine and crocodile pond'],
  ['Karamjal', 'bagerhat', 'forest', 8000, W, 'Day-trip gateway into the Sundarbans'],
  ['Kalagachhia & Munshiganj, Satkhira', 'satkhira', 'forest', 8500, W, 'Western edge of the Sundarbans'],
  ['Mozaffar Garden', 'satkhira', 'park', 7000, W, 'Large garden resort in Satkhira'],
  ['Jessoreshwari Temple', 'satkhira', 'religious', 7000, Y, 'Shakti Peetha temple at Ishwaripur'],
  ['Sagardari', 'jashore', 'heritage', 6200, W, 'Birthplace of Michael Madhusudan Dutt'],
  ['Godkhali Flower Fields', 'jashore', 'park', 5500, W, "The country's flower capital"],
  ['Chanchra Shiva Temple', 'jashore', 'heritage', 6000, W, 'Bengal-style terracotta temple'],
  ['Naldanga Temple Complex', 'jhenaidah', 'heritage', 6200, W, 'Group of royal temples'],
  ['Shailkupa Shahi Mosque', 'jhenaidah', 'religious', 6200, Y, 'Multi-dome Mughal mosque'],
  ['Miyar Dalan', 'jhenaidah', 'heritage', 6200, W, 'Riverside zamindar mansion'],
  ['Lalon Shah Mazar', 'kushtia', 'religious', 5800, W, 'Baul shrine and festival grounds'],
  ['Shilaidaha Kuthibari', 'kushtia', 'heritage', 5800, W, "Tagore's riverside estate house"],
  ['Raja Sitaram Ray Palace', 'magura', 'heritage', 6200, W, 'Ruined capital at Mohammadpur'],
  ['Mujibnagar Memorial', 'meherpur', 'heritage', 6800, Y, 'Site of the 1971 provisional government'],
  ['Amjhupi Nilkuthi', 'meherpur', 'heritage', 6800, W, 'Colonial indigo-planter house'],
  ['Darshana Carew & Co.', 'chuadanga', 'heritage', 6500, Y, 'Historic distillery and sugar mill town'],
  ['S M Sultan Complex', 'narail', 'heritage', 5800, W, "Painter S M Sultan's home on the Chitra"],
  ['Arunima Eco Park', 'narail', 'park', 6000, W, 'Riverside eco resort in Kalia'],

  // ── Barishal division ────────────────────────────────────────────
  ['Durga Sagar', 'barishal', 'water', 6500, W, 'Large historic lake with winter birds'],
  ['Guthia Mosque', 'barishal', 'religious', 6500, Y, 'Modern mosque complex in Ujirpur'],
  ['Satla Lily Field', 'barishal', 'water', 7000, M, 'Wetland carpeted with red water lilies'],
  ['Lakutia Zamindar Bari', 'barishal', 'heritage', 6500, W, 'Ruined zamindar estate'],
  ['Bhimruli Floating Market', 'jhalokathi', 'water', 7200, M, 'Guava boats on canal markets'],
  ['Kirtipasha Zamindar Bari', 'jhalokathi', 'heritage', 7000, W, 'Twin zamindar palaces'],
  ['Atghar-Kuriana Guava Gardens', 'pirojpur', 'water', 7200, M, 'Canals through guava orchards'],
  ['Rayerkathi Zamindar Bari', 'pirojpur', 'heritage', 7000, W, 'Old estate with Kali temple'],
  ['Kuakata Sea Beach', 'patuakhali', 'beach', 9500, W, 'Sunrise and sunset from the same beach'],
  ['Gangamatir Char', 'patuakhali', 'beach', 10000, W, 'Sunrise point east of Kuakata'],
  ['Fatrar Char', 'patuakhali', 'forest', 10500, W, 'Mangrove forest across from Kuakata'],
  ['Sonar Char', 'patuakhali', 'island', 12500, W, 'Remote island forest and beach'],
  ['Tengragiri & Shubhosondha Beach', 'barguna', 'beach', 10500, W, 'Wildlife sanctuary and quiet beach'],
  ['Haringhata Eco Park', 'barguna', 'forest', 10500, W, 'Mangrove trails in Patharghata'],
  ['Manpura Island', 'bhola', 'island', 10000, W, 'Meghna island with deer and chars'],
  ['Char Kukri Mukri', 'bhola', 'island', 10500, W, 'Mangrove wildlife island'],

  // ── Sylhet division ──────────────────────────────────────────────
  ['Hazrat Shah Jalal Mazar', 'sylhet', 'religious', 5500, Y, "Sylhet's most visited shrine"],
  ['Malnichhara Tea Estate', 'sylhet', 'tea', 5500, Y, 'Oldest commercial tea garden in South Asia'],
  ['Jaflong', 'sylhet', 'water', 6500, M, 'Stone-strewn Piyain river below the Khasi hills'],
  ['Lalakhal', 'sylhet', 'water', 6500, W, 'Emerald river boating near tea gardens'],
  ['Ratargul Swamp Forest', 'sylhet', 'forest', 7000, M, 'Boat through a flooded freshwater forest'],
  ['Bichanakandi', 'sylhet', 'water', 7000, M, 'Boulder pools below Meghalaya falls'],
  ['Bholaganj Sada Pathor', 'sylhet', 'water', 7000, M, 'White-stone river at the border'],
  ['Utmachhara', 'sylhet', 'water', 7200, M, 'Quiet stone stream in Companiganj'],
  ['Panthumai Waterfall', 'sylhet', 'water', 7500, M, 'Border waterfall in Goainghat'],
  ['Sreemangal Tea Gardens', 'moulvibazar', 'tea', 7500, Y, 'Tea capital and seven-layer tea'],
  ['Lawachara National Park', 'moulvibazar', 'forest', 7500, Y, 'Rainforest with hoolock gibbons'],
  ['Baikka Beel', 'moulvibazar', 'water', 8000, W, 'Wetland sanctuary for winter birds'],
  ['Madhabpur Lake', 'moulvibazar', 'water', 8000, Y, 'Lily lake inside a tea estate'],
  ['Madhabkunda Waterfall', 'moulvibazar', 'water', 8000, M, 'One of the tallest falls in Bangladesh'],
  ['Hakaluki Haor', 'moulvibazar', 'water', 8500, M, "Asia's largest haor wetland system"],
  ['Hum Hum Waterfall', 'moulvibazar', 'water', 9000, M, 'Jungle trek to a hidden fall in Rajkandi'],
  ['Satchari National Park', 'habiganj', 'forest', 6500, Y, 'Tropical forest with canopy walk'],
  ['Rema-Kalenga Wildlife Sanctuary', 'habiganj', 'forest', 7500, W, 'Remote hill forest sanctuary'],
  ['Bithangal Akhra', 'habiganj', 'religious', 7500, M, 'Vaishnav monastery in the haor'],
  ['Hason Raja Museum', 'sunamganj', 'heritage', 7500, Y, "Mystic poet's family home"],
  ['Barikka Tila & Jadukata River', 'sunamganj', 'hills', 9500, M, 'Hill view over the Jadukata'],
  ['Shimul Bagan', 'sunamganj', 'park', 9500, W, 'Silk-cotton tree orchard — blooms Feb–Mar'],
  ['Niladri Lake', 'sunamganj', 'water', 9500, M, 'Blue limestone-quarry lake in Tahirpur'],
  ['Tanguar Haor', 'sunamganj', 'water', 10500, M, 'Houseboat trips on a Ramsar wetland'],

  // ── Rangpur division ─────────────────────────────────────────────
  ['Tajhat Palace', 'rangpur', 'heritage', 6500, W, 'Marble-staircase palace museum'],
  ['Begum Rokeya Memorial', 'rangpur', 'heritage', 6800, Y, 'Pairaband birthplace of Begum Rokeya'],
  ['Vinnya Jagat', 'rangpur', 'park', 6500, W, 'Theme park with planetarium'],
  ['Kantajew Temple', 'dinajpur', 'heritage', 7500, W, 'Finest terracotta temple in Bengal'],
  ['Ramsagar National Park', 'dinajpur', 'water', 7500, W, 'Vast 18th-century reservoir'],
  ['Dinajpur Rajbari', 'dinajpur', 'heritage', 7500, W, 'Ruins of the Dinajpur royal palace'],
  ['Nayabad Mosque', 'dinajpur', 'religious', 7500, Y, '18th-century terracotta mosque'],
  ['Swapnapuri', 'dinajpur', 'park', 7800, W, 'Large amusement and picnic park'],
  ['Tetulia Kanchenjunga View', 'panchagarh', 'hills', 9000, W, 'Himalayan views on clear Nov–Dec mornings'],
  ['Tetulia Tea Gardens', 'panchagarh', 'tea', 9000, Y, 'Flatland tea estates of the far north'],
  ['Banglabandha Zero Point', 'panchagarh', 'heritage', 9200, Y, 'Northernmost border point'],
  ['Bhitargarh', 'panchagarh', 'heritage', 9200, W, 'Ancient fortified city ruins'],
  ['Haripur Rajbari', 'thakurgaon', 'heritage', 8500, W, 'Zamindar palace near the border'],
  ['Balia Mosque', 'thakurgaon', 'religious', 8500, Y, 'Restored terracotta-brick mosque'],
  ['Surjapuri Mango Tree', 'thakurgaon', 'park', 8500, M, 'Giant century-old mango tree in Baliadangi'],
  ['Nilsagar', 'nilphamari', 'water', 8000, W, 'Huge ancient lake with migratory birds'],
  ['Chini Mosque, Saidpur', 'nilphamari', 'religious', 7500, Y, 'Mosque covered in china mosaic'],
  ['Teesta Barrage', 'lalmonirhat', 'water', 8000, W, 'Barrage and chars on the Teesta'],
  ['Tin Bigha Corridor', 'lalmonirhat', 'heritage', 8500, Y, 'Enclave corridor to Dahagram–Angarpota'],
  ['Chilmari Brahmaputra Chars', 'kurigram', 'water', 8200, W, 'River chars and ferry ghats'],
  ['Friendship Centre', 'gaibandha', 'heritage', 7200, Y, 'Award-winning brick architecture'],
  ['Balashi Ghat', 'gaibandha', 'water', 7200, W, 'Brahmaputra ghat and char boat trips'],

  // ── Mymensingh division ──────────────────────────────────────────
  ['Shashi Lodge', 'mymensingh', 'heritage', 4200, Y, 'Zamindar palace with Venus statue'],
  ['Zainul Abedin Museum', 'mymensingh', 'heritage', 4200, Y, 'Museum on the Brahmaputra bank'],
  ['Muktagacha Rajbari', 'mymensingh', 'heritage', 4500, W, 'Zamindar palace — try the monda'],
  ['BAU Botanical Garden', 'mymensingh', 'park', 4200, Y, 'Agricultural university gardens'],
  ['Bijoypur White Clay Hills', 'netrokona', 'hills', 6200, W, 'China-clay hills with turquoise ponds'],
  ['Someshwari River, Durgapur', 'netrokona', 'water', 6200, W, 'Clear river below the Garo Hills'],
  ['Ranikhong Mission', 'netrokona', 'religious', 6200, Y, 'Hilltop Catholic mission'],
  ['Gajni Obokash', 'sherpur', 'park', 5800, W, 'Hill resort under the Garo Hills'],
  ['Madhutila Eco Park', 'sherpur', 'forest', 5800, W, 'Forest park with watchtower'],
  ['Lauchapra Picnic Spot', 'jamalpur', 'hills', 5800, W, 'Garo Hills viewpoint in Bakshiganj'],
]

const slug = (value: string) => value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

export const BANGLADESH_SPOTS: readonly BangladeshSpot[] = ROWS.map(([name, districtId, category, budget, season, description]) => {
  const district = getDistrict(districtId)
  if (!district) throw new Error(`Unknown district "${districtId}" for spot "${name}"`)
  return {
    id: slug(name), name, districtId, district: district.name, division: district.division,
    category, budget, season, description,
  }
})
