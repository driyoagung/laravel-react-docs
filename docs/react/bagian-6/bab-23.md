---
title: Bab 23 — Testing React & Best Practices
---

# 📖 Bab 23 — Testing React & Best Practices

## 23.1 🧪 Testing dengan Vitest + React Testing Library

```jsx
// src/components/listing/__tests__/ListingCard.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ListingCard from '../ListingCard'

const mockListing = {
  id:       1,
  title:    'Villa Ubud dengan View Sawah',
  location: 'Ubud, Bali',
  price:    750000,
  rating:   4.9,
  images:   ['/images/villa-ubud.jpg'],
}

describe('ListingCard', () => {
  it('menampilkan judul dan lokasi listing', () => {
    render(<ListingCard listing={mockListing} />)

    expect(screen.getByText('Villa Ubud dengan View Sawah')).toBeInTheDocument()
    expect(screen.getByText(/Ubud, Bali/)).toBeInTheDocument()
  })

  it('menampilkan harga dengan format yang benar', () => {
    render(<ListingCard listing={mockListing} />)
    expect(screen.getByText(/750.000/)).toBeInTheDocument()
  })

  it('memanggil onWishlist saat tombol simpan diklik', async () => {
    const onWishlist = vi.fn()
    render(<ListingCard listing={mockListing} onWishlist={onWishlist} />)

    fireEvent.click(screen.getByRole('button', { name: /simpan/i }))
    expect(onWishlist).toHaveBeenCalledWith(mockListing.id)
  })
})
```

## 23.2 🧪 Testing dengan Provider (Redux/Query)

```jsx
// src/components/listing/__tests__/ListingCard.test.jsx
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

## 23.3 🗂️ Best Practices Struktur Folder

```
src/
├── components/
│   ├── ui/                     ← Komponen generik (tidak domain-spesifik)
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   ├── Button.test.jsx
│   │   │   └── index.js        ← Re-export untuk import yang bersih
│   │   ├── Input/
│   │   ├── Modal/
│   │   └── SkeletonLoader/
│   │
│   ├── listing/                ← Komponen domain listing
│   │   ├── ListingCard/
│   │   ├── ListingGrid/
│   │   ├── ListingMap/
│   │   └── ListingModal/
│   │
│   └── layout/                 ← Komponen tata letak
│       ├── Navbar/
│       └── Footer/
│
├── pages/
│   ├── HomePage/
│   │   ├── HomePage.jsx
│   │   ├── components/         ← Komponen khusus halaman ini (tidak reusable)
│   │   │   ├── HeroSection.jsx
│   │   │   └── CategoryFilter.jsx
│   │   └── index.js
│   ├── SearchPage/
│   └── ListingDetailPage/
│
├── hooks/                      ← Custom hooks (dimulai dengan 'use')
│   ├── useDebounce.js
│   ├── useLocalStorage.js
│   ├── useMediaQuery.js
│   └── useIntersectionObserver.js
│
├── store/                      ← Redux
│   ├── index.js
│   └── slices/
│       ├── authSlice.js
│       ├── searchSlice.js
│       └── cartSlice.js
│
├── services/                   ← API calls (satu file per domain)
│   ├── api.js                  ← Axios instance
│   ├── authService.js
│   ├── listingService.js
│   └── bookingService.js
│
├── context/                    ← React Context
│   └── AuthContext.jsx
│
└── utils/                      ← Fungsi helper murni
    ├── formatters.js           ← formatPrice, formatDate, dll
    ├── validators.js
    └── constants.js
```

## 23.4 🧪 Testing Pyramid

```
            ╱╲
           ╱  ╲         E2E Tests (Cypress, Playwright)
          ╱    ╲        — Test alur user lengkap
         ╱──────╲       — Lambat, expensive, JANGAN banyak
        ╱        ╲
       ╱  Integr ╲      Integration Tests
      ╱   ation   ╲     — Test beberapa unit bekerja bersama
     ╱    Tests    ╲    — Lebih cepat dari E2E
    ╱──────────────╲
   ╱                ╲
  ╱   Unit Tests     ╲   Unit Tests (Vitest, Jest)
 ╱                    ╲  — Test 1 fungsi/komponen terisolasi
╱──────────────────────╲ — Cepat, MURAH — BANYAKKAN ini!
```

## 📌 Ringkasan Bab 23

| Konsep                | Penjelasan Singkat                                              |
| --------------------- | --------------------------------------------------------------- |
| Vitest                 | Test runner cepat, kompatibel Vite                            |
| React Testing Library  | Komponen testing perspektif user (bukan test internal)         |
| `render()`             | Render komponen ke virtual DOM                                |
| `screen.getByRole()`   | Cari element by ARIA role (best practice)                      |
| `fireEvent`            | Trigger event (click, change)                                  |
| `wrapper`              | Bungkus komponen dengan provider yang dibutuhkan              |
| `vi.fn()` / `vi.mock()` | Mock function & module                                       |
| Co-location             | Test di folder yang sama dengan kode                          |
| Testing pyramid         | Banyak unit test, cukup integration, sedikit E2E              |

---

➡️ Lanjut ke [Bagian VII — Project Clone Airbnb](/bagian-7/index)
