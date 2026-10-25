# 🗺️ Bab 17 — Vue Router Dasar

> *"Rute adalah jalan raya dalam aplikasi kita. Tanpa peta yang jelas, pengguna akan tersesat; dengan router yang tepat, mereka meluncur dari halaman ke halaman seolah aplikasi punya ruang tanpa dinding."*

---

> **🧠 Apa Itu Vue Router?**
>
> Vue Router adalah **library resmi** untuk menangani navigasi (perpindahan halaman) di dalam aplikasi Vue. Secara teknis, Vue Router memetakan sebuah **URL** ke sebuah **komponen Vue** yang harus ditampilkan. Tanpa router, aplikasi Vue hanyalah satu halaman statis yang tidak bisa berpindah kemana-mana. Dengan router, kita bisa membangun **SPA (Single Page Application)** — aplikasi yang terasa seperti punya banyak "halaman", namun sebenarnya hanya ada satu file HTML yang kontennya diganti secara dinamis oleh JavaScript.
>
> Vue Router versi 4 dirancang khusus untuk Vue 3 dan bekerja sangat erat dengan Composition API. Ia menangani sejarah browser (back/forward button), animasi transisi, dan proteksi halaman — semua tanpa memuat ulang halaman.

---

> **🏗️ Analogi Sederhana:**
>
> Bayangkan aplikasi Vue seperti sebuah **gedung apartemen** dengan banyak kamar. Setiap kamar adalah sebuah "halaman" (komponen). Vue Router adalah **resepsionis** di lobi yang, begitu kamu sebutkan nomor kamar (URL), akan membawamu ke kamar yang tepat tanpa harus membongkar dan membangun ulang seluruh gedung. Kamu tetap berada di dalam gedung yang sama (SPA), hanya ruangan yang berubah. Berbeda dengan website lawas (MPA) di mana setiap pindah kamar berarti **keluar gedung, naik mobil, dan masuk gedung baru** — jauh lebih lambat.

---

## 📋 Daftar Isi Bab 17

1. Mengapa Aplikasi Modern Butuh Router?
2. Konsep Dasar: URL, Route, dan Component
3. Mendefinisikan Routes — Anatomi `router/index.js`
4. Lazy Loading (Dynamic Import) — Mengapa Krusial?
5. Path Statis vs Parameter Dinamis `:id`
6. Query Parameters (`?q=...`) — Membaca data dari URL
7. Named Routes — Navigasi berbasis nama, bukan path
8. Navigation Deklaratif dengan `<RouterLink>`
9. Navigation Programmatik dengan `useRouter` & `useRoute`
10. Navigation Guards — Global, Per-Route, dan In-Component
11. Scroll Behavior — Kembali ke Atas Saat Pindah Halaman
12. Studi Kasus — Melindungi Halaman `/browse` dengan Auth Guard
13. Jebakan Umum Pemula di Bab 17
14. Ringkasan & Latihan Mandiri

---

## 🔍 Mengapa Aplikasi Modern Butuh Router?

Sebelum masuk ke kode, penting memahami **masalah yang diselesaikan** router. Di masa lalu, setiap halaman adalah file HTML terpisah. Pindah halaman = memuat ulang seluruh dokumen. Ini lambat dan membuat state hilang.

SPA mengubah paradigma: hanya ada **satu** `index.html`. Vue Router mengganti komponen yang dirender di dalamnya berdasarkan URL. Keuntungannya:

| Keuntungan SPA + Router | Penjelasan |
| --- | --- |
| ⚡ Navigasi instan | Tidak ada full-page reload; hanya konten yang diganti |
| 💾 State tetap hidup | Data di komponen tidak hilang saat pindah route |
| 🔙 Tombol back/forward | Router mengelola history browser secara otomatis |
| 📦 Bundle lebih ringan | Halaman di-load sesuai kebutuhan (lazy loading) |
| 🔗 URL bookmark-able | Tiap "halaman" punya URL unik yang bisa dibagikan |

> 💡 **Catatan Penting:** Vue Router menggunakan `createWebHistory` yang memanfaatkan **History API** browser modern. Hasilnya URL terlihat bersih (`/movie/123`), bukan `#/movie/123` seperti versi hash lama. Namun saat di-deploy ke production, server harus dikonfigurasi agar semua URL mengarah ke `index.html` (SPA fallback). Jika tidak, refresh di `/movie/123` akan memunculkan 404 dari server.

---

## 🧱 Konsep Dasar: URL, Route, dan Component

Mari pahami tiga istilah kunci yang akan kita pakai sepanjang bab ini:

```
URL     → Alamat di address bar browser, misal: /browse
Route   → Aturan pemetaan: "JIKA URL = /browse, TAMPILKAN komponen BrowseView"
Component→ Komponen Vue (.vue) yang menjadi isi halaman tersebut
```

Alur kerjanya sederhana:

```
User mengetik /browse
        ↓
Vue Router mencocokkan URL dengan daftar routes
        ↓
Router menemukan route dengan path: '/browse'
        ↓
Router merender komponen BrowseView di dalam <RouterView>
        ↓
User melihat halaman Browse ✅
```

`<RouterView>` adalah "kanvas" kosong di `App.vue` tempat halaman aktif digambar. Tanpa `<RouterView>`, router tidak punya tempat untuk menampilkan komponen.

---

## 🗺️ Mendefinisikan Routes — Anatomi `router/index.js`

Semua rute didefinisikan dalam sebuah **array** dan diberikan ke `createRouter`. Mari kita bedah file `router/index.js` dari awal hingga akhir.

```javascript
// ─────────────────────────────────────────────────────────────
// BAGIAN 1: IMPORT — semua yang dibutuhkan router
// ─────────────────────────────────────────────────────────────
import { createRouter, createWebHistory } from 'vue-router'
// createRouter    → fungsi pabrik untuk membuat instance router
// createWebHistory→ mode history HTML5 (URL bersih tanpa #)

import { useAuthStore } from '@/stores/authStore'
// Store Pinia untuk mengecek status login di navigation guard

// ─────────────────────────────────────────────────────────────
// BAGIAN 2: LAZY LOADING — setiap halaman diimpor saat dibutuhkan
// () => import(...) adalah dynamic import (code splitting)
// ─────────────────────────────────────────────────────────────
const HomeView        = () => import('@/views/HomeView.vue')        // Landing page
const BrowseView      = () => import('@/views/BrowseView.vue')      // Beranda setelah login
const MovieDetailView = () => import('@/views/MovieDetailView.vue') // Detail film
const SearchView      = () => import('@/views/SearchView.vue')      // Hasil pencarian
const ProfileView     = () => import('@/views/ProfileView.vue')     // Profil user
const NotFoundView    = () => import('@/views/NotFoundView.vue')    // Halaman 404

// ─────────────────────────────────────────────────────────────
// BAGIAN 3: ARRAY ROUTES — jantung konfigurasi navigasi
// ─────────────────────────────────────────────────────────────
const routes = [
  {
    path:      '/',                 // URL yang ditangkap
    name:      'home',              // Nama unik (untuk navigasi)
    component: HomeView,            // Komponen yang dirender
    meta: { requiresGuest: true },  // Data bebas: hanya untuk tamu
  },
  {
    path:      '/browse',
    name:      'browse',
    component: BrowseView,
    meta: { requiresAuth: true },   // Butuh login
  },
  {
    path:      '/movie/:id',        // :id = parameter dinamis
    name:      'movie-detail',
    component: MovieDetailView,
    meta: { requiresAuth: true },
  },
  {
    path:      '/search',
    name:      'search',
    component: SearchView,
    meta: { requiresAuth: true },
  },
  {
    path:      '/profile',
    name:      'profile',
    component: ProfileView,
    meta: { requiresAuth: true },
  },
  {
    path:      '/:pathMatch(.*)*',  // Wildcard: tangkap semua URL sisa
    name:      'not-found',
    component: NotFoundView,
  },
]

// ─────────────────────────────────────────────────────────────
// BAGIAN 4: BUAT ROUTER + EXPORT
// ─────────────────────────────────────────────────────────────
const router = createRouter({
  history: createWebHistory(),  // URL bersih (tanpa #)
  routes,                       // Daftar route di atas
})

export default router
```

Setiap objek route memiliki properti berikut:

| Properti | Wajib? | Fungsi |
| --- | --- | --- |
| `path` | ✅ | Pola URL yang dicocokkan (bisa berisi `:param`) |
| `name` | ⛔ | Nama unik rute — untuk navigasi tanpa menulis ulang path |
| `component` | ✅ | Komponen Vue yang dirender saat route aktif |
| `meta` | ⛔ | Objek bebas untuk data tambahan (role, auth, layout, dll) |
| `children` | ⛔ | Array route bersarang (dibahas Bab 18) |
| `props` | ⛔ | Meneruskan params sebagai props (dibahas Bab 18) |
| `redirect` | ⛔ | Alihkan route ini ke route lain |
| `alias` | ⛔ | Nama alias URL lain untuk route yang sama |

> 💡 **Tips:** Selalu berikan `name` pada setiap route. Navigasi berbasis `name` jauh lebih aman daripada `path` karena jika suatu saat `path` berubah, semua `router.push({ name: 'browse' })` tetap berfungsi.

---

## 🐌 Lazy Loading (Dynamic Import) — Mengapa Krusial?

Perhatikan sintaks `() => import('@/views/HomeView.vue')`. Ini disebut **dynamic import** dan merupakan fitur *code-splitting* bawaan Vite/Webpack.

### Apa bedanya dengan import biasa?

```javascript
// ❌ EAGER LOADING — semua komponen di-load sekaligus saat app start
import HomeView from '@/views/HomeView.vue'
import BrowseView from '@/views/BrowseView.vue'
// ...semua file digabung jadi 1 bundle raksasa
// User harus download SEMUANYA sebelum halaman pertama muncul!

// ✅ LAZY LOADING — komponen di-load saat route dikunjungi
const HomeView = () => import('@/views/HomeView.vue')
// File dipisah jadi chunk terpisah. Hanya di-download saat dibutuhkan.
```

```javascript
// ─────────────────────────────────────────────────────────────
// ILUSTRASI HASIL BUILD DENGAN LAZY LOADING
// ─────────────────────────────────────────────────────────────
// dist/assets/
//   index-abc123.js        ← core app (kecil)
//   HomeView-def456.js     ← di-download saat buka /
//   BrowseView-ghi789.js   ← di-download saat buka /browse
//   MovieDetail-jkl012.js  ← di-download saat buka /movie/123
//
// User yang hanya buka halaman Home tidak perlu download
// chunk BrowseView, MovieDetail, dst. → load lebih cepat ✅
```

| Aspek | Eager Loading | Lazy Loading |
| --- | --- | --- |
| Initial bundle | 🔴 Besar (semua halaman) | 🟢 Kecil (hanya yang dibuka) |
| Waktu load pertama | 🔴 Lambat | 🟢 Cepat |
| Navigasi antar halaman | 🟢 Instan (sudah ada) | 🟡 Sedikit jeda saat chunk di-download pertama kali |
| Rekomendasi | Hanya untuk app sangat kecil | ✅ Standar untuk semua project nyata |

> 💡 **Tips Produksi:** Lazy loading adalah **teknik wajib** untuk aplikasi produksi. Vite akan secara otomatis memecah setiap `() => import()` menjadi file terpisah. Semakin banyak halaman, semakin besar manfaatnya.

---

## 🆔 Path Statis vs Parameter Dinamis `:id`

Path bisa berupa **statis** (tetap) atau **dinamis** (mengandung parameter).

### Path Statis

```javascript
// Path statis — cocok untuk halaman dengan URL tetap
{ path: '/browse',  name: 'browse',  component: BrowseView }
{ path: '/search',  name: 'search',  component: SearchView }
{ path: '/profile', name: 'profile', component: ProfileView }
// Hanya URL persis itu yang cocok.
```

### Path Dinamis dengan `:id`

```javascript
// Path dinamis — tanda ':' menandakan parameter
{ path: '/movie/:id', name: 'movie-detail', component: MovieDetailView }
//
// URL yang COCOK:
//   /movie/123   → params.id = '123'
//   /movie/456   → params.id = '456'
//   /movie/abc   → params.id = 'abc'
//
// Semuanya mengarah ke MovieDetailView yang SAMA.
// Komponen membaca params.id untuk tahu film mana yang diminta.
```

```javascript
// ─────────────────────────────────────────────────────────────
// LEBIH DARI SATU PARAMETER
// ─────────────────────────────────────────────────────────────
// /user/:userId/post/:postId
// URL: /user/7/post/42
// → route.params = { userId: '7', postId: '42' }

const routes = [
  {
    path: '/user/:userId/post/:postId',
    name: 'user-post',
    component: UserPostView,
  },
]
```

```javascript
// ─────────────────────────────────────────────────────────────
// PARAMETER DENGAN REGEX (opsional, lanjutan)
// ─────────────────────────────────────────────────────────────
// Hanya cocok jika :id berupa angka
// path: '/movie/:id(\\d+)'
//   /movie/123   → cocok ✅
//   /movie/abc   → TIDAK cocok (jatuh ke not-found) ❌

const routes = [
  { path: '/movie/:id(\\d+)', name: 'movie-detail', component: MovieDetailView },
]
```

> ⚠️ **Catatan Penting:** Nilai `params` **selalu berupa string**, meski URL-nya angka. Jika butuh angka, konversi manual: `const id = Number(route.params.id)`.

---

## ❓ Query Parameters (`?q=...`) — Membaca Data dari URL

Berbeda dengan `params` yang ada di path, **query** adalah bagian URL setelah tanda `?`. Query sangat cocok untuk data opsional seperti kata kunci pencarian, halaman paginasi, atau filter.

```javascript
// URL: /search?q=batman&page=2
//        └─path─┘ └── query ──┘

// Di dalam komponen:
const route = useRoute()
console.log(route.query.q)    // 'batman'  (string)
console.log(route.query.page) // '2'      (string)
```

```javascript
// ─────────────────────────────────────────────────────────────
// CONTOH: Halaman Search membaca keyword dari query
// ─────────────────────────────────────────────────────────────
// routes:
// { path: '/search', name: 'search', component: SearchView }

// SearchView.vue
<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, watch } from 'vue'

const route  = useRoute()
const router = useRouter()

// Inisialisasi input dari query saat pertama kali load
const keyword = ref(route.query.q ?? '')

// Jika user mengubah keyword, update URL (tanpa reload)
function cari() {
  router.push({ name: 'search', query: { q: keyword.value } })
}

// Pantau perubahan query (misal user tekan back/forward)
watch(
  () => route.query.q,
  (qBaru) => { keyword.value = qBaru ?? '' }
)
</script>

<template>
  <input v-model="keyword" @keyup.enter="cari" placeholder="Cari film..." />
</template>
```

| Perbandingan | `params` (`:id`) | `query` (`?q=`) |
| --- | --- | --- |
| Letak di URL | Di dalam path (`/movie/123`) | Setelah `?` (`/search?q=x`) |
| Wajib? | Biasanya ya (route tidak cocok kalau kosong) | Tidak (boleh tidak ada) |
| Cocok untuk | Identitas resource (id film) | Data opsional (filter, halaman, keyword) |
| Akses | `route.params.id` | `route.query.q` |

---

## 🏷️ Named Routes — Navigasi Berbasis Nama

Setiap route bisa punya `name`. Dengan nama, kita tidak perlu menulis ulang `path` saat navigasi — cukup sebut nama rute beserta `params`/`query`-nya.

```javascript
// ─────────────────────────────────────────────────────────────
// DEFINISI NAMED ROUTES
// ─────────────────────────────────────────────────────────────
const routes = [
  { path: '/movie/:id', name: 'movie-detail', component: MovieDetailView },
  { path: '/search',    name: 'search',       component: SearchView },
]

// ─────────────────────────────────────────────────────────────
// NAVIGASI MENGGUNAKAN NAME (DIREKOMENDASIKAN)
// ─────────────────────────────────────────────────────────────
router.push({ name: 'movie-detail', params: { id: 123 } })
// → menghasilkan URL: /movie/123

router.push({ name: 'search', query: { q: 'batman' } })
// → menghasilkan URL: /search?q=batman

// ─────────────────────────────────────────────────────────────
// NAVIGASI MENGGUNAKAN PATH LANGSUNG (kurang fleksibel)
// ─────────────────────────────────────────────────────────────
router.push('/movie/123')        // harus tahu persis format path
router.push('/search?q=batman')  // harus concat string manual
```

> 💡 **Tips:** Gunakan `name` selalu. Jika suatu hari `path` `/movie/:id` diubah menjadi `/film/:id`, semua `router.push({ name: 'movie-detail' })` tetap berfungsi tanpa satu baris pun diubah. Ini menyingkirkan bug "broken link" saat refactor.

---

## 🔗 Navigation Deklaratif dengan `<RouterLink>`

Cara paling sederhana navigasi adalah `<RouterLink>` di dalam template. Ia mirip `<a href>`, tapi **tidak memuat ulang halaman** — router menangani semuanya.

```vue
<!-- Navbar.vue — navigasi deklaratif -->
<template>
  <!-- Cara 1: string path langsung -->
  <RouterLink to="/browse">Browse</RouterLink>

  <!-- Cara 2: object (named route) — LEBIH BAIK -->
  <RouterLink :to="{ name: 'browse' }">Browse</RouterLink>

  <!-- Cara 3: dengan params -->
  <RouterLink :to="{ name: 'movie-detail', params: { id: film.id } }">
    {{ film.title }}
  </RouterLink>

  <!-- Cara 4: dengan query -->
  <RouterLink :to="{ name: 'search', query: { q: 'batman' } }">
    Cari Batman
  </RouterLink>
</template>
```

### Active Class untuk Highlight Menu

`<RouterLink>` otomatis menambahkan class CSS saat rute aktif — sangat berguna untuk menyorot menu navigasi.

```vue
<template>
  <RouterLink
    to="/browse"
    active-class="nav-aktif"          <!-- saat rute aktif (inkl. children) -->
    exact-active-class="nav-exact-aktif" <!-- saat PERSIS cocok -->
  >
    Browse
  </RouterLink>
</template>

<style>
.nav-aktif {
  color: #e50914;        /* Merah khas Netflix */
  font-weight: 700;
}
.nav-exact-aktif {
  border-bottom: 2px solid #e50914;
}
</style>
```

| Class | Kapan ditambahkan |
| --- | --- |
| `active-class` | Rute aktif, **termasuk** child route-nya |
| `exact-active-class` | Hanya saat URL **persis** sama |

> ⚠️ **Jebakan:** Jangan gunakan `<a href="/browse">` biasa untuk navigasi internal SPA! Itu memicu **full page reload** (browser memuat ulang seluruh aplikasi). Selalu pakai `<RouterLink>` atau `router.push()`.

---

## 🕹️ Navigation Programmatik dengan `useRouter` & `useRoute`

Selain `<RouterLink>`, kita sering butuh navigasi **dari dalam script** — misal setelah login berhasil, atau saat tombol diklik. Di sinilah `useRouter` dan `useRoute` berperan.

```vue
<!-- MovieDetailView.vue — navigasi programmatik -->
<script setup>
import { useRouter, useRoute } from 'vue-router'

// useRouter → alat untuk BERPINDAH halaman
const router = useRouter()

// useRoute  → info halaman SEKARANG (readonly, reaktif)
const route  = useRoute()

// ── MEMBACA PARAMS & QUERY ──
const filmId = route.params.id     // '123' dari URL /movie/123
const keyword = route.query.q      // 'batman' dari URL ?q=batman

// ── METODE NAVIGASI ──
function keHalamanDetail(id) {
  // push() → tambah entry baru di history (bisa tombol back)
  router.push({ name: 'movie-detail', params: { id } })
}

function gantiSearch(kata) {
  router.push({ name: 'search', query: { q: kata } })
}

function kembali() {
  // go(-1) → mundur 1 langkah di history (seperti tombol back)
  router.go(-1)
}

function keBeranda() {
  // replace() → ganti halaman SEKARANG (tidak tambah history)
  // Cocok untuk redirect login agar user tidak "back" ke halaman login
  router.replace({ name: 'home' })
}
</script>
```

### Perbedaan `useRouter` vs `useRoute`

| API | Fungsi | Contoh |
| --- | --- | --- |
| `useRouter()` | Untuk **berpindah** halaman | `push()`, `replace()`, `go()`, `back()` |
| `useRoute()` | Untuk **membaca** info halaman sekarang | `params`, `query`, `path`, `name`, `meta`, `fullPath` |

```javascript
// Ringkasan metode useRouter:
router.push(obj)     // Navigasi ke rute baru (tambah history)
router.replace(obj)  // Navigasi tanpa meninggalkan history
router.go(n)         // Maju/mundur n langkah (n negatif = mundur)
router.back()        // Alias router.go(-1)
router.forward()     // Alias router.go(1)
```

> 💡 **Tips:** `route` bersifat **reaktif**. Jika kamu membaca `route.params.id` di dalam `computed` atau `watch`, komponen akan otomatis update saat URL berubah — tanpa perlu reload. Ini kunci membuat halaman detail yang merespons perubahan URL.

---

## 🛡️ Navigation Guards — Penjaga Gerbang

**Navigation guard** adalah fungsi yang dijalankan saat terjadi perpindahan halaman. Ia bisa **mengizinkan**, **membatalkan**, atau **mengalihkan** navigasi. Ada tiga jenis: global, per-route, dan in-component.

### 1️⃣ Global Guard — `beforeEach`

Berjalan **sebelum setiap** navigasi ke mana pun.

```javascript
// router/index.js — lanjutan
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' } // Scroll ke atas tiap pindah
  }
})

// Global guard — dijalankan SEBELUM setiap navigasi
router.beforeEach((to, from) => {
  const authStore = useAuthStore()

  // Halaman butuh login tapi user belum login → redirect ke Home
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return { name: 'home' }   // ← navigasi dialihkan
  }

  // Halaman untuk guest tapi user sudah login → redirect ke Browse
  if (to.meta.requiresGuest && authStore.isLoggedIn) {
    return { name: 'browse' }
  }

  // Tidak return apa-apa → navigasi dilanjutkan ✅
})

export default router
```

**Aturan nilai kembalian guard:**

```
return undefined / tidak return  → navigasi LANJUT ✅
return { name: 'home' }          → navigasi DIALIHKAN 🔀
return false                     → navigasi DIBATALKAN 🛑
return { path: '/login' }        → dialihkan ke path
```

### 2️⃣ Per-Route Guard — `beforeEnter`

Hanya berjalan untuk **satu route tertentu**. Berguna saat aturan spesifik untuk halaman itu saja.

```javascript
// Guard yang HANYA berlaku untuk route ini
const routes = [
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    // beforeEnter jalan sebelum masuk ke /profile saja
    beforeEnter: (to, from) => {
      const authStore = useAuthStore()
      if (!authStore.isLoggedIn) {
        return { name: 'home' }
      }
      // boleh lanjut
    },
  },
]
```

### 3️⃣ In-Component Guard

Didefinisikan **di dalam komponen** (pakai `script setup` + helper `onBeforeRouteLeave` / `onBeforeRouteUpdate`).

```vue
<!-- MovieDetailView.vue -->
<script setup>
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

// Jalan saat meninggalkan komponen ini
onBeforeRouteLeave((to, from) => {
  // Misal cegah keluar jika ada form belum disimpan
  const yakin = window.confirm('Yakin keluar tanpa menyimpan?')
  if (!yakin) return false // batalkan navigasi
})

// Jalan saat URL berubah TAPI komponen sama tetap dipakai
// (misal /movie/123 → /movie/456, komponen MovieDetail tidak di-mount ulang)
onBeforeRouteUpdate((to, from) => {
  // Ambil data film baru berdasarkan to.params.id
  console.log('Pindah ke film:', to.params.id)
})
</script>
```

| Jenis Guard | Cakupan | Kapan Dipakai |
| --- | --- | --- |
| `beforeEach` (global) | Semua route | Auth guard global, logging |
| `beforeEnter` (per-route) | Satu route | Validasi khusus 1 halaman |
| `onBeforeRouteLeave` | Komponen | Konfirmasi sebelum keluar |
| `onBeforeRouteUpdate` | Komponen | Reaksi saat param berubah |

> 🛡️ **Keamanan:** Guard sisi klien (front-end) **bukan** pengganti keamanan server. Data sensitif tetap harus dilindungi di back-end. Guard hanya mencegah user membuka UI yang seharusnya tidak boleh diakses.

---

## 📜 Scroll Behavior — Kembali ke Atas

Saat pindah halaman, posisi scroll sering "keingat" dari halaman sebelumnya — membuat user terlempar ke tengah halaman baru. `scrollBehavior` memperbaikinya.

```javascript
const router = createRouter({
  history: createWebHistory(),
  routes,

  // Dipanggil setiap kali navigasi selesai
  scrollBehavior(to, from, savedPosition) {
    // Selalu scroll ke atas dengan animasi halus
    return { top: 0, behavior: 'smooth' }
  },
})
```

```javascript
// ─────────────────────────────────────────────────────────────
// VARIASI SCROLL BEHAVIOR
// ─────────────────────────────────────────────────────────────

// 1. Selalu ke atas (paling umum)
scrollBehavior() {
  return { top: 0 }
}

// 2. Kembalikan posisi saat tombol BACK ditekan
scrollBehavior(to, from, savedPosition) {
  if (savedPosition) return savedPosition  // pakai posisi terakhir
  return { top: 0 }                         // else ke atas
}

// 3. Scroll ke elemen dengan id tertentu (misal #komentar)
scrollBehavior(to) {
  if (to.hash) return { el: to.hash }       // /film#komentar → scroll ke #komentar
  return { top: 0 }
}
```

> 💡 **Tips:** `behavior: 'smooth'` memberi efek menggulung halus. Untuk performa maksimal di beberapa perangkat, cukup `return { top: 0 }` tanpa smooth.

---

## 🎬 Studi Kasus — Melindungi Halaman `/browse` dengan Auth Guard

**Skenario:** Aplikasi Netflix kita punya halaman `/browse` yang hanya boleh diakses user yang sudah login. Jika user yang belum login mengetik `/browse` langsung di address bar, ia harus dialihkan ke halaman login (`/`), lalu setelah login berhasil dikembalikan ke `/browse`.

```javascript
// ─────────────────────────────────────────────────────────────
// LANGKAH 1: Tandai route yang butuh proteksi via meta
// ─────────────────────────────────────────────────────────────
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresGuest: true }, // Halaman login → hanya untuk tamu
  },
  {
    path: '/browse',
    name: 'browse',
    component: BrowseView,
    meta: { requiresAuth: true },  // ← WAJIB LOGIN
  },
]

// ─────────────────────────────────────────────────────────────
// LANGKAH 2: Global guard yang cek meta + arahkan balik
// ─────────────────────────────────────────────────────────────
router.beforeEach((to, from) => {
  const authStore = useAuthStore()

  // Halaman terproteksi & belum login
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    // Simpan tujuan asli di query.redirect agar bisa kembali nanti
    return { name: 'home', query: { redirect: to.fullPath } }
    // to.fullPath = '/browse' (path lengkap termasuk query)
  }

  // Halaman guest (login) tapi sudah login → langsung ke browse
  if (to.meta.requiresGuest && authStore.isLoggedIn) {
    return { name: 'browse' }
  }
})
```

```vue
<!-- HomeView.vue — form login membaca query.redirect -->
<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { ref } from 'vue'

const route  = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

async function handleLogin() {
  const hasil = await authStore.login(email.value, password.value)
  if (hasil.sukses) {
    // Jika ada redirect, kembali ke sana; else ke /browse
    const tujuan = route.query.redirect || { name: 'browse' }
    router.push(tujuan)
  }
}
</script>
```

**Alur lengkap studi kasus:**

```
User ketik /browse (belum login)
    ↓
beforeEach jalan → to.meta.requiresAuth = true, isLoggedIn = false
    ↓
Guard return { name: 'home', query: { redirect: '/browse' } }
    ↓
User diarahkan ke /  dengan URL: /?redirect=/browse
    ↓
User isi login → handleLogin() → authStore.login() sukses
    ↓
router.push(route.query.redirect) → kembali ke /browse ✅
```

> 💡 **Tips:** Menyimpan `to.fullPath` di `query.redirect` adalah pola **profesional** yang sering dipakai aplikasi nyata (GitHub, Google, dll). User tidak kehilangan halaman tujuan setelah login.

---

## 🔀 Redirect & Alias — Mengarahkan Route

Terkadang kita ingin satu URL otomatis mengarah ke URL lain, atau punya dua URL yang menampilkan halaman sama. Dua fitur berbeda: `redirect` dan `alias`.

```javascript
// ─────────────────────────────────────────────────────────────
// REDIRECT — URL A otomatis diarahkan ke URL B
// ─────────────────────────────────────────────────────────────
const routes = [
  {
    path: '/beranda',
    redirect: '/browse',          // → user langsung ke /browse
  },
  {
    path: '/film/:id',
    redirect: { name: 'movie-detail' }, // redirect ke named route
  },
  {
    // Redirect dengan fungsi (dynamic) — bisa olah params
    path: '/old-user/:id',
    redirect: (to) => ({
      name: 'profile',
      query: { id: to.params.id },
    }),
  },
]
```

```javascript
// ─────────────────────────────────────────────────────────────
// ALIAS — URL BERBEDA tapi TAMPILAN SAMA (tanpa redirect)
// ─────────────────────────────────────────────────────────────
const routes = [
  {
    path: '/browse',
    component: BrowseView,
    alias: '/halaman-utama',  // /halaman-utama tampil SAMA dengan /browse
    // URL di address bar tetap /halaman-utama (tidak berubah)
  },
  {
    path: '/movie/:id',
    component: MovieDetailView,
    alias: '/film/:id',   // dua path menuju komponen sama
  },
]
```

| Fitur | Perubahan URL? | Kegunaan |
| --- | --- | --- |
| `redirect` | ✅ Ya (URL berubah) | URL lama dipensiunkan, arahkan ke baru |
| `alias` | ❌ Tidak (URL tetap) | URL alternatif/SEO tanpa pindah rute |

> 💡 **Tips:** Gunakan `redirect` saat kamu **memindahkan** halaman (URL lama sudah tidak berlaku). Gunakan `alias` saat ingin **nama URL berbeda** untuk audiens berbeda (misal `/film` ramah manusia vs `/movie` internal) namun tampilan identik.

---

## 🏅 Prioritas Pencocokan Route

Router mencocokkan route **dari atas ke bawah**. Route yang lebih spesifik harus diletakkan **sebelum** yang umum.

```javascript
// ❌ SALAH — route umum di atas menelan yang spesifik
const routes = [
  { path: '/movie/:id', component: MovieList },   // menangkap SEMUA /movie/apa
  { path: '/movie/new', component: MovieNew },    // TIDAK PERNAH kecak! ❌
]

// ✅ BENAR — yang spesifik di atas
const routes = [
  { path: '/movie/new', component: MovieNew },    // dicek dulu ✅
  { path: '/movie/:id', component: MovieList },    // fallback dinamis
]
```

```
Aturan prioritas (sederhana):
1. Path statis ('/browse')         → prioritas tertinggi
2. Path dengan param ('/movie/:id')→ prioritas menengah
3. Wildcard ('/:pathMatch(.*)*')   → prioritas terendah (paling bawah)
```

> ⚠️ **Catatan:** Vue Router modern sebenarnya punya algoritma scoring otomatis, tapi **tetaplah** letakkan route spesifik di atas untuk kejelasan & menghindari kejutan.

---

## 🧭 Navigasi Mendalam — `replace`, `hash`, dan `resolve`

Selain `push`/`go`, ada opsi navigasi lebih lanjut.

```javascript
// replace() — ganti halaman TANPA menyimpan history
// Cocok untuk: halaman login, splash, atau step wizard
// User tidak bisa "back" ke halaman sebelumnya
router.replace({ name: 'browse' })

// Navigasi ke hash dalam halaman (scroll ke elemen)
router.push({ path: '/film/123', hash: '#komentar' })
// → URL: /film/123#komentar, lalu scroll ke elemen id="komentar"

// resolve() — cek bagaimana router akan menangani lokasi (tanpa navigasi)
const lokasi = router.resolve({ name: 'movie-detail', params: { id: 5 } })
console.log(lokasi.href) // '/movie/5' — berguna untuk membuat <a> manual

// Navigasi dengan state (tidak muncul di URL, hanya di history)
router.push({ name: 'browse', state: { dariSearch: true } })
// baca di komponen tujuan: history.state.dariSearch
```

| Method | Simpan History? | Kasus Pakai |
| --- | --- | --- |
| `push` | ✅ Ya | Navigasi normal |
| `replace` | ❌ Tidak | Login, splash, wizard |
| `go(-1)` | — | Tombol back |
| `resolve` | — | Dapatkan href tanpa navigasi |

---

## 👀 Mengamati Perubahan Route dengan `watch`

Karena `route` reaktif, kita bisa `watch` perubahannya untuk memicu efek samping (fetch data, log, dll).

```vue
<!-- MovieDetailView.vue -->
<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Pantau perubahan params.id (misal /movie/1 → /movie/2)
watch(
  () => route.params.id,
  (idBaru) => {
    // Ambil data film baru setiap id berubah
    console.log('Muat film id:', idBaru)
    muatFilm(idBaru)
  },
  { immediate: true } // jalankan sekalian saat komponen mount
)

// Atau pantau query
watch(
  () => route.query.q,
  (q) => { if (q) cari(q) }
)
</script>
```

> 💡 **Tips:** Kombinasikan `watch` pada `route.params` dengan `onBeforeRouteUpdate` (dibahas di guard) — keduanya berguna saat param berubah tanpa komponen di-mount ulang.

---

## 🚨 Jebakan Umum Pemula di Bab 17

### ❌ Jebakan 1 — Pakai `<a href>` untuk Navigasi Internal

```html
<!-- ❌ SALAH — memicu full page reload -->
<a href="/browse">Browse</a>

<!-- ✅ BENAR — SPA navigation, tanpa reload -->
<RouterLink :to="{ name: 'browse' }">Browse</RouterLink>
```

---

### ❌ Jebakan 2 — Lupa Lazy Loading (Eager Import)
```javascript
// ❌ SALAH — semua view di-bundle jadi 1 file raksasa
import BrowseView from '@/views/BrowseView.vue'

// ✅ BENAR — lazy load,_split per chunk
const BrowseView = () => import('@/views/BrowseView.vue')
```

---

### ❌ Jebakan 3 — Catch-All Route Diletakkan di Atas
```javascript
// ❌ SALAH — semua URL langsung dianggap 404!
const routes = [
  { path: '/:pathMatch(.*)*', component: NotFoundView }, // ← jangan di atas!
  { path: '/browse', component: BrowseView },
]

// ✅ BENAR — letakkan wildcard di PALING BAWAH
const routes = [
  { path: '/browse', component: BrowseView },
  { path: '/:pathMatch(.*)*', component: NotFoundView }, // ← paling bawah
]
```

---

### ❌ Jebakan 4 — Navigation Guard Lupa Return / Return Salah
```javascript
// ❌ SALAH — guard tidak return apa-apa, navigasi tetap lanjut
// (user belum login tetap bisa buka /browse!)
router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    // lupa return → navigasi LANJUT padahal harus diblokir
  }
})

// ✅ BENAR — kembalikan objek rute tujuan redirect
router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'home' }  // ← dialihkan
  }
})
```

---

### ❌ Jebakan 5 — Menganggap `params.id` Sudah Number
```javascript
// ❌ SALAH — params selalu string!
const id = route.params.id      // '123' (string)
const film = daftarFilm[id]     // mungkin salah karena index butuh number

// ✅ BENAR — konversi eksplisit
const id = Number(route.params.id)  // 123 (number)
```

---

## 🌐 Mode History vs Hash — Perbedingan Mendalam

Vue Router mendukung dua mode history. Memahami bedanya krusial sebelum deploy.

```javascript
import { createRouter } from 'vue-router'

// ① HTML5 History Mode (REKOMENDASI)
// URL bersih: /movie/123  (tanpa #)
import { createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ② Hash Mode (fallback aman untuk static hosting)
// URL: /#/movie/123  (ada tanda #)
import { createWebHashHistory } from 'vue-router'
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
```

| Aspek | `createWebHistory` | `createWebHashHistory` |
| --- | --- | --- |
| Format URL | `/movie/123` (bersih) | `/#/movie/123` (ada `#`) |
| Butuh server config? | ✅ Ya (SPA fallback) | ❌ Tidak |
| SEO | 🟢 Lebih baik | 🟡 Hash tidak diindeks penuh |
| Cocok untuk | Hosting modern (Vercel, Netlify) | Static file murni / file:// |

> ⚠️ **Catatan:** Gunakan `createWebHistory` untuk produksi di hosting yang bisa dikonfigurasi. Jika deploy ke **static hosting sederhana** (bucket S3 polos, GitHub Pages tanpa config), pakai `createWebHashHistory` agar refresh tidak 404.

---

## 🛠️ Konfigurasi Server (SPA Fallback) untuk Production

Dengan `createWebHistory`, saat user **refresh** di `/movie/123`, server menerima request ke `/movie/123`. Jika server tidak tahu rute ini, ia mengembalikan 404. Solusinya: **semua URL** harus dikembalikan ke `index.html`.

```javascript
// ── Contoh: vite.config.js (untuk dev & preview) ──
export default {
  // Vite dev server sudah menangani SPA fallback secara otomatis.
  // Tidak perlu config tambahan di development.
}

// ── Contoh: Netlify (file `public/_redirects`) ──
/*  /index.html   200  */

// ── Contoh: Vercel (file `vercel.json`) ──
// { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }

// ── Contoh: Nginx ──
// location / {
//   try_files $uri $uri/ /index.html;
// }
```

> 💡 **Tips:** Di Vite dev server (`npm run dev`), fallback SPA sudah aktif otomatis — jadi kamu tidak akan melihat 404 saat develop. Masalah baru muncul saat **deploy** ke production. Selalu uji refresh di halaman dalam setelah deploy.

---

## 🔗 `RouterLink` dengan `replace` & `custom`

Selain `to`, `<RouterLink>` punya atribut berguna untuk kontrol navigasi.

```vue
<template>
  <!-- replace: jangan tambah history (seperti router.replace) -->
  <RouterLink :to="{ name: 'browse' }" replace>
    Browse (tanpa history)
  </RouterLink>

  <!-- custom: kita render elemen sendiri, bukan <a> -->
  <RouterLink
    :to="{ name: 'browse' }"
    custom
    v-slot="{ href, navigate, isActive }"
  >
    <button :class="{ aktif: isActive }" @click="navigate">
      Buka Browse
    </button>
  </RouterLink>
</template>
```

| Atribut | Fungsi |
| --- | --- |
| `replace` | Navigasi tanpa menyimpan history (tombol back tidak kembali) |
| `custom` | Nonaktifkan render `<a>`, beri kendali penuh via `v-slot` |
| `exact-active-class` | Class saat URL persis cocok |

> ⚠️ **Jebakan:** Dengan `custom`, **wajib** panggil `navigate` di `@click`. Jika lupa, link tidak akan navigasi — ia hanya elemen biasa.

---

## 🧩 Multiple Params & Repeatable Param

Route bisa punya lebih dari satu parameter sekaligus, bahkan parameter yang **berulang** (repeatable) untuk path bersarang dinamis.

```javascript
// DUA parameter sekaligus
// /user/7/post/42
const routes = [
  {
    path: '/user/:userId/post/:postId',
    name: 'user-post',
    component: UserPostView,
  },
]
// route.params = { userId: '7', postId: '42' }

// REPEATABLE param (akhiran *) — menangkap banyak segmen
// /files/a/b/c  →  route.params.path = ['a','b','c']
const routes = [
  {
    path: '/files/:path(.*)*',
    name: 'file-explorer',
    component: FileExplorer,
  },
]
// route.params.path = ['a', 'b', 'c']

// Kombinasi dinamis + statis di tengah
// /blog/2024/12/artikel-keren
const routes = [
  { path: '/blog/:year/:month/:slug', component: ArticleView },
]
```

> 💡 **Tips:** Repeatable param (`path(.*)*`) sangat berguna untuk fitur seperti *file explorer* atau *breadcrumb dinamis* di mana kedalaman folder tidak tetap.

---

## ⏳ Navigation Guard Asinkron (Menunggu Auth)

Guard bisa **async** — misal menunggu store auth selesai load dari localStorage/API sebelum memutuskan izin.

```javascript
// router/index.js
router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  // Jika status login belum diketahui, tunggu dulu (async guard)
  if (authStore.status === 'loading') {
    await authStore.cekSesi()   // fetch profil / baca token
  }

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return { name: 'home', query: { redirect: to.fullPath } }
  }
})
```

| Guard return | Arti |
| --- | --- |
| `undefined` | Lanjut |
| Object route | Alihkan |
| `false` | Batalkan |
| `Promise` / `async` | Tunggu hingga selesai (boleh return apapun di atas) |

> 💡 **Catatan:** Guard async sangat umum di aplikasi nyata karena state login sering di-load secara asynchronous saat aplikasi start. Vue Router menunggu promise guard selesai sebelum merender halaman.

---

## 🧭 `router.resolve` & Navigasi Programmatik Lanjut

`router.resolve` mengubah lokasi (name/params) menjadi URL lengkap **tanpa** navigasi — berguna untuk membuat link manual, share, atau analytics.

```javascript
// Dapatkan URL final dari named route
const target = router.resolve({
  name: 'movie-detail',
  params: { id: 123 },
})
console.log(target.href)        // '/movie/123'
console.log(target.fullPath)    // '/movie/123'
console.log(target.matched)     // array route yang cocok

// Buka di tab baru (window.open) tanpa RouterLink
function bagikan() {
  const url = router.resolve({ name: 'movie-detail', params: { id: film.id } }).href
  window.open(url, '_blank')
}
```

| Method | Navigasi? | Kegunaan |
| --- | --- | --- |
| `router.push` | ✅ Ya | Pindah halaman |
| `router.replace` | ✅ Ya (tanpa history) | Redirect login |
| `router.resolve` | ❌ Tidak | Dapatkan href untuk share/analytics |

---

## 🚨 Jebakan Tambahan (Jebakan 6–9)

### ❌ Jebakan 6 — Lupa Deploy SPA Fallback (404 saat refresh)

```javascript
// ❌ SALAH — di dev works, tapi production 404 saat refresh /movie/123
// karena server tidak fallback ke index.html
// ✅ BENAR — tambahkan konfigurasi rewrite ke index.html di server/static host
```

### ❌ Jebakan 7 — `<RouterLink>` dengan `custom` tapi lupa `navigate`

```vue
<!-- ❌ SALAH — tidak navigasi -->
<RouterLink :to="{ name: 'browse' }" custom v-slot="{ href }">
  <button><a :href="href">Browse</a></button>
</RouterLink>
<!-- ✅ BENAR -->
<RouterLink :to="{ name: 'browse' }" custom v-slot="{ navigate }">
  <button @click="navigate">Browse</button>
</RouterLink>
```

### ❌ Jebakan 8 — Guard Async tidak `await`

```javascript
// ❌ SALAH — guard selesai SEBELUM cekSesi() selesai
router.beforeEach((to) => {
  authStore.cekSesi()   // lupa await → guard lanjut duluan
  if (to.meta.requiresAuth && !authStore.isLoggedIn) return { name: 'home' }
})
// ✅ BENAR
router.beforeEach(async (to) => {
  await authStore.cekSesi()
  if (to.meta.requiresAuth && !authStore.isLoggedIn) return { name: 'home' }
})
```

### ❌ Jebakan 9 — Menulis `path` manual saat sudah punya `name`

```javascript
// ❌ SALAH — rapuh jika path diubah nanti
router.push('/movie/' + id)
// ✅ BENAR — pakai name, kebal terhadap perubahan path
router.push({ name: 'movie-detail', params: { id } })
```

---

## 🗂️ Struktur Folder Router & Lazy Loading Best Practice

Penempatan file yang rapi membuat router mudah dikembangkan:

```
src/
├── router/
│   ├── index.js          ← createRouter + guards + scrollBehavior
│   ├── routes.js         ← array routes (dipisah dari instance)
│   └── guards.js         ← fungsi guard terpisah (reusable)
│
├── views/
│   ├── HomeView.vue
│   ├── BrowseView.vue
│   ├── MovieDetailView.vue
│   └── NotFoundView.vue
```

```javascript
// router/routes.js — HANYA mendefinisikan routes
export const routes = [
  { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
  // ...
]

// router/index.js — gabungkan dengan router + guard
import { routes } from './routes'
const router = createRouter({ history: createWebHistory(), routes })
```

> 💡 **Tips:** Pisahkan `routes` ke file sendiri agar `index.js` fokus pada konfigurasi router (guards, scrollBehavior). Saat route membeludak, ini menjaga keterbacaan.

---

## 📝 Ringkasan Bab 17

| Konsep | Penjelasan |
| --- | --- |
| **Vue Router** | Library resmi navigasi SPA di Vue 3 (versi 4) |
| **Route** | Pemetaan URL → komponen yang dirender |
| **`<RouterView>`** | Tempat komponen halaman aktif ditampilkan |
| **Lazy loading** | `() => import()` → code splitting, load lebih cepat |
| **Param dinamis** | `:id` di path → dibaca via `route.params.id` (string) |
| **Query** | `?q=x` di URL → dibaca via `route.query.q` |
| **Named route** | `name` → navigasi `router.push({ name })` lebih aman |
| **`<RouterLink>`** | Navigasi deklaratif tanpa reload + active class |
| **`useRouter`** | Navigasi programmatik: `push`, `replace`, `go` |
| **`useRoute`** | Baca info route sekarang (params, query, meta) — reaktif |
| **Navigation guard** | Global `beforeEach`, per-route `beforeEnter`, in-component |
| **`scrollBehavior`** | Kembalikan posisi scroll (biasanya ke atas) |

---

## 🎯 Latihan Mandiri

**⭐ Latihan 1 — Definisi Route Dasar**
Buat file `router/index.js` dengan 3 route: `/` (Home), `/about` (About), dan `/contact` (Contact). Gunakan lazy loading untuk ketiganya, dan berikan `name` pada masing-masing. Tambahkan catch-all 404 route di paling bawah.

**⭐⭐ Latihan 2 — Parameter Dinamis & RouterLink**
Buat route `/user/:username` yang menampilkan `UserView`. Di dalam `UserView`, baca `route.params.username` dan tampilkan teks "Profil: <username>". Buat juga daftar 5 `<RouterLink>` dengan username berbeda.

**⭐⭐⭐ Latihan 3 — Navigation Guard Sederhana**
Tambahkan `meta: { requiresAuth: true }` pada route `/profile`. Buat global `beforeEach` guard yang, jika user belum login (pakai `ref(false)` sederhana sebagai simulasi), mengalihkan ke `/`. Tambahkan tombol "Login/Logout" yang mengubah nilai ref tersebut.

**⭐⭐⭐⭐ Latihan 4 — Mini SPA Netflix**
Gabungkan semua: buat route `/`, `/browse`, `/movie/:id`, `/search?q=`, dan 404. Gunakan `<RouterLink>` di navbar, `router.push` di kartu film, baca `route.params.id` di halaman detail, dan tambahkan `scrollBehavior` yang kembali ke atas. Bonus: beri `active-class` pada menu navbar.

---

*Lanjut ke ➡️ **Bab 18 — 🧭 Vue Router Lanjutan & Best Practices***
