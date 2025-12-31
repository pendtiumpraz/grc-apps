'use client'

import * as React from 'react'

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-300 ${className}`}
      {...props}
    />
  )
}

Label.displayName = 'Label'