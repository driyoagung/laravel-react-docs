# 🔧 Bab 11 — Fitur Lanjutan Options API

> *"Kadang komponen di ujung sana butuh data dari root, tapi jalur di antaranya panjang dan berliku. `props` akan membuatmu lelah meneruskan bola dari tangan ke tangan. Di sinilah `provide` & `inject` berperan sebagai 'teleportasi data'."*

---

> **🧠 Apa Itu `provide` & `inject`?**
>
> `provide` dan `inject` adalah sepasang fitur Vue untuk **mengirim data menembus banyak level komponen** tanpa *prop drilling*. Komponen di atas (ancestor) men-`provide` (menyediakan) data; komponen di bawah (descendant), berapa pun jauhnya, cukup `inject` (menyuntik) data itu langsung. Mereka adalah "jalur pintas" dalam hierarki komponen.
>
> Fitur ini sudah ada sejak Vue 2 dan sangat berguna untuk **konfigurasi global**: tema aplikasi, data user login, locale, base URL API, dan sebagainya.

---

> **🏗️ Analogi Sederhana:**
>
> Bayangkan **stasiun radio**. Komponen yang `provide` adalah *pemancar* — ia menyiarkan sinyal `"temaWarna = dark"`. Komponen yang `inject` adalah *radio* di rumah mana pun — ia menangkap sinyal itu tanpa peduli berapa banyak rumah (komponen) yang dilewatinya di antaranya. Tidak perlu setiap rumah meneruskan sinyal ke rumah sebelah; radionya langsung "mendengar" pemancar. Itulah `provide`/`inject`: siaran satu-arah dari atas ke bawah.

---

## 📋 Daftar Isi Bab 11

1. Masalah Prop Drilling yang Melelahkan
2. Konsep Dasar `provide` & `inject`
3. Contoh: Tema & User Login (Skenario Klasik)
4. Cara Kerja di Balik Layar (Provide Chain)
5. ⚠️ Reactivity: Mengapa `provide` Tidak Otomatis Reactive
6. Reactive Provide yang Benar (Object & Ref)
7. 🎨 Studi Kasus: Theme Switcher Lengkap
8. Memberi Nilai Default saat Inject
9. Aliasing & Symbol Keys (Advanced)
10. Caveats: Hidden Coupling & Dokumentasi
11. Kapan Pakai vs Kapan Hindari
12. 🎁 Bonus: Mixins vs Composables (Perbandingan)
13. 🎬 Studi Kasus: Konfigurasi Global Aplikasi
14. 🔐 Provide/Inject dengan Function (Action Injection)
15. 🧪 Provide/Inject vs Props vs Pinia — Kapan Mana?
16. 🛠️ Contoh Multi-Provider Lengkap
17. 📊 Tabel Perbandingan Reactivity & Pola
18. 🧰 Pola provide/inject untuk Plugin & Library
19. 📱 Studi Kasus Mini: Toggle Locale (Bahasa)
20. 🎨 Pola Lanjutan: Theming dengan CSS Variables
21. 🔭 Urutan Injeksi & Override Bertingkat (Deep Dive)
22. 🔄 Provide Reactive dengan `reactive()` Object (Bonus)
23. 🧩 Provide/Inject & Komunikasi Child→Ancestor
24. 🚨 Jebakan Umum Pemula di Bab 11
25. 📝 Ringkasan Bab 11
26. 🎯 Latihan Mandiri

---

## 😩 1. Masalah Prop Drilling yang Melelahkan

Di bab sebelumnya kita belajar `props` untuk mengirim data parent → child. Tapi lihat struktur ini:

```
App.vue (punya data tema & user)
  └─ Layout.vue
       └─ Sidebar.vue
            └─ MovieCard.vue   ← butuh akses tema & user!
```

Kalau pakai `props` biasa, `App` harus kirim ke `Layout`, `Layout` ke `Sidebar`, `Sidebar` ke `MovieCard` — padahal `Layout` dan `Sidebar` **tidak butuh** data itu. Ini disebut **prop drilling**.

```vue
<!-- ❌ PROP DRILLING: semua level ikut-ikutan meneruskan -->
<!-- App.vue -->
<Layout :tema="tema" :user="user" />

<!-- Layout.vue (tidak butuh, cuma teruskan) -->
<Sidebar :tema="tema" :user="user" />

<!-- Sidebar.vue (tidak butuh, cuma teruskan) -->
<MovieCard :tema="tema" :user="user" />

<!-- MovieCard.vue (baru dipakai di sini) -->
<p>{{ tema }} {{ user.nama }}</p>
```

Masalahnya:
- `Layout` & `Sidebar` jadi "korban" — mereka terpaksa menerima prop yang tidak dipakai.
- Kalau `App` menambah prop baru, semua level tengah harus diubah.
- Sangat mengganggu saat hierarki dalam (dalam = nested).

**Solusi:** `provide`/`inject`.

> 💡 **Tanda-tanda kamu butuh `provide`/`inject`:**
> - Ada data yang dipakai di **level ke-3 atau lebih dalam** dari sumbernya.
> - Komponen tengah **tidak menggunakan** data tersebut, cuma meneruskan.
> - Datanya **stabil** (tema, user, config) — bukan state yang berubah tiap detik.
>
> Kalau hanya 1-2 level, tetap pakai `props` biasa. `provide`/`inject` adalah "alat berat" untuk kasus berliku.

---

## 📡 2. Konsep Dasar `provide` & `inject`

```js
// ─────────────────────────────────────────────────────────────
// ANCESTOR (menyediakan)
// ─────────────────────────────────────────────────────────────
export default {
  // provide() mengembalikan object { key: value }
  provide() {
    return {
      temaWarna: 'dark',
      userLogin: this.user,
    }
  },
  data() {
    return { user: { nama: 'Budi', role: 'admin' } }
  }
}
```

```js
// ─────────────────────────────────────────────────────────────
// DESCENDANT (menyuntik) — boleh di level mana pun
// ─────────────────────────────────────────────────────────────
export default {
  // inject: array of key yang ingin diambil
  inject: ['temaWarna', 'userLogin'],

  mounted() {
    console.log(this.temaWarna)  // 'dark' — langsung dari ancestor!
    console.log(this.userLogin)  // { nama: 'Budi', role: 'admin' }
  }
}
```

Perhatikan: `MovieCard.vue` (atau komponen anak mana pun) langsung mendapat `temaWarna` dan `userLogin` **tanpa** `Layout`/`Sidebar` ikut-ikutan. Mereka "dilewati".

### 📌 Aturan Penulisan `provide()`

```
provide() {
  return {
    kunciString: nilaiApapun,   // string, number, object, array, function
  }
}
```

- `provide()` **harus** mengembalikan sebuah object.
- Key bisa berupa string biasa atau `Symbol` (untuk menghindari tabrakan nama — lihat bagian 9).
- Nilai bisa apa saja: primitif, object, array, bahkan **function**.

### 📌 Aturan Penulisan `inject`

```js
// Cara 1: array of key (paling simpel)
inject: ['temaWarna', 'userLogin']

// Cara 2: object dengan opsi (default, aliasing, from) — lihat bagian 8 & 9
inject: {
  warnaTema: { from: 'temaWarna', default: 'light' },
}
```

---

## 👥 3. Contoh: Tema & User Login (Skenario Klasik)

```vue
<!-- GrandParent: App.vue -->
<script>
export default {
  data() {
    return {
      user: { nama: 'Budi', role: 'admin' }
    }
  },
  provide() {
    return {
      temaWarna: 'dark',
      userLogin: this.user,
    }
  }
}
</script>

<!-- GrandChild: MovieCard.vue — skip parent di tengah! -->
<script>
export default {
  inject: ['temaWarna', 'userLogin'],
  mounted() {
    console.log(this.temaWarna) // 'dark' — dapat dari App.vue!
    console.log(this.userLogin)  // { nama: 'Budi', role: 'admin' }
  }
}
</script>
```

> 💡 **Kapan `provide/inject` paling pas?**
> - Tema aplikasi (dark/light mode)
> - Data user yang login
> - Konfigurasi global (`apiBaseUrl`, `locale`)
> - Library/plugin yang ingin memberi akses ke instance (seperti Vue Router memberi `router`)

> ⚠️ **Perhatian:** Di contoh klasik di atas, `temaWarna` adalah **string primitif**. Artinya kalau `App` nanti mengubah tema, `MovieCard` **tidak** ikut berubah. Ini sengaja ditunjukkan dulu sebagai "cara dasar"; perbaikan reactivity dibahas di bagian 5 & 6.

---

## 🔗 4. Cara Kerja di Balik Layar (Provide Chain)

1. Komponen yang memanggil `provide()` menyimpan pasangan `key → value` di dalam instance-nya.
2. Vue membentuk rantai *provide chain* dari root ke leaf (ancestor → descendant).
3. Saat komponen anak menulis `inject: ['temaWarna']`, Vue menelusuri rantai ke atas sampai menemukan `temaWarna`, lalu menyuntikkannya sebagai properti (`this.temaWarna`).

```
App (provide: temaWarna, userLogin)
  │
  ├─ Layout (TIDAK provide, TIDAK inject)
  │    │
  │    ├─ Sidebar (TIDAK provide, TIDAK inject)
  │    │    │
  │    │    └─ MovieCard (inject: temaWarna, userLogin)
  │    │         → Vue telusuri ke atas: Layout? tidak ada.
  │    │           Sidebar? tidak ada. App? KETEMU! → inject.
```

> 📌 **Multiple providers:** Kalau dua ancestor sama-sama `provide('temaWarna')`, yang **terdekat** (paling bawah) yang menang. Mirip *shadowing* variabel.

### 🔬 Visualisasi Rantai dengan Dua Provider

```
Root (provide: temaWarna = 'dark')
  │
  ├─ SectionA (provide: temaWarna = 'light')   ← override
  │    └─ CardA (inject temaWarna) → 'light'  (SectionA menang)
  │
  └─ SectionB (TIDAK provide temaWarna)
       └─ CardB (inject temaWarna) → 'dark'    (Root yang berlaku)
```

Ini penting: injeksi **selalu** mengambil dari ancestor terdekat yang mem-`provide` key tersebut.

---

## ⚠️ 5. Reactivity: Mengapa `provide` Tidak Otomatis Reactive

Ini detail **paling penting** di bab ini. Nilai yang di-`provide` **tidak otomatis reactive** dalam artian penuh.

```js
export default {
  data() { return { temaWarna: 'dark' } },
  provide() {
    // ❌ ini MENYALIN nilai primitif saat provide() dipanggil
    return { temaWarna: this.temaWarna }
  },
  methods: {
    gantiTema() {
      this.temaWarna = 'light'   // ❌ child TIDAK update!
      // karena yang di-provide adalah salinan nilai 'dark' yang sudah diambil
    }
  }
}
```

**Mengapa?** `provide()` dipanggil **sekali** saat komponen dibuat. Saat itu `this.temaWarna` berisi `'dark'`, sehingga yang disimpan ke chain adalah string `'dark'` (salinan). Mengubah `this.temaWarna` nanti tidak mengubah salinan yang sudah disimpan.

> 🧠 **Mental model:** Bayangkan `provide()` seperti memotret layar saat itu juga. Foto yang dikirim ke anak adalah "potret" nilai saat pemanggilan — bukan "live stream". Kalau ingin live stream, kamu harus mengirim **referensi** ke object (bagian 6), bukan salinan nilai.

### ✅ Solusi 1 — Provide object (reactive by reference)

```js
export default {
  data() {
    return {
      // object → di-provide sebagai REFERENSI
      tema: { warna: 'dark', font: 'sans' }
    }
  },
  provide() {
    // ✅ child melihat perubahan PROPERTI di dalam object
    return { tema: this.tema }
  },
  methods: {
    gantiWarna() {
      this.tema.warna = 'light'   // ✅ child UPDATE! (referensi sama)
    }
  }
}
```

Karena `this.tema` adalah object, yang di-provide adalah **referensi** ke object yang sama. Child menyuntik referensi itu, sehingga perubahan properti di dalamnya terlihat.

> ⚠️ Tapi hati-hati: child bisa *secara tidak sengaja memutasi* object tema milik ancestor. Ini "jas hitam" (side-effect global). Untuk kontrol lebih baik, gunakan pendekatan Composition API (ref/reactive) — lihat bagian 6.

### ✅ Solusi 2 — Provide sebuah "getter" via computed (pola aman, read-only)

```js
export default {
  data() { return { temaWarna: 'dark' } },
  computed: {
    // computed ini reactive — berubah saat this.temaWarna berubah
    temaPayload() {
      return { warna: this.temaWarna }
    }
  },
  provide() {
    // ❌ TETAP salah: provide() cuma dipanggil sekali!
    return { tema: this.temaPayload }
  }
}
```

> 📌 **Peringatan halus:** Banyak pemula mengira "kalau aku provide sebuah `computed`, anak akan update". **Tidak.** `provide()` tetap dipanggil sekali; `this.temaPayload` dievaluasi sekali menghasilkan object `{ warna: 'dark' }` yang disalin. Yang menyelamatkanmu adalah memberikan **referensi object yang sama** (Solusi 1) atau **ref/reactive** (Solusi di bagian 6). `computed` baru membantu kalau ia dikembalikan sebagai *bagian dari object reactive* yang di-provide.

---

## 🔄 6. Reactive Provide yang Benar (Object & Ref)

Di Composition API, kamu bisa `provide` sebuah `ref` atau `reactive` agar anak benar-benar reaktif dan aman:

```vue
<!-- App.vue (Composition API) -->
<script setup>
import { ref, provide } from 'vue'

// ref → bisa di-reassign dan anak ikut update
const temaWarna = ref('dark')
provide('temaWarna', temaWarna)   // provide REF-nya, bukan nilainya

function gantiTema() {
  temaWarna.value = 'light'       // ✅ semua child inject ikut update
}
</script>
```

```vue
<!-- Child mana pun (Composition API) -->
<script setup>
import { inject } from 'vue'

// inject REF → pakai .value
const temaWarna = inject('temaWarna')
console.log(temaWarna.value)      // 'dark'
</script>
```

```vue
<!-- Child mana pun (Options API) -->
<script>
export default {
  inject: ['temaWarna'],   // otomatis unwrap jadi this.temaWarna = nilai
  mounted() {
    console.log(this.temaWarna)   // 'dark' (Options API unwrap ref)
  }
}
</script>
```

> 💡 **Perbedaan unwrap:** Di Options API, `inject` otomatis **unwrapping** ref jadi nilainya (`this.temaWarna === 'dark'`). Di Composition API, kamu inject ref mentah (`temaWarna.value`).

### Tabel Reactive Provide

| Cara Provide | Child Update Saat Diubah? | Catatan |
| --- | --- | --- |
| `provide({ x: this.x })` (primitif) | ❌ Tidak | salinan nilai |
| `provide({ obj: this.obj })` (object) | ✅ Properti berubah | mutasi shared, hati-hati |
| `provide('x', ref)` (Composition) | ✅ Ya | paling bersih & terkontrol |

---

## 🎨 7. Studi Kasus: Theme Switcher Lengkap

Mari bangun **dark/light mode** yang bisa diubah di `App.vue` dan langsung memengaruhi semua komponen via `provide`/`inject`.

```vue
<!-- App.vue -->
<template>
  <div :class="tema.warna">
    <button @click="gantiTema">
      Ganti ke {{ tema.warna === 'dark' ? 'Light' : 'Dark' }}
    </button>
    <!-- Hierarki dalam: Layout > Sidebar > TombolTema -->
    <Layout />
  </div>
</template>

<script>
// ─────────────────────────────────────────────────────────────
// APP menyediakan tema sebagai OBJECT reactive
// ─────────────────────────────────────────────────────────────
export default {
  data() {
    return {
      tema: {
        warna: 'dark',       // 'dark' | 'light'
        teks:  '#fff',
        latar: '#141414',
      }
    }
  },
  provide() {
    // provide REFERENSI object → child lihat perubahan
    return {
      tema: this.tema,
      // juga sediakan method untuk ganti tema
      gantiTema: this.gantiTema,
    }
  },
  methods: {
    gantiTema() {
      this.tema.warna = this.tema.warna === 'dark' ? 'light' : 'dark'
      this.tema.teks  = this.tema.warna === 'dark' ? '#fff'  : '#000'
      this.tema.latar = this.tema.warna === 'dark' ? '#141414' : '#f5f5f5'
    }
  }
}
</script>

<style>
.dark  { background: #141414; color: #fff; }
.light { background: #f5f5f5; color: #000; }
</style>
```

```vue
<!-- TombolTema.vue (anak cucu, tidak ada parent tengah yg terima prop) -->
<template>
  <button
    class="tombol-tema"
    :style="{ background: tema.latar, color: tema.teks }"
    @click="gantiTema"
  >
    Mode: {{ tema.warna }}
  </button>
</template>

<script>
// ─────────────────────────────────────────────────────────────
// CHILD langsung inject — tanpa prop drilling!
// ─────────────────────────────────────────────────────────────
export default {
  inject: ['tema', 'gantiTema'],
  mounted() {
    console.log('Tema aktif:', this.tema.warna)  // 'dark'
  }
}
</script>
```

**Yang terjadi:**
- `App` mengubah `tema.warna` → karena `tema` di-inject sebagai referensi, `TombolTema` langsung merender ulang dengan warna baru.
- Tidak ada SATU PUN parent tengah yang meneruskan prop. ✅

---

## 🛟 8. Memberi Nilai Default saat Inject

Kalau komponen `inject` sebuah key yang **tidak disediakan** ancestor mana pun, hasilnya `undefined`. Kamu bisa memberi nilai cadangan.

```js
// Options API — pakai object syntax
export default {
  inject: {
    temaWarna: {
      // dari key mana di-inject
      from: 'temaWarna',
      // nilai default kalau tidak ada ancestor yg provide
      default: 'light',
    },
    // default bisa berupa factory untuk object/array
    userLogin: {
      default: () => ({ nama: 'Guest', role: 'anonim' }),
    }
  }
}
```

```js
// Composition API
import { inject } from 'vue'
const tema = inject('temaWarna', 'light')           // default primitif
const user = inject('userLogin', () => ({ nama: 'Guest' }))  // factory
```

> 💡 **Gunakan default** agar komponen tetap aman walau digunakan di luar konteks provider (misal di unit test atau di.root berbeda).

### ❌ vs ✅ — Default untuk Object/Array

```js
// ❌ SALAH — default object langsung (bisa tertukar referensi antar instance)
inject: {
  config: { default: { apiUrl: 'x' } }   // ❌ object dibuat saat modul load
}

// ✅ BENAR — pakai factory function
inject: {
  config: { default: () => ({ apiUrl: 'x' }) }  // ✅ dibuat ulang tiap inject
}
```

> 📌 **Aturan:** Untuk default berupa **object/array**, selalu pakai *factory function* `() => (...)`. Kalau tidak, semua instance yang inject akan berbagi object default yang sama (mirip bug "state di luar fungsi" di Bab 14).

---

## 🔑 9. Aliasing & Symbol Keys (Advanced)

### Aliasing (ganti nama saat inject)

```js
export default {
  inject: {
    // di dalam komponen kita pakai nama 'warnaTema'
    // tapi ambil dari provider key 'temaWarna'
    warnaTema: 'temaWarna',
  },
  mounted() {
    console.log(this.warnaTema)   // nilai dari 'temaWarna'
  }
}
```

### Symbol Keys (hindari tabrakan nama)

```js
// composables/keys.js
export const TemaKey   = Symbol('tema')
export const UserKey   = Symbol('user')

// Provider
import { TemaKey, UserKey } from './keys'
export default {
  provide() {
    return {
      [TemaKey]: this.tema,
      [UserKey]: this.user,
    }
  }
}

// Injector
import { TemaKey } from './keys'
export default {
  inject: {
    tema: { from: TemaKey, default: () => ({ warna: 'light' }) }
  }
}
```

> 💡 **Symbol key** berguna di library/plugin besar agar nama `'tema'` tidak bentrok dengan provider lain. Vue Router & Pinia di internal menggunakan pola ini.

### 📊 Kapan Pakai String vs Symbol

| Kebutuhan | Gunakan | Alasan |
| --- | --- | --- |
| Aplikasi sendiri, key sedikit | String (`'temaWarna'`) | Simpel & mudah dibaca |
| Library/plugin dipakai orang lain | `Symbol` | Hindari tabrakan nama |
| Banyak provider global | `Symbol` + file `keys.js` | Terpusat & aman |
| Prototype cepat | String | Cukup |

---

## ⚠️ 10. Caveats: Hidden Coupling & Dokumentasi

`provide/inject` menciptakan **coupling tersembunyi** (keterikatan tersembunyi) antar komponen. Komponen anak jadi bergantung pada "siapa saja di atas yang menyediakan" — padahal tidak ada hubungan parent-child langsung yang terlihat di kode.

```js
// ❌ Masalah: dari mana 'temaWarna' datang? Tidak jelas!
export default {
  inject: ['temaWarna'],
  // pembaca kode harus mencari ke ATAS seluruh tree untuk tahu sumbernya
}
```

**Best practice:**
1. **Dokumentasikan** apa yang di-inject (komentar atau nama jelas).
2. **Batasi** penggunaan untuk data global & stabil (tema, user, config).
3. **Jangan** gunakan untuk state yang sering berubah & butuh tracking (pakai Pinia).

> 📌 **Injection tidak muncul di devtools secara eksplisit** seperti props. Ia "tak kasat mata" — makanya dokumentasi jadi krusial.

### 📋 Checklist Sebelum Pakai provide/inject

```
☐ Apakah data dipakai di > 2 level dalam?
☐ Apakah data STABIL (tema, user, config)?
☐ Apakah komponen tengah TIDAK memakai data ini?
☐ Apakah aku sudah mendokumentasikan sumber inject?
☐ Apakah aku sudah memberi default untuk keamanan?
☐ Apakah aku yakin BUKAN state yang butuh devtools/tracking?
        ↓ semua ya → pakai provide/inject ✅
        ↓ ada tidak → pertimbangkan props / Pinia
```

---

## 🤔 11. Kapan Pakai vs Kapan Hindari

| ✅ Pakai `provide/inject` untuk | ❌ Hindari untuk |
| --- | --- |
| Tema aplikasi (dark/light) | State kompleks yang sering berubah |
| Data user yang login | State yang butuh devtools/tracking |
| Konfigurasi global (api URL, locale) | Komunikasi antar sibling komponen |
| Plugin/library memberi akses instance | Data yang cuma dipakai 1-2 level (pakai props) |

> ⚠️ **Jangan berlebihan** — untuk state yang kompleks, *mutable*, dan butuh devtools/tracking, gunakan **Pinia** (state management resmi Vue). `provide/inject` bukan pengganti state management.

---

## 🎁 12. Bonus: Mixins vs Composables (Perbandingan)

Karena kita bicara "logika reusable" di Options API, wajib membahas **mixins** — cara lama berbagi logika. Dan membandingkannya dengan **composables** (cara modern di Composition API).

### Mixins (Options API)

```js
// mixins/flixWatchlist.js
export default {
  data() {
    return { watchlist: [] }
  },
  methods: {
    tambahWatchlist(id) { this.watchlist.push(id) },
    hapusWatchlist(id) { this.watchlist = this.watchlist.filter(i => i !== id) }
  }
}
```

```js
// Komponen menggunakan mixin
import watchlistMixin from '@/mixins/watchlistMixin'
export default {
  mixins: [watchlistMixin],   // ← logika "disuntikkan"
  mounted() {
    this.tambahWatchlist(42)  // method dari mixin tersedia via this
  }
}
```

### Composables (Composition API)

```js
// composables/useWatchlist.js
import { ref } from 'vue'
export function useWatchlist() {
  const watchlist = ref([])
  function tambah(id)  { watchlist.value.push(id) }
  function hapus(id)   { watchlist.value = watchlist.value.filter(i => i !== id) }
  return { watchlist, tambah, hapus }
}
```

```vue
<script setup>
import { useWatchlist } from '@/composables/useWatchlist'
const { watchlist, tambah, hapus } = useWatchlist()  // eksplisit!
</script>
```

### 📊 Perbandingan Lengkap

| Aspek | Mixins (Options API) | Composables (Composition API) |
| --- | --- | --- |
| Cara pakai | `mixins: [X]` | `const { x } = useX()` |
| Sumber asal | 🔴 Tersembunyi (disuntik ke `this`) | 🟢 Eksplisit (destructuring) |
| Name collision | ❌ Rawan bentrok (2 mixin punya `data` sama) | ✅ Tidak (kamu namai variabelnya) |
| Tracking asal | 🔴 Susah dilacak | 🟢 Jelas di mana didefinisikan |
| TypeScript | 🔴 Inference lemah | 🟢 Inference kuat |
| Reuse | Sedang | Sangat baik |
| Reaktivitas | `data()` otomatis | `ref`/`reactive` eksplisit |

> ⚠️ **Masalah klasik mixins — name collision:**
> ```js
> // mixin A punya data: { count: 0 }
> // mixin B punya data: { count: 99 }
> // → Vue gabungkan, B menimpa A. Hasil: count = 99 (TIDAK JELAS mengapa!)
> ```
> Composables menghindari ini karena kamu menamai hasilnya sendiri: `const a = useA(); const b = useB()`.

> 💡 **Kesimpulan bonus:** Mixins adalah cara lama berbagi logika di Options API, tapi punya kelemahan pelacakan & collision. Composables (Bagian IV) adalah penggantinya yang jauh lebih bersih. Tapi kalau kamu memelihara kode lama, pahami mixins tetap penting.

---

## 🎬 13. Studi Kasus: Konfigurasi Global Aplikasi

Mari buat `provide` untuk **konfigurasi global** (api base URL, locale, tema) yang dipakai di seluruh aplikasi.

```vue
<!-- App.vue -->
<script>
export default {
  data() {
    return {
      config: {
        apiBaseUrl: 'https://api.themoviedb.org/3',
        locale: 'id-ID',
        tema: { warna: 'dark' },
      },
      user: { nama: 'Budi', isPremium: true }
    }
  },
  provide() {
    return {
      config: this.config,       // object → reactive by reference
      userLogin: this.user,      // object → reactive by reference
      logout: this.logout,       // method bisa di-provide juga!
    }
  },
  methods: {
    logout() {
      this.user.isPremium = false
      console.log('User logout')
    }
  }
}
</script>
```

```vue
<!-- MovieCard.vue (anak cucu) -->
<template>
  <article :class="userLogin.isPremium ? 'premium' : 'biasa'">
    <h3>{{ film.title }}</h3>
    <small>Locale: {{ config.locale }}</small>
    <button v-if="userLogin.isPremium" @click="logout">Logout</button>
  </article>
</template>

<script>
export default {
  props: { film: Object },
  inject: ['config', 'userLogin', 'logout'],
  mounted() {
    console.log('API:', this.config.apiBaseUrl)  // dari App!
  }
}
</script>
```

**Yang kamu pelajari:**
- Object (`config`, `userLogin`) di-provide sebagai referensi → child lihat perubahan properti.
- Method (`logout`) juga bisa di-provide → child bisa memicu aksi di ancestor.
- Tidak ada prop drilling untuk `apiBaseUrl`, `locale`, `isPremium`.

---

## 🔐 14. Provide/Inject dengan Function (Action Injection)

Selain data, kamu bisa **menyuntikkan function** lewat `provide`. Ini pola yang sangat berguna: ancestor menyediakan *action*, descendant memanggilnya tanpa tahu implementasinya.

```js
// ─────────────────────────────────────────────────────────────
// ANCESTOR: sediakan ACTION (function), bukan cuma data
// ─────────────────────────────────────────────────────────────
export default {
  data() { return { tema: { warna: 'dark' } } },
  provide() {
    return {
      tema: this.tema,
      // function di-provide → descendant bisa panggil
      gantiTema: (warnaBaru) => {
        this.tema.warna = warnaBaru   // this di sini = instance ancestor ✅
      },
      resetTema: () => {
        this.tema.warna = 'dark'
      }
    }
  }
}
```

```js
// ─────────────────────────────────────────────────────────────
// DESCENDANT: inject action & panggil
// ─────────────────────────────────────────────────────────────
export default {
  inject: ['tema', 'gantiTema', 'resetTema'],
  methods: {
    modeTerang() { this.gantiTema('light') },
    modeGelap()  { this.resetTema() },
  }
}
```

> 💡 **Mengapa inject function lebih aman daripada inject object lalu mutasi?**
> Karena child **tidak bisa** mengubah state ancestor secara sembarangan — ia hanya bisa memanggil *action* yang sudah didesain ancestor. Ini menerapkan prinsip *encapsulation* (mirip cara Pinia bekerja).

> ⚠️ **Perhatikan `this` di function yang di-provide!** Jika kamu menulis `gantiTema: function(w) { this.tema.warna = w }` sebagai method biasa di objek `provide()`, `this` merujuk ke objek `provide` itu sendiri, BUKAN instance Vue! Gunakan **arrow function** (seperti contoh) agar `this` menurun dari method `provide()` yang punya `this` = instance Vue. Ini kebalikan dari aturan method biasa — karena di sini function tersebut didefinisikan di dalam `provide()`, arrow function justru yang benar.

### ❌ vs ✅ — `this` di Provide Function

```js
// ❌ SALAH — function biasa, this = object provide()
provide() {
  return {
    ganti: function () { this.tema.warna = 'light' }  // this SALAH
  }
}

// ✅ BENAR — arrow function, this menurun dari provide()
provide() {
  return {
    ganti: () => { this.tema.warna = 'light' }  // this = instance Vue ✅
  }
}
```

---

## 🧪 15. Provide/Inject vs Props vs Pinia — Kapan Mana?

Tiga cara berbeda untuk berbagi data di Vue. Kapan pakai yang mana?

| Skenario | `props` | `provide/inject` | `Pinia` |
| --- | --- | --- | --- |
| Parent → child langsung (1 level) | ✅ Paling jelas | ⚠️ Overkill | ❌ Berlebihan |
| Data lewat banyak level | ❌ Prop drilling | ✅ Pas | ⚠️ Bisa, tapi global |
| Data global & stabil (tema, user) | ❌ Tidak cocok | ✅ Sangat pas | ✅ Juga bisa |
| State kompleks yang sering berubah | ❌ Tidak | ❌ Sulit debug | ✅ Paling pas |
| Butuh devtools / time-travel | ❌ | ❌ | ✅ Ya |
| Butuh dokumentasi alur data eksplisit | ✅ Jelas | ❌ Tersembunyi | ✅ Eksplisit |

```js
// ── PROPS: jelas & eksplisit, untuk 1-2 level ──
<Navbar :user="user" />

// ── PROVIDE/INJECT: untuk "teleportasi" data global ──
provide('tema', temaRef)

// ── PINIA: untuk state aplikasi sungguhan ──
// stores/cart.js
import { defineStore } from 'pinia'
export const useCartStore = defineStore('cart', {
  state: () => ({ items: [] }),
  actions: { tambah(p) { this.items.push(p) } }
})
```

> 🎯 **Decision rule of thumb:**
> 1. Cuma 1-2 level? → `props`.
> 2. Lewat banyak level & data stabil? → `provide/inject`.
> 3. State kompleks, berubah terus, butuh tracking? → `Pinia`.

---

## 🛠️ 16. Contoh Multi-Provider Lengkap

Satu aplikasi bisa punya **banyak provider sekaligus** di level berbeda. Yang terdekat menang bila ada key kembar.

```vue
<!-- App.vue (provider paling atas) -->
<script>
export default {
  data() {
    return {
      tema: { warna: 'dark' },
      user: { nama: 'Budi' },
    }
  },
  provide() {
    return {
      tema: this.tema,
      userLogin: this.user,
    }
  }
}
</script>

<!-- Section.vue (provider menengah, override 'tema') -->
<script>
export default {
  data() { return { temaLokal: { warna: 'light' } } },
  provide() {
    // ⚠️ override: descendant di bawah ini dapat 'light'
    return { tema: this.temaLokal }
  }
}
</script>

<!-- DeepChild.vue (dapat temaLokal dari Section, userLogin dari App) -->
<script>
export default {
  inject: ['tema', 'userLogin'],
  mounted() {
    console.log(this.tema.warna)      // 'light'  (dari Section, terdekat)
    console.log(this.userLogin.nama)  // 'Budi'   (dari App, satu-satunya)
  }
}
</script>
```

```
App (provide: tema=dark, userLogin)
 └─ Section (provide: tema=light)   ← override tema
     └─ DeepChild
         tema      → 'light'  (Section menang, lebih dekat)
         userLogin → 'Budi'   (App)
```

> 💡 **Tips:** Override seperti ini berguna untuk *theming* per-section (misal satu bagian paksa light mode). Tapi hati-hati — terlalu banyak override membuat alur data sulit ditebak.

---

## 📊 17. Tabel Perbandingan Reactivity & Pola

Ringkasan lengkap perilaku reactivity `provide`/`inject` berdasarkan cara penulisan:

| Cara `provide` | Cara `inject` | Reactive? | Catatan |
| --- | --- | --- | --- |
| `provide({ x: this.x })` (primitif) | `inject: ['x']` | ❌ Tidak | salinan nilai saat provide |
| `provide({ o: this.o })` (object) | `inject: ['o']` | ✅ Properti | mutasi shared, hati-hati |
| Composition: `provide('x', ref)` | `inject('x')` (script setup) | ✅ Ya | paling bersih |
| Composition: `provide('x', ref)` | `inject: ['x']` (Options) | ✅ Ya (unwrapped) | Options auto-unwrap ref |
| `provide({ fn })` (arrow fn) | `inject: ['fn']` | ✅ Aksi | panggil action, bukan mutasi |
| `provide({ fn: function(){} })` | `inject: ['fn']` | ❌ `this` salah | jangan pakai function biasa! |

| Pola | Rekomendasi |
| --- | --- |
| Tema global | ✅ `provide` object tema (atau ref di Composition) |
| User login | ✅ `provide` object user + action logout |
| API config | ✅ `provide` object config + default |
| Cart / keranjang | ❌ Pakai Pinia |
| Komunikasi sibling | ❌ Pakai parent atau Pinia |

> 🎯 **Takeaway:** `provide/inject` adalah *jadwal* untuk data global yang stabil. Untuk "_status harian" aplikasi (cart, auth session yang berubah-ubah, notifikasi), serahkan ke Pinia.

---

## 🧰 18. Pola `provide`/`inject` untuk Plugin & Library

Inilah kenapa `provide`/`inject` ada sejak awal: **library/framework internal** menggunakannya untuk memberi akses ke instance tanpa prop drilling. Vue Router dan Pinia di balik layar memanfaatkan pola serupa.

```js
// ─────────────────────────────────────────────────────────────
// CONTOH: plugin "Toast" yang menyediakan fungsi global
// ─────────────────────────────────────────────────────────────
// file: plugins/toast.js
import { reactive } from 'vue'

export default {
  install(app) {
    // buat state global
    const toast = reactive({ pesan: '', tipe: 'info', visible: false })

    // sediakan LEWAT app-level provide (bisa di semua komponen)
    app.provide('toast', {
      state: toast,
      show(pesan, tipe = 'info') {
        toast.pesan = pesan
        toast.tipe = tipe
        toast.visible = true
        setTimeout(() => (toast.visible = false), 3000)
      }
    })
  }
}
```

```vue
<!-- Komponen mana pun bisa inject tanpa prop -->
<script>
export default {
  inject: ['toast'],
  methods: {
    simpan() {
      // panggil action global
      this.toast.show('Berhasil disimpan!', 'success')
    }
  }
}
</script>

<template>
  <button @click="simpan">Simpan</button>
  <div v-if="toast.state.visible" :class="'toast-' + toast.state.tipe">
    {{ toast.state.pesan }}
  </div>
</template>
```

> 💡 **Pola ini persis** yang dipakai Vue Router (`inject('router')`, `inject('route')` di balik layar) dan Pinia (`inject(storeKey)`). Jadi `provide`/`inject` bukan fitur "pinggiran" — ia adalah **fondasi ekosistem Vue**.

### Tabel: provide di Level app vs komponen

| Level | Cara | Jangkauan |
| --- | --- | --- |
| App (plugin) | `app.provide(key, val)` | Seluruh komponen |
| Komponen ancestor | `provide() { return {...} }` | Descendant-nya saja |
| Composition | `provide(key, val)` di `setup` | Descendant-nya saja |

---

## 📱 19. Studi Kasus Mini: Toggle Locale (Bahasa)

Mari buat fitur ganti bahasa (id ↔ en) yang langsung memengaruhi semua komponen via `provide`/`inject` — tanpa Pinia.

```vue
<!-- App.vue -->
<template>
  <div>
    <button @click="gantiBahasa('id')">🇮🇩 Indonesia</button>
    <button @click="gantiBahasa('en')">🇬🇧 English</button>
    <Header />
  </div>
</template>

<script>
export default {
  data() {
    return {
      // object reactive → child lihat perubahan
      i18n: {
        bahasa: 'id',
        teks: {
          id: { sapaan: 'Halo', menu: 'Menu' },
          en: { sapaan: 'Hello', menu: 'Menu' },
        }
      }
    }
  },
  provide() {
    return {
      i18n: this.i18n,
      gantiBahasa: this.gantiBahasa,
    }
  },
  methods: {
    gantiBahasa(kode) {
      this.i18n.bahasa = kode   // ✅ semua child update
    }
  }
}
</script>
```

```vue
<!-- Header.vue (anak, tidak ada prop) -->
<template>
  <nav>
    <span>{{ i18n.teks[i18n.bahasa].sapaan }}</span>
    <span>{{ i18n.teks[i18n.bahasa].menu }}</span>
  </nav>
</template>

<script>
export default {
  inject: ['i18n'],
  mounted() {
    console.log('Bahasa aktif:', this.i18n.bahasa)  // 'id'
  }
}
</script>
```

**Yang kamu pelajari:**
- `i18n` di-provide sebagai object → child merender ulang saat `bahasa` berubah.
- `gantiBahasa` di-provide sebagai action → child bisa mengubah bahasa tanpa mutasi langsung.
- Tidak ada SATU PUN prop diteruskan dari `App` ke `Header`.

> 🎯 **Catatan produksi:** Untuk i18n sungguhan, gunakan library `vue-i18n` yang lebih lengkap. Contoh di atas murni demonstrasi mekanisme `provide`/`inject`.

---

## 🎨 20. Pola Lanjutan: Theming dengan CSS Variables

Salah satu penggunaan `provide`/`inject` paling elegan adalah menggabungkannya dengan **CSS variables** untuk theming yang mulus.

```vue
<!-- App.vue -->
<template>
  <div class="tema-root" :style="cssVars">
    <button @click="gantiTema">Ganti Tema</button>
    <Layout />
  </div>
</template>

<script>
export default {
  data() {
    return {
      // object tema → reactive by reference
      tema: {
        warnaLatar: '#141414',
        warnaTeks:  '#ffffff',
        aksen:      '#e50914',   // merah khas Netflix
      }
    }
  },
  provide() {
    return { tema: this.tema }
  },
  computed: {
    // Ubah object tema jadi CSS custom properties
    cssVars() {
      return {
        '--latar': this.tema.warnaLatar,
        '--teks':  this.tema.warnaTeks,
        '--aksen': this.tema.aksen,
      }
    }
  },
  methods: {
    gantiTema() {
      this.tema.warnaLatar = this.tema.warnaLatar === '#141414'
        ? '#f5f5f5' : '#141414'
      this.tema.warnaTeks  = this.tema.warnaTeks === '#ffffff'
        ? '#000000' : '#ffffff'
    }
  }
}
</script>

<style>
/* Semua komponen bisa pakai var(--latar) tanpa inject apa pun! */
.tema-root {
  background: var(--latar);
  color: var(--teks);
}
</style>
```

```vue
<!-- TombolAksen.vue — tidak inject apa pun, cukup pakai CSS var -->
<template>
  <button class="btn-aksen">Mulai</button>
</template>

<style>
.btn-aksen {
  background: var(--aksen);   /* otomatis ikut tema! */
  color: #fff;
}
</style>
```

> 💡 **Keuntungan pola ini:** Komponen anak yang **murni presentasional** tidak perlu `inject` sama sekali — cukup pakai `var(--...)`. `provide`/`inject` tetap dipakai oleh komponen yang butuh nilai tema secara *programatik* (misal untuk logika conditional), sementara CSS variable menangani styling otomatis. Kombinasi keduanya sangat kuat.

---

## 🔭 21. Urutan Injeksi & Override Bertingkat (Deep Dive)

Bagaimana Vue memutuskan nilai mana yang di-inject bila banyak provider? Berikut aturan presisi:

```
Algoritma injeksi Vue:
  1. Mulai dari komponen saat ini.
  2. Cek apakah komponen ini provide key tersebut?
       → TIDAK: naik ke parent.
  3. Ulangi sampai ketemu provider pertama (terdekat ke bawah).
  4. Jika sampai root tidak ketemu → pakai default (atau undefined).
```

### Contoh: 3 level override

```vue
<!-- Root.vue -->
<script>
export default {
  provide() { return { level: 'ROOT' } }
}
</script>

<!-- Middle.vue -->
<script>
export default {
  provide() { return { level: 'MIDDLE' } }
}
</script>

<!-- Leaf.vue -->
<script>
export default {
  inject: ['level'],
  mounted() { console.log(this.level) }  // 'MIDDLE' (terdekat)
}
</script>
```

### Tabel Resolusi

| Posisi Provider | Hasil inject di Leaf |
| --- | --- |
| Hanya Root | `'ROOT'` |
| Root + Middle | `'MIDDLE'` (menang) |
| Root + Middle + Leaf sendiri | Error: Leaf tidak bisa inject dirinya |
| Tidak ada | `undefined` (atau default) |

> ⚠️ **Injeksi tidak "menggabungkan"** provider. Berbeda dengan `mixins` yang menggabung, `provide`/`inject` pakai prinsip **"yang terdekat menang"**. Jadi kalau kamu provide `tema` di dua tempat, yang bawah menimpa yang atas sepenuhnya — bukan me-merge.

---

## 🔄 22. Provide Reactive dengan `reactive()` Object (Bonus)

Selain `ref`, kamu bisa `provide` sebuah `reactive()` object di Composition API. Bedanya dengan `ref`: kamu tidak perlu `.value` saat assign utuh, dan strukturnya lebih nyaman untuk banyak field.

```vue
<!-- App.vue -->
<script setup>
import { reactive, provide } from 'vue'

// reactive object → semua property reaktif
const tema = reactive({
  warna: 'dark',
  teks: '#fff',
  aksen: '#e50914',
})

provide('tema', tema)   // provide REFERENSI reactive

function gantiKeLight() {
  tema.warna = 'light'
  tema.teks  = '#000'
}
</script>
```

```vue
<!-- Child.vue -->
<script setup>
import { inject } from 'vue'

const tema = inject('tema')   // langsung object reactive
console.log(tema.warna)       // 'dark'
// ubah dari child? BISA, tapi hati-hati mutasi!
// tema.warna = 'light'  ← ⚠️ ini mutasi shared (lihat Jebakan 2)
</script>
```

| `provide(ref)` | `provide(reactive)` |
| --- | --- |
| Akses `.value` di script | Akses `.prop` langsung |
| Cocok untuk 1 nilai | Cocok untuk banyak field terkait |
| Reassign utuh mudah | Reassign utuh **tidak** disarankan |
| Di child: `tema.value` | Di child: `tema.warna` |

> 📌 **Rekomendasi praktis:** Untuk tema/user/config (banyak field), pakai `reactive()`. Untuk satu nilai tunggal (misal `count`), pakai `ref`.

---

## 🧩 23. Provide/Inject & Komunikasi Child → Ancestor

`provide`/`inject` mengalir **satu arah** (ancestor → descendant). Tapi bagaimana kalau child ingin "memanggil" ancestor? Jawabannya: **inject sebuah function** (sudah dibahas di bagian 14). Berikut variasi pola "event bus lokal":

```vue
<!-- App.vue — provide sebuah "emitter" -->
<script>
export default {
  data() { return { log: [] } },
  provide() {
    return {
      // child memanggil ini untuk kirim pesan ke ancestor
      kirimLog: (pesan) => {
        this.log.push(pesan)
        console.log('[LOG]', pesan)
      }
    }
  }
}
</script>
```

```vue
<!-- DeepChild.vue -->
<script>
export default {
  inject: ['kirimLog'],
  mounted() {
    this.kirimLog('Komponen dalam telah dimuat')  // sampai ke App ✅
  }
}
</script>
```

> 💡 **Pola ini aman** karena child hanya memanggil function yang disediakan, tidak mengubah state ancestor langsung. Ini ibarat "kotak surat": child bisa kirim surat (function call), tapi tidak bisa masuk ke rumah ancestor dan pindah-pindahin furnitur (mutasi state).

> ⚠️ **Bukan pengganti emits:** Kalau child punya **parent langsung** yang perlu tahu event, gunakan `emit` biasa. `provide`/`inject` untuk function hanya pas bila ancestor yang dituju **jauh** (bukan parent langsung).

---

## 🚨 24. Jebakan Umum Pemula di Bab 11

### ❌ Jebakan 1 — Provide nilai primitif (tidak reactive)

```js
// ❌ SALAH — salinan string, child tidak update
export default {
  data() { return { tema: 'dark' } },
  provide() { return { tema: this.tema } },
  methods: { ganti() { this.tema = 'light' } }  // child tetap 'dark'
}

// ✅ BENAR — bungkus dalam object
export default {
  data() { return { tema: { warna: 'dark' } } },
  provide() { return { tema: this.tema } },
  methods: { ganti() { this.tema.warna = 'light' } }  // ✅ child update
}
```

---

### ❌ Jebakan 2 — Mutasi object provider dari child

```js
// ❌ SALAH — child mengubah state ancestor secara diam-diam
export default {
  inject: ['tema'],
  mounted() {
    this.tema.warna = 'light'   // ❌ mutasi shared object! side-effect global
  }
}

// ✅ BENAR — panggil method provider, atau gunakan Pinia
export default {
  inject: ['tema', 'gantiTema'],
  mounted() {
    this.gantiTema('light')   // ✅ lewat method eksplisit
  }
}
```

---

### ❌ Jebakan 3 — Inject key yang tidak disediakan

```js
// ❌ SALAH — undefined, bisa crash
export default {
  inject: ['userLogin'],
  mounted() {
    console.log(this.userLogin.nama)   // ❌ Cannot read 'nama' of undefined
  }
}

// ✅ BENAR — beri default
export default {
  inject: {
    userLogin: { default: () => ({ nama: 'Guest' }) }
  }
}
```

---

### ❌ Jebakan 4 — Menyalahgunakan untuk state kompleks

```js
// ❌ KURANG TEPAT — cart yang sering berubah & butuh tracking
export default {
  provide() { return { cart: this.cart } }   // sulit debug, tidak ada devtools
}

// ✅ LEBIH BAIK — pakai Pinia (state management)
// stores/cart.js → const cart = useCartStore()
```

---

### ❌ Jebakan 5 — Lupa dokumentasikan sumber inject

```js
// ❌ MEMBINGUNGKAN — dari mana 'temaWarna'?
export default {
  inject: ['temaWarna'],
  // pembaca harus cari ke atas tree
}

// ✅ JELAS — dokumentasikan
export default {
  // Diambil dari App.vue (provide temaWarna sebagai object tema)
  inject: ['temaWarna'],
}
```

---

### ❌ Jebakan 6 — Provide di dalam method / kondisi (bukan di `provide()`)

```js
// ❌ SALAH — provide() HARUS di level opsi, bukan di method
export default {
  methods: {
    siapkan() {
      // ini TIDAK akan dideteksi Vue sebagai provider!
      this.$options.provide = () => ({ x: 1 })
    }
  }
}

// ✅ BENAR — selalu di opsi provide()
export default {
  provide() { return { x: 1 } }
}
```

> 📌 **Ingat:** `provide()` adalah **opsi komponen**, bukan method yang bisa dipanggil kapan saja. Vue membacanya sekali saat inisialisasi komponen.

---

### ❌ Jebakan 7 — Mengharapkan `computed` otomatis membuat provide reactive

```js
// ❌ SALAH — computed dievaluasi sekali saat provide() dipanggil
export default {
  data() { return { tema: 'dark' } },
  computed: { payload() { return { t: this.tema } } },
  provide() { return { tema: this.payload } },  // disalin saat init
  methods: { ganti() { this.tema = 'light' } }  // child TIDAK update
}

// ✅ BENAR — provide referensi object/reactive/ref
export default {
  data() { return { tema: { warna: 'dark' } } },
  provide() { return { tema: this.tema } },
  methods: { ganti() { this.tema.warna = 'light' } }  // ✅ child update
}
```

---

## 📝 25. Ringkasan Bab 11

| Konsep | Penjelasan |
| --- | --- |
| **Prop drilling** | Meneruskan prop lewat banyak level yang tak membutuhkannya |
| **`provide()`** | Ancestor menyediakan data `{ key: value }` |
| **`inject: [...]`** | Descendant menyuntik langsung, berapa pun jauhnya |
| **Reactivity** | Primitif tidak reactive; object/ref reactive by reference |
| **Default** | `inject: { key: { default } }` agar aman kalau tak disediakan |
| **Aliasing** | `inject: { namaLokal: 'keyAsli' }` |
| **Symbol key** | Hindari tabrakan nama di library besar |
| **Caveat** | Hidden coupling; dokumentasikan sumber inject |
| **Action injection** | Provide function agar child panggil, bukan mutasi |
| **Override** | Provider terdekat menang (tidak merge) |
| **Mixins** | Cara lama reuse logika; rawan collision & sulit dilacak |
| **Composables** | Pengganti modern; eksplisit & bersih |
| **Kapan pakai** | Tema, user login, config global — bukan state kompleks (pakai Pinia) |

---

## 🎯 26. Latihan Mandiri

**⭐ Latihan 1 — Tema Sederhana**
Buat `App.vue` yang `provide` object `tema` (berisi `warna: 'dark'`) dan method `gantiTema`. Buat komponen `KotakStatus.vue` yang `inject` `tema` dan `gantiTema`, menampilkan warna saat ini dan tombol untuk menggantinya. Pastikan perubahan terlihat di `KotakStatus` tanpa prop drilling.

**⭐⭐ Latihan 2 — User Login Global**
Di `App.vue`, `provide` object `userLogin` (berisi `nama` & `isPremium`) dan method `logout`. Buat `Navbar.vue` yang `inject` keduanya, menampilkan nama user, badge "PREMIUM" jika `isPremium`, dan tombol logout yang memanggil method provider.

**⭐⭐⭐ Latihan 3 — Config API Global + Default**
Buat `provide` object `config` (`apiBaseUrl`, `locale`) di root. Di komponen `MovieCard.vue`, `inject` `config` DENGAN `default` (`{ apiBaseUrl: 'https://fallback', locale: 'en' }`). Tampilkan `locale` di kartu. Uji dengan meletakkan `MovieCard` di dalam dan di luar provider.

**⭐⭐⭐⭐ Latihan 4 — Mixin vs Composable (Tantangan)**
Buat `mixins/useCounterMixin.js` (Options API) yang menyediakan `data: { count: 0 }` dan `methods: { inc, dec }`. Gunakan di dua komponen berbeda. Lalu buat padanannya `composables/useCounter.js` (Composition API). Bandingkan pengalaman: bagaimana namamu variabel di composable vs bagaimana mixin "menyuntikkan" `count` ke `this`. Jelaskan di komentar mengapa composable lebih aman dari name collision.

**⭐⭐⭐⭐ Latihan 5 — Theming CSS Variable (Eksplorasi)**
Gabungkan pola dari bagian 20: buat `App.vue` yang `provide` object `tema` berisi warna, dan ekspos `cssVars` (computed) sebagai CSS custom properties di root. Komponen `TombolAksen.vue` dan `KartuInfo.vue` **tidak** melakukan inject apa pun, tapi menggunakan `var(--latar)` / `var(--aksen)` di `<style>`. Buktikan bahwa mengganti tema di App langsung mengubah tampilan kedua komponen.

---

*Lanjut ke ➡️ **Bab 12 — 🔄 Migrasi Mindset Options ke Composition***
