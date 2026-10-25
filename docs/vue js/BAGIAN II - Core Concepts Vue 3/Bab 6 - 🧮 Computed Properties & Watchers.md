# 🧮 Bab 6 — Computed Properties & Watchers

> *"Seorang koki tidak memanggil pelayan setiap kali ingin tahu harga bahan. Ia punya kalkulator yang selalu tahu total belanjaan begitu harga berubah. `computed` adalah kalkulator itu; `watch` adalah pelayan yang berlari memberitahumu saat stok habis."*

---

> **🧠 Apa Itu Computed & Watchers?**
>
> Di Bab 5 kita tahu Vue otomatis update tampilan saat data berubah. Tapi sering kita butuh **data baru yang dihitung dari data lain** (misal total belanja = harga × jumlah) atau ingin **merespons perubahan data dengan aksi** (misal panggil API saat kata kunci pencarian berubah). Dua kebutuhan ini dilayani oleh: **`computed`** untuk nilai turunan yang efisien (cached), dan **`watch` / `watchEffect`** untuk menjalankan efek samping (side effect) saat data berubah.

---

> **🏗️ Analogi Sederhana:**
>
> Bayangkan kamu punya **kalkulator** dan **asisten pribadi**. **`computed` adalah kalkulator**: ia menghitung total otomatis setiap kali kamu ubah input, dan ia **ingat hasil terakhir** (cache) sehingga tidak perlu hitung ulang jika input tidak berubah. **`watch` adalah asisten pribadi**: ia tidak menghitung apa-apa, tapi ia **memperhatikan** satu hal — misal "jika stok di bawah 5, telepon supplier". Saat itu terjadi, ia mengeksekusi tugas (side effect). Keduanya berbeda peran, dan mengenali perbedaannya adalah kunci bab ini.

---

## 📋 Daftar Isi Bab 6

1. Mengapa Perlu Computed? — Masalah yang Diselesaikan
2. `computed()` — Dasar Penggunaan
3. `computed` dengan Setter (Get & Set)
4. `computed` vs Method — Pertarungan Efisiensi
5. Kapan Menggunakan `computed` vs Method
6. `watch()` — Memantau Satu Sumber
7. `watch()` dengan Opsi (`immediate`, `deep`)
8. `watch()` Multi-Sumber & Array
9. `watchEffect()` — Pantau Semua Otomatis
10. `watch` vs `watchEffect` — Perbandingan Lengkap
11. `watchPostEffect` & `watchSyncEffect`
12. Membersihkan Side Effect (Cleanup Function)
13. `watch` pada `reactive` Object (getter function)
14. Studi Kasus — Search & Filter Film Real-time
15. Jebakan Umum Pemula di Bab 6
16. Ringkasan & Latihan Mandiri

---

## 🔬 1. Mengapa Perlu Computed? — Masalah yang Diselesaikan

Bayangkan kita punya data `harga` dan `jumlah`. Kita ingin menampilkan total. Cara naif:

```vue
<script setup>
import { ref } from 'vue'

const harga  = ref(150000)
const jumlah = ref(3)
</script>

<template>
  <!-- ❌ Kurang baik: logika perkalian di template -->
  <p>Total: Rp {{ harga * jumlah }}</p>

  <!-- ❌ Lebih buruk: kalau butuh di 3 tempat, tulis 3x -->
  <p>Subtotal: Rp {{ harga * jumlah }}</p>
  <p>Total dengan PPN: Rp {{ harga * jumlah * 1.1 }}</p>
</template>
```

**Masalahnya:**
1. Logika bisnis (perkalian) bercampur dengan tampilan → sulit dibaca & diuji.
2. Jika rumus berubah, harus diedit di banyak tempat.
3. Tidak ada caching — setiap render menghitung ulang (boros untuk data besar).

**Solusi:** Pindahkan ke `computed`. Template jadi bersih, dan hasil di-cache.

---

## 🧮 2. `computed()` — Dasar Penggunaan

`computed()` menerima sebuah **fungsi getter** yang mengembalikan nilai. Vue melacak dependency-nya dan **hanya menghitung ulang saat dependency berubah**.

```vue
<script setup>
import { ref, computed } from 'vue'

const harga  = ref(150000)
const jumlah = ref(3)
const diskon = ref(10)        // persen

// computed: total sebelum diskon
const subtotal = computed(() => harga.value * jumlah.value)
//                    ↑ arrow function getter
//                    ↑ Vue otomatis tahu subtotal bergantung pada harga & jumlah

// computed: nilai diskon
const totalDiskon = computed(() => subtotal.value * (diskon.value / 100))

// computed: total akhir
const totalBayar = computed(() => subtotal.value - totalDiskon.value)

// computed: formatting (bisa chain ke computed lain)
const hargaFormat = computed(() =>
  'Rp ' + totalBayar.value.toLocaleString('id-ID')
)
</script>

<template>
  <p>Subtotal : Rp {{ subtotal.toLocaleString('id-ID') }}</p>
  <p>Diskon   : Rp {{ totalDiskon.toLocaleString('id-ID') }}</p>
  <p>Total    : {{ hargaFormat }}</p>
  <!-- totalBayar hanya dihitung ulang bila harga/jumlah/diskon berubah -->
</template>
```

**Baris per baris:**
- `computed(() => ...)` → buat nilai turunan.
- Di dalam getter kita membaca `harga.value`, `jumlah.value` → Vue mencatat ini sebagai **dependency**.
- Saat `harga` atau `jumlah` berubah → getter dijalankan ulang → `subtotal` diperbarui.
- Saat `harga` & `jumlah` **tidak** berubah → `subtotal` mengembalikan **hasil cache**, tidak hitung ulang.

> 💡 **Aturan Emas Computed:** Jangan lakukan **side effect** (seperti memanggil API, mengubah DOM, `console.log` state lain) di dalam computed. Computed harus **murni** (pure): hanya menghitung dan mengembalikan nilai berdasarkan dependency-nya. Side effect → gunakan `watch`.

---

## 🔁 3. `computed` dengan Setter (Get & Set)

`computed` biasanya **read-only** (hanya getter). Tapi bisa juga punya **setter** — berguna saat kamu ingin `v-model` langsung ke computed yang "memecah" nilainya ke beberapa ref.

```vue
<script setup>
import { ref, computed } from 'vue'

const namaDepan  = ref('Budi')
const namaBelakang = ref('Santoso')

// computed dengan getter & setter
const namaLengkap = computed({
  // getter: menggabung
  get() {
    return `${namaDepan.value} ${namaBelakang.value}`
  },
  // setter: memecah saat namaLengkap di-assign
  set(nilaiBaru) {
    const [depan, ...sisa] = nilaiBaru.split(' ')
    namaDepan.value    = depan
    namaBelakang.value = sisa.join(' ')
  },
})
</script>

<template>
  <!-- v-model ke computed: saat diketik, setter memecah ke namaDepan/Belakang -->
  <input v-model="namaLengkap" />
  <p>Depan: {{ namaDepan }}</p>
  <p>Belakang: {{ namaBelakang }}</p>
</template>
```

**Cara kerja:**
- Mengetik "Ani Wijaya" di input → `set("Ani Wijaya")` dipanggil → `namaDepan = "Ani"`, `namaBelakang = "Wijaya"`.
- Template membaca `namaLengkap` → trigger `get()` → menampilkan gabungan terbaru.

> ⚠️ **Hati-hati:** Setter computed idealnya tetap **proporsional** — jangan lakukan side effect berat (API call) di setter. Untuk reaksi kompleks, gunakan `watch`.

---

## ⚡ 4. `computed` vs Method — Pertarungan Efisiensi

Ini perbandingan paling penting di bab ini. Mari kita lihat keduanya side-by-side.

```vue
<script setup>
import { ref, computed } from 'vue'

const films = ref(Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  title: `Film ${i}`,
  genre: i % 2 === 0 ? 'action' : 'drama',
})))

// ✅ COMPUTED: filter dijalankan ulang HANYA jika 'films' berubah
const filmAksi = computed(() =>
  films.value.filter(f => f.genre === 'action')
)

// ❌ METHOD: filter dijalankan SETIAP template re-render
function getFilmAksi() {
  return films.value.filter(f => f.genre === 'action')
}
</script>

<template>
  <!-- computed: efisien, hasil di-cache -->
  <p>Jumlah film aksi (computed): {{ filmAksi.length }}</p>

  <!-- method: boros, hitung ulang tiap render -->
  <p>Jumlah film aksi (method): {{ getFilmAksi().length }}</p>

  <!-- Bayangkan ini dipanggil di 10 tempat & 1000 data → beda performa drastis -->
</template>
```

### 4.1 Tabel Perbandingan

| Aspek | `computed` | `method` (function) |
| --- | --- | --- |
| **Kapan dijalankan** | Hanya saat dependency berubah | Setiap kali template re-render |
| **Caching** | ✅ Ya — hasil disimpan | ❌ Tidak — selalu hitung ulang |
| **Kegunaan** | Data turunan yang sering diakses | Aksi dipicu event / format sekali pakai |
| **Return value** | Wajib `return` nilai | Boleh tidak return |
| **Bisa async?** | ❌ Tidak (harus sinkron) | ✅ Bisa (tapi jarang untuk format) |
| **Akses di template** | Seperti property: `{{ x }}` | Seperti fungsi: `{{ x() }}` |

> 💡 **Mnemonic:** Kalau nilainya akan **ditampilkan berulang** atau **dipakai di banyak tempat** → `computed`. Kalau itu **aksi** (tombol diklik, form disubmit) → `method`.

---

## 🎯 5. Kapan Menggunakan `computed` vs Method

```
GUNAKAN computed() JIKA:
  ✅ Nilai dihitung dari state lain
  ✅ Nilai ditampilkan di beberapa tempat
  ✅ Ingin performa optimal (cache)
  ✅ Contoh: total harga, filter list, nama lengkap, status derived

GUNAKAN method/function JIKA:
  ✅ Dipanggil sebagai respons event (@click, @submit)
  ✅ Hanya dipakai sekali di template
  ✅ Perlu parameter dinamis (computed tidak terima argumen!)
  ✅ Contoh: handleSubmit(), formatTanggal(tgl), cari(spesifik)
```

**Catatan penting:** `computed` **tidak bisa menerima argumen**. Jika butuh parameter, gunakan method:

```vue
<script setup>
import { ref, computed } from 'vue'

const daftar = ref([10, 20, 30, 40])

// ❌ TIDAK BISA: computed dengan argumen
// const kali = computed((n) => daftar.value.map(x => x * n))  // ERROR

// ✅ Gunakan method untuk yang butuh argumen
function kaliDengan(n) {
  return daftar.value.map(x => x * n)
}
</script>

<template>
  <p>{{ kaliDengan(2) }}</p>   <!-- [20, 40, 60, 80] -->
  <p>{{ kaliDengan(3) }}</p>   <!-- [30, 60, 90, 120] -->
</template>
```

---

## 👀 6. `watch()` — Memantau Satu Sumber

`watch()` digunakan untuk **merespons perubahan** pada satu atau beberapa sumber dengan menjalankan **side effect** (efek samping) — misalnya memanggil API, menyimpan ke localStorage, atau menampilkan notifikasi.

```vue
<script setup>
import { ref, watch } from 'vue'

const keyword = ref('')
const hasil   = ref([])

// watch(sumber, callback)
watch(keyword, async (nilaiBaru, nilaiLama) => {
  // Dipanggil SETIAP kali 'keyword' berubah
  console.log(`Dari "${nilaiLama}" → "${nilaiBaru}"`)

  if (nilaiBaru.length < 2) {
    hasil.value = []
    return
  }

  // Side effect: panggil API pencarian
  hasil.value = await cariFilm(nilaiBaru)
})
</script>
```

**Anatomi `watch`:**
- Argumen 1: **sumber** yang dipantau (bisa ref, reactive, atau getter function).
- Argumen 2: **callback** `(nilaiBaru, nilaiLama) => { ... }`.
- `nilaiLama` hanya tersedia untuk `watch`, tidak untuk `watchEffect`.

> 💡 **Kapan pakai `watch`?** Saat kamu butuh **efek samping** (API call, timer, DOM manipulation) sebagai reaksi dari perubahan data — bukan sekadar menghitung nilai turunan (itu ranah `computed`).

---

## 🎛️ 7. `watch()` dengan Opsi (`immediate`, `deep`)

`watch()` menerima argumen ketiga berupa **object opsi**.

```vue
<script setup>
import { ref, reactive, watch } from 'vue'

const keyword = ref('')
const user    = reactive({ nama: 'Budi', alamat: { kota: 'Yogya' } })

// ── Opsi immediate: jalankan callback SEKETIKA saat watch dibuat ──
watch(keyword, (baru) => {
  console.log('keyword sekarang:', baru)
}, { immediate: true })   // callback langsung dipanggil 1x saat setup
// Tanpa immediate, callback hanya jalan saat keyword BERUBAH nanti

// ── Opsi deep: pantau perubahan BERSARANG dalam object ──
watch(user, (baru) => {
  console.log('user berubah:', baru)
}, { deep: true })        // agar user.alamat.kota = 'Jakarta' ikut terdeteksi

// deep sering dipakai bersama getter untuk object spesifik:
watch(() => user.alamat, (baru) => {
  console.log('alamat berubah:', baru)
}, { deep: true })
</script>
```

### 7.1 Tabel Opsi `watch`

| Opsi | Tipe | Default | Fungsi |
| --- | --- | --- | --- |
| `immediate` | boolean | `false` | Jalankan callback saat watch dibuat (tidak tunggu perubahan) |
| `deep` | boolean | `false` | Lacak perubahan pada property bersarang object/array |
| `flush` | `'pre'\|'post'\|'sync'` | `'pre'` | Kapan callback dijalankan relatif terhadap render DOM |
| `onCleanup` | function | — | Daftarkan fungsi cleanup (lihat section 12) |

> ⚠️ **Catatan `deep`:** `deep: true` memakan biaya performa karena Vue harus melacak seluruh struktur bersarang. Gunakan **getter function** (`() => user.alamat.kota`) bila hanya butuh property tertentu, lebih efisien daripada `deep: true` pada object besar.

---

## 🔢 8. `watch()` Multi-Sumber & Array

`watch()` bisa memantau **beberapa sumber sekaligus** dengan meneruskan array.

```vue
<script setup>
import { ref, watch } from 'vue'

const keyword     = ref('')
const genreDipilih = ref('semua')
const urutDari    = ref('terbaru')

// Pantau BANYAK sumber sekaligus
watch([keyword, genreDipilih, urutDari], async ([kwBaru, genreBaru, urutBaru]) => {
  // kwBaru    = nilai baru keyword
  // genreBaru = nilai baru genreDipilih
  // urutBaru  = nilai baru urutDari
  console.log('Salah satu filter berubah!')
  hasil.value = await fetchFilm({ keyword: kwBaru, genre: genreBaru, sort: urutBaru })
}, { deep: true })
</script>
```

**Keuntungan:** Satu watch menangani beberapa filter → kode lebih rapi daripada 3 watch terpisah.

---

## 🔮 9. `watchEffect()` — Pantau Semua Otomatis

Berbeda dengan `watch` yang butuh kamu **menyebutkan sumber secara eksplisit**, `watchEffect()` **otomatis mendeteksi** semua reactive value yang dibaca di dalamnya.

```vue
<script setup>
import { ref, watchEffect } from 'vue'

const userId = ref(1)
const profil = ref(null)

// watchEffect: TIDAK perlu sebut sumber — Vue otomatis tahu
watchEffect(async () => {
  // Karena kita membaca userId.value di sini,
  // Vue tahu effect ini bergantung pada userId
  profil.value = await ambilProfil(userId.value)
})
// Saat userId berubah → effect dijalankan ulang otomatis
</script>
```

**Perbedaan krusial:**
- `watch`: kamu bilang "pantau **userId**" secara eksplisit.
- `watchEffect`: kamu bilang "jalankan fungsi ini; pantau **apapun yang kubaca** di dalamnya".

> 💡 **Kapan `watchEffect` lebih enak?** Saat efekmu bergantung pada **banyak** sumber sekaligus dan malas menyebutnya satu-satu. Tapi hati-hati: karena ia menangkap SEMUA yang dibaca, ia bisa ikut terpicu oleh dependency yang tidak kamu sadari.

---

## ⚔️ 10. `watch` vs `watchEffect` — Perbandingan Lengkap

| Aspek | `watch` | `watchEffect` |
| --- | --- | --- |
| **Sumber** | Harus disebut eksplisit | Otomatis (apa yang dibaca) |
| **Akses nilai lama** | ✅ Ya (`nilaiLama`) | ❌ Tidak |
| **Jalankan saat setup** | Default tidak (kecuali `immediate`) | ✅ Ya (langsung) |
| **Lazy / eager** | Lazy (tunggu perubahan) | Eager (langsung jalan 1x) |
| **Cocok untuk** | Reaksi spesifik 1-3 data | Side effect bergantung banyak data |
| **Fine control** | ✅ Lebih presisi | ❌ Kurang presisi |

```vue
<script setup>
import { ref, watch, watchEffect } from 'vue'

const a = ref(1)
const b = ref(2)

// watch: spesifik, punya nilai lama
watch(a, (baru, lama) => console.log(`a: ${lama} → ${baru}`))

// watchEffect: otomatis tangkap a & b
watchEffect(() => console.log(`total: ${a.value + b.value}`))
// langsung log "total: 3", lalu log lagi tiap a/b berubah
</script>
```

**Panduan praktis:**
```
Perlu tahu nilai LAMA?           → watch
Perlu jalan SEKETIKA saat setup? → watchEffect (atau watch + immediate)
Hanya 1-2 sumber spesifik?       → watch
Banyak sumber, malas sebut 1-1?  → watchEffect
```

---

## 🔄 11. `watchPostEffect` & `watchSyncEffect`

Vue juga punya varian `watchEffect` dengan timing berbeda:

```vue
<script setup>
import { ref, watchPostEffect, watchSyncEffect } from 'vue'

const count = ref(0)

// watchPostEffect: jalan SETELAH DOM di-update (pasca-render)
watchPostEffect(() => {
  // aman akses DOM yang sudah dirender
  console.log('DOM sudah update:', document.querySelector('.el')?.textContent)
})

// watchSyncEffect: jalan SEGERA (sinkron) saat dependency berubah
// ⚠️ jarang dipakai — bisa bikin perf issue kalau salah pakai
watchSyncEffect(() => {
  console.log('sync:', count.value)
})
</script>
```

> ⚠️ **Umumnya cukup pakai `watch` dan `watchEffect` standar.** `watchPostEffect` berguna bila kamu butuh mengukur ukuran elemen DOM setelah render. `watchSyncEffect` hampir tidak pernah dibutuhkan pemula.

---

## 🧹 12. Membersihkan Side Effect (Cleanup Function)

Saat watch memicu efek async (misal fetch API), request lama mungkin masih berjalan saat request baru dimulai. Kita bisa **membatalkan** lewat fungsi cleanup yang diterima di callback (atau `onCleanup` di watchEffect).

```vue
<script setup>
import { ref, watch } from 'vue'

const keyword = ref('')
const hasil   = ref([])

// ── Cleanup di watch (argumen ke-3 via onCleanup) ──
watch(keyword, async (kw, lama, onCleanup) => {
  // Buat token pembatalan sederhana
  let dibatalkan = false
  onCleanup(() => { dibatalkan = true })   // saat keyword berubah lagi, ini dipanggil

  const data = await cariFilm(kw)
  if (!dibatalkan) hasil.value = data      // abaikan hasil kalau sudah dibatalkan
})

// ── Cleanup di watchEffect (via onCleanup) ──
import { watchEffect, onCleanup } from 'vue'
watchEffect((onCleanup) => {
  const id = setInterval(() => console.log('tick'), 1000)
  onCleanup(() => clearInterval(id))    // bersihkan saat effect dijalankan ulang
})
</script>
```

**Mengapa penting?** Tanpa cleanup, request API lambat bisa **menimpa** hasil request terbaru (race condition), atau timer menumpuk memakan memori.

---

## 🔗 13. `watch` pada `reactive` Object (getter function)

Untuk memantau **property tertentu** dalam `reactive` object, gunakan **getter function** sebagai sumber.

```vue
<script setup>
import { reactive, watch } from 'vue'

const form = reactive({
  nama:   '',
  email:  '',
  sandi:  '',
})

// ✅ Pantau SATU property saja (efisien)
watch(() => form.email, (emailBaru) => {
  console.log('Email berubah:', emailBaru)
  // misal: validasi email secara live
})

// ✅ Pantau beberapa property sekaligus
watch(
  () => [form.nama, form.email],
  ([namaBaru, emailBaru]) => {
    console.log('Nama/Email berubah:', namaBaru, emailBaru)
  }
)

// ❌ JANGAN watch reactive utuh tanpa deep (hanya tangkap referensi, bukan isi)
// watch(form, ...) → hanya terpicu saat 'form' diganti seluruhnya
// ✅ Gunakan deep: true bila mau pantau semua isi form
watch(form, () => console.log('form berubah (deep)'), { deep: true })
</script>
```

> 💡 **Tip:** Untuk form, pola `watch(() => form.field, cb)` jauh lebih efisien daripada `watch(form, cb, { deep: true })` karena hanya melacak field yang dimaksud.

---

## 🎬 14. Studi Kasus — Search & Filter Film Real-time

Mari gabungkan `computed` + `watch` dalam satu studi kasus nyata: mencari & memfilter film dari TMDB-style API.

```vue
<!-- MovieSearch.vue -->
<script setup>
import { ref, computed, watch } from 'vue'

// ── STATE ──
const semuaFilm    = ref([])        // hasil fetch dari API
const keyword      = ref('')        // input pencarian user
const genreDipilih = ref('semua')   // filter genre
const isLoading    = ref(false)
const errorMsg     = ref('')

// ── COMPUTED: filter SISI KLIEN (tidak perlu API) ──
// Dihitung ulang otomatis saat keyword atau genre berubah
const filmTerfilter = computed(() => {
  const kw = keyword.value.toLowerCase().trim()
  return semuaFilm.value.filter(film => {
    const cocokKeyword = film.title.toLowerCase().includes(kw)
    const cocokGenre   = genreDipilih.value === 'semua'
      || film.genre === genreDipilih.value
    return cocokKeyword && cocokGenre
  })
})

// ── COMPUTED: statistik ──
const jumlahHasil = computed(() => filmTerfilter.value.length)

// ── WATCH: panggil API SAAT GENRE berubah (bukan saat keyword) ──
watch(genreDipilih, async (genreBaru) => {
  isLoading.value = true
  errorMsg.value  = ''
  try {
    // Ambil film berdasarkan genre dari API
    semuaFilm.value = await ambilFilmByGenre(genreBaru)
  } catch (e) {
    errorMsg.value = 'Gagal memuat film: ' + e.message
  } finally {
    isLoading.value = false
  }
}, { immediate: true })   // langsung fetch saat komponen dimuat
</script>

<template>
  <div class="kontainer">
    <!-- Input pencarian (computed menangani filter lokal) -->
    <input
      v-model="keyword"
      placeholder="Cari film..."
      class="input-cari"
    />

    <!-- Pilihan genre (watch menangani fetch API) -->
    <select v-model="genreDipilih" class="select-genre">
      <option value="semua">Semua Genre</option>
      <option value="action">Action</option>
      <option value="drama">Drama</option>
      <option value="sci-fi">Sci-Fi</option>
    </select>

    <!-- Status -->
    <p v-if="isLoading">⏳ Memuat...</p>
    <p v-else-if="errorMsg" class="error">{{ errorMsg }}</p>
    <p v-else>{{ jumlahHasil }} film ditemukan</p>

    <!-- Hasil (computed, reaktif) -->
    <ul class="grid-film">
      <li v-for="film in filmTerfilter" :key="film.id" class="kartu">
        <h3>{{ film.title }}</h3>
        <span class="badge">{{ film.genre }}</span>
      </li>
    </ul>
  </div>
</template>
```

**Mengapa desain ini bagus?**

| Bagian | Peran | Alasan |
| --- | --- | --- |
| `keyword` + `computed` | Filter lokal instan | Tidak perlu API call tiap ketikan → cepat & hemat kuota |
| `genreDipilih` + `watch` | Fetch API saat genre ganti | Genre butuh data baru dari server |
| `immediate: true` | Fetch awal | Saat halaman dibuka, langsung ambil film "semua" |
| `computed` `filmTerfilter` | Gabung keyword + genre | Satu sumber kebenaran untuk tampilan |

> 🎯 **Peningkatan (Latihan):** Tambahkan `watch` kedua yang memanggil API search ke `keyword` **hanya setelah user berhenti mengetik 400ms** (debounce). Ini teknik `useDebounce` yang akan dibahas di Bab 14!

---

## 🚨 15. Jebakan Umum Pemula di Bab 6

### ❌ Jebakan 1 — Menaruh Side Effect di `computed`

```javascript
// ❌ SALAH — computed harus murni (pure), jangan panggil API / mutasi
const total = computed(() => {
  simpanKeDatabase(harga.value)   // side effect!
  return harga.value * jumlah.value
})

// ✅ BENAR — pindahkan side effect ke watch
const total = computed(() => harga.value * jumlah.value)
watch(total, (baru) => simpanKeDatabase(baru))
```

### ❌ Jebakan 2 — Mengira `computed` Bisa Terima Argumen

```javascript
// ❌ SALAH
const duaKali = computed((n) => n * 2)   // computed tidak terima argumen

// ✅ BENAR — gunakan method
function duaKali(n) { return n * 2 }
```

### ❌ Jebakan 3 — Lupa `deep` Saat Watch Object Bersarang

```javascript
// ❌ SALAH — watch form biasa tidak tangkap perubahan property dalam
watch(form, () => console.log('berubah'))   // hanya saat form diganti utuh

// ✅ BENAR — pakai getter spesifik (lebih efisien)
watch(() => form.email, () => console.log('email berubah'))

// ✅ ATAU deep (boros tapi lengkap)
watch(form, () => console.log('berubah'), { deep: true })
```

### ❌ Jebakan 4 — `watchEffect` Ikut Terpicu Oleh Hal Tak Disengaja

```javascript
// ❌ SALAH — watchEffect menangkap SEMUA yang dibaca, termasuk yang tak perlu
watchEffect(() => {
  console.log(profil.value.nama)   // dependensi: profil
  localStorage.setItem('x', count.value)  // count ikut jadi dependensi!
})

// ✅ BENAR — pakai watch eksplisit jika hanya mau pantau count
watch(count, (baru) => {
  localStorage.setItem('x', baru)
})
```

### ❌ Jebakan 5 — Menjalankan Async Tanpa Cleanup (Race Condition)

```javascript
// ❌ SALAH — request lama bisa menimpa baru
watch(keyword, async (kw) => {
  hasil.value = await cari(kw)    // kalau kw berubah cepat, hasil bisa acak
})

// ✅ BENAR — batalkan request lama
watch(keyword, async (kw, _l, onCleanup) => {
  let batal = false
  onCleanup(() => { batal = true })
  const data = await cari(kw)
  if (!batal) hasil.value = data
})
```

---

## 🧪 16. Computed Lanjut: `computed` bersarang & `computed` dengan async

`computed` **tidak boleh async** (harus sinkron). Jika butuh async, gunakan `ref` + `watch`/`watchEffect`.

```vue
<script setup>
import { ref, computed, watch } from 'vue'

const userId = ref(1)

// ❌ SALAH — computed tidak bisa async
// const profil = computed(async () => await fetchUser(userId.value))

// ✅ BENAR — pakai ref + watch
const profil = ref(null)
const isLoading = ref(false)

watch(userId, async (id) => {
  isLoading.value = true
  profil.value = await fetchUser(id)
  isLoading.value = false
}, { immediate: true })
</script>

<template>
  <p v-if="isLoading">Memuat...</p>
  <p v-else>{{ profil?.nama }}</p>
</template>
```

> ⚠️ **Ingat:** Computed itu **nilai**, bukan **proses**. Kalau butuh proses async (fetch), itu ranah `watch`/`watchEffect` + `ref`. Jangan paksa async ke computed.

---

## 🔗 17. Pola Umum: `watch` + `computed` Bekerja Sama

Kombinasi keduanya adalah pola paling sering dipakai di aplikasi nyata.

```
COMPUTED  → untuk "tampilan turunan" (nilai yang dihitung)
WATCH     → untuk "aksi sebagai reaksi" (side effect)

Contoh:
   keyword (ref)
      │
      ├─→ computed: hasilFilter (filter lokal, instan)
      │
      └─→ watch: debounce → fetchRemote(keyword) (side effect API)
```

```vue
<script setup>
import { ref, computed, watch } from 'vue'

const keyword = ref('')
const semua   = ref([])      // dari API
const lokal   = ref([])      // dari API lain

// computed: gabung & filter lokal (tidak perlu API)
const hasil = computed(() => {
  const gabungan = [...semua.value, ...lokal.value]
  const kw = keyword.value.toLowerCase()
  return gabungan.filter(f => f.title.toLowerCase().includes(kw))
})

// watch: saat keyword berubah (debounce), fetch data remote
let timer = null
watch(keyword, (kw) => {
  clearTimeout(timer)
  timer = setTimeout(async () => {
    semua.value = await fetchRemote(kw)
  }, 400)
})
</script>
```

---

## 📊 18. Tabel Panduan Memilih: `ref` / `computed` / `watch` / `method`

| Kasus Penggunaan | Pilihan |
| --- | --- |
| Menyimpan state (angka, teks) | `ref()` |
| Menyimpan object/array state | `reactive()` / `ref()` |
| Nilai dihitung dari state lain | `computed()` |
| Format tampilan (Rupiah, tanggal) | `computed()` |
| Aksi saat tombol diklik | `method` (function) |
| Reaksi perubahan data → API call | `watch()` |
| Reaksi otomatis ke banyak dependency | `watchEffect()` |
| Validasi live saat mengetik | `watch()` pada field |
| Filter list sisi klien | `computed()` |
| Pengurutan (sort) list | `computed()` |

---

## 🚦 19. Watch pada Array & Object: Deep vs Getter

Memantau koleksi butuh perhatian khusus.

```vue
<script setup>
import { ref, reactive, watch } from 'vue'

const list = ref([{ id: 1, selesai: false }])

// ❌ TIDAK cukup — hanya tangkap referensi list, bukan isi
// watch(list, () => console.log('berubah'))  // hanya saat list diganti utuh

// ✅ BENAR 1 — deep (lacak semua bersarang, boros)
watch(list, () => console.log('list berubah (deep)'), { deep: true })

// ✅ BENAR 2 — getter ke property spesifik (efisien)
watch(() => list.value[0].selesai, (v) => console.log('selesai:', v))

// reactive object
const todo = reactive({ judul: 'Beli susu', tags: ['urgent'] })
watch(() => todo.tags, (tags) => console.log('tags:', tags), { deep: true })
</script>
```

> 💡 **Rekomendasi:** Gunakan **getter function** ke property spesifik bila memungkinkan, dan `deep: true` hanya untuk object/array kecil. `deep` pada struktur besar berdampak performa.

---

## 🧹 20. Studi Kasus Mini: Form dengan Auto-Save (watch + debounce)

Contoh nyata penggunaan `watch` untuk menyimpan otomatis ke localStorage saat user mengetik (debounce 1 detik).

```vue
<script setup>
import { ref, watch } from 'vue'

const dokumen = ref('')
const status  = ref('Siap')

// Muat dari localStorage saat setup
dokumen.value = localStorage.getItem('draft') || ''

// Watch dengan debounce → auto-save
let timer = null
watch(dokumen, (teks) => {
  status.value = 'Menyimpan...'
  clearTimeout(timer)
  timer = setTimeout(() => {
    localStorage.setItem('draft', teks)
    status.value = 'Tersimpan ✓'
  }, 1000)
})
</script>

<template>
  <textarea v-model="dokumen" rows="10" placeholder="Tulis..."></textarea>
  <p>{{ status }}</p>
</template>
```

**Mengapa bagus:** Tidak menyimpan tiap ketikan (boros I/O), tapi menunggu user berhenti 1 detik. Pola ini umum di aplikasi catatan (Notion, Google Docs style).

---

## 🎯 21. Latihan Pemahaman Cepat (Self-Test)

```
SOAL 1: Mana yang lebih efisien untuk menampilkan total harga di 5 tempat?
        A) method getTotal()     B) computed total
JAWABAN: B — computed di-cache, method dihitung ulang tiap render.

SOAL 2: Kamu butuh memanggil API saat dropdown genre berubah. Pakai?
        A) computed   B) watch   C) method
JAWABAN: B — watch untuk side effect (API call).

SOAL 3: computed bisa menerima argumen?
        A) Ya   B) Tidak
JAWABAN: B — kalau butuh argumen, pakai method.

SOAL 4: watchEffect jalan kapan?
        A) saat dependency berubah   B) langsung saat setup + saat berubah
JAWABAN: B — eager, langsung jalan 1x lalu tiap berubah.
```

---

## 🐌 22. Performa: Kapan `computed` Benar-Benar Menghemat

Mari buktikan dengan angka mengapa `computed` lebih efisien dari `method` pada data besar.

```vue
<script setup>
import { ref, computed } from 'vue'

// 10.000 film (simulasi data besar)
const films = ref(Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  title: `Film ${i}`,
  genre: i % 3 === 0 ? 'action' : i % 3 === 1 ? 'drama' : 'sci-fi',
  rating: Math.random() * 10,
})))

const keyword = ref('')

// COMPUTED: hanya filter ulang saat films/keyword berubah
const hasilComputed = computed(() =>
  films.value.filter(f => f.title.includes(keyword.value))
)

// METHOD: filter ulang SETIAP render template
function hasilMethod() {
  return films.value.filter(f => f.title.includes(keyword.value))
}
</script>

<template>
  <!-- Jika template re-render 100x (misal hover state berubah),
       method difilter 100x (10000 item = 1.000.000 operasi),
       computed tetap pakai cache (0 filter ulang). -->
  <p>Hasil computed: {{ hasilComputed.length }}</p>
  <p>Hasil method: {{ hasilMethod().length }}</p>
</template>
```

| Skenario | `computed` | `method` |
| --- | --- | --- |
| Template re-render 100x, data tetap | 1x filter | 100x filter |
| Data berubah 1x | 1x filter | 100x filter |
| Kesimpulan | ✅ Efisien | ❌ Boros |

> 💡 **Aturan praktis:** Kalau hasilnya ditampilkan di template dan dependensinya jarang berubah relatif terhadap render → selalu `computed`.

---

## 🔧 23. Watch Lanjut: `flush` & Timing

Opsi `flush` mengontrol **kapan** callback watch dijalankan relatif terhadap render DOM.

```vue
<script setup>
import { ref, watch } from 'vue'

const count = ref(0)
const el = ref(null)

// flush: 'pre' (default) → sebelum component update (DOM lama)
watch(count, () => {
  // di sini DOM belum di-update untuk perubahan count ini
}, { flush: 'pre' })

// flush: 'post' → SETELAH DOM di-update (aman akses DOM baru)
watch(count, () => {
  console.log('Tinggi elemen sekarang:', el.value?.offsetHeight)
}, { flush: 'post' })

// flush: 'sync' → langsung sinkron (jarang, bisa perf issue)
watch(count, () => console.log('sync'), { flush: 'sync' })
</script>
```

| `flush` | Kapan callback jalan | Pakai untuk |
| --- | --- | --- |
| `'pre'` (default) | Sebelum DOM update | Reaksi umum |
| `'post'` | Setelah DOM update | Akses/update DOM pasca-render |
| `'sync'` | Langsung (sinkron) | Sangat jarang |

> 💡 **Untuk akses DOM setelah update, lebih mudah pakai `watchEffect` + `onCleanup` atau `nextTick` (Bab 9).** `flush: 'post'` setara dengan `watchPostEffect`.

---

## 🧩 24. Pola `watch` untuk Sinkronisasi ke Parent (v-model internal)

Sering komponen punya state lokal yang juga harus memberi tahu parent. Gabungkan `watch` + `emit`.

```vue
<script setup>
import { ref, watch } from 'vue'

const props = defineProps({ modelValue: { type: Number, default: 0 } })
const emit  = defineEmits(['update:modelValue'])

// State lokal (boleh dimanipulasi bebas di child)
const lokal = ref(props.modelValue)

// Saat parent ubah modelValue → sinkron ke lokal
watch(() => props.modelValue, (v) => { lokal.value = v })

// Saat lokal berubah (user interaksi) → kabari parent
watch(lokal, (v) => emit('update:modelValue', v))
</script>

<template>
  <input type="range" min="0" max="100" v-model.number="lokal" />
</template>
```

> 💡 **Pola ini** berguna untuk komponen slider/kustom yang butuh state internal tapi tetap kompatibel `v-model`.

---

## 🚦 25. Debugging Watch & Computed

```
GEJALA: computed tidak update
  → Cek: apakah dependency benar-benar dibaca di dalam getter?
  → Cek: jangan mutate di dalam getter (bikin side effect)

GEJALA: watch tidak terpicu
  → Cek: source benar? (ref butuh .value di getter)
  → Cek: object bersarang butuh { deep: true }
  → Cek: watch dibuat di top-level, bukan di dalam if/function

GEJALA: watch terpicu berkali-kali tak perlu
  → Gunakan getter spesifik, bukan watch(object, {deep:true})
  → Atau debounce di dalam callback

GEJALA: method lambat
  → Ganti ke computed agar di-cache
```

---

## 🎚️ 26. Advanced Watch Patterns (Debounce & Throttle)

Dua pola paling sering dipakai bersama `watch` untuk mengontrol frekuensi eksekusi.

### 26.1 Debounce — Tunggu Henti Ketik

```vue
<script setup>
import { ref, watch } from 'vue'

const keyword = ref('')
let timer = null

watch(keyword, (kw) => {
  // Batalkan timer sebelumnya
  clearTimeout(timer)
  // Set timer baru: jalan 500ms SETELAH user berhenti ketik
  timer = setTimeout(() => {
    console.log('Cari:', kw)   // panggil API di sini
  }, 500)
})
</script>
```

**Diagram debounce:**

```
ketik k-e-t-i-k... berhenti
│ │ │ │ │
└─┬─┴─┴─┴─┘
  └── tunggu 500ms diam → EKSEKUSI (1x saja)
```

### 26.2 Throttle — Batasi Frekuensi (Maks N kali per detik)

```vue
<script setup>
import { ref, watch } from 'vue'

const scrollY = ref(0)
let lastRun = 0

watch(scrollY, (y) => {
  const now = Date.now()
  // Hanya jalan jika sudah lewat 200ms sejak eksekusi terakhir
  if (now - lastRun >= 200) {
    lastRun = now
    console.log('Scroll ke:', y)
  }
})
</script>
```

| Pola | Kapan eksekusi | Cocok untuk |
| --- | --- | --- |
| **Debounce** | Setelah aktivitas berhenti | Pencarian, validasi input |
| **Throttle** | Maks N kali per interval | Scroll, resize, mousemove |

> 💡 **Tip:** Vue punya composable `watchDebounced`/`watchThrottled` di library `@vueuse/core`. Untuk pembelajaran, pahami implementasi manual di atas dulu.

---

## 🧬 27. Combine: `computed` + `watch` + `ref` dalam Satu Fitur

Mari gabungkan semuanya dalam fitur "Cari Film dengan Debounce + Cache".

```vue
<script setup>
import { ref, computed, watch } from 'vue'

const keyword      = ref('')
const hasil       = ref([])
const cache       = ref({})        // cache per keyword
const isLoading   = ref(false)

// COMPUTED: cek apakah ada di cache
const dariCache = computed(() => cache.value[keyword.value] || null)

// WATCH: debounce pencarian
let timer = null
watch(keyword, (kw) => {
  if (kw.length < 2) { hasil.value = []; return }
  clearTimeout(timer)
  timer = setTimeout(async () => {
    // ① Cek cache dulu (efisien)
    if (cache.value[kw]) {
      hasil.value = cache.value[kw]
      return
    }
    // ② Jika tidak ada, fetch
    isLoading.value = true
    const data = await cariFilm(kw)
    // simpan ke cache
    cache.value = { ...cache.value, [kw]: data }
    hasil.value = data
    isLoading.value = false
  }, 400)
})
</script>

<template>
  <input v-model="keyword" placeholder="Cari film..." />
  <p v-if="isLoading">⏳ Mencari...</p>
  <ul>
    <li v-for="f in hasil" :key="f.id">{{ f.title }}</li>
  </ul>
</template>
```

**Alur:**
1. User ketik → `watch` debounce 400ms.
2. Cek `computed` `dariCache` → jika ada, langsung pakai (cepat).
3. Jika tidak, fetch & simpan ke `cache` → pencarian berikutnya instan.

> 🎯 **Ini pola production nyata:** debounce mencegah spam API, cache mencegah fetch berulang. Kombinasi `computed` + `watch` + `ref` membuatnya elegan.

---

## 📖 28. Glosarium Computed & Watchers

| Istilah | Arti |
| --- | --- |
| **Computed** | Nilai turunan yang di-cache, dihitung ulang saat dependency berubah |
| **Getter** | Fungsi di `computed(() => ...)` yang membaca dependency |
| **Cache** | Hasil computed disimpan, tidak dihitung ulang jika dependency tetap |
| **Side effect** | Aksi (API, DOM) sebagai reaksi — ranah `watch`, bukan `computed` |
| **`watch`** | Pantau sumber eksplisit, punya nilai lama, untuk side effect |
| **`watchEffect`** | Pantau semua dependency otomatis, jalan langsung saat setup |
| **`immediate`** | Opsi watch agar callback jalan sekalian saat dibuat |
| **`deep`** | Opsi watch agar melacak perubahan object/array bersarang |
| **Debounce** | Tunda eksekusi sampai aktivitas berhenti |
| **Throttle** | Batasi eksekusi maksimal N kali per interval |

---

## 💎 29. Tips Performa Tambahan

Beberapa praktik untuk menjaga `computed` & `watch` tetap efisien di aplikasi besar:

```
✅ GUNAKAN computed untuk nilai turunan yang ditampilkan berulang
✅ GUNAKAN getter spesifik di watch (bukan deep pada object besar)
✅ GUNAKAN debounce untuk watch yang memicu API mahal
✅ PISAHKAN logic ke composable agar watch tidak menumpuk di komponen
✅ HINDARI computed yang memanggil API (gunakan watch + ref)
✅ HINDARI watch tanpa { deep: true } pada object bersarang (hasil: tidak terpicu)
✅ HINDARI side effect di computed (cache bisa jadi tidak konsisten)
```

### 29.1 Contoh: Watch yang Efisien vs Tidak

```vue
<script setup>
import { reactive, watch } from 'vue'

const form = reactive({
  nama: '', email: '', sandi: '', alamat: { kota: '', jalan: '' },
})

// ❌ TIDAK efisien — deep pada seluruh form
watch(form, () => console.log('berubah'), { deep: true })
// → Vue harus lacak SETIAP property, termasuk alamat bersarang

// ✅ Efisien — hanya pantau field yang perlu
watch(() => form.email, (email) => {
  console.log('email berubah:', email)
  // validasi live di sini
})

// ✅ Efisien — pantau beberapa field spesifik
watch(
  () => [form.nama, form.sandi],
  ([nama, sandi]) => console.log('profil berubah', nama, sandi),
)
</script>
```

### 29.2 Kapan Hasil Computed Tidak Cache?

Cache `computed` **dibuang** (dihitung ulang) saat:
1. Salah satu dependency berubah.
2. Komponen di-unmount (cache hilang bersama instance).

Cache **tetap** (tidak dihitung ulang) saat:
1. Template re-render tapi dependency tidak berubah.
2. Computed lain yang bergantung padanya diakses berkali-kali.

```vue
<script setup>
import { ref, computed } from 'vue'
const a = ref(1)
const b = computed(() => {
  console.log('dihitung!')   // hanya log saat a berubah
  return a.value * 2
})
// Mengakses b.value 100x tanpa mengubah a → "dihitung!" hanya 1x (cache!)
</script>
```

> 💡 **Pahami caching** → kamu bisa menulis computed mahal (filter 10.000 item) tanpa takut lambat, asal dependency jarang berubah.

---

## 🎯 30. Quiz Singkat Computed & Watchers

```
1. computed bisa async? → TIDAK, harus sinkron (pakai watch+ref untuk async).
2. method vs computed untuk tampilan berulang? → computed (cache).
3. watch punya nilai lama? → YA (nilaiLama di argumen 2).
4. watchEffect jalan saat setup? → YA (eager).
5. opsi debounce ada di watch? → TIDAK, implementasi manual via setTimeout.
6. deep:true untuk apa? → lacak perubahan object/array bersarang.
7. side effect di computed? → HINDARI (computed harus murni).
```

---

## 📝 31. Contoh Lengkap: Form Multi-Field dengan Watch Validasi

Studi kasus yang menggabungkan `computed` (untuk enable/disable tombol) dan `watch` (validasi live).

```vue
<script setup>
import { ref, computed, watch } from 'vue'

const nama  = ref('')
const email = ref('')
const sandi = ref('')

// COMPUTED: semua field terisi?
const semuaTerisi = computed(() =>
  nama.value && email.value && sandi.value.length >= 6
)

// COMPUTED: format email valid?
const emailValid = computed(() => /^\S+@\S+\.\S+$/.test(email.value))

// COMPUTED: boleh submit?
const bisaSubmit = computed(() => semuaTerisi.value && emailValid.value)

// WATCH: validasi email live → tampilkan pesan
const emailError = ref('')
watch(email, (val) => {
  if (!val) emailError.value = 'Email wajib diisi'
  else if (!emailValid.value) emailError.value = 'Format email salah'
  else emailError.value = ''
})

// WATCH: pantau perubahan sandi untuk kekuatan
const kekuatan = ref('')
watch(sandi, (val) => {
  if (val.length < 6) kekuatan.value = 'Lemah'
  else if (val.length < 10) kekuatan.value = 'Sedang'
  else kekuatan.value = 'Kuat'
})
</script>

<template>
  <form @submit.prevent="console.log('submit', { nama, email, sandi })">
    <input v-model="nama" placeholder="Nama" />
    <input v-model="email" placeholder="Email" />
    <small v-if="emailError" class="error">{{ emailError }}</small>

    <input v-model="sandi" type="password" placeholder="Sandi" />
    <p>Kekuatan: {{ kekuatan }}</p>

    <button type="submit" :disabled="!bisaSubmit">
      {{ bisaSubmit ? 'Daftar' : 'Lengkapi Form' }}
    </button>
  </form>
</template>
```

**Pembagian tanggung jawab:**
- `computed` → penentuan nilai turunan (valid tidaknya, bisa submit).
- `watch` → reaksi sampingan (tampilkan pesan error, hitung kekuatan).

> 🎯 **Pola ini** adalah standar form modern di Vue: `computed` untuk state turunan, `watch` untuk feedback live. Kombinasikan keduanya untuk UX yang mulus.

---

## 📝 Ringkasan Bab 6

| Konsep | Penjelasan |
| --- | --- |
| **`computed`** | Nilai turunan yang di-cache; dihitung ulang hanya saat dependency berubah |
| **Getter/Setter computed** | Bisa dibuat read-write via object `{ get, set }` |
| **`computed` vs `method`** | computed di-cache & efisien; method dijalankan tiap render |
| **Kapan `computed`** | Data turunan, ditampilkan berulang, butuh cache |
| **Kapan `method`** | Aksi event, butuh argumen, dipakai sekali |
| **`watch`** | Pantau sumber eksplisit; punya nilai lama; untuk side effect |
| **Opsi `immediate`** | Jalankan callback segera saat watch dibuat |
| **Opsi `deep`** | Lacak perubahan object/array bersarang |
| **Multi-source watch** | `watch([a, b], ([aB, bB]) => ...)` |
| **`watchEffect`** | Otomatis tangkap semua dependency; jalan langsung saat setup |
| **`watch` vs `watchEffect`** | watch = eksplisit + nilai lama; watchEffect = otomatis + eager |
| **Cleanup** | `onCleanup()` untuk batalkan request/timer lama (anti race condition) |
| **Getter watch** | `watch(() => obj.x, cb)` — efisien untuk reactive property |

---

## 🎯 Latihan Mandiri

**⭐ Latihan 1 — Keranjang Belanja (Computed Dasar)**
Buat `Keranjang` dengan `ref([])` berisi `{ nama, harga, jumlah }`. Buat `computed` `totalHarga` (sum `harga*jumlah`) dan `totalItem` (sum `jumlah`). Tampilkan keduanya; buktikan update otomatis saat item ditambah.

**⭐⭐ Latihan 2 — Filter & Sorting (Computed Lanjut)**
Dari array `produk` ( `{ nama, harga, kategori }` ), buat `computed` `produkTerfilter` berdasarkan `keyword` (nama) dan `kategoriDipilih`, serta `produkTerurut` yang mengurutkan berdasarkan `harga` naik/turun. Gunakan `v-model` untuk kontrol.

**⭐⭐⭐ Latihan 3 — Live Validation dengan `watch`**
Buat form `email` & `sandi`. Gunakan `watch` pada `email` untuk memvalidasi format (mengisi `emailError` computed-ish ref). Gunakan `watch` pada `sandi` dengan `watchEffect` untuk menghitung kekuatan password (lemah/sedang/kuat) dan menampilkan indikator.

**⭐⭐⭐⭐ Latihan 4 — Search Debounce + API (Integrasi)**
Buat komponen pencarian film yang: (1) `computed` memfilter hasil lokal dari `keyword`, (2) `watch` pada `keyword` yang **di-debounce 500ms** memanggil fungsi fetch `cariFilmRemote(kw)` (bisa simulasi `setTimeout` + array statis), (3) menampilkan `isLoading` dan membersihkan request lama dengan `onCleanup`. Gabungkan semua konsep Bab 5 & 6.

---

*Lanjut ke ➡️ **Bab 7 — 📨 Props & Emits***
