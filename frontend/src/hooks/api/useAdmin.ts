import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiService } from '@/services/api'
import { queryKeys, optimisticUpdateHelpers, invalidateQueries } from '@/lib/react-query'
import type { Article, ArticleTemplate } from '@/types/articles'
import type { User } from '@/types/auth'

// Types for admin operations
export interface AdminArticleListParams {
  page?: number
  limit?: number
  status?: 'draft' | 'published' | 'archived'
  author?: string
  zone?: string
  category?: string
  dateFrom?: string
  dateTo?: string
}

export interface AdminUserListParams {
  page?: number
  limit?: number
  role?: string
  status?: 'active' | 'inactive' | 'banned'
  searchTerm?: string
}

export interface AdminAnalyticsParams {
  period?: 'day' | 'week' | 'month' | 'year'
  startDate?: string
  endDate?: string
  zone?: string
}

// Hook for admin article management
export function useAdminArticles(params: AdminArticleListParams = {}) {
  return useQuery({
    queryKey: queryKeys.adminArticles(params),
    queryFn: () => apiService.getAdminArticles(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 30 * 60 * 1000,   // 30 minutes
  })
}

// Hook for admin article statistics
export function useAdminArticleStats() {
  return useQuery({
    queryKey: ['admin', 'articles', 'stats'],
    queryFn: () => apiService.getAdminArticleStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 60 * 60 * 1000,   // 1 hour
  })
}

// Hook for admin user management
export function useAdminUsers(params: AdminUserListParams = {}) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => apiService.getAdminUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000,   // 30 minutes
  })
}

// Hook for admin user statistics
export function useAdminUserStats() {
  return useQuery({
    queryKey: ['admin', 'users', 'stats'],
    queryFn: () => apiService.getAdminUserStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 60 * 60 * 1000,    // 1 hour
  })
}

// Hook for admin analytics
export function useAdminAnalytics(params: AdminAnalyticsParams = {}) {
  return useQuery({
    queryKey: ['admin', 'analytics', params],
    queryFn: () => apiService.getAdminAnalytics(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 60 * 60 * 1000,   // 1 hour
  })
}

// Hook for article templates management
export function useArticleTemplates() {
  return useQuery({
    queryKey: ['admin', 'templates'],
    queryFn: () => apiService.getArticleTemplates(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  })
}

// Hook for creating article templates
export function useCreateTemplate() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (templateData: Partial<ArticleTemplate>) => 
      apiService.createTemplate(templateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'templates'] })
    },
  })
}

// Hook for updating article templates
export function useUpdateTemplate() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ArticleTemplate> }) =>
      apiService.updateTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'templates'] })
    },
  })
}

// Hook for deleting article templates
export function useDeleteTemplate() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (templateId: string) => apiService.deleteTemplate(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'templates'] })
    },
  })
}

// Hook for bulk article operations
export function useBulkArticleOperations() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ 
      operation, 
      articleIds, 
      data 
    }: { 
      operation: 'publish' | 'archive' | 'delete' | 'update'
      articleIds: string[]
      data?: any 
    }) => apiService.bulkArticleOperation(operation, articleIds, data),
    onSuccess: () => {
      invalidateQueries.articles()
      queryClient.invalidateQueries({ queryKey: ['admin'] })
    },
  })
}

// Hook for user management operations
export function useUserManagement() {
  const queryClient = useQueryClient()
  
  return {
    updateUser: useMutation({
      mutationFn: ({ userId, data }: { userId: string; data: Partial<User> }) =>
        apiService.updateUser(userId, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      },
    }),
    
    banUser: useMutation({
      mutationFn: ({ userId, reason }: { userId: string; reason?: string }) =>
        apiService.banUser(userId, reason),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      },
    }),
    
    unbanUser: useMutation({
      mutationFn: (userId: string) => apiService.unbanUser(userId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      },
    }),
    
    resetUserPassword: useMutation({
      mutationFn: (userId: string) => apiService.resetUserPassword(userId),
    }),
  }
}

// Hook for content moderation
export function useContentModeration() {
  const queryClient = useQueryClient()
  
  return {
    flagContent: useMutation({
      mutationFn: ({ 
        contentType, 
        contentId, 
        reason 
      }: { 
        contentType: 'article' | 'comment' | 'user'
        contentId: string
        reason: string 
      }) => apiService.flagContent(contentType, contentId, reason),
    }),
    
    reviewContent: useMutation({
      mutationFn: ({ 
        contentType, 
        contentId, 
        action, 
        notes 
      }: { 
        contentType: 'article' | 'comment' | 'user'
        contentId: string
        action: 'approve' | 'reject' | 'delete'
        notes?: string 
      }) => apiService.reviewContent(contentType, contentId, action, notes),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin'] })
      },
    }),
  }
}

// Hook for media management
export function useMediaManagement() {
  const queryClient = useQueryClient()
  
  return {
    uploadMedia: useMutation({
      mutationFn: ({ file, folder }: { file: File; folder?: string }) =>
        apiService.uploadMedia(file, folder),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'media'] })
      },
    }),
    
    deleteMedia: useMutation({
      mutationFn: (mediaId: string) => apiService.deleteMedia(mediaId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'media'] })
      },
    }),
    
    updateMedia: useMutation({
      mutationFn: ({ mediaId, data }: { mediaId: string; data: any }) =>
        apiService.updateMedia(mediaId, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'media'] })
      },
    }),
  }
}

// Hook for admin settings
export function useAdminSettings() {
  const queryClient = useQueryClient()
  
  return {
    getSettings: useQuery({
      queryKey: ['admin', 'settings'],
      queryFn: () => apiService.getAdminSettings(),
      staleTime: 30 * 60 * 1000, // 30 minutes
      gcTime: 24 * 60 * 60 * 1000, // 24 hours
    }),
    
    updateSettings: useMutation({
      mutationFn: (settings: Record<string, any>) =>
        apiService.updateAdminSettings(settings),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] })
      },
    }),
  }
}

// Combined admin management hook
export function useAdminManagement() {
  return {
    articles: {
      list: useAdminArticles,
      stats: useAdminArticleStats(),
      bulkOperations: useBulkArticleOperations(),
    },
    users: {
      list: useAdminUsers,
      stats: useAdminUserStats(),
      management: useUserManagement(),
    },
    analytics: useAdminAnalytics,
    templates: {
      list: useArticleTemplates(),
      create: useCreateTemplate(),
      update: useUpdateTemplate(),
      delete: useDeleteTemplate(),
    },
    moderation: useContentModeration(),
    media: useMediaManagement(),
    settings: useAdminSettings(),
  }
}