---
title: 'Bab 15 — Middleware Next.js'
---

# Bab 15 — Middleware Next.js

## 15.1 🔒 Middleware — Intercept Setiap Request

```typescript
// middleware.ts — Di root project (sejajar dengan app/)

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ① Proteksi route dashboard
  if (pathname.startsWith('/dashboard')) {
    const token = await getToken({ req: request })

    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname) // Simpan tujuan awal
      return NextResponse.redirect(loginUrl)
    }

    // Cek role — hanya admin yang bisa akses /dashboard/settings
    if (pathname.startsWith('/dashboard/settings') && token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // ② Redirect /admin ke /dashboard
  if (pathname === '/admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // ③ Tambahkan custom header
  const response = NextResponse.next()
  response.headers.set('x-pathname', pathname)
  return response
}

// Tentukan path mana yang diproses middleware (lebih efisien!)
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
```
