---
title: Bab 12 — Responsive Design
---

# 📖 Bab 12 — Responsive Design

## 12.1 📱 Breakpoint Tailwind — Mobile-First

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

**Penjelasan:**

- **Mobile-first** berarti style default ditulis untuk layar kecil (mobile). Lalu di-breakpoint yang lebih besar, Anda override dengan `sm:`, `md:`, `lg:`, `xl:`.
- **Cara baca** — `text-base md:text-lg` artinya di mobile pakai `text-base` (16px), di tablet ke atas (≥768px) jadi `text-lg` (18px).
- **Default Tailwind breakpoints** — Cocok untuk 95% project. Bisa custom di `tailwind.config.js` (Bab 14).

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

**Penjelasan setiap pola:**

- **Text size responsif** — `text-sm md:text-base lg:text-lg` = naik bertahap. Jangan terlalu cepat (mobile ke desktop = 4 size).
- **Grid responsif** — Mobile: stack vertikal (1 kolom). Desktop: grid horizontal. Default pattern untuk list/card.
- **Tampilkan/sembunyikan** — `block md:hidden` = tampil di mobile saja. `hidden md:block` = sembunyi di mobile, tampil di tablet ke atas.

## 12.2 📐 Pola Responsif yang Sering Dipakai

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
    <a href="#">Tentang</a>
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
    <img src="https://picsum.photos/seed/hero/600/400" class="w-full rounded-2xl shadow-xl" />
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

**Penjelasan setiap pola:**

- **Pola ① — Navbar hamburger** — Default tampil hamburger di mobile. Di tablet ke atas (`md:hidden` jadi `md:block`), tampil menu horizontal.
- **Pola ② — Hero** — `flex-col lg:flex-row` = stack di mobile, horizontal di desktop. `text-center lg:text-left` = text center di mobile, left-align di desktop. `gap-8 lg:gap-16` = jarak lebih besar di desktop.
- **Pola ③ — Padding** — Padding lebih kecil di mobile, lebih besar di desktop. Ruang lebih lega di layar besar.
- **Pola ④ — Fluid heading** — `text-2xl` di mobile sampai `text-6xl` di desktop. Subtle tapi powerful.

## 12.3 📌 Container Pattern

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

**Penjelasan:**

- **`w-full max-w-7xl mx-auto`** — Lebar 100% tapi max 1280px, di-center horizontal. Pola paling umum.
- **`px-4 sm:px-6 lg:px-8`** — Padding horizontal responsif. Mobile: 16px, tablet: 24px, desktop: 32px.
- **Class `container`** — Shorthand Tailwind. Otomatis set max-width per breakpoint (`sm:640px`, `md:768px`, dst). Plus `mx-auto`. Tinggal tambah padding.
- **Best practice** — Extract ini jadi component di React/Vue. Pakai di setiap section yang full-width.

## 📌 Ringkasan Bab 12

| Konsep                | Kapan Dipakai                                              |
| --------------------- | ---------------------------------------------------------- |
| Mobile-first           | Default untuk semua project web 2026                       |
| `sm:/md:/lg:/xl:`     | Override di breakpoint yang lebih besar                  |
| Hamburger → horizontal | Default navbar pattern untuk responsive                 |
| Stack → side-by-side   | Hero section atau 2-column layout                         |
| Container pattern      | `max-w-{size} mx-auto px-{n}` untuk konten utama         |

---

➡️ Lanjut ke [Bab 13 — Dark Mode](/bagian-5/bab-13)
