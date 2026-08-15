# 📘 Ebook Laravel — Dokumentasi Bahasa Indonesia

Dokumentasi lengkap **Laravel 12** dalam Bahasa Indonesia, dibuat dengan [VitePress](https://vitepress.dev/).

Bagian dari monorepo **ebook-docs**. Setiap framework punya folder docs sendiri dan dideploy ke domain Vercel berbeda.

## 🚀 Quick Start

Dari root monorepo:

```bash
# Install semua dependencies (1x untuk semua workspace)
npm install

# Dev server khusus Laravel
npm run dev:laravel
```

Atau langsung di folder ini:

```bash
cd docs/laravel
npm run dev
```

Buka `http://localhost:5173` di browser.

## 📦 Build untuk Production

```bash
# Dari root monorepo
npm run build:laravel

# Atau dari folder ini
cd docs/laravel
npm run build
```

Output ada di `docs/laravel/.vitepress/dist/`.

## 🌐 Deploy ke Vercel

1. Push repo ini ke GitHub
2. Buka [vercel.com/new](https://vercel.com/new) → Import repository
3. Set **Root Directory** ke `docs/laravel`
4. Vercel otomatis detect VitePress → klik Deploy
5. Tambah **custom domain** di Settings → Domains (misal `laravel-docs.example.com`)

## 📁 Struktur File

```
docs/laravel/
├── .vitepress/
│   └── config.mjs       ← Konfigurasi VitePress (nav, sidebar, tema)
├── public/              ← Asset statis (logo, favicon)
├── index.md             ← Homepage
├── bagian-1/            ← 🟢 Bagian I (Bab 1-4)
├── bagian-2/            ← 🔵 Bagian II (Bab 5-9)
├── bagian-3/            ← 🟡 Bagian III (Bab 10-13)
├── bagian-4/            ← 🟠 Bagian IV (Bab 14-16)
├── bagian-5/            ← 🔴 Bagian V (Bab 17-20)
├── bagian-6/            ← 🟣 Bagian VI (Bab 21-23)
├── bagian-7/            ← 🏗️ Bagian VII (Bab 24 - Project)
├── package.json         ← Scripts (deps dari root via workspaces)
├── vercel.json          ← Konfigurasi deploy Vercel
└── README.md            ← File ini
```

## 📊 Perintah NPM (dari root monorepo)

| Perintah                  | Fungsi                                       |
| ------------------------- | -------------------------------------------- |
| `npm run dev:laravel`     | Jalankan dev server Laravel                  |
| `npm run build:laravel`   | Build static site Laravel                    |
| `npm run preview:laravel` | Preview hasil build Laravel                  |
| `npm run build:all`       | Build semua docs site (laravel + react + …)  |
| `npm run clean`           | Hapus semua build output                     |

## 📚 Lihat Juga

- [Root monorepo README](../../README.md)
- [VitePress Documentation](https://vitepress.dev/)
- [Vercel + VitePress Guide](https://vercel.com/guides/deploying-vitepress-with-vercel)

---

🇮🇩 Dibuat dengan ❤️ untuk komunitas developer Indonesia
