---
title: 'Bab 7 — Server Components vs Client Components'
---

# Bab 7 — Server Components vs Client Components

## 7.1 🖥️ Server Components — Default di App Router

```tsx
// app/blog/page.tsx
// Tidak ada 'use client' → ini adalah Server Component

// ✅ Server Component BISA:
// - async/await langsung di komponen
// - Akses database, file system, environment variables
// - Fetch data tanpa expose ke browser
// - Akses backend resources langsung

import { prisma } from '@/lib/db'

async function BlogPage() {
  // Ini berjalan di server — user tidak bisa lihat query ini
  const posts = await prisma.post.findMany({
    where:   { published: true },
    orderBy: { createdAt: 'desc' },
    include: { author: true, category: true },
  })

  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>Oleh: {post.author.name}</p>
        </article>
      ))}
    </div>
  )
}

// ❌ Server Component TIDAK BISA:
// - useState, useEffect, useRef, useContext
// - onClick, onChange, dan event handlers lain
// - window, document, localStorage
// - Hooks React lainnya
```

---

## 7.2 💻 Client Components — Saat Butuh Interaktivitas

```tsx
// components/SearchBar.tsx
'use client' // ← Directive ini WAJIB untuk Client Component

// ✅ Client Component BISA:
// - useState, useEffect, dan semua hooks React
// - Event handlers (onClick, onChange, dll)
// - Browser APIs (window, localStorage, dll)
// - Real-time updates

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchBar() {
  const [keyword, setKeyword]         = useState('')
  const [isPending, startTransition]  = useTransition()
  const router                        = useRouter()

  function handleSearch(value: string) {
    setKeyword(value)
    startTransition(() => {
      router.push(`/blog?q=${value}`)
    })
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={keyword}
        onChange={e => handleSearch(e.target.value)}
        placeholder="Cari artikel..."
        className="w-full px-4 py-2 border rounded-lg"
      />
      {isPending && <span className="absolute right-3 top-3">⏳</span>}
    </div>
  )
}
```

---

## 7.3 🎯 Strategi: Kapan Pakai Yang Mana?

```
Butuh data dari database?          → Server Component
Butuh API key yang sensitif?       → Server Component
Tidak ada interaktivitas?          → Server Component (lebih efisien)
Konten statis / SEO penting?       → Server Component

Butuh useState / useEffect?        → Client Component
Butuh event handler (onClick)?     → Client Component
Butuh akses browser API?           → Client Component
Butuh real-time updates?           → Client Component
```

---

## 7.4 🪆 Komposisi Server & Client Component

```tsx
// ✅ POLA YANG BENAR:
// Server Component sebagai wrapper, Client Component di dalam

// app/blog/page.tsx (Server Component)
import BlogList    from '@/components/BlogList'    // Server Component
import SearchBar   from '@/components/SearchBar'   // Client Component
import LikeButton  from '@/components/LikeButton'  // Client Component

async function BlogPage() {
  const posts = await prisma.post.findMany() // Di server

  return (
    <div>
      {/* Client Component menerima data dari server via props */}
      <SearchBar />

      {/* Server Component — render di server */}
      <BlogList posts={posts} />
    </div>
  )
}

// ❌ POLA YANG SALAH:
// Jangan import Server Component di dalam Client Component!
'use client'
import ServerComponent from './ServerComponent' // ❌ Akan jadi Client Component!
```
