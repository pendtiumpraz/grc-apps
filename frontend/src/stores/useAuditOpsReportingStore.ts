import { create } from 'zustand'

export interface Report {
  id: number
  name: string
  type: string
  category: string
  status: string
  period: string
  generatedDate: string
  lastUpdated: string
  owner: string
  description: string
  createdAt: string
}

interface AuditOpsReportingStore {
  reports: Report[]
  loading: boolean
  error: string | null
  
  fetchReports: () => Promise<void>
  createReport: (data: Partial<Report>) => Promise<void>
  updateReport: (id: number, data: Partial<Report>) => Promise<void>
  deleteReport: (id: number) => Promise<void>
  generateReport: (id: number) => Promise<void>
  getStats: () => Promise<void>
}

export const useAuditOpsReportingStore = create<AuditOpsReportingStore>((set) => ({
  reports: [],
  loading: false,
  error: null,
  
  fetchReports: async () => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/auditops/reports', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      set({ reports: data.data || [], loading: false, error: null })
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to fetch reports' })
    }
  },
  
  createReport: async (data) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/auditops/reports', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({ reports: [...state.reports, result.data], loading: false, error: null }))
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to create report' })
    }
  },
  
  updateReport: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/auditops/reports/${id}`, {
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
          reports: state.reports.map((r) => (r.id === id ? { ...r, ...data } : r)),
          loading: false,
          error: null,
        }))
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to update report' })
    }
  },
  
  deleteReport: async (id) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/auditops/reports/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({
          reports: state.reports.filter((r) => r.id !== id),
          loading: false,
          error: null,
        }))
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to delete report' })
    }
  },
  
  generateReport: async (id) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/auditops/reports/${id}/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({
          reports: state.reports.map((r) => (r.id === id ? { ...r, generatedDate: new Date().toISOString().split('T')[0] } : r)),
          loading: false,
          error: null,
        }))
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to generate report' })
    }
  },
  
  getStats: async () => {
    // Stats are fetched separately
  },
}))
