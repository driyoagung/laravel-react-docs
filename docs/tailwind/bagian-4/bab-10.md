---
title: Bab 10 — Card, List & Table
---

# 📖 Bab 10 — Card, List & Table

## 10.1 🃏 Variasi Card

```html
<!-- Card Dasar -->
<div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
  <img src="https://picsum.photos/seed/sample/600/400" class="w-full h-48 object-cover" />
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
  <img src="https://picsum.photos/seed/sample/600/400" class="w-24 h-24 rounded-lg object-cover shrink-0" />
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
<div class="bg-blue-600 rounded-xl p-5 text-white">
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

**Penjelasan:**

- **Card dasar** — `overflow-hidden` PENTING agar `rounded-xl` di-clip dengan image. `line-clamp-2` untuk potong teks 2 baris.
- **Card horizontal** — `flex gap-4` dengan image di kiri, konten di kanan. `min-w-0` agar child bisa shrink.
- **Stat card** — Gradient background untuk highlight penting. Icon di pojok, metric besar, delta kecil.

## 10.2 📋 Table yang Profesional

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

**Penjelasan setiap bagian:**

- **`<div class="overflow-x-auto">`** — Penting! Untuk mobile, tabel bisa di-scroll horizontal. Tanpa ini, tabel akan overflow keluar container.
- **`uppercase tracking-wider`** — Style standar untuk header tabel. Buat label "STATUS", "PELANGGAN" lebih mudah dibaca.
- **`divide-y divide-gray-100`** — Border antar row tabel. Lebih clean dari `border-b` di setiap `<td>`.
- **`hover:bg-gray-50 transition-colors`** — Row highlight saat hover. Smooth transition.
- **Avatar + nama** — Default pattern untuk "who did what". Selalu tampilkan avatar, inisial, atau icon — biar user cepat scan.
- **Status badge dengan dot** — `<span class="w-1.5 h-1.5 rounded-full bg-green-500">` di kiri text. Visual cue untuk status.

## 📌 Ringkasan Bab 10

| Komponen            | Kapan Dipakai                                              |
| ------------------ | ---------------------------------------------------------- |
| Card dasar          | Konten singkat (artikel, produk) dengan image             |
| Card horizontal     | List item dengan image kecil di kiri                      |
| Stat card           | Metric penting di dashboard (pendapatan, user count)     |
| Tabel dengan search | Data tabular yang perlu di-filter                        |
| `overflow-x-auto`   | Tabel di mobile — bisa di-scroll horizontal               |
| `divide-y`          | Garis antar row tabel                                      |
| Pagination          | Navigasi antar halaman data                               |

---

➡️ Lanjut ke [Bab 11 — Modal, Alert, Badge & Komponen Interaktif](/bagian-4/bab-11)
