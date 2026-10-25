---
title: 'Bab 1 — Mengenal Next.js & Ekosistemnya'
---

# Bab 1 — Mengenal Next.js & Ekosistemnya

## 🏗️ 1.1 Sejarah & Evolusi Next.js

Next.js lahir pada tahun 2016 yang dibuat oleh tim **Vercel** (dulu bernama Zeit) sebagai solusi untuk masalah-masalah yang sering dihadapi developer React — terutama soal SEO, performa awal halaman, dan routing. Mari kita lihat bagaimana Next.js berkembang dari waktu ke waktu:

```
Next.js 1-9   → Pages Router, SSR dasar
               → Solusi awal: HTML bisa di-render dari server
               → Routing masih berbasis folder pages/

Next.js 10-12 → Image Optimization built-in (<Image>)
               → ISR (Incremental Static Regeneration) — game changer!
               → Middleware untuk intercept request
               → Performa & bundle size yang jauh lebih baik

Next.js 13    → ⭐ App Router diperkenalkan (masih beta)
               → React Server Components pertama kali hadir
               → Konsep Layouts, Loading UI, Error UI otomatis
               → Perubahan paradigma yang BESAR dari Pages Router

Next.js 14    → ✅ App Router dinyatakan STABLE & direkomendasikan
               → Server Actions stable (mutasi data tanpa API!)
               → Partial Prerendering (PPR) — experimental
               → Peningkatan performa build yang signifikan

Next.js 15    → React 19 support
               → Perbaikan sistem caching (lebih predictable)
               → Turbopack sebagai bundler default
```

> 📌 **Catatan Penting:** Ebook ini fokus pada **Next.js 14** dengan **App Router**. Jika Anda pernah melihat tutorial Next.js lama yang menggunakan `getServerSideProps` atau `getStaticProps` — itu adalah era Pages Router yang berbeda caranya. Jangan campur aduk keduanya!

---

## 🌐 1.2 Ekosistem Next.js

Next.js bukan hanya sebuah framework — ia hadir dengan ekosistem yang kaya. Berikut adalah gambaran besar dari apa yang akan kita gunakan:

```
NEXT.JS ECOSYSTEM
│
├── 🧩 Core Framework
│   ├── App Router        → Sistem routing berbasis file & folder
│   ├── Server Components → Komponen yang di-render di server (React 18+)
│   ├── Client Components → Komponen yang di-render di browser
│   ├── Server Actions    → Fungsi server yang dipanggil langsung dari form
│   └── Middleware        → Kode yang berjalan SEBELUM request diproses
│
├── 🚀 Built-in Optimizations (Gratis! Tanpa config tambahan)
│   ├── next/image   → Kompresi otomatis, lazy load, format WebP
│   ├── next/font    → Font tanpa layout shift, di-host lokal
│   ├── next/link    → Prefetching halaman otomatis saat link terlihat
│   └── next/script  → Load script third-party dengan strategi optimal
│
├── 🗄️ Data Layer (Pilih salah satu)
│   ├── Prisma        → ORM paling populer, type-safe, mudah dipakai
│   ├── Drizzle ORM   → Alternatif ringan, SQL-first
│   └── fetch()       → Untuk REST API eksternal
│
└── 🔐 Auth & Deploy
    ├── NextAuth.js (Auth.js) → Autentikasi lengkap (Google, GitHub, dll)
    ├── Clerk                → Auth sebagai layanan (lebih mudah, berbayar)
    └── Vercel               → Platform deploy resmi, gratis untuk proyek kecil
```

---

## 📊 1.3 Kapan Pilih Next.js vs React Biasa?

Pertanyaan yang sering muncul: *"Kenapa tidak pakai React saja?"* Jawabannya tergantung pada kebutuhan project Anda:

| Skenario | Pilihan Terbaik | Alasan |
| --- | --- | --- |
| 🌐 Landing page produk | **Next.js** | SEO kritis, performa awal harus cepat |
| 📝 Blog / portal artikel | **Next.js** | SEO sangat penting, konten harus terindeks |
| 🛍️ E-commerce | **Next.js** | SEO produk + performa = konversi lebih tinggi |
| 📊 Dashboard admin internal | **Next.js** (atau React) | SEO tidak penting, tapi Next.js tetap lebih praktis |
| 📱 Aplikasi mobile | React Native | Platform berbeda sama sekali |
| 🧪 Prototype / eksperimen cepat | React (CRA/Vite) | Setup lebih sederhana untuk eksplorasi |

> 💡 **Kesimpulan Praktis:** Jika Anda membangun sesuatu untuk internet yang butuh SEO atau performa halaman yang baik — pilih Next.js. Di dunia kerja saat ini, Next.js sudah menjadi **standar industri** untuk aplikasi web berbasis React.

---

## 🆚 1.4 Pages Router vs App Router — Mana yang Harus Dipelajari?

Ini adalah sumber kebingungan terbesar bagi pemula Next.js. Ada **dua sistem routing** yang berbeda:

```
Pages Router (LAMA — Next.js < 13)       App Router (BARU — Next.js 13+)
────────────────────────────────         ──────────────────────────────────
pages/                                   app/
├── index.js       → /                   ├── page.tsx        → /
├── blog/                                ├── blog/
│   └── [slug].js  → /blog/:slug         │   ├── page.tsx    → /blog
└── api/                                 │   └── [slug]/
    └── posts.js   → /api/posts          │       └── page.tsx → /blog/:slug
                                         └── api/posts/
                                             └── route.ts    → /api/posts

Cara fetch data:                         Cara fetch data:
getServerSideProps()  → SSR              async/await langsung di komponen
getStaticProps()      → SSG              generateStaticParams()
useRouter() dari      → navigasi         useRouter() dari 'next/navigation'
  'next/router'                            (BEDA IMPORT!)
```

> ⚠️ **Perhatian:** Banyak tutorial di YouTube dan blog lama masih menggunakan Pages Router. **Ebook ini 100% fokus pada App Router** karena itulah masa depan Next.js. Semua fitur baru hanya dikembangkan untuk App Router.

---

## 🧰 1.5 Tech Stack yang Akan Kita Gunakan

Selama perjalanan belajar di ebook ini, kita akan menggunakan stack berikut:

| Tool | Versi | Fungsi dalam Project |
| --- | --- | --- |
| **Next.js** | 14.x | Framework utama — routing, SSR, SSG, API |
| **React** | 18.x | UI Library (sudah termasuk dalam Next.js) |
| **TypeScript** | 5.x | Type safety — menghindari bug sebelum runtime |
| **Tailwind CSS** | 3.x | Styling dengan utility classes |
| **Prisma** | 5.x | ORM untuk query database secara type-safe |
| **PostgreSQL/SQLite** | Latest | Database (SQLite untuk dev, PostgreSQL untuk prod) |
| **NextAuth.js** | 5.x | Sistem autentikasi lengkap |
| **Vercel** | — | Platform deployment yang terintegrasi dengan Next.js |

> 📌 **Catatan TypeScript:** Semua kode di ebook ini ditulis dalam TypeScript. Jika Anda belum familiar dengan TypeScript, jangan khawatir — kita akan menjelaskan tipe-tipe yang digunakan. TypeScript sangat direkomendasikan karena Next.js sendiri ditulis dalam TypeScript dan memberikan DX (Developer Experience) yang jauh lebih baik.
