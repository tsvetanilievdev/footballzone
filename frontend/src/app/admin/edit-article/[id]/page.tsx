'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import ArticleEditor from '@/components/admin/ArticleEditor'
import { useArticleById, useUpdateArticle } from '@/hooks/api/useArticles'
import { Article } from '@/types'
import Header from '@/components/layout/Header'

export default function EditArticlePage() {
  const router = useRouter()
  const params = useParams()
  const articleId = params.id as string

  const { data: article, isLoading, error } = useArticleById(articleId)
  const updateArticleMutation = useUpdateArticle()
  const [updatedArticle, setUpdatedArticle] = useState<Article | null>(null)

  const handleSave = async (articleData: any) => {
    try {
      console.log('Обновяване на статия:', articleData)

      // Convert frontend data to backend format
      const backendData = {
        title: articleData.title,
        slug: articleData.slug || generateSlug(articleData.title),
        excerpt: articleData.excerpt,
        content: articleData.content,
        category: articleData.category,
        subcategory: articleData.subcategory,
        tags: articleData.tags,
        featuredImageUrl: articleData.featuredImage,
        isPremium: articleData.isPremium,
        premiumReleaseDate: articleData.premiumSchedule?.releaseFree?.toISOString(),
        isPermanentPremium: articleData.premiumSchedule?.isPermanentPremium || false,
        status: articleData.status?.toUpperCase(),
        readTime: articleData.readTime || Math.ceil(articleData.content.split(' ').length / 200),
        seoTitle: articleData.seo?.title,
        seoDescription: articleData.seo?.description,
        zones: articleData.zones.map((zone: string) => ({
          zone: zone.toUpperCase(),
          visible: true,
          requiresSubscription: articleData.isPremium
        }))
      }

      // Helper function to generate slug
      function generateSlug(title: string) {
        return title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()
      }

      const result = await updateArticleMutation.mutateAsync({ id: articleId, data: backendData })
      setUpdatedArticle(result)

      // Пренасочване след 3 секунди
      setTimeout(() => {
        router.push('/admin')
      }, 3000)
    } catch (error) {
      console.error('Грешка при обновяване на статия:', error)
      alert('Грешка при обновяване на статията: ' + (error as Error).message)
    }
  }

  const handleCancel = () => {
    router.push('/admin')
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16">
          <div className="max-w-4xl mx-auto p-6 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="text-blue-600 text-6xl mb-4">⏳</div>
              <h1 className="text-2xl font-bold text-blue-800 mb-2">
                Зареждане на статията...
              </h1>
              <p className="text-gray-600 mb-6">
                Моля изчакайте, докато статията се зарежда.
              </p>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16">
          <div className="max-w-4xl mx-auto p-6 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="text-red-600 text-6xl mb-4">❌</div>
              <h1 className="text-2xl font-bold text-red-800 mb-2">
                Грешка при зареждане на статията
              </h1>
              <p className="text-gray-600 mb-6">
                {error?.message || 'Статията не може да бъде заредена.'}
              </p>
              <button
                onClick={() => router.push('/admin')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Върнете се назад
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Update pending state
  if (updateArticleMutation.isPending) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16">
          <div className="max-w-4xl mx-auto p-6 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="text-blue-600 text-6xl mb-4">⏳</div>
              <h1 className="text-2xl font-bold text-blue-800 mb-2">
                Запазване на промените...
              </h1>
              <p className="text-gray-600 mb-6">
                Моля изчакайте, докато промените се запазват.
              </p>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Success state
  if (updatedArticle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16">
          <div className="max-w-4xl mx-auto p-6 text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="text-green-600 text-6xl mb-4">✅</div>
              <h1 className="text-2xl font-bold text-green-800 mb-2">
                Статията е обновена успешно!
              </h1>
              <p className="text-gray-600 mb-6">
                Статията "{updatedArticle.title}" беше обновена успешно.
              </p>
              <p className="text-sm text-gray-500">
                Пренасочване към админ панела след 3 секунди...
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Update error state
  if (updateArticleMutation.isError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16">
          <div className="max-w-4xl mx-auto p-6 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="text-red-600 text-6xl mb-4">❌</div>
              <h1 className="text-2xl font-bold text-red-800 mb-2">
                Грешка при обновяване на статията
              </h1>
              <p className="text-gray-600 mb-6">
                {updateArticleMutation.error?.message || 'Възникна неочаквана грешка.'}
              </p>
              <button
                onClick={() => updateArticleMutation.reset()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-3"
              >
                Опитайте отново
              </button>
              <button
                onClick={() => router.push('/admin')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Върнете се назад
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Convert backend article data to frontend format
  const convertArticleForEditor = (article: Article) => {
    return {
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || '',
      content: article.content,
      template: article.template?.id || 'classic',
      category: article.category,
      subcategory: article.subcategory || '',
      tags: article.tags || [],
      featuredImage: article.featuredImage || '',
      images: [],
      videos: [],
      isPremium: article.isPremium || false,
      premiumSchedule: article.premiumSchedule,
      zones: Array.isArray(article.zones) ? article.zones : [],
      status: article.status?.toLowerCase() as 'draft' | 'published' | 'archived',
      author: {
        name: article.author?.name || '',
        avatar: article.author?.avatar || '',
        bio: article.author?.bio || ''
      },
      seo: {
        title: article.seo?.title || '',
        description: article.seo?.description || '',
        keywords: article.seo?.keywords || []
      },
      readTime: article.readTime || 5
    }
  }

  // Main render
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16">
        <ArticleEditor
          mode="edit"
          article={convertArticleForEditor(article)}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}