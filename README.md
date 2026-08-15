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

Setiap docs site di-deploy sebagai **Vercel project terpisah** dengan custom domain-nya sendiri.

### Setup Laravel Docs

1. Push repo ini ke GitHub
2. Buka [vercel.com/new](https://vercel.com/new) → Import repository
3. Set **Root Directory** ke `docs/laravel`
4. Framework Preset otomatis terdeteksi sebagai **VitePress**
5. Klik **Deploy**
6. Setelah deploy sukses, buka **Settings → Domains**
7. Tambahkan custom domain (misal `laravel-docs.example.com`)
8. Ikuti instruksi DNS verification

### Setup React Docs (Nanti)

Sama seperti Laravel, tapi:
- **Root Directory** = `docs/react`
- Custom domain = `react-docs.example.com`

### Daftar Domain yang Disarankan

| Project        | Root Directory   | Domain                            |
| -------------- | ---------------- | --------------------------------- |
| Laravel Docs   | `docs/laravel`   | `laravel-docs.example.com`        |
| React Docs     | `docs/react`     | `react-docs.example.com`          |
| Vue Docs       | `docs/vue`       | `vue-docs.example.com`            |
| Next.js Docs   | `docs/next`      | `next-docs.example.com`           |

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
