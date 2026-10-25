---
title: 'Bab 8 — SSR, SSG, ISR — Strategi Rendering'
---

# Bab 8 — SSR, SSG, ISR — Strategi Rendering

## 8.1 🔄 SSR — Server-Side Rendering

HTML dibuat di server **setiap kali ada request**.
Cocok untuk konten yang sering berubah atau personal.

```tsx
// app/dashboard/page.tsx
// SSR: Data selalu fresh setiap request

import { cookies, headers } from 'next/headers'

async function DashboardPage() {
  // Akses request-specific data → otomatis SSR
  const cookieStore = cookies()
  const token       = cookieStore.get('token')

  const stats = await fetch('https://api.example.com/stats', {
    cache: 'no-store',  // ← Jangan cache → SSR setiap request
    headers: { Authorization: `Bearer ${token?.value}` }
  })

  const data = await stats.json()

  return <Dashboard data={data} />
}
```

---

## 8.2 🏗️ SSG — Static Site Generation

HTML dibuat **saat build time** — sangat cepat, cocok untuk blog!

```tsx
// app/blog/[slug]/page.tsx
// SSG: Build semua halaman saat npm run build

// Ini memberitahu Next.js halaman mana yang harus di-build
export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    select: { slug: true },
    where:  { published: true },
  })

  return posts.map(post => ({ slug: post.slug }))
  // Next.js akan build: /blog/post-1, /blog/post-2, dst.
}

async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug }
  })

  // Data di-fetch saat BUILD, bukan saat request!
  return <PostContent post={post} />
}
```

---

## 8.3 ⚡ ISR — Incremental Static Regeneration

Gabungan SSG + SSR — build waktu pertama, **regenerasi otomatis** setelah interval tertentu.
**Ini yang paling cocok untuk blog!**

```tsx
// app/blog/page.tsx

async function BlogPage() {
  const posts = await fetch('https://api.example.com/posts', {
    next: {
      revalidate: 3600, // ← Regenerasi setiap 1 jam (3600 detik)
    }
  })

  // Atau dengan Prisma — gunakan revalidatePath / revalidateTag
  const posts2 = await prisma.post.findMany()

  return <PostList posts={posts2} />
}

// Revalidasi on-demand saat post baru dibuat
import { revalidatePath, revalidateTag } from 'next/cache'

async function buatPost(data: PostData) {
  await prisma.post.create({ data })
  revalidatePath('/blog')        // Refresh halaman /blog
  revalidatePath('/blog/[slug]', 'page') // Refresh semua detail post
  revalidateTag('posts')          // Refresh semua fetch dengan tag 'posts'
}
```

---

## 8.4 📊 Kapan Pakai Strategi Mana?

| Strategi | Kapan | Contoh |
|---|---|---|
| **SSG** | Konten jarang berubah, SEO penting | Halaman statis, docs |
| **ISR** | Konten berubah tapi tidak real-time | Blog, e-commerce catalog |
| **SSR** | Konten personal atau selalu fresh | Dashboard, profil user |
| **CSR** | Konten tidak perlu SEO, sangat dinamis | Chat, live dashboard |
