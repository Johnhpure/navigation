"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 禁用自动重新获取，除非用户明确触发
            refetchOnWindowFocus: false,
            refetchOnMount: true,
            refetchOnReconnect: true,
            retry: (failureCount, error) => {
              // 对于 4xx 错误不重试
              if (error instanceof Error && error.message.includes('4')) {
                return false
              }
              // 最多重试 2 次
              return failureCount < 2
            },
            staleTime: 5 * 60 * 1000, // 5分钟
          },
          mutations: {
            retry: (failureCount, error) => {
              // 对于 4xx 错误不重试
              if (error instanceof Error && error.message.includes('4')) {
                return false
              }
              return failureCount < 1
            },
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
