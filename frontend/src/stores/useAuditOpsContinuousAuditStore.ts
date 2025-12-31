import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types
export interface ContinuousAuditTest {
  id: number
  tenantId: number
  name: string
  description: string
  controlId: string
  controlName: string
  status: 'pending' | 'in_progress' | 'passed' | 'failed'
  severity: 'high' | 'medium' | 'low'
  result: string
  lastRun: string
  nextRun: string
  frequency: string
  owner: string
  createdAt: string
  updatedAt: string
}

interface ContinuousAuditState {
  tests: ContinuousAuditTest[]
  loading: boolean
  error: string | null
  fetchTests: () => Promise<void>
  createTest: (data: Partial<ContinuousAuditTest>) => Promise<void>
  updateTest: (id: number, data: Partial<ContinuousAuditTest>) => Promise<void>
  deleteTest: (id: number) => Promise<void>
  runTest: (id: number) => Promise<void>
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

export const useAuditOpsContinuousAuditStore = create<ContinuousAuditState>()(
  persist(
    (set) => ({
      tests: [],
      loading: false,
      error: null,

      fetchTests: async () => {
        set({ loading: true, error: null })
        try {
          const token = localStorage.getItem('token')
          const response = await fetch(`${API_BASE}/api/auditops/continuous-audit/tests`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })

          if (!response.ok) {
            throw new Error('Failed to fetch continuous audit tests')
          }

          const data = await response.json()
          set({ tests: data.data || [], loading: false })
        } catch (error) {
          set({ error: (error as Error).message, loading: false })
        }
      },

      createTest: async (data) => {
        set({ loading: true, error: null })
        try {
          const token = localStorage.getItem('token')
          const response = await fetch(`${API_BASE}/api/auditops/continuous-audit/tests`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })

          if (!response.ok) {
            throw new Error('Failed to create continuous audit test')
          }

          const newTest = await response.json()
          set((state) => ({
            tests: [...state.tests, newTest.data],
            loading: false,
          }))
        } catch (error) {
          set({ error: (error as Error).message, loading: false })
          throw error
        }
      },

      updateTest: async (id, data) => {
        set({ loading: true, error: null })
        try {
          const token = localStorage.getItem('token')
          const response = await fetch(`${API_BASE}/api/auditops/continuous-audit/tests/${id}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })

          if (!response.ok) {
            throw new Error('Failed to update continuous audit test')
          }

          const updatedTest = await response.json()
          set((state) => ({
            tests: state.tests.map((test) =>
              test.id === id ? updatedTest.data : test
            ),
            loading: false,
          }))
        } catch (error) {
          set({ error: (error as Error).message, loading: false })
          throw error
        }
      },

      deleteTest: async (id) => {
        set({ loading: true, error: null })
        try {
          const token = localStorage.getItem('token')
          const response = await fetch(`${API_BASE}/api/auditops/continuous-audit/tests/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })

          if (!response.ok) {
            throw new Error('Failed to delete continuous audit test')
          }

          set((state) => ({
            tests: state.tests.filter((test) => test.id !== id),
            loading: false,
          }))
        } catch (error) {
          set({ error: (error as Error).message, loading: false })
          throw error
        }
      },

      runTest: async (id) => {
        set({ loading: true, error: null })
        try {
          const token = localStorage.getItem('token')
          const response = await fetch(`${API_BASE}/api/auditops/continuous-audit/tests/${id}/run`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })

          if (!response.ok) {
            throw new Error('Failed to run continuous audit test')
          }

          const updatedTest = await response.json()
          set((state) => ({
            tests: state.tests.map((test) =>
              test.id === id ? updatedTest.data : test
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
      name: 'auditops-continuous-audit-storage',
      partialize: (state) => ({ tests: state.tests }),
    }
  )
)
