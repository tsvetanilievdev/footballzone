import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-all duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed transform active:scale-95',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary-600 shadow-button hover:shadow-md',
        destructive: 'bg-error text-white hover:bg-red-600 shadow-button hover:shadow-md',
        outline: 'border border-card-border bg-background hover:bg-primary-50 hover:border-primary text-text hover:text-primary',
        secondary: 'bg-gray-100 text-text hover:bg-gray-200 shadow-button',
        ghost: 'text-text hover:bg-primary-50 hover:text-primary',
        link: 'text-primary hover:text-primary-600 underline-offset-4 hover:underline',
        success: 'bg-success text-white hover:bg-green-600 shadow-button hover:shadow-md',
        warning: 'bg-warning text-white hover:bg-orange-600 shadow-button hover:shadow-md',
        info: 'bg-info text-white hover:bg-blue-600 shadow-button hover:shadow-md',
      },
      size: {
        sm: 'h-8 px-3 text-xs rounded-sm',
        default: 'h-10 px-4 text-sm rounded-md',
        lg: 'h-12 px-6 text-base rounded-lg',
        xl: 'h-14 px-8 text-lg rounded-xl',
        icon: 'h-10 w-10 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? 'div' : 'button'
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref as any}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants } 