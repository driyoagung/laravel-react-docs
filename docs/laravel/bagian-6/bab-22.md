---
title: Bab 22 — File Storage & Upload
---

# 📖 Bab 22 — File Storage & Upload

## 22.1 📁 Konfigurasi Storage

Laravel punya beberapa "disk" untuk menyimpan file:

```php
// config/filesystems.php

return [
    'default' => env('FILESYSTEM_DISK', 'local'),

    'disks' => [
        'local' => [
            'driver' => 'local',
            'root'   => storage_path('app'), // storage/app/
        ],

        'public' => [
            'driver'     => 'local',
            'root'       => storage_path('app/public'),
            'url'        => env('APP_URL') . '/storage',
            'visibility' => 'public',
        ],

        's3' => [
            'driver' => 's3',
            'key'    => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'region' => env('AWS_DEFAULT_REGION'),
            'bucket' => env('AWS_BUCKET'),
        ],
    ],
];
```

**Penjelasan disks:**

- **`local`** — Default. Simpan di `storage/app/`. Private, hanya bisa diakses via PHP.
- **`public`** — Simpan di `storage/app/public/`. **Bisa diakses publik** via `/storage/...` (setelah `storage:link`).
- **`s3`** — Amazon S3 (cloud). Untuk production dengan traffic tinggi.

### Buat Symlink untuk Public Disk

```bash
php artisan storage:link
# Membuat symlink: public/storage -> storage/app/public
```

**Penjelasan `storage:link`:**

- Membuat symlink di `public/storage` → `storage/app/public`.
- Tanpa ini, file di public disk tidak bisa diakses via web.
- Hanya perlu dijalankan sekali (saat deploy).

## 22.2 📤 Upload File Sederhana

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

        $product = Product::create([
            ...$request->validated(),
            'image' => $path,
        ]);

        // URL publik: Storage::url($path)
        // → http://localhost:8000/storage/products/xxx.jpg
    }
}
```

**Penjelasan upload flow:**

- **`$request->validate()`** — Pastikan file valid. (Akan throw 422 jika tidak).
- **`$request->hasFile('image')`** — Cek apakah request ada file `image`.
- **`->store('products', 'public')`** — Simpan file di `products/` di public disk. Return string path.
- **`Storage::url($path)`** — Generate URL publik untuk akses dari frontend.

## 22.3 🔄 Update File (Hapus yang Lama)

```php
public function update(Request $request, Product $product)
{
    $request->validate([
        'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
    ]);

    if ($request->hasFile('image')) {
        // Hapus file lama
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        // Simpan file baru
        $path = $request->file('image')->store('products', 'public');
        $product->image = $path;
    }

    $product->update($request->only(['name', 'price', 'stock']));
}
```

**Penjelasan update file:**

- **`nullable`** — Image boleh kosong (user tidak wajib upload saat update).
- **`Storage::disk('public')->delete($path)`** — Hapus file lama supaya tidak menumpuk.
- **`$request->only([...])`** — Hanya ambil field tertentu, ignore yang lain.

## 22.4 📦 Multiple File Upload

```php
public function store(Request $request)
{
    $request->validate([
        'images'   => 'required|array|max:5',
        'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:2048',
    ]);

    $paths = [];

    if ($request->hasFile('images')) {
        foreach ($request->file('images') as $image) {
            $paths[] = $image->store('products', 'public');
        }
    }

    $product = Product::create([...]);

    // Attach ke relasi product_images
    foreach ($paths as $path) {
        $product->images()->create(['path' => $path]);
    }
}
```

```html
{{-- Form dengan multiple upload --}}
<input type="file" name="images[]" multiple accept="image/*">
```

**Penjelasan multiple upload:**

- **`'images.*'`** — Validate setiap item dalam array.
- **`name="images[]"`** — HTML convention untuk multiple file input.
- **`foreach()`** — Loop setiap file, simpan.

## 22.5 🌐 Upload ke Cloud (S3 / Cloudinary)

```php
// .env
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_DEFAULT_REGION=ap-southeast-1
AWS_BUCKET=my-bucket

// Cara pakai sama saja!
$path = $request->file('image')->store('products', 's3');
```

```php
// atau Cloudinary (perlu package)
// composer require cloudinary-labs/cloudinary-laravel

$path = $request->file('image')->storeOnCloudinary();
```

**Penjelasan:**

- **`'s3'`** — Switch disk yang dipakai. Code API sama, tinggal swap konfig.
- **Cloudinary** — Alternative S3. Plus: auto image optimization.

## 22.6 📁 Manipulasi File

```php
use Illuminate\Support\Facades\Storage;

// Cek ada
Storage::disk('public')->exists('products/laptop.jpg'); // true/false

// Ambil isi
$content = Storage::get('products/laptop.jpg');

// Hapus
Storage::disk('public')->delete('products/laptop.jpg');
Storage::disk('public')->delete(['file1.jpg', 'file2.jpg']);

// Copy & Move
Storage::copy('old/file.jpg', 'new/file.jpg');
Storage::move('old/file.jpg', 'new/file.jpg');

// List semua file di directory
$files = Storage::disk('public')->files('products');

// List semua directory
$dirs = Storage::disk('public')->directories('products');

// Ambil URL publik
$url = Storage::url('products/laptop.jpg');
// → http://localhost:8000/storage/products/laptop.jpg

// Temporary URL (untuk S3, file expired)
$url = Storage::temporaryUrl(
    'products/laptop.jpg',
    now()->addMinutes(5)
);
```

**Penjelasan method:**

- **`exists()`** — Cek file exists.
- **`get()`** — Baca konten file.
- **`copy()`** — Copy file. Punya sumber & tujuan.
- **`move()`** — Pindah file. Sumber hilang setelah move.
- **`files('dir')`** — List file (bukan folder). Recursive: `files('products', true)`.
- **`Storage::url()`** — Generate URL publik. Untuk S3, mungkin berbeda.
- **`temporaryUrl()`** — URL dengan expiry. Cocok untuk share file private.

## 22.7 🖼️ Image Intervention (Resize, Crop)

```bash
# Install package
composer require intervention/image
```

```php
use Intervention\Image\Laravel\Facades\Image;

// Upload + resize otomatis
public function store(Request $request)
{
    $request->validate([
        'image' => 'required|image|max:5120',
    ]);

    $file   = $request->file('image');
    $image  = Image::read($file->getRealPath());

    // Resize max width 1200px, maintain aspect ratio
    $image->scale(width: 1200);

    // Generate nama random
    $filename = Str::random(40) . '.jpg';

    // Simpan
    Storage::disk('public')->put(
        "products/{$filename}",
        $image->toJpeg(85)->encode() // Quality 85
    );

    Product::create([
        'image' => "products/{$filename}",
        // ...
    ]);
}
```

**Penjelasan Image Intervention:**

- **`Image::read()`** — Baca file gambar.
- **`->scale(width: 1200)`** — Resize, maintain aspect ratio.
- **`->toJpeg(85)`** — Convert ke JPEG dengan quality 85%.
- **`->encode()`** — Encode ke binary string untuk simpan ke storage.

## 📌 Ringkasan Bab 22

| Konsep                | Penjelasan Singkat                                              |
| --------------------- | --------------------------------------------------------------- |
| Storage Disk          | "Tempat penyimpanan" file (local, public, s3)                  |
| `storage:link`        | Buat symlink `public/storage` ke `storage/app/public`           |
| `store('path', 'disk')`| Upload file                                                  |
| `Storage::url($path)` | Generate URL publik file                                       |
| `delete($path)`       | Hapus file                                                     |
| Multiple upload       | Pakai `name="images[]"` di form & array di controller          |
| Cloud storage         | Pakai disk S3 / Cloudinary untuk file di cloud                 |
| Intervention/Image    | Package untuk resize, crop, kompres gambar                     |

---

➡️ Lanjut ke [Bab 23 — Caching & Performance Optimization](/bagian-6/bab-23)
