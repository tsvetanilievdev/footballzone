'use client'

import React, { useState, useEffect } from 'react'
import { Article, ArticleTemplate } from '@/types'
import { useArticleById } from '@/hooks/api/useArticles'
import {
  DocumentDuplicateIcon,
  DocumentTextIcon,
  EyeIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import TemplateSelector from './TemplateSelector'
import AdvancedRichTextEditor from './AdvancedRichTextEditor'
import TemplateRenderer from '../articles/TemplateRenderer'
import { generateSlug } from '@/utils/slugUtils'

interface TemplateBasedEditorProps {
  article?: Partial<Article>
  templates: ArticleTemplate[]
  onSave: (article: Article) => void
  onCancel: () => void
  mode: 'create' | 'edit'
}

export default function TemplateBasedEditor({
  article,
  templates,
  onSave,
  onCancel,
  mode
}: TemplateBasedEditorProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('')
  const [showPreview, setShowPreview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load full article data when editing
  const { data: fullArticleData, isLoading: isLoadingFullArticle } = useArticleById(
    mode === 'edit' && article?.id ? article.id : ''
  )

  const [articleData, setArticleData] = useState<Partial<Article>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    author: { name: 'Admin' },
    category: 'NEWS',
    tags: [],
    publishedAt: new Date(),
    readTime: 0,
    isPremium: false,
    zones: ['read'],
    zoneSettings: {
      read: { visible: true, requiresSubscription: false },
      coach: { visible: false, requiresSubscription: false },
      player: { visible: false, requiresSubscription: false },
      parent: { visible: false, requiresSubscription: false }
    },
    template: null,
    status: 'DRAFT',
    ...article
  })

  // Template selection with example content
  const TEMPLATE_EXAMPLES = {
    'tactical-analysis': {
      title: 'Тактически анализ: Офанзивен преход 4-3-3',
      excerpt: 'Задълбочен анализ на офанзивните движения във формация 4-3-3 с практически примери от топ отбори.',
      content: `
        <h2>Въведение</h2>
        <p>Формацията 4-3-3 е една от най-атрактивните тактически схеми в модерния футбол...</p>

        <h3>Ключови принципи</h3>
        <ul>
          <li>Широчина в атака</li>
          <li>Преса в централната зона</li>
          <li>Бързи преходи</li>
        </ul>

        <h3>Диаграма на формацията</h3>
        <p><em>[Тук ще се добави диаграма]</em></p>

        <h3>Практически примери</h3>
        <p>Разгледайте как Ман Сити прилага тази тактика...</p>
      `,
      tags: ['тактика', '4-3-3', 'анализ']
    },
    'training-session': {
      title: 'Тренировъчна сесия: Подобряване на първия допир',
      excerpt: 'Пълна тренировъчна програма за развитие на техниката с 8 упражнения и прогресивни етапи.',
      content: `
        <h2>Цели на тренировката</h2>
        <ul>
          <li>Подобряване на първия допир</li>
          <li>Увеличаване на прецизността на паса</li>
          <li>Развитие на координацията</li>
        </ul>

        <h3>Загрявка (15 мин)</h3>
        <p>Започнете с леко бягане и динамично разтягане...</p>

        <h3>Основна част (30 мин)</h3>
        <h4>Упражнение 1: Контрол с вътрешна страна</h4>
        <p>Играчите се редуват да правят пасове...</p>

        <h4>Упражнение 2: Контрол с външна страна</h4>
        <p>Същото упражнение, но с външната страна на крака...</p>

        <h3>Заключение (10 мин)</h3>
        <p>Завършете с разтягане и дискусия за напредъка...</p>
      `,
      tags: ['тренировка', 'техника', 'първи-допир']
    },
    'news-article': {
      title: 'ЕКСКЛУЗИВНО: Българският национален отбор с нов селекционер',
      excerpt: 'Българският футболен съюз обяви назначението на нов селекционер на националния отбор след месеци спекулации.',
      content: `
        <p>Българският футболен съюз (БФС) официално обяви днес назначението на новия селекционер на националния отбор.</p>

        <p>Според източници близо до федерацията, решението е взето единодушно от Изпълнителния комитет след продължителни преговори.</p>

        <blockquote>
          <p>"Имаме ясна визия за бъдещето на българския футбол и новият селекционер е човекът, който може да я реализира."</p>
          <cite>- Президент на БФС</cite>
        </blockquote>

        <h3>Новите планове</h3>
        <p>Новият наставник ще има задачата да подготви отбора за предстоящите квалификации...</p>

        <p>Повече подробности ще бъдат обявени на пресконференция утре в 14:00 часа.</p>
      `,
      tags: ['новини', 'национален-отбор', 'селекционер']
    },
    'interview-modern': {
      title: 'Интервю с легендата Христо Стоичков',
      excerpt: 'Откровеният разговор с българската футболна икона за кариерата му, настоящето и бъдещето на българския футбол.',
      content: `
        <h3>Г-н Стоичков, как се чувствате да сте част от историята на българския футбол?</h3>
        <p>Чувствам се горд и отговорен. Българският футбол винаги е бил в сърцето ми.</p>

        <h3>Какво мислите за младото поколение футболисти в България?</h3>
        <p>Има талант, но трябва повече дисциплина и посвещение. Младите трябва да разберат, че успехът идва с труд.</p>

        <h3>Кой е най-големият ви съвет за младите играчи?</h3>
        <p>Никога не се отказвайте! Аз съм минал през много трудности, но винаги съм вярвал в мечтите си.</p>

        <h3>Как виждате бъдещето на българския футбол?</h3>
        <p>Има надежда, но трябва да инвестираме в младежта и академиите. Нужни са структурни промени.</p>
      `,
      tags: ['интервю', 'стоичков', 'легенда']
    },
    'player-guide': {
      title: 'Ръководство: Как да подобрите техниката си за дриблинг',
      excerpt: 'Стъпка по стъпка ръководство с 6 основни техники за дриблинг, които всеки играч може да научи.',
      content: `
        <h2>Въведение</h2>
        <p>Дриблингът е една от най-важните умения във футбола. С това ръководство ще научите основните техники.</p>

        <h3>Стъпка 1: Основни движения</h3>
        <p>Започнете с контрол на топката с вътрешната страна на крака...</p>

        <h3>Стъпка 2: Промяна на посоката</h3>
        <p>Научете се да променяте посоката рязко с външната страна...</p>

        <h3>Стъпка 3: Финтове с тялото</h3>
        <p>Използвайте движенията на тялото, за да заблудите противника...</p>

        <h3>Стъпка 4: Комбинирани движения</h3>
        <p>Свържете отделните техники в плавни комбинации...</p>

        <h3>Стъпка 5: Тренировка в скорост</h3>
        <p>Упражнявайте техниките в игрови темп...</p>

        <h3>Стъпка 6: Прилагане в игра</h3>
        <p>Използвайте новите умения в реални игрови ситуации...</p>
      `,
      tags: ['дриблинг', 'техника', 'ръководство']
    }
  }

  // Load full article data when in edit mode
  useEffect(() => {
    if (mode === 'edit' && fullArticleData && !isLoadingFullArticle) {
      setArticleData({
        id: fullArticleData.id,
        title: fullArticleData.title || '',
        slug: fullArticleData.slug || '',
        excerpt: fullArticleData.excerpt || '',
        content: fullArticleData.content || '',
        featuredImage: fullArticleData.featuredImage || '',
        author: fullArticleData.author,
        category: fullArticleData.category || '',
        tags: fullArticleData.tags || [],
        zones: fullArticleData.zones || ['read'],
        readTime: fullArticleData.readTime || 5,
        isPremium: fullArticleData.isPremium || false,
        publishedAt: fullArticleData.publishedAt,
        template: fullArticleData.template,
        status: fullArticleData.status,
        zoneSettings: fullArticleData.zoneSettings
      })

      // Set template if article has one
      if (fullArticleData.template?.id) {
        setSelectedTemplateId(fullArticleData.template.id)
      }
    }
  }, [mode, fullArticleData, isLoadingFullArticle])

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId)

    // Load example content for the selected template ONLY when creating new articles
    if (mode === 'create' && templateId in TEMPLATE_EXAMPLES) {
      const example = TEMPLATE_EXAMPLES[templateId as keyof typeof TEMPLATE_EXAMPLES]
      setArticleData(prev => ({
        ...prev,
        title: example.title,
        excerpt: example.excerpt,
        content: example.content,
        tags: example.tags,
        template: templates.find(t => t.id === templateId)
      }))
    } else {
      // For edit mode, just update the template without changing content
      setArticleData(prev => ({
        ...prev,
        template: templates.find(t => t.id === templateId)
      }))
    }
  }

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      const finalArticle = {
        ...articleData,
        id: articleData.id || `article-${Date.now()}`,
        slug: articleData.slug || generateSlug(articleData.title || ''),
        readTime: Math.ceil((articleData.content || '').replace(/<[^>]*>/g, '').split(' ').length / 200)
      } as Article

      onSave(finalArticle)
    } catch (error) {
      console.error('Error saving article:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading state when loading article data for edit
  if (mode === 'edit' && isLoadingFullArticle) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Зареждане на данни за статията...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black flex items-center">
            <SparklesIcon className="w-6 h-6 mr-2 text-purple-600" />
            {mode === 'create' ? 'Създай статия с темплейт' : 'Редактирай с темплейт'}
          </h1>
          <p className="text-black mt-1">
            Изберете темплейт и започнете с готово съдържание за вдъхновение
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`px-4 py-2 border rounded-lg transition-colors font-medium ${
              showPreview
                ? 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700'
                : 'text-purple-600 border-purple-300 hover:bg-purple-50'
            }`}
          >
            <EyeIcon className="w-4 h-4 mr-2 inline" />
            {showPreview ? 'Скрий преглед' : 'Преглед'}
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 text-black border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Отказ
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Запазване...
              </>
            ) : (
              mode === 'create' ? 'Създай статия' : 'Запази промените'
            )}
          </button>
        </div>
      </div>

      {showPreview ? (
        /* Template Preview */
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-black">
              Предварителен преглед с темплейт: {articleData.template?.name || 'Без темплейт'}
            </h3>
          </div>
          {articleData.template ? (
            <TemplateRenderer
              article={articleData as Article}
              templateId={selectedTemplateId}
            />
          ) : (
            <div className="p-8 text-center text-gray-500">
              Изберете темплейт за да видите предварителен преглед
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template Selection */}
          <div className="lg:col-span-3 mb-6">
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center mb-4">
                <DocumentDuplicateIcon className="w-5 h-5 mr-2 text-purple-600" />
                <h3 className="text-lg font-semibold text-black">
                  Стъпка 1: Изберете темплейт
                </h3>
              </div>
              <TemplateSelector
                selectedTemplate={selectedTemplateId}
                onTemplateSelect={handleTemplateSelect}
                category={articleData.category || 'read'}
                zone={Object.entries(articleData.zoneSettings || {})
                  .filter(([, settings]) => settings?.visible)
                  .map(([zone]) => zone)
                  .join(',')}
              />
            </div>
          </div>

          {/* Content Editing */}
          {selectedTemplateId && (
            <>
              <div className="lg:col-span-2">
                <div className="bg-white p-6 rounded-lg border">
                  <div className="flex items-center mb-4">
                    <DocumentTextIcon className="w-5 h-5 mr-2 text-blue-600" />
                    <h3 className="text-lg font-semibold text-black">
                      Стъпка 2: Редактирайте съдържанието
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Заглавие
                      </label>
                      <input
                        type="text"
                        value={articleData.title || ''}
                        onChange={(e) => {
                          const newTitle = e.target.value
                          setArticleData(prev => ({
                            ...prev,
                            title: newTitle,
                            // Auto-generate slug only if no manual slug was set
                            slug: prev.slug && prev.slug !== generateSlug(prev.title || '')
                              ? prev.slug
                              : generateSlug(newTitle)
                          }))
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Заглавие на статията..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Кратко описание
                      </label>
                      <textarea
                        value={articleData.excerpt || ''}
                        onChange={(e) => setArticleData(prev => ({ ...prev, excerpt: e.target.value }))}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Кратко описание..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        URL адрес (slug)
                        <span className="text-gray-500 text-xs ml-1">
                          - автоматично се генерира от заглавието
                        </span>
                      </label>
                      <input
                        type="text"
                        value={articleData.slug || ''}
                        onChange={(e) => setArticleData(prev => ({ ...prev, slug: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                        placeholder="url-adres-na-statiata"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        URL: /read/{articleData.slug || 'url-adres-na-statiata'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Съдържание
                      </label>
                      <AdvancedRichTextEditor
                        value={articleData.content || ''}
                        onChange={(content) => setArticleData(prev => ({ ...prev, content }))}
                        placeholder="Редактирайте съдържанието или използвайте примерния текст като основа..."
                        className="min-h-96"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold text-black mb-4">
                    Темплейт информация
                  </h3>
                  {articleData.template && (
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Име:</span>
                        <p className="text-gray-900">{articleData.template.name}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Описание:</span>
                        <p className="text-gray-600">{articleData.template.description}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Категория:</span>
                        <p className="text-gray-900">{articleData.template.category}</p>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">💡 Съвет</h4>
                    <p className="text-blue-700 text-sm">
                      Примерното съдържание е заредено автоматично.
                      Редактирайте го според вашите нужди.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}