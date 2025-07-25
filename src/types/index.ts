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
  series?: {
    name: string
    slug: string
    description?: string
    part?: number
    totalParts?: number
  }
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