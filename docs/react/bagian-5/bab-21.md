---
title: Bab 21 — Axios & API Layer
---

# 📖 Bab 21 — Axios & API Layer

## 21.1 🔧 Setup Axios dengan Interceptor

```javascript
// src/services/api.js
import axios from 'axios'
import { store } from '../store'
import { logout } from '../store/slices/authSlice'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Request Interceptor — tambahkan token ke setiap request
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response Interceptor — handle error global
api.interceptors.response.use(
  (response) => response.data, // Langsung return .data
  (error) => {
    const status = error.response?.status

    if (status === 401) {
      store.dispatch(logout()) // Token expired → logout otomatis
    }

    if (status === 429) {
      console.warn('Rate limit! Coba lagi dalam beberapa saat.')
    }

    return Promise.reject(error)
  }
)

export default api
```

**Penjelasan Axios:**

- **`axios.create()`** — Buat instance dengan config custom.
- **`baseURL`** — Prefix semua URL.
- **`interceptors.request.use`** — Hook SEBELUM request keluar. Inject token.
- **`interceptors.response.use`** — Hook SETELAH response masuk. Handle error global.
- **`status === 401`** — Token invalid/expired. Auto-logout.
- **`status === 429`** — Rate limit. Warn user.

## 21.2 📦 Service Layer Pattern

```javascript
// src/services/listingService.js
import api from './api'

export const listingService = {
  search(filters) {
    return api.get('/listings', { params: filters })
  },

  getById(id) {
    return api.get(`/listings/${id}`)
  },

  create(data) {
    return api.post('/listings', data)
  },

  update(id, data) {
    return api.patch(`/listings/${id}`, data)
  },

  delete(id) {
    return api.delete(`/listings/${id}`)
  },

  // Upload dengan progress tracking
  uploadImage(id, formData, onProgress) {
    return api.post(`/listings/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        const percent = Math.round((e.loaded * 100) / e.total)
        onProgress?.(percent)
      },
    })
  },
}
```

**Penjelasan service:**

- **Object pattern** — Simple. Methods sebagai property.
- **`api.get/post/...`** — HTTP methods.
- **`uploadImage`** — Pakai FormData + `onUploadProgress` untuk progress bar.

## 21.3 ❌ Error Handling Pattern

```javascript
// src/hooks/useApiCall.js
import { useState } from 'react'

export function useApiCall() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  async function call(apiFunction, ...args) {
    try {
      setIsLoading(true)
      setError(null)
      return await apiFunction(...args)
    } catch (err) {
      const message = err.response?.data?.message || err.message
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { call, isLoading, error }
}

// Penggunaan
function CreateListingPage() {
  const { call, isLoading, error } = useApiCall()

  async function handleSubmit(data) {
    try {
      await call(listingService.create, data)
      navigate('/listings')
    } catch {
      // Error sudah di-set
    }
  }
}
```

**Penjelasan pattern:**

- **`useApiCall`** — Hook generic untuk loading & error state.
- **`err.response?.data?.message`** — Pesan error dari API server. Fallback ke `err.message`.

## 21.4 🆕 Fetch API Bawaan (Alternatif)

```javascript
// src/services/api-fetch.js — menggunakan native fetch + TanStack Query
const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token')
  const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.json()
}
```

**Penjelasan:**

- **Native fetch** — Lebih kecil, no extra dep.
- **Pakai dengan TanStack Query** — `queryFn` Anda tinggal panggil `apiFetch`.

## 📌 Ringkasan Bab 21

| Konsep                | Penjelasan Singkat                                              |
| --------------------- | --------------------------------------------------------------- |
| Axios                  | HTTP client dengan API lebih kaya dari fetch                   |
| Interceptor            | Middleware untuk request/response (token, error handling)     |
| Service layer          | Kumpulan API call terpusat per domain                         |
| Error handling         | Global interceptor untuk 401 → logout, 429 → retry            |
| Progress tracking      | `onUploadProgress` untuk upload file                          |
| Alternative            | Native fetch + TanStack Query (lebih ringan)                  |

---

➡️ Lanjut ke [Bagian VI — Level Up](/bagian-6/index)
