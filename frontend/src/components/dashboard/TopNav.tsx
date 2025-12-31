'use client'

import { Bell, Settings, LogOut, User, ChevronDown } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function TopNav() {
    const { user, logout } = useAuth()
    const router = useRouter()
    const [dropdownOpen, setDropdownOpen] = useState(false)

    const handleLogout = () => {
        logout()
        router.push('/auth')
    }

    return (
        <nav className="bg-[#0a0e1a]/95 backdrop-blur-md border-b border-cyan-500/20 px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Left: Page Title */}
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <p className="text-sm text-gray-400">Welcome back, {user?.firstName}!</p>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-4">
                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* Notifications */}
                    <button className="relative p-2 hover:bg-cyan-500/10 rounded-lg transition-colors">
                        <Bell className="h-5 w-5 text-gray-400 hover:text-cyan-400 transition-colors" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* Settings */}
                    <button className="p-2 hover:bg-cyan-500/10 rounded-lg transition-colors">
                        <Settings className="h-5 w-5 text-gray-400 hover:text-cyan-400 transition-colors" />
                    </button>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-cyan-500/10 rounded-lg transition-colors"
                        >
                            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-white" />
                            </div>
                            <div className="text-left hidden md:block">
                                <div className="text-sm font-medium text-white">{user?.firstName} {user?.lastName}</div>
                                <div className="text-xs text-gray-400">{user?.email}</div>
                            </div>
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                        </button>

                        {/* Dropdown */}
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-md border border-cyan-500/20 rounded-lg shadow-xl shadow-cyan-500/10 overflow-hidden z-50">
                                <div className="p-2">
                                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-cyan-500/10 rounded-lg transition-colors">
                                        <User className="h-4 w-4" />
                                        Profile
                                    </button>
                                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-cyan-500/10 rounded-lg transition-colors">
                                        <Settings className="h-4 w-4" />
                                        Settings
                                    </button>
                                    <hr className="my-2 border-cyan-500/20" />
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
