'use client'

import Swal from 'sweetalert2'

// Custom theme for dark mode
const darkTheme = {
    background: '#1f2937',
    color: '#f3f4f6',
    confirmButtonColor: '#0891b2',
    cancelButtonColor: '#6b7280',
    iconColor: '#0891b2',
}

// Confirm Delete Dialog
export const confirmDelete = async (itemName: string = 'item ini') => {
    const result = await Swal.fire({
        title: 'Hapus Item?',
        html: `<p style="color: #9ca3af">Anda yakin ingin menghapus <strong style="color: #f87171">${itemName}</strong>?</p>
           <p style="color: #6b7280; font-size: 0.875rem; margin-top: 8px">Item akan dipindahkan ke Trash dan bisa di-restore.</p>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal',
        ...darkTheme,
        customClass: {
            popup: 'rounded-xl border border-gray-700',
            title: 'text-white',
            confirmButton: 'rounded-lg px-4 py-2',
            cancelButton: 'rounded-lg px-4 py-2',
        }
    })
    return result.isConfirmed
}

// Confirm Permanent Delete Dialog
export const confirmPermanentDelete = async (itemName: string = 'item ini') => {
    const result = await Swal.fire({
        title: 'Hapus Permanen?',
        html: `<p style="color: #9ca3af">Anda yakin ingin menghapus <strong style="color: #f87171">${itemName}</strong> secara permanen?</p>
           <p style="color: #ef4444; font-size: 0.875rem; margin-top: 8px">⚠️ Tindakan ini tidak dapat dibatalkan!</p>`,
        icon: 'error',
        showCancelButton: true,
        confirmButtonText: 'Ya, Hapus Permanen',
        cancelButtonText: 'Batal',
        ...darkTheme,
        confirmButtonColor: '#dc2626',
        customClass: {
            popup: 'rounded-xl border border-red-700',
            title: 'text-white',
            confirmButton: 'rounded-lg px-4 py-2 bg-red-600 hover:bg-red-700',
            cancelButton: 'rounded-lg px-4 py-2',
        }
    })
    return result.isConfirmed
}

// Confirm Restore Dialog
export const confirmRestore = async (itemName: string = 'item ini') => {
    const result = await Swal.fire({
        title: 'Restore Item?',
        html: `<p style="color: #9ca3af">Anda yakin ingin me-restore <strong style="color: #34d399">${itemName}</strong>?</p>
           <p style="color: #6b7280; font-size: 0.875rem; margin-top: 8px">Item akan dikembalikan ke daftar aktif.</p>`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Ya, Restore',
        cancelButtonText: 'Batal',
        ...darkTheme,
        confirmButtonColor: '#10b981',
        customClass: {
            popup: 'rounded-xl border border-green-700',
            title: 'text-white',
            confirmButton: 'rounded-lg px-4 py-2 bg-green-600 hover:bg-green-700',
            cancelButton: 'rounded-lg px-4 py-2',
        }
    })
    return result.isConfirmed
}

// Success Toast
export const showSuccess = (message: string) => {
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#065f46',
        color: '#d1fae5',
        iconColor: '#34d399',
    })
}

// Error Toast
export const showError = (message: string) => {
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: message,
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        background: '#7f1d1d',
        color: '#fecaca',
        iconColor: '#f87171',
    })
}

// Info Toast
export const showInfo = (message: string) => {
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#1e3a5f',
        color: '#bfdbfe',
        iconColor: '#60a5fa',
    })
}

// Loading Dialog
export const showLoading = (message: string = 'Memproses...') => {
    Swal.fire({
        title: message,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        ...darkTheme,
        didOpen: () => {
            Swal.showLoading()
        },
    })
}

// Close Loading
export const closeLoading = () => {
    Swal.close()
}

export default Swal
