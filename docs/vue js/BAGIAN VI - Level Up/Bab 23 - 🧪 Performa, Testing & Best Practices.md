# 🧪 Bab 23 — Performa, Testing & Best Practices

> *"Kode yang berjalan bukan berarti kode yang baik. Kode yang baik adalah kode yang cepat di perangkat pengguna, aman dari bug berkat test, dan mudah dibaca oleh programmer berikutnya — termasuk dirimu sendiri enam bulan lagi."*
>

---

> **🧠 Apa Itu Performa, Testing & Best Practices?**
>
>
> Tiga pilar yang membedakan aplikasi "mainan" dengan aplikasi **produksi**:
>
> 1. **Performa** — aplikasi tetap cepat meski data & komponen bertambah. Vue menyediakan senjata seperti `v-once`, `shallowRef`, `shallowReactive`, `defineExpose`/`memo`, code-splitting via lazy route, dan virtual scrolling.
> 2. **Testing** — bukti otomatis bahwa komponen & composable melakukan apa yang dijanjikan. Kita pakai **Vitest** + **Vue Test Utils** (`mount`, `find`, `trigger`, `emitted`, `setValue`, async test, serta test composable).
> 3. **Best Practices** — struktur folder yang scalable. Kita bahas dua pendekatan: **berdasarkan tipe** (by-type) vs **berdasarkan fitur/domain** (by-feature), lengkap dengan pohon folder dan konvensi penamaan.
>

---

> **🏗️ Analogi Sederhana:**
>
>
> Bayangkan aplikasimu adalah sebuah restoran. **Performa** adalah kecepatan dapur — seberapa cepat pesanan disajikan walau antrean panjang. **Testing** adalah audit kebersihan & percobaan resep sebelum disajikan ke pelanggan, sehingga tak ada yang keracunan. **Best Practices** adalah tata letak dapur itu sendiri — alat potong di satu rak, rempah di rak lain, atau justru dikelompokkan per menu (sup, gorengan). Dapur yang berantakan membuat chef tersesat; dapur rapi membuat restoran bisa melayani ribuan pelanggan.
>

---

## 📋 Daftar Isi Bab 23

1. Mengapa Performa & Testing Penting
2. Optimasi Reaktivitas: `v-once`
3. `shallowRef` & `shallowReactive` — Reaktivitas Dangkal
4. `memo` / `v-memo` — Hindari Re-render Tidak Perlu
5. Code-Splitting via Lazy Routes (Dynamic Import)
6. Virtual Scrolling — Render Hanya yang Terlihat
7. Pengantar Testing di Vue
8. Setup Vitest + Vue Test Utils
9. `mount`, `find`, `trigger`, `emitted`, `setValue`
10. Async Test & Menunggu Update
11. Test Komponen `MovieCard` (Lengkap)
12. Test Composable `useFetch`
13. Best Practices: Struktur Folder By-Type
14. Best Practices: Struktur Folder By-Feature
15. Konvensi Penamaan File & Komponen
16. Studi Kasus — Test MovieCard + useFetch
17. Jebakan Umum Pemula di Bab 23
18. Ringkasan & Latihan Mandiri

---

## 🚀 Mengapa Performa & Testing Penting

Aplikasi kecil berjalan mulus di laptop developer. Tapi di dunia nyata:

| Masalah Nyata | Akibat | Solusi |
| --- | --- | --- |
| Ribuan film di satu list | UI lag, scroll patah-patah | Virtual scrolling, `shallowRef` |
| State besar di-render ulang terus | CPU panas, baterai boros | `v-memo`, `shallowReactive` |
| Bundle terlalu besar | Halaman lama loading | Lazy routes (code-splitting) |
| Bug lolos ke production | Pengguna marah, reputasi rusak | Automated test (Vitest) |

> 💡 **Catatan Penting:**
> Performa dan testing bukan tahap akhir yang "kalau sempat". Keduanya harus dibangun **bersamaan** dengan fitur. Aplikasi Netflix clone kita harus cepat *dan* teruji sejak awal.

---

## ⚡ Optimasi Reaktivitas: `v-once`

`v-once` memberi tahu Vue: **"render sekali saja, jangan pernah update lagi."** Cocok untuk konten statis.

```vue
<!-- Tanpa v-once: setiap re-render memeriksa teks ini -->
<template>
  <div>
    <!-- ❌ Diperiksa Vue setiap update walau tidak berubah -->
    <h1>{{ judulAplikasi }}</h1>

    <!-- ✅ Hanya dirender sekali, lalu "dibekukan" -->
    <footer v-once>
      <p>© 2024 Netflix Clone — Dibangun dengan Vue 3</p>
      <p>Versi {{ versiApp }}</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const judulAplikasi = ref('Netflix Clone')
const versiApp      = ref('1.0.0')
</script>
```

Penjelasan:

- `<footer v-once>` → Vue merender footer sekali saat mount. Setelah itu, meskipun `versiApp` berubah, footer **tidak** di-update. Penghematan render kecil tapi berarti untuk elemen statis yang sering muncul (navbar, footer, logo).

> ⚠️ **Catatan Penting:**
> Jangan pakai `v-once` pada elemen yang **harus** bereaksi terhadap perubahan data. Gunakan hanya untuk konten yang benar-benar statis (teks legal, label brand, struktur yang tidak berubah).

---

## 🌊 `shallowRef` & `shallowReactive` — Reaktivitas Dangkal

Secara default `ref`/`reactive` membuat **seluruh objek** reaktif secara rekursif (Vue menelusuri nested property). Untuk objek besar, ini mahal. `shallowRef`/`shallowReactive` hanya melacak **referensi level-atas**.

```vue
<script setup>
import { ref, shallowRef, shallowReactive, triggerRef } from 'vue'

// ── ref biasa: reaktif REKURSIF (mahal untuk data besar) ──
const filmBesar = ref({
  id: 1,
  title: 'Interstellar',
  // ✅ Mengubah nested property memicu re-render
  detail: { rating: 8.6, sinopsis: '...' },
})
filmBesar.value.detail.rating = 9.0 // ✅ Reaktif (Vue telusuri dalam)

// ── shallowRef: HANYA referensi level-atas yang reaktif ──
const filmShallow = shallowRef({
  id: 1,
  title: 'Interstellar',
  detail: { rating: 8.6 },
})

// ❌ Mengubah nested TIDAK memicu update (karena shallow)
filmShallow.value.detail.rating = 9.0 // ❌ Tidak reaktif!

// ✅ Solusi 1: ganti SELURUH referensi
filmShallow.value = {
  ...filmShallow.value,
  detail: { ...filmShallow.value.detail, rating: 9.0 },
}

// ✅ Solusi 2: paksa update manual dengan triggerRef
filmShallow.value.detail.rating = 9.0
triggerRef(filmShallow) // 🔹 Paksa Vue merender ulang

// ── shallowReactive: seperti shallowRef tapi untuk object ──
const state = shallowReactive({
  user: { nama: 'Budi', alamat: { kota: 'Yogya' } },
})
state.user = { nama: 'Ani', alamat: { kota: 'Jakarta' } } // ✅ Reaktif (ganti ref)
state.user.nama = 'Caca' // ❌ TIDAK reaktif (nested)
</script>
```

Kapan pakai?

| Kasus | Gunakan |
| --- | --- |
| List 1000+ objek film dari API | `shallowRef` (ganti seluruh array saat data baru) |
| Data besar yang jarang berubah per-field | `shallowReactive` |
| State UI kecil (counter, modal) | `ref`/`reactive` biasa |
| Object dengan class instance / pustaka eksternal | `shallowRef` (hindari Vue meng-observe) |

> 💡 **Tips:**
> `shallowRef` sangat cocok untuk menyimpan **array hasil fetch** yang ukurannya besar. Alih-alih Vue mengamati setiap item, cukup ganti array-nya (`films.value = dataBaru`) saat data baru tiba.

---

## 🧠 `v-memo` — Hindari Re-render Tidak Perlu

`v-memo` membekukan sebuah elemen/blok kecuali dependensi yang disebutkan berubah. Ini "memoization" di level template.

```vue
<template>
  <!--
    🔹 v-memo: hanya re-render <div> ini jika userId BERUBAH.
    🔹 Jika komponen parent re-render tapi userId sama,
    🔹 blok ini dilewati (tidak di-diff, tidak di-patch).
  -->
  <div v-memo="[userId]">
    <ProfilUser :user="user" />
    <!-- Konten mahal yang tidak perlu update kalau userId tetap -->
  </div>

  <!-- Contoh: list besar dengan v-memo per item -->
  <div
    v-for="film in films"
    :key="film.id"
    v-memo="[film.id, film.vote_average]"
  >
    <!-- Hanya re-render item ini jika id atau rating berubah -->
    <MovieCard :film="film" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const userId = ref(1)
const user   = ref({ nama: 'Budi' })
const films  = ref([])
</script>
```

Perbandingan:

| Direktif | Cakupan | Use Case |
| --- | --- | --- |
| `v-once` | Render sekali selamanya | Konten statis permanen |
| `v-memo="[deps]"` | Render ulang hanya jika `deps` berubah | Blok mahal dengan dependensi spesifik |

> ⚠️ **Catatan Penting:**
> `v-memo` bisa **menyembunyikan bug** jika dependensinya salah. Hanya gunakan pada bagian yang sudah kamu yakini dependensinya. Jangan asal pasang di seluruh template.

---

## ✂️ Code-Splitting via Lazy Routes (Dynamic Import)

Secara default, Vite menggabungkan semua halaman ke satu bundle raksasa. Code-splitting memecahnya jadi chunk terpisah yang diunduh **saat dibutuhkan**.

```javascript
// router/index.js — BURUK: semua view di-import langsung (1 bundle besar)
import HomeView        from '@/views/HomeView.vue'
import BrowseView      from '@/views/BrowseView.vue'
import MovieDetailView from '@/views/MovieDetailView.vue'

// ✅ BAIK: lazy load via dynamic import → chunk terpisah per route
const HomeView        = () => import('@/views/HomeView.vue')
const BrowseView      = () => import('@/views/BrowseView.vue')
const MovieDetailView = () => import('@/views/MovieDetailView.vue')
const SearchView      = () => import('@/views/SearchView.vue')
const ProfileView     = () => import('@/views/ProfileView.vue')
const NotFoundView    = () => import('@/views/NotFoundView.vue')

const routes = [
  { path: '/',            name: 'home',          component: HomeView },
  { path: '/browse',      name: 'browse',        component: BrowseView },
  { path: '/movie/:id',   name: 'movie-detail',  component: MovieDetailView },
  { path: '/search',      name: 'search',        component: SearchView },
  { path: '/profile',     name: 'profile',       component: ProfileView },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
]

// 🔹 Tambahkan lazy di level komponen berat juga (misal chart, editor)
// const MovieModal = defineAsyncComponent(() =>
//   import('@/components/movie/MovieModal.vue')
// )
```

Manfaat:

```
Tanpa code-splitting:
  bundle.js (2.5 MB) → user download SEMUANYA saat buka beranda 😴

Dengan code-splitting:
  beranda.js  (0.3 MB) → download saat buka /
  browse.js   (0.6 MB) → download saat buka /browse
  detail.js   (0.5 MB) → download saat buka /movie/123
  → Loading pertama jauh lebih cepat ✅
```

> 💡 **Tips:**
> Gabungkan lazy route dengan `<Suspense>` atau komponen loading (`LoadingComponent` pada `defineAsyncComponent`) agar user melihat spinner saat chunk diunduh.

---

## 📜 Virtual Scrolling — Render Hanya yang Terlihat

Jika kamu punya 10.000 film, merender semuanya sekaligus akan membuat DOM membengkak dan UI lag. **Virtual scrolling** hanya merender item yang **terlihat di viewport** (+ sedikit buffer).

```
List 10.000 film:
  ❌ Tanpa virtual scroll: 10.000 <div> di DOM → browser melambat
  ✅ Dengan virtual scroll: hanya ~20 <div> di DOM (yang terlihat)
     saat scroll, item diganti secara dinamis
```

Vue tidak menyediakan virtual scroll bawaan, tapi ekosistem punya pustaka:

| Library | Catatan |
| --- | --- |
| `vue-virtual-scroller` | Paling populer, ringan |
| `@tanstack/vue-virtual` | Modern, dari Tim Virtual (TanStack) |
| `vueuc` / `naive-ui` | Bagian dari UI kit |

```vue
<!-- Contoh konseptual dengan vue-virtual-scroller -->
<template>
  <RecycleScroller
    class="scroller"
    :items="sepuluhRibuFilm"
    :item-size="200"
    key-field="id"
  >
    <template #default="{ item }">
      <MovieCard :film="item" />
    </template>
  </RecycleScroller>
</template>

<script setup>
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

const sepuluhRibuFilm = ref([]) // Diisi dari API
</script>
```

> 📌 **Catatan Penting:**
> Virtual scrolling adalah **mention** (pengenalan) — untuk project produksi, pilih library yang aktif dirawat. Intinya: jangan render 10.000 node DOM sekaligus.

---

## 🧪 Pengantar Testing di Vue

Testing terdengar menakutkan, padahal intinya sederhana: **pastikan komponenmu melakukan apa yang kamu janjikan.** Di ekosistem Vue modern, kombinasi **Vitest** (runner test super cepat, dibuat oleh tim Vite) dan **Vue Test Utils** (helper untuk mem-"mount" komponen) adalah standar industri.

### 🛠️ Tools yang Digunakan

- **Vitest** → menjalankan test, memberikan `describe`, `it`, `expect`. Terintegrasi native dengan Vite (config `vite.config.js`).
- **@vue/test-utils** → menyediakan `mount()` untuk me-render komponen di lingkungan test (bukan di browser sungguhan).

```
Tanpa test:
  Developer ubah kode → harap saja tidak ada bug 🙏

Dengan test:
  Developer ubah kode → jalankan `npm run test`
  → Jika ada yang rusak, test GAGAL → langsung tahu di mana 🎯
```

> 💡 **Catatan Penting:**
> Unit test fokus pada **satu komponen/composable secara terisolasi**. Jangan panggil API sungguhan di dalamnya — gunakan props/data tiruan. Itulah yang membuat test cepat & stabil.

---

## ⚙️ Setup Vitest + Vue Test Utils

Saat membuat project dengan `npm create vue@latest`, pilih **"Add Vitest?" → Yes**. Jika sudah ada project, instal manual:

```bash
# Install dependency dev untuk testing
npm install -D vitest @vue/test-utils jsdom

# jsdom → menyediakan environment DOM tiruan untuk test
```

```javascript
// vite.config.js — tambahkan test config
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',        // 🔹 DOM tiruan (bukan node murni)
    globals: true,               // 🔹 izinkan describe/it/expect global
    // 🔹 file test dikenali dengan pola ini:
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
})
```

```json
// package.json — tambahkan script
{
  "scripts": {
    "test": "vitest run",        // 🔹 jalankan sekali (CI)
    "test:watch": "vitest"       // 🔹 mode watch (dev)
  }
}
```

---

## 🔧 `mount`, `find`, `trigger`, `emitted`, `setValue`

VUE TEST UTILS API paling sering dipakai:

| Method | Fungsi |
| --- | --- |
| `mount(Komponen, { props, attrs, slots })` | Render komponen di test |
| `wrapper.text()` | Ambil seluruh teks yang dirender |
| `wrapper.html()` | Ambil HTML lengkap |
| `wrapper.find(selector)` | Cari **satu** elemen (throw jika tidak ada) |
| `wrapper.findAll(selector)` | Cari **semua** elemen (returns array) |
| `wrapper.findComponent(NamaKomponen)` | Cari komponen anak |
| `wrapper.trigger('click')` | Simulasikan event DOM (harus `await`) |
| `wrapper.setValue('teks')` | Set nilai input/textarea/select (harus `await`) |
| `wrapper.emitted('namaEvent')` | Ambil daftar event yang di-emit |
| `wrapper.classes()` | Ambil daftar class |
| `wrapper.exists()` | Cek elemen ada/tidak |

```vue
<!-- Contoh komponen yang akan dites -->
<!-- components/ui/BaseButton.vue -->
<script setup>
const props = defineProps({
  label: { type: String, default: 'OK' },
  disabled: { type: Boolean, default: false },
})
const emit = defineEmits(['klik'])
</script>

<template>
  <button
    :disabled="disabled"
    :class="{ 'btn-mati': disabled }"
    @click="emit('klik', 'payload-contoh')"
  >
    {{ label }}
  </button>
</template>
```

```javascript
// BaseButton.test.js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '@/components/ui/BaseButton.vue'

describe('BaseButton', () => {
  it('menampilkan label', () => {
    const wrapper = mount(BaseButton, { props: { label: 'Simpan' } })
    // 🔹 text() berisi "Simpan"
    expect(wrapper.text()).toContain('Simpan')
  })

  it('emit klik saat ditekan', async () => {
    const wrapper = mount(BaseButton)
    // 🔹 trigger klik, HARUS await
    await wrapper.trigger('click')
    // 🔹 emitted() mengembalikan array event
    expect(wrapper.emitted('klik')).toBeTruthy()
    expect(wrapper.emitted('klik')[0][0]).toBe('payload-contoh')
  })

  it('tidak emit saat disabled', async () => {
    const wrapper = mount(BaseButton, { props: { disabled: true } })
    await wrapper.trigger('click')
    // 🔹 tidak ada event sama sekali
    expect(wrapper.emitted('klik')).toBeFalsy()
  })

  it('punya class btn-mati saat disabled', () => {
    const wrapper = mount(BaseButton, { props: { disabled: true } })
    // 🔹 classes() mengembalikan array
    expect(wrapper.classes()).toContain('btn-mati')
  })

  it('setValue pada input (konsep)', async () => {
    // 🔹 misal ada <input> di dalam komponen:
    // const input = wrapper.find('input')
    // await input.setValue('Interstellar')
    // expect(wrapper.text()).toContain('Interstellar')
  })
})
```

---

## ⏳ Async Test & Menunggu Update

Interaksi Vue bersifat asinkron. Selalu `await` pada `trigger`/`setValue` agar Vue selesai memproses sebelum assertion.

```javascript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchBar from '@/components/movie/SearchBar.vue'

describe('SearchBar', () => {
  it('memperbarui teks saat user mengetik', async () => {
    const wrapper = mount(SearchBar)
    const input = wrapper.find('input')

    // 🔹 setValue mengubah nilai + memicu event input
    await input.setValue('Batman')

    // 🔹 SEHINGGA: setelah await, template sudah update
    // 🔹 Kita bisa cek emit membawa keyword terbaru
    expect(wrapper.emitted('cari')[0][0]).toBe('Batman')
  })

  it('menampilkan hasil setelah fetch (async)', async () => {
    // Simulasikan komponen yang fetch lalu render
    const wrapper = mount(SearchBar)

    // 🔹 picu pencarian
    await wrapper.find('input').setValue('Avengers')

    // 🔹 tunggu nextTick / microtask selesai
    await wrapper.vm.$nextTick()

    // 🔹 sekarang cek hasil sudah muncul
    expect(wrapper.find('.hasil').exists()).toBe(true)
  })
})
```

> ⚠️ **Catatan Penting:**
> Tanpa `await`, assertion bisa berjalan **sebelum** Vue memproses event, sehingga test gagal secara salah (flaky test). Selalu `await` interaksi DOM.

---

## 🎬 Test Komponen `MovieCard` (Lengkap)

Ini test nyata untuk komponen dari project kita:

```javascript
// MovieCard.test.js — Contoh unit test dengan Vitest + Vue Test Utils
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MovieCard from '@/components/movie/MovieCard.vue'

describe('MovieCard', () => {
  const propsDefault = {
    film: {
      id:           1,
      title:        'Interstellar',
      vote_average: 8.6,
      poster_path:  '/poster.jpg',
    },
  }

  it('menampilkan judul film dengan benar', () => {
    const wrapper = mount(MovieCard, { props: propsDefault })
    expect(wrapper.text()).toContain('Interstellar')
  })

  it('menampilkan rating film', () => {
    const wrapper = mount(MovieCard, { props: propsDefault })
    expect(wrapper.text()).toContain('8.6')
  })

  it('emit event klik-film saat diklik', async () => {
    const wrapper = mount(MovieCard, { props: propsDefault })
    await wrapper.trigger('click')
    expect(wrapper.emitted('klik-film')).toBeTruthy()
    expect(wrapper.emitted('klik-film')[0][0].id).toBe(1)
  })

  it('menampilkan gambar poster dengan URL TMDB', () => {
    const wrapper = mount(MovieCard, { props: propsDefault })
    const img = wrapper.find('img')
    // 🔹 poster_path harus digabung dengan base URL TMDB
    expect(img.attributes('src')).toContain('/poster.jpg')
    expect(img.attributes('alt')).toBe('Interstellar')
  })

  it('menerapkan class highlight saat isHighlighted', () => {
    const wrapper = mount(MovieCard, {
      props: { ...propsDefault, isHighlighted: true },
    })
    expect(wrapper.classes()).toContain('highlighted')
  })

  it('TIDAK emit saat disabled', async () => {
    const wrapper = mount(MovieCard, {
      props: { ...propsDefault, disabled: true },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('klik-film')).toBeFalsy()
  })
})
```

Penjelasan test case demi test case:

**1. Setup awal**
- `describe('MovieCard', ...)` → mengelompokkan semua test terkait `MovieCard`.
- `propsDefault` → data tiruan (dummy) yang mensimulasikan sebuah film. Kita tidak butuh API sungguhan di test unit.

**2. Test "menampilkan judul film"**
- `mount(MovieCard, { props: propsDefault })` → me-render komponen dengan props film tersebut. `wrapper` adalah representasi komponen di test.
- `wrapper.text()` → mengambil **seluruh teks** yang dirender komponen.
- `expect(...).toContain('Interstellar')` → memastikan kata "Interstellar" muncul.

**3. Test "menampilkan rating film"**
- Sama seperti di atas, tapi memastikan angka `8.6` tampil. Menjaga agar kamu tidak lupa menampilkan rating saat mengubah template.

**4. Test "emit event klik-film"** — yang paling penting
- `await wrapper.trigger('click')` → mensimulasikan **klik** user. `await` penting karena event Vue bersifat asinkron.
- `wrapper.emitted('klik-film')` → mengambil daftar event yang di-emit.
- `wrapper.emitted('klik-film')[0][0].id` → mengambil **payload** event pertama (`[0]`) argumen pertamanya (`[0]`), lalu mengecek `.id === 1`.

> 📌 **Catatan Penting:**
> Test harus **terisolasi** — tidak bergantung test lain. Setiap `it` sebaiknya `mount` komponen baru (atau `beforeEach` untuk reset).

---

## 🧩 Test Composable `useFetch`

Composable bisa dites tanpa komponen, berkat `mount` pada komponen host atau `flushPromises`.

```javascript
// composables/useFetch.test.js
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { useFetch } from '@/composables/useFetch'

describe('useFetch', () => {
  it('mengembalikan data setelah fetch sukses', async () => {
    // 🔹 Stub global fetch agar tidak memanggil jaringan sungguhan
    global.fetch = vi.fn(async () =>
      ({
        ok: true,
        json: async () => ({ results: [{ id: 1, title: 'Test' }] }),
      })
    )

    let hasil // 🔹 akan diisi oleh composable di dalam komponen

    // 🔹 Buat komponen host minimal untuk menjalankan composable
    const Host = defineComponent({
      setup() {
        hasil = useFetch('https://api.test/movies')
        return () => h('div')
      },
    })

    mount(Host)

    // 🔹 tunggu promise fetch selesai
    await vi.waitFor(() => {
      expect(hasil.isLoading.value).toBe(false)
    })

    expect(hasil.data.value).toEqual({ results: [{ id: 1, title: 'Test' }] })
    expect(hasil.error.value).toBeNull()
  })

  it('menangani error saat response tidak ok', async () => {
    global.fetch = vi.fn(async () =>
      ({ ok: false, status: 404, statusText: 'Not Found' })
    )

    let hasil
    const Host = defineComponent({
      setup() {
        hasil = useFetch('https://api.test/x')
        return () => h('div')
      },
    })
    mount(Host)

    await vi.waitFor(() => {
      expect(hasil.isLoading.value).toBe(false)
    })

    expect(hasil.error.value).toContain('404')
    expect(hasil.data.value).toBeNull()
  })
})
```

Penjelasan:

- `vi.fn(...)` → membuat **mock function** (fungsi tiruan) untuk `fetch`, sehingga tidak ada jaringan sungguhan.
- `defineComponent` + `h('div')` → komponen host kosong hanya untuk menjalankan composable dalam konteks Vue (agar reaktivitas aktif).
- `vi.waitFor(...)` → menunggu hingga kondisi reaktif terpenuhi (fetch selesai).
- Kita assert `isLoading`, `data`, dan `error` sesuai skenario sukses/gagal.

> 💡 **Tips:**
> Untuk composable murni (tanpa lifecycle DOM), kamu juga bisa pakai `import { ref } from 'vue'` dan memanggil composable langsung di test — asalkan composable tidak butuh `onMounted`. Jika butuh lifecycle, gunakan komponen host seperti di atas.

---

## 📁 Best Practices: Struktur Folder By-Type

Pendekatan klasik — mengelompokkan file **berdasarkan jenisnya** (components, views, stores, dll). Cocok untuk project kecil-menengah.

```
src/
├── assets/
│   ├── images/
│   └── css/
│       └── main.css
│
├── components/          ← Semua komponen UI (tanpa sub-kategori domain)
│   ├── Navbar.vue
│   ├── Footer.vue
│   ├── MovieCard.vue
│   ├── MovieRow.vue
│   ├── MovieBanner.vue
│   ├── MovieModal.vue
│   ├── BaseButton.vue
│   ├── BaseInput.vue
│   └── SkeletonLoader.vue
│
├── composables/         ← Satu file per composable
│   ├── useTMDB.js
│   ├── useFetch.js
│   ├── useDebounce.js
│   └── useLocalStorage.js
│
├── router/
│   └── index.js
│
├── stores/              ← State Pinia
│   ├── authStore.js
│   ├── movieStore.js
│   └── watchlistStore.js
│
├── views/               ← Satu file per halaman/route
│   ├── HomeView.vue
│   ├── BrowseView.vue
│   ├── MovieDetailView.vue
│   ├── SearchView.vue
│   ├── ProfileView.vue
│   └── NotFoundView.vue
│
├── utils/               ← Fungsi helper murni
│   ├── formatRupiah.js
│   └── validasiForm.js
│
├── App.vue
└── main.js
```

| Kelebihan | Kekurangan |
| --- | --- |
| Simpel, mudah dipahami pemula | Folder `components/` membesar tak terkendali |
| Konsisten untuk project kecil | Sulit menemukan file saat 100+ komponen |
| Cocok untuk prototipe | Tidak mencerminkan batas domain bisnis |

---

## 🗂️ Best Practices: Struktur Folder By-Feature

Pendekatan modern untuk project menengah-besar — mengelompokkan **berdasarkan fitur/domain**. Ini yang direkomendasikan untuk Netflix clone kita.

```
src/
├── assets/
│   ├── images/
│   └── css/
│       └── main.css
│
├── components/
│   ├── layout/          ← Komponen tata letak halaman
│   │   ├── Navbar.vue
│   │   └── Footer.vue
│   ├── movie/           ← Komponen khusus domain film
│   │   ├── MovieCard.vue
│   │   ├── MovieRow.vue
│   │   ├── MovieBanner.vue
│   │   └── MovieModal.vue
│   └── ui/              ← Komponen UI generik/reusable
│       ├── BaseButton.vue
│       ├── BaseInput.vue
│       ├── BaseModal.vue
│       └── SkeletonLoader.vue
│
├── composables/         ← Satu file per composable
│   ├── useTMDB.js
│   ├── useFetch.js
│   ├── useDebounce.js
│   └── useLocalStorage.js
│
├── router/
│   └── index.js
│
├── stores/              ← State Pinia per domain
│   ├── authStore.js
│   ├── movieStore.js
│   └── watchlistStore.js
│
└── views/               ← Satu file per halaman/route
    ├── HomeView.vue
    ├── BrowseView.vue
    ├── MovieDetailView.vue
    ├── SearchView.vue
    ├── ProfileView.vue
    └── NotFoundView.vue
```

### 💡 Prinsip Domain-Grouping

Inilah kunci dari struktur di atas:

> 💡 **Prinsip yang Dipegang:**
> - **Satu file, satu tanggung jawab**
> - Kelompokkan berdasarkan **domain** (movie, user, dll) bukan tipe file
> - Nama file yang jelas lebih baik daripada komentar yang panjang

Daripada mengelompokkan `MovieCard.vue`, `UserCard.vue`, `OrderCard.vue` ke dalam satu folder `cards/`, lebih baik mengelompokkan berdasarkan **domain bisnis**: semua yang berhubungan film ke `components/movie/`, semua yang berhubungan user ke `components/user/`. Kenapa?

- Saat kamu mengubah fitur "film", semua file relevan ada di **satu tempat**.
- Tim bisa bekerja paralel per domain tanpa bentrok.
- Mudah ditebak: butuh komponen modal film? Lihat `components/movie/`.

> ⚠️ **Catatan Penting:**
> Hindari folder `components/components` atau nesting terlalu dalam. Aturan praktis: jika kamu harus klik lebih dari 3 level untuk menemukan file, strukturmu perlu dirapatkan.

---

## 🏷️ Konvensi Penamaan File & Komponen

Konsistensi penamaan membuat project mudah dipahami semua anggota tim.

```
Komponen Vue        → PascalCase.vue        → MovieCard.vue, Navbar.vue
Komponen UI generik → BaseXxx.vue            → BaseButton.vue, BaseModal.vue
View / Halaman      → XxxView.vue            → BrowseView.vue (satu per route)
Composable          → useXxx.js (camelCase) → useFetch.js, useTMDB.js
Store Pinia         → xxxStore.js           → movieStore.js, authStore.js
Utility murni       → camelCase.js          → formatRupiah.js, validasi.js
Konstanta           → SCREAMING_SNAKE       → API_URL, MAX_RESULTS
Index (barrel)      → index.js              → index.js (re-export banyak file)
```

| Konvensi | Alasan |
| --- | --- |
| `Base*` untuk UI primitif | Standar komunitas Vue menandai komponen generik reusable |
| `use*` untuk composable | Sekali lihat tahu itu composable (hook) |
| `*View` untuk halaman | Membedakan halaman (route) dari komponen bagian |
| `*Store` untuk Pinia | Sekali lihat tahu itu state global |

> 📌 **Catatan Penting:**
> Konvensi penamaan `Base*` (seperti `BaseButton`) adalah standar komunitas Vue untuk menandai komponen UI **primitif/generik** yang bisa dipakai di mana saja. Gunakan konvensi ini agar tim paham mana komponen "umum" vs "spesifik domain".

---

## 🎬 Studi Kasus — Test MovieCard + useFetch

**Skenario:** Timmu mengubah `MovieCard` dan tanpa sengaja menghapus pemanggilan `$emit('klik-film')`. Berkat test ke-3 di atas, **CI (Continuous Integration) akan gagal** sebelum kode di-merge. Bug tertangkap otomatis, bukan oleh pengguna akhir.

Langkah verifikasi end-to-end:

```bash
# 1. Jalankan semua test
npm run test

# Output yang diharapkan (sebelum bug):
#  ✓ MovieCard > menampilkan judul film dengan benar
#  ✓ MovieCard > menampilkan rating film
#  ✓ MovieCard > emit event klik-film saat diklik
#  ✓ useFetch > mengembalikan data setelah fetch sukses
#  ✓ useFetch > menangani error saat response tidak ok
#
# 2. Developer hapus emit 'klik-film' di MovieCard
# 3. Jalankan test lagi → GAGAL di "emit event klik-film saat diklik"
# 4. CI blokir merge → bug tidak sampai ke production ✅
```

**Nilai testing:**
- Regresi tertangkap otomatis (tidak mengandalkan ingatan manusia).
- Refactor lebih berani karena ada jaring pengaman.
- Dokumentasi hidup — test menunjukkan bagaimana komponen seharusnya dipakai.

Gabungan dengan performa: `MovieCard` yang merender ribuan item bisa dioptimalkan dengan `shallowRef` untuk data film dan `v-memo` per kartu, sementara test menjamin perilaku tetap benar setelah optimasi.

---

## 📊 Mengukur Performa: Jangan Menebak, Ukur!

Aturan emas optimasi: **"Measure first, optimize later."** Mengoptimalkan tanpa mengukur = membuang waktu memperbaiki yang tidak lambat. Vue & browser menyediakan alat ukur gratis.

```
❌ CARA SALAH (menebak):
   "Sepertinya list ini lambat, mari pasang v-memo di mana-mana..."
   → mungkin bukan itu masalahnya → waktu terbuang, kode makin rumit

✅ CARA BENAR (mengukur):
   1. Buka Chrome DevTools → tab Performance → Record
   2. Lakukan aksi yang terasa lambat (scroll, buka modal)
   3. Stop → lihat flame chart → temukan fungsi/komponen paling makan waktu
   4. Optimalkan HANYA bagian itu → ukur ulang → bandingkan
```

| Alat | Untuk Mengukur | Cara Akses |
| --- | --- | --- |
| **Lighthouse** | Skor performa keseluruhan, LCP, TBT | DevTools → Lighthouse → Analyze |
| **Performance tab** | Fungsi mana yang lambat (flame chart) | DevTools → Performance → Record |
| **Vue DevTools** | Komponen mana yang sering re-render | Ekstensi → Components → highlight updates |
| **`import.meta.env`** | Bundle size per chunk | `npm run build` → lihat output |

```javascript
// Ukur waktu sebuah operasi secara manual (quick check)
console.time('filter-film')
const hasil = semuaFilm.value.filter((f) => f.genre === 'action')
console.timeEnd('filter-film') // → filter-film: 12.4ms

// Ukur di dalam komponen: hitung berapa kali render
import { onUpdated } from 'vue'
let renderCount = 0
onUpdated(() => console.log('render ke-', ++renderCount))
```

```
Metrik Web Vitals yang penting (target Lighthouse):
  LCP (Largest Contentful Paint) → < 2.5 detik  (konten utama muncul)
  TBT (Total Blocking Time)       → < 200 ms     (responsif ke klik)
  CLS (Cumulative Layout Shift)   → < 0.1        (layout tidak "loncat")
```

> 💡 **Tips:** Vue DevTools punya fitur **"Highlight updates"** — komponen yang re-render akan berkedip. Jika komponen berkedip padahal datanya tak berubah, itulah kandidat untuk `v-memo` atau `shallowRef`. Kedipan berlebihan = re-render sia-sia.

> ⚠️ **Catatan Penting:** Selalu ukur di **build production** (`npm run build && npm run preview`), bukan dev server. Dev server punya overhead HMR & tanpa minifikasi, sehingga angkanya jauh lebih lambat dari kenyataan.

---

## 🖼️ Optimasi Aset & Event: Lazy Image, Debounce, Throttle

Selain reaktivitas, performa nyata sering datang dari **gambar** dan **event yang terlalu sering** (scroll, resize, ketik). Ini teknik yang berdampak besar dengan usaha kecil.

### 🏞️ Lazy Loading Gambar

```vue
<template>
  <!-- ❌ SALAH: 100 poster diunduh sekaligus saat halaman buka -->
  <img :src="film.poster" :alt="film.title" />

  <!-- ✅ BENAR: loading="lazy" → browser unduh saat mendekati viewport -->
  <img :src="film.poster" :alt="film.title" loading="lazy" />

  <!-- ✅ LEBIH BAIK: sediakan width/height agar tak ada layout shift (CLS) -->
  <img
    :src="film.poster"
    :alt="film.title"
    loading="lazy"
    width="200"
    height="300"
  />
</template>
```

### ⏱️ Debounce vs Throttle

```javascript
// DEBOUNCE: tunggu user BERHENTI dulu, baru jalankan (cocok: search box)
function debounce(fn, delay = 400) {
  let timer
  return (...args) => {
    clearTimeout(timer)               // batalkan pemanggilan sebelumnya
    timer = setTimeout(() => fn(...args), delay)
  }
}

// THROTTLE: jalankan MAKSIMAL sekali per interval (cocok: scroll/resize)
function throttle(fn, interval = 200) {
  let boleh = true
  return (...args) => {
    if (!boleh) return
    boleh = false
    fn(...args)
    setTimeout(() => (boleh = true), interval)
  }
}
```

```vue
<script setup>
import { ref, watch } from 'vue'

const keyword = ref('')

// ❌ SALAH: request tiap ketikan → 10 huruf = 10 request API!
watch(keyword, (k) => cariFilm(k))

// ✅ BENAR: debounce → request hanya setelah user berhenti 400ms
const cariDebounced = debounce((k) => cariFilm(k), 400)
watch(keyword, cariDebounced)
</script>
```

| Teknik | Kapan Jalan | Use Case Ideal |
| --- | --- | --- |
| **Debounce** | Setelah diam X ms | Search box, autosave, validasi form |
| **Throttle** | Maks 1x per X ms | Scroll, resize, mousemove, drag |
| **`loading="lazy"`** | Saat gambar dekat viewport | Grid poster, galeri, list panjang |

```
DAMPAK debounce pada search "interstellar" (12 huruf):
  Tanpa debounce: 12 request API  😰 (boros kuota, race condition)
  Dengan debounce: 1 request API  ✅ (setelah berhenti mengetik)
```

> 💡 **Tips:** Kombinasikan `loading="lazy"` + `width`/`height` eksplisit + debounce pada search. Tiga teknik sederhana ini sering menaikkan skor Lighthouse lebih banyak daripada optimasi reaktivitas rumit. Untuk debounce siap pakai, gunakan `useDebounce` dari Bab 14.

---

## 🧷 Snapshot Testing & Code Coverage

Selain assertion manual (`toContain`, `emitted`), Vitest mendukung **snapshot testing** (deteksi perubahan tampilan tak sengaja) dan **coverage** (persentase kode yang teruji).

### 📸 Snapshot Testing

```javascript
// MovieCard.snapshot.test.js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MovieCard from '@/components/movie/MovieCard.vue'

describe('MovieCard snapshot', () => {
  it('cocok dengan snapshot tersimpan', () => {
    const wrapper = mount(MovieCard, {
      props: { film: { id: 1, title: 'Interstellar', vote_average: 8.6 } },
    })
    // ① Pertama kali: Vitest MENYIMPAN HTML ke file .snap
    // ② Berikutnya: BANDINGKAN dengan yang tersimpan
    //    Jika HTML berubah → test GAGAL (minta konfirmasi)
    expect(wrapper.html()).toMatchSnapshot()
  })
})
```

```
ALUR SNAPSHOT:

Test pertama kali jalan
   ↓
Simpan HTML → __snapshots__/MovieCard.snapshot.test.js.snap
   ↓
Developer ubah template MovieCard (sengaja/tidak)
   ↓
Test jalan lagi → bandingkan dengan .snap
   ├── Sama    → ✅ lulus
   └── Berbeda → ❌ gagal → "apakah perubahan ini disengaja?"
                 → jika ya: `npm run test -- -u` (update snapshot)
```

### 📈 Code Coverage

```json
// package.json
{
  "scripts": {
    "test:coverage": "vitest run --coverage"
  }
}
```

```bash
npm install -D @vitest/coverage-v8
npm run test:coverage
```

```
Contoh output coverage:
 File            | % Stmts | % Branch | % Funcs | % Lines |
 ----------------|---------|----------|---------|---------|
 MovieCard.vue   |   95.2  |   88.8   |  100    |  95.2   |
 useFetch.js     |   100   |   100    |  100    |  100    |
 movieStore.js   |   62.5  |   40.0   |  55.5   |  62.5   |  ← perlu test lagi!
```

| Metrik Coverage | Arti |
| --- | --- |
| **% Stmts** | Persentase statement yang dijalankan test |
| **% Branch** | Persentase cabang (if/else) yang teruji |
| **% Funcs** | Persentase fungsi yang dipanggil test |
| **% Lines** | Persentase baris yang tereksekusi |

> ⚠️ **Catatan Penting:** Coverage 100% **bukan** jaminan bebas bug — ia hanya mengukur *berapa banyak* kode dijalankan test, bukan *seberapa baik* assertion-nya. Jangan kejar angka buta. Fokus menguji **logika penting & cabang error**, bukan getter sepele.

> 💡 **Tips:** Snapshot cocok untuk komponen presentational yang tampilannya stabil. Hindari snapshot pada komponen yang HTML-nya sering berubah wajar (timestamp, data acak) — snapshot akan terus gagal dan kamu jadi terbiasa `-u` tanpa berpikir (snapshot rot).

---

## 🧰 `defineAsyncComponent` — Lazy Load Komponen Berat

Selain lazy **route**, kita bisa memuat **komponen tunggal** secara malas — cocok untuk modal, chart, atau editor yang berat tapi jarang dipakai.

```javascript
// router/index.js atau script setup
import { defineAsyncComponent } from 'vue'

// Komponen dimuat HANYA saat pertama dirender
const MovieModal = defineAsyncComponent(() =>
  import('@/components/movie/MovieModal.vue')
)

// Dengan komponen loading & error
const ChartBerat = defineAsyncComponent({
  loader: () => import('@/components/Chart.vue'),
  loadingComponent: SpinnerKecil, // tampil saat chunk diunduh
  errorComponent: PesanError,     // tampil kalau gagal load
  delay: 200,                     // tunggu 200ms sebelum loading
  timeout: 10000,                 // batas 10dtk
})
```

```vue
<template>
  <!-- Modal hanya di-download saat showModal = true -->
  <MovieModal v-if="showModal" :film="filmTerpilih" />
</template>
```

| Pola | Kapan Pakai |
| --- | --- |
| Lazy **route** | Tiap halaman terpisah → `() => import()` |
| `defineAsyncComponent` | Satu komponen berat (modal/chart) |
| Loading/error component | UX saat chunk lambat/error |

> 💡 **Tips:** Gabungkan `defineAsyncComponent` dengan `<Suspense>` bila komponen async butuh `setup` asinkron (misal `await` di dalamnya). Untuk kasus umum, loading/error component sudah cukup.

---

## 🔬 Profiling Re-render dengan Vue DevTools

Sebelum optimasi, kita harus **melihat** komponen mana yang re-render tidak perlu. Vue DevTools punya fitur "Highlight updates".

```
Langkah mengukur re-render:
  1. Buka Vue DevTools → tab "Components"
  2. Centang "Highlight updates when components re-render"
  3. Lakukan aksi di UI (klik, ketik, scroll)
  4. Komponen yang berkedip = sedang re-render
  5. Jika komponen BERKEDIP PADAHAL datanya tak berubah
     → kandidat untuk v-memo / shallowRef
```

```vue
<script setup>
import { onUpdated } from 'vue'

// Cek manual: hitung berapa kali komponen ini render
let count = 0
onUpdated(() => {
  count++
  console.log('MovieCard render ke-', count)
})
</script>
```

| Sinyal | Arti | Tindakan |
| --- | --- | --- |
| Berkedip saat tidak ada perubahan | Re-render sia-sia | `v-memo`, `shallowRef` |
| Render ke-100+ saat scroll | List terlalu berat | Virtual scroll |
| Bundle > 1MB | Terlalu banyak di 1 chunk | Lazy route |

> ⚠️ **Catatan:** Jangan optimasi **sebelum** melihat masalahnya. "Highlight updates" adalah alat diagnosa paling cepat — pakai sebelum menambah `v-memo` sembarangan.

---

## 🧪 Testing Lanjutan: Komponen dengan Store & Router

Banyak komponen butuh **store** atau **router**. Di test, kita sediakan tiruan (stub) agar komponen terisolasi.

```javascript
// MovieCard.test.js — komponen butuh router-link
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MovieCard from '@/components/movie/MovieCard.vue'

describe('MovieCard dengan router', () => {
  it('render tanpa error saat butuh RouterLink', () => {
    const wrapper = mount(MovieCard, {
      props: { film: { id: 1, title: 'Test' } },
      // ① Stub RouterLink agar tidak error (tidak butuh router asli)
      global: {
        stubs: {
          RouterLink: { template: '<a><slot /></a>' },
        },
      },
    })
    expect(wrapper.text()).toContain('Test')
  })
})
```

```javascript
// Test yang butuh Pinia store:
import { setActivePinia, createPinia } from 'pinia'

beforeEach(() => {
  setActivePinia(createPinia()) // ② aktifkan Pinia di test
})

it('menampilkan badge saat di watchlist', () => {
  const watchlist = useWatchlistStore()
  watchlist.tambah({ id: 1, title: 'X' }) // isi store tiruan

  const wrapper = mount(MovieCard, {
    props: { film: { id: 1, title: 'X' } },
  })
  expect(wrapper.find('.badge-wl').exists()).toBe(true)
})
```

| Kebutuhan | Solusi di Test |
| --- | --- |
| Komponen pakai `<RouterLink>` | `global.stubs.RouterLink` |
| Komponen baca Pinia store | `setActivePinia(createPinia())` + isi store |
| Komponen emit event | `wrapper.emitted('nama')` |
| Komponen panggil API | `vi.fn()` mock axios/fetch |

> 💡 **Tips:** Tujuan test adalah menguji **komponen**, bukan store/router. Oleh karena itu kita **stub** keduanya — memberikan nilai tiruan agar komponen bisa jalan terisolasi.

---

## 🧱 Testing Integration (Mount Komponen + Store Nyata)

Berbeda dengan unit test (stub semua), **integration test** memakai store & composable **asli** untuk menguji alur lengkap.

```javascript
// BrowseView.test.js — integration test
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { movieService } from '@/services/movieService'
import BrowseView from '@/views/BrowseView.vue'

// ① Mock HANYA layer HTTP (service), sisanya asli
vi.mock('@/services/movieService')

describe('BrowseView integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('menampilkan film setelah data tiba', async () => {
    // ② Service kembalikan data tiruan
    movieService.getTrending.mockResolvedValue([
      { id: 1, title: 'A' },
      { id: 2, title: 'B' },
    ])

    const wrapper = mount(BrowseView)
    await vi.waitFor(() => {
      expect(wrapper.findAll('.movie-card').length).toBe(2)
    })
  })
})
```

| Jenis Test | Mock Apa | Kelebihan |
| --- | --- | --- |
| **Unit** | Semuanya (stub store/router) | Cepat, isolasi tinggi |
| **Integration** | Hanya HTTP (service) | Uji alur nyata, tetap tanpa jaringan |

> 💡 **Tips:** Integration test menangkap bug yang luput dari unit test — misal komponen lupa memanggil service, atau store salah mapping data. Gunakan untuk alur kritis (login, checkout).

---

## 📏 Best Practices: Komposisi Komponen & Atomic Design

Selain struktur folder, ada filosofi **Atomic Design** untuk membagi komponen berdasarkan kompleksitas:

```
ATOMIC DESIGN (dari kecil ke besar):
  ┌─ Atoms      → Tombol, Input, Label, Icon  (tak punya child komponen)
  ├─ Molecules  → SearchBar (Input + Tombol), KartuProfil (Avatar + Teks)
  ├─ Organisms  → Navbar, MovieRow (gabungan molecule)
  ├─ Templates  → Tata letak halaman (slot kosong)
  └─ Pages      → Halaman nyata (isi data ke template)
```

```text
src/components/
├── atoms/        ← BaseButton, BaseInput, Icon, Badge
├── molecules/    ← SearchBar, MovieCard, ProfilKecil
├── organisms/    ← Navbar, MovieRow, HeroBanner
└── templates/    ← MainLayout (slot: header/sidebar/content)
```

| Level | Contoh | Menerima Props? | Emit Event? |
| --- | --- | --- | --- |
| Atom | `BaseButton` | `label`, `disabled` | `klik` |
| Molecule | `SearchBar` | `placeholder` | `cari` |
| Organism | `Navbar` | `user` | `logout` |
| Page | `BrowseView` | route params | (route guard) |

> 💡 **Tips:** Atomic Design **tidak wajib**, tapi memberi vocab tim: "itu atom", "itu organism". Kombinasikan dengan by-feature: `components/movie/atoms/`, `components/movie/molecules/` bila perlu sangat rapi.

---

## 🧼 Linting, Formatting & Git Hooks (Husky)

Best practice produksi bukan hanya soal kode — tapi **alur kerja** yang mencegah kode jelek masuk repo.

```bash
# Install tooling
npm install -D eslint eslint-plugin-vue prettier
npm install -D husky lint-staged
```

```json
// package.json — jalankan test & lint sebelum commit
{
  "scripts": {
    "lint": "eslint . --ext .vue,.js",
    "format": "prettier --write src/",
    "test": "vitest run"
  },
  "lint-staged": {
    "*.{vue,js}": ["eslint --fix", "prettier --write"]
  }
}
```

```bash
# Husky: pasang pre-commit hook
npx husky init
echo "npx lint-staged && npm run test" > .husky/pre-commit
```

```
ALUR TANPA HUSKY:
  Developer tulis kode berantakan → git commit → masuk repo 😱

ALUR DENGAN HUSKY:
  Developer git commit
     ↓
  Husky jalankan lint-staged (fix otomatis)
     ↓
  Lalu jalankan `npm run test`
     ↓
  KALAU TEST GAGAL → commit DITOLAK ✅ (bug tak masuk)
```

| Tool | Fungsi |
| --- | --- |
| **ESLint** | Deteksi pola kode bermasalah (unused var, aturan Vue) |
| **Prettier** | Format rapi otomatis (indent, quotes) |
| **Husky** | Jalankan script saat git hook (pre-commit) |
| **lint-staged** | Hanya proses file yang berubah |

> 💡 **Tips:** Husky + lint-staged membuat **setiap commit** otomatis rapi & lulus test dasar. Ini "jaring pengaman" murah yang menyelamatkan tim dari kode berantakan di main branch.

---

## 🚨 Jebakan Umum Pemula di Bab 23

### ❌ Jebakan 1 — Lupa `await` pada `trigger`/`setValue`

```javascript
// ❌ SALAH: assertion jalan sebelum Vue update
it('emit saat klik', () => {
  const wrapper = mount(MovieCard, { props: propsDefault })
  wrapper.trigger('click') // ❌ Tidak di-await
  expect(wrapper.emitted('klik-film')).toBeTruthy() // Gagal flaky!
})

// ✅ BENAR: selalu await interaksi
it('emit saat klik', async () => {
  const wrapper = mount(MovieCard, { props: propsDefault })
  await wrapper.trigger('click') // ✅ Tunggu Vue selesai
  expect(wrapper.emitted('klik-film')).toBeTruthy()
})
```

> ✅ **Solusi:** Jadikan test `async` dan `await` setiap `trigger`/`setValue`.

---

### ❌ Jebakan 2 — Memanggil API Sungguhan di Test

```javascript
// ❌ SALAH: test bergantung jaringan → lambat & flaky
it('fetch film', async () => {
  const { data } = useFetch('https://api.tmdb.org/3/trending')
  // ❌ Butuh internet, bisa timeout, hasil berubah tiap hari
})

// ✅ BENAR: mock fetch
global.fetch = vi.fn(async () => ({
  ok: true,
  json: async () => ({ results: [] }),
}))
// ✅ Test cepat, deterministik, tidak butuh internet
```

> ✅ **Solusi:** Gunakan `vi.fn()` untuk mock `fetch`/axios di test unit.

---

### ❌ Jebakan 3 — `shallowRef` tapi Mengubah Nested Property

```javascript
// ❌ SALAH: nested change tidak memicu re-render
const films = shallowRef([{ id: 1, title: 'A' }])
films.value[0].title = 'B' // ❌ Tidak reaktif!

// ✅ BENAR: ganti seluruh referensi
films.value = [{ id: 1, title: 'B' }]

// ✅ ATAU paksa dengan triggerRef
films.value[0].title = 'B'
triggerRef(films)
```

> ✅ **Solusi:** Untuk `shallowRef`, ganti seluruh array/objek atau panggil `triggerRef` saat ubah nested.

---

### ❌ Jebakan 4 — Semua View Di-import Langsung (Tanpa Lazy)

```javascript
// ❌ SALAH: 1 bundle raksasa, loading lambat
import HomeView from '@/views/HomeView.vue'
import BrowseView from '@/views/BrowseView.vue'

// ✅ BENAR: code-splitting per route
const HomeView = () => import('@/views/HomeView.vue')
const BrowseView = () => import('@/views/BrowseView.vue')
```

> ✅ **Solusi:** Gunakan dynamic `import()` untuk semua view di router agar bundle terpecah.

---

### ❌ Jebakan 5 — Struktur Folder Tanpa Kategori (Flat Chaos)

```text
❌ BURUK: 100 file di satu folder components/
components/
  ├── Navbar.vue
  ├── MovieCard.vue
  ├── UserCard.vue
  ├── OrderCard.vue
  ├── ... (97 file lain, susah dicari)

✅ BAIK: dikelompokkan per domain
components/
  ├── layout/ (Navbar, Footer)
  ├── movie/  (MovieCard, MovieModal)
  ├── user/   (UserCard)
  └── ui/     (BaseButton, BaseInput)
```

> ✅ **Solusi:** Kelompokkan berdasarkan domain, bukan menumpuk semua di satu folder.

---

### ❌ Jebakan 6 — Mengukur Performa di Dev Server (Bukan Production)

```javascript
// ❌ SALAH: angka dev server menipu
// Dev server: HMR aktif, TIDAK di-minify, sourcemap besar
// → "bundle 4MB, load 3dtk" adalah ANGKA PALSU

// ✅ BENAR: ukur di build production
npm run build     // minify + tree-shake
npm run preview   // serve hasil build
// lalu buka DevTools → Lighthouse → analisis angka nyata
```

> ✅ **Solusi:** Selalu ukur performa di **`npm run build && npm run preview`**, bukan dev server. Dev server punya overhead yang membuat angka jauh lebih buruk dari kenyataan.

---

### ❌ Jebakan 7 — Menambah `v-memo` ke Seluruh Template

```vue
<!-- ❌ SALAH: v-memo di mana-mana → bug tersembunyi -->
<template>
  <!-- kalau deps salah, perubahan data TAK tampil -->
  <div v-memo="[userId]">
    <span>{{ user.nama }}</span>  <!-- nama TAK update kalau hanya nama berubah! -->
  </div>

  <!-- ✅ BENAR: hanya di blok MAHAL & deps TEPAT -->
  <div v-memo="[user.id, user.vote_average]">
    <MovieCard :film="user" />
  </div>
</template>
```

> ✅ **Solusi:** `v-memo` hanya untuk blok mahal dengan dependensi **yang kamu yakini**. Jangan asal pasang — bisa menyembunyikan update data yang seharusnya tampil (bug sulit dilacak).

---

## 📝 Ringkasan Bab 23

| Konsep | Penjelasan |
| --- | --- |
| **`v-once`** | Render sekali, tidak pernah update lagi — untuk konten statis |
| **`shallowRef` / `shallowReactive`** | Reaktivitas dangkal (hanya level atas) — hemat untuk data besar |
| **`triggerRef`** | Paksa update manual saat ubah nested pada shallowRef |
| **`v-memo="[deps]"`** | Bekukan blok kecuali `deps` berubah — cegah re-render mahal |
| **Lazy route** | `() => import()` memecah bundle per halaman → loading lebih cepat |
| **Virtual scrolling** | Render hanya item terlihat untuk list 1000+ (pakai library) |
| **Vitest** | Test runner cepat terintegrasi Vite; `describe`/`it`/`expect` |
| **Vue Test Utils** | `mount()` me-render komponen di test environment |
| **`find` / `findAll`** | Cari elemen/komponen dalam wrapper |
| **`trigger` / `setValue`** | Simulasikan event & input — **harus `await`** |
| **`emitted('x')`** | Ambil daftar event yang di-emit komponen |
| **Test composable** | Pakai komponen host + `vi.fn` mock + `vi.waitFor` |
| **Folder by-type** | Kelompokkan per jenis file — cocok project kecil |
| **Folder by-feature** | Kelompokkan per domain (movie/, user/) — cocok project besar |
| **Konvensi `Base*`/`use*`** | Penamaan standar: UI generik & composable |

---

## 🎯 Latihan Mandiri

**⭐ Latihan 1 — Test Komponen Sederhana**

Buat komponen `BaseButton.vue` (props: `label`, `disabled`; emit: `klik`). Tulis `BaseButton.test.js` dengan minimal 3 test: menampilkan label, emit `klik` saat aktif, dan **tidak** emit saat `disabled`. Pastikan semua `await` benar.

**⭐⭐ Latihan 2 — Optimasi dengan `shallowRef` & `v-memo`**

Ambil komponen grid film. Ganti state list film dari `ref` ke `shallowRef`, dan tambahkan `v-memo="[film.id, film.vote_average]"` pada tiap kartu. Buktikan (via `console.log` di `render` atau `onUpdated`) bahwa mengubah nested property tidak memicu re-render, tapi mengganti array memicu re-render.

**⭐⭐⭐ Latihan 3 — Test Composable `useFetch`**

Implementasikan `useFetch.js` (mengembalikan `{ data, isLoading, error, fetch }`). Tulis test yang mem-**mock** `fetch` dengan `vi.fn`: satu skenario sukses (memastikan `data` terisi, `isLoading` false, `error` null) dan satu skenario gagal (status 500, memastikan `error` terisi). Gunakan komponen host + `vi.waitFor`.

**⭐⭐⭐⭐ Latihan 4 — Restrukturisasi & Lazy Route**

Ambil project Netflix clone kamu. (a) Pastikan semua route di `router/index.js` menggunakan `() => import()` (lazy). (b) Susun ulang folder `components/` menjadi `layout/`, `movie/`, dan `ui/` sesuai struktur by-feature. (c) Tambahkan test `MovieCard` dan jalankan `npm run test` hingga hijau.

---

*Lanjut ke ➡️ **BAGIAN VII — Project: Clone Netflix***
