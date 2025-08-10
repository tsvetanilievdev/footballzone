import { HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const loadingVariants = cva(
  'animate-spin border-solid border-t-transparent rounded-full',
  {
    variants: {
      variant: {
        default: 'border-primary',
        secondary: 'border-gray-400',
        white: 'border-white',
      },
      size: {
        sm: 'h-4 w-4 border-2',
        default: 'h-6 w-6 border-2',
        lg: 'h-8 w-8 border-3',
        xl: 'h-12 w-12 border-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

interface LoadingProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingVariants> {
  text?: string
}

function Loading({ className, variant, size, text, ...props }: LoadingProps) {
  return (
    <div 
      className={cn('flex items-center justify-center gap-3', className)} 
      {...props}
    >
      <div className={cn(loadingVariants({ variant, size }))} />
      {text && <span className="text-sm text-muted">{text}</span>}
    </div>
  )
}

// Skeleton components for loading states
const Skeleton = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-200', className)}
      {...props}
    />
  )
}

const SkeletonCard = ({ className }: { className?: string }) => {
  return (
    <div className={cn('bg-card border border-card-border rounded-lg p-6', className)}>
      <div className="space-y-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  )
}

const SkeletonArticle = ({ className }: { className?: string }) => {
  return (
    <div className={cn('space-y-4', className)}>
      <Skeleton className="h-8 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <Skeleton className="h-48 w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  )
}

export { Loading, Skeleton, SkeletonCard, SkeletonArticle, loadingVariants }