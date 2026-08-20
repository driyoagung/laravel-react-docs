---
title: Bab 13 — Dark Mode
---

# 📖 Bab 13 — Dark Mode

## 13.1 🌙 Setup Dark Mode

```javascript
// tailwind.config.js
export default {
  // 'class' = toggle dark mode via class .dark di <html>
  // 'media' = ikuti preferensi sistem (prefers-color-scheme: dark)
  darkMode: 'class',
  // ...
}
```

**Penjelasan:**

- **`darkMode: 'class'`** — Toggle manual via class `.dark` di `<html>`. **Paling fleksibel** — user bisa override preferensi sistem.
- **`darkMode: 'media'`** — Ikuti preferensi OS user. User tidak bisa override dari UI.
- **Rekomendasi** — Pakai `'class'` + toggle button. User-friendly dan fleksibel.

```javascript
// Toggle dark mode dengan JavaScript
const html = document.documentElement

// Cek preferensi tersimpan
const savedTheme = localStorage.getItem('theme')
if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  html.classList.add('dark')
}

// Toggle button
function toggleDarkMode() {
  html.classList.toggle('dark')
  localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light')
}
```

**Penjelasan setiap baris:**

- **`document.documentElement`** — Alias untuk `<html>`. Class `dark` ditambahkan di sini.
- **`localStorage.getItem('theme')`** — Cek preferensi user sebelumnya. Jika belum ada, gunakan preferensi OS.
- **`window.matchMedia('(prefers-color-scheme: dark)').matches`** — Deteksi preferensi OS user.
- **`classList.add('dark')`** — Trigger Tailwind dark mode.
- **`classList.toggle('dark')`** — Toggle on/off.
- **`localStorage.setItem('theme', ...)`** — Simpan preferensi agar persist across page reload.

## 13.2 🎨 Menulis Class untuk Dark Mode

```html
<!-- Format: dark:{class} -->
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">

  <!-- Navbar -->
  <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0">
    <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <span class="font-bold text-gray-900 dark:text-white">Logo</span>

      <!-- Toggle button -->
      <button
        onclick="toggleDarkMode()"
        class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        <span class="dark:hidden">🌙</span>
        <span class="hidden dark:inline">☀️</span>
      </button>
    </div>
  </header>

  <!-- Card dalam dark mode -->
  <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm dark:shadow-none">
    <h3 class="font-semibold text-gray-900 dark:text-white">Judul Card</h3>
    <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Deskripsi konten.</p>
    <button class="mt-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
      Tombol Aksi
    </button>
  </div>

  <!-- Input dalam dark mode -->
  <input
    type="text"
    class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="Ketik di sini..."
  />

</div>
```

**Penjelasan format `dark:`:**

- **Format** — `dark:{class}`. Class tanpa `dark:` = light mode. Class dengan `dark:` = dark mode override.
- **Pakai berpasangan** — Selalu tulis light + dark. Jangan lupa sisi lainnya.
- **Combine dengan prefix lain** — `dark:hover:bg-gray-700` (hover di dark mode).
- **Toggle icon** — Pakai `dark:hidden` + `hidden dark:inline` untuk swap icon 🌙 ↔ ☀️.

## 13.3 💡 Strategi Warna Dark Mode yang Rapi

```
PANDUAN PASANGAN WARNA LIGHT ↔ DARK:

Latar utama:       bg-white          ↔  dark:bg-gray-900
Latar kartu:       bg-white          ↔  dark:bg-gray-800
Latar subtle:      bg-gray-50        ↔  dark:bg-gray-900/50
Latar input:       bg-white          ↔  dark:bg-gray-800

Border utama:      border-gray-200   ↔  dark:border-gray-700
Border subtle:     border-gray-100   ↔  dark:border-gray-800

Teks heading:      text-gray-900     ↔  dark:text-gray-100
Teks body:         text-gray-700     ↔  dark:text-gray-300
Teks muted:        text-gray-500     ↔  dark:text-gray-400
Teks placeholder:  text-gray-400     ↔  dark:text-gray-500
```

**Penjelasan strategi:**

- **Bukan kebalikan langsung** — `bg-white` di light jadi `dark:bg-gray-900` di dark, **BUKAN** `dark:bg-black`. Mata lebih nyaman dengan gray-900 daripada pure black.
- **Kontras ratio** — Pastikan kontras minimum 4.5:1 untuk body text, 3:1 untuk UI element (WCAG AA).
- **Hindari pure black/white** — Pure black terlalu kontras. Pure white terlalu terang. Pakai shade 50-100 (light) atau 800-900 (dark).
- **Semantic naming** — Pakai `surface`, `text-primary`, `border` (bukan warna) di design system. Lalu map ke warna di light/dark mode.

::: tip 💡 Tailwind v4 Dark Mode
Tailwind v4 (akan datang 2026) menggunakan sintaks `dark:` yang sama. Tidak ada perubahan kode untuk dark mode.
:::

## 📌 Ringkasan Bab 13

| Konsep                | Kapan Dipakai                                              |
| --------------------- | ---------------------------------------------------------- |
| `darkMode: 'class'`   | Toggle manual via JS — paling fleksibel                |
| Format `dark:{class}`  | Override class di dark mode                              |
| `localStorage`         | Simpan preferensi user                                  |
| `matchMedia()`         | Deteksi preferensi OS                                     |
| Pasangan warna         | Light + dark — bukan kebalikan langsung                |
| WCAG AA                | Kontras minimum 4.5:1 untuk body text                     |

---

➡️ Lanjut ke [Bagian VI — Kustomisasi & Design System](/bagian-6/index)
