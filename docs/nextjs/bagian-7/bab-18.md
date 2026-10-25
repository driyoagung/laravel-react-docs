---
title: 'Bab 18 — Optimasi Gambar, Font & Script'
---

# Bab 18 — Optimasi Gambar, Font & Script

## 18.1 🖼️ Komponen `<Image>` — Optimasi Otomatis

```tsx
import Image from 'next/image'

// ✅ Gambar dengan ukuran tetap
<Image
  src="/images/hero.jpg"
  alt="Hero banner"
  width={1200}
  height={630}
  priority       // Load duluan (untuk gambar above the fold)
  quality={85}   // Kualitas 85% (default 75)
/>

// ✅ Gambar yang mengisi container (responsive)
<div className="relative h-64 w-full">
  <Image
    src={post.coverImage}
    alt={post.title}
    fill                        // Isi seluruh container
    className="object-cover"    // CSS object-fit
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    // sizes membantu browser pilih ukuran gambar yang tepat
  />
</div>

// Gambar dari URL eksternal (harus didaftarkan di next.config.js)
<Image
  src="https://images.unsplash.com/photo-xyz"
  alt="External image"
  width={800}
  height={400}
/>
```

---

## 18.2 🔤 Optimasi Font — Zero Layout Shift

```tsx
// app/layout.tsx

import { Inter, Merriweather } from 'next/font/google'
import localFont from 'next/font/local'

// Google Font — diunduh saat build, tidak ada request ke Google saat runtime
const inter = Inter({
  subsets:  ['latin'],
  variable: '--font-inter', // CSS variable untuk Tailwind
  display:  'swap',
})

// Font untuk artikel (serif)
const merriweather = Merriweather({
  weight:   ['400', '700'],
  subsets:  ['latin'],
  variable: '--font-merriweather',
})

// Font lokal — dari file di project
const customFont = localFont({
  src:      './fonts/CustomFont.woff2',
  variable: '--font-custom',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} ${merriweather.variable}`}>
      <body className="font-sans"> {/* Pakai var(--font-inter) via Tailwind */}
        {children}
      </body>
    </html>
  )
}
```
