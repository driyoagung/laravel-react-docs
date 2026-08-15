---
title: Bab 1 — Mengenal React & Ekosistemnya
---

# 📖 Bab 1 — Mengenal React & Ekosistemnya

## 1.1 🤔 Apa itu React & Mengapa Populer?

React adalah **JavaScript library** untuk membangun antarmuka pengguna. Dibuat oleh Meta (Facebook) dan dirilis pada 2013, React kini menjadi pilihan utama di industri — dipakai oleh Facebook, Instagram, Netflix, Airbnb, Uber, dan ribuan perusahaan lainnya.

> 💡 **Analogi Sederhana:**
> Jika halaman web adalah sebuah majalah, maka React adalah sistem
> percetakan modular — Anda tidak cetak ulang seluruh majalah hanya karena
> satu artikel berubah. Cukup cetak ulang halaman yang berubah saja.
> Inilah efisiensi yang React bawa ke web.

## 1.2 ⚖️ Perbandingan React vs Vue vs Angular

| Aspek              | React 19            | Vue 3              | Angular 17         |
| ------------------ | ------------------- | ------------------ | ------------------ |
| **Jenis**          | Library (UI only)   | Framework ringan   | Full framework     |
| **Kurva belajar**  | 🟡 Sedang           | 🟢 Rendah          | 🔴 Tinggi          |
| **Ukuran bundle**  | ~40KB               | ~20KB              | ~130KB             |
| **Bahasa**         | JavaScript / TS     | JavaScript / TS    | TypeScript (wajib) |
| **State management** | Redux/Zustand/Context | Pinia            | NgRx               |
| **Rendering**      | Virtual DOM         | Virtual DOM        | Change Detection   |
| **Dibuat oleh**    | Meta (Facebook)     | Evan You (komunitas) | Google           |
| **Lowongan kerja** | ✅ Terbanyak        | Banyak             | Banyak (enterprise) |

**Penjelasan perbandingan:**

- **Jenis** — React hanya library UI. Anda butuh pilih sendiri routing, state mgmt, dll. Vue & Angular lebih lengkap.
- **Kurva belajar** — React sedang. Konsep (hooks, JSX, virtual DOM) butuh waktu. Vue paling ramah pemula.
- **Ukuran bundle** — React 40KB (dengan React DOM). Vue 20KB. Angular 130KB (paling berat).
- **Bahasa** — React & Vue bisa pakai JS atau TS. Angular wajib TS.
- **State management** — React punya banyak pilihan (Redux, Zustand, Context). Vue pakai Pinia. Angular pakai NgRx.
- **Rendering** — React & Vue pakai Virtual DOM. Angular pakai Zone.js untuk change detection.
- **Lowongan kerja** — React **TERBANYAK** lowongannya. Ini fakta pasar kerja.

## 1.3 🆕 Apa yang Baru di React 19?

| Fitur                  | Sebelum React 19              | React 19                                |
| ---------------------- | ----------------------------- | --------------------------------------- |
| **Actions**            | `useState` + manual loading   | `useActionState` — handle otomatis     |
| **Optimistic Updates** | Manual dengan `useState`      | `useOptimistic` built-in                |
| **Form Handling**      | Controlled component manual   | Native form actions                     |
| **`use()` Hook**       | Tidak ada                     | Baca Promise & Context langsung         |
| **Server Components**  | Eksperimental                 | Stable (via Next.js/frameworks)         |
| **`ref` sebagai prop** | `forwardRef` verbose          | Langsung pass `ref` sebagai prop biasa  |
| **`useDeferredValue`** | Terbatas                      | Lebih powerful dengan initial value     |

**Penjelasan fitur React 19:**

- **`useActionState`** — Hook baru untuk handle form action + loading state otomatis. Menggantikan `useState` + manual loading.
- **`useOptimistic`** — Update UI secara instan sebelum server response. Optimistic UI.
- **Form actions** — Pakai `<form action={...}>` native HTML. Tidak perlu JS untuk handle submit.
- **`use()` Hook** — Baca Promise & Context langsung di render. Bekerja dengan Suspense.
- **Server Components** — Render di server, kirim HTML jadi. Bigger TTI, smaller JS bundle.
- **`ref` prop langsung** — Hapus `forwardRef`. Tinggal pass `ref` sebagai prop biasa.
- **`useDeferredValue`** — Defer update UI untuk input yang sering berubah (e.g., search).

## 1.4 🧰 Ekosistem React — Gambaran Besar

```
REACT ECOSYSTEM
│
├── Core
│   └── React 19                → Library utama
│
├── Routing
│   └── React Router v6         → Navigasi SPA
│
├── State Management
│   ├── Redux Toolkit           → Global state (skala besar)
│   ├── Zustand                 → Global state (ringan)
│   └── Jotai / Recoil          → Atomic state
│
├── Server State / Data Fetching
│   ├── TanStack Query          → Cache, sync, async state
│   └── SWR                     → Data fetching ringan
│
├── Meta-Framework
│   ├── Next.js                 → SSR + SSG + App Router
│   └── Remix                   → Full-stack React
│
├── UI Libraries
│   ├── shadcn/ui               → Headless, customizable
│   ├── Material UI             → Material Design
│   └── Chakra UI               → Accessible components
│
└── Dev Tools
    ├── React DevTools          → Debug di browser
    └── Storybook               → Develop komponen isolasi
```

**Penjelasan ekosistem:**

- **Core** — React 19 itu sendiri. Library utama, sisanya complement.
- **Routing** — React Router v6 adalah standard. Alternatives: TanStack Router, Next.js App Router.
- **State Management**:
  - **Redux Toolkit** — Untuk app besar. Opinionated. DevTools bagus.
  - **Zustand** — Untuk app kecil-menengah. 3KB, simple API.
  - **Jotai/Recoil** — Atomic state. Cocok untuk state yang kompleks.
- **Server State**:
  - **TanStack Query** — Standard de facto. Caching, retry, devtools.
  - **SWR** — Alternatif ringan dari Vercel.
- **Meta-Framework**:
  - **Next.js** — React + SSR + SSG. Standard untuk production.
  - **Remix** — Full-stack React. Focused on web standards.
- **UI Libraries**:
  - **shadcn/ui** — Salin component code, customize. Trend baru.
  - **Material UI** — Google Material Design.
  - **Chakra UI** — Accessible components.
- **Dev Tools**:
  - **React DevTools** — Browser extension untuk debug.
  - **Storybook** — Develop & test komponen secara isolasi.

## 1.5 🌐 SPA vs SSR vs SSG — Pilih yang Mana?

|        | SPA                          | SSR                            | SSG                          |
| ------ | ---------------------------- | ------------------------------ | ---------------------------- |
| **Cara kerja** | Render di browser     | Render di server per request   | Render saat build time       |
| **SEO** | Sulit                        | ✅ Bagus                       | ✅ Bagus                     |
| **Kecepatan awal** | Lambat (JS besar) | Sedang                         | ✅ Sangat cepat              |
| **Dinamisme** | ✅ Sangat dinamis      | ✅ Dinamis                     | Terbatas                     |
| **Tools** | Vite + React Router       | Next.js / Remix                | Next.js / Gatsby             |
| **Contoh** | Dashboard, CRM            | E-commerce, News               | Blog, Portofolio             |

**Penjelasan:**

- **SPA** — Semua render di browser. SEO sulit karena bot baca JS. Bagus untuk app interaktif.
- **SSR** — Render di server tiap request. SEO bagus, tapi server load tinggi.
- **SSG** — Generate HTML saat build. Sangat cepat, tapi harus rebuild untuk update content.

## 1.6 ⚙️ Cara Kerja React di Balik Layar

```
┌─────────────────────────────────────────────────┐
│            ALUR UPDATE REACT                    │
│                                                 │
│  State / Props berubah                          │
│         ↓                                       │
│  React jalankan ulang fungsi komponen           │
│  → Hasilkan Virtual DOM baru                    │
│         ↓                                       │
│  Reconciler bandingkan                          │
│  Virtual DOM baru vs Virtual DOM lama           │
│  (proses ini disebut "diffing")                 │
│         ↓                                       │
│  Commit: update HANYA node DOM yang berubah     │
│  (proses ini disebut "patching")                │
│         ↓                                       │
│  Tampilan di browser diperbarui ✅               │
└─────────────────────────────────────────────────┘
```

**Penjelasan step-by-step:**

1. **State/Props berubah** — User klik tombol, `setState` dipanggil, atau props dari parent berubah.
2. **React render ulang** — React panggil function component dengan state/props baru → dapat elemen React baru.
3. **Virtual DOM baru** — Representasi DOM di memory. Object biasa, bukan DOM asli.
4. **Reconciler diffing** — Bandingkan Virtual DOM baru vs lama. Cari perbedaan.
5. **Commit/patching** — Hanya update node DOM yang **berubah**. Misal `className` berubah → update attribute itu saja, BUKAN replace seluruh node.
6. **Browser updated** — User lihat perubahan.

> 💡 **React 19: Automatic Batching**
> React 19 secara otomatis menggabungkan banyak `setState` dalam satu
> re-render — bahkan di dalam `setTimeout`, `Promise`, dan event handler.
> Ini membuat aplikasi lebih efisien tanpa kode tambahan.

## 📌 Ringkasan Bab 1

| Konsep                          | Penjelasan Singkat                                              |
| ------------------------------- | --------------------------------------------------------------- |
| React                            | Library JavaScript untuk UI, dibuat oleh Meta                  |
| Virtual DOM                      | Representasi DOM di memory — React hanya update yang berubah   |
| JSX                              | Ekstensi sintaks JavaScript yang mirip HTML                   |
| Komponen                         | Blok UI reusable — function component (modern)                |
| State & Props                    | Data internal vs data dari parent                              |
| React 19                         | Versi terbaru dengan Actions, useOptimistic, dll               |
| SPA                              | Single Page Application — render di browser                    |

---

➡️ Lanjut ke [Bab 2 — Setup & Struktur Project](/bagian-1/bab-2) untuk mulai coding!
