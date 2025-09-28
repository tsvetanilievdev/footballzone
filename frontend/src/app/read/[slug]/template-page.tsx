'use client'

import { useParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import TemplateRenderer from '@/components/articles/TemplateRenderer'
import AdminEditButton from '@/components/admin/AdminEditButton'
import { useArticle, useTrackArticleView } from '@/hooks/api/useArticles'
import { ArticleDetailSkeleton } from '@/components/ui/LoadingSpinner'
import { ApiErrorDisplay } from '@/components/ui/ErrorBoundary'
import { useEffect, useRef } from 'react'

export default function TemplatePage() {
  const params = useParams()
  const slug = params.slug as string

  // Fetch article from API
  const { data: article, isLoading, isError, error, refetch } = useArticle(slug)

  // Track article view
  const trackView = useTrackArticleView()
  const hasTrackedView = useRef(false)

  useEffect(() => {
    if (article?.id && !hasTrackedView.current) {
      hasTrackedView.current = true
      trackView.mutate({
        articleId: article.id,
        sessionId: 'anonymous-session', // In real app, use proper session ID
        viewDuration: 0,
        completionPercent: 0
      })
    }
  }, [article?.id, trackView])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-20">
          <ArticleDetailSkeleton />
        </main>
        <Footer />
      </div>
    )
  }

  if (isError || !article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-20">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <ApiErrorDisplay
              error={error}
              onRetry={() => refetch()}
              context="статията"
            />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Admin Edit Button - shown only for admin users */}
      <AdminEditButton article={article} />

      <main className="pt-20">
        {/* Use the TemplateRenderer to display the article with its chosen template */}
        <TemplateRenderer
          article={article}
          templateId={article.template?.id}
        />
      </main>

      <Footer />
    </div>
  )
}