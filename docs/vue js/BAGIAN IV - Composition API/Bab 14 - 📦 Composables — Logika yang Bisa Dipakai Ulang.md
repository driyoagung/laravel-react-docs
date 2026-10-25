# 📦 Bab 14 — Composables — Logika yang Bisa Dipakai Ulang

> *"Jangan ulangi dirimu sendiri. Setiap baris kode yang kamu tulis dua kali adalah bug yang menunggu waktunya. Composable adalah cara Vue berkata: tulis sekali, pakai di mana saja."*

---

> **🧠 Apa Itu Composable?**
>
> **Composable** adalah sebuah **fungsi JavaScript biasa** yang menggunakan API reaktivitas Vue (`ref`, `reactive`, `computed`, `watch`, lifecycle hook, dll) dan **mengembalikan** state beserta fungsi-fungsi yang bisa dipakai kembali di komponen mana pun. Intinya: composable adalah cara kita "mengekstrak" sepotong logika dari komponen, lalu menjadikannya modul yang berdiri sendiri dan dapat dibagikan. Di ekosistem Vue, composable selalu dinamai dengan awalan `use` (misal: `useFetch`, `useDebounce`, `useTMDB`) — sebuah konvensi yang diikuti seluruh komunitas.

---

> **🏗️ Analogi Sederhana:**
>
> Composable seperti **alat masak serbaguna** (misalnya *blender* atau *food processor*). Kamu buat **sekali saja**, lalu bisa dipakai di "resep" mana saja: untuk membuat saus, smoothie, adonan kue, atau sup. `useFetch()` bisa dipakai di `HomeView`, `SearchView`, maupun `MovieDetailView` — **tanpa copy-paste kode sama sekali**. Bayangkan kalau setiap resep mengharuskanmu membangun blender baru dari nol: itulah yang terjadi tanpa composable.

---

## 📋 Daftar Isi Bab 14

1. Mengapa Kita Butuh Composable?
2. Konvensi Penulisan Composable
3. Anatomi Sebuah Composable
4. `useFetch()` — Composable Dasar Pengambil Data
5. Penjelasan Baris per Baris `useFetch`
6. Menggunakan `useFetch` di Komponen
7. `useDebounce()` — Menunda Eksekusi untuk Search
8. Penjelasan Baris per Baris `useDebounce`
9. Integrasi `useDebounce` + `useTMDB` (Search Nyata)
10. Composable Lain: `useToggle`, `useCounter`, `useLocalStorage`
11. Composable yang Menerima Argumen & Mengembalikan Fungsi
12. Berbagi State antar Komponen dengan Composable
13. 🎬 Studi Kasus: `useMouse` — Melacak Posisi Kursor
14. 🧩 Composable vs Fungsi Utilitas Biasa
15. 🔁 `useFetch` Lanjutan: AbortController & Retry
16. 🧰 Composable Tambahan: `useClipboard`, `useThrottle`, `usePrevious`
17. 🧪 Composable dengan Parameter Konfigurasi
18. 🔬 Composable Lain yang Sering Dipakai (Inspirasi)
19. 🧩 Menguji Composable (Konsep)
20. 🔗 Komposisi Composable — Gabungkan Beberapa Composable
21. 📊 `useFetch` vs `useApi` — Kapan Pakai Mana?
22. 🧵 Composable dengan Argumen Reaktif (`ref` sebagai Input)
23. 🎬 Studi Kasus: `usePagination` — Composable Halaman Data
24. 🧩 Composable yang Mengembalikan `readonly` State
25. 📐 Anatomi Penamaan & Kontrak Return Composable
26. 🧭 Decision Tree: Composable, Store, atau Util?
27. 🚨 Jebakan Umum Pemula di Bab 14
28. 📝 Ringkasan Bab 14
29. 🎯 Latihan Mandiri

---

## 🔬 1. Mengapa Kita Butuh Composable?

Mari lihat masalah nyata. Tanpa composable, setiap komponen yang mengambil data dari API harus menulis logika yang **sama persis** berulang-ulang.

```
Tanpa Composable:
  HomeView.vue       → isLoading, error, data, try/catch (30 baris)
  SearchView.vue     → isLoading, error, data, try/catch (30 baris lagi!)
  DetailView.vue     → isLoading, error, data, try/catch (30 baris lagi!)
  👉 Total ~90 baris duplikat, dan kalau ada bug harus benerin 3 tempat

Dengan Composable:
  useFetch.js        → isLoading, error, data, try/catch (30 baris, SEKALI SAJA)
  HomeView.vue       → const { data } = useFetch(url) (1 baris)
  SearchView.vue     → const { data } = useFetch(url) (1 baris)
  DetailView.vue     → const { data } = useFetch(url) (1 baris)
  👉 Total ~33 baris, logika ada di satu tempat
```

Masalah dengan duplikasi:
- 🐛 **Bug ganda/tiga kali** — kalau ada kesalahan di logika fetch, kamu harus memperbaikinya di 3 file berbeda. Sering lupa satu.
- 🔧 **Sulit dirawat** — mau ganti cara menangani error? Harus edit semua tempat.
- 📏 **Komponen membengkak** — logika pengambilan data menumpuk di komponen yang seharusnya cuma urus tampilan.

Composable menyelesaikan semua itu dengan **ekstraksi**: ambil logika yang berulang, taruh di satu fungsi, panggil di mana perlu.

> 💡 **Catatan:** Dulu Vue pakai **mixins** untuk reuse logika. Tapi mixins punya masalah: konflik nama property, sulit dilacak asalnya, dan tidak komposisional. Composable adalah pengganti modern yang jauh lebih bersih.

---

## 📋 2. Konvensi Penulisan Composable

Agar composable mudah dikenali dan dipakai tim, ikuti konvensi berikut:

| Aturan | Keterangan | Contoh |
| --- | --- | --- |
| Nama diawali `use` | Konvensi komunitas Vue | `useFetch`, `useDebounce` |
| Letakkan di `composables/` | Folder khusus logika reusable | `@/composables/useFetch.js` |
| Mengembalikan `ref`/`reactive`/object | Agar state tetap reaktif di pemanggil | `return { data, isLoading }` |
| Satu file, satu composable (idealnya) | Mudah ditemukan | `useFetch.js` isinya `useFetch` |
| Ekspor sebagai named export | Konsisten dengan `import { useX }` | `export function useFetch()` |

```javascript
// ✅ Struktur folder yang direkomendasikan
// src/composables/
// ├── useFetch.js
// ├── useDebounce.js
// ├── useTMDB.js
// └── useLocalStorage.js
```

> 💡 **Tips:** Penamaan `useXxx` bukan keharusan teknis — Vue tidak memaksanya. Tapi ini **konvensi komunitas** yang sangat diikuti. Keuntungannya: Vue DevTools dan rekan tim langsung mengenali bahwa fungsi tersebut menggunakan reaktivitas Vue. Jadi selalu pakai awalan `use`.

---

## 🔬 3. Anatomi Sebuah Composable

Mari bedah struktur umum sebuah composable:

```javascript
// composables/useContoh.js
import { ref } from 'vue'

// ① Nama fungsi diawali 'use'
export function useContoh(parameterAwal) {
  // ② Deklarasikan state reaktif di dalam fungsi
  const data      = ref(null)
  const isLoading = ref(false)

  // ③ Fungsi-fungsi yang memanipulasi state
  function lakukanSesuatu() {
    // ...logika...
  }

  // ④ Opsional: jalankan sesuatu saat composable dipanggil
  // (misal langsung fetch, atau pasang listener)

  // ⑤ Kembalikan state + fungsi agar pemanggil bisa memakainya
  //    (object ini yang menjaga reaktivitas tetap hidup)
  return {
    data,
    isLoading,
    lakukanSesuatu,
  }
}
```

**Empat pilar composable:**
1. **Import API Vue** di atas (biasanya `ref`, `watch`, `computed`, lifecycle).
2. **State reaktif** dideklarasikan *di dalam* fungsi → setiap pemanggilan dapat "instance" state sendiri.
3. **Fungsi logika** yang memanipulasi state tersebut.
4. **`return`** object berisi state + fungsi → pemanggil menggunakannya.

> ⚠️ **Poin Kritis:** State dideklarasikan **di dalam** fungsi, bukan di luar. Kalau kamu deklarasikan `ref` di luar fungsi (level modul), maka **semua** komponen yang memanggil composable akan berbagi state yang sama! Ini bisa disengaja (global state) tapi sering jadi bug. Untuk state per-pemanggilan, selalu di dalam fungsi.

---

## 📦 4. `useFetch()` — Composable Dasar Pengambil Data

`useFetch` adalah composable paling dasar dan paling sering dipakai: ia mengambil data dari URL, sambil melacak status *loading* dan *error*.

```javascript
// composables/useFetch.js
import { ref } from 'vue'

// Terima URL awal (opsional). Jika diberi, langsung fetch saat composable dipanggil.
export function useFetch(urlAwal) {
  // 3 state reaktif: data hasil, status loading, pesan error
  const data      = ref(null)   // menampung hasil JSON
  const isLoading = ref(false)  // true saat sedang fetch
  const error     = ref(null)   // pesan error bila gagal

  // Fungsi internal untuk melakukan fetch
  async function fetch(url = urlAwal) {
    isLoading.value = true      // mulai loading
    error.value     = null       // reset error dari fetch sebelumnya

    try {
      // pakai fetch bawaan browser
      const response = await window.fetch(url)

      // Lempar error jika status HTTP bukan 2xx
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      // Parse JSON dan simpan ke data
      data.value = await response.json()

    } catch (e) {
      // Tangkap jaringan error / HTTP error → simpan pesannya
      error.value = e.message
    } finally {
      // Blok ini SELALU jalan, sukses maupun gagal → matikan loading
      isLoading.value = false
    }
  }

  // Langsung fetch jika URL sudah diberikan di awal
  if (urlAwal) fetch()

  // Kembalikan state + fungsi agar komponen bisa pakai & memicu ulang
  return { data, isLoading, error, fetch }
}
```

---

## 🔍 5. Penjelasan Baris per Baris `useFetch`

Mari kita jelaskan setiap bagian dengan sangat detail:

```
BARIS 1   : import { ref } from 'vue'
            → Kita butuh ref untuk membuat state reaktif.

BARIS 4   : export function useFetch(urlAwal) {
            → Fungsi dinamai 'useFetch' (konvensi). Menerima URL opsional.

BARIS 6-8 : const data = ref(null)
            const isLoading = ref(false)
            const error = ref(null)
            → Tiga state reaktif. data mulai null (belum ada hasil),
              isLoading mulai false, error mulai null.

BARIS 11  : async function fetch(url = urlAwal) {
            → Fungsi async (bisa await). Default URL = urlAwal.

BARIS 12  : isLoading.value = true
            → Nyalakan indikator loading SEBELUM request dimulai.

BARIS 13  : error.value = null
            → Bersihkan error lama (dari fetch sebelumnya).

BARIS 16  : const response = await window.fetch(url)
            → Tunggu response dari API.

BARIS 19-21: if (!response.ok) { throw new Error(...) }
            → response.ok false bila status 4xx/5xx. Kita lempar error
              agar masuk ke blok catch.

BARIS 24  : data.value = await response.json()
            → Parse JSON, simpan ke state data.

BARIS 27-29: catch (e) { error.value = e.message }
            → Tangkap SEMUA error (jaringan putus, HTTP error, JSON rusak)
              dan simpan pesannya ke state error.

BARIS 31-33: finally { isLoading.value = false }
            → finally SELALU jalan (sukses/gagal). Pastikan loading mati
              agar spinner tidak berputar selamanya.

BARIS 36  : if (urlAwal) fetch()
            → Kalau URL diberikan saat pemanggilan, langsung fetch otomatis.

BARIS 39  : return { data, isLoading, error, fetch }
            → Kembalikan semuanya. Komponen bisa baca data/isLoading/error
              dan bisa memanggil fetch() lagi nanti.
```

### 📌 Poin Kunci

- **`try / catch / finally`** — pola standar menangani async dengan aman. `finally` menjamin `isLoading` kembali `false` bagaimanapun hasilnya (sukses, gagal, atau error tak terduga). Tanpa `finally`, spinner bisa stuck selamanya saat terjadi error.
- **Mengembalikan `fetch`** — komponen bisa memanggil ulang, misal saat ganti halaman, refresh manual, atau retry setelah error.
- **`ref(null)` untuk `data`** — karena hasilnya bisa berupa objek maupun array; `null` menandakan "belum ada data".

> 💡 **Tips:** Mengembalikan `fetch` sebagai fungsi bernama (bukan menjalankannya langsung saat return) memberi fleksibilitas: komponen bisa menunda fetch sampai event tertentu (misal tombol "Muat Lebih Banyak").

---

## 🎬 6. Menggunakan `useFetch` di Komponen

```vue
<!-- HomeView.vue -->
<script setup>
import { useFetch } from '@/composables/useFetch'
import MovieCard from '@/components/movie/MovieCard.vue'

// Aliaskan data → films agar lebih jelas di template
const {
  data:      films,     // data hasil fetch kita sebut 'films'
  isLoading,
  error,
  fetch,
} = useFetch('https://api.themoviedb.org/3/trending/movie/day')

// films sekarang reaktif: saat fetch selesai, films.value terisi
</script>

<template>
  <!-- State 1: Loading -->
  <div v-if="isLoading" class="loading">
    ⏳ Memuat film...
  </div>

  <!-- State 2: Error -->
  <div v-else-if="error" class="error">
    ❌ Error: {{ error }}
    <button @click="fetch()">Coba Lagi</button>
  </div>

  <!-- State 3: Sukses -->
  <div v-else class="grid-film">
    <!-- films?.results: optional chaining untuk aman -->
    <MovieCard
      v-for="film in films?.results"
      :key="film.id"
      :film="film"
    />
  </div>
</template>
```

> 💡 **Tips:** Tanda `?.` (optional chaining) di `films?.results` mencegah error saat `films` masih `null`. Meskipun dengan `v-else` di atas kita sudah terlindungi, ini tetap praktik aman. Bonus: tombol "Coba Lagi" memanggil `fetch()` yang kita kembalikan dari composable — tanpa menulis ulang logika try/catch.

---

## ⏱️ 7. `useDebounce()` — Menunda Eksekusi untuk Search

**Debounce** = menunda eksekusi sampai user "berhenti" melakukan sesuatu (misal: berhenti mengetik). Tanpa debounce, tiap huruf yang diketik memicu request API → boros & lambat.

```
Tanpa debounce:
  User ketik "batman":
    b      → request API  ❌
    ba     → request API  ❌
    bat    → request API  ❌
    batm   → request API  ❌
    batma  → request API  ❌
    batman → request API  ❌
  Total: 6 request, 5 di antaranya sia-sia!

Dengan debounce (delay 400ms):
  User ketik "batman" (cepat):
    b      → mulai timer 400ms
    ba     → batalkan timer, mulai baru
    ...
    batman → berhenti ketik, 400ms kemudian → 1 request ✅
  Total: 1 request saja!
```

```javascript
// composables/useDebounce.js
import { ref, watch } from 'vue'

// Terima sebuah ref 'nilai' dan 'delay' (default 500ms)
export function useDebounce(nilai, delay = 500) {
  // nilaiDebounced = hasil yang sudah "tenang"
  // (baru update setelah delay sejak perubahan terakhir)
  const nilaiDebounced = ref(nilai.value)

  // Pantau perubahan pada 'nilai' asli
  watch(nilai, (nilaiTerbaru) => {
    // Tunggu 'delay' ms setelah user berhenti mengetik
    // Baru jalankan penyimpanan nilai
    const timer = setTimeout(() => {
      nilaiDebounced.value = nilaiTerbaru
    }, delay)

    // Batal timer sebelumnya jika user masih mengetik
    // (Vue menjalankan fungsi yang di-return sebagai "cleanup")
    return () => clearTimeout(timer)
  })

  return nilaiDebounced
}
```

---

## 🔍 8. Penjelasan Baris per Baris `useDebounce`

```
BARIS 1-2 : import { ref, watch } from 'vue'
            → Butuh ref (untuk nilaiDebounced) & watch (pantau perubahan).

BARIS 5   : export function useDebounce(nilai, delay = 500) {
            → Menerima ref 'nilai' dan delay ms (default 500).

BARIS 8   : const nilaiDebounced = ref(nilai.value)
            → State hasil. Awalnya sama dengan nilai sekarang.

BARIS 11  : watch(nilai, (nilaiTerbaru) => { ... })
            → Setiap kali ref 'nilai' berubah, callback jalan.

BARIS 13-15: const timer = setTimeout(() => {
            → Mulai timer. Setelah 'delay' ms, simpan nilai terbaru.
                nilaiDebounced.value = nilaiTerbaru
              }, delay)

BARIS 18-19: return () => clearTimeout(timer)
            → FUNGSI CLEANUP. Vue memanggil ini SEBELUM watch berikutnya.
              Jika user mengetik lagi sebelum timer habis, timer lama
              dibatalkan → hanya ketikan terakhir yang menyimpan nilai.

BARIS 22 : return nilaiDebounced
            → Kembalikan ref hasil yang sudah "didebounce".
```

### 📌 Poin Kunci

- **`watch(nilai, cb)`** — tiap kali `keyword` berubah, callback jalan.
- **`setTimeout` + `clearTimeout`** — trik debounce klasik. Tiap ketikan membatalkan timer sebelumnya, sehingga hanya ketikan *terakhir* (setelah jeda) yang menyimpan nilai.
- **Return cleanup function** — Vue otomatis memanggilnya sebelum watch berikutnya, membatalkan timer lama. Efek: request API hanya 1x, bukan per huruf.

> 💡 **Tips:** Debounce cocok untuk *search box*; kalau kamu ingin sesuatu jalan **terus-menerus tapi dibatasi frekuensinya** (misal saat scroll event), pakai *throttle* (konsep berbeda). Jangan campur aduk!

---

## 🔗 9. Integrasi `useDebounce` + `useTMDB` (Search Nyata)

Ini cara keduanya bekerja sama di fitur pencarian Netflix-clone:

```vue
<!-- SearchView.vue -->
<script setup>
import { ref, watch } from 'vue'
import { useDebounce } from '@/composables/useDebounce'
import { useTMDB } from '@/composables/useTMDB'

// ① Keyword mentah dari input user
const keyword = ref('')

// ② Debounce keyword: baru "tenang" 400ms setelah berhenti ketik
const keywordDebounced = useDebounce(keyword, 400)

// ③ Composable TMDB untuk mencari film
const { hasilCarian, isLoading } = useTMDB()

// ④ Pantau keyword yang SUDAH didebounce (bukan yang mentah!)
watch(keywordDebounced, (kata) => {
  if (kata.trim()) {
    hasilCarian.cari(kata)
  }
})
</script>

<template>
  <input v-model="keyword" placeholder="Cari film..." />

  <p v-if="isLoading">⏳ Mencari...</p>
  <ul v-else>
    <li v-for="f in hasilCarian.hasil.value" :key="f.id">
      🎬 {{ f.title }}
    </li>
  </ul>
</template>
```

> ⚠️ **Catatan Penting — Urutan Penting!** Kita `watch` **`keywordDebounced`**, bukan `keyword` langsung. Kalau kita watch `keyword`, debounce jadi tidak berguna karena pencarian tetap jalan tiap huruf. Debounce hanya berguna jika yang diawasi adalah hasil debounce-nya.

---

## 🧩 10. Composable Lain: `useToggle`, `useCounter`, `useLocalStorage`

Composable tidak harus selalu soal API. Berikut tiga contoh composable simpel namun sangat berguna:

### `useToggle` — boolean on/off

```javascript
// composables/useToggle.js
import { ref } from 'vue'

export function useToggle(nilaiAwal = false) {
  const nilai = ref(nilaiAwal)

  // Fungsi untuk membalik nilai
  function toggle() {
    nilai.value = !nilai.value
  }

  // Fungsi untuk set nilai eksplisit
  function setTrue()  { nilai.value = true }
  function setFalse() { nilai.value = false }

  return { nilai, toggle, setTrue, setFalse }
}
```

```vue
<script setup>
import { useToggle } from '@/composables/useToggle'

const { nilai: modalTerbuka, toggle: toggleModal } = useToggle(false)
</script>

<template>
  <button @click="toggleModal">Buka Modal</button>
  <div v-if="modalTerbuka">Konten modal...</div>
</template>
```

### `useCounter` — counter dengan batas

```javascript
// composables/useCounter.js
import { ref } from 'vue'

export function useCounter(awal = 0, min = -Infinity, max = Infinity) {
  const hitungan = ref(awal)

  function tambah() {
    if (hitungan.value < max) hitungan.value++   // cek batas atas
  }

  function kurang() {
    if (hitungan.value > min) hitungan.value--   // cek batas bawah
  }

  function reset() {
    hitungan.value = awal
  }

  return { hitungan, tambah, kurang, reset }
}
```

### `useLocalStorage` — sync state ke browser storage

```javascript
// composables/useLocalStorage.js
import { ref, watch } from 'vue'

export function useLocalStorage(kunci, nilaiAwal) {
  // Baca dari localStorage, fallback ke nilaiAwal
  const baca = () => {
    const tersimpan = localStorage.getItem(kunci)
    return tersimpan !== null ? JSON.parse(tersimpan) : nilaiAwal
  }

  const state = ref(baca())

  // Setiap kali state berubah → simpan ke localStorage
  watch(state, (baru) => {
    localStorage.setItem(kunci, JSON.stringify(baru))
  }, { deep: true })

  return state
}
```

> 💡 **Tips:** `useLocalStorage` akan kita kembangkan lebih lengkap di Bab 16 sebagai contoh "composable pattern" kedua.

---

## 🎛️ 11. Composable yang Menerima Argumen & Mengembalikan Fungsi

Composable bisa sangat fleksibel: menerima argumen, mengembalikan fungsi, bahkan mengembalikan fungsi yang menerima argumen lagi.

```javascript
// composables/useTimeout.js
import { ref, onUnmounted } from 'vue'

// Composable yang menjalankan callback setelah delay,
// dan otomatis membersihkan timer saat komponen di-unmount
export function useTimeout(callback, delay = 1000) {
  const isPending = ref(true)

  const timer = setTimeout(() => {
    callback()
    isPending.value = false
  }, delay)

  // Bersihkan timer jika komponen hancur sebelum waktunya
  // → mencegah memory leak / callback jalan setelah unmount
  onUnmounted(() => clearTimeout(timer))

  // Beri cara membatalkan manual
  function batalkan() {
    clearTimeout(timer)
    isPending.value = false
  }

  return { isPending, batalkan }
}
```

```vue
<script setup>
import { useTimeout } from '@/composables/useTimeout'

// Tampilkan notifikasi, lalu sembunyikan setelah 3 detik
const { isPending } = useTimeout(() => {
  console.log('Notifikasi hilang!')
}, 3000)
</script>

<template>
  <div v-if="isPending" class="notif">✅ Tersimpan!</div>
</template>
```

> ⚠️ **Perhatikan `onUnmounted` di dalam composable!** Composable boleh menggunakan lifecycle hook. Vue otomatis mengikat hook tersebut ke **komponen yang sedang memanggil** composable. Ini salah satu "sihir" terbaik Composition API — composable bisa punya lifecycle sendiri.

---

## 🔗 12. Berbagi State antar Komponen dengan Composable

Ada dua pola berbagi state:

**Pola A — State terisolasi (default):** Setiap pemanggilan composable dapat state *baru*.

```vue
<!-- KomponenA.vue -->
<script setup>
import { useCounter } from '@/composables/useCounter'
const { hitungan } = useCounter()   // hitungan = 0 (instance sendiri)
</script>

<!-- KomponenB.vue -->
<script setup>
import { useCounter } from '@/composables/useCounter'
const { hitungan } = useCounter()   // hitungan = 0 JUGA (instance berbeda!)
</script>
```

**Pola B — State global (shared):** Deklarasikan `ref` di **luar** fungsi (level modul) agar semua pemanggilan berbagi instance yang sama.

```javascript
// composables/useUserGlobal.js
import { ref } from 'vue'

// ⚠️ Dideklarasikan DI LUAR fungsi → shared antar semua pemanggil
const user = ref(null)

export function useUserGlobal() {
  function setUser(data) {
    user.value = data
  }
  return { user, setUser }
}
```

```vue
<!-- LoginView.vue -->
<script setup>
import { useUserGlobal } from '@/composables/useUserGlobal'
const { user, setUser } = useUserGlobal()
setUser({ nama: 'Budi' })   // mengisi user global
</script>

<!-- ProfilView.vue (komponen lain!) -->
<script setup>
import { useUserGlobal } from '@/composables/useUserGlobal'
const { user } = useUserGlobal()
console.log(user.value)      // { nama: 'Budi' } ✅ sama karena shared!
</script>
```

> ⚠️ **Hati-hati:** Pola B membuat state **global** (mirip singleton). Ini berguna untuk data seperti "user yang login", tapi bisa membingungkan jika dipakai sembarangan. Untuk state global yang terstruktur, lebih baik pakai **Pinia** (Bab 19). Composable dengan state modul cocok untuk kasus sederhana.

---

## 🎬 13. Studi Kasus: `useMouse` — Melacak Posisi Kursor

Mari bangun composable yang melacak posisi mouse di layar, lengkap dengan lifecycle cleanup.

```javascript
// composables/useMouse.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  // State posisi
  const x = ref(0)
  const y = ref(0)

  // Handler yang memperbarui state saat mouse bergerak
  function perbaruiPosisi(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  // Pasang listener saat komponen TERMOUNT
  onMounted(() => {
    window.addEventListener('mousemove', perbaruiPosisi)
  })

  // Lepas listener saat komponen DIHANCURKAN (cegah memory leak!)
  onUnmounted(() => {
    window.removeEventListener('mousemove', perbaruiPosisi)
  })

  return { x, y }
}
```

```vue
<!-- Penggunaan -->
<script setup>
import { useMouse } from '@/composables/useMouse'

const { x, y } = useMouse()
</script>

<template>
  <p>Kursor di: X = {{ x }}, Y = {{ y }}</p>
</template>
```

**Yang dipelajari:**
- Composable bisa memakai `onMounted` / `onUnmounted` — Vue mengikatnya ke komponen pemanggil.
- Kita **selalu membersihkan** event listener di `onUnmounted`. Tanpa ini, listener tetap jalan di memori meski komponen sudah hilang → memory leak.
- `x` dan `y` otomatis reaktif di template.

---

## 🧩 14. Composable vs Fungsi Utilitas Biasa

Bukan semua fungsi butuh jadi composable. Bedakan keduanya:

```javascript
// ❌ BUKAN composable — fungsi utilitas murni (tanpa reaktivitas)
// composables/formatRupiah.js
export function formatRupiah(angka) {
  return 'Rp ' + angka.toLocaleString('id-ID')
}
// Dipakai: import { formatRupiah } — ini utilitas biasa, TIDAK perlu 'use'

// ✅ COMPOSABLE — pakai reaktivitas Vue
// composables/useCounter.js
import { ref } from 'vue'
export function useCounter() {
  const hitungan = ref(0)
  return { hitungan }
}
```

### 📊 Perbandaan

| Aspek | Fungsi Utilitas | Composable (`useX`) |
| --- | --- | --- |
| Pakai `ref`/`reactive`? | ❌ Tidak | ✅ Ya |
| Mengembalikan nilai reaktif? | ❌ Tidak | ✅ Ya |
| Butuh lifecycle hook? | ❌ Tidak | ✅ Bisa |
| Diawali `use`? | ❌ Tidak | ✅ Ya |
| Contoh | `formatRupiah`, `validasiEmail` | `useFetch`, `useMouse` |

> 🎯 **Aturan praktis:** Kalau fungsimu **hanya** memproses data (tanpa state reaktif), jadikan **utilitas biasa** di `utils/`. Kalau butuh **state yang reaktif atau lifecycle**, jadikan **composable** di `composables/`.

---

## 🔁 15. `useFetch` Lanjutan: AbortController & Retry

Composable produksi sering butuh fitur lebih. Berikut `useFetch` yang mendukung **AbortController** (batalkan request lama) dan **retry**.

```javascript
// composables/useFetch.js (versi lanjut)
import { ref } from 'vue'

export function useFetch(urlAwal, opsi = {}) {
  const { autoFetch = true, retry = 0 } = opsi

  const data      = ref(null)
  const isLoading = ref(false)
  const error     = ref(null)

  async function fetch(url = urlAwal, percobaan = 0) {
    isLoading.value = true
    error.value = null

    // AbortController: batalkan request yang masih berjalan
    const controller = new AbortController()

    try {
      const res = await window.fetch(url, { signal: controller.signal })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      data.value = await res.json()
    } catch (e) {
      // Coba ulang kalau masih ada kesempatan
      if (percobaan < retry) {
        return fetch(url, percobaan + 1)
      }
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  if (autoFetch && urlAwal) fetch()

  return { data, isLoading, error, fetch }
}
```

> 💡 **AbortController** berguna bila user berpindah halaman sebelum fetch selesai — mencegah "set state setelah unmount" warning. Di project nyata (Bab 16), `useTMDB` menggunakan axios yang punya mekanisme serupa (`CancelToken`).

---

## 🧰 16. Composable Tambahan: `useClipboard`, `useThrottle`, `usePrevious`

### `useClipboard` — salin teks ke clipboard

```javascript
// composables/useClipboard.js
import { ref } from 'vue'

export function useClipboard() {
  const teksTersalin = ref('')
  const isTersalin   = ref(false)

  async function salin(teks) {
    try {
      await navigator.clipboard.writeText(teks)
      teksTersalin.value = teks
      isTersalin.value = true
      setTimeout(() => (isTersalin.value = false), 2000)
    } catch (e) {
      isTersalin.value = false
    }
  }

  return { teksTersalin, isTersalin, salin }
}
```

### `useThrottle` — batasi frekuensi eksekusi

```javascript
// composables/useThrottle.js
import { ref, watch } from 'vue'

// Berbeda dari debounce: throttle MENGIZINKAN jalan tiap 'delay',
// tapi tidak lebih sering dari itu (cocok untuk scroll/resize).
export function useThrottle(nilai, delay = 200) {
  const nilaiThrottled = ref(nilai.value)
  let lastRun = 0

  watch(nilai, (terbaru) => {
    const sekarang = Date.now()
    const sisa = delay - (sekarang - lastRun)
    if (sisa <= 0) {
      lastRun = sekarang
      nilaiThrottled.value = terbaru
    }
  })

  return nilaiThrottled
}
```

### `usePrevious` — ingat nilai sebelumnya

```javascript
// composables/usePrevious.js
import { ref, watch } from 'vue'

export function usePrevious(nilai) {
  const previous = ref(null)
  const current  = ref(nilai.value)

  watch(nilai, (terbaru, lama) => {
    previous.value = lama
    current.value = terbaru
  })

  return { previous, current }
}
```

> 💡 **Debounce vs Throttle:**
> - **Debounce**: "tunggu sampai berhenti, baru jalan 1x" → search box.
> - **Throttle**: "jadikan maksimal 1x per interval" → scroll/resize handler.

---

## 🧪 17. Composable dengan Parameter Konfigurasi

Composable yang baik sering menerima **objek opsi** agar fleksibel dipakai di banyak skenario.

```javascript
// composables/useFetch.js (versi diperluas dengan opsi)
import { ref, watch } from 'vue'

export function useFetch(urlAwal, opsi = {}) {
  const {
    autoFetch = true,        // langsung fetch saat dipanggil?
    method = 'GET',          // metode HTTP
    headers = {},            // header tambahan
  } = opsi

  const data      = ref(null)
  const isLoading = ref(false)
  const error     = ref(null)

  async function fetch(url = urlAwal, body) {
    isLoading.value = true
    error.value = null
    try {
      const response = await window.fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      data.value = await response.json()
    } catch (e) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  // Hanya autoFetch bila diminta
  if (autoFetch && urlAwal) fetch()

  return { data, isLoading, error, fetch }
}
```

```vue
<script setup>
import { useFetch } from '@/composables/useFetch'

// Langsung fetch dengan opsi kustom
const { data: profil } = useFetch('/api/profil', {
  autoFetch: true,
  headers: { Authorization: 'Bearer token' },
})

// TIDAK autoFetch — kita picu manual nanti
const { fetch: kirim } = useFetch('/api/laporan', { autoFetch: false })
</script>
```

> 💡 **Tips:** Memberi **nilai default** pada opsi (`autoFetch = true`) membuat composable punya perilaku masuk akal tanpa harus dikonfigurasi, sekaligus tetap bisa disesuaikan. Ini pola yang sangat umum di library Vue (seperti Pinia, VueUse).

---

## 🔬 18. Composable Lain yang Sering Dipakai (Inspirasi)

Berikut beberapa composable "siap pakai" yang sering dibutuhkan, sebagai inspirasi pola:

### `useEventListener` — pasang & lepas listener aman

```javascript
// composables/useEventListener.js
import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target, event, handler) {
  // Saat komponen mount → pasang listener
  onMounted(() => target.addEventListener(event, handler))
  // Saat komponen unmount → lepas (cegah memory leak)
  onUnmounted(() => target.removeEventListener(event, handler))
}
```

```vue
<script setup>
import { useEventListener } from '@/composables/useEventListener'

// Esc key menutup modal
useEventListener(window, 'keydown', (e) => {
  if (e.key === 'Escape') tutupModal()
})
</script>
```

### `useInterval` — timer berulang yang otomatis dibersihkan

```javascript
// composables/useInterval.js
import { ref, onUnmounted } from 'vue'

export function useInterval(callback, delay = 1000) {
  const isAktif = ref(true)
  const id = setInterval(callback, delay)

  function berhenti() {
    clearInterval(id)
    isAktif.value = false
  }

  // Bersihkan saat komponen hancur
  onUnmounted(berhenti)

  return { isAktif, berhenti }
}
```

> 💡 **Pelajaran:** Perhatikan betapa sering composable memakai `onUnmounted` untuk membersihkan *side effect* (listener, timer, subscription). Ini aturan emas: **setiap resource yang dibuka saat composable jalan harus ditutup saat komponen mati.**

---

## 🧩 19. Menguji Composable (Konsep)

Composable murni (tanpa DOM) sangat mudah di-test karena ia hanya fungsi JavaScript biasa.

```javascript
// useCounter.test.js
import { describe, it, expect } from 'vitest'
import { useCounter } from '@/composables/useCounter'

describe('useCounter', () => {
  it('mulai dari nilai awal', () => {
    const { hitungan } = useCounter(5)
    expect(hitungan.value).toBe(5)
  })

  it('tambah menaikkan hitungan', () => {
    const { hitungan, tambah } = useCounter(0)
    tambah()
    expect(hitungan.value).toBe(1)
  })

  it('tidak melewati batas maksimal', () => {
    const { hitungan, tambah } = useCounter(9, 0, 10)
    tambah()              // 10
    tambah()              // tetap 10 (batas)
    expect(hitung.value).toBe(10)
  })

  it('instance terisolasi antar pemanggilan', () => {
    const a = useCounter(0)
    const b = useCounter(100)
    a.tambah()
    expect(a.hitungan.value).toBe(1)
    expect(b.hitungan.value).toBe(100)   // tidak terpengaruh a
  })
})
```

> 💡 **Tips:** Karena composable hanya mengembalikan `ref`/`reactive`, kamu bisa menguji logikanya tanpa merender komponen. Ini keunggulan besar dibanding mixins yang sulit di-test terisolasi.

---

## 🔗 20. Komposisi Composable — Gabungkan Beberapa Composable

Kekuatan terbesar composable: mereka bisa **dikomposisikan** satu sama lain. Sebuah composable bisa memanggil composable lain di dalamnya.

```javascript
// composables/useProfilUser.js
import { ref } from 'vue'
import { useFetch } from './useFetch'
import { useLocalStorage } from './useLocalStorage'

// Composable ini GABUNGAN useFetch + useLocalStorage
export function useProfilUser() {
  // ① Simpan token di localStorage (persisten)
  const { state: token } = useLocalStorage('auth_token', '')

  // ② Fetch profil pakai useFetch
  const {
    data: profil,
    isLoading,
    error,
    fetch,
  } = useFetch(null, { autoFetch: false })

  // ③ Fungsi login: simpan token lalu fetch profil
  async function login(email, password) {
    const res = await fetch('/api/login', {
      method: 'POST',
      body: { email, password },
    })
    if (res?.token) {
      token.value = res.token        // trigger simpan ke localStorage
      await fetch('/api/profil')
    }
  }

  return { profil, isLoading, error, login, token }
}
```

```vue
<!-- Komponen cukup panggil satu composable tingkat tinggi -->
<script setup>
import { useProfilUser } from '@/composables/useProfilUser'
const { profil, login, isLoading } = useProfilUser()
</script>
```

> 💡 **Ini esensi arsitektur Vue modern:** bangun composable kecil-kecil (useFetch, useLocalStorage), lalu *rakit* menjadi composable tingkat tinggi (useProfilUser) untuk fitur bisnis. Komponen di puncak hanya butuh satu baris.

---

## 📊 21. `useFetch` vs `useApi` — Kapan Pakai Mana?

| Situasi | Gunakan |
| --- | --- |
| Cukup ambil JSON dari 1-2 URL sederhana | `useFetch` (Bab 14) |
| Butuh baseURL + auth + interceptor terpusat | axios client (Bab 16) |
| Butuh endpoint spesifik domain (TMDB, dll) | `useTMDB` (Bab 16) |
| Ingin simpan hasil ke storage | gabung dengan `useLocalStorage` |
| Ingin debounce pencarian | gabung dengan `useDebounce` |

> 🎯 **Prinsip:** Jangan over-engineer. Untuk prototipe cepat, `useFetch` cukup. Untuk project produksi Netflix-clone, `useTMDB` (axios + endpoint) jauh lebih terukur. Pilih berdasarkan **kebutuhan nyata**, bukan kecanggihan.

---

## 🧵 22. Composable dengan Argumen Reaktif (`ref` sebagai Input)

Composable tingkat lanjut sering menerima **argumen reaktif** — yaitu sebuah `ref` — bukan nilai statis. Ini memungkinkan composable **bereaksi otomatis** saat inputnya berubah, tanpa perlu memanggilnya ulang.

```javascript
// ❌ Composable dengan argumen STATIS (tidak bereaksi ke perubahan)
import { ref } from 'vue'

export function useFilmById(id) {           // id = angka biasa
  const film = ref(null)
  fetchFilm(id).then(d => film.value = d)   // fetch SEKALI saja
  return { film }
  // Masalah: kalau 'id' berubah di komponen, composable tidak tahu!
}
```

```javascript
// ✅ Composable dengan argumen REAKTIF (bereaksi ke perubahan id)
import { ref, watch, isRef, unref } from 'vue'

// Terima 'id' yang bisa berupa ref ATAU nilai biasa
export function useFilmById(id) {
  const film      = ref(null)
  const isLoading = ref(false)

  async function muat() {
    isLoading.value = true
    film.value = await fetchFilm(unref(id))   // unref: ambil nilai apa pun bentuknya
    isLoading.value = false
  }

  // Kalau id adalah ref, pantau perubahannya → auto refetch
  if (isRef(id)) {
    watch(id, muat, { immediate: true })      // immediate: jalan sekali di awal
  } else {
    muat()                                     // id statis → cukup sekali
  }

  return { film, isLoading, muat }
}
```

```vue
<!-- Penggunaan: id dari route yang bisa berubah -->
<script setup>
import { toRef } from 'vue'
import { useRoute } from 'vue-router'
import { useFilmById } from '@/composables/useFilmById'

const route = useRoute()
// toRef membuat 'id' reaktif dari route.params
const id = toRef(() => route.params.id)

// Saat user navigasi ke film lain, film otomatis di-refetch!
const { film, isLoading } = useFilmById(id)
</script>
```

### 📊 Helper untuk Argumen Fleksibel

| Helper | Fungsi | Contoh |
| --- | --- | --- |
| `unref(x)` | Ambil nilai; kalau `x` ref → `x.value`, kalau bukan → `x` | `unref(id)` |
| `isRef(x)` | Cek apakah `x` sebuah ref | `if (isRef(id))` |
| `toRef(obj, 'key')` | Buat ref dari properti objek reaktif | `toRef(props, 'id')` |
| `toValue(x)` | Ambil nilai dari ref, getter, atau nilai biasa (Vue 3.3+) | `toValue(id)` |

> 💡 **Pola "MaybeRef":** Composable modern (seperti di VueUse) menerima argumen bertipe `MaybeRef<T>` — artinya boleh `ref` boleh nilai biasa. Dengan `unref`/`toValue`, composable-mu jadi fleksibel dipakai di kedua situasi.

> ⚠️ **Perhatian:** Kalau kamu `watch` argumen tanpa mengecek `isRef` dulu, dan argumennya ternyata nilai biasa, `watch` akan error. Selalu cek `isRef` atau gunakan `toValue` + getter.

---

## 🎬 23. Studi Kasus: `usePagination` — Composable Halaman Data

Mari bangun composable praktis yang sering dibutuhkan: **paginasi**. Composable ini mengelola halaman saat ini, ukuran halaman, dan menghitung data yang tampil.

```javascript
// composables/usePagination.js
import { ref, computed } from 'vue'

export function usePagination(sumberData, ukuranHalaman = 10) {
  // ── STATE ──
  const halamanSaatIni = ref(1)
  const perHalaman     = ref(ukuranHalaman)

  // ── GETTERS (computed) ──
  // Total halaman = pembulatan ke atas dari total item / per halaman
  const totalHalaman = computed(() =>
    Math.max(1, Math.ceil(sumberData.value.length / perHalaman.value))
  )

  // Potong data sesuai halaman aktif
  const dataHalaman = computed(() => {
    const mulai = (halamanSaatIni.value - 1) * perHalaman.value
    const akhir = mulai + perHalaman.value
    return sumberData.value.slice(mulai, akhir)
  })

  // Bendera batas untuk menonaktifkan tombol
  const bisaSebelumnya = computed(() => halamanSaatIni.value > 1)
  const bisaBerikutnya = computed(() => halamanSaatIni.value < totalHalaman.value)

  // ── ACTIONS ──
  function berikutnya() {
    if (bisaBerikutnya.value) halamanSaatIni.value++
  }
  function sebelumnya() {
    if (bisaSebelumnya.value) halamanSaatIni.value--
  }
  function keHalaman(n) {
    // clamp agar tidak keluar batas
    halamanSaatIni.value = Math.min(Math.max(1, n), totalHalaman.value)
  }
  function reset() {
    halamanSaatIni.value = 1
  }

  return {
    halamanSaatIni, perHalaman, totalHalaman, dataHalaman,
    bisaSebelumnya, bisaBerikutnya,
    berikutnya, sebelumnya, keHalaman, reset,
  }
}
```

```vue
<!-- Penggunaan di daftar film -->
<script setup>
import { ref } from 'vue'
import { usePagination } from '@/composables/usePagination'

const semuaFilm = ref([/* ...100 film... */])

const {
  dataHalaman: filmTampil,
  halamanSaatIni,
  totalHalaman,
  bisaSebelumnya,
  bisaBerikutnya,
  berikutnya,
  sebelumnya,
} = usePagination(semuaFilm, 12)  // 12 film per halaman
</script>

<template>
  <div class="grid">
    <MovieCard v-for="f in filmTampil" :key="f.id" :film="f" />
  </div>

  <div class="pagination">
    <button :disabled="!bisaSebelumnya" @click="sebelumnya">← Prev</button>
    <span>Halaman {{ halamanSaatIni }} / {{ totalHalaman }}</span>
    <button :disabled="!bisaBerikutnya" @click="berikutnya">Next →</button>
  </div>
</template>
```

### 📋 Kenapa Ini Composable yang Baik?

| Kriteria | Terpenuhi? | Penjelasan |
| --- | --- | --- |
| Pakai reaktivitas Vue | ✅ | `ref` + `computed` |
| Terisolasi per pemanggilan | ✅ | Semua `ref` di dalam fungsi |
| Reusable lintas komponen | ✅ | Cukup `import` + panggil |
| Menerima input reaktif | ✅ | `sumberData` berupa ref |
| API jelas & konsisten | ✅ | Return state + actions |

> 💡 **Tips:** `usePagination` bisa dikombinasikan dengan `useFetch`. Ambil data dengan `useFetch`, lalu paginasikan dengan `usePagination(data)`. Inilah komposisi composable yang dibahas di bagian 20.

---

## 🧩 24. Composable yang Mengembalikan `readonly` State

Kadang kamu ingin composable mengizinkan komponen **membaca** state tapi **tidak mengubahnya langsung** — perubahan hanya boleh lewat fungsi yang disediakan. Gunakan `readonly()`.

```javascript
// composables/useCounter.js — versi terlindungi
import { ref, readonly } from 'vue'

export function useCounter(awal = 0) {
  // State internal yang bisa diubah (privat)
  const _hitungan = ref(awal)

  // Fungsi resmi untuk mengubah
  function tambah() { _hitungan.value++ }
  function kurang() { _hitungan.value-- }
  function reset()  { _hitungan.value = awal }

  return {
    // Ekspos versi READ-ONLY → komponen tak bisa hitungan.value = 999
    hitungan: readonly(_hitungan),
    tambah, kurang, reset,
  }
}
```

```vue
<script setup>
import { useCounter } from '@/composables/useCounter'
const { hitungan, tambah } = useCounter(5)

tambah()              // ✅ boleh — lewat fungsi resmi
// hitungan.value = 99 // ❌ warning: readonly, tidak berubah
</script>
```

### 📊 Kapan Pakai `readonly`?

| Situasi | Ekspos sebagai |
| --- | --- |
| State bebas diubah komponen | `ref` biasa |
| State hanya boleh diubah lewat action | `readonly(ref)` |
| Nilai turunan | `computed` (sudah read-only otomatis) |
| Konfigurasi tetap | `readonly(reactive(...))` |

> 💡 **Prinsip enkapsulasi:** Dengan `readonly`, kamu menegakkan **kontrak**: "ubah state hanya lewat fungsi yang saya sediakan". Ini mirip prinsip "jangan mutasi state di luar action" pada Pinia (Bab 20). Membuat alur data lebih mudah dilacak.

> ⚠️ **Catatan:** `readonly` hanya melindungi di **level TypeScript & warning dev**. Di produksi (build), warning dihilangkan. Ia adalah pagar disiplin, bukan penjara keras. Tetap gunakan untuk kejelasan niat.

---

## 📐 25. Anatomi Penamaan & Kontrak Return Composable

Composable yang baik punya **kontrak return yang konsisten**. Tim yang memakainya harus bisa menebak apa yang dikembalikan hanya dari namanya.

### Konvensi Return yang Umum

```javascript
// POLA 1: return object (paling umum) — untuk banyak nilai
export function useFetch(url) {
  return { data, isLoading, error, fetch }   // destructure sesukanya
}

// POLA 2: return single ref — untuk satu nilai saja
export function useDebounce(nilai, delay) {
  return nilaiDebounced                        // langsung ref
}

// POLA 3: return tuple/array — untuk pasangan [state, setter]
export function useToggle(awal) {
  return [nilai, toggle]                        // mirip React useState
}
```

### 📋 Panduan Penamaan Return

| Jenis nilai | Konvensi nama | Contoh |
| --- | --- | --- |
| State loading | `isLoading` / `loading` | `const { isLoading } = ...` |
| State error | `error` | `const { error } = ...` |
| Data utama | nama domain | `data`, `films`, `user` |
| Fungsi aksi | kata kerja | `fetch`, `simpan`, `hapus`, `toggle` |
| Boolean status | prefiks `is`/`has`/`can` | `isOpen`, `hasError`, `canNext` |

```javascript
// ✅ Kontrak return yang JELAS & KONSISTEN
export function useWatchlist() {
  return {
    // State (kata benda)
    daftar,
    jumlah,
    // Status (is/has/can)
    isKosong,
    // Actions (kata kerja)
    tambah,
    hapus,
    bersihkan,
  }
}
```

> 💡 **Tips keterbacaan:** Urutkan return dengan pola tetap: **state dulu, lalu status boolean, lalu actions**. Konsistensi ini membuat rekan tim (dan dirimu 6 bulan lagi) langsung paham struktur composable tanpa membaca isinya.

> 🎯 **Aturan aliasing:** Karena return berupa object, pemanggil bebas mengganti nama saat destructure: `const { data: films } = useFetch(url)`. Manfaatkan ini agar nama di komponen kontekstual (`films`, bukan `data` generik).

---

## 🧭 26. Decision Tree: Composable, Store, atau Util?

Pemula sering bingung: kapan bikin composable, kapan pakai Pinia store, kapan cukup fungsi util biasa? Ikuti pohon keputusan ini.

```
Mulai: aku punya sepotong logika...
  │
  ├─ Apakah butuh state REAKTIF (ref/reactive)?
  │     │
  │     ├─ TIDAK → 🔧 FUNGSI UTIL biasa (utils/)
  │     │          contoh: formatRupiah(), validasiEmail()
  │     │
  │     └─ YA → lanjut ↓
  │
  ├─ Apakah state harus DIBAGI (shared) antar banyak komponen
  │  yang berjauhan di tree?
  │     │
  │     ├─ YA → 🍍 PINIA STORE (stores/)
  │     │        contoh: auth user, keranjang belanja global
  │     │
  │     └─ TIDAK → lanjut ↓
  │
  └─ State reaktif tapi LOKAL/per-komponen?
        └─ 📦 COMPOSABLE (composables/)
           contoh: useFetch, useMouse, usePagination
```

### 📊 Tabel Perbandingan Cepat

| Kebutuhan | Util | Composable | Pinia Store |
| --- | --- | --- | --- |
| State reaktif | ❌ | ✅ | ✅ |
| State di-share global | ❌ | ⚠️ (bisa, tapi manual) | ✅ (dirancang untuk ini) |
| Lifecycle hook | ❌ | ✅ | ⚠️ (terbatas) |
| DevTools time-travel | ❌ | ❌ | ✅ |
| Cocok untuk logika murni | ✅ | ❌ | ❌ |
| Contoh | `formatTanggal` | `useFetch` | `useAuthStore` |

> 🎯 **Aturan praktis:** Mulai dari yang paling sederhana. Butuh format angka? Util. Butuh logika fetch reaktif yang dipakai ulang? Composable. Butuh state login yang diakses seluruh aplikasi? Store. **Jangan langsung lompat ke Pinia** untuk semua hal — banyak kasus cukup composable.

> 💡 **Zona abu-abu:** Composable dengan state modul-level (bagian 12, Pola B) bisa meniru store sederhana. Tapi begitu kamu butuh DevTools, plugin persist, atau state kompleks lintas fitur, pindah ke Pinia (Bab 19-20). Composable global cocok hanya untuk kasus kecil.

---

## 🚨 27. Jebakan Umum Pemula di Bab 14

### ❌ Jebakan 1 — State Composable Dideklarasikan di Luar (Tanpa Sengaja Global)

```javascript
// ❌ SALAH — ref di luar fungsi = global, semua komponen berbagi!
import { ref } from 'vue'
const data = ref(null)            // ❌ shared di semua pemanggil

export function useFetch(url) {
  // ...
  return { data }
}
```

```javascript
// ✅ BENAR — ref di DALAM fungsi = per-pemanggilan
import { ref } from 'vue'

export function useFetch(url) {
  const data = ref(null)          // ✅ instance sendiri tiap panggil
  // ...
  return { data }
}
```

> ✅ **Perbaikan:** Letakkan semua `ref`/`reactive` **di dalam** tubuh fungsi composable, kecuali kamu **memang** menginginkan state global (dan paham konsekuensinya).

---

### ❌ Jebakan 2 — Lupa Mengembalikan State (Tidak `return`)

```javascript
// ❌ SALAH — state tidak dikembalikan, komponen dapat undefined
export function useCounter() {
  const hitungan = ref(0)
  // lupa return!
}

// ✅ BENAR
export function useCounter() {
  const hitungan = ref(0)
  return { hitungan }     // ✅ dikembalikan
}
```

---

### ❌ Jebakan 3 — Mengembalikan Nilai (Bukan Ref) sehingga Kehilangan Reaktivitas

```javascript
// ❌ SALAH — mengembalikan nilai biasa, bukan ref
export function useCounter() {
  const hitungan = ref(0)
  return { hitungan: hitungan.value }  // ❌ ini angka biasa!
}

// ✅ BENAR — kembalikan ref-nya
export function useCounter() {
  const hitungan = ref(0)
  return { hitungan }                   // ✅ ref utuh
}
```

---

### ❌ Jebakan 4 — Watch Debounce Salah Target (seperti di Bab 15)

```vue
<script setup>
import { ref, watch } from 'vue'
import { useDebounce } from '@/composables/useDebounce'

const keyword = ref('')
const keywordDebounced = useDebounce(keyword, 400)

// ❌ SALAH — watch keyword mentah, debounce jadi tidak berguna
watch(keyword, (k) => cari(k))

// ✅ BENAR — watch hasil debounce
watch(keywordDebounced, (k) => cari(k))
</script>
```

---

### ❌ Jebakan 5 — Tidak Membersihkan Listener / Timer

```javascript
// ❌ SALAH — event listener tidak dilepas → memory leak
export function useMouse() {
  const x = ref(0)
  function handler(e) { x.value = e.pageX }
  window.addEventListener('mousemove', handler)
  return { x }
}

// ✅ BENAR — lepas di onUnmounted
export function useMouse() {
  const x = ref(0)
  function handler(e) { x.value = e.pageX }
  onMounted(() => window.addEventListener('mousemove', handler))
  onUnmounted(() => window.removeEventListener('mousemove', handler))
  return { x }
}
```

---

### ❌ Jebakan 6 — Mengembalikan `ref` baru tiap render (composable dipanggil di dalam fungsi)

```javascript
// ❌ SALAH — memanggil composable di dalam render/computed
const { hitungan } = computed(() => useCounter())  // state reset tiap render!

// ✅ BENAR — panggil composable di level atas setup
const { hitungan } = useCounter()   // state stabil selama lifecycle
```

> 📌 **Ingat:** Composable harus dipanggil di **top-level** `<script setup>` / `setup()`, bukan di dalam `computed`, `watch`, atau template. Kalau tidak, state akan dibuat ulang berulang-ulang.

---

## 📝 28. Ringkasan Bab 14

| Konsep | Penjelasan |
| --- | --- |
| **Composable** | Fungsi `useXxx` yang membungkus logika reaktif agar bisa dipakai ulang |
| **Konvensi** | Nama `useXxx`, folder `composables/`, return `ref`/object |
| **`useFetch`** | Menangani data + `isLoading` + `error` via `try/catch/finally` |
| **`useDebounce`** | Menunda update sampai user berhenti mengetik (hemat API) |
| **State per-panggilan** | Deklarasikan `ref` **di dalam** fungsi (bukan di luar) |
| **State global** | `ref` di **luar** fungsi → shared (hati-hati, lebih baik Pinia) |
| **Lifecycle di composable** | `onMounted`/`onUnmounted` terikat ke komponen pemanggil |
| **Cleanup** | Selalu lepas listener/timer di `onUnmounted` |
| **Composable vs util** | Pakai reaktivitas → composable; murni proses → utilitas |
| **Komposisi** | Composable bisa panggil composable lain (rakit fitur) |

---

## 🎯 29. Latihan Mandiri

**⭐ Latihan 1 — `useToggle` di Komponen**
Buat composable `useToggle.js` (seperti contoh di atas) dan gunakan di komponen `AccordionItem.vue`. Setiap item accordion punya tombol yang memanggil `toggle()` untuk menyembunyikan/menampilkan `children`-nya.

**⭐⭐ Latihan 2 — `useFetch` dengan Retry**
Kembangkan `useFetch` dari bab ini dengan menambahkan fungsi `retry()` yang memanggil ulang `fetch(urlAwal)` saat gagal. Tambahkan counter `jumlahPercobaan` (ref) yang bertambah tiap percobaan. Gunakan di komponen yang menampilkan tombol "Coba Lagi" saat error.

**⭐⭐⭐ Latihan 3 — `useLocalStorage` Lengkap**
Buat composable `useLocalStorage.js` yang menerima `kunci` dan `nilaiAwal`, membaca dari `localStorage` saat init, dan menulis kembali (via `watch` dengan `deep: true`) tiap state berubah. Gunakan di komponen `DaftarTugas.vue` untuk menyimpan list tugas agar tidak hilang saat refresh.

**⭐⭐⭐⭐ Latihan 4 — `useOnlineStatus`**
Buat composable `useOnlineStatus.js` yang melacak apakah browser sedang online (`navigator.onLine`) menggunakan event `online`/`offline` pada `window`. Kembalikan `isOnline` (ref boolean) dan pastikan listener dilepas di `onUnmounted`. Tampilkan banner "Anda offline" di komponen saat `isOnline` bernilai false.

**⭐⭐⭐⭐ Latihan 5 — `useClipboard` (Eksplorasi)**
Berdasarkan bagian 16, buat `composables/useClipboard.js` dan gunakan di `KartuFilm.vue`: saat tombol "Salin Link" diklik, salin URL trailer film ke clipboard dan tampilkan indikator "Tersalin!" selama 2 detik. Pastikan menangani kasus `navigator.clipboard` tidak tersedia (fallback).

---

*Lanjut ke ➡️ **Bab 15 — Template Refs & Reaktivitas Lanjutan***
