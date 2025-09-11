// API Request/Response Types for FootballZone Backend
import type { JWTPayload } from '@/utils/jwt'

export interface ArticleFilters {
  page: number
  limit: number
  category?: string
  zone?: string
  isPremium?: boolean
  status?: string
  search?: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

export interface SearchFilters {
  query: string
  page: number
  limit: number
  zone?: string
  category?: string
}

export interface TrackViewData {
  articleId: string
  sessionId: string
  viewDuration?: number
  completionPercent?: number
  referrer?: string
  deviceType?: string
  ipAddress?: string
  userId?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    message: string
    stack?: string
    validation?: any[]
  }
  message?: string
}

export interface ArticleCreateData {
  title: string
  slug?: string
  excerpt?: string
  content: string
  featuredImageUrl?: string
  category: string
  subcategory?: string
  tags: string[]
  readTime?: number
  isPremium?: boolean
  premiumReleaseDate?: Date
  isPermanentPremium?: boolean
  isFeatured?: boolean
  customOrder?: number
  templateId?: string
  seriesId?: string
  seriesPart?: number
  status?: string
  seoTitle?: string
  seoDescription?: string
  zones?: Array<{
    zone: string
    visible: boolean
    requiresSubscription?: boolean
    freeAfterDate?: Date
  }>
}

export interface ArticleUpdateData extends Partial<ArticleCreateData> {
  id: string
}

// Extended User interface for request
export interface AuthenticatedUser extends JWTPayload {
  id?: string // for backward compatibility
}

// Extended Request interface for custom properties
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser
      correlationId?: string
    }
  }
}