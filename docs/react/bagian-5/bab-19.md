---
title: Bab 19 — TanStack Query — Server State
---

# 📖 Bab 19 — TanStack Query — Server State yang Elegan

> ⭐ **Bab KRITIS** — Best practice untuk data fetching di React modern!

## 19.1 🤔 Mengapa TanStack Query?

```
MASALAH TANPA TANSTACK QUERY:
  - Setiap komponen fetch data sendiri → request duplikat
  - Loading & error state harus dikelola manual di setiap komponen
  - Data tidak tersinkron antar halaman (stale data)
  - Tidak ada caching → fetch ulang setiap kali komponen mount

SOLUSI TANSTACK QUERY:
  - Cache otomatis → request yang sama tidak diulang
  - Background refetch → data selalu fresh tanpa terasa
  - Loading/error state otomatis
  - Optimistic updates built-in
  - Devtools untuk debug query
```

## 19.2 🔧 Setup & Penggunaan Dasar

```jsx
// src/main.jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:   1000 * 60 * 5, // Data dianggap fresh selama 5 menit
      cacheTime:   1000 * 60 * 10, // Cache disimpan 10 menit
      retry:       2,              // Coba ulang 2x jika gagal
      refetchOnWindowFocus: false, // Jangan refetch saat tab kembali fokus
    },
  },
})

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
)
```

**Penjelasan setup:**

- **`QueryClient`** — Holder untuk cache + config.
- **`staleTime`** — Selama ini, data dianggap fresh. Tidak refetch.
- **`cacheTime`** — Berapa lama cache disimpan setelah inaktif.
- **`retry`** — Auto retry on failure.
- **`ReactQueryDevtools`** — Browser DevTools untuk debug.

```jsx
// src/hooks/useListings.js — Query hooks yang rapi
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Query — fetch data
export function useListings(filters) {
  return useQuery({
    queryKey: ['listings', filters], // Cache key — unik per kombinasi filter
    queryFn:  () => listingService.search(filters),
    enabled:  !!filters.destination, // Hanya fetch jika destination ada
    select:   (data) => data.results, // Transformasi data
  })
}

export function useListing(id) {
  return useQuery({
    queryKey: ['listing', id],
    queryFn:  () => listingService.getById(id),
  })
}

// Mutation — ubah data di server
export function useToggleWishlist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (listingId) => wishlistService.toggle(listingId),

    // Optimistic update — update UI dulu sebelum server merespons
    onMutate: async (listingId) => {
      await queryClient.cancelQueries({ queryKey: ['wishlist'] })
      const prev = queryClient.getQueryData(['wishlist'])

      queryClient.setQueryData(['wishlist'], old =>
        old?.includes(listingId)
          ? old.filter(id => id !== listingId)
          : [...(old ?? []), listingId]
      )

      return { prev } // Simpan untuk rollback
    },

    // Jika server gagal → rollback ke state sebelumnya
    onError: (err, listingId, context) => {
      queryClient.setQueryData(['wishlist'], context.prev)
    },

    // Setelah sukses/gagal → sync dengan server
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    },
  })
}
```

**Penjelasan hooks:**

- **`useQuery`** — Fetch data. Auto cached, refetched.
- **`queryKey`** — Identifier. Array — bisa multiple parts.
- **`queryFn`** — Fungsi async yang return data.
- **`enabled`** — Conditional fetch. Hanya jalan jika `true`.
- **`select`** — Transform data sebelum return.
- **`useMutation`** — POST/PUT/DELETE.
- **`onMutate`** — Sebelum mutation. Untuk optimistic update.
- **`onError`** — Rollback jika gagal.
- **`onSettled`** — Selalu dipanggil (sukses/gagal). Untuk invalidate.

```jsx
// Penggunaan di komponen
function SearchPage() {
  const [filters, setFilters] = useSearchFilters()
  const { data: listings, isLoading, isError } = useListings(filters)

  if (isLoading) return <SkeletonGrid count={12} />
  if (isError)   return <ErrorState onRetry={() => refetch()} />

  return <ListingGrid listings={listings} />
}
```

## 19.3 🔄 Infinite Query — Untuk Scroll Tanpa Henti

```jsx
import { useInfiniteQuery } from '@tanstack/react-query'

function useInfiniteListings(filters) {
  return useInfiniteQuery({
    queryKey:     ['listings', 'infinite', filters],
    queryFn:      ({ pageParam = 1 }) => listingService.search({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.current_page < lastPage.last_page
        ? lastPage.current_page + 1
        : undefined, // undefined = tidak ada halaman berikutnya
  })
}

// Penggunaan dengan IntersectionObserver
function ListingGrid() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteListings(filters)
  const sentinelRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    })
    if (sentinelRef.current) observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const listings = data?.pages.flatMap(page => page.data) ?? []

  return (
    <>
      <div className="grid">{listings.map(l => <ListingCard key={l.id} listing={l} />)}</div>
      <div ref={sentinelRef} />
      {isFetchingNextPage && <Spinner />}
    </>
  )
}
```

**Penjelasan Infinite Query:**

- **`useInfiniteQuery`** — Untuk pagination scroll.
- **`pageParam`** — Parameter halaman saat ini.
- **`getNextPageParam`** — Return `undefined` jika tidak ada halaman berikutnya.
- **`data.pages`** — Array of pages. Flatten untuk render.

## 19.4 📊 Query Status Reference

| Status         | Kapan Terjadi                                                |
| -------------- | ------------------------------------------------------------- |
| `isLoading`    | Fetch pertama kali, belum ada data                            |
| `isFetching`   | Sedang fetch (termasuk refetch di background)                 |
| `isError`      | Fetch gagal                                                   |
| `isSuccess`    | Fetch berhasil                                                |
| `isPending`    | Loading pertama (alias untuk isLoading)                       |
| `isPlaceholderData` | Data ada tapi stale (placeholder)                        |

## 📌 Ringkasan Bab 19

| Konsep                | Penjelasan Singkat                                              |
| --------------------- | --------------------------------------------------------------- |
| TanStack Query         | Library data fetching #1 untuk React                          |
| `useQuery`             | Fetch data dengan auto caching                                |
| `useMutation`          | Ubah data di server (POST/PUT/DELETE)                         |
| `useInfiniteQuery`     | Pagination / infinite scroll                                   |
| `queryKey`             | Identifier unik untuk cache entry                              |
| `staleTime`            | Berapa lama data dianggap fresh                               |
| `invalidateQueries`    | Paksa refetch query tertentu                                   |
| Optimistic updates     | Update UI duluan, rollback kalau server gagal                 |
| Auto refetch           | Saat window focus, reconnect, atau interval                    |

---

➡️ Lanjut ke [Bab 20 — Form Handling dengan React Hook Form](/bagian-5/bab-20)
