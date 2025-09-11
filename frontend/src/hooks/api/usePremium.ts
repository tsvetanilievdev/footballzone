import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/utils/api-client'

// Types for premium content system
export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
  stripePriceId?: string
  popular?: boolean
  description: string
}

export interface UserSubscription {
  id: string
  userId: string
  planId: string
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete'
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  stripeSubscriptionId?: string
  plan: SubscriptionPlan
}

export interface ContentAccess {
  hasAccess: boolean
  reason?: 'subscription' | 'premium_until' | 'free_content' | 'trial'
  upgradeRequired?: boolean
  premiumUntil?: string
  subscriptionStatus?: string
  trialDaysLeft?: number
}

export interface ContentPreview {
  previewHtml: string
  previewText: string
  wordCount: number
  estimatedReadTime: number
  upgradePrompt: string
}

export interface PremiumRecommendation {
  contentId: string
  title: string
  description: string
  category: string
  readTime: number
  premium: boolean
  score: number
  reasons: string[]
}

export interface ScheduledRelease {
  id: string
  contentId: string
  contentType: 'article' | 'series'
  title: string
  scheduledFor: string
  released: boolean
  releasedAt: string | null
  notificationSent: boolean
}

export interface PremiumAnalytics {
  totalSubscribers: number
  activeSubscribers: number
  churnRate: number
  revenue: {
    total: number
    monthly: number
    yearly: number
  }
  conversionMetrics: {
    trialToSubscription: number
    freeToTrial: number
    upgradeRate: number
  }
  contentPerformance: Array<{
    contentId: string
    title: string
    views: number
    conversions: number
    conversionRate: number
  }>
}

// Subscription plans
export const useSubscriptionPlans = () => {
  return useQuery({
    queryKey: ['premium', 'plans'],
    queryFn: async () => {
      const response = await apiClient.get<SubscriptionPlan[]>('/premium/plans')
      return response.data
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

// User's current subscription
export const useUserSubscription = () => {
  return useQuery({
    queryKey: ['premium', 'subscription'],
    queryFn: async () => {
      const response = await apiClient.get<UserSubscription | null>('/premium/subscription')
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Check content access
export const useContentAccess = (contentId: string, contentType: 'article' | 'series' = 'article') => {
  return useQuery({
    queryKey: ['premium', 'access', contentType, contentId],
    queryFn: async () => {
      const response = await apiClient.get<ContentAccess>(`/premium/content/${contentId}/access`, {
        params: { type: contentType }
      })
      return response.data
    },
    enabled: !!contentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Get content preview for premium content
export const useContentPreview = (contentId: string, contentType: 'article' | 'series' = 'article') => {
  return useQuery({
    queryKey: ['premium', 'preview', contentType, contentId],
    queryFn: async () => {
      const response = await apiClient.get<ContentPreview>(`/premium/content/${contentId}/preview`, {
        params: { type: contentType }
      })
      return response.data
    },
    enabled: !!contentId,
    staleTime: 15 * 60 * 1000, // 15 minutes
  })
}

// Premium content recommendations
export const usePremiumRecommendations = (limit: number = 5) => {
  return useQuery({
    queryKey: ['premium', 'recommendations', limit],
    queryFn: async () => {
      const response = await apiClient.get<PremiumRecommendation[]>(`/premium/recommendations?limit=${limit}`)
      return response.data
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

// Scheduled content releases
export const useScheduledReleases = (upcoming: boolean = true) => {
  return useQuery({
    queryKey: ['premium', 'scheduled', upcoming],
    queryFn: async () => {
      const response = await apiClient.get<ScheduledRelease[]>('/premium/scheduled', {
        params: { upcoming }
      })
      return response.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Premium analytics (admin only)
export const usePremiumAnalytics = (dateRange?: string) => {
  return useQuery({
    queryKey: ['premium', 'analytics', dateRange],
    queryFn: async () => {
      const params = dateRange ? { range: dateRange } : {}
      const response = await apiClient.get<PremiumAnalytics>('/premium/analytics', { params })
      return response.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Bulk access checking for multiple content items
export const useBulkContentAccess = () => {
  return useMutation({
    mutationFn: async (contentIds: Array<{ id: string; type: 'article' | 'series' }>) => {
      const response = await apiClient.post<Record<string, ContentAccess>>('/premium/content/access/bulk', {
        contentIds
      })
      return response.data
    },
  })
}

// Schedule content release (admin/coach only)
export const useScheduleContentRelease = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({
      contentId,
      contentType,
      scheduledFor,
      sendNotification = true
    }: {
      contentId: string
      contentType: 'article' | 'series'
      scheduledFor: string
      sendNotification?: boolean
    }) => {
      const response = await apiClient.post(`/premium/content/${contentId}/schedule`, {
        contentType,
        scheduledFor,
        sendNotification
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['premium', 'scheduled'] })
    },
  })
}

// Batch schedule releases
export const useBatchScheduleReleases = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (releases: Array<{
      contentId: string
      contentType: 'article' | 'series'
      scheduledFor: string
      sendNotification?: boolean
    }>) => {
      const response = await apiClient.post('/premium/content/schedule/batch', { releases })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['premium', 'scheduled'] })
    },
  })
}

// Process scheduled releases (admin only - typically called by cron job)
export const useProcessScheduledReleases = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post('/premium/releases/process')
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['premium', 'scheduled'] })
      queryClient.invalidateQueries({ queryKey: ['premium', 'access'] })
    },
  })
}

// Simulate subscription upgrade (development only)
export const useSimulateUpgrade = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (planId: string) => {
      const response = await apiClient.post('/premium/simulate-upgrade', { planId })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['premium', 'subscription'] })
      queryClient.invalidateQueries({ queryKey: ['premium', 'access'] })
    },
  })
}

// Create subscription (Stripe integration)
export const useCreateSubscription = () => {
  return useMutation({
    mutationFn: async ({
      planId,
      paymentMethodId,
      couponCode
    }: {
      planId: string
      paymentMethodId: string
      couponCode?: string
    }) => {
      const response = await apiClient.post('/premium/subscriptions/create', {
        planId,
        paymentMethodId,
        couponCode
      })
      return response.data
    },
  })
}

// Cancel subscription
export const useCancelSubscription = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (cancelAtPeriodEnd: boolean = true) => {
      const response = await apiClient.post('/premium/subscriptions/cancel', {
        cancelAtPeriodEnd
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['premium', 'subscription'] })
    },
  })
}

// Update subscription
export const useUpdateSubscription = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({
      planId,
      prorationBehavior = 'create_prorations'
    }: {
      planId: string
      prorationBehavior?: 'create_prorations' | 'none' | 'always_invoice'
    }) => {
      const response = await apiClient.post('/premium/subscriptions/update', {
        planId,
        prorationBehavior
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['premium', 'subscription'] })
    },
  })
}