'use client';

import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import RiskOpsMonitoring from '@/components/dashboard/RiskOpsMonitoring';

export default function RiskOpsMonitoringPage() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] flex">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />

        <main className="flex-1 overflow-y-auto p-6">
          <RiskOpsMonitoring domain="riskops" />
        </main>
      </div>
    </div>
  );
}
