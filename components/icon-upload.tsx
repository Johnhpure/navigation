"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, Image as ImageIcon, RefreshCw, Zap, AlertCircle, CheckCircle2, Grid3X3 } from "lucide-react"
import { WebsiteIcon } from "./website-icon"
import { useAutoFetchIcon } from "@/lib/hooks/useAutoFetchIcon"
import { IconSelectorTrigger } from "./icon-selector"
import { IconLibraryItem } from "@/lib/icon-library"

interface IconUploadProps {
  currentIcon?: {
    iconType?: 'FAVICON' | 'CUSTOM' | 'DEFAULT' | 'AUTO_FETCHED' | 'LIBRARY'
    customIconPath?: string | null
    name: string
    url: string
  }
  onIconChange: (iconData: { 
    iconType: 'CUSTOM' | 'FAVICON' | 'DEFAULT' | 'AUTO_FETCHED' | 'LIBRARY', 
    customIconPath?: string 
  }) => void
  disabled?: boolean
  // 新增属性
  enableAutoFetch?: boolean
  showAutoFetchStatus?: boolean
  enableIconLibrary?: boolean
}

export function IconUpload({ 
  currentIcon, 
  onIconChange, 
  disabled,
  enableAutoFetch = true,
  showAutoFetchStatus = true,
  enableIconLibrary = true
}: IconUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 自动获取图标
  const {
    iconUrl: autoFetchedIconUrl,
    isLoading: isAutoFetching,
    error: autoFetchError,
    method: fetchMethod,
    isCached,
    fetchIcon,
    refreshIcon,
    clearIcon,
    isValidUrl
  } = useAutoFetchIcon(currentIcon?.url || '', {
    enabled: enableAutoFetch,
    autoFetch: enableAutoFetch
  })

  // 当自动获取成功时，更新图标
  useEffect(() => {
    if (autoFetchedIconUrl && enableAutoFetch && !preview) {
      // 只有在没有自定义上传图标的情况下才使用自动获取的图标
      if (!currentIcon?.customIconPath || currentIcon.iconType !== 'CUSTOM') {
        onIconChange({
          iconType: 'AUTO_FETCHED',
          customIconPath: autoFetchedIconUrl
        })
      }
    }
  }, [autoFetchedIconUrl, enableAutoFetch, preview, currentIcon?.customIconPath, currentIcon?.iconType, onIconChange])

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
    clearIcon()
    onIconChange({ iconType: 'FAVICON' })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRefreshAutoFetch = () => {
    if (currentIcon?.url) {
      refreshIcon()
    }
  }

  const handleUseAutoFetched = () => {
    if (autoFetchedIconUrl) {
      setPreview(null)
      onIconChange({
        iconType: 'AUTO_FETCHED',
        customIconPath: autoFetchedIconUrl
      })
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSelectLibraryIcon = (icon: IconLibraryItem) => {
    setPreview(null)
    clearIcon()
    
    // 将 SVG 转换为 data URL
    const svgDataUrl = `data:image/svg+xml;base64,${btoa(icon.svg)}`
    
    onIconChange({
      iconType: 'LIBRARY',
      customIconPath: svgDataUrl
    })
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // 确定当前显示的图标数据
  const getCurrentIconData = () => {
    if (preview) {
      return { ...currentIcon, iconType: 'CUSTOM' as const, customIconPath: preview }
    }
    
    if (currentIcon?.iconType === 'AUTO_FETCHED' && currentIcon.customIconPath) {
      return currentIcon
    }

    if (currentIcon?.iconType === 'LIBRARY' && currentIcon.customIconPath) {
      return currentIcon
    }

    if (autoFetchedIconUrl && enableAutoFetch && !['CUSTOM', 'LIBRARY'].includes(currentIcon?.iconType || '')) {
      return { ...currentIcon, iconType: 'AUTO_FETCHED' as const, customIconPath: autoFetchedIconUrl }
    }

    return currentIcon
  }

  const currentIconData = getCurrentIconData()

  return (
    <div className="space-y-4">
      {/* 自动获取状态显示 */}
      {showAutoFetchStatus && enableAutoFetch && currentIcon?.url && (
        <div className="flex items-center space-x-2 text-sm">
          {isAutoFetching ? (
            <>
              <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
              <span className="text-muted-foreground">正在自动获取图标...</span>
            </>
          ) : autoFetchedIconUrl ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-green-600">
                自动获取成功 ({fetchMethod}) {isCached && '(缓存)'}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRefreshAutoFetch}
                className="h-6 px-2 ml-2"
              >
                <RefreshCw className="w-3 h-3" />
              </Button>
            </>
          ) : autoFetchError ? (
            <>
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span className="text-amber-600">
                自动获取失败，可选择手动上传或使用图标库
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRefreshAutoFetch}
                className="h-6 px-2 ml-2"
              >
                <RefreshCw className="w-3 h-3" />
              </Button>
            </>
          ) : null}
        </div>
      )}

      <div className="flex items-center space-x-4">
        {/* 当前图标预览 */}
        <div className="flex-shrink-0 relative">
          {currentIconData && (
            <>
              <WebsiteIcon 
                website={currentIconData}
                size={48}
                className="border-2 border-border rounded-lg p-1"
              />
              {currentIconData.iconType === 'AUTO_FETCHED' && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <Zap className="w-2 h-2 text-white" />
                </div>
              )}
            </>
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
      <div className="flex items-center space-x-2 flex-wrap">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={resetToFavicon}
          disabled={disabled || (!preview && !autoFetchedIconUrl && currentIcon?.iconType === 'FAVICON')}
        >
          <X className="w-4 h-4 mr-2" />
          使用默认图标
        </Button>

        {autoFetchedIconUrl && currentIcon?.iconType !== 'AUTO_FETCHED' && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleUseAutoFetched}
            disabled={disabled}
            className="border-green-500/50 text-green-600 hover:bg-green-500/10"
          >
            <Zap className="w-4 h-4 mr-2" />
            使用自动获取
          </Button>
        )}

        {enableIconLibrary && (
          <IconSelectorTrigger
            onSelectIcon={handleSelectLibraryIcon}
            currentUrl={currentIcon?.url}
            disabled={disabled}
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              className="border-blue-500/50 text-blue-600 hover:bg-blue-500/10"
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              选择图标
            </Button>
          </IconSelectorTrigger>
        )}
        
        {/* 状态指示 */}
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          {currentIcon?.iconType === 'CUSTOM' && preview && (
            <span className="flex items-center">
              <Upload className="w-3 h-3 mr-1" />
              自定义上传
            </span>
          )}
          {currentIcon?.iconType === 'AUTO_FETCHED' && (
            <span className="flex items-center text-green-600">
              <Zap className="w-3 h-3 mr-1" />
              自动获取 ({fetchMethod})
            </span>
          )}
          {currentIcon?.iconType === 'LIBRARY' && (
            <span className="flex items-center text-blue-600">
              <Grid3X3 className="w-3 h-3 mr-1" />
              图标库
            </span>
          )}
          {currentIcon?.iconType === 'FAVICON' && (
            <span className="flex items-center">
              <ImageIcon className="w-3 h-3 mr-1" />
              默认图标
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
