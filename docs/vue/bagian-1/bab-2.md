# ⚙️ Bab 2 — Setup & Struktur Project

> *"Sebelum bisa menari, kita harus memasang panggungnya dulu. Node.js adalah fondasinya, Vite adalah tukang bangunnya, dan struktur folder adalah denah rumah yang akan kita tinggali sepanjang ebook ini."*
>

---

> **🧠 Apa Itu "Setup" dalam Vue?**
>
>
> **Setup** adalah tahap menyiapkan alat-alat dan kerangka kerja agar kita bisa menulis kode Vue dengan nyaman. Ini mencakup: memasang **Node.js** (runtime JavaScript), membuat project dengan **Vite** (scaffolding tool), memahami **struktur folder**, dan mengenal **Single File Component (.vue)**. Tanpa setup yang benar, kode Vue tidak akan bisa dijalankan.
>
> Anggaplah setup ini seperti menyiapkan dapur sebelum memasak: kompor (Node), peralatan (Vite), dan tata letak dapur (folder) harus siap agar memasak (coding) berjalan lancar.
>

---

> **🏗️ Analogi Sederhana:**
>
>
> Bayangkan Anda akan membuka restoran. Anda tidak langsung masak di tanah kosong. Anda butuh: **bangunan** (Node.js = fondasi tempat semua berjalan), ** Listrik & air** (npm = pasokan alat & bahan), **pembuat denah otomatis** (Vite = yang menyusun struktur dapur), dan **meja kerja berlabel** (folder `src/` = tempat Anda bekerja setiap hari). Setup yang rapi membuat "memasak" (menulis fitur) jadi menyenangkan, bukan berantakan.
>

---

## 📋 Daftar Isi Bab 2

1. Instalasi Node.js & npm — Fondasi Tooling
2. Membuat Project dengan Vite (create-vue)
3. Anatomi Folder Project Vue (src, components, views, dll)
4. Anatomy File `.vue` — Single File Component (SFC)
5. Perbedaan `components/` vs `views/`
6. Perintah npm yang Sering Dipakai (dev, build, preview, lint)
7. Setup VS Code yang Direkomendasikan (Volar, ESLint, Prettier)
8. Memahami `package.json` & `vite.config.js`
9. Troubleshooting Setup Umum
10. 🎬 Studi Kasus — Menjelajahi Project netflix-clone
11. 🚨 Jebakan Umum Pemula di Bab 2
12. 📝 Ringkasan & 🎯 Latihan Mandiri

---

## 📦 2.1 Instalasi Node.js & npm — Fondasi Tooling

Vue dan alat pendukungnya (Vite, npm) berjalan di atas **Node.js** — sebuah *runtime* JavaScript di luar browser. Tanpa Node.js, Anda tidak bisa menjalankan build tool modern. Pastikan sudah terpasang:

```bash
# Cek versi Node.js (minimal v18)
node --version

# Cek versi npm (Node Package Manager — untuk install library)
npm --version
```

Penjelasan perintah:

- `node --version` — mencetak versi Node.js. Ebook ini butuh **minimal v18**. Jika muncul error "command not found", berarti Node belum terpasang.
- `npm --version` — npm otomatis ikut terpasang bersama Node.js. Ini adalah "toko" tempat kita mengunduh library seperti Vue, Vite, Pinia, dll.

```
NODE.JS = "Mesin" tempat kode build tool berjalan
NPM     = "Toko / Package manager" untuk mengunduh library
─────────────────────────────────────────────────────
Tanpa Node  → Vite tidak bisa jalan
Tanpa npm   → tidak bisa install Vue, Pinia, Router
```

> 💡 **Jika belum install:** Download dari **https://nodejs.org** dan pilih versi **LTS** (Long Term Support). Versi LTS lebih stabil untuk pengembangan aplikasi nyata dibanding versi "Current" yang eksperimental.

> 📌 **Catatan Penting:**
> Setelah install Node, **tutup dan buka kembali terminal/Command Prompt Anda**. Perubahan PATH hanya berlaku untuk jendela terminal baru. Jika tetap error, restart komputer sekali.

### 🔍 Apa Itu Sebenarnya Node.js?

Banyak pemula tahu "harus install Node" tapi tidak paham *apa* itu. Penjelasan sederhana:

```
Browser biasa:
   JavaScript berjalan DI DALAM halaman web (terbatas)

Node.js:
   JavaScript berjalan DI KOMPUTER ANDA (bebas)
   → bisa baca file, jalankan server, compile kode
```

Node.js mengambil *engine* JavaScript dari Google Chrome (V8) lalu menanamkannya di komputer, sehingga JavaScript bisa berjalan di luar browser. Vite, yang merupakan alat build Vue, sebenarnya adalah program Node.js yang menulis & mengawasi file Anda.

### 📋 Perbandingan Version Manager (Opsional)

Jika Anda sering ganti-ganti project, pertimbangkan version manager:

| Alat | Fungsi |
| --- | --- |
| **nvm** (Mac/Linux) | Ganti versi Node dengan `nvm use 18` |
| **nvm-windows** | Sama untuk Windows |
| **fnm** | Version manager Node super cepat |

Tidak wajib untuk ebook ini, tapi berguna saat project berbeda butuh Node versi berbeda.

---

## 🚀 2.2 Membuat Project dengan Vite (create-vue)

Vite adalah *build tool* resmi Vue 3 yang super cepat. Untuk membuat project, gunakan *scaffolding tool* resmi `create-vue`:

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

Mari kita bedah apa yang terjadi:

1. `npm create vue@latest` — menjalankan wizard interaktif untuk menyusun struktur project. `netflix-clone` adalah nama folder sekaligus nama aplikasi kita.
2. **TypeScript = No** — agar fokus ke Vue dulu tanpa kerumitan tipe data. (Bisa ditambahkan nanti saat sudah mahir.)
3. **Vue Router = Yes** — wajib untuk navigasi antar halaman (SPA).
4. **Pinia = Yes** — wajib untuk *state management* (menyimpan data film, user, dll secara global).
5. **Vitest = Yes** — framework testing resmi Vue, dipakai di bab testing nanti.
6. `cd netflix-clone` — masuk ke folder project.
7. `npm install` — mengunduh semua library yang dibutuhkan ke folder `node_modules`.
8. `npm run dev` — menyalakan *dev server*; buka `http://localhost:5173` di browser untuk melihat aplikasi jalan.

```
ALUR PEMBUATAN PROJECT
npm create vue@latest
        │
        ▼
Wizard tanya fitur (Router, Pinia, dll)
        │
        ▼
Folder netflix-clone terbuat (kerangka kosong)
        │
        ▼
npm install  → unduh library ke node_modules/
        │
        ▼
npm run dev  → buka localhost:5173 👀
```

> 💡 **Tips:** `localhost:5173` adalah alamat lokal. Angka 5173 bisa berubah jika port sudah dipakai aplikasi lain — lihat pesan di terminal saat `npm run dev` dijalankan.

> 📌 **Catatan Penting:**
> Jangan hapus folder `node_modules` secara manual tanpa alasan. Di situlah semua dependency tersimpan. Jika project corrupt, cara paling aman adalah hapus `node_modules` lalu jalankan `npm install` ulang (bukan hapus `package.json`!).

### 🔍 Apa Itu "Scaffolding"?

```
Scaffolding = "memasang kerangka bangunan"
Seperti scaffolding di gedung: struktur sementara
yang memberi Anda titik start rapi.

Tanpa scaffolding: Anda mulai dari file kosong,
harus setup bundler, router, eslint sendiri (ribet!).

Dengan create-vue: semua sudah disusun rapi,
Anda tinggal mulai menulis fitur.
```

### 📋 Alternatif Jika Wizard Gagal

Kadang `npm create vue@latest` bermasalah di jaringan lambat. Alternatif:

```bash
# Cara eksplisit dengan npx
npx create-vue@latest netflix-clone

# Atau tentukan semua opsi sekaligus (non-interaktif)
npm create vue@latest netflix-clone -- --router --pinia --eslint --prettier
```

---

## 🗂️ 2.3 Anatomi Folder Project Vue

Setelah `npm create vue` selesai, Anda akan melihat struktur seperti ini:

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

Penjelasan folder penting:

- **`src/`** — "source", tempat 99% kode Anda berada.
- **`main.js`** — titik masuk aplikasi. Di sinilah Vue "dinyalakan" dan `App.vue` dipasang ke halaman.
- **`App.vue`** — komponen akar yang membungkus seluruh aplikasi.
- **`components/`** — potongan UI kecil yang dipakai berulang (mis. `MovieCard`, `Navbar`).
- **`views/`** — halaman utuh yang dipanggil Vue Router (mis. `HomeView`).
- **`router/index.js`** — peta jalan: URL mana menampilkan `view` mana.
- **`stores/`** — penyimpanan data global (Pinia).
- **`composables/`** — fungsi logika yang bisa dipakai di banyak komponen.
- **`assets/`** — gambar, font, CSS global.
- **`public/`** — file yang langsung disalin ke hasil build (favicon, robots.txt).
- **`index.html`** — satu-satunya HTML; di sinilah aplikasi SPA dimulai.
- **`vite.config.js`** — pengaturan Vite (plugin, alias path, dll).
- **`package.json`** — daftar library & perintah (`scripts`) seperti `dev`, `build`.

```
ALUR FILE SAAT APP JALAN
index.html
   → <script src="/src/main.js">
        → createApp(App).mount('#app')
            → App.vue (root)
                → <RouterView /> tampilkan view aktif
                    → HomeView.vue / BrowseView.vue / dll
                        → components (MovieCard, Navbar, ...)
```

> 💡 **Perbedaan `components/` vs `views/`:**
> - `components/` → Potongan UI kecil yang **dipakai ulang** (`MovieCard`, `Navbar`).
> - `views/` → **Halaman penuh** yang dirender oleh Vue Router (`HomeView`, `SearchView`).
>
> Aturan praktis: kalau ia "halaman" yang punya URL sendiri → masuk `views/`. Kalau ia "bagian" yang muncul di banyak halaman → masuk `components/`.

---

## 🔬 2.4 Anatomy File `.vue` — Single File Component (SFC)

Keistimewaan Vue: satu komponen = **satu file** `.vue` yang menggabungkan HTML ( template), JavaScript (logika), dan CSS (style). Ini disebut **Single File Component (SFC)**. Mari bedah contoh `MovieCard.vue`:

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

Tiga blok utama:

1. **`<template>`** — struktur HTML komponen. `{{ title }}` menampilkan teks, `:src` mengikat atribut ke data (akan dibahas Bab 4).
2. **`<script setup>`** — logika komponen. `defineProps` mendeklarasikan data yang diterima dari luar (props `title` & `poster`). Kata kunci `setup` membuat semua variabel/fungsi otomatis bisa dipakai di template — tanpa perlu `return` manual.
3. **`<style scoped>`** — CSS hanya berlaku di komponen ini.

```
STRUKTUR SFC
┌─────────────────────────────┐
│ <template>  → TAMPILAN     │
│ <script>    → LOGIKA       │
│ <style>     → TAMPILAN GAYA│
└─────────────────────────────┘
   ↑ Ketiganya dalam 1 file .vue
```

> ⚠️ **Catatan Penting tentang `scoped`:**
> CSS dengan `scoped` tidak akan mempengaruhi komponen lain. Ini mencegah konflik CSS antar komponen — sangat berguna di project besar. Tanpa `scoped`, sebuah `.button { color: red }` di satu komponen bisa merusak semua tombol di aplikasi.

> 💡 **Tips:** Anda boleh punya lebih dari satu `<style>` — misal satu `scoped` dan satu global (tanpa `scoped`) bila perlu mengatur elemen global seperti `body`.

### 🔍 Contoh SFC Lebih Lengkap (dengan reaktivitas)

```vue
<!-- CounterBox.vue -->
<template>
  <div class="counter">
    <p>Hitungan: {{ hitungan }}</p>
    <button @click="tambah">➕</button>
    <button @click="reset">🔄</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// State lokal komponen
const hitungan = ref(0)

// Method
function tambah() {
  hitungan.value++
}

function reset() {
  hitungan.value = 0
}
</script>

<style scoped>
.counter {
  padding: 1rem;
  border: 1px solid #333;
  border-radius: 8px;
}
</style>
```

Perhatikan: `hitungan` dideklarasikan dengan `ref(0)`, lalu di template cukup `{{ hitungan }}` (tanpa `.value`). Vue secara otomatis "membuka" ref di template.

---

## 🔀 2.5 Perbedaan `components/` vs `views/`

Ini sering membingungkan pemula. Mari perjelas dengan contoh:

```vue
<!-- views/HomeView.vue — INI ADALAH HALAMAN -->
<!-- Dipanggil oleh Vue Router saat URL = "/" -->
<template>
  <main>
    <Navbar />
    <HeroSection />
    <MovieRow genre="Trending" />
    <Footer />
  </main>
</template>
```

```vue
<!-- components/MovieRow.vue — INI ADALAH POTONGAN UI -->
<!-- Dipakai di banyak view (Home, Search, dll) -->
<template>
  <section>
    <h2>{{ genre }}</h2>
    <div class="grid">
      <MovieCard v-for="f in films" :key="f.id" :film="f" />
    </div>
  </section>
</template>
```

| Aspek | `views/` | `components/` |
| --- | --- | --- |
| Punya URL sendiri? | ✅ Ya (via router) | ❌ Tidak |
| Dipakai ulang di banyak tempat? | ❌ Biasanya satu tempat | ✅ Ya |
| Contoh | `HomeView`, `BrowseView` | `Navbar`, `MovieCard` |
| Ditambahkan ke router? | ✅ Wajib didaftar | ❌ Cukup di-import |

> 🎯 **Aturan Emas:**
> Kalau Anda sadar "bagian ini punya alamat web sendiri" → `views/`.
> Kalau Anda sadar "bagian ini muncul di banyak halaman" → `components/`.

---

## ▶️ 2.6 Perintah npm yang Sering Dipakai

Sepanjang ebook, Anda akan sering mengetik perintah npm ini:

```bash
npm run dev      # Jalankan dev server (hot reload otomatis)
npm run build    # Build untuk production (output di folder dist/)
npm run preview  # Preview hasil build di local
npm run lint     # Cek & perbaiki masalah ESLint
```

Bedah singkat:

- `npm run dev` — mode pengembangan. Setiap kali Anda menyimpan file, browser **otomatis refresh** (*hot reload*). Ini yang paling sering dipakai harian.
- `npm run build` — "mengepak" aplikasi jadi file siap deploy (HTML, JS, CSS minimal) di folder `dist/`. File ini yang di-upload ke server hosting.
- `npm run preview` — menjalankan hasil `build` secara lokal untuk memastikan versi production benar-benar jalan sebelum deploy.
- `npm run lint` — memeriksa gaya penulisan kode lewat ESLint & memperbaiki yang bisa diperbaiki otomatis.

```
PERBEDAAN dev vs build
npm run dev     → kode ASLI, mudah di-debug, lambat di-load
npm run build   → kode DI-MINIFY, cepat di-load, sulit di-debug
npm run preview → jalankan hasil build secara lokal
```

> 📌 **Catatan Penting:**
> `npm run dev` hanya untuk development. **Jangan** gunakan folder hasil `dev` untuk production. Selalu jalankan `npm run build` lalu deploy isi folder `dist/`.

---

## 🛠️ 2.7 Setup VS Code yang Direkomendasikan

Agar menulis `.vue` nyaman, pasang ekstensi berikut di Visual Studio Code:

| Ekstensi | Fungsi |
| --- | --- |
| **Volar** (Vue - Official) | Syntax highlighting, autocomplete untuk `.vue` |
| **ESLint** | Deteksi masalah kode |
| **Prettier** | Format kode otomatis |
| **Vue VSCode Snippets** | Shortcut snippet untuk Vue |
| **Tailwind CSS IntelliSense** | Autocomplete class Tailwind |

Penjelasan:

- **Volar** — pengganti Vue Tools lama; wajib agar VS Code paham sintaks `.vue` (highlight, *autocomplete*, *error checking*).
- **ESLint** — menjaga kode tetap rapi & menangkap bug pola buruk.
- **Prettier** — memformat kode otomatis (spasi, titik koma) saat menyimpan.
- **Vue VSCode Snippets** — ketik `vbase` lalu Enter, struktur SFC langsung muncul.
- **Tailwind CSS IntelliSense** — saran nama class Tailwind saat mengetik.

> 💡 **Tips:** Setelah install Volar, **nonaktifkan** ekstensi Vetur jika ada. Keduanya tidak boleh aktif bersamaan karena akan konflik. Vetur adalah ekstensi era Vue 2; Volar adalah penerusnya untuk Vue 3.

> 📌 **Catatan Penting:**
> Sangat disarankan mengaktifkan *"Format On Save"* untuk Prettier di pengaturan VS Code. Ini menyelamatkan Anda dari debat gaya kode dalam tim dan menjaga konsistensi otomatis.

### 🔍 Contoh Snippet yang Berguna

```
Ketik: vbase    → hasilkan struktur SFC kosong
Ketik: vfor    → hasilkan v-for loop
Ketik: vmodel  → hasilkan input v-model
Ketik: vprops  → hasilkan defineProps
```

---

## 📄 2.8 Memahami `package.json` & `vite.config.js`

Dua file konfigurasi paling penting yang sering diabaikan pemula:

### 📋 package.json

```json
{
  "name": "netflix-clone",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs --fix"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.3.0",
    "pinia": "^2.1.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "vite": "^5.2.0",
    "eslint": "^8.57.0"
  }
}
```

Penjelasan:

- **`scripts`** — perintah `npm run X` memanggil yang ada di sini. `dev` → jalankan `vite`.
- **`dependencies`** — library yang **wajib** saat aplikasi jalan (vue, router, pinia).
- **`devDependencies`** — library hanya dipakai saat **development** (vite, eslint).

```
dependencies    → ikut ke production (user butuh)
devDependencies → cuma buat developer (build tool, linter)
```

### 📋 vite.config.js

```js
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],          // Aktifkan plugin Vue
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)), // alias @ → src
    },
  },
})
```

Penjelasan:

- **`plugins: [vue()]`** — memberi tahu Vite cara memproses file `.vue`.
- **`alias '@'`** — memungkinkan Anda menulis `import X from '@/components/X'` alih-alih path relatif panjang `../../components/X`.

> 💡 **Tips:** Alias `@` sangat menyelamatkan saat struktur folder dalam. Biasakan pakai `@/...` daripada `../..`.

---

## 🩹 2.9 Troubleshooting Setup Umum

Masalah setup adalah hal pertama yang membuat pemula menyerah. Berikut daftar & solusi:

| Gejala | Penyebab Umum | Solusi |
| --- | --- | --- |
| `node: command not found` | Node belum terinstall | Install Node LTS, buka terminal baru |
| `npm create vue` lambat/nanggung | Koneksi internet | Pakai `npx create-vue@latest` |
| Port 5173 sudah dipakai | App lain jalan | Biarkan Vite pilih port lain, lihat terminal |
| `Cannot find module 'vue'` | `npm install` belum jalan | Jalankan `npm install` di folder project |
| Error Volar/Vetur bentrok | Dua ekstensi aktif | Nonaktifkan Vetur |
| Hot reload tidak jalan | File di luar `src/` | Pastikan edit file di dalam `src/` |

```bash
# Solusi darurat "reset" project:
rm -rf node_modules      # hapus dependency
rm package-lock.json     # hapus lockfile
npm install              # install ulang
npm run dev
```

> ⚠️ **Catatan:**
> Jangan panik saat error muncul. Salin pesan error ke Google — 99% sudah pernah dialami orang lain. Komunitas Vue sangat membantu.

---

## 🎬 Studi Kasus — Menjelajahi Project netflix-clone

Mari kita "keliling" project yang baru dibuat dan pahami alur jalannya saat dibuka di browser.

**Langkah 1:** Jalankan `npm run dev`, buka `localhost:5173`.

**Langkah 2:** Perhatikan `index.html`:

```html
<!-- index.html (disederhanakan) -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>netflix-clone</title>
  </head>
  <body>
    <div id="app"></div>            <!-- ← Vue menanam app di sini -->
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

**Langkah 3:** `main.js` menyalakan Vue:

```js
// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)   // buat aplikasi dari App.vue
app.use(createPinia())       // pasang Pinia (state management)
app.use(router)              // pasang Router (navigasi)
app.mount('#app')            // tanam ke <div id="app">
```

**Langkah 4:** `App.vue` menampung RouterView:

```vue
<!-- src/App.vue -->
<template>
  <RouterView />   <!-- ← menampilkan view sesuai URL saat ini -->
</template>
```

```
JALURNYA:
Browser buka localhost:5173
   → index.html load /src/main.js
      → createApp(App).mount('#app')
         → App.vue render <RouterView/>
            → URL "/" → router tampilkan HomeView.vue
               → HomeView panggil <Navbar/>, <MovieRow/>, dll
```

> 🎯 **Pelajaran:**
> Memahami rantai ini (`index.html` → `main.js` → `App.vue` → `RouterView` → `view` → `component`) adalah kunci untuk tidak "tersesat" saat project besar. Setiap fitur pada akhirnya berawal dari sini.

---

## 🚨 Jebakan Umum Pemula di Bab 2

### ❌ Jebakan 1 — Lupa Menjalankan `npm install`

```bash
# ❌ SALAH: langsung npm run dev tanpa install
git clone project-lain
npm run dev
# → "Cannot find module 'vue'" 😱

# ✅ BENAR: selalu install dulu
git clone project-lain
npm install     # ← wajib!
npm run dev
```

**Penjelasan:** `node_modules/` biasanya tidak ikut di-commit ke git. Setelah clone/pull, selalu `npm install`.

---

### ❌ Jebakan 2 — Mengedit File di Luar `src/`

```bash
# ❌ SALAH: mengedit index.html secara sembarangan atau
# menaruh komponen di folder salah
# netflix-clone/MyComponent.vue  ← Vue tidak tahu ini ada

# ✅ BENAR: taruh komponen di dalam src/
# netflix-clone/src/components/MyComponent.vue
```

**Penjelasan:** Vite hanya memantau `src/`. File di luar itu tidak di-*bundle* dan hot reload tidak jalan.

---

### ❌ Jebakan 3 — Menyalakan Vetur & Volar Bersamaan

```
❌ SALAH:
   Vetur aktif + Volar aktif → konflik, error aneh di .vue

✅ BENAR:
   Nonaktifkan Vetur, biarkan Volar aktif saja
```

**Penjelasan:** Keduanya "berebut" memproses `.vue`. Hanya satu yang boleh aktif. Volar untuk Vue 3.

---

### ❌ Jebakan 4 — Men-deploy Folder Hasil `npm run dev`

```
❌ SALAH:
   Upload seluruh folder project (termasuk node_modules) ke hosting

✅ BENAR:
   Jalankan npm run build → upload isi folder dist/ saja
```

**Penjelasan:** `dist/` adalah hasil *build* yang sudah dioptimalkan. Folder project mentah terlalu besar & tidak bisa langsung dijalankan server statis.

---

### ❌ Jebakan 5 — Mengubah `package.json` Manual Tanpa Paham

```json
// ❌ SALAH: hapus "vue" dari dependencies karena "gak dipakai"
// → aplikasi hancur

// ✅ BENAR: tambah dependency lewat npm, jangan edit manual
// npm install nama-library
```

**Penjelasan:** Biarkan npm yang mengelola `package.json`. Edit manual rawan salah versi & konflik.

---

## 🧪 2.10 Walkthrough: Mengubah Project Pertama Kali

Mari kita lakukan sesuatu konkret di project yang baru dibuat, agar setup terasa "nyata".

### 🪜 Langkah 1 — Buka `src/App.vue`

```vue
<!-- src/App.vue (awalnya dari scaffolding) -->
<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" />
  </header>
  <main>
    <TheWelcome />
  </main>
</template>

<script setup>
import TheWelcome from '@/components/TheWelcome.vue'
</script>
```

### 🪜 Langkah 2 — Ganti isinya jadi sapaan sederhana

```vue
<!-- Ubah jadi ini untuk latihan -->
<template>
  <main style="text-align:center; margin-top:3rem">
    <h1>{{ salam }}</h1>
    <button @click="ubah">Ganti Salam</button>
  </main>
</template>

<script setup>
import { ref } from 'vue'

const salam = ref('Halo Netflix Clone! 🎬')
function ubah() {
  salam.value = 'Selamat belajar Vue! 💪'
}
</script>
```

### 🪜 Langkah 3 — Simpan & lihat browser

Karena hot reload, browser otomatis memperbarui tanpa refresh. Inilah kenikmatan Vite.

```
ALUR:
edit App.vue → save → Vite detect → browser update otomatis 🔥
```

> 💡 **Tips:** Jika tidak update, cek terminal `npm run dev` ada error atau file salah tempat.

---

## 🔍 2.11 Memahami `index.html` Lebih Dalam

File `index.html` adalah "pintu masuk" SPA. Mari bedah:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>netflix-clone</title>
  </head>
  <body>
    <!-- Vue menanam aplikasi ke sini -->
    <div id="app"></div>

    <!-- Script entry — Vite mulai dari sini -->
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

| Bagian | Fungsi |
| --- | --- |
| `<div id="app">` | Wadah aplikasi Vue |
| `src="/src/main.js"` | Entry point (Vite) |
| `type="module"` | Pakai ES module (wajib Vite) |
| `favicon.ico` | Ikon tab browser (di `public/`) |

> ⚠️ Jangan hapus `<div id="app">` atau script entry — aplikasi tidak akan jalan.

---

## 🗂️ 2.12 Struktur Folder yang Dianjurkan (Best Practice)

Selain default scaffolding, berikut struktur yang sering dipakai tim profesional:

```
src/
├── components/
│   ├── ui/          ← komponen dasar (Button, Input, Modal)
│   └── layout/      ← Header, Footer, Sidebar
├── views/
│   ├── auth/        ← LoginView, RegisterView
│   └── movie/       ← BrowseView, DetailView
├── composables/     ← useFetch, useAuth
├── stores/          ← auth.js, movie.js (Pinia)
├── services/        ← axios instance, api calls
├── utils/           ← formatRupiah, validators
├── router/
├── assets/
├── App.vue
└── main.js
```

| Folder | Isi |
| --- | --- |
| `components/ui` | Komponen atomik generik |
| `components/layout` | Tata letak halaman |
| `views/auth` / `views/movie` | Kelompok view per fitur |
| `services` | Logika HTTP terpisah dari komponen |

> 💡 Struktur rapi = tim bahagia. Sesuaikan dengan kebutuhan, jangan berlebihan.

---

## 🐞 2.13 Troubleshooting Lanjutan

Masalah setup adalah hal pertama yang membuat pemula menyerah. Berikut daftar & solusi:

| Gejala | Penyebab Umum | Solusi |
| --- | --- | --- |
| `node: command not found` | Node belum terinstall | Install Node LTS, buka terminal baru |
| `npm create vue` lambat | Koneksi internet | Pakai `npx create-vue@latest` |
| Port 5173 sudah dipakai | App lain jalan | Biarkan Vite pilih port lain |
| `Cannot find module 'vue'` | `npm install` belum | Jalankan `npm install` |
| Error Volar/Vetur bentrok | Dua ekstensi aktif | Nonaktifkan Vetur |
| Hot reload tidak jalan | File di luar `src/` | Edit di dalam `src/` |

```bash
# Solusi darurat "reset" project:
rm -rf node_modules
rm package-lock.json
npm install
npm run dev
```

> ⚠️ Jangan panik saat error muncul. Salin pesan error ke Google — 99% sudah pernah dialami orang lain.

---

## 🎯 2.14 Checklist Setup Selesai

Sebelum lanjut ke Bab 3, pastikan:

- [ ] Node.js v18+ terinstall (`node --version`)
- [ ] Project `netflix-clone` berhasil dibuat
- [ ] `npm run dev` jalan & browser menampilkan halaman
- [ ] VS Code + Volar aktif (Vetur mati)
- [ ] Anda paham letak `src/`, `components/`, `views/`, `router/`

```
Semua tercentang? Selamat, "panggung" sudah siap! 🎬
```

---

## 🔧 2.15 Mengelola Dependency dengan npm

Setelah project jalan, Anda akan sering menambah library. Berikut perintah dasar:

```bash
# Install library produksi (masuk ke "dependencies")
npm install axios

# Install library development (masuk "devDependencies")
npm install -D eslint

# Uninstall
npm uninstall axios

# Lihat daftar dependency terinstal
npm list --depth=0
```

| Perintah | Fungsi |
| --- | --- |
| `npm install <nama>` | Tambah & simpan ke package.json |
| `npm install -D <nama>` | Tambah sebagai devDependency |
| `npm uninstall <nama>` | Hapus |
| `npm update` | Update ke versi terbaru (sesuai range) |

> 💡 **Aturan:** Library yang dibutuhkan saat aplikasi *jalan* (vue, axios, pinia) → dependencies. Library hanya untuk *development* (vite, eslint, prettier) → devDependencies.

---

## 🌿 2.16 Git & Project Vue (Bonus)

Sangat disarankan memasukkan project ke Git sejak awal:

```bash
git init
git add .
git commit -m "init: netflix-clone project"

# Tambahkan .gitignore agar node_modules tidak ke-commit
# (scaffolding Vue sudah menyediakannya)
```

```
node_modules/   ← jangan di-commit (besar & bisa di-install ulang)
dist/           ← hasil build, jangan di-commit
.env            ← secret, jangan di-commit
```

> ⚠️ Pastikan `.gitignore` memuat `node_modules`. Jika tidak, repo Anda jadi raksasa.

---

## 🚀 2.17 Optimasi Dev Experience

Beberapa pengaturan VS Code yang membuat hidup lebih nyaman:

```json
// settings.json (VS Code)
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "vue.server.hybridMode": true,
  "[vue]": {
    "editor.defaultFormatter": "Vue.volar"
  }
}
```

| Pengaturan | Manfaat |
| --- | --- |
| `formatOnSave` | Kode rapi otomatis saat simpan |
| Volar sebagai formatter `.vue` | Highlight & format benar |
| Prettier global | Konsistensi gaya |

---

## 🧭 2.18 Apa yang Terjadi di Balik `npm run dev`?

Kadang pemula menganggap `npm run dev` "ajaib". Sebenarnya:

```
1. Vite membaca vite.config.js
2. Vite mulai dev server (biasanya port 5173)
3. Browser request index.html
4. Vite transform main.js + semua .vue secara instan
5. Browser jalanin hasil transform → aplikasi tampil
6. Saat file berubah → Vite transform ulang hanya yang berubah (HMR)
```

> 💡 **HMR (Hot Module Replacement):** Vite tidak reload seluruh halaman, hanya modul yang berubah — super cepat.

---

## ✅ 2.19 Persiapan Sebelum Bab 3

Di Bab 3 kita akan berpikir "berbasis komponen". Pastikan project Anda siap:

- Struktur folder dipahami
- Anda bisa mengedit `App.vue` & melihat perubahan
- Konsep `src/`, `components/`, `views/` jelas

```
Siap? Mari kita "pecah" UI menjadi komponen di Bab 3! 🧩
```

---

## 🧭 2.20 Memahami Alias `@` Lebih Dalam

Alias `@` sangat menyelamatkan saat folder dalam. Mari bandingkan:

```js
// ❌ Tanpa alias: path relatif rentan salah saat pindah file
import MovieCard from '../../../components/MovieCard.vue'

// ✅ Dengan alias: selalu dari src/
import MovieCard from '@/components/MovieCard.vue'
```

| Keuntungan `@` | Alasan |
| --- | --- |
| Stabil saat pindah file | Tidak bergantung posisi relatif |
| Singkat | Tidak ada `../../` berulang |
| Konsisten | Seluruh project pakai standar sama |

> 💡 Alias `@` didefinisikan di `vite.config.js` (sudah otomatis dari scaffolding).

---

## 🧪 2.21 Latihan Explorer Kecil

Coba hal berikut untuk membiasakan diri dengan project:

1. Buka `src/main.js`, ubah pesan `console.log` lalu lihat terminal.
2. Buka `src/App.vue`, hapus `<TheWelcome />` → lihat perubahan.
3. Buat file `src/components/Halo.vue` lalu import ke `App.vue`.
4. Jalankan `npm run build` → cek folder `dist/` tercipta.

```
Setiap langkah memperkuat pemahaman struktur project. 💪
```

---

## 🚀 2.22 Langkah Berikutnya

Di Bab 3 kita akan belajar cara berpikir "berbasis komponen" — memecah UI menjadi kepingan reusable. Setup yang sudah Anda lakukan di Bab 2 adalah fondasi wajibnya.

```
Bab 2 selesai → panggung siap → Bab 3: susun komponen! 🧩
```

---

## 🧪 2.23 Anatomi `main.js` Baris per Baris

Mari bedah `main.js` yang jadi "otak penyalakan" aplikasi:

```js
// ① Impor fungsi createApp dari Vue
import { createApp } from 'vue'

// ② Impor Pinia (state management)
import { createPinia } from 'pinia'

// ③ Impor komponen root
import App from './App.vue'

// ④ Impor konfigurasi router
import router from './router'

// ⑤ Buat instance aplikasi dari App
const app = createApp(App)

// ⑥ Pasang plugin (urutan bebas, sebelum mount)
app.use(createPinia())   // aktifkan Pinia
app.use(router)          // aktifkan routing

// ⑦ Tanam ke DOM (pada <div id="app">)
app.mount('#app')
```

| Baris | Arti |
| --- | --- |
| `createApp(App)` | Bungkus App jadi aplikasi Vue |
| `app.use(pinia)` | Daftarkan store global |
| `app.use(router)` | Daftarkan navigasi |
| `app.mount('#app')` | Jalankan ke halaman |

> 💡 Urutan `use()` sebelum `mount()` penting — plugin harus terdaftar dulu.

---

## 📁 2.24 Mengenal `router/index.js`

File ini memetakan URL ke view:

```js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  // path lain nanti di Bagian V
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
```

| Bagian | Fungsi |
| --- | --- |
| `routes` | Daftar path → component |
| `createWebHistory` | URL bersih tanpa `#` |
| `export default` | Dipakai di `main.js` |

---

## 🧰 2.25 `vite.config.js` Baris per Baris

```js
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],                    // ① aktifkan Vue
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))  // ② alias @
    }
  }
})
```

| Baris | Fungsi |
| --- | --- |
| `plugins: [vue()]` | Proses file `.vue` |
| `'@': .../src` | Alias `@` → folder `src` |

---

## 🚦 2.26 Siklus Hidup Project (Dev → Build → Deploy)

```
DEV    → npm run dev    → coding & testing lokal
BUILD  → npm run build  → hasilkan dist/
PREVIEW→ npm run preview→ cek hasil build lokal
DEPLOY → upload dist/   → ke hosting (Netlify/Vercel)
```

> ⚠️ Deploy selalu pakai hasil `npm run build` (folder `dist/`), bukan source mentah.

---

## 🎯 2.27 Inti Bab 2 dalam Satu Kalimat

> **"Node.js + Vite menyiapkan panggung; struktur folder & SFC memberi kita rumah; perintah npm menyalakannya."**

```
Paham kalimat itu → Bab 2 beres. 🔧
```

---

## 🧪 2.28 Membuat Komponen Pertama di Project

Setelah paham struktur, mari buat komponen sungguhan:

```vue
<!-- src/components/Salam.vue -->
<template>
  <p class="salam">{{ teks }}</p>
</template>

<script setup>
defineProps({ teks: { type: String, default: 'Halo' } })
</script>

<style scoped>
.salam { color: #e50914; font-weight: bold; }
</style>
```

Lalu pakai di `App.vue`:

```vue
<script setup>
import Salam from '@/components/Salam.vue'
</script>

<template>
  <Salam teks="Selamat datang di Netflix Clone!" />
</template>
```

```
Hasil: komponen Salam muncul dengan gaya merah khas Netflix. 🎬
```

> 💡 Ini membuktikan struktur folder & SFC bekerja: import → pakai → tampil.

---

## 🔍 2.29 Perbedaan `import` Relatif vs Alias

```js
// Relatif (bergantung posisi file)
import X from '../components/X.vue'

// Alias (selalu dari src/)
import X from '@/components/X.vue'
```

| Jenis | Risko | Saran |
| --- | --- | --- |
| Relatif | Salah saat pindah file | Hindari di project besar |
| Alias `@` | Stabil | Gunakan selalu |

---

## 🏁 2.30 Bab 2 Tamat

Anda sudah: install Node, buat project, paham folder, paham SFC, pasang VS Code, tahu perintah npm.

```
"Panggung" lengkap:
✓ Node + npm
✓ Project netflix-clone
✓ Struktur src/ rapi
✓ Vite jalan
✓ VS Code + Volar
```

> 🎯 Di Bab 3 kita akan mengisi panggung ini dengan komponen. Sampai jumpa di sana!

---

## 🧭 2.31 Narasi Setup dalam Satu Cerita

Bayangkan Anda akan membuka restoran:

```
1. Pasang listrik & air     → install Node.js + npm
2. Siapkan dapur otomatis   → Vite (scaffolding)
3. Atur tata letak dapur    → struktur folder src/
4. Siapkan meja berlabel    → komponen .vue (SFC)
5. Nyalakan kompor          → npm run dev
6. Pasang alat bantu dapur  → VS Code + Volar
```

Setiap langkah di Bab 2 punya padanan nyata di dunia nyata. Setup bukan hambatan, melainkan fondasi kenyamanan coding.

---

## 🔧 2.32 Kalimat Penutup Bab 2

> **"Setup yang rapi hari ini adalah kebebasan berkoding esok hari."**

```
Dengan Node, Vite, struktur folder, dan VS Code siap:
Anda sudah tidak punya alasan untuk tidak mulai menulis fitur. 🔧
```

---

## 📚 2.33 Glosarium & FAQ Setup

Istilah yang sering muncul saat setup:

| Istilah | Arti |
| --- | --- |
| **Node.js** | Runtime JavaScript di luar browser |
| **npm** | Node Package Manager — unduh library |
| **Vite** | Build tool & dev server Vue 3 |
| **Scaffold** | Pembuatan kerangka project otomatis |
| **SFC** | Single File Component (`.vue`) |
| **Hot reload** | Browser refresh otomatis saat simpan |
| **DevDependency** | Library hanya untuk development |
| **Alias `@`** | Shortcut path ke folder `src/` |

**Q: Kenapa port 5173, bukan 3000 seperti React?**
A: Kebetulan default Vite. Bisa diubah di `vite.config.js` (`server.port`).

**Q: Apakah `node_modules` harus di-commit ke Git?**
A: Tidak. Ia besar & bisa di-install ulang dari `package.json`.

**Q: Bagaimana kalau `npm install` gagal?**
A: Cek koneksi, versi Node (≥18), dan coba hapus `package-lock.json` lalu ulangi.

**Q: Boleh pakai TypeScript?**
A: Boleh. Scaffolding menawarkan opsi "Add TypeScript". Kita pilih No di ebook ini.

> 💡 Simpan glosarium ini sebagai referensi cepat saat membelakangi error setup.

---

## 🎁 2.34 Pesan Penutup

Setup mungkin terasa teknis dan kurang "seru", tapi percayalah: developer hebat dibedakan oleh kenyamanan di lingkungan kerjanya. Satu jam menata setup hari ini menyelamatkan puluhan jam debugging esok hari.

```
"Lingkungan yang rapi adalah hadiah bagi diri sendiri
setiap kali membuka editor." 🔧
```

Lanjut ke Bab 3, di mana kita mulai "merakit" UI dari komponen!

---

## 📌 2.35 Catatan Terakhir

Satu pengingat praktis: simpan daftar perintah `npm` di tempat mudah dilihat. `dev`, `build`, `preview`, `lint` akan Anda ketik ratusan kali. Menjadikannya refleks menyelamatkan waktu tiap hari.

```
Keyboard shortcut terbaik adalah perintah yang sudah jadi kebiasaan. ⌨️
```

---

## 📎 2.36 Referensi & Bacaan

Daftar tempat menggali lebih dalam soal setup:

| Topik | Sumber |
| --- | --- |
| Instalasi Node | nodejs.org |
| Panduan Vite | vitejs.dev/guide |
| Scaffolding | github.com/vuejs/create-vue |
| VS Code | code.visualstudio.com |
| Volar | Marketplace VS Code (Vue.volar) |

> 💡 Simpan tautan ini. Saat versi alat berubah, dokumentasi resmi adalah sumber kebenaran.

---

## 🚪 2.37 Sebelum Lanjut ke Bab 3

Lakukan hal berikut agar siap:

1. Pastikan `npm run dev` jalan tanpa error.
2. Coba edit `App.vue` dan lihat perubahan otomatis.
3. Pastikan VS Code mengenali `.vue` (highlight aktif).
4. Paham letak `src/`, `components/`, `views/`, `router/`, `stores/`.

```
Semua beres? Tutup terminal jika perlu, lalu buka Bab 3. 🚪
```

> 💡 Setup hanya dilakukan sekali. Setelah nyaman, Anda hampir tak akan menyentuhnya lagi.

---

## 💬 2.38 Kutipan untuk Diingat

> *"Weeks of coding can save you hours of planning."* — anonim

Setup yang terencana hari ini adalah investasi yang dibayar kembali setiap hari selama siklus hidup project.

```
Investasi kecil di awal = dividen besar di akhir. 💰
```

---

## 📝 Ringkasan Bab 2

| Konsep | Penjelasan |
| --- | --- |
| **Node.js** | Runtime JavaScript di luar browser; fondasi tooling Vue (min v18). |
| **npm** | Package manager untuk install library (vue, pinia, router). |
| **Vite / create-vue** | Scaffolding tool resmi Vue 3; buat project dengan wizard. |
| **Struktur folder** | `src/` (kode), `components/` (UI reuse), `views/` (halaman), `router/`, `stores/`, `composables/`. |
| **SFC (.vue)** | Satu file berisi `<template>` + `<script setup>` + `<style scoped>`. |
| **scoped** | CSS hanya berlaku di komponen itu, cegah bocor. |
| **components vs views** | `views/` punya URL (router); `components/` dipakai ulang. |
| **Perintah** | `dev` (hot reload), `build` (produksi), `preview`, `lint`. |
| **VS Code** | Volar (matikan Vetur) + ESLint + Prettier. |
| **package.json** | Daftar dependency & scripts; bedakan `dependencies` vs `devDependencies`. |
| **vite.config.js** | Alias `@` → `src/`, plugin vue. |

---

## 🎯 Latihan Mandiri

**⭐ Latihan 1 — Cek Environment**
Buka terminal, jalankan `node --version` dan `npm --version`. Catat hasilnya. Jika Node belum terpasang, install versi LTS dan verifikasi lagi. Pastikan versi Node minimal 18.

**⭐⭐ Latihan 2 — Buat & Jalankan Project**
Ikuti 2.2 untuk membuat project `latihan-vue` dengan Router + Pinia. Jalankan `npm run dev` dan pastikan halaman tampil di browser. Tangkap screenshot halaman awal.

**⭐⭐⭐ Latihan 3 — Eksplorasi Struktur**
Di project yang baru dibuat, buka `src/App.vue`, `src/main.js`, dan `src/router/index.js`. Gambarkan (atau tuliskan dengan kata-kata) rantai: bagaimana saat URL "/" dibuka, Vue tahu harus menampilkan komponen apa. Sebutkan minimal 3 file yang terlibat.

**⭐⭐⭐⭐ Latihan 4 — Bongkar & Pasang Kembali**
Hapus folder `node_modules` dari project latihan Anda, lalu jalankan `npm install` dan `npm run dev` kembali. Buktikan aplikasi tetap jalan. Lalu coba matikan ekstensi Volar dan lihat apa yang terjadi pada *highlight* sintaks `.vue` (catat perbedaannya).

---

*Lanjut ke ➡️ **Bab 3 — 🧩 Cara Berpikir Berbasis Komponen***
