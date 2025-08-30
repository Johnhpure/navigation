import { NextRequest, NextResponse } from 'next/server'

interface FaviconResult {
  success: boolean
  iconUrl?: string
  method?: string
  error?: string
  cached?: boolean
}

// 缓存存储（生产环境建议使用 Redis）
const faviconCache = new Map<string, { url: string; timestamp: number; method: string }>()
const failureCache = new Map<string, number>()

// 缓存时间配置
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24小时
const FAILURE_CACHE_DURATION = 60 * 60 * 1000 // 1小时

export async function POST(request: NextRequest) {
  try {
    const { url: inputUrl, forceRefresh = false } = await request.json()

    if (!inputUrl) {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      )
    }

    // 标准化URL
    const normalizedUrl = normalizeUrl(inputUrl)
    const domain = extractDomain(normalizedUrl)

    // 检查失败缓存
    if (!forceRefresh) {
      const failureTime = failureCache.get(domain)
      if (failureTime && Date.now() - failureTime < FAILURE_CACHE_DURATION) {
        return NextResponse.json({
          success: false,
          error: 'Recently failed, try again later',
          cached: true
        })
      }
    }

    // 检查成功缓存
    if (!forceRefresh) {
      const cached = faviconCache.get(domain)
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return NextResponse.json({
          success: true,
          iconUrl: cached.url,
          method: cached.method,
          cached: true
        })
      }
    }

    // 尝试多种方法获取图标
    const result = await fetchFaviconWithFallback(normalizedUrl, domain)

    if (result.success && result.iconUrl) {
      // 缓存成功结果
      faviconCache.set(domain, {
        url: result.iconUrl,
        timestamp: Date.now(),
        method: result.method || 'unknown'
      })
      // 清除失败缓存
      failureCache.delete(domain)
    } else {
      // 缓存失败结果
      failureCache.set(domain, Date.now())
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Favicon fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function fetchFaviconWithFallback(url: string, domain: string): Promise<FaviconResult> {
  const methods = [
    // 方法1: Google Favicon API
    () => fetchFromGoogleFavicon(domain),
    // 方法2: Favicon.io API  
    () => fetchFromFaviconIO(domain),
    // 方法3: 直接访问 favicon.ico
    () => fetchDirectFavicon(domain),
    // 方法4: 解析HTML获取favicon链接
    () => fetchFromHtmlParsing(url),
    // 方法5: 使用其他公共API
    () => fetchFromAlternativeAPI(domain)
  ]

  for (let i = 0; i < methods.length; i++) {
    try {
      const result = await methods[i]()
      if (result.success && result.iconUrl) {
        return { ...result, method: `method_${i + 1}` }
      }
    } catch (error) {
      console.warn(`Favicon method ${i + 1} failed:`, error)
    }
  }

  return {
    success: false,
    error: 'All favicon fetch methods failed'
  }
}

async function fetchFromGoogleFavicon(domain: string): Promise<FaviconResult> {
  const apiUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
  
  try {
    const response = await fetch(apiUrl, {
      method: 'HEAD',
      timeout: 5000
    } as any)

    if (response.ok) {
      return {
        success: true,
        iconUrl: apiUrl,
        method: 'google_favicon'
      }
    }
  } catch (error) {
    // Google API 很少失败，如果失败通常是网络问题
  }

  return { success: false, error: 'Google Favicon API failed' }
}

async function fetchFromFaviconIO(domain: string): Promise<FaviconResult> {
  const apiUrl = `https://favicon.io/favicon/${domain}`
  
  try {
    const response = await fetch(apiUrl, {
      method: 'HEAD',
      timeout: 5000
    } as any)

    if (response.ok) {
      return {
        success: true,
        iconUrl: apiUrl,
        method: 'favicon_io'
      }
    }
  } catch (error) {
    // Favicon.io 失败
  }

  return { success: false, error: 'Favicon.io API failed' }
}

async function fetchDirectFavicon(domain: string): Promise<FaviconResult> {
  const faviconUrl = `https://${domain}/favicon.ico`
  
  try {
    const response = await fetch(faviconUrl, {
      method: 'HEAD',
      timeout: 5000
    } as any)

    if (response.ok && response.headers.get('content-type')?.includes('image')) {
      return {
        success: true,
        iconUrl: faviconUrl,
        method: 'direct_favicon'
      }
    }
  } catch (error) {
    // 直接访问失败
  }

  return { success: false, error: 'Direct favicon access failed' }
}

async function fetchFromHtmlParsing(url: string): Promise<FaviconResult> {
  try {
    const response = await fetch(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; FaviconBot/1.0)'
      }
    } as any)

    if (!response.ok) {
      return { success: false, error: 'Failed to fetch HTML' }
    }

    const html = await response.text()
    
    // 解析HTML寻找favicon链接
    const faviconRegex = /<link[^>]*rel=["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]*href=["']([^"']+)["']/gi
    const matches = html.match(faviconRegex)

    if (matches && matches.length > 0) {
      // 提取第一个匹配的href
      const hrefMatch = matches[0].match(/href=["']([^"']+)["']/)
      if (hrefMatch) {
        let iconUrl = hrefMatch[1]
        
        // 处理相对路径
        if (iconUrl.startsWith('/')) {
          const urlObj = new URL(url)
          iconUrl = `${urlObj.protocol}//${urlObj.host}${iconUrl}`
        } else if (!iconUrl.startsWith('http')) {
          const urlObj = new URL(url)
          iconUrl = `${urlObj.protocol}//${urlObj.host}/${iconUrl}`
        }

        // 验证图标URL是否可访问
        const iconResponse = await fetch(iconUrl, {
          method: 'HEAD',
          timeout: 5000
        } as any)

        if (iconResponse.ok) {
          return {
            success: true,
            iconUrl,
            method: 'html_parsing'
          }
        }
      }
    }
  } catch (error) {
    console.warn('HTML parsing failed:', error)
  }

  return { success: false, error: 'HTML parsing failed' }
}

async function fetchFromAlternativeAPI(domain: string): Promise<FaviconResult> {
  // 使用 DuckDuckGo 的 favicon API 作为备选
  const apiUrl = `https://icons.duckduckgo.com/ip3/${domain}.ico`
  
  try {
    const response = await fetch(apiUrl, {
      method: 'HEAD',
      timeout: 5000
    } as any)

    if (response.ok) {
      return {
        success: true,
        iconUrl: apiUrl,
        method: 'duckduckgo_favicon'
      }
    }
  } catch (error) {
    // DuckDuckGo API 失败
  }

  return { success: false, error: 'Alternative API failed' }
}

function normalizeUrl(url: string): string {
  // 移除协议前缀，统一处理
  let normalized = url.trim().toLowerCase()
  if (normalized.startsWith('http://')) {
    normalized = normalized.slice(7)
  } else if (normalized.startsWith('https://')) {
    normalized = normalized.slice(8)
  }
  
  // 移除末尾斜杠
  if (normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1)
  }

  return `https://${normalized}`
}

function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname
  } catch {
    // 如果URL解析失败，尝试简单提取
    const match = url.match(/^https?:\/\/([^\/]+)/)
    return match ? match[1] : url
  }
}

// GET /api/favicon/fetch - 清除缓存
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const domain = searchParams.get('domain')

    if (domain) {
      faviconCache.delete(domain)
      failureCache.delete(domain)
      return NextResponse.json({ success: true, message: `Cache cleared for ${domain}` })
    } else {
      faviconCache.clear()
      failureCache.clear()
      return NextResponse.json({ success: true, message: 'All caches cleared' })
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to clear cache' },
      { status: 500 }
    )
  }
}
