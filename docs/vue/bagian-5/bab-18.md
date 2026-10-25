# 🧭 Bab 18 — Vue Router Lanjutan & Best Practices

> *"Navigasi yang baik bukan sekadar pindah halaman — ia adalah transisi yang membuat pengguna merasa diajak jalan, bukan dilempar."*

---

> **🧠 Apa Itu Advanced Routing?**
>
> Setelah menguasai dasar router (Bab 17), ada lapisan fitur yang mengangkat aplikasi dari "berfungsi" menjadi "profesional": **animasi transisi antar halaman**, **route meta untuk kontrol layout & akses**, **nested routes** (halaman bersarang), **route props** (mengubah params jadi props), dan **strategi lazy vs eager loading**. Semua ini bertujuan membuat navigasi lebih mulus, kode lebih rapi, dan pengalaman pengguna lebih premium — seperti yang terlihat di aplikasi Netlifx sesungguhnya.

---

> **🏗️ Analogi Sederhana:**
>
> Bayangkan router dasar seperti pintu putar bandara: kamu masuk di satu sisi, keluar di sisi lain, **klik** langsung pindah. Router lanjutan seperti **perlintasan pesawat ramp** ber-AC dengan lampu redup dan musik transisi: kamu masih pindah dari gate A ke gate B, tapi rasanya menyenangkan dan halus. Nested routes ibarat **kamar di dalam kamar** (suite hotel: kamar tidur + kamar mandi kecil di dalamnya, keduanya tetap dalam satu suite). Route props seperti **pelayan yang langsung menaruh pesanan di tanganmu** (props) alih-alih menyuruhmu mengambil sendiri dari meja resepsionis (route.params).

---

## 📋 Daftar Isi Bab 18

1. Transisi Antar Halaman dengan `<Transition>` + `<RouterView v-slot>`
2. Memahami `mode` pada Transition (out-in vs default)
3. Animasi `mode` Lanjut — Slide, Scale, dan Kombinasi
4. Route Meta — Kontrol Layout, Auth, dan Title
5. Catch-All 404 — Halaman Tidak Ditemukan yang Rapi
6. Nested Routes — Halaman Bersarang (children)
7. Route Props — Mengubah Params Menjadi Props
8. Lazy vs Eager Loading — Kapan Mana?
9. KeepAlive + Transition untuk Cache Halaman
10. Studi Kasus — SPA Netflix dengan Transisi & Meta
11. Jebakan Umum Pemula di Bab 18
12. Ringkasan & Latihan Mandiri

---

## 🎭 Transisi Antar Halaman dengan `<Transition>` + `<RouterView v-slot>`

Vue memiliki komponen bawaan `<Transition>` untuk menganimasikan elemen yang muncul/hilang. Karena `<RouterView>` merender komponen halaman yang berbeda tiap route, kita **bungkus** ia dengan `<Transition>` untuk menganimasikan setiap pergantian halaman.

```vue
<!-- App.vue — Tambahkan animasi saat pindah route -->
<template>
  <RouterView v-slot="{ Component }">
    <!-- Component = komponen halaman yang sedang aktif -->
    <Transition name="fade" mode="out-in">
      <component :is="Component" :key="$route.path" />
    </Transition>
  </RouterView>
</template>

<style>
/* Kelas transisi otomatis dibentuk dari name="fade" */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0; /* Keadaan awal masuk & akhir keluar = transparan */
}
</style>
```

### Bedah Tiap Bagian

| Bagian | Fungsi |
| --- | --- |
| `RouterView v-slot="{ Component }"` | Mengambil komponen halaman aktif via scoped slot |
| `<Transition name="fade">` | Mengaktifkan transisi bernama `fade` |
| `mode="out-in"` | Halaman lama **keluar dulu**, baru yang baru **masuk** |
| `:key="$route.path"` | Kunci unik agar Vue tahu komponen berubah → picu transisi |
| `.fade-enter-from` / `.fade-leave-to` | Keadaan opacity 0 (awal masuk / akhir keluar) |

> 💡 **Tips:** Kelas CSS transisi dihasilkan dari `name`. Karena kita pakai `name="fade"`, Vue otomatis membuat `fade-enter-active`, `fade-leave-to`, dll. Ganti `fade` dengan `slide` untuk efek berbeda.

---

## 🔄 Memahami `mode` pada Transition

`<Transition>` punya 3 nilai `mode`:

```
mode="in-out"  → halaman BARU masuk dulu, lama keluar SETELAHnya
mode="out-in"  → halaman LAMA keluar dulu, baru yang baru masuk (REKOMENDASI)
mode default   → keduanya transisi BERSAMAAN (bisa tumpang tindih)
```

```vue
<!-- Tanpa mode: kedua halaman ada di layar bersamaan → layout melompat -->
<Transition name="fade">
  <component :is="Component" :key="$route.path" />
</Transition>

<!-- Dengan mode="out-in": rapi, tidak tumpang tindih -->
<Transition name="fade" mode="out-in">
  <component :is="Component" :key="$route.path" />
</Transition>
```

| `mode` | Urutan | Risiko Layout |
| --- | --- | --- |
| `out-in` | Keluar → Masuk | 🟢 Aman, tidak tumpang tindih |
| `in-out` | Masuk → Keluar | 🟡 Bisa tumpang tindih sesaat |
| default | Bersamaan | 🔴 Sering melompat |

> ⚠️ **Catatan:** Untuk halaman penuh (full page), **selalu** gunakan `mode="out-in"`. Transisi bersamaan hanya cocok untuk elemen kecil (badge, tooltip).

---

## 🎨 Animasi Lanjut — Slide, Scale, dan Kombinasi

Kamu bebas mendefinisikan CSS apa pun di kelas transisi. Berikut beberapa preset populer.

```vue
<!-- Slide dari kanan -->
<style>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from {
  transform: translateX(30px); /* Mulai geser kanan */
}
.slide-leave-to {
  transform: translateX(-30px); /* Keluar ke kiri */
}
</style>

<!-- Scale + fade (efek "pop") -->
<style>
.pop-enter-active { transition: all 0.25s ease-out; }
.pop-leave-active { transition: all 0.2s ease-in; }
.pop-enter-from {
  opacity: 0;
  transform: scale(0.96); /* Sedikit mengecil saat masuk */
}
.pop-leave-to {
  opacity: 0;
  transform: scale(1.02); /* Sedikit membesar saat keluar */
}
</style>
```

```vue
<!-- App.vue dengan preset berbeda per route (opsional lanjut) -->
<template>
  <RouterView v-slot="{ Component, route }">
    <!-- Pilih nama transisi berdasar meta.transition -->
    <Transition :name="route.meta.transition || 'fade'" mode="out-in">
      <component :is="Component" :key="route.path" />
    </Transition>
  </RouterView>
</template>
```

> 💡 **Tips:** Untuk performa animasi terbaik, animasikan hanya `opacity` dan `transform`. Keduanya di-handle GPU dan tidak memicu reflow layout yang mahal. Hindari menganimasikan `width`, `height`, atau `top`/`left`.

---

## 🏷️ Route Meta — Kontrol Layout, Auth, dan Title

`meta` adalah objek bebas yang bisa kita tempelkan ke route. Ia sangat fleksibel: digunakan untuk auth guard (Bab 17), memilih layout, hingga mengatur document title.

```javascript
// router/index.js
const routes = [
  {
    path: '/browse',
    name: 'browse',
    component: BrowseView,
    meta: {
      requiresAuth: true,        // butuh login (dicek guard)
      layout: 'main',            // pakai layout dengan navbar
      title: 'Browse — Netflix Clone', // untuk document title
    },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      requiresGuest: true,
      layout: 'blank',           // layout tanpa navbar
      title: 'Masuk — Netflix Clone',
    },
  },
]
```

```vue
<!-- App.vue — pilih layout dari meta -->
<template>
  <!-- Layout dipilih dinamis dari route.meta.layout -->
  <component :is="layoutSaatIni">
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" :key="$route.path" />
      </Transition>
    </RouterView>
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'

const route = useRoute()

// Pilih layout berdasar meta.layout (default 'main')
const layouts = { main: MainLayout, blank: BlankLayout }
const layoutSaatIni = computed(() => layouts[route.meta.layout] || MainLayout)
</script>
```

```javascript
// Mengatur document title via global afterEach guard
router.afterEach((to) => {
  // afterEach jalan SETELAH navigasi selesai
  document.title = to.meta.title || 'Netflix Clone'
})
```

| Kegunaan `meta` | Contoh Key | Manfaat |
| --- | --- | --- |
| Auth | `requiresAuth`, `requiresGuest` | Guard global membaca ini |
| Layout | `layout: 'main'` | Pilih layout tanpa navbar/footer |
| Title | `title: 'Browse'` | Set `<title>` dokumen |
| Transisi | `transition: 'slide'` | Pilih efek animasi per halaman |
| Breadcrumb | `breadcrumb: 'Home / Browse'` | Tampilkan navigasi hierarki |

---

## 🚧 Catch-All 404 — Halaman Tidak Ditemukan yang Rapi

Route terakhir `'/:pathMatch(.*)*'` adalah **wildcard** yang menangkap semua URL yang tidak cocok dengan rute manapun. Ini cara standar membuat halaman Not Found.

```javascript
const routes = [
  // ...semua route spesifik di atas...
  {
    path: '/:pathMatch(.*)*', // cocok APA SAJA yang tersisa
    name: 'not-found',
    component: NotFoundView,
  },
]
```

```vue
<!-- NotFoundView.vue -->
<template>
  <div class="not-found">
    <h1>404</h1>
    <p>Ups! Halaman yang kamu cari tidak ditemukan.</p>
    <RouterLink :to="{ name: 'home' }">← Kembali ke Beranda</RouterLink>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 80px 20px;
}
.not-found h1 {
  font-size: 6rem;
  color: #e50914;
}
</style>
```

```javascript
// Wildcard juga bisa menangkap bagian spesifik untuk ditampilkan
// path: '/user/:pathMatch(.*)*' → menangkap /user/apa/saja
// route.params.pathMatch = ['apa', 'saja']  (array!)
```

> ⚠️ **Catatan Penting:** Selalu letakkan catch-all route di **paling bawah** array routes. Router mencocokkan dari atas ke bawah; jika wildcard di atas, semua URL langsung dianggap 404.

---

## 🪆 Nested Routes — Halaman Bersarang (children)

Sering kali satu halaman punya **sub-bagian** yang tetap menampilkan kerangka yang sama. Nested routes memungkinkan komponen induk merender `<RouterView>` kedua untuk menampung child route.

```javascript
// router/index.js — profil punya sub-tab
const routes = [
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,        // ← induk, punya <RouterView> sendiri
    meta: { requiresAuth: true },
    children: [
      {
        path: '',                  // default → /profile
        name: 'profile-overview',
        component: ProfileOverview,
      },
      {
        path: 'watchlist',         // → /profile/watchlist
        name: 'profile-watchlist',
        component: ProfileWatchlist,
      },
      {
        path: 'settings',          // → /profile/settings
        name: 'profile-settings',
        component: ProfileSettings,
      },
    ],
  },
]
```

```vue
<!-- ProfileView.vue — induk dengan RouterView ke-2 -->
<template>
  <div class="profil">
    <h1>Profil Saya</h1>

    <!-- Navigasi antar child -->
    <nav class="tab">
      <RouterLink :to="{ name: 'profile-overview' }">Overview</RouterLink>
      <RouterLink :to="{ name: 'profile-watchlist' }">Watchlist</RouterLink>
      <RouterLink :to="{ name: 'profile-settings' }">Pengaturan</RouterLink>
    </nav>

    <!-- Child route dirender DI SINI -->
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>
```

```
Struktur URL & komponen:
/profile            → ProfileView + ProfileOverview
/profile/watchlist  → ProfileView + ProfileWatchlist
/profile/settings   → ProfileView + ProfileSettings
        ↑ ProfileView tetap ada (tidak di-mount ulang) ✅
```

| Tanpa Nested | Dengan Nested |
| --- | --- |
| Setiap tab = route terpisah, navbar diulang tiap file | Navbar profil sekali di induk, child ganti isi |
| Duplikasi layout | Layout bersama, DRY |
| State induk hilang saat ganti tab | State induk tetap hidup |

---

## 🎁 Route Props — Mengubah Params Menjadi Props

Secara default, untuk membaca param kita pakai `route.params.id` di dalam komponen. Dengan `props: true`, Vue Router **meneruskan params sebagai props** — lebih bersih dan komponen jadi lebih reusable.

```javascript
// Tanpa props: komponen harus import useRoute
// Dengan props: komponen terima id lewat props seperti komponen biasa
const routes = [
  {
    path: '/movie/:id',
    name: 'movie-detail',
    component: MovieDetailView,
    props: true, // ← aktifkan: params.id jadi prop "id"
  },
]
```

```vue
<!-- MovieDetailView.vue -->
<script setup>
// Sekarang terima sebagai props biasa, TANPA useRoute!
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

console.log(props.id) // '123' — langsung dari URL
</script>
```

```javascript
// Bisa juga props berupa fungsi (untuk transformasi/static)
const routes = [
  {
    path: '/movie/:id',
    component: MovieDetailView,
    // Return object apa pun → jadi props
    props: (route) => ({
      id: Number(route.params.id), // konversi ke number
      fromSearch: route.query.from === 'search',
    }),
  },
]
```

| Cara | Sintaks | Kapan |
| --- | --- | --- |
| `props: true` | Meneruskan semua params | Param langsung jadi props |
| `props: { default: 1 }` | Object statis | Nilai tetap |
| `props: (route) => ({...})` | Fungsi | Perlu transformasi (string→number, gabung query) |

> 💡 **Tips:** Komponen yang menerima data lewat `props` jauh lebih mudah di-test dan di-reuse (bisa dipakai di luar router). Ini pola yang disukai untuk komponen "presentational".

---

## 🐌 Lazy vs Eager Loading — Kapan Mana?

Di Bab 17 kita pakai lazy loading. Tapi kapan sebaiknya eager (langsung import)?

```javascript
// LAZY — default untuk views besar
const BrowseView = () => import('@/views/BrowseView.vue')

// EAGER — untuk komponen sangat kecil & SERING dibuka
import NotFoundView from '@/views/NotFoundView.vue' // 404 kecil, langsung ada
```

| Skenario | Rekomendasi | Alasan |
| --- | --- | --- |
| Halaman besar (Browse, Detail) | 🟢 Lazy | Pangkas initial bundle |
| Halaman 404 (kecil) | 🟡 Eager | User butuh cepat, ukuran kecil |
| Landing page (`/`) | 🟡 Eager (atau preload) | Pertama kali dibuka, ingin instan |
| Admin/rarely-used page | 🟢 Lazy | Jarang diakses |
| Komponen di `components/` | 🟡 Eager | Biasanya sudah partial, bukan route |

```javascript
// Group lazy loading: beberapa view digabung 1 chunk
// (berguna kalau sering dipakai bersama)
const UserDashboard = () => import(/* webpackChunkName: "user" */ '@/views/UserDashboard.vue')
const UserSettings  = () => import(/* webpackChunkName: "user" */ '@/views/UserSettings.vue')
// Keduanya masuk ke chunk "user.js" yang sama
```

> ⚠️ **Catatan:** Vite mendukung komentar `/* webpackChunkName */` untuk menamai chunk, atau secara otomatis mengelompokkan berdasar folder. Tidak wajib, tapi membantu debugging bundle.

---

## 🔒 KeepAlive + Transition untuk Cache Halaman

`<KeepAlive>` mencegah komponen di-destroy saat disembunyikan — state-nya **tetap hidup**. Digabung dengan `<Transition>`, kita dapat cache + animasi sekaligus.

```vue
<!-- App.vue -->
<template>
  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <!-- KeepAlive: cache komponen yang listed di :include -->
      <KeepAlive :include="['SearchView', 'BrowseView']">
        <component :is="Component" :key="$route.path" />
      </KeepAlive>
    </Transition>
  </RouterView>
</template>
```

```
Tanpa KeepAlive:
  User buka Search → ketik "batman" → pindah ke Browse → kembali Search
  → hasil "batman" HILANG (SearchView di-mount ulang kosong) ❌

Denga KeepAlive:
  → hasil "batman" TETAP ADA ✅ (komponen tidak di-destroy)
```

```vue
<!-- Komponen yang di-cache bisa hook lifecycle khusus -->
<script setup>
import { onActivated, onDeactivated } from 'vue'

// onActivated → saat komponen dimunculkan kembali dari cache
onActivated(() => {
  console.log('SearchView aktif lagi — data masih utuh')
})

// onDeactivated → saat komponen disembunyikan ke cache
onDeactivated(() => {
  console.log('SearchView disembunyikan — state disimpan di cache')
})
</script>
```

| Fitur | Fungsi |
| --- | --- |
| `KeepAlive :include` | Hanya cache komponen dengan nama tersebut |
| `KeepAlive :exclude` | Jangan cache komponen ini |
| `KeepAlive :max` | Batas jumlah komponen di-cache (misal `:max="10"`) |
| `onActivated` | Hook saat komponen diaktifkan dari cache |
| `onDeactivated` | Hook saat komponen dinonaktifkan ke cache |

> 💡 **Tips:** Jangan cache terlalu banyak halaman (memory naik). Batasi dengan `:include` hanya untuk halaman yang benar-benar butuh state bertahan, seperti Search atau form panjang.

---

## 🎬 Studi Kasus — SPA Netflix dengan Transisi & Meta

**Skenario:** Kita bangun SPA Netflix yang punya landing page (`/`), halaman utama (`/browse`), detail film (`/movie/:id`), dan 404. Setiap pindah halaman memudar halus (`fade`), navbar hanya muncul di halaman yang butuh auth, dan title dokumen berubah sesuai route.

```vue
<!-- App.vue -->
<template>
  <component :is="layoutSaatIni">
    <RouterView v-slot="{ Component, route }">
      <Transition :name="route.meta.transition || 'fade'" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'

const route = useRoute()
const layouts = { main: MainLayout, blank: BlankLayout }
const layoutSaatIni = computed(() => layouts[route.meta.layout] || MainLayout)
</script>
```

```javascript
// router/index.js (inti)
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { requiresGuest: true, layout: 'blank', title: 'Netflix Clone' },
  },
  {
    path: '/browse',
    name: 'browse',
    component: () => import('@/views/BrowseView.vue'),
    meta: { requiresAuth: true, layout: 'main', title: 'Browse' },
  },
  {
    path: '/movie/:id',
    name: 'movie-detail',
    component: () => import('@/views/MovieDetailView.vue'),
    props: true,
    meta: { requiresAuth: true, layout: 'main', title: 'Detail Film' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { layout: 'blank', title: '404' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0, behavior: 'smooth' }),
})

// Set title + auth guard
router.afterEach((to) => { document.title = to.meta.title || 'Netflix Clone' })
router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) return { name: 'home' }
  if (to.meta.requiresGuest && auth.isLoggedIn) return { name: 'browse' }
})
```

**Hasil:** Navigasi terasa premium (fade), navbar muncul hanya di halaman dalam, dan URL salah otomatis ke 404.

---

## 🪟 Named Views — Multiple `<RouterView>` dalam Satu Route

Kadang satu halaman punya **beberapa area** yang masing-masing berbeda komponen (misal: sidebar + konten). Vue Router mendukung **named views**.

```javascript
// router/index.js
const routes = [
  {
    path: '/',
    // component diganti jadi object: default + named views
    components: {
      default: HomeView,     // ← <RouterView/> tanpa nama
      sidebar: SidebarView,  // ← <RouterView name="sidebar"/>
      footer: FooterView,    // ← <RouterView name="footer"/>
    },
  },
]
```

```vue
<!-- App.vue -->
<template>
  <div class="layout">
    <!-- default view -->
    <RouterView />

    <!-- named view: sidebar -->
    <RouterView name="sidebar" />

    <!-- named view: footer -->
    <RouterView name="footer" />
  </div>
</template>
```

```
URL: /
┌─────────────────────────┐
│  <RouterView/>          │ ← HomeView
├──────────┬──────────────┤
│ sidebar  │  footer      │
│ (Side..) │ (FooterView) │
└──────────┴──────────────┘
```

> 💡 **Tips:** Named views sangat berguna untuk layout majemuk (admin panel dengan sidebar, topbar, dan main content berbeda komponen namun satu route).

---

## 🎬 JS Hooks pada Transition — Kontrol Animasi Programatik

Selain CSS, `<Transition>` mendukung **event hooks** (`@enter`, `@leave`) untuk menganimasikan via JavaScript (misal dengan library animasi GSAP).

```vue
<template>
  <RouterView v-slot="{ Component }">
    <Transition
      name="fade"
      mode="out-in"
      @enter="onEnter"
      @leave="onLeave"
    >
      <component :is="Component" :key="$route.path" />
    </Transition>
  </RouterView>
</template>

<script setup>
// done() WAJIB dipanggil agar Vue tahu animasi selesai
function onEnter(el, done) {
  el.style.opacity = 0
  // simulasi animasi JS
  requestAnimationFrame(() => {
    el.style.transition = 'opacity 0.3s'
    el.style.opacity = 1
    setTimeout(done, 300) // panggil done setelah selesai
  })
}

function onLeave(el, done) {
  el.style.transition = 'opacity 0.3s'
  el.style.opacity = 0
  setTimeout(done, 300)
}
</script>
```

| Hook | Dipanggil saat |
| --- | --- |
| `@before-enter` | Sebelum elemen masuk |
| `@enter` (el, done) | Saat masuk; panggil `done()` bila selesai |
| `@after-enter` | Setelah masuk selesai |
| `@before-leave` / `@leave` / `@after-leave` | Sama untuk keluar |

> ⚠️ **Catatan:** Saat pakai JS hooks, Vue **tidak lagi** mengandalkan CSS class. Kamu bertanggung jawab memanggil `done()` agar transisi tidak menggantung.

---

## 🧭 Route Meta untuk Breadcrumb & Transisi Per-Route

Meta bisa dipakai untuk membangun **breadcrumb** (navigasi hierarki) dan memilih **efek transisi berbeda** per halaman.

```javascript
// Breadcrumb dari meta
const routes = [
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { breadcrumb: 'Profil' },
    children: [
      {
        path: 'watchlist',
        name: 'profile-watchlist',
        component: ProfileWatchlist,
        meta: { breadcrumb: 'Watchlist' },
      },
    ],
  },
]
```

```vue
<!-- BreadcrumbView.vue — baca rantai matched -->
<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()

// route.matched = semua route yang cocok (induk + anak)
// kita ambil meta.breadcrumb dari masing-masing
const crumbs = route.matched
  .filter((r) => r.meta.breadcrumb)
  .map((r) => ({ nama: r.meta.breadcrumb, path: r.path }))
</script>

<template>
  <nav class="breadcrumb">
    <span v-for="(c, i) in crumbs" :key="i">
      {{ c.nama }}<span v-if="i < crumbs.length - 1"> / </span>
    </span>
  </nav>
</template>
```

```javascript
// Transisi berbeda per route via meta.transition
const routes = [
  { path: '/browse', component: BrowseView, meta: { transition: 'fade' } },
  { path: '/movie/:id', component: MovieDetailView, meta: { transition: 'slide' } },
]

// App.vue
<RouterView v-slot="{ Component, route }">
  <Transition :name="route.meta.transition || 'fade'" mode="out-in">
    <component :is="Component" :key="route.path" />
  </Transition>
</RouterView>
```

---

## 🧩 Kombinasi Lazy Loading + Named Chunk Grouping

Selain `webpackChunkName`, Vite mengelompokkan chunk berdasar folder. Kita bisa juga memaksa beberapa view ke satu chunk agar navigasi antar mereka tidak perlu load ulang.

```javascript
// Semua view di bawah /admin/ digabung ke chunk "admin"
const AdminDashboard = () => import(
  /* webpackChunkName: "admin" */ '@/views/admin/Dashboard.vue'
)
const AdminUsers = () => import(
  /* webpackChunkName: "admin" */ '@/views/admin/Users.vue'
)
const AdminSettings = () => import(
  /* webpackChunkName: "admin" */ '@/views/admin/Settings.vue'
)
// Ketiga file → 1 file admin.[hash].js
```

```javascript
// Eager untuk yang kritis & kecil (404)
import NotFoundView from '@/views/NotFoundView.vue'

// Lazy untuk yang berat
const BrowseView = () => import('@/views/BrowseView.vue')
```

| Strategi | Kapan |
| --- | --- |
| Group chunk (`webpackChunkName`) | Beberapa view sering dibuka berurutan |
| Lazy biasa | View besar & jarang |
| Eager | View kecil & kritis (404, landing) |

---

## 🔗 `<RouterLink>` dengan `v-slot` (Custom Rendering)

`<RouterLink>` bisa dikontrol penuh tampilannya via scoped slot — berguna untuk membungkus elemen non-`<a>` atau menambah ikon aktif kustom.

```vue
<template>
  <!-- Default: RouterLink render <a> -->
  <RouterLink :to="{ name: 'browse' }">Browse</RouterLink>

  <!-- v-slot: kita render sendiri -->
  <RouterLink :to="{ name: 'browse' }" v-slot="{ href, isActive, isExactActive, navigate }">
    <a
      :href="href"
      @click="navigate"
      :class="{ 'aktif': isActive, 'exact': isExactActive }"
    >
      🎬 Browse
      <span v-if="isActive">✓</span>
    </a>
  </RouterLink>
</template>
```

| Slot Prop | Arti |
| --- | --- |
| `href` | URL tujuan |
| `route` | Object route tujuan |
| `isActive` | True jika route aktif (inkl. child) |
| `isExactActive` | True jika persis cocok |
| `navigate` | Fungsi untuk trigger navigasi (pakai di @click) |

> 💡 **Tips:** `v-slot` pada RouterLink berguna saat ingin membungkus `<li>`, `<button>`, atau komponen UI (misal `BaseButton`) sebagai link tanpa kehilangan perilaku SPA.

---

## 🎯 Optional Params & Regex Matching

Route bisa punya **parameter opsional** (akhiran `?`) dan **pola regex** untuk validasi.

```javascript
// Optional param: /user/123 atau /user sama-sama cocok
// tanda '?' setelah :id → opsional
{ path: '/user/:id?', name: 'user', component: UserView }
//   /user      → params.id = undefined
//   /user/123  → params.id = '123'

// Regex: hanya angka yang cocok
// '\\d+' → satu atau lebih digit
{ path: '/movie/:id(\\d+)', name: 'movie-detail', component: MovieDetailView }
//   /movie/123   → cocok ✅
//   /movie/abc   → TIDAK cocok → jatuh ke not-found ❌

// Kombinasi: optional + regex
{ path: '/page/:slug(\\w+)?', component: PageView }
```

```
Pola regex umum:
  (\\d+)        → hanya angka
  (\\w+)        → alphanumeric + underscore
  ([a-z]+)      → hanya huruf kecil
  (.+)          → apa saja (termasuk slash, hati-hati!)
```

> ⚠️ **Catatan:** Regex di dalam string JS butuh double backslash (`\\d`). Satu backslash akan "dimakan" oleh string literal JavaScript sebelum sampai ke router.

---

## 🚀 Lazy Load Preload (Prefetch) untuk UX Lebih Cepat

Lazy loading mempercepat load awal, tapi halaman baru tetap ada jeda saat chunk di-download pertama kali. Solusinya: **preload** (atau prefetch) chunk sebelum user mengklik.

```javascript
// Manual preload: panggil dynamic import saat user hover link
function preloadBrowse() {
  // import yang SAMA dengan route → Vite cache chunk-nya
  import('@/views/BrowseView.vue')
}

// Di template: preload saat hover/focus
<RouterLink
  :to="{ name: 'browse' }"
  @mouseenter="preloadBrowse"
  @focus="preloadBrowse"
>
  Browse
</RouterLink>
```

```javascript
// Atau di script saat komponen mount (prefetch diam-diam)
onMounted(() => {
  // Mulai download chunk Browse di background (low priority)
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = '/assets/BrowseView-[hash].js' // path chunk hasil build
  document.head.appendChild(link)
})
```

| Strategi | Kapan Download | Dampak UX |
| --- | --- | --- |
| Lazy (default) | Saat route diklik | Jeda singkat pertama kali |
| Preload on hover | Saat kursor di link | Praktis tanpa jeda |
| Prefetch idle | Saat browser idle | Siap sebelum diklik |

> 💡 **Tips:** Preload `onMouseEnter` adalah trik murah yang sangat efektif — pengguna hampir selalu "hover" sebelum klik, sehingga chunk biasanya sudah siap saat klik terjadi.

---

## 🎞️ TransitionGroup untuk List Film (Animasi Grid)

`<Transition>` untuk satu elemen; untuk **list** (seperti grid film) pakai `<TransitionGroup>` — menganimasikan tiap item saat ditambah/dihapus/diurutkan.

```vue
<template>
  <!-- TransitionGroup: animasi untuk list yang berubah -->
  <TransitionGroup name="film-list" tag="div" class="movie-grid">
    <MovieCard
      v-for="film in filmTerfilter"
      :key="film.id"
      :film="film"
    />
  </TransitionGroup>
</template>

<style>
/* Animasi masuk: fade + slide dari bawah */
.film-list-enter-active {
  transition: all 0.4s ease;
}
.film-list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

/* Animasi keluar: fade */
.film-list-leave-active {
  transition: opacity 0.3s ease;
  position: absolute; /* agar item lain mengisi celah saat keluar */
}
.film-list-leave-to {
  opacity: 0;
}

/* Animasi geser saat urutan berubah */
.film-list-move {
  transition: transform 0.4s ease;
}
</style>
```

| Kelas TransitionGroup | Kapan |
| --- | --- |
| `film-list-enter-from` | Item baru muncul |
| `film-list-leave-to` | Item dihapus |
| `film-list-move` | Posisi item bergeser (urutann berubah) |

> 💡 **Tips:** Beri `position: absolute` pada `.leave-active` agar item yang keluar tidak menduduki ruang, sehingga item lain bisa bergerak mengisi (efek `.move` terlihat mulus).

---

## 🚨 Jebakan Umum Pemula di Bab 18

### ❌ Jebakan 1 — Lupa `:key` pada `<component>` di Transition
```vue
<!-- ❌ SALAH — transisi tidak terpicu jika komponen sama -->
<Transition name="fade" mode="out-in">
  <component :is="Component" />
</Transition>

<!-- ✅ BENAR — key unik memaksa transisi -->
<Transition name="fade" mode="out-in">
  <component :is="Component" :key="$route.path" />
</Transition>
```

---

### ❌ Jebakan 2 — Tanpa `mode="out-in"` untuk Full Page
```vue
<!-- ❌ SALAH — halaman tumpang tindih, layout lompat -->
<Transition name="fade">
  <component :is="Component" :key="$route.path" />
</Transition>

<!-- ✅ BENAR -->
<Transition name="fade" mode="out-in">
  <component :is="Component" :key="$route.path" />
</Transition>
```

---

### ❌ Jebakan 3 — Animasikan Property Mahal (width/height)
```css
/* ❌ SALAH — memicu reflow, lambat */
.fade-enter-from { width: 0; }

/* ✅ BENAR — hanya opacity & transform (GPU) */
.fade-enter-from { opacity: 0; transform: translateY(10px); }
```

---

### ❌ Jebakan 4 — Nested Route Lupa `<RouterView>` ke-2 di Induk
```vue
<!-- ❌ SALAH — child tidak punya tempat untuk render -->
<template>
  <div>Profil</div>
  <!-- lupa RouterView → child route kosong -->
</template>

<!-- ✅ BENAR -->
<template>
  <div>Profil <RouterView /></div>
</template>
```

---

### ❌ Jebakan 5 — Catch-All Diletakkan Sebelum Route Lain
```javascript
// ❌ SALAH
const routes = [
  { path: '/:pathMatch(.*)*', component: NotFoundView },
  { path: '/browse', component: BrowseView }, // tidak akan pernah kecak

// ✅ BENAR
const routes = [
  { path: '/browse', component: BrowseView },
  { path: '/:pathMatch(.*)*', component: NotFoundView },
]
```

---

## 🧱 `defineAsyncComponent` — Loading & Error State Saat Lazy Load

Selain `() => import()`, Vue punya `defineAsyncComponent` yang memberi **state saat chunk sedang di-download** (loading) atau **gagal** (error). Sangat berguna untuk UX yang profesional.

```javascript
// router/index.js
import { defineAsyncComponent } from 'vue'

// Komponen dengan fallback loading & error
const BrowseView = defineAsyncComponent({
  loader: () => import('@/views/BrowseView.vue'),
  // Tampilkan saat chunk di-download
  loadingComponent: SpinnerView,
  // Tampilkan saat gagal (misal network putus)
  errorComponent: ErrorView,
  delay: 200,            // tunggu 200ms baru tampilkan spinner
  timeout: 10000,        // jika 10s belum selesai → errorComponent
})

const routes = [
  { path: '/browse', name: 'browse', component: BrowseView },
]
```

```vue
<!-- SpinnerView.vue -->
<template><div class="spinner">⏳ Memuat halaman...</div></template>

<!-- ErrorView.vue -->
<template>
  <div class="error">
    ❌ Gagal memuat halaman.
    <button @click="$emit('retry')">Coba Lagi</button>
  </div>
</template>
```

| Opsi | Fungsi |
| --- | --- |
| `loader` | Fungsi yang mengembalikan dynamic import |
| `loadingComponent` | Tampil saat loading |
| `errorComponent` | Tampil saat gagal |
| `delay` | Tunda tampil spinner (hindari kilatan) |
| `timeout` | Batas waktu sebelum dianggap gagal |

> 💡 **Tips:** `defineAsyncComponent` cocok saat halaman berat dan kamu ingin **feedback visual** saat menunggu chunk. Untuk halaman ringan, `() => import()` sudah cukup.

---

## 🚦 `beforeEnter` Async & Validasi Param

Guard per-route (`beforeEnter`) bisa async dan memvalidasi parameter sebelum render — misal memastikan film dengan `:id` tersebut benar-benar ada di API.

```javascript
// router/index.js
import { useMovieStore } from '@/stores/movieStore'

const routes = [
  {
    path: '/movie/:id',
    name: 'movie-detail',
    component: () => import('@/views/MovieDetailView.vue'),
    // beforeEnter jalan SEBELUM masuk route ini saja
    beforeEnter: async (to) => {
      const store = useMovieStore()
      const ada = await store.cekFilmAda(Number(to.params.id))
      if (!ada) {
        // Alihkan ke 404 jika film tidak ditemukan
        return { name: 'not-found' }
      }
      // return undefined → lanjut
    },
  },
]
```

| Guard | Cakupan | Cocok untuk |
| --- | --- | --- |
| `beforeEach` | Semua route | Auth global |
| `beforeEnter` | Satu route | Validasi param spesifik route ini |
| `onBeforeRouteUpdate` | Komponen | Param berubah tanpa remount |

> 💡 **Catatan:** `beforeEnter` lebih tepat sasaran daripada `beforeEach` jika validasi hanya berlaku untuk satu halaman. Hindari menumpuk semua logika di `beforeEach` hingga menjadi "god guard".

---

## 📜 `scrollBehavior` Lanjut — `savedPosition` & `el`

Selain ke atas, `scrollBehavior` bisa mengembalikan posisi saat tombol **back** ditekan, atau scroll ke elemen ber-`id` (hash).

```javascript
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // ① Jika ada hash (#komentar) → scroll ke elemen itu
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    // ② Jika navigasi dari back/forward → kembalikan posisi lama
    if (savedPosition) {
      return savedPosition
    }
    // ③ Default → ke atas
    return { top: 0, behavior: 'smooth' }
  },
})
```

```vue
<!-- Menggunakan hash untuk scroll ke bagian -->
<RouterLink :to="{ name: 'movie-detail', params: { id }, hash: '#komentar' }">
  Lihat Komentar
</RouterLink>
```

| Return | Kapan |
| --- | --- |
| `{ el: to.hash }` | Ada `#section` di URL |
| `savedPosition` | Navigasi back/forward |
| `{ top: 0 }` | Navigasi normal / default |

---

## 🚪 `onBeforeRouteLeave` dengan Cek Form "Dirty"

Pola umum: cegah user keluar halaman jika ada perubahan belum disimpan (form setengah diisi).

```vue
<!-- FormView.vue -->
<script setup>
import { ref, onBeforeRouteLeave } from 'vue-router'

const nama   = ref('')
const tersimpan = ref(true)   // true = belum ada perubahan

// Tandai "dirty" saat user mengetik
function onInput() { tersimpan.value = false }

// Jalan saat mau meninggalkan route ini
onBeforeRouteLeave((to, from) => {
  if (!tersimpan.value) {
    // Batalkan navigasi jika user membatalkan konfirmasi
    return window.confirm('Yakin keluar? Perubahan belum disimpan!')
  }
  return true   // aman lanjut
})
</script>

<template>
  <input v-model="nama" @input="onInput" placeholder="Nama" />
</template>
```

> ⚠️ **Catatan:** `onBeforeRouteLeave` hanya berjalan saat **meninggalkan komponen ini**. Jika ingin blokir navigasi global (semua halaman), gunakan `beforeEach` di router.

---

## ✨ Transisi dengan `appear` & Per-Component Transition

Kadang kita ingin transisi juga berjalan saat halaman **pertama kali** load (bukan hanya saat pindah). Gunakan `appear`.

```vue
<!-- App.vue -->
<template>
  <RouterView v-slot="{ Component, route }">
    <!-- appear: picu transisi SAAT pertama render juga -->
    <Transition
      :name="route.meta.transition || 'fade'"
      mode="out-in"
      appear
    >
      <component :is="Component" :key="route.path" />
    </Transition>
  </RouterView>
</template>
```

```vue
<!-- Atau transisi didefinisikan di dalam komponen halaman sendiri -->
<!-- MovieDetailView.vue -->
<template>
  <Transition name="slide" appear>
    <div class="detail">...</div>
  </Transition>
</template>
```

| Properti | Efek |
| --- | --- |
| `appear` | Transisi juga saat mount pertama |
| Tanpa `appear` | Transisi hanya saat komponen berganti |

---

## 🚨 Jebakan Tambahan (Jebakan 6–9)

### ❌ Jebakan 6 — `KeepAlive` tanpa `:include` → Memory Bocor

```vue
<!-- ❌ SALAH — SEMUA halaman di-cache, memory membengkak -->
<KeepAlive>
  <component :is="Component" :key="$route.path" />
</KeepAlive>
<!-- ✅ BENAR — hanya cache yang perlu -->
<KeepAlive :include="['SearchView', 'BrowseView']">
  <component :is="Component" :key="$route.path" />
</KeepAlive>
```

### ❌ Jebakan 7 — Transisi property mahal (`width`/`height`)

```css
/* ❌ SALAH — memicu reflow layout */
.pop-enter-from { width: 0; height: 0; }
/* ✅ BENAR — hanya opacity & transform (GPU) */
.pop-enter-from { opacity: 0; transform: scale(0.95); }
```

### ❌ Jebakan 8 — Nested route lupa path kosong (`''`) untuk default

```javascript
// ❌ SALAH — /profile tidak menampilkan child apapun
children: [
  { path: 'overview', component: ProfileOverview }, // butuh /profile/overview
]
// ✅ BENAR — path '' = default saat buka /profile
children: [
  { path: '', name: 'profile-overview', component: ProfileOverview },
  { path: 'settings', name: 'profile-settings', component: ProfileSettings },
]
```

### ❌ Jebakan 9 — Animasi JS lupa panggil `done()`

```vue
<!-- ❌ SALAH — transisi menggantung selamanya -->
<Transition @enter="(el) => { el.style.opacity = 1 }">
<!-- ✅ BENAR — panggil done() -->
<Transition @enter="(el, done) => { el.style.opacity = 1; setTimeout(done, 300) }">
```

---

## 🚀 Strategi Performa: Preload & Chunk Grouping (Ringkasan)

Ringkasan praktik terbaik loading halaman:

| Strategi | Kapan | Dampak |
| --- | --- | --- |
| Lazy `() => import()` | View besar & jarang | Initial bundle kecil |
| `defineAsyncComponent` | View berat + butuh loading/error UI | UX lebih baik |
| Group chunk (`webpackChunkName`) | Beberapa view sering berurutan | Navigasi antar mereka mulus |
| Preload on hover | Link yang diprediksi diklik | Jeda nyaris nol |
| Eager import | 404, landing kritis | Tersedia instan |

```javascript
// Preload saat hover — trik murah & efektif
function preload(name) {
  const map = {
    browse: () => import('@/views/BrowseView.vue'),
    search: () => import('@/views/SearchView.vue'),
  }
  map[name]?.()
}
```

> 🎯 **Checklist production:** (1) semua view lazy-loaded, (2) catch-all 404 di bawah, (3) `mode="out-in"` + `:key` di transition, (4) guard auth di `beforeEach`, (5) `scrollBehavior` ke atas, (6) SPA fallback di server. Enam ini membuat router terasa premium.

---

## 📝 Ringkasan Bab 18

| Konsep | Penjelasan |
| --- | --- |
| **`<Transition>` + RouterView** | Bungkus RouterView dengan `v-slot` + `<component :is>` untuk animasi |
| **`mode="out-in"`** | Halaman lama keluar dulu, cegah tumpang tindih |
| **`key` unik** | Wajib agar transisi terpicu tiap route berubah |
| **Route meta** | Kontrol layout, auth, title, transisi per halaman |
| **Catch-all 404** | `/:pathMatch(.*)*` di paling bawah untuk Not Found |
| **Nested routes** | `children` + `<RouterView>` ke-2 di induk |
| **Route props** | `props: true` / fungsi → param jadi props komponen |
| **Lazy vs Eager** | Lazy untuk view besar; eager untuk kecil/sering dipakai |
| **KeepAlive** | Cache komponen agar state bertahan (`onActivated`) |

---

## 🎯 Latihan Mandiri

**⭐ Latihan 1 — Transisi Fade Sederhana**
Bungkus `<RouterView>` di `App.vue` dengan `<Transition name="fade" mode="out-in">` dan `:key="$route.path"`. Definisikan CSS `.fade-*` sehingga halaman memudar saat pindah. Uji dengan 2 route.

**⭐⭐ Latihan 2 — Route Meta untuk Title**
Tambahkan `meta.title` pada 3 route. Gunakan `router.afterEach` untuk mengatur `document.title`. Verifikasi title berubah saat navigasi.

**⭐⭐⭐ Latihan 3 — Nested Routes**
Buat route `/dashboard` dengan 2 children: `/dashboard` (overview) dan `/dashboard/settings`. Pastikan `DashboardView` induk punya `<RouterView>` dan navbar tab. Tambahkan `<Transition>` pada child.

**⭐⭐⭐⭐ Latihan 4 — Kombinasi Lengkap**
Buat mini-app dengan: transisi slide per route (via `meta.transition`), layout berbeda untuk login vs main, route props pada halaman detail, dan KeepAlive pada halaman search. Pastikan 404 menangkap URL salah.

---

*Lanjut ke ➡️ **Bab 19 — 🏪 Pinia Dasar***
