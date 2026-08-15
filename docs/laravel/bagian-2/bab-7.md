---
title: Bab 7 — Validasi & Form Request
---

# 📖 Bab 7 — Validasi & Form Request

## 7.1 ✅ Validasi Inline di Controller

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

**Penjelasan setiap rule:**

- **`required`** — Field wajib diisi. Tidak boleh null/kosong.
- **`string`** — Harus string.
- **`email`** — Harus format email valid (mengandung `@` dan domain).
- **`unique:users,email`** — Harus unik di tabel `users`, kolom `email`. Berguna untuk register.
- **`min:8` / `max:255`** — Minimal 8 / Maksimal 255 (panjang string atau nilai numerik).
- **`confirmed`** — Harus ada field `password_confirmation` dengan nilai sama. Untuk konfirmasi password.
- **`numeric`** — Harus angka (integer atau float).
- **`exists:categories,id`** — Nilai harus ada di kolom `id` tabel `categories`. Berguna untuk foreign key.
- **`nullable`** — Field boleh kosong/null. Skip rule lain jika null.
- **`image`** — File harus gambar (mime type image/*).
- **`mimes:jpg,png,webp`** — Ekstensi file yang diizinkan. Untuk keamanan upload.
- **`array`** — Harus array.
- **`tags.*`** — Wildcard. Validasi setiap elemen array `tags`.

**Penjelasan flow `$request->validate()`:**

1. Cek semua rules.
2. Jika ada yang gagal → otomatis redirect back + flash error + simpan input di session.
3. Jika semua lulus → return hanya field yang lolos validasi.
4. `$validated` aman dipakai untuk mass-assignment.

### Aturan Validasi yang Sering Dipakai

| Rule          | Contoh                          | Penjelasan                                |
| ------------- | ------------------------------- | ----------------------------------------- |
| `required`    | `'name' => 'required'`          | Field wajib diisi                         |
| `string`      | `'name' => 'string'`            | Harus string                              |
| `email`       | `'email' => 'email'`            | Harus format email valid                  |
| `numeric`     | `'price' => 'numeric'`          | Harus angka                               |
| `integer`     | `'qty' => 'integer'`            | Harus integer                             |
| `min` / `max` | `'password' => 'min:8'`         | Minimal/maksimal nilai/panjang            |
| `unique`      | `'email' => 'unique:users'`     | Belum ada di tabel                        |
| `exists`      | `'category_id' => 'exists:categories,id'` | Harus ada di tabel lain        |
| `confirmed`   | `'password' => 'confirmed'`      | Harus ada `password_confirmation`         |
| `image`       | `'avatar' => 'image'`           | Harus file gambar                         |
| `mimes`       | `'avatar' => 'mimes:jpg,png'`   | Ekstensi yang diizinkan                   |
| `nullable`    | `'description' => 'nullable'`   | Boleh kosong/null                         |
| `in`          | `'role' => 'in:admin,user'`     | Harus salah satu dari list                |
| `date`        | `'birthday' => 'date'`          | Harus tanggal valid                       |
| `regex`       | `'code' => 'regex:/^[A-Z]{3}$/'` | Harus cocok regex                        |

## 7.2 📋 Form Request — Validasi yang Terstruktur

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

**Penjelasan Form Request:**

- **`authorize()`** — Dipanggil SEBELUM validasi. Return `false` → 403 Forbidden. Cocok untuk permission check.
- **`rules()`** — Array aturan validasi. Dipanggil setelah `authorize()` return true.
- **`messages()`** — Custom pesan error. Key: `<field>.<rule>`. Jika tidak di-override, pakai default Laravel (English).

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

**Penjelasan Form Request di Controller:**

- Cukup type-hint `StoreProductRequest` di parameter method.
- Laravel otomatis:
  1. Cek `authorize()` — return false → 403.
  2. Jalankan `rules()` — gagal → redirect back + error.
  3. Lolos → inject instance dengan data tervalidasi.
- `$request->validated()` — hanya field yang lolos validasi.

::: tip 💡 Tips
Gunakan Form Request jika:
- Validasi lebih dari 5–10 baris
- Validasi dipakai di banyak method
- Ingin custom authorization logic
- Ingin custom error messages
:::

## 7.3 🎨 Menampilkan Error Validasi di Blade

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

**Penjelasan error handling di Blade:**

- **`$errors->any()`** — Cek apakah ada error validasi.
- **`$errors->all()`** — Array semua error messages.
- **`old('name')`** — Ambil input user sebelumnya. Tetap terisi jika validasi gagal (user tidak perlu ketik ulang).
- **`$errors->has('name')`** — Cek apakah ada error untuk field tertentu. Berguna untuk conditional class.
- **`@error('name') ... @enderror`** — Render blok ini HANYA jika ada error untuk field `name`. `$message` otomatis tersedia.

## 7.4 🔄 Validasi untuk Update

```php
public function rules(): array
{
    return [
        'name'  => 'required|string|max:255',
        'email' => [
            'required',
            'email',
            Rule::unique('users')->ignore($this->user->id), // Abaikan id sendiri
        ],
    ];
}
```

**Penjelasan Rule::unique untuk update:**

- `Rule::unique('users')` — Cek unique di tabel `users`.
- `->ignore($this->user->id)` — Untuk update, abaikan baris dengan ID user yang sedang di-update. Tanpa ini, user tidak bisa update profile sendiri (email dianggap sudah dipakai oleh dirinya sendiri).

## 7.5 🌐 Validasi API (JSON Response)

Untuk API, Laravel otomatis return JSON jika `Accept: application/json` dikirim:

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["Email sudah terdaftar."],
    "password": ["Password minimal 8 karakter."]
  }
}
```

```php
// Atau custom response dengan Form Request
protected function failedValidation(Validator $validator)
{
    throw new HttpResponseException(
        response()->json([
            'success' => false,
            'message' => 'Validasi gagal.',
            'errors'  => $validator->errors(),
        ], 422)
    );
}
```

**Penjelasan custom validation response:**

- Override `failedValidation()` di Form Request untuk customize response.
- Status 422 (Unprocessable Entity) — standard untuk validasi gagal API.
- Format `{ success, message, errors }` — konsisten dengan format API response lain.

## 📌 Ringkasan Bab 7

| Konsep              | Penjelasan Singkat                                              |
| ------------------- | --------------------------------------------------------------- |
| Inline validation   | `$request->validate([...])` — cepat & ringkas                   |
| Form Request        | Class khusus untuk validasi — bersih & reusable                 |
| `authorize()`       | Cek apakah user boleh melakukan request ini                    |
| `rules()`           | Definisi aturan validasi                                       |
| `messages()`        | Custom pesan error dalam bahasa apapun                          |
| `old()`             | Isi ulang form dengan input lama jika validasi gagal           |
| `@error` directive  | Tampilkan error per field di Blade                              |
| `Rule::unique`      | Validasi unique dengan pengecualian (untuk update)             |

---

➡️ Lanjut ke [Bab 8 — Middleware](/bagian-2/bab-8)
