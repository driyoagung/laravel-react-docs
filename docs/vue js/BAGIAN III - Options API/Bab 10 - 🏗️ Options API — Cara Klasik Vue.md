# 🏗️ Bab 10 — Options API — Cara Klasik Vue

> *"Sebelum ada Composition API, hampir seluruh aplikasi Vue di dunia ditulis dengan gaya ini. Memahaminya bukan sekadar nostalgia — ia adalah kunci untuk membaca kode lama, memahami dokumentasi lama, dan benar-benar mengerti mengapa Vue 3 menambahkan Composition API."*

---

> **🧠 Apa Itu Options API?**
>
> Options API adalah **cara klasik** (dan masih resmi) untuk menulis komponen Vue. Kamu mendefinisikan komponen sebagai satu objek `export default { ... }`, lalu memasukkan "opsi" ke dalamnya: `data`, `methods`, `computed`, `watch`, `props`, `emits`, dan *lifecycle hooks*. Vue membaca objek itu, merangkai semuanya, dan menghubungkannya lewat satu kata kunci ajaib: **`this`**.
>
> Gaya ini sudah ada sejak Vue 2 dan tetap **didukung penuh** di Vue 3. Ia disebut "Options" karena komponenmu benar-benar berupa kumpulan *opsi* yang masing-masing punya tugas jelas.

---

> **🏗️ Analogi Sederhana:**
>
> Bayangkan Options API seperti **lemari arsip berlabel rapi**. Ada laci khusus untuk "Data" (state), laci untuk "Fungsi" (methods), laci untuk "Hitungan Otomatis" (computed), dan laci untuk "Pengawas" (watch). Setiap dokumen harus masuk ke lacinya masing-masing. Keuntungannya: siapa pun yang membuka lemari ini langsung tahu ke mana mencari. Kekurangannya: kalau satu "proyek" (fitur) terdiri dari dokumen di banyak laci, kamu harus bolak-balik buka laci untuk memahaminya utuh. Itulah inti kekuatan sekaligus kelemahan Options API.

---

## 📋 Daftar Isi Bab 10

1. Sejarah Singkat: Dari Vue 2 ke Vue 3
2. Anatomi Lengkap Sebuah Komponen Options API
3. Opsi `name` — Identitas Komponen
4. Opsi `components` — Mendaftarkan Komponen Anak
5. Opsi `props` — Menerima Data dari Parent
6. Opsi `emits` — Mengirim Event ke Parent
7. Opsi `data()` — State Lokal Komponen
8. Opsi `computed` — Data Turunan yang Cerdas
9. Opsi `watch` — Mengawasi Perubahan
10. Opsi `methods` — Fungsi-fungsi Komponen
11. Opsi Lifecycle Hooks — Siklus Hidup Komponen
12. Kata Kunci `this` — Jantung Options API
13. ⚠️ Jebakan `this` pada Arrow Function (Mendalam)
14. Kelebihan & Kekurangan Options API
15. Kapan Masih Menggunakan Options API?
16. Perbandingan dengan Composition API (Preview)
17. 🎬 Studi Kasus — Komponen Detail Film Lengkap
18. 🚨 Jebakan Umum Pemula di Bab 10
19. 📝 Ringkasan Bab 10
20. 🎯 Latihan Mandiri

---

## 🕰️ 1. Sejarah Singkat: Dari Vue 2 ke Vue 3

Sebelum kita menyelami kode, penting memahami *posisi* Options API dalam sejarah Vue.

```js
// ─────────────────────────────────────────────────────────────
// VUE 2 (2016–2020): HANYA ada Options API
// ─────────────────────────────────────────────────────────────
// Semua komponen wajib ditulis dengan gaya objek berisi opsi.
// Tidak ada Composition API, tidak ada <script setup>.

export default {
  data() { return { count: 0 } },
  methods: { tambah() { this.count++ } }
}
```

```js
// ─────────────────────────────────────────────────────────────
// VUE 3 (2020–sekarang): Options API TETAP didukung
// ─────────────────────────────────────────────────────────────
// Vue 3 MENAMBAHKAN Composition API sebagai alternatif,
// TAPI Options API tidak dihapus. Kamu bebas pilih salah satu
// — bahkan mencampurnya dalam satu komponen.

// Cara lama (masih jalan):
export default {
  data() { return { count: 0 } }
}

// Cara baru (opsional):
// <script setup> ... const count = ref(0)
```

> 💡 **Mengapa Vue 3 Tidak Membuang Options API?**
>
> Karena jutaan baris kode produksi di dunia masih menggunakannya. Menghapusnya akan merusak ekosistem. Vue menjaga *backward compatibility* — filosofi inti Evan You sejak awal. Jadi Options API bukan "fitur usang", melainkan "cara klasik yang masih sah".

| Versi Vue | API Utama | Status Options API |
| --- | --- | --- |
| Vue 2 | Options API | Satu-satunya cara |
| Vue 3 | Composition + Options | Options API tetap penuh didukung |

---

## 🔬 2. Anatomi Lengkap Sebuah Komponen Options API

Berikut kerangka utuh sebuah komponen Options API. Perhatikan bagaimana setiap keping logika ditaruh di "kotak" masing-masing:

```vue
<script>
// ─────────────────────────────────────────────────────────────
// BAGIAN 1: EXPORT DEFAULT
// Komponen = satu objek berisi opsi. Vue membaca objek ini.
// ─────────────────────────────────────────────────────────────
export default {
  // ① Metadata: nama komponen (untuk devtools & recursive)
  name: 'DetailFilm',

  // ② Daftarkan komponen anak yang dipakai di template
  components: { MovieCard, Navbar },

  // ③ Data dari parent (wajib bertipe & bisa required)
  props: {
    filmId: { type: Number, required: true }
  },

  // ④ Event yang boleh di-emit ke parent
  emits: ['film-dipilih', 'ditutup'],

  // ⑤ STATE LOKAL — selalu berupa fungsi yang return objek
  data() {
    return {
      film: null,
      isLoading: false,
      errorPesan: '',
    }
  },

  // ⑥ DATA TURUNAN — dihitung otomatis, di-cache
  computed: {
    judulLengkap() {
      return `${this.film?.title} (${this.film?.release_date?.slice(0,4)})`
    },
  },

  // ⑦ PENGAWAS — jalankan side-effect saat data berubah
  watch: {
    filmId(idBaru) {
      this.ambilDetailFilm(idBaru)   // reload saat id ganti
    }
  },

  // ⑧ FUNGSI — bisa dipanggil dari template & opsi lain
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

  // ⑨ LIFECYCLE HOOKS — titik tertentu dalam hidup komponen
  mounted() {
    this.ambilDetailFilm(this.filmId) // fetch saat pertama kali tampil
  },
  unmounted() {
    // tempat membersihkan timer / listener
  }
}
</script>
```

Mari kita bedah setiap opsinya satu per satu di bagian berikutnya.

> 📌 **Aturan Emas Options API:**
> Semua opsi diakses lewat **`this`** (misal `this.film`, `this.ambilDetailFilm`). `this` merujuk ke **instance komponen Vue**, bukan fungsi JavaScript biasa. Ini kunci sekaligus sumber jebakan terbesar (lihat bagian 13).

---

## 🏷️ 3. Opsi `name` — Identitas Komponen

```js
export default {
  // name: string — nama komponen
  name: 'DetailFilm',

  // ...
}
```

**Fungsi `name`:**
1. **DevTools**: Di Vue DevTools, komponen akan tampil sebagai `DetailFilm` (bukan `<Anonymous>`).
2. **Recursive component**: Komponen bisa memanggil dirinya sendiri lewat `<DetailFilm>` jika namanya didaftarkan.
3. **Keep-alive**: Diperlukan agar `<keep-alive>` bisa mengenali komponen berdasarkan nama.

```vue
<!-- Recursive: komponen pohon menu yang memanggil dirinya -->
<template>
  <div>
    <span>{{ node.label }}</span>
    <!-- memanggil dirinya sendiri untuk children -->
    <MenuItem
      v-for="child in node.children"
      :key="child.id"
      :node="child"
    />
  </div>
</template>

<script>
export default {
  name: 'MenuItem',          // ← wajib ada agar <MenuItem> bisa recursive
  props: { node: Object }
}
</script>
```

> 💡 **Tips:** Beri `name` yang **PascalCase** dan deskriptif. Di `<script setup>`, kamu bisa menulis `defineOptions({ name: 'DetailFilm' })` di dalamnya.

---

## 🧩 4. Opsi `components` — Mendaftarkan Komponen Anak

```vue
<script>
// ① Import komponen anak dari file lain
import MovieCard from './MovieCard.vue'
import Navbar    from './Navbar.vue'

export default {
  // ② Daftarkan agar bisa dipakai di template
  components: {
    MovieCard,   // ← sekarang <MovieCard> valid di template
    Navbar,      // ← sekarang <Navbar> valid di template
  },
}
</script>

<template>
  <Navbar />
  <MovieCard :film="filmTerpilih" />
</template>
```

**Aturan penting:**
- Tanpa mendaftarkan di `components`, tag `<MovieCard>` **tidak dikenali** (Vue menganggapnya elemen HTML biasa).
- Nama yang didaftarkan bisa berbeda dari nama file:

```js
export default {
  components: {
    // Key = nama tag di template, Value = komponen yang diimpor
    KartuFilm: MovieCard,   // pakai <KartuFilm> di template
  }
}
```

> ⚠️ **Perbedaan dengan `<script setup>`:** Di `<script setup>` (Composition API), komponen yang diimpor **langsung otomatis tersedia** di template tanpa perlu mendaftarkan ke opsi `components`. Ini salah satu alasan `<script setup>` lebih ringkas.

---

## 📥 5. Opsi `props` — Menerima Data dari Parent

`props` adalah data yang **diterima dari parent**. Di Options API, deklarasikan sebagai objek berisi spesifikasi tiap prop.

```js
export default {
  props: {
    // ── Prop paling sederhana: hanya tipe ───────────────
    judul: String,

    // ── Prop lengkap dengan validasi ────────────────────
    filmId: {
      type: Number,            // tipe data (String, Number, Boolean,
                               // Array, Object, Function, Date, Symbol)
      required: true,          // wajib dikirim parent, kalau tidak → warning
    },

    rating: {
      type: Number,
      default: 0,             // nilai cadangan kalau tidak dikirim
      // validasi custom (return false → warning di console)
      validator: (v) => v >= 0 && v <= 10,
    },

    poster: {
      type: String,
      default: '/images/no-poster.jpg',  // fallback URL
    },
  },
}
```

### Mengakses props di dalam komponen

Semua props bisa diakses lewat **`this`**:

```js
export default {
  props: { filmId: Number },
  mounted() {
    console.log(this.filmId)   // akses prop lewat this
  },
  methods: {
    tampil() {
      return `Film #${this.filmId}`  // dipakai di method
    }
  }
}
```

```vue
<template>
  <!-- Di template, prop langsung bisa dipakai -->
  <h1>{{ judul }}</h1>
  <span>⭐ {{ rating }}</span>
</template>
```

| Skenario | Deklarasi |
| --- | --- |
| Tipe saja | `judul: String` |
| Wajib diisi | `{ type: String, required: true }` |
| Ada default | `{ type: Number, default: 0 }` |
| Default object/array | `{ type: Object, default: () => ({}) }` ⚠️ pakai factory! |
| Validasi custom | `{ validator: (v) => v > 0 }` |

> ⚠️ **Jebakan default object/array:** Jangan tulis `default: {}` atau `default: []` (objek langsung). Semua instance akan **berbagi referensi yang sama**! Selalu pakai *factory function*: `default: () => ({})`.

> 💡 **Props adalah read-only.** Komponen anak **tidak boleh** mengubah prop. Kalau perlu nilai turunan, buat `computed` atau `data` lokal (lihat bab selanjutnya). Mengubah prop langsung melanggar *one-way data flow*.

---

## 📤 6. Opsi `emits` — Mengirim Event ke Parent

`emits` mendeklarasikan event yang akan dikirim ke parent lewat `this.$emit(...)`.

```js
export default {
  props: { film: Object },

  // Deklarasikan semua event yang di-emit (array sederhana)
  emits: ['film-dipilih', 'ditutup'],

  // Bisa juga berupa objek dengan validasi payload:
  emits: {
    'film-dipilih': (payload) => {
      // validasi: payload harus punya id
      if (payload && typeof payload.id === 'number') return true
      console.warn('film-dipilih butuh payload ber-id number!')
      return false
    }
  },

  methods: {
    pilih() {
      // kirim event + data ke parent
      this.$emit('film-dipilih', this.film)
    },
    tutup() {
      this.$emit('ditutup')
    }
  }
}
```

```vue
<template>
  <div>
    <button @click="pilih">Pilih Film</button>
    <button @click="$emit('ditutup')">Tutup</button>
  </div>
</template>
```

```vue
<!-- Parent mendengarkan event -->
<DetailFilm
  :film="film"
  @film-dipilih="bukaModal"
  @ditutup="tutupModal"
/>
```

> 💡 **Mengapa mendeklarasikan `emits`?**
> 1. Dokumentasi otomatis: orang lain langsung tahu event apa yang dikirim komponen.
> 2. Mencegah Vue menangkap event sebagai atribut DOM (terutama untuk nama seperti `click`).
> 3. Bisa memvalidasi payload seperti pada contoh di atas.

---

## 💾 7. Opsi `data()` — State Lokal Komponen

`data()` adalah **fungsi yang wajib mengembalikan objek**. Di sinilah **state lokal** komponen disimpan. Vue menjadikan setiap properti di dalamnya *reactive*.

```js
export default {
  data() {
    // ── SELALU return objek baru ──
    return {
      film: null,          // akan diisi setelah fetch
      isLoading: false,    // indikator loading
      errorPesan: '',      // pesan error kalau gagal
      halaman: 1,          // state pagination
      daftarGenre: [],     // array state
    }
  },
}
```

### CARA SALAH vs CARA BENAR

```js
// ❌ SALAH — data sebagai objek langsung (bukan fungsi)
export default {
  data: {
    count: 0,   // ⚠️ SEMUA instance berbagi object yang SAMA!
  }
}
// Akibatnya: mengubah count di satu komponen mengubah semua komponen!
```

```js
// ✅ BENAR — data sebagai fungsi yang return objek
export default {
  data() {
    return {
      count: 0,   // ✅ tiap instance dapat object BARU & independen
    }
  }
}
```

> ⚠️ **Ini bug klasik pemula!** Karena Vue membuat *banyak instance* dari satu definisi komponen (misal `v-for`), `data()` dipanggil sekali per instance. Mengembalikan objek baru tiap panggilan menjamin tiap instance punya state sendiri.

### Mengubah data & reaktivitas

```js
export default {
  data() { return { count: 0, user: { nama: 'Budi' } } },
  methods: {
    tambah() {
      this.count++                 // ✅ reaktif — tampilan update
      this.user.nama = 'Ani'       // ✅ reaktif — objek nested ikut terpantau
    }
  }
}
```

> 💡 **Vue 3 pakai Proxy**, jadi properti *nested* (object di dalam object) ikut reactive — berbeda dengan Vue 2 yang punya keterbatasan di nested property.

---

## 🧮 8. Opsi `computed` — Data Turunan yang Cerdas

`computed` adalah **properti turunan** (derived state). Nilainya dihitung dari data lain dan **otomatis diperbarui** bila dependensinya berubah. Yang paling penting: hasilnya **di-cache**.

```js
export default {
  data() { return { harga: 150000, jumlah: 3, diskon: 10 } },

  computed: {
    // ── Computed sederhana ──
    subtotal() {
      return this.harga * this.jumlah
    },

    // ── Computed bisa merujuk computed lain ──
    totalDiskon() {
      return this.subtotal * (this.diskon / 100)
    },

    totalBayar() {
      return this.subtotal - this.totalDiskon
    },

    // ── Computed dengan formatting ──
    hargaFormat() {
      return 'Rp ' + this.totalBayar.toLocaleString('id-ID')
    },

    // ── Computed bisa pakai optional chaining ──
    judulLengkap() {
      return `${this.film?.title} (${this.film?.release_date?.slice(0,4)})`
    },
  },
}
```

```vue
<template>
  <p>Subtotal : Rp {{ subtotal.toLocaleString('id-ID') }}</p>
  <p>Diskon   : Rp {{ totalDiskon.toLocaleString('id-ID') }}</p>
  <p>Total    : {{ hargaFormat }}</p>
</template>
```

### Computed vs Method — Mengapa Computed Menang?

```js
export default {
  data() { return { films: [/* 1000 film */] } },

  computed: {
    // ✅ Dihitung ulang HANYA bila 'films' berubah
    filmAksi() {
      return this.films.filter(f => f.genre === 'action')
    }
  },

  methods: {
    // ❌ Dihitung ULANG setiap template re-render
    getFilmAksi() {
      return this.films.filter(f => f.genre === 'action')
    }
  }
}
```

| | `computed` | `method` |
| --- | --- | --- |
| Eksekusi | Hanya saat dependensi berubah | Setiap template re-render |
| Caching | ✅ Ya | ❌ Tidak |
| Kegunaan | Data turunan yang sering diakses | Aksi dipicu event |
| Return | Wajib return nilai | Boleh tidak return |

> 💡 **Aturan praktis:** Kalau nilainya "diturunkan" dari data lain dan dipakai di template → pakai `computed`. Kalau itu "tindakan" → pakai `method`.

### Computed dengan Setter (Opsional)

Computed biasanya hanya *getter*. Tapi bisa punya *setter* juga:

```js
export default {
  data() { return { namaDepan: 'Budi', namaBelakang: 'Santoso' } },
  computed: {
    namaLengkap: {
      // getter: digabung
      get() { return `${this.namaDepan} ${this.namaBelakang}` },
      // setter: kalau di-assign, pecah lagi
      set(nilai) {
        const [dep, bel] = nilai.split(' ')
        this.namaDepan = dep
        this.namaBelakang = bel
      }
    }
  }
}
```

```js
// Pemakaian:
this.namaLengkap = 'Ani Wijaya'
// → this.namaDepan jadi 'Ani', this.namaBelakang jadi 'Wijaya'
```

---

## 👁️ 9. Opsi `watch` — Mengawasi Perubahan

`watch` digunakan untuk **side-effect** (efek samping) ketika sebuah data berubah — misal memanggil API, menyimpan ke `localStorage`, atau memuat ulang data.

```js
export default {
  data() { return { keyword: '', hasil: [], genreDipilih: 'semua' } },

  watch: {
    // ── Watch satu prop/data ──
    keyword(nilaiBaru, nilaiLama) {
      console.log(`Dari "${nilaiLama}" → "${nilaiBaru}"`)
      if (nilaiBaru.length >= 2) this.cari()
    },

    // ── Watch dengan opsi (deep, immediate) ──
    genreDipilih: {
      handler(nilaiBaru) {
        this.ambilFilmByGenre(nilaiBaru)
      },
      immediate: true,   // jalankan SEKETIKA saat komponen dibuat
      deep: true,         // pantau perubahan di dalam object/array
    },

    // ── Watch object bersarang (dot notation) ──
    'user.alamat.kota'(kotaBaru) {
      console.log('Pindah ke', kotaBaru)
    }
  },

  methods: {
    async cari() { /* ... */ },
    async ambilFilmByGenre(g) { /* ... */ }
  }
}
```

### `deep: true` — Hati-hati Performa!

```js
export default {
  data() { return { form: { nama: '', email: '' } } },
  watch: {
    form: {
      handler() { console.log('form berubah') },
      deep: true,   // ⚠️ jelajahi SELURUH properti form secara rekursif
    }
  }
}
```

> ⚠️ **`deep: true` bisa mahal.** Vue harus menelusuri setiap properti secara rekursif. Untuk object besar, lebih baik watch properti spesifik (`'form.nama'`) daripada seluruh object.

### Tabel Opsi Watch

| Opsi | Fungsi |
| --- | --- |
| `immediate: true` | Jalankan handler saat komponen dibuat (tidak tunggu perubahan) |
| `deep: true` | Pantau perubahan nested di object/array |
| `handler` | Fungsi yang dipanggil saat sumber berubah |

> 💡 **`watch` vs `computed` dalam satu kalimat:** `computed` untuk **menghasilkan nilai baru**, `watch` untuk **bereaksi terhadap perubahan** (efek samping).

---

## 🛠️ 10. Opsi `methods` — Fungsi-fungsi Komponen

`methods` berisi fungsi yang bisa dipanggil dari template, dari opsi lain, maupun dari event.

```js
export default {
  data() { return { count: 0 } },

  methods: {
    // ── Method biasa (function, BUKAN arrow!) ──
    tambah() {
      this.count++                  // akses state lewat this
    },

    // ── Method async (fetch data) ──
    async ambilDetailFilm(id) {
      this.isLoading = true
      this.film = await fetchFilm(id)
      this.isLoading = false
    },

    // ── Method dengan parameter dari template ──
    hapus(id) {
      this.daftar = this.daftar.filter(f => f.id !== id)
    },

    // ── Method yang return nilai ──
    formatRupiah(angka) {
      return 'Rp ' + angka.toLocaleString('id-ID')
    }
  }
}
```

```vue
<template>
  <button @click="tambah">Tambah</button>
  <button @click="hapus(film.id)">Hapus</button>
  <p>{{ formatRupiah(harga) }}</p>
</template>
```

> ⚠️ **Ingat aturan `this` (akan dibahas panjang lebar di bagian 13):**
> Method harus didefinisikan dengan `function` biasa, **BUKAN arrow function**, supaya `this` merujuk ke instance Vue.

---

## 🔄 11. Opsi Lifecycle Hooks — Siklus Hidup Komponen

Setiap komponen Vue melewati siklus: **dibuat → dipasang ke DOM → di-update → dibongkar**. Vue menyediakan *hook* (titik) di mana kamu bisa menjalankan kode.

```js
export default {
  // ── SEBELUM instance dibuat (jarang dipakai) ──
  beforeCreate() {
    // data() & computed BELUM tersedia di sini
  },

  // ── SETELAH instance dibuat, SEBELUM template di-render ──
  created() {
    // data(), computed, methods SUDAH tersedia
    // BAGUS untuk fetch data awal (tanpa butuh DOM)
    this.ambilGenre()
  },

  // ── SEBELUM dipasang ke DOM ──
  beforeMount() {
    // template belum jadi DOM sungguhan
  },

  // ── SETELAH dipasang ke DOM ✅ (paling sering dipakai) ──
  mounted() {
    // DOM SUDAH ada → bisa akses element, init library pihak ke-3
    this.ambilDetailFilm(this.filmId)
    this.interval = setInterval(this.refresh, 5000)
  },

  // ── SEBELUM di-update (data berubah, DOM belum) ──
  beforeUpdate() {
    // hati-hati: jangan ubah state di sini (bisa infinite loop)
  },

  // ── SETELAH di-update (DOM sudah sinkron) ──
  updated() {
    // DOM sudah mencerminkan data terbaru
  },

  // ── SEBELUM dibongkar ──
  beforeUnmount() {
    // kesempatan terakhir sebelum hilang
  },

  // ── SETELAH dibongkar ✅ (tempat cleanup) ──
  unmounted() {
    // BERSIHKAN timer & listener → cegah memory leak
    clearInterval(this.interval)
  },
}
```

### Diagram Siklus Hidup

```
Instance dibuat
      │
      ▼
 beforeCreate → created        ← data & methods siap
      │
      ▼
 beforeMount  → mounted ✅      ← DOM siap (fetch, init)
      │
   [data berubah?]
      │
      ▼
 beforeUpdate → updated         ← DOM disesuaikan
      │
   [komponen dihapus?]
      │
      ▼
 beforeUnmount → unmounted ✅   ← cleanup (timer, listener)
```

| Hook | Kapan Dipakai |
| --- | --- |
| `created` | Fetch data awal (belum butuh DOM) |
| `mounted` | Akses DOM, init library, mulai interval |
| `updated` | Reaksi setelah DOM berubah (jarang) |
| `unmounted` | Bersihkan `setInterval`, `addEventListener`, subscription |

> ⚠️ **Memory Leak adalah Bug Tersembunyi!** Selalu bersihkan `setInterval`/`addEventListener` di `unmounted`. Kalau lupa, kode terus jalan di memori meski komponen tak tampil → aplikasi makin lama makin lambat.

---

## 🔑 12. Kata Kunci `this` — Jantung Options API

Di Options API, **`this`** merujuk ke **instance komponen Vue**. Melaluinya kamu mengakses segalanya:

```js
export default {
  data() { return { count: 0, nama: 'Budi' } },
  computed: { double() { return this.count * 2 } },
  methods: {
    contoh() {
      // Akses state
      console.log(this.count)        // 0
      // Akses computed
      console.log(this.double)       // 0
      // Akses method lain
      this.sapa()
      // Akses props
      console.log(this.filmId)
      // Emit event
      this.$emit('oke')
      // Akses DOM ref
      console.log(this.$refs.tombol)
    },
    sapa() { console.log('Halo ' + this.nama) }
  }
}
```

### Apa yang ada di `this`?

| Akses | Contoh |
| --- | --- |
| State (`data`) | `this.count` |
| Computed | `this.double` |
| Methods | `this.sapa()` |
| Props | `this.filmId` |
| Emit | `this.$emit('x')` |
| Refs | `this.$refs.nama` |
| Route | `this.$route` (jika vue-router terpasang) |
| Router | `this.$router` |

> 💡 **`this` adalah "jembatan"** yang diikat (bind) oleh Vue ke instance komponen. Inilah yang membuat Options API terasa "ajaib" — tapi juga sumber kebingungan terbesar, terutama dengan fungsi arrow (bagian berikutnya).

---

## ⚠️ 13. Jebakan `this` pada Arrow Function (Mendalam)

Ini adalah **kesalahan paling umum** pemula Vue. Intinya: **arrow function tidak punya `this` sendiri**, melainkan menurunkan (inherit) `this` dari lingkungan tempat ia didefinisikan.

### ❌ SALAH 1 — Arrow function sebagai method

```js
export default {
  data() { return { pesan: 'halo' } },
  methods: {
    // ❌ Method didefinisikan sebagai arrow function
    tampil: () => {
      console.log(this.pesan)   // ❌ undefined! this KOSONG
      // Arrow function mengunci this saat DEFINISI,
      // bukan saat PEMANGGILAN. Di sini this = undefined.
    }
  }
}
```

**Mengapa gagal?** Vue memanggil `tampil()` dengan mengharapkan `this` = instance komponen. Tapi karena `tampil` adalah arrow function, `this`-nya sudah "terkunci" pada saat komponen didefinisikan (yang saat itu tidak ada instance Vue), sehingga `this` = `undefined`.

### ✅ BENAR 1 — Function biasa untuk method

```js
export default {
  data() { return { pesan: 'halo' } },
  methods: {
    // ✅ Function biasa → Vue bisa bind this ke instance
    tampil() {
      console.log(this.pesan)   // ✅ 'halo'
    }
  }
}
```

### ❌ SALAH 2 — Arrow function di callback `.map`/`setTimeout` yang butuh `this`

```js
export default {
  data() { return { daftar: [1,2,3] } },
  methods: {
    proses() {
      // ❌ this di dalam map adalah undefined
      const hasil = this.daftar.map(function (n) {
        return n * this.pengali   // ❌ this.pengali undefined!
      })
    }
  }
}
```

### ✅ BENAR 2 — Arrow function DI DALAM method (ini aman!)

```js
export default {
  data() { return { daftar: [1,2,3], pengali: 2 } },
  methods: {
    proses() {
      // ✅ Arrow function di SINI menurunkan this dari proses()
      // yang merupakan method biasa (this = instance Vue)
      const hasil = this.daftar.map((n) => {
        return n * this.pengali   // ✅ this.pengali = 2
      })
    },

    ambilData() {
      // ✅ setTimeout dengan arrow → this benar
      setTimeout(() => {
        this.pesan = 'berhasil'   // ✅ this = instance Vue
      }, 1000)
    }
  }
}
```

**Mengapa arrow di dalam method justru MENYELAMATKAN kita?** Karena arrow function *menurunkan* `this` dari fungsi yang membungkusnya (`proses`, `ambilData`) — yang merupakan method biasa dengan `this` = instance Vue. Jadi `this` tetap merujuk ke komponen.

### ❌ SALAH 3 — Event handler `.then()` dengan function biasa

```js
export default {
  methods: {
    async load() {
      fetch('/api').then(function (res) {
        this.data = res          // ❌ this = undefined di sini
      })
    }
  }
}
```

### ✅ BENAR 3 — Pakai arrow di `.then()`

```js
export default {
  methods: {
    async load() {
      fetch('/api').then((res) => {
        this.data = res          // ✅ this benar (arrow inherit)
      })
      // ATAU lebih baik: pakai async/await
      const res = await fetch('/api')
      this.data = res            // ✅ paling jelas
    }
  }
}
```

### 📊 Ringkasan Aturan `this`

| Lokasi | Gunakan | Alasan |
| --- | --- | --- |
| Method di `methods` | `function` biasa | Vue butuh bind `this` ke instance |
| Callback di dalam method (`setTimeout`, `.map`, `.then`, `.forEach`) | Arrow `() =>` | Menurunkan `this` yang benar dari method pembungkus |
| Arrow function sebagai method | ❌ JANGAN | `this` jadi `undefined` |

> ⚠️ **Aturan Emas:**
> - **Method** → Selalu `function` biasa (bukan arrow).
> - **Di dalam method** (callback, `setTimeout`, `.then`) → Arrow function aman & disarankan.

> 💡 **Tips Debug:** Kalau kamu lihat error `Cannot read properties of undefined (reading 'xxx')` di method Vue, curigai arrow function yang salah tempat. Ganti ke `function() {}` atau pastikan `this` di-bind benar.

---

## 📊 14. Kelebihan & Kekurangan Options API

| ✅ Kelebihan | ❌ Kekurangan |
| --- | --- |
| Sangat mudah dibaca untuk pemula | Logika tersebar (data di `data()`, method di `methods()`, dst) |
| Struktur konsisten & predictable | Sulit extract & reuse logika antar komponen |
| Dokumentasi & contoh online melimpah | `this` bisa membingungkan & rawan arrow-trap |
| Cocok untuk komponen sederhana | Tidak cocok untuk komponen dengan banyak fitur |
| Tidak butuh memahami closure/JS modern | TypeScript inference lebih lemah |

### Penjelasan Lebih Dalam

**Mengapa mudah dibaca?** Karena kamu tahu persis ke mana meletakkan sesuatu: state ke `data`, fungsi ke `methods`, nilai turunan ke `computed`. Seperti lemari berlabel — siapa pun langsung paham.

**Mengapa `this` membingungkan?** Karena `this` di Vue bukan konsep JavaScript murni — ia diikat oleh framework. Pemula sering bingung saat callback asinkron "kehilangan" `this` (bagian 13).

**Mengapa sulit reuse logika?** Options API mengandalkan **mixins** untuk berbagi logika, tapi mixins punya masalah *collision* nama dan sulit dilacak asalnya. (Bandingkan dengan Composables di Composition API — bahas di Bagian IV.)

> 📌 **Catatan Penting:** Options API **masih didukung penuh di Vue 3** dan tidak akan dibuang. Memahaminya krusial kalau kamu memelihara kode lama atau membaca tutorial lama.

---

## 🤔 15. Kapan Masih Menggunakan Options API?

Meski Composition API adalah masa depan, Options API tetap punya tempat:

```js
// ✅ GUNAKAN Options API kalau:
// 1. Komponen sederhana (CRUD form, kartu statis, modal kecil)
export default {
  props: { title: String },
  data() { return { isOpen: false } },
  methods: { toggle() { this.isOpen = !this.isOpen } }
}

// 2. Tim masih terbiasa dengan Vue 2 style
// 3. Menulis contoh/edukasi yang ingin mudah dipahami pemula
// 4. Memelihara legacy codebase yang sudah pakai Options API
```

| Skenario | Rekomendasi |
| --- | --- |
| Komponen kecil & sederhana | ✅ Options API nyaman |
| Komponen besar dengan banyak fitur | 🔄 Composition API lebih baik |
| Legacy / Vue 2 codebase | ✅ Tetap Options API |
| Butuh TypeScript ketat | 🔄 Composition API |
| Tim pemula belajar Vue | ✅ Options API sebagai pengantar |

> 💡 **Fakta penting:** Banyak **tutorial lama** dan **dokumentasi** di internet masih pakai Options API. Kalau kamu bisa membacanya, kamu bisa belajar dari jutaan sumber gratis. Jangan anggap Options API "ketinggalan zaman" — ia hanya "cara klasik yang masih sah".

---

## ⚖️ 16. Perbandingan dengan Composition API (Preview)

Sebagai pengantar ke Bagian IV, mari lihat komponen yang SAMA ditulis dua cara:

```js
// ════════════════════════════════════════════
// OPTIONS API (cara klasik)
// ════════════════════════════════════════════
export default {
  data() { return { count: 0 } },
  computed: { double() { return this.count * 2 } },
  methods: { tambah() { this.count++ } },
  mounted() { console.log('mounted') }
}
```

```vue
<!-- ════════════════════════════════════════════
     COMPOSITION API + <script setup> (cara modern)
     ════════════════════════════════════════════ -->
<script setup>
import { ref, computed, onMounted } from 'vue'

const count  = ref(0)                  // state
const double = computed(() => count.value * 2)  // computed
function tambah() { count.value++ }    // method
onMounted(() => console.log('mounted'))// lifecycle
</script>
```

| Aspek | Options API | Composition API |
| --- | --- | --- |
| Akses state | `this.count` | `count.value` (di script) |
| Pengelompokan | Berdasarkan *jenis opsi* | Berdasarkan *fitur* |
| `this` | Wajib & rawan arrow-trap | Tidak ada `this` |
| Reuse logika | Mixins (rawan collision) | Composables (bersih) |
| TypeScript | Inference lemah | Inference kuat |

> 💡 **Kesimpulan sementara:** Keduanya menghasilkan komponen yang sama secara fungsional. Composition API unggul di komponen kompleks & reuse; Options API unggul di kesederhanaan & keterbacaan. Kamu akan melihat perbandingan lengkap di Bab 12.

---

## 🎬 17. Studi Kasus — Komponen Detail Film Lengkap

Mari gabungkan hampir semua opsi Bab 10 ke dalam satu komponen nyata: **`DetailFilm.vue`** yang mengambil data film dari API berdasarkan `filmId` prop, menampilkan loading/error, mendukung watchlist, dan meng-emit event saat dipilih.

```vue
<template>
  <div class="detail-film">
    <!-- Loading state -->
    <div v-if="isLoading" class="loading">
      ⏳ Memuat detail film...
    </div>

    <!-- Error state -->
    <div v-else-if="errorPesan" class="error">
      ❌ {{ errorPesan }}
      <button @click="ambilDetailFilm(filmId)">Coba Lagi</button>
    </div>

    <!-- Data tersedia -->
    <div v-else-if="film" class="konten">
      <img :src="posterUrl" :alt="film.title" class="poster" />
      <div class="info">
        <h1>{{ judulLengkap }}</h1>
        <p class="rating">⭐ {{ film.vote_average }}</p>
        <p>{{ film.overview }}</p>

        <!-- Computed: cek apakah di watchlist -->
        <button @click="toggleWatchlist">
          {{ sudahDiWatchlist ? '➖ Hapus Watchlist' : '➕ Tambah Watchlist' }}
        </button>

        <!-- Emit ke parent -->
        <button @click="pilihFilm">▶ Putar</button>
      </div>
    </div>
  </div>
</template>

<script>
// ─────────────────────────────────────────────────────────────
// STUDI KASUS: semua opsi Options API bekerja bersama
// ─────────────────────────────────────────────────────────────
import { fetchFilm, fetchPoster } from '@/api/tmdb'

export default {
  // ① name
  name: 'DetailFilm',

  // ② props dari parent
  props: {
    filmId: { type: Number, required: true },
  },

  // ③ emits ke parent
  emits: ['film-dipilih', 'tambah-watchlist', 'hapus-watchlist'],

  // ④ data / state lokal
  data() {
    return {
      film: null,
      isLoading: false,
      errorPesan: '',
      watchlist: [],     // array id film di watchlist
    }
  },

  // ⑤ computed (data turunan)
  computed: {
    posterUrl() {
      if (!this.film?.poster_path) return '/no-poster.jpg'
      return fetchPoster(this.film.poster_path)
    },
    judulLengkap() {
      const tahun = this.film?.release_date?.slice(0, 4)
      return `${this.film?.title} (${tahun})`
    },
    sudahDiWatchlist() {
      // cek apakah filmId ada di array watchlist
      return this.watchlist.includes(this.filmId)
    },
  },

  // ⑥ watch — reload saat filmId berubah
  watch: {
    filmId: {
      immediate: true,   // jalankan saat pertama kali juga
      handler(idBaru) {
        this.ambilDetailFilm(idBaru)
      }
    }
  },

  // ⑦ methods
  methods: {
    async ambilDetailFilm(id) {
      this.isLoading = true
      this.errorPesan = ''
      try {
        this.film = await fetchFilm(id)
      } catch (e) {
        this.errorPesan = e.message
      } finally {
        this.isLoading = false
      }
    },
    toggleWatchlist() {
      if (this.sudahDiWatchlist) {
        this.watchlist = this.watchlist.filter(i => i !== this.filmId)
        this.$emit('hapus-watchlist', this.filmId)
      } else {
        this.watchlist.push(this.filmId)
        this.$emit('tambah-watchlist', this.film)
      }
    },
    pilihFilm() {
      this.$emit('film-dipilih', this.film)
    }
  },

  // ⑧ lifecycle — bersihkan saat unmount
  unmounted() {
    console.log('DetailFilm dibongkar')
  }
}
</script>
```

**Yang kamu pelajari:**
- `props` + `watch` bekerja berkesinambungan: saat `filmId` berubah, `watch` memicu fetch ulang.
- `computed` (`judulLengkap`, `sudahDiWatchlist`) menghindari logika duplikat di template.
- `emits` mengirim aksi ke parent tanpa mengubah state parent secara langsung.
- `data()` menyimpan state lokal (`watchlist`) yang tidak perlu diketahui parent.

---

## 🚨 18. Jebakan Umum Pemula di Bab 10

### ❌ Jebakan 1 — `data` sebagai objek, bukan fungsi

```js
// ❌ SALAH
export default {
  data: {
    count: 0   // semua instance berbagi state yang SAMA!
  }
}

// ✅ BENAR
export default {
  data() {
    return { count: 0 }   // tiap instance dapat state sendiri
  }
}
```

---

### ❌ Jebakan 2 — Arrow function sebagai method

```js
// ❌ SALAH
export default {
  methods: {
    tampil: () => {
      console.log(this.count)   // undefined!
    }
  }
}

// ✅ BENAR
export default {
  methods: {
    tampil() {
      console.log(this.count)   // ✅ benar
    }
  }
}
```

---

### ❌ Jebakan 3 — Mengubah prop secara langsung

```js
// ❌ SALAH — mutasi prop!
export default {
  props: { judul: String },
  methods: {
    ubah() {
      this.judul = 'Baru'   // ❌ melanggar one-way data flow
    }
  }
}

// ✅ BENAR — pakai data/computed lokal
export default {
  props: { judul: String },
  data() { return { judulLokal: this.judul } },
  methods: {
    ubah() {
      this.judulLokal = 'Baru'   // ✅ aman
    }
  }
}
```

---

### ❌ Jebakan 4 — Lupa `deep: true` saat watch object

```js
// ❌ SALAH — perubahan nested tidak terdeteksi
export default {
  data() { return { form: { nama: '' } } },
  watch: {
    form() { console.log('berubah') }   // hanya terpicu jika 'form' diganti
  }
}

// ✅ BENAR — pakai deep atau watch properti spesifik
export default {
  data() { return { form: { nama: '' } } },
  watch: {
    form: {
      handler() { console.log('berubah') },
      deep: true,
    },
    // atau lebih efisien:
    'form.nama'(v) { console.log('nama jadi', v) }
  }
}
```

---

### ❌ Jebakan 5 — Tidak membersihkan di `unmounted`

```js
// ❌ SALAH — memory leak!
export default {
  mounted() {
    this.timer = setInterval(() => this.refresh(), 1000)
  }
  // lupa clearInterval → timer jalan terus!
}

// ✅ BENAR — bersihkan
export default {
  mounted() {
    this.timer = setInterval(() => this.refresh(), 1000)
  },
  unmounted() {
    clearInterval(this.timer)   // ✅ bebas memory leak
  }
}
```

---

## 📝 19. Ringkasan Bab 10

| Konsep | Penjelasan |
| --- | --- |
| **Options API** | Cara klasik menulis komponen sebagai objek berisi opsi; masih didukung Vue 3 |
| **`name`** | Identitas komponen untuk devtools & recursive component |
| **`components`** | Mendaftarkan komponen anak agar bisa dipakai di template |
| **`props`** | Data dari parent; read-only; validasi & default tersedia |
| **`emits`** | Deklarasi event yang dikirim ke parent via `this.$emit` |
| **`data()`** | Wajib return objek; state lokal yang reactive (tiap instance unik) |
| **`computed`** | Data turunan, di-cache, otomatis update saat dependensi berubah |
| **`watch`** | Side-effect saat data berubah; opsi `immediate` & `deep` |
| **`methods`** | Fungsi komponen; panggil dari template/opsi lain |
| **Lifecycle** | `created`, `mounted`, `updated`, `unmounted`, dll |
| **`this`** | Merujuk ke instance komponen; jembatan akses semua opsi |
| **Arrow trap** | Method = function biasa; callback dalam method = arrow aman |
| **Kapan pakai** | Komponen sederhana, legacy code, edukasi pemula |

---

## 🎯 20. Latihan Mandiri

**⭐ Latihan 1 — Komponen Counter Sederhana**
Buat komponen `Penghitung.vue` dengan Options API yang punya: `data` berisi `angka` (default 0), `methods` `tambah()`, `kurang()`, `reset()`, dan `computed` `status` yang mengembalikan `'positif'` / `'nol'` / `'negatif'`. Tampilkan angka dan status di template dengan tombol-tombolnya.

**⭐⭐ Latihan 2 — Form Login dengan Validasi**
Buat komponen `FormLogin.vue` dengan `props` `judul` (String, default `'Login'`) dan `emits` `['submit']`. State lokal: `email`, `password`, `error` (computed yang mengecek email mengandung `@` dan password minimal 6 karakter). Saat tombol diklik dan valid, panggil `this.$emit('submit', { email, password })`.

**⭐⭐⭐ Latihan 3 — Komponen Pencarian Film**
Buat komponen `PencarianFilm.vue` dengan: `data` `keyword`, `hasil` (array), `isLoading`; `watch` pada `keyword` (dengan `deep` tidak perlu, tapi simulasikan debounce manual pakai `setTimeout` di dalam handler) yang memanggil `methods.cari()` untuk mengisi `hasil`. Tampilkan loading, pesan kosong, dan list hasil.

**⭐⭐⭐⭐ Latihan 4 — Detail Film Lengkap (Tantangan)**
Gabungkan semua yang dipelajari: bangun komponen `ProfilUser.vue` yang menerima `props` `userId` (Number, required), mengambil data user lewat `methods.ambilUser()` dipicu oleh `watch.userId` (immediate), menampilkan state `isLoading`/`errorPesan`/`user`, punya `computed` `namaLengkap` dan `umur` (dari tahun lahir), `emits` `['follow', 'unfollow']`, dan tombol follow/unfollow yang mengubah state lokal `isFollowing` serta meng-emit event. Jangan lupa bersihkan apapun yang perlu di `unmounted`.

---

*Lanjut ke ➡️ **Bab 11 — 🔧 Fitur Lanjutan Options API***
