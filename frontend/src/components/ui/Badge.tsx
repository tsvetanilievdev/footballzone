import { HTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center px-2 py-1 text-xs font-medium transition-all duration-normal focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary-600',
        secondary: 'bg-gray-100 text-text hover:bg-gray-200',
        destructive: 'bg-error text-white shadow hover:bg-red-600',
        outline: 'text-text border border-card-border hover:bg-primary-50',
        success: 'bg-success text-white shadow hover:bg-green-600',
        warning: 'bg-warning text-white shadow hover:bg-orange-600',
        info: 'bg-info text-white shadow hover:bg-blue-600',
        // Zone-specific badges
        read: 'bg-zones-read text-white shadow hover:opacity-90',
        coach: 'bg-zones-coach text-white shadow hover:opacity-90',
        player: 'bg-zones-player text-white shadow hover:opacity-90',
        parent: 'bg-zones-parent text-white shadow hover:opacity-90',
        admin: 'bg-zones-admin text-white shadow hover:opacity-90',
      },
      size: {
        sm: 'text-xs px-1.5 py-0.5 rounded-sm',
        default: 'text-xs px-2 py-1 rounded-md',
        lg: 'text-sm px-3 py-1.5 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }