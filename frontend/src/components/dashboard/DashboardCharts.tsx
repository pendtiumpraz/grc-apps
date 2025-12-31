'use client'

import React, { useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'

interface DashboardChartsProps {
  data?: {
    totalRegulations?: number
    totalRisks?: number
    totalPolicies?: number
    totalAudits?: number
    complianceScore?: number
    riskTrend?: { month: string; count: number }[]
    riskDistribution?: { category: string; count: number }[]
    complianceByFramework?: { framework: string; score: number }[]
  }
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ data }) => {
  const riskTrendRef = useRef<HTMLCanvasElement>(null)
  const riskDistributionRef = useRef<HTMLCanvasElement>(null)
  const complianceChartRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let charts: any[] = []

    // Load Chart.js dynamically
    const loadChartJS = async () => {
      try {
        const Chart = (await import('chart.js/auto')).default

        // Risk Trend Chart
        if (riskTrendRef.current && data?.riskTrend) {
          const trendChart = new Chart(riskTrendRef.current, {
            type: 'line',
            data: {
              labels: data.riskTrend.map((d) => d.month),
              datasets: [{
                label: 'Risks',
                data: data.riskTrend.map((d) => d.count),
                borderColor: 'rgb(6, 182, 212)',
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                fill: true,
                tension: 0.4
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  labels: { color: '#9ca3af' }
                }
              },
              scales: {
                x: {
                  ticks: { color: '#9ca3af' },
                  grid: { color: '#374151' }
                },
                y: {
                  ticks: { color: '#9ca3af' },
                  grid: { color: '#374151' }
                }
              }
            }
          })
          charts.push(trendChart)
        }

        // Risk Distribution Chart
        if (riskDistributionRef.current && data?.riskDistribution) {
          const distChart = new Chart(riskDistributionRef.current, {
            type: 'doughnut',
            data: {
              labels: data.riskDistribution.map((d) => d.category),
              datasets: [{
                data: data.riskDistribution.map((d) => d.count),
                backgroundColor: [
                  'rgba(239, 68, 68, 0.8)',
                  'rgba(249, 115, 22, 0.8)',
                  'rgba(234, 179, 8, 0.8)',
                  'rgba(34, 197, 94, 0.8)',
                  'rgba(59, 130, 246, 0.8)',
                  'rgba(168, 85, 247, 0.8)'
                ],
                borderWidth: 0
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: { color: '#9ca3af' }
                }
              }
            }
          })
          charts.push(distChart)
        }

        // Compliance by Framework Chart
        if (complianceChartRef.current && data?.complianceByFramework) {
          const compChart = new Chart(complianceChartRef.current, {
            type: 'bar',
            data: {
              labels: data.complianceByFramework.map((d) => d.framework),
              datasets: [{
                label: 'Compliance Score',
                data: data.complianceByFramework.map((d) => d.score),
                backgroundColor: data.complianceByFramework.map((d) => {
                  if (d.score >= 80) return 'rgba(34, 197, 94, 0.8)'
                  if (d.score >= 60) return 'rgba(234, 179, 8, 0.8)'
                  return 'rgba(239, 68, 68, 0.8)'
                }),
                borderRadius: 8
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                x: {
                  ticks: { color: '#9ca3af' },
                  grid: { display: false }
                },
                y: {
                  min: 0,
                  max: 100,
                  ticks: { color: '#9ca3af' },
                  grid: { color: '#374151' }
                }
              }
            }
          })
          charts.push(compChart)
        }
      } catch (error) {
        console.error('Error loading Chart.js:', error)
      }
    }

    loadChartJS()

    // Cleanup function
    return () => {
      charts.forEach((chart) => chart.destroy())
    }
  }, [data])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Compliance Score */}
      <Card className="bg-gray-900 border-gray-700 p-6">
        <h3 className="text-gray-400 text-sm font-medium mb-4">Overall Compliance Score</h3>
        <div className="flex items-center justify-center">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#374151"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke={data?.complianceScore && data.complianceScore >= 80 ? '#22c55e' : data?.complianceScore && data.complianceScore >= 60 ? '#eab308' : '#ef4444'}
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(data?.complianceScore || 0) * 3.52} 352`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {data?.complianceScore || 0}%
              </span>
            </div>
          </div>
        </div>
        <p className="text-center text-gray-400 text-sm mt-4">
          {data?.complianceScore && data.complianceScore >= 80 ? 'Excellent' : data?.complianceScore && data.complianceScore >= 60 ? 'Good' : 'Needs Improvement'}
        </p>
      </Card>

      {/* Quick Stats */}
      <Card className="bg-gray-900 border-gray-700 p-6">
        <h3 className="text-gray-400 text-sm font-medium mb-4">Quick Stats</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <span className="text-cyan-400">📋</span>
              </div>
              <div>
                <p className="text-white font-medium">Regulations</p>
                <p className="text-gray-400 text-sm">Active</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-white">{data?.totalRegulations || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                <span className="text-red-400">⚠️</span>
              </div>
              <div>
                <p className="text-white font-medium">Risks</p>
                <p className="text-gray-400 text-sm">Open</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-white">{data?.totalRisks || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <span className="text-green-400">📄</span>
              </div>
              <div>
                <p className="text-white font-medium">Policies</p>
                <p className="text-gray-400 text-sm">Published</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-white">{data?.totalPolicies || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <span className="text-purple-400">🔍</span>
              </div>
              <div>
                <p className="text-white font-medium">Audits</p>
                <p className="text-gray-400 text-sm">In Progress</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-white">{data?.totalAudits || 0}</span>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-gray-900 border-gray-700 p-6">
        <h3 className="text-gray-400 text-sm font-medium mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <p className="text-gray-300">New compliance assessment completed</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            <p className="text-gray-300">Risk register updated</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            <p className="text-gray-300">Audit plan scheduled</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 rounded-full bg-purple-400"></div>
            <p className="text-gray-300">New policy published</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
            <p className="text-gray-300">Document generated by AI</p>
          </div>
        </div>
      </Card>

      {/* Risk Trend Chart */}
      <Card className="bg-gray-900 border-gray-700 p-6 md:col-span-2">
        <h3 className="text-gray-400 text-sm font-medium mb-4">Risk Trend (Last 6 Months)</h3>
        <div className="h-64">
          <canvas ref={riskTrendRef}></canvas>
        </div>
      </Card>

      {/* Risk Distribution Chart */}
      <Card className="bg-gray-900 border-gray-700 p-6">
        <h3 className="text-gray-400 text-sm font-medium mb-4">Risk Distribution</h3>
        <div className="h-64">
          <canvas ref={riskDistributionRef}></canvas>
        </div>
      </Card>

      {/* Compliance by Framework */}
      <Card className="bg-gray-900 border-gray-700 p-6 md:col-span-2">
        <h3 className="text-gray-400 text-sm font-medium mb-4">Compliance by Framework</h3>
        <div className="h-64">
          <canvas ref={complianceChartRef}></canvas>
        </div>
      </Card>
    </div>
  )
}

export default DashboardCharts
