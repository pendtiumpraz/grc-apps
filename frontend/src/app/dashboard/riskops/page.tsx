'use client'

import React from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import SinglePageCrud, { CrudField } from '@/components/dashboard/SinglePageCrud'
import { useRiskOpsStore } from '@/stores/useRiskOpsStore'
import { riskopsAPI } from '@/lib/api'

export default function RiskOpsPage() {
  const riskRegister = useRiskOpsStore(state => state.riskRegister)
  const deletedRiskRegister = useRiskOpsStore(state => state.deletedRiskRegister)
  const loading = useRiskOpsStore(state => state.loading)
  const error = useRiskOpsStore(state => state.error)
  const setRiskRegister = useRiskOpsStore(state => state.setRiskRegister)
  const setDeletedRiskRegister = useRiskOpsStore(state => state.setDeletedRiskRegister)
  const setLoading = useRiskOpsStore(state => state.setLoading)
  const setError = useRiskOpsStore(state => state.setError)
  const addRisk = useRiskOpsStore(state => state.addRisk)
  const updateRisk = useRiskOpsStore(state => state.updateRisk)
  const removeRisk = useRiskOpsStore(state => state.removeRisk)

  const riskFields: CrudField[] = [
    { key: 'risk_name', label: 'Nama Risiko', type: 'text', required: true, placeholder: 'Masukkan nama risiko' },
    { key: 'risk_description', label: 'Deskripsi Risiko', type: 'textarea', required: true, placeholder: 'Deskripsi lengkap risiko' },
    { key: 'risk_category', label: 'Kategori Risiko', type: 'select', required: true, options: [
      'Operational',
      'Financial',
      'Strategic',
      'Compliance',
      'Reputational',
      'Technology',
      'Security'
    ]},
    { key: 'risk_owner', label: 'Pemilik Risiko', type: 'text', required: true, placeholder: 'Nama pemilik risiko' },
    { key: 'likelihood', label: 'Kemungkinan', type: 'select', required: true, options: [
      'Very Low',
      'Low',
      'Medium',
      'High',
      'Very High'
    ]},
    { key: 'impact', label: 'Dampak', type: 'select', required: true, options: [
      'Very Low',
      'Low',
      'Medium',
      'High',
      'Very High'
    ]},
    { key: 'risk_score', label: 'Skor Risiko', type: 'number', required: true, placeholder: 'Skor risiko (1-25)' },
    { key: 'risk_level', label: 'Tingkat Risiko', type: 'select', required: true, options: [
      'Critical',
      'High',
      'Medium',
      'Low'
    ]},
    { key: 'existing_controls', label: 'Kontrol Eksisting', type: 'textarea', placeholder: 'Kontrol yang sudah ada' },
    { key: 'mitigation_actions', label: 'Tindakan Mitigasi', type: 'textarea', required: true, placeholder: 'Tindakan mitigasi yang diperlukan' },
    { key: 'target_date', label: 'Target Penyelesaian', type: 'date', required: true },
    { key: 'status', label: 'Status', type: 'select', required: true, options: [
      'Open',
      'In Progress',
      'Closed',
      'Accepted',
      'Transferred'
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
              <h1 className="text-3xl font-bold text-white mb-2">RiskOps - Manajemen Risiko</h1>
              <p className="text-gray-400">
                Kelola register risiko, kerentanan, penilaian vendor, dan kelangsungan bisnis
              </p>
            </div>

            <SinglePageCrud
        title="Register Risiko"
        description="Kelola register risiko perusahaan"
        aiContext="RiskOps"
        fields={riskFields}
        api={{
          getAll: riskopsAPI.getRiskRegister,
          getById: riskopsAPI.getRisk,
          create: riskopsAPI.createRisk,
          update: riskopsAPI.updateRisk,
          delete: riskopsAPI.deleteRisk,
          getDeleted: riskopsAPI.getDeletedRisks,
          restore: riskopsAPI.restoreRisk,
          permanentDelete: riskopsAPI.permanentDeleteRisk,
        }}
        store={{
          items: riskRegister,
          deletedItems: deletedRiskRegister,
          loading,
          error,
          setItems: setRiskRegister as any,
          setDeletedItems: setDeletedRiskRegister as any,
          setLoading,
          setError,
          addItem: addRisk as any,
          updateItem: updateRisk as any,
          removeItem: removeRisk as any,
        }}
              showRecovery={true}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
