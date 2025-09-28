import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/utils/api-client'
import type {
  Series,
  SeriesFilters,
  SeriesProgress,
  SeriesRecommendation,
  SeriesAnalytics,
  SeriesCategory,
  SeriesStatus,
  SeriesArticle
} from '@/types'

// API Response interfaces
interface SeriesResponse {
  series: Series[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
}

interface CreateSeriesData {
  name: string
  slug: string
  description?: string
  coverImageUrl?: string
  category: SeriesCategory
  totalPlannedArticles?: number
  tags?: string[]
}

interface UpdateSeriesData {
  name?: string
  slug?: string
  description?: string
  coverImageUrl?: string
  category?: SeriesCategory
  status?: SeriesStatus
  totalPlannedArticles?: number
  tags?: string[]
}

interface ReorderData {
  articleOrders: Array<{
    articleId: string
    seriesPart: number
  }>
}

// Query Keys
export const seriesKeys = {
  all: ['series'] as const,
  lists: () => [...seriesKeys.all, 'list'] as const,
  list: (filters: SeriesFilters) => [...seriesKeys.lists(), filters] as const,
  details: () => [...seriesKeys.all, 'detail'] as const,
  detail: (id: string) => [...seriesKeys.details(), id] as const,
  progress: (seriesId: string, userId: string) => [...seriesKeys.all, 'progress', seriesId, userId] as const,
  recommendations: (userId: string) => [...seriesKeys.all, 'recommendations', userId] as const,
  analytics: (seriesId: string) => [...seriesKeys.all, 'analytics', seriesId] as const,
  popular: () => [...seriesKeys.all, 'popular'] as const,
  category: (category: SeriesCategory) => [...seriesKeys.all, 'category', category] as const,
}

// Get all series with filtering
export function useSeries(filters: SeriesFilters) {
  return useQuery({
    queryKey: seriesKeys.list(filters),
    queryFn: async (): Promise<SeriesResponse> => {
      const params = new URLSearchParams()
      params.append('page', filters.page.toString())
      params.append('limit', filters.limit.toString())

      if (filters.category) params.append('category', filters.category)
      if (filters.status) params.append('status', filters.status)
      if (filters.search) params.append('search', filters.search)
      if (filters.sortBy) params.append('sortBy', filters.sortBy)
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder)

      const response = await apiClient.get(`/series?${params.toString()}`)
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get popular series
export function usePopularSeries(limit = 10) {
  return useQuery({
    queryKey: seriesKeys.popular(),
    queryFn: async (): Promise<Series[]> => {
      const response = await apiClient.get(`/series/popular?limit=${limit}`)
      return response.data
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  })
}

// Get series by category
export function useSeriesByCategory(category: SeriesCategory, page = 1, limit = 10) {
  return useQuery({
    queryKey: seriesKeys.category(category),
    queryFn: async (): Promise<SeriesResponse> => {
      const response = await apiClient.get(`/series/category/${category}?page=${page}&limit=${limit}`)
      return response.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Get series by ID or slug
export function useSeriesDetail(identifier: string, includeArticles = true) {
  return useQuery({
    queryKey: seriesKeys.detail(identifier),
    queryFn: async (): Promise<Series> => {
      const params = includeArticles ? '?articles=true' : '?articles=false'
      const response = await apiClient.get(`/series/${identifier}${params}`)
      return response.data
    },
    enabled: !!identifier,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Get user progress in series (requires auth)
export function useSeriesProgress(seriesId: string, enabled = true) {
  return useQuery({
    queryKey: seriesKeys.progress(seriesId, 'current'),
    queryFn: async (): Promise<SeriesProgress> => {
      const response = await apiClient.get(`/series/${seriesId}/progress`)
      return response.data
    },
    enabled: enabled && !!seriesId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Continue reading series (requires auth)
export function useContinueSeriesReading(seriesId: string) {
  return useQuery({
    queryKey: [...seriesKeys.detail(seriesId), 'continue'],
    queryFn: async () => {
      const response = await apiClient.get(`/series/${seriesId}/continue`)
      return response.data
    },
    enabled: !!seriesId,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

// Get series analytics (Admin only)
export function useSeriesAnalytics(seriesId: string, enabled = true) {
  return useQuery({
    queryKey: seriesKeys.analytics(seriesId),
    queryFn: async (): Promise<SeriesAnalytics> => {
      const response = await apiClient.get(`/series/${seriesId}/analytics`)
      return response.data
    },
    enabled: enabled && !!seriesId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get series recommendations (requires auth)
export function useSeriesRecommendations(limit = 5) {
  return useQuery({
    queryKey: seriesKeys.recommendations('current'),
    queryFn: async (): Promise<SeriesRecommendation[]> => {
      const response = await apiClient.get(`/series/recommendations?limit=${limit}`)
      return response.data
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

// Mutations for CRUD operations (Admin/Coach only)
export function useCreateSeries() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateSeriesData): Promise<Series> => {
      const response = await apiClient.post('/series', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: seriesKeys.lists() })
      queryClient.invalidateQueries({ queryKey: seriesKeys.popular() })
    }
  })
}

export function useUpdateSeries() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateSeriesData }): Promise<Series> => {
      const response = await apiClient.put(`/series/${id}`, data)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: seriesKeys.lists() })
      queryClient.invalidateQueries({ queryKey: seriesKeys.detail(data.id) })
      queryClient.invalidateQueries({ queryKey: seriesKeys.popular() })
    }
  })
}

export function useDeleteSeries() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.delete(`/series/${id}`)
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: seriesKeys.lists() })
      queryClient.removeQueries({ queryKey: seriesKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: seriesKeys.popular() })
    }
  })
}

// Article management within series
export function useAddArticleToSeries() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      seriesId,
      articleId,
      seriesPart
    }: {
      seriesId: string
      articleId: string
      seriesPart: number
    }) => {
      const response = await apiClient.post(`/series/${seriesId}/articles/${articleId}`, {
        seriesPart
      })
      return response.data
    },
    onSuccess: (_, { seriesId }) => {
      queryClient.invalidateQueries({ queryKey: seriesKeys.detail(seriesId) })
      queryClient.invalidateQueries({ queryKey: seriesKeys.lists() })
    }
  })
}

export function useRemoveArticleFromSeries() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (articleId: string) => {
      const response = await apiClient.delete(`/series/articles/${articleId}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: seriesKeys.lists() })
      queryClient.invalidateQueries({ queryKey: seriesKeys.details() })
    }
  })
}

export function useReorderSeriesArticles() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ seriesId, data }: { seriesId: string; data: ReorderData }) => {
      const response = await apiClient.put(`/series/${seriesId}/reorder`, data)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: seriesKeys.detail(data.id) })
      queryClient.invalidateQueries({ queryKey: seriesKeys.lists() })
    }
  })
}

// Track progress when reading article in series
export function useTrackSeriesProgress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      seriesId,
      articleId,
      seriesPart,
      completed = false
    }: {
      seriesId: string
      articleId: string
      seriesPart: number
      completed?: boolean
    }) => {
      const response = await apiClient.post(`/series/${seriesId}/progress`, {
        articleId,
        seriesPart,
        completed
      })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: seriesKeys.progress(variables.seriesId, 'current') })
      queryClient.invalidateQueries({ queryKey: [...seriesKeys.detail(variables.seriesId), 'continue'] })
    }
  })
}