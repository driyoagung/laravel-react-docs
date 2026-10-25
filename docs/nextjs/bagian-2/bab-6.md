---
title: 'Bab 6 — Navigasi & Link'
---

# Bab 6 — Navigasi & Link

## 6.1 🔗 Komponen `<Link>` — Navigasi Client-Side

```tsx
import Link from 'next/link'

// Link dasar — prefetch otomatis saat muncul di viewport!
<Link href="/blog">Blog</Link>

// Link dengan dynamic route
<Link href={`/blog/${post.slug}`}>
  {post.title}
</Link>

// Link dengan query params
<Link href={{ pathname: '/blog', query: { kategori: 'tutorial', page: 2 } }}>
  Tutorial — Halaman 2
</Link>
// Menghasilkan: /blog?kategori=tutorial&page=2

// Link dengan opsi tambahan
<Link
  href="/blog"
  prefetch={false}        // Nonaktifkan prefetch
  replace                 // Replace history, bukan push
  scroll={false}          // Jangan scroll ke atas saat navigasi
>
  Blog
</Link>

// Active link — cek dengan usePathname()
'use client'
import { usePathname } from 'next/navigation'

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(href + '/')

  return (
    <Link
      href={href}
      className={isActive ? 'font-bold text-blue-600' : 'text-gray-600'}
    >
      {children}
    </Link>
  )
}
```

---

## 6.2 🧭 Navigasi Programmatic

```tsx
'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

function SearchForm() {
  const router        = useRouter()
  const pathname      = usePathname()       // URL saat ini tanpa query
  const searchParams  = useSearchParams()   // Query params saat ini

  function handleSearch(keyword: string) {
    const params = new URLSearchParams(searchParams)

    if (keyword) {
      params.set('q', keyword)
    } else {
      params.delete('q')
    }

    // Navigasi ke URL baru
    router.push(`${pathname}?${params.toString()}`)

    // Atau replace (tidak tambah history)
    // router.replace(`${pathname}?${params.toString()}`)
  }

  function kembali() {
    router.back()   // Kembali ke halaman sebelumnya
    router.forward() // Maju ke halaman berikutnya
    router.refresh() // Refresh data server component
  }

  return <input onChange={e => handleSearch(e.target.value)} />
}
```
