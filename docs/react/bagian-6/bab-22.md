---
title: Bab 22 — Performa & Optimasi
---

# 📖 Bab 22 — Performa & Optimasi

## 22.1 🔍 Mendeteksi Masalah Performa

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

## 22.2 ⚡ Teknik Optimasi yang Sering Dipakai

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

## 22.3 🆕 React 19: `useOptimistic` & `useActionState`

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

## 22.4 📊 Checklist Optimasi

| Teknik                          | Untuk Kasus                                       |
| ------------------------------- | ------------------------------------------------- |
| `React.memo`                    | Komponen berat dengan props stabil                |
| `useCallback`                   | Callback yang dikirim ke memoized child          |
| `useMemo`                       | Komputasi mahal (filter, sort, transform)        |
| `lazy()` + `Suspense`            | Bundle besar, split per route                    |
| Virtual list (`react-window`)    | List 1000+ item                                   |
| Image `loading="lazy"`           | Banyak gambar di halaman                          |
| `useOptimistic` + cache invalidation | UX terasa cepat untuk aksi user             |
| Bundle analyzer (`rollup-plugin-visualizer`) | Pantau ukuran bundle              |

> ⚠️ **Jangan Over-Optimize!**
> Profiling dulu → baru optimize. Hampir semua optimasi membawa kompleksitas.
> Optimasi prematur = kode lebih sulit dibaca tanpa benefit terukur.

## 📌 Ringkasan Bab 22

| Konsep                | Penjelasan Singkat                                              |
| --------------------- | --------------------------------------------------------------- |
| React Profiler         | Alat ukur performa komponen                                   |
| `React.memo` / `useMemo` / `useCallback` | Optimasi re-render & komputasi           |
| Code splitting         | `lazy()` + `Suspense` untuk bundle per fitur                 |
| Virtual list           | `react-window` untuk list besar                              |
| `useOptimistic`       | Update UI sebelum server (React 19)                            |
| `useActionState`      | Form action dengan state (React 19)                            |
| Image lazy             | Native `loading="lazy"`                                       |
| Best practice          | Profiling dulu, optimize kemudian                             |

---

➡️ Lanjut ke [Bab 23 — Testing React & Best Practices](/bagian-6/bab-23)
