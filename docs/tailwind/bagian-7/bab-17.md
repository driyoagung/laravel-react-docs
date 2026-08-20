---
title: Bab 17 — Project Landing Page SaaS Modern
---

# 📖 Bab 17 — Project Landing Page SaaS Modern

> 🎯 **Project Capstone** — Terapkan SEMUA ilmu dari Bab 1–16 dalam landing page profesional!

## 17.1 🎯 Apa yang Akan Dibangun

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

**Penjelasan setiap section:**

- **Navbar sticky** — Selalu di atas saat scroll. Logo + menu + CTA.
- **Hero** — First impression. Headline besar + 2 CTA button + preview produk.
- **Logo bar** — Social proof. "Dipakai oleh brand-brand besar".
- **Features** — 3 fitur utama dengan ikon. Explain value proposition.
- **How it works** — Step 1-2-3. Onboarding-friendly.
- **Testimonial** — Real customer quotes. Bangun trust.
- **Pricing** — 3 tier. Free / Pro / Enterprise. Highlight yang populer.
- **FAQ** — Pertanyaan umum. Hilangkan keraguan.
- **CTA terakhir** — Last call untuk convert.
- **Footer** — Links, contact, copyright.

## 17.2 📦 Setup Project

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

**Penjelasan setup:**

- **`npm create vite@latest -- --template vanilla`** — Buat project Vite dengan template vanilla JS (bukan React/Vue). Ringan, cocok untuk landing page.
- **`tailwindcss init -p`** — Generate `tailwind.config.js` + `postcss.config.js`.
- **Plugin `forms`** — Untuk styling form elements. **Plugin `typography`** — Untuk prose di FAQ atau konten tambahan.
- **Google Fonts Inter** — Font modern, free, banyak weight. Cukup populer untuk SaaS landing.

## 17.3 🏗️ Struktur File

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

**Penjelasan:**

- **`index.html`** — Single page (karena landing page). Semua section di sini.
- **`index.css`** — 3 direktif Tailwind (`@tailwind base/components/utilities`) + custom CSS.
- **`main.js`** — JS untuk dark mode toggle, smooth scroll, mobile menu.
- **`public/images/`** — Asset statis (logo partner, testimonial photos, dll).

## 17.4 🦸 Navbar Section

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
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
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

**Penjelasan setiap bagian:**

- **`fixed top-0 left-0 right-0 z-50`** — Navbar di paling atas, full width, layer tertinggi.
- **`bg-white/80 dark:bg-gray-900/80 backdrop-blur-md`** — Background semi-transparan + blur. Glassmorphism effect. Navbar jadi "melayang" di atas konten.
- **`hidden md:flex`** — Menu tengah hanya tampil di tablet ke atas. Di mobile, sembunyi (pakai hamburger).
- **`hidden sm:flex`** — Tombol dark mode & "Masuk" sembunyi di mobile (hemat space). Tombol "Coba Gratis" tetap tampil.
- **`shrink-0`** — Logo tidak boleh shrink jika space sempit.

## 17.5 🦸 Hero Section

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
      <span class="bg-blue-600 bg-clip-text text-transparent">
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
        <img src="https://i.pravatar.cc/40?img=1" class="w-7 h-7 rounded-full border-2 border-white dark:border-gray-900 object-cover" />
        <img src="https://i.pravatar.cc/40?img=2" class="w-7 h-7 rounded-full border-2 border-white dark:border-gray-900 object-cover" />
        <img src="https://i.pravatar.cc/40?img=3" class="w-7 h-7 rounded-full border-2 border-white dark:border-gray-900 object-cover" />
        <img src="https://i.pravatar.cc/40?img=4" class="w-7 h-7 rounded-full border-2 border-white dark:border-gray-900 object-cover" />
      </div>
      <span>Dipercaya oleh <span class="font-semibold text-gray-700 dark:text-gray-300">10.000+</span> bisnis di Indonesia</span>
    </div>

  </div>

  <!-- Product preview / mockup -->
  <div class="max-w-5xl mx-auto mt-16 relative">
    <div class="bg-gray-800 rounded-2xl p-3 shadow-2xl">
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
        <div class="aspect-video bg-blue-50 dark:bg-gray-800 flex items-center justify-center">
          <span class="text-gray-400 dark:text-gray-500 text-sm">Dashboard Preview</span>
        </div>
      </div>
    </div>
    <!-- Glow effect -->
    <div class="absolute inset-0 -z-10 bg-blue-500/10 rounded-2xl blur-xl scale-95"></div>
  </div>

</section>
```

**Penjelasan setiap bagian:**

- **`pt-32 pb-20`** — Padding top 128px (untuk memberi space navbar fixed 64px + extra). Padding bottom 80px.
- **Decorative gradient** — `absolute inset-0 -z-10` background gradient blur, efek glow di belakang hero. `-z-10` agar di belakang konten.
- **Badge "Baru!"** — `inline-flex` agar tidak full width. `animate-pulse` pada dot untuk efek "live".
- **Headline dengan gradient text** — `bg-gradient-to-r ... bg-clip-text text-transparent` — gradient cuma di text, background di-clip ke text shape.
- **`leading-[1.1]`** — Arbitrary value. Line height 1.1 (sangat rapat) untuk headline besar.
- **CTA buttons** — Primary biru + secondary outlined. `hover:-translate-y-0.5` untuk efek "lift" saat hover.
- **Avatar stack** — `-space-x-2` untuk overlap avatar. `border-2 border-white` untuk efek "stamp".
- **Browser mockup** — Frame dark dengan traffic light dots (red/yellow/green). Classic "browser preview" pattern untuk SaaS.
- **`aspect-video`** — 16:9 ratio. Untuk preview video/demo.
- **Glow effect** — `blur-xl scale-95` di belakang mockup, untuk efek "glowing".

## 17.6 💰 Pricing Section

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
          <span class="bg-amber-400 text-white text-xs font-bold px-4 py-1 rounded-full shadow">
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

**Penjelasan setiap tier:**

- **Free tier** — Border thin, button secondary. Cocok untuk individu.
- **Pro tier (POPULAR)** — Background biru, shadow biru (colored shadow), badge "PALING POPULER" di atas. **Harus paling menonjol**.
- **Enterprise** — Sama dengan Free tapi CTA "Hubungi Sales" (bukan "Mulai"). Untuk custom pricing.
- **`mt-auto`** di button — `margin-top: auto` push button ke bawah, sejajar dengan tier lain (footer aligned).
- **Badge "PALING POPULER"** — `absolute -top-3 left-1/2 -translate-x-1/2` — Posisi center-top, naik 12px dari card.
- **`<input type="checkbox" class="sr-only peer">`** — Hidden checkbox + `peer` class. Toggle styling berdasarkan state `peer-checked:*`.

## 17.7 🚀 JavaScript untuk Interaktivitas

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

**Penjelasan setiap script:**

- **① Dark mode** — Init dari localStorage + preferensi OS. Toggle function save ke localStorage.
- **② Mobile menu** — `classList.toggle('hidden')` — Tailwind punya class `hidden` = `display: none`. Toggle = show/hide.
- **③ Navbar scroll** — Tambah `shadow-sm` saat scroll > 10px. `{ passive: true }` untuk performa (tidak blok scroll).
- **④ Smooth scroll** — Pakai native `scrollIntoView({ behavior: 'smooth' })`. Modern API, support semua browser.
- **⑤ Intersection Observer** — Trigger animasi `animate-fade-in` saat element masuk viewport. `unobserve` agar hanya trigger sekali.

## 17.8 ✅ Checklist Final Sebelum Deploy

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

**Penjelasan setiap kategori:**

- **Performa** — Bundle size kecil (Tailwind purge). Gambar WebP = format modern, 30% lebih kecil dari JPEG.
- **Responsif** — Test di 3 breakpoint utama. Tidak ada horizontal scroll (penyebab umum bug).
- **Dark mode** — Kontras cukup. Preferensi persist (user tidak perlu toggle tiap load).
- **Accessibility** — Screen reader, keyboard navigation, color contrast. WCAG AA = standard minimum.
- **Browser** — Chrome & Safari = 95%+ market share. Test di keduanya.

## 📌 Penutup

🎉 **Selamat!** Anda telah menyelesaikan Ebook Tailwind CSS dan membangun landing page SaaS modern.

Anda sekarang menguasai:
- ✅ Utility-first mindset
- ✅ Sistem layout (Flexbox, Grid)
- ✅ Typography & colors
- ✅ Komponen UI patterns
- ✅ Responsive design
- ✅ Dark mode
- ✅ Design system customization

Lanjutkan belajar ke Ebook **Laravel** atau **React** untuk full-stack development!

---

🇮🇩 Ebook Tailwind CSS — Panduan Lengkap Styling Frontend
