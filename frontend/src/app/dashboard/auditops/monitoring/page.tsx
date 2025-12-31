'use client';

import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import AuditOpsMonitoring from '@/components/dashboard/AuditOpsMonitoring';

export default function AuditOpsMonitoringPage() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] flex">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />

        <main className="flex-1 overflow-y-auto p-6">
          <AuditOpsMonitoring domain="auditops" />
        </main>
      </div>
    </div>
  );
}
