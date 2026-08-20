---
title: Bab 4 — Box Model, Sizing & Positioning
---

# 📖 Bab 4 — Box Model, Sizing & Positioning

## 4.1 📦 Box Model dengan Tailwind

```html
<!-- WIDTH -->
<div class="w-full">  100% parent  </div>
<div class="w-1/2">   50% parent   </div>
<div class="w-1/3">   33.33%       </div>
<div class="w-64">    256px (16rem) </div>
<div class="w-screen">100vw         </div>
<div class="w-fit">   fit-content   </div>
<div class="w-max">   max-content   </div>
<div class="w-min">   min-content   </div>

<!-- HEIGHT -->
<div class="h-full">    100% parent  </div>
<div class="h-screen">  100vh        </div>
<div class="h-48">      192px        </div>
<div class="h-px">      1px          </div>
<div class="min-h-screen"> min 100vh </div>

<!-- MAX-WIDTH (sangat berguna untuk container konten) -->
<div class="max-w-sm">   384px  </div>
<div class="max-w-md">   448px  </div>
<div class="max-w-lg">   512px  </div>
<div class="max-w-xl">   576px  </div>
<div class="max-w-2xl">  672px  </div>
<div class="max-w-4xl">  896px  </div>
<div class="max-w-6xl">  1152px </div>
<div class="max-w-7xl">  1280px </div>
<div class="max-w-prose"> ~65ch — ideal untuk artikel </div>

<!-- OVERFLOW -->
<div class="overflow-hidden">  Konten terpotong          </div>
<div class="overflow-auto">    Scroll jika perlu         </div>
<div class="overflow-scroll">  Selalu ada scrollbar      </div>
<div class="overflow-x-auto">  Scroll horizontal saja    </div>
<div class="overflow-y-auto">  Scroll vertikal saja      </div>
```

**Penjelasan setiap kelompok:**

**Width:**
- **`w-full`** — Lebar 100% parent. Untuk section/kontainer.
- **`w-1/2`, `w-1/3`** — Fractional width. Untuk split layout (sidebar 1/3, content 2/3).
- **`w-64`** — Fixed width. Pakai skala 4px (256px).
- **`w-screen`** — Full viewport width. Untuk hero full-bleed.
- **`w-fit`, `w-max`, `w-min`** — Intrinsic sizing. Browser yang tentukan.

**Height:**
- **`h-full`** — 100% parent. Perlu parent punya height defined.
- **`h-screen`** — Full viewport. Untuk landing page, hero.
- **`h-48`** — Fixed 192px. Untuk image container.
- **`h-px`** — 1px. Untuk divider line.
- **`min-h-screen`** — Minimal 100vh. Untuk halaman yang harus full-height minimal.

**Max-Width:**
- **`max-w-7xl`** (1280px) — Default untuk layout utama.
- **`max-w-prose`** (65ch) — Ideal untuk artikel/blog. Karakter per baris optimal untuk readability.
- **`max-w-sm/md/lg`** — Untuk card atau form.

**Overflow:**
- **`overflow-hidden`** — Konten terpotong, tidak ada scrollbar. Untuk image dengan object-cover.
- **`overflow-auto`** — Scrollbar muncul hanya saat dibutuhkan. Best practice.
- **`overflow-x/y-auto`** — Scroll hanya di axis tertentu. Untuk table di mobile.

## 4.2 📍 Positioning

```html
<!-- Position -->
<div class="relative">
  <!-- Parent: relative, menjadi "jangkar" untuk child absolute -->
  <div class="absolute top-0 right-0">Badge pojok kanan atas</div>
  <div class="absolute inset-0 bg-black/50">Overlay penuh</div>
  <div class="absolute bottom-4 left-1/2 -translate-x-1/2">Tengah bawah</div>
</div>

<div class="fixed top-0 left-0 right-0 z-50 bg-white shadow">
  Navbar fixed — selalu di atas saat scroll
</div>

<div class="sticky top-16 z-40">
  Sticky — ikut scroll sampai menyentuh top:64px, lalu berhenti
</div>

<!-- Z-Index -->
<div class="z-0">   z-index: 0   </div>
<div class="z-10">  z-index: 10  </div>
<div class="z-20">  z-index: 20  </div>
<div class="z-30">  z-index: 30  </div>
<div class="z-40">  z-index: 40  </div>
<div class="z-50">  z-index: 50  </div>
<div class="z-auto">z-index: auto</div>

<!-- Inset — shortcut untuk top/right/bottom/left -->
<div class="inset-0">        top:0 right:0 bottom:0 left:0 (stretch penuh) </div>
<div class="inset-x-0">      left:0 right:0 (stretch horizontal)           </div>
<div class="inset-y-0">      top:0 bottom:0 (stretch vertikal)             </div>
<div class="top-1/2 -translate-y-1/2"> Vertical center trick              </div>
```

**Penjelasan:**

**Position types:**
- **`relative`** — Parent untuk absolute child. **Wajib** untuk absolute positioning bekerja.
- **`absolute`** — Di-relatifkan ke parent `relative` terdekat. Default position: static.
- **`fixed`** — Di-relatifkan ke viewport. Untuk navbar/modal.
- **`sticky`** — Hybrid: behave seperti `relative` sampai scroll melewati threshold, lalu `fixed`. Untuk section heading.

**Z-Index:**
- Skala 0-50 (default). Bisa extend di `tailwind.config.js`.
- **`z-50`** — Untuk modal, navbar fixed.
- **`z-10`** — Untuk dropdown.
- **`z-0`** atau `z-auto` — Default layer.

**Inset:**
- **`inset-0`** = `top:0; right:0; bottom:0; left:0` — Stretch penuh.
- **`inset-x-0`** = `left:0; right:0` — Stretch horizontal saja.
- **`top-1/2 -translate-y-1/2`** — Vertical center trick. Translate -50% untuk offset dari center.

## 4.3 🎬 Studi Kasus: Card dengan Badge Absolute

```html
<!-- Card listing properti — badge di pojok, overlay gradient di bawah -->
<div class="relative rounded-xl overflow-hidden group cursor-pointer">

  <!-- Gambar -->
    <img
      src="https://picsum.photos/seed/property/600/400"
      alt="Villa Bali"
      class="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
    />

  <!-- Badge "Superhost" di pojok kiri atas -->
  <span class="absolute top-3 left-3 bg-white text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow">
    ⭐ Superhost
  </span>

  <!-- Tombol wishlist di pojok kanan atas -->
  <button class="absolute top-3 right-3 bg-white/80 hover:bg-white p-2 rounded-full shadow transition-colors">
    🤍
  </button>

  <!-- Gradient overlay di bawah -->
  <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent">
    <div class="absolute bottom-3 left-3 text-white">
      <p class="font-semibold text-sm">Villa Ubud · Bali</p>
      <p class="text-xs text-white/80">⭐ 4.9 · 128 ulasan</p>
    </div>
  </div>

</div>
```

**Penjelasan setiap bagian:**

- **Container `relative`** — Wajib. Menjadi "jangkar" untuk child absolute.
- **`overflow-hidden`** — Penting! Tanpa ini, badge/overlay bisa keluar dari card.
- **`object-cover`** — Gambar di-scale proporsional, crop jika perlu. Standar untuk thumbnail.
- **`group group-hover:scale-105`** — Saat card di-hover, gambar di-scale 105%. Smooth transition.
- **Badge absolute** — `top-3 left-3` (12px dari pojok). `bg-white/80` (80% opacity) untuk efek subtle.
- **Gradient overlay** — `bg-gradient-to-t from-black/60` = gradient dari bawah ke atas, hitam 60% opacity. Buat teks di atas gambar tetap readable.
- **`<div class="absolute bottom-3 left-3 text-white">`** — Posisi teks di dalam gradient, di pojok bawah.

## 📌 Ringkasan Bab 4

| Konsep              | Penjelasan Singkat                                              |
| ------------------- | --------------------------------------------------------------- |
| Box model           | padding, margin, border, content — semua via utility           |
| Width / Height      | `w-{n}`, `h-{n}`, fractional, screen, fit                     |
| `max-w-*`           | Container untuk konten — prose/sm/md/lg/xl/2xl/4xl/6xl/7xl  |
| `position: relative`| Parent untuk absolute child                                   |
| `position: absolute`| Posisi relatif ke parent `relative`                            |
| `position: fixed`   | Posisi relatif ke viewport                                     |
| `position: sticky`  | Hybrid — `relative` sampai threshold, lalu `fixed`             |
| `z-index`           | Layer — `z-0` sampai `z-50`                                   |
| `inset-*`           | Shortcut untuk top/right/bottom/left                            |

---

➡️ Lanjut ke [Bab 5 — Flexbox dengan Tailwind](/bagian-2/bab-5) — **Skill #1 yang paling sering dipakai!**
