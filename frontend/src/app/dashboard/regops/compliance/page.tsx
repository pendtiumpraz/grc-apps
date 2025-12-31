'use client';

import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import SinglePageCrud, { CrudField } from '@/components/dashboard/SinglePageCrud';
import { useRegOpsStore } from '@/stores/useRegOpsStore';
import { regopsAPI } from '@/lib/api';

export default function ComplianceAssessmentsPage() {
  const complianceAssessments = useRegOpsStore(state => state.complianceAssessments)
  const deletedComplianceAssessments = useRegOpsStore(state => state.deletedComplianceAssessments)
  const loading = useRegOpsStore(state => state.loading)
  const error = useRegOpsStore(state => state.error)
  const setComplianceAssessments = useRegOpsStore(state => state.setComplianceAssessments)
  const setDeletedComplianceAssessments = useRegOpsStore(state => state.setDeletedComplianceAssessments)
  const setLoading = useRegOpsStore(state => state.setLoading)
  const setError = useRegOpsStore(state => state.setError)
  const addComplianceAssessment = useRegOpsStore(state => state.addComplianceAssessment)
  const updateComplianceAssessment = useRegOpsStore(state => state.updateComplianceAssessment)
  const removeComplianceAssessment = useRegOpsStore(state => state.removeComplianceAssessment)

  const complianceFields: CrudField[] = [
    { key: 'regulation_id', label: 'Regulation', type: 'select', required: true, placeholder: 'Select Regulation' },
    { key: 'name', label: 'Assessment Name', type: 'text', required: true, placeholder: 'Enter assessment name' },
    { key: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'Enter description' },
    { key: 'assessment_date', label: 'Assessment Date', type: 'date', required: true },
    { key: 'assessor', label: 'Assessor', type: 'text', required: true, placeholder: 'Enter assessor name' },
    { key: 'status', label: 'Status', type: 'select', required: true, options: ['Not Started', 'In Progress', 'Completed', 'Review Required'] },
    { key: 'compliance_score', label: 'Compliance Score (%)', type: 'number', placeholder: 'Enter score' },
    { key: 'findings', label: 'Findings', type: 'textarea', placeholder: 'Enter findings' },
    { key: 'recommendations', label: 'Recommendations', type: 'textarea', placeholder: 'Enter recommendations' },
    { key: 'next_review_date', label: 'Next Review Date', type: 'date' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Penilaian Kepatuhan</h1>
            <p className="text-gray-400">
              Kelola penilaian kepatuhan dan lacak status kepatuhan regulasi
            </p>
          </div>

          <SinglePageCrud
        title="Penilaian Kepatuhan"
        description="Kelola penilaian kepatuhan dan status regulasi"
        aiContext="RegOps Compliance Assessment"
        fields={complianceFields}
        api={{
          getAll: regopsAPI.getComplianceAssessments,
          getById: regopsAPI.getComplianceAssessment,
          create: regopsAPI.createComplianceAssessment,
          update: regopsAPI.updateComplianceAssessment,
          delete: regopsAPI.deleteComplianceAssessment,
          getDeleted: regopsAPI.getDeletedComplianceAssessments,
          restore: regopsAPI.restoreComplianceAssessment,
          permanentDelete: regopsAPI.permanentDeleteComplianceAssessment,
        }}
        store={{
          items: complianceAssessments,
          deletedItems: deletedComplianceAssessments,
          loading,
          error,
          setItems: setComplianceAssessments as any,
          setDeletedItems: setDeletedComplianceAssessments as any,
          setLoading,
          setError,
          addItem: addComplianceAssessment as any,
          updateItem: updateComplianceAssessment as any,
          removeItem: removeComplianceAssessment as any,
        }}
            showRecovery={true}
          />
        </main>
      </div>
    </div>
  )
}
