'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Dashboard Error:', error)
    }, [error])

    return (
        <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center p-4">
            <Card className="max-w-md w-full bg-gray-900 border-red-500/30 p-8 text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>

                <h2 className="text-xl font-bold text-white mb-2">Something went wrong!</h2>
                <p className="text-gray-400 mb-6">
                    {error.message || "An unexpected error occurred while loading the dashboard."}
                </p>

                <div className="flex gap-3 justify-center">
                    <Button
                        onClick={() => reset()}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try again
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => window.location.href = '/dashboard'}
                        className="border-gray-700 text-gray-300 hover:text-white"
                    >
                        Go to Dashboard
                    </Button>
                </div>

                {error.digest && (
                    <p className="text-xs text-gray-600 mt-6 font-mono">
                        Error ID: {error.digest}
                    </p>
                )}
            </Card>
        </div>
    )
}
