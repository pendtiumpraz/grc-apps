/**
 * Store Factory Template
 * 
 * Gunakan template ini untuk membuat store baru yang sudah memiliki:
 * - CRUD operations
 * - Trash/Deleted items
 * - Restore functionality
 * - Permanent delete
 * 
 * Copy dan modifikasi sesuai kebutuhan module.
 */

import { create } from 'zustand'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    }
}

// Generic API helper
export const createApiClient = (baseEndpoint: string) => ({
    getAll: async () => {
        const response = await fetch(`${API_URL}${baseEndpoint}`, {
            headers: getAuthHeaders(),
        })
        return response.json()
    },

    getById: async (id: string | number) => {
        const response = await fetch(`${API_URL}${baseEndpoint}/${id}`, {
            headers: getAuthHeaders(),
        })
        return response.json()
    },

    create: async (data: any) => {
        const response = await fetch(`${API_URL}${baseEndpoint}`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        })
        return response.json()
    },

    update: async (id: string | number, data: any) => {
        const response = await fetch(`${API_URL}${baseEndpoint}/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        })
        return response.json()
    },

    delete: async (id: string | number) => {
        const response = await fetch(`${API_URL}${baseEndpoint}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        })
        return response.json()
    },

    getDeleted: async () => {
        const response = await fetch(`${API_URL}${baseEndpoint}/deleted`, {
            headers: getAuthHeaders(),
        })
        return response.json()
    },

    restore: async (id: string | number) => {
        const response = await fetch(`${API_URL}${baseEndpoint}/${id}/restore`, {
            method: 'POST',
            headers: getAuthHeaders(),
        })
        return response.json()
    },

    permanentDelete: async (id: string | number) => {
        const response = await fetch(`${API_URL}${baseEndpoint}/${id}/permanent`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        })
        return response.json()
    },
})

// Base interface for items with soft delete
export interface BaseItem {
    id: number | string
    created_at?: string
    updated_at?: string
    deleted_at?: string
    is_deleted?: boolean
}

// Generic store state
export interface CrudStoreState<T extends BaseItem> {
    items: T[]
    deletedItems: T[]
    loading: boolean
    error: string | null

    // Actions
    setItems: (items: T[]) => void
    setDeletedItems: (items: T[]) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    addItem: (item: T) => void
    updateItem: (id: string | number, data: Partial<T>) => void
    removeItem: (id: string | number) => void
}

// Factory function to create a CRUD store
export function createCrudStore<T extends BaseItem>(initialItems: T[] = []) {
    return create<CrudStoreState<T>>((set) => ({
        items: initialItems,
        deletedItems: [],
        loading: false,
        error: null,

        setItems: (items) => set({ items }),
        setDeletedItems: (deletedItems) => set({ deletedItems }),
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),

        addItem: (item) => set((state) => ({
            items: [item, ...state.items]
        })),

        updateItem: (id, data) => set((state) => ({
            items: state.items.map((item) =>
                item.id === id ? { ...item, ...data } : item
            ),
        })),

        removeItem: (id) => set((state) => ({
            items: state.items.filter((item) => item.id !== id),
        })),
    }))
}
