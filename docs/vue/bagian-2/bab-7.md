# 📨 Bab 7 — Props & Emits: Komunikasi Antar Komponen

> *"Dua saudara yang tinggal bersebelahan tidak perlu berteriak untuk saling tahu kabar. Yang tua mengirim pesan lewat pintu (props), yang muda membalas lewat lonceng (emits). Begitulah komponen Vue berbicara — satu arah ke bawah, satu arah ke atas."*

---

> **🧠 Apa Itu Props & Emits?**
>
> Aplikasi Vue adalah **pohon komponen**: komponen induk (Parent) menampilkan komponen anak (Child). Agar mereka bisa bekerja sama, Vue menetapkan aturan emas yang disebut **one-way data flow**: **data mengalir ke bawah** dari Parent ke Child melalui **`props`**, dan **event mengalir ke atas** dari Child ke Parent melalui **`emits`**. Props adalah cara Parent "memberi tahu" Child apa yang harus ditampilkan; Emits adalah cara Child "memberi tahu" Parent bahwa sesuatu telah terjadi (lalu Parent yang memutuskan apa yang harus dilakukan).

---

> **🏗️ Analogi Sederhana:**
>
> Bayangkan **atasan (Parent)** dan **karyawan (Child)**. Atasan memberi instruksi: *"Cetak laporan dengan judul ini"* — itu **props** (data masuk ke child). Karyawan mengerjakan, lalu melapor: *"Laporan selesai, ini hasilnya"* — itu **emits** (event keluar dari child). Atasan **tidak** mengubah langsung pekerjaan karyawan, dan karyawan **tidak** mengubah instruksi atasan. Mereka berkomunikasi lewat saluran yang jelas. Inilah yang membuat aplikasi Vue mudah di-debug: kamu selalu tahu dari mana data berasal.

---

## 📋 Daftar Isi Bab 7

1. Arsitektur Komponen — Parent & Child
2. `defineProps` — Dasar Penerimaan Props
3. Validasi Props (type, required, default)
4. Props Object & Array dengan Default Factory
5. Boolean Props & Shorthand di Template
6. Multi-type & Validator Kustom
6. Aturan Emas — Jangan Ubah Props di Child
7. `defineEmits` — Dasar Pengiriman Event
8. Mengirim Data Lewat Emit (Payload)
9. Event Modifiers (`.stop`, `.self`, `.prevent`)
10. `v-model` pada Komponen (Advanced Emits)
11. `defineExpose` & Komunikasi Langsung (Sekilas)
12. Studi Kasus — MovieCard + Parent
13. Jebakan Umum Pemula di Bab 7
14. Ringkasan & Latihan Mandiri

---

## 🌳 1. Arsitektur Komponen — Parent & Child

```
App.vue (Root / Parent)
   │
   │  mengirim data ke bawah  →  via PROPS
   │
   ▼
MovieRow.vue (Child dari App, Parent dari Card)
   │
   │  mengirim data ke bawah  →  via PROPS
   │
   ▼
MovieCard.vue (Child)
   │
   │  mengirim event ke atas  →  via EMITS
   ▲
   │
Parent menerima event & bereaksi
```

> ⚠️ **Aturan Utama (One-Way Data Flow):**
> Data mengalir **ke bawah** (parent → child via props).
> Event mengalir **ke atas** (child → parent via emits).
> Komponen child **tidak boleh** mengubah props yang diterimanya. Jika child butuh "mengubah" sesuatu, ia harus **emit event** dan biarkan parent yang mengubah datanya. Ini menjaga aliran data tetap bisa dilacak.

---

## 📥 2. `defineProps` — Dasar Penerimaan Props

Di Vue 3 dengan `<script setup>`, kita mendeklarasikan props menggunakan `defineProps`.

```vue
<!-- Child: MovieCard.vue -->
<script setup>
// Cara 1: array sederhana (tanpa validasi)
const props = defineProps([
  'judul',
  'rating',
  'poster',
])

// Cara 2: object dengan validasi (REKOMENDASI) — lihat section 3
// const props = defineProps({ ... })
</script>

<template>
  <!-- Akses props langsung di template -->
  <div class="movie-card">
    <img :src="props.poster" :alt="props.judul" />
    <h3>{{ props.judul }}</h3>
    <span>⭐ {{ props.rating }}</span>
  </div>
</template>
```

**Cara menggunakan di Parent:**

```vue
<!-- Parent: MovieRow.vue -->
<script setup>
import MovieCard from './MovieCard.vue'

const daftarFilm = [
  { id: 1, title: 'Inception', vote_average: 8.8, poster_path: '/a.jpg' },
  { id: 2, title: 'Tenet',    vote_average: 7.5, poster_path: '/b.jpg' },
]
const filmTerpilih = 1
</script>

<template>
  <div class="movie-row">
    <!-- Kirim data ke child via props (pakai : untuk binding dinamis) -->
    <MovieCard
      v-for="film in daftarFilm"
      :key="film.id"
      :judul="film.title"
      :rating="film.vote_average"
      :poster="`https://image.tmdb.org/t/p/w300${film.poster_path}`"
      :is-highlighted="film.id === filmTerpilih"
    />
  </div>
</template>
```

> 💡 **`judul` vs `:judul`:** Tanpa titik dua (`judul="Film"`), Vue mengirim **string literal** `"Film"`. Dengan titik dua (`:judul="film.title"`), Vue mengevaluasi **ekspresi JavaScript** — mengirim nilai variabel. Gunakan `:` untuk semua data dinamis (number, boolean, object, expression).

---

## ✅ 3. Validasi Props (type, required, default)

Selalu validasi props di aplikasi nyata — ini mencegah bug dan memberikan dokumentasi otomatis.

```vue
<!-- Child: MovieCard.vue -->
<script setup>
const props = defineProps({
  // ① String wajib diisi
  judul: {
    type:     String,
    required: true,         // Parent WAJIB mengirim ini, else warning
  },

  // ② Number dengan default
  rating: {
    type:     Number,
    default:  0,            // dipakai jika parent tidak mengirim
  },

  // ③ String dengan default
  poster: {
    type:    String,
    default: '/images/no-poster.jpg',
  },

  // ④ Boolean dengan default false
  isHighlighted: {
    type:    Boolean,
    default: false,
  },

  // ⑤ Array (default harus pakai factory function — lihat section 4)
  tags: {
    type:    Array,
    default: () => [],
  },
})
</script>
```

### 3.1 Tipe yang Didukung

| `type` | Contoh Nilai |
| --- | --- |
| `String` | `'Interstellar'` |
| `Number` | `42`, `3.14` |
| `Boolean` | `true`, `false` |
| `Array` | `[1, 2, 3]` |
| `Object` | `{ a: 1 }` |
| `Function` | `() => {}` |
| `Symbol` | `Symbol('x')` |
| `Date` | `new Date()` |
| Komponen | komponen Vue |
| `null` / `undefined` | tidak divalidasi tipe |

```vue
<script setup>
// Multi-type: boleh String ATAU Number
const props = defineProps({
  id:      { type: [String, Number] },
  onKlik:  { type: Function, required: true },
  dibuat:  { type: Date },
})
</script>
```

---

## 🏭 4. Props Object & Array dengan Default Factory

**Aturan kritis:** `default` untuk `Object` atau `Array` **harus berupa function** yang mengembalikan nilai baru. Jika kamu menulis `default: []` (array langsung), semua instance komponen akan **berbagi array yang sama** — sumber bug mengerikan!

```vue
<script setup>
const props = defineProps({
  // ❌ SALAH — semua instance berbagi array yang SAMA (mutable shared)
  tagsSalah: {
    type: Array,
    default: [],            // JANGAN! bisa bocor antar instance
  },

  // ✅ BENAR — factory function, array baru per instance
  tagsBenar: {
    type:    Array,
    default: () => [],      // dipanggil tiap instance butuh default
  },

  // ✅ BENAR — object default juga pakai factory
  meta: {
    type:    Object,
    default: () => ({ views: 0, likes: 0 }),
  },
})
</script>
```

> ⚠️ **Mengapa factory?** `default` dievaluasi saat definisi props (sekali). Jika array/object ditaruh langsung, referensi yang sama dipakai oleh semua komponen. Dengan `() => [...]`, function dipanggil **tiap kali** sebuah instance butuh default → setiap instance dapat objek barunya sendiri.

---

## 🔘 5. Boolean Props & Shorthand di Template

Boolean props punya perilaku khusus yang menyenangkan.

```vue
<!-- Child -->
<script setup>
const props = defineProps({
  isLoading:    { type: Boolean, default: false },
  isHighlighted:{ type: Boolean, default: false },
})
</script>

<!-- Parent -->
<template>
  <!-- ❌ Bisa tapi verbose -->
  <MovieCard :is-loading="true" :is-highlighted="true" />

  <!-- ✅ Boolean shorthand: cukup tulis nama (berarti true) -->
  <MovieCard is-loading is-highlighted />

  <!-- ✅ Atau binding dinamis -->
  <MovieCard :is-loading="sedangMemuat" />
</template>
```

**Penjelasan:** Untuk prop bertipe `Boolean`, menulis `is-loading` tanpa nilai setara dengan `:is-loading="true"`. Ini mengikuti konvensi HTML attribute seperti `<input disabled />`.

> 💡 **Konvensi Nama:** Vue otomatis mengubah **camelCase** di JS menjadi **kebab-case** di template. Jadi `isHighlighted` ditulis `is-highlighted` di template. Selalu gunakan kebab-case di template untuk konsistensi dengan HTML.

---

## 🎛️ 6. Multi-type & Validator Kustom

Untuk validasi lebih ketat, gunakan `validator` — fungsi yang mengembalikan `true` jika nilai valid.

```vue
<script setup>
const props = defineProps({
  // Multi-type
  id: { type: [String, Number], required: true },

  // Validator: nilai harus salah satu dari daftar
  ukuran: {
    type:     String,
    default:  'sedang',
    validator: (value) => ['kecil', 'sedang', 'besar'].includes(value),
    // jika parent mengirim 'raksasa' → Vue beri warning (dev mode)
  },

  // Validator untuk angka
  rating: {
    type:     Number,
    default:  0,
    validator: (v) => v >= 0 && v <= 10,
  },

  // Validator object
  konfig: {
    type:     Object,
    default:  () => ({}),
    validator: (v) => typeof v.tema === 'string',
  },
})
</script>
```

> 💡 **Validator hanya peringatan, bukan error fatal.** Di development mode, Vue mencetak warning ke console jika validasi gagal, tapi aplikasi tetap jalan. Gunakan ini sebagai "guard rail" untuk tim.

---

## 🚫 7. Aturan Emas — Jangan Ubah Props di Child

Ini **paling penting**. Props adalah **read-only** di child. Mutasi props memicu warning dan merusak aliran data satu arah.

```vue
<script setup>
const props = defineProps({ judul: String, count: Number })

// ❌ SALAH — mengubah props langsung
function salah() {
  props.judul = 'Baru'     // WARNING! props read-only
  props.count++            // WARNING!
}

// ❌ SALAH — mengubah object dalam props
// props.user.nama = 'Ani'  // mutasi nested juga salah!

// ✅ BENAR 1 — salin ke state lokal (ref/reactive) lalu ubah copy
import { ref } from 'vue'
const judulLokal = ref(props.judul)    // copy awal
function ubahLokal() {
  judulLokal.value = 'Baru'             // aman, ini state lokal
}

// ✅ BENAR 2 — emit event, biarkan parent ubah data aslinya
const emit = defineEmits(['update:judul'])
function mintaUbah() {
  emit('update:judul', 'Baru')          // parent yang ubah state
}
</script>
```

> ⚠️ **Mengapa dilarang?** Jika child mengubah props, maka "sumber kebenaran" (source of truth) jadi ambigu. Parent tidak tahu child mengubah datanya → bug sulit dilacak, terutama saat ada dua child yang menerima props sama. **Biarkan parent yang pegang data; child hanya menampilkan & memberi tahu.**

---

## 📤 8. `defineEmits` — Dasar Pengiriman Event

Child memberi tahu parent lewat **emits**. Deklarasikan dengan `defineEmits`.

```vue
<!-- Child: MovieCard.vue -->
<script setup>
// Deklarasikan semua event yang bisa di-emit (good practice: sebutkan nama)
const emit = defineEmits([
  'klik-film',
  'tambah-watchlist',
  'hapus-watchlist',
])

function handleKlik() {
  // emit(eventName, ...payload)
  emit('klik-film', { id: props.id, judul: props.judul })
}

function handleTambah() {
  emit('tambah-watchlist', props.id)
}
</script>

<template>
  <div class="movie-card" @click="handleKlik">
    <img :src="props.poster" :alt="props.judul" />
    <h3>{{ props.judul }}</h3>
    <button @click.stop="handleTambah">➕ Simpan</button>
  </div>
</template>
```

**Di Parent:** dengarkan event dengan `@nama-event`.

```vue
<!-- Parent: BrowseView.vue -->
<script setup>
import MovieCard from './MovieCard.vue'

function bukaModalDetail(payload) {
  console.log('Film diklik:', payload)   // { id, judul }
  // misal: this.modalFilm = payload
}

function simpanKeWatchlist(id) {
  console.log('Tambah ke watchlist:', id)
}
</script>

<template>
  <MovieCard
    v-for="film in films"
    :key="film.id"
    :judul="film.title"
    :id="film.id"
    :poster="film.poster_path"
    @klik-film="bukaModalDetail"
    @tambah-watchlist="simpanKeWatchlist"
  />
</template>
```

**Anatomi emits:**
- `defineEmits([...])` → daftar nama event (string).
- `emit('nama', data)` → kirim event + payload ke parent.
- `@nama="handler"` di parent → tangkap event, jalankan handler dengan payload sebagai argumen.

---

## 📦 9. Mengirim Data Lewat Emit (Payload)

Event bisa membawa **payload** apa pun: primitive, object, array, bahkan multiple payload.

```vue
<script setup>
const emit = defineEmits(['pilih', 'update', 'submit'])

// Payload tunggal (object)
emit('pilih', { id: 42, judul: 'Dune' })

// Multiple payload (semua diteruskan ke handler)
emit('submit', formData, isValid)

// Payload function (misal callback)
emit('ready', () => console.log('mounted'))
</script>

<!-- Parent menangkap -->
<template>
  <Child
    @pilih="(film) => console.log(film.id)"
    @submit="(data, valid) => kirim(data, valid)"
    @ready="onReady"
  />
</template>
```

> 💡 **Konvensi Penamaan Event:** Gunakan **kebab-case** di template (`@klik-film`) dan **camelCase** di deklarasi JS (`defineEmits(['klikFilm'])` juga valid). Vue merekomendasikan kebab-case untuk event di template agar konsisten dengan atribut HTML. Di `<script setup>`, `defineEmits(['klikFilm'])` otomatis bisa didengar sebagai `@klik-film` maupun `@klikFilm`.

---

## 🧩 10. Event Modifiers (`.stop`, `.self`, `.prevent`)

Sama seperti event DOM biasa, emits/listener mendukung **modifier** untuk mengontrol propagasi.

```vue
<!-- Child -->
<template>
  <div @click="emit('buka')">
    <!-- .stop: hentikan propagasi ke parent click -->
    <button @click.stop="emit('tambah')">Tambah</button>

    <!-- .self: hanya picu jika event target = elemen ini sendiri -->
    <div @click.self="emit('tutup')" class="overlay">
      <div class="modal">Konten</div>   <!-- klik di dalam tidak menutup -->
    </div>

    <!-- .prevent: cegah default browser (misal submit form reload) -->
    <form @submit.prevent="emit('submit')">...</form>
  </div>
</template>
```

| Modifier | Fungsi |
| --- | --- |
| `.stop` | `event.stopPropagation()` — hentikan event ke element induk |
| `.prevent` | `event.preventDefault()` — cegah aksi default browser |
| `.self` | Hanya picu jika `event.target === element itu sendiri` |
| `.capture` | Tangkap pada fase capture (sebelum bubble) |
| `.once` | Hanya picu sekali, lalu listener dilepas |
| `.passive` | `passive: true` — optimasi scroll/touch |

> ⚠️ **Perhatian `.stop` pada emit berantai:** Jika child emit event dan parent juga emit event ke atasnya, `.stop` di listener child **tidak** menghentikan emit parent. `.stop` hanya memengaruhi event DOM asli, bukan event Vue yang di-emit. Untuk mengontrol emit berantai, gunakan logika di handler.

---

## 🔁 11. `v-model` pada Komponen (Advanced Emits)

`v-model` di komponen adalah "gula sintaksis" yang menggabungkan **props `modelValue`** + **emit `update:modelValue`**. Ini membuat two-way binding antar komponen sehalus `v-model` biasa.

```vue
<!-- Child: CustomInput.vue -->
<script setup>
const props = defineProps({
  modelValue: { type: String, default: '' },   // nama props wajib 'modelValue'
})
const emit = defineEmits(['update:modelValue']) // nama emit wajib 'update:modelValue'

function onInput(e) {
  // setiap ketikan → emit ke parent
  emit('update:modelValue', e.target.value)
}
</script>

<template>
  <input :value="modelValue" @input="onInput" class="input" />
</template>
```

```vue
<!-- Parent -->
<script setup>
import { ref } from 'vue'
import CustomInput from './CustomInput.vue'

const nama = ref('')
</script>

<template>
  <!-- Ini setara dengan: :model-value="nama" @update:model-value="nama = $event" -->
  <CustomInput v-model="nama" />
  <p>Ketikan: {{ nama }}</p>
</template>
```

**Multiple `v-model`** (Vue 3 mendukung lebih dari satu):

```vue
<!-- Child -->
<script setup>
defineProps({
  namaDepan:  String,
  namaBelakang: String,
})
defineEmits(['update:namaDepan', 'update:namaBelakang'])
</script>

<template>
  <input :value="namaDepan"    @input="$emit('update:namaDepan', $event.target.value)" />
  <input :value="namaBelakang" @input="$emit('update:namaBelakang', $event.target.value)" />
</template>

<!-- Parent -->
<template>
  <UserForm v-model:nama-depan="depan" v-model:nama-belakang="belakang" />
</template>
```

> 💡 **`v-model` argumen** (`v-model:nama-depan`) memungkinkan banyak binding dua arah. Di belakang layar tetap props + emits — tidak ada sihir. Ini pola yang sangat umum untuk komponen form kustom.

---

## 🔓 12. `defineExpose` & Komunikasi Langsung (Sekilas)

Kadang parent butuh memanggil **method** child secara langsung (misal pause video). Vue menyediakan `defineExpose` + `ref` di parent. (Akan dibahas lengkap di Bab 15, ini sekilas.)

```vue
<!-- Child: VideoPlayer.vue -->
<script setup>
import { ref } from 'vue'
const videoEl = ref(null)
function play()  { videoEl.value?.play() }
function pause() { videoEl.value?.pause() }

// Ekspos method ke parent
defineExpose({ play, pause })
</script>
<template><video ref="videoEl" :src="src" /></template>

<!-- Parent -->
<script setup>
import { ref } from 'vue'
const player = ref(null)
function playVideo() { player.value?.play() }
</script>
<template>
  <VideoPlayer ref="player" :src="url" />
  <button @click="playVideo">▶ Play</button>
</template>
```

> ⚠️ **Gunakan secukupnya.** Komunikasi lewat `props`/`emits` lebih mudah dirawat. `defineExpose` hanya untuk kasus spesifik yang butuh kontrol imperatif (video, focus, dll).

---

## 🎬 13. Studi Kasus — MovieCard + Parent

Mari buat studi kasus lengkap: `MovieCard` (child) yang menerima props lengkap, memvalidasi, dan meng-emit beberapa event; serta `MovieGrid` (parent) yang mengelola state dan merespons event.

```vue
<!-- MovieCard.vue -->
<script setup>
// ── PROPS dengan validasi lengkap ──
const props = defineProps({
  id: {
    type:     [String, Number],
    required: true,
  },
  judul: {
    type:     String,
    required: true,
  },
  rating: {
    type:    Number,
    default: 0,
    validator: (v) => v >= 0 && v <= 10,
  },
  poster: {
    type:    String,
    default: 'https://via.placeholder.com/300x450?text=No+Poster',
  },
  isHighlighted: {
    type:    Boolean,
    default: false,
  },
  tags: {
    type:    Array,
    default: () => [],
  },
})

// ── EMITS ──
const emit = defineEmits([
  'pilih',
  'toggle-watchlist',
])

// ── Computed untuk tampilan ──
const ratingWarna = computed(() => {
  if (props.rating >= 8) return 'hijau'
  if (props.rating >= 6) return 'kuning'
  return 'merah'
})

function pilih() {
  // kirim object payload
  emit('pilih', { id: props.id, judul: props.judul })
}

function toggleWatchlist() {
  // kirim id saja
  emit('toggle-watchlist', props.id)
}
</script>

<template>
  <article
    class="movie-card"
    :class="{ 'highlighted': isHighlighted, [`rating-${ratingWarna}`]: true }"
    @click="pilih"
  >
    <img :src="poster" :alt="judul" class="poster" loading="lazy" />

    <div class="info">
      <h3 class="judul">{{ judul }}</h3>
      <span class="rating">⭐ {{ rating.toFixed(1) }}</span>

      <div class="tags">
        <span v-for="tag in tags" :key="tag" class="tag">{{ tag }}</span>
      </div>

      <!-- .stop agar klik tombol tidak memicu pilih() di article -->
      <button class="btn-wl" @click.stop="toggleWatchlist">
        ➕ Watchlist
      </button>
    </div>
  </article>
</template>

<style scoped>
.movie-card { border-radius: 10px; overflow: hidden; cursor: pointer; }
.highlighted { outline: 3px solid gold; }
.rating-hijau  { color: #16a34a; }
.rating-kuning { color: #ca8a04; }
.rating-merah  { color: #dc2626; }
</style>
```

```vue
<!-- MovieGrid.vue (Parent) -->
<script setup>
import { ref } from 'vue'
import MovieCard from './MovieCard.vue'

// State parent
const films       = ref([
  { id: 1, title: 'Inception',  vote_average: 8.8, poster_path: '/a.jpg', tags: ['sci-fi'] },
  { id: 2, title: 'Tenet',      vote_average: 7.5, poster_path: '/b.jpg', tags: ['action'] },
  { id: 3, title: 'Interstellar', vote_average: 8.6, poster_path: '/c.jpg', tags: ['drama','sci-fi'] },
])
const filmTerpilih = ref(null)
const watchlist    = ref(new Set())

// Handler untuk event dari child
function handlePilih(payload) {
  filmTerpilih.value = payload
  console.log('Buka detail:', payload.judul)
}

function handleToggleWatchlist(id) {
  if (watchlist.value.has(id)) {
    watchlist.value.delete(id)
  } else {
    watchlist.value.add(id)
  }
  // Karena Set, untuk trigger reaktivitas pada ref:
  watchlist.value = new Set(watchlist.value)
}
</script>

<template>
  <section>
    <h2>🎬 Daftar Film</h2>

    <p v-if="filmTerpilih">
      Film dipilih: <strong>{{ filmTerpilih.judul }}</strong>
    </p>

    <div class="grid">
      <MovieCard
        v-for="film in films"
        :key="film.id"
        :id="film.id"
        :judul="film.title"
        :rating="film.vote_average"
        :poster="`https://image.tmdb.org/t/p/w300${film.poster_path}`"
        :is-highlighted="filmTerpilih?.id === film.id"
        :tags="film.tags"
        @pilih="handlePilih"
        @toggle-watchlist="handleToggleWatchlist"
      />
    </div>
  </section>
</template>
```

**Alur komunikasi studi kasus:**

```
User klik card
   ↓
MovieCard.pilih() → emit('pilih', {id, judul})
   ↓
MovieGrid.handlePilih(payload) → set filmTerpilih
   ↓
MovieGrid render ulang → card dengan id === filmTerpilih dapat highlight

User klik "Watchlist"
   ↓
MovieCard.toggleWatchlist() → emit('toggle-watchlist', id)
   ↓
MovieGrid.handleToggleWatchlist(id) → update Set watchlist
```

> 🎯 **Pelajaran:** Child **tidak tahu** apa yang terjadi setelah emit. Ia hanya "melapor". Parent yang memegang state & memutuskan reaksi. Ini membuat `MovieCard` bisa dipakai di banyak tempat dengan perilaku berbeda.

---

## 🚨 14. Jebakan Umum Pemula di Bab 7

### ❌ Jebakan 1 — Mengubah Props Langsung di Child

```javascript
// ❌ SALAH
const props = defineProps(['judul'])
props.judul = 'Baru'          // WARNING: props read-only

// ✅ BENAR — emit atau salin ke local state
const emit = defineEmits(['update:judul'])
emit('update:judul', 'Baru')
// atau: const judulLokal = ref(props.judul)
```

### ❌ Jebakan 2 — Default Object/Array Tanpa Factory

```javascript
// ❌ SALAH — shared reference antar instance
defineProps({ items: { type: Array, default: [] } })

// ✅ BENAR
defineProps({ items: { type: Array, default: () => [] } })
```

### ❌ Jebakan 3 — Lupa `:` (v-bind) untuk Data Dinamis

```vue
<!-- ❌ SALAH — mengirim string "42", bukan number 42 -->
<MovieCard rating="42" />

<!-- ✅ BENAR — binding ekspresi -->
<MovieCard :rating="42" />
<MovieCard :rating="film.vote_average" />
```

### ❌ Jebakan 4 — Nama Event Tidak Cocok (Camel vs Kebab)

```vue
<!-- ❌ SALAH — defineEmits(['pilihFilm']) tapi dengar @pilih-film -->
<!-- di Vue 3 sebenarnya bisa, tapi untuk hindari kebingungan: -->
const emit = defineEmits(['pilihFilm'])
<!-- Parent -->
<Child @pilih-film="..." />   <!-- Vue menghubungkan keduanya, tapi rawan salah -->

<!-- ✅ Konsisten: gunakan kebab di template -->
const emit = defineEmits(['pilihFilm'])
<Child @pilih-film="handler" />   <!-- aman & konsisten -->
```

### ❌ Jebakan 5 — Mutasi Object di Dalam Props

```javascript
// ❌ SALAH — mutasi nested object dalam props
const props = defineProps(['user'])
props.user.nama = 'Ani'       // WARNING! masih mutasi props

// ✅ BENAR — emit agar parent ubah, atau salin dulu
const userLokal = reactive({ ...props.user })
userLokal.nama = 'Ani'
emit('update:user', userLokal)
```

---

## 🔀 15. Props Drilling vs Emit — Kapan Gunakan Apa

Ketika hierarki dalam (grandparent → parent → child), mengirim props melewati banyak level = **props drilling** (jelek). Emit naik satu level lalu turun lagi juga melelahkan. Berikut panduannya.

```
HIERARKI:
App
 └─ HalamanProfil
     └─ KartuProfil
         └─ TombolEdit   (butuh trigger edit di App)

SOLUSI A (props drilling - buruk):
  App ─props─→ HalamanProfil ─props─→ KartuProfil ─props─→ TombolEdit
  (HalamanProfil & KartuProfil hanya meneruskan, tidak pakai)

SOLUSI B (emit naik - verbose):
  TombolEdit emit → KartuProfil emit → HalamanProfil emit → App

SOLUSI C (provide/inject - Bab 11, terbaik untuk global):
  App provide('editHandler')
  TombolEdit inject('editHandler') ← langsung, lewati tengah
```

| Pendekatan | Kelebihan | Kekurangan | Pakai saat |
| --- | --- | --- | --- |
| **Props + Emit** | Eksplisit, mudah dilacak | Verbose untuk hierarki dalam | 1–2 level |
| **Props Drilling** | ❌ Hindari | Sulit dirawat | Tidak pernah (pakai C) |
| **provide/inject** | Lewati banyak level | Kurang eksplisit alur data | State global (tema, user) |

> 💡 **Aturan:** Untuk komunikasi **dekat** (parent-child langsung) → props & emits. Untuk **global** (tema, auth) → `provide/inject` atau Pinia (Bab 19+). Jangan props-drill lebih dari 2 level.

---

## 🎛️ 16. Validasi Props Lanjut: Type Assertion & Custom Type

Kamu bisa validasi dengan **tipe kustom** (bukan hanya built-in) menggunakan constructor function.

```vue
<script setup>
// Tipe kustom via class/constructor
class TanggalRilis {}

const props = defineProps({
  // props harus instance dari TanggalRilis
  rilis: {
    type: TanggalRilis,
    required: true,
  },
  // Atau objek bentuk tertentu via validator
  koordinat: {
    type: Object,
    validator: (v) =>
      typeof v.lat === 'number' && typeof v.lng === 'number',
  },
  // Array of numbers
  skor: {
    type: Array,
    validator: (arr) => arr.every(n => typeof n === 'number'),
  },
})
</script>
```

> ⚠️ **Validator hanya peringatan.** Di production build, validasi props **dimatikan** (di-tree-shake) untuk efisiensi. Jangan gunakan validator sebagai validasi keamanan — validasi input tetap harus di logic aplikasi.

---

## 🔁 17. Emit dengan `validateEmits` & Type-Safety

Vue 3.3+ mendukung `defineEmits` dengan **type declaration** (TypeScript-style) untuk keamanan tipe yang lebih baik.

```vue
<script setup lang="ts">
// Cara deklaratif (type-based) — lebih aman & terbaca
const emit = defineEmits<{
  (e: 'pilih', payload: { id: number; judul: string }): void
  (e: 'toggle-watchlist', id: number): void
}>()

// Penggunaan tetap sama:
emit('pilih', { id: 1, judul: 'Dune' })   // ✅ tipe benar
// emit('pilih', 'salah')                   // ❌ TS error
</script>
```

> 💡 **Untuk pemula (JS):** Cukup pakai array `defineEmits(['pilih', ...])`. Tipe deklaratif di atas berguna saat pakai TypeScript (dibahas di bab lanjutan).

---

## 🧩 18. Pola Komunikasi Komponen Nyata (Cheat Sheet)

| Pola | Cara | Contoh |
| --- | --- | --- |
| **Parent → Child** | props | `<Card :title="x" />` |
| **Child → Parent** | emits | `emit('save', data)` + `@save="onSave"` |
| **Two-way binding** | `v-model` | `<Input v-model="nama" />` |
| **Child method call** | `defineExpose` + ref | `player.value.play()` |
| **Global state** | Pinia | `useStore()` |
| **Deep context** | provide/inject | tema, user login |

```vue
<!-- Contoh two-way + emit bersama -->
<script setup>
const props = defineProps({ modelValue: String })
const emit = defineEmits(['update:modelValue', 'submit'])

function onInput(e) {
  emit('update:modelValue', e.target.value)  // untuk v-model
}
function onSubmit() {
  emit('submit', props.modelValue)            // event tambahan
}
</script>

<template>
  <input :value="modelValue" @input="onInput" @keyup.enter="onSubmit" />
</template>
```

---

## 📊 19. Perbandingan Options API vs Composition API (Props & Emits)

Agar kamu siap membaca kode lama, ini konversinya.

```vue
<!-- OPTIONS API -->
<script>
export default {
  props: {
    judul: { type: String, required: true },
    rating: { type: Number, default: 0 },
  },
  emits: ['pilih', 'hapus'],
  methods: {
    klik() { this.$emit('pilih', this.judul) },
  },
}
</script>

<!-- COMPOSITION API (<script setup>) -->
<script setup>
const props = defineProps({
  judul: { type: String, required: true },
  rating: { type: Number, default: 0 },
})
const emit = defineEmits(['pilih', 'hapus'])
function klik() { emit('pilih', props.judul) }
</script>
```

| Options API | Composition API |
| --- | --- |
| `props: {}` | `defineProps({})` |
| `emits: []` | `defineEmits([])` |
| `this.$emit('x', d)` | `emit('x', d)` |
| `this.judul` | `props.judul` |

---

## 🎯 20. Latihan Pemahaman Cepat (Self-Test)

```
SOAL 1: Child butuh mengubah warna tombol berdasar props. Boleh ubah props?
JAWABAN: TIDAK. Props read-only. Gunakan computed dari props, atau emit ke parent.

SOAL 2: Parent ingin tahu saat child diklik. Mekanisme?
JAWABAN: Child emit('klik', data), Parent @klik="handler".

SOAL 3: Default object props harus?
JAWABAN: Factory function () => ({}) — bukan object langsung.

SOAL 4: v-model komponen butuh props & emit apa?
JAWABAN: props 'modelValue' + emit 'update:modelValue'.
```

---

## 🔐 21. Props Validation: Type Coercion & Parsing

Vue **tidak** mengubah tipe props secara otomatis (kecuali beberapa kasus Boolean). Berikut perilakunya.

```vue
<script setup>
const props = defineProps({
  // Number: jika parent kirim "42" (string), Vue TIDAK konversi
  // → warning di dev, nilai tetap string
  umur: { type: Number },

  // Boolean: perilaku khusus — "false" atau "" diperlakukan istimewa
  // <Comp disabled />          → disabled = true
  // <Comp :disabled="false" /> → disabled = false
  disabled: { type: Boolean, default: false },

  // Jika butuh konversi, lakukan di computed
})
</script>

<template>
  <!-- ❌ Umur jadi string "42" karena tanpa : -->
  <Child umur="42" />

  <!-- ✅ Umur jadi number 42 -->
  <Child :umur="42" />
</template>
```

> ⚠️ **Boolean attr:** Vue menangani Boolean props secara khusus. Menulis `disabled` tanpa nilai = `true`. Ini mengikuti atribut HTML standar. Jika parent mengirim `:disabled="false"`, maka `false` (bukan string).

---

## 🧬 22. Komunikasi Kompleks: Event Bubbling Manual

Kadang child ingin "meneruskan" event ke atas beberapa level. Lakukan manual dengan emit berantai.

```vue
<!-- Level 3: TombolEdit.vue -->
<script setup>
const emit = defineEmits(['edit'])
// Tombol diklik → emit ke atas
</script>
<template><button @click="emit('edit')">Edit</button></template>

<!-- Level 2: KartuProfil.vue -->
<script setup>
const emit = defineEmits(['edit'])
</script>
<template>
  <div>
    <TombolEdit @edit="emit('edit')" />   <!-- teruskan ke atas -->
  </div>
</template>

<!-- Level 1: App.vue -->
<template>
  <KartuProfil @edit="bukaFormEdit" />    <!-- tangkap di sini -->
</template>
```

> 💡 **Alternatif:** Untuk skenario ini, `provide/inject` (Bab 11) atau Pinia (Bab 19) jauh lebih bersih daripada emit berantai. Gunakan emit berantai hanya untuk 1–2 level.

---

## 📡 23. Event vs Prop Callback (Dua Cara Sama)

Ada dua gaya mengirim aksi ke parent: via `emits` atau via `props` function.

```vue
<!-- GAYA 1: emits (REKOMENDASI) -->
<script setup>
const emit = defineEmits(['submit'])
</script>
<template><button @click="emit('submit')">Kirim</button></template>

<!-- Parent -->
<Form @submit="handleSubmit" />

<!-- GAYA 2: props callback (kurang direkomendasikan, tapi valid) -->
<script setup>
defineProps({ onSubmit: Function })
</script>
<template><button @click="onSubmit()">Kirim</button></template>

<!-- Parent -->
<Form :on-submit="handleSubmit" />
```

| Gaya | Kelebihan | Kekurangan |
| --- | --- | --- |
| `emits` | Eksplisit, terlihat di template `@submit` | Sedikit lebih verbose |
| `props callback` | Singkat | Tidak terlihat sebagai "event", sulit dilacak |

> 💡 **Rekomendasi:** Gunakan **`emits`** untuk event (aksi user). Gunakan **`props`** murni untuk data. Hindari `props` berupa function kecuali benar-benar perlu (seperti `onClose` di library).

---

## 🧪 24. Contoh Lengkap: Form Login dengan Validasi & Emit

```vue
<!-- LoginForm.vue (Child) -->
<script setup>
import { ref, computed } from 'vue'

const email = ref('')
const sandi = ref('')

// Validasi computed (lokal)
const emailError = computed(() => {
  if (!email.value) return 'Email wajib diisi'
  if (!/^\S+@\S+\.\S+$/.test(email.value)) return 'Format email salah'
  return ''
})

const sandiError = computed(() => {
  if (sandi.value.length < 6) return 'Minimal 6 karakter'
  return ''
})

const isValid = computed(() => !emailError.value && !sandiError.value)

const emit = defineEmits(['submit', 'batal'])

function kirim() {
  if (!isValid.value) return       // jangan emit kalau invalid
  emit('submit', { email: email.value, sandi: sandi.value })
}
</script>

<template>
  <form @submit.prevent="kirim">
    <div>
      <input v-model="email" type="email" placeholder="Email" />
      <small v-if="emailError" class="error">{{ emailError }}</small>
    </div>
    <div>
      <input v-model="sandi" type="password" placeholder="Sandi" />
      <small v-if="sandiError" class="error">{{ sandiError }}</small>
    </div>
    <button type="submit" :disabled="!isValid">Masuk</button>
    <button type="button" @click="emit('batal')">Batal</button>
  </form>
</template>
```

```vue
<!-- Parent -->
<script setup>
import LoginForm from './LoginForm.vue'

function handleSubmit(payload) {
  console.log('Login:', payload)   // { email, sandi }
  // panggil API login di sini
}
</script>

<template>
  <LoginForm @submit="handleSubmit" @batal="tutup" />
</template>
```

> 🎯 **Pola profesional:** Validasi di child (karena tahu state input), emit payload bersih ke parent yang bertugas memanggil API. Tanggung jawab terpisah rapi.

---

## 📖 25. Glosarium Props & Emits

| Istilah | Arti |
| --- | --- |
| **Props** | Data yang dikirim Parent → Child (read-only di child) |
| **One-way data flow** | Data ke bawah (props), event ke atas (emits) |
| **`defineProps`** | Deklarasi props di `<script setup>` |
| **`required`** | Props wajib dikirim parent (else warning) |
| **`default`** | Nilai cadangan jika props tidak dikirim |
| **Factory default** | `() => ({})` untuk object/array agar tiap instance dapat copy sendiri |
| **`validator`** | Fungsi validasi kustom (warning di dev) |
| **Emits** | Event yang dikirim Child → Parent |
| **`defineEmits`** | Deklarasi event di `<script setup>` |
| **Payload** | Data yang dibawa saat emit (`emit('x', data)`) |
| **Event modifier** | `.stop`, `.prevent`, `.self`, `.once` pada listener |
| **`v-model` komponen** | `modelValue` props + `update:modelValue` emit |
| **Props drilling** | Meneruskan props melewati banyak level (hindari) |
| **`defineExpose`** | Mengekspos method child ke parent via ref |

---

## 🔭 26. Melihat ke Depan

Komunikasi komponen adalah keterampilan inti yang akan kamu gunakan di seluruh buku:

- **Bab 8 (Slots):** Melengkapi props — bukan data, tapi konten/markup.
- **Bab 9 (Lifecycle):** Saat child di-unmount, pastikan emit tidak memicu parent yang sudah hilang (cleanup penting).
- **Bab 11 (provide/inject):** Alternatif untuk menghindari props drilling.
- **Bab 19 (Pinia):** State global untuk komunikasi lintas komponen skala besar.

> 💡 **Ingat selalu:** Props turun, emits naik. Jaga aliran satu arah ini, dan aplikasimu akan mudah di-debug meski tumbuh besar.

---

## 🎯 26. Quiz Singkat Props & Emits

```
1. Arah data props? → Parent → Child (ke bawah).
2. Arah event emits? → Child → Parent (ke atas).
3. Boleh ubah props di child? → TIDAK (read-only).
4. Default object props harus? → factory () => ({}).
5. Boolean shorthand <Comp aktif /> artinya? → :aktif="true".
6. v-model komponen butuh? → modelValue props + update:modelValue emit.
7. Event modifier .stop berguna untuk? → hentikan propagasi klik ke parent.
8. Props drilling itu? → meneruskan props melewati banyak level (hindari).
9. validator dipakai untuk? → validasi kustom (warning di dev).
10. defineExpose untuk? → ekspos method child ke parent via ref.
```

---

## 🗂️ 27. Contoh Mini: Komponen Tabs (Props + Emits)

Contoh nyata penggunaan props & emits untuk navigasi tab.

```vue
<!-- Tabs.vue (Parent controller) -->
<script setup>
import { ref } from 'vue'
import TabPane from './TabPane.vue'

const tabAktif = ref('profil')
const daftarTab = [
  { id: 'profil', label: 'Profil' },
  { id: 'pengaturan', label: 'Pengaturan' },
  { id: 'bantuan', label: 'Bantuan' },
]
</script>

<template>
  <div class="tabs">
    <!-- Kirim props active + emit change -->
    <button
      v-for="tab in daftarTab"
      :key="tab.id"
      :class="{ aktif: tabAktif === tab.id }"
      @click="tabAktif = tab.id"
    >
      {{ tab.label }}
    </button>

    <TabPane :nama="tabAktif">
      <p v-if="tabAktif === 'profil'">Ini konten profil.</p>
      <p v-else-if="tabAktif === 'pengaturan'">Ini konten pengaturan.</p>
      <p v-else>Ini konten bantuan.</p>
    </TabPane>
  </div>
</template>
```

```vue
<!-- TabPane.vue (Child) -->
<script setup>
defineProps({ nama: String })
</script>
<template>
  <div class="tab-pane">
    <slot />   <!-- konten dari parent -->
  </div>
</template>
```

> 💡 **Pelajaran:** `tabAktif` (ref di parent) dikirim ke `TabPane` via props `nama`. Mengubah `tabAktif` otomatis memicu update child. One-way data flow terlihat jelas.

---

## 📝 Ringkasan Bab 7

| Konsep | Penjelasan |
| --- | --- |
| **One-way data flow** | Data ke bawah (props), event ke atas (emits) |
| **`defineProps`** | Deklarasi props di `<script setup>` |
| **Validasi `type`** | `String, Number, Boolean, Array, Object, Function, Date, ...` |
| **`required`** | Parent wajib kirim props ini |
| **`default`** | Nilai cadangan jika tidak dikirim |
| **Factory default** | Object/Array default harus `() => (...)` |
| **Boolean shorthand** | `<Card is-loading />` = `:is-loading="true"` |
| **`validator`** | Fungsi validasi kustom (warning di dev) |
| **Jangan ubah props** | Props read-only di child → emit atau salin ke local |
| **`defineEmits`** | Deklarasi event yang di-emit child |
| **`emit('nama', payload)`** | Kirim event + data ke parent |
| **`@nama="handler"`** | Parent mendengarkan event child |
| **Event modifiers** | `.stop`, `.prevent`, `.self`, `.once`, dll |
| **`v-model` komponen** | `modelValue` props + `update:modelValue` emit |
| **Multiple `v-model`** | `v-model:nama="x"` untuk banyak binding |

---

## 🎯 Latihan Mandiri

**⭐ Latihan 1 — Card Sederhana dengan Props**
Buat `ProfilCard` yang menerima props `nama` (required String), `umur` (Number default 0), `bio` (String default '-'), dan `isOnline` (Boolean default false). Tampilkan dengan badge online/offline. Gunakan di parent dengan 3 data berbeda.

**⭐⭐ Latihan 2 — Validasi Props & Emits**
Buat `TombolNilai` dengan props `label` (String), `nilai` (Number, validator 0–100), dan `warna` (String validator ['merah','hijau','biru']). Emit event `klik` membawa `nilai`. Di parent tampilkan total dari semua klik.

**⭐⭐⭐ Latihan 3 — Form Input Kustom dengan `v-model`**
Buat `TextField` yang mendukung `v-model` (melalui `modelValue` + `update:modelValue`) dengan props tambahan `label` dan `error`. Di parent, gunakan 2 `TextField` (nama & email) dan tampilkan nilainya live + validasi error sederhana.

**⭐⭐⭐⭐ Latihan 4 — Sistem Watchlist (Integrasi Penuh)**
Buat `MovieCard` (props: `film` object, `inWatchlist` Boolean; emits: `pilih`, `toggle-watchlist`) dan `MovieBrowser` (parent) yang: (1) memegang `films` & `watchlistIds` (array), (2) render grid `MovieCard`, (3) saat `toggle-watchlist` dipicu, update `watchlistIds` dan tampilkan jumlah watchlist, (4) saat `pilih` dipicu, tampilkan detail film di panel samping. Gunakan `<style scoped>` dan event `.stop` pada tombol agar tidak memicu `pilih`.

---

*Lanjut ke ➡️ **Bab 8 — 🎰 Slots***
