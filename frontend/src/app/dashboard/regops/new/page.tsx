'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import AIAssistant from '@/components/dashboard/AIAssistant'
import { ArrowLeft, Save, FileText, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function NewRegulationPage() {
    const router = useRouter()
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

    const frameworks = ['GDPR', 'SOX', 'HIPAA', 'ISO 27001', 'PCI DSS', 'NIST', 'Other']
    const categories = ['Data Protection', 'Financial Compliance', 'Security', 'Privacy', 'Operational', 'Other']
    const statuses = ['Draft', 'Active', 'Under Review', 'Archived']

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: API call to create regulation
        console.log('Creating regulation:', formData)
        alert('Regulation created successfully!')
        router.push('/dashboard/regops')
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    // Handle AI auto-fill
    const handleAutoFill = (data: any) => {
        setFormData(prev => ({
            ...prev,
            name: data.name || prev.name,
            description: data.description || prev.description,
            framework: data.framework || prev.framework,
            category: data.category || prev.category,
            requirements: data.requirements || prev.requirements,
        }))
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
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                                    <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
                                        <FileText className="h-6 w-6 text-white" />
                                    </div>
                                    Create New Regulation
                                </h1>
                                <p className="text-gray-400">Add a new regulation to your compliance framework</p>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-full">
                                <Sparkles className="h-4 w-4 text-purple-400" />
                                <span className="text-sm text-purple-300">AI Auto-fill Available</span>
                            </div>
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
                                Create Regulation
                            </Button>
                        </div>
                    </form>
                </main>

                {/* AI Assistant with auto-fill */}
                <AIAssistant
                    module="RegOps"
                    context={formData}
                    onAutoFill={handleAutoFill}
                    placeholder="Ask AI to help fill this form..."
                />
            </div>
        </div>
    )
}

