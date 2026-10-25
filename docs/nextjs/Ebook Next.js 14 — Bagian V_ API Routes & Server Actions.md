# 🟡 Ebook Next.js 14 — Bagian V: API Routes & Server Actions

> 📌 Di bagian ini kita membangun *backend* aplikasi: **Route Handlers** (RESTful API) dan **Server Actions** (mutasi data langsung dari komponen), plus validasi dengan Zod.

---

## 📖 Bab 13 — API Routes (Route Handlers)

Pada Pages Router kita mengenal folder `pages/api`. Di App Router penggantinya adalah **Route Handlers** — file bernama `route.ts` di dalam folder `app/api/...`.

**Kapan pakai apa?**

| Kebutuhan | Solusi |
|---|---|
| Mobile app / pihak ketiga butuh REST API | ✅ Route Handler |
| Frontend Next.js kirim form / update data | ✅ Server Action (lebih simpel) |
| Webhook (Midtrans, Stripe, WhatsApp) | ✅ Route Handler |
| Cron job terjadwal | ✅ Route Handler |

### ⚠️ Channel (GET) tidak boleh dibuat Client Component
---

> ⚠️ Channel (GET) tidak boleh dibuat Client Component

Perhatikan dua stempel berpasangan itu: server Vector Slot
### 🖥️ 13.1 Route Handler pertama

```
app/
└── api/
    └── posts/
        ├── route.ts       → GET, POST
        └── [id]/
            └── route.ts   → GET, PUT, DELETE
```

**Contoh `app/api/posts/route.ts`:**

```ts
import { NextResponse } from "next/server";

// Data dummy — nanti diganti Prisma
let posts = [
  { id: 1, title: "Belajar Next.js", published: true },
  { id: 2, title: "Belajar Laravel", published: false },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  const data = q
    ? posts.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()))
    : posts;

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const body = await request.json();
  const newPost = { id: Date.now(), ...body };
  posts.push(newPost);

  return NextResponse.json({ data: newPost }, { status: 201 });
}
```

**Penjelasan alur kode:**

1. `GET` membaca query string (`?q=...`) dari `request.url`, memfilter data, lalu mengembalikannya sebagai JSON.
2. `POST` membaca body JSON dengan `request.json()`, menambahkan post baru, lalu merespons dengan status `201 Created`.
3. `NextResponse.json()` adalah helper resmi Next.js untuk mengirim JSON beserta header yang benar.

**Cara coba di terminal:**

```bash
# GET semua
curl http://localhost:3000/api/posts

# GET dengan filter
curl "http://localhost:3000/api/posts?q=nextjs"

# POST data baru
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Post baru","published":false}'
```

### ⚠️ export. POST tidak aman
---

> ⚠️ export. POST tidak aman

Hanya perlu menyimpan offset dari controller.
### ⚠️ export. POST tidak aman
---

> ⚠️ export. POST tidak aman

Hanya perlu menyimpan offset dari controller.
### 🖥️ 13.2 Dynamic Route Handler — `app/api/posts/[id]/route.ts`

```ts
import { NextResponse } from "next/server";

let posts = [
  { id: 1, title: "Belajar Next.js" },
  { id: 2, title: "Belajar Laravel" },
];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const post = posts.find((p) => p.id === Number(params.id));

  if (!post) {
    return NextResponse.json({ error: "Post tidak ditemukan" }, { status: 404 });
  }
  return NextResponse.json({ data: post });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const idx = posts.findIndex((p) => p.id === Number(params.id));
  if (idx === -1) {
    return NextResponse.json({ error: "Post tidak ditemukan" }, { status: 404 });
  }

  const body = await request.json();
  posts[idx] = { ...posts[idx], ...body };
  return NextResponse.json({ data: posts[idx] });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  posts = posts.filter((p) => p.id !== Number(params.id));
  return new NextResponse(null, { status: 204 });
}
```

**Penjelasan alur kode:**

1. Parameter dinamis `[id]` tersedia lewat `params.id` (bertipe `string`, jadi kita `Number()` dulu).
2. `PUT` menimpa field yang dikirim saja (`{ ...posts[idx], ...body }`) — pola *partial update*.
3. `DELETE` membalas `204 No Content` — kode standar ketika tidak ada body untuk dikembalikan.

> 💡 HTTP status yang sopan: `201` saat create, `200`/`204` saat sukses, `400` saat body salah, `404` saat tidak ada, `401` saat belum login, `403` saat tidak berhak, `500` saat server error.

---

## 📖 Bab 14 — Validasi Input dengan Zod

> ⚠️ ```ts
> ---
>
> Body maupun path yang diteruskan bisa valid dengan utilitas HTTP.

Jangan pernah percaya input dari client. **Zod** adalah library validasi berbasis schema yang sangat populer di ekosistem Next.js (TS-first, error message jelas).

```bash
npm install zod
```

### 🖥️ 14.1 Schema & parsing

```ts
// lib/validations.ts
import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter").max(100),
  content: z.string().min(10, "Konten minimal 10 karakter"),
  published: z.boolean().default(false),
});

// Ambil tipe TypeScript otomatis dari schema
export type CreatePostInput = z.infer<typeof createPostSchema>;
```

**Penggunaan di Route Handler:**

```ts
import { createPostSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const body = await request.json();

  const parsed = createPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // parsed.data sudah bertipe CreatePostInput & sudah bersih
  const newPost = await db.post.create({ data: parsed.data });

  return NextResponse.json({ data: newPost }, { status: 201 });
}
```

**Penjelasan alur kode:**

1. `safeParse()` tidak melempar error — ia mengembalikan objek `{ success, data }` atau `{ success, error }`.
2. Jika gagal validasi, kita format errornya dengan `flatten().fieldErrors()` supaya mudah ditampilkan per-field di frontend.
3. Jika sukses, `parsed.data` dijamin tipe dan bentuknya benar — inilah mengapa validasi di server tetap wajib meskipun frontend sudah memakai `react-hook-form`/Zod juga.

> 💡 Validasi harus ada di server, selalu. Validasi di frontend hanya untuk UX (pesan error instan). Client bisa di-bypass dengan curl.

---

## 📖 Bab 15 — Server Actions

Server Actions = fungsi `async` yang dieksekusi di server, dipanggil langsung dari komponen (form React). Tidak perlu bikin API endpoint.

### 🔧 15.1 Aturan dasar

```ts
// Server Action di file terpisah
'use server'

export async function createPost(formData: FormData) {
  const title = formData.get('title')
  await db.post.create({ data: { title } })
}
```

> ⚠️ Server Action hanya bisa menerima argumen yang bisa diserialisasi (string/number/objek polos). Tidak boleh mengirim fungsi, class instance, atau data Prisma mentah dengan relasi berlapis.

### 🖥️ 15.2 useFormState — Server Action + tampilkan hasilnya di form

```tsx
// app/posts/new/page.tsx
'use client'

import { useFormState } from 'react-dom'
import { createPost } from '@/app/actions'

export default function NewPostPage() {
  const [state, formAction] = useFormState(createPost, {
    errors: null,
  })

  return (
    <form action={formAction}>
      <input name="title" />
      {state.errors?.title && <p>{state.errors.title}</p>}
      <button>Simpan</button>
    </form>
  )
}
```

```ts
// app/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createPostSchema } from '@/lib/validations'

export async function createPost(prevState: any, formData: FormData) {
  const parsed = createPostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  })

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors }
  }

  await db.post.create({ data: parsed.data })
  revalidatePath('/posts')

  return { errors: null }
}
```

**Penjelasan alur kode:**

1. `useFormState(createPost, initialState)` mengikat Server Action ke form; setiap submit, React mengirim `formData` ke server.
2. Server Action menerima `prevState` + `formData`, memvalidasi dengan Zod, lalu **mengembalikan state baru** — state ini otomatis jadi `state` di client.
3. `revalidatePath('/posts')` membersihkan cache halaman daftar post supaya data terbaru langsung tampil.

> 💡 `prevState` wajib ada sebagai argumen pertama meskipun tidak dipakai — itulah tanda fungsi cocok dengan `useFormState`.

### 🖥️ 15.3 useFormStatus — tombol "loading..." saat submit

```tsx
// app/ui/SubmitButton.tsx
'use client'

import { useFormStatus } from 'react-dom'

export function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button disabled={pending} type="submit">
      {pending ? 'Menyimpan...' : 'Simpan'}
    </button>
  )
}
```

> ⚠️ `useFormStatus` hanya bekerja jika komponennya berada **di dalam** `<form>` yang sama — bukan di parent form.

---

## Studi Kasus: Tombol Like Optimistic di Blog

Tujuan: tombol ❤️ bertambah **seketika** saat diklik, tanpa menunggu server (optimistic update dengan `useOptimistic`).

```tsx
// app/ui/LikeButton.tsx
'use client'

import { useOptimistic, useState, useTransition } from 'react'
import { likePost } from '@/app/actions'

export default function LikeButton({
  postId,
  initialLikes,
}: {
  postId: number
  initialLikes: number
}) {
  const [likes, setLikes] = useState(initialLikes)
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    likes,
    (current, amount: number) => current + amount
  )
  const [, startTransition] = useTransition()

  function handleClick() {
    startTransition(() => {
      addOptimisticLike(1)
    })
  }

  return (
    <button onClick={handleClick}>
      ❤️ {optimisticLikes}
    </button>
  )
}
```

**Penjelasan alur kode:**

1. `useOptimistic(state, reducer)` membuat "state sekunder" yang menampilkan hasil optimis; berbasis `likes` yang asli.
2. Ketika diklik, `addOptimisticLike(1)` membungkus perhitungan optimis; React langsung render `optimisticLikes` = likes + 1 **sebelum** server merespon.
3. Setelah Server Action selesai, React otomatis sinkron kembali dengan state asli (`likes`) — kalau server gagal, tampilan kembali seperti semula.

---

## 📋 Recap Bagian V

| Objek | Apa yang Dipelajari |
|---|---|
| Route Handler | `route.ts` untuk CRUD RESTful, respons `NextResponse.json` |
| Dynamic Route | `[id]/route.ts` dengan `params.id` |
| Validasi | Zod schema + `safeParse` + status `400` |
| Server Action | `'use server'`, `useFormState`, `useFormStatus` |
| Optimistic UI | `useOptimistic` + `useTransition` |

**✅ Verifikasi pemahaman:**

1. Kapan memilih Route Handler dan kapan Server Action?
2. Apa fungsi `safeParse` dibanding `parse` biasa?
3. Mengapa argumen pertama Server Action untuk `useFormState` selalu diabaikan?
4. Apa yang terjadi di tampilan jika Server Action gagal saat memakai `useOptimistic`?

---

*Ebook Next.js 14 — From React to Full Stack · Bagian V*
