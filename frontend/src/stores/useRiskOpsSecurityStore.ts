import { create } from 'zustand'

export interface Vulnerability {
  id: number
  name: string
  cve: string
  severity: string
  cvssScore: number
  status: string
  affectedSystem: string
  discoveredDate: string
  fixAvailable: boolean
  remediation: string
  businessImpact: string
  owner: string
  description: string
  createdAt: string
  // Additional fields for frontend compatibility
  type?: string
}

interface RiskOpsSecurityStore {
  vulnerabilities: Vulnerability[]
  loading: boolean
  error: string | null
  
  fetchVulnerabilities: () => Promise<void>
  createVulnerability: (data: Partial<Vulnerability>) => Promise<void>
  updateVulnerability: (id: number, data: Partial<Vulnerability>) => Promise<void>
  deleteVulnerability: (id: number) => Promise<void>
  resolveVulnerability: (id: number) => Promise<void>
  getStats: () => Promise<void>
}

export const useRiskOpsSecurityStore = create<RiskOpsSecurityStore>((set) => ({
  vulnerabilities: [],
  loading: false,
  error: null,
  
  fetchVulnerabilities: async () => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/riskops/vulnerabilities', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      set({ vulnerabilities: data.data || [], loading: false, error: null })
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to fetch vulnerabilities' })
    }
  },
  
  createVulnerability: async (data) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/riskops/vulnerabilities', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({ vulnerabilities: [...state.vulnerabilities, result.data], loading: false, error: null }))
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to create vulnerability' })
    }
  },
  
  updateVulnerability: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/riskops/vulnerabilities/${id}`, {
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
          vulnerabilities: state.vulnerabilities.map((v) => (v.id === id ? { ...v, ...data } : v)),
          loading: false,
          error: null,
        }))
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to update vulnerability' })
    }
  },
  
  deleteVulnerability: async (id) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/riskops/vulnerabilities/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({
          vulnerabilities: state.vulnerabilities.filter((v) => v.id !== id),
          loading: false,
          error: null,
        }))
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to delete vulnerability' })
    }
  },
  
  resolveVulnerability: async (id) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/riskops/vulnerabilities/${id}/resolve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const result = await response.json()
      if (result.success) {
        set((state) => ({
          vulnerabilities: state.vulnerabilities.map((v) => (v.id === id ? { ...v, status: 'resolved' } : v)),
          loading: false,
          error: null,
        }))
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to resolve vulnerability' })
    }
  },
  
  getStats: async () => {
    // Stats are fetched separately
  },
}))
