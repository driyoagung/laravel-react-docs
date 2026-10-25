# 🔄 Bab 9 — Lifecycle Hooks: Siklus Hidup Komponen

> *"Setiap makhluk memiliki awal, pertumbuhan, dan akhir. Komponen Vue pun demikian — ia lahir saat dipasang ke layar, bernapas setiap kali datanya berubah, dan memejamkan mata saat dibuang. Lifecycle hooks adalah momen-momen suci di mana kita boleh masuk dan melakukan sesuatu."*

---

> **🧠 Apa Itu Lifecycle Hooks?**
>
> Setiap komponen Vue melalui **tahapan hidup** layaknya organisme: **setup** (persiapan), **mount** (dipasang ke DOM), **update** (diperbarui saat data berubah), dan **unmount** (dicabut dari DOM). Vue menyediakan **lifecycle hooks** — fungsi yang kita "pasang" agar kode kita dijalankan pada momen spesifik tersebut. Ini tempat yang tepat untuk: mengambil data dari API, menginisialisasi library pihak ketiga, memasang event listener, menjalankan timer, dan — yang paling penting — **membersihkan semuanya** saat komponen dibuang agar tidak terjadi memory leak.

---

> **🏗️ Analogi Sederhana:**
>
> Bayangkan komponen seperti **karyawan yang masuk kerja**. Saat ia tiba (onBeforeMount → onMounted), ia mengambil tugas dari server (fetch data) dan menyiapkan mejanya (init library). Saat ada instruksi baru (onBeforeUpdate → onUpdated), ia memperbarui pekerjaannya. Saat ia pulang (onBeforeUnmount → onUnmounted), ia **wajib** mematikan komputer dan mengembalikan kunci (clearInterval, removeEventListener) — kalau lupa, kantor akan berantakan (memory leak). Lifecycle hooks adalah "jam kerja" di mana karyawan tersebut boleh bertindak.

---

## 📋 Daftar Isi Bab 9

1. Mengapa Perlu Lifecycle Hooks?
2. Diagram Lengkap Lifecycle Vue 3
3. `onBeforeMount` & `onMounted`
4. `onBeforeUpdate` & `onUpdated`
5. `onBeforeUnmount` & `onUnmounted`
6. `onErrorCaptured` — Menangkap Error
7. `onActivated` & `onDeactivated` (KeepAlive)
8. `onRenderTracked` & `onRenderTriggered` (Debugging)
9. Urutan Eksekusi & Aturan Penting
10. Akses DOM & `nextTick`
11. Memory Leak & Cleanup Wajib
12. Studi Kasus — Fetch Data + setInterval Cleanup
13. Jebakan Umum Pemula di Bab 9
14. Ringkasan & Latihan Mandiri

---

## 🔭 1. Mengapa Perlu Lifecycle Hooks?

Tanpa lifecycle hooks, kita tidak tahu **kapan** DOM sudah siap atau **kapan** komponen akan hilang. Beberapa kebutuhan konkret:

| Kebutuhan | Hook yang Tepat |
| --- | --- |
| Ambil data dari API saat halaman dibuka | `onMounted` |
| Inisialisasi chart (Chart.js, dll) yang butuh elemen DOM | `onMounted` |
| Pasang `window` event listener | `onMounted` (pasang) + `onUnmounted` (lepas) |
| Jalankan `setInterval` / `setTimeout` berulang | `onMounted` (mulai) + `onUnmounted` (clear) |
| React saat data berubah sebelum DOM update | `onBeforeUpdate` |
| Akses DOM setelah update selesai | `onUpdated` |
| Bersihkan subscription / koneksi | `onBeforeUnmount` / `onUnmounted` |

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const films = ref([])

// Hook: saat komponen sudah di DOM → ambil data
onMounted(async () => {
  films.value = await fetchFilms()
})
</script>
```

---

## 🌳 2. Diagram Lengkap Lifecycle Vue 3

```
                         KOMPONEN DIBUAT
                                │
                                ▼
                         setup()  ◀── Composition API mulai di sini
                          (semua ref/reactive dibuat)
                                │
                                ▼
                    ┌───────────────────────┐
                    │   onBeforeMount()     │  ← SEBELUM DOM dibuat
                    │   (DOM belum ada)     │     template belum dirender
                    └───────────┬───────────┘
                                │  Vue merender template → DOM
                                ▼
                    ┌───────────────────────┐
                    │     onMounted()       │  ✅ KOMPONEN SUDAH DI DOM
                    │  (akses DOM, fetch,   │     tempat terbaik utk:
                    │   init lib, interval) │     fetch, init, listener
                    └───────────┬───────────┘
                                │
                ┌───────────────┴───────────────┐
                │  Ada perubahan reactive state? │
                └───────────────┬───────────────┘
                        TIDAK   │   YA
                          │     │
                          │     ▼
                          │  ┌───────────────────────┐
                          │  │   onBeforeUpdate()    │  ← SEBELUM DOM diupdate
                          │  │  (DOM lama masih ada) │     bisa sync state lain
                          │  └───────────┬───────────┘
                          │              │  Vue patch DOM
                          │              ▼
                          │  ┌───────────────────────┐
                          │  │     onUpdated()       │  ← SETELAH DOM diupdate
                          │  │  (DOM baru tersedia)  │  ⚠️ hati-2 infinite loop
                          │  └───────────┬───────────┘
                          │              │
                          └──────────────┼──────────────┐
                                         │
                                Ada perintah unmount?
                                         │ YA
                                         ▼
                    ┌───────────────────────┐
                    │  onBeforeUnmount()    │  ← SEBELUM dihancurkan
                    │  (masih ada di DOM)   │     last chance cleanup
                    └───────────┬───────────┘
                                │  Vue hapus dari DOM
                                ▼
                    ┌───────────────────────┐
                    │    onUnmounted()      │  ✅ KOMPONEN HILANG
                    │  (sudah tidak ada)    │     semua cleanup selesai
                    └───────────────────────┘
```

> 💡 **Ingat urutan:** `setup` → `onBeforeMount` → `onMounted` → (loop `onBeforeUpdate`/`onUpdated` tiap data berubah) → `onBeforeUnmount` → `onUnmounted`. Semua hook diimpor dari `'vue'` dan **hanya boleh dipanggil di top-level `<script setup>`** (bukan di dalam fungsi/callback biasa).

---

## 🟢 3. `onBeforeMount` & `onMounted`

### 3.1 `onBeforeMount` — Sebelum DOM Dibuat

Dipanggil **tepat sebelum** komponen dirender ke DOM. Pada titik ini, **template belum di-render**, jadi kamu **tidak bisa** mengakses elemen DOM.

```vue
<script setup>
import { ref, onBeforeMount } from 'vue'

const data = ref(null)

onBeforeMount(() => {
  // DOM belum ada → jangan akses this.$el / document.querySelector
  console.log('Komponen akan di-mount, DOM belum siap')
  // Bisa lakukan persiapan state, tapi fetch biasanya di onMounted
})
</script>
```

**Kapan dipakai:** Jarang untuk pemula. Kadang untuk menyiapkan state yang butuh diproses sebelum render pertama, atau sync data ke server-side rendering (SSR) context.

### 3.2 `onMounted` — Komponen Sudah di DOM ✅

Dipanggil **setelah** komponen dirender & dipasang ke DOM. Ini **hook paling sering dipakai**.

```vue
<script setup>
import { ref, onMounted } from 'vue'

const films     = ref([])
const isLoading = ref(true)
const container = ref(null)   // template ref ke elemen DOM

onMounted(async () => {
  // ✅ DOM sudah ada → aman fetch data, akses DOM, init library
  try {
    films.value = await fetchTrending()
  } finally {
    isLoading.value = false
  }

  // Akses elemen DOM via template ref
  console.log('Tinggi container:', container.value?.offsetHeight)
})
</script>

<template>
  <div ref="container">
    <p v-if="isLoading">⏳ Memuat...</p>
    <ul v-else>
      <li v-for="f in films" :key="f.id">{{ f.title }}</li>
    </ul>
  </div>
</template>
```

**Kegunaan umum `onMounted`:**
- Fetch data awal dari API.
- Inisialisasi library yang butuh DOM (Chart.js, Google Maps, dll).
- Memasang event listener global (`window`, `document`).
- Memulai timer (`setInterval`).

> 💡 **Aturan:** Apa pun yang butuh elemen DOM atau data dari server → letakkan di `onMounted`. Jangan di `setup` top-level (DOM belum ada saat itu).

---

## 🔄 4. `onBeforeUpdate` & `onUpdated`

Dipanggil saat **state reaktif berubah** dan menyebabkan re-render.

### 4.1 `onBeforeUpdate` — Sebelum DOM Diupdate

```vue
<script setup>
import { ref, onBeforeUpdate } from 'vue'

const count = ref(0)

onBeforeUpdate(() => {
  // DOM LAMA masih ada di sini
  console.log('State berubah, DOM akan di-update')
  // Bisa sync state lain SEBELUM patch terjadi
})
</script>
```

### 4.2 `onUpdated` — Setelah DOM Diupdate ⚠️

```vue
<script setup>
import { ref, onUpdated } from 'vue'

const count = ref(0)

onUpdated(() => {
  // DOM BARU sudah tersedia
  console.log('DOM selesai di-update, count =', count.value)
})
</script>
```

> ⚠️ **BAHAYA INFINITE LOOP!** Jangan mengubah state reaktif di dalam `onUpdated` yang memicu re-render lagi → loop tak berujung!

```vue
<script setup>
import { ref, onUpdated } from 'vue'
const count = ref(0)

// ❌ SALAH — onUpdated mengubah count → re-render → onUpdated lagi → loop!
onUpdated(() => {
  count.value++    // MEMICU re-render → onUpdated dipanggil lagi → LOOP!
})

// ✅ BENAR — guard dengan kondisi, atau pindahkan ke watch
onUpdated(() => {
  if (count.value > 100) return   // hindari loop
  // aksi yang TIDAK memicu re-render (misal manipulasi DOM langsung)
})
</script>
```

**Kapan pakai `onUpdated`?** Sangat jarang. Biasanya untuk **sinkronisasi DOM pihak ketiga** (misal update posisi chart) setelah Vue selesai render. Untuk merespons perubahan data, **lebih baik pakai `watch`** (Bab 6) karena lebih presisi & tidak berisiko loop.

---

## 🔴 5. `onBeforeUnmount` & `onUnmounted`

Ini pasangan paling krusial untuk **mencegah memory leak**.

### 5.1 `onBeforeUnmount` — Terakhir Kali di DOM

```vue
<script setup>
import { ref, onBeforeUnmount } from 'vue'

const intervalId = ref(null)

onBeforeUnmount(() => {
  // Komponen masih ada di DOM
  // Last chance untuk cleanup
  if (intervalId.value) clearInterval(intervalId.value)
})
</script>
```

### 5.2 `onUnmounted` — Komponen Sudah Hilang ✅

```vue
<script setup>
import { onUnmounted } from 'vue'

onUnmounted(() => {
  // Komponen SUDAH dihapus dari DOM
  // Semua cleanup seharusnya sudah selesai di onBeforeUnmount
  console.log('Komponen dibuang, semua bersih')
})
</script>
```

**Apa saja yang WAJIB dibersihkan:**
- `setInterval` / `setTimeout` yang belum selesai → `clearInterval` / `clearTimeout`.
- `addEventListener` (window/document) → `removeEventListener`.
- WebSocket / EventSource subscription → `.close()`.
- IntersectionObserver / ResizeObserver → `.disconnect()`.
- Library pihak ketiga instance → `.destroy()`.

> ⚠️ **Memory Leak adalah Bug Tersembunyi yang Berbahaya!**
> Jika `setInterval` tidak dibersihkan saat komponen di-unmount, ia **terus berjalan di memori** meski komponen tak tampak. Buka-tutup komponen berkali-kali → puluhan interval menumpuk → aplikasi melambat & memori bengkak. Selalu cleanup di `onUnmounted`/`onBeforeUnmount`!

---

## 🪲 6. `onErrorCaptured` — Menangkap Error

Hook ini dipanggil ketika **child component** melempar error (saat render, lifecycle hook, atau event handler). Berguna membuat **Error Boundary** sederhana.

```vue
<script setup>
import { ref, onErrorCaptured } from 'vue'

const error = ref(null)

// Tangkap error dari child components
onErrorCaptured((err, instance, info) => {
  error.value = err.message
  console.error('Error dari child:', err, 'info:', info)

  // Return false → hentikan error agar tidak propagate ke atas
  return false
})
</script>

<template>
  <div v-if="error" class="error-banner">
    ⚠️ Terjadi error: {{ error }}
  </div>
  <slot />   <!-- child dirender di sini -->
</template>
```

> 💡 **Catatan:** `onErrorCaptured` menangkap error dari **descendant**, bukan error di komponen itu sendiri. Untuk error global, gunakan `app.config.errorHandler`.

---

## 💤 7. `onActivated` & `onDeactivated` (KeepAlive)

Vue mendukung `<KeepAlive>` untuk **menyimpan state komponen** saat di-switch, alih-alih di-unmount. Dua hook ini khusus untuk komponen di dalam `<KeepAlive>`.

```vue
<script setup>
import { onActivated, onDeactivated } from 'vue'

// Dipanggil saat komponen diaktifkan kembali (dari cache)
onActivated(() => {
  console.log('Komponen aktif kembali — lanjutkan timer/data')
})

// Dipanggil saat komponen dinonaktifkan (disimpan ke cache, BUKAN dihancurkan)
onDeactivated(() => {
  console.log('Komponen disimpan ke cache — pause timer sementara')
})
</script>
```

```vue
<!-- Parent -->
<template>
  <KeepAlive>
    <component :is="tabAktif" />   <!-- state komponen tetap saat ganti tab -->
  </KeepAlive>
</template>
```

> 💡 **Perbedaan:** Tanpa `KeepAlive`, ganti komponen = `onUnmounted`. Dengan `KeepAlive`, ganti komponen = `onDeactivated` (state disimpan), dan saat kembali = `onActivated`.

---

## 🐞 8. `onRenderTracked` & `onRenderTriggered` (Debugging)

Dua hook ini **hanya untuk debugging** — membantu kamu tahu dependency mana yang memicu re-render.

```vue
<script setup>
import { ref, onRenderTracked, onRenderTriggered } from 'vue'

const count = ref(0)

// Dipanggil saat dependency DI-LACAK (saat render pertama)
onRenderTracked((event) => {
  console.log('Dependency dilacak:', event.key, event.target)
})

// Dipanggil saat dependency BERUBAH & memicu re-render
onRenderTriggered((event) => {
  console.log('Re-render dipicu oleh:', event.key, 'dari', event.oldValue, 'ke', event.newValue)
})
</script>
```

> ⚠️ **Jangan pakai di production.** Hook ini sangat verbose dan hanya untuk memahami alur reaktivitas saat development.

---

## 📐 9. Urutan Eksekusi & Aturan Penting

```vue
<script setup>
import { ref, onBeforeMount, onMounted, onBeforeUpdate,
         onUpdated, onBeforeUnmount, onUnmounted } from 'vue'

// setup berjalan PERTAMA (saat script dieksekusi)
console.log('1. setup (top-level script)')

onBeforeMount(() => console.log('2. onBeforeMount'))
onMounted(()    => console.log('3. onMounted'))

onBeforeUpdate(() => console.log('4. onBeforeUpdate (tiap perubahan)'))
onUpdated(()     => console.log('5. onUpdated (tiap perubahan)'))

onBeforeUnmount(() => console.log('6. onBeforeUnmount'))
onUnmounted(()    => console.log('7. onUnmounted'))
</script>
```

**Aturan emas:**
1. Hook **hanya boleh dipanggil di top-level** `<script setup>`, bukan di dalam fungsi lain atau `if` yang tidak pasti jalan.
2. Urutan mount: `setup` → `onBeforeMount` → `onMounted`.
3. Tiap perubahan state: `onBeforeUpdate` → `onUpdated`.
4. Unmount: `onBeforeUnmount` → `onUnmounted`.
5. Untuk child dalam parent: child mount **sebelum** parent mount selesai (child dulu, parent kemudian). Unmount kebalikannya (child dulu).

---

## ⏭️ 10. Akses DOM & `nextTick`

Kadang setelah mengubah state, kamu butuh menunggu **DOM selesai di-update** sebelum membaca/memanipulasinya. Gunakan `nextTick`.

```vue
<script setup>
import { ref, nextTick } from 'vue'

const pesan = ref('Halo')
const el    = ref(null)

async function ubahDanBaca() {
  pesan.value = 'Baru'

  // ❌ SALAH — DOM belum di-update, el masih tampil 'Halo' lama
  console.log(el.value.textContent)   // mungkin masih 'Halo'

  // ✅ BENAR — tunggu DOM update
  await nextTick()
  console.log(el.value.textContent)   // sekarang 'Baru' ✅
}
</script>

<template>
  <p ref="el">{{ pesan }}</p>
  <button @click="ubahDanBaca">Ubah & Baca</button>
</template>
```

> 💡 **`nextTick`** mengembalikan Promise yang resolve setelah Vue selesai mem-patch DOM. Sangat berguna untuk mengukur ulang elemen, mem-fokuskan input, atau scroll setelah data berubah.

---

## 🧹 11. Memory Leak & Cleanup Wajib

Mari lihat contoh lengkap mengapa cleanup penting, dan apa yang terjadi jika dilupakan.

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const pesan = ref('')
let timer = null
let handler = null

onMounted(() => {
  // ① Interval yang harus dibersihkan
  timer = setInterval(() => {
    console.log('tick', new Date())
  }, 1000)

  // ② Event listener global yang harus dilepas
  handler = (e) => console.log('resize', e)
  window.addEventListener('resize', handler)
})

// ❌ TANPA cleanup → memory leak!
// onUnmounted tidak ada → interval & listener terus jalan

// ✅ DENGAN cleanup
onUnmounted(() => {
  clearInterval(timer)                 // hentikan interval
  window.removeEventListener('resize', handler)  // lepas listener
})
</script>
```

**Checklist cleanup:**

| Yang Dibuat di `onMounted` | Yang Dibersihkan di `onUnmounted` |
| --- | --- |
| `setInterval(fn, ms)` | `clearInterval(id)` |
| `setTimeout(fn, ms)` | `clearTimeout(id)` (jika belum jalan) |
| `window.addEventListener(...)` | `window.removeEventListener(...)` |
| `document.addEventListener(...)` | `document.removeEventListener(...)` |
| `new WebSocket(url)` | `ws.close()` |
| `new EventSource(url)` | `es.close()` |
| `new Chart(ctx, ...)` | `chart.destroy()` |
| `observer = new IntersectionObserver(...)` | `observer.disconnect()` |

---

## 🎬 12. Studi Kasus — Fetch Data + setInterval Cleanup

Studi kasus lengkap menggabungkan `onMounted` (fetch + interval) dan `onUnmounted` (cleanup) — pola nyata yang akan kamu pakai berulang di project Netflix clone.

```vue
<!-- TrendingFilms.vue -->
<script setup>
import { ref, onMounted, onUnmounted, onErrorCaptured } from 'vue'

// ── STATE ──
const films     = ref([])
const isLoading = ref(true)
const error     = ref(null)
let   intervalId = null          // simpan id agar bisa di-clear

// ── onErrorCaptured: tangkap error fetch child ──
onErrorCaptured((err) => {
  error.value = err.message
  return false
})

// ── onMounted: fetch awal + mulai auto-refresh ──
onMounted(async () => {
  try {
    // Ambil data tren saat komponen pertama kali tampil
    films.value = await fetchTrendingMovies()

    // Auto-refresh tiap 5 menit (300.000 ms)
    intervalId = setInterval(async () => {
      films.value = await fetchTrendingMovies()
    }, 5 * 60 * 1000)

  } catch (e) {
    error.value = e.message
  } finally {
    isLoading.value = false
  }
})

// ── onUnmounted: BERSIHKAN interval → cegah memory leak ──
onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)    // ✅ kritis!
    intervalId = null
  }
  console.log('TrendingFilms dibuang, interval dibersihkan ✅')
})
</script>

<template>
  <section>
    <h2>🔥 Film Trending</h2>

    <p v-if="isLoading">⏳ Memuat film trending...</p>
    <p v-else-if="error" class="error">❌ {{ error }}</p>

    <ul v-else class="grid">
      <li v-for="film in films" :key="film.id" class="kartu">
        <img :src="film.poster" :alt="film.title" />
        <h3>{{ film.title }}</h3>
        <span>⭐ {{ film.rating }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.grid { display: flex; gap: 16px; flex-wrap: wrap; list-style: none; padding: 0; }
.kartu { width: 160px; }
.kartu img { width: 100%; border-radius: 8px; }
.error { color: #dc2626; }
</style>
```

**Mengapa pola ini penting?**

```
User buka halaman → onMounted jalan:
   ✓ fetch film tren
   ✓ mulai interval 5 menit

User pindah halaman (route berubah) → onUnmounted jalan:
   ✓ clearInterval → interval BERHENTI
   ✓ tidak ada leak meski user bolak-balik halaman
```

> 🎯 **Jika lupa cleanup:** Setiap kali user buka halaman ini, interval baru dibuat. Setelah 10x buka, ada 10 interval jalan bersamaan → fetch API 10x lebih sering → quota habis & aplikasi lemot. **Cleanup itu wajib, bukan opsional.**

---

## 🚨 13. Jebakan Umum Pemula di Bab 9

### ❌ Jebakan 1 — Akses DOM di `onBeforeMount` / `setup`

```javascript
// ❌ SALAH — DOM belum ada
onBeforeMount(() => {
  document.querySelector('.el').textContent = 'X'   // null!
})

// ✅ BENAR — akses di onMounted
onMounted(() => {
  document.querySelector('.el').textContent = 'X'
})
```

### ❌ Jebakan 2 — Lupa Cleanup (Memory Leak)

```javascript
// ❌ SALAH — interval tidak dibersihkan
onMounted(() => {
  setInterval(() => console.log('tick'), 1000)
})
// komponen di-unmount → interval tetap jalan!

// ✅ BENAR
let id = null
onMounted(() => { id = setInterval(() => console.log('tick'), 1000) })
onUnmounted(() => clearInterval(id))
```

### ❌ Jebakan 3 — Infinite Loop di `onUpdated`

```javascript
// ❌ SALAH — mengubah state di onUpdated → re-render → loop
onUpdated(() => { count.value++ })

// ✅ BENAR — gunakan watch untuk reaksi data
import { watch } from 'vue'
watch(count, () => { /* aksi aman */ })
```

### ❌ Jebakan 4 — Memanggil Hook di Dalam Fungsi

```javascript
// ❌ SALAH — hook harus di top-level script setup
function mulai() {
  onMounted(() => { ... })    // TIDAK akan terpasang dengan benar
}

// ✅ BENAR — langsung di top-level
onMounted(() => { ... })
```

### ❌ Jebakan 5 — Fetch di `setup` Tanpa Menunggu (Race/SSR)

```javascript
// ❌ SALAH (kadang) — fetch di setup tanpa nextTick, DOM belum siap untuk efek samping
const data = await fetchData()   // top-level await di setup (Vue 3.3+)
// lebih aman letakkan di onMounted untuk akses DOM

// ✅ BENAR — fetch di onMounted bila butuh DOM
onMounted(async () => { data.value = await fetchData() })
```

---

## 🧪 14. Lifecycle untuk Setiap Hook (Contoh Nyata Lengkap)

Mari lihat **satu contoh komprehensif** yang memakai hampir semua hook sekaligus — pola komponen "dashboard widget".

```vue
<script setup>
import { ref, onBeforeMount, onMounted, onBeforeUpdate,
         onUpdated, onBeforeUnmount, onUnmounted, onErrorCaptured } from 'vue'

const data     = ref([])
const lebar    = ref(0)
let   resizeHandler = null
let   intervalId    = null

// 1. Persiapan (DOM belum ada)
onBeforeMount(() => console.log('[hook] beforeMount'))

// 2. DOM siap → fetch + listener + interval
onMounted(() => {
  console.log('[hook] mounted — DOM ready')
  fetchData()

  resizeHandler = () => { lebar.value = window.innerWidth }
  window.addEventListener('resize', resizeHandler)

  intervalId = setInterval(fetchData, 30000)
})

// 3. Sebelum update (DOM lama)
onBeforeUpdate(() => console.log('[hook] beforeUpdate'))

// 4. Setelah update (DOM baru) — jangan ubah state!
onUpdated(() => console.log('[hook] updated — DOM baru'))

// 5. Sebelum dihancurkan → cleanup
onBeforeUnmount(() => {
  console.log('[hook] beforeUnmount — cleanup')
  clearInterval(intervalId)
  window.removeEventListener('resize', resizeHandler)
})

// 6. Sudah dihancurkan
onUnmounted(() => console.log('[hook] unmounted'))

// 7. Tangkap error child
onErrorCaptured((err) => {
  console.error('Error tertangkap:', err)
  return false
})

async function fetchData() {
  data.value = await api.getWidgetData()
}
</script>
```

**Ringkasan alur:** `beforeMount → mounted (fetch+listener+interval) → [update berulang] → beforeUnmount (cleanup) → unmounted`.

---

## 🌐 15. `onServerPrefetch` & Lifecycle di SSR

Untuk aplikasi Server-Side Rendering (Nuxt), ada hook tambahan: `onServerPrefetch` — menjalankan async di server sebelum render HTML dikirim.

```vue
<script setup>
import { ref, onServerPrefetch, onMounted } from 'vue'

const data = ref(null)

// Di server: tunggu data siap SEBELUM HTML dikirim (SEO friendly)
onServerPrefetch(async () => {
  data.value = await fetchData()
})

// Di client (hydration): jika belum ada, fetch ulang
onMounted(async () => {
  if (!data.value) data.value = await fetchData()
})
</script>
```

> 💡 **SSR di luar scope bab ini**, tapi penting tahu bahwa lifecycle di server berbeda. `onServerPrefetch` memastikan data sudah ada saat HTML pertama dikirim (penting untuk SEO & performa pertama).

---

## ⏱️ 16. `async setup` & Lifecycle

Vue 3.3+ mendukung `await` di top-level `<script setup>` (top-level await). Ini setara dengan `onServerPrefetch` + menyisipkan sebelum `onMounted`.

```vue
<script setup>
import { ref, onMounted } from 'vue'

// Top-level await — komponen "ditunda" sampai selesai
const data = await fetchInitialData()

const count = ref(0)

onMounted(() => {
  console.log('Data sudah siap:', data)
})
</script>
```

> ⚠️ **Perhatian:** Top-level await membuat komponen menjadi **async** — parent yang membungkusnya harus mendukung (Suspense). Untuk pemula, cukup fetch di `onMounted` agar lebih mudah dipahami.

---

## 🔀 17. Transition Hooks (Berhubungan dengan Lifecycle)

Saat menggunakan `<Transition>`, ada hook terkait lifecycle animasi: `onBeforeEnter`, `onEnter`, `onAfterEnter`, `onLeave`, dll.

```vue
<script setup>
import { ref, onBeforeEnter, onEnter, onAfterLeave } from 'vue'

const show = ref(false)

// Hook saat elemen akan masuk (transition)
onBeforeEnter((el) => { el.style.opacity = 0 })
onEnter((el, done) => {
  el.style.transition = 'opacity 0.5s'
  el.style.opacity = 1
  done()   // panggil saat selesai
})
onAfterLeave(() => console.log('Animasi keluar selesai'))
</script>

<template>
  <Transition>
    <p v-if="show">Halo dengan animasi</p>
  </Transition>
</template>
```

> 💡 **Ini bukan lifecycle komponen inti**, tapi sering membingungkan pemula karena namanya mirip. Gunakan saat butuh kontrol animasi JS (bukan CSS transition biasa).

---

## 📋 18. Checklist Lifecycle untuk Production

```
SEBELUM RILIS, PASTIKAN:
☑ Setiap setInterval/setTimeout dibersihkan di onUnmounted
☑ Setiap addEventListener dipasangkan removeEventListener
☑ Setiap WebSocket/EventSource di-close
☑ Setiap observer (.disconnect())
☑ Fetch dibatalkan (AbortController) saat unmount
☑ Tidak ada perubahan state di onUpdated (anti infinite loop)
☑ Akses DOM hanya di onMounted/onUpdated (bukan setup/beforeMount)
☑ Library pihak ketiga di-destroy() saat unmount
```

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const controller = new AbortController()   // untuk batalkan fetch
let timer = null
let handler = null

onMounted(() => {
  // Fetch dengan signal agar bisa dibatalkan
  fetch('/api/data', { signal: controller.signal })

  timer = setInterval(() => {}, 1000)
  handler = () => {}
  window.addEventListener('resize', handler)
})

onUnmounted(() => {
  controller.abort()              // batalkan fetch yang masih jalan
  clearInterval(timer)
  window.removeEventListener('resize', handler)
})
</script>
```

---

## 📊 19. Options API vs Composition API (Lifecycle)

Agar bisa membaca kode lama:

| Options API | Composition API |
| --- | --- |
| `beforeCreate` | (sebelum `setup`, tidak perlu) |
| `created` | (langsung di `setup`) |
| `beforeMount` | `onBeforeMount()` |
| `mounted` | `onMounted()` |
| `beforeUpdate` | `onBeforeUpdate()` |
| `updated` | `onUpdated()` |
| `beforeUnmount` | `onBeforeUnmount()` |
| `unmounted` | `onUnmounted()` |
| `errorCaptured` | `onErrorCaptured()` |
| `activated` | `onActivated()` |
| `deactivated` | `onDeactivated()` |

```vue
<!-- OPTIONS API -->
<script>
export default {
  mounted() { this.loadData() },
  beforeUnmount() { clearInterval(this.timer) },
}
</script>

<!-- COMPOSITION API -->
<script setup>
import { onMounted, onUnmounted } from 'vue'
onMounted(() => loadData())
onUnmounted(() => clearInterval(timer))
</script>
```

---

## 🎯 20. Latihan Pemahaman Cepat (Self-Test)

```
SOAL 1: Di mana letakkan fetch data awal?
JAWABAN: onMounted (DOM & komponen sudah siap).

SOAL 2: Di mana membersihkan setInterval?
JAWABAN: onUnmounted / onBeforeUnmount.

SOAL 3: Apa bahaya mengubah state di onUpdated?
JAWABAN: Infinite loop (re-render terus menerus).

SOAL 4: Hook apa yang dipakai komponen dalam <KeepAlive>?
JAWABAN: onActivated & onDeactivated.

SOAL 5: Bolehkah panggil onMounted di dalam fungsi?
JAWABAN: TIDAK. Harus di top-level <script setup>.
```

---

## 🖼️ 21. Lifecycle & Chart/Canvas Library (Studi Kasus)

Library seperti Chart.js butuh **elemen DOM sungguhan** untuk diinisialisasi — tempat sempurna untuk `onMounted` + cleanup di `onUnmounted`.

```vue
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Chart from 'chart.js/auto'

const canvasEl = ref(null)
let chartInstance = null

onMounted(() => {
  // ✅ DOM sudah ada → init chart
  chartInstance = new Chart(canvasEl.value, {
    type: 'bar',
    data: {
      labels: ['A', 'B', 'C'],
      datasets: [{ label: 'Penjualan', data: [10, 20, 15] }],
    },
  })
})

onBeforeUnmount(() => {
  // ✅ Hentikan chart agar tidak leak memory
  if (chartInstance) chartInstance.destroy()
})
</script>

<template>
  <canvas ref="canvasEl"></canvas>
</template>
```

> ⚠️ **Penting:** Library pihak ketiga yang mengikat ke DOM **wajib di-destroy** saat unmount. Jika lupa, instance chart menumpuk tiap buka halaman → memory bengkak & error canvas.

---

## 📡 22. Lifecycle & WebSocket (Real-time)

Koneksi WebSocket harus dibuka & ditutup dengan benar.

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const pesan = ref([])
let ws = null

onMounted(() => {
  // Buka koneksi saat komponen aktif
  ws = new WebSocket('wss://api.contoh.com/stream')

  ws.onmessage = (event) => {
    pesan.value.push(JSON.parse(event.data))
  }
})

onUnmounted(() => {
  // Tutup koneksi saat komponen dibuang → cegah leak koneksi
  if (ws) ws.close()
})
</script>

<template>
  <ul>
    <li v-for="(p, i) in pesan" :key="i">{{ p.teks }}</li>
  </ul>
</template>
```

---

## 🎯 23. Pola Umum: "Init di Mount, Cleanup di Unmount"

Ini template yang akan kamu tulis berkali-kali. Hafalkan polanya.

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Deklarasikan variabel di luar hook agar bisa diakses cleanup
let resource1 = null
let resource2 = null

onMounted(() => {
  // 1. Buka/mulai resource
  resource1 = mulaiSesuatu()
  resource2 = pasangListener()
})

onUnmounted(() => {
  // 2. Tutup/bersihkan resource (urutan bisa kebalikan)
  if (resource2) lepasListener(resource2)
  if (resource1) hentikanSesuatu(resource1)
})
</script>
```

> 💡 **Mental model:** Apa pun yang kamu **buka/mulai** di `onMounted`, harus kamu **tutup/bersihkan** di `onUnmounted`. Ini hukum emas mencegah memory leak.

---

## 🐢 24. Lifecycle & Performa: Jangan Berat di Mount

`onMounted` sering jadi tempat kerja berat. Tips menjaganya tetap mulus:

```
✅ LAKUKAN di onMounted:
   • Fetch data (async, tidak block UI lama)
   • Init library setelah data siap
   • Pasang listener

❌ HINDARI di onMounted:
   • Loop komputasi berat (pindahkan ke Web Worker)
   • Render ribuan elemen sekaligus (pakai virtual scroll)
   • Operasi sinkron yang memblock main thread > 100ms
```

```vue
<script setup>
import { ref, onMounted } from 'vue'

const films = ref([])

onMounted(async () => {
  // ✅ Fetch async → UI tetap responsif (tidak block)
  films.value = await fetchFilms()
  // ✅ Proses setelah data ada
  console.log('Film dimuat:', films.value.length)
})
</script>
```

---

## 🧪 25. Latihan Debugging: Temukan Bug Lifecycle

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const hitungan = ref(0)
let id = null

onMounted(() => {
  id = setInterval(() => {
    hitungan.value++   // counter naik tiap detik
  }, 1000)
})

// ❌ BUG: lupa onUnmounted → interval terus jalan!
// onUnmounted(() => clearInterval(id))
</script>

<template>
  <p>{{ hitungan }}</p>
</template>
```

**Pertanyaan:** Jika komponen ini di-unmount dan di-mount ulang 5 kali, berapa interval yang jalan?
**Jawaban:** 5 interval! (karena tidak ada cleanup). Setiap mount membuat interval baru yang tak pernah dihentikan. Perbaiki dengan menambahkan `onUnmounted(() => clearInterval(id))`.

---

## ⏱️ 26. Lifecycle dengan `setTimeout` & Race Condition

Skenario umum: fetch data dengan delay, tapi user sudah pindah halaman. Gunakan `AbortController` + cleanup.

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const data = ref(null)
const controller = new AbortController()

onMounted(async () => {
  try {
    const res = await fetch('/api/slow', { signal: controller.signal })
    data.value = await res.json()
  } catch (e) {
    if (e.name !== 'AbortError') console.error(e)
  }
})

onUnmounted(() => {
  // Batalkan fetch yang masih berjalan saat komponen dibuang
  controller.abort()
})
</script>
```

> ⚠️ **Tanpa `controller.abort()`**, fetch lambat bisa menyelesaikan SETELAH komponen di-unmount → mencoba update `data.value` pada instance yang sudah mati (warning Vue). Selalu batalkan.

---

## 🧭 27. Urutan Lifecycle Antara Parent & Child

Sering membingungkan: saat parent punya child, hook mana yang jalan duluan?

```
MOUNT (Parent render → Child render):
  Parent: setup
  Parent: onBeforeMount
    → Child: setup
    → Child: onBeforeMount
    → Child: onMounted      ← CHILD mount DULU
  Parent: onMounted         ← lalu PARENT mount

UPDATE:
  Parent: onBeforeUpdate
    → Child: onBeforeUpdate
    → Child: onUpdated
  Parent: onUpdated

UNMOUNT:
  Parent: onBeforeUnmount
    → Child: onBeforeUnmount
    → Child: onUnmounted
  Parent: onUnmounted
```

> 💡 **Aturan:** Child selalu **lebih dulu** menyelesaikan mount/unmount dibanding parent. Ini masuk akal: parent butuh child-nya sudah ada di DOM sebelum parent "selesai".

---

## 📋 28. Checklist Production (Final)

Sebelum rilis, pastikan komponenmu:

```
☑ onMounted: fetch data, init library, pasang listener, mulai timer
☑ onUnmounted: clearInterval, removeEventListener, ws.close(), chart.destroy()
☑ Tidak ada perubahan state di onUpdated (anti loop)
☑ Akses DOM hanya di onMounted/onUpdated (bukan setup)
☑ Fetch dibatalkan (AbortController) saat unmount
☑ Watch dibersihkan (jika pakai onCleanup) saat tidak perlu
☑ Tidak ada top-level await tanpa dukungan Suspense
☑ Error ditangkap (onErrorCaptured) untuk komponen kritis
```

---

## 📖 29. Glosarium Lifecycle

| Istilah | Arti |
| --- | --- |
| **Lifecycle** | Tahapan hidup komponen (setup→mount→update→unmount) |
| **Hook** | Fungsi yang dijalankan pada momen tertentu dalam lifecycle |
| **`onMounted`** | Setelah komponen di DOM (fetch, init, listener) |
| **`onUpdated`** | Setelah re-render (hati-2 infinite loop) |
| **`onUnmounted`** | Setelah dihancurkan (cleanup wajib) |
| **Memory leak** | Resource tak dibersihkan → memori bocor |
| **`nextTick`** | Tunggu DOM selesai di-patch |
| **`KeepAlive`** | Simpan state komponen (pakai onActivated/onDeactivated) |
| **`onErrorCaptured`** | Tangkap error dari child component |
| **`AbortController`** | Batalkan fetch yang masih berjalan |

---

## 🔭 30. Melihat ke Depan

Lifecycle adalah jembatan antara reaktivitas (Bab 5) dan efek samping dunia nyata:

- **Bab 10+ (Options API):** Hook di sini (`onMounted`) setara `mounted()` di Options API.
- **Bab 14 (Composables):** Logika lifecycle sering dipindah ke composable yang dipakai ulang (`useFetch` punya `onMounted` sendiri).
- **Bab 17 (Router):** Navigasi antar halaman memicu mount/unmount komponen view → lifecycle krusial untuk fetch & cleanup.
- **Bab 19 (Pinia):** Mengambil data store sering dilakukan di `onMounted`.

> 💡 **Pesan penutup:** Lifecycle bukan sekadar "tempat naruh kode". Ia mengajarkan tanggung jawab: **mulai saat mount, bersihkan saat unmount**. Disiplin ini membedakan aplikasi yang stabil dari aplikasi yang lambat karena memory leak.

---

## 🎯 31. Quiz Singkat Lifecycle

```
1. Di mana fetch data awal? → onMounted.
2. Di mana bersihkan setInterval? → onUnmounted.
3. Bahaya ubah state di onUpdated? → infinite loop.
4. Hook untuk komponen KeepAlive? → onActivated / onDeactivated.
5. Boleh panggil onMounted di dalam fungsi? → TIDAK (top-level saja).
6. nextTick berguna untuk? → akses DOM setelah update selesai.
7. onBeforeMount bisa akses DOM? → TIDAK (DOM belum ada).
8. Memory leak karena? → lupa cleanup interval/listener saat unmount.
9. Child mount sebelum atau sesudah parent? → SEBELUM parent.
10. onErrorCaptured menangkap error dari? → descendant (child) component.
```

---

## ⏱️ 32. Contoh Lengkap: Komponen Timer dengan Cleanup Sempurna

Komponen timer yang menunjukkan **seberapa penting** lifecycle cleanup — lengkap dengan start/pause/reset.

```vue
<!-- Timer.vue -->
<script setup>
import { ref, onMounted, onUnmounted, onBeforeUnmount } from 'vue'

const detik   = ref(0)
const berjalan = ref(false)
let intervalId = null

// Mulai timer
function mulai() {
  if (berjalan.value) return
  berjalan.value = true
  // Interval hanya dibuat saat berjalan
  intervalId = setInterval(() => detik.value++, 1000)
}

// Jeda timer (tapi KOMPONEN masih ada)
function jeda() {
  berjalan.value = false
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

// Reset
function reset() {
  jeda()
  detik.value = 0
}

// onMounted: otomatis mulai saat komponen tampil
onMounted(() => {
  console.log('Timer di-mount')
  mulai()
})

// onBeforeUnmount: PASTIKAN interval dibersihkan
onBeforeUnmount(() => {
  console.log('Timer akan di-unmount, bersihkan interval')
  if (intervalId) clearInterval(intervalId)
})

// onUnmounted: konfirmasi bersih
onUnmounted(() => {
  console.log('Timer di-unmount, tidak ada leak ✅')
})
</script>

<template>
  <div class="timer">
    <h3>⏱️ {{ detik }} detik</h3>
    <button @click="mulai" :disabled="berjalan">▶ Mulai</button>
    <button @click="jeda" :disabled="!berjalan">⏸ Jeda</button>
    <button @click="reset">🔄 Reset</button>
  </div>
</template>
```

**Mengapa contoh ini penting:**

| Skenario | Yang Terjadi |
| --- | --- |
| Komponen di-mount | `onMounted` → `mulai()` → interval jalan |
| User klik Jeda | `jeda()` → `clearInterval` (interval berhenti, tapi komponen tetap ada) |
| User klik Mulai lagi | `mulai()` → interval baru dibuat |
| Komponen di-unmount | `onBeforeUnmount` → `clearInterval` → TIDAK ADA leak |

> 🎯 **Kunci:** Baik saat "jeda" maupun "unmount", interval **selalu** dibersihkan. Disiplin ini menjamin tidak ada interval liar berjalan di memori. Inilah inti pelajaran lifecycle.

---

## 📌 33. Catatan Singkat untuk Pemula

```
• Lifecycle hooks HANYA boleh di top-level <script setup>.
• Akses DOM & fetch → onMounted.
• Bersihkan SEMUANYA di onUnmounted (interval, listener, koneksi).
• Jangan ubah state di onUpdated (risiko infinite loop).
• Child selalu mount/unmount SEBELUM parent.
• Pakai nextTick bila perlu baca DOM setelah update.
• KeepAlive → pakai onActivated/onDeactivated, bukan mount/unmount.
```

> 💡 **Satu kalimat penutup:** Lifecycle mengajarkanmu **kapan** melakukan sesuatu — dan dalam pengembangan web modern, *kapan* sering lebih penting dari *apa*. Kuasai ini, dan aplikasimu akan stabil, cepat, dan bebas memory leak.

---

## 📝 Ringkasan Bab 9

| Hook | Kapan Dipanggil | Kegunaan Umum |
| --- | --- | --- |
| **`onBeforeMount`** | Sebelum DOM dirender | Persiapan state (jarang) |
| **`onMounted`** | Setelah DOM siap ✅ | Fetch data, init library, listener, timer |
| **`onBeforeUpdate`** | Sebelum re-render | Sync state sebelum patch |
| **`onUpdated`** | Setelah re-render ⚠️ | Sinkron DOM pihak ketiga (hati-2 loop) |
| **`onBeforeUnmount`** | Sebelum dihancurkan | Last-chance cleanup |
| **`onUnmounted`** | Setelah dihancurkan ✅ | Clear interval, lepas listener, close connection |
| **`onErrorCaptured`** | Saat child error | Error boundary sederhana |
| **`onActivated`** | KeepAlive diaktifkan | Lanjutkan state saat tab kembali |
| **`onDeactivated`** | KeepAlive disimpan | Pause saat tab disembunyikan |
| **`onRenderTracked`** | Dependency dilacak | Debugging saja |
| **`onRenderTriggered`** | Re-render dipicu | Debugging saja |
| **`nextTick`** | Setelah DOM di-patch | Baca/ukur DOM pasca-update |

**Aturan Emas:**
1. Hook hanya di **top-level** `<script setup>`.
2. Akses DOM & fetch → **`onMounted`**.
3. Bersihkan semua di **`onUnmounted`** → cegah memory leak.
4. Jangan ubah state di **`onUpdated`** (risiko infinite loop).

---

## 🎯 Latihan Mandiri

**⭐ Latihan 1 — Fetch Sederhana di `onMounted`**
Buat komponen yang di `onMounted` mengambil array statis (simulasi `setTimeout` 1 detik) berisi 5 film, menampilkan `isLoading` lalu list film. Pastikan data muncul setelah loading.

**⭐⭐ Latihan 2 — Jam Live dengan `setInterval` + Cleanup**
Buat komponen `JamLive` yang menampilkan waktu saat ini (di-update tiap detik via `setInterval`). Bersihkan interval di `onUnmounted`. Tambahkan tombol untuk "mount/unmount" komponen guna membuktikan cleanup bekerja (cek console tidak ada tick setelah di-unmount).

**⭐⭐⭐ Latihan 3 — `onUpdated` Aman + `nextTick`**
Buat komponen dengan `ref` teks. Saat tombol diklik, ubah teks lalu di `onUpdated` (dengan guard) cetak tinggi elemen ke console **setelah** `await nextTick()`. Buktikan tidak ada infinite loop.

**⭐⭐⭐⭐ Latihan 4 — Dashboard dengan Multi-Cleanup (Integrasi)**
Buat `Dashboard` yang di `onMounted`: (1) fetch data awal, (2) pasang `window` resize listener yang memperbarui `lebarLayar`, (3) mulai `setInterval` untuk "heartbeat" tiap 3 detik. Di `onUnmounted`, bersihkan **semua** (interval, listener, dan simulasi `AbortController` untuk fetch). Tambahkan `onErrorCaptured` yang menampilkan banner error jika fetch gagal. Kombinasikan Bab 5–9.

---

*Lanjut ke ➡️ **Bab 10 — 🏗️ Options API: Cara Klasik Vue***
