"use client"

import { useEffect, useRef, useState } from "react"
import { MapLayerToggle } from "@/components/map-layer-toggle"
import { useLocations } from "@/hooks/use-locations"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

interface MapContainerProps {
  selectedLocationId: string | null
  filters: any
  onLocationSelect: (id: string) => void
}

const locationTypeColors: Record<string, string> = {
  Valley: "#5c9e6f",
  Peak: "#e74c3c",
  Village: "#f39c12",
  "Archaeological Site": "#3498db",
  Lake: "#2980b9",
  Pass: "#95a5a6",
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""

export function MapContainer({ selectedLocationId, filters, onLocationSelect }: MapContainerProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const markers = useRef<Map<string, any>>(new Map())
  const [mapStyle, setMapStyle] = useState("terrain")
  const [mapReady, setMapReady] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const mapboxgl = useRef<any>(null)

  const { locations, loading } = useLocations({
    filters: {
      region: filters.region || undefined,
      type: filters.locationType || undefined,
      significance: filters.significance || undefined,
      minElevation: filters.elevationMin,
      maxElevation: filters.elevationMax,
      languages: filters.languages?.length > 0 ? filters.languages : undefined,
    },
  })

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    const initMap = async () => {
      setIsInitializing(true)
      setMapError(null)

      try {
        if (!MAPBOX_TOKEN) {
          setMapError("Mapbox token is not configured.")
          setIsInitializing(false)
          return
        }

        // Dynamically import mapbox-gl
        const mapboxModule = await import("mapbox-gl")
        const mapboxGl = mapboxModule.default || mapboxModule
        mapboxgl.current = mapboxGl

        // Set the access token
        mapboxGl.accessToken = MAPBOX_TOKEN

        // Define map styles
        const mapStyles: Record<string, string> = {
          terrain: "mapbox://styles/mapbox/outdoors-v12",
          satellite: "mapbox://styles/mapbox/satellite-streets-v12",
          light: "mapbox://styles/mapbox/light-v11",
          dark: "mapbox://styles/mapbox/dark-v11",
        }

        // Create the map instance
        map.current = new mapboxGl.Map({
          container: mapContainer.current!,
          style: mapStyles[mapStyle],
          center: [84.0, 28.5],
          zoom: 6,
          pitch: 0,
        })

        // Set up event handlers
        map.current.on("load", () => {
          map.current.addControl(new mapboxGl.NavigationControl(), "top-right")
          map.current.addControl(new mapboxGl.FullscreenControl(), "top-right")
          setMapReady(true)
          setIsInitializing(false)
        })

        map.current.on("error", (e: any) => {
          console.error("[v0] Mapbox runtime error:", e.error?.message || e)
          if (e.error?.message?.includes("access token")) {
            setMapError("Invalid Mapbox access token.")
          }
        })
      } catch (error) {
        console.error("[v0] Error initializing map:", error)
        setMapError(
          error instanceof Error ? `Map initialization failed: ${error.message}` : "Failed to initialize Mapbox GL.",
        )
        setIsInitializing(false)
      }
    }

    initMap()

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!map.current || !mapReady) return

    const mapStyles: Record<string, string> = {
      terrain: "mapbox://styles/mapbox/outdoors-v12",
      satellite: "mapbox://styles/mapbox/satellite-streets-v12",
      light: "mapbox://styles/mapbox/light-v11",
      dark: "mapbox://styles/mapbox/dark-v11",
    }

    map.current.setStyle(mapStyles[mapStyle])
  }, [mapStyle, mapReady])

  useEffect(() => {
    if (!map.current || !mapReady || !mapboxgl.current) return

    markers.current.forEach((marker) => marker.remove())
    markers.current.clear()

    locations.forEach((location) => {
      const color = locationTypeColors[location.type] || "#5c9e6f"

      const markerEl = document.createElement("div")
      markerEl.className = "marker"
      markerEl.style.cssText = `
        width: 32px;
        height: 32px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transition: transform 0.2s, box-shadow 0.2s;
        font-weight: bold;
        font-size: 12px;
        color: white;
      `

      markerEl.addEventListener("mouseenter", () => {
        if (selectedLocationId !== location.id) {
          markerEl.style.transform = "scale(1.2)"
          markerEl.style.boxShadow = "0 4px 12px rgba(0,0,0,0.4)"
        }
      })

      markerEl.addEventListener("mouseleave", () => {
        if (selectedLocationId !== location.id) {
          markerEl.style.transform = "scale(1)"
          markerEl.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)"
        }
      })

      const popup = new mapboxgl.current.Popup({
        offset: 25,
        closeButton: false,
      }).setHTML(`
        <div class="p-3 bg-card text-card-foreground rounded-lg min-w-max">
          <h3 class="font-bold text-sm">${location.name}</h3>
          <p class="text-xs text-muted-foreground">${location.type}</p>
          <p class="text-xs text-muted-foreground">Elevation: ${location.elevation}m</p>
        </div>
      `)

      const marker = new mapboxgl.current.Marker({ element: markerEl })
        .setLngLat([location.longitude, location.latitude])
        .setPopup(popup)
        .addTo(map.current)

      markers.current.set(location.id, marker)

      markerEl.addEventListener("click", () => {
        onLocationSelect(location.id)
        markerEl.style.transform = "scale(1.3)"
        markerEl.style.boxShadow = "0 6px 16px rgba(0,0,0,0.5)"

        map.current.flyTo({
          center: [location.longitude, location.latitude],
          zoom: 8,
          duration: 1000,
        })
      })
    })

    markers.current.forEach((marker, id) => {
      if (id !== selectedLocationId) {
        const el = marker.getElement()
        el.style.transform = "scale(1)"
        el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)"
      }
    })
  }, [locations, selectedLocationId, mapReady, onLocationSelect])

  const handleStyleChange = (newStyle: string) => {
    setMapStyle(newStyle)
  }

  return (
    <div className="relative w-full h-full flex-1">
      <div ref={mapContainer} className="w-full h-full" style={{ minHeight: "100vh" }} />

      {mapError && (
        <div className="absolute inset-0 bg-background/95 flex items-center justify-center z-20">
          <Alert variant="destructive" className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-semibold mb-2">Map Configuration Required</p>
              <p>{mapError}</p>
              <p className="text-xs mt-3">Visit your Vercel project settings to add your Mapbox token.</p>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {(isInitializing || loading) && !mapError && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-20">
          <Spinner />
        </div>
      )}

      {mapReady && (
        <div className="absolute top-4 right-4 z-30">
          <MapLayerToggle onStyleChange={handleStyleChange} />
        </div>
      )}
    </div>
  )
}
