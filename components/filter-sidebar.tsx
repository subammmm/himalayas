"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { ChevronDown, Search, X } from 'lucide-react'

interface FilterState {
  search: string
  type: string[]
  region: string[]
  minElevation: number
  maxElevation: number
}

interface FilterSidebarProps {
  onFilterChange: (filters: FilterState) => void
  locations: any[]
}

export function FilterSidebar({ onFilterChange, locations }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: [],
    region: [],
    minElevation: 0,
    maxElevation: 9000,
  })

  const [expandedSections, setExpandedSections] = useState({
    type: true,
    elevation: true,
    region: true,
  })

  const uniqueTypes = Array.from(new Set(locations.map(loc => loc.type).filter(Boolean)))
  const uniqueRegions = Array.from(new Set(locations.map(loc => loc.region).filter(Boolean)))

  const typeCounts = uniqueTypes.reduce((acc, type) => {
    acc[type] = locations.filter(loc => loc.type === type).length
    return acc
  }, {} as Record<string, number>)

  useEffect(() => {
    onFilterChange(filters)
  }, [filters])

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }))
  }

  const handleTypeToggle = (type: string) => {
    setFilters(prev => ({
      ...prev,
      type: prev.type.includes(type)
        ? prev.type.filter(t => t !== type)
        : [...prev.type, type]
    }))
  }

  const handleRegionToggle = (region: string) => {
    setFilters(prev => ({
      ...prev,
      region: prev.region.includes(region)
        ? prev.region.filter(r => r !== region)
        : [...prev.region, region]
    }))
  }

  const handleElevationChange = (values: number[], isMin: boolean) => {
    if (isMin) {
      setFilters(prev => ({ ...prev, minElevation: values[0] }))
    } else {
      setFilters(prev => ({ ...prev, maxElevation: values[0] }))
    }
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      type: [],
      region: [],
      minElevation: 0,
      maxElevation: 9000,
    })
  }

  const hasActiveFilters = 
    filters.search !== '' ||
    filters.type.length > 0 ||
    filters.region.length > 0 ||
    filters.minElevation > 0 ||
    filters.maxElevation < 9000

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const filteredCount = locations.filter(loc => {
    const matchesSearch = !filters.search || 
      loc.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      loc.region?.toLowerCase().includes(filters.search.toLowerCase()) ||
      loc.description?.toLowerCase().includes(filters.search.toLowerCase())
    
    const matchesType = filters.type.length === 0 || filters.type.includes(loc.type)
    const matchesRegion = filters.region.length === 0 || filters.region.includes(loc.region)
    const matchesElevation = 
      (!loc.elevation || (loc.elevation >= filters.minElevation && loc.elevation <= filters.maxElevation))

    return matchesSearch && matchesType && matchesRegion && matchesElevation
  }).length

  return (
    <div className="w-80 h-full bg-card border-r border-border overflow-y-auto p-4 space-y-4">
      <div className="space-y-2">
        <h2 className="text-xl font-bold">Filters</h2>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search locations..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => toggleSection('type')}
          className="flex items-center justify-between w-full text-sm font-semibold"
        >
          <span>Location Type</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${expandedSections.type ? 'rotate-180' : ''}`}
          />
        </button>
        
        {expandedSections.type && (
          <div className="space-y-2 pl-2">
            {uniqueTypes.map(type => (
              <label key={type} className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={filters.type.includes(type)}
                  onCheckedChange={() => handleTypeToggle(type)}
                />
                <span className="text-sm flex-1">{type}</span>
                <span className="text-xs text-muted-foreground">({typeCounts[type]})</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <button
          onClick={() => toggleSection('elevation')}
          className="flex items-center justify-between w-full text-sm font-semibold"
        >
          <span>Elevation Range</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${expandedSections.elevation ? 'rotate-180' : ''}`}
          />
        </button>
        
        {expandedSections.elevation && (
          <div className="space-y-4 pl-2">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Min: {filters.minElevation}m</span>
                <span>Max: {filters.maxElevation}m</span>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Minimum</label>
                  <Slider
                    value={[filters.minElevation]}
                    onValueChange={(values) => handleElevationChange(values, true)}
                    min={0}
                    max={8848}
                    step={100}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Maximum</label>
                  <Slider
                    value={[filters.maxElevation]}
                    onValueChange={(values) => handleElevationChange(values, false)}
                    min={0}
                    max={9000}
                    step={100}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {uniqueRegions.length > 1 && (
        <div className="space-y-2">
          <button
            onClick={() => toggleSection('region')}
            className="flex items-center justify-between w-full text-sm font-semibold"
          >
            <span>Region</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${expandedSections.region ? 'rotate-180' : ''}`}
            />
          </button>
          
          {expandedSections.region && (
            <div className="space-y-2 pl-2">
              {uniqueRegions.map(region => (
                <label key={region} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={filters.region.includes(region)}
                    onCheckedChange={() => handleRegionToggle(region)}
                  />
                  <span className="text-sm">{region}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {hasActiveFilters && (
        <Button
          onClick={clearFilters}
          variant="outline"
          className="w-full"
          size="sm"
        >
          <X className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      )}

      <div className="pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground text-center">
          Showing {filteredCount} location{filteredCount !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}
