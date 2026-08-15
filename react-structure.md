# ⚡ Ebook React — From Zero to Clone Airbnb
### Panduan Lengkap Belajar React 19 | Hooks + Context + Redux + Project Nyata

---

> 🎯 **Untuk Siapa Ebook Ini?**
> Ebook ini dirancang untuk **semua level** — mulai dari yang belum pernah
> menyentuh framework JavaScript apapun, hingga yang sudah punya pengalaman
> dengan Vue atau Angular dan ingin belajar React dari sudut pandang yang benar.
> Setiap konsep dibangun di atas konsep sebelumnya — tidak ada lompatan yang tiba-tiba.

---

> 🧰 **Tech Stack yang Digunakan**
>
> | Tool | Fungsi |
> |---|---|
> | **React 19** | Library utama UI |
> | **Vite** | Build tool & dev server |
> | **React Router v6** | Navigasi antar halaman (SPA) |
> | **Redux Toolkit** | State management global |
> | **React Query (TanStack)** | Server state & data fetching |
> | **Axios** | HTTP request ke API |
> | **Tailwind CSS** | Styling |
> | **Airbnb Open API / JSON Server** | Sumber data untuk project |

---

## 🗺️ Peta Perjalanan Belajar

```
🟢 BAGIAN I    Fondasi React                → Bab 1  – 4
🔵 BAGIAN II   Hooks — Jantung React Modern → Bab 5  – 9
🟡 BAGIAN III  Pola Desain Komponen         → Bab 10 – 12
🟠 BAGIAN IV   State Management             → Bab 13 – 16
🔴 BAGIAN V    Ekosistem React              → Bab 17 – 21
🟣 BAGIAN VI   Level Up                     → Bab 22 – 23
🏠 BAGIAN VII  Project Clone Airbnb         → Bab 24
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: 7 Bagian | 24 Bab | Zero → Production Ready
```

---

## 🗺️ Jalur Belajar per Level

> 💡 **Tidak harus membaca berurutan!** Pilih jalur yang sesuai pengalaman Anda.

| Level | Jalur yang Disarankan |
|---|---|
| 🐣 **Pemula total** | Bab 1 → 2 → 3 → 4 → 5 → 6 → 7 → 10 → 13 → 17 → 19 → 24 |
| 🐥 **Sudah tahu JS dasar** | Bab 1 → 2 → 4 → 5 → 6 → 8 → 10 → 13 → 15 → 17 → 18 → 20 → 24 |
| 🐦 **Dari Vue / Angular** | Bab 1 → 3 → 5 → 7 → 9 → 11 → 13 → 15 → 17 → 20 → 22 → 24 |

---

## ⭐ Bab Paling Kritis — Jangan Sampai Dilewati!

> ⚠️ **Catatan Penting:**
> Tiga bab berikut adalah **fondasi segalanya**. Jika Anda merasa bingung
> di bab-bab selanjutnya, kemungkinan besar jawabannya ada di salah satu dari tiga bab ini.

| Prioritas | Bab | Mengapa Kritis |
|---|---|---|
| 🥇 | **Bab 5** — `useState` & `useEffect` | Dua hook ini ada di hampir setiap komponen React. Tanpa memahami keduanya secara mendalam, Anda akan terus menemukan bug yang tidak bisa dijelaskan. |
| 🥈 | **Bab 8** — `useCallback`, `useMemo` & `useRef` | Kunci performa React. Tanpa ini, aplikasi Anda akan penuh re-render yang tidak perlu dan memory leak tersembunyi. |
| 🥉 | **Bab 15** — Redux Toolkit | State management yang benar adalah fondasi aplikasi React skala besar. RTK adalah cara modern yang wajib dikuasai. |

---

---

# 🟢 BAGIAN I — Fondasi React

> 🎯 **Tujuan Bagian Ini:**
> Di akhir Bagian I, Anda sudah bisa menjalankan project React pertama,
> memahami JSX, cara kerja komponen, dan bagaimana props mengirimkan data
> antar komponen.

---

## 📖 Bab 1 — Mengenal React & Ekosistemnya

---

### 1.1 🤔 Apa itu React & Mengapa Populer?

React adalah **JavaScript library** untuk membangun antarmuka pengguna. Dibuat oleh Meta (Facebook) dan dirilis pada 2013, React kini menjadi pilihan utama di industri — dipakai oleh Facebook, Instagram, Netflix, Airbnb, Uber, dan ribuan perusahaan lainnya.

> 💡 **Analogi Sederhana:**
> Jika halaman web adalah sebuah majalah, maka React adalah sistem
> percetakan modular — Anda tidak cetak ulang seluruh majalah hanya karena
> satu artikel berubah. Cukup cetak ulang halaman yang berubah saja.
> Inilah efisiensi yang React bawa ke web.

---

### 1.2 ⚖️ Perbandingan React vs Vue vs Angular

| Aspek | React 19 | Vue 3 | Angular 17 |
|---|---|---|---|
| **Jenis** | Library (UI only) | Framework ringan | Full framework |
| **Kurva belajar** | 🟡 Sedang | 🟢 Rendah | 🔴 Tinggi |
| **Ukuran bundle** | ~40KB | ~20KB | ~130KB |
| **Bahasa** | JavaScript / TypeScript | JavaScript / TypeScript | TypeScript (wajib) |
| **State management** | Redux / Zustand / Context | Pinia | NgRx |
| **Rendering** | Virtual DOM | Virtual DOM | Change Detection |
| **Dibuat oleh** | Meta (Facebook) | Evan You (komunitas) | Google |
| **Lowongan kerja** | ✅ Terbanyak | Banyak | Banyak (enterprise) |

> 💡 **Mengapa React Dominan di Industri?**
> - Ekosistem terbesar — hampir semua library punya versi React
> - React Native untuk mobile dengan kode yang sama
> - Permintaan kerja tertinggi dibanding framework lainnya
> - Meta terus investasi besar di React (React 19, Server Components)

---

### 1.3 🆕 Apa yang Baru di React 19?

| Fitur | Sebelum React 19 | React 19 |
|---|---|---|
| **Actions** | `useState` + manual loading/error | `useActionState` — handle otomatis |
| **Optimistic Updates** | Manual dengan `useState` | `useOptimistic` built-in |
| **Form Handling** | Controlled component manual | Native form actions |
| **`use()` Hook** | Tidak ada | Baca Promise & Context langsung |
| **Server Components** | Eksperimental | Stable (via Next.js/frameworks) |
| **`ref` sebagai prop** | `forwardRef` yang verbose | Langsung pass `ref` sebagai prop biasa |
| **`useDeferredValue`** | Ada tapi terbatas | Makin powerful dengan initial value |

> ⚠️ **Catatan:**
> Ebook ini mengajarkan React 19 + pola modern. Banyak tutorial lama masih
> pakai class component atau pola lama yang sudah tidak direkomendasikan.

---

### 1.4 🧰 Ekosistem React — Gambaran Besar

```
REACT ECOSYSTEM
│
├── Core
│   └── React 19                → Library utama
│
├── Routing
│   └── React Router v6         → Navigasi SPA
│
├── State Management
│   ├── Redux Toolkit           → Global state (skala besar)
│   ├── Zustand                 → Global state (ringan)
│   └── Jotai / Recoil          → Atomic state
│
├── Server State / Data Fetching
│   ├── TanStack Query          → Cache, sync, async state
│   └── SWR                     → Data fetching ringan
│
├── Meta-Framework
│   ├── Next.js                 → SSR + SSG + App Router
│   └── Remix                   → Full-stack React
│
├── UI Libraries
│   ├── shadcn/ui               → Headless, customizable
│   ├── Material UI             → Material Design
│   └── Chakra UI               → Accessible components
│
└── Dev Tools
    ├── React DevTools          → Debug di browser
    └── Storybook               → Develop komponen isolasi
```

---

### 1.5 🌐 SPA vs SSR vs SSG — Pilih yang Mana?

| | SPA | SSR | SSG |
|---|---|---|---|
| **Cara kerja** | Render di browser | Render di server per request | Render saat build time |
| **SEO** | Sulit | ✅ Bagus | ✅ Bagus |
| **Kecepatan awal** | Lambat (JS besar) | Sedang | ✅ Sangat cepat |
| **Dinamisme** | ✅ Sangat dinamis | ✅ Dinamis | Terbatas |
| **Tools** | Vite + React Router | Next.js / Remix | Next.js / Gatsby |
| **Contoh** | Dashboard, CRM | E-commerce, News | Blog, Portofolio |

> 💡 **Untuk Ebook Ini:**
> Kita membangun **SPA** dulu — fondasi yang paling penting dikuasai
> sebelum beralih ke SSR dengan Next.js.

---

### 1.6 ⚙️ Cara Kerja React di Balik Layar

```
┌─────────────────────────────────────────────────┐
│            ALUR UPDATE REACT                    │
│                                                 │
│  State / Props berubah                          │
│         ↓                                       │
│  React jalankan ulang fungsi komponen           │
│  → Hasilkan Virtual DOM baru                    │
│         ↓                                       │
│  Reconciler bandingkan                          │
│  Virtual DOM baru vs Virtual DOM lama           │
│  (proses ini disebut "diffing")                 │
│         ↓                                       │
│  Commit: update HANYA node DOM yang berubah     │
│  (proses ini disebut "patching")                │
│         ↓                                       │
│  Tampilan di browser diperbarui ✅               │
└─────────────────────────────────────────────────┘
```

> 💡 **React 19: Automatic Batching**
> React 19 secara otomatis menggabungkan banyak `setState` dalam satu
> re-render — bahkan di dalam `setTimeout`, `Promise`, dan event handler.
> Ini membuat aplikasi lebih efisien tanpa kode tambahan.

---

## 📖 Bab 2 — Setup & Struktur Project

---

### 2.1 📦 Membuat Project dengan Vite

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

---

### 2.2 🗂️ Anatomi Folder Project React

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

> 💡 **Perbedaan `components/` vs `pages/`:**
> - `components/` → Potongan UI kecil yang **dipakai ulang** (`ListingCard`, `Navbar`)
> - `pages/` → **Halaman penuh** yang dirender oleh React Router (`HomePage`, `SearchPage`)

---

### 2.3 🔬 Anatomy File `.jsx`

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

---

### 2.4 ▶️ Perintah yang Sering Dipakai

```bash
npm run dev      # Jalankan dev server (hot reload otomatis)
npm run build    # Build untuk production (output di folder dist/)
npm run preview  # Preview hasil build di local
npm run lint     # Cek masalah ESLint
```

---

### 2.5 🛠️ Setup VS Code yang Direkomendasikan

| Ekstensi | Fungsi |
|---|---|
| **ES7+ React/Redux Snippets** | Shortcut snippet (`rfce`, `useState`, dll) |
| **ESLint** | Deteksi masalah kode real-time |
| **Prettier** | Format kode otomatis |
| **Auto Import** | Import otomatis saat ketik nama komponen |
| **Tailwind CSS IntelliSense** | Autocomplete class Tailwind |
| **React Developer Tools** | Extension browser untuk debug |

---

## 📖 Bab 3 — JSX — HTML yang Lebih Powerful

---

### 3.1 📝 Apa itu JSX?

JSX adalah **ekstensi sintaks JavaScript** yang memungkinkan Anda menulis "HTML" langsung di dalam JavaScript. JSX bukan HTML asli — ia dikompilasi oleh Babel/Vite menjadi pemanggilan `React.createElement()`.

```jsx
// JSX yang Anda tulis:
const element = <h1 className="judul">Halo, {nama}!</h1>

// Hasil kompilasi (yang dijalankan browser):
const element = React.createElement('h1', { className: 'judul' }, `Halo, ${nama}!`)
```

---

### 3.2 📋 Aturan JSX yang Wajib Diketahui

```jsx
// ① Satu root element — harus ada satu elemen pembungkus
// ❌ Salah
return (
  <h1>Judul</h1>
  <p>Paragraf</p>
)

// ✅ Benar — gunakan Fragment jika tidak ingin extra div
return (
  <>
    <h1>Judul</h1>
    <p>Paragraf</p>
  </>
)

// ② Atribut menggunakan camelCase (bukan kebab-case seperti HTML)
<div className="card">          // bukan class=""
<label htmlFor="email">         // bukan for=""
<input onChange={handler} />    // bukan onchange=""

// ③ Tag selalu ditutup — bahkan self-closing
<input type="text" />           // wajib ada slash
<img src="foto.jpg" alt="" />   // wajib ada slash

// ④ Ekspresi JavaScript dalam kurung kurawal {}
<p>Harga: {formatPrice(listing.price)}</p>
<img src={listing.imageUrl} alt={listing.title} />
<button disabled={isLoading}>Simpan</button>

// ⑤ Style sebagai object JavaScript (bukan string CSS)
<div style={{ backgroundColor: 'red', fontSize: '16px' }}>
  Teks merah
</div>
```

---

### 3.3 🔀 Conditional Rendering di JSX

```jsx
function ListingCard({ listing, isPremium }) {
  return (
    <div>
      {/* Cara 1: Ternary — untuk dua kondisi */}
      {isPremium
        ? <span className="badge-gold">⭐ Superhost</span>
        : <span className="badge-gray">Regular</span>
      }

      {/* Cara 2: Short-circuit (&&) — untuk satu kondisi */}
      {listing.isNew && <span className="badge-new">Baru</span>}

      {/* Cara 3: Nullish coalescing — fallback value */}
      <p>{listing.description ?? 'Deskripsi belum tersedia.'}</p>

      {/* Cara 4: if-else sebelum return — untuk logika kompleks */}
    </div>
  )
}
```

---

### 3.4 🔁 Rendering List di JSX

```jsx
function ListingGrid({ listings }) {
  return (
    <div className="grid">
      {/* Selalu sertakan key yang unik! */}
      {listings.map(listing => (
        <ListingCard
          key={listing.id}   // ← WAJIB, gunakan ID bukan index
          listing={listing}
        />
      ))}

      {/* Fallback jika list kosong */}
      {listings.length === 0 && (
        <p className="empty-state">
          Tidak ada listing ditemukan.
        </p>
      )}
    </div>
  )
}
```

> ⚠️ **Mengapa `key` Harus Unik & Stabil?**
> React menggunakan `key` untuk melacak elemen mana yang berubah, ditambah,
> atau dihapus. Menggunakan index array sebagai key menyebabkan bug
> tersembunyi saat list di-sort atau di-filter. Selalu gunakan ID unik dari data.

---

## 📖 Bab 4 — Props & Komponen

---

### 4.1 📨 Props — Data dari Parent ke Child

```jsx
// Child: ListingCard.jsx
function ListingCard({ title, price, location, imageUrl, rating, onWishlist }) {
  // Props di-destructure langsung dari parameter
  return (
    <div className="listing-card">
      <img src={imageUrl} alt={title} />
      <h3>{title}</h3>
      <p>{location} · ⭐ {rating}</p>
      <p><strong>Rp {price.toLocaleString('id-ID')}</strong> /malam</p>
      <button onClick={onWishlist}>♥ Simpan</button>
    </div>
  )
}

// Default props — nilai jika prop tidak dikirim
ListingCard.defaultProps = {
  rating: 'Baru',
  onWishlist: () => {},
}

// Atau dengan default parameter (cara modern)
function ListingCard({ title, price, rating = 'Baru', onWishlist = () => {} }) {
  // ...
}
```

```jsx
// Parent: SearchPage.jsx
function SearchPage() {
  const listings = useFetchListings()

  return (
    <div className="grid">
      {listings.map(listing => (
        <ListingCard
          key={listing.id}
          title={listing.title}
          price={listing.price_per_night}
          location={`${listing.city}, ${listing.country}`}
          imageUrl={listing.photos[0].url}
          rating={listing.star_rating}
          onWishlist={() => handleWishlist(listing.id)}
        />
      ))}
    </div>
  )
}
```

---

### 4.2 🧩 Komposisi Komponen — `children` Prop

```jsx
// Komponen wrapper dengan children
function Card({ children, className = '' }) {
  return (
    <div className={`card-base ${className}`}>
      {children}
    </div>
  )
}

// Penggunaan — fleksibel, bisa isi apa saja
function App() {
  return (
    <Card className="listing-card">
      <img src="foto.jpg" alt="Villa" />
      <h3>Villa Ubud</h3>
      <p>Rp 500.000 / malam</p>
    </Card>
  )
}
```

---

### 4.3 🔄 Aliran Data Satu Arah (One-Way Data Flow)

```
Parent (SearchPage)
     │
     │  data mengalir KE BAWAH via props
     ▼
Child (ListingCard)
     │
     │  event mengalir KE ATAS via callback props (onWishlist, onClick, dll)
     ▲
Parent menerima & update state
```

> ⚠️ **Aturan Utama:**
> **Jangan pernah ubah props secara langsung!** Props adalah read-only di child.
> Jika perlu mengubah data, panggil callback yang diterima dari parent.
> Ini membuat aliran data mudah di-trace saat debugging.

---

### 4.4 📏 Kapan Harus Memisah Komponen?

> 💡 **Panduan Praktis — Pisah jika:**
> - Blok UI yang sama muncul di **lebih dari satu tempat**
> - Satu komponen sudah **lebih dari 150-200 baris**
> - Bagian UI punya **state sendiri** yang tidak dibutuhkan parent
> - Memisahkan memudahkan **testing secara isolasi**

---

---

# 🔵 BAGIAN II — Hooks — Jantung React Modern

> 🎯 **Tujuan Bagian Ini:**
> Menguasai semua built-in hooks React — dari yang paling dasar hingga
> yang paling sering membuat developer bingung. Hooks adalah cara React
> modern menggantikan class component sepenuhnya.

---

## 📖 Bab 5 — `useState` & `useEffect`

---

### 5.1 🔴 `useState` — State Lokal Komponen

```jsx
import { useState } from 'react'

function SearchFilters() {
  // Deklarasi state: [nilaiSaatIni, fungsiUpdate]
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(10000000)
  const [category, setCategory] = useState('semua')
  const [guests, setGuests]     = useState(1)

  // Update state — SELALU pakai setter, jangan mutasi langsung!
  function handleGuestAdd() {
    setGuests(prev => prev + 1) // Pakai callback jika nilai baru bergantung nilai lama
  }

  // State dengan object
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 10000000,
    category: 'semua',
  })

  // Update sebagian object state — spread dulu!
  function updateFilter(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }))
    // ❌ JANGAN: filters.minPrice = value (mutasi langsung!)
  }

  return (
    <div>
      <input
        type="range"
        min={0} max={10000000}
        value={minPrice}
        onChange={e => setMinPrice(Number(e.target.value))}
      />
      <button onClick={handleGuestAdd}>+ Tamu ({guests})</button>
    </div>
  )
}
```

---

### 5.2 ⚙️ `useEffect` — Side Effects di Komponen

```jsx
import { useState, useEffect } from 'react'

function ListingDetail({ listingId }) {
  const [listing, setListing]   = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]       = useState(null)

  // useEffect(callback, dependencyArray)
  useEffect(() => {
    // ① Efek dijalankan setelah render

    let isCancelled = false // Flag untuk hindari state update setelah unmount

    async function fetchListing() {
      try {
        setIsLoading(true)
        const data = await listingService.getById(listingId)
        if (!isCancelled) setListing(data) // Hanya update jika komponen masih ada
      } catch (err) {
        if (!isCancelled) setError(err.message)
      } finally {
        if (!isCancelled) setIsLoading(false)
      }
    }

    fetchListing()

    // ② Cleanup function — dijalankan sebelum efek berikutnya / saat unmount
    return () => {
      isCancelled = true // Batalkan update jika user navigasi sebelum fetch selesai
    }
  }, [listingId]) // ③ Dependency array — efek ulang dijalankan jika listingId berubah

  if (isLoading) return <SkeletonLoader />
  if (error)     return <ErrorMessage message={error} />
  if (!listing)  return null

  return <ListingInfo listing={listing} />
}
```

---

### 5.3 🎯 Variasi Dependency Array `useEffect`

```jsx
// ① Tidak ada dependency array — jalankan setiap render
useEffect(() => {
  console.log('Setiap render') // Hampir tidak pernah diperlukan
})

// ② Array kosong [] — jalankan SEKALI saat komponen pertama mount
useEffect(() => {
  console.log('Hanya saat mount')
  initGoogleMaps() // Perfect untuk inisialisasi library eksternal
  return () => cleanupMaps() // Cleanup saat unmount
}, [])

// ③ Array dengan dependensi — jalankan ulang saat dependensi berubah
useEffect(() => {
  fetchListings(searchQuery, filters)
}, [searchQuery, filters]) // Jalankan ulang setiap kali searchQuery atau filters berubah
```

---

### 5.4 ⚠️ Jebakan `useEffect` yang Sering Terjadi

```jsx
// ❌ JEBAKAN 1: Dependency yang hilang → bug stale closure
useEffect(() => {
  setInterval(() => {
    console.log(count) // Selalu print nilai awal count (0), bukan nilai terbaru!
  }, 1000)
}, []) // count tidak ada di dependency array!

// ✅ SOLUSI: Masukkan count ke dependency atau gunakan useRef
useEffect(() => {
  const id = setInterval(() => {
    setCount(prev => prev + 1) // Gunakan functional update — tidak perlu count di deps
  }, 1000)
  return () => clearInterval(id)
}, [])

// ❌ JEBAKAN 2: Object/array sebagai dependency → infinite loop
useEffect(() => {
  fetchData(options)
}, [options]) // options = {} baru setiap render → infinite loop!

// ✅ SOLUSI: Gunakan useMemo atau primitive values
const { page, sort } = options
useEffect(() => {
  fetchData({ page, sort })
}, [page, sort]) // Nilai primitif, aman
```

---

## 📖 Bab 6 — `useContext` & Context API

---

### 6.1 🌐 Masalah Props Drilling

```
App (punya data: user)
  └── Layout (tidak butuh user, tapi harus pass)
        └── Navbar (tidak butuh user, tapi harus pass)
              └── UserAvatar (butuh user) ← Target sebenarnya

// Setiap komponen di tengah harus "meneruskan" props
// meski tidak membutuhkannya sendiri → props drilling
```

---

### 6.2 🔧 Solusi: Context API

```jsx
// src/context/AuthContext.jsx

import { createContext, useContext, useState } from 'react'

// ① Buat Context
const AuthContext = createContext(null)

// ② Buat Provider — membungkus komponen yang perlu akses
export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null)
  const [token, setToken]   = useState(() => localStorage.getItem('token'))

  const isLoggedIn = !!token

  async function login(email, password) {
    const data = await authService.login(email, password)
    setUser(data.user)
    setToken(data.token)
    localStorage.setItem('token', data.token)
  }

  function logout() {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// ③ Custom hook — cara rapi untuk konsumsi context
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth harus dipakai di dalam AuthProvider!')
  }
  return context
}
```

```jsx
// src/main.jsx — Bungkus di root
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
)

// Di komponen mana saja — langsung akses tanpa props drilling
function UserAvatar() {
  const { user, logout } = useAuth() // ✅ Langsung dapat, tanpa props drilling

  return (
    <div>
      <img src={user?.avatar} alt={user?.name} />
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

---

### 6.3 ⚠️ Kapan Context, Kapan Redux?

| Situasi | Pilihan Terbaik |
|---|---|
| Data user login (jarang berubah) | ✅ Context |
| Tema aplikasi (dark/light) | ✅ Context |
| Bahasa / i18n | ✅ Context |
| State UI lokal (modal buka/tutup) | ✅ `useState` lokal |
| State yang diubah banyak komponen | ✅ Redux Toolkit |
| Data dari server (listings, orders) | ✅ TanStack Query |
| State yang kompleks & sering update | ✅ Redux Toolkit |

---

## 📖 Bab 7 — `useReducer` — State yang Kompleks

---

### 7.1 🔧 `useReducer` vs `useState`

```jsx
// useState mulai tidak nyaman ketika banyak state yang saling berkaitan
const [isLoading, setIsLoading]   = useState(false)
const [data, setData]             = useState(null)
const [error, setError]           = useState(null)
const [page, setPage]             = useState(1)
// Update harus dilakukan satu per satu, rawan tidak sinkron

// ✅ useReducer — state yang kompleks dalam satu reducer
import { useReducer } from 'react'

const initialState = {
  listings: [],
  isLoading: false,
  error: null,
  page: 1,
  totalPages: 1,
}

function listingReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null }
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        listings: action.payload.listings,
        totalPages: action.payload.totalPages,
      }
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload }
    case 'NEXT_PAGE':
      return { ...state, page: state.page + 1 }
    default:
      return state
  }
}

function SearchPage() {
  const [state, dispatch] = useReducer(listingReducer, initialState)

  async function fetchListings() {
    dispatch({ type: 'FETCH_START' })
    try {
      const data = await listingService.search({ page: state.page })
      dispatch({ type: 'FETCH_SUCCESS', payload: data })
    } catch (err) {
      dispatch({ type: 'FETCH_ERROR', payload: err.message })
    }
  }

  return (
    <>
      {state.isLoading && <Spinner />}
      {state.error && <ErrorMessage message={state.error} />}
      <ListingGrid listings={state.listings} />
    </>
  )
}
```

---

## 📖 Bab 8 — `useCallback`, `useMemo` & `useRef`

---

### 8.1 🔁 Memahami Re-render di React

```jsx
// Setiap kali parent re-render, SEMUA child juga re-render
// Meski props child tidak berubah sama sekali!

function SearchPage() {
  const [query, setQuery] = useState('')

  // ❌ Setiap render SearchPage → handleSearch adalah fungsi BARU
  // → ListingGrid re-render meski listings tidak berubah
  function handleWishlist(id) {
    wishlistService.toggle(id)
  }

  return (
    <>
      <SearchBar value={query} onChange={setQuery} />
      <ListingGrid onWishlist={handleWishlist} /> {/* Re-render tidak perlu! */}
    </>
  )
}
```

---

### 8.2 ⚡ `useCallback` — Stabilkan Fungsi

```jsx
import { useState, useCallback } from 'react'

function SearchPage() {
  const [query, setQuery] = useState('')

  // ✅ useCallback — fungsi yang SAMA dijaga antar render
  // Hanya dibuat ulang jika dependency berubah
  const handleWishlist = useCallback((id) => {
    wishlistService.toggle(id)
  }, []) // Tidak ada dependency → fungsi selalu sama

  const handleSearch = useCallback((filters) => {
    fetchListings({ query, ...filters })
  }, [query]) // Dibuat ulang hanya jika query berubah

  return (
    <>
      <SearchBar value={query} onChange={setQuery} />
      <ListingGrid onWishlist={handleWishlist} onSearch={handleSearch} />
    </>
  )
}

// Agar ListingGrid benar-benar tidak re-render jika props tidak berubah:
const ListingGrid = memo(function ListingGrid({ onWishlist, onSearch }) {
  // React.memo membungkus komponen — skip re-render jika props sama
})
```

---

### 8.3 🧮 `useMemo` — Cache Nilai yang Mahal

```jsx
import { useState, useMemo } from 'react'

function SearchResults({ listings, filters }) {
  // ❌ Tanpa useMemo — filter dijalankan ulang setiap render
  const filteredListings = listings
    .filter(l => l.price >= filters.minPrice && l.price <= filters.maxPrice)
    .filter(l => filters.category === 'semua' || l.category === filters.category)
    .sort((a, b) => a.price - b.price)

  // ✅ Dengan useMemo — hasil di-cache, hitung ulang hanya jika listings/filters berubah
  const filteredListings = useMemo(() => {
    return listings
      .filter(l => l.price >= filters.minPrice && l.price <= filters.maxPrice)
      .filter(l => filters.category === 'semua' || l.category === filters.category)
      .sort((a, b) => a.price - b.price)
  }, [listings, filters])

  return <ListingGrid listings={filteredListings} />
}
```

---

### 8.4 📌 `useRef` — Referensi yang Tidak Trigger Re-render

```jsx
import { useRef, useEffect } from 'react'

function MapView({ listings }) {
  // ① Ref ke DOM element
  const mapContainerRef = useRef(null)
  const mapInstanceRef  = useRef(null) // Simpan instance library tanpa trigger re-render

  useEffect(() => {
    // Inisialisasi Google Maps setelah komponen mount
    mapInstanceRef.current = new google.maps.Map(mapContainerRef.current, {
      center: { lat: -8.3405, lng: 115.0920 }, // Bali
      zoom: 10,
    })

    return () => mapInstanceRef.current?.destroy?.()
  }, [])

  // ② Ref untuk nilai yang berubah tapi tidak perlu re-render
  const prevQueryRef = useRef('')

  useEffect(() => {
    if (prevQueryRef.current !== query) {
      prevQueryRef.current = query
      // Lakukan sesuatu saat query berubah
    }
  })

  return <div ref={mapContainerRef} className="map-container" />
}
```

---

## 📖 Bab 9 — Custom Hooks — Logika yang Bisa Dipakai Ulang

---

### 9.1 🧩 Apa itu Custom Hook?

> 💡 **Analogi:**
> Custom hook seperti **resep** yang bisa dipakai ulang. `useFetchListings()`
> bisa dipakai di `SearchPage`, `HomePage`, maupun `WishlistPage` —
> tanpa copy-paste kode fetch + loading + error yang sama berulang kali.

```
Tanpa Custom Hook:
  SearchPage   → useState(listings) + useEffect(fetch) + useState(loading) + useState(error)
  HomePage     → useState(listings) + useEffect(fetch) + useState(loading) + useState(error)
  WishlistPage → useState(listings) + useEffect(fetch) + useState(loading) + useState(error)
  (60+ baris kode yang sama tersebar di 3 file)

Dengan Custom Hook:
  useFetch.js   → semua logic fetch (20 baris, SEKALI SAJA)
  SearchPage    → const { data, isLoading, error } = useFetch(url)  (1 baris)
  HomePage      → const { data, isLoading, error } = useFetch(url)  (1 baris)
  WishlistPage  → const { data, isLoading, error } = useFetch(url)  (1 baris)
```

---

### 9.2 📦 Custom Hook: `useFetch()`

```javascript
// src/hooks/useFetch.js
import { useState, useEffect, useCallback } from 'react'

export function useFetch(urlAwal) {
  const [data, setData]         = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]       = useState(null)

  const fetchData = useCallback(async (url = urlAwal) => {
    if (!url) return

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setData(json)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [urlAwal])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, isLoading, error, refetch: fetchData }
}
```

---

### 9.3 ⏱️ Custom Hook: `useDebounce()`

```javascript
// src/hooks/useDebounce.js
import { useState, useEffect } from 'react'

export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer) // Batal timer jika value berubah lagi
  }, [value, delay])

  return debouncedValue
}

// Penggunaan
function SearchBar() {
  const [query, setQuery]           = useState('')
  const debouncedQuery              = useDebounce(query, 400)
  const { data: results, isLoading } = useFetch(
    debouncedQuery ? `/api/listings?q=${debouncedQuery}` : null
  )

  return (
    <input
      value={query}
      onChange={e => setQuery(e.target.value)}
      placeholder="Cari destinasi..."
    />
  )
}
```

---

### 9.4 💾 Custom Hook: `useLocalStorage()`

```javascript
// src/hooks/useLocalStorage.js
import { useState } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  function setValue(value) {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}

// Penggunaan — persis seperti useState tapi tersimpan di localStorage
const [wishlist, setWishlist] = useLocalStorage('wishlist', [])
```

---

---

# 🟡 BAGIAN III — Pola Desain Komponen

> 🎯 **Tujuan Bagian Ini:**
> Memahami pola-pola desain komponen yang membuat kode React
> scalable, mudah di-maintain, dan mudah di-test.

---

## 📖 Bab 10 — Compound Components & Render Props

---

### 10.1 🏗️ Compound Components

```jsx
// Pola Compound Component — komponen yang bekerja sama
// Seperti <select> dan <option> — tidak bisa dipisah

// Implementasi Modal yang fleksibel
const Modal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

Modal.Header = function ModalHeader({ children }) {
  return <div className="modal-header">{children}</div>
}

Modal.Body = function ModalBody({ children }) {
  return <div className="modal-body">{children}</div>
}

Modal.Footer = function ModalFooter({ children }) {
  return <div className="modal-footer">{children}</div>
}

// Penggunaan — sangat fleksibel dan intuitif
<Modal isOpen={isOpen} onClose={closeModal}>
  <Modal.Header>
    <h2>Filter Pencarian</h2>
  </Modal.Header>
  <Modal.Body>
    <FilterForm />
  </Modal.Body>
  <Modal.Footer>
    <Button onClick={resetFilters}>Reset</Button>
    <Button variant="primary" onClick={applyFilters}>Terapkan</Button>
  </Modal.Footer>
</Modal>
```

---

### 10.2 🎨 Render Props Pattern

```jsx
// Render Props — komponen yang menerima fungsi sebagai prop
// Memungkinkan logic reuse dengan tampilan yang fleksibel

function Tooltip({ content, children }) {
  const [isVisible, setIsVisible] = useState(false)

  // children sebagai fungsi — komponen induk kontrol tampilan
  return (
    <div
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      className="relative"
    >
      {children}
      {isVisible && (
        <div className="tooltip">
          {content}
        </div>
      )}
    </div>
  )
}

// Penggunaan
<Tooltip content="Klik untuk menyimpan ke wishlist">
  <button>♥ Simpan</button>
</Tooltip>
```

---

## 📖 Bab 11 — Higher-Order Components & `React.memo`

---

### 11.1 🔄 Higher-Order Component (HOC)

```jsx
// HOC — fungsi yang menerima komponen dan return komponen baru yang lebih "enhanced"

function withAuth(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const { isLoggedIn } = useAuth()

    if (!isLoggedIn) {
      return <Navigate to="/login" replace />
    }

    return <WrappedComponent {...props} />
  }
}

// Penggunaan
const ProtectedDashboard = withAuth(DashboardPage)
const ProtectedWishlist  = withAuth(WishlistPage)

// Di router
<Route path="/dashboard" element={<ProtectedDashboard />} />
```

---

### 11.2 ⚡ `React.memo` — Optimasi Re-render

```jsx
import { memo } from 'react'

// Tanpa memo: re-render setiap kali parent re-render
// Dengan memo: skip re-render jika props tidak berubah

const ListingCard = memo(function ListingCard({ listing, onWishlist }) {
  console.log('ListingCard render:', listing.id)
  return (
    <div className="listing-card">
      {/* ... */}
    </div>
  )
})

// Custom comparison (jarang dibutuhkan)
const ListingCard = memo(
  function ListingCard({ listing, onWishlist }) { /* ... */ },
  (prevProps, nextProps) => {
    // Return true jika SAMA (skip render), false jika beda (render ulang)
    return prevProps.listing.id === nextProps.listing.id
      && prevProps.listing.price === nextProps.listing.price
  }
)
```

---

## 📖 Bab 12 — Error Boundaries & Suspense

---

### 12.1 🚨 Error Boundary

```jsx
// Error Boundary masih harus class component (belum ada hook-nya)
import { Component } from 'react'

class ErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('Error caught by boundary:', error, info)
    // Kirim ke error tracking service (Sentry, dll)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="error-fallback">
          <h2>Oops! Terjadi kesalahan.</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Coba Lagi
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// Penggunaan
<ErrorBoundary fallback={<ErrorPage />}>
  <ListingGrid />
</ErrorBoundary>
```

---

### 12.2 ⏳ Suspense — Loading State yang Elegan

```jsx
import { Suspense, lazy } from 'react'

// Lazy loading komponen — hanya diunduh saat dibutuhkan
const MapView        = lazy(() => import('./MapView'))
const ListingModal   = lazy(() => import('./ListingModal'))
const ProfilePage    = lazy(() => import('../pages/ProfilePage'))

// Suspense menampilkan fallback selama komponen dimuat
function App() {
  return (
    <Suspense fallback={<div className="page-loader">Memuat...</div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Suspense>
  )
}

// Nested Suspense — granular loading state
function SearchPage() {
  return (
    <div className="search-layout">
      <SearchFilters />
      <Suspense fallback={<SkeletonGrid />}>
        <ListingGrid />
      </Suspense>
      <Suspense fallback={<MapSkeleton />}>
        <MapView />
      </Suspense>
    </div>
  )
}
```

---

---

# 🟠 BAGIAN IV — State Management

> 🎯 **Tujuan Bagian Ini:**
> Menguasai dua pilar state management React — Redux Toolkit untuk
> global state dan TanStack Query untuk server state. Keduanya bekerja
> bersama, bukan bersaing.

---

## 📖 Bab 13 — Redux Toolkit — Global State

---

### 13.1 🤔 Mengapa Redux?

```
MASALAH TANPA REDUX:

Navbar (perlu: user, cartCount, wishlistCount)
  └── via Context → AuthContext + CartContext + WishlistContext
        (Context bersarang, performance issue saat sering update)

SearchPage (perlu: filters, results, pagination)
  └── via useState lokal + props drilling ke banyak child

CheckoutPage (perlu: cart, user, address)
  └── harus fetch ulang meski data sudah ada di SearchPage

SOLUSI DENGAN REDUX TOOLKIT:

              🏪 Redux Store
     ┌────────────┼────────────┐
     │            │            │
  authSlice   searchSlice  cartSlice
     │            │            │
  (user, token) (filters,  (items,
                 results)   total)
     │            │            │
  Navbar     SearchPage  CheckoutPage
  (subscribe  (subscribe  (subscribe
  authSlice)  searchSlice) cartSlice)
```

---

### 13.2 🏗️ Setup Redux Toolkit

```bash
npm install @reduxjs/toolkit react-redux
```

```javascript
// src/store/index.js
import { configureStore } from '@reduxjs/toolkit'
import authReducer   from './slices/authSlice'
import searchReducer from './slices/searchSlice'
import cartReducer   from './slices/cartSlice'

export const store = configureStore({
  reducer: {
    auth:   authReducer,
    search: searchReducer,
    cart:   cartReducer,
  },
  // Redux DevTools otomatis aktif di development
})

// Typescript: export types
export type RootState   = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

```jsx
// src/main.jsx — Bungkus dengan Provider
import { Provider } from 'react-redux'
import { store } from './store'

root.render(
  <Provider store={store}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Provider>
)
```

---

### 13.3 📦 Membuat Slice

```javascript
// src/store/slices/searchSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { listingService } from '../../services/listingService'

// Async action — handle loading/success/error otomatis
export const fetchListings = createAsyncThunk(
  'search/fetchListings',
  async (params, { rejectWithValue }) => {
    try {
      return await listingService.search(params)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const searchSlice = createSlice({
  name: 'search',

  initialState: {
    listings:   [],
    isLoading:  false,
    error:      null,
    filters: {
      destination: '',
      checkIn:     null,
      checkOut:    null,
      guests:      1,
      minPrice:    0,
      maxPrice:    10000000,
      category:    'semua',
    },
    pagination: {
      page:       1,
      totalPages: 1,
      total:      0,
    },
  },

  reducers: {
    // Synchronous actions
    setFilter(state, action) {
      const { key, value } = action.payload
      state.filters[key] = value     // RTK pakai Immer → mutasi langsung OK!
    },
    resetFilters(state) {
      state.filters = searchSlice.getInitialState().filters
    },
    setPage(state, action) {
      state.pagination.page = action.payload
    },
  },

  extraReducers: (builder) => {
    // Handle async action states
    builder
      .addCase(fetchListings.pending, (state) => {
        state.isLoading = true
        state.error     = null
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.isLoading         = false
        state.listings          = action.payload.data
        state.pagination.total  = action.payload.total
        state.pagination.totalPages = action.payload.last_page
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.isLoading = false
        state.error     = action.payload
      })
  },
})

export const { setFilter, resetFilters, setPage } = searchSlice.actions
export default searchSlice.reducer
```

---

### 13.4 🔌 Menggunakan Redux di Komponen

```jsx
import { useSelector, useDispatch } from 'react-redux'
import { setFilter, fetchListings } from '../store/slices/searchSlice'

function SearchFilters() {
  // useSelector — subscribe ke state Redux (re-render hanya jika state ini berubah)
  const filters     = useSelector(state => state.search.filters)
  const isLoading   = useSelector(state => state.search.isLoading)
  const dispatch    = useDispatch()

  function handleFilterChange(key, value) {
    dispatch(setFilter({ key, value }))
  }

  function handleSearch() {
    dispatch(fetchListings(filters))
  }

  return (
    <div className="search-bar">
      <input
        placeholder="Mau ke mana?"
        value={filters.destination}
        onChange={e => handleFilterChange('destination', e.target.value)}
      />
      <button onClick={handleSearch} disabled={isLoading}>
        {isLoading ? 'Mencari...' : '🔍 Cari'}
      </button>
    </div>
  )
}
```

---

## 📖 Bab 14 — Cart & Wishlist Slice

---

### 14.1–14.3 🛒 Cart Slice dengan RTK

```javascript
// src/store/slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: JSON.parse(localStorage.getItem('cart') ?? '[]'),
  },

  reducers: {
    addToCart(state, action) {
      const existing = state.items.find(i => i.listingId === action.payload.listingId)
      if (!existing) {
        state.items.push(action.payload)
        localStorage.setItem('cart', JSON.stringify(state.items))
      }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter(i => i.listingId !== action.payload)
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    clearCart(state) {
      state.items = []
      localStorage.removeItem('cart')
    },
  },
})

// Selector — logic untuk derive data dari state
export const selectCartTotal = state =>
  state.cart.items.reduce((sum, item) => sum + item.totalPrice, 0)

export const selectCartCount = state => state.cart.items.length

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer
```

---

## 📖 Bab 15 — Redux Toolkit Lanjutan

---

### 15.1 🏭 RTK Query — Data Fetching Terintegrasi Redux

```javascript
// src/store/services/listingApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const listingApi = createApi({
  reducerPath: 'listingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),

  tagTypes: ['Listing', 'Wishlist'],

  endpoints: (builder) => ({
    // Query — GET data
    getListings: builder.query({
      query: (params) => ({ url: '/listings', params }),
      providesTags: ['Listing'],
    }),

    getListing: builder.query({
      query: (id) => `/listings/${id}`,
      providesTags: (result, error, id) => [{ type: 'Listing', id }],
    }),

    // Mutation — POST/PUT/DELETE
    toggleWishlist: builder.mutation({
      query: (listingId) => ({
        url: `/wishlists/${listingId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Wishlist'], // Auto refetch wishlist setelah mutasi
    }),
  }),
})

// Auto-generated hooks!
export const {
  useGetListingsQuery,
  useGetListingQuery,
  useToggleWishlistMutation,
} = listingApi
```

```jsx
// Penggunaan di komponen — sangat bersih!
function SearchPage() {
  const [filters, setFilters] = useState({})
  const {
    data: listings,
    isLoading,
    isFetching,
    error,
  } = useGetListingsQuery(filters)

  if (isLoading) return <SkeletonGrid />
  if (error)     return <ErrorMessage />

  return <ListingGrid listings={listings?.data} />
}
```

---

## 📖 Bab 16 — Zustand — Alternatif Redux yang Ringan

---

### 16.1–16.3 🐻 Setup & Penggunaan Zustand

```javascript
// src/store/useAuthStore.js — Zustand
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// create dengan persist middleware → otomatis simpan ke localStorage
const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user:  null,
      token: null,

      // Derived / Getters
      get isLoggedIn() { return !!get().token },

      // Actions
      login: async (email, password) => {
        const data = await authService.login(email, password)
        set({ user: data.user, token: data.token })
      },

      logout: () => {
        set({ user: null, token: null })
      },

      updateProfile: (data) => {
        set(state => ({ user: { ...state.user, ...data } }))
      },
    }),
    {
      name: 'auth-storage', // Key di localStorage
      partialize: (state) => ({ token: state.token }), // Hanya persist token
    }
  )
)

// Penggunaan — lebih sederhana dari Redux
function Navbar() {
  const { user, isLoggedIn, logout } = useAuthStore()

  return (
    <nav>
      {isLoggedIn ? (
        <>
          <span>{user.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Masuk</Link>
      )}
    </nav>
  )
}
```

---

---

# 🔴 BAGIAN V — Ekosistem React

> 🎯 **Tujuan Bagian Ini:**
> Menguasai React Router untuk navigasi, TanStack Query untuk
> server state, dan Form handling yang benar — tiga pilar
> aplikasi React yang siap production.

---

## 📖 Bab 17 — React Router v6 — Navigasi Halaman

---

### 17.1 🗺️ Setup & Konfigurasi Router

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Lazy loading — halaman hanya diunduh saat dikunjungi
const HomePage            = lazy(() => import('./pages/HomePage'))
const SearchPage          = lazy(() => import('./pages/SearchPage'))
const ListingDetailPage   = lazy(() => import('./pages/ListingDetailPage'))
const ProfilePage         = lazy(() => import('./pages/ProfilePage'))
const WishlistPage        = lazy(() => import('./pages/WishlistPage'))
const LoginPage           = lazy(() => import('./pages/LoginPage'))
const NotFoundPage        = lazy(() => import('./pages/NotFoundPage'))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Route publik */}
          <Route path="/"        element={<HomePage />} />
          <Route path="/search"  element={<SearchPage />} />
          <Route path="/listing/:id" element={<ListingDetailPage />} />
          <Route path="/login"   element={<LoginPage />} />

          {/* Route yang butuh autentikasi */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile"  element={<ProfilePage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/booking/:id" element={<BookingPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
```

---

### 17.2 🛡️ Protected Route

```jsx
// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute() {
  const { isLoggedIn } = useAuth()

  if (!isLoggedIn) {
    // Redirect ke login, simpan halaman asal agar bisa kembali setelah login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  // <Outlet /> merender child route yang cocok
  return <Outlet />
}
```

---

### 17.3 🧭 Navigasi di Komponen

```jsx
import { useNavigate, useParams, useSearchParams, Link, NavLink } from 'react-router-dom'

function SearchBar() {
  const navigate = useNavigate()

  function handleSearch(filters) {
    // Navigasi programmatic dengan search params
    navigate({
      pathname: '/search',
      search: `?destination=${filters.destination}&guests=${filters.guests}`,
    })
  }

  return <button onClick={() => handleSearch(filters)}>Cari</button>
}

function ListingDetailPage() {
  const { id } = useParams()     // Ambil :id dari URL /listing/:id

  // Ambil & set query string ?checkIn=...&checkOut=...
  const [searchParams, setSearchParams] = useSearchParams()
  const checkIn  = searchParams.get('checkIn')
  const checkOut = searchParams.get('checkOut')

  return (
    <>
      {/* Link biasa */}
      <Link to="/">← Kembali ke Beranda</Link>

      {/* NavLink — otomatis active class saat URL cocok */}
      <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-active' : ''}>
        Profil Saya
      </NavLink>
    </>
  )
}
```

---

## 📖 Bab 18 — React Router Lanjutan

---

### 18.1–18.3 🎭 Loader, Action & Transisi

```jsx
// React Router v6.4+ Data API — fetch data sebelum render halaman
const router = createBrowserRouter([
  {
    path: '/listing/:id',
    element: <ListingDetailPage />,
    loader: async ({ params }) => {
      // Dijalankan SEBELUM komponen dirender
      const listing = await listingService.getById(params.id)
      if (!listing) throw new Response('Not Found', { status: 404 })
      return listing
    },
    errorElement: <ErrorPage />,
  },
])

// Di komponen — data sudah tersedia saat render (tidak perlu loading state!)
function ListingDetailPage() {
  const listing = useLoaderData()
  return <ListingInfo listing={listing} />
}
```

---

## 📖 Bab 19 — TanStack Query — Server State yang Elegan

---

### 19.1 🤔 Mengapa TanStack Query?

```
MASALAH TANPA TANSTACK QUERY:
  - Setiap komponen fetch data sendiri → request duplikat
  - Loading & error state harus dikelola manual di setiap komponen
  - Data tidak tersinkron antar halaman (stale data)
  - Tidak ada caching → fetch ulang setiap kali komponen mount

SOLUSI TANSTACK QUERY:
  - Cache otomatis → request yang sama tidak diulang
  - Background refetch → data selalu fresh tanpa terasa
  - Loading/error state otomatis
  - Optimistic updates built-in
  - Devtools untuk debug query
```

---

### 19.2 🔧 Setup & Penggunaan Dasar

```jsx
// src/main.jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:   1000 * 60 * 5, // Data dianggap fresh selama 5 menit
      cacheTime:   1000 * 60 * 10, // Cache disimpan 10 menit
      retry:       2,              // Coba ulang 2x jika gagal
      refetchOnWindowFocus: false, // Jangan refetch saat tab kembali fokus
    },
  },
})

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
)
```

```jsx
// src/hooks/useListings.js — Query hooks yang rapi
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Query — fetch data
export function useListings(filters) {
  return useQuery({
    queryKey: ['listings', filters], // Cache key — unik per kombinasi filter
    queryFn:  () => listingService.search(filters),
    enabled:  !!filters.destination, // Hanya fetch jika destination ada
    select:   (data) => data.results, // Transformasi data
  })
}

export function useListing(id) {
  return useQuery({
    queryKey: ['listing', id],
    queryFn:  () => listingService.getById(id),
  })
}

// Mutation — ubah data di server
export function useToggleWishlist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (listingId) => wishlistService.toggle(listingId),

    // Optimistic update — update UI dulu sebelum server merespons
    onMutate: async (listingId) => {
      await queryClient.cancelQueries({ queryKey: ['wishlist'] })
      const prev = queryClient.getQueryData(['wishlist'])

      queryClient.setQueryData(['wishlist'], old =>
        old?.includes(listingId)
          ? old.filter(id => id !== listingId)
          : [...(old ?? []), listingId]
      )

      return { prev } // Simpan untuk rollback
    },

    // Jika server gagal → rollback ke state sebelumnya
    onError: (err, listingId, context) => {
      queryClient.setQueryData(['wishlist'], context.prev)
    },

    // Setelah sukses/gagal → sync dengan server
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    },
  })
}
```

```jsx
// Penggunaan di komponen
function SearchPage() {
  const [filters, setFilters] = useSearchFilters()
  const { data: listings, isLoading, isError } = useListings(filters)

  if (isLoading) return <SkeletonGrid count={12} />
  if (isError)   return <ErrorState onRetry={() => refetch()} />

  return <ListingGrid listings={listings} />
}
```

---

## 📖 Bab 20 — Form Handling — React Hook Form

---

### 20.1 🔧 Setup React Hook Form

```bash
npm install react-hook-form @hookform/resolvers zod
```

```jsx
// src/pages/auth/LoginPage.jsx
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// Schema validasi dengan Zod
const loginSchema = z.object({
  email:    z.string().email('Format email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
})

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(data) {
    try {
      await authService.login(data.email, data.password)
      navigate('/') // Redirect setelah login
    } catch (err) {
      // Set error dari server ke field tertentu
      setError('root', { message: 'Email atau password salah.' })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register('email')} // Register field ke React Hook Form
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" {...register('password')} />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
      </div>

      {errors.root && <p className="alert-error">{errors.root.message}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Masuk...' : 'Masuk'}
      </button>
    </form>
  )
}
```

---

## 📖 Bab 21 — Axios & API Layer

---

### 21.1–21.3 🔧 Setup Axios dengan Interceptor

```javascript
// src/services/api.js
import axios from 'axios'
import { store } from '../store'
import { logout } from '../store/slices/authSlice'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Request Interceptor — tambahkan token ke setiap request
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response Interceptor — handle error global
api.interceptors.response.use(
  (response) => response.data, // Langsung return .data
  (error) => {
    const status = error.response?.status

    if (status === 401) {
      store.dispatch(logout()) // Token expired → logout otomatis
    }

    if (status === 429) {
      console.warn('Rate limit! Coba lagi dalam beberapa saat.')
    }

    return Promise.reject(error)
  }
)

export default api
```

---

---

# 🟣 BAGIAN VI — Level Up

> 🎯 **Tujuan Bagian Ini:**
> Teknik-teknik yang membedakan developer React biasa
> dengan developer React yang benar-benar mahir dan siap production.

---

## 📖 Bab 22 — Performa & Optimasi

---

### 22.1 🔍 Mendeteksi Masalah Performa

```jsx
// React Profiler — ukur waktu render setiap komponen
import { Profiler } from 'react'

function onRenderCallback(id, phase, actualDuration) {
  // id: nama komponen
  // phase: 'mount' atau 'update'
  // actualDuration: waktu render dalam ms
  if (actualDuration > 16) { // > 16ms berarti drop di bawah 60fps
    console.warn(`Slow render: ${id} took ${actualDuration}ms`)
  }
}

<Profiler id="ListingGrid" onRender={onRenderCallback}>
  <ListingGrid listings={listings} />
</Profiler>
```

---

### 22.2 ⚡ Teknik Optimasi yang Sering Dipakai

```jsx
// ① Virtualisasi List — render hanya item yang terlihat
// Untuk list 1000+ item — wajib pakai!
import { FixedSizeGrid } from 'react-window'

function ListingGrid({ listings }) {
  return (
    <FixedSizeGrid
      columnCount={3}
      columnWidth={300}
      rowCount={Math.ceil(listings.length / 3)}
      rowHeight={350}
      width={900}
      height={700}
    >
      {({ columnIndex, rowIndex, style }) => {
        const index   = rowIndex * 3 + columnIndex
        const listing = listings[index]
        return listing
          ? <div style={style}><ListingCard listing={listing} /></div>
          : null
      }}
    </FixedSizeGrid>
  )
}

// ② Code Splitting per fitur
const MapView = lazy(() => import('./MapView'))
// MapView (dan library Google Maps yang berat) hanya diunduh jika user buka map

// ③ Image Lazy Loading
<img
  src={listing.thumbnail}
  loading="lazy"     // Native browser lazy loading
  decoding="async"
  alt={listing.title}
/>
```

---

### 22.3 🆕 React 19: `useOptimistic` & `useActionState`

```jsx
import { useOptimistic, useActionState } from 'react'

// useOptimistic — update UI sebelum server merespons
function WishlistButton({ listingId, isWishlisted }) {
  const [optimisticWishlisted, addOptimistic] = useOptimistic(
    isWishlisted,
    (currentState, optimisticValue) => optimisticValue
  )

  async function handleToggle() {
    addOptimistic(!isWishlisted) // Update UI langsung
    await wishlistService.toggle(listingId) // Request ke server (mungkin lambat)
    // Jika server gagal → React otomatis rollback ke nilai asli
  }

  return (
    <button onClick={handleToggle}>
      {optimisticWishlisted ? '❤️ Tersimpan' : '🤍 Simpan'}
    </button>
  )
}

// useActionState — handle form action (React 19)
function BookingForm({ listing }) {
  const [state, formAction, isPending] = useActionState(
    async (prevState, formData) => {
      try {
        await bookingService.create({
          listingId: listing.id,
          checkIn:   formData.get('checkIn'),
          checkOut:  formData.get('checkOut'),
          guests:    formData.get('guests'),
        })
        return { success: true }
      } catch (err) {
        return { error: err.message }
      }
    },
    null
  )

  return (
    <form action={formAction}>
      <input name="checkIn" type="date" />
      <input name="checkOut" type="date" />
      <input name="guests" type="number" />
      {state?.error && <p className="text-red-500">{state.error}</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Memproses...' : 'Pesan Sekarang'}
      </button>
    </form>
  )
}
```

---

## 📖 Bab 23 — Testing React & Best Practices

---

### 23.1 🧪 Testing dengan Vitest + React Testing Library

```jsx
// src/components/listing/__tests__/ListingCard.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ListingCard from '../ListingCard'

const mockListing = {
  id:       1,
  title:    'Villa Ubud dengan View Sawah',
  location: 'Ubud, Bali',
  price:    750000,
  rating:   4.9,
  images:   ['/images/villa-ubud.jpg'],
}

describe('ListingCard', () => {
  it('menampilkan judul dan lokasi listing', () => {
    render(<ListingCard listing={mockListing} />)

    expect(screen.getByText('Villa Ubud dengan View Sawah')).toBeInTheDocument()
    expect(screen.getByText(/Ubud, Bali/)).toBeInTheDocument()
  })

  it('menampilkan harga dengan format yang benar', () => {
    render(<ListingCard listing={mockListing} />)
    expect(screen.getByText(/750.000/)).toBeInTheDocument()
  })

  it('memanggil onWishlist saat tombol simpan diklik', async () => {
    const onWishlist = vi.fn()
    render(<ListingCard listing={mockListing} onWishlist={onWishlist} />)

    fireEvent.click(screen.getByRole('button', { name: /simpan/i }))
    expect(onWishlist).toHaveBeenCalledWith(mockListing.id)
  })
})
```

---

### 23.2 🗂️ Best Practices Struktur Folder

```
src/
├── components/
│   ├── ui/                     ← Komponen generik (tidak domain-spesifik)
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   ├── Button.test.jsx
│   │   │   └── index.js        ← Re-export untuk import yang bersih
│   │   ├── Input/
│   │   ├── Modal/
│   │   └── SkeletonLoader/
│   │
│   ├── listing/                ← Komponen domain listing
│   │   ├── ListingCard/
│   │   ├── ListingGrid/
│   │   ├── ListingMap/
│   │   └── ListingModal/
│   │
│   └── layout/                 ← Komponen tata letak
│       ├── Navbar/
│       └── Footer/
│
├── pages/
│   ├── HomePage/
│   │   ├── HomePage.jsx
│   │   ├── components/         ← Komponen khusus halaman ini (tidak reusable)
│   │   │   ├── HeroSection.jsx
│   │   │   └── CategoryFilter.jsx
│   │   └── index.js
│   ├── SearchPage/
│   └── ListingDetailPage/
│
├── hooks/                      ← Custom hooks (dimulai dengan 'use')
│   ├── useDebounce.js
│   ├── useLocalStorage.js
│   ├── useMediaQuery.js
│   └── useIntersectionObserver.js
│
├── store/                      ← Redux
│   ├── index.js
│   └── slices/
│       ├── authSlice.js
│       ├── searchSlice.js
│       └── cartSlice.js
│
├── services/                   ← API calls (satu file per domain)
│   ├── api.js                  ← Axios instance
│   ├── authService.js
│   ├── listingService.js
│   └── bookingService.js
│
├── context/                    ← React Context
│   └── AuthContext.jsx
│
└── utils/                      ← Fungsi helper murni
    ├── formatters.js           ← formatPrice, formatDate, dll
    ├── validators.js
    └── constants.js
```

> 💡 **Prinsip yang Dipegang:**
> - **Co-location** — taruh test di dekat kode yang di-test
> - **Barrel exports** — `index.js` per folder untuk import yang bersih
> - **Domain-driven** — kelompokkan berdasarkan fitur/domain, bukan tipe file
> - Nama komponen selalu **PascalCase**, nama file sesuai nama komponen

---

---

# 🏠 BAGIAN VII — Project: Clone Airbnb

> 🎯 **Tujuan Bagian Ini:**
> Terapkan **semua** yang dipelajari dari Bab 1 hingga 23
> dalam satu project nyata yang bisa masuk ke portfolio Anda.

---

## 📖 Bab 24 — Project Clone Airbnb

---

### 24.1 🎯 Fitur yang Akan Dibangun

| Fitur | Teknologi yang Dipakai |
|---|---|
| ✅ Landing page dengan search bar hero | React + Tailwind CSS |
| ✅ Autentikasi (Login / Register / Logout) | AuthContext + React Hook Form + Zod |
| ✅ Search listing dengan filter lengkap | Redux Toolkit + TanStack Query |
| ✅ Peta interaktif dengan marker listing | Leaflet.js + React Leaflet |
| ✅ Detail listing + galeri foto | React Router + useParams |
| ✅ Kalender pemilihan tanggal | react-day-picker |
| ✅ Booking form dengan perhitungan harga | React Hook Form + useOptimistic |
| ✅ Wishlist — simpan listing favorit | Redux + localStorage |
| ✅ Profil pengguna & riwayat booking | Protected Route + TanStack Query |
| ✅ Skeleton loading di semua halaman | Custom SkeletonLoader component |
| ✅ Infinite scroll di search results | TanStack Query + IntersectionObserver |
| ✅ Animasi transisi antar halaman | Framer Motion |
| ✅ Responsive design (mobile-first) | Tailwind CSS Breakpoints |
| ✅ Testing komponen utama | Vitest + React Testing Library |
| ✅ Build & deploy ke Vercel | Vite Build |

---

### 24.2 📦 Setup Project & Install Dependency

```bash
# Buat project
npm create vite@latest airbnb-clone -- --template react
cd airbnb-clone

# Core dependencies
npm install react-router-dom
npm install @reduxjs/toolkit react-redux
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install react-hook-form @hookform/resolvers zod
npm install axios

# UI & styling
npm install -D tailwindcss autoprefixer
npx tailwindcss init -p

# Feature-specific
npm install react-leaflet leaflet             # Peta
npm install react-day-picker                  # Date picker
npm install framer-motion                     # Animasi
npm install react-window                      # Virtual list

# Dev tools
npm install -D vitest @testing-library/react @testing-library/jest-dom

# File .env
echo "VITE_API_URL=http://localhost:3001" > .env
```

---

### 24.3 📁 Struktur Folder Final

```
airbnb-clone/
├── .env
├── index.html
├── vite.config.js
│
└── src/
    ├── main.jsx                    ← Provider setup (Redux, QueryClient, Auth)
    ├── App.jsx                     ← Router setup
    │
    ├── components/
    │   ├── ui/
    │   │   ├── Button/
    │   │   ├── Input/
    │   │   ├── Modal/
    │   │   ├── DateRangePicker/
    │   │   └── SkeletonLoader/
    │   ├── listing/
    │   │   ├── ListingCard/        ← Kartu listing (gambar, harga, rating)
    │   │   ├── ListingGrid/        ← Grid listing dengan infinite scroll
    │   │   ├── ListingMap/         ← Peta Leaflet dengan markers
    │   │   └── ListingGallery/     ← Galeri foto fullscreen
    │   └── layout/
    │       ├── Navbar/             ← Logo, search bar, auth menu
    │       └── Footer/
    │
    ├── pages/
    │   ├── HomePage/
    │   │   ├── HomePage.jsx
    │   │   └── components/
    │   │       ├── HeroSearch.jsx  ← Search bar besar dengan date picker
    │   │       └── CategoryBar.jsx ← Filter kategori (Pantai, Villa, Unik, dll)
    │   ├── SearchPage/
    │   │   ├── SearchPage.jsx
    │   │   └── components/
    │   │       ├── FilterBar.jsx   ← Filter harga, tipe kamar, fasilitas
    │   │       └── SplitView.jsx   ← List kiri + Peta kanan
    │   ├── ListingDetailPage/
    │   │   ├── ListingDetailPage.jsx
    │   │   └── components/
    │   │       ├── BookingWidget.jsx ← Widget booking di kanan (sticky)
    │   │       └── ReviewSection.jsx
    │   ├── ProfilePage/
    │   ├── WishlistPage/
    │   ├── LoginPage/
    │   └── RegisterPage/
    │
    ├── hooks/
    │   ├── useListings.js          ← TanStack Query hooks untuk listings
    │   ├── useDebounce.js
    │   ├── useIntersectionObserver.js ← Untuk infinite scroll
    │   └── useMediaQuery.js
    │
    ├── store/
    │   ├── index.js
    │   └── slices/
    │       ├── authSlice.js
    │       ├── searchSlice.js      ← Filters, results, pagination
    │       └── wishlistSlice.js
    │
    ├── services/
    │   ├── api.js                  ← Axios instance + interceptors
    │   ├── authService.js
    │   ├── listingService.js
    │   └── bookingService.js
    │
    ├── context/
    │   └── AuthContext.jsx
    │
    └── utils/
        ├── formatters.js
        └── constants.js
```

---

### 24.4 🔍 Studi Kasus: Infinite Scroll di Search Results

```jsx
// src/hooks/useInfiniteListings.js
import { useInfiniteQuery } from '@tanstack/react-query'
import { listingService } from '../services/listingService'

export function useInfiniteListings(filters) {
  return useInfiniteQuery({
    queryKey:     ['listings', 'infinite', filters],
    queryFn:      ({ pageParam = 1 }) => listingService.search({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.current_page < lastPage.last_page
        ? lastPage.current_page + 1
        : undefined // undefined berarti tidak ada halaman berikutnya
    },
  })
}

// src/components/listing/ListingGrid/ListingGrid.jsx
import { useRef, useEffect } from 'react'
import { useInfiniteListings } from '../../../hooks/useInfiniteListings'

function ListingGrid({ filters }) {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteListings(filters)

  // Intersection Observer — trigger fetchNextPage saat sentinel masuk viewport
  const sentinelRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    if (sentinelRef.current) observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  // Flatten semua halaman jadi satu array
  const listings = data?.pages.flatMap(page => page.data) ?? []

  if (isLoading) return <SkeletonGrid count={12} />

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listings.map(listing => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      {/* Sentinel — element tak terlihat di ujung list */}
      <div ref={sentinelRef} className="h-4" />

      {isFetchingNextPage && <SkeletonGrid count={4} />}

      {!hasNextPage && listings.length > 0 && (
        <p className="text-center text-gray-500 py-8">
          Semua listing sudah ditampilkan.
        </p>
      )}
    </>
  )
}
```

---

### 24.5 🗓️ Studi Kasus: Booking Widget dengan Kalender

```jsx
// src/pages/ListingDetailPage/components/BookingWidget.jsx
import { useState, useMemo } from 'react'
import { DayPicker } from 'react-day-picker'
import { differenceInCalendarDays } from 'date-fns'
import { useToggleWishlist } from '../../../hooks/useListings'

function BookingWidget({ listing }) {
  const [checkIn, setCheckIn]   = useState(null)
  const [checkOut, setCheckOut] = useState(null)
  const [guests, setGuests]     = useState(1)

  const { mutate: toggleWishlist } = useToggleWishlist()

  // Hitung total harga
  const totalNights = useMemo(() => {
    if (!checkIn || !checkOut) return 0
    return differenceInCalendarDays(checkOut, checkIn)
  }, [checkIn, checkOut])

  const totalPrice = useMemo(() => {
    return totalNights * listing.price_per_night
  }, [totalNights, listing.price_per_night])

  const serviceFee = useMemo(() => Math.round(totalPrice * 0.1), [totalPrice])

  return (
    <div className="booking-widget sticky top-24">
      <div className="card">
        {/* Harga per malam */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-2xl font-bold">
              Rp {listing.price_per_night.toLocaleString('id-ID')}
            </span>
            <span className="text-gray-500"> / malam</span>
          </div>
          <div className="flex items-center gap-1">
            <span>⭐ {listing.star_rating}</span>
            <span className="text-gray-500">({listing.review_count} ulasan)</span>
          </div>
        </div>

        {/* Kalender */}
        <DayPicker
          mode="range"
          selected={{ from: checkIn, to: checkOut }}
          onSelect={(range) => {
            setCheckIn(range?.from ?? null)
            setCheckOut(range?.to ?? null)
          }}
          disabled={{ before: new Date() }} // Nonaktifkan tanggal lampau
          numberOfMonths={2}
        />

        {/* Tamu */}
        <div className="guest-selector">
          <button onClick={() => setGuests(g => Math.max(1, g - 1))}>−</button>
          <span>{guests} tamu</span>
          <button onClick={() => setGuests(g => Math.min(listing.max_guests, g + 1))}>+</button>
        </div>

        {/* Rincian harga */}
        {totalNights > 0 && (
          <div className="price-breakdown">
            <div className="flex justify-between">
              <span>Rp {listing.price_per_night.toLocaleString()} × {totalNights} malam</span>
              <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span>Biaya layanan</span>
              <span>Rp {serviceFee.toLocaleString('id-ID')}</span>
            </div>
            <hr />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>Rp {(totalPrice + serviceFee).toLocaleString('id-ID')}</span>
            </div>
          </div>
        )}

        <button
          className="btn-primary w-full"
          disabled={!checkIn || !checkOut}
          onClick={() => navigate(`/booking/${listing.id}`, { state: { checkIn, checkOut, guests } })}
        >
          {checkIn && checkOut ? 'Pesan Sekarang' : 'Pilih Tanggal Terlebih Dahulu'}
        </button>

        <button
          className="btn-outline w-full mt-2"
          onClick={() => toggleWishlist(listing.id)}
        >
          🤍 Simpan ke Wishlist
        </button>
      </div>
    </div>
  )
}
```

---

### 24.6 🧪 Testing Komponen Utama

```jsx
// src/components/listing/ListingCard/__tests__/ListingCard.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import ListingCard from '../ListingCard'

// Wrapper untuk provider yang dibutuhkan
function wrapper({ children }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  )
}

const mockListing = {
  id: 1, title: 'Villa Ubud', location: 'Bali',
  price_per_night: 750000, star_rating: 4.9,
  images: [{ url: '/villa.jpg' }],
}

describe('ListingCard', () => {
  it('menampilkan info listing dengan benar', () => {
    render(<ListingCard listing={mockListing} />, { wrapper })
    expect(screen.getByText('Villa Ubud')).toBeInTheDocument()
    expect(screen.getByText(/Bali/)).toBeInTheDocument()
    expect(screen.getByText(/750.000/)).toBeInTheDocument()
  })

  it('toggle wishlist state saat tombol diklik', async () => {
    render(<ListingCard listing={mockListing} />, { wrapper })
    const wishlistBtn = screen.getByRole('button', { name: /simpan/i })
    fireEvent.click(wishlistBtn)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /tersimpan/i })).toBeInTheDocument()
    })
  })

  it('navigasi ke detail saat card diklik', async () => {
    const { container } = render(<ListingCard listing={mockListing} />, { wrapper })
    fireEvent.click(container.firstChild)
    // Assert URL berubah ke /listing/1
  })
})
```

---

### 24.7 🚀 Deploy ke Vercel

```bash
# Build production
npm run build
# Output di folder dist/

# Deploy via Vercel CLI
npm install -g vercel
vercel login
vercel --prod

# Atau connect repo GitHub ke vercel.com → auto-deploy setiap push
```

```javascript
// vite.config.js — konfigurasi untuk SPA routing di Vercel
export default {
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
}
```

```json
// vercel.json — redirect semua ke index.html untuk SPA routing
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

> ⚠️ **Penting saat Deploy:**
> Tambahkan semua environment variable (`VITE_API_URL`, dll) di dashboard Vercel.
> Variable dengan prefix `VITE_` otomatis di-expose ke client-side.

---

## 📊 Ringkasan Struktur Final Ebook

```
📚 EBOOK REACT — FROM ZERO TO CLONE AIRBNB
│
├── 🟢 BAGIAN I   — Fondasi React               Bab 1  – 4
│   ├── Bab 1  ─ Mengenal React & Ekosistemnya
│   ├── Bab 2  ─ Setup & Struktur Project
│   ├── Bab 3  ─ JSX — HTML yang Lebih Powerful
│   └── Bab 4  ─ Props & Komponen
│
├── 🔵 BAGIAN II  — Hooks: Jantung React Modern  Bab 5  – 9
│   ├── Bab 5  ─ useState & useEffect
│   ├── Bab 6  ─ useContext & Context API
│   ├── Bab 7  ─ useReducer
│   ├── Bab 8  ─ useCallback, useMemo & useRef
│   └── Bab 9  ─ Custom Hooks
│
├── 🟡 BAGIAN III — Pola Desain Komponen         Bab 10 – 12
│   ├── Bab 10 ─ Compound Components & Render Props
│   ├── Bab 11 ─ Higher-Order Components & React.memo
│   └── Bab 12 ─ Error Boundaries & Suspense
│
├── 🟠 BAGIAN IV  — State Management             Bab 13 – 16
│   ├── Bab 13 ─ Redux Toolkit — Global State
│   ├── Bab 14 ─ Cart & Wishlist Slice
│   ├── Bab 15 ─ RTK Query
│   └── Bab 16 ─ Zustand — Alternatif Redux
│
├── 🔴 BAGIAN V   — Ekosistem React              Bab 17 – 21
│   ├── Bab 17 ─ React Router v6 — Navigasi Halaman
│   ├── Bab 18 ─ React Router Lanjutan (Loader, Action)
│   ├── Bab 19 ─ TanStack Query — Server State
│   ├── Bab 20 ─ Form Handling — React Hook Form + Zod
│   └── Bab 21 ─ Axios & API Layer
│
├── 🟣 BAGIAN VI  — Level Up                     Bab 22 – 23
│   ├── Bab 22 ─ Performa & Optimasi (memo, lazy, virtual list, React 19)
│   └── Bab 23 ─ Testing React & Best Practices
│
└── 🏠 BAGIAN VII — Project Clone Airbnb          Bab 24
    └── Bab 24 ─ Project Clone Airbnb Lengkap

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total  :  7 Bagian  |  24 Bab
Target :  Semua level (pemula hingga menengah)
Stack  :  React 19 + Vite + React Router v6 + Redux Toolkit
          + TanStack Query + React Hook Form + Tailwind CSS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

*Ebook React — From Zero to Clone Airbnb*
*React 19 + Vite + React Router v6 + Redux Toolkit + TanStack Query + Tailwind CSS*