# 🎨 Ebook Tailwind CSS — Dokumentasi Bahasa Indonesia

Dokumentasi lengkap **Tailwind CSS** dalam Bahasa Indonesia, dibuat dengan [VitePress](https://vitepress.dev/). Bagian dari monorepo **ebook-docs**.

## 🚀 Quick Start

```bash
# Dari root monorepo
npm run dev:tailwind

# Atau langsung
cd docs/tailwind
npm install
npm run dev
```

## 🌐 Deploy ke Vercel

1. Push repo ke GitHub
2. Buka [vercel.com/new](https://vercel.com/new) → Import repository
3. Set **Root Directory** = `docs/tailwind`
4. Tambah custom domain di Settings → Domains (misal `tailwind-docs.example.com`)

## 📁 Struktur

```
docs/tailwind/
├── .vitepress/config.mjs
├── public/ (logo + favicon)
├── index.md (homepage)
├── bagian-1/ ... bagian-7/ (7 bagian, 17 bab)
├── package.json
├── vercel.json
└── README.md
```

## 📊 Perintah NPM (dari root)

| Perintah | Fungsi |
| --- | --- |
| `npm run dev:tailwind` | Dev server Tailwind |
| `npm run build:tailwind` | Build static site |
| `npm run preview:tailwind` | Preview hasil build |

---

🇮🇩 Dibuat dengan ❤️ untuk komunitas developer Indonesia
