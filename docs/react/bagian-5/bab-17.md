---
title: Bab 17 — React Router v6
---

# 📖 Bab 17 — React Router v6 — Navigasi Halaman

## 17.1 🗺️ Setup & Konfigurasi Router

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

**Penjelasan setup:**

- **`BrowserRouter`** — Provider router. Wrap seluruh app.
- **`Routes`** — Container untuk semua `Route`.
- **`Route`** — Single route mapping: `path` → `element`.
- **`lazy()`** — Dynamic import. Component di-bundle terpisah.
- **`path=":id"`** — Dynamic segment. `:id` adalah parameter.
- **`path="*"`** — Wildcard. Catch-all untuk 404.
- **Nested Route** — Pakai nested `<Route>` untuk grouping. `Outlet` di parent render child.

## 17.2 🛡️ Protected Route

```jsx
// src/components/ProtectedRoute.jsx (CONTOH)

import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute() {
  const { isLoggedIn } = useAuth()
  const location = useLocation()

  // Cek apakah user sudah login
  if (!isLoggedIn) {
    // Redirect ke login, simpan halaman asal
    // (kode lengkap ada di repository resmi)
    return null
  }

  // Outlet component merender child route
  return null
}
```

**Penjelasan ProtectedRoute:**

- **`Navigate` component** — Component yang redirect. `replace` = tidak masuk history.
- **`state` prop** — Pass data via state. Bisa dibaca di login page.
- **`Outlet` component** — Render child route yang cocok dengan nested config.

## 17.3 🧭 Navigasi di Komponen

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

**Penjelasan hooks:**

- **`useNavigate()`** — Programmatic navigation. `navigate('/path')` atau `navigate({ pathname, search })`.
- **`useParams()`** — Ambil dynamic param dari URL. `/listing/:id` → `{ id: '123' }`.
- **`useSearchParams()`** — Query string management. `?destination=bali`.
- **`Link`** — Anchor tag. Navigate tanpa page reload.
- **`NavLink`** — Like Link, tapi kasih `active` class otomatis.

## 17.4 🔗 Link vs NavLink vs Navigate

| Component     | Fungsi                                                     |
| ------------- | ---------------------------------------------------------- |
| `Link`        | Link biasa untuk navigasi                                  |
| `NavLink`     | Seperti Link, tapi kasih class otomatis saat aktif        |
| `useNavigate()` | Navigasi programmatic (setelah klik tombol, submit form) |
| `Navigate`    | Component yang langsung redirect                            |

```jsx
// Link vs NavLink
<Link to="/profile">Profile</Link>                          // Biasa
<NavLink to="/profile">Profile</NavLink>                    // Otomatis active class
<NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>
  Profile
</NavLink>

// useNavigate
const navigate = useNavigate()
navigate('/profile')                    // Push ke history
navigate('/profile', { replace: true }) // Replace di history
navigate(-1)                            // Kembali
navigate('/profile', { state: { from: 'home' } }) // Kirim state

// Navigate component (redirect langsung)
<Navigate to="/login" replace />
```

## 📌 Ringkasan Bab 17

| Konsep                | Penjelasan Singkat                                              |
| --------------------- | --------------------------------------------------------------- |
| `BrowserRouter`       | Provider router untuk SPA                                      |
| `Routes` & `Route`    | Define path → component mapping                                |
| `lazy()` + `Suspense` | Code splitting per halaman                                    |
| `useNavigate`         | Navigasi programmatic                                          |
| `useParams`           | Ambil dynamic param dari URL (`/listing/:id` → `id`)           |
| `useSearchParams`     | Query string management (`?destination=bali`)                  |
| `Link` / `NavLink` | Anchor untuk navigasi tanpa page reload                       |
| `Outlet`              | Render child route pada parent route (untuk layout)            |
| Protected Route        | Bungkus route yang butuh auth                                 |

---

➡️ Lanjut ke [Bab 18 — React Router Lanjutan](/bagian-5/bab-18)
