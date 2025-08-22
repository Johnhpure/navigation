import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, Website, CreateWebsiteData, UpdateWebsiteData } from '@/lib/api'

export const WEBSITES_QUERY_KEY = ['websites']

// 获取所有网站
export function useWebsites() {
  return useQuery({
    queryKey: WEBSITES_QUERY_KEY,
    queryFn: async () => {
      const result = await apiClient.getWebsites()
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch websites')
      }
      return result.data || []
    },
    staleTime: 5 * 60 * 1000, // 5分钟内数据被认为是新鲜的
    gcTime: 10 * 60 * 1000, // 10分钟后清理缓存
  })
}

// 获取单个网站
export function useWebsite(id: string) {
  return useQuery({
    queryKey: ['website', id],
    queryFn: async () => {
      const result = await apiClient.getWebsite(id)
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch website')
      }
      return result.data
    },
    enabled: !!id,
  })
}

// 创建网站
export function useCreateWebsite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateWebsiteData) => {
      const result = await apiClient.createWebsite(data)
      if (!result.success) {
        throw new Error(result.error || 'Failed to create website')
      }
      return result.data
    },
    onSuccess: () => {
      // 重新获取网站列表
      queryClient.invalidateQueries({ queryKey: WEBSITES_QUERY_KEY })
    },
  })
}

// 更新网站
export function useUpdateWebsite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateWebsiteData) => {
      const result = await apiClient.updateWebsite(data)
      if (!result.success) {
        throw new Error(result.error || 'Failed to update website')
      }
      return result.data
    },
    onSuccess: (data) => {
      // 更新缓存中的网站列表
      queryClient.invalidateQueries({ queryKey: WEBSITES_QUERY_KEY })
      // 更新单个网站缓存
      if (data) {
        queryClient.setQueryData(['website', data.id], data)
      }
    },
  })
}

// 删除网站
export function useDeleteWebsite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await apiClient.deleteWebsite(id)
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete website')
      }
      return id
    },
    onSuccess: () => {
      // 重新获取网站列表
      queryClient.invalidateQueries({ queryKey: WEBSITES_QUERY_KEY })
    },
  })
}

// 数据迁移
export function useMigrateWebsites() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ websites, adminPassword }: { websites: any[], adminPassword: string }) => {
      const result = await apiClient.migrateFromLocalStorage(websites, adminPassword)
      if (!result.success) {
        throw new Error(result.error || 'Failed to migrate websites')
      }
      return result.data
    },
    onSuccess: () => {
      // 重新获取网站列表
      queryClient.invalidateQueries({ queryKey: WEBSITES_QUERY_KEY })
    },
  })
}
