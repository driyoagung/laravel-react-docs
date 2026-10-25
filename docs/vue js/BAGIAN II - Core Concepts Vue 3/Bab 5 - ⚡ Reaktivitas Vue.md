# ⚡ Bab 5 — Reaktivitas Vue: Jantung dari Semua Fitur

> *"Seorang tukang kebun tidak perlu berteriak ke setiap bunga untuk memintanya mekar. Ia cukup menyiram akar, dan setiap kelopak akan membuka dengan sendirinya. Begitulah reaktivitas bekerja di Vue — ubah 'akar' datanya, dan tampilan 'mekar' mengikutinya tanpa perintah satu per satu."*

---

> **🧠 Apa Itu Reaktivitas?**
>
> Reaktivitas adalah sistem di Vue yang membuat **tampilan (DOM) otomatis mengikuti perubahan data**. Ketika sebuah variabel JavaScript yang kita gunakan di template berubah nilainya, Vue mendeteksi perubahan itu dan memperbarui hanya bagian tampilan yang memakai variabel tersebut — tanpa kita menulis kode manual untuk mengubah DOM. Inilah yang membedakan Vue (dan framework modern lainnya) dari cara lama memprogram dengan `document.getElementById().textContent = ...`. Reaktivitas adalah fondasi dari semua fitur "ajaib" di Vue: interpolasi `{{ }}`, `v-model`, computed properties, hingga watchers.

---

> **🏗️ Analogi Sederhana:**
>
> Bayangkan sebuah **spreadsheet (lembar kerja Excel atau Google Sheets)**. Kamu menulis di sel `A1` nilai `10`. Lalu di sel `B1` kamu menulis rumus `=A1*2`. Saat ini `B1` menampilkan `20`. Sekarang ubah `A1` menjadi `15`. Tanpa perlu klik tombol apa pun, `B1` langsung berubah menjadi `30`. Tidak ada yang menyuruh `B1` berhitung ulang — ia **tahu** bahwa ia bergantung pada `A1`, jadi ia ikut berubah. Itulah reaktivitas: **hubungan dependensi otomatis antara "sumber" dan "hasil"**. Vue menerapkan prinsip yang persis sama untuk antarmuka web.

---

## 📋 Daftar Isi Bab 5

1. Anatomi Reaktivitas — Apa yang Terjadi di Balik Layar
2. Analogi Spreadsheet Dibedah Sampai ke Akar
3. Bagaimana Vue Mendeteksi Perubahan (Proxy vs Object.defineProperty)
4. `ref()` — Reaktivitas untuk Nilai Tunggal
5. `reactive()` — Reaktivitas untuk Object & Array
6. Perbandingan `ref()` vs `reactive()` — Kapan Pakai Mana
7. Akses `.value` di Script vs Template
8. Reaktivitas Bersarang (Nested) & Deep Reactivity
9. Batasan & Jebakan Reaktivitas (Destructuring, Reassign, Index, Length)
10. `toRef()` & `toRefs()` — Menyelamatkan Reaktivitas
11. `shallowRef()` & `shallowReactive()` — Optimasi Lanjut
12. `readonly()` & `isReactive()` — Tools Pendukung
13. Reaktivitas pada Collection (Map & Set)
14. Studi Kasus — Counter App
15. Jebakan Umum Pemula di Bab 5
16. Ringkasan & Latihan Mandiri

---

## 🔬 1. Anatomi Reaktivitas — Apa yang Terjadi di Balik Layar

Sebelum masuk ke kode, kita harus memahami **alur mental** bagaimana Vue menjadikan data "hidup". Ada tiga tokoh dalam cerita ini:

```
┌──────────────────────────────────────────────────────────────┐
│  TOKOH DALAM REAKTIVITAS VUE                                 │
│                                                              │
│  ① SOURCE (Sumber)        → variabel ref/reactive           │
│  ② DEPENDENT (Tergantung) → template / computed / watch      │
│  ③ SYSTEM (Sistem)        → mekanisme Proxy + scheduler      │
│                                                              │
│  ALUR:                                                       │
│  SOURCE berubah                                             │
│      ↓                                                       │
│  SYSTEM mencatat "siapa saja yang bergantung pada SOURCE"   │
│      ↓                                                       │
│  SYSTEM menjadwalkan update pada DEPENDENT tersebut          │
│      ↓                                                       │
│  DEPENDENT diperbarui (template re-render / computed recalc)│
└──────────────────────────────────────────────────────────────┘
```

Mari kita lihat ini dalam bentuk kode nyata, lalu kita bedah per baris:

```vue
<script setup>
import { ref } from 'vue'

// ① SOURCE: variabel reaktif 'hitungan'
const hitungan = ref(0)

// Fungsi yang memanipulasi source
function tambah() {
  // ② saat nilai berubah, Vue tau template bergantung padanya
  hitungan.value++
}
</script>

<template>
  <!-- DEPENDENT: angka ini "berlangganan" ke hitungan -->
  <p>Angka sekarang: {{ hitungan }}</p>
  <button @click="tambah">Tambah</button>
</template>
```

**Penjelasan baris per baris:**

- `import { ref } from 'vue'` → kita mengimpor fungsi `ref` yang akan membungkus nilai agar bisa diawasi Vue.
- `const hitungan = ref(0)` → `hitungan` bukan angka biasa, melainkan sebuah **objek reaktif** yang menyimpan `0` di dalamnya.
- `hitungan.value++` → kita mengubah nilai "sungguhan". Vue menangkap momen ini.
- `{{ hitungan }}` di template → Vue tahu "bagian ini membaca `hitungan`", sehingga ia mendaftarkannya sebagai *dependent*. Saat `hitungan` berubah, hanya teks ini yang di-update, bukan seluruh halaman.

> 💡 **Catatan Penting — Reaktivitas Bukan Sihir, Tapi "Pelacakan"**
>
> Vue tidak memindai ulang seluruh file setiap kali ada perubahan. Ia **melacak** secara presisi: saat sebuah fungsi (template/computed/watch) membaca sebuah source, Vue mencatat "fungsi ini bergantung pada source ini". Inilah yang disebut **dependency tracking**. Karena pelacakan ini presisi, update pun menjadi sangat efisien.

---

## 📊 2. Analogi Spreadsheet Dibedah Sampai ke Akar

Kita sudah menyebut analogi spreadsheet di awal. Sekarang mari bedah lebih dalam agar benar-benar "nempel" di kepala.

```
SPREADSHEET                        │  VUE COMPONENT
──────────────────────────────────┼──────────────────────────────────
Sel A1 (input manual)             │  const hitungan = ref(0)
Sel B1 = A1 * 2 (rumus)           │  const hasil = computed(() => hitungan.value * 2)
Kamu mengetik 15 di A1            │  hitungan.value = 15
B1 otomatis jadi 30               │  hasil otomatis jadi 30
Tidak perlu klik "hitung ulang"   │  Tidak perlu panggil fungsi manual
```

Ada tiga konsep kunci dari spreadsheet yang persis sama di Vue:

| Konsep Spreadsheet | Padanan di Vue | Penjelasan |
| --- | --- | --- |
| **Sel input** | `ref()` / `reactive()` | Tempat kamu menyimpan nilai mentah |
| **Rumus** | `computed()` | Nilai turunan yang dihitung ulang otomatis |
| **Efek samping** (mis. grafik berubah) | `watch()` / `watchEffect()` | Aksi yang dipicu saat nilai berubah |

```vue
<script setup>
import { ref, computed, watch } from 'vue'

// Sel input A1
const harga = ref(10000)

// Rumus B1 = A1 * 1.1 (ppn 10%)
const hargaPPN = computed(() => harga.value * 1.1)

// Efek samping: setiap harga berubah, cetak ke console (seperti grafik update)
watch(harga, (baru, lama) => {
  console.log(`Harga berubah dari ${lama} ke ${baru}`)
})

// Ubah A1 → B1 (computed) ikut, dan watch ikut terpicu
harga.value = 20000  // hargaPPN jadi 22000, console: "Harga berubah dari 10000 ke 20000"
</script>
```

> 🎯 **Latihan Pemahaman:** Coba tebak tanpa menjalankan — jika `harga.value` diubah 5 kali berturut-turut, berapa kali `watch` di atas dipanggil? Jawabannya: **5 kali**, karena setiap perubahan nilai memicu watch. Tapi `hargaPPN` hanya dihitung ulang saat ada yang *membacanya* — ini kunci efisiensi yang akan kita bahas di Bab 6.

---

## ⚙️ 3. Bagaimana Vue Mendeteksi Perubahan

Ini bagian teknis tapi **sangat penting** untuk memahami mengapa beberapa kode "tidak reaktif". Vue 3 menggunakan **`Proxy`** (fitur JavaScript modern), berbeda dengan Vue 2 yang memakai `Object.defineProperty`.

### 3.1 Vue 2 vs Vue 3 — Perbedaan Mesin Reaktivitas

| Aspek | Vue 2 (`Object.defineProperty`) | Vue 3 (`Proxy`) |
| --- | --- | --- |
| **Cakupan** | Hanya property yang ada saat dibuat | Semua property, termasuk yang ditambah nanti |
| **Penambahan property** | ❌ Tidak terdeteksi | ✅ Terdeteksi otomatis |
| **Penghapusan Property** | ❌ Tidak terdeteksi | ✅ Terdeteksi (`delete obj.x`) |
| **Array index/length** | ❌ Perlu `$set` | ✅ Langsung terdeteksi |
| **Map / Set** | ❌ Tidak didukung | ✅ Didukung penuh |
| **Performa** | Lebih lambat | Lebih cepat & efisien |

### 3.2 Alur Proxy secara Visual

```
const film = reactive({ judul: 'Inception', rating: 8.8 })
                    │
                    ▼
        Vue membungkus object dengan Proxy
        (layer "satpam" di depan object asli)
                    │
        ┌───────────┴────────────┐
        ▼                        ▼
   [GET trap]                [SET trap]
   Saat property dibaca:     Saat property diubah:
   • catat siapa yang baca    • ubah nilai asli
   • daftarkan sebagai        • beri tahu semua yang
     dependent                  "berlangganan" property ini
        │                        │
        └───────────┬────────────┘
                    ▼
        Vue menjadwalkan re-render hanya
        pada bagian yang membaca property tersebut
```

```vue
<script setup>
import { reactive } from 'vue'

const film = reactive({ judul: 'Inception', rating: 8.8 })

// GET trap aktif saat template membaca film.judul
// → Vue tahu "template ini bergantung pada film.judul"

// SET trap aktif saat kita lakukan:
film.judul = 'Interstellar'   // Vue: "oh, film.judul berubah, update yang bergantung!"
film.rating = 8.6             // Vue: "rating berubah, update juga"
film.tahun = 2014             // ✅ Vue 3: property BARU otomatis reaktif!
</script>
```

> ⚠️ **Catatan untuk yang Pernah Belajar Vue 2:**
> Di Vue 2, menambah property baru seperti `film.tahun = 2014` **tidak** akan reaktif — kamu harus pakai `Vue.set(film, 'tahun', 2014)`. Di Vue 3 dengan Proxy, **tidak perlu** — semuanya otomatis. Ini salah satu alasan utama Vue 3 lebih "menyenangkan".

---

## 🔴 4. `ref()` — Reaktivitas untuk Nilai Tunggal

`ref()` adalah fungsi untuk membuat **reaktivitas pada satu nilai** — bisa berupa string, number, boolean, bahkan object (tapi untuk object biasanya lebih enak pakai `reactive`).

```vue
<script setup>
import { ref } from 'vue'

// ① ref untuk number
const hitungan    = ref(0)
//                ↑ ref() membungkus 0 menjadi objek reaktif

// ② ref untuk string
const judulFilm  = ref('Interstellar')
//                ↑ string biasa dibungkus jadi reaktif

// ③ ref untuk boolean
const isLoading  = ref(false)
//                ↑ flag loading, akan diubah nanti

// ④ ref untuk object (bisa, tapi perhatikan .value)
const user       = ref({ nama: 'Budi', umur: 25 })

// ── CARA MENGUBAH NILAI ref ──
hitungan.value++              // 0 → 1 (pakai .value di script!)
judulFilm.value = 'Dune'      // ganti string
isLoading.value = true        // ubah boolean
user.value.umur = 26          // ubah property dalam object ref
</script>

<template>
  <!-- Di template, .value TIDAK perlu ditulis -->
  <p>{{ judulFilm }}</p>      <!-- Vue otomatis baca .value -->
  <p>{{ hitungan }}</p>
  <p>{{ isLoading ? 'Memuat...' : 'Selesai' }}</p>
</template>
```

**Kenapa harus `.value`?** Karena `ref()` sebenarnya mengembalikan objek `{ value: <isi> }`. Di belakang layar, Vue menggunakan `value` ini sebagai "wadah" yang bisa diawasi. Di template, Vue **secara otomatis membuka** (unwrap) `.value` untuk kenyamanan kita — itulah sebabnya di template kita cukup tulis `{{ hitungan }}`.

> 💡 **Tip Praktis:** Jika di console kamu lihat `[object Object]` atau `RefImpl`, itu artinya kamu lupa pakai `.value` di script. Di template selalu tanpa `.value`, di script selalu pakai `.value`.

---

## 🟢 5. `reactive()` — Reaktivitas untuk Object & Array

`reactive()` digunakan untuk **object atau array** — dan kelebihannya: kamu mengakses property-nya **langsung**, tanpa `.value`.

```vue
<script setup>
import { reactive } from 'vue'

// ① reactive object — akses langsung tanpa .value
const film = reactive({
  id:     1,
  judul:  'Interstellar',
  rating: 8.6,
  tags:   ['sci-fi', 'drama'],   // array di dalam object juga reaktif
})

// Mengubah property — LANGSUNG, tanpa .value
film.judul  = 'Dune'             // ✅ langsung
film.rating = 9.0
film.tags.push('thriller')       // ✅ push ke array juga reaktif
film.tags[0] = 'space'           // ✅ ubah index array juga reaktif

// ② reactive array — pakai langsung
const daftarFilm = reactive([
  { id: 1, judul: 'Inception' },
  { id: 2, judul: 'Tenet' },
])

daftarFilm.push({ id: 3, judul: 'Oppenheimer' })  // ✅ reaktif
daftarFilm.splice(0, 1)                            // ✅ reaktif
</script>

<template>
  <h3>{{ film.judul }}</h3>
  <p>Rating: {{ film.rating }}</p>
  <ul>
    <li v-for="tag in film.tags" :key="tag">{{ tag }}</li>
  </ul>
</template>
```

**Penting:** `reactive()` **hanya** boleh dipakai untuk object/array. Jika kamu menulis `const x = reactive(5)`, itu **tidak akan bekerja** — untuk nilai primitif (number/string/boolean) selalu gunakan `ref()`.

---

## ⚖️ 6. Perbandingan `ref()` vs `reactive()` — Kapan Pakai Mana

Ini pertanyaan paling sering muncul. Berikut panduan lengkapnya.

### 6.1 Tabel Perbandingan

| Kriteria | `ref()` | `reactive()` |
| --- | --- | --- |
| **Tipe data** | Semua (primitif & object) | Hanya object & array |
| **Akses di script** | Perlu `.value` | Langsung (`obj.x`) |
| **Akses di template** | Langsung (`{{ x }}`) | Langsung (`{{ obj.x }}`) |
| **Re-assign variable** | ✅ Boleh (`x.value = ...`) | ❌ Tidak boleh (kehilangan reaktivitas) |
| **Destructuring** | Aman (masih ref) | ⚠️ Kehilangan reaktivitas (perlu `toRefs`) |
| **Cocok untuk** | State tunggal, form fields | State terstruktur (bentuk object) |

### 6.2 Contoh Kapan Pakai `ref`

```vue
<script setup>
import { ref } from 'vue'

// Form input — setiap field adalah ref terpisah (sangat umum & rapi)
const namaLengkap = ref('')
const email       = ref('')
const password    = ref('')
const isSubmitting = ref(false)

// Counter sederhana
const likeCount = ref(0)
</script>
```

### 6.3 Contoh Kapan Pakai `reactive`

```vue
<script setup>
import { reactive } from 'vue'

// Satu object profil utuh — lebih masuk akal sebagai reactive
const profil = reactive({
  nama:     'Budi Santoso',
  email:    'budi@mail.com',
  bio:      'Pecinta film sci-fi',
  pengikut: 120,
})

// Akses langsung, tanpa .value, enak dibaca
console.log(profil.nama)
</script>
```

### 6.4 Pendekatan Hibrida (Paling Populer di Komunitas)

Banyak developer Vue senior menggunakan **satu `reactive` object besar** yang berisi semua state, atau **banyak `ref` kecil**. Keduanya valid. Berikut pola yang direkomendasikan untuk pemula agar konsisten:

```
✅ Rekomendasi untuk Pemula:
   • Gunakan ref() untuk SEMUANYA jika ragu.
   • Atau: ref() untuk nilai tunggal, reactive() untuk object/array.
   • Pilih SATU gaya dan konsisten di seluruh project.
```

```vue
<script setup>
import { ref, reactive } from 'vue'

// Gaya campuran yang rapi & umum:
const keyword = ref('')                 // pencarian: ref
const isLoading = ref(false)            // flag: ref
const filter = reactive({               // grup filter: reactive
  genre:   'semua',
  urut:    'populer',
  tahun:   2024,
})
</script>
```

> 💡 **Panduan Sederhana dari Tim Vue:**
> Jika kamu bingung, **pakai `ref()` untuk segalanya**. `ref()` bisa membungkus object juga (`ref({ ... })`), dan ia konsisten butuh `.value` di mana pun. Banyak tim profesional justru memilih `ref()` murni karena konsistensinya.

---

## 🔍 7. Akses `.value` di Script vs Template

Mari perjelas kebingungan nomor satu pemula: kapan pakai `.value`, kapan tidak.

```
┌────────────────────────────────────────────────────────────┐
│  ATURAN .value                                             │
│                                                            │
│  Di dalam <script> (termasuk fungsi, computed, watch):    │
│      → ref SELALU pakai .value                             │
│      → reactive TIDAK pakai .value                         │
│                                                            │
│  Di dalam <template>:                                       │
│      → ref TIDAK pakai .value (Vue unwrap otomatis)        │
│      → reactive TIDAK pakai .value                         │
│                                                            │
│  Pengecualian di template:                                 │
│      → Jika ref ada di dalam object/nested, tetap butuh   │
│        .value di akses tertentu (jarang terjadi)           │
└────────────────────────────────────────────────────────────┘
```

```vue
<script setup>
import { ref } from 'vue'

const pesan = ref('Halo')

// ✅ Di script: PAKAI .value
function ubah() {
  pesan.value = 'Halo Dunia'   // benar
}

// ❌ Di script: JANGAN lupa .value
function salah() {
  // pesan = 'X'            // SALAH — ini ganti variable, bukan isi ref!
  // pesan.append('!')      // SALAH — pesan adalah objek ref, bukan string
}
</script>

<template>
  <!-- ✅ Di template: TANPA .value -->
  <p>{{ pesan }}</p>          <!-- benar, tampil "Halo" -->
  <button @click="ubah">Ubah</button>
</template>
```

> ⚠️ **Jebakan Console:** Saat kamu `console.log(pesan)` di script, kamu akan melihat objek `RefImpl { value: 'Halo', ... }`, bukan string `'Halo'`. Itu normal — artinya `pesan` adalah ref. Untuk melihat isinya, log `pesan.value`.

---

## 🪆 8. Reaktivitas Bersarang (Nested) & Deep Reactivity

Salah satu kekuatan `reactive()` adalah **deep reactivity** — object bersarang di dalamnya pun ikut reaktif, tanpa konfigurasi tambahan.

```vue
<script setup>
import { reactive } from 'vue'

const film = reactive({
  judul: 'Dune',
  meta: {                       // object bersarang
    tahun:   2021,
    durasi:  155,
    audio: {                    // bersarang 2 level
      format: 'Dolby Atmos',
      bahasa: 'Inggris',
    },
  },
  genre: ['sci-fi', 'adventure'],
})

// Semua level bisa diubah & terdeteksi:
film.meta.tahun = 2024                 // ✅ reaktif (level 1)
film.meta.audio.bahasa = 'Indonesia'   // ✅ reaktif (level 2!)
film.genre.push('drama')               // ✅ reaktif
</script>

<template>
  <p>{{ film.meta.audio.bahasa }}</p>  <!-- update saat bahasa berubah -->
</template>
```

**Bagaimana mungkin Vue tahu sampai level 2?** Karena saat `reactive()` membungkus object, ia juga membungkus **setiap object/array di dalamnya** dengan Proxy secara rekursif. Inilah "deep reactivity".

> 💡 **Perbandingan dengan `ref` object:** `ref({ ... })` juga memiliki deep reactivity — Vue otomatis membungkus isi object ref menjadi reactive. Jadi `ref({ a: { b: 1 } })` → mengubah `.value.a.b` juga reaktif.

---

## ⚠️ 9. Batasan & Jebakan Reaktivitas

Ini bagian **paling krusial** — tempat lahirnya bug sulit dilacak. Hafalkan pola ❌ dan ✅ di bawah ini.

### 9.1 ❌ Jebakan 1 — Destructuring `reactive` Langsung

```vue
<script setup>
import { reactive } from 'vue'

const state = reactive({ nama: 'Budi', umur: 25 })

// ❌ SALAH — destructure biasa memutus reaktivitas
let { nama, umur } = state      // 'let' agar bisa di-reassign demi contoh
nama = 'Ani'                     // mengubah variabel lokal, BUKAN state.nama
// template yang membaca 'nama' TIDAK akan update!

// ✅ BENAR — gunakan toRefs (dibahas di section 10)
import { toRefs } from 'vue'
const { nama, umur } = toRefs(state)
nama.value = 'Ani'    // ✅ sekarang reaktif — template ikut update
</script>
```

### 9.2 ❌ Jebakan 2 — Re-assign `reactive` Object

```vue
<script setup>
import { reactive } from 'vue'

let produk = reactive({ nama: 'Laptop', harga: 10000000 })

// ❌ SALAH — mengganti seluruh variable menghancurkan reaktivitas
produk = reactive({ nama: 'Mouse', harga: 200000 })
// variabel 'produk' sekarang menunjuk ke object BARU,
// yang tidak terhubung dengan template lama!

// ✅ BENAR — mutasi property satu per satu
produk.nama  = 'Mouse'        // ✅ reaktif
produk.harga = 200000         // ✅ reaktif

// ✅ BENAR (jika ingin ganti semua) — pakai Object.assign
Object.assign(produk, { nama: 'Mouse', harga: 200000 })  // ✅ reaktif
</script>
```

### 9.3 ❌ Jebakan 3 — Menambah Property ke `ref` Primitif

```vue
<script setup>
import { ref } from 'vue'

const user = ref({ nama: 'Budi' })

// ✅ AMAN — menambah property ke object DALAM ref
user.value.umur = 25          // ✅ reaktif (deep reactivity)

// ❌ JANGAN mengganti user dengan object baru tanpa .value
// user = { nama: 'Ani' }      // SALAH — ini ganti variable, bukan isi ref
user.value = { nama: 'Ani' }  // ✅ benar pakai .value
</script>
```

### 9.4 ❌ Jebakan 4 — Mengandalkan `.length` & Index Array (Sudah Diperbaiki di Vue 3)

Di Vue 2, mengubah `array[0] = x` atau `array.length = 0` **tidak** reaktif. Di Vue 3 dengan Proxy, **semuanya bekerja**:

```vue
<script setup>
import { ref } from 'vue'

const list = ref(['a', 'b', 'c'])

// ✅ Vue 3: semua ini REAKTIF (berbeda dengan Vue 2!)
list.value[0] = 'x'            // ✅ reaktif
list.value.length = 0          // ✅ reaktif (mengosongkan array)
list.value.push('d')           // ✅ reaktif
</script>
```

> ⚠️ **Catatan:** Meski Vue 3 menangani index & length, gunakan method array standar (`push`, `pop`, `splice`, `shift`, `unshift`) untuk kode yang paling mudah dibaca dan diprediksi.

---

## 🔧 10. `toRef()` & `toRefs()` — Menyelamatkan Reaktivitas

Ketika kamu butuh "mengeluarkan" property dari `reactive` object tapi **tetap ingin ia reaktif**, gunakan `toRef` (satu property) atau `toRefs` (semua property sekaligus).

```vue
<script setup>
import { reactive, toRefs, toRef } from 'vue'

const film = reactive({
  judul:  'Interstellar',
  tahun:  2014,
  rating: 8.6,
})

// ── toRefs: destructure DENGAN reaktivitas ──
const { judul, tahun, rating } = toRefs(film)
// judul, tahun, rating kini adalah ref yang TERHUBUNG ke film

judul.value = 'Dune'     // mengubah film.judul juga! (terhubung)
console.log(film.judul)  // 'Dune' ✅

// ── toRef: hanya satu property ──
const ratingRef = toRef(film, 'rating')
ratingRef.value = 9.0    // film.rating jadi 9.0 ✅
</script>
```

**Kapan wajib pakai `toRefs`?** Saat kamu ingin **mengembalikan (return) state dari composable** atau ingin memisahkan property agar bisa di-destructure di komponen lain tanpa kehilangan reaktivitas. (Akan sangat penting di Bab 14 tentang Composables.)

```javascript
// composables/useFilm.js
import { reactive, toRefs } from 'vue'

export function useFilm() {
  const state = reactive({
    judul:  '',
    rating: 0,
    isLoading: false,
  })

  // ✅ return toRefs agar pemanggil bisa destructure dengan aman
  return { ...toRefs(state) }
}

// Di komponen:
// const { judul, rating } = useFilm()  → tetap reaktif ✅
```

---

## 🚀 11. `shallowRef()` & `shallowReactive()` — Optimasi Lanjut

Untuk performa pada data besar, Vue menyediakan versi "dangkal" yang **tidak** melacak perubahan bersarang.

```vue
<script setup>
import { shallowRef, shallowReactive } from 'vue'

// shallowRef: hanya reaktif saat .value diganti SELURUHNYA
const bigList = shallowRef([{ id: 1 }, { id: 2 }])
// ❌ bigList.value.push({ id: 3 }) TIDAK terdeteksi (perubahan dalam)
// ✅ bigList.value = [...bigList.value, { id: 3 }]  → terdeteksi (ganti utuh)

// shallowReactive: hanya property level-1 yang reaktif
const config = shallowReactive({ tema: 'dark', nested: { font: 14 } })
config.tema = 'light'        // ✅ reaktif
config.nested.font = 16      // ❌ TIDAK reaktif (bersarang)
</script>
```

> 💡 **Kapan Pakai?** Jarang untuk pemula. Gunakan `shallowRef` saat menyimpan **struktur data besar/immutable** (mis. hasil fetch API ribuan item) di mana kamu selalu mengganti seluruh nilai, bukan memutasi isinya. Ini menghemat overhead tracking.

---

## 🔒 12. `readonly()`, `isReactive()`, `isRef()` — Tools Pendukung

Vue menyediakan utilitas kecil namun berguna untuk bekerja dengan reaktivitas.

```vue
<script setup>
import { reactive, ref, readonly, isReactive, isRef } from 'vue'

const asli = reactive({ nilai: 10 })
const bacaSaja = readonly(asli)   // salinan yang TIDAK bisa diubah

// bacaSaja.nilai = 20   // ❌ akan memicu peringatan Vue (tapi asli tetap aman)

const x = ref(5)
const y = { biasa: true }

isReactive(asli)      // → true
isReactive(bacaSaja)  // → true (readonly tetap reactive untuk baca)
isRef(x)              // → true
isRef(y)              // → false
isReactive(y)         // → false
</script>
```

**Kegunaan nyata `readonly`:** Saat kamu mengirim state ke child component dan ingin memastikan child **tidak** mengubahnya langsung (child harus lewat `emits` — lihat Bab 7). Ini bentuk *defensive programming*.

---

## 🗺️ 13. Reaktivitas pada Collection: `Map` & `Set`

Vue 3 (berkat Proxy) mendukung `Map` dan `Set` secara reaktif — sesuatu yang mustahil di Vue 2.

```vue
<script setup>
import { ref } from 'vue'

// Map reaktif
const stok = ref(new Map())
stok.value.set('Laptop', 5)     // ✅ reaktif
stok.value.get('Laptop')        // 5
stok.value.delete('Laptop')     // ✅ reaktif

// Set reaktif
const tags = ref(new Set())
tags.value.add('baru')           // ✅ reaktif
tags.value.has('baru')          // true
tags.value.delete('baru')        // ✅ reaktif

// Di template:
</script>

<template>
  <p>Stok laptop: {{ stok.get('Laptop') }}</p>
  <p>Ada tag 'baru'? {{ tags.has('baru') }}</p>
</template>
```

> 💡 **Kapan Pakai Map/Set?** Gunakan `Map` saat kamu butuh lookup berdasarkan key unik dengan performa tinggi (seperti cache), dan `Set` saat kamu butuh kumpulan nilai unik (seperti daftar ID yang difavoritkan).

---

## 🎬 14. Studi Kasus — Counter App

Mari buktikan reaktivitas secara visual dengan Counter App lengkap, lengkap dengan fitur tambahan agar kamu benar-benar paham.

```vue
<!-- CounterApp.vue -->
<script setup>
import { ref, computed } from 'vue'

// ── STATE REAKTIF ──
const hitungan  = ref(0)          // angka utama (ref primitif)
const langkah   = ref(1)          // nilai tiap klik (ref primitif)
const riwayat   = ref([])         // array riwayat (ref array)

// ── COMPUTED (data turunan, dibahas lengkap Bab 6) ──
const isGenap     = computed(() => hitungan.value % 2 === 0)
const statusTeks  = computed(() => isGenap.value ? 'Genap' : 'Ganjil')
const totalKlik   = computed(() => riwayat.value.length)

// ── METHODS ──
function tambah() {
  hitungan.value += langkah.value
  catatRiwayat('+')
}

function kurang() {
  hitungan.value -= langkah.value
  catatRiwayat('-')
}

function reset() {
  hitungan.value = 0
  riwayat.value = []              // ganti array utuh (reaktif ✅)
}

function catatRiwayat(aksi) {
  // push ke ref array → reaktif ✅
  riwayat.value.push({
    aksi,
    nilai: hitungan.value,
    waktu: new Date().toLocaleTimeString('id-ID'),
  })
}
</script>

<template>
  <div style="text-align: center; padding: 2rem; font-family: sans-serif">
    <!-- Angka besar yang otomatis update -->
    <h1 style="font-size: 4rem; margin: 0">{{ hitungan }}</h1>

    <!-- Badge status genap/ganjil, ikut berubah -->
    <span :style="{ color: isGenap ? 'green' : 'orange' }">
      {{ statusTeks }}
    </span>

    <!-- Kontrol utama -->
    <div style="margin: 1rem 0">
      <button @click="kurang">➖</button>
      <button @click="reset">🔄 Reset</button>
      <button @click="tambah">➕</button>
    </div>

    <!-- Pengatur langkah -->
    <label>
      Langkah tiap klik:
      <input type="number" v-model="langkah" min="1" style="width: 60px" />
    </label>

    <!-- Statistik -->
    <p>Total klik: {{ totalKlik }}</p>

    <!-- Riwayat (list reaktif) -->
    <ul style="list-style: none; padding: 0">
      <li v-for="(r, i) in riwayat" :key="i" style="padding: 4px">
        {{ r.waktu }} — {{ r.aksi }} → {{ r.nilai }}
      </li>
    </ul>
  </div>
</template>
```

**Apa yang dibuktikan studi kasus ini?**

| Elemen | Bukti Reaktivitas |
| --- | --- |
| `{{ hitungan }}` | Berubah otomatis saat `tambah()`/`kurang()` dipanggil |
| `statusTeks` (computed) | Dihitung ulang otomatis saat `hitungan` genap/ganjil berubah |
| `v-model="langkah"` | Input mengubah `langkah.value`, lalu memengaruhi `tambah()` |
| `riwayat` (array) | Setiap `push` langsung menambah item di `<ul>` tanpa manipulasi DOM |

> 🎯 **Coba Modifikasi:** Tambahkan tombol "×2" yang mengalikan `hitungan` dengan 2, dan pastikan `riwayat` ikut mencatatnya. Jika berhasil, kamu sudah paham reaktivitas!

---

## 🚨 15. Jebakan Umum Pemula di Bab 5

### ❌ Jebakan 1 — Lupa `.value` di Script

```javascript
// ❌ SALAH
const hitungan = ref(0)
hitungan++                  // ini bukan ref lagi, ini NaN / error
console.log(hitungan)      // RefImpl, bukan angka

// ✅ BENAR
hitungan.value++
console.log(hitungan.value)
```

### ❌ Jebakan 2 — Menggunakan `reactive` untuk Primitif

```javascript
// ❌ SALAH — reactive butuh object/array
const nama = reactive('Budi')     // TIDAK bekerja

// ✅ BENAR
const nama = ref('Budi')          // untuk string, pakai ref
```

### ❌ Jebakan 3 — Destructuring `reactive` Menghilangkan Reaktivitas

```javascript
// ❌ SALAH
const state = reactive({ a: 1, b: 2 })
const { a, b } = state            // a & b kehilangan reaktivitas

// ✅ BENAR
import { toRefs } from 'vue'
const { a, b } = toRefs(state)    // tetap reaktif (pakai .value)
```

### ❌ Jebakan 4 — Re-assign `reactive` Menghancurkan Binding

```javascript
// ❌ SALAH
let config = reactive({ tema: 'dark' })
config = reactive({ tema: 'light' })   // template masih menunjuk yang lama!

// ✅ BENAR — mutasi, atau gunakan ref agar bisa di-reassign
const config = ref({ tema: 'dark' })
config.value = { tema: 'light' }       // ✅ reaktif
```

### ❌ Jebakan 5 — Mengubah `props` (Akan Dibahas Lengkap Bab 7)

```javascript
// ❌ SALAH — props adalah read-only
const props = defineProps(['judul'])
props.judul = 'Baru'             // Vue akan marah (warning)

// ✅ BENAR — salin ke ref lokal jika perlu mengubah
const judulLokal = ref(props.judul)
judulLokal.value = 'Baru'        // ✅ aman, ini copy lokal
```

> ⚠️ **Ingat:** Props berbeda dengan state lokal. Props datang dari parent dan **tidak boleh** dimutasi di child. Ini akan kita dalami di Bab 7.

---

## 🧪 16. Reaktivitas dalam `v-model` & Form

Salah satu tempat reaktivitas paling terlihat adalah form input dengan `v-model`. Mari bedah bagaimana ia bekerja di balik layar.

```vue
<script setup>
import { ref, reactive } from 'vue'

// v-model dengan ref
const nama = ref('')
const umur = ref(0)
const setuju = ref(false)

// v-model dengan reactive (langsung tanpa .value)
const form = reactive({
  email:    '',
  sandi:    '',
  negara:   'ID',
})
</script>

<template>
  <!-- v-model = :value + @input secara internal -->
  <input v-model="nama" placeholder="Nama" />
  <input v-model.number="umur" type="number" />   <!-- .number konversi ke number -->
  <input v-model.trim="nama" />                    <!-- .trim hapus spasi -->
  <input type="checkbox" v-model="setuju" />       <!-- boolean -->

  <input v-model="form.email" placeholder="Email" />
  <select v-model="form.negara">
    <option value="ID">Indonesia</option>
    <option value="MY">Malaysia</option>
  </select>
</template>
```

**Apa yang terjadi di balik layar `v-model`?**

```
Input diketik "Budi"
      ↓
@input event terpicu
      ↓
Vue menjalankan: nama.value = e.target.value   (reaktif!)
      ↓
Semua yang membaca 'nama' di template update otomatis
```

> 💡 **Modifiers `v-model`:** `.number` (konversi ke Number), `.trim` (hapus whitespace), `.lazy` (update saat `change` bukan `input`). Semua ini tetap menjaga reaktivitas karena pada intinya mengubah ref/reactive.

---

## 🔗 17. Reaktivitas Bersarang dalam `computed` (Dependency Chaining)

Computed bisa bergantung pada computed lain — Vue melacak rantai dependency secara otomatis.

```vue
<script setup>
import { ref, computed } from 'vue'

const harga  = ref(100)
const jumlah = ref(2)
const diskon = ref(0.1)

// computed level 1
const subtotal = computed(() => harga.value * jumlah.value)

// computed level 2 (bergantung pada computed level 1)
const setelahDiskon = computed(() => subtotal.value * (1 - diskon.value))

// computed level 3
const formatRupiah = computed(() =>
  'Rp ' + setelahDiskon.value.toLocaleString('id-ID')
)
</script>

<template>
  <!-- Ubah harga → subtotal → setelahDiskon → formatRupiah IKUT berubah -->
  <p>Total: {{ formatRupiah }}</p>
</template>
```

**Diagram rantai reaktivitas:**

```
harga ─┐
       ├─→ subtotal ─→ setelahDiskon ─→ formatRupiah ─→ template
jumlah─┘                       ▲
diskon ────────────────────────┘
```

> 💡 **Efisiensi:** Jika `harga` berubah, Vue hanya update `subtotal` → `setelahDiskon` → `formatRupiah`, bukan menghitung ulang semua dari nol. Cache di setiap level membuat rantai ini sangat efisien.

---

## 🐞 18. Mendebug Reaktivitas dengan Vue DevTools

Ketika reaktivitas "tidak bekerja", jangan tebak — gunakan **Vue DevTools**.

```
LANGKAH DEBUG REAKTIVITAS:
1. Install Vue DevTools (extension browser)
2. Buka tab "Components"
3. Pilih komponen → lihat panel "State" (menampilkan ref/reactive)
4. Perhatikan nilai berubah REAL-TIME saat kamu interaksi
5. Jika nilai berubah tapi tampilan tidak → cek apakah variable adalah ref tapi lupa .value
6. Jika tampilan berubah tapi state tidak → mungkin kamu mutasi DOM manual
```

```vue
<script setup>
import { ref } from 'vue'

const hitungan = ref(0)

// ❌ Bug umum: lupa .value → DevTools menunjukkan hitungan tetap 0
function salah() {
  // hitungan++   ← ini NaN / error, bukan ref
  console.log(hitungan)   // DevTools: masih 0
}

// ✅ Benar
function benar() {
  hitungan.value++
}
</script>
```

> 💡 **Tips:** Di Vue DevTools, ref ditandai dengan ikon 🔁 dan menampilkan `.value`-nya. Jika kamu lihat `RefImpl` di console tapi di DevTools state kosong, berarti variable tersebut tidak ter-ekspos ke template (normal jika hanya dipakai di script).

---

## 🏆 19. Best Practices Reaktivitas

```
✅ LAKUKAN:
   • Gunakan ref() untuk nilai tunggal, reactive() untuk object/array
   • Selalu .value di script untuk ref
   • Gunakan toRefs() saat destructure reactive
   • Batasi reaktivitas pada data yang benar-benar perlu di-track
   • Bersihkan side effect di lifecycle (Bab 9)

❌ HINDARI:
   • Mutasi props di child
   • Re-assign reactive object utuh
   • Destructuring reactive tanpa toRefs
   • Mengubah array index/length secara manual (lebih baik pakai method)
   • Mengandalkan reassignment pada reactive (pakai ref jika butuh reassign)
```

### 19.1 Tabel Cheat Sheet

| Kamu punya... | Gunakan | Akses script | Akses template |
| --- | --- | --- | --- |
| Angka, string, boolean | `ref()` | `.value` | langsung |
| Object tunggal | `reactive()` | langsung | langsung |
| Array | `reactive()` / `ref([])` | `arr.value` / langsung | langsung |
| Butuh re-assign variable | `ref()` | `.value =` | langsung |
| Butuh destructure | `toRefs()` | `.value` | langsung |
| Data besar/immutable | `shallowRef()` | `.value =` utuh | langsung |
| Read-only share | `readonly()` | baca saja | langsung |

---

## 🔬 20. Contoh Lengkap: Keranjang Belanja Reaktif

Mari gabungkan semua konsep reaktivitas dalam satu contoh utuh yang realistis.

```vue
<!-- KeranjangBelanja.vue -->
<script setup>
import { ref, reactive, computed, watch } from 'vue'

// ── STATE ──
const daftarProduk = ref([
  { id: 1, nama: 'Laptop',  harga: 10000000, jumlah: 1 },
  { id: 2, nama: 'Mouse',   harga: 200000,   jumlah: 2 },
  { id: 3, nama: 'Keyboard',harga: 500000,   jumlah: 1 },
])

const diskonPersen = ref(0)        // diskon global
const mataUang     = reactive({ kode: 'IDR', simbol: 'Rp' })

// ── COMPUTED (reaktif turunan) ──
const totalItem = computed(() =>
  daftarProduk.value.reduce((sum, p) => sum + p.jumlah, 0)
)

const subtotal = computed(() =>
  daftarProduk.value.reduce((sum, p) => sum + (p.harga * p.jumlah), 0)
)

const totalBayar = computed(() =>
  subtotal.value * (1 - diskonPersen.value / 100)
)

const formatUang = (nilai) =>
  `${mataUang.simbol} ${nilai.toLocaleString('id-ID')}`

// ── METHODS (mutasi reaktif) ──
function tambahJumlah(id) {
  const p = daftarProduk.value.find(x => x.id === id)
  if (p) p.jumlah++            // mutasi dalam ref array → reaktif ✅
}

function kurangJumlah(id) {
  const p = daftarProduk.value.find(x => x.id === id)
  if (p && p.jumlah > 1) p.jumlah--
}

function hapusItem(id) {
  // filter menghasilkan array baru → assign ke .value (reaktif ✅)
  daftarProduk.value = daftarProduk.value.filter(x => x.id !== id)
}

// ── WATCH (reaksi) ──
watch(totalBayar, (baru) => {
  console.log('Total berubah menjadi', formatUang(baru))
})
</script>

<template>
  <div class="keranjang">
    <h2>🛒 Keranjang Belanja</h2>

    <div v-for="p in daftarProduk" :key="p.id" class="item">
      <span>{{ p.nama }}</span>
      <span>{{ formatUang(p.harga) }} × {{ p.jumlah }}</span>
      <button @click="kurangJumlah(p.id)">−</button>
      <button @click="tambahJumlah(p.id)">+</button>
      <button @click="hapusItem(p.id)">🗑️</button>
    </div>

    <hr />

    <p>Total Item: {{ totalItem }}</p>
    <p>Subtotal: {{ formatUang(subtotal) }}</p>

    <label>
      Diskon (%):
      <input type="number" v-model.number="diskonPersen" min="0" max="100" />
    </label>

    <h3>Total Bayar: {{ formatUang(totalBayar) }}</h3>
  </div>
</template>
```

**Bukti reaktivitas di contoh ini:**

| Aksi | Yang Terjadi |
| --- | --- |
| Klik `+` pada item | `p.jumlah++` → `totalItem`, `subtotal`, `totalBayar` ikut hitung ulang |
| Hapus item | `daftarProduk.value = filter(...)` → semua computed update |
| Ubah diskon | `diskonPersen` berubah → `totalBayar` (computed) update + `watch` terpicu |

> 🎯 **Ini inti Bab 5:** Satu sumber kebenaran (`daftarProduk`, `diskonPersen`) → banyak tampilan turunan otomatis mengikuti, tanpa satu pun manipulasi DOM manual. Persis seperti spreadsheet!

---

## ❓ 21. FAQ Reaktivitas (Pertanyaan Pemula)

**Q: Kenapa `console.log(state)` menampilkan `RefImpl` bukan nilainya?**
A: Karena `state` adalah ref. Log `state.value` untuk melihat isinya. Di template Vue otomatis membuka `.value`.

**Q: Apakah `ref` bisa berisi object?**
A: Bisa. `const u = ref({ nama: 'Budi' })` → akses `u.value.nama`. Vue otomatis membuat isinya reaktif (deep).

**Q: `reactive` lebih cepat dari `ref`?**
A: Tidak signifikan. Pilih berdasarkan kebutuhan (primitif vs object), bukan performa.

**Q: Bolehkah pakai `reactive` untuk array?**
A: Boleh, malah disarankan untuk array yang sering dimutasi (`push`, `splice`). Atau `ref([])`.

**Q: Mengapa `film.tahun = 2024` (property baru) reaktif di Vue 3 tapi tidak Vue 2?**
A: Vue 3 pakai `Proxy` yang menangkap penambahan property apa pun. Vue 2 pakai `Object.defineProperty` yang hanya menangkap property yang ada saat definisi.

**Q: Bagaimana cara "reset" reactive object?**
A: `Object.assign(state, initialState)` — mutasi property satu per satu, bukan ganti variable.

---

## 🎓 22. Latihan Pemahaman Cepat (Self-Test)

```
SOAL 1: Simpan string nama user. Pakai ref atau reactive?
JAWABAN: ref('') — nilai primitif.

SOAL 2: const s = reactive({a:1}); const {a} = s; a = 5. Apa yang salah?
JAWABAN: Destructuring memutus reaktivitas. Pakai toRefs(s).

SOAL 3: Ingin ganti seluruh reactive object. Boleh s = reactive({...})?
JAWABAN: TIDAK. Mutasi property atau pakai ref agar bisa reassign.

SOAL 4: Apa beda ref & shallowRef?
JAWABAN: ref punya deep reactivity; shallowRef hanya reaktif saat .value diganti utuh.

SOAL 5: Di template, tulis .value atau tidak?
JAWABAN: TIDAK perlu — Vue unwrap otomatis.
```

---

## 🔁 23. Reaktivitas & `v-for` (List Dinamis)

Salah satu penggunaan reaktivitas paling umum adalah list yang bisa bertambah/berkurang. Mari pastikan kamu memahami cara mutasi yang benar.

```vue
<script setup>
import { ref } from 'vue'

const todo = ref([
  { id: 1, teks: 'Belajar Vue', selesai: false },
  { id: 2, teks: 'Buat project', selesai: false },
])

// ✅ TAMBAH — push ke ref array (reaktif di Vue 3)
function tambah() {
  const idBaru = todo.value.length + 1
  todo.value.push({ id: idBaru, teks: 'Tugas baru', selesai: false })
}

// ✅ HAPUS — filter menghasilkan array baru, assign ke .value
function hapus(id) {
  todo.value = todo.value.filter(t => t.id !== id)   // reaktif ✅
}

// ✅ TOGGLE — mutasi property dalam item (deep reactivity)
function toggle(id) {
  const t = todo.value.find(x => x.id === id)
  if (t) t.selesai = !t.selesai    // template ikut update ✅
}

// ✅ UBAH INDEX — di Vue 3, mengubah via index juga reaktif
function ubahPertama() {
  todo.value[0].teks = 'Diubah'    // reaktif ✅ (berbeda Vue 2)
}
</script>

<template>
  <ul>
    <!-- SELALU pakai :key unik (bukan index!) -->
    <li v-for="t in todo" :key="t.id">
      <input type="checkbox" v-model="t.selesai" />
      <span :style="{ textDecoration: t.selesai ? 'line-through' : 'none' }">
        {{ t.teks }}
      </span>
      <button @click="hapus(t.id)">🗑️</button>
    </li>
  </ul>
  <button @click="tambah">+ Tambah</button>
</template>
```

**Tabel cara mutasi list yang benar:**

| Aksi | Cara Reaktif ✅ | Cara Salah ❌ |
| --- | --- | --- |
| Tambah | `list.value.push(x)` | `list.push(x)` (lupa .value) |
| Hapus by id | `list.value = filter(...)` | mutasi manual |
| Toggle | `item.x = !item.x` | assign ulang object |
| Kosongkan | `list.value = []` | `list.value.length = 0` (kurang disarankan) |
| Update index | `list.value[i].x = y` | — (Vue 3 OK) |

> ⚠️ **`:key` wajib unik & stabil.** Jangan pakai `index` sebagai key jika list bisa berubah urutan/bertambah — pakai `id` unik. Key yang salah membuat Vue salah mencocokkan node → bug tampilan.

---

## 🏁 24. Kesimpulan Bab 5

Reaktivitas adalah **fondasi segalanya** di Vue. Setelah bab ini, kamu memahami:
- Bagaimana Vue melacak dependency (Proxy).
- Perbedaan `ref` vs `reactive` dan kapan pakai masing-masing.
- Jebakan destructure & re-assign yang mematikan reaktivitas.
- Tools `toRefs`, `shallowRef`, `readonly` untuk kasus lanjut.
- Reaktivitas pada array, Map, dan Set.

Tanpa pemahaman ini, fitur selanjutnya (computed, watchers, props) akan terasa seperti sihir. Sekarang sihir itu sudah kamu pahami akarnya. 🎉

---

## 📖 25. Glosarium Reaktivitas

| Istilah | Arti |
| --- | --- |
| **Reaktivitas** | Sistem agar tampilan otomatis ikut berubah saat data berubah |
| **Proxy** | Teknologi JS yang membungkus object untuk melacak GET/SET |
| **Dependency tracking** | Proses Vue mencatat "siapa bergantung pada sumber mana" |
| **Trigger / Effect** | Kode (template/computed/watch) yang dijalankan saat dependency berubah |
| **`ref`** | Fungsi pembungkus nilai tunggal agar reaktif (akses via `.value`) |
| **`reactive`** | Fungsi pembungkus object/array agar reaktif (akses langsung) |
| **Deep reactivity** | Reaktivitas otomatis hingga property bersarang |
| **`toRefs`** | Mengubah property `reactive` jadi `ref` tetap terhubung |
| **`shallowRef`** | `ref` tanpa deep tracking (hanya reaktif saat `.value` diganti) |
| **`readonly`** | Membuat state tidak bisa dimutasi |
| **Memory leak** | Resource (interval/listener) tidak dibersihkan → memori bocor |

---

## 🔭 26. Melihat ke Depan

Setelah menguasai reaktivitas, di bab selanjutnya kamu akan melihat betapa reaktivitas adalah pondasi:

- **Bab 6 (Computed & Watchers):** `computed` & `watch` **adalah** aplikasi reaktivitas — mereka "berlangganan" ke ref/reactive.
- **Bab 7 (Props & Emits):** Props sebenarnya adalah reactive di child; mutasi dilarang agar tracking tetap jelas.
- **Bab 8 (Slots):** Scoped slot mengirim data (bisa reactive) dari child ke parent.
- **Bab 9 (Lifecycle):** `onMounted` adalah tempat terbaik memulai reaktivitas yang butuh DOM.

> 💡 **Pesan penutup:** Jika suatu hari tampilanmu tidak update, 90% kemungkinan bukan bug Vue — melainkan kamu secara tidak sengaja **memutus reaktivitas** (lupa `.value`, destructure tanpa `toRefs`, atau re-assign `reactive`). Kembali ke bab ini, dan kamu akan menemukan jawabannya.

---

## 🎯 27. Quiz Singkat Reaktivitas

```
1. Apa itu Proxy dalam konteks reaktivitas Vue 3?
   → Teknologi pembungkus object untuk melacak akses (GET) & perubahan (SET).

2. Kapan menggunakan .value?
   → Di dalam <script> untuk ref. Di template TIDAK perlu.

3. Apa beda ref dan reactive?
   → ref untuk nilai tunggal (butuh .value), reactive untuk object/array (langsung).

4. Mengapa destructure reactive mematikan reaktivitas?
   → Karena variabel hasil copy bukan lagi Proxy → tidak diawasi Vue.

5. Solusi destructure agar tetap reaktif?
   → Gunakan toRefs() / toRef().

6. Apa itu deep reactivity?
   → Reaktivitas otomatis hingga property bersarang dalam object.

7. Bagaimana membersihkan reaktivitas object besar?
   → shallowRef / shallowReactive untuk optimasi.
```

---

## 🎨 28. Contoh Mini: Toggle Tema (Reaktivitas Sederhana)

Contoh kecil namun lengkap yang menunjukkan reaktivitas mengubah tampilan secara langsung.

```vue
<script setup>
import { ref } from 'vue'

const isDark = ref(false)

function toggle() {
  isDark.value = !isDark.value   // ubah nilai → class di bawah ikut
}
</script>

<template>
  <!-- class berubah otomatis mengikuti isDark -->
  <div :class="isDark ? 'tema-gelap' : 'tema-terang'" class="app">
    <button @click="toggle">
      {{ isDark ? '☀️ Mode Terang' : '🌙 Mode Gelap' }}
    </button>
    <p>Status tema: {{ isDark ? 'Gelap' : 'Terang' }}</p>
  </div>
</template>

<style scoped>
.tema-gelap  { background: #1f2937; color: #f9fafb; }
.tema-terang { background: #ffffff; color: #111827; }
.app { padding: 2rem; border-radius: 12px; transition: all .3s; }
</style>
```

> 💡 **Pelajaran:** Cukup ubah satu ref (`isDark`), dan **seluruh tampilan** (class, teks, gaya) mengikuti. Inilah reaktivitas dalam bentuk paling murni — tanpa `document.getElementById` satu pun.

---

## 📝 Ringkasan Bab 5

| Konsep | Penjelasan |
| --- | --- |
| **Reaktivitas** | Sistem Vue agar tampilan otomatis mengikuti perubahan data |
| **Analogi Spreadsheet** | `A1` berubah → rumus `B1` ikut berubah otomatis |
| **Proxy (Vue 3)** | Mesin reaktivitas yang melacak GET/SET pada object |
| **`ref()`** | Reaktivitas untuk nilai tunggal (primitif & object); akses via `.value` di script |
| **`reactive()`** | Reaktivitas untuk object/array; akses langsung tanpa `.value` |
| **Deep Reactivity** | Object bersarang hingga level dalam ikut reaktif otomatis |
| **`.value` di Script** | Wajib untuk `ref` di dalam `<script>` |
| **`.value` di Template** | Tidak perlu — Vue unwrap otomatis |
| **`toRefs()` / `toRef()`** | Mengeluarkan property dari `reactive` tetap reaktif |
| **Jebakan Destructuring** | `const { x } = reactive(...)` memutus reaktivitas → pakai `toRefs` |
| **Jebakan Re-assign** | Jangan ganti `reactive` utuh → mutasi property atau pakai `ref` |
| **`shallowRef`/`shallowReactive`** | Optimasi untuk data besar (tanpa deep tracking) |
| **`readonly`** | Membuat state tidak bisa diubah (defensive programming) |
| **Map & Set** | Didukung reaktif di Vue 3 (tidak di Vue 2) |

---

## 🎯 Latihan Mandiri

**⭐ Latihan 1 — Counter Minimal**
Buat komponen `Penghitung` menggunakan `ref()`. Tampilkan angka dan dua tombol (Tambah / Kurang). Pastikan angka otomatis update tanpa manipulasi DOM manual.

**⭐⭐ Latihan 2 — Form Profil dengan `reactive`**
Buat komponen `FormProfil` dengan `reactive()` berisi `nama`, `email`, `umur`. Gunakan `v-model` pada input. Tambahkan tombol "Reset" yang mengembalikan semua field ke kosong menggunakan `Object.assign`.

**⭐⭐⭐ Latihan 3 — Daftar Belanjaan Reaktif**
Buat komponen `DaftarBelanja` dengan `ref([])` berisi item `{ nama, harga, jumlah }`. Fitur: tambah item, hapus item, dan `computed` yang menghitung **total harga** (`harga * jumlah` untuk semua item). Buktikan `computed` ikut berubah saat item ditambah/dihapus.

**⭐⭐⭐⭐ Latihan 4 — Game Skor dengan `toRefs` & `readonly`**
Buat composable `useGame()` yang mengembalikan `{ skor, nyawa, naikSkor, kurangiNyawa }` menggunakan `reactive` + `toRefs`. Komponen `HUD` menerima `skor` sebagai `readonly` dan menampilkannya besar-besar, sementara komponen `Kontrol` memanggil `naikSkor`/`kurangiNyawa`. Pastikan HUD update otomatis namun tidak bisa mengubah skor langsung.

---

*Lanjut ke ➡️ **Bab 6 — 🧮 Computed Properties & Watchers***
