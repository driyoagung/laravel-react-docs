---
title: 'Bab 17 — Otorisasi & Role-Based Access'
---

# Bab 17 — Otorisasi & Role-Based Access

## 17.1 🛡️ Role-Based Access Control

```typescript
// lib/auth-utils.ts — Helper untuk cek otorisasi

import { auth } from './auth'
import { redirect } from 'next/navigation'

// Pastikan user sudah login
export async function requireAuth() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  return session
}

// Pastikan user adalah admin
export async function requireAdmin() {
  const session = await requireAuth()
  if (session.user.role !== 'ADMIN') redirect('/dashboard')
  return session
}

// Pastikan user adalah author atau admin
export async function requireAuthor() {
  const session = await requireAuth()
  if (!['ADMIN', 'AUTHOR'].includes(session.user.role)) {
    redirect('/dashboard')
  }
  return session
}
```

```tsx
// Penggunaan di page
async function AdminSettingsPage() {
  const session = await requireAdmin() // Redirect otomatis jika bukan admin

  return <div>Settings untuk admin: {session.user.name}</div>
}
```
