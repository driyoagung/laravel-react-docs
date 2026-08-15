# ⚡ Ebook Laravel — From Zero to Production
### Panduan Lengkap Belajar Laravel 12 | MVC + Eloquent + REST API + Project Nyata

---

> 🎯 **Untuk Siapa Ebook Ini?**
> Ebook ini dirancang untuk **semua level** — mulai dari yang baru mengenal PHP,
> hingga yang sudah familiar dengan PHP prosedural dan ingin beralih ke framework modern.
> Setiap konsep dijelaskan dengan konteks, tidak ada yang dilewati begitu saja.

---

> 🧰 **Tech Stack yang Digunakan**
>
> | Tool | Fungsi |
> |---|---|
> | **Laravel 12** | Framework utama (PHP) |
> | **MySQL** | Database relasional |
> | **Eloquent ORM** | Interaksi database berbasis objek |
> | **Blade** | Template engine bawaan Laravel |
> | **Laravel Sanctum** | Autentikasi API (token-based) |
> | **Tailwind CSS** | Styling frontend |
> | **Vite** | Asset bundler (bawaan Laravel 12) |
> | **Postman** | Testing REST API |

---

## 🗺️ Peta Perjalanan Belajar

```
🟢 BAGIAN I    Fondasi Laravel             → Bab 1  – 4
🔵 BAGIAN II   Core Concepts Laravel       → Bab 5  – 9
🟡 BAGIAN III  Database & Eloquent ORM     → Bab 10 – 13
🟠 BAGIAN IV   Autentikasi & Keamanan      → Bab 14 – 16
🔴 BAGIAN V    REST API Development        → Bab 17 – 20
🟣 BAGIAN VI   Level Up                    → Bab 21 – 23
🏗️  BAGIAN VII  Project: E-Commerce API     → Bab 24
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: 7 Bagian | 24 Bab | Zero → Production Ready
```

---

## 🗺️ Jalur Belajar per Level

> 💡 **Tidak harus membaca berurutan!** Pilih jalur yang sesuai pengalaman Anda.

| Level | Jalur yang Disarankan |
|---|---|
| 🐣 **Pemula total (baru kenal PHP)** | Bab 1 → 2 → 3 → 4 → 5 → 6 → 10 → 11 → 14 → 24 |
| 🐥 **Sudah tahu PHP dasar** | Bab 1 → 2 → 4 → 5 → 7 → 10 → 12 → 14 → 17 → 19 → 24 |
| 🐦 **Dari framework lain (CodeIgniter, Slim)** | Bab 1 → 3 → 5 → 8 → 10 → 13 → 14 → 17 → 21 → 24 |

---

## ⭐ Bab Paling Kritis — Jangan Sampai Dilewati!

> ⚠️ **Catatan Penting:**
> Tiga bab berikut adalah **fondasi segalanya** di Laravel. Jika Anda merasa
> bingung di bab-bab selanjutnya, kemungkinan besar jawabannya ada di salah satu dari tiga bab ini.

| Prioritas | Bab | Mengapa Kritis |
|---|---|---|
| 🥇 | **Bab 5** — Service Container & Dependency Injection | Jantung dari seluruh arsitektur Laravel. Tanpa ini, semua "keajaiban" Laravel terasa seperti ilmu hitam. |
| 🥈 | **Bab 10** — Eloquent ORM | 90% pekerjaan Laravel berputar di sini. Model, relasi, query — semua ada di Eloquent. |
| 🥉 | **Bab 17** — REST API dengan Laravel | Keahlian yang paling dicari di pasar kerja. Resource, response format, dan API best practices. |

---

---

# 🟢 BAGIAN I — Fondasi Laravel

> 🎯 **Tujuan Bagian Ini:**
> Di akhir Bagian I, Anda sudah bisa menjalankan project Laravel pertama,
> memahami alur request dari browser hingga response, dan terbiasa
> dengan struktur folder Laravel yang terorganisir.

---

## 📖 Bab 1 — Mengenal Laravel & Ekosistemnya

---

### 1.1 🤔 Apa itu Laravel & Mengapa Populer?

Laravel adalah **framework PHP full-stack** yang dirancang untuk membuat pengembangan web menjadi menyenangkan dan ekspresif. Laravel menyediakan struktur yang jelas, tools yang lengkap, dan dokumentasi yang sangat baik — menjadikannya framework PHP paling populer di dunia.

> 💡 **Analogi Sederhana:**
> Jika PHP mentah adalah bahan-bahan masakan, maka Laravel adalah dapur
> profesional yang sudah dilengkapi peralatan lengkap, resep standar,
> dan sistem penyimpanan yang rapi. Anda tetap yang masak, tapi jauh lebih efisien.

---

### 1.2 ⚖️ Perbandingan Laravel vs CodeIgniter vs Symfony

| Aspek | Laravel 12 | CodeIgniter 4 | Symfony 7 |
|---|---|---|---|
| **Kurva belajar** | 🟡 Sedang | 🟢 Rendah | 🔴 Tinggi |
| **Fitur bawaan** | Sangat lengkap | Minimalis | Sangat lengkap |
| **Ekosistem** | Sangat luas | Terbatas | Luas |
| **ORM** | Eloquent (powerful) | Query Builder | Doctrine (complex) |
| **Performa** | Baik (dengan cache) | Sangat cepat | Sangat baik |
| **Komunitas** | ✅ Terbesar | Sedang | Besar |
| **Cocok untuk** | Semua skala | Project kecil-cepat | Enterprise besar |

---

### 1.3 🆕 Perubahan Besar di Laravel 12

| Fitur | Laravel 10 | Laravel 12 |
|---|---|---|
| **Struktur folder** | Penuh | Lebih ramping (banyak file dihapus) |
| **Middleware** | `app/Http/Middleware/` | Didaftarkan di `bootstrap/app.php` |
| **Kernel HTTP** | Ada | Dihapus |
| **Service Provider** | Banyak default | Dikurangi, `AppServiceProvider` saja |
| **Minimum PHP** | PHP 8.1 | PHP 8.2 |
| **Routing default** | `routes/web.php + api.php` | `routes/web.php` (api opsional) |

> ⚠️ **Catatan:**
> Ebook ini menggunakan **Laravel 12**. Banyak tutorial lama di internet masih
> menggunakan Laravel 8/9/10 — perhatikan perbedaan struktur foldernya.

---

### 1.4 🧰 Ekosistem Laravel — Gambaran Besar

```
LARAVEL ECOSYSTEM
│
├── Core
│   └── Laravel 12              → Framework utama
│
├── Official Packages
│   ├── Laravel Sanctum         → API token authentication
│   ├── Laravel Breeze          → Starter kit autentikasi (ringan)
│   ├── Laravel Jetstream       → Starter kit autentikasi (lengkap)
│   ├── Laravel Horizon         → Dashboard queue monitoring
│   └── Laravel Telescope       → Debugging & monitoring tool
│
├── Database Tools
│   ├── Eloquent ORM            → Object-relational mapper
│   ├── Migrations              → Version control untuk database
│   └── Seeders & Factories     → Data dummy untuk testing
│
├── Frontend Integration
│   ├── Vite                    → Asset bundler (built-in)
│   ├── Blade                   → Template engine bawaan
│   └── Inertia.js              → SPA tanpa API (pakai Vue/React)
│
└── Deployment
    ├── Laravel Forge           → Server management
    └── Laravel Vapor           → Serverless di AWS
```

---

### 1.5 🌐 Cara Kerja Laravel — Request Lifecycle

```
Browser / Client
      │
      │  HTTP Request
      ▼
index.php (public/)
      │
      ▼
Bootstrap & Service Container
      │
      ▼
HTTP Kernel → Global Middleware (CORS, Auth, dll)
      │
      ▼
Router (routes/web.php atau routes/api.php)
      │
      ▼
Route Middleware (auth, throttle, dll)
      │
      ▼
Controller → Logic bisnis
      │
      ├── Model (Eloquent) ↔ Database
      │
      ▼
Response (JSON / Blade View)
      │
      │  HTTP Response
      ▼
Browser / Client
```

---

## 📖 Bab 2 — Setup & Instalasi Project

---

### 2.1 📦 Kebutuhan Sistem

```bash
# Cek versi PHP (minimal 8.2)
php --version

# Cek Composer (package manager PHP)
composer --version

# Cek Node.js (untuk asset Vite)
node --version

# Cek MySQL
mysql --version
```

> 💡 **Rekomendasi Tools:**
> Gunakan **Laragon** (Windows) atau **Herd** (Mac) untuk setup lokal yang paling mudah.
> Keduanya sudah include PHP, MySQL, dan Nginx dalam satu paket.

---

### 2.2 🚀 Membuat Project Baru

```bash
# Buat project Laravel baru
composer create-project laravel/laravel nama-project

# Atau menggunakan Laravel Installer (lebih cepat)
composer global require laravel/installer
laravel new nama-project

# Masuk ke folder project
cd nama-project

# Jalankan dev server
php artisan serve
# Buka browser → http://localhost:8000

# Di terminal lain, jalankan Vite untuk asset
npm install && npm run dev
```

---

### 2.3 ⚙️ Konfigurasi File `.env`

```env
# .env — konfigurasi environment (jangan commit ke Git!)

APP_NAME=NamaAplikasi
APP_ENV=local
APP_KEY=base64:... # Di-generate otomatis saat install
APP_DEBUG=true
APP_URL=http://localhost:8000

# Konfigurasi Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nama_database
DB_USERNAME=root
DB_PASSWORD=

# Konfigurasi Mail (untuk kirim email)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=email@gmail.com
MAIL_PASSWORD=app_password
```

---

### 2.4 🗂️ Anatomi Folder Project Laravel 12

```
nama-project/
│
├── 📁 app/                     ← Semua logika aplikasi
│   ├── 📁 Http/
│   │   ├── 📁 Controllers/     ← Controller (logika request/response)
│   │   └── 📁 Requests/        ← Form Request (validasi)
│   ├── 📁 Models/              ← Eloquent Models (representasi tabel)
│   ├── 📁 Services/            ← Business logic (opsional, best practice)
│   └── 📁 Providers/
│       └── 📄 AppServiceProvider.php
│
├── 📁 bootstrap/
│   └── 📄 app.php              ← Titik bootstrap aplikasi (Laravel 12: middleware & routing didaftarkan di sini)
│
├── 📁 config/                  ← Semua file konfigurasi
│   ├── 📄 app.php
│   ├── 📄 database.php
│   └── 📄 auth.php
│
├── 📁 database/
│   ├── 📁 migrations/          ← Skema tabel database (versi-terkontrol)
│   ├── 📁 seeders/             ← Pengisi data awal
│   └── 📁 factories/           ← Generator data dummy
│
├── 📁 public/                  ← Document root (index.php ada di sini)
│
├── 📁 resources/
│   ├── 📁 views/               ← Template Blade (.blade.php)
│   ├── 📁 css/
│   └── 📁 js/
│
├── 📁 routes/
│   ├── 📄 web.php              ← Route untuk web (session, CSRF)
│   └── 📄 api.php              ← Route untuk API (stateless) — dibuat manual di L11
│
├── 📁 storage/                 ← File upload, log, cache
├── 📄 .env                     ← Konfigurasi environment
├── 📄 artisan                  ← CLI tool Laravel
└── 📄 composer.json            ← Daftar dependency PHP
```

> 💡 **Perbedaan `app/Http/Controllers/` vs `app/Services/`:**
> - `Controllers/` → Tangani request HTTP, validasi input, return response
> - `Services/` → Business logic murni (tidak tahu soal HTTP). Dipanggil oleh Controller.

---

### 2.5 ▶️ Perintah Artisan yang Wajib Dihapal

```bash
# Jalankan server development
php artisan serve

# Lihat semua route yang terdaftar
php artisan route:list

# Buat file baru
php artisan make:controller NamaController
php artisan make:model NamaModel -m          # -m = buat migration sekalian
php artisan make:migration create_nama_table
php artisan make:request NamaRequest
php artisan make:seeder NamaSeeder
php artisan make:factory NamaFactory
php artisan make:middleware NamaMiddleware
php artisan make:resource NamaResource       # Untuk API response

# Database
php artisan migrate                          # Jalankan migration
php artisan migrate:rollback                 # Batalkan migration terakhir
php artisan migrate:fresh --seed             # Reset + seed (HAPUS SEMUA DATA!)
php artisan db:seed                          # Jalankan seeder

# Cache & config
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan optimize

# Interaktif PHP shell
php artisan tinker
```

---

### 2.6 🛠️ Setup VS Code yang Direkomendasikan

| Ekstensi | Fungsi |
|---|---|
| **PHP Intelephense** | Autocomplete & type checking PHP |
| **Laravel Extension Pack** | Kumpulan ekstensi Laravel |
| **Blade Formatter** | Format file Blade otomatis |
| **DotENV** | Syntax highlighting file `.env` |
| **Thunder Client** | Testing API langsung dari VS Code |
| **GitLens** | Git integration yang lebih powerful |

---

## 📖 Bab 3 — MVC — Cara Berpikir Laravel

---

### 3.1 🧩 Apa itu Arsitektur MVC?

MVC (Model-View-Controller) adalah pola desain yang memisahkan aplikasi menjadi tiga komponen utama. Laravel sangat ketat mengikuti pola ini.

```
┌─────────────────────────────────────────────┐
│              ALUR MVC DI LARAVEL            │
│                                             │
│  Request masuk                              │
│       ↓                                     │
│  CONTROLLER                                 │
│  (Menerima request, koordinasi)             │
│       ↓              ↓                      │
│  MODEL            Langsung                  │
│  (Ambil/simpan    return View               │
│   data dari DB)                             │
│       ↓                                     │
│  Kembalikan data ke Controller              │
│       ↓                                     │
│  VIEW (Blade)                               │
│  (Tampilkan data ke user)                   │
│       ↓                                     │
│  Response ke Browser                        │
└─────────────────────────────────────────────┘
```

---

### 3.2 🎬 Studi Kasus: Alur "Tampilkan Daftar Produk"

```
User buka /products
      │
      ▼
routes/web.php → Route::get('/products', [ProductController::class, 'index'])
      │
      ▼
ProductController@index
  → $products = Product::latest()->paginate(12)
      │                │
      │         Model Product
      │         (query ke tabel 'products' di MySQL)
      │
      ▼
return view('products.index', compact('products'))
      │
      ▼
resources/views/products/index.blade.php
(Render HTML dengan data $products)
      │
      ▼
Response HTML ke Browser
```

---

### 3.3 📏 Tanggung Jawab Setiap Komponen

| Komponen | Tanggung Jawab | Yang TIDAK boleh dilakukan |
|---|---|---|
| **Controller** | Terima request, validasi, panggil model/service, return response | Taruh query SQL langsung, taruh business logic kompleks |
| **Model** | Representasi tabel DB, relasi, query scope | Tidak tahu soal HTTP request/response |
| **View (Blade)** | Tampilkan data dalam HTML | Tidak ada query database, tidak ada business logic |

> ⚠️ **Controller Gemuk adalah Code Smell!**
> Jika controller Anda sudah lebih dari 50 baris per method, pertimbangkan
> memindahkan logic ke `Service` class. Controller seharusnya hanya koordinator.

---

## 📖 Bab 4 — Routing & Controller Dasar

---

### 4.1 🗺️ Mendefinisikan Route Dasar

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

---

### 4.2 🎮 Controller: Membuat & Struktur

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

---

### 4.3 🏷️ Route Model Binding — Keajaiban Laravel

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

---

### 4.4 📋 Named Routes & URL Generation

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

---

---

# 🔵 BAGIAN II — Core Concepts Laravel

> 🎯 **Tujuan Bagian Ini:**
> Di akhir Bagian II, Anda memahami Service Container, Middleware,
> validasi yang benar, template Blade yang efisien, dan cara kerja
> session/cookie di Laravel.

---

## 📖 Bab 5 — Service Container & Dependency Injection

---

### 5.1 🤔 Apa itu Service Container?

Service Container adalah **kotak alat otomatis** milik Laravel yang tahu cara membuat dan menghubungkan semua objek (service) dalam aplikasi Anda.

> 💡 **Analogi:**
> Bayangkan Anda memesan kopi di kafe. Anda tidak perlu tahu bagaimana
> mesin kopi bekerja, dari mana biji kopinya, atau siapa yang cuci gelasnya.
> Anda hanya bilang "saya mau kopi" — dan semuanya tersedia.
> Service Container bekerja persis seperti itu untuk objek PHP.

---

### 5.2 ⚙️ Dependency Injection — Konsep Dasarnya

```php
// ❌ Cara lama — membuat objek secara manual (tightly coupled)
class OrderController extends Controller
{
    public function store(Request $request)
    {
        $mailer   = new Mailer(new SmtpDriver());     // manual!
        $payment  = new PaymentService(new Stripe()); // manual!
        $logger   = new Logger(new FileDriver());     // manual!

        // Sulit di-test, sulit diganti implementasinya
    }
}

// ✅ Cara Laravel — Dependency Injection via Constructor
class OrderController extends Controller
{
    public function __construct(
        private readonly MailService    $mail,
        private readonly PaymentService $payment,
        private readonly LogService     $logger,
    ) {}
    // Laravel otomatis inject semua dependency!
    // Mudah di-test (tinggal inject mock), mudah diganti
}
```

---

### 5.3 🏭 Service Provider — Tempat Mendaftarkan Binding

```php
// app/Providers/AppServiceProvider.php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\PaymentService;
use App\Services\StripePaymentService;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Binding: "Setiap kali ada yang minta PaymentService,
        // berikan instance dari StripePaymentService"
        $this->app->bind(PaymentService::class, StripePaymentService::class);

        // Singleton: instance yang sama dipakai sepanjang request
        $this->app->singleton(CacheService::class, function ($app) {
            return new CacheService(config('cache.driver'));
        });
    }

    public function boot(): void
    {
        // Jalankan setelah semua service terdaftar
        // Tempat untuk: model observer, view composer, dll
    }
}
```

---

### 5.4 🎭 Facades — Interface yang Elegan

```php
// Facades adalah "proxy statis" ke service di container
// Terlihat seperti static call, tapi sebenarnya instance dari container

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;

// DB Facade
$users = DB::table('users')->where('active', 1)->get();

// Cache Facade
Cache::put('key', 'value', now()->addHours(1));
$value = Cache::get('key', 'default');

// Storage Facade
Storage::disk('public')->put('file.jpg', $contents);
$url = Storage::url('file.jpg');
```

---

## 📖 Bab 6 — Blade Template Engine

---

### 6.1 🔤 Sintaks Dasar Blade

```blade
{{-- resources/views/products/index.blade.php --}}

{{-- Cetak variabel (auto-escape XSS) --}}
{{ $product->name }}

{{-- Cetak HTML mentah (hati-hati XSS!) --}}
{!! $product->description_html !!}

{{-- Kondisi --}}
@if ($product->stock > 0)
    <span class="badge-green">Tersedia</span>
@elseif ($product->stock === 0)
    <span class="badge-red">Habis</span>
@else
    <span class="badge-gray">Tidak diketahui</span>
@endif

{{-- Loop --}}
@foreach ($products as $product)
    <div>{{ $product->name }} — Rp {{ number_format($product->price) }}</div>
@endforeach

{{-- Loop dengan fallback jika data kosong --}}
@forelse ($products as $product)
    <div>{{ $product->name }}</div>
@empty
    <p>Tidak ada produk ditemukan.</p>
@endforelse

{{-- Akses data authenticated user --}}
@auth
    <p>Halo, {{ auth()->user()->name }}!</p>
@endauth

@guest
    <a href="{{ route('login') }}">Login</a>
@endguest
```

---

### 6.2 🏗️ Layouts & Template Inheritance

```blade
{{-- resources/views/layouts/app.blade.php (Master Layout) --}}
<!DOCTYPE html>
<html>
<head>
    <title>@yield('title', 'Default Title') — MyApp</title>
    @stack('styles')
</head>
<body>
    @include('layouts.navbar')

    <main class="container">
        @if (session('success'))
            <div class="alert-success">{{ session('success') }}</div>
        @endif

        @yield('content')  {{-- Konten halaman anak masuk di sini --}}
    </main>

    @include('layouts.footer')
    @stack('scripts')
</body>
</html>
```

```blade
{{-- resources/views/products/index.blade.php (Halaman Anak) --}}
@extends('layouts.app')

@section('title', 'Daftar Produk')

@section('content')
    <h1>Daftar Produk</h1>

    <div class="grid">
        @forelse ($products as $product)
            @include('products._card', ['product' => $product])
        @empty
            <p>Belum ada produk.</p>
        @endforelse
    </div>

    {{ $products->links() }} {{-- Pagination otomatis --}}
@endsection

@push('scripts')
    <script src="{{ asset('js/products.js') }}"></script>
@endpush
```

---

### 6.3 🧩 Blade Components — Cara Modern (Laravel 7+)

```bash
# Buat Blade component
php artisan make:component ProductCard
# Membuat: app/View/Components/ProductCard.php + resources/views/components/product-card.blade.php
```

```php
// app/View/Components/ProductCard.php
class ProductCard extends Component
{
    public function __construct(
        public readonly Product $product,
        public readonly bool    $showActions = true,
    ) {}

    public function render()
    {
        return view('components.product-card');
    }
}
```

```blade
{{-- resources/views/components/product-card.blade.php --}}
<div class="card">
    <img src="{{ $product->image_url }}" alt="{{ $product->name }}">
    <h3>{{ $product->name }}</h3>
    <p>Rp {{ number_format($product->price) }}</p>

    @if ($showActions)
        <a href="{{ route('products.show', $product) }}">Detail</a>
    @endif
</div>

{{-- Cara pakai di view lain --}}
{{-- <x-product-card :product="$product" :show-actions="false" /> --}}
```

---

## 📖 Bab 7 — Validasi & Form Request

---

### 7.1 ✅ Validasi Inline di Controller

```php
public function store(Request $request)
{
    // validate() otomatis redirect balik + flash error jika gagal
    $validated = $request->validate([
        'name'        => 'required|string|max:255',
        'email'       => 'required|email|unique:users,email',
        'password'    => 'required|min:8|confirmed', // confirmed = harus ada password_confirmation
        'price'       => 'required|numeric|min:0',
        'category_id' => 'required|exists:categories,id', // Harus ada di tabel categories
        'image'       => 'nullable|image|mimes:jpg,png,webp|max:2048', // Max 2MB
        'tags'        => 'nullable|array',
        'tags.*'      => 'string|max:50', // Validasi setiap elemen array
    ]);

    // $validated hanya berisi field yang lolos validasi
    Product::create($validated);
}
```

---

### 7.2 📋 Form Request — Validasi yang Terstruktur

```bash
php artisan make:request StoreProductRequest
```

```php
// app/Http/Requests/StoreProductRequest.php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    // Siapa yang boleh melakukan request ini?
    public function authorize(): bool
    {
        return auth()->user()->can('create-product'); // Cek permission
    }

    // Aturan validasi
    public function rules(): array
    {
        return [
            'name'        => 'required|string|max:255',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string|max:2000',
        ];
    }

    // Custom pesan error (opsional)
    public function messages(): array
    {
        return [
            'name.required'        => 'Nama produk wajib diisi.',
            'price.numeric'        => 'Harga harus berupa angka.',
            'category_id.exists'   => 'Kategori yang dipilih tidak valid.',
        ];
    }
}
```

```php
// Di Controller — jauh lebih bersih!
public function store(StoreProductRequest $request)
{
    // Jika sampai sini, validasi sudah pasti lolos
    // $request->validated() berisi data yang sudah bersih
    Product::create($request->validated());
    return redirect()->route('products.index')->with('success', 'Produk ditambahkan!');
}
```

---

### 7.3 🎨 Menampilkan Error Validasi di Blade

```blade
{{-- Tampilkan semua error --}}
@if ($errors->any())
    <div class="alert-error">
        <ul>
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

{{-- Tampilkan error per field --}}
<input
    type="text"
    name="name"
    value="{{ old('name') }}"  {{-- old() isi ulang form jika validasi gagal --}}
    class="{{ $errors->has('name') ? 'border-red' : '' }}"
>
@error('name')
    <span class="text-red">{{ $message }}</span>
@enderror
```

---

## 📖 Bab 8 — Middleware

---

### 8.1 🔒 Apa itu Middleware?

Middleware adalah **filter** yang dijalankan sebelum atau sesudah request mencapai Controller. Seperti lapisan keamanan berlapis.

```
Request → [Middleware 1] → [Middleware 2] → [Middleware 3] → Controller
                                                                  ↓
Response ← [Middleware 1] ← [Middleware 2] ← [Middleware 3] ← Response
```

---

### 8.2 🔧 Membuat Custom Middleware

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

---

## 📖 Bab 9 — Session, Cookie & Flash Message

---

### 9.1 💾 Session

```php
// Simpan data ke session
session(['user_preference' => 'dark_mode']);
// atau
$request->session()->put('cart', $cartData);

// Ambil data dari session
$preference = session('user_preference', 'light_mode'); // default: 'light_mode'

// Hapus dari session
session()->forget('cart');
session()->flush(); // Hapus semua

// Flash data (hanya ada untuk request BERIKUTNYA)
session()->flash('success', 'Data berhasil disimpan!');
// atau lebih mudah:
return redirect()->back()->with('success', 'Berhasil!');
```

---

### 9.2 🍪 Cookie

```php
// Membuat cookie
$cookie = cookie('theme', 'dark', 60 * 24 * 30); // 30 hari

// Kirim cookie bersama response
return response()->json(['ok' => true])->cookie($cookie);

// Membaca cookie
$theme = $request->cookie('theme', 'light');

// Hapus cookie
return response()->json(['ok' => true])->withoutCookie('theme');
```

---

---

# 🟡 BAGIAN III — Database & Eloquent ORM

> 🎯 **Tujuan Bagian Ini:**
> Menguasai cara Laravel berinteraksi dengan database — dari migration,
> model, relasi, hingga query optimization. Ini adalah bagian yang paling
> banyak Anda gunakan sehari-hari.

---

## 📖 Bab 10 — Eloquent ORM — Cara Berbicara dengan Database

---

### 10.1 🗄️ Migration — Version Control untuk Database

```bash
# Buat migration baru
php artisan make:migration create_products_table
```

```php
// database/migrations/2024_01_01_000000_create_products_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();                              // bigint unsigned auto_increment
            $table->foreignId('category_id')           // Foreign key ke tabel categories
                  ->constrained()                      // references id on categories
                  ->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 12, 2);           // 12 digit, 2 desimal
            $table->unsignedInteger('stock')->default(0);
            $table->string('image')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();                      // created_at + updated_at
            $table->softDeletes();                     // deleted_at (soft delete)
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
```

---

### 10.2 📦 Eloquent Model — Representasi Tabel

```php
// app/Models/Product.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    // Field yang boleh diisi secara massal (mass assignment protection)
    protected $fillable = [
        'category_id', 'name', 'slug', 'description',
        'price', 'stock', 'image', 'is_active',
    ];

    // Cast otomatis tipe data
    protected $casts = [
        'price'     => 'decimal:2',
        'is_active' => 'boolean',
        'tags'      => 'array',         // Simpan JSON sebagai array
    ];

    // Accessor — modifikasi nilai saat dibaca
    public function getPriceFormattedAttribute(): string
    {
        return 'Rp ' . number_format($this->price, 0, ',', '.');
    }

    // Mutator — modifikasi nilai saat disimpan
    public function setNameAttribute(string $value): void
    {
        $this->attributes['name'] = $value;
        $this->attributes['slug'] = \Str::slug($value);
    }

    // Local Scope — query yang sering dipakai
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeInStock($query)
    {
        return $query->where('stock', '>', 0);
    }
}
```

---

### 10.3 🔍 Query Eloquent yang Sering Dipakai

```php
// Ambil semua data
$products = Product::all();

// Ambil dengan kondisi
$activeProducts = Product::where('is_active', true)->get();

// Menggunakan scope yang sudah didefinisikan
$products = Product::active()->inStock()->latest()->get();

// Cari satu data
$product = Product::find(1);                  // null jika tidak ada
$product = Product::findOrFail(1);            // Throw 404 jika tidak ada
$product = Product::where('slug', 'laptop')->firstOrFail();

// Aggregasi
$total     = Product::count();
$avgPrice  = Product::active()->avg('price');
$maxPrice  = Product::max('price');

// Buat data baru
$product = Product::create([
    'name'  => 'Laptop Gaming',
    'price' => 15000000,
    'stock' => 10,
]);

// Update
$product->update(['stock' => 5]);
Product::where('category_id', 3)->update(['is_active' => false]);

// Hapus (soft delete jika pakai SoftDeletes)
$product->delete();
Product::where('stock', 0)->delete();

// Query lanjutan
$products = Product::select('id', 'name', 'price')
    ->whereBetween('price', [100000, 500000])
    ->whereIn('category_id', [1, 2, 3])
    ->orderBy('price', 'asc')
    ->limit(10)
    ->get();

// Pagination
$products = Product::active()->latest()->paginate(12);
// Gunakan {{ $products->links() }} di Blade untuk render link halaman
```

---

## 📖 Bab 11 — Relasi Eloquent

---

### 11.1–11.5 🔗 Jenis-Jenis Relasi

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

    // MANY TO MANY: Produk bisa punya banyak tag, tag bisa di banyak produk
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class)
            ->withTimestamps()          // created_at di pivot table
            ->withPivot('sort_order');  // Kolom tambahan di pivot table
    }

    // HAS MANY THROUGH: Produk → Reviews lewat User
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    // ONE TO ONE (Polymorphic): Produk & User bisa punya satu gambar
    public function image(): MorphOne
    {
        return $this->morphOne(Image::class, 'imageable');
    }
}

// app/Models/User.php
class User extends Model
{
    // MANY TO MANY (self-referencing): User bisa follow banyak user
    public function following(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'follows', 'follower_id', 'following_id');
    }
}
```

---

### 11.6 ⚡ Eager Loading — Hindari N+1 Problem

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

---

## 📖 Bab 12 — Seeder, Factory & Database Testing

---

### 12.1–12.3 🌱 Seeder & Factory

```php
// database/factories/ProductFactory.php
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        return [
            'category_id' => Category::factory(),
            'name'        => $this->faker->words(3, true),
            'description' => $this->faker->paragraph(3),
            'price'       => $this->faker->numberBetween(50000, 5000000),
            'stock'       => $this->faker->numberBetween(0, 100),
            'is_active'   => $this->faker->boolean(80), // 80% aktif
        ];
    }

    // Factory state untuk variasi data
    public function outOfStock(): static
    {
        return $this->state(['stock' => 0]);
    }

    public function expensive(): static
    {
        return $this->state(['price' => $this->faker->numberBetween(5000000, 50000000)]);
    }
}
```

```php
// database/seeders/DatabaseSeeder.php
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Buat 5 kategori
        $categories = Category::factory(5)->create();

        // Buat 50 produk aktif
        Product::factory(50)->create();

        // Buat 10 produk habis stok
        Product::factory(10)->outOfStock()->create();

        // Buat user admin
        User::factory()->create([
            'name'  => 'Admin',
            'email' => 'admin@example.com',
            'role'  => 'admin',
        ]);
    }
}
```

```bash
# Jalankan seeder
php artisan db:seed

# Reset database + seed ulang (hati-hati! menghapus semua data)
php artisan migrate:fresh --seed
```

---

## 📖 Bab 13 — Query Builder & Raw Query

---

### 13.1–13.3 🔧 Query Builder

```php
use Illuminate\Support\Facades\DB;

// Query Builder — mirip Eloquent tapi lebih low-level
$products = DB::table('products')
    ->select('products.*', 'categories.name as category_name')
    ->join('categories', 'products.category_id', '=', 'categories.id')
    ->where('products.is_active', true)
    ->whereNull('products.deleted_at')
    ->orderByDesc('products.created_at')
    ->paginate(12);

// Kapan pakai Query Builder vs Eloquent?
// Query Builder: query kompleks dengan banyak JOIN, agregasi berat, performa kritis
// Eloquent: CRUD biasa, relasi, lebih readable
```

---

---

# 🟠 BAGIAN IV — Autentikasi & Keamanan

> 🎯 **Tujuan Bagian Ini:**
> Implementasi autentikasi yang benar, aman, dan siap production —
> dari login biasa, role & permission, hingga autentikasi API dengan Sanctum.

---

## 📖 Bab 14 — Autentikasi dengan Laravel Breeze

---

### 14.1–14.3 🔐 Setup Autentikasi

```bash
# Install Laravel Breeze (starter kit autentikasi paling ringan)
composer require laravel/breeze --dev
php artisan breeze:install blade  # Pilih: blade, react, vue, api
npm install && npm run dev
php artisan migrate
```

> Breeze otomatis membuat:
> - Route: `/login`, `/register`, `/logout`, `/forgot-password`, dll
> - Controller: `AuthenticatedSessionController`, `RegisteredUserController`, dll
> - View: Blade views untuk semua halaman auth

---

### 14.4 👤 Mengakses User yang Login

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
```

---

### 14.5 🛡️ Gates & Policies — Otorisasi

```php
// app/Providers/AppServiceProvider.php

// Gate: aturan otorisasi sederhana
Gate::define('edit-product', function (User $user, Product $product) {
    return $user->id === $product->user_id || $user->role === 'admin';
});
```

```bash
# Policy: otorisasi untuk model tertentu
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

---

## 📖 Bab 15 — Role & Permission

---

### 15.1–15.3 🎭 Implementasi Role System

```php
// Cara sederhana: kolom role di tabel users
// users: id, name, email, password, role (enum: admin, seller, customer)

// app/Models/User.php
public function isAdmin(): bool
{
    return $this->role === 'admin';
}

public function isSeller(): bool
{
    return $this->role === 'seller';
}

// Middleware berdasarkan role
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

// Untuk sistem permission yang lebih kompleks → gunakan package spatie/laravel-permission
// composer require spatie/laravel-permission
```

---

## 📖 Bab 16 — Keamanan Laravel

---

### 16.1–16.4 🔒 Praktik Keamanan Penting

```php
// 1. CSRF Protection — sudah otomatis di route web
// Selalu sertakan @csrf di form
<form method="POST" action="/products">
    @csrf
    ...
</form>

// 2. Mass Assignment Protection
// Selalu definisikan $fillable atau $guarded di model
protected $fillable = ['name', 'price', 'stock']; // Whitelist
// JANGAN: protected $guarded = []; // Membuka semua field!

// 3. SQL Injection — Eloquent & Query Builder sudah aman
// ✅ Aman — pakai binding
DB::select('SELECT * FROM users WHERE email = ?', [$email]);
// ❌ Berbahaya — raw string
DB::select("SELECT * FROM users WHERE email = '$email'");

// 4. XSS — Blade {{ }} sudah auto-escape
{{ $userInput }}   // Aman — di-escape otomatis
{!! $userInput !!} // BERBAHAYA — gunakan hanya untuk HTML yang sudah dipercaya

// 5. Rate Limiting
Route::middleware('throttle:60,1')->group(function () { // 60 request per menit
    Route::post('/api/products', [ProductController::class, 'store']);
});
```

---

---

# 🔴 BAGIAN V — REST API Development

> 🎯 **Tujuan Bagian Ini:**
> Membangun REST API yang profesional, terdokumentasi, dan aman
> menggunakan Laravel — keahlian paling dicari di pasar kerja Laravel.

---

## 📖 Bab 17 — Dasar REST API dengan Laravel

---

### 17.1 📐 Prinsip RESTful API

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

---

### 17.2 🔧 Setup Route API di Laravel 12

```bash
# Di Laravel 12, routes/api.php tidak ada secara default
# Install dengan artisan
php artisan install:api
# Ini juga menginstall Laravel Sanctum otomatis
```

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

---

### 17.3 📦 API Resource — Format Response yang Konsisten

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

---

### 17.4 🎮 API Controller

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

---

## 📖 Bab 18 — API Response & Error Handling

---

### 18.1–18.3 📨 Standar Format Response API

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

```php
// app/Exceptions/Handler.php — Handle error API secara global
public function register(): void
{
    $this->renderable(function (\Exception $e, Request $request) {
        if ($request->expectsJson()) {
            if ($e instanceof ModelNotFoundException) {
                return response()->json(['message' => 'Data tidak ditemukan.'], 404);
            }
            if ($e instanceof AuthorizationException) {
                return response()->json(['message' => 'Akses ditolak.'], 403);
            }
            if ($e instanceof ValidationException) {
                return response()->json([
                    'message' => 'Validasi gagal.',
                    'errors'  => $e->errors(),
                ], 422);
            }
        }
    });
}
```

---

## 📖 Bab 19 — Autentikasi API dengan Sanctum

---

### 19.1–19.4 🔑 Implementasi Token Auth

```php
// app/Http/Controllers/Api/AuthController.php
class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
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
            'user'  => new UserResource($user),
            'token' => $token,
            'type'  => 'Bearer',
        ]);
    }

    public function logout(Request $request)
    {
        // Hapus token yang sedang dipakai
        $request->user()->currentAccessToken()->delete();

        // Atau hapus SEMUA token user (logout dari semua device)
        // $request->user()->tokens()->delete();

        return response()->json(['message' => 'Logout berhasil.']);
    }
}
```

```
// Cara pakai di Postman / frontend:
// Header setiap request yang butuh auth:
Authorization: Bearer {token_dari_login}
Accept: application/json
```

---

## 📖 Bab 20 — API Versioning & Best Practices

---

### 20.1–20.4 🏗️ API Versioning

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

---

---

# 🟣 BAGIAN VI — Level Up

> 🎯 **Tujuan Bagian Ini:**
> Teknik-teknik yang membedakan developer Laravel biasa
> dengan developer Laravel yang benar-benar mahir dan siap production.

---

## 📖 Bab 21 — Queue, Jobs & Email

---

### 21.1–21.3 📬 Queue & Background Jobs

```php
// Buat Job
// php artisan make:job SendWelcomeEmail

// app/Jobs/SendWelcomeEmail.php
class SendWelcomeEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public readonly User $user
    ) {}

    public function handle(): void
    {
        Mail::to($this->user->email)
            ->send(new WelcomeEmail($this->user));
    }

    // Jika job gagal
    public function failed(\Throwable $exception): void
    {
        Log::error("Gagal kirim email ke {$this->user->email}: {$exception->getMessage()}");
    }
}

// Dispatch job ke queue
SendWelcomeEmail::dispatch($user);                    // Langsung ke queue
SendWelcomeEmail::dispatch($user)->delay(now()->addMinutes(5)); // Tunda 5 menit

// Jalankan queue worker
// php artisan queue:work
// php artisan queue:work --sleep=3 --tries=3
```

---

### 21.4 📧 Kirim Email dengan Mailable

```bash
php artisan make:mail WelcomeEmail --markdown=emails.welcome
```

```php
// app/Mail/WelcomeEmail.php
class WelcomeEmail extends Mailable
{
    public function __construct(
        public readonly User $user
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Selamat datang di ' . config('app.name') . '!',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.welcome',
            with: ['user' => $this->user],
        );
    }
}
```

---

## 📖 Bab 22 — File Storage & Upload

---

### 22.1–22.3 📁 Manajemen File Upload

```php
// Controller: Handle upload file
public function store(Request $request)
{
    $request->validate([
        'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
    ]);

    if ($request->hasFile('image')) {
        // Simpan ke storage/app/public/products/
        $path = $request->file('image')->store('products', 'public');

        // URL publik: Storage::url($path)
        $product = Product::create([
            ...$request->validated(),
            'image' => $path,
        ]);
    }
}

// Hapus file lama saat update
public function update(Request $request, Product $product)
{
    if ($request->hasFile('image')) {
        Storage::disk('public')->delete($product->image); // Hapus lama
        $path = $request->file('image')->store('products', 'public');
        $product->image = $path;
    }

    $product->update($request->only(['name', 'price', 'stock']));
}

// Buat symlink public/storage → storage/app/public
// php artisan storage:link
```

---

## 📖 Bab 23 — Caching & Performance Optimization

---

### 23.1–23.4 ⚡ Caching Strategis

```php
use Illuminate\Support\Facades\Cache;

// Cache hasil query yang mahal
$topProducts = Cache::remember('products.top.10', now()->addHours(1), function () {
    return Product::with('category')
        ->active()
        ->orderByDesc('sold_count')
        ->limit(10)
        ->get();
});

// Cache dengan tag — mudah invalidasi per kelompok
$products = Cache::tags(['products', 'category:1'])->remember(
    'products.category.1',
    now()->addHours(6),
    fn() => Product::where('category_id', 1)->get()
);

// Hapus cache saat ada update
Cache::tags(['products'])->flush(); // Hapus semua cache bertag 'products'

// Cache configuration
Cache::forever('settings', Setting::pluck('value', 'key')->toArray());

// Observer untuk auto-invalidate cache
class ProductObserver
{
    public function saved(Product $product): void
    {
        Cache::tags(['products'])->flush();
    }

    public function deleted(Product $product): void
    {
        Cache::tags(['products'])->flush();
    }
}
```

---

---

# 🏗️ BAGIAN VII — Project: E-Commerce API

> 🎯 **Tujuan Bagian Ini:**
> Terapkan **semua** yang dipelajari dari Bab 1 hingga 23
> dalam satu project REST API nyata yang bisa masuk ke portfolio Anda.

---

## 📖 Bab 24 — Project E-Commerce REST API

---

### 24.1 🎯 Fitur yang Akan Dibangun

| Fitur | Teknologi yang Dipakai |
|---|---|
| ✅ Registrasi & Login dengan token | Laravel Sanctum |
| ✅ CRUD Produk dengan upload gambar | Eloquent + Storage |
| ✅ Kategori & tagging produk | Relasi Many-to-Many |
| ✅ Keranjang belanja | Session + Eloquent |
| ✅ Checkout & Pembuatan Order | Database Transaction |
| ✅ Manajemen Stok otomatis | Eloquent Observer |
| ✅ Riwayat Order user | Relasi HasMany |
| ✅ Role: Admin, Seller, Customer | Gates & Policy |
| ✅ Filter & pencarian produk | Eloquent Scope + Query Builder |
| ✅ Pagination response konsisten | API Resource + Pagination |
| ✅ Rate limiting per endpoint | Throttle Middleware |
| ✅ Email konfirmasi order | Queue + Mailable |
| ✅ Caching produk populer | Laravel Cache |
| ✅ Testing dengan Pest/PHPUnit | Feature Test + Unit Test |

---

### 24.2 🗄️ Skema Database

```
users           → id, name, email, password, role, created_at
categories      → id, name, slug, description
products        → id, category_id, user_id, name, slug, description, price, stock, image, is_active
tags            → id, name, slug
product_tag     → product_id, tag_id  (pivot)
product_images  → id, product_id, path, sort_order
carts           → id, user_id, created_at
cart_items      → id, cart_id, product_id, quantity, price
orders          → id, user_id, total, status, shipping_address, notes, created_at
order_items     → id, order_id, product_id, quantity, price, product_snapshot (JSON)
```

---

### 24.3 📁 Struktur Folder Final

```
app/
├── Http/
│   ├── Controllers/
│   │   └── Api/
│   │       ├── AuthController.php
│   │       ├── ProductController.php
│   │       ├── CategoryController.php
│   │       ├── CartController.php
│   │       └── OrderController.php
│   ├── Requests/
│   │   ├── StoreProductRequest.php
│   │   ├── UpdateProductRequest.php
│   │   └── CheckoutRequest.php
│   └── Resources/
│       ├── UserResource.php
│       ├── ProductResource.php
│       ├── OrderResource.php
│       └── OrderItemResource.php
├── Models/
│   ├── User.php
│   ├── Product.php
│   ├── Category.php
│   ├── Cart.php
│   ├── CartItem.php
│   ├── Order.php
│   └── OrderItem.php
├── Services/
│   ├── CartService.php      ← Logic keranjang belanja
│   ├── OrderService.php     ← Logic checkout & order
│   └── ProductService.php   ← Logic upload gambar, dll
├── Observers/
│   └── OrderObserver.php    ← Auto update stok saat order
├── Jobs/
│   └── SendOrderConfirmation.php
├── Mail/
│   └── OrderConfirmation.php
└── Policies/
    ├── ProductPolicy.php
    └── OrderPolicy.php
```

---

### 24.4 🔑 Endpoint API Lengkap

```
AUTH
POST   /api/v1/register
POST   /api/v1/login
POST   /api/v1/logout          [auth]
GET    /api/v1/me              [auth]

PRODUCTS (Publik)
GET    /api/v1/products
GET    /api/v1/products/{slug}
GET    /api/v1/products?category=elektronik&min_price=100000&q=laptop

PRODUCTS (Seller/Admin)
POST   /api/v1/products        [auth, seller]
PUT    /api/v1/products/{id}   [auth, seller]
DELETE /api/v1/products/{id}   [auth, seller]

CART
GET    /api/v1/cart            [auth]
POST   /api/v1/cart/items      [auth]
PUT    /api/v1/cart/items/{id} [auth]
DELETE /api/v1/cart/items/{id} [auth]

ORDERS
POST   /api/v1/orders          [auth] ← Checkout
GET    /api/v1/orders          [auth] ← Riwayat order user
GET    /api/v1/orders/{id}     [auth]

ADMIN
GET    /api/v1/admin/orders    [auth, admin]
PATCH  /api/v1/admin/orders/{id}/status [auth, admin]
```

---

### 24.5 🛒 Studi Kasus: Proses Checkout dengan Database Transaction

```php
// app/Services/OrderService.php

class OrderService
{
    public function checkout(User $user, array $data): Order
    {
        return DB::transaction(function () use ($user, $data) {
            $cart = $user->cart()->with('items.product')->firstOrFail();

            if ($cart->items->isEmpty()) {
                throw new \Exception('Keranjang belanja kosong.');
            }

            // Cek stok dan hitung total
            $total = 0;
            foreach ($cart->items as $item) {
                if ($item->product->stock < $item->quantity) {
                    throw new \Exception("Stok {$item->product->name} tidak mencukupi.");
                }
                $total += $item->price * $item->quantity;
            }

            // Buat order
            $order = Order::create([
                'user_id'          => $user->id,
                'total'            => $total,
                'status'           => 'pending',
                'shipping_address' => $data['address'],
            ]);

            // Buat order items & kurangi stok
            foreach ($cart->items as $item) {
                OrderItem::create([
                    'order_id'         => $order->id,
                    'product_id'       => $item->product_id,
                    'quantity'         => $item->quantity,
                    'price'            => $item->price,
                    'product_snapshot' => $item->product->toArray(), // Snapshot harga
                ]);

                // Kurangi stok secara atomic (hindari race condition)
                $item->product->decrement('stock', $item->quantity);
            }

            // Kosongkan keranjang
            $cart->items()->delete();

            // Kirim email konfirmasi (via queue)
            SendOrderConfirmation::dispatch($order, $user);

            return $order;
        });
        // Jika ada exception → semua perubahan di-rollback otomatis!
    }
}
```

---

### 24.6 🧪 Testing dengan Pest

```php
// tests/Feature/Api/ProductTest.php

use App\Models\User;
use App\Models\Product;
use App\Models\Category;

it('can get list of products', function () {
    Product::factory(5)->create();

    $response = $this->getJson('/api/v1/products');

    $response->assertOk()
        ->assertJsonStructure([
            'data' => [
                '*' => ['id', 'name', 'price', 'stock', 'category'],
            ],
            'meta' => ['total', 'per_page'],
        ]);
});

it('requires authentication to create product', function () {
    $this->postJson('/api/v1/products', [])
        ->assertUnauthorized();
});

it('seller can create product', function () {
    $seller   = User::factory()->seller()->create();
    $category = Category::factory()->create();

    $response = $this->actingAs($seller)
        ->postJson('/api/v1/products', [
            'name'        => 'Produk Test',
            'price'       => 150000,
            'stock'       => 10,
            'category_id' => $category->id,
        ]);

    $response->assertCreated()
        ->assertJsonPath('data.name', 'Produk Test');

    $this->assertDatabaseHas('products', ['name' => 'Produk Test']);
});
```

---

### 24.7 🚀 Deploy ke Production

```bash
# Persiapan sebelum deploy
composer install --no-dev --optimize-autoloader
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force

# Variabel environment di server (jangan kirim .env ke Git!)
APP_ENV=production
APP_DEBUG=false
APP_KEY=...
DB_PASSWORD=...

# Supervisor untuk queue worker
[program:laravel-worker]
command=php /var/www/html/artisan queue:work --sleep=3 --tries=3 --max-time=3600
```

---

## 📊 Ringkasan Struktur Final Ebook

```
📚 EBOOK LARAVEL — FROM ZERO TO PRODUCTION
│
├── 🟢 BAGIAN I   — Fondasi Laravel            Bab 1  – 4
│   ├── Bab 1  ─ Mengenal Laravel & Ekosistemnya
│   ├── Bab 2  ─ Setup & Instalasi Project
│   ├── Bab 3  ─ MVC — Cara Berpikir Laravel
│   └── Bab 4  ─ Routing & Controller Dasar
│
├── 🔵 BAGIAN II  — Core Concepts Laravel      Bab 5  – 9
│   ├── Bab 5  ─ Service Container & Dependency Injection
│   ├── Bab 6  ─ Blade Template Engine
│   ├── Bab 7  ─ Validasi & Form Request
│   ├── Bab 8  ─ Middleware
│   └── Bab 9  ─ Session, Cookie & Flash Message
│
├── 🟡 BAGIAN III — Database & Eloquent ORM    Bab 10 – 13
│   ├── Bab 10 ─ Eloquent ORM & Migration
│   ├── Bab 11 ─ Relasi Eloquent (HasMany, BelongsTo, dll)
│   ├── Bab 12 ─ Seeder, Factory & Database Testing
│   └── Bab 13 ─ Query Builder & Raw Query
│
├── 🟠 BAGIAN IV  — Autentikasi & Keamanan     Bab 14 – 16
│   ├── Bab 14 ─ Autentikasi dengan Laravel Breeze
│   ├── Bab 15 ─ Role & Permission
│   └── Bab 16 ─ Keamanan Laravel (CSRF, XSS, SQL Injection)
│
├── 🔴 BAGIAN V   — REST API Development       Bab 17 – 20
│   ├── Bab 17 ─ Dasar REST API dengan Laravel
│   ├── Bab 18 ─ API Response & Error Handling
│   ├── Bab 19 ─ Autentikasi API dengan Sanctum
│   └── Bab 20 ─ API Versioning & Best Practices
│
├── 🟣 BAGIAN VI  — Level Up                   Bab 21 – 23
│   ├── Bab 21 ─ Queue, Jobs & Email
│   ├── Bab 22 ─ File Storage & Upload
│   └── Bab 23 ─ Caching & Performance Optimization
│
└── 🏗️  BAGIAN VII — Project E-Commerce API     Bab 24
    └── Bab 24 ─ Project REST API E-Commerce Lengkap

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total  :  7 Bagian  |  24 Bab
Target :  Semua level (pemula hingga menengah)
Stack  :  Laravel 12 + MySQL + Sanctum + Eloquent + Queue + Vite
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

*Ebook Laravel — From Zero to Production*
*Laravel 12 + MySQL + Eloquent ORM + Sanctum + Queue + Tailwind CSS*