'use client'

import { Shield, Users, Target, Award, ArrowRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#0a0e1a]">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 z-10"></div>
                    <img
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=600&fit=crop"
                        alt="Team"
                        className="w-full h-full object-cover opacity-20"
                    />
                </div>
                <div className="max-w-4xl mx-auto text-center relative z-20">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                        About <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">KOMPL.AI</span>
                    </h1>
                    <p className="text-xl text-gray-300">
                        Transforming how organizations approach governance, risk, and compliance through AI
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 bg-[#0a0e1a]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-white mb-6">Our Mission</h2>
                            <p className="text-lg text-gray-300 mb-6">
                                At KOMPL.AI, we believe compliance shouldn't be a burden. Our mission is to empower organizations with AI-powered tools that make governance, risk, and compliance simple, efficient, and intelligent.
                            </p>
                            <p className="text-lg text-gray-300">
                                Founded in 2023, we've helped over 500 enterprises reduce compliance costs by 70% while improving accuracy and reducing risks.
                            </p>
                        </div>
                        <div className="relative h-96 rounded-2xl overflow-hidden border border-cyan-500/20">
                            <img
                                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop"
                                alt="Team meeting"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] to-transparent"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 bg-gradient-to-b from-[#0a0e1a] to-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center text-white mb-16">Our Values</h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { icon: Shield, title: 'Security First', description: 'Enterprise-grade security in everything we build' },
                            { icon: Users, title: 'Customer Success', description: 'Your success is our success' },
                            { icon: Target, title: 'Innovation', description: 'Constantly pushing boundaries with AI' },
                            { icon: Award, title: 'Excellence', description: 'Committed to the highest standards' }
                        ].map((value, idx) => (
                            <div key={idx} className="text-center p-6 bg-gray-900/50 border border-cyan-500/20 rounded-xl backdrop-blur-sm hover:border-cyan-500/50 transition-all">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full mb-4">
                                    <value.icon className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
                                <p className="text-gray-400">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-r from-cyan-600 to-blue-700">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-white mb-4">Join Us on Our Mission</h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Ready to transform your compliance operations?
                    </p>
                    <Link href="/auth" className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105">
                        Get Started Today
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    )
}
