"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WebsiteIcon } from "@/components/website-icon"
import { AddWebsiteDialog } from "@/components/add-website-dialog"
import { useDeleteWebsite } from "@/lib/hooks/useWebsites"
import { ExternalLink, Edit, Trash2 } from "lucide-react"
import { useState } from "react"

interface Website {
  id: string
  name: string
  url: string
  description?: string
  iconType?: 'FAVICON' | 'CUSTOM' | 'DEFAULT' | 'AUTO_FETCHED' | 'LIBRARY'
  customIconPath?: string | null
}

interface WebsiteCardProps {
  website: Website
  isAdmin?: boolean
}

export function WebsiteCard({ website, isAdmin }: WebsiteCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const deleteMutation = useDeleteWebsite()

  const handleVisit = () => {
    window.open(website.url, "_blank", "noopener,noreferrer")
  }

  const handleDelete = async () => {
    if (confirm("确定要删除这个网站吗？")) {
      try {
        await deleteMutation.mutateAsync(website.id)
      } catch (error) {
        console.error('Failed to delete website:', error)
        // 可以在这里添加错误通知
      }
    }
  }

  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-500 hover:border-primary/50 hover:bg-card/90 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] hover:glow-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="flex-shrink-0">
              <WebsiteIcon 
                website={website} 
                size={32}
                className="transition-transform duration-300 group-hover:rotate-12"
              />
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
                <AddWebsiteDialog
                  editWebsite={website}
                  triggerButton={
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-primary/20 hover:scale-110 transition-all duration-200"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  }
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
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
