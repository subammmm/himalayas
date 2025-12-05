"use client"

import type React from "react"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface PhotoLightboxProps {
  photos: string[]
  initialIndex: number
  onClose: () => void
  locationName?: string
}

export function PhotoLightbox({ photos, initialIndex, onClose, locationName = "Location" }: PhotoLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  const handlePrevious = () => {
    setCurrentIndex(currentIndex === 0 ? photos.length - 1 : currentIndex - 1)
  }

  const handleNext = () => {
    setCurrentIndex(currentIndex === photos.length - 1 ? 0 : currentIndex + 1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrevious()
    if (e.key === "ArrowRight") handleNext()
    if (e.key === "Escape") onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col" onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h2 className="text-white font-semibold">
          {locationName} - Photo {currentIndex + 1} of {photos.length}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Close lightbox"
        >
          <X size={24} className="text-white" />
        </button>
      </div>

      {/* Main Image */}
      <div className="flex-1 flex items-center justify-center p-4">
        <img
          src={photos[currentIndex] || "/placeholder.svg"}
          alt={`Photo ${currentIndex + 1}`}
          className="max-h-full max-w-full object-contain"
        />

        {/* Navigation */}
        {photos.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Previous photo"
            >
              <ChevronLeft size={32} className="text-white" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Next photo"
            >
              <ChevronRight size={32} className="text-white" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      <div className="bg-black/50 p-4 overflow-x-auto border-t border-white/10">
        <div className="flex gap-2">
          {photos.map((photo, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                idx === currentIndex ? "border-white" : "border-white/20 hover:border-white/40"
              }`}
            >
              <img
                src={photo || "/placeholder.svg"}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
