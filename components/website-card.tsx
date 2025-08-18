"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Edit, Trash2 } from "lucide-react"
import { useState } from "react"

interface Website {
  id: string
  name: string
  url: string
  description?: string
  favicon?: string
}

interface WebsiteCardProps {
  website: Website
  isAdmin?: boolean
  onEdit?: (website: Website) => void
  onDelete?: (id: string) => void
}

export function WebsiteCard({ website, isAdmin, onEdit, onDelete }: WebsiteCardProps) {
  const [imageError, setImageError] = useState(false)

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
    } catch {
      return null
    }
  }

  const handleVisit = () => {
    window.open(website.url, "_blank", "noopener,noreferrer")
  }

  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-500 hover:border-primary/50 hover:bg-card/90 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] hover:glow-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="flex-shrink-0">
              {!imageError && getFaviconUrl(website.url) ? (
                <img
                  src={getFaviconUrl(website.url)! || "/placeholder.svg"}
                  alt={`${website.name} favicon`}
                  className="w-8 h-8 rounded transition-transform duration-300 group-hover:rotate-12"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
                  <ExternalLink className="w-4 h-4 text-primary group-hover:animate-pulse" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{website.name}</h3>
              {website.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{website.description}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1 truncate">{website.url}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleVisit}
              className="h-8 w-8 p-0 hover:bg-primary/20 hover:scale-110 transition-all duration-200"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
            {isAdmin && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit?.(website)}
                  className="h-8 w-8 p-0 hover:bg-primary/20 hover:scale-110 transition-all duration-200"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete?.(website.id)}
                  className="h-8 w-8 p-0 hover:bg-destructive/20 text-destructive hover:scale-110 transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
