---
title: Bab 1 — Mengenal Laravel & Ekosistemnya
---

# 📖 Bab 1 — Mengenal Laravel & Ekosistemnya

## 1.1 🤔 Apa itu Laravel & Mengapa Populer?

Laravel adalah **framework PHP full-stack** yang dirancang untuk membuat pengembangan web menjadi menyenangkan dan ekspresif. Laravel menyediakan struktur yang jelas, tools yang lengkap, dan dokumentasi yang sangat baik — menjadikannya framework PHP paling populer di dunia.

> 💡 **Analogi Sederhana:**
> Jika PHP mentah adalah bahan-bahan masakan, maka Laravel adalah dapur
> profesional yang sudah dilengkapi peralatan lengkap, resep standar,
> dan sistem penyimpanan yang rapi. Anda tetap yang masak, tapi jauh lebih efisien.

## 1.2 ⚖️ Perbandingan Laravel vs CodeIgniter vs Symfony

| Aspek              | Laravel 12         | CodeIgniter 4      | Symfony 7          |
| ------------------ | ------------------ | ------------------ | ------------------ |
| **Kurva belajar**  | 🟡 Sedang          | 🟢 Rendah          | 🔴 Tinggi          |
| **Fitur bawaan**   | Sangat lengkap     | Minimalis          | Sangat lengkap     |
| **Ekosistem**      | Sangat luas        | Terbatas           | Luas               |
| **ORM**            | Eloquent (powerful)| Query Builder      | Doctrine (complex) |
| **Performa**       | Baik (dengan cache)| Sangat cepat       | Sangat baik        |
| **Komunitas**      | ✅ Terbesar        | Sedang             | Besar              |
| **Cocok untuk**    | Semua skala        | Project kecil-cepat| Enterprise besar   |

**Penjelasan tabel:**

- **Kurva belajar** — Laravel di level "sedang" karena syntax-nya elegant tapi konsepnya (Service Container, Eloquent, middleware) butuh waktu untuk dikuasai. CodeIgniter paling simpel, Symfony paling kompleks.
- **Fitur bawaan** — Laravel sudah include hampir semua yang dibutuhkan (ORM, auth, queue, cache, mail). CodeIgniter minimalis sehingga Anda perlu rakit sendiri. Symfony lengkap tapi konfigurasinya verbose.
- **Ekosistem** — Laravel punya paket resmi (Sanctum, Breeze, Horizon, Telescope) dan third-party ribuan package. CodeIgniter lebih sedikit.
- **ORM** — Eloquent Laravel terkenal paling mudah dipakai dan paling expressive. Doctrine Symfony powerful tapi curva belajarnya lebih tinggi.
- **Performa** — CodeIgniter paling ringan. Laravel "baik" dengan cache, Symfony optimized untuk enterprise.
- **Komunitas** — Laravel punya komunitas terbesar sehingga mudah cari tutorial, forum, dan Laravel developer untuk hire.

## 1.3 🆕 Perubahan Besar di Laravel 12

| Fitur                  | Laravel 10                | Laravel 12                       |
| ---------------------- | ------------------------- | -------------------------------- |
| **Struktur folder**    | Penuh                     | Lebih ramping (banyak file dihapus) |
| **Middleware**         | `app/Http/Middleware/`    | Didaftarkan di `bootstrap/app.php` |
| **Kernel HTTP**        | Ada                       | Dihapus                          |
| **Service Provider**   | Banyak default            | Dikurangi, `AppServiceProvider` saja |
| **Minimum PHP**        | PHP 8.1                   | PHP 8.2                          |
| **Routing default**    | `routes/web.php + api.php`| `routes/web.php` (api opsional)  |

**Penjelasan tabel:**

- **Struktur folder lebih ramping** — Laravel 12 membuang banyak file boilerplate (Kernel HTTP, Console Kernel, Exception Handler jadi ringkas). Hasilnya, project baru lebih clean.
- **Middleware di `bootstrap/app.php`** — Dulu middleware dideklarasikan di kernel terpisah, sekarang cukup di satu file `bootstrap/app.php` saja.
- **Service Provider dikurangi** — Hanya `AppServiceProvider` yang default. `AuthServiceProvider`, `EventServiceProvider`, `RouteServiceProvider` dihapus/disederhanakan.
- **Minimum PHP 8.2** — Pastikan PHP Anda versi 8.2 atau lebih baru.
- **Routing default** — Laravel 12 tidak otomatis membuat `routes/api.php`. Anda perlu jalankan `php artisan install:api` dulu.

> ⚠️ **Catatan:**
> Ebook ini menggunakan **Laravel 12**. Banyak tutorial lama di internet masih
> menggunakan Laravel 8/9/10 — perhatikan perbedaan struktur foldernya.

## 1.4 🧰 Ekosistem Laravel — Gambaran Besar

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

**Penjelasan struktur ekosistem:**

- **Core** — Laravel 12 adalah framework utama. Semua paket lain di bawahnya adalah pelengkap.
- **Official Packages** — Paket resmi dari tim Laravel:
  - **Sanctum** — Autentikasi API dengan token (paling ringan, dipakai ebook ini).
  - **Breeze** — Starter kit autentikasi lengkap tapi minimal (login, register, forgot password).
  - **Jetstream** — Breeze + fitur tambahan (2FA, team management).
  - **Horizon** — Dashboard cantik untuk monitoring queue (Bab 21).
  - **Telescope** — Debugging tool — lihat semua request, query, log (untuk development).
- **Database Tools**:
  - **Eloquent ORM** — Jantung interaksi database Laravel.
  - **Migrations** — Schema database ditulis dalam PHP, version-controlled via Git.
  - **Seeders & Factories** — Generate data dummy untuk testing.
- **Frontend Integration**:
  - **Vite** — Build tool modern (pengganti Laravel Mix).
  - **Blade** — Template engine bawaan Laravel.
  - **Inertia.js** — Bikin SPA pakai Vue/React tanpa harus expose API.
- **Deployment**:
  - **Forge** — Server management untuk Laravel (berbayar).
  - **Vapor** — Serverless deployment di AWS Lambda.

## 1.5 🌐 Cara Kerja Laravel — Request Lifecycle

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

**Penjelasan lifecycle (alur tiap langkah):**

1. **Browser kirim HTTP Request** — User mengakses URL (misal: GET `/products`).
2. **`index.php` di folder `public/`** — Satu-satunya entry point Laravel. Semua request masuk ke file ini. Folder `public/` adalah document root web server.
3. **Bootstrap & Service Container** — `index.php` memuat konfigurasi dan menginisialisasi Service Container (akan dibahas di Bab 5).
4. **Global Middleware** — Sebelum request sampai ke logic, middleware global dijalankan: `EncryptCookies`, `StartSession`, `VerifyCsrfToken`, dll.
5. **Router** — Laravel mencocokkan URL dengan route yang didefinisikan di `routes/web.php` (untuk halaman web) atau `routes/api.php` (untuk API).
6. **Route Middleware** — Middleware spesifik route (misal: `auth`, `throttle:60,1`) dijalankan. Jika gagal, request dihentikan.
7. **Controller** — Logic bisnis dijalankan. Controller bisa return view Blade, JSON, atau redirect.
8. **Model (Eloquent)** — Jika butuh data, Controller memanggil Eloquent untuk query database.
9. **Response** — Controller mengirim response balik (HTML/JSON) ke browser.
10. **Middleware (post-processing)** — Middleware yang dideklarasikan `terminate()` juga dijalankan setelah response dikirim.

> 💡 **Konsep Penting:**
> Request melalui **berlapis middleware** seperti onion. Setiap middleware
> bisa menghentikan request sebelum sampai ke Controller.

## 1.6 🆕 Cara Kerja React di Balik Layar

::: details 🔍 Penjelasan Lebih Detail
1. **Browser** mengirim HTTP Request ke server (misal: GET `/products`)
2. **`public/index.php`** adalah satu-satunya entry point aplikasi Laravel
3. **Bootstrap** memuat konfigurasi dan membuat Service Container
4. **Middleware global** seperti `EncryptCookies`, `StartSession` dijalankan
5. **Router** mencocokkan URL dengan route yang didefinisikan di `routes/web.php`
6. **Middleware spesifik route** (seperti `auth`) dijalankan sebelum Controller
7. **Controller** memproses request, memanggil Model/Eloquent untuk ambil data
8. **Response** dikembalikan ke user dalam bentuk HTML (Blade) atau JSON
:::

## 📌 Ringkasan Bab 1

| Konsep                          | Penjelasan Singkat                                              |
| ------------------------------- | --------------------------------------------------------------- |
| Laravel                          | Framework PHP full-stack paling populer                          |
| Sintaks ekspresif                | Kode lebih sedikit, lebih jelas, lebih mudah dibaca              |
| MVC pattern                      | Pemisahan Model, View, Controller — fondasi Laravel              |
| Ekosistem luas                   | Sanctum, Breeze, Horizon, Telescope — semuanya paket resmi       |
| Request lifecycle                | Request → Middleware → Router → Controller → Response           |
| Laravel 12                       | Versi terbaru, struktur folder lebih ramping, butuh PHP 8.2+     |

---

➡️ Lanjut ke [Bab 2 — Setup & Instalasi Project](/bagian-1/bab-2) untuk mulai coding!
