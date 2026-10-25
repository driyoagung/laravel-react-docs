---
title: 'Bab 20 — Deploy ke Vercel & Best Practices'
---

# Bab 20 — Deploy ke Vercel & Best Practices

## 20.1 🚀 Deploy ke Vercel (Cara Termudah)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy ke production
vercel --prod
```

**Atau via GitHub:**
1. Push ke GitHub
2. Buka vercel.com → Import project
3. Hubungkan repo → Vercel otomatis build & deploy
4. Setiap push ke `main` → otomatis deploy ulang

---

## 20.2 ⚙️ Environment Variables di Vercel

```
Di Vercel Dashboard → Project → Settings → Environment Variables:

DATABASE_URL          = postgresql://... (Production DB)
NEXTAUTH_URL          = https://blogcms.vercel.app
NEXTAUTH_SECRET       = [generate dengan: openssl rand -base64 32]
GOOGLE_CLIENT_ID      = ...
GOOGLE_CLIENT_SECRET  = ...
```

---

## 20.3 📊 Checklist Sebelum Deploy Production

```
Performance:
☐ Semua gambar pakai <Image> component
☐ Font pakai next/font (bukan Google Fonts link)
☐ Strategi caching yang tepat (revalidate, tags)
☐ Parallel fetching dengan Promise.all

SEO:
☐ metadata di setiap page
☐ generateMetadata untuk halaman dinamis
☐ sitemap.ts ada
☐ robots.ts ada
☐ OpenGraph image untuk setiap halaman penting

Security:
☐ Environment variables tidak ada di kode
☐ API Routes ada validasi & autentikasi
☐ Server Actions ada validasi input
☐ Middleware proteksi route yang perlu auth

Database:
☐ Prisma connection pool dikonfigurasi
☐ Migration production sudah dijalankan
☐ Backup database ada
```
