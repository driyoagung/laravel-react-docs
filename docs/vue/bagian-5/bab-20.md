# 📚 Bab 20 — Pinia Lanjutan & Best Practices

> *"Store yang baik bukan yang paling banyak fitur, tapi yang paling jelas batasnya. Seperti lemari arsip: tiap laci punya isinya sendiri, dan kunci ada pada disiplin meletakkan barang di tempat yang tepat."*

---

> **🧠 Apa Itu Pinia Lanjutan?**
>
> Di Bab 19 kita belajar store tunggal. Di bab ini kita naik level: membangun **banyak store yang saling berhubungan**, menerapkan **caching** agar tidak request API berulang, **persistensi ke localStorage** agar data bertahan saat refresh, serta **best practices** agar store tetap sehat (tidak ada mutasi state di luar action, tidak ada store raksasa). Kita membedah langsung 3 store nyata aplikasi Netflix: `movieStore`, `watchlistStore`, dan bagaimana mereka bekerja sama.

---

> **🏗️ Analogi Sederhana:**
>
> Bayangkan Netflix sebagai **pusat perbelanjaan**. `movieStore` adalah gudang film besar dengan **sistem cache** (film yang sudah diambil tidak diambil ulang dari pabrik). `watchlistStore` adalah **buku catatan pribadi** pengunjung yang dibawa pulang (localStorage) supaya besok masih ingat film apa yang disukai. `authStore` adalah **kartu member** yang membuktikan identitas. Ketiganya berdiri sendiri tapi saling mendukung: kasir (komponen) cek kartu member, lihat gudang film, lalu coret ke buku catatan — tanpa satupun lemari tahu cara kerja lemari lain secara detail.

---

## 📋 Daftar Isi Bab 20

1. Prinsip: Satu Store = Satu Domain
2. Studi Kasus Netflix — 3 Store Utama
3. `movieStore` — State, Getters, dan Caching
4. Pola Cache Sederhana (Hindari Request Berulang)
5. `watchlistStore` — Persistensi localStorage
6. Store-to-Store Usage — Store Memanggil Store Lain
7. Actions Async & Error Handling Terpusat
8. Best Practices — Jangan Mutasi State di Luar Action
9. Plugin Persisted State (Alternatif Manual)
10. Struktur Folder Store yang Rapi
11. Studi Kasus — Fitur Watchlist End-to-End
12. Jebakan Umum Pemula di Bab 20
13. Ringkasan & Latihan Mandiri

---

## 🎯 Prinsip: Satu Store = Satu Domain

Sebelum ke kode, pegang prinsip emas: **pisahkan state berdasar domain bisnisnya**. Jangan buat satu `appStore` raksasa berisi semua.

```
❌ ANTI-PATTERN: store raksasa
useAppStore() → { user, token, film, watchlist, tema, notifikasi, ... }
  → 800 baris, susah di-test, konflik saat kerja tim

✅ BEST PRACTICE: store per domain
useAuthStore()      → user, token, login, logout
useMovieStore()     → film trending, per genre, detail (cache)
useWatchlistStore() → daftar tontonan (localStorage)
useThemeStore()     → light/dark
```

| Keuntungan pemisahan |
| --- |
| ✅ Tiap store fokus & mudah dipahami |
| ✅ Unit test terisolasi |
| ✅ Bisa lazy-loaded per fitur |
| ✅ Kolaborasi tim tanpa konflik file |

---

## 🎬 Studi Kasus Netflix — 3 Store Utama

Aplikasi Netflix kita dibagi menjadi tiga store utama:

| Store | Tanggung Jawab |
| --- | --- |
| `authStore` | User login, token, status autentikasi (Bab 19) |
| `movieStore` | Daftar film trending, per-genre, dan **cache detail film** |
| `watchlistStore` | Daftar film yang disimpan user, **persist ke localStorage** |

Pemisahan ini membuat tiap store mudah diuji, dipelihara, dan dipahami.

---

## 🎞️ `movieStore` — State, Getters, dan Caching

```javascript
// ─────────────────────────────────────────────────────────────
// stores/movieStore.js
// ─────────────────────────────────────────────────────────────
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useTMDB } from '@/composables/useTMDB'

export const useMovieStore = defineStore('movie', () => {
  // composable TMDB (Bab 16/21) untuk HTTP request
  const tmdb = useTMDB()

  // ── STATE ──
  const trending    = ref([])               // semua film trending
  const byGenre     = ref({})               // { genreId: { nama, films } }
  const detailCache = ref({})               // { id: detailFilm }  ← CACHE

  // ── GETTERS ──
  // Ambil 20 film trending pertama untuk tampilan
  const filmTrending = computed(() => trending.value.slice(0, 20))

  // Cek apakah cache punya detail film tertentu
  const punyaCache = (id) => !!detailCache.value[id]

  // ── ACTIONS ──
  async function muatTrending() {
    trending.value = (await tmdb.trending()) ?? []
  }

  async function muatByGenre(genreId, namaGenre) {
    // Cegah request berulang jika sudah ada
    if (byGenre.value[genreId]) return
    byGenre.value[genreId] = {
      nama: namaGenre,
      films: (await tmdb.byGenre(genreId)) ?? [],
    }
  }

  async function ambilDetail(id) {
    // ① Cek cache dulu
    if (detailCache.value[id]) return detailCache.value[id]
    // ② Baru fetch dari API
    const detail = await tmdb.detail(id)
    if (detail) detailCache.value[id] = detail  // ③ simpan ke cache
    return detail
  }

  return {
    trending, byGenre, detailCache,
    filmTrending, punyaCache,
    muatTrending, muatByGenre, ambilDetail,
  }
})
```

### Pola Cache Sederhana

Perhatikan `detailCache` dan pengecekan `if (detailCache.value[id])`. Ini strategi **cache sederhana**:

1. Saat user membuka detail film `123` pertama kali → fetch dari API, lalu simpan ke `detailCache[123]`.
2. Jika user kembali ke film `123` → langsung ambil dari cache, **tanpa request ulang** ke API.

```javascript
// Alur ambilDetail:
async function ambilDetail(id) {
  if (detailCache.value[id]) return detailCache.value[id] // ← cache HIT
  const detail = await tmdb.detail(id)                    // ← cache MISS (API)
  if (detail) detailCache.value[id] = detail
  return detail
}
```

| Kejadian | API Call? | Sumber Data |
| --- | --- | --- |
| Buka film 123 pertama kali | ✅ Ya | TMDB API |
| Buka film 123 lagi | ❌ Tidak | `detailCache` |
| Buka film 456 | ✅ Ya | TMDB API |

> 💡 **Tips:** Caching mengurangi beban API (dan kuota/rate-limit) sekaligus membuat UI lebih cepat responsif. Cocok untuk data yang jarang berubah seperti detail film.

`getter` `filmTrending` memotong array `trending` hanya 20 item pertama — memisahkan **data mentah** (semua trending) dari **tampilan** (20 teratas).

> ⚠️ **Catatan Penting:** `detailCache` disimpan di `ref` biasa (bukan localStorage), jadi cache **hilang saat refresh halaman**. Jika ingin cache bertahan lintas refresh, gabungkan dengan persistensi seperti pada `watchlistStore` di bawah.

---

## 💾 `watchlistStore` — Persistensi localStorage

```javascript
// ─────────────────────────────────────────────────────────────
// stores/watchlistStore.js
// ─────────────────────────────────────────────────────────────
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useWatchlistStore = defineStore('watchlist', () => {
  // ── STATE: baca dari localStorage saat store dibuat ──
  const disimpan = ref(
    JSON.parse(localStorage.getItem('watchlist') ?? '[]')
  )

  // ── GETTERS ──
  const jumlah = computed(() => disimpan.value.length)

  // ── ACTIONS ──
  function simpan(film) {
    if (adaDiWatchlist(film.id)) return   // cegah duplikat
    disimpan.value.push(film)
    simpanKeStorage()
  }

  function hapus(filmId) {
    disimpan.value = disimpan.value.filter((f) => f.id !== filmId)
    simpanKeStorage()
  }

  function adaDiWatchlist(filmId) {
    return disimpan.value.some((f) => f.id === filmId)
  }

  function simpanKeStorage() {
    // Tulis ulang ke localStorage setiap ada perubahan
    localStorage.setItem('watchlist', JSON.stringify(disimpan.value))
  }

  return { disimpan, jumlah, simpan, hapus, adaDiWatchlist }
})
```

### Penjelasan Persistensi

- Saat store dibuat, `disimpan` diisi dari `localStorage` (`JSON.parse(...)` dengan fallback `[]`).
- Setiap kali `simpan()` atau `hapus()` dipanggil → `simpanKeStorage()` menulis ulang ke localStorage.
- `adaDiWatchlist()` mencegah film **duplikat** masuk watchlist.
- `jumlah` adalah getter yang selalu mencerminkan panjang watchlist (bisa dipakai untuk badge navbar).

> 🛡️ **Keamanan:** localStorage bisa dibaca oleh JavaScript mana pun di domain yang sama (termasuk XSS). **Jangan** menyimpan token rahasia atau data sensitif di sini. Watchlist berisi data film publik, jadi aman.

> 📌 **Catatan Penting:** Cara di atas adalah persistensi **manual**. Untuk aplikasi produksi, pertimbangkan plugin seperti `pinia-plugin-persistedstate` agar setiap store otomatis tersimpan tanpa menulis `simpanKeStorage()` berulang.

🎬 **Studi Kasus:** User menambahkan film ke watchlist di halaman detail. Karena `watchlistStore` persisten, saat user menutup lalu membuka kembali aplikasi, daftar watchlist **tetap ada**. Navbar menampilkan `jumlah` sebagai badge "🔖 5".

---

## 🔗 Store-to-Store Usage — Store Memanggil Store Lain

Store tidak hidup sendiri. Sering satu store butuh data/action dari store lain. Cukup panggil `useXStore()` di dalam store.

```javascript
// stores/watchlistStore.js — butuh authStore untuk tahu user
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/authStore'

export const useWatchlistStore = defineStore('watchlist', () => {
  const auth = useAuthStore() // ← panggil store lain di dalam store

  const disimpan = ref([])

  const jumlah = computed(() => disimpan.value.length)

  function simpan(film) {
    if (!auth.isLoggedIn) {
      // Tidak bisa simpan kalau belum login
      throw new Error('Harus login dulu')
    }
    disimpan.value.push(film)
  }

  return { disimpan, jumlah, simpan }
})
```

```javascript
// movieStore butuh watchlistStore untuk cek status "sudah disimpan?"
import { useWatchlistStore } from '@/stores/watchlistStore'

export const useMovieStore = defineStore('movie', () => {
  const watchlist = useWatchlistStore()

  function ambilDetail(id) {
    const detail = tmdb.detail(id)
    // Tambahkan flag dari store lain
    detail.sudahDisimpan = watchlist.adaDiWatchlist(id)
    return detail
  }
})
```

> ⚠️ **Hati-hati Circular Dependency:** Jika `A` memanggil `B` dan `B` memanggil `A`, bisa terjadi **circular import** (saling tunggu). Solusinya: panggil `useXStore()` **di dalam action/function**, bukan di level atas store. Karena saat action dijalankan, semua store sudah terdaftar.

```javascript
// ❌ RISIKO circular: panggil di level atas
export const useA = defineStore('a', () => {
  const b = useB() // jika B juga panggil useA di atas → circular
})

// ✅ AMAN: panggil di dalam action (lazy)
export const useA = defineStore('a', () => {
  function doSomething() {
    const b = useB() // dipanggil saat runtime, sudah aman
  }
})
```

---

## ⚡ Actions Async & Error Handling Terpusat

Action sering melakukan request async. Tangani error di dalam action, kembalikan nilai sukses/gagal yang jelas.

```javascript
export const useMovieStore = defineStore('movie', () => {
  const trending = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  async function muatTrending() {
    isLoading.value = true
    error.value = null
    try {
      trending.value = (await tmdb.trending()) ?? []
    } catch (e) {
      error.value = e.message || 'Gagal memuat film'
    } finally {
      isLoading.value = false
    }
    return trending.value
  }

  return { trending, isLoading, error, muatTrending }
})
```

```vue
<!-- Komponen konsumsi -->
<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useMovieStore } from '@/stores/movieStore'

const movieStore = useMovieStore()
const { trending, isLoading, error } = storeToRefs(movieStore)

onMounted(() => movieStore.muatTrending())
</script>

<template>
  <div v-if="isLoading">⏳ Memuat...</div>
  <div v-else-if="error">❌ {{ error }}</div>
  <div v-else>
    <MovieCard v-for="f in trending" :key="f.id" :film="f" />
  </div>
</template>
```

| Pola Error | Keuntungan |
| --- | --- |
| Try/catch di action | Error tertangkap, state `error` tersedia di UI |
| Return boolean/sukses | Komponen tahu apa yang terjadi |
| State `isLoading` | UI bisa tampilkan spinner |

> 💡 **Tips:** Untuk error HTTP level rendah (401, 404, network), lebih baik ditangani di **Axios interceptor** (Bab 21) secara terpusat, lalu action cukup `try/catch` hasilnya.

---

## 🛡️ Best Practices — Jangan Mutasi State di Luar Action

Aturan emas Pinia: **semua perubahan state harus lewat action**. Jangan ubah `store.user` langsung dari komponen.

```vue
<!-- ❌ SALAH — komponen mengubah state langsung -->
<script setup>
const auth = useAuthStore()
auth.user = { name: 'Budi' }  // mutasi langsung dari komponen!
</script>

<!-- ✅ BENAR — panggil action -->
<script setup>
const auth = useAuthStore()
auth.setUser({ name: 'Budi' })  // lewat action
</script>
```

```javascript
// Di store:
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)

  // Action resmi untuk ubah user
  function setUser(data) {
    user.value = data
  }

  return { user, setUser }
})
```

### Daftar Best Practices Pinia

| Praktik | ✅ Benar | ❌ Salah |
| --- | --- | --- |
| Ubah state | Lewat action | `store.x = ...` di komponen |
| Baca state | Langsung / `storeToRefs` | — |
| Async logic | Di action | Di komponen |
| Cache | Di store (ref) | Di komponen lokal |
| Store besar | Pecah per domain | 1 store raksasa |
| ID store | Unik & deskriptif | Diduplikasi |

> 💡 **Tips:** Pinia punya opsi `strict` (melalui plugin) untuk melarang mutasi state di luar action. Di dev, ini menangkap pelanggaran sejak awal.

---

## 🔌 Plugin Persisted State (Alternatif Manual)

Alih-alih menulis `simpanKeStorage()` manual, pakai plugin `pinia-plugin-persistedstate`.

```bash
npm install pinia-plugin-persistedstate
```

```javascript
// main.js
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate) // pasang plugin
```

```javascript
// stores/watchlistStore.js — cukup tambahkan flag persist
export const useWatchlistStore = defineStore('watchlist', () => {
  const disimpan = ref([])
  const jumlah = computed(() => disimpan.value.length)

  function simpan(film) {
    if (!disimpan.value.some((f) => f.id === film.id)) {
      disimpan.value.push(film)
    }
  }
  function hapus(id) {
    disimpan.value = disimpan.value.filter((f) => f.id !== id)
  }

  return { disimpan, jumlah, simpan, hapus }
}, {
  persist: true, // ← otomatis simpan ke localStorage!
})
```

> 💡 **Tips:** Plugin ini otomatis menyimpan ke `localStorage` dengan key = nama store. Sangat menghemat boilerplate untuk store yang butuh persistensi.

---

## 📁 Struktur Folder Store yang Rapi

```
src/
├── stores/
│   ├── authStore.js        ← domain: autentikasi
│   ├── movieStore.js       ← domain: data film + cache
│   ├── watchlistStore.js   ← domain: watchlist + localStorage
│   └── index.js            ← (opsional) barrel export semua store
│
├── composables/
│   └── useTMDB.js          ← HTTP ke API, dipakai store
│
└── components/movie/
    └── MovieCard.vue       ← baca store via useMovieStore()
```

```javascript
// stores/index.js — barrel file (opsional)
export { useAuthStore } from './authStore'
export { useMovieStore } from './movieStore'
export { useWatchlistStore } from './watchlistStore'

// Dipakai di komponen: import { useMovieStore } from '@/stores'
```

> 💡 **Tips:** Simpan store di folder `stores/`, composable di `composables/`. Store boleh memanggil composable (seperti `useTMDB`), tapi composable **tidak** boleh memanggil store — agar composable tetap murni & reusable.

---

## 🎬 Studi Kasus — Fitur Watchlist End-to-End

**Skenario lengkap:** User login → buka `/browse` → klik film → di halaman detail tekan "➕ Watchlist" → `watchlistStore.simpan(film)` dipanggil (persist ke localStorage) → badge navbar `jumlah` naik → user buka `/profile` melihat daftar watchlist → refresh browser → daftar tetap ada.

```vue
<!-- MovieDetailView.vue -->
<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useMovieStore } from '@/stores/movieStore'
import { useWatchlistStore } from '@/stores/watchlistStore'

const route = useRoute()
const movieStore = useMovieStore()
const watchlistStore = useWatchlistStore()

// storeToRefs untuk state/getter
const { detailCache } = storeToRefs(movieStore)
const { disimpan, jumlah } = storeToRefs(watchlistStore)

onMounted(async () => {
  // ambilDetail pakai cache → tidak request ulang kalau sudah pernah buka
  await movieStore.ambilDetail(route.params.id)
})

const filmSekarang = computed(() => detailCache.value[route.params.id])
</script>

<template>
  <div v-if="filmSekarang">
    <h1>{{ filmSekarang.title }}</h1>

    <!-- Tombol toggle watchlist -->
    <button
      v-if="!watchlistStore.adaDiWatchlist(filmSekarang.id)"
      @click="watchlistStore.simpan(filmSekarang)"
    >
      ➕ Watchlist
    </button>
    <button
      v-else
      @click="watchlistStore.hapus(filmSekarang.id)"
    >
      ✓ Tersimpan (Hapus)
    </button>

    <p>Total watchlist: {{ jumlah }}</p>
  </div>
</template>
```

```vue
<!-- Navbar.vue — badge otomatis dari getter jumlah -->
<script setup>
import { storeToRefs } from 'pinia'
import { useWatchlistStore } from '@/stores/watchlistStore'
const { jumlah } = storeToRefs(useWatchlistStore())
</script>

<template>
  <RouterLink :to="{ name: 'profile' }">
    🔖 Watchlist <span class="badge">{{ jumlah }}</span>
  </RouterLink>
</template>
```

**Alur:**

```
Klik "➕ Watchlist"
  → watchlistStore.simpan(film)
  → disimpan.push + simpanKeStorage (localStorage)
  → getter jumlah naik
  → Navbar badge update otomatis ✅
  → refresh browser → disimpan dibaca dari localStorage → tetap ada ✅
```

---

## 🧮 Getters dengan Parameter (Getter yang Menerima Argumen)

Getter biasanya tanpa argumen. Tapi kadang kita butuh getter yang menerima parameter (mirip fungsi). Triknya: kembalikan **fungsi** dari getter.

```javascript
export const useMovieStore = defineStore('movie', () => {
  const trending = ref([
    { id: 1, genre: 'action', title: 'Film A' },
    { id: 2, genre: 'drama', title: 'Film B' },
  ])

  // Getter yang menerima parameter genre
  const byGenre = computed(() => {
    // kembalikan fungsi (closure)
    return (genre) => trending.value.filter((f) => f.genre === genre)
  })

  return { trending, byGenre }
})
```

```javascript
// Dipakai di komponen:
const movie = useMovieStore()
const filmAksi = movie.byGenre('action')  // panggil sebagai fungsi
// → [{ id:1, genre:'action', ... }]
```

> ⚠️ **Catatan:** Getter berbasis fungsi **tidak di-cache** (setiap panggilan menjalankan filter ulang). Untuk data besar & sering diakses, cache manual di state lebih baik.

---

## ♻️ Invalidasi Cache & Refresh Data

Cache menyimpan data, tapi kadang data di server berubah dan kita perlu **refresh** (invalidasi cache).

```javascript
export const useMovieStore = defineStore('movie', () => {
  const detailCache = ref({})

  async function ambilDetail(id, { force = false } = {}) {
    // force=true → abaikan cache, fetch ulang
    if (!force && detailCache.value[id]) return detailCache.value[id]
    const detail = await tmdb.detail(id)
    if (detail) detailCache.value[id] = detail
    return detail
  }

  // Hapus satu entry cache
  function invalidasi(id) {
    delete detailCache.value[id]
  }

  // Hapus semua cache (misal saat logout)
  function bersihkanCache() {
    detailCache.value = {}
  }

  return { detailCache, ambilDetail, invalidasi, bersihkanCache }
})
```

```vue
<!-- Tombol refresh di halaman detail -->
<button @click="movie.ambilDetail(id, { force: true })">
  🔄 Refresh
</button>
```

| Aksi | Efek |
| --- | --- |
| `ambilDetail(id)` | Pakai cache kalau ada |
| `ambilDetail(id, { force: true })` | Fetch ulang dari API |
| `invalidasi(id)` | Hapus 1 entry |
| `bersihkanCache()` | Reset semua (misal saat logout) |

---

## 🧩 Store Composition — Getter Lintas Store

Kadang sebuah store butuh menghitung dari store lain. Lakukan di dalam getter/action dengan memanggil store lain.

```javascript
// useMovieStore butuh tahu watchlist untuk bendera "sudah disimpan"
import { useWatchlistStore } from '@/stores/watchlistStore'

export const useMovieStore = defineStore('movie', () => {
  const watchlist = useWatchlistStore()  // lazy di dalam setup ✓

  const trending = ref([])

  // Getter yang menggabungkan data 2 store
  const trendingDenganFlag = computed(() =>
    trending.value.map((f) => ({
      ...f,
      sudahDisimpan: watchlist.adaDiWatchlist(f.id),
    }))
  )

  return { trending, trendingDenganFlag }
})
```

> 💡 **Tips:** Komposisi antar store begini membuat komponen tidak perlu tahu dua store sekaligus — store "induk" (movie) sudah menyediakan data gabungan. Komponen cukup baca `movie.trendingDenganFlag`.

---

## 🔌 Plugin Custom Pinia (Logger & Reset Global)

Pinia mendukung plugin: fungsi yang menerima `context` (`store`) dan bisa menambah properti/global behavior.

```javascript
// plugins/piniaLogger.js
export function piniaLogger({ store }) {
  // jalan saat store dibuat
  store.$subscribe((mutation, state) => {
    console.log(`[${store.$id}] ${mutation.type}`, state)
  })
}
```

```javascript
// main.js
import { createPinia } from 'pinia'
import { piniaLogger } from './plugins/piniaLogger'

const pinia = createPinia()
pinia.use(piniaLogger)  // pasang plugin
app.use(pinia)
```

```javascript
// Plugin menambah global $resetAll (reset semua store)
export function resetAllPlugin({ store }) {
  const originalReset = store.$reset?.bind(store)
  store.$resetAll = () => {
    // reset store ini
    originalReset?.()
  }
}
```

| Plugin Umum | Fungsi |
| --- | --- |
| Logger | Log tiap perubahan state (debug) |
| Persistedstate | Simpan otomatis ke localStorage |
| Reset all | Reset semua store saat logout |
| Api sync | Kirim perubahan state ke server |

> 💡 **Tips:** Plugin sangat powerful untuk cross-cutting concern (logging, persistensi, analytics). Tapi jangan taruh logika bisnis spesifik di plugin — biarkan di store masing-masing.

---

## 🗃️ Normalisasi State untuk Skala Besar

Saat data banyak & saling berelasi, simpan dalam bentuk **map (object by id)** bukan array flat — mempermudah lookup O(1).

```javascript
// ❌ Array flat: cari film butuh loop O(n)
const films = ref([ { id:1,...}, {id:2,...} ])
// films.value.find(f => f.id === 5)  ← O(n)

// ✅ Normalized: object keyed by id → O(1)
const filmsById = ref({})
// filmsById.value[5]  ← langsung!

function tambahFilm(f) {
  filmsById.value[f.id] = f   // set by id
}
function ambilFilm(id) {
  return filmsById.value[id]   // O(1) lookup
}
```

```javascript
// Kombinasi: ids (urutan) + entities (data)
const filmIds = ref([])                 // [1, 2, 3] (urutan tampilan)
const filmEntities = ref({})            // { 1: {...}, 2: {...} }

const daftarFilm = computed(() =>
  filmIds.value.map((id) => filmEntities.value[id])
)
```

| Bentuk | Lookup | Update |
| --- | --- | --- |
| Array flat | O(n) | splice/push |
| Object by id | O(1) | langsung by key |
| ids + entities | O(n) render, O(1) akses | rapi & predictable |

> 💡 **Tips:** Pola normalisasi (ids + entities) dipakai Redux/Pinia skala besar. Untuk data kecil (watchlist < 50), array biasa sudah cukup.

---

## 🧪 Testing Multi-Store dengan Vitest

Saat store saling bergantung, test dengan `setActivePinia` dan mock bila perlu.

```javascript
// stores/watchlistStore.spec.js
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import { useWatchlistStore } from '@/stores/watchlistStore'

beforeEach(() => setActivePinia(createPinia()))

it('simpan ditolak kalau belum login', () => {
  const auth = useAuthStore()
  const watchlist = useWatchlistStore()
  // auth.isLoggedIn = false (default)
  expect(() => watchlist.simpan({ id: 1, title: 'X' }))
    .toThrow('Harus login dulu')
})

it('simpan berhasil kalau sudah login', () => {
  const auth = useAuthStore()
  const watchlist = useWatchlistStore()
  auth.token = 'dummy'          // simulasikan login
  watchlist.simpan({ id: 1, title: 'X' })
  expect(watchlist.jumlah).toBe(1)
})
```

| Langkah | Penjelasan |
| --- | --- |
| `setActivePinia(createPinia())` | Pinia aktif per test |
| Panggil store berurutan | Store saling kenal (same pinia) |
| Set state manual | Simulasikan kondisi (login/logout) |

> 💡 **Tips:** Jangan takut test store yang memanggil store lain — karena `setActivePinia` membuat semua store dalam satu "universe" yang sama, interaksi antar mereka otomatis jalan.

---

## ⚡ Performance: `watch` vs `$subscribe` vs Getter

Memantau perubahan store punya beberapa cara; pilih yang tepat agar tidak membuang performa.

```javascript
import { watch } from 'vue'
const movie = useMovieStore()

// 1. watch pada state tertentu — jalan saat nilai itu berubah
watch(() => movie.trending, (baru) => {
  console.log('trending berubah')
})

// 2. $subscribe — jalan SETIAP state berubah (dengan info mutation)
const off = movie.$subscribe((mutation, state) => {
  console.log('ada perubahan:', mutation.type)
})
// off() untuk berhenti

// 3. getter — bukan untuk "watch", tapi untuk nilai turunan otomatis
const populer = computed(() => movie.trendingDenganFlag)
```

| Cara | Trigger | Untuk |
| --- | --- | --- |
| `watch(state)` | State spesifik berubah | Reaksi ke 1 nilai |
| `$subscribe` | State apa pun berubah | Sync eksternal (localStorage) |
| `getter/computed` | Dependensi berubah | Nilai turunan di UI |
| Action | Dipanggil manual | Logika ubah state |

> ⚠️ **Catatan:** Jangan pakai `$subscribe` untuk sekadar menghitung nilai turunan — itu tugas getter. `$subscribe` mahal (jalan tiap perubahan state manapun). Gunakan hanya untuk side-effect eksternal.

---

## 🔥 Store Lifecycle & HMR (Hot Module Replacement)

Saat development (`npm run dev`), Pinia mendukung HMR — mengganti store tanpa reload halaman.

```javascript
// stores/authStore.js
export const useAuthStore = defineStore('auth', () => {
  // ...state, getters, actions
})

// Tambahkan blok ini di bawah untuk HMR (dev only)
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    // Pinia otomatis hot-reload store ini
  })
}
```

```
Keuntungan HMR Pinia:
  ✅ Ubah logic action → langsung kebab tanpa refresh
  ✅ State tetap utuh saat edit store
  ✅ Lebih cepat iterasi saat development
```

> 💡 **Tips:** HMR untuk store otomatis aktif di project Vite + Pinia modern. Kamu biasanya tidak perlu menulis blok `import.meta.hot` manual — cukup nikmati pengalaman edit tanpa reload.

---

## ✅ Checklist Kesehatan Store (Store Health Checklist)

Sebelum menyatakan store "selesai", lewati daftar periksa ini.

```
□ Apakah satu store hanya menangani SATU domain?
□ Apakah semua perubahan state lewat ACTION (bukan dari komponen)?
□ Apakah getter bersifat READ-ONLY (tidak mutasi state)?
□ Apakah action async menangani error (try/catch)?
□ Apakah state yang perlu bertahan pakai persistensi (localStorage/plugin)?
□ Apakah data yang di-fetch berulang sudah di-CACHE?
□ Apakah store tidak saling circular (call di dalam action)?
□ Apakah ada unit test untuk action penting?
□ Apakah penamaan & struktur folder konsisten?
□ Apakah store tidak kelebihan beban (pecah kalau > 200 baris)?
```

| Gejala | Kemungkinan Masalah |
| --- | --- |
| Store > 300 baris | Terlalu banyak domain → pecah |
| Mutasi state di komponen | Kurang disiplin action |
| Request API berulang | Cache belum dipasang |
| Refresh hilangkan data | Persistensi belum ada |
| Test sulit | Logika tercampur dengan UI |

> 💡 **Tips:** Checklist ini bukan aturan kaku, tapi guardrail. Project kecil boleh lebih longgar; project produksi sebaiknya patuh semua.

---

## 🔗 Contoh Alur Data Lengkap Netflix (3 Store Bekerja Sama)

Mari rangkum bagaimana ketiga store berkolaborasi dalam satu alur nyata.

```
┌────────────────────────────────────────────────────────────┐
│ 1. LOGIN                                                    │
│    HomeView → authStore.login()                             │
│    → token & user tersimpan + localStorage                  │
│    → router guard izinkan akses /browse                     │
├────────────────────────────────────────────────────────────┤
│ 2. TAMPIL FILM                                              │
│    BrowseView → movieStore.muatTrending()                   │
│    → useTMDB (axios + interceptor) → TMDB API               │
│    → trending disimpan, getter filmTrending (20 teratas)    │
├────────────────────────────────────────────────────────────┤
│ 3. DETAIL + CACHE                                           │
│    MovieDetailView → movieStore.ambilDetail(id)             │
│    → cek detailCache → MISS → fetch, simpan cache           │
│    → buka lagi → HIT cache (tanpa API call)                 │
├────────────────────────────────────────────────────────────┤
│ 4. WATCHLIST (persist)                                      │
│    klik ➕ → watchlistStore.simpan(film)                    │
│    → push + simpanKeStorage (localStorage)                  │
│    → getter jumlah naik → Navbar badge update              │
├────────────────────────────────────────────────────────────┤
│ 5. REFRESH                                                  │
│    reload browser → authStore baca token dari localStorage  │
│    → watchlistStore baca daftar dari localStorage           │
│    → user tetap login & watchlist tetap ada ✅              │
└────────────────────────────────────────────────────────────┘
```

```javascript
// Semua store terhubung lewat composable/axios di bawahnya:
//   authStore ─┐
//   movieStore ─┼─→ useTMDB ─→ lib/axios (interceptor API key)
//   watchlist ─┘       └──→ localStorage (persist)
```

> 💡 **Tips:** Arsitektur ini (store per domain + composable HTTP + interceptor) adalah tulang punggung aplikasi Vue produksi. Pahami alur di atas, dan kamu sudah siap membangun fitur apa pun di Netflix clone (Bab 24).

---

## 🗺️ Peta Keputusan: Kapan Cache, Kapan Persist, Kapan Fetch Ulang

Tiga strategi data sering tertukar: **caching** (simpan di memori), **persistence** (simpan ke localStorage), dan **refetch** (ambil ulang dari server). Masing-masing untuk tujuan berbeda.

```
┌───────────────────────────────────────────────────────────────┐
│ Data ini...                                                     │
│                                                                │
│  ...mahal diambil & jarang berubah dalam 1 sesi?               │
│     → CACHE di store (ref/object) — hemat API call             │
│       contoh: detail film, daftar genre                        │
│                                                                │
│  ...harus bertahan setelah browser ditutup/refresh?            │
│     → PERSIST ke localStorage / plugin                         │
│       contoh: watchlist, token, preferensi tema                │
│                                                                │
│  ...sering berubah di server & harus selalu fresh?             │
│     → REFETCH tiap buka (atau interval)                        │
│       contoh: notifikasi, harga real-time, "sedang trending"   │
└───────────────────────────────────────────────────────────────┘
```

| Strategi | Umur Data | Hilang saat refresh? | Contoh |
| --- | --- | --- | --- |
| **Cache (memori)** | 1 sesi tab | ✅ Ya | detailCache film |
| **Persist (localStorage)** | Permanen | ❌ Tidak | watchlist, token |
| **Refetch** | Selalu baru | — (selalu ambil) | notifikasi, trending live |
| **Cache + TTL** | Sampai kadaluarsa | ✅ Ya | daftar per genre (5 menit) |

```javascript
// ✅ Pola Cache + TTL (Time To Live) — cache yang bisa "basi"
export const useMovieStore = defineStore('movie', () => {
  const cache = ref({}) // { id: { data, waktu } }
  const TTL = 5 * 60 * 1000 // 5 menit dalam ms

  async function ambilDetail(id) {
    const entry = cache.value[id]
    const masihSegar = entry && (Date.now() - entry.waktu) < TTL

    if (masihSegar) return entry.data       // ✅ cache HIT & belum basi

    const data = await tmdb.detail(id)       // ❌ MISS atau basi → fetch
    cache.value[id] = { data, waktu: Date.now() }
    return data
  }

  return { cache, ambilDetail }
})
```

> 💡 **Tips:** Cache murni cocok untuk data yang "cukup akurat" selama satu sesi. Jika akurasi kritis (saldo, stok), pilih refetch atau TTL pendek. Watchlist yang harus abadi → persist, bukan sekadar cache.

---

## 🧊 Pola Optimistic Update — UI Responsif Instan

Saat user menekan "❤️ Suka", haruskah UI menunggu server merespons dulu? **Optimistic update** langsung mengubah UI (asumsikan sukses), lalu membatalkan (rollback) jika ternyata gagal. Hasilnya UI terasa instan.

```javascript
// ❌ PESSIMISTIC: tunggu server → UI terasa lambat
async function suka(film) {
  const hasil = await api.tambahSuka(film.id) // user menunggu... ⏳
  if (hasil.ok) film.disukai = true            // baru update setelah balas
}
```

```javascript
// ✅ OPTIMISTIC: ubah UI dulu, rollback kalau gagal
export const useWatchlistStore = defineStore('watchlist', () => {
  const disimpan = ref([])

  async function simpan(film) {
    // ① Optimistic: langsung tambahkan (UI update seketika)
    disimpan.value.push(film)

    try {
      // ② Sinkron ke server di belakang layar
      await api.simpanWatchlist(film.id)
    } catch (e) {
      // ③ Gagal → ROLLBACK, kembalikan seperti semula
      disimpan.value = disimpan.value.filter((f) => f.id !== film.id)
      throw new Error('Gagal menyimpan, coba lagi')
    }
  }

  return { disimpan, simpan }
})
```

```
ALUR OPTIMISTIC UPDATE:

Klik ❤️
   ↓
UI langsung berubah (film masuk daftar) ← user senang, terasa instan ✅
   ↓
Request ke server (background)
   ├── Sukses → biarkan (UI sudah benar)
   └── Gagal  → rollback (film dikeluarkan lagi) + tampilkan error
```

| Pendekatan | Kecepatan Terasa | Risiko | Cocok untuk |
| --- | --- | --- | --- |
| Pessimistic | 🟡 Lambat (nunggu) | 🟢 Aman | Transaksi kritis (bayar) |
| Optimistic | 🟢 Instan | 🟡 Perlu rollback | Like, watchlist, toggle |

> ⚠️ **Catatan:** Optimistic update wajib punya **rollback** yang benar. Jika kamu lupa mengembalikan state saat gagal, UI akan menampilkan data palsu (user kira tersimpan padahal tidak). Selalu simpan snapshot atau tahu cara membalikkan aksi.

---

## 🔐 Reset Store saat Logout — Cross-Store Cleanup

Saat user logout, **semua store berisi data pribadi harus dibersihkan** — bukan hanya `authStore`. Jika tidak, user berikutnya bisa melihat watchlist/cache user sebelumnya (kebocoran data!).

```javascript
// ❌ SALAH: hanya reset authStore, sisa data pribadi tertinggal
function logout() {
  auth.$reset()
  // watchlist & cache film user lama MASIH ADA → bocor ke user baru! 🔴
}
```

```javascript
// ✅ BENAR: reset SEMUA store yang berisi data pribadi
// stores/authStore.js
import { useWatchlistStore } from '@/stores/watchlistStore'
import { useMovieStore } from '@/stores/movieStore'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)

  function logout() {
    // ① bersihkan auth
    user.value = null
    token.value = null
    localStorage.removeItem('token')

    // ② bersihkan store lain (lazy call di dalam action = aman)
    useWatchlistStore().$reset()
    useMovieStore().bersihkanCache()
  }

  return { user, token, logout }
})
```

```javascript
// ✅ ALTERNATIF ELEGAN: plugin reset global (sekali pasang, semua store dapat)
// plugins/resetPlugin.js
export function resetPlugin({ store }) {
  const initial = JSON.parse(JSON.stringify(store.$state)) // snapshot awal
  store.$resetKe = () => store.$patch(JSON.parse(JSON.stringify(initial)))
}

// main.js → pinia.use(resetPlugin)
// Lalu saat logout, iterasi semua store dan panggil $reset()
```

| Data yang perlu di-reset saat logout | Store |
| --- | --- |
| user, token | `authStore` |
| watchlist pribadi | `watchlistStore` |
| cache detail (bisa berisi progress tonton) | `movieStore` |
| preferensi (opsional, boleh dipertahankan) | `themeStore` |

> 🛡️ **Keamanan:** Reset store saat logout adalah **isu keamanan**, bukan sekadar kerapian. Di perangkat bersama (warnet, komputer keluarga), lupa membersihkan store membuat data satu user terlihat oleh user berikutnya. Selalu bersihkan pada `logout()`.

> 💡 **Tips:** Buat satu action `logout()` di `authStore` yang menjadi "pusat kendali" cleanup. Komponen cukup memanggil `auth.logout()` — mereka tidak perlu tahu store apa saja yang harus dibersihkan.

---

## 🆚 Setup Store vs Options Store — Dua Gaya Menulis Pinia

Pinia mendukung **dua gaya** penulisan store. Sepanjang bab ini kita pakai *setup store* (fungsi), tapi kamu akan sering menemui *options store* di kode orang lain. Pahami keduanya.

```javascript
// ════════════════════════════════════════════
// GAYA 1: OPTIONS STORE (mirip Options API)
// ════════════════════════════════════════════
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  // state = fungsi yang mengembalikan objek (seperti data())
  state: () => ({
    count: 0,
    nama: 'Budi',
  }),
  // getters = nilai turunan (seperti computed)
  getters: {
    double: (state) => state.count * 2,
    // getter yang pakai getter lain → pakai 'this'
    quadruple() {
      return this.double * 2
    },
  },
  // actions = fungsi pengubah state (boleh async)
  actions: {
    tambah() {
      this.count++          // di options store, pakai this
    },
    async muat() {
      this.count = await api.getCount()
    },
  },
})
```

```javascript
// ════════════════════════════════════════════
// GAYA 2: SETUP STORE (mirip <script setup>) — dipakai di bab ini
// ════════════════════════════════════════════
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  // state = ref/reactive
  const count = ref(0)
  const nama  = ref('Budi')

  // getters = computed
  const double    = computed(() => count.value * 2)
  const quadruple = computed(() => double.value * 2)

  // actions = fungsi biasa (TANPA this)
  function tambah() { count.value++ }
  async function muat() { count.value = await api.getCount() }

  // WAJIB return semua yang mau diekspos
  return { count, nama, double, quadruple, tambah, muat }
})
```

### 📊 Perbandingan Dua Gaya

| Aspek | Options Store | Setup Store |
| --- | --- | --- |
| Sintaks | Objek `{ state, getters, actions }` | Fungsi yang return objek |
| State | `state: () => ({...})` | `ref`/`reactive` |
| Getters | `getters: {}` | `computed` |
| Actions | `actions: {}` + `this` | `function` tanpa `this` |
| `this` | Dipakai | Tidak ada |
| Fleksibilitas (watch, composable) | Terbatas | ✅ Bebas (bisa `watch`, panggil composable) |
| Rekomendasi modern | Oke untuk store simpel | ✅ Lebih fleksibel & konsisten dengan `<script setup>` |

> 💡 **Rekomendasi:** Gunakan **setup store** karena konsisten dengan `<script setup>`, bisa memakai `watch`, dan mudah memanggil composable seperti `useTMDB`. Options store tetap valid dan sedikit lebih ringkas untuk store yang sangat sederhana.

> ⚠️ **Jangan lupa `return` di setup store!** Berbeda dengan `<script setup>` yang auto-expose, setup store **wajib** me-`return` state/getter/action yang ingin dipakai komponen. Lupa `return` = properti `undefined` di komponen.

---

## 🔄 `$patch`, `$reset`, `$state` — API Instance Store

Setiap store punya API bawaan yang berguna. Mari kupas tiga yang paling sering dipakai.

```javascript
const movie = useMovieStore()

// ── $patch: ubah banyak state sekaligus (efisien, 1x trigger) ──
movie.$patch({
  trending: [],
  isLoading: false,
})

// ── $patch dengan fungsi: untuk mutasi kompleks (push, filter) ──
movie.$patch((state) => {
  state.trending.push(filmBaru)
  state.error = null
})

// ── $reset: kembalikan store ke state awal (HANYA options store!) ──
movie.$reset()   // ⚠️ tidak otomatis ada di setup store

// ── $state: akses/ganti seluruh state ──
console.log(movie.$state)          // baca semua state
movie.$state = { trending: [...] } // ganti (jarang dipakai)
```

### ⚠️ `$reset` di Setup Store

`$reset()` **tidak tersedia otomatis** di setup store karena Pinia tidak tahu "state awal". Kamu harus membuatnya manual:

```javascript
// Setup store: buat reset manual
export const useMovieStore = defineStore('movie', () => {
  const trending  = ref([])
  const isLoading = ref(false)

  // reset manual
  function $reset() {
    trending.value = []
    isLoading.value = false
  }

  return { trending, isLoading, $reset }
})
```

### 📊 Kapan Pakai yang Mana?

| Kebutuhan | Gunakan |
| --- | --- |
| Ubah 1 state | Action biasa (`state.x = ...`) |
| Ubah beberapa state sekaligus | `$patch({ ... })` |
| Mutasi array/kompleks efisien | `$patch(state => {...})` |
| Kembali ke kondisi awal | `$reset()` (options) / manual (setup) |
| Baca snapshot seluruh state | `movie.$state` |

> 💡 **Kenapa `$patch` lebih baik dari banyak assignment?** Beberapa assignment terpisah memicu reaktivitas berkali-kali; `$patch` menggabungkannya menjadi **satu** notifikasi perubahan. Untuk update besar (misal setelah fetch), `$patch` lebih hemat.

---

## 🧭 Getter Berantai & Getter yang Bergantung pada State Async

Getter bisa saling bergantung, membentuk rantai perhitungan yang tetap efisien karena masing-masing di-cache.

```javascript
export const useMovieStore = defineStore('movie', () => {
  const semuaFilm = ref([])
  const filterGenre = ref('semua')
  const urutan = ref('rating')  // 'rating' | 'tahun'

  // Getter 1: filter berdasarkan genre
  const filmTerfilter = computed(() => {
    if (filterGenre.value === 'semua') return semuaFilm.value
    return semuaFilm.value.filter(f => f.genre === filterGenre.value)
  })

  // Getter 2: bergantung pada Getter 1, lalu diurutkan
  const filmTerurut = computed(() => {
    // salin dulu agar tidak mutasi array asli!
    return [...filmTerfilter.value].sort((a, b) => {
      if (urutan.value === 'rating') return b.rating - a.rating
      return b.tahun - a.tahun
    })
  })

  // Getter 3: bergantung pada Getter 2, ambil 10 teratas
  const top10 = computed(() => filmTerurut.value.slice(0, 10))

  return { semuaFilm, filterGenre, urutan, filmTerfilter, filmTerurut, top10 }
})
```

```
RANTAI GETTER (masing-masing di-cache):

semuaFilm + filterGenre  →  filmTerfilter  →  filmTerurut  →  top10
                              (cache)          (cache)         (cache)

Ubah 'urutan' → hanya filmTerurut & top10 dihitung ulang
                (filmTerfilter TIDAK dihitung ulang → hemat!)
```

> ⚠️ **Jangan mutasi array di dalam getter!** `.sort()` mengubah array aslinya. Selalu salin dulu dengan `[...array]` sebelum `.sort()`, atau kamu akan diam-diam memutasi state — melanggar aturan getter harus read-only.

> 💡 **Keuntungan rantai getter:** Karena tiap `computed` di-cache berdasarkan dependensinya, mengubah satu input hanya memicu perhitungan ulang getter yang benar-benar terpengaruh. Ini membuat UI kompleks tetap cepat.

---

## 🔬 Membedah `storeToRefs` — Kenapa Wajib?

Ini salah satu sumber bug tersering pemula Pinia. Kalau kamu destructure store langsung, **reaktivitas hilang**.

```vue
<script setup>
import { storeToRefs } from 'pinia'
import { useMovieStore } from '@/stores/movieStore'

const movieStore = useMovieStore()

// ❌ SALAH — destructure langsung → state jadi nilai statis!
const { trending, isLoading } = movieStore
// trending & isLoading TIDAK akan update saat store berubah 🔴

// ✅ BENAR — storeToRefs menjaga reaktivitas state & getter
const { trending, isLoading } = storeToRefs(movieStore)
// trending & isLoading tetap reaktif ✅

// ✅ ACTIONS di-destructure LANGSUNG (bukan lewat storeToRefs)
const { muatTrending, ambilDetail } = movieStore
// fungsi tidak perlu reaktivitas, ambil langsung
</script>
```

### 📊 Aturan Destructuring Store

| Yang di-destructure | Cara benar | Alasan |
| --- | --- | --- |
| State (`ref`) | `storeToRefs(store)` | Jaga reaktivitas |
| Getter (`computed`) | `storeToRefs(store)` | Jaga reaktivitas |
| Action (fungsi) | Langsung `store.aksi` | Fungsi tak butuh reaktivitas |

```javascript
// Pola lengkap yang benar:
const store = useMovieStore()
const { trending, isLoading, error } = storeToRefs(store)  // state + getter
const { muatTrending, ambilDetail } = store                // actions
```

> 🎯 **Analogi:** `storeToRefs` seperti "menarik kabel listrik" dari store ke variabelmu — koneksi tetap tersambung. Destructure biasa seperti "memfoto" nilainya sekali; foto tidak berubah walau aslinya berubah.

> 💡 **Kenapa Pinia tidak otomatis?** Karena destructuring adalah operasi JavaScript murni yang "menyalin" nilai. Pinia tidak bisa mengintervensi sintaks bahasa. `storeToRefs` adalah jembatan resmi untuk mengubah properti store menjadi `ref` yang tetap terhubung.

---

## 🚨 Jebakan Umum Pemula di Bab 20

### ❌ Jebakan 1 — Mutasi State Langsung dari Komponen
```javascript
// ❌ SALAH
const movie = useMovieStore()
movie.trending = [] // ubah state di komponen

// ✅ BENAR
movie.resetTrending() // lewat action
```

---

### ❌ Jebakan 2 — Circular Dependency antar Store
```javascript
// ❌ SALAH — A panggil B di atas, B panggil A di atas → circular
// ✅ BENAR — panggil useXStore() di dalam action (lazy)
function doSomething() { const b = useB() }
```

---

### ❌ Jebakan 3 — Lupa `JSON.parse`/`stringify` di localStorage
```javascript
// ❌ SALAH — simpan object langsung → jadi "[object Object]"
localStorage.setItem('watchlist', disimpan.value)

// ✅ BENAR
localStorage.setItem('watchlist', JSON.stringify(disimpan.value))
// dan baca: JSON.parse(localStorage.getItem('watchlist') ?? '[]')
```

---

### ❌ Jebakan 4 — Cache Tidak Dipakai (Request Berulang)
```javascript
// ❌ SALAH — selalu fetch, cache percuma
async function ambilDetail(id) {
  const d = await tmdb.detail(id)
  detailCache.value[id] = d
  return d
}

// ✅ BENAR — cek cache dulu
async function ambilDetail(id) {
  if (detailCache.value[id]) return detailCache.value[id]
  const d = await tmdb.detail(id)
  detailCache.value[id] = d
  return d
}
```

---

### ❌ Jebakan 5 — Satu Store Raksasa
```javascript
// ❌ SALAH — semua domain di 1 store (800+ baris)
useAppStore() // user + film + watchlist + tema + notif

// ✅ BENAR — pecah per domain
useAuthStore(); useMovieStore(); useWatchlistStore()
```

---

## 📝 Ringkasan Bab 20

| Konsep | Penjelasan |
| --- | --- |
| **Satu store = satu domain** | Pisahkan state berdasar tanggung jawab |
| **`movieStore`** | State film + `detailCache` untuk caching |
| **Caching** | Cek cache sebelum fetch → hemat API & lebih cepat |
| **`watchlistStore`** | Persistensi manual ke localStorage |
| **Store-to-store** | Panggil `useXStore()` di dalam action store lain |
| **Async action** | `try/catch`, state `isLoading` & `error` |
| **Best practice** | Jangan mutasi state di luar action |
| **Plugin persist** | `pinia-plugin-persistedstate` otomatis simpan |
| **Circular dep** | Hindari dengan lazy call di dalam action |

---

## 🎯 Latihan Mandiri

**⭐ Latihan 1 — Store dengan Cache**
Buat `productStore` dengan `detailCache` (object). Action `ambil(id)` harus cek cache dulu, baru fetch (simulasi `setTimeout`). Pastikan pemanggilan kedua tidak menunggu.

**⭐⭐ Latihan 2 — Persistensi localStorage**
Buat `noteStore` dengan `notes` (array). Setiap `tambah(teks)`/`hapus(id)` menulis ke localStorage. Saat store dibuat, baca dari localStorage agar data bertahan refresh.

**⭐⭐⭐ Latihan 3 — Store-to-Store**
Buat `authStore` (isLoggedIn) dan `favoriteStore` (daftar favorit). `favoriteStore.simpan()` harus menolak (throw error) kalau `authStore.isLoggedIn` false. Hubungkan keduanya.

**⭐⭐⭐⭐ Latihan 4 — Netflix Watchlist Mini**
Gabungkan `movieStore` (trending + cache) dan `watchlistStore` (localStorage). Tampilkan 10 film trending, tiap film punya tombol watchlist yang berubah status, badge jumlah di navbar, dan data bertahan setelah refresh.

---

*Lanjut ke ➡️ **Bab 21 — 🌐 HTTP Request & Integrasi API***
