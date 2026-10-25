# 🏪 Bab 19 — Pinia Dasar

> *"State adalah ingatan aplikasimu. Tanpa tempat penyimpanan yang terpusat, ingatan itu tersebar liar di antara komponen — dan saat satu komponen lupa, yang lain ikut bingung."*

---

> **🧠 Apa Itu Pinia?**
>
> Pinia adalah **library state management resmi** untuk Vue 3 — pengganti Vuex yang jauh lebih simpel dan ramah Composition API. Secara teknis, Pinia menyediakan wadah bernama **store** (toko) tempat kita menyimpan **data global** yang bisa diakses dan diubah oleh komponen mana pun tanpa harus meneruskannya lewat props. Pinia dirancang dengan TypeScript-friendly, dukungan HMR (hot module replacement), dan devtools integration. Jika Vue Router mengurus "di halaman mana kita berada", maka Pinia mengurus "data apa yang kita pegang bersama".

---

> **🏗️ Analogi Sederhana:**
>
> Bayangkan aplikasi sebagai **kantor besar** dengan banyak ruangan (komponen). Tanpa Pinia, jika ruang "Navbar" perlu tahu siapa yang login, ia harus menyuruh kurir (props) bolak-balik mengantar selembar kertas dari ruang "App" → "Layout" → "Navbar" (props drilling melelahkan). Dengan Pinia, ada satu **lemari arsip pusat** (store) di tengah kantor. Ruang mana pun bisa langsung buka lemari itu, baca/bubuhkan data, dan ruang lain yang membaca lemari yang sama otomatis tahu perubahannya. Tidak ada kurir bolak-balik lagi.

---

## 📋 Daftar Isi Bab 19

1. Mengapa State Management Dibutuhkan? (Masalah Props Drilling)
2. Pinia vs Vuex — Mengapa Pinia?
3. Setup Pinia di `main.js`
4. Anatomi sebuah Store (Setup Style)
5. State — Menyimpan Data Mentah
6. Getters — Data Turunan (seperti `computed`)
7. Actions — Fungsi Pembawa Logika
8. Options Style vs Setup Style Store
9. Menggunakan Store di Komponen (`useStore`)
10. `storeToRefs` — Destrukturisasi Tetap Reaktif
11. Multiple Stores — Memisahkan Domain
12. Studi Kasus — Alur Login dengan `authStore`
13. Jebakan Umum Pemula di Bab 19
14. Ringkasan & Latihan Mandiri

---

## 🔥 Mengapa State Management Dibutuhkan? (Masalah Props Drilling)

Bayangkan aplikasi tanpa state management. Data user login harus dikirim dari komponen induk ke anak, lalu ke cucu, berlapis-lapis. Ini disebut **props drilling** — dan sangat menyiksa.

```
MASALAH TANPA STATE MANAGEMENT (PROPS DRILLING):

Navbar.vue ──────────────────────────────────────┐
  (perlu tahu: siapa yang login?)                │
                                                  │
BrowseView.vue                                   │  Data yang sama
  (perlu tahu: siapa yang login?)                │  harus dikirim
                                                  │  via props
WatchlistView.vue                                │  berlapis-lapis
  (perlu tahu: siapa yang login? apa watchlist?) │  (props drilling!)
                                                  │
ProfileView.vue ─────────────────────────────────┘
  (perlu tahu: siapa yang login?)


SOLUSI DENGAN PINIA:

               🏪 authStore
              (data user login)
                    │
    ┌───────────────┼───────────────┐
    │               │               │
Navbar.vue   BrowseView.vue  WatchlistView.vue
  (akses         (akses           (akses
  langsung)      langsung)        langsung)
```

### Masalah Props Drilling

- Data harus **diteruskan manual** lewat setiap level komponen.
- Jika struktur berubah, semua komponen perantara harus diubah.
- Komponen yang tidak butuh data pun ikut menerimanya (polusi props).

### Solusi: Pinia Store

Dengan Pinia, data disimpan di **store** terpusat. Komponen mana pun bisa **langsung mengakses** tanpa perantara.

> 💡 **Tips:** Aturan praktis — jika data hanya dipakai 1 komponen, cukup `ref`/`reactive` lokal. Jika data dipakai **lintas komponen** (Navbar + Profile + Browse), gunakan Pinia.

---

## ⚔️ Pinia vs Vuex — Mengapa Pinia?

| Aspek | Vuex (lama) | Pinia (modern) |
| --- | --- | --- |
| Boilerplate | 🔴 Banyak (state, mutations, actions, getters) | 🟢 Sedikit (state, getters, actions) |
| Mutations | Wajib (strict) | ❌ Dihapus — langsung ubah di action |
| TypeScript | 🟡 Cukup merepotkan | 🟢 Dukungan penuh & natural |
| Composition API | 🟡 Terpaksa | 🟢 Native (`setup` style) |
| Multiple stores | 🟡 Satu store besar | 🟢 Banyak store kecil per domain |
| DevTools | ✅ Ya | ✅ Ya (lebih baik) |
| Rekomendasi | ❌ Legacy | ✅ Standar Vue 3 |

> 💡 **Catatan:** Vuex masih dipakai di project lama, tapi untuk project Vue 3 baru, **Pinia adalah pilihan resmi** dari tim Vue.

---

## 🔌 Setup Pinia di `main.js`

Sebelum membuat store, Pinia harus "dipasang" ke aplikasi lewat `app.use(pinia)`.

```javascript
// ─────────────────────────────────────────────────────────────
// main.js — entry point aplikasi (lihat struktur project)
// ─────────────────────────────────────────────────────────────
import { createApp } from 'vue'
import { createPinia } from 'pinia'   // ① import Pinia
import App from './App.vue'
import router from './router'         // Vue Router (Bab 17)

// ② buat instance Pinia
const pinia = createPinia()

// ③ buat app Vue
const app = createApp(App)

// ④ pasang plugin (urutan bebas, tapi sebelum mount)
app.use(router)   // router dulu
app.use(pinia)    // pinia kemudian

// ⑤ mount ke DOM
app.mount('#app')
```

```bash
# Jika project dibuat tanpa Pinia, install dulu:
npm install pinia
```

> ⚠️ **Catatan:** `app.use(pinia)` **wajib** sebelum `app.mount()`. Tanpa itu, memanggil `useStore()` di komponen akan error "no active Pinia".

---

## 🏗️ Anatomi sebuah Store (Setup Style)

Store Pinia dibuat dengan `defineStore`. Kita menggunakan **setup style** (sama seperti `script setup`) yang mengembalikan `{ state, getters, actions }`.

```javascript
// ─────────────────────────────────────────────────────────────
// stores/authStore.js — store pertama kita
// ─────────────────────────────────────────────────────────────
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// defineStore('id-unik', functionSetup)
// 'auth' adalah ID internal store (harus unik antar store)
export const useAuthStore = defineStore('auth', () => {
  // ── ① STATE (ref/reactive) ──
  const user  = ref(null)
  const token = ref(localStorage.getItem('token'))

  // ── ② GETTERS (computed) ──
  const isLoggedIn = computed(() => !!token.value)
  const namaUser   = computed(() => user.value?.name ?? 'Tamu')
  const avatarUrl  = computed(() =>
    user.value?.avatar ?? '/images/default-avatar.png'
  )

  // ── ③ ACTIONS (function) ──
  async function login(email, password) {
    try {
      const userData  = { id: 1, name: 'Budi', email, avatar: null }
      const tokenBaru = 'token-' + Date.now()
      user.value  = userData
      token.value = tokenBaru
      localStorage.setItem('token', tokenBaru)
      return { sukses: true }
    } catch (e) {
      return { sukses: false, pesan: e.message }
    }
  }

  function logout() {
    user.value  = null
    token.value = null
    localStorage.removeItem('token')
  }

  // ── RETURN semua yang mau diekspos ──
  return { user, token, isLoggedIn, namaUser, avatarUrl, login, logout }
})
```

### Tiga Pilar Store

| Pilar | Tipe | Fungsi |
| --- | --- | --- |
| **State** | `ref` / `reactive` | Menyimpan data mentah (user, token) |
| **Getters** | `computed` | Data turunan/hasil olahan (isLoggedIn, namaUser) |
| **Actions** | `function` | Logika yang mengubah state (login, logout) |

### Penjelasan

- `token` diambil dari `localStorage` saat store dibuat → user tetap "login" saat refresh.
- `isLoggedIn` adalah *getter* yang menghitung dari `token` (truthy/falsy).
- `login()` menyimpan user & token, lalu **mengembalikan objek hasil** agar komponen tahu sukses/gagal.
- `logout()` menghapus state **dan** localStorage.

> 📌 **Catatan Penting:** `defineStore('auth', ...)` — string `'auth'` adalah **id unik** store. Jangan diduplikasi antar store karena Pinia menggunakannya sebagai kunci internal.

---

## 💾 State — Menyimpan Data Mentah

State adalah "lemari arsip" tempat data disimpan. Di setup style, state berupa `ref` atau `reactive`.

```javascript
import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', () => {
  // ref untuk nilai tunggal
  const totalItem = ref(0)

  // reactive untuk object/array
  const items = reactive([])

  // Bisa juga ref(array) — sering lebih fleksibel
  const produk = ref([])

  return { totalItem, items, produk }
})
```

```javascript
// Cara mengubah state dari komponen:
const cart = useCartStore()
cart.totalItem++              // ✅ langsung ubah
cart.produk.push({ id: 1 })   // ✅ mutasi array di ref
```

> 💡 **Tips:** Untuk array/object yang sering diganti seluruhnya (reassign), lebih baik pakai `ref([])` daripada `reactive([])` — karena `ref` bisa di-reassign (`cart.produk = [...]`) tanpa kehilangan reaktivitas, sedangkan `reactive` tidak bisa di-reassign.

---

## 🧮 Getters — Data Turunan (seperti `computed`)

Getters menghitung nilai dari state. Ia **tidak** mengubah state, hanya "menurunkan" data. Sama seperti `computed` di komponen.

```javascript
export const useCartStore = defineStore('cart', () => {
  const items = ref([
    { id: 1, nama: 'Mouse', harga: 100, jumlah: 2 },
    { id: 2, nama: 'Keyboard', harga: 250, jumlah: 1 },
  ])

  // Getter: total harga = sum(harga * jumlah)
  const totalHarga = computed(() =>
    items.value.reduce((sum, i) => sum + i.harga * i.jumlah, 0)
  )

  // Getter: jumlah item unik
  const jumlahJenis = computed(() => items.value.length)

  // Getter bisa pakai getter lain
  const totalFormat = computed(() =>
    'Rp ' + totalHarga.value.toLocaleString('id-ID')
  )

  return { items, totalHarga, jumlahJenis, totalFormat }
})
```

```javascript
// Getter diakses seperti property biasa (tanpa () )
const cart = useCartStore()
console.log(cart.totalHarga)     // 450 (100*2 + 250*1)
console.log(cart.totalFormat)    // "Rp 450"
```

| State | Getter |
| --- | --- |
| Menyimpan data | Menurunkan/menghitung data |
| Bisa diubah | 🔴 Tidak boleh diubah (readonly) |
| `ref`/`reactive` | `computed` |
| Sumber kebenaran | Turunan dari sumber |

> ⚠️ **Catatan:** Jangan ubah state **di dalam getter**. Getter hanya untuk baca/hitung. Untuk mengubah state, gunakan action.

---

## ⚙️ Actions — Fungsi Pembawa Logika

Actions adalah tempat semua **logika yang memodifikasi state** — termasuk async (fetch API, setTimeout). Di Pinia, tidak ada "mutations" terpisah seperti Vuex; langsung ubah state di action.

```javascript
export const useAuthStore = defineStore('auth', () => {
  const user  = ref(null)
  const token = ref(null)

  // Action async (return promise otomatis)
  async function login(email, password) {
    // 1. panggil API (simulasi)
    const res = await fakeApiLogin(email, password)
    // 2. ubah state
    user.value  = res.user
    token.value = res.token
    // 3. bisa return nilai
    return res
  }

  // Action sync
  function setUserBaru(namaBaru) {
    if (user.value) user.value.name = namaBaru
  }

  // Action memanggil action lain
  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  return { user, token, login, setUserBaru, logout }
})
```

```javascript
// Memanggil action dari komponen:
const auth = useAuthStore()
await auth.login('a@b.com', 'rahasia')  // tunggu selesai
auth.logout()                            // sync, langsung jalan
```

> 💡 **Tips:** Simpan **semua** logika perubahan state di action, bukan di komponen. Komponen cukup memanggil `auth.login(...)`. Ini membuat store menjadi "satu sumber kebenaran" yang mudah diuji.

---

## 🧬 Options Style vs Setup Style Store

Pinia mendukung 2 gaya definisi store.

### Setup Style (direkomendasikan — seperti `script setup`)
```javascript
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounter = defineStore('counter', () => {
  const count = ref(0)                      // state
  const double = computed(() => count.value * 2) // getter
  function increment() { count.value++ }    // action
  return { count, double, increment }
})
```

### Options Style (seperti Vuex / Options API)
```javascript
import { defineStore } from 'pinia'

export const useCounter = defineStore('counter', {
  state: () => ({
    count: 0,                              // state
  }),
  getters: {
    double: (state) => state.count * 2,    // getter
  },
  actions: {
    increment() { this.count++ },          // action (pakai this)
  },
})
```

| Aspek | Setup Style | Options Style |
| --- | --- | --- |
| Mirip dengan | `script setup` | Vuex / Options API |
| Akses state | `count.value` | `this.count` |
| Fleksibilitas | 🟢 Bebas pakai composable | 🟡 Terbatas |
| Rekomendasi | ✅ Untuk project modern | ⛔ Legacy / familiar Vuex |

> 💡 **Tips:** Sepanjang ebook ini kita pakai **setup style** karena konsisten dengan Composition API yang dipakai di seluruh Bab 13+.

---

## 🔌 Menggunakan Store di Komponen (`useStore`)

Cara mengonsumsi store di komponen: panggil fungsi `useXStore()`, lalu akses propertinya.

```vue
<!-- Navbar.vue -->
<script setup>
import { useAuthStore } from '@/stores/authStore'

// Panggil store — instance global, sama di semua komponen
const authStore = useAuthStore()
</script>

<template>
  <!-- Akses state/getter langsung -->
  <div v-if="authStore.isLoggedIn">
    Halo, {{ authStore.namaUser }}!
  </div>
  <button v-else @click="authStore.login('a@b.com', 'pw')">Login</button>
</template>
```

```vue
<!-- ProfileView.vue — store SAMA, data SINKRON -->
<script setup>
import { useAuthStore } from '@/stores/authStore'
const authStore = useAuthStore()
</script>

<template>
  <!-- Jika login di Navbar, profil ini LANGSUNG update ✅ -->
  <img :src="authStore.avatarUrl" />
  <p>{{ authStore.namaUser }}</p>
</template>
```

> 💡 **Tips:** `useAuthStore()` mengembalikan **instance tunggal** (singleton). Memanggilnya di banyak komponen mengembalikan store yang sama — itulah mengapa perubahan di satu tempat langsung terlihat di tempat lain.

---

## 🔄 `storeToRefs` — Destrukturisasi Tetap Reaktif

Jika kita destrukturisasi biasa (`const { user } = authStore`), reaktivitas **hilang** — Vue tidak lagi melacak perubahan. `storeToRefs` mengembalikan *ref* untuk setiap state/getter agar tetap reaktif.

```vue
<script setup>
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

// ✅ DESTRUKTURISASI REAKTIF — pakai storeToRefs
const { user, isLoggedIn, namaUser } = storeToRefs(authStore)
// user, isLoggedIn, namaUser adalah ref → tetap reaktif di template

// Actions TIDAK perlu storeToRefs — panggil langsung
async function handleLogin() {
  const hasil = await authStore.login(email.value, password.value)
  if (hasil.sukses) router.push({ name: 'browse' })
}
</script>

<template>
  <div v-if="isLoggedIn">Selamat datang, {{ namaUser }}!</div>
  <button @click="authStore.logout">Logout</button>
</template>
```

| Destrukturisasi | Reaktif? | Untuk |
| --- | --- | --- |
| `const { user } = authStore` | ❌ Tidak | — (jangan) |
| `const { user } = storeToRefs(authStore)` | ✅ Ya | State & getters |
| `authStore.logout()` | ✅ (fungsi) | Actions (langsung) |

> 💡 **Tips:** Gunakan `storeToRefs` **hanya untuk state & getters**. **Actions** boleh dipanggil langsung (`authStore.logout()`) tanpa `storeToRefs` karena action adalah fungsi, bukan data reaktif.

---

## 🗂️ Multiple Stores — Memisahkan Domain

Prinsip penting: **satu store = satu domain data**. Aplikasi besar punya banyak store kecil, bukan satu store raksasa.

```javascript
// stores/authStore.js     → domain: autentikasi user
// stores/movieStore.js    → domain: data film
// stores/watchlistStore.js → domain: daftar tontonan user
```

```vue
<!-- Komponen bisa pakai beberapa store sekaligus -->
<script setup>
import { useAuthStore } from '@/stores/authStore'
import { useWatchlistStore } from '@/stores/watchlistStore'

const auth = useAuthStore()
const watchlist = useWatchlistStore()

// Akses masing-masing independen
console.log(auth.namaUser)
console.log(watchlist.jumlah)
</script>
```

| Keuntungan store kecil per domain |
| --- |
| ✅ Mudah diuji (unit test terisolasi) |
| ✅ Mudah dipelihara (tidak ada file 1000 baris) |
| ✅ Lazy-loaded bersama route yang memakainya |
| ✅ Tim bisa kerja paralel tanpa konflik |

---

## 🎬 Studi Kasus — Alur Login dengan `authStore`

**Skenario:** User membuka `HomeView` (halaman login). Mengetik email & password, menekan "Masuk". `authStore.login()` dipanggil, menyimpan user+token, lalu komponen mengarahkan ke `/browse`. Navbar yang membaca `authStore.namaUser` langsung update.

```vue
<!-- HomeView.vue -->
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'

const router = useRouter()
const authStore = useAuthStore()
const { isLoggedIn } = storeToRefs(authStore)

const email = ref('')
const password = ref('')
const error = ref('')

async function handleLogin() {
  error.value = ''
  const hasil = await authStore.login(email.value, password.value)
  if (hasil.sukses) {
    router.push({ name: 'browse' })
  } else {
    error.value = hasil.pesan
  }
}
</script>

<template>
  <form @submit.prevent="handleLogin">
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <p v-if="error" class="error">{{ error }}</p>
    <button type="submit">Masuk</button>
  </form>
</template>
```

```vue
<!-- Navbar.vue — reaktif ke authStore -->
<script setup>
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const { isLoggedIn, namaUser, avatarUrl } = storeToRefs(authStore)
</script>

<template>
  <nav>
    <RouterLink :to="{ name: 'browse' }">Browse</RouterLink>
    <!-- Muncul otomatis setelah login berhasil -->
    <img v-if="isLoggedIn" :src="avatarUrl" :alt="namaUser" />
    <span v-if="isLoggedIn">{{ namaUser }}</span>
    <button v-if="isLoggedIn" @click="authStore.logout">Logout</button>
  </nav>
</template>
```

**Alur:**

```
User isi form → handleLogin()
   ↓
authStore.login() → set user & token, simpan localStorage
   ↓
return { sukses: true }
   ↓
router.push('browse')
   ↓
Navbar (storeToRefs isLoggedIn) otomatis true → tampil avatar ✅
```

> 💡 **Tips:** Karena store adalah singleton, saat `login()` mengubah `token`, **semua** komponen yang membaca `isLoggedIn` langsung re-render. Tidak perlu emit/props apa pun.

---

## 👁️ Mengamati Perubahan Store ($subscribe)

Kadang kita ingin **bereaksi** setiap kali state store berubah — misal simpan ke localStorage atau log. Pinia punya `$subscribe`.

```javascript
// Di dalam komponen:
const authStore = useAuthStore()

// $subscribe(callback) — jalan tiap state berubah
const unsubscribe = authStore.$subscribe((mutation, state) => {
  // mutation.type   → 'direct' | 'patch object' | 'patch function'
  // mutation.storeId→ 'auth'
  // state           → snapshot state terbaru
  console.log('State auth berubah:', state.user)
})

// Jangan lupa unsubscribe saat komponen di-unmount (hindari leak)
onUnmounted(() => unsubscribe())
```

```javascript
// Menyimpan ke localStorage setiap ada perubahan (pola persist manual)
authStore.$subscribe((mutation, state) => {
  localStorage.setItem('user', JSON.stringify(state.user))
})
```

> 💡 **Tips:** `$subscribe` berbeda dengan `watch` biasa — ia hanya memantau **state** store (bukan getter) dan memberi info `mutation` (apa yang berubah). Cocok untuk sinkronisasi eksternal (localStorage, server sync).

---

## 🔁 Reset State & `$patch` — Update Massal

Pinia menyediakan helper untuk mengubah banyak state sekaligus atau mengembalikan ke awal.

```javascript
// $patch — ubah beberapa state sekaligus (lebih efisien)
const auth = useAuthStore()
auth.$patch({
  user: { id: 2, name: 'Ani' },
  token: 'token-baru',
})
// vs ubah satu-satu:
// auth.user = {...}; auth.token = '...'

// $patch juga terima fungsi
auth.$patch((state) => {
  state.user.name = 'Ani'
  state.token = 'token-baru'
})

// $reset — kembalikan semua state ke nilai awal (saat defineStore)
auth.$reset()
// user.value kembali null, token.value kembali null
```

| Method | Fungsi |
| --- | --- |
| `$patch(obj)` | Update beberapa state sekaligus |
| `$patch(fn)` | Update via mutasi fungsi |
| `$reset()` | Kembalikan state ke kondisi awal store |
| `$subscribe()` | Pantau perubahan state |

> ⚠️ **Catatan:** `$reset()` hanya tersedia di **setup style** jika store didefinisikan dengan benar (Pinia melacak nilai awal). Untuk options style selalu tersedia.

---

## 🌐 Menggunakan Store di Luar Komponen (Router Guard)

Kita sudah contoh di Bab 17: memanggil `useAuthStore()` di dalam `router.beforeEach`. Ini sah karena Pinia sudah aktif (`app.use(pinia)`) sebelum navigasi terjadi.

```javascript
// router/index.js
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({ /* ... */ })

router.beforeEach((to) => {
  // ✅ AMAN: Pinia sudah aktif saat guard jalan
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'home' }
  }
})
```

```javascript
// ❌ TIDAK AMAN: panggil useAuthStore() di level module
// SEBELUM app.use(pinia) dijalankan
// (misal di file yang di-import saat build, bukan saat runtime)
// const auth = useAuthStore()  // error: no active Pinia

// ✅ AMAN: panggil di dalam fungsi yang jalan saat runtime
export function cekLogin() {
  const auth = useAuthStore()
  return auth.isLoggedIn
}
```

> 💡 **Tips:** Aturan emas — `useXStore()` hanya boleh dipanggil **setelah** `app.use(pinia)`. Di dalam komponen (`setup`), router guard, atau fungsi yang dipanggil saat aplikasi berjalan, semuanya aman.

---

## 🧪 Testing Store dengan Vitest

Karena store adalah fungsi murni (setup style), ia sangat mudah di-test.

```javascript
// stores/counterStore.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const double = computed(() => count.value * 2)
  function increment() { count.value++ }
  return { count, double, increment }
})
```

```javascript
// stores/counterStore.spec.js
import { setActivePinia, createPinia } from 'pinia'
import { useCounterStore } from '@/stores/counterStore'

// WAJIB: buat Pinia aktif sebelum tiap test
beforeEach(() => {
  setActivePinia(createPinia())
})

it('increment menaikkan count', () => {
  const store = useCounterStore()
  expect(store.count).toBe(0)
  store.increment()
  expect(store.count).toBe(1)
})

it('double adalah 2x count', () => {
  const store = useCounterStore()
  store.count = 5
  expect(store.double).toBe(10)
})
```

| Langkah Test | Penjelasan |
| --- | --- |
| `setActivePinia(createPinia())` | Aktifkan Pinia untuk test |
| `useCounterStore()` | Ambil instance seperti biasa |
| Assert state/action | Uji seperti fungsi biasa |

> 💡 **Tips:** Test store terisolasi dari komponen — ini salah satu alasan memisahkan logika ke store (Bab 20). Komponen jadi tipis & gampang di-test, store jadi teruji penuh.

---

## 🧰 Menggunakan Store di dalam Composable

Composable bisa memanggil store agar logika bisnis bisa dipakai ulang lintas komponen tanpa duplikasi.

```javascript
// composables/useAuth.js
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'

export function useAuth() {
  const authStore = useAuthStore()

  // Bungkus jadi API yang lebih ramah
  const isLoggedIn = computed(() => authStore.isLoggedIn)
  const namaUser = computed(() => authStore.namaUser)

  async function login(email, password) {
    return authStore.login(email, password)
  }

  function logout() {
    authStore.logout()
  }

  return { isLoggedIn, namaUser, login, logout }
}
```

```vue
<!-- Dipakai di komponen apa pun -->
<script setup>
import { useAuth } from '@/composables/useAuth'
const { isLoggedIn, login, logout } = useAuth()
</script>
```

> 💡 **Tips:** Membungkus store ke composable cocok saat ada logika tambahan (formatting, default) yang ingin dibagikan. Tapi jangan berlebihan — jika cuma meneruskan store, panggil `useAuthStore()` langsung lebih sederhana.

---

## 🔬 Pinia DevTools & Time-Travel

Pinia terintegrasi native dengan **Vue DevTools**. Kamu bisa melihat state tiap store, mengubahnya secara langsung, dan (di mode tertentu) melakukan time-travel debugging.

```
Vue DevTools → tab "Pinia":
  ├── auth
  │     ├── user: { name: 'Budi' }
  │     ├── token: 'token-123'
  │     └── isLoggedIn: true
  ├── movie
  │     ├── trending: [ ... ]
  │     └── detailCache: { ... }
  └── watchlist
        └── disimpan: [ ... ]

(Klik state → edit langsung → UI update real-time ✅)
```

| Fitur DevTools | Manfaat |
| --- | --- |
| Inspect state | Lihat isi store secara live |
| Edit state | Ubah nilai untuk testing cepat |
| Action timeline | Lihat urutan action yang dipanggil |
| Time-travel | Kembalikan ke state sebelumnya (jika diaktifkan) |

> 💡 **Tips:** Saat debug, buka DevTools → Pinia, cari store yang nilainya tidak sesuai harapan. Ini jauh lebih cepat daripada `console.log` di mana-mana.

---

## ⚙️ Actions dengan Parameter & Return Value Lengkap

Action adalah fungsi biasa — ia bisa menerima parameter sebanyak apa pun dan mengembalikan nilai apa pun (termasuk Promise).

```javascript
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)

  // Action dengan BANYAK parameter
  async function login(email, password, { remember = false } = {}) {
    const res = await api.login(email, password)
    user.value = res.user
    token.value = res.token
    if (remember) localStorage.setItem('token', res.token)
    // Return object berisi info sukses + data
    return { sukses: true, user: res.user }
  }

  // Action tanpa return — cukup efek samping
  function clearUser() {
    user.value = null
  }

  // Action memanggil action lain & return hasilnya
  async function loginLaluProfil(email, password) {
    const loginRes = await login(email, password)
    if (!loginRes.sukses) return loginRes
    const profil = await api.getProfile(user.value.id)
    user.value.profil = profil
    return { sukses: true, profil }
  }

  return { user, token, login, clearUser, loginLaluProfil }
})
```

```vue
<!-- Komponen membaca return value -->
<script setup>
const auth = useAuthStore()

async function onSubmit() {
  const hasil = await auth.login(email.value, password.value)
  if (hasil.sukses) {
    router.push({ name: 'browse' })
  } else {
    error.value = 'Login gagal'
  }
}
</script>
```

| Pola Return | Kegunaan |
| --- | --- |
| `return { sukses, data }` | Komponen tahu hasil & bisa bercabang |
| `return data` | Langsung kembalikan entity |
| Tidak return | Action murni side-effect (clear, reset) |

> 💡 **Tips:** Kembalikan objek `{ sukses, ... }` dari action async agar komponen bisa menangani sukses/gagal tanpa `try/catch` di setiap pemanggilan. Ini pola yang sangat nyaman untuk form.

---

## 📛 Konvensi Penamaan & Struktur Store

Agar project rapi, sepakati konvensi penamaan sejak awal.

```
stores/
├── authStore.js          → useAuthStore()      (domain: autentikasi)
├── movieStore.js         → useMovieStore()     (domain: film)
├── watchlistStore.js     → useWatchlistStore() (domain: watchlist)
└── themeStore.js         → useThemeStore()     (domain: tema)
```

| Konvensi | Contoh | Alasan |
| --- | --- | --- |
| File `namaStore.js` | `authStore.js` | Konsisten & mudah dicari |
| Fungsi `useNamaStore` | `useAuthStore` | Standar Pinia (prefix `use`) |
| ID string unik | `'auth'`, `'movie'` | Kunci internal Pinia |
| State `camelCase` | `isLoggedIn` | JavaScript convention |
| Action kata kerja | `login`, `logout`, `tambah` | Jelas itu fungsi |

```javascript
// Pola return store yang konsisten:
return {
  // state (ref/reactive)
  user, token,
  // getters (computed)
  isLoggedIn, namaUser,
  // actions (function)
  login, logout,
}
// Urutkan: state → getters → actions (mudah dibaca)
```

> 💡 **Tips:** Konsistensi lebih penting dari gaya tertentu. Sepakati di tim: urutan return, penamaan, dan letak file. Ebook ini pakai `stores/<domain>Store.js` + `use<Domain>Store()`.

---

## 🤔 State Lokal vs Pinia — Kapan Pakai Mana?

Keputusan kapan menggunakan `ref` lokal vs Pinia sering membingungkan pemula. Berikut panduannya.

```
┌─────────────────────────────────────────────────────────┐
│ Data hanya dipakai DI DALAM 1 komponen?                  │
│                                                         │
│   YA → pakai ref/reactive LOKAL                         │
│        (misal: state input form, toggle modal lokal)    │
│                                                         │
│   TIDAK → data dipakai LINTAS komponen?                 │
│                                                         │
│      YA → pakai Pinia STORE                             │
│           (misal: user login, watchlist, keranjang)     │
│                                                         │
│      TIDAK → hanya lewat 1 level parent→child?          │
│           → cukup PROPS + EMITS (Bab 7)                 │
└─────────────────────────────────────────────────────────┘
```

| Situasi | Solusi |
| --- | --- |
| Input form di 1 komponen | `ref` lokal |
| Modal buka/tutup lokal | `ref` lokal (`isOpen`) |
| User login (Navbar + Profile + Browse) | Pinia `authStore` |
| Watchlist (banyak halaman) | Pinia `watchlistStore` |
| Data dari parent ke child langsung | Props |
| Event child ke parent | Emits |

```vue
<!-- Contoh: state LOKAL (tidak perlu store) -->
<script setup>
const isModalOpen = ref(false) // hanya dipakai komponen ini
</script>

<!-- Contoh: butuh STORE (dipakai banyak tempat) -->
<script setup>
const auth = useAuthStore() //Navbar & Profile sama-sama baca ini
</script>
```

> 💡 **Tips:** Aturan praktis — **mulai dengan lokal**, dan "promosikan" ke Pinia begitu kamu menyadari data itu perlu dibaca di lebih dari dua komponen yang tidak bertetangga. Jangan langsung Pakai Pinia untuk semua hal; itu justru membuat store membengkak.

---

## 🔀 Pinia vs Provide/Inject vs Props — Perbandingan Lengkap

Vue punya **tiga cara** berbagi data antar komponen. Memilih yang tepat menghindari over-engineering (pakai Pinia untuk hal sepele) maupun under-engineering (props drilling padahal butuh store).

```
┌──────────────────────────────────────────────────────────────┐
│ SEBERAPA JAUH data harus mengalir?                             │
│                                                                │
│  1 level (parent → child langsung)                             │
│     → PROPS + EMITS                                            │
│                                                                │
│  Beberapa level (ancestor → descendant, "keluarga")            │
│     → PROVIDE / INJECT                                         │
│                                                                │
│  Lintas seluruh aplikasi (komponen yang tak bertetangga)       │
│     → PINIA STORE                                              │
└──────────────────────────────────────────────────────────────┘
```

```vue
<!-- ❌ CARA SALAH: Props drilling untuk data global -->
<!-- App.vue -->
<template>
  <!-- user harus dilempar berlapis meski Layout & Konten tak butuh -->
  <Layout :user="user">
    <Konten :user="user">
      <Sidebar :user="user">
        <ProfilKecil :user="user" /> <!-- akhirnya dipakai di sini -->
      </Sidebar>
    </Konten>
  </Layout>
</template>
```

```vue
<!-- ✅ CARA BENAR: Pinia — akses langsung, tanpa perantara -->
<!-- ProfilKecil.vue -->
<script setup>
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
// Langsung ambil dari store — Layout/Konten/Sidebar tak perlu tahu apa-apa
const { user } = storeToRefs(useAuthStore())
</script>
```

| Aspek | Props/Emits | Provide/Inject | Pinia Store |
| --- | --- | --- | --- |
| **Jangkauan** | 1 level | Ancestor → descendant | Global (seluruh app) |
| **Boilerplate** | 🟢 Minim | 🟡 Sedang | 🟡 Perlu setup store |
| **DevTools** | ❌ Terbatas | ❌ Terbatas | ✅ Panel Pinia penuh |
| **Testing** | 🟢 Mudah | 🟡 Perlu wrapper | 🟢 `setActivePinia` |
| **Reaktivitas dua arah** | 🔴 Read-only (emit balik) | 🟢 Bisa | 🟢 Via action |
| **Cocok untuk** | Data lokal komponen | Tema, config keluarga komponen | User, cart, watchlist |

> ⚠️ **Catatan:** `provide/inject` (Bab 11) sekilas mirip Pinia karena bisa "lompat level". Bedanya: `provide/inject` terikat pada **hierarki komponen** (hanya descendant yang bisa `inject`), sedangkan Pinia bisa diakses **komponen mana pun** — bahkan router guard & composable di luar hierarki.

> 💡 **Tips:** Jangan langsung buat store untuk semua hal. Toggle modal, teks input, state hover — cukup `ref` lokal. Naikkan ke Pinia hanya saat data benar-benar dibutuhkan lintas komponen yang tidak bertetangga.

---

## 🧬 Bagaimana Reaktivitas Store Bekerja di Balik Layar

Banyak pemula memperlakukan Pinia seperti "sihir". Padahal store setup style **hanyalah kumpulan `ref`, `computed`, dan `function`** yang dibungkus `defineStore`. Memahami ini membuat semua perilaku store masuk akal.

```javascript
// Store setup style INI...
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)                          // ← ref biasa!
  const double = computed(() => count.value * 2) // ← computed biasa!
  function increment() { count.value++ }         // ← function biasa!
  return { count, double, increment }
})

// ...secara konsep SETARA dengan composable ini:
function useCounterComposable() {
  const count = ref(0)
  const double = computed(() => count.value * 2)
  function increment() { count.value++ }
  return { count, double, increment }
}
```

**Lalu apa bedanya store dengan composable biasa?**

```
Composable (useX)          Store (useXStore)
─────────────────          ─────────────────
Dipanggil → INSTANCE BARU  Dipanggil → INSTANCE SAMA (singleton)
setiap pemakaian           di seluruh aplikasi

Komponen A: useCounter()   Komponen A: useCounterStore()  ┐
  → count = 0 (baru)         → count dari store global     │ SAMA
Komponen B: useCounter()   Komponen B: useCounterStore()  │ (sinkron)
  → count = 0 (baru lagi)    → count dari store global     ┘
```

```javascript
// ❌ SALAH memahami: mengira tiap komponen punya count sendiri
// (itu perilaku composable, BUKAN store)

// ✅ BENAR: store adalah SINGLETON — satu count dibagi semua komponen
const a = useCounterStore()
const b = useCounterStore()
a.increment()
console.log(b.count) // 1 → a dan b menunjuk store yang SAMA
```

| Konsep | Composable | Pinia Store |
| --- | --- | --- |
| Instance | Baru tiap panggil | Singleton (satu untuk semua) |
| State dibagi? | ❌ Tidak | ✅ Ya |
| Terdaftar di DevTools | ❌ | ✅ |
| Punya `$patch`/`$reset`/`$subscribe` | ❌ | ✅ |
| Cocok untuk | Logika reusable per-komponen | Data global bersama |

> 💡 **Tips:** Karena store internalnya `ref`/`computed`, `storeToRefs` diperlukan saat destrukturisasi — persis seperti kamu tidak boleh destrukturisasi `reactive` tanpa `toRefs` (Bab 5). Semua konsep reaktivitas dari Bab 5 berlaku di store.

---

## 🎫 Pola State Awal & Hydration dari localStorage

Store sering perlu "mengingat" data saat aplikasi dibuka kembali (refresh). Prosesnya disebut **hydration** — mengisi state awal dari sumber persisten (localStorage).

```javascript
// ❌ CARA SALAH: baca localStorage TANPA fallback → crash saat null
export const useAuthStore = defineStore('auth', () => {
  // Jika 'user' belum pernah disimpan, getItem = null → JSON.parse(null) = null
  // Tapi kalau isinya string rusak → JSON.parse THROW error!
  const user = ref(JSON.parse(localStorage.getItem('user')))
  return { user }
})
```

```javascript
// ✅ CARA BENAR: fallback + try/catch defensif
function bacaAwal(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback  // null → fallback
  } catch {
    // Data rusak/korup → kembalikan fallback, jangan crash
    return fallback
  }
}

export const useAuthStore = defineStore('auth', () => {
  // Hydration aman
  const user  = ref(bacaAwal('user', null))
  const token = ref(localStorage.getItem('token') ?? null) // string, tak perlu parse

  // Setiap perubahan token → sinkron ke localStorage
  function login(userData, tokenBaru) {
    user.value  = userData
    token.value = tokenBaru
    localStorage.setItem('token', tokenBaru)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  function logout() {
    user.value  = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return { user, token, login, logout }
})
```

```
ALUR HYDRATION SAAT REFRESH:

Browser di-refresh
   ↓
main.js jalan → app.use(pinia)
   ↓
Komponen panggil useAuthStore() PERTAMA KALI
   ↓
setup store dijalankan → bacaAwal('user', null)
   ↓
localStorage punya data? → user terisi → isLoggedIn true ✅
localStorage kosong?     → user null   → tampil halaman login
```

| Tipe Data | Cara Simpan | Cara Baca |
| --- | --- | --- |
| String (token) | `setItem(k, v)` | `getItem(k) ?? null` |
| Object/Array | `setItem(k, JSON.stringify(v))` | `JSON.parse(getItem(k) ?? '...')` |
| Number/Boolean | `setItem(k, String(v))` | `Number(...)` / `=== 'true'` |

> ⚠️ **Catatan:** `JSON.parse(null)` mengembalikan `null` (aman), tetapi `JSON.parse('undefined')` atau string rusak akan **melempar error**. Selalu bungkus dengan `try/catch` seperti `bacaAwal()` di atas agar satu entri localStorage yang korup tidak membuat seluruh aplikasi blank.

> 💡 **Tips:** Untuk banyak store yang butuh persistensi, pola manual ini melelahkan. Di Bab 20 kita pakai `pinia-plugin-persistedstate` yang otomatis meng-hydrate dan menyimpan tanpa kode berulang.

---

## 🔭 Getters Lanjutan — Parameter & Getter Lain

Getter dasar sudah kita bahas. Tapi ada dua pola lanjutan yang sering dipakai di aplikasi nyata: **getter yang menerima parameter** (seperti fungsi) dan **getter yang memanggil getter lain**.

```javascript
// ─────────────────────────────────────────────────────────────
// Getter dengan PARAMETER — kembalikan fungsi
// ─────────────────────────────────────────────────────────────
export const useCartStore = defineStore('cart', () => {
  const items = ref([
    { id: 1, nama: 'Mouse', harga: 100, jumlah: 2 },
    { id: 2, nama: 'Keyboard', harga: 250, jumlah: 1 },
  ])

  // Getter biasa (tanpa param)
  const totalHarga = computed(() =>
    items.value.reduce((sum, i) => sum + i.harga * i.jumlah, 0)
  )

  // Getter BERPARAMETER → kembalikan fungsi yang menerima argumen
  // Pola ini sering dipakai untuk "cari item by id"
  const getItemById = computed(() => {
    return (id) => items.value.find((i) => i.id === id)
  })

  // Getter yang memakai getter LAIN (totalHarga)
  const totalFormat = computed(() =>
    'Rp ' + totalHarga.value.toLocaleString('id-ID')
  )

  return { items, totalHarga, getItemById, totalFormat }
})
```

```javascript
// Cara menggunakannya di komponen:
const cart = useCartStore()

// Getter tanpa param → akses seperti property
console.log(cart.totalHarga)    // 450

// Getter berparam → KAMU HARUS PANGGIL sebagai fungsi
const item = cart.getItemById(1) // { id: 1, nama: 'Mouse', ... }
console.log(cart.getItemById(2)?.nama) // 'Keyboard'

// Penting: setiap pemanggilan getItemById(1) membuat closure baru,
// jadi jangan destrukturisasi getter berparam via storeToRefs lalu pakai
// sebagai value — panggil langsung dari store.
```

| Pola Getter | Cara Akses | Cocok Untuk |
| --- | --- | --- |
| Tanpa parameter | `store.namaGetter` | Nilai turunan sederhana |
| Berparameter | `store.cari(id)` | Filter/cari by id, by kategori |
| Memanggil getter lain | Di dalam `computed` | Formatting, agregat bertingkat |

> ⚠️ **Catatan:** Getter berparameter **tidak** di-cache seperti getter biasa — karena ia mengembalikan fungsi, setiap pemanggilan mengeksekusi ulang fungsi tersebut. Untuk data besar yang sering diakses, lebih baik buat getter biasa (array hasil filter) daripada getter berparam yang dipanggil berulang di loop.

---

## 🔗 Actions Lintas Store (Cross-Store)

Action di satu store sering perlu membaca/mengubah store **lain**. Karena semua store adalah singleton, kita cukup panggil store lain di dalam action.

```javascript
// stores/cartStore.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/authStore' // ← import store lain

export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  const totalHarga = computed(() =>
    items.value.reduce((s, i) => s + i.harga * i.jumlah, 0)
  )

  function tambah(produk) {
    items.value.push({ ...produk, jumlah: 1 })
  }

  // Action yang butuh store LAIN
  async function checkout() {
    // ① Ambil store auth (singleton, sama di mana pun)
    const auth = useAuthStore()

    // ② Guard: tidak bisa checkout kalau belum login
    if (!auth.isLoggedIn) {
      throw new Error('Kamu harus login dulu')
    }

    // ③ Pakai data dari auth untuk membentuk order
    const order = {
      userId: auth.user.id,
      items: items.value,
      total: totalHarga.value,
    }

    // ④ Simulasi kirim ke API
    console.log('Order untuk', auth.namaUser, order)

    // ⑤ Kosongkan cart setelah sukses
    items.value = []
    return { sukses: true }
  }

  return { items, totalHarga, tambah, checkout }
})
```

```javascript
// ❌ SALAH: memanggil useAuthStore() di LEVEL MODULE (di luar fungsi)
// import { useAuthStore } from '@/stores/authStore'
// const auth = useAuthStore()  // ← error "no active Pinia" saat build

// ✅ BENAR: panggil DI DALAM action (saat runtime, Pinia sudah aktif)
function checkout() {
  const auth = useAuthStore() // ← aman, dipanggil saat action jalan
}
```

| Aturan Cross-Store | Penjelasan |
| --- | --- |
| Import store lain di atas | ✅ Aman — hanya import, belum panggil |
| Panggil `useXStore()` di dalam action | ✅ Aman — jalan saat runtime |
| Panggil `useXStore()` di level module | ❌ Error — Pinia belum aktif |

> 💡 **Tips:** Hindari **siklus referensi melingkar** (cart memanggil auth, auth memanggil cart, ...). Jika dua store saling butuh, pindahkan logika yang beririsan ke composable netral atau restruktur domain-nya.

---

## 👀 Mengawasi Store dengan `watch`

Selain `$subscribe` (yang hanya memantau **state**), kita bisa pakai `watch` biasa Vue untuk mengawasi state **maupun getter** store, lengkap dengan opsi `deep`/`immediate`.

```javascript
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cartStore'

const cart = useCartStore()
const { totalHarga, items } = storeToRefs(cart)

// ① Watch satu getter (otomatis reaktif)
watch(totalHarga, (baru, lama) => {
  console.log(`Total berubah: ${lama} → ${baru}`)
})

// ② Watch dengan { deep: true } untuk array/object
watch(items, (baru) => {
  console.log('Isi cart sekarang:', baru)
}, { deep: true })

// ③ Watch SEKALIGUS saat mount (immediate)
watch(
  () => cart.items.length,
  (jumlah) => {
    console.log('Jumlah item di cart:', jumlah)
  },
  { immediate: true } // ← jalan sekali saat pertama dipasang
)
```

| Kebutuhan | Pakai |
| --- | --- |
| Reaksi tiap state berubah (eksternal) | `store.$subscribe()` |
| Watch getter/state tertentu dengan old/new | `watch()` |
| Butuh `deep`/`immediate` | `watch()` |

> 💡 **Tips:** Gunakan `$subscribe` untuk **sinkronisasi eksternal** (localStorage, analytics). Gunakan `watch` untuk **logika lanjutan di dalam komponen** (misal tampilkan notifikasi saat total melebihi batas). Jangan lupa `watch` mengembalikan fungsi stop — `const stop = watch(...)` lalu `onUnmounted(stop)` bila perlu.

---

## 🧩 Pola Komposisi Store (Composable Pattern)

Store setup style sejatinya **composable**. Kita bisa mengekstrak bagian store ke composable kecil, lalu menyusunnya di dalam `defineStore`. Ini membuat store panjang tetap terbaca.

```javascript
// composables/useLocalStorageState.js
import { ref, watch } from 'vue'

// Composable yang mengelola state + persist ke localStorage
export function useLocalStorageState(key, fallback) {
  const data = ref(read(key, fallback))

  watch(data, (val) => {
    localStorage.setItem(key, JSON.stringify(val))
  }, { deep: true })

  return data
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}
```

```javascript
// stores/themeStore.js — pakai composable di dalam store
import { defineStore } from 'pinia'
import { useLocalStorageState } from '@/composables/useLocalStorageState'

export const useThemeStore = defineStore('theme', () => {
  // State + persist ditangani composable
  const mode = useLocalStorageState('theme-mode', 'light')

  const isDark = computed(() => mode.value === 'dark')

  function toggle() {
    mode.value = isDark.value ? 'light' : 'dark'
  }

  return { mode, isDark, toggle }
})
```

```javascript
// Pola "store membungkus composable lain":
//
//   useAuthStore()
//      └─ pakai useLocalStorageState()   (persist token)
//      └─ pakai useApi()                (fetch login)
//      └─ pakai useNotification()        (toast error)
//
// Store menjadi "orchestrator" yang menyatukan composable.
```

> 💡 **Tips:** Jangan bikin composable yang **bergantung store** lalu dipakai di dalam store yang **sama** — itu circular. Composable yang dipakai store sebaiknya murni (tidak panggil `useXStore`).

---

## 💾 Pinia Plugin — Persisted State (Persiapan Bab 20)

Sering kita ingin **seluruh store otomatis tersimpan** ke localStorage tanpa menulis `$subscribe` manual di tiap store. Solusinya: **Pinia plugin**. Plugin adalah fungsi yang dijalankan Pinia saat setiap store dibuat.

```javascript
// plugins/persist.js — plugin sederhana
export function persistPlugin({ store }) {
  // ① Baca dari localStorage saat store dibuat
  const key = `pinia-${store.$id}`
  const saved = localStorage.getItem(key)
  if (saved) {
    store.$patch(JSON.parse(saved))
  }

  // ② Simpan tiap kali state berubah
  store.$subscribe((mutation, state) => {
    localStorage.setItem(key, JSON.stringify(state))
  })
}
```

```javascript
// main.js — daftarkan plugin ke Pinia
import { createPinia } from 'pinia'
import { persistPlugin } from '@/plugins/persist'

const pinia = createPinia()
pinia.use(persistPlugin) // ← pasang plugin

app.use(pinia)
```

```javascript
// Di Bab 20 kita pakai library jadi: pinia-plugin-persistedstate
// yang menangani edge case (nested state, storage custom, sebelum
// hidrasi). Pola di atas cukup untuk paham "apa itu plugin Pinia".
```

| Aspek | `$subscribe` manual | Plugin persist |
| --- | --- | --- |
| Penulisan | Di tiap store | Sekali, global |
| Fleksibilitas | Tinggi | Menengah |
| Rekomendasi | Kasus spesifik | Seluruh store perlu persist |

> 💡 **Tips:** Pinia plugin bisa menambah **property baru** ke semua store (misal `$lastChanged`), mengubah behavior action, atau menyuntikkan logging. Ini pola tingkat lanjut — pahami dulu dasar store sebelum membuat plugin sendiri.

---

## 🛒 Studi Kasus Lengkap — `cartStore`

Mari kita bangun store keranjang belanja **utuh** yang menggabungkan state, getter, action, dan cross-store.

```javascript
// stores/cartStore.js — VERSI LENGKAP
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/authStore'

export const useCartStore = defineStore('cart', () => {
  // ── STATE ──
  const items = ref([]) // [{ id, nama, harga, jumlah }]

  // ── GETTERS ──
  const jumlahItem = computed(() => items.value.length)
  const totalHarga = computed(() =>
    items.value.reduce((s, i) => s + i.harga * i.jumlah, 0)
  )
  const totalFormat = computed(() =>
    'Rp ' + totalHarga.value.toLocaleString('id-ID')
  )
  const getItemById = computed(() => (id) =>
    items.value.find((i) => i.id === id)
  )

  // ── ACTIONS ──
  function tambah(produk) {
    const existing = items.value.find((i) => i.id === produk.id)
    if (existing) {
      existing.jumlah++ // sudah ada → tambah jumlah
    } else {
      items.value.push({ ...produk, jumlah: 1 })
    }
  }

  function kurang(id) {
    const item = items.value.find((i) => i.id === id)
    if (!item) return
    item.jumlah--
    if (item.jumlah <= 0) hapus(id)
  }

  function hapus(id) {
    items.value = items.value.filter((i) => i.id !== id)
  }

  function kosongkan() {
    items.value = []
  }

  async function checkout() {
    const auth = useAuthStore()
    if (!auth.isLoggedIn) throw new Error('Login dulu')
    if (items.value.length === 0) throw new Error('Cart kosong')

    const order = {
      user: auth.user.id,
      items: items.value,
      total: totalHarga.value,
    }
    console.log('Checkout:', order)
    kosongkan()
    return { sukses: true, order }
  }

  return {
    items, jumlahItem, totalHarga, totalFormat, getItemById,
    tambah, kurang, hapus, kosongkan, checkout,
  }
})
```

```vue
<!-- Komponen Keranjang.vue -->
<script setup>
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cartStore'

const cart = useCartStore()
// State & getter via storeToRefs (reaktif)
const { items, totalFormat } = storeToRefs(cart)
// Action langsung (bukan destruktur)
</script>

<template>
  <div class="keranjang">
    <h2>🛒 Keranjang ({{ items.length }})</h2>
    <ul>
      <li v-for="i in items" :key="i.id">
        {{ i.nama }} × {{ i.jumlah }}
        <button @click="cart.kurang(i.id)">−</button>
        <button @click="cart.tambah(i)">+</button>
        <button @click="cart.hapus(i.id)">🗑️</button>
      </li>
    </ul>
    <p>Total: {{ totalFormat }}</p>
    <button @click="cart.checkout()">Checkout</button>
  </div>
</template>
```

**Alur checkout:**
```
User klik "+"  → cart.tambah(produk) → items bertambah
     ↓
totalHarga (getter) otomatis hitung ulang → Navbar update badge
     ↓
User klik "Checkout" → cart.checkout()
     ↓
cek auth.isLoggedIn (cross-store) → kalau false → throw error
     ↓
kalau sukses → kosongkan() → items = [] → UI kosong
```

> 💡 **Tips:** Perhatikan bagaimana `kurang()` memanggil `hapus()` — **action memanggil action lain** di store yang sama cukup dengan memanggil nama fungsinya langsung. Tidak perlu `cart.hapus(...)`.

---

## 🗺️ Peta Alur Data Global (Mental Model)

Sebelum lanjut, bentuk mental model utuh bagaimana data mengalir di aplikasi Vue + Pinia:

```
┌──────────────────────────────────────────────────────────────┐
│                       BROWSER / APP                          │
│                                                              │
│   API Server (TMDB, Backend)                                │
│        │  (HTTP via Axios, Bab 21)                          │
│        ↓                                                      │
│   ┌─────────────── STORE PINIA (singleton) ───────────┐    │
│   │  authStore ──┐                                      │    │
│   │  movieStore  ├── state + getters + actions         │    │
│   │  watchlistStore ─┘                                  │    │
│   └───────────────────────┬────────────────────────────┘    │
│        ↑ storeToRefs       │ useStore()                      │
│        │ (reaktif)         ↓                                 │
│   ┌──────────────── Komponen (Views/Components) ─────────┐  │
│   │  Navbar, BrowseView, MovieCard, ProfileView, ...     │  │
│   └───────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘

ARAH DATA:
  • API → store.action (fetch & simpan)
  • store.state → komponen (via storeToRefs, reaktif)
  • komponen → store.action (user klik → panggil action)
  • store.action → API (kirim perubahan)
```

| Pertanyaan | Jawabannya ada di |
| --- | --- |
| Di mana menyimpan data user? | `authStore` (Bab 19) |
| Bagaimana mengambil dari API? | Axios + interceptor (Bab 21) |
| Bagaimana state tetap saat refresh? | Hydration localStorage (Bab 19) |
| Bagaimana test logika? | Vitest `setActivePinia` (Bab 23) |
| Bagaimana optimasi list besar? | `shallowRef`, virtual scroll (Bab 23) |

> 🎯 **Kesimpulan Mental Model:** Pinia adalah **jantung data** aplikasimu. API mengisinya, komponen membacanya, komponen menginstruksinya lewat action, action menulis ke API. Semuanya terpusat — tidak ada props drilling.

---

## 🚨 Jebakan Umum Pemula di Bab 19

### ❌ Jebakan 1 — Lupa `app.use(pinia)` di main.js
```javascript
// ❌ SALAH — useStore() akan error "no active Pinia"
const app = createApp(App)
app.mount('#app')

// ✅ BENAR
const pinia = createPinia()
app.use(pinia)
app.mount('#app')
```

---

### ❌ Jebakan 2 — Destrukturisasi State Tanpa `storeToRefs`
```javascript
// ❌ SALAH — reaktivitas hilang!
const { user, isLoggedIn } = authStore

// ✅ BENAR
const { user, isLoggedIn } = storeToRefs(authStore)
```

---

### ❌ Jebakan 3 — Ubah State di dalam Getter
```javascript
// ❌ SALAH — getter harus readonly
const namaBesar = computed(() => {
  user.value.name = user.value.name.toUpperCase() // mutasi!
  return user.value.name
})

// ✅ BENAR — hanya baca & kembalikan
const namaBesar = computed(() => user.value?.name?.toUpperCase() ?? '')
```

---

### ❌ Jebakan 4 — Memanggil `useStore` di Luar `setup`/komponen Tanpa Pinia Aktif
```javascript
// ❌ SALAH — dipanggil di module level sebelum app.use(pinia)
// (store aktif hanya setelah Pinia dipasang)
export const useAuthStore = defineStore('auth', () => { ... })

// ✅ BENAR — panggil di dalam setup komponen / setelah app jalan
// const auth = useAuthStore()  // ← di dalam <script setup>
```

---

### ❌ Jebakan 5 — Menduplikasi ID Store
```javascript
// ❌ SALAH — dua store id sama 'auth' → tabrakan
defineStore('auth', () => { ... })
defineStore('auth', () => { ... })

// ✅ BENAR — id unik per store
defineStore('auth', () => { ... })
defineStore('movie', () => { ... })
```

---

### ❌ Jebakan 6 — Mutasi Langsung `reactive` Array di Dalam Action Tanpa Perhatian

```javascript
// ❌ SALAH — menganggap reassign reactive aman
const items = reactive([])
// items = [...]  → ❌ GAGAL: reactive tidak bisa di-reassign
// (referensi hilang, reaktivitas putus)

// ✅ BENAR — mutasi atau pakai ref(array)
const items = ref([])
items.value = [...] // ✅ aman dengan ref
// atau mutasi reactive:
items.push(...baru) // ✅ aman
```

> ✅ **Solusi:** Untuk array/object yang sering diganti seluruhnya, pakai `ref([])` bukan `reactive([])`. `ref` bisa di-reassign tanpa kehilangan reaktivitas.

---

### ❌ Jebakan 7 — Loop Tak Terbatas di `$subscribe`

```javascript
// ❌ SALAH — subscribe yang menulis state yang SAMA → loop tak berakhir
const auth = useAuthStore()
auth.$subscribe((mutation, state) => {
  // menulis state yang dipantau → memicu subscribe lagi → loop!
  auth.token = state.token // ❌ trigger subscribe lagi
})

// ✅ BENAR — tulis ke storage eksternal, BUKAN ke state store
auth.$subscribe((mutation, state) => {
  localStorage.setItem('token', state.token) // ✅ aman, tidak trigger loop
})
```

> ✅ **Solusi:** Di callback `$subscribe`, **jangan** ubah state store itu sendiri. Hanya tulis ke sumber eksternal (localStorage, server, analytics).

---

## 📝 Ringkasan Bab 19

| Konsep | Penjelasan |
| --- | --- |
| **Pinia** | State management resmi Vue 3 (pengganti Vuex) |
| **Store** | Wadah data global, diakses komponen mana pun |
| **Setup Pinia** | `createPinia()` + `app.use(pinia)` di main.js |
| **State** | `ref`/`reactive` — data mentah |
| **Getters** | `computed` — data turunan (readonly) |
| **Actions** | `function` — logika ubah state (bisa async) |
| **`useStore()`** | Ambil instance store (singleton) di komponen |
| **`storeToRefs`** | Destrukturisasi state/getter tetap reaktif |
| **Multiple stores** | Satu store = satu domain data |
| **Setup vs Options** | Setup style direkomendasikan (konsisten Composition API) |

---

## 🎯 Latihan Mandiri

**⭐ Latihan 1 — Store Counter**
Buat `counterStore` dengan state `count` (ref 0), getter `double` (count × 2), dan action `increment`/`decrement`. Tampilkan di komponen dengan tombol + dan −. Pastikan `double` update otomatis.

**⭐⭐ Latihan 2 — Cart Store dengan Getter**
Buat `cartStore` berisi `items` (array `{id, nama, harga, jumlah}`). Buat getter `totalHarga` dan `jumlahItem`. Action `tambah(item)` dan `hapus(id)`. Tampilkan total di navbar via `storeToRefs`.

**⭐⭐⭐ Latihan 3 — Auth Store + Router**
Buat `authStore` dengan `user`, `token`, getter `isLoggedIn`, action `login`/`logout` (simpan token ke localStorage). Hubungkan dengan router guard dari Bab 17: halaman `/dashboard` butuh `isLoggedIn`.

**⭐⭐⭐⭐ Latihan 4 — Multi-Store**
Buat dua store: `userStore` (profil) dan `themeStore` (light/dark). `themeStore` punya action `toggle()` dan getter `isDark`. Terapkan class `dark` di `<body>` berdasar `isDark`. Ubah tema dari satu komponen, pantau efeknya di komponen lain.

---

*Lanjut ke ➡️ **Bab 20 — 📚 Pinia Lanjutan & Best Practices***
