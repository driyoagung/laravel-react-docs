---
title: Bab 6 — useContext & Context API
---

# 📖 Bab 6 — `useContext` & Context API

## 6.1 🌐 Masalah Props Drilling

```
App (punya data: user)
  └── Layout (tidak butuh user, tapi harus pass)
        └── Navbar (tidak butuh user, tapi harus pass)
              └── UserAvatar (butuh user) ← Target sebenarnya

// Setiap komponen di tengah harus "meneruskan" props
// meski tidak membutuhkannya sendiri → props drilling
```

## 6.2 🔧 Solusi: Context API

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

**Penjelasan Context:**

- **`createContext(null)`** — Buat Context. `null` = default value.
- **Provider** — Component yang "menyediakan" data via `value` prop.
- **`useContext()`** — Konsumsi context di komponen child.
- **Custom hook** — Wrap `useContext` + validasi. Auto-throw jika dipakai di luar Provider.

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

**Penjelasan konsumsi:**

- **`<AuthProvider>`** — Bungkus sekali di root. Semua child bisa akses.
- **`useAuth()`** — Custom hook. Gunakan di komponen manapun.
- **`user?` (optional chaining)** — Aman jika user null (belum login).

## 6.3 ⚠️ Kapan Context, Kapan Redux?

| Situasi                                         | Pilihan Terbaik       |
| ----------------------------------------------- | --------------------- |
| Data user login (jarang berubah)                 | ✅ Context            |
| Tema aplikasi (dark/light)                       | ✅ Context            |
| Bahasa / i18n                                    | ✅ Context            |
| State UI lokal (modal buka/tutup)                | ✅ `useState` lokal   |
| State yang diubah banyak komponen                | ✅ Redux Toolkit      |
| Data dari server (listings, orders)              | ✅ TanStack Query     |
| State yang kompleks & sering update              | ✅ Redux Toolkit      |

::: tip 💡 Tips
Context **bukan** untuk menggantikan state management. Context ideal untuk
data yang **jarang berubah** (user, theme, i18n). Untuk data yang sering
berubah dan kompleks, gunakan Redux Toolkit atau Zustand.
:::

## 6.4 📦 Multiple Contexts

```jsx
// Pisahkan context berdasarkan domain

// src/context/AuthContext.jsx
export const AuthContext = createContext(null)
export function AuthProvider({ children }) { /* ... */ }
export function useAuth() { /* ... */ }

// src/context/ThemeContext.jsx
export const ThemeContext = createContext('light')
export function ThemeProvider({ children }) { /* ... */ }
export function useTheme() { /* ... */ }

// src/main.jsx
root.render(
  <AuthProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </AuthProvider>
)

// Penggunaan
function Navbar() {
  const { user } = useAuth()
  const { theme } = useTheme()
  return <div className={`navbar ${theme}`}>{user?.name}</div>
}
```

**Penjelasan multiple context:**

- **Pisahkan per domain** — Auth, Theme, I18n masing-masing file.
- **Nested providers** — Bungkus berurutan. Outer = lebih global.
- **Atau pakai single Provider** — Kadang lebih mudah gabung state global di 1 Provider.

## 📌 Ringkasan Bab 6

| Konsep                | Penjelasan Singkat                                              |
| --------------------- | --------------------------------------------------------------- |
| Context API            | Mekanisme bawaan React untuk share data lintas komponen       |
| `createContext`        | Buat Context baru                                             |
| `Provider`             | Bungkus subtree yang perlu akses                              |
| `useContext()`         | Konsumsi context di komponen manapun                          |
| Custom hook pattern    | Buat `useAuth()`, `useTheme()` untuk API yang lebih rapi       |
| Kapan pakai             | Data jarang berubah (user, theme, i18n)                       |
| Kapan TIDAK             | Data sering berubah kompleks — pakai Redux/Zustand             |

---

➡️ Lanjut ke [Bab 7 — useReducer untuk State Kompleks](/bagian-2/bab-7)
