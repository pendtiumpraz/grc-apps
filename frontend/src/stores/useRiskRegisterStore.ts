import { create } from 'zustand'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    }
}

export interface Risk {
    id: number | string
    name: string
    description: string
    category: 'operational' | 'financial' | 'compliance' | 'security' | 'strategic'
    likelihood: number
    impact: number
    riskScore: number
    status: 'open' | 'mitigating' | 'closed'
    owner: string
    mitigation: string
    controls: string
    targetDate: string
    lastUpdated: string
    createdAt?: string
    deleted_at?: string
}

interface RiskRegisterStore {
    risks: Risk[]
    deletedRisks: Risk[]
    loading: boolean
    error: string | null

    fetchRisks: () => Promise<void>
    fetchDeletedRisks: () => Promise<void>
    createRisk: (data: Partial<Risk>) => Promise<void>
    updateRisk: (id: number | string, data: Partial<Risk>) => Promise<void>
    deleteRisk: (id: number | string) => Promise<void>
    restoreRisk: (id: number | string) => Promise<void>
    permanentDeleteRisk: (id: number | string) => Promise<void>
    closeRisk: (id: number | string) => Promise<void>
}

export const useRiskRegisterStore = create<RiskRegisterStore>((set) => ({
    risks: [],
    deletedRisks: [],
    loading: false,
    error: null,

    fetchRisks: async () => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/riskops/risk-register`, {
                headers: getAuthHeaders(),
            })
            const data = await response.json()
            set({ risks: data.data || [], loading: false, error: null })
        } catch (error: any) {
            set({ loading: false, error: error.message || 'Failed to fetch risks' })
        }
    },

    fetchDeletedRisks: async () => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/riskops/risk-register/deleted`, {
                headers: getAuthHeaders(),
            })
            const data = await response.json()
            set({ deletedRisks: data.data || [], loading: false, error: null })
        } catch (error: any) {
            set({ loading: false, error: error.message || 'Failed to fetch deleted risks' })
        }
    },

    createRisk: async (data) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/riskops/risk-register`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({ risks: [...state.risks, result.data], loading: false, error: null }))
            } else {
                throw new Error(result.error || 'Failed to create risk')
            }
        } catch (error: any) {
            set({ loading: false, error: error.message || 'Failed to create risk' })
            throw error
        }
    },

    updateRisk: async (id, data) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/riskops/risk-register/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({
                    risks: state.risks.map((r) => (r.id === id ? { ...r, ...data } : r)),
                    loading: false,
                    error: null,
                }))
            } else {
                throw new Error(result.error || 'Failed to update risk')
            }
        } catch (error: any) {
            set({ loading: false, error: error.message || 'Failed to update risk' })
            throw error
        }
    },

    deleteRisk: async (id) => {
        try {
            const response = await fetch(`${API_URL}/riskops/risk-register/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({
                    risks: state.risks.filter((r) => r.id !== id),
                }))
            } else {
                throw new Error(result.error || 'Failed to delete risk')
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to delete risk' })
            throw error
        }
    },

    restoreRisk: async (id) => {
        try {
            const response = await fetch(`${API_URL}/riskops/risk-register/${id}/restore`, {
                method: 'POST',
                headers: getAuthHeaders(),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({
                    deletedRisks: state.deletedRisks.filter((r) => r.id !== id),
                }))
            } else {
                throw new Error(result.error || 'Failed to restore risk')
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to restore risk' })
            throw error
        }
    },

    permanentDeleteRisk: async (id) => {
        try {
            const response = await fetch(`${API_URL}/riskops/risk-register/${id}/permanent`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({
                    deletedRisks: state.deletedRisks.filter((r) => r.id !== id),
                }))
            } else {
                throw new Error(result.error || 'Failed to permanently delete risk')
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to permanently delete risk' })
            throw error
        }
    },

    closeRisk: async (id) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/riskops/risk-register/${id}/close`, {
                method: 'POST',
                headers: getAuthHeaders(),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({
                    risks: state.risks.map((r) => (r.id === id ? { ...r, status: 'closed' } : r)),
                    loading: false,
                    error: null,
                }))
            } else {
                throw new Error(result.error || 'Failed to close risk')
            }
        } catch (error: any) {
            set({ loading: false, error: error.message || 'Failed to close risk' })
            throw error
        }
    },
}))
