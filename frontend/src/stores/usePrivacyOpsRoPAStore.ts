import { create } from 'zustand'

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
}

interface PrivacyOpsRoPAStore {
  activities: ProcessingActivity[]
  loading: boolean
  error: string | null
  
  fetchActivities: () => Promise<void>
  createActivity: (data: Partial<ProcessingActivity>) => Promise<void>
  updateActivity: (id: number, data: Partial<ProcessingActivity>) => Promise<void>
  deleteActivity: (id: number) => Promise<void>
  getStats: () => Promise<void>
}

export const usePrivacyOpsRoPAStore = create<PrivacyOpsRoPAStore>((set) => ({
  activities: [],
  loading: false,
  error: null,
  
  fetchActivities: async () => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/privacyops/ropa', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      set({ activities: data.data || [], loading: false, error: null })
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to fetch processing activities' })
    }
  },
  
  createActivity: async (data) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/privacyops/ropa', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({ activities: [...state.activities, result.data], loading: false, error: null }))
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to create processing activity' })
    }
  },
  
  updateActivity: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/privacyops/ropa/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({
          activities: state.activities.map((a) => (a.id === id ? { ...a, ...data } : a)),
          loading: false,
          error: null,
        }))
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to update processing activity' })
    }
  },
  
  deleteActivity: async (id) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/privacyops/ropa/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({
          activities: state.activities.filter((a) => a.id !== id),
          loading: false,
          error: null,
        }))
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to delete processing activity' })
    }
  },
  
  getStats: async () => {
    // Stats are fetched separately
  },
}))
