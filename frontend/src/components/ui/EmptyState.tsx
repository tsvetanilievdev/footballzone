import { ReactNode } from 'react'
import { Button } from './Button'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline' | 'ghost'
  }
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn(
      'text-center py-12 px-6',
      className
    )}>
      <div className="max-w-md mx-auto">
        {icon && (
          <div className="mb-6 flex justify-center">
            {icon}
          </div>
        )}
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        
        {description && (
          <p className="text-gray-600 mb-6">
            {description}
          </p>
        )}
        
        {action && (
          <Button
            onClick={action.onClick}
            variant={action.variant || 'default'}
          >
            {action.label}
          </Button>
        )}
      </div>
    </div>
  )
}

// Predefined empty states for common scenarios
export function NoArticlesFound({ onCreateNew }: { onCreateNew?: () => void }) {
  return (
    <EmptyState
      icon={
        <svg
          className="w-16 h-16 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      }
      title="Няма налични статии"
      description="В момента няма публикувани статии в тази зона. Проверете отново по-късно или разгледайте други зони."
      action={onCreateNew ? {
        label: 'Създай нова статия',
        onClick: onCreateNew
      } : undefined}
    />
  )
}

export function SearchNoResults({ query, onClear }: { query: string; onClear?: () => void }) {
  return (
    <EmptyState
      icon={
        <svg
          className="w-16 h-16 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      }
      title="Няма резултати"
      description={`Не намерихме статии, съответстващи на "${query}". Опитайте с други ключови думи.`}
      action={onClear ? {
        label: 'Изчисти търсенето',
        onClick: onClear,
        variant: 'outline'
      } : undefined}
    />
  )
}

export function AccessDenied({ onLogin }: { onLogin?: () => void }) {
  return (
    <EmptyState
      icon={
        <svg
          className="w-16 h-16 text-orange-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      }
      title="Достъп отказан"
      description="Това съдържание е достъпно само за регистрирани потребители. Влезте в профила си за да продължите."
      action={onLogin ? {
        label: 'Вход в профила',
        onClick: onLogin
      } : undefined}
    />
  )
}

export function PremiumContentLocked({ onUpgrade }: { onUpgrade?: () => void }) {
  return (
    <EmptyState
      icon={
        <svg
          className="w-16 h-16 text-yellow-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      }
      title="Премиум съдържание"
      description="Това съдържание е достъпно само за потребители с премиум абонамент."
      action={onUpgrade ? {
        label: 'Вземи абонамент',
        onClick: onUpgrade
      } : undefined}
    />
  )
}

export function ComingSoon() {
  return (
    <EmptyState
      icon={
        <svg
          className="w-16 h-16 text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      }
      title="Очаквайте скоро"
      description="Работим усилено върху това съдържание. Ще бъде достъпно съвсем скоро!"
    />
  )
}

export function ServerError({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      icon={
        <svg
          className="w-16 h-16 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      }
      title="Възникна проблем"
      description="Временен проблем със сървъра. Моля опитайте отново след малко."
      action={onRetry ? {
        label: 'Опитай отново',
        onClick: onRetry,
        variant: 'outline'
      } : undefined}
    />
  )
}

export function NoConnection({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      icon={
        <svg
          className="w-16 h-16 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z"
          />
        </svg>
      }
      title="Няма интернет връзка"
      description="Проверете интернет връзката си и опитайте отново."
      action={onRetry ? {
        label: 'Опитай отново',
        onClick: onRetry,
        variant: 'outline'
      } : undefined}
    />
  )
}

export default EmptyState