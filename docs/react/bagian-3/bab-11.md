---
title: Bab 11 — HOC & React.memo
---

# 📖 Bab 11 — HOC & React.memo

## 11.1 🔄 Higher-Order Component (HOC)

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

**Penjelasan HOC:**

- **Function yang return component** — `withAuth(Component)` → `EnhancedComponent`.
- **Tambahan logic** — Tanpa mengubah component asli.
- **Wrap & spread** — `return <WrappedComponent {...props} />` pass props.

> ⚠️ **HOC Mulai Jarang Dipakai**
> Sejak hooks ada, kebanyakan kasus HOC bisa diganti dengan custom hook.
> HOC masih ada di beberapa library lama, jadi penting untuk dipahami.

## 11.2 ⚡ `React.memo` — Optimasi Re-render

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

**Penjelasan `React.memo`:**

- **HOC untuk memoization** — Bungkus component agar skip re-render jika props shallow-equal.
- **Custom comparison** — Function kedua argumen. Return `true` = skip render.
- **Combine dengan `useCallback`** — Supaya callback reference stabil.

## 11.3 🧪 Kapan Pakai React.memo?

✅ **Pakai kalau:**
- Komponen **render mahal** (kompleks, banyak child)
- Props **jarang berubah**
- Parent **sering re-render** (mis. ada state yang update frequently)

❌ **Jangan pakai kalau:**
- Komponen simpel & ringan
- Props sering berubah
- Tidak ada masalah performa terukur

## 11.4 🔄 HOC vs Custom Hook vs Render Props

```jsx
// ❌ HOC — verbose, banyak wrapper
const EnhancedList = withLoading(withErrorBoundary(List))

// ✅ Custom Hook — modern, concise
function List() {
  const { data, isLoading, error } = useFetch('/api/list')
  if (isLoading) return <Spinner />
  if (error) return <Error />
  return <ListUI items={data} />
}
```

**Penjelasan:**

- **HOC** — Synthetic. Stack bisa dalam (HOCception).
- **Custom hook** — Native React. Readable. Tidak ada extra wrapper di tree.

## 📌 Ringkasan Bab 11

| Konsep                | Penjelasan Singkat                                              |
| --------------------- | --------------------------------------------------------------- |
| HOC                   | Fungsi yang menerima komponen, return komponen enhanced       |
| `React.memo`          | Skip re-render jika props sama (shallow equal)                |
| Modern approach       | Custom hook lebih favorited daripada HOC                      |
| Kapan optimize        | Ada masalah performa terukur, jangan optimasi prematur         |

---

➡️ Lanjut ke [Bab 12 — Error Boundaries & Suspense](/bagian-3/bab-12)
