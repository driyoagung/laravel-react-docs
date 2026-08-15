---
title: Bab 10 — Eloquent ORM & Migration
---

# 📖 Bab 10 — Eloquent ORM — Cara Berbicara dengan Database

> ⭐ **Bab KRITIS** — 90% pekerjaan Laravel ada di sini!

## 10.1 🗄️ Migration — Version Control untuk Database

```bash
# Buat migration baru
php artisan make:migration create_products_table
```

```php
// database/migrations/2024_01_01_000000_create_products_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();                              // bigint unsigned auto_increment
            $table->foreignId('category_id')           // Foreign key ke tabel categories
                  ->constrained()                      // references id on categories
                  ->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 12, 2);           // 12 digit, 2 desimal
            $table->unsignedInteger('stock')->default(0);
            $table->string('image')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();                      // created_at + updated_at
            $table->softDeletes();                     // deleted_at (soft delete)
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
```

**Penjelasan method migration:**

- **`up()`** — Dijalankan saat `php artisan migrate`. Buat tabel baru.
- **`down()`** — Dijalankan saat `php artisan migrate:rollback`. Hapus tabel.
- **`return new class extends Migration`** — Anonymous class (PHP 7+). Bisa juga `class CreateProductsTable extends Migration`.

**Penjelasan tipe kolom:**

- **`$table->id()`** — BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY. Sama dengan `BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY`.
- **`$table->foreignId('category_id')`** — BIGINT UNSIGNED + foreign key constraint.
- **`->constrained()`** — Asumsi FK ke tabel `categories` kolom `id`. Sama seperti `->references('id')->on('categories')`.
- **`->cascadeOnDelete()`** — Jika parent (category) dihapus, child (product) juga otomatis dihapus.
- **`$table->string('name')`** — VARCHAR(255).
- **`$table->string('slug')->unique()`** — VARCHAR(255) + UNIQUE INDEX.
- **`$table->text('description')->nullable()`** — TEXT, boleh NULL.
- **`$table->decimal('price', 12, 2)`** — DECIMAL(12, 2). Total 12 digit, 2 di belakang koma. Cocok untuk uang.
- **`$table->unsignedInteger('stock')->default(0)`** — INT UNSIGNED, default 0 jika tidak diisi.
- **`$table->boolean('is_active')->default(true)`** — TINYINT(1) di MySQL.
- **`$table->timestamps()`** — Tambah `created_at` + `updated_at` (TIMESTAMP).
- **`$table->softDeletes()`** — Tambah `deleted_at`. Untuk soft delete (Bab 10.5).

### Tipe Kolom yang Sering Dipakai

```php
$table->string('name');                    // VARCHAR(255)
$table->text('description');               // TEXT
$table->longText('content');               // LONGTEXT
$table->integer('stock');                  // INT
$table->bigInteger('views');               // BIGINT
$table->decimal('price', 12, 2);           // DECIMAL
$table->float('rating');                   // FLOAT
$table->double('weight');                  // DOUBLE
$table->boolean('is_active');              // BOOLEAN/TINYINT
$table->date('birthday');                  // DATE
$table->dateTime('published_at');          // DATETIME
$table->time('start_time');                // TIME
$table->timestamp('created_at');           // TIMESTAMP
$table->json('metadata');                  // JSON
$table->uuid('id');                        // UUID
$table->enum('status', ['active', 'inactive']); // ENUM
```

### Modifikasi Tabel (Migration Tambahan)

```php
public function up(): void
{
    Schema::table('products', function (Blueprint $table) {
        $table->string('sku')->after('name');     // Tambah kolom setelah kolom tertentu
        $table->index('category_id');              // Tambah index
        $table->dropColumn('old_field');           // Hapus kolom
        $table->renameColumn('old_name', 'new_name'); // Rename kolom
    });
}
```

**Penjelasan modifikasi tabel:**

- **`Schema::table()`** — Modify tabel yang sudah ada (bukan buat baru).
- **`->after('name')`** — Taruh kolom baru setelah kolom `name`.
- **`->index('category_id')`** — Tambah index untuk mempercepat query.
- **`->dropColumn('old_field')`** — Hapus kolom (hati-hati, data hilang!).
- **`->renameColumn()`** — Rename kolom. Butuh package `doctrine/dbal` di Laravel < 10.

## 10.2 📦 Eloquent Model — Representasi Tabel

```php
// app/Models/Product.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    // Field yang boleh diisi secara massal (mass assignment protection)
    protected $fillable = [
        'category_id', 'name', 'slug', 'description',
        'price', 'stock', 'image', 'is_active',
    ];

    // Cast otomatis tipe data
    protected $casts = [
        'price'     => 'decimal:2',
        'is_active' => 'boolean',
        'tags'      => 'array',         // Simpan JSON sebagai array
    ];

    // Accessor — modifikasi nilai saat dibaca
    public function getPriceFormattedAttribute(): string
    {
        return 'Rp ' . number_format($this->price, 0, ',', '.');
    }

    // Mutator — modifikasi nilai saat disimpan
    public function setNameAttribute(string $value): void
    {
        $this->attributes['name'] = $value;
        $this->attributes['slug'] = \Str::slug($value);
    }

    // Local Scope — query yang sering dipakai
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeInStock($query)
    {
        return $query->where('stock', '>', 0);
    }
}
```

**Penjelasan konvensi & property Model:**

- **`use HasFactory, SoftDeletes;`** — Trait:
  - `HasFactory` — Untuk `Model::factory()` di testing.
  - `SoftDeletes` — Otomatis isi `deleted_at`, exclude dari query default.
- **`$fillable`** — Whitelist field yang boleh diisi via `Product::create([...])`. **JANGAN** isi dengan semua field (security risk mass assignment).
- **`$casts`** — Konversi tipe otomatis:
  - `'price' => 'decimal:2'` — Selalu jadi string dengan 2 desimal.
  - `'is_active' => 'boolean'` — Convert ke true/false.
  - `'tags' => 'array'` — JSON di DB jadi array di PHP.

**Penjelasan Accessor & Mutator:**

- **Accessor** — Method `getXxxAttribute()` — dipanggil saat `$model->xxx` dibaca. Wajib return nilai.
- **Mutator** — Method `setXxxAttribute()` — dipanggil saat `$model->xxx = value` di-set. Set `$this->attributes['xxx']`.

**Penjelasan Local Scope:**

- **`scopeActive($query)`** — Method yang dimulai `scope` + nama scope. Bisa dipanggil `Product::active()`.
- **`scopeInStock($query)`** — Sama, `Product::inStock()`.
- Bisa di-chain: `Product::active()->inStock()->get()`.

### Konvensi Penamaan

| Konvensi         | Contoh                                  |
| ---------------- | --------------------------------------- |
| Nama tabel       | Plural snake_case: `products`           |
| Primary key      | `id` (auto increment)                   |
| Timestamp        | `created_at`, `updated_at` (default)    |
| Foreign key      | `category_id` (singular_table + `_id`)  |
| Model class      | Singular StudlyCase: `Product`          |

## 10.3 🔍 Query Eloquent yang Sering Dipakai

```php
// Ambil semua data
$products = Product::all();

// Ambil dengan kondisi
$activeProducts = Product::where('is_active', true)->get();

// Menggunakan scope yang sudah didefinisikan
$products = Product::active()->inStock()->latest()->get();

// Cari satu data
$product = Product::find(1);                  // null jika tidak ada
$product = Product::findOrFail(1);            // Throw 404 jika tidak ada
$product = Product::where('slug', 'laptop')->firstOrFail();

// Aggregasi
$total     = Product::count();
$avgPrice  = Product::active()->avg('price');
$maxPrice  = Product::max('price');
$sumStock  = Product::sum('stock');

// Buat data baru
$product = Product::create([
    'name'  => 'Laptop Gaming',
    'price' => 15000000,
    'stock' => 10,
]);

// Update
$product->update(['stock' => 5]);
Product::where('category_id', 3)->update(['is_active' => false]);

// Hapus (soft delete jika pakai SoftDeletes)
$product->delete();
Product::where('stock', 0)->delete();

// Query lanjutan
$products = Product::select('id', 'name', 'price')
    ->whereBetween('price', [100000, 500000])
    ->whereIn('category_id', [1, 2, 3])
    ->orderBy('price', 'asc')
    ->limit(10)
    ->get();

// Pagination
$products = Product::active()->latest()->paginate(12);
// Gunakan {{ $products->links() }} di Blade untuk render link halaman
```

**Penjelasan method query:**

- **`Product::all()`** — Ambil semua record. **Hati-hati** untuk tabel besar.
- **`->where('is_active', true)->get()`** — Filter + eksekusi query.
- **`Product::active()->inStock()->latest()->get()`** — Pakai scope (read top-down) + `latest()` (order by created_at DESC).
- **`find($id)`** — Cari by primary key. Return null jika tidak ada.
- **`findOrFail($id)`** — Throw 404 ModelNotFoundException jika tidak ada. Cocok untuk route yang WAJUM ada.
- **`firstOrFail()`** — Versi `where()->first()` yang throw 404.
- **`count()`, `avg()`, `max()`, `sum()`** — Agregasi SQL.
- **`Product::create([...])`** — Mass assignment. Hanya field di `$fillable` yang masuk.
- **`$product->update([...])`** — Update single record. Trigger events.
- **`Product::where(...)->update([...])`** — Update massal. **TIDAK trigger events**.
- **`$product->delete()`** — Soft delete (karena SoftDeletes trait) — set `deleted_at`.
- **`select()`** — Pilih kolom tertentu. Hemat memory.
- **`whereBetween()`** — WHERE price BETWEEN 100000 AND 500000.
- **`whereIn()`** — WHERE category_id IN (1, 2, 3).
- **`paginate(12)`** — Pagination 12 per halaman. Otomatis hitung total.

### Tabel Method Query Eloquent

| Method             | Fungsi                                                       |
| ------------------ | ------------------------------------------------------------ |
| `all()`            | Ambil semua record                                           |
| `find($id)`        | Cari berdasarkan primary key                                  |
| `findOrFail($id)`  | Cari atau throw 404                                          |
| `where()`          | Tambah kondisi WHERE                                         |
| `orWhere()`        | Tambah kondisi OR WHERE                                      |
| `whereIn()`        | WHERE kolom IN (...)                                         |
| `whereBetween()`   | WHERE kolom BETWEEN                                          |
| `orderBy()`        | Urutkan hasil                                                |
| `latest()`         | Urutkan berdasarkan `created_at` DESC                         |
| `limit()`          | Batasi jumlah hasil                                          |
| `pluck()`          | Ambil kolom tertentu saja                                    |
| `count()` / `sum()` | Fungsi agregasi                                              |
| `paginate()`       | Pagination otomatis                                          |
| `with()`           | Eager loading relasi                                         |
| `chunk()`          | Proses data dalam batch (untuk memory efficiency)            |

## 10.4 🔧 Accessor & Mutator (Laravel 11+ Style)

```php
// app/Models/Product.php

// Accessor: format harga
protected function priceFormatted(): Attribute
{
    return Attribute::make(
        get: fn() => 'Rp ' . number_format($this->price, 0, ',', '.')
    );
}

// Mutator: auto-generate slug dari name
protected function name(): Attribute
{
    return Attribute::make(
        set: fn(string $value) => [
            'name' => $value,
            'slug' => \Str::slug($value),
        ]
    );
}

// Cara pakai
echo $product->price_formatted; // "Rp 1.500.000"
```

**Penjelasan Attribute Style (Laravel 11+):**

- **Cara baru** untuk define accessor/mutator — lebih ringkas dari style lama.
- **`Attribute::make()`** — Return instance Attribute.
- **`get:`** — Closure untuk accessor (saat baca).
- **`set:`** — Closure untuk mutator (saat tulis).
- Laravel otomatis detect `priceFormatted` → property `price_formatted` (snake_case).

## 10.5 🗑️ Soft Deletes

```php
// 1. Migration: tambahkan kolom soft delete
$table->softDeletes();

// 2. Model: tambahkan trait
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;
}

// 3. Penggunaan
$product->delete();                      // Soft delete (tidak hilang dari DB)
Product::all();                          // Tidak termasuk yang di-soft-delete
Product::withTrashed()->get();           // Termasuk yang di-soft-delete
Product::onlyTrashed()->get();           // Hanya yang di-soft-delete
$product->restore();                     // Kembalikan dari soft delete
$product->forceDelete();                 // Hapus permanent dari DB
```

**Penjelasan Soft Deletes:**

- **Soft delete** — User pikir data dihapus, tapi sebenarnya hanya di-set `deleted_at = NOW()`.
- Berguna untuk: audit trail, undo ability, "Recycle Bin" feature.
- **`withTrashed()`** — Include yang soft-deleted.
- **`onlyTrashed()`** — Hanya yang soft-deleted.
- **`restore()`** — Set `deleted_at = NULL` lagi.
- **`forceDelete()`** — Hapus beneran (DB row hilang).

## 📌 Ringkasan Bab 10

| Konsep              | Penjelasan Singkat                                              |
| ------------------- | --------------------------------------------------------------- |
| Migration           | Version control untuk skema database                            |
| Eloquent Model      | Representasi tabel DB dalam bentuk class PHP                   |
| `$fillable`         | Field yang boleh diisi massal                                   |
| `$casts`            | Konversi tipe data otomatis                                     |
| Accessor            | Modifikasi nilai saat DIBACA                                   |
| Mutator             | Modifikasi nilai saat DISIMPAN                                  |
| Local Scope         | Query yang sering dipakai, jadi method reusable                 |
| `findOrFail()`      | Cari atau throw 404                                            |
| Soft Deletes        | Hapus data tapi tetap tersimpan di DB                           |

---

➡️ Lanjut ke [Bab 11 — Relasi Eloquent](/bagian-3/bab-11)
