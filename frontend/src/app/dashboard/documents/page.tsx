'use client'

import React from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import DocumentList from '@/components/dashboard/DocumentList'

export default function DocumentsPage() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] flex">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">Dokumen</h1>
              <p className="text-gray-400">
                Kelola dokumen kepatuhan, analisis, dan laporan dengan bantuan AI
              </p>
            </div>

            <DocumentList />
          </div>
        </main>
      </div>
    </div>
  )
}
