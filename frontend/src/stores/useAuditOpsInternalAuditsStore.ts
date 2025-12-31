import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types
export interface InternalAudit {
  id: number
  tenantId: number
  name: string
  scope: string
  objectives: string
  riskLevel: 'high' | 'medium' | 'low'
  status: 'planned' | 'in_progress' | 'completed'
  auditor: string
  auditDate: string
  frequency: string
  createdAt: string
  updatedAt: string
}

interface InternalAuditState {
  audits: InternalAudit[]
  loading: boolean
  error: string | null
  fetchAudits: () => Promise<void>
  createAudit: (data: Partial<InternalAudit>) => Promise<void>
  updateAudit: (id: number, data: Partial<InternalAudit>) => Promise<void>
  deleteAudit: (id: number) => Promise<void>
  startAudit: (id: number) => Promise<void>
  completeAudit: (id: number) => Promise<void>
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

export const useAuditOpsInternalAuditsStore = create<InternalAuditState>()(
  persist(
    (set) => ({
      audits: [],
      loading: false,
      error: null,

      fetchAudits: async () => {
        set({ loading: true, error: null })
        try {
          const token = localStorage.getItem('token')
          const response = await fetch(`${API_BASE}/api/auditops/internal-audits`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })

          if (!response.ok) {
            throw new Error('Failed to fetch internal audits')
          }

          const data = await response.json()
          set({ audits: data.data || [], loading: false })
        } catch (error) {
          set({ error: (error as Error).message, loading: false })
        }
      },

      createAudit: async (data) => {
        set({ loading: true, error: null })
        try {
          const token = localStorage.getItem('token')
          const response = await fetch(`${API_BASE}/api/auditops/internal-audits`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })

          if (!response.ok) {
            throw new Error('Failed to create internal audit')
          }

          const newAudit = await response.json()
          set((state) => ({
            audits: [...state.audits, newAudit.data],
            loading: false,
          }))
        } catch (error) {
          set({ error: (error as Error).message, loading: false })
          throw error
        }
      },

      updateAudit: async (id, data) => {
        set({ loading: true, error: null })
        try {
          const token = localStorage.getItem('token')
          const response = await fetch(`${API_BASE}/api/auditops/internal-audits/${id}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })

          if (!response.ok) {
            throw new Error('Failed to update internal audit')
          }

          const updatedAudit = await response.json()
          set((state) => ({
            audits: state.audits.map((audit) =>
              audit.id === id ? updatedAudit.data : audit
            ),
            loading: false,
          }))
        } catch (error) {
          set({ error: (error as Error).message, loading: false })
          throw error
        }
      },

      deleteAudit: async (id) => {
        set({ loading: true, error: null })
        try {
          const token = localStorage.getItem('token')
          const response = await fetch(`${API_BASE}/api/auditops/internal-audits/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })

          if (!response.ok) {
            throw new Error('Failed to delete internal audit')
          }

          set((state) => ({
            audits: state.audits.filter((audit) => audit.id !== id),
            loading: false,
          }))
        } catch (error) {
          set({ error: (error as Error).message, loading: false })
          throw error
        }
      },

      startAudit: async (id) => {
        set({ loading: true, error: null })
        try {
          const token = localStorage.getItem('token')
          const response = await fetch(`${API_BASE}/api/auditops/internal-audits/${id}/start`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })

          if (!response.ok) {
            throw new Error('Failed to start internal audit')
          }

          const updatedAudit = await response.json()
          set((state) => ({
            audits: state.audits.map((audit) =>
              audit.id === id ? updatedAudit.data : audit
            ),
            loading: false,
          }))
        } catch (error) {
          set({ error: (error as Error).message, loading: false })
          throw error
        }
      },

      completeAudit: async (id) => {
        set({ loading: true, error: null })
        try {
          const token = localStorage.getItem('token')
          const response = await fetch(`${API_BASE}/api/auditops/internal-audits/${id}/complete`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })

          if (!response.ok) {
            throw new Error('Failed to complete internal audit')
          }

          const updatedAudit = await response.json()
          set((state) => ({
            audits: state.audits.map((audit) =>
              audit.id === id ? updatedAudit.data : audit
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
      name: 'auditops-internal-audits-storage',
      partialize: (state) => ({ audits: state.audits }),
    }
  )
)
