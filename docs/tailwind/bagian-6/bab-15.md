---
title: Bab 15 — Arbitrary Values & Direktif CSS
---

# 📖 Bab 15 — Arbitrary Values & Direktif CSS

## 15.1 🎯 Arbitrary Values — Nilai Apapun yang Anda Mau

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

**Penjelasan:**

- **Format** — `[nilai]` di dalam kurung siku. Tailwind generate utility on-the-fly.
- **Warna hex/rgb** — `bg-[#ff6b6b]`. Untuk satu-off color yang tidak masuk design system.
- **`calc()`** — `h-[calc(100vh-64px)]`. Full-height minus navbar. Powerful untuk layout presisi.
- **CSS property arbitrary** — `[writing-mode:vertical-rl]`. Pakai saat tidak ada utility Tailwind untuk property tersebut.
- **Fluid typography** — `text-[clamp(1rem,4vw,3rem)]` = font size yang scale dengan viewport. Modern technique.

::: warning ⚠️ Jangan Overuse
Arbitrary values **tidak masuk design system**. Pakai hanya untuk satu-off cases. Untuk warna/spacing yang sering muncul, tambahkan ke `tailwind.config.js` (Bab 14).
:::

## 15.2 📝 Direktif CSS — `@layer`, `@apply`, `@theme`

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
    @apply bg-blue-600 bg-clip-text text-transparent;
  }
  .text-gradient-purple {
    @apply bg-purple-600 bg-clip-text text-transparent;
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

**Penjelasan setiap layer:**

- **`@layer base`** — Override / tambah style dasar HTML. Posisinya di antara reset dan utilities. Untuk: `html`, `body`, `h1-h6`, link default, scrollbar, dll.
- **`@layer components`** — Class yang bisa dipakai ulang. Hasil generate = utility component. Lebih baik di project vanilla JS. Untuk React/Vue, lebih baik buat `.jsx`/`.vue` file.
- **`@layer utilities`** — Utility custom yang tidak ada di Tailwind. Posisinya di akhir (priority tertinggi).
- **`@apply`** — Pakai utility Tailwind di dalam CSS biasa. Sangat berguna untuk extract pattern.
- **`theme('colors.gray.300')`** — Akses nilai dari `tailwind.config.js` di CSS.

::: warning ⚠️ Kapan Pakai `@apply` dan Kapan Tidak?
| Situasi | Rekomendasi |
|---|---|
| Komponen yang sama muncul 10+ kali | ✅ Pakai `@apply` |
| Komponen framework (Button, Input, Card) | ✅ Pakai `@apply` |
| Komponen yang jarang berulang | ❌ Langsung tulis class di HTML |
| Dalam project React/Vue | ❌ Lebih baik buat file `.jsx`/`.vue` |
:::

## 📌 Ringkasan Bab 15

| Konsep              | Kapan Dipakai                                              |
| ------------------ | ---------------------------------------------------------- |
| `[]` arbitrary value | Nilai custom yang tidak ada di Tailwind                  |
| `[calc()]`           | Layout presisi (height = 100vh - navbar)               |
| `[#hex]`             | Warna custom untuk one-off                                |
| `@layer base`        | Override style HTML default                              |
| `@layer components`  | Extract pattern yang berulang                              |
| `@layer utilities`   | Utility custom (gradient text, glass, dll)              |
| `@apply`             | Pakai utility Tailwind di dalam CSS                       |

---

➡️ Lanjut ke [Bab 16 — Plugin Tailwind & Design Tokens](/bagian-6/bab-16)
