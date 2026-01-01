import { useEffect, useState } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export interface ApiResponse<T> {
  data: T
  error?: string
  message?: string
  success?: boolean
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  tenantId: string
}

export interface LoginResponse {
  success: boolean
  token: string
  user: User
}

export interface RegisterResponse {
  success: boolean
  message: string
  user: User
}

// Token management
export const TokenManager = {
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token')
    }
    return null
  },
  setToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token)
    }
  },
  removeToken: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
    }
  },
  getUser: (): User | null => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user) : null
    }
    return null
  },
  setUser: (user: User): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user))
    }
  },
  removeUser: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
    }
  },
  clear: (): void => {
    TokenManager.removeToken()
    TokenManager.removeUser()
  }
}

// Get headers with auth token
const getHeaders = (includeAuth: boolean = true): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (includeAuth) {
    const token = TokenManager.getToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  return headers
}

// Authenticated request helper
const authenticatedRequest = async (endpoint: string, method: string, body?: any) => {
  try {
    const token = TokenManager.getToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    })

    if (response.status === 401) {
      TokenManager.clear()
      throw new Error('Unauthorized. Please login again.')
    }

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Request failed')
    }

    return { success: true, data, message: data.message }
  } catch (error: any) {
    console.error(`API Error (${method} ${endpoint}):`, error)
    return { success: false, error: error.message || 'Request failed', data: null }
  }
}

// API client
export const api = {
  login: async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Login failed')
      }

      if (data.token && data.user) {
        TokenManager.setToken(data.token)
        TokenManager.setUser(data.user)
        return { success: true, ...data }
      }

      throw new Error('Invalid response from server')
    } catch (error: any) {
      throw new Error(error.message || 'Login failed')
    }
  },

  register: async (userData: { email: string; password: string; firstName: string; lastName: string }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Registration failed')
      }

      return { success: true, ...data }
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed')
    }
  }
}

// Alias for AuthContext compatibility
export const authApi = api


// RegOps API
export const regopsAPI = {
  // Regulations
  getRegulations: async () => {
    return authenticatedRequest('/regops/regulations', 'GET')
  },
  getRegulation: async (id: string | number) => {
    return authenticatedRequest(`/regops/regulations/${id}`, 'GET')
  },
  createRegulation: async (data: any) => {
    return authenticatedRequest('/regops/regulations', 'POST', data)
  },
  updateRegulation: async (id: string | number, data: any) => {
    return authenticatedRequest(`/regops/regulations/${id}`, 'PUT', data)
  },
  deleteRegulation: async (id: string | number) => {
    return authenticatedRequest(`/regops/regulations/${id}`, 'DELETE')
  },
  getDeletedRegulations: async () => {
    return authenticatedRequest('/regops/regulations/deleted', 'GET')
  },
  restoreRegulation: async (id: string | number) => {
    return authenticatedRequest(`/regops/regulations/${id}/restore`, 'POST')
  },
  permanentDeleteRegulation: async (id: string | number) => {
    return authenticatedRequest(`/regops/regulations/${id}/permanent-delete`, 'DELETE')
  },
  // Compliance Assessments
  getComplianceAssessments: async () => {
    return authenticatedRequest('/regops/compliance-assessments', 'GET')
  },
  getComplianceAssessment: async (id: string | number) => {
    return authenticatedRequest(`/regops/compliance-assessments/${id}`, 'GET')
  },
  createComplianceAssessment: async (data: any) => {
    return authenticatedRequest('/regops/compliance-assessments', 'POST', data)
  },
  updateComplianceAssessment: async (id: string | number, data: any) => {
    return authenticatedRequest(`/regops/compliance-assessments/${id}`, 'PUT', data)
  },
  deleteComplianceAssessment: async (id: string | number) => {
    return authenticatedRequest(`/regops/compliance-assessments/${id}`, 'DELETE')
  },
  getDeletedComplianceAssessments: async () => {
    return authenticatedRequest('/regops/compliance-assessments/deleted', 'GET')
  },
  restoreComplianceAssessment: async (id: string | number) => {
    return authenticatedRequest(`/regops/compliance-assessments/${id}/restore`, 'POST')
  },
  permanentDeleteComplianceAssessment: async (id: string | number) => {
    return authenticatedRequest(`/regops/compliance-assessments/${id}/permanent-delete`, 'DELETE')
  },
  // Policies
  getPolicies: async () => {
    return authenticatedRequest('/regops/policies', 'GET')
  },
  getPolicy: async (id: string | number) => {
    return authenticatedRequest(`/regops/policies/${id}`, 'GET')
  },
  createPolicy: async (data: any) => {
    return authenticatedRequest('/regops/policies', 'POST', data)
  },
  updatePolicy: async (id: string | number, data: any) => {
    return authenticatedRequest(`/regops/policies/${id}`, 'PUT', data)
  },
  deletePolicy: async (id: string | number) => {
    return authenticatedRequest(`/regops/policies/${id}`, 'DELETE')
  },
  getDeletedPolicies: async () => {
    return authenticatedRequest('/regops/policies/deleted', 'GET')
  },
  restorePolicy: async (id: string | number) => {
    return authenticatedRequest(`/regops/policies/${id}/restore`, 'POST')
  },
  permanentDeletePolicy: async (id: string | number) => {
    return authenticatedRequest(`/regops/policies/${id}/permanent-delete`, 'DELETE')
  },
  // Controls
  getControls: async () => {
    return authenticatedRequest('/regops/controls', 'GET')
  },
  getControl: async (id: string | number) => {
    return authenticatedRequest(`/regops/controls/${id}`, 'GET')
  },
  createControl: async (data: any) => {
    return authenticatedRequest('/regops/controls', 'POST', data)
  },
  updateControl: async (id: string | number, data: any) => {
    return authenticatedRequest(`/regops/controls/${id}`, 'PUT', data)
  },
  deleteControl: async (id: string | number) => {
    return authenticatedRequest(`/regops/controls/${id}`, 'DELETE')
  },
  getDeletedControls: async () => {
    return authenticatedRequest('/regops/controls/deleted', 'GET')
  },
  restoreControl: async (id: string | number) => {
    return authenticatedRequest(`/regops/controls/${id}/restore`, 'POST')
  },
  permanentDeleteControl: async (id: string | number) => {
    return authenticatedRequest(`/regops/controls/${id}/permanent-delete`, 'DELETE')
  },
}

// PrivacyOps API
export const privacyopsAPI = {
  // Data Inventory
  getDataInventory: async () => {
    return authenticatedRequest('/privacyops/data-inventory', 'GET')
  },
  getDataAsset: async (id: string | number) => {
    return authenticatedRequest(`/privacyops/data-inventory/${id}`, 'GET')
  },
  createDataInventory: async (data: any) => {
    return authenticatedRequest('/privacyops/data-inventory', 'POST', data)
  },
  updateDataInventory: async (id: string | number, data: any) => {
    return authenticatedRequest(`/privacyops/data-inventory/${id}`, 'PUT', data)
  },
  deleteDataInventory: async (id: string | number) => {
    return authenticatedRequest(`/privacyops/data-inventory/${id}`, 'DELETE')
  },
  getDeletedDataInventory: async () => {
    return authenticatedRequest('/privacyops/data-inventory/deleted', 'GET')
  },
  restoreDataInventory: async (id: string | number) => {
    return authenticatedRequest(`/privacyops/data-inventory/${id}/restore`, 'POST')
  },
  permanentDeleteDataInventory: async (id: string | number) => {
    return authenticatedRequest(`/privacyops/data-inventory/${id}/permanent-delete`, 'DELETE')
  },
  // DSR Requests
  getDSRRequests: async () => {
    return authenticatedRequest('/privacyops/dsr-requests', 'GET')
  },
  getDSRRequest: async (id: string | number) => {
    return authenticatedRequest(`/privacyops/dsr-requests/${id}`, 'GET')
  },
  createDSRRequest: async (data: any) => {
    return authenticatedRequest('/privacyops/dsr-requests', 'POST', data)
  },
  updateDSRRequest: async (id: string | number, data: any) => {
    return authenticatedRequest(`/privacyops/dsr-requests/${id}`, 'PUT', data)
  },
  deleteDSRRequest: async (id: string | number) => {
    return authenticatedRequest(`/privacyops/dsr-requests/${id}`, 'DELETE')
  },
  getDeletedDSRRequests: async () => {
    return authenticatedRequest('/privacyops/dsr-requests/deleted', 'GET')
  },
  restoreDSRRequest: async (id: string | number) => {
    return authenticatedRequest(`/privacyops/dsr-requests/${id}/restore`, 'POST')
  },
  permanentDeleteDSRRequest: async (id: string | number) => {
    return authenticatedRequest(`/privacyops/dsr-requests/${id}/permanent-delete`, 'DELETE')
  },
  // DPIA
  getDPIA: async () => {
    return authenticatedRequest('/privacyops/dpia', 'GET')
  },
  getDPIAById: async (id: string | number) => {
    return authenticatedRequest(`/privacyops/dpia/${id}`, 'GET')
  },
  createDPIA: async (data: any) => {
    return authenticatedRequest('/privacyops/dpia', 'POST', data)
  },
  updateDPIA: async (id: string | number, data: any) => {
    return authenticatedRequest(`/privacyops/dpia/${id}`, 'PUT', data)
  },
  deleteDPIA: async (id: string | number) => {
    return authenticatedRequest(`/privacyops/dpia/${id}`, 'DELETE')
  },
  getDeletedDPIA: async () => {
    return authenticatedRequest('/privacyops/dpia/deleted', 'GET')
  },
  restoreDPIA: async (id: string | number) => {
    return authenticatedRequest(`/privacyops/dpia/${id}/restore`, 'POST')
  },
  permanentDeleteDPIA: async (id: string | number) => {
    return authenticatedRequest(`/privacyops/dpia/${id}/permanent-delete`, 'DELETE')
  },
  // Privacy Controls
  getPrivacyControls: async () => {
    return authenticatedRequest('/privacyops/privacy-controls', 'GET')
  },
  getPrivacyControl: async (id: string | number) => {
    return authenticatedRequest(`/privacyops/privacy-controls/${id}`, 'GET')
  },
  createPrivacyControl: async (data: any) => {
    return authenticatedRequest('/privacyops/privacy-controls', 'POST', data)
  },
  updatePrivacyControl: async (id: string | number, data: any) => {
    return authenticatedRequest(`/privacyops/privacy-controls/${id}`, 'PUT', data)
  },
  deletePrivacyControl: async (id: string | number) => {
    return authenticatedRequest(`/privacyops/privacy-controls/${id}`, 'DELETE')
  },
  getDeletedPrivacyControls: async () => {
    return authenticatedRequest('/privacyops/privacy-controls/deleted', 'GET')
  },
  restorePrivacyControl: async (id: string | number) => {
    return authenticatedRequest(`/privacyops/privacy-controls/${id}/restore`, 'POST')
  },
  permanentDeletePrivacyControl: async (id: string | number) => {
    return authenticatedRequest(`/privacyops/privacy-controls/${id}/permanent-delete`, 'DELETE')
  },
}

// RiskOps API
export const riskopsAPI = {
  // Risk Register
  getRiskRegister: async () => {
    return authenticatedRequest('/riskops/risk-register', 'GET')
  },
  getRisk: async (id: string | number) => {
    return authenticatedRequest(`/riskops/risk-register/${id}`, 'GET')
  },
  createRisk: async (data: any) => {
    return authenticatedRequest('/riskops/risk-register', 'POST', data)
  },
  updateRisk: async (id: string | number, data: any) => {
    return authenticatedRequest(`/riskops/risk-register/${id}`, 'PUT', data)
  },
  deleteRisk: async (id: string | number) => {
    return authenticatedRequest(`/riskops/risk-register/${id}`, 'DELETE')
  },
  getDeletedRisks: async () => {
    return authenticatedRequest('/riskops/risk-register/deleted', 'GET')
  },
  restoreRisk: async (id: string | number) => {
    return authenticatedRequest(`/riskops/risk-register/${id}/restore`, 'POST')
  },
  permanentDeleteRisk: async (id: string | number) => {
    return authenticatedRequest(`/riskops/risk-register/${id}/permanent-delete`, 'DELETE')
  },
  // Vulnerabilities
  getVulnerabilities: async () => {
    return authenticatedRequest('/riskops/vulnerabilities', 'GET')
  },
  getVulnerability: async (id: string | number) => {
    return authenticatedRequest(`/riskops/vulnerabilities/${id}`, 'GET')
  },
  createVulnerability: async (data: any) => {
    return authenticatedRequest('/riskops/vulnerabilities', 'POST', data)
  },
  updateVulnerability: async (id: string | number, data: any) => {
    return authenticatedRequest(`/riskops/vulnerabilities/${id}`, 'PUT', data)
  },
  deleteVulnerability: async (id: string | number) => {
    return authenticatedRequest(`/riskops/vulnerabilities/${id}`, 'DELETE')
  },
  getDeletedVulnerabilities: async () => {
    return authenticatedRequest('/riskops/vulnerabilities/deleted', 'GET')
  },
  restoreVulnerability: async (id: string | number) => {
    return authenticatedRequest(`/riskops/vulnerabilities/${id}/restore`, 'POST')
  },
  permanentDeleteVulnerability: async (id: string | number) => {
    return authenticatedRequest(`/riskops/vulnerabilities/${id}/permanent-delete`, 'DELETE')
  },
  // Vendor Assessments
  getVendorAssessments: async () => {
    return authenticatedRequest('/riskops/vendor-assessments', 'GET')
  },
  getVendorAssessment: async (id: string | number) => {
    return authenticatedRequest(`/riskops/vendor-assessments/${id}`, 'GET')
  },
  createVendorAssessment: async (data: any) => {
    return authenticatedRequest('/riskops/vendor-assessments', 'POST', data)
  },
  updateVendorAssessment: async (id: string | number, data: any) => {
    return authenticatedRequest(`/riskops/vendor-assessments/${id}`, 'PUT', data)
  },
  deleteVendorAssessment: async (id: string | number) => {
    return authenticatedRequest(`/riskops/vendor-assessments/${id}`, 'DELETE')
  },
  getDeletedVendorAssessments: async () => {
    return authenticatedRequest('/riskops/vendor-assessments/deleted', 'GET')
  },
  restoreVendorAssessment: async (id: string | number) => {
    return authenticatedRequest(`/riskops/vendor-assessments/${id}/restore`, 'POST')
  },
  permanentDeleteVendorAssessment: async (id: string | number) => {
    return authenticatedRequest(`/riskops/vendor-assessments/${id}/permanent-delete`, 'DELETE')
  },
  // Business Continuity
  getBusinessContinuity: async () => {
    return authenticatedRequest('/riskops/business-continuity', 'GET')
  },
  getBusinessContinuityById: async (id: string | number) => {
    return authenticatedRequest(`/riskops/business-continuity/${id}`, 'GET')
  },
  createBusinessContinuity: async (data: any) => {
    return authenticatedRequest('/riskops/business-continuity', 'POST', data)
  },
  updateBusinessContinuity: async (id: string | number, data: any) => {
    return authenticatedRequest(`/riskops/business-continuity/${id}`, 'PUT', data)
  },
  deleteBusinessContinuity: async (id: string | number) => {
    return authenticatedRequest(`/riskops/business-continuity/${id}`, 'DELETE')
  },
  getDeletedBusinessContinuity: async () => {
    return authenticatedRequest('/riskops/business-continuity/deleted', 'GET')
  },
  restoreBusinessContinuity: async (id: string | number) => {
    return authenticatedRequest(`/riskops/business-continuity/${id}/restore`, 'POST')
  },
  permanentDeleteBusinessContinuity: async (id: string | number) => {
    return authenticatedRequest(`/riskops/business-continuity/${id}/permanent-delete`, 'DELETE')
  },
}

// AuditOps API
export const auditopsAPI = {
  // Audit Plans
  getAuditPlans: async () => {
    return authenticatedRequest('/auditops/audit-plans', 'GET')
  },
  getAuditPlan: async (id: string | number) => {
    return authenticatedRequest(`/auditops/audit-plans/${id}`, 'GET')
  },
  createAuditPlan: async (data: any) => {
    return authenticatedRequest('/auditops/audit-plans', 'POST', data)
  },
  updateAuditPlan: async (id: string | number, data: any) => {
    return authenticatedRequest(`/auditops/audit-plans/${id}`, 'PUT', data)
  },
  deleteAuditPlan: async (id: string | number) => {
    return authenticatedRequest(`/auditops/audit-plans/${id}`, 'DELETE')
  },
  getDeletedAuditPlans: async () => {
    return authenticatedRequest('/auditops/audit-plans/deleted', 'GET')
  },
  restoreAuditPlan: async (id: string | number) => {
    return authenticatedRequest(`/auditops/audit-plans/${id}/restore`, 'POST')
  },
  permanentDeleteAuditPlan: async (id: string | number) => {
    return authenticatedRequest(`/auditops/audit-plans/${id}/permanent-delete`, 'DELETE')
  },
  // Audit Evidence
  getAuditEvidence: async () => {
    return authenticatedRequest('/auditops/audit-evidence', 'GET')
  },
  getAuditEvidenceById: async (id: string | number) => {
    return authenticatedRequest(`/auditops/audit-evidence/${id}`, 'GET')
  },
  createAuditEvidence: async (data: any) => {
    return authenticatedRequest('/auditops/audit-evidence', 'POST', data)
  },
  updateAuditEvidence: async (id: string | number, data: any) => {
    return authenticatedRequest(`/auditops/audit-evidence/${id}`, 'PUT', data)
  },
  deleteAuditEvidence: async (id: string | number) => {
    return authenticatedRequest(`/auditops/audit-evidence/${id}`, 'DELETE')
  },
  getDeletedAuditEvidence: async () => {
    return authenticatedRequest('/auditops/audit-evidence/deleted', 'GET')
  },
  restoreAuditEvidence: async (id: string | number) => {
    return authenticatedRequest(`/auditops/audit-evidence/${id}/restore`, 'POST')
  },
  permanentDeleteAuditEvidence: async (id: string | number) => {
    return authenticatedRequest(`/auditops/audit-evidence/${id}/permanent-delete`, 'DELETE')
  },
  // Control Tests
  getControlTests: async () => {
    return authenticatedRequest('/auditops/control-tests', 'GET')
  },
  getControlTest: async (id: string | number) => {
    return authenticatedRequest(`/auditops/control-tests/${id}`, 'GET')
  },
  createControlTest: async (data: any) => {
    return authenticatedRequest('/auditops/control-tests', 'POST', data)
  },
  updateControlTest: async (id: string | number, data: any) => {
    return authenticatedRequest(`/auditops/control-tests/${id}`, 'PUT', data)
  },
  deleteControlTest: async (id: string | number) => {
    return authenticatedRequest(`/auditops/control-tests/${id}`, 'DELETE')
  },
  getDeletedControlTests: async () => {
    return authenticatedRequest('/auditops/control-tests/deleted', 'GET')
  },
  restoreControlTest: async (id: string | number) => {
    return authenticatedRequest(`/auditops/control-tests/${id}/restore`, 'POST')
  },
  permanentDeleteControlTest: async (id: string | number) => {
    return authenticatedRequest(`/auditops/control-tests/${id}/permanent-delete`, 'DELETE')
  },
  // Audit Reports
  getAuditReports: async () => {
    return authenticatedRequest('/auditops/audit-reports', 'GET')
  },
  getAuditReport: async (id: string | number) => {
    return authenticatedRequest(`/auditops/audit-reports/${id}`, 'GET')
  },
  createAuditReport: async (data: any) => {
    return authenticatedRequest('/auditops/audit-reports', 'POST', data)
  },
  updateAuditReport: async (id: string | number, data: any) => {
    return authenticatedRequest(`/auditops/audit-reports/${id}`, 'PUT', data)
  },
  deleteAuditReport: async (id: string | number) => {
    return authenticatedRequest(`/auditops/audit-reports/${id}`, 'DELETE')
  },
  getDeletedAuditReports: async () => {
    return authenticatedRequest('/auditops/audit-reports/deleted', 'GET')
  },
  restoreAuditReport: async (id: string | number) => {
    return authenticatedRequest(`/auditops/audit-reports/${id}/restore`, 'POST')
  },
  permanentDeleteAuditReport: async (id: string | number) => {
    return authenticatedRequest(`/auditops/audit-reports/${id}/permanent-delete`, 'DELETE')
  },
}

// AI Settings API
export const aiAPI = {
  getSettings: async () => {
    return authenticatedRequest('/ai/settings', 'GET')
  },
  updateSettings: async (data: any) => {
    return authenticatedRequest('/ai/settings', 'PUT', data)
  },
  getModels: async () => {
    return authenticatedRequest('/ai/models', 'GET')
  },
  testConnection: async () => {
    return authenticatedRequest('/ai/test', 'POST')
  },
  chat: async (message: string, context?: any, feature?: string) => {
    return authenticatedRequest('/ai/chat', 'POST', { message, context, feature })
  },
}

// Document API
export const documentAPI = {
  getTemplates: async () => {
    return authenticatedRequest('/documents/templates', 'GET')
  },
  generate: async (documentType: string, title: string, context?: any) => {
    return authenticatedRequest('/documents/generate', 'POST', {
      document_type: documentType,
      title,
      context,
      format: 'markdown'
    })
  },
  save: async (data: {
    document_type: string
    title: string
    styled_html?: string
    storage_url?: string
    storage_path?: string
    file_size?: number
    file_format?: string
    is_generated?: boolean
    generation_prompt?: string
    ai_model?: string
    content?: string
    template_type?: string
  }) => {
    return authenticatedRequest('/documents/save', 'POST', data)
  },
  getDocuments: async () => {
    return authenticatedRequest('/documents', 'GET')
  },
  getDocumentById: async (id: string) => {
    return authenticatedRequest(`/documents/${id}`, 'GET')
  },
  getDocumentAnalyses: async (documentId: string) => {
    return authenticatedRequest(`/documents/${documentId}/analyses`, 'GET')
  },
  getInfographicHTML: async (documentId: string) => {
    return authenticatedRequest(`/documents/${documentId}/infographic`, 'GET')
  },
  downloadDocument: async (id: string, format: 'pdf' | 'docx' | 'html') => {
    try {
      const token = TokenManager.getToken()
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`${API_BASE_URL}/documents/${id}/download?format=${format}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.status === 401) {
        TokenManager.clear()
        throw new Error('Unauthorized. Please login again.')
      }

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || error.error || 'Download failed')
      }

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition')
      let filename = `document.${format}`
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '')
        }
      }

      // Get the blob
      const blob = await response.blob()

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      return { success: true, filename }
    } catch (error: any) {
      console.error('Document download error:', error)
      return { success: false, error: error.message || 'Download failed' }
    }
  },
  analyzeDocument: async (file: File) => {
    try {
      const token = TokenManager.getToken()
      if (!token) {
        throw new Error('No authentication token found')
      }

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${API_BASE_URL}/documents/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      if (response.status === 401) {
        TokenManager.clear()
        throw new Error('Unauthorized. Please login again.')
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Analysis failed')
      }

      return { success: true, data, message: data.message }
    } catch (error: any) {
      console.error('Document analysis error:', error)
      return { success: false, error: error.message || 'Analysis failed' }
    }
  },
  autoFillDocument: async (documentType: string, title: string, context?: any) => {
    return authenticatedRequest('/documents/autofill', 'POST', {
      document_type: documentType,
      title,
      context,
    })
  },
}

// Platform API (Super Admin only)
export const platformAPI = {
  // Dashboard stats
  getStats: async () => authenticatedRequest('/platform/stats', 'GET'),
  getTopTenants: async () => authenticatedRequest('/platform/top-tenants', 'GET'),
  getRecentActivity: async () => authenticatedRequest('/platform/recent-activity', 'GET'),
  getAlerts: async () => authenticatedRequest('/platform/alerts', 'GET'),

  // Tenants management
  getTenants: async () => authenticatedRequest('/platform/tenants', 'GET'),
  getTenantById: async (id: string) => authenticatedRequest(`/platform/tenants/${id}`, 'GET'),
  createTenant: async (data: any) => authenticatedRequest('/platform/tenants', 'POST', data),
  updateTenant: async (id: string, data: any) => authenticatedRequest(`/platform/tenants/${id}`, 'PUT', data),
  deleteTenant: async (id: string) => authenticatedRequest(`/platform/tenants/${id}`, 'DELETE'),

  // Analytics
  getAnalytics: async () => authenticatedRequest('/platform/analytics', 'GET'),

  // Billing
  getBillingOverview: async () => authenticatedRequest('/platform/billing', 'GET'),
  getInvoices: async () => authenticatedRequest('/platform/billing/invoices', 'GET'),
  getSubscriptions: async () => authenticatedRequest('/platform/billing/subscriptions', 'GET'),

  // Logs
  getLogs: async (level?: string, category?: string) => {
    const params = new URLSearchParams()
    if (level) params.append('level', level)
    if (category) params.append('category', category)
    const query = params.toString() ? `?${params.toString()}` : ''
    return authenticatedRequest(`/platform/logs${query}`, 'GET')
  },
  getLogStats: async () => authenticatedRequest('/platform/logs/stats', 'GET'),
}