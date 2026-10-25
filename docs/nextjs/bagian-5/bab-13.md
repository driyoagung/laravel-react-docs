---
title: 'Bab 13 — API Routes (Route Handlers)'
---

# Bab 13 — API Routes (Route Handlers)

## 13.1 🔌 Membuat API Route

```typescript
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/posts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page    = Number(searchParams.get('page')  ?? '1')
    const limit   = Number(searchParams.get('limit') ?? '10')
    const keyword = searchParams.get('q') ?? ''

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: {
          published: true,
          ...(keyword && { title: { contains: keyword, mode: 'insensitive' } }),
        },
        orderBy: { publishedAt: 'desc' },
        skip:    (page - 1) * limit,
        take:    limit,
        include: { author: { select: { name: true } }, category: true },
      }),
      prisma.post.count({ where: { published: true } }),
    ])

    return NextResponse.json({
      data:       posts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal mengambil data post' },
      { status: 500 }
    )
  }
}

// POST /api/posts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, categoryId } = body

    // Validasi
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title dan content wajib diisi' },
        { status: 400 }
      )
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug:    slugify(title),
        content,
        authorId:   'user-id-dari-session',
        categoryId,
      },
    })

    return NextResponse.json(post, { status: 201 })

  } catch (error) {
    return NextResponse.json({ error: 'Gagal membuat post' }, { status: 500 })
  }
}
```

```typescript
// app/api/posts/[id]/route.ts
// GET, PUT, DELETE untuk satu post

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const post = await prisma.post.findUnique({ where: { id: params.id } })
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(post)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json()
  const post = await prisma.post.update({
    where: { id: params.id },
    data:  body,
  })
  return NextResponse.json(post)
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.post.delete({ where: { id: params.id } })
  return NextResponse.json({ message: 'Post berhasil dihapus' })
}
```
