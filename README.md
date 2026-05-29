# KampusCuan — Frontend (Next.js)

Frontend untuk aplikasi **KampusCuan**, platform manajemen keuangan pribadi mahasiswa berbasis AI. Menggunakan design system bertema "Neon Brutalist" yang elegan.

## 🚀 Tech Stack Utama

- **Framework:** Next.js 16 (App Router)
- **Bahasa:** TypeScript 5+
- **Styling:** Tailwind CSS 3+ & Shadcn/ui
- **State Management:** Zustand (Client) & TanStack Query v5 (Server)
- **Autentikasi:** NextAuth.js (Auth.js v5)
- **Validasi:** Zod + React Hook Form

## 📂 Struktur Direktori Utama

- `/src/app/` — Routing halaman (Dashboard, Transaksi, Budgeting, Tabungan, Split Bill, dll)
- `/src/components/` — Komponen UI Reusable (layout, primitives *Shadcn*, dan komponen spesifik fitur)
- `/src/hooks/` — Custom hooks untuk bridging logika aplikasi
- `/src/lib/` — Utilitas Global (API, Config NextAuth, Formatters)
- `/src/store/` — State stores dari Zustand
- `/src/types/` — Definisi tipe atau interface TypeScript
- `/src/validators/` — Skema validasi form bersama (menggunakan Zod)

## 🛠️ Panduan Memulai (Development)

1. **Install dependencies:**
   ```bash
   npm install
   # atau yarn install / pnpm install / bun install
   ```
2. **Setup environment variables:**
   Buat salinan file `.env.local` (merujuk ke `.env.example` bila ada) dan lengkapi auth secrets serta routing url-nya.
3. **Jalankan development server:**
   ```bash
   npm run dev
   ```
4. Buka pratinjau di browser melalui [http://localhost:3000](http://localhost:3000).

> ⚠️ Sumber kebenaran arsitektur, UI/UX guidelines, dan spesifikasi fitur secara keseluruhan dapat dilihat merujuk pada file [PRD Utama KampusCuan](../AI-Engineer/PRD.md).