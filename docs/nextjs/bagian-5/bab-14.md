---
title: 'Bab 14 — Server Actions — Cara Modern Mutasi Data'
---

# Bab 14 — Server Actions — Cara Modern Mutasi Data

## 14.1 🎯 Apa itu Server Actions?

> 💡 **Server Actions adalah game changer!**
> Bayangkan bisa submit form dan langsung update database
> **tanpa perlu membuat API Route terpisah**.
> Server Actions menjalankan fungsi di server langsung dari form atau event handler.

```
Cara Lama (React + Express):
Form submit → fetch('/api/posts', { method: 'POST' }) → API Route → Database

Cara Baru (Server Actions):
Form submit → Server Action → Database (API Route tidak perlu!)
```

---

## 14.2 📝 Server Actions untuk Form

```tsx
// app/dashboard/posts/new/page.tsx
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'

// Definisikan Server Action
async function buatPost(formData: FormData) {
  'use server' // ← Directive ini WAJIB untuk Server Action

  const title   = formData.get('title') as string
  const content = formData.get('content') as string

  // Validasi
  if (!title || title.length < 3) {
    throw new Error('Judul minimal 3 karakter')
  }

  // Langsung simpan ke database — tidak perlu API!
  await prisma.post.create({
    data: {
      title,
      slug:     title.toLowerCase().replace(/ /g, '-'),
      content,
      authorId: 'current-user-id',
    }
  })

  revalidatePath('/blog')         // Refresh halaman blog
  revalidatePath('/dashboard/posts') // Refresh daftar post di dashboard
  redirect('/dashboard/posts')    // Redirect setelah berhasil
}

export default function NewPostPage() {
  return (
    // action={buatPost} → Ketika form submit, Server Action dipanggil
    <form action={buatPost} className="space-y-4">
      <input name="title" placeholder="Judul artikel" required />
      <textarea name="content" placeholder="Konten artikel" rows={10} required />
      <button type="submit">Publikasikan</button>
    </form>
  )
}
```

---

## 14.3 🔄 Server Actions dengan useFormState & useFormStatus

```tsx
// actions/post.actions.ts — Pisahkan Server Actions ke file sendiri
'use server'

import { z } from 'zod' // Validasi schema

// Schema validasi dengan Zod
const PostSchema = z.object({
  title:      z.string().min(3, 'Judul minimal 3 karakter').max(100),
  excerpt:    z.string().max(200).optional(),
  content:    z.string().min(10, 'Konten minimal 10 karakter'),
  categoryId: z.string().min(1, 'Pilih kategori'),
  published:  z.boolean().default(false),
})

type ActionState = {
  errors?: { [key: string]: string[] }
  message?: string
  success?: boolean
}

export async function createPost(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  // Validasi
  const validasi = PostSchema.safeParse({
    title:      formData.get('title'),
    excerpt:    formData.get('excerpt'),
    content:    formData.get('content'),
    categoryId: formData.get('categoryId'),
    published:  formData.get('published') === 'on',
  })

  if (!validasi.success) {
    return {
      errors:  validasi.error.flatten().fieldErrors,
      message: 'Gagal. Periksa kembali data Anda.',
    }
  }

  try {
    await prisma.post.create({
      data: {
        ...validasi.data,
        slug:     slugify(validasi.data.title),
        authorId: 'current-user-id',
      }
    })

    revalidatePath('/blog')
    return { success: true, message: 'Artikel berhasil dipublikasikan!' }

  } catch {
    return { message: 'Terjadi kesalahan server.' }
  }
}
```

```tsx
// app/dashboard/posts/new/page.tsx — Form dengan status & error
'use client'
import { useFormState, useFormStatus } from 'react-dom'
import { createPost } from '@/actions/post.actions'

// Submit button yang tahu status form
function SubmitButton() {
  const { pending } = useFormStatus() // Otomatis tahu apakah form sedang submit
  return (
    <button type="submit" disabled={pending}>
      {pending ? '⏳ Menyimpan...' : '💾 Simpan Artikel'}
    </button>
  )
}

export default function NewPostForm() {
  const [state, dispatch] = useFormState(createPost, {})

  return (
    <form action={dispatch}>
      {state.message && (
        <div className={state.success ? 'text-green-600' : 'text-red-600'}>
          {state.message}
        </div>
      )}

      <div>
        <input name="title" placeholder="Judul" />
        {state.errors?.title && (
          <p className="text-red-500 text-sm">{state.errors.title[0]}</p>
        )}
      </div>

      <div>
        <textarea name="content" placeholder="Konten" rows={10} />
        {state.errors?.content && (
          <p className="text-red-500 text-sm">{state.errors.content[0]}</p>
        )}
      </div>

      <SubmitButton />
    </form>
  )
}
```
