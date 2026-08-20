# 🎨 Ebook Tailwind CSS — Panduan Lengkap Styling Frontend
### Dari Utility-First hingga Design System Profesional

---

> 🎯 **Untuk Siapa Ebook Ini?**
> Ebook ini dirancang untuk **semua level** — mulai dari yang baru mengenal CSS,
> hingga yang sudah terbiasa dengan Bootstrap atau CSS biasa dan ingin beralih
> ke pendekatan utility-first yang lebih modern dan efisien.
> Setiap konsep disertai contoh visual, perbandingan nyata, dan studi kasus.

---

> 🧰 **Tech Stack yang Digunakan**
>
> | Tool | Fungsi |
> |---|---|
> | **Tailwind CSS v3** | Framework CSS utama |
> | **Vite** | Build tool + PostCSS pipeline |
> | **PostCSS** | Proses & optimasi CSS |
> | **HTML + JSX** | Contoh implementasi |
> | **VS Code + Extension** | Development environment |

---

## 🗺️ Peta Perjalanan Belajar

```
🟢 BAGIAN I    Fondasi Tailwind CSS          → Bab 1  – 3
🔵 BAGIAN II   Layout & Spacing              → Bab 4  – 6
🟡 BAGIAN III  Typography & Colors           → Bab 7  – 8
🟠 BAGIAN IV   Komponen UI dengan Tailwind   → Bab 9  – 11
🔴 BAGIAN V    Responsive & Dark Mode        → Bab 12 – 13
🟣 BAGIAN VI   Kustomisasi & Design System   → Bab 14 – 16
🏗️  BAGIAN VII  Project: Landing Page Modern  → Bab 17
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: 7 Bagian | 17 Bab | Pemula → Profesional
```

---

## ⭐ Bab Paling Kritis — Jangan Sampai Dilewati!

| Prioritas | Bab | Mengapa Kritis |
|---|---|---|
| 🥇 | **Bab 2** — Cara Berpikir Utility-First | Perubahan mindset paling penting. Tanpa ini Anda akan terus melawan Tailwind alih-alih memanfaatkannya. |
| 🥈 | **Bab 5** — Flexbox & Grid dengan Tailwind | 80% masalah layout selesai di sini. Ini adalah skill yang paling sering dipakai setiap hari. |
| 🥉 | **Bab 14** — Konfigurasi `tailwind.config.js` | Kunci membangun design system yang konsisten dan scalable untuk project nyata. |

---

---

# 🟢 BAGIAN I — Fondasi Tailwind CSS

> 🎯 **Tujuan Bagian Ini:**
> Di akhir Bagian I, Anda memahami apa itu Tailwind CSS, mengapa pendekatannya
> berbeda dari CSS konvensional, dan sudah bisa menulis markup Tailwind
> untuk komponen-komponen dasar.

---

## 📖 Bab 1 — Mengenal Tailwind CSS

---

### 1.1 🤔 Apa itu Tailwind CSS?

Tailwind CSS adalah **utility-first CSS framework** — framework yang menyediakan ribuan class kecil yang masing-masing mengerjakan satu hal spesifik. Daripada menulis CSS dari nol atau menggunakan komponen pre-built seperti Bootstrap, Anda menyusun tampilan langsung di HTML dengan menggabungkan class-class tersebut.

> 💡 **Analogi Sederhana:**
> Jika Bootstrap seperti membeli furnitur jadi di toko — cepat tapi susah
> dimodifikasi, maka Tailwind seperti membeli kayu, cat, dan paku — Anda
> bebas membuat apa saja, dan hasilnya persis sesuai keinginan Anda.

---

### 1.2 ⚖️ Perbandingan: CSS Biasa vs Bootstrap vs Tailwind

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

| Aspek | CSS Biasa | Bootstrap | Tailwind CSS |
|---|---|---|---|
| **Cara kerja** | Tulis CSS custom | Pakai komponen siap pakai | Gabungkan utility classes |
| **Fleksibilitas** | ✅ Total bebas | Terbatas | ✅ Sangat fleksibel |
| **Kecepatan dev** | Lambat | ✅ Cepat awal | ✅ Cepat setelah terbiasa |
| **Bundle size** | Bisa besar | ~30KB (min) | ~5-20KB (hanya yang dipakai) |
| **Uniqueness** | ✅ Unik | Seragam | ✅ Unik |
| **Learning curve** | Rendah | Rendah | Sedang |
| **Dark mode** | Manual | Terbatas | ✅ Built-in |
| **Responsive** | Manual media query | Kelas grid saja | ✅ Prefix di semua class |

---

### 1.3 🏆 Siapa yang Pakai Tailwind?

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

---

### 1.4 📦 Instalasi & Setup

#### Cara 1: Via npm (Untuk project Vite/React/Vue/Laravel)

```bash
# Install Tailwind + PostCSS + Autoprefixer
npm install -D tailwindcss postcss autoprefixer

# Buat file konfigurasi
npx tailwindcss init -p
# Menghasilkan: tailwind.config.js + postcss.config.js
```

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

```css
/* src/index.css atau resources/css/app.css */
/* Tiga baris ini WAJIB ada — ini yang mengaktifkan Tailwind */
@tailwind base;       /* Reset CSS & base styles */
@tailwind components; /* Komponen yang di-register via @layer */
@tailwind utilities;  /* Semua utility classes */
```

#### Cara 2: CDN (Untuk prototyping cepat — tidak untuk production)

```html
<!-- Cukup tambahkan satu baris ini di <head> -->
<script src="https://cdn.tailwindcss.com"></script>
<!-- Semua class Tailwind langsung bisa dipakai -->
```

> ⚠️ **CDN hanya untuk eksperimen!**
> CDN tidak melakukan purging CSS, sehingga bundle size sangat besar (~3MB).
> Untuk project sungguhan, selalu gunakan instalasi npm.

---

### 1.5 🛠️ Setup VS Code untuk Tailwind

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

```bash
# Install Prettier + plugin sort class Tailwind
npm install -D prettier prettier-plugin-tailwindcss

# .prettierrc
{
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

> 💡 **Tips:**
> Setelah install IntelliSense, cukup ketik sebagian nama class (misalnya `flex`)
> dan tekan `Ctrl+Space` untuk melihat semua pilihan yang tersedia beserta
> preview nilai CSS-nya.

---

## 📖 Bab 2 — Cara Berpikir Utility-First

---

### 2.1 🔄 Perubahan Mindset — Ini yang Paling Penting

```
CARA LAMA (CSS Konvensional):

HTML:
  <div class="product-card">
    <img class="product-card__image" src="..." />
    <h3 class="product-card__title">Nama Produk</h3>
  </div>

CSS (file terpisah):
  .product-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    padding: 16px;
    overflow: hidden;
  }
  .product-card__image {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  .product-card__title {
    font-size: 18px;
    font-weight: 600;
    margin-top: 12px;
  }

---

CARA TAILWIND (Utility-First):

HTML saja, tidak perlu file CSS terpisah:
  <div class="bg-white rounded-lg shadow-md p-4 overflow-hidden">
    <img class="w-full h-48 object-cover" src="..." />
    <h3 class="text-lg font-semibold mt-3">Nama Produk</h3>
  </div>
```

---

### 2.2 💡 Mengapa "Menggabungkan Class" Lebih Baik?

```
Perhatikan ini:

Saat Anda edit .product-card di CSS:
  → Anda tidak tahu komponen mana yang terpengaruh tanpa cek semua file HTML
  → Takut hapus karena mungkin dipakai di tempat lain
  → File CSS terus tumbuh, jarang ada yang dihapus

Saat Anda edit class Tailwind di HTML:
  → Anda tahu persis elemen mana yang berubah
  → Hapus elemen = style-nya otomatis ikut hilang dari bundle
  → Tidak ada "CSS yang tidak terpakai" — Tailwind hanya bundling yang dipakai
```

---

### 2.3 🔍 Anatomi Sebuah Class Tailwind

```
    bg    -    blue   -    500
     │              │          │
     │         Nama warna   Shade (50-950)
     │
  Properti CSS
  (background-color)

Contoh lain:
  text-xl       → font-size: 1.25rem
  p-4           → padding: 1rem (16px)
  mt-8          → margin-top: 2rem (32px)
  rounded-lg    → border-radius: 0.5rem
  shadow-md     → box-shadow: medium shadow
  flex          → display: flex
  items-center  → align-items: center
  gap-4         → gap: 1rem
```

---

### 2.4 📐 Sistem Spacing Tailwind — Satuan yang Konsisten

Tailwind menggunakan skala spacing berbasis angka. **Setiap unit = 0.25rem = 4px.**

```
Angka  →  rem    →  px
──────────────────────
0      →  0      →  0px
0.5    →  0.125  →  2px
1      →  0.25   →  4px
2      →  0.5    →  8px
3      →  0.75   →  12px
4      →  1      →  16px   ← Paling sering dipakai
5      →  1.25   →  20px
6      →  1.5    →  24px
8      →  2      →  32px
10     →  2.5    →  40px
12     →  3      →  48px
16     →  4      →  64px
20     →  5      →  80px
24     →  6      →  96px
32     →  8      →  128px
```

> 💡 **Pakai angka ini untuk:**
> - `p-{n}` → padding semua sisi
> - `px-{n}` → padding kiri-kanan, `py-{n}` → padding atas-bawah
> - `pt-{n}` `pr-{n}` `pb-{n}` `pl-{n}` → padding per sisi
> - `m-{n}` `mx-{n}` `my-{n}` `mt-{n}` dst → margin
> - `gap-{n}` → gap di flex/grid
> - `space-x-{n}` → gap horizontal antar child
> - `w-{n}` `h-{n}` → width & height

---

### 2.5 🎯 Class Tailwind yang Paling Sering Dipakai (Top 30)

```css
/* DISPLAY & LAYOUT */
flex            → display: flex
grid            → display: grid
block           → display: block
hidden          → display: none
container       → max-width responsif + mx-auto

/* FLEXBOX */
items-center    → align-items: center
items-start     → align-items: flex-start
justify-center  → justify-content: center
justify-between → justify-content: space-between
flex-col        → flex-direction: column
flex-wrap       → flex-wrap: wrap
flex-1          → flex: 1 1 0%
gap-4           → gap: 1rem

/* SIZING */
w-full          → width: 100%
w-screen        → width: 100vw
h-full          → height: 100%
h-screen        → height: 100vh
min-h-screen    → min-height: 100vh
max-w-{size}    → max-width (sm/md/lg/xl/2xl/prose)

/* SPACING */
p-4             → padding: 1rem
px-6 py-3       → padding horizontal 1.5rem, vertikal 0.75rem
mx-auto         → margin: 0 auto (center horizontal)
mt-4 mb-8       → margin top & bottom

/* TYPOGRAPHY */
text-sm         → font-size: 0.875rem
text-base       → font-size: 1rem
text-xl         → font-size: 1.25rem
text-3xl        → font-size: 1.875rem
font-medium     → font-weight: 500
font-semibold   → font-weight: 600
font-bold       → font-weight: 700
text-center     → text-align: center
leading-relaxed → line-height: 1.625
tracking-wide   → letter-spacing: 0.025em

/* BACKGROUND & BORDER */
bg-white        → background-color: white
bg-gray-100     → background-color: #f3f4f6
rounded         → border-radius: 0.25rem
rounded-lg      → border-radius: 0.5rem
rounded-full    → border-radius: 9999px (lingkaran)
border          → border-width: 1px
border-gray-200 → border-color: #e5e7eb

/* SHADOW & EFEK */
shadow          → box-shadow: small
shadow-md       → box-shadow: medium
shadow-lg       → box-shadow: large
shadow-xl       → box-shadow: extra large
opacity-50      → opacity: 0.5
overflow-hidden → overflow: hidden
```

---

### 2.6 🔗 Pseudo-class Prefix — Hover, Focus, Active

```html
<!-- Semua state ditulis sebagai prefix langsung di class -->

<!-- Hover -->
<button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
  Tombol Hover
</button>

<!-- Focus (untuk accessibility) -->
<input class="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded px-3 py-2" />

<!-- Active -->
<button class="bg-blue-600 active:bg-blue-800 active:scale-95 ...">
  Klik saya
</button>

<!-- Group hover — hover parent mempengaruhi child -->
<div class="group bg-white hover:bg-blue-600 p-4 rounded-lg cursor-pointer">
  <h3 class="text-gray-900 group-hover:text-white font-bold">Judul</h3>
  <p class="text-gray-500 group-hover:text-blue-100 text-sm">Deskripsi</p>
  <span class="text-blue-600 group-hover:text-white">Lihat Detail →</span>
</div>

<!-- Peer — satu elemen mempengaruhi sibling-nya -->
<input type="checkbox" class="peer hidden" id="toggle" />
<label for="toggle" class="cursor-pointer">
  <div class="w-12 h-6 bg-gray-300 peer-checked:bg-blue-600 rounded-full transition-colors">
    <div class="w-5 h-5 bg-white rounded-full shadow translate-x-0.5 peer-checked:translate-x-6 transition-transform"></div>
  </div>
</label>
```

---

## 📖 Bab 3 — Typography & Text Utilities

---

### 3.1 📏 Skala Font Size

```html
<!-- Semua ukuran font bawaan Tailwind -->
<p class="text-xs">text-xs → 12px / 0.75rem</p>
<p class="text-sm">text-sm → 14px / 0.875rem</p>
<p class="text-base">text-base → 16px / 1rem (default)</p>
<p class="text-lg">text-lg → 18px / 1.125rem</p>
<p class="text-xl">text-xl → 20px / 1.25rem</p>
<p class="text-2xl">text-2xl → 24px / 1.5rem</p>
<p class="text-3xl">text-3xl → 30px / 1.875rem</p>
<p class="text-4xl">text-4xl → 36px / 2.25rem</p>
<p class="text-5xl">text-5xl → 48px / 3rem</p>
<p class="text-6xl">text-6xl → 60px / 3.75rem</p>
<p class="text-7xl">text-7xl → 72px / 4.5rem</p>
<p class="text-8xl">text-8xl → 96px / 6rem</p>
<p class="text-9xl">text-9xl → 128px / 8rem</p>
```

---

### 3.2 🔤 Font Weight

```html
<p class="font-thin">font-thin → 100</p>
<p class="font-extralight">font-extralight → 200</p>
<p class="font-light">font-light → 300</p>
<p class="font-normal">font-normal → 400</p>
<p class="font-medium">font-medium → 500</p>
<p class="font-semibold">font-semibold → 600</p>
<p class="font-bold">font-bold → 700</p>
<p class="font-extrabold">font-extrabold → 800</p>
<p class="font-black">font-black → 900</p>
```

---

### 3.3 📐 Line Height, Letter Spacing & Text Align

```html
<!-- Line Height -->
<p class="leading-none">leading-none → 1</p>
<p class="leading-tight">leading-tight → 1.25</p>
<p class="leading-snug">leading-snug → 1.375</p>
<p class="leading-normal">leading-normal → 1.5</p>
<p class="leading-relaxed">leading-relaxed → 1.625</p>
<p class="leading-loose">leading-loose → 2</p>

<!-- Letter Spacing (Tracking) -->
<p class="tracking-tighter">tracking-tighter → -0.05em</p>
<p class="tracking-tight">tracking-tight → -0.025em</p>
<p class="tracking-normal">tracking-normal → 0em</p>
<p class="tracking-wide">tracking-wide → 0.025em</p>
<p class="tracking-wider">tracking-wider → 0.05em</p>
<p class="tracking-widest">tracking-widest → 0.1em</p>

<!-- Text Align -->
<p class="text-left">Rata kiri</p>
<p class="text-center">Tengah</p>
<p class="text-right">Rata kanan</p>
<p class="text-justify">Rata kiri-kanan</p>

<!-- Text Decoration & Transform -->
<p class="underline">underline</p>
<p class="line-through">line-through</p>
<p class="no-underline">no-underline</p>
<p class="uppercase">uppercase</p>
<p class="lowercase">lowercase</p>
<p class="capitalize">capitalize — hanya huruf pertama</p>

<!-- Text Overflow -->
<p class="truncate">Teks yang terlalu panjang akan terpotong dengan ...</p>
<p class="overflow-ellipsis overflow-hidden whitespace-nowrap">Sama seperti truncate</p>
<p class="break-words">Pecah kata jika terlalu panjang</p>
```

---

### 3.4 🎬 Studi Kasus: Tipografi Artikel Blog

```html
<article class="max-w-2xl mx-auto px-4 py-12">
  <!-- Badge kategori -->
  <span class="text-xs font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
    Tutorial
  </span>

  <!-- Judul artikel -->
  <h1 class="text-4xl font-bold text-gray-900 leading-tight mt-4 mb-3">
    Panduan Lengkap Tailwind CSS untuk Pemula
  </h1>

  <!-- Meta info -->
  <div class="flex items-center gap-4 text-sm text-gray-500 mb-8">
    <span>Oleh <span class="font-medium text-gray-700">Budi Santoso</span></span>
    <span>·</span>
    <span>12 Januari 2025</span>
    <span>·</span>
    <span>8 menit baca</span>
  </div>

  <!-- Konten artikel -->
  <div class="prose prose-lg"> <!-- prose: dari @tailwindcss/typography -->
    <p class="text-lg text-gray-600 leading-relaxed mb-6">
      Tailwind CSS adalah framework yang mengubah cara kita menulis CSS.
      Dengan pendekatan utility-first, produktivitas meningkat drastis.
    </p>
    <h2 class="text-2xl font-bold text-gray-900 mt-10 mb-4">
      Mengapa Utility-First?
    </h2>
    <p class="text-gray-600 leading-relaxed">
      Daripada menulis class semantik seperti <code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-red-600">.card-header</code>,
      kita langsung menggabungkan utility classes...
    </p>
  </div>
</article>
```

---

---

# 🔵 BAGIAN II — Layout & Spacing

> 🎯 **Tujuan Bagian Ini:**
> Menguasai sistem layout Tailwind — dari box model, Flexbox,
> hingga Grid — sehingga Anda bisa membangun struktur halaman
> apapun tanpa menulis CSS manual.

---

## 📖 Bab 4 — Box Model, Sizing & Positioning

---

### 4.1 📦 Box Model dengan Tailwind

```html
<!-- WIDTH -->
<div class="w-full">  100% parent  </div>
<div class="w-1/2">   50% parent   </div>
<div class="w-1/3">   33.33%       </div>
<div class="w-64">    256px (16rem) </div>
<div class="w-screen">100vw         </div>
<div class="w-fit">   fit-content   </div>
<div class="w-max">   max-content   </div>
<div class="w-min">   min-content   </div>

<!-- HEIGHT -->
<div class="h-full">    100% parent  </div>
<div class="h-screen">  100vh        </div>
<div class="h-48">      192px        </div>
<div class="h-px">      1px          </div>
<div class="min-h-screen"> min 100vh </div>

<!-- MAX-WIDTH (sangat berguna untuk container konten) -->
<div class="max-w-sm">   384px  </div>
<div class="max-w-md">   448px  </div>
<div class="max-w-lg">   512px  </div>
<div class="max-w-xl">   576px  </div>
<div class="max-w-2xl">  672px  </div>
<div class="max-w-4xl">  896px  </div>
<div class="max-w-6xl">  1152px </div>
<div class="max-w-7xl">  1280px </div>
<div class="max-w-prose"> ~65ch — ideal untuk artikel </div>

<!-- OVERFLOW -->
<div class="overflow-hidden">  Konten terpotong          </div>
<div class="overflow-auto">    Scroll jika perlu         </div>
<div class="overflow-scroll">  Selalu ada scrollbar      </div>
<div class="overflow-x-auto">  Scroll horizontal saja    </div>
<div class="overflow-y-auto">  Scroll vertikal saja      </div>
```

---

### 4.2 📍 Positioning

```html
<!-- Position -->
<div class="relative">
  <!-- Parent: relative, menjadi "jangkar" untuk child absolute -->
  <div class="absolute top-0 right-0">Badge pojok kanan atas</div>
  <div class="absolute inset-0 bg-black/50">Overlay penuh</div>
  <div class="absolute bottom-4 left-1/2 -translate-x-1/2">Tengah bawah</div>
</div>

<div class="fixed top-0 left-0 right-0 z-50 bg-white shadow">
  Navbar fixed — selalu di atas saat scroll
</div>

<div class="sticky top-16 z-40">
  Sticky — ikut scroll sampai menyentuh top:64px, lalu berhenti
</div>

<!-- Z-Index -->
<div class="z-0">   z-index: 0   </div>
<div class="z-10">  z-index: 10  </div>
<div class="z-20">  z-index: 20  </div>
<div class="z-30">  z-index: 30  </div>
<div class="z-40">  z-index: 40  </div>
<div class="z-50">  z-index: 50  </div>
<div class="z-auto">z-index: auto</div>

<!-- Inset — shortcut untuk top/right/bottom/left -->
<div class="inset-0">        top:0 right:0 bottom:0 left:0 (stretch penuh) </div>
<div class="inset-x-0">      left:0 right:0 (stretch horizontal)           </div>
<div class="inset-y-0">      top:0 bottom:0 (stretch vertikal)             </div>
<div class="top-1/2 -translate-y-1/2"> Vertical center trick              </div>
```

---

### 4.3 🎬 Studi Kasus: Card dengan Badge Absolute

```html
<!-- Card listing properti — badge di pojok, overlay gradient di bawah -->
<div class="relative rounded-xl overflow-hidden group cursor-pointer">

  <!-- Gambar -->
  <img
    src="property.jpg"
    alt="Villa Bali"
    class="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
  />

  <!-- Badge "Superhost" di pojok kiri atas -->
  <span class="absolute top-3 left-3 bg-white text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow">
    ⭐ Superhost
  </span>

  <!-- Tombol wishlist di pojok kanan atas -->
  <button class="absolute top-3 right-3 bg-white/80 hover:bg-white p-2 rounded-full shadow transition-colors">
    🤍
  </button>

  <!-- Gradient overlay di bawah -->
  <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent">
    <div class="absolute bottom-3 left-3 text-white">
      <p class="font-semibold text-sm">Villa Ubud · Bali</p>
      <p class="text-xs text-white/80">⭐ 4.9 · 128 ulasan</p>
    </div>
  </div>

</div>
```

---

## 📖 Bab 5 — Flexbox dengan Tailwind

---

### 5.1 🔧 Konsep Flexbox Review

```
Parent (flex container):
  display: flex     → flex
  flex-direction    → flex-row (default) | flex-col | flex-row-reverse | flex-col-reverse
  justify-content   → justify-start | justify-center | justify-end | justify-between | justify-around | justify-evenly
  align-items       → items-start | items-center | items-end | items-stretch | items-baseline
  align-content     → (untuk multi-line) content-start | content-center | content-between
  flex-wrap         → flex-nowrap (default) | flex-wrap | flex-wrap-reverse
  gap               → gap-{n} | gap-x-{n} | gap-y-{n}

Child (flex item):
  flex-grow         → grow | grow-0
  flex-shrink       → shrink | shrink-0
  flex-basis        → basis-{n} | basis-auto | basis-full
  flex (shorthand)  → flex-1 | flex-auto | flex-none | flex-initial
  align-self        → self-auto | self-start | self-center | self-end
  order             → order-first | order-last | order-{1-12}
```

---

### 5.2 📐 Pola Flexbox yang Paling Sering Dipakai

```html
<!-- ① Horizontal centering — logo di navbar -->
<nav class="flex items-center justify-between px-6 py-4">
  <span class="font-bold text-xl">Logo</span>
  <div class="flex items-center gap-6">
    <a href="#">Beranda</a>
    <a href="#">Tentang</a>
    <button class="bg-blue-600 text-white px-4 py-2 rounded-lg">Masuk</button>
  </div>
</nav>

<!-- ② Card dengan footer yang selalu di bawah -->
<div class="flex flex-col h-full bg-white rounded-lg p-4 border">
  <img src="..." class="w-full h-40 object-cover rounded-md" />
  <h3 class="font-semibold mt-3">Judul Produk</h3>
  <p class="text-gray-500 text-sm mt-1 flex-1"> <!-- flex-1 mendorong footer ke bawah -->
    Deskripsi produk yang bisa panjang atau pendek...
  </p>
  <div class="flex items-center justify-between mt-4 pt-4 border-t">
    <span class="font-bold text-blue-600">Rp 250.000</span>
    <button class="bg-blue-600 text-white px-3 py-1.5 rounded text-sm">Beli</button>
  </div>
</div>

<!-- ③ Centering penuh (vertical + horizontal) — hero section, empty state -->
<div class="flex items-center justify-center min-h-screen bg-gray-50">
  <div class="text-center">
    <h1 class="text-4xl font-bold">Selamat Datang</h1>
    <p class="text-gray-500 mt-2">Mulai perjalanan Anda di sini.</p>
  </div>
</div>

<!-- ④ Sidebar layout -->
<div class="flex min-h-screen">
  <!-- Sidebar — lebar tetap -->
  <aside class="w-64 shrink-0 bg-gray-900 text-white p-6">
    <nav class="flex flex-col gap-2">
      <a href="#" class="px-3 py-2 rounded-lg hover:bg-gray-700">Dashboard</a>
      <a href="#" class="px-3 py-2 rounded-lg hover:bg-gray-700">Produk</a>
    </nav>
  </aside>
  <!-- Konten utama — mengisi sisa ruang -->
  <main class="flex-1 p-8 bg-gray-50">
    Konten halaman
  </main>
</div>

<!-- ⑤ Baris dengan spasi rata -->
<div class="flex items-center justify-between">
  <span>Label</span>
  <span class="font-semibold">Nilai</span>
</div>

<!-- ⑥ Tag / chip list yang wrapping -->
<div class="flex flex-wrap gap-2">
  <span class="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">React</span>
  <span class="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">Tailwind</span>
  <span class="bg-purple-100 text-purple-700 text-sm px-3 py-1 rounded-full">TypeScript</span>
</div>
```

---

### 5.3 🎬 Studi Kasus: Navbar Responsif

```html
<header class="bg-white border-b border-gray-200 sticky top-0 z-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">

      <!-- Logo -->
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-sm">A</span>
        </div>
        <span class="font-bold text-gray-900 text-lg">Airbnb</span>
      </div>

      <!-- Search bar tengah -->
      <div class="hidden md:flex items-center border border-gray-300 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer gap-3">
        <span class="text-sm font-medium text-gray-700">Di mana saja</span>
        <span class="w-px h-4 bg-gray-300"></span>
        <span class="text-sm font-medium text-gray-700">Kapan saja</span>
        <span class="w-px h-4 bg-gray-300"></span>
        <span class="text-sm text-gray-500">Tambah tamu</span>
        <div class="bg-red-500 rounded-full p-1.5">
          <svg class="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a7 7 0 100 14A7 7 0 009 2zm6.32 12.9l3.38 3.38-1.42 1.42-3.38-3.38A8.5 8.5 0 1115.32 14.9z"/>
          </svg>
        </div>
      </div>

      <!-- Menu kanan -->
      <div class="flex items-center gap-2">
        <a href="#" class="hidden md:block text-sm font-medium text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-full transition-colors">
          Jadi Host
        </a>
        <button class="flex items-center gap-2 border border-gray-300 rounded-full px-3 py-2 hover:shadow-md transition-shadow">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <div class="w-7 h-7 bg-gray-500 rounded-full flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
          </div>
        </button>
      </div>

    </div>
  </div>
</header>
```

---

## 📖 Bab 6 — CSS Grid dengan Tailwind

---

### 6.1 🔧 Dasar Grid Tailwind

```html
<!-- Grid dengan kolom tetap -->
<div class="grid grid-cols-3 gap-4">
  <div class="bg-blue-100 p-4 rounded">Kolom 1</div>
  <div class="bg-blue-100 p-4 rounded">Kolom 2</div>
  <div class="bg-blue-100 p-4 rounded">Kolom 3</div>
</div>

<!-- Grid responsive — 1 kolom di mobile, 2 di tablet, 4 di desktop -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  <!-- Card produk, dll -->
</div>

<!-- Grid dengan colspan — item memakan lebih dari 1 kolom -->
<div class="grid grid-cols-3 gap-4">
  <div class="col-span-2 bg-blue-200 p-4 rounded">Lebar 2 kolom</div>
  <div class="col-span-1 bg-blue-100 p-4 rounded">Lebar 1 kolom</div>
  <div class="col-span-3 bg-blue-300 p-4 rounded">Lebar penuh (3 kolom)</div>
</div>

<!-- Grid dengan baris — row span -->
<div class="grid grid-cols-3 grid-rows-3 gap-4 h-96">
  <div class="col-span-2 row-span-2 bg-blue-500 rounded">Besar (2x2)</div>
  <div class="bg-blue-200 rounded">Kecil 1</div>
  <div class="bg-blue-200 rounded">Kecil 2</div>
  <div class="col-span-3 bg-blue-300 rounded">Full width bawah</div>
</div>
```

---

### 6.2 📐 Auto-fit & Auto-fill — Grid yang Benar-benar Responsif

```html
<!-- Grid yang otomatis tentukan jumlah kolom berdasarkan lebar minimum item -->
<!-- Tidak perlu breakpoint manual! -->
<div class="grid gap-6"
     style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))">
  <!-- Item akan mengisi kolom, minimum 280px per item -->
  <!-- Secara otomatis wrap ke baris baru jika tidak muat -->
</div>

<!-- Alternatif dengan arbitrary value Tailwind -->
<div class="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
  ...
</div>
```

---

### 6.3 🎬 Studi Kasus: Layout Dashboard Admin

```html
<div class="min-h-screen bg-gray-100">

  <!-- Navbar -->
  <header class="bg-white shadow-sm h-16 flex items-center px-6">
    <h1 class="text-xl font-bold text-gray-800">Dashboard</h1>
  </header>

  <div class="flex">
    <!-- Sidebar -->
    <aside class="w-56 shrink-0 bg-white shadow-sm min-h-[calc(100vh-4rem)] p-4">
      <nav class="flex flex-col gap-1">
        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 text-blue-700 font-medium text-sm">
          📊 Overview
        </a>
        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 text-gray-600 text-sm">
          📦 Produk
        </a>
        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 text-gray-600 text-sm">
          🛒 Pesanan
        </a>
        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 text-gray-600 text-sm">
          👤 Pelanggan
        </a>
      </nav>
    </aside>

    <!-- Konten utama -->
    <main class="flex-1 p-6">

      <!-- Stat cards — 4 kolom di desktop, 2 di tablet, 1 di mobile -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p class="text-sm text-gray-500 font-medium">Total Pendapatan</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">Rp 48.5jt</p>
          <p class="text-xs text-green-600 mt-2 font-medium">↑ 12% dari bulan lalu</p>
        </div>
        <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p class="text-sm text-gray-500 font-medium">Total Pesanan</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">1,284</p>
          <p class="text-xs text-green-600 mt-2 font-medium">↑ 8% dari bulan lalu</p>
        </div>
        <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p class="text-sm text-gray-500 font-medium">Pelanggan Baru</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">384</p>
          <p class="text-xs text-red-500 mt-2 font-medium">↓ 3% dari bulan lalu</p>
        </div>
        <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p class="text-sm text-gray-500 font-medium">Rata-rata Order</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">Rp 378rb</p>
          <p class="text-xs text-green-600 mt-2 font-medium">↑ 5% dari bulan lalu</p>
        </div>
      </div>

      <!-- Baris bawah: grafik + tabel -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <!-- Grafik — mengambil 2 kolom -->
        <div class="xl:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 class="font-semibold text-gray-800 mb-4">Tren Penjualan</h2>
          <!-- Area grafik (akan diisi library chart) -->
          <div class="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
            Chart Area
          </div>
        </div>

        <!-- Produk terlaris — 1 kolom -->
        <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 class="font-semibold text-gray-800 mb-4">Produk Terlaris</h2>
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gray-100 rounded-lg"></div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-800 truncate">Sepatu Lari Pro</p>
                <p class="text-xs text-gray-500">234 terjual</p>
              </div>
              <span class="text-sm font-semibold text-gray-900">Rp 4.2jt</span>
            </div>
          </div>
        </div>
      </div>

    </main>
  </div>
</div>
```

---

---

# 🟡 BAGIAN III — Typography & Colors

> 🎯 **Tujuan Bagian Ini:**
> Menguasai sistem warna Tailwind, menggunakannya secara
> konsisten, dan membangun hierarki tipografi yang profesional.

---

## 📖 Bab 7 — Sistem Warna Tailwind

---

### 7.1 🎨 Palet Warna Bawaan

Tailwind menyediakan 22 warna dengan 11 shade masing-masing (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950).

```html
<!-- Format: {prefix}-{warna}-{shade} -->
<!-- prefix: text, bg, border, ring, shadow, from, to, via, fill, stroke -->

<!-- GRAY SCALE — paling sering dipakai -->
<div class="text-gray-50">  text paling terang  </div>
<div class="text-gray-100"> ... </div>
<div class="text-gray-200"> ... </div>
<div class="text-gray-300"> untuk disabled      </div>
<div class="text-gray-400"> untuk placeholder   </div>
<div class="text-gray-500"> untuk hint/label    </div>
<div class="text-gray-600"> untuk body text     </div>
<div class="text-gray-700"> untuk subheading    </div>
<div class="text-gray-800"> untuk heading       </div>
<div class="text-gray-900"> untuk judul utama   </div>
<div class="text-gray-950"> paling gelap        </div>

<!-- WARNA UTAMA (sama strukturnya untuk semua warna) -->
<!-- Slate, Zinc, Neutral, Stone (gray-tone) -->
<!-- Red, Orange, Amber, Yellow (hangat) -->
<!-- Lime, Green, Emerald, Teal (hijau) -->
<!-- Cyan, Sky, Blue, Indigo (biru) -->
<!-- Violet, Purple, Fuchsia, Pink, Rose (merah-ungu) -->

<!-- CONTOH PENGGUNAAN BERMAKNA -->
<span class="text-green-600">✓ Berhasil</span>
<span class="text-red-600">✗ Gagal</span>
<span class="text-yellow-600">⚠ Peringatan</span>
<span class="text-blue-600">ℹ Informasi</span>

<div class="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
  Alert sukses
</div>
<div class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
  Alert error
</div>
```

---

### 7.2 🖌️ Background, Gradient & Opacity

```html
<!-- Solid background -->
<div class="bg-blue-600">Biru solid</div>
<div class="bg-white">Putih</div>
<div class="bg-transparent">Transparan</div>

<!-- Gradient -->
<div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl">
  Gradient kiri ke kanan
</div>
<div class="bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 text-white p-4 rounded-xl">
  Gradient diagonal dengan via
</div>

<!-- Opacity pada background (tanpa mempengaruhi text) -->
<div class="bg-blue-600/20 text-blue-800 p-4 rounded-lg">
  Background 20% opacity — cara modern (Tailwind v3+)
</div>

<!-- Opacity pada teks -->
<p class="text-gray-900/70">Teks dengan 70% opacity</p>

<!-- Background image -->
<div class="bg-cover bg-center bg-no-repeat h-64" style="background-image: url('/hero.jpg')">
  <!-- Overlay di atas background image -->
  <div class="h-full bg-black/40 flex items-center justify-center">
    <h1 class="text-white text-4xl font-bold">Hero Section</h1>
  </div>
</div>
```

---

### 7.3 🔲 Border, Ring & Divide

```html
<!-- Border -->
<div class="border">                   border: 1px solid (pakai warna default)     </div>
<div class="border-2">                 border: 2px solid                            </div>
<div class="border-4">                 border: 4px solid                            </div>
<div class="border-gray-300">          border-color: gray-300                       </div>
<div class="border-t">                 border hanya atas                            </div>
<div class="border-x">                 border kiri + kanan                          </div>
<div class="border-dashed">            border-style: dashed                         </div>
<div class="border-dotted">            border-style: dotted                         </div>

<!-- Ring — seperti border tapi pakai box-shadow, tidak pengaruhi layout -->
<input class="ring-2 ring-blue-500 ring-offset-2 outline-none rounded px-3 py-2" />
<!-- ring-offset: jarak antara ring dan elemen (seperti "aura" di luar border) -->

<!-- Divide — garis antara flex/grid children -->
<div class="flex flex-col divide-y divide-gray-200">
  <div class="py-3">Item 1</div>
  <div class="py-3">Item 2</div>
  <div class="py-3">Item 3</div>
</div>

<!-- Border radius -->
<div class="rounded-none">   0px      </div>
<div class="rounded-sm">     2px      </div>
<div class="rounded">        4px      </div>
<div class="rounded-md">     6px      </div>
<div class="rounded-lg">     8px      </div>
<div class="rounded-xl">     12px     </div>
<div class="rounded-2xl">    16px     </div>
<div class="rounded-3xl">    24px     </div>
<div class="rounded-full">   9999px   </div>

<!-- Rounded per sudut -->
<div class="rounded-t-xl">     atas kiri + atas kanan  </div>
<div class="rounded-b-xl">     bawah kiri + bawah kanan </div>
<div class="rounded-tl-xl">    hanya sudut atas kiri    </div>
```

---

## 📖 Bab 8 — Shadow, Effects & Transitions

---

### 8.1 🌑 Box Shadow

```html
<div class="shadow-sm">    sangat tipis (1px blur)      </div>
<div class="shadow">       tipis (default)              </div>
<div class="shadow-md">    sedang                       </div>
<div class="shadow-lg">    besar                        </div>
<div class="shadow-xl">    sangat besar                 </div>
<div class="shadow-2xl">   ekstra besar                 </div>
<div class="shadow-none">  hapus shadow                 </div>
<div class="shadow-inner"> bayangan ke dalam            </div>

<!-- Shadow berwarna (Tailwind v3.0+) -->
<div class="shadow-lg shadow-blue-500/30 bg-blue-600 text-white p-4 rounded-xl">
  Card dengan colored shadow
</div>

<!-- Hover shadow — efek lift saat hover -->
<div class="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
  Hover untuk shadow lebih besar
</div>
```

---

### 8.2 ✨ Transform & Transisi

```html
<!-- Transition — wajib untuk animasi halus -->
<div class="transition-all duration-200 ease-in-out">Semua properti</div>
<div class="transition-colors duration-150">Hanya warna</div>
<div class="transition-transform duration-300">Hanya transform</div>
<div class="transition-opacity duration-500">Hanya opacity</div>

<!-- Duration -->
<!-- duration-75, duration-100, duration-150, duration-200, duration-300, duration-500, duration-700, duration-1000 -->

<!-- Timing Function -->
<!-- ease-linear, ease-in, ease-out, ease-in-out -->

<!-- Transform -->
<div class="hover:scale-105 transition-transform">Membesar saat hover</div>
<div class="hover:scale-95 active:scale-90">Mengecil saat klik</div>
<div class="hover:-translate-y-1">Naik saat hover</div>
<div class="hover:translate-x-2">Geser kanan saat hover</div>
<div class="hover:rotate-3">Rotate sedikit saat hover</div>
<div class="hover:-rotate-3">Rotate berlawanan</div>
<div class="hover:skew-x-3">Skew horizontal</div>

<!-- Gabungan transform + transition (card lift effect) -->
<div class="bg-white rounded-xl p-5 shadow border hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer">
  Card yang terangkat saat hover
</div>
```

---

### 8.3 🌈 Filter & Backdrop Filter

```html
<!-- Filter pada elemen -->
<img class="blur-sm" src="...">           <!-- Kabur sedikit      -->
<img class="blur-md" src="...">           <!-- Kabur sedang       -->
<img class="blur-none" src="...">         <!-- Tidak kabur        -->
<img class="brightness-50" src="...">     <!-- Gelap 50%          -->
<img class="brightness-110" src="...">    <!-- Cerah sedikit      -->
<img class="grayscale" src="...">         <!-- Hitam putih        -->
<img class="sepia" src="...">             <!-- Efek sepia         -->
<img class="invert" src="...">            <!-- Warna dibalik      -->
<img class="saturate-200" src="...">      <!-- Saturasi 2x        -->

<!-- Backdrop filter — efek di belakang elemen (kaca buram) -->
<div class="backdrop-blur-md bg-white/30 border border-white/20 rounded-xl p-4 text-white">
  Glassmorphism card — konten di belakangnya terlihat blur
</div>

<!-- Contoh full: hero dengan glassmorphism -->
<div class="relative h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
  <div class="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 max-w-md text-white text-center shadow-xl">
    <h1 class="text-3xl font-bold mb-3">Selamat Datang</h1>
    <p class="text-white/80 mb-6">Masuk ke akun Anda</p>
    <button class="w-full bg-white text-blue-900 font-semibold py-3 rounded-xl hover:bg-blue-50 transition-colors">
      Masuk
    </button>
  </div>
</div>
```

---

---

# 🟠 BAGIAN IV — Komponen UI dengan Tailwind

> 🎯 **Tujuan Bagian Ini:**
> Membangun komponen UI yang sering dipakai — button, form, card,
> modal, navbar — menggunakan Tailwind secara profesional.

---

## 📖 Bab 9 — Komponen Button & Form

---

### 9.1 🔘 Sistem Button yang Lengkap

```html
<!-- Variant: Primary -->
<button class="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium px-5 py-2.5 rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed">
  Simpan Data
</button>

<!-- Variant: Secondary (outlined) -->
<button class="inline-flex items-center gap-2 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-medium px-5 py-2.5 rounded-lg transition-all duration-150">
  Batal
</button>

<!-- Variant: Ghost -->
<button class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium px-4 py-2 rounded-lg transition-colors">
  Selengkapnya
</button>

<!-- Variant: Destructive (danger) -->
<button class="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors">
  🗑️ Hapus
</button>

<!-- Variant: Success -->
<button class="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors">
  ✓ Konfirmasi
</button>

<!-- Size: Small -->
<button class="text-xs font-medium px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors">
  Kecil
</button>

<!-- Size: Large -->
<button class="text-base font-semibold px-8 py-3.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5">
  Besar
</button>

<!-- Full width -->
<button class="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors">
  Login dengan Email
</button>

<!-- Icon button -->
<button class="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900">
  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
  </svg>
</button>

<!-- Loading state -->
<button class="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-5 py-2.5 rounded-lg opacity-80 cursor-not-allowed" disabled>
  <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
  </svg>
  Menyimpan...
</button>
```

---

### 9.2 📝 Komponen Form yang Lengkap

```html
<form class="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg">
  <h2 class="text-2xl font-bold text-gray-900 mb-6">Buat Akun</h2>

  <!-- Input group dengan floating label style -->
  <div class="flex flex-col gap-5">

    <!-- Input teks normal -->
    <div class="flex flex-col gap-1.5">
      <label for="name" class="text-sm font-medium text-gray-700">
        Nama Lengkap <span class="text-red-500">*</span>
      </label>
      <input
        id="name" type="text" placeholder="Budi Santoso"
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
      />
    </div>

    <!-- Input dengan error state -->
    <div class="flex flex-col gap-1.5">
      <label for="email" class="text-sm font-medium text-gray-700">Email</label>
      <input
        id="email" type="email" placeholder="budi@email.com"
        class="w-full px-4 py-2.5 border border-red-400 rounded-lg text-gray-900 bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
      />
      <p class="text-xs text-red-600 flex items-center gap-1">
        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"/>
        </svg>
        Format email tidak valid
      </p>
    </div>

    <!-- Input dengan icon -->
    <div class="flex flex-col gap-1.5">
      <label for="password" class="text-sm font-medium text-gray-700">Password</label>
      <div class="relative">
        <input
          id="password" type="password" placeholder="Min. 8 karakter"
          class="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          👁️
        </button>
      </div>
    </div>

    <!-- Select -->
    <div class="flex flex-col gap-1.5">
      <label for="role" class="text-sm font-medium text-gray-700">Peran</label>
      <select id="role" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
        <option value="">Pilih peran</option>
        <option value="buyer">Pembeli</option>
        <option value="seller">Penjual</option>
      </select>
    </div>

    <!-- Textarea -->
    <div class="flex flex-col gap-1.5">
      <label for="bio" class="text-sm font-medium text-gray-700">Bio</label>
      <textarea
        id="bio" rows="3" placeholder="Ceritakan tentang diri Anda..."
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      ></textarea>
      <p class="text-xs text-gray-400 text-right">0 / 200 karakter</p>
    </div>

    <!-- Checkbox -->
    <div class="flex items-start gap-3">
      <input
        type="checkbox" id="terms"
        class="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
      />
      <label for="terms" class="text-sm text-gray-600 cursor-pointer">
        Saya menyetujui <a href="#" class="text-blue-600 hover:underline font-medium">Syarat & Ketentuan</a>
        dan <a href="#" class="text-blue-600 hover:underline font-medium">Kebijakan Privasi</a>
      </label>
    </div>

    <!-- Submit button -->
    <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors mt-2">
      Buat Akun
    </button>

    <p class="text-center text-sm text-gray-500">
      Sudah punya akun?
      <a href="#" class="text-blue-600 hover:underline font-medium">Masuk</a>
    </p>
  </div>
</form>
```

---

## 📖 Bab 10 — Card, List & Table

---

### 10.1 🃏 Variasi Card

```html
<!-- Card Dasar -->
<div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
  <img src="..." class="w-full h-48 object-cover" />
  <div class="p-5">
    <div class="flex items-start justify-between gap-2">
      <h3 class="font-semibold text-gray-900 leading-tight">Judul Konten</h3>
      <span class="shrink-0 text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Aktif</span>
    </div>
    <p class="text-sm text-gray-500 mt-1.5 leading-relaxed line-clamp-2">
      Deskripsi singkat yang bisa terdiri dari dua baris dan kemudian dipotong.
    </p>
    <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 rounded-full bg-gray-200"></div>
        <span class="text-xs text-gray-500">Author Name</span>
      </div>
      <span class="text-xs text-gray-400">2 jam lalu</span>
    </div>
  </div>
</div>

<!-- Card Horizontal (media card) -->
<div class="flex gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
  <img src="..." class="w-24 h-24 rounded-lg object-cover shrink-0" />
  <div class="flex-1 min-w-0">
    <h3 class="font-semibold text-gray-900 truncate">Judul yang Mungkin Panjang</h3>
    <p class="text-sm text-gray-500 mt-1 line-clamp-2">Deskripsi...</p>
    <div class="flex items-center gap-3 mt-2">
      <span class="text-xs text-blue-600 font-medium">Kategori</span>
      <span class="text-xs text-gray-400">5 mnt baca</span>
    </div>
  </div>
</div>

<!-- Stat card -->
<div class="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-5 text-white">
  <div class="flex items-center justify-between mb-3">
    <span class="text-blue-100 text-sm font-medium">Total Pengguna</span>
    <div class="bg-white/20 rounded-lg p-2">
      👤
    </div>
  </div>
  <p class="text-3xl font-bold">24,521</p>
  <p class="text-blue-200 text-sm mt-1">↑ 12% dari bulan lalu</p>
</div>
```

---

### 10.2 📋 Table yang Profesional

```html
<div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
  <!-- Header tabel -->
  <div class="flex items-center justify-between px-5 py-4 border-b border-gray-200">
    <h3 class="font-semibold text-gray-900">Daftar Pesanan</h3>
    <div class="flex items-center gap-2">
      <input type="search" placeholder="Cari..." class="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <button class="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">
        + Tambah
      </button>
    </div>
  </div>

  <!-- Tabel scroll horizontal di mobile -->
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead class="bg-gray-50 border-b border-gray-200">
        <tr>
          <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">ID</th>
          <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Pelanggan</th>
          <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Produk</th>
          <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Total</th>
          <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Status</th>
          <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Aksi</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr class="hover:bg-gray-50 transition-colors">
          <td class="px-5 py-4 text-gray-500 font-mono text-xs">#ORD-001</td>
          <td class="px-5 py-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">B</div>
              <div>
                <p class="font-medium text-gray-900">Budi Santoso</p>
                <p class="text-xs text-gray-500">budi@email.com</p>
              </div>
            </div>
          </td>
          <td class="px-5 py-4 text-gray-700">Sepatu Lari Pro</td>
          <td class="px-5 py-4 font-semibold text-gray-900">Rp 450.000</td>
          <td class="px-5 py-4">
            <span class="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700">
              <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              Selesai
            </span>
          </td>
          <td class="px-5 py-4">
            <div class="flex items-center gap-2">
              <button class="text-xs text-blue-600 hover:text-blue-800 font-medium">Detail</button>
              <button class="text-xs text-red-500 hover:text-red-700 font-medium">Hapus</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Pagination -->
  <div class="flex items-center justify-between px-5 py-3 border-t border-gray-200 bg-gray-50">
    <p class="text-xs text-gray-500">Menampilkan 1-10 dari 284 data</p>
    <div class="flex items-center gap-1">
      <button class="px-2.5 py-1.5 text-xs rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50">←</button>
      <button class="px-2.5 py-1.5 text-xs rounded-md bg-blue-600 text-white">1</button>
      <button class="px-2.5 py-1.5 text-xs rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100">2</button>
      <button class="px-2.5 py-1.5 text-xs rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100">3</button>
      <button class="px-2.5 py-1.5 text-xs rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100">→</button>
    </div>
  </div>
</div>
```

---

## 📖 Bab 11 — Modal, Alert, Badge & Komponen Interaktif

---

### 11.1 📢 Alert & Notification

```html
<!-- Alert variants -->
<div class="flex items-start gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
  <span class="text-green-500 mt-0.5 shrink-0">✓</span>
  <div>
    <p class="font-medium">Berhasil disimpan!</p>
    <p class="text-sm text-green-700 mt-0.5">Data Anda telah berhasil diperbarui.</p>
  </div>
  <button class="ml-auto text-green-500 hover:text-green-700 shrink-0">✕</button>
</div>

<div class="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
  <span class="text-red-500 shrink-0">✕</span>
  <p class="text-sm font-medium">Terjadi kesalahan. Coba lagi nanti.</p>
</div>

<div class="flex items-start gap-3 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
  <span class="text-yellow-500 shrink-0">⚠</span>
  <p class="text-sm font-medium">Sesi Anda akan berakhir dalam 5 menit.</p>
</div>

<div class="flex items-start gap-3 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg">
  <span class="text-blue-500 shrink-0">ℹ</span>
  <p class="text-sm font-medium">Versi baru tersedia. Perbarui sekarang.</p>
</div>

<!-- Toast notification (pojok layar) -->
<div class="fixed bottom-4 right-4 bg-gray-900 text-white text-sm px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 z-50">
  <span>✓</span>
  <span>Produk berhasil ditambahkan ke keranjang!</span>
  <button class="ml-2 text-gray-400 hover:text-white">✕</button>
</div>
```

---

### 11.2 🏷️ Badge & Status Indicator

```html
<!-- Badge colors -->
<span class="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">Default</span>
<span class="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">Info</span>
<span class="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-100 text-green-700">Sukses</span>
<span class="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700">Peringatan</span>
<span class="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full bg-red-100 text-red-700">Bahaya</span>

<!-- Badge dengan dot indicator -->
<span class="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-100 text-green-700">
  <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
  Online
</span>

<!-- Badge pada icon (notification count) -->
<div class="relative inline-flex">
  <button class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
    🔔
  </button>
  <span class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
    3
  </span>
</div>
```

---

### 11.3 🪟 Modal

```html
<!-- Overlay + Modal (pakai JS untuk toggle class 'hidden') -->
<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
  <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">

    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
      <h3 class="font-semibold text-gray-900 text-lg">Konfirmasi Hapus</h3>
      <button class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100">
        ✕
      </button>
    </div>

    <!-- Body -->
    <div class="px-6 py-5">
      <div class="flex items-center gap-4">
        <div class="shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-xl">
          🗑️
        </div>
        <div>
          <p class="font-medium text-gray-900">Hapus produk ini?</p>
          <p class="text-sm text-gray-500 mt-1">Tindakan ini tidak bisa dibatalkan. Produk akan dihapus secara permanen.</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
      <button class="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
        Batal
      </button>
      <button class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
        Ya, Hapus
      </button>
    </div>

  </div>
</div>
```

---

---

# 🔴 BAGIAN V — Responsive & Dark Mode

> 🎯 **Tujuan Bagian Ini:**
> Membangun tampilan yang sempurna di semua ukuran layar
> dan mengimplementasikan dark mode dengan Tailwind.

---

## 📖 Bab 12 — Responsive Design

---

### 12.1 📱 Breakpoint Tailwind — Mobile-First

```
Tailwind pakai pendekatan MOBILE-FIRST:
Class tanpa prefix → berlaku di SEMUA ukuran layar
Class dengan prefix → berlaku di ukuran TERSEBUT KE ATAS

Breakpoint default:
  sm:  → min-width: 640px   (tablet portrait)
  md:  → min-width: 768px   (tablet landscape)
  lg:  → min-width: 1024px  (laptop)
  xl:  → min-width: 1280px  (desktop)
  2xl: → min-width: 1536px  (layar besar)
```

```html
<!-- Cara baca: mobile dulu, lalu override di layar lebih besar -->
<div class="
  text-sm         ← mobile: 14px
  md:text-base    ← tablet ke atas: 16px
  lg:text-lg      ← laptop ke atas: 18px
">
  Teks responsif
</div>

<!-- Grid responsif -->
<div class="
  grid
  grid-cols-1     ← mobile: 1 kolom
  sm:grid-cols-2  ← tablet: 2 kolom
  lg:grid-cols-3  ← laptop: 3 kolom
  xl:grid-cols-4  ← desktop: 4 kolom
  gap-4 sm:gap-6
">
  <!-- ... -->
</div>

<!-- Sembunyikan/tampilkan per breakpoint -->
<div class="block md:hidden">Hanya tampil di mobile</div>
<div class="hidden md:block">Hanya tampil di tablet ke atas</div>
<div class="hidden lg:flex">Hanya tampil di laptop ke atas sebagai flex</div>
```

---

### 12.2 📐 Pola Responsif yang Sering Dipakai

```html
<!-- ① Navigasi: hamburger di mobile, horizontal di desktop -->
<nav class="flex items-center justify-between p-4">
  <span class="font-bold text-xl">Logo</span>

  <!-- Menu hamburger — hanya di mobile -->
  <button class="block md:hidden p-2 rounded-lg hover:bg-gray-100">
    ☰
  </button>

  <!-- Menu horizontal — hanya di desktop -->
  <div class="hidden md:flex items-center gap-6">
    <a href="#">Beranda</a>
    <a href="#">Produk</a>
    <a href="#">Tentang</a>
    <button class="bg-blue-600 text-white px-4 py-2 rounded-lg">Masuk</button>
  </div>
</nav>

<!-- ② Hero: teks di atas gambar di mobile, berdampingan di desktop -->
<section class="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 px-4 py-12 max-w-6xl mx-auto">
  <div class="flex-1 text-center lg:text-left">
    <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
      Judul Hero yang Besar
    </h1>
    <p class="text-gray-600 mt-4 text-base lg:text-lg leading-relaxed">
      Deskripsi singkat yang menjelaskan nilai proposisi.
    </p>
    <div class="flex flex-col sm:flex-row gap-3 mt-8 justify-center lg:justify-start">
      <button class="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold">
        Mulai Sekarang
      </button>
      <button class="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold">
        Pelajari Lebih
      </button>
    </div>
  </div>
  <div class="flex-1 w-full max-w-sm lg:max-w-none">
    <img src="hero.png" class="w-full rounded-2xl shadow-xl" />
  </div>
</section>

<!-- ③ Padding & margin responsif -->
<section class="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
  <div class="max-w-7xl mx-auto">
    <!-- konten -->
  </div>
</section>

<!-- ④ Font size responsif untuk heading -->
<h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold">
  Heading Utama
</h1>
```

---

### 12.3 📌 Container Pattern

```html
<!-- Pola container yang konsisten — pakai di seluruh project -->
<div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <!-- konten halaman -->
</div>

<!-- Atau pakai class 'container' bawaan Tailwind -->
<!-- container otomatis set max-width per breakpoint + mx-auto -->
<div class="container mx-auto px-4 sm:px-6 lg:px-8">
  <!-- konten halaman -->
</div>
```

---

## 📖 Bab 13 — Dark Mode

---

### 13.1 🌙 Setup Dark Mode

```javascript
// tailwind.config.js
export default {
  // 'class' = toggle dark mode via class .dark di <html>
  // 'media' = ikuti preferensi sistem (prefers-color-scheme: dark)
  darkMode: 'class',
  // ...
}
```

```javascript
// Toggle dark mode dengan JavaScript
const html = document.documentElement

// Cek preferensi tersimpan
const savedTheme = localStorage.getItem('theme')
if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  html.classList.add('dark')
}

// Toggle button
function toggleDarkMode() {
  html.classList.toggle('dark')
  localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light')
}
```

---

### 13.2 🎨 Menulis Class untuk Dark Mode

```html
<!-- Format: dark:{class} -->
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">

  <!-- Navbar -->
  <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0">
    <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <span class="font-bold text-gray-900 dark:text-white">Logo</span>

      <!-- Toggle button -->
      <button
        onclick="toggleDarkMode()"
        class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        <span class="dark:hidden">🌙</span>
        <span class="hidden dark:inline">☀️</span>
      </button>
    </div>
  </header>

  <!-- Card dalam dark mode -->
  <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm dark:shadow-none">
    <h3 class="font-semibold text-gray-900 dark:text-white">Judul Card</h3>
    <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Deskripsi konten.</p>
    <button class="mt-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
      Tombol Aksi
    </button>
  </div>

  <!-- Input dalam dark mode -->
  <input
    type="text"
    class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="Ketik di sini..."
  />

</div>
```

---

### 13.3 💡 Strategi Warna Dark Mode yang Rapi

```
PANDUAN PASANGAN WARNA LIGHT ↔ DARK:

Latar utama:       bg-white          ↔  dark:bg-gray-900
Latar kartu:       bg-white          ↔  dark:bg-gray-800
Latar subtle:      bg-gray-50        ↔  dark:bg-gray-900/50
Latar input:       bg-white          ↔  dark:bg-gray-800

Border utama:      border-gray-200   ↔  dark:border-gray-700
Border subtle:     border-gray-100   ↔  dark:border-gray-800

Teks heading:      text-gray-900     ↔  dark:text-gray-100
Teks body:         text-gray-700     ↔  dark:text-gray-300
Teks muted:        text-gray-500     ↔  dark:text-gray-400
Teks placeholder:  text-gray-400     ↔  dark:text-gray-500
```

---

---

# 🟣 BAGIAN VI — Kustomisasi & Design System

> 🎯 **Tujuan Bagian Ini:**
> Mengkonfigurasi Tailwind untuk membangun design system
> yang konsisten, scalable, dan sesuai identitas brand.

---

## 📖 Bab 14 — Konfigurasi `tailwind.config.js`

---

### 14.1 ⚙️ Struktur Konfigurasi Lengkap

```javascript
// tailwind.config.js
import defaultTheme from 'tailwindcss/defaultTheme'
import colors from 'tailwindcss/colors'

export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',

  theme: {
    // ① 'theme' saja → REPLACE default (hapus semua default)
    // ② 'theme.extend' → TAMBAH di atas default (lebih aman & sering dipakai)
    extend: {
      // Warna brand
      colors: {
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        // Tambah warna semantik
        success: colors.emerald,
        warning: colors.amber,
        danger:  colors.red,
      },

      // Font family
      fontFamily: {
        sans:  ['Inter', ...defaultTheme.fontFamily.sans],
        mono:  ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
        display: ['Cal Sans', 'Inter', 'sans-serif'],
      },

      // Ukuran font tambahan
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
        '10xl': ['10rem', { lineHeight: '1' }],
      },

      // Spacing tambahan
      spacing: {
        '4.5': '1.125rem',  // antara 4 dan 5
        '13':  '3.25rem',
        '18':  '4.5rem',
        '88':  '22rem',
        '128': '32rem',
      },

      // Border radius tambahan
      borderRadius: {
        '4xl': '2rem',
      },

      // Box shadow custom
      boxShadow: {
        'card':  '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08)',
        'glow-blue':  '0 0 20px rgb(59 130 246 / 0.4)',
      },

      // Animasi custom
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(24px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        'fade-in':        'fade-in 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'pulse-soft':     'pulse-soft 2s ease-in-out infinite',
      },

      // Screen / breakpoint tambahan
      screens: {
        'xs': '475px',   // Antara default dan sm
        '3xl': '1920px', // Layar sangat besar
      },

      // Max width tambahan
      maxWidth: {
        '8xl': '88rem',  // 1408px
        '9xl': '96rem',  // 1536px
      },

      // Z-index tambahan
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },

  plugins: [
    require('@tailwindcss/forms'),       // Style input/select/checkbox yang lebih baik
    require('@tailwindcss/typography'),  // Class 'prose' untuk konten artikel
    require('@tailwindcss/line-clamp'),  // line-clamp (sudah built-in di v3.3+)
    require('@tailwindcss/aspect-ratio'),// aspect-ratio utilities
  ],
}
```

---

## 📖 Bab 15 — Arbitrary Values & Direktif CSS

---

### 15.1 🎯 Arbitrary Values — Nilai Apapun yang Anda Mau

```html
<!-- Gunakan nilai arbitrary di dalam kurung siku [] -->

<!-- Warna custom -->
<div class="bg-[#e2e8f0]">Background warna custom</div>
<div class="text-[#ff6b6b]">Teks warna custom</div>

<!-- Ukuran custom -->
<div class="w-[300px]">Lebar 300px</div>
<div class="h-[calc(100vh-64px)]">Tinggi dikurangi navbar</div>
<div class="mt-[72px]">Margin top 72px</div>

<!-- Grid custom -->
<div class="grid-cols-[1fr_2fr_1fr]">Custom grid 1:2:1</div>
<div class="grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">Auto-fill grid</div>

<!-- Background image URL -->
<div class="bg-[url('/images/hero.jpg')] bg-cover bg-center h-96">
  Hero dengan background image
</div>

<!-- Font size custom -->
<p class="text-[15px]">Font size 15px (tidak ada di skala default)</p>
<p class="text-[clamp(1rem,4vw,3rem)]">Fluid typography</p>

<!-- Padding custom -->
<div class="py-[72px] px-[5%]">Padding custom</div>

<!-- Nilai CSS yang tidak ada class-nya -->
<div class="[writing-mode:vertical-rl]">Teks vertikal</div>
<div class="[content-visibility:auto]">Content visibility</div>
<div class="[mask-image:linear-gradient(to_bottom,transparent,black)]">Mask gradient</div>
```

---

### 15.2 📝 Direktif CSS — `@layer`, `@apply`, `@theme`

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ① @layer base — override atau tambah style dasar */
@layer base {
  /* Scrollbar custom */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: theme('colors.gray.300'); border-radius: 9999px; }
  ::-webkit-scrollbar-thumb:hover { background: theme('colors.gray.400'); }

  /* Focus visible global */
  :focus-visible {
    @apply outline-none ring-2 ring-blue-500 ring-offset-2;
  }

  /* Typography defaults */
  html { @apply antialiased; }
  body { @apply text-gray-900 bg-white; }
}

/* ② @layer components — komponen yang bisa dipakai ulang */
/* Gunakan @apply untuk extract pola class yang sering berulang */
@layer components {
  /* Tombol utama */
  .btn {
    @apply inline-flex items-center justify-center gap-2 font-medium
           rounded-lg transition-colors duration-150
           disabled:opacity-50 disabled:cursor-not-allowed;
  }
  .btn-primary {
    @apply btn bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5;
  }
  .btn-secondary {
    @apply btn border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-2.5;
  }
  .btn-sm { @apply btn text-sm px-3.5 py-2; }
  .btn-lg { @apply btn text-base px-7 py-3.5; }

  /* Input field */
  .input {
    @apply w-full px-4 py-2.5 border border-gray-300 rounded-lg
           text-gray-900 placeholder:text-gray-400
           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
           transition-shadow bg-white;
  }
  .input-error {
    @apply input border-red-400 bg-red-50 focus:ring-red-400;
  }

  /* Card */
  .card {
    @apply bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden;
  }
  .card-body { @apply p-5; }

  /* Container */
  .container-app {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }

  /* Badge */
  .badge {
    @apply inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full;
  }
  .badge-blue    { @apply badge bg-blue-100 text-blue-700; }
  .badge-green   { @apply badge bg-green-100 text-green-700; }
  .badge-red     { @apply badge bg-red-100 text-red-700; }
  .badge-yellow  { @apply badge bg-yellow-100 text-yellow-700; }

  /* Section heading */
  .section-heading {
    @apply text-3xl sm:text-4xl font-bold text-gray-900 leading-tight;
  }
  .section-subheading {
    @apply text-base sm:text-lg text-gray-500 leading-relaxed mt-4 max-w-2xl;
  }
}

/* ③ @layer utilities — tambah utility custom yang tidak ada di Tailwind */
@layer utilities {
  /* Scrollbar hide */
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar { display: none; }

  /* Gradient text */
  .text-gradient-blue {
    @apply bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent;
  }
  .text-gradient-purple {
    @apply bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent;
  }

  /* Glass effect */
  .glass {
    @apply backdrop-blur-md bg-white/30 border border-white/20;
  }
  .glass-dark {
    @apply backdrop-blur-md bg-gray-900/30 border border-gray-700/30;
  }
}
```

> ⚠️ **Kapan Pakai `@apply` dan Kapan Tidak?**
>
> | Situasi | Rekomendasi |
> |---|---|
> | Komponen yang sama muncul 10+ kali | ✅ Pakai `@apply` |
> | Komponen framework (Button, Input, Card) | ✅ Pakai `@apply` |
> | Komponen yang jarang berulang | ❌ Langsung tulis class di HTML |
> | Dalam project React/Vue | ❌ Lebih baik buat file `.jsx/.vue` |

---

## 📖 Bab 16 — Plugin Tailwind & Design Tokens

---

### 16.1 🧩 Plugin Resmi yang Sangat Berguna

```bash
# @tailwindcss/typography — class 'prose' untuk artikel/konten rich text
npm install -D @tailwindcss/typography

# @tailwindcss/forms — styling yang lebih baik untuk semua elemen form
npm install -D @tailwindcss/forms

# @tailwindcss/aspect-ratio — utility aspect-ratio untuk video/gambar
npm install -D @tailwindcss/aspect-ratio
```

```html
<!-- @tailwindcss/typography: class 'prose' -->
<!-- Styling otomatis untuk konten dari CMS/markdown -->
<article class="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-600 prose-img:rounded-xl">
  <!-- Semua tag h1-h6, p, ul, ol, blockquote, code, img otomatis ter-style dengan rapi -->
  <h1>Judul Artikel</h1>
  <p>Paragraf pertama...</p>
  <ul>
    <li>Item satu</li>
    <li>Item dua</li>
  </ul>
  <blockquote>Quote dari seseorang.</blockquote>
  <pre><code>const x = 1</code></pre>
</article>

<!-- @tailwindcss/aspect-ratio: rasio aspek -->
<div class="aspect-video"> <!-- 16:9 -->
  <iframe src="youtube.com/..." class="w-full h-full rounded-xl" />
</div>
<div class="aspect-square"> <!-- 1:1 -->
  <img src="avatar.jpg" class="w-full h-full object-cover rounded-full" />
</div>
<div class="aspect-[4/3]"> <!-- 4:3 custom -->
  <img src="foto.jpg" class="w-full h-full object-cover rounded-xl" />
</div>
```

---

### 16.2 🎨 Membangun Design Token yang Konsisten

```javascript
// tailwind.config.js — Design System yang terstruktur

const designTokens = {
  // Warna semantik — nama berdasarkan fungsi, bukan warna
  colors: {
    // Brand
    'primary':         '#2563eb', // blue-600
    'primary-hover':   '#1d4ed8', // blue-700
    'primary-light':   '#eff6ff', // blue-50
    'primary-dark':    '#1e40af', // blue-800

    // Status
    'success':         '#059669', // emerald-600
    'success-light':   '#ecfdf5', // emerald-50
    'warning':         '#d97706', // amber-600
    'warning-light':   '#fffbeb', // amber-50
    'danger':          '#dc2626', // red-600
    'danger-light':    '#fef2f2', // red-50

    // Neutral
    'surface':         '#ffffff',
    'surface-alt':     '#f9fafb', // gray-50
    'border':          '#e5e7eb', // gray-200
    'border-strong':   '#d1d5db', // gray-300

    // Text
    'text-primary':    '#111827', // gray-900
    'text-secondary':  '#4b5563', // gray-600
    'text-muted':      '#9ca3af', // gray-400
    'text-inverse':    '#ffffff',
  },

  // Spacing scale yang konsisten
  spacing: {
    'xs':  '0.5rem',   // 8px
    'sm':  '0.75rem',  // 12px
    'md':  '1rem',     // 16px
    'lg':  '1.5rem',   // 24px
    'xl':  '2rem',     // 32px
    '2xl': '3rem',     // 48px
    '3xl': '4rem',     // 64px
    '4xl': '6rem',     // 96px
  },
}
```

---

---

# 🏗️ BAGIAN VII — Project: Landing Page Modern

> 🎯 **Tujuan Bagian Ini:**
> Terapkan semua yang dipelajari dari Bab 1 hingga 16 dalam satu
> landing page profesional yang siap dipublikasikan.

---

## 📖 Bab 17 — Project Landing Page SaaS Modern

---

### 17.1 🎯 Apa yang Akan Dibangun

```
Landing page untuk produk SaaS (Software as a Service) dengan:

✅ Navbar sticky dengan logo + navigasi + CTA button
✅ Hero section — headline besar, subheading, dual CTA, preview produk
✅ Logo bar — brand yang mempercayai produk
✅ Feature section — 3 fitur utama dengan ikon + deskripsi
✅ How it works — steps 1-2-3
✅ Testimonial — quote dari customer
✅ Pricing section — 3 tier (Free, Pro, Enterprise)
✅ FAQ section — accordion
✅ CTA section terakhir — ajakan akhir
✅ Footer lengkap
✅ Fully responsive (mobile, tablet, desktop)
✅ Dark mode support
✅ Animasi halus (hover, transisi)
```

---

### 17.2 📦 Setup Project

```bash
# Buat project Vite biasa
npm create vite@latest landing-page -- --template vanilla
cd landing-page

# Install Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install plugin
npm install -D @tailwindcss/typography @tailwindcss/forms

# Install font Inter dari Google Fonts
# Tambahkan ke index.html:
# <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
```

---

### 17.3 🏗️ Struktur File

```
landing-page/
├── index.html
├── src/
│   ├── index.css          ← Tailwind directives + custom styles
│   ├── main.js            ← JS untuk toggle, animasi, dll
│   └── components/        ← Partial HTML (opsional)
├── public/
│   └── images/
├── tailwind.config.js
└── vite.config.js
```

---

### 17.4 🦸 Navbar Section

```html
<!-- Navbar sticky dengan blur effect -->
<header id="navbar"
  class="fixed top-0 left-0 right-0 z-50 transition-all duration-300
         bg-white/80 dark:bg-gray-900/80 backdrop-blur-md
         border-b border-gray-200/50 dark:border-gray-800/50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">

      <!-- Logo -->
      <a href="/" class="flex items-center gap-2.5 shrink-0">
        <div class="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
          <svg class="w-4.5 h-4.5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a8 8 0 100 16A8 8 0 0010 2z"/>
          </svg>
        </div>
        <span class="font-bold text-gray-900 dark:text-white text-lg tracking-tight">Saasify</span>
      </a>

      <!-- Navigasi tengah -->
      <nav class="hidden md:flex items-center gap-1">
        <a href="#features" class="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Fitur</a>
        <a href="#pricing"  class="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Harga</a>
        <a href="#faq"      class="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">FAQ</a>
        <a href="#blog"     class="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Blog</a>
      </nav>

      <!-- CTA kanan -->
      <div class="flex items-center gap-3">
        <button onclick="toggleDarkMode()" class="hidden sm:flex p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <span class="dark:hidden">🌙</span>
          <span class="hidden dark:inline">☀️</span>
        </button>
        <a href="/login"    class="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Masuk</a>
        <a href="/register" class="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm">
          Coba Gratis
        </a>
        <!-- Hamburger mobile -->
        <button id="menu-btn" class="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400">
          ☰
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile menu -->
  <div id="mobile-menu" class="hidden md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3">
    <nav class="flex flex-col gap-1">
      <a href="#features" class="text-sm font-medium text-gray-700 dark:text-gray-300 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">Fitur</a>
      <a href="#pricing"  class="text-sm font-medium text-gray-700 dark:text-gray-300 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">Harga</a>
      <a href="#faq"      class="text-sm font-medium text-gray-700 dark:text-gray-300 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">FAQ</a>
    </nav>
  </div>
</header>
```

---

### 17.5 🦸 Hero Section

```html
<section class="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">

  <!-- Background gradient decoration -->
  <div class="absolute inset-0 -z-10">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-100 dark:bg-blue-950 rounded-full blur-3xl opacity-30"></div>
  </div>

  <div class="max-w-4xl mx-auto text-center">

    <!-- Badge -->
    <div class="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
      <span class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
      Baru! Fitur Analitik AI Tersedia
    </div>

    <!-- Headline -->
    <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-[1.1] tracking-tight mb-6">
      Kelola Bisnis Anda<br/>
      <span class="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
        Lebih Cerdas & Efisien
      </span>
    </h1>

    <!-- Subheading -->
    <p class="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">
      Platform all-in-one untuk mengotomatisasi operasional, menganalisis data real-time,
      dan mengembangkan tim Anda — tanpa kerumitan teknis.
    </p>

    <!-- CTA Buttons -->
    <div class="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
      <a href="/register"
         class="w-full sm:w-auto inline-flex items-center justify-center gap-2
                bg-blue-600 hover:bg-blue-700 text-white font-semibold
                px-8 py-3.5 rounded-xl transition-all duration-200
                shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40
                hover:-translate-y-0.5">
        Mulai Gratis — Tanpa Kartu Kredit
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </a>
      <a href="#demo"
         class="w-full sm:w-auto inline-flex items-center justify-center gap-2
                border border-gray-300 dark:border-gray-700
                text-gray-700 dark:text-gray-300
                hover:bg-gray-50 dark:hover:bg-gray-800
                font-semibold px-8 py-3.5 rounded-xl transition-colors">
        ▶ Lihat Demo
      </a>
    </div>

    <!-- Social proof -->
    <div class="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <div class="flex -space-x-2">
        <img src="/avatars/1.jpg" class="w-7 h-7 rounded-full border-2 border-white dark:border-gray-900 object-cover" />
        <img src="/avatars/2.jpg" class="w-7 h-7 rounded-full border-2 border-white dark:border-gray-900 object-cover" />
        <img src="/avatars/3.jpg" class="w-7 h-7 rounded-full border-2 border-white dark:border-gray-900 object-cover" />
        <img src="/avatars/4.jpg" class="w-7 h-7 rounded-full border-2 border-white dark:border-gray-900 object-cover" />
      </div>
      <span>Dipercaya oleh <span class="font-semibold text-gray-700 dark:text-gray-300">10.000+</span> bisnis di Indonesia</span>
    </div>

  </div>

  <!-- Product preview / mockup -->
  <div class="max-w-5xl mx-auto mt-16 relative">
    <div class="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-3 shadow-2xl">
      <div class="bg-gray-700 rounded-lg overflow-hidden">
        <!-- Browser chrome -->
        <div class="flex items-center gap-1.5 px-4 py-2.5 bg-gray-800">
          <div class="w-3 h-3 rounded-full bg-red-500"></div>
          <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div class="w-3 h-3 rounded-full bg-green-500"></div>
          <div class="flex-1 mx-4 bg-gray-700 rounded-md px-3 py-1 text-xs text-gray-400">
            app.saasify.id/dashboard
          </div>
        </div>
        <!-- App screenshot placeholder -->
        <div class="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
          <span class="text-gray-400 dark:text-gray-500 text-sm">Dashboard Preview</span>
        </div>
      </div>
    </div>
    <!-- Glow effect -->
    <div class="absolute inset-0 -z-10 bg-blue-500/10 rounded-2xl blur-xl scale-95"></div>
  </div>

</section>
```

---

### 17.6 💰 Pricing Section

```html
<section id="pricing" class="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950">
  <div class="max-w-7xl mx-auto">

    <!-- Heading -->
    <div class="text-center mb-12">
      <span class="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">Harga</span>
      <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2">
        Harga yang Transparan & Adil
      </h2>
      <p class="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">
        Mulai gratis, upgrade saat bisnis Anda berkembang.
      </p>
      <!-- Toggle billing -->
      <div class="flex items-center justify-center gap-3 mt-6">
        <span class="text-sm text-gray-600 dark:text-gray-400">Bulanan</span>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" class="sr-only peer" />
          <div class="w-11 h-6 bg-gray-200 peer-checked:bg-blue-600 rounded-full transition-colors"></div>
          <div class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5"></div>
        </label>
        <span class="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
          Tahunan
          <span class="text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full">Hemat 20%</span>
        </span>
      </div>
    </div>

    <!-- Pricing cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">

      <!-- Free tier -->
      <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex flex-col">
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white">Starter</h3>
          <div class="mt-4 mb-6">
            <span class="text-4xl font-bold text-gray-900 dark:text-white">Gratis</span>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">Untuk individu dan tim kecil yang baru memulai.</p>
          <ul class="flex flex-col gap-3 mb-8">
            <li class="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400">
              <span class="text-green-500 shrink-0">✓</span> Hingga 3 pengguna
            </li>
            <li class="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400">
              <span class="text-green-500 shrink-0">✓</span> 5GB penyimpanan
            </li>
            <li class="flex items-center gap-2.5 text-sm text-gray-400 dark:text-gray-600">
              <span class="shrink-0">—</span> Analitik lanjutan
            </li>
            <li class="flex items-center gap-2.5 text-sm text-gray-400 dark:text-gray-600">
              <span class="shrink-0">—</span> Dukungan prioritas
            </li>
          </ul>
        </div>
        <a href="/register" class="mt-auto w-full text-center border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium py-2.5 rounded-xl transition-colors text-sm">
          Mulai Gratis
        </a>
      </div>

      <!-- Pro tier — POPULAR -->
      <div class="relative bg-blue-600 rounded-2xl p-6 flex flex-col shadow-xl shadow-blue-500/30">
        <!-- Badge popular -->
        <div class="absolute -top-3 left-1/2 -translate-x-1/2">
          <span class="bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold px-4 py-1 rounded-full shadow">
            PALING POPULER
          </span>
        </div>
        <div>
          <h3 class="font-semibold text-white">Pro</h3>
          <div class="mt-4 mb-6">
            <span class="text-4xl font-bold text-white">Rp 299rb</span>
            <span class="text-blue-200 text-sm">/bulan</span>
          </div>
          <p class="text-sm text-blue-100 mb-6">Untuk tim yang sedang berkembang dan butuh lebih banyak fitur.</p>
          <ul class="flex flex-col gap-3 mb-8">
            <li class="flex items-center gap-2.5 text-sm text-white">
              <span class="text-blue-200 shrink-0">✓</span> Hingga 25 pengguna
            </li>
            <li class="flex items-center gap-2.5 text-sm text-white">
              <span class="text-blue-200 shrink-0">✓</span> 100GB penyimpanan
            </li>
            <li class="flex items-center gap-2.5 text-sm text-white">
              <span class="text-blue-200 shrink-0">✓</span> Analitik lanjutan
            </li>
            <li class="flex items-center gap-2.5 text-sm text-blue-200">
              <span class="shrink-0">—</span> Dukungan prioritas
            </li>
          </ul>
        </div>
        <a href="/register?plan=pro" class="mt-auto w-full text-center bg-white text-blue-700 hover:bg-blue-50 font-semibold py-2.5 rounded-xl transition-colors text-sm shadow-sm">
          Mulai 14 Hari Gratis
        </a>
      </div>

      <!-- Enterprise tier -->
      <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex flex-col">
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white">Enterprise</h3>
          <div class="mt-4 mb-6">
            <span class="text-4xl font-bold text-gray-900 dark:text-white">Custom</span>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">Untuk perusahaan besar dengan kebutuhan khusus.</p>
          <ul class="flex flex-col gap-3 mb-8">
            <li class="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400">
              <span class="text-green-500 shrink-0">✓</span> Pengguna tidak terbatas
            </li>
            <li class="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400">
              <span class="text-green-500 shrink-0">✓</span> Penyimpanan tidak terbatas
            </li>
            <li class="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400">
              <span class="text-green-500 shrink-0">✓</span> Analitik lanjutan
            </li>
            <li class="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400">
              <span class="text-green-500 shrink-0">✓</span> Dukungan prioritas 24/7
            </li>
          </ul>
        </div>
        <a href="/contact" class="mt-auto w-full text-center bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 font-medium py-2.5 rounded-xl transition-colors text-sm">
          Hubungi Sales
        </a>
      </div>

    </div>
  </div>
</section>
```

---

### 17.7 🚀 JavaScript untuk Interaktivitas

```javascript
// src/main.js

// ① Dark Mode Toggle
const html = document.documentElement

function initTheme() {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark')
  }
}

function toggleDarkMode() {
  html.classList.toggle('dark')
  localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light')
}

initTheme()
window.toggleDarkMode = toggleDarkMode

// ② Mobile menu toggle
const menuBtn = document.getElementById('menu-btn')
const mobileMenu = document.getElementById('mobile-menu')

menuBtn?.addEventListener('click', () => {
  mobileMenu?.classList.toggle('hidden')
})

// ③ Navbar: tambah shadow saat scroll
const navbar = document.getElementById('navbar')

window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    navbar?.classList.add('shadow-sm')
  } else {
    navbar?.classList.remove('shadow-sm')
  }
}, { passive: true })

// ④ Smooth scroll untuk anchor link
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault()
    const target = document.querySelector(anchor.getAttribute('href'))
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    mobileMenu?.classList.add('hidden') // Tutup mobile menu jika terbuka
  })
})

// ⑤ Intersection Observer — animasi saat elemen masuk viewport
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in')
        entry.target.classList.remove('opacity-0', 'translate-y-4')
        observer.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
)

// Apply observer ke semua elemen dengan class 'reveal'
document.querySelectorAll('.reveal').forEach(el => {
  el.classList.add('opacity-0', 'translate-y-4', 'transition-all', 'duration-500')
  observer.observe(el)
})
```

---

### 17.8 ✅ Checklist Final Sebelum Deploy

```
PERFORMA:
□ Jalankan: npm run build — pastikan tidak ada error
□ Bundle CSS hanya ~10-30KB (Tailwind sudah di-purge otomatis)
□ Gambar pakai format WebP dan lazy loading
□ Font di-preload: <link rel="preload" as="font" ...>

RESPONSIF:
□ Test di mobile 375px (iPhone SE)
□ Test di tablet 768px
□ Test di desktop 1440px
□ Navbar hamburger menu berfungsi
□ Tidak ada horizontal scroll di mobile

DARK MODE:
□ Semua section terlihat baik di dark mode
□ Teks cukup kontras di kedua mode
□ Preferensi disimpan di localStorage

ACCESSIBILITY:
□ Semua gambar punya alt text
□ Link dan button bisa di-tab (keyboard navigation)
□ Warna kontras minimal 4.5:1 (WCAG AA)
□ Form label terhubung dengan input via htmlFor/id

BROWSER:
□ Chrome / Edge ✓
□ Firefox ✓
□ Safari ✓
□ Mobile Chrome / Safari ✓
```

---

## 📊 Ringkasan Struktur Final Ebook

```
📚 EBOOK TAILWIND CSS — PANDUAN LENGKAP STYLING FRONTEND
│
├── 🟢 BAGIAN I   — Fondasi Tailwind CSS          Bab 1  – 3
│   ├── Bab 1  ─ Mengenal Tailwind CSS
│   ├── Bab 2  ─ Cara Berpikir Utility-First
│   └── Bab 3  ─ Typography & Text Utilities
│
├── 🔵 BAGIAN II  — Layout & Spacing              Bab 4  – 6
│   ├── Bab 4  ─ Box Model, Sizing & Positioning
│   ├── Bab 5  ─ Flexbox dengan Tailwind
│   └── Bab 6  ─ CSS Grid dengan Tailwind
│
├── 🟡 BAGIAN III — Typography & Colors            Bab 7  – 8
│   ├── Bab 7  ─ Sistem Warna Tailwind
│   └── Bab 8  ─ Shadow, Effects & Transitions
│
├── 🟠 BAGIAN IV  — Komponen UI dengan Tailwind   Bab 9  – 11
│   ├── Bab 9  ─ Komponen Button & Form
│   ├── Bab 10 ─ Card, List & Table
│   └── Bab 11 ─ Modal, Alert, Badge & Komponen Interaktif
│
├── 🔴 BAGIAN V   — Responsive & Dark Mode        Bab 12 – 13
│   ├── Bab 12 ─ Responsive Design (Mobile-First)
│   └── Bab 13 ─ Dark Mode
│
├── 🟣 BAGIAN VI  — Kustomisasi & Design System   Bab 14 – 16
│   ├── Bab 14 ─ Konfigurasi tailwind.config.js
│   ├── Bab 15 ─ Arbitrary Values & Direktif CSS (@layer, @apply)
│   └── Bab 16 ─ Plugin Tailwind & Design Tokens
│
└── 🏗️  BAGIAN VII — Project Landing Page Modern   Bab 17
    └── Bab 17 ─ Landing Page SaaS Modern Lengkap

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total  :  7 Bagian  |  17 Bab
Target :  Semua level (pemula hingga menengah)
Stack  :  Tailwind CSS v3 + Vite + PostCSS + Vanilla JS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

*Ebook Tailwind CSS — Panduan Lengkap Styling Frontend*
*Tailwind CSS v3 + Vite + PostCSS + Plugin Ekosistem*