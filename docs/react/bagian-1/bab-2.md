---
title: Bab 2 — Setup & Struktur Project
---

# 📖 Bab 2 — Setup & Struktur Project

## 2.1 📦 Membuat Project dengan Vite

```bash
# Buat project React baru dengan Vite (paling cepat)
npm create vite@latest airbnb-clone -- --template react

# Masuk ke folder & install dependency
cd airbnb-clone
npm install

# Install dependency utama untuk project ini
npm install react-router-dom axios @reduxjs/toolkit react-redux
npm install @tanstack/react-query
npm install -D tailwindcss autoprefixer
npx tailwindcss init -p

# Jalankan dev server
npm run dev
# Buka browser → http://localhost:5173
```

**Penjelasan:**

- **`npm create vite@latest <name> -- --template react`** — Scaffold project React. File `package.json`, `vite.config.js`, `index.html` dibuat otomatis.
- **`cd <name> && npm install`** — Masuk folder & install dependency dari `package.json`.
- **`npm install <packages>`** — Tambah library. `react-router-dom` untuk routing, `axios` untuk HTTP, `@reduxjs/toolkit` untuk state, `@tanstack/react-query` untuk server state.
- **`-D`** — Dev dependency. Hanya untuk build/testing, tidak untuk production.
- **`npx tailwindcss init -p`** — Generate `tailwind.config.js` & `postcss.config.js`.

> 💡 **Mengapa Vite, bukan Create React App?**
> Create React App (CRA) sudah **deprecated** oleh tim React. Vite adalah
> rekomendasi resmi saat ini — start server 10-100x lebih cepat, HMR instan,
> dan build output lebih optimal.

## 2.2 🗂️ Anatomi Folder Project React

```
airbnb-clone/
│
├── 📁 src/                        ← Semua kode aplikasi ada di sini
│   ├── 📄 main.jsx                ← Entry point — render <App /> ke DOM
│   ├── 📄 App.jsx                 ← Root component (setup Router & Provider)
│   │
│   ├── 📁 components/             ← Komponen UI reusable
│   │   ├── 📁 ui/                 ← Komponen generik (Button, Input, Modal)
│   │   └── 📁 listing/            ← Komponen domain listing (ListingCard, dll)
│   │
│   ├── 📁 pages/                  ← Satu file = satu halaman (di-render oleh Router)
│   │   ├── 📄 HomePage.jsx
│   │   ├── 📄 SearchPage.jsx
│   │   └── 📄 ListingDetailPage.jsx
│   │
│   ├── 📁 hooks/                  ← Custom hooks reusable
│   │   ├── 📄 useDebounce.js
│   │   ├── 📄 useLocalStorage.js
│   │   └── 📄 useMediaQuery.js
│   │
│   ├── 📁 store/                  ← Redux Toolkit store
│   │   ├── 📄 index.js
│   │   └── 📁 slices/
│   │       ├── 📄 authSlice.js
│   │       └── 📄 searchSlice.js
│   │
│   ├── 📁 services/               ← Semua API call terpusat
│   │   ├── 📄 api.js              ← Axios instance
│   │   ├── 📄 listingService.js
│   │   └── 📄 authService.js
│   │
│   ├── 📁 context/                ← React Context untuk state ringan
│   │   └── 📄 AuthContext.jsx
│   │
│   └── 📁 assets/                 ← Gambar, ikon, font
│
├── 📄 index.html
├── 📄 vite.config.js
└── 📄 package.json
```

**Penjelasan folder:**

- **`src/`** — Semua kode JavaScript/JSX ada di sini.
- **`main.jsx`** — Entry point. Setup ReactDOM, Provider (Redux, Query), render `<App />` ke `#root` di `index.html`.
- **`App.jsx`** — Root component. Setup Router, layout, global error boundary.
- **`components/`** — Reusable UI. Subfolder `ui/` = generic, `listing/` = domain-specific.
- **`pages/`** — Full-page component. 1 file = 1 route.
- **`hooks/`** — Custom hooks (dimulai dengan `use`).
- **`store/`** — Redux Toolkit setup.
- **`services/`** — API calls. Satu file per domain.
- **`context/`** — React Context (untuk state ringan lintas komponen).
- **`assets/`** — Gambar, ikon, font lokal.

> 💡 **Perbedaan `components/` vs `pages/`:**
> - `components/` → Potongan UI kecil yang **dipakai ulang** (`ListingCard`, `Navbar`)
> - `pages/` → **Halaman penuh** yang dirender oleh React Router (`HomePage`, `SearchPage`)

## 2.3 🔬 Anatomy File `.jsx`

```jsx
// src/components/listing/ListingCard.jsx

// ① Import — library, komponen lain, assets
import { useState } from 'react'
import { HeartIcon } from '@heroicons/react/24/outline'
import { formatPrice } from '../../utils/formatters'

// ② Komponen — fungsi JavaScript biasa yang return JSX
function ListingCard({ listing, onWishlist }) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  function handleWishlist() {
    setIsWishlisted(prev => !prev)
    onWishlist?.(listing.id)
  }

  // ③ Return JSX — sintaks yang terlihat seperti HTML tapi bukan HTML
  return (
    <div className="listing-card">
      <div className="listing-image-wrapper">
        <img src={listing.images[0]} alt={listing.title} />
        <button onClick={handleWishlist} className="wishlist-btn">
          <HeartIcon className={isWishlisted ? 'text-red-500' : 'text-white'} />
        </button>
      </div>
      <div className="listing-info">
        <h3>{listing.title}</h3>
        <p>{listing.location}</p>
        <p>
          <strong>{formatPrice(listing.price)}</strong> / malam
        </p>
      </div>
    </div>
  )
}

// ④ Export — wajib agar bisa dipakai di file lain
export default ListingCard
```

**Penjelasan bagian komponen:**

- **① Import** — Library (`react`), komponen (`HeartIcon`), asset (`formatPrice`). Tree shaking otomatis.
- **② Function component** — Function yang return JSX. `listing` & `onWishlist` = props.
- **`useState(false)`** — Local state dengan nilai awal `false`.
- **`handleWishlist()`** — Function biasa. Pakai nama `handleXxx` convention.
- **`setIsWishlisted(prev => !prev)`** — Functional update. Pakai `prev` untuk nilai berdasarkan value sebelumnya.
- **`onWishlist?.(listing.id)`** — Optional chaining + call. `?.` artinya "panggil hanya jika function exists".
- **③ Return JSX** — Sintaks mirip HTML. `className` bukan `class`, `onClick` bukan `onclick`.
- **④ Export default** — Wajib agar bisa di-import di file lain.

## 2.4 ▶️ Perintah yang Sering Dipakai

```bash
npm run dev      # Jalankan dev server (hot reload otomatis)
npm run build    # Build untuk production (output di folder dist/)
npm run preview  # Preview hasil build di local
npm run lint     # Cek masalah ESLint
```

**Penjelasan:**

- **`npm run dev`** — Vite dev server. Hot reload saat save file.
- **`npm run build`** — Bundle semua asset ke `dist/`. Optimized untuk production.
- **`npm run preview`** — Serve file `dist/` secara lokal. Test hasil build.
- **`npm run lint`** — ESLint check. Deteksi masalah syntax & style.

## 2.5 🛠️ Setup VS Code yang Direkomendasikan

| Ekstensi                       | Fungsi                                       |
| ------------------------------ | -------------------------------------------- |
| **ES7+ React/Redux Snippets**  | Shortcut snippet (`rfce`, `useState`, dll)   |
| **ESLint**                     | Deteksi masalah kode real-time              |
| **Prettier**                   | Format kode otomatis                       |
| **Auto Import**                | Import otomatis saat ketik nama komponen    |
| **Tailwind CSS IntelliSense**  | Autocomplete class Tailwind                 |
| **React Developer Tools**      | Extension browser untuk debug              |

**Penjelasan ekstensi:**

- **ES7+ React/Redux Snippets** — `rfce` (React Functional Component Export) generates boilerplate.
- **ESLint** — Tanda merah/warning saat syntax error. Real-time.
- **Prettier** — Format kode konsisten (indent, quotes, line length).
- **Auto Import** — Auto-suggest import saat ketik komponen.
- **Tailwind CSS IntelliSense** — Autocomplete class Tailwind di `className`.
- **React Developer Tools** — Browser extension. Inspect component tree, props, state.

## 📌 Ringkasan Bab 2

| Konsep             | Penjelasan Singkat                                              |
| ------------------ | --------------------------------------------------------------- |
| Vite                | Build tool modern — cepat & ringan                            |
| `src/main.jsx`      | Entry point — setup Provider & render ke DOM                  |
| `src/App.jsx`       | Root component — setup Router                                 |
| `components/` vs `pages/` | Komponen reusable vs halaman penuh                       |
| Service layer       | Semua API call terpusat di `services/`                          |
| Hooks folder        | Custom hooks untuk logic yang berulang                         |
| Store folder        | Redux Toolkit slices                                           |

---

➡️ Lanjut ke [Bab 3 — JSX: HTML yang Lebih Powerful](/bagian-1/bab-3)
