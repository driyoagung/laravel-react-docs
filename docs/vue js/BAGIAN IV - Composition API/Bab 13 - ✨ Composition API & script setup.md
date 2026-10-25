# ✨ Bab 13 — Composition API & `<script setup>`

> *"Di mana Options API menyuruhmu memecah logika berdasarkan apa yang kamu gunakan, Composition API menyuruhmu memecahnya berdasarkan apa yang logikamu lakukan. Dan begitulah kode besar akhirnya bisa dibaca manusia."*

---

> **🧠 Apa Itu Composition API?**
>
> Composition API adalah **kumpulan fungsi** yang disediakan Vue 3 untuk mendefinisikan logika komponen berdasarkan **fitur**, bukan berdasarkan **tipe**. Alih-alih menulis `data()`, `methods`, `computed`, dan `watch` di blok terpisah (gaya Options API), kamu menulis semuanya dalam satu ruang logika yang bebas — menggunakan fungsi seperti `ref()`, `reactive()`, `computed()`, `watch()`, dan *lifecycle hook* seperti `onMounted()`.
>
> Dan `<script setup>` adalah **gula sintaksis** (syntax sugar) di atas Composition API: cara paling ringkas dan direkomendasikan untuk menuliskannya di dalam file `.vue`. Semua yang dideklarasikan di dalamnya otomatis tersedia di template — tanpa `return` manual.

---

> **🏗️ Analogi Sederhana:**
>
> Bayangkan Options API seperti lemari arsip kantor lama: ada *laci khusus* untuk "Data" (data), *laci khusus* untuk "Fungsi" (methods), *laci khusus* untuk "Perhitungan" (computed). Kalau kamu punya satu fitur "cari film", potongan-potongannya tersebar di tiga laci berbeda — untuk memahami satu fitur, kamu harus buka tutup banyak laci.
>
> Composition API seperti meja kerja modern: kamu susun **seluruh alat untuk satu proyek** di satu tempat. Fitur "cari film" duduk bersebelahan: state-nya, fungsinya, dan perhitungannya. Lalu meja kerja itu bisa kamu *angkat* utuh dan pindahkan ke ruangan lain (itulah *composable* di Bab 14).

---

## 📋 Daftar Isi Bab 13

1. Mengapa Composition API Diciptakan?
2. Perbandingan Options API vs Composition API
3. `<script setup>` — Cara Modern yang Direkomendasikan
4. Anatomi Lengkap File `.vue` dengan `<script setup>`
5. `ref()` — Pembungkus Nilai Reaktif
6. `reactive()` — Untuk Object & Array
7. Tabel Perbandingan `ref` vs `reactive`
8. Mengapa Harus `.value`? (Penjelasan Mendalam)
9. Auto-unwrap di Template
10. `toRef()` & `toRefs()` — Destrukturisasi Reaktif
11. Perbedaan `toRef`, `toRefs`, dan Destrukturisasi Biasa
12. `isRef()`, `unref()`, dan Helper Lainnya
13. Komposisi Logika Berdasarkan Fitur
14. 🎬 Studi Kasus: Komponen Pencarian Film Lengkap
15. 🔧 `defineProps` & `defineEmits` — Lebih Dalam
16. 🔓 `defineExpose` — Mengekspos ke Parent
17. 🧩 `useSlots` & `useAttrs` — Akses Slot & Atribut
18. 🎯 Template Refs — Mengakses DOM & Child
19. 🟦 `<script setup>` + TypeScript
20. 🔬 Bagaimana Reaktivitas Bekerja (Getter/Setter)
21. 🚨 Jebakan Umum Pemula di Bab 13
22. 📝 Ringkasan Bab 13
23. 🎯 Latihan Mandiri

---

## 🔬 1. Mengapa Composition API Diciptakan?

Sebelum kita menulis satu baris pun, penting memahami **masalah** yang ingin diselesaikan Vue. Composition API bukan sekadar "cara baru" — ia lahir dari kelemahan nyata Options API saat aplikasi membesar.

Mari lihat kembali ilustrasi dari Bab 12 (migrasi mindset). Bayangkan sebuah komponen `BrowseView` yang punya tiga fitur: pencarian, filter genre, dan watchlist.

```javascript
// ❌ OPSIONS API: logika setiap fitur TERSEBAR di banyak blok
export default {
  data() {
    return {
      // Fitur A 🔴 — pencarian
      keywordCari: '',
      hasilCarian: [],
      // Fitur B 🔵 — filter genre
      genreDipilih: '',
      daftarGenre: [],
      // Fitur C 🟢 — watchlist
      watchlist: [],
      isWatchlistTerbuka: false,
    }
  },
  methods: {
    // Fitur A 🔴
    async cariFilm() { /* ... */ },
    resetCarian() { /* ... */ },
    // Fitur B 🔵
    filterGenre() { /* ... */ },
    ambilGenre() { /* ... */ },
    // Fitur C 🟢
    tambahWatchlist() { /* ... */ },
    hapusWatchlist() { /* ... */ },
  },
  computed: {
    // Masih Fitur A 🔴
    hasilFiltered() { /* ... */ },
  },
  watch: {
    // Masih Fitur B 🔵
    genreDipilih() { /* ... */ },
  },
}
```

Perhatikan: **satu fitur "cari film"** (`keywordCari`, `hasilCarian`, `cariFilm`, `resetCarian`, `hasilFiltered`) tersebar di empat blok berbeda. Kalau ada bug di pencarian, kamu harus lompat-lompat antara `data`, `methods`, dan `computed`. Di komponen yang punya 10 fitur, ini jadi neraka untuk di-debug.

Composition API memecahkan ini dengan membiarkanmu **menulis logika satu fitur di satu tempat**. Dan, yang lebih penting, **memindahkannya ke file terpisah** (composable) tanpa mengubah struktur komponen. Itulah jawaban mengapa ia diciptakan.

> 💡 **Catatan Penting — Options API Belum Mati!**
>
> Vue 3 **masih mendukung penuh** Options API. Banyak kode produksi dan tutorial lama masih menggunakannya. Composition API bukan pengganti yang "membunuh" Options API — ia hanya **cara tambahan** yang lebih baik untuk komponen kompleks. Di bab ini dan seterusnya, kita pakai Composition API karena itulah yang dipakai di project Netflix-clone. Tapi kalau kamu lebih nyaman dengan Options API untuk komponen sederhana, silakan.

---

## ⚖️ 2. Perbandingan Options API vs Composition API

Mari bandingkan dua gaya secara langsung pada komponen yang sama: sebuah counter sederhana.

```vue
<!-- ══════════════════════════════════════════════
     CARA 1: OPTIONS API (klasik)
     Logika dibagi berdasarkan TIPE: data, methods
     ══════════════════════════════════════════════ -->
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  // State dideklarasikan di dalam data()
  data() {
    return {
      hitungan: 0,
    }
  },
  // Method dideklarasikan di dalam methods
  methods: {
    tambah() {
      this.hitungan++            // akses state via this.hitungan
    },
    reset() {
      this.hitungan = 0
    },
  },
})
</script>

<template>
  <p>{{ hitungan }}</p>
  <button @click="tambah">+1</button>
  <button @click="reset">Reset</button>
</template>
```

```vue
<!-- ══════════════════════════════════════════════
     CARA 2: COMPOSITION API + <script setup> (modern)
     Logika ditulis bebas, berdasarkan FITUR
     ══════════════════════════════════════════════ -->
<script setup>
import { ref } from 'vue'

// State DAN method berdampingan — satu fitur, satu tempat
const hitungan = ref(0)

function tambah() {
  hitungan.value++              // akses state via .value
}

function reset() {
  hitungan.value = 0
}
</script>

<template>
  <p>{{ hitungan }}</p>
  <button @click="tambah">+1</button>
  <button @click="reset">Reset</button>
</template>
```

### 📊 Tabel Perbandingan Fitur

| Aspek | Options API | Composition API (`<script setup>`) |
| --- | --- | --- |
| **Cara deklarasi** | `data()`, `methods`, `computed` terpisah | Semua di satu blok `<script setup>` |
| **Akses state** | `this.namaState` | `namaState.value` (di script) / `namaState` (di template) |
| **Konsep `this`** | Wajib paham `this` (sering membingungkan) | Tidak ada `this` sama sekali |
| **Pengelompokan logika** | Berdasarkan tipe (data/method/computed) | Berdasarkan fitur |
| **Reuse logika** | Mixins (rentan konflik nama) | Composables (aman, terisolasi) |
| **TypeScript** | Dukungan terbatas di `this` | Dukungan penuh & alami |
| **Boilerplate** | Cukup banyak (`export default`, blok berganda) | Sangat ringkas |
| **Rekomendasi** | ❌ Untuk komponen sederhana/legacy | ✅ Standar modern — gunakan selalu |

> 🎯 **Kesimpulan:** Untuk komponen kecil, Options API cukup enak dibaca. Tapi begitu komponen punya banyak fitur (seperti halaman Browse Netflix), Composition API menang telak karena logika tiap fitur bisa dijaga tetap berdekatan dan diekstrak ke composable.

---

## ✨ 3. `<script setup>` — Cara Modern yang Direkomendasikan

`<script setup>` adalah **syntax sugar** untuk Composition API. Artinya: cara singkat menulis `setup()` tanpa boilerplate `export default` dan `return`.

### ❌ Cara lama: `setup()` function murni

```vue
<!-- ❌ Cara lama dengan setup() function -->
<script>
import { ref } from 'vue'

export default {
  // Semua logika harus ada di dalam fungsi setup()
  setup() {
    const hitungan = ref(0)

    function tambah() {
      hitungan.value++                 // ubah via .value
    }

    // ⚠️ WAJIB di-return satu per satu agar bisa dipakai di template!
    return { hitungan, tambah }
  }
}
</script>

<template>
  <p>{{ hitungan }}</p>
  <button @click="tambah">+1</button>
</template>
```

Perhatikan baris `return { hitungan, tambah }`. **Setiap** variabel atau method yang ingin dipakai di `<template>` harus di-return manual. Kalau ada 20 state dan 15 method, ya kamu tulis 35 baris return. Membosankan, rawan lupa, dan kalau ada yang kelewat, template akan error "undefined".

### ✅ Cara modern: `<script setup>`

```vue
<!-- ✅ Cara modern dengan <script setup> -->
<script setup>
import { ref } from 'vue'

// Cukup deklarasikan — langsung bisa dipakai di template!
const hitungan = ref(0)

function tambah() {
  hitungan.value++
}

function reset() {
  hitungan.value = 0
}
// Tidak ada return. Tidak ada export default.
</script>

<template>
  <p>{{ hitungan }}</p>
  <button @click="tambah">+1</button>
  <button @click="reset">Reset</button>
</template>
```

Semua variabel dan fungsi yang dideklarasikan di dalam `<script setup>` **otomatis terekspos ke template**. Vue melakukan ini saat kompilasi — kita tidak perlu repot.

### 💡 Keuntungan `<script setup>`

> 💡 **Keuntungan Utama:**
>
> 1. **Lebih ringkas** — tidak ada `export default { }` dan `return { }`.
> 2. **Tidak perlu `return` manual** — deklarasi langsung tersedia di template.
> 3. **Performa lebih baik** — Vue mengkompilasinya ke kode yang lebih optimal karena tahu persis apa yang dibutuhkan template.
> 4. **Dukungan `<style>` yang lebih baik** — bisa dipakai bersama `v-bind` dinamis.
> 5. **Ini cara yang direkomendasikan** oleh tim Vue resmi untuk project baru.

> ⚠️ **Catatan:** `<script setup>` **hanya boleh ada satu** di dalam file `.vue`. Kalau kamu butuh blok `<script>` biasa (misal untuk `export default` metadata seperti `name`), kamu bisa menuliskannya **berdampingan** dengan `<script setup>` — tapi kasus ini jarang dibutuhkan.

```vue
<!-- ✅ Boleh ada <script> biasa BERSELINGAN dengan <script setup> -->
<script>
// Contoh: memberi nama eksplisit untuk Vue DevTools / recursive component
export default {
  name: 'KomponenFilmKhusus',
}
</script>

<script setup>
// Logika komponen di sini
import { ref } from 'vue'
const judul = ref('Contoh')
</script>
```

---

## 🔬 4. Anatomi Lengkap File `.vue` dengan `<script setup>`

Mari kita lihat struktur lengkap sebuah Single File Component (SFC) modern, bagian per bagian.

```vue
<!-- ════════════════════════════════════════════════════════
     MovieCard.vue — Struktur lengkap SFC Composition API
     ════════════════════════════════════════════════════════ -->

<!-- ① TEMPLATE: Tampilan HTML komponen -->
<template>
  <article class="movie-card">
    <!-- Interpolasi teks -->
    <h3>{{ film.title }}</h3>

    <!-- Binding atribut dengan : (v-bind) -->
    <img :src="posterUrl" :alt="film.title" />

    <!-- Event handler dengan @ (v-on) -->
    <button @click="tambahKeWatchlist">➕ Simpan</button>
  </article>
</template>

<!-- ② SCRIPT SETUP: Logika JavaScript komponen -->
<script setup>
// ── IMPORTS ──
// Semua yang dibutuhkan diimpor di atas
import { ref, computed, onMounted } from 'vue'
import { useWatchlistStore } from '@/stores/watchlistStore'

// ── STATE (ref / reactive) ──
const isHovered = ref(false)          // state lokal sederhana

// ── PROPS & EMITS ──
// defineProps & defineEmits adalah compiler macro — tidak perlu import!
const props = defineProps({
  film: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['simpan'])

// ── COMPUTED ──
const posterUrl = computed(() => {
  // Computed bisa dipakai langsung di template (auto-unwrap)
  return `https://image.tmdb.org/t/p/w300${props.film.poster_path}`
})

// ── METHODS ──
function tambahKeWatchlist() {
  emit('simpan', props.film.id)
}

// ── LIFECYCLE ──
onMounted(() => {
  console.log('MovieCard terpasang:', props.film.id)
})
</script>

<!-- ③ STYLE: CSS khusus komponen (scoped = tidak bocor ke luar) -->
<style scoped>
.movie-card {
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease;
}
.movie-card:hover {
  transform: scale(1.05);
}
</style>
```

**Poin penting dari anatomi di atas:**

```
┌─────────────────────────────────────────────────────┐
│ <template>  → Wajib ada. Satu atau lebih elemen root. │
│ <script setup> → Logika: state, props, computed, dll. │
│ <style scoped> → CSS yang HANYA berlaku komponen ini. │
└─────────────────────────────────────────────────────┘
```

> 💡 **Tentang `defineProps` & `defineEmits`:** Keduanya adalah **compiler macro** — artinya Vue mengenalinya secara khusus saat kompilasi. Kamu **tidak perlu** mengimpornya dari `'vue'`, dan kamu **tidak bisa** menggunakannya di dalam fungsi biasa (harus di level atas `<script setup>`). Ini berbeda dengan `ref`, `computed`, dll yang harus diimpor.

---

## 🔴 5. `ref()` — Pembungkus Nilai Reaktif

`ref()` adalah "reactive reference" — sebuah pembungkus (wrapper) yang membuat **nilai apa pun** menjadi reaktif. Ia paling sering dipakai untuk nilai primitif: `string`, `number`, `boolean`.

```vue
<script setup>
import { ref } from 'vue'

// ① ref() untuk number (counter)
const hitungan = ref(0)

// ② ref() untuk string (judul film)
const judulFilm = ref('Interstellar')

// ③ ref() untuk boolean (status loading)
const isLoading = ref(false)

// ④ ref() bahkan bisa membungkus object/array juga!
const film = ref({
  judul: 'Dune',
  tahun: 2021,
})
</script>
```

### Mengubah nilai `ref` di JavaScript

Di dalam `<script>`, kamu **selalu** akses nilai aslinya lewat properti `.value`:

```vue
<script setup>
import { ref } from 'vue'

const hitungan = ref(0)

// ✅ Cara BENAR mengubah nilai ref di JavaScript:
hitungan.value++              // menjadi 1
hitungan.value = 10           // menjadi 10

const judulFilm = ref('Interstellar')
judulFilm.value = 'Dune'      // ganti nilai
judulFilm.value = judulFilm.value.toUpperCase() // 'DUNE'

const isLoading = ref(false)
isLoading.value = true         // ubah boolean
</script>
```

```vue
<script setup>
// ❌ CARA SALAH — lupa menulis .value
const hitungan = ref(0)
hitungan++          // ❌ Tidak melakukan apa-apa yang diharapkan!
hitungan = 5        // ❌ Error: tidak bisa assign ke const ref
</script>
```

> ⚠️ **Mengapa `.value`?** Karena `ref()` sebenarnya mengembalikan sebuah **objek** `{ value: ... }`. Di balik layar, Vue memasang *getter/setter* pada `.value` tersebut supaya setiap perubahan terdeteksi. Jadi `hitungan` bukan angka — ia adalah objek pembungkus yang menyimpan angka di `.value`-nya.

---

## 🔵 6. `reactive()` — Untuk Object & Array

`reactive()` membuat **object atau array** menjadi reaktif secara langsung, tanpa perlu `.value`. Cocok untuk kumpulan data yang saling berkaitan.

```vue
<script setup>
import { reactive } from 'vue'

// ① reactive() untuk object — akses langsung tanpa .value
const film = reactive({
  id:     1,
  judul:  'Interstellar',
  rating: 8.6,
  tags:   ['sci-fi', 'drama'],
})

// Ubah property langsung:
film.judul = 'Dune'           // ✅ langsung
film.rating = 9.0
film.tags.push('thriller')    // ✅ array di dalamnya ikut reaktif

// ② reactive() untuk array
const daftarFilm = reactive([
  { id: 1, title: 'Inception' },
  { id: 2, title: 'Tenet' },
])

// Mutasi array bekerja seperti array biasa:
daftarFilm.push({ id: 3, title: 'Oppenheimer' })
daftarFilm[0].title = 'Inception (Director Cut)'
</script>
```

> 💡 **Panduan Sederhana (dari Bab 5):**
> - Nilai tunggal (angka, teks, boolean) → pakai **`ref()`**
> - Object atau array → pakai **`reactive()`**
> - Masih bingung? Pakai **`ref()` untuk segalanya** — lebih konsisten karena semuanya pakai `.value`.
>
> Banyak developer Vue profesional justru **hanya pakai `ref()`** di seluruh project mereka, termasuk untuk object (`const film = ref({...})`), demi konsistensi. Itu sah-sah saja!

---

## 📊 7. Tabel Perbandingan `ref` vs `reactive`

| Fitur | `ref(x)` | `reactive(obj)` |
| --- | --- | --- |
| **Cocok untuk** | Nilai primitif **atau** object/array | Hanya object/array |
| **Akses di JS** | `x.value` | `obj.prop` |
| **Akses di template** | `x` (auto-unwrap) | `obj.prop` |
| **Reassign variabel** | ✅ Bisa: `x.value = nilaiBaru` | ❌ Tidak bisa ganti seluruh object |
| **Destrukturisasi** | Tetap reaktif jika pakai `toRefs` | Kehilangan reaktivitas jika destructure biasa |
| **Dibungkus** | Ya (objek `{ value }`) | Tidak (proxy langsung) |

```vue
<script setup>
import { ref, reactive } from 'vue'

// ── ref dengan object ──
const user = ref({ nama: 'Budi', umur: 25 })
// Bisa ganti SELURUH object:
user.value = { nama: 'Ani', umur: 30 }   // ✅ aman dengan ref

// ── reactive dengan object ──
const user2 = reactive({ nama: 'Budi', umur: 25 })
// TIDAK bisa ganti seluruh object:
// user2 = { nama: 'Ani' }   // ❌ ini akan putus reaktivitas!
// Tapi bisa ubah property:
user2.nama = 'Ani'                         // ✅ aman
</script>
```

> ⚠️ **Perbedaan Krusial — Reassign:**
> Dengan `ref`, kamu bisa mengganti **seluruh** nilainya via `.value`. Dengan `reactive`, kamu **tidak boleh** mengassign ulang variabelnya (karena `reactive` mengikat proxy ke referensi object asli). Kamu hanya boleh mengubah *property* di dalamnya. Inilah alasan banyak orang lebih suka `ref`.

---

## 🧩 8. Mengapa Harus `.value`? (Penjelasan Mendalam)

Pertanyaan paling sering dari pemula: *"Kenapa Vue tidak saja otomatis saja? Kenapa harus `.value`?"*

Jawabannya ada dua lapis:

**Lapis 1 — Teknis.** JavaScript tidak punya cara untuk membuat sebuah *variabel primitif* (seperti `let x = 0`) menjadi "terobservasi" saat nilainya berubah. Variabel primitif disalin berdasarkan nilai, bukan referensi. Maka Vue membungkusnya dalam **object** `{ value: 0 }`. Karena object bisa diawasi lewat `Proxy`, Vue bisa mendeteksi `x.value = 5` dan memicu update tampilan.

```javascript
// Mental model ref():
const hitungan = ref(0)
// di balik layar kira-kira seperti:
const hitungan = {
  value: 0,
  // Vue pasang getter/setter di sini agar perubahan terdeteksi
  get value() { /* beri tahu Vue */ return _nilai },
  set value(v) { _nilai = v; /* picu re-render */ },
}
```

**Lapis 2 — Praktis.** Kehadiran `.value` memberi **kejelasan** di kode JavaScript: saat kamu melihat `x.value`, kamu tahu `x` adalah sesuatu yang reaktif. Tanpa `.value`, sulit membedakan variabel biasa vs reaktif saat membaca kode panjang.

> 💡 **Aturan Emas:** Di dalam `<script>` → selalu `.value`. Di dalam `<template>` → **tidak usah** `.value` (Vue membukanya otomatis). Pelanggaran aturan ini adalah sumber 80% bug pemula di Composition API.

---

## 🪄 9. Auto-unwrap di Template

Vue **otomatis membuka** (unwrap) `.value` dari sebuah `ref` saat ia muncul di template. Ini disebut *auto-unwrap*.

```vue
<script setup>
import { ref } from 'vue'

const hitungan = ref(10)
const judul    = ref('Interstellar')
</script>

<template>
  <!-- ✅ Tulis TANPA .value — Vue otomatis membukanya -->
  <p>Hitungan: {{ hitungan }}</p>
  <p>Judul: {{ judul }}</p>

  <!-- ✅ Bisa dipakai langsung di ekspresi -->
  <p>{{ hitungan * 2 }}</p>
  <p>{{ judul.toUpperCase() }}</p>

  <!-- ❌ JANGAN tulis .value di template -->
  <p>{{ hitungan.value }}</p>   <!-- ❌ akan tampil "undefined" -->
</template>
```

### Kapan auto-unwrap berlaku & tidak berlaku?

Auto-unwrap berlaku di dua tempat:
1. **Top-level ref di template** — ref yang dideklarasikan langsung di `<script setup>` dan dipakai langsung di template.
2. **Ref yang menjadi property object `reactive`** — ref di dalam `reactive` **juga** di-unwrap, jadi `state.count` langsung berupa nilai, bukan ref.

```vue
<script setup>
import { ref, reactive } from 'vue'

const hitungan = ref(0)

// ref sebagai property reactive → auto-unwrap BERLAKU
const state = reactive({
  count: hitungan,
})

console.log(state.count)     // ✅ 0  (sudah ter-unwrap, bukan ref lagi)
state.count = 5              // ✅ setara dengan hitungan.value = 5
// state.count.value         // ❌ undefined — state.count bukan ref!
</script>

<template>
  <p>{{ state.count }}</p>   <!-- ✅ tampil 5 -->
</template>
```

Pengecualian di mana auto-unwrap **tidak** berlaku: ref yang disimpan di dalam **array, Map, atau Set reaktif** — di sana ia tetap berupa ref dan butuh `.value`.

```vue
<script setup>
import { ref, reactive } from 'vue'

const a = ref(1)
const b = ref(2)
const list = reactive([a, b])

console.log(list[0])        // ⚠️ RefImpl, BUKAN angka 1
console.log(list[0].value)  // ✅ 1 — butuh .value manual
</script>
```

> ⚠️ **Aturan praktis:** Auto-unwrap berlaku untuk **top-level ref** (dipakai langsung di template) dan **property ref pada object `reactive`**. Tapi **tidak** berlaku untuk ref yang berada di dalam array, Map, atau Set — di sana kamu tetap perlu `.value`. Untuk pemula, aturan paling aman: **di template, top-level ref tulis tanpa `.value`.**

---

## 🔄 10. `toRef()` & `toRefs()` — Destrukturisasi Reaktif

Ini bagian yang **paling sering membingungkan** pemula. Mari kita bedah pelan-pelan.

### ❌ Masalah: destrukturisasi biasa memutus reaktivitas

```vue
<script setup>
import { reactive } from 'vue'

const film = reactive({
  judul:  'Interstellar',
  tahun:  2014,
  rating: 8.6,
})

// ❌ Destrukturisasi biasa — MENGHANCURKAN reaktivitas!
const { judul } = film
// 'judul' hanya menyalin NILAI 'Interstellar' ke variabel baru.
// Ia TIDAK lagi terikat ke film.judul.

film.judul = 'Dune'      // ubah di sumber
console.log(judul)       // masih 'Interstellar' — TIDAK ikut berubah! 🐛
</script>
```

Kenapa? `const { judul } = film` hanya menyalin **nilai** `'Interstellar'` ke variabel lokal. Ia memutus hubungan dengan object `film`. Kalau `film.judul` berubah nanti, `judul` lokal tidak ikut berubah. Ini **bug halus**: tampilan tidak update, tapi kode tidak error — jadi sulit dilacak.

### ✅ Solusi 1: `toRefs()` — untuk semua property

`toRefs()` mengubah **setiap property** dari object reactive menjadi `ref` individu yang **tetap terikat** ke object aslinya.

```vue
<script setup>
import { reactive, toRefs } from 'vue'

const film = reactive({
  judul:  'Interstellar',
  tahun:  2014,
  rating: 8.6,
})

// ✅ toRefs() — destrukturisasi DENGAN reaktivitas
const { judul, tahun, rating } = toRefs(film)
// Sekarang judul, tahun, rating masing-masing adalah ref

film.judul = 'Dune'       // ubah di sumber
console.log(judul.value)  // 'Dune' ✅ ikut berubah!

// Ubah dari sisi ref juga memengaruhi sumber:
judul.value = 'Tenet'
console.log(film.judul)   // 'Tenet' ✅ dua arah!
</script>
```

### ✅ Solusi 2: `toRef()` — untuk satu property saja

Kalau kamu hanya butuh **satu** property, pakai `toRef(obj, 'namaProperty')`.

```vue
<script setup>
import { reactive, toRef } from 'vue'

const film = reactive({
  judul:  'Interstellar',
  tahun:  2014,
  rating: 8.6,
})

// ✅ toRef() — buat ref dari SATU property saja
const rating = toRef(film, 'rating')
// rating adalah ref yang terikat ke film.rating

rating.value = 9.0
console.log(film.rating)   // 9.0 ✅
</script>
```

> 💡 **Kapan pakai yang mana?**
> - Pakai **`toRefs()`** kalau ingin memecah **seluruh** object jadi variabel-variabel terpisah namun tetap reaktif.
> - Pakai **`toRef()`** kalau hanya butuh **satu** property dan ingin menghindari pembuatan ref yang tidak perlu untuk property lain.

---

## 🆚 11. Perbedaan `toRef`, `toRefs`, dan Destrukturisasi Biasa

| Cara | Reaktif? | Akses di JS | Dua arah? |
| --- | --- | --- | --- |
| `const { judul } = film` | ❌ Tidak | `judul` | ❌ Tidak |
| `const { judul } = toRefs(film)` | ✅ Ya | `judul.value` | ✅ Ya |
| `const judul = toRef(film, 'judul')` | ✅ Ya (1 prop) | `judul.value` | ✅ Ya |

```vue
<script setup>
import { reactive, toRef, toRefs } from 'vue'

const film = reactive({ judul: 'Interstellar', tahun: 2014 })

// ① Destrukturisasi biasa → HILANG reaktivitas
const { judul } = film
// judul sekarang string biasa

// ② toRefs → semua jadi ref reaktif
const { judul: j, tahun: t } = toRefs(film)
// j.value dan t.value terikat ke film

// ③ toRef → satu ref reaktif
const judulRef = toRef(film, 'judul')
// judulRef.value terikat ke film.judul
</script>
```

> ⚠️ **Poin Kritis:** `toRef` / `toRefs` **tidak meng-copy nilai** — mereka membuat **"jembatan" (reference)** ke property aslinya. Jadi mengubah `rating.value = 9` akan mengubah `film.rating` juga, dan sebaliknya. Itu sebabnya ia "reaktif dua arah".

### `toRefs` dengan `props` (Sangat Umum!)

Salah satu pemakaian `toRefs` yang paling sering: memecah `props` agar bisa dipakai bebas di composable atau function lain.

```vue
<script setup>
import { toRefs } from 'vue'

const props = defineProps({
  judul: String,
  tahun: Number,
  rating: {
    type: Number,
    default: 0,
  },
})

// ❌ JANGAN: const { judul } = props (props bukan reactive murni,
// tapi destructure biasa tetap memutus reaktivitas pelacakan)
//
// ✅ BENAR: gunakan toRefs agar tiap prop tetap reaktif
const { judul, tahun, rating } = toRefs(props)

// Sekarang judul.value, tahun.value, rating.value bisa dipakai
// di computed/watch composable lain dan tetap update saat parent
// mengirim prop baru.
</script>
```

---

## 🛠️ 12. `isRef()`, `unref()`, dan Helper Lainnya

Vue menyediakan beberapa helper untuk bekerja dengan ref:

```vue
<script setup>
import { ref, reactive, isRef, unref, isReactive, toRef } from 'vue'

const a = ref(10)
const b = reactive({ x: 1 })

// ① isRef() — cek apakah sesuatu adalah ref
console.log(isRef(a))        // true
console.log(isRef(b))        // false

// ② isReactive() — cek apakah sesuatu adalah reactive
console.log(isReactive(a))   // false
console.log(isReactive(b))   // true

// ③ unref() — ambil nilai: jika ref → .value, jika bukan → apa adanya
// Sama seperti: val = isRef(val) ? val.value : val
console.log(unref(a))        // 10  (karena a adalah ref)
console.log(unref(b))        // { x: 1 } (b bukan ref, dikembalikan apa adanya)

// ④ toRef() pada object biasa (non-reactive)
const objBiasa = { nama: 'Budi' }
const namaRef = toRef(objBiasa, 'nama')
// Bahkan object biasa bisa dijadikan ref (berguna untuk konsistensi API)
namaRef.value = 'Ani'
console.log(objBiasa.nama)   // 'Ani' ✅
</script>
```

### Mengapa `unref` berguna?

Saat kamu menulis composable yang menerima parameter yang **mungkin** berupa ref atau nilai biasa, `unref` menyelamatkanmu:

```javascript
// composables/useSomething.js
import { unref } from 'vue'

export function gunakanNilai(input) {
  // input bisa berupa ref ATAU nilai biasa — unref menangani keduanya
  const nilai = unref(input)
  console.log('Nilainya:', nilai)
}

// Penggunaan:
const r = ref(5)
gunakanNilai(r)     // "Nilainya: 5"
gunakanNilai(10)    // "Nilainya: 10"
```

---

## 🧩 13. Komposisi Logika Berdasarkan Fitur

Sekarang kita gabungkan semuanya untuk menunjukkan **kekuatan sebenarnya** Composition API: mengelompokkan logika berdasarkan fitur, bukan tipe.

```vue
<script setup>
import { ref, computed, watch, onMounted } from 'vue'

// ════════════════════════════════════════════════
// FITUR A: Pencarian Film 🔴
// (state, computed, dan watch-nya berdekatan!)
// ════════════════════════════════════════════════
const keyword     = ref('')
const hasilCarian = ref([])

const adaKeyword = computed(() => keyword.value.trim().length > 0)

watch(keyword, async (baru) => {
  if (!baru) { hasilCarian.value = []; return }
  hasilCarian.value = await cariFilm(baru)
})

// ════════════════════════════════════════════════
// FITUR B: Filter Genre 🔵
// (terpisah jauh dari Fitur A secara logis)
// ════════════════════════════════════════════════
const genreDipilih = ref('semua')
const daftarGenre  = ref([])

const genreAktif = computed(() => genreDipilih.value !== 'semua')

// ════════════════════════════════════════════════
// FITUR C: Watchlist 🟢
// (terpisah lagi)
// ════════════════════════════════════════════════
const watchlist = ref([])

function tambahWatchlist(film) {
  watchlist.value.push(film)
}

// Lifecycle bersama
onMounted(() => {
  console.log('Komponen siap — semua fitur aktif')
})
</script>
```

Perhatikan: **tiap fitur memiliki bloknya sendiri** dan tidak tercampur. Kalau nanti Fitur A ingin dipindah ke composable `useSearch`, kamu tinggal "menggunting" blok 🔴 dan menaruhnya di file terpisah. Tidak ada yang tersebar di `data`, `methods`, dan `computed` seperti Options API.

> 💡 **Ini esensi Composition API:** logika diorganisir oleh *makna*, bukan oleh *bentuk sintaksis*. Dan itulah jembatan menuju Bab 14 (Composables), di mana blok 🔴, 🔵, 🟢 itu benar-benar pindah ke file sendiri.

---

## 🎬 14. Studi Kasus: Komponen Pencarian Film Lengkap

Mari kita bangun komponen pencarian film nyata yang menggabungkan `ref`, `computed`, `watch`, dan `toRefs`. Bayangkan ini bagian dari fitur Search di Netflix-clone.

```vue
<!-- SearchBar.vue -->
<script setup>
import { ref, computed, watch } from 'vue'

// ── STATE ──
const keyword     = ref('')        // apa yang diketik user
const hasil       = ref([])        // hasil pencarian
const isLoading   = ref(false)     // sedang memuat?
const errorPesan  = ref('')        // pesan error bila gagal

// ── COMPUTED ──
const jumlahHasil = computed(() => hasil.value.length)

const tampilkanKosong = computed(() => {
  // Tampilkan pesan "tidak ada hasil" hanya bila:
  // - tidak loading
  // - tidak error
  // - sudah pernah mencari (keyword tidak kosong)
  // - hasilnya 0
  return !isLoading.value
      && !errorPesan.value
      && keyword.value.trim() !== ''
      && hasil.value.length === 0
})

// ── WATCH: panggil API tiap keyword berubah ──
watch(keyword, async (kataKunciBaru) => {
  const kata = kataKunciBaru.trim()

  // Kosongkan hasil jika keyword dihapus
  if (kata === '') {
    hasil.value = []
    errorPesan.value = ''
    return
  }

  isLoading.value = true
  errorPesan.value = ''
  try {
    // Simulasi pemanggilan API
    const response = await fetch(
      `https://api.example.com/search?q=${encodeURIComponent(kata)}`
    )
    if (!response.ok) throw new Error('Gagal menghubungi server')
    const data = await response.json()
    hasil.value = data.results
  } catch (err) {
    errorPesan.value = err.message
    hasil.value = []
  } finally {
    isLoading.value = false
  }
})

// ── METHOD ──
function resetPencarian() {
  keyword.value = ''
  hasil.value = []
  errorPesan.value = ''
}
</script>

<template>
  <div class="search-bar">
    <!-- Input pencarian -->
    <input
      v-model="keyword"
      type="text"
      placeholder="Cari film favoritmu..."
      class="input-cari"
    />

    <!-- Status loading -->
    <p v-if="isLoading">⏳ Mencari "{{ keyword }}"...</p>

    <!-- Error -->
    <p v-else-if="errorPesan" class="error">❌ {{ errorPesan }}</p>

    <!-- Kosong -->
    <p v-else-if="tampilkanKosong">📭 Tidak ada film untuk "{{ keyword }}".</p>

    <!-- Hasil -->
    <ul v-else class="daftar-hasil">
      <li v-for="film in hasil" :key="film.id">
        🎬 {{ film.title }} ({{ film.release_date?.slice(0, 4) }})
      </li>
    </ul>

    <!-- Info jumlah -->
    <small v-if="jumlahHasil > 0">Ditemukan {{ jumlahHasil }} film</small>

    <!-- Tombol reset -->
    <button v-if="keyword" @click="resetPencarian">🧹 Reset</button>
  </div>
</template>
```

**Yang dipelajari dari studi kasus ini:**
- `ref` untuk semua state individual (`keyword`, `hasil`, `isLoading`, `errorPesan`).
- `computed` untuk turunan yang bergantung state (`jumlahHasil`, `tampilkanKosong`) — di-cache, tidak dihitung ulang tiap render.
- `watch` untuk efek samping (memanggil API) saat `keyword` berubah.
- `v-if` / `v-else-if` berantai untuk menangani banyak status UI dengan rapi.
- `?.` (optional chaining) untuk mengakses property yang mungkin tidak ada (`release_date`).

---

## 🔧 15. `defineProps` & `defineEmits` — Lebih Dalam

`defineProps` dan `defineEmits` punya dua gaya penulisan: **runtime declaration** (object) dan **type-based declaration** (TypeScript).

### Gaya 1 — Runtime declaration (object)

```vue
<script setup>
// Gaya object — berlaku di JS & TS
const props = defineProps({
  film:    { type: Object, required: true },
  rating:  { type: Number, default: 0 },
  isBaru:  { type: Boolean, default: false },
})

const emit = defineEmits(['simpan', 'tutup'])
</script>
```

### Gaya 2 — Type-based declaration (TypeScript)

```vue
<script setup lang="ts">
// Gaya type — hanya di TS; Vue menggenerasi runtime dari type
const props = defineProps<{
  film: { id: number; title: string }
  rating?: number
  isBaru?: boolean
}>()

const emit = defineEmits<{
  (e: 'simpan', id: number): void
  (e: 'tutup'): void
}>()
</script>
```

### ❌ vs ✅ — Validasi Prop

```js
// ❌ SALAH — lupa validasi, bug sulit dilacak
defineProps({ film: null })   // tidak ada type/required

// ✅ BENAR — beri type & required
defineProps({
  film: { type: Object, required: true },
  rating: { type: Number, default: 0 },
})
```

> 💡 **Tips:** Di JavaScript murni, selalu gunakan runtime declaration dengan `type` + `required`/`default`. Di TypeScript, gaya type lebih ringkas tapi tetap disarankan tambah `required` lewat `?` untuk optional.

### Emit dengan payload

```vue
<script setup>
const emit = defineEmits(['pilih'])

function klik() {
  // ✅ kirim payload ke parent
  emit('pilih', { id: 42, judul: 'Dune' })
}
</script>

<!-- Parent -->
<MovieCard @pilih="tanganiPilih" />
```

---

## 🔓 16. `defineExpose` — Mengekspos ke Parent

Secara default, variabel di `<script setup>` **tidak** terlihat dari parent (encapsulation). Kalau parent butuh memanggil method komponen anak, gunakan `defineExpose`.

```vue
<!-- CounterAnak.vue -->
<script setup>
import { ref } from 'vue'

const count = ref(0)
function reset() { count.value = 0 }
function tambah() { count.value++ }

// Ekspos HANYA yang diinginkan ke parent
defineExpose({ count, reset })
</script>

<template>
  <p>{{ count }}</p>
  <button @click="tambah">+1</button>
</template>
```

```vue
<!-- Parent.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import CounterAnak from './CounterAnak.vue'

// ref ke instance komponen anak
const anakRef = ref(null)

onMounted(() => {
  // akses property yang di-expose
  console.log(anakRef.value.count)   // 0
  anakRef.value.reset()              // panggil method anak
})
</script>

<template>
  <CounterAnak ref="anakRef" />
</template>
```

> ⚠️ **Ingat:** Tanpa `defineExpose`, `anakRef.value` hanya berisi `{ }` kosong. Vue sengaja menyembunyikan internal komponen demi enkapsulasi.

---

## 🧩 17. `useSlots` & `useAttrs` — Akses Slot & Atribut

Kadang kamu butuh mengakses slot atau atribut yang diteruskan ke komponen.

```vue
<script setup>
import { useSlots, useAttrs } from 'vue'

// useSlots: akses konten slot secara progamatik
const slots = useSlots()
console.log(slots.default)   // fungsi render slot default
console.log(slots.header)    // slot bernama 'header'

// useAttrs: atribut HTML yang TIDAK dideklarasikan sebagai prop
const attrs = useAttrs()
console.log(attrs.class)     // misal class dari parent
console.log(attrs.id)        // id dari parent
</script>
```

```vue
<!-- Penggunaan: teruskan attrs ke elemen root manual -->
<template>
  <div v-bind="attrs">
    <slot />
  </div>
</template>
```

> 💡 **Kapan perlu?** Jarang. Vue otomatis meneruskan atribut ke root element (attribute fallthrough). `useAttrs` berguna bila kamu punya **multi-root** template dan perlu mengontrol ke elemen mana atribut jatuh.

---

## 🎯 18. Template Refs — Mengakses DOM & Child

`ref` di template (`ref="nama"`) bukan `ref()` reaktif — ia adalah **reference ke elemen DOM** atau **instance komponen**.

```vue
<script setup>
import { ref, onMounted } from 'vue'

// ref ke elemen <input>
const inputEl = ref(null)
// ref ke instance komponen anak
const childEl = ref(null)

onMounted(() => {
  // fokuskan input saat mount
  inputEl.value?.focus()
  console.log('Instance anak:', childEl.value)
})
</script>

<template>
  <input ref="inputEl" placeholder="Fokus saat mount" />
  <ChildComp ref="childEl" />
</template>
```

> ⚠️ **Template ref vs state ref:** `ref="inputEl"` di template **harus** cocok nama dengan `const inputEl = ref(null)` di script. Setelah mount, `inputEl.value` berisi elemen DOM asli. Sebelum mount, bernilai `null`.

### ❌ vs ✅ — Template Ref

```js
// ❌ SALAH — nama tidak cocok
const el = ref(null)
// <input ref="inputEl" />   ← tidak ada hubungan

// ✅ BENAR — nama sama persis
const inputEl = ref(null)
// <input ref="inputEl" />   ← terikat ✅
```

---

## 🟦 19. `<script setup>` + TypeScript

TypeScript di `<script setup>` sangat mulus. Berikut pola umum:

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

// tipe eksplisit untuk ref
const count = ref<number>(0)
const nama  = ref<string>('')

// interface untuk props
interface Film {
  id: number
  title: string
  rating: number
}

const props = defineProps<{ film: Film }>()

// computed dengan tipe otomatis
const judulBesar = computed(() => props.film.title.toUpperCase())

// function dengan signature jelas
function tambah(n: number): void {
  count.value += n
}
</script>
```

| Keuntungan TS di `<script setup>` | Penjelasan |
| --- | --- |
| Inference otomatis | `count` diketahui `Ref<number>` |
| Autocomplete Volar | Editor tahu tipe prop & method |
| Safe refactoring | Ganti nama prop → error di semua pemakai |
| Tanpa `this` | Tidak ada ambiguitas tipe `this` |

> 🎯 **Rekomendasi:** Untuk project produksi, gunakan TypeScript. `<script setup lang="ts">` adalah pengalaman DX terbaik di Vue 3.

---

## 🔬 20. Bagaimana Reaktivitas Bekerja (Getter/Setter)

Supaya tidak "magis", mari lihat bahwa Vue 3 membungkus object dengan `Proxy`.

```
const state = reactive({ nama: 'Budi' })

// Di balik layar kira-kira:
const state = new Proxy({ nama: 'Budi' }, {
  get(target, key) {
    // Vue catat: "komponen ini sedang membaca state.nama"
    track(target, key)          // daftarkan dependensi
    return target[key]
  },
  set(target, key, value) {
    target[key] = value
    trigger(target, key)        // picu update ke yang membaca
    return true
  }
})
```

```vue
<script setup>
import { reactive, ref } from 'vue'

// reactive → Proxy di atas
const user = reactive({ nama: 'Budi' })
console.log(user.nama)   // get → Vue "track" dependensi
user.nama = 'Ani'        // set → Vue "trigger" re-render

// ref → juga Proxy, tapi di .value
const umur = ref(25)
// membaca umur.value → track
// mengubah umur.value → trigger
</script>
```

> 💡 **Mengapa penting paham ini?** Karena reactive butuh **akses property** untuk "track". Kalau kamu destructure biasa (`const { nama } = user`), kamu menyalin nilai, bukan mengakses property → Vue tidak bisa track → reaktivitas putus. Itulah alasan `toRefs` ada.

---

## 🚨 21. Jebakan Umum Pemula di Bab 13

### ❌ Jebakan 1 — Lupa Menulis `.value` di Script

```vue
<script setup>
import { ref } from 'vue'

const hitungan = ref(0)

// ❌ SALAH — lupa .value
function tambah() {
  hitungan++               // ❌ tidak mengubah nilai ref!
}

// ✅ BENAR
function tambahBenar() {
  hitungan.value++         // ✅ akses via .value
}
</script>
```

> ✅ **Perbaikan:** Selalu ingat aturan: **di `<script>` → `.value`, di `<template>` → tanpa `.value`.**

---

### ❌ Jebakan 2 — Menulis `.value` di Template

```vue
<template>
  <!-- ❌ SALAH — .value di template akan tampil undefined -->
  <p>{{ hitungan.value }}</p>

  <!-- ✅ BENAR — Vue otomatis unwrap -->
  <p>{{ hitungan }}</p>
</template>
```

---

### ❌ Jebakan 3 — Mendestrukturisasi `reactive` Secara Biasa

```vue
<script setup>
import { reactive } from 'vue'

const film = reactive({ judul: 'Interstellar', rating: 8.6 })

// ❌ SALAH — kehilangan reaktivitas
const { judul } = film
film.judul = 'Dune'
console.log(judul)   // masih 'Interstellar' 🐛

// ✅ BENAR — pakai toRefs
import { toRefs } from 'vue'
const { judul: j } = toRefs(film)
film.judul = 'Dune'
console.log(j.value) // 'Dune' ✅
</script>
```

---

### ❌ Jebakan 4 — Mengganti Seluruh Object `reactive`

```vue
<script setup>
import { reactive } from 'vue'

let user = reactive({ nama: 'Budi', umur: 25 })

// ❌ SALAH — reaktivitas PUTUS!
user = { nama: 'Ani', umur: 30 }

// ✅ BENAR — ubah property satu per satu, atau pakai ref
user.nama = 'Ani'          // ✅ aman
user.umur = 30             // ✅ aman

// ATAU gunakan ref sejak awal:
import { ref } from 'vue'
const userRef = ref({ nama: 'Budi', umur: 25 })
userRef.value = { nama: 'Ani', umur: 30 }   // ✅ aman dengan ref
</script>
```

---

### ❌ Jebakan 5 — Menggunakan `this` di `<script setup>`

```vue
<script setup>
import { ref } from 'vue'

const hitungan = ref(0)

// ❌ SALAH — tidak ada 'this' di Composition API!
function tambah() {
  this.hitungan++          // ❌ this adalah undefined
}

// ✅ BENAR — akses variabel langsung by name
function tambahBenar() {
  hitungan.value++
}
</script>
```

> ⚠️ **Ingat:** Di Composition API **tidak ada `this`**. Kamu mengakses state langsung lewat nama variabelnya. Ini salah satu keuntungan terbesar dibanding Options API.

---

### ❌ Jebakan 6 — Template ref diakses sebelum mount

```vue
<script setup>
import { ref } from 'vue'
const inputEl = ref(null)

// ❌ SALAH — saat setup() berjalan, DOM belum ada
console.log(inputEl.value)   // null!

// ✅ BENAR — akses di onMounted (atau event handler)
onMounted(() => {
  console.log(inputEl.value) // <input> element ✅
})
</script>
```

---

## 📝 22. Ringkasan Bab 13

| Konsep | Penjelasan |
| --- | --- |
| **Composition API** | Kumpulan fungsi (`ref`, `reactive`, `computed`, `watch`, lifecycle) untuk menulis logika berbasis fitur |
| **`<script setup>`** | Syntax sugar Composition API — tanpa `return` manual, direkomendasikan Vue |
| **`ref(x)`** | Pembungkus nilai jadi reaktif; akses via `.value` di script, auto-unwrap di template |
| **`reactive(obj)`** | Object/array reaktif langsung; akses `obj.prop`, tidak bisa di-reassign utuh |
| **`.value`** | Wajib di `<script>` karena ref adalah objek `{ value }`; tidak dipakai di `<template>` |
| **Auto-unwrap** | Vue otomatis membuka `.value` untuk top-level ref di template |
| **`toRefs(obj)`** | Destrukturisasi reactive/objek jadi banyak `ref` tetap reaktif (dua arah) |
| **`toRef(obj, key)`** | Satu property jadi `ref` reaktif (dua arah) |
| **`isRef()` / `unref()`** | Helper cek ref / ambil nilai ref-or-biasa |
| **`defineProps`/`defineEmits`** | Compiler macro; tidak perlu import |
| **`defineExpose`** | Ekspos method/state ke parent secara eksplisit |
| **Template ref** | `ref="x"` + `const x = ref(null)` → akses DOM/instance |
| **Jebakan utama** | Lupa `.value` di script; tulis `.value` di template; destructure biasa; reassign reactive |

---

## 🎯 23. Latihan Mandiri

**⭐ Latihan 1 — Counter dengan Batas**
Buat komponen `CounterCerdas.vue` menggunakan `<script setup>` dan `ref`. Counter punya tombol `+1` dan `-1`, tapi tidak boleh kurang dari 0 atau lebih dari 10. Tambahkan computed `sudahMaksimal` dan `sudahMinimal` untuk menonaktifkan tombol saat batas tercapai.

**⭐⭐ Latihan 2 — Form Profil dengan `reactive`**
Buat komponen `FormProfil.vue` yang menggunakan `reactive` untuk menyimpan `nama`, `email`, dan `bio`. Tampilkan *live preview* dari ketiga nilai tersebut di sebelah form menggunakan `computed` (misal: `"Halo, saya Budi (budi@mail.com): ..."`).

**⭐⭐⭐ Latihan 3 — Destrukturisasi Reaktif dengan `toRefs`**
Buat komponen `KartuFilm.vue` yang menerima prop `film` (object dengan `title`, `year`, `rating`). Pecah prop tersebut dengan `toRefs` agar `title`, `year`, `rating` bisa dipakai sebagai ref individual di dalam `computed` dan `watch`. Buktikan bahwa mengubah prop dari parent tetap memperbarui tampilan.

**⭐⭐⭐⭐ Latihan 4 — Mini Search dengan Loading & Error**
Buat komponen `PencarianSederhana.vue` lengkap dengan `ref` untuk `keyword`, `hasil`, `isLoading`, `error`. Gunakan `watch` pada `keyword` untuk memanggil fungsi `cari()` (bisa berupa `setTimeout` tiruan yang mengembalikan array). Tangani status loading dan error (misal: keyword "error" memicu error tiruan). Tampilkan UI berbeda untuk tiap status.

**⭐⭐⭐⭐ Latihan 5 — `defineExpose` (Eksplorasi)**
Buat `VideoPlayer.vue` yang menyimpan `ref` ke elemen `<video>` dan mengekspos method `putar()` serta `jeda()` via `defineExpose`. Di `Parent.vue`, pasang `ref="player"` dan tambahkan tombol "Putar" & "Jeda" yang memanggil method tersebut. Buktikan bahwa parent bisa mengontrol child tanpa props/events.

---

*Lanjut ke ➡️ **Bab 14 — Composables — Logika yang Bisa Dipakai Ulang***
