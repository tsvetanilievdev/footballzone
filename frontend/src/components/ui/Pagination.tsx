import { Button } from './Button'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showPrevNext?: boolean
  showFirstLast?: boolean
  maxVisiblePages?: number
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showPrevNext = true,
  showFirstLast = true,
  maxVisiblePages = 5,
  className
}: PaginationProps) {
  if (totalPages <= 1) return null

  const getVisiblePages = () => {
    const delta = Math.floor(maxVisiblePages / 2)
    let start = Math.max(1, currentPage - delta)
    let end = Math.min(totalPages, start + maxVisiblePages - 1)
    
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1)
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  const visiblePages = getVisiblePages()
  const showStartEllipsis = visiblePages[0] > 2
  const showEndEllipsis = visiblePages[visiblePages.length - 1] < totalPages - 1

  return (
    <nav
      className={cn('flex items-center justify-center space-x-1', className)}
      aria-label="Навигация между страници"
    >
      {/* First page */}
      {showFirstLast && currentPage > 1 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          aria-label="Първа страница"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </Button>
      )}

      {/* Previous page */}
      {showPrevNext && currentPage > 1 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Предишна страница"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
      )}

      {/* First page number */}
      {showStartEllipsis && (
        <>
          <Button
            variant={1 === currentPage ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageChange(1)}
            aria-label="Страница 1"
            aria-current={1 === currentPage ? 'page' : undefined}
          >
            1
          </Button>
          <span className="px-2 text-gray-500">...</span>
        </>
      )}

      {/* Visible page numbers */}
      {visiblePages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? 'default' : 'outline'}
          size="sm"
          onClick={() => onPageChange(page)}
          aria-label={`Страница ${page}`}
          aria-current={page === currentPage ? 'page' : undefined}
          className={cn(
            page === currentPage && 'bg-blue-600 text-white hover:bg-blue-700'
          )}
        >
          {page}
        </Button>
      ))}

      {/* Last page number */}
      {showEndEllipsis && (
        <>
          <span className="px-2 text-gray-500">...</span>
          <Button
            variant={totalPages === currentPage ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageChange(totalPages)}
            aria-label={`Страница ${totalPages}`}
            aria-current={totalPages === currentPage ? 'page' : undefined}
          >
            {totalPages}
          </Button>
        </>
      )}

      {/* Next page */}
      {showPrevNext && currentPage < totalPages && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Следваща страница"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      )}

      {/* Last page */}
      {showFirstLast && currentPage < totalPages && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          aria-label="Последна страница"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </Button>
      )}
    </nav>
  )
}

// Simple pagination with load more button
interface LoadMorePaginationProps {
  hasNextPage: boolean
  isFetchingNextPage: boolean
  onLoadMore: () => void
  className?: string
}

export function LoadMorePagination({
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  className
}: LoadMorePaginationProps) {
  if (!hasNextPage) return null

  return (
    <div className={cn('flex justify-center pt-8', className)}>
      <Button
        onClick={onLoadMore}
        disabled={isFetchingNextPage}
        variant="outline"
        size="lg"
      >
        {isFetchingNextPage ? 'Зареждане...' : 'Зареди още'}
      </Button>
    </div>
  )
}

// Pagination info component
interface PaginationInfoProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  className?: string
}

export function PaginationInfo({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  className
}: PaginationInfoProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className={cn('text-sm text-gray-600 text-center', className)}>
      Показва {startItem}-{endItem} от {totalItems} резултата
      {totalPages > 1 && ` • Страница ${currentPage} от ${totalPages}`}
    </div>
  )
}

export default Pagination