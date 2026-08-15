---
title: Bab 16 — Zustand — Alternatif Redux
---

# 📖 Bab 16 — Zustand — Alternatif Redux yang Ringan

## 16.1 🐻 Setup & Penggunaan Zustand

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

**Penjelasan Zustand:**

- **`create(setup)`** — Buat store hook. `setup` function return object dengan state + actions.
- **`set`** — Update state. `set({ key: value })` atau `set(state => ...)`.
- **`get`** — Akses state saat ini. Untuk derived/getter.
- **`persist`** — Middleware. Auto sync ke localStorage.
- **`partialize`** — Pilih state mana yang di-persist.

## 16.2 🔄 Zustand vs Redux Toolkit

| Aspek                | Zustand                              | Redux Toolkit                |
| -------------------- | ------------------------------------ | ---------------------------- |
| Bundle size          | ~3KB                                 | ~10KB                        |
| Boilerplate          | Minimal                              | Moderate (slice, action)     |
| DevTools             | Built-in                             | Built-in                     |
| TypeScript           | Native                                | Native                       |
| Async actions        | Langsung di action (no thunk)       | Perlu createAsyncThunk      |
| Cache invalidation   | Manual                                | Tag-based otomatis           |
| Best for             | Small-medium apps, prototype        | Large apps, complex state    |

```javascript
// Zustand dengan async (sangat clean!)
const useListingsStore = create((set, get) => ({
  listings: [],
  isLoading: false,

  fetchListings: async () => {
    set({ isLoading: true })
    const data = await listingService.search()
    set({ listings: data, isLoading: false })
  },

  toggleWishlist: (listingId) => {
    const current = get().listings
    set({
      listings: current.map(l =>
        l.id === listingId ? { ...l, isWishlisted: !l.isWishlisted } : l
      ),
    })
  },
}))
```

**Penjelasan example:**

- **`fetchListings: async () =>`** — Async action langsung. Tidak perlu thunk.
- **`toggleWishlist`** — Sync action. Update array.

## 16.3 ☁️ Zustand untuk Global UI State

```javascript
// src/store/useUIStore.js
const useUIStore = create((set) => ({
  // Modal state
  isLoginModalOpen: false,
  isFilterModalOpen: false,

  // Toast notifications
  toast: null,
  showToast: (message, type = 'success') => {
    set({ toast: { message, type } })
    setTimeout(() => set({ toast: null }), 3000)
  },

  // Theme
  theme: 'light',
  toggleTheme: () => set(state => ({
    theme: state.theme === 'light' ? 'dark' : 'light',
  })),
}))

// Penggunaan
function LoginModal() {
  const isOpen = useUIStore(state => state.isLoginModalOpen)
  const close = useUIStore(state => () => set({ isLoginModalOpen: false }))
  return <Modal isOpen={isOpen} onClose={close}>...</Modal>
}
```

**Penjelasan UI store:**

- **Modal state** — Global boolean untuk buka/tutup modal.
- **Toast** — Notifikasi temporary. Auto-clear setelah 3 detik.
- **Theme** — Dark/light mode toggle.

> 💡 **Kapan Pakai Apa?**
> - **Zustand** — untuk app kecil-menengah, simple state, global UI
> - **Redux Toolkit** — untuk app besar, tim besar, butuh struktur ketat
> - **Context** — untuk theme, i18n, user — data yang jarang berubah
> - **TanStack Query** — untuk SEMUA server state (data dari API)

## 📌 Ringkasan Bab 16

| Konsep                | Penjelasan Singkat                                              |
| --------------------- | --------------------------------------------------------------- |
| Zustand                | State management library yang ringan (3KB)                    |
| `create()`             | Buat store dengan state + actions                             |
| `persist()` middleware | Auto sync state ke localStorage                               |
| Selectors              | Ambil slice state: `useStore(state => state.value)`            |
| Update                | `set({ key: value })` atau `set(state => ({ ... }))`           |
| Best for               | Small-medium apps, butuh setup cepat                           |

---

➡️ Lanjut ke [Bagian V — Ekosistem React](/bagian-5/index)
