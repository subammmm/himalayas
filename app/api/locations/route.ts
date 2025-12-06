import { fetchLocationsFromAirtable } from "@/lib/airtable"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')?.toLowerCase() || ''
    const typeFilter = searchParams.get('type')?.split(',').filter(Boolean) || []
    const regionFilter = searchParams.get('region')?.split(',').filter(Boolean) || []
    const minElevation = searchParams.get('minElevation') ? Number(searchParams.get('minElevation')) : null
    const maxElevation = searchParams.get('maxElevation') ? Number(searchParams.get('maxElevation')) : null

    let locations = await fetchLocationsFromAirtable()

    // Apply search filter
    if (search) {
      locations = locations.filter(loc => 
        loc.name.toLowerCase().includes(search) ||
        loc.description?.toLowerCase().includes(search) ||
        loc.region?.toLowerCase().includes(search)
      )
    }

    // Apply type filter
    if (typeFilter.length > 0) {
      locations = locations.filter(loc => typeFilter.includes(loc.type))
    }

    // Apply region filter
    if (regionFilter.length > 0) {
      locations = locations.filter(loc => regionFilter.includes(loc.region))
    }

    // Apply elevation filter
    if (minElevation !== null) {
      locations = locations.filter(loc => 
        loc.elevation !== undefined && loc.elevation >= minElevation
      )
    }
    if (maxElevation !== null) {
      locations = locations.filter(loc => 
        loc.elevation !== undefined && loc.elevation <= maxElevation
      )
    }

    return Response.json(locations)
  } catch (error) {
    console.error('Failed to fetch locations:', error)
    return Response.json({ error: 'Failed to fetch locations' }, { status: 500 })
  }
}
