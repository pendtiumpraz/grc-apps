import { create } from 'zustand'

export interface Obligation {
  id: number
  regulation: string
  regulationType: string
  article: string
  requirement: string
  category: string
  status: string
  control: string
  lastReviewed: string
  nextReview: string
  owner: string
  createdAt: string
}

interface RegOpsObligationMappingStore {
  obligations: Obligation[]
  loading: boolean
  error: string | null
  
  fetchObligations: () => Promise<void>
  createObligation: (data: Partial<Obligation>) => Promise<void>
  updateObligation: (id: number, data: Partial<Obligation>) => Promise<void>
  deleteObligation: (id: number) => Promise<void>
  getStats: () => Promise<void>
  getObligationStats: () => Promise<void>
}

export const useRegOpsObligationMappingStore = create<RegOpsObligationMappingStore>((set) => ({
  obligations: [],
  loading: false,
  error: null,
  
  fetchObligations: async () => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/regops/obligations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      set({ obligations: data.data || [], loading: false, error: null })
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to fetch obligations' })
    }
  },
  
  createObligation: async (data) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/regops/obligations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({ obligations: [...state.obligations, result.data], loading: false, error: null }))
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to create obligation' })
    }
  },
  
  updateObligation: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/regops/obligations/${id}`, {
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
          obligations: state.obligations.map((o) => (o.id === id ? { ...o, ...data } : o)),
          loading: false,
          error: null,
        }))
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to update obligation' })
    }
  },
  
  deleteObligation: async (id) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/regops/obligations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({
          obligations: state.obligations.filter((o) => o.id !== id),
          loading: false,
          error: null,
        }))
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to delete obligation' })
    }
  },
  
  getStats: async () => {
    // Stats are fetched separately
  },
  
  getObligationStats: async () => {
    // Stats are fetched separately
  },
}))
