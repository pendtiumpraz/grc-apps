import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types
export interface AuditReport {
  id: number
  tenantId: number
  name: string
  description: string
  type: 'audit' | 'compliance' | 'risk' | 'governance'
  status: 'pending' | 'in_progress' | 'completed'
  period: string
  fileUrl: string
  generatedBy: string
  generatedAt: string
  createdAt: string
  updatedAt: string
}

interface ReportsState {
  reports: AuditReport[]
  loading: boolean
  error: string | null
  fetchReports: () => Promise<void>
  createReport: (data: Partial<AuditReport>) => Promise<void>
  updateReport: (id: number, data: Partial<AuditReport>) => Promise<void>
  deleteReport: (id: number) => Promise<void>
  generateReport: (id: number) => Promise<void>
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

export const useAuditOpsReportsStore = create<ReportsState>()(
  persist(
    (set) => ({
      reports: [],
      loading: false,
      error: null,

      fetchReports: async () => {
        set({ loading: true, error: null })
        try {
          const token = localStorage.getItem('token')
          const response = await fetch(`${API_BASE}/api/auditops/reports`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })

          if (!response.ok) {
            set({ reports: [], loading: false, error: null })
            return
          }

          const data = await response.json()
          set({ reports: data.data || [], loading: false })
        } catch (error) {
          set({ reports: [], loading: false, error: null })
        }
      },

      createReport: async (data) => {
        set({ loading: true, error: null })
        try {
          const token = localStorage.getItem('token')
          const response = await fetch(`${API_BASE}/api/auditops/reports`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })

          if (!response.ok) {
            throw new Error('Failed to create report')
          }

          const newReport = await response.json()
          set((state) => ({
            reports: [...state.reports, newReport.data],
            loading: false,
          }))
        } catch (error) {
          set({ error: (error as Error).message, loading: false })
          throw error
        }
      },

      updateReport: async (id, data) => {
        set({ loading: true, error: null })
        try {
          const token = localStorage.getItem('token')
          const response = await fetch(`${API_BASE}/api/auditops/reports/${id}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })

          if (!response.ok) {
            throw new Error('Failed to update report')
          }

          const updatedReport = await response.json()
          set((state) => ({
            reports: state.reports.map((report) =>
              report.id === id ? updatedReport.data : report
            ),
            loading: false,
          }))
        } catch (error) {
          set({ error: (error as Error).message, loading: false })
          throw error
        }
      },

      deleteReport: async (id) => {
        set({ loading: true, error: null })
        try {
          const token = localStorage.getItem('token')
          const response = await fetch(`${API_BASE}/api/auditops/reports/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })

          if (!response.ok) {
            throw new Error('Failed to delete report')
          }

          set((state) => ({
            reports: state.reports.filter((report) => report.id !== id),
            loading: false,
          }))
        } catch (error) {
          set({ error: (error as Error).message, loading: false })
          throw error
        }
      },

      generateReport: async (id) => {
        set({ loading: true, error: null })
        try {
          const token = localStorage.getItem('token')
          const response = await fetch(`${API_BASE}/api/auditops/reports/${id}/generate`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })

          if (!response.ok) {
            throw new Error('Failed to generate report')
          }

          const updatedReport = await response.json()
          set((state) => ({
            reports: state.reports.map((report) =>
              report.id === id ? updatedReport.data : report
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
      name: 'auditops-reports-storage',
      partialize: (state) => ({ reports: state.reports }),
    }
  )
)
