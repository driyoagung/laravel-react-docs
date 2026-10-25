# 🔄 Bab 12 — Migrasi Mindset Options ke Composition

> *"Options API mengajarkan kita 'di mana meletakkan opsi'. Composition API mengajarkan kita 'bagaimana mengelompokkan logika'. Pergeseran kecil ini mengubah cara kamu membangun aplikasi Vue selamanya."*

---

> **🧠 Apa Itu Migrasi Mindset?**
>
> Migrasi di sini **bukan** sekadar mengubah sintaks, melainkan mengubah **cara berpikir**. Di Options API, kamu memecah kode berdasarkan *jenis opsi* (`data`, `methods`, `computed`, `watch`). Di Composition API, kamu memecah kode berdasarkan *fitur* (pencarian, filter, watchlist). Hasilnya: logika satu fitur berdampingan, mudah dibaca, dan mudah diekstrak ke *composable* yang bisa dipakai ulang.

---

> **🏗️ Analogi Sederhana:**
>
> Options API seperti **buku masak di mana semua resep diurutkan berdasarkan alat**: Bab 1 semua resep yang pakai *oven*, Bab 2 semua resep yang pakai *kompor*, Bab 3 semua yang pakai *blender*. Kalau kamu ingin membuat *satu hidangan utuh*, kamu harus lompat-lompat antar bab. Composition API seperti **buku masak di mana resep diurutkan berdasarkan hidangan**: semua langkah *spaghetti* ada di satu tempat, semua langkah *salad* ada di tempat lain. Satu hidangan = satu bagian utuh, mudah diikuti.

---

## 📋 Daftar Isi Bab 12

1. Kenapa Composition API Diciptakan?
2. Masalah Options API di Project Besar
3. Anatomi Komponen "Tersebar" (Contoh Lengkap)
4. Akar Masalah: Scrolling Hell & Sulit Reuse
5. Solusi Composition API: Kelompokkan per Fitur
6. Rewrite: Komponen yang Sama di Composition API
7. Ekstraksi ke Composable (Reuse Sejati)
8. Tidak Ada Lagi `this` — Kebebasan Baru
9. Mindset: Dari "Opsi" ke "Fitur"
10. 📊 Tabel Konversi Lengkap (20+ Baris)
11. Strategi Migrasi Bertahap
12. 🎬 Studi Kasus: Halaman Browse Netflix
13. 🔬 Anatomi `setup()` vs `<script setup>`
14. 🧪 Mengapa TypeScript Lebih Suka Composition API
15. 📛 Myth vs Fact tentang Composition API
16. 🧭 Decision Tree: Pakai yang Mana?
17. 🔐 provide/inject di Composition API (Bonus)
18. 🧰 Pola Umum Composable (useFetch & useDebounce)
19. 📱 Studi Kasus Mini: Counter Terisolasi
20. 🧪 Refactoring Nyata: Langkah demi Langkah
21. 📏 Metrik Keterbacaan: Seberapa Besar Bedanya?
22. 🧩 Migrasi Hibrida dengan `defineOptions` & `<script>` Ganda
23. 🪄 Studi Kasus Refactor: Form Wizard Multi-Step
24. 🧬 Perbandingan Reaktivitas: `data()` vs `ref`/`reactive`
25. 🧫 Studi Kasus: Migrasi Komponen Todo List Utuh
26. 🩺 Diagnosa Sebelum Migrasi: Peta `this`
27. 🧯 Kesalahan Reaktivitas Saat Migrasi & Cara Menghindarinya
28. 🧠 Mental Model Baru: "Fungsi yang Mengembalikan Reaktivitas"
29. 🚨 Jebakan Umum Pemula di Bab 12
30. 📝 Ringkasan Bab 12
31. 🎯 Latihan Mandiri

---

## 🤔 1. Kenapa Composition API Diciptakan?

Vue 3 (2020) memperkenalkan Composition API bukan karena Options API "rusak", tapi karena **batasannya mulai terasa di aplikasi besar**. Tim Vue (Evan You dkk.) melihat pola yang sama berulang di codebase produksi:

- Komponen dengan **banyak fitur** → logika satu fitur tersebar di banyak opsi.
- **Reuse logika** → bergantung pada mixins yang rawan collision & sulit dilacak.
- **TypeScript** → `this` yang diikat dinamis membuat inference lemah.

Composition API menjawab ketiganya dengan satu ide: **logika dikelompokkan berdasarkan fitur, bukan jenis opsi**.

> 💡 **Penting:** Composition API **bukan pengganti** Options API. Keduanya bisa berdampingan. Tapi untuk komponen kompleks & reuse, Composition API jauh lebih unggul.

---

## 😤 2. Masalah Options API di Project Besar

Bayangkan satu komponen yang menangani **tiga fitur sekaligus**:
- 🔴 **Fitur A**: pencarian film
- 🔵 **Fitur B**: filter genre
- 🟢 **Fitur C**: watchlist

Di Options API, kode setiap fitur **terpotong-potong** ke kotak berbeda.

> 🧠 **Mengapa ini terjadi secara alami?** Options API *mendikte* struktur: "semua state ke `data`, semua fungsi ke `methods`". Jadi wajar kalau tiga fitur berbeda menumpuk di kotak yang sama. Composition API membalikkan logika: "kelompokkan berdasarkan apa yang dilakukan logikamu, bukan di kotak mana ia harus diletakkan."

---

## 🧩 3. Anatomi Komponen "Tersebar" (Contoh Lengkap)

```js
// ─────────────────────────────────────────────────────────────
// OPTIONS API: satu komponen, TIGA fitur, logika TERSEBAR
// ─────────────────────────────────────────────────────────────
export default {
  // ── STATE ──
  data() {
    return {
      // Fitur A 🔴 (pencarian)
      keywordCari: '',
      hasilCarian: [],
      isCariLoading: false,

      // Fitur B 🔵 (filter genre)
      genreDipilih: '',
      daftarGenre: [],
      isGenreLoading: false,

      // Fitur C 🟢 (watchlist)
      watchlist: [],
      isWatchlistTerbuka: false,
    }
  },

  // ── DATA TURUNAN ──
  computed: {
    // Fitur A 🔴
    jumlahHasil() {
      return this.hasilCarian.length
    },
    // Fitur B 🔵
    genreAktif() {
      return this.daftarGenre.find(g => g.id === this.genreDipilih)
    },
    // Fitur C 🟢
    totalWatchlist() {
      return this.watchlist.length
    },
  },

  // ── PENGAWAS ──
  watch: {
    // Fitur A 🔴
    keywordCari(nilai) {
      if (nilai.length >= 2) this.cariFilm()
    },
    // Fitur B 🔵
    genreDipilih(id) {
      this.ambilFilmByGenre(id)
    },
  },

  // ── FUNGSI ──
  methods: {
    // Fitur A 🔴
    async cariFilm() {
      this.isCariLoading = true
      this.hasilCarian = await api.cari(this.keywordCari)
      this.isCariLoading = false
    },
    resetCarian() {
      this.keywordCari = ''
      this.hasilCarian = []
    },

    // Fitur B 🔵
    async ambilGenre() {
      this.isGenreLoading = true
      this.daftarGenre = await api.genres()
      this.isGenreLoading = false
    },
    async ambilFilmByGenre(id) {
      // ...
    },

    // Fitur C 🟢
    tambahWatchlist(film) {
      this.watchlist.push(film)
    },
    hapusWatchlist(id) {
      this.watchlist = this.watchlist.filter(f => f.id !== id)
    },
    toggleWatchlistPanel() {
      this.isWatchlistTerbuka = !this.isWatchlistTerbuka
    },
  },

  // ── LIFECYCLE ──
  mounted() {
    // Fitur A 🔴 + Fitur B 🔵 butuh fetch awal
    this.ambilGenre()
  },
}
```

Perhatikan: untuk memahami **Fitur A** saja, matamu harus melompat ke `data` (baris state), `computed` (jumlahHasil), `watch` (keywordCari), dan `methods` (cariFilm, resetCarian). Fitur B dan C tersebar di tempat yang sama. Semakin banyak fitur → semakin parah.

---

## 🔍 4. Akar Masalah: Scrolling Hell & Sulit Reuse

1. **Logika satu fitur tersebar.** State `keywordCari` ada di `data`, fungsi `cariFilm` ada di `methods`, validasi mungkin di `computed`. Untuk memahami "Fitur A", matamu harus **melompati** Fitur B dan C. Ini sering disebut *"scrolling hell"*.

2. **Sulit di-extract & di-reuse.** Kalau kamu ingin pakai "Fitur A" di komponen lain, kamu harus menyalin potongan dari `data`, `methods`, `computed`, `watch` secara manual. Rawan salah & sulit di-sync.

3. **TypeScript kurang ramah.** Karena semua diakses lewat `this` yang diikat secara dinamis, inferensi tipe jadi lemah dibandingkan variabel lokal biasa.

```js
// ❌ Inilah "scrolling hell":
// Untuk pahami Fitur A, baca baris:
//  data.keywordCari        (letak A)
//  computed.jumlahHasil    (letak A, jauh di bawah)
//  watch.keywordCari       (letak A, jauh lagi)
//  methods.cariFilm        (letak A, paling bawah)
// Semua terpisah oleh kode Fitur B & C di antaranya.
```

### 📊 Visualisasi "Scrolling Hell"

```
┌─────────────────────────────────────────────┐
│ data()  ▸ keywordCari, hasilCarian   (A)    │
│          ▸ genreDipilih, daftarGenre  (B)    │
│          ▸ watchlist, ...             (C)    │
├─────────────────────────────────────────────┤
│ computed ▸ jumlahHasil                 (A)    │ ← lompat ke sini
│          ▸ genreAktif                   (B)   │
│          ▸ totalWatchlist               (C)   │
├─────────────────────────────────────────────┤
│ watch   ▸ keywordCari                 (A)     │ ← lompat ke sini
│          ▸ genreDipilih                (B)    │
├─────────────────────────────────────────────┤
│ methods ▸ cariFilm, resetCarian       (A)     │ ← lompat ke sini
│          ▸ ambilGenre, ...            (B)     │
│          ▸ tambahWatchlist, ...        (C)    │
└─────────────────────────────────────────────┘
   ↑ Untuk pahami Fitur A, mata bolak-balik 4 blok
```

> 🎯 **Inti:** Di Options API, **jarak fisik kode** tidak mencerminkan **kedekatan logis fitur**. Composition API menyatukan keduanya.

---

## ✅ 5. Solusi Composition API: Kelompokkan per Fitur

Composition API membiarkanmu **mengelompokkan logika berdasarkan fitur**, bukan jenis opsi. Semua state, fungsi, dan effect milik "Fitur A" ditulis berdampingan.

```js
// composables/useFilmSearch.js  ← FITUR A UTUH & TERISOLASI
import { ref, computed, watch } from 'vue'
import { api } from '@/api/tmdb'

export function useFilmSearch() {
  // ── semua state Fitur A di sini ──
  const keywordCari    = ref('')
  const hasilCarian    = ref([])
  const isCariLoading  = ref(false)

  // ── computed Fitur A ──
  const jumlahHasil = computed(() => hasilCarian.value.length)

  // ── watch Fitur A ──
  watch(keywordCari, (nilai) => {
    if (nilai.length >= 2) cariFilm()
  })

  // ── methods Fitur A ──
  async function cariFilm() {
    isCariLoading.value = true
    hasilCarian.value = await api.cari(keywordCari.value)
    isCariLoading.value = false
  }
  function resetCarian() {
    keywordCari.value = ''
    hasilCarian.value = []
  }

  // kembalikan apa yang dibutuhkan komponen
  return { keywordCari, hasilCarian, isCariLoading, jumlahHasil, cariFilm, resetCarian }
}
```

```js
// composables/useGenreFilter.js  ← FITUR B UTUH
import { ref, computed } from 'vue'
import { api } from '@/api/tmdb'

export function useGenreFilter() {
  const genreDipilih     = ref('')
  const daftarGenre      = ref([])
  const isGenreLoading   = ref(false)
  const genreAktif = computed(() => daftarGenre.value.find(g => g.id === genreDipilih.value))

  async function ambilGenre() {
    isGenreLoading.value = true
    daftarGenre.value = await api.genres()
    isGenreLoading.value = false
  }
  async function ambilFilmByGenre(id) { /* ... */ }

  return { genreDipilih, daftarGenre, isGenreLoading, genreAktif, ambilGenre, ambilFilmByGenre }
}
```

```js
// composables/useWatchlist.js  ← FITUR C UTUH
import { ref, computed } from 'vue'

export function useWatchlist() {
  const watchlist           = ref([])
  const isWatchlistTerbuka  = ref(false)
  const totalWatchlist = computed(() => watchlist.value.length)

  function tambahWatchlist(film)  { watchlist.value.push(film) }
  function hapusWatchlist(id)     { watchlist.value = watchlist.value.filter(f => f.id !== id) }
  function toggleWatchlistPanel() { isWatchlistTerbuka.value = !isWatchlistTerbuka.value }

  return { watchlist, isWatchlistTerbuka, totalWatchlist, tambahWatchlist, hapusWatchlist, toggleWatchlistPanel }
}
```

Sekarang tiap fitur **utuh, terisolasi, dan bisa dipakai ulang** tanpa menyalin sana-sini.

---

## 🔁 6. Rewrite: Komponen yang Sama di Composition API

Berikut komponen dari bagian 3 ditulis ulang dengan `<script setup>` (Composition API). Perhatikan betapa rapinya:

```vue
<!-- BrowseView.vue (Composition API + <script setup>) -->
<script setup>
import { onMounted } from 'vue'
import { useFilmSearch } from '@/composables/useFilmSearch'
import { useGenreFilter } from '@/composables/useGenreFilter'
import { useWatchlist }  from '@/composables/useWatchlist'

// ── FITUR A: pencarian ── (semua dalam satu baris import!)
const { keywordCari, hasilCarian, isCariLoading, jumlahHasil, cariFilm, resetCarian }
  = useFilmSearch()

// ── FITUR B: filter genre ──
const { genreDipilih, daftarGenre, isGenreLoading, genreAktif, ambilGenre, ambilFilmByGenre }
  = useGenreFilter()

// ── FITUR C: watchlist ──
const { watchlist, isWatchlistTerbuka, totalWatchlist, tambahWatchlist, hapusWatchlist, toggleWatchlistPanel }
  = useWatchlist()

// ── LIFECYCLE ──
onMounted(() => {
  ambilGenre()   // fetch awal
})
</script>

<template>
  <!-- SEMUA FITUR BISA DIPAKAI LANGSUNG DI TEMPLATE -->
  <input v-model="keywordCari" placeholder="Cari film..." />
  <span>{{ jumlahHasil }} hasil</span>

  <select v-model="genreDipilih">
    <option v-for="g in daftarGenre" :key="g.id" :value="g.id">{{ g.nama }}</option>
  </select>

  <button @click="toggleWatchlistPanel">
    Watchlist ({{ totalWatchlist }})
  </button>
</template>
```

| Aspek | Options API | Composition API |
| --- | --- | --- |
| Letak logika Fitur A | Tersebar di 4 opsi | Semua di `useFilmSearch` |
| Membaca Fitur A | Lompat-lompat opsi | Satu file composable |
| Reuse ke komponen lain | Salin manual | `import` + destructure |
| `this` | Wajib | Tidak ada |

---

## 📦 7. Ekstraksi ke Composable (Reuse Sejati)

Keuntungan terbesar: composable bisa dipakai di **komponen mana pun** tanpa duplikasi.

```vue
<!-- SearchView.vue — pakai Fitur A lagi, GRATIS -->
<script setup>
import { useFilmSearch } from '@/composables/useFilmSearch'
const { keywordCari, hasilCarian, isCariLoading, cariFilm }
  = useFilmSearch()   // ← 1 baris, logic lengkap!
</script>
```

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

> 💡 **Inilah inti pergeseran *mindset*-nya:** dari "di mana meletakkan opsi" menjadi "bagaimana mengelompokkan logika". Composable = "resep per hidangan", bukan "resep per alat".

---

## 🚫 8. Tidak Ada Lagi `this` — Kebebasan Baru

Di Composition API, **tidak ada `this`**. Semua diakses sebagai variabel lokal biasa.

```js
// Options API — butuh this
export default {
  data() { return { count: 0 } },
  methods: {
    tambah() { this.count++ }          // this!
  }
}
```

```vue
<!-- Composition API — variabel lokal -->
<script setup>
import { ref } from 'vue'
const count = ref(0)
function tambah() { count.value++ }    // TANPA this!
</script>
```

Keuntungannya:
- ✅ Bebas **jebakan arrow function** (Bab 10.4).
- ✅ Lebih mudah di-debug (variabel lokal, bukan properti dinamis).
- ✅ **TypeScript** inference kuat (tipe variabel jelas).
- ✅ Bisa pakai fitur JS modern (closure, destructure) tanpa batasan `this`.

> 📌 **Catatan Penting:** Kamu **tidak harus** migrasi semua komponen ke Composition API. Vue 3 mendukung keduanya berdampingan. Migrasi masuk akal untuk komponen kompleks; komponen simpel tetap nyaman di Options API.

---

## 🧠 9. Mindset: Dari "Opsi" ke "Fitur"

| Pertanyaan | Options API | Composition API |
| --- | --- | --- |
| "State ada di mana?" | Di `data()` | Di `ref`/`reactive` dalam composable fitur |
| "Fungsi ada di mana?" | Di `methods` | Fungsi biasa dalam composable fitur |
| "Cara bagi logika?" | Per jenis opsi | Per fitur (composable) |
| "Butuh `this`?" | Ya | Tidak |
| "Sulit reuse?" | Ya (mixins) | Tidak (composables) |

---

## 📊 10. Tabel Konversi Lengkap (20+ Baris)

Berikut pemetaan **setiap** opsi Options API ke padanannya di Composition API (`<script setup>`):

| # | Options API | Composition API | Catatan / Penjelasan |
| --- | --- | --- | --- |
| 1 | `data() { return { x } }` | `const x = ref(0)` atau `const state = reactive({ x })` | `ref` untuk nilai tunggal, `reactive` untuk objek. Akses `.value` untuk ref di script. |
| 2 | `computed: { full() {} }` | `const full = computed(() => ...)` | Sama-sama cached & reactive. Di template ref otomatis *unwrapped*. |
| 3 | `methods: { fn() {} }` | `function fn() { ... }` | Cukup fungsi JavaScript biasa; tidak perlu blok `methods`. |
| 4 | `watch: { prop(v) {} }` | `watch(prop, (v) => { ... })` | Bisa watch `ref`, `reactive`, atau getter `() => state.x`. Ada juga `watchEffect`. |
| 5 | `mounted() {}` | `onMounted(() => { ... })` | Import hook dari `'vue'`. Dijalankan setelah render DOM. |
| 6 | `beforeMount() {}` | `onBeforeMount(() => { ... })` | Sebelum komponen di-mount. |
| 7 | `updated() {}` | `onUpdated(() => { ... })` | Setelah re-render karena reactive change. |
| 8 | `beforeUpdate() {}` | `onBeforeUpdate(() => { ... })` | Sebelum patch DOM. |
| 9 | `unmounted() {}` | `onUnmounted(() => { ... })` | Untuk cleanup (timer, listener). |
| 10 | `beforeUnmount() {}` | `onBeforeUnmount(() => { ... })` | Tepat sebelum dibongkar. |
| 11 | `created() {}` | `setup()` body / kode langsung | Di `<script setup>`, kode di luar hook = `created`. |
| 12 | `errorCaptured() {}` | `onErrorCaptured((err) => { ... })` | Menangkap error dari child. |
| 13 | `activated() {}` | `onActivated(() => { ... })` | Khusus `<keep-alive>`. |
| 14 | `deactivated() {}` | `onDeactivated(() => { ... })` | Khusus `<keep-alive>`. |
| 15 | `props: { x: Type }` | `const props = defineProps({ x: Type })` | `defineProps` hanya di `<script setup>`. |
| 16 | `emits: ['e']` | `const emit = defineEmits(['e'])` | Panggil `emit('e', payload)`. |
| 17 | `provide()` | `provide(key, value)` | Sering dikombinasikan dengan `ref`/`reactive` agar reactive. |
| 18 | `inject: ['k']` | `const k = inject('k')` | Bisa beri default: `inject('k', nilaiDefault)`. |
| 19 | `components: { X }` | Import langsung + pakai di template | Di `<script setup>`, komponen yang diimpor otomatis tersedia. |
| 20 | `mixins: [M]` | **Composables** (`useX()`) | Composables lebih eksplisit, tidak ada name collision. |
| 21 | `extends: Comp` | Composables / ekstrak logika | Komposisi lebih fleksibel daripada pewarisan. |
| 22 | `name` | `defineOptions({ name })` | Atau beri nama file untuk devtools. |
| 23 | `this.$emit()` | `emit()` | Dari `defineEmits`. |
| 24 | `this.$refs.x` | `const x = ref(null)` + `ref="x"` | Template ref di Composition API. |
| 25 | `this.$route` | `useRoute()` | Dari `vue-router`. |
| 26 | `this.$router` | `useRouter()` | Dari `vue-router`. |
| 27 | `this.$nextTick()` | `nextTick()` | Import dari `'vue'`. |
| 28 | `this.$forceUpdate()` | (jarang perlu) reassign reactive | Reactive otomatis; hindari forceUpdate. |
| 29 | `beforeDestroy()` (Vue2) | `onBeforeUnmount()` | Di Vue 3 nama berubah. |
| 30 | `destroyed()` (Vue2) | `onUnmounted()` | Di Vue 3 nama berubah. |

> 💡 **Tips Migrasi:** Mulai dari komponen terbesar yang paling bermasalah. Gunakan `<script setup>` agar kode lebih singkat. Untuk setiap `this.x`, tanyakan: "itu `ref`, `reactive`, `props`, atau `computed`?" — lalu deklarasikan secara eksplisit.

> 📌 **Catatan Penting:** Di Composition API, **tidak ada `this`**. Semua diakses sebagai variabel lokal biasa. Ini justru kelebihannya: lebih mudah di-*debug*, lebih ramah TypeScript, dan bebas jebakan arrow function yang dibahas di Bab 10.4.

---

## 🪜 11. Strategi Migrasi Bertahap

Kamu tidak perlu migrasi sekaligus. Vue 3 memungkinkan **kampanye hybrid**:

```vue
<!-- Bisa campur Options API & Composition API dalam 1 komponen -->
<script>
import { h } from 'vue'
export default {
  // Opsi Options API lama tetap jalan
  data() { return { count: 0 } },
  // ... tapi lifecycle bisa pakai setup()
  setup() {
    const pesan = 'halo dari composition'
    return { pesan }
  }
}
</script>
```

> 💡 **Rekomendasi:** Tulis komponen **baru** dengan `<script setup>`. Biarkan komponen **lama** yang masih Options API sampai ada kebutuhan refactor. Jangan "ganti demi ganti" — refactor bila ada nilai nyata (komponen membesar, butuh reuse).

---

## 🎬 12. Studi Kasus: Halaman Browse Netflix

Mari lihat komponen nyata ala Netflix: halaman *browse* dengan pencarian, filter genre, dan watchlist — ditulis dengan pendekatan Composition API + composables.

```vue
<!-- BrowseView.vue -->
<template>
  <div class="browse">
    <!-- Search bar (Fitur A) -->
    <input v-model="keywordCari" placeholder="Cari film..." />
    <p v-if="isCariLoading">⏳ Mencari...</p>
    <p>Total: {{ jumlahHasil }} hasil</p>

    <!-- Genre filter (Fitur B) -->
    <select v-model="genreDipilih" :disabled="isGenreLoading">
      <option value="">Semua Genre</option>
      <option v-for="g in daftarGenre" :key="g.id" :value="g.id">
        {{ g.nama }}
      </option>
    </select>
    <p v-if="genreAktif">Genre aktif: {{ genreAktif.nama }}</p>

    <!-- Watchlist panel (Fitur C) -->
    <button @click="toggleWatchlistPanel">
      📋 Watchlist ({{ totalWatchlist }})
    </button>
    <ul v-if="isWatchlistTerbuka">
      <li v-for="f in watchlist" :key="f.id">
        {{ f.title }}
        <button @click="hapusWatchlist(f.id)">✕</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
// ── SEMUA FITUR DIIMPOR SEBAGAI COMPOSABLE ──
import { onMounted } from 'vue'
import { useFilmSearch }  from '@/composables/useFilmSearch'
import { useGenreFilter } from '@/composables/useGenreFilter'
import { useWatchlist }   from '@/composables/useWatchlist'

const { keywordCari, isCariLoading, jumlahHasil } = useFilmSearch()
const { genreDipilih, daftarGenre, isGenreLoading, genreAktif, ambilGenre }
  = useGenreFilter()
const { watchlist, isWatchlistTerbuka, totalWatchlist, hapusWatchlist, toggleWatchlistPanel }
  = useWatchlist()

// Fetch genre saat mount
onMounted(() => ambilGenre())
</script>
```

**Yang kamu pelajari:**
- Template tetap sama, tapi script jauh lebih rapi: setiap fitur = satu `useX()`.
- Kalau suatu hari `useFilmSearch` dipakai di `SearchView`, cukup `import` — tanpa salin `data`/`methods`/`watch`.
- Tidak ada `this`, tidak ada arrow-trap, TypeScript ramah.

---

## 🔬 13. Anatomi `setup()` vs `<script setup>`

Ada dua cara menulis Composition API. Pahami bedanya agar tidak bingung membaca kode lama vs baru.

```js
// ════════════════════════════════════════════
// CARA 1: setup() function (Options-style)
// ══════════════════════════════════════════
import { ref, computed, onMounted } from 'vue'

export default {
  // setup() mengembalikan object yg akan tersedia di template
  setup() {
    const count = ref(0)
    const double = computed(() => count.value * 2)
    function tambah() { count.value++ }

    onMounted(() => console.log('mounted'))

    // ⚠️ HARUS di-return manual agar bisa dipakai di template!
    return { count, double, tambah }
  }
}
```

```vue
<!-- ══════════════════════════════════════════
     CARA 2: <script setup> (direkomendasikan)
     ══════════════════════════════════════════ -->
<script setup>
import { ref, computed, onMounted } from 'vue'

const count  = ref(0)
const double = computed(() => count.value * 2)
function tambah() { count.value++ }

onMounted(() => console.log('mounted'))
// ✅ TIDAK perlu return — semua otomatis ke template
</script>
```

| Aspek | `setup()` | `<script setup>` |
| --- | --- | --- |
| Boilerplate | Perlu `return {}` manual | Tidak perlu return |
| Kompilasi | Runtime | Compile-time (lebih optimal) |
| Rekomendasi | Legacy / kasus khusus | ✅ Standar modern |
| `defineProps` | Harus `setup(props)` | Langsung di atas |

> 💡 **Gunakan selalu `<script setup>`** untuk kode baru. Lebih ringkas, performa lebih baik, dan direkomendasikan resmi oleh tim Vue.

---

## 🧪 14. Mengapa TypeScript Lebih Suka Composition API

Ini salah satu alasan terbesar tim besar beralih ke Composition API.

```js
// ❌ OPTIONS API + TypeScript: inference lemah
export default {
  data() { return { count: 0 } },
  methods: {
    // this.count bertipe 'any' secara implisit di banyak kasus
    // karena this diikat secara dinamis oleh Vue
    cetak() { console.log(this.count) }
  }
}
```

```vue
<!-- ✅ COMPOSITION API + TypeScript: inference kuat -->
<script setup lang="ts">
import { ref } from 'vue'

const count = ref<number>(0)        // count: Ref<number> → jelas!
const nama = ref<string>('Budi')    // nama: Ref<string>

function tambah() {
  count.value++                     // TS tahu ini number → aman
  // count.value = 'salah'          // ❌ error TS: bukan string
}
</script>
```

**Mengapa Options API lemah di TS?**
- `this` diikat secara dinamis → TypeScript sulit mengetahui tipe `this.count`.
- Properti `data`/`methods`/`computed` "menyatu" ke `this` secara runtime, bukan deklarasi statis.
- Composable mengembalikan tipe eksplisit → editor (VS Code + Volar) bisa *autocomplete* dengan sempurna.

> 🎯 **Kesimpulan:** Kalau proyekmu pakai TypeScript, Composition API praktis wajib. Kalau JavaScript murni, keduanya oke, tapi Composition tetap lebih mudah di-debug.

---

## 📛 15. Myth vs Fact tentang Composition API

Banyak mitos beredar. Mari luruskan.

| Myth (Mitose) | Fact (Fakta) |
| --- | --- |
| "Options API sudah usang" | ❌ Salah. Masih didukung penuh & resmi di Vue 3 |
| "Harus migrasi semua ke Composition" | ❌ Salah. Migrasi bertahap, komponen simpel biarkan |
| "Composition API lebih cepat dari Options" | ⚠️ Hampir sama. Keuntungan di *organisasi*, bukan kecepatan eksekusi |
| "Composition API susah untuk pemula" | ⚠️ Awalnya ya, tapi `<script setup>` justru lebih sederhana dari arrow-trap `this` |
| "Mixins diganti total" | ✅ Composables adalah pengganti mixins yang lebih baik |
| "Tidak bisa pakai lifecycle" | ❌ Salah. `onMounted`, `onUnmounted`, dst tersedia |

> 💡 **Fakta kunci:** Composition API bukan "Vue versi baru yang menghapus yang lama". Ia adalah **alat tambahan**. Vue adalah framework yang menjaga *backward compatibility* dengan sangat baik.

---

## 🧭 16. Decision Tree: Pakai yang Mana?

```
Mulai
  │
  ├─ Komponen SEDERHANA (form kecil, kartu statis)?
  │     └─ ✅ Options API nyaman & cepat ditulis
  │
  ├─ Komponen BESAR dengan BANYAK fitur?
  │     └─ ✅ Composition API + Composables
  │
  ├─ Perlu REUSE logika lintas komponen?
  │     └─ ✅ Composition API (Composables)
  │
  ├─ Pakai TypeScript ketat?
  │     └─ ✅ Composition API
  │
  ├─ Memelihara LEGACY (Vue 2 style)?
  │     └─ ✅ Tetap Options API
  │
  └─ Tim masih belajar?
        └─ ✅ Mulai Options API, lalu kenalkan Composition
```

> 🎯 **Ingat:** Tidak ada yang "salah" memilih salah satu. Yang penting **konsisten** dalam satu komponen dan memilih berdasarkan kebutuhan, bukan mode.

---

## 🔐 17. provide/inject di Composition API (Bonus)

Sebagai jembatan ke Bab 11, ini cara `provide`/`inject` di Composition API — lebih eksplisit dan benar-benar reactive.

```vue
<!-- App.vue -->
<script setup>
import { ref, provide } from 'vue'

const temaWarna = ref('dark')          // ref → reactive sejati
provide('temaWarna', temaWarna)        // provide REF-nya

function gantiTema() {
  temaWarna.value = temaWarna.value === 'dark' ? 'light' : 'dark'
}
provide('gantiTema', gantiTema)
</script>
```

```vue
<!-- Anak mana pun -->
<script setup>
import { inject } from 'vue'

// inject ref mentah + default
const temaWarna = inject('temaWarna', ref('light'))
const gantiTema = inject('gantiTema', () => {})

console.log(temaWarna.value)  // 'dark'
</script>

<template>
  <p>Mode: {{ temaWarna }}</p>
  <button @click="gantiTema">Ganti Tema</button>
</template>
```

| Options API | Composition API |
| --- | --- |
| `provide() { return { x: this.x } }` | `provide('x', ref)` |
| `inject: ['x']` (auto-unwrap) | `inject('x')` (ref mentah) |
| Reactivity butuh object | Ref/reactive → reactive langsung |

> 💡 **Perbedaan unwrap:** Di Options API, `inject` otomatis *unwrap* ref jadi nilainya. Di Composition API, kamu inject ref mentah lalu akses `.value`. Keduanya valid; Composition lebih eksplisit.

---

## 🧰 18. Pola Umum Composable (useFetch & useDebounce)

Dua composable paling sering dipakai di dunia nyata: `useFetch` (ambil data) dan `useDebounce` (tunda pencarian). Ini memperlihatkan kekuatan reuse sejati.

```js
// ─────────────────────────────────────────────────────────────
// composables/useFetch.js — reuse logika fetch di mana pun
// ─────────────────────────────────────────────────────────────
import { ref } from 'vue'

export function useFetch(urlAwal) {
  const data      = ref(null)
  const isLoading = ref(false)
  const error     = ref(null)

  async function fetch(url = urlAwal) {
    isLoading.value = true
    error.value     = null
    try {
      const res = await window.fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      data.value = await res.json()
    } catch (e) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  if (urlAwal) fetch()   // langsung fetch saat dibuat (opsional)
  return { data, isLoading, error, fetch }
}
```

```vue
<!-- Penggunaan di komponen mana pun -->
<script setup>
import { useFetch } from '@/composables/useFetch'
const { data: films, isLoading, error } =
  useFetch('https://api.themoviedb.org/3/trending/movie/day')
</script>

<template>
  <div v-if="isLoading">⏳ Memuat...</div>
  <div v-else-if="error">❌ {{ error }}</div>
  <div v-else>
    <p>{{ films.results.length }} film trending</p>
  </div>
</template>
```

```js
// ─────────────────────────────────────────────────────────────
// composables/useDebounce.js — tunda reaksi saat user mengetik
// ─────────────────────────────────────────────────────────────
import { ref, watch } from 'vue'

export function useDebounce(nilai, delay = 500) {
  const nilaiDebounced = ref(nilai.value)

  watch(nilai, (terbaru) => {
    // tunggu 'delay' ms setelah user BERHENTI mengetik
    const timer = setTimeout(() => {
      nilaiDebounced.value = terbaru
    }, delay)
    // batal timer sebelumnya kalau user masih mengetik
    return () => clearTimeout(timer)
  })

  return nilaiDebounced
}
```

```vue
<script setup>
import { ref } from 'vue'
import { useDebounce } from '@/composables/useDebounce'

const keyword          = ref('')
const keywordDebounced = useDebounce(keyword, 400)
// keywordDebounced baru berubah 400ms setelah user berhenti ketik
</script>

<input v-model="keyword" placeholder="Cari film..." />
```

> 💡 **Ini inti Composition API:** `useFetch` dan `useDebounce` masing-masing ditulis **SEKALI**, lalu dipakai di puluhan komponen dengan satu baris `import`. Di Options API, kamu harus menyalin `data`/`methods`/`watch` ke setiap komponen — rawan salah & sulit sync.

---

## 📱 19. Studi Kasus Mini: Counter Terisolasi

Bandingkan komponen `Counter` kecil ditulis dua cara. Perhatikan betapa "lokal" Composition API — tidak ada `this`, tidak ada arrow-trap.

```js
// ════════════════════════════════════════════
// OPTIONS API
// ════════════════════════════════════════════
export default {
  data() { return { count: 0 } },
  computed: {
    double() { return this.count * 2 }
  },
  methods: {
    // function biasa (bukan arrow!) — ingat Bab 10.4
    tambah() { this.count++ },
    kurang() {
      // arrow di dalam method aman (inherit this)
      setTimeout(() => { this.count-- }, 100)
    }
  }
}
```

```vue
<!-- ════════════════════════════════════════════
     COMPOSITION API + <script setup>
     ════════════════════════════════════════════ -->
<script setup>
import { ref, computed } from 'vue'

const count  = ref(0)
const double = computed(() => count.value * 2)   // TANPA this
function tambah() { count.value++ }
function kurang() {
  setTimeout(() => { count.value-- }, 100)        // TANPA this, aman!
}
</script>

<template>
  <p>{{ count }} × 2 = {{ double }}</p>
  <button @click="tambah">+</button>
  <button @click="kurang">−</button>
</template>
```

| Aspek | Options | Composition |
| --- | --- | --- |
| Baris kode | 11 | ~9 |
| `this` | Perlu (rawan trap) | Tidak ada |
| Async di method | Perlu hati-hati arrow | Bebas |
| TypeScript | Inference lemah | Inference kuat |

> 🎯 **Pelajaran:** Untuk komponen sekecil ini, bedanya tipis. Composition API baru terlihat **keunggulannya besar** saat komponen punya banyak fitur (seperti studi kasus Browse di atas). Jangan paksakan Composition untuk komponen sebaris.

---

## 🧪 20. Refactoring Nyata: Langkah demi Langkah

Biar makin jelas, berikut langkah sistematis mengubah komponen Options API menjadi Composition API tanpa rusak.

```
LANGKAH 1: Pindahkan semua `data()` → `ref`/`reactive`
  data() { return { count: 0 } }   →   const count = ref(0)

LANGKAH 2: Pindahkan `computed` → `computed(() => ...)`
  computed: { double() { return this.count*2 } }
    →   const double = computed(() => count.value * 2)

LANGKAH 3: Pindahkan `methods` → fungsi biasa (hapus `this.`)
  methods: { tambah() { this.count++ } }
    →   function tambah() { count.value++ }

LANGKAH 4: Pindahkan `watch` → `watch(src, cb)`
  watch: { keyword(v){...} }   →   watch(keyword, (v) => {...})

LANGKAH 5: Pindahkan lifecycle → `onX(() => ...)`
  mounted() {...}   →   onMounted(() => {...})

LANGKAH 6: `props` → `defineProps`, `emits` → `defineEmits`
  props: { id: Number }   →   const props = defineProps({ id: Number })
  emits: ['oke']          →   const emit = defineEmits(['oke'])

LANGKAH 7: Ekstrak logika berulang ke composable `useX()`
  (jika dipakai di >1 komponen)

LANGKAH 8: Hapus `this` di mana pun — ganti `.value` di script
```

```vue
<!-- HASIL: komponen bersih, tidak ada `this` -->
<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const count  = ref(0)
const double = computed(() => count.value * 2)
function tambah() { count.value++ }
watch(count, (v) => console.log('count', v))
onMounted(() => console.log('siap'))
</script>
```

> 💡 **Tips:** Jangan langsung ubah 50 komponen sekaligus. Refactor komponen yang **paling sering diubah** dulu — itu yang paling banyak untungnya. Sisanya biarkan sampai ada kebutuhan.

---

## 📏 21. Metrik Keterbacaan: Seberapa Besar Bedanya?

Mari kita ukur secara konkret dengan contoh Browse (3 fitur) di atas.

| Metrik | Options API | Composition (composable) |
| --- | --- | --- |
| Baris untuk pahami 1 fitur | ~120 (tersebar) | ~35 (utuh di 1 file) |
| Jumlah "lompatan" mata | 4 blok | 0 (semua bersebelahan) |
| Duplikasi ke komponen lain | Salin ~120 baris | 1 baris `import` |
| Risiko salah salin | Tinggi | Rendah |
| Pelacakan asal fungsi | Cari di `methods` | Lihat nama `useX` |
| TypeScript inference | Lemah | Kuat |

> 🎯 **Kesimpulan metrik:** Composition API tidak membuat kode *lebih singkat* secara total (composable tetap punya baris yang sama), tapi ia membuat **jarak antara bagian logika yang terkait = 0**. Itulah yang menyelamatkanmu dari *scrolling hell*.

---

## 🧩 22. Migrasi Hibrida dengan `defineOptions` & `<script>` Ganda

Ada kalanya kamu butuh `<script setup>` tapi juga butuh opsi Options API (misal `name` untuk *recursive component* atau DevTools). Vue mengizinkan **dua blok script berdampingan**.

```vue
<!-- ✅ Boleh ada <script> biasa BERSELINGAN dengan <script setup> -->
<script>
// Opsi yang tidak didukung <script setup> langsung:
export default {
  name: 'BrowseView',        // nama eksplisit untuk DevTools
  inheritAttrs: false,
}
</script>

<script setup>
import { ref, onMounted } from 'vue'
const keyword = ref('')
onMounted(() => console.log('Browse siap'))
</script>
```

Di Vue 3.3+, kamu juga bisa pakai `defineOptions` **di dalam** `<script setup>` sehingga tidak perlu blok ganda:

```vue
<script setup>
import { ref } from 'vue'

// defineOptions: beri opsi komponen level tanpa blok <script> kedua
defineOptions({
  name: 'BrowseView',
  inheritAttrs: false,
})

const keyword = ref('')
</script>
```

> 💡 **Kapan perlu `name`?** Komponen yang **mereferensikan dirinya sendiri** (recursive, misal tree/node) butuh `name` agar bisa memanggil dirinya di template. Tanpa `name`, Vue pakai nama file sebagai fallback — jadi kadang tidak wajib.

---

## 🪄 23. Studi Kasus Refactor: Form Wizard Multi-Step

Mari lihat contoh nyata: form pendaftaran 3 langkah (Wizard). Di Options API, state tiap langkah dan validasinya tersebar. Kita refactor ke Composition API lalu ekstrak composable `useWizard`.

```js
// composables/useWizard.js  ← logika wizard UTUH
import { ref, computed } from 'vue'

export function useWizard(totalLangkah = 3) {
  const langkahSaatIni = ref(1)
  const data = ref({
    nama: '',
    email: '',
    password: '',
  })

  const isPertama = computed(() => langkahSaatIni.value === 1)
  const isTerakhir = computed(() => langkahSaatIni.value === totalLangkah)

  function lanjut() {
    if (!isTerakhir.value) langkahSaatIni.value++
  }
  function kembali() {
    if (!isPertama.value) langkahSaatIni.value--
  }

  return { langkahSaatIni, data, isPertama, isTerakhir, lanjut, kembali }
}
```

```vue
<!-- DaftarView.vue -->
<script setup>
import { useWizard } from '@/composables/useWizard'

// Semua state & fungsi wizard langsung tersedia
const { langkahSaatIni, data, isPertama, isTerakhir, lanjut, kembali }
  = useWizard(3)
</script>

<template>
  <p>Langkah {{ langkahSaatIni }} / 3</p>

  <input v-if="langkahSaatIni === 1" v-model="data.nama" placeholder="Nama" />
  <input v-else-if="langkahSaatIni === 2" v-model="data.email" placeholder="Email" />
  <input v-else v-model="data.password" type="password" placeholder="Password" />

  <button :disabled="isPertama" @click="kembali">← Kembali</button>
  <button :disabled="isTerakhir" @click="lanjut">Lanjut →</button>
</template>
```

> 🎯 **Pelajaran:** Composable `useWizard` bisa dipakai di `DaftarView`, `CheckoutView`, atau `OnboardingView` — cukup `import`. Di Options API, kamu harus menyalin `data`, `computed`, `methods` wizard ke masing-masing.

---

## 🧬 24. Perbandingan Reaktivitas: `data()` vs `ref`/`reactive`

Salah satu bagian paling membingungkan saat migrasi adalah memahami **padanan reaktivitas**. Di Options API, semua state hidup di `data()` dan otomatis reaktif. Di Composition API, kamu memilih **secara sadar** antara `ref` dan `reactive`. Mari kupas tuntas.

```js
// ════════════════════════════════════════════
// OPTIONS API — semua state di satu tempat, auto-reactive
// ════════════════════════════════════════════
export default {
  data() {
    return {
      nama: 'Budi',           // string
      umur: 25,               // number
      hobi: ['coding'],       // array
      alamat: {               // object bersarang
        kota: 'Yogyakarta',
        pos: '55281',
      },
    }
  },
  methods: {
    ubah() {
      this.nama = 'Ani'       // reaktif otomatis
      this.alamat.kota = 'Bandung'  // nested pun reaktif
    },
  },
}
```

```vue
<!-- ════════════════════════════════════════════
     COMPOSITION API — kamu memilih ref atau reactive
     ════════════════════════════════════════════ -->
<script setup>
import { ref, reactive } from 'vue'

// ── PENDEKATAN A: semua pakai ref (paling umum) ──
const nama = ref('Budi')      // akses: nama.value
const umur = ref(25)
const hobi = ref(['coding'])
const alamat = ref({ kota: 'Yogyakarta', pos: '55281' })

function ubahA() {
  nama.value = 'Ani'                 // wajib .value di script
  alamat.value.kota = 'Bandung'      // nested tetap reaktif
}

// ── PENDEKATAN B: kelompokkan objek pakai reactive ──
const state = reactive({
  nama: 'Budi',
  umur: 25,
  hobi: ['coding'],
  alamat: { kota: 'Yogyakarta', pos: '55281' },
})

function ubahB() {
  state.nama = 'Ani'                 // TANPA .value
  state.alamat.kota = 'Bandung'      // nested reaktif
}
</script>
```

### 📊 Kapan `ref`, Kapan `reactive`?

| Situasi | Pilih | Alasan |
| --- | --- | --- |
| Nilai primitif (string, number, boolean) | `ref` | `reactive` tidak bisa membungkus primitif |
| Satu nilai tunggal | `ref` | Lebih eksplisit, mudah di-pass ke composable |
| Kumpulan properti yang saling terkait | `reactive` | Akses tanpa `.value`, mirip objek biasa |
| State yang akan di-`return` dari composable | `ref` | Aman di-destructure oleh pemanggil |
| Butuh reassign seluruh objek | `ref` | `state.value = objekBaru` bisa; `reactive` tidak bisa diganti utuh |

> 💡 **Rekomendasi praktis:** Untuk pemula yang baru migrasi, **pakai `ref` untuk semuanya** dulu. Konsistensi `.value` lebih mudah diingat daripada mencampur dua gaya. Setelah nyaman, gunakan `reactive` untuk mengelompokkan objek form yang besar.

> ⚠️ **Jebakan `reactive`:** Kamu **tidak bisa** mengganti seluruh objek `reactive` dengan assignment biasa. `state = { ... }` akan **memutus** reaktivitas. Gunakan `Object.assign(state, baru)` atau `ref` jika perlu mengganti utuh.

```js
// ❌ SALAH — reassign reactive memutus reaktivitas
let state = reactive({ count: 0 })
state = reactive({ count: 10 })   // koneksi lama putus!

// ✅ BENAR — mutasi properti atau pakai ref
const state = reactive({ count: 0 })
Object.assign(state, { count: 10 })  // tetap reaktif

// ✅ ATAU pakai ref jika sering ganti utuh
const data = ref({ count: 0 })
data.value = { count: 10 }           // aman, tetap reaktif
```

---

## 🧫 25. Studi Kasus: Migrasi Komponen Todo List Utuh

Mari lakukan migrasi **nyata dan lengkap** dari sebuah komponen Todo List. Ini contoh sempurna karena punya state, computed, watch, method, dan lifecycle — semua elemen yang perlu dikonversi.

### Versi Asli (Options API)

```js
// TodoList.vue (Options API)
export default {
  data() {
    return {
      tugas: [],              // daftar tugas
      inputBaru: '',          // teks input
      filter: 'semua',        // 'semua' | 'aktif' | 'selesai'
    }
  },
  computed: {
    tugasTampil() {
      // filter tugas berdasarkan status
      if (this.filter === 'aktif')   return this.tugas.filter(t => !t.selesai)
      if (this.filter === 'selesai') return this.tugas.filter(t => t.selesai)
      return this.tugas
    },
    jumlahAktif() {
      return this.tugas.filter(t => !t.selesai).length
    },
  },
  watch: {
    tugas: {
      deep: true,
      handler(baru) {
        // simpan ke localStorage tiap kali tugas berubah
        localStorage.setItem('tugas', JSON.stringify(baru))
      },
    },
  },
  methods: {
    tambah() {
      if (!this.inputBaru.trim()) return
      this.tugas.push({ id: Date.now(), teks: this.inputBaru, selesai: false })
      this.inputBaru = ''
    },
    toggle(id) {
      const t = this.tugas.find(t => t.id === id)
      if (t) t.selesai = !t.selesai
    },
    hapus(id) {
      this.tugas = this.tugas.filter(t => t.id !== id)
    },
  },
  mounted() {
    // muat dari localStorage saat komponen siap
    this.tugas = JSON.parse(localStorage.getItem('tugas') || '[]')
  },
}
```

### Versi Migrasi (Composition API + `<script setup>`)

```vue
<!-- TodoList.vue (Composition API) -->
<script setup>
import { ref, computed, watch, onMounted } from 'vue'

// ── STATE (data → ref) ──
const tugas     = ref([])        // dulu: data.tugas
const inputBaru = ref('')        // dulu: data.inputBaru
const filter    = ref('semua')   // dulu: data.filter

// ── COMPUTED (computed → computed()) ──
const tugasTampil = computed(() => {
  if (filter.value === 'aktif')   return tugas.value.filter(t => !t.selesai)
  if (filter.value === 'selesai') return tugas.value.filter(t => t.selesai)
  return tugas.value
})
const jumlahAktif = computed(() => tugas.value.filter(t => !t.selesai).length)

// ── WATCH (watch: {} → watch()) ──
watch(tugas, (baru) => {
  localStorage.setItem('tugas', JSON.stringify(baru))
}, { deep: true })   // opsi deep tetap sama

// ── METHODS (methods → fungsi biasa, hapus this.) ──
function tambah() {
  if (!inputBaru.value.trim()) return
  tugas.value.push({ id: Date.now(), teks: inputBaru.value, selesai: false })
  inputBaru.value = ''
}
function toggle(id) {
  const t = tugas.value.find(t => t.id === id)
  if (t) t.selesai = !t.selesai
}
function hapus(id) {
  tugas.value = tugas.value.filter(t => t.id !== id)
}

// ── LIFECYCLE (mounted → onMounted) ──
onMounted(() => {
  tugas.value = JSON.parse(localStorage.getItem('tugas') || '[]')
})
</script>

<template>
  <input v-model="inputBaru" @keyup.enter="tambah" placeholder="Tugas baru..." />
  <button @click="tambah">Tambah</button>

  <div class="filter">
    <button @click="filter = 'semua'">Semua</button>
    <button @click="filter = 'aktif'">Aktif ({{ jumlahAktif }})</button>
    <button @click="filter = 'selesai'">Selesai</button>
  </div>

  <ul>
    <li v-for="t in tugasTampil" :key="t.id">
      <input type="checkbox" :checked="t.selesai" @change="toggle(t.id)" />
      <span :class="{ selesai: t.selesai }">{{ t.teks }}</span>
      <button @click="hapus(t.id)">✕</button>
    </li>
  </ul>
</template>
```

### 📋 Tabel Konversi yang Terjadi di Studi Kasus Ini

| Bagian Options API | Bagian Composition API | Perubahan Kunci |
| --- | --- | --- |
| `data() { return { tugas } }` | `const tugas = ref([])` | Tambah `.value` di script |
| `computed: { tugasTampil() }` | `const tugasTampil = computed(() => ...)` | `this.x` → `x.value` |
| `watch: { tugas: { deep, handler } }` | `watch(tugas, cb, { deep: true })` | Opsi jadi argumen ke-3 |
| `methods: { tambah() }` | `function tambah()` | Hapus semua `this.` |
| `mounted()` | `onMounted(() => ...)` | Import hook dari `'vue'` |

> 🎯 **Perhatikan:** Perilaku aplikasi **sama persis**. Yang berubah hanya *organisasi* dan *sintaks*. Ini bukti bahwa migrasi tidak mengubah fungsionalitas — hanya cara kita menulis dan mengelompokkan logika.

> 💡 **Langkah selanjutnya:** Karena logika `localStorage` (baris `watch` + `onMounted`) bisa dipakai di komponen lain, ini kandidat sempurna untuk diekstrak menjadi `useLocalStorage()` seperti dibahas di Bab 14.

---

## 🩺 26. Diagnosa Sebelum Migrasi: Peta `this`

Sebelum menyentuh satu baris pun, lakukan **diagnosa**: petakan setiap `this.` di komponen lamamu ke kategori yang benar. Ini mencegah kebingungan di tengah jalan.

```js
// Ambil komponen Options API-mu, lalu tandai TIAP this.x:
export default {
  props: { userId: Number },          // this.userId → props (defineProps)
  data() {
    return {
      count: 0,                        // this.count → ref
      user: null,                      // this.user  → ref
    }
  },
  computed: {
    isDewasa() {                       // this.isDewasa → computed
      return this.user?.umur >= 18
    },
  },
  methods: {
    muat() { /* ... */ },              // this.muat → function
  },
}
```

### 🗺️ Tabel Diagnosa: Ubah `this.X` Jadi Apa?

| Pola `this.X` | Asalnya | Jadi di Composition |
| --- | --- | --- |
| `this.count` (ada di `data`) | State lokal | `const count = ref(0)` → `count.value` |
| `this.isDewasa` (ada di `computed`) | Nilai turunan | `const isDewasa = computed(...)` |
| `this.muat()` (ada di `methods`) | Fungsi | `function muat() {}` |
| `this.userId` (ada di `props`) | Props | `const props = defineProps(...)` → `props.userId` |
| `this.$emit('x')` | Event | `const emit = defineEmits(...)` → `emit('x')` |
| `this.$route` / `this.$router` | Vue Router | `useRoute()` / `useRouter()` |
| `this.$refs.el` | Template ref | `const el = ref(null)` + `ref="el"` |
| `this.$nextTick()` | Util Vue | `nextTick()` (import) |

> 💡 **Tips diagnosa cepat:** Buka komponen lama, tekan `Ctrl+F`, cari `this.`. Untuk **setiap** hasil, tanyakan: "ini dari `data`, `computed`, `methods`, `props`, atau helper `$`?" Tulis jawabannya sebagai komentar. Setelah semua terpetakan, migrasi tinggal mengikuti peta.

### 🔎 Contoh Peta Lengkap Satu Komponen

```
this.userId      → props.userId          (defineProps)
this.profil      → profil.value          (ref)
this.isLoading   → isLoading.value       (ref)
this.namaLengkap → namaLengkap.value     (computed)
this.muatProfil  → muatProfil()          (function)
this.$emit       → emit                  (defineEmits)
this.$route      → route                 (useRoute)
```

> ⚠️ **Jangan lompati langkah ini.** Migrasi tanpa peta `this` adalah penyebab #1 error "Cannot read property of undefined" saat refactor. Petakan dulu, baru tulis kode.

---

## 🧯 27. Kesalahan Reaktivitas Saat Migrasi & Cara Menghindarinya

Migrasi sering menimbulkan bug reaktivitas halus. Berikut yang paling sering muncul beserta perbaikannya.

### Kasus A — Lupa `.value` di dalam Kondisi

```js
// ❌ SALAH — count adalah RefImpl, selalu truthy!
const count = ref(0)
if (count) { /* SELALU jalan, bahkan saat count 0 */ }

// ✅ BENAR
if (count.value) { /* cek nilai sebenarnya */ }
```

### Kasus B — Destructuring Props Menghilangkan Reaktivitas

```js
// ❌ SALAH — id kehilangan reaktivitas
const props = defineProps({ id: Number })
const { id } = props           // id jadi nilai statis!

// ✅ BENAR — pakai toRefs / toRef
import { toRefs } from 'vue'
const props = defineProps({ id: Number })
const { id } = toRefs(props)   // id tetap reaktif (ref)
// atau akses langsung: props.id
```

### Kasus C — Computed Dianggap Bisa Ditulis

```js
// ❌ SALAH — computed default READ-ONLY
const double = computed(() => count.value * 2)
double.value = 10              // ❌ warning: computed is readonly

// ✅ BENAR — jika perlu tulis, pakai getter+setter
const double = computed({
  get: () => count.value * 2,
  set: (v) => { count.value = v / 2 },
})
double.value = 10              // ✅ memicu setter
```

### Kasus D — `watch` pada Sumber yang Salah

```js
// ❌ SALAH — watch nilai .value langsung (bukan reaktif)
watch(count.value, (v) => {})  // watch angka statis, tak pernah trigger

// ✅ BENAR — watch ref-nya, atau getter
watch(count, (v) => {})              // watch ref
watch(() => state.count, (v) => {})  // watch getter untuk properti reactive
```

### 📊 Ringkasan Kesalahan Reaktivitas

| Gejala | Penyebab | Perbaikan |
| --- | --- | --- |
| Kondisi selalu true | Lupa `.value` | Tambah `.value` |
| Props tidak update | Destructure langsung | `toRefs(props)` |
| Warning "readonly" | Tulis ke computed | Getter + setter |
| Watch tak jalan | Watch `.value` | Watch ref / getter |
| Reactive putus | Reassign `reactive` | `Object.assign` / `ref` |

> 🎯 **Aturan emas migrasi:** Setiap kali kamu menulis nama variabel `ref` di dalam `<script>`, tanya: "apakah aku butuh nilainya (`.value`) atau ref-nya (tanpa `.value`)?" Di template, Vue auto-unwrap, jadi tidak perlu `.value`.

---

## 🧠 28. Mental Model Baru: "Fungsi yang Mengembalikan Reaktivitas"

Pergeseran mindset terbesar: berhenti berpikir "komponen adalah objek opsi", mulai berpikir "komponen adalah **fungsi** yang menyiapkan reaktivitas lalu membiarkan template memakainya".

```
MENTAL MODEL LAMA (Options API):
┌──────────────────────────────────┐
│ Komponen = OBJEK KONFIGURASI      │
│  { data, computed, methods, ... } │
│  Vue yang "merakit" jadi instance │
│  Akses via `this` (dirakit Vue)   │
└──────────────────────────────────┘

MENTAL MODEL BARU (Composition API):
┌──────────────────────────────────┐
│ Komponen = FUNGSI SETUP           │
│  Deklarasi variabel reaktif       │
│  Susun logika per fitur           │
│  Template pakai variabel langsung │
│  Tidak ada `this` — semua lokal   │
└──────────────────────────────────┘
```

### 🔄 Analogi: Dari "Formulir" ke "Resep"

- **Options API = mengisi formulir.** Ada kolom `data`, kolom `methods`, kolom `computed`. Kamu isi kolom yang sesuai. Vue membaca formulir dan merakit komponen.
- **Composition API = menulis resep.** Kamu tulis langkah demi langkah dengan urutan bebas, kelompokkan bahan yang berkaitan, lalu sajikan (`return` / expose ke template).

```js
// Cara berpikir "resep": kelompokkan per bahan/fitur
// <script setup>

// === Bahan 1: penghitung ===
const count = ref(0)
const double = computed(() => count.value * 2)
function tambah() { count.value++ }

// === Bahan 2: nama ===
const nama = ref('')
const namaBesar = computed(() => nama.value.toUpperCase())

// Template tinggal "menyantap" bahan-bahan di atas
```

### 🧩 Tiga Pertanyaan Kunci Saat Menulis Komponen Baru

| Pertanyaan | Jawaban Composition API |
| --- | --- |
| "Apa saja state yang berubah?" | Deklarasikan sebagai `ref`/`reactive` |
| "Apa nilai yang bergantung pada state?" | Buat `computed` |
| "Apa aksi yang mengubah state?" | Tulis `function` biasa |

> 💡 **Kunci sukses migrasi:** Begitu mental model ini "klik" di kepalamu, migrasi terasa alami. Kamu tidak lagi menerjemahkan `data → ref` secara mekanis; kamu langsung berpikir dalam bahasa fitur dan reaktivitas.

> 🎯 **Penutup bagian:** Composition API bukan tentang menghafal API baru, tapi tentang **mengubah cara memecah masalah**: dari "di kotak opsi mana ini harus diletakkan?" menjadi "fitur apa yang sedang saya bangun, dan reaktivitas apa yang ia butuhkan?"

---

## 🚨 29. Jebakan Umum Pemula di Bab 12

### ❌ Jebakan 1 — Menganggap harus migrasi semua

```js
// ❌ SALAH — migrasi semua komponen sekaligus (berisiko & tidak perlu)
// Mengubah 100 komponen ke <script setup> dalam 1 hari

// ✅ BENAR — migrasi bertahap, komponen baru pakai Composition
// komponen lama biarkan sampai ada kebutuhan nyata
```

---

### ❌ Jebakan 2 — Lupa `.value` di script

```js
// ❌ SALAH
import { ref } from 'vue'
const count = ref(0)
console.log(count)        // ❌ RefImpl, bukan 0
count = 1                 // ❌ tidak bisa reassign ref!

// ✅ BENAR
console.log(count.value)  // 0
count.value = 1           // ✅ ubah lewat .value
// (di template, .value otomatis di-handle Vue)
```

---

### ❌ Jebakan 3 — Mendestruktur `reactive` langsung (kehilangan reaktivitas)

```js
// ❌ SALAH
import { reactive } from 'vue'
const state = reactive({ nama: 'Budi', umur: 25 })
const { nama, umur } = state    // ❌ kehilangan reaktivitas!

// ✅ BENAR — pakai toRefs
import { reactive, toRefs } from 'vue'
const state = reactive({ nama: 'Budi', umur: 25 })
const { nama, umur } = toRefs(state)   // ✅ tetap reaktif
```

---

### ❌ Jebakan 4 — Composable dipakai di luar `<script setup>` tanpa return

```js
// ❌ SALAH — lupa return dari composable
const { count } = useCounter()   // kalau useCounter tidak return count → undefined

// ✅ BENAR — pastikan composable return semua yang dipakai
export function useCounter() {
  const count = ref(0)
  return { count }   // ✅ eksplisit
}
```

---

### ❌ Jebakan 5 — Men campur `this` di Composition API

```js
// ❌ SALAH — this TIDAK ADA di <script setup>
<script setup>
const count = ref(0)
function tambah() {
  this.count++   // ❌ this undefined!
}
</script>

// ✅ BENAR
function tambah() {
  count.value++   // ✅ variabel lokal
}
```

---

### ❌ Jebakan 6 — Menaruh state composable di luar fungsi (global tak sengaja)

```js
// ❌ SALAH — ref di luar fungsi = global!
import { ref } from 'vue'
const count = ref(0)
export function useCounter() {
  return { count }   // semua pemanggil BERBAGI count yang sama
}

// ✅ BENAR — ref di DALAM fungsi = per instance
export function useCounter() {
  const count = ref(0)
  return { count }
}
```

> 📌 Ini juga dibahas di Bab 14, tapi penting diulang: **tempat deklarasi `ref` menentukan apakah state per-instance atau global.**

---

## 📝 30. Ringkasan Bab 12

| Konsep | Penjelasan |
| --- | --- |
| **Masalah Options API** | Logika satu fitur tersebar ke banyak opsi → *scrolling hell* & sulit reuse |
| **Solusi Composition** | Kelompokkan logika **per fitur**, bukan per jenis opsi |
| **Composable** | Fungsi `useX()` yang mengembalikan state & fungsi; reusable lintas komponen |
| **`<script setup>`** | Sintaks ringkas Composition API; tidak perlu `return` manual |
| **Tanpa `this`** | Variabel lokal → bebas arrow-trap, TypeScript ramah |
| **Konversi** | `data`→`ref/reactive`, `computed`→`computed`, `methods`→fungsi, `watch`→`watch`, lifecycle→`onX`, `props`→`defineProps`, `emits`→`defineEmits`, `provide/inject`→tetap ada, `mixins`→Composables |
| **Migrasi** | Bertahap; komponen baru pakai Composition, lama biarkan |
| **Mindset** | Dari "di mana meletakkan opsi" → "bagaimana mengelompokkan logika" |

---

## 🎯 31. Latihan Mandiri

**⭐ Latihan 1 — Identifikasi Masalah**
Ambil komponen `Penghitung.vue` dari Latihan Bab 10. Tulis ulang dengan `<script setup>` menggunakan `ref` untuk `count` dan `computed` untuk `status`. Bandingkan jumlah baris & keterbacaan.

**⭐⭐ Latihan 2 — Rewrite ke Composition**
Ambil komponen `PencarianFilm.vue` (Latihan Bab 10). Tulis ulang dengan `<script setup>`: ganti `data` → `ref`, `watch` → `watch`, `methods` → fungsi biasa. Pastikan perilaku tetap sama.

**⭐⭐⭐ Latihan 3 — Buat Composable Pertamamu**
Ekstrak logika pencarian dari Latihan 2 menjadi `composables/useFilmSearch.js` (mengembalikan `keywordCari`, `hasil`, `isLoading`, `cari`). Lalu gunakan di dua komponen berbeda (`SearchView.vue` & `HomeView.vue`) hanya dengan `import` + destructure.

**⭐⭐⭐⭐ Latihan 4 — Migrasi Nyata (Tantangan)**
Ambil studi kasus `ProfilUser.vue` dari Latihan Bab 10 (Options API). Tulis ulang ke `<script setup>` lengkap dengan `ref`/`computed`/`watch`/`onMounted`/`onUnmounted`, lalu ekstrak logika "fetch user" menjadi `composables/useUserProfile.js`. Pastikan `emits` (`follow`/`unfollow`) diubah ke `defineEmits`, dan `props.userId` ke `defineProps`. Bandingkan seberapa mudah `useUserProfile` dipakai ulang di komponen lain dibandingkan versi Options API.

**⭐⭐⭐⭐ Latihan 5 — Wizard Sendiri (Eksplorasi)**
Berdasarkan studi kasus bagian 23, buat `composables/useStepper.js` (mirip `useWizard`) yang menerima jumlah langkah dan mengembalikan `langkahSaatIni`, `isPertama`, `isTerakhir`, `lanjut()`, `kembali()`. Gunakan di komponen `Onboarding.vue` dengan 4 langkah, di mana tiap langkah menampilkan konten berbeda. Buktikan composable bisa dipakai ulang tanpa menyalin logika.

---

*Lanjut ke ➡️ **BAGIAN IV — Composition API (Bab 13 — Composition API & `<script setup>`)***
