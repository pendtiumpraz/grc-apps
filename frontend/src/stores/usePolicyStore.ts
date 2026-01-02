import { create } from 'zustand'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    }
}

export interface Policy {
    id: number | string
    name: string
    type: string
    version: string
    description: string
    content: string
    effectiveDate: string
    reviewDate: string
    expiryDate: string
    owner: string
    approver: string
    status: 'draft' | 'pending_approval' | 'approved' | 'published' | 'archived'
    category: string
    createdAt?: string
    deleted_at?: string
}

interface PolicyStore {
    policies: Policy[]
    deletedPolicies: Policy[]
    loading: boolean
    error: string | null

    fetchPolicies: () => Promise<void>
    fetchDeletedPolicies: () => Promise<void>
    createPolicy: (data: Partial<Policy>) => Promise<void>
    updatePolicy: (id: number | string, data: Partial<Policy>) => Promise<void>
    deletePolicy: (id: number | string) => Promise<void>
    restorePolicy: (id: number | string) => Promise<void>
    permanentDeletePolicy: (id: number | string) => Promise<void>
    publishPolicy: (id: number | string) => Promise<void>
}

export const usePolicyStore = create<PolicyStore>((set) => ({
    policies: [],
    deletedPolicies: [],
    loading: false,
    error: null,

    fetchPolicies: async () => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/regops/policies`, {
                headers: getAuthHeaders(),
            })
            const data = await response.json()
            set({ policies: data.data || [], loading: false, error: null })
        } catch (error: any) {
            set({ loading: false, error: error.message || 'Failed to fetch policies' })
        }
    },

    fetchDeletedPolicies: async () => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/regops/policies/deleted`, {
                headers: getAuthHeaders(),
            })
            const data = await response.json()
            set({ deletedPolicies: data.data || [], loading: false, error: null })
        } catch (error: any) {
            set({ loading: false, error: error.message || 'Failed to fetch deleted policies' })
        }
    },

    createPolicy: async (data) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/regops/policies`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({ policies: [...state.policies, result.data], loading: false, error: null }))
            } else {
                throw new Error(result.error || 'Failed to create policy')
            }
        } catch (error: any) {
            set({ loading: false, error: error.message })
            throw error
        }
    },

    updatePolicy: async (id, data) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/regops/policies/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({
                    policies: state.policies.map((p) => (p.id === id ? { ...p, ...data } : p)),
                    loading: false,
                    error: null,
                }))
            } else {
                throw new Error(result.error || 'Failed to update policy')
            }
        } catch (error: any) {
            set({ loading: false, error: error.message })
            throw error
        }
    },

    deletePolicy: async (id) => {
        try {
            const response = await fetch(`${API_URL}/regops/policies/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({ policies: state.policies.filter((p) => p.id !== id) }))
            } else {
                throw new Error(result.error || 'Failed to delete policy')
            }
        } catch (error: any) {
            set({ error: error.message })
            throw error
        }
    },

    restorePolicy: async (id) => {
        try {
            const response = await fetch(`${API_URL}/regops/policies/${id}/restore`, {
                method: 'POST',
                headers: getAuthHeaders(),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({ deletedPolicies: state.deletedPolicies.filter((p) => p.id !== id) }))
            } else {
                throw new Error(result.error || 'Failed to restore policy')
            }
        } catch (error: any) {
            set({ error: error.message })
            throw error
        }
    },

    permanentDeletePolicy: async (id) => {
        try {
            const response = await fetch(`${API_URL}/regops/policies/${id}/permanent`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({ deletedPolicies: state.deletedPolicies.filter((p) => p.id !== id) }))
            } else {
                throw new Error(result.error || 'Failed to permanently delete policy')
            }
        } catch (error: any) {
            set({ error: error.message })
            throw error
        }
    },

    publishPolicy: async (id) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/regops/policies/${id}/publish`, {
                method: 'POST',
                headers: getAuthHeaders(),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({
                    policies: state.policies.map((p) => (p.id === id ? { ...p, status: 'published' } : p)),
                    loading: false,
                    error: null,
                }))
            } else {
                throw new Error(result.error || 'Failed to publish policy')
            }
        } catch (error: any) {
            set({ loading: false, error: error.message })
            throw error
        }
    },
}))
