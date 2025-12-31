'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function NewRiskPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        severity: 'Medium',
        likelihood: 'Medium',
        impact: '',
        mitigation: '',
        owner: '',
        status: 'Open',
        reviewDate: '',
    })

    const categories = ['Security', 'Operational', 'Financial', 'Regulatory', 'Strategic', 'Reputational']
    const severities = ['Critical', 'High', 'Medium', 'Low']
    const likelihoods = ['Very Likely', 'Likely', 'Possible', 'Unlikely', 'Rare']
    const statuses = ['Open', 'Mitigating', 'Monitoring', 'Closed']

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            // TODO: API integration
            console.log('Creating risk:', formData)
            alert('Risk created successfully!')
            router.push('/dashboard/riskops')
        } catch (err: any) {
            setError(err.message || 'Failed to create risk')
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
                        <Link href="/dashboard/riskops" className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 mb-4 transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Risks
                        </Link>
                        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                                <AlertTriangle className="h-6 w-6 text-white" />
                            </div>
                            Create New Risk
                        </h1>
                        <p className="text-gray-400">Add a new risk to your risk register</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="bg-gray-900/50 border border-orange-500/20 rounded-xl p-8 backdrop-blur-sm mb-6">
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                                    Risk Information
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <Label htmlFor="name">Risk Name *</Label>
                                        <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Data Breach Risk" required />
                                    </div>

                                    <div>
                                        <Label htmlFor="category">Category *</Label>
                                        <select id="category" name="category" value={formData.category} onChange={handleChange} required className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-900/80 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 focus:border-orange-500 transition-all">
                                            <option value="">Select category</option>
                                            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <Label htmlFor="severity">Severity *</Label>
                                        <select id="severity" name="severity" value={formData.severity} onChange={handleChange} required className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-900/80 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 focus:border-orange-500 transition-all">
                                            {severities.map((sev) => <option key={sev} value={sev}>{sev}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <Label htmlFor="likelihood">Likelihood *</Label>
                                        <select id="likelihood" name="likelihood" value={formData.likelihood} onChange={handleChange} required className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-900/80 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 focus:border-orange-500 transition-all">
                                            {likelihoods.map((lik) => <option key={lik} value={lik}>{lik}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <Label htmlFor="status">Status</Label>
                                        <select id="status" name="status" value={formData.status} onChange={handleChange} className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-900/80 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 focus:border-orange-500 transition-all">
                                            {statuses.map((st) => <option key={st} value={st}>{st}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <Label htmlFor="owner">Risk Owner</Label>
                                        <Input id="owner" name="owner" value={formData.owner} onChange={handleChange} placeholder="Person responsible" />
                                    </div>

                                    <div>
                                        <Label htmlFor="reviewDate">Review Date</Label>
                                        <Input id="reviewDate" name="reviewDate" type="date" value={formData.reviewDate} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                                    Details
                                </h2>

                                <div className="space-y-6">
                                    <div>
                                        <Label htmlFor="description">Description</Label>
                                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Describe the risk..." className="w-full px-3 py-2 bg-gray-900/80 border border-gray-700 text-gray-100 placeholder:text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 focus:border-orange-500 transition-all" />
                                    </div>

                                    <div>
                                        <Label htmlFor="impact">Potential Impact</Label>
                                        <textarea id="impact" name="impact" value={formData.impact} onChange={handleChange} rows={3} placeholder="What could happen if this risk materializes..." className="w-full px-3 py-2 bg-gray-900/80 border border-gray-700 text-gray-100 placeholder:text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 focus:border-orange-500 transition-all" />
                                    </div>

                                    <div>
                                        <Label htmlFor="mitigation">Mitigation Strategy</Label>
                                        <textarea id="mitigation" name="mitigation" value={formData.mitigation} onChange={handleChange} rows={4} placeholder="How to prevent or reduce this risk..." className="w-full px-3 py-2 bg-gray-900/80 border border-gray-700 text-gray-100 placeholder:text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 focus:border-orange-500 transition-all" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-end">
                            <Link href="/dashboard/riskops">
                                <Button type="button" variant="outline" className="border-orange-500/30 text-gray-300">Cancel</Button>
                            </Link>
                            <Button type="submit" disabled={loading} className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg shadow-orange-500/30">
                                <Save className="h-4 w-4 mr-2" />
                                {loading ? 'Creating...' : 'Create Risk'}
                            </Button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    )
}
