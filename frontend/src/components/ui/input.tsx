'use client'

import * as React from 'react'

export function Input({
  type = 'text',
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-gray-700 bg-gray-900/80 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 focus:border-cyan-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${className}`}
      {...props}
    />
  )
}

Input.displayName = 'Input'