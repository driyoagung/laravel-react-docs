---
title: Bab 5 — useState & useEffect
---

# 📖 Bab 5 — `useState` & `useEffect`

> ⭐ **Bab PALING KRITIS** — Hooks ini dipakai di hampir semua komponen React!

## 5.1 🔴 `useState` — State Lokal Komponen

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

**Penjelasan `useState`:**

- **`useState(0)`** — Return array `[value, setter]`. Initial value = 0.
- **`const [x, setX] = useState(0)`** — Destructuring. `x` = current value, `setX` = updater.
- **`setGuests(prev => prev + 1)`** — Functional update. Pakai `prev` callback saat nilai baru bergantung nilai lama.
- **`setFilters(prev => ({ ...prev, [key]: value }))`** — Untuk object state, **WAJIB spread** untuk buat object baru. Mutasi langsung tidak trigger re-render.
- **`Number(e.target.value)`** — Convert string ke number. `input.value` selalu return string.

::: danger 🚨 Aturan `useState`
- **Jangan mutate langsung** — selalu pakai setter
- **Jangan mutate object/array** — selalu buat referensi baru
- **Functional update** untuk state yang bergantung state sebelumnya
:::

## 5.2 ⚙️ `useEffect` — Side Effects di Komponen

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

**Penjelasan `useEffect`:**

- **`useEffect(() => {...}, [deps])`** — Jalankan efek setelah render.
- **Callback** — Logic side effect (fetch, subscribe, dll).
- **Dependency array** — Kapan efek dijalankan ulang.
- **`isCancelled` flag** — Cegah "setState on unmounted component" warning.
- **Cleanup function** — Return dari callback. Dipanggil saat unmount atau sebelum efek berikutnya.

## 5.3 🎯 Variasi Dependency Array `useEffect`

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

**Penjelasan variasi:**

- **Tanpa deps** — Efek jalan setiap render. Jarang dipakai (sering bug).
- **`[]`** — Efek jalan sekali saat mount. Cocok untuk inisialisasi library (Maps, Stripe, dll).
- **`[a, b]`** — Efek jalan saat `a` atau `b` berubah. Untuk sync data dengan state.

## 5.4 ⚠️ Jebakan `useEffect` yang Sering Terjadi

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

**Penjelasan jebakan:**

- **Stale closure** — Fungsi di dalam efek menangkap nilai state saat itu saja. Untuk akses nilai terbaru, tambahkan ke deps atau pakai functional update.
- **Object/array deps** — Object baru tiap render (`{}` !== `{}`). Pakai `useMemo` atau destructure ke primitive.

## 5.5 🆕 `use()` Hook — React 19+

```jsx
import { use, Suspense } from 'react'

// Baca Context tanpa Context.Consumer
function UserAvatar() {
  const user = use(UserContext) // Lebih rapi dari useContext()
  return <img src={user.avatar} alt={user.name} />
}

// Baca Promise langsung di render (dengan Suspense)
function ListingDetail({ listingPromise }) {
  const listing = use(listingPromise) // Auto suspend sampai promise resolve
  return <ListingInfo listing={listing} />
}

// Wrap dengan Suspense
<Suspense fallback={<SkeletonLoader />}>
  <ListingDetail listingPromise={fetchListing(id)} />
</Suspense>
```

**Penjelasan `use()` Hook baru:**

- **Untuk Context** — Mirip `useContext()` tapi syntax lebih bersih.
- **Untuk Promise** — Baca promise langsung. Auto suspend jika belum resolve.
- **Bisa di conditional** — Berbeda dari hooks lain, `use()` boleh di dalam `if`.

## 📌 Ringkasan Bab 5

| Konsep                | Penjelasan Singkat                                              |
| --------------------- | --------------------------------------------------------------- |
| `useState`            | State lokal komponen — `[value, setValue]`                     |
| `useEffect`           | Side effects yang dijalankan setelah render                    |
| Functional update     | `setX(prev => ...)` jika nilai baru bergantung nilai lama      |
| Dependency array      | `[]` = sekali, `[a, b]` = saat a/b berubah, tanpa = setiap render |
| Cleanup function      | Return dari `useEffect` — cleanup saat unmount/sebelum efek berikutnya |
| Stale closure         | Bug saat ada dependency hilang dari array                      |
| `use()` (React 19)    | Baca Promise & Context langsung di render                      |

---

➡️ Lanjut ke [Bab 6 — useContext & Context API](/bagian-2/bab-6)
