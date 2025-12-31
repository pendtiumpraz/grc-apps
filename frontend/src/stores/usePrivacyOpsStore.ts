import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Data Inventory
export interface DataInventory {
  id: number | string
  tenant_id: string
  data_name: string
  data_type: string
  data_category: string
  data_owner: string
  data_steward: string
  data_location: string
  data_purpose: string
  legal_basis: string
  retention_period: string
  data_subjects: string
  third_party_sharing: string
  security_measures: string
  sensitivity_level: string
  created_at?: string
  updated_at?: string
  is_deleted?: boolean
  deleted_at?: string
  deleted_by?: string
}

// DSR Request
export interface DSRRequest {
  id: number | string
  tenant_id: string
  request_type: string
  request_reference: string
  data_subject_name: string
  data_subject_email: string
  request_date: string
  due_date: string
  status: string
  assigned_to: string
  data_provided: string
  additional_actions: string
  response_date: string
  created_at?: string
  updated_at?: string
  is_deleted?: boolean
  deleted_at?: string
  deleted_by?: string
}

// DPIA
export interface DPIA {
  id: number | string
  tenant_id: string
  project_name: string
  processing_description: string
  data_types: string
  data_subjects: string
  processing_purpose: string
  legal_basis: string
  privacy_risks: string
  mitigation_measures: string
  residual_risks: string
  dpo_consultation: string
  decision: string
  assessment_date: string
  assessor: string
  status: string
  created_at?: string
  updated_at?: string
  is_deleted?: boolean
  deleted_at?: string
  deleted_by?: string
}

// Privacy Control
export interface PrivacyControl {
  id: number | string
  tenant_id: string
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

interface PrivacyOpsState {
  dataInventory: DataInventory[]
  dsrRequests: DSRRequest[]
  dpia: DPIA[]
  privacyControls: PrivacyControl[]
  deletedDataInventory: DataInventory[]
  deletedDSRRequests: DSRRequest[]
  deletedDPIA: DPIA[]
  deletedPrivacyControls: PrivacyControl[]
  loading: boolean
  error: string | null

  // Actions
  setDataInventory: (dataInventory: DataInventory[]) => void
  setDSRRequests: (requests: DSRRequest[]) => void
  setDPIA: (dpia: DPIA[]) => void
  setPrivacyControls: (controls: PrivacyControl[]) => void
  setDeletedDataInventory: (dataInventory: DataInventory[]) => void
  setDeletedDSRRequests: (requests: DSRRequest[]) => void
  setDeletedDPIA: (dpia: DPIA[]) => void
  setDeletedPrivacyControls: (controls: PrivacyControl[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  addDataInventory: (item: DataInventory) => void
  updateDataInventory: (id: number | string, item: Partial<DataInventory>) => void
  removeDataInventory: (id: number | string) => void
  addDSRRequest: (request: DSRRequest) => void
  updateDSRRequest: (id: number | string, request: Partial<DSRRequest>) => void
  removeDSRRequest: (id: number | string) => void
  addDPIA: (dpia: DPIA) => void
  updateDPIA: (id: number | string, dpia: Partial<DPIA>) => void
  removeDPIA: (id: number | string) => void
  addPrivacyControl: (control: PrivacyControl) => void
  updatePrivacyControl: (id: number | string, control: Partial<PrivacyControl>) => void
  removePrivacyControl: (id: number | string) => void
}

export const usePrivacyOpsStore = create<PrivacyOpsState>()(
  persist(
    (set) => ({
      dataInventory: [],
      dsrRequests: [],
      dpia: [],
      privacyControls: [],
      deletedDataInventory: [],
      deletedDSRRequests: [],
      deletedDPIA: [],
      deletedPrivacyControls: [],
      loading: false,
      error: null,

      setDataInventory: (dataInventory) => set({ dataInventory }),
      setDSRRequests: (requests) => set({ dsrRequests: requests }),
      setDPIA: (dpia) => set({ dpia }),
      setPrivacyControls: (controls) => set({ privacyControls: controls }),
      setDeletedDataInventory: (dataInventory) => set({ deletedDataInventory: dataInventory }),
      setDeletedDSRRequests: (requests) => set({ deletedDSRRequests: requests }),
      setDeletedDPIA: (dpia) => set({ deletedDPIA: dpia }),
      setDeletedPrivacyControls: (controls) => set({ deletedPrivacyControls: controls }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      addDataInventory: (item) => set((state) => ({
        dataInventory: [...state.dataInventory, item]
      })),
      updateDataInventory: (id, item) => set((state) => ({
        dataInventory: state.dataInventory.map((d) => d.id === id ? { ...d, ...item } : d)
      })),
      removeDataInventory: (id) => set((state) => ({
        dataInventory: state.dataInventory.filter((d) => d.id !== id)
      })),

      addDSRRequest: (request) => set((state) => ({
        dsrRequests: [...state.dsrRequests, request]
      })),
      updateDSRRequest: (id, request) => set((state) => ({
        dsrRequests: state.dsrRequests.map((r) => r.id === id ? { ...r, ...request } : r)
      })),
      removeDSRRequest: (id) => set((state) => ({
        dsrRequests: state.dsrRequests.filter((r) => r.id !== id)
      })),

      addDPIA: (dpia) => set((state) => ({
        dpia: [...state.dpia, dpia]
      })),
      updateDPIA: (id, dpia) => set((state) => ({
        dpia: state.dpia.map((d) => d.id === id ? { ...d, ...dpia } : d)
      })),
      removeDPIA: (id) => set((state) => ({
        dpia: state.dpia.filter((d) => d.id !== id)
      })),

      addPrivacyControl: (control) => set((state) => ({
        privacyControls: [...state.privacyControls, control]
      })),
      updatePrivacyControl: (id, control) => set((state) => ({
        privacyControls: state.privacyControls.map((c) => c.id === id ? { ...c, ...control } : c)
      })),
      removePrivacyControl: (id) => set((state) => ({
        privacyControls: state.privacyControls.filter((c) => c.id !== id)
      })),
    }),
    {
      name: 'privacyops-storage',
      partialize: (state) => ({
        dataInventory: state.dataInventory,
        dsrRequests: state.dsrRequests,
        dpia: state.dpia,
        privacyControls: state.privacyControls,
      }),
    }
  )
)
