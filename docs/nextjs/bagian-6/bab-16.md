---
title: 'Bab 16 — NextAuth.js (Auth.js)'
---

# Bab 16 — NextAuth.js (Auth.js)

## 16.1 🔧 Setup NextAuth

```bash
npm install next-auth@beta @auth/prisma-adapter
```

```typescript
// lib/auth.ts — Konfigurasi NextAuth

import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { prisma } from './db'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    // ① Login dengan Google OAuth
    Google({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ② Login dengan email + password
    Credentials({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user?.password) return null

        const passwordCocok = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        return passwordCocok ? user : null
      },
    }),
  ],

  callbacks: {
    // Tambahkan data custom ke session
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id   = token.sub!
        session.user.role = token.role as string
      }
      return session
    },

    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    },
  },

  pages: {
    signIn: '/login',         // Halaman login custom
    error:  '/auth/error',    // Halaman error auth
  },

  session: { strategy: 'jwt' },
})
```

```typescript
// app/api/auth/[...nextauth]/route.ts — Route handler NextAuth
import { handlers } from '@/lib/auth'
export const { GET, POST } = handlers
```

---

## 16.2 🔐 Menggunakan Auth di Komponen

```tsx
// Di Server Component — gunakan auth() langsung
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

async function DashboardPage() {
  const session = await auth()

  if (!session) redirect('/login')

  return <div>Halo, {session.user?.name}!</div>
}

// Di Client Component — gunakan useSession()
'use client'
import { useSession, signIn, signOut } from 'next-auth/react'

function AuthButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') return <span>Loading...</span>

  if (session) {
    return (
      <div>
        <img src={session.user?.image ?? ''} alt="Avatar" />
        <span>{session.user?.name}</span>
        <button onClick={() => signOut()}>Logout</button>
      </div>
    )
  }

  return <button onClick={() => signIn('google')}>Login dengan Google</button>
}
```
