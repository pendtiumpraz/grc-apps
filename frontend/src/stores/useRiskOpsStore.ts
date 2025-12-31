import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Risk Register
export interface RiskRegister {
  id: number | string
  tenant_id: string
  risk_name: string
  risk_description: string
  risk_category: string
  risk_owner: string
  likelihood: string
  impact: string
  risk_score: number
  risk_level: string
  existing_controls: string
  mitigation_actions: string
  target_date: string
  status: string
  created_at?: string
  updated_at?: string
  is_deleted?: boolean
  deleted_at?: string
  deleted_by?: string
}

// Vulnerability
export interface Vulnerability {
  id: number | string
  tenant_id: string
  vulnerability_name: string
  description: string
  severity: string
  cvss_score: number
  affected_systems: string
  discovered_date: string
  remediation_plan: string
  priority_actions: string
  assigned_to: string
  status: string
  created_at?: string
  updated_at?: string
  is_deleted?: boolean
  deleted_at?: string
  deleted_by?: string
}

// Vendor Assessment
export interface VendorAssessment {
  id: number | string
  tenant_id: string
  vendor_name: string
  vendor_type: string
  services_provided: string
  data_access_level: string
  security_controls: string
  compliance_status: string
  risk_level: string
  mitigation_actions: string
  review_frequency: string
  last_review_date: string
  next_review_date: string
  assessor: string
  status: string
  created_at?: string
  updated_at?: string
  is_deleted?: boolean
  deleted_at?: string
  deleted_by?: string
}

// Business Continuity
export interface BusinessContinuity {
  id: number | string
  tenant_id: string
  plan_name: string
  business_impact_analysis: string
  critical_functions: string
  recovery_time_objective: string
  recovery_point_objective: string
  recovery_strategies: string
  backup_procedures: string
  communication_plan: string
  testing_schedule: string
  last_test_date: string
  next_test_date: string
  owner: string
  status: string
  created_at?: string
  updated_at?: string
  is_deleted?: boolean
  deleted_at?: string
  deleted_by?: string
}

interface RiskOpsState {
  riskRegister: RiskRegister[]
  vulnerabilities: Vulnerability[]
  vendorAssessments: VendorAssessment[]
  businessContinuity: BusinessContinuity[]
  deletedRiskRegister: RiskRegister[]
  deletedVulnerabilities: Vulnerability[]
  deletedVendorAssessments: VendorAssessment[]
  deletedBusinessContinuity: BusinessContinuity[]
  loading: boolean
  error: string | null

  // Actions
  setRiskRegister: (risks: RiskRegister[]) => void
  setVulnerabilities: (vulnerabilities: Vulnerability[]) => void
  setVendorAssessments: (assessments: VendorAssessment[]) => void
  setBusinessContinuity: (plans: BusinessContinuity[]) => void
  setDeletedRiskRegister: (risks: RiskRegister[]) => void
  setDeletedVulnerabilities: (vulnerabilities: Vulnerability[]) => void
  setDeletedVendorAssessments: (assessments: VendorAssessment[]) => void
  setDeletedBusinessContinuity: (plans: BusinessContinuity[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  addRisk: (risk: RiskRegister) => void
  updateRisk: (id: number | string, risk: Partial<RiskRegister>) => void
  removeRisk: (id: number | string) => void
  addVulnerability: (vulnerability: Vulnerability) => void
  updateVulnerability: (id: number | string, vulnerability: Partial<Vulnerability>) => void
  removeVulnerability: (id: number | string) => void
  addVendorAssessment: (assessment: VendorAssessment) => void
  updateVendorAssessment: (id: number | string, assessment: Partial<VendorAssessment>) => void
  removeVendorAssessment: (id: number | string) => void
  addBusinessContinuity: (plan: BusinessContinuity) => void
  updateBusinessContinuity: (id: number | string, plan: Partial<BusinessContinuity>) => void
  removeBusinessContinuity: (id: number | string) => void
}

export const useRiskOpsStore = create<RiskOpsState>()(
  persist(
    (set) => ({
      riskRegister: [],
      vulnerabilities: [],
      vendorAssessments: [],
      businessContinuity: [],
      deletedRiskRegister: [],
      deletedVulnerabilities: [],
      deletedVendorAssessments: [],
      deletedBusinessContinuity: [],
      loading: false,
      error: null,

      setRiskRegister: (risks) => set({ riskRegister: risks }),
      setVulnerabilities: (vulnerabilities) => set({ vulnerabilities }),
      setVendorAssessments: (assessments) => set({ vendorAssessments: assessments }),
      setBusinessContinuity: (plans) => set({ businessContinuity: plans }),
      setDeletedRiskRegister: (risks) => set({ deletedRiskRegister: risks }),
      setDeletedVulnerabilities: (vulnerabilities) => set({ deletedVulnerabilities: vulnerabilities }),
      setDeletedVendorAssessments: (assessments) => set({ deletedVendorAssessments: assessments }),
      setDeletedBusinessContinuity: (plans) => set({ deletedBusinessContinuity: plans }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      addRisk: (risk) => set((state) => ({
        riskRegister: [...state.riskRegister, risk]
      })),
      updateRisk: (id, risk) => set((state) => ({
        riskRegister: state.riskRegister.map((r) => r.id === id ? { ...r, ...risk } : r)
      })),
      removeRisk: (id) => set((state) => ({
        riskRegister: state.riskRegister.filter((r) => r.id !== id)
      })),

      addVulnerability: (vulnerability) => set((state) => ({
        vulnerabilities: [...state.vulnerabilities, vulnerability]
      })),
      updateVulnerability: (id, vulnerability) => set((state) => ({
        vulnerabilities: state.vulnerabilities.map((v) => v.id === id ? { ...v, ...vulnerability } : v)
      })),
      removeVulnerability: (id) => set((state) => ({
        vulnerabilities: state.vulnerabilities.filter((v) => v.id !== id)
      })),

      addVendorAssessment: (assessment) => set((state) => ({
        vendorAssessments: [...state.vendorAssessments, assessment]
      })),
      updateVendorAssessment: (id, assessment) => set((state) => ({
        vendorAssessments: state.vendorAssessments.map((a) => a.id === id ? { ...a, ...assessment } : a)
      })),
      removeVendorAssessment: (id) => set((state) => ({
        vendorAssessments: state.vendorAssessments.filter((a) => a.id !== id)
      })),

      addBusinessContinuity: (plan) => set((state) => ({
        businessContinuity: [...state.businessContinuity, plan]
      })),
      updateBusinessContinuity: (id, plan) => set((state) => ({
        businessContinuity: state.businessContinuity.map((b) => b.id === id ? { ...b, ...plan } : b)
      })),
      removeBusinessContinuity: (id) => set((state) => ({
        businessContinuity: state.businessContinuity.filter((b) => b.id !== id)
      })),
    }),
    {
      name: 'riskops-storage',
      partialize: (state) => ({
        riskRegister: state.riskRegister,
        vulnerabilities: state.vulnerabilities,
        vendorAssessments: state.vendorAssessments,
        businessContinuity: state.businessContinuity,
      }),
    }
  )
)
