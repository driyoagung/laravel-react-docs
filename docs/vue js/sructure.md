# ⚡ Ebook Vue.js — From Zero to Clone Netflix
### Panduan Lengkap Belajar Vue 3 | Options API + Composition API + Project Nyata

---

> 🎯 **Untuk Siapa Ebook Ini?**
> Ebook ini dirancang untuk **semua level** — mulai dari yang belum pernah
> menyentuh framework JavaScript apapun, hingga yang sudah punya pengalaman
> dengan React atau Angular dan ingin beralih ke Vue.
> Tidak ada yang dilewati, tidak ada yang terlalu dalam tanpa konteks.

---

> 🧰 **Tech Stack yang Digunakan**
>
> | Tool | Fungsi |
> |---|---|
> | **Vue 3** | Framework utama |
> | **Vite** | Build tool & dev server |
> | **Vue Router 4** | Navigasi antar halaman |
> | **Pinia** | State management |
> | **Axios** | HTTP request ke API |
> | **Tailwind CSS** | Styling |
> | **TMDB API** | Sumber data film untuk project |

---

## 🗺️ Peta Perjalanan Belajar

```
🟢 BAGIAN I    Fondasi Vue.js              → Bab 1  – 4
🔵 BAGIAN II   Core Concepts Vue 3         → Bab 5  – 9
🟡 BAGIAN III  Options API                 → Bab 10 – 12
🟠 BAGIAN IV   Composition API             → Bab 13 – 16
🔴 BAGIAN V    Ekosistem Vue               → Bab 17 – 21
🟣 BAGIAN VI   Level Up                    → Bab 22 – 23
🎬 BAGIAN VII  Project Clone Netflix       → Bab 24
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: 7 Bagian | 24 Bab | Zero → Production Ready
```

---

## 🗺️ Jalur Belajar per Level

> 💡 **Tidak harus membaca berurutan!** Pilih jalur yang sesuai pengalaman Anda.

| Level | Jalur yang Disarankan |
|---|---|
| 🐣 **Pemula total** | Bab 1 → 2 → 3 → 4 → 5 → 9 → 10 → 12 → 13 → 17 → 19 → 24 |
| 🐥 **Sudah tahu JS dasar** | Bab 1 → 2 → 4 → 5 → 6 → 7 → 13 → 14 → 17 → 18 → 19 → 20 → 24 |
| 🐦 **Dari React / Angular** | Bab 1 → 3 → 5 → 7 → 12 → 13 → 14 → 16 → 17 → 19 → 22 → 24 |

---

## ⭐ Bab Paling Kritis — Jangan Sampai Dilewati!

> ⚠️ **Catatan Penting:**
> Tiga bab berikut adalah **fondasi segalanya**. Jika Anda merasa bingung
> di bab-bab selanjutnya, kemungkinan besar jawabannya ada di salah satu dari tiga bab ini.

| Prioritas | Bab | Mengapa Kritis |
|---|---|---|
| 🥇 | **Bab 5** — Reaktivitas | Fondasi dari semua fitur Vue. Tanpa ini, semua terasa seperti sihir yang tidak bisa dipahami. |
| 🥈 | **Bab 13** — Composition API | Cara modern yang dipakai di seluruh sisa buku dan project akhir. |
| 🥉 | **Bab 20** — Pinia Lanjutan | State management yang benar adalah kunci aplikasi yang bisa berkembang. |

---

---

# 🟢 BAGIAN I — Fondasi Vue.js

> 🎯 **Tujuan Bagian Ini:**
> Di akhir Bagian I, Anda sudah bisa menjalankan project Vue pertama,
> memahami struktur filenya, dan menggunakan direktif-direktif dasar
> untuk membuat tampilan yang dinamis.

---

## 📖 Bab 1 — Mengenal Vue.js & Ekosistemnya

---

### 1.1 🤔 Apa itu Vue.js & Mengapa Populer?

Vue.js adalah **progressive JavaScript framework** untuk membangun antarmuka pengguna (UI). Disebut "progressive" karena bisa digunakan secara bertahap — mulai dari menambahkan sedikit interaktivitas ke halaman HTML biasa, hingga membangun aplikasi kompleks sepenuhnya.

> 💡 **Analogi Sederhana:**
> Jika HTML adalah kerangka rumah dan CSS adalah catnya, maka Vue.js adalah
> sistem kelistrikan dan plumbingnya — yang membuat rumah itu hidup dan fungsional.

---

### 1.2 ⚖️ Perbandingan Vue vs React vs Angular

| Aspek | Vue 3 | React | Angular |
|---|---|---|---|
| **Kurva belajar** | 🟢 Rendah | 🟡 Sedang | 🔴 Tinggi |
| **Ukuran bundle** | ~20KB | ~40KB | ~130KB |
| **Bahasa** | JavaScript / TypeScript | JavaScript / TypeScript | TypeScript (wajib) |
| **Pendekatan** | Opinionated ringan | Sangat fleksibel | Full framework |
| **State management** | Pinia (resmi) | Redux / Zustand / Context | NgRx / Service |
| **Dibuat oleh** | Evan You (komunitas) | Meta (Facebook) | Google |
| **Cocok untuk** | Semua skala project | Semua skala project | Enterprise besar |

> 💡 **Kapan Pilih Vue?**
> - Tim ingin kurva belajar yang lebih landai
> - Project skala kecil hingga menengah-besar
> - Ingin fleksibilitas tanpa kehilangan struktur yang jelas

---

### 1.3 🆕 Vue 2 vs Vue 3 — Apa yang Berubah?

| Fitur | Vue 2 | Vue 3 |
|---|---|---|
| **API utama** | Options API | Composition API (+ tetap support Options) |
| **Reaktivitas** | `Object.defineProperty` | `Proxy` (lebih powerful) |
| **Performance** | Baik | ~55% lebih cepat dari Vue 2 |
| **TypeScript** | Dukungan terbatas | Dukungan penuh |
| **Multiple root** | Tidak bisa | ✅ Bisa |
| **Build tool resmi** | Vue CLI | Vite |
| **State management** | Vuex | Pinia |

> ⚠️ **Catatan:**
> Ebook ini menggunakan **Vue 3**. Jika Anda menemukan kode Vue 2 di internet
> (yang sangat banyak), perhatikan perbedaan ini agar tidak bingung.

---

### 1.4 🧰 Ekosistem Vue — Gambaran Besar

```
VUE ECOSYSTEM
│
├── Core
│   └── Vue 3               → Framework utama
│
├── Official Tools
│   ├── Vite                → Build tool & dev server (super cepat!)
│   ├── Vue Router 4        → Navigasi halaman (SPA routing)
│   └── Pinia               → State management resmi
│
├── Meta-Framework
│   └── Nuxt 3              → Vue + SSR + File-based routing
│
├── UI Libraries
│   ├── Vuetify             → Material Design
│   ├── PrimeVue            → Component kaya fitur
│   └── Shadcn Vue          → Headless UI modern
│
└── Dev Tools
    ├── Vue DevTools        → Debugging di browser
    └── Volar               → VS Code extension
```

---

### 1.5 🌐 SPA vs MPA — Pilih yang Mana?

| | SPA (Single Page App) | MPA (Multi Page App) |
|---|---|---|
| **Cara kerja** | Satu halaman HTML, konten diganti JavaScript | Setiap halaman adalah file HTML baru |
| **Navigasi** | Instan, tanpa reload | Reload halaman setiap pindah |
| **SEO** | Lebih sulit (perlu SSR/SSG) | Lebih mudah secara default |
| **Contoh** | Gmail, Figma, Netflix Web | Blog, website company |
| **Vue dipakai sebagai** | Framework utama (SPA) | Ditambahkan ke halaman tertentu |

> 💡 **Untuk Ebook Ini:**
> Kita akan membangun **SPA** — seperti Netflix yang sesungguhnya.
> Pindah halaman terasa instan tanpa reload.

---

### 1.6 ⚙️ Cara Kerja Vue di Balik Layar (Virtual DOM)

```
┌─────────────────────────────────────────────┐
│              ALUR UPDATE VUE                │
│                                             │
│  Data berubah                               │
│       ↓                                     │
│  Vue hitung ulang Virtual DOM (di memori)   │
│       ↓                                     │
│  Bandingkan dengan Virtual DOM sebelumnya   │
│  (proses ini disebut "diffing")             │
│       ↓                                     │
│  Update HANYA bagian DOM yang berubah       │
│  (proses ini disebut "patching")            │
│       ↓                                     │
│  Tampilan di browser diperbarui ✅           │
└─────────────────────────────────────────────┘
```

> 💡 **Kenapa Virtual DOM?**
> Mengubah DOM sungguhan itu mahal (lambat). Vue membuat salinan DOM
> di memori (Virtual DOM), lakukan perbandingan di sana, baru update
> DOM sungguhan hanya untuk bagian yang benar-benar berubah.

---

## 📖 Bab 2 — Setup & Struktur Project

---

### 2.1 📦 Instalasi Node.js & npm

Sebelum bisa menggunakan Vue, pastikan Node.js sudah terinstall:

```bash
# Cek versi Node.js (minimal v18)
node --version

# Cek versi npm
npm --version
```

> 💡 **Jika belum install:** Download dari **https://nodejs.org** dan pilih versi LTS.

---

### 2.2 🚀 Buat Project dengan Vite

```bash
# Buat project Vue baru menggunakan create-vue (official scaffolding tool)
npm create vue@latest

# Ikuti wizard — pilihan yang disarankan untuk ebook ini:
# ✔ Project name: … netflix-clone
# ✔ Add TypeScript? … No
# ✔ Add JSX Support? … No
# ✔ Add Vue Router? … Yes      ← WAJIB
# ✔ Add Pinia? … Yes           ← WAJIB
# ✔ Add Vitest? … Yes          ← Untuk bab testing
# ✔ Add ESLint? … Yes
# ✔ Add Prettier? … Yes

# Masuk ke folder & install dependency
cd netflix-clone
npm install

# Jalankan dev server
npm run dev
# Buka browser → http://localhost:5173
```

---

### 2.3 🗂️ Anatomi Folder Project Vue

```
netflix-clone/
│
├── 📁 src/                    ← Semua kode aplikasi ada di sini
│   ├── 📄 main.js             ← Entry point — inisialisasi Vue
│   ├── 📄 App.vue             ← Root component (induk semua komponen)
│   │
│   ├── 📁 components/         ← Komponen reusable (dipakai di banyak tempat)
│   ├── 📁 views/              ← Halaman (satu file = satu halaman/route)
│   ├── 📁 router/             ← Konfigurasi Vue Router
│   │   └── 📄 index.js
│   ├── 📁 stores/             ← State Pinia
│   ├── 📁 composables/        ← Logika yang bisa dipakai ulang
│   └── 📁 assets/             ← Gambar, font, CSS global
│
├── 📁 public/                 ← File statis (favicon, dll)
├── 📄 index.html              ← HTML template utama
├── 📄 vite.config.js          ← Konfigurasi Vite
└── 📄 package.json            ← Daftar dependency & scripts
```

> 💡 **Perbedaan `components/` vs `views/`:**
> - `components/` → Potongan UI kecil yang **dipakai ulang** (`MovieCard`, `Navbar`)
> - `views/` → **Halaman penuh** yang dirender oleh Vue Router (`HomeView`, `SearchView`)

---

### 2.4 🔬 Anatomy File `.vue` — Single File Component (SFC)

Setiap file `.vue` adalah sebuah komponen yang menggabungkan HTML, JavaScript, dan CSS dalam satu file:

```vue
<!-- MovieCard.vue -->

<!-- ① TEMPLATE: Tampilan HTML komponen ini -->
<template>
  <div class="movie-card">
    <img :src="poster" :alt="title" />
    <h3>{{ title }}</h3>
  </div>
</template>

<!-- ② SCRIPT: Logika JavaScript komponen ini -->
<script setup>
// <script setup> adalah cara modern Vue 3 (Composition API)
// Semua yang dideklarasikan di sini otomatis tersedia di template

defineProps({
  title: String,
  poster: String,
})
</script>

<!-- ③ STYLE: CSS khusus komponen ini -->
<style scoped>
/* 'scoped' berarti CSS ini HANYA berlaku untuk komponen ini */
/* Tidak akan bocor ke komponen lain */
.movie-card {
  border-radius: 8px;
  overflow: hidden;
}
</style>
```

> ⚠️ **Catatan Penting tentang `scoped`:**
> CSS dengan `scoped` tidak akan mempengaruhi komponen lain.
> Ini mencegah konflik CSS antar komponen — sangat berguna di project besar.

---

### 2.5 ▶️ Perintah yang Sering Dipakai

```bash
npm run dev      # Jalankan dev server (hot reload otomatis)
npm run build    # Build untuk production (output di folder dist/)
npm run preview  # Preview hasil build di local
npm run lint     # Cek & perbaiki masalah ESLint
```

---

### 2.6 🛠️ Setup VS Code yang Direkomendasikan

| Ekstensi | Fungsi |
|---|---|
| **Volar** (Vue - Official) | Syntax highlighting, autocomplete untuk `.vue` |
| **ESLint** | Deteksi masalah kode |
| **Prettier** | Format kode otomatis |
| **Vue VSCode Snippets** | Shortcut snippet untuk Vue |
| **Tailwind CSS IntelliSense** | Autocomplete class Tailwind |

> 💡 **Tips:** Setelah install Volar, **nonaktifkan** ekstensi Vetur jika ada.
> Keduanya tidak boleh aktif bersamaan karena akan konflik.

---

## 📖 Bab 3 — Cara Berpikir "Berbasis Komponen"

---

### 3.1 🧩 Apa itu Komponen?

Komponen adalah **potongan UI yang mandiri dan bisa dipakai ulang** — punya tampilan, logika, dan style-nya sendiri. Daripada membangun satu halaman besar, kita pecah menjadi bagian-bagian kecil yang bisa dikombinasikan.

---

### 3.2 🧱 Komponen sebagai "LEGO"

> 💡 **Analogi:**
> Bayangkan Anda membangun istana LEGO. Anda tidak membuat satu bongkahan
> besar berbentuk istana — Anda merakit dari kepingan-kepingan kecil standar
> yang bisa dipakai lagi di model lain. Itulah komponen.

```
❌ Cara lama — satu file HTML raksasa:
   index.html (2000 baris, semua campur jadi satu)

✅ Cara Vue — pecah jadi komponen:
   Navbar.vue       (50 baris)
   HeroSection.vue  (80 baris)
   MovieCard.vue    (40 baris)
   MovieRow.vue     (60 baris)
   Footer.vue       (30 baris)
```

---

### 3.3 🎬 Studi Kasus: Bedah UI Netflix Menjadi Komponen

```
App.vue
│
├── 🔷 Navbar.vue
│   ├── Logo
│   ├── NavigationLinks
│   └── UserAvatar
│
├── 🔷 HeroSection.vue (Banner film unggulan)
│   ├── BackgroundImage
│   ├── MovieTitle
│   ├── MovieDescription
│   └── ActionButtons (Play, More Info)
│
├── 🔷 MovieRow.vue (diulang per genre)
│   ├── GenreTitle ("Trending Now", "Action", dll)
│   └── 🔷 MovieCard.vue (diulang per film)
│       ├── PosterImage
│       ├── HoverOverlay
│       └── QuickActionButtons
│
└── 🔷 Footer.vue
```

---

### 3.4 🌳 Hierarki Komponen — Parent & Child

```
Parent (App.vue)
    │
    │  mengirim data ke bawah  →  via PROPS
    │
    ▼
Child (MovieRow.vue)
    │
    │  mengirim event ke atas  →  via EMITS
    │
    ▲
Parent menerima event
```

> ⚠️ **Aturan Utama:**
> Data mengalir **ke bawah** (parent → child via props).
> Event mengalir **ke atas** (child → parent via emits).
> Ini disebut **"one-way data flow"** dan membuat aplikasi lebih mudah di-debug.

---

### 3.5 ♻️ Reusability — Satu Komponen, Banyak Tempat

```vue
<!-- MovieRow.vue menggunakan MovieCard berulang kali -->
<template>
  <div class="movie-row">
    <h2>{{ genre }}</h2>
    <div class="movie-list">
      <!-- Komponen MovieCard yang SAMA dipakai berkali-kali -->
      <!-- Tapi dengan data yang berbeda dari props -->
      <MovieCard
        v-for="film in daftarFilm"
        :key="film.id"
        :title="film.title"
        :poster="film.poster_path"
      />
    </div>
  </div>
</template>
```

---

### 3.6 📏 Kapan Harus Memisah Komponen?

> 💡 **Panduan Praktis — Pisah jika:**
> - Blok kode UI dipakai di **lebih dari satu tempat**
> - Satu komponen sudah **lebih dari 200-300 baris**
> - Bagian UI punya **logika yang mandiri** (punya state sendiri)
> - Tim yang berbeda mengerjakan **bagian UI yang berbeda**

---

## 📖 Bab 4 — Template Syntax & Direktif Dasar

---

### 4.1 📝 Interpolasi Teks: `{{ }}`

```vue
<template>
  <div>
    <!-- Tampilkan nilai variabel -->
    <h1>{{ judulFilm }}</h1>

    <!-- Ekspresi JavaScript sederhana juga bisa -->
    <p>{{ harga * 1.1 }}</p>
    <p>{{ namaDepan + ' ' + namaBelakang }}</p>
    <p>{{ isLoggedIn ? 'Selamat datang!' : 'Silakan login' }}</p>

    <!-- Memanggil method -->
    <p>{{ formatRupiah(harga) }}</p>
  </div>
</template>
```

> ⚠️ **Catatan:**
> `{{ }}` hanya untuk **menampilkan teks**. Tidak bisa dipakai untuk atribut HTML.
> Untuk atribut, gunakan `v-bind` (dijelaskan di bawah).

---

### 4.2 🔗 `v-bind` (`:`) — Binding Atribut HTML

```vue
<template>
  <!-- v-bind: mengikat atribut HTML ke nilai JavaScript -->

  <!-- Cara panjang -->
  <img v-bind:src="urlGambar" v-bind:alt="judulFilm" />

  <!-- Cara singkat (gunakan ini!) — titik dua sebagai shortcut -->
  <img :src="urlGambar" :alt="judulFilm" />

  <!-- Binding class secara kondisional -->
  <div :class="{ 'aktif': isAktif, 'highlighted': isHighlighted }">...</div>

  <!-- Binding style secara dinamis -->
  <div :style="{ backgroundColor: warnaTema, fontSize: ukuranFont + 'px' }">...</div>

  <!-- Binding beberapa atribut sekaligus dengan object -->
  <img v-bind="{ src: urlGambar, alt: judulFilm, loading: 'lazy' }" />
</template>
```

---

### 4.3 🖱️ `v-on` (`@`) — Event Handling

```vue
<template>
  <!-- v-on: mendengarkan event dari DOM -->

  <!-- Cara panjang -->
  <button v-on:click="tambahKeWatchlist">Simpan</button>

  <!-- Cara singkat (gunakan ini!) — @ sebagai shortcut -->
  <button @click="tambahKeWatchlist">Simpan</button>

  <!-- Inline handler untuk logika sederhana -->
  <button @click="jumlah++">Tambah</button>

  <!-- Kirim argumen ke method -->
  <button @click="hapus(film.id)">Hapus</button>

  <!-- Event modifier — .prevent mencegah default browser behavior -->
  <form @submit.prevent="kirimForm">...</form>

  <!-- Event lain yang sering dipakai -->
  <input @keyup.enter="cariFilm" />    <!-- Tekan Enter -->
  <div @mouseenter="tampilHover" />    <!-- Mouse masuk -->
  <div @mouseleave="sembunyiHover" />  <!-- Mouse keluar -->
</template>
```

---

### 4.4 🔀 `v-if`, `v-else-if`, `v-else` — Conditional Rendering

```vue
<template>
  <!-- Elemen BENAR-BENAR dihapus/ditambah dari DOM -->

  <div v-if="statusPembayaran === 'success'">
    ✅ Pembayaran Berhasil!
  </div>

  <div v-else-if="statusPembayaran === 'pending'">
    ⏳ Menunggu Konfirmasi...
  </div>

  <div v-else-if="statusPembayaran === 'failed'">
    ❌ Pembayaran Gagal
  </div>

  <div v-else>
    ❓ Status Tidak Diketahui
  </div>
</template>
```

> ⚠️ **Catatan:**
> `v-else-if` dan `v-else` harus langsung mengikuti elemen `v-if`.
> Tidak boleh ada elemen lain di antara mereka.

---

### 4.5 👁️ `v-show` — Sembunyikan Elemen (Tetap di DOM)

```vue
<template>
  <!-- Elemen TETAP di DOM, hanya style display yang diubah -->
  <div v-show="isMenuTerbuka">
    Menu Navigasi
  </div>
</template>
```

---

### 4.6 🆚 Studi Kasus: `v-if` vs `v-show`

| | `v-if` | `v-show` |
|---|---|---|
| **Cara kerja** | Hapus/tambah elemen dari DOM | Toggle `display: none` |
| **Performa toggle** | Lebih lambat (re-render) | ✅ Lebih cepat |
| **Performa awal** | ✅ Lebih cepat (tidak render jika false) | Lebih lambat (selalu render) |
| **Gunakan untuk** | Kondisi yang jarang berubah | Kondisi yang sering berubah |
| **Contoh** | Halaman 404, role-based content | Dropdown menu, tooltip, accordion |

```vue
<!-- ✅ Pakai v-if: konten admin hanya dirender jika user adalah admin -->
<AdminPanel v-if="user.role === 'admin'" />

<!-- ✅ Pakai v-show: dropdown yang sering dibuka-tutup -->
<DropdownMenu v-show="isDropdownOpen" />
```

---

### 4.7 🔁 `v-for` — Render List

```vue
<template>
  <!-- Selalu sertakan :key yang unik! -->
  <div
    v-for="film in daftarFilm"
    :key="film.id"
  >
    {{ film.title }}
  </div>

  <!-- Dengan index -->
  <li v-for="(film, index) in daftarFilm" :key="film.id">
    {{ index + 1 }}. {{ film.title }}
  </li>

  <!-- Iterasi object -->
  <p v-for="(nilai, kunci) in objekFilm" :key="kunci">
    {{ kunci }}: {{ nilai }}
  </p>

  <!-- Iterasi angka (1 sampai 5) -->
  <span v-for="n in 5" :key="n">⭐</span>
</template>
```

> ⚠️ **Wajib Pakai `:key`!**
> `:key` membantu Vue mengidentifikasi setiap elemen secara unik.
> Tanpa `:key`, Vue bisa salah mengupdate elemen saat list berubah —
> menyebabkan bug yang susah ditemukan. Selalu gunakan ID unik, bukan index!

---

### 4.8 📝 `v-model` — Two-Way Data Binding

```vue
<template>
  <!-- Input text -->
  <input v-model="keyword" placeholder="Cari film..." />
  <p>Anda mengetik: {{ keyword }}</p>

  <!-- Textarea -->
  <textarea v-model="deskripsi"></textarea>

  <!-- Checkbox -->
  <input type="checkbox" v-model="setujuSyarat" />

  <!-- Radio -->
  <input type="radio" v-model="genre" value="action" /> Action
  <input type="radio" v-model="genre" value="comedy" /> Comedy

  <!-- Select -->
  <select v-model="genreTerpilih">
    <option value="">Pilih Genre</option>
    <option value="action">Action</option>
    <option value="drama">Drama</option>
  </select>
</template>
```

> 💡 **Apa itu Two-Way Binding?**
> Ketika nilai input berubah → variabel JavaScript ikut berubah.
> Ketika variabel JavaScript berubah → nilai input ikut berubah.
> Keduanya selalu sinkron secara otomatis.

---

---

# 🔵 BAGIAN II — Core Concepts Vue 3

> 🎯 **Tujuan Bagian Ini:**
> Di akhir Bagian II, Anda menguasai reaktivitas, computed, watchers,
> cara komponen berkomunikasi satu sama lain, dan kapan lifecycle hook dipakai.

---

## 📖 Bab 5 — Reaktivitas Vue — Jantung dari Semua Fitur

---

### 5.1 🤔 Apa itu Reaktivitas?

> 💡 **Analogi Spreadsheet:**
> Di Excel, jika sel A1 = 10 dan sel B1 = `=A1*2`, maka B1 otomatis
> menampilkan 20. Ketika Anda ubah A1 menjadi 15, B1 otomatis berubah jadi 30.
> Tidak perlu klik "refresh" — perubahan menyebar otomatis.
> Inilah reaktivitas. Vue bekerja persis seperti itu untuk tampilan web.

```
Data berubah → Vue OTOMATIS update tampilan
Tidak perlu:
  ❌ document.getElementById('judul').textContent = judul
  ❌ document.querySelector('.harga').innerHTML = harga
  ✅ Cukup ubah data, tampilan ikut sendiri
```

---

### 5.2 ⚙️ Bagaimana Vue Mendeteksi Perubahan?

```
Vue 2: Menggunakan Object.defineProperty (ada keterbatasan)
Vue 3: Menggunakan Proxy (lebih powerful, deteksi lebih lengkap)

const data = reactive({ nama: 'Laptop' })
          ↓
Vue membungkus object dengan Proxy
          ↓
Setiap akses/perubahan property dicegat
          ↓
Vue tahu property mana yang dipakai oleh template
          ↓
Saat property berubah → hanya bagian yang terpengaruh yang diupdate
```

---

### 5.3 🔴 `ref()` vs `reactive()` — Kapan Pakai Masing-masing

```vue
<script setup>
import { ref, reactive } from 'vue'

// ① ref() — untuk nilai primitif (string, number, boolean)
// Akses nilainya via .value di dalam script
const jumlah    = ref(0)
const judulFilm = ref('Interstellar')
const isLoading = ref(false)

// Untuk mengubah nilai ref:
jumlah.value++           // tambah 1
judulFilm.value = 'Dune' // ganti nilai
isLoading.value = true   // ubah boolean

// ② reactive() — untuk object atau array
// Akses langsung tanpa .value
const film = reactive({
  id:      1,
  judul:   'Interstellar',
  rating:  8.6,
  tags:    ['sci-fi', 'drama'],
})

// Untuk mengubah nilai reactive:
film.judul = 'Dune'         // langsung, tanpa .value
film.rating = 9.0
film.tags.push('thriller')
</script>

<template>
  <!-- Di template, .value TIDAK perlu ditulis manual — Vue handle otomatis -->
  <p>{{ judulFilm }}</p>
  <p>{{ jumlah }}</p>
  <p>{{ film.judul }}</p>
</template>
```

> 💡 **Panduan Sederhana:**
> - Nilai tunggal (angka, teks, boolean) → pakai **`ref()`**
> - Object atau array → pakai **`reactive()`**
> - Masih bingung? Pakai **`ref()` untuk segalanya** — lebih konsisten

---

### 5.4 🔴 Studi Kasus: Counter App — Reaktivitas Secara Visual

```vue
<script setup>
import { ref } from 'vue'

// State reaktif
const hitungan = ref(0)

// Method untuk mengubah state
function tambah()  { hitungan.value++ }
function kurang()  { if (hitungan.value > 0) hitungan.value-- }
function reset()   { hitungan.value = 0 }
</script>

<template>
  <div style="text-align: center; padding: 2rem">
    <h1>{{ hitungan }}</h1>
    <!-- Saat hitungan berubah, angka di atas OTOMATIS update -->

    <button @click="kurang">➖</button>
    <button @click="reset">🔄</button>
    <button @click="tambah">➕</button>
  </div>
</template>
```

---

### 5.5 ⚠️ Keterbatasan Reaktivitas yang Wajib Diketahui

```javascript
// ❌ JANGAN LAKUKAN: Destructure reactive object langsung
const state = reactive({ nama: 'Budi', umur: 25 })
const { nama, umur } = state
// nama dan umur KEHILANGAN reaktivitas setelah destructure!

// ✅ SOLUSINYA: Gunakan toRefs()
import { toRefs } from 'vue'
const { nama, umur } = toRefs(state)
// Sekarang nama dan umur tetap reaktif ✅

// ❌ JANGAN LAKUKAN: Ganti seluruh reactive object
let produk = reactive({ nama: 'Laptop' })
produk = reactive({ nama: 'Mouse' }) // ❌ Reaktivitas hilang!

// ✅ SOLUSINYA: Update property satu per satu, atau gunakan ref
produk.nama = 'Mouse' // ✅ Benar
```

---

## 📖 Bab 6 — Computed Properties & Watchers

---

### 6.1 🧮 Computed Properties — Data yang Dihitung Otomatis

```vue
<script setup>
import { ref, computed } from 'vue'

const harga  = ref(150000)
const jumlah = ref(3)
const diskon = ref(10) // persen

// computed() menghitung ulang HANYA ketika dependensinya berubah
// Jika harga, jumlah, atau diskon tidak berubah → hasilnya di-cache
const subtotal = computed(() => harga.value * jumlah.value)

const totalDiskon = computed(() => subtotal.value * (diskon.value / 100))

const totalBayar = computed(() => subtotal.value - totalDiskon.value)

const hargaFormat = computed(() =>
  'Rp ' + totalBayar.value.toLocaleString('id-ID')
)
</script>

<template>
  <p>Subtotal : Rp {{ subtotal.toLocaleString('id-ID') }}</p>
  <p>Diskon   : Rp {{ totalDiskon.toLocaleString('id-ID') }}</p>
  <p>Total    : {{ hargaFormat }}</p>
</template>
```

---

### 6.2 ⚡ Computed vs Method — Mana Lebih Efisien?

| | `computed` | `method` |
|---|---|---|
| **Eksekusi** | Hanya saat dependensi berubah | Setiap kali template re-render |
| **Caching** | ✅ Ya — hasilnya di-cache | ❌ Tidak |
| **Kegunaan** | Data turunan yang sering diakses | Aksi yang dipicu event |
| **Return value** | Wajib return nilai | Boleh tidak return |

```vue
<script setup>
import { ref, computed } from 'vue'
const films = ref([/* 1000 film */])

// ✅ computed: filter 1000 film hanya dijalankan ulang jika 'films' berubah
const filmAksi = computed(() => films.value.filter(f => f.genre === 'action'))

// ❌ method: filter dijalankan SETIAP template re-render
function getFilmAksi() {
  return films.value.filter(f => f.genre === 'action')
}
</script>
```

---

### 6.3 👀 `watch()` — Pantau Perubahan Data

```vue
<script setup>
import { ref, watch } from 'vue'

const keyword = ref('')
const hasil   = ref([])

// watch(sumber, callback)
watch(keyword, async (nilaiBaru, nilaiLama) => {
  // Dipanggil setiap kali 'keyword' berubah
  console.log(`Dari "${nilaiLama}" → "${nilaiBaru}"`)

  if (nilaiBaru.length < 2) {
    hasil.value = []
    return
  }

  // Panggil API untuk cari film
  hasil.value = await cariFilm(nilaiBaru)
})

// Watch dengan opsi tambahan:
watch(keyword, handler, {
  immediate: true,  // Jalankan callback segera saat komponen dimuat
  deep: true,       // Pantau perubahan dalam object bersarang
})
</script>
```

---

### 6.4 🔮 `watchEffect()` — Pantau Semua Dependensi Otomatis

```vue
<script setup>
import { ref, watchEffect } from 'vue'

const userId  = ref(1)
const profil  = ref(null)

// watchEffect: OTOMATIS deteksi semua ref yang dipakai di dalam
// Tidak perlu sebutkan sumbernya secara eksplisit
watchEffect(async () => {
  // Vue otomatis tahu bahwa ini bergantung pada 'userId'
  profil.value = await ambilProfil(userId.value)
})
</script>
```

---

### 6.5 🆚 `watch` vs `watchEffect`

| | `watch` | `watchEffect` |
|---|---|---|
| **Tentukan sumber** | Manual (eksplisit) | Otomatis |
| **Akses nilai lama** | ✅ Ya (`nilaiLama`) | ❌ Tidak |
| **Jalankan saat mount** | Default: Tidak | Default: Ya |
| **Gunakan untuk** | Reaksi terhadap satu/beberapa data tertentu | Side effect yang bergantung banyak data |

---

### 6.6 🎬 Studi Kasus: Search & Filter Film Real-time

```vue
<script setup>
import { ref, computed, watch } from 'vue'

const semuaFilm  = ref([])
const keyword    = ref('')
const genreDipilih = ref('semua')
const isLoading  = ref(false)

// computed: filter berdasarkan keyword & genre (tidak perlu API call)
const filmTerfilter = computed(() => {
  return semuaFilm.value
    .filter(film => {
      const cocokKeyword = film.title.toLowerCase()
        .includes(keyword.value.toLowerCase())
      const cocokGenre = genreDipilih.value === 'semua'
        || film.genre === genreDipilih.value
      return cocokKeyword && cocokGenre
    })
})

// watch: panggil API hanya saat genre berubah (bukan saat keyword berubah)
watch(genreDipilih, async (genreBaru) => {
  isLoading.value = true
  semuaFilm.value = await ambilFilmByGenre(genreBaru)
  isLoading.value = false
})
</script>
```

---

## 📖 Bab 7 — Props & Emits — Komunikasi Antar Komponen

---

### 7.1–7.3 📨 Props — Data dari Parent ke Child

```vue
<!-- Child: MovieCard.vue -->
<script setup>
// defineProps: deklarasikan props yang diterima komponen ini
const props = defineProps({
  judul: {
    type:     String,
    required: true,  // Wajib diisi parent
  },
  rating: {
    type:    Number,
    default: 0,      // Nilai default jika tidak dikirim
  },
  poster: {
    type:    String,
    default: '/images/no-poster.jpg',
  },
  isHighlighted: {
    type:    Boolean,
    default: false,
  },
})
</script>

<template>
  <div :class="{ 'highlighted': isHighlighted }">
    <img :src="poster" :alt="judul" />
    <h3>{{ judul }}</h3>
    <span>⭐ {{ rating }}</span>
  </div>
</template>
```

```vue
<!-- Parent: MovieRow.vue -->
<template>
  <!-- Kirim data ke MovieCard via props -->
  <MovieCard
    v-for="film in daftarFilm"
    :key="film.id"
    :judul="film.title"
    :rating="film.vote_average"
    :poster="`https://image.tmdb.org/t/p/w300${film.poster_path}`"
    :is-highlighted="film.id === filmTerpilih"
  />
</template>
```

> ⚠️ **Aturan Props — Jangan Pernah Diubah di Child!**
> Props adalah **read-only** di child. Jika perlu mengubah nilai props,
> emit event ke parent dan biarkan parent yang mengubah datanya.
> Ini menjaga aliran data tetap satu arah dan mudah di-debug.

---

### 7.5–7.6 📣 Emits — Event dari Child ke Parent

```vue
<!-- Child: MovieCard.vue -->
<script setup>
defineProps({ judul: String, id: Number })

// Deklarasikan semua event yang bisa di-emit
const emit = defineEmits([
  'klik-film',
  'tambah-watchlist',
  'hapus-watchlist',
])

function handleKlik() {
  // Emit event ke parent beserta data yang dibutuhkan
  emit('klik-film', { id: props.id, judul: props.judul })
}
</script>

<template>
  <div @click="handleKlik">
    <button @click.stop="emit('tambah-watchlist', props.id)">
      ➕ Simpan
    </button>
  </div>
</template>
```

```vue
<!-- Parent: BrowseView.vue -->
<template>
  <MovieCard
    v-for="film in films"
    :key="film.id"
    :judul="film.title"
    :id="film.id"
    @klik-film="bukaModalDetail"
    @tambah-watchlist="simpanKeWatchlist"
  />
</template>
```

---

## 📖 Bab 8 — Slots — Komponen yang Fleksibel

---

### 8.1–8.5 🎰 Dasar hingga Scoped Slots

```vue
<!-- Komponen BaseCard.vue dengan named slots -->
<template>
  <div class="card">
    <!-- Named slot: header -->
    <div class="card-header">
      <slot name="header">
        <!-- Fallback: ditampilkan jika slot tidak diisi -->
        <h3>Judul Default</h3>
      </slot>
    </div>

    <!-- Default slot (tanpa nama) -->
    <div class="card-body">
      <slot />
    </div>

    <!-- Named slot: footer -->
    <div class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>
```

```vue
<!-- Cara menggunakannya -->
<BaseCard>
  <!-- Isi named slot 'header' -->
  <template #header>
    <h2>🎬 Film Populer</h2>
  </template>

  <!-- Isi default slot -->
  <MovieList :films="films" />

  <!-- Isi named slot 'footer' -->
  <template #footer>
    <button>Lihat Semua</button>
  </template>
</BaseCard>
```

---

### 8.6 🎬 Studi Kasus: Modal Reusable dengan Named Slots

```vue
<!-- BaseModal.vue -->
<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click.self="$emit('tutup')">
      <div class="modal-container">
        <slot name="header" />
        <slot />
        <slot name="footer" />
      </div>
    </div>
  </Teleport>
</template>

<!-- Dipakai untuk Modal Trailer Film -->
<BaseModal :is-open="modalTerbuka" @tutup="modalTerbuka = false">
  <template #header>
    <h2>{{ filmDipilih.title }}</h2>
  </template>

  <iframe :src="urlTrailer" allowfullscreen />

  <template #footer>
    <button @click="tambahWatchlist">➕ Tambah ke Watchlist</button>
  </template>
</BaseModal>
```

---

## 📖 Bab 9 — Lifecycle Hooks

---

### 9.1–9.2 🔄 Diagram Lengkap Lifecycle Vue 3

```
Komponen dibuat
      │
      ▼
  setup()              ← Composition API dimulai di sini
      │
      ▼
onBeforeMount()        ← Sebelum komponen dipasang ke DOM
      │                   (DOM belum tersedia)
      ▼
 [DOM dibuat]
      │
      ▼
onMounted()            ← ✅ Komponen sudah di DOM
      │                   Tempat terbaik untuk: fetch data, init library,
      │                   set interval, akses DOM element
      │
   [Data berubah?]
      │
      ▼
onBeforeUpdate()       ← Sebelum DOM diupdate
      │
      ▼
 [DOM diupdate]
      │
      ▼
onUpdated()            ← DOM sudah diupdate
      │                   ⚠️ Hati-hati infinite loop di sini!
      │
   [Komponen dihapus?]
      │
      ▼
onBeforeUnmount()      ← Sebelum komponen dihancurkan
      │
      ▼
 [Komponen dihancurkan]
      │
      ▼
onUnmounted()          ← ✅ Komponen sudah tidak ada
                           Tempat untuk: clearInterval, removeEventListener,
                           cancel subscription, tutup koneksi
```

---

### 9.3–9.6 🎬 Studi Kasus: Fetch Data dengan Lifecycle

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const films    = ref([])
const isLoading = ref(true)
let intervalId  = null

// onMounted: jalankan setelah komponen ada di DOM
onMounted(async () => {
  try {
    // Fetch data saat komponen pertama kali dimuat
    films.value = await ambilFilmTrending()

    // Refresh data setiap 5 menit
    intervalId = setInterval(async () => {
      films.value = await ambilFilmTrending()
    }, 5 * 60 * 1000)

  } finally {
    isLoading.value = false
  }
})

// onUnmounted: bersihkan saat komponen dihancurkan
onUnmounted(() => {
  // Jika interval tidak dibersihkan → memory leak!
  if (intervalId) clearInterval(intervalId)
})
</script>
```

> ⚠️ **Memory Leak adalah Bug Tersembunyi yang Berbahaya!**
> Selalu bersihkan `setInterval`, `addEventListener`, dan subscription
> di `onUnmounted`. Jika tidak, kode akan terus berjalan di memori
> meski komponen sudah tidak tampil — menyebabkan aplikasi semakin lambat.

---

---

# 🟡 BAGIAN III — Options API

> 🎯 **Tujuan Bagian Ini:**
> Memahami cara klasik Vue yang masih banyak dipakai.
> Ini adalah fondasi untuk memahami mengapa Composition API dibuat.

---

## 📖 Bab 10 — Options API — Cara Klasik Vue

---

### 10.1 🏗️ Struktur Lengkap Options API

```vue
<script>
export default {
  // Metadata komponen
  name: 'NamaKomponen',

  // Komponen lain yang dipakai
  components: { MovieCard, Navbar },

  // Data yang diterima dari parent
  props: {
    filmId: { type: Number, required: true }
  },

  // Event yang bisa di-emit ke parent
  emits: ['film-dipilih', 'ditutup'],

  // State lokal komponen
  data() {
    return {
      film: null,
      isLoading: false,
      errorPesan: '',
    }
  },

  // Data turunan (otomatis update saat dependensi berubah)
  computed: {
    judulLengkap() {
      return `${this.film?.title} (${this.film?.release_date?.slice(0,4)})`
    },
  },

  // Pantau perubahan data
  watch: {
    filmId(idBaru) {
      this.ambilDetailFilm(idBaru)
    }
  },

  // Method / fungsi
  methods: {
    async ambilDetailFilm(id) {
      this.isLoading = true
      this.film = await fetchFilm(id)
      this.isLoading = false
    },
    pilihFilm() {
      this.$emit('film-dipilih', this.film)
    }
  },

  // Lifecycle hooks
  mounted() {
    this.ambilDetailFilm(this.filmId)
  },
  unmounted() {
    // Cleanup
  }
}
</script>
```

---

### 10.4 ⚠️ Jebakan `this` di Arrow Function

```javascript
// ❌ SALAH — arrow function tidak punya 'this' sendiri
methods: {
  ambilData() {
    setTimeout(() => {
      this.data = 'berhasil' // ✅ Ini aman — arrow function inherit 'this'
    }, 1000)
  },

  // ❌ JANGAN gunakan arrow function sebagai method
  metodeSalah: () => {
    console.log(this) // undefined! Arrow function tidak punya 'this' Vue
  }
}
```

> ⚠️ **Aturan Mudah:**
> - **Method** → Selalu gunakan `function` biasa (bukan arrow)
> - **Di dalam method** (callback, setTimeout) → Arrow function aman

---

### 10.6 📊 Kelebihan & Kekurangan Options API

| ✅ Kelebihan | ❌ Kekurangan |
|---|---|
| Sangat mudah dibaca untuk pemula | Logika tersebar (data di `data()`, method di `methods()`, dst) |
| Struktur yang konsisten & predictable | Sulit extract & reuse logika antar komponen |
| Dokumentasi & contoh online melimpah | `this` bisa membingungkan |
| Cocok untuk komponen sederhana | Tidak cocok untuk komponen dengan banyak fitur |

---

## 📖 Bab 11 — Fitur Lanjutan Options API

---

### 11.3 📡 `provide` & `inject` — Kirim Data Melewati Banyak Level

```vue
<!-- GrandParent: App.vue -->
<script>
export default {
  provide() {
    return {
      temaWarna: 'dark',
      userLogin: this.user,
    }
  }
}
</script>

<!-- GrandChild: MovieCard.vue — skip parent di tengah! -->
<script>
export default {
  inject: ['temaWarna', 'userLogin'],
  mounted() {
    console.log(this.temaWarna) // 'dark' — dapat dari App.vue!
  }
}
</script>
```

> 💡 **Gunakan `provide/inject` untuk:**
> - Tema aplikasi (dark/light mode)
> - Data user yang login
> - Konfigurasi global
>
> ⚠️ **Jangan berlebihan** — untuk state yang kompleks, gunakan Pinia.

---

## 📖 Bab 12 — Migrasi Mindset: Options API → Composition API

---

### 12.2 😤 Masalah Options API di Project Besar

```javascript
// Bayangkan komponen dengan BANYAK fitur:
// Fitur A: pencarian film
// Fitur B: filter genre
// Fitur C: watchlist

export default {
  data() {
    return {
      // Fitur A 🔴
      keywordCari: '',
      hasilCarian: [],
      // Fitur B 🔵
      genreDipilih: '',
      daftarGenre: [],
      // Fitur C 🟢
      watchlist: [],
      isWatchlistTerbuka: false,
    }
  },
  methods: {
    // Fitur A 🔴
    async cariFilm() { ... },
    resetCarian() { ... },
    // Fitur B 🔵
    filterGenre() { ... },
    ambilGenre() { ... },
    // Fitur C 🟢
    tambahWatchlist() { ... },
    hapusWatchlist() { ... },
  },
  // Logika setiap fitur tersebar di banyak tempat!
  // Sangat sulit untuk extract "Fitur A" saja ke file lain
}
```

---

### 12.4 📊 Tabel Konversi Lengkap

| Options API | Composition API | Catatan |
|---|---|---|
| `data()` | `ref()` / `reactive()` | State lokal |
| `computed: {}` | `computed(() => ...)` | Data turunan |
| `methods: {}` | `function namaFungsi()` | Fungsi biasa |
| `watch: {}` | `watch(src, cb)` | Pantau perubahan |
| `mounted()` | `onMounted(() => ...)` | Lifecycle hook |
| `unmounted()` | `onUnmounted(() => ...)` | Cleanup |
| `props: {}` | `defineProps({})` | Terima props |
| `emits: []` | `defineEmits([])` | Kirim event |
| `provide()` | `provide(key, value)` | Kirim ke descendant |
| `inject: []` | `inject(key)` | Terima dari ancestor |
| Mixins | Composables | Logika reusable |

---

---

# 🟠 BAGIAN IV — Composition API

> 🎯 **Tujuan Bagian Ini:**
> Menguasai cara modern Vue. Semua kode di project Netflix clone
> akan ditulis dengan Composition API.

---

## 📖 Bab 13 — Composition API & `<script setup>`

---

### 13.3 ✨ `<script setup>` — Cara yang Direkomendasikan

```vue
<!-- ❌ Cara lama dengan setup() function -->
<script>
import { ref } from 'vue'
export default {
  setup() {
    const hitungan = ref(0)
    function tambah() { hitungan.value++ }
    return { hitungan, tambah } // Harus di-return manual!
  }
}
</script>

<!-- ✅ Cara modern dengan <script setup> -->
<script setup>
import { ref } from 'vue'

const hitungan = ref(0)
function tambah() { hitungan.value++ }
// Tidak perlu return! Semua otomatis tersedia di template
</script>
```

> 💡 **Keuntungan `<script setup>`:**
> - Lebih ringkas — tidak ada boilerplate
> - Tidak perlu `return` manual
> - Performa lebih baik (dikompilasi lebih optimal)
> - Ini adalah cara yang **direkomendasikan** oleh tim Vue

---

### 13.6 🔄 `toRef()` & `toRefs()` — Destrukturisasi Reaktif

```vue
<script setup>
import { reactive, toRefs, toRef } from 'vue'

const film = reactive({
  judul:  'Interstellar',
  tahun:  2014,
  rating: 8.6,
})

// ❌ Destrukturisasi biasa — KEHILANGAN reaktivitas
const { judul } = film // judul tidak reaktif lagi!

// ✅ toRefs() — destrukturisasi DENGAN reaktivitas
const { judul, tahun, rating } = toRefs(film)
// Sekarang judul, tahun, rating tetap reaktif

// ✅ toRef() — untuk satu property saja
const rating = toRef(film, 'rating')
</script>
```

---

## 📖 Bab 14 — Composables — Logika yang Bisa Dipakai Ulang

---

### 14.1 🧩 Apa itu Composable?

> 💡 **Analogi:**
> Composable seperti **alat masak serbaguna** — dibuat sekali,
> bisa dipakai di resep mana saja. `useFetch()` bisa dipakai
> di `HomeView`, `SearchView`, maupun `MovieDetailView` —
> tanpa copy-paste kode.

```
Tanpa Composable:
  HomeView.vue       → isLoading, error, data, try/catch (30 baris)
  SearchView.vue     → isLoading, error, data, try/catch (30 baris lagi!)
  DetailView.vue     → isLoading, error, data, try/catch (30 baris lagi!)

Dengan Composable:
  useFetch.js        → isLoading, error, data, try/catch (30 baris, SEKALI SAJA)
  HomeView.vue       → const { data } = useFetch(url) (1 baris)
  SearchView.vue     → const { data } = useFetch(url) (1 baris)
  DetailView.vue     → const { data } = useFetch(url) (1 baris)
```

---

### 14.3 📦 Buat Composable: `useFetch()`

```javascript
// composables/useFetch.js
import { ref } from 'vue'

export function useFetch(urlAwal) {
  const data      = ref(null)
  const isLoading = ref(false)
  const error     = ref(null)

  async function fetch(url = urlAwal) {
    isLoading.value = true
    error.value     = null

    try {
      const response = await window.fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      data.value = await response.json()

    } catch (e) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  // Langsung fetch jika URL sudah diberikan
  if (urlAwal) fetch()

  return { data, isLoading, error, fetch }
}
```

```vue
<!-- Penggunaan di komponen -->
<script setup>
import { useFetch } from '@/composables/useFetch'

const {
  data:      films,
  isLoading,
  error
} = useFetch('https://api.themoviedb.org/3/trending/movie/day')
</script>

<template>
  <div v-if="isLoading">⏳ Memuat film...</div>
  <div v-else-if="error">❌ Error: {{ error }}</div>
  <div v-else>
    <MovieCard v-for="film in films?.results" :key="film.id" :film="film" />
  </div>
</template>
```

---

### 14.5 ⏱️ Buat Composable: `useDebounce()` — untuk Search

```javascript
// composables/useDebounce.js
import { ref, watch } from 'vue'

export function useDebounce(nilai, delay = 500) {
  const nilaiDebounced = ref(nilai.value)

  watch(nilai, (nilaiTerbaru) => {
    // Tunggu 'delay' ms setelah user berhenti mengetik
    // Baru jalankan pencarian
    const timer = setTimeout(() => {
      nilaiDebounced.value = nilaiTerbaru
    }, delay)

    // Batal timer sebelumnya jika user masih mengetik
    return () => clearTimeout(timer)
  })

  return nilaiDebounced
}
```

```vue
<script setup>
import { ref } from 'vue'
import { useDebounce } from '@/composables/useDebounce'
import { useTMDB } from '@/composables/useTMDB'

const keyword         = ref('')
const keywordDebounced = useDebounce(keyword, 400)
// keywordDebounced baru berubah 400ms setelah user berhenti ketik

const { hasilCarian } = useTMDB()

watch(keywordDebounced, (keyword) => {
  if (keyword) hasilCarian.cari(keyword)
})
</script>

<input v-model="keyword" placeholder="Cari film..." />
```

---

## 📖 Bab 15 — Template Refs & Reaktivitas Lanjutan

---

### 15.1–15.3 🎯 Template Ref & `defineExpose()`

```vue
<!-- VideoPlayer.vue (Child) -->
<script setup>
import { ref } from 'vue'

const videoEl = ref(null) // Akan merujuk ke elemen <video>

// Expose method ke parent
defineExpose({
  play:  () => videoEl.value?.play(),
  pause: () => videoEl.value?.pause(),
  mute:  () => { videoEl.value.muted = true }
})
</script>

<template>
  <video ref="videoEl" :src="src" />
</template>
```

```vue
<!-- Parent: MovieModal.vue -->
<script setup>
import { useTemplateRef } from 'vue'

const playerRef = useTemplateRef('player')

function handleTutup() {
  playerRef.value?.pause() // Pause video saat modal ditutup
  emit('tutup')
}
</script>

<template>
  <VideoPlayer ref="player" :src="urlTrailer" />
  <button @click="handleTutup">✕ Tutup</button>
</template>
```

---

## 📖 Bab 16 — Composable Lanjutan & Patterns

---

### 16.7 🎬 Studi Kasus: `useTMDB()` untuk Project Netflix

```javascript
// composables/useTMDB.js
import { ref } from 'vue'
import axios from 'axios'

const API_KEY  = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key:  API_KEY,
    language: 'id-ID',
  }
})

export function useTMDB() {
  const isLoading = ref(false)
  const error     = ref(null)

  async function jalankan(fungsi) {
    isLoading.value = true
    error.value     = null
    try {
      return await fungsi()
    } catch (e) {
      error.value = e.message
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,

    // Ambil film trending hari ini
    trending: () => jalankan(async () => {
      const { data } = await tmdb.get('/trending/movie/day')
      return data.results
    }),

    // Cari film berdasarkan keyword
    cari: (keyword) => jalankan(async () => {
      const { data } = await tmdb.get('/search/movie', {
        params: { query: keyword }
      })
      return data.results
    }),

    // Detail film + trailer
    detail: (id) => jalankan(async () => {
      const [detail, video] = await Promise.all([
        tmdb.get(`/movie/${id}`),
        tmdb.get(`/movie/${id}/videos`),
      ])
      const trailer = video.data.results
        .find(v => v.type === 'Trailer' && v.site === 'YouTube')
      return { ...detail.data, trailerKey: trailer?.key }
    }),

    // Film per genre
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

---

# 🔴 BAGIAN V — Ekosistem Vue

> 🎯 **Tujuan Bagian Ini:**
> Menguasai Vue Router dan Pinia — tanpa keduanya, aplikasi Vue
> hanyalah halaman statis yang tidak bisa berkembang.

---

## 📖 Bab 17 — Vue Router — Navigasi Halaman

---

### 17.3 🗺️ Mendefinisikan Routes

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// Lazy loading: komponen hanya diunduh saat halaman dikunjungi
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
    meta: { requiresGuest: true } // Hanya untuk yang belum login
  },
  {
    path:      '/browse',
    name:      'browse',
    component: BrowseView,
    meta: { requiresAuth: true } // Harus login
  },
  {
    path:      '/movie/:id', // :id adalah parameter dinamis
    name:      'movie-detail',
    component: MovieDetailView,
    meta: { requiresAuth: true }
  },
  {
    path:      '/search',
    name:      'search',
    component: SearchView,
    meta: { requiresAuth: true }
  },
  {
    path:      '/profile',
    name:      'profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path:      '/:pathMatch(.*)*', // Tangkap semua URL yang tidak cocok
    name:      'not-found',
    component: NotFoundView,
  },
]
```

---

### 17.9 🛡️ Navigation Guards

```javascript
// Lanjutan router/index.js
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // Scroll ke atas setiap pindah halaman
    return { top: 0, behavior: 'smooth' }
  }
})

// Global guard — dijalankan SEBELUM setiap navigasi
router.beforeEach((to, from) => {
  const authStore = useAuthStore()

  // Halaman butuh login tapi user belum login → redirect ke Home
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return { name: 'home' }
  }

  // Halaman untuk guest tapi user sudah login → redirect ke Browse
  if (to.meta.requiresGuest && authStore.isLoggedIn) {
    return { name: 'browse' }
  }
})

export default router
```

---

### 17.7–17.8 🧭 Navigasi di Komponen

```vue
<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter() // untuk navigasi programmatic
const route  = useRoute()  // untuk baca info route saat ini

// Baca parameter dari URL /movie/123
const filmId = route.params.id     // '123'

// Baca query string dari URL /search?q=batman
const keyword = route.query.q      // 'batman'

// Navigasi programmatic
function keHalamanDetail(id) {
  router.push({ name: 'movie-detail', params: { id } })
}

function kembali() {
  router.go(-1)
}
</script>

<template>
  <!-- Navigasi via template -->
  <RouterLink :to="{ name: 'browse' }">Browse</RouterLink>
  <RouterLink :to="{ name: 'movie-detail', params: { id: film.id } }">
    {{ film.title }}
  </RouterLink>

  <!-- RouterLink dengan active class otomatis -->
  <RouterLink
    to="/browse"
    active-class="nav-aktif"
    exact-active-class="nav-exact-aktif"
  >
    Browse
  </RouterLink>
</template>
```

---

## 📖 Bab 18 — Vue Router Lanjutan & Best Practices

---

### 18.5 🎭 Transisi Antar Halaman

```vue
<!-- App.vue — Tambahkan animasi saat pindah route -->
<template>
  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" :key="$route.path" />
    </Transition>
  </RouterView>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

---

## 📖 Bab 19 — Pinia — State Management Modern

---

### 19.1 🤔 Mengapa State Management Dibutuhkan?

```
MASALAH TANPA STATE MANAGEMENT:

Navbar.vue ──────────────────────────────────────┐
  (perlu tahu: siapa yang login?)                │
                                                 │
BrowseView.vue                                   │  Data yang sama
  (perlu tahu: siapa yang login?)                │  harus dikirim
                                                 │  via props
WatchlistView.vue                                │  berlapis-lapis
  (perlu tahu: siapa yang login? apa watchlist?) │  (props drilling!)
                                                 │
ProfileView.vue ─────────────────────────────────┘
  (perlu tahu: siapa yang login?)

SOLUSI DENGAN PINIA:

               🏪 authStore
              (data user login)
                    │
    ┌───────────────┼───────────────┐
    │               │               │
Navbar.vue   BrowseView.vue  WatchlistView.vue
  (akses         (akses           (akses
  langsung)      langsung)        langsung)
```

---

### 19.4–19.7 🏪 Buat Store Pertama

```javascript
// stores/authStore.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  // ① STATE — data yang disimpan
  const user      = ref(null)
  const token     = ref(localStorage.getItem('token'))

  // ② GETTERS — data turunan (seperti computed)
  const isLoggedIn = computed(() => !!token.value)
  const namaUser   = computed(() => user.value?.name ?? 'Tamu')
  const avatarUrl  = computed(() =>
    user.value?.avatar ?? '/images/default-avatar.png'
  )

  // ③ ACTIONS — fungsi untuk ubah state
  async function login(email, password) {
    try {
      // Simulasi API login (ganti dengan API sungguhan)
      const userData = { id: 1, name: 'Budi', email, avatar: null }
      const tokenBaru = 'token-' + Date.now()

      user.value  = userData
      token.value = tokenBaru
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

### 19.8 🔌 Gunakan Store di Komponen

```vue
<script setup>
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

// storeToRefs: destrukturisasi state & getters DENGAN reaktivitas
const { user, isLoggedIn, namaUser } = storeToRefs(authStore)

// Actions bisa langsung dipanggil tanpa storeToRefs
async function handleLogin() {
  const hasil = await authStore.login(email.value, password.value)
  if (hasil.sukses) router.push({ name: 'browse' })
}
</script>

<template>
  <div v-if="isLoggedIn">Selamat datang, {{ namaUser }}!</div>
  <button @click="authStore.logout">Logout</button>
</template>
```

---

## 📖 Bab 20 — Pinia Lanjutan & Best Practices

---

### 20.7 🎬 Studi Kasus Netflix — 3 Store Utama

```javascript
// stores/movieStore.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useTMDB } from '@/composables/useTMDB'

export const useMovieStore = defineStore('movie', () => {
  const tmdb = useTMDB()

  const trending    = ref([])
  const byGenre     = ref({})
  const detailCache = ref({}) // Cache detail film yang sudah pernah dibuka

  const filmTrending = computed(() => trending.value.slice(0, 20))

  async function muatTrending() {
    trending.value = await tmdb.trending() ?? []
  }

  async function muatByGenre(genreId, namaGenre) {
    if (byGenre.value[genreId]) return // Sudah ada di cache
    byGenre.value[genreId] = {
      nama: namaGenre,
      films: await tmdb.byGenre(genreId) ?? []
    }
  }

  async function ambilDetail(id) {
    if (detailCache.value[id]) return detailCache.value[id]
    const detail = await tmdb.detail(id)
    if (detail) detailCache.value[id] = detail
    return detail
  }

  return { trending, byGenre, filmTrending, muatTrending, muatByGenre, ambilDetail }
})
```

```javascript
// stores/watchlistStore.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useWatchlistStore = defineStore('watchlist', () => {
  // Persist ke localStorage secara manual
  const disimpan = ref(JSON.parse(localStorage.getItem('watchlist') ?? '[]'))

  const jumlah = computed(() => disimpan.value.length)

  function simpan(film) {
    if (adaDiWatchlist(film.id)) return
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

  function simpanKeStorage() {
    localStorage.setItem('watchlist', JSON.stringify(disimpan.value))
  }

  return { disimpan, jumlah, simpan, hapus, adaDiWatchlist }
})
```

---

## 📖 Bab 21 — HTTP Request & Integrasi API

---

### 21.3–21.4 🔧 Setup Axios dengan Interceptor

```javascript
// lib/axios.js
import axios from 'axios'

const tmdbAxios = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 10000, // 10 detik timeout
})

// Request Interceptor — dijalankan sebelum setiap request dikirim
tmdbAxios.interceptors.request.use((config) => {
  // Tambahkan API key otomatis ke setiap request
  config.params = {
    ...config.params,
    api_key:  import.meta.env.VITE_TMDB_API_KEY,
    language: 'id-ID',
  }
  return config
})

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
    return Promise.reject(error)
  }
)

export default tmdbAxios
```

---

---

# 🟣 BAGIAN VI — Level Up

> 🎯 **Tujuan Bagian Ini:**
> Teknik-teknik yang membedakan developer Vue biasa
> dengan developer Vue yang benar-benar mahir.

---

## 📖 Bab 22 — Komponen Lanjutan & Teknik Khusus

---

### 22.3 🌀 Teleport — Modal yang Benar

```vue
<!-- MovieModal.vue -->
<template>
  <!--
    Teleport: render komponen ini di LUAR hierarki DOM normal
    Ditempatkan langsung di <body>, bukan di dalam parent component
    Ini menghindari masalah z-index dan overflow: hidden dari parent
  -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="modal-overlay" @click.self="$emit('tutup')">
        <div class="modal-content">
          <button class="modal-close" @click="$emit('tutup')">✕</button>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
```

---

### 22.2 💾 KeepAlive — Cache Komponen

```vue
<!-- App.vue atau layout -->
<template>
  <RouterView v-slot="{ Component }">
    <!--
      KeepAlive: komponen yang di-cache tidak akan di-destroy
      saat disembunyikan — state-nya tetap ada saat ditampilkan lagi

      Contoh: SearchView menyimpan hasil pencarian meski user
      navigasi ke halaman lain dan kembali
    -->
    <KeepAlive :include="['SearchView', 'BrowseView']">
      <component :is="Component" />
    </KeepAlive>
  </RouterView>
</template>
```

---

### 22.6 🎭 Transisi & Animasi untuk Movie List

```vue
<template>
  <!-- TransitionGroup: animasi untuk list yang berubah -->
  <TransitionGroup name="film-list" tag="div" class="movie-grid">
    <MovieCard
      v-for="film in filmTerfilter"
      :key="film.id"
      :film="film"
    />
  </TransitionGroup>
</template>

<style>
/* Animasi masuk: fade + slide dari bawah */
.film-list-enter-active {
  transition: all 0.4s ease;
}
.film-list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

/* Animasi keluar: fade */
.film-list-leave-active {
  transition: opacity 0.3s ease;
}
.film-list-leave-to {
  opacity: 0;
}

/* Animasi geser saat urutan berubah */
.film-list-move {
  transition: transform 0.4s ease;
}
</style>
```

---

## 📖 Bab 23 — Performa, Testing & Best Practices

---

### 23.7 🧪 Pengenalan Testing di Vue

```javascript
// MovieCard.test.js — Contoh unit test dengan Vitest + Vue Test Utils
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MovieCard from '@/components/movie/MovieCard.vue'

describe('MovieCard', () => {
  const propsDefault = {
    film: {
      id:          1,
      title:       'Interstellar',
      vote_average: 8.6,
      poster_path: '/poster.jpg',
    }
  }

  it('menampilkan judul film dengan benar', () => {
    const wrapper = mount(MovieCard, { props: propsDefault })
    expect(wrapper.text()).toContain('Interstellar')
  })

  it('menampilkan rating film', () => {
    const wrapper = mount(MovieCard, { props: propsDefault })
    expect(wrapper.text()).toContain('8.6')
  })

  it('emit event klik-film saat diklik', async () => {
    const wrapper = mount(MovieCard, { props: propsDefault })
    await wrapper.trigger('click')
    expect(wrapper.emitted('klik-film')).toBeTruthy()
    expect(wrapper.emitted('klik-film')[0][0].id).toBe(1)
  })
})
```

---

### 23.8 🗂️ Best Practices Struktur Folder

```
src/
├── assets/
│   ├── images/
│   └── css/
│       └── main.css
│
├── components/
│   ├── layout/         ← Komponen tata letak halaman
│   │   ├── Navbar.vue
│   │   └── Footer.vue
│   ├── movie/          ← Komponen khusus domain film
│   │   ├── MovieCard.vue
│   │   ├── MovieRow.vue
│   │   ├── MovieBanner.vue
│   │   └── MovieModal.vue
│   └── ui/             ← Komponen UI generik/reusable
│       ├── BaseButton.vue
│       ├── BaseInput.vue
│       ├── BaseModal.vue
│       └── SkeletonLoader.vue
│
├── composables/        ← Satu file per composable
│   ├── useTMDB.js
│   ├── useFetch.js
│   ├── useDebounce.js
│   └── useLocalStorage.js
│
├── router/
│   └── index.js
│
├── stores/
│   ├── authStore.js
│   ├── movieStore.js
│   └── watchlistStore.js
│
└── views/              ← Satu file per halaman/route
    ├── HomeView.vue
    ├── BrowseView.vue
    ├── MovieDetailView.vue
    ├── SearchView.vue
    ├── ProfileView.vue
    └── NotFoundView.vue
```

> 💡 **Prinsip yang Dipegang:**
> - **Satu file, satu tanggung jawab**
> - Kelompokkan berdasarkan **domain** (movie, user, dll) bukan tipe file
> - Nama file yang jelas lebih baik daripada komentar yang panjang

---

---

# 🎬 BAGIAN VII — Project: Clone Netflix

> 🎯 **Tujuan Bagian Ini:**
> Terapkan **semua** yang dipelajari dari Bab 1 hingga 23
> dalam satu project nyata yang bisa masuk ke portfolio Anda.

---

## 📖 Bab 24 — Project Clone Netflix dengan TMDB API

---

### 24.1 🎯 Fitur yang Akan Dibangun

| Fitur | Teknologi yang Dipakai |
|---|---|
| ✅ Landing page dengan background film dinamis | Vue 3 + TMDB API |
| ✅ Simulasi login (simpan ke Pinia + localStorage) | Pinia authStore |
| ✅ Hero Banner film unggulan | Composable useTMDB |
| ✅ Movie Rows per genre (Trending, Action, Horror, dll) | movieStore + v-for |
| ✅ Modal detail film + embed trailer YouTube | Teleport + Transition |
| ✅ Search film real-time dengan debounce | useDebounce composable |
| ✅ Tambah/hapus film dari Watchlist | watchlistStore |
| ✅ Halaman Watchlist user | Vue Router + Pinia |
| ✅ Skeleton loading saat data diambil | SkeletonLoader component |
| ✅ Animasi transisi antar halaman | Vue Transition |
| ✅ Responsive design (mobile & desktop) | Tailwind CSS |
| ✅ Build & deploy ke Vercel/Netlify | Vite build |

---

### 24.2 📦 Setup Project & Install Dependency

```bash
# Buat project baru
npm create vue@latest netflix-clone -- \
  --router --pinia --vitest --eslint --prettier

cd netflix-clone

# Install dependency tambahan
npm install axios
npm install -D tailwindcss autoprefixer

# Setup Tailwind
npx tailwindcss init -p

# Buat file .env untuk API key
echo "VITE_TMDB_API_KEY=your_api_key_here" > .env
```

> 💡 **Dapatkan TMDB API Key Gratis:**
> 1. Daftar di **https://www.themoviedb.org**
> 2. Masuk ke **Settings → API**
> 3. Request API key (gratis, langsung disetujui)
> 4. Salin API key ke file `.env`

---

### 24.3 📁 Struktur Folder Final

```
netflix-clone/
├── .env                        ← API keys (jangan commit ke Git!)
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
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
    │   │   └── Footer.vue
    │   ├── movie/
    │   │   ├── MovieCard.vue   ← Kartu satu film (poster + hover effect)
    │   │   ├── MovieRow.vue    ← Baris film satu genre (scroll horizontal)
    │   │   ├── MovieBanner.vue ← Hero banner film unggulan
    │   │   └── MovieModal.vue  ← Modal detail + trailer YouTube
    │   └── ui/
    │       ├── BaseButton.vue
    │       ├── BaseInput.vue
    │       └── SkeletonLoader.vue
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

### 24.9 🚀 Urutan Build Step by Step

```
Step 1 ─── Setup & Konfigurasi
           ├── Install dependency
           ├── Setup Tailwind CSS
           ├── Konfigurasi .env (TMDB API key)
           └── Setup main.js (Vue + Router + Pinia)

Step 2 ─── Composable & Store
           ├── Buat useTMDB.js (komunikasi TMDB API)
           ├── Buat useDebounce.js
           ├── Buat authStore.js
           ├── Buat movieStore.js
           └── Buat watchlistStore.js

Step 3 ─── Router
           └── Setup routes + auth guard

Step 4 ─── UI Components
           ├── SkeletonLoader.vue
           ├── BaseButton.vue
           ├── BaseInput.vue
           ├── MovieCard.vue     ← Mulai dari terkecil
           ├── MovieRow.vue
           ├── MovieBanner.vue
           ├── MovieModal.vue    ← Paling kompleks
           ├── Navbar.vue
           └── Footer.vue

Step 5 ─── Views / Halaman
           ├── HomeView.vue      ← Landing page
           ├── BrowseView.vue    ← Halaman utama
           ├── SearchView.vue
           ├── MovieDetailView.vue
           ├── ProfileView.vue
           └── NotFoundView.vue

Step 6 ─── Polish & Deploy
           ├── Animasi transisi antar halaman
           ├── Responsive breakpoints
           ├── Error handling
           └── Deploy ke Vercel / Netlify
```

---

### 24.10 🌐 Deploy ke Vercel

```bash
# Build production
npm run build
# Output ada di folder dist/

# Deploy via Vercel CLI
npm install -g vercel
vercel login
vercel --prod

# Atau drag & drop folder dist/ ke vercel.com/new
```

> ⚠️ **Penting saat Deploy:**
> Tambahkan environment variable `VITE_TMDB_API_KEY` di dashboard Vercel/Netlify.
> File `.env` tidak ikut di-deploy karena ada di `.gitignore`.

---

---

## 📊 Ringkasan Struktur Final Ebook

```
📚 EBOOK VUE.JS — FROM ZERO TO CLONE NETFLIX
│
├── 🟢 BAGIAN I   — Fondasi Vue.js              Bab 1  – 4
│   ├── Bab 1  ─ Mengenal Vue.js & Ekosistemnya
│   ├── Bab 2  ─ Setup & Struktur Project
│   ├── Bab 3  ─ Cara Berpikir Berbasis Komponen
│   └── Bab 4  ─ Template Syntax & Direktif Dasar
│
├── 🔵 BAGIAN II  — Core Concepts Vue 3         Bab 5  – 9
│   ├── Bab 5  ─ Reaktivitas Vue
│   ├── Bab 6  ─ Computed Properties & Watchers
│   ├── Bab 7  ─ Props & Emits
│   ├── Bab 8  ─ Slots
│   └── Bab 9  ─ Lifecycle Hooks
│
├── 🟡 BAGIAN III — Options API                 Bab 10 – 12
│   ├── Bab 10 ─ Options API — Cara Klasik Vue
│   ├── Bab 11 ─ Fitur Lanjutan Options API
│   └── Bab 12 ─ Migrasi Mindset: Options → Composition
│
├── 🟠 BAGIAN IV  — Composition API             Bab 13 – 16
│   ├── Bab 13 ─ Composition API & <script setup>
│   ├── Bab 14 ─ Composables
│   ├── Bab 15 ─ Template Refs & Reaktivitas Lanjutan
│   └── Bab 16 ─ Composable Lanjutan & Patterns
│
├── 🔴 BAGIAN V   — Ekosistem Vue               Bab 17 – 21
│   ├── Bab 17 ─ Vue Router Dasar
│   ├── Bab 18 ─ Vue Router Lanjutan & Best Practices
│   ├── Bab 19 ─ Pinia Dasar
│   ├── Bab 20 ─ Pinia Lanjutan & Best Practices
│   └── Bab 21 ─ HTTP Request & Integrasi API
│
├── 🟣 BAGIAN VI  — Level Up                    Bab 22 – 23
│   ├── Bab 22 ─ Komponen Lanjutan & Teknik Khusus
│   └── Bab 23 ─ Performa, Testing & Best Practices
│
└── 🎬 BAGIAN VII — Project Clone Netflix        Bab 24
    └── Bab 24 ─ Project Clone Netflix dengan TMDB API

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total  :  7 Bagian  |  24 Bab
Target :  Semua level (pemula hingga menengah)
Stack  :  Vue 3 + Vite + Vue Router 4 + Pinia + Axios + TMDB API
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

*Ebook Vue.js — From Zero to Clone Netflix*
*Vue 3 + Vite + Vue Router 4 + Pinia + Axios + Tailwind CSS + TMDB API*