'use client'

import { Shield, Lock, Database, CheckCircle, AlertTriangle, FileCheck } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function SecurityPage() {
    return (
        <div className="min-h-screen bg-[#0a0e1a]">
            <Navbar />

            {/* Hero */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 z-10"></div>
                    <img
                        src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&h=600&fit=crop"
                        alt="Security"
                        className="w-full h-full object-cover opacity-20"
                    />
                </div>
                <div className="max-w-4xl mx-auto text-center relative z-20">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full mb-6 shadow-lg shadow-cyan-500/50">
                        <Shield className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                        Enterprise-Grade <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Security</span>
                    </h1>
                    <p className="text-xl text-gray-300">
                        Your data security is our top priority
                    </p>
                </div>
            </section>

            {/* Certifications */}
            <section className="py-20 bg-[#0a0e1a]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center text-white mb-16">Security Certifications</h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { title: 'SOC 2 Type II', desc: 'Audited security controls' },
                            { title: 'ISO 27001', desc: 'Information security certified' },
                            { title: 'GDPR', desc: 'EU data protection compliant' },
                            { title: 'HIPAA', desc: 'Healthcare data protection' }
                        ].map((cert, idx) => (
                            <div key={idx} className="text-center p-6 bg-gray-900/50 border border-cyan-500/20 rounded-xl hover:border-cyan-500/50 hover:scale-105 transition-all">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full mb-4">
                                    <FileCheck className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">{cert.title}</h3>
                                <p className="text-gray-400">{cert.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Security Features */}
            <section className="py-20 bg-gradient-to-b from-[#0a0e1a] to-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center text-white mb-16">Security Features</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Lock,
                                title: 'End-to-End Encryption',
                                desc: 'AES-256 encryption for data at rest and TLS 1.3 for data in transit',
                                color: 'from-cyan-500 to-blue-500'
                            },
                            {
                                icon: Database,
                                title: 'Secure Infrastructure',
                                desc: 'Hosted on enterprise-grade data centers with 24/7 monitoring',
                                color: 'from-blue-500 to-purple-500'
                            },
                            {
                                icon: Shield,
                                title: 'DDoS Protection',
                                desc: 'Advanced protection against distributed denial-of-service attacks',
                                color: 'from-purple-500 to-pink-500'
                            },
                            {
                                icon: CheckCircle,
                                title: 'Regular Audits',
                                desc: 'Third-party security audits and penetration testing',
                                color: 'from-pink-500 to-red-500'
                            },
                            {
                                icon: AlertTriangle,
                                title: 'Threat Detection',
                                desc: 'Real-time monitoring and automated threat response',
                                color: 'from-red-500 to-orange-500'
                            },
                            {
                                icon: FileCheck,
                                title: 'Compliance',
                                desc: 'Built-in compliance with major regulatory frameworks',
                                color: 'from-orange-500 to-yellow-500'
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="group bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6 backdrop-blur-sm hover:border-cyan-500/50 transition-all">
                                <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg mb-4 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-400">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Data Protection */}
            <section className="py-20 bg-[#0a0e1a]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-white mb-6">Data Protection</h2>
                            <div className="space-y-4">
                                {[
                                    { title: 'Multi-Tenant Isolation', desc: 'Complete data segregation between tenants' },
                                    { title: 'Backup & Recovery', desc: 'Automated daily backups with point-in-time recovery' },
                                    { title: 'Access Control', desc: 'Role-based access control with MFA support' },
                                    { title: 'Audit Logs', desc: 'Comprehensive logging of all system activities' }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-4 bg-gray-900/50 border border-cyan-500/20 rounded-lg hover:border-cyan-500/50 transition-all">
                                        <CheckCircle className="h-6 w-6 text-cyan-400 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                                            <p className="text-gray-400">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative h-96 rounded-2xl overflow-hidden border border-cyan-500/20">
                            <img
                                src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop"
                                alt="Security monitoring"
                                className="w-full h-full object-cover opacity-50"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] to-transparent"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-r from-cyan-600 to-blue-700">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-white mb-4">Our Security Commitment</h2>
                    <p className="text-xl text-blue-100 mb-8">
                        We invest heavily in security and compliance to protect your data
                    </p>
                    <Link href="/contact" className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105">
                        Contact Security Team
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    )
}
