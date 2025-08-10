export interface CoachArticle {
  id: string
  title: string
  subtitle?: string
  excerpt: string
  content: string
  featuredImage: string
  author: {
    name: string
    avatar: string
    bio?: string
  }
  category: string
  tags: string[]
  publishedAt: Date
  readTime: number
  isPremium: boolean
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  ageGroup: string
  equipment?: string[]
  videos?: {
    title: string
    url: string
    platform: 'youtube' | 'vimeo'
    duration?: string
  }[]
  relatedArticles?: string[]
}

export type ArticleTemplateType = 'tactical' | 'training' | 'analysis'