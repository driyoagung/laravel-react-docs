---
title: Bab 9 — Custom Hooks
---

# 📖 Bab 9 — Custom Hooks — Logika yang Bisa Dipakai Ulang

## 9.1 🧩 Apa itu Custom Hook?

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

## 9.2 📦 Custom Hook: `useFetch()`

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

**Penjelasan `useFetch`:**

- **Generic hook** — Pakai untuk endpoint GET apapun.
- **`useCallback`** — Stabilkan `fetchData` reference.
- **`useEffect`** — Auto-fetch saat mount atau URL berubah.
- **`refetch`** — Returned function. Bisa dipanggil manual untuk retry.

## 9.3 ⏱️ Custom Hook: `useDebounce()`

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

**Penjelasan `useDebounce`:**

- **Delay update** — Hanya update `debouncedValue` setelah user berhenti ngetik selama `delay` ms.
- **Use case** — Search input. Hindari request tiap keystroke.
- **Cleanup** — `clearTimeout` jika value berubah lagi sebelum timer selesai.

## 9.4 💾 Custom Hook: `useLocalStorage()`

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

**Penjelasan `useLocalStorage`:**

- **Sama API dengan `useState`** — `[value, setValue]`.
- **Auto sync** ke localStorage. Saat refresh, value tetap ada.
- **Functional update** — Mendukung `setValue(prev => ...)`.

## 9.5 👁️ Custom Hook: `useIntersectionObserver()`

```javascript
// src/hooks/useIntersectionObserver.js
import { useEffect, useRef } from 'react'

export function useIntersectionObserver(callback, options = {}) {
  const targetRef = useRef(null)

  useEffect(() => {
    const target = targetRef.current
    if (!target) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback(entry)
        }
      })
    }, options)

    observer.observe(target)
    return () => observer.disconnect()
  }, [callback, options])

  return targetRef
}

// Penggunaan untuk infinite scroll
function UseCase() {
  const sentinelRef = useIntersectionObserver(() => {
    fetchNextPage()
  })

  return (
    <>
      <List items={items} />
      <div ref={sentinelRef}>Loading more...</div>
    </>
  )
}
```

**Penjelasan `useIntersectionObserver`:**

- **Detect element masuk viewport** — Pakai native `IntersectionObserver` API.
- **Use case** — Infinite scroll, lazy loading, animation on scroll.
- **Return ref** — Tempel ke element target.

## 📌 Ringkasan Bab 9

| Konsep                | Penjelasan Singkat                                              |
| --------------------- | --------------------------------------------------------------- |
| Custom hook           | Fungsi JS yang pakai React hooks, nama mulai `use`             |
| Pattern               | Extract logic berulang jadi reusable function                  |
| `useFetch`            | Wrapper untuk fetch + loading + error                          |
| `useDebounce`         | Tunda update state untuk optimasi                              |
| `useLocalStorage`     | State yang sinkron dengan localStorage                        |
| `useIntersectionObserver` | Detect kapan element masuk viewport                       |
| Naming convention     | Selalu mulai dengan `use` — supaya linter bisa validasi hooks  |

---

➡️ Lanjut ke [Bagian III — Pola Desain Komponen](/bagian-3/index)
