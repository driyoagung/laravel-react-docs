---
title: Bab 14 — Konfigurasi tailwind.config.js
---

# 📖 Bab 14 — Konfigurasi `tailwind.config.js`

> 🥉 **Bab KRITIS** — Kunci membangun design system yang konsisten.

## 14.1 ⚙️ Struktur Konfigurasi Lengkap

```javascript
// tailwind.config.js
import defaultTheme from 'tailwindcss/defaultTheme'
import colors from 'tailwindcss/colors'

export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',

  theme: {
    // ① 'theme' saja → REPLACE default (hapus semua default)
    // ② 'theme.extend' → TAMBAH di atas default (lebih aman & sering dipakai)
    extend: {
      // Warna brand
      colors: {
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        // Tambah warna semantik
        success: colors.emerald,
        warning: colors.amber,
        danger:  colors.red,
      },

      // Font family
      fontFamily: {
        sans:  ['Inter', ...defaultTheme.fontFamily.sans],
        mono:  ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
        display: ['Cal Sans', 'Inter', 'sans-serif'],
      },

      // Ukuran font tambahan
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
        '10xl': ['10rem', { lineHeight: '1' }],
      },

      // Spacing tambahan
      spacing: {
        '4.5': '1.125rem',  // antara 4 dan 5
        '13':  '3.25rem',
        '18':  '4.5rem',
        '88':  '22rem',
        '128': '32rem',
      },

      // Border radius tambahan
      borderRadius: {
        '4xl': '2rem',
      },

      // Box shadow custom
      boxShadow: {
        'card':  '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08)',
        'glow-blue':  '0 0 20px rgb(59 130 246 / 0.4)',
      },

      // Animasi custom
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(24px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        'fade-in':        'fade-in 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'pulse-soft':     'pulse-soft 2s ease-in-out infinite',
      },

      // Screen / breakpoint tambahan
      screens: {
        'xs': '475px',   // Antara default dan sm
        '3xl': '1920px', // Layar sangat besar
      },

      // Max width tambahan
      maxWidth: {
        '8xl': '88rem',  // 1408px
        '9xl': '96rem',  // 1536px
      },

      // Z-index tambahan
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },

  plugins: [
    require('@tailwindcss/forms'),       // Style input/select/checkbox yang lebih baik
    require('@tailwindcss/typography'),  // Class 'prose' untuk konten artikel
    require('@tailwindcss/line-clamp'),  // line-clamp (sudah built-in di v3.3+)
    require('@tailwindcss/aspect-ratio'),// aspect-ratio utilities
  ],
}
```

**Penjelasan setiap bagian:**

- **`content`** — WAJIB. Daftar path untuk di-scan Tailwind. Class yang tidak muncul di file ini akan di-purge.
- **`darkMode: 'class'`** — Pakai class `dark` untuk toggle. Lebih fleksibel dari `'media'`.
- **`theme`** vs **`theme.extend`** — Pakai `extend` (BUKAN `theme`) untuk menjaga default Tailwind + tambahkan milik Anda.
- **`colors.brand`** — Tambah palette warna brand Anda. Pakai shade 50-900 untuk konsistensi.
- **`colors.success`** — Pakai `colors.emerald` (dari Tailwind default colors). Alias `success` = `emerald`.
- **`fontFamily`** — Pakai `defaultTheme.fontFamily.sans` sebagai fallback agar font system tetap ada.
- **`fontSize`** — Array `[size, { lineHeight }]`. Jika tanpa lineHeight, defaultnya 1.5.
- **`spacing`** — Extend scale default. Pakai untuk ukuran custom (mis. 18 = 4.5rem = 72px).
- **`boxShadow.card`** — Custom shadow. Pakai untuk konsistensi (semua card pakai `shadow-card`).
- **`keyframes` + `animation`** — Define keyframes dulu, lalu register di `animation`. Format: `'name duration timing-function iteration'`.
- **`screens.xs`** — Custom breakpoint. 475px (antara mobile dan sm).
- **`plugins`** — Plugin resmi. `forms` membuat form element lebih cantik, `typography` untuk prose.

## 14.2 📐 Pentingnya `theme.extend` (BUKAN `theme`)

```javascript
// ❌ SALAH — Pakai 'theme' (replace semua default)
export default {
  theme: {
    colors: {
      primary: '#3b82f6',
    },
    // Hapus SEMUA default Tailwind (bg-red-500, text-gray-700, dll jadi TIDAK ADA)
  },
}

// ✅ BENAR — Pakai 'theme.extend' (tambah di atas default)
export default {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
      },
      // bg-red-500, text-gray-700, dll MASIH ADA + primary juga
    },
  },
}
```

**Penjelasan:**

- **`theme`** = REPLACE default. Hapus semua utility Tailwind bawaan. Sangat jarang dipakai.
- **`theme.extend`** = TAMBAH di atas default. **Best practice**. Tetap bisa pakai `bg-red-500` dll, plus tambahan Anda.

## 14.3 🎨 Kustomisasi Brand Colors

```javascript
// tailwind.config.js
const brand = {
  50:  '#f0f9ff',
  100: '#e0f2fe',
  200: '#bae6fd',
  300: '#7dd3fc',
  400: '#38bdf8',
  500: '#0ea5e9',  ← brand.DEFAULT
  600: '#0284c7',
  700: '#0369a1',
  800: '#075985',
  900: '#0c4a6e',
  950: '#082f49',
}

export default {
  theme: {
    extend: {
      colors: {
        // Pakai sebagai 'brand' atau 'primary'
        brand,
        primary: brand,  // alias

        // Semantic colors
        surface: {
          DEFAULT: '#ffffff',
          muted:   '#f9fafb',
        },

        border: {
          DEFAULT: '#e5e7eb',
          strong: '#d1d5db',
        },
      },
    },
  },
}

// Penggunaan
// <div class="bg-brand-500 text-white">Tombol brand</div>
// <div class="bg-primary-700 text-white">Tombol primary</div>
// <div class="bg-surface-muted">Background subtle</div>
```

**Penjelasan:**

- **Pakai nama brand atau primary** — `bg-brand-500` atau `bg-primary-700`. Pilih salah satu.
- **Semantic naming** — `surface` (latar), `border` (garis). Bukan `gray-50` (warna). Lebih flexible untuk rebrand nanti.
- **DEFAULT** — `bg-surface` tanpa suffix = `surface.DEFAULT`. Untuk warna utama.

## 📌 Ringkasan Bab 14

| Konsep                | Penjelasan Singkat                                              |
| --------------------- | --------------------------------------------------------------- |
| `content`             | WAJIB — path yang di-scan Tailwind                             |
| `theme.extend`        | Tambah design tokens, JANGAN replace `theme`                    |
| `colors`              | Tambah brand colors + semantic colors                          |
| `fontFamily`          | Custom font + fallback ke default                              |
| `boxShadow`           | Custom shadow untuk konsistensi (card, modal, dll)             |
| `keyframes` + `animation` | Custom animasi                                           |
| `screens`             | Custom breakpoint (xs, 3xl, dll)                              |
| `plugins`             | Plugin resmi atau custom                                       |

---

➡️ Lanjut ke [Bab 15 — Arbitrary Values & Direktif CSS](/bagian-6/bab-15)
