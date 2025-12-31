'use client';

import React from 'react';
import SinglePageCrud, { CrudField } from '@/components/dashboard/SinglePageCrud';
import { useAuditOpsStore } from '@/stores/useAuditOpsStore';
import { auditopsAPI } from '@/lib/api';

export default function ControlTestsPage() {
  const controlTests = useAuditOpsStore(state => state.controlTests)
  const deletedControlTests = useAuditOpsStore(state => state.deletedControlTests)
  const loading = useAuditOpsStore(state => state.loading)
  const error = useAuditOpsStore(state => state.error)
  const setControlTests = useAuditOpsStore(state => state.setControlTests)
  const setDeletedControlTests = useAuditOpsStore(state => state.setDeletedControlTests)
  const setLoading = useAuditOpsStore(state => state.setLoading)
  const setError = useAuditOpsStore(state => state.setError)
  const addControlTest = useAuditOpsStore(state => state.addControlTest)
  const updateControlTest = useAuditOpsStore(state => state.updateControlTest)
  const removeControlTest = useAuditOpsStore(state => state.removeControlTest)

  const controlTestFields: CrudField[] = [
    { key: 'test_title', label: 'Judul Pengujian', type: 'text', required: true, placeholder: 'Masukkan judul pengujian' },
    { key: 'control_id', label: 'ID Kontrol', type: 'text', required: true, placeholder: 'ID kontrol yang diuji' },
    { key: 'test_procedure', label: 'Prosedur Pengujian', type: 'textarea', required: true, placeholder: 'Prosedur pengujian' },
    { key: 'test_date', label: 'Tanggal Pengujian', type: 'date', required: true },
    { key: 'tester', label: 'Penguji', type: 'text', required: true, placeholder: 'Nama penguji' },
    { key: 'test_result', label: 'Hasil Pengujian', type: 'select', required: true, options: [
      'Pass',
      'Fail',
      'Partial',
      'Not Tested'
    ]},
    { key: 'findings', label: 'Temuan', type: 'textarea', placeholder: 'Temuan dari pengujian' },
    { key: 'recommendations', label: 'Rekomendasi', type: 'textarea', placeholder: 'Rekomendasi perbaikan' },
    { key: 'evidence_references', label: 'Referensi Bukti', type: 'textarea', placeholder: 'Referensi ke bukti audit' },
    { key: 'follow_up_date', label: 'Tanggal Follow-up', type: 'date' },
    { key: 'status', label: 'Status', type: 'select', required: true, options: [
      'Scheduled',
      'In Progress',
      'Completed',
      'On Hold'
    ]},
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Pengujian Kontrol</h1>
        <p className="text-gray-400">
          Kelola pengujian kontrol dan validasi
        </p>
      </div>

      <SinglePageCrud
        title="Pengujian Kontrol"
        description="Kelola pengujian kontrol dan validasi"
        aiContext="AuditOps Control Test"
        fields={controlTestFields}
        api={{
          getAll: auditopsAPI.getControlTests,
          getById: auditopsAPI.getControlTest,
          create: auditopsAPI.createControlTest,
          update: auditopsAPI.updateControlTest,
          delete: auditopsAPI.deleteControlTest,
          getDeleted: auditopsAPI.getDeletedControlTests,
          restore: auditopsAPI.restoreControlTest,
          permanentDelete: auditopsAPI.permanentDeleteControlTest,
        }}
        store={{
          items: controlTests,
          deletedItems: deletedControlTests,
          loading,
          error,
          setItems: setControlTests as any,
          setDeletedItems: setDeletedControlTests as any,
          setLoading,
          setError,
          addItem: addControlTest as any,
          updateItem: updateControlTest as any,
          removeItem: removeControlTest as any,
        }}
        showRecovery={true}
      />
    </div>
  )
}
