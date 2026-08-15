---
title: Bab 6 — Blade Template Engine
---

# 📖 Bab 6 — Blade Template Engine

## 6.1 🔤 Sintaks Dasar Blade

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

**Penjelasan direktif Blade:**

- **`&#123;&#123; $variable }}`** — Cetak isi variabel. **Auto-escape HTML** untuk mencegah XSS attack. Wajib dipakai untuk data user.
- **`{!! $variable !!}`** — Cetak HTML mentah TANPA escape. AMAN dipakai jika Anda yakin konten HTML-nya sudah terpercaya. JANGAN dipakai untuk data user.
- **`@if / @elseif / @else / @endif`** — Percabangan standar. Blade compile jadi PHP `if` biasa.
- **`@foreach / @endforeach`** — Loop. Compile jadi `foreach` PHP.
- **`@forelse / @empty / @endforelse`** — Seperti foreach tapi punya blok `@empty` yang jalan jika collection kosong. Sangat berguna untuk list tanpa null check.
- **`@auth`** — Hanya render jika user sudah login.
- **`@guest`** — Hanya render jika user BELUM login.

::: warning ⚠️ Selalu Gunakan `&#123;&#123; }}` untuk Data User
Blade secara otomatis **escape** output `&#123;&#123; }}` untuk mencegah XSS.
Hanya gunakan `{!! !!}` untuk HTML yang sudah Anda percaya 100% aman.
:::

## 6.2 🏗️ Layouts & Template Inheritance

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

**Penjelasan direktif layout:**

- **`@yield('title', 'Default Title')`** — Tempat halaman anak akan inject title. Parameter kedua = fallback jika tidak di-set.
- **`@yield('content')`** — Master slot untuk konten utama. Wajib ada di setiap layout.
- **`@include('layouts.navbar')`** — Include partial view. `navbar.blade.php` di-load di sini.
- **`@stack('styles')` & `@stack('scripts')`** — Tempat halaman anak bisa push CSS/JS tambahan tanpa harus edit layout.

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
@push
```

**Penjelasan halaman anak:**

- **`@extends('layouts.app')`** — Wariskan layout `app.blade.php`. Wajib声明 dulu sebelum section.
- **`@section('title', 'Daftar Produk')`** — Inject title ke `@yield('title')` di layout.
- **`@section('content') ... @endsection`** — Inject konten utama ke `@yield('content')` di layout.
- **`@include('products._card', ['product' => $product])`** — Include partial view per item. Underscore prefix `_card` adalah konvensi = partial.
- **`&#123;&#123; $products->links() &#125;&#125;`** — Otomatis render pagination links (Badan 1, 2, 3, ...) dari `paginate()`.
- **`@push('scripts') ... @endpush`** — Push script ke stack, akan di-render di `@stack('scripts')` di layout.

::: tip 💡 Tips
Tidak masalah urutan `@section` dan `@push` di halaman anak. Blade compile semua dulu lalu ke layout.
:::

## 6.3 🧩 Blade Components — Cara Modern (Laravel 7+)

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

**Penjelasan Component Class:**

- **Constructor dengan `public readonly`** — Properties otomatis jadi props di Blade. Bisa diakses sebagai `$product` dan `$showActions` di template.
- **`render()`** — Method yang return view component. Wajib ada.

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

**Penjelasan Component Template:**

- **Akses props** — Langsung dengan `$product` dan `$showActions` (otomatis dari constructor).
- **`@if ($showActions)`** — Conditional render berdasarkan prop.
- **`&#123;&#123; route('products.show', $product) }}`** — Generate URL otomatis.

**Penjelasan cara pakai di Blade:**

```blade
<x-product-card :product="$product" :show-actions="false" />
```

- `<x-product-card>` — Tag component (kebab-case). Auto-resolve ke `ProductCard` class.
- **`:product="$product"`** — Pass prop `product` dengan nilai `$product`. Tanda `:` (colon) artinya ekspresi PHP.
- **`:show-actions="false"`** — Pass boolean `false`. Tanpa `:` akan dianggap string `"false"`.

## 6.4 📦 Anonymous Components (Tanpa Class)

```blade
{{-- resources/views/components/alert.blade.php --}}
<div {{ $attributes->merge(['class' => 'alert alert-'.$type]) }}>
    {{ $slot }}
</div>

{{-- Cara pakai --}}
<x-alert type="success" class="mb-4">
    Produk berhasil ditambahkan!
</x-alert>

<x-alert type="danger">
    Terjadi kesalahan.
</x-alert>
```

**Penjelasan Anonymous Component:**

- **File di `resources/views/components/`** — Nama file `alert.blade.php` otomatis jadi component `<x-alert>`.
- **`&#123;&#123; $attributes &#125;&#125;`** — Semua atribut HTML yang diberikan saat pakai component. `->merge()` gabung dengan default class.
- **`&#123;&#123; $slot }}`** — Isi/konten di antara tag pembuka dan penutup.

**Penjelasan cara pakai:**

- **`<x-alert type="success">`** — Pakai component dengan prop `type="success"`.
- **`<x-alert class="mb-4">`** — Atribut HTML tambahan (class) di-merge dengan default.
- **Konten di antara tag** — Otomatis jadi `$slot`.

## 6.5 🎨 Direktif Blade Penting

```blade
{{-- Include view partial --}}
@include('partials.header')

{{-- Include dengan data --}}
@include('partials.product-card', ['product' => $product])

{{-- Include jika ada, jika tidak skip --}}
@includeIf('partials.optional-sidebar')

{{-- Include jika kondisi terpenuhi --}}
@includeWhen(auth()->user()->isAdmin(), 'partials.admin-menu')

{{-- CSRF Token (wajib untuk form POST) --}}
<form method="POST">
    @csrf
    ...
</form>

{{-- Method spoofing (untuk PUT/PATCH/DELETE di HTML form) --}}
<form method="POST">
    @csrf
    @method('PUT')
    ...
</form>

{{-- Error handling --}}
@error('email')
    <span class="text-red">{{ $message }}</span>
@enderror

{{-- Loop variable --}}
@foreach ($items as $item)
    {{ $loop->index }}   {{-- Index saat ini --}}
    {{ $loop->iteration }} {{-- 1-based --}}
    {{ $loop->first }}  {{-- Boolean: item pertama? --}}
    {{ $loop->last }}   {{-- Boolean: item terakhir? --}}
    {{ $loop->count }}  {{-- Total item --}}
@endforeach

{{-- PHP asli di Blade --}}
@php
    $total = 0;
    foreach ($items as $item) {
        $total += $item->price;
    }
@endphp

{{-- Komentar Blade (tidak ikut ter-render di HTML) --}}
{{-- Ini komentar, tidak akan muncul di HTML --}}
```

**Penjelasan direktif lainnya:**

- **`@include('partials.header')`** — Include partial view. Berguna untuk komponentisasi.
- **`@includeIf('partials.optional-sidebar')`** — Include HANYA jika file ada. Tidak error jika file tidak ada.
- **`@includeWhen(condition, 'view')`** — Include HANYA jika kondisi true.
- **`@csrf`** — Generate `<input type="hidden" name="_token" value="...">`. **WAJIB** di setiap form POST. Cegah CSRF attack.
- **`@method('PUT')`** — Generate `<input type="hidden" name="_method" value="PUT">`. HTML form hanya support GET/POST, jadi PUT/PATCH/DELETE di-spoof via field ini.
- **`@error('email')`** — Render blok ini HANYA jika ada error untuk field `email`. `$message` otomatis tersedia.
- **`@foreach` + `$loop`** — Variable `$loop` punya banyak info: `index`, `iteration` (1-based), `first`, `last`, `count`, `remaining`, `depth` (untuk nested loop).
- **`@php ... @endphp`** — Eksekusi PHP murni. Pakai jika logika terlalu kompleks untuk directive Blade.
- **`&#123;&#123;-- Komentar --&#125;&#125;`** — Komentar Blade. Tidak ikut di HTML output. Beda dengan `<!-- komentar HTML -->` yang tetap muncul.

## 📌 Ringkasan Bab 6

| Konsep                    | Penjelasan Singkat                                              |
| ------------------------- | --------------------------------------------------------------- |
| `&#123;&#123; }}`                   | Cetak variabel (auto-escape XSS)                                |
| `{!! !!}`                 | Cetak HTML mentah (hati-hati!)                                  |
| `@extends` / `@section`   | Template inheritance                                           |
| `@include`                | Include view partial                                           |
| `@if` / `@foreach`        | Kontrol alur di view                                            |
| Blade Components          | Reusable UI component dengan props                             |
| `<x-component>`           | Cara modern pakai component                                    |
| `@csrf`                   | Wajib untuk semua form POST                                    |

---

➡️ Lanjut ke [Bab 7 — Validasi & Form Request](/bagian-2/bab-7)
