import { create } from 'zustand'

export interface DSR {
  id: number
  requestType: string
  dataSubject: string
  email: string
  phone: string
  status: string
  priority: string
  submittedDate: string
  deadline: string
  completedDate: string
  assignedTo: string
  notes: string
  createdAt: string
  // Additional fields for frontend compatibility
  subjectName?: string
  dataCategories?: string
  owner?: string
  description?: string
}

interface PrivacyOpsDSRStore {
  dsrs: DSR[]
  loading: boolean
  error: string | null
  
  fetchDSRs: () => Promise<void>
  createDSR: (data: Partial<DSR>) => Promise<void>
  updateDSR: (id: number, data: Partial<DSR>) => Promise<void>
  deleteDSR: (id: number) => Promise<void>
  approveDSR: (id: number) => Promise<void>
  rejectDSR: (id: number) => Promise<void>
  getStats: () => Promise<void>
}

export const usePrivacyOpsDSRStore = create<PrivacyOpsDSRStore>((set) => ({
  dsrs: [],
  loading: false,
  error: null,
  
  fetchDSRs: async () => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/privacyops/dsr', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      set({ dsrs: data.data || [], loading: false, error: null })
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to fetch DSRs' })
    }
  },
  
  createDSR: async (data) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/privacyops/dsr', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({ dsrs: [...state.dsrs, result.data], loading: false, error: null }))
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to create DSR' })
    }
  },
  
  updateDSR: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/privacyops/dsr/${id}`, {
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
          dsrs: state.dsrs.map((d) => (d.id === id ? { ...d, ...data } : d)),
          loading: false,
          error: null,
        }))
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to update DSR' })
    }
  },
  
  deleteDSR: async (id) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/privacyops/dsr/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({
          dsrs: state.dsrs.filter((d) => d.id !== id),
          loading: false,
          error: null,
        }))
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to delete DSR' })
    }
  },
  
  approveDSR: async (id) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/privacyops/dsr/${id}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({
          dsrs: state.dsrs.map((d) => (d.id === id ? { ...d, status: 'approved' } : d)),
          loading: false,
          error: null,
        }))
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to approve DSR' })
    }
  },
  
  rejectDSR: async (id) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/privacyops/dsr/${id}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({
          dsrs: state.dsrs.map((d) => (d.id === id ? { ...d, status: 'rejected' } : d)),
          loading: false,
          error: null,
        }))
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to reject DSR' })
    }
  },
  
  getStats: async () => {
    // Stats are fetched separately
  },
}))
