'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { ArrowLeft, Save, Trash2, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function EditRegulationPage() {
    const router = useRouter()
    const params = useParams()
    const id = params?.id

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        framework: '',
        category: '',
        status: 'Draft',
        effectiveDate: '',
        reviewDate: '',
        requirements: '',
    })
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const frameworks = ['GDPR', 'SOX', 'HIPAA', 'ISO 27001', 'PCI DSS', 'NIST', 'Other']
    const categories = ['Data Protection', 'Financial Compliance', 'Security', 'Privacy', 'Operational', 'Other']
    const statuses = ['Draft', 'Active', 'Under Review', 'Archived']

    // Mock data fetch - replace with actual API call
    useEffect(() => {
        if (id) {
            // TODO: Fetch regulation by ID from API
            const mockData = {
                name: 'GDPR Article 32',
                description: 'Security of processing requirements',
                framework: 'GDPR',
                category: 'Data Protection',
                status: 'Active',
                effectiveDate: '2024-01-15',
                reviewDate: '2024-12-31',
                requirements: 'Implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk.',
            }
            setFormData(mockData)
        }
    }, [id])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: API call to update regulation
        console.log('Updating regulation:', id, formData)
        alert('Regulation updated successfully!')
        router.push('/dashboard/regops')
    }

    const handleDelete = () => {
        // TODO: API call to delete regulation
        console.log('Deleting regulation:', id)
        alert('Regulation deleted successfully!')
        router.push('/dashboard/regops')
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className="min-h-screen bg-[#0a0e1a] flex">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <TopNav />

                <main className="flex-1 overflow-y-auto p-6">
                    {/* Header */}
                    <div className="mb-8">
                        <Link href="/dashboard/regops" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-4 transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Regulations
                        </Link>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
                                    <FileText className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-white">Edit Regulation</h1>
                                    <p className="text-gray-400">Update regulation details</p>
                                </div>
                            </div>
                            <Button
                                onClick={() => setShowDeleteModal(true)}
                                variant="outline"
                                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-8 backdrop-blur-sm mb-6">
                            {/* Basic Information */}
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                                    Basic Information
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Regulation Name */}
                                    <div className="md:col-span-2">
                                        <Label htmlFor="name">Regulation Name *</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="e.g., GDPR Article 32"
                                            required
                                        />
                                    </div>

                                    {/* Framework */}
                                    <div>
                                        <Label htmlFor="framework">Framework *</Label>
                                        <select
                                            id="framework"
                                            name="framework"
                                            value={formData.framework}
                                            onChange={handleChange}
                                            required
                                            className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-900/80 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 focus:border-cyan-500 transition-all"
                                        >
                                            <option value="">Select a framework</option>
                                            {frameworks.map((framework) => (
                                                <option key={framework} value={framework}>{framework}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <Label htmlFor="category">Category *</Label>
                                        <select
                                            id="category"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            required
                                            className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-900/80 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 focus:border-cyan-500 transition-all"
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map((category) => (
                                                <option key={category} value={category}>{category}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <Label htmlFor="status">Status</Label>
                                        <select
                                            id="status"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-900/80 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 focus:border-cyan-500 transition-all"
                                        >
                                            {statuses.map((status) => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Effective Date */}
                                    <div>
                                        <Label htmlFor="effectiveDate">Effective Date</Label>
                                        <Input
                                            id="effectiveDate"
                                            name="effectiveDate"
                                            type="date"
                                            value={formData.effectiveDate}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* Review Date */}
                                    <div className="md:col-span-2">
                                        <Label htmlFor="reviewDate">Review Date</Label>
                                        <Input
                                            id="reviewDate"
                                            name="reviewDate"
                                            type="date"
                                            value={formData.reviewDate}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Description & Requirements */}
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                                    Details
                                </h2>

                                <div className="space-y-6">
                                    {/* Description */}
                                    <div>
                                        <Label htmlFor="description">Description</Label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows={4}
                                            placeholder="Provide a brief description of the regulation..."
                                            className="w-full px-3 py-2 bg-gray-900/80 border border-gray-700 text-gray-100 placeholder:text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 focus:border-cyan-500 transition-all"
                                        />
                                    </div>

                                    {/* Compliance Requirements */}
                                    <div>
                                        <Label htmlFor="requirements">Compliance Requirements</Label>
                                        <textarea
                                            id="requirements"
                                            name="requirements"
                                            value={formData.requirements}
                                            onChange={handleChange}
                                            rows={6}
                                            placeholder="List the compliance requirements and controls needed..."
                                            className="w-full px-3 py-2 bg-gray-900/80 border border-gray-700 text-gray-100 placeholder:text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 focus:border-cyan-500 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 justify-end">
                            <Link href="/dashboard/regops">
                                <Button type="button" variant="outline" className="border-cyan-500/30 text-gray-300">
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/30"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </main>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900/95 border border-red-500/30 rounded-xl p-6 max-w-md w-full shadow-2xl shadow-red-500/20">
                        <div className="mb-4">
                            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                                <Trash2 className="h-6 w-6 text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Delete Regulation</h3>
                            <p className="text-gray-400">
                                Are you sure you want to delete "{formData.name}"? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                onClick={() => setShowDeleteModal(false)}
                                variant="outline"
                                className="flex-1 border-gray-700"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleDelete}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
