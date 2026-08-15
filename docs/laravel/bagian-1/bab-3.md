---
title: "Bab 3 — MVC: Cara Berpikir Laravel"
---

# 📖 Bab 3 — MVC — Cara Berpikir Laravel

## 3.1 🧩 Apa itu Arsitektur MVC?

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

**Penjelasan tiap komponen MVC:**

- **Request Masuk** — Browser mengirim HTTP request (misal: GET `/products`).
- **Controller** — "Konduktor" yang mengkoordinasi alur. Terima request, ambil data dari Model, lempar ke View.
- **Model** — Representasi tabel database + logic akses data. Dalam Laravel = Eloquent Model.
- **View** — Template Blade yang menampilkan HTML. Tidak punya business logic.
- **Response** — View di-render jadi HTML dan dikirim balik ke browser.

Pemisahan ini penting karena:
- **Testable** — bisa test Model tanpa harus setup HTTP.
- **Maintainable** — design berubah? edit View saja. Logic berubah? edit Model.
- **Reusable** — Model yang sama bisa dipakai di Controller berbeda.

## 3.2 🎬 Studi Kasus: Alur "Tampilkan Daftar Produk"

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

**Penjelasan alur detail:**

1. **User akses `/products`** — URL dimasukkan di browser.
2. **Route match** — Laravel cek `routes/web.php` dan menemukan `Route::get('/products', [ProductController::class, 'index'])`.
3. **Controller dipanggil** — Laravel membuat instance `ProductController` dan menjalankan method `index()`.
4. **Model query** — `Product::latest()->paginate(12)` — Eloquent generate SQL `SELECT * FROM products ORDER BY created_at DESC LIMIT 12 OFFSET 0`.
5. **Data dikembalikan** — Hasil query (array of Product objects) dikembalikan ke Controller.
6. **View dipilih** — `view('products.index', compact('products'))` memilih file `resources/views/products/index.blade.php`.
7. **View render** — Blade template memproses `$products` jadi HTML dengan loop `@foreach`.
8. **Response HTML** — HTML dikirim balik ke browser, user melihat halaman daftar produk.

## 3.3 📏 Tanggung Jawab Setiap Komponen

| Komponen        | Tanggung Jawab                                              | Yang TIDAK boleh dilakukan                                |
| --------------- | ----------------------------------------------------------- | --------------------------------------------------------- |
| **Controller**  | Terima request, validasi, panggil model/service, return response | Taruh query SQL langsung, taruh business logic kompleks   |
| **Model**       | Representasi tabel DB, relasi, query scope                  | Tidak tahu soal HTTP request/response                     |
| **View (Blade)** | Tampilkan data dalam HTML                                  | Tidak ada query database, tidak ada business logic        |

**Penjelasan tanggung jawab:**

- **Controller** — Hanya充当 koordinator. Tugasnya: parsing input, validasi sederhana, panggil Model/Service, return response.
- **Model** — Class yang Mewakili tabel database. Punya method seperti `find()`, `where()`, `create()`, relasi, scope. Tapi TIDAK BOLEH return HTTP response atau baca `$_GET`.
- **View** — Template Blade. Fungsi tunggal: render HTML. Tidak boleh ada query database atau business logic.

> ⚠️ **Controller Gemuk adalah Code Smell!**
> Jika controller Anda sudah lebih dari 50 baris per method, pertimbangkan
> memindahkan logic ke `Service` class. Controller seharusnya hanya koordinator.

## 3.4 🏛️ Laravel Service Layer (Best Practice)

Untuk project yang lebih besar, tambahkan layer `Service` di antara Controller dan Model:

```
┌────────────────────────────────────────────┐
│         ALUR DENGAN SERVICE LAYER          │
│                                            │
│  Request masuk                             │
│       ↓                                    │
│  CONTROLLER                                │
│       ↓                                    │
│  SERVICE (Business Logic)                  │
│       ↓                                    │
│  MODEL (Data Access)                       │
│       ↓                                    │
│  Response balik ke Controller              │
│       ↓                                    │
│  Response ke Browser                       │
└────────────────────────────────────────────┘
```

**Penjelasan Service Layer:**

- **Controller** — Tipis, hanya orchestrasi.
- **Service** — berisi business logic kompleks (misal: `OrderService::checkout()` yang orchestrate cart, payment, email).
- **Model** — Akses data murni.

```php
// app/Services/ProductService.php
namespace App\Services;

use App\Models\Product;

class ProductService
{
    public function getActiveProducts(int $perPage = 12)
    {
        return Product::active()
            ->inStock()
            ->latest()
            ->paginate($perPage);
    }

    public function createProduct(array $data): Product
    {
        return Product::create($data);
    }
}

// app/Http/Controllers/ProductController.php
class ProductController extends Controller
{
    public function __construct(
        private readonly ProductService $productService
    ) {}

    public function index()
    {
        $products = $this->productService->getActiveProducts();
        return view('products.index', compact('products'));
    }
}
```

**Penjelasan kode Service Layer:**

- **`ProductService`** — Class terpisah yang封装 business logic tentang produk. Misal: `getActiveProducts()` tidak hanya query, tapi sudah terapkan scope `active()` dan `inStock()`.
- **`ProductController`** — Menerima `ProductService` via constructor injection (DI). Tinggal panggil method, return view.
- Keuntungan:
  - **Testable** — Test `ProductService` tanpa harus bikin HTTP request.
  - **Reusable** — Service yang sama bisa dipanggil dari Controller, Command, Job.
  - **Ringkas** — Controller tetap tipis, fokus ke HTTP concern.

```php
public function __construct(
    private readonly ProductService $productService
) {}
```

**Penjelasan constructor injection (DI):**

- Laravel otomatis inject instance `ProductService` ke constructor. **Tidak perlu** `new ProductService()` manual.
- `readonly` keyword (PHP 8.1+) — property tidak bisa diubah setelah di-set, lebih aman.
- Tanda `private` — hanya bisa diakses dari dalam class.

::: tip 💡 Kapan Pakai Service?
- Business logic lebih dari 5–10 baris
- Logic yang dipakai di lebih dari satu Controller
- Logic yang perlu di-test terpisah dari HTTP
:::

## 📌 Ringkasan Bab 3

| Konsep        | Penjelasan                                                    |
| ------------- | ------------------------------------------------------------- |
| MVC           | Model-View-Controller — pola pemisahan komponen aplikasi      |
| Controller    | Koordinator: terima request, panggil model/service, return response |
| Model         | Representasi tabel & query database via Eloquent              |
| View (Blade)  | Template HTML yang menampilkan data                           |
| Service Layer | Best practice: pisahkan business logic dari controller        |
| Fat Controller | Code smell — pindahkan logic ke Service                        |

---

➡️ Lanjut ke [Bab 4 — Routing & Controller Dasar](/bagian-1/bab-4)
