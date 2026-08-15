---
title: Bab 8 — Middleware
---

# 📖 Bab 8 — Middleware

## 8.1 🔒 Apa itu Middleware?

Middleware adalah **filter** yang dijalankan sebelum atau sesudah request mencapai Controller. Seperti lapisan keamanan berlapis.

```
Request → [Middleware 1] → [Middleware 2] → [Middleware 3] → Controller
                                                                  ↓
Response ← [Middleware 1] ← [Middleware 2] ← [Middleware 3] ← Response
```

**Penjelasan alur Middleware:**

- Request masuk → melewati middleware 1 → 2 → 3 → sampai Controller.
- Controller menjalankan logic → return Response.
- Response BALIK melalui middleware 3 → 2 → 1 (urutan terbalik) → sampai user.
- Setiap middleware bisa:
  - **Modify request** sebelum lanjut (tambah header, dst).
  - **Modify response** sebelum dikirim ke user.
  - **Hentikan request** (jika kondisi tidak terpenuhi, return error/redirect).

## 8.2 🔧 Membuat Custom Middleware

```bash
php artisan make:middleware CheckUserActive
```

```php
// app/Http/Middleware/CheckUserActive.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckUserActive
{
    public function handle(Request $request, Closure $next): mixed
    {
        // Cek sebelum request masuk ke Controller
        if (auth()->check() && !auth()->user()->is_active) {
            auth()->logout();
            return redirect()->route('login')
                ->with('error', 'Akun Anda telah dinonaktifkan.');
        }

        $response = $next($request); // Lanjutkan ke Controller

        // Bisa juga lakukan sesuatu SETELAH response dibuat
        $response->header('X-App-Version', '1.0.0');

        return $response;
    }
}
```

**Penjelasan method `handle()`:**

- **`$request`** — HTTP request yang masuk.
- **`$next`** — Closure untuk lanjut ke middleware/controller berikutnya.
- **Logic SEBELUM `$next($request)`** — Dijalankan saat request masuk.
- **`$next($request)`** — Panggil untuk lanjut ke controller. Hasilnya = response.
- **Logic SETELAH `$next($request)`** — Dijalankan saat response BALIK. Bisa modify response.

**Penjelasan contoh di atas:**

- Cek user sudah login tapi `is_active = false` → logout + redirect ke login.
- Setelah controller selesai, tambah header `X-App-Version` ke response.

```php
// Mendaftarkan middleware di bootstrap/app.php (Laravel 12)
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'active' => \App\Http\Middleware\CheckUserActive::class,
    ]);
})

// Penggunaan di route
Route::middleware(['auth', 'active'])->group(function () {
    Route::resource('products', ProductController::class);
});
```

**Penjelasan registrasi:**

- **`$middleware->alias([...])`** — Daftarkan alias pendek untuk middleware. `'active'` → `CheckUserActive::class`.
- **`Route::middleware(['auth', 'active'])`** — Pakai beberapa middleware. Request harus lewat keduanya.

## 8.3 📦 Middleware dengan Parameter

```php
// Cek role user
class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, string $role): mixed
    {
        if (!$request->user()?->hasRole($role)) {
            abort(403, "Anda harus menjadi {$role} untuk mengakses halaman ini.");
        }

        return $next($request);
    }
}

// Penggunaan
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
});

Route::middleware(['auth', 'role:seller,admin'])->group(function () {
    Route::resource('/seller/products', SellerProductController::class);
});
```

**Penjelasan middleware parameter:**

- **`string $role`** — Parameter setelah closure. Dipakai saat registrasi route.
- **`role:admin`** — Parameter `admin` di-pass ke constructor middleware.
- **`role:seller,admin`** — Multiple parameter dipisah koma. Di-handle via variadic args.

## 8.4 🌍 Global Middleware

```php
// bootstrap/app.php — Laravel 12
->withMiddleware(function (Middleware $middleware) {
    // Middleware yang dijalankan untuk SEMUA request
    $middleware->append(\App\Http\Middleware\ForceHttps::class);

    // Atau prepend (jalan lebih awal)
    $middleware->prepend(\App\Http\Middleware\TrustProxies::class);

    // Alias untuk dipakai di route
    $middleware->alias([
        'role'   => \App\Http\Middleware\EnsureUserHasRole::class,
        'active' => \App\Http\Middleware\CheckUserActive::class,
    ]);
})
```

**Penjelasan:**

- **`$middleware->append()`** — Tambah middleware ke akhir list global. Dijalankan untuk semua request.
- **`$middleware->prepend()`** — Tambah ke awal list. Dijalankan sebelum middleware global lain.
- **`$middleware->alias()`** — Definisikan alias pendek untuk middleware.

**Kapan pakai global vs route middleware?**

- **Global** — Untuk semua request (security headers, HTTPS enforcement, CORS).
- **Route** — Hanya untuk route tertentu (auth, role check, throttle).

## 8.5 🛡️ Middleware Bawaan Laravel yang Penting

| Middleware                  | Fungsi                                                 |
| --------------------------- | ------------------------------------------------------ |
| `auth`                      | User harus login                                       |
| `auth.basic`                | Login via HTTP Basic Auth                              |
| `guest`                     | Hanya untuk user yang BELUM login                      |
| `verified`                  | Email harus sudah diverifikasi                         |
| `throttle:60,1`             | Rate limit 60 request per menit                        |
| `signed`                    | Route hanya bisa diakses dengan signature yang valid   |
| `scopes:read,write`         | Cek token Sanctum punya ability tertentu               |

**Penjelasan middleware bawaan:**

- **`auth`** — Redirect ke `/login` jika user belum login. Untuk halaman yang butuh authenticated user.
- **`auth.basic`** — Pakai HTTP Basic Auth. Untuk API sederhana.
- **`guest`** — Kebalikan `auth`. Untuk halaman login/register yang tidak boleh diakses user yang sudah login.
- **`verified`** — User harus sudah verifikasi email. Cocok untuk fitur penting.
- **`throttle:60,1`** — Rate limiter. 60 request per 1 menit per IP. Cegah abuse.
- **`signed`** — URL harus punya signature yang valid. Untuk share link temporary.
- **`scopes:read,write`** — Cek Sanctum token punya ability tertentu.

## 8.6 ⚡ Contoh Middleware yang Berguna

### 1. Force HTTPS (Production)

```php
class ForceHttps
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->secure() && app()->environment('production')) {
            return redirect()->secure($request->getRequestUri());
        }
        return $next($request);
    }
}
```

**Penjelasan:**

- Cek apakah request **TIDAK** secure (HTTP) dan environment adalah production.
- Jika ya, redirect ke HTTPS dengan URL yang sama.
- Di development tetap pakai HTTP (tidak redirect).

### 2. Set Locale dari URL

```php
class SetLocale
{
    public function handle(Request $request, Closure $next)
    {
        if ($locale = $request->segment(1)) {
            if (in_array($locale, ['en', 'id', 'jp'])) {
                app()->setLocale($locale);
            }
        }
        return $next($request);
    }
}

// routes/web.php
Route::middleware('setlocale')->group(function () {
    Route::get('/id/products', [ProductController::class, 'index']);
    Route::get('/en/products', [ProductController::class, 'index']);
});
```

**Penjelasan:**

- Cek segment pertama URL (`/id/products` → `id`).
- Jika locale valid (`en`, `id`, `jp`), set locale aplikasi.
- `app()->setLocale()` mengubah bahasa untuk request ini.

### 3. Log Semua Request

```php
class LogRequests
{
    public function handle(Request $request, Closure $next)
    {
        Log::info('Request masuk', [
            'url'    => $request->fullUrl(),
            'method' => $request->method(),
            'ip'     => $request->ip(),
        ]);

        return $next($request);
    }
}
```

**Penjelasan:**

- Log setiap request yang masuk (URL, method, IP).
- Berguna untuk debugging atau audit trail.
- Bisa di-extend untuk log response time, status code, dll.

::: tip 💡 Tips
- Middleware ringan dan cepat — cocok untuk hal-hal kecil seperti cek role, set header
- Logika bisnis yang berat, taruh di Service atau Controller
- Middleware bisa dipakai berkali-kali, jadi pastikan reusable
:::

## 📌 Ringkasan Bab 8

| Konsep                  | Penjelasan Singkat                                              |
| ----------------------- | --------------------------------------------------------------- |
| Middleware              | Filter HTTP request sebelum/sesudah Controller                  |
| Global Middleware       | Berjalan untuk SEMUA request                                    |
| Route Middleware        | Berjalan hanya untuk route tertentu                             |
| Middleware dengan param | `middleware('role:admin')` — oper parameter ke middleware      |
| `alias()`               | Memberi nama pendek untuk middleware                           |
| `bootstrap/app.php`     | Tempat mendaftarkan middleware di Laravel 12                    |

---

➡️ Lanjut ke [Bab 9 — Session, Cookie & Flash Message](/bagian-2/bab-9)
