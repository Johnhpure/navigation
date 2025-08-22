import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const AUTH_QUERY_KEY = ['auth']

interface LoginData {
  password: string
}

interface AuthResponse {
  success: boolean
  isAuthenticated?: boolean
  message?: string
  error?: string
}

// 验证当前认证状态
export function useAuth() {
  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async (): Promise<boolean> => {
      try {
        const response = await fetch('/api/auth/verify')
        const result: AuthResponse = await response.json()
        return result.isAuthenticated || false
      } catch (error) {
        return false
      }
    },
    staleTime: 5 * 60 * 1000, // 5分钟
    gcTime: 10 * 60 * 1000, // 10分钟
  })
}

// 登录
export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: LoginData): Promise<AuthResponse> => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Login failed')
      }
      
      return result
    },
    onSuccess: () => {
      // 更新认证状态
      queryClient.setQueryData(AUTH_QUERY_KEY, true)
    },
  })
}

// 登出
export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (): Promise<AuthResponse> => {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Logout failed')
      }
      
      return result
    },
    onSuccess: () => {
      // 更新认证状态
      queryClient.setQueryData(AUTH_QUERY_KEY, false)
    },
  })
}
