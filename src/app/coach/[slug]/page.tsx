'use client'

import { useParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CoachArticleTemplates from '@/components/coach/CoachArticleTemplates'
import { findCoachArticleBySlug } from '@/data/articles'
import { notFound } from 'next/navigation'

export default function CoachArticlePage() {
  const params = useParams()
  const slug = params.slug as string
  
  // Намираме статията по slug от централизираните данни
  const article = findCoachArticleBySlug(slug)
  
  if (!article) {
    notFound()
  }

  // Определяме типа темплейт въз основа на категорията
  const getTemplateType = (category: string): 'tactical' | 'training' | 'analysis' => {
    switch (category.toLowerCase()) {
      case 'тактика':
        return 'tactical'
      case 'техника':
      case 'кондиция':
        return 'training'
      case 'анализ':
        return 'analysis'
      default:
        return 'training'
    }
  }

  const templateType = getTemplateType(article.category)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-20">
        <CoachArticleTemplates 
          article={article} 
          template={templateType}
        />
      </main>
      <Footer />
    </div>
  )
}