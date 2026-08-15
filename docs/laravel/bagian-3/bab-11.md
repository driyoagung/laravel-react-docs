---
title: Bab 11 — Relasi Eloquent
---

# 📖 Bab 11 — Relasi Eloquent

## 11.1 🔗 Jenis-Jenis Relasi

### One to Many

```php
// app/Models/Category.php
class Category extends Model
{
    // ONE TO MANY: Satu kategori punya banyak produk
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}

// app/Models/Product.php
class Product extends Model
{
    // BELONGS TO: Setiap produk milik satu kategori
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}

// Cara pakai
$category = Category::find(1);
$products = $category->products; // Semua produk di kategori ini

$product = Product::find(1);
$categoryName = $product->category->name; // Nama kategori produk ini
```

**Penjelasan One to Many:**

- **`hasMany()`** di parent — Method yang return collection of children.
- **`belongsTo()`** di child — Method yang return single parent.
- Konvensi foreign key: `category_id` (nama tabel parent singular + `_id`).
- Saat akses `$category->products`, query otomatis: `SELECT * FROM products WHERE category_id = 1`.

### Many to Many

```php
// app/Models/Product.php
class Product extends Model
{
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class)
            ->withTimestamps()          // created_at di pivot table
            ->withPivot('sort_order');  // Kolom tambahan di pivot table
    }
}

// app/Models/Tag.php
class Tag extends Model
{
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class);
    }
}

// Cara pakai
$product->tags()->attach($tagId);                          // Attach tag
$product->tags()->sync([1, 2, 3]);                          // Sync (replace) tags
$product->tags()->detach($tagId);                          // Detach tag
$product->tags()->syncWithoutDetaching([1, 2]);            // Tambah tanpa hapus yg lain
```

**Penjelasan Many to Many:**

- Butuh **pivot table** (tabel penghubung) — `product_tag` dengan kolom `product_id` dan `tag_id`.
- **`attach($id)`** — Tambah relasi. Insert ke pivot table.
- **`sync([1,2,3])`** — Replace relasi. Hapus yang lama, set yang baru.
- **`detach($id)`** — Hapus relasi.
- **`syncWithoutDetaching([1,2])`** — Tambah tanpa hapus yang sudah ada (union).
- **`withTimestamps()`** — Pivot table punya `created_at` & `updated_at`.
- **`withPivot('col')`** — Include kolom tambahan pivot dihasil query.

### Has Many Through

```php
// app/Models/Country.php
class Country extends Model
{
    // Negara → User → Post
    public function posts(): HasManyThrough
    {
        return $this->hasManyThrough(Post::class, User::class);
    }
}
```

**Penjelasan Has Many Through:**

- Relasi **transitif** lewat intermediate model.
- Contoh: `Country hasMany Posts THROUGH User` (Country → User → Post).
- Untuk query: `SELECT * FROM posts WHERE user_id IN (SELECT id FROM users WHERE country_id = ?)`.

### Polymorphic Relations

```php
// Satu model bisa punya banyak tipe relasi
// Contoh: Product dan Post sama-sama bisa punya Comment

// app/Models/Comment.php
class Comment extends Model
{
    public function commentable(): MorphTo
    {
        return $this->morphTo();
    }
}

// app/Models/Product.php
class Product extends Model
{
    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}

// app/Models/Post.php
class Post extends Model
{
    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}
```

**Penjelasan Polymorphic:**

- **Polymorphic** = 1 tabel komentar bisa punya banyak parent type.
- Tabel `comments` punya kolom `commentable_id` + `commentable_type` (misal: `App\Models\Product`).
- `$product->comments` — semua comment untuk product ini.
- `$comment->commentable` — parent (Product atau Post).

### Self-Referencing (User Follow User)

```php
// app/Models/User.php
class User extends Model
{
    // User bisa follow banyak user lain
    public function following(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'follows', 'follower_id', 'following_id')
            ->withTimestamps();
    }

    // User juga bisa di-follow banyak user
    public function followers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'follows', 'following_id', 'follower_id')
            ->withTimestamps();
    }
}
```

**Penjelasan Self-Referencing:**

- Pivot table `follows` punya 2 FK: `follower_id` dan `following_id` (both reference `users.id`).
- `$user->following` — user yang di-follow.
- `$user->followers` — user yang follow dia.
- Perhatikan argumen ke-2, ke-3, ke-4: nama tabel, foreign pivot key, related pivot key.

## 11.2 📊 Tabel Referensi Cepat

| Relasi              | Method di Parent        | Method di Child          |
| ------------------- | ----------------------- | ------------------------ |
| One to One          | `hasOne()`              | `belongsTo()`            |
| One to Many         | `hasMany()`             | `belongsTo()`            |
| Many to Many        | `belongsToMany()`       | `belongsToMany()`        |
| Has Many Through    | `hasManyThrough()`      | -                        |
| Polymorphic One     | `morphOne()`            | `morphTo()`              |
| Polymorphic Many    | `morphMany()`           | `morphTo()`              |

## 11.3 ⚡ Eager Loading — Hindari N+1 Problem

```php
// ❌ N+1 Problem — 1 query untuk produk + N query untuk tiap kategori
$products = Product::all();
foreach ($products as $product) {
    echo $product->category->name; // Query baru setiap iterasi!
}
// Total: 1 + N query

// ✅ Eager Loading — hanya 2 query, apapun jumlah datanya
$products = Product::with('category')->get();
foreach ($products as $product) {
    echo $product->category->name; // Tidak ada query tambahan!
}
// Total: 2 query (1 produk + 1 kategori)

// Eager loading bersarang & multiple
$products = Product::with([
    'category',          // kategori
    'tags',              // tags
    'reviews.user',      // reviews beserta user-nya
])->paginate(12);

// Lazy Eager Loading (jika sudah terlanjur fetch)
$products->load('category', 'tags');
```

**Penjelasan Eager Loading:**

- **N+1 Problem** — Sangat umum di ORM. Tanpa eager loading, tiap akses relasi = 1 query baru.
- **`->with('relation')`** — Specify relasi yang mau di-load SEKALIGUS saat initial query.
- Untuk 100 produk tanpa eager loading: 1 + 100 = 101 query.
- Untuk 100 produk WITH eager loading: 2 query (1 produk + 1 kategori dengan WHERE IN).

**Penjelasan nested eager loading:**

- **`'reviews.user'`** — Load reviews DAN user tiap review. Query tambahan: 1 untuk reviews, 1 untuk users.
- Bisa nested sampai beberapa level.

::: danger 🚨 Selalu Waspadai N+1!
N+1 query adalah penyebab utama **performa buruk** di aplikasi Laravel.
Aktifkan `preventLazyLoading()` di environment development untuk mendeteksi N+1 lebih awal.
:::

```php
// app/Providers/AppServiceProvider.php
public function boot(): void
{
    // Di development: throw exception jika ada lazy loading
    if (app()->environment('local')) {
        Model::preventLazyLoading(!app()->runningInConsole());
    }

    // Atau cuma kasih warning (tidak throw exception)
    Model::handleLazyLoadingViolationUsing(function ($model, $key) {
        Log::warning("Lazy loading detected on {$model::class}::{$key}");
    });
}
```

**Penjelasan preventLazyLoading:**

- `preventLazyLoading(true)` — Throw exception jika ada lazy loading (access relasi tanpa `with()`).
- Sangat membantu detect N+1 saat development.
- `!app()->runningInConsole()` — Kecualikan console (seeder/command tidak perlu strict).

## 11.4 🎯 Query dengan Relasi

```php
// Ambil produk yang punya tag tertentu
$products = Product::whereHas('tags', function ($query) {
    $query->where('slug', 'laravel');
})->get();

// Ambil produk yang punya minimal 3 tags
$products = Product::has('tags', '>=', 3)->get();

// Ambil produk dengan count relasi
$products = Product::withCount('reviews')->get();
foreach ($products as $product) {
    echo "{$product->name}: {$product->reviews_count} reviews";
}

// Ambil produk dengan rata-rata rating
$products = Product::withAvg('reviews', 'rating')->get();
```

**Penjelasan query dengan relasi:**

- **`whereHas()`** — Filter parent berdasarkan kondisi di relasi.
- **`has('relation', '>=', 3)`** — Parent yang punya minimal 3 child.
- **`withCount()`** — Tambah kolom `reviews_count` ke hasil query.
- **`withAvg()`** — Tambah kolom `reviews_avg_rating` ke hasil.

## 11.5 🧰 Manipulasi Data Relasi

```php
// Tambah relasi
$product->tags()->attach($tagId);
$product->tags()->attach([1, 2, 3]);  // Multiple

// Sync (replace) relasi
$product->tags()->sync([1, 2, 3]);

// Detach
$product->tags()->detach($tagId);
$product->tags()->detach(); // Hapus semua

// Create langsung via relasi
$category = Category::find(1);
$product = $category->products()->create([
    'name'  => 'Produk Baru',
    'price' => 100000,
]);

// First or Create
$product = $category->products()->firstOrCreate([
    'slug' => 'produk-baru',
], [
    'name'  => 'Produk Baru',
    'price' => 100000,
]);
```

**Penjelasan manipulasi relasi:**

- **`attach()`** — Insert ke pivot table. TIDAK duplicate check.
- **`sync()`** — Hapus semua + insert baru. Cocok untuk update form seperti multi-select.
- **`detach()`** — Hapus dari pivot.
- **Create via relasi** — Otomatis isi foreign key. `$product->category_id = 1`.
- **`firstOrCreate()`** — Cari by kondisi pertama; jika tidak ada, create dengan kondisi kedua.

## 📌 Ringkasan Bab 11

| Konsep                | Penjelasan Singkat                                              |
| --------------------- | --------------------------------------------------------------- |
| `hasMany()`           | Parent punya banyak child                                      |
| `belongsTo()`         | Child milik parent                                              |
| `belongsToMany()`     | Many-to-many lewat tabel pivot                                 |
| `morphMany()`         | Polymorphic relasi (1 type bisa punya banyak tipe lain)        |
| Eager Loading         | Load relasi di awal untuk hindari N+1                           |
| `with()`              | Eager loading di query awal                                    |
| `load()`              | Lazy eager loading setelah fetch                                |
| `attach()` / `sync()` | Manipulasi relasi many-to-many                                  |
| `whereHas()`          | Query berdasarkan kondisi relasi                                |
| `withCount()`         | Hitung jumlah relasi                                           |

---

➡️ Lanjut ke [Bab 12 — Seeder, Factory & Database Testing](/bagian-3/bab-12)
