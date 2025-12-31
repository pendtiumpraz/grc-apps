'use client'

import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Compliance Trend Data
const complianceTrendData = [
    { month: 'Jan', gdpr: 88, sox: 92, hipaa: 85, iso: 90 },
    { month: 'Feb', gdpr: 90, sox: 93, hipaa: 87, iso: 91 },
    { month: 'Mar', gdpr: 92, sox: 94, hipaa: 89, iso: 93 },
    { month: 'Apr', gdpr: 94, sox: 95, hipaa: 91, iso: 94 },
]

// Risk Distribution Data
const riskDistributionData = [
    { name: 'Critical', value: 2, color: '#dc2626' },
    { name: 'High', value: 8, color: '#f59e0b' },
    { name: 'Medium', value: 15, color: '#eab308' },
    { name: 'Low', value: 25, color: '#10b981' },
]

// Audit Status Data
const auditStatusData = [
    { status: 'Completed', count: 12 },
    { status: 'In Progress', count: 5 },
    { status: 'Planned', count: 8 },
]

export function ComplianceTrendChart() {
    return (
        <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-4">Compliance Score Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={complianceTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                        labelStyle={{ color: '#f3f4f6' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="gdpr" stroke="#00d4ff" strokeWidth={2} name="GDPR" />
                    <Line type="monotone" dataKey="sox" stroke="#0ea5e9" strokeWidth={2} name="SOX" />
                    <Line type="monotone" dataKey="hipaa" stroke="#a855f7" strokeWidth={2} name="HIPAA" />
                    <Line type="monotone" dataKey="iso" stroke="#10b981" strokeWidth={2} name="ISO 27001" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export function RiskDistributionChart() {
    return (
        <div className="bg-gray-900/50 border border-orange-500/20 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-4">Risk Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={riskDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {riskDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

export function AuditStatusChart() {
    return (
        <div className="bg-gray-900/50 border border-green-500/20 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-4">Audit Status Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={auditStatusData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="status" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                        labelStyle={{ color: '#f3f4f6' }}
                    />
                    <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
