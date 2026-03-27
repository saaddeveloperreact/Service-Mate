import * as React from 'react'
import { cn } from '../../lib/utils'

const Card        = React.forwardRef(({ className, ...props }, ref) => <div ref={ref} className={cn('rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300', className)} {...props} />)
const CardHeader  = React.forwardRef(({ className, ...props }, ref) => <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />)
const CardTitle   = React.forwardRef(({ className, ...props }, ref) => <h3  ref={ref} className={cn('font-display text-xl font-semibold leading-none tracking-tight text-gray-900 dark:text-white', className)} {...props} />)
const CardContent = React.forwardRef(({ className, ...props }, ref) => <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />)
const CardFooter  = React.forwardRef(({ className, ...props }, ref) => <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />)

Card.displayName        = 'Card'
CardHeader.displayName  = 'CardHeader'
CardTitle.displayName   = 'CardTitle'
CardContent.displayName = 'CardContent'
CardFooter.displayName  = 'CardFooter'

export { Card, CardHeader, CardTitle, CardContent, CardFooter }
