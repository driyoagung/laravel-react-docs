# ⚛️ Ebook React — Dokumentasi Bahasa Indonesia

Dokumentasi lengkap **React 19** dalam Bahasa Indonesia, dibuat dengan [VitePress](https://vitepress.dev/). Bagian dari monorepo **ebook-docs**.

## 🚀 Quick Start

```bash
# Dari root monorepo
npm run dev:react

# Atau langsung
cd docs/react
npm install
npm run dev
```

## 🌐 Deploy ke Vercel

1. Push repo ke GitHub
2. Buka [vercel.com/new](https://vercel.com/new) → Import repository
3. Set **Root Directory** = `docs/react`
4. Tambah custom domain di Settings → Domains (misal `react-docs.example.com`)

## 📁 Struktur

```
docs/react/
├── .vitepress/config.mjs
├── public/ (logo + favicon)
├── index.md (homepage)
├── bagian-1/ ... bagian-7/ (7 bagian, 24 bab)
├── package.json
├── vercel.json
└── README.md
```

## 📊 Perintah NPM (dari root)

| Perintah | Fungsi |
| --- | --- |
| `npm run dev:react` | Dev server React |
| `npm run build:react` | Build static site |
| `npm run preview:react` | Preview hasil build |

---

🇮🇩 Dibuat dengan ❤️ untuk komunitas developer Indonesia
