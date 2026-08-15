---
title: Bab 20 — API Versioning & Best Practices
---

# 📖 Bab 20 — API Versioning & Best Practices

## 20.1 🏗️ API Versioning

### Strategi 1: URL Versioning (Recommended)

```php
// routes/api.php

Route::prefix('v1')->name('api.v1.')->group(function () {
    require base_path('routes/api/v1.php');
});

Route::prefix('v2')->name('api.v2.')->group(function () {
    require base_path('routes/api/v2.php');
});

// URL: /api/v1/products, /api/v2/products
```

```
routes/
├── api/
│   ├── v1.php
│   └── v2.php
├── web.php
└── api.php
```

**Penjelasan URL versioning:**

- **`prefix('v1')`** — URL prefix `/api/v1/`.
- **`require base_path('routes/api/v1.php')`** — Load file route terpisah per versi.
- **Best practice** — URL versioning paling eksplisit & mudah di-cache.
- **v1, v2** bisa coexist. Client pilih versi via URL.

### Strategi 2: Header Versioning

```php
// routes/api.php
Route::middleware(['api.version:v1'])->group(function () {
    Route::apiResource('products', ProductController::class);
});
```

**Penjelasan Header Versioning:**

- Client kirim `Accept: application/vnd.api.v1+json`.
- Lebih "RESTful" (URL lebih clean), tapi kurang terlihat.
- Lebih susah di-cache dan debug.

## 20.2 📋 API Best Practices

### 1. Gunakan HTTP Method yang Tepat

```php
// ✅ Benar
Route::get('/products', ...);         // List
Route::post('/products', ...);        // Create
Route::get('/products/{id}', ...);    // Show
Route::put('/products/{id}', ...);    // Full update
Route::patch('/products/{id}', ...);  // Partial update
Route::delete('/products/{id}', ...); // Delete

// ❌ Salah
Route::post('/products/{id}/update', ...);   // Harusnya PUT/PATCH
Route::get('/products/delete/{id}', ...);    // Harusnya DELETE
```

### 2. Gunakan Status Code yang Tepat

```php
return response()->json($data, 200);   // OK
return response()->json($data, 201);   // Created
return response()->noContent();        // 204 No Content
return response()->json($err, 400);    // Bad Request
return response()->json($err, 401);    // Unauthorized
return response()->json($err, 403);    // Forbidden
return response()->json($err, 404);    // Not Found
return response()->json($err, 422);    // Unprocessable (validasi)
```

### 3. Nama Resource = Kata Benda, Bukan Kata Kerja

```
✅ /api/products          (kata benda, plural)
✅ /api/users/{id}/orders
❌ /api/getProducts
❌ /api/createProduct
```

### 4. Pagination yang Konsisten

```php
return ProductResource::collection(Product::paginate(12));
// Output:
// {
//   "data": [...],
//   "links": { "first": "...", "last": "...", "prev": "...", "next": "..." },
//   "meta":  { "current_page": 1, "total": 100, "per_page": 12 }
// }
```

### 5. Dokumentasi API

Gunakan OpenAPI/Swagger untuk dokumentasi otomatis:

```bash
# Install package (opsional)
composer require darkaonline/l5-swagger
```

Atau dokumentasikan manual di endpoint khusus:

```php
// GET /api — Info API
Route::get('/', function () {
    return response()->json([
        'name'        => 'My API',
        'version'     => '1.0.0',
        'description' => 'REST API untuk aplikasi XYZ',
        'endpoints'   => [
            'POST /api/v1/register' => 'Registrasi user baru',
            'POST /api/v1/login'    => 'Login & dapatkan token',
            'GET  /api/v1/products' => 'List semua produk',
        ],
    ]);
});
```

**Penjelasan dokumentasi:**

- **OpenAPI/Swagger** — Standard untuk API documentation. Generate otomatis dari code.
- **`darkaonline/l5-swagger`** — Package Laravel untuk Swagger UI.
- **Manual `GET /api`** — Minimum yang harus ada. Endpoint info untuk client developer.

### 6. Logging & Monitoring

```php
// app/Http/Middleware/LogApiRequests.php
class LogApiRequests
{
    public function handle(Request $request, Closure $next)
    {
        $startTime = microtime(true);

        $response = $next($request);

        Log::info('API Request', [
            'method'    => $request->method(),
            'url'       => $request->fullUrl(),
            'status'    => $response->status(),
            'duration'  => round((microtime(true) - $startTime) * 1000, 2) . 'ms',
            'ip'        => $request->ip(),
            'user_id'   => $request->user()?->id,
        ]);

        return $response;
    }
}
```

**Penjelasan logging:**

- **`microtime(true)`** — Waktu saat request masuk (microsecond precision).
- **`round((... - $startTime) * 1000, 2)`** — Hitung durasi dalam ms, 2 desimal.
- **`Log::info()`** — Log ke file `storage/logs/laravel.log`.
- **Berguna untuk** — Debugging, monitoring, audit.

### 7. CORS Configuration

```php
// config/cors.php

return [
    'paths'      => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://localhost:3000',          // React dev
        'https://myapp.vercel.app',       // Production
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age'    => 0,
    'supports_credentials' => true,
];
```

**Penjelasan CORS:**

- **CORS** — Cross-Origin Resource Sharing. Browser block request dari origin berbeda secara default.
- **`allowed_origins`** — Origin (domain) yang BOLEH akses API. Jangan pakai `*` untuk production.
- **`supports_credentials: true`** — Allow cookie/session untuk Sanctum SPA auth.

## 20.3 📊 API Health Check

```php
// routes/api.php
Route::get('/health', function () {
    return response()->json([
        'status'  => 'ok',
        'service' => 'Laravel API',
        'version' => config('app.version', '1.0.0'),
        'time'    => now()->toISOString(),
    ]);
});
```

**Penjelasan health check:**

- Endpoint `/health` dipakai monitoring tools (UptimeRobot, Pingdom, dll).
- Return status `ok` jika service berjalan.
- Bisa ditambah check database connection, cache, dll.

## 20.4 📦 API Documentation Otomatis (Contoh Sederhana)

```php
// app/Http/Controllers/Api/DocumentationController.php
class DocumentationController extends Controller
{
    public function index()
    {
        $routes = collect(\Route::getRoutes())
            ->filter(fn($route) => str_starts_with($route->uri(), 'api/'))
            ->map(fn($route) => [
                'method'   => $route->methods()[0],
                'uri'      => $route->uri(),
                'name'     => $route->getName(),
                'action'   => $route->getActionName(),
                'middleware' => $route->middleware(),
            ])
            ->values();

        return response()->json([
            'success' => true,
            'data'    => $routes,
        ]);
    }
}
```

**Penjelasan:**

- **`collect(\Route::getRoutes())`** — Ambil semua route terdaftar.
- **`->filter()`** — Hanya route yang prefix `api/`.
- **`->map()`** — Transform ke format yang lebih readable.
- Berguna untuk debug atau generate docs otomatis.

## 📌 Ringkasan Bab 20

| Best Practice              | Penjelasan                                                |
| -------------------------- | --------------------------------------------------------- |
| URL Versioning             | `/api/v1/products`, `/api/v2/products`                    |
| HTTP Method yang tepat     | GET, POST, PUT, PATCH, DELETE sesuai fungsi               |
| Status Code yang tepat     | 200, 201, 204, 400, 401, 403, 404, 422                    |
| Resource = Kata Benda      | `/products`, bukan `/getProducts`                         |
| Pagination konsisten       | Format `{ data, links, meta }`                            |
| Dokumentasi                | Swagger/OpenAPI atau dokumentasi manual                   |
| Logging & Monitoring       | Log semua request untuk debugging                         |
| CORS                       | Konfigurasi origin yang boleh akses API                   |
| Health Check               | Endpoint `/health` untuk monitoring uptime                |

---

➡️ Lanjut ke [Bagian VI — Level Up](/bagian-6/index)
