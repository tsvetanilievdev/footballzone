import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiService } from '@/services/api'
import { queryKeys, optimisticUpdateHelpers, invalidateQueries } from '@/lib/react-query'
import type { Article, ArticleZone } from '@/types/articles'

// Types for API parameters
export interface ArticleListParams {
  zone?: ArticleZone
  page?: number
  limit?: number
  featured?: boolean
  latest?: boolean
  category?: string
  author?: string
}

export interface ArticleSearchParams extends ArticleListParams {
  q: string
}

// Hook for fetching article lists
export function useArticles(params: ArticleListParams = {}) {
  return useQuery({
    queryKey: queryKeys.articlesList(params),
    queryFn: () => apiService.getArticles(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000,   // 30 minutes
    enabled: true,
  })
}

// Hook for fetching articles by zone
export function useArticlesByZone(zone: ArticleZone, params: Omit<ArticleListParams, 'zone'> = {}) {
  // Fix for Next.js SSR hydration issue - React Query needs client-side hydration
  const [isClient, setIsClient] = React.useState(false)

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  const query = useQuery({
    queryKey: queryKeys.zoneArticles(zone, params),
    queryFn: async () => {
      const result = await apiService.getArticles({ ...params, zone });
      return result;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: isClient && !!zone, // Enable only after client hydration
    retry: 1,
    retryDelay: 1000,
  });

  return query;
}

// Hook for fetching featured articles
export function useFeaturedArticles(limit: number = 6) {
  const [isClient, setIsClient] = React.useState(false)

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  return useQuery({
    queryKey: queryKeys.articlesList({ featured: true, limit }),
    queryFn: () => apiService.getArticles({ featured: true, limit }),
    staleTime: 10 * 60 * 1000, // 10 minutes for featured content
    gcTime: 60 * 60 * 1000,    // 1 hour
    enabled: isClient, // Enable only after client hydration
  })
}

// Hook for fetching latest articles
export function useLatestArticles(limit: number = 10) {
  return useQuery({
    queryKey: queryKeys.articlesList({ latest: true, limit }),
    queryFn: () => apiService.getArticles({ latest: true, limit }),
    staleTime: 3 * 60 * 1000, // 3 minutes for latest content
    gcTime: 30 * 60 * 1000,
  })
}

// Hook for fetching single article by slug
export function useArticle(slug: string) {
  return useQuery({
    queryKey: queryKeys.articlesDetail(slug),
    queryFn: () => apiService.getArticle(slug),
    staleTime: 10 * 60 * 1000, // 10 minutes for article details
    gcTime: 60 * 60 * 1000,    // 1 hour
    enabled: !!slug,
  })
}

// Hook for fetching single article by ID
export function useArticleById(id: string) {
  return useQuery({
    queryKey: ['articles', 'detail', 'id', id],
    queryFn: () => apiService.getArticleById(id),
    staleTime: 10 * 60 * 1000, // 10 minutes for article details
    gcTime: 60 * 60 * 1000,    // 1 hour
    enabled: !!id,
  })
}

// Hook for article search
export function useArticleSearch(params: ArticleSearchParams) {
  return useQuery({
    queryKey: queryKeys.articlesSearch(params.q, params),
    queryFn: () => apiService.searchArticles(params),
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    gcTime: 15 * 60 * 1000,   // 15 minutes
    enabled: !!params.q && params.q.length >= 2, // Only search with 2+ characters
  })
}

// Hook for tracking article views (analytics)
export function useTrackArticleView() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ articleId, metadata }: { articleId: string; metadata?: any }) =>
      apiService.trackArticleView(articleId, metadata),
    onSuccess: () => {
      // Optionally invalidate analytics queries
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
    onError: (error) => {
      console.warn('Failed to track article view:', error)
      // Don't throw error for analytics - it's not critical
    },
  })
}

// Hook for creating articles (admin/coach only)
export function useCreateArticle() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (articleData: Partial<Article>) => apiService.createArticle(articleData),
    onMutate: async (newArticle) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.articles })
      
      // Add optimistically
      optimisticUpdateHelpers.addArticleOptimistically(newArticle)
      
      return { newArticle }
    },
    onSuccess: (data) => {
      // Invalidate and refetch
      invalidateQueries.articles()
      
      // Update cache with real data
      queryClient.setQueryData(
        queryKeys.articlesDetail(data.slug),
        data
      )
    },
    onError: (error, newArticle, context) => {
      // Revert optimistic update
      queryClient.invalidateQueries({ queryKey: queryKeys.articles })
    },
  })
}

// Hook for updating articles (admin/coach only)
export function useUpdateArticle() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Article> }) =>
      apiService.updateArticle(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.articles })
      
      // Optimistic update
      optimisticUpdateHelpers.updateArticleOptimistically(id, data)
      
      return { id, data }
    },
    onSuccess: (updatedArticle) => {
      // Update specific queries
      queryClient.setQueryData(
        queryKeys.articlesDetail(updatedArticle.slug),
        updatedArticle
      )
      
      // Invalidate lists to refresh
      invalidateQueries.articles()
    },
    onError: (error, variables, context) => {
      // Revert optimistic update
      queryClient.invalidateQueries({ queryKey: queryKeys.articles })
    },
  })
}

// Hook for deleting articles (admin only)
export function useDeleteArticle() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (articleId: string) => apiService.deleteArticle(articleId),
    onMutate: async (articleId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.articles })
      
      // Remove optimistically
      optimisticUpdateHelpers.removeArticleOptimistically(articleId)
      
      return { articleId }
    },
    onSuccess: (_, articleId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.articlesDetail(articleId) })
      
      // Invalidate lists
      invalidateQueries.articles()
    },
    onError: (error, articleId, context) => {
      // Revert optimistic update
      queryClient.invalidateQueries({ queryKey: queryKeys.articles })
    },
  })
}

// Combined hook for article management
export function useArticleManagement() {
  return {
    createArticle: useCreateArticle(),
    updateArticle: useUpdateArticle(),
    deleteArticle: useDeleteArticle(),
    trackView: useTrackArticleView(),
  }
}