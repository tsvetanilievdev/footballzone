export interface User {
  id: string
  email: string
  name: string
  role: 'free' | 'player' | 'coach' | 'parent' | 'admin'
  avatar?: string
  createdAt: Date
  subscription?: Subscription
}

export interface Subscription {
  id: string
  status: 'active' | 'canceled' | 'past_due'
  plan: 'player' | 'coach' | 'parent'
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
}

// Extended Article interface with advanced template support
export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage: string
  author: {
    name: string
    avatar?: string
  }
  category: 'read' | 'coach' | 'player' | 'parent' | 'news' | 'training' | 'tactics' | 'players' | 'coaches' | 'interviews' | 'analysis' | 'youth' | 'fitness' | 'psychology' | 'nutrition' | 'technique' | 'conditioning' | 'periodization' | 'technical-skills' | 'physical-fitness' | 'tactical-awareness' | 'mental-strength' | 'nutrition-recovery'
  subcategory?: string
  tags: string[]
  publishedAt: Date
  readTime: number
  isPremium: boolean
  premiumSchedule?: {
    releaseFree: Date
    isPermanentPremium: boolean
  }
  zones: ('read' | 'coach' | 'player' | 'parent' | 'series')[]
  series?: {
    name: string
    slug: string
    description?: string
    part?: number
    totalParts?: number
  }
  template: ArticleTemplate
  // New fields for advanced management
  order?: number // Manual ordering
  isFeatured?: boolean // Featured/pinned articles
  viewCount?: number // View tracking
  downloads?: {
    title: string
    url: string
    type: 'pdf' | 'doc' | 'excel' | 'image' | 'video'
    size?: string
    downloadCount?: number
  }[]
  analytics?: {
    views: number
    uniqueViews: number
    avgReadTime: number
    completionRate: number
    lastViewed?: Date
  }
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

export interface Series {
  name: string
  slug: string
  description: string
  image: string
  articleCount: number
  tags: string[]
  lastUpdated: Date
  articles: Article[]
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