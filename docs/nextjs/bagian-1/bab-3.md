---
title: 'Bab 3 — Perbedaan Konsep: React vs Next.js'
---

# Bab 3 — Perbedaan Konsep: React vs Next.js

Ini adalah bab yang **paling penting** di Bagian I. Anda perlu memahami pergeseran mental model dari React ke Next.js sebelum melanjutkan ke bab-bab berikutnya.

---

## 🔄 3.1 Cara Fetch Data yang Berubah Total

Perbedaan paling terasa saat pindah dari React ke Next.js adalah **cara mengambil data**. Di React, kita terbiasa dengan `useEffect`. Di Next.js, cara itu sudah tidak perlu lagi untuk kebanyakan kasus.

Mari bandingkan langsung:

```tsx
// ===== ❌ CARA REACT (yang biasa Anda lakukan) =====
// components/BlogList.tsx

import { useState, useEffect } from 'react'

function BlogList() {
  const [posts, setPosts]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    // Fetch terjadi di BROWSER setelah halaman dimuat
    // User melihat halaman kosong dulu → lalu data muncul
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])  // [] = hanya jalan sekali saat komponen pertama muncul

  if (loading) return <div>⏳ Loading...</div>
  if (error)   return <div>❌ Error: {error}</div>

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

**Masalah dengan pendekatan React di atas:**

- 🐌 User melihat halaman kosong/loading dulu baru konten muncul
- 🔍 Search engine (Google) mungkin tidak bisa baca konten (SEO buruk)
- 🔄 Perlu mengelola 3 state: `data`, `loading`, `error`
- 🌐 Request terjadi dari browser — API key bisa terekspos

```tsx
// ===== ✅ CARA NEXT.JS (Server Component) =====
// app/blog/page.tsx

// Tidak ada 'use client' → ini otomatis Server Component
// Tidak ada useState, tidak ada useEffect!

import { prisma } from '@/lib/db'

async function BlogPage() {
  // Ini berjalan di SERVER sebelum HTML dikirim ke browser
  // User langsung menerima halaman dengan data yang sudah ada!
  const posts = await prisma.post.findMany({
    where:   { published: true },
    orderBy: { createdAt: 'desc' },
  })
  // ↑ Query database langsung — tidak perlu API route terpisah!

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}

export default BlogPage
```

**Keunggulan pendekatan Next.js di atas:**

- ⚡ HTML sudah berisi data saat diterima browser → cepat!
- 🔍 Google bisa baca konten dengan sempurna → SEO baik
- 🧹 Kode lebih bersih — tidak ada state management untuk data fetching
- 🔐 Koneksi database tidak pernah terekspos ke browser

---

## 🧠 3.2 Mental Model Baru: Server vs Browser

Ini adalah perubahan paling fundamental. Di React, **semua komponen berjalan di browser**. Di Next.js App Router, ada dua dunia:

```
┌────────────────────────────────────────────────────────────┐
│                         SERVER                             │
│                                                            │
│   ┌──────────────────────────────────────────────────┐    │
│   │         🖥️ Server Components (DEFAULT)           │    │
│   │                                                  │    │
│   │  ✅ BISA:                                        │    │
│   │     • async/await langsung di komponen           │    │
│   │     • Akses database (prisma.post.findMany())    │    │
│   │     • Baca file system (fs.readFile())           │    │
│   │     • Akses env variables RAHASIA                │    │
│   │     • Fetch ke API eksternal tanpa CORS          │    │
│   │                                                  │    │
│   │  ❌ TIDAK BISA:                                  │    │
│   │     • useState, useEffect, useRef                │    │
│   │     • onClick, onChange (event handlers)         │    │
│   │     • window, document, localStorage             │    │
│   │     • Hook React apapun yang dimulai 'use'       │    │
│   └──────────────────────────────────────────────────┘    │
│                                                            │
│                    Kirim HTML ↓                            │
└────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────┐
│                        BROWSER                             │
│                                                            │
│   ┌──────────────────────────────────────────────────┐    │
│   │    💻 'use client' → Client Components           │    │
│   │                                                  │    │
│   │  ✅ BISA:                                        │    │
│   │     • useState, useEffect, semua hooks React     │    │
│   │     • Event handlers (onClick, onChange, dll)    │    │
│   │     • window, document, localStorage             │    │
│   │     • Real-time updates, animasi interaktif      │    │
│   │                                                  │    │
│   │  ❌ TIDAK BISA:                                  │    │
│   │     • Akses database langsung                    │    │
│   │     • Akses env variables rahasia                │    │
│   │     • async di level komponen (tanpa workaround) │    │
│   └──────────────────────────────────────────────────┘    │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

> 💡 **Analoginya:** Server Component adalah dapur restoran — bekerja di belakang layar, bisa mengakses semua bahan mentah (database, file, API key). Client Component adalah meja tamu — bisa berinteraksi dengan tamu (user), tapi tidak bisa langsung masuk ke dapur.

---

## 📋 3.3 Tabel Perubahan Konsep Lengkap

Berikut ringkasan perubahan dari React ke Next.js App Router:

| Konsep | React (Sebelumnya) | Next.js App Router (Sekarang) | Catatan |
| --- | --- | --- | --- |
| Fetch data | `useEffect` + `fetch()` | `async/await` di Server Component | Lebih bersih, lebih cepat |
| State loading | `useState(true/false)` | File `loading.tsx` | Otomatis! |
| Routing | `<Route>` dari React Router | Struktur folder/file | File = halaman |
| Error handling | Error boundary manual | File `error.tsx` | Otomatis! |
| SEO / meta | `react-helmet` package | `export const metadata` | Built-in |
| Halaman 404 | Route khusus | File `not-found.tsx` | Built-in |
| Backend/API | Server terpisah (Express) | `route.ts` + Server Actions | Dalam satu project |
| Navigasi kode | `useNavigate()` dari `react-router-dom` | `useRouter()` dari `next/navigation` | **Beda import!** |
| Gambar | `<img>` HTML biasa | `<Image>` dari `next/image` | Auto-optimasi |
| Link | `<a>` HTML biasa | `<Link>` dari `next/link` | Auto-prefetch |

---

## 🏗️ 3.4 Studi Kasus: Halaman Blog dengan Kedua Pendekatan

Mari lihat contoh nyata: membuat halaman blog yang menampilkan daftar artikel beserta tombol "Suka" yang interaktif.

```tsx
// ✅ PENDEKATAN NEXT.JS yang BENAR
// Pisahkan logika server dan client secara cerdas

// app/blog/page.tsx  ← SERVER COMPONENT
import { prisma }      from '@/lib/db'
import LikeButton      from '@/components/LikeButton' // Client Component

async function BlogPage() {
  // Fetch di server — cepat, aman, SEO-friendly
  const posts = await prisma.post.findMany({
    where:   { published: true },
    include: { _count: { select: { likes: true } } },
  })

  return (
    <div className="grid grid-cols-3 gap-6">
      {posts.map(post => (
        <article key={post.id} className="border rounded-lg p-4">
          {/* Konten statis → Server Component, langsung render */}
          <h2 className="text-xl font-bold">{post.title}</h2>
          <p className="text-gray-600">{post.excerpt}</p>

          {/* Tombol interaktif → Client Component, berjalan di browser */}
          {/* Data (postId, initialLikes) dikirim via props dari server */}
          <LikeButton
            postId={post.id}
            initialLikes={post._count.likes}
          />
        </article>
      ))}
    </div>
  )
}

export default BlogPage
```

```tsx
// components/LikeButton.tsx  ← CLIENT COMPONENT
// Hanya bagian interaktif ini yang perlu 'use client'
'use client'

import { useState } from 'react'

interface Props {
  postId:       string
  initialLikes: number
}

export default function LikeButton({ postId, initialLikes }: Props) {
  const [likes, setLikes]   = useState(initialLikes)
  const [liked, setLiked]   = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleLike() {
    if (liked || loading) return

    setLoading(true)
    // Panggil API untuk simpan like ke database
    await fetch(`/api/posts/${postId}/like`, { method: 'POST' })
    setLikes(prev => prev + 1)
    setLiked(true)
    setLoading(false)
  }

  return (
    <button
      onClick={handleLike}
      disabled={liked || loading}
      className={`mt-3 px-4 py-2 rounded-full transition ${
        liked
          ? 'bg-red-100 text-red-600'
          : 'bg-gray-100 hover:bg-red-50 text-gray-600'
      }`}
    >
      {liked ? '❤️' : '🤍'} {likes} Suka
    </button>
  )
}
```

**Analisis pola di atas:**

- `BlogPage` → Server Component: data di-fetch dari database di server, HTML dikirim sudah berisi konten lengkap
- `LikeButton` → Client Component: hanya bagian yang butuh interaktivitas (klik, state, animasi)
- **Props sebagai jembatan**: data dari server (`postId`, `initialLikes`) dikirim ke client component via props — ini adalah pola yang benar!

---

## ⚠️ 3.5 Kesalahan Umum yang Harus Dihindari

```tsx
// ❌ KESALAHAN #1: Menambahkan 'use client' di semua komponen
// Ini kebiasaan developer React yang harus dihilangkan!
'use client' // ← JANGAN! Komponen ini tidak butuh interaktivitas

async function BlogList() {
  // Sekarang komponen ini TIDAK BISA fetch dari server/DB
  // padahal kita tidak butuh useState/useEffect di sini sama sekali
  const posts = await prisma.post.findMany() // ← INI AKAN ERROR!
  return <div>{/* ... */}</div>
}

// ✅ YANG BENAR: Hapus 'use client' jika tidak butuh browser APIs
async function BlogList() {
  const posts = await prisma.post.findMany() // ← Bekerja dengan sempurna
  return <div>{/* ... */}</div>
}
```

```tsx
// ❌ KESALAHAN #2: Mencoba import Server Component ke dalam Client Component
'use client'
import ServerDataFetcher from './ServerDataFetcher' // ← ERROR!
// Ketika di-import ke Client Component, ServerDataFetcher OTOMATIS
// menjadi Client Component — kehilangan semua keistimewaan server!

// ✅ YANG BENAR: Berikan data via props, bukan import
// Server Component (parent) → ambil data → kirim via props ke Client Component
```

```tsx
// ❌ KESALAHAN #3: Menggunakan 'next/router' (era Pages Router)
import { useRouter } from 'next/router' // ← SALAH untuk App Router!

// ✅ YANG BENAR untuk App Router:
import { useRouter }    from 'next/navigation' // Untuk navigasi
import { usePathname }  from 'next/navigation' // Untuk URL saat ini
import { useSearchParams } from 'next/navigation' // Untuk query string
```

> 📌 **Ringkasan Bagian I:** Anda sekarang sudah memahami fondasi penting: **Next.js adalah framework full-stack** berbeda dari React murni, **App Router** adalah cara modern yang harus dipelajari, dan perbedaan **Server vs Client Component** adalah konsep paling penting untuk dikuasai sebelum melanjutkan. Bagian II akan membahas sistem routing App Router secara mendalam.
