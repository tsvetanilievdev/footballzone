import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/utils/api-client'

// Types for series data
export interface Series {
  id: string
  name: string
  slug: string
  description: string | null
  category: 'TACTICS' | 'TECHNIQUE' | 'FITNESS' | 'PSYCHOLOGY' | 'YOUTH_DEVELOPMENT' | 'COACHING'
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
  coverImageUrl: string | null
  tags: string[]
  totalPlannedArticles: number | null
  createdAt: string
  updatedAt: string
  articles?: SeriesArticle[]
  _count?: {
    articles: number
  }
}

export interface SeriesArticle {
  id: string
  title: string
  slug: string
  partNumber: number
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  publishedAt: string | null
  readTime: number
  category: string
}

export interface UserProgress {
  seriesId: string
  userId: string
  currentPartNumber: number
  completedParts: number[]
  progressPercentage: number
  lastReadAt: string
  estimatedTimeRemaining: number
}

export interface SeriesRecommendation {
  series: Series
  score: number
  reasons: string[]
  similarity: number
}

export interface SeriesAnalytics {
  seriesId: string
  totalReaders: number
  completionRate: number
  avgProgressPercentage: number
  dropoffPoints: Array<{
    partNumber: number
    dropoffRate: number
  }>
  engagementMetrics: {
    avgTimePerPart: number
    returnRate: number
    shareRate: number
  }
}

// List series with filtering and pagination
export const useSeries = (params?: {
  category?: string
  status?: string
  search?: string
  page?: number
  limit?: number
}) => {
  return useQuery({
    queryKey: ['series', 'list', params],
    queryFn: async () => {
      const response = await apiClient.get<{
        series: Series[]
        total: number
        pages: number
        currentPage: number
      }>('/series', { params })
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Popular series
export const usePopularSeries = (limit: number = 6) => {
  return useQuery({
    queryKey: ['series', 'popular', limit],
    queryFn: async () => {
      const response = await apiClient.get<Series[]>(`/series/popular?limit=${limit}`)
      return response.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Series by category
export const useSeriesByCategory = (category: string) => {
  return useQuery({
    queryKey: ['series', 'category', category],
    queryFn: async () => {
      const response = await apiClient.get<Series[]>(`/series/category/${category}`)
      return response.data
    },
    enabled: !!category,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Single series details
export const useSeriesDetails = (seriesId: string) => {
  return useQuery({
    queryKey: ['series', 'details', seriesId],
    queryFn: async () => {
      const response = await apiClient.get<Series & { articles: SeriesArticle[] }>(`/series/${seriesId}`)
      return response.data
    },
    enabled: !!seriesId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// User progress for a series
export const useSeriesProgress = (seriesId: string) => {
  return useQuery({
    queryKey: ['series', 'progress', seriesId],
    queryFn: async () => {
      const response = await apiClient.get<UserProgress>(`/series/${seriesId}/progress`)
      return response.data
    },
    enabled: !!seriesId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Continue reading from last position
export const useContinueReading = (seriesId: string) => {
  return useQuery({
    queryKey: ['series', 'continue', seriesId],
    queryFn: async () => {
      const response = await apiClient.get<{
        nextArticle: SeriesArticle
        progress: UserProgress
      }>(`/series/${seriesId}/continue`)
      return response.data
    },
    enabled: !!seriesId,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

// Series analytics (admin/coach only)
export const useSeriesAnalytics = (seriesId: string) => {
  return useQuery({
    queryKey: ['series', 'analytics', seriesId],
    queryFn: async () => {
      const response = await apiClient.get<SeriesAnalytics>(`/series/${seriesId}/analytics`)
      return response.data
    },
    enabled: !!seriesId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// AI-powered series recommendations
export const useSeriesRecommendations = (limit: number = 5) => {
  return useQuery({
    queryKey: ['series', 'recommendations', limit],
    queryFn: async () => {
      const response = await apiClient.get<SeriesRecommendation[]>(`/series/recommendations?limit=${limit}`)
      return response.data
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

// Create series (admin/coach only)
export const useCreateSeries = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (seriesData: {
      name: string
      description?: string
      category: Series['category']
      coverImageUrl?: string
      tags?: string[]
      totalPlannedArticles?: number
    }) => {
      const response = await apiClient.post<Series>('/series', seriesData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['series'] })
    },
  })
}

// Update series (admin/coach only)
export const useUpdateSeries = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string
      updates: Partial<Series> 
    }) => {
      const response = await apiClient.put<Series>(`/series/${id}`, updates)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['series'] })
      queryClient.invalidateQueries({ queryKey: ['series', 'details', variables.id] })
    },
  })
}

// Delete series (admin only)
export const useDeleteSeries = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (seriesId: string) => {
      await apiClient.delete(`/series/${seriesId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['series'] })
    },
  })
}

// Add article to series
export const useAddArticleToSeries = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({
      seriesId,
      articleId,
      partNumber
    }: {
      seriesId: string
      articleId: string
      partNumber?: number
    }) => {
      const response = await apiClient.post(`/series/${seriesId}/articles/${articleId}`, {
        partNumber
      })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['series', 'details', variables.seriesId] })
      queryClient.invalidateQueries({ queryKey: ['series'] })
    },
  })
}

// Remove article from series
export const useRemoveArticleFromSeries = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (articleId: string) => {
      await apiClient.delete(`/series/articles/${articleId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['series'] })
    },
  })
}

// Reorder articles in series (drag-and-drop)
export const useReorderSeriesArticles = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({
      seriesId,
      articleOrder
    }: {
      seriesId: string
      articleOrder: Array<{ articleId: string; partNumber: number }>
    }) => {
      const response = await apiClient.put(`/series/${seriesId}/reorder`, { articleOrder })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['series', 'details', variables.seriesId] })
    },
  })
}

// Track progress when reading article in series
export const useTrackSeriesProgress = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({
      seriesId,
      articleId,
      partNumber,
      completed = false
    }: {
      seriesId: string
      articleId: string
      partNumber: number
      completed?: boolean
    }) => {
      const response = await apiClient.post(`/series/${seriesId}/progress`, {
        articleId,
        partNumber,
        completed
      })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['series', 'progress', variables.seriesId] })
      queryClient.invalidateQueries({ queryKey: ['series', 'continue', variables.seriesId] })
    },
  })
}