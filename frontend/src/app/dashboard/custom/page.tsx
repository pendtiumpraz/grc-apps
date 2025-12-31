'use client';

import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { CustomizableDashboard } from '@/components/dashboard/CustomizableDashboard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CustomDashboardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-6">
            {/* Mobile Header */}
            <div className="mb-4 md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Custom Dashboard</h1>
            <p className="text-gray-400 text-sm md:text-base">
              Drag and drop widgets to customize your dashboard
            </p>
          </div>

            {/* Customizable Dashboard */}
            <CustomizableDashboard />
          </div>
        </main>
      </div>
    </div>
  );
}
