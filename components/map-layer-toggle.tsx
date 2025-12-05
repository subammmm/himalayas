"use client"

import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import { useState } from "react"

interface MapLayerToggleProps {
  onStyleChange: (style: string) => void
}

export function MapLayerToggle({ onStyleChange }: MapLayerToggleProps) {
  const [expanded, setExpanded] = useState(false)

  const layers = [
    { id: "terrain", label: "Terrain" },
    { id: "satellite", label: "Satellite" },
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
  ]

  return (
    <div className="relative">
      {expanded && (
        <div className="absolute bottom-full right-0 mb-2 bg-card border border-border rounded-lg shadow-lg p-2 space-y-1 w-32">
          {layers.map((layer) => (
            <button
              key={layer.id}
              onClick={() => {
                onStyleChange(layer.id)
                setExpanded(false)
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-primary/10 rounded transition-colors text-card-foreground"
            >
              {layer.label}
            </button>
          ))}
        </div>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setExpanded(!expanded)}
        className="bg-card text-card-foreground border-border"
      >
        <MapPin size={16} className="mr-2" />
        Layers
      </Button>
    </div>
  )
}
