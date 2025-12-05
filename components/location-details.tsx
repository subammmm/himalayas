"use client"
import { Button } from "@/components/ui/button"
import { X, MapPin, Maximize2, Download, ExternalLink, Globe } from "lucide-react"
import { useState, useEffect } from "react"
import { useLocations } from "@/hooks/use-locations"
import { getLocationById } from "@/lib/airtable"

interface LocationDetailsProps {
  locationId: string
  onClose: () => void
}

export function LocationDetails({ locationId, onClose }: LocationDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [language, setLanguage] = useState("en")
  const { allLocations } = useLocations()
  const [location, setLocation] = useState<any>(null)

  useEffect(() => {
    if (allLocations.length > 0) {
      const found = getLocationById(allLocations, locationId)
      setLocation(found)
    }
  }, [locationId, allLocations])

  if (!location) {
    return (
      <div className="hidden md:flex w-80 bg-card border-l border-border flex-col h-screen overflow-y-auto shadow-lg items-center justify-center">
        <div className="text-center text-muted-foreground">Loading...</div>
      </div>
    )
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "history", label: "History" },
    { id: "photos", label: "Photos" },
    { id: "research", label: "Research" },
    { id: "biodiversity", label: "Biodiversity" },
    { id: "languages", label: "Languages" },
  ]

  return (
    <div className="hidden md:flex w-80 bg-card border-l border-border flex-col h-screen overflow-y-auto shadow-lg">
      <div className="p-4 border-b border-border flex items-center justify-between bg-primary/5 sticky top-0">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-card-foreground">{location.name}</h2>
          <p className="text-xs text-muted-foreground">
            {location.type} • {location.region}
          </p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors" aria-label="Close details">
          <X size={20} />
        </button>
      </div>

      <div className="flex border-b border-border overflow-x-auto sticky top-16 bg-card">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-card-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <span className="px-3 py-1 bg-secondary/20 text-secondary rounded-full text-xs font-medium">
                {location.type}
              </span>
              <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-medium">
                {location.region}
              </span>
              <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium">
                {location.climateZone}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Coordinates</h3>
                <p className="text-sm text-card-foreground flex items-center gap-2 mt-1">
                  <MapPin size={16} className="text-primary" />
                  {location.latitude}°N, {location.longitude}°E
                </p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Elevation</h3>
                <p className="text-sm text-card-foreground mt-1">{location.elevation}m</p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Description</h3>
                <p className="text-sm text-card-foreground mt-1 leading-relaxed">{location.shortDescription}</p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Researcher</h3>
                <p className="text-sm text-card-foreground mt-1">{location.researcherName}</p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Last Updated</h3>
                <p className="text-sm text-card-foreground mt-1">
                  {new Date(location.lastUpdated).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* History & Significance Tab */}
        {activeTab === "history" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-2">Historical Significance</h3>
              <div className="flex gap-2 flex-wrap">
                {location.historicalSignificance?.map((sig: string) => (
                  <span key={sig} className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium">
                    {sig}
                  </span>
                ))}
              </div>
            </div>

            {location.fullHistory && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Full History</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{location.fullHistory}</p>
              </div>
            )}

            {location.localLegends && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Local Legends & Folklore</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{location.localLegends}</p>
              </div>
            )}

            {location.geologicalFormation && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Geological Formation</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{location.geologicalFormation}</p>
              </div>
            )}

            {location.researchHistory && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Research History</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{location.researchHistory}</p>
              </div>
            )}
          </div>
        )}

        {/* Photos Tab */}
        {activeTab === "photos" && (
          <div className="space-y-3">
            {location.photoUrls?.length > 0 ? (
              <>
                {location.photoUrls.map((photo: string, idx: number) => (
                  <div key={idx} className="relative group cursor-pointer">
                    <img
                      src={photo || "/placeholder.svg"}
                      alt={`${location.name} photo ${idx + 1}`}
                      className="w-full h-40 object-cover rounded-lg"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = "/himalayan-location.jpg"
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-lg flex items-center justify-center transition-colors">
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 size={24} className="text-white" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Photo {idx + 1}</p>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-2 bg-transparent" size="sm">
                  <Download size={16} className="mr-2" />
                  Download All Photos
                </Button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No photos available</p>
            )}
          </div>
        )}

        {/* Research & Documentation Tab */}
        {activeTab === "research" && (
          <div className="space-y-4">
            {location.documentUrls?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3">Research Papers & Documents</h3>
                <div className="space-y-2">
                  {location.documentUrls.map((doc: any, idx: number) => (
                    <a
                      key={idx}
                      href={typeof doc === "string" ? doc : doc.url}
                      className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-card-foreground">
                          {typeof doc === "string" ? `Document ${idx + 1}` : doc.title}
                        </p>
                        <p className="text-xs text-muted-foreground">PDF</p>
                      </div>
                      <ExternalLink size={16} className="text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {location.newsArticleUrls?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3">News & Articles</h3>
                <div className="space-y-2">
                  {location.newsArticleUrls.map((article: any, idx: number) => (
                    <a
                      key={idx}
                      href={typeof article === "string" ? article : article.url}
                      className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-card-foreground">
                          {typeof article === "string" ? `Article ${idx + 1}` : article.title}
                        </p>
                        <p className="text-xs text-muted-foreground">News</p>
                      </div>
                      <ExternalLink size={16} className="text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {!location.documentUrls?.length && !location.newsArticleUrls?.length && (
              <p className="text-sm text-muted-foreground text-center py-8">No research documentation available</p>
            )}
          </div>
        )}

        {/* Biodiversity Tab */}
        {activeTab === "biodiversity" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-2">Climate Zone</h3>
              <p className="text-sm text-muted-foreground">{location.climateZone}</p>
            </div>

            {location.floraTags?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Flora</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {location.floraTags.map((f: string) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="text-primary mt-0.5 flex-shrink-0">•</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {location.faunaTags?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Fauna</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {location.faunaTags.map((f: string) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="text-primary mt-0.5 flex-shrink-0">•</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Multilingual Tab */}
        {activeTab === "languages" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Globe size={16} />
                Available Languages
              </h3>
              <div className="flex gap-2 flex-wrap">
                {location.languages?.map((lang: string) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang === "English" ? "en" : lang === "Nepali" ? "ne" : "fr")}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      (lang === "English" && language === "en") ||
                      (lang === "Nepali" && language === "ne") ||
                      (lang === "French" && language === "fr")
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 p-3 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground">
                Location data available in {location.languages?.length || 1} languages. Full translations coming soon.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
