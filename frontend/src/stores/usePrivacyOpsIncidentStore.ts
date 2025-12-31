import { create } from 'zustand'

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
}

interface PrivacyOpsIncidentStore {
  incidents: Incident[]
  loading: boolean
  error: string | null
  
  fetchIncidents: () => Promise<void>
  createIncident: (data: Partial<Incident>) => Promise<void>
  updateIncident: (id: number, data: Partial<Incident>) => Promise<void>
  deleteIncident: (id: number) => Promise<void>
  resolveIncident: (id: number) => Promise<void>
  getStats: () => Promise<void>
}

export const usePrivacyOpsIncidentStore = create<PrivacyOpsIncidentStore>((set) => ({
  incidents: [],
  loading: false,
  error: null,
  
  fetchIncidents: async () => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/privacyops/incidents', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      set({ incidents: data.data || [], loading: false, error: null })
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to fetch incidents' })
    }
  },
  
  createIncident: async (data) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/privacyops/incidents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({ incidents: [...state.incidents, result.data], loading: false, error: null }))
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to create incident' })
    }
  },
  
  updateIncident: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/privacyops/incidents/${id}`, {
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
          incidents: state.incidents.map((i) => (i.id === id ? { ...i, ...data } : i)),
          loading: false,
          error: null,
        }))
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to update incident' })
    }
  },
  
  deleteIncident: async (id) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/privacyops/incidents/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({
          incidents: state.incidents.filter((i) => i.id !== id),
          loading: false,
          error: null,
        }))
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to delete incident' })
    }
  },
  
  resolveIncident: async (id) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/privacyops/incidents/${id}/resolve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({
          incidents: state.incidents.map((i) => (i.id === id ? { ...i, status: 'resolved' } : i)),
          loading: false,
          error: null,
        }))
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to resolve incident' })
    }
  },
  
  getStats: async () => {
    // Stats are fetched separately
  },
}))
