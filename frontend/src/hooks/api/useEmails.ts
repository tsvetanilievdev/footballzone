import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/utils/api-client'

// Types for email system
export interface EmailTemplate {
  id: string
  name: string
  subject: string
  htmlContent: string
  textContent?: string
  category: 'newsletter' | 'notification' | 'premium' | 'marketing' | 'system'
  variables: string[]
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface EmailPreferences {
  id: string
  userId: string
  newsletter: boolean
  notifications: boolean
  premium: boolean
  marketing: boolean
  frequency: 'immediate' | 'daily' | 'weekly' | 'monthly'
  categories: {
    tactics: boolean
    technique: boolean
    fitness: boolean
    psychology: boolean
    youthDevelopment: boolean
    coaching: boolean
  }
  updatedAt: string
}

export interface EmailCampaign {
  id: string
  name: string
  subject: string
  templateId: string
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed'
  scheduledFor?: string
  sentAt?: string
  recipients: number
  opens: number
  clicks: number
  bounces: number
  complaints: number
  createdAt: string
}

export interface EmailAnalytics {
  totalSent: number
  totalOpens: number
  totalClicks: number
  totalBounces: number
  totalComplaints: number
  openRate: number
  clickRate: number
  bounceRate: number
  complaintRate: number
  recentCampaigns: Array<{
    id: string
    name: string
    sentAt: string
    recipients: number
    openRate: number
    clickRate: number
  }>
  topPerformingTemplates: Array<{
    id: string
    name: string
    category: string
    openRate: number
    clickRate: number
    usageCount: number
  }>
}

// Email templates (admin only)
export const useEmailTemplates = () => {
  return useQuery({
    queryKey: ['emails', 'templates'],
    queryFn: async () => {
      const response = await apiClient.get<EmailTemplate[]>('/emails/templates')
      return response.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// User email preferences
export const useEmailPreferences = () => {
  return useQuery({
    queryKey: ['emails', 'preferences'],
    queryFn: async () => {
      const response = await apiClient.get<EmailPreferences>('/emails/preferences')
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Email analytics (admin only)
export const useEmailAnalytics = (dateRange?: string) => {
  return useQuery({
    queryKey: ['emails', 'analytics', dateRange],
    queryFn: async () => {
      const params = dateRange ? { range: dateRange } : {}
      const response = await apiClient.get<EmailAnalytics>('/emails/analytics', { params })
      return response.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Update email preferences
export const useUpdateEmailPreferences = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (preferences: Partial<EmailPreferences>) => {
      const response = await apiClient.put<EmailPreferences>('/emails/preferences', preferences)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails', 'preferences'] })
    },
  })
}

// Send individual email (admin only)
export const useSendEmail = () => {
  return useMutation({
    mutationFn: async ({
      to,
      templateId,
      variables,
      scheduleFor
    }: {
      to: string | string[]
      templateId: string
      variables?: Record<string, any>
      scheduleFor?: string
    }) => {
      const response = await apiClient.post('/emails/send', {
        to,
        templateId,
        variables,
        scheduleFor
      })
      return response.data
    },
  })
}

// Send bulk email campaign (admin only)
export const useSendBulkEmail = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({
      campaignName,
      templateId,
      recipients,
      variables,
      scheduleFor,
      filters
    }: {
      campaignName: string
      templateId: string
      recipients?: 'all' | 'subscribers' | 'premium' | 'custom'
      variables?: Record<string, any>
      scheduleFor?: string
      filters?: {
        roles?: string[]
        subscriptionStatus?: string[]
        categories?: string[]
        lastActive?: string
      }
    }) => {
      const response = await apiClient.post('/emails/send/bulk', {
        campaignName,
        templateId,
        recipients,
        variables,
        scheduleFor,
        filters
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails', 'analytics'] })
    },
  })
}

// Send automated notifications
export const useSendNotification = () => {
  return useMutation({
    mutationFn: async ({
      type,
      userId,
      articleId,
      seriesId,
      variables
    }: {
      type: 'new_article' | 'series_update' | 'premium_release' | 'subscription_reminder' | 'custom'
      userId?: string
      articleId?: string
      seriesId?: string
      variables?: Record<string, any>
    }) => {
      const response = await apiClient.post('/emails/notifications', {
        type,
        userId,
        articleId,
        seriesId,
        variables
      })
      return response.data
    },
  })
}

// Test email functionality (development only)
export const useTestEmail = () => {
  return useMutation({
    mutationFn: async ({
      templateId,
      testEmail,
      variables
    }: {
      templateId: string
      testEmail: string
      variables?: Record<string, any>
    }) => {
      const response = await apiClient.post('/emails/test', {
        templateId,
        testEmail,
        variables
      })
      return response.data
    },
  })
}

// Create email template (admin only)
export const useCreateEmailTemplate = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (template: {
      name: string
      subject: string
      htmlContent: string
      textContent?: string
      category: EmailTemplate['category']
      variables?: string[]
    }) => {
      const response = await apiClient.post<EmailTemplate>('/emails/templates', template)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails', 'templates'] })
    },
  })
}

// Update email template (admin only)
export const useUpdateEmailTemplate = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({
      id,
      updates
    }: {
      id: string
      updates: Partial<EmailTemplate>
    }) => {
      const response = await apiClient.put<EmailTemplate>(`/emails/templates/${id}`, updates)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails', 'templates'] })
    },
  })
}

// Delete email template (admin only)
export const useDeleteEmailTemplate = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (templateId: string) => {
      await apiClient.delete(`/emails/templates/${templateId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails', 'templates'] })
    },
  })
}

// Unsubscribe from emails (public endpoint)
export const useUnsubscribeEmail = () => {
  return useMutation({
    mutationFn: async (token: string) => {
      const response = await apiClient.get(`/emails/unsubscribe?token=${token}`)
      return response.data
    },
  })
}

// Subscribe to newsletter (public endpoint)
export const useSubscribeNewsletter = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await apiClient.post('/emails/subscribe', { email })
      return response.data
    },
  })
}

// Get email campaigns (admin only)
export const useEmailCampaigns = (params?: {
  status?: string
  limit?: number
  page?: number
}) => {
  return useQuery({
    queryKey: ['emails', 'campaigns', params],
    queryFn: async () => {
      const response = await apiClient.get<{
        campaigns: EmailCampaign[]
        total: number
        pages: number
        currentPage: number
      }>('/emails/campaigns', { params })
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Preview email template with variables
export const usePreviewEmail = () => {
  return useMutation({
    mutationFn: async ({
      templateId,
      variables
    }: {
      templateId: string
      variables?: Record<string, any>
    }) => {
      const response = await apiClient.post(`/emails/templates/${templateId}/preview`, {
        variables
      })
      return response.data
    },
  })
}