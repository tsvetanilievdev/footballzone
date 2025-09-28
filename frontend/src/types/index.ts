// User role enum - MUST match backend Prisma UserRole enum
export enum UserRole {
  FREE = 'FREE',
  PLAYER = 'PLAYER',
  COACH = 'COACH',
  PARENT = 'PARENT',
  ADMIN = 'ADMIN'
}

// User interface - aligned with backend User model
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatarUrl?: string // backend uses avatarUrl, not avatar
  bio?: string
  isActive: boolean
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
  subscription?: Subscription
}

// Subscription status enum - MUST match backend Prisma SubscriptionStatus enum
export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
  PAST_DUE = 'PAST_DUE',
  UNPAID = 'UNPAID'
}

// Subscription interface - aligned with backend Subscription model
export interface Subscription {
  id: string
  userId: string
  planId: string
  status: SubscriptionStatus
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  canceledAt?: Date
  stripeSubscriptionId?: string
  stripeCustomerId?: string
  createdAt: Date
  updatedAt: Date
}

// Extended Article interface with advanced template support
export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage: string
  featuredImageUrl?: string // Backend uses this field name
  author: {
    name: string
    avatar?: string
  }
  category: ArticleCategory
  subcategory?: string
  tags: string[]
  publishedAt: Date
  readTime: number
  isPremium: boolean
  premiumSchedule?: {
    releaseFree: Date
    isPermanentPremium: boolean
  }
  // Zone visibility - aligned with backend ArticleZone model
  zones: ArticleZone[]
  series?: {
    name: string
    slug: string
    description?: string
    part?: number
    totalParts?: number
  }
  templateId?: string
  template?: ArticleTemplate
  // Backend aligned fields
  authorId?: string
  customOrder?: number
  isFeatured?: boolean
  viewCount: number
  seriesId?: string
  seriesPart?: number
  status: ArticleStatus
  seoTitle?: string
  seoDescription?: string
  createdAt: Date
  updatedAt: Date
}

// Template configuration system
export interface ArticleTemplate {
  id: string
  name: string
  description: string
  category: 'read' | 'coach' | 'player' | 'parent' | 'universal'
  settings: TemplateSettings
}

export interface TemplateSettings {
  textLength: 'short' | 'medium' | 'long' | 'extra-long'
  allowVideos: boolean
  maxVideos?: number
  videoTypes?: ('youtube' | 'vimeo' | 'embedded')[]
  allowImages: boolean
  maxImages?: number
  imageLayout: 'single' | 'gallery' | 'inline' | 'grid'
  allowDownloads: boolean
  downloadTypes?: ('pdf' | 'doc' | 'excel' | 'image')[]
  allowLinks: boolean
  customSections?: TemplateSection[]
  styling: {
    layout: 'single-column' | 'two-column' | 'grid'
    fontSize: 'small' | 'medium' | 'large'
    spacing: 'compact' | 'normal' | 'spacious'
    colors: {
      primary: string
      secondary: string
      text: string
    }
  }
}

export interface TemplateSection {
  id: string
  name: string
  type: 'text' | 'media' | 'downloads' | 'links' | 'quote' | 'stats' | 'timeline'
  required: boolean
  maxItems?: number
}

// Series related enums - MUST match backend Prisma enums
export enum SeriesCategory {
  COACHES = 'coaches',
  PLAYERS = 'players',
  TEAMS = 'teams',
  GENERAL = 'general'
}

export enum SeriesStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED'
}

// Backend-aligned Series interface
export interface Series {
  id: string
  name: string
  slug: string
  description?: string
  coverImageUrl?: string
  category: SeriesCategory
  status: SeriesStatus
  totalPlannedArticles?: number
  tags?: string[]
  createdAt: Date
  updatedAt: Date
  // Computed fields from backend
  articlesCount: number
  estimatedReadTime: number
  completionRate: number
  articles?: SeriesArticle[]
}

export interface SeriesArticle {
  id: string
  title: string
  slug: string
  seriesPart: number
  readTime: number
  publishedAt: Date
  viewCount: number
  author?: {
    id: string
    name: string
    avatarUrl?: string
  }
}

export interface SeriesProgress {
  seriesId: string
  userId: string
  articlesCompleted: number
  totalArticles: number
  completionPercentage: number
  currentArticleId?: string
  lastAccessedAt: Date
}

export interface SeriesRecommendation {
  seriesId: string
  name: string
  slug: string
  coverImageUrl?: string
  category: SeriesCategory
  articlesCount: number
  estimatedReadTime: number
  matchScore: number
  reason: string
}

export interface SeriesFilters {
  page: number
  limit: number
  category?: SeriesCategory
  status?: SeriesStatus
  search?: string
  sortBy?: 'createdAt' | 'updatedAt' | 'name' | 'articlesCount'
  sortOrder?: 'asc' | 'desc'
}

export interface SeriesAnalytics {
  seriesInfo: {
    id: string
    name: string
    articlesCount: number
    status: SeriesStatus
  }
  engagement: {
    totalViews: number
    uniqueUsers: number
    avgCompletionRate: number
    avgReadTime: number
  }
  progression: {
    usersStarted: number
    usersCompleted: number
    dropoffPoints: Array<{
      articleIndex: number
      dropoffRate: number
    }>
  }
  articlePerformance: Array<{
    id: string
    title: string
    seriesPart: number
    views: number
    avgCompletion: number
  }>
}

export interface Video {
  id: string
  title: string
  description: string
  videoUrl: string
  thumbnail: string
  duration: number
  category: 'read' | 'coach' | 'player' | 'parent' | 'news' | 'training' | 'tactics' | 'players' | 'coaches' | 'interviews' | 'analysis' | 'youth' | 'fitness' | 'psychology' | 'nutrition'
  isPremium: boolean
  publishedAt: Date
}

export interface Course {
  id: string
  title: string
  slug: string
  description: string
  longDescription: string
  featuredImage: string
  instructor: {
    name: string
    bio: string
    avatar: string
    credentials: string[]
  }
  category: 'coach' | 'player' | 'general'
  level: 'beginner' | 'intermediate' | 'advanced' | 'all'
  duration: string // "8 седмици", "12 часа", etc.
  lessonsCount: number
  studentsCount: number
  rating: number
  reviews: number
  price: number
  currency: 'BGN' | 'EUR' | 'USD'
  isPremium: boolean
  isPopular?: boolean
  isBestseller?: boolean
  tags: string[]
  skills: string[] // What students will learn
  requirements: string[] // Prerequisites
  targetAudience: string[] // Who this course is for
  curriculum: CourseLesson[]
  publishedAt: Date
  updatedAt: Date
  status: 'draft' | 'published' | 'archived'
  enrollmentCount: number
  completionRate: number
}

export interface CourseLesson {
  id: string
  title: string
  description: string
  duration: number // in minutes
  type: 'video' | 'text' | 'quiz' | 'assignment' | 'live-session'
  content: string // Video URL, text content, etc.
  resources?: CourseLessonResource[]
  isPreview: boolean // Can be viewed without enrollment
  order: number
}

export interface CourseLessonResource {
  id: string
  title: string
  type: 'pdf' | 'video' | 'link' | 'document'
  url: string
  size?: string
}

export interface Event {
  id: string
  title: string
  description: string
  startDate: Date
  endDate: Date
  location: string
  type: 'webinar' | 'training' | 'workshop'
  isPremium: boolean
  maxParticipants?: number
  currentParticipants: number
}

export interface Comment {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  createdAt: Date
  articleId?: string
  videoId?: string
}

export interface Zone {
  id: string
  name: string
  description: string
  icon: string
  color: string
  isPremium: boolean
  articleCount: number
  videoCount: number
}

export type CoachCategory = 'tactics' | 'technique' | 'conditioning' | 'periodization' | 'psychology';

export type PlayerCategory = 'technical-skills' | 'physical-fitness' | 'tactical-awareness' | 'mental-strength' | 'nutrition-recovery';

export type ParentCategory = 'child-development' | 'safety-first-aid' | 'nutrition-health' | 'psychology-support' | 'education-planning';

// Analytics interfaces
export interface UserActivity {
  id: string
  userId: string
  articleId: string
  action: 'view' | 'read' | 'share' | 'download' | 'like' | 'comment'
  timestamp: Date
  duration?: number // in seconds
  completionPercent?: number // 0-100
  device?: 'mobile' | 'tablet' | 'desktop'
  referrer?: string
}

export interface ArticleAnalytics {
  articleId: string
  totalViews: number
  uniqueViews: number
  avgReadTime: number
  completionRate: number
  shareCount: number
  downloadCount: number
  likeCount: number
  commentCount: number
  topReferrers: string[]
  viewsByDay: { date: string; views: number }[]
  deviceBreakdown: { device: string; percentage: number }[]
}

export interface MediaFile {
  id: string
  filename: string
  originalName: string
  url: string
  type: 'image' | 'video' | 'pdf' | 'doc' | 'excel'
  size: number
  uploadedAt: Date
  uploadedBy: string
  tags: string[]
  usageCount: number
  thumbnail?: string
}