---
title: Bab 15 — Role & Permission
---

# 📖 Bab 15 — Role & Permission

## 15.1 🎭 Implementasi Role System Sederhana

Untuk project kecil-menengah, role bisa disimpan sebagai kolom enum di tabel `users`:

```php
// Migration: tambah kolom role
$table->enum('role', ['admin', 'seller', 'customer'])->default('customer');
```

```php
// app/Models/User.php

class User extends Model
{
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isSeller(): bool
    {
        return $this->role === 'seller';
    }

    public function isCustomer(): bool
    {
        return $this->role === 'customer';
    }
}
```

**Penjelasan role sederhana:**

- **Enum di kolom `role`** — Cara paling simpel. Cepat, tanpa tabel tambahan.
- Cocok untuk 2-3 role fixed, tidak ada permission complex.
- **Helper methods** — `isAdmin()`, `isSeller()` untuk readability.

## 15.2 🛡️ Middleware Berdasarkan Role

```php
class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user()?->isAdmin()) {
            abort(403, 'Anda tidak punya akses ke halaman ini.');
        }
        return $next($request);
    }
}

// Daftarkan di bootstrap/app.php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'admin' => \App\Http\Middleware\EnsureUserIsAdmin::class,
    ]);
})

// Penggunaan
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index']);
    Route::resource('users', AdminUserController::class);
});
```

**Penjelasan:**

- **`EnsureUserIsAdmin`** — Middleware custom. Bisa return null dari `user()?->isAdmin()` jika guest.
- **`abort(403, ...)`** — Throw HttpException dengan status 403 + pesan.
- **`$middleware->alias([...])`** — Daftarkan alias `'admin'`.
- **`prefix('admin')`** — Semua URL otomatis prefix `/admin`.

## 15.3 🏢 Sistem Role & Permission dengan Spatie

Untuk project besar, gunakan package `spatie/laravel-permission`:

```bash
# Install
composer require spatie/laravel-permission

# Publish migration & jalankan
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
php artisan migrate
```

```php
// app/Models/User.php
use Spatie\Permission\Traits\HasRoles;

class User extends Model
{
    use HasRoles;
}

// Membuat role & permission (di Seeder atau tinker)
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

Role::create(['name' => 'admin']);
Role::create(['name' => 'seller']);
Role::create(['name' => 'customer']);

Permission::create(['name' => 'edit products']);
Permission::create(['name' => 'delete products']);
Permission::create(['name' => 'view orders']);

// Assign role ke user
$user = User::find(1);
$user->assignRole('admin');

// Assign permission ke role
$adminRole = Role::findByName('admin');
$adminRole->givePermissionTo(['edit products', 'delete products', 'view orders']);
```

**Penjelasan Spatie:**

- **`composer require spatie/laravel-permission`** — Install package.
- **`vendor:publish`** — Publish migration & config.
- **`HasRoles` trait** — Tambah method role & permission ke User.
- **`Role::create([...])`** — Buat role baru.
- **`Permission::create([...])`** — Buat permission.
- **`$user->assignRole('admin')`** — Assign role.
- **`$adminRole->givePermissionTo([...])`** — Kasih permission ke role.

### Cara Pakai di Kode

```php
// Di Controller
public function update(Request $request, Product $product)
{
    if (!$request->user()->can('edit products')) {
        abort(403);
    }

    $product->update($request->validated());
}

// Atau dengan middleware
Route::middleware(['auth', 'can:edit products'])->group(function () {
    Route::resource('products', ProductController::class);
});

// Di Blade
@role('admin')
    <a href="/admin">Admin Panel</a>
@endrole

@hasanyrole('admin|seller')
    <a href="/products/create">Tambah Produk</a>
@endhasanyrole

@can('edit products')
    <button>Edit Produk</button>
@endcan
```

**Penjelasan cara pakai:**

- **`$user->can('edit products')`** — Cek permission. Return true/false.
- **`'can:edit products'`** — Middleware Laravel built-in untuk cek permission.
- **`@role('admin')`** — Blade directive. Render jika user punya role.
- **`@hasanyrole('admin|seller')`** — Render jika user punya salah satu role (pakai `|`).
- **`@can('edit products')`** — Blade directive cek permission.

## 15.4 🎯 Studi Kasus: E-Commerce Multi-Role

```php
// app/Models/User.php
class User extends Model
{
    use HasRoles;

    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    public function isSeller(): bool
    {
        return $this->hasRole('seller');
    }

    // Relasi: seller punya banyak produk
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}

// app/Policies/ProductPolicy.php
class ProductPolicy
{
    public function before(User $user): ?bool
    {
        // Admin boleh semua
        if ($user->isAdmin()) return true;
        return null; // lanjut ke method lain
    }

    public function update(User $user, Product $product): bool
    {
        return $user->id === $product->user_id; // Hanya owner
    }

    public function delete(User $user, Product $product): bool
    {
        return $user->id === $product->user_id;
    }
}

// Middleware untuk check role
class EnsureUserRole
{
    public function handle(Request $request, Closure $next, string ...$roles)
    {
        if (!$request->user() || !$request->user()->hasAnyRole($roles)) {
            abort(403, 'Akses ditolak.');
        }
        return $next($request);
    }
}

// Penggunaan
Route::middleware(['auth', 'role:admin,seller'])->group(function () {
    Route::resource('products', ProductController::class);
});
```

**Penjelasan studied case:**

- **`before()` method** — Hook di Policy. Dijalankan SEBELUM method lain. Return true = bypass semua check.
- **Admin auto-allow** — `if ($user->isAdmin()) return true` — admin bisa segalanya.
- **`hasAnyRole($roles)`** — Cek apakah user punya SALAH SATU role.
- **`EnsureUserRole`** — Custom middleware yang accept variadic role parameter.

::: tip 💡 Tips
- Untuk project kecil (1-2 role): cukup gunakan kolom `role` enum
- Untuk project menengah (3-5 role dengan permission): gunakan Spatie
- Untuk project enterprise (banyak role, permission kompleks): Spatie + custom Guard
:::

## 📌 Ringkasan Bab 15

| Konsep                | Penjelasan Singkat                                              |
| --------------------- | --------------------------------------------------------------- |
| Role sederhana        | Kolom enum di tabel `users`                                     |
| Middleware role       | Custom middleware untuk cek role di route                       |
| `spatie/laravel-permission` | Package powerful untuk role & permission                  |
| `assignRole()`        | Assign role ke user                                             |
| `givePermissionTo()`  | Beri permission ke role                                         |
| `hasRole()`           | Cek apakah user punya role                                      |
| `can()`               | Cek apakah user punya permission tertentu                       |
| `before()` di Policy  | Method yang selalu dijalankan dulu (untuk superadmin)           |

---

➡️ Lanjut ke [Bab 16 — Keamanan Laravel](/bagian-4/bab-16)
