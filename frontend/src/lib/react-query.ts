import { QueryClient } from '@tanstack/react-query'

// Create a QueryClient with optimized configuration for FootballZone
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: how long until data is considered stale
      staleTime: 5 * 60 * 1000, // 5 minutes for most data
      
      // Cache time: how long to keep data in cache after components unmount
      gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
      
      // Retry failed requests with exponential backoff
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false
        }
        return failureCount < 3
      },
      
      // Background refetch settings
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      refetchOnReconnect: true,    // Refetch when reconnecting to internet
      refetchOnMount: true,        // Refetch when component mounts
      
      // Network mode - try requests regardless of network status
      networkMode: 'always',
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
      
      // Network mode for mutations
      networkMode: 'always',
    },
  },
})

// Query key factory for consistent cache keys
export const queryKeys = {
  // Articles
  articles: ['articles'] as const,
  articlesList: (params?: Record<string, any>) => 
    [...queryKeys.articles, 'list', params] as const,
  articlesDetail: (slug: string) => 
    [...queryKeys.articles, 'detail', slug] as const,
  articlesSearch: (query: string, params?: Record<string, any>) => 
    [...queryKeys.articles, 'search', query, params] as const,
  
  // Zones
  zones: ['zones'] as const,
  zoneArticles: (zone: string, params?: Record<string, any>) => 
    [...queryKeys.zones, zone, params] as const,
  
  // User
  user: ['user'] as const,
  userProfile: () => [...queryKeys.user, 'profile'] as const,
  
  // Admin
  admin: ['admin'] as const,
  adminArticles: (params?: Record<string, any>) => 
    [...queryKeys.admin, 'articles', params] as const,
}

// Error handling helper
export const handleQueryError = (error: any) => {
  console.error('Query error:', error)
  
  // Log different types of errors
  if (error?.response?.status === 401) {
    console.warn('Authentication required')
  } else if (error?.response?.status === 403) {
    console.warn('Access forbidden')
  } else if (error?.response?.status >= 500) {
    console.error('Server error:', error?.response?.status)
  }
  
  return error
}

// Optimistic update helpers
export const optimisticUpdateHelpers = {
  // Add new article optimistically
  addArticleOptimistically: (newArticle: any) => {
    queryClient.setQueryData(
      queryKeys.articlesList(),
      (oldData: any) => {
        if (!oldData || !oldData.data || !Array.isArray(oldData.data)) {
          return { data: [newArticle], pagination: { total: 1 } }
        }
        return {
          ...oldData,
          data: [newArticle, ...oldData.data],
          pagination: {
            ...oldData.pagination,
            total: oldData.pagination.total + 1,
          },
        }
      }
    )
  },
  
  // Update article optimistically
  updateArticleOptimistically: (articleId: string, updatedData: any) => {
    // Update in article lists
    queryClient.setQueriesData(
      { queryKey: queryKeys.articles },
      (oldData: any) => {
        if (!oldData?.data || !Array.isArray(oldData.data)) return oldData
        return {
          ...oldData,
          data: oldData.data.map((article: any) =>
            article.id === articleId ? { ...article, ...updatedData } : article
          ),
        }
      }
    )
    
    // Update article detail if cached
    queryClient.setQueryData(
      queryKeys.articlesDetail(updatedData.slug || articleId),
      (oldData: any) => oldData ? { ...oldData, ...updatedData } : oldData
    )
  },
  
  // Remove article optimistically
  removeArticleOptimistically: (articleId: string) => {
    queryClient.setQueriesData(
      { queryKey: queryKeys.articles },
      (oldData: any) => {
        if (!oldData?.data || !Array.isArray(oldData.data)) return oldData
        return {
          ...oldData,
          data: oldData.data.filter((article: any) => article.id !== articleId),
          pagination: {
            ...oldData.pagination,
            total: Math.max(0, oldData.pagination.total - 1),
          },
        }
      }
    )
  },
}

// Cache invalidation helpers
export const invalidateQueries = {
  // Invalidate all articles
  articles: () => queryClient.invalidateQueries({ queryKey: queryKeys.articles }),
  
  // Invalidate specific zone articles
  zoneArticles: (zone: string) => 
    queryClient.invalidateQueries({ queryKey: queryKeys.zoneArticles(zone) }),
  
  // Invalidate user data
  user: () => queryClient.invalidateQueries({ queryKey: queryKeys.user }),
  
  // Invalidate admin data
  admin: () => queryClient.invalidateQueries({ queryKey: queryKeys.admin }),
}

export default queryClient