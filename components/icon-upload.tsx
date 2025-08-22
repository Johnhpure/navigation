"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { WebsiteIcon } from "./website-icon"

interface IconUploadProps {
  currentIcon?: {
    iconType?: 'FAVICON' | 'CUSTOM' | 'DEFAULT'
    customIconPath?: string | null
    name: string
    url: string
  }
  onIconChange: (iconData: { iconType: 'CUSTOM' | 'FAVICON', customIconPath?: string }) => void
  disabled?: boolean
}

export function IconUpload({ currentIcon, onIconChange, disabled }: IconUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file) return

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件')
      return
    }

    // 验证文件大小 (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('文件大小不能超过 2MB')
      return
    }

    setUploading(true)
    
    try {
      // 创建预览
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)

      // 上传文件
      const formData = new FormData()
      formData.append('icon', file)

      const response = await fetch('/api/upload/icon', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        onIconChange({
          iconType: 'CUSTOM',
          customIconPath: result.data.filePath
        })
      } else {
        alert(result.error || '上传失败')
        setPreview(null)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('上传失败，请重试')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const resetToFavicon = () => {
    setPreview(null)
    onIconChange({ iconType: 'FAVICON' })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const currentIconData = preview ? 
    { ...currentIcon, iconType: 'CUSTOM' as const, customIconPath: preview } : 
    currentIcon

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        {/* 当前图标预览 */}
        <div className="flex-shrink-0">
          {currentIconData && (
            <WebsiteIcon 
              website={currentIconData}
              size={48}
              className="border-2 border-border rounded-lg p-1"
            />
          )}
        </div>

        {/* 上传区域 */}
        <div className="flex-1">
          <div
            className={`
              border-2 border-dashed rounded-lg p-4 text-center transition-colors
              ${dragActive ? 'border-primary bg-primary/10' : 'border-border'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary/50'}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !disabled && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              disabled={disabled}
            />
            
            {uploading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                <span className="text-sm text-muted-foreground">上传中...</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="text-sm">
                  <span className="font-medium text-foreground">点击上传</span>
                  <span className="text-muted-foreground"> 或拖拽图片到此处</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  支持 PNG, JPG, GIF, SVG, ICO 格式，最大 2MB
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={resetToFavicon}
          disabled={disabled || (!preview && currentIcon?.iconType === 'FAVICON')}
        >
          <X className="w-4 h-4 mr-2" />
          使用默认图标
        </Button>
        
        {currentIcon?.iconType === 'CUSTOM' && (
          <div className="text-xs text-muted-foreground">
            使用自定义图标
          </div>
        )}
      </div>
    </div>
  )
}
