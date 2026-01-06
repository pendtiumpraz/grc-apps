import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types
export interface KRI {
  id: number
  tenantId: number
  name: string
  description: string
  category: string
  thresholdLow: number
  thresholdHigh: number
  currentValue: number
  unit: string
  status: 'normal' | 'warning' | 'critical'
  owner: string
  frequency: string
  lastUpdated: string
  createdAt: string
  updatedAt: string
}

interface GovernanceState {
  kris: KRI[]
  loading: boolean
  error: string | null
  fetchKRIs: () => Promise<void>
  createKRI: (data: Partial<KRI>) => Promise<void>
  updateKRI: (id: number, data: Partial<KRI>) => Promise<void>
  deleteKRI: (id: number) => Promise<void>
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

export const useAuditOpsGovernanceStore = create<GovernanceState>()(
  persist(
    (set) => ({
      kris: [],
      loading: false,
      error: null,

      fetchKRIs: async () => {
        set({ loading: true, error: null })
        try {
          const token = localStorage.getItem('token')
          const response = await fetch(`${API_BASE}/api/auditops/governance/kri`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })

          if (!response.ok) {
            set({ kris: [], loading: false, error: null })
            return
          }

          const data = await response.json()
          set({ kris: data.data || [], loading: false })
        } catch (error) {
          set({ kris: [], loading: false, error: null })
        }
      },

      createKRI: async (data) => {
        set({ loading: true, error: null })
        try {
          const token = localStorage.getItem('token')
          const response = await fetch(`${API_BASE}/api/auditops/governance/kri`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })

          if (!response.ok) {
            throw new Error('Failed to create KRI')
          }

          const newKRI = await response.json()
          set((state) => ({
            kris: [...state.kris, newKRI.data],
            loading: false,
          }))
        } catch (error) {
          set({ error: (error as Error).message, loading: false })
          throw error
        }
      },

      updateKRI: async (id, data) => {
        set({ loading: true, error: null })
        try {
          const token = localStorage.getItem('token')
          const response = await fetch(`${API_BASE}/api/auditops/governance/kri/${id}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })

          if (!response.ok) {
            throw new Error('Failed to update KRI')
          }

          const updatedKRI = await response.json()
          set((state) => ({
            kris: state.kris.map((kri) =>
              kri.id === id ? updatedKRI.data : kri
            ),
            loading: false,
          }))
        } catch (error) {
          set({ error: (error as Error).message, loading: false })
          throw error
        }
      },

      deleteKRI: async (id) => {
        set({ loading: true, error: null })
        try {
          const token = localStorage.getItem('token')
          const response = await fetch(`${API_BASE}/api/auditops/governance/kri/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })

          if (!response.ok) {
            throw new Error('Failed to delete KRI')
          }

          set((state) => ({
            kris: state.kris.filter((kri) => kri.id !== id),
            loading: false,
          }))
        } catch (error) {
          set({ error: (error as Error).message, loading: false })
          throw error
        }
      },
    }),
    {
      name: 'auditops-governance-storage',
      partialize: (state) => ({ kris: state.kris }),
    }
  )
)
