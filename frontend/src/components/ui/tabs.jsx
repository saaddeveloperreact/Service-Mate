import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '../../lib/utils'

const Tabs        = TabsPrimitive.Root
const TabsList    = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List ref={ref} className={cn('inline-flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 p-1 gap-1', className)} {...props} />
))
const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger ref={ref}
    className={cn('inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 text-gray-600 dark:text-gray-400 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-primary-600 dark:data-[state=active]:text-primary-400 data-[state=active]:shadow-sm capitalize', className)}
    {...props} />
))
const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content ref={ref} className={cn('mt-4', className)} {...props} />
))

TabsList.displayName    = 'TabsList'
TabsTrigger.displayName = 'TabsTrigger'
TabsContent.displayName = 'TabsContent'

export { Tabs, TabsList, TabsTrigger, TabsContent }
