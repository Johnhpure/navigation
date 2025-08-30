import { useState, useCallback, useEffect, useRef } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'

interface FaviconFetchResult {
  success: boolean
  iconUrl?: string
  method?: string
  error?: string
  cached?: boolean
}

interface AutoFetchIconState {
  iconUrl: string | null
  isLoading: boolean
  error: string | null
  method: string | null
  isCached: boolean
}

interface UseAutoFetchIconOptions {
  enabled?: boolean
  debounceMs?: number
  autoFetch?: boolean
}

export function useAutoFetchIcon(url: string, options: UseAutoFetchIconOptions = {}) {
  const {
    enabled = true,
    debounceMs = 800,
    autoFetch = true
  } = options

  const [state, setState] = useState<AutoFetchIconState>({
    iconUrl: null,
    isLoading: false,
    error: null,
    method: null,
    isCached: false
  })

  // 防抖定时器 - 使用 ref 避免作为依赖项
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  // 手动获取图标的 mutation
  const fetchMutation = useMutation({
    mutationFn: async ({ url, forceRefresh = false }: { url: string; forceRefresh?: boolean }) => {
      const response = await fetch('/api/favicon/fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, forceRefresh }),
      })

      const result: FaviconFetchResult = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch favicon')
      }

      return result
    },
    onMutate: () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
    },
    onSuccess: (data) => {
      setState({
        iconUrl: data.iconUrl || null,
        isLoading: false,
        error: null,
        method: data.method || null,
        isCached: data.cached || false
      })
    },
    onError: (error) => {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        iconUrl: null,
        method: null,
        isCached: false
      }))
    },
  })

  // 稳定 mutation 引用
  const fetchMutationRef = useRef(fetchMutation)
  fetchMutationRef.current = fetchMutation

  // 防抖获取函数
  const debouncedFetch = useCallback((url: string, forceRefresh = false) => {
    if (!enabled || !url.trim()) {
      setState({
        iconUrl: null,
        isLoading: false,
        error: null,
        method: null,
        isCached: false
      })
      return
    }

    // 清除之前的定时器
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    // 设置新的防抖定时器
    const timer = setTimeout(() => {
      fetchMutationRef.current.mutate({ url: url.trim(), forceRefresh })
    }, debounceMs)

    debounceTimer.current = timer
  }, [enabled, debounceMs])

  // 立即获取函数（无防抖）
  const fetchImmediately = useCallback((targetUrl?: string, forceRefresh = false) => {
    const urlToFetch = targetUrl || url
    if (!enabled || !urlToFetch.trim()) return

    // 清除防抖定时器
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
      debounceTimer.current = null
    }

    fetchMutationRef.current.mutate({ url: urlToFetch.trim(), forceRefresh })
  }, [url, enabled])

  // 刷新图标
  const refreshIcon = useCallback(() => {
    fetchImmediately(url, true)
  }, [fetchImmediately, url])

  // 清除状态
  const clearIcon = useCallback(() => {
    setState({
      iconUrl: null,
      isLoading: false,
      error: null,
      method: null,
      isCached: false
    })
    
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
      debounceTimer.current = null
    }
  }, [])

  // 自动获取效果
  useEffect(() => {
    if (autoFetch && url && enabled) {
      // 直接内联防抖逻辑，避免函数依赖
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }

      const timer = setTimeout(() => {
        fetchMutationRef.current.mutate({ url: url.trim(), forceRefresh: false })
      }, debounceMs)

      debounceTimer.current = timer
    } else if (!url) {
      // 直接清除状态，不调用 clearIcon 函数避免循环依赖
      setState({
        iconUrl: null,
        isLoading: false,
        error: null,
        method: null,
        isCached: false
      })
      
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
        debounceTimer.current = null
      }
    }

    // 清理函数
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [url, autoFetch, enabled, debounceMs])

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [])

  return {
    // 状态
    iconUrl: state.iconUrl,
    isLoading: state.isLoading,
    error: state.error,
    method: state.method,
    isCached: state.isCached,
    
    // 操作函数
    fetchIcon: fetchImmediately,
    refreshIcon,
    clearIcon,
    
    // 工具函数
    isValidUrl: (url: string) => {
      try {
        new URL(url.startsWith('http') ? url : `https://${url}`)
        return true
      } catch {
        return false
      }
    }
  }
}

// 批量获取图标的 Hook
export function useBatchFetchIcons() {
  const [results, setResults] = useState<Map<string, AutoFetchIconState>>(new Map())

  const batchFetchMutation = useMutation({
    mutationFn: async (urls: string[]) => {
      const promises = urls.map(async (url) => {
        try {
          const response = await fetch('/api/favicon/fetch', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
          })

          const result: FaviconFetchResult = await response.json()
          return { url, result }
        } catch (error) {
          return {
            url,
            result: {
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error'
            }
          }
        }
      })

      return Promise.all(promises)
    },
    onSuccess: (data) => {
      const newResults = new Map()
      
      data.forEach(({ url, result }) => {
        newResults.set(url, {
          iconUrl: result.iconUrl || null,
          isLoading: false,
          error: result.success ? null : (result.error || 'Unknown error'),
          method: result.method || null,
          isCached: result.cached || false
        })
      })

      setResults(newResults)
    },
  })

  const fetchBatch = useCallback((urls: string[]) => {
    // 设置加载状态
    const loadingResults = new Map()
    urls.forEach(url => {
      loadingResults.set(url, {
        iconUrl: null,
        isLoading: true,
        error: null,
        method: null,
        isCached: false
      })
    })
    setResults(loadingResults)

    // 开始批量获取
    batchFetchMutation.mutate(urls)
  }, [batchFetchMutation])

  return {
    results,
    fetchBatch,
    isLoading: batchFetchMutation.isPending,
    error: batchFetchMutation.error
  }
}

// 图标缓存管理 Hook
export function useFaviconCache() {
  const clearCacheMutation = useMutation({
    mutationFn: async (domain?: string) => {
      const url = domain 
        ? `/api/favicon/fetch?domain=${encodeURIComponent(domain)}`
        : '/api/favicon/fetch'
      
      const response = await fetch(url, {
        method: 'DELETE',
      })

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to clear cache')
      }

      return result
    },
  })

  const clearCache = useCallback((domain?: string) => {
    clearCacheMutation.mutate(domain)
  }, [clearCacheMutation])

  return {
    clearCache,
    isClearing: clearCacheMutation.isPending,
    error: clearCacheMutation.error
  }
}
