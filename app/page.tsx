"use client"

import { useState } from "react"
import { MapContainer } from "@/components/map-container"
import { FilterSidebar } from "@/components/filter-sidebar"
import { LocationDetails } from "@/components/location-details"
import { Menu, X } from "lucide-react"

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    region: "",
    locationType: "",
    significance: "",
    elevationMin: 0,
    elevationMax: 8848,
    languages: [] as string[],
  })

  return (
    <div className="h-screen w-full flex bg-background text-foreground">
      {/* Mobile menu toggle */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-primary text-primary-foreground rounded-lg"
          aria-label="Toggle filters"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Filter Sidebar */}
      {sidebarOpen && (
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          onLocationSelect={setSelectedLocation}
          isMobile={typeof window !== "undefined" && window.innerWidth < 768}
        />
      )}

      {/* Main Map Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <MapContainer selectedLocationId={selectedLocation} filters={filters} onLocationSelect={setSelectedLocation} />
      </div>

      {/* Location Details Panel */}
      {selectedLocation && <LocationDetails locationId={selectedLocation} onClose={() => setSelectedLocation(null)} />}
    </div>
  )
}
