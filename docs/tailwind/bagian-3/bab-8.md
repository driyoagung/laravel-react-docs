---
title: Bab 8 — Shadow, Effects & Transitions
---

# 📖 Bab 8 — Shadow, Effects & Transitions

## 8.1 🌑 Box Shadow

```html
<div class="shadow-sm">    sangat tipis (1px blur)      </div>
<div class="shadow">       tipis (default)              </div>
<div class="shadow-md">    sedang                       </div>
<div class="shadow-lg">    besar                        </div>
<div class="shadow-xl">    sangat besar                 </div>
<div class="shadow-2xl">   ekstra besar                 </div>
<div class="shadow-none">  hapus shadow                 </div>
<div class="shadow-inner"> bayangan ke dalam            </div>

<!-- Shadow berwarna (Tailwind v3.0+) -->
<div class="shadow-lg shadow-blue-500/30 bg-blue-600 text-white p-4 rounded-xl">
  Card dengan colored shadow
</div>

<!-- Hover shadow — efek lift saat hover -->
<div class="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
  Hover untuk shadow lebih besar
</div>
```

**Penjelasan:**

- **Skala** — `shadow-sm` (subtle) sampai `shadow-2xl` (dramatic). Pilih sesuai hierarki.
- **`shadow-{color}/{opacity}`** — Tailwind v3+ support colored shadow. Sangat useful untuk branded glow.
- **`hover:shadow-md`** — Naikkan shadow saat hover. Combine dengan `transition-shadow` untuk animasi halus.
- **`shadow-inner`** — Bayangan ke dalam (efek inset). Untuk input fields, button aktif.

## 8.2 ✨ Transform & Transisi

```html
<!-- Transition — wajib untuk animasi halus -->
<div class="transition-all duration-200 ease-in-out">Semua properti</div>
<div class="transition-colors duration-150">Hanya warna</div>
<div class="transition-transform duration-300">Hanya transform</div>
<div class="transition-opacity duration-500">Hanya opacity</div>

<!-- Duration -->
<!-- duration-75, duration-100, duration-150, duration-200, duration-300, duration-500, duration-700, duration-1000 -->

<!-- Timing Function -->
<!-- ease-linear, ease-in, ease-out, ease-in-out -->

<!-- Transform -->
<div class="hover:scale-105 transition-transform">Membesar saat hover</div>
<div class="hover:scale-95 active:scale-90">Mengecil saat klik</div>
<div class="hover:-translate-y-1">Naik saat hover</div>
<div class="hover:translate-x-2">Geser kanan saat hover</div>
<div class="hover:rotate-3">Rotate sedikit saat hover</div>
<div class="hover:-rotate-3">Rotate berlawanan</div>
<div class="hover:skew-x-3">Skew horizontal</div>

<!-- Gabungan transform + transition (card lift effect) -->
<div class="bg-white rounded-xl p-5 shadow border hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer">
  Card yang terangkat saat hover
</div>
```

**Penjelasan:**

**Transition:**
- **`transition-all`** — Animate SEMUA property. **Paling boros performa**.
- **`transition-colors`** — Animate hanya property warna. Best practice untuk button hover.
- **`transition-transform`** — Animate scale, rotate, translate. Untuk efek lift.
- **`transition-opacity`** — Untuk fade in/out.
- **`duration-{n}`** — Lamanya animasi. 150-300ms untuk UI terasa responsif. Hindari >500ms.
- **`ease-in-out`** — Default paling natural. Pelan di awal, cepat di tengah, pelan di akhir.

**Transform:**
- **`scale-105`** — 105% (membesar 5%). Subtle hover effect.
- **`active:scale-90`** — Mengecil 10% saat ditekan. Memberi feedback "pressed".
- **`translate-y-1`** — Geser vertikal 4px. Negatif = ke atas.
- **Card lift pattern** — Kombinasi `hover:-translate-y-1` + `hover:shadow-lg` + `transition-all duration-200` = card naik dengan shadow saat hover. **Sangat umum** untuk card interaktif.

## 8.3 🌈 Filter & Backdrop Filter

```html
<!-- Filter pada elemen -->
<img class="blur-sm" src="https://picsum.photos/seed/sample/600/400">           <!-- Kabur sedikit      -->
<img class="blur-md" src="https://picsum.photos/seed/sample/600/400">           <!-- Kabur sedang       -->
<img class="blur-none" src="https://picsum.photos/seed/sample/600/400">         <!-- Tidak kabur        -->
<img class="brightness-50" src="https://picsum.photos/seed/sample/600/400">     <!-- Gelap 50%          -->
<img class="brightness-110" src="https://picsum.photos/seed/sample/600/400">    <!-- Cerah sedikit      -->
<img class="grayscale" src="https://picsum.photos/seed/sample/600/400">         <!-- Hitam putih        -->
<img class="sepia" src="https://picsum.photos/seed/sample/600/400">             <!-- Efek sepia         -->
<img class="invert" src="https://picsum.photos/seed/sample/600/400">            <!-- Warna dibalik      -->
<img class="saturate-200" src="https://picsum.photos/seed/sample/600/400">      <!-- Saturasi 2x        -->

<!-- Backdrop filter — efek di belakang elemen (kaca buram) -->
<div class="backdrop-blur-md bg-white/30 border border-white/20 rounded-xl p-4 text-white">
  Glassmorphism card — konten di belakangnya terlihat blur
</div>

<!-- Contoh full: hero dengan glassmorphism -->
<div class="relative h-screen bg-blue-900 flex items-center justify-center">
  <div class="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 max-w-md text-white text-center shadow-xl">
    <h1 class="text-3xl font-bold mb-3">Selamat Datang</h1>
    <p class="text-white/80 mb-6">Masuk ke akun Anda</p>
    <button class="w-full bg-white text-blue-900 font-semibold py-3 rounded-xl hover:bg-blue-50 transition-colors">
      Masuk
    </button>
  </div>
</div>
```

**Penjelasan:**

**Filter (`filter`):**
- Mempengaruhi element itu sendiri.
- **`blur-{n}`** — Blur effect. `blur-sm` = 4px, `blur-md` = 12px.
- **`brightness-{n}`** — Kecerahan. 50 = gelap, 110 = cerah.
- **`grayscale`** — Hitam putih. Untuk efek "disabled" atau "memory".
- **`sepia`** — Tone vintage/coklat.
- **`saturate-{n}`** — Saturasi warna. 0 = abu-abu, 200 = super warna.

**Backdrop Filter (`backdrop-filter`):**
- Mempengaruhi apa yang ada **di belakang** element.
- **`backdrop-blur-{n}`** — Blur konten di belakang. Untuk efek **glassmorphism**.
- **Use case** — Modal dengan background blur, navbar transparan di atas hero image.
- **`bg-{color}/{opacity}`** — Background semi-transparan. Combine dengan `backdrop-blur` untuk glass effect.

::: tip 💡 Performance Tip
`backdrop-filter` (khususnya `backdrop-blur`) adalah **mahal** untuk performa. Hindari di area yang sering repaint (mis. saat scroll). Untuk glass effect di navbar yang static, aman.
:::

## 📌 Ringkasan Bab 8

| Konsep              | Kapan Dipakai                                              |
| ------------------ | ---------------------------------------------------------- |
| `shadow-{n}`       | Kedalaman visual — card (sm/md), modal (lg/xl)            |
| Colored shadow     | Branded glow, button focus state                          |
| Transition         | WAJIB untuk animasi halus                                  |
| Transform          | Hover effects (scale, translate)                          |
| Card lift pattern  | `hover:-translate-y-1 hover:shadow-lg transition-all`     |
| Filter             | Visual effect langsung di element                          |
| Backdrop filter    | Glassmorphism, blur di belakang element                  |

---

➡️ Lanjut ke [Bagian IV — Komponen UI dengan Tailwind](/bagian-4/index)
