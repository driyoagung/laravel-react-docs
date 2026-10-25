# 📝 Bab 4 — Template Syntax & Direktif Dasar

> *"Jika komponen adalah ruangan, maka template syntax adalah bahasa yang dipakai ruangan itu untuk berkomunikasi dengan dunia luar: menampilkan teks, menempelkan atribut, merespons klik, menyembunyikan diri, dan mengulang dirinya. Kuasai bahasanya, dan komponen apa pun bisa kamu bangun."*
>

---

> **🧠 Apa Itu Template Syntax & Direktif?**
>
>
> **Template syntax** adalah cara menulis HTML di Vue agar bisa "berpikir" — menampilkan data, bereaksi terhadap event, dan berubah secara dinamis. Inti dari syntax ini adalah **direktif**: kata berawalan `v-` (seperti `v-if`, `v-for`, `v-model`) yang memberi instruksi khusus ke Vue.
>
> Setiap direktif punya satu tugas: `{{ }}` menampilkan teks, `v-bind` mengikat atribut, `v-on` menangkap event, `v-if`/`v-show` menyembunyikan, `v-for` mengulang, dan `v-model` menyinkronkan input. Inilah "peralatan harian" yang akan Anda pakai di setiap komponen.
>

---

> **🏗️ Analogi Sederhana:**
>
>
> Bayangkan template Vue seperti **panel kontrol rumah pintar**. `{{ }}` adalah layar kecil yang menampilkan suhu ruangan. `v-bind` adalah kabel yang menghubungkan tombol ke lampu. `v-on` adalah sensor yang mendeteksi saat Anda menekan sesuatu. `v-if` adalah saklar yang memutus/menyambung listrik (elemen ada/tidak). `v-for` adalah mesin cetak yang membuat 10 salinan kartu nama. Dan `v-model` adalah dua arah kabel: tekan di panel → lampu nyala, lampu nyala → panel ikut menunjukkan "on".
>

---

## 📋 Daftar Isi Bab 4

1. Interpolasi Teks: `{{ }}` — Menampilkan Data
2. `v-bind` (`:`) — Mengikat Atribut HTML
3. `v-on` (`@`) — Menangani Event
4. `v-if`, `v-else-if`, `v-else` — Conditional Rendering
5. `v-show` — Sembunyikan Elemen (Tetap di DOM)
6. Studi Kasus: `v-if` vs `v-show`
7. `v-for` — Merender List
8. `v-model` — Two-Way Data Binding
9. 🎬 Studi Kasus — Form Login dengan `v-model`
10. Direktif Khusus Lainnya (v-html, v-text, v-once, v-cloak, v-pre)
11. Modifier Direktif yang Wajib Tahu
12. 🚨 Jebakan Umum per Direktif
13. 📝 Ringkasan & 🎯 Latihan Mandiri

---

## 📝 4.1 Interpolasi Teks: `{{ }}` — Menampilkan Data

Cara paling dasar menampilkan data JavaScript ke layar adalah **interpolasi teks** dengan dua kurung kurawal `{{ }}`. Vue akan menggantinya dengan nilai variabel secara otomatis dan reaktif:

```vue
<template>
  <div>
    <!-- Tampilkan nilai variabel -->
    <h1>{{ judulFilm }}</h1>

    <!-- Ekspresi JavaScript sederhana juga bisa -->
    <p>{{ harga * 1.1 }}</p>
    <p>{{ namaDepan + ' ' + namaBelakang }}</p>
    <p>{{ isLoggedIn ? 'Selamat datang!' : 'Silakan login' }}</p>

    <!-- Memanggil method -->
    <p>{{ formatRupiah(harga) }}</p>
  </div>
</template>
```

Bedah tiap baris:

- `{{ judulFilm }}` — mencetak isi variabel `judulFilm`.
- `{{ harga * 1.1 }}` — ekspresi matematika; hasilnya otomatis dihitung.
- `{{ namaDepan + ' ' + namaBelakang }}` — menggabung dua string jadi nama lengkap.
- `{{ isLoggedIn ? ... : ... }}` — *ternary operator*; menampilkan teks berbeda berdasarkan kondisi (login atau belum).
- `{{ formatRupiah(harga) }}` — memanggil method `formatRupiah` untuk memformat angka jadi `"Rp 50.000"`.

```js
// Di <script setup>, variabel & method harus dideklarasikan:
import { ref } from 'vue'

const judulFilm = ref('Interstellar')
const harga = ref(45000)
const namaDepan = ref('Budi')
const namaBelakang = ref('Santoso')
const isLoggedIn = ref(true)

function formatRupiah(angka) {
  return 'Rp ' + angka.toLocaleString('id-ID')
}
```

> ⚠️ **Catatan:**
> `{{ }}` hanya untuk **menampilkan teks**. Tidak bisa dipakai untuk atribut HTML (seperti `src`, `href`, `class`). Untuk atribut, gunakan `v-bind` (dijelaskan di bawah).

> 📌 **Catatan Penting:**
> Di dalam `{{ }}`, Anda boleh menulis ekspresi JavaScript, **tapi bukan statement**. Artinya `{{ harga = 10 }}` (assignment) atau `{{ if(...) {} }}` tidak valid. Gunakan hanya untuk menghitung/menampilkan nilai. Untuk logika kompleks, pindahkan ke method atau computed property.

### 🔍 Contoh Salah vs Benar

```vue
<!-- ❌ SALAH: assignment (bukan ekspresi) -->
<p>{{ jumlah = jumlah + 1 }}</p>

<!-- ❌ SALAH: statement if -->
<p>{{ if (x) { return 'ya' } }}</p>

<!-- ✅ BENAR: ekspresi -->
<p>{{ jumlah + 1 }}</p>
<p>{{ x ? 'ya' : 'tidak' }}</p>
```

---

## 🔗 4.2 `v-bind` (`:`) — Mengikat Atribut HTML

Untuk mengikat **atribut HTML** ke nilai JavaScript, pakai direktif `v-bind`. Singkatannya menggunakan titik dua `:` — ini yang akan Anda pakai setiap hari.

```vue
<template>
  <!-- v-bind: mengikat atribut HTML ke nilai JavaScript -->

  <!-- Cara panjang -->
  <img v-bind:src="urlGambar" v-bind:alt="judulFilm" />

  <!-- Cara singkat (gunakan ini!) — titik dua sebagai shortcut -->
  <img :src="urlGambar" :alt="judulFilm" />

  <!-- Binding class secara kondisional -->
  <div :class="{ 'aktif': isAktif, 'highlighted': isHighlighted }">...</div>

  <!-- Binding style secara dinamis -->
  <div :style="{ backgroundColor: warnaTema, fontSize: ukuranFont + 'px' }">...</div>

  <!-- Binding beberapa atribut sekaligus dengan object -->
  <img v-bind="{ src: urlGambar, alt: judulFilm, loading: 'lazy' }" />
</template>
```

Bedah:

- `:src="urlGambar"` — nilai `src` diambil dari variabel `urlGambar`, bukan teks literal. Saat `urlGambar` berubah, gambar otomatis ikut berubah.
- `:class="{ 'aktif': isAktif }"` — menambahkan class `aktif` **hanya jika** `isAktif` bernilai `true`. Sangat berguna untuk toggle style aktif/nonaktif.
- `:style="{ backgroundColor: warnaTema }"` — mengatur style inline secara dinamis.
- `v-bind="{ ... }"` — bentuk "object" untuk mengikat banyak atribut sekaligus.

```js
// Di script:
const urlGambar = ref('/poster.jpg')
const judulFilm = ref('Dune')
const isAktif = ref(true)
const isHighlighted = ref(false)
const warnaTema = ref('#e50914')
const ukuranFont = ref(16)
```

> 💡 **Tips:** Selalu pakai bentuk singkat `:` daripada `v-bind:`. Lebih bersih dan merupakan konvensi seluruh ekosistem Vue.

### 🔍 Binding Class: 3 Cara

```vue
<!-- 1. Object syntax -->
<div :class="{ aktif: isAktif, merah: isError }">...</div>

<!-- 2. Array syntax -->
<div :class="[kelasDasar, isAktif ? 'aktif' : '']">...</div>

<!-- 3. Kombinasi -->
<div :class="[{ aktif: isAktif }, kelasTambahan]">...</div>
```

| Cara | Kapan Dipakai |
| --- | --- |
| Object `{ }` | Toggle class on/off berdasarkan boolean |
| Array `[ ]` | Gabung beberapa class dari variabel |
| Kombinasi | Kasus kompleks |

---

## 🖱️ 4.3 `v-on` (`@`) — Menangani Event

Untuk merespons aksi pengguna (klik, ketik, hover), pakai `v-on`. Singkatannya adalah `@` — juga dipakai setiap hari.

```vue
<template>
  <!-- v-on: mendengarkan event dari DOM -->

  <!-- Cara panjang -->
  <button v-on:click="tambahKeWatchlist">Simpan</button>

  <!-- Cara singkat (gunakan ini!) — @ sebagai shortcut -->
  <button @click="tambahKeWatchlist">Simpan</button>

  <!-- Inline handler untuk logika sederhana -->
  <button @click="jumlah++">Tambah</button>

  <!-- Kirim argumen ke method -->
  <button @click="hapus(film.id)">Hapus</button>

  <!-- Event modifier — .prevent mencegah default browser behavior -->
  <form @submit.prevent="kirimForm">...</form>

  <!-- Event lain yang sering dipakai -->
  <input @keyup.enter="cariFilm" />    <!-- Tekan Enter -->
  <div @mouseenter="tampilHover" />    <!-- Mouse masuk -->
  <div @mouseleave="sembunyiHover" />  <!-- Mouse keluar -->
</template>
```

Bedah:

- `@click="tambahKeWatchlist"` — menjalankan method saat tombol diklik.
- `@click="jumlah++"` — *inline handler* untuk aksi sekali baris tanpa method.
- `@click="hapus(film.id)"` — mengirim argumen (`film.id`) ke method.
- `@submit.prevent` — *event modifier* `.prevent` mencegah perilaku default (form tidak reload halaman). Modifier lain: `.stop` (hentikan *event bubbling*).
- `@keyup.enter` — hanya trigger saat tombol Enter ditekan (cocok untuk pencarian).
- `@mouseenter` / `@mouseleave` — untuk efek hover.

```js
import { ref } from 'vue'
const jumlah = ref(0)

function tambahKeWatchlist() { /* ... */ }
function hapus(id) { /* ... */ }
function cariFilm() { /* ... */ }
function tampilHover() { /* ... */ }
function sembunyiHover() { /* ... */ }
function kirimForm() { /* ... */ }
```

> 💡 **Tips:** Modifier sangat menghemat kode. Alih-alih menulis `event.preventDefault()` di dalam method, cukup tambahkan `.prevent` di template.

### 🔍 Event yang Sering Dipakai (Daftar)

| Event | Kapan |
| --- | --- |
| `@click` | Klik elemen |
| `@input` | Nilai input berubah |
| `@change` | Nilai berubah & kehilangan fokus |
| `@submit` | Form disubmit |
| `@keyup.enter` | Tombol Enter dilepas |
| `@mouseenter` / `@mouseleave` | Hover masuk/keluar |
| `@scroll` | Elemen di-scroll |
| `@keydown` | Tombol ditekan |

---

## 🔀 4.4 `v-if`, `v-else-if`, `v-else` — Conditional Rendering

Untuk menampilkan elemen **hanya jika kondisi tertentu benar**, pakai `v-if`. Vue akan benar-benar **menambah/menghapus** elemen dari DOM.

```vue
<template>
  <!-- Elemen BENAR-BENAR dihapus/ditambah dari DOM -->

  <div v-if="statusPembayaran === 'success'">
    ✅ Pembayaran Berhasil!
  </div>

  <div v-else-if="statusPembayaran === 'pending'">
    ⏳ Menunggu Konfirmasi...
  </div>

  <div v-else-if="statusPembayaran === 'failed'">
    ❌ Pembayaran Gagal
  </div>

  <div v-else>
    ❓ Status Tidak Diketahui
  </div>
</template>
```

Cara kerja: Vue mengevaluasi kondisi dari atas ke bawah, menampilkan div pertama yang cocok. `v-else` menangkap semua sisa kasus.

```js
const statusPembayaran = ref('success')  // ganti ke 'pending'/'failed'/'lain'
```

> ⚠️ **Catatan:**
> `v-else-if` dan `v-else` harus **langsung mengikuti** elemen `v-if`. Tidak boleh ada elemen lain di antara mereka. Jika disisipi elemen lain, rantai kondisi akan putus dan error.

> 📌 **Catatan Penting:**
> Karena `v-if` benar-benar membuang elemen, state internal elemen itu (misal teks yang diketik di dalam `<input>`) akan **hilang** saat kondisi berubah false lalu true lagi. Untuk konten yang sering toggle, pertimbangkan `v-show` (di bawah).

### 🔍 Template v-if (Group Tanpa Elemen Pembungkus)

```vue
<!-- Bungkus beberapa elemen tanpa <div> ekstra -->
<template v-if="isAdmin">
  <h1>Panel Admin</h1>
  <p>Selamat datang, admin.</p>
  <button>Kelola User</button>
</template>
```

`<template>` di sini tidak menghasilkan elemen DOM sungguhan — ia hanya pembungkus logis.

---

## 👁️ 4.5 `v-show` — Sembunyikan Elemen (Tetap di DOM)

Berbeda dengan `v-if`, `v-show` **tidak menghapus** elemen. Ia hanya mengubah style `display` menjadi `none` saat kondisi false.

```vue
<template>
  <!-- Elemen TETAP di DOM, hanya style display yang diubah -->
  <div v-show="isMenuTerbuka">
    Menu Navigasi
  </div>
</template>
```

```js
const isMenuTerbuka = ref(false)  // false → display:none
```

Kapan pakai `v-show`? Saat elemen sering ditampilkan/disembunyikan (dropdown, tooltip, accordion). Karena elemen tetap di DOM, toggle-nya sangat cepat — tidak ada proses render ulang.

---

## 🆚 4.6 Studi Kasus: `v-if` vs `v-show`

Memilih antara keduanya sering membingungkan pemula. Berikut perbandingan langsung:

| | `v-if` | `v-show` |
| --- | --- | --- |
| **Cara kerja** | Hapus/tambah elemen dari DOM | Toggle `display: none` |
| **Performa toggle** | Lebih lambat (re-render) | ✅ Lebih cepat |
| **Performa awal** | ✅ Lebih cepat (tidak render jika false) | Lebih lambat (selalu render) |
| **Gunakan untuk** | Kondisi yang jarang berubah | Kondisi yang sering berubah |
| **Contoh** | Halaman 404, role-based content | Dropdown menu, tooltip, accordion |

🎬 **Studi Kasus — Kapan mana:**

```vue
<!-- ✅ Pakai v-if: konten admin hanya dirender jika user adalah admin -->
<!-- (jarang berubah — saat login/logout saja) -->
<AdminPanel v-if="user.role === 'admin'" />

<!-- ✅ Pakai v-show: dropdown yang sering dibuka-tutup -->
<!-- (berubah tiap kali user klik, butuh respon instan) -->
<DropdownMenu v-show="isDropdownOpen" />
```

> 💡 **Rumus cepat:** "Sering berubah? `v-show`. Jarang berubah? `v-if`."

---

## 🔁 4.7 `v-for` — Merender List

Untuk menampilkan **daftar/data berulang** (film, user, komentar), pakai `v-for`. Ini satu dari direktif paling sering dipakai.

```vue
<template>
  <!-- Selalu sertakan :key yang unik! -->
  <div
    v-for="film in daftarFilm"
    :key="film.id"
  >
    {{ film.title }}
  </div>

  <!-- Dengan index -->
  <li v-for="(film, index) in daftarFilm" :key="film.id">
    {{ index + 1 }}. {{ film.title }}
  </li>

  <!-- Iterasi object -->
  <p v-for="(nilai, kunci) in objekFilm" :key="kunci">
    {{ kunci }}: {{ nilai }}
  </p>

  <!-- Iterasi angka (1 sampai 5) -->
  <span v-for="n in 5" :key="n">⭐</span>
</template>
```

Bedah:

- `v-for="film in daftarFilm"` — untuk tiap item `film` di array `daftarFilm`, render blok ini.
- `:key="film.id"` — **wajib**: pengenal unik tiap item (lihat catatan di bawah).
- `(film, index)` — bentuk dengan index (urutan 0,1,2...). `index + 1` agar nomor mulai dari 1.
- Iterasi object: `(nilai, kunci)` mengambil pasangan nilai & key.
- `v-for="n in 5"` — trik mencetak angka 1–5 (berguna untuk rating bintang ⭐).

```js
const daftarFilm = ref([
  { id: 1, title: 'Dune' },
  { id: 2, title: 'Interstellar' },
])
const objekFilm = ref({ judul: 'Dune', tahun: 2021, rating: 8.0 })
```

> ⚠️ **Wajib Pakai `:key`!**
> `:key` membantu Vue mengidentifikasi setiap elemen secara unik. Tanpa `:key`, Vue bisa salah mengupdate elemen saat list berubah — menyebabkan bug yang susah ditemukan. Selalu gunakan ID unik, bukan index!

> 📌 **Catatan Penting:**
> Hindari memakai `index` sebagai `:key` kecuali daftar tidak pernah diubah urutannya (tidak ada add/remove di tengah). Pakai ID data asli (`film.id`) untuk hasil yang andal.

### 🔍 v-for dengan `<template>`

```vue
<!-- Render beberapa elemen per item tanpa wrapper -->
<template v-for="film in daftarFilm" :key="film.id">
  <h3>{{ film.title }}</h3>
  <p>{{ film.tahun }}</p>
</template>
```

---

## 📝 4.8 `v-model` — Two-Way Data Binding

`v-model` membuat **input form** dan **variabel JavaScript** selalu sinkron — dua arah. Ini "sihir" yang paling sering dipakai untuk form.

```vue
<template>
  <!-- Input text -->
  <input v-model="keyword" placeholder="Cari film..." />
  <p>Anda mengetik: {{ keyword }}</p>

  <!-- Textarea -->
  <textarea v-model="deskripsi"></textarea>

  <!-- Checkbox -->
  <input type="checkbox" v-model="setujuSyarat" />

  <!-- Radio -->
  <input type="radio" v-model="genre" value="action" /> Action
  <input type="radio" v-model="genre" value="comedy" /> Comedy

  <!-- Select -->
  <select v-model="genreTerpilih">
    <option value="">Pilih Genre</option>
    <option value="action">Action</option>
    <option value="drama">Drama</option>
  </select>
</template>
```

Bedah:

- `v-model="keyword"` — saat user mengetik, `keyword` otomatis berubah; saat `keyword` diubah dari kode, input otomatis menampilkannya.
- `checkbox` — `setujuSyarat` jadi `true`/`false` otomatis.
- `radio` — `genre` mengambil `value` radio yang dipilih.
- `select` — `genreTerpilih` mengambil nilai `<option>` yang dipilih.

```js
const keyword = ref('')
const deskripsi = ref('')
const setujuSyarat = ref(false)
const genre = ref('action')
const genreTerpilih = ref('')
```

> 💡 **Apa itu Two-Way Binding?**
> Ketika nilai input berubah → variabel JavaScript ikut berubah.
> Ketika variabel JavaScript berubah → nilai input ikut berubah.
> Keduanya selalu sinkron secara otomatis.

### 🔍 Modifier v-model

```vue
<!-- .lazy: update saat blur, bukan tiap ketik -->
<input v-model.lazy="nama" />

<!-- .number: otomatis ubah ke number -->
<input v-model.number="umur" type="number" />

<!-- .trim: hapus spasi di awal/akhir -->
<input v-model.trim="email" />
```

| Modifier | Efek |
| --- | --- |
| `.lazy` | Sync saat `change` (blur), bukan `input` |
| `.number` | Cast ke `Number` |
| `.trim` | Hapus whitespace di pinggir |

---

## 🎬 4.9 Studi Kasus — Form Login dengan `v-model`

Mari gabungkan `v-model`, `v-if`, dan event handler untuk membuat form login Netflix-style yang fungsional.

```vue
<template>
  <form class="login-box" @submit.prevent="masuk">
    <h2>Sign In</h2>

    <!-- v-model mengikat input ke state -->
    <input v-model.trim="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />

    <!-- Checkbox two-way -->
    <label>
      <input type="checkbox" v-model="ingatSaya" /> Ingat saya
    </label>

    <!-- Pesan error muncul dengan v-if -->
    <p v-if="error" class="error">❌ {{ error }}</p>

    <button type="submit" :disabled="sedangMemproses">
      {{ sedangMemproses ? 'Memproses...' : 'Sign In' }}
    </button>

    <!-- Preview data (debug) -->
    <pre v-if="sudahMasuk">✅ Login sebagai {{ email }}</pre>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const ingatSaya = ref(false)
const error = ref('')
const sedangMemproses = ref(false)
const sudahMasuk = ref(false)

function masuk() {
  error.value = ''
  // Validasi sederhana
  if (!email.value.includes('@')) {
    error.value = 'Email tidak valid'
    return
  }
  if (password.value.length < 6) {
    error.value = 'Password minimal 6 karakter'
    return
  }
  sedangMemproses.value = true
  // Simulasi request
  setTimeout(() => {
    sedangMemproses.value = false
    sudahMasuk.value = true
  }, 1000)
}
</script>

<style scoped>
.login-box { max-width: 320px; margin: 2rem auto; padding: 1.5rem; }
.error { color: #e50914; }
input { display: block; width: 100%; margin-bottom: 0.75rem; padding: 0.5rem; }
</style>
```

```
ALUR FORM LOGIN:
1. User ketik → v-model update `email`/`password`
2. Klik Sign In → @submit.prevent → masuk()
3. Validasi → kalau salah, v-if tampilkan error
4. Kalau benar → simulasi loading → tampil "Login sebagai ..."
```

> 🎯 **Pelajaran:**
> `v-model` menghilangkan puluhan baris event listener manual. Kombinasikan dengan `v-if` untuk feedback, `@submit.prevent` untuk cegah reload — dan Anda punya form interaktif dalam hitungan menit.

---

## 🧩 4.10 Direktif Khusus Lainnya

Selain 6 direktif utama, Vue punya beberapa direktif pembantu:

### 📌 `v-text` — Sama seperti `{{ }}` tapi untuk teks murni

```vue
<!-- Sama dengan <span>{{ pesan }}</span> -->
<span v-text="pesan"></span>
```

### 📌 `v-html` — Render HTML mentah (HATI-HATI XSS!)

```vue
<!-- ⚠️ HANYA untuk konten terpercaya -->
<p v-html="kontenHtml"></p>

<!-- ❌ JANGAN: render input user mentah → rentan XSS -->
<p v-html="komentarUser"></p>
```

### 📌 `v-once` — Render sekali saja (tidak reaktif)

```vue
<!-- Nilai tidak akan update lagi setelah render pertama -->
<p v-once>{{ pesanSelamatDatang }}</p>
```

### 📌 `v-cloak` — Sembunyikan sebelum compile selesai

```vue
<!-- CSS: [v-cloak] { display: none } -->
<div v-cloak>{{ data }}</div>
<!-- Mencegah "flash" {{ data }} sebelum Vue siap -->
```

### 📌 `v-pre` — Abaikan kompilasi Vue

```vue
<!-- Tampilkan literal {{ ini tidak dikompilasi }} -->
<span v-pre>{{ ini tidak dikompilasi }}</span>
```

| Direktif | Fungsi |
| --- | --- |
| `v-text` | Set teks elemen |
| `v-html` | Set HTML (awasi XSS) |
| `v-once` | Render sekali, lalu statis |
| `v-cloak` | Sembunyikan sampai siap |
| `v-pre` | Jangan kompilasi bagian ini |

---

## 🎛️ 4.11 Modifier Direktif yang Wajib Tahu

Modifier adalah "suffix" titik yang mengubah perilaku direktif. Berikut yang paling sering dipakai:

### Modifier `v-on`

| Modifier | Efek |
| --- | --- |
| `.stop` | `event.stopPropagation()` — hentikan bubbling |
| `.prevent` | `event.preventDefault()` — batalkan default |
| `.once` | Handler hanya jalan sekali |
| `.self` | Hanya trigger jika event di elemen itu sendiri |
| `.enter` / `.esc` | Filter berdasarkan tombol |

```vue
<button @click.stop="tutup">✕</button>      <!-- hentikan bubbling -->
<a @click.prevent="link">Link</a>           <!-- jangan pindah halaman -->
<img @click.once="like">❤️</img>             <!-- sekali saja -->
<input @keyup.esc="tutupModal" />            <!-- tekan Escape -->
```

### Modifier `v-model`

Sudah dibahas: `.lazy`, `.number`, `.trim` (lihat 4.8).

---

## 🚨 4.12 Jebakan Umum per Direktif

### ❌ Jebakan `{{ }}` — Menaruh Statement, Bukan Ekspresi

```vue
<!-- ❌ SALAH -->
<p>{{ if (x > 5) { return 'besar' } }}</p>

<!-- ✅ BENAR -->
<p>{{ x > 5 ? 'besar' : 'kecil' }}</p>
```

**Penjelasan:** `{{ }}` hanya menerima ekspresi (yang menghasilkan nilai), bukan statement (if, for, assignment).

---

### ❌ Jebakan `v-bind` — Lupa Pakai `:` untuk Atribut Dinamis

```vue
<!-- ❌ SALAH: src jadi teks literal "urlGambar", bukan nilai variabel -->
<img src="urlGambar" />

<!-- ✅ BENAR -->
<img :src="urlGambar" />
```

**Penjelasan:** Tanpa `:`, Vue menganggap nilai sebagai string biasa. Selalu pakai `:` untuk nilai dinamis.

---

### ❌ Jebakan `v-on` — Lupa `.prevent` di Form

```vue
<!-- ❌ SALAH: halaman reload tiap submit -->
<form @submit="kirim">...</form>

<!-- ✅ BENAR -->
<form @submit.prevent="kirim">...</form>
```

**Penjelasan:** Form HTML default me-reload halaman saat submit. `.prevent` mencegahnya agar Vue yang mengurus.

---

### ❌ Jebakan `v-if` / `v-else` — Elemen Disisipi di Antara

```vue
<!-- ❌ SALAH: ada <hr> di antara v-if dan v-else -->
<div v-if="x">A</div>
<hr />
<div v-else>B</div>

<!-- ✅ BENAR: langsung berurutan -->
<div v-if="x">A</div>
<div v-else>B</div>
```

**Penjelasan:** Rantai `v-if`/`v-else` harus kontigu. Elemen penyela memutus rantai.

---

### ❌ Jebakan `v-show` — Dipakai untuk Elemen yang Butuh State Internal

```vue
<!-- ❌ KURANG TEPAT: input di dalam v-show kehilangan fokus saat disembunyikan? -->
<!-- Sebenarnya v-show TETAP menyimpan state, tapi jika isi punya mount/unmount
     lifecycle yang mahal, lebih baik v-if. -->
<div v-show="buka"> <input v-model="q" /> </div>

<!-- Pahami: v-show cocok untuk toggle tampilan, bukan untuk konten
     yang perlu di-render ulang dari nol tiap kali dibuka -->
```

**Penjelasan:** `v-show` cocok untuk elemen sering toggle. Jika konten berat & jarang dibuka, `v-if` lebih efisien di awal.

---

### ❌ Jebakan `v-for` — Pakai Index sebagai `:key`

```vue
<!-- ❌ SALAH: index tidak stabil saat list diubah -->
<li v-for="(film, i) in daftarFilm" :key="i">{{ film.title }}</li>

<!-- ✅ BENAR: pakai id unik -->
<li v-for="film in daftarFilm" :key="film.id">{{ film.title }}</li>
```

**Penjelasan:** Index berubah saat item ditambah/hapus di tengah → Vue salah lacak → bug render.

---

### ❌ Jebakan `v-model` — Dipakai di Elemen Non-Form

```vue
<!-- ❌ SALAH: v-model hanya untuk input/select/textarea -->
<div v-model="x">...</div>

<!-- ✅ BENAR -->
<input v-model="x" />
```

**Penjelasan:** `v-model` hanya berlaku untuk `<input>`, `<textarea>`, `<select>`, dan komponen yang eksplisit mendukungnya (via `defineModel` / `update:modelValue`).

---

## 🧪 4.13 Walkthrough: Halaman Profil Film Lengkap

Mari gabungkan banyak direktif dalam satu contoh nyata.

```vue
<template>
  <article class="kartu-film">
    <!-- interpolasi + v-bind -->
    <img :src="film.poster" :alt="film.judul" />
    <h2>{{ film.judul }}</h2>

    <!-- v-if kondisional -->
    <p v-if="film.rating > 8">⭐ Film bagus!</p>
    <p v-else-if="film.rating > 6">🎬 Lumayan</p>
    <p v-else>🤔 Biasa saja</p>

    <!-- v-for list genre -->
    <ul>
      <li v-for="g in film.genres" :key="g">{{ g }}</li>
    </ul>

    <!-- v-model search -->
    <input v-model="kataKunci" placeholder="Cari scene..." />
    <p>Kata kunci: {{ kataKunci }}</p>

    <!-- v-on event -->
    <button @click="tutup">Tutup</button>

    <!-- v-show toggle -->
    <div v-show="tampilDetail">
      <p>{{ film.deskripsi }}</p>
    </div>
  </article>
</template>

<script setup>
import { ref, reactive } from 'vue'

const film = reactive({
  judul: 'Dune', poster: '/dune.jpg', rating: 8.2,
  genres: ['Sci-Fi', 'Drama'], deskripsi: '...'
})
const kataKunci = ref('')
const tampilDetail = ref(true)

function tutup() { tampilDetail.value = false }
</script>
```

```
Direktif yang dipakai:
{{ }} interpolasi · :src/:alt v-bind · v-if/else-if/else · v-for
v-model · @click v-on · v-show
→ Semua konsep Bab 4 dalam 1 komponen! 🎯
```

---

## 📊 4.14 Ringkasan Cepat Semua Direktif

| Direktif | Kapan Dipakai | Contoh |
| --- | --- | --- |
| `{{ }}` | Tampilkan teks | `{{ nama }}` |
| `v-bind` / `:` | Ikat atribut/class/style | `:src="url"` |
| `v-on` / `@` | Tangani event | `@click="fn"` |
| `v-if` | Tampilkan bila kondisi (elemen dicabut) | `v-if="x"` |
| `v-else-if` | Kondisi kedua | `v-else-if="y"` |
| `v-else` | Sisa kasus | `v-else` |
| `v-show` | Toggle tampilan (tetap DOM) | `v-show="z"` |
| `v-for` | Ulang list | `v-for="i in items"` |
| `v-model` | Dua arah form | `v-model="text"` |

---

## 🔍 4.15 Perbandingan `v-if` vs `v-show` (Ingat!)

| | `v-if` | `v-show` |
| --- | --- | --- |
| Cara kerja | Cabut/tambah DOM | `display:none` |
| Toggle cepat? | ❌ (render ulang) | ✅ |
| Render awal? | ✅ (kalau false) | ❌ (selalu render) |
| Cocok untuk | Jarang berubah | Sering berubah |

> 💡 Rumus: "Sering berubah? `v-show`. Jarang? `v-if`."

---

## 🧰 4.16 Modifier Lengkap yang Sering Dipakai

### `v-on` modifier

| Modifier | Efek |
| --- | --- |
| `.stop` | hentikan event bubbling |
| `.prevent` | batalkan default browser |
| `.once` | handler sekali saja |
| `.self` | hanya jika event di elemen ini |
| `.enter` / `.esc` | filter tombol |

### `v-model` modifier

| Modifier | Efek |
| --- | --- |
| `.lazy` | sync saat blur |
| `.number` | cast ke Number |
| `.trim` | hapus spasi pinggir |

---

## ✅ 4.17 Checklist Sebelum Lanjut

- [ ] Bisa tampilkan data dengan `{{ }}`
- [ ] Bisa ikat atribut dengan `:`
- [ ] Bisa tangani event dengan `@`
- [ ] Paham beda `v-if` vs `v-show`
- [ ] Selalu pakai `:key` di `v-for`
- [ ] Paham two-way binding `v-model`

```
Lengkap? Anda sudah menguasai "bahasa" Vue! 🎉
Di Bagian II kita buka REAKTIVITAS di baliknya.
```

---

## 🧠 4.18 Mental Model Tiap Direktif

Agar tidak bingung, ikatkan setiap direktif ke satu "tugas":

```
{{ }}     → "tampilkan ini"
:        → "hubungkan ini ke data"
@        → "saat ini terjadi, jalankan itu"
v-if     → "tampilkan BILA ini benar"
v-show   → "sembunyikan/tampilkan ini"
v-for    → "ulangi untuk setiap item"
v-model  → "ikat dua arah input ini"
```

> 💡 Satu kalimat per direktif = ingatan kuat.

---

## 🛠️ 4.19 Latihan Eksplorasi Direktif

Coba di project Anda:

1. Buat `Latihan.vue` dengan `{{ }}` menampilkan nama & umur.
2. Tambah `<img :src="url">` dengan url dari `ref`.
3. Tambah tombol `@click` yang mengubah teks via `v-if`.
4. Loop array 3 buah dengan `v-for` + `:key`.
5. Input `v-model` yang menampilkan apa yang diketik.

```
Lima langkah = semua direktif Bab 4 langsung dipraktekkan. 💪
```

---

## 🎯 4.20 Kesimpulan Template Syntax

Bab ini memberi Anda "bahasa" Vue. Dengan 6 direktif utama (+ `v-html` dll), Anda sudah bisa membangun UI interaktif apa pun.

```
{{ }} · : · @ · v-if · v-show · v-for · v-model
= peralatan harian setiap komponen Vue.
```

> 🎯 Di Bagian II, kita buka REAKTIVITAS — kekuatan tersembunyi di balik semua direktif ini.

---

## 🎬 4.21 Studi Kasus Lengkap: Halaman Login Netflix

Mari kita bangun form login lengkap yang menggabungkan `v-model`, `v-if`, `@submit.prevent`, dan validasi.

```vue
<!-- components/LoginForm.vue -->
<template>
  <form class="login" @submit.prevent="masuk">
    <h2>Sign In</h2>

    <!-- v-model: email -->
    <input
      v-model.trim="email"
      type="email"
      placeholder="Email atau nomor telepon"
    />

    <!-- v-model: password -->
    <input
      v-model="password"
      type="password"
      placeholder="Password"
    />

    <!-- v-model: checkbox -->
    <label>
      <input type="checkbox" v-model="ingat" /> Ingat saya
    </label>

    <!-- v-if: pesan error -->
    <p v-if="error" class="error">❌ {{ error }}</p>

    <!-- v-if: sukses -->
    <p v-else-if="sukses" class="sukses">✅ Selamat datang, {{ email }}!</p>

    <!-- :disabled via binding -->
    <button type="submit" :disabled="memproses">
      {{ memproses ? 'Memproses...' : 'Sign In' }}
    </button>

    <!-- v-show: bantuan -->
    <div v-show="tampilBantuan">
      <p>Lupa password? Hubungi admin.</p>
    </div>
    <button type="button" @click="tampilBantuan = !tampilBantuan">
      Bantuan
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

// State lewat v-model
const email = ref('')
const password = ref('')
const ingat = ref(false)

// State UI
const error = ref('')
const sukses = ref(false)
const memproses = ref(false)
const tampilBantuan = ref(false)

function masuk() {
  // Reset status
  error.value = ''
  sukses.value = false

  // Validasi sederhana
  if (!email.value.includes('@')) {
    error.value = 'Format email salah'
    return
  }
  if (password.value.length < 6) {
    error.value = 'Password minimal 6 karakter'
    return
  }

  memproses.value = true
  // Simulasi request API
  setTimeout(() => {
    memproses.value = false
    sukses.value = true
  }, 1200)
}
</script>

<style scoped>
.login { max-width: 320px; margin: 2rem auto; padding: 1.5rem; background: #222; }
input { display: block; width: 100%; margin: 0.5rem 0; padding: 0.6rem; }
button { margin-top: 0.5rem; padding: 0.6rem 1rem; }
.error { color: #e50914; }
.sukses { color: #46d369; }
</style>
```

**Peta direktif yang dipakai:**

| Bagian | Direktif | Fungsi |
| --- | --- | --- |
| Email/Password | `v-model` | Dua arah input |
| Checkbox | `v-model` | Boolean |
| Error | `v-if` | Tampil bila ada error |
| Sukses | `v-else-if` | Tampil bila sukses |
| Tombol | `:disabled` | Nonaktif saat memproses |
| Teks tombol | `{{ }}` | Tampil status |
| Submit | `@submit.prevent` | Cegah reload |
| Bantuan | `v-show` | Toggle bantuan |

> 🎯 **Pelajaran:** Satu form kecil menyatukan hampir semua direktif Bab 4. Kuasai ini, Anda kuasai template Vue.

---

## 🔬 4.22 Memahami `v-for` dengan Object & Range

Selain array, `v-for` bisa iterasi object dan angka:

```vue
<template>
  <!-- Iterasi object -->
  <p v-for="(nilai, kunci) in profil" :key="kunci">
    {{ kunci }}: {{ nilai }}
  </p>

  <!-- Iterasi range angka 1..5 (rating bintang) -->
  <span v-for="n in 5" :key="n">⭐</span>

  <!-- Dengan index -->
  <li v-for="(item, i) in list" :key="item.id">
    {{ i + 1 }}. {{ item.nama }}
  </li>
</template>

<script setup>
import { ref } from 'vue'
const profil = ref({ nama: 'Budi', umur: 25, kota: 'Jogja' })
const list = ref([{ id: 1, nama: 'A' }, { id: 2, nama: 'B' }])
</script>
```

| Sintaks | Hasil |
| --- | --- |
| `v-for="(v, k) in obj"` | `v`=nilai, `k`=key |
| `v-for="n in 5"` | `n`=1,2,3,4,5 |
| `v-for="(it, i) in arr"` | `i`=index (0-based) |

> ⚠️ Ingat: `:key` wajib unik. Untuk object pakai `kunci`, untuk range pakai `n`, untuk array pakai `item.id`.

---

## 🧩 4.23 Direktif `v-memo` & `v-cloak` (Lanjutan)

Dua direktif pembantu yang berguna:

```vue
<!-- v-memo: hindari re-render jika dependency tak berubah -->
<div v-memo="[hitungan]">
  <p>Bagian mahal: {{ hitungan }}</p>
</div>

<!-- v-cloak: sembunyikan hingga Vue siap (butuh CSS) -->
<div v-cloak>{{ data }}</div>
```

```css
/* Di global CSS */
[v-cloak] { display: none; }
```

| Direktif | Kapan |
| --- | --- |
| `v-memo` | Optimasi render list besar |
| `v-cloak` | Cegah "flash" `{{ }}` sebelum compile |

> 💡 Untuk pemula, `v-memo` jarang perlu. `v-cloak` berguna saat Vue dimuat via CDN (tanpa build tool).

---

## 📊 4.24 Tabel Referensi Cepat Seluruh Direktif

| Direktif | Bentuk Singkat | Tugas |
| --- | --- | --- |
| Interpolasi | `{{ }}` | Tampilkan teks |
| `v-bind` | `:` | Ikat atribut/class/style |
| `v-on` | `@` | Event handler |
| `v-if` | — | Kondisi (cabut DOM) |
| `v-else-if` | — | Kondisi lanjut |
| `v-else` | — | Sisa kondisi |
| `v-show` | — | Toggle display |
| `v-for` | — | Ulang list |
| `v-model` | — | Dua arah form |
| `v-html` | — | Render HTML (hati-hati) |
| `v-text` | — | Set teks |
| `v-once` | — | Render sekali |
| `v-pre` | — | Jangan compile |
| `v-cloak` | — | Sembunyi sebelum siap |
| `v-memo` | — | Optimasi render |

---

## ✅ 4.25 Verifikasi Penguasaan

Coba jawab tanpa melihat:

- Apa beda `v-if` dan `v-show`?
- Mengapa `:key` penting di `v-for`?
- Apa itu two-way binding?
- Bagaimana menulis event click singkat?
- Bagaimana mengikat class secara kondisional?

```
Bisa jawab 5/5? Anda menguasai template syntax Vue! 🏆
```

---

## 🧪 4.26 Eksperimen: Toggle dengan `v-if`/`v-else`

Contoh kecil menggabungkan `v-if`/`v-else` dan event:

```vue
<template>
  <div>
    <p v-if="login">Halo, {{ nama }}!</p>
    <p v-else>Silakan login dulu.</p>
    <button @click="login = !login">
      {{ login ? 'Logout' : 'Login' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const login = ref(false)
const nama = ref('Budi')
</script>
```

```
Klik tombol → login kebalik → tampilan berubah via v-if/v-else. ✅
```

---

## 🎯 4.27 Tips Produktif dengan Direktif

| Tips | Alasan |
| --- | --- |
| Selalu `:` bukan `v-bind:` | Lebih ringkas, standar ekosistem |
| Selalu `@` bukan `v-on:` | Sama |
| `:key` di setiap `v-for` | Cegah bug render |
| `.prevent` di form | Cegah reload tak diinginkan |
| `v-model.number` untuk angka | Tipe data benar |

> 💡 Kebiasaan kecil di atas menambah kualitas kode jangka panjang.

---

## 🏁 4.28 Bab 4 Tamat

Anda menguasai "bahasa" Vue: tampilkan data, ikat atribut, tangani event, bersyarat, ulang list, dan dua arah form.

```
Peralatan harian Anda:
{{ }} · : · @ · v-if/v-show · v-for · v-model
```

> 🎉 Selamat! Dengan 4 bab pertama, Anda sudah punya fondasi untuk membangun UI Vue apa pun. Di Bagian II, kita buka reaktivitas — kekuatan tersembunyi di balik semuanya.

---

## 📝 4.29 Narasi Template Syntax dalam Satu Cerita

Bayangkan template Vue sebagai panel kontrol:

```
{{ }}   = layar kecil yang menampilkan suhu
:       = kabel menghubungkan tombol ke lampu
@       = sensor mendeteksi sentuhan
v-if    = saklar memutus/menyambung listrik
v-for   = mesin cetak membuat 10 kartu nama
v-model = kabel dua arah (panel ↔ lampu sinkron)
```

Dengan panel kontrol ini, Anda mengendalikan seluruh tampilan secara presisi.

---

## 🎯 4.30 Kalimat Penutup Bab 4

> **"Template syntax adalah bahasa Vue; kuasai enam direktif utamanya, dan setiap komponen bisa Anda tulis."**

```
{{ }} · : · @ · v-if/v-show · v-for · v-model
= seluruh "kosakata" yang Anda butuhkan sehari-hari. 📝
```

---

## 📚 4.31 Glosarium & FAQ Template Syntax

Istilah penting bab ini:

| Istilah | Arti |
| --- | --- |
| **Interpolasi** | Menampilkan nilai via `{{ }}` |
| **Directive** | Instruksi `v-` (v-if, v-for, ...) |
| **Modifier** | Suffix titik (`.prevent`, `.number`) |
| **Two-way binding** | `v-model` — input & data sinkron |
| **Diffing** | Banding Virtual DOM lama vs baru |
| **Patching** | Update hanya DOM berubah |
| **Key** | Pengenal unik tiap item `v-for` |

**Q: Boleh pakai `{{ }}` di atribut?**
A: Tidak. Atribut butuh `v-bind` (`:`).

**Q: Apakah `v-model` cocok untuk semua input?**
A: Ya untuk input/textarea/select & komponen yang dukung model.

**Q: `v-if` vs `v-show` mana lebih cepat?**
A: `v-show` untuk toggle cepat; `v-if` untuk render awal ringan.

**Q: Mengapa `:key` jangan pakai index?**
A: Index berubah saat list diubah di tengah → bug render.

> 💡 Glosarium ini akan sangat membantu saat membaca dokumentasi resmi.

---

## 🎁 4.32 Pesan Penutup

Selamat! Anda telah menguasai "bahasa" Vue. Enam direktif utama yang Anda pelajari hari ini adalah kosakata yang akan Anda pakai di setiap komponen seumur hidup Anda sebagai developer Vue.

```
"Template yang bersih adalah cerminan pikiran yang terstruktur." 📝
```

Ini penutup Bagian I. Di Bagian II, kita membuka rahasia terbesar Vue: reaktivitas.

---

## 📌 4.33 Catatan Terakhir

Pengingat terakhir: direktif adalah alat, bukan tujuan. Tujuannya adalah pengalaman pengguna yang mulus. Gunakan direktif secukupnya, hindari overengineering, dan selalu utamakan kejelasan.

```
"Gunakan direktif untuk melayani pengguna, bukan untuk pamer." 📝
```

---

## 📎 4.34 Referensi & Bacaan

Tempat menggali template syntax lebih dalam:

| Topik | Sumber |
| --- | --- |
| Template syntax | vuejs.org/guide/essentials/template-syntax |
| Direktif | vuejs.org/guide/built-ins |
| Event handling | vuejs.org/guide/essentials/event-handling |
| Form input | vuejs.org/guide/essentials/forms |

> 💡 Dokumentasi resmi punya contoh interaktif untuk setiap direktif. Sangat disarankan dieksplorasi.

---

## 🚪 4.35 Sebelum Lanjut ke Bagian II

Lakukan hal berikut:

1. Buat komponen kecil dengan `{{ }}`, `:`, `@`, `v-if`.
2. Buat list dengan `v-for` + `:key`.
3. Buat input dengan `v-model` dan tampilkan hasilnya.
4. Bandingkan `v-if` vs `v-show` lewat eksperimen.

```
Siap? Di Bagian II kita buka REAKTIVITAS — otak di balik semua ini. 🚪
```

> 💡 Kuasai template syntax hari ini, maka Bab 5 (reaktivitas) akan terasa seperti penjelasan atas sesuatu yang sudah Anda rasakan.

---

## 💬 4.36 Kutipan untuk Diingat

> *"Make your templates read like sentences, and your bugs will be easier to find."* — prinsip template Vue

Template yang jelas bukan soal gaya, tapi soal keandalan. Direktif yang tepat membuat maksud kode terbaca sekilas.

```
Template jelas → maksud terbaca → bug mudah ditemukan. 📝
```

---

## 🧭 4.37 Latihan Observasi Direktif

Buka situs apa pun dan tebak direktif apa yang mungkin dipakai:

| Elemen | Kemungkinan Direktif |
| --- | --- |
| Teks profil | `{{ }}` |
| Gambar avatar | `:src` |
| Tombol like | `@click`, `v-if` |
| Daftar komentar | `v-for` |
| Kolom pencarian | `v-model` |

> 💡 Latihan ini melatih Anda "menerjemahkan" UI dunia nyata ke syntax Vue.

---

## 📝 Ringkasan Bab 4

| Direktif | Fungsi | Catatan |
| --- | --- | --- |
| `{{ }}` | Interpolasi teks | Ekspresi, bukan statement |
| `v-bind` / `:` | Ikat atribut HTML & class/style | Selalu `:` untuk dinamis |
| `v-on` / `@` | Tangani event | Modifier `.prevent`, `.stop`, `.enter` |
| `v-if` / `v-else-if` / `v-else` | Render bersyarat (elemen dicabut) | Harus berurutan |
| `v-show` | Toggle `display:none` | Cocok elemen sering berubah |
| `v-for` | Render list | **Wajib** `:key` unik (bukan index) |
| `v-model` | Two-way binding | text, checkbox, radio, select |
| `v-html` | Render HTML mentah | Awasi XSS |
| `v-once` / `v-pre` / `v-cloak` | Optimasi/render khusus | Pakai sesekali |

---

## 🎯 Latihan Mandiri

**⭐ Latihan 1 — Interpolasi & Binding**
Buat komponen yang menampilkan profil film: judul (`{{ }}`), poster (`:src`), dan badge "Baru" (`:class` kondisional) jika `isBaru` bernilai true. Deklarasikan minimal 3 variabel `ref` di script.

**⭐⭐ Latihan 2 — Event & Conditional**
Buat tombol "Tampilkan Rahasia" yang saat diklik memanggil method, lalu menampilkan teks rahasia dengan `v-if`. Tambahkan tombol kedua untuk menyembunyikannya kembali (toggle `v-if`/`v-else`).

**⭐⭐⭐ Latihan 3 — List dengan `v-for`**
Render daftar 5 film dari array `ref`. Setiap item menampilkan nomor urut (pakai `index`), judul, dan tahun. Berikan `:key` berbasis `id` film (bukan index).

**⭐⭐⭐⭐ Latihan 4 — Form dengan `v-model`**
Bangun form "Tambah Film" dengan field: judul (text), tahun (number via `.number`), genre (select), dan "Sudah ditonton?" (checkbox). Saat tombol "Simpan" diklik (`@click` atau `@submit.prevent`), validasi judul tidak kosong & tahun > 1888, lalu tampilkan ringkasan data yang diisi di bawah form menggunakan `{{ }}`.

---

*Lanjut ke ➡️ **BAGIAN II — Core Concepts Vue 3**, dimulai dari **Bab 5 — Reaktivitas Vue**, di mana kita membuka "jantung" Vue yang membuat semua direktif di atas bekerja secara otomatis dan efisien.*
