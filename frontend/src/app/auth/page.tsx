'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/AuthContext'
import { Shield, Lock, ArrowRight, Terminal } from 'lucide-react'
import Link from 'next/link'
import AnimatedGridBackground from '@/components/AnimatedGridBackground'

export default function AuthPage() {
  const router = useRouter()
  const { login, register, isLoading } = useAuth()

  const [activeTab, setActiveTab] = useState('login')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Login form state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Register form state
  const [registerFirstName, setRegisterFirstName] = useState('')
  const [registerLastName, setRegisterLastName] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!loginEmail || !loginPassword) {
      setError('Please fill in all fields')
      return
    }

    const result = await login(loginEmail, loginPassword)

    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.error || 'Login failed')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!registerFirstName || !registerLastName || !registerEmail || !registerPassword) {
      setError('Please fill in all fields')
      return
    }

    if (registerPassword !== registerConfirmPassword) {
      setError('Passwords do not match')
      return
    }

    const result = await register({
      email: registerEmail,
      password: registerPassword,
      firstName: registerFirstName,
      lastName: registerLastName,
    })

    if (result.success) {
      setSuccess('Account created successfully! Please login.')
      setActiveTab('login')
      setLoginEmail(registerEmail)
      // Clear register form
      setRegisterFirstName('')
      setRegisterLastName('')
      setRegisterEmail('')
      setRegisterPassword('')
      setRegisterConfirmPassword('')
    } else {
      setError(result.error || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center relative overflow-hidden p-4">
      <AnimatedGridBackground />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-[#0a0e1a]/80 to-blue-900/10 z-10"></div>

      <div className="w-full max-w-md relative z-20">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group mb-4">
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/50">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              KOMPL.AI
            </span>
          </Link>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Terminal className="h-4 w-4 text-cyan-400" />
            <span className="text-cyan-400 text-sm font-mono">$ secure_authentication_portal</span>
          </div>
        </div>

        <Card className="bg-gray-900/50 border-cyan-500/30 backdrop-blur-md shadow-2xl shadow-cyan-500/10">
          <CardHeader className="space-y-1 pb-4 border-b border-cyan-500/20">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-center text-white">
              {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription className="text-center text-gray-400">
              {activeTab === 'login'
                ? 'Enter your credentials to access your account'
                : 'Join the next generation of compliance management'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm flex items-start gap-2">
                <Lock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg text-sm flex items-start gap-2">
                <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-800/50 border border-cyan-500/20">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white text-gray-400"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white text-gray-400"
                >
                  Register
                </TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-gray-300">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="bg-gray-800/50 border-cyan-500/30 text-white placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-gray-300">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="•••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="bg-gray-800/50 border-cyan-500/30 text-white placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500/50"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging in...' : (
                      <>
                        Login
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-firstName" className="text-gray-300">First Name</Label>
                      <Input
                        id="register-firstName"
                        type="text"
                        placeholder="John"
                        value={registerFirstName}
                        onChange={(e) => setRegisterFirstName(e.target.value)}
                        className="bg-gray-800/50 border-cyan-500/30 text-white placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500/50"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-lastName" className="text-gray-300">Last Name</Label>
                      <Input
                        id="register-lastName"
                        type="text"
                        placeholder="Doe"
                        value={registerLastName}
                        onChange={(e) => setRegisterLastName(e.target.value)}
                        className="bg-gray-800/50 border-cyan-500/30 text-white placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500/50"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-gray-300">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="your@email.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="bg-gray-800/50 border-cyan-500/30 text-white placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-gray-300">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="•••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="bg-gray-800/50 border-cyan-500/30 text-white placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-confirmPassword" className="text-gray-300">Confirm Password</Label>
                    <Input
                      id="register-confirmPassword"
                      type="password"
                      placeholder="•••••••"
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      className="bg-gray-800/50 border-cyan-500/30 text-white placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500/50"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating account...' : (
                      <>
                        Create Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Back to Home Link */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors inline-flex items-center gap-1">
            <ArrowRight className="h-3 w-3 rotate-180" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
