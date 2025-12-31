'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#0a0e1a]">
            <Navbar />

            {/* Hero */}
            <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0a0e1a] to-gray-900">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl font-bold text-white mb-4">
                        Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Service</span>
                    </h1>
                    <p className="text-lg text-gray-400">Last updated: December 2024</p>
                </div>
            </section>

            {/* Content */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#0a0e1a]">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="p-6 bg-gray-900/50 border border-cyan-500/20 rounded-xl">
                        <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
                        <p className="text-gray-300">
                            By accessing and using KOMPL.AI, you agree to be bound by these Terms of Service and all applicable laws and regulations.
                        </p>
                    </div>

                    <div className="p-6 bg-gray-900/50 border border-cyan-500/20 rounded-xl">
                        <h2 className="text-2xl font-bold text-white mb-4">2. Use of Service</h2>
                        <h3 className="text-xl font-semibold text-cyan-400 mt-4 mb-2">Permitted Use</h3>
                        <p className="text-gray-300 mb-3">You may use our service for:</p>
                        <ul className="space-y-2 text-gray-300">
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-1">•</span>
                                <span>Compliance management and tracking</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-1">•</span>
                                <span>Risk assessment and mitigation</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-1">•</span>
                                <span>Audit planning and execution</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-1">•</span>
                                <span>Data privacy management</span>
                            </li>
                        </ul>

                        <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-2">Prohibited Use</h3>
                        <p className="text-gray-300 mb-3">You may not:</p>
                        <ul className="space-y-2 text-gray-300">
                            <li className="flex items-start gap-2">
                                <span className="text-red-400 mt-1">•</span>
                                <span>Violate any laws or regulations</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-400 mt-1">•</span>
                                <span>Infringe on intellectual property rights</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-400 mt-1">•</span>
                                <span>Transmit malicious code or harmful content</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-400 mt-1">•</span>
                                <span>Attempt to gain unauthorized access</span>
                            </li>
                        </ul>
                    </div>

                    <div className="p-6 bg-gray-900/50 border border-cyan-500/20 rounded-xl">
                        <h2 className="text-2xl font-bold text-white mb-4">3. Account Responsibilities</h2>
                        <p className="text-gray-300 mb-3">You are responsible for:</p>
                        <ul className="space-y-2 text-gray-300">
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-1">•</span>
                                <span>Maintaining the confidentiality of your account credentials</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-1">•</span>
                                <span>All activities that occur under your account</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-1">•</span>
                                <span>Notifying us immediately of any unauthorized use</span>
                            </li>
                        </ul>
                    </div>

                    <div className="p-6 bg-gray-900/50 border border-cyan-500/20 rounded-xl">
                        <h2 className="text-2xl font-bold text-white mb-4">4. Subscription and Payment</h2>
                        <p className="text-gray-300 mb-3">Our service is provided on a subscription basis:</p>
                        <ul className="space-y-2 text-gray-300">
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-1">•</span>
                                <span>Subscriptions are billed in advance</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-1">•</span>
                                <span>Automatic renewal unless cancelled</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-1">•</span>
                                <span>30 days notice for price changes</span>
                            </li>
                        </ul>
                    </div>

                    <div className="p-6 bg-gray-900/50 border border-cyan-500/20 rounded-xl">
                        <h2 className="text-2xl font-bold text-white mb-4">5. Intellectual Property</h2>
                        <p className="text-gray-300">
                            All content, features, and functionality of KOMPL.AI are owned by us and protected by copyright, trademark, and other intellectual property laws.
                        </p>
                    </div>

                    <div className="p-6 bg-gray-900/50 border border-cyan-500/20 rounded-xl">
                        <h2 className="text-2xl font-bold text-white mb-4">6. Data Ownership</h2>
                        <p className="text-gray-300">
                            You retain all rights to your data. We will not use your data except as necessary to provide the service or as required by law.
                        </p>
                    </div>

                    <div className="p-6 bg-gray-900/50 border border-cyan-500/20 rounded-xl">
                        <h2 className="text-2xl font-bold text-white mb-4">7. Contact Information</h2>
                        <p className="text-gray-300 mb-3">For questions about these Terms, contact us at:</p>
                        <ul className="space-y-2 text-gray-300">
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-1">•</span>
                                <span>Email: legal@kompl.ai</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-1">•</span>
                                <span>Address: 123 Compliance Street, San Francisco, CA 94102</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
