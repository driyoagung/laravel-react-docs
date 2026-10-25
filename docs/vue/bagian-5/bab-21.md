# 🌐 Bab 21 — HTTP Request & Integrasi API

> *"API adalah jendela aplikasimu ke dunia luar. Axios adalah kurir yang rapi: ia membawa surat permintaan, mengembalikan jawaban, dan menangani protokol sopan (header, token, error) tanpa kamu repot."*

---

> **🧠 Apa Itu HTTP Request & Integrasi API?**
>
> Aplikasi Vue di browser tidak bisa (dan tidak boleh) menyimpan semua data sendiri. Ia butuh mengambil data dari **server/API** lewat protokol HTTP. **Axios** adalah *library HTTP client* populer yang memudahkan kita mengirim request `GET`, `POST`, `PUT`, `DELETE`, dan menerima response JSON. Fitur paling powerful Axios adalah **interceptor** — fungsi yang menyisipkan logika **sebelum request dikirim** dan **setelah response diterima**. Di bab ini kita menghubungkan store (seperti `movieStore`) ke API eksternal (TMDB) menggunakan Axios + interceptor, plus `fetch` sebagai alternatif bawaan.

---

> **🏗️ Analogi Sederhana:**
>
> Bayangkan aplikasi sebagai **pelanggan di restoran**, API sebagai **dapur**, dan Axios sebagai **pelayan**. Pelanggan (komponen) tidak masuk ke dapur; ia berbisik pesanan ke pelayan (Axios request). Pelayan membawa pesanan ke dapur, lalu kembali dengan makanan (response). **Request interceptor** seperti pelayan yang selalu menambahkan kartu meja (API key) ke setiap pesanan sebelum ke dapur. **Response interceptor** seperti pelayan yang, begitu dapur bilang "pesanan salah" (401/404), langsung mencatatnya ke buku catatan pusat sehingga semua pelanggan tahu — tanpa masing-masing bertanya ulang.

---

## 📋 Daftar Isi Bab 21

1. `fetch` bawaan vs Axios — Mana yang Dipakai?
2. Instalasi & Membuat Instance Axios
3. Method HTTP Dasar (GET, POST, PUT, DELETE)
4. Request Interceptor — Suntik Header & Param Global
5. Response Interceptor — Penanganan Error Terpusat
6. Environment Variables (`.env`) & Keamanan API Key
7. Studi Kasus — `lib/axios.js` TMDB
8. Menggunakan Axios di Composable `useTMDB`
9. Loading & Error State di Komponen
10. Timeout, Cancel Request, & Retry
11. Studi Kasus — Central Error Toast
12. Jebakan Umum Pemula di Bab 21
13. Ringkasan & Latihan Mandiri

---

## ⚔️ `fetch` bawaan vs Axios — Mana yang Dipakai?

Browser modern punya `fetch()` bawaan tanpa install apa pun. Namun Axios punya banyak kemudahan.

```javascript
// ─────────────────────────────────────────────────────────────
// FETCH (bawaan browser) — tanpa dependency
// ─────────────────────────────────────────────────────────────
const res = await fetch('https://api.example.com/movies/123')
const data = await res.json() // harus .json() manual
// Error HTTP (404/500) TIDAK otomatis throw — harus cek res.ok

if (!res.ok) throw new Error('HTTP ' + res.status)

// ─────────────────────────────────────────────────────────────
// AXIOS — butuh install, tapi lebih nyaman
// ─────────────────────────────────────────────────────────────
import axios from 'axios'
const { data } = await axios.get('https://api.example.com/movies/123')
// data langsung JSON, error 404/500 otomatis throw
```

| Fitur | `fetch` | Axios |
| --- | --- | --- |
| Install | 🟢 Tidak perlu | 🔴 Perlu `npm i axios` |
| JSON otomatis | ❌ Manual `.json()` | ✅ Otomatis |
| Error HTTP | 🔴 Tidak throw (cek `res.ok`) | ✅ Otomatis throw |
| Interceptor | ❌ Tidak ada | ✅ Ada (request & response) |
| Timeout | 🟡 Perlu `AbortController` | ✅ Opsi `timeout` langsung |
| Transform data | 🟡 Manual | ✅ Otomatis |
| Rekomendasi | Project kecil / belajar | ✅ Project nyata / API kompleks |

> 💡 **Tips:** Untuk ebook & project Netflix kita, kita pakai **Axios** karena interceptor-nya krusial untuk menyuntikkan API key & menangani error terpusat.

---

## 📦 Instalasi & Membuat Instance Axios

```bash
# Install axios
npm install axios
```

```javascript
// ─────────────────────────────────────────────────────────────
// lib/axios.js — instance khusus TMDB
// ─────────────────────────────────────────────────────────────
import axios from 'axios'

// axios.create() membuat instance TERPISAH dengan config sendiri
const tmdbAxios = axios.create({
  baseURL: 'https://api.themoviedb.org/3', // URL dasar
  timeout: 10000,                          // 10 detik timeout
  headers: { 'Content-Type': 'application/json' },
})

export default tmdbAxios
```

`axios.create()` membuat **instance terpisah** dengan konfigurasi sendiri. Keuntungannya:

| Opsi | Fungsi |
| --- | --- |
| `baseURL` | URL dasar — kita cukup tulis path relatif (`/movie/123`) |
| `timeout` | Batas waktu 10 detik; jika API lambat, request otomatis dibatalkan |
| `headers` | Header default untuk semua request |

> 💡 **Tips:** Menggunakan `axios.create()` dengan `baseURL` menghindari penulisan URL lengkap berulang-ulang dan memudahkan ganti environment (dev/staging/prod).

---

## 🌐 Method HTTP Dasar (GET, POST, PUT, DELETE)

```javascript
import tmdbAxios from '@/lib/axios'

// GET — ambil data
const { data } = await tmdbAxios.get('/trending/movie/week')
// data = response body (sudah JSON)

// POST — kirim data baru
const { data } = await tmdbAxios.post('/reviews', {
  movieId: 123,
  text: 'Keren!',
})

// PUT — update seluruh resource
await tmdbAxios.put('/reviews/5', { text: 'Diperbarui' })

// PATCH — update sebagian
await tmdbAxios.patch('/reviews/5', { rating: 9 })

// DELETE — hapus
await tmdbAxios.delete('/reviews/5')
```

```javascript
// GET dengan query params & config
const { data } = await tmdbAxios.get('/search/movie', {
  params: { query: 'batman', page: 2 }, // → ?query=batman&page=2
})

// Response object lengkap:
// data.status    → 200
// data.statusText→ 'OK'
// data.data      → body JSON (sering kita destructure jadi { data })
// data.headers   → response headers
// data.config    → config request asli
```

| Method | Digunakan untuk | Contoh REST |
| --- | --- | --- |
| `GET` | Baca data | Ambil daftar film |
| `POST` | Buat data baru | Kirim review |
| `PUT` | Ganti seluruh data | Update profil lengkap |
| `PATCH` | Ubah sebagian | Ubah rating saja |
| `DELETE` | Hapus data | Hapus review |

---

## 🔼 Request Interceptor — Suntik Header & Param Global

Request interceptor dijalankan **sebelum setiap request dikirim**. Tempat sempurna menyuntikkan API key, token auth, dan parameter global.

```javascript
// lib/axios.js — lanjutan
// Request Interceptor — dijalankan sebelum setiap request dikirim
tmdbAxios.interceptors.request.use((config) => {
  // Tambahkan API key otomatis ke setiap request
  config.params = {
    ...config.params,                       // jaga param yang sudah ada
    api_key:  import.meta.env.VITE_TMDB_API_KEY,
    language: 'id-ID',                       // respons bahasa Indonesia
  }
  return config
})
```

Request interceptor menerima `config` (konfigurasi request) yang bisa dimodifikasi sebelum dikirim. Di sini kita:

- Menyuntikkan **API key** ke `params` secara otomatis → tidak perlu menulisnya di tiap call.
- Men-set `language: 'id-ID'` agar respons API dalam Bahasa Indonesia.
- Menggabungkan dengan `...config.params` agar params yang sudah ada tidak tertimpa.

```javascript
// Menyuntikkan auth token (jika pakai Bearer token, bukan API key)
tmdbAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

> 🛡️ **Keamanan:** Simpan API key di file `.env` (Vite) sebagai `VITE_TMDB_API_KEY`, **bukan** di source code. Variabel berawalan `VITE_` otomatis terekspos ke browser — jadi gunakan API key bertipe **public/read-only** untuk TMDB, bukan secret server.

---

## 🔽 Response Interceptor — Penanganan Error Terpusat

Response interceptor punya **dua callback**: sukses dan error.

```javascript
// Response Interceptor — dijalankan setelah setiap response diterima
tmdbAxios.interceptors.response.use(
  (response) => response, // Jika sukses, langsung return
  (error) => {
    // Tangani error secara terpusat
    if (error.response?.status === 401) {
      console.error('API Key tidak valid!')
    }
    if (error.response?.status === 404) {
      console.error('Data tidak ditemukan')
    }
    return Promise.reject(error) // ← penting!
  }
)

export default tmdbAxios
```

1. **Sukses** `(response) => response` → teruskan apa adanya.
2. **Error** `(error) => {...}` → tangani error terpusat berdasarkan `status` HTTP:
   - `401` → API key tidak valid / unauthorized.
   - `404` → data tidak ditemukan.
   - `500` → server error.
   - Terakhir `Promise.reject(error)` agar caller tetap bisa `.catch()`.

> ⚠️ **Catatan Penting:** Jangan lupa `return Promise.reject(error)` di callback error. Jika dilewatkan, promise akan dianggap **sukses** dan blok `.catch()` di komponen tidak akan pernah terpanggil.

---

## 🔐 Environment Variables (`.env`) & Keamanan API Key

Vite membaca variabel dari file `.env` di root project.

```bash
# .env  (jangan commit ke Git!)
VITE_TMDB_API_KEY=abc123def456

# .env.local  (juga untuk lokal, di-gitignore)
# VITE_TMDB_API_KEY=...

# Akses di kode:
import.meta.env.VITE_TMDB_API_KEY
```

```javascript
// Aturan penamaan Vite:
// VITE_   → terekspos ke browser (bisa dipakai di front-end)
// tanpa VITE_ → hanya di server, TIDAK bisa di front-end

// ⚠️ JANGAN taruh secret server di sini:
// VITE_STRIPE_SECRET=sk_live_xxx  ← bisa dibaca user! 🔴
```

| Variabel | Terbaca di Browser? | Pemakaian |
| --- | --- | --- |
| `VITE_API_KEY` | ✅ Ya | Public API key (TMDB) |
| `VITE_BASE_URL` | ✅ Ya | Base URL front-end |
| `API_SECRET` | ❌ Tidak | Secret server-side saja |

> 🛡️ **Keamanan:** Front-end (browser) **tidak bisa** menyimpan secret dengan aman. Apa pun di `VITE_*` bisa dilihat user lewat "View Source". Untuk operasi rahasia (pembayaran, admin), lakukan di **back-end** terpisah, dan front-end hanya panggil endpoint itu.

---

## 🎬 Studi Kasus — `lib/axios.js` TMDB

Mari rangkum seluruh setup Axios untuk TMDB dalam satu file utuh.

```javascript
// ─────────────────────────────────────────────────────────────
// lib/axios.js — instance Axios khusus TMDB (LENGKAP)
// ─────────────────────────────────────────────────────────────
import axios from 'axios'

// ① Buat instance dengan baseURL & timeout
const tmdbAxios = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 10000,
})

// ② Request interceptor: suntik API key + bahasa
tmdbAxios.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    api_key:  import.meta.env.VITE_TMDB_API_KEY,
    language: 'id-ID',
  }
  return config
})

// ③ Response interceptor: error terpusat
tmdbAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    if (status === 401) {
      console.error('TMDB: API Key tidak valid')
    } else if (status === 404) {
      console.error('TMDB: Data tidak ditemukan')
    } else if (status >= 500) {
      console.error('TMDB: Server error')
    }
    return Promise.reject(error)
  }
)

export default tmdbAxios
```

```javascript
// Penggunaan di manapun:
import tmdbAxios from '@/lib/axios'

const { data } = await tmdbAxios.get('/trending/movie/week')
// URL penuh: https://api.themoviedb.org/3/trending/movie/week?api_key=...&language=id-ID
// api_key & language disuntik otomatis oleh interceptor ✅
```

🎬 **Studi Kasus Lanjut:** `movieStore.muatTrending()` memanggil `tmdb.trending()`. Di balik layar, request interceptor menyisipkan API key + bahasa, lalu response interceptor memastikan jika status 401 muncul, developer langsung tahu API key bermasalah — tanpa menulis pengecekan di setiap store.

> 📌 **Catatan Penting:** Interceptor menangani hal **global** (auth header, error umum). Logika spesifik tiap fitur (misal "jika 404 tampilkan pesan kosong") tetap ditangani di komponen/store masing-masing lewat `.catch()`.

---

## 🧩 Menggunakan Axios di Composable `useTMDB`

Agar bersih, bungkus axios ke dalam composable `useTMDB`.

```javascript
// composables/useTMDB.js
import { ref } from 'vue'
import tmdbAxios from '@/lib/axios'

export function useTMDB() {
  const isLoading = ref(false)
  const error = ref(null)

  // Wrapper yang tangani loading & error tiap call
  async function jalankan(fn) {
    isLoading.value = true
    error.value = null
    try {
      return await fn()
    } catch (e) {
      error.value = e.message || 'Terjadi kesalahan'
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    trending: () => jalankan(async () => {
      const { data } = await tmdbAxios.get('/trending/movie/week')
      return data.results
    }),
    byGenre: (id) => jalankan(async () => {
      const { data } = await tmdbAxios.get('/discover/movie', {
        params: { with_genres: id, sort_by: 'popularity.desc' },
      })
      return data.results
    }),
    detail: (id) => jalankan(async () => {
      const { data } = await tmdbAxios.get(`/movie/${id}`)
      return data
    }),
    cari: (keyword) => jalankan(async () => {
      const { data } = await tmdbAxios.get('/search/movie', {
        params: { query: keyword },
      })
      return data.results
    }),
  }
}
```

```vue
<!-- BrowseView.vue — pakai composable -->
<script setup>
import { onMounted } from 'vue'
import { useTMDB } from '@/composables/useTMDB'

const { trending, isLoading, error } = useTMDB()

onMounted(async () => {
  await trending()
})
</script>

<template>
  <div v-if="isLoading">⏳ Memuat film...</div>
  <div v-else-if="error">❌ {{ error }}</div>
  <div v-else>
    <MovieRow v-for="f in trending" :key="f.id" :film="f" />
  </div>
</template>
```

---

## 🔄 Loading & Error State di Komponen

Polanya selalu sama: `isLoading`, `error`, lalu `data`. Ini membuat UX jujur (user tahu apa yang terjadi).

```vue
<script setup>
import { ref, onMounted } from 'vue'
import tmdbAxios from '@/lib/axios'

const films = ref([])
const isLoading = ref(false)
const error = ref(null)

async function muat() {
  isLoading.value = true
  error.value = null
  try {
    const { data } = await tmdbAxios.get('/trending/movie/day')
    films.value = data.results
  } catch (e) {
    // Error sudah dilog di interceptor, di sini untuk UI
    error.value = 'Gagal memuat film. Coba lagi nanti.'
  } finally {
    isLoading.value = false
  }
}

onMounted(muat)
</script>

<template>
  <!-- State 1: loading -->
  <div v-if="isLoading" class="skeleton">⏳ Memuat...</div>

  <!-- State 2: error -->
  <div v-else-if="error" class="error">
    ❌ {{ error }}
    <button @click="muat">Coba Lagi</button>
  </div>

  <!-- State 3: kosong -->
  <div v-else-if="films.length === 0">📭 Tidak ada film.</div>

  <!-- State 4: sukses -->
  <div v-else>
    <MovieCard v-for="f in films" :key="f.id" :film="f" />
  </div>
</template>
```

| State | Variabel | UI yang Tepat |
| --- | --- | --- |
| Loading | `isLoading = true` | Spinner / Skeleton |
| Error | `error != null` | Pesan merah + tombol retry |
| Empty | `data.length === 0` | "Tidak ada data" |
| Success | data ada | Render list |

---

## ⏱️ Timeout, Cancel Request, & Retry

```javascript
// Timeout per-request (override instance)
await tmdbAxios.get('/movie/123', { timeout: 5000 })

// Cancel request dengan AbortController (Axios v0.22+)
const controller = new AbortController()
tmdbAxios.get('/search', { signal: controller.signal })
// nanti batalkan:
controller.abort() // membatalkan request yang masih berjalan

// Retry sederhana (manual)
async function denganRetry(fn, max = 3) {
  for (let i = 0; i < max; i++) {
    try {
      return await fn()
    } catch (e) {
      if (i === max - 1) throw e
      await new Promise((r) => setTimeout(r, 1000)) // tunggu 1s
    }
  }
}
```

> 💡 **Tips:** Cancel request berguna saat user mengetik di search box — request lama dibatalkan saat keyword berubah, sehingga tidak ada race condition (response lama menimpa yang baru).

---

## 🔔 Studi Kasus — Central Error Toast

**Skenario:** Alih-alih menampilkan `console.error` di response interceptor, kita tampilkan **toast** (notifikasi kecil) ke user untuk setiap error API. Kita pakai event bus sederhana atau store notifikasi.

```javascript
// stores/notificationStore.js — store untuk toast
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', () => {
  const toasts = ref([])

  function tampilkan(pesan, tipe = 'error') {
    const id = Date.now()
    toasts.value.push({ id, pesan, tipe })
    // auto-hapus setelah 4 detik
    setTimeout(() => hapus(id), 4000)
  }

  function hapus(id) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return { toasts, tampilkan, hapus }
})
```

```javascript
// lib/axios.js — interceptor pakai notificationStore
import axios from 'axios'
import { useNotificationStore } from '@/stores/notificationStore'

const tmdbAxios = axios.create({ baseURL: 'https://api.themoviedb.org/3' })

tmdbAxios.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    api_key: import.meta.env.VITE_TMDB_API_KEY,
    language: 'id-ID',
  }
  return config
})

tmdbAxios.interceptors.response.use(
  (res) => res,
  (error) => {
    // ← pakai store notifikasi (lazy call aman di interceptor)
    const notif = useNotificationStore()
    const status = error.response?.status
    if (status === 401) notif.tampilkan('API Key tidak valid')
    else if (status === 404) notif.tampilkan('Data tidak ditemukan')
    else if (status >= 500) notif.tampilkan('Server sedang bermasalah')
    else notif.tampilkan('Gagal memuat data')
    return Promise.reject(error)
  }
)

export default tmdbAxios
```

```vue
<!-- App.vue — render semua toast -->
<script setup>
import { storeToRefs } from 'pinia'
import { useNotificationStore } from '@/stores/notificationStore'
const { toasts } = storeToRefs(useNotificationStore())
</script>

<template>
  <div class="toast-container">
    <div v-for="t in toasts" :key="t.id" :class="['toast', t.tipe]">
      {{ t.pesan }}
      <button @click="useNotificationStore().hapus(t.id)">✕</button>
    </div>
  </div>
  <RouterView />
</template>
```

**Hasil:** Setiap error API (401/404/500) otomatis muncul sebagai toast di pojok layar — tanpa satu baris `.catch` di komponen mana pun.

---

## ⚡ Concurrent Requests dengan `Promise.all`

Sering kita butuh mengambil **beberapa resource sekaligus** (misal detail film + trailer + review). Lakukan paralel dengan `Promise.all` agar lebih cepat.

```javascript
// useTMDB.detail mengambil detail + video (trailer) paralel
detail: (id) => jalankan(async () => {
  const [detailRes, videoRes] = await Promise.all([
    tmdbAxios.get(`/movie/${id}`),
    tmdbAxios.get(`/movie/${id}/videos`),
  ])
  const trailer = videoRes.data.results.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  )
  return {
    ...detailRes.data,
    trailerKey: trailer?.key,  // ambil hanya YouTube Trailer
  }
})
```

```javascript
// Promise.all — semua harus sukses
try {
  const [trending, populer] = await Promise.all([
    tmdbAxios.get('/trending/movie/day'),
    tmdbAxios.get('/movie/popular'),
  ])
  // keduanya selesai paralel ✅
} catch (e) {
  // jika SATU gagal, seluruh Promise.all reject
}

// Promise.allSettled — tunggu semua, toleran gagal
const hasil = await Promise.allSettled([req1, req2])
// hasil[i].status = 'fulfilled' | 'rejected'
```

| Method | Behavior |
| --- | --- |
| `Promise.all` | Paralel; reject jika satu gagal |
| `Promise.allSettled` | Paralel; tunggu semua, tidak reject |
| `Promise.race` | Selesai dari yang tercepat |

> 💡 **Tips:** `Promise.all` sangat mempercepat halaman yang butuh banyak data independen. Hindari memanggil berurutan (`await a; await b`) kalau datanya tidak saling bergantung.

---

## 📤 Upload File & FormData

Untuk upload file (avatar, poster), gunakan `FormData` bukan JSON.

```javascript
// Composable upload avatar
async function uploadAvatar(file) {
  const form = new FormData()
  form.append('avatar', file)        // field 'avatar' = file

  const { data } = await tmdbAxios.post('/user/avatar', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    // Axios otomatis set boundary untuk multipart
  })
  return data
}
```

```vue
<!-- Input file di komponen -->
<script setup>
async function onFile(e) {
  const file = e.target.files[0]
  if (file) await uploadAvatar(file)
}
</script>

<template>
  <input type="file" accept="image/*" @change="onFile" />
</template>
```

> ⚠️ **Catatan:** Jangan set `'Content-Type': 'application/json'` untuk FormData. Biarkan Axios/browser mengatur `multipart/form-data` dengan `boundary` yang benar, agar server bisa parse file.

---

## 🔧 Axios Defaults & Multiple Instances

Selain instance TMDB, kita bisa punya instance **berbeda** untuk API berbeda (misal payment gateway).

```javascript
// lib/axios.js — dua instance berbeda
import axios from 'axios'

// Instance 1: TMDB
export const tmdbAxios = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 10000,
})

// Instance 2: API internal kita sendiri
export const apiAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
})

// Set default global (berlaku untuk axios murni, bukan instance)
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
```

```javascript
// Interceptor berbeda per instance
apiAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
// tmdbAxios TIDAK pakai token (pakai api_key) — interceptor terpisah
```

| Pendekatan | Kegunaan |
| --- | --- |
| Satu instance | API tunggal (TMDB) |
| Beberapa instance | Multiple API (TMDB + internal + payment) |
| `axios.defaults` | Global default untuk `axios` murni |

---

## 🌍 Environment & Build Considerations

```bash
# .env                 → semua environment (jangan commit secret!)
# .env.development     → saat npm run dev
# .env.production      → saat npm run build
# .env.local           → lokal, di-gitignore
```

```javascript
// Vite mengganti import.meta.env.VITE_* saat build (static)
// Artinya nilai VITE_ terekspos di bundle front-end (lihat browser)
const KEY = import.meta.env.VITE_TMDB_API_KEY

// Base URL berbeda per env
const base = import.meta.env.VITE_API_BASE_URL
// development → http://localhost:3000/api
// production  → https://api.netflix-clone.com
```

```javascript
// Deteksi mode
if (import.meta.env.DEV)  console.log('Mode development')
if (import.meta.env.PROD) console.log('Mode production')
```

> 🛡️ **Keamanan:** Karena `VITE_*` masuk ke bundle, **jangan** taruh secret di sana. Jika butuh operasi rahasia (stripe secret, DB credential), lakukan di **back-end** terpisah dan暴露-kan hanya endpoint aman ke front-end.

---

## 🧯 `AxiosError` & Custom Error Class

Axios melempar error bertipe `AxiosError` dengan properti berguna. Kita bisa membuat class error sendiri untuk pesan ramah user.

```javascript
import axios from 'axios'
import tmdbAxios from '@/lib/axios'

try {
  await tmdbAxios.get('/movie/999999999')
} catch (error) {
  if (axios.isAxiosError(error)) {
    // error adalah AxiosError
    console.log(error.response?.status)  // 404
    console.log(error.response?.data)    // body error dari server
    console.log(error.code)              // 'ERR_BAD_REQUEST'
    console.log(error.message)           // pesan default
  }
}
```

```javascript
// Custom error agar UI dapat pesan lokal
class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
    this.name = 'ApiError'
  }
}

function terjemahkan(error) {
  if (!axios.isAxiosError(error)) return new ApiError(0, 'Jaringan bermasalah')
  const status = error.response?.status
  const map = {
    401: 'Sesi habis, silakan login ulang',
    403: 'Akses ditolak',
    404: 'Data tidak ditemukan',
    500: 'Server sedang gangguan',
  }
  return new ApiError(status, map[status] || 'Terjadi kesalahan')
}
```

| Properti `AxiosError` | Isi |
| --- | --- |
| `response.status` | HTTP status (404, 500, ...) |
| `response.data` | Body response error |
| `code` | Kode internal (`ERR_NETWORK`, dll) |
| `message` | Pesan bawaan |

---

## 🔁 Retry Interceptor (Coba Ulang Otomatis)

Kita bisa membuat **response interceptor** yang otomatis mengulang request gagal (misal network error sementara) sebelum memberikan error ke komponen.

```javascript
// lib/axios.js — retry otomatis maksimal 2x
tmdbAxios.interceptors.response.use(
  (res) => res,
  async (error) => {
    const config = error.config
    // inisialisasi counter retry
    config.__retryCount = config.__retryCount ?? 0

    // hanya retry untuk network error / 5xx, maksimal 2
    const bisaRetry =
      config.__retryCount < 2 &&
      (!error.response || error.response.status >= 500)

    if (bisaRetry) {
      config.__retryCount += 1
      // tunggu 1 detik sebelum retry
      await new Promise((r) => setTimeout(r, 1000))
      // ulangi request dengan config yang sama
      return tmdbAxios(config)
    }

    return Promise.reject(error) // lewat ke error handler biasa
  }
)
```

> ⚠️ **Catatan:** Jangan retry untuk `4xx` (400/401/404) — itu error klien yang tidak akan berubah walau diulang. Hanya retry `5xx` (server) dan network error.

---

## 🍪 `withCredentials` & CSRF Protection

Saat API butuh cookie session (bukan token), aktifkan `withCredentials`. Untuk CSRF, kirim token lewat header.

```javascript
// Kirim cookie lintas-origin (butuh server izinkan CORS dengan credentials)
const apiAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,  // sertakan cookie HttpOnly saat request
})

// CSRF token dari meta tag (pola Laravel/Django)
apiAxios.interceptors.request.use((config) => {
  const token = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute('content')
  if (token) {
    config.headers['X-CSRF-TOKEN'] = token
  }
  return config
})
```

```javascript
// Axios transformResponse — ubah bentuk data sebelum ke komponen
const tmdbAxios = axios.create({
  transformResponse: [(data) => {
    // data masih string mentah; parse & bentuk ulang
    try {
      const parsed = JSON.parse(data)
      return { ...parsed, diambilPada: Date.now() }
    } catch {
      return data
    }
  }],
})
```

| Opsi | Fungsi |
| --- | --- |
| `withCredentials: true` | Sertakan cookie session (CORS credentials) |
| Header `X-CSRF-TOKEN` | Lindungi dari CSRF (butuh token dari server) |
| `transformResponse` | Modifikasi response sebelum sampai caller |

> 🛡️ **Keamanan:** `withCredentials: true` **harus** dipasangkan dengan server yang mengizinkan origin spesifik (bukan `*`). Jika tidak, cookie bisa bocor ke origin asing.

---

## 📊 Tabel Status HTTP & Kapan Terjadi

Memahami status HTTP membantu menangani error dengan tepat di response interceptor.

| Status | Nama | Kapan Terjadi | Tindakan UI |
| --- | --- | --- | --- |
| `200` | OK | Sukses GET/POST | Tampilkan data |
| `201` | Created | Sukses membuat resource | Konfirmasi "berhasil dibuat" |
| `204` | No Content | Sukses tapi kosong | Tidak ada body |
| `301/302` | Redirect | URL pindah | Biarkan Axios/browser urus |
| `400` | Bad Request | Input tidak valid | Tampilkan pesan validasi |
| `401` | Unauthorized | Token invalid/kadaluarsa | Arahkan ke login |
| `403` | Forbidden | Tidak punya akses | "Akses ditolak" |
| `404` | Not Found | Resource tidak ada | "Tidak ditemukan" |
| `409` | Conflict | Bentrok (duplikat) | "Sudah ada" |
| `422` | Unprocessable | Validasi server gagal | Tampilkan error field |
| `429` | Too Many Requests | Rate limit | "Coba lagi nanti" |
| `500` | Server Error | Bug di server | "Gangguan server" + retry |
| `502/503` | Bad Gateway | Server mati/maintenance | "Layanan tidak tersedia" |
| `timeout` | (network) | Server lambat > timeout | "Koneksi timeout" + retry |

```javascript
// Mapping status ke pesan ramah (dipakai interceptor)
const PESAN = {
  400: 'Permintaan tidak valid',
  401: 'Sesi habis, silakan login',
  403: 'Akses ditolak',
  404: 'Data tidak ditemukan',
  409: 'Data sudah ada',
  429: 'Terlalu banyak permintaan, coba lagi',
  500: 'Server sedang gangguan',
}
```

> 💡 **Tips:** Tangani `4xx` dengan pesan spesifik ke user, `5xx`/`timeout` dengan opsi retry. Jangan pernah mengabaikan error — minimal tampilkan toast (studi kasus central toast di atas).

---

## 🧭 Pola Service/Repository Layer — Memisahkan API dari Komponen

Menaruh `tmdbAxios.get('/movie/...')` langsung di komponen membuat komponen "tahu terlalu banyak" tentang bentuk API. Pola **service layer** (atau repository) mengumpulkan semua endpoint ke satu tempat, sehingga komponen cukup memanggil fungsi bermakna.

```javascript
// ❌ CARA SALAH: URL & bentuk response tersebar di banyak komponen
// BrowseView.vue
const { data } = await tmdbAxios.get('/trending/movie/week')
const films = data.results // komponen harus tahu ada ".results"

// SearchView.vue
const { data } = await tmdbAxios.get('/search/movie', { params: { query: k } })
const hasil = data.results // ...diulang lagi, ".results" tersebar
// Kalau TMDB ubah struktur → semua komponen harus diperbaiki 😱
```

```javascript
// ✅ CARA BENAR: service layer terpusat
// services/movieService.js
import tmdbAxios from '@/lib/axios'

export const movieService = {
  // Tiap method mengembalikan data yang SUDAH bersih (tanpa .results dll)
  async getTrending() {
    const { data } = await tmdbAxios.get('/trending/movie/week')
    return data.results
  },
  async search(keyword, page = 1) {
    const { data } = await tmdbAxios.get('/search/movie', {
      params: { query: keyword, page },
    })
    return { film: data.results, totalHalaman: data.total_pages }
  },
  async getDetail(id) {
    const { data } = await tmdbAxios.get(`/movie/${id}`)
    return data
  },
}
```

```vue
<!-- Komponen jadi bersih & tak tahu detail HTTP -->
<script setup>
import { movieService } from '@/services/movieService'
const films = ref([])
onMounted(async () => {
  films.value = await movieService.getTrending() // bermakna & rapi ✅
})
</script>
```

```
LAPISAN ARSITEKTUR (dari bawah ke atas):

lib/axios.js       → konfigurasi HTTP mentah (baseURL, interceptor)
      ↑
services/*.js      → endpoint bermakna (getTrending, search, getDetail)
      ↑
stores/*.js        → state + panggil service + cache
      ↑
composables/*.js   → logika reusable (loading, debounce)
      ↑
components/*.vue    → hanya tampilan, panggil store/composable
```

| Lapisan | Tanggung Jawab | Tahu tentang HTTP? |
| --- | --- | --- |
| `lib/axios` | Config & interceptor | ✅ Penuh |
| `services` | Endpoint + bentuk data | ✅ Ya |
| `stores` | State + cache | 🟡 Lewat service |
| `components` | Tampilan | ❌ Tidak sama sekali |

> 💡 **Tips:** Keuntungan terbesar service layer: saat API berubah (ganti dari TMDB ke API lain, atau struktur response berubah), kamu hanya edit `services/`, **bukan** puluhan komponen. Ini disebut *single source of truth* untuk komunikasi API.

---

## 📄 Pagination & Infinite Scroll — Mengambil Data Bertahap

API jarang mengirim semua data sekaligus; ia memakai **pagination** (halaman). Ada dua pola UI: tombol "Halaman Berikutnya" dan **infinite scroll** (muat otomatis saat scroll ke bawah).

```javascript
// services/movieService.js — endpoint mendukung page
async function getPopular(page = 1) {
  const { data } = await tmdbAxios.get('/movie/popular', { params: { page } })
  return {
    film: data.results,
    halaman: data.page,
    totalHalaman: data.total_pages,
  }
}
```

```javascript
// composables/useInfiniteMovies.js — akumulasi hasil tiap halaman
import { ref } from 'vue'
import { movieService } from '@/services/movieService'

export function useInfiniteMovies() {
  const film = ref([])          // akumulasi SEMUA halaman
  const halaman = ref(0)
  const totalHalaman = ref(1)
  const isLoading = ref(false)

  async function muatBerikutnya() {
    // ① jangan muat kalau sedang loading atau sudah habis
    if (isLoading.value || halaman.value >= totalHalaman.value) return

    isLoading.value = true
    try {
      const next = halaman.value + 1
      const hasil = await movieService.getPopular(next)
      // ② TAMBAHKAN (bukan ganti) ke daftar yang sudah ada
      film.value.push(...hasil.film)
      halaman.value = hasil.halaman
      totalHalaman.value = hasil.totalHalaman
    } finally {
      isLoading.value = false
    }
  }

  return { film, halaman, totalHalaman, isLoading, muatBerikutnya }
}
```

```vue
<!-- Infinite scroll dengan IntersectionObserver -->
<script setup>
import { onMounted, ref } from 'vue'
import { useInfiniteMovies } from '@/composables/useInfiniteMovies'

const { film, isLoading, muatBerikutnya } = useInfiniteMovies()
const sentinel = ref(null) // elemen "penanda" di bawah list

onMounted(() => {
  muatBerikutnya() // muat halaman pertama
  // Observer: saat sentinel terlihat → muat halaman berikutnya
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) muatBerikutnya()
  })
  observer.observe(sentinel.value)
})
</script>

<template>
  <MovieCard v-for="f in film" :key="f.id" :film="f" />
  <div ref="sentinel" style="height: 1px"></div> <!-- pemicu -->
  <p v-if="isLoading">⏳ Memuat lagi...</p>
</template>
```

| Pola | Kelebihan | Kekurangan |
| --- | --- | --- |
| Tombol halaman | Jelas posisi, mudah bookmark | Butuh klik manual |
| Infinite scroll | Mulus, cocok mobile | Sulit ke footer, boros memori |
| "Muat lebih banyak" | Kompromi keduanya | Tetap manual |

> ⚠️ **Catatan:** Pada infinite scroll, gunakan `push(...)` untuk **menambah** ke array (akumulasi), bukan menimpanya. Menimpa (`film.value = hasil.film`) akan menghapus item halaman sebelumnya. Selalu jaga penanda `halaman` & `totalHalaman` agar tidak request melewati halaman terakhir.

---

## 🧪 Testing Layer HTTP — Mock Axios

Kode yang memanggil API tidak boleh benar-benar menembak jaringan saat di-test (lambat, flaky, butuh internet). Kita **mock** axios dengan Vitest.

```javascript
// services/movieService.spec.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import tmdbAxios from '@/lib/axios'
import { movieService } from '@/services/movieService'

// ① Mock seluruh modul axios instance
vi.mock('@/lib/axios')

describe('movieService', () => {
  beforeEach(() => {
    vi.clearAllMocks() // reset mock tiap test
  })

  it('getTrending mengembalikan array results', async () => {
    // ② Atur agar tmdbAxios.get mengembalikan data palsu
    tmdbAxios.get.mockResolvedValue({
      data: { results: [{ id: 1, title: 'Test Film' }] },
    })

    const hasil = await movieService.getTrending()

    // ③ Verifikasi service memanggil endpoint yang benar
    expect(tmdbAxios.get).toHaveBeenCalledWith('/trending/movie/week')
    // ④ Verifikasi ia membersihkan ".results"
    expect(hasil).toEqual([{ id: 1, title: 'Test Film' }])
  })

  it('search mengirim params query & page', async () => {
    tmdbAxios.get.mockResolvedValue({
      data: { results: [], total_pages: 5 },
    })

    const hasil = await movieService.search('batman', 2)

    expect(tmdbAxios.get).toHaveBeenCalledWith('/search/movie', {
      params: { query: 'batman', page: 2 },
    })
    expect(hasil.totalHalaman).toBe(5)
  })

  it('melempar error saat request gagal', async () => {
    // ⑤ Simulasikan penolakan (rejected promise)
    tmdbAxios.get.mockRejectedValue(new Error('Network Error'))

    await expect(movieService.getTrending()).rejects.toThrow('Network Error')
  })
})
```

| Helper Vitest | Fungsi |
| --- | --- |
| `vi.mock('modul')` | Ganti seluruh modul dengan mock otomatis |
| `.mockResolvedValue(x)` | Buat fungsi async mengembalikan `x` (sukses) |
| `.mockRejectedValue(e)` | Buat fungsi async menolak dengan error `e` |
| `toHaveBeenCalledWith(...)` | Cek argumen pemanggilan |
| `vi.clearAllMocks()` | Reset semua mock antar test |

> 💡 **Tips:** Dengan memisahkan service layer (bagian sebelumnya), testing HTTP jadi jauh lebih mudah — kamu cukup mock `tmdbAxios` dan menguji apakah service memanggil endpoint & memproses data dengan benar, **tanpa** menyentuh komponen atau jaringan sungguhan.

---

## 🔐 Refresh Token & Interceptor Auth (401 Auto-Retry)

Skenario nyata: token login **kedaluwarsa** (expire) setelah 1 jam. Saat user tetap di aplikasi, request berikutnya dapat `401`. Alih-alih paksa logout, kita bisa **refresh token otomatis** di response interceptor.

```javascript
// lib/axios.js — auto-refresh saat dapat 401
let sedangRefresh = false
let antrian = [] // request yang ditunda saat refresh berjalan

tmdbAxios.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config

    // ① Hanya tangani 401 yang BELUM dicoba ulang
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true

      // ② Jika sedang refresh, antrikan request ini
      if (sedangRefresh) {
        return new Promise((resolve) => {
          antrian.push(() => resolve(tmdbAxios(original)))
        })
      }

      sedangRefresh = true
      try {
        // ③ Panggil endpoint refresh (pakai refresh token di cookie)
        const { data } = await axios.post('/auth/refresh')
        localStorage.setItem('token', data.token)

        // ④ Ulangi request asli dengan token baru
        antrian.forEach((fn) => fn())
        antrian = []
        return tmdbAxios(original)
      } catch {
        // ⑤ Gagal refresh → logout
        useAuthStore().logout()
        return Promise.reject(error)
      } finally {
        sedangRefresh = false
      }
    }

    return Promise.reject(error)
  }
)
```

| Tahap | Penjelasan |
| --- | --- |
| `401` & belum retry | Masuk logika refresh |
| `sedangRefresh` true | Antrikan request lain (hindari refresh ganda) |
| Refresh sukses | Ulangi request asli + jalankan antrian |
| Refresh gagal | Logout user |

> ⚠️ **Catatan:** Pola ini **kompleks** — untuk project nyata, gunakan library seperti `axios-auth-refresh` atau `vue-auth`. Intinya: jangan biarkan user logout tiap kali token expire; refresh di belakang layar.

---

## 📦 Request Cancellation Patterns (AbortController + Composable)

Saat user mengetik di search, request lama harus **dibatalkan** agar response lama tidak menimpa yang baru (race condition).

```javascript
// composables/useSearchMovies.js
import { ref } from 'vue'
import tmdbAxios from '@/lib/axios'

export function useSearchMovies() {
  const hasil = ref([])
  const isLoading = ref(false)
  let controller = null // simpan AbortController aktif

  async function cari(keyword) {
    // ① Batalkan request SEBELUMNYA jika masih jalan
    if (controller) controller.abort()

    // ② Buat controller baru untuk request ini
    controller = new AbortController()

    if (!keyword) { hasil.value = []; return }

    isLoading.value = true
    try {
      const { data } = await tmdbAxios.get('/search/movie', {
        params: { query: keyword },
        signal: controller.signal, // ← ikat ke controller
      })
      hasil.value = data.results
    } catch (e) {
      // AbortError muncul saat kita panggil abort() — abaikan
      if (e.name !== 'CanceledError' && e.code !== 'ERR_CANCELED') {
        console.error(e)
      }
    } finally {
      isLoading.value = false
    }
  }

  return { hasil, isLoading, cari }
}
```

```vue
<!-- SearchView.vue -->
<script setup>
import { watch } from 'vue'
import { useSearchMovies } from '@/composables/useSearchMovies'

const { hasil, isLoading, cari } = useSearchMovies()
const keyword = ref('')

// Setiap keyword berubah → cari() (request lama otomatis dibatalkan)
watch(keyword, (k) => cari(k))
</script>
```

| Pola | Kelebihan |
| --- | --- |
| `AbortController` manual | Kontrol penuh, cancel eksplisit |
| Debounce + cancel | Kombinasi terbaik (Bab 14 + Bab 23) |
| `axios.CancelToken` (lama) | ❌ Deprecated, jangan pakai |

> 💡 **Tips:** Axios v0.22+ merekomendasikan `AbortController` (standar web)而不是 `CancelToken` lama. Error pembatalan dikenali lewat `e.code === 'ERR_CANCELED'`.

---

## 🧮 Caching Response (In-Memory & Store)

API yang sama tidak perlu ditembak berulang. Kita bisa **cache** response di memory (atau store) agar panggilan kedua instan.

```javascript
// lib/cache.js — cache sederhana di memory
const cache = new Map() // key → { data, expiry }

export function getCache(key) {
  const item = cache.get(key)
  if (!item) return null
  if (item.expiry < Date.now()) {
    cache.delete(key) // kadaluarsa → hapus
    return null
  }
  return item.data
}

export function setCache(key, data, ttlMs = 60000) {
  cache.set(key, { data, expiry: Date.now() + ttlMs })
}
```

```javascript
// Pakai di composable
async function trending() {
  const key = 'trending-week'
  const cached = getCache(key)
  if (cached) return cached // ← langsung kembalikan (tanpa network)

  const { data } = await tmdbAxios.get('/trending/movie/week')
  setCache(key, data.results) // ← simpan untuk panggilan berikutnya
  return data.results
}
```

| Tempat Cache | Cocok Untuk | Awet |
| --- | --- | --- |
| Variabel `Map` (module) | Satu sesi, data publik | Sampai refresh |
| Pinia store | Data user-specific | Sampai logout |
| `localStorage` | Offline / refresh | Permanen (sampai dihapus) |

> 💡 **Tips:** Cache hanya untuk data yang **tidak sering berubah** (trending mingguan, daftar genre). Jangan cache data yang personal/realtime (saldo, notifikasi).

---

## 🪄 Transform Request/Response Data

Axios membiarkan kita mengubah bentuk data **sebelum dikirim** (`transformRequest`) dan **setelah diterima** (`transformResponse`).

```javascript
const tmdbAxios = axios.create({
  // Ubah request body sebelum ke wire (jarang dipakai)
  transformRequest: [(data) => {
    if (!data) return data
    return JSON.stringify({ ...data, sumber: 'frontend' })
  }],
  // Ubah response sebelum sampai caller
  transformResponse: [(data) => {
    try {
      const parsed = JSON.parse(data)
      // Tambah field turunan agar komponen tak perlu hitung
      return { ...parsed, diambilPada: Date.now() }
    } catch {
      return data
    }
  }],
})
```

```javascript
// Contoh lain: normalisasi error message dari berbagai API
tmdbAxios.interceptors.response.use(
  (res) => res,
  (error) => {
    // Banyak API mengembalikan error di .message atau .error
    const msg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message
    return Promise.reject(new Error(msg))
  }
)
```

| Transform | Kapan |
| --- | --- |
| `transformRequest` | Tambah wrapper field, ubah format body |
| `transformResponse` | Normalisasi struktur, tambah metadata |
| Interceptor error | Seragamkan pesan error |

> ⚠️ **Catatan:** `transformResponse` berjalan **sebelum** interceptor response. Jika sudah pakai `transformResponse`, jangan duplikasi logic di interceptor.

---

## 📡 WebSockets vs HTTP — Kapan Pakai Apa

HTTP (request-response) bukan satu-satunya cara berkomunikasi. Untuk data **real-time**, ada WebSocket.

```
HTTP (Axios):
  Client → "Beri aku film trending" → Server
  Server → "Ini datanya" → Client
  (koneksi tutup, butuh request baru utk update)

WebSocket:
  Client ⇄ Server (koneksi TERBUKA terus)
  Server bisa kirim data SEWAKTU tanpa diminta
  (chat, notifikasi live, harga saham, progress upload)
```

| Aspek | HTTP (Axios) | WebSocket |
| --- | --- | --- |
| Pola | Request → Response | Koneksi dua arah persisten |
| Real-time push | ❌ Perlu polling | ✅ Server push langsung |
| Overhead | Rendah per call | Tinggi di setup awal |
| Cocok untuk | REST API, fetch data | Chat, notif, live update |
| Library Vue | Axios/fetch | `socket.io`, `ws` |

> 💡 **Tips:** Untuk Netflix clone, gunakan **HTTP** untuk ambil daftar film (cukup fetch saat dibutuhkan). Gunakan **WebSocket** hanya bila ada fitur chat/komentar live. Jangan pakai WebSocket untuk data yang cukup di-fetch sekali.

---

## 🧪 Mocking with MSW (Mock Service Worker)

Saat backend belum siap, kita bisa **mock API di level network** pakai MSW — sehingga kode Axios tetap asli, tapi response datang dari "server tiruan" di browser.

```javascript
// mocks/handlers.js
import { http, HttpResponse } from 'msw'

export const handlers = [
  // Tangkap GET /trending/movie/week → kembalikan data tiruan
  http.get('https://api.themoviedb.org/3/trending/movie/week', () => {
    return HttpResponse.json({
      results: [
        { id: 1, title: 'Interstellar', vote_average: 8.6 },
        { id: 2, title: 'Inception', vote_average: 8.3 },
      ],
    })
  }),
]
```

```javascript
// mocks/browser.js
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'
export const worker = setupWorker(...handlers)

// main.js — jalankan SEBELUM app mount (mode dev saja)
async function start() {
  if (import.meta.env.DEV) {
    await worker.start({ onUnhandledRequest: 'bypass' })
  }
  app.mount('#app')
}
start()
```

| MSW vs `vi.mock` | Kelebihan |
| --- | --- |
| `vi.mock` (Vitest) | Untuk unit test, cepat, terisolasi |
| MSW | Untuk dev manual & E2E, kode Axios tak diubah sama sekali |

> 💡 **Tips:** MSW sangat berguna saat **frontend & backend dikembangkan paralel**. Frontend pakai kontrak API (endpoint & shape JSON) yang disepakati, backend mengisinya nanti — tanpa mengubah satu baris kode Axios.

---

## 🛡️ Keamanan API: HTTPS, CORS, & Secret

Integrasi API menuntut pemahaman keamanan dasar agar aplikasi tidak rentan.

```
═══════════════════════════════════════════════
HTTP  vs  HTTPS
═══════════════════════════════════════════════
HTTP  → data KIRIMAN TERBACA (bisa disadap)   🔴
HTTPS → data DIENKRIPSI (aman di transfer)      🟢

SELALU gunakan HTTPS untuk API produksi!
```

| Masalah | Penjelasan | Mitigasi |
| --- | --- | --- |
| **CORS** | Browser blokir request lintas-origin | Server set `Access-Control-Allow-Origin` |
| **Secret di `VITE_`** | Terbaca di bundle browser | Pindah ke back-end |
| **Token di localStorage** | Rentan XSS | Gunakan HttpOnly cookie (withCredentials) |
| **HTTP (bukan S)** | Data disadap | Pakai HTTPS |

```javascript
// ❌ SALAH: API key RAHASIA di VITE_ → bisa dibaca user
// VITE_STRIPE_SECRET=sk_live_xxx   ← jangan!

// ✅ BENAR: hanya public key di VITE_, secret di server
// VITE_TMDB_API_KEY=pub_xxx         ← aman (read-only key)
//
// Backend (Node/Express) menyimpan secret:
// const SECRET = process.env.STRIPE_SECRET  ← tidak ke browser
```

> 🛡️ **Keamanan:** Aturan emas — **apa pun yang ada di browser bisa dilihat user**. Axios, interceptor, `VITE_*` — semuanya terlihat di DevTools. Untuk operasi berbahaya (pembayaran, admin), selalu lewat **back-end terpisah** yang memegang secret. Front-end hanya panggil endpoint aman.

---

## 🚨 Jebakan Umum Pemula di Bab 21

### ❌ Jebakan 1 — Lupa `Promise.reject` di Response Interceptor
```javascript
// ❌ SALAH — .catch() di komponen tidak pernah jalan
(error) => {
  console.error(error)
  // lupa return Promise.reject(error)
}

// ✅ BENAR
(error) => {
  console.error(error)
  return Promise.reject(error)
}
```

---

### ❌ Jebakan 2 — Hardcode API Key di Source
```javascript
// ❌ SALAH — key kelihatan di Git/brauzer
const key = 'abc123' // commit ke repo = bocor

// ✅ BENAR — di .env
const key = import.meta.env.VITE_TMDB_API_KEY
```

---

### ❌ Jebakan 3 — Lupa `.json()` pada fetch
```javascript
// ❌ SALAH — data mentah Response object
const res = await fetch(url)
const film = res // bukan JSON!

// ✅ BENAR
const res = await fetch(url)
if (!res.ok) throw new Error('HTTP ' + res.status)
const film = await res.json()
```

---

### ❌ Jebakan 4 — Tidak Cek `error.response` (bisa undefined)
```javascript
// ❌ SALAH — error.response undefined saat network error
if (error.response.status === 404) { }

// ✅ BENAR — optional chaining
if (error.response?.status === 404) { }
```

---

### ❌ Jebakan 5 — Race Condition di Search Tanpa Cancel
```javascript
// ❌ SALAH — response lama bisa nimpa yang baru
watch(keyword, async (k) => { hasil.value = await cari(k) })

// ✅ BENAR — cancel request lama (atau pakai debounce, Bab 14)
// gunakan AbortController / useDebounce
```

---

### ❌ Jebakan 6 — Memanggil `useAuthStore()` di Dalam Interceptor Tanpa Guard

```javascript
// ❌ SALAH — interceptor di-level module, Pinia belum aktif
import { useNotificationStore } from '@/stores/notificationStore'
// useNotificationStore() dipanggil saat lib/axios.js di-import
// → bisa "no active Pinia" saat import order salah

// ✅ BENAR — panggil DI DALAM callback (saat runtime)
tmdbAxios.interceptors.response.use(
  (res) => res,
  (error) => {
    const notif = useNotificationStore() // ← aman, jalan saat error
    notif.tampilkan('Gagal memuat')
    return Promise.reject(error)
  }
)
```

> ✅ **Solusi:** Di dalam interceptor, `useXStore()` aman karena interceptor jalan **saat runtime** (setelah `app.use(pinia)`). Masalah muncul bila dipanggil di **level module** file yang di-import lebih dulu dari `main.js`.

---

### ❌ Jebakan 7 — Tidak Membatalkan Request Saat Komponen Di-unmount

```javascript
// ❌ SALAH — request jalan terus walau komponen sudah hilang
// setState pada komponen yang sudah unmount → warning/error
onMounted(async () => {
  films.value = (await tmdbAxios.get('/trending')).data
}) // kalau user pindah halaman cepat → update komponen mati

// ✅ BENAR — pakai AbortController + onUnmounted
let controller
onMounted(() => {
  controller = new AbortController()
  tmdbAxios.get('/trending', { signal: controller.signal })
    .then(({ data }) => (films.value = data))
    .catch(() => {})
})
onUnmounted(() => controller?.abort()) // ← batalkan saat keluar
```

> ✅ **Solusi:** Untuk request yang dimulai di `onMounted`, selalu sediakan cara membatalkannya di `onUnmounted` (terutama di Vue Router yang sering ganti halaman).

---

## 📝 Ringkasan Bab 21

| Konsep | Penjelasan |
| --- | --- |
| **`fetch` vs Axios** | Axios lebih nyaman (JSON auto, interceptor, error throw) |
| **`axios.create()`** | Instance dengan `baseURL` & `timeout` sendiri |
| **GET/POST/PUT/DELETE** | Method HTTP standar REST |
| **Request interceptor** | Suntik API key, token, param global sebelum kirim |
| **Response interceptor** | Error terpusat (401/404/500) — wajib `Promise.reject` |
| **`.env` / `VITE_`** | Simpan public key, hindari secret di front-end |
| **Composable** | Bungkus axios jadi `useTMDB()` yang rapi |
| **Loading/Error state** | Pola `isLoading` + `error` + `data` di UI |
| **Cancel/Retry** | `AbortController` cegah race condition |
| **Central toast** | Interceptor panggil `notificationStore` |

---

## 🎯 Latihan Mandiri

**⭐ Latihan 1 — Instance Axios**
Buat `lib/axios.js` dengan `axios.create({ baseURL, timeout: 8000 })`. Lakukan `GET` ke endpoint publik (misal `https://jsonplaceholder.typicode.com/posts`) dan tampilkan hasilnya.

**⭐⭐ Latihan 2 — Request Interceptor**
Tambahkan request interceptor yang menyuntikkan `params.api_key = import.meta.env.VITE_DEMO_KEY` ke setiap request (buat `.env` dengan nilai dummy). Verifikasi lewat console bahwa param terkirim.

**⭐⭐⭐ Latihan 3 — Response Interceptor + Error State**
Buat response interceptor yang menangani 404 & 500 (log ke console). Di komponen, lakukan GET ke URL yang salah, pastikan `error` state tampil dan `.catch()` jalan (cek `Promise.reject`).

**⭐⭐⭐⭐ Latihan 4 — Central Toast + Composable**
Gabungkan: buat `notificationStore`, response interceptor yang memanggil `tampilkan()` untuk tiap error, dan `useTMDB` composable. Tampilkan toast di `App.vue` saat terjadi error API pada saat fetch data film.

---

*Lanjut ke ➡️ **Bab 22 — 🧩 Komponen Lanjutan & Teknik Khusus***
