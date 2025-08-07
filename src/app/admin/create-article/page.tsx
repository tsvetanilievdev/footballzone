'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import TemplateBasedArticleCreator from '@/components/admin/TemplateBasedArticleCreator'
import { Article } from '@/types'
import Header from '@/components/common/Header'

export default function CreateArticlePage() {
  const router = useRouter()
  const [createdArticle, setCreatedArticle] = useState<Article | null>(null)

  const handleSave = (article: Article) => {
    // Тук бихме запазили статията в базата данни
    console.log('Създаване на статия:', article)
    setCreatedArticle(article)
    
    // Пренасочване след 3 секунди
    setTimeout(() => {
      router.push('/admin')
    }, 3000)
  }

  const handleCancel = () => {
    router.push('/admin')
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
                Статията &quot;{createdArticle.title}&quot; беше създадена с темплейт &quot;{createdArticle.template.name}&quot;.
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16">
        <TemplateBasedArticleCreator
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}
