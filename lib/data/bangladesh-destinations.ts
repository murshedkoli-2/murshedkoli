export interface BangladeshDestination {
  name: string
  division: string
  description: string
  budget: number
}

// A practical, browseable starting catalogue. Personal additions are still supported.
const destinations: Array<[string, string, string, number]> = [
  ['Cox\'s Bazar Beach', 'Chattogram', 'The world\'s longest natural sea beach', 12000],
  ['Inani Beach', 'Chattogram', 'Coral-stone shore near Cox\'s Bazar', 14000],
  ['Himchari National Park', 'Chattogram', 'Waterfalls and coastal viewpoints', 12000],
  ['Saint Martin\'s Island', 'Chattogram', 'Coral island and clear-water beaches', 22000],
  ['Maheshkhali Island', 'Chattogram', 'Island temples, mangroves and hills', 15000],
  ['Sajek Valley', 'Chattogram', 'Cloud-covered hills and indigenous culture', 15000],
  ['Kaptai Lake', 'Chattogram', 'Lake cruises and hill scenery', 10000],
  ['Rangamati', 'Chattogram', 'Lake town, hanging bridge and tribal markets', 10000],
  ['Bandarban', 'Chattogram', 'Gateway to the Chittagong Hill Tracts', 14000],
  ['Nilgiri', 'Chattogram', 'Highland cloudscape near Bandarban', 15000],
  ['Nilachal', 'Chattogram', 'Sunrise and sunset hill viewpoint', 12000],
  ['Boga Lake', 'Chattogram', 'Remote mountain lake trek', 18000],
  ['Nafakhum Waterfall', 'Chattogram', 'Powerful waterfall in Thanchi', 20000],
  ['Keokradong', 'Chattogram', 'Popular highland trekking route', 20000],
  ['Andharmanik', 'Chattogram', 'Coastal forest and wildlife', 12000],
  ['Patenga Beach', 'Chattogram', 'Chattogram city seafront', 5000],
  ['Foy\'s Lake', 'Chattogram', 'Lake, hills and family recreation', 5000],
  ['Sitakunda Eco Park', 'Chattogram', 'Trails, waterfalls and Chandranath', 6000],
  ['Madhabkunda Waterfall', 'Sylhet', 'Bangladesh\'s tallest waterfall', 8000],
  ['Jaflong', 'Sylhet', 'Stone river, hills and tea country', 7000],
  ['Ratargul Swamp Forest', 'Sylhet', 'Freshwater swamp forest boat trip', 8000],
  ['Bichanakandi', 'Sylhet', 'Boulder streams below Meghalaya hills', 8000],
  ['Lalakhal', 'Sylhet', 'Turquoise river boating', 8000],
  ['Sreemangal', 'Sylhet', 'Tea gardens, forests and seven-layer tea', 9000],
  ['Lawachara National Park', 'Sylhet', 'Rainforest walks and wildlife', 9000],
  ['Tanguar Haor', 'Sylhet', 'Seasonal wetland and houseboat trips', 12000],
  ['Sunamganj Haor', 'Sylhet', 'Monsoon wetlands and migratory birds', 10000],
  ['Bagerhat Shat Gombuj Mosque', 'Khulna', 'UNESCO-listed historic mosque city', 7000],
  ['Sundarbans', 'Khulna', 'Mangrove wilderness and Royal Bengal tiger habitat', 18000],
  ['Kuakata Sea Beach', 'Barishal', 'Watch sunrise and sunset from one coast', 14000],
  ['Floating Guava Market', 'Barishal', 'Seasonal canal market in Jhalokathi', 8000],
  ['Durga Sagar', 'Barishal', 'Large lake and winter birdwatching', 7000],
  ['Sonargaon', 'Dhaka', 'Historic Bengal capital and folk-art museum', 4000],
  ['Panam City', 'Dhaka', 'Historic merchant street in Sonargaon', 4000],
  ['Lalbagh Fort', 'Dhaka', 'Mughal fort in Old Dhaka', 3000],
  ['Ahsan Manzil', 'Dhaka', 'Pink palace museum on the Buriganga', 3000],
  ['National Parliament House', 'Dhaka', 'Louis Kahn architectural landmark', 3000],
  ['Bhawal National Park', 'Dhaka', 'Sal forest near Gazipur', 4000],
  ['Moinot Ghat', 'Dhaka', 'Riverside escape often called mini Cox\'s Bazar', 3000],
  ['Mainamati Ruins', 'Chattogram', 'Ancient Buddhist monasteries in Cumilla', 6000],
  ['Mohasthangarh', 'Rajshahi', 'One of Bangladesh\'s earliest urban archaeological sites', 7000],
  ['Paharpur Somapura Mahavihara', 'Rajshahi', 'UNESCO Buddhist monastery complex', 9000],
  ['Kantajew Temple', 'Rangpur', 'Terracotta Hindu temple in Dinajpur', 9000],
  ['Ramsagar National Park', 'Rangpur', 'Large historic reservoir and green space', 8000],
  ['Tajhat Palace', 'Rangpur', '19th-century palace museum', 8000],
  ['Bijoypur White Clay Hills', 'Mymensingh', 'White-clay landscape in Netrokona', 9000],
  ['Susang Durgapur', 'Mymensingh', 'Hills, ceramic soil and indigenous culture', 9000],
  ['Madhupur National Park', 'Mymensingh', 'Sal forest and trail walks', 6000],
]

export const BANGLADESH_DESTINATIONS: BangladeshDestination[] = destinations.map(([name, division, description, budget]) => ({
  name,
  division,
  description,
  budget,
}))
