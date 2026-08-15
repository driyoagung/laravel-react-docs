---
title: Bab 12 — Error Boundaries & Suspense
---

# 📖 Bab 12 — Error Boundaries & Suspense

## 12.1 🚨 Error Boundary

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

**Penjelasan Error Boundary:**

- **Class component** — Satu-satunya cara buat Error Boundary (no hook yet).
- **`getDerivedStateFromError`** — Static method. Dijalankan saat error. Return updated state.
- **`componentDidCatch`** — Side effect. Log ke console atau Sentry.
- **`fallback`** — Prop. UI alternatif saat error.
- **`this.props.children`** — Tree yang di-wrap. Jika error di sini, boundary catch.

### Error Boundary di Router

```jsx
// Bungkus individual route dengan ErrorBoundary
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <ErrorBoundary fallback={<ErrorPage />}>
            <HomePage />
          </ErrorBoundary>
        } />
        <Route path="/profile" element={
          <ErrorBoundary fallback={<ErrorPage />}>
            <ProfilePage />
          </ErrorBoundary>
        } />
      </Routes>
    </BrowserRouter>
  )
}
```

> 💡 **Library Pihak Ketiga**
> Tidak perlu tulis ErrorBoundary sendiri — pakai [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary):
> ```jsx
> import { ErrorBoundary } from 'react-error-boundary'
> 
> <ErrorBoundary FallbackComponent={ErrorFallback}>
>   <RiskyComponent />
> </ErrorBoundary>
> ```

## 12.2 ⏳ Suspense — Loading State yang Elegan

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

**Penjelasan Suspense:**

- **`lazy()`** — Dynamic import. Component hanya di-bundle saat dibutuhkan.
- **`Suspense fallback={...}`** — UI saat component masih loading.
- **Nested Suspense** — Multiple Suspense boundaries. Lebih granular loading.

## 12.3 🆕 Suspense untuk Data Fetching (React 19)

```jsx
// React 19 + Suspense untuk data fetching
// Pakai use() promise atau library seperti TanStack Query

function ListingDetail({ listingPromise }) {
  // use() + Suspense = otomatis tunggu data
  const listing = use(listingPromise)
  return <ListingInfo listing={listing} />
}

// Pemakaian
<Suspense fallback={<SkeletonLoader />}>
  <ListingDetail listingPromise={fetchListing(id)} />
</Suspense>
```

**Penjelasan Suspense untuk data:**

- **React 19** — `use()` hook membaca promise. Auto suspend.
- **TanStack Query** — Ada `useSuspenseQuery` bawaan.

## 📌 Ringkasan Bab 12

| Konsep                | Penjelasan Singkat                                              |
| --------------------- | --------------------------------------------------------------- |
| Error Boundary         | Catch error di subtree, tampilkan fallback UI                 |
| Class component        | Satu-satunya cara buat Error Boundary (no hook yet)           |
| `static getDerivedStateFromError` | Update state saat error terjadi              |
| `componentDidCatch`    | Side effect: log, kirim ke Sentry, dll                        |
| `Suspense`              | Tampilkan fallback saat child sedang loading                   |
| `lazy()`               | Dynamic import — code splitting per komponen                   |
| React 19 Suspense      | Sekarang support data fetching via `use()` promise            |

---

➡️ Lanjut ke [Bagian IV — State Management](/bagian-4/index)
