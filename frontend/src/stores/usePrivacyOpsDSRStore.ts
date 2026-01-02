import { create } from 'zustand'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

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
  deleted_at?: string
  // Additional fields for frontend compatibility
  subjectName?: string
  dataCategories?: string
  owner?: string
  description?: string
}

interface PrivacyOpsDSRStore {
  dsrs: DSR[]
  deletedDsrs: DSR[]
  loading: boolean
  error: string | null

  fetchDSRs: () => Promise<void>
  fetchDeletedDSRs: () => Promise<void>
  createDSR: (data: Partial<DSR>) => Promise<void>
  updateDSR: (id: number, data: Partial<DSR>) => Promise<void>
  deleteDSR: (id: number) => Promise<void>
  restoreDSR: (id: number) => Promise<void>
  permanentDeleteDSR: (id: number) => Promise<void>
  approveDSR: (id: number) => Promise<void>
  rejectDSR: (id: number) => Promise<void>
  getStats: () => Promise<void>
}

export const usePrivacyOpsDSRStore = create<PrivacyOpsDSRStore>((set) => ({
  dsrs: [],
  deletedDsrs: [],
  loading: false,
  error: null,

  fetchDSRs: async () => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`${API_URL}/privacyops/dsr`, {
        headers: getAuthHeaders(),
      })
      const data = await response.json()
      set({ dsrs: data.data || [], loading: false, error: null })
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to fetch DSRs' })
    }
  },

  fetchDeletedDSRs: async () => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`${API_URL}/privacyops/dsr/deleted`, {
        headers: getAuthHeaders(),
      })
      const data = await response.json()
      set({ deletedDsrs: data.data || [], loading: false, error: null })
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to fetch deleted DSRs' })
    }
  },

  createDSR: async (data) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`${API_URL}/privacyops/dsr`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({ dsrs: [...state.dsrs, result.data], loading: false, error: null }))
      } else {
        throw new Error(result.error || 'Failed to create DSR')
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to create DSR' })
      throw error
    }
  },

  updateDSR: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`${API_URL}/privacyops/dsr/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({
          dsrs: state.dsrs.map((d) => (d.id === id ? { ...d, ...data } : d)),
          loading: false,
          error: null,
        }))
      } else {
        throw new Error(result.error || 'Failed to update DSR')
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to update DSR' })
      throw error
    }
  },

  deleteDSR: async (id) => {
    try {
      const response = await fetch(`${API_URL}/privacyops/dsr/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({
          dsrs: state.dsrs.filter((d) => d.id !== id),
        }))
      } else {
        throw new Error(result.error || 'Failed to delete DSR')
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete DSR' })
      throw error
    }
  },

  restoreDSR: async (id) => {
    try {
      const response = await fetch(`${API_URL}/privacyops/dsr/${id}/restore`, {
        method: 'POST',
        headers: getAuthHeaders(),
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({
          deletedDsrs: state.deletedDsrs.filter((d) => d.id !== id),
        }))
      } else {
        throw new Error(result.error || 'Failed to restore DSR')
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to restore DSR' })
      throw error
    }
  },

  permanentDeleteDSR: async (id) => {
    try {
      const response = await fetch(`${API_URL}/privacyops/dsr/${id}/permanent`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({
          deletedDsrs: state.deletedDsrs.filter((d) => d.id !== id),
        }))
      } else {
        throw new Error(result.error || 'Failed to permanently delete DSR')
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to permanently delete DSR' })
      throw error
    }
  },

  approveDSR: async (id) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`${API_URL}/privacyops/dsr/${id}/approve`, {
        method: 'POST',
        headers: getAuthHeaders(),
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({
          dsrs: state.dsrs.map((d) => (d.id === id ? { ...d, status: 'approved' } : d)),
          loading: false,
          error: null,
        }))
      } else {
        throw new Error(result.error || 'Failed to approve DSR')
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to approve DSR' })
      throw error
    }
  },

  rejectDSR: async (id) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`${API_URL}/privacyops/dsr/${id}/reject`, {
        method: 'POST',
        headers: getAuthHeaders(),
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({
          dsrs: state.dsrs.map((d) => (d.id === id ? { ...d, status: 'rejected' } : d)),
          loading: false,
          error: null,
        }))
      } else {
        throw new Error(result.error || 'Failed to reject DSR')
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to reject DSR' })
      throw error
    }
  },

  getStats: async () => {
    // Stats are fetched separately
  },
}))
