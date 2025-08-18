"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"

interface Website {
  id: string
  name: string
  url: string
  description?: string
}

interface AddWebsiteDialogProps {
  onAdd: (website: Omit<Website, "id">) => void
  editWebsite?: Website
  onEdit?: (website: Website) => void
}

export function AddWebsiteDialog({ onAdd, editWebsite, onEdit }: AddWebsiteDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(editWebsite?.name || "")
  const [url, setUrl] = useState(editWebsite?.url || "")
  const [description, setDescription] = useState(editWebsite?.description || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !url.trim()) return

    let formattedUrl = url.trim()
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = "https://" + formattedUrl
    }

    if (editWebsite && onEdit) {
      onEdit({
        ...editWebsite,
        name: name.trim(),
        url: formattedUrl,
        description: description.trim() || undefined,
      })
    } else {
      onAdd({
        name: name.trim(),
        url: formattedUrl,
        description: description.trim() || undefined,
      })
    }

    setName("")
    setUrl("")
    setDescription("")
    setOpen(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen && editWebsite) {
      setName(editWebsite.name)
      setUrl(editWebsite.url)
      setDescription(editWebsite.description || "")
    } else if (!newOpen) {
      setName("")
      setUrl("")
      setDescription("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          {editWebsite ? "编辑网站" : "添加网站"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editWebsite ? "编辑网站" : "添加新网站"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">网站名称</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：Google"
              required
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
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button type="submit">{editWebsite ? "保存" : "添加"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
