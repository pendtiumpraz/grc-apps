# PANDUAN PERBAIKAN & RESTART SERVER (REQUIRED)

Sistem Anda mengalami error "Failed to fetch" pada fitur Document Generator dan Analyzer.
Ini dikarenakan perubahan pada Backend API (Struct Validation & Query) yang **belum aktif** karena server Backend Go belum di-restart.

Silakan lakukan langkah berikut di terminal:

## 1. Restart Backend Server
(Di terminal tempat backend `go run` berjalan)
1. Tekan `Ctrl+C` untuk mematikan server.
2. Jalankan ulang perintah start:
   ```bash
   go run cmd/server/main.go
   ```
   Atau jika menggunakan command lain, jalankan kembali command tersebut.

## 2. Restart Frontend (Opsional)
Biasanya Frontend Next.js melakukan hot-reload, tapi jika masih bermasalah:
1. Matikan `npm run dev`.
2. Jalankan ulang `npm run dev`.

## 3. Verify Fixes
Setelah restart:
1. Buka halaman **AI Document Analyzer**.
2. Upload dokumen PDF/DOCX.
3. Klik "Analyze".
4. Harusnya tidak lagi muncul "Failed to fetch" atau error lainnya.

## Perubahan yang telah dilakukan:
- **Backend**: API `AnalyzeDocument` sekarang menerima upload langsung tanpa `DocumentID` (dibuat otomatis).
- **Backend**: Fix `GetDocumentTemplates` untuk memfilter template yang benar.
- **Frontend**: Store `useAIDocumentStore` direfactor untuk menggunakan URL dinamis dan format payload yang benar.
- **Frontend**: Perbaikan Sidebar auto-expand.
- **Frontend**: Fix crash pada halaman RoPA.
