'use client'

import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-[#0a0e1a] border-t border-cyan-500/20 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
                            KOMPL.AI
                        </div>
                        <p className="text-sm text-gray-400">
                            AI-Powered Governance, Risk, and Compliance Platform for modern enterprises.
                        </p>
                        <div className="mt-4 flex gap-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 200}ms` }}></div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-cyan-400 mb-4">Product</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/#features" className="text-gray-400 hover:text-cyan-400 transition-colors">Features</Link></li>
                            <li><Link href="/#pricing" className="text-gray-400 hover:text-cyan-400 transition-colors">Pricing</Link></li>
                            <li><Link href="/contact" className="text-gray-400 hover:text-cyan-400 transition-colors">Integrations</Link></li>
                            <li><Link href="/contact" className="text-gray-400 hover:text-cyan-400 transition-colors">API</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-cyan-400 mb-4">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/about" className="text-gray-400 hover:text-cyan-400 transition-colors">About</Link></li>
                            <li><Link href="/contact" className="text-gray-400 hover:text-cyan-400 transition-colors">Blog</Link></li>
                            <li><Link href="/contact" className="text-gray-400 hover:text-cyan-400 transition-colors">Careers</Link></li>
                            <li><Link href="/contact" className="text-gray-400 hover:text-cyan-400 transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-cyan-400 mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/privacy" className="text-gray-400 hover:text-cyan-400 transition-colors">Privacy</Link></li>
                            <li><Link href="/terms" className="text-gray-400 hover:text-cyan-400 transition-colors">Terms</Link></li>
                            <li><Link href="/security" className="text-gray-400 hover:text-cyan-400 transition-colors">Security</Link></li>
                            <li><Link href="/privacy" className="text-gray-400 hover:text-cyan-400 transition-colors">Compliance</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-cyan-500/20 pt-8 text-center text-sm text-gray-500">
                    <p>© 2024 KOMPL.AI. All rights reserved. <span className="text-cyan-400">Secured by AI</span></p>
                </div>
            </div>
        </footer>
    )
}
