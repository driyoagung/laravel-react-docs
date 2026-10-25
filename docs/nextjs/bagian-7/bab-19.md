---
title: 'Bab 19 — Caching, Suspense & Streaming'
---

# Bab 19 — Caching, Suspense & Streaming

## 19.1 💨 Streaming dengan Suspense

```tsx
// Streaming: tampilkan konten yang sudah siap duluan
// Konten lambat muncul setelah siap — tidak blokir render!

import { Suspense } from 'react'

async function BlogPage() {
  return (
    <div>
      {/* Hero langsung tampil */}
      <HeroBanner />

      {/* PostList ditampilkan streaming — muncul saat data siap */}
      <Suspense fallback={<PostsSkeleton />}>
        <PostList />    {/* Ini async — fetch data dari DB */}
      </Suspense>

      {/* Sidebar tampil paralel dengan PostList */}
      <Suspense fallback={<SidebarSkeleton />}>
        <PopularPosts />
      </Suspense>
    </div>
  )
}
```

---

## 19.2 🔄 Request Memoization & Data Cache

```typescript
// Next.js otomatis memoize fetch() yang sama dalam satu request
// Tidak perlu React Query / SWR untuk Server Components!

// Ini dipanggil di dua tempat berbeda, tapi hanya SATU request ke database!
async function getUser(id: string) {
  return await prisma.user.findUnique({ where: { id } })
  // Jika dipanggil dua kali dengan id yang sama dalam satu render → hanya 1 query!
}

// Untuk fungsi non-fetch, gunakan cache() dari React
import { cache } from 'react'

const getPost = cache(async (slug: string) => {
  return await prisma.post.findUnique({ where: { slug } })
})
// Sekarang getPost('same-slug') hanya query ke DB sekali per request
```
