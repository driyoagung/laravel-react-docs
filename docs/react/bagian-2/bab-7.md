---
title: Bab 7 — useReducer untuk State Kompleks
---

# 📖 Bab 7 — `useReducer` — State yang Kompleks

## 7.1 🔧 `useReducer` vs `useState`

```jsx
// useState mulai tidak nyaman ketika banyak state yang saling berkaitan
const [isLoading, setIsLoading]   = useState(false)
const [data, setData]             = useState(null)
const [error, setError]           = useState(null)
const [page, setPage]             = useState(1)
// Update harus dilakukan satu per satu, rawan tidak sinkron

// ✅ useReducer — state yang kompleks dalam satu reducer
import { useReducer } from 'react'

const initialState = {
  listings: [],
  isLoading: false,
  error: null,
  page: 1,
  totalPages: 1,
}

function listingReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null }
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        listings: action.payload.listings,
        totalPages: action.payload.totalPages,
      }
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload }
    case 'NEXT_PAGE':
      return { ...state, page: state.page + 1 }
    default:
      return state
  }
}

function SearchPage() {
  const [state, dispatch] = useReducer(listingReducer, initialState)

  async function fetchListings() {
    dispatch({ type: 'FETCH_START' })
    try {
      const data = await listingService.search({ page: state.page })
      dispatch({ type: 'FETCH_SUCCESS', payload: data })
    } catch (err) {
      dispatch({ type: 'FETCH_ERROR', payload: err.message })
    }
  }

  return (
    <>
      {state.isLoading && <Spinner />}
      {state.error && <ErrorMessage message={state.error} />}
      <ListingGrid listings={state.listings} />
    </>
  )
}
```

**Penjelasan `useReducer`:**

- **`useReducer(reducer, initialState)`** — Return `[state, dispatch]`.
- **`state`** — Current state (hasil dari reducer).
- **`dispatch(action)`** — Kirim action untuk mengubah state.
- **`reducer(state, action)`** — Pure function `(state, action) => newState`. Wajib return new state (immutable).
- **Action** — Object `{ type, payload }`. `type` = identifier, `payload` = data.

## 7.2 🎯 Kapan Pakai `useReducer`?

::: tip 💡 Panduan
Pakai `useReducer` ketika:
- State terdiri dari **3+ field** yang saling terkait
- Update state punya **logika transisi** (loading → success/error)
- Logic update **kompleks** dan sulit di-handle dengan `useState` biasa
- Ingin **testable** — reducer adalah pure function, mudah di-unit test

Tetap pakai `useState` untuk:
- Single value sederhana (counter, toggle, input value)
- Tidak ada logic transisi
:::

## 7.3 🧪 Reducer = Pure Function = Mudah di-test

```jsx
// listingReducer.test.js
import { describe, it, expect } from 'vitest'
import { listingReducer } from './listingReducer'

describe('listingReducer', () => {
  it('FETCH_START → set loading true, reset error', () => {
    const state = { isLoading: false, error: 'old', listings: [] }
    const next = listingReducer(state, { type: 'FETCH_START' })
    expect(next.isLoading).toBe(true)
    expect(next.error).toBe(null)
  })

  it('FETCH_SUCCESS → update listings, set loading false', () => {
    const state = { isLoading: true, listings: [], totalPages: 0 }
    const next = listingReducer(state, {
      type: 'FETCH_SUCCESS',
      payload: { listings: [{ id: 1 }], totalPages: 5 },
    })
    expect(next.isLoading).toBe(false)
    expect(next.listings).toEqual([{ id: 1 }])
    expect(next.totalPages).toBe(5)
  })
})
```

**Penjelasan reducer test:**

- **Pure function** — Reducer tidak depend on side effect. Pure: input → output selalu sama.
- **Unit testable** — Tidak perlu render React, tidak perlu mock. Tinggal panggil function.
- **Snapshot testing** — Test action tertentu menghasilkan state yang diharapkan.

## 📌 Ringkasan Bab 7

| Konsep              | Penjelasan Singkat                                              |
| ------------------- | --------------------------------------------------------------- |
| `useReducer`         | Alternatif `useState` untuk state kompleks                    |
| Action              | Objek `{ type, payload }` yang mendeskripsikan perubahan      |
| Reducer             | Pure function `(state, action) => state`                       |
| `dispatch`           | Fungsi untuk mengirim action                                   |
| Kapan pakai          | 3+ field terkait, ada transisi state, atau testable logic      |
| Pure function       | Reducer tidak boleh mutate state — return new state           |

---

➡️ Lanjut ke [Bab 8 — useCallback, useMemo & useRef](/bagian-2/bab-8)
