---
title: "Bab 3 — JSX: HTML yang Lebih Powerful"
---

# 📖 Bab 3 — JSX — HTML yang Lebih Powerful

## 3.1 📝 Apa itu JSX?

JSX adalah **ekstensi sintaks JavaScript** yang memungkinkan Anda menulis "HTML" langsung di dalam JavaScript. JSX bukan HTML asli — ia dikompilasi oleh Babel/Vite menjadi pemanggilan `React.createElement()`.

```jsx
// JSX yang Anda tulis:
const element = <h1 className="judul">Halo, {nama}!</h1>

// Hasil kompilasi (yang dijalankan browser):
const element = React.createElement('h1', { className: 'judul' }, `Halo, ${nama}!`)
```

**Penjelasan transformasi JSX:**

- JSX terlihat seperti HTML, tapi sebenarnya adalah **syntax sugar** untuk `React.createElement()`.
- Babel (via Vite) compile JSX → JS murni saat build.
- **Keuntungan JSX:**
  - Lebih mudah dibaca daripada `createElement()` nested.
  - IDE bisa autocomplete tag & attribute.
  - Error messages lebih jelas (line & column).

## 3.2 📋 Aturan JSX yang Wajib Diketahui

```jsx
// ① Satu root element — harus ada satu elemen pembungkus
// ❌ Salah
return (
  <h1>Judul</h1>
  <p>Paragraf</p>
)

// ✅ Benar — gunakan Fragment jika tidak ingin extra div
return (
  <>
    <h1>Judul</h1>
    <p>Paragraf</p>
  </>
)

// ② Atribut menggunakan camelCase (bukan kebab-case seperti HTML)
<div className="card">          // bukan class=""
<label htmlFor="email">         // bukan for=""
<input onChange={handler} />    // bukan onchange=""

// ③ Tag selalu ditutup — bahkan self-closing
<input type="text" />           // wajib ada slash
<img src="foto.jpg" alt="" />   // wajib ada slash

// ④ Ekspresi JavaScript dalam kurung kurawal {}
<p>Harga: {formatPrice(listing.price)}</p>
<img src={listing.imageUrl} alt={listing.title} />
<button disabled={isLoading}>Simpan</button>

// ⑤ Style sebagai object JavaScript (bukan string CSS)
<div style={{ backgroundColor: 'red', fontSize: '16px' }}>
  Teks merah
</div>
```

**Penjelasan aturan JSX:**

- **① Single root** — JSX harus dibungkus satu elemen. `Fragment` (`<>...</>`) tanpa extra DOM.
- **② camelCase** — Karena JSX = JavaScript, `class` reserved word → `className`. `for` reserved → `htmlFor`.
- **③ Self-closing** — Semua tag harus ditutup. HTML5 kadang izinkan省略, JSX tidak.
- **④ `{}` untuk JS** — Ekspresi JS dalam kurung kurawal. String perlu quote: `{"halo"}`.
- **⑤ Style as object** — Property CSS jadi camelCase di object (`fontSize` bukan `font-size`).

::: warning ⚠️ Common Mistakes Pemula
- Pakai `class` bukan `className` → error
- Pakai `for` bukan `htmlFor` → error
- Lupa kurung kurawal di ekspresi JS → rendered as literal string
- Lupa tutup self-closing tag → error
:::

## 3.3 🔀 Conditional Rendering di JSX

```jsx
function ListingCard({ listing, isPremium }) {
  return (
    <div>
      {/* Cara 1: Ternary — untuk dua kondisi */}
      {isPremium
        ? <span className="badge-gold">⭐ Superhost</span>
        : <span className="badge-gray">Regular</span>
      }

      {/* Cara 2: Short-circuit (&&) — untuk satu kondisi */}
      {listing.isNew && <span className="badge-new">Baru</span>}

      {/* Cara 3: Nullish coalescing — fallback value */}
      <p>{listing.description ?? 'Deskripsi belum tersedia.'}</p>

      {/* Cara 4: if-else sebelum return — untuk logika kompleks */}
    </div>
  )
}
```

**Penjelasan conditional rendering:**

- **Ternary `? :`** — Untuk 2 kondisi. Hasil bisa string, JSX, atau null.
- **`&&` short-circuit** — Untuk render conditional. Jika kiri false, kanan tidak di-render.
- **`??` nullish coalescing** — Fallback hanya untuk `null` atau `undefined` (BUKAN `0` atau `''`).
- **`||` dihindari** — Bisa trigger false untuk nilai `0` atau `''`.

## 3.4 🔁 Rendering List di JSX

```jsx
function ListingGrid({ listings }) {
  return (
    <div className="grid">
      {/* Selalu sertakan key yang unik! */}
      {listings.map(listing => (
        <ListingCard
          key={listing.id}   // ← WAJIB, gunakan ID bukan index
          listing={listing}
        />
      ))}

      {/* Fallback jika list kosong */}
      {listings.length === 0 && (
        <p className="empty-state">
          Tidak ada listing ditemukan.
        </p>
      )}
    </div>
  )
}
```

> ⚠️ **Mengapa `key` Harus Unik & Stabil?**
> React menggunakan `key` untuk melacak elemen mana yang berubah, ditambah,
> atau dihapus. Menggunakan index array sebagai key menyebabkan bug
> tersembunyi saat list di-sort atau di-filter. **Selalu gunakan ID unik dari data.**

## 3.5 🎨 Self-Closing Components

```jsx
// ✅ Components tanpa children — self-closing
<ListingCard listing={listing} />
<Avatar src={user.avatar} alt={user.name} />
<Modal isOpen={isOpen} onClose={close} />

// ✅ Components dengan children — opening & closing tag
<Card>
  <h3>Judul</h3>
  <p>Isi konten</p>
</Card>
```

**Penjelasan:**

- **Self-closing** untuk komponen tanpa content (`<Component />`).
- **Open/Close tag** untuk komponen dengan children (`<Component>...</Component>`).

## 3.6 🔤 String Concatenation di JSX

```jsx
// ❌ Concatenation biasa — hasil: "Halo, " + nama
<h1>Halo, " + {name} + "!</h1>

// ✅ Pakai template literal di dalam {}
<h1>{`Halo, ${name}!`}</h1>
```

**Penjelasan:**

- JSX tidak mendukung string concatenation langsung.
- Pakai template literal `${}` di dalam `{}` JSX expression.

## 📌 Ringkasan Bab 3

| Konsep                 | Penjelasan Singkat                                              |
| ---------------------- | --------------------------------------------------------------- |
| JSX                    | Sintaks mirip HTML di dalam JavaScript                          |
| `className`            | Atribut class di JSX (bukan `class`)                           |
| `htmlFor`              | Atribut for di JSX (bukan `for`)                               |
| Fragment `<>...</>`    | Multiple elements tanpa extra wrapping div                     |
| Curly braces `{}`      | Ekspresi JS dinamis di JSX                                      |
| `key` prop             | WAJIB untuk list — gunakan ID unik, bukan index                |
| Conditional rendering  | Ternary `? :`, short-circuit `&&`, nullish `??`               |

---

➡️ Lanjut ke [Bab 4 — Props & Komponen](/bagian-1/bab-4)
