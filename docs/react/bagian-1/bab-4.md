---
title: Bab 4 — Props & Komponen
---

# 📖 Bab 4 — Props & Komponen

## 4.1 📨 Props — Data dari Parent ke Child

```jsx
// Child: ListingCard.jsx
function ListingCard({ title, price, location, imageUrl, rating, onWishlist }) {
  // Props di-destructure langsung dari parameter
  return (
    <div className="listing-card">
      <img src={imageUrl} alt={title} />
      <h3>{title}</h3>
      <p>{location} · ⭐ {rating}</p>
      <p><strong>Rp {price.toLocaleString('id-ID')}</strong> /malam</p>
      <button onClick={onWishlist}>♥ Simpan</button>
    </div>
  )
}

// Default props — nilai jika prop tidak dikirim
ListingCard.defaultProps = {
  rating: 'Baru',
  onWishlist: () => {},
}

// Atau dengan default parameter (cara modern)
function ListingCard({ title, price, rating = 'Baru', onWishlist = () => {} }) {
  // ...
}
```

**Penjelasan props:**

- **Destructuring** — `{ title, price, ... }` lebih bersih daripada `props.title, props.price`.
- **`defaultProps`** — Static property. Nilai fallback jika prop tidak dikirim.
- **Default parameter** — Cara modern. Lebih ringkas di signature function.

```jsx
// Parent: SearchPage.jsx
function SearchPage() {
  const listings = useFetchListings()

  return (
    <div className="grid">
      {listings.map(listing => (
        <ListingCard
          key={listing.id}
          title={listing.title}
          price={listing.price_per_night}
          location={`${listing.city}, ${listing.country}`}
          imageUrl={listing.photos[0].url}
          rating={listing.star_rating}
          onWishlist={() => handleWishlist(listing.id)}
        />
      ))}
    </div>
  )
}
```

**Penjelasan cara pass props:**

- **Nilai biasa** — `title={listing.title}` — otomatis escape.
- **String template** — `location={`${city}, ${country}`}` — template literal dalam `{}`.
- **Callback** — `onWishlist={() => handleWishlist(listing.id)}` — arrow function agar tidak langsung dipanggil.
- **`key`** — Wajib di setiap list untuk identifikasi React.

## 4.2 🧩 Komposisi Komponen — `children` Prop

```jsx
// Komponen wrapper dengan children
function Card({ children, className = '' }) {
  return (
    <div className={`card-base ${className}`}>
      {children}
    </div>
  )
}

// Penggunaan — fleksibel, bisa isi apa saja
function App() {
  return (
    <Card className="listing-card">
      <img src="foto.jpg" alt="Villa" />
      <h3>Villa Ubud</h3>
      <p>Rp 500.000 / malam</p>
    </Card>
  )
}
```

**Penjelasan `children` prop:**

- **`children`** — Prop khusus. Otomatis di-inject dari konten di antara tag.
- **`Card` component** — Wrapper generic. Isinya bisa apa saja.
- **Composition** — Pattern utama React. Bangun UI kompleks dari komponen kecil.

## 4.3 🔄 Aliran Data Satu Arah (One-Way Data Flow)

```
Parent (SearchPage)
     │
     │  data mengalir KE BAWAH via props
     ▼
Child (ListingCard)
     │
     │  event mengalir KE ATAS via callback props (onWishlist, onClick, dll)
     ▲
Parent menerima & update state
```

> ⚠️ **Aturan Utama:**
> **Jangan pernah ubah props secara langsung!** Props adalah read-only di child.
> Jika perlu mengubah data, panggil callback yang diterima dari parent.
> Ini membuat aliran data mudah di-trace saat debugging.

## 4.4 📏 Kapan Harus Memisah Komponen?

> 💡 **Panduan Praktis — Pisah jika:**
> - Blok UI yang sama muncul di **lebih dari satu tempat**
> - Satu komponen sudah **lebih dari 150-200 baris**
> - Bagian UI punya **state sendiri** yang tidak dibutuhkan parent
> - Memisahkan memudahkan **testing secara isolasi**

## 4.5 🏷️ PropTypes & Validasi

```jsx
import PropTypes from 'prop-types'

function ListingCard({ title, price, rating, onWishlist }) {
  return (
    <div className="listing-card">
      <h3>{title}</h3>
      <p>Rp {price.toLocaleString('id-ID')} · ⭐ {rating}</p>
      <button onClick={onWishlist}>Simpan</button>
    </div>
  )
}

ListingCard.propTypes = {
  title:      PropTypes.string.isRequired,
  price:      PropTypes.number.isRequired,
  rating:     PropTypes.number,
  onWishlist: PropTypes.func,
}
```

> 💡 **Cara Modern: TypeScript**
> Untuk project baru, lebih disarankan pakai TypeScript daripada PropTypes.
> Validasi terjadi di compile-time, bukan runtime.

## 4.6 🚀 Spread Props — Kirim Banyak Props Sekaligus

```jsx
function ListingCard({ title, price, rating, imageUrl, location }) {
  return <div>...</div>
}

// Pakai spread
const listing = { title: 'Villa', price: 750000, rating: 4.9, imageUrl: '/villa.jpg', location: 'Bali' }
<ListingCard {...listing} />
// Setara dengan:
// <ListingCard title={listing.title} price={listing.price} rating={listing.rating} ... />
```

**Penjelasan spread:**

- **`{...obj}`** — Spread semua property object jadi props.
- **Hemat** — Tidak perlu tulis satu-satu.
- **Risiko** — Props tak terduga bisa ikut terkirim kalau object punya property ekstra.

## 📌 Ringkasan Bab 4

| Konsep                | Penjelasan Singkat                                              |
| --------------------- | --------------------------------------------------------------- |
| Props                  | Data dari parent ke child (read-only di child)                  |
| `children` prop        | Konten yang ditaruh di antara tag component                    |
| One-way data flow      | Data turun, event naik                                          |
| Default props          | Nilai fallback jika prop tidak dikirim                         |
| PropTypes              | Validasi tipe prop (atau pakai TypeScript)                      |
| `{...spread}`          | Kirim banyak props sekaligus                                    |
| Kapan pecah komponen   | >1 tempat pakai, >200 baris, state sendiri, atau testable      |

---

➡️ Lanjut ke [Bagian II — Hooks: Jantung React Modern](/bagian-2/index)
