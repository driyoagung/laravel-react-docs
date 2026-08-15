---
title: Bab 14 — Autentikasi dengan Laravel Breeze
---

# 📖 Bab 14 — Autentikasi dengan Laravel Breeze

## 14.1 🔐 Setup Autentikasi

```bash
# Install Laravel Breeze (starter kit autentikasi paling ringan)
composer require laravel/breeze --dev
php artisan breeze:install blade  # Pilih: blade, react, vue, api
npm install && npm run dev
php artisan migrate
```

**Penjelasan perintah:**

- **`composer require laravel/breeze --dev`** — Install Breeze sebagai dev dependency.
- **`php artisan breeze:install blade`** — Generate auth scaffolding (login, register, dll).
- **Pilihan stack**:
  - `blade` — Server-side rendering (paling simpel).
  - `react` / `vue` — SPA dengan Inertia.js.
  - `api` — Hanya API, tanpa UI.
- **`npm install && npm run dev`** — Install & build asset frontend.
- **`php artisan migrate`** — Jalankan migration yang dibuat breeze.

> Breeze otomatis membuat:
> - Route: `/login`, `/register`, `/logout`, `/forgot-password`, dll
> - Controller: `AuthenticatedSessionController`, `RegisteredUserController`, dll
> - View: Blade views untuk semua halaman auth

## 14.2 📋 Route yang Tersedia Setelah Install

```php
// routes/auth.php (otomatis di-load)
Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create']);
    Route::post('register', [RegisteredUserController::class, 'store']);
    Route::get('login', [AuthenticatedSessionController::class, 'create']);
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
    Route::get('forgot-password', [PasswordResetLinkController::class, 'create']);
    Route::post('forgot-password', [PasswordResetLinkController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy']);
    Route::get('verify-email', ...);
    Route::post('email/verification-notification', ...);
    Route::get('confirm-password', ...);
    Route::put('password', ...);
});
```

**Penjelasan:**

- **`'guest'` middleware** — Hanya untuk user yang BELUM login. Jika user sudah login, redirect ke home.
- **`'auth'` middleware** — Hanya untuk user yang SUDAH login. Jika belum, redirect ke login.
- **Route group** — Bungkus banyak route dengan middleware yang sama.

## 14.3 👤 Mengakses User yang Login

```php
// Di Controller
$user = auth()->user();         // Objek User yang login
$id   = auth()->id();           // ID user yang login
$cek  = auth()->check();        // Boolean: apakah sudah login?
$guest = auth()->guest();       // Boolean: apakah belum login?

// Login manual
auth()->login($user);
auth()->login($user, $remember = true); // Remember me

// Logout
auth()->logout();
$request->session()->invalidate();
$request->session()->regenerateToken();

// Login dengan attempt
if (Auth::attempt(['email' => $email, 'password' => $password], $remember)) {
    // Login berhasil
    $request->session()->regenerate(); // Anti session fixation
}
```

**Penjelasan method auth:**

- **`auth()->user()`** — User object yang sedang login. Null jika guest.
- **`auth()->id()`** — ID user yang login.
- **`auth()->check()`** — Return true jika user sedang login.
- **`auth()->guest()`** — Return true jika user BELUM login.
- **`auth()->login($user)`** — Login user. Set session.
- **`auth()->login($user, $remember)`** — Login + set cookie remember me.
- **`Auth::attempt([...])`** — Login dengan cek credentials. Return true/false.
- **`$request->session()->regenerate()`** — Generate session ID baru. **WAJIB** setelah login untuk cegah session fixation attack.

## 14.4 🛡️ Gates & Policies — Otorisasi

### Gate (Aturan Sederhana)

```php
// app/Providers/AppServiceProvider.php

use Illuminate\Support\Facades\Gate;

public function boot(): void
{
    // Gate: aturan otorisasi sederhana
    Gate::define('edit-product', function (User $user, Product $product) {
        return $user->id === $product->user_id || $user->role === 'admin';
    });

    // Gate sederhana tanpa parameter
    Gate::define('access-admin', function (User $user) {
        return $user->role === 'admin';
    });
}

// Di Controller
public function update(Request $request, Product $product)
{
    if (Gate::denies('edit-product', $product)) {
        abort(403);
    }
    // atau lebih clean:
    Gate::authorize('edit-product', $product);
    // atau:
    $this->authorize('edit-product', $product);
}

// Di Blade
@can('edit-product', $product)
    <a href="{{ route('products.edit', $product) }}">Edit</a>
@endcan

@cannot('edit-product', $product)
    <p>Anda tidak boleh edit produk ini.</p>
@endcannot
```

**Penjelasan Gate:**

- **`Gate::define('name', fn($user, ...args) => bool)`** — Definisi gate. Return true jika user punya akses.
- **`Gate::denies()`** — Cek apakah user TIDAK punya akses.
- **`Gate::authorize()`** — Throw 403 jika tidak punya akses. Method statis.
- **`$this->authorize()`** — Sama, tapi dari Controller.
- **`@can` directive** — Blade conditional rendering.
- **`@cannot`** — Kebalikan `@can`.

### Policy (Otorisasi untuk Model)

```bash
php artisan make:policy ProductPolicy --model=Product
```

```php
// app/Policies/ProductPolicy.php
class ProductPolicy
{
    public function update(User $user, Product $product): bool
    {
        return $user->id === $product->user_id;
    }

    public function delete(User $user, Product $product): bool
    {
        return $user->id === $product->user_id || $user->isAdmin();
    }

    public function viewAny(User $user): bool
    {
        // Semua user boleh lihat list produk
        return true;
    }
}

// Di Controller
public function update(Request $request, Product $product)
{
    $this->authorize('update', $product); // Throw 403 jika tidak punya hak

    $product->update($request->validated());
    return redirect()->route('products.index');
}

// Di Blade
@can('update', $product)
    <a href="{{ route('products.edit', $product) }}">Edit</a>
@endcan
```

**Penjelasan Policy:**

- **`make:policy --model=Product`** — Generate policy dengan method CRUD default.
- **`update(User, Product)`** — Method authorize model action. Return true/false.
- Laravel otomatis cari `ProductPolicy` saat panggil `$this->authorize('update', $product)`.
- Naming convention: `App\Policies\ProductPolicy` untuk model `App\Models\Product`.

::: tip 💡 Tips
Gunakan **Policy** untuk otorisasi yang spesifik per model.
Gunakan **Gate** untuk aturan global yang tidak terikat model tertentu.
:::

## 14.5 🔒 Protecting Routes

```php
// Single route
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware('auth');

// Group route
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::resource('orders', OrderController::class);
});

// Multiple middleware
Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('admin/settings', AdminSettingsController::class);
});

// Route khusus guest (redirect ke home kalau sudah login)
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create']);
});
```

**Penjelasan protecting routes:**

- **`->middleware('auth')`** — Terapkan middleware auth ke route.
- **Group `middleware('auth')`** — Semua route dalam group butuh auth.
- **`['auth', 'verified']`** — Multiple middleware. `auth` (sudah login) + `verified` (email verified).
- **`'guest'` middleware** — Anti-auth. Untuk halaman login/register.

## 📌 Ringkasan Bab 14

| Konsep                  | Penjelasan Singkat                                              |
| ----------------------- | --------------------------------------------------------------- |
| Laravel Breeze          | Starter kit autentikasi yang ringan                             |
| `auth()->user()`        | Ambil user yang sedang login                                    |
| `Auth::attempt()`       | Login dengan cek credentials                                    |
| Gate                    | Aturan otorisasi sederhana (closure)                           |
| Policy                  | Aturan otorisasi spesifik per model                             |
| `$this->authorize()`    | Cek otorisasi di controller                                     |
| `@can` directive        | Cek otorisasi di Blade                                          |
| `auth` middleware       | Proteksi route agar hanya bisa diakses user login              |

---

➡️ Lanjut ke [Bab 15 — Role & Permission](/bagian-4/bab-15)
