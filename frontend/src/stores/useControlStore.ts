import { create } from 'zustand'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    }
}

export interface Control {
    id: number | string
    code: string
    name: string
    framework: string
    type: 'preventive' | 'detective' | 'corrective' | 'compensating'
    status: 'active' | 'inactive' | 'draft'
    effectiveness: number
    lastTested: string
    owner: string
    description: string
    createdAt?: string
    deleted_at?: string
}

interface ControlStore {
    controls: Control[]
    deletedControls: Control[]
    loading: boolean
    error: string | null

    fetchControls: () => Promise<void>
    fetchDeletedControls: () => Promise<void>
    createControl: (data: Partial<Control>) => Promise<void>
    updateControl: (id: number | string, data: Partial<Control>) => Promise<void>
    deleteControl: (id: number | string) => Promise<void>
    restoreControl: (id: number | string) => Promise<void>
    permanentDeleteControl: (id: number | string) => Promise<void>
}

export const useControlStore = create<ControlStore>((set) => ({
    controls: [],
    deletedControls: [],
    loading: false,
    error: null,

    fetchControls: async () => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/regops/controls`, {
                headers: getAuthHeaders(),
            })
            if (!response.ok) {
                set({ controls: [], loading: false, error: null })
                return
            }
            const data = await response.json()
            set({ controls: data.data || [], loading: false, error: null })
        } catch (error: any) {
            set({ loading: false, error: error.message || 'Failed to fetch controls' })
        }
    },

    fetchDeletedControls: async () => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/regops/controls/deleted`, {
                headers: getAuthHeaders(),
            })
            if (!response.ok) {
                set({ deletedControls: [], loading: false, error: null })
                return
            }
            const data = await response.json()
            set({ deletedControls: data.data || [], loading: false, error: null })
        } catch (error: any) {
            set({ loading: false, error: error.message || 'Failed to fetch deleted controls' })
        }
    },

    createControl: async (data) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/regops/controls`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            })
            const result = await response.json()
            if (result.success || response.ok) {
                set((state) => ({ controls: [...state.controls, result.data], loading: false, error: null }))
            } else {
                throw new Error(result.error || 'Failed to create control')
            }
        } catch (error: any) {
            set({ loading: false, error: error.message })
            throw error
        }
    },

    updateControl: async (id, data) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/regops/controls/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            })
            const result = await response.json()
            if (result.success || response.ok) {
                set((state) => ({
                    controls: state.controls.map((c) => (c.id === id ? { ...c, ...data } : c)),
                    loading: false,
                    error: null,
                }))
            } else {
                throw new Error(result.error || 'Failed to update control')
            }
        } catch (error: any) {
            set({ loading: false, error: error.message })
            throw error
        }
    },

    deleteControl: async (id) => {
        try {
            const response = await fetch(`${API_URL}/regops/controls/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            })
            const result = await response.json()
            if (result.success || response.ok) {
                set((state) => ({ controls: state.controls.filter((c) => c.id !== id) }))
            } else {
                throw new Error(result.error || 'Failed to delete control')
            }
        } catch (error: any) {
            set({ error: error.message })
            throw error
        }
    },

    restoreControl: async (id) => {
        try {
            const response = await fetch(`${API_URL}/regops/controls/${id}/restore`, {
                method: 'POST',
                headers: getAuthHeaders(),
            })
            const result = await response.json()
            if (result.success || response.ok) {
                set((state) => ({ deletedControls: state.deletedControls.filter((c) => c.id !== id) }))
            } else {
                throw new Error(result.error || 'Failed to restore control')
            }
        } catch (error: any) {
            set({ error: error.message })
            throw error
        }
    },

    permanentDeleteControl: async (id) => {
        try {
            const response = await fetch(`${API_URL}/regops/controls/${id}/permanent`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            })
            const result = await response.json()
            if (result.success || response.ok) {
                set((state) => ({ deletedControls: state.deletedControls.filter((c) => c.id !== id) }))
            } else {
                throw new Error(result.error || 'Failed to permanently delete control')
            }
        } catch (error: any) {
            set({ error: error.message })
            throw error
        }
    },
}))
