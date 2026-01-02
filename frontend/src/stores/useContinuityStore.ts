import { create } from 'zustand'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    }
}

export interface ContinuityPlan {
    id: number | string
    name: string
    businessImpactAnalysis: string
    criticalFunctions: string
    recoveryTimeObjective: string
    recoveryPointObjective: string
    recoveryStrategies: string
    backupProcedures: string
    communicationPlan: string
    testingSchedule: string
    lastTestDate: string
    nextTestDate: string
    owner: string
    status: 'draft' | 'active' | 'under_review' | 'archived'
    priority: 'low' | 'medium' | 'high' | 'critical'
    createdAt?: string
    deleted_at?: string
}

interface ContinuityStore {
    plans: ContinuityPlan[]
    deletedPlans: ContinuityPlan[]
    loading: boolean
    error: string | null

    fetchPlans: () => Promise<void>
    fetchDeletedPlans: () => Promise<void>
    createPlan: (data: Partial<ContinuityPlan>) => Promise<void>
    updatePlan: (id: number | string, data: Partial<ContinuityPlan>) => Promise<void>
    deletePlan: (id: number | string) => Promise<void>
    restorePlan: (id: number | string) => Promise<void>
    permanentDeletePlan: (id: number | string) => Promise<void>
    activatePlan: (id: number | string) => Promise<void>
}

export const useContinuityStore = create<ContinuityStore>((set) => ({
    plans: [],
    deletedPlans: [],
    loading: false,
    error: null,

    fetchPlans: async () => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/riskops/business-continuity`, {
                headers: getAuthHeaders(),
            })
            const data = await response.json()
            set({ plans: data.data || [], loading: false, error: null })
        } catch (error: any) {
            set({ loading: false, error: error.message || 'Failed to fetch continuity plans' })
        }
    },

    fetchDeletedPlans: async () => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/riskops/business-continuity/deleted`, {
                headers: getAuthHeaders(),
            })
            const data = await response.json()
            set({ deletedPlans: data.data || [], loading: false, error: null })
        } catch (error: any) {
            set({ loading: false, error: error.message || 'Failed to fetch deleted plans' })
        }
    },

    createPlan: async (data) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/riskops/business-continuity`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({ plans: [...state.plans, result.data], loading: false, error: null }))
            } else {
                throw new Error(result.error || 'Failed to create plan')
            }
        } catch (error: any) {
            set({ loading: false, error: error.message })
            throw error
        }
    },

    updatePlan: async (id, data) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/riskops/business-continuity/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({
                    plans: state.plans.map((p) => (p.id === id ? { ...p, ...data } : p)),
                    loading: false,
                    error: null,
                }))
            } else {
                throw new Error(result.error || 'Failed to update plan')
            }
        } catch (error: any) {
            set({ loading: false, error: error.message })
            throw error
        }
    },

    deletePlan: async (id) => {
        try {
            const response = await fetch(`${API_URL}/riskops/business-continuity/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({
                    plans: state.plans.filter((p) => p.id !== id),
                }))
            } else {
                throw new Error(result.error || 'Failed to delete plan')
            }
        } catch (error: any) {
            set({ error: error.message })
            throw error
        }
    },

    restorePlan: async (id) => {
        try {
            const response = await fetch(`${API_URL}/riskops/business-continuity/${id}/restore`, {
                method: 'POST',
                headers: getAuthHeaders(),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({
                    deletedPlans: state.deletedPlans.filter((p) => p.id !== id),
                }))
            } else {
                throw new Error(result.error || 'Failed to restore plan')
            }
        } catch (error: any) {
            set({ error: error.message })
            throw error
        }
    },

    permanentDeletePlan: async (id) => {
        try {
            const response = await fetch(`${API_URL}/riskops/business-continuity/${id}/permanent`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({
                    deletedPlans: state.deletedPlans.filter((p) => p.id !== id),
                }))
            } else {
                throw new Error(result.error || 'Failed to permanently delete plan')
            }
        } catch (error: any) {
            set({ error: error.message })
            throw error
        }
    },

    activatePlan: async (id) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/riskops/business-continuity/${id}/activate`, {
                method: 'POST',
                headers: getAuthHeaders(),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({
                    plans: state.plans.map((p) => (p.id === id ? { ...p, status: 'active' } : p)),
                    loading: false,
                    error: null,
                }))
            } else {
                throw new Error(result.error || 'Failed to activate plan')
            }
        } catch (error: any) {
            set({ loading: false, error: error.message })
            throw error
        }
    },
}))
