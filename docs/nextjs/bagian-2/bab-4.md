---
title: 'Bab 4 — File Convention & Routing System'
---

# Bab 4 — File Convention & Routing System

## 4.1 📄 File Convention — File Khusus Next.js

Di App Router, setiap file dengan nama tertentu punya fungsi khusus:

```
app/
├── layout.tsx      ← Wraps semua halaman di dalam folder ini
├── page.tsx        ← ⭐ Konten halaman — INI yang jadi halaman!
├── loading.tsx     ← Tampil otomatis saat page sedang load
├── error.tsx       ← Tampil otomatis saat ada error
├── not-found.tsx   ← Tampil saat notFound() dipanggil
├── template.tsx    ← Seperti layout tapi re-mount setiap navigasi
├── default.tsx     ← Fallback untuk Parallel Routes
└── route.ts        ← API endpoint (bukan halaman!)
```

---

## 4.2 🛣️ Jenis-jenis Route

```
STATIC ROUTE
app/about/page.tsx          → /about
app/contact/page.tsx        → /contact
app/blog/page.tsx           → /blog

DYNAMIC ROUTE
app/blog/[slug]/page.tsx    → /blog/apa-saja
app/user/[id]/page.tsx      → /user/123

CATCH-ALL ROUTE
app/docs/[...slug]/page.tsx → /docs/apa/saja/seberapa/dalam

OPTIONAL CATCH-ALL
app/[[...slug]]/page.tsx    → / DAN /apa/saja

ROUTE GROUPS (tidak mempengaruhi URL!)
app/(marketing)/page.tsx    → /        (bukan /marketing)
app/(marketing)/about/page.tsx → /about
app/(dashboard)/settings/page.tsx → /settings

PARALLEL ROUTES
app/@modal/page.tsx         → Render bersamaan dengan page utama

INTERCEPTING ROUTES
app/blog/(..)photo/page.tsx → Intercept navigasi ke /photo
```

---

## 4.3 🔗 Dynamic Routes — Detail

```tsx
// app/blog/[slug]/page.tsx

// Params diterima via props
interface Props {
  params: { slug: string }
  searchParams: { [key: string]: string | undefined }
}

export default async function BlogDetailPage({ params, searchParams }: Props) {
  const { slug } = params
  // URL: /blog/cara-belajar-nextjs → slug = "cara-belajar-nextjs"

  const post = await prisma.post.findUnique({
    where: { slug }
  })

  if (!post) {
    notFound() // Tampilkan halaman not-found.tsx
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  )
}

// Generate static paths saat build time (untuk SSG)
export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    select: { slug: true }
  })

  return posts.map(post => ({ slug: post.slug }))
}
```

---

## 4.4 🔍 Search Params — Query String

```tsx
// URL: /blog?page=2&kategori=tutorial&q=nextjs
// app/blog/page.tsx

interface Props {
  searchParams: {
    page?:      string
    kategori?:  string
    q?:         string
  }
}

export default async function BlogPage({ searchParams }: Props) {
  const halaman  = Number(searchParams.page ?? '1')
  const kategori = searchParams.kategori
  const keyword  = searchParams.q

  const posts = await prisma.post.findMany({
    where: {
      ...(kategori && { category: { slug: kategori } }),
      ...(keyword  && { title: { contains: keyword, mode: 'insensitive' } }),
      published: true,
    },
    skip:  (halaman - 1) * 10,
    take:  10,
    orderBy: { createdAt: 'desc' },
  })

  return <PostList posts={posts} />
}
```
