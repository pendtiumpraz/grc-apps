import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types
export interface PrivacyIncident {
  id: number
  tenantId: number
  title: string
  description: string
  type: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  status: 'reported' | 'in_progress' | 'resolved'
  affectedData: string
  affectedUsers: string
  detectedBy: string
  owner: string
  detectedAt: string
  resolvedAt: string
  createdAt: string
  updatedAt: string
}

interface IncidentsState {
  incidents: PrivacyIncident[]
  loading: boolean
  error: string | null
  fetchIncidents: () => Promise<void>
  createIncident: (data: Partial<PrivacyIncident>) => Promise<void>
  updateIncident: (id: number, data: Partial<PrivacyIncident>) => Promise<void>
  deleteIncident: (id: number) => Promise<void>
  resolveIncident: (id: number) => Promise<void>
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

export const usePrivacyOpsIncidentsStore = create<IncidentsState>()(
  persist(
    (set) => ({
      incidents: [],
      loading: false,
      error: null,

      fetchIncidents: async () => {
        set({ loading: true, error: null })
        try {
          const token = localStorage.getItem('token')
          const response = await fetch(`${API_BASE}/api/privacyops/incidents`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })

          if (!response.ok) {
            throw new Error('Failed to fetch privacy incidents')
          }

          const data = await response.json()
          set({ incidents: data.data || [], loading: false })
        } catch (error) {
          set({ error: (error as Error).message, loading: false })
        }
      },

      createIncident: async (data) => {
        set({ loading: true, error: null })
        try {
          const token = localStorage.getItem('token')
          const response = await fetch(`${API_BASE}/api/privacyops/incidents`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })

          if (!response.ok) {
            throw new Error('Failed to create privacy incident')
          }

          const newIncident = await response.json()
          set((state) => ({
            incidents: [...state.incidents, newIncident.data],
            loading: false,
          }))
        } catch (error) {
          set({ error: (error as Error).message, loading: false })
          throw error
        }
      },

      updateIncident: async (id, data) => {
        set({ loading: true, error: null })
        try {
          const token = localStorage.getItem('token')
          const response = await fetch(`${API_BASE}/api/privacyops/incidents/${id}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })

          if (!response.ok) {
            throw new Error('Failed to update privacy incident')
          }

          const updatedIncident = await response.json()
          set((state) => ({
            incidents: state.incidents.map((incident) =>
              incident.id === id ? updatedIncident.data : incident
            ),
            loading: false,
          }))
        } catch (error) {
          set({ error: (error as Error).message, loading: false })
          throw error
        }
      },

      deleteIncident: async (id) => {
        set({ loading: true, error: null })
        try {
          const token = localStorage.getItem('token')
          const response = await fetch(`${API_BASE}/api/privacyops/incidents/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })

          if (!response.ok) {
            throw new Error('Failed to delete privacy incident')
          }

          set((state) => ({
            incidents: state.incidents.filter((incident) => incident.id !== id),
            loading: false,
          }))
        } catch (error) {
          set({ error: (error as Error).message, loading: false })
          throw error
        }
      },

      resolveIncident: async (id) => {
        set({ loading: true, error: null })
        try {
          const token = localStorage.getItem('token')
          const response = await fetch(`${API_BASE}/api/privacyops/incidents/${id}/resolve`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })

          if (!response.ok) {
            throw new Error('Failed to resolve privacy incident')
          }

          const updatedIncident = await response.json()
          set((state) => ({
            incidents: state.incidents.map((incident) =>
              incident.id === id ? updatedIncident.data : incident
            ),
            loading: false,
          }))
        } catch (error) {
          set({ error: (error as Error).message, loading: false })
          throw error
        }
      },
    }),
    {
      name: 'privacyops-incidents-storage',
      partialize: (state) => ({ incidents: state.incidents }),
    }
  )
)
