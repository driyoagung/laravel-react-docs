---
title: Bab 4 — Routing & Controller Dasar
---

# 📖 Bab 4 — Routing & Controller Dasar

## 4.1 🗺️ Mendefinisikan Route Dasar

```php
// routes/web.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

// Route dasar
Route::get('/', function () {
    return view('welcome');
});

// Route ke Controller
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::post('/products', [ProductController::class, 'store']);
Route::put('/products/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);

// Resource Route — shortcut untuk 7 route CRUD sekaligus
Route::resource('products', ProductController::class);

// Route dengan middleware
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::resource('orders', OrderController::class);
});

// Route dengan prefix & nama
Route::prefix('admin')->name('admin.')->group(function () {
    Route::resource('users', AdminUserController::class);
    // Menghasilkan: admin/users → admin.users.index, dll
});
```

**Penjelasan baris per baris:**

- **`Route::get('/', function () { ... })`** — Route untuk URL `/` (home page). Closure sederhana yang return view. Cocok untuk halaman statis.
- **`Route::get('/products', [ProductController::class, 'index'])`** — Route GET `/products` yang delegasikan ke method `ProductController@index`.
- **`Route::post('/products', ...)`** — Route untuk handle form submission atau API POST.
- **`Route::resource('products', ProductController::class)`** — Magic! Sekali tulis, otomatis generate 7 route CRUD (index, create, store, show, edit, update, destroy).
- **`Route::middleware('auth')->group(...)`** — Bungkus banyak route yang butuh middleware `auth`. User yang belum login akan di-redirect ke `/login`.
- **`Route::prefix('admin')->name('admin.')->group(...)`** — Prefix `admin/` di URL, dan prefix `admin.` di nama route. Berguna untuk route admin.

## 4.2 🎮 Controller: Membuat & Struktur

```bash
# Buat Resource Controller (sudah include 7 method CRUD)
php artisan make:controller ProductController --resource
```

```php
// app/Http/Controllers/ProductController.php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // GET /products — Tampilkan semua produk
    public function index()
    {
        $products = Product::latest()->paginate(12);
        return view('products.index', compact('products'));
    }

    // GET /products/create — Form tambah produk
    public function create()
    {
        return view('products.create');
    }

    // POST /products — Simpan produk baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
        ]);

        Product::create($validated);

        return redirect()->route('products.index')
            ->with('success', 'Produk berhasil ditambahkan!');
    }

    // GET /products/{product} — Detail produk
    public function show(Product $product) // Route Model Binding otomatis!
    {
        return view('products.show', compact('product'));
    }

    // PUT /products/{product} — Update produk
    public function update(Request $request, Product $product)
    {
        $product->update($request->validated());
        return redirect()->route('products.index')
            ->with('success', 'Produk berhasil diupdate!');
    }

    // DELETE /products/{product} — Hapus produk
    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('products.index')
            ->with('success', 'Produk berhasil dihapus!');
    }
}
```

**Penjelasan method Resource Controller:**

- **`index()`** — Handle GET `/products`. Ambil list produk (paginated 12). Return view dengan data.
- **`create()`** — Handle GET `/products/create`. Tampilkan form tambah.
- **`store(Request $request)`** — Handle POST `/products`. Validasi input, simpan ke DB, redirect ke index dengan flash message.
- **`show(Product $product)`** — Handle GET `/products/{product}`. `Product $product` otomatis di-inject oleh Laravel (Route Model Binding).
- **`update(Request, Product)`** — Handle PUT `/products/{product}`. Update product.
- **`destroy(Product $product)`** — Handle DELETE `/products/{product}`. Hapus product.

**Penjelasan method validasi & flow:**

```php
$validated = $request->validate([
    'name'  => 'required|string|max:255',
    'price' => 'required|numeric|min:0',
    'stock' => 'required|integer|min:0',
]);
```

- `$request->validate()` otomatis:
  1. Cek rules, jika gagal → throw validation exception (redirect back dengan error).
  2. Hanya field yang lolos yang dikembalikan di `$validated`.
  3. Aman untuk mass-assignment ke model.

```php
return redirect()->route('products.index')
    ->with('success', 'Produk berhasil ditambahkan!');
```

- `redirect()->route('products.index')` — Redirect ke route bernama `products.index` (lebih aman dari hardcode URL).
- `->with('success', '...')` — Set flash message yang bisa ditampilkan di view berikutnya.

## 4.3 🏷️ Route Model Binding — Keajaiban Laravel

```php
// ❌ Cara manual — banyak kode repetitif
public function show($id)
{
    $product = Product::findOrFail($id); // Throw 404 jika tidak ada
    return view('products.show', compact('product'));
}

// ✅ Route Model Binding — Laravel cari otomatis!
public function show(Product $product) // Laravel otomatis inject product berdasarkan {product} di URL
{
    return view('products.show', compact('product'));
    // Jika tidak ditemukan → otomatis 404
}
```

**Penjelasan Route Model Binding:**

- **Cara manual** — Anda harus panggil `findOrFail()` manual di tiap method. Repetitif.
- **Cara Route Model Binding** — Cukup deklarasikan parameter dengan type hint Model, Laravel otomatis:
  1. Ambil `{product}` dari URL.
  2. Cari di database: `Product::find($product)` atau `Product::where('slug', $product)->first()`.
  3. Inject hasilnya ke parameter.
  4. Jika tidak ketemu → otomatis 404.

Jadi kode Anda jadi lebih bersih dan idiomatic.

### Custom Key untuk Route Model Binding

```php
// Gunakan slug, bukan id
Route::get('/products/{product:slug}', [ProductController::class, 'show']);

// Atau definisikan di Model
// app/Models/Product.php
public function getRouteKeyName(): string
{
    return 'slug';
}
```

**Penjelasan custom key:**

- Default-nya Laravel mencari berdasarkan `id` (primary key).
- Untuk URL yang lebih SEO-friendly (misal `/products/laptop-gaming` bukan `/products/5`), gunakan `slug`.
- `{product:slug}` di route — Laravel tahu harus cari berdasarkan kolom `slug`.
- Atau override `getRouteKeyName()` di Model — semua route otomatis pakai slug.

## 4.4 📋 Named Routes & URL Generation

```php
// Mendefinisikan nama route
Route::get('/products/{id}', [ProductController::class, 'show'])->name('products.show');

// Menggunakan named route (lebih aman dari hardcode URL)
$url = route('products.show', ['id' => 5]);
// → http://localhost/products/5

// Di Blade template
<a href="{{ route('products.show', $product->id) }}">Lihat Detail</a>

// Redirect ke named route
return redirect()->route('products.index');
```

**Penjelasan named routes:**

- **`->name('products.show')`** — Kasih nama route. Wajib agar URL bisa di-generate elsewhere.
- **`route('products.show', ['id' => 5])`** — Generate URL berdasarkan nama route + parameter. Return string URL.
- **Di Blade** — `&#123;&#123; route('products.show', $product->id) }}` untuk render link di HTML.
- **`redirect()->route('products.index')`** — Redirect ke named route.

**Kenapa pakai named routes?**

- **Single source of truth** — Kalau URL pattern berubah, Anda tidak perlu cari-tahu semua tempat yang hardcode URL.
- **IDE autocomplete** — Lebih mudah lihat route tersedia.
- **Type-safe** — Salah nama route akan error (di development).

## 4.5 🧱 Route Resource dalam 1 Detik

```bash
# Generate Resource Controller (7 method CRUD)
php artisan make:controller ProductController --resource
```

```php
// routes/web.php — 1 baris untuk 7 route!
Route::resource('products', ProductController::class);
```

Method yang di-generate:

| HTTP Method | URL                      | Method   | Nama Route         |
| ----------- | ------------------------ | -------- | ------------------ |
| GET         | `/products`              | `index`  | `products.index`   |
| GET         | `/products/create`       | `create` | `products.create`  |
| POST        | `/products`              | `store`  | `products.store`   |
| GET         | `/products/{product}`    | `show`   | `products.show`    |
| GET         | `/products/{product}/edit` | `edit` | `products.edit`    |
| PUT/PATCH   | `/products/{product}`    | `update` | `products.update`  |
| DELETE      | `/products/{product}`    | `destroy`| `products.destroy` |

**Penjelasan Resource Route:**

- **1 baris kode** = 7 route otomatis.
- Setiap method di Controller dipanggil oleh HTTP method + URL yang sesuai.
- Nama route otomatis mengikuti pattern `<resource>.<method>`.
- Anda bisa skip method tertentu: `->except(['destroy'])` atau `->only(['index', 'show'])`.

## 4.6 🛣️ Route API (untuk REST API)

```php
// routes/api.php (Laravel 11/12: install dengan php artisan install:api)

Route::apiResource('products', ProductController::class);
// apiResource = tanpa method 'create' dan 'edit' (tidak perlu form di API)
```

::: tip 💡 Tips
Gunakan `Route::apiResource()` untuk API (skip `create` & `edit` karena API tidak butuh form).
Gunakan `Route::resource()` untuk web (include `create` & `edit` untuk form HTML).
:::

**Penjelasan:**

- `apiResource` meng-generate 5 route (index, show, store, update, destroy).
- Tidak ada `create`/`edit` karena API tidak render form HTML.
- Semua route otomatis prefix `/api/`.

## 📌 Ringkasan Bab 4

| Konsep                  | Penjelasan Singkat                                              |
| ----------------------- | --------------------------------------------------------------- |
| `Route::get()`          | Definisi route untuk method HTTP tertentu                       |
| Controller              | Class yang menangani logic request → response                   |
| Resource Controller     | 7 method CRUD (index, create, store, show, edit, update, destroy) |
| Route Model Binding     | Laravel otomatis inject Model berdasarkan parameter             |
| Named Route             | Route yang punya nama untuk referensi yang lebih aman            |
| `route('nama')`         | Generate URL dari nama route                                    |
| `Route::resource()`     | Shortcut untuk 7 route CRUD sekaligus                           |
| `Route::apiResource()`  | Sama seperti resource tapi tanpa `create` & `edit`             |

---

➡️ Lanjut ke [Bagian II — Service Container & Core Concepts](/bagian-2/index)
