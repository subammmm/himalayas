"use client"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight, Download, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Photo {
  id: string
  url: string
  title?: string
  photographer?: string
  coordinates?: { lat: number; lon: number }
  date?: string
}

interface PhotoGalleryProps {
  photos: Photo[]
  locationName: string
  onClose?: () => void
}

export function PhotoGallery({ photos, locationName, onClose }: PhotoGalleryProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "carousel">("grid")

  const currentPhoto = selectedPhotoIndex !== null ? photos[selectedPhotoIndex] : null

  const handlePrevious = () => {
    if (selectedPhotoIndex === null) return
    setSelectedPhotoIndex(selectedPhotoIndex === 0 ? photos.length - 1 : selectedPhotoIndex - 1)
  }

  const handleNext = () => {
    if (selectedPhotoIndex === null) return
    setSelectedPhotoIndex(selectedPhotoIndex === photos.length - 1 ? 0 : selectedPhotoIndex + 1)
  }

  if (selectedPhotoIndex !== null && currentPhoto) {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white">{locationName}</h2>
            <p className="text-sm text-white/70">
              Photo {selectedPhotoIndex + 1} of {photos.length}
            </p>
          </div>
          <button
            onClick={() => setSelectedPhotoIndex(null)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close gallery"
          >
            <X size={24} className="text-white" />
          </button>
        </div>

        {/* Main Image */}
        <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
          <img
            src={currentPhoto.url || "/placeholder.svg"}
            alt={currentPhoto.title || `${locationName} photo`}
            className="max-h-full max-w-full object-contain"
          />

          {/* Navigation Buttons */}
          {photos.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm"
                aria-label="Previous photo"
              >
                <ChevronLeft size={24} className="text-white" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm"
                aria-label="Next photo"
              >
                <ChevronRight size={24} className="text-white" />
              </button>
            </>
          )}
        </div>

        {/* Photo Info Footer */}
        <div className="bg-black/50 backdrop-blur-sm p-4 space-y-3 border-t border-white/10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              {currentPhoto.title && (
                <div>
                  <h3 className="text-sm font-semibold text-white/70">Title</h3>
                  <p className="text-white">{currentPhoto.title}</p>
                </div>
              )}

              {currentPhoto.photographer && (
                <div>
                  <h3 className="text-sm font-semibold text-white/70">Photographer</h3>
                  <p className="text-white">{currentPhoto.photographer}</p>
                </div>
              )}

              {currentPhoto.date && (
                <div>
                  <h3 className="text-sm font-semibold text-white/70">Date</h3>
                  <p className="text-white">{new Date(currentPhoto.date).toLocaleDateString()}</p>
                </div>
              )}

              {currentPhoto.coordinates && (
                <div>
                  <h3 className="text-sm font-semibold text-white/70">Location</h3>
                  <p className="text-white flex items-center gap-1">
                    <MapPin size={14} />
                    {currentPhoto.coordinates.lat}°N, {currentPhoto.coordinates.lon}°E
                  </p>
                </div>
              )}
            </div>

            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
              <Download size={16} className="mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">{locationName} - Photo Gallery</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              viewMode === "grid"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode("carousel")}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              viewMode === "carousel"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Carousel
          </button>
        </div>
      </div>

      {/* Photo Count */}
      <p className="text-sm text-muted-foreground">
        {photos.length} photo{photos.length !== 1 ? "s" : ""} available
      </p>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo, idx) => (
            <button
              key={photo.id}
              onClick={() => setSelectedPhotoIndex(idx)}
              className="group relative overflow-hidden rounded-lg aspect-square cursor-pointer"
            >
              <img
                src={photo.url || "/placeholder.svg"}
                alt={photo.title || `Photo ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                    <ChevronRight size={24} className="text-white" />
                  </div>
                </div>
              </div>
              {photo.photographer && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <p className="text-xs text-white font-medium">{photo.photographer}</p>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Carousel View */}
      {viewMode === "carousel" && photos.length > 0 && (
        <div className="space-y-4">
          <div className="relative bg-muted rounded-lg overflow-hidden aspect-video">
            <img
              src={photos[0].url || "/placeholder.svg"}
              alt={photos[0].title || "Photo"}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Photo Details */}
          {photos[0].title && (
            <div>
              <h3 className="text-sm font-semibold">{photos[0].title}</h3>
              {photos[0].photographer && <p className="text-xs text-muted-foreground">by {photos[0].photographer}</p>}
            </div>
          )}

          {/* Thumbnail Carousel */}
          <div className="grid grid-cols-4 gap-2">
            {photos.map((photo, idx) => (
              <button
                key={photo.id}
                className="relative overflow-hidden rounded-lg aspect-square border-2 border-transparent hover:border-primary transition-colors"
              >
                <img
                  src={photo.url || "/placeholder.svg"}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {photos.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No photos available for this location</p>
        </div>
      )}
    </div>
  )
}
