---
title: 'Bab 2 — Setup Project & Struktur Folder'
---

# Bab 2 — Setup Project & Struktur Folder

## 🚀 2.1 Membuat Project Next.js

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

## 🗂️ 2.2 Anatomi Folder Next.js App Router

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

## ⚙️ 2.3 File Konfigurasi Penting

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

## 🔧 2.4 Script yang Sering Dipakai

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
