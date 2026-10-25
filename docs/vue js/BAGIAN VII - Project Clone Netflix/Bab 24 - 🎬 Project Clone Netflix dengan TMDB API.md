# 🎬 Bab 24 — Project Clone Netflix dengan TMDB API

> *"Belajar framework itu seperti belajar memasak: kamu bisa membaca seribu resep, tapi baru benar-benar paham saat kamu sendiri yang berdiri di dapur, menyiapkan bahan, dan memasak hidangan utuh dari awal sampai selesai. Bab ini adalah dapurnya."*
>

---

> **🧠 Apa Itu Project Clone Netflix?**
>
>
> Project clone Netflix adalah **aplikasi web utuh** yang kamu bangun sendiri dari nol, meniru pengalaman menonton di Netflix: ada halaman landing, login, halaman jelajah berisi baris-baris film per genre, banner film unggulan, modal detail dengan trailer YouTube, pencarian real-time, hingga daftar *watchlist* pribadi. Bedanya dengan Netflix sungguhan: kita **tidak** menyimpan video. Kita mengambil **poster, judul, rating, dan trailer** dari **TMDB API** (The Movie Database) — layanan gratis yang menyediakan data film untuk jutaan aplikasi di seluruh dunia.
>
> Ini bukan sekadar "tutorial ikut-ikutan". Dengan menyelesaikan bab ini, kamu telah menggabungkan **setiap konsep** dari Bab 1 sampai Bab 23: reaktivitas, Composition API, composables, Pinia, Vue Router, lifecycle, Teleport, transisi, dan deploy ke production. Ini adalah bukti nyata bahwa kamu sudah **production-ready**.

---

> **🏗️ Analogi Sederhana:**
>
>
> Bayangkan kamu ingin membuka restoran mie ayam. Kamu sudah belajar memilih tepung (Bab 5 — reaktivitas), merebus mie (Bab 13 — Composition API), membuat kuah (Bab 14 — composables), mengatur pesanan pelanggan (Bab 17 — router), mencatat resep di buku (Bab 19 — Pinia), dan memajang menu (Bab 22 — komponen lanjutan).
>
> Nah, **Bab 24 ini adalah saat kamu benar-benar membuka restorannya**: menyatukan dapur, meja, pelanggan, dan menu menjadi satu pengalaman lengkap yang bisa dinikmati orang lain. TMDB API adalah "supplier bahan" yang mengirimkan daftar film segar setiap kali ada yang pesan.

---

## 📋 Daftar Isi Bab 24

1. Fitur yang Akan Dibangun — dan Apa yang Kamu Pelajari dari Masing-Masing
2. Setup & Install Dependency — dari `npm create vue` sampai API Key
3. Struktur Folder Final — Pohon Project & Tanggung Jawab Tiap File
4. Composables — `useTMDB`, `useDebounce`, `useLocalStorage`
5. Pinia Stores — `authStore`, `movieStore`, `watchlistStore`
6. Router — Routes & Navigation Guard (Auth Guard)
7. UI Components — dari `SkeletonLoader` sampai `MovieModal`
8. Views / Halaman — dari `HomeView` sampai `NotFoundView`
9. Urutan Build Step by Step (6 Tahap Terstruktur)
10. Deploy ke Vercel / Netlify (beserta Environment Variable)
11. 🎬 Studi Kasus — Menyatukan `BrowseView` dari Bagian-Bagian
12. 🚨 Jebakan Umum Pemula di Bab 24
13. 📝 Ringkasan Bab 24
14. 🏆 Selamat! & 🎯 Latihan Mandiri

---

## 🎯 24.1 Fitur yang Akan Dibangun

Berikut adalah daftar fitur lengkap aplikasi clone Netflix kita. Tabel pertama merangkum teknologinya, lalu kita **ekspansi satu per satu** untuk memahami *apa yang sebenarnya kamu pelajari* dari tiap fitur.

| Fitur | Teknologi yang Dipakai |
|---|---|
| ✅ Landing page dengan background film dinamis | Vue 3 + TMDB API |
| ✅ Simulasi login (simpan ke Pinia + localStorage) | Pinia `authStore` |
| ✅ Hero Banner film unggulan | Composable `useTMDB` |
| ✅ Movie Rows per genre (Trending, Action, Horror, dll) | `movieStore` + `v-for` |
| ✅ Modal detail film + embed trailer YouTube | `Teleport` + `Transition` |
| ✅ Search film real-time dengan debounce | `useDebounce` composable |
| ✅ Tambah/hapus film dari Watchlist | `watchlistStore` |
| ✅ Halaman Watchlist user | Vue Router + Pinia |
| ✅ Skeleton loading saat data diambil | `SkeletonLoader` component |
| ✅ Animasi transisi antar halaman | Vue `Transition` |
| ✅ Responsive design (mobile & desktop) | Tailwind CSS |
| ✅ Build & deploy ke Vercel/Netlify | Vite build |

---

### 🔍 Ekspansi: Apa yang Kamu Pelajari dari Tiap Fitur

**① Landing page dengan background film dinamis**
Ini adalah halaman pertama yang dilihat pengguna sebelum login. Kamu belajar bagaimana **mengambil data dari API di `onMounted`**, menaruhnya di `ref`, dan menampilkannya sebagai background full-screen. Konsep kuncinya: **lifecycle hook + reaktivitas**. Kamu juga belajar *conditional rendering* dengan `v-if` untuk menampilkan skeleton saat data belum siap.

**② Simulasi login (Pinia + localStorage)**
Kita tidak membangun backend sungguhan. Sebagai gantinya, kita **mensimulasikan** login: ketika tombol "Masuk" diklik, kita simpan token & user ke `authStore`, lalu **persist** ke `localStorage` agar user tidak perlu login ulang saat refresh. Ini mengajarkan pola **state global + persistence** yang dipakai di hampir semua aplikasi nyata.

**③ Hero Banner film unggulan**
Banner besar di atas halaman browse yang menampilkan satu film pilihan dengan judul, deskripsi, dan tombol "Putar"/"Info Selengkapnya". Kamu belajar memisahkan komponen presentasional (`MovieBanner`) dari sumber data (`useTMDB`).

**④ Movie Rows per genre**
Baris-baris film yang bisa di-scroll horizontal: "Trending Now", "Action", "Horror", dll. Di sinilah `v-for` bersinar — satu komponen `MovieRow` dipakai berulang kali dengan data berbeda. Kamu belajar **komposisi komponen**: `MovieRow` di dalamnya memanggil `MovieCard` berulang kali.

**⑤ Modal detail + trailer YouTube**
Klik sebuah film → muncul modal dengan sinopsis lengkap dan trailer YouTube yang bisa diputar. Kamu belajar `Teleport` (render ke `<body>` agar tidak ketahan `overflow:hidden` parent) dan `Transition` (animasi muncul/tutup).

**⑥ Search real-time dengan debounce**
Ketik di kotak pencarian → hasil muncul tanpa tombol "Cari". Tapi kalau kita panggil API tiap huruf diketik, server akan kewalahah. Maka kita pakai **debounce**: tunggu 400ms setelah user berhenti mengetik baru panggil API. Ini pola wajib untuk fitur search di production.

**⑦ Watchlist (tambah/hapus)**
Tombol hati/plus di tiap film untuk menyimpan ke daftar pribadi. Kamu belajar **mutasi state di Pinia** + reactivity yang otomatis memperbarui UI di semua komponen yang memakai store yang sama.

**⑧ Halaman Watchlist / Profile**
Satu halaman khusus yang menampilkan semua film yang disimpan user. Mengajarkan **routing dinamis + akses store lintas halaman**.

**⑨ Skeleton loading**
Saat data film diambil dari API (butuh ~200-500ms), kita tampilkan kotak abu-abu berkedip sebagai *placeholder*. Ini UX profesional yang kamu lihat di Netflix, Facebook, dan YouTube sungguhan.

**⑩ Animasi transisi antar halaman**
Pindah halaman terasa mulus dengan fade. Kamu belajar `<RouterView v-slot>` + `<Transition>`.

**⑪ Responsive design**
Tampilan menyesuaikan layar HP dan desktop via *breakpoint* Tailwind (`md:`, `lg:`).

**⑫ Deploy ke Vercel/Netlify**
Langkah terakhir yang membedakan "project latihan" dari "aplikasi sungguhan yang bisa dibuka siapa saja di internet".

---

## 📦 24.2 Setup & Install Dependency

Bagian ini membawa kamu dari **kosong** sampai **project bisa jalan di browser**. Ikuti urut, jangan dilewati.

### 🪜 Langkah 1 — Pastikan Node.js Terinstall

```bash
# Cek versi Node.js (minimal v18)
node --version

# Cek versi npm
npm --version
```

> 💡 **Jika belum install:** Download dari **https://nodejs.org** dan pilih versi **LTS** (Long Term Support). Vue 3 + Vite butuh Node 18 ke atas.

---

### 🪜 Langkah 2 — Buat Project dengan `create-vue`

```bash
# Buat project Vue baru bernama "netflix-clone"
# Flag --router --pinia --vitest --eslint --prettier otomatis mencentang opsi itu
npm create vue@latest netflix-clone -- \
  --router --pinia --vitest --eslint --prettier

# Masuk ke folder project
cd netflix-clone

# Install semua dependency dasar yang dipilih wizard
npm install
```

Penjelasan tiap flag:
- `--router` → menambahkan **Vue Router 4** (wajib untuk multi-halaman SPA).
- `--pinia`  → menambahkan **Pinia** (state management, wajib untuk auth & watchlist).
- `--vitest` → testing (berguna kalau ingin lanjut ke Bab 23).
- `--eslint` & `--prettier` → kualitas & format kode otomatis.

```bash
# Jalankan dev server untuk memastikan project jalan
npm run dev
# Buka browser → http://localhost:5173
```

---

### 🪜 Langkah 3 — Install Dependency Tambahan

```bash
# Axios: library HTTP client yang lebih enak dari fetch() biasa
npm install axios

# Tailwind CSS + PostCSS + Autoprefixer (sebagai dev dependency)
npm install -D tailwindcss@latest postcss autoprefixer
```

> 💡 **Kenapa Axios, bukan `fetch`?** Axios punya *interceptor* (Bab 21) yang memungkinkan kita menyuntikkan API key ke **setiap** request secara otomatis. Sangat menghemat baris kode.

---

### 🪜 Langkah 4 — Setup Tailwind CSS

```bash
# Buat file konfigurasi tailwind.config.js dan postcss.config.js
npx tailwindcss init -p
```

Setelah perintah di atas, dua file akan muncul: `tailwind.config.js` dan `postcss.config.js`. Edit `tailwind.config.js` agar Tailwind tahu **di file mana** ia harus mencari class-class kita:

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  // ───────────────────────────────────────────
  // content: daftar file yang berisi class Tailwind
  // Tailwind hanya akan generate CSS untuk class yang BENAR-BENAR dipakai
  // ───────────────────────────────────────────
  content: [
    './index.html',                       // File HTML utama
    './src/**/*.{vue,js,ts,jsx,tsx}',     // Semua file .vue dan .js di src
  ],
  theme: {
    extend: {
      // Warna khas Netflix (merah)
      colors: {
        netflix: {
          red:    '#E50914',
          black:  '#141414',
          dark:   '#181818',
          gray:   '#b3b3b3',
        },
      },
    },
  },
  plugins: [],
}
```

Lalu buat file CSS global yang **mengimpor** Tailwind. Kita taruh di `src/assets/css/main.css`:

```css
/* src/assets/css/main.css */
/* Tiga baris ini adalah "pintu masuk" Tailwind — jangan dihapus! */
@tailwind base;      /* Reset CSS & style dasar */
@tailwind components;/* Class komponen kustom (via @apply) */
@tailwind utilities; /* Class utilitas (flex, grid, p-4, dll) */

/* Style global tambahan */
html, body {
  margin: 0;
  background-color: #141414; /* Latar belakang khas Netflix */
  color: white;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

/* Sembunyikan scrollbar horizontal tapi tetap bisa scroll */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
```

> ⚠️ **Jebakan:** Lupa mendaftarkan `./src/**/*.{vue,js}` di `content`. Akibatnya Tailwind tidak mengenali class di file `.vue` dan **tampilan jadi polos tanpa style**. Pastikan path itu ada!

---

### 🪜 Langkah 5 — Setup File `.env` (API Key)

TMDB API butuh **API key** agar kita boleh mengambil datanya. Kita simpan di file `.env` (bukan di dalam kode) agar aman dan tidak ke-commit ke Git.

```bash
# Buat file .env di root project (samping package.json)
echo "VITE_TMDB_API_KEY=your_api_key_here" > .env
```

> 💡 **Cara Mendapatkan TMDB API Key Gratis (step-by-step):**
> 1. Buka **https://www.themoviedb.org** dan **daftar akun** (gratis).
> 2. Klik avatar → **Settings** → pilih tab **API**.
> 3. Scroll ke bawah, klik **"Request an API Key"** (pilih opsi "Developer").
> 4. Isi form sederhana (nama aplikasi, deskripsi). Biasanya **langsung disetujui**.
> 5. Salin **API Key (v3 auth)** yang muncul.
> 6. Ganti `your_api_key_here` di `.env` dengan key aslimu.
>
> ```bash
> # Contoh setelah key didapat:
> # VITE_TMDB_API_KEY=9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d
> ```

> ⚠️ **Aturan emas:** Variabel di `.env` **hanya** bisa diakses dari JavaScript jika diawali `VITE_`. Karena itu kita menamainya `VITE_TMDB_API_KEY`, bukan `TMDB_API_KEY`. Di kode kita akses via `import.meta.env.VITE_TMDB_API_KEY`.

Pastikan `.env` sudah ada di `.gitignore` (create-vue menambahkannya otomatis, tapi cek untuk aman):

```bash
# Cek isi .gitignore — pastikan baris .env ada
cat .gitignore
# Harus ada baris: .env
```

---

### 🪜 Langkah 6 — Wiring `main.js` (Vue + Router + Pinia)

File `src/main.js` adalah **titik masuk** aplikasi. Di sinilah kita "menyalakan" Vue, mendaftarkan Router dan Pinia, lalu me-render `App.vue`.

```js
// src/main.js
// ─────────────────────────────────────────────────────────────
// BAGIAN 1: IMPORT segala yang dibutuhkan
// ─────────────────────────────────────────────────────────────
import { createApp } from 'vue'          // Fungsi utama untuk buat aplikasi Vue
import App from './App.vue'              // Root component (induk semua komponen)
import router from './router'            // Konfigurasi Vue Router (kita buat nanti)
import { createPinia } from 'pinia'      // Plugin state management
import './assets/css/main.css'           // Import CSS global (Tailwind)

// ─────────────────────────────────────────────────────────────
// BAGIAN 2: BUAT & PASANG plugin
// ─────────────────────────────────────────────────────────────
const app = createApp(App)   // Buat instance aplikasi dari root component

app.use(router)              // Daftarkan router → <RouterLink>, <RouterView> aktif
app.use(createPinia())       // Daftarkan Pinia → useXStore() bisa dipakai

// ─────────────────────────────────────────────────────────────
// BAGIAN 3: MOUNT ke DOM
// ─────────────────────────────────────────────────────────────
app.mount('#app')            // Tempel aplikasi ke <div id="app"> di index.html
```

```vue
<!-- src/App.vue (root component) -->
<template>
  <!-- RouterView menampilkan halaman sesuai URL saat ini -->
  <RouterView />
</template>

<script setup>
// App.vue minimal: cukup menjadi "wadah" RouterView.
// Navbar & Footer kita letakkan di dalam masing-masing view
// agar tampil berbeda antara halaman landing & halaman browse.
</script>
```

> 💡 **Mengapa dipisah begini?** `main.js` hanya dijalankan **sekali**. Menaruh `.use(router)` dan `.use(pinia)` di sini berarti seluruh aplikasi (semua view & komponen) sudah punya akses ke router dan store. Ini pola standar Vue 3.

---

## 📁 24.3 Struktur Folder Final

Berikut adalah **pohon folder** lengkap project kita. Setelah pohon, kita jelaskan **tanggung jawab tiap file** agar kamu paham kenapa semuanya ada di situ.

```
netflix-clone/
├── .env                        ← API keys (jangan commit ke Git!)
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
│
└── src/
    ├── main.js                 ← Setup Vue + Router + Pinia
    ├── App.vue                 ← Root component + RouterView
    │
    ├── assets/
    │   └── css/main.css        ← Style global + Tailwind import
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.vue      ← Logo, navigasi, avatar user
    │   │   └── Footer.vue      ← Link bawah halaman
    │   ├── movie/
    │   │   ├── MovieCard.vue   ← Kartu satu film (poster + hover effect)
    │   │   ├── MovieRow.vue    ← Baris film satu genre (scroll horizontal)
    │   │   ├── MovieBanner.vue ← Hero banner film unggulan
    │   │   └── MovieModal.vue  ← Modal detail + trailer YouTube
    │   └── ui/
    │       ├── BaseButton.vue  ← Tombol reusable berbagai varian
    │       ├── BaseInput.vue   ← Input teks reusable
    │       └── SkeletonLoader.vue ← Placeholder loading
    │
    ├── composables/
    │   ├── useTMDB.js          ← Semua request ke TMDB API
    │   ├── useDebounce.js      ← Debounce untuk search
    │   └── useLocalStorage.js  ← Sync state ke localStorage
    │
    ├── router/
    │   └── index.js            ← Routes + auth guard
    │
    ├── stores/
    │   ├── authStore.js        ← State user login
    │   ├── movieStore.js       ← State data film + caching
    │   └── watchlistStore.js   ← State watchlist user
    │
    └── views/
        ├── HomeView.vue        ← Landing page (sebelum login)
        ├── BrowseView.vue      ← Halaman utama setelah login
        ├── MovieDetailView.vue ← Detail film full page
        ├── SearchView.vue      ← Hasil pencarian
        ├── ProfileView.vue     ← Profil + watchlist user
        └── NotFoundView.vue    ← Halaman 404
```

---

### 🗂️ Tanggung Jawab Tiap File (Penjelasan Detail)

**`main.js`** — Titik nol aplikasi. Mendaftarkan router & Pinia, lalu `mount('#app')`.

**`App.vue`** — Root component. Isinya cukup `<RouterView />` yang akan menampilkan view sesuai route.

**`assets/css/main.css`** — Tempat `@tailwind` directives + style global (warna latar, font, sembunyi scrollbar).

**`components/layout/Navbar.vue`** — Bilah navigasi atas. Menampilkan logo Netflix, link "Home/Browse", dan avatar user (atau tombol login). Berbeda tampilan antara user yang sudah/login belum login.

**`components/layout/Footer.vue`** — Footer sederhana di bawah halaman dengan link sosial/media.

**`components/movie/MovieCard.vue`** — **Atom** terkecil: satu kartu film. Menerima props `film`, menampilkan poster + judul + rating, dan memunculkan tombol "info" saat di-hover. Emit event `klik-film` & `toggle-watchlist`.

**`components/movie/MovieRow.vue`** — **Molecule**: satu baris genre. Menerima props `title` & `films`, lalu me-`v-for` `MovieCard`. Scroll horizontal saat overflow.

**`components/movie/MovieBanner.vue`** — Hero banner. Menerima props `film`, menampilkan background blur + judul + sinopsis + tombol aksi.

**`components/movie/MovieModal.vue`** — Modal detail. Menerima props `film` & `isOpen`, menampilkan sinopsis + trailer YouTube (iframe), dan tombol watchlist. Pakai `Teleport` + `Transition`.

**`components/ui/BaseButton.vue`** — Tombol generik. Props: `varian` (primer/sekunder), `disabled`, `isLoading`. Dipakai di mana-mana agar tampilan tombol konsisten.

**`components/ui/BaseInput.vue`** — Input teks generik. Props: `modelValue` (untuk `v-model`), `placeholder`, `type`.

**`components/ui/SkeletonLoader.vue`** — Placeholder abu-abu berkedip. Props: `lebar`, `tinggi`. Dipakai saat data film dimuat.

**`composables/useTMDB.js`** — Semua logika HTTP ke TMDB ada di sini. Mengembalikan fungsi `trending()`, `cari()`, `detail()`, `byGenre()`, plus state `isLoading` & `error`.

**`composables/useDebounce.js`** — Menerima `ref` & delay, mengembalikan `ref` baru yang hanya update setelah user berhenti mengetik `delay` ms.

**`composables/useLocalStorage.js`** — Membungkus `ref` agar nilainya otomatis tersinkron ke `localStorage`.

**`router/index.js`** — Daftar route + `beforeEach` guard yang mengalihkan user jika belum login (route `requiresAuth`) atau sudah login (route `requiresGuest`).

**`stores/authStore.js`** — State: `user`, `token`, `isLoggedIn`. Actions: `login()`, `logout()`. Getter: `namaUser`, `avatarUrl`.

**`stores/movieStore.js`** — State: `trending`, `byGenre`, `detailCache`. Actions: `muatTrending()`, `muatByGenre()`, `ambilDetail()`. Getter: `filmTrending`.

**`stores/watchlistStore.js`** — State: `disimpan` (array film). Actions: `simpan()`, `hapus()`, `adaDiWatchlist()`. Getter: `jumlah`.

**`views/*.vue`** — Satu file = satu halaman penuh yang dirender router. Menggabungkan komponen + store di atas.

> 💡 **Prinsip struktur:** Kelompokkan berdasar **domain** (`movie/`, `layout/`, `ui/`), bukan sekadar tipe file. Ini membuat project tetap rapi saat membesar.

---

## 🧩 24.4 Composables — Logika yang Bisa Dipakai Ulang

Composable adalah **fungsi berakhiran `use`** yang mengembalikan state & fungsi reaktif. Keuntungannya: logika yang sama bisa dipakai di banyak view **tanpa copy-paste** (Bab 14).

### 📦 `useTMDB.js` — Jantung Komunikasi ke API

Ini composable paling penting. Satu-satunya tempat aplikasi berbicara ke TMDB.

```js
// src/composables/useTMDB.js
// ─────────────────────────────────────────────────────────────
// IMPORT
// ─────────────────────────────────────────────────────────────
import { ref } from 'vue'          // Untuk state reaktif
import axios from 'axios'          // HTTP client

// ─────────────────────────────────────────────────────────────
// BAGIAN 1: KONSTANTA & INSTANCE AXIOS
// API key diambil dari .env (wajib prefix VITE_)
// ─────────────────────────────────────────────────────────────
const API_KEY  = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

// Buat instance axios dengan baseURL & params default
// Setiap .get() nanti otomatis menyertakan api_key & language
const tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key:  API_KEY,
    language: 'id-ID',             // Supaya genre & sinopsis berbahasa Indonesia
  },
})

export function useTMDB() {
  // ─────────────────────────────────────────────────────────
  // BAGIAN 2: STATE global composable
  // isLoading & error bisa dipakai di semua view yang memanggil useTMDB
  // ─────────────────────────────────────────────────────────
  const isLoading = ref(false)
  const error     = ref(null)

  // ─────────────────────────────────────────────────────────
  // BAGIAN 3: WRAPPER jalankan()
  // Membungkus tiap request: set loading, tangani error terpusat
  // ─────────────────────────────────────────────────────────
  async function jalankan(fn) {
    isLoading.value = true          // Tampilkan spinner/skeleton
    error.value     = null
    try {
      return await fn()             // Jalankan request yang dikirim
    } catch (e) {
      error.value = e.message       // Simpan pesan error
      return null
    } finally {
      isLoading.value = false       // Sembunyikan spinner
    }
  }

  return {
    isLoading,
    error,

    // ── Ambil film trending hari ini ──
    trending: () => jalankan(async () => {
      const { data } = await tmdb.get('/trending/movie/day')
      return data.results
    }),

    // ── Cari film berdasarkan keyword ──
    cari: (keyword) => jalankan(async () => {
      const { data } = await tmdb.get('/search/movie', {
        params: { query: keyword },
      })
      return data.results
    }),

    // ── Detail film + trailer YouTube (dipanggil paralel) ──
    detail: (id) => jalankan(async () => {
      // Promise.all menjalankan 2 request bersamaan (lebih cepat)
      const [detail, video] = await Promise.all([
        tmdb.get(`/movie/${id}`),
        tmdb.get(`/movie/${id}/videos`),
      ])
      // Cari trailer pertama dari YouTube
      const trailer = video.data.results
        .find(v => v.type === 'Trailer' && v.site === 'YouTube')
      // Gabungkan data detail + trailerKey
      return { ...detail.data, trailerKey: trailer?.key }
    }),

    // ── Film per genre (discover) ──
    byGenre: (genreId) => jalankan(async () => {
      const { data } = await tmdb.get('/discover/movie', {
        params: { with_genres: genreId, sort_by: 'popularity.desc' },
      })
      return data.results
    }),
  }
}
```

Penjelasan baris penting:
- `axios.create({ baseURL })` → kita tidak perlu menulis URL penuh tiap request.
- `params: { api_key }` → key disuntikkan otomatis, sehingga tidak perlu ditulis manual.
- `Promise.all([...])` di `detail()` → dua request jalan berbarengan, menghemat waktu tunggu.
- `trailer?.key` → *optional chaining* agar tidak error kalau trailer tidak ada.

> 💡 **Kenapa tidak pakai `fetch`?** Axios mengubah response jadi `.data` secara otomatis dan punya interceptor (lihat Bab 21). Untuk project sebesar ini, Axios jauh lebih nyaman.

---

### ⏱️ `useDebounce.js` — Agar Search Tidak Membanjiri API

```js
// src/composables/useDebounce.js
import { ref, watch } from 'vue'

// Menerima sebuah ref (nilai) dan delay dalam ms
// Mengembalikan ref baru yang "telat" update
export function useDebounce(nilai, delay = 400) {
  // nilaiDebounced = hasil debounce yang dikonsumsi view
  const nilaiDebounced = ref(nilai.value)

  // Pantau perubahan pada nilai asli
  watch(nilai, (nilaiTerbaru) => {
    // Set timer: baru update setelah 'delay' ms
    const timer = setTimeout(() => {
      nilaiDebounced.value = nilaiTerbaru
    }, delay)

    // Batalin timer sebelumnya jika user masih mengetik
    // (mencegah request beruntun tiap huruf)
    return () => clearTimeout(timer)
  })

  return nilaiDebounced
}
```

Cara kerja: user ketik "b-a-t" → tanpa debounce, kita panggil API 3x. Dengan debounce 400ms, kita **tunggu** user berhenti 400ms, lalu panggil API sekali dengan "bat". Efisien!

---

### 💾 `useLocalStorage.js` — State yang Bertahan saat Refresh

```js
// src/composables/useLocalStorage.js
import { ref, watch } from 'vue'

// Buat ref yang otomatis tersinkron ke localStorage
// key    → nama di localStorage
// initial → nilai awal kalau belum ada di storage
export function useLocalStorage(key, initial = null) {
  // Baca nilai awal dari localStorage (parse dari JSON)
  const stored = localStorage.getItem(key)
  const state = ref(stored ? JSON.parse(stored) : initial)

  // Setiap state berubah → tulis ke localStorage
  watch(state, (val) => {
    localStorage.setItem(key, JSON.stringify(val))
  }, { deep: true })   // deep: agar perubahan isi array/object ikut ke-save

  return state
}
```

> 💡 Composable ini dipakai oleh `watchlistStore` dan `authStore` agar data login & watchlist **tidak hilang** saat user refresh halaman.

---

## 🏪 24.5 Pinia Stores — State Global Aplikasi

Store adalah "lemari bersama" yang bisa diakses dari komponen mana pun tanpa *props drilling* (Bab 19).

### 🔐 `authStore.js` — State User Login

```js
// src/stores/authStore.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  // ── ① STATE ──
  const user  = ref(null)
  // Baca token dari localStorage saat store pertama kali dibuat
  const token = ref(localStorage.getItem('token'))

  // ── ② GETTERS (data turunan, sifatnya computed) ──
  const isLoggedIn = computed(() => !!token.value)   // boolean
  const namaUser   = computed(() => user.value?.name ?? 'Tamu')
  const avatarUrl  = computed(() =>
    user.value?.avatar ?? '/images/default-avatar.png'
  )

  // ── ③ ACTIONS (fungsi untuk ubah state) ──
  async function login(email, password) {
    try {
      // Simulasi API login (ganti dengan panggilan API sungguhan)
      const userData  = { id: 1, name: 'Budi', email, avatar: null }
      const tokenBaru = 'token-' + Date.now()

      user.value  = userData
      token.value = tokenBaru
      // Persist agar tidak login ulang saat refresh
      localStorage.setItem('token', tokenBaru)

      return { sukses: true }
    } catch (e) {
      return { sukses: false, pesan: e.message }
    }
  }

  function logout() {
    user.value  = null
    token.value = null
    localStorage.removeItem('token')
  }

  return { user, token, isLoggedIn, namaUser, avatarUrl, login, logout }
})
```

---

### 🎞️ `movieStore.js` — State Data Film + Caching

```js
// src/stores/movieStore.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useTMDB } from '@/composables/useTMDB'

export const useMovieStore = defineStore('movie', () => {
  const tmdb = useTMDB()

  // ── STATE ──
  const trending    = ref([])           // Film trending hari ini
  const byGenre     = ref({})           // { [genreId]: { nama, films } }
  const detailCache = ref({})           // Cache detail film per id

  // ── GETTERS ──
  const filmTrending = computed(() => trending.value.slice(0, 20))

  // ── ACTIONS ──
  async function muatTrending() {
    trending.value = await tmdb.trending() ?? []
  }

  async function muatByGenre(genreId, namaGenre) {
    // Cegah request berulang kalau sudah pernah dimuat
    if (byGenre.value[genreId]) return
    byGenre.value[genreId] = {
      nama:  namaGenre,
      films: await tmdb.byGenre(genreId) ?? [],
    }
  }

  async function ambilDetail(id) {
    // Pakai cache kalau sudah pernah dibuka (hemat API call)
    if (detailCache.value[id]) return detailCache.value[id]
    const detail = await tmdb.detail(id)
    if (detail) detailCache.value[id] = detail
    return detail
  }

  return { trending, byGenre, detailCache, filmTrending, muatTrending, muatByGenre, ambilDetail }
})
```

> 💡 **Kenapa pakai cache?** TMDB membatasi jumlah request gratis per detik. Dengan cache, film yang sudah dibuka tidak perlu di-fetch ulang.

---

### ❤️ `watchlistStore.js` — State Watchlist User

```js
// src/stores/watchlistStore.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useWatchlistStore = defineStore('watchlist', () => {
  // Baca watchlist tersimpan dari localStorage saat store dibuat
  const disimpan = ref(JSON.parse(localStorage.getItem('watchlist') ?? '[]'))

  const jumlah = computed(() => disimpan.value.length)

  function simpan(film) {
    if (adaDiWatchlist(film.id)) return   // Jangan dobel
    disimpan.value.push(film)
    simpanKeStorage()
  }

  function hapus(filmId) {
    disimpan.value = disimpan.value.filter(f => f.id !== filmId)
    simpanKeStorage()
  }

  function adaDiWatchlist(filmId) {
    return disimpan.value.some(f => f.id === filmId)
  }

  // Helper internal: tulis ke localStorage
  function simpanKeStorage() {
    localStorage.setItem('watchlist', JSON.stringify(disimpan.value))
  }

  return { disimpan, jumlah, simpan, hapus, adaDiWatchlist }
})
```

---

## 🧭 24.6 Router — Routes + Auth Guard

Router menentukan **halaman mana** yang tampil untuk **URL mana**. Dan *navigation guard* melindungi halaman privat.

```js
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// ── Lazy loading: komponen hanya diunduh saat route dikunjungi ──
// Ini mempercepat load pertama kali (code splitting otomatis)
const HomeView        = () => import('@/views/HomeView.vue')
const BrowseView      = () => import('@/views/BrowseView.vue')
const MovieDetailView = () => import('@/views/MovieDetailView.vue')
const SearchView      = () => import('@/views/SearchView.vue')
const ProfileView     = () => import('@/views/ProfileView.vue')
const NotFoundView    = () => import('@/views/NotFoundView.vue')

const routes = [
  {
    path:      '/',
    name:      'home',
    component: HomeView,
    meta: { requiresGuest: true },   // Hanya untuk yang BELUM login
  },
  {
    path:      '/browse',
    name:      'browse',
    component: BrowseView,
    meta: { requiresAuth: true },    // Wajib login
  },
  {
    path:      '/movie/:id',          // :id = parameter dinamis
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
    path:      '/:pathMatch(.*)*',    // Tangkap SEMUA URL yang tidak cocok
    name:      'not-found',
    component: NotFoundView,
  },
]

const router = createRouter({
  history: createWebHistory(),       // URL bersih tanpa # (HTML5 history)
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }  // Scroll ke atas tiap pindah halaman
  },
})

// ── GLOBAL NAVIGATION GUARD ──
// Dijalankan SEBELUM setiap navigasi
router.beforeEach((to) => {
  const authStore = useAuthStore()

  // Halaman butuh login tapi user belum login → arahkan ke home
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return { name: 'home' }
  }

  // Halaman untuk guest tapi user sudah login → arahkan ke browse
  if (to.meta.requiresGuest && authStore.isLoggedIn) {
    return { name: 'browse' }
  }
})

export default router
```

| Properti `meta` | Arti | Jika dilanggar |
|---|---|---|
| `requiresAuth: true` | Halaman privat | Redirect ke `home` |
| `requiresGuest: true` | Halaman tamu (login) | Redirect ke `browse` |
| `/:pathMatch(.*)*` | Wildcard 404 | Tampilkan `NotFoundView` |

> 💡 **`useAuthStore()` di dalam guard:** Karena Pinia sudah dipasang di `main.js`, kita bisa mengakses store dari mana saja — termasuk di luar komponen (di router).

---

## 🎨 24.7 UI Components — Dari Atom sampai Organism

Sekarang bagian paling menyenangkan: membangun tampilan. Kita mulai dari yang terkecil.

### 🦴 `SkeletonLoader.vue` — Placeholder Loading

```vue
<!-- src/components/ui/SkeletonLoader.vue -->
<template>
  <!-- Elemen abu-abu dengan animasi "pulse" (kelap-kelip) -->
  <div
    class="animate-pulse bg-netflix-dark rounded-md"
    :style="{ width: lebar, height: tingi }"
  ></div>
</template>

<script setup>
// Props dengan default value
defineProps({
  lebar: { type: String, default: '100%' },
  tingi: { type: String, default: '1rem' },
})
</script>
```

> 💡 `animate-pulse` adalah utility bawaan Tailwind untuk efek berkedip. Tanpa ini, placeholder akan terlihat "mati".

---

### 🔘 `BaseButton.vue` — Tombol Konsisten di Seluruh App

```vue
<!-- src/components/ui/BaseButton.vue -->
<template>
  <button
    :disabled="disabled || isLoading"
    :class="[
      'px-6 py-2 rounded font-semibold transition flex items-center gap-2',
      varian === 'primer'   ? 'bg-netflix-red text-white hover:bg-red-700' : '',
      varian === 'sekunder' ? 'bg-white/20 text-white hover:bg-white/30' : '',
      varian === 'ghost'    ? 'bg-transparent text-white hover:underline' : '',
      (disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    ]"
    @click="$emit('klik')"
  >
    <!-- Tampilkan spinner kalau lagi loading -->
    <span v-if="isLoading">⏳</span>
    <slot />   <!-- Teks tombol diletakkan sebagai default slot -->
  </button>
</template>

<script setup>
defineProps({
  varian:    { type: String, default: 'primer' },  // primer | sekunder | ghost
  disabled:  { type: Boolean, default: false },
  isLoading: { type: Boolean, default: false },
})
defineEmits(['klik'])
</script>
```

---

### ⌨️ `BaseInput.vue` — Input Teks Reusable (support `v-model`)

```vue
<!-- src/components/ui/BaseInput.vue -->
<template>
  <input
    :type="type"
    :placeholder="placeholder"
    :value="modelValue"
    class="w-full px-4 py-3 rounded bg-netflix-dark border border-gray-600 text-white focus:border-netflix-red focus:outline-none"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup>
// modelValue + update:modelValue = mendukung v-model dari parent
defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  type:       { type: String, default: 'text' },
})
defineEmits(['update:modelValue'])
</script>
```

---

### 🎞️ `MovieCard.vue` — Atom Inti (Diberi Kode Penuh)

Ini komponen paling sering dipakai. Kita beri kode lengkap + komentar ASCII.

```vue
<!-- src/components/movie/MovieCard.vue -->
<template>
  <!--
    Root div kartu. group = agar child bisa pakai group-hover (Tailwind).
    @click emit klik-film ke parent (BrowseView/SearchView).
  -->
  <div
    class="group relative shrink-0 w-40 cursor-pointer"
    @click="$emit('klik-film', film)"
  >
    <!-- Poster film. fallback ke no-poster kalau path null -->
    <img
      :src="posterUrl"
      :alt="film.title"
      class="w-40 h-60 object-cover rounded-md transition group-hover:scale-105"
      loading="lazy"
    />

    <!-- Overlay yang muncul saat di-hover -->
    <div
      class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition rounded-md flex flex-col justify-end p-2"
    >
      <p class="text-xs font-bold truncate">{{ film.title }}</p>
      <p class="text-xs text-netflix-gray">⭐ {{ film.vote_average?.toFixed(1) }}</p>

      <!-- Tombol watchlist. .stop agar tidak memicu klik-film -->
      <button
        class="mt-1 text-xs px-2 py-1 rounded bg-netflix-red"
        @click.stop="$emit('toggle-watchlist', film)"
      >
        {{ sudahDisimpan ? '✓ Tersimpan' : '+ Watchlist' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useWatchlistStore } from '@/stores/watchlistStore'

// ── Props ──
const props = defineProps({
  film: { type: Object, required: true },
})
defineEmits(['klik-film', 'toggle-watchlist'])

// ── Store ──
const watchlist = useWatchlistStore()

// ── Computed ──
// URL poster lengkap dari TMDB image CDN
const posterUrl = computed(() =>
  props.film.poster_path
    ? `https://image.tmdb.org/t/p/w300${props.film.poster_path}`
    : '/images/no-poster.jpg'
)
// Apakah film ini sudah ada di watchlist?
const sudahDisimpan = computed(() => watchlist.adaDiWatchlist(props.film.id))
</script>
```

Penjelasan kunci:
- `group-hover:opacity-100` → overlay hanya muncul saat kursor di atas kartu.
- `@click.stop` → menghentikan event agar tidak "bocor" ke `@click` parent kartu.
- `computed posterUrl` → menghindari duplikasi logika URL di banyak tempat.

---

### 📜 `MovieRow.vue` — Baris Satu Genre (Diberi Kode Penuh)

```vue
<!-- src/components/movie/MovieRow.vue -->
<template>
  <section class="my-6">
    <!-- Judul genre -->
    <h2 class="text-lg font-bold px-4 md:px-12 mb-2">{{ title }}</h2>

    <!-- Kontainer scroll horizontal.
         no-scrollbar = sembunyikan scrollbar tapi tetap bisa geser -->
    <div class="flex gap-2 overflow-x-auto px-4 md:px-12 no-scrollbar pb-2">
      <!-- Render MovieCard berulang dari props films -->
      <MovieCard
        v-for="film in films"
        :key="film.id"
        :film="film"
        @klik-film="$emit('klik-film', $event)"
        @toggle-watchlist="$emit('toggle-watchlist', $event)"
      />
    </div>
  </section>
</template>

<script setup>
import MovieCard from './MovieCard.vue'

defineProps({
  title: { type: String, required: true },
  films: { type: Array, default: () => [] },
})
// Teruskan (forward) event dari MovieCard ke parent (BrowseView)
defineEmits(['klik-film', 'toggle-watchlist'])
</script>
```

> 💡 **Event forwarding:** `MovieCard` emit `klik-film`, lalu `MovieRow` teruskan ke `BrowseView`. Ini menjaga `BrowseView` sebagai satu tempat yang menangani aksi.

---

### 🌟 `MovieBanner.vue` — Hero Banner

```vue
<!-- src/components/movie/MovieBanner.vue -->
<template>
  <div class="relative h-[70vh] w-full">
    <!-- Background film (blur ringan) -->
    <img
      :src="bannerUrl"
      :alt="film.title"
      class="absolute inset-0 w-full h-full object-cover brightness-50"
    />

    <!-- Konten teks di atas banner -->
    <div class="absolute bottom-20 left-4 md:left-12 max-w-lg">
      <h1 class="text-3xl md:text-5xl font-extrabold mb-3">{{ film.title }}</h1>
      <p class="text-sm text-gray-200 line-clamp-3">{{ film.overview }}</p>

      <div class="mt-4 flex gap-3">
        <BaseButton varian="sekunder" @klik="$emit('putar', film)">▶ Putar</BaseButton>
        <BaseButton varian="ghost"   @klik="$emit('info', film)">ℹ Info Selengkapnya</BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps({ film: { type: Object, required: true } })
defineEmits(['putar', 'info'])

const bannerUrl = computed(() =>
  props.film.backdrop_path
    ? `https://image.tmdb.org/t/p/original${props.film.backdrop_path}`
    : '/images/no-poster.jpg'
)
</script>
```

---

### 🎭 `MovieModal.vue` — Modal Detail + Trailer (Diberi Kode Penuh)

Paling kompleks. Pakai `Teleport` agar modal muncul di `<body>` (bebas dari `overflow:hidden` parent) dan `Transition` untuk animasi.

```vue
<!-- src/components/movie/MovieModal.vue -->
<template>
  <!--
    Teleport: pindahkan DOM modal ke <body> secara literal.
    Berguna agar z-index & overflow parent tidak mengganggu modal.
  -->
  <Teleport to="body">
    <!-- Transition: animasi fade saat muncul/hilang -->
    <Transition name="modal-fade">
      <!-- Hanya render kalau isOpen true -->
      <div
        v-if="isOpen && film"
        class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
        @click.self="$emit('tutup')"   <!-- Klik area luar → tutup -->
      >
        <!-- Kotak modal -->
        <div class="bg-netflix-dark rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <!-- Header dengan tombol tutup -->
          <div class="flex justify-between items-start p-4">
            <h2 class="text-xl font-bold">{{ film.title }}</h2>
            <button class="text-2xl" @click="$emit('tutup')">✕</button>
          </div>

          <!-- Trailer YouTube (kalau ada) -->
          <div v-if="film.trailerKey" class="aspect-video">
            <iframe
              class="w-full h-full"
              :src="`https://www.youtube.com/embed/${film.trailerKey}`"
              allowfullscreen
            ></iframe>
          </div>

          <!-- Sinopsis -->
          <div class="p-4">
            <p class="text-sm text-gray-300 mb-3">{{ film.overview }}</p>
            <p class="text-sm">⭐ Rating: {{ film.vote_average?.toFixed(1) }}</p>

            <!-- Tombol watchlist -->
            <BaseButton
              class="mt-3"
              @klik="$emit('toggle-watchlist', film)"
            >
              {{ sudahDisimpan ? '✓ Hapus dari Watchlist' : '+ Tambah ke Watchlist' }}
            </BaseButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useWatchlistStore } from '@/stores/watchlistStore'

defineProps({
  film:   { type: Object, default: null },
  isOpen: { type: Boolean, default: false },
})
defineEmits(['tutup', 'toggle-watchlist'])

const watchlist = useWatchlistStore()
const sudahDisimpan = computed(() =>
  props.film ? watchlist.adaDiWatchlist(props.film.id) : false
)
</script>

<!-- Style transisi fade -->
<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from,
.modal-fade-leave-to { opacity: 0; }
</style>
```

---

### 🧭 `Navbar.vue` — Navigasi Atas

```vue
<!-- src/components/layout/Navbar.vue -->
<template>
  <header class="fixed top-0 w-full z-40 bg-gradient-to-b from-black to-transparent">
    <nav class="flex items-center justify-between px-4 md:px-12 py-4">
      <!-- Logo -->
      <RouterLink :to="{ name: 'browse' }" class="text-netflix-red text-2xl font-extrabold">
        NETFLIX
      </RouterLink>

      <!-- Menu (hanya kalau sudah login) -->
      <div v-if="auth.isLoggedIn" class="flex items-center gap-6">
        <RouterLink :to="{ name: 'browse' }" class="hover:text-gray-300">Home</RouterLink>
        <RouterLink :to="{ name: 'search' }" class="hover:text-gray-300">Search</RouterLink>
        <RouterLink :to="{ name: 'profile' }" class="hover:text-gray-300">My List</RouterLink>
        <img :src="auth.avatarUrl" class="w-8 h-8 rounded" alt="avatar" />
        <button class="text-sm text-gray-300" @click="auth.logout()">Logout</button>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
const auth = useAuthStore()   // Langsung akses state & action
</script>
```

---

### 🦶 `Footer.vue` — Footer Sederhana

```vue
<!-- src/components/layout/Footer.vue -->
<template>
  <footer class="px-4 md:px-12 py-8 text-sm text-netflix-gray">
    <p>© 2024 Netflix Clone — Dibuat dengan Vue 3 untuk tujuan pembelajaran.</p>
    <p class="mt-2">Data film dari TMDB API. Netflix adalah merek dagang pihak ketiga.</p>
  </footer>
</template>
```

---

## 📄 24.8 Views / Halaman — Menyatukan Semua

View adalah halaman penuh. Di sinilah komponen + store + composable digabung.

### 🏠 `HomeView.vue` — Landing Page (Sebelum Login)

```vue
<!-- src/views/HomeView.vue -->
<template>
  <div class="min-h-screen flex flex-col items-center justify-center text-center px-4">
    <!-- Background film dinamis -->
    <div class="absolute inset-0 -z-10">
      <img
        v-if="filmUnggulan"
        :src="`https://image.tmdb.org/t/p/original${filmUnggulan.backdrop_path}`"
        class="w-full h-full object-cover brightness-30"
        alt="background"
      />
    </div>

    <h1 class="text-4xl md:text-6xl font-extrabold mb-4">Film Tak Terbatas.</h1>
    <p class="text-lg mb-8 max-w-xl">Belajar Vue 3 dengan membangun clone Netflix sungguhan.</p>

    <!-- Form login simulasi -->
    <form class="flex flex-col gap-3 w-72" @submit.prevent="handleLogin">
      <BaseInput v-model="email" type="email" placeholder="Email" />
      <BaseInput v-model="password" type="password" placeholder="Password" />
      <BaseButton :is-loading="loading" @klik="handleLogin">Masuk</BaseButton>
      <p v-if="errorMsg" class="text-red-500 text-sm">{{ errorMsg }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useAuthStore } from '@/stores/authStore'
import { useTMDB } from '@/composables/useTMDB'

const router  = useRouter()
const auth    = useAuthStore()
const tmdb    = useTMDB()

const email   = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')
const filmUnggulan = ref(null)

// Saat halaman dimuat, ambil 1 film trending untuk background
onMounted(async () => {
  const list = await tmdb.trending()
  filmUnggulan.value = list?.[0] ?? null
})

async function handleLogin() {
  loading.value = true
  const hasil = await auth.login(email.value, password.value)
  loading.value = false
  if (hasil.sukses) {
    router.push({ name: 'browse' })   // Arahkan ke halaman utama
  } else {
    errorMsg.value = hasil.pesan
  }
}
</script>
```

---

### 🔍 `BrowseView.vue` — Halaman Utama (Diberi Kode Penuh)

Ini "jantung" aplikasi. Menampilkan banner + baris per genre + modal.

```vue
<!-- src/views/BrowseView.vue -->
<template>
  <div class="min-h-screen bg-netflix-black">
    <!-- Navbar selalu di atas -->
    <Navbar />

    <!-- Banner film unggulan -->
    <MovieBanner
      v-if="filmUnggulan"
      :film="filmUnggulan"
      @info="bukaDetail"
    />

    <!-- Skeleton saat trending belum dimuat -->
    <div v-if="movie.isLoading" class="flex gap-2 px-4 md:px-12 mt-6">
      <SkeletonLoader v-for="n in 8" :key="n" :lebar="'10rem'" :tingi="'15rem'" />
    </div>

    <!-- Baris per genre -->
    <template v-else>
      <!-- Trending -->
      <MovieRow
        title="🔥 Trending Hari Ini"
        :films="movie.filmTrending"
        @klik-film="bukaDetail"
        @toggle-watchlist="toggle"
      />

      <!-- Genre dinamis dari daftar GENRES -->
      <MovieRow
        v-for="g in Object.values(movie.byGenre)"
        :key="g.nama"
        :title="g.nama"
        :films="g.films"
        @klik-film="bukaDetail"
        @toggle-watchlist="toggle"
      />
    </template>

    <!-- Modal detail -->
    <MovieModal
      :film="filmTerpilih"
      :is-open="modalTerbuka"
      @tutup="modalTerbuka = false"
      @toggle-watchlist="toggle"
    />

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import MovieBanner from '@/components/movie/MovieBanner.vue'
import MovieRow from '@/components/movie/MovieRow.vue'
import MovieModal from '@/components/movie/MovieModal.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
import { useMovieStore } from '@/stores/movieStore'
import { useWatchlistStore } from '@/stores/watchlistStore'

const router = useRouter()
const movie  = useMovieStore()
const watchlist = useWatchlistStore()

const filmUnggulan = ref(null)
const filmTerpilih = ref(null)
const modalTerbuka = ref(false)

// Daftar genre yang ingin ditampilkan (id TMDB)
const GENRES = [
  { id: 28,  nama: '💥 Action' },
  { id: 27,  nama: '👻 Horror' },
  { id: 35,  nama: '😂 Comedy' },
  { id: 18,  nama: '🎭 Drama' },
  { id: 878, nama: '🚀 Sci-Fi' },
]

// Saat halaman dimuat: ambil trending + tiap genre
onMounted(async () => {
  await movie.muatTrending()
  filmUnggulan.value = movie.trending[0] ?? null
  // Ambil film per genre (berjalan berurutan)
  for (const g of GENRES) {
    await movie.muatByGenre(g.id, g.nama)
  }
})

// Buka modal detail (fetch detail + trailer dulu)
async function bukaDetail(film) {
  filmTerpilih.value = await movie.ambilDetail(film.id)
  modalTerbuka.value = true
}

// Toggle watchlist
function toggle(film) {
  if (watchlist.adaDiWatchlist(film.id)) watchlist.hapus(film.id)
  else watchlist.simpan(film)
}
</script>
```

---

### 🔎 `SearchView.vue` — Pencarian Real-time

```vue
<!-- src/views/SearchView.vue -->
<template>
  <div class="min-h-screen bg-netflix-black pt-20">
    <Navbar />

    <div class="px-4 md:px-12 mt-6">
      <!-- Input pencarian dengan v-model -->
      <BaseInput v-model="keyword" placeholder="Cari film..." />

      <p v-if="tmdb.isLoading" class="text-netflix-gray mt-4">⏳ Mencari...</p>
      <p v-else-if="hasil.length === 0 && keyword" class="text-netflix-gray mt-4">
        Tidak ada hasil untuk "{{ keyword }}".
      </p>

      <!-- Grid hasil -->
      <div class="flex flex-wrap gap-2 mt-4">
        <MovieCard
          v-for="film in hasil"
          :key="film.id"
          :film="film"
          @klik-film="bukaDetail"
          @toggle-watchlist="toggle"
        />
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import MovieCard from '@/components/movie/MovieCard.vue'
import { useTMDB } from '@/composables/useTMDB'
import { useDebounce } from '@/composables/useDebounce'
import { useWatchlistStore } from '@/stores/watchlistStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const tmdb = useTMDB()
const watchlist = useWatchlistStore()

const keyword = ref('')
const keywordDebounced = useDebounce(keyword, 400)  // Debounce 400ms
const hasil = ref([])

// Setiap keyword (yang sudah debounce) berubah → panggil API
watch(keywordDebounced, async (kw) => {
  if (!kw) { hasil.value = []; return }
  hasil.value = (await tmdb.cari(kw)) ?? []
})

function bukaDetail(film) {
  router.push({ name: 'movie-detail', params: { id: film.id } })
}
function toggle(film) {
  watchlist.adaDiWatchlist(film.id) ? watchlist.hapus(film.id) : watchlist.simpan(film)
}
</script>
```

---

### 🎬 `MovieDetailView.vue` — Halaman Detail Penuh

```vue
<!-- src/views/MovieDetailView.vue -->
<template>
  <div class="min-h-screen bg-netflix-black">
    <Navbar />

    <div v-if="film" class="px-4 md:px-12 py-8 max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-4">{{ film.title }}</h1>

      <!-- Trailer -->
      <div v-if="film.trailerKey" class="aspect-video mb-6">
        <iframe class="w-full h-full" :src="`https://www.youtube.com/embed/${film.trailerKey}`" allowfullscreen></iframe>
      </div>

      <p class="text-gray-300 mb-4">{{ film.overview }}</p>
      <BaseButton @klik="toggle(film)">
        {{ watchlist.adaDiWatchlist(film.id) ? '✓ Hapus dari Watchlist' : '+ Tambah ke Watchlist' }}
      </BaseButton>
    </div>

    <p v-else-if="movie.isLoading" class="text-center mt-20">⏳ Memuat...</p>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useMovieStore } from '@/stores/movieStore'
import { useWatchlistStore } from '@/stores/watchlistStore'

const route = useRoute()
const movie = useMovieStore()
const watchlist = useWatchlistStore()
const film = ref(null)

// Ambil id dari URL /movie/:id lalu fetch detail
onMounted(async () => {
  film.value = await movie.ambilDetail(route.params.id)
})
function toggle(f) {
  watchlist.adaDiWatchlist(f.id) ? watchlist.hapus(f.id) : watchlist.simpan(f)
}
</script>
```

---

### 👤 `ProfileView.vue` — Profil + Watchlist

```vue
<!-- src/views/ProfileView.vue -->
<template>
  <div class="min-h-screen bg-netflix-black pt-20">
    <Navbar />

    <div class="px-4 md:px-12 mt-6">
      <h1 class="text-2xl font-bold mb-2">Halo, {{ auth.namaUser }} 👋</h1>
      <p class="text-netflix-gray mb-6">My List ({{ watchlist.jumlah }} film)</p>

      <!-- Grid watchlist -->
      <div v-if="watchlist.jumlah" class="flex flex-wrap gap-2">
        <MovieCard
          v-for="film in watchlist.disimpan"
          :key="film.id"
          :film="film"
          @klik-film="bukaDetail"
          @toggle-watchlist="toggle"
        />
      </div>
      <p v-else class="text-netflix-gray">Kamu belum menyimpan film apapun.</p>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import MovieCard from '@/components/movie/MovieCard.vue'
import { useAuthStore } from '@/stores/authStore'
import { useWatchlistStore } from '@/stores/watchlistStore'

const router = useRouter()
const auth = useAuthStore()
const watchlist = useWatchlistStore()

function bukaDetail(film) {
  router.push({ name: 'movie-detail', params: { id: film.id } })
}
function toggle(film) {
  watchlist.adaDiWatchlist(film.id) ? watchlist.hapus(film.id) : watchlist.simpan(film)
}
</script>
```

---

### ❌ `NotFoundView.vue` — Halaman 404

```vue
<!-- src/views/NotFoundView.vue -->
<template>
  <div class="min-h-screen flex flex-col items-center justify-center text-center px-4">
    <h1 class="text-7xl font-extrabold text-netflix-red">404</h1>
    <p class="text-xl mt-4">Ups! Halaman yang kamu cari tidak ditemukan.</p>
    <RouterLink :to="{ name: 'home' }" class="mt-6 text-netflix-red underline">
      ← Kembali ke Beranda
    </RouterLink>
  </div>
</template>
```

---

## 🚀 24.9 Urutan Build Step by Step (6 Tahap Terstruktur)

Jangan langsung menulis semua file sekaligus. Ikuti urutan ini agar tiap bagian bisa diuji sebelum lanjut.

### 🪜 Step 1 — Setup & Konfigurasi
- Install dependency (`npm create vue`, `axios`, `tailwind`).
- Setup `tailwind.config.js` + `postcss.config.js`.
- Konfigurasi `.env` (isi `VITE_TMDB_API_KEY`).
- Wiring `main.js` (Vue + Router + Pinia) & `App.vue`.

> ✅ **Cek:** Jalankan `npm run dev`. Halaman kosong (tapi tidak error) berarti setup sukses.

### 🪜 Step 2 — Composable & Store
- Buat `useTMDB.js` (komunikasi TMDB API).
- Buat `useDebounce.js` & `useLocalStorage.js`.
- Buat `authStore.js`, `movieStore.js`, `watchlistStore.js`.

> ✅ **Cek:** Buka Vue DevTools → Pinia tab. Tiga store harus muncul.

### 🪜 Step 3 — Router
- Setup `routes` + `beforeEach` auth guard.

> ✅ **Cek:** Akses `/browse` tanpa login → harus otomatis kembali ke `/`.

### 🪜 Step 4 — UI Components
Urutan dari terkecil ke terbesar (aturan komponen bersarang):
1. `SkeletonLoader.vue`
2. `BaseButton.vue`
3. `BaseInput.vue`
4. `MovieCard.vue` ← atom inti
5. `MovieRow.vue`
6. `MovieBanner.vue`
7. `MovieModal.vue` ← paling kompleks
8. `Navbar.vue`
9. `Footer.vue`

> ✅ **Cek:** Render `MovieCard` secara mandiri di `HomeView` untuk lihat tampilannya.

### 🪜 Step 5 — Views / Halaman
Urutan:
1. `HomeView.vue` (landing + login)
2. `BrowseView.vue` (halaman utama)
3. `SearchView.vue`
4. `MovieDetailView.vue`
5. `ProfileView.vue`
6. `NotFoundView.vue`

> ✅ **Cek:** Login → masuk `/browse` → lihat banner + baris genre muncul.

### 🪜 Step 6 — Polish & Deploy
- Animasi transisi antar halaman (`<RouterView>` + `<Transition>`).
- Responsive breakpoints (`md:`, `lg:`).
- Error handling (tampilkan pesan kalau API gagal).
- Deploy ke Vercel / Netlify.

---

## 🌐 24.10 Deploy ke Vercel / Netlify

Langkah terakhir: bawa aplikasi dari laptop ke internet.

### 📦 Build Production

```bash
# Build untuk production → output di folder dist/
npm run build

# (Opsional) Preview hasil build secara lokal
npm run preview
```

### ▲ Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login ke akun Vercel
vercel login

# Deploy ke production
vercel --prod

# Atau cukup buka https://vercel.com/new dan drag-drop folder dist/
```

### 🔺 Deploy via Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy folder dist/
netlify deploy --prod --dir=dist
```

### ⚙️ Environment Variable — SANGAT PENTING

> ⚠️ **Ini penyebab paling sering aplikasi jalan di lokal tapi BLANK setelah deploy:**
>
> File `.env` **tidak ikut ter-upload** karena ada di `.gitignore`. Maka API key harus didaftarkan **manual** di dashboard hosting.

**Vercel:** Project → Settings → Environment Variables → tambah:
```
VITE_TMDB_API_KEY = isi_dengan_api_key_asli
```

**Netlify:** Site settings → Environment → add variable dengan nama & nilai yang sama.

> 💡 Setelah menambah env var, **wajib rebuild** (`vercel --prod` lagi / "Redeploy") agar nilai baru terbaca.

### 🗂️ `vercel.json` (Opsional, untuk SPA fallback)

Agar refresh di URL seperti `/movie/123` tidak 404 di server:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 🎬 Studi Kasus — Menyatukan `BrowseView` dari Bagian-Bagian

Mari lihat sekilas **alur data** di `BrowseView` untuk memahami bagaimana semua lapisan bekerja sama. Ini bukan kode baru, tapi **peta mental** bagaimana komponen, store, dan composable terhubung:

```
┌─────────────────────────────────────────────────────────────┐
│  BrowseView.vue (View / Halaman)                            │
│                                                             │
│  ① onMounted → movie.muatTrending()                        │
│                  ↓                                          │
│              movieStore (Pinia)                            │
│                  ↓                                          │
│              useTMDB().trending()  ──→ axios ──→ TMDB API   │
│                  ↓                                          │
│              trending ref terisi → UI otomatis update       │
│                                                             │
│  ② Template render:                                        │
│     ├─ <Navbar>        → baca authStore.isLoggedIn         │
│     ├─ <MovieBanner>   → props filmUnggulan                │
│     ├─ <MovieRow> ×N   → props title + films               │
│     │     └─ <MovieCard> ×N → emit klik-film               │
│     └─ <MovieModal>    → props film + isOpen               │
│                                                             │
│  ③ Event flow:                                             │
│     User klik kartu                                        │
│       ↓ emit('klik-film')                                  │
│     MovieCard → MovieRow (forward) → BrowseView            │
│       ↓ bukaDetail(film)                                   │
│     movie.ambilDetail(id) → isi filmTerpilih               │
│       ↓ modalTerbuka = true                                │
│     MovieModal tampil dengan trailer YouTube               │
│                                                             │
│  ④ Watchlist:                                              │
│     User klik "+ Watchlist"                                │
│       ↓ toggle(film)                                       │
│     watchlistStore.simpan(film) → localStorage sync        │
│       ↓ computed adaDiWatchlist berubah                    │
│     MovieCard & ProfileView otomatis update (reaktif!)     │
└─────────────────────────────────────────────────────────────┘
```

**Yang kamu pelajari dari studi kasus ini:**
- Komponen kecil (`MovieCard`) bisa digunakan ulang di `MovieRow`, `SearchView`, dan `ProfileView`.
- Satu store (`movieStore`) dipakai bersama tanpa *props drilling*.
- Event mengalir **ke atas** (`emit`), data mengalir **ke bawah** (`props`) — one-way data flow.
- Reaktivitas Pinia membuat `ProfileView` ikut berubah saat watchlist diubah di `BrowseView`.
- `Teleport` + `Transition` membuat modal profesional tanpa bug z-index.

---

## 🚨 Jebakan Umum Pemula di Bab 24

### ❌ Jebakan 1 — Meng-commit File `.env` ke Git

```bash
# ❌ SALAH — API key bisa bocor ke GitHub publik!
git add .env
git commit -m "add env"

# ✅ BENAR — pastikan .env ada di .gitignore
# .gitignore sudah berisi baris: .env
git status   # pastikan .env TIDAK muncul
```

> ⚠️ **Bahaya nyata:** Jika API key TMDB bocor, orang lain bisa memakai kuota API milikmu. TMDB bisa memblokir key kamu. Selalu cek `.gitignore` sebelum `git push`.

---

### ❌ Jebakan 2 — Lupa Auth Guard / Salah Letak `meta`

```js
// ❌ SALAH — halaman privat tidak dilindungi
{ path: '/browse', component: BrowseView }   // tidak ada meta.requiresAuth

// ✅ BENAR — tambahkan meta dan guard di beforeEach
{ path: '/browse', component: BrowseView, meta: { requiresAuth: true } }

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !authStore.isLoggedIn) return { name: 'home' }
})
```

> ⚠️ Tanpa guard, user bisa langsung mengetik `/browse` di URL meski belum login → data kosong & error.

---

### ❌ Jebakan 3 — API Key Tidak Terbaca (Lupa Prefix `VITE_`)

```js
// ❌ SALAH — tidak akan terbaca, hasilnya undefined
const key = import.meta.env.TMDB_API_KEY

// ✅ BENAR — Vite hanya mengekspos variabel berawalan VITE_
const key = import.meta.env.VITE_TMDB_API_KEY
```

> ⚠️ Di Vite, **hanya** variabel `.env` dengan prefix `VITE_` yang tersedia di client. Lupa prefix = aplikasi jalan tapi semua request API gagal (401).

---

### ❌ Jebakan 4 — Memanggil API di `v-for` Tanpa Cache (N+1 Request)

```js
// ❌ SALAH — tiap MovieCard memanggil detail sendiri → ratusan request!
// (jangan lakukan ini di MovieCard)
const detail = await tmdb.detail(film.id)

// ✅ BENAR — data sudah diambil di store (muatTrending/muatByGenre)
// MovieCard cukup menerima film dari props, tidak fetch sendiri
<MovieCard :film="film" />
```

> ⚠️ Satu pemanggilan di parent (store) jauh lebih efisien daripada ratusan pemanggilan di child. Ini prinsip "ambil data di atas, teruskan via props".

---

### ❌ Jebakan 5 — Debounce Tidak Dipakai di Search → API Kelebihan Beban

```js
// ❌ SALAH — request tiap huruf diketik
watch(keyword, async (kw) => { hasil.value = await tmdb.cari(kw) })

// ✅ BENAR — pakai useDebounce agar request hanya saat berhenti ketik
const keywordDebounced = useDebounce(keyword, 400)
watch(keywordDebounced, async (kw) => { hasil.value = await tmdb.cari(kw) })
```

> ⚠️ Tanpa debounce, mengetik "spiderman" memicu 9 request API. Dengan debounce 400ms, hanya 1 request. Hemat kuota & lebih cepat.

---

## 📝 Ringkasan Bab 24

| Topik | Penjelasan |
|---|---|
| **Tujuan Bab** | Menggabungkan semua konsep Bab 1–23 menjadi aplikasi nyata |
| **TMDB API** | Sumber data film gratis (poster, detail, trailer) via API key |
| **Setup** | `npm create vue` + axios + tailwind + `.env` (`VITE_` prefix) |
| **Composables** | `useTMDB` (HTTP), `useDebounce` (search), `useLocalStorage` (persist) |
| **Pinia Stores** | `authStore`, `movieStore` (cache), `watchlistStore` (localStorage) |
| **Router** | Routes + `beforeEach` auth guard (`requiresAuth`/`requiresGuest`) |
| **UI Components** | `MovieCard` → `MovieRow` → `MovieBanner` → `MovieModal` (Teleport) |
| **Views** | `Home`, `Browse`, `Search`, `MovieDetail`, `Profile`, `NotFound` |
| **Urutan Build** | 6 step: Setup → Store → Router → Components → Views → Polish/Deploy |
| **Deploy** | `npm run build` → Vercel/Netlify + env var `VITE_TMDB_API_KEY` |
| **Jebakan Utama** | `.env` bocor, lupa guard, prefix `VITE_`, N+1 request, tanpa debounce |

---

## 🏆 Selamat!

Jika kamu telah menyelesaikan bab ini sampai aplikasinya **jalan dan ter-deploy**, maka berdirilah dengan bangga: kamu bukan lagi pemula yang hanya menonton tutorial. Kamu sudah **dari Nol hingga Production-Ready**.

Mari kita lihat perjalanan panjang yang sudah kamu tempuh di ebook ini:

```
🟢 BAGIAN I   Fondasi Vue.js         → Kamu tahu apa itu Vue & struktur project
🔵 BAGIAN II  Core Concepts          → Kamu paham reaktivitas, computed, watchers
🟡 BAGIAN III Options API            → Kamu kenal cara klasik & tahu mengapa migrasi
🟠 BAGIAN IV  Composition API        → Kamu menguasai <script setup> & composables
🔴 BAGIAN V  Ekosistem Vue           → Kamu mahir Router, Pinia, & integrasi API
🟣 BAGIAN VI  Level Up               → Kamu tahu Teleport, transisi, testing, performa
🎬 BAGIAN VII Project Clone Netflix  → Kamu MEMBUAT aplikasi sungguhan end-to-end
```

Dari sebuah `<div id="app">` kosong, kamu kini punya **clone Netflix** yang:
- Mengambil data dari API eksternal,
- Punya sistem login & watchlist persisten,
- Bisa dicari real-time,
- Dan bisa diakses siapa saja di internet.

Itulah definisi sebenarnya dari **"production-ready"**. Simpan link deploy-nya di CV dan portfolio — ini contoh nyata yang jauh lebih berbicara daripada sertifikat.

> 💡 **Langkah selanjutnya setelah ebook ini:** Tambahkan fitur dari Latihan Mandiri di bawah, coba migrasi ke TypeScript, atau lanjut ke **Nuxt 3** untuk SSR. Dunia Vue terbuka lebar untukmu.

---

## 🎯 Latihan Mandiri

**⭐ Latihan 1 — Halaman Genre Khusus**
Buat view baru `GenreView.vue` yang diakses via route `/genre/:id`. Halaman ini menampilkan grid film untuk satu genre tertentu menggunakan `movieStore.muatByGenre()`. Tambahkan link dari `Navbar` menuju beberapa genre populer. Pelajari: routing dinamis + reuse store.

**⭐⭐ Latihan 2 — "My List" yang Benar-Benar Persisten & Rapi**
Saat ini `watchlistStore` menyimpan object film utuh ke localStorage. Tingkatkan: buat halaman `ProfileView` menampilkan watchlist dalam grid `MovieRow` bergaya Netflix, lengkap dengan tombol hapus dan konfirmasi. Pastikan setelah `logout` dan `login` kembali, daftar tetap utuh (karena disimpan di localStorage). Pelajari: persistence + reactivity lintas session.

**⭐⭐⭐ Latihan 3 — Grid Trailer (YouTube)**
Tambahkan section di `BrowseView` bernama "🎥 Trailer Populer" yang mengambil video trailer dari beberapa film trending (pakai `tmdb.get('/movie/{id}/videos')`) dan menampilkannya sebagai grid iframe YouTube yang bisa diputar langsung tanpa modal. Pelajari: pemanggilan API nested + embed video.

**⭐⭐⭐⭐ Latihan 4 — Tantangan: Filter Genre di Search**
Gabungkan `SearchView` dengan filter genre. User mengetik keyword DAN memilih genre dari `<select>`, lalu hasil divalidasi via computed property yang memfilter hasil TMDB berdasarkan `genre_ids`. Pastikan debounce tetap aktif. Pelajari: composable debounce + computed filtering + multi-input state.

---

*Lanjut ke ➡️ **Portfolio & Langkah Berikutnya — Mulailah membangun project sendiri di luar ebook ini!***
