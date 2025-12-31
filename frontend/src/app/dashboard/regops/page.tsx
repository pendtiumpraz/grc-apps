'use client'

import React from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import SinglePageCrud, { CrudField } from '@/components/dashboard/SinglePageCrud'
import { useRegOpsStore } from '@/stores/useRegOpsStore'
import { regopsAPI } from '@/lib/api'

export default function RegOpsPage() {
  const regulations = useRegOpsStore(state => state.regulations)
  const deletedRegulations = useRegOpsStore(state => state.deletedRegulations)
  const loading = useRegOpsStore(state => state.loading)
  const error = useRegOpsStore(state => state.error)
  const setRegulations = useRegOpsStore(state => state.setRegulations)
  const setDeletedRegulations = useRegOpsStore(state => state.setDeletedRegulations)
  const setLoading = useRegOpsStore(state => state.setLoading)
  const setError = useRegOpsStore(state => state.setError)
  const addRegulation = useRegOpsStore(state => state.addRegulation)
  const updateRegulation = useRegOpsStore(state => state.updateRegulation)
  const removeRegulation = useRegOpsStore(state => state.removeRegulation)

  const regulationFields: CrudField[] = [
    { key: 'title', label: 'Judul Regulasi', type: 'text', required: true, placeholder: 'Masukkan judul regulasi' },
    { key: 'description', label: 'Deskripsi', type: 'textarea', required: true, placeholder: 'Deskripsi lengkap regulasi' },
    { key: 'category', label: 'Kategori', type: 'select', required: true, options: [
      'Data Protection',
      'Financial',
      'Healthcare',
      'Industry Specific',
      'International',
      'National',
      'Sector Specific'
    ]},
    { key: 'jurisdiction', label: 'Yurisdiksi', type: 'select', required: true, options: [
      'Indonesia',
      'International',
      'EU',
      'US',
      'Asia Pacific',
      'Other'
    ]},
    { key: 'effective_date', label: 'Tanggal Efektif', type: 'date', required: true },
    { key: 'status', label: 'Status', type: 'select', required: true, options: [
      'Active',
      'Draft',
      'Under Review',
      'Superseded',
      'Deprecated'
    ]},
    { key: 'compliance_framework', label: 'Framework Kepatuhan', type: 'select', options: [
      'GDPR',
      'UU PDP',
      'ISO 27001',
      'SOC 2',
      'PCI DSS',
      'HIPAA',
      'NIST',
      'Other'
    ]},
    { key: 'priority', label: 'Prioritas', type: 'select', options: [
      'Critical',
      'High',
      'Medium',
      'Low'
    ]},
  ]

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-6">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">RegOps - Regulasi & Kepatuhan</h1>
              <p className="text-gray-400">
                Kelola regulasi, penilaian kepatuhan, kebijakan, dan kontrol
              </p>
            </div>

            {/* Content Section */}
            <div className="mt-8">
              <SinglePageCrud
        title="Regulasi"
        description="Kelola regulasi dan framework kepatuhan"
        aiContext="RegOps"
        fields={regulationFields}
        api={{
          getAll: regopsAPI.getRegulations,
          getById: regopsAPI.getRegulation,
          create: regopsAPI.createRegulation,
          update: regopsAPI.updateRegulation,
          delete: regopsAPI.deleteRegulation,
          getDeleted: regopsAPI.getDeletedRegulations,
          restore: regopsAPI.restoreRegulation,
          permanentDelete: regopsAPI.permanentDeleteRegulation,
        }}
        store={{
          items: regulations,
          deletedItems: deletedRegulations,
          loading,
          error,
          setItems: setRegulations as any,
          setDeletedItems: setDeletedRegulations as any,
          setLoading,
          setError,
          addItem: addRegulation as any,
          updateItem: updateRegulation as any,
          removeItem: removeRegulation as any,
        }}
                showRecovery={true}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
