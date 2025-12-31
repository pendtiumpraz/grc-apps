'use client'

import * as React from 'react'

export function Table({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className={`w-full overflow-auto ${className}`}>
      <table className="w-full" {...props} />
    </div>
  )
}

Table.displayName = 'Table'

export function TableHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={`border-b ${className}`} {...props} />
  )
}

TableHeader.displayName = 'TableHeader'

export function TableBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={`divide-y ${className}`} {...props} />
  )
}

TableBody.displayName = 'TableBody'

export function TableRow({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={`hover:bg-muted/50 ${className}`} {...props} />
  )
}

TableRow.displayName = 'TableRow'

export function TableHead({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={`px-4 py-3 text-left font-medium text-sm ${className}`} {...props} />
  )
}

TableHead.displayName = 'TableHead'

export function TableCell({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`px-4 py-3 text-sm ${className}`} {...props} />
  )
}

TableCell.displayName = 'TableCell'