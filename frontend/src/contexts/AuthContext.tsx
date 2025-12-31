'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi, TokenManager, User } from '@/lib/api'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: {
    email: string
    password: string
    firstName: string
    lastName: string
  }) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = TokenManager.getUser()
    const token = TokenManager.getToken()

    if (storedUser && token) {
      setUser(storedUser)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    try {
      const response = await authApi.login(email, password)
 
      if (response.success && response.user) {
        setUser(response.user)
        
        // Redirect based on role
        if (typeof window !== 'undefined') {
          const role = response.user.role.toLowerCase()
          if (role === 'superadmin') {
            window.location.href = '/dashboard/platform'
          } else if (role === 'admin') {
            window.location.href = '/dashboard'
          } else {
            window.location.href = '/dashboard'
          }
        }
        
        return { success: true }
      }
 
      return { success: false, error: 'Login failed' }
    } catch (error: any) {
      console.error('Login error:', error)
      return { success: false, error: error.message || 'An unexpected error occurred' }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: {
    email: string
    password: string
    firstName: string
    lastName: string
  }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    try {
      const response = await authApi.register(data)

      if (response.success) {
        return { success: true }
      }

      return { success: false, error: 'Registration failed' }
    } catch (error: any) {
      console.error('Register error:', error)
      return { success: false, error: error.message || 'An unexpected error occurred' }
    } finally {
      setIsLoading(false)
    }
  }


  const logout = () => {
    TokenManager.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}