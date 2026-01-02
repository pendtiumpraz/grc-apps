import { create } from 'zustand'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    }
}

export interface Evidence {
    id: number | string
    name: string
    type: string
    description: string
    sourceSystem: string
    collectionDate: string
    expiryDate: string
    owner: string
    status: 'pending' | 'collected' | 'verified' | 'expired'
    controlId: string
    auditId: string
    filePath: string
    createdAt?: string
    deleted_at?: string
}

interface EvidenceStore {
    evidences: Evidence[]
    deletedEvidences: Evidence[]
    loading: boolean
    error: string | null

    fetchEvidences: () => Promise<void>
    fetchDeletedEvidences: () => Promise<void>
    createEvidence: (data: Partial<Evidence>) => Promise<void>
    updateEvidence: (id: number | string, data: Partial<Evidence>) => Promise<void>
    deleteEvidence: (id: number | string) => Promise<void>
    restoreEvidence: (id: number | string) => Promise<void>
    permanentDeleteEvidence: (id: number | string) => Promise<void>
    verifyEvidence: (id: number | string) => Promise<void>
}

export const useEvidenceStore = create<EvidenceStore>((set) => ({
    evidences: [],
    deletedEvidences: [],
    loading: false,
    error: null,

    fetchEvidences: async () => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/auditops/evidence`, {
                headers: getAuthHeaders(),
            })
            const data = await response.json()
            set({ evidences: data.data || [], loading: false, error: null })
        } catch (error: any) {
            set({ loading: false, error: error.message || 'Failed to fetch evidences' })
        }
    },

    fetchDeletedEvidences: async () => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/auditops/evidence/deleted`, {
                headers: getAuthHeaders(),
            })
            const data = await response.json()
            set({ deletedEvidences: data.data || [], loading: false, error: null })
        } catch (error: any) {
            set({ loading: false, error: error.message || 'Failed to fetch deleted evidences' })
        }
    },

    createEvidence: async (data) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/auditops/evidence`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({ evidences: [...state.evidences, result.data], loading: false, error: null }))
            } else {
                throw new Error(result.error || 'Failed to create evidence')
            }
        } catch (error: any) {
            set({ loading: false, error: error.message })
            throw error
        }
    },

    updateEvidence: async (id, data) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/auditops/evidence/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({
                    evidences: state.evidences.map((e) => (e.id === id ? { ...e, ...data } : e)),
                    loading: false,
                    error: null,
                }))
            } else {
                throw new Error(result.error || 'Failed to update evidence')
            }
        } catch (error: any) {
            set({ loading: false, error: error.message })
            throw error
        }
    },

    deleteEvidence: async (id) => {
        try {
            const response = await fetch(`${API_URL}/auditops/evidence/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({ evidences: state.evidences.filter((e) => e.id !== id) }))
            } else {
                throw new Error(result.error || 'Failed to delete evidence')
            }
        } catch (error: any) {
            set({ error: error.message })
            throw error
        }
    },

    restoreEvidence: async (id) => {
        try {
            const response = await fetch(`${API_URL}/auditops/evidence/${id}/restore`, {
                method: 'POST',
                headers: getAuthHeaders(),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({ deletedEvidences: state.deletedEvidences.filter((e) => e.id !== id) }))
            } else {
                throw new Error(result.error || 'Failed to restore evidence')
            }
        } catch (error: any) {
            set({ error: error.message })
            throw error
        }
    },

    permanentDeleteEvidence: async (id) => {
        try {
            const response = await fetch(`${API_URL}/auditops/evidence/${id}/permanent`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({ deletedEvidences: state.deletedEvidences.filter((e) => e.id !== id) }))
            } else {
                throw new Error(result.error || 'Failed to permanently delete evidence')
            }
        } catch (error: any) {
            set({ error: error.message })
            throw error
        }
    },

    verifyEvidence: async (id) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/auditops/evidence/${id}/verify`, {
                method: 'POST',
                headers: getAuthHeaders(),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({
                    evidences: state.evidences.map((e) => (e.id === id ? { ...e, status: 'verified' } : e)),
                    loading: false,
                    error: null,
                }))
            } else {
                throw new Error(result.error || 'Failed to verify evidence')
            }
        } catch (error: any) {
            set({ loading: false, error: error.message })
            throw error
        }
    },
}))
