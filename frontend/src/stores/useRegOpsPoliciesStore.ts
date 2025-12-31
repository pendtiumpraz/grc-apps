import { create } from 'zustand'

export interface Policy {
  id: number
  code: string
  name: string
  type: string
  category: string
  status: string
  version: string
  effectiveDate: string
  reviewDate: string
  owner: string
  description: string
  createdAt: string
}

interface RegOpsPoliciesStore {
  policies: Policy[]
  loading: boolean
  error: string | null
  
  fetchPolicies: () => Promise<void>
  createPolicy: (data: Partial<Policy>) => Promise<void>
  updatePolicy: (id: number, data: Partial<Policy>) => Promise<void>
  deletePolicy: (id: number) => Promise<void>
  getStats: () => Promise<void>
}

export const useRegOpsPoliciesStore = create<RegOpsPoliciesStore>((set) => ({
  policies: [],
  loading: false,
  error: null,
  
  fetchPolicies: async () => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/regops/policies', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      set({ policies: data.data || [], loading: false, error: null })
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to fetch policies' })
    }
  },
  
  createPolicy: async (data) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/regops/policies', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({ policies: [...state.policies, result.data], loading: false, error: null }))
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to create policy' })
    }
  },
  
  updatePolicy: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/regops/policies/${id}`, {
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
          policies: state.policies.map((p) => (p.id === id ? { ...p, ...data } : p)),
          loading: false,
          error: null,
        }))
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to update policy' })
    }
  },
  
  deletePolicy: async (id) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/regops/policies/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({
          policies: state.policies.filter((p) => p.id !== id),
          loading: false,
          error: null,
        }))
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to delete policy' })
    }
  },
  
  getStats: async () => {
    // Stats are fetched separately
  },
}))
