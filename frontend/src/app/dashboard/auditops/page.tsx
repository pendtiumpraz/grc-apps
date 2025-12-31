'use client'

import React from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import SinglePageCrud, { CrudField } from '@/components/dashboard/SinglePageCrud'
import { useAuditOpsStore } from '@/stores/useAuditOpsStore'
import { auditopsAPI } from '@/lib/api'

export default function AuditOpsPage() {
  const auditPlans = useAuditOpsStore(state => state.auditPlans)
  const deletedAuditPlans = useAuditOpsStore(state => state.deletedAuditPlans)
  const loading = useAuditOpsStore(state => state.loading)
  const error = useAuditOpsStore(state => state.error)
  const setAuditPlans = useAuditOpsStore(state => state.setAuditPlans)
  const setDeletedAuditPlans = useAuditOpsStore(state => state.setDeletedAuditPlans)
  const setLoading = useAuditOpsStore(state => state.setLoading)
  const setError = useAuditOpsStore(state => state.setError)
  const addAuditPlan = useAuditOpsStore(state => state.addAuditPlan)
  const updateAuditPlan = useAuditOpsStore(state => state.updateAuditPlan)
  const removeAuditPlan = useAuditOpsStore(state => state.removeAuditPlan)

  const auditPlanFields: CrudField[] = [
    { key: 'plan_name', label: 'Nama Rencana Audit', type: 'text', required: true, placeholder: 'Masukkan nama rencana audit' },
    { key: 'audit_objectives', label: 'Tujuan Audit', type: 'textarea', required: true, placeholder: 'Tujuan audit yang ingin dicapai' },
    { key: 'audit_scope', label: 'Ruang Lingkup Audit', type: 'textarea', required: true, placeholder: 'Ruang lingkup audit' },
    { key: 'audit_criteria', label: 'Kriteria Audit', type: 'textarea', required: true, placeholder: 'Kriteria yang digunakan' },
    { key: 'schedule', label: 'Jadwal', type: 'textarea', required: true, placeholder: 'Jadwal pelaksanaan audit' },
    { key: 'resources', label: 'Sumber Daya', type: 'textarea', placeholder: 'Sumber daya yang diperlukan' },
    { key: 'deliverables', label: 'Deliverables', type: 'textarea', required: true, placeholder: 'Hasil yang diharapkan' },
    { key: 'risk_assessment', label: 'Penilaian Risiko', type: 'textarea', placeholder: 'Penilaian risiko audit' },
    { key: 'start_date', label: 'Tanggal Mulai', type: 'date', required: true },
    { key: 'end_date', label: 'Tanggal Selesai', type: 'date', required: true },
    { key: 'auditor', label: 'Auditor', type: 'text', required: true, placeholder: 'Nama auditor' },
    { key: 'status', label: 'Status', type: 'select', required: true, options: [
      'Planned',
      'In Progress',
      'Completed',
      'On Hold',
      'Cancelled'
    ]},
  ]

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">AuditOps - Audit & Tata Kelola</h1>
              <p className="text-gray-400">
                Kelola rencana audit, bukti, pengujian kontrol, dan laporan audit
              </p>
            </div>

            <SinglePageCrud
        title="Rencana Audit"
        description="Kelola rencana audit dan jadwal audit"
        aiContext="AuditOps"
        fields={auditPlanFields}
        api={{
          getAll: auditopsAPI.getAuditPlans,
          getById: auditopsAPI.getAuditPlan,
          create: auditopsAPI.createAuditPlan,
          update: auditopsAPI.updateAuditPlan,
          delete: auditopsAPI.deleteAuditPlan,
          getDeleted: auditopsAPI.getDeletedAuditPlans,
          restore: auditopsAPI.restoreAuditPlan,
          permanentDelete: auditopsAPI.permanentDeleteAuditPlan,
        }}
        store={{
          items: auditPlans,
          deletedItems: deletedAuditPlans,
          loading,
          error,
          setItems: setAuditPlans as any,
          setDeletedItems: setDeletedAuditPlans as any,
          setLoading,
          setError,
          addItem: addAuditPlan as any,
          updateItem: updateAuditPlan as any,
          removeItem: removeAuditPlan as any,
        }}
              showRecovery={true}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
