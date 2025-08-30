export interface Website {
  id: string
  name: string
  url: string
  description?: string
  iconType: 'FAVICON' | 'CUSTOM' | 'DEFAULT' | 'AUTO_FETCHED' | 'LIBRARY'
  customIconPath?: string | null
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateWebsiteData {
  name: string
  url: string
  description?: string
  iconType?: 'FAVICON' | 'CUSTOM' | 'DEFAULT' | 'AUTO_FETCHED' | 'LIBRARY'
  customIconPath?: string
  sortOrder?: number
}

export interface UpdateWebsiteData extends CreateWebsiteData {
  id: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

class ApiClient {
  private baseUrl = '/api'

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`)
      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      }
    }
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: data ? JSON.stringify(data) : undefined
      })
      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      }
    }
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      }
    }
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE'
      })
      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      }
    }
  }

  // 网站相关 API
  async getWebsites(): Promise<ApiResponse<Website[]>> {
    return this.get('/websites')
  }

  async getWebsite(id: string): Promise<ApiResponse<Website>> {
    return this.get(`/websites/${id}`)
  }

  async createWebsite(data: CreateWebsiteData): Promise<ApiResponse<Website>> {
    return this.post('/websites', data)
  }

  async updateWebsite(data: UpdateWebsiteData): Promise<ApiResponse<Website>> {
    const { id, ...updateData } = data
    return this.put(`/websites/${id}`, updateData)
  }

  async deleteWebsite(id: string): Promise<ApiResponse<void>> {
    return this.delete(`/websites/${id}`)
  }

  // 数据迁移 API
  async migrateFromLocalStorage(websites: any[], adminPassword: string): Promise<ApiResponse<Website[]>> {
    return this.post('/migrate', { websites, adminPassword })
  }

  // 健康检查 API
  async healthCheck(): Promise<ApiResponse<any>> {
    return this.get('/health')
  }
}

export const apiClient = new ApiClient()
