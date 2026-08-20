---
title: Bab 5 — Flexbox dengan Tailwind
---

# 📖 Bab 5 — Flexbox dengan Tailwind

> 🥈 **Bab KRITIS** — 80% layout sehari-hari diselesaikan di sini!

## 5.1 🔧 Konsep Flexbox Review

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

**Penjelasan property flexbox:**

**Parent (container):**
- **`flex-direction`** — Arah axis utama. `row` (horizontal, default) atau `col` (vertikal).
- **`justify-content`** — Distribusi child sepanjang main axis. `justify-between` = child di kiri/kanan dengan space di tengah.
- **`align-items`** — Distribusi child sepanjang cross axis. `items-center` = center vertikal.
- **`flex-wrap`** — Child bisa wrap ke baris baru atau tidak.
- **`gap`** — Jarak antar child. Lebih modern dari `margin` di child.

**Child (item):**
- **`flex-grow`** — Child boleh grow untuk isi sisa space? `flex-1` = grow, `flex-0` = tidak.
- **`flex-shrink`** — Child boleh shrink? Default shrink=1. `shrink-0` = tidak.
- **`flex-basis`** — Ukuran default child sebelum grow/shrink.
- **`align-self`** — Override align-items untuk child tertentu.
- **`order`** — Ubah urutan visual tanpa ubah HTML.

## 5.2 📐 Pola Flexbox yang Paling Sering Dipakai

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
```

**Penjelasan:**

- **`flex items-center justify-between`** — Default horizontal (`flex-row`), child center secara vertikal, jarak antara child di-extend.
- **Logo kiri, menu kanan** — Pola paling umum di navbar. Logo `flex-shrink-0` agar tidak mengecil.

```html
<!-- ② Card dengan footer yang selalu di bawah -->
<div class="flex flex-col h-full bg-white rounded-lg p-4 border">
  <img src="https://picsum.photos/seed/sample/600/400" class="w-full h-40 object-cover rounded-md" />
  <h3 class="font-semibold mt-3">Judul Produk</h3>
  <p class="text-gray-500 text-sm mt-1 flex-1"> <!-- flex-1 mendorong footer ke bawah -->
    Deskripsi produk yang bisa panjang atau pendek...
  </p>
  <div class="flex items-center justify-between mt-4 pt-4 border-t">
    <span class="font-bold text-blue-600">Rp 250.000</span>
    <button class="bg-blue-600 text-white px-3 py-1.5 rounded text-sm">Beli</button>
  </div>
</div>
```

**Penjelasan:**

- **`flex flex-col h-full`** — Column layout, tinggi penuh parent. Wajib untuk card yang sejajar.
- **`flex-1` di `<p>`** — Trik agar `<p>` grow untuk isi space, **mendorong footer ke bawah**. Tanpa ini, footer bisa naik ke tengah jika deskripsi pendek.
- **`<div class="border-t">` di footer** — Garis pemisah antara konten dan footer. `border-t` = border-top.

```html
<!-- ③ Centering penuh (vertical + horizontal) — hero section, empty state -->
<div class="flex items-center justify-center min-h-screen bg-gray-50">
  <div class="text-center">
    <h1 class="text-4xl font-bold">Selamat Datang</h1>
    <p class="text-gray-500 mt-2">Mulai perjalanan Anda di sini.</p>
  </div>
</div>
```

**Penjelasan:**

- **`flex items-center justify-center`** — 2 property ini = center dua arah (vertical + horizontal).
- **`min-h-screen`** — Minimal 100vh. Untuk section yang harus center di tengah layar penuh.

```html
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
```

**Penjelasan:**

- **`flex`** — Sidebar + main dalam 1 baris horizontal.
- **`aside w-64 shrink-0`** — Sidebar fixed width 256px, TIDAK shrink. Penting agar tidak kolaps.
- **`main flex-1`** — Grow untuk isi sisa space. Otomatis menyesuaikan dengan lebar sidebar.

```html
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

**Penjelasan:**

- **Pattern ⑤** — Untuk baris label: nilai. Umum di halaman profile/settings.
- **Pattern ⑥** — Tags dengan `flex-wrap` agar wrap ke baris baru jika tidak muat. `gap-2` = jarak 8px.

## 5.3 🎬 Studi Kasus: Navbar Responsif

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

**Penjelasan setiap bagian:**

- **`<header sticky top-0 z-50>`** — Navbar sticky di paling atas. `z-50` agar di atas konten lain.
- **`max-w-7xl mx-auto`** — Container dengan max-width 1280px, center horizontal.
- **Search bar `hidden md:flex`** — Hanya tampil di tablet ke atas. Di mobile, disembunyikan.
- **`<div class="w-px h-4 bg-gray-300">`** — Vertical divider line. 1px width, 16px height.
- **`hover:shadow-md transition-shadow`** — Hover effect: tambah shadow. Smooth transition.
- **`rounded-full`** — Avatar & button pakai rounded-full untuk shape bulat.

## 📌 Ringkasan Bab 5

| Pola                | Kapan Dipakai                                              |
| ------------------ | ---------------------------------------------------------- |
| `flex items-center justify-between` | Navbar, header dengan logo kiri + menu kanan  |
| `flex flex-col h-full` + `flex-1` di tengah | Card dengan footer rata bawah         |
| `flex items-center justify-center` | Center konten 2 arah (vertical + horizontal) |
| `flex` + `w-64 shrink-0` + `flex-1` | Sidebar + main content layout         |
| `flex flex-wrap gap-2` | Tag/chip list yang wrap                     |
| `group` + `group-hover:` | Card yang bisa di-hover dengan animasi    |

---

➡️ Lanjut ke [Bab 6 — CSS Grid dengan Tailwind](/bagian-2/bab-6)
