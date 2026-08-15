---
title: Bab 20 — Form Handling dengan React Hook Form
---

# 📖 Bab 20 — Form Handling — React Hook Form & Zod

## 20.1 🔧 Setup React Hook Form

```bash
npm install react-hook-form @hookform/resolvers zod
```

```jsx
// src/pages/auth/LoginPage.jsx
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// Schema validasi dengan Zod
const loginSchema = z.object({
  email:    z.string().email('Format email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
})

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(data) {
    try {
      await authService.login(data.email, data.password)
      navigate('/') // Redirect setelah login
    } catch (err) {
      // Set error dari server ke field tertentu
      setError('root', { message: 'Email atau password salah.' })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register('email')} // Register field ke React Hook Form
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" {...register('password')} />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
      </div>

      {errors.root && <p className="alert-error">{errors.root.message}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Masuk...' : 'Masuk'}
      </button>
    </form>
  )
}
```

**Penjelasan:**

- **`useForm()`** — Hook utama RHF. Return register, handleSubmit, formState, dll.
- **`register('email')`** — Spread ke `<input>`. Auto hook ke value & validation.
- **`handleSubmit(onSubmit)`** — Wrap handler asli. Validasi dulu, lalu call.
- **`zodResolver(loginSchema)`** — Adapter Zod untuk RHF.
- **`formState.errors`** — Object error per field.
- **`setError('root', ...)`** — Set error global (untuk error dari server).

## 20.2 📋 Skema Zod yang Kompleks

```javascript
// src/schemas/listingSchema.js
import { z } from 'zod'

export const listingSchema = z.object({
  title: z.string().min(10, 'Judul minimal 10 karakter').max(100),
  description: z.string().min(50, 'Deskripsi minimal 50 karakter'),
  price: z.number().positive('Harga harus lebih dari 0').max(100000000),
  category: z.enum(['villa', 'apartment', 'house', 'unique']),
  guests: z.number().int().min(1).max(20),
  amenities: z.array(z.string()).min(1, 'Pilih minimal 1 amenity'),
  images: z.array(z.string().url()).min(5, 'Minimal 5 foto'),
  location: z.object({
    address: z.string().min(5),
    city: z.string(),
    country: z.string(),
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
})

export type ListingFormData = z.infer<typeof listingSchema>
```

**Penjelasan Zod:**

- **`z.string().min(10).max(100)`** — String 10-100 char.
- **`z.number().positive()`** — Positive number.
- **`z.enum([...])`** — Enum string.
- **`z.array().min(1)`** — Array minimal 1 item.
- **`z.object({...})`** — Nested object schema.
- **`z.infer<typeof schema>`** — Auto-generate TypeScript type.

## 20.3 🔄 Form Kompleks dengan Field Array

```jsx
import { useForm, useFieldArray } from 'react-hook-form'

function ScheduleForm() {
  const { register, control, handleSubmit } = useForm({
    defaultValues: { schedules: [{ day: 'Senin', open: '09:00', close: '21:00' }] },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'schedules',
  })

  function onSubmit(data) {
    console.log('Schedules:', data.schedules)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field, index) => (
        <div key={field.id}>
          <select {...register(`schedules.${index}.day`)}>
            <option>Senin</option>
            <option>Selasa</option>
            {/* ... */}
          </select>
          <input type="time" {...register(`schedules.${index}.open`)} />
          <input type="time" {...register(`schedules.${index}.close`)} />
          <button type="button" onClick={() => remove(index)}>Hapus</button>
        </div>
      ))}

      <button type="button" onClick={() => append({ day: 'Senin', open: '09:00', close: '21:00' })}>
        + Tambah Hari
      </button>

      <button type="submit">Simpan</button>
    </form>
  )
}
```

**Penjelasan `useFieldArray`:**

- **`useFieldArray`** — Hook untuk dynamic array of fields.
- **`fields`** — Array of fields dengan id.
- **`append()`** — Tambah field baru.
- **`remove(index)`** — Hapus field di index tertentu.
- **`field.id`** — WAJIB untuk `key` di map.

## 20.4 ⚡ Performa — RHF Minimal Re-render

```jsx
// React Hook Form pakai uncontrolled input + ref secara default
// → Re-render hanya terjadi untuk field yang error/sedang diubah
// Tanpa perlu memo atau React.memo

// Untuk watch nilai field (misal menampilkan preview real-time):
const { register, watch } = useForm()
const title = watch('title') // Re-render hanya saat title berubah
```

**Penjelasan performa:**

- **Uncontrolled input** — RHF pakai ref, bukan controlled state. Hemat re-render.
- **`watch()`** — Subscribe ke field tertentu. Hanya re-render saat field itu berubah.

## 📌 Ringkasan Bab 20

| Konsep                | Penjelasan Singkat                                              |
| --------------------- | --------------------------------------------------------------- |
| React Hook Form        | Library form handling #1 untuk React (10KB, performant)      |
| `register()`           | Daftarkan field ke RHF (controlled hanya saat error)          |
| `handleSubmit`         | Wrap handler asli, jalankan validasi dulu                      |
| `formState.errors`     | Object error per field dari resolver                           |
| Zod                    | Schema validation TypeScript-first dengan inferensi type       |
| `zodResolver`          | Adapter Zod untuk RHF                                         |
| `useFieldArray`        | Dynamic field array (add/remove rows)                          |
| `watch`                | Subscribe nilai field (re-render saat berubah)                |

---

➡️ Lanjut ke [Bab 21 — Axios & API Layer](/bagian-5/bab-21)
