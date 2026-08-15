---
title: Bab 19 — Autentikasi API dengan Sanctum
---

# 📖 Bab 19 — Autentikasi API dengan Sanctum

## 19.1 🔑 Install Sanctum

```bash
php artisan install:api
```

Perintah ini otomatis:
1. Install package `laravel/sanctum`
2. Publish config & migration
3. Menambahkan `HasApiTokens` trait ke User model
4. Membuat `routes/api.php`

## 19.2 🛂 Setup User Model

```php
// app/Models/User.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = ['name', 'email', 'password', 'role'];
    protected $hidden = ['password', 'remember_token'];
    protected $casts = ['email_verified_at' => 'datetime'];
}
```

**Penjelasan:**

- **`HasApiTokens` trait** — Tambah method `createToken()`, `tokens()`, dll ke User.
- **`$hidden`** — Field yang tidak ikut diserialize ke JSON (untuk keamanan).
- **`$casts`** — Auto-cast tipe data. `email_verified_at` jadi Carbon instance.

## 19.3 🎮 Auth Controller

```php
// app/Http/Controllers/Api/AuthController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    // POST /api/register
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $token = $user->createToken('auth-token', ['*'])->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Registrasi berhasil.',
            'data'    => [
                'user'  => new UserResource($user),
                'token' => $token,
                'type'  => 'Bearer',
            ],
        ], 201);
    }

    // POST /api/login
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password salah.',
            ], 401);
        }

        $user  = Auth::user();
        $token = $user->createToken(
            name: 'auth-token',
            abilities: ['*'], // atau ['read:products', 'write:products']
            expiresAt: now()->addDays(30),
        )->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil.',
            'data'    => [
                'user'  => new UserResource($user),
                'token' => $token,
                'type'  => 'Bearer',
            ],
        ]);
    }

    // POST /api/logout
    public function logout(Request $request)
    {
        // Hapus token yang sedang dipakai
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil.',
        ]);
    }

    // GET /api/me
    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'data'    => new UserResource($request->user()),
        ]);
    }
}
```

**Penjelasan method Auth:**

- **`register()`** — Create user baru, hash password, generate token.
- **`Hash::make()`** — Hash password (Bcrypt). Tidak reversible.
- **`$user->createToken('name', abilities, expiresAt)`** — Generate Sanctum token.
- **`plainTextToken`** — String token untuk dikirim ke client. **JANGAN** simpan plain text ini.
- **`Auth::attempt([...])`** — Login dengan cek credentials. Return true/false.
- **`currentAccessToken()->delete()`** — Hapus token yang sedang dipakai (logout).
- **`->expiresAt()`** — Set token expired. `now()->addDays(30)` = 30 hari.

## 19.4 🛣️ Route

```php
// routes/api.php

Route::post('/register', [AuthController::class, 'register']);

Route::middleware('throttle:login')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout',  [AuthController::class, 'logout']);
    Route::get('/me',       [AuthController::class, 'me']);

    Route::apiResource('products', ProductController::class);
    Route::apiResource('orders', OrderController::class);
});
```

**Penjelasan route grouping:**

- **Register** — Public, tanpa auth.
- **Login** — Pakai rate limiter khusus (anti brute force).
- **Logout/Me/Resource** — Wajib auth Sanctum.

## 19.5 📡 Cara Pakai dari Frontend / Postman

Setiap request yang butuh auth, kirim header:

```
Authorization: Bearer {token_dari_login}
Accept: application/json
```

### Contoh dengan Fetch API

```javascript
// Login
const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    body: JSON.stringify({
        email: 'user@example.com',
        password: 'password123',
    }),
});

const data = await response.json();
const token = data.data.token;

// Simpan token ke localStorage
localStorage.setItem('token', token);

// Request berikutnya pakai token
const productsResponse = await fetch('/api/products', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
    },
});
```

**Penjelasan contoh:**

- **`'Accept': 'application/json'`** — Penting! Agar Laravel return JSON (bukan redirect).
- **`'Authorization': 'Bearer {token}'`** — Format standar HTTP untuk token auth.
- **`localStorage.setItem('token', token)`** — Simpan token di browser. **Hati-hati XSS** — token bisa dicuri.

### Contoh dengan Axios

```javascript
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.example.com',
    headers: {
        'Accept': 'application/json',
    },
});

// Interceptor untuk auto-attach token
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Login
const { data } = await api.post('/login', {
    email: 'user@example.com',
    password: 'password123',
});
localStorage.setItem('token', data.data.token);

// Get products (token auto-attached)
const products = await api.get('/products');
```

**Penjelasan axios interceptor:**

- **`interceptors.request.use(...)`** — Auto-modify setiap request.
- Token otomatis di-attach di setiap request, tidak perlu manual.

## 19.6 🔐 Token Abilities (Permission per Token)

```php
// Buat token dengan ability terbatas
$token = $user->createToken(
    'mobile-app',
    ['read:products'] // Hanya bisa read products
)->plainTextToken;

// Token dengan beberapa abilities
$token = $user->createToken('admin-app', [
    'read:products',
    'write:products',
    'delete:products',
])->plainTextToken;

// Cek ability di controller
Route::middleware(['auth:sanctum', 'ability:write:products'])->group(function () {
    Route::post('/products', [ProductController::class, 'store']);
});

// Di controller
if ($request->user()->tokenCan('write:products')) {
    // Boleh
}
```

**Penjelasan token abilities:**

- **`abilities: ['read:products']`** — Token ini HANYA bisa read products, tidak bisa write.
- **`'ability:write:products'`** — Middleware cek ability di token.
- **`->tokenCan('xxx')`** — Programmatic check di controller.

::: tip 💡 Tips
Pakai abilities untuk token yang dipakai di berbagai aplikasi (web, mobile, dsb).
Misalnya: token mobile cuma bisa `read`, token admin bisa `read` + `write`.
:::

## 📌 Ringkasan Bab 19

| Konsep                | Penjelasan Singkat                                              |
| --------------------- | --------------------------------------------------------------- |
| Sanctum               | Package Laravel untuk API token authentication                 |
| `HasApiTokens` trait  | Tambahkan ke User model untuk fitur token                      |
| `createToken()`       | Generate token baru untuk user                                 |
| `currentAccessToken()`| Ambil token yang sedang dipakai                                 |
| Bearer Token          | Token dikirim di header `Authorization: Bearer xxx`             |
| Abilities             | Permission spesifik per token                                   |
| Token Expiration      | Token bisa expire otomatis dengan `expiresAt`                   |

---

➡️ Lanjut ke [Bab 20 — API Versioning & Best Practices](/bagian-5/bab-20)
