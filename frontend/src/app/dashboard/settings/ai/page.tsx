'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNav from '@/components/dashboard/TopNav'
import { Settings, Sparkles, Key, Zap, Globe, Wand2, Save, TestTube, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { aiAPI } from '@/lib/api'

const GEMINI_MODELS = [
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', description: 'Fast and efficient' },
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: 'Latest flash model' },
    { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite', description: 'Lightweight version' },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: 'Most capable model' },
]

const OPENROUTER_MODELS = [
    { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus', description: 'Most capable Claude' },
    { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet', description: 'Balanced performance' },
    { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo', description: "OpenAI's best" },
    { id: 'meta-llama/llama-3-70b', name: 'Llama 3 70B', description: 'Open source large model' },
]

export default function AISettingsPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [provider, setProvider] = useState('gemini')
    const [modelName, setModelName] = useState('gemini-2.5-flash')
    const [customModel, setCustomModel] = useState('')
    const [geminiKey, setGeminiKey] = useState('')
    const [openRouterKey, setOpenRouterKey] = useState('')
    const [isEnabled, setIsEnabled] = useState(true)
    const [webSearchEnabled, setWebSearchEnabled] = useState(true)
    const [autoFillEnabled, setAutoFillEnabled] = useState(true)
    const [maxTokens, setMaxTokens] = useState(4096)
    const [temperature, setTemperature] = useState(0.7)
    const [isSaving, setIsSaving] = useState(false)
    const [isTesting, setIsTesting] = useState(false)
    const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
    const [saveStatus, setSaveStatus] = useState<string | null>(null)

    // Load existing settings on mount
    useEffect(() => {
        loadSettings()
    }, [])

    const loadSettings = async () => {
        try {
            const response = await aiAPI.getSettings()
            if (response && !response.error) {
                const settings = response.data || response
                setProvider(settings.provider || 'gemini')
                setModelName(settings.model_name || 'gemini-2.5-flash')
                setIsEnabled(settings.is_enabled !== false)
                setMaxTokens(settings.max_tokens || 4096)
                setTemperature(settings.temperature || 0.7)
                setWebSearchEnabled(settings.web_search_enabled !== false)
                setAutoFillEnabled(settings.auto_fill_enabled !== false)
                // Don't load API keys - they're masked
                if (settings.gemini_api_key && settings.gemini_api_key !== '') {
                    setGeminiKey('••••••••') // Show placeholder if key exists
                }
                if (settings.openrouter_api_key && settings.openrouter_api_key !== '') {
                    setOpenRouterKey('••••••••')
                }
            }
        } catch (error) {
            console.error('Failed to load AI settings:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        setSaveStatus(null)

        try {
            const settings = {
                provider,
                model_name: customModel || modelName,
                gemini_api_key: geminiKey.includes('••••') ? '' : geminiKey, // Don't send if unchanged
                openrouter_api_key: openRouterKey.includes('••••') ? '' : openRouterKey,
                is_enabled: isEnabled,
                max_tokens: maxTokens,
                temperature,
                web_search_enabled: webSearchEnabled,
                auto_fill_enabled: autoFillEnabled,
            }

            const response = await aiAPI.updateSettings(settings)

            if (response.error) {
                setSaveStatus('Failed to save: ' + response.error)
            } else {
                setSaveStatus('Settings saved successfully!')
                setTimeout(() => setSaveStatus(null), 3000)
            }
        } catch (error) {
            setSaveStatus('Failed to save settings')
        } finally {
            setIsSaving(false)
        }
    }

    const handleTestConnection = async () => {
        setIsTesting(true)
        setTestResult(null)

        try {
            const response = await aiAPI.testConnection()

            if (response.success) {
                setTestResult({ success: true, message: response.message || 'Connection successful!' })
            } else {
                setTestResult({ success: false, message: response.error || 'Connection failed' })
            }
        } catch (error) {
            setTestResult({ success: false, message: 'Connection failed - check API key' })
        } finally {
            setIsTesting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0e1a] flex">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <TopNav />
                    <main className="flex-1 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
                    </main>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0a0e1a] flex">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <TopNav />
                <main className="flex-1 overflow-y-auto p-6">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                                <Sparkles className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-white">AI Configuration</h1>
                        </div>
                        <p className="text-gray-400">Configure AI provider, model, and features for your organization</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Provider Selection */}
                        <div className="bg-gray-900/50 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <Zap className="h-5 w-5 text-purple-400" />
                                AI Provider
                            </h2>

                            <div className="space-y-4">
                                {/* Provider Toggle */}
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => {
                                            setProvider('gemini')
                                            setModelName('gemini-2.5-flash')
                                        }}
                                        className={`p-4 rounded-lg border-2 transition-all ${provider === 'gemini'
                                            ? 'border-purple-500 bg-purple-500/20'
                                            : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                                            }`}
                                    >
                                        <div className="text-lg font-semibold text-white">Google Gemini</div>
                                        <div className="text-sm text-gray-400">Official Gemini API</div>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setProvider('openrouter')
                                            setModelName('anthropic/claude-3-sonnet')
                                        }}
                                        className={`p-4 rounded-lg border-2 transition-all ${provider === 'openrouter'
                                            ? 'border-purple-500 bg-purple-500/20'
                                            : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                                            }`}
                                    >
                                        <div className="text-lg font-semibold text-white">OpenRouter</div>
                                        <div className="text-sm text-gray-400">Multiple providers</div>
                                    </button>
                                </div>

                                {/* Model Selection */}
                                <div>
                                    <Label className="text-gray-300 mb-2 block">Model</Label>
                                    <select
                                        value={modelName}
                                        onChange={(e) => setModelName(e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                                    >
                                        {(provider === 'gemini' ? GEMINI_MODELS : OPENROUTER_MODELS).map((model) => (
                                            <option key={model.id} value={model.id}>
                                                {model.name} - {model.description}
                                            </option>
                                        ))}
                                        <option value="custom">Custom Model (enter below)</option>
                                    </select>
                                </div>

                                {/* Custom Model Input */}
                                {modelName === 'custom' && (
                                    <div>
                                        <Label className="text-gray-300 mb-2 block">Custom Model ID</Label>
                                        <Input
                                            value={customModel}
                                            onChange={(e) => setCustomModel(e.target.value)}
                                            placeholder="e.g., anthropic/claude-3-opus"
                                            className="bg-gray-800 border-gray-700"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* API Keys */}
                        <div className="bg-gray-900/50 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <Key className="h-5 w-5 text-purple-400" />
                                API Keys
                            </h2>

                            <div className="space-y-4">
                                {provider === 'gemini' ? (
                                    <div>
                                        <Label className="text-gray-300 mb-2 block">Gemini API Key</Label>
                                        <Input
                                            type="password"
                                            value={geminiKey}
                                            onChange={(e) => setGeminiKey(e.target.value)}
                                            placeholder="Enter your Gemini API key"
                                            className="bg-gray-800 border-gray-700"
                                        />
                                        <p className="text-sm text-gray-500 mt-1">
                                            Get your API key from{' '}
                                            <a href="https://aistudio.google.com/apikey" target="_blank" className="text-purple-400 hover:underline">
                                                Google AI Studio
                                            </a>
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <Label className="text-gray-300 mb-2 block">OpenRouter API Key</Label>
                                        <Input
                                            type="password"
                                            value={openRouterKey}
                                            onChange={(e) => setOpenRouterKey(e.target.value)}
                                            placeholder="Enter your OpenRouter API key"
                                            className="bg-gray-800 border-gray-700"
                                        />
                                        <p className="text-sm text-gray-500 mt-1">
                                            Get your API key from{' '}
                                            <a href="https://openrouter.ai/keys" target="_blank" className="text-purple-400 hover:underline">
                                                OpenRouter
                                            </a>
                                        </p>
                                    </div>
                                )}

                                {/* Test Connection */}
                                <Button
                                    onClick={handleTestConnection}
                                    disabled={isTesting}
                                    variant="outline"
                                    className="w-full border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                                >
                                    {isTesting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Testing...
                                        </>
                                    ) : (
                                        <>
                                            <TestTube className="h-4 w-4 mr-2" />
                                            Test Connection
                                        </>
                                    )}
                                </Button>

                                {testResult && (
                                    <div className={`flex items-center gap-2 p-3 rounded-lg ${testResult.success ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                        }`}>
                                        {testResult.success ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                                        {testResult.message}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* AI Features */}
                        <div className="bg-gray-900/50 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <Wand2 className="h-5 w-5 text-purple-400" />
                                AI Features
                            </h2>

                            <div className="space-y-4">
                                {/* Enable/Disable AI */}
                                <label className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg cursor-pointer">
                                    <div>
                                        <div className="text-white font-medium">Enable AI Features</div>
                                        <div className="text-sm text-gray-400">Turn on/off all AI functionality</div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={isEnabled}
                                        onChange={(e) => setIsEnabled(e.target.checked)}
                                        className="w-5 h-5 accent-purple-500"
                                    />
                                </label>

                                {/* Web Search */}
                                <label className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <Globe className="h-5 w-5 text-cyan-400" />
                                        <div>
                                            <div className="text-white font-medium">Agentic Web Search</div>
                                            <div className="text-sm text-gray-400">AI can search the web for information</div>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={webSearchEnabled}
                                        onChange={(e) => setWebSearchEnabled(e.target.checked)}
                                        className="w-5 h-5 accent-purple-500"
                                    />
                                </label>

                                {/* Auto Fill */}
                                <label className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <Wand2 className="h-5 w-5 text-pink-400" />
                                        <div>
                                            <div className="text-white font-medium">Auto-Fill Forms</div>
                                            <div className="text-sm text-gray-400">AI automatically fills form fields</div>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={autoFillEnabled}
                                        onChange={(e) => setAutoFillEnabled(e.target.checked)}
                                        className="w-5 h-5 accent-purple-500"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Advanced Settings */}
                        <div className="bg-gray-900/50 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <Settings className="h-5 w-5 text-purple-400" />
                                Advanced Settings
                            </h2>

                            <div className="space-y-4">
                                {/* Max Tokens */}
                                <div>
                                    <Label className="text-gray-300 mb-2 block">Max Tokens: {maxTokens}</Label>
                                    <input
                                        type="range"
                                        min="1024"
                                        max="16384"
                                        step="512"
                                        value={maxTokens}
                                        onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                                        className="w-full accent-purple-500"
                                    />
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>1024</span>
                                        <span>16384</span>
                                    </div>
                                </div>

                                {/* Temperature */}
                                <div>
                                    <Label className="text-gray-300 mb-2 block">Temperature: {temperature}</Label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={temperature}
                                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                                        className="w-full accent-purple-500"
                                    />
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Precise (0)</span>
                                        <span>Creative (1)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="mt-6 flex items-center gap-4">
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 px-8"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Settings
                                </>
                            )}
                        </Button>

                        {saveStatus && (
                            <span className={`text-sm ${saveStatus.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
                                {saveStatus}
                            </span>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}
