export default function DashboardLoading() {
    return (
        <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-cyan-500 animate-spin"></div>
                    <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-purple-500 animate-spin reverse"></div>
                </div>
                <p className="text-cyan-400/80 font-mono text-sm animate-pulse">Loading GRC Platform...</p>
            </div>
        </div>
    )
}
