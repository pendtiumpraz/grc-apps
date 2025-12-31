import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Audit Plan
export interface AuditPlan {
  id: number | string
  tenant_id: string
  plan_name: string
  audit_objectives: string
  audit_scope: string
  audit_criteria: string
  schedule: string
  resources: string
  deliverables: string
  risk_assessment: string
  start_date: string
  end_date: string
  auditor: string
  status: string
  created_at?: string
  updated_at?: string
  is_deleted?: boolean
  deleted_at?: string
  deleted_by?: string
}

// Audit Evidence
export interface AuditEvidence {
  id: number | string
  tenant_id: string
  audit_plan_id: number | string
  evidence_type: string
  description: string
  source: string
  collection_date: string
  collected_by: string
  file_path: string
  relevance: string
  created_at?: string
  updated_at?: string
  is_deleted?: boolean
  deleted_at?: string
  deleted_by?: string
}

// Control Test
export interface ControlTest {
  id: number | string
  tenant_id: string
  audit_plan_id: number | string
  control_framework: string
  controls_to_test: string
  test_methods: string
  test_criteria: string
  test_schedule: string
  test_team: string
  expected_outcomes: string
  actual_outcomes: string
  test_date: string
  tested_by: string
  status: string
  created_at?: string
  updated_at?: string
  is_deleted?: boolean
  deleted_at?: string
  deleted_by?: string
}

// Audit Report
export interface AuditReport {
  id: number | string
  tenant_id: string
  audit_plan_id: number | string
  report_name: string
  audit_type: string
  audit_period: string
  audit_scope: string
  objectives: string
  methodology: string
  findings: string
  root_cause_analysis: string
  recommendations: string
  management_response: string
  action_plan: string
  conclusion: string
  report_date: string
  prepared_by: string
  approved_by: string
  status: string
  created_at?: string
  updated_at?: string
  is_deleted?: boolean
  deleted_at?: string
  deleted_by?: string
}

interface AuditOpsState {
  auditPlans: AuditPlan[]
  auditEvidence: AuditEvidence[]
  controlTests: ControlTest[]
  auditReports: AuditReport[]
  deletedAuditPlans: AuditPlan[]
  deletedAuditEvidence: AuditEvidence[]
  deletedControlTests: ControlTest[]
  deletedAuditReports: AuditReport[]
  loading: boolean
  error: string | null

  // Actions
  setAuditPlans: (plans: AuditPlan[]) => void
  setAuditEvidence: (evidence: AuditEvidence[]) => void
  setControlTests: (tests: ControlTest[]) => void
  setAuditReports: (reports: AuditReport[]) => void
  setDeletedAuditPlans: (plans: AuditPlan[]) => void
  setDeletedAuditEvidence: (evidence: AuditEvidence[]) => void
  setDeletedControlTests: (tests: ControlTest[]) => void
  setDeletedAuditReports: (reports: AuditReport[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  addAuditPlan: (plan: AuditPlan) => void
  updateAuditPlan: (id: number | string, plan: Partial<AuditPlan>) => void
  removeAuditPlan: (id: number | string) => void
  addAuditEvidence: (evidence: AuditEvidence) => void
  updateAuditEvidence: (id: number | string, evidence: Partial<AuditEvidence>) => void
  removeAuditEvidence: (id: number | string) => void
  addControlTest: (test: ControlTest) => void
  updateControlTest: (id: number | string, test: Partial<ControlTest>) => void
  removeControlTest: (id: number | string) => void
  addAuditReport: (report: AuditReport) => void
  updateAuditReport: (id: number | string, report: Partial<AuditReport>) => void
  removeAuditReport: (id: number | string) => void
}

export const useAuditOpsStore = create<AuditOpsState>()(
  persist(
    (set) => ({
      auditPlans: [],
      auditEvidence: [],
      controlTests: [],
      auditReports: [],
      deletedAuditPlans: [],
      deletedAuditEvidence: [],
      deletedControlTests: [],
      deletedAuditReports: [],
      loading: false,
      error: null,

      setAuditPlans: (plans) => set({ auditPlans: plans }),
      setAuditEvidence: (evidence) => set({ auditEvidence: evidence }),
      setControlTests: (tests) => set({ controlTests: tests }),
      setAuditReports: (reports) => set({ auditReports: reports }),
      setDeletedAuditPlans: (plans) => set({ deletedAuditPlans: plans }),
      setDeletedAuditEvidence: (evidence) => set({ deletedAuditEvidence: evidence }),
      setDeletedControlTests: (tests) => set({ deletedControlTests: tests }),
      setDeletedAuditReports: (reports) => set({ deletedAuditReports: reports }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      addAuditPlan: (plan) => set((state) => ({
        auditPlans: [...state.auditPlans, plan]
      })),
      updateAuditPlan: (id, plan) => set((state) => ({
        auditPlans: state.auditPlans.map((p) => p.id === id ? { ...p, ...plan } : p)
      })),
      removeAuditPlan: (id) => set((state) => ({
        auditPlans: state.auditPlans.filter((p) => p.id !== id)
      })),

      addAuditEvidence: (evidence) => set((state) => ({
        auditEvidence: [...state.auditEvidence, evidence]
      })),
      updateAuditEvidence: (id, evidence) => set((state) => ({
        auditEvidence: state.auditEvidence.map((e) => e.id === id ? { ...e, ...evidence } : e)
      })),
      removeAuditEvidence: (id) => set((state) => ({
        auditEvidence: state.auditEvidence.filter((e) => e.id !== id)
      })),

      addControlTest: (test) => set((state) => ({
        controlTests: [...state.controlTests, test]
      })),
      updateControlTest: (id, test) => set((state) => ({
        controlTests: state.controlTests.map((t) => t.id === id ? { ...t, ...test } : t)
      })),
      removeControlTest: (id) => set((state) => ({
        controlTests: state.controlTests.filter((t) => t.id !== id)
      })),

      addAuditReport: (report) => set((state) => ({
        auditReports: [...state.auditReports, report]
      })),
      updateAuditReport: (id, report) => set((state) => ({
        auditReports: state.auditReports.map((r) => r.id === id ? { ...r, ...report } : r)
      })),
      removeAuditReport: (id) => set((state) => ({
        auditReports: state.auditReports.filter((r) => r.id !== id)
      })),
    }),
    {
      name: 'auditops-storage',
      partialize: (state) => ({
        auditPlans: state.auditPlans,
        auditEvidence: state.auditEvidence,
        controlTests: state.controlTests,
        auditReports: state.auditReports,
      }),
    }
  )
)
