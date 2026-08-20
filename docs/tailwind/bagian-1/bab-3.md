---
title: Bab 3 — Typography & Text Utilities
---

# 📖 Bab 3 — Typography & Text Utilities

## 3.1 📏 Skala Font Size

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

**Penjelasan:**

- **Skala modular** — 12px → 14px → 16px (default) → 18px → 20px → 24px → 30px → 36px → 48px → 60px → 72px → 96px → 128px.
- **`text-base` (16px) adalah default** — Tag `<p>` tanpa class akan 16px.
- **Type scale** — Pakai skala Tailwind, jangan pakai ukuran custom. Ini untuk konsistensi typography.
- **Untuk hero/display** — `text-6xl` ke atas cocok untuk hero section, marketing pages.

## 3.2 🔤 Font Weight

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

**Penjelasan:**

- **9 tingkat ketebalan** — dari 100 (Thin) sampai 900 (Black).
- **Paling sering dipakai** — `font-normal` (400) untuk body text, `font-semibold` (600) untuk subheading, `font-bold` (700) untuk heading.
- **`font-medium` (500)** — Untuk label, button, emphasis.
- **Hindari semua ketebalan** — Pilih 2-3 ketebalan saja untuk project. Terlalu banyak weight = tidak ada hierarki.

## 3.3 📐 Line Height, Letter Spacing & Text Align

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

**Penjelasan setiap kelompok:**

**Line Height (`leading-*`):**
- **`leading-none` (1)** — Untuk heading yang besar. Spasi antar baris rapat.
- **`leading-tight` (1.25)** — Untuk heading. Tidak terlalu rapat.
- **`leading-normal` (1.5)** — Default untuk body text. Easy to read.
- **`leading-relaxed` (1.625)** — Untuk artikel panjang, blog post. Lebih lega.
- **`leading-loose` (2)** — Untuk teks yang perlu banyak spasi (mis. undangan).

**Letter Spacing (`tracking-*`):**
- **`tracking-tighter` / `tight`** — Untuk heading besar, brand name. Buat lebih "rapat".
- **`tracking-wide` / `wider` / `widest`** — Untuk **uppercase** text (label, button). Buat lebih "lega" karena huruf besar biasanya terlalu rapat.

**Text Align:**
- Standar. `text-justify` jarang dipakai di web (terlalu banyak spasi antar kata).

**Text Decoration & Transform:**
- **`uppercase`** — Untuk label, button, badge.
- **`capitalize`** — Untuk judul (Setiap Awal Huruf Besar).

**Text Overflow:**
- **`truncate`** — Shortcut untuk `overflow-hidden whitespace-nowrap text-ellipsis`. Tampilkan `...` di akhir. **Paling sering dipakai**.

## 3.4 🎬 Studi Kasus: Tipografi Artikel Blog

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

**Penjelasan setiap bagian:**

- **Badge kategori** — Pakai `uppercase tracking-widest` untuk label. Tracking wide bikin huruf besar lebih mudah dibaca.
- **Judul** — `text-4xl font-bold leading-tight`. Leading tight cocok untuk heading (tidak terlalu longgar).
- **Meta info** — `flex gap-4` untuk horizontal layout. `·` (middle dot) sebagai separator.
- **Konten** — `prose prose-lg` (dari `@tailwindcss/typography`) untuk styling otomatis konten artikel. Anda tidak perlu styling manual untuk `<h2>`, `<p>`, dll di dalam.
- **Inline code** — Pakai `bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-red-600` untuk styling inline code. Pola ini sangat umum.

## 📌 Ringkasan Bab 3

| Konsep              | Penjelasan Singkat                                              |
| ------------------- | --------------------------------------------------------------- |
| Type scale           | text-xs sampai text-9xl, default text-base (16px)              |
| Font weight          | 9 tingkat, paling sering font-normal/medium/semibold/bold      |
| Line height          | leading-none (1) sampai leading-loose (2)                      |
| Tracking             | Letter spacing, sering untuk UPPERCASE label                  |
| Truncate             | overflow-hidden + ellipsis + nowrap dalam 1 class              |
| Prose                | Plugin @tailwindcss/typography untuk styling otomatis artikel   |

---

➡️ Lanjut ke [Bagian II — Layout & Spacing](/bagian-2/index) — Bab 5 (Flexbox) adalah skill yang paling sering dipakai sehari-hari!
