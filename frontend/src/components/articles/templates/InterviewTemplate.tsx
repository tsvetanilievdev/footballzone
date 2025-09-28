'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeftIcon,
  ClockIcon,
  ChatBubbleLeftIcon,
  SpeakerWaveIcon,
  ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline'
import { Article } from '@/types'

interface InterviewTemplateProps {
  article: Article
}

interface QuestionAnswerProps {
  question: string
  answer: string
  isHighlighted?: boolean
}

function QuestionAnswer({ question, answer, isHighlighted = false }: QuestionAnswerProps) {
  return (
    <div className={`mb-8 ${isHighlighted ? 'bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500' : ''}`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <ChatBubbleLeftIcon className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            <ChatBubbleBottomCenterTextIcon className="w-5 h-5 inline mr-2 text-blue-600" />
            {question}
          </h3>
          <div className="text-gray-700 leading-relaxed">
            <p className="italic text-gray-600 text-sm mb-2">Отговор:</p>
            <div dangerouslySetInnerHTML={{ __html: answer }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function InterviewTemplate({ article }: InterviewTemplateProps) {
  // Parse interview content - expecting Q&A format
  const parseInterviewContent = (content: string) => {
    const sections = content.split(/(?=<h[3-6]|<strong>В:|<strong>Q:|<strong>Въпрос:)/i)
    const qaList: { question: string; answer: string; isHighlighted?: boolean }[] = []

    sections.forEach((section, index) => {
      if (section.trim()) {
        const lines = section.split('\n').filter(line => line.trim())
        if (lines.length >= 2) {
          const question = lines[0].replace(/<[^>]*>/g, '').replace(/^(В:|Q:|Въпрос:)\s*/i, '').trim()
          const answer = lines.slice(1).join('\n')
          qaList.push({
            question,
            answer,
            isHighlighted: index % 4 === 1 // Highlight every 4th question
          })
        }
      }
    })

    return qaList
  }

  const qaList = parseInterviewContent(article.content)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/read" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Назад към статиите
          </Link>
        </div>
      </div>

      {/* Interview Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center space-x-3 mb-6">
            <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-bold flex items-center">
              <ChatBubbleLeftIcon className="w-4 h-4 mr-2" />
              ИНТЕРВЮ
            </span>
            <span className="text-blue-200 text-sm">
              {new Date(article.publishedAt).toLocaleDateString('bg-BG')}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-xl text-blue-100 leading-relaxed mb-8">
              {article.excerpt}
            </p>
          )}

          {/* Interview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <SpeakerWaveIcon className="w-8 h-8 text-blue-200" />
                <div>
                  <p className="text-white font-medium">Интервюиран</p>
                  <p className="text-blue-200 text-sm">{article.author.name}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <ClockIcon className="w-8 h-8 text-blue-200" />
                <div>
                  <p className="text-white font-medium">Време за четене</p>
                  <p className="text-blue-200 text-sm">{article.readTime} минути</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <ChatBubbleLeftIcon className="w-8 h-8 text-blue-200" />
                <div>
                  <p className="text-white font-medium">Въпроси</p>
                  <p className="text-blue-200 text-sm">{qaList.length} въпроса</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interview Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Featured Image - Interviewee Photo */}
        {article.featuredImage && (
          <div className="mb-12">
            <div className="relative aspect-video md:aspect-[3/2] rounded-xl overflow-hidden shadow-2xl">
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-sm opacity-90">Интервю с</p>
                <h2 className="text-2xl font-bold">{article.author.name}</h2>
              </div>
            </div>
          </div>
        )}

        {/* Introduction */}
        <div className="mb-12 p-6 bg-white rounded-lg shadow-sm border-l-4 border-blue-500">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">За интервюто</h2>
          {article.excerpt && (
            <p className="text-gray-700 leading-relaxed text-lg">
              {article.excerpt}
            </p>
          )}
        </div>

        {/* Questions & Answers */}
        <div className="space-y-6">
          {qaList.length > 0 ? (
            qaList.map((qa, index) => (
              <QuestionAnswer
                key={index}
                question={qa.question}
                answer={qa.answer}
                isHighlighted={qa.isHighlighted}
              />
            ))
          ) : (
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Теми в интервюто</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg">
          <h3 className="text-xl font-bold mb-2">Харесва ли ви интервюто?</h3>
          <p className="mb-4 text-blue-100">Споделете мнението си и прочетете още интервюта.</p>
          <div className="flex space-x-4">
            <button className="px-6 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              Споделете
            </button>
            <Link href="/read" className="px-6 py-2 border border-white/30 text-white rounded-lg font-medium hover:bg-white/10 transition-colors">
              Още интервюта
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}