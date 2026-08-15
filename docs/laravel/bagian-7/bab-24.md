---
title: Bab 24 — Project E-Commerce REST API
---

# 📖 Bab 24 — Project E-Commerce REST API

> 🎯 **Project Capstone** — Terapkan SEMUA ilmu dari Bab 1–23 dalam project nyata!

## 24.1 🎯 Fitur yang Akan Dibangun

| Fitur                                    | Bab Referensi |
| ---------------------------------------- | ------------- |
| ✅ Registrasi & Login dengan token        | Bab 19        |
| ✅ CRUD Produk dengan upload gambar       | Bab 10, 22    |
| ✅ Kategori & tagging produk              | Bab 11        |
| ✅ Keranjang belanja                      | Bab 9         |
| ✅ Checkout & Pembuatan Order             | Bab 10        |
| ✅ Manajemen Stok otomatis                | Bab 11, 21    |
| ✅ Riwayat Order user                     | Bab 11        |
| ✅ Role: Admin, Seller, Customer          | Bab 14, 15    |
| ✅ Filter & pencarian produk              | Bab 17        |
| ✅ Pagination response konsisten          | Bab 17        |
| ✅ Rate limiting per endpoint             | Bab 18        |
| ✅ Email konfirmasi order                 | Bab 21        |
| ✅ Caching produk populer                 | Bab 23        |
| ✅ Testing dengan Pest/PHPUnit            | Bab 12        |

## 24.2 🗄️ Skema Database

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

## 24.3 📁 Struktur Folder Final

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

## 24.4 🔑 Endpoint API Lengkap

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

## 24.5 🛒 Checkout dengan Database Transaction

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

**Penjelasan checkout flow:**

- **`DB::transaction()`** — Semua query di dalam closure atomic. Jika exception → rollback otomatis.
- **`$cart->cart()->with('items.product')`** — Eager load untuk hindari N+1.
- **`->firstOrFail()`** — Throw 404 jika cart user tidak ada.
- **`->decrement('stock', $n)`** — Atomic SQL `UPDATE ... SET stock = stock - n`. **Lebih aman** dari `$item->product->stock -= $n` (yang bisa kena race condition).
- **`$item->product->toArray()`** — Snapshot produk saat checkout. Penting untuk audit jika harga/nama produk berubah di kemudian hari.
- **`SendOrderConfirmation::dispatch()`** — Email via queue. User tidak tunggu.

::: tip 💡 Kenapa Pakai DB::transaction?
- **Atomicity**: Semua query berhasil atau semua di-rollback
- **Konsistensi**: Stok produk dan jumlah order selalu konsisten
- **Race condition**: `decrement` dengan row lock mencegah double-spending stok
:::

## 24.6 🧪 Testing dengan Pest

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

**Penjelasan testing:**

- **`Product::factory(5)->create()`** — Generate 5 produk untuk test.
- **`$this->getJson(...)`** — Simulasi GET request ke API.
- **`assertJsonStructure([...])`** — Cek response punya struktur JSON tertentu.
- **`actingAs($seller)`** — Set user yang sedang login untuk test ini.
- **`assertDatabaseHas()`** — Cek row ada di database.

## 24.7 🚀 Deploy ke Production

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

**Penjelasan deploy:**

- **`composer install --no-dev`** — Skip dev dependencies (testing, debug).
- **`--optimize-autoloader`** — Optimalkan autoload class.
- **`php artisan config:cache`** — Cache config (production optimization).
- **`migrate --force`** — Jalankan migration tanpa konfirmasi.
- **`APP_DEBUG=false`** — **WAJIB** di production. Jangan expose error detail.
- **`Supervisor`** — Process manager untuk Linux. Restart queue worker jika crash.

## 24.8 📚 Referensi Tambahan

Untuk implementasi lengkap setiap file, lihat contoh project:

- 📁 **Repository Pattern dengan Service Layer** — best practice Laravel
- 🧪 **Test-Driven Development (TDD)** — tulis test sebelum kode
- 🚀 **CI/CD Pipeline** — GitHub Actions untuk auto-deploy
- 📊 **API Documentation dengan Swagger** — auto-generated docs
- 🔍 **Log Monitoring dengan Sentry** — track error di production

## 📌 Penutup

Selamat! 🎉 Jika Anda sudah menyelesaikan semua bab dari 1 hingga 24, berarti Anda sudah menguasai:

| Skill                              | Level      |
| ---------------------------------- | ---------- |
| ✅ Arsitektur MVC Laravel          | Mahir      |
| ✅ Service Container & DI          | Mahir      |
| ✅ Eloquent ORM & Relasi           | Mahir      |
| ✅ Autentikasi (Breeze + Sanctum)  | Mahir      |
| ✅ REST API Best Practices         | Mahir      |
| ✅ Queue, Email, Storage, Caching  | Mahir      |
| ✅ Testing dengan Pest             | Mahir      |
| ✅ Deployment ke Production        | Mahir      |

Anda siap menjadi **Laravel Developer Profesional** yang dicari industri! 💼

---

🎉 **Terima kasih sudah membaca Ebook Laravel — From Zero to Production!**

Jangan lupa untuk:
- ⭐ Star repository ini jika bermanfaat
- 📢 Share ke teman-teman developer Indonesia
- 💼 Masukkan project Bab 24 ke portfolio Anda
- 🚀 Lanjut belajar ke Ebook React / Vue / dst.

🇮🇩 Selamat berkarya dari Indonesia untuk dunia!
