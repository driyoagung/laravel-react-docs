---
title: Bab 8 — useCallback, useMemo & useRef
---

# 📖 Bab 8 — `useCallback`, `useMemo` & `useRef`

> ⭐ **Bab KRITIS** — Kunci performa React!

## 8.1 🔁 Memahami Re-render di React

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

**Penjelasan re-render:**

- React default: **parent re-render → semua child re-render**.
- Walau child props tidak berubah.
- Bisa mahal untuk child kompleks (banyak DOM, banyak logic).

## 8.2 ⚡ `useCallback` — Stabilkan Fungsi

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

**Penjelasan `useCallback`:**

- **`useCallback(fn, deps)`** — Return function yang **stabil** (same reference) antar render.
- **Deps** — Function di-recreate hanya jika deps berubah.
- **`React.memo`** — Wrap component. Skip re-render jika props shallow-equal.
- **Kombinasi optimal** — `useCallback` di parent + `React.memo` di child.

## 8.3 🧮 `useMemo` — Cache Nilai yang Mahal

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

**Penjelasan `useMemo`:**

- **`useMemo(factory, deps)`** — Cache hasil factory. Hitung ulang hanya jika deps berubah.
- **Performa** — Cocok untuk komputasi mahal (filter, sort, transform 1000+ data).
- **JANGAN over-use** — Setiap `useMemo` punya overhead sendiri. Hanya pakai untuk yang truly expensive.

## 8.4 📌 `useRef` — Referensi yang Tidak Trigger Re-render

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

**Penjelasan `useRef`:**

- **`useRef(initialValue)`** — Return `{ current: initialValue }`. Object yang persisten antar render.
- **2 use case**:
  1. **Akses DOM** — `ref={mapContainerRef}` lalu `mapContainerRef.current` di `useEffect`.
  2. **Simpan nilai mutable** — Instance library, timer ID, previous value. **TIDAK** trigger re-render saat `.current` diubah.

## 8.5 🆕 `ref` sebagai Prop Langsung (React 19)

```jsx
// React 19: tidak perlu forwardRef lagi!
function CustomInput({ ref, ...props }) {
  return <input ref={ref} {...props} />
}

// Penggunaan
function Form() {
  const inputRef = useRef(null)
  return (
    <>
      <CustomInput ref={inputRef} />
      <button onClick={() => inputRef.current?.focus()}>Focus</button>
    </>
  )
}
```

**Penjelasan:**

- React 19 hapus `forwardRef`. Tinggal terima `ref` sebagai prop biasa.
- Lebih clean — tidak perlu extra wrapper.

## 8.6 📊 Kapan Pakai Apa?

| Hook            | Pakai untuk                                                       |
| --------------- | ----------------------------------------------------------------- |
| `useCallback`   | Stabilkan referensi fungsi (untuk child yang di-memo)             |
| `useMemo`       | Cache hasil komputasi yang mahal                                  |
| `useRef`        | Akses DOM langsung atau simpan nilai mutable tanpa re-render      |
| `React.memo`    | Bungkus komponen agar skip re-render jika props sama              |

> ⚠️ **Jangan Over-Optimize!**
> Pakai hooks ini hanya saat ada **masalah performa terukur**. Jangan pakai
> di semua tempat "untuk jaga-jaga" — malah menambah kompleksitas tanpa benefit.

## 📌 Ringkasan Bab 8

| Konsep                | Penjelasan Singkat                                              |
| --------------------- | --------------------------------------------------------------- |
| `useCallback`         | Memoize fungsi — referensi stabil antar render                |
| `useMemo`             | Memoize value — cache hasil komputasi mahal                    |
| `useRef`              | Ref mutable tanpa trigger re-render                            |
| `React.memo`          | Skip re-render child jika props tidak berubah                  |
| `ref` prop (React 19) | Langsung pass ref tanpa forwardRef                            |
| Best practice          | Jangan over-optimize — ukur dulu, baru optimize               |

---

➡️ Lanjut ke [Bab 9 — Custom Hooks](/bagian-2/bab-9)
