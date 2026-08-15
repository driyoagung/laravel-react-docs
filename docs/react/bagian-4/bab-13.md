---
title: Bab 13 — Redux Toolkit — Global State
---

# 📖 Bab 13 — Redux Toolkit — Global State

> ⭐ **Bab KRITIS** — State management untuk aplikasi React skala besar!

## 13.1 🤔 Mengapa Redux?

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

## 13.2 🏗️ Setup Redux Toolkit

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

**Penjelasan setup:**

- **`configureStore`** — Setup Redux store. Auto-include DevTools & thunk middleware.
- **`Provider store={store}`** — Bungkus tree. Semua child bisa akses store.
- **`reducer: { auth, search, cart }`** — Setiap key = 1 slice of state.

## 13.3 📦 Membuat Slice

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

**Penjelasan slice:**

- **`createSlice`** — Definisi reducer + action dalam satu function.
- **`name`** — Namespace actions (`search/setFilter`).
- **`initialState`** — Default state.
- **`reducers`** — Synchronous actions. `state.filters[key] = value` — mutasi langsung OK karena RTK pakai **Immer**.
- **`createAsyncThunk`** — Async action. Generate 3 auto-action: `pending`, `fulfilled`, `rejected`.
- **`extraReducers`** — Handle actions dari luar slice (biasanya async thunks).
- **`builder`** — Modern API untuk declare action handlers.

## 13.4 🔌 Menggunakan Redux di Komponen

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

**Penjelasan hook:**

- **`useSelector(state => state.x)`** — Subscribe ke state. Re-render HANYA jika nilai yang dipilih berubah.
- **`useDispatch()`** — Ambil fungsi dispatch untuk trigger action.
- **`dispatch(action)`** — Trigger action. Bisa sync atau async thunk.

## 13.5 🆕 RTK Immer — Mutasi Langsung OK!

```javascript
// RTK pakai Immer — mutasi "terlihat" langsung OK
// Tapi di balik layar, Immer bikin immutable copy
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment(state) {
      state.value += 1 // ✅ OK di RTK (Immer handle)
    },
  },
})

// ❌ Tapi JANGAN mutate state di luar reducer!
// Ini tetap illegal:
let globalState = store.getState()
globalState.value = 999 // ❌ Tidak memicu re-render, dan merusak state
```

**Penjelasan Immer:**

- **Immer** — Library yang track mutations dan produce new immutable state.
- **Di dalam reducer** — `state.value = 1` terlihat mutasi, tapi Immer bikin copy.
- **Di luar reducer** — Mutasi TIDAK ter-track. Selalu pakai `dispatch()`.

## 📌 Ringkasan Bab 13

| Konsep                | Penjelasan Singkat                                              |
| --------------------- | --------------------------------------------------------------- |
| Redux Toolkit          | Cara modern pakai Redux — less boilerplate                    |
| `configureStore`      | Buat store dengan auto setup DevTools & middleware             |
| `createSlice`          | Definisi reducer + action dalam satu fungsi                    |
| `createAsyncThunk`     | Handle async action (loading/success/error)                    |
| `useSelector`          | Ambil state dari store                                          |
| `useDispatch`          | Kirim action ke store                                          |
| Immer                  | "Mutasi" langsung OK di dalam reducer (RTK otomatis)          |

---

➡️ Lanjut ke [Bab 14 — Cart & Wishlist Slice](/bagian-4/bab-14)
