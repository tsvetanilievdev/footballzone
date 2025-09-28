import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiService } from '@/services/api'

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

// Dashboard metrics hook with time period support
export const useDashboardMetrics = (params?: {
  startDate?: string
  endDate?: string
  period?: 'day' | 'week' | 'month' | 'year'
}) => {
  return useQuery({
    queryKey: ['analytics', 'dashboard', params],
    queryFn: () => apiService.getAnalyticsDashboard(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
    refetchOnWindowFocus: true,
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
  })
}

// Real-time analytics hook
export const useRealtimeAnalytics = () => {
  return useQuery({
    queryKey: ['analytics', 'realtime'],
    queryFn: () => apiService.getRealTimeAnalytics(),
    staleTime: 30 * 1000,     // 30 seconds
    gcTime: 5 * 60 * 1000,    // 5 minutes
    refetchInterval: 30 * 1000, // Update every 30 seconds
    refetchOnWindowFocus: true,
  })
}

// Article-specific analytics
export const useArticleAnalytics = (articleId: string, params?: {
  startDate?: string
  endDate?: string
}) => {
  return useQuery({
    queryKey: ['analytics', 'articles', articleId, params],
    queryFn: () => apiService.getArticleAnalytics(articleId, params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000,   // 30 minutes
    enabled: !!articleId,     // Only fetch if articleId is provided
  })
}

// User activity analytics
export const useUserActivity = (userId: string, params?: {
  startDate?: string
  endDate?: string
}) => {
  return useQuery({
    queryKey: ['analytics', 'users', userId, 'activity', params],
    queryFn: () => apiService.getUserActivity(userId, params),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 60 * 60 * 1000,    // 1 hour
    enabled: !!userId,         // Only fetch if userId is provided
  })
}

// Performance metrics
export const usePerformanceMetrics = () => {
  return useQuery({
    queryKey: ['analytics', 'performance'],
    queryFn: () => apiService.getPerformanceMetrics(),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 10 * 60 * 1000,   // 10 minutes
    refetchInterval: 2 * 60 * 1000, // Update every 2 minutes
  })
}

// Event tracking mutation
export const useTrackEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      action,
      resourceType,
      resourceId,
      metadata
    }: {
      action: string
      resourceType?: string
      resourceId?: string
      metadata?: any
    }) => apiService.trackEvent(action, resourceType, resourceId, metadata),
    onSuccess: () => {
      // Invalidate analytics queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
    // Silent mutation - don't show loading/error states to user
    meta: {
      silent: true
    }
  })
}

// Advanced analytics query
export const useAdvancedAnalytics = (params: {
  metric: 'user_retention' | 'content_performance' | 'engagement_funnel' | 'revenue_analytics'
  groupBy?: string
  startDate?: string
  endDate?: string
  filters?: Record<string, any>
}) => {
  return useQuery({
    queryKey: ['analytics', 'advanced', params],
    queryFn: () => apiService.getAdvancedAnalytics(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 60 * 60 * 1000,    // 1 hour
    enabled: !!params.metric,  // Only fetch if metric is specified
  })
}

// Data export hook
export const useExportAnalytics = () => {
  return useMutation({
    mutationFn: ({
      type,
      format = 'json'
    }: {
      type: 'dashboard' | 'articles' | 'users'
      format?: 'json' | 'csv'
    }) => apiService.exportAnalytics(type, format),

    onSuccess: (data, variables) => {
      // Create and trigger download
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: variables.format === 'csv' ? 'text/csv' : 'application/json'
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `analytics-${variables.type}-${new Date().toISOString().split('T')[0]}.${variables.format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  })
}

// Helper hook for time range selection
export const useAnalyticsTimeRange = () => {
  const getTimeRange = (period: 'day' | 'week' | 'month' | 'year'): { startDate: string; endDate: string } => {
    const now = new Date()
    const endDate = now.toISOString().split('T')[0]
    let startDate: string

    switch (period) {
      case 'day':
        startDate = endDate // Same day
        break
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        startDate = weekAgo.toISOString().split('T')[0]
        break
      case 'month':
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        startDate = monthAgo.toISOString().split('T')[0]
        break
      case 'year':
        const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
        startDate = yearAgo.toISOString().split('T')[0]
        break
      default:
        startDate = endDate
    }

    return { startDate, endDate }
  }

  return { getTimeRange }
}