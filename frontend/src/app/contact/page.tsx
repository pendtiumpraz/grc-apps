'use client'

import { useState } from 'react'
import { Mail, MapPin, Phone, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        message: ''
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        alert('Thank you! We will get back to you soon.')
        setFormData({ name: '', email: '', company: '', message: '' })
    }

    return (
        <div className="min-h-screen bg-[#0a0e1a]">
            <Navbar />

            {/* Hero */}
            <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0a0e1a] to-gray-900">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Get in Touch</h1>
                    <p className="text-xl text-gray-300">
                        Have questions? Send us a message and we'll respond as soon as possible.
                    </p>
                </div>
            </section>

            {/* Contact Content */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0a0e1a]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Contact Info */}
                        <div className="lg:col-span-1 space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
                                <div className="space-y-6">
                                    {[
                                        { icon: Mail, title: 'Email', info: 'support@kompl.ai' },
                                        { icon: Phone, title: 'Phone', info: '+1 (555) 123-4567' },
                                        { icon: MapPin, title: 'Office', info: '123 Compliance Street\nSan Francisco, CA 94102' }
                                    ].map((contact, idx) => (
                                        <div key={idx} className="flex items-start gap-4 p-4 bg-gray-900/50 border border-cyan-500/20 rounded-lg hover:border-cyan-500/50 transition-all">
                                            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <contact.icon className="h-6 w-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-white mb-1">{contact.title}</h3>
                                                <p className="text-gray-400 whitespace-pre-line">{contact.info}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative h-64 rounded-xl overflow-hidden border border-cyan-500/20">
                                <img
                                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop"
                                    alt="Office"
                                    className="w-full h-full object-cover opacity-50"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] to-transparent"></div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-8 backdrop-blur-sm">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-gray-300">Full Name *</Label>
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                                placeholder="John Doe"
                                                className="bg-gray-800/50 border-cyan-500/30 text-white placeholder:text-gray-500 focus:border-cyan-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-gray-300">Email *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                required
                                                placeholder="john@company.com"
                                                className="bg-gray-800/50 border-cyan-500/30 text-white placeholder:text-gray-500 focus:border-cyan-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="company" className="text-gray-300">Company</Label>
                                        <Input
                                            id="company"
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                            placeholder="Your Company"
                                            className="bg-gray-800/50 border-cyan-500/30 text-white placeholder:text-gray-500 focus:border-cyan-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="message" className="text-gray-300">Message *</Label>
                                        <textarea
                                            id="message"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            required
                                            rows={6}
                                            className="w-full px-3 py-2 bg-gray-800/50 border border-cyan-500/30 text-white placeholder:text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                            placeholder="How can we help you?"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                                    >
                                        <Send className="mr-2 h-4 w-4" />
                                        Send Message
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
