"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { ChevronDown, Search, X } from "lucide-react"
import { useState, useMemo } from "react"
import { useLocations } from "@/hooks/use-locations"

interface FilterSidebarProps {
  filters: any
  setFilters: (filters: any) => void
  onLocationSelect: (id: string) => void
  isMobile?: boolean
}

export function FilterSidebar({ filters, setFilters, onLocationSelect, isMobile }: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    region: true,
    type: true,
    significance: false,
    elevation: false,
    languages: false,
  })
  const [searchTerm, setSearchTerm] = useState("")

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const { allLocations: airtableLocations } = useLocations()

  const allLocations =
    airtableLocations.length > 0
      ? airtableLocations.map((loc) => ({
          id: loc.id,
          name: loc.name,
          type: loc.type,
          region: loc.region,
          description: loc.shortDescription,
        }))
      : [
          {
            id: "1",
            name: "Sinja Valley",
            type: "Valley",
            region: "Nepal",
            description: "High valley in remote western Nepal",
          },
          {
            id: "2",
            name: "Mt. Everest",
            type: "Peak",
            region: "Nepal",
            description: "Highest mountain in the world",
          },
          {
            id: "3",
            name: "Kathmandu",
            type: "Village",
            region: "Nepal",
            description: "Capital city with rich cultural heritage",
          },
          {
            id: "4",
            name: "Namche Bazaar",
            type: "Village",
            region: "Nepal",
            description: "Gateway to Everest region",
          },
          {
            id: "5",
            name: "Lhotse",
            type: "Peak",
            region: "Nepal",
            description: "Fourth highest mountain",
          },
          {
            id: "6",
            name: "Panauti Archaeological Site",
            type: "Archaeological Site",
            region: "Nepal",
            description: "Important archaeological site",
          },
        ]

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return []
    return allLocations.filter(
      (loc) =>
        loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loc.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [searchTerm])

  const activeFilterCount = [filters.region, filters.locationType, filters.significance, searchTerm].filter(
    Boolean,
  ).length

  const handleResetFilters = () => {
    setFilters({
      region: "",
      locationType: "",
      significance: "",
      elevationMin: 0,
      elevationMax: 8848,
      languages: [],
      searchTerm: "",
    })
    setSearchTerm("")
  }

  return (
    <div
      className={`${isMobile ? "w-full" : "w-64"} bg-sidebar border-r border-sidebar-border flex flex-col h-screen overflow-y-auto p-4 gap-4`}
    >
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-sidebar-foreground">Himalayan</h1>
        <h1 className="text-2xl font-bold text-sidebar-primary">Research Archive</h1>
        <p className="text-xs text-sidebar-foreground/60 mt-1">Explore cultural heritage & environmental data</p>
      </div>

      <div className="space-y-2 relative">
        <label className="text-xs font-semibold text-sidebar-foreground uppercase tracking-wide">
          Search Locations
        </label>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sidebar-foreground/40" />
          <Input
            placeholder="Location name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 bg-sidebar-accent/30 border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/40"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sidebar-foreground/40 hover:text-sidebar-foreground"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {searchTerm && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50">
            <div className="max-h-48 overflow-y-auto">
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => {
                    onLocationSelect(result.id)
                    setSearchTerm("")
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-b-0"
                >
                  <p className="text-sm font-medium text-card-foreground">{result.name}</p>
                  <p className="text-xs text-muted-foreground">{result.type}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Active Filters Count */}
      {activeFilterCount > 0 && (
        <div className="flex items-center justify-between bg-primary/10 px-3 py-2 rounded-lg">
          <span className="text-xs font-medium text-primary">
            {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} active
          </span>
          <button onClick={handleResetFilters} className="text-xs font-medium text-primary hover:underline">
            Clear all
          </button>
        </div>
      )}

      {/* Region Filter */}
      <div className="space-y-2">
        <button
          onClick={() => toggleSection("region")}
          className="w-full flex items-center justify-between p-2 hover:bg-sidebar-accent/10 rounded transition-colors"
        >
          <label className="text-sm font-semibold text-sidebar-foreground cursor-pointer">Region</label>
          <ChevronDown
            size={16}
            className={`transition-transform text-sidebar-foreground/60 ${
              expandedSections.region ? "rotate-0" : "-rotate-90"
            }`}
          />
        </button>
        {expandedSections.region && (
          <div className="space-y-2 pl-2">
            {Array.from(new Set(allLocations.map((loc) => loc.region))).map((region) => (
              <label key={region} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.region === region}
                  onChange={() =>
                    setFilters({
                      ...filters,
                      region: filters.region === region ? "" : region,
                    })
                  }
                  className="w-4 h-4 rounded border-sidebar-border bg-sidebar accent-primary cursor-pointer"
                />
                <span className="text-sm text-sidebar-foreground group-hover:text-sidebar-primary transition-colors">
                  {region}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Location Type Filter */}
      <div className="space-y-2">
        <button
          onClick={() => toggleSection("type")}
          className="w-full flex items-center justify-between p-2 hover:bg-sidebar-accent/10 rounded transition-colors"
        >
          <label className="text-sm font-semibold text-sidebar-foreground cursor-pointer">Location Type</label>
          <ChevronDown
            size={16}
            className={`transition-transform text-sidebar-foreground/60 ${
              expandedSections.type ? "rotate-0" : "-rotate-90"
            }`}
          />
        </button>
        {expandedSections.type && (
          <div className="space-y-2 pl-2">
            {Array.from(new Set(allLocations.map((loc) => loc.type))).map((type) => (
              <label key={type} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.locationType === type}
                  onChange={() =>
                    setFilters({
                      ...filters,
                      locationType: filters.locationType === type ? "" : type,
                    })
                  }
                  className="w-4 h-4 rounded border-sidebar-border bg-sidebar accent-primary cursor-pointer"
                />
                <span className="text-sm text-sidebar-foreground group-hover:text-sidebar-primary transition-colors">
                  {type}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Historical Significance Filter */}
      <div className="space-y-2">
        <button
          onClick={() => toggleSection("significance")}
          className="w-full flex items-center justify-between p-2 hover:bg-sidebar-accent/10 rounded transition-colors"
        >
          <label className="text-sm font-semibold text-sidebar-foreground cursor-pointer">Significance</label>
          <ChevronDown
            size={16}
            className={`transition-transform text-sidebar-foreground/60 ${
              expandedSections.significance ? "rotate-0" : "-rotate-90"
            }`}
          />
        </button>
        {expandedSections.significance && (
          <div className="space-y-2 pl-2">
            {Array.from(new Set(allLocations.map((loc) => loc.significance))).map((sig) => (
              <label key={sig} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.significance === sig}
                  onChange={() =>
                    setFilters({
                      ...filters,
                      significance: filters.significance === sig ? "" : sig,
                    })
                  }
                  className="w-4 h-4 rounded border-sidebar-border bg-sidebar accent-primary cursor-pointer"
                />
                <span className="text-sm text-sidebar-foreground group-hover:text-sidebar-primary transition-colors">
                  {sig}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Elevation Range Filter */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection("elevation")}
          className="w-full flex items-center justify-between p-2 hover:bg-sidebar-accent/10 rounded transition-colors"
        >
          <label className="text-sm font-semibold text-sidebar-foreground cursor-pointer">Elevation Range</label>
          <ChevronDown
            size={16}
            className={`transition-transform text-sidebar-foreground/60 ${
              expandedSections.elevation ? "rotate-0" : "-rotate-90"
            }`}
          />
        </button>
        {expandedSections.elevation && (
          <div className="space-y-3 pl-2">
            <div className="text-xs text-sidebar-foreground/60 font-medium">
              {filters.elevationMin.toLocaleString()}m - {filters.elevationMax.toLocaleString()}m
            </div>
            <Slider
              min={0}
              max={8848}
              step={100}
              value={[filters.elevationMin, filters.elevationMax]}
              onValueChange={(value) =>
                setFilters({
                  ...filters,
                  elevationMin: value[0],
                  elevationMax: value[1],
                })
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-sidebar-foreground/40">
              <span>0m</span>
              <span>8,848m</span>
            </div>
          </div>
        )}
      </div>

      {/* Languages Filter */}
      <div className="space-y-2">
        <button
          onClick={() => toggleSection("languages")}
          className="w-full flex items-center justify-between p-2 hover:bg-sidebar-accent/10 rounded transition-colors"
        >
          <label className="text-sm font-semibold text-sidebar-foreground cursor-pointer">Languages</label>
          <ChevronDown
            size={16}
            className={`transition-transform text-sidebar-foreground/60 ${
              expandedSections.languages ? "rotate-0" : "-rotate-90"
            }`}
          />
        </button>
        {expandedSections.languages && (
          <div className="space-y-2 pl-2">
            {Array.from(new Set(allLocations.flatMap((loc) => loc.languages))).map((lang) => (
              <label key={lang} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.languages?.includes(lang)}
                  onChange={() => {
                    const newLanguages = filters.languages?.includes(lang)
                      ? filters.languages.filter((l: string) => l !== lang)
                      : [...(filters.languages || []), lang]
                    setFilters({ ...filters, languages: newLanguages })
                  }}
                  className="w-4 h-4 rounded border-sidebar-border bg-sidebar accent-primary cursor-pointer"
                />
                <span className="text-sm text-sidebar-foreground group-hover:text-sidebar-primary transition-colors">
                  {lang}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Reset Button */}
      <Button
        onClick={handleResetFilters}
        variant="outline"
        className="w-full mt-auto border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent/10 bg-transparent"
      >
        <X size={16} className="mr-2" />
        Reset All Filters
      </Button>

      {/* Filter Info */}
      <div className="text-xs text-sidebar-foreground/50 text-center py-2 border-t border-sidebar-border">
        Showing locations from {Array.from(new Set(allLocations.map((loc) => loc.region))).length} regions
      </div>
    </div>
  )
}
