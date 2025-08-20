'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from './Button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
    
    // Log error to monitoring service (if available)
    if (typeof window !== 'undefined') {
      // You can integrate with error monitoring services here
      // e.g., Sentry, LogRocket, etc.
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <svg
                className="w-16 h-16 text-red-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Възникна грешка
              </h2>
              <p className="text-gray-600 mb-6">
                Съжаляваме, нещо се обърка. Моля опитайте отново или се свържете с нас ако проблемът продължава.
              </p>
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={() => this.setState({ hasError: false, error: undefined })}
                className="w-full"
              >
                Опитай отново
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Презареди страницата
              </Button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">
                  Технически детайли (само в development)
                </summary>
                <pre className="mt-2 text-xs text-red-600 bg-red-50 p-3 rounded overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook for handling async errors in functional components
export function useErrorHandler() {
  return (error: Error) => {
    console.error('Async error caught:', error)
    // You can integrate with error monitoring here
    throw error // Re-throw to trigger ErrorBoundary
  }
}

// Component for API errors
export function ApiErrorDisplay({ 
  error, 
  onRetry 
}: { 
  error: any
  onRetry?: () => void 
}) {
  const getErrorMessage = (error: any) => {
    if (error?.response?.status === 401) {
      return 'Необходимо е да влезете в профила си.'
    }
    if (error?.response?.status === 403) {
      return 'Нямате права за достъп до това съдържание.'
    }
    if (error?.response?.status === 404) {
      return 'Търсеното съдържание не беше намерено.'
    }
    if (error?.response?.status >= 500) {
      return 'Временен проблем със сървъра. Моля опитайте отново.'
    }
    return error?.message || 'Възникна неочаквана грешка.'
  }

  return (
    <div className="text-center py-8">
      <div className="mb-4">
        <svg
          className="w-12 h-12 text-red-500 mx-auto mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Възникна проблем
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          {getErrorMessage(error)}
        </p>
      </div>
      
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Опитай отново
        </Button>
      )}
    </div>
  )
}

// Network error component
export function NetworkErrorDisplay({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="text-center py-8">
      <div className="mb-4">
        <svg
          className="w-12 h-12 text-orange-500 mx-auto mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Няма интернет връзка
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Моля проверете интернет връзката си и опитайте отново.
        </p>
      </div>
      
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Опитай отново
        </Button>
      )}
    </div>
  )
}

export default ErrorBoundary