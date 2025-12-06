"use client"

import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import Supercluster from 'supercluster'

interface Location {
  id: string
  name: string
  latitude: number
  longitude: number
  region: string
  type: string
  elevation?: number
  description?: string
}

interface MapContainerProps {
  locations: Location[]
  selectedLocation: Location | null
  onLocationSelect: (location: Location) => void
  mapStyle?: 'terrain' | 'satellite' | 'light' | 'dark'
}

const locationTypeColors: Record<string, string> = {
  Valley: '#5c9e6f',
  Peak: '#e74c3c',
  Village: '#f39c12',
  'Archaeological Site': '#3498db',
  Lake: '#2980b9',
  Pass: '#95a5a6',
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

export function MapContainer({ locations, selectedLocation, onLocationSelect, mapStyle = 'terrain' }: MapContainerProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({})
  const clusterMarkersRef = useRef<mapboxgl.Marker[]>([])
  const [mapReady, setMapReady] = useState(false)
  const superclusterRef = useRef<Supercluster | null>(null)
  const hoveredPopup = useRef<mapboxgl.Popup | null>(null)

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    if (!MAPBOX_TOKEN) {
      console.error('Mapbox token not found')
      return
    }

    mapboxgl.accessToken = MAPBOX_TOKEN

    const mapStyles: Record<string, string> = {
      terrain: 'mapbox://styles/mapbox/outdoors-v12',
      satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
      light: 'mapbox://styles/mapbox/light-v11',
      dark: 'mapbox://styles/mapbox/dark-v11',
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyles[mapStyle],
      center: [84, 28],
      zoom: 5,
      pitch: 45,
    })

    map.current.on('load', () => {
      if (!map.current) return

      map.current.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.terrain-rgb',
        tileSize: 512,
        maxzoom: 14,
      })

      map.current.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 })

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')
      map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right')
      map.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true,
          showUserHeading: true,
        }),
        'top-right'
      )

      setMapReady(true)
    })

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
      terrain: 'mapbox://styles/mapbox/outdoors-v12',
      satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
      light: 'mapbox://styles/mapbox/light-v11',
      dark: 'mapbox://styles/mapbox/dark-v11',
    }

    map.current.setStyle(mapStyles[mapStyle])

    map.current.once('style.load', () => {
      if (!map.current) return

      map.current.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.terrain-rgb',
        tileSize: 512,
        maxzoom: 14,
      })

      map.current.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 })
    })
  }, [mapStyle, mapReady])

  useEffect(() => {
    if (!map.current || !mapReady || locations.length === 0) return

    const geojsonData: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: locations.map(loc => ({
        type: 'Feature',
        properties: { id: loc.id },
        geometry: {
          type: 'Point',
          coordinates: [loc.longitude, loc.latitude],
        },
      })),
    }

    if (!map.current.getSource('locations-heatmap')) {
      map.current.addSource('locations-heatmap', {
        type: 'geojson',
        data: geojsonData,
      })

      map.current.addLayer({
        id: 'locations-heatmap-layer',
        type: 'heatmap',
        source: 'locations-heatmap',
        maxzoom: 9,
        paint: {
          'heatmap-weight': 1,
          'heatmap-intensity': 1,
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(33,102,172,0)',
            0.2, 'rgb(103,169,207)',
            0.4, 'rgb(209,229,240)',
            0.6, 'rgb(253,219,199)',
            0.8, 'rgb(239,138,98)',
            1, 'rgb(178,24,43)'
          ],
          'heatmap-radius': 30,
          'heatmap-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7, 0.8,
            9, 0
          ],
        },
      })
    }

    const cluster = new Supercluster({
      radius: 80,
      maxZoom: 16,
      minZoom: 0,
    })

    const points = locations.map(loc => ({
      type: 'Feature' as const,
      properties: { ...loc, cluster: false },
      geometry: {
        type: 'Point' as const,
        coordinates: [loc.longitude, loc.latitude] as [number, number],
      },
    }))

    cluster.load(points)
    superclusterRef.current = cluster

    const updateMarkers = () => {
      if (!map.current || !superclusterRef.current) return

      const bounds = map.current.getBounds()
      const bbox: [number, number, number, number] = [
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ]
      const zoom = Math.floor(map.current.getZoom())

      const clusters = superclusterRef.current.getClusters(bbox, zoom)

      Object.values(markersRef.current).forEach(marker => marker.remove())
      clusterMarkersRef.current.forEach(marker => marker.remove())
      markersRef.current = {}
      clusterMarkersRef.current = []

      clusters.forEach((cluster: any) => {
        const [longitude, latitude] = cluster.geometry.coordinates
        const { cluster: isCluster, point_count } = cluster.properties

        if (isCluster) {
          const el = document.createElement('div')
          el.className = 'cluster-marker'
          el.style.cssText = `
            width: 50px;
            height: 50px;
            background-color: #3498db;
            border: 4px solid white;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            transition: transform 0.2s;
          `
          el.textContent = point_count.toString()

          const marker = new mapboxgl.Marker(el)
            .setLngLat([longitude, latitude])
            .addTo(map.current!)

          el.addEventListener('click', () => {
            if (!map.current) return
            const expansionZoom = Math.min(
              superclusterRef.current!.getClusterExpansionZoom(cluster.id),
              20
            )
            map.current.flyTo({
              center: [longitude, latitude],
              zoom: expansionZoom,
              duration: 1000,
            })
          })

          el.addEventListener('mouseenter', () => {
            el.style.transform = 'scale(1.1)'
          })

          el.addEventListener('mouseleave', () => {
            el.style.transform = 'scale(1)'
          })

          clusterMarkersRef.current.push(marker)
        } else {
          const location = cluster.properties as Location
          const color = locationTypeColors[location.type] || '#5c9e6f'

          const el = document.createElement('div')
          el.className = 'location-marker'
          el.style.cssText = `
            width: 32px;
            height: 32px;
            background-color: ${color};
            border: 3px solid white;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            transition: transform 0.2s;
            ${selectedLocation?.id === location.id ? 'transform: scale(1.3); box-shadow: 0 6px 16px rgba(0,0,0,0.5);' : ''}
          `

          const popup = new mapboxgl.Popup({
            offset: 25,
            closeButton: false,
            className: 'hover-popup',
          }).setHTML(`
            <div style="padding: 8px; min-width: 150px;">
              <h3 style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">${location.name}</h3>
              <p style="font-size: 12px; color: #666; margin: 2px 0;">${location.type}</p>
              <p style="font-size: 12px; color: #666; margin: 2px 0;">Elevation: ${location.elevation || 'N/A'}m</p>
              <p style="font-size: 12px; color: #666; margin: 2px 0;">${location.region}</p>
            </div>
          `)

          const marker = new mapboxgl.Marker(el)
            .setLngLat([longitude, latitude])
            .setPopup(popup)
            .addTo(map.current!)

          el.addEventListener('mouseenter', () => {
            if (selectedLocation?.id !== location.id) {
              el.style.transform = 'scale(1.2)'
            }
            hoveredPopup.current = popup
            popup.addTo(map.current!)
          })

          el.addEventListener('mouseleave', () => {
            if (selectedLocation?.id !== location.id) {
              el.style.transform = 'scale(1)'
            }
            popup.remove()
            hoveredPopup.current = null
          })

          el.addEventListener('click', () => {
            onLocationSelect(location)
            map.current!.flyTo({
              center: [longitude, latitude],
              zoom: 10,
              duration: 1000,
            })
          })

          markersRef.current[location.id] = marker
        }
      })
    }

    updateMarkers()
    map.current.on('zoom', updateMarkers)
    map.current.on('move', updateMarkers)

    return () => {
      if (map.current) {
        map.current.off('zoom', updateMarkers)
        map.current.off('move', updateMarkers)
      }
    }
  }, [locations, selectedLocation, mapReady, onLocationSelect])

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" style={{ minHeight: '100vh' }} />
    </div>
  )
}
