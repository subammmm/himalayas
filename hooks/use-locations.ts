"use client"

import { useEffect, useState } from "react"
import { type AirtableLocation, searchLocations, filterLocations } from "@/lib/airtable"

interface UseLocationsOptions {
  searchTerm?: string
  filters?: {
    region?: string
    type?: string
    significance?: string
    minElevation?: number
    maxElevation?: number
    languages?: string[]
  }
}

export function useLocations(options: UseLocationsOptions = {}) {
  const [locations, setLocations] = useState<AirtableLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadLocations = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/locations")
        if (!response.ok) throw new Error("Failed to fetch locations")
        const data = await response.json()
        setLocations(data)
        setError(null)
      } catch (err) {
        console.error("[v0] Error loading locations:", err)
        setError(err instanceof Error ? err : new Error("Failed to load locations"))
      } finally {
        setLoading(false)
      }
    }

    loadLocations()
  }, [])

  let filteredLocations = locations

  if (options.searchTerm) {
    filteredLocations = searchLocations(filteredLocations, options.searchTerm)
  }

  if (options.filters) {
    filteredLocations = filterLocations(filteredLocations, options.filters)
  }

  return {
    locations: filteredLocations,
    allLocations: locations,
    loading,
    error,
  }
}
