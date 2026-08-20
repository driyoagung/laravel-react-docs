---
title: Bab 9 — Komponen Button & Form
---

# 📖 Bab 9 — Komponen Button & Form

## 9.1 🔘 Sistem Button yang Lengkap

```html
<!-- Variant: Primary -->
<button class="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium px-5 py-2.5 rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed">
  Simpan Data
</button>

<!-- Variant: Secondary (outlined) -->
<button class="inline-flex items-center gap-2 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-medium px-5 py-2.5 rounded-lg transition-all duration-150">
  Batal
</button>

<!-- Variant: Ghost -->
<button class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium px-4 py-2 rounded-lg transition-colors">
  Selengkapnya
</button>

<!-- Variant: Destructive (danger) -->
<button class="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors">
  🗑️ Hapus
</button>

<!-- Variant: Success -->
<button class="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors">
  ✓ Konfirmasi
</button>

<!-- Size: Small -->
<button class="text-xs font-medium px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors">
  Kecil
</button>

<!-- Size: Large -->
<button class="text-base font-semibold px-8 py-3.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5">
  Besar
</button>

<!-- Full width -->
<button class="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors">
  Login dengan Email
</button>

<!-- Icon button -->
<button class="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900">
  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
  </svg>
</button>

<!-- Loading state -->
<button class="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-5 py-2.5 rounded-lg opacity-80 cursor-not-allowed" disabled>
  <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
  </svg>
  Menyimpan...
</button>
```

**Penjelasan setiap variant:**

- **Primary** — Tombol utama. Background brand color (`bg-blue-600`), white text. `hover:bg-blue-700` (gelap 1 tingkat) untuk feedback.
- **Secondary (outlined)** — Tombol sekunder. `border` dengan `hover:bg-gray-50` untuk background subtle.
- **Ghost** — Tombol tanpa background/border. Hanya `hover:bg-gray-100`. Untuk aksi kurang penting.
- **Destructive** — `bg-red-600` untuk aksi berbahaya (hapus, dll).
- **Success** — `bg-emerald-600` untuk konfirmasi/aksi positif.
- **Disabled** — `disabled:opacity-50 disabled:cursor-not-allowed` untuk state disabled.
- **Loading** — Spinner dengan `animate-spin`. `opacity-80 cursor-not-allowed` untuk visual cue.

## 9.2 📝 Komponen Form yang Lengkap

```html
<form class="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg">
  <h2 class="text-2xl font-bold text-gray-900 mb-6">Buat Akun</h2>

  <!-- Input group dengan floating label style -->
  <div class="flex flex-col gap-5">

    <!-- Input teks normal -->
    <div class="flex flex-col gap-1.5">
      <label for="name" class="text-sm font-medium text-gray-700">
        Nama Lengkap <span class="text-red-500">*</span>
      </label>
      <input
        id="name" type="text" placeholder="Budi Santoso"
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-white"
      />
    </div>

    <!-- Input dengan error state -->
    <div class="flex flex-col gap-1.5">
      <label for="email" class="text-sm font-medium text-gray-700">Email</label>
      <input
        id="email" type="email" placeholder="budi@email.com"
        class="w-full px-4 py-2.5 border border-red-400 rounded-lg text-gray-900 bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
      />
      <p class="text-xs text-red-600 flex items-center gap-1">
        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"/>
        </svg>
        Format email tidak valid
      </p>
    </div>

    <!-- Input dengan icon -->
    <div class="flex flex-col gap-1.5">
      <label for="password" class="text-sm font-medium text-gray-700">Password</label>
      <div class="relative">
        <input
          id="password" type="password" placeholder="Min. 8 karakter"
          class="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          👁️
        </button>
      </div>
    </div>

    <!-- Select -->
    <div class="flex flex-col gap-1.5">
      <label for="role" class="text-sm font-medium text-gray-700">Peran</label>
      <select id="role" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
        <option value="">Pilih peran</option>
        <option value="buyer">Pembeli</option>
        <option value="seller">Penjual</option>
      </select>
    </div>

    <!-- Textarea -->
    <div class="flex flex-col gap-1.5">
      <label for="bio" class="text-sm font-medium text-gray-700">Bio</label>
      <textarea
        id="bio" rows="3" placeholder="Ceritakan tentang diri Anda..."
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      ></textarea>
      <p class="text-xs text-gray-400 text-right">0 / 200 karakter</p>
    </div>

    <!-- Checkbox -->
    <div class="flex items-start gap-3">
      <input
        type="checkbox" id="terms"
        class="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
      />
      <label for="terms" class="text-sm text-gray-600 cursor-pointer">
        Saya menyetujui <a href="#" class="text-blue-600 hover:underline font-medium">Syarat & Ketentuan</a>
        dan <a href="#" class="text-blue-600 hover:underline font-medium">Kebijakan Privasi</a>
      </label>
    </div>

    <!-- Submit button -->
    <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors mt-2">
      Buat Akun
    </button>

    <p class="text-center text-sm text-gray-500">
      Sudah punya akun?
      <a href="#" class="text-blue-600 hover:underline font-medium">Masuk</a>
    </p>
  </div>
</form>
```

**Penjelasan setiap bagian:**

- **Input teks normal** — `focus:ring-2 focus:ring-blue-500 focus:border-transparent` — Saat focus, ring blue dan border hilang (efek glow).
- **Error state** — `border-red-400 bg-red-50` — Border merah + background merah muda. Plus icon + pesan error.
- **Input dengan icon** — `<div class="relative">` + `<button class="absolute">` untuk posisi icon di kanan. `pl-4 pr-10` untuk padding yang accommodate icon.
- **Select** — `appearance-none` untuk hilangkan default arrow browser (bisa diganti dengan custom arrow via background image).
- **Textarea** — `resize-none` agar user tidak bisa resize textarea. `rows={n}` untuk tinggi default.
- **Checkbox** — `w-4 h-4` untuk ukuran 16px. `text-blue-600` untuk warna saat checked.
- **`placeholder:text-gray-400`** — Style khusus untuk placeholder saja. Jangan `text-gray-400` biasa (akan membuat text input juga abu-abu).

## 📌 Ringkasan Bab 9

| Konsep              | Kapan Dipakai                                              |
| ------------------ | ---------------------------------------------------------- |
| Button variants    | Primary, Secondary, Ghost, Destructive, Success          |
| Button sizes       | Small (sm), Medium (default), Large (lg)                  |
| Button states      | Default, Hover, Active, Focus, Disabled, Loading          |
| Form pattern       | Vertical flex layout, label di atas input, focus ring     |
| Error state        | `border-red-400 bg-red-50` + icon + pesan                 |
| Input dengan icon  | `relative` + `absolute` button + `pl-4 pr-10`            |

---

➡️ Lanjut ke [Bab 10 — Card, List & Table](/bagian-4/bab-10)
