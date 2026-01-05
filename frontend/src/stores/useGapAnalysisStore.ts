import { create } from 'zustand'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    }
}

export interface GapAnalysis {
    id: number | string
    name: string
    framework: string
    currentState: string
    targetState: string
    gapDescription: string
    remediationPlan: string
    priority: 'low' | 'medium' | 'high' | 'critical'
    status: 'identified' | 'in_progress' | 'remediated' | 'accepted'
    owner: string
    targetDate: string
    completionDate: string
    createdAt?: string
    deleted_at?: string
}

interface GapAnalysisStore {
    gaps: GapAnalysis[]
    deletedGaps: GapAnalysis[]
    loading: boolean
    error: string | null

    fetchGaps: () => Promise<void>
    fetchDeletedGaps: () => Promise<void>
    createGap: (data: Partial<GapAnalysis>) => Promise<void>
    updateGap: (id: number | string, data: Partial<GapAnalysis>) => Promise<void>
    deleteGap: (id: number | string) => Promise<void>
    restoreGap: (id: number | string) => Promise<void>
    permanentDeleteGap: (id: number | string) => Promise<void>
}

export const useGapAnalysisStore = create<GapAnalysisStore>((set) => ({
    gaps: [],
    deletedGaps: [],
    loading: false,
    error: null,

    fetchGaps: async () => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/regops/gap-analysis`, {
                headers: getAuthHeaders(),
            })
            if (!response.ok) {
                set({ gaps: [], loading: false, error: null })
                return
            }
            const data = await response.json()
            set({ gaps: data.data || [], loading: false, error: null })
        } catch (error: any) {
            set({ loading: false, error: error.message || 'Failed to fetch gap analysis' })
        }
    },

    fetchDeletedGaps: async () => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/regops/gap-analysis/deleted`, {
                headers: getAuthHeaders(),
            })
            if (!response.ok) {
                set({ deletedGaps: [], loading: false, error: null })
                return
            }
            const data = await response.json()
            set({ deletedGaps: data.data || [], loading: false, error: null })
        } catch (error: any) {
            set({ loading: false, error: error.message || 'Failed to fetch deleted gaps' })
        }
    },

    createGap: async (data) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/regops/gap-analysis`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({ gaps: [...state.gaps, result.data], loading: false, error: null }))
            } else {
                throw new Error(result.error || 'Failed to create gap')
            }
        } catch (error: any) {
            set({ loading: false, error: error.message })
            throw error
        }
    },

    updateGap: async (id, data) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/regops/gap-analysis/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({
                    gaps: state.gaps.map((g) => (g.id === id ? { ...g, ...data } : g)),
                    loading: false,
                    error: null,
                }))
            } else {
                throw new Error(result.error || 'Failed to update gap')
            }
        } catch (error: any) {
            set({ loading: false, error: error.message })
            throw error
        }
    },

    deleteGap: async (id) => {
        try {
            const response = await fetch(`${API_URL}/regops/gap-analysis/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({ gaps: state.gaps.filter((g) => g.id !== id) }))
            } else {
                throw new Error(result.error || 'Failed to delete gap')
            }
        } catch (error: any) {
            set({ error: error.message })
            throw error
        }
    },

    restoreGap: async (id) => {
        try {
            const response = await fetch(`${API_URL}/regops/gap-analysis/${id}/restore`, {
                method: 'POST',
                headers: getAuthHeaders(),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({ deletedGaps: state.deletedGaps.filter((g) => g.id !== id) }))
            } else {
                throw new Error(result.error || 'Failed to restore gap')
            }
        } catch (error: any) {
            set({ error: error.message })
            throw error
        }
    },

    permanentDeleteGap: async (id) => {
        try {
            const response = await fetch(`${API_URL}/regops/gap-analysis/${id}/permanent`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({ deletedGaps: state.deletedGaps.filter((g) => g.id !== id) }))
            } else {
                throw new Error(result.error || 'Failed to permanently delete gap')
            }
        } catch (error: any) {
            set({ error: error.message })
            throw error
        }
    },
}))
