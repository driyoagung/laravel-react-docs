---
title: Bab 18 — React Router Lanjutan
---

# 📖 Bab 18 — React Router Lanjutan (Loader, Action)

## 18.1 🎭 Loader — Fetch Data Sebelum Render

```jsx
// React Router v6.4+ Data API — fetch data sebelum render halaman
import { createBrowserRouter, useLoaderData } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/listing/:id',
    element: <ListingDetailPage />,
    loader: async ({ params }) => {
      // Dijalankan SEBELUM komponen dirender
      const listing = await listingService.getById(params.id)
      if (!listing) throw new Response('Not Found', { status: 404 })
      return listing
    },
    errorElement: <ErrorPage />,
  },
])

// Di komponen — data sudah tersedia saat render (tidak perlu loading state!)
function ListingDetailPage() {
  const listing = useLoaderData()
  return <ListingInfo listing={listing} />
}
```

**Penjelasan Loader:**

- **`loader`** — Async function. Dijalankan SEBELUM component render.
- **`useLoaderData()`** — Akses data dari loader.
- **Error handling** — `throw new Response()` akan trigger `errorElement`.
- **URL params** — `params.id` otomatis tersedia.

## 18.2 📝 Action — Handle Form Submission

```jsx
const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
    action: async ({ request }) => {
      const formData = await request.formData()
      const email = formData.get('email')
      const password = formData.get('password')

      try {
        const data = await authService.login(email, password)
        localStorage.setItem('token', data.token)
        return redirect('/dashboard')
      } catch (err) {
        return { error: 'Email atau password salah' }
      }
    },
  },
])

// Di form
function LoginPage() {
  const actionData = useActionData()
  return (
    <form method="post">
      <input name="email" />
      <input name="password" type="password" />
      {actionData?.error && <p className="error">{actionData.error}</p>}
      <button type="submit">Login</button>
    </form>
  )
}
```

**Penjelasan Action:**

- **`action`** — Handle form submission di route level.
- **`request.formData()`** — Parse form data.
- **`redirect()`** — Helper untuk redirect.
- **`useActionData()`** — Akses return value dari action.

## 18.3 🔄 useNavigation — Loading State Otomatis

```jsx
import { useNavigation } from 'react-router-dom'

function Header() {
  const navigation = useNavigation()
  const isNavigating = navigation.state === 'loading'

  return (
    <header>
      <Logo />
      {isNavigating && <Spinner />} {/* Auto muncul saat navigasi */}
    </header>
  )
}
```

**Penjelasan `useNavigation`:**

- **`navigation.state`** — `'idle'`, `'loading'`, atau `'submitting'`.
- Berguna untuk global spinner saat navigasi atau submit form.

## 18.4 🆕 React 19 Form Actions

```jsx
// React 19 + useActionState
import { useActionState } from 'react'

function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    async (prevState, formData) => {
      const name = formData.get('name')
      const email = formData.get('email')
      // ... submit to server
      return { success: true, message: 'Pesan terkirim!' }
    },
    null
  )

  return (
    <form action={formAction}>
      <input name="name" />
      <input name="email" type="email" />
      <button disabled={isPending}>
        {isPending ? 'Mengirim...' : 'Kirim'}
      </button>
      {state?.message && <p>{state.message}</p>}
    </form>
  )
}
```

**Penjelasan React 19 `useActionState`:**

- **Hook baru** — Built-in action state.
- **`formAction`** — Gunakan di `<form action={...}>`.
- **`isPending`** — Loading state.

## 📌 Ringkasan Bab 18

| Konsep                | Penjelasan Singkat                                              |
| --------------------- | --------------------------------------------------------------- |
| `createBrowserRouter` | Setup router v6.4+ dengan data API                            |
| `loader`               | Async function yang fetch data sebelum render                  |
| `useLoaderData`        | Akses data dari loader di komponen                             |
| `action`               | Handle form submission di route level                          |
| `useActionData`        | Akses return value dari action                                 |
| `useNavigation`        | Cek status navigasi (idle/loading/submitting)                  |
| `errorElement`         | Component untuk tampilkan error dari loader/action              |
| React 19 `useActionState` | Built-in action state untuk form                             |

---

➡️ Lanjut ke [Bab 19 — TanStack Query — Server State](/bagian-5/bab-19)
