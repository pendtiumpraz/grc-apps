'use client';

import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import SinglePageCrud, { CrudField } from '@/components/dashboard/SinglePageCrud';
import { usePrivacyOpsStore } from '@/stores/usePrivacyOpsStore';
import { privacyopsAPI } from '@/lib/api';

export default function PrivacyControlsPage() {
  const privacyControls = usePrivacyOpsStore(state => state.privacyControls)
  const deletedPrivacyControls = usePrivacyOpsStore(state => state.deletedPrivacyControls)
  const loading = usePrivacyOpsStore(state => state.loading)
  const error = usePrivacyOpsStore(state => state.error)
  const setPrivacyControls = usePrivacyOpsStore(state => state.setPrivacyControls)
  const setDeletedPrivacyControls = usePrivacyOpsStore(state => state.setDeletedPrivacyControls)
  const setLoading = usePrivacyOpsStore(state => state.setLoading)
  const setError = usePrivacyOpsStore(state => state.setError)
  const addPrivacyControl = usePrivacyOpsStore(state => state.addPrivacyControl)
  const updatePrivacyControl = usePrivacyOpsStore(state => state.updatePrivacyControl)
  const removePrivacyControl = usePrivacyOpsStore(state => state.removePrivacyControl)

  const privacyControlFields: CrudField[] = [
    { key: 'title', label: 'Judul Kontrol', type: 'text', required: true, placeholder: 'Masukkan judul kontrol' },
    { key: 'description', label: 'Deskripsi', type: 'textarea', required: true, placeholder: 'Deskripsi kontrol privasi' },
    { key: 'control_type', label: 'Tipe Kontrol', type: 'select', required: true, options: [
      'Technical',
      'Organizational',
      'Legal',
      'Physical'
    ]},
    { key: 'implementation_status', label: 'Status Implementasi', type: 'select', required: true, options: [
      'Not Implemented',
      'Partially Implemented',
      'Implemented',
      'Verified'
    ]},
    { key: 'effectiveness', label: 'Efektivitas', type: 'select', options: [
      'High',
      'Medium',
      'Low',
      'Not Assessed'
    ]},
    { key: 'testing_procedure', label: 'Prosedur Pengujian', type: 'textarea', placeholder: 'Prosedur pengujian kontrol' },
    { key: 'last_tested', label: 'Terakhir Diuji', type: 'date' },
    { key: 'next_test', label: 'Pengujian Berikutnya', type: 'date' },
    { key: 'owner', label: 'Pemilik', type: 'text', required: true, placeholder: 'Nama pemilik kontrol' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Kontrol Privasi</h1>
            <p className="text-gray-400">
              Kelola kontrol privasi dan perlindungan data
            </p>
          </div>

          <SinglePageCrud
        title="Kontrol Privasi"
        description="Kelola kontrol privasi dan perlindungan data"
        aiContext="PrivacyOps Privacy Control"
        fields={privacyControlFields}
        api={{
          getAll: privacyopsAPI.getPrivacyControls,
          getById: privacyopsAPI.getPrivacyControl,
          create: privacyopsAPI.createPrivacyControl,
          update: privacyopsAPI.updatePrivacyControl,
          delete: privacyopsAPI.deletePrivacyControl,
          getDeleted: privacyopsAPI.getDeletedPrivacyControls,
          restore: privacyopsAPI.restorePrivacyControl,
          permanentDelete: privacyopsAPI.permanentDeletePrivacyControl,
        }}
        store={{
          items: privacyControls,
          deletedItems: deletedPrivacyControls,
          loading,
          error,
          setItems: setPrivacyControls as any,
          setDeletedItems: setDeletedPrivacyControls as any,
          setLoading,
          setError,
          addItem: addPrivacyControl as any,
          updateItem: updatePrivacyControl as any,
          removeItem: removePrivacyControl as any,
        }}
            showRecovery={true}
          />
        </main>
      </div>
    </div>
  )
}
