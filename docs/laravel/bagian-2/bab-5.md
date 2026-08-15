---
title: Bab 5 — Service Container & Dependency Injection
---

# 📖 Bab 5 — Service Container & Dependency Injection

> ⭐ **Bab PALING KRITIS** di seluruh ebook ini!

## 5.1 🤔 Apa itu Service Container?

Service Container adalah **kotak alat otomatis** milik Laravel yang tahu cara membuat dan menghubungkan semua objek (service) dalam aplikasi Anda.

> 💡 **Analogi:**
> Bayangkan Anda memesan kopi di kafe. Anda tidak perlu tahu bagaimana
> mesin kopi bekerja, dari mana biji kopinya, atau siapa yang cuci gelasnya.
> Anda hanya bilang "saya mau kopi" — dan semuanya tersedia.
> Service Container bekerja persis seperti itu untuk objek PHP.

**Penjelasan lebih detail Service Container:**

- Service Container adalah **singleton** yang hidup selama aplikasi berjalan.
- Tugasnya: tahu cara **membuat** (instantiate) dan **menghubungkan** (inject) objek.
- Saat Controller butuh `PaymentService`, Container otomatis:
  1. Cek: ada binding `PaymentService`? Pakai itu.
  2. Tidak ada? Reflection — baca constructor, auto-resolve semua dependency.
  3. Inject hasilnya.
- Anda tidak perlu `new PaymentService()` di mana-mana. Container yang urus.

## 5.2 ⚙️ Dependency Injection — Konsep Dasarnya

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

**Penjelasan perbandingan:**

**Cara Manual (Anti-pattern):**

- `new Mailer(...)` — Anda sendiri yang instantiate. Masalah:
  - Kalau `Mailer` butuh dependency lain, Anda harus instantiate manual juga.
  - Susah di-test — tidak bisa ganti `Mailer` dengan mock.
  - tightly coupled — kode tahu detail implementasi.

**Cara Laravel (Dependency Injection):**

- Cukup deklarasikan tipe dependency di constructor.
- Laravel otomatis inject dependency yang dibutuhkan.
- Testable — bisa kirim mock dependency.
- loosely coupled — tidak peduli bagaimana dependency dibuat.

**Penjelasan keyword `readonly` (PHP 8.1+):**

- `private readonly MailService $mail` — property ini hanya bisa di-set sekali (di constructor) dan tidak bisa diubah lagi.
- Lebih aman dari inkonsistensi data.
- Disarankan untuk semua property DI.

**Penjelasan keyword `private`:**

- Hanya bisa diakses dari dalam class itu sendiri.
- Best practice: dependency injection selalu `private`.

## 5.3 🏭 Service Provider — Tempat Mendaftarkan Binding

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

**Penjelasan method Service Provider:**

- **`register()`** — Tempat mendaftarkan semua binding. Dipanggil SEBELUM service lain dipakai.
- **`boot()`** — Dipanggil SETELAH semua service provider lain sudah ter-register. Tempat untuk:
  - `View::composer('*', function ($view) { ... })` — kirim data ke semua view.
  - `Model::observe(...)` — model observer.
  - `Route::macro(...)` — custom route macro.

**Penjelasan method binding:**

```php
$this->app->bind(PaymentService::class, StripePaymentService::class);
```

- Saat Container butuh `PaymentService`, dia buat instance `StripePaymentService`.
- Cocok untuk stateless service (tidak simpan state).

```php
$this->app->singleton(CacheService::class, function ($app) {
    return new CacheService(config('cache.driver'));
});
```

- Sama dengan `bind`, tapi instance yang sama dipakai sepanjang request.
- Cocok untuk service yang simpan state (cache, logger, connection).
- Closure dipanggil sekali, return instance yang di-cache.

### Jenis-Jenis Binding

```php
// 1. Bind — instance baru setiap kali diminta
$this->app->bind(PaymentService::class, StripePaymentService::class);

// 2. Singleton — instance yang sama sepanjang aplikasi
$this->app->singleton(CacheService::class, function ($app) {
    return new CacheService(config('cache.driver'));
});

// 3. Instance — bind instance yang sudah ada
$service = new PaymentService();
$this->app->instance(PaymentService::class, $service);

// 4. Contextual Binding — binding yang bergantung pada konteks
$this->app->when(PhotoController::class)
    ->needs(Filesystem::class)
    ->give(function () {
        return Storage::disk('s3');
    });
```

**Penjelasan tiap jenis:**

- **`bind()`** — Setiap kali Container butuh `PaymentService`, buat instance `StripePaymentService` baru. Stateless.
- **`singleton()`** — Instance yang sama dipakai sepanjang request. Cocok untuk cache, logger, database connection.
- **`instance()`** — Bind instance yang sudah ada. Berguna untuk object config atau testing.
- **`when()->needs()->give()`** — Contextual binding. Saat `PhotoController` butuh `Filesystem`, berikan `Storage::disk('s3')`. Tapi untuk controller lain, berikan default.

## 5.4 🎭 Facades — Interface yang Elegan

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

// Mail Facade
Mail::to('user@example.com')->send(new WelcomeEmail());
```

**Penjelasan Facade:**

- **Facade** adalah class yang menyediakan static-like access (`Cache::get()`) ke service di container.
- Di balik layar, Laravel resolve `Cache::get()` menjadi `$app->make('cache')->get()`.
- Keuntungan:
  - Syntax lebih pendek dan ekspresif.
  - Mudah di-mock saat testing (Facade bisa di-swap).
- Kekurangan:
  - Tidak jelas dependency-nya (tidak terlihat di constructor).
  - Bisa bikin bingung antara static vs instance.

### Facade vs Helper Function

```php
// Dua cara ini sebenarnya mengakses service yang sama dari container:

// Via Facade
Cache::put('key', 'value', 60);
$value = Cache::get('key');

// Via Helper
cache('key', 'value', 60);
$value = cache('key');
```

**Penjelasan:**

- `cache('key', 'value')` adalah helper function, sama dengan `Cache::put('key', 'value')`.
- Lebih ringkas, tapi kurang eksplisit.
- Helper function biasanya untuk penggunaan sekali, Facade untuk chain (seperti `Cache::tags()->remember()`).

::: tip 💡 Kapan Pakai Apa?
- **Facade**: saat butuh IDE autocomplete yang baik (lebih jelas dari mana asalnya)
- **Helper**: saat kode lebih ringkas dan konteksnya sudah jelas
:::

## 5.5 🔄 Container Resolution — Bagaimana Laravel Bekerja

```php
// Saat Laravel melihat ini di Controller:
class UserController extends Controller
{
    public function __construct(
        private UserRepository $users,    // ← Laravel resolve dari container
        private LoggerInterface $logger,  // ← Laravel resolve dari container
    ) {}
}

// Yang terjadi di belakang layar:
// 1. Laravel lihat `UserRepository` butuh dependency apa
// 2. Cek apakah sudah ada binding → pakai yang ada
// 3. Jika belum → coba buat otomatis via reflection
// 4. Resolve semua dependency secara rekursif
// 5. Inject semuanya ke constructor
```

**Penjelasan step-by-step container resolution:**

1. **Laravel lihat type hint** — `UserRepository $users` → Laravel cek Container: "Ada binding `UserRepository`?"
2. **Cek binding** — Jika ada (misal `bind(UserRepository::class, EloquentUserRepository::class)`), pakai implementasi yang di-bind.
3. **Auto-resolve via reflection** — Jika tidak ada binding, Laravel pakai PHP `Reflection` untuk membaca constructor `UserRepository`, lalu resolve semua parameter-nya.
4. **Recursive resolution** — Kalau `UserRepository` butuh `Database`, Laravel resolve `Database` dulu, baru `UserRepository`.
5. **Inject** — Hasil akhir di-inject ke constructor `UserController`.

## 5.6 🧪 Testable Code dengan DI

```php
// app/Services/PaymentService.php (interface)
interface PaymentService
{
    public function charge(float $amount): bool;
}

// app/Services/StripePaymentService.php (implementasi)
class StripePaymentService implements PaymentService
{
    public function charge(float $amount): bool
    {
        // Real Stripe API call
        return true;
    }
}

// app/Services/MockPaymentService.php (untuk testing)
class MockPaymentService implements PaymentService
{
    public function charge(float $amount): bool
    {
        // Selalu sukses tanpa real API call
        return true;
    }
}

// tests/Feature/CheckoutTest.php
class CheckoutTest extends TestCase
{
    public function test_user_can_checkout()
    {
        // Swap binding dengan mock
        $this->app->bind(PaymentService::class, MockPaymentService::class);

        $user = User::factory()->create();
        $response = $this->actingAs($user)->post('/checkout');

        $response->assertSuccessful();
    }
}
```

**Penjelasan Testable Code:**

- **`PaymentService` (interface)** — Kontrak. Mendefinisikan method apa saja yang harus ada.
- **`StripePaymentService` (real)** — Implementasi yang connect ke Stripe API.
- **`MockPaymentService` (mock)** — Implementasi palsu untuk testing. Tidak hit Stripe beneran, langsung return `true`.
- **Di test** — `$this->app->bind()` swap binding. Laravel pakai `MockPaymentService` selama test.
- Hasil: test cepat, reliable, tidak butuh koneksi Stripe.

::: warning ⚠️ Anti-pattern
Hindari `new ClassName()` di dalam Controller! Selalu gunakan Dependency Injection agar kode Anda testable dan loosely coupled.
:::

## 📌 Ringkasan Bab 5

| Konsep                 | Penjelasan Singkat                                              |
| ---------------------- | --------------------------------------------------------------- |
| Service Container      | "Kotak ajaib" Laravel yang mengelola semua objek               |
| Dependency Injection   | Laravel otomatis inject dependency yang dibutuhkan              |
| Service Provider       | Tempat mendaftarkan binding container                           |
| `bind()`               | Binding — instance baru setiap kali diminta                     |
| `singleton()`          | Instance yang sama sepanjang aplikasi                          |
| Facade                 | Proxy statis untuk akses service container                      |
| Testable Code          | Dengan DI, mudah mengganti real service dengan mock             |

---

➡️ Lanjut ke [Bab 6 — Blade Template Engine](/bagian-2/bab-6)
