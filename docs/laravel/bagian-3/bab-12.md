---
title: Bab 12 — Seeder, Factory & Database Testing
---

# 📖 Bab 12 — Seeder, Factory & Database Testing

## 12.1 🏭 Factory — Generator Data Dummy

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

**Penjelasan Factory:**

- **`definition()`** — Return array attribute default. Dipanggil tiap kali `Model::factory()->create()`.
- **`$this->faker`** — Faker PHP library. Generate data realistis (nama, email, alamat, dll).
- **`->words(3, true)`** — Generate 3 kata digabung. Parameter kedua `true` = return string (bukan array).
- **`$this->faker->numberBetween(50000, 5000000)`** — Random number dalam range.
- **`$this->faker->boolean(80)`** — 80% chance return true.
- **`Category::factory()`** — Auto-create category dulu, dapat ID-nya.

**Penjelasan Factory State:**

- **`outOfStock()`** — Method yang return factory dengan state `stock = 0`.
- **`expensive()`** — Factory variant untuk produk mahal.
- **`->state([...])`** — Override attribute default untuk factory ini.

### Cara Pakai Factory

```php
// Di tinker atau controller
Product::factory()->count(50)->create();                    // Buat 50 produk
Product::factory()->outOfStock()->count(10)->create();       // 10 produk habis stok
Product::factory()->expensive()->create();                    // 1 produk mahal

// Buat dengan override
Product::factory()->create([
    'name' => 'Produk Spesial',
    'price' => 999999,
]);

// Buat tanpa simpan ke DB (untuk testing)
$product = Product::factory()->make();
```

**Penjelasan cara pakai:**

- **`->count(50)`** — Generate 50 row.
- **`->outOfStock()`** — Pakai state yang sudah didefine.
- **`->create()`** — Save ke DB.
- **`->make()`** — Hanya buat object, tidak save. Berguna untuk test tanpa pollute DB.
- **`->create([...])`** — Override attribute sebelum create.

## 12.2 🌱 Seeder — Pengisi Data Awal

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

**Penjelasan Seeder:**

- **`run()`** — Method yang dijalankan saat `php artisan db:seed`.
- **`Category::factory(5)->create()`** — Generate 5 kategori.
- **`Product::factory(50)->create()`** — Generate 50 produk.
- **`Product::factory(10)->outOfStock()->create()`** — 10 produk habis stok.
- **`User::factory()->create([...])`** — Buat user admin dengan attribute custom.

### Seeder Terpisah (Best Practice)

```bash
php artisan make:seeder UserSeeder
php artisan make:seeder CategorySeeder
php artisan make:seeder ProductSeeder
```

```php
// database/seeders/UserSeeder.php
class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'name'  => 'Admin Toko',
            'email' => 'admin@toko.com',
            'role'  => 'admin',
        ]);

        User::factory(10)->create();
    }
}

// database/seeders/DatabaseSeeder.php
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
        ]);
    }
}
```

**Penjelasan best practice:**

- **Pisahkan** seeder per domain agar lebih manageable.
- **`$this->call([...])`** — Panggil seeder lain. Dijalankan berurutan.

```bash
# Jalankan seeder
php artisan db:seed

# Reset database + seed ulang (hati-hati! menghapus semua data)
php artisan migrate:fresh --seed

# Jalankan seeder tertentu
php artisan db:seed --class=UserSeeder
```

::: warning ⚠️ Peringatan
`migrate:fresh --seed` akan **menghapus semua data** di database. Jangan pernah jalankan di production!
:::

## 12.3 🧪 Database Testing dengan RefreshDatabase

```php
// tests/Feature/ProductTest.php

use App\Models\Product;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('can create a product', function () {
    $category = Category::factory()->create();

    $response = $this->post('/products', [
        'name'        => 'Laptop Gaming',
        'price'       => 15000000,
        'stock'       => 10,
        'category_id' => $category->id,
    ]);

    $response->assertRedirect('/products');
    $this->assertDatabaseHas('products', [
        'name' => 'Laptop Gaming',
    ]);
});

it('validates product data', function () {
    $response = $this->post('/products', [
        'name'  => '', // Invalid
        'price' => -100, // Invalid
    ]);

    $response->assertSessionHasErrors(['name', 'price']);
});
```

**Penjelasan RefreshDatabase:**

- **`uses(RefreshDatabase::class)`** — Pest helper. Setiap test dijalankan, DB di-migrate ulang.
- **`Category::factory()->create()`** — Setup data untuk test.
- **`$this->post('/products', [...])`** — Simulasi POST request.
- **`$response->assertRedirect('/products')`** — Assert response melakukan redirect.
- **`assertDatabaseHas('products', [...])`** — Cek row ada di DB.
- **`assertSessionHasErrors(['name', 'price'])`** — Cek validasi error untuk field tertentu.

### Trait Testing Penting

```php
// 1. RefreshDatabase — migrate ulang setiap test
use Illuminate\Foundation\Testing\RefreshDatabase;
uses(RefreshDatabase::class);

// 2. DatabaseMigrations — migrate:fresh setiap test
use Illuminate\Foundation\Testing\DatabaseMigrations;
uses(DatabaseMigrations::class);

// 3. DatabaseTruncation — truncate tables saja, lebih cepat
use Illuminate\Foundation\Testing\DatabaseTruncation;
uses(DatabaseTruncation::class);
```

**Penjelasan trait testing:**

- **`RefreshDatabase`** — Transaction-based. Setiap test rollback setelah selesai. Cepat.
- **`DatabaseMigrations`** — `migrate:fresh` tiap test. Lebih lambat, lebih clean.
- **`DatabaseTruncation`** — Truncate tables (bukan rollback). Untuk testing dengan FK kompleks.

## 12.4 🎯 Method Assertion Database

```php
// Assert ada di database
$this->assertDatabaseHas('products', [
    'name' => 'Laptop Gaming',
]);

// Assert tidak ada di database
$this->assertDatabaseMissing('products', [
    'name' => 'Produk Dihapus',
]);

// Assert jumlah record
$this->assertDatabaseCount('products', 10);

// Assert soft deleted
$this->assertSoftDeleted('products', ['id' => 1]);
```

## 📌 Ringkasan Bab 12

| Konsep                 | Penjelasan Singkat                                              |
| ---------------------- | --------------------------------------------------------------- |
| Factory                | Generator data dummy                                            |
| Factory State          | Variasi data dengan method khusus (`outOfStock()`, dll)         |
| Seeder                 | Isi data awal database                                          |
| `migrate:fresh --seed` | Reset + seed ulang (HATI-HATI: hapus semua data!)               |
| `RefreshDatabase`      | Trait testing untuk migrate ulang tiap test                     |
| `assertDatabaseHas`    | Assert data ada di database                                     |
| `assertDatabaseMissing`| Assert data tidak ada di database                               |

---

➡️ Lanjut ke [Bab 13 — Query Builder & Raw Query](/bagian-3/bab-13)
