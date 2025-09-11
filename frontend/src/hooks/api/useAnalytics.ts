import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/utils/api-client'

// Types for analytics data
export interface DashboardMetrics {
  totalArticles: number
  totalUsers: number
  totalViews: number
  popularArticles: Array<{
    id: string
    title: string
    views: number
    category: string
  }>
  userActivity: {
    daily: number[]
    weekly: number[]
    monthly: number[]
  }
  contentMetrics: {
    avgReadTime: number
    bounceRate: number
    conversionRate: number
  }
}

export interface UserActivity {
  userId: string
  totalViews: number
  articlesRead: number
  avgSessionTime: number
  lastActive: string
  favoriteCategories: string[]
  readingProgress: Array<{
    articleId: string
    progress: number
    lastRead: string
  }>
}

export interface ArticleAnalytics {
  articleId: string
  title: string
  totalViews: number
  uniqueViews: number
  avgReadTime: number
  completionRate: number
  shareCount: number
  likeCount: number
  viewsOverTime: Array<{
    date: string
    views: number
  }>
  demographicData: {
    ageGroups: Record<string, number>
    locations: Record<string, number>
    devices: Record<string, number>
  }
}

export interface PerformanceMetrics {
  systemLoad: {
    cpu: number
    memory: number
    disk: number
  }
  apiMetrics: {
    avgResponseTime: number
    errorRate: number
    requestsPerMinute: number
  }
  databaseMetrics: {
    queryTime: number
    connectionPool: number
    slowQueries: number
  }
  cacheMetrics: {
    hitRate: number
    memoryUsage: number
    evictions: number
  }
}

// Dashboard metrics hook
export const useDashboardMetrics = (dateRange?: string) => {
  return useQuery({
    queryKey: ['analytics', 'dashboard', dateRange],
    queryFn: async () => {
      const params = dateRange ? `?range=${dateRange}` : ''
      const response = await apiClient.get<DashboardMetrics>(`/analytics/dashboard${params}`)
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // 30 seconds for real-time updates
  })
}

// Real-time analytics hook
export const useRealtimeAnalytics = () => {
  return useQuery({
    queryKey: ['analytics', 'realtime'],
    queryFn: async () => {
      const response = await apiClient.get('/analytics/realtime')
      return response.data
    },
    refetchInterval: 10 * 1000, // 10 seconds
    staleTime: 5 * 1000, // 5 seconds
  })
}

// Article-specific analytics
export const useArticleAnalytics = (articleId: string) => {
  return useQuery({
    queryKey: ['analytics', 'article', articleId],
    queryFn: async () => {
      const response = await apiClient.get<ArticleAnalytics>(`/analytics/articles/${articleId}/detailed`)
      return response.data
    },
    enabled: !!articleId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// User activity analytics
export const useUserActivity = (userId: string) => {
  return useQuery({
    queryKey: ['analytics', 'user', userId],
    queryFn: async () => {
      const response = await apiClient.get<UserActivity>(`/analytics/users/${userId}/activity`)
      return response.data
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Performance metrics
export const usePerformanceMetrics = () => {
  return useQuery({
    queryKey: ['analytics', 'performance'],
    queryFn: async () => {
      const response = await apiClient.get<PerformanceMetrics>('/analytics/performance')
      return response.data
    },
    refetchInterval: 60 * 1000, // 1 minute
    staleTime: 30 * 1000, // 30 seconds
  })
}

// Event tracking mutation
export const useTrackEvent = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (eventData: {
      event: string
      userId?: string
      articleId?: string
      metadata?: Record<string, any>
    }) => {
      const response = await apiClient.post('/analytics/track', eventData)
      return response.data
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
  })
}

// Advanced analytics query
export const useAdvancedAnalytics = () => {
  return useMutation({
    mutationFn: async (query: {
      metrics: string[]
      filters: Record<string, any>
      groupBy?: string[]
      timeRange: {
        start: string
        end: string
      }
    }) => {
      const response = await apiClient.post('/analytics/advanced', query)
      return response.data
    },
  })
}

// Data export hook
export const useExportAnalytics = () => {
  return useMutation({
    mutationFn: async (params: {
      type: 'dashboard' | 'articles' | 'users' | 'performance'
      format: 'csv' | 'json'
      dateRange?: string
      filters?: Record<string, any>
    }) => {
      const response = await apiClient.get('/analytics/export', {
        params,
        responseType: 'blob'
      })
      
      // Create download link
      const blob = new Blob([response.data])
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `analytics-${params.type}-${new Date().toISOString().split('T')[0]}.${params.format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      return response.data
    },
  })
}