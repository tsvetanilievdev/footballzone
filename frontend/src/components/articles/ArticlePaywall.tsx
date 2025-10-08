'use client'

import Link from 'next/link'
import { LockClosedIcon, StarIcon, CheckIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/contexts/AuthContext'

interface ArticlePaywallProps {
  articleTitle: string
  className?: string
}

export default function ArticlePaywall({ articleTitle, className = '' }: ArticlePaywallProps) {
  const { user } = useAuth()

  return (
    <div className={`relative ${className}`}>
      {/* Gradient overlay at the top to blend with content */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-white/50 to-white pointer-events-none z-10" />

      {/* Main paywall card */}
      <div className="relative bg-white border-4 border-green-600 rounded-2xl shadow-2xl p-8 md:p-12 mx-auto max-w-3xl mt-16 z-20">
        <div className="text-center">
          {/* Lock icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-600 to-green-700 rounded-full shadow-lg mb-6">
            <LockClosedIcon className="w-10 h-10 text-white" />
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            {user ? 'Премиум съдържание' : 'Продължи четенето'}
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
            {user ? (
              <>
                Това е <span className="font-bold text-green-700">премиум статия</span> достъпна само за Premium членове.
                Надградете акаунта си за пълен достъп до всички професионални материали.
              </>
            ) : (
              <>
                Това е <span className="font-bold text-green-700">премиум съдържание</span>.
                Регистрирайте се безплатно или се абонирайте за пълен достъп до статията.
              </>
            )}
          </p>

          {/* Benefits */}
          <div className="bg-green-50 rounded-xl p-6 mb-8 border border-green-200">
            <div className="flex items-center justify-center mb-4">
              <StarIcon className="w-6 h-6 text-green-600 mr-2" />
              <h3 className="text-xl font-bold text-gray-900">Premium предимства</h3>
            </div>
            <ul className="space-y-3 text-left max-w-md mx-auto">
              <li className="flex items-start">
                <CheckIcon className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-800">Пълен достъп до всички статии и материали</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-800">Тренировъчни планове и видео анализи</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-800">Тактически схеми и готови тренировки</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-800">Ексклузивно съдържание за треньори</span>
              </li>
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user ? (
              <>
                <Link
                  href="/pricing"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold text-lg rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Стани Premium
                </Link>
                <Link
                  href="/read"
                  className="w-full sm:w-auto px-8 py-4 bg-gray-100 text-gray-800 font-semibold text-lg rounded-xl hover:bg-gray-200 transition-all"
                >
                  Назад към статиите
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/register"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold text-lg rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Регистрирай се безплатно
                </Link>
                <Link
                  href="/auth/login"
                  className="w-full sm:w-auto px-8 py-4 bg-gray-100 text-gray-800 font-semibold text-lg rounded-xl hover:bg-gray-200 transition-all"
                >
                  Вход
                </Link>
              </>
            )}
          </div>

          {/* Additional info */}
          <p className="text-sm text-gray-500 mt-6">
            Имаш въпроси? <Link href="/contact" className="text-green-600 hover:text-green-700 underline">Свържи се с нас</Link>
          </p>
        </div>
      </div>

      {/* Bottom blur effect */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none z-10" />
    </div>
  )
}
