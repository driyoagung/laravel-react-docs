# 🎯 Bab 15 — Template Refs & Reaktivitas Lanjutan

> *"Sehebat apa pun reaktivitas Vue, ada momen di mana kamu harus 'menyentuh' DOM secara langsung — memutar video, memfokuskan input, mengukur ukuran. Template ref adalah jembatan antara dunia reaktif Vue dan dunia nyata DOM."*

---

> **🧠 Apa Itu Template Refs?**
>
> **Template ref** adalah cara mendapatkan *reference* (rujukan) langsung ke sebuah **elemen DOM nyata** (seperti `<input>`, `<video>`, `<div>`) atau ke **instance komponen Vue anak**, lewat atribut `ref` di template yang diikat ke sebuah variabel `ref()` (atau `useTemplateRef`) di `<script setup>`. Dengan kata lain: setelah Vue merender tampilan, template ref memberimu "pegangan" ke objek aslinya agar kamu bisa memanggil method atau membaca properti yang tidak bisa dilakukan lewat reaktivitas biasa.

---

> **🏗️ Analogi Sederhana:**
>
> Bayangkan Vue sebagai sutradara teater yang mengatur semua aktor (elemen DOM) lewat naskah reaktif. Biasanya sutradara hanya perlu bilang "ubah dialog ini" dan semua berjalan otomatis. Tapi ada kalanya sutradara harus **langsung menyuruh aktor tertentu**: *"Hey, aktor pemutar video, PAUSE sekarang!"* Template ref adalah **nama panggung** yang ditempel pada aktor itu, sehingga sutradara bisa memanggilnya secara spesifik. Tanpa nama panggung, sutradara hanya bisa berteriak ke seluruh panggung (reaktivitas global) — tidak presisi.

---

## 📋 Daftar Isi Bab 15

1. Mengapa Perlu Template Ref?
2. Dasar Template Ref pada Elemen DOM
3. Akses Ref di `onMounted` (Timing Penting)
4. Ref pada Input — Fokus Otomatis
5. `defineExpose()` — Membuka Method Child ke Parent
6. Mengapa Encapsulation Penting?
7. `useTemplateRef()` — Cara Modern (Vue 3.5+)
8. Perbandingan `ref(null)` vs `useTemplateRef`
9. 🎬 Studi Kasus: VideoPlayer + MovieModal (Netflix)
10. Template Ref pada `v-for` (List of Refs)
11. Template Ref pada Komponen Anak
12. Mengukur Ukuran Elemen dengan `useTemplateRef`
13. 🚨 Jebakan Umum Pemula di Bab 15
14. 📝 Ringkasan Bab 15
15. 🎯 Latihan Mandiri

---

## 🔬 1. Mengapa Perlu Template Ref?

Vue dirancang agar kamu **jarang** menyentuh DOM secara langsung. Cukup ubah data, tampilan mengikuti. Tapi ada kasus-kasus di mana reaktivitas tidak cukup:

| Kasus | Mengapa butuh ref |
| --- | --- |
| Memutar/menjeda `<video>` | `.play()` / `.pause()` adalah method DOM, bukan state Vue |
| Memfokuskan `<input>` | `.focus()` adalah method DOM |
| Mengukur tinggi/lebar elemen | `.offsetHeight`, `getBoundingClientRect()` |
| Integrasi library luar (chart, map) | Library butuh elemen DOM asli sebagai target |
| Memanggil method komponen anak | Child menutup method-nya (harus `defineExpose`) |

```vue
<!-- Tanpa ref: tidak bisa panggil .play() -->
<template>
  <video :src="url" />
  <!-- ❌ Tidak ada cara reaktif untuk "putar video sekarang" -->
</template>

<!-- Dengan ref: kita pegang elemen videonya -->
<script setup>
import { ref } from 'vue'
const videoEl = ref(null)
function putar() {
  videoEl.value?.play()   // ✅ panggil method DOM langsung
}
</script>

<template>
  <video ref="videoEl" :src="url" />
  <button @click="putar">▶ Play</button>
</template>
```

> 💡 **Prinsip:** Gunakan template ref **hanya bila perlu**. Jangan pakai ref untuk hal yang bisa diselesaikan dengan reaktivitas biasa (misal mengubah teks lewat `{{ }}`). Ref adalah alat presisi, bukan pengganti reaktivitas.

---

## 🎯 2. Dasar Template Ref pada Elemen DOM

Cara kerja dasar template ref:

1. Di `<script setup>`, buat `ref` dengan nilai awal `null`.
2. Di `<template>`, tambahkan `ref="namaYangSama"` pada elemen.
3. Vue akan **menghubungkan** keduanya: setelah render, `namaYangSama.value` berisi elemen DOM aslinya.

```vue
<script setup>
import { ref } from 'vue'

// ① Buat ref dengan nama SAMA dengan atribut ref di template
const judulEl = ref(null)

// Saat ini (sebelum render) judulEl.value = null
console.log(judulEl.value)   // null
</script>

<template>
  <!-- ② Atribut ref="judulEl" menghubungkan elemen ke variabel judulEl -->
  <h1 ref="judulEl">Halo Dunia</h1>
</template>
```

> 💡 **Tips:** `ref="judulEl"` (di template) **harus sama nama** dengan `const judulEl = ref(null)` (di script). Vue akan menghubungkan keduanya secara otomatis saat render. Kalau nama tidak cocok, `judulEl.value` akan tetap `null`.

---

## ⏱️ 3. Akses Ref di `onMounted` (Timing Penting)

Template ref **hanya terisi setelah komponen di-render ke DOM**. Artinya: jangan akses `.value`-nya di level atas script (masih `null`), melainkan di dalam `onMounted` atau event handler.

```vue
<script setup>
import { ref, onMounted } from 'vue'

const inputEl = ref(null)

// ❌ SALAH — dijalankan saat script dieksekusi (sebelum render)
console.log(inputEl.value)   // null ❌

// ✅ BENAR — dijalankan SETELAH elemen ada di DOM
onMounted(() => {
  console.log(inputEl.value)        // <input> element ✅
  inputEl.value.focus()             // fokuskan input
})
</script>

<template>
  <input ref="inputEl" placeholder="Nama film..." />
</template>
```

```
ALUR WAKTU:
  script dieksekusi
    → inputEl.value = null
  Vue render template ke DOM
    → menghubungkan ref="inputEl" ke elemen <input>
    → inputEl.value SEKARANG berisi <input>
  onMounted dipanggil
    → aman akses inputEl.value ✅
```

> ⚠️ **Catatan:** Jika elemen dirender secara kondisional (`v-if`), ref-nya akan `null` saat kondisi false, dan terisi saat true. Selalu pakai optional chaining `?.` saat mengakses untuk menghindari crash.

---

## 🔤 4. Ref pada Input — Fokus Otomatis

Contoh praktis: saat halaman pencarian dibuka, input langsung fokus agar user bisa langsung mengetik.

```vue
<!-- SearchInput.vue -->
<script setup>
import { ref, onMounted } from 'vue'

const inputEl = ref(null)

onMounted(() => {
  // Langsung fokus saat komponen terpasang
  inputEl.value?.focus()
})
</script>

<template>
  <div class="search-box">
    <span class="ikon">🔍</span>
    <input
      ref="inputEl"
      type="text"
      placeholder="Cari film, serial, genre..."
      class="input-cari"
    />
  </div>
</template>

<style scoped>
.search-box { display: flex; align-items: center; gap: 8px; }
.input-cari { flex: 1; padding: 10px; border-radius: 8px; border: 1px solid #ccc; }
</style>
```

```vue
<!-- Cara lain: fokus saat tombol diklik -->
<script setup>
import { ref } from 'vue'
const inputEl = ref(null)
function fokuskan() {
  inputEl.value?.focus()
}
</script>

<template>
  <input ref="inputEl" />
  <button @click="fokuskan">Klik untuk fokus</button>
</template>
```

---

## 🔓 5. `defineExpose()` — Membuka Method Child ke Parent

Secara default, komponen `<script setup>` **menutup** semua variabel/fungsinya dari luar (ini disebut *encapsulation* / enkapsulasi). Parent **tidak bisa** memanggil method child secara langsung.

Untuk membuka (mengekspos) method tertentu ke parent, gunakan `defineExpose()`.

```vue
<!-- VideoPlayer.vue (Child) -->
<script setup>
import { ref } from 'vue'

const videoEl = ref(null) // Akan merujuk ke elemen <video>

// ① Fungsi internal (TIDAK diekspos)
function logInternal() {
  console.log('ini private')
}

// ② Expose method ke parent — HANYA ini yang bisa diakses dari luar
defineExpose({
  play:  () => videoEl.value?.play(),
  pause: () => videoEl.value?.pause(),
  mute:  () => { videoEl.value.muted = true },
  // bisa juga ekspos state:
  getCurrentTime: () => videoEl.value?.currentTime,
})
</script>

<template>
  <video ref="videoEl" :src="src" controls />
</template>
```

```vue
<!-- Parent memanggil method yang diekspos -->
<script setup>
import { ref } from 'vue'
import VideoPlayer from './VideoPlayer.vue'

const player = ref(null)

function mulai() {
  player.value?.play()    // ✅ bisa karena di-expose
}
function jeda() {
  player.value?.pause()   // ✅ bisa
}
function status() {
  console.log(player.value?.getCurrentTime())  // ✅
}
</script>

<template>
  <VideoPlayer ref="player" :src="urlTrailer" />
  <button @click="mulai">▶ Play</button>
  <button @click="jeda">⏸ Pause</button>
</template>
```

> ⚠️ **Catatan Penting:** Tanpa `defineExpose`, parent **tidak akan bisa** memanggil `play()` atau `pause()`. Ini fitur keamanan agar child tidak "bocor" semua isinya. Hanya ekspos apa yang memang dibutuhkan parent — jangan ekspos semuanya.

> 💡 **Tips:** Di dalam `defineExpose` kamu bisa ekspos baik **fungsi** maupun **state** (`ref`). Tapi eksposlah secukupnya demi enkapsulasi yang baik.

---

## 🛡️ 6. Mengapa Encapsulation Penting?

Bayangkan kalau semua komponen membuka semua isinya:

```
❌ TANPA ENCAPSULASI:
  Parent bisa sembarangan mengubah:
    - videoEl (element DOM dalam)
    - internalState (state privat child)
    - helperPribadi() (fungsi internal)
  → Anak jadi rapuh, sulit diubah tanpa merusak parent

✅ DENGAN ENCAPSULASI (defineExpose):
  Child memutuskan KONTRAK-nya dengan parent:
    - play(), pause(), mute() ← ini saja yang boleh dipakai
  → Child bebas refactor internal tanpa takut merusak parent
```

Ini prinsip dasar *information hiding* dalam pemrograman berorientasi objek, diterapkan ke komponen Vue. `defineExpose` adalah "pintu depan" resmi komponenmu.

---

## 🆕 7. `useTemplateRef()` — Cara Modern (Vue 3.5+)

Di Vue 3.5+, mereferensikan elemen/komponen jadi lebih bersih dengan `useTemplateRef()`. Kita tidak lagi butuh `ref(null)` + penamaan manual yang harus cocok — cukup berikan **string** sebagai argumen.

```vue
<!-- Parent: MovieModal.vue -->
<script setup>
import { useTemplateRef } from 'vue'

// String 'player' HARUS sama dengan ref="player" di template
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

**Keuntungan `useTemplateRef`:**
- Nama string dijadikan "sumber kebenaran tunggal" — tidak ada dua variabel (`ref(null)` + atribut) yang harus disinkronkan.
- Lebih aman dari **bentrok nama** saat kamu memecah props/composable dengan `toRefs` (Bab 13) — nama variabel lokal bisa berbeda dari string ref.
- Bekerja untuk elemen DOM maupun komponen anak.

> 💡 **Tips:** `useTemplateRef` sangat membantu saat kamu memecah props/composable dengan `toRefs` — nama variabel lokal bisa berbeda dari string ref, sehingga tidak ada bentrok penamaan.

---

## 🆚 8. Perbandingan `ref(null)` vs `useTemplateRef`

| Cara lama (`ref(null)`) | Cara baru (`useTemplateRef`) |
| --- | --- |
| `const player = ref(null)` + `ref="player"` | `const player = useTemplateRef('player')` |
| Harus cocokkan nama variabel & atribut | String argumen = sumber kebenaran tunggal |
| Bisa bentrok nama saat destrukturisasi | Lebih aman dari tabrakan nama |
| Masih didukung (tidak deprecated) | Direkomendasikan untuk Vue 3.5+ |

```vue
<!-- ════════ CARA LAMA ════════ -->
<script setup>
import { ref } from 'vue'
const player = ref(null)        // nama variabel
</script>
<template>
  <VideoPlayer ref="player" />  <!-- harus SAMA dengan nama variabel -->
</template>

<!-- ════════ CARA BARU (3.5+) ════════ -->
<script setup>
import { useTemplateRef } from 'vue'
const player = useTemplateRef('player')  // string 'player'
</script>
<template>
  <VideoPlayer ref="player" />           <!-- harus sama dengan string -->
</template>
```

> ⚠️ **Catatan Versi:** `useTemplateRef` hanya ada di **Vue 3.5 ke atas**. Jika project-mu masih Vue 3.4 ke bawah, gunakan cara lama `ref(null)`. Kedua cara berfungsi; pilih yang kompatibel dengan versimu.

---

## 🎬 9. Studi Kasus: VideoPlayer + MovieModal (Netflix)

Bayangkan di Netflix-clone, saat user membuka modal trailer lalu menutupnya, videonya harus langsung di-*pause* (tidak boleh lanjut bermain di background).

**Alur:**
1. **Child** `VideoPlayer.vue` mengekspos `pause()` lewat `defineExpose`.
2. **Parent** `MovieModal.vue` memegang rujukan child lewat `useTemplateRef('player')`.
3. Saat tombol ✕ ditekan → `playerRef.value?.pause()` → video berhenti.

```vue
<!-- VideoPlayer.vue -->
<script setup>
import { ref } from 'vue'

// Ref ke elemen <video> asli
const videoEl = ref(null)

// Menerima src dari parent
const props = defineProps({
  src: { type: String, required: true },
})

// Ekspos method yang boleh dipanggil parent
defineExpose({
  play:  () => videoEl.value?.play(),
  pause: () => videoEl.value?.pause(),
  // Tambahan: set volume
  setVolume: (v) => { if (videoEl.value) videoEl.value.volume = v },
})
</script>

<template>
  <video
    ref="videoEl"
    :src="props.src"
    class="video-trailer"
    controls
  />
</template>

<style scoped>
.video-trailer { width: 100%; border-radius: 8px; }
</style>
```

```vue
<!-- MovieModal.vue (PARENT) -->
<script setup>
import { useTemplateRef } from 'vue'
import VideoPlayer from './VideoPlayer.vue'

// Menerima data film & event tutup dari grand-parent
const props = defineProps({
  film: { type: Object, required: true },
})
const emit = defineEmits(['tutup'])

// Ref ke instance VideoPlayer
const playerRef = useTemplateRef('player')

// Saat modal dibuka, auto-play trailer
function onModalTerbuka() {
  playerRef.value?.play()
}

// Saat tombol tutup diklik
function handleTutup() {
  playerRef.value?.pause()   // hentikan video dulu
  emit('tutup')              // baru tutup modal
}
</script>

<template>
  <div class="modal-overlay" @click.self="handleTutup">
    <div class="modal-content">
      <h2>{{ props.film.title }}</h2>

      <!-- ref="player" → diikat ke playerRef -->
      <VideoPlayer ref="player" :src="props.film.trailerUrl" />

      <button @click="handleTutup">✕ Tutup</button>
    </div>
  </div>
</template>
```

> ⚠️ **Catatan Penting:** Tanda `?.` (optional chaining) krusial di sini. Jika `VideoPlayer` belum ter-render (misal karena `v-if`), `playerRef.value` akan `null` dan tanpa `?.` aplikasi akan *crash*. Selalu pakai `?.` saat mengakses template ref.

---

## 📋 10. Template Ref pada `v-for` (List of Refs)

Saat `ref` dipakai di dalam `v-for`, Vue akan mengumpulkan **semua** elemen menjadi sebuah **array** (cara lama) atau sebuah fungsi/array (cara baru). Ini berguna bila kamu perlu memanipulasi banyak elemen sekaligus.

### Cara lama: `ref` dengan nama string di `v-for`

```vue
<script setup>
import { ref, onMounted } from 'vue'

// ⚠️ CARA LAMA: Vue mengisi ini dengan ARRAY elemen
const itemEls = ref([])

onMounted(() => {
  // itemEls.value sekarang adalah array dari semua <li>
  console.log(itemEls.value.length)  // jumlah item
  itemEls.value[0]?.classList.add('aktif')
})
</script>

<template>
  <ul>
    <li
      v-for="film in daftarFilm"
      :key="film.id"
      ref="itemEls"           <!-- nama SAMA, Vue kumpulkan jadi array -->
    >
      {{ film.title }}
    </li>
  </ul>
</template>
```

> ⚠️ **Catatan cara lama:** Urutan array `itemEls` **tidak dijamin** sama dengan urutan `v-for` (terutama saat list berubah). Untuk akses terarah, lebih baik gunakan `:ref` fungsi (di bawah).

### Cara baru: function ref (lebih terkontrol)

```vue
<script setup>
import { ref } from 'vue'

// Map: id film → elemen DOM
const elemenById = ref({})

// Function ref: Vue panggil ini untuk SETIAP elemen dengan elemennya
function setRef(el, id) {
  if (el) {
    elemenById.value[id] = el   // simpan elemen berdasar id
  } else {
    delete elemenById.value[id] // elemen dihapus (unmount)
  }
}

function sorot(id) {
  // Akses elemen spesifik by id
  elemenById.value[id]?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <ul>
    <li
      v-for="film in daftarFilm"
      :key="film.id"
      :ref="(el) => setRef(el, film.id)"   <!-- function ref -->
    >
      {{ film.title }}
    </li>
  </ul>
</template>
```

> 💡 **Tips:** Function ref (`ref="(el) => ..."`) memberi kontrol penuh: kamu bisa menyimpan elemen ke Map/object berdasarkan id, sehingga aksesnya presisi dan tidak bergantung urutan array. Ini cara modern yang direkomendasikan untuk `v-for`.

---

## 🧩 11. Template Ref pada Komponen Anak

Ref pada komponen anak bekerja sama seperti ref pada elemen DOM, tapi `.value`-nya adalah **instance komponen anak** — dan hanya yang **diekspos via `defineExpose`** yang bisa diakses.

```vue
<!-- Child: CounterAnak.vue -->
<script setup>
import { ref } from 'vue'

const hitungan = ref(0)
function tambah() { hitungan.value++ }

// Ekspos agar parent bisa panggil
defineExpose({ tambah, hitungan })
</script>

<template>
  <p>Hitungan anak: {{ hitungan }}</p>
</template>
```

```vue
<!-- Parent -->
<script setup>
import { ref } from 'vue'
import CounterAnak from './CounterAnak.vue'

// Ref ke instance CounterAnak
const anakRef = ref(null)

function picuAnak() {
  // Bisa panggil method yang diekspos
  anakRef.value?.tambah()
  // Bisa baca state yang diekspos
  console.log(anakRef.value?.hitungan)
}
</script>

<template>
  <CounterAnak ref="anakRef" />
  <button @click="picuAnak">Tambah dari Parent</button>
</template>
```

> ⚠️ **Ingat:** Jika `CounterAnak` **tidak** memanggil `defineExpose`, maka `anakRef.value` akan berisi instance internal yang **tersembunyi** — kamu tidak bisa mengakses `tambah` atau `hitungan`. Selalu ekspos secara eksplisit.

---

## 📏 12. Mengukur Ukuran Elemen dengan `useTemplateRef`

Salah satu kegunaan ref paling umum: mengukur dimensi elemen untuk layout dinamis (misal: tinggi header untuk padding, atau posisi tooltip).

```vue
<script setup>
import { useTemplateRef, onMounted, ref } from 'vue'

const boxEl = useTemplateRef('box')
const tinggi = ref(0)
const lebar  = ref(0)

onMounted(() => {
  // getBoundingClientRect memberi ukuran & posisi presisi
  const rect = boxEl.value.getBoundingClientRect()
  tinggi.value = Math.round(rect.height)
  lebar.value  = Math.round(rect.width)
})
</script>

<template>
  <div ref="box" class="kotak">
    Konten dengan tinggi dinamis...
  </div>
  <p>Ukuran: {{ lebar }} × {{ tinggi }} px</p>
</template>

<style scoped>
.kotak { padding: 20px; background: #f0f0f0; }
</style>
```

```vue
<!-- Contoh lain: scroll ke elemen saat tombol diklik -->
<script setup>
import { useTemplateRef } from 'vue'
const targetEl = useTemplateRef('target')

function scrollKeTarget() {
  targetEl.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>

<template>
  <button @click="scrollKeTarget">Lihat Bagian Bawah</button>
  <div style="height: 1000px"></div>
  <div ref="target">👋 Ini target!</div>
</template>
```

> 💡 **Tips:** Untuk mengukur ukuran yang **berubah-ubah** (misal saat konten dimuat), gunakan `watch` atau `ResizeObserver`而不是 hanya `onMounted`. Tapi untuk kasus statis, `onMounted` cukup.

---

## 🚨 13. Jebakan Umum Pemula di Bab 15

### ❌ Jebakan 1 — Mengakses Ref Sebelum Render (Masih Null)

```vue
<script setup>
import { ref } from 'vue'
const inputEl = ref(null)

// ❌ SALAH — dijalankan saat script dieksekusi, elemen belum ada
inputEl.value.focus()   // ❌ crash: inputEl.value = null

// ✅ BENAR — di onMounted
import { onMounted } from 'vue'
onMounted(() => {
  inputEl.value?.focus()
})
</script>
```

> ✅ **Perbaikan:** Akses template ref hanya di `onMounted`, event handler, atau `watch`.

---

### ❌ Jebakan 2 — Nama Ref Tidak Cocok

```vue
<script setup>
import { ref } from 'vue'
const videoEl = ref(null)   // nama: videoEl
</script>

<template>
  <!-- ❌ SALAH — ref="vid" tidak cocok dengan videoEl -->
  <video ref="vid" />
  <!-- ✅ BENAR -->
  <video ref="videoEl" />
</template>
```

---

### ❌ Jebakan 3 — Lupa `defineExpose` saat Akses Child

```vue
<!-- Child -->
<script setup>
const hitungan = ref(0)
function tambah() { hitungan.value++ }
// ❌ LUPA defineExpose → parent tidak bisa akses apa pun
</script>

<!-- Parent -->
<script setup>
const anakRef = ref(null)
function a() {
  anakRef.value.tambah()   // ❌ undefined
}
</script>

<!-- ✅ BENAR: tambahkan di Child -->
<script setup>
defineExpose({ tambah, hitungan })
</script>
```

---

### ❌ Jebakan 4 — Akses Ref Tanpa `?.` (Crash saat Null)

```vue
<script setup>
import { ref } from 'vue'
const player = ref(null)

function tutup() {
  // ❌ SALAH — jika video belum render, crash
  player.value.pause()

  // ✅ BENAR — pakai optional chaining
  player.value?.pause()
}
</script>
```

---

### ❌ Jebakan 5 — `useTemplateRef` di Vue < 3.5

```vue
<script setup>
// ❌ SALAH — useTemplateRef belum ada di Vue 3.4 ke bawah
import { useTemplateRef } from 'vue'
const x = useTemplateRef('x')
</script>

<!-- ✅ BENAR untuk Vue lama: pakai ref(null) -->
<script setup>
import { ref } from 'vue'
const x = ref(null)
</script>
<template>
  <div ref="x" />
</template>
```

---

## 🖼️ 14. Template Ref pada SVG & Canvas

Ref juga berguna untuk elemen grafis yang tidak bisa diatur lewat reaktivitas biasa, seperti SVG dan `<canvas>`.

```vue
<script setup>
import { useTemplateRef, onMounted } from 'vue'

const canvasEl = useTemplateRef('canvas')

onMounted(() => {
  const ctx = canvasEl.value.getContext('2d')
  // Gambar sesuatu langsung ke canvas
  ctx.fillStyle = '#e50914'   // merah khas Netflix
  ctx.fillRect(10, 10, 150, 80)
})
</script>

<template>
  <canvas ref="canvas" width="300" height="150" />
</template>
```

```vue
<!-- Manipulasi atribut SVG langsung -->
<script setup>
import { useTemplateRef, onMounted } from 'vue'
const circleEl = useTemplateRef('lingkaran')

onMounted(() => {
  // Ubah radius lingkaran via DOM API
  circleEl.value.setAttribute('r', '50')
})
</script>

<template>
  <svg width="200" height="200">
    <circle ref="lingkaran" cx="100" cy="100" r="20" fill="gold" />
  </svg>
</template>
```

> 💡 **Tips:** Integrasi library grafis (Chart.js, D3, Three.js) **selalu** butuh ref ke elemen DOM target. Ini salah satu penggunaan template ref paling nyata di project riil.

---

## 🔗 15. Template Ref + `v-for` dengan `useTemplateRef` (Vue 3.5+)

Cara modern mereferensikan list elemen:

```vue
<script setup>
import { useTemplateRef, onMounted } from 'vue'

// useTemplateRef dengan string yang SAMA di v-for → jadi array
const itemRefs = useTemplateRef('item')

onMounted(() => {
  // itemRefs.value adalah ARRAY dari semua <li>
  console.log('Jumlah item:', itemRefs.value.length)
  itemRefs.value.forEach((el) => {
    el.classList.add('terdaftar')
  })
})
</script>

<template>
  <ul>
    <li v-for="n in 5" :key="n" ref="item">{{ n }}</li>
  </ul>
</template>
```

> ⚠️ **Catatan:** Sama seperti cara lama, urutan array `useTemplateRef` di `v-for` tidak dijamin sama dengan urutan render saat list berubah dinamis. Untuk akses terarah, tetap preferensikan **function ref** (lihat Bagian 10).

---

## 🪜 16. Template Ref vs Reactive State — Mana Duluan?

Sering pemula bingung: *"Harusnya pakai ref DOM atau ref reaktif?"*

```
GUNAKAN template ref (DOM) bila:
  ✅ Perlu panggil method DOM (.play, .focus, .scrollIntoView)
  ✅ Perlu baca ukuran/posisi elemen
  ✅ Integrasi library luar (chart, map, video)
  ✅ Akses method komponen anak (via defineExpose)

GUNAKAN reactive state bila:
  ✅ Cukup ubah teks/gaya lewat data
  ✅ Tampilan mengikuti nilai (interpolasi, v-bind)
  ✅ Tidak butuh interaksi imperative dengan DOM
```

```vue
<!-- ❌ Berlebihan: pakai ref DOM hanya untuk ubah teks -->
<script setup>
const el = ref(null)
function ubah() { el.value.textContent = 'Halo' }  // ❌ overkill
</script>
<template><p ref="el">Hi</p></template>

<!-- ✅ BENAR: cukup reactive state -->
<script setup>
const teks = ref('Hi')
function ubah() { teks.value = 'Halo' }   // ✅ tepat
</script>
<template><p>{{ teks }}</p></template>
```

> 💡 **Prinsip:** Template ref adalah **senjata pamungkas**, bukan alat utama. Pakai reaktivitas dulu; pakai ref DOM hanya bila reaktivitas tak cukup.

---

## 🧪 17. Bandingkan Ref Komponen vs Ref Elemen — Tabel Lengkap

| Aspek | Ref Elemen DOM | Ref Komponen Anak |
| --- | --- | --- |
| Atribut | `ref="x"` pada tag HTML | `ref="x"` pada tag komponen |
| `.value` berisi | Elemen DOM asli (`<video>`, `<input>`) | Instance komponen anak |
| Akses method | Langsung (`.play()`, `.focus()`) | Hanya yg **diekspos** `defineExpose` |
| Akses property | Semua property DOM | Hanya state yg diekspos |
| Butuh `defineExpose`? | ❌ Tidak (DOM terbuka) | ✅ Ya (enkapsulasi child) |

```vue
<!-- Ringkasan penggunaan -->
<script setup>
import { ref, useTemplateRef } from 'vue'
import VideoPlayer from './VideoPlayer.vue'

const inputEl   = ref(null)               // elemen DOM
const playerRef = useTemplateRef('player') // komponen anak

onMounted(() => {
  inputEl.value?.focus()                  // method DOM
  playerRef.value?.pause()                // method ekspos child
})
</script>

<template>
  <input ref="inputEl" />
  <VideoPlayer ref="player" />
</template>
```

---

## 🔒 18. Pola Focus Trap dengan Template Ref

Salah satu kegunaan nyata template ref: membuat *focus trap* pada modal (agar Tab keyboard tetap di dalam modal, tidak loncat ke elemen di belakang).

```vue
<script setup>
import { useTemplateRef, onMounted, ref } from 'vue'

const modalEl = useTemplateRef('modal')
const isOpen = ref(false)

function buka() {
  isOpen.value = true
  // Fokus elemen pertama dalam modal saat dibuka
  onMounted(() => {})
  setTimeout(() => {
    const pertama = modalEl.value?.querySelector('button, input, a')
    pertama?.focus()
  }, 0)
}

function tanganiTab(e) {
  if (e.key !== 'Tab' || !modalEl.value) return
  const elemen = modalEl.value.querySelectorAll('button, input, a')
  const list = Array.from(elemen)
  if (list.length === 0) return
  const pertama = list[0]
  const terakhir = list[list.length - 1]

  // Tab dari elemen terakhir → kembali ke pertama
  if (!e.shiftKey && document.activeElement === terakhir) {
    e.preventDefault(); pertama.focus()
  }
  // Shift+Tab dari elemen pertama → ke terakhir
  if (e.shiftKey && document.activeElement === pertama) {
    e.preventDefault(); terakhir.focus()
  }
}
</script>

<template>
  <div v-if="isOpen" ref="modal" class="modal" @keydown="tanganiTab">
    <button>Close</button>
    <input placeholder="Nama" />
    <a href="#">Link</a>
  </div>
  <button @click="buka">Buka Modal</button>
</template>
```

> 💡 **Tips:** Pola focus trap penting untuk **aksesibilitas (a11y)**. Pengguna keyboard/ screen reader mengandalkan fokus yang terjaga di dalam modal. Template ref memungkinkan kita membaca & mengatur fokus secara imperative.

---

## 🪄 19. Akses Computed & State Child lewat `defineExpose`

Child bisa mengekspos bukan cuma method, tapi juga `computed` dan `ref` agar parent bisa membaca nilai turunan.

```vue
<!-- Child: FormLangganan.vue -->
<script setup>
import { ref, computed } from 'vue'

const email = ref('')
const isValid = computed(() => /.+@.+\..+/.test(email.value))

// Ekspos state + computed + method
defineExpose({
  email,
  isValid,
  reset: () => { email.value = '' },
})
</script>

<template>
  <input v-model="email" placeholder="Email" />
  <small v-if="!isValid">Email belum valid</small>
</template>
```

```vue
<!-- Parent -->
<script setup>
import { ref } from 'vue'
import FormLangganan from './FormLangganan.vue'

const formRef = ref(null)

function cobaSubmit() {
  // Baca computed yang diekspos
  if (formRef.value?.isValid.value) {
    // submit...
  } else {
    alert('Perbaiki email dulu')
  }
}
</script>

<template>
  <FormLangganan ref="formRef" />
  <button @click="cobaSubmit">Submit</button>
</template>
```

> ⚠️ **Catatan:** Saat mengakses `ref`/`computed` yang diekspos dari parent, ingat tetap pakai `.value` (karena ia tetap bertipe ref). `formRef.value.isValid.value` — dua level `.value`.

---

## 🧭 20. Ref + Teleport — Mengakses Elemen yang Dipindah

`Teleport` memindahkan DOM ke tempat lain (misal `body`). Template ref tetap berfungsi karena Vue melacak instance, bukan posisi DOM.

```vue
<script setup>
import { useTemplateRef } from 'vue'

const modalEl = useTemplateRef('modal')

function fokusModal() {
  // Tetap berfungsi meski modal "dipindah" ke body via Teleport
  modalEl.value?.focus()
}
</script>

<template>
  <Teleport to="body">
    <div ref="modal" tabindex="-1" class="modal">
      Konten modal di body
    </div>
  </Teleport>
</template>
```

> 💡 **Tips:** Teleport tidak merusak template ref. Vue menghubungkan ref ke elemen hasil render final, di manapun ia berada di DOM. Ini membuat modal/tooltip dengan `Teleport` tetap bisa dikendalikan via ref.

---

## 🔁 21. Template Ref Bersama dalam Composable (`useFocus`)

Seringkali pola "fokus otomatis" dipakai di banyak komponen berbeda (search bar, form login, form komentar). Alih-alih menulis `ref(null)` + `onMounted` berulang, kita angkat ke composable. Ini persis pola yang dipelajari di Bab 16, diterapkan pada template ref.

```javascript
// composables/useFocus.js
import { ref, onMounted, nextTick } from 'vue'

// Composable mengembalikan ref + fungsi bantu fokus
export function useFocus(autoFocus = false) {
  const el = ref(null)            // akan diikat ke elemen via ref="el"

  // Fokuskan elemen (pakai optional chaining untuk aman)
  function focus() {
    el.value?.focus()
  }

  // Hilangkan fokus
  function blur() {
    el.value?.blur()
  }

  // Jika diminta autoFocus, fokus saat komponen di-mount
  onMounted(() => {
    if (autoFocus) focus()
  })

  return { el, focus, blur }
}
```

```vue
<!-- SearchInput.vue — pakai composable di atas -->
<script setup>
import { useFocus } from '@/composables/useFocus'

// autoFocus = true → input langsung fokus saat mount
const { el: inputEl, focus } = useFocus(true)
</script>

<template>
  <div class="search-box">
    <span class="ikon">🔍</span>
    <!-- ref="el" di dalam composable terhubung ke inputEl -->
    <input ref="el" type="text" placeholder="Cari film, serial, genre..." />
  </div>
  <button @click="focus">Klik untuk fokus lagi</button>
</template>
```

> 💡 **Tips:** Perhatikan kita **mengembalikan** `el` dari composable dan mengikatnya via `ref="el"` di template. Vue menghubungkan `ref="el"` ke variabel `el` yang dikembalikan composable — nama string di template harus sama dengan nama variabel yang di-return. Composable ini kini bisa dipakai di puluhan komponen tanpa duplikasi.

---

## 🔄 22. Reaksi Perubahan Ukuran dengan `watch` + `ResizeObserver`

`onMounted` hanya mengukur **sekali**. Jika konten dimuat lambat (misal gambar, data API), ukuran berubah *setelah* mount. Untuk mengikuti perubahan secara *reaktif*, gabungkan `useTemplateRef` dengan `watch` dan `ResizeObserver`.

```vue
<script setup>
import { useTemplateRef, ref, watch, onMounted, onUnmounted } from 'vue'

const boxEl  = useTemplateRef('box')
const tinggi = ref(0)

// Buat observer yang memantau perubahan ukuran elemen
let observer = null

onMounted(() => {
  if (!boxEl.value) return

  // ResizeObserver memanggil callback tiap kali ukuran berubah
  observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      tinggi.value = Math.round(entry.contentRect.height)
    }
  })
  observer.observe(boxEl.value)   // mulai pantau
})

// Bersihkan observer saat komponen dihancurkan (cegah memory leak!)
onUnmounted(() => observer?.disconnect())

// Atau pantau tinggi secara deklaratif dengan watch
watch(tinggi, (baru, lama) => {
  console.log(`Tinggi berubah: ${lama}px → ${baru}px`)
})
</script>

<template>
  <div ref="box" class="kotak">
    Konten dengan tinggi dinamis (gambar, teks dari API...)
  </div>
  <p>Tinggi saat ini: {{ tinggi }} px</p>
</template>
```

| Cara | Kapan cocok | Kekurangan |
| --- | --- | --- |
| `onMounted` + ukur sekali | Konten statis, tidak berubah | Tidak menangkap perubahan nanti |
| `watch` pada state | Ukuran bergantung state Vue | Tidak menangkap perubahan layout DOM murni |
| `ResizeObserver` | Ukuran berubah dari luar (gambar, font) | Perlu cleanup manual |

> ⚠️ **Wajib cleanup:** `ResizeObserver`, `IntersectionObserver`, dan `setInterval` **harus** dihentikan di `onUnmounted`. Jika tidak, observer tetap jalan di memori meski komponen sudah hilang → **memory leak**.

---

## 🧷 23. Ref pada Komponen Pihak Ketiga (Library Eksternal)

Hampir semua library grafis (Chart.js, D3, Leaflet, Three.js) butuh **elemen DOM asli** sebagai target render. Template ref adalah jembatan wajib ke library tersebut.

```vue
<script setup>
import { useTemplateRef, onMounted, onUnmounted, ref } from 'vue'
import Chart from 'chart.js/auto'   // library pihak ketiga

const canvasEl = useTemplateRef('canvas')
const chartInstance = ref(null)

onMounted(() => {
  // Chart.js butuh elemen <canvas> asli, BUKAN reaktivitas Vue
  const ctx = canvasEl.value.getContext('2d')
  chartInstance.value = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Sen', 'Sel', 'Rab'],
      datasets: [{ label: 'Penonton', data: [120, 190, 300] }],
    },
  })
})

onUnmounted(() => {
  // Hancurkan chart saat komponen hilang agar tidak dobel-render
  chartInstance.value?.destroy()
})
</script>

<template>
  <canvas ref="canvas" width="400" height="200" />
</template>
```

> 💡 **Pola umum:** Library eksternal **tidak tahu** soal reaktivitas Vue. Ia hanya butuh DOM. Jadi alur standarnya selalu: (1) `useTemplateRef` ke elemen, (2) inisialisasi library di `onMounted`, (3) `destroy()`/`dispose()` di `onUnmounted`.

---

## 🆚 24. `ref(null)` vs `document.querySelector` — Perbandingan Mendalam

Pemula sering tergoda pakai `document.querySelector('.foo')` karena terbiasa dengan JavaScript biasa. Jangan lakukan itu di Vue!

```vue
<!-- ❌ SALAH — querySelector global & getaran -->
<script setup>
function ubahWarna() {
  // Mencari di SELURUH dokumen → bisa salah sasaran, lambat, & tidak reaktif
  document.querySelector('.kotak').style.background = 'red'
}
</script>

<!-- ✅ BENAR — template ref scoped ke komponen ini -->
<script setup>
import { useTemplateRef } from 'vue'
const kotakEl = useTemplateRef('kotak')
function ubahWarna() {
  kotakEl.value.style.background = 'red'   // presisi ke elemen komponen ini
}
</script>
<template>
  <div ref="kotak" class="kotak">...</div>
</template>
```

| Aspek | `document.querySelector` | Template ref |
| --- | --- | --- |
| Cakupan | Seluruh dokumen (global) | Hanya komponen ini (scoped) |
| Aman di SPA | ❌ Bisa kena elemen lain | ✅ Presisi ke elemen sendiri |
| Reaktif? | ❌ Tidak | ✅ Terhubung ke siklus Vue |
| Timing | Perlu DOM sudah ada | Vue jamin terisi saat mount |
| Bisa dipakai? | ⚠️ Hanya untuk kasus sangat khusus | ✅ Standar |

> ⚠️ **Catatan:** Satu-satunya saat `querySelector` boleh dipakai adalah di dalam ref yang sudah kamu pegang (misal `el.value.querySelector('button')` seperti pada focus trap Bab 15 bagian 18). Itu aman karena dicari **di dalam** elemen ref-mu, bukan di seluruh dokumen.

---

## 🎯 25. Pola `nextTick` sebelum Akses Ref

Ada kalanya elemen baru muncul **setelah** perubahan state (misal membuka modal lewat `v-if`). Saat itu, ref belum terisi di baris kode yang sama dengan perubahan state. Gunakan `nextTick` untuk menunggu Vue selesai merender DOM.

```vue
<script setup>
import { ref, useTemplateRef, nextTick } from 'vue'

const isModalOpen = ref(false)
const inputModal  = useTemplateRef('inputModal')

async function bukaModal() {
  isModalOpen.value = true          // tampilkan modal (v-if jadi true)
  // ❌ ref belum terisi di baris ini! Modal baru dirender secara async
  // inputModal.value?.focus()      // → masih null

  // ✅ Tunggu Vue selesai render DOM, lalu fokus
  await nextTick()
  inputModal.value?.focus()         // ✅ sekarang elemen ada
}
</script>

<template>
  <button @click="bukaModal">Buka Modal</button>
  <div v-if="isModalOpen" class="modal">
    <input ref="inputModal" placeholder="Ketik sesuatu..." />
  </div>
</template>
```

> 💡 **Ingat:** `nextTick` = "tunggu satu siklus render DOM selesai". Sangat berguna saat mau memanipulasi ref yang baru saja dimunculkan lewat `v-if`/`v-show`.

---

## 🚨 26. Jebakan Tambahan (Jebakan 6–10)

### ❌ Jebakan 6 — Mereassign `ref` sehingga kehilangan koneksi DOM

```vue
<script setup>
import { ref } from 'vue'
const el = ref(null)
function salah() {
  // ❌ Membuat ref BARU → koneksi ke template putus!
  el = ref(null)
}
</script>
<!-- ✅ BENAR: ubah .value, JANGAN ganti variabelnya -->
<script setup>
const el = ref(null)
function benar() {
  el.value = null   // ok, tapi biasanya tidak perlu diubah manual
}
</script>
```

### ❌ Jebakan 7 — Akses ref di dalam `v-if` yang belum aktif

```vue
<!-- ❌ SALAH — ref null karena v-if=false saat diakses -->
<div v-if="false" ref="rahasia">...</div>
<script setup>
const rahasia = ref(null)
onMounted(() => rahasia.value.classList.add('x')) // ❌ crash
</script>
<!-- ✅ BENAR: pastikan kondisi true / pakai v-show / pakai nextTick -->
```

### ❌ Jebakan 8 — Lupa cleanup observer / listener

```vue
<!-- ❌ SALAH — observer jalan terus meski komponen hilang -->
<script setup>
onMounted(() => { observer = new ResizeObserver(...) })
</script>
<!-- ✅ BENAR -->
<script setup>
onMounted(() => { observer = new ResizeObserver(...); observer.observe(el.value) })
onUnmounted(() => observer?.disconnect())
</script>
```

### ❌ Jebakan 9 — Function ref mengembalikan nilai

```vue
<!-- ❌ SALAH — function ref TIDAK boleh return apa-apa -->
<template>
  <li :ref="(el) => list.value.push(el)">...</li>
</template>
<!-- ✅ BENAR — function ref hanya simpan, tidak return -->
<script setup>
function setRef(el) { if (el) list.value.push(el) }
</script>
<template>
  <li :ref="setRef">...</li>
</template>
```

### ❌ Jebakan 10 — Mengakses `ref` di `setup` top-level tanpa `onMounted`

```vue
<!-- ❌ SALAH -->
<script setup>
const el = ref(null)
console.log(el.value)   // null — script jalan SEBELUM render
</script>
<!-- ✅ BENAR -->
<script setup>
const el = ref(null)
onMounted(() => console.log(el.value))  // elemen sudah ada
</script>
```

---

## 🪄 27. Tips Pro — `shallowRef` untuk Elemen Berat

Jika elemen yang kamu ref sangat kompleks (misal instance Three.js, peta Leaflet), gunakan `shallowRef` agar Vue **tidak** mencoba membuat proxy reaktif mendalam — ini menghemat performa.

```vue
<script setup>
import { shallowRef, onMounted } from 'vue'
import * as THREE from 'three'

// shallowRef: Vue TIDAK memproxy isinya secara mendalam → lebih cepat
const sceneEl = shallowRef(null)

onMounted(() => {
  const renderer = new THREE.WebGLRenderer()
  sceneEl.value.appendChild(renderer.domElement)
})
</script>

<template>
  <div ref="sceneEl" class="canvas-3d" />
</template>
```

> 🎯 **Kapan pakai `shallowRef`?** Saat nilai ref adalah **objek raksasa dari library eksternal** (Three.js scene, Map instance, Chart instance). Vue tidak perlu melacak perubahan di dalamnya, jadi `shallowRef` mencegah overhead proxy yang tidak perlu.

---

## 📝 Ringkasan Bab 15

| Konsep | Penjelasan |
| --- | --- |
| **Template ref** | Rujukan langsung ke elemen DOM / instance komponen anak |
| **Cara dasar** | `ref="nama"` di template + `const nama = ref(null)` di script |
| **Timing** | Ref terisi setelah render → akses di `onMounted`/handler |
| **`defineExpose`** | Membuka method/state child ke parent (enkapsulasi) |
| **`useTemplateRef`** | Cara modern Vue 3.5+ (string argumen, anti bentrok nama) |
| **Ref di `v-for`** | Menjadi array (cara lama) atau pakai function ref (cara baru) |
| **Ref komponen** | `.value` = instance anak; hanya yg diekspos yg bisa diakses |
| **`?.` wajib** | Cegah crash saat elemen belum ter-render |

---

## 🎯 Latihan Mandiri

**⭐ Latihan 1 — Input Fokus Otomatis**
Buat komponen `KomentarForm.vue` dengan satu `<input>` (atau `<textarea>`). Saat komponen dimuat (`onMounted`), input tersebut otomatis terfokus. Tambahkan juga tombol "Fokus Lagi" yang memanggil `.focus()` lewat template ref.

**⭐⭐ Latihan 2 — Child Counter dengan `defineExpose`**
Buat `CounterAnak.vue` yang memiliki `hitungan` (ref) dan method `tambah()` + `reset()`. Ekspos keduanya. Di `ParentCounter.vue`, pasang ref ke `CounterAnak` dan buat tombol "Tambah (dari Parent)" serta "Reset (dari Parent)" yang memanggil method child tersebut.

**⭐⭐⭐ Latihan 3 — List Refs dengan Function Ref**
Buat komponen `DaftarWarna.vue` yang merender 5 `<div>` via `v-for` dengan warna berbeda. Gunakan **function ref** untuk menyimpan tiap elemen ke dalam Map berdasarkan indeks. Tambahkan tombol yang, saat diklik, mengubah `backgroundColor` elemen ke-3 secara langsung lewat ref (bukan lewat reaktivitas).

**⭐⭐⭐⭐ Latihan 4 — Modal Trailer Lengkap (Studi Kasus Gabungan)**
Gabungkan `VideoPlayer.vue` (child dengan `defineExpose({ play, pause })`) dan `MovieModal.vue` (parent dengan `useTemplateRef`). Saat modal terbuka, auto-play video; saat tombol ✕ atau overlay diklik, pause video lalu emit `tutup`. Pastikan semua akses ref memakai `?.`. Bonus: tambahkan indikator "▶ Sedang diputar / ⏸ Dijeda" yang diperbarui lewat method child.

---

*Lanjut ke ➡️ **Bab 16 — Composable Lanjutan & Patterns***
