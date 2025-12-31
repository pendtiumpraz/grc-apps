'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { ArrowLeft, Save, Trash2, FileCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function EditAuditPage() {
    const router = useRouter()
    const params = useParams()
    const id = params?.id

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showDeleteModal, setShowDeleteModal] = useState(false)
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

    useEffect(() => {
        if (id) {
            // Mock data
            setFormData({
                name: 'Q1 2024 SOX Audit',
                description: 'Quarterly SOX compliance audit',
                framework: 'SOX',
                type: 'External',
                status: 'In Progress',
                auditor: 'External Firm',
                startDate: '2024-01-15',
                dueDate: '2024-03-31',
                scope: 'Financial controls and IT general controls',
                objectives: 'Verify compliance with SOX requirements',
            })
        }
    }, [id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            console.log('Updating audit:', id, formData)
            alert('Audit updated successfully!')
            router.push('/dashboard/auditops')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = () => {
        console.log('Deleting audit:', id)
        alert('Audit deleted successfully!')
        router.push('/dashboard/auditops')
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
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                                    <FileCheck className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-white">Edit Audit</h1>
                                    <p className="text-gray-400">Update audit details</p>
                                </div>
                            </div>
                            <Button onClick={() => setShowDeleteModal(true)} variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                        </div>
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
                                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                                </div>

                                <div>
                                    <Label htmlFor="framework">Framework *</Label>
                                    <select id="framework" name="framework" value={formData.framework} onChange={handleChange} required className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-900/80 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all">
                                        {frameworks.map((f) => <option key={f} value={f}>{f}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <Label htmlFor="type">Audit Type *</Label>
                                    <select id="type" name="type" value={formData.type} onChange={handleChange} required className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-900/80 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all">
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
                                    <Input id="auditor" name="auditor" value={formData.auditor} onChange={handleChange} />
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
                                    <textarea id="scope" name="scope" value={formData.scope} onChange={handleChange} rows={3} className="w-full px-3 py-2 bg-gray-900/80 border border-gray-700 text-gray-100 placeholder:text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-all" />
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor="objectives">Objectives</Label>
                                    <textarea id="objectives" name="objectives" value={formData.objectives} onChange={handleChange} rows={3} className="w-full px-3 py-2 bg-gray-900/80 border border-gray-700 text-gray-100 placeholder:text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-all" />
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor="description">Description</Label>
                                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-3 py-2 bg-gray-900/80 border border-gray-700 text-gray-100 placeholder:text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-all" />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-end">
                            <Link href="/dashboard/auditops">
                                <Button type="button" variant="outline" className="border-green-500/30 text-gray-300">Cancel</Button>
                            </Link>
                            <Button type="submit" disabled={loading} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30">
                                <Save className="h-4 w-4 mr-2" />
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </main>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900/95 border border-red-500/30 rounded-xl p-6 max-w-md w-full shadow-2xl shadow-red-500/20">
                        <div className="mb-4">
                            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                                <Trash2 className="h-6 w-6 text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Delete Audit</h3>
                            <p className="text-gray-400">Are you sure you want to delete "{formData.name}"? This action cannot be undone.</p>
                        </div>
                        <div className="flex gap-3">
                            <Button onClick={() => setShowDeleteModal(false)} variant="outline" className="flex-1 border-gray-700">Cancel</Button>
                            <Button onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white">Delete</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
