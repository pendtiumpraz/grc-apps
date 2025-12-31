import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Regulation
export interface Regulation {
  id: number | string
  tenant_id: string
  title: string
  description: string
  category: string
  jurisdiction: string
  effective_date: string
  status: string
  compliance_framework?: string
  priority?: string
  created_at?: string
  updated_at?: string
  is_deleted?: boolean
  deleted_at?: string
  deleted_by?: string
}

// Compliance Assessment
export interface ComplianceAssessment {
  id: number | string
  tenant_id: string
  regulation_id: number | string
  title: string
  description: string
  assessment_date: string
  assessor: string
  overall_score: number
  findings: string
  recommendations: string
  status: string
  created_at?: string
  updated_at?: string
  is_deleted?: boolean
  deleted_at?: string
  deleted_by?: string
}

// Policy
export interface Policy {
  id: number | string
  tenant_id: string
  title: string
  description: string
  category: string
  content: string
  effective_date: string
  review_date: string
  owner: string
  status: string
  version: string
  created_at?: string
  updated_at?: string
  is_deleted?: boolean
  deleted_at?: string
  deleted_by?: string
}

// Control
export interface Control {
  id: number | string
  tenant_id: string
  policy_id: number | string
  title: string
  description: string
  control_type: string
  implementation_status: string
  effectiveness: string
  testing_procedure: string
  last_tested: string
  next_test: string
  owner: string
  created_at?: string
  updated_at?: string
  is_deleted?: boolean
  deleted_at?: string
  deleted_by?: string
}

interface RegOpsState {
  regulations: Regulation[]
  complianceAssessments: ComplianceAssessment[]
  policies: Policy[]
  controls: Control[]
  deletedRegulations: Regulation[]
  deletedComplianceAssessments: ComplianceAssessment[]
  deletedPolicies: Policy[]
  deletedControls: Control[]
  loading: boolean
  error: string | null

  // Actions
  setRegulations: (regulations: Regulation[]) => void
  setComplianceAssessments: (assessments: ComplianceAssessment[]) => void
  setPolicies: (policies: Policy[]) => void
  setControls: (controls: Control[]) => void
  setDeletedRegulations: (regulations: Regulation[]) => void
  setDeletedComplianceAssessments: (assessments: ComplianceAssessment[]) => void
  setDeletedPolicies: (policies: Policy[]) => void
  setDeletedControls: (controls: Control[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  addRegulation: (regulation: Regulation) => void
  updateRegulation: (id: number | string, regulation: Partial<Regulation>) => void
  removeRegulation: (id: number | string) => void
  addComplianceAssessment: (assessment: ComplianceAssessment) => void
  updateComplianceAssessment: (id: number | string, assessment: Partial<ComplianceAssessment>) => void
  removeComplianceAssessment: (id: number | string) => void
  addPolicy: (policy: Policy) => void
  updatePolicy: (id: number | string, policy: Partial<Policy>) => void
  removePolicy: (id: number | string) => void
  addControl: (control: Control) => void
  updateControl: (id: number | string, control: Partial<Control>) => void
  removeControl: (id: number | string) => void
}

export const useRegOpsStore = create<RegOpsState>()(
  persist(
    (set) => ({
      regulations: [],
      complianceAssessments: [],
      policies: [],
      controls: [],
      deletedRegulations: [],
      deletedComplianceAssessments: [],
      deletedPolicies: [],
      deletedControls: [],
      loading: false,
      error: null,

      setRegulations: (regulations) => set({ regulations }),
      setComplianceAssessments: (assessments) => set({ complianceAssessments: assessments }),
      setPolicies: (policies) => set({ policies }),
      setControls: (controls) => set({ controls }),
      setDeletedRegulations: (regulations) => set({ deletedRegulations: regulations }),
      setDeletedComplianceAssessments: (assessments) => set({ deletedComplianceAssessments: assessments }),
      setDeletedPolicies: (policies) => set({ deletedPolicies: policies }),
      setDeletedControls: (controls) => set({ deletedControls: controls }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      addRegulation: (regulation) => set((state) => ({
        regulations: [...state.regulations, regulation]
      })),
      updateRegulation: (id, regulation) => set((state) => ({
        regulations: state.regulations.map((r) => r.id === id ? { ...r, ...regulation } : r)
      })),
      removeRegulation: (id) => set((state) => ({
        regulations: state.regulations.filter((r) => r.id !== id)
      })),

      addComplianceAssessment: (assessment) => set((state) => ({
        complianceAssessments: [...state.complianceAssessments, assessment]
      })),
      updateComplianceAssessment: (id, assessment) => set((state) => ({
        complianceAssessments: state.complianceAssessments.map((a) => a.id === id ? { ...a, ...assessment } : a)
      })),
      removeComplianceAssessment: (id) => set((state) => ({
        complianceAssessments: state.complianceAssessments.filter((a) => a.id !== id)
      })),

      addPolicy: (policy) => set((state) => ({
        policies: [...state.policies, policy]
      })),
      updatePolicy: (id, policy) => set((state) => ({
        policies: state.policies.map((p) => p.id === id ? { ...p, ...policy } : p)
      })),
      removePolicy: (id) => set((state) => ({
        policies: state.policies.filter((p) => p.id !== id)
      })),

      addControl: (control) => set((state) => ({
        controls: [...state.controls, control]
      })),
      updateControl: (id, control) => set((state) => ({
        controls: state.controls.map((c) => c.id === id ? { ...c, ...control } : c)
      })),
      removeControl: (id) => set((state) => ({
        controls: state.controls.filter((c) => c.id !== id)
      })),
    }),
    {
      name: 'regops-storage',
      partialize: (state) => ({
        regulations: state.regulations,
        complianceAssessments: state.complianceAssessments,
        policies: state.policies,
        controls: state.controls,
      }),
    }
  )
)
