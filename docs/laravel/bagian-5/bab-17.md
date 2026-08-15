---
title: Bab 17 — Dasar REST API dengan Laravel
---

# 📖 Bab 17 — Dasar REST API dengan Laravel

> ⭐ **Bab KRITIS** — Skill paling dicari di industri Laravel!

## 17.1 📐 Prinsip RESTful API

```
GET    /api/products          → Tampilkan semua produk
POST   /api/products          → Buat produk baru
GET    /api/products/{id}     → Detail satu produk
PUT    /api/products/{id}     → Update penuh satu produk
PATCH  /api/products/{id}     → Update sebagian satu produk
DELETE /api/products/{id}     → Hapus satu produk

HTTP Status Code yang Benar:
200 OK           → Request berhasil (GET, PUT, PATCH)
201 Created      → Data baru berhasil dibuat (POST)
204 No Content   → Berhasil tapi tidak ada data (DELETE)
400 Bad Request  → Request tidak valid
401 Unauthorized → Belum login / token tidak valid
403 Forbidden    → Sudah login tapi tidak punya hak akses
404 Not Found    → Data tidak ditemukan
422 Unprocessable → Validasi gagal
500 Server Error → Error di server
```

**Penjelasan HTTP methods:**

- **`GET`** — Read data. Idempotent (aman dipanggil berkali-kali).
- **`POST`** — Create data baru. **TIDAK** idempotent.
- **`PUT`** — Update penuh (replace semua field).
- **`PATCH`** — Update sebagian (hanya field yang dikirim).
- **`DELETE`** — Hapus data.

**Penjelasan status codes:**

- **`200 OK`** — Request berhasil, ada response data.
- **`201 Created`** — Resource baru berhasil dibuat. Biasanya return ID/URL resource.
- **`204 No Content`** — Berhasil, tapi tidak ada body (untuk DELETE).
- **`400`** — Request malformed (bukan JSON valid, dst).
- **`401`** — Belum auth atau token invalid.
- **`403`** — Authenticated tapi tidak punya akses.
- **`404`** — Resource tidak ada.
- **`422`** — Validasi gagal. Laravel otomatis return ini untuk validation error.
- **`500`** — Server error. Bug di aplikasi.

## 17.2 🔧 Setup Route API di Laravel 12

```bash
# Di Laravel 12, routes/api.php tidak ada secara default
# Install dengan artisan
php artisan install:api
# Ini juga menginstall Laravel Sanctum otomatis
```

**Penjelasan `install:api`:**

- Generate file `routes/api.php`.
- Install **Sanctum** (auth API).
- Auto-prefix semua route API dengan `/api/`.
- Register service provider Sanctum.

```php
// routes/api.php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\AuthController;

// Route publik (tidak perlu autentikasi)
Route::post('/login',    [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/products',  [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

// Route yang butuh autentikasi (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('products', ProductController::class)->except(['index', 'show']);
    Route::apiResource('orders', OrderController::class);
});
```

**Penjelasan route groups:**

- **Route publik** — Tanpa middleware. Siapa saja bisa akses.
- **`auth:sanctum`** — Wajib pakai token Sanctum. Tanpa token → 401.
- **`->except(['index', 'show'])`** — Skip method index dan show (sudah public di atas).
- **`apiResource`** — 5 method REST (index, show, store, update, destroy).

## 17.3 📦 API Resource — Format Response yang Konsisten

```bash
php artisan make:resource ProductResource
php artisan make:resource ProductCollection
```

```php
// app/Http/Resources/ProductResource.php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'slug'        => $this->slug,
            'price'       => $this->price,
            'price_format' => 'Rp ' . number_format($this->price, 0, ',', '.'),
            'stock'       => $this->stock,
            'is_in_stock' => $this->stock > 0,
            'category'    => new CategoryResource($this->whenLoaded('category')),
            'tags'        => TagResource::collection($this->whenLoaded('tags')),
            'created_at'  => $this->created_at->toISOString(),
        ];
    }
}
```

**Penjelasan API Resource:**

- **JsonResource** — Base class untuk transform model → JSON response.
- **`$this->id`, `$this->name`** — Property model yang bisa langsung diakses.
- **`$this->whenLoaded('relation')`** — Tampilkan relasi HANYA jika sudah di-eager load. Cegah N+1.
- **`new CategoryResource(...)`** — Nested resource. Auto-serialize.
- **`TagResource::collection(...)`** — Untuk array/collection.
- **`->toISOString()`** — Format tanggal ke ISO 8601 (standard untuk API).

### Custom Response dengan Additional Metadata

```php
public function with(Request $request): array
{
    return [
        'meta' => [
            'api_version' => '1.0',
            'timestamp'   => now()->toISOString(),
        ],
    ];
}
```

**Penjelasan `with()`:**

- Method di Resource class.
- Return array yang akan di-merge ke response.
- Cocok untuk metadata yang muncul di semua response.

## 17.4 🎮 API Controller

```php
// app/Http/Controllers/Api/ProductController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Http\Requests\StoreProductRequest;
use App\Models\Product;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('category', 'tags')
            ->active()
            ->latest()
            ->paginate(request('per_page', 12));

        return ProductResource::collection($products);
        // Output: { data: [...], links: {...}, meta: {...} }
    }

    public function store(StoreProductRequest $request)
    {
        $product = Product::create($request->validated());

        return new ProductResource($product->load('category'))
            // HTTP 201 Created
            ->response()->setStatusCode(201);
    }

    public function show(Product $product)
    {
        return new ProductResource($product->load('category', 'tags'));
    }

    public function update(StoreProductRequest $request, Product $product)
    {
        $this->authorize('update', $product);
        $product->update($request->validated());
        return new ProductResource($product->fresh()->load('category'));
    }

    public function destroy(Product $product)
    {
        $this->authorize('delete', $product);
        $product->delete();
        return response()->noContent(); // HTTP 204
    }
}
```

**Penjelasan method API Controller:**

- **`index()`** — List + paginate. `request('per_page', 12)` baca query param `?per_page=20`.
- **`store()`** — Create + return 201 dengan resource.
- **`show()`** — Show single. Route Model Binding otomatis.
- **`update()`** — Update + authorize. `$product->fresh()` reload data dari DB.
- **`destroy()`** — Delete + return 204 (no content).

**Penjelasan response helper:**

- **`ProductResource::collection($products)`** — Return collection dengan format `{ data, links, meta }`.
- **`->response()->setStatusCode(201)`** — Custom status code saat create.
- **`response()->noContent()`** — Return kosong dengan status 204.

## 17.5 📥 Query Parameters (Filter, Search, Sort)

```php
public function index()
{
    $query = Product::query()->with('category');

    // Filter by category
    if ($category = request('category')) {
        $query->whereHas('category', fn($q) => $q->where('slug', $category));
    }

    // Filter by price range
    if ($minPrice = request('min_price')) {
        $query->where('price', '>=', $minPrice);
    }
    if ($maxPrice = request('max_price')) {
        $query->where('price', '<=', $maxPrice);
    }

    // Search by name
    if ($search = request('q')) {
        $query->where('name', 'like', "%{$search}%");
    }

    // Sort
    $sortBy = request('sort_by', 'created_at');
    $sortDir = request('sort_dir', 'desc');
    $query->orderBy($sortBy, $sortDir);

    // Pagination
    $perPage = request('per_page', 12);
    $products = $query->paginate($perPage);

    return ProductResource::collection($products);
}
```

**Penjelasan query parameters:**

- **`request('category')`** — Baca query param. Null jika tidak ada.
- **`->whereHas('category', closure)`** — Filter berdasarkan relasi. `whereHas('category')` artinya "product yang punya category dengan...".
- **`like "%{$search}%"`** — Pencarian pattern. Wildcards `%` di awal & akhir = substring match.
- **`orderBy($sortBy, $sortDir)`** — Sort dinamis. **HATI-HATI**: jangan biarkan user inject arbitrary column names (security).
- **`paginate($perPage)`** — Pagination dinamis.

Contoh request:
```
GET /api/products?category=elektronik&min_price=100000&q=laptop&sort_by=price&sort_dir=asc&per_page=20
```

::: tip 💡 Tips
Selalu validasi query parameter dari user! Gunakan `$request->validate([...])` atau cek manual sebelum dipakai.
:::

## 17.6 🛣️ API Route Groups

```php
// routes/api.php

Route::prefix('v1')->name('api.v1.')->group(function () {
    Route::apiResource('products', ProductController::class);
    Route::apiResource('categories', CategoryController::class);

    // Nested route
    Route::apiResource('products.reviews', ReviewController::class);
    // URL: /api/v1/products/{product}/reviews
});

// Route dengan middleware khusus
Route::middleware(['auth:sanctum', 'throttle:60,1'])->prefix('v1')->group(function () {
    Route::apiResource('orders', OrderController::class);
});
```

**Penjelasan route groups:**

- **`prefix('v1')`** — Semua URL prefix `/api/v1/`.
- **`name('api.v1.')`** — Prefix nama route. `api.v1.products.index`.
- **`'products.reviews'`** — Nested route. URL `/products/{product}/reviews`.
- **`'throttle:60,1'`** — Rate limiter 60 request per menit.

## 📌 Ringkasan Bab 17

| Konsep                | Penjelasan Singkat                                              |
| --------------------- | --------------------------------------------------------------- |
| REST                  | Arsitektur API berbasis HTTP method + URL                       |
| HTTP Status Code      | 200, 201, 204, 400, 401, 403, 404, 422, 500                    |
| API Resource          | Class untuk format response JSON                                |
| `apiResource()`       | Resource route tanpa `create` & `edit` (untuk API)              |
| Filter & Search       | Pakai query parameter                                           |
| Pagination            | `paginate(perPage)` → otomatis return links & meta              |
| `$this->whenLoaded()` | Tampilkan relasi hanya jika sudah di-load                      |

---

➡️ Lanjut ke [Bab 18 — API Response & Error Handling](/bagian-5/bab-18)
