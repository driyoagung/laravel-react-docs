---
title: Bab 1 — Mengenal Tailwind CSS
---

# 📖 Bab 1 — Mengenal Tailwind CSS

## 1.1 🤔 Apa itu Tailwind CSS?

Tailwind CSS adalah **utility-first CSS framework** — framework yang menyediakan ribuan class kecil yang masing-masing mengerjakan satu hal spesifik. Daripada menulis CSS dari nol atau menggunakan komponen pre-built seperti Bootstrap, Anda menyusun tampilan langsung di HTML dengan menggabungkan class-class tersebut.

> 💡 **Analogi Sederhana:**
> Jika Bootstrap seperti membeli furnitur jadi di toko — cepat tapi susah
> dimodifikasi, maka Tailwind seperti membeli kayu, cat, dan paku — Anda
> bebas membuat apa saja, dan hasilnya persis sesuai keinginan Anda.

**Penjelasan lebih detail:**

- **Utility-first** artinya setiap class Tailwind hanya punya satu fungsi CSS. Contoh: `text-center` hanya `text-align: center`. `bg-blue-500` hanya `background-color: rgb(59 130 246)`.
- **Ribuan utility** tersedia — lebih dari 50.000 kombinasi. Tapi Anda tidak perlu hapal semua, karena VS Code IntelliSense akan auto-suggest.
- **Compose** — Anda menggabungkan beberapa utility untuk styling yang lebih kompleks. Contoh: `bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`.
- **Tree-shaking otomatis** — Tailwind scan file Anda dan hanya include class yang dipakai. Bundle CSS sangat kecil (~10-30KB).
- **Tidak ada CSS custom** — Anda hampir tidak perlu tulis CSS manual sama sekali.

## 1.2 ⚖️ Perbandingan: CSS Biasa vs Bootstrap vs Tailwind

```
MASALAH CSS BIASA:
  → Naming class susah (BEM, OOCSS, dll)
  → CSS global mudah konflik
  → File CSS makin besar seiring waktu
  → Susah maintain karena style tersebar di banyak file

MASALAH BOOTSTRAP:
  → Tampilan "Bootstrap banget" — semua web terlihat sama
  → Override style butuh specificity tinggi
  → Bundle besar meski banyak komponen tidak dipakai
  → Kurang fleksibel untuk design yang custom

KELEBIHAN TAILWIND:
  ✅ Tidak perlu buat nama class (tidak ada mental overhead)
  ✅ CSS tidak pernah bertambah besar (hanya class yang dipakai yang di-bundle)
  ✅ Konsistensi desain terjaga lewat design tokens (spacing, warna, dll)
  ✅ Responsive, dark mode, hover — semua lewat prefix, tidak perlu tulis media query
  ✅ Mudah delete kode — hapus elemen = hapus style sekaligus
```

**Penjelasan per blok:**

**Masalah CSS Biasa:**
- **Naming class susah** — Anda harus kasih nama semantic seperti `.product-card__image-wrapper`. Diskusi nama bisa makan waktu.
- **CSS global mudah konflik** — Class dengan nama sama di tempat berbeda bisa bentrok.
- **File CSS makin besar** — Seiring waktu, developer takut hapus CSS takut dipakai di tempat lain. Dead code menumpuk.
- **Style tersebar** — Untuk ubah satu tombol, Anda harus cari di banyak file CSS.

**Masalah Bootstrap:**
- **Tampilan "Bootstrap banget"** — Kalau lihat website, langsung tahu pakai Bootstrap. Tidak unik.
- **Specificity tinggi** — Untuk override `btn-primary`, Anda butuh `.btn .btn-primary.my-override` (3 selector).
- **Bundle besar** — Meskipun pakai 5 komponen, semua CSS di-include.
- **Kurang fleksibel** — Mau ganti style = override banyak tempat.

**Kelebihan Tailwind:**
- **Tidak perlu nama class** — Class sudah ada, tinggal pakai. Tidak ada diskusi naming.
- **Bundle selalu kecil** — Purge otomatis. CSS yang tidak dipakai = tidak di-bundle.
- **Design tokens konsisten** — `p-4` selalu `1rem`. Tidak ada "padding 13px" di satu tempat dan "14px" di tempat lain.
- **Prefix-based** — `hover:`, `md:`, `dark:` — semua pakai prefix. Tidak perlu tulis `@media` manual.
- **Mudah delete** — Hapus elemen HTML = style-nya ikut hilang.

| Aspek | CSS Biasa | Bootstrap | Tailwind CSS |
| --- | --- | --- | --- |
| **Cara kerja** | Tulis CSS custom | Pakai komponen siap pakai | Gabungkan utility classes |
| **Fleksibilitas** | ✅ Total bebas | Terbatas | ✅ Sangat fleksibel |
| **Kecepatan dev** | Lambat | ✅ Cepat awal | ✅ Cepat setelah terbiasa |
| **Bundle size** | Bisa besar | ~30KB (min) | ~5-20KB (hanya yang dipakai) |
| **Uniqueness** | ✅ Unik | Seragam | ✅ Unik |
| **Learning curve** | Rendah | Rendah | Sedang |
| **Dark mode** | Manual | Terbatas | ✅ Built-in |
| **Responsive** | Manual media query | Kelas grid saja | ✅ Prefix di semua class |

**Penjelasan tabel:**

- **Cara kerja** — Tailwind tidak menulis CSS. Class langsung ditulis di HTML.
- **Fleksibilitas** — Tailwind seperti Lego. Mau bikin apa aja bisa.
- **Bundle size** — Tailwind bisa sangat kecil karena purge otomatis.
- **Uniqueness** — Tampilan website Tailwind tidak "Tailwind banget" (tidak ada gaya seragam).
- **Learning curve** — Butuh waktu belajar class-class nya. Tapi setelah hafal, produktif.
- **Dark mode** — Tinggal tambah prefix `dark:` di setiap class.
- **Responsive** — `sm:`, `md:`, `lg:` prefix untuk berbagai breakpoint.

## 1.3 🏆 Siapa yang Pakai Tailwind?

Tailwind dipakai oleh ribuan perusahaan dan project besar, termasuk:

```
🏢 Perusahaan               🛠️ Framework / Produk
─────────────────────────   ─────────────────────────
GitHub                       Laravel (default styling)
Vercel                       Nuxt UI
Shopify                      shadcn/ui
OpenAI (ChatGPT UI)          Flowbite
NASA                         Headless UI
Stripe Docs                  Preline UI
```

**Penjelasan:**

Daftar ini hanya sebagian kecil. Tailwind dipakai di mana-mana karena:
- **Adopsi framework besar** — Laravel pakai Tailwind sebagai default styling (sejak Laravel 8+).
- **shadcn/ui** — Library komponen paling populer 2025-2026. Semua berdasarkan Tailwind.
- **Pemain besar** — OpenAI, NASA, Stripe. Bukan project kecil.

## 1.4 📦 Instalasi & Setup

### Cara 1: Via npm (Untuk project Vite/React/Vue/Laravel)

```bash
# Install Tailwind + PostCSS + Autoprefixer
npm install -D tailwindcss postcss autoprefixer

# Buat file konfigurasi
npx tailwindcss init -p
# Menghasilkan: tailwind.config.js + postcss.config.js
```

**Penjelasan perintah:**

- **`npm install -D`** — Install sebagai devDependency. Tailwind hanya dipakai saat build, tidak perlu di production runtime.
- **`postcss`** — Plugin yang memproses CSS dengan berbagai transformasi (Tailwind adalah PostCSS plugin).
- **`autoprefixer`** — Plugin PostCSS untuk tambah vendor prefix otomatis (`-webkit-`, `-moz-`, dll).
- **`npx tailwindcss init -p`** — Generate 2 file: `tailwind.config.js` (config Tailwind) + `postcss.config.js` (config PostCSS).
- **`-p`** flag — Sekalian generate postcss config.

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  // ① Tentukan file mana yang akan di-scan untuk class Tailwind
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,vue}', // Sesuaikan dengan framework Anda
  ],
  theme: {
    extend: {
      // Kustomisasi design tokens di sini (Bab 14)
    },
  },
  plugins: [],
}
```

**Penjelasan konfigurasi:**

- **`content`** — Daftar path yang di-scan Tailwind untuk cari class yang dipakai. Class yang tidak muncul di file ini akan di-purge (tidak masuk bundle).
- **`'./index.html'`** — Selalu scan HTML utama.
- **`'./src/**/*.{js,jsx,ts,tsx,vue}'`** — Scan semua file di folder `src/`. Pattern glob untuk ekstensi yang relevan.
- **`theme.extend`** — TAMBAH design tokens (warna, font, dll) di atas default Tailwind. **Jangan** replace `theme` (hapus semua default).
- **`plugins`** — Plugin resmi atau custom yang akan di-load. Contoh: `@tailwindcss/forms`, `@tailwindcss/typography`.
- **JSDoc `/** @type {import(...)} */`** — Untuk TypeScript intellisense.

```css
/* src/index.css atau resources/css/app.css */
/* Tiga baris ini WAJIB ada — ini yang mengaktifkan Tailwind */
@tailwind base;       /* Reset CSS & base styles */
@tailwind components; /* Komponen yang di-register via @layer */
@tailwind utilities;  /* Semua utility classes */
```

**Penjelasan direktif:**

- **`@tailwind base;`** — Include reset CSS dan base styles (default untuk tag HTML, seperti `h1` punya `font-size`, `body` punya `font-family`). Ini seperti Normalize.css.
- **`@tailwind components;`** — Include class yang di-register via `@layer components` (custom component classes yang Anda buat dengan `@apply`).
- **`@tailwind utilities;`** — Include SEMUA utility classes Tailwind. **Wajib** agar `bg-blue-500` dll bisa dipakai.
- **Urutan penting** — `base` → `components` → `utilities`. Utilities harus paling akhir agar bisa override komponen.

### Cara 2: CDN (Untuk prototyping cepat — tidak untuk production)

```html
<!-- Cukup tambahkan satu baris ini di <head> -->
<script src="https://cdn.tailwindcss.com"></script>
<!-- Semua class Tailwind langsung bisa dipakai -->
```

> ⚠️ **CDN hanya untuk eksperimen!**
> CDN tidak melakukan purging CSS, sehingga bundle size sangat besar (~3MB).
> Untuk project sungguhan, selalu gunakan instalasi npm.

**Penjelasan CDN:**

- **CDN (Content Delivery Network)** — File Tailwind di-host di server eksternal. Browser download langsung.
- **Untuk prototyping** — Cepat tanpa setup. Cocok untuk demo, CodePen, atau testing.
- **Bundle besar** — Tanpa purging, semua class (~50.000) di-include. JS yang men-generate class on-the-fly di browser.
- **Tidak untuk production** — Lambat di first load. Tidak bisa customize. Tidak SEO-friendly.

## 1.5 🛠️ Setup VS Code untuk Tailwind

```
Ekstensi WAJIB dipasang:
┌─────────────────────────────────────────────────────┐
│ Tailwind CSS IntelliSense (oleh Tailwind Labs)      │
│ → Autocomplete class saat mengetik                  │
│ → Preview warna & ukuran saat hover                 │
│ → Linting untuk class yang tidak valid              │
└─────────────────────────────────────────────────────┘

Ekstensi Tambahan yang Disarankan:
• Prettier + prettier-plugin-tailwindcss  → Sort class otomatis
• PostCSS Language Support               → Syntax highlight di .css
• Auto Rename Tag                        → Rename tag HTML berpasangan
```

**Penjelasan setiap ekstensi:**

- **Tailwind CSS IntelliSense** — WAJIB! Memberi autocomplete untuk ribuan class Tailwind. Linting untuk class typo.
- **Prettier + plugin sort** — Otomatis sort class Tailwind di HTML. Contoh: dari `mt-4 flex p-2` jadi `flex mt-4 p-2` (urutan konsisten).
- **PostCSS Language Support** — Syntax highlight untuk file `.css` dan `.config.js`.
- **Auto Rename Tag** — Rename tag HTML berpasangan (mis. rename `<div>` jadi `<section>`, otomatis rename `</div>` jadi `</section>`).

```bash
# Install Prettier + plugin sort class Tailwind
npm install -D prettier prettier-plugin-tailwindcss

# .prettierrc
{
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

**Penjelasan:**

- **Prettier** — Formatter kode (indent, quotes, dll).
- **`prettier-plugin-tailwindcss`** — Plugin yang sort class Tailwind sesuai rekomendasi urutan (layout → spacing → typography → color).
- **`.prettierrc`** — Konfigurasi Prettier (JSON). `plugins` = list plugin yang dipakai.

> 💡 **Tips:**
> Setelah install IntelliSense, cukup ketik sebagian nama class (misalnya `flex`)
> dan tekan `Ctrl+Space` untuk melihat semua pilihan yang tersedia beserta
> preview nilai CSS-nya.

**Penjelasan cara pakai IntelliSense:**

- **Trigger** — Ketik `text-` (prefix) → muncul suggestion: `text-xs`, `text-sm`, dll.
- **Preview** — Hover ke suggestion → lihat nilai CSS-nya (font-size, line-height).
- **Color picker** — Hover ke `bg-blue-500` → muncul color preview.
- **Lint** — Class typo langsung ada garis merah.

## 📌 Ringkasan Bab 1

| Konsep                       | Penjelasan Singkat                                              |
| ---------------------------- | --------------------------------------------------------------- |
| Tailwind CSS                  | Utility-first framework untuk styling                          |
| Utility class                 | Class kecil yang mengerjakan satu hal spesifik                   |
| Mobile-first                 | Default tanpa prefix, breakpoint pakai prefix (md:, lg:)         |
| Tree-shaking                 | Otomatis purge class yang tidak dipakai → bundle kecil         |
| `@tailwind base/components/utilities` | Direktif WAJIB di file CSS utama              |
| IntelliSense                 | Extension VSCode yang WAJIB untuk autocomplete                   |

---

➡️ Lanjut ke [Bab 2 — Cara Berpikir Utility-First](/bagian-1/bab-2) — **Bab paling kritis di ebook ini!**
