'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Pencil,
  Trash2,
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical
} from 'lucide-react'

export function CrudTable({
  columns,
  data,
  onEdit,
  onDelete,
  onCreate,
  onSearch,
  searchPlaceholder = "Search..."
}: {
  columns: { key: string; label: string }[]
  data: any[]
  onEdit: (item: any) => void
  onDelete: (item: any) => void
  onCreate: () => void
  onSearch?: (query: string) => void
  searchPlaceholder?: string
}) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Manage your data with ease</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button onClick={onCreate}>
            <Plus className="w-4 h-4 mr-2" />
            New
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {onSearch && (
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  onSearch(e.target.value)
                }}
                className="pl-10"
              />
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key}>{column.label}</TableHead>
                ))}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>{item[column.key]}</TableCell>
                  ))}
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDelete(item)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            Showing {data.length} of {data.length} items
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">1</span>
            <Button variant="outline" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function CrudForm({
  fields,
  onSubmit,
  onCancel,
  submitButtonText = "Save",
  cancelButtonText = "Cancel"
}: {
  fields: { name: string; label: string; type: string; placeholder?: string }[]
  onSubmit: (data: any) => void
  onCancel: () => void
  submitButtonText?: string
  cancelButtonText?: string
}) {
  const [formData, setFormData] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form</CardTitle>
        <CardDescription>Fill out the form below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                id={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            </div>
          ))}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onCancel}>
              {cancelButtonText}
            </Button>
            <Button type="submit">
              {submitButtonText}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}