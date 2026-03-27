import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-95',
  {
    variants: {
      variant: {
        default:     'bg-primary-600 text-white shadow-md hover:bg-primary-700 hover:shadow-lg',
        accent:      'bg-accent-500 text-white shadow-md hover:bg-accent-600 hover:shadow-lg',
        destructive: 'bg-red-500 text-white hover:bg-red-600',
        outline:     'border-2 border-primary-600 text-primary-600 bg-white hover:bg-primary-50',
        secondary:   'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:       'hover:bg-gray-100 text-gray-700',
        glass:       'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20',
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm:      'h-9 px-4 text-xs',
        lg:      'h-12 px-8 text-base',
        xl:      'h-14 px-10 text-base py-4',
        icon:    'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
})
Button.displayName = 'Button'

export { Button, buttonVariants }
