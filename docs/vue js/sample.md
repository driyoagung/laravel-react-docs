# 🧩 Bab 3 — Komponen: Membangun UI Modular

> *“Jika JSX adalah bata dan semen, maka komponen adalah ruangan yang kamu bangun dari bata-bata itu. Dan dari ruangan-ruangan itulah sebuah rumah berdiri.”*
> 

---

> **🧠 Apa Itu Komponen?**
> 
> 
> Komponen adalah **blok bangunan dasar** dari setiap aplikasi React. Secara teknis, komponen
> adalah sebuah **fungsi JavaScript** yang menerima input (disebut **props**) dan mengembalikan
> tampilan UI dalam bentuk JSX. Setiap bagian dari antarmuka — tombol, kartu, navbar, sidebar,
> bahkan seluruh halaman — adalah sebuah komponen.
> 
> Filosofi inti React adalah: **“Pecah UI yang kompleks menjadi komponen-komponen kecil yang
> independen dan bisa digunakan ulang.”** Inilah yang membuat aplikasi React mudah dikembangkan,
> mudah diuji, dan mudah dirawat seiring bertumbuhnya ukuran aplikasi.
> 

---

> **🏗️ Analogi Sederhana:**
> 
> 
> Bayangkan kamu sedang membangun sebuah mobil. Alih-alih membangun mobil sebagai satu bongkahan
> logam raksasa, para insinyur membangunnya dari **komponen-komponen terpisah**: mesin, roda,
> setir, kursi, dashboard, lampu. Setiap komponen didesain, diuji, dan disempurnakan secara
> independen. Jika ban bocor, kamu hanya perlu mengganti ban — bukan seluruh mobil.
> 
> Itulah cara kerja komponen React. Jika ada bug di tombol “Tambah ke Keranjang”, kamu hanya
> perlu memperbaiki komponen `TombolKeranjang` — tanpa menyentuh komponen `Navbar`, `Footer`,
> atau `HalamanUtama`.
> 

---

## 📋 Daftar Isi Bab 3

1. Anatomi Sebuah Komponen
2. Functional Component vs Class Component
3. Props — Memberi Data ke Komponen
4. Props Children — Slot Konten
5. Default Props — Nilai Cadangan
6. Komponen Bersarang (Nested Components)
7. Memecah Komponen — Kapan dan Bagaimana
8. Struktur Folder yang Baik
9. Pola Komponen yang Sering Digunakan
10. Studi Kasus — Membangun UI Dari Nol
11. Jebakan Umum Pemula
12. Ringkasan & Latihan

---

## 🔬 Anatomi Sebuah Komponen

Mari kita bedah sebuah komponen React secara menyeluruh, bagian per bagian.

```jsx
// ─────────────────────────────────────────────────────────────
// BAGIAN 1: IMPORT
// Semua yang dibutuhkan komponen ini diimpor di bagian paling atas
// ─────────────────────────────────────────────────────────────
import { useState } from 'react';      // Hook dari React
import './KartuProduk.css';            // File CSS khusus komponen ini
import GambarDefault from './assets/default.png'; // Aset gambar

// ─────────────────────────────────────────────────────────────
// BAGIAN 2: DEFINISI KOMPONEN
// Sebuah fungsi JavaScript dengan nama berawalan huruf KAPITAL
// Menerima satu parameter: objek props (biasanya di-destructure)
// ─────────────────────────────────────────────────────────────
function KartuProduk({ nama, harga, gambar, stok, onTambahKeranjang }) {
  //                   ↑ Destructuring props langsung di parameter

  // ─────────────────────────────────────────────────────────
  // BAGIAN 3: LOGIKA & STATE (jika ada)
  // Variabel, fungsi helper, hooks — semuanya di sini
  // SEBELUM bagian return
  // ─────────────────────────────────────────────────────────
  const [jumlah, setJumlah] = useState(1); // State jumlah yang dipilih

  const stokHabis   = stok === 0;
  const formatRupiah = (angka) => 'Rp ' + angka.toLocaleString('id-ID');
  const totalHarga   = harga * jumlah;

  function handleTambah() {
    // Validasi sebelum memanggil fungsi dari parent
    if (jumlah > stok) {
      alert(`Stok hanya tersisa${stok} unit!`);
      return;
    }
    onTambahKeranjang({ nama, harga, jumlah }); // Panggil fungsi dari props
  }

  // ─────────────────────────────────────────────────────────
  // BAGIAN 4: RETURN — Tampilan yang dikembalikan (JSX)
  // Selalu satu elemen root
  // ─────────────────────────────────────────────────────────
  return (
    <div className={`kartu-produk${stokHabis ? 'kartu-nonaktif' : ''}`}>

      {/* Gambar produk — fallback ke gambar default jika tidak ada */}
      <img
        src={gambar || GambarDefault}
        alt={`Foto${nama}`}
        className="kartu-gambar"
      />

      <div className="kartu-body">
        <h3 className="kartu-nama">{nama}</h3>
        <p className="kartu-harga">{formatRupiah(harga)}</p>

        {/* Badge stok */}
        <span className={`badge-stok${stokHabis ? 'badge-merah' : 'badge-hijau'}`}>
          {stokHabis ? 'Stok Habis' : `Stok:${stok}`}
        </span>

        {/* Kontrol jumlah — hanya tampil jika stok ada */}
        {!stokHabis && (
          <div className="kontrol-jumlah">
            <button onClick={() => setJumlah(Math.max(1, jumlah - 1))}>−</button>
            <span>{jumlah}</span>
            <button onClick={() => setJumlah(Math.min(stok, jumlah + 1))}>+</button>
          </div>
        )}

        {/* Tampilkan total jika jumlah > 1 */}
        {jumlah > 1 && (
          <p className="total-harga">Total: {formatRupiah(totalHarga)}</p>
        )}

        <button
          className="tombol-keranjang"
          onClick={handleTambah}
          disabled={stokHabis}
          // disabled menjadikan tombol tidak bisa diklik
        >
          {stokHabis ? 'Tidak Tersedia' : '🛒 Tambah ke Keranjang'}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BAGIAN 5: EXPORT
// Wajib agar komponen bisa digunakan di file lain
// ─────────────────────────────────────────────────────────────
export default KartuProduk;
```

**Ringkasan anatomi komponen:**

```
Komponen React = Import + Fungsi (Logika + Return JSX) + Export
```

---

## ⚖️ Functional Component vs Class Component

React memiliki dua cara mendefinisikan komponen. Kamu perlu memahami keduanya agar tidak bingung saat membaca kode lama.

### 📋 Perbandingan Langsung — Komponen Identik, Dua Cara

```jsx
// ════════════════════════════════════════════
// CARA LAMA: Class Component
// Digunakan sebelum React 16.8 (2019)
// ════════════════════════════════════════════
import { Component } from 'react';

class Penghitung extends Component {
  // State harus didefinisikan di constructor
  constructor(props) {
    super(props);           // Wajib memanggil super(props)
    this.state = {
      angka: 0,             // State awal
    };
    // Method event handler harus di-bind di constructor
    // agar 'this' merujuk ke class instance yang benar
    this.tambah = this.tambah.bind(this);
  }

  // Method untuk mengubah state
  tambah() {
    // setState() digunakan untuk mengubah state di class component
    this.setState({ angka: this.state.angka + 1 });
  }

  // Method render() wajib ada — mengembalikan JSX
  render() {
    return (
      <div>
        <p>Angka: {this.state.angka}</p>
        {/* Akses state dengan this.state.xxx */}
        {/* Akses props dengan this.props.xxx */}
        <p>Label: {this.props.label}</p>
        <button onClick={this.tambah}>Tambah</button>
      </div>
    );
  }
}

export default Penghitung;
```

```jsx
// ════════════════════════════════════════════
// CARA MODERN: Functional Component + Hooks
// Standar sejak React 16.8 (2019) — gunakan ini
// ════════════════════════════════════════════
import { useState } from 'react';

function Penghitung({ label }) {
  // useState menggantikan this.state dan this.setState
  const [angka, setAngka] = useState(0);

  // Arrow function — tidak perlu .bind(this)
  const tambah = () => setAngka(angka + 1);

  // Tidak ada method render() — langsung return JSX
  return (
    <div>
      <p>Angka: {angka}</p>
      <p>Label: {label}</p>
      <button onClick={tambah}>Tambah</button>
    </div>
  );
}

export default Penghitung;
```

### 📊 Perbandingan Fitur

| Aspek | Class Component | Functional Component |
| --- | --- | --- |
| **Sintaks** | Lebih verbose, perlu `extends Component` | Lebih ringkas, cukup fungsi biasa |
| **State** | `this.state` dan `this.setState()` | `useState()` hook |
| **Lifecycle** | `componentDidMount`, `componentDidUpdate`, dll | `useEffect()` hook |
| **`this`** | Wajib, sering membingungkan | Tidak perlu `this` sama sekali |
| **Performa** | Sedikit lebih lambat | Sedikit lebih cepat |
| **Rekomendasi** | ❌ Tidak direkomendasikan untuk kode baru | ✅ Standar modern — gunakan selalu |
| **Hooks** | Tidak bisa menggunakan Hooks | Bisa menggunakan semua Hooks |

> 💡 **Catatan Penting — Mengapa Masih Perlu Tahu Class Component?**
> 
> 
> Meskipun functional component adalah standar modern, kamu **tetap perlu mengenal** class
> component karena:
> 1. Banyak **project lama** (legacy codebase) masih menggunakannya.
> 2. Banyak **tutorial dan dokumentasi lama** di internet menggunakannya.
> 3. Ada satu kasus di mana class component masih diperlukan: **Error Boundary** (komponen
> khusus untuk menangkap error) yang belum punya padanan Hooks-nya.
> 
> Untuk semua kode baru yang kamu tulis, selalu gunakan **functional component**.
> 

---

## 🎁 Props — Memberi Data ke Komponen

Props (singkatan dari *properties*) adalah cara komponen menerima data dari luar — dari komponen induknya (parent). Props bekerja seperti **parameter fungsi**: parent mengirim data, komponen menerimanya dan menggunakannya untuk merender tampilan.

### 📌 Aturan Fundamental Props

```
Props bersifat READ-ONLY.
Komponen TIDAK BOLEH mengubah props yang diterimanya.
```

```jsx
function Tombol({ label, warna }) {
  // ❌ JANGAN PERNAH mengubah props!
  warna = 'red';    // Ini melanggar aturan React
  label = label.toUpperCase(); // Ini juga tidak boleh

  // ✅ Jika perlu nilai turunan, buat variabel baru
  const labelBesar = label.toUpperCase(); // Variabel baru — tidak mengubah props

  return<button style={{ backgroundColor: warna }}>{labelBesar}</button>;
}
```

> 💡 **Catatan Penting — Mengapa Props Harus Read-Only?**
> 
> 
> Ini adalah salah satu prinsip terpenting React: **aliran data searah (one-way data flow)**.
> Data mengalir dari parent ke child melalui props, tidak pernah sebaliknya. Jika child
> diizinkan mengubah props, akan sangat sulit melacak dari mana perubahan data berasal —
> terutama di aplikasi yang kompleks. Jika child perlu “memberi tahu” parent tentang sesuatu,
> caranya adalah melalui **fungsi callback** yang dikirimkan sebagai props (akan dibahas di Bab 6).
> 

---

### 📌 Mengirim Berbagai Tipe Data sebagai Props

```jsx
// ── KOMPONEN PENERIMA ─────────────────────────────────────────
function ContohSembarangProps({
  // String
  nama,
  // Number
  umur,
  // Boolean
  aktif,
  // Array
  hobi,
  // Object
  alamat,
  // Function
  onKlik,
  // JSX / React Element
  ikon,
}) {
  return (
    <div>
      <p>Nama: {nama}</p>
      <p>Umur: {umur} tahun</p>
      <p>Status: {aktif ? 'Aktif' : 'Nonaktif'}</p>
      <p>Hobi: {hobi.join(', ')}</p>
      <p>Kota: {alamat.kota}, {alamat.provinsi}</p>
      <button onClick={onKlik}>Klik</button>
      <span>{ikon}</span>
    </div>
  );
}

// ── KOMPONEN PENGIRIM (PARENT) ────────────────────────────────
function App() {
  const dataUser = {
    nama: 'Budi Santoso',
    kota: 'Yogyakarta',
    provinsi: 'DIY',
  };

  return (
    <ContohSembarangProps
      nama="Budi Santoso"               // String — pakai tanda kutip
      umur={25}                         // Number — pakai kurung kurawal
      aktif={true}                      // Boolean — pakai kurung kurawal
      aktif                             // Shorthand untuk aktif={true} — sama saja!
      hobi={['Coding', 'Gaming', 'Membaca']}  // Array
      alamat={{ kota: 'Yogyakarta', provinsi: 'DIY' }}  // Object literal
      alamat={dataUser}                 // Atau kirim variabel object
      onKlik={() => alert('Diklik!')}   // Function (arrow function)
      ikon={<span>⭐</span>}           // JSX element
    />
  );
}
```

---

### 📌 Destructuring Props — Dua Cara

```jsx
// ── CARA 1: Destructuring di Parameter (Direkomendasikan) ──────
// Lebih ringkas, langsung terlihat props apa yang dibutuhkan komponen
function KartuUser({ nama, email, peran }) {
  return (
    <div>
      <h3>{nama}</h3>
      <p>{email}</p>
      <span>{peran}</span>
    </div>
  );
}

// ── CARA 2: Destructuring di Dalam Fungsi ─────────────────────
// Berguna jika perlu akses ke objek props asli juga
function KartuUser(props) {
  // props adalah objek: { nama: '...', email: '...', peran: '...' }
  const { nama, email, peran } = props;

  return (
    <div>
      <h3>{nama}</h3>
      <p>{email}</p>
      <span>{peran}</span>
    </div>
  );
}

// ── CARA 3: Tanpa Destructuring (Hindari ini) ─────────────────
// Lebih verbose, setiap akses perlu menulis props.xxx
function KartuUser(props) {
  return (
    <div>
      <h3>{props.nama}</h3>       {/* Harus tulis props.xxx setiap kali */}
      <p>{props.email}</p>
      <span>{props.peran}</span>
    </div>
  );
}

// ── SPREAD PROPS — Meneruskan Semua Props ke Komponen Lain ────
// Berguna untuk membuat komponen "wrapper"
function TombolPrimer({ label, ...sisaProps }) {
  // label diambil, sisanya dikumpulkan di ...sisaProps
  return (
    <button
      {...sisaProps}             // Teruskan semua props lain ke <button>
      className="tombol-primer"  // Tambahkan className khusus
    >
      {label}
    </button>
  );
}

// Penggunaan:
// <TombolPrimer label="Simpan" onClick={handleSimpan} disabled={isLoading} type="submit" />
// onClick, disabled, type → masuk ke ...sisaProps → diteruskan ke <button>
```

---

## 👶 Props Children — Slot Konten

`children` adalah props spesial yang secara otomatis berisi apapun yang kamu taruh **di antara tag pembuka dan penutup** sebuah komponen. Ini memungkinkan kamu membuat komponen “pembungkus” yang fleksibel.

```jsx
// ── KOMPONEN YANG MENERIMA CHILDREN ───────────────────────────

// Contoh 1: Komponen Kartu generik
function Kartu({ judul, children, footer }) {
  return (
    <div className="kartu">
      {/* Header kartu */}
      {judul && (
        <div className="kartu-header">
          <h3>{judul}</h3>
        </div>
      )}

      {/* Body kartu — berisi apapun yang dikirim sebagai children */}
      <div className="kartu-body">
        {children}
        {/* children bisa berupa teks, elemen JSX, atau bahkan komponen lain */}
      </div>

      {/* Footer opsional */}
      {footer && (
        <div className="kartu-footer">
          {footer}
        </div>
      )}
    </div>
  );
}

// Contoh 2: Komponen Modal
function Modal({ judul, children, onTutup }) {
  return (
    // Overlay gelap di belakang modal
    <div
      className="overlay"
      onClick={onTutup}   // Klik overlay → tutup modal
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {/* Kotak modal — hentikan propagasi klik agar overlay tidak menutup */}
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{ background: 'white', borderRadius: '12px', padding: '24px', maxWidth: '500px', width: '90%' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ margin: 0 }}>{judul}</h2>
          <button onClick={onTutup} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        {/* Konten modal — dikirim sebagai children */}
        {children}
      </div>
    </div>
  );
}

// ── CARA PENGGUNAAN CHILDREN ───────────────────────────────────
function App() {
  return (
    <div>
      {/* Children berupa teks sederhana */}
      <Kartu judul="Catatan Harian">
        Ini adalah isi kartu. Apapun bisa diletakkan di sini.
      </Kartu>

      {/* Children berupa elemen JSX */}
      <Kartu judul="Profil Saya" footer={<button>Edit Profil</button>}>
        <img src="foto.jpg" alt="Foto" style={{ borderRadius: '50%', width: 80 }} />
        <h4>Budi Santoso</h4>
        <p>Frontend Developer di Yogyakarta</p>
      </Kartu>

      {/* Children berupa komponen lain */}
      <Kartu judul="Daftar Tugas">
        <DaftarTugas />         {/* Komponen di dalam komponen */}
        <TombolTambahTugas />   {/* Bisa lebih dari satu */}
      </Kartu>

      {/* Modal dengan form di dalamnya */}
      <Modal judul="Tambah Produk Baru" onTutup={() => console.log('ditutup')}>
        <p>Isi form di bawah untuk menambahkan produk baru.</p>
        <input type="text" placeholder="Nama produk" style={{ display: 'block', width: '100%', marginBottom: 8 }} />
        <input type="number" placeholder="Harga" style={{ display: 'block', width: '100%', marginBottom: 16 }} />
        <button>Simpan Produk</button>
      </Modal>
    </div>
  );
}
```

> 💡 **Catatan Penting — Kekuatan `children`**
> 
> 
> Props `children` adalah kunci untuk membuat komponen yang benar-benar **fleksibel dan
> reusable**. Bayangkan komponen `Kartu` atau `Modal` di atas — mereka tidak perlu tahu
> apa yang ada di dalamnya. Apapun yang kamu taruh di antara tag pembuka dan penutup,
> itulah yang akan ditampilkan. Pola ini disebut **“Composition”** dan merupakan salah
> satu pola paling penting di React.
> 

---

## 🔧 Default Props — Nilai Cadangan

Default props adalah nilai yang digunakan komponen ketika props tertentu tidak dikirimkan oleh parent. Ini membuat komponen lebih aman dan lebih mudah digunakan.

### 📌 Cara Modern — Default Value di Parameter

```jsx
// ── CARA TERBAIK: Default value langsung di destructuring ─────
function KartuPengguna({
  nama     = 'Pengguna Anonim',    // Jika nama tidak dikirim, gunakan ini
  peran    = 'Member',             // Jika peran tidak dikirim, gunakan ini
  aktif    = false,                // Jika aktif tidak dikirim, gunakan false
  foto     = '/img/avatar.png',    // URL gambar default
  maxTampil = 5,                   // Number default
}) {
  return (
    <div className={`kartu${aktif ? 'aktif' : 'nonaktif'}`}>
      <img src={foto} alt={`Foto${nama}`} />
      <h3>{nama}</h3>
      <p>Peran: {peran}</p>
      <p>Status: {aktif ? '🟢 Aktif' : '🔴 Nonaktif'}</p>
    </div>
  );
}

// Penggunaan:
<KartuPengguna nama="Budi" aktif={true} />
// peran → 'Member' (default)
// foto  → '/img/avatar.png' (default)

<KartuPengguna />
// nama  → 'Pengguna Anonim' (default)
// peran → 'Member' (default)
// aktif → false (default)
// foto  → '/img/avatar.png' (default)
```

---

### 📌 Hati-hati dengan Default Props dan Falsy Values

```jsx
// ⚠️ JEBAKAN: Default value dengan 0 atau string kosong
function Produk({
  stok = 10,      // Default 10
  nama = 'Tanpa Nama',
}) {
  return<p>{nama}: {stok} unit</p>;
}

// Penggunaan:
<Produk stok={0} />
// stok akan menjadi 0 — BUKAN 10!
// Karena 0 adalah nilai valid yang dikirim, bukan "tidak dikirim"
// Default value hanya aktif jika props TIDAK dikirim (undefined)
// Props dengan nilai 0, false, '', null TIDAK mengaktifkan default

<Produk />
// stok = 10 (default aktif karena props tidak dikirim = undefined)

// ✅ Bedakan antara "tidak dikirim" (undefined) vs "dikirim 0":
function Produk({ stok = 10 }) {
  console.log(stok); // undefined → 10 (default) | 0 → 0 (dikirim)
}
```

---

### 📌 Default Props dengan Object dan Array

```jsx
// ⚠️ HATI-HATI dengan object/array sebagai default value
function DaftarItem({ items = [] }) {
  // ✅ Ini aman — [] dibuat sekali saat definisi fungsi
  // Tapi di React ada nuansa penting...
  return<ul>{items.map((item, i) => <li key={i}>{item}</li>)}</ul>;
}

// ✅ Cara yang lebih eksplisit dan aman untuk default object/array:
const DEFAULT_ITEMS = [];   // Konstanta di luar komponen — referensi stabil

function DaftarItem({ items = DEFAULT_ITEMS }) {
  return<ul>{items.map((item, i) => <li key={i}>{item}</li>)}</ul>;
}
```

---

## 🪆 Komponen Bersarang (Nested Components)

Komponen React dirancang untuk **digunakan di dalam komponen lain** — membentuk hierarki seperti pohon. Hierarki inilah yang React sebut sebagai **Component Tree**.

### 🌳 Memahami Component Tree

```
App                    ← Root (akar) — komponen paling atas
├── Navbar             ← Child dari App
│   ├── Logo
│   ├── MenuNavigasi
│   │   ├── MenuLink ("Beranda")
│   │   ├── MenuLink ("Produk")
│   │   └── MenuLink ("Kontak")
│   └── TombolLogin
│
├── HalamanUtama       ← Child dari App
│   ├── Banner
│   ├── SeksiProdukUnggulan
│   │   ├── KartuProduk
│   │   ├── KartuProduk
│   │   └── KartuProduk
│   └── SeksiBlog
│       ├── KartuArtikel
│       └── KartuArtikel
│
└── Footer             ← Child dari App
    ├── InfoPerusahaan
    └── LinkSosial
```

### 💻 Contoh Component Tree Sederhana

```jsx
// Komponen paling kecil (atom)
function Logo({ teks }) {
  return (
    <div style={{ fontWeight: 'bold', fontSize: '24px', color: '#4f46e5' }}>
      ⚛️ {teks}
    </div>
  );
}

// Komponen kecil (atom)
function MenuLink({ href, label, aktif }) {
  return (
    <a
      href={href}
      style={{
        marginLeft: '20px',
        color: aktif ? '#4f46e5' : '#374151',
        fontWeight: aktif ? '600' : '400',
        textDecoration: 'none',
      }}
    >
      {label}
    </a>
  );
}

// Komponen menengah (molecule) — terdiri dari beberapa atom
function Navbar({ halamanAktif }) {
  const menuItems = [
    { href: '/', label: 'Beranda' },
    { href: '/produk', label: 'Produk' },
    { href: '/tentang', label: 'Tentang' },
    { href: '/kontak', label: 'Kontak' },
  ];

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 24px',
      borderBottom: '1px solid #e5e7eb',
      backgroundColor: 'white',
    }}>
      {/* Komponen Logo digunakan di dalam Navbar */}
      <Logo teks="ReactStore" />

      {/* Render menu dari array */}
      <div>
        {menuItems.map((item) => (
          <MenuLink
            key={item.href}
            href={item.href}
            label={item.label}
            aktif={halamanAktif === item.href}
          />
        ))}
      </div>

      <button style={{ padding: '8px 20px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
        Masuk
      </button>
    </nav>
  );
}

// Komponen atom untuk kartu produk
function KartuProduk({ nama, harga, gambar }) {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', width: '200px' }}>
      <img src={gambar} alt={nama} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
      <div style={{ padding: '12px' }}>
        <h4 style={{ margin: '0 0 4px' }}>{nama}</h4>
        <p style={{ margin: 0, color: '#4f46e5', fontWeight: '600' }}>
          Rp {harga.toLocaleString('id-ID')}
        </p>
      </div>
    </div>
  );
}

// Komponen menengah — seksi produk unggulan
function SeksiProduk({ produk }) {
  return (
    <section style={{ padding: '40px 24px' }}>
      <h2 style={{ marginBottom: '24px' }}>🔥 Produk Unggulan</h2>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {produk.map((item) => (
          // KartuProduk digunakan berulang kali dengan data berbeda
          <KartuProduk
            key={item.id}
            nama={item.nama}
            harga={item.harga}
            gambar={item.gambar}
          />
        ))}
      </div>
    </section>
  );
}

// Komponen Footer
function Footer() {
  return (
    <footer style={{ padding: '24px', backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb', textAlign: 'center', color: '#6b7280' }}>
      <p>© 2024 ReactStore. Dibangun dengan ❤️ menggunakan React.</p>
    </footer>
  );
}

// ── KOMPONEN ROOT: App ─────────────────────────────────────────
// Menyatukan semua komponen menjadi satu halaman utuh
function App() {
  const produkUnggulan = [
    { id: 1, nama: 'Laptop Pro', harga: 18000000, gambar: 'https://via.placeholder.com/200x150' },
    { id: 2, nama: 'Mouse Ergonomis', harga: 450000, gambar: 'https://via.placeholder.com/200x150' },
    { id: 3, nama: 'Keyboard Mekanikal', harga: 950000, gambar: 'https://via.placeholder.com/200x150' },
  ];

  return (
    // Fragment karena App mengembalikan lebih dari satu elemen sejajar
    <>
      <Navbar halamanAktif="/" />
      <SeksiProduk produk={produkUnggulan} />
      <Footer />
    </>
  );
}

export default App;
```

---

## ✂️ Memecah Komponen — Kapan dan Bagaimana

Salah satu skill terpenting dalam React adalah mengetahui **kapan harus memecah sebuah komponen** menjadi komponen-komponen yang lebih kecil. Tidak ada aturan yang kaku, tapi ada panduan yang bisa diikuti.

### 🚦 Sinyal Bahwa Komponen Perlu Dipecah

```jsx
// ❌ KOMPONEN YANG TERLALU BESAR — Susah dibaca dan di-maintain
function HalamanProduk({ produk, user }) {
  return (
    <div>
      {/* Navbar */}
      <nav>
        <div>{/* Logo */}</div>
        <ul>
          <li><a href="/">Beranda</a></li>
          <li><a href="/produk">Produk</a></li>
        </ul>
        <div>{/* User avatar */}</div>
      </nav>

      {/* Filter */}
      <div>
        <input type="text" placeholder="Cari produk..." />
        <select>
          <option>Semua Kategori</option>
          <option>Elektronik</option>
        </select>
        <div>
          <label>Harga:</label>
          <input type="range" />
        </div>
      </div>

      {/* Grid Produk */}
      <div>
        {produk.map((item) => (
          <div key={item.id}>
            <img src={item.gambar} alt={item.nama} />
            <h3>{item.nama}</h3>
            <p>Rp {item.harga.toLocaleString('id-ID')}</p>
            <div>
              {[1,2,3,4,5].map((bintang) => (
                <span key={bintang}>{bintang <= item.rating ? '⭐' : '☆'}</span>
              ))}
            </div>
            <button>Tambah ke Keranjang</button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer>
        <p>© 2024 ReactStore</p>
        <div>{/* Link-link footer */}</div>
      </footer>
    </div>
  );
  // Masalah:
  // - Komponen ini terlalu panjang (100+ baris return)
  // - Susah untuk menemukan bagian tertentu
  // - Tidak bisa digunakan ulang bagian-bagiannya
  // - Jika ada bug di rating bintang, harus mencari di tengah kode panjang
}
```

```jsx
// ✅ SETELAH DIPECAH — Setiap komponen punya tanggung jawab yang jelas

// Komponen Rating Bintang — bisa digunakan di mana saja
function RatingBintang({ nilai, maksimal = 5 }) {
  return (
    <div aria-label={`Rating${nilai} dari${maksimal}`}>
      {Array.from({ length: maksimal }, (_, i) => (
        <span key={i}>{i < nilai ? '⭐' : '☆'}</span>
      ))}
    </div>
  );
}

// Kartu satu produk
function KartuProduk({ produk, onTambahKeranjang }) {
  return (
    <div className="kartu-produk">
      <img src={produk.gambar} alt={produk.nama} />
      <h3>{produk.nama}</h3>
      <p>Rp {produk.harga.toLocaleString('id-ID')}</p>
      <RatingBintang nilai={produk.rating} />  {/* Komponen rating digunakan di sini */}
      <button onClick={() => onTambahKeranjang(produk)}>
        Tambah ke Keranjang
      </button>
    </div>
  );
}

// Panel filter
function PanelFilter({ onCari, onFilterKategori, onFilterHarga }) {
  return (
    <div className="panel-filter">
      <input type="text" placeholder="Cari produk..." onChange={(e) => onCari(e.target.value)} />
      <select onChange={(e) => onFilterKategori(e.target.value)}>
        <option value="">Semua Kategori</option>
        <option value="elektronik">Elektronik</option>
      </select>
    </div>
  );
}

// Grid produk
function GridProduk({ produk, onTambahKeranjang }) {
  if (produk.length === 0) {
    return<p className="pesan-kosong">Tidak ada produk yang ditemukan.</p>;
  }

  return (
    <div className="grid-produk">
      {produk.map((item) => (
        <KartuProduk
          key={item.id}
          produk={item}
          onTambahKeranjang={onTambahKeranjang}
        />
      ))}
    </div>
  );
}

// Halaman Produk — sekarang jauh lebih bersih dan mudah dibaca
function HalamanProduk({ produk, user }) {
  return (
    <div>
      <Navbar user={user} />
      <PanelFilter
        onCari={(keyword) => console.log('Cari:', keyword)}
        onFilterKategori={(kat) => console.log('Filter:', kat)}
      />
      <GridProduk
        produk={produk}
        onTambahKeranjang={(produk) => console.log('Tambah:', produk)}
      />
      <Footer />
    </div>
  );
  // Sekarang: setiap baris return menjelaskan satu tanggung jawab
  // Jika ada bug di rating → cari di komponen RatingBintang
  // Jika ada bug di filter → cari di komponen PanelFilter
}
```

### 📏 Panduan Kapan Harus Memecah Komponen

```
Pecah komponen jika:
✂️ Fungsi return-nya lebih dari 50-80 baris JSX
✂️ Ada bagian yang digunakan (atau berpotensi digunakan) di lebih dari satu tempat
✂️ Ada bagian dengan logika yang cukup kompleks dan independen
✂️ Ada bagian yang bisa memiliki state-nya sendiri

Jangan pecah jika:
🔗 Pemecahan justru membuat kode lebih sulit dibaca
🔗 Komponen baru hanya akan digunakan di satu tempat dan sangat sederhana
🔗 Komponen baru membutuhkan terlalu banyak props yang diteruskan (prop drilling)
```

---

## 📁 Struktur Folder Project yang Baik

Saat project berkembang, cara mengorganisasi file menjadi sangat penting. Berikut adalah dua pendekatan yang paling umum digunakan.

### 📂 Struktur Berdasarkan Tipe File (Untuk Project Kecil)

```
src/
├── components/          ← Semua komponen UI
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── KartuProduk.jsx
│   ├── KartuArtikel.jsx
│   ├── Modal.jsx
│   └── Tombol.jsx
│
├── pages/               ← Komponen halaman (satu per rute)
│   ├── Beranda.jsx
│   ├── HalamanProduk.jsx
│   ├── DetailProduk.jsx
│   └── HalamanKontak.jsx
│
├── hooks/               ← Custom hooks (dibahas di bab lanjutan)
│   ├── useFetch.js
│   └── useLocalStorage.js
│
├── utils/               ← Fungsi helper/utility
│   ├── formatRupiah.js
│   └── validasiForm.js
│
├── assets/              ← Gambar, ikon, font
│   ├── logo.svg
│   └── gambar-hero.jpg
│
├── App.jsx
└── main.jsx
```

---

### 📂 Struktur Berdasarkan Fitur (Untuk Project Menengah-Besar)

```
src/
├── features/
│   ├── produk/                   ← Semua yang berkaitan dengan fitur Produk
│   │   ├── components/
│   │   │   ├── KartuProduk.jsx
│   │   │   ├── GridProduk.jsx
│   │   │   └── PanelFilter.jsx
│   │   ├── hooks/
│   │   │   └── useProduk.js
│   │   ├── utils/
│   │   │   └── filterProduk.js
│   │   └── index.js              ← "Barrel file" — export semua dari satu tempat
│   │
│   ├── keranjang/                ← Semua yang berkaitan dengan fitur Keranjang
│   │   ├── components/
│   │   │   ├── ItemKeranjang.jsx
│   │   │   └── RingkasanBelanja.jsx
│   │   └── index.js
│   │
│   └── auth/                     ← Semua yang berkaitan dengan Autentikasi
│       ├── components/
│       │   ├── FormLogin.jsx
│       │   └── FormRegister.jsx
│       └── index.js
│
├── shared/                       ← Komponen yang digunakan di banyak fitur
│   ├── components/
│   │   ├── Tombol.jsx
│   │   ├── Modal.jsx
│   │   ├── Kartu.jsx
│   │   └── Loading.jsx
│   └── utils/
│       └── formatAngka.js
│
├── App.jsx
└── main.jsx
```

> 💡 **Catatan Penting — Tidak Ada Struktur yang “Paling Benar”**
> 
> 
> Struktur folder yang ideal bergantung pada ukuran dan kompleksitas project. Untuk project
> latihan dan belajar, struktur berdasarkan tipe file sudah lebih dari cukup. Untuk project
> yang lebih besar dengan tim, struktur berdasarkan fitur lebih mudah di-scale dan di-maintain.
> Yang terpenting: **konsisten** dengan satu pendekatan di seluruh project.
> 

---

### 📄 Konvensi Penamaan File

```
Komponen React   → PascalCase.jsx    → KartuProduk.jsx, HalamanUtama.jsx
Hooks            → camelCase.js      → useFetch.js, useAuth.js
Utilities        → camelCase.js      → formatRupiah.js, validasiEmail.js
CSS Modules      → NamaKomponen.module.css → KartuProduk.module.css
File index       → index.js/jsx      → index.js (barrel file)
Konstanta        → SCREAMING_SNAKE   → API_URL, MAX_ITEM (di file .js biasa)
```

---

## 🎯 Pola Komponen yang Sering Digunakan

Berikut adalah beberapa pola desain komponen yang sangat sering kamu temui di dunia nyata.

### 🎯 Pola 1 — Presentational vs Container Component

```jsx
// ── PRESENTATIONAL COMPONENT ──────────────────────────────────
// Hanya peduli tampilan. Tidak tahu data dari mana asalnya.
// Menerima semua data via props. Mudah di-test dan di-reuse.
function DaftarPengguna({ pengguna, onHapus, onEdit }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Nama</th><th>Email</th><th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        {pengguna.map((user) => (
          <tr key={user.id}>
            <td>{user.nama}</td>
            <td>{user.email}</td>
            <td>
              <button onClick={() => onEdit(user)}>Edit</button>
              <button onClick={() => onHapus(user.id)}>Hapus</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ── CONTAINER COMPONENT ───────────────────────────────────────
// Peduli logika dan data. Mengambil data, lalu meneruskan ke presentational.
function HalamanPengguna() {
  const [pengguna, setPengguna] = useState([
    { id: 1, nama: 'Budi', email: 'budi@mail.com' },
    { id: 2, nama: 'Ani', email: 'ani@mail.com' },
  ]);

  const handleHapus = (id) => {
    setPengguna(pengguna.filter((u) => u.id !== id));
  };

  const handleEdit = (user) => {
    console.log('Edit user:', user);
  };

  // Container meneruskan data dan handler ke presentational
  return (
    <DaftarPengguna
      pengguna={pengguna}
      onHapus={handleHapus}
      onEdit={handleEdit}
    />
  );
}
```

---

### 🎯 Pola 2 — Komponen dengan Loading & Error State

```jsx
// Pola umum saat mengambil data dari API
function DaftarArtikel({ artikels, isLoading, error }) {
  // State 1: Sedang loading
  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>⏳ Memuat artikel...</p>
      </div>
    );
  }

  // State 2: Ada error
  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#dc2626' }}>
        <p>❌ Gagal memuat artikel: {error}</p>
        <button onClick={() => window.location.reload()}>Coba Lagi</button>
      </div>
    );
  }

  // State 3: Data kosong
  if (artikels.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
        <p>📭 Belum ada artikel yang dipublikasikan.</p>
      </div>
    );
  }

  // State 4: Data tersedia — tampilkan normal
  return (
    <div className="grid-artikel">
      {artikels.map((artikel) => (
        <KartuArtikel key={artikel.id} artikel={artikel} />
      ))}
    </div>
  );
}
```

---

### 🎯 Pola 3 — Komponen UI Generik yang Dapat Dikustomisasi

```jsx
// Komponen Tombol yang sangat fleksibel
function Tombol({
  children,
  varian = 'primer',       // 'primer' | 'sekunder' | 'bahaya' | 'hantu'
  ukuran = 'sedang',       // 'kecil' | 'sedang' | 'besar'
  fullWidth = false,
  isLoading = false,
  disabled = false,
  leftIcon,                // Ikon di kiri teks
  rightIcon,               // Ikon di kanan teks
  onClick,
  ...props                 // Prop HTML lainnya (type, aria-label, dll)
}) {
  // Style berdasarkan varian
  const styleVarian = {
    primer:   { backgroundColor: '#4f46e5', color: 'white', border: 'none' },
    sekunder: { backgroundColor: 'white', color: '#4f46e5', border: '1px solid #4f46e5' },
    bahaya:   { backgroundColor: '#dc2626', color: 'white', border: 'none' },
    hantu:    { backgroundColor: 'transparent', color: '#374151', border: '1px solid #d1d5db' },
  };

  // Style berdasarkan ukuran
  const styleUkuran = {
    kecil:  { padding: '6px 12px', fontSize: '13px' },
    sedang: { padding: '10px 20px', fontSize: '15px' },
    besar:  { padding: '14px 28px', fontSize: '17px' },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      style={{
        ...styleVarian[varian],    // Spread style varian
        ...styleUkuran[ukuran],    // Spread style ukuran
        width: fullWidth ? '100%' : 'auto',
        borderRadius: '8px',
        cursor: (disabled || isLoading) ? 'not-allowed' : 'pointer',
        opacity: (disabled || isLoading) ? 0.6 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: '500',
        transition: 'opacity 0.2s',
      }}
      {...props}   // Teruskan props lain (type, aria-label, dll)
    >
      {/* Ikon kiri */}
      {leftIcon &&<span>{leftIcon}</span>}

      {/* Teks berubah saat loading */}
      {isLoading ? '⏳ Memproses...' : children}

      {/* Ikon kanan */}
      {rightIcon && !isLoading &&<span>{rightIcon}</span>}
    </button>
  );
}

// Penggunaan:
// <Tombol varian="primer" onClick={handleSimpan}>Simpan</Tombol>
// <Tombol varian="bahaya" ukuran="kecil" onClick={handleHapus}>Hapus</Tombol>
// <Tombol varian="sekunder" isLoading={sedangMenyimpan} fullWidth>Daftar</Tombol>
// <Tombol leftIcon="📧" varian="hantu">Kirim Email</Tombol>
```

---

## 🏗️ Studi Kasus — Membangun Halaman Artikel dari Nol

Sekarang mari kita gabungkan semua konsep bab ini — anatomi komponen, props, children, nested components, dan pemecahan komponen — dalam satu studi kasus yang realistis.

**Skenario:** Membangun halaman blog sederhana dengan komponen yang terstruktur baik.

**Yang kamu pelajari dari studi kasus ini:**
- Hierarki komponen 4 level: Atom → Molecule → Organism → Page.
- Komponen kecil (`Badge`, `Avatar`, `StatAngka`) yang bisa digunakan ulang di banyak tempat.
- Pemisahan data, logika filter, dan tampilan ke komponen yang berbeda.
- Modal yang dikendalikan dari parent menggunakan state dan callback.
- Props yang opsional (`onTutup`, `artikel`) dengan penanganan yang aman.

---

## 🚨 Jebakan Umum Pemula di Bab 3

### ❌ Jebakan 1 — Mendefinisikan Komponen di Dalam Komponen

```jsx
// ❌ SANGAT SALAH — Komponen didefinisikan di dalam komponen lain
function App() {
  // ⚠️ KartuItem DIBUAT ULANG setiap kali App re-render
  // React menganggapnya sebagai komponen BARU setiap render
  // Ini menyebabkan React unmount dan mount ulang KartuItem setiap render
  // → State di dalam KartuItem akan hilang setiap re-render
  // → Performa sangat buruk
  function KartuItem({ nama }) {
    return<div>{nama}</div>;
  }

  return<KartuItem nama="Laptop" />;
}

// ✅ BENAR — Definisikan komponen di LUAR komponen lain
function KartuItem({ nama }) {
  return<div>{nama}</div>;
}

function App() {
  return<KartuItem nama="Laptop" />;
}
```

---

### ❌ Jebakan 2 — Memodifikasi Props Langsung

```jsx
// ❌ SALAH — Mengubah props adalah pelanggaran serius
function KartuUser({ user }) {
  user.nama = user.nama.toUpperCase(); // Mutasi props!
  user.aktif = true;                   // Mutasi props!
  return<div>{user.nama}</div>;
}

// ✅ BENAR — Buat variabel baru, jangan sentuh props
function KartuUser({ user }) {
  const namaDisplay = user.nama.toUpperCase();  // Variabel baru
  const statusAktif = user.aktif || false;       // Variabel baru dengan fallback
  return<div>{namaDisplay} — {statusAktif ? 'Aktif' : 'Nonaktif'}</div>;
}
```

---

### ❌ Jebakan 3 — Terlalu Banyak Props (Prop Drilling)

```jsx
// ❌ MASALAH — Props diteruskan melalui banyak komponen yang tidak membutuhkannya
function App() {
  const user = { nama: 'Budi', avatar: '...' };
  return<HalamanUtama user={user} />;
}

function HalamanUtama({ user }) {
  return<Konten user={user} />;   // HalamanUtama hanya meneruskan, tidak pakai
}

function Konten({ user }) {
  return<Sidebar user={user} />;  // Konten hanya meneruskan, tidak pakai
}

function Sidebar({ user }) {
  return<ProfilSingkat user={user} />;  // Sidebar hanya meneruskan, tidak pakai
}

function ProfilSingkat({ user }) {
  return<img src={user.avatar} alt={user.nama} />; // Akhirnya dipakai di sini
}

// ✅ SOLUSI JANGKA PENDEK — Restruktur agar komponen yang butuh dekat dengan sumber data
// ✅ SOLUSI JANGKA PANJANG — Gunakan Context API (dibahas di bab lanjutan)
```

---

### ❌ Jebakan 4 — Nama Komponen Tidak Konsisten

```jsx
// ❌ SALAH — Berbagai format penamaan yang tidak konsisten
function kartu_produk() { ... }     // snake_case
function kartuProduk() { ... }      // camelCase
const Kartu_Produk = () => { ... }; // Mixed

// ✅ BENAR — Selalu gunakan PascalCase untuk komponen React
function KartuProduk() { ... }      // PascalCase ✅
const KartuProduk = () => { ... };  // PascalCase ✅ (arrow function component)
```

---

### ❌ Jebakan 5 — Komponen Terlalu Besar vs Terlalu Kecil

```jsx
// ❌ TERLALU BESAR — Satu komponen melakukan segalanya (God Component)
function Segalanya() {
  // 500+ baris kode
  // Menangani auth, data fetching, filtering, rendering, animasi...
}

// ❌ TERLALU KECIL — Komponen yang tidak ada gunanya
function TeksNama({ nama }) {
  return<span>{nama}</span>;  // Terlalu trivial untuk jadi komponen
}

// ✅ TEPAT — Komponen yang punya satu tanggung jawab yang jelas
function KartuArtikel({ artikel, onKlik }) {
  // ~30-60 baris, hanya bertanggung jawab menampilkan satu kartu artikel
}
```

---

## 📝 Ringkasan Bab 3

| Konsep | Penjelasan |
| --- | --- |
| **Komponen** | Fungsi JS yang menerima props dan mengembalikan JSX — blok bangunan UI |
| **Anatomi Komponen** | Import → Fungsi (Logika + Return JSX) → Export |
| **Functional Component** | Standar modern — selalu gunakan ini untuk kode baru |
| **Class Component** | Cara lama — kenali untuk membaca kode legacy, tidak perlu untuk kode baru |
| **Props** | Data yang dikirim dari parent ke child — bersifat read-only |
| **Destructuring Props** | `function Komponen({ nama, umur })` — cara paling rapi menerima props |
| **Children** | Props spesial berisi konten di antara tag buka-tutup komponen |
| **Default Props** | Nilai default menggunakan parameter default: `function Btn({ warna = 'biru' })` |
| **Component Tree** | Hierarki komponen bersarang — dari root (App) hingga atom terkecil |
| **Pemecahan Komponen** | Pecah jika: terlalu panjang, dipakai ulang, atau punya logika independen |
| **One-way Data Flow** | Data mengalir dari parent ke child via props — tidak bisa sebaliknya |
| **Prop Drilling** | Masalah ketika props diteruskan melalui banyak level — solusi: Context API |

---

## 🎯 Latihan Mandiri

**⭐ Latihan 1 — Komponen Kartu Profil**

Buat komponen `KartuAnggotaTim` yang menerima props: `nama`, `jabatan`, `departemen`, `email`, dan `aktif` (boolean). Tampilkan informasi tersebut dengan badge berwarna berbeda untuk setiap departemen (“Engineering”, “Desain”, “Marketing”). Render 4 kartu dengan data berbeda.

**⭐⭐ Latihan 2 — Komponen dengan Children**

Buat komponen `PanelLipat` (accordion) yang menerima props `judul` dan `children`. Komponen ini harus:
- Menampilkan judul sebagai header yang bisa diklik
- Menyembunyikan/menampilkan `children` saat header diklik (menggunakan state boolean)
- Menampilkan ikon `▼` saat terbuka dan `▶` saat tertutup

Tampilkan 3 `PanelLipat` dengan konten berbeda.

**⭐⭐⭐ Latihan 3 — Sistem Komponen UI**

Bangun sistem komponen UI sederhana dengan 3 komponen:

1. `Tombol` — menerima props `varian` (‘primer’/‘sekunder’/‘bahaya’), `ukuran` (‘kecil’/‘sedang’/‘besar’), `disabled`, dan `children`
2. `Input` — menerima props `label`, `tipe`, `placeholder`, `error` (pesan error opsional), dan `required`
3. `FormLogin` — menggunakan `Input` dan `Tombol` untuk membuat form login lengkap

**⭐⭐⭐⭐ Latihan 4 — Tantangan Component Tree**

Bangun halaman “Daftar Kontak” dengan struktur komponen berikut:
- `HalamanKontak` (page) → mengelola state dan data
- `SearchBar` (organism) → input pencarian
- `GridKontak` (organism) → menampilkan grid kartu kontak
- `KartuKontak` (molecule) → satu kartu kontak dengan nama, telepon, email
- `TombolAksi` (atom) → tombol generik yang digunakan di dalam kartu

Data kontak minimal 6 orang, dengan fitur pencarian yang memfilter berdasarkan nama secara real-time.

---

*Lanjut ke ➡️ **Bab 4 — Props: Komunikasi Antar Komponen***