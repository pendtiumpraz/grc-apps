import { create } from 'zustand'

export interface InternalAudit {
  id: number
  name: string
  type: string
  scope: string
  status: string
  priority: string
  startDate: string
  endDate: string
  auditor: string
  findings: number
  recommendations: number
  owner: string
  description: string
  createdAt: string
}

interface AuditOpsInternalAuditStore {
  audits: InternalAudit[]
  loading: boolean
  error: string | null
  
  fetchAudits: () => Promise<void>
  createAudit: (data: Partial<InternalAudit>) => Promise<void>
  updateAudit: (id: number, data: Partial<InternalAudit>) => Promise<void>
  deleteAudit: (id: number) => Promise<void>
  getStats: () => Promise<void>
}

export const useAuditOpsInternalAuditStore = create<AuditOpsInternalAuditStore>((set) => ({
  audits: [],
  loading: false,
  error: null,
  
  fetchAudits: async () => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/auditops/internal-audits', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      set({ audits: data.data || [], loading: false, error: null })
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to fetch internal audits' })
    }
  },
  
  createAudit: async (data) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/auditops/internal-audits', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({ audits: [...state.audits, result.data], loading: false, error: null }))
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to create internal audit' })
    }
  },
  
  updateAudit: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/auditops/internal-audits/${id}`, {
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
          audits: state.audits.map((a) => (a.id === id ? { ...a, ...data } : a)),
          loading: false,
          error: null,
        }))
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to update internal audit' })
    }
  },
  
  deleteAudit: async (id) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/auditops/internal-audits/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({
          audits: state.audits.filter((a) => a.id !== id),
          loading: false,
          error: null,
        }))
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to delete internal audit' })
    }
  },
  
  getStats: async () => {
    // Stats are fetched separately
  },
}))
