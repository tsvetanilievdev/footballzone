'use client'

import TacticalTemplate from '@/components/articles/templates/TacticalTemplate'
import TrainingTemplate from '@/components/articles/templates/TrainingTemplate'
import AnalysisTemplate from '@/components/articles/templates/AnalysisTemplate'
import { CoachArticle, ArticleTemplateType } from '@/types/articles'

interface CoachTemplateProps {
  article: CoachArticle
  template: ArticleTemplateType
}

// Main Component
export default function CoachArticleTemplates({ article, template }: CoachTemplateProps) {
  switch (template) {
    case 'tactical':
      return <TacticalTemplate article={article} />
    case 'training':
      return <TrainingTemplate article={article} />
    case 'analysis':
      return <AnalysisTemplate article={article} />
    default:
      return <TacticalTemplate article={article} />
  }
} 