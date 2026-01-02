import { create } from 'zustand'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

export interface ProcessingActivity {
  id: number
  name: string
  dataType: string
  category: string
  purpose: string
  legalBasis: string
  dataSubject: string
  thirdParty: string
  transferCountry: string
  securityMeasures: string
  retentionPeriod: string
  status: string
  lastUpdated: string
  owner: string
  createdAt: string
  deleted_at?: string
  description?: string
  processingPurpose?: string
  dataCategory?: string
}

interface PrivacyOpsRoPAStore {
  activities: ProcessingActivity[]
  deletedActivities: ProcessingActivity[]
  loading: boolean
  error: string | null

  fetchActivities: () => Promise<void>
  fetchDeletedActivities: () => Promise<void>
  createActivity: (data: Partial<ProcessingActivity>) => Promise<void>
  updateActivity: (id: number, data: Partial<ProcessingActivity>) => Promise<void>
  deleteActivity: (id: number) => Promise<void>
  restoreActivity: (id: number) => Promise<void>
  permanentDeleteActivity: (id: number) => Promise<void>
  getStats: () => Promise<void>
}

export const usePrivacyOpsRoPAStore = create<PrivacyOpsRoPAStore>((set) => ({
  activities: [],
  deletedActivities: [],
  loading: false,
  error: null,

  fetchActivities: async () => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`${API_URL}/privacyops/ropa`, {
        headers: getAuthHeaders(),
      })
      const data = await response.json()
      set({ activities: data.data || [], loading: false, error: null })
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to fetch processing activities' })
    }
  },

  fetchDeletedActivities: async () => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`${API_URL}/privacyops/ropa/deleted`, {
        headers: getAuthHeaders(),
      })
      const data = await response.json()
      set({ deletedActivities: data.data || [], loading: false, error: null })
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to fetch deleted activities' })
    }
  },

  createActivity: async (data) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`${API_URL}/privacyops/ropa`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({ activities: [...state.activities, result.data], loading: false, error: null }))
      } else {
        throw new Error(result.error || 'Failed to create activity')
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to create processing activity' })
      throw error
    }
  },

  updateActivity: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`${API_URL}/privacyops/ropa/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({
          activities: state.activities.map((a) => (a.id === id ? { ...a, ...data } : a)),
          loading: false,
          error: null,
        }))
      } else {
        throw new Error(result.error || 'Failed to update activity')
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to update processing activity' })
      throw error
    }
  },

  deleteActivity: async (id) => {
    try {
      const response = await fetch(`${API_URL}/privacyops/ropa/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({
          activities: state.activities.filter((a) => a.id !== id),
        }))
      } else {
        throw new Error(result.error || 'Failed to delete activity')
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete processing activity' })
      throw error
    }
  },

  restoreActivity: async (id) => {
    try {
      const response = await fetch(`${API_URL}/privacyops/ropa/${id}/restore`, {
        method: 'POST',
        headers: getAuthHeaders(),
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({
          deletedActivities: state.deletedActivities.filter((a) => a.id !== id),
        }))
      } else {
        throw new Error(result.error || 'Failed to restore activity')
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to restore processing activity' })
      throw error
    }
  },

  permanentDeleteActivity: async (id) => {
    try {
      const response = await fetch(`${API_URL}/privacyops/ropa/${id}/permanent`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({
          deletedActivities: state.deletedActivities.filter((a) => a.id !== id),
        }))
      } else {
        throw new Error(result.error || 'Failed to permanently delete activity')
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to permanently delete processing activity' })
      throw error
    }
  },

  getStats: async () => {
    // Stats are fetched separately
  },
}))
