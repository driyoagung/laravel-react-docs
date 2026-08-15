---
title: Bab 13 — Query Builder & Raw Query
---

# 📖 Bab 13 — Query Builder & Raw Query

## 13.1 🔧 Query Builder

```php
use Illuminate\Support\Facades\DB;

// Query Builder — mirip Eloquent tapi lebih low-level
$products = DB::table('products')
    ->select('products.*', 'categories.name as category_name')
    ->join('categories', 'products.category_id', '=', 'categories.id')
    ->where('products.is_active', true)
    ->whereNull('products.deleted_at')
    ->orderByDesc('products.created_at')
    ->paginate(12);
```

**Penjelasan Query Builder:**

- **`DB::table('products')`** — Mulai query ke tabel `products`.
- **`->select('products.*', 'categories.name as category_name')`** — Pilih kolom, dengan alias.
- **`->join('categories', 'products.category_id', '=', 'categories.id')`** — Inner join.
- **`->where('is_active', true)`** — Filter.
- **`->whereNull('deleted_at')`** — Hanya yang tidak soft-deleted.
- **`->orderByDesc('created_at')`** — Urutkan terbaru.
- **`->paginate(12)`** — Pagination 12 per halaman.

### Method Query Builder yang Sering Dipakai

```php
// SELECT
DB::table('users')->select('name', 'email')->get();
DB::table('users')->distinct()->get();
DB::table('users')->addSelect('age')->get();

// WHERE
DB::table('users')->where('votes', '>', 100)->get();
DB::table('users')->where('name', 'like', 'A%')->get();
DB::table('users')->where([
    ['name', '=', 'John'],
    ['age', '>', 18],
])->get();

// JOIN
DB::table('users')
    ->join('contacts', 'users.id', '=', 'contacts.user_id')
    ->select('users.*', 'contacts.phone')
    ->get();

DB::table('users')
    ->leftJoin('orders', 'users.id', '=', 'orders.user_id')
    ->get();

// GROUP BY & HAVING
DB::table('orders')
    ->select('user_id', DB::raw('SUM(total) as total_spent'))
    ->groupBy('user_id')
    ->having('total_spent', '>', 1000000)
    ->get();

// INSERT
DB::table('users')->insert([
    ['name' => 'John', 'email' => 'john@example.com'],
    ['name' => 'Jane', 'email' => 'jane@example.com'],
]);

// UPDATE
DB::table('users')->where('id', 1)->update(['name' => 'Updated']);

// DELETE
DB::table('users')->where('id', 1)->delete();
```

**Penjelasan method:**

- **`distinct()`** — `SELECT DISTINCT` (hilangkan duplikat).
- **`addSelect()`** — Tambah kolom ke select existing. Untuk subquery.
- **`where('name', 'like', 'A%')`** — LIKE query untuk pencarian pattern.
- **`where([...])`** — Multiple where sekaligus.
- **`leftJoin()`** — Left join (semua row left, NULL jika tidak ada match).
- **`groupBy()` + `having()`** — Agregasi. `HAVING` = filter setelah GROUP BY.
- **`DB::raw('SUM(total) as total_spent')`** — Raw SQL expression di select.
- **`insert([...])`** — Bulk insert. Bisa insert banyak row sekaligus.
- **`update([...])`** & **`delete()`** — Mass update/delete tanpa trigger events.

## 13.2 📊 Kapan Pakai Query Builder vs Eloquent?

| Aspek                | Eloquent                          | Query Builder                       |
| -------------------- | --------------------------------- | ----------------------------------- |
| Readability          | ✅ Sangat readable                | ⚠️ Lebih verbose                    |
| Relasi               | ✅ Built-in                       | ❌ Harus JOIN manual                |
| Mass Assignment      | ✅ `$fillable` protection         | ❌ Tidak otomatis                   |
| Model Events         | ✅ Observer, Event                | ❌ Tidak                             |
| Performa             | ⚠️ Sedikit lebih lambat           | ✅ Lebih cepat                      |
| Query kompleks       | ⚠️ Bisa, tapi ribet              | ✅ Lebih natural                    |
| Aggregasi berat      | ⚠️ Bisa                           | ✅ Cocok untuk laporan              |

```php
// ✅ Pakai Eloquent untuk CRUD biasa
$products = Product::with('category')->active()->get();

// ✅ Pakai Query Builder untuk laporan kompleks
$salesReport = DB::table('orders')
    ->select(
        'users.name',
        DB::raw('COUNT(orders.id) as total_orders'),
        DB::raw('SUM(orders.total) as total_revenue')
    )
    ->join('users', 'orders.user_id', '=', 'users.id')
    ->where('orders.status', 'completed')
    ->whereYear('orders.created_at', 2024)
    ->groupBy('users.id', 'users.name')
    ->orderByDesc('total_revenue')
    ->get();
```

**Penjelasan contoh:**

- **Eloquent** — Untuk CRUD sederhana, lebih readable.
- **Query Builder** — Untuk laporan dengan agregasi dan join kompleks. Raw SQL lebih ekspresif.

## 13.3 🔒 Raw Query yang Aman

```php
// ✅ Aman — pakai binding parameter
DB::select('SELECT * FROM users WHERE email = ?', [$email]);
DB::select('SELECT * FROM users WHERE id = ?', [$id]);

DB::table('users')
    ->whereRaw('age > ? AND votes > ?', [18, 100])
    ->get();

DB::table('orders')
    ->orderByRaw('FIELD(status, "pending", "processing", "completed")')
    ->get();

// ⚠️ Hati-hati — raw string interpolation
DB::select("SELECT * FROM users WHERE email = '{$email}'"); // BAHAYA: SQL injection!

// ✅ Yang benar
DB::select("SELECT * FROM users WHERE email = ?", [$email]);
```

**Penjelasan Raw Query:**

- **`?` placeholder** — Laravel otomatis escape dan quote nilainya. **AMAN** dari SQL injection.
- **`whereRaw()`** — Raw WHERE clause. Pakai `?` untuk parameter.
- **`orderByRaw()`** — Raw ORDER BY. Contoh `FIELD()` untuk custom sort order.
- **String interpolation** — JANGAN. Vulnerable SQL injection.

::: danger 🚨 SQL Injection
JANGAN PERNAH concatenate input user langsung ke query SQL!
Selalu gunakan parameter binding (?) atau Eloquent.
:::

## 13.4 📈 Debug Query

```php
// Aktifkan query log
DB::enableQueryLog();

// Jalankan query
$products = Product::with('category')->get();

// Lihat semua query yang dijalankan
dd(DB::getQueryLog());

// Atau gunakan Laravel Debugbar (recommended!)
// composer require barryvdh/laravel-debugbar --dev
```

**Penjelasan debug:**

- **`DB::enableQueryLog()`** — Aktifkan logging. Semua query setelah ini akan di-record.
- **`DB::getQueryLog()`** — Ambil array semua query yang dijalankan (beserta binding & time).
- **`dd()`** — Dump and die. Print + stop execution.
- **Laravel Debugbar** — Package yang tampilkan query di browser (saat development).

## 📌 Ringkasan Bab 13

| Konsep                | Penjelasan Singkat                                              |
| --------------------- | --------------------------------------------------------------- |
| Query Builder         | Cara query DB yang lebih low-level, mirip SQL                   |
| Eloquent              | ORM dengan relasi built-in, lebih readable                      |
| JOIN                  | Gabungkan multiple tabel                                       |
| GROUP BY / HAVING     | Agregasi data                                                  |
| Raw Query             | SQL murni — hati-hati SQL injection                             |
| `?` binding           | Cara aman oper parameter ke query                               |
| `DB::enableQueryLog()`| Debug query yang dijalankan                                     |

---

➡️ Lanjut ke [Bagian IV — Autentikasi & Keamanan](/bagian-4/index)
