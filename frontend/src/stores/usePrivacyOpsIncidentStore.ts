import { create } from 'zustand'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

export interface Incident {
  id: number
  name: string
  type: string
  severity: string
  status: string
  discoveryDate: string
  reportedDate: string
  affectedRecords: number
  dataCategories: string
  rootCause: string
  mitigation: string
  owner: string
  description: string
  createdAt: string
  deleted_at?: string
}

interface PrivacyOpsIncidentStore {
  incidents: Incident[]
  deletedIncidents: Incident[]
  loading: boolean
  error: string | null

  fetchIncidents: () => Promise<void>
  fetchDeletedIncidents: () => Promise<void>
  createIncident: (data: Partial<Incident>) => Promise<void>
  updateIncident: (id: number, data: Partial<Incident>) => Promise<void>
  deleteIncident: (id: number) => Promise<void>
  restoreIncident: (id: number) => Promise<void>
  permanentDeleteIncident: (id: number) => Promise<void>
  resolveIncident: (id: number) => Promise<void>
  getStats: () => Promise<void>
}

export const usePrivacyOpsIncidentStore = create<PrivacyOpsIncidentStore>((set) => ({
  incidents: [],
  deletedIncidents: [],
  loading: false,
  error: null,

  fetchIncidents: async () => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`${API_URL}/privacyops/incidents`, {
        headers: getAuthHeaders(),
      })
      const data = await response.json()
      set({ incidents: data.data || [], loading: false, error: null })
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to fetch incidents' })
    }
  },

  fetchDeletedIncidents: async () => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`${API_URL}/privacyops/incidents/deleted`, {
        headers: getAuthHeaders(),
      })
      const data = await response.json()
      set({ deletedIncidents: data.data || [], loading: false, error: null })
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to fetch deleted incidents' })
    }
  },

  createIncident: async (data) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`${API_URL}/privacyops/incidents`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({ incidents: [...state.incidents, result.data], loading: false, error: null }))
      } else {
        throw new Error(result.error || 'Failed to create incident')
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to create incident' })
      throw error
    }
  },

  updateIncident: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`${API_URL}/privacyops/incidents/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({
          incidents: state.incidents.map((i) => (i.id === id ? { ...i, ...data } : i)),
          loading: false,
          error: null,
        }))
      } else {
        throw new Error(result.error || 'Failed to update incident')
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to update incident' })
      throw error
    }
  },

  deleteIncident: async (id) => {
    try {
      const response = await fetch(`${API_URL}/privacyops/incidents/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({
          incidents: state.incidents.filter((i) => i.id !== id),
        }))
      } else {
        throw new Error(result.error || 'Failed to delete incident')
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete incident' })
      throw error
    }
  },

  restoreIncident: async (id) => {
    try {
      const response = await fetch(`${API_URL}/privacyops/incidents/${id}/restore`, {
        method: 'POST',
        headers: getAuthHeaders(),
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({
          deletedIncidents: state.deletedIncidents.filter((i) => i.id !== id),
        }))
      } else {
        throw new Error(result.error || 'Failed to restore incident')
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to restore incident' })
      throw error
    }
  },

  permanentDeleteIncident: async (id) => {
    try {
      const response = await fetch(`${API_URL}/privacyops/incidents/${id}/permanent`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({
          deletedIncidents: state.deletedIncidents.filter((i) => i.id !== id),
        }))
      } else {
        throw new Error(result.error || 'Failed to permanently delete incident')
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to permanently delete incident' })
      throw error
    }
  },

  resolveIncident: async (id) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`${API_URL}/privacyops/incidents/${id}/resolve`, {
        method: 'POST',
        headers: getAuthHeaders(),
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({
          incidents: state.incidents.map((i) => (i.id === id ? { ...i, status: 'resolved' } : i)),
          loading: false,
          error: null,
        }))
      } else {
        throw new Error(result.error || 'Failed to resolve incident')
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to resolve incident' })
      throw error
    }
  },

  getStats: async () => {
    // Stats are fetched separately
  },
}))
