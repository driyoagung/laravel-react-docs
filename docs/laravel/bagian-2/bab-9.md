---
title: Bab 9 — Session, Cookie & Flash Message
---

# 📖 Bab 9 — Session, Cookie & Flash Message

## 9.1 💾 Session

Session menyimpan data di server yang terkait dengan user tertentu. Cocok untuk menyimpan data sementara seperti keranjang belanja, preferensi user, dll.

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

**Penjelasan method session:**

- **`session(['key' => 'value'])`** — Set session pakai array syntax. Helper function.
- **`$request->session()->put('key', 'value')`)** — Set session via Request object. Cara eksplisit.
- **`session('key', 'default')`** — Ambil session. Parameter kedua = default jika key tidak ada.
- **`session()->forget('key')`** — Hapus 1 key dari session.
- **`session()->flush()`** — Hapus SEMUA session data. Hati-hati, logout user juga.
- **`session()->flash('key', 'value')`** — Set data yang hanya ada untuk 1 request berikutnya. Cocok untuk flash message.

### Method Session Penting

```php
$request->session()->all();         // Ambil semua data session
$request->session()->has('key');   // Cek apakah ada key
$request->session()->exists('key'); // Sama seperti has()
$request->session()->missing('key'); // Cek apakah TIDAK ada
$request->session()->push('tags', 'php'); // Push ke array
$request->session()->increment('counter'); // Increment nilai
$request->session()->regenerate(); // Regenerate ID (security)
$request->session()->invalidate(); // Hapus semua data + regenerate ID
```

**Penjelasan method lanjutan:**

- **`all()`** — Array semua session. Berguna untuk debugging.
- **`has()` vs `exists()`** — Keduanya cek key exists. Bedanya, `has()` return false jika value null.
- **`missing()`** — Kebalikan `has()`.
- **`push()`** — Append nilai ke array session. Cocok untuk "tags" atau list.
- **`increment()`** — Auto-increment nilai numerik. Berguna untuk counter.
- **`regenerate()`** — Generate session ID baru. **PENTING** setelah login untuk cegah session fixation.
- **`invalidate()`** — Hapus semua + regenerate ID. Pakai saat logout.

## 9.2 🍪 Cookie

Cookie disimpan di **browser user** (bukan server). Cocok untuk data yang perlu bertahan lama seperti preferensi tema, token remember me, dll.

```php
// Membuat cookie
$cookie = cookie('theme', 'dark', 60 * 24 * 30); // 30 hari

// Kirim cookie bersama response
return response()->json(['ok' => true])->cookie($cookie);

// Membaca cookie
$theme = $request->cookie('theme', 'light');

// Hapus cookie
return response()->json(['ok' => true])->withoutCookie('theme');

// Cookie yang di-encrypt (lebih aman)
$cookie = cookie()->forever('preference', 'value');
```

**Penjelasan method cookie:**

- **`cookie('name', 'value', $minutes)`** — Buat cookie. Parameter:
  - `name` — Nama cookie.
  - `value` — Nilai (auto-encode).
  - `$minutes` — Durasi dalam menit. `60 * 24 * 30` = 30 hari.
- **`response()->cookie($cookie)`** — Attach cookie ke response.
- **`$request->cookie('name', 'default')`** — Baca cookie. Default jika tidak ada.
- **`response()->withoutCookie('name')`** — Hapus cookie (set expired ke masa lalu).
- **`cookie()->forever()`** — Cookie permanent (5 tahun). Untuk preferensi.

::: warning ⚠️ Peringatan
Jangan pernah menyimpan data sensitif (password, token, dll) di cookie biasa!
Gunakan `Crypt::encrypt()` jika harus, atau lebih baik simpan di session.
:::

## 9.3 📢 Flash Message

Flash message adalah session yang **hilang otomatis setelah 1 request**. Cocok untuk notifikasi sukses/gagal setelah redirect.

```php
// Set flash message
return redirect()->route('products.index')
    ->with('success', 'Produk berhasil ditambahkan!');

return redirect()->back()
    ->with('error', 'Terjadi kesalahan, coba lagi.');

return redirect()->route('checkout')
    ->with('warning', 'Stok produk terbatas.');

return redirect()->route('dashboard')
    ->with('info', 'Selamat datang kembali!');
```

**Penjelasan flash message type:**

- **`with('success', ...)`** — Untuk notifikasi sukses.
- **`with('error', ...)`** — Untuk error.
- **`with('warning', ...)`** — Untuk peringatan.
- **`with('info', ...)`** — Untuk info umum.

Nama key (`success`, `error`, dst) bebas, Anda tentukan sendiri. Tinggal tampilkan di Blade.

```blade
{{-- resources/views/layouts/app.blade.php --}}
<main>
    @if (session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    @if (session('error'))
        <div class="alert alert-danger">{{ session('error') }}</div>
    @endif

    @if (session('warning'))
        <div class="alert alert-warning">{{ session('warning') }}</div>
    @endif

    @if (session('info'))
        <div class="alert alert-info">{{ session('info') }}</div>
    @endif

    @yield('content')
</main>
```

**Penjelasan tampilkan flash message:**

- `@if (session('success'))` — Cek apakah flash message dengan key `success` ada.
- Karena flash otomatis hilang, tampil hanya di request berikutnya (setelah redirect).
- Bootstrap/Tailwind class: `alert-success`, `alert-danger`, dll — standar untuk styling.

### Flash Data dengan Array

```php
return redirect()->back()->with([
    'success' => 'Order berhasil!',
    'order_id' => $order->id,
]);
```

**Penjelasan:**

- `with()` bisa terima array untuk set multiple flash sekaligus.
- Bisa diakses sebagai `session('success')` dan `session('order_id')`.

## 9.4 🛒 Studi Kasus: Keranjang Belanja Sederhana

```php
class CartController extends Controller
{
    // Tambah ke keranjang
    public function add(Request $request, Product $product)
    {
        $cart = session()->get('cart', []);

        $cart[$product->id] = [
            'name'     => $product->name,
            'price'    => $product->price,
            'quantity' => ($cart[$product->id]['quantity'] ?? 0) + 1,
        ];

        session()->put('cart', $cart);

        return back()->with('success', "{$product->name} ditambahkan ke keranjang!");
    }

    // Lihat keranjang
    public function index()
    {
        $cart = session('cart', []);
        $total = collect($cart)->sum(fn($item) => $item['price'] * $item['quantity']);

        return view('cart.index', compact('cart', 'total'));
    }

    // Hapus item
    public function remove(int $productId)
    {
        $cart = session('cart', []);
        unset($cart[$productId]);
        session()->put('cart', $cart);

        return back()->with('success', 'Item dihapus dari keranjang.');
    }
}
```

**Penjelasan CartController:**

- **`add(Request, Product)`** — Ambil cart dari session (default array kosong). Tambah/increment item. Simpan kembali. Flash message.
- **`index()`** — Hitung total harga dari semua item di cart. `collect()` dari Laravel + `sum()` closure.
- **`remove(int $productId)`** — Hapus item dari cart dengan `unset()`.

Catatan: Pattern di atas cocok untuk cart sederhana. Untuk production, lebih baik pakai database (table `carts` & `cart_items`).

## 9.5 🔐 CSRF Protection

Untuk form web, Laravel otomatis memproteksi dari **CSRF (Cross-Site Request Forgery)**. Anda WAJIB menyertakan `@csrf` di setiap form.

```blade
<form method="POST" action="/products">
    @csrf  {{-- WAJIB! Tanpa ini, form akan error 419 --}}
    <input type="text" name="name">
    <button type="submit">Simpan</button>
</form>
```

```php
// Untuk request AJAX
<meta name="csrf-token" content="{{ csrf_token() }}">

<script>
fetch('/api/endpoint', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
    },
    body: JSON.stringify(data)
});
</script>
```

**Penjelasan CSRF:**

- **CSRF attack** — Hacker membuat form di website lain yang submit ke website Anda. Browser otomatis kirim cookie session. Tanpa CSRF, request diterima.
- **`@csrf`** — Laravel generate `<input type="hidden" name="_token" value="...">`. Server cek token ini di setiap POST request.
- **AJAX** — Kirim token di header `X-CSRF-TOKEN`. Ambil dari `<meta>` tag.

::: tip 💡 Tips
Untuk **API stateless**, CSRF tidak diperlukan — gunakan `Accept: application/json` dan Sanctum/Laravel Passport untuk autentikasi.
:::

## 📌 Ringkasan Bab 9

| Konsep             | Penjelasan Singkat                                              |
| ------------------ | --------------------------------------------------------------- |
| Session            | Data disimpan di server, terkait user tertentu                  |
| Cookie             | Data disimpan di browser, persistent                           |
| Flash Message      | Session yang hilang otomatis setelah 1 request                 |
| `session('key')`   | Ambil data session                                              |
| `->with('key', value)` | Set flash message (untuk redirect)                         |
| `@csrf`            | WAJIB untuk form POST di web (keamanan CSRF)                   |
| `$request->cookie('key')` | Ambil nilai cookie                                       |
| `Crypt::encrypt()` | Enkripsi data sensitif                                         |

---

➡️ Lanjut ke [Bagian III — Database & Eloquent ORM](/bagian-3/index)
