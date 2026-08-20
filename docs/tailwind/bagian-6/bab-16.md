---
title: Bab 16 — Plugin Tailwind & Design Tokens
---

# 📖 Bab 16 — Plugin Tailwind & Design Tokens

## 16.1 🧩 Plugin Resmi yang Sangat Berguna

```bash
# @tailwindcss/typography — class 'prose' untuk artikel/konten rich text
npm install -D @tailwindcss/typography

# @tailwindcss/forms — styling yang lebih baik untuk semua elemen form
npm install -D @tailwindcss/forms

# @tailwindcss/aspect-ratio — utility aspect-ratio untuk video/gambar
npm install -D @tailwindcss/aspect-ratio
```

```html
<!-- @tailwindcss/typography: class 'prose' -->
<!-- Styling otomatis untuk konten dari CMS/markdown -->
<article class="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-600 prose-img:rounded-xl">
  <!-- Semua tag h1-h6, p, ul, ol, blockquote, code, img otomatis ter-style dengan rapi -->
  <h1>Judul Artikel</h1>
  <p>Paragraf pertama...</p>
  <ul>
    <li>Item satu</li>
    <li>Item dua</li>
  </ul>
  <blockquote>Quote dari seseorang.</blockquote>
  <pre><code>const x = 1</code></pre>
</article>

<!-- @tailwindcss/aspect-ratio: rasio aspek -->
<div class="aspect-video"> <!-- 16:9 -->
  <iframe src="youtube.com/..." class="w-full h-full rounded-xl" />
</div>
<div class="aspect-square"> <!-- 1:1 -->
  <img src="https://picsum.photos/seed/avatar/200/200" class="w-full h-full object-cover rounded-full" />
</div>
<div class="aspect-[4/3]"> <!-- 4:3 custom -->
  <img src="https://picsum.photos/seed/foto/400/300" class="w-full h-full object-cover rounded-xl" />
</div>
```

**Penjelasan:**

- **`@tailwindcss/typography`** — Plugin **WAJIB** untuk blog/CMS. Class `prose` otomatis styling semua tag HTML di konten artikel. Sangat hemat waktu.
- **`prose-lg`** — Variant ukuran. `prose-sm`, `prose-base`, `prose-lg`, `prose-xl`.
- **`prose-headings:font-bold`** — Modifier class Tailwind v3+ untuk customize prose. Pattern: `prose-{element}:{utility}`.
- **`@tailwindcss/aspect-ratio`** — Untuk video embed (16:9), avatar (1:1), banner (4:3). Menghindari CLS (Cumulative Layout Shift).
- **`@tailwindcss/forms`** — Reset style form agar lebih mudah di-customize. Tanpa plugin ini, form element punya browser-default style yang susah di-override.

## 16.2 🎨 Membangun Design Token yang Konsisten

```javascript
// tailwind.config.js — Design System yang terstruktur

const designTokens = {
  // Warna semantik — nama berdasarkan fungsi, bukan warna
  colors: {
    // Brand
    'primary':         '#2563eb', // blue-600
    'primary-hover':   '#1d4ed8', // blue-700
    'primary-light':   '#eff6ff', // blue-50
    'primary-dark':    '#1e40af', // blue-800

    // Status
    'success':         '#059669', // emerald-600
    'success-light':   '#ecfdf5', // emerald-50
    'warning':         '#d97706', // amber-600
    'warning-light':   '#fffbeb', // amber-50
    'danger':          '#dc2626', // red-600
    'danger-light':    '#fef2f2', // red-50

    // Neutral
    'surface':         '#ffffff',
    'surface-alt':     '#f9fafb', // gray-50
    'border':          '#e5e7eb', // gray-200
    'border-strong':   '#d1d5db', // gray-300

    // Text
    'text-primary':    '#111827', // gray-900
    'text-secondary':  '#4b5563', // gray-600
    'text-muted':      '#9ca3af', // gray-400
    'text-inverse':    '#ffffff',
  },

  // Spacing scale yang konsisten
  spacing: {
    'xs':  '0.5rem',   // 8px
    'sm':  '0.75rem',  // 12px
    'md':  '1rem',     // 16px
    'lg':  '1.5rem',   // 24px
    'xl':  '2rem',     // 32px
    '2xl': '3rem',     // 48px
    '3xl': '4rem',     // 64px
    '4xl': '6rem',     // 96px
  },
}
```

**Penjelasan setiap token:**

**Warna semantik (bukan warna literal):**
- **Brand** — Warna identitas. `primary` = blue-600. Pakai untuk CTA, link, brand.
- **Status** — `success`, `warning`, `danger`. Untuk alert, badge status.
- **Light variant** — `success-light` (background subtle untuk alert). Selalu ada `-light` untuk setiap status color.
- **Neutral** — `surface`, `border`. Untuk warna "abu-abu" generic.
- **Text hierarchy** — `text-primary` (heading), `text-secondary` (body), `text-muted` (placeholder/hint).

**Spacing:**
- **t-named scale** — Lebih readable daripada `0.5`, `1`, `2`. Dokumentasi intent.
- **8-step scale** — Cukup untuk kebanyakan project. Tambahkan step baru jika benar-benar butuh.

**Kenapa "semantic" bukan "warna"?**
- **Rebranding mudah** — Tinggal ubah `primary: '#ff6b6b'` di satu tempat. Tidak perlu cari-replace.
- **Dark mode mudah** — Map `surface` ke `bg-white` (light) dan `bg-gray-900` (dark). Tidak peduli warna aslinya.
- **Konsistensi otomatis** — Developer tidak boleh pakai `bg-blue-500` random. Harus pakai `bg-primary`.

## 📌 Ringkasan Bab 16

| Konsep              | Kapan Dipakai                                              |
| ------------------ | ---------------------------------------------------------- |
| `@tailwindcss/typography` | Blog, CMS, artikel markdown              |
| `@tailwindcss/forms`       | Form dengan styling konsisten                |
| `@tailwindcss/aspect-ratio`| Video embed, avatar, image card              |
| Semantic colors     | `primary`, `success`, `danger` (bukan `blue`, `red`)     |
| Design tokens       | Scale spacing/font/shadow yang konsisten                    |
| Aliases             | `primary: brand` agar 2 nama untuk hal yang sama           |

---

➡️ Lanjut ke [Bagian VII — Project Landing Page Modern](/bagian-7/index) — **Project capstone!**
