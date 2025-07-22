'use client'

import Link from 'next/link'
import { Button } from './Button'
import { StarIcon } from '@heroicons/react/24/outline'
import { LockClosedIcon } from '@heroicons/react/24/outline'

interface PremiumCTAProps {
  title?: string
  description?: string
  zone?: 'coach' | 'player' | 'parent' | 'general'
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'minimal' | 'highlight'
}

const zoneConfig = {
  coach: {
    title: '🚀 Искаш ли достъп до премиум съдържание за треньори?',
    description: 'Получи достъп до тренировъчни планове, упражнения и анализи в Coach Zone.',
    color: 'green',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    titleColor: 'text-green-800',
    buttonColor: 'bg-green-600 hover:bg-green-700',
    buttonBorderColor: 'border-green-600 text-green-600 hover:bg-green-50'
  },
  player: {
    title: '🚀 Искаш ли достъп до премиум съдържание за играчи?',
    description: 'Получи достъп до техники, упражнения и персонални планове в Player Zone.',
    color: 'purple',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
    titleColor: 'text-purple-800',
    buttonColor: 'bg-purple-600 hover:bg-purple-700',
    buttonBorderColor: 'border-purple-600 text-purple-600 hover:bg-purple-50'
  },
  parent: {
    title: '🚀 Искаш ли достъп до премиум съдържание за родители?',
    description: 'Получи достъп до съвети за развитие, безопасност и подкрепа в Parent Zone.',
    color: 'orange',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-700',
    titleColor: 'text-orange-800',
    buttonColor: 'bg-orange-600 hover:bg-orange-700',
    buttonBorderColor: 'border-orange-600 text-orange-600 hover:bg-orange-50'
  },
  general: {
    title: '🚀 Искаш ли достъп до премиум съдържание?',
    description: 'Получи достъп до ексклузивни материали и експертни анализи.',
    color: 'blue',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    titleColor: 'text-blue-800',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
    buttonBorderColor: 'border-blue-600 text-blue-600 hover:bg-blue-50'
  }
}

const sizeConfig = {
  sm: {
    container: 'p-4',
    title: 'text-base font-bold',
    description: 'text-sm',
    buttons: 'text-sm px-4 py-2'
  },
  md: {
    container: 'p-6',
    title: 'text-lg font-bold',
    description: 'text-base',
    buttons: 'text-base px-6 py-2'
  },
  lg: {
    container: 'p-8',
    title: 'text-xl font-bold',
    description: 'text-lg',
    buttons: 'text-lg px-8 py-3'
  }
}

export default function PremiumCTA({ 
  title, 
  description, 
  zone = 'general', 
  className = '',
  size = 'md',
  variant = 'default'
}: PremiumCTAProps) {
  const config = zoneConfig[zone]
  const sizeStyles = sizeConfig[size]

  if (variant === 'minimal') {
    return (
      <div className={`text-center py-6 ${className}`}>
        <div className="flex items-center justify-center mb-3">
          <LockClosedIcon className="w-5 h-5 text-gray-400 mr-2" />
          <span className="text-gray-600">Премиум съдържание</span>
        </div>
        <p className="text-gray-700 mb-4">
          {description || config.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Link href="/auth/register">
            <Button className={`${config.buttonColor} text-white ${sizeStyles.buttons}`}>
              Регистрирай се безплатно
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button 
              variant="outline" 
              className={`border ${config.buttonBorderColor} ${sizeStyles.buttons}`}
            >
              Вход
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (variant === 'highlight') {
    return (
      <div className={`${config.bgColor} border-2 ${config.borderColor} rounded-xl ${sizeStyles.container} my-8 relative overflow-hidden ${className}`}>
        <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 px-3 py-1 text-xs font-bold rounded-bl-lg">
          ПРЕМИУМ
        </div>
        <div className="flex items-start mb-4">
          <StarIcon className={`w-6 h-6 ${config.textColor} mr-3 mt-1 flex-shrink-0`} />
          <div className="flex-1">
            <h3 className={`${sizeStyles.title} ${config.titleColor} mb-3`}>
              {title || config.title}
            </h3>
            <p className={`${config.textColor} mb-6 ${sizeStyles.description}`}>
              {description || config.description}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/pricing" className="flex-1">
            <Button className={`w-full ${config.buttonColor} text-white ${sizeStyles.buttons} transition-colors`}>
              Абонирай се сега
            </Button>
          </Link>
          <Link href="/auth/register" className="flex-1">
            <Button 
              variant="outline" 
              className={`w-full border ${config.buttonBorderColor} ${sizeStyles.buttons} transition-colors`}
            >
              Регистрирай се безплатно
            </Button>
          </Link>
        </div>
        <div className="mt-3 text-center">
          <span className={`text-xs ${config.textColor}`}>
            Вече имаш акаунт? {' '}
            <Link href="/auth/login" className="underline hover:no-underline">
              Влез тук
            </Link>
          </span>
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div className={`${config.bgColor} border ${config.borderColor} rounded-lg ${sizeStyles.container} mt-8 ${className}`}>
      <h3 className={`${sizeStyles.title} ${config.titleColor} mb-3`}>
        {title || config.title}
      </h3>
      <p className={`${config.textColor} mb-4 ${sizeStyles.description}`}>
        {description || config.description}
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/pricing">
          <Button className={`${config.buttonColor} text-white ${sizeStyles.buttons} transition-colors`}>
            Абонирай се сега
          </Button>
        </Link>
        <Link href="/auth/register">
          <Button 
            variant="outline" 
            className={`border ${config.buttonBorderColor} ${sizeStyles.buttons} transition-colors`}
          >
            Регистрирай се безплатно
          </Button>
        </Link>
      </div>
    </div>
  )
} 