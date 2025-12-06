"use client"

import { useState, useEffect, useCallback } from 'react'
import { MapContainer } from '@/components/map-container'
import { FilterSidebar } from '@/components/filter-sidebar'
import { LocationDetails } from '@/components/location-details'
import { Button } from '@/components/ui/button'

interface Location {
  id: string
  name: string
  latitude: number
  longitude: number
  region: string
  type: string
  elevation?: number
  description?: string
  history?: string
  photos?: string[]
  research?: string
  biodiversity?: string
}

interface FilterState {
  search: string
  type: string[]
  region: string[]
  minElevation: number
  maxElevation: number
}

export default function Home() {
  const [allLocations, setAllLocations] = useState<Location[]>([])
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([])
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [loading, setLoading] = useState(true)
  const [mapStyle, setMapStyle] = useState<'terrain' | 'satellite' | 'light' | 'dark'>('terrain')

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/locations')
        const data = await response.json()
        setAllLocations(data)
        setFilteredLocations(data)
      } catch (error) {
        console.error('Error fetching locations:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLocations()
  }, [])

  const handleFilterChange = useCallback(async (filters: FilterState) => {
    const params = new URLSearchParams()
    
    if (filters.search) {
      params.append('search', filters.search)
    }
    
    if (filters.type.length > 0) {
      params.append('type', filters.type[0])
    }
    
    if (filters.region.length > 0) {
      params.append('region', filters.region[0])
    }
    
    if (filters.minElevation > 0) {
      params.append('minElevation', filters.minElevation.toString())
    }
    
    if (filters.maxElevation < 9000) {
      params.append('maxElevation', filters.maxElevation.toString())
    }

    try {
      const response = await fetch(`/api/locations?${params.toString()}`)
      const data = await response.json()
      setFilteredLocations(data)
    } catch (error) {
      console.error('Error filtering locations:', error)
      setFilteredLocations([])
    }
  }, [])

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location)
  }

  const handleCloseDetails = () => {
    setSelectedLocation(null)
  }

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading Himalayan research archive...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-full flex bg-background text-foreground">
      <FilterSidebar
        onFilterChange={handleFilterChange}
        locations={allLocations}
      />

      <div className="flex-1 flex flex-col">
        <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <h1 className="text-2xl font-bold">Himalayan Research Archive</h1>
          
          <div className="flex gap-2">
            <Button
              variant={mapStyle === 'terrain' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMapStyle('terrain')}
            >
              Terrain
            </Button>
            <Button
              variant={mapStyle === 'satellite' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMapStyle('satellite')}
            >
              Satellite
            </Button>
            <Button
              variant={mapStyle === 'light' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMapStyle('light')}
            >
              Light
            </Button>
            <Button
              variant={mapStyle === 'dark' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMapStyle('dark')}
            >
              Dark
            </Button>
          </div>
        </div>

        <div className="flex-1 relative">
          {filteredLocations.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-muted-foreground">No locations match your filters. Try adjusting them.</p>
            </div>
          ) : (
            <MapContainer
              locations={filteredLocations}
              selectedLocation={selectedLocation}
              onLocationSelect={handleLocationSelect}
              mapStyle={mapStyle}
            />
          )}
        </div>
      </div>

      {selectedLocation && (
        <div className="w-96 h-full border-l border-border overflow-y-auto">
          <LocationDetails
            location={selectedLocation}
            onClose={handleCloseDetails}
          />
        </div>
      )}
    </div>
  )
}
