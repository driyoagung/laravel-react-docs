# 🎰 Bab 8 — Slots: Komponen yang Fleksibel

> *"Props menyerahkan data kepada komponen; slots menyerahkan ruang kosong yang bisa diisi sesukamu. Bagaikan sebuah bingkai foto: kau tak perlu tahu foto apa yang akan dipajang, cukup sediakan bingkainya yang indah — dan biarlah pemiliknya yang memasukkan kenangan."*

---

> **🧠 Apa Itu Slots?**
>
> Jika **props** menjawab *"bagaimana Child menerima **data**?"*, maka **slots** menjawab *"bagaimana Child menerima **konten/markup**?"*. Dengan slots, Parent tidak hanya mengirim nilai, tetapi menyuntikkan **struktur HTML/Components** ke dalam Child. Ini membuat komponen pembungkus (wrapper) seperti `Card`, `Modal`, `Layout`, atau `Button` menjadi sangat fleksibel — tampilan isinya sepenuhnya ditentukan Parent saat menggunakannya.

---

> **🏗️ Analogi Sederhana:**
>
> Bayangkan kamu membeli **kotak penyimpanan** (komponen Child). Kotak itu punya bentuk, bahan, dan tutup yang sudah jadi (tampilan & logika Child). Tapi isinya? Kamu yang menaruh — boleh buku, boleh mainan, boleh pakaian (konten dari Parent via slot). Kotak tidak peduli apa isinya; ia hanya menyediakan "ruang" (slot). Itulah slot: **ruang yang diisi oleh pengguna komponen**.

---

## 📋 Daftar Isi Bab 8

1. Masalah yang Diselesaikan Slots
2. Default Slot — Dasar
3. Fallback Content (Konten Cadangan)
4. Named Slots — Banyak Ruang
5. Scoped Slots — Child Mengirim Data Balik
6. Scoped Slots dengan Named Slots
7. Dynamic Slot Names
8. `v-slot` Shorthand (`#`)
9. Fungsi Render Slot & `$slots`
10. Perbandingan Props vs Slots
11. Studi Kasus — Modal Reusable
12. Jebakan Umum Pemula di Bab 8
13. Ringkasan & Latihan Mandiri

---

## 🤔 1. Masalah yang Diselesaikan Slots

Tanpa slot, untuk membuat komponen `Card` fleksibel, kamu mungkin tergoda pakai **banyak props**:

```vue
<!-- ❌ Pendekatan props untuk konten — kaku & verbose -->
<Card
  :title="'Profil'"
  :body="'Nama: Budi'"
  :footer="'© 2024'"
  :avatar="'/img/a.png'"
/>
<!-- Tiap variasi konten butuh prop baru → tidak scalable -->
```

Dengan **slot**, Parent menyuntikkan markup apa pun:

```vue
<!-- ✅ Pendekatan slot — fleksibel -->
<Card>
  <template #header>
    <h2>🎬 Film Populer</h2>
  </template>

  <MovieList :films="films" />   <!-- boleh komponen lain! -->

  <template #footer>
    <button>Lihat Semua</button>
  </template>
</Card>
```

> 💡 **Aturan Praktis:** Gunakan **props** untuk *data primitif* (string, number, boolean, object kecil). Gunakan **slots** untuk *konten kompleks* (banyak elemen, komponen lain, struktur HTML beragam).

---

## 📦 2. Default Slot — Dasar

Default slot adalah "ruang utama" tanpa nama. Apa pun yang kamu taruh di antara tag pembuka & penutup komponen akan masuk ke sana.

```vue
<!-- BaseCard.vue (Child) -->
<template>
  <div class="card">
    <!-- <slot /> adalah placeholder untuk konten dari parent -->
    <slot />
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  background: white;
}
</style>
```

```vue
<!-- Parent -->
<template>
  <BaseCard>
    <!-- Semua ini masuk ke <slot /> di dalam BaseCard -->
    <h3>Judul Kartu</h3>
    <p>Ini adalah isi kartu yang bisa berupa apapun.</p>
    <button>Klik Aku</button>
  </BaseCard>
</template>
```

**Cara kerja:** Vue mengambil "anak" dari `<BaseCard>` di parent dan **menanamkannya** ke posisi `<slot />` di child. Konten tersebut tetap menjadi bagian dari **parent's scope** (bisa akses data parent).

---

## 🪄 3. Fallback Content (Konten Cadangan)

Slot bisa punya konten default yang tampil **hanya jika parent tidak mengisi slot**.

```vue
<!-- BaseCard.vue -->
<template>
  <div class="card">
    <!-- Jika parent kosong, tampilkan "Tidak ada konten" -->
    <slot>
      <p class="kosong">Tidak ada konten 🤷</p>
    </slot>
  </div>
</template>
```

```vue
<!-- Parent A: tidak mengisi slot → pakai fallback -->
<BaseCard />                       <!-- tampil "Tidak ada konten 🤷" -->

<!-- Parent B: mengisi slot → fallback tertimpa -->
<BaseCard>
  <p>Halo ada isi!</p>
</BaseCard>
```

> 💡 **Kegunaan fallback:** Memberikan tampilan netral saat komponen dipakai tanpa konten, sehingga UI tidak tampak kosong/rusak.

---

## 🏷️ 4. Named Slots — Banyak Ruang

Kadang satu slot tidak cukup. Komponen seperti `Card` butuh header, body, footer terpisah. Gunakan **named slots** (`name="..."`).

```vue
<!-- BaseCard.vue -->
<template>
  <div class="card">
    <!-- Named slot: header -->
    <div class="card-header">
      <slot name="header">
        <h3>Judul Default</h3>   <!-- fallback -->
      </slot>
    </div>

    <!-- Default slot (tanpa nama) = body -->
    <div class="card-body">
      <slot />
    </div>

    <!-- Named slot: footer -->
    <div class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>
```

```vue
<!-- Parent: cara mengisi named slots -->
<template>
  <BaseCard>
    <!-- Isi named slot 'header' -->
    <template #header>
      <h2>🎬 Film Populer</h2>
    </template>

    <!-- Isi default slot (body) -->
    <MovieList :films="films" />

    <!-- Isi named slot 'footer' -->
    <template #footer>
      <button>Lihat Semua</button>
    </template>
  </BaseCard>
</template>
```

**Anatomi:**
- Di child: `<slot name="header" />` menandai ruang bernama `header`.
- Di parent: `<template #header>` menyuntikkan konten ke ruang itu.
- Default slot (tanpa `<template>`) masuk ke `<slot />` tanpa nama.

> 💡 **Shorthand `#`:** `#header` sama dengan `v-slot:header`. Untuk default slot, cukup tulis konten langsung tanpa `<template>`.

---

## 🔁 5. Scoped Slots — Child Mengirim Data Balik

Ini fitur **paling powerful** di slots. Kadang Parent butuh data yang hanya dimiliki Child (misal item dari list yang di-loop Child). **Scoped slot** memungkinkan Child mengirim data ke Parent lewat slot.

```vue
<!-- ListFilm.vue (Child yang meloop data sendiri) -->
<script setup>
defineProps({
  films: { type: Array, required: true },
})
</script>

<template>
  <ul>
    <!-- :film mengirim data tiap item ke parent via slot -->
    <li v-for="film in films" :key="film.id">
      <slot :film="film" :index="$index">
        <!-- fallback jika parent tidak pakai scoped -->
        {{ film.title }}
      </slot>
    </li>
  </ul>
</template>
```

```vue
<!-- Parent: terima data lewat slot props -->
<template>
  <ListFilm :films="films">
    <!-- 'film' & 'index' diterima sebagai variabel slot -->
    <template #default="slotProps">
      <strong>{{ slotProps.index + 1 }}. {{ slotProps.film.title }}</strong>
      <span>⭐ {{ slotProps.film.rating }}</span>
    </template>
  </ListFilm>

  <!-- Atau destructure langsung & pakai #default -->
  <ListFilm :films="films">
    <template #default="{ film, index }">
      <div class="item">
        <img :src="film.poster" />
        <p>{{ film.title }}</p>
      </div>
    </template>
  </ListFilm>
</template>
```

**Cara kerja scoped slot:**
- Child menulis `<slot :namaData="nilai" />` → mengirim `namaData` ke parent.
- Parent menulis `<template #default="{ namaData }">` → menerima sebagai variabel lokal.
- Ini mirip **props tapi arahnya kebalik**: Child → Parent (melalui slot).

> 🎯 **Mengapa berguna?** Child menguasai *bagaimana* data di-loop (pagination, virtual scroll), tapi Parent menguasai *tampilan* tiap item. Kombinasi sempurna: logika di Child, presentasi di Parent.

---

## 🧩 6. Scoped Slots dengan Named Slots

Kamu bisa menggabungkan **named + scoped** slot sekaligus.

```vue
<!-- Table.vue (Child) -->
<template>
  <table>
    <thead>
      <slot name="header" :columns="columns" />
    </thead>
    <tbody>
      <tr v-for="(row, i) in rows" :key="i">
        <!-- default scoped slot per baris -->
        <slot :row="row" :index="i" />
      </tr>
    </tbody>
    <tfoot>
      <slot name="footer" :total="total" />
    </tfoot>
  </table>
</template>

<script setup>
defineProps({ rows: Array, columns: Array, total: Object })
</script>
```

```vue
<!-- Parent -->
<template>
  <Table :rows="users" :columns="cols" :total="totals">
    <!-- Named scoped: header -->
    <template #header="{ columns }">
      <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
    </template>

    <!-- Default scoped: tiap baris -->
    <template #default="{ row, index }">
      <td>{{ index + 1 }}</td>
      <td>{{ row.nama }}</td>
      <td>{{ row.email }}</td>
    </template>

    <!-- Named scoped: footer -->
    <template #footer="{ total }">
      <td colspan="3">Total: {{ total.count }} user</td>
    </template>
  </Table>
</template>
```

---

## 🔀 7. Dynamic Slot Names

Nama slot bisa **dinamis** menggunakan bracket `[...]`.

```vue
<!-- Parent -->
<template>
  <BaseLayout>
    <!-- nama slot dinamis dari variable -->
    <template #[namaSlot]>
      <p>Konten dinamis</p>
    </template>
  </BaseLayout>
</template>

<script setup>
import { ref } from 'vue'
const namaSlot = ref('header')   // bisa 'header' | 'footer' | 'sidebar'
</script>
```

> 💡 **Kegunaan:** Jarang untuk pemula, tapi berguna saat membuat komponen layout generik yang posisi slot-nya dikonfigurasi dari data.

---

## #️⃣ 8. `v-slot` Shorthand (`#`)

`v-slot:header` bisa disingkat `#header`. Berikut ringkasan:

```vue
<!-- Panjang -->
<template v-slot:header> ... </template>
<template v-slot:default="props"> ... </template>

<!-- Singkat -->
<template #header> ... </template>
<template #default="props"> ... </template>

<!-- Default slot bisa tanpa <template> jika hanya satu slot -->
<Child v-slot="props"> ... </Child>
```

| Penulisan | Arti |
| --- | --- |
| `<slot />` | Default slot di child |
| `<slot name="x" />` | Named slot di child |
| `<template #x>` | Isi slot bernama `x` di parent |
| `<template #default>` | Isi default slot di parent |
| `<template #default="{ a }">` | Default scoped slot, destructure `a` |
| `<Child v-slot="{ a }">` | Default scoped tanpa template pembungkus |

---

## 🔍 9. Fungsi Render Slot & `$slots`

Di `<script setup>`, kita bisa mengecek apakah parent mengisi slot tertentu via `useSlots()`.

```vue
<!-- Child -->
<script setup>
import { useSlots } from 'vue'

const slots = useSlots()

// Cek apakah parent mengisi slot 'header'
if (slots.header) {
  console.log('Parent memberikan header')
}

// Render slot secara manual (jarang, untuk kasus advanced)
// slots.default() mengembalikan VNode array
</script>

<template>
  <div v-if="slots.header" class="ada-header">
    <slot name="header" />
  </div>
  <slot />
</template>
```

> 💡 **`useSlots()`** berguna saat kamu ingin **kondisional** berdasarkan keberadaan slot (misal hanya tampilkan wrapper `header` jika memang ada isi). Tanpa ini, `<div class="header">` kosong akan tetap muncul.

---

## ⚖️ 10. Perbandingan Props vs Slots

| Aspek | `props` | `slots` |
| --- | --- | --- |
| **Mengirim** | Data (nilai) | Markup / komponen / struktur |
| **Arah** | Parent → Child | Konten Parent ditanam di Child |
| **Cocok untuk** | Data primitif & object | Konten kompleks & reusable UI |
| **Fleksibilitas tampilan** | Terbatas (child yg render) | Tinggi (parent yg render) |
| **Scoped data** | Child punya data | Child bisa kirim data balik (scoped slot) |
| **Contoh** | `<Card title="X" />` | `<Card>...konten bebas...</Card>` |

```vue
<!-- Kombinasi: props untuk konfigurasi, slot untuk konten -->
<Modal :is-open="buka" :title="judulModal">
  <template #default>
    <p>Konten bebas di sini</p>
  </template>
  <template #footer>
    <button>OK</button>
  </template>
</Modal>
```

---

## 🎬 11. Studi Kasus — Modal Reusable dengan Named Slots

Mari bangun `BaseModal` yang reusable untuk berbagai keperluan (trailer film, konfirmasi, form) hanya dengan mengganti isi slot.

```vue
<!-- BaseModal.vue -->
<script setup>
// Props mengontrol STATE, slot mengontrol KONTEN
const props = defineProps({
  isOpen:    { type: Boolean, default: false },
  title:     { type: String,  default: '' },
  size:      { type: String,  default: 'sedang' },   // 'kecil'|'sedang'|'besar'
})

const emit = defineEmits(['tutup'])

// Cek slot untuk render kondisional
import { useSlots } from 'vue'
const slots = useSlots()
</script>

<template>
  <!-- Teleport ke body agar modal di atas segalanya -->
  <Teleport to="body">
    <!-- v-if mengontrol visibility; @click.self tutup saat klik overlay -->
    <div
      v-if="isOpen"
      class="modal-overlay"
      @click.self="emit('tutup')"
    >
      <div class="modal-container" :class="`ukuran-${size}`">
        <!-- Header: pakai slot 'header' atau fallback title prop -->
        <div class="modal-header">
          <slot name="header">
            <h2>{{ title }}</h2>
          </slot>
          <button class="modal-close" @click="emit('tutup')">✕</button>
        </div>

        <!-- Body: default slot -->
        <div class="modal-body">
          <slot />
        </div>

        <!-- Footer: hanya tampil jika parent isi slot 'footer' -->
        <div v-if="slots.footer" class="modal-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}
.modal-container {
  background: white; border-radius: 12px;
  max-width: 90vw; max-height: 90vh; overflow: auto;
}
.ukuran-kecil  { width: 320px; }
.ukuran-sedang { width: 520px; }
.ukuran-besar  { width: 800px; }
.modal-header { display: flex; justify-content: space-between; padding: 16px; border-bottom: 1px solid #eee; }
.modal-body   { padding: 16px; }
.modal-footer { padding: 16px; border-top: 1px solid #eee; display: flex; gap: 8px; justify-content: flex-end; }
</style>
```

**Penggunaan 1 — Modal Trailer Film (scoped + named slots):**

```vue
<script setup>
import { ref } from 'vue'
import BaseModal from './BaseModal.vue'

const modalTerbuka = ref(false)
const filmDipilih  = ref({ title: 'Dune', trailer: 'https://youtube.com/embed/xxx' })
</script>

<template>
  <button @click="modalTerbuka = true">▶ Tonton Trailer</button>

  <BaseModal
    :is-open="modalTerbuka"
    @tutup="modalTerbuka = false"
    size="besar"
  >
    <template #header>
      <h2>🎬 {{ filmDipilih.title }}</h2>
    </template>

    <!-- default slot: embed video -->
    <iframe
      :src="filmDipilih.trailer"
      width="100%" height="400"
      allowfullscreen
    />

    <template #footer>
      <button @click="modalTerbuka = false">Tutup</button>
      <button @click="tambahWatchlist">➕ Watchlist</button>
    </template>
  </BaseModal>
</template>
```

**Penggunaan 2 — Modal Konfirmasi (isian berbeda, komponen SAMA):**

```vue
<template>
  <BaseModal :is-open="konfirmasiBuka" title="Hapus Item?" @tutup="batal">
    <p>Yakin ingin menghapus item ini? Tindakan tidak bisa dibatalkan.</p>
    <template #footer>
      <button @click="batal">Batal</button>
      <button @click="hapus">Ya, Hapus</button>
    </template>
  </BaseModal>
</template>
```

**Penggunaan 3 — Modal Form (named + default):**

```vue
<template>
  <BaseModal :is-open="formBuka" title="Tambah Film">
    <form @submit.prevent="simpan">
      <input v-model="namaFilm" placeholder="Nama film" />
      <input v-model="tahunFilm" type="number" placeholder="Tahun" />
    </form>
    <template #footer>
      <button type="submit" @click="simpan">Simpan</button>
    </template>
  </BaseModal>
</template>
```

> 🎯 **Pelajaran Studi Kasus:** Satu komponen `BaseModal` bisa dipakai untuk trailer, konfirmasi, maupun form — hanya **isi slot** yang berubah. Inilah kekuatan slots: komponen menjadi *truely reusable* tanpa props yang meledak jumlahnya.

---

## 🚨 12. Jebakan Umum Pemula di Bab 8

### ❌ Jebakan 1 — Lupa `<template>` untuk Named Slot

```vue
<!-- ❌ SALAH — konten langsung di luar template masuk ke DEFAULT slot -->
<BaseCard>
  <h2 #header>Judul</h2>     <!-- #header di elemen biasa TIDAK menuju named slot -->
  <p>Isi</p>
</BaseCard>

<!-- ✅ BENAR — pakai <template #header> -->
<BaseCard>
  <template #header><h2>Judul</h2></template>
  <p>Isi</p>
</BaseCard>
```

### ❌ Jebakan 2 — Mengira Scoped Slot Data Bisa Dipakai di Luar Slot

```vue
<!-- ❌ SALAH — 'film' hanya ada di dalam <template #default> -->
<ListFilm :films="films">
  <template #default="{ film }">
    <p>{{ film.title }}</p>
  </template>
  <p>{{ film.title }}</p>     <!-- ERROR: film tidak terdefinisi di sini -->
</ListFilm>
```

### ❌ Jebakan 3 — Default Slot vs Named Slot Tertukar

```vue
<!-- ❌ SALAH — jika child punya named slot, konten telanjang masuk DEFAULT -->
<!-- Kalau child tidak punya default slot, konten ini hilang! -->
<Card>
  <p>Ini masuk default slot</p>
  <template #header><h1>Judul</h1></template>
</Card>

<!-- Pastikan child punya <slot /> (default) agar konten telanjang tampil -->
```

### ❌ Jebakan 4 — Fallback Object/Array di Slot

```vue
<!-- ❌ SALAH — menaruh v-for di fallback tanpa key -->
<slot>
  <li v-for="x in items">{{ x }}</li>   <!-- warning: butuh :key -->
</slot>

<!-- ✅ BENAR -->
<slot>
  <li v-for="x in items" :key="x.id">{{ x.nama }}</li>
</slot>
```

### ❌ Jebakan 5 — Over-menggunakan Slot untuk Data Sederhana

```vue
<!-- ❌ Berlebihan — cukup pakai props -->
<Card>
  <template #title>{{ judul }}</template>   <!-- mending props :title -->
</Card>

<!-- ✅ Gunakan props untuk data simpel, slot untuk struktur kompleks -->
<Card :title="judul">
  <template #default>...konten kompleks...</template>
</Card>
```

---

## 🧱 13. Slot dengan Banyak Anak (Multiple Children di Default Slot)

Default slot bisa berisi **banyak elemen sekaligus** — Vue menggabungkannya semua ke `<slot />`.

```vue
<!-- Child: AlertBox.vue -->
<template>
  <div class="alert" :class="tipe">
    <span class="ikon">⚠️</span>
    <div class="konten">
      <slot />   <!-- semua anak di bawah masuk sini -->
    </div>
  </div>
</template>

<script setup>
defineProps({ tipe: { type: String, default: 'info' } })
</script>
```

```vue
<!-- Parent: bisa lebih dari 1 elemen -->
<template>
  <AlertBox tipe="error">
    <h3>Terjadi Kesalahan!</h3>      <!-- anak 1 -->
    <p>Detail error di sini.</p>     <!-- anak 2 -->
    <button>Coba Lagi</button>       <!-- anak 3 -->
  </AlertBox>
</template>
```

> 💡 **Semua anak** (h3, p, button) digabung dan ditanam ke posisi `<slot />`. Urutannya tetap sesuai parent.

---

## 🎭 14. Renderless Component Pattern (Logic via Scoped Slot)

Pola canggih: komponen yang **tidak merender UI sendiri**, melainkan memberikan **logic + state** lewat scoped slot agar parent yang merender tampilan.

```vue
<!-- MouseTracker.vue (renderless) -->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const x = ref(0)
const y = ref(0)

function update(e) { x.value = e.clientX; y.value = e.clientY }

onMounted(() => window.addEventListener('mousemove', update))
onUnmounted(() => window.removeEventListener('mousemove', update))
</script>

<template>
  <!-- tidak ada UI, hanya forward state lewat scoped slot -->
  <slot :x="x" :y="y" />
</template>
```

```vue
<!-- Parent: bebas tampilkanposisinya -->
<template>
  <MouseTracker v-slot="{ x, y }">
    <p>Posisi mouse: {{ x }}, {{ y }}</p>
    <div class="kursor" :style="{ left: x + 'px', top: y + 'px' }" />
  </MouseTracker>
</template>
```

**Keuntungan:** Logic (event listener + cleanup) di-reuse, tampilan sepenuhnya di tangan parent. Ini fondasi dari banyak library UI (misal `vueuse` composables).

---

## 🔀 15. Kombinasi Slot + Props + Teleport (Modal Kompleks)

Mari perkuat studi kasus modal dengan kombinasi ketiga fitur.

```vue
<!-- BaseModal.vue -->
<script setup>
const props = defineProps({
  modelValue: { type: Boolean, default: false },   // untuk v-model
  title:      { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue'])

function tutup() { emit('update:modelValue', false) }
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="modelValue" class="overlay" @click.self="tutup">
        <div class="modal">
          <header>
            <slot name="header">
              <h2>{{ title }}</h2>
            </slot>
            <button @click="tutup">✕</button>
          </header>

          <main>
            <slot :tutup="tutup" />   <!-- scoped: berikan fungsi tutup -->
          </main>

          <footer v-if="$slots.footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
```

```vue
<!-- Parent -->
<template>
  <BaseModal v-model="buka" title="Konfirmasi">
    <template #header><h2>🗑️ Hapus?</h2></template>

    <!-- pakai scoped slot untuk akses fungsi tutup -->
    <template #default="{ tutup }">
      <p>Yakin hapus item ini?</p>
      <button @click="tutup">Batal</button>
    </template>

    <template #footer>
      <button @click="hapus">Ya, Hapus</button>
    </template>
  </BaseModal>
</template>
```

> 🎯 **Pola komplit:** `v-model` (props+emit) untuk membuka/menutup, `named slots` untuk struktur, `scoped slot` untuk berbagi fungsi ke parent. Ini arsitektur modal profesional.

---

## 📊 16. Kapan Pakai Slot vs Props vs v-if (Cheat Sheet)

| Kamu butuh... | Gunakan |
| --- | --- |
| Tampilkan teks/data sederhana | `props` |
| Tampilkan struktur HTML beragam | `slot` (default/named) |
| Child beri data ke parent untuk render | `scoped slot` |
| Konten conditional sederhana | `v-if` di child |
| Komponen pembungkus fleksibel | `slot` + `props` untuk config |
| Logic reusable tanpa UI | Renderless + scoped slot |

---

## 🧪 17. Slot dengan `v-for` & Key yang Benar

Sering pemula lupa `:key` saat mengisi slot di loop.

```vue
<!-- ❌ SALAH — slot di v-for tanpa key -->
<MyList>
  <template v-for="item in items">
    <Row :data="item" />     <!-- warning: butuh :key -->
  </template>
</MyList>

<!-- ✅ BENAR -->
<MyList>
  <template v-for="item in items" :key="item.id">
    <Row :data="item" />
  </template>
</MyList>
```

> ⚠️ **Selalu `:key`** pada elemen di dalam `v-for`, termasuk saat mengisi slot. Tanpa key, Vue salah mengupdate DOM saat list berubah.

---

## 🎯 18. Latihan Pemahaman Cepat (Self-Test)

```
SOAL 1: Ingin Child menerima markup HTML bebas dari parent. Fitur?
JAWABAN: Default slot (<slot />).

SOAL 2: Child punya header & footer terpisah. Fitur?
JAWABAN: Named slots (<slot name="header"> + <template #header>).

SOAL 3: Parent butuh data tiap item dari Child yang meloop. Fitur?
JAWABAN: Scoped slot (<slot :item="x" /> + #default="{ item }").

SOAL 4: Fallback content tampil kapan?
JAWABAN: Saat parent TIDAK mengisi slot tersebut.
```

---

## 🎯 19. Fallthrough Attributes & Slot (inheritAttrs)

Ketika parent menulis atribut di komponen yang tidak dideklarasikan sebagai props, atribut itu "jatuh melalui" (fallthrough) ke elemen root child.

```vue
<!-- Child: Button.vue -->
<template>
  <!-- atribut class/id/style dari parent jatuh ke <button> ini -->
  <button class="btn">
    <slot />   <!-- konten dari parent -->
  </button>
</template>
```

```vue
<!-- Parent -->
<template>
  <!-- class="besar" jatuh ke <button> di child (gabung dgn .btn) -->
  <Button class="besar" id="submit-btn">Kirim</Button>
</template>
```

> 💡 **Kombinasi slot + fallthrough** membuat komponen seperti `<Button>` terasa seperti elemen HTML asli — bisa diberi class, id, event listener dari luar. Sangat ergonomis.

---

## 🧰 20. Pola Layout dengan Named Slots

Komponen layout halaman sangat cocok pakai named slots.

```vue
<!-- AppLayout.vue -->
<template>
  <div class="layout">
    <header class="topbar">
      <slot name="navbar">
        <DefaultNavbar />   <!-- fallback -->
      </slot>
    </header>

    <aside class="sidebar">
      <slot name="sidebar" />
    </aside>

    <main class="konten">
      <slot />   <!-- default: halaman utama -->
    </main>

    <footer class="footer">
      <slot name="footer">
        <p>© 2024 MyApp</p>
      </slot>
    </footer>
  </div>
</template>
```

```vue
<!-- Parent: halaman tertentu -->
<template>
  <AppLayout>
    <template #navbar><AdminNavbar /></template>
    <template #sidebar><MenuSamping /></template>

    <!-- default slot: isi halaman -->
    <h1>Dashboard Admin</h1>
    <p>Konten utama di sini...</p>

    <template #footer><CustomFooter /></template>
  </AppLayout>
</template>
```

> 🎯 **Keuntungan:** Satu layout konsisten dipakai di semua halaman, hanya isi slot yang berubah. Pola ini dipakai hampir semua framework UI.

---

## 🔄 21. Slot Function (Render Function Style)

Di level lanjut, slot sebenarnya adalah **function** yang mengembalikan VNode. `slots.default()` memanggilnya.

```vue
<script setup>
import { useSlots } from 'vue'

const slots = useSlots()

// slots.default adalah function → panggil untuk dapat konten
// slots.default() mengembalikan array VNode
function cekKonten() {
  if (slots.default) {
    const vnodes = slots.default()
    console.log('Jumlah node:', vnodes.length)
  }
}
</script>
```

> 💡 **Pemula tidak perlu sering pakai ini**, tapi paham bahwa slot = function membantu saat debugging atau membuat wrapper komponen generik tingkat lanjut.

---

## 📦 22. Contoh Lengkap: Card Komponen Produksi

Mari buat `BaseCard` yang "production-ready" dengan kombinasi named + scoped + fallback.

```vue
<!-- BaseCard.vue -->
<script setup>
import { useSlots } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'default' },  // default|outlined|filled
  hoverable: { type: Boolean, default: false },
})

const slots = useSlots()
const emit = defineEmits(['header-click'])
</script>

<template>
  <div
    class="base-card"
    :class="[`v-${variant}`, { hoverable }]"
  >
    <!-- Header: named + fallback + emit -->
    <div v-if="slots.header" class="card-header" @click="emit('header-click')">
      <slot name="header" />
    </div>

    <!-- Media: named optional -->
    <div v-if="slots.media" class="card-media">
      <slot name="media" />
    </div>

    <!-- Body: default + scoped (beri info variant ke parent) -->
    <div class="card-body">
      <slot :variant="variant" />
    </div>

    <!-- Footer: conditional -->
    <div v-if="slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.base-card { border-radius: 12px; padding: 16px; }
.v-default  { border: 1px solid #e5e7eb; }
.v-outlined{ border: 2px solid #6366f1; }
.v-filled  { background: #6366f1; color: white; }
.hoverable { transition: transform .2s; cursor: pointer; }
.hoverable:hover { transform: translateY(-4px); }
</style>
```

```vue
<!-- Penggunaan -->
<BaseCard variant="outlined" hoverable @header-click="buka">
  <template #header><h3>🎬 Film Populer</h3></template>
  <template #media><img src="poster.jpg" /></template>

  <!-- scoped slot menerima 'variant' -->
  <template #default="{ variant }">
    <p>Konten dengan style: {{ variant }}</p>
  </template>

  <template #footer><button>Lihat</button></template>
</BaseCard>
```

---

## 🆚 23. Slot vs Props vs v-if — Contoh Konkret

Misal kita buat komponen `Pengumuman`.

```vue
<!-- ❌ Terlalu kaku: semua via props -->
<Pengumuman
  :ikon="'⚠️'"
  :judul="'Perhatian'"
  :isi="'Server maintenance'"
  :aksi-label="'OK'"
/>
<!-- Tiap variasi butuh prop baru → tidak fleksibel -->

<!-- ✅ Fleksibel: slot untuk konten -->
<Pengumuman tipe="warning">
  <template #header><h3>⚠️ Perhatian</h3></template>
  <p>Server akan maintenance malam ini.</p>
  <template #footer><button>OK</button></template>
</Pengumuman>
<!-- Parent bebas isi apa saja -->
```

| Pendekatan | Fleksibilitas | Kerumitan |
| --- | --- | --- |
| Semua props | 🔴 Kaku | Tinggi (banyak prop) |
| Slot + sedikit props | 🟢 Fleksibel | Rendah |
| v-if di child | 🟡 Terbatas | Sedang |

---

## ✅ 24. Do's and Don'ts Slots

```
✅ LAKUKAN:
   • Gunakan default slot untuk konten utama komponen wrapper
   • Gunakan named slots untuk area terstruktur (header/body/footer)
   • Berikan fallback content yang netral
   • Gunakan scoped slot bila child punya data untuk tiap item
   • Cek $slots sebelum render wrapper kondisional

❌ HINDARI:
   • Menaruh data primitif sederhana sebagai slot (pakai props)
   • Lupa <template #nama> untuk named slot
   • Mengakses scoped slot data di luar <template> pembungkus
   • Over-engineering dengan slot untuk komponen sekali pakai sederhana
   • Menaruh v-for tanpa :key di dalam slot
```

### Tabel Cepat Kapan Gunakan Apa

| Situasi | Solusi |
| --- | --- |
| Kirim string/number/boolean ke child | `props` |
| Kirim struktur HTML kompleks | `default slot` |
| Kirim ke area spesifik (header/footer) | `named slot` |
| Child loop & parent atur tampilan tiap item | `scoped slot` |
| Komponen tanpa UI, hanya logic | Renderless + scoped slot |
| Layout halaman konsisten | `named slots` di layout |

---

## 🎁 25. Slot dengan Kondisi & `v-if` pada Slot

Kadang parent ingin menyuntikkan slot hanya jika kondisi tertentu. Cukup bungkus dengan `v-if` di parent.

```vue
<!-- Parent -->
<template>
  <BaseCard>
    <template #header v-if="tampilHeader">
      <h2>Judul Kondisional</h2>
    </template>

    <p>Konten utama selalu ada.</p>
  </BaseCard>
</template>
```

Di child, gunakan `useSlots()` untuk mengecek apakah slot diisi:

```vue
<script setup>
import { useSlots } from 'vue'
const slots = useSlots()

// Render wrapper header hanya jika parent memberikan slot header
</script>

<template>
  <div v-if="slots.header" class="header-wrap">
    <slot name="header" />
  </div>
</template>
```

> 💡 **Pola ini** mencegah elemen wrapper kosong muncul di DOM saat slot tidak diisi — menjaga markup tetap bersih.

---

## 🧩 26. Kombinasi Slot + `v-for` (List Kompleks)

Contoh nyata: tabel dengan header & baris yang diisi parent lewat slot.

```vue
<!-- DataTable.vue (Child) -->
<script setup>
defineProps({ baris: { type: Array, required: true } })
</script>

<template>
  <table class="tabel">
    <thead>
      <slot name="header" />
    </thead>
    <tbody>
      <tr v-for="(baris, i) in baris" :key="i">
        <!-- scoped slot: beri tiap baris ke parent -->
        <slot :baris="baris" :index="i" />
      </tr>
    </tbody>
  </table>
</template>
```

```vue
<!-- Parent -->
<template>
  <DataTable :baris="users">
    <template #header>
      <th>Nama</th><th>Email</th><th>Aksi</th>
    </template>

    <template #default="{ baris, index }">
      <td>{{ baris.nama }}</td>
      <td>{{ baris.email }}</td>
      <td><button @click="hapus(index)">Hapus</button></td>
    </template>
  </DataTable>
</template>
```

> 🎯 **Keuntungan:** Child menguasai struktur tabel & looping; parent menguasai isi tiap sel. Separasi tanggung jawab yang ideal.

---

## 📖 27. Glosarium Slots

| Istilah | Arti |
| --- | --- |
| **Slot** | Ruang di child yang diisi konten dari parent |
| **Default slot** | `<slot />` diisi konten telanjang parent |
| **Named slot** | `<slot name="x" />` diisi `<template #x>` |
| **Fallback** | Konten cadangan jika slot tidak diisi |
| **Scoped slot** | Child kirim data ke parent via `<slot :data="x" />` |
| **`#` shorthand** | `#header` = `v-slot:header` |
| **Dynamic name** | `<template #[nama]>` untuk nama slot dinamis |
| **`useSlots`** | Cek slot mana yang diisi parent (`slots.header`) |
| **Renderless** | Komponen tanpa UI, hanya beri logic via scoped slot |
| **Fallthrough** | Atribut tidak terdeklarasi jatuh ke elemen root child |

---

## 🔭 28. Melihat ke Depan

Slots melengkapi props untuk membuat komponen benar-benar reusable:

- **Bab 9 (Lifecycle):** Saat menggunakan slot yang berisi komponen lain, ingat lifecycle child dalam slot tetap berjalan normal (mount/unmount sesuai visibility).
- **Bab 15 (Template Refs):** Bisa mengakses elemen dalam slot lewat ref (advanced).
- **Project Netflix:** `BaseModal`, `BaseCard`, `Navbar` semua memakai slot secara intensif.

> 💡 **Filosofi:** Props menjawab "apa datanya", Slots menjawab "apa isinya". Kombinasikan keduanya untuk komponen yang tangguh.

---

## 🎯 29. Quiz Singkat Slots

```
1. Default slot ditandai dengan? → <slot /> (tanpa name).
2. Named slot "header" diisi parent dengan? → <template #header>.
3. Scoped slot berguna untuk? → child kirim data ke parent per item.
4. Fallback content tampil kapan? → saat parent tidak mengisi slot.
5. #header adalah shorthand dari? → v-slot:header.
6. useSlots() dipakai untuk? → cek slot mana yang diisi parent.
7. Renderless component artinya? → tanpa UI, hanya logic via scoped slot.
8. Kapan pakai props vs slot? → data primitif=props, konten kompleks=slot.
9. Dynamic slot name ditulis? → <template #[nama]>.
10. Fallthrough attribute jatuh ke? → elemen root child.
```

---

## 🪗 30. Contoh Mini: Accordion dengan Named Slots

Contoh penggunaan named slot untuk membuat komponen accordion yang fleksibel.

```vue
<!-- AccordionItem.vue -->
<script setup>
import { ref } from 'vue'

const props = defineProps({ buka: { type: Boolean, default: false } })
const isOpen = ref(props.buka)
</script>

<template>
  <div class="accordion-item">
    <button class="acc-header" @click="isOpen = !isOpen">
      <!-- header slot, dengan indikator -->
      <slot name="header" />
      <span class="indikator">{{ isOpen ? '▼' : '▶' }}</span>
    </button>

    <div v-show="isOpen" class="acc-body">
      <slot />   <!-- default slot: isi yang bisa disembunyikan -->
    </div>
  </div>
</template>

<style scoped>
.accordion-item { border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 8px; }
.acc-header { width: 100%; display: flex; justify-content: space-between; padding: 12px; cursor: pointer; }
.acc-body { padding: 12px; }
</style>
```

```vue
<!-- Parent -->
<template>
  <AccordionItem :buka="true">
    <template #header><h3>🎬 Apa itu Netflix?</h3></template>
    <p>Netflix adalah layanan streaming film dan serial.</p>
  </AccordionItem>

  <AccordionItem>
    <template #header><h3>📺 Cara berlangganan?</h3></template>
    <p>Kunjungi situs resmi dan pilih paket.</p>
  </AccordionItem>
</template>
```

> 🎯 **Pelajaran:** `AccordionItem` mengontrol *kapan* isi tampil (state `isOpen`), tapi *apa* isinya sepenuhnya ditentukan parent via slot. Komponen reusable untuk FAQ, menu, dll.

---

## 📝 Ringkasan Bab 8

| Konsep | Penjelasan |
| --- | --- |
| **Slot** | Ruang di child yang diisi konten dari parent |
| **Default slot** | `<slot />` diisi konten telanjang parent |
| **Fallback content** | Konten cadangan jika slot kosong |
| **Named slots** | `<slot name="x" />` diisi `<template #x>` |
| **Shorthand `#`** | `#header` = `v-slot:header` |
| **Scoped slot** | Child kirim data ke parent: `<slot :data="x" />` → `#default="{ data }"` |
| **Dynamic name** | `<template #[nama]>` untuk nama slot dinamis |
| **`useSlots()`** | Cek slot mana yang diisi parent (`slots.header`) |
| **Props vs Slots** | Props = data; Slots = konten/markup |
| **`Teleport`** | Pindahkan modal ke `body` (sering dipakai bareng slot) |
| **Kapan slot** | Komponen wrapper fleksibel (Card, Modal, Layout, Table) |

---

## 🎯 Latihan Mandiri

**⭐ Latihan 1 — Card dengan Default Slot**
Buat `Kotak` dengan `<slot />` ber-styling kartu. Di parent, isi dengan teks & tombol bebas. Tambahkan fallback "Kosong" saat tidak diisi.

**⭐⭐ Latihan 2 — Panel dengan Named Slots**
Buat `Panel` memiliki named slot `header`, default (body), dan `footer`. Di parent buat 3 panel berbeda (Profil, Pengaturan, Bantuan) dengan isi masing-masing.

**⭐⭐⭐ Latihan 3 — List dengan Scoped Slot**
Buat `DaftarUser` yang menerima prop `users` (array `{ nama, email, aktif }`) dan meloop di child, mengirim tiap `user` via scoped slot. Di parent, tampilkan tiap user dengan gaya bebas (badge aktif/nonaktif).

**⭐⭐⭐⭐ Latihan 4 — Modal + Form Reusable (Integrasi)**
Buat `BaseModal` (seperti studi kasus) dengan named slot `header`/`default`/`footer` + props `isOpen`. Lalu buat `FormTambahFilm` yang menggunakan `BaseModal` untuk menampilkan form (nama, tahun, genre) di default slot, tombol simpan di footer. Parent mengelola state `isOpen` & data form, serta menambahkan film ke daftar saat disimpan. Kombinasikan props, emits, dan slots.

---

*Lanjut ke ➡️ **Bab 9 — 🔄 Lifecycle Hooks***
