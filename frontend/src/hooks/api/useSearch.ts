import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiService } from '@/services/api'
import { queryKeys } from '@/lib/react-query'
import type { ArticleZone } from '@/types/articles'

// Types for search parameters
export interface SearchParams {
  q: string
  zone?: ArticleZone
  category?: string
  page?: number
  limit?: number
  author?: string
  dateFrom?: string
  dateTo?: string
  premium?: boolean
}

export interface SearchSuggestionParams {
  q: string
  limit?: number
}

// Hook for article search with debouncing
export function useArticleSearch(params: SearchParams) {
  return useQuery({
    queryKey: queryKeys.articlesSearch(params.q, params),
    queryFn: () => apiService.searchArticles(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 15 * 60 * 1000,   // 15 minutes
    enabled: !!params.q && params.q.length >= 2, // Minimum 2 characters
  })
}

// Hook for search suggestions/autocomplete
export function useSearchSuggestions(params: SearchSuggestionParams) {
  return useQuery({
    queryKey: ['search', 'suggestions', params.q, params.limit],
    queryFn: () => apiService.getSearchSuggestions(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000,   // 30 minutes
    enabled: !!params.q && params.q.length >= 1, // Start suggestions after 1 character
  })
}

// Hook for popular search terms
export function usePopularSearches(limit: number = 10) {
  return useQuery({
    queryKey: ['search', 'popular', limit],
    queryFn: () => apiService.getPopularSearches(limit),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  })
}

// Hook for search categories
export function useSearchCategories() {
  return useQuery({
    queryKey: ['search', 'categories'],
    queryFn: () => apiService.getSearchCategories(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  })
}

// Hook for advanced search
export function useAdvancedSearch(params: SearchParams) {
  return useQuery({
    queryKey: ['search', 'advanced', params],
    queryFn: () => apiService.advancedSearch(params),
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 30 * 60 * 1000,   // 30 minutes
    enabled: !!params.q && params.q.length >= 2,
  })
}

// Hook for tracking search queries (analytics)
export function useTrackSearch() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ query, metadata }: { query: string; metadata?: any }) =>
      apiService.trackSearch(query, metadata),
    onSuccess: () => {
      // Invalidate popular searches to update
      queryClient.invalidateQueries({ queryKey: ['search', 'popular'] })
    },
    onError: (error) => {
      console.warn('Failed to track search:', error)
      // Don't throw error for analytics
    },
  })
}

// Hook for saving search queries to user history
export function useSaveSearchHistory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (query: string) => apiService.saveSearchHistory(query),
    onSuccess: () => {
      // Invalidate user search history
      queryClient.invalidateQueries({ queryKey: ['user', 'search-history'] })
    },
  })
}

// Hook for getting user search history
export function useSearchHistory(limit: number = 10) {
  return useQuery({
    queryKey: ['user', 'search-history', limit],
    queryFn: () => apiService.getSearchHistory(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 60 * 60 * 1000,   // 1 hour
  })
}

// Hook for clearing search history
export function useClearSearchHistory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: () => apiService.clearSearchHistory(),
    onSuccess: () => {
      // Clear search history cache
      queryClient.setQueryData(['user', 'search-history'], [])
    },
  })
}

// Combined search management hook
export function useSearchManagement() {
  return {
    search: useArticleSearch,
    suggestions: useSearchSuggestions,
    popular: usePopularSearches(),
    categories: useSearchCategories(),
    trackSearch: useTrackSearch(),
    saveHistory: useSaveSearchHistory(),
    getHistory: useSearchHistory,
    clearHistory: useClearSearchHistory(),
  }
}

// Custom hook for search state management
export function useSearchState() {
  const queryClient = useQueryClient()
  
  const clearSearchCache = () => {
    queryClient.removeQueries({ queryKey: ['search'] })
  }
  
  const prefetchSearch = (query: string, params: SearchParams = { q: query }) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.articlesSearch(query, params),
      queryFn: () => apiService.searchArticles(params),
      staleTime: 2 * 60 * 1000,
    })
  }
  
  return {
    clearSearchCache,
    prefetchSearch,
  }
}