import { create } from 'zustand'
import { useEffect, useState } from 'react'

interface DataItem {
  id: number
  name: string
  type: 'personal' | 'sensitive' | 'special' | 'public'
  category: string
  owner: string
  location: string
  retention: string
  classification: 'confidential' | 'internal' | 'public'
  consentRequired: boolean
  lastUpdated: string
}

interface PrivacyOpsDataInventoryStore {
  items: DataItem[]
  loading: boolean
  error: string | null
  fetchItems: () => Promise<void>
  createItem: (item: Omit<DataItem, 'id'>) => Promise<void>
  updateItem: (id: number, item: Partial<DataItem>) => Promise<void>
  deleteItem: (id: number) => Promise<void>
  getStats: () => Promise<void>
}

export const usePrivacyOpsDataInventoryStore = create<PrivacyOpsDataInventoryStore>((set) => ({
  items: [],
  loading: false,
  error: null,

  fetchItems: async () => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/privacyops/data-inventory', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch data inventory')
      }

      const data = await response.json()
      set({ items: data.data || [], loading: false, error: null })
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to fetch data inventory' })
    }
  },

  createItem: async (item) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/privacyops/data-inventory', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      })

      if (!response.ok) {
        throw new Error('Failed to create data item')
      }

      const data = await response.json()
      set(state => ({
        items: [...state.items, data.data],
        loading: false,
        error: null,
      }))
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to create data item' })
    }
  },

  updateItem: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/privacyops/data-inventory/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Failed to update data item')
      }

      set(state => ({
        items: state.items.map(item => item.id === id ? { ...item, ...updates } : item),
        loading: false,
        error: null,
      }))
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to update data item' })
    }
  },

  deleteItem: async (id) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/privacyops/data-inventory/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete data item')
      }

      set(state => ({
        items: state.items.filter(item => item.id !== id),
        loading: false,
        error: null,
      }))
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to delete data item' })
    }
  },

  getStats: async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/privacyops/data-inventory/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }

      const data = await response.json()
      return data.data
    } catch (error: any) {
      console.error('Failed to fetch stats:', error)
      return null
    }
  },
}))
