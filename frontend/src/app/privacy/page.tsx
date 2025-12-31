'use client'

import { Shield, Lock, Database, FileCheck } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#0a0e1a]">
            <Navbar />

            {/* Hero */}
            <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0a0e1a] to-gray-900">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl font-bold text-white mb-4">
                        Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Policy</span>
                    </h1>
                    <p className="text-lg text-gray-400">Last updated: December 2024</p>
                </div>
            </section>

            {/* Content */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#0a0e1a]">
                <div className="max-w-4xl mx-auto prose prose-invert prose-lg prose-cyan">
                    <div className="text-gray-300 space-y-8">
                        <div className="p-6 bg-gray-900/50 border border-cyan-500/20 rounded-xl">
                            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                            <p className="text-gray-300">
                                At KOMPL.AI, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                            </p>
                        </div>

                        <div className="p-6 bg-gray-900/50 border border-cyan-500/20 rounded-xl">
                            <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
                            <h3 className="text-xl font-semibold text-cyan-400 mt-4 mb-2">Personal Information</h3>
                            <p className="text-gray-300 mb-3">We collect information that you provide directly to us, including:</p>
                            <ul className="space-y-2 text-gray-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-400 mt-1">•</span>
                                    <span>Name and contact information</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-400 mt-1">•</span>
                                    <span>Company details</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-400 mt-1">•</span>
                                    <span>Account credentials</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-400 mt-1">•</span>
                                    <span>Payment information</span>
                                </li>
                            </ul>

                            <h3 className="text-xl font-semibold text-cyan-400 mt-6 mb-2">Usage Data</h3>
                            <p className="text-gray-300 mb-3">We automatically collect certain information about your device:</p>
                            <ul className="space-y-2 text-gray-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-400 mt-1">•</span>
                                    <span>Log data and usage patterns</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-400 mt-1">•</span>
                                    <span>Device information</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-400 mt-1">•</span>
                                    <span>Cookies and similar technologies</span>
                                </li>
                            </ul>
                        </div>

                        <div className="p-6 bg-gray-900/50 border border-cyan-500/20 rounded-xl">
                            <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
                            <p className="text-gray-300 mb-3">We use the collected information for:</p>
                            <ul className="space-y-2 text-gray-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-400 mt-1">•</span>
                                    <span>Providing and maintaining our services</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-400 mt-1">•</span>
                                    <span>Improving and personalizing user experience</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-400 mt-1">•</span>
                                    <span>Communicating with you about updates and offers</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-400 mt-1">•</span>
                                    <span>Ensuring security and preventing fraud</span>
                                </li>
                            </ul>
                        </div>

                        <div className="p-6 bg-gray-900/50 border border-cyan-500/20 rounded-xl">
                            <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
                            <p className="text-gray-300 mb-3">We implement industry-standard security measures:</p>
                            <ul className="space-y-2 text-gray-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-400 mt-1">•</span>
                                    <span>End-to-end encryption</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-400 mt-1">•</span>
                                    <span>Regular security audits</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-400 mt-1">•</span>
                                    <span>Access controls and authentication</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-400 mt-1">•</span>
                                    <span>Secure data centers with ISO 27001 certification</span>
                                </li>
                            </ul>
                        </div>

                        <div className="p-6 bg-gray-900/50 border border-cyan-500/20 rounded-xl">
                            <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights</h2>
                            <p className="text-gray-300 mb-3">You have the right to:</p>
                            <ul className="space-y-2 text-gray-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-400 mt-1">•</span>
                                    <span>Access your personal data</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-400 mt-1">•</span>
                                    <span>Correct inaccurate data</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-400 mt-1">•</span>
                                    <span>Request deletion of your data</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-400 mt-1">•</span>
                                    <span>Object to processing of your data</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-400 mt-1">•</span>
                                    <span>Data portability</span>
                                </li>
                            </ul>
                        </div>

                        <div className="p-6 bg-gray-900/50 border border-cyan-500/20 rounded-xl">
                            <h2 className="text-2xl font-bold text-white mb-4">6. Contact Us</h2>
                            <p className="text-gray-300 mb-3">If you have questions about this Privacy Policy, contact us at:</p>
                            <ul className="space-y-2 text-gray-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-400 mt-1">•</span>
                                    <span>Email: privacy@kompl.ai</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-400 mt-1">•</span>
                                    <span>Address: 123 Compliance Street, San Francisco, CA 94102</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="py-12 bg-gradient-to-b from-[#0a0e1a] to-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { icon: Shield, title: 'GDPR Compliant', desc: 'Full compliance with EU data protection' },
                            { icon: Lock, title: 'SOC 2 Certified', desc: 'Industry-leading security standards' },
                            { icon: Database, title: 'Data Encryption', desc: 'End-to-end encryption' },
                            { icon: FileCheck, title: 'ISO 27001', desc: 'Information security certified' }
                        ].map((item, idx) => (
                            <div key={idx} className="text-center p-6 bg-gray-900/50 border border-cyan-500/20 rounded-xl hover:border-cyan-500/50 transition-all">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full mb-4">
                                    <item.icon className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
