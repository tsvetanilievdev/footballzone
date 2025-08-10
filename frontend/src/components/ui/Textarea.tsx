import { TextareaHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const textareaVariants = cva(
  'w-full transition-all duration-normal placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y',
  {
    variants: {
      variant: {
        default: 'border border-input-border bg-input hover:border-primary focus:border-primary',
        ghost: 'border-none bg-transparent hover:bg-primary-50 focus:bg-primary-50',
        filled: 'border-none bg-gray-100 hover:bg-gray-200 focus:bg-gray-200',
      },
      size: {
        sm: 'min-h-[80px] px-3 py-2 text-xs rounded-sm',
        default: 'min-h-[100px] px-3 py-3 text-sm rounded-md',
        lg: 'min-h-[120px] px-4 py-3 text-base rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <textarea
        className={cn(textareaVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea, textareaVariants }