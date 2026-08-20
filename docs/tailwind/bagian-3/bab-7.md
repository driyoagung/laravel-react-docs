---
title: Bab 7 — Sistem Warna Tailwind
---

# 📖 Bab 7 — Sistem Warna Tailwind

## 7.1 🎨 Palet Warna Bawaan

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

**Penjelasan:**

- **Format universal** — `{prefix}-{warna}-{shade}`. Prefix `text-` untuk warna teks, `bg-` untuk background, `border-` untuk border, dll.
- **22 warna × 11 shade** = 242 kombinasi. Pilih 2-3 warna utama + gray scale.
- **Shade convention** — 50 (terang), 500 (medium), 900 (gelap). 500 adalah default untuk kebanyakan warna.
- **Pakai 50-100 untuk background subtle** (alert light, hover state).
- **Pakai 500-600 untuk warna utama** (button, link).
- **Pakai 700-900 untuk teks** yang perlu kontras tinggi.
- **Semantic colors** — Green = success, Red = danger, Yellow = warning, Blue = info. Standar UI.

## 7.2 🖌️ Background, Gradient & Opacity

```html
<!-- Solid background -->
<div class="bg-blue-600">Biru solid</div>
<div class="bg-white">Putih</div>
<div class="bg-transparent">Transparan</div>

<!-- Gradient -->
<div class="bg-blue-600 text-white p-4 rounded-xl">
  Gradient kiri ke kanan
</div>
<div class="bg-pink-500 text-white p-4 rounded-xl">
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

**Penjelasan:**

- **`bg-gradient-to-r`** — Gradient direction: `r` (right), `l` (left), `t` (top), `b` (bottom), `tl`, `tr`, `bl`, `br`.
- **`from-`, `via-`, `to-`** — Warna gradient. Minimal `from-` dan `to-`, opsional `via-` (warna tengah).
- **`bg-{color}/{opacity}`** — Cara modern Tailwind v3+. `/20` = 20% opacity. Tidak mempengaruhi child element.
- **`bg-cover`** — `background-size: cover`. Gambar menutupi container, proporsi terjaga.
- **`bg-center`** — `background-position: center`. Gambar di-center.
- **Inline style** — `style="background-image: url(...)"` untuk dynamic URL. Arbitrary value juga bisa: `bg-[url('/hero.jpg')]`.

## 7.3 🔲 Border, Ring & Divide

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

**Penjelasan:**

**Border:**
- **`border-{n}`** — Ketebalan border. `border` = 1px (default). `border-2` = 2px, `border-4` = 4px.
- **`border-t/r/b/l/x/y`** — Border per sisi. `border-t` = top, `border-x` = left+right.
- **`border-dashed` / `dotted`** — Style border. Default solid.

**Ring:**
- **`ring-{n}`** — `box-shadow` di sekeliling element. Tidak pengaruhi layout (tidak push element lain).
- **`ring-{color}`** — Warna ring. Default blue-500.
- **`ring-offset-{n}`** — Jarak antara ring dan element. Buat efek "aura".
- **Use case** — Focus state untuk accessibility, highlight element tertentu.

**Divide:**
- **`divide-x` / `divide-y`** — Border otomatis antar child. Untuk list items.
- **`divide-{color}`** — Warna divide.
- **Hemat waktu** — Tidak perlu tulis border di setiap child.

**Border Radius:**
- **Skala** — `rounded-none` (0) sampai `rounded-3xl` (24px), lalu `rounded-full` (lingkaran).
- **Paling sering** — `rounded-lg` (8px) untuk card, button. `rounded-full` untuk avatar/badge.
- **Per sudut** — `rounded-t-xl` (top corners), `rounded-tl-xl` (top-left only), dll.

## 📌 Ringkasan Bab 7

| Konsep                | Penjelasan Singkat                                              |
| --------------------- | --------------------------------------------------------------- |
| Format warna           | `{prefix}-{warna}-{shade}` — 22 warna × 11 shade             |
| Semantic colors        | Green (success), Red (danger), Yellow (warning), Blue (info)  |
| Gradient              | `bg-gradient-to-{direction} from-{c1} via-{c2} to-{c3}`    |
| Modern opacity        | `bg-blue-600/20` (Tailwind v3+) — tanpa CSS custom            |
| Border                | `border`, `border-2`, `border-{color}`, `border-{side}`        |
| Ring                  | `box-shadow` untuk focus state, tidak pengaruhi layout          |
| Divide                | Border antar flex/grid children otomatis                       |
| Border radius         | `rounded-{n}` atau `rounded-full` untuk lingkaran              |

---

➡️ Lanjut ke [Bab 8 — Shadow, Effects & Transitions](/bagian-3/bab-8)
