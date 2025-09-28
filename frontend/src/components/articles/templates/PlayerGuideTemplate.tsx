'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import {
  ArrowLeftIcon,
  ClockIcon,
  StarIcon,
  CheckCircleIcon,
  PlayIcon,
  TrophyIcon,
  BoltIcon,
  HeartIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid'
import { Article } from '@/types'

interface PlayerGuideTemplateProps {
  article: Article
}

interface DrillStepProps {
  step: number
  title: string
  description: string
  isCompleted?: boolean
  onToggleComplete?: () => void
}

function DrillStep({ step, title, description, isCompleted = false, onToggleComplete }: DrillStepProps) {
  return (
    <div className={`relative p-6 rounded-lg border-2 transition-all ${
      isCompleted
        ? 'border-green-500 bg-green-50'
        : 'border-gray-200 bg-white hover:border-purple-300'
    }`}>
      <div className="flex items-start space-x-4">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${
          isCompleted
            ? 'bg-green-500 text-white'
            : 'bg-purple-600 text-white'
        }`}>
          {isCompleted ? <CheckCircleIcon className="w-6 h-6" /> : step}
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>

          {onToggleComplete && (
            <button
              onClick={onToggleComplete}
              className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isCompleted
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
              }`}
            >
              {isCompleted ? '✓ Завършено' : 'Маркирай като завършено'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PlayerGuideTemplate({ article }: PlayerGuideTemplateProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  // Parse guide content into steps
  const parseGuideSteps = (content: string) => {
    const stepRegex = /<h[3-6][^>]*>([^<]+)<\/h[3-6]>|<strong>(\d+\.|Стъпка \d+:?|Упражнение \d+:?)([^<]+)<\/strong>/gi
    const matches = [...content.matchAll(stepRegex)]

    const steps: { title: string; description: string }[] = []

    matches.forEach((match, index) => {
      const title = match[1] || match[3] || `Стъпка ${index + 1}`
      const nextMatch = matches[index + 1]
      const nextIndex = nextMatch ? content.indexOf(nextMatch[0]) : content.length
      const currentIndex = content.indexOf(match[0])

      const sectionContent = content.substring(currentIndex + match[0].length, nextIndex)
      const description = sectionContent.replace(/<[^>]*>/g, '').trim().substring(0, 200) + '...'

      steps.push({ title: title.trim(), description })
    })

    return steps.slice(0, 8) // Limit to 8 steps for UI purposes
  }

  const steps = parseGuideSteps(article.content)

  const toggleStepComplete = (stepIndex: number) => {
    const newCompleted = new Set(completedSteps)
    if (newCompleted.has(stepIndex)) {
      newCompleted.delete(stepIndex)
    } else {
      newCompleted.add(stepIndex)
    }
    setCompletedSteps(newCompleted)
  }

  const completionPercentage = steps.length > 0 ? (completedSteps.size / steps.length) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Link href="/player" className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Назад към Player Zone
          </Link>
        </div>
      </div>

      {/* Guide Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center space-x-3 mb-6">
            <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-bold flex items-center">
              <BookOpenIcon className="w-4 h-4 mr-2" />
              РЪКОВОДСТВО ЗА ИГРАЧИ
            </span>
            <span className="text-purple-200 text-sm">
              {new Date(article.publishedAt).toLocaleDateString('bg-BG')}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-xl text-purple-100 leading-relaxed mb-8 max-w-3xl">
              {article.excerpt}
            </p>
          )}

          {/* Guide Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <ClockIcon className="w-8 h-8 text-purple-200 mx-auto mb-2" />
              <p className="text-white font-medium">{article.readTime} мин</p>
              <p className="text-purple-200 text-sm">За четене</p>
            </div>

            <div className="bg-white/10 rounded-lg p-4 text-center">
              <BoltIcon className="w-8 h-8 text-purple-200 mx-auto mb-2" />
              <p className="text-white font-medium">{steps.length}</p>
              <p className="text-purple-200 text-sm">Стъпки</p>
            </div>

            <div className="bg-white/10 rounded-lg p-4 text-center">
              <StarIcon className="w-8 h-8 text-purple-200 mx-auto mb-2" />
              <p className="text-white font-medium">Средно</p>
              <p className="text-purple-200 text-sm">Ниво</p>
            </div>

            <div className="bg-white/10 rounded-lg p-4 text-center">
              <TrophyIcon className="w-8 h-8 text-purple-200 mx-auto mb-2" />
              <p className="text-white font-medium">{Math.round(completionPercentage)}%</p>
              <p className="text-purple-200 text-sm">Завършено</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {steps.length > 0 && (
        <div className="bg-white border-b">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">Прогрес на ръководството</h3>
              <span className="text-sm text-gray-600">
                {completedSteps.size} от {steps.length} стъпки
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Featured Image */}
            {article.featuredImage && (
              <div className="mb-8">
                <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src={article.featuredImage}
                    alt={article.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <button className="bg-white/90 hover:bg-white text-purple-600 p-3 rounded-full transition-colors">
                      <PlayIcon className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Introduction */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Въведение</h2>
              {article.excerpt && (
                <p className="text-gray-700 leading-relaxed text-lg mb-4">
                  {article.excerpt}
                </p>
              )}
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <HeartIcon className="w-4 h-4 mr-1" />
                  Подходящо за всички възрасти
                </div>
                <div className="flex items-center">
                  <BoltIcon className="w-4 h-4 mr-1" />
                  Практически съвети
                </div>
              </div>
            </div>

            {/* Guide Steps */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Стъпки за изпълнение</h2>
              {steps.map((step, index) => (
                <DrillStep
                  key={index}
                  step={index + 1}
                  title={step.title}
                  description={step.description}
                  isCompleted={completedSteps.has(index)}
                  onToggleComplete={() => toggleStepComplete(index)}
                />
              ))}
            </div>

            {/* Full Content */}
            <div className="mt-12 bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Пълно ръководство</h2>
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Tips */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <BoltIcon className="w-5 h-5 mr-2 text-purple-600" />
                Бързи съвети
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start space-x-2">
                  <CheckCircleSolidIcon className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Практикувайте редовно</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircleSolidIcon className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Започнете с основите</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircleSolidIcon className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Бъдете търпеливи</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircleSolidIcon className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Търсете обратна връзка</span>
                </li>
              </ul>
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Умения</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm hover:bg-purple-200 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Completion Celebration */}
        {completionPercentage === 100 && (
          <div className="mt-12 p-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-center">
            <TrophyIcon className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Поздравления!</h3>
            <p className="text-green-100 mb-6">Завършихте ръководството успешно!</p>
            <button className="px-6 py-3 bg-white text-green-600 rounded-lg font-bold hover:bg-green-50 transition-colors">
              Споделете успеха си
            </button>
          </div>
        )}
      </div>
    </div>
  )
}