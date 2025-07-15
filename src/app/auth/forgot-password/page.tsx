'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 2000)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <Header />
        
        <div className="pt-20 pb-16">
          <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 text-center">
              
              {/* Success Icon */}
              <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>

              {/* Success Message */}
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
                  Имейлът е изпратен!
                </h2>
                <p className="text-gray-600 mb-6">
                  Изпратихме инструкции за възстановяване на паролата на:
                </p>
                <p className="font-medium text-green-600 bg-green-50 p-3 rounded-lg mb-6">
                  {email}
                </p>
                <p className="text-sm text-gray-500 mb-8">
                  Проверете входящата си поща и следвайте инструкциите в имейла. 
                  Ако не виждате имейла, проверете в папката "Спам".
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <Link href="/auth/login">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
                    Обратно към влизане
                  </Button>
                </Link>
                
                <button
                  onClick={() => {
                    setIsSubmitted(false)
                    setEmail('')
                  }}
                  className="w-full text-green-600 hover:text-green-500 font-medium"
                >
                  Изпрати отново
                </button>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Header />
      
      <div className="pt-20 pb-16">
        <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            
            {/* Header */}
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg mb-6">
                <span className="text-white font-bold text-2xl">FZ</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Забравена парола
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Въведете вашия имейл адрес и ще ви изпратим инструкции за възстановяване
              </p>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Имейл адрес
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="your.email@example.com"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Изпращане...
                  </div>
                ) : (
                  'Изпрати инструкции'
                )}
              </Button>
            </form>

            {/* Back to Login */}
            <div className="text-center">
              <Link href="/auth/login" className="inline-flex items-center text-green-600 hover:text-green-500 font-medium transition-colors duration-200">
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Обратно към влизане
              </Link>
            </div>

            {/* Help */}
            <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Нужда от помощ?</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="mr-2">📧</span>
                  Свържете се с нас на support@footballzone.bg
                </li>
                <li className="flex items-center">
                  <span className="mr-2">💬</span>
                  Използвайте чата в долния десен ъгъл
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📞</span>
                  Обадете се на +359 888 123 456
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
} 