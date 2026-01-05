import { create } from 'zustand'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    }
}

export interface Vendor {
    id: number | string
    name: string
    type: string
    servicesProvided: string
    dataAccessLevel: 'none' | 'limited' | 'full'
    securityControls: string
    complianceStatus: string
    riskLevel: 'low' | 'medium' | 'high' | 'critical'
    mitigationActions: string
    reviewFrequency: string
    lastReviewDate: string
    nextReviewDate: string
    assessor: string
    status: 'active' | 'inactive' | 'pending_review' | 'terminated'
    contractExpiry: string
    contactPerson: string
    contactEmail: string
    createdAt?: string
    deleted_at?: string
}

interface VendorStore {
    vendors: Vendor[]
    deletedVendors: Vendor[]
    loading: boolean
    error: string | null

    fetchVendors: () => Promise<void>
    fetchDeletedVendors: () => Promise<void>
    createVendor: (data: Partial<Vendor>) => Promise<void>
    updateVendor: (id: number | string, data: Partial<Vendor>) => Promise<void>
    deleteVendor: (id: number | string) => Promise<void>
    restoreVendor: (id: number | string) => Promise<void>
    permanentDeleteVendor: (id: number | string) => Promise<void>
}

export const useVendorStore = create<VendorStore>((set) => ({
    vendors: [],
    deletedVendors: [],
    loading: false,
    error: null,

    fetchVendors: async () => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/riskops/vendors`, {
                headers: getAuthHeaders(),
            })
            if (!response.ok) {
                set({ vendors: [], loading: false, error: null })
                return
            }
            const data = await response.json()
            set({ vendors: data.data || [], loading: false, error: null })
        } catch (error: any) {
            set({ vendors: [], loading: false, error: null })
        }
    },

    fetchDeletedVendors: async () => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/riskops/vendors/deleted`, {
                headers: getAuthHeaders(),
            })
            const data = await response.json()
            set({ deletedVendors: data.data || [], loading: false, error: null })
        } catch (error: any) {
            set({ loading: false, error: error.message || 'Failed to fetch deleted vendors' })
        }
    },

    createVendor: async (data) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/riskops/vendors`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({ vendors: [...state.vendors, result.data], loading: false, error: null }))
            } else {
                throw new Error(result.error || 'Failed to create vendor')
            }
        } catch (error: any) {
            set({ loading: false, error: error.message })
            throw error
        }
    },

    updateVendor: async (id, data) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${API_URL}/riskops/vendors/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({
                    vendors: state.vendors.map((v) => (v.id === id ? { ...v, ...data } : v)),
                    loading: false,
                    error: null,
                }))
            } else {
                throw new Error(result.error || 'Failed to update vendor')
            }
        } catch (error: any) {
            set({ loading: false, error: error.message })
            throw error
        }
    },

    deleteVendor: async (id) => {
        try {
            const response = await fetch(`${API_URL}/riskops/vendors/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({
                    vendors: state.vendors.filter((v) => v.id !== id),
                }))
            } else {
                throw new Error(result.error || 'Failed to delete vendor')
            }
        } catch (error: any) {
            set({ error: error.message })
            throw error
        }
    },

    restoreVendor: async (id) => {
        try {
            const response = await fetch(`${API_URL}/riskops/vendors/${id}/restore`, {
                method: 'POST',
                headers: getAuthHeaders(),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({
                    deletedVendors: state.deletedVendors.filter((v) => v.id !== id),
                }))
            } else {
                throw new Error(result.error || 'Failed to restore vendor')
            }
        } catch (error: any) {
            set({ error: error.message })
            throw error
        }
    },

    permanentDeleteVendor: async (id) => {
        try {
            const response = await fetch(`${API_URL}/riskops/vendors/${id}/permanent`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            })
            const result = await response.json()
            if (result.success) {
                set((state) => ({
                    deletedVendors: state.deletedVendors.filter((v) => v.id !== id),
                }))
            } else {
                throw new Error(result.error || 'Failed to permanently delete vendor')
            }
        } catch (error: any) {
            set({ error: error.message })
            throw error
        }
    },
}))
