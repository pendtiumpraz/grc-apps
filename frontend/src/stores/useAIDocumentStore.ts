import { create } from 'zustand'

// Document Template Types
export interface DocumentTemplate {
  id: number
  tenantId: number
  name: string
  description: string
  documentType: string
  category: string
  requirementsSchema: {
    sections: TemplateSection[]
  }
  templateContent: string
  createdBy: number
  createdAt: string
  updatedAt: string
}

export interface TemplateSection {
  id: string
  title: string
  fields: TemplateField[]
}

export interface TemplateField {
  id: string
  label: string
  type: 'text' | 'textarea' | 'email' | 'date' | 'number' | 'select'
  required: boolean
  options?: string[]
}

// Generated Document Types
export interface GeneratedDocument {
  id: number
  tenantId: number
  templateId: number
  name: string
  documentType: string
  requirementsData: Record<string, any>
  generatedContent: string
  generatedAt: string
  status: 'draft' | 'final' | 'archived'
  version: number
  createdBy: number
  createdAt: string
  updatedAt: string
}

// Document Analysis Types
export interface DocumentAnalysis {
  id: number
  tenantId: number
  documentId: number | null
  documentName: string
  filePath: string
  fileType: string
  fileSize: number
  analysisResult: {
    sections_found: string[]
    compliance_issues: string[]
    strengths: string[]
    weaknesses: string[]
  }
  summary: string
  complianceScore: number
  riskLevel: 'low' | 'medium' | 'high'
  recommendations: string[]
  analyzedAt: string
  createdBy: number
  createdAt: string
}

interface AIDocumentStore {
  // Document Templates
  templates: DocumentTemplate[]
  templatesLoading: boolean
  templatesError: string | null

  fetchTemplates: () => Promise<void>
  fetchTemplate: (id: number) => Promise<DocumentTemplate | null>
  createTemplate: (template: Partial<DocumentTemplate>) => Promise<void>
  updateTemplate: (id: number, template: Partial<DocumentTemplate>) => Promise<void>
  deleteTemplate: (id: number) => Promise<void>

  // Generated Documents
  documents: GeneratedDocument[]
  documentsLoading: boolean
  documentsError: string | null

  fetchDocuments: () => Promise<void>
  fetchDocument: (id: number) => Promise<GeneratedDocument | null>
  generateDocument: (data: {
    templateId: number
    name: string
    requirementsData: Record<string, any>
  }) => Promise<void>
  updateDocument: (id: number, document: Partial<GeneratedDocument>) => Promise<void>
  deleteDocument: (id: number) => Promise<void>

  // Document Analysis
  analyses: DocumentAnalysis[]
  analysesLoading: boolean
  analysesError: string | null

  fetchAnalyses: () => Promise<void>
  fetchAnalysis: (id: number) => Promise<DocumentAnalysis | null>
  analyzeDocument: (data: {
    documentId?: number
    documentName: string
    filePath: string
    fileType: string
    fileSize: number
  }) => Promise<void>
  deleteAnalysis: (id: number) => Promise<void>
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

export const useAIDocumentStore = create<AIDocumentStore>((set, get) => ({
  // Initial state
  templates: [],
  templatesLoading: false,
  templatesError: null,

  documents: [],
  documentsLoading: false,
  documentsError: null,

  analyses: [],
  analysesLoading: false,
  analysesError: null,

  // Document Templates
  fetchTemplates: async () => {
    set({ templatesLoading: true, templatesError: null })
    try {
      const response = await fetch(`${API_URL}/ai-documents/templates`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch templates')
      }

      const result = await response.json()
      set({ templates: result.data || [], templatesLoading: false })
    } catch (error) {
      set({
        templatesError: error instanceof Error ? error.message : 'Unknown error',
        templatesLoading: false
      })
    }
  },

  fetchTemplate: async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/ai-documents/templates/${id}`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch template')
      }

      const result = await response.json()
      return result.data
    } catch (error) {
      set({
        templatesError: error instanceof Error ? error.message : 'Unknown error'
      })
      return null
    }
  },

  createTemplate: async (template) => {
    try {
      const response = await fetch(`${API_URL}/ai-documents/templates`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(template),
      })

      if (!response.ok) {
        throw new Error('Failed to create template')
      }

      const result = await response.json()
      set((state) => ({
        templates: [result.data, ...state.templates],
      }))
    } catch (error) {
      set({
        templatesError: error instanceof Error ? error.message : 'Unknown error'
      })
      throw error
    }
  },

  updateTemplate: async (id, template) => {
    try {
      const response = await fetch(`${API_URL}/ai-documents/templates/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(template),
      })

      if (!response.ok) {
        throw new Error('Failed to update template')
      }

      set((state) => ({
        templates: state.templates.map((t) =>
          t.id === id ? { ...t, ...template } : t
        ),
      }))
    } catch (error) {
      set({
        templatesError: error instanceof Error ? error.message : 'Unknown error'
      })
      throw error
    }
  },

  deleteTemplate: async (id) => {
    try {
      const response = await fetch(`${API_URL}/ai-documents/templates/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error('Failed to delete template')
      }

      set((state) => ({
        templates: state.templates.filter((t) => t.id !== id),
      }))
    } catch (error) {
      set({
        templatesError: error instanceof Error ? error.message : 'Unknown error'
      })
      throw error
    }
  },

  // Generated Documents
  fetchDocuments: async () => {
    set({ documentsLoading: true, documentsError: null })
    try {
      const response = await fetch(`${API_URL}/ai-documents/generated`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch documents')
      }

      const result = await response.json()
      set({ documents: result.data || [], documentsLoading: false })
    } catch (error) {
      set({
        documentsError: error instanceof Error ? error.message : 'Unknown error',
        documentsLoading: false
      })
    }
  },

  fetchDocument: async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/ai-documents/generated/${id}`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch document')
      }

      const result = await response.json()
      return result.data
    } catch (error) {
      set({
        documentsError: error instanceof Error ? error.message : 'Unknown error'
      })
      return null
    }
  },

  generateDocument: async (data) => {
    try {
      const response = await fetch(`${API_URL}/ai-documents/generated`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to generate document')
      }

      const result = await response.json()
      set((state) => ({
        documents: [result.data, ...state.documents],
      }))
    } catch (error) {
      set({
        documentsError: error instanceof Error ? error.message : 'Unknown error'
      })
      throw error
    }
  },

  updateDocument: async (id, document) => {
    try {
      const response = await fetch(`${API_URL}/ai-documents/generated/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(document),
      })

      if (!response.ok) {
        throw new Error('Failed to update document')
      }

      set((state) => ({
        documents: state.documents.map((d) =>
          d.id === id ? { ...d, ...document } : d
        ),
      }))
    } catch (error) {
      set({
        documentsError: error instanceof Error ? error.message : 'Unknown error'
      })
      throw error
    }
  },

  deleteDocument: async (id) => {
    try {
      const response = await fetch(`${API_URL}/ai-documents/generated/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error('Failed to delete document')
      }

      set((state) => ({
        documents: state.documents.filter((d) => d.id !== id),
      }))
    } catch (error) {
      set({
        documentsError: error instanceof Error ? error.message : 'Unknown error'
      })
      throw error
    }
  },

  // Document Analysis
  fetchAnalyses: async () => {
    set({ analysesLoading: true, analysesError: null })
    try {
      const response = await fetch(`${API_URL}/ai-documents/analyses`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch analyses')
      }

      const result = await response.json()
      set({ analyses: result.data || [], analysesLoading: false })
    } catch (error) {
      set({
        analysesError: error instanceof Error ? error.message : 'Unknown error',
        analysesLoading: false
      })
    }
  },

  fetchAnalysis: async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/ai-documents/analyses/${id}`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch analysis')
      }

      const result = await response.json()
      return result.data
    } catch (error) {
      set({
        analysesError: error instanceof Error ? error.message : 'Unknown error'
      })
      return null
    }
  },

  analyzeDocument: async (data) => {
    try {
      const payload = {
        ...data,
        documentId: data.documentId ? String(data.documentId) : "",
        analysisType: 'compliance' // Default analysis type
      }

      const response = await fetch(`${API_URL}/ai-documents/analyses`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to analyze document')
      }

      const result = await response.json()
      set((state) => ({
        analyses: [result.data, ...state.analyses],
      }))
    } catch (error) {
      set({
        analysesError: error instanceof Error ? error.message : 'Unknown error'
      })
      throw error
    }
  },

  deleteAnalysis: async (id) => {
    try {
      const response = await fetch(`${API_URL}/ai-documents/analyses/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error('Failed to delete analysis')
      }

      set((state) => ({
        analyses: state.analyses.filter((a) => a.id !== id),
      }))
    } catch (error) {
      set({
        analysesError: error instanceof Error ? error.message : 'Unknown error'
      })
      throw error
    }
  },
}))
