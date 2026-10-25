# 📚 Ebook Docs Monorepo

Monorepo untuk dokumentasi ebook dalam Bahasa Indonesia. Setiap framework punya folder docs sendiri dan dideploy ke domain Vercel yang berbeda.

## 📁 Struktur Project

```
laravel-react/
├── package.json              ← Root: workspaces config & scripts
├── node_modules/             ← Shared dependencies (hoisted by npm workspaces)
├── .gitignore
├── README.md                 ← File ini
│
├── laravel-structure.md      ← Sumber markdown mentah (belum di-convert)
├── react-structure.md        ← Sumber markdown mentah (belum di-convert)
│
└── docs/                     ← 📚 Semua dokumentasi VitePress
    ├── laravel/              ← 🟢 Dokumentasi Laravel (Port 5173)
    │   ├── .vitepress/
    │   │   └── config.mjs
    │   ├── public/           ← Asset statis (logo, favicon)
    │   ├── index.md          ← Homepage
    │   ├── bagian-1/         ← 7 bagian × beberapa bab = 24 bab
    │   ├── bagian-2/
    │   ├── bagian-3/
    │   ├── bagian-4/
    │   ├── bagian-5/
    │   ├── bagian-6/
    │   ├── bagian-7/
    │   ├── package.json      ← Scripts saja (deps dari root via workspaces)
    │   ├── vercel.json       ← Konfigurasi deploy
    │   └── README.md
    │
    └── react/                ← ⚛️ Dokumentasi React (Clone Airbnb)
        ├── .vitepress/
        │   └── config.mjs
        ├── public/           ← Asset statis (logo + favicon)
        ├── index.md          ← Homepage
        ├── bagian-1/         ← 7 bagian × beberapa bab = 24 bab
        ├── bagian-2/
        ├── bagian-3/
        ├── bagian-4/
        ├── bagian-5/
        ├── bagian-6/
        ├── bagian-7/
        ├── package.json      ← Scripts saja (deps dari root via workspaces)
        ├── vercel.json       ← Konfigurasi deploy
        └── README.md
```

## 🚀 Quick Start

### Next.js 14

Dokumentasi Next.js kini tersedia sebagai situs VitePress tersendiri di `docs/nextjs`, berisi 9 bagian dan 21 bab. Dari root repository:

```bash
npm install
npm run dev:nextjs
```

Buka alamat localhost yang ditampilkan di terminal. Untuk memeriksa hasil build:

```bash
npm run build:nextjs
npm run preview:nextjs
```

Naskah mentah Next.js tetap tersimpan di `docs/nextjs/`; halaman situsnya ada di folder `bagian-1` sampai `bagian-9`.

### Vue.js 3

Dokumentasi Vue tersedia sebagai situs VitePress di `docs/vue`, berisi 7 bagian dan 24 bab. Naskah asalnya tetap ada di `docs/vue js`.

```bash
npm install
npm run dev:vue
```

Untuk memeriksa hasil produksi, jalankan `npm run build:vue` lalu `npm run preview:vue`.

### 1. Install Dependencies (1x untuk semua workspace)

```bash
npm install
```

Ini akan menginstall VitePress dan dependencies lain di root `node_modules/` (npm workspaces otomatis hoist).

### 2. Jalankan Dev Server

```bash
# Dev server khusus Laravel
npm run dev:laravel

# Dev server khusus React (nanti)
npm run dev:react
```

Atau langsung di folder docs:

```bash
cd docs/laravel
npm run dev
```

Dev server Laravel akan jalan di `http://localhost:5173/`.

### 3. Build untuk Production

```bash
# Build Laravel
npm run build:laravel

# Build React (nanti)
npm run build:react

# Build SEMUA sekaligus
npm run build:all
```

Output build ada di masing-masing `docs/<framework>/.vitepress/dist/`.

## 📋 Perintah NPM Lengkap

| Perintah                   | Fungsi                                                |
| -------------------------- | ----------------------------------------------------- |
| `npm install`              | Install semua deps untuk semua workspace              |
| `npm run dev:laravel`      | Dev server Laravel                                    |
| `npm run dev:react`        | Dev server React                                      |
| `npm run build:laravel`    | Build Laravel docs                                    |
| `npm run build:react`      | Build React docs                                      |
| `npm run build:all`        | Build semua docs site                                 |
| `npm run preview:laravel`  | Preview hasil build Laravel                           |
| `npm run preview:react`    | Preview hasil build React                             |
| `npm run clean`            | Hapus semua folder `dist/` & `cache/`                 |

## 🌐 Deploy ke Vercel (Setiap Docs Site → Domain Sendiri)

Gunakan **satu Vercel Project untuk setiap situs**. Kelima project terhubung ke repository Git yang sama, tetapi masing-masing memilih Root Directory sendiri. Contoh domain di bawah hanya ilustrasi; ganti `contoh.com` dengan domain yang Anda miliki.

| Vercel Project | Root Directory | Contoh domain |
| --- | --- | --- |
| `ebook-laravel` | `docs/laravel` | `laravel.contoh.com` |
| `ebook-react` | `docs/react` | `react.contoh.com` |
| `ebook-tailwind` | `docs/tailwind` | `tailwind.contoh.com` |
| `ebook-nextjs` | `docs/nextjs` | `nextjs.contoh.com` |
| `ebook-vue` | `docs/vue` | `vue.contoh.com` |

Untuk **setiap baris** tabel:

1. Push repository ke GitHub, GitLab, atau Bitbucket.
2. Di [Vercel Dashboard](https://vercel.com/new), buat **Add New → Project**, lalu impor repository yang sama.
3. Sebelum deploy, ubah **Root Directory** sesuai tabel. Jangan gunakan root repository untuk salah satu situs docs.
4. Periksa konfigurasi build: **Framework Preset** `VitePress`, **Build Command** `npm run build`, dan **Output Directory** `.vitepress/dist`. Nilai ini juga tersimpan di `vercel.json` pada tiap folder docs.
5. Deploy. Setelah situs tampil pada alamat sementara `*.vercel.app`, buka **Project Settings → Domains** dan tambahkan domain untuk project tersebut.
6. Tambahkan record DNS yang ditampilkan Vercel pada penyedia domain Anda. Untuk subdomain biasanya berupa CNAME; salin nilai yang diberikan Vercel, lalu tunggu status domain menjadi valid.

Ulangi proses untuk kelima situs. Satu domain atau subdomain dapat diarahkan ke project yang sesuai. Domain tidak ditentukan oleh folder Git atau `vercel.json`; pengaitannya dilakukan di **Settings → Domains** pada masing-masing Vercel Project.

Setelah domain final ditentukan, tambahkan `sitemap.hostname` dengan URL domain sebenarnya ke `.vitepress/config.mjs` masing-masing situs bila Anda ingin menerbitkan sitemap. Jangan gunakan domain contoh untuk sitemap produksi.

## 🏗️ Cara Tambah Docs Site Baru (misal: React)

### 1. Buat folder workspace

```bash
mkdir docs/react
mkdir docs/react/.vitepress
mkdir docs/react/public
```

### 2. Buat `package.json` di folder baru

```json
{
  "name": "react-docs",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vitepress dev",
    "build": "vitepress build",
    "preview": "vitepress preview"
  }
}
```

### 3. Buat `.vitepress/config.mjs`

Konfigurasi standar VitePress (lihat `docs/laravel/.vitepress/config.mjs` sebagai contoh).

### 4. Tambah script di root `package.json`

```json
"dev:react": "npm run dev --workspace=react-docs",
"build:react": "npm run build --workspace=react-docs",
"preview:react": "npm run preview --workspace=react-docs"
```

### 5. Install

```bash
npm install
```

VitePress sudah terinstall di root, tidak perlu install ulang.

### 6. Develop

```bash
npm run dev:react
```

## 🧠 Kenapa Pakai Workspaces?

| Aspek                  | Tanpa Workspaces (lama)         | Dengan Workspaces (sekarang)     |
| ---------------------- | ------------------------------- | -------------------------------- |
| Install                | 1× per docs site                | **1× total di root**             |
| Disk space             | Duplicate `node_modules`        | **Shared di root**               |
| VitePress version      | Bisa beda tiap site             | **Konsisten semua site**         |
| Update dependencies    | Update di tiap folder           | **Update 1× di root**            |
| Dev server             | Tinggal sama (per folder)       | Tinggal sama (per folder)        |

**Trade-off:** Anda tetap perlu `cd` ke folder docs (atau pakai script root) untuk jalankan dev server. Ini normal — setiap VitePress site adalah project independen.

## 🐛 Troubleshooting

### Port 5173 sudah dipakai

```bash
# Cara 1: tutup proses yang pakai port
# Windows:
netstat -ano | findstr :5173
taskkill /PID <pid> /F

# Cara 2: jalankan di port lain
cd docs/laravel
npm run dev -- --port 3000
```

### Workspace tidak terdeteksi

```bash
# Hapus semua node_modules & reinstall
rm -rf node_modules docs/*/node_modules
npm install
```

### Build gagal karena error Markdown

VitePress strict soal YAML frontmatter. Kalau `title:` mengandung tanda `:`, quote dengan `"..."`.

Contoh salah:
```yaml
---
title: Bab 3 — MVC: Cara Berpikir Laravel
---
```

Contoh benar:
```yaml
---
title: "Bab 3 — MVC: Cara Berpikir Laravel"
---
```

## 📚 Referensi

- [VitePress Documentation](https://vitepress.dev/)
- [npm Workspaces](https://docs.npmjs.com/cli/v10/using-npm/workspaces)
- [Vercel + VitePress Guide](https://vercel.com/guides/deploying-vitepress-with-vercel)

---

🇮🇩 Dibuat dengan ❤️ untuk komunitas developer Indonesia
