---
title: 'Bab 21 — Project: Blog CMS dengan Next.js 14'
---

# Bab 21 — Project: Blog CMS dengan Next.js 14

## 21.1 🎯 Fitur yang Akan Dibangun

| Fitur | Teknologi |
|---|---|
| ✅ Halaman utama dengan featured posts | Server Components + Prisma |
| ✅ Daftar artikel dengan filter & search | SearchParams + Prisma |
| ✅ Detail artikel dengan MDX support | next-mdx-remote |
| ✅ Sitemap & robots.txt otomatis | Next.js built-in |
| ✅ SEO per halaman dengan OpenGraph | generateMetadata |
| ✅ Login Google + Email/Password | NextAuth.js |
| ✅ Dashboard penulis — CRUD artikel | Server Actions |
| ✅ Upload cover image | UploadThing / Cloudinary |
| ✅ Kategori & tag artikel | Prisma relations |
| ✅ Bookmark artikel (disimpan lokal) | Zustand + localStorage |
| ✅ Dark/Light mode | next-themes |
| ✅ Halaman admin — manage semua user | Role-based access |
| ✅ ISR — konten fresh tanpa rebuild penuh | revalidateTag |
| ✅ Deploy ke Vercel + Neon DB | Vercel + PostgreSQL |

---

## 21.2 📁 Struktur Project Final

```
blog-cms/
│
├── app/
│   ├── (public)/              ← Route group: halaman publik
│   │   ├── layout.tsx         ← Layout dengan Navbar & Footer
│   │   ├── page.tsx           ← Homepage: /
│   │   ├── blog/
│   │   │   ├── page.tsx       ← Daftar artikel: /blog
│   │   │   └── [slug]/
│   │   │       └── page.tsx   ← Detail artikel: /blog/:slug
│   │   └── kategori/
│   │       └── [slug]/
│   │           └── page.tsx   ← Artikel per kategori
│   │
│   ├── (auth)/                ← Route group: halaman auth
│   │   ├── login/page.tsx     ← /login
│   │   └── register/page.tsx  ← /register
│   │
│   ├── dashboard/             ← Area penulis (perlu login)
│   │   ├── layout.tsx         ← Layout dengan Sidebar
│   │   ├── page.tsx           ← Dashboard overview
│   │   ├── posts/
│   │   │   ├── page.tsx       ← Daftar post saya
│   │   │   ├── new/page.tsx   ← Buat post baru
│   │   │   └── [id]/
│   │   │       └── edit/page.tsx ← Edit post
│   │   └── profile/page.tsx   ← Edit profil
│   │
│   ├── admin/                 ← Area admin (perlu role ADMIN)
│   │   ├── layout.tsx
│   │   ├── page.tsx           ← Admin overview
│   │   ├── users/page.tsx     ← Manage users
│   │   └── posts/page.tsx     ← Manage semua posts
│   │
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── posts/route.ts
│       ├── posts/[id]/route.ts
│       └── upload/route.ts
│
├── actions/
│   ├── post.actions.ts        ← CRUD post
│   ├── auth.actions.ts        ← Register, update profile
│   └── admin.actions.ts       ← Admin actions
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   ├── blog/
│   │   ├── PostCard.tsx
│   │   ├── PostList.tsx
│   │   ├── PostContent.tsx    ← Render MDX
│   │   ├── PostForm.tsx       ← Form buat/edit post
│   │   └── CategoryBadge.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Skeleton.tsx
│       └── ThemeToggle.tsx
│
├── lib/
│   ├── db.ts                  ← Prisma client singleton
│   ├── auth.ts                ← NextAuth config
│   ├── utils.ts               ← Helper: slugify, formatDate, dll
│   └── validations.ts         ← Zod schemas
│
├── stores/
│   └── useBookmarkStore.ts    ← Zustand bookmark state
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts                ← Data awal
│
└── middleware.ts              ← Proteksi route
```

---

## 21.3 🚀 Urutan Build Step by Step

```
Step 1 ─── Setup & Database
           ├── Create Next.js project
           ├── Setup Prisma + schema
           ├── Setup NextAuth
           └── Seed data awal

Step 2 ─── Public Pages (SSG/ISR)
           ├── Homepage dengan featured posts
           ├── Halaman /blog dengan search & filter
           ├── Halaman detail /blog/[slug]
           └── Halaman kategori

Step 3 ─── SEO & Performance
           ├── generateMetadata per halaman
           ├── sitemap.ts & robots.ts
           ├── Optimasi gambar dengan <Image>
           └── Loading skeleton UI

Step 4 ─── Auth Pages
           ├── Halaman login (Google + Credentials)
           ├── Halaman register
           └── Middleware proteksi route

Step 5 ─── Dashboard (Server Actions)
           ├── Form buat artikel
           ├── Form edit artikel
           ├── Hapus artikel
           └── Upload cover image

Step 6 ─── Admin Panel
           ├── Daftar semua user
           ├── Manage semua artikel
           └── Role-based protection

Step 7 ─── Polish & Deploy
           ├── Dark/Light mode
           ├── Error boundaries
           ├── ISR configuration
           └── Deploy ke Vercel + Neon DB
```
