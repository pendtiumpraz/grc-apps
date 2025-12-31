import { create } from 'zustand'

export interface ContinuityPlan {
  id: number
  name: string
  type: string
  severity: string
  status: string
  rto: string
  rpo: string
  lastTested: string
  nextTest: string
  owner: string
  description: string
  createdAt: string
}

interface RiskOpsContinuityStore {
  plans: ContinuityPlan[]
  loading: boolean
  error: string | null
  
  fetchPlans: () => Promise<void>
  createPlan: (data: Partial<ContinuityPlan>) => Promise<void>
  updatePlan: (id: number, data: Partial<ContinuityPlan>) => Promise<void>
  deletePlan: (id: number) => Promise<void>
  testPlan: (id: number) => Promise<void>
  getStats: () => Promise<void>
}

export const useRiskOpsContinuityStore = create<RiskOpsContinuityStore>((set) => ({
  plans: [],
  loading: false,
  error: null,
  
  fetchPlans: async () => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/riskops/continuity', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      set({ plans: data.data || [], loading: false, error: null })
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to fetch continuity plans' })
    }
  },
  
  createPlan: async (data) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/riskops/continuity', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({ plans: [...state.plans, result.data], loading: false, error: null }))
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to create continuity plan' })
    }
  },
  
  updatePlan: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/riskops/continuity/${id}`, {
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
          plans: state.plans.map((p) => (p.id === id ? { ...p, ...data } : p)),
          loading: false,
          error: null,
        }))
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to update continuity plan' })
    }
  },
  
  deletePlan: async (id) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/riskops/continuity/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({
          plans: state.plans.filter((p) => p.id !== id),
          loading: false,
          error: null,
        }))
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to delete continuity plan' })
    }
  },
  
  testPlan: async (id) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/riskops/continuity/${id}/test`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({
          plans: state.plans.map((p) => (p.id === id ? { ...p, lastTested: new Date().toISOString().split('T')[0] } : p)),
          loading: false,
          error: null,
        }))
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to test continuity plan' })
    }
  },
  
  getStats: async () => {
    // Stats are fetched separately
  },
}))
