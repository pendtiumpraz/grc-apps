import { create } from 'zustand'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    }
}

export interface Obligation {
    id: number | string
    name: string
    regulation: string
    requirement: string
    description: string
    status: 'pending' | 'in_progress' | 'compliant' | 'non_compliant'
    owner: string
    dueDate: string
    completionDate: string
    evidence: string
    priority: 'low' | 'medium' | 'high' | 'critical'
    createdAt?: string
    deleted_at?: string
}

interface ObligationStore {
    obligations: Obligation[]
    deletedObligations: Obligation[]
    loading: boolean
    error: string | null

    fetchObligations: () => Promise<void>
    fetchDeletedObligations: () => Promise<void>
    createObligation: (data: Partial<Obligation>) => Promise<void>
    updateObligation: (id: number | string, data: Partial<Obligation>) => Promise<void>
    deleteObligation: (id: number | string) => Promise<void>
    restoreObligation: (id: number | string) => Promise<void>
    permanentDeleteObligation: (id: number | string) => Promise<void>
}

export const useObligationStore = create<ObligationStore>((set) => ({
    obligations: [],
    deletedObligations: [],
    loading: false,
    error: null,

    fetchObligations: async () => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/regops/obligations`, {
                headers: getAuthHeaders(),
            })
            const data = await response.json()
            set({ obligations: data.data || [], loading: false, error: null })
        } catch (error: any) {
            set({ loading: false, error: error.message || 'Failed to fetch obligations' })
        }
    },

    fetchDeletedObligations: async () => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/regops/obligations/deleted`, {
                headers: getAuthHeaders(),
            })
            const data = await response.json()
            set({ deletedObligations: data.data || [], loading: false, error: null })
        } catch (error: any) {
            set({ loading: false, error: error.message || 'Failed to fetch deleted obligations' })
        }
    },

    createObligation: async (data) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/regops/obligations`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({ obligations: [...state.obligations, result.data], loading: false, error: null }))
            } else {
                throw new Error(result.error || 'Failed to create obligation')
            }
        } catch (error: any) {
            set({ loading: false, error: error.message })
            throw error
        }
    },

    updateObligation: async (id, data) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/regops/obligations/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({
                    obligations: state.obligations.map((o) => (o.id === id ? { ...o, ...data } : o)),
                    loading: false,
                    error: null,
                }))
            } else {
                throw new Error(result.error || 'Failed to update obligation')
            }
        } catch (error: any) {
            set({ loading: false, error: error.message })
            throw error
        }
    },

    deleteObligation: async (id) => {
        try {
            const response = await fetch(`${API_URL}/regops/obligations/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({ obligations: state.obligations.filter((o) => o.id !== id) }))
            } else {
                throw new Error(result.error || 'Failed to delete obligation')
            }
        } catch (error: any) {
            set({ error: error.message })
            throw error
        }
    },

    restoreObligation: async (id) => {
        try {
            const response = await fetch(`${API_URL}/regops/obligations/${id}/restore`, {
                method: 'POST',
                headers: getAuthHeaders(),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({ deletedObligations: state.deletedObligations.filter((o) => o.id !== id) }))
            } else {
                throw new Error(result.error || 'Failed to restore obligation')
            }
        } catch (error: any) {
            set({ error: error.message })
            throw error
        }
    },

    permanentDeleteObligation: async (id) => {
        try {
            const response = await fetch(`${API_URL}/regops/obligations/${id}/permanent`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({ deletedObligations: state.deletedObligations.filter((o) => o.id !== id) }))
            } else {
                throw new Error(result.error || 'Failed to permanently delete obligation')
            }
        } catch (error: any) {
            set({ error: error.message })
            throw error
        }
    },
}))
