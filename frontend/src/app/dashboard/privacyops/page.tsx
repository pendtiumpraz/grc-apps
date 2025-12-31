'use client'

import React from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import SinglePageCrud, { CrudField } from '@/components/dashboard/SinglePageCrud'
import { usePrivacyOpsStore } from '@/stores/usePrivacyOpsStore'
import { privacyopsAPI } from '@/lib/api'

export default function PrivacyOpsPage() {
  const dataInventory = usePrivacyOpsStore(state => state.dataInventory)
  const deletedDataInventory = usePrivacyOpsStore(state => state.deletedDataInventory)
  const loading = usePrivacyOpsStore(state => state.loading)
  const error = usePrivacyOpsStore(state => state.error)
  const setDataInventory = usePrivacyOpsStore(state => state.setDataInventory)
  const setDeletedDataInventory = usePrivacyOpsStore(state => state.setDeletedDataInventory)
  const setLoading = usePrivacyOpsStore(state => state.setLoading)
  const setError = usePrivacyOpsStore(state => state.setError)
  const addDataInventory = usePrivacyOpsStore(state => state.addDataInventory)
  const updateDataInventory = usePrivacyOpsStore(state => state.updateDataInventory)
  const removeDataInventory = usePrivacyOpsStore(state => state.removeDataInventory)

  const dataInventoryFields: CrudField[] = [
    { key: 'data_name', label: 'Nama Data', type: 'text', required: true, placeholder: 'Masukkan nama data' },
    { key: 'data_type', label: 'Tipe Data', type: 'select', required: true, options: [
      'Personal Data',
      'Sensitive Personal Data',
      'Corporate Data',
      'Financial Data',
      'Health Data',
      'Biometric Data'
    ]},
    { key: 'data_category', label: 'Kategori Data', type: 'select', required: true, options: [
      'Customer Data',
      'Employee Data',
      'Partner Data',
      'Public Data',
      'Confidential Data'
    ]},
    { key: 'data_owner', label: 'Pemilik Data', type: 'text', required: true, placeholder: 'Nama pemilik data' },
    { key: 'data_steward', label: 'Data Steward', type: 'text', placeholder: 'Nama data steward' },
    { key: 'data_location', label: 'Lokasi Data', type: 'text', required: true, placeholder: 'Lokasi penyimpanan data' },
    { key: 'data_purpose', label: 'Tujuan Data', type: 'textarea', required: true, placeholder: 'Tujuan penggunaan data' },
    { key: 'legal_basis', label: 'Dasar Hukum', type: 'select', required: true, options: [
      'Consent',
      'Contract',
      'Legal Obligation',
      'Vital Interests',
      'Public Task',
      'Legitimate Interests'
    ]},
    { key: 'retention_period', label: 'Periode Retensi', type: 'text', required: true, placeholder: 'Contoh: 5 tahun' },
    { key: 'data_subjects', label: 'Subjek Data', type: 'textarea', placeholder: 'Daftar subjek data' },
    { key: 'third_party_sharing', label: 'Berbagi Pihak Ketiga', type: 'textarea', placeholder: 'Daftar pihak ketiga' },
    { key: 'security_measures', label: 'Tindakan Keamanan', type: 'textarea', placeholder: 'Tindakan keamanan yang diterapkan' },
    { key: 'sensitivity_level', label: 'Tingkat Sensitivitas', type: 'select', required: true, options: [
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
              <h1 className="text-3xl font-bold text-white mb-2">PrivacyOps - Privasi & Perlindungan Data</h1>
              <p className="text-gray-400">
                Kelola inventaris data, permintaan DSR, DPIA, dan kontrol privasi
              </p>
            </div>

            {/* Content Section */}
            <div className="mt-8">
              <SinglePageCrud
        title="Inventaris Data"
        description="Kelola inventaris data dan aset informasi"
        aiContext="PrivacyOps"
        fields={dataInventoryFields}
        api={{
          getAll: privacyopsAPI.getDataInventory,
          getById: privacyopsAPI.getDataAsset,
          create: privacyopsAPI.createDataInventory,
          update: privacyopsAPI.updateDataInventory,
          delete: privacyopsAPI.deleteDataInventory,
          getDeleted: privacyopsAPI.getDeletedDataInventory,
          restore: privacyopsAPI.restoreDataInventory,
          permanentDelete: privacyopsAPI.permanentDeleteDataInventory,
        }}
        store={{
          items: dataInventory,
          deletedItems: deletedDataInventory,
          loading,
          error,
          setItems: setDataInventory as any,
          setDeletedItems: setDeletedDataInventory as any,
          setLoading,
          setError,
          addItem: addDataInventory as any,
          updateItem: updateDataInventory as any,
          removeItem: removeDataInventory as any,
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
