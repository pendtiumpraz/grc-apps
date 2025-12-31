'use client'

import { useState } from 'react'
import { Sparkles, Send, X, Loader2, Globe, Wand2, FileSearch } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { aiAPI } from '@/lib/api'

interface AIAssistantProps {
    context?: any
    onAutoFill?: (data: any) => void
    placeholder?: string
    module?: string // regops, riskops, privacyops, auditops
}

export default function AIAssistant({ context, onAutoFill, placeholder, module }: AIAssistantProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [conversation, setConversation] = useState<{ role: 'user' | 'assistant'; content: string }[]>([])
    const [activeFeature, setActiveFeature] = useState<string | null>(null)

    const handleSend = async (feature?: string) => {
        if (!message.trim() && !feature) return

        const userMessage = message || `Use ${feature} feature`
        setConversation(prev => [...prev, { role: 'user', content: userMessage }])
        setMessage('')
        setIsLoading(true)
        setActiveFeature(feature || null)

        try {
            const response = await aiAPI.chat(userMessage, context, feature || 'chat')

            if (response.success) {
                setConversation(prev => [...prev, {
                    role: 'assistant',
                    content: response.data?.message || response.message || 'Response received'
                }])

                // Handle auto-fill response
                if (feature === 'autofill' && response.data?.formData && onAutoFill) {
                    onAutoFill(response.data.formData)
                }
            } else {
                setConversation(prev => [...prev, {
                    role: 'assistant',
                    content: response.error || 'Sorry, something went wrong. Please check your AI settings.'
                }])
            }
        } catch (error) {
            setConversation(prev => [...prev, {
                role: 'assistant',
                content: 'Failed to connect to AI. Please check your settings.'
            }])
        } finally {
            setIsLoading(false)
            setActiveFeature(null)
        }
    }

    const quickActions = [
        { id: 'websearch', icon: Globe, label: 'Web Search', description: 'Search for latest info' },
        { id: 'autofill', icon: Wand2, label: 'Auto Fill', description: 'Fill form automatically' },
        { id: 'analyze', icon: FileSearch, label: 'Analyze', description: 'Analyze current data' },
    ]

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full shadow-lg shadow-purple-500/30 hover:scale-110 transition-transform z-50"
            >
                <Sparkles className="h-6 w-6 text-white" />
            </button>
        )
    }

    return (
        <div className="fixed bottom-6 right-6 w-96 bg-gray-900 border border-purple-500/30 rounded-xl shadow-2xl shadow-purple-500/20 z-50">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                        <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">AI Assistant</h3>
                        <p className="text-xs text-gray-400">{module ? `${module} Module` : 'Ready to help'}</p>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 p-3 border-b border-purple-500/20">
                {quickActions.map((action) => (
                    <button
                        key={action.id}
                        onClick={() => handleSend(action.id)}
                        disabled={isLoading}
                        className="flex-1 flex flex-col items-center gap-1 p-2 rounded-lg bg-gray-800/50 hover:bg-purple-500/20 transition-colors"
                    >
                        <action.icon className={`h-4 w-4 ${activeFeature === action.id ? 'text-purple-400 animate-pulse' : 'text-gray-400'}`} />
                        <span className="text-xs text-gray-300">{action.label}</span>
                    </button>
                ))}
            </div>

            {/* Conversation */}
            <div className="h-64 overflow-y-auto p-4 space-y-3">
                {conversation.length === 0 ? (
                    <div className="text-center text-gray-500 text-sm py-8">
                        <Sparkles className="h-8 w-8 mx-auto mb-2 text-purple-400/50" />
                        <p>Ask me anything about {module || 'GRC'}!</p>
                        <p className="text-xs mt-1">I can search the web, analyze data, and auto-fill forms.</p>
                    </div>
                ) : (
                    conversation.map((msg, i) => (
                        <div
                            key={i}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user'
                                        ? 'bg-purple-500/20 text-purple-100'
                                        : 'bg-gray-800 text-gray-200'
                                    }`}
                            >
                                <p className="text-sm">{msg.content}</p>
                            </div>
                        </div>
                    ))
                )}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-800 p-3 rounded-lg">
                            <Loader2 className="h-4 w-4 text-purple-400 animate-spin" />
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-purple-500/20">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={placeholder || 'Ask AI anything...'}
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                    />
                    <Button
                        onClick={() => handleSend()}
                        disabled={isLoading || !message.trim()}
                        className="bg-purple-500 hover:bg-purple-600"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
