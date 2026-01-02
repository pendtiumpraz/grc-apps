import { create } from 'zustand'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    }
}

export interface Audit {
    id: number | string
    name: string
    type: string
    scope: string
    objectives: string
    auditee: string
    auditor: string
    startDate: string
    endDate: string
    status: 'planned' | 'in_progress' | 'completed' | 'cancelled'
    findings: string
    recommendations: string
    priority: 'low' | 'medium' | 'high' | 'critical'
    createdAt?: string
    deleted_at?: string
}

interface AuditStore {
    audits: Audit[]
    deletedAudits: Audit[]
    loading: boolean
    error: string | null

    fetchAudits: () => Promise<void>
    fetchDeletedAudits: () => Promise<void>
    createAudit: (data: Partial<Audit>) => Promise<void>
    updateAudit: (id: number | string, data: Partial<Audit>) => Promise<void>
    deleteAudit: (id: number | string) => Promise<void>
    restoreAudit: (id: number | string) => Promise<void>
    permanentDeleteAudit: (id: number | string) => Promise<void>
    completeAudit: (id: number | string) => Promise<void>
}

export const useAuditStore = create<AuditStore>((set) => ({
    audits: [],
    deletedAudits: [],
    loading: false,
    error: null,

    fetchAudits: async () => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/auditops/internal-audits`, {
                headers: getAuthHeaders(),
            })
            const data = await response.json()
            set({ audits: data.data || [], loading: false, error: null })
        } catch (error: any) {
            set({ loading: false, error: error.message || 'Failed to fetch audits' })
        }
    },

    fetchDeletedAudits: async () => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/auditops/internal-audits/deleted`, {
                headers: getAuthHeaders(),
            })
            const data = await response.json()
            set({ deletedAudits: data.data || [], loading: false, error: null })
        } catch (error: any) {
            set({ loading: false, error: error.message || 'Failed to fetch deleted audits' })
        }
    },

    createAudit: async (data) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/auditops/internal-audits`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({ audits: [...state.audits, result.data], loading: false, error: null }))
            } else {
                throw new Error(result.error || 'Failed to create audit')
            }
        } catch (error: any) {
            set({ loading: false, error: error.message })
            throw error
        }
    },

    updateAudit: async (id, data) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/auditops/internal-audits/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({
                    audits: state.audits.map((a) => (a.id === id ? { ...a, ...data } : a)),
                    loading: false,
                    error: null,
                }))
            } else {
                throw new Error(result.error || 'Failed to update audit')
            }
        } catch (error: any) {
            set({ loading: false, error: error.message })
            throw error
        }
    },

    deleteAudit: async (id) => {
        try {
            const response = await fetch(`${API_URL}/auditops/internal-audits/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({ audits: state.audits.filter((a) => a.id !== id) }))
            } else {
                throw new Error(result.error || 'Failed to delete audit')
            }
        } catch (error: any) {
            set({ error: error.message })
            throw error
        }
    },

    restoreAudit: async (id) => {
        try {
            const response = await fetch(`${API_URL}/auditops/internal-audits/${id}/restore`, {
                method: 'POST',
                headers: getAuthHeaders(),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({ deletedAudits: state.deletedAudits.filter((a) => a.id !== id) }))
            } else {
                throw new Error(result.error || 'Failed to restore audit')
            }
        } catch (error: any) {
            set({ error: error.message })
            throw error
        }
    },

    permanentDeleteAudit: async (id) => {
        try {
            const response = await fetch(`${API_URL}/auditops/internal-audits/${id}/permanent`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({ deletedAudits: state.deletedAudits.filter((a) => a.id !== id) }))
            } else {
                throw new Error(result.error || 'Failed to permanently delete audit')
            }
        } catch (error: any) {
            set({ error: error.message })
            throw error
        }
    },

    completeAudit: async (id) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/auditops/internal-audits/${id}/complete`, {
                method: 'POST',
                headers: getAuthHeaders(),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({
                    audits: state.audits.map((a) => (a.id === id ? { ...a, status: 'completed' } : a)),
                    loading: false,
                    error: null,
                }))
            } else {
                throw new Error(result.error || 'Failed to complete audit')
            }
        } catch (error: any) {
            set({ loading: false, error: error.message })
            throw error
        }
    },
}))
