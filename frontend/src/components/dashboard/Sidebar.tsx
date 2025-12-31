'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Shield, Lock, TrendingUp, FileCheck, ChevronLeft, ChevronRight, Building2, Sparkles, FileText, Database, BarChart3, Settings, AlertTriangle, Search, FileCode, Activity, Users } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { LucideIcon } from 'lucide-react'

interface MenuItem {
    icon: LucideIcon
    label: string
    href: string
    subItems?: { label: string; href: string }[]
}

// Menu items for Super Admin
const superAdminMenuItems: MenuItem[] = [
    { icon: Building2, label: 'Platform', href: '/dashboard/platform' },
    { icon: Users, label: 'Tenants', href: '/dashboard/platform/tenants' },
    { icon: BarChart3, label: 'Analytics', href: '/dashboard/platform/analytics' },
    { icon: Database, label: 'Billing', href: '/dashboard/platform/billing' },
    { icon: Settings, label: 'Logs', href: '/dashboard/platform/logs' },
]

// Menu items for Tenant Admin
const tenantAdminMenuItems: MenuItem[] = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: FileText, label: 'Documents', href: '/dashboard/documents', subItems: [
        { label: 'All Documents', href: '/dashboard/documents' },
        { label: 'AI Generator', href: '/dashboard/documents/generator' },
        { label: 'AI Analyzer', href: '/dashboard/documents/analyzer' },
    ]},
    { icon: Users, label: 'Users', href: '/dashboard/platform/tenants' },
    { icon: Shield, label: 'RegOps', href: '/dashboard/regops', subItems: [
        { label: 'Regulations', href: '/dashboard/regops' },
        { label: 'Obligation Mapping', href: '/dashboard/regops/obligations' },
        { label: 'Gap Analysis', href: '/dashboard/regops/gap-analysis' },
        { label: 'Controls', href: '/dashboard/regops/controls' },
        { label: 'Policies', href: '/dashboard/regops/policies' },
        { label: 'Monitoring', href: '/dashboard/regops/monitoring' },
    ]},
    { icon: Lock, label: 'PrivacyOps', href: '/dashboard/privacyops', subItems: [
        { label: 'Overview', href: '/dashboard/privacyops' },
        { label: 'Data Inventory', href: '/dashboard/privacyops/data-inventory' },
        { label: 'RoPA', href: '/dashboard/privacyops/ropa' },
        { label: 'DPIA', href: '/dashboard/privacyops/dpia' },
        { label: 'DSR', href: '/dashboard/privacyops/dsr' },
        { label: 'Controls', href: '/dashboard/privacyops/controls' },
        { label: 'Incidents', href: '/dashboard/privacyops/incidents' },
        { label: 'Monitoring', href: '/dashboard/privacyops/monitoring' },
    ]},
    { icon: TrendingUp, label: 'RiskOps', href: '/dashboard/riskops', subItems: [
        { label: 'Overview', href: '/dashboard/riskops' },
        { label: 'Risk Register', href: '/dashboard/riskops' },
        { label: 'Vulnerabilities', href: '/dashboard/riskops/vulnerabilities' },
        { label: 'Vendors', href: '/dashboard/riskops/vendors' },
        { label: 'Continuity', href: '/dashboard/riskops/continuity' },
        { label: 'Monitoring', href: '/dashboard/riskops/monitoring' },
    ]},
    { icon: FileCheck, label: 'AuditOps', href: '/dashboard/auditops', subItems: [
        { label: 'Overview', href: '/dashboard/auditops' },
        { label: 'Internal Audits', href: '/dashboard/auditops/internal-audits' },
        { label: 'Governance (KRI)', href: '/dashboard/auditops/governance' },
        { label: 'Continuous Audit', href: '/dashboard/auditops/continuous-audit' },
        { label: 'Evidence', href: '/dashboard/auditops/evidence' },
        { label: 'Reports', href: '/dashboard/auditops/reports' },
    ]},
    { icon: Sparkles, label: 'AI Settings', href: '/dashboard/settings/ai' },
]

// Menu items for Regular User/Auditor
const regularUserMenuItems: MenuItem[] = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: FileText, label: 'Documents', href: '/dashboard/documents', subItems: [
        { label: 'All Documents', href: '/dashboard/documents' },
        { label: 'AI Generator', href: '/dashboard/documents/generator' },
        { label: 'AI Analyzer', href: '/dashboard/documents/analyzer' },
    ]},
    { icon: Shield, label: 'RegOps', href: '/dashboard/regops', subItems: [
        { label: 'Regulations', href: '/dashboard/regops' },
        { label: 'Obligation Mapping', href: '/dashboard/regops/obligations' },
        { label: 'Gap Analysis', href: '/dashboard/regops/gap-analysis' },
        { label: 'Controls', href: '/dashboard/regops/controls' },
        { label: 'Policies', href: '/dashboard/regops/policies' },
        { label: 'Monitoring', href: '/dashboard/regops/monitoring' },
    ]},
    { icon: Lock, label: 'PrivacyOps', href: '/dashboard/privacyops', subItems: [
        { label: 'Overview', href: '/dashboard/privacyops' },
        { label: 'Data Inventory', href: '/dashboard/privacyops/data-inventory' },
        { label: 'RoPA', href: '/dashboard/privacyops/ropa' },
        { label: 'DPIA', href: '/dashboard/privacyops/dpia' },
        { label: 'DSR', href: '/dashboard/privacyops/dsr' },
        { label: 'Controls', href: '/dashboard/privacyops/controls' },
        { label: 'Incidents', href: '/dashboard/privacyops/incidents' },
        { label: 'Monitoring', href: '/dashboard/privacyops/monitoring' },
    ]},
    { icon: TrendingUp, label: 'RiskOps', href: '/dashboard/riskops', subItems: [
        { label: 'Overview', href: '/dashboard/riskops' },
        { label: 'Risk Register', href: '/dashboard/riskops' },
        { label: 'Vulnerabilities', href: '/dashboard/riskops/vulnerabilities' },
        { label: 'Vendors', href: '/dashboard/riskops/vendors' },
        { label: 'Continuity', href: '/dashboard/riskops/continuity' },
        { label: 'Monitoring', href: '/dashboard/riskops/monitoring' },
    ]},
    { icon: FileCheck, label: 'AuditOps', href: '/dashboard/auditops', subItems: [
        { label: 'Overview', href: '/dashboard/auditops' },
        { label: 'Internal Audits', href: '/dashboard/auditops/internal-audits' },
        { label: 'Governance (KRI)', href: '/dashboard/auditops/governance' },
        { label: 'Continuous Audit', href: '/dashboard/auditops/continuous-audit' },
        { label: 'Evidence', href: '/dashboard/auditops/evidence' },
        { label: 'Monitoring', href: '/dashboard/auditops/monitoring' },
        { label: 'Reports', href: '/dashboard/auditops/reports' },
    ]},
]

export default function Sidebar() {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)
    const [expandedItems, setExpandedItems] = useState<string[]>([])
    const { user } = useAuth()

    // Get menu items based on user role
    const getMenuItems = (): MenuItem[] => {
        if (!user) return regularUserMenuItems
        
        const role = user.role.toLowerCase()
        
        if (role === 'superadmin') {
            return superAdminMenuItems
        } else if (role === 'admin') {
            return tenantAdminMenuItems
        } else {
            return regularUserMenuItems
        }
    }

    const menuItems = getMenuItems()

    const toggleExpand = (label: string) => {
        setExpandedItems(prev => 
            prev.includes(label) 
                ? prev.filter(item => item !== label)
                : [...prev, label]
        )
    }

    return (
        <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-[#0a0e1a] border-r border-cyan-500/20 transition-all duration-300 flex flex-col`}>
            {/* Logo */}
            <div className="p-6 border-b border-cyan-500/20">
                <div className="flex items-center justify-between">
                    {!collapsed && (
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/50">
                                <Shield className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                KOMPL.AI
                            </span>
                        </Link>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-2 hover:bg-cyan-500/10 rounded-lg transition-colors"
                    >
                        {collapsed ? (
                            <ChevronRight className="h-5 w-5 text-cyan-400" />
                        ) : (
                            <ChevronLeft className="h-5 w-5 text-cyan-400" />
                        )}
                    </button>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                    const isExpanded = expandedItems.includes(item.label)
                    const hasSubItems = item.subItems && item.subItems.length > 0

                    return (
                        <div key={item.href}>
                            <button
                                onClick={() => hasSubItems ? toggleExpand(item.label) : null}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                                    isActive
                                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                                        : 'hover:bg-cyan-500/10 border border-transparent'
                                }`}
                            >
                                <Icon className={`h-5 w-5 ${isActive ? 'text-cyan-400' : 'text-gray-400 group-hover:text-cyan-400'} transition-colors`} />
                                {!collapsed && (
                                    <>
                                        <span className={`font-medium ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'} transition-colors flex-1 text-left`}>
                                            {item.label}
                                        </span>
                                        {hasSubItems && (
                                            <ChevronRight 
                                                className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                                            />
                                        )}
                                        {isActive && !hasSubItems && (
                                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                                        )}
                                    </>
                                )}
                            </button>
                            
                            {/* Sub Items */}
                            {!collapsed && hasSubItems && isExpanded && (
                                <div className="ml-4 mt-1 space-y-1">
                                    {item.subItems!.map((subItem) => {
                                        const isSubActive = pathname === subItem.href
                                        return (
                                            <Link
                                                key={subItem.href}
                                                href={subItem.href}
                                                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all group ${
                                                    isSubActive
                                                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/50'
                                                        : 'hover:bg-cyan-500/10 border border-transparent'
                                                }`}
                                            >
                                                <div className={`w-2 h-2 rounded-full ${isSubActive ? 'bg-cyan-400' : 'bg-gray-600'}`} />
                                                <span className={`text-sm ${isSubActive ? 'text-white' : 'text-gray-400 group-hover:text-white'} transition-colors`}>
                                                    {subItem.label}
                                                </span>
                                            </Link>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-cyan-500/20">
                <div className={`flex items-center gap-2 ${collapsed ? 'justify-center' : ''}`}>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 200}ms` }}></div>
                    ))}
                </div>
            </div>
        </aside>
    )
}
