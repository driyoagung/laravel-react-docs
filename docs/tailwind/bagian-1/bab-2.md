---
title: Bab 2 — Cara Berpikir Utility-First
---

# 📖 Bab 2 — Cara Berpikir Utility-First

> 🥇 **Bab PALING KRITIS** di ebook ini — mengubah mindset Anda tentang CSS!

## 2.1 🔄 Perubahan Mindset — Ini yang Paling Penting

```
CARA LAMA (CSS Konvensional):

HTML:
  <div class="product-card">
    <img class="product-card__image" src="https://picsum.photos/seed/sample/600/400" />
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
    <img class="w-full h-48 object-cover" src="https://picsum.photos/seed/sample/600/400" />
    <h3 class="text-lg font-semibold mt-3">Nama Produk</h3>
  </div>
```

**Penjelasan perbandingan:**

**Cara Lama (Semantic Class):**
- Class semantic seperti `.product-card` — nama yang menjelaskan **APA** elemennya.
- **2 file terpisah** — HTML untuk struktur, CSS untuk style. Anda harus maintain 2 tempat.
- **Nama panjang** — BEM convention: `product-card__image-wrapper`. Diskusi nama bisa makan waktu berjam-jam di tim.
- **CSS terpusat** — File CSS bisa mencapai ribuan baris.

**Cara Tailwind (Utility-First):**
- Class utility menjelaskan **BAGAIMANA** tampilannya — `bg-white`, `rounded-lg`, `p-4`.
- **1 file** — Style langsung di HTML. Tidak ada CSS terpisah (kecuali untuk `@layer components`).
- **Tidak perlu nama** — Class sudah ada. Tidak ada diskusi naming.
- **Style terdistribusi** — Style "ikut" dengan HTML. Hapus elemen = style ikut hilang.

## 2.2 💡 Mengapa "Menggabungkan Class" Lebih Baik?

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

**Penjelasan setiap baris:**

**Edit CSS Konvensional:**
- **Tidak tahu yang terpengaruh** — File CSS terpusat. Edit `.product-card` di CSS, tapi dipakai di mana? Anda harus grep.
- **Takut hapus** — Class mungkin dipakai di tempat lain. Lebih aman dibiarkan.
- **CSS membengkak** — Dead code menumpuk. Bundle membesar.

**Edit Class Tailwind:**
- **Tahu yang berubah** — Class langsung di element. Edit `bg-white` jadi `bg-blue-500`, Anda tahu persis elemen mana.
- **Hapus elemen = style hilang** — Tidak ada lagi "CSS yang tidak terpakai". Tree-shaking otomatis.
- **Bundle selalu optimal** — Hanya class yang dipakai di-bundle.

## 2.3 🔍 Anatomi Sebuah Class Tailwind

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

**Penjelasan:**

- **3 bagian utama** — `prefix-property` atau `utility-nama-shade`.
- **`bg-blue-500`** — prefix `bg-` (background) + nama `blue` + shade `500`.
- **Shade** — 50-950 = terang ke gelap. 500 = medium (default untuk kebanyakan warna).
- **Property value** — Utility class generate 1 baris CSS. Anda tidak perlu tulis manual.

## 2.4 📐 Sistem Spacing Tailwind — Satuan yang Konsisten

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

**Penjelasan:**

- **Skala berbasis 4px** — Setiap unit kelipatan 4. Ini adalah design system standard (8-point grid sering dipakai, Tailwind pakai 4-point).
- **Paling sering** — `4` (16px) adalah default untuk padding/margin di komponen. Familiar di Bootstrap juga.
- **Konsistensi** — Tidak ada "padding 13px" atau "14px" yang nyasar. Semuanya dari skala.

> 💡 **Pakai angka ini untuk:**
> - `p-{n}` → padding semua sisi
> - `px-{n}` → padding kiri-kanan, `py-{n}` → padding atas-bawah
> - `pt-{n}` `pr-{n}` `pb-{n}` `pl-{n}` → padding per sisi
> - `m-{n}` `mx-{n}` `my-{n}` `mt-{n}` dst → margin
> - `gap-{n}` → gap di flex/grid
> - `space-x-{n}` → gap horizontal antar child
> - `w-{n}` `h-{n}` → width & height

**Penjelasan naming:**

- **`p-{n}`** = padding semua sisi
- **`px-{n}`** = padding horizontal (kiri + kanan)
- **`py-{n}`** = padding vertikal (atas + bawah)
- **`pt/pr/pb/pl-{n}`** = padding per sisi (top, right, bottom, left)
- Sama pattern untuk `m` (margin).
- **`gap-{n}`** = jarak antar child di flex/grid container.
- **`space-x-{n}`** = jarak horizontal antar child (alternatif untuk `gap`).

## 2.5 🎯 Class Tailwind yang Paling Sering Dipakai (Top 30)

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

**Penjelasan setiap kelompok:**

- **Display & Layout** — Pondasi untuk layout apapun. `flex` dan `grid` adalah 2 utility terpenting.
- **Flexbox** — Untuk layout 1D (baris ATAU kolom). `items-center` + `justify-center` = center.
- **Sizing** — `w-full`, `h-screen` untuk full-width/height. `container` untuk layout responsif.
- **Spacing** — `p-4` (16px padding) paling sering. `mx-auto` untuk center horizontal.
- **Typography** — Scale `text-xs` sampai `text-9xl` sudah cukup untuk 90% kasus.
- **Background & Border** — `rounded-lg` (8px) untuk card, `rounded-full` untuk avatar/circle.
- **Shadow** — `shadow-sm` untuk card subtle, `shadow-lg` untuk modal/floating element.

## 2.6 🔗 Pseudo-class Prefix — Hover, Focus, Active

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

**Penjelasan setiap state:**

- **`hover:`** — Saat mouse di atas element. Contoh: `hover:bg-blue-700` (warna lebih gelap saat hover).
- **`focus:`** — Saat element di-focus (biasanya via tab atau click). Penting untuk **accessibility** — orang yang navigasi pakai keyboard harus lihat di mana focus-nya.
- **`active:`** — Saat element sedang di-klik/ditekan. Contoh: `active:scale-95` untuk efek "pressed".
- **`group` + `group-hover:`** — Parent punya class `group`, child bisa pakai `group-hover:` yang aktif saat PARENT di-hover. Ini powerful untuk card yang keseluruhan clickable.
- **`peer` + `peer-checked:`** — Sibling bisa react ke state sibling lain. Contoh: toggle switch tanpa JavaScript.

## 📌 Ringkasan Bab 2

| Konsep                | Penjelasan Singkat                                              |
| --------------------- | --------------------------------------------------------------- |
| Utility-first          | Class kecil, gabungkan untuk styling                             |
| Semantic class (lama) | Nama class yang mendeskripsikan peran (.btn-primary)             |
| Mobile-first           | Default tanpa prefix, breakpoint pakai prefix                   |
| Tree-shaking           | Purge otomatis, bundle selalu optimal                            |
| Pseudo-class prefix    | `hover:`, `focus:`, `active:`, dll — state via prefix           |
| Group & Peer           | Parent-child / sibling relationships di Tailwind                |

---

➡️ Lanjut ke [Bab 3 — Typography & Text Utilities](/bagian-1/bab-3)
