---
title: Bab 18 — API Response & Error Handling
---

# 📖 Bab 18 — API Response & Error Handling

## 18.1 📨 Standar Format Response API

```php
// app/Http/Controllers/Api/BaseApiController.php
// Trait untuk format response yang konsisten

trait ApiResponse
{
    protected function success($data, string $message = 'OK', int $code = 200)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data'    => $data,
        ], $code);
    }

    protected function error(string $message, int $code = 400, $errors = null)
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors'  => $errors,
        ], $code);
    }
}
```

**Penjelasan trait ApiResponse:**

- **`success()`** — Format response sukses. Param: data, message, status code.
- **`error()`** — Format response error. Param: message, status code, errors detail.
- **`response()->json([...], $code)`** — Return JSON dengan custom status code.
- **Trait** — Letakkan di BaseController, semua API controller bisa pakai.

### Cara Pakai

```php
class ProductController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $products = Product::active()->get();
        return $this->success(ProductResource::collection($products));
    }

    public function store(StoreProductRequest $request)
    {
        $product = Product::create($request->validated());
        return $this->success(
            new ProductResource($product),
            'Produk berhasil dibuat',
            201
        );
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return $this->success(null, 'Produk berhasil dihapus');
    }
}
```

**Penjelasan cara pakai:**

- `use ApiResponse` — Pakai trait di Controller.
- `$this->success(...)` — Return response sukses.
- `$this->success(null, 'Dihapus')` — Data null + message. Status default 200.

## 18.2 ❌ Global Error Handling

```php
// bootstrap/app.php (Laravel 12)

->withExceptions(function (Exceptions $exceptions) {
    $exceptions->render(function (\Exception $e, Request $request) {
        if ($request->expectsJson() || $request->is('api/*')) {

            // 404 Not Found
            if ($e instanceof ModelNotFoundException) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data tidak ditemukan.',
                ], 404);
            }

            // 403 Forbidden
            if ($e instanceof AuthorizationException) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda tidak punya akses.',
                ], 403);
            }

            // 422 Validation Error
            if ($e instanceof ValidationException) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal.',
                    'errors'  => $e->errors(),
                ], 422);
            }

            // 401 Unauthorized
            if ($e instanceof AuthenticationException) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda harus login terlebih dahulu.',
                ], 401);
            }

            // 500 Server Error
            if ($e instanceof \Throwable && !config('app.debug')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Terjadi kesalahan pada server.',
                ], 500);
            }
        }
    });
})
```

**Penjelasan global error handling:**

- **`$request->expectsJson()`** — Cek apakah client minta JSON (header `Accept: application/json`).
- **`$request->is('api/*')`** — Cek apakah URL adalah `/api/*`.
- **Mapping exception → status code**:
  - `ModelNotFoundException` → 404
  - `AuthorizationException` → 403
  - `ValidationException` → 422
  - `AuthenticationException` → 401
- **`!config('app.debug')`** — Di production, error detail disembunyikan. Di dev, tampilkan stack trace.

## 18.3 📝 Custom Exception untuk Business Logic

```php
// app/Exceptions/InsufficientStockException.php
namespace App\Exceptions;

use Exception;

class InsufficientStockException extends Exception
{
    public function __construct(public readonly string $productName)
    {
        parent::__construct("Stok produk {$productName} tidak mencukupi.");
    }

    public function render($request)
    {
        return response()->json([
            'success' => false,
            'message' => $this->getMessage(),
            'product' => $this->productName,
        ], 422);
    }
}

// Penggunaan di service
class OrderService
{
    public function checkout(User $user, array $data): Order
    {
        $cart = $user->cart()->with('items.product')->first();

        foreach ($cart->items as $item) {
            if ($item->product->stock < $item->quantity) {
                throw new InsufficientStockException($item->product->name);
            }
        }
        // ...
    }
}
```

**Penjelasan custom exception:**

- **`InsufficientStockException`** — Custom exception dengan custom data (`productName`).
- **`render()`** — Method otomatis dipanggil Laravel saat exception di-throw. Return custom response.
- **HTTP 422** — Unprocessable Entity. Cocok untuk business logic error.

## 18.4 🛡️ API Rate Limiting

```php
// app/Providers/AppServiceProvider.php

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

public function boot(): void
{
    // Default rate limit: 60 request per menit per user/IP
    RateLimiter::for('api', function (Request $request) {
        return $request->user()
            ? Limit::perMinute(60)->by($request->user()->id)
            : Limit::perMinute(30)->by($request->ip());
    });

    // Limit khusus untuk login
    RateLimiter::for('login', function (Request $request) {
        return Limit::perMinute(5)->by($request->ip())
            ->response(function () {
                return response()->json([
                    'success' => false,
                    'message' => 'Terlalu banyak percobaan login. Coba lagi nanti.',
                ], 429);
            });
    });
}

// routes/api.php
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');
Route::middleware('throttle:api')->group(function () {
    Route::apiResource('products', ProductController::class);
});
```

**Penjelasan rate limiting:**

- **`RateLimiter::for('name', fn($request) => Limit)`** — Definisikan rate limiter.
- **`->by()`** — Identifier. User ID (authenticated) atau IP (guest).
- **`->response()`** — Custom response saat limit tercapai.
- **`throttle:login`** — Pakai rate limiter yang di-definisikan.

## 📌 Ringkasan Bab 18

| Konsep                  | Penjelasan Singkat                                              |
| ----------------------- | --------------------------------------------------------------- |
| Format response standar | `{ success, message, data, errors }`                            |
| `ModelNotFoundException`| Error 404 untuk data tidak ditemukan                            |
| `ValidationException`   | Error 422 untuk validasi gagal                                  |
| `AuthorizationException`| Error 403 untuk akses ditolak                                  |
| Custom Exception        | Buat exception class sendiri untuk business logic               |
| Rate Limiting           | Batasi jumlah request untuk cegah abuse                         |
| `throttle:api`          | Middleware untuk rate limit                                     |

---

➡️ Lanjut ke [Bab 19 — Autentikasi API dengan Sanctum](/bagian-5/bab-19)
