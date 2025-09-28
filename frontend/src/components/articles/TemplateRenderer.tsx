'use client'

import { Article } from '@/types'
import {
  TacticalTemplate,
  TrainingTemplate,
  AnalysisTemplate,
  NewsTemplate,
  InterviewTemplate,
  PlayerGuideTemplate
} from './templates'

interface TemplateRendererProps {
  article: Article
  templateId?: string
}

// Template mapping - connects template IDs to components
const TEMPLATE_MAP = {
  // Coach Zone Templates
  'tactical-analysis': TacticalTemplate,
  'training-session': TrainingTemplate,
  'analysis': AnalysisTemplate,

  // Read Zone Templates
  'news-article': NewsTemplate,
  'interview-modern': InterviewTemplate,

  // Player Zone Templates
  'player-guide': PlayerGuideTemplate,
  'visual-story': PlayerGuideTemplate, // Fallback to guide for now

  // Default fallback
  'default': NewsTemplate
} as const

/**
 * Universal template renderer that maps template IDs to React components
 * This bridges the gap between admin panel template selection and actual rendering
 */
export default function TemplateRenderer({ article, templateId }: TemplateRendererProps) {
  // Determine which template to use
  let TemplateComponent = TEMPLATE_MAP['default']

  if (templateId && templateId in TEMPLATE_MAP) {
    TemplateComponent = TEMPLATE_MAP[templateId as keyof typeof TEMPLATE_MAP]
  } else if (article.template?.id && article.template.id in TEMPLATE_MAP) {
    TemplateComponent = TEMPLATE_MAP[article.template.id as keyof typeof TEMPLATE_MAP]
  } else {
    // Fallback based on article properties
    const category = article.category?.toLowerCase()
    const zones = article.zones || []

    if (zones.includes('coach')) {
      if (category?.includes('tactical') || category?.includes('tactics')) {
        TemplateComponent = TEMPLATE_MAP['tactical-analysis']
      } else if (category?.includes('training')) {
        TemplateComponent = TEMPLATE_MAP['training-session']
      } else {
        TemplateComponent = TEMPLATE_MAP['analysis']
      }
    } else if (zones.includes('player')) {
      TemplateComponent = TEMPLATE_MAP['player-guide']
    } else if (zones.includes('read')) {
      if (article.title?.toLowerCase().includes('интервю')) {
        TemplateComponent = TEMPLATE_MAP['interview-modern']
      } else {
        TemplateComponent = TEMPLATE_MAP['news-article']
      }
    }
  }

  // Convert Article to CoachArticle format for compatibility
  const adaptedArticle = {
    ...article,
    // Add any necessary field conversions here
    videos: article.videos || [],
    difficulty: 'Intermediate' as const,
    ageGroup: 'Всички възрасти',
    equipment: [],
    relatedArticles: []
  }

  return <TemplateComponent article={adaptedArticle} />
}

// Export for use in other components
export { TEMPLATE_MAP }
export type TemplateId = keyof typeof TEMPLATE_MAP