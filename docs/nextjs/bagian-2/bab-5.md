---
title: 'Bab 5 — Layouts, Loading & Error UI'
---

# Bab 5 — Layouts, Loading & Error UI

## 5.1 🖼️ Layout — Shared UI Antar Halaman

```tsx
// app/layout.tsx — ROOT LAYOUT (wajib ada!)
// Wraps SEMUA halaman di aplikasi

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

// Metadata untuk SEO — berlaku di semua halaman
export const metadata: Metadata = {
  title: {
    default:  'Blog CMS',
    template: '%s | Blog CMS', // Setiap halaman bisa override %s
  },
  description: 'Platform blog modern dengan Next.js',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

```tsx
// app/dashboard/layout.tsx — NESTED LAYOUT
// Hanya untuk halaman di dalam /dashboard

import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import Sidebar from '@/components/dashboard/Sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  // Proteksi route — redirect jika belum login
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  )
}
```

---

## 5.2 ⏳ Loading UI — Automatic Loading State

```tsx
// app/blog/loading.tsx
// Tampil OTOMATIS saat page.tsx sedang fetch data

export default function BlogLoading() {
  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Skeleton loader */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-200 h-48 rounded-lg mb-3" />
          <div className="bg-gray-200 h-4 rounded mb-2" />
          <div className="bg-gray-200 h-4 w-2/3 rounded" />
        </div>
      ))}
    </div>
  )
}
```

---

## 5.3 🚨 Error UI — Automatic Error Handling

```tsx
// app/blog/error.tsx
// Tampil OTOMATIS saat ada error di page.tsx
// Harus 'use client' karena pakai event handler

'use client'

import { useEffect } from 'react'

export default function BlogError({
  error,
  reset, // Fungsi untuk coba load ulang
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error ke monitoring service (Sentry, dll)
    console.error(error)
  }, [error])

  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        Terjadi Kesalahan
      </h2>
      <p className="text-gray-600 mb-6">{error.message}</p>
      <button
        onClick={reset}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg"
      >
        Coba Lagi
      </button>
    </div>
  )
}
```
