---
title: Bab 14 — Cart & Wishlist Slice
---

# 📖 Bab 14 — Cart & Wishlist Slice

## 14.1 🛒 Cart Slice dengan RTK

```javascript
// src/store/slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: JSON.parse(localStorage.getItem('cart') ?? '[]'),
  },

  reducers: {
    addToCart(state, action) {
      const existing = state.items.find(i => i.listingId === action.payload.listingId)
      if (!existing) {
        state.items.push(action.payload)
        localStorage.setItem('cart', JSON.stringify(state.items))
      }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter(i => i.listingId !== action.payload)
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    clearCart(state) {
      state.items = []
      localStorage.removeItem('cart')
    },
  },
})

// Selector — logic untuk derive data dari state
export const selectCartTotal = state =>
  state.cart.items.reduce((sum, item) => sum + item.totalPrice, 0)

export const selectCartCount = state => state.cart.items.length

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer
```

**Penjelasan cart slice:**

- **`addToCart`** — Cek existing item. Jika belum ada, push baru.
- **`removeFromCart`** — Filter out item.
- **`clearCart`** — Kosongkan cart.
- **`localStorage`** — Sync ke localStorage untuk persist.

## 14.2 💖 Wishlist Slice — Sinkron dengan localStorage

```javascript
// src/store/slices/wishlistSlice.js
import { createSlice } from '@reduxjs/toolkit'

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    listingIds: JSON.parse(localStorage.getItem('wishlist') ?? '[]'),
  },

  reducers: {
    toggleWishlist(state, action) {
      const id = action.payload
      if (state.listingIds.includes(id)) {
        state.listingIds = state.listingIds.filter(x => x !== id)
      } else {
        state.listingIds.push(id)
      }
      localStorage.setItem('wishlist', JSON.stringify(state.listingIds))
    },
    clearWishlist(state) {
      state.listingIds = []
      localStorage.removeItem('wishlist')
    },
  },
})

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
```

**Penjelasan wishlist:**

- **`toggleWishlist`** — Tambah/hapus dari list. Idempotent.
- **`clearWishlist`** — Hapus semua.

## 14.3 🧮 Selector dengan Memoization (Reselect)

```javascript
// src/store/selectors/cartSelectors.js
import { createSelector } from '@reduxjs/toolkit'

// Memoized selector — hanya re-compute saat input berubah
export const selectCartItemsWithDetails = createSelector(
  [state => state.cart.items, state => state.listings.byId],
  (cartItems, listingsById) =>
    cartItems.map(item => ({
      ...item,
      listing: listingsById[item.listingId],
    }))
)

export const selectCartSummary = createSelector(
  [selectCartItemsWithDetails],
  (items) => ({
    count: items.length,
    total: items.reduce((sum, item) => sum + item.totalPrice, 0),
    items,
  })
)
```

**Penjelasan memoized selector:**

- **`createSelector`** — Memoize output. Re-compute HANYA jika input berubah.
- **Cocok untuk** — Derived data yang mahal dihitung (cart total, complex joins).
- **Input selector** — Array. Define dependency mana yang dipakai.
- **Output function** — Compute logic.

## 📌 Ringkasan Bab 14

| Konsep                | Penjelasan Singkat                                              |
| --------------------- | --------------------------------------------------------------- |
| Slice                 | Definisi state + reducers + actions untuk satu domain          |
| Selectors             | Function untuk derive data dari state                          |
| `createSelector`      | Memoized selector — re-compute hanya saat input berubah       |
| Sinkron localStorage  | Manual via `localStorage.setItem` di dalam reducer             |
| Best practice         | Pisahkan slice per domain (auth, cart, wishlist, search)      |

---

➡️ Lanjut ke [Bab 15 — RTK Query — Data Fetching](/bagian-4/bab-15)
