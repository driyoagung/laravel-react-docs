---
title: Bab 6 — CSS Grid dengan Tailwind
---

# 📖 Bab 6 — CSS Grid dengan Tailwind

## 6.1 🔧 Dasar Grid Tailwind

```html
<!-- Grid dengan kolom tetap -->
<div class="grid grid-cols-3 gap-4">
  <div class="bg-blue-100 p-4 rounded">Kolom 1</div>
  <div class="bg-blue-100 p-4 rounded">Kolom 2</div>
  <div class="bg-blue-100 p-4 rounded">Kolom 3</div>
</div>

<!-- Grid responsif — 1 kolom di mobile, 2 di tablet, 4 di desktop -->
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

**Penjelasan:**

- **`grid`** — Set `display: grid`.
- **`grid-cols-{n}`** — Tentukan jumlah kolom tetap. `grid-cols-3` = 3 kolom sama lebar.
- **`gap-{n}`** — Jarak antar cell (row + column). Lebih clean dari `margin`.
- **`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`** — Responsive columns. Mobile: 1, tablet: 2, desktop: 4.
- **`col-span-{n}`** — Item ini ambil `n` kolom.
- **`row-span-{n}`** — Item ini ambil `n` baris.
- **`grid-rows-{n}`** — Tentukan jumlah baris (jarang, biasanya auto).

## 6.2 📐 Auto-fit & Auto-fill — Grid yang Benar-benar Responsif

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

**Penjelasan:**

- **`auto-fill` + `minmax(280px, 1fr)`** — Grid otomatis isi sebanyak mungkin kolom, dengan min width 280px per item.
- **Tidak perlu breakpoint** — Browser hitung sendiri. Di layar 1200px → 4 kolom. Di 600px → 2 kolom.
- **`[grid-template-columns:...]`** — Arbitrary value Tailwind. Pakai kurung siku `[]` untuk nilai CSS custom.
- **Best practice** — Untuk grid card/list yang ingin selalu responsif tanpa setup breakpoint manual.

## 6.3 🎬 Studi Kasus: Layout Dashboard Admin

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

**Penjelasan setiap bagian:**

- **`<div class="min-h-screen bg-gray-100">`** — Container full-height dengan background gray.
- **`<header class="h-16 flex items-center px-6">`** — Navbar fixed height 64px. `flex items-center` untuk center konten vertikal.
- **`<aside class="w-56 shrink-0 ...">`** — Sidebar 224px, `shrink-0` agar tidak kolaps.
- **`min-h-[calc(100vh-4rem)]`** — Tinggi minimal 100vh - 64px (navbar). Arbitrary value.
- **`<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">`** — Stat cards: 1 kolom di mobile, 2 di tablet, 4 di desktop.
- **`xl:col-span-2`** — Di desktop, chart ambil 2 kolom. Sisanya 1 kolom untuk produk terlaris.

## 📌 Ringkasan Bab 6

| Konsep              | Kapan Dipakai                                              |
| ------------------ | ---------------------------------------------------------- |
| `grid grid-cols-{n}` | Layout dengan jumlah kolom tetap                       |
| Responsive grid    | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`             |
| `col-span-{n}`     | Item ambil `n` kolom                                      |
| `row-span-{n}`     | Item ambil `n` baris                                      |
| `auto-fit` grid     | Grid yang auto-responsive tanpa breakpoint manual         |
| `gap-{n}`          | Jarak antar cell                                          |

---

➡️ Lanjut ke [Bagian III — Typography & Colors](/bagian-3/index)
