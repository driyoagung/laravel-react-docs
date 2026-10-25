# 🟢 Ebook Next.js 14 — Bagian I: Dari React ke Next.js

Oct 19, 2026 · @Jagat Website

## 📖 Bab 1 — Mengenal Next.js & Ekosistemnya

---

### 🏗️ 1.1 Sejarah & Evolusi Next.js

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

### 🌐 1.2 Ekosistem Next.js

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

### 📊 1.3 Kapan Pilih Next.js vs React Biasa?

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

### 🆚 1.4 Pages Router vs App Router — Mana yang Harus Dipelajari?

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

### 🧰 1.5 Tech Stack yang Akan Kita Gunakan

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

## 📖 Bab 2 — Setup Project & Struktur Folder

---

### 🚀 2.1 Membuat Project Next.js

Langkah pertama adalah membuat project Next.js baru menggunakan `create-next-app` — tool resmi dari tim Next.js yang menyiapkan semua konfigurasi awal secara otomatis.

```bash
# Buat project baru
npx create-next-app@latest blog-cms
```

Saat menjalankan perintah ini, Anda akan mendapat beberapa pertanyaan. Berikut pilihan yang **disarankan** untuk ebook ini:

```bash
✔ Would you like to use TypeScript?              → Yes
  (Type safety lebih baik, industry standard)

✔ Would you like to use ESLint?                  → Yes
  (Linter untuk mendeteksi error lebih awal)

✔ Would you like to use Tailwind CSS?            → Yes
  (Styling utility-first yang kita pakai)

✔ Would you like to use `src/` directory?        → No
  (Kita simpan app/ langsung di root agar lebih simpel)

✔ Would you like to use App Router?              → Yes  ← WAJIB!
  (Ini adalah inti dari ebook ini)

✔ Would you like to customize the import alias?  → No
  (Biarkan default: @/ untuk import absolut)
```

```bash
# Masuk ke folder project
cd blog-cms

# Jalankan development server
npm run dev

# Buka di browser: http://localhost:3000
# Anda harusnya melihat halaman welcome Next.js
```

> ✅ **Cek Instalasi:** Jika Anda melihat halaman dengan logo Next.js dan beberapa link dokumentasi di `http://localhost:3000` — instalasi berhasil!

---

### 🗂️ 2.2 Anatomi Folder Next.js App Router

Setelah project terbuat, inilah struktur folder yang akan Anda temukan beserta penjelasan fungsi masing-masing file:

```
blog-cms/
│
├── 📁 app/                       ← ⭐ INTI dari App Router
│   ├── 📄 layout.tsx             ← Root layout: wrapper untuk SEMUA halaman
│   │                                Berisi <html>, <body>, Navbar, Footer
│   ├── 📄 page.tsx               ← Halaman utama: /
│   ├── 📄 loading.tsx            ← UI loading otomatis (skeleton, spinner)
│   ├── 📄 error.tsx              ← UI error otomatis (tombol retry)
│   ├── 📄 not-found.tsx          ← Halaman 404 kustom
│   ├── 📄 globals.css            ← CSS global (Tailwind directives di sini)
│   │
│   ├── 📁 blog/                  ← Route: /blog
│   │   ├── 📄 page.tsx           ← Halaman daftar artikel: /blog
│   │   └── 📁 [slug]/            ← Dynamic route: slug bisa apa saja
│   │       └── 📄 page.tsx       ← Halaman detail: /blog/judul-artikel
│   │
│   ├── 📁 dashboard/             ← Route: /dashboard (area admin)
│   │   ├── 📄 layout.tsx         ← Layout KHUSUS dashboard (dengan Sidebar)
│   │   ├── 📄 page.tsx           ← Halaman dashboard utama
│   │   └── 📁 posts/
│   │       └── 📄 page.tsx       ← Daftar post: /dashboard/posts
│   │
│   └── 📁 api/                   ← API Routes (backend)
│       └── 📁 posts/
│           └── 📄 route.ts       ← Endpoint API: /api/posts
│
├── 📁 components/                ← Komponen React yang bisa dipakai ulang
│   ├── 📁 ui/                    ← Komponen UI generik (Button, Input, dll)
│   └── 📁 blog/                  ← Komponen domain blog (PostCard, dll)
│
├── 📁 lib/                       ← Utility, helper, konfigurasi
│   ├── 📄 db.ts                  ← Koneksi Prisma (singleton pattern)
│   ├── 📄 auth.ts                ← Konfigurasi NextAuth
│   └── 📄 utils.ts               ← Fungsi helper (slugify, formatDate, dll)
│
├── 📁 prisma/
│   └── 📄 schema.prisma          ← Definisi schema database
│
├── 📄 middleware.ts              ← Middleware: intercept setiap request
├── 📄 next.config.js             ← Konfigurasi Next.js
├── 📄 tailwind.config.ts         ← Konfigurasi Tailwind CSS
├── 📄 tsconfig.json              ← Konfigurasi TypeScript
└── 📄 .env.local                 ← Environment variables (RAHASIA!)
```

> 💡 **Konsep Kunci — Routing Berbasis File:** Di React, Anda mendefinisikan routing di kode: `<Route path="/blog" element={<Blog />}>`. Di Next.js, Anda cukup **membuat folder dan file** — routing terjadi **otomatis**!
>
> `app/blog/page.tsx` → otomatis menjadi halaman `/blog` `app/blog/[slug]/page.tsx` → otomatis menjadi halaman `/blog/apa-saja`

---

### ⚙️ 2.3 File Konfigurasi Penting

#### `next.config.js` — Konfigurasi Framework

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Daftar domain yang boleh dipakai untuk <Image> dari URL eksternal
    // Jika tidak didaftarkan, Next.js akan error saat render gambar eksternal
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Jika pakai Cloudinary
      },
    ],
  },
  experimental: {
    // Server Actions butuh konfigurasi ini di Next.js 14
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
}

module.exports = nextConfig
```

**Penjelasan kode:**

- `remotePatterns` → whitelist domain eksternal yang boleh digunakan komponen `<Image>`. Ini adalah keamanan bawaan Next.js — mencegah gambar dari domain tidak dikenal.
- `serverActions.allowedOrigins` → domain yang boleh mengirim Server Action. Penting untuk keamanan saat production nanti.

---

#### `.env.local` — Environment Variables

```bash
# .env.local
# ⚠️ File ini TIDAK boleh di-commit ke Git!
# Tambahkan .env.local ke .gitignore Anda

# Koneksi database
DATABASE_URL="postgresql://username:password@localhost:5432/blog_cms"
# Untuk development awal, bisa pakai SQLite:
# DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"         # URL aplikasi Anda
NEXTAUTH_SECRET="ganti-dengan-string-acak"   # Generate: openssl rand -base64 32

# Google OAuth (opsional, untuk login Google)
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

> 🔐 **Keamanan:** Variabel dengan prefix `NEXT_PUBLIC_` akan tersedia di browser (client). Tanpa prefix, variabel hanya tersedia di server. Jangan pernah menaruh API key sensitif dengan prefix `NEXT_PUBLIC_`!

---

### 🔧 2.4 Script yang Sering Dipakai

```bash
# Development
npm run dev        # Jalankan dev server di http://localhost:3000
                   # Otomatis refresh saat ada perubahan kode (Hot Reload)

# Production
npm run build      # Build project untuk production (optimasi semua aset)
npm run start      # Jalankan hasil build production di server

# Kualitas Kode
npm run lint       # Cek kode dengan ESLint (temukan bug potensial)

# ──────────────────────────────────────
# Prisma (Database)
npx prisma init              # Inisialisasi Prisma di project (sekali saja)
npx prisma db push           # Sinkronkan schema ke database (untuk dev)
npx prisma migrate dev       # Buat file migration baru + jalankan
npx prisma migrate deploy    # Jalankan migration di production
npx prisma studio            # Buka GUI database di browser (sangat berguna!)
npx prisma generate          # Generate ulang Prisma Client (setelah ubah schema)
```

> 💡 **Tips:** Gunakan `prisma studio` saat development — ini adalah GUI visual untuk melihat dan mengedit data database langsung dari browser, tanpa perlu tools eksternal seperti TablePlus atau DBeaver.

## 📖 Bab 3 — Perbedaan Konsep: React vs Next.js

Ini adalah bab yang **paling penting** di Bagian I. Anda perlu memahami pergeseran mental model dari React ke Next.js sebelum melanjutkan ke bab-bab berikutnya.

---

### 🔄 3.1 Cara Fetch Data yang Berubah Total

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

### 🧠 3.2 Mental Model Baru: Server vs Browser

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

### 📋 3.3 Tabel Perubahan Konsep Lengkap

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

### 🏗️ 3.4 Studi Kasus: Halaman Blog dengan Kedua Pendekatan

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

### ⚠️ 3.5 Kesalahan Umum yang Harus Dihindari

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
