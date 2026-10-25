# 🧠 Bab 16 — Composable Lanjutan & Patterns

> *"Sebuah composable yang baik tidak sekadar menyimpan state — ia merangkum sebuah 'pola pikir': bagaimana menangani loading, error, konfigurasi, dan optimasi, sehingga komponen di atasnya tinggal menikmati hasilnya tanpa peduli detailnya."*

---

> **🧠 Apa Itu Composable Lanjutan?**
>
> Setelah menguasai composable dasar (`useFetch`, `useDebounce`) dan template ref, kita kini masuk ke **composable tingkat produksi**: composable yang menggabungkan beberapa konsep sekaligus — setup *HTTP client* terpusat (axios), *wrapper* async yang menangani loading/error secara sentral, banyak *endpoint* dalam satu fungsi, serta pola *separation of concerns*. Di bab ini kita membangun **`useTMDB`** lengkap untuk seluruh kebutuhan API Netflix-clone, lalu mempelajari pola **`useLocalStorage`** sebagai contoh kedua.

---

> **🏗️ Analogi Sederhana:**
>
> Kalau composable dasar seperti satu alat (misal: obeng), maka composable lanjutan seperti **kotak peralatan lengkap** (toolbox) yang sudah berisi obeng, tang, dan bor, dengan petunjuk penggunaan rapi di dalamnya. `useTMDB` adalah toolbox yang bilang: *"Mau cari film? Ambil fungsi `cari`. Mau detail? Ambil `detail`. Semua sudah kusiapkan kabel API-nya, kutangani error-nya, tinggal panggil."* Komponen tinggal jadi "tukang" yang menggunakan toolbox — tanpa harus tahu cara memasang kabel listrik ke TMDB.

---

## 📋 Daftar Isi Bab 16

1. Evolusi dari `useFetch` ke `useTMDB`
2. Setup Axios Client Terpusat
3. Environment Variable & Keamanan API Key
4. `useTMDB` — Kode Lengkap + Komentar Baris
5. Pola Wrapper Async `jalankan()`
6. Endpoint `trending`, `cari`, `detail`, `byGenre`
7. Optimasi dengan `Promise.all`
8. Penggunaan `useTMDB` di Komponen
9. Pattern: API Client Terpusat
10. Pattern: Separation of Concerns (File Terpisah)
11. 📦 Contoh Kedua: `useLocalStorage` Composable
12. Penjelasan `useLocalStorage` Baris per Baris
13. Composable dengan State Global (Singleton)
14. 🎬 Studi Kasus: Integrasi `useTMDB` + `useDebounce` + `useLocalStorage`
15. 🚨 Jebakan Umum Pemula di Bab 16
16. 📝 Ringkasan Bab 16
17. 🎯 Latihan Mandiri

---

## 🔬 1. Evolusi dari `useFetch` ke `useTMDB`

Mari lihat mengapa kita butuh composable yang lebih kaya daripada `useFetch` mentah.

```
useFetch (Bab 14):
  ✅ Generic — bisa fetch URL apa pun
  ❌ Tidak tahu soal TMDB (harus tulis api_key tiap call)
  ❌ Tidak punya endpoint spesifik (trending/cari/detail)
  ❌ Tidak mengelola baseURL secara sentral

useTMDB (Bab 16):
  ✅ Sudah tahu baseURL + api_key TMDB
  ✅ Punya endpoint siap pakai: trending(), cari(), detail(), byGenre()
  ✅ Satu indikator loading/error untuk semua endpoint
  ✅ Terintegrasi dengan axios (interceptor, timeout, dll)
```

`useTMDB` pada dasarnya adalah **`useFetch` yang sudah "dress-up" khusus untuk TMDB**. Ia membungkus axios yang sudah dikonfigurasi, lalu menyediakan fungsi-fungsi ramah manusia di atasnya.

---

## 🔧 2. Setup Axios Client Terpusat

Sebelum `useTMDB`, kita siapkan **satu instance axios** yang dipakai di seluruh aplikasi. Ini menghindari pengulangan `baseURL` dan `api_key` di tiap request.

```javascript
// lib/axios.js  (atau src/services/tmdbClient.js)
import axios from 'axios'

// Ambil API key dari environment variable
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

// Buat SATU instance axios dengan konfigurasi global
const tmdbAxios = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 10000,                 // 10 detik — batasi waktu tunggu
  params: {
    api_key:  API_KEY,            // otomatis disisipkan ke tiap request
    language: 'id-ID',            // hasil dalam Bahasa Indonesia
  },
})

// ── REQUEST INTERCEPTOR ──
// Dijalankan SEBELUM setiap request dikirim
tmdbAxios.interceptors.request.use((config) => {
  // (Opsional) tambahkan header auth, token, dll di sini
  return config
})

// ── RESPONSE INTERCEPTOR ──
// Dijalankan SETELAH setiap response diterima
tmdbAxios.interceptors.response.use(
  (response) => response,         // sukses → teruskan apa adanya
  (error) => {
    // Tangani error secara terpusat
    if (error.response?.status === 401) {
      console.error('API Key TMDB tidak valid!')
    }
    if (error.response?.status === 404) {
      console.error('Data tidak ditemukan (404)')
    }
    return Promise.reject(error)  // teruskan error ke pemanggil
  }
)

export default tmdbAxios
```

> 💡 **Manfaat interceptor:** Logika penanganan error/header yang berulang cukup ditulis **sekali** di interceptor,而不是 di setiap endpoint. Ini contoh *separation of concerns* yang sangat baik.

---

## 🔐 3. Environment Variable & Keamanan API Key

API key **tidak boleh** ditulis mentah di kode (`*.js`). Mengapa?

- 🔓 Kalau file di-commit ke GitHub publik, orang bisa mencuri key dan memakai kuota API-mu.
- 🔄 Sulit ganti key antar environment (development vs production).

Solusinya: **environment variable** via file `.env`.

```
# .env  (TAMBAHKAN ke .gitignore!)
VITE_TMDB_API_KEY=abc123def456ghi789

# .env.local (jika perlu override lokal)
VITE_TMDB_API_KEY=local_key_xyz
```

```javascript
// Akses di kode Vue (hanya variabel berawalan VITE_ yang terekspos)
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

console.log(API_KEY)   // 'abc123def456ghi789'
```

> ⚠️ **Catatan Penting:** Hanya variabel yang diawali **`VITE_`** yang akan terekspos ke frontend oleh Vite. Variabel biasa di `.env` tidak akan bisa diakses di browser. Dan meski `VITE_` terekspos ke browser, **tetap jangan** taruh secret yang benar-benar rahasia (seperti private key/server password) di sisi frontend — frontend bisa dibaca siapa pun. API key TMDB termasuk "public-ish" (biasa dipakai di client), tapi tetap simpan di `.env` demi kemudahan rotasi.

---

## 🎬 4. `useTMDB` — Kode Lengkap + Komentar Baris

Sekarang kita rangkai semuanya. Berikut `useTMDB` lengkap untuk project Netflix-clone:

```javascript
// composables/useTMDB.js
import { ref } from 'vue'
import axios from 'axios'

// ① Ambil API key dari environment variable (jangan hardcode!)
const API_KEY  = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

// ② Buat SATU instance axios dengan konfigurasi global.
//    Setiap request otomatis membawa api_key + bahasa Indonesia.
const tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key:  API_KEY,
    language: 'id-ID',
  }
})

// ③ Composable utama
export function useTMDB() {
  // State global untuk semua operasi
  const isLoading = ref(false)
  const error     = ref(null)

  // ④ Wrapper async: menangani loading + error SECARA SENTRAL.
  //    Setiap endpoint cukup tulis logika suksesnya saja.
  async function jalankan(fungsi) {
    isLoading.value = true
    error.value     = null
    try {
      return await fungsi()      // jalankan logika spesifik endpoint
    } catch (e) {
      error.value = e.message    // tangkap error apa pun
      return null
    } finally {
      isLoading.value = false    // pastikan loading mati
    }
  }

  return {
    isLoading,
    error,

    // ⑤ Ambil film trending hari ini
    trending: () => jalankan(async () => {
      const { data } = await tmdb.get('/trending/movie/day')
      return data.results
    }),

    // ⑥ Cari film berdasarkan keyword
    cari: (keyword) => jalankan(async () => {
      const { data } = await tmdb.get('/search/movie', {
        params: { query: keyword }
      })
      return data.results
    }),

    // ⑦ Detail film + cari trailer YouTube
    detail: (id) => jalankan(async () => {
      // Jalankan DUA request paralel sekaligus (lebih cepat!)
      const [detail, video] = await Promise.all([
        tmdb.get(`/movie/${id}`),
        tmdb.get(`/movie/${id}/videos`),
      ])
      // Cari video bertipe Trailer dari YouTube
      const trailer = video.data.results
        .find(v => v.type === 'Trailer' && v.site === 'YouTube')
      // Gabungkan detail + trailerKey jadi satu objek
      return { ...detail.data, trailerKey: trailer?.key }
    }),

    // ⑧ Film per genre (discover)
    byGenre: (genreId) => jalankan(async () => {
      const { data } = await tmdb.get('/discover/movie', {
        params: { with_genres: genreId, sort_by: 'popularity.desc' }
      })
      return data.results
    }),
  }
}
```

---

## 🔍 5. Pola Wrapper Async `jalankan()`

Bagian paling cerdas dari `useTMDB` adalah fungsi `jalankan(fungsi)`. Ini disebut *higher-order function* — fungsi yang menerima fungsi lain sebagai argumen.

```
Tanpa jalankan():
  trending: async () => {
    isLoading.value = true        // ❌ diulang tiap endpoint
    error.value = null            // ❌ diulang
    try {
      const { data } = await tmdb.get('/trending/movie/day')
      isLoading.value = false     // ❌ diulang
      return data.results
    } catch (e) {
      error.value = e.message      // ❌ diulang
      isLoading.value = false      // ❌ diulang
    }
  },
  cari: async (kw) => {
    // ❌ COPY-PASTE logika loading/error LAGI di sini
  },
  // ... tiap endpoint = 10 baris boilerplate

Dengan jalankan():
  trending: () => jalankan(async () => {
    const { data } = await tmdb.get('/trending/movie/day')
    return data.results            // ✅ cuma logika inti!
  }),
  cari: (kw) => jalankan(async () => {
    const { data } = await tmdb.get('/search/movie', { params: { query: kw }})
    return data.results            // ✅ cuma logika inti!
  }),
  // loading/error DITANGANI SEKALI di dalam jalankan()
```

**Keuntungan:**
- Tiap endpoint hanya menulis **logika suksesnya** (1-3 baris).
- Loading & error dikelola di **satu tempat** → konsisten di semua endpoint.
- Kalau mau ubah cara error dilaporkan (misal: tampilkan toast), cukup ubah `jalankan()`.

> 💡 **Tips:** Pola `jalankan()` ini bisa kamu jadikan template untuk composable API apa pun, bukan cuma TMDB. Ini lahir dari prinsip *DRY* (Don't Repeat Yourself).

---

## 🎯 6. Endpoint `trending`, `cari`, `detail`, `byGenre`

Mari pahami tiap endpoint:

| Endpoint | Path TMDB | Kegunaan |
| --- | --- | --- |
| `trending()` | `/trending/movie/day` | Film trending hari ini (homepage) |
| `cari(keyword)` | `/search/movie?query=` | Pencarian film |
| `detail(id)` | `/movie/{id}` + `/movie/{id}/videos` | Detail + trailer |
| `byGenre(id)` | `/discover/movie?with_genres=` | Film per genre |

```javascript
// Cara memanggil di komponen:
const { trending, cari, detail, byGenre } = useTMDB()

// Ambil trending
const films = await trending()

// Cari
const hasil = await cari('batman')

// Detail + trailer
const info = await detail(27205)   // id film
console.log(info.trailerKey)        // key YouTube untuk embed

// Per genre (id 28 = Action)
const actionFilms = await byGenre(28)
```

> 💡 **Catatan:** `detail(id)` mengembalikan object gabungan `{ ...detail.data, trailerKey }`. Jadi komponen bisa langsung akses `info.title`, `info.overview`, dan `info.trailerKey` sekaligus.

---

## ⚡ 7. Optimasi dengan `Promise.all`

Perhatikan `detail(id)` menjalankan **dua** request sekaligus:

```javascript
const [detail, video] = await Promise.all([
  tmdb.get(`/movie/${id}`),         // request 1: detail film
  tmdb.get(`/movie/${id}/videos`),  // request 2: daftar video/trailer
])
```

**Mengapa `Promise.all`?**
- Kalau dijalankan **berurutan** (sequential): request 1 selesai (misal 200ms) → baru request 2 jalan (200ms) → total 400ms.
- Kalau dijalankan **paralel** (`Promise.all`): keduanya jalan bersamaan → total ~200ms (yang terlama).

```
Sequential (lambat):
  [== request 1 ==] [== request 2 ==]   → 400ms total

Parallel (cepat):
  [== request 1 ==]
  [== request 2 ==]                      → 200ms total ✅
```

> 💡 **Tips:** Gunakan `Promise.all` setiap kali kamu punya beberapa request **independen** (satu tidak butuh hasil yang lain). Ini optimasi gratis yang sangat berdampak pada kecepatan halaman.

---

## 🎬 8. Penggunaan `useTMDB` di Komponen

```vue
<!-- MovieDetailView.vue -->
<script setup>
import { useTMDB } from '@/composables/useTMDB'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { detail, isLoading, error } = useTMDB()

// Ambil detail film berdasarkan parameter route :id
const film = await detail(route.params.id)
</script>

<template>
  <p v-if="isLoading">⏳ Memuat...</p>
  <p v-else-if="error">❌ {{ error }}</p>
  <div v-else>
    <h1>{{ film.title }}</h1>
    <p>{{ film.overview }}</p>

    <!-- Embed trailer YouTube bila ada -->
    <iframe
      v-if="film.trailerKey"
      :src="`https://www.youtube.com/embed/${film.trailerKey}`"
      allowfullscreen
    />
  </div>
</template>
```

> 💡 **Tips:** Karena `useTMDB` mengembalikan `isLoading` & `error` yang **sama** untuk semua endpoint, kamu cukup satu indikator loading untuk seluruh halaman. Sangat rapi! (Catatan: contoh di atas menunjukkan pemanggilan `await` di top-level `<script setup>` — didukung Vue 3.3+/Vite dengan `suspense` atau top-level await; di praktik nyata sering dipanggil di `onMounted` atau lewat composable async.)

---

## 📌 9. Pattern: API Client Terpusat

Salah satu *pattern* paling berharga dari `useTMDB`:

| Pattern | Manfaat |
| --- | --- |
| **API client terpusat** (`axios.create`) | Hindari pengulangan URL & auth di tiap call |
| **Wrapper async** (`jalankan`) | Loading/error dikelola sekali, bukan per endpoint |
| **Environment variable** | Sembunyikan secret, bedakan dev/prod |
| **Paralel request** (`Promise.all`) | Optimasi kecepatan saat butuh banyak data |
| **Return berbasis fungsi** | Komponen bebas kapan memanggil endpoint |

> ⚠️ **Catatan Penting:** Jangan menyimpan API key di dalam kode sumber (`*.js`). Selalu pakai `import.meta.env.VITE_*` dan tambahkan `.env` ke `.gitignore`. Kalau kebocoran, orang lain bisa memakai kuota API-mu.

> 💡 **Tips:** Kalau project makin besar, kamu bisa memisahkan instance axios ke file `src/services/tmdb.js` sendiri, lalu `useTMDB` hanya mengimpornya. Ini pola *separation of concerns* yang bagus: konfigurasi HTTP terpisah dari logika composable.

---

## 🧩 10. Pattern: Separation of Concerns (File Terpisah)

Struktur direkomendasikan untuk project skala menengah:

```
src/
├── services/            ← Konfigurasi HTTP murni (tanpa Vue)
│   └── tmdbClient.js    ← axios.create + interceptor
│
├── composables/         ← Logika reaktif Vue
│   └── useTMDB.js       ← import tmdbClient, bungkus jadi composable
│
├── components/
│   └── movie/
│       └── MovieCard.vue
│
└── views/
    └── MovieDetailView.vue
```

```javascript
// services/tmdbClient.js  (TIDAK ada import vue)
import axios from 'axios'

const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: { api_key: import.meta.env.VITE_TMDB_API_KEY, language: 'id-ID' },
})

export default tmdb
```

```javascript
// composables/useTMDB.js  (impor client, tambah reaktivitas)
import { ref } from 'vue'
import tmdb from '@/services/tmdbClient'

export function useTMDB() {
  const isLoading = ref(false)
  const error = ref(null)
  // ... (endpoint memakai 'tmdb' yang diimpor)
}
```

**Keuntungan pemisahan:**
- `tmdbClient.js` bisa di-test tanpa Vue.
- Bisa dipakai di luar komponen (misal: di Node script, di store Pinia).
- `useTMDB` fokus pada reaktivitas, `tmdbClient` fokus pada HTTP.

---

## 📦 11. Contoh Kedua: `useLocalStorage` Composable

Untuk mencapai pemahaman "composable pattern" yang utuh, mari bangun composable kedua: `useLocalStorage`. Ini menyinkronkan state Vue dengan `localStorage` browser agar data bertahan saat refresh.

```javascript
// composables/useLocalStorage.js
import { ref, watch } from 'vue'

export function useLocalStorage(kunci, nilaiAwal) {
  // ① Baca dari localStorage; fallback ke nilaiAwal bila kosong
  function bacaDariStorage() {
    try {
      const tersimpan = localStorage.getItem(kunci)
      // Jika ada, parse JSON; jika null, pakai nilaiAwal
      return tersimpan !== null ? JSON.parse(tersimpan) : nilaiAwal
    } catch (e) {
      // Kalau JSON rusak, kembalikan nilai awal
      console.warn(`Gagal baca "${kunci}" dari localStorage:`, e)
      return nilaiAwal
    }
  }

  // ② State reaktif diinisialisasi dari storage
  const state = ref(bacaDariStorage())

  // ③ Setiap kali state berubah → simpan ke localStorage
  watch(state, (nilaiBaru) => {
    localStorage.setItem(kunci, JSON.stringify(nilaiBaru))
  }, { deep: true })   // deep: agar perubahan di dalam object/array terdeteksi

  // ④ Fungsi bantu: hapus dari storage & reset state
  function hapus() {
    localStorage.removeItem(kunci)
    state.value = nilaiAwal
  }

  return { state, hapus }
}
```

```vue
<!-- Penggunaan: menyimpan watchlist ke localStorage -->
<script setup>
import { useLocalStorage } from '@/composables/useLocalStorage'

const { state: watchlist, hapus } = useLocalStorage('watchlist', [])

function tambah(film) {
  watchlist.value.push(film)   // otomatis tersimpan ke localStorage!
}
</script>

<template>
  <ul>
    <li v-for="f in watchlist" :key="f.id">{{ f.title }}</li>
  </ul>
  <button @click="hapus">Kosongkan Watchlist</button>
</template>
```

> 💡 **Keajaiban:** Cukup ubah `watchlist.value`, dan `watch` di dalam composable otomatis menulis ke `localStorage`. Saat user refresh halaman, `bacaDariStorage()` mengisi state dari storage → data tidak hilang. Ini contoh *reactive persistence* yang elegan.

---

## 🔍 12. Penjelasan `useLocalStorage` Baris per Baris

```
BARIS 1   : import { ref, watch } from 'vue'
            → ref untuk state, watch untuk menyimpan otomatis.

BARIS 4   : export function useLocalStorage(kunci, nilaiAwal) {
            → Menerima nama kunci storage & nilai default.

BARIS 6-13: function bacaDariStorage() { ... }
            → Coba baca localStorage. JSON.parse untuk object/array.
              Try/catch mencegah crash bila data rusak.

BARIS 16  : const state = ref(bacaDariStorage())
            → Inisialisasi state dari hasil baca.

BARIS 19-21: watch(state, (baru) => { localStorage.setItem(...) }, {deep:true})
            → Setiap perubahan state → simpan. deep:true penting
              agar push ke array / ubah property object ikut terdeteksi.

BARIS 24-27: function hapus() { localStorage.removeItem(kunci); ... }
            → Hapus storage & reset state ke nilai awal.

BARIS 29  : return { state, hapus }
            → Komponen pakai state (reaktif) & hapus().
```

> ⚠️ **Penting:** Opsi `{ deep: true }` pada `watch` **wajib** di sini. Tanpa itu, `watchlist.value.push(film)` (mutasi dalam array) **tidak** memicu watcher karena referensi array-nya sendiri tidak berubah. `deep: true` memberitahu Vue untuk memeriksa isi object/array secara mendalam.

---

## 🌐 13. Composable dengan State Global (Singleton)

Kadang kita ingin **satu state bersama** untuk semua komponen (mirip "global store" sederhana). Caranya: deklarasikan `ref` di **luar** fungsi composable.

```javascript
// composables/useTema.js
import { ref } from 'vue'

// ⚠️ Dideklarasikan DI LUAR fungsi → shared ke semua pemanggil (singleton)
const tema = ref('dark')

export function useTema() {
  function toggleTema() {
    tema.value = tema.value === 'dark' ? 'light' : 'dark'
  }
  return { tema, toggleTema }
}
```

```vue
<!-- Navbar.vue -->
<script setup>
import { useTema } from '@/composables/useTema'
const { tema, toggleTema } = useTema()
</script>
<template>
  <button @click="toggleTema">Tema: {{ tema }}</button>
</template>

<!-- Konten.vue (komponen LAIN) -->
<script setup>
import { useTema } from '@/composables/useTema'
const { tema } = useTema()   // tema SAMA dengan yang di Navbar!
</script>
<template>
  <p v-if="tema === 'dark'" class="dark-mode">Mode Gelap Aktif</p>
</template>
```

> ⚠️ **Hati-hati:** Singleton (state modul) cocok untuk preferensi global seperti tema, bahasa, atau user login. Tapi untuk state kompleks dengan banyak aksi, **lebih baik pakai Pinia** (Bab 19) yang punya struktur lebih jelas, devtools, dan dukungan SSR. Jangan jadikan singleton kebiasaan untuk semua composable.

---

## 🎬 14. Studi Kasus: Integrasi `useTMDB` + `useDebounce` + `useLocalStorage`

Mari gabungkan tiga composable untuk fitur Search cerdas di Netflix-clone:

```vue
<!-- SearchView.vue -->
<script setup>
import { ref, watch, computed } from 'vue'
import { useDebounce } from '@/composables/useDebounce'
import { useTMDB } from '@/composables/useTMDB'
import { useLocalStorage } from '@/composables/useLocalStorage'

// ① Keyword mentah + debounce
const keyword = ref('')
const keywordDebounced = useDebounce(keyword, 400)

// ② Composable TMDB
const { cari, isLoading, error } = useTMDB()
const hasil = ref([])

// ③ Simpan riwayat pencarian ke localStorage
const { state: riwayat } = useLocalStorage('riwayatCarian', [])

// ④ Pantau keyword debounced → cari film
watch(keywordDebounced, async (kata) => {
  if (!kata.trim()) { hasil.value = []; return }
  const data = await cari(kata)
  hasil.value = data ?? []

  // Tambahkan ke riwayat (hindari duplikat)
  if (!riwayat.value.includes(kata)) {
    riwayat.value.push(kata)
  }
})

// ⑤ Tampilkan 5 riwayat terakhir
const riwayatTerakhir = computed(() => riwayat.value.slice(-5))
</script>

<template>
  <input v-model="keyword" placeholder="Cari film..." />

  <p v-if="isLoading">⏳ Mencari...</p>
  <p v-else-if="error">❌ {{ error }}</p>

  <ul v-else>
    <li v-for="f in hasil" :key="f.id">🎬 {{ f.title }}</li>
  </ul>

  <div v-if="riwayatTerakhir.length">
    <h4>🕘 Pencarian terakhir:</h4>
    <button
      v-for="k in riwayatTerakhir"
      :key="k"
      @click="keyword = k"
    >{{ k }}</button>
  </div>
</template>
```

**Yang dipelajari:**
- `useDebounce` mencegah request API berlebih saat mengetik.
- `useTMDB` menangani fetching + loading + error secara sentral.
- `useLocalStorage` membuat riwayat pencarian bertahan walau di-refresh.
- Ketiga composable **tidak saling tahu keberadaan satu sama lain**, tapi bekerja harmonis di komponen. Inilah kekuatan composable: *composable composition*.

---

## 🚨 15. Jebakan Umum Pemula di Bab 16

### ❌ Jebakan 1 — Hardcode API Key di Kode

```javascript
// ❌ SALAH — key terekspos di repository
const tmdb = axios.create({
  params: { api_key: 'abc123def456' }   // ❌ jangan!
})

// ✅ BENAR — dari environment variable
const tmdb = axios.create({
  params: { api_key: import.meta.env.VITE_TMDB_API_KEY }
})
```

> ✅ **Perbaikan:** Simpan di `.env`, tambahkan ke `.gitignore`.

---

### ❌ Jebakan 2 — Lupa `{ deep: true }` di `useLocalStorage`

```javascript
// ❌ SALAH — mutasi dalam array tidak terdeteksi
watch(state, (baru) => simpan(baru))

// ✅ BENAR
watch(state, (baru) => simpan(baru), { deep: true })
```

---

### ❌ Jebakan 3 — Singleton Tak Disengaja (State Modul)

```javascript
// ❌ SALAH — ref di luar fungsi = semua komponen berbagi state!
import { ref } from 'vue'
const hitungan = ref(0)
export function useCounter() { return { hitungan } }

// ✅ BENAR — ref di dalam fungsi = per-pemanggilan
export function useCounter() {
  const hitungan = ref(0)
  return { hitungan }
}
```

---

### ❌ Jebakan 4 — Sequential Request Padahal Bisa Paralel

```javascript
// ❌ SALAH — berurutan (lambat)
const detail = await tmdb.get(`/movie/${id}`)
const video  = await tmdb.get(`/movie/${id}/videos`)

// ✅ BENAR — paralel dengan Promise.all (cepat)
const [detail, video] = await Promise.all([
  tmdb.get(`/movie/${id}`),
  tmdb.get(`/movie/${id}/videos`),
])
```

---

### ❌ Jebakan 5 — Tidak Menangani `null` dari `jalankan()`

```javascript
// ❌ SALAH — asumsi selalu ada hasil
const films = await trending()
films.map(...)   // ❌ crash bila trending() return null (error)

// ✅ BENAR — cek null
const films = await trending()
if (films) films.map(...)
// atau: (await trending()) ?? []
```

---

## 🧪 16. Error Boundary Pattern (Penanganan Error Terpusat)

Selain wrapper `jalankan()`, pola penting lain: menyediakan **state error terstruktur** agar komponen bisa menampilkan pesan ramah.

```javascript
// Dalam useTMDB — perbaiki penanganan error jadi lebih kaya
async function jalankan(fungsi) {
  isLoading.value = true
  error.value = null
  try {
    return await fungsi()
  } catch (e) {
    // Simpan objek error, bukan cuma pesan
    error.value = {
      pesan: e.message,
      status: e.response?.status ?? null,
      waktu: new Date().toISOString(),
    }
    return null
  } finally {
    isLoading.value = false
  }
}
```

```vue
<script setup>
const { error } = useTMDB()
</script>

<template>
  <div v-if="error" class="banner-error">
    <p>❌ {{ error.pesan }}</p>
    <small v-if="error.status">Kode: {{ error.status }}</small>
  </div>
</template>
```

> 💡 **Tips:** Menyimpan error sebagai **objek** (bukan string) memberi komponen informasi lebih kaya: status HTTP, timestamp, atau tipe error. Ini pola yang dipakai library produksi.

---

## 💉 17. Composable dengan Dependency Injection (`provide`/`inject`)

Composable bisa memanfaatkan `provide`/`inject` untuk berbagi konteks tanpa prop drilling.

```javascript
// composables/useTema.js (dengan provide)
import { ref, provide, inject } from 'vue'

const KUNCI_TEMA = Symbol('tema')

export function sediakanTema() {
  const tema = ref('dark')
  // provide ke semua descendant
  provide(KUNCI_TEMA, {
    tema,
    toggle: () => tema.value = tema.value === 'dark' ? 'light' : 'dark',
  })
  return { tema }
}

export function gunakanTema() {
  // inject dari ancestor (null bila tidak ada)
  const ctx = inject(KUNCI_TEMA, null)
  if (!ctx) throw new Error('gunakanTema harus di dalam sediakanTema!')
  return ctx
}
```

```vue
<!-- App.vue (root) -->
<script setup>
import { sediakanTema } from '@/composables/useTema'
sediakanTema()   // berikan tema ke seluruh pohon komponen
</script>

<!-- AnakCucu.vue (mana saja di bawah App) -->
<script setup>
import { gunakanTema } from '@/composables/useTema'
const { tema, toggle } = gunakanTema()   // otomatis dapat dari root
</script>
```

> 💡 **Kapan pakai `provide/inject` vs Composable Singleton vs Pinia?**
> - `provide/inject` → konteks terbatas satu subtree (misal: tema section tertentu).
> - Singleton composable → global sederhana (tema app, bahasa).
> - Pinia → state kompleks dengan banyak aksi & devtools (user, cart).

---

## 🧰 18. Mengapa Memisahkan `services/` dari `composables/`

Mari tegaskan arsitektur yang baik untuk project produksi:

```
src/
├── services/            ← Murni JavaScript, TANPA Vue
│   ├── tmdbClient.js    ← axios + interceptor (HTTP)
│   └── apiHelper.js     ← helper umum (format error, retry)
│
├── composables/         ← Logika reaktif Vue
│   ├── useTMDB.js        ← pakai tmdbClient
│   └── useAuth.js        ← pakai apiHelper
│
└── stores/              ← Pinia (Bab 19)
    └── movieStore.js     ← orkestrasi composable + cache
```

**Alasan pemisahan:**
- `services/` bisa di-test tanpa Vue (unit test murni).
- Bisa dipakai di Node (SSR, script) tanpa membawa reaktivitas.
- `composables/` fokus menerjemahkan data jadi state reaktif.
- Saat migrasi ke framework lain, `services/` bisa dipakai ulang.

> ⚠️ **Anti-pattern:** Menulis `axios.get(...)` langsung di dalam komponen `.vue`. Itu membuat logika API tidak bisa di-reuse dan susah di-test. Selalu angkat ke composable/service.

---

## 🎯 19. Kapan Harus Membuat Composable?

Panduan kapan logika layak dijadikan composable:

```
BUAT composable bila:
  ✅ Logika dipakai di ≥ 2 komponen
  ✅ Logika punya state sendiri (ref/reactive)
  ✅ Logika punya lifecycle (onMounted/onUnmounted)
  ✅ Logika menangani side-effect (fetch, timer, listener)

JANGAN buat composable bila:
  🔗 Hanya dipakai 1 kali & sangat spesifik
  🔗 Cuma fungsi murni sederhana (cukup util biasa)
  🔗 Menambah abstrak tidak perlu (over-engineering)
```

```javascript
// ❌ Over-engineering: composable untuk sekadar format teks
export function useFormatRupiah(nilai) {
  return ref('Rp ' + nilai.toLocaleString('id-ID'))
}
// → cukup jadi fungsi util biasa:
export function formatRupiah(nilai) {
  return 'Rp ' + nilai.toLocaleString('id-ID')
}
```

> 💡 **Tips:** Composable untuk **state + side effect**. Fungsi util murni (format, validasi) cukup jadi *function biasa* di `utils/`. Jangan bikin composable kalau tidak butuh reaktivitas.

---

## 🔁 20. Composable dengan Retry & Timeout

Menambah ketahanan (resilience) ke composable API: coba ulang otomatis bila gagal, dan batasi waktu tunggu.

```javascript
// composables/useResilientFetch.js
import { ref } from 'vue'

export function useResilientFetch() {
  const data = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  async function fetchDenganRetry(url, { retry = 3, timeout = 8000 } = {}) {
    isLoading.value = true
    error.value = null

    // Buat AbortController untuk timeout
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeout)

    for (let percobaan = 1; percobaan <= retry; percobaan++) {
      try {
        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        data.value = await res.json()
        clearTimeout(timer)
        isLoading.value = false
        return data.value
      } catch (e) {
        // Jika ini percobaan terakhir → catat error
        if (percobaan === retry) {
          error.value = `Gagal setelah ${retry} percobaan: ${e.message}`
          clearTimeout(timer)
          isLoading.value = false
          return null
        }
        // Tunggu sebentar sebelum retry (backoff sederhana)
        await new Promise((r) => setTimeout(r, 500 * percobaan))
      }
    }
  }

  return { data, isLoading, error, fetchDenganRetry }
}
```

> 💡 **Tips:** Pola *retry with backoff* sangat berguna untuk jaringan tidak stabil (mobile). Menunggu makin lama tiap percobaan mencegah *thundering herd* ke server.

---

## 📂 21. Struktur Folder Final (Best Practice)

Ringkasan penempatan file untuk BAGIAN IV:

```
src/
├── services/
│   └── tmdbClient.js            ← axios.create + interceptor (Bab 16)
│
├── composables/
│   ├── useFetch.js              ← dasar (Bab 14)
│   ├── useDebounce.js           ← debounce search (Bab 14)
│   ├── useTMDB.js               ← API TMDB lengkap (Bab 16)
│   ├── useLocalStorage.js       ← persistensi (Bab 16)
│   ├── useToggle.js             ← boolean (Bab 14)
│   └── useMouse.js              ← tracker (Bab 14)
│
├── components/
│   ├── movie/
│   │   ├── MovieCard.vue
│   │   └── VideoPlayer.vue      ← defineExpose play/pause (Bab 15)
│   └── ui/
│       └── BaseModal.vue        ← Teleport + ref (Bab 15)
│
└── views/
    ├── HomeView.vue             ← pakai useTMDB.trending
    └── SearchView.vue           ← pakai useDebounce + useTMDB.cari
```

> 💡 **Prinsip:** Satu composable = satu file. Nama file = nama composable (tanpa `use` di awal, atau dengan `use` — konsisten di project). Hindari menggabungkan banyak composable dalam satu file.

---

## 🎓 22. Dari Composable ke Pinia (Jembatan ke BAGIAN V)

Composable state-per-panggilan bagus untuk logika lokal. Tapi untuk **state global terstruktur** (user login, cart, watchlist), Pinia lebih tepat.

```javascript
// composables/useTMDB.js  → logika ambil data (stateless-ish)
// stores/movieStore.js    → state hasil fetch yang di-cache & dibagi
import { defineStore } from 'pinia'
import { useTMDB } from '@/composables/useTMDB'

export const useMovieStore = defineStore('movie', () => {
  const tmdb = useTMDB()
  const trending = ref([])

  async function muatTrending() {
    trending.value = (await tmdb.trending()) ?? []
  }

  return { trending, muatTrending }
})
```

> 💡 **Hubungan:** Composable adalah **bahan baku**, Pinia adalah **lemari penyimpanan global**. Di BAGIAN V (Bab 19-20) kita akan melihat bagaimana store Pinia mengorkestrasi composable seperti `useTMDB` dan menyimpan hasilnya agar bisa diakses seluruh aplikasi tanpa prop drilling.

---

## 🪄 23. Composable Sederhana: `useToggle` & `useBoolean`

Tidak semua composable harus berurusan dengan API. Composable kecil untuk state boolean sangat sering dipakai (modal open/close, theme on/off, loading flag).

```javascript
// composables/useToggle.js
import { ref } from 'vue'

// Menerima nilai awal (default false) dan mengembalikan helper
export function useToggle(nilaiAwal = false) {
  const nilai = ref(nilaiAwal)

  // Balik nilai: true → false, false → true
  function toggle() {
    nilai.value = !nilai.value
  }
  // Paksa ke true / false
  const setTrue  = () => (nilai.value = true)
  const setFalse = () => (nilai.value = false)

  return { nilai, toggle, setTrue, setFalse }
}
```

```vue
<!-- ModalTrigger.vue -->
<script setup>
import { useToggle } from '@/composables/useToggle'
const { nilai: isOpen, toggle, setFalse } = useToggle(false)
</script>

<template>
  <button @click="toggle">Buka Modal</button>
  <div v-if="isOpen" class="modal" @click="setFalse">Tutup</div>
</template>
```

> 💡 **Tips:** Composable kecil seperti `useToggle` sering disebut **stateful composable** — ia memiliki state (`ref`) dan fungsi untuk memutarnya. Ini tulang punggung komponen yang rapi.

---

## 🖱️ 24. Composable dengan Event Listener (`useMouse`)

Pola penting: composable yang menambah *event listener* ke `window`/`document` harus membersihkannya di `onUnmounted`. Ini contoh *side-effect management*.

```javascript
// composables/useMouse.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  // Handler dipisah ke variabel agar bisa di-remove nanti
  function perbaruiPosisi(e) {
    x.value = e.clientX
    y.value = e.clientY
  }

  // Pasang listener saat mount
  onMounted(() => {
    window.addEventListener('mousemove', perbaruiPosisi)
  })

  // Lepas listener saat unmount (CEGAH memory leak)
  onUnmounted(() => {
    window.removeEventListener('mousemove', perbaruiPosisi)
  })

  return { x, y }
}
```

```vue
<script setup>
import { useMouse } from '@/composables/useMouse'
const { x, y } = useMouse()   // posisi kursor selalu update
</script>
<template>
  <p>Kursor di: ({{ x }}, {{ y }})</p>
</template>
```

| Langkah | Fungsi | Mengapa penting |
| --- | --- | --- |
| `onMounted` | `addEventListener` | Mulai pantau saat komponen hidup |
| Handler terpisah | `perbaruiPosisi` | Bisa di-`removeEventListener` dengan referensi sama |
| `onUnmounted` | `removeEventListener` | Bersihkan agar tidak bocor ke komponen lain |

> ⚠️ **Wajib dihafal:** Selalu pasang `removeEventListener` dengan **fungsi yang sama** (bukan arrow inline baru) di `onUnmounted`. Arrow inline di `addEventListener` tidak bisa di-remove karena referensinya beda.

---

## ⏱️ 25. `useDebounce` Internal vs Eksternal (Lebih Dalam)

Di Bab 14 kita pakai `useDebounce` yang menerima ref luar. Mari buat versi **mandiri** yang mengelola nilai + debounce sekaligus.

```javascript
// composables/useDebouncedRef.js
import { ref, watch } from 'vue'

export function useDebouncedRef(nilaiAwal, delay = 400) {
  const nilai      = ref(nilaiAwal)  // yang ditampilkan (sudah debounce)
  const input      = ref(nilaiAwal)  // yang diketik user (langsung)
  let timer = null

  // Pantau input: setiap ketik, reset timer
  watch(input, (baru) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      nilai.value = baru   // baru disalin setelah 'delay' ms tenang
    }, delay)
  })

  return { nilai, input }
}
```

```vue
<script setup>
import { useDebouncedRef } from '@/composables/useDebouncedRef'
const { nilai: hasil, input: ketikan } = useDebouncedRef('', 500)
</script>
<template>
  <input v-model="ketikan" placeholder="Ketik pelan-pelan..." />
  <p>Hasil debounce: {{ hasil }}</p>
</template>
```

> 💡 **Perbedaan:** `useDebounce` (Bab 14) = **meneruskan** ref luar; `useDebouncedRef` = **memiliki** ref sendiri. Pilih yang membuat komponen lebih ringkas.

---

## 🔄 26. Pola State Machine: `useAsync` dengan Status Lengkap

WRapper `jalankan()` Bab 16 hanya punya `isLoading`/`error`. Untuk UI yang lebih kaya, gunakan **status eksplisit**: `idle → loading → success → error`.

```javascript
// composables/useAsync.js
import { ref } from 'vue'

export function useAsync(fn) {
  const data    = ref(null)
  const error   = ref(null)
  const status  = ref('idle')   // 'idle' | 'loading' | 'success' | 'error'

  async function execute(...args) {
    status.value = 'loading'
    error.value  = null
    try {
      data.value = await fn(...args)
      status.value = 'success'
    } catch (e) {
      error.value = e.message
      status.value = 'error'
    }
    return data.value
  }

  return { data, error, status, execute }
}
```

```vue
<script setup>
import { useAsync } from '@/composables/useAsync'
import { useTMDB } from '@/composables/useTMDB'

const { trending } = useTMDB()
const { data: films, status, execute } = useAsync(trending)

// Tampilkan UI berdasar status eksplisit
execute()
</script>

<template>
  <p v-if="status === 'loading'">⏳ Memuat...</p>
  <p v-else-if="status === 'error'">❌ {{ error }}</p>
  <p v-else-if="status === 'success'">✅ {{ films.length }} film dimuat</p>
</template>
```

| Status | Arti | UI yang cocok |
| --- | --- | --- |
| `idle` | Belum dipanggil | Tombol "Muat Data" |
| `loading` | Sedang fetch | Spinner |
| `success` | Berhasil | Data + tombol refresh |
| `error` | Gagal | Pesan + tombol retry |

---

## 🧪 27. Composable & Testing (Vitest Dasar)

Salah satu alasan composable dipisah dari komponen: ia bisa di-test **tanpa Vue** (unit test murni). Berikut contoh test sederhana dengan Vitest.

```javascript
// composables/useToggle.spec.js
import { useToggle } from '@/composables/useToggle'

test('useToggle membalik nilai', () => {
  const { nilai, toggle } = useToggle(false)
  expect(nilai.value).toBe(false)   // awal false
  toggle()
  expect(nilai.value).toBe(true)    // setelah toggle → true
  toggle()
  expect(nilai.value).toBe(false)   // balik lagi
})
```

```javascript
// composables/useLocalStorage.spec.js
import { useLocalStorage } from '@/composables/useLocalStorage'

test('state tersimpan ke localStorage', () => {
  const { state, hapus } = useLocalStorage('tes', [])
  state.value.push('a')
  expect(JSON.parse(localStorage.getItem('tes'))).toContain('a')
  hapus()
  expect(localStorage.getItem('tes')).toBeNull()
})
```

> 💡 **Tips:** Composable yang **tidak** bergantung DOM (seperti `useToggle`, `useLocalStorage`) sangat mudah di-test. Composable yang butuh DOM (seperti `useMouse`) perlu `@vue/test-utils` + environment `jsdom`. Ini salah satu alasan memisahkan `services/` dari `composables/`.

---

## 🚨 28. Jebakan Tambahan (Jebakan 6–9)

### ❌ Jebakan 6 — Composable Dipanggil di Luar `<script setup>` / setup

```vue
<!-- ❌ SALAH — useMouse butuh lifecycle hook -->
<script setup>
import { useMouse } from '@/composables/useMouse'
</script>
<script>
// ❌ di luar setup → onMounted tidak ada konteksnya
const { x } = useMouse()
</script>
<!-- ✅ BENAR: selalu di dalam <script setup> atau setup() -->
```

### ❌ Jebakan 7 — Membuat `ref` Global tanpa Sadar Singleton

```javascript
// ❌ SALAH — ref di luar fungsi = semua pemanggil share state
import { ref } from 'vue'
const count = ref(0)
export function useCount() { return { count } }

// ✅ BENAR — ref di dalam fungsi = per instance
export function useCount() {
  const count = ref(0)
  return { count }
}
```

### ❌ Jebakan 8 — Lupa Return Semua yang Dibutuhkan Komponen

```javascript
// ❌ SALAH — reset tidak di-return, padahal dipakai di template
export function useLocalStorage(kunci, awal) {
  const state = ref(awal)
  function hapus() { /* ... */ }
  return { state }   // ← lupa return hapus
}
// ✅ BENAR
export function useLocalStorage(kunci, awal) {
  const state = ref(awal)
  function hapus() { /* ... */ }
  return { state, hapus }   // ✓ semua dikembalikan
}
```

### ❌ Jebakan 9 — Mengembalikan `ref` sebagai `.value` (bukan ref-nya)

```javascript
// ❌ SALAH — mengembalikan nilai mentah, kehilangan reaktivitas
export function useCount() {
  const count = ref(0)
  return { count: count.value }   // ← ini number biasa, bukan ref!
}
// ✅ BENAR — kembalikan ref-nya
export function useCount() {
  const count = ref(0)
  return { count }                // ← ref, tetap reaktif
}
```

---

## 🗺️ 29. Peta Keputusan: Composable vs Util vs Store

Bingung meletakkan logika ke mana? Gunakan panduan ini:

```
LOGIKA BARU MASUK:
  │
  ├─ Butuh STATE reaktif + side-effect (fetch, timer, listener)?
  │     └─ ✅ Composable (useXxx) di composables/
  │
  ├─ Cuma fungsi murni (format, validasi, hitung)?
  │     └─ ✅ Util biasa di utils/ (TIDAK perlu composable)
  │
  └─ State global kompleks (user, cart, dipakai banyak fitur)?
        └─ ✅ Pinia store di stores/ (Bab 19)
```

```javascript
// ❌ Over-engineering: util dibuat composable
export function useFormatTanggal(t) { return ref(t.toLocaleDateString()) }

// ✅ Cukup util biasa
export function formatTanggal(t) { return t.toLocaleDateString() }
```

> 🎯 **Prinsip emas:** Composable = **state + side effect**. Util = **fungsi murni**. Store = **state global kompleks**. Jangan campuradukkan ketiganya.

---

## 📝 Ringkasan Bab 16

| Konsep | Penjelasan |
| --- | --- |
| **`useTMDB`** | Composable produksi: axios client + wrapper async + banyak endpoint |
| **axios.create** | Konfigurasi baseURL + api_key + language secara global |
| **Environment var** | `import.meta.env.VITE_*` untuk sembunyikan API key |
| **`jalankan(fungsi)`** | Higher-order: pusatkan loading/error, endpoint jadi ringkas |
| **`Promise.all`** | Jalankan request independen paralel → lebih cepat |
| **`useLocalStorage`** | Sync state Vue ↔ localStorage (dengan `deep: true` watch) |
| **Separation of concerns** | Pisahkan `services/` (HTTP) dari `composables/` (reaktif) |
| **Singleton composable** | `ref` di luar fungsi → state global (hati-hati, lebih baik Pinia) |

---

## 🎯 Latihan Mandiri

**⭐ Latihan 1 — `useLocalStorage` untuk Tema**
Buat `useTema.js` menggunakan pola singleton (ref di luar fungsi) yang menyimpan `'dark'`/`'light'` ke `localStorage` dengan kunci `'temaApp'`. Sediakan `toggleTema()`. Gunakan di dua komponen berbeda dan buktikan perubahan di satu komponen memengaruhi komponen lain.

**⭐⭐ Latihan 2 — Kembangkan `useTMDB` dengan `nowPlaying`**
Tambahkan endpoint `nowPlaying()` ke `useTMDB` yang memanggil `/movie/now_playing`. Pastikan ia menggunakan wrapper `jalankan()` yang sama. Uji di komponen yang menampilkan 10 film sedang tayang.

**⭐⭐⭐ Latihan 3 — `useApi` Generic dengan `jalankan`**
Buat composable generic `useApi.js` yang menerima instance axios (atau baseURL) dan mengembalikan `{ get, post, isLoading, error }` dengan pola wrapper `jalankan` seperti `useTMDB`. Buktikan bisa dipakai untuk API selain TMDB (misal: JSONPlaceholder).

**⭐⭐⭐⭐ Latihan 4 — Integrasi Tiga Composable**
Gabungkan `useDebounce`, `useTMDB`, dan `useLocalStorage` dalam satu `SearchLanjutan.vue` seperti studi kasus Bab 16: pencarian film dengan debounce, penyimpanan riwayat ke localStorage, dan penanganan loading/error terpusat. Tambahkan fitur: klik item riwayat mengisi ulang `keyword` dan memicu pencarian kembali.

---

*Lanjut ke ➡️ **BAGIAN V — Ekosistem Vue*** *(Vue Router & Pinia — dua pilar yang mengubah aplikasi Vue dari sekadar halaman statis menjadi aplikasi multi-halaman dengan state global yang terkelola)*
