'use client'

import React, { useState } from 'react'
import { 
  LockClosedIcon,
  StarIcon,
  ClockIcon,
  ArrowRightIcon,
  CheckIcon,
  CrownIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { useContentAccess, useContentPreview, useSubscriptionPlans } from '@/hooks/api/usePremium'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface PremiumGateProps {
  contentId: string
  contentType?: 'article' | 'series'
  children: React.ReactNode
  showPreview?: boolean
  className?: string
}

const PremiumGate: React.FC<PremiumGateProps> = ({ 
  contentId, 
  contentType = 'article', 
  children, 
  showPreview = true,
  className = '' 
}) => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  
  const { data: access, isLoading: accessLoading } = useContentAccess(contentId, contentType)
  const { data: preview, isLoading: previewLoading } = useContentPreview(
    contentId, 
    contentType, 
    { enabled: showPreview && access && !access.hasAccess }
  )
  const { data: plans, isLoading: plansLoading } = useSubscriptionPlans()

  if (accessLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (access?.hasAccess) {
    return <>{children}</>
  }

  const getPremiumFeatures = () => [
    'Достъп до всички премиум статии',
    'Ексклузивни серии и курсове',
    'Подробна тактическа анализа',
    'Видео материали и схеми',
    'Ранен достъп до ново съдържание',
    'Персонализирани препоръки',
    'Без реклами',
    'Месечна новина с експертни анализи'
  ]

  return (
    <div className={className}>
      {/* Preview Content */}
      {showPreview && preview && !previewLoading && (
        <div className="mb-8">
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: preview.previewHtml }} />
          </div>
          
          {/* Gradient Overlay */}
          <div className="relative -mt-32 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
        </div>
      )}

      {/* Premium Gate */}
      <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100/20 to-transparent pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-200/20 rounded-full pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-orange-200/20 rounded-full pointer-events-none" />
        
        <div className="relative z-10">
          {/* Premium Icon */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full border border-amber-200">
              <CrownIcon className="w-5 h-5" />
              <span className="font-semibold text-sm">ПРЕМИУМ СЪДЪРЖАНИЕ</span>
            </div>
          </div>

          {/* Lock Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-amber-500 text-white p-4 rounded-full shadow-lg">
              <LockClosedIcon className="w-8 h-8" />
            </div>
          </div>

          {/* Message based on access reason */}
          <div className="mb-8">
            {access?.reason === 'premium_until' && access.premiumUntil && (
              <>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  Това съдържание ще стане безплатно скоро
                </h3>
                <p className="text-gray-700 mb-4">
                  Ще получите достъп на {new Date(access.premiumUntil).toLocaleDateString('bg-BG')}
                </p>
                <div className="flex items-center justify-center gap-2 text-amber-700">
                  <ClockIcon className="w-5 h-5" />
                  <span>Или получете достъп сега с премиум абонамент</span>
                </div>
              </>
            )}
            
            {access?.reason === 'subscription' && (
              <>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  Ексклузивно премиум съдържание
                </h3>
                <p className="text-gray-700 mb-4">
                  Това е ексклузивно съдържание за премиум абонати с подробна анализа 
                  и експертни прегледи от професионални треньори.
                </p>
              </>
            )}
            
            {access?.trialDaysLeft && access.trialDaysLeft > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-blue-700">
                  <SparklesIcon className="w-5 h-5" />
                  <span className="font-medium">
                    Имате {access.trialDaysLeft} дни безплатен пробен период!
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Content Stats */}
          {preview && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/70 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900">{preview.wordCount}</div>
                <div className="text-sm text-gray-600">думи</div>
              </div>
              <div className="bg-white/70 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900">{preview.estimatedReadTime}</div>
                <div className="text-sm text-gray-600">мин четене</div>
              </div>
              <div className="bg-white/70 rounded-lg p-4">
                <div className="flex items-center justify-center">
                  <StarIcon className="w-6 h-6 text-yellow-500" />
                </div>
                <div className="text-sm text-gray-600">Премиум качество</div>
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="space-y-4">
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center justify-center gap-2"
            >
              <CrownIcon className="w-5 h-5" />
              Премиум достъп
              <ArrowRightIcon className="w-5 h-5" />
            </button>
            
            <p className="text-sm text-gray-600">
              Започнете с 7-дневен безплатен пробен период
            </p>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Изберете план</h2>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                ✕
              </button>
            </div>

            {plansLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="lg" />
              </div>
            ) : plans && plans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {plans.map((plan) => (
                  <div 
                    key={plan.id}
                    className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                      plan.popular 
                        ? 'border-amber-500 bg-amber-50 relative' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Най-популярен
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.name}</h3>
                      <div className="text-3xl font-bold text-gray-900">
                        {plan.price}лв
                        <span className="text-base font-normal text-gray-500">
                          /{plan.interval === 'month' ? 'месец' : 'година'}
                        </span>
                      </div>
                    </div>
                    
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                      plan.popular
                        ? 'bg-amber-500 hover:bg-amber-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}>
                      Избери план
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Планове не са налични в момента
              </div>
            )}

            {/* Features List */}
            <div className="border-t pt-6">
              <h4 className="font-semibold text-gray-900 mb-4">Какво получавате с премиум:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {getPremiumFeatures().map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PremiumGate