import { InputHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const inputVariants = cva(
  'w-full transition-all duration-normal placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border border-input-border bg-input hover:border-primary focus:border-primary',
        ghost: 'border-none bg-transparent hover:bg-primary-50 focus:bg-primary-50',
        filled: 'border-none bg-gray-100 hover:bg-gray-200 focus:bg-gray-200',
      },
      size: {
        sm: 'h-8 px-3 text-xs rounded-sm',
        default: 'h-10 px-3 text-sm rounded-md',
        lg: 'h-12 px-4 text-base rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input, inputVariants }