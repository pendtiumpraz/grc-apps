'use client'

import * as React from 'react'
import * as ToastPrimitives from '@radix-ui/react-toast'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all',
  {
    variants: {
      variant: {
        default: 'bg-white border-gray-200 text-gray-950',
        success: 'bg-green-50 border-green-200 text-green-900',
        error: 'bg-red-50 border-red-200 text-red-900',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
        info: 'bg-blue-50 border-blue-200 text-blue-900',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)


interface ToastProps extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>, VariantProps<typeof toastVariants> {
  title?: string
  description?: string
}

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  ToastProps
>(({ className, variant, title, description, children, ...props }, ref) => {
  const IconMap = {
    success: () => <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100"><svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg></div>,
    error: () => <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100"><svg className="h-3 w-3 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L9.586 10l-2.293 2.293a1 1 0 101.414 1.414L11 11.414l2.293 2.293a1 1 0 001.414-1.414L12.414 10l2.293-2.293a1 1 0 00-1.414-1.414L11 8.586 8.707 7.293z" clipRule="evenodd" /></svg></div>,
    warning: () => <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100"><svg className="h-3 w-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 0 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg></div>,
    info: () => <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100"><svg className="h-3 w-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 0 2zm-1 4a1 1 0 100 2 1 1 0 0 0 0-2zm-1 4a1 1 0 11-2 0 1 1 0 0 2z" clipRule="evenodd" /></svg></div>,
    default: () => null,
  }

  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    >
      <div className="flex items-center space-x-3">
        {IconMap[(variant || 'default') as keyof typeof IconMap]()}
        <div className="grid gap-1">
          {title && (
            <ToastPrimitives.Title className="text-sm font-medium">
              {title}
            </ToastPrimitives.Title>
          )}
          {description && (
            <ToastPrimitives.Description className="text-sm opacity-90">
              {description}
            </ToastPrimitives.Description>
          )}
          {children}
        </div>
      </div>
      <ToastPrimitives.Close className="absolute right-4 top-4 rounded-md opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:opacity-100">
        <X className="h-4 w-4" />
      </ToastPrimitives.Close>
    </ToastPrimitives.Root>
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn('fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[350px]', className)}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

export { Toast, ToastProvider, ToastViewport }