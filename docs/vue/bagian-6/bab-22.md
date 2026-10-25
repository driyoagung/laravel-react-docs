# 🌀 Bab 22 — Komponen Lanjutan & Teknik Khusus

> *"Seorang tukang kayu yang hanya tahu memaku sudah cukup untuk membuat kotak. Tapi untuk membangun istana, ia harus menguasai teknik-teknik khusus: sambungan, kelistrikan, plumbing. Begitu pula dengan Vue — setelah menguasai dasar, teknik khususlah yang membedakan aplikasi 'jalan-jalan' dengan aplikasi kelas dunia."*
>

---

> **🧠 Apa Itu Komponen Lanjutan?**
>
>
> Setelah kamu menguasai props, emits, slots, reaktivitas, dan lifecycle dasar, ada sekelompok fitur Vue 3 yang disebut **komponen lanjutan** (*advanced components*). Tiga bintang utamanya adalah:
>
> 1. **`<Teleport>`** — memindahkan lokasi render komponen ke tempat lain di DOM (tanpa memutus hubungan reaktifnya).
> 2. **`<KeepAlive>`** — menyimpan (mencache) komponen agar state-nya tidak hilang saat berpindah halaman.
> 3. **`<Transition>` & `<TransitionGroup>`** — memberi animasi halus saat elemen muncul, hilang, atau berpindah posisi.
>
> Ketiganya bukan fitur "hiasan". Mereka menyelesaikan masalah nyata yang akan kamu temui saat membangun aplikasi seperti Netflix: modal yang terpotong, hasil pencarian yang hilang, dan daftar yang berpindah secara kaku.
>

---

> **🏗️ Analogi Sederhana:**
>
>
> Bayangkan kamu tinggal di sebuah apartemen (aplikasi Vue). `Teleport` ibarat kamu yang ingin berteriak ke seluruh penghuni gedung — alih-alih berteriak dari dalam kamar sempit (yang suaranya tersumbat dinding), kamu naik ke atap gedung (`<body>`) agar suaramu terdengar ke seluruh penjuru tanpa halangan.
>
> `KeepAlive` ibarat kamu yang meninggalkan meja kerja sebentar — bukannya membereskan dan merusak semua rancangan di atasnya (Vue menghancurkan komponen), kamu cukup menutupnya dengan plastik pelindung. Saat kembali, meja dalam keadaan persis seperti saat ditinggalkan.
>
> `Transition` ibarat pintu otomatis yang terbuka perlahan saat kamu mendekat, bukan membanting terbuka. Halus, elegan, dan terasa "mahal".
>

---

## 📋 Daftar Isi Bab 22

1. Mengapa Komponen Lanjutan Penting
2. Teleport — Modal yang Benar-Benar Berfungsi
3. Masalah Klasik: z-index, overflow, dan transform
4. Sintaks Dasar `<Teleport>` & Penjelasan Baris demi Baris
5. Teleport ke Target Khusus (`:to` dengan ID)
6. Banyak Teleport ke Satu Target (Multiple Teleports)
7. Menonaktifkan Teleport (`:disabled`)
8. KeepAlive — Menyimpan State Komponen
9. Cara Kerja & Sintaks `<KeepAlive>`
10. `:include`, `:exclude`, dan `:max` — Mengontrol Cache
11. Lifecycle Khusus: `onActivated` & `onDeactivated`
12. `<Transition>` — Animasi Satu Elemen
13. Class Transisi Enter & Leave (Dijelaskan per Baris)
14. Durasi Kustom & `transitionend`
15. JavaScript Hooks pada Transition
16. `<TransitionGroup>` — Animasi Daftar
17. Class `move` & `leave` untuk List yang Bergerak
18. Contoh: Daftar Film yang Difilter Live
19. Menggabungkan Semua: Teleport + Transition + TransitionGroup
20. Studi Kasus — Modal Netflix & Grid Film Teranimasi
21. Jebakan Umum Pemula di Bab 22
22. Ringkasan & Latihan Mandiri

---

## 🚀 Mengapa Komponen Lanjutan Penting

Di bab-bab sebelumnya, kamu sudah membangun UI modular dengan komponen. Tapi ada tiga skenario yang sering membuat developer pemula terjebak:

| Skenario Nyata | Masalah | Solusi Vue |
| --- | --- | --- |
| Modal dialog muncul **terpotong** oleh `overflow: hidden` parent | CSS parent membatasi tampilan | `<Teleport>` |
| Hasil pencarian **hilang** saat pindah halaman | Vue menghancurkan komponen | `<KeepAlive>` |
| Daftar film **muncul tiba-tiba** tanpa animasi | Tidak ada transisi | `<Transition>` / `<TransitionGroup>` |

> 💡 **Catatan Penting:**
> Ketiga fitur ini adalah fitur **bawaan (built-in)** Vue 3. Kamu tidak perlu menginstal library tambahan. Mereka diekspor langsung dari paket `vue`. Cukup gunakan tag `<Teleport>`, `<KeepAlive>`, `<Transition>`, dan `<TransitionGroup>` di template.

Semua fitur dalam bab ini bekerja di dalam `<script setup>` Composition API maupun Options API. Contoh kita akan menggunakan `<script setup>` karena itulah standar modern buku ini.

---

## 🌀 Teleport — Modal yang Benar-Benar Berfungsi

`Teleport` adalah fitur paling sering disalahpahami tapi paling berguna untuk modal, tooltip, notifikasi, dan dropdown yang harus "lepas" dari parent-nya.

### 🔥 Masalah Klasik: z-index, overflow, dan transform

Bayangkan struktur DOM seperti ini:

```vue
<!-- App.vue -->
<template>
  <main style="overflow: hidden; position: relative; z-index: 1">
    <!-- Parent punya aturan yang "berbahaya" untuk modal -->
    <section style="transform: translateZ(0)">
      <!-- transform di sini MEMBATALKAN position: fixed anak! -->
      <MovieCard @klik="bukaModal" />

      <!-- Modal ditaruh langsung di sini -->
      <MovieModal v-if="modalTerbuka" />
    </section>
  </main>
</template>
```

Apa yang terjadi?

```
❌ MASALAH 1: overflow: hidden
   Parent memotong modal yang ukurannya lebih besar dari parent.
   Modal terlihat "kepotong" di pinggir layar.

❌ MASALAH 2: z-index rendah
   Modal tertimpa elemen lain yang punya z-index lebih tinggi.
   Modal muncul "di belakang" konten lain.

❌ MASALAH 3: transform / filter di parent
   Secara CSS spec, elemen dengan transform membuat anaknya
   menjadikan transform itu sebagai "containing block" baru.
   Akibatnya position: fixed modal tidak lagi relatif ke viewport,
   tapi relatif ke parent tersebut → posisi modal melenceng!
```

> ⚠️ **Catatan Penting:**
> Aturan CSS kuno namun sering dilupakan: **elemen dengan `transform`, `filter`, atau `perspective` akan menjadi *containing block* baru untuk descendant `position: fixed`**. Jadi modal yang seharusnya "penuh layar" malah terjebak di dalam parent yang di-transform. Inilah alasan utama modal butuh `Teleport`.

### 🛠️ Sintaks Dasar `<Teleport>` & Penjelasan Baris demi Baris

Solusinya: pindahkan modal ke `<body>` (atau elemen level atas lain) menggunakan `<Teleport>`.

```vue
<!-- MovieModal.vue -->
<template>
  <!--
    🔹 Teleport: render komponen ini di LUAR hierarki DOM normal.
    🔹 Ditempatkan langsung di <body>, bukan di dalam parent component.
    🔹 Ini menghindari masalah z-index dan overflow:hidden dari parent.
  -->
  <Teleport to="body">
    <!-- 🔹 Transition membungkus agar modal fade in/out (lihat bagian bawah) -->
    <Transition name="modal-fade">
      <!-- 🔹 v-if mengontrol kapan modal muncul -->
      <div
        v-if="isOpen"
        class="modal-overlay"
        @click.self="$emit('tutup')"
      >
        <!-- 🔹 Kotak konten modal -->
        <div class="modal-content">
          <!-- 🔹 Tombol tutup -->
          <button class="modal-close" @click="$emit('tutup')">✕</button>

          <!-- 🔹 Slot: parent menyuntikkan konten (judul, poster, sinopsis) -->
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
// 🔹 defineProps: menerima apakah modal terbuka
defineProps({
  isOpen: {
    type:    Boolean,
    default: false,
  },
})

// 🔹 defineEmits: deklarasikan event 'tutup'
const emit = defineEmits(['tutup'])
</script>

<style scoped>
/* Overlay gelap menutupi seluruh viewport */
.modal-overlay {
  position: fixed;          /* 🔹 Relatif ke viewport (aman karena di body) */
  inset: 0;                 /* 🔹 Top/right/bottom/left = 0 → penuh layar */
  background: rgba(0, 0, 0, 0.75); /* 🔹 Latar belakang gelap transparan */
  display: flex;            /* 🔹 Flexbox untuk memusatkan konten */
  align-items: center;      /* 🔹 Pusat vertikal */
  justify-content: center;  /* 🔹 Pusat horizontal */
  z-index: 9999;            /* 🔹 Di atas segalanya (aman di body) */
}

.modal-content {
  background: #181818;      /* 🔹 Warna gelap ala Netflix */
  color: white;
  border-radius: 8px;
  padding: 24px;
  max-width: 600px;
  width: 90%;
}
</style>
```

Penjelasan baris demi baris:

- `<Teleport to="body">` → Vue memindahkan **seluruh isi** Teleport ke elemen `<body>`. Hubungan reaktif (props, emits, state) tetap terikat ke parent asli (`MovieModal`). Hanya *lokasi fisik di DOM* yang pindah.
- `<Transition name="modal-fade">` → memberi efek transisi saat modal muncul/hilang (dijelaskan di bagian Transition).
- `v-if="isOpen"` → modal hanya dirender saat `isOpen === true`. Karena sudah di `<body>`, ia bebas dari `overflow` parent.
- `@click.self="$emit('tutup')"` → **trik penting**: `.self` berarti event hanya dipicu bila yang diklik adalah overlay-nya **sendiri**, bukan konten di dalamnya. Jadi mengklik area konten tidak menutup modal.
- `<slot />` → memungkinkan parent menyuntikkan konten (judul, poster, sinopsis, trailer).

> 💡 **Tips:**
> Gunakan `.self` pada overlay agar pengguna tidak menutup modal secara tidak sengaja saat mengklik area konten. Ini pengalaman UX yang jauh lebih baik daripada menutup modal begitu saja.

### 🎯 Teleport ke Target Khusus (`:to` dengan ID)

Kamu tidak terpaham harus ke `<body>`. Kamu bisa menargetkan elemen apa pun dengan selektor CSS:

```vue
<!-- App.vue — siapkan target khusus -->
<template>
  <div id="app">
    <!-- Konten utama aplikasi -->
  </div>

  <!-- 🔹 Target khusus untuk modal, ditaruh di luar #app -->
  <div id="modal-root"></div>
</template>
```

```vue
<!-- MovieModal.vue — teleport ke #modal-root -->
<template>
  <Teleport to="#modal-root">
    <!-- Seluruh konten modal dirender ke dalam <div id="modal-root"> -->
    <div v-if="isOpen" class="modal-overlay">
      <slot />
    </div>
  </Teleport>
</template>
```

Keuntungan menargetkan ID khusus:

| Keuntungan | Penjelasan |
| --- | --- |
| **Lebih terkontrol** | Kamu tahu pasti di mana modal muncul di DOM |
| **Bisa lebih dari satu target** | `#modal-root`, `#toast-root`, `#tooltip-root` masing-masing untuk keperluan berbeda |
| **Hindari konflik** | Tidak semua hal harus ke `<body>`; tooltip bisa ke target khusus |

> ⚠️ **Catatan Penting:**
> Elemen target (misal `<div id="modal-root">`) **harus sudah ada di DOM** saat `<Teleport>` dirender. Jika target belum ada, Vue akan mengeluarkan peringatan dan Teleport tidak bekerja.

### 🔗 Banyak Teleport ke Satu Target (Multiple Teleports)

Vue mengizinkan **lebih dari satu** `<Teleport>` menargetkan elemen yang sama. Konten akan **digabung** secara berurutan:

```vue
<!-- Komponen A -->
<template>
  <Teleport to="#modal-root">
    <div class="notif">Notifikasi dari Komponen A</div>
  </Teleport>
</template>

<!-- Komponen B -->
<template>
  <Teleport to="#modal-root">
    <div class="notif">Notifikasi dari Komponen B</div>
  </Teleport>
</template>
```

Hasil di DOM:

```html
<div id="modal-root">
  <div class="notif">Notifikasi dari Komponen A</div>
  <div class="notif">Notifikasi dari Komponen B</div>
</div>
```

Urutan digabung mengikuti urutan komponen di-render. Ini sangat berguna untuk sistem notifikasi global di mana banyak komponen bisa "menyumbang" notifikasi ke satu wadah.

> 💡 **Tips:**
> Untuk sistem notifikasi (toast) yang kompleks, pertimbangkan kombinasi `Teleport` + `TransitionGroup` agar tiap notifikasi bisa muncul/hilang dengan animasi.

### 🔌 Menonaktifkan Teleport (`:disabled`)

Terkadang kamu ingin modal **tetap di dalam parent** (misal untuk keperluan testing atau layout tertentu). Gunakan `:disabled`:

```vue
<template>
  <!--
    🔹 Jika disabledModal = true, Teleport DIMATIKAN.
    🔹 Konten dirender DI TEMPAT aslinya (tetap di dalam parent).
    🔹 Jika disabledModal = false, konten dipindah ke <body>.
  -->
  <Teleport to="body" :disabled="disabledModal">
    <div v-if="isOpen" class="modal-overlay">
      <slot />
    </div>
  </Teleport>

  <button @click="disabledModal = !disabledModal">
    Toggle Teleport: {{ disabledModal ? 'OFF' : 'ON' }}
  </button>
</template>

<script setup>
import { ref } from 'vue'

const isOpen       = ref(true)
const disabledModal = ref(false)
</script>
```

Tabel ringkas perilaku `:disabled`:

| `:disabled` | Hasil |
| --- | --- |
| `true` | Konten tetap di parent (tidak dipindah) |
| `false` (default) | Konten dipindah ke target `:to` |
| Diubah saat runtime | Vue memindahkan/mengembalikan konten secara dinamis |

> 📌 **Catatan Penting:**
> `Teleport` **tidak** memutus hubungan reaktivitas. Props, emits, dan state komponen tetap terikat ke parent aslinya. Ia hanya memindahkan *tempat* elemen muncul di DOM. Reactive state di dalam modal tetap sinkron dengan parent.

### 🎬 Studi Kasus Singkat — Teleport

Kamu punya halaman detail film yang kartunya berada di dalam `<section style="overflow: hidden">`. Tanpa `Teleport`, modal detail akan **terpotong**. Dengan men-teleport modal ke `<body>`, modal muncul **penuh layar** dengan latar belakang gelap (`modal-overlay`) yang menutupi seluruh halaman — persis seperti Netflix.

```vue
<!-- Sebelum (BURUK): modal di dalam section overflow:hidden -->
<section style="overflow: hidden">
  <MovieCard />
  <MovieModal /> <!-- ❌ Terpotong! -->
</section>

<!-- Sesudah (BAIK): modal di-teleport ke body -->
<section style="overflow: hidden">
  <MovieCard />
  <Teleport to="body">
    <MovieModal /> <!-- ✅ Penuh layar, tidak terpotong -->
  </Teleport>
</section>
```

---

## 💾 KeepAlive — Menyimpan State Komponen

`KeepAlive` menjawab pertanyaan klasik: *"Kenapa hasil pencarianku hilang saat aku pindah halaman?"*

### 🤔 Masalah yang Diselesaikan

Secara default, Vue **menghancurkan (unmount)** komponen saat kamu meninggalkannya melalui `<RouterView>`. Artinya:

```
User mengetik "Avengers" di SearchView
        ↓
User klik hasil → pindah ke MovieDetailView
        ↓
Vue UNMOUNT SearchView → SEMUA state hilang (keyword, hasil, scroll)
        ↓
User kembali ke SearchView
        ↓
SearchView di-MOUNT ULANG dari nol → keyword kosong, hasil hilang 😭
```

`KeepAlive` menyimpan komponen di memori agar state-nya **tetap hidup**.

### 🛠️ Cara Kerja & Sintaks `<KeepAlive>`

`KeepAlive` membungkus komponen dinamis (`<component :is="...">`) atau `<RouterView>`. Komponen yang dibungkus tidak di-unmount saat berpindah, melainkan **di-cache** di memori.

```vue
<!-- App.vue atau layout utama -->
<template>
  <!-- 🔹 RouterView memberi komponen aktif lewat slot -->
  <RouterView v-slot="{ Component }">
    <!--
      🔹 KeepAlive: komponen yang di-cache tidak akan di-destroy
      🔹 saat disembunyikan — state-nya tetap ada saat ditampilkan lagi.
      🔹 Contoh: SearchView menyimpan hasil pencarian meski user
      🔹 navigasi ke halaman lain dan kembali.
    -->
    <KeepAlive :include="['SearchView', 'BrowseView']">
      <component :is="Component" />
    </KeepAlive>
  </RouterView>
</template>
```

Penjelasan:

- `<RouterView v-slot="{ Component }">` → Vue Router menyediakan komponen yang sedang aktif lewat slot (dinamakan `Component`).
- `<component :is="Component" />` → merender komponen dinamis tersebut.
- `:include="['SearchView', 'BrowseView']"` → **hanya** komponen dengan nama `SearchView` dan `BrowseView` yang di-cache. Komponen lain tetap di-destroy seperti biasa (hemat memori!).

> ⚠️ **Syarat `:include`/`exclude`:** Komponen **harus punya opsi `name`** yang cocok. Di `<script setup>`, nama diambil dari nama file (misal `SearchView.vue` → nama `SearchView`). Jika kamu menggunakan Options API, pastikan `name` di-set eksplisit.

### 🎛️ `:include`, `:exclude`, dan `:max` — Mengontrol Cache

| Properti | Tipe | Fungsi |
| --- | --- | --- |
| `:include` | String / RegExp / Array | Hanya cache komponen yang namanya cocok |
| `:exclude` | String / RegExp / Array | Jangan cache komponen yang namanya cocok |
| `:max` | Number | Batasi jumlah maksimum komponen yang di-cache |

Contoh kombinasi:

```vue
<template>
  <!-- Cache SearchView & BrowseView, tapi maksimal 10 komponen -->
  <KeepAlive :include="['SearchView', 'BrowseView']" :max="10">
    <component :is="Component" />
  </KeepAlive>

  <!-- Atau pakai RegExp: cache semua view kecuali HomeView -->
  <KeepAlive :exclude="['HomeView']">
    <component :is="Component" />
  </KeepAlive>
</template>
```

Perilaku `:max`:

```
:max="10" berarti:
  - Vue menyimpan hingga 10 komponen di cache.
  - Jika komponen ke-11 masuk, yang PALING LAMA tidak dipakai
    (LRU — Least Recently Used) akan dikeluarkan dari cache.
  - Ini mencegah memory leak saat user menjelajah banyak halaman.
```

> 💡 **Tips:**
> Selalu gunakan `:include` (atau `:max`) agar cache tidak membesar tanpa batas dan memakan memori browser pengguna. Men-cache **semua** halaman adalah pemborosan.

### 🔄 Lifecycle Khusus: `onActivated` & `onDeactivated`

Karena komponen tidak di-mount/unmount ulang, lifecycle hook biasa (`onMounted`/`onUnmounted`) tidak dipanggil setiap kali komponen tampil/sembunyi. Vue menyediakan hook khusus:

```vue
<!-- SearchView.vue -->
<script setup>
import { ref, onMounted, onActivated, onDeactivated } from 'vue'

const keyword = ref('')
const hasil   = ref([])

// 🔹 Dipanggil HANYA saat komponen pertama kali di-mount
onMounted(() => {
  console.log('SearchView di-mount pertama kali')
})

// 🔹 Dipanggil saat komponen DITAMPILKAN KEMBALI dari cache
onActivated(() => {
  console.log('SearchView aktif kembali — keyword masih:', keyword.value)
  // 🔹 Tempat ideal untuk me-refresh data (misal cek watchlist terbaru)
})

// 🔹 Dipanggil saat komponen DISIMPAN ke cache (disembunyikan)
onDeactivated(() => {
  console.log('SearchView disembunyikan — state tetap tersimpan')
  // 🔹 Jangan lakukan cleanup berat di sini (state mau dipertahankan!)
})
</script>
```

Tabel perbandingan hook:

| Hook | Kapan Dipanggil | Gunakan Untuk |
| --- | --- | --- |
| `onMounted` | Sekali, saat pertama kali dibuat | Inisialisasi awal, fetch data pertama |
| `onActivated` | Setiap kali tampil dari cache | Refresh data, resume timer/animasi |
| `onDeactivated` | Setiap kali disembunyikan ke cache | Pause timer, simpan posisi scroll |
| `onUnmounted` | Saat dikeluarkan dari cache | Cleanup final (jarang di KeepAlive) |

> ⚠️ **Catatan Penting:**
> Komponen yang di-cache **tidak** memanggil `onMounted` lagi saat ditampilkan kembali. Gunakan `onActivated` jika butuh logika "saat tampil". Jika kamu meletakkan fetch data di `onMounted`, data tidak akan diperbarui saat user kembali — kecuali kamu juga memanggilnya di `onActivated`.

### 🎬 Studi Kasus Singkat — KeepAlive

Pengguna mencari "Avengers" di `SearchView`, lalu klik salah satu hasil untuk membuka detail film. Setelah kembali ke `SearchView`, hasil "Avengers" **masih ada** berkat `KeepAlive`. Tanpa `KeepAlive`, pengguna harus mengetik ulang dari nol — sangat mengganggu.

```vue
<!-- Tanpa KeepAlive: state hilang -->
<RouterView /> <!-- ❌ SearchView di-destroy, keyword hilang -->

<!-- Dengan KeepAlive: state lestari -->
<RouterView v-slot="{ Component }">
  <KeepAlive :include="['SearchView']">
    <component :is="Component" />
  </KeepAlive>
</RouterView>
<!-- ✅ SearchView di-cache, keyword & hasil tetap ada -->
```

---

## 🎭 `<Transition>` — Animasi Satu Elemen

`<Transition>` memberi efek masuk/keluar pada **satu elemen atau komponen** (yang diontrol oleh `v-if`, `v-show`, atau pergantian komponen dinamis).

### 🧩 Cara Kerja Transition

Vue secara otomatis menambahkan class CSS pada saat-saat tertentu:

```
Elemen MUNCUL (v-if true / v-show true):
  ① Tambah .xxx-enter-from  → kondisi awal (misal opacity: 0)
  ② Tambah .xxx-enter-active → durasi & gaya transisi
  ③ Hapus .xxx-enter-from, tambah .xxx-enter-to → kondisi akhir
  ④ Setelah transisi selesai → hapus semua class

Elemen HILANG (v-if false / v-show false):
  ① Tambah .xxx-leave-from  → kondisi awal
  ② Tambah .xxx-leave-active → durasi & gaya transisi
  ③ Hapus .xxx-leave-from, tambah .xxx-leave-to → kondisi akhir
  ④ Setelah transisi selesai → hapus elemen dari DOM
```

### 🎨 Class Transisi Enter & Leave (Dijelaskan per Baris)

```vue
<!-- Contoh: modal fade -->
<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="modal-overlay">Halo!</div>
  </Transition>
</template>

<style>
/* 🔹 SAAT MASUK — gaya selama transisi berlangsung */
.modal-fade-enter-active {
  transition: opacity 0.3s ease; /* 🔹 Durasi 0.3 detik, halus */
}

/* 🔹 SAAT MASUK — kondisi AWAL sebelum animasi */
.modal-fade-enter-from {
  opacity: 0; /* 🔹 Mulai dari transparan */
}

/* 🔹 SAAT MASUK — kondisi AKHIR (biasanya default, bisa dihilangkan) */
.modal-fade-enter-to {
  opacity: 1; /* 🔹 Berakhir pada terlihat penuh */
}

/* 🔹 SAAT KELUAR — gaya selama transisi berlangsung */
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

/* 🔹 SAAT KELUAR — kondisi AWAL */
.modal-fade-leave-from {
  opacity: 1; /* 🔹 Mulai dari terlihat penuh */
}

/* 🔹 SAAT KELUAR — kondisi AKHIR */
.modal-fade-leave-to {
  opacity: 0; /* 🔹 Berakhir transparan lalu dihapus */
}
</style>
```

Penjelasan baris demi baris:

- `name="modal-fade"` → semua class diawali `modal-fade-`. Ganti namanya, ganti awalan class.
- `.modal-fade-enter-active` / `.leave-active` → menentukan **durasi & gaya** transisi (properti `transition`).
- `.modal-fade-enter-from` / `.leave-to` → **kondisi awal/akhir** (biasanya `opacity` atau `transform`).
- `.modal-fade-enter-to` / `.leave-from` → kondisi target (sering sama dengan default, boleh dihilangkan).

> 💡 **Tips:**
> Untuk efek yang mulus, kombinasikan `opacity` + `transform`. Contoh: `enter-from { opacity: 0; transform: translateY(-20px) }` memberi kesan "muncul dari atas sambil memudar".

### ⏱️ Durasi Kustom & `transitionend`

Terkadang elemen dalam (misal gambar) butuh waktu lebih lama dari transisi utama. Beri tahu Vue durasi eksplisit agar ia tahu kapan transisi "selesai":

```vue
<template>
  <Transition name="slow-fade" :duration="1000">
    <!-- :duration memberi tahu Vue transisi berlangsung 1000ms -->
    <div v-if="show" class="box">Konten lambat</div>
  </Transition>
</template>
```

Atau tentukan durasi berbeda untuk enter/leave:

```vue
<Transition :duration="{ enter: 500, leave: 800 }">
  <div v-if="show">...</div>
</Transition>
```

### 🪝 JavaScript Hooks pada Transition

Selain CSS, kamu bisa menjalankan fungsi JavaScript pada tiap tahap transisi (berguna untuk library animasi seperti GSAP):

```vue
<template>
  <Transition
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @enter-cancelled="onEnterCancelled"
    @before-leave="onBeforeLeave"
    @leave="onLeave"
    @after-leave="onAfterLeave"
    @leave-cancelled="onLeaveCancelled"
  >
    <div v-if="show">Konten</div>
  </Transition>
</template>

<script setup>
// 🔹 Dipanggil SEBELUM elemen dimasukkan ke DOM
function onBeforeEnter(el) {
  el.style.opacity = '0' // Siapkan kondisi awal via JS
}

// 🔹 Dipanggil saat elemen masuk — wajib panggil done() jika pakai CSS:false
function onEnter(el, done) {
  // Simulasi animasi JS
  requestAnimationFrame(() => {
    el.style.transition = 'opacity 0.5s'
    el.style.opacity = '1'
    setTimeout(done, 500) // Beri tahu Vue transisi selesai
  })
}

function onAfterEnter(el) {
  console.log('Transisi masuk selesai')
}

function onEnterCancelled() {
  console.log('Transisi masuk dibatalkan')
}

// 🔹 Hook leave mirip, tapi untuk saat elemen keluar
function onBeforeLeave(el) {
  el.style.opacity = '1'
}

function onLeave(el, done) {
  el.style.transition = 'opacity 0.5s'
  el.style.opacity = '0'
  setTimeout(done, 500)
}

function onAfterLeave(el) {
  console.log('Transisi keluar selesai')
}

function onLeaveCancelled() {
  console.log('Transisi keluar dibatalkan')
}
</script>
```

> ⚠️ **Catatan Penting:**
> Jika kamu menangani animasi **sepenuhnya via JavaScript** (tanpa CSS transition), beri tahu Vue dengan `@enter="(el, done) => { ...; done() }"` dan pastikan memanggil `done()`. Atau set `:css="false"` pada `<Transition>` agar Vue tidak menunggu event CSS `transitionend`.

---

## 🎞️ `<TransitionGroup>` — Animasi Daftar

`<TransitionGroup>` adalah saudara `<Transition>` untuk **daftar (list)** yang berubah-ubah via `v-for`. Setiap item bisa dianimasikan secara individual, plus ada animasi **geser** (`move`) saat posisi item berubah.

### 🆚 Transition vs TransitionGroup

| Fitur | `<Transition>` | `<TransitionGroup>` |
| --- | --- | --- |
| Target | Satu elemen/komponen | List (`v-for`) |
| `key` diperlukan | Tidak | ✅ Ya (wajib unik) |
| Animasi `move` | Tidak ada | ✅ Ada (geser posisi) |
| Elemen pembungkus | Tidak perlu | Butuh `tag` (default `<span>`) |
| Penggunaan | Modal, tooltip, pesan | Daftar film, todo list, grid |

### 🛠️ Sintaks Dasar TransitionGroup

```vue
<template>
  <!-- 🔹 TransitionGroup: animasi untuk list yang berubah -->
  <TransitionGroup name="film-list" tag="div" class="movie-grid">
    <!-- 🔹 Setiap MovieCard dianimasikan saat muncul/hilang/geser -->
    <MovieCard
      v-for="film in filmTerfilter"
      :key="film.id"
      :film="film"
    />
  </TransitionGroup>
</template>
```

Penjelasan:

- `name="film-list"` → semua class CSS transisi diawali `film-list-*` (contoh: `film-list-enter-from`).
- `tag="div"` → `TransitionGroup` merender pembungkus `<div>` (bukan `<span>` default) — penting agar layout grid tetap rapi.
- `:key="film.id"` → **wajib unik** agar Vue bisa melacak tiap item saat list berubah.

### 🎨 CSS Transisi — Dijelaskan Baris demi Baris

```css
/* 🔹 ANIMASI MASUK: fade + slide dari bawah */
.film-list-enter-active {
  transition: all 0.4s ease; /* 🔹 Durasi 0.4s, gaya halus */
}

.film-list-enter-from {
  opacity: 0;                /* 🔹 Mulai transparan */
  transform: translateY(20px); /* 🔹 Mulai bergeser 20px ke bawah */
}

/* 🔹 ANIMASI KELUAR: fade */
.film-list-leave-active {
  transition: opacity 0.3s ease; /* 🔹 Durasi 0.3s */
  position: absolute;            /* 🔹 Angkat dari flow agar item lain bisa geser */
  width: 100%;                   /* 🔹 Pertahankan lebar saat absolute */
}

.film-list-leave-to {
  opacity: 0;                /* 🔹 Berakhir transparan */
}

/* 🔹 ANIMASI GESER saat urutan berubah */
.film-list-move {
  transition: transform 0.4s ease; /* 🔹 Geser posisi dengan halus */
}
```

Penjelasan:

- `.film-list-enter-active` → menentukan **durasi & gaya** transisi saat elemen masuk.
- `.film-list-enter-from` → **kondisi awal** sebelum masuk: transparan + bergeser 20px ke bawah. Vue menganimasikan dari sini ke kondisi normal.
- `.film-list-leave-active` → durasi saat keluar. `position: absolute` **krusial** agar elemen yang keluar tidak menduduki ruang, sehingga item lain bisa `move` tanpa jeda.
- `.film-list-leave-to` → **kondisi akhir** saat keluar: transparan.
- `.film-list-move` → saat posisi item berubah (misal setelah di-sort), Vue menganimasikan pergeseran `transform` antar posisi secara otomatis.

> 💡 **Tips:**
> Untuk efek `move` yang mulus, pastikan elemen yang di-leave **diangkat dari flow** (pakai `position: absolute` saat leave) agar item lain bisa bergeser tanpa jeda. Pada banyak kasus sederhana, `.film-list-move` sudah cukup.

### 🎯 Contoh: Daftar Film yang Difilter Live

```vue
<!-- MovieGrid.vue -->
<script setup>
import { ref, computed } from 'vue'
import MovieCard from '@/components/movie/MovieCard.vue'

// 🔹 Data film contoh
const semuaFilm = ref([
  { id: 1, title: 'Interstellar',     genre: 'sci-fi' },
  { id: 2, title: 'The Dark Knight',  genre: 'action' },
  { id: 3, title: 'Inception',        genre: 'sci-fi' },
  { id: 4, title: 'Parasite',         genre: 'drama'  },
])

// 🔹 Keyword filter
const keyword = ref('')

// 🔹 computed: saring film berdasar keyword (case-insensitive)
const filmTerfilter = computed(() => {
  const k = keyword.value.toLowerCase()
  return semuaFilm.value.filter(f =>
    f.title.toLowerCase().includes(k)
  )
})

// 🔹 Fungsi tambah/hapus untuk demo animasi
function tambah() {
  const id = Date.now()
  semuaFilm.value.push({ id, title: `Film Baru ${id}`, genre: 'action' })
}

function hapus(id) {
  semuaFilm.value = semuaFilm.value.filter(f => f.id !== id)
}
</script>

<template>
  <div>
    <input v-model="keyword" placeholder="Cari film..." />
    <button @click="tambah">➕ Tambah</button>

    <TransitionGroup name="film-list" tag="div" class="movie-grid">
      <MovieCard
        v-for="film in filmTerfilter"
        :key="film.id"
        :film="film"
        @click="hapus(film.id)"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.film-list-enter-active,
.film-list-leave-active {
  transition: all 0.4s ease;
}
.film-list-enter-from,
.film-list-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}
.film-list-leave-active {
  position: absolute;
  width: 150px;
}
.film-list-move {
  transition: transform 0.4s ease;
}
</style>
```

> 📌 **Catatan Penting:**
> `TransitionGroup` membutuhkan `key` yang **stabil dan unik** pada setiap item `v-for`. Tanpa `key` yang benar, animasi `move` tidak akan bekerja, dan Vue akan memperingatkan di console.

---

## 🧩 Menggabungkan Semua: Teleport + Transition + TransitionGroup

Inilah kekuatan sesungguhnya — gabungkan ketiganya dalam satu fitur modal Netflix:

```vue
<!-- MovieModal.vue — gabungan lengkap -->
<script setup>
import { ref } from 'vue'

// 🔹 State kontrol
const isOpen = ref(false)

// 🔹 Daftar trailer/daftar yang akan dianimasikan di dalam modal
const daftarTerkait = ref([
  { id: 1, title: 'Film Terkait A' },
  { id: 2, title: 'Film Terkait B' },
  { id: 3, title: 'Film Terkait C' },
])

defineExpose({ buka: () => (isOpen.value = true) })

const emit = defineEmits(['tutup'])
</script>

<template>
  <!-- ① TELEPORT: pindah ke body agar bebas overflow/z-index -->
  <Teleport to="body">
    <!-- ② TRANSITION: fade modal saat muncul/hilang -->
    <Transition name="modal-fade">
      <div
        v-if="isOpen"
        class="modal-overlay"
        @click.self="emit('tutup')"
      >
        <div class="modal-content">
          <button class="modal-close" @click="emit('tutup')">✕</button>

          <h2>Detail Film</h2>

          <!-- ③ TRANSITIONGROUP: animasi daftar terkait -->
          <TransitionGroup name="related" tag="ul" class="related-list">
            <li v-for="item in daftarTerkait" :key="item.id">
              {{ item.title }}
            </li>
          </TransitionGroup>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}
.modal-content {
  background: #181818;
  color: #fff;
  padding: 24px;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
}
.related-list {
  list-style: none;
  padding: 0;
}
.related-list li {
  padding: 8px;
  background: #2a2a2a;
  margin-bottom: 8px;
  border-radius: 4px;
}

/* Transisi modal */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Transisi daftar terkait */
.related-enter-active,
.related-leave-active {
  transition: all 0.3s ease;
}
.related-enter-from,
.related-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
.related-move {
  transition: transform 0.3s ease;
}
</style>
```

Diagram alur gabungan:

```
User klik kartu film
   ↓
MovieModal.isOpen = true
   ↓
① Teleport → pindah render ke <body> (aman dari overflow parent)
   ↓
② Transition "modal-fade" → overlay memudar masuk (opacity 0 → 1)
   ↓
③ TransitionGroup "related" → daftar film terkait slide masuk dari kiri
   ↓
User klik ✕ / overlay
   ↓
emit('tutup') → isOpen = false
   ↓
② Transition "modal-fade" → overlay memudar keluar
③ TransitionGroup "related" → daftar slide keluar
```

---

## 🎬 Studi Kasus — Modal Netflix & Grid Film Teranimasi

**Skenario:** Bangun fitur detail film ala Netflix:
- Klik poster film → modal detail muncul **penuh layar** dengan background gelap.
- Di dalam modal, ada grid **film terkait** yang bisa difilter (genre) dengan animasi halus.
- Modal tidak boleh terpotong oleh `overflow: hidden` di halaman grid.

**Langkah 1 — Komponen `MovieCard` dengan emit klik:**

```vue
<!-- components/movie/MovieCard.vue -->
<script setup>
const props = defineProps({
  film: { type: Object, required: true },
})

const emit = defineEmits(['pilih'])

function handleKlik() {
  emit('pilih', props.film) // Kirim data film ke parent
}
</script>

<template>
  <div class="movie-card" @click="handleKlik">
    <img
      :src="`https://image.tmdb.org/t/p/w300${film.poster_path}`"
      :alt="film.title"
    />
    <h3>{{ film.title }}</h3>
    <span>⭐ {{ film.vote_average }}</span>
  </div>
</template>

<style scoped>
.movie-card {
  cursor: pointer;
  transition: transform 0.2s;
}
.movie-card:hover {
  transform: scale(1.05);
}
</style>
```

**Langkah 2 — Halaman dengan grid teranimasi + modal teleport:**

```vue
<!-- views/BrowseView.vue -->
<script setup>
import { ref, computed } from 'vue'
import MovieCard from '@/components/movie/MovieCard.vue'
import MovieModal from '@/components/movie/MovieModal.vue'

const filmTerpilih = ref(null)
const modalRef     = ref(null)

// 🔹 Data film
const films = ref([
  { id: 1, title: 'Interstellar', vote_average: 8.6, poster_path: '/a.jpg', genre: 'sci-fi' },
  { id: 2, title: 'Inception',    vote_average: 8.8, poster_path: '/b.jpg', genre: 'sci-fi' },
  { id: 3, title: 'Parasite',     vote_average: 8.5, poster_path: '/c.jpg', genre: 'drama'  },
])

const genreDipilih = ref('semua')

const filmTerfilter = computed(() => {
  if (genreDipilih.value === 'semua') return films.value
  return films.value.filter(f => f.genre === genreDipilih.value)
})

function bukaModal(film) {
  filmTerpilih.value = film
  modalRef.value?.buka()
}
</script>

<template>
  <div>
    <!-- Filter genre -->
    <select v-model="genreDipilih">
      <option value="semua">Semua Genre</option>
      <option value="sci-fi">Sci-Fi</option>
      <option value="drama">Drama</option>
    </select>

    <!-- Grid film TERANIMASI dengan TransitionGroup -->
    <TransitionGroup name="film-list" tag="div" class="grid">
      <MovieCard
        v-for="film in filmTerfilter"
        :key="film.id"
        :film="film"
        @pilih="bukaModal"
      />
    </TransitionGroup>

    <!-- Modal dengan Teleport + Transition (dari MovieModal) -->
    <MovieModal ref="modalRef" :film="filmTerpilih" />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}
.film-list-enter-active,
.film-list-leave-active {
  transition: all 0.4s ease;
}
.film-list-enter-from,
.film-list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.film-list-leave-active {
  position: absolute;
}
.film-list-move {
  transition: transform 0.4s ease;
}
</style>
```

**Yang dipelajari:**
- `Teleport` membebaskan modal dari `overflow` grid.
- `Transition` memberi fade halus pada modal.
- `TransitionGroup` memberi efek filter live pada grid film.
- `MovieCard` mengemit event ke parent yang membuka modal via `defineExpose`.

---

## 🚨 Jebakan Umum Pemula di Bab 22

### ❌ Jebakan 1 — Lupa `name` Komponen untuk `KeepAlive :include`

```vue
<!-- ❌ SALAH: KeepAlive pakai :include tapi komponen tak punya name cocok -->
<!-- SearchView.vue tanpa nama eksplisit di script setup -->
<script setup>
// Tidak ada deklarasi nama → Vue pakai nama file "SearchView"
// Ini SEBENARNYA aman, TAPI kalau kamu rename file jadi SearchPage.vue
// maka :include="['SearchView']" TIDAK akan cocok!
</script>

<!-- ✅ BENAR: pastikan nama file / name cocok dengan :include -->
<!-- File: SearchView.vue, maka :include="['SearchView']" cocok -->
<KeepAlive :include="['SearchView', 'BrowseView']">
  <component :is="Component" />
</KeepAlive>
```

> ✅ **Solusi:** Gunakan `:include` dengan array nama yang **persis sama** dengan nama komponen (atau nama file untuk `<script setup>`). Atau gunakan `:max` saja jika tidak peduli nama.

---

### ❌ Jebakan 2 — Teleport ke Target yang Belum Ada

```vue
<!-- ❌ SALAH: target #modal-root belum didefinisikan di DOM -->
<template>
  <Teleport to="#modal-root">
    <div v-if="isOpen">Modal</div>
  </Teleport>
  <!-- Tidak ada <div id="modal-root"> di mana pun! -->
</template>

<!-- ✅ BENAR: siapkan target di App.vue -->
<!-- App.vue -->
<template>
  <div id="app">
    <RouterView />
  </div>
  <div id="modal-root"></div> <!-- ✅ Ada target -->
</template>
```

> ✅ **Solusi:** Pastikan elemen target (misal `<div id="modal-root">`) sudah dirender di DOM sebelum `<Teleport>` dijalankan.

---

### ❌ Jebakan 3 — `key` Tidak Unik pada TransitionGroup

```vue
<!-- ❌ SALAH: key pakai index → animasi move rusak & Vue warning -->
<TransitionGroup name="film" tag="div">
  <MovieCard
    v-for="(film, i) in films"
    :key="i"   <!-- ❌ Index bukan ID unik -->
    :film="film"
  />
</TransitionGroup>

<!-- ✅ BENAR: key pakai ID unik dari data -->
<TransitionGroup name="film" tag="div">
  <MovieCard
    v-for="film in films"
    :key="film.id"  <!-- ✅ ID stabil & unik -->
    :film="film"
  />
</TransitionGroup>
```

> ✅ **Solusi:** Selalu gunakan `:key` berbasis ID unik (bukan `index`) pada `TransitionGroup`. Index berubah saat list difilter, merusak animasi `move`.

---

### ❌ Jebakan 4 — Meletakkan Fetch Data Hanya di `onMounted` + KeepAlive

```vue
<!-- ❌ SALAH: data tidak refresh saat kembali dari cache -->
<script setup>
import { onMounted, ref } from 'vue'

const films = ref([])
onMounted(async () => {
  films.value = await ambilFilm() // Hanya jalan sekali!
})
</script>

<!-- ✅ BENAR: pindahkan ke onActivated agar refresh saat tampil -->
<script setup>
import { onMounted, onActivated, ref } from 'vue'

const films = ref([])
async function muat() {
  films.value = await ambilFilm()
}
onMounted(muat)       // Pertama kali
onActivated(muat)     // Setiap kali tampil dari cache
</script>
```

> ✅ **Solusi:** Saat memakai `KeepAlive`, letakkan refresh data di `onActivated` (bukan hanya `onMounted`) agar data selalu terbaru saat user kembali.

---

### ❌ Jebakan 5 — Lupa `position: absolute` saat `leave` pada TransitionGroup

```css
/* ❌ SALAH: item yang keluar masih menduduki ruang */
.film-list-leave-active {
  transition: opacity 0.3s;
}
/* Item keluar mempertahankan posisi → item lain tidak bisa geser mulus */

/* ✅ BENAR: angkat dari flow agar item lain bisa move */
.film-list-leave-active {
  transition: opacity 0.3s;
  position: absolute;   /* ✅ Dilepaskan dari layout */
  width: 160px;         /* ✅ Pertahankan lebar agar tidak "kaget" */
}
```

> ✅ **Solusi:** Tambahkan `position: absolute` (dan lebar yang sesuai) pada `.xxx-leave-active` agar elemen yang keluar tidak menghalangi animasi `move` item lainnya.

---

## 📝 Ringkasan Bab 22

| Konsep | Penjelasan |
| --- | --- |
| **`<Teleport>`** | Memindahkan lokasi render ke target DOM lain (biasanya `<body>`) agar bebas dari `z-index`/`overflow`/`transform` parent. Reactivity tetap terikat parent. |
| **`:to`** | Selektor target Teleport, misal `to="body"` atau `to="#modal-root"`. Target harus sudah ada di DOM. |
| **`:disabled`** | Mematikan Teleport → konten dirender di tempat aslinya. |
| **Multiple Teleport** | Banyak Teleport bisa menarget elemen sama → konten digabung berurutan. |
| **`<KeepAlive>`** | Mencegah komponen di-destroy, menyimpan state saat berpindah halaman. |
| **`:include` / `:exclude`** | Membatasi komponen mana yang di-cache berdasar nama. |
| **`:max`** | Batas jumlah cache (LRU eviction) agar tidak memakan memori. |
| **`onActivated`** | Dipanggil saat komponen tampil dari cache (ganti `onMounted` untuk refresh). |
| **`onDeactivated`** | Dipanggil saat komponen disembunyikan ke cache. |
| **`<Transition>`** | Animasi masuk/keluar untuk **satu** elemen (class `enter-*`/`leave-*`). |
| **`<TransitionGroup>`** | Animasi untuk **list** `v-for`, termasuk animasi `move` saat posisi berubah. |
| **`.xxx-move`** | Class untuk menganimasikan pergeseran posisi item. Butuh `key` unik. |
| **`.self` pada overlay** | Memastikan klik di dalam konten tidak menutup modal. |

---

## 🎯 Latihan Mandiri

**⭐ Latihan 1 — Modal Teleport Dasar**

Buat komponen `InfoModal.vue` yang menggunakan `<Teleport to="body">`. Modal menampilkan slot default dan bisa dibuka/ditutup via prop `isOpen` + emit `tutup`. Tambahkan overlay gelap dengan `@click.self` untuk menutup. Uji dengan menaruh modal di dalam `<div style="overflow: hidden">` dan pastikan modal tetap penuh layar.

**⭐⭐ Latihan 2 — KeepAlive pada Router**

Modifikasi `App.vue` agar `<RouterView>` dibungkus `<KeepAlive :include="['SearchView']">`. Tambahkan `onActivated` di `SearchView` yang mencatat (via `console.log`) keyword terakhir saat user kembali. Buktikan keyword & hasil pencarian tetap ada setelah navigasi pulang-pergi.

**⭐⭐⭐ Latihan 3 — TransitionGroup Filter Live**

Buat `DaftarGenre.vue` dengan array film (id, title, genre). Sediakan tombol filter genre (Sci-Fi, Drama, Action, Semua). Gunakan `<TransitionGroup>` dengan animasi: masuk dari bawah + fade, keluar fade, dan `move` saat urutan berubah. Pastikan `position: absolute` pada `leave-active` agar geser mulus.

**⭐⭐⭐⭐ Latihan 4 — Gabungan Netflix-style**

Bangun fitur lengkap: grid `MovieCard` (dengan emit `pilih`) + `<Teleport>` modal detail + `<Transition>` fade + `<TransitionGroup>` daftar film terkait di dalam modal. Modal harus menampilkan judul, rating, dan daftar terkait yang bisa difilter genre dengan animasi. Pastikan modal tidak terpotong oleh `overflow: hidden` di halaman grid.

---

*Lanjut ke ➡️ **Bab 23 — Performa, Testing & Best Practices***
