---
title: Bab 24 — Project Clone Airbnb
---

# 📖 Bab 24 — Project Clone Airbnb

> 🎯 **Project Capstone** — Terapkan SEMUA ilmu dari Bab 1–23 dalam project nyata!

## 24.1 🎯 Fitur yang Akan Dibangun

| Fitur                                    | Bab Referensi |
| ---------------------------------------- | ------------- |
| ✅ Landing page dengan search bar hero   | Bab 1, 4      |
| ✅ Autentikasi (Login / Register / Logout) | Bab 14, 20    |
| ✅ Search listing dengan filter lengkap   | Bab 17, 19    |
| ✅ Peta interaktif dengan marker listing  | Bab 8, 22     |
| ✅ Detail listing + galeri foto           | Bab 4, 17     |
| ✅ Kalender pemilihan tanggal             | Bab 20        |
| ✅ Booking form dengan perhitungan harga  | Bab 5, 22     |
| ✅ Wishlist — simpan listing favorit      | Bab 13, 14    |
| ✅ Profil pengguna & riwayat booking       | Bab 14, 19    |
| ✅ Skeleton loading di semua halaman      | Bab 5, 12     |
| ✅ Infinite scroll di search results      | Bab 19, 22    |
| ✅ Animasi transisi antar halaman         | Bab 22        |
| ✅ Responsive design (mobile-first)       | Bab 2         |
| ✅ Testing komponen utama                 | Bab 23        |
| ✅ Build & deploy ke Vercel               | Bab 23        |

## 24.2 📦 Setup Project & Install Dependency

```bash
# Buat project
npm create vite@latest airbnb-clone -- --template react
cd airbnb-clone

# Core dependencies
npm install react-router-dom
npm install @reduxjs/toolkit react-redux
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install react-hook-form @hookform/resolvers zod
npm install axios

# UI & styling
npm install -D tailwindcss autoprefixer
npx tailwindcss init -p

# Feature-specific
npm install react-leaflet leaflet             # Peta
npm install react-day-picker                  # Date picker
npm install framer-motion                     # Animasi
npm install react-window                      # Virtual list

# Dev tools
npm install -D vitest @testing-library/react @testing-library/jest-dom

# File .env
echo "VITE_API_URL=http://localhost:3001" > .env
```

## 24.3 📁 Struktur Folder Final

```
airbnb-clone/
├── .env
├── index.html
├── vite.config.js
│
└── src/
    ├── main.jsx                    ← Provider setup (Redux, QueryClient, Auth)
    ├── App.jsx                     ← Router setup
    │
    ├── components/
    │   ├── ui/
    │   │   ├── Button/
    │   │   ├── Input/
    │   │   ├── Modal/
    │   │   ├── DateRangePicker/
    │   │   └── SkeletonLoader/
    │   ├── listing/
    │   │   ├── ListingCard/        ← Kartu listing (gambar, harga, rating)
    │   │   ├── ListingGrid/        ← Grid listing dengan infinite scroll
    │   │   ├── ListingMap/         ← Peta Leaflet dengan markers
    │   │   └── ListingGallery/     ← Galeri foto fullscreen
    │   └── layout/
    │       ├── Navbar/             ← Logo, search bar, auth menu
    │       └── Footer/
    │
    ├── pages/
    │   ├── HomePage/
    │   │   ├── HomePage.jsx
    │   │   └── components/
    │   │       ├── HeroSearch.jsx  ← Search bar besar dengan date picker
    │   │       └── CategoryBar.jsx ← Filter kategori (Pantai, Villa, Unik, dll)
    │   ├── SearchPage/
    │   │   ├── SearchPage.jsx
    │   │   └── components/
    │   │       ├── FilterBar.jsx   ← Filter harga, tipe kamar, fasilitas
    │   │       └── SplitView.jsx   ← List kiri + Peta kanan
    │   ├── ListingDetailPage/
    │   │   ├── ListingDetailPage.jsx
    │   │   └── components/
    │   │       ├── BookingWidget.jsx ← Widget booking di kanan (sticky)
    │   │       └── ReviewSection.jsx
    │   ├── ProfilePage/
    │   ├── WishlistPage/
    │   ├── LoginPage/
    │   └── RegisterPage/
    │
    ├── hooks/
    │   ├── useListings.js          ← TanStack Query hooks untuk listings
    │   ├── useDebounce.js
    │   ├── useIntersectionObserver.js ← Untuk infinite scroll
    │   └── useMediaQuery.js
    │
    ├── store/
    │   ├── index.js
    │   └── slices/
    │       ├── authSlice.js
    │       ├── searchSlice.js      ← Filters, results, pagination
    │       └── wishlistSlice.js
    │
    ├── services/
    │   ├── api.js                  ← Axios instance + interceptors
    │   ├── authService.js
    │   ├── listingService.js
    │   └── bookingService.js
    │
    ├── context/
    │   └── AuthContext.jsx
    │
    └── utils/
        ├── formatters.js
        └── constants.js
```

## 24.4 🔍 Studi Kasus: Infinite Scroll di Search Results

```jsx
// src/hooks/useInfiniteListings.js
import { useInfiniteQuery } from '@tanstack/react-query'
import { listingService } from '../services/listingService'

export function useInfiniteListings(filters) {
  return useInfiniteQuery({
    queryKey:     ['listings', 'infinite', filters],
    queryFn:      ({ pageParam = 1 }) => listingService.search({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.current_page < lastPage.last_page
        ? lastPage.current_page + 1
        : undefined // undefined berarti tidak ada halaman berikutnya
    },
  })
}

// src/components/listing/ListingGrid/ListingGrid.jsx
import { useRef, useEffect } from 'react'
import { useInfiniteListings } from '../../../hooks/useInfiniteListings'

function ListingGrid({ filters }) {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteListings(filters)

  // Intersection Observer — trigger fetchNextPage saat sentinel masuk viewport
  const sentinelRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    if (sentinelRef.current) observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  // Flatten semua halaman jadi satu array
  const listings = data?.pages.flatMap(page => page.data) ?? []

  if (isLoading) return <SkeletonGrid count={12} />

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listings.map(listing => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      {/* Sentinel — element tak terlihat di ujung list */}
      <div ref={sentinelRef} className="h-4" />

      {isFetchingNextPage && <SkeletonGrid count={4} />}

      {!hasNextPage && listings.length > 0 && (
        <p className="text-center text-gray-500 py-8">
          Semua listing sudah ditampilkan.
        </p>
      )}
    </>
  )
}
```

## 24.5 🗓️ Studi Kasus: Booking Widget dengan Kalender

```jsx
// src/pages/ListingDetailPage/components/BookingWidget.jsx
import { useState, useMemo } from 'react'
import { DayPicker } from 'react-day-picker'
import { differenceInCalendarDays } from 'date-fns'
import { useToggleWishlist } from '../../../hooks/useListings'

function BookingWidget({ listing }) {
  const [checkIn, setCheckIn]   = useState(null)
  const [checkOut, setCheckOut] = useState(null)
  const [guests, setGuests]     = useState(1)

  const { mutate: toggleWishlist } = useToggleWishlist()

  // Hitung total harga
  const totalNights = useMemo(() => {
    if (!checkIn || !checkOut) return 0
    return differenceInCalendarDays(checkOut, checkIn)
  }, [checkIn, checkOut])

  const totalPrice = useMemo(() => {
    return totalNights * listing.price_per_night
  }, [totalNights, listing.price_per_night])

  const serviceFee = useMemo(() => Math.round(totalPrice * 0.1), [totalPrice])

  return (
    <div className="booking-widget sticky top-24">
      <div className="card">
        {/* Harga per malam */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-2xl font-bold">
              Rp {listing.price_per_night.toLocaleString('id-ID')}
            </span>
            <span className="text-gray-500"> / malam</span>
          </div>
          <div className="flex items-center gap-1">
            <span>⭐ {listing.star_rating}</span>
            <span className="text-gray-500">({listing.review_count} ulasan)</span>
          </div>
        </div>

        {/* Kalender */}
        <DayPicker
          mode="range"
          selected={{ from: checkIn, to: checkOut }}
          onSelect={(range) => {
            setCheckIn(range?.from ?? null)
            setCheckOut(range?.to ?? null)
          }}
          disabled={{ before: new Date() }} // Nonaktifkan tanggal lampau
          numberOfMonths={2}
        />

        {/* Tamu */}
        <div className="guest-selector">
          <button onClick={() => setGuests(g => Math.max(1, g - 1))}>−</button>
          <span>{guests} tamu</span>
          <button onClick={() => setGuests(g => Math.min(listing.max_guests, g + 1))}>+</button>
        </div>

        {/* Rincian harga */}
        {totalNights > 0 && (
          <div className="price-breakdown">
            <div className="flex justify-between">
              <span>Rp {listing.price_per_night.toLocaleString()} × {totalNights} malam</span>
              <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span>Biaya layanan</span>
              <span>Rp {serviceFee.toLocaleString('id-ID')}</span>
            </div>
            <hr />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>Rp {(totalPrice + serviceFee).toLocaleString('id-ID')}</span>
            </div>
          </div>
        )}

        <button
          className="btn-primary w-full"
          disabled={!checkIn || !checkOut}
          onClick={() => navigate(`/booking/${listing.id}`, { state: { checkIn, checkOut, guests } })}
        >
          {checkIn && checkOut ? 'Pesan Sekarang' : 'Pilih Tanggal Terlebih Dahulu'}
        </button>

        <button
          className="btn-outline w-full mt-2"
          onClick={() => toggleWishlist(listing.id)}
        >
          🤍 Simpan ke Wishlist
        </button>
      </div>
    </div>
  )
}
```

## 24.6 🧪 Testing Komponen Utama

```jsx
// src/components/listing/ListingCard/__tests__/ListingCard.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import ListingCard from '../ListingCard'

// Wrapper untuk provider yang dibutuhkan
function wrapper({ children }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  )
}

const mockListing = {
  id: 1, title: 'Villa Ubud', location: 'Bali',
  price_per_night: 750000, star_rating: 4.9,
  images: [{ url: '/villa.jpg' }],
}

describe('ListingCard', () => {
  it('menampilkan info listing dengan benar', () => {
    render(<ListingCard listing={mockListing} />, { wrapper })
    expect(screen.getByText('Villa Ubud')).toBeInTheDocument()
    expect(screen.getByText(/Bali/)).toBeInTheDocument()
    expect(screen.getByText(/750.000/)).toBeInTheDocument()
  })

  it('toggle wishlist state saat tombol diklik', async () => {
    render(<ListingCard listing={mockListing} />, { wrapper })
    const wishlistBtn = screen.getByRole('button', { name: /simpan/i })
    fireEvent.click(wishlistBtn)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /tersimpan/i })).toBeInTheDocument()
    })
  })

  it('navigasi ke detail saat card diklik', async () => {
    const { container } = render(<ListingCard listing={mockListing} />, { wrapper })
    fireEvent.click(container.firstChild)
    // Assert URL berubah ke /listing/1
  })
})
```

## 24.7 🚀 Deploy ke Vercel

```bash
# Build production
npm run build
# Output di folder dist/

# Deploy via Vercel CLI
npm install -g vercel
vercel login
vercel --prod

# Atau connect repo GitHub ke vercel.com → auto-deploy setiap push
```

```javascript
// vite.config.js — konfigurasi untuk SPA routing di Vercel
export default {
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
}
```

```json
// vercel.json — redirect semua ke index.html untuk SPA routing
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

> ⚠️ **Penting saat Deploy:**
> Tambahkan semua environment variable (`VITE_API_URL`, dll) di dashboard Vercel.
> Variable dengan prefix `VITE_` otomatis di-expose ke client-side.

## 24.8 📚 Referensi Tambahan

- 🎨 **Design Inspiration** — ambil referensi dari airbnb.com
- 🗺️ **Maps** — mapping: Leaflet + OpenStreetMap (gratis), Mapbox/Google Maps (berbayar)
- 📅 **Date picker** — `react-day-picker` sudah cukup untuk 90% kasus
- 🎬 **Animations** — Framer Motion untuk transisi yang halus
- 🧪 **E2E testing** — Cypress atau Playwright untuk test alur lengkap

## 📌 Penutup

Selamat! 🎉 Jika Anda sudah menyelesaikan semua bab dari 1 hingga 24, berarti Anda sudah menguasai:

| Skill                                | Level      |
| ------------------------------------ | ---------- |
| ✅ React 19 Functional Components    | Mahir      |
| ✅ Hooks (useState, useEffect, useContext, useReducer, useMemo, useCallback, useRef) | Mahir |
| ✅ Custom Hooks                      | Mahir      |
| ✅ Redux Toolkit + RTK Query         | Mahir      |
| ✅ TanStack Query (Server State)     | Mahir      |
| ✅ React Router v6                   | Mahir      |
| ✅ Form Handling (RHF + Zod)         | Mahir      |
| ✅ Pola Desain Komponen              | Mahir      |
| ✅ Testing (Vitest + RTL)            | Mahir      |
| ✅ Deployment (Vercel)               | Mahir      |

Anda siap menjadi **React Developer Profesional** yang dicari industri! 💼

---

🎉 **Terima kasih sudah membaca Ebook React — From Zero to Clone Airbnb!**

Jangan lupa untuk:
- ⭐ Star repository ini jika bermanfaat
- 📢 Share ke teman-teman developer Indonesia
- 💼 Masukkan project Bab 24 ke portfolio Anda
- 🚀 Lanjut belajar ke Ebook Vue / Next.js / dst.

🇮🇩 Selamat berkarya dari Indonesia untuk dunia!
