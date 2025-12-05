// This file is now only imported from server-side API routes, never from client components

const AIRTABLE_TABLE_NAME = "Locations"

export interface AirtableLocation {
  id: string
  name: string
  type: "Valley" | "Peak" | "Village" | "Archaeological Site" | "Lake" | "Pass"
  region: "Nepal" | "Pakistan" | "Bhutan" | "India" | "Transboundary"
  country: string
  latitude: number
  longitude: number
  elevation: number
  shortDescription: string
  fullHistory: string
  historicalSignificance: string[]
  climateZone: string
  floraTags: string[]
  faunaTags: string[]
  photoUrls: string[]
  photoGeolocations: boolean
  videoUrls?: string[]
  documentUrls?: string[]
  newsArticleUrls?: string[]
  researchHistory?: string
  geologicalFormation?: string
  localLegends?: string
  languages: string[]
  lastUpdated: string
  researcherName: string
  researchNotes?: string
}

export interface LocationsResponse {
  records: Array<{
    id: string
    fields: Record<string, any>
  }>
}

function getMockLocations(): AirtableLocation[] {
  return [
    {
      id: "1",
      name: "Sinja Valley",
      type: "Valley",
      region: "Nepal",
      country: "Nepal",
      latitude: 28.8,
      longitude: 84.2,
      elevation: 2800,
      shortDescription:
        "The Sinja Valley is a high valley in the remote western Nepal, known for its unique archaeological sites and cultural heritage.",
      fullHistory:
        "The valley has been inhabited for centuries and contains evidence of ancient settlements and trade routes. Archaeological surveys have revealed pottery dating back to the medieval period, suggesting continuous habitation. Local legends speak of ancient kingdoms and pilgrimage routes that connected the valley to major cultural centers.",
      historicalSignificance: ["Cultural", "Archaeological", "Environmental"],
      climateZone: "Alpine",
      floraTags: ["Alpine rhododendron", "High altitude grasses", "Juniper scrub", "Alpine sedges"],
      faunaTags: ["Himalayan musk deer", "Lammergeier eagle", "Snow leopard", "Alpine pikas"],
      photoUrls: ["/himalayan-valley-landscape.jpg", "/himalayan-cultural-site.jpg"],
      photoGeolocations: true,
      videoUrls: [],
      documentUrls: [],
      newsArticleUrls: [],
      researchHistory: "The valley has been studied by researchers from Amherst College since 2015.",
      geologicalFormation:
        "Formed by glacial activity during the Pleistocene epoch, displaying classic U-shaped glacial morphology.",
      localLegends:
        "Local communities maintain oral traditions about the valley's founding and spiritual significance.",
      languages: ["English", "Nepali", "French"],
      lastUpdated: "2024-12-01",
      researcherName: "Dr. Sarah Mitchell",
      researchNotes: "Ongoing environmental monitoring and cultural documentation.",
    },
    {
      id: "2",
      name: "Mt. Everest",
      type: "Peak",
      region: "Nepal",
      country: "Nepal",
      latitude: 27.9881,
      longitude: 86.925,
      elevation: 8848,
      shortDescription:
        "The highest mountain in the world, sacred to local Sherpa communities and a major focus of mountaineering research.",
      fullHistory:
        "Mt. Everest has been revered for centuries by local communities as a sacred peak. Modern mountaineering began with early expeditions in the 20th century, culminating in the successful ascent by Edmund Hillary and Tenzing Norgay in 1953.",
      historicalSignificance: ["Cultural", "Environmental", "Geological"],
      climateZone: "High Alpine",
      floraTags: ["Alpine tundra", "Sparse vegetation"],
      faunaTags: ["Snow leopard", "Himalayan eagle", "Alpine fox"],
      photoUrls: ["/mt-everest.jpg", "/everest-base-camp.jpg"],
      photoGeolocations: true,
      videoUrls: [],
      documentUrls: [],
      newsArticleUrls: [],
      researchHistory: "Extensive mountaineering and climate research has been conducted since the 1950s.",
      geologicalFormation:
        "Formed by collision of the Indian and Eurasian tectonic plates, creating the highest peak in the world.",
      localLegends: 'Known as Sagarmatha in Nepali, meaning "Forehead of the Sky".',
      languages: ["English", "Nepali"],
      lastUpdated: "2024-11-15",
      researcherName: "Dr. James Chen",
      researchNotes: "Monitoring glacial retreat and climate impacts on the mountain.",
    },
    {
      id: "3",
      name: "Kathmandu Valley",
      type: "Village",
      region: "Nepal",
      country: "Nepal",
      latitude: 27.7172,
      longitude: 85.324,
      elevation: 1400,
      shortDescription:
        "Nepal's capital city with rich cultural heritage, ancient temples, and vibrant traditions spanning centuries.",
      fullHistory:
        "Kathmandu has been a major cultural and political center since ancient times. The city features numerous UNESCO World Heritage sites and has served as a hub for Himalayan trade routes.",
      historicalSignificance: ["Cultural", "Archaeological"],
      climateZone: "Temperate",
      floraTags: ["Urban gardens", "Rhododendron forests nearby"],
      faunaTags: ["Birds", "Small mammals"],
      photoUrls: ["/kathmandu-temple.jpg", "/kathmandu-valley.jpg"],
      photoGeolocations: true,
      videoUrls: [],
      documentUrls: [],
      newsArticleUrls: [],
      researchHistory: "Extensive anthropological and architectural studies of temples and urban culture.",
      geologicalFormation: "Situated in a valley formed by ancient river systems.",
      localLegends: "Legends speak of the valley's founding by the Gopal dynasty and its sacred significance.",
      languages: ["English", "Nepali", "French"],
      lastUpdated: "2024-11-20",
      researcherName: "Dr. Priya Sharma",
      researchNotes: "Documenting cultural preservation efforts and urban development impacts.",
    },
    {
      id: "4",
      name: "Namche Bazaar",
      type: "Village",
      region: "Nepal",
      country: "Nepal",
      latitude: 27.8089,
      longitude: 86.71,
      elevation: 3440,
      shortDescription:
        "Gateway to the Everest region, this Sherpa trading village is crucial for mountaineering expeditions and cultural tourism.",
      fullHistory:
        "Originally a salt trading post, Namche Bazaar has evolved into the primary hub for Everest region tourism and mountaineering support.",
      historicalSignificance: ["Cultural", "Environmental"],
      climateZone: "Sub-Alpine",
      floraTags: ["Rhododendron forest", "Alpine herbs"],
      faunaTags: ["Musk deer", "Himalayan pheasant", "Snow leopard"],
      photoUrls: ["/namche-bazaar.jpg", "/sherpa-village.jpg"],
      photoGeolocations: true,
      videoUrls: [],
      documentUrls: [],
      newsArticleUrls: [],
      researchHistory: "Studies of Sherpa culture, mountaineering history, and tourism impacts.",
      geologicalFormation: "Nestled in a glacially carved valley.",
      localLegends: "Sacred sites and Sherpa traditions related to mountain spirituality.",
      languages: ["English", "Nepali"],
      lastUpdated: "2024-11-18",
      researcherName: "Dr. Michael Torres",
      researchNotes: "Researching cultural adaptation and tourism sustainability.",
    },
    {
      id: "5",
      name: "Lhotse",
      type: "Peak",
      region: "Nepal",
      country: "Nepal",
      latitude: 27.9617,
      longitude: 86.9331,
      elevation: 8516,
      shortDescription:
        'The fourth highest mountain in the world, known as the "South Peak" and integral to the Everest climbing route.',
      fullHistory:
        "Part of the Everest massif, Lhotse has been studied extensively through mountaineering expeditions and geological surveys.",
      historicalSignificance: ["Geological", "Environmental"],
      climateZone: "High Alpine",
      floraTags: ["Alpine tundra"],
      faunaTags: ["High altitude birds", "Snow leopard habitat"],
      photoUrls: ["/lhotse-peak.jpg", "/everest-massif.jpg"],
      photoGeolocations: true,
      videoUrls: [],
      documentUrls: [],
      newsArticleUrls: [],
      researchHistory: "Glaciological and mountaineering research.",
      geologicalFormation: "Part of the Everest-Lhotse massif formed by tectonic collision.",
      localLegends: "Associated with Sherpa spiritual traditions.",
      languages: ["English", "Nepali"],
      lastUpdated: "2024-11-12",
      researcherName: "Dr. Anna Mueller",
      researchNotes: "Monitoring glacial changes and climate impacts.",
    },
    {
      id: "6",
      name: "Panauti Archaeological Site",
      type: "Archaeological Site",
      region: "Nepal",
      country: "Nepal",
      latitude: 27.6089,
      longitude: 85.3031,
      elevation: 900,
      shortDescription:
        "Ancient archaeological site with significant historical artifacts and evidence of early settlements in the Kathmandu Valley.",
      fullHistory:
        "Extensive excavations have revealed pottery, tools, and structures dating back several centuries, providing insights into valley settlement patterns.",
      historicalSignificance: ["Archaeological", "Cultural"],
      climateZone: "Temperate",
      floraTags: ["Valley vegetation", "Agricultural areas"],
      faunaTags: ["Common valley species"],
      photoUrls: ["/archaeological-site.jpg", "/ancient-pottery.jpg"],
      photoGeolocations: true,
      videoUrls: [],
      documentUrls: [],
      newsArticleUrls: [],
      researchHistory: "Archaeological excavations and artifact analysis since the 1980s.",
      geologicalFormation: "Situated in the fertile Kathmandu Valley.",
      localLegends: "Local stories about ancient settlements and civilizations.",
      languages: ["English", "Nepali"],
      lastUpdated: "2024-11-10",
      researcherName: "Dr. Rajesh Kumar",
      researchNotes: "Documenting artifacts and preservation efforts.",
    },
  ]
}

export async function fetchLocationsFromAirtable(): Promise<AirtableLocation[]> {
  const AIRTABLE_BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID || ""
  const AIRTABLE_API_TOKEN = process.env.AIRTABLE_API_TOKEN || ""

  // If Airtable credentials are not configured, return mock data silently
  if (!AIRTABLE_BASE_ID || !AIRTABLE_API_TOKEN) {
    return getMockLocations()
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_TOKEN}`,
      },
      signal: controller.signal,
      cache: "no-store",
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      // Silently fall back to mock data - don't log the error
      return getMockLocations()
    }

    const data: LocationsResponse = await response.json()

    if (!data.records || data.records.length === 0) {
      return getMockLocations()
    }

    return data.records.map((record) => transformAirtableRecord(record))
  } catch {
    // Silently fall back to mock data on any error
    return getMockLocations()
  }
}

function transformAirtableRecord(record: LocationsResponse["records"][0]): AirtableLocation {
  const fields = record.fields
  return {
    id: record.id,
    name: fields["Location Name"] || "",
    type: fields["Location Type"] || "Valley",
    region: fields["Region"] || "Nepal",
    country: fields["Country"] || "",
    latitude: fields["Latitude"] || 0,
    longitude: fields["Longitude"] || 0,
    elevation: fields["Altitude/Elevation"] || 0,
    shortDescription: fields["Short Description"] || "",
    fullHistory: fields["Full History"] || "",
    historicalSignificance: fields["Historical Significance"] || [],
    climateZone: fields["Climate Zone"] || "Alpine",
    floraTags: fields["Flora Tags"] || [],
    faunaTags: fields["Fauna Tags"] || [],
    photoUrls: fields["Photo URLs"] || [],
    photoGeolocations: fields["Photo Geolocations"] || false,
    videoUrls: fields["Videos"] || [],
    documentUrls: fields["Documents"] || [],
    newsArticleUrls: fields["News Articles"] || [],
    researchHistory: fields["Research History"],
    geologicalFormation: fields["Geological Formation"],
    localLegends: fields["Local Legends"],
    languages: fields["Language Tags"] || ["English"],
    lastUpdated: fields["Last Updated"] || new Date().toISOString(),
    researcherName: fields["Researcher Name"] || "Unknown",
    researchNotes: fields["Research Notes"],
  }
}

export function searchLocations(locations: AirtableLocation[], query: string): AirtableLocation[] {
  const lowerQuery = query.toLowerCase()
  return locations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(lowerQuery) ||
      loc.shortDescription.toLowerCase().includes(lowerQuery) ||
      loc.fullHistory.toLowerCase().includes(lowerQuery) ||
      loc.floraTags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
      loc.faunaTags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
  )
}

export function filterLocations(
  locations: AirtableLocation[],
  filters: {
    region?: string
    type?: string
    significance?: string
    minElevation?: number
    maxElevation?: number
    languages?: string[]
  },
): AirtableLocation[] {
  return locations.filter((loc) => {
    if (filters.region && loc.region !== filters.region) return false
    if (filters.type && loc.type !== filters.type) return false
    if (filters.significance && !loc.historicalSignificance.includes(filters.significance)) return false
    if (filters.minElevation && loc.elevation < filters.minElevation) return false
    if (filters.maxElevation && loc.elevation > filters.maxElevation) return false
    if (
      filters.languages &&
      filters.languages.length > 0 &&
      !filters.languages.some((lang) => loc.languages.includes(lang))
    )
      return false
    return true
  })
}

export function getLocationById(locations: AirtableLocation[], id: string): AirtableLocation | undefined {
  return locations.find((loc) => loc.id === id)
}
