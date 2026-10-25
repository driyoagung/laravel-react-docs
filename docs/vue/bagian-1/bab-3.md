# 🧩 Bab 3 — Cara Berpikir Berbasis Komponen

> *"Jika JSX adalah bata dan semen, maka komponen adalah ruangan yang kamu bangun dari bata-bata itu. Dan dari ruangan-ruangan itulah sebuah rumah berdiri. Begitu pula Vue: dari komponen-komponen kecil, aplikasi raksasa pun berdiri."*
>

---

> **🧠 Apa Itu Komponen?**
>
>
> **Komponen** adalah **potongan UI yang mandiri dan bisa dipakai ulang** — ia punya tampilan (*template*), logika (*script*), dan style (*style*) sendiri, dibungkus dalam satu file `.vue`. Alih-alih membangun satu halaman raksasa, kita pecah menjadi bagian-bagian kecil yang bisa dikombinasikan.
>
> Filosofi inti Vue adalah: **"Pecah UI yang kompleks menjadi komponen-komponen kecil yang independen dan bisa digunakan ulang."** Inilah yang membuat aplikasi Vue mudah dikembangkan, mudah diuji, dan mudah dirawat seiring bertumbuhnya ukuran aplikasi.
>

---

> **🏗️ Analogi Sederhana:**
>
>
> Bayangkan Anda sedang membangun sebuah mobil. Alih-alih membangun mobil sebagai satu bongkahan logam raksasa, para insinyur membangunnya dari **komponen-komponen terpisah**: mesin, roda, setir, kursi, dashboard, lampu. Setiap komponen didesain, diuji, dan disempurnakan secara independen. Jika ban bocor, kamu hanya perlu mengganti ban — bukan seluruh mobil.
>
> Itulah cara kerja komponen Vue. Jika ada bug di tombol "Tambah ke Watchlist", kamu hanya perlu memperbaiki komponen `TombolWatchlist` — tanpa menyentuh `Navbar`, `Footer`, atau `HalamanBrowse`.
>

---

## 📋 Daftar Isi Bab 3

1. Apa Itu Komponen? (Definisi & Keuntungan)
2. Komponen sebagai "LEGO" — Mental Model
3. Anatomi Komponen Vue (Template, Script, Style)
4. Studi Kasus — Bedah UI Netflix Menjadi Komponen
5. Hierarki Komponen — Parent & Child
6. One-Way Data Flow — Props Turun, Events Naik
7. Reusability — Satu Komponen, Banyak Tempat
8. Kapan Harus Memisah Komponen?
9. Pola Komponen yang Sering Dipakai
10. 🎬 Studi Kasus — Membangun UI Netflix dari Nol
11. 🚨 Jebakan Umum Pemula di Bab 3
12. 📝 Ringkasan & 🎯 Latihan Mandiri

---

## 🧩 3.1 Apa Itu Komponen? (Definisi & Keuntungan)

**Komponen** adalah **potongan UI yang mandiri dan bisa dipakai ulang** — ia punya tampilan (*template*), logika (*script*), dan style (*style*) sendiri, dibungkus dalam satu file `.vue`. Alih-alih membangun satu halaman raksasa, kita pecah menjadi bagian-bagian kecil yang bisa dikombinasikan.

Bayangkan komponen seperti "bata" dalam bangunan. Satu bata sederhana, tapi dari ratusan bata kita bisa bentuk rumah, gedung, atau istana. Begitu pula komponen: `Navbar`, `MovieCard`, `Footer` — masing-masing kecil, tapi gabungannya membentuk seluruh aplikasi Netflix.

Keuntungan utama komponen:

- **Reusable** — `MovieCard` dipakai ratusan kali untuk ratusan film.
- **Maintainable** — kalau ada bug di kartu film, Anda cuma benarkan satu file.
- **Readable** — kode terpecah jelas, bukan 2000 baris berantakan.
- **Collaborative** — tiap anggota tim bisa kerjakan komponen berbeda tanpa tabrakan.

```
TANAPA KOMPONEN:
index.html (2000 baris, semua campur)
→ susah dibaca, susah dirawat, rawan konflik tim

DENGAN KOMPONEN:
Navbar.vue (50 baris)
HeroSection.vue (80 baris)
MovieCard.vue (40 baris)
MovieRow.vue (60 baris)
Footer.vue (30 baris)
→ rapi, terisolasi, mudah kolaborasi
```

> 💡 **Catatan Penting:**
> Komponen bukan sekadar "potongan HTML". Ia mengemas **tampilan + logika + style** jadi satu kesatuan yang kohesif. Itulah mengapa ia bisa berdiri sendiri dan dipakai di mana saja.

---

## 🧱 3.2 Komponen sebagai "LEGO" — Mental Model

> 💡 **Analogi:**
> Bayangkan Anda membangun istana LEGO. Anda tidak membuat satu bongkahan besar berbentuk istana — Anda merakit dari kepingan-kepingan kecil standar yang bisa dipakai lagi di model lain. Itulah komponen.

Sama seperti kepingan LEGO yang punya ukuran standar dan bisa disambung, komponen Vue punya "antarmuka" standar (props/events) sehingga bisa disusun satu sama lain. Kepingan yang sama bisa dipakai di istana, di mobil, atau di pesawat — begitu pula komponen yang sama bisa dipakai di berbagai halaman.

Bandung dua pendekatan:

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

Pendekatan komponen jauh lebih mudah dirawat. Kalau warna tombol di `Navbar` harus diubah, Anda tahu persis ke file mana pergi. Di cara lama, Anda harus mencari di 2000 baris tersebut.

> 📌 **Catatan Penting:**
> Ukuran baris di atas hanyalah ilustrasi. Yang penting adalah *prinsipnya*: pecah berdasarkan tanggung jawab UI, bukan berdasarkan "berapa panjang".

### 🔍 Contoh Nyata: Komponen Tombol yang Dipakai di Mana-mana

```vue
<!-- components/BaseButton.vue -->
<template>
  <button :class="['btn', `btn--${varian}`]" @click="$emit('klik')">
    <slot />   <!-- konten tombol dari luar -->
  </button>
</template>

<script setup>
defineProps({ varian: { type: String, default: 'primer' } })
defineEmits(['klik'])
</script>

<style scoped>
.btn { padding: 10px 20px; border-radius: 6px; border: none; cursor: pointer; }
.btn--primer { background: #e50914; color: white; }
.btn--sekunder { background: #333; color: white; }
</style>
```

Sekarang `BaseButton` dipakai di `Navbar`, `HeroSection`, `MovieCard`, `Footer` — satu definisi, banyak tempat:

```vue
<BaseButton varian="primer" @klik="play">▶ Play</BaseButton>
<BaseButton varian="sekunder" @klik="info">ℹ️ More Info</BaseButton>
```

---

## 🔬 3.3 Anatomi Komponen Vue (Template, Script, Style)

Mari kita bedah satu komponen Vue secara menyeluruh, bagian per bagian. Ini penting agar Anda paham "di mana menaruh apa".

```vue
<!-- ─────────────────────────────────────────────────────────────
// BAGIAN 1: TEMPLATE — Tampilan HTML
// Semua yang terlihat user ada di sini
// ───────────────────────────────────────────────────────────── -->
<template>
  <div class="movie-card" :class="{ 'is-highlighted': isHighlighted }">
    <img :src="poster" :alt="title" />
    <div class="body">
      <h3>{{ title }}</h3>
      <span class="rating">⭐ {{ rating }}</span>
      <button @click="simpan">➕ Watchlist</button>
    </div>
  </div>
</template>

<!-- ─────────────────────────────────────────────────────────────
// BAGIAN 2: SCRIPT — Logika komponen
// State, props, method — semua di sini (SEBELUM template dirender)
// ───────────────────────────────────────────────────────────── -->
<script setup>
import { ref } from 'vue'

// Props: data dari parent
const props = defineProps({
  title:    { type: String, required: true },
  poster:   { type: String, default: '/no-poster.jpg' },
  rating:   { type: Number, default: 0 },
  isHighlighted: { type: Boolean, default: false },
})

// Emits: event ke parent
const emit = defineEmits(['simpan'])

// State lokal
const disimpan = ref(false)

// Method
function simpan() {
  disimpan.value = !disimpan.value
  emit('simpan', props.title)   // kabari parent
}
</script>

<!-- ─────────────────────────────────────────────────────────────
// BAGIAN 3: STYLE — Tampilan visual (scoped = lokal)
// ───────────────────────────────────────────────────────────── -->
<style scoped>
.movie-card { border-radius: 8px; overflow: hidden; }
.movie-card.is-highlighted { outline: 2px solid gold; }
.rating { color: #f5c518; }
</style>
```

**Ringkasan anatomi komponen:**

```
Komponen Vue = Template (Tampilan) + Script (Logika) + Style (Gaya)
```

| Blok | Isi | Catatan |
| --- | --- | --- |
| `<template>` | HTML + direktif Vue | Tampilan yang dilihat user |
| `<script setup>` | `ref`, `defineProps`, `defineEmits`, method | Logika & data |
| `<style scoped>` | CSS komponen ini | Tidak bocor ke komponen lain |

---

## 🎬 3.4 Studi Kasus — Bedah UI Netflix Menjadi Komponen

Mari praktikkan cara berpikir ini dengan membedah tampilan Netflix sungguhan. Ternyata layar Netflix yang mewah itu tersusun dari komponen bersarang:

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

Cara membacanya:

- **`App.vue`** adalah kerangka utama yang menampung semua komponen lain.
- **`Navbar.vue`** berisi logo, link navigasi, dan avatar — satu baris atas.
- **`HeroSection.vue`** adalah banner besar film pilihan di tengah layar.
- **`MovieRow.vue`** adalah "baris horizontal" berisi banyak film dalam satu genre (Trending, Action, dll). Ia **mengulang** dirinya sendiri untuk tiap genre.
- **`MovieCard.vue`** adalah satu kartu poster film — ia **mengulang** di dalam setiap `MovieRow` untuk tiap film.
- **`Footer.vue`** adalah bagian bawah halaman.

🎬 **Studi Kasus — Mengapa struktur ini efisien?**
Perhatikan `MovieCard.vue`: ia ditulis **SEKALI**, tapi dirender mungkin 100+ kali untuk 100+ film berbeda. Tanpa komponen, Anda harus menulis ulang HTML kartu itu berkali-kali secara manual — rentan salah dan sulit dirawat. Dengan komponen, cukup kirim data berbeda (judul, poster) ke komponen yang sama.

> 💡 **Tips:** Saat melihat desain UI (Figma/pencil), latih mata Anda untuk menandai: "ini komponen yang berulang" vs "ini halaman". Itu skill inti seorang frontend developer.

### 🔍 Visualisasi Bersarang (Nested)

```
App.vue
└── HeroSection.vue
    └── ActionButtons (Play, More Info)
        └── BaseButton.vue  ← komponen paling kecil (atom)

App.vue
└── MovieRow.vue (x10 genre)
    └── MovieCard.vue (x10 film per genre)
        └── BaseButton.vue  ← dipakai lagi di sini!
```

Ini menunjukkan hierarki "atom → molecule → organism → page" yang akan kita pakai terus.

---

## 🌳 3.5 Hierarki Komponen — Parent & Child

Komponen tidak berdiri sendiri — mereka bersarang. Komponen yang menampung komponen lain disebut **Parent**; yang ditampung disebut **Child**. Contoh: `App.vue` (parent) menampung `MovieRow.vue` (child), yang menampung `MovieCard.vue` (child-nya lagi).

Alur komunikasi mengikuti aturan emas:

```
Parent (App.vue)
    │
    │  mengirim data ke bawah  →  via PROPS  (props turun)
    │
    ▼
Child (MovieRow.vue)
    │
    │  mengirim event ke atas  →  via EMITS  (events naik)
    │
    ▲
Parent menerima event
```

Penjelasan:

- **Props (data ke bawah)** — Parent mengirim data ke Child. Misal `App.vue` mengirim daftar film ke `MovieRow.vue` lewat `:films="daftarFilm"`.
- **Emits (event ke atas)** — Child mengirim kabar ke Parent. Misal `MovieCard.vue` menekan tombol "Simpan", lalu memancarkan event `simpan` yang didengar Parent.

```vue
<!-- Parent: App.vue -->
<template>
  <MovieRow :films="daftarFilm" @pilih="bukaDetail" />
</template>

<script setup>
import { ref } from 'vue'
import MovieRow from '@/components/MovieRow.vue'

const daftarFilm = ref([/* ...data film... */])

function bukaDetail(film) {
  console.log('Film dipilih:', film.title)   // event dari child sampai ke sini
}
</script>
```

> ⚠️ **Aturan Utama:**
> Data mengalir **ke bawah** (parent → child via props).
> Event mengalir **ke atas** (child → parent via emits).
> Ini disebut **"one-way data flow"** dan membuat aplikasi lebih mudah di-debug.
>
> Anak tidak boleh langsung mengubah data milik orang tua. Jika anak butuh mengubahnya, ia harus "minta" lewat event, dan orang tua yang memutuskan.

> 📌 **Catatan Penting:**
> Melanggar *one-way data flow* (misal child mengubah prop langsung) adalah sumber bug paling umum di Vue pemula. Selalu ingat: **props turun, events naik**.

---

## 🔁 3.6 One-Way Data Flow — Props Turun, Events Naik

Mari perkuat konsep ini dengan contoh lengkap yang menunjukkan arah data.

```vue
<!-- Child: LikeButton.vue -->
<script setup>
// Menerima status dari parent
const props = defineProps({ sudahLike: Boolean })
// Bisa kirim event ke parent
const emit = defineEmits(['toggle'])

function onKlik() {
  emit('toggle')   // ← event naik ke parent
}
</script>

<template>
  <button @click="onKlik">
    {{ sudahLike ? '❤️ Liked' : '🤍 Like' }}
  </button>
</template>
```

```vue
<!-- Parent: PostItem.vue -->
<script setup>
import { ref } from 'vue'
import LikeButton from '@/components/LikeButton.vue'

const liked = ref(false)

// Parent yang pegang otoritas perubahan data
function onToggle() {
  liked.value = !liked.value   // ← parent ubah state di sini
}
</script>

<template>
  <!-- props turun ↓ -->
  <LikeButton :sudah-like="liked" @toggle="onToggle" />
</template>
```

```
ARAH DATA:
PostItem (parent)
  liked = false
     │  :sudah-like="liked"   (PROPS TURUN ↓)
     ▼
LikeButton (child)
     │  @toggle → emit('toggle')  (EVENTS NAIK ↑)
     ▼
PostItem.onToggle()  → liked = true
```

> 🎯 **Pelajaran Kunci:**
> Child **tidak** mengubah `liked` langsung. Ia hanya bilang "tombol diklik ya!" lewat event, dan parent yang memutuskan mengubah data. Ini menjaga satu sumber kebenaran (*single source of truth*).

---

## ♻️ 3.7 Reusability — Satu Komponen, Banyak Tempat

Inilah kekuatan sesungguhnya dari komponen: tulis sekali, pakai di mana saja. Lihat `MovieRow.vue` yang memanggil `MovieCard` berulang kali dengan data beda:

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

Bedah kode:

- `v-for` — mengulang `MovieCard` untuk tiap item dalam `daftarFilm` (looping, dibahas lengkap di Bab 4).
- `:title` dan `:poster` — setiap kartu diberi data berbeda dari `film` saat itu.
- `:key="film.id"` — pengenal unik agar Vue tahu urutan kartu (wajib!).

Hasilnya: dengan satu file `MovieCard.vue`, Anda bisa menampilkan ratusan film dengan hanya mengubah data yang dikirim. Inilah **reusability** — fondasi produktivitas di Vue.

> 💡 **Tips:** Jika Anda mendapati menyalin-paste blok HTML lebih dari 2 kali, itulah tanda waktunya dijadikan komponen.

### 🔍 Contoh Reusability Lintas Halaman

```
Halaman Home     → MovieRow → MovieCard (genre Trending)
Halaman Search   → MovieRow → MovieCard (hasil cari)
Halaman Watchlist→ MovieRow → MovieCard (list tersimpan)
                         ↑
              MovieCard SAMA dipakai di 3 halaman!
```

---

## 📏 3.8 Kapan Harus Memisah Komponen?

Tidak semua harus dipecah. Terlalu banyak komponen justru membuat pusing. Gunakan panduan praktis ini:

> 💡 **Panduan Praktis — Pisah jika:**
> - Blok kode UI dipakai di **lebih dari satu tempat**.
> - Satu komponen sudah **lebih dari 200-300 baris**.
> - Bagian UI punya **logika yang mandiri** (punya state sendiri).
> - Tim yang berbeda mengerjakan **bagian UI yang berbeda**.

Contoh penerapan:

| Sinyal | Tindakan |
| --- | --- |
| Tombol "Play" muncul di Hero & di Card | Jadikan `PlayButton.vue`. |
| `HomeView` sudah 400 baris | Pindahkan bagian (mis. `MovieRow`) ke komponen sendiri. |
| Bagian `SearchBar` punya logika pencarian sendiri | Pecah jadi `SearchBar.vue` dengan state internal. |
| Tim A kerjakan navigasi, tim B kerjakan footer | Pisah `Navbar.vue` & `Footer.vue`. |

```
SINYAL PERLU PECAH:
✂️ return JSX/template > 50-80 baris
✂️ ada bagian dipakai ulang di >1 tempat
✂️ ada logika kompleks & independen
✂️ ada state yang hanya dipakai bagian itu

JANGAN PECAH:
🔗 pemecahan justru bikin sulit dibaca
🔗 komponen baru cuma dipakai 1 tempat & sangat simpel
🔗 butuh terlalu banyak props (prop drilling)
```

> ⚠️ **Catatan:**
> Jangan berlebihan. Memecah komponen sebaris HTML (misal `Title.vue` hanya berisi `<h1>`) justru menambah kompleksitas tak perlu. Gunakan akal sehat: pecah bila ada manfaat nyata (reuse, isolasi logika, atau kolaborasi tim).

---

## 🎯 3.9 Pola Komponen yang Sering Dipakai

Berikut beberapa pola desain komponen yang sangat sering kamu temui di dunia nyata.

### 🎯 Pola 1 — Presentational vs Container Component

```vue
<!-- PRESENTATIONAL: hanya tampilan, dapat semua via props -->
<!-- components/UserList.vue -->
<template>
  <ul>
    <li v-for="u in users" :key="u.id">
      {{ u.nama }} — <button @click="$emit('hapus', u.id)">Hapus</button>
    </li>
  </ul>
</template>
<script setup>
defineProps({ users: Array })
defineEmits(['hapus'])
</script>
```

```vue
<!-- CONTAINER: pegang data & logika -->
<!-- views/ManageUserView.vue -->
<script setup>
import { ref } from 'vue'
import UserList from '@/components/UserList.vue'

const users = ref([{ id: 1, nama: 'Budi' }, { id: 2, nama: 'Ani' }])

function hapus(id) {
  users.value = users.value.filter(u => u.id !== id)
}
</script>

<template>
  <UserList :users="users" @hapus="hapus" />
</template>
```

Pola ini memisahkan "tampilan" (presentational) dari "data & logika" (container) — memudahkan testing dan reuse.

### 🎯 Pola 2 — Komponen dengan State Loading/Error

```vue
<!-- components/FilmGrid.vue -->
<script setup>
defineProps({
  films: Array,
  isLoading: Boolean,
  error: String,
})
</script>

<template>
  <div v-if="isLoading">⏳ Memuat...</div>
  <div v-else-if="error">❌ {{ error }}</div>
  <div v-else class="grid">
    <MovieCard v-for="f in films" :key="f.id" :film="f" />
  </div>
</template>
```

### 🎯 Pola 3 — Komponen UI Generik yang Dapat Dikustomisasi

Sudah kita lihat di 3.2 (`BaseButton` dengan prop `varian`). Pola ini sangat berguna untuk design system.

---

## 🎬 Studi Kasus — Membangun UI Netflix dari Nol

Sekarang mari kita gabungkan semua konsep bab ini — definisi komponen, hierarki, one-way data flow, reusability, dan pemecahan — dalam satu studi kasus realistis.

**Skenario:** Membangun halaman Browse Netflix sederhana.

**Langkah 1 — Identifikasi komponen (bedah desain):**

```
Halaman Browse
├── Navbar (logo, menu, avatar)
├── HeroSection (film unggulan)
├── MovieRow x N genre
│   └── MovieCard x M film
└── Footer
```

**Langkah 2 — Tentukan alur data:**

```
App (parent)
  ├── punya data: daftarGenre (array of { genre, films })
  │
  ├── kirim ke MovieRow via :genre & :films   (PROPS ↓)
  │
  └── MovieRow kirim event @pilih-film ke App (EVENTS ↑)
        └── App buka modal detail
```

**Langkah 3 — Contoh implementasi `App.vue` (kerangka):**

```vue
<template>
  <Navbar />
  <HeroSection :film="filmUnggulan" />
  <MovieRow
    v-for="baris in daftarGenre"
    :key="baris.genre"
    :genre="baris.genre"
    :films="baris.films"
    @pilih-film="bukaDetail"
  />
  <Footer />
</template>

<script setup>
import { ref } from 'vue'
import Navbar from '@/components/Navbar.vue'
import HeroSection from '@/components/HeroSection.vue'
import MovieRow from '@/components/MovieRow.vue'
import Footer from '@/components/Footer.vue'

const filmUnggulan = ref({ title: 'Dune', poster: '...' })

const daftarGenre = ref([
  { genre: 'Trending', films: [/* ... */] },
  { genre: 'Action',   films: [/* ... */] },
])

function bukaDetail(film) {
  console.log('Buka detail:', film.title)
}
</script>
```

> 🎯 **Yang kamu pelajari dari studi kasus ini:**
> - Hierarki 3-4 level: App → MovieRow → MovieCard.
> - Komponen kecil (`Navbar`, `Footer`) dipakai sekali; `MovieCard` dipakai ratusan kali.
> - Data mengalir turun via props; event mengalir naik via emits.
> - Parent pegang otoritas data (single source of truth).

---

## 🚨 Jebakan Umum Pemula di Bab 3

### ❌ Jebakan 1 — Mengubah Props Langsung di Child

```vue
<!-- ❌ SALAH: mutasi props -->
<script setup>
const props = defineProps({ judul: String })
props.judul = props.judul.toUpperCase()   // ❌ mutasi props!
</script>

<!-- ✅ BENAR: buat variabel baru -->
<script setup>
const props = defineProps({ judul: String })
const judulDisplay = props.judul.toUpperCase()  // ✅ variabel baru
</script>
```

**Penjelasan:** Props adalah *read-only*. Mengubahnya melanggar one-way data flow dan bisa bikin bug sulit dilacak.

---

### ❌ Jebakan 2 — Terlalu Banyak Props (Prop Drilling)

```vue
<!-- ❌ MASALAH: props diteruskan lewat banyak level -->
<App :user="user" />
  <Halaman :user="user" />      <!-- cuma teruskan -->
    <Konten :user="user" />     <!-- cuma teruskan -->
      <Sidebar :user="user" />  <!-- baru dipakai di sini -->

<!-- ✅ SOLUSI: pakai Pinia (Bagian V) atau provide/inject -->
```

**Penjelasan:** Jika props harus lewat >3 level, itu bau *prop drilling*. Solusi jangka panjang: Pinia atau `provide/inject`.

---

### ❌ Jebakan 3 — Nama Komponen Tidak Konsisten

```vue
<!-- ❌ SALAH: berbagai format -->
<!-- kartu_film.vue / kartuFilm.vue / KartuFilm.vue campur aduk -->

<!-- ✅ BENAR: selalu PascalCase -->
<!-- KartuFilm.vue -->
```

**Penjelasan:** Vue menganut konvensi **PascalCase** untuk nama komponen & file `.vue`. Konsistensi mencegah kebingungan import.

---

### ❌ Jebakan 4 — Komponen Terlalu Besar vs Terlalu Kecil

```vue
<!-- ❌ TERLALU BESAR: satu komponen 500 baris -->
<!-- ❌ TERLALU KECIL: Title.vue cuma <h1>{{ t }}</h1> -->

<!-- ✅ TEPAT: satu tanggung jawab jelas, ~30-80 baris -->
```

**Penjelasan:** Gunakan akal sehat. Pecah bila ada manfaat (reuse/logika), bukan demi pecah.

---

### ❌ Jebakan 5 — Mendefinisikan Komponen di Dalam Komponen

```vue
<!-- ❌ SALAH: KartuItem dibuat ulang tiap render -->
<script setup>
function App() {
  const KartuItem = (props) => <div>{{ props.n }}</div>  // ❌
}
</script>

<!-- ✅ BENAR: pisah file / definisikan di luar -->
<!-- KartuItem.vue terpisah, di-import -->
```

**Penjelasan:** Mendefinisikan komponen di dalam komponen lain membuat React/Vue membuat ulang definisi tiap render → performa buruk & state hilang.

---

## 🧪 3.10 Walkthrough: Membuat Komponen Pertama

Mari kita buat komponen nyata dari nol agar konsep "pecah UI" terasa nyata.

### 🪜 Langkah 1 — Buat `components/BaseButton.vue`

```vue
<!-- components/BaseButton.vue -->
<template>
  <button :class="['btn', `btn--${varian}`]" @click="$emit('klik')">
    <slot />   <!-- isi tombol dari parent -->
  </button>
</template>

<script setup>
// Props: varian tombol
defineProps({
  varian: { type: String, default: 'primer' }
})
// Emits: event klik ke parent
defineEmits(['klik'])
</script>

<style scoped>
.btn { padding: 10px 20px; border-radius: 6px; border: none; cursor: pointer; }
.btn--primer { background: #e50914; color: white; }
.btn--sekunder { background: #333; color: white; }
</style>
```

### 🪜 Langkah 2 — Pakai di `App.vue`

```vue
<template>
  <BaseButton varian="primer" @klik="fnPrimer">▶ Play</BaseButton>
  <BaseButton varian="sekunder" @klik="fnSekunder">ℹ️ Info</BaseButton>
</template>

<script setup>
import BaseButton from '@/components/BaseButton.vue'
const fnPrimer = () => alert('Play!')
const fnSekunder = () => alert('Info!')
</script>
```

```
HASIL:
Satu definisi BaseButton → dipakai 2x dengan gaya beda.
Inilah reusability! ♻️
```

> 💡 Perhatikan `<slot />` — ia menerima konten dari antara tag pembuka/tutup.

---

## 🌲 3.11 Hierarki Komponen yang Lebih Dalam

Mari lihat hierarki 4 level pada aplikasi nyata:

```
App.vue (root)
└── BrowseView.vue (view)
    └── MovieRow.vue (organism)
        └── MovieCard.vue (molecule)
            └── StarRating.vue (atom)
```

| Level | Contoh | Ciri |
| --- | --- | --- |
| Atom | `StarRating`, `BaseButton` | Kecil, sangat reusable |
| Molecule | `MovieCard` | Gabungan atom |
| Organism | `MovieRow` | Bagian UI utuh |
| Page/View | `BrowseView` | Halaman penuh |

> 🎯 Pola ini (Atomic Design) membantu tim besar membagi kerja secara konsisten.

---

## 🔁 3.12 One-Way Data Flow — Contoh Lengkap

```vue
<!-- Child: LikeButton.vue -->
<script setup>
const props = defineProps({ sudahLike: Boolean })
const emit = defineEmits(['toggle'])
function onKlik() { emit('toggle') }   // event naik ↑
</script>
<template>
  <button @click="onKlik">{{ sudahLike ? '❤️' : '🤍' }}</button>
</template>
```

```vue
<!-- Parent: PostItem.vue -->
<script setup>
import { ref } from 'vue'
import LikeButton from '@/components/LikeButton.vue'
const liked = ref(false)
function onToggle() { liked.value = !liked.value }  // parent ubah ↓
</script>
<template>
  <LikeButton :sudah-like="liked" @toggle="onToggle" />
</template>
```

```
ARAH:
PostItem ──props(:sudah-like)──→ LikeButton
LikeButton ──emit('toggle')────→ PostItem
                (events naik)
```

> ⚠️ Child TIDAK mengubah `liked` langsung. Parent yang pegang otoritas.

---

## 📏 3.13 Kapan HARUS Memecah (dan Kapan Tidak)

```
PECah JIKA:
✂ return JSX/template > 50-80 baris
✂ ada bagian dipakai ulang di >1 tempat
✂ ada logika kompleks & independen
✂ ada state yang hanya dipakai bagian itu

JANGAN PECAH:
🔗 pemecahan justru bikin sulit dibaca
🔗 komponen baru cuma dipakai 1 tempat & sangat simpel
🔗 butuh terlalu banyak props (prop drilling)
```

| Sinyal | Tindakan |
| --- | --- |
| Tombol "Play" di Hero & Card | Jadikan `PlayButton.vue` |
| `HomeView` 400 baris | Pindahkan `MovieRow` ke komponen |
| `SearchBar` punya logika sendiri | Pecah `SearchBar.vue` |
| Tim A navigasi, tim B footer | Pisah `Navbar` & `Footer` |

---

## 🧩 3.14 Pola Komponen Tambahan

### Pola Presentational vs Container

```vue
<!-- Presentational: hanya tampilan -->
<template>
  <ul><li v-for="u in users" :key="u.id">{{ u.nama }}</li></ul>
</template>
<script setup>
defineProps({ users: Array })
</script>

<!-- Container: pegang data -->
<script setup>
import { ref } from 'vue'
import UserList from '@/components/UserList.vue'
const users = ref([{ id:1, nama:'Budi' }])
</script>
<template><UserList :users="users" /></template>
```

### Pola Loading/Error State

```vue
<template>
  <div v-if="isLoading">⏳</div>
  <div v-else-if="error">❌ {{ error }}</div>
  <div v-else><slot /></div>
</template>
```

---

## ✅ 3.15 Checklist Sebelum Bab 4

- [ ] Paham apa itu komponen & keuntungannya
- [ ] Bisa bedah UI Netflix jadi hierarki
- [ ] Paham "props turun, events naik"
- [ ] Tahu kapan memecah komponen
- [ ] Pernah membuat `BaseButton.vue` reusable

```
Siap? Di Bab 4 kita pelajari "bahasa" template Vue! 📝
```

---

## 🧠 3.16 Mental Model "Komponen sebagai Fungsi"

Cara paling kuat memahami komponen: anggap ia seperti **fungsi**.

```
Fungsi biasa:
  function tambah(a, b) { return a + b }
  → input: a, b (parameter) → output: hasil

Komponen Vue:
  <MovieCard :title="x" :poster="y" />
  → input: props (title, poster) → output: tampilan
```

| Fungsi | Komponen |
| --- | --- |
| Parameter | Props |
| Return value | Tampilan (template) |
| Pemanggilan | `<NamaKomponen />` |

> 💡 Saat bingung merancang komponen, tanya: "kalau ini fungsi, parameternya apa?"

---

## 🏗️ 3.17 Merancang UI dari Figma ke Komponen

Alur kerja nyata seorang frontend:

```
1. Terima desain Figma
2. Tandai elemen berulang (komponen)
3. Tandai elemen sekali pakai (view)
4. Susun hierarki parent-child
5. Tentukan alur data (props/events)
6. Tulis kode .vue
```

| Langkah | Hasil |
| --- | --- |
| Tandai berulang | `MovieCard`, `Navbar` |
| Tandai sekali | `BrowseView` |
| Hierarki | App → Row → Card |
| Alur data | props turun, events naik |

---

## 🔧 3.18 Refactor: Dari Satu File ke Komponen

Misalkan awalnya semua di satu file:

```vue
<!-- ❌ Sebelum: 1 file raksasa -->
<template>
  <nav>...</nav>
  <section v-for="f in films">
    <div class="card"><img :src="f.poster" /></div>
  </section>
  <footer>...</footer>
</template>
```

```vue
<!-- ✅ Sesudah: pecah -->
<template>
  <Navbar />
  <MovieRow v-for="row in rows" :films="row" />
  <Footer />
</template>
```

```
Manfaat refactor:
✓ Tiap komponen bisa diuji sendiri
✓ Bug terlokalisasi
✓ Bisa dipakai ulang
✓ Tim bisa kerja paralel
```

---

## 🎓 3.19 Kesimpulan Berpikir Komponen

Inti bab ini cuma satu kalimat:

> **"Pecah UI kompleks menjadi komponen kecil yang independen & reusable."**

Semua sisanya (hierarki, props, events, kapan memecah) hanyalah cara menerapkan kalimat itu.

```
Kalau Anda ingat kalimat di atas → Bab 3 sukses. 🎯
```

---

## 🎨 3.20 Studi Kasus: Bedah UI YouTube

Supaya tidak cuma Netflix, mari bedah YouTube juga — pola berulangnya sama:

```
YouTube
├── Header (logo, search, avatar)
├── Sidebar (menu kiri)
└── VideoGrid
    └── VideoCard (berulang)
        ├── Thumbnail
        ├── Title
        └── ChannelInfo
```

| Komponen | Reusable? |
| --- | --- |
| `Header` | Sekali (di setiap halaman) |
| `VideoCard` | Berkali-kali (puluhan video) |
| `Thumbnail` | Di dalam `VideoCard` |

> 💡 Pola "satu definisi, banyak pemakaian" berlaku di semua aplikasi, bukan cuma Netflix.

---

## 🔗 3.21 Komunikasi Lintas Level (Prop Drilling)

Kadang data harus lewat banyak level:

```
App
 └─ BrowseView  (:user)
     └─ Sidebar (:user)
         └─ Profile (:user)
```

```
❌ Masalah: user diteruskan lewat BrowseView & Sidebar
            padahal mereka tak butuh, cuma meneruskan.
✅ Solusi: Pinia (state global) di Bagian V,
          atau provide/inject di Bab 11.
```

> ⚠️ Tanda prop drilling: props cuma dilewatkan, tidak dipakai di komponen tengah.

---

## 🧱 3.22 Atomic Design dalam Praktik

Mari lihat contoh konkret tiap level:

```vue
<!-- Atom: StarRating.vue -->
<template><span>{{ '⭐'.repeat(rating) }}</span></template>
<script setup>defineProps({ rating: Number })</script>

<!-- Molecule: MovieCard.vue pakai StarRating -->
<template>
  <div class="card">
    <img :src="poster" />
    <h3>{{ title }}</h3>
    <StarRating :rating="rating" />
  </div>
</template>

<!-- Organism: MovieRow.vue pakai MovieCard -->
<template>
  <section>
    <h2>{{ genre }}</h2>
    <MovieCard v-for="f in films" :key="f.id" v-bind="f" />
  </section>
</template>
```

```
Atom → Molecule → Organism → Page
Setiap level menyusun level di bawahnya. 🔧
```

---

## 📐 3.23 Kapan Satu Komponen Terlalu Besar?

Ciri komponen "gemuk" yang butuh dipecah:

| Ciri | Ambang |
| --- | --- |
| Baris template | > 80 baris |
| Method | > 10 |
| State lokal | > 8 |
| Bagian berulang | > 2 kali |
| Logika independen | ada blok terisolasi |

> 💡 Jika 3+ ciri di atas muncul, waktunya refactor.

---

## 🏆 3.24 Penguasaan Komponen — Tes Mandiri

Jawab singkat:

1. Apa itu komponen?
2. Siapa yang mengirim data ke child?
3. Bagaimana child kabari parent?
4. Mengapa `MovieCard` ditulis sekali tapi tampil 100x?
5. Kapan Anda memecah komponen?

```
Jawab 5/5 → cara berpikir komponen sudah melekat. 🧩
```

---

## 🧩 3.25 Komponen sebagai "Lego" — Latihan Mental

Setiap kali melihat UI, latih mata:

```
LIHAT UI → TANYA PADA DIRI:
1. Bagian mana yang berulang? → komponen
2. Bagian mana sekali pakai?  → view
3. Siapa parent, siapa child? → hierarki
4. Data dari mana?            → props
5. Event ke mana?             → emits
```

> 💡 Latihan 5 menit melihat website favorit = training membangun komponen gratis.

---

## 🛡️ 3.26 Prinsip "Single Responsibility"

Setiap komponen sebaiknya punya **satu tanggung jawab**:

```
❌ Buruk: komponen `UserDanFilm` (urus user & film sekaligus)
✅ Baik: `UserCard` (urus user) + `MovieCard` (urus film)
```

| Prinsip | Manfaat |
| --- | --- |
| Fokus satu tugas | Mudah diuji |
| Terisolasi | Bug tak menyebar |
| Reusable | Bisa dipakai di lain tempat |

---

## 🎉 3.27 Bab 3 Tamat

Anda kini berpikir seperti frontend developer Vue: memecah, menyusun, mengalirkan data.

```
Yang didapat Bab 3:
✓ Definisi & keuntungan komponen
✓ Mental model LEGO
✓ Bedah UI Netflix
✓ One-way data flow
✓ Kapan memecah
✓ Pola komponen
✓ Studi kasus nyata
```

> 🚀 Lanjut ke Bab 4 untuk mempelajari "bahasa" yang dipakai di dalam tiap komponen!

---

## 🧩 3.28 Narasi Komponen dalam Satu Cerita

Bayangkan membangun istana dari kepingan LEGO:

```
Tanpa komponen → 1 bongkahan raksasa (susah dirawat)
Dengan komponen → ribuan keping kecil (mudah dirakit & dipakai ulang)

Netflix = istana
Navbar, Hero, MovieRow, MovieCard, Footer = kepingan
Data mengalir turun (props), event naik (emits)
```

Cara berpikir komponen bukan teknik, melainkan **habitat** tempat Anda membangun UI Vue.

---

## 🏆 3.29 Kalimat Penutup Bab 3

> **"UI kompleks adalah kumpulan komponen sederhana yang disusun dengan alur data yang jelas."**

Ingat kalimat ini setiap kali melihat antarmuka — dari Netflix hingga aplikasi Anda sendiri.

---

## 📚 3.30 Glosarium & FAQ Komponen

Istilah penting bab ini:

| Istilah | Arti |
| --- | --- |
| **Component** | Potongan UI mandiri & reusable (`.vue`) |
| **Parent** | Komponen yang menampung child |
| **Child** | Komponen yang ditampung |
| **Props** | Data dari parent ke child (read-only) |
| **Emits** | Event dari child ke parent |
| **Slot** | Tempat menaruh konten dari luar (Bab 8) |
| **Prop drilling** | Props diteruskan berurutan (bau kode) |
| **Atomic Design** | Pola atom → molecule → organism → page |

**Q: Boleh komponen punya banyak root di Vue 3?**
A: Ya, berkat *fragment*. Di Vue 2 tidak bisa.

**Q: Apakah child boleh ubah prop?**
A: Tidak. Props read-only. Kirim event, biarkan parent ubah.

**Q: Kapan sebuah UI layak jadi komponen?**
A: Bila dipakai >1 tempat, atau punya logika mandiri.

**Q: Apa beda components/ vs views/?**
A: `views/` punya URL (router), `components/` dipakai ulang.

> 💡 Glosarium ini kunci membaca kode orang lain. Kuasai istilahnya.

---

## 🎁 3.31 Pesan Penutup

Cara berpikir komponen adalah keterampilan yang akan Anda bawa ke mana pun — React, Angular, Svelte, bahkan desain UI. Sekali melekat, Anda akan melihat dunia antarmuka sebagai kumpulan kepingan yang bisa disusun.

```
"Orang biasa melihat layar.
Developer Vue melihat hierarki komponen." 🧩
```

Sampai jumpa di Bab 4, di mana kita pelajari "bahasa" di dalam tiap komponen!

---

## 📌 3.32 Catatan Terakhir

Pengingat: jangan takut memecah komponen terlalu kecil di awal. Lebih baik memiliki beberapa komponen kecil yang jelas daripada satu berkas raksasa yang menakutkan. Nanti pengalaman akan mengajarkan keseimbangannya.

```
"Komponen kecil yang jelas mengalahkan monolit yang menakutkan." 🧩
```

---

## 📎 3.33 Referensi & Bacaan

Tempat belajar lebih dalam soal komponen:

| Topik | Sumber |
| --- | --- |
| Komponen resmi | vuejs.org/guide/components |
| Atomic Design | bradfrost.com (artikel klasik) |
| Pola komponen | patterns.dev |
| Contoh UI | vueuse.org, ui.github.com |

> 💡 Baca kode komponen orang lain adalah cara tercepat menajamkan intuisi desain.

---

## 🚪 3.34 Sebelum Lanjut ke Bab 4

Lakukan hal berikut:

1. Bayangkan hierarki komponen dari satu aplikasi favorit Anda.
2. Sebutkan minimal 3 komponen yang berulang.
3. Jelaskan arah alur data (props turun, events naik).
4. Coba buat `BaseButton.vue` sederhana.

```
Siap? Bab 4 akan mengajarkan "bahasa" di dalam komponen itu. 🚪
```

> 💡 Jika poin 4 belum berhasil, tidak apa. Bab 4 & praktik berikutnya akan menguatkannya.

---

## 💬 3.35 Kutipan untuk Diingat

> *"The secret to building large apps is never build large apps. Break them into small pieces."* — adaptasi prinsip komponen

Filosofi ini bukan sekadar teknik Vue, tapi cara berpikir yang produktif di bidang apa pun.

```
Masalah besar → pecah jadi kecil → selesaikan satu per satu. 🧩
```

---

## 🧭 3.36 Latihan Observasi Harian

Tantangan ringan: setiap kali Anda buka aplikasi web hari ini, catat 3 komponen yang menurut Anda berulang. Lama-lama, mata Anda otomatis "memecah" UI tanpa sadar.

| Aplikasi | Komponen Berulang |
| --- | --- |
| YouTube | VideoCard, Sidebar, Header |
| Tokopedia | ProductCard, Navbar, CartBadge |
| WhatsApp | ChatItem, SearchBar, Avatar |

> 💡 Latihan 5 menit sehari membangun intuisi desain komponen yang kuat.

---

## 🔖 3.37 Bookmark Konsep Penting

Simpan 5 poin ini sebagai bookmark mental:

1. Komponen = potongan UI mandiri & reusable.
2. One-way data flow: props turun, events naik.
3. Reusability: tulis sekali, pakai di mana saja.
4. Pecah bila dipakai >1 tempat atau punya logika mandiri.
5. Hierarki parent-child membentuk Component Tree.

```
Bookmark ini cukup untuk 90% pekerjaan komponen sehari-hari. 🔖
```

---

## 📮 3.38 Pesan Singkat

Jika hanya satu hal yang diingat dari bab ini, biarlah ini: **pecah, susun, alirkan data**. Tiga kata itu merangkum seluruh cara berpikir berbasis komponen.

```
Pecah → Susun → Alirkan data = resep UI Vue. 📮
```

---

## 📝 Ringkasan Bab 3

| Konsep | Penjelasan |
| --- | --- |
| **Komponen** | Potongan UI mandiri (template + script + style) dalam `.vue`. |
| **LEGO mental model** | Kepingan kecil disusun jadi bentuk besar; bisa dipakai ulang. |
| **Anatomi** | `<template>` (tampilan) + `<script setup>` (logika) + `<style scoped>` (gaya). |
| **UI Netflix** | `Navbar`, `HeroSection`, `MovieRow`, `MovieCard`, `Footer` bersarang. |
| **Parent/Child** | Komponen bersarang; parent menampung child. |
| **One-way data flow** | Data turun via **props**, event naik via **emits**. |
| **Reusability** | Satu komponen (mis. `MovieCard`) dipakai berkali-kali dengan data beda. |
| **Kapan pecah** | Dipakai >1 tempat, >200-300 baris, logika mandiri, atau tim beda. |
| **Pola umum** | Presentational vs Container, Loading/Error state, UI generik. |
| **Jebakan** | Jangan mutasi props, hindari prop drilling, konsisten nama. |

---

## 🎯 Latihan Mandiri

**⭐ Latihan 1 — Bedah UI Favorit**
Pilih satu aplikasi web favorit Anda (mis. Tokopedia, YouTube, Spotify). Gambar hierarki komponennya (minimal 3 level): apa yang jadi `App`, apa yang jadi `Navbar`, apa yang berulang seperti `MovieCard`. Sebutkan minimal 5 komponen.

**⭐⭐ Latihan 2 — Buat Komponen Tombol**
Buat `BaseButton.vue` yang menerima props `varian` ('primer'/'sekunder'/'bahaya'), `disabled`, dan `children` (via `<slot>`). Tampilkan 3 variasi tombol. Pastikan `disabled` benar-benar menonaktifkan klik.

**⭐⭐⭐ Latihan 3 — Parent/Child dengan Props & Emits**
Buat `Counter.vue` (child) yang menerima prop `nilaiAwal` dan mengirim event `ubah` setiap kali tombol `+`/`-` diklik. Di `App.vue` (parent), tangkap event tersebut dan tampilkan nilai saat ini. Buktikan alur "props turun, events naik".

**⭐⭐⭐⭐ Latihan 4 — Tantangan Component Tree**
Bangun halaman "Daftar Film Sederhana" dengan struktur: `App` → `MovieList` (mengulang) → `MovieCard` (satu kartu). `MovieCard` punya tombol "Detail" yang emit event ke `App` untuk menampilkan judul film di sebuah `<p>` di atas list. Minimal 6 film dengan data berbeda.

---

*Lanjut ke ➡️ **Bab 4 — 📝 Template Syntax & Direktif Dasar***
