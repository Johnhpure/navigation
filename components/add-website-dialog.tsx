"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { IconUpload } from "@/components/icon-upload"
import { useCreateWebsite, useUpdateWebsite } from "@/lib/hooks/useWebsites"
import { Plus } from "lucide-react"

interface Website {
  id: string
  name: string
  url: string
  description?: string
  iconType?: 'FAVICON' | 'CUSTOM' | 'DEFAULT'
  customIconPath?: string | null
}

interface AddWebsiteDialogProps {
  editWebsite?: Website
  triggerButton?: React.ReactNode
}

export function AddWebsiteDialog({ editWebsite, triggerButton }: AddWebsiteDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(editWebsite?.name || "")
  const [url, setUrl] = useState(editWebsite?.url || "")
  const [description, setDescription] = useState(editWebsite?.description || "")
  const [iconType, setIconType] = useState<'FAVICON' | 'CUSTOM'>(editWebsite?.iconType || 'FAVICON')
  const [customIconPath, setCustomIconPath] = useState<string | undefined>(editWebsite?.customIconPath || undefined)

  const createMutation = useCreateWebsite()
  const updateMutation = useUpdateWebsite()

  const isLoading = createMutation.isPending || updateMutation.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !url.trim()) return

    const websiteData = {
      name: name.trim(),
      url: url.trim(),
      description: description.trim() || undefined,
      iconType,
      customIconPath: iconType === 'CUSTOM' ? customIconPath : undefined
    }

    try {
      if (editWebsite) {
        await updateMutation.mutateAsync({
          id: editWebsite.id,
          ...websiteData
        })
      } else {
        await createMutation.mutateAsync(websiteData)
      }

      // 重置表单并关闭对话框
      handleReset()
      setOpen(false)
    } catch (error) {
      console.error('Failed to save website:', error)
      // 错误处理可以在这里添加 toast 通知
    }
  }

  const handleReset = () => {
    setName("")
    setUrl("")
    setDescription("")
    setIconType('FAVICON')
    setCustomIconPath(undefined)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen && editWebsite) {
      setName(editWebsite.name)
      setUrl(editWebsite.url)
      setDescription(editWebsite.description || "")
      setIconType(editWebsite.iconType || 'FAVICON')
      setCustomIconPath(editWebsite.customIconPath || undefined)
    } else if (!newOpen) {
      handleReset()
    }
  }

  const handleIconChange = ({ iconType: newIconType, customIconPath: newCustomIconPath }: { iconType: 'CUSTOM' | 'FAVICON', customIconPath?: string }) => {
    setIconType(newIconType)
    setCustomIconPath(newCustomIconPath)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            {editWebsite ? "编辑网站" : "添加网站"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editWebsite ? "编辑网站" : "添加新网站"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">网站名称</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：Google"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">网站地址</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="例如：google.com 或 https://google.com"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">描述（可选）</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="简短描述这个网站..."
              rows={3}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label>网站图标</Label>
            <IconUpload
              currentIcon={name && url ? {
                name,
                url,
                iconType,
                customIconPath
              } : undefined}
              onIconChange={handleIconChange}
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              取消
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !name.trim() || !url.trim()}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>{editWebsite ? "保存中..." : "添加中..."}</span>
                </div>
              ) : (
                editWebsite ? "保存" : "添加"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
