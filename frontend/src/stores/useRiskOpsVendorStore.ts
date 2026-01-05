import { create } from 'zustand'

export interface Vendor {
  id: number
  name: string
  category: string
  type: string
  riskLevel: string
  riskScore: number
  status: string
  contractExpiry: string
  lastAssessment: string
  nextAssessment: string
  owner: string
  description: string
  createdAt: string
}

interface RiskOpsVendorStore {
  vendors: Vendor[]
  loading: boolean
  error: string | null

  fetchVendors: () => Promise<void>
  createVendor: (data: Partial<Vendor>) => Promise<void>
  updateVendor: (id: number, data: Partial<Vendor>) => Promise<void>
  deleteVendor: (id: number) => Promise<void>
  getStats: () => Promise<void>
}

export const useRiskOpsVendorStore = create<RiskOpsVendorStore>((set) => ({
  vendors: [],
  loading: false,
  error: null,

  fetchVendors: async () => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/riskops/vendors', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
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

  createVendor: async (data) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/riskops/vendors', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({ vendors: [...state.vendors, result.data], loading: false, error: null }))
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to create vendor' })
    }
  },

  updateVendor: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/riskops/vendors/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({
          vendors: state.vendors.map((v) => (v.id === id ? { ...v, ...data } : v)),
          loading: false,
          error: null,
        }))
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to update vendor' })
    }
  },

  deleteVendor: async (id) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/riskops/vendors/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({
          vendors: state.vendors.filter((v) => v.id !== id),
          loading: false,
          error: null,
        }))
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to delete vendor' })
    }
  },

  getStats: async () => {
    // Stats are fetched separately
  },
}))
