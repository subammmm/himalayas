import { fetchLocationsFromAirtable } from "@/lib/airtable"

export async function GET() {
  const locations = await fetchLocationsFromAirtable()
  return Response.json(locations)
}
