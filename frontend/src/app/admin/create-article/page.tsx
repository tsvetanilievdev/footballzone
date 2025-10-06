'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import ArticleEditor from '@/components/admin/ArticleEditor'
import { useCreateArticle } from '@/hooks/api/useArticles'
import { Article } from '@/types'
import Header from '@/components/layout/Header'

export default function CreateArticlePage() {
  const router = useRouter()
  const [createdArticle, setCreatedArticle] = useState<Article | null>(null)
  const createArticleMutation = useCreateArticle()

  const handleSave = async (articleData: any) => {
    try {
      console.log('Създаване на статия:', articleData)

      // apiService.createArticle handles all the transformation
      // Just pass the articleData directly
      const result = await createArticleMutation.mutateAsync(articleData)
      setCreatedArticle(result)

      // Пренасочване след 3 секунди
      setTimeout(() => {
        router.push('/admin')
      }, 3000)
    } catch (error) {
      console.error('Грешка при създаване на статия:', error)
      alert('Грешка при създаване на статията: ' + (error as Error).message)
    }
  }

  const handleCancel = () => {
    router.push('/admin')
  }

  if (createArticleMutation.isPending) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16">
          <div className="max-w-4xl mx-auto p-6 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="text-blue-600 text-6xl mb-4">⏳</div>
              <h1 className="text-2xl font-bold text-blue-800 mb-2">
                Създаване на статията...
              </h1>
              <p className="text-gray-600 mb-6">
                Моля изчакайте, докато статията се създава.
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

  if (createdArticle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16">
          <div className="max-w-4xl mx-auto p-6 text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="text-green-600 text-6xl mb-4">✅</div>
              <h1 className="text-2xl font-bold text-green-800 mb-2">
                Статията е създадена успешно!
              </h1>
              <p className="text-gray-600 mb-6">
                Статията &quot;{createdArticle.title}&quot; беше създадена успешно.
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

  if (createArticleMutation.isError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16">
          <div className="max-w-4xl mx-auto p-6 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="text-red-600 text-6xl mb-4">❌</div>
              <h1 className="text-2xl font-bold text-red-800 mb-2">
                Грешка при създаване на статията
              </h1>
              <p className="text-gray-600 mb-6">
                {createArticleMutation.error?.message || 'Възникна неочаквана грешка.'}
              </p>
              <button
                onClick={() => createArticleMutation.reset()}
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16">
        <ArticleEditor
          mode="create"
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}
