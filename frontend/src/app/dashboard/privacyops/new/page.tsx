'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { ArrowLeft, Save, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function NewDataAssetPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            console.log('Creating data asset:', formData)
            alert('Data asset created successfully!')
            router.push('/dashboard/privacyops')
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
                        <Link href="/dashboard/privacyops" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-4 transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Data Inventory
                        </Link>
                        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                                <Shield className="h-6 w-6 text-white" />
                            </div>
                            Create New Data Asset
                        </h1>
                        <p className="text-gray-400">Add a new data asset to your inventory</p>
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
                                    <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Customer Database" required />
                                </div>

                                <div>
                                    <Label htmlFor="category">Category *</Label>
                                    <select id="category" name="category" value={formData.category} onChange={handleChange} required className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-900/80 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all">
                                        <option value="">Select category</option>
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
                                    <Input id="location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g., AWS S3, On-Premise" />
                                </div>

                                <div>
                                    <Label htmlFor="owner">Data Owner</Label>
                                    <Input id="owner" name="owner" value={formData.owner} onChange={handleChange} placeholder="Person responsible" />
                                </div>

                                <div>
                                    <Label htmlFor="records">Number of Records</Label>
                                    <Input id="records" name="records" type="number" value={formData.records} onChange={handleChange} placeholder="e.g., 50000" />
                                </div>

                                <div>
                                    <Label htmlFor="retention">Retention Period</Label>
                                    <Input id="retention" name="retention" value={formData.retention} onChange={handleChange} placeholder="e.g., 7 years" />
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor="purpose">Processing Purpose</Label>
                                    <textarea id="purpose" name="purpose" value={formData.purpose} onChange={handleChange} rows={3} placeholder="Why is this data collected and processed..." className="w-full px-3 py-2 bg-gray-900/80 border border-gray-700 text-gray-100 placeholder:text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" />
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor="description">Description</Label>
                                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Describe the data asset..." className="w-full px-3 py-2 bg-gray-900/80 border border-gray-700 text-gray-100 placeholder:text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-end">
                            <Link href="/dashboard/privacyops">
                                <Button type="button" variant="outline" className="border-purple-500/30 text-gray-300">Cancel</Button>
                            </Link>
                            <Button type="submit" disabled={loading} className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg shadow-purple-500/30">
                                <Save className="h-4 w-4 mr-2" />
                                {loading ? 'Creating...' : 'Create Asset'}
                            </Button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    )
}
