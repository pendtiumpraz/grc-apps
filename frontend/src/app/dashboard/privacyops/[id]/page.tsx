'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { ArrowLeft, Save, Trash2, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function EditDataAssetPage() {
    const router = useRouter()
    const params = useParams()
    const id = params?.id

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        sensitivity: 'Medium',
        dataType: '',
        location: '',
        owner: '',
        records: '',
        retention: '',
        purpose: '',
    })

    const categories = ['Personal Data', 'HR Data', 'Financial', 'Analytics', 'Marketing', 'Technical']
    const sensitivities = ['High', 'Medium', 'Low']
    const dataTypes = ['Structured', 'Unstructured', 'Semi-Structured']

    useEffect(() => {
        if (id) {
            // Mock data
            setFormData({
                name: 'Customer Database',
                description: 'Main customer information database',
                category: 'Personal Data',
                sensitivity: 'High',
                dataType: 'Structured',
                location: 'AWS RDS',
                owner: 'Data Team',
                records: '50000',
                retention: '7 years',
                purpose: 'Customer relationship management and service delivery',
            })
        }
    }, [id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            console.log('Updating data asset:', id, formData)
            alert('Data asset updated successfully!')
            router.push('/dashboard/privacyops')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = () => {
        console.log('Deleting data asset:', id)
        alert('Data asset deleted successfully!')
        router.push('/dashboard/privacyops')
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
                        <Link href="/dashboard/privacyops" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-4 transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Data Inventory
                        </Link>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                                    <Shield className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-white">Edit Data Asset</h1>
                                    <p className="text-gray-400">Update asset details</p>
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
                        <div className="bg-gray-900/50 border border-purple-500/20 rounded-xl p-8 backdrop-blur-sm mb-6">
                            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                Asset Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <Label htmlFor="name">Asset Name *</Label>
                                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                                </div>

                                <div>
                                    <Label htmlFor="category">Category *</Label>
                                    <select id="category" name="category" value={formData.category} onChange={handleChange} required className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-900/80 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all">
                                        {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <Label htmlFor="sensitivity">Sensitivity *</Label>
                                    <select id="sensitivity" name="sensitivity" value={formData.sensitivity} onChange={handleChange} required className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-900/80 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all">
                                        {sensitivities.map((s) => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <Label htmlFor="dataType">Data Type</Label>
                                    <select id="dataType" name="dataType" value={formData.dataType} onChange={handleChange} className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-900/80 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all">
                                        <option value="">Select type</option>
                                        {dataTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <Label htmlFor="location">Location</Label>
                                    <Input id="location" name="location" value={formData.location} onChange={handleChange} />
                                </div>

                                <div>
                                    <Label htmlFor="owner">Data Owner</Label>
                                    <Input id="owner" name="owner" value={formData.owner} onChange={handleChange} />
                                </div>

                                <div>
                                    <Label htmlFor="records">Number of Records</Label>
                                    <Input id="records" name="records" type="number" value={formData.records} onChange={handleChange} />
                                </div>

                                <div>
                                    <Label htmlFor="retention">Retention Period</Label>
                                    <Input id="retention" name="retention" value={formData.retention} onChange={handleChange} />
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor="purpose">Processing Purpose</Label>
                                    <textarea id="purpose" name="purpose" value={formData.purpose} onChange={handleChange} rows={3} className="w-full px-3 py-2 bg-gray-900/80 border border-gray-700 text-gray-100 placeholder:text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" />
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor="description">Description</Label>
                                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-3 py-2 bg-gray-900/80 border border-gray-700 text-gray-100 placeholder:text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-end">
                            <Link href="/dashboard/privacyops">
                                <Button type="button" variant="outline" className="border-purple-500/30 text-gray-300">Cancel</Button>
                            </Link>
                            <Button type="submit" disabled={loading} className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg shadow-purple-500/30">
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
                            <h3 className="text-xl font-bold text-white mb-2">Delete Data Asset</h3>
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
