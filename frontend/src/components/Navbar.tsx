'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Shield } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { user } = useAuth()
    
    // Check if user is logged in
    const isLoggedIn = !!user

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0e1a]/95 backdrop-blur-md border-b border-cyan-500/20 shadow-lg shadow-cyan-500/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/50 group-hover:shadow-cyan-500/80 transition-all">
                            <Shield className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            KOMPL.AI
                        </span>
                    </Link>
 
                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8">
                        {['Features', 'Pricing', 'About', 'Contact'].map((item) => (
                            <Link
                                key={item}
                                href={item === 'Features' || item === 'Pricing' ? `/#${item.toLowerCase()}` : `/${item.toLowerCase()}`}
                                className="text-gray-300 hover:text-cyan-400 transition-colors relative group"
                            >
                                {item}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
                            </Link>
                        ))}
                    </div>
 
                    <div className="hidden md:flex items-center space-x-4">
                        {!isLoggedIn ? (
                            <Link
                                href="/dashboard"
                                className="text-gray-300 hover:text-cyan-400 transition-colors"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href="/auth"
                                className="text-gray-300 hover:text-cyan-400 transition-colors"
                            >
                                Login
                            </Link>
                        )}
                        {!isLoggedIn && (
                            <Link
                                href="/auth"
                                className="relative px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold overflow-hidden group"
                            >
                                <span className="relative z-10">Get Started</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute inset-0 shadow-lg shadow-cyan-500/50 group-hover:shadow-cyan-500/80 transition-all"></div>
                            </Link>
                        )}
                        {isLoggedIn && (
                            <Link
                                href="/dashboard"
                                className="text-gray-300 hover:text-cyan-400 transition-colors"
                            >
                                Dashboard
                            </Link>
                        )}
                    </div>
 
                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-cyan-400 hover:text-cyan-300"
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>
 
            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-[#111827]/98 backdrop-blur-md border-t border-cyan-500/20">
                    <div className="px-4 py-4 space-y-3">
                        {['Features', 'Pricing', 'About', 'Contact'].map((item) => (
                            <Link
                                key={item}
                                href={item === 'Features' || item === 'Pricing' ? `/#${item.toLowerCase()}` : `/${item.toLowerCase()}`}
                                className="block text-gray-300 hover:text-cyan-400 py-2"
                            >
                                {item}
                            </Link>
                        ))}
                        {!isLoggedIn ? (
                            <Link href="/dashboard" className="block text-cyan-400 font-semibold py-2">Dashboard</Link>
                        ) : (
                            <Link href="/auth" className="block text-cyan-400 font-semibold py-2">Get Started</Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
