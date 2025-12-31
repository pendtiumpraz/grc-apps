'use client';

import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import RegOpsMonitoring from '@/components/dashboard/RegOpsMonitoring';

export default function RegOpsMonitoringPage() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] flex">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />

        <main className="flex-1 overflow-y-auto p-6">
          <RegOpsMonitoring domain="regops" />
        </main>
      </div>
    </div>
  );
}
