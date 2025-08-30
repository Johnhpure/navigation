"use client"

import { useState } from "react"
import { ExternalLink } from "lucide-react"
import Image from "next/image"

interface WebsiteIconProps {
  website: {
    name: string
    url: string
    iconType?: 'FAVICON' | 'CUSTOM' | 'DEFAULT' | 'AUTO_FETCHED' | 'LIBRARY'
    customIconPath?: string | null
  }
  size?: number
  className?: string
}

export function WebsiteIcon({ website, size = 32, className = "" }: WebsiteIconProps) {
  const [imageError, setImageError] = useState(false)
  const [faviconError, setFaviconError] = useState(false)

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`
    } catch {
      return null
    }
  }

  const getAlternateFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname
      return `https://icon.horse/icon/${domain}`
    } catch {
      return null
    }
  }

  // 自定义图标、图标库图标、自动获取图标优先级最高
  if ((website.iconType === 'CUSTOM' || website.iconType === 'LIBRARY' || website.iconType === 'AUTO_FETCHED') && website.customIconPath && !imageError) {
    return (
      <div className={`relative ${className}`} style={{ width: size, height: size }}>
        <Image
          src={website.customIconPath}
          alt={`${website.name} icon`}
          width={size}
          height={size}
          className="rounded transition-transform duration-300 group-hover:rotate-12"
          onError={() => setImageError(true)}
          style={{ objectFit: 'cover' }}
        />
      </div>
    )
  }

  // Favicon 降级机制
  if (website.iconType === 'FAVICON' || website.iconType === undefined) {
    const faviconUrl = getFaviconUrl(website.url)
    const alternateFaviconUrl = getAlternateFaviconUrl(website.url)

    if (faviconUrl && !faviconError) {
      return (
        <div className={`relative ${className}`} style={{ width: size, height: size }}>
          <img
            src={faviconUrl}
            alt={`${website.name} favicon`}
            width={size}
            height={size}
            className="rounded transition-transform duration-300 group-hover:rotate-12"
            onError={() => {
              setFaviconError(true)
              // 尝试备用 favicon 服务
              if (alternateFaviconUrl) {
                const img = document.createElement('img')
                img.src = alternateFaviconUrl
                img.onload = () => setImageError(false)
                img.onerror = () => setImageError(true)
              }
            }}
            style={{ objectFit: 'cover' }}
          />
        </div>
      )
    }

    // 备用 favicon 服务
    if (alternateFaviconUrl && faviconError && !imageError) {
      return (
        <div className={`relative ${className}`} style={{ width: size, height: size }}>
          <img
            src={alternateFaviconUrl}
            alt={`${website.name} favicon`}
            width={size}
            height={size}
            className="rounded transition-transform duration-300 group-hover:rotate-12"
            onError={() => setImageError(true)}
            style={{ objectFit: 'cover' }}
          />
        </div>
      )
    }
  }

  // 默认图标
  return (
    <div 
      className={`rounded bg-primary/20 flex items-center justify-center transition-transform duration-300 group-hover:rotate-12 ${className}`}
      style={{ width: size, height: size }}
    >
      <ExternalLink 
        className="text-primary group-hover:animate-pulse" 
        size={size * 0.5} 
      />
    </div>
  )
}
