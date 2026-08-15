---
title: Bab 15 — RTK Query — Data Fetching
---

# 📖 Bab 15 — Redux Toolkit Lanjutan — RTK Query

> ⭐ **Bab KRITIS** — State management modern untuk aplikasi skala besar

## 15.1 🏭 RTK Query — Data Fetching Terintegrasi Redux

```javascript
// src/store/services/listingApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const listingApi = createApi({
  reducerPath: 'listingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),

  tagTypes: ['Listing', 'Wishlist'],

  endpoints: (builder) => ({
    // Query — GET data
    getListings: builder.query({
      query: (params) => ({ url: '/listings', params }),
      providesTags: ['Listing'],
    }),

    getListing: builder.query({
      query: (id) => `/listings/${id}`,
      providesTags: (result, error, id) => [{ type: 'Listing', id }],
    }),

    // Mutation — POST/PUT/DELETE
    toggleWishlist: builder.mutation({
      query: (listingId) => ({
        url: `/wishlists/${listingId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Wishlist'], // Auto refetch wishlist setelah mutasi
    }),
  }),
})

// Auto-generated hooks!
export const {
  useGetListingsQuery,
  useGetListingQuery,
  useToggleWishlistMutation,
} = listingApi
```

**Penjelasan RTK Query:**

- **`createApi`** — Definisi API service.
- **`fetchBaseQuery`** — Default `fetch`-based base query.
- **`prepareHeaders`** — Callback untuk inject headers (auth token).
- **`tagTypes`** — Tags untuk cache invalidation.
- **`builder.query`** — GET endpoint.
- **`builder.mutation`** — POST/PUT/DELETE endpoint.
- **`providesTags`** — Tag yang di-provide. Cache invalidation key.
- **`invalidatesTags`** — Tag yang di-invalidate. Auto refetch affected queries.
- **Auto-generated hooks** — `useGetListingsQuery` etc.

```jsx
// Penggunaan di komponen — sangat bersih!
function SearchPage() {
  const [filters, setFilters] = useState({})
  const {
    data: listings,
    isLoading,
    isFetching,
    error,
  } = useGetListingsQuery(filters)

  if (isLoading) return <SkeletonGrid />
  if (error)     return <ErrorMessage />

  return <ListingGrid listings={listings?.data} />
}
```

**Penjelasan hook:**

- **`data`** — Response data (jika success).
- **`isLoading`** — First fetch, no cached data.
- **`isFetching`** — Sedang fetch (termasuk refetch).
- **`error`** — Error object.

## 15.2 🔄 Tag-based Cache Invalidation

```javascript
// Tag system — kuncinya automatic refetch yang efisien

endpoints: (builder) => ({
  // Provides tag 'Listing' — query ini akan cache untuk tag ini
  getListings: builder.query({
    query: () => '/listings',
    providesTags: ['Listing'],
  }),

  // Mutation ini invalidates tag 'Listing' → semua query yang provides tag ini akan refetch
  createListing: builder.mutation({
    query: (newListing) => ({
      url: '/listings',
      method: 'POST',
      body: newListing,
    }),
    invalidatesTags: ['Listing'],
  }),

  // Specific tag dengan ID — invalidate hanya item tertentu
  updateListing: builder.mutation({
    query: ({ id, ...patch }) => ({
      url: `/listings/${id}`,
      method: 'PATCH',
      body: patch,
    }),
    invalidatesTags: (result, error, { id }) => [{ type: 'Listing', id }],
  }),
})
```

**Penjelasan tag system:**

- **`providesTags`** — Tag yang di-provide. Query ini dapat cache untuk tag ini.
- **`invalidatesTags`** — Tag yang di-invalidate setelah mutation. Query yang provide tag ini otomatis refetch.
- **Granular** — Bisa tag specific ID supaya hanya item itu yang refetch.

## 15.3 ⚡ Polling & Auto-Refetch

```jsx
// Polling — refetch setiap N detik
function LiveDashboard() {
  const { data } = useGetStatsQuery(undefined, {
    pollingInterval: 3000, // Refetch setiap 3 detik
  })

  return <StatsCards data={data} />
}

// Refetch on focus
function useListingsWithFocus() {
  return useGetListingsQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  })
}
```

**Penjelasan polling:**

- **`pollingInterval`** — Auto-refetch setiap N ms.
- **`refetchOnFocus`** — Refetch saat tab window kembali fokus.
- **`refetchOnReconnect`** — Refetch saat internet kembali.

## 15.4 🚀 Perbandingan RTK Query vs TanStack Query

| Aspek                | RTK Query                              | TanStack Query              |
| -------------------- | -------------------------------------- | --------------------------- |
| Integrasi            | Built-in dengan Redux                  | Standalone                  |
| Cache invalidation   | Tag-based                              | Query key based             |
| Setup                | Sudah ada kalau pakai Redux            | Extra install               |
| DevTools             | Redux DevTools                          | React Query DevTools        |
| Optimistic updates   | Built-in                                | Built-in                    |
| Bundle size          | Lebih besar (ikut Redux)               | Lebih kecil                  |
| Use case             | App yang sudah pakai Redux              | App baru, tidak pakai Redux |

> 💡 **Rekomendasi 2026**
> Untuk project baru, **TanStack Query** (Bab 19) lebih ringan dan populer.
> Tapi paham RTK Query tetap penting untuk baca codebase yang sudah ada.

## 📌 Ringkasan Bab 15

| Konsep                | Penjelasan Singkat                                              |
| --------------------- | --------------------------------------------------------------- |
| RTK Query              | Data fetching terintegrasi Redux                              |
| `createApi`            | Definisi API service                                          |
| `builder.query`        | GET endpoint                                                    |
| `builder.mutation`     | POST/PUT/DELETE endpoint                                       |
| `providesTags`         | Query ini cache untuk tag ini                                  |
| `invalidatesTags`      | Auto refetch query yang punya tag ini setelah mutation         |
| `pollingInterval`      | Polling refetch otomatis                                       |
| `useXxxQuery/Mutation` | Auto-generated hooks                                         |

---

➡️ Lanjut ke [Bab 16 — Zustand — Alternatif Redux](/bagian-4/bab-16)
