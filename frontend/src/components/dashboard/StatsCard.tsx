'use client'

import { LucideIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

interface StatsCardProps {
    title: string
    value: number | string
    icon: LucideIcon
    trend?: {
        value: number
        isPositive: boolean
    }
    color?: 'cyan' | 'blue' | 'purple' | 'green'
}

export default function StatsCard({ title, value, icon: Icon, trend, color = 'cyan' }: StatsCardProps) {
    const [displayValue, setDisplayValue] = useState(0)

    const colorMap = {
        cyan: 'from-cyan-500 to-blue-600',
        blue: 'from-blue-500 to-indigo-600',
        purple: 'from-purple-500 to-pink-600',
        green: 'from-green-500 to-emerald-600'
    }

    useEffect(() => {
        if (typeof value === 'number') {
            const duration = 1500
            const steps = 60
            const increment = value / steps
            let current = 0

            const timer = setInterval(() => {
                current += increment
                if (current >= value) {
                    setDisplayValue(value)
                    clearInterval(timer)
                } else {
                    setDisplayValue(Math.floor(current))
                }
            }, duration / steps)

            return () => clearInterval(timer)
        }
    }, [value])

    return (
        <div className="group bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6 backdrop-blur-sm hover:border-cyan-500/50 transition-all hover:scale-105">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-sm text-gray-400 mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-white">
                        {typeof value === 'number' ? displayValue : value}
                    </h3>
                </div>
                <div className={`p-3 bg-gradient-to-br ${colorMap[color]} rounded-lg shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
            </div>

            {trend && (
                <div className="flex items-center gap-1">
                    <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                    </span>
                    <span className="text-xs text-gray-500">vs last month</span>
                </div>
            )}
        </div>
    )
}
