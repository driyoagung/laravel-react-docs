---
title: Bab 11 — Modal, Alert, Badge & Komponen Interaktif
---

# 📖 Bab 11 — Modal, Alert, Badge & Komponen Interaktif

## 11.1 📢 Alert & Notification

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

**Penjelasan setiap alert:**

- **`flex items-start gap-3`** — Icon di atas (sejajar dengan text), `items-start` agar icon align dengan text pertama.
- **`shrink-0`** — Icon tidak boleh shrink. Penting jika text panjang.
- **`ml-auto`** — Tombol close di-justify ke kanan.
- **Warna konsisten** — Background 50 (sangat muda), border 200, text 800 (gelap). Kontras cukup untuk readability.
- **Toast `fixed bottom-4 right-4`** — Posisikan di pojok kanan bawah. `z-50` agar di atas konten lain.

## 11.2 🏷️ Badge & Status Indicator

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

**Penjelasan:**

- **5 warna** — gray, blue, green, yellow, red. Untuk semua status (default, info, sukses, warning, danger).
- **`px-2.5 py-0.5`** — Padding minimal untuk badge. Compact.
- **Dot indicator** — Visual cue untuk "live" status (online, active, processing).
- **Notification badge** — `absolute -top-1 -right-1` untuk posisi di pojok kanan atas parent `relative`.

## 11.3 🪟 Modal

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

**Penjelasan setiap bagian:**

- **`<div class="fixed inset-0 z-50 ...">`** — Full screen overlay. `inset-0` = top/right/bottom/left = 0. `z-50` = di atas konten lain.
- **`bg-black/50 backdrop-blur-sm`** — Background semi-transparan hitam + blur konten di belakang. **Efek glassmorphism**.
- **`<div class="bg-white rounded-2xl ...">`** — Modal box. `max-w-md` untuk lebar max 448px.
- **Header** — `border-b` untuk pisahkan dari body. Tombol close di pojok kanan.
- **Body** — Konten utama. `flex items-center` untuk icon + text horizontal.
- **Footer** — `bg-gray-50` untuk bedakan dari body. Tombol action di kanan.
- **JS untuk toggle** — Pakai React useState / Vue ref untuk show/hide modal. Tailwind tidak punya JS untuk ini — hanya styling.

## 📌 Ringkasan Bab 11

| Komponen            | Kapan Dipakai                                              |
| ------------------ | ---------------------------------------------------------- |
| Alert               | Pesan feedback (sukses, error, warning, info)             |
| Toast               | Notifikasi pojok layar, auto-dismiss                      |
| Badge               | Status, kategori, count (notification badge)               |
| Modal               | Konfirmasi, form detail, lightbox image                   |
| `backdrop-blur`     | Efek glassmorphism untuk modal/overlay                    |
| `fixed inset-0`     | Full screen overlay                                       |
| `z-50`              | Layer untuk modal/toast (di atas konten lain)             |

---

➡️ Lanjut ke [Bagian V — Responsive & Dark Mode](/bagian-5/index)
