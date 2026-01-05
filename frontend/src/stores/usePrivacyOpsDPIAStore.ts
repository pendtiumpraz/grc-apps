import { create } from 'zustand'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    }
}

export interface DPIA {
    id: number
    name: string
    processingActivity: string
    riskLevel: 'high' | 'medium' | 'low'
    status: 'pending' | 'in_progress' | 'completed' | 'approved'
    score: number
    date: string
    owner: string
    description: string
    necessity: string
    proportionality: string
    riskMitigation: string
    dataCategories: string
    dataSubjects: string
    thirdParties: string
    createdAt?: string
    deleted_at?: string
}

interface PrivacyOpsDPIAStore {
    dpias: DPIA[]
    deletedDpias: DPIA[]
    loading: boolean
    error: string | null

    fetchDPIAs: () => Promise<void>
    fetchDeletedDPIAs: () => Promise<void>
    createDPIA: (data: Partial<DPIA>) => Promise<void>
    updateDPIA: (id: number, data: Partial<DPIA>) => Promise<void>
    deleteDPIA: (id: number) => Promise<void>
    restoreDPIA: (id: number) => Promise<void>
    permanentDeleteDPIA: (id: number) => Promise<void>
    approveDPIA: (id: number) => Promise<void>
    getStats: () => Promise<any>
}

export const usePrivacyOpsDPIAStore = create<PrivacyOpsDPIAStore>((set) => ({
    dpias: [],
    deletedDpias: [],
    loading: false,
    error: null,

    fetchDPIAs: async () => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/privacyops/dpiass`, {
                headers: getAuthHeaders(),
            })
            if (!response.ok) {
                set({ dpias: [], loading: false, error: null })
                return
            }
            const data = await response.json()
            set({ dpias: data.data || [], loading: false, error: null })
        } catch (error: any) {
            set({ dpias: [], loading: false, error: null })
        }
    },

    fetchDeletedDPIAs: async () => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/privacyops/dpias/deleted`, {
                headers: getAuthHeaders(),
            })
            const data = await response.json()
            set({ deletedDpias: data.data || [], loading: false, error: null })
        } catch (error: any) {
            set({ loading: false, error: error.message || 'Failed to fetch deleted DPIAs' })
        }
    },

    createDPIA: async (data) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/privacyops/dpias`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({ dpias: [...state.dpias, result.data], loading: false, error: null }))
            } else {
                throw new Error(result.error || 'Failed to create DPIA')
            }
        } catch (error: any) {
            set({ loading: false, error: error.message || 'Failed to create DPIA' })
            throw error
        }
    },

    updateDPIA: async (id, data) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/privacyops/dpias/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({
                    dpias: state.dpias.map((d) => (d.id === id ? { ...d, ...data } : d)),
                    loading: false,
                    error: null,
                }))
            } else {
                throw new Error(result.error || 'Failed to update DPIA')
            }
        } catch (error: any) {
            set({ loading: false, error: error.message || 'Failed to update DPIA' })
            throw error
        }
    },

    deleteDPIA: async (id) => {
        try {
            const response = await fetch(`${API_URL}/privacyops/dpias/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({
                    dpias: state.dpias.filter((d) => d.id !== id),
                }))
            } else {
                throw new Error(result.error || 'Failed to delete DPIA')
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to delete DPIA' })
            throw error
        }
    },

    restoreDPIA: async (id) => {
        try {
            const response = await fetch(`${API_URL}/privacyops/dpias/${id}/restore`, {
                method: 'POST',
                headers: getAuthHeaders(),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({
                    deletedDpias: state.deletedDpias.filter((d) => d.id !== id),
                }))
            } else {
                throw new Error(result.error || 'Failed to restore DPIA')
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to restore DPIA' })
            throw error
        }
    },

    permanentDeleteDPIA: async (id) => {
        try {
            const response = await fetch(`${API_URL}/privacyops/dpias/${id}/permanent`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({
                    deletedDpias: state.deletedDpias.filter((d) => d.id !== id),
                }))
            } else {
                throw new Error(result.error || 'Failed to permanently delete DPIA')
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to permanently delete DPIA' })
            throw error
        }
    },

    approveDPIA: async (id) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/privacyops/dpias/${id}/approve`, {
                method: 'POST',
                headers: getAuthHeaders(),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({
                    dpias: state.dpias.map((d) => (d.id === id ? { ...d, status: 'approved' } : d)),
                    loading: false,
                    error: null,
                }))
            } else {
                throw new Error(result.error || 'Failed to approve DPIA')
            }
        } catch (error: any) {
            set({ loading: false, error: error.message || 'Failed to approve DPIA' })
            throw error
        }
    },

    getStats: async () => {
        try {
            const response = await fetch(`${API_URL}/privacyops/dpias/stats`, {
                headers: getAuthHeaders(),
            })
            const data = await response.json()
            return data.data
        } catch (error: any) {
            console.error('Failed to fetch DPIA stats:', error)
            return null
        }
    },
}))
