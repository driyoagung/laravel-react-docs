---
title: 'Bab 9 — Metadata & SEO'
---

# Bab 9 — Metadata & SEO

## 9.1 📋 Static Metadata

```tsx
// app/blog/page.tsx
import type { Metadata } from 'next'

// Metadata statis — ditulis langsung
export const metadata: Metadata = {
  title:       'Semua Artikel',
  description: 'Kumpulan artikel tentang teknologi dan programming.',
  keywords:    ['Next.js', 'React', 'JavaScript', 'Tutorial'],
  authors:     [{ name: 'Tim Blog CMS' }],

  // Open Graph — untuk preview di media sosial
  openGraph: {
    title:       'Semua Artikel — Blog CMS',
    description: 'Kumpulan artikel tentang teknologi dan programming.',
    url:         'https://blogcms.com/blog',
    siteName:    'Blog CMS',
    images: [{
      url:    'https://blogcms.com/og-blog.jpg',
      width:  1200,
      height: 630,
      alt:    'Blog CMS',
    }],
    type: 'website',
  },

  // Twitter Card
  twitter: {
    card:        'summary_large_image',
    title:       'Semua Artikel',
    description: 'Kumpulan artikel teknologi',
    images:      ['https://blogcms.com/og-blog.jpg'],
  },

  // Robots — instruksi untuk search engine crawler
  robots: {
    index:            true,
    follow:           true,
    googleBot: {
      index:          true,
      follow:         true,
      'max-image-preview': 'large',
    },
  },
}
```

---

## 9.2 🔄 Dynamic Metadata — Per Halaman

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata } from 'next'

// generateMetadata dipanggil untuk buat metadata dinamis per halaman
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where:   { slug: params.slug },
    include: { author: true },
  })

  if (!post) return { title: 'Artikel Tidak Ditemukan' }

  return {
    title:       post.title,
    description: post.excerpt ?? post.content.slice(0, 160),
    authors:     [{ name: post.author.name }],
    openGraph: {
      title:     post.title,
      images:    post.coverImage ? [{ url: post.coverImage }] : [],
      type:      'article',
      publishedTime: post.createdAt.toISOString(),
    },
    alternates: {
      canonical: `https://blogcms.com/blog/${post.slug}`,
    },
  }
}
```

---

## 9.3 🗺️ Sitemap & Robots.txt

```tsx
// app/sitemap.ts — Sitemap otomatis

import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await prisma.post.findMany({
    where:  { published: true },
    select: { slug: true, updatedAt: true },
  })

  const postUrls = posts.map(post => ({
    url:          `https://blogcms.com/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority:     0.8,
  }))

  return [
    { url: 'https://blogcms.com', lastModified: new Date(), priority: 1 },
    { url: 'https://blogcms.com/blog', lastModified: new Date(), priority: 0.9 },
    ...postUrls,
  ]
}
```

```tsx
// app/robots.ts — robots.txt otomatis

import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules:   { userAgent: '*', allow: '/', disallow: '/dashboard/' },
    sitemap: 'https://blogcms.com/sitemap.xml',
  }
}
```
