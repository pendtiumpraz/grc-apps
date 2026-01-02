import { create } from 'zustand'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

export interface DataItem {
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
  deleted_at?: string
}

interface PrivacyOpsDataInventoryStore {
  items: DataItem[]
  deletedItems: DataItem[]
  loading: boolean
  error: string | null
  fetchItems: () => Promise<void>
  fetchDeletedItems: () => Promise<void>
  createItem: (item: Omit<DataItem, 'id'>) => Promise<void>
  updateItem: (id: number, item: Partial<DataItem>) => Promise<void>
  deleteItem: (id: number) => Promise<void>
  restoreItem: (id: number) => Promise<void>
  permanentDeleteItem: (id: number) => Promise<void>
  getStats: () => Promise<any>
}

export const usePrivacyOpsDataInventoryStore = create<PrivacyOpsDataInventoryStore>((set) => ({
  items: [],
  deletedItems: [],
  loading: false,
  error: null,

  fetchItems: async () => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`${API_URL}/privacyops/data-inventory`, {
        headers: getAuthHeaders(),
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

  fetchDeletedItems: async () => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`${API_URL}/privacyops/data-inventory/deleted`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch deleted items')
      }

      const data = await response.json()
      set({ deletedItems: data.data || [], loading: false, error: null })
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to fetch deleted items' })
    }
  },

  createItem: async (item) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`${API_URL}/privacyops/data-inventory`, {
        method: 'POST',
        headers: getAuthHeaders(),
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
      throw error
    }
  },

  updateItem: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`${API_URL}/privacyops/data-inventory/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
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
      throw error
    }
  },

  deleteItem: async (id) => {
    try {
      const response = await fetch(`${API_URL}/privacyops/data-inventory/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error('Failed to delete data item')
      }

      set(state => ({
        items: state.items.filter(item => item.id !== id),
      }))
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete data item' })
      throw error
    }
  },

  restoreItem: async (id) => {
    try {
      const response = await fetch(`${API_URL}/privacyops/data-inventory/${id}/restore`, {
        method: 'POST',
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error('Failed to restore data item')
      }

      set(state => ({
        deletedItems: state.deletedItems.filter(item => item.id !== id),
      }))
    } catch (error: any) {
      set({ error: error.message || 'Failed to restore data item' })
      throw error
    }
  },

  permanentDeleteItem: async (id) => {
    try {
      const response = await fetch(`${API_URL}/privacyops/data-inventory/${id}/permanent`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error('Failed to permanently delete data item')
      }

      set(state => ({
        deletedItems: state.deletedItems.filter(item => item.id !== id),
      }))
    } catch (error: any) {
      set({ error: error.message || 'Failed to permanently delete data item' })
      throw error
    }
  },

  getStats: async () => {
    try {
      const response = await fetch(`${API_URL}/privacyops/data-inventory/stats`, {
        headers: getAuthHeaders(),
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
