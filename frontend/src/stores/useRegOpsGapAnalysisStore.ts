import { create } from 'zustand'
import { useEffect, useState } from 'react'

interface ComplianceGap {
  id: number
  regulation: string
  requirement: string
  currentStatus: string
  gapStatus: 'critical' | 'high' | 'medium' | 'low'
  riskLevel: number
  recommendation: string
  priority: number
  lastAssessed: string
}

interface RegOpsGapAnalysisStore {
  gaps: ComplianceGap[]
  loading: boolean
  error: string | null
  fetchGaps: () => Promise<void>
  createGap: (gap: Omit<ComplianceGap, 'id'>) => Promise<void>
  updateGap: (id: number, gap: Partial<ComplianceGap>) => Promise<void>
  deleteGap: (id: number) => Promise<void>
  getStats: () => Promise<void>
}

export const useRegOpsGapAnalysisStore = create<RegOpsGapAnalysisStore>((set) => ({
  gaps: [],
  loading: false,
  error: null,

  fetchGaps: async () => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/regops/compliance-gaps', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch compliance gaps')
      }

      const data = await response.json()
      set({ gaps: data.data || [], loading: false, error: null })
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to fetch compliance gaps' })
    }
  },

  createGap: async (gap) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/regops/compliance-gaps', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gap),
      })

      if (!response.ok) {
        throw new Error('Failed to create compliance gap')
      }

      const data = await response.json()
      set(state => ({
        gaps: [...state.gaps, data.data],
        loading: false,
        error: null,
      }))
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to create compliance gap' })
    }
  },

  updateGap: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/regops/compliance-gaps/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Failed to update compliance gap')
      }

      set(state => ({
        gaps: state.gaps.map(gap => gap.id === id ? { ...gap, ...updates } : gap),
        loading: false,
        error: null,
      }))
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to update compliance gap' })
    }
  },

  deleteGap: async (id) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/regops/compliance-gaps/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete compliance gap')
      }

      set(state => ({
        gaps: state.gaps.filter(gap => gap.id !== id),
        loading: false,
        error: null,
      }))
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to delete compliance gap' })
    }
  },

  getStats: async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/regops/compliance-gaps/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }

      const data = await response.json()
      return data.data
    } catch (error: any) {
      console.error('Failed to fetch stats:', error)
      return null
    }
  },
}))
