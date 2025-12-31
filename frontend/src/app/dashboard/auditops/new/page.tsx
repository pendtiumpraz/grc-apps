'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { ArrowLeft, Save, FileCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function NewAuditPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        framework: '',
        type: '',
        status: 'Planned',
        auditor: '',
        startDate: '',
        dueDate: '',
        scope: '',
        objectives: '',
    })

    const frameworks = ['SOX', 'GDPR', 'HIPAA', 'ISO 27001', 'PCI DSS', 'NIST', 'Internal']
    const types = ['Internal', 'External', 'Compliance', 'Operational', 'Financial', 'IT']
    const statuses = ['Planned', 'In Progress', 'Under Review', 'Completed', 'Cancelled']

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            console.log('Creating audit:', formData)
            alert('Audit created successfully!')
            router.push('/dashboard/auditops')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div className="min-h-screen bg-[#0a0e1a] flex">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <TopNav />
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="mb-8">
                        <Link href="/dashboard/auditops" className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 mb-4 transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Audits
                        </Link>
                        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                                <FileCheck className="h-6 w-6 text-white" />
                            </div>
                            Create New Audit
                        </h1>
                        <p className="text-gray-400">Plan a new audit engagement</p>
                    </div>

                    {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="bg-gray-900/50 border border-green-500/20 rounded-xl p-8 backdrop-blur-sm mb-6">
                            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                Audit Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <Label htmlFor="name">Audit Name *</Label>
                                    <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Q1 2024 SOX Audit" required />
                                </div>

                                <div>
                                    <Label htmlFor="framework">Framework *</Label>
                                    <select id="framework" name="framework" value={formData.framework} onChange={handleChange} required className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-900/80 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all">
                                        <option value="">Select framework</option>
                                        {frameworks.map((f) => <option key={f} value={f}>{f}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <Label htmlFor="type">Audit Type *</Label>
                                    <select id="type" name="type" value={formData.type} onChange={handleChange} required className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-900/80 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all">
                                        <option value="">Select type</option>
                                        {types.map((t) => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <Label htmlFor="status">Status</Label>
                                    <select id="status" name="status" value={formData.status} onChange={handleChange} className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-900/80 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all">
                                        {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <Label htmlFor="auditor">Lead Auditor</Label>
                                    <Input id="auditor" name="auditor" value={formData.auditor} onChange={handleChange} placeholder="Person or firm" />
                                </div>

                                <div>
                                    <Label htmlFor="startDate">Start Date</Label>
                                    <Input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleChange} />
                                </div>

                                <div>
                                    <Label htmlFor="dueDate">Due Date *</Label>
                                    <Input id="dueDate" name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} required />
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor="scope">Audit Scope</Label>
                                    <textarea id="scope" name="scope" value={formData.scope} onChange={handleChange} rows={3} placeholder="Define what will be audited..." className="w-full px-3 py-2 bg-gray-900/80 border border-gray-700 text-gray-100 placeholder:text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-all" />
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor="objectives">Objectives</Label>
                                    <textarea id="objectives" name="objectives" value={formData.objectives} onChange={handleChange} rows={3} placeholder="What are the audit objectives..." className="w-full px-3 py-2 bg-gray-900/80 border border-gray-700 text-gray-100 placeholder:text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-all" />
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor="description">Description</Label>
                                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Describe the audit..." className="w-full px-3 py-2 bg-gray-900/80 border border-gray-700 text-gray-100 placeholder:text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-all" />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-end">
                            <Link href="/dashboard/auditops">
                                <Button type="button" variant="outline" className="border-green-500/30 text-gray-300">Cancel</Button>
                            </Link>
                            <Button type="submit" disabled={loading} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30">
                                <Save className="h-4 w-4 mr-2" />
                                {loading ? 'Creating...' : 'Create Audit'}
                            </Button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    )
}
