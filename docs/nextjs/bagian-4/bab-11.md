---
title: 'Bab 11 — Prisma ORM — Database di Next.js'
---

# Bab 11 — Prisma ORM — Database di Next.js

## 11.1 🔧 Setup Prisma

```bash
npm install prisma @prisma/client
npx prisma init --datasource-provider postgresql
```

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(AUTHOR)
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  excerpt     String?
  content     String
  coverImage  String?
  published   Boolean   @default(false)
  publishedAt DateTime?
  views       Int       @default(0)
  author      User      @relation(fields: [authorId], references: [id])
  authorId    String
  category    Category  @relation(fields: [categoryId], references: [id])
  categoryId  String
  tags        Tag[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Category {
  id    String @id @default(cuid())
  name  String
  slug  String @unique
  posts Post[]
}

model Tag {
  id    String @id @default(cuid())
  name  String @unique
  posts Post[]
}

enum Role {
  ADMIN
  AUTHOR
  READER
}
```

```bash
# Generate Prisma Client & push ke database
npx prisma generate
npx prisma db push
# atau
npx prisma migrate dev --name init
```

---

## 11.2 🔌 Setup Prisma Client

```typescript
// lib/db.ts
// Singleton pattern — penting untuk Next.js!
// Tanpa ini, setiap hot reload membuat koneksi baru → koneksi habis!

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

---

## 11.3 🔍 Query Prisma yang Sering Dipakai

```typescript
// READ
const posts = await prisma.post.findMany({
  where:   { published: true, authorId: userId },
  orderBy: { createdAt: 'desc' },
  take:    10,
  skip:    20, // Pagination: skip 20, ambil 10
  include: {
    author:   { select: { name: true, email: true } }, // Hanya field tertentu
    category: true,
    tags:     true,
  },
  select: { // Alternatif include — pilih field yang diambil
    id: true, title: true, slug: true, publishedAt: true,
  }
})

// Hitung total untuk pagination
const total = await prisma.post.count({ where: { published: true } })

// SEARCH
const results = await prisma.post.findMany({
  where: {
    OR: [
      { title:   { contains: keyword, mode: 'insensitive' } },
      { content: { contains: keyword, mode: 'insensitive' } },
    ],
  },
})

// CREATE
const post = await prisma.post.create({
  data: {
    title,
    slug:     slugify(title),
    content,
    author:   { connect: { id: authorId } },
    category: { connect: { id: categoryId } },
    tags:     { connect: tagIds.map(id => ({ id })) },
  },
})

// UPDATE
const updated = await prisma.post.update({
  where: { id: postId },
  data:  { title, content, published: true, publishedAt: new Date() },
})

// DELETE
await prisma.post.delete({ where: { id: postId } })

// TRANSACTION
const [post, _] = await prisma.$transaction([
  prisma.post.create({ data: postData }),
  prisma.user.update({ where: { id: authorId }, data: { postCount: { increment: 1 } } }),
])
```
