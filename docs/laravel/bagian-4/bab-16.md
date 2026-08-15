---
title: Bab 16 — Keamanan Laravel
---

# 📖 Bab 16 — Keamanan Laravel

## 16.1 🔒 Praktik Keamanan Penting

### 1. CSRF Protection (Cross-Site Request Forgery)

Laravel otomatis memproteksi dari CSRF untuk semua route web. Anda WAJIB menyertakan `@csrf` di setiap form:

```blade
<form method="POST" action="/products">
    @csrf
    <input type="text" name="name">
    <button type="submit">Simpan</button>
</form>
```

**Penjelasan CSRF Protection:**

- **CSRF attack** — Hacker bikin form di website lain yang submit ke website Anda. Browser otomatis kirim cookie session.
- **`@csrf`** — Generate `<input type="hidden" name="_token">` dengan token random.
- Laravel otomatis cek token ini di setiap POST request. Jika tidak valid → 419.
- **WAJIB** di setiap form POST/PUT/PATCH/DELETE.

```php
// VerifyCsrfToken middleware sudah handle ini otomatis
// app/Http/Middleware/VerifyCsrfToken.php
namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    protected $except = [
        // HTTP request yang di-exclude dari CSRF (untuk webhook, dll)
        'webhook/*',
    ];
}
```

**Penjelasan `$except`:**

- Endpoint yang di-exclude TIDAK dicek CSRF-nya.
- Biasanya untuk webhook dari payment gateway (Stripe, dll).
- **Hati-hati** — jangan exclude endpoint yang menerima input user.

::: danger 🚨 Tanpa `@csrf`, form akan error 419 (Page Expired)
Selalu tambahkan `@csrf` di setiap form POST/PUT/PATCH/DELETE!
:::

### 2. Mass Assignment Protection

```php
// ✅ Aman — whitelist field yang boleh diisi
protected $fillable = ['name', 'price', 'stock'];

// ❌ BAHAYA — membuka semua field (jika user kirim field 'is_admin')
protected $guarded = [];
```

**Penjelasan Mass Assignment:**

- **Mass assignment** — `Product::create($request->all())` jika pakai `$guarded = []`.
- **Vulnerability** — User bisa tambah field `is_admin` di request → jadi admin.
- **`$fillable`** — Whitelist field yang BOLEH diisi massal.
- **`$guarded`** — Blacklist field (kebalikan, jarang dipakai).

### 3. SQL Injection — Eloquent & Query Builder sudah aman

```php
// ✅ Aman — pakai parameter binding
DB::select('SELECT * FROM users WHERE email = ?', [$email]);

// ❌ BAHAYA — raw string concatenation
DB::select("SELECT * FROM users WHERE email = '$email'");

// ✅ Aman dengan Eloquent
User::where('email', $email)->first();
```

**Penjelasan:**

- Eloquent dan Query Builder selalu pakai **parameter binding** (prepared statement).
- **JANGAN** pakai raw string concat untuk user input.
- Untuk raw SQL, WAJIB pakai `?` placeholder.

### 4. XSS (Cross-Site Scripting)

```php
// ✅ Aman — auto-escape HTML
{{ $userInput }}

// ❌ BAHAYA — render HTML mentah
{!! $userInput !!}
// Hanya untuk HTML yang Anda percaya 100% aman
```

**Penjelasan XSS:**

- **XSS attack** — Inject script ke halaman web. Script jalan di browser user lain.
- **`&#123;&#123; &#125;&#125;`** — Blade auto-escape HTML (ganti `<`, `>`, `&`, `"` jadi entity).
- **`{!! !!}`** — Render HTML mentah. JANGAN dipakai untuk data user.

### 5. Rate Limiting

```php
// 60 request per menit per IP
Route::middleware('throttle:60,1')->group(function () {
    Route::post('/api/products', [ProductController::class, 'store']);
});

// Limit khusus untuk login (mencegah brute force)
Route::middleware('throttle:5,1')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});
```

**Penjelasan Rate Limiting:**

- **`throttle:60,1`** — Syntax: `throttle:<max_attempts>,<decay_minutes>`. 60 request per 1 menit.
- Cegah brute force (login, password reset).
- Default identifier = IP address. Bisa custom via `RateLimiter::for()`.

### 6. Password Hashing

```php
// ✅ Otomatis hash password dengan bcrypt
$user = User::create([
    'name'     => 'John',
    'email'    => 'john@example.com',
    'password' => Hash::make($request->password),
    // JANGAN: 'password' => $request->password,
]);

// Cek password
if (Hash::check($plainPassword, $user->password)) {
    // Password cocok
}
```

**Penjelasan Password Hashing:**

- **`Hash::make()`** — Hash password dengan bcrypt. **Tidak reversible**.
- **JANGAN** simpan plain text password.
- **`Hash::check()`** — Verify plain password vs hash. Constant-time comparison.

### 7. Encrypt Data Sensitif

```php
use Illuminate\Support\Facades\Crypt;

// Encrypt
$encrypted = Crypt::encryptString('Rahasia');

// Decrypt
$decrypted = Crypt::decryptString($encrypted);
```

**Penjelasan:**

- **`Crypt::encryptString()`** — Encrypt string dengan `APP_KEY`. Aman.
- **`Crypt::decryptString()`** — Decrypt. Akan throw error jika key salah.
- Pakai untuk data sensitif di DB (API key, password, dll) — **bukan** untuk password user (pakai Hash).

## 16.2 🚪 HTTPS di Production

```php
// app/Http/Middleware/ForceHttps.php
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

- Di production, semua HTTP harus redirect ke HTTPS.
- `$request->secure()` — Return true jika HTTPS.
- Di development (HTTP), tidak redirect.

## 16.3 🔐 Security Headers

```php
// app/Http/Middleware/SecurityHeaders.php
class SecurityHeaders
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Content-Security-Policy', "default-src 'self'");

        return $response;
    }
}
```

**Penjelasan security headers:**

- **`X-Frame-Options: SAMEORIGIN`** — Cegah clickjacking. Halaman tidak bisa di-embed di iframe dari origin lain.
- **`X-Content-Type-Options: nosniff`** — Browser tidak boleh tebak tipe file. Mencegah MIME sniffing.
- **`X-XSS-Protection: 1; mode=block`** — Aktifkan XSS filter browser.
- **`Referrer-Policy`** — Kontrol info referrer yang dikirim.
- **`Content-Security-Policy`** — Kontrol resource yang boleh dimuat (script, style, img).

## 16.4 📋 Security Checklist untuk Production

| Item                                        | Status        |
| ------------------------------------------- | ------------- |
| `APP_DEBUG=false` di production             | ⬜ WAJIB      |
| `APP_ENV=production`                        | ⬜ WAJIB      |
| HTTPS aktif                                 | ⬜ WAJIB      |
| Database password kuat                      | ⬜ WAJIB      |
| `APP_KEY` di-generate & aman                | ⬜ WAJIB      |
| CSRF token di semua form                    | ⬜ WAJIB      |
| `$fillable` di semua model                  | ⬜ WAJIB      |
| Rate limiting di endpoint sensitif          | ⬜ WAJIB      |
| File upload validation (size, mime, dll)    | ⬜ WAJIB      |
| `.env` tidak ter-commit ke Git              | ⬜ WAJIB      |
| Backup database rutin                       | ⬜ Recommended |
| Error monitoring (Sentry, Bugsnag, dll)     | ⬜ Recommended |
| Dependency update rutin                     | ⬜ Recommended |

::: tip 💡 Tips
Gunakan package seperti [`laravel-security-checker`](https://github.com/FriendsOfPHP/security-advisories) untuk cek dependency yang vulnerable.
:::

## 16.5 📁 File Upload yang Aman

```php
// Validasi file upload
$request->validate([
    'avatar' => [
        'required',
        'image',                                  // Harus gambar
        'mimes:jpg,jpeg,png,webp',                // Ekstensi yang diizinkan
        'max:2048',                                // Max 2MB
        'dimensions:min_width=100,min_height=100', // Min dimensi
    ],
]);

// Simpan dengan nama random (mencegah tabrakan nama)
$path = $request->file('avatar')->store('avatars', 'public');
// atau
$filename = Str::random(40) . '.' . $request->file('avatar')->extension();
$request->file('avatar')->storeAs('avatars', $filename, 'public');
```

**Penjelasan file upload:**

- **`image`** — Rule Laravel: file harus gambar.
- **`mimes:jpg,jpeg,png,webp`** — Hanya ekstensi ini. Cegah upload `.php` sebagai gambar.
- **`max:2048`** — Max 2MB (kilobytes).
- **`dimensions:min_width=100,min_height=100`** — Validasi dimensi gambar.
- **`Str::random(40)`** — Generate nama random 40 char. Mencegah user overwrite file dengan nama yang sama.

## 📌 Ringkasan Bab 16

| Konsep                | Penjelasan Singkat                                              |
| --------------------- | --------------------------------------------------------------- |
| CSRF                  | Token untuk mencegah cross-site request forgery                 |
| Mass Assignment       | Proteksi field yang boleh diisi via `$fillable`                |
| SQL Injection         | Dicegah dengan parameter binding / Eloquent                     |
| XSS                   | Dicegah dengan auto-escape `&#123;&#123; }}` di Blade                     |
| Rate Limiting         | Batasi jumlah request per waktu untuk cegah abuse              |
| Password Hashing      | Selalu gunakan `Hash::make()`                                   |
| HTTPS                 | Wajib di production                                            |
| Security Headers      | Tambahan header HTTP untuk keamanan ekstra                     |
| File Upload           | Validasi tipe, ukuran, dan dimensi file                        |

---

➡️ Lanjut ke [Bagian V — REST API Development](/bagian-5/index)
