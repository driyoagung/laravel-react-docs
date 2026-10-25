---
title: 'Bab 10 — Data Fetching di Next.js'
---

# Bab 10 — Data Fetching di Next.js

## 10.1 🔄 Fetch API dengan Caching

```tsx
// Next.js mengextend fetch() bawaan dengan opsi caching

// ① Cache selamanya (SSG behavior)
const data = await fetch('https://api.example.com/posts', {
  cache: 'force-cache' // Default!
})

// ② Tidak cache sama sekali (SSR behavior)
const data = await fetch('https://api.example.com/posts', {
  cache: 'no-store'
})

// ③ Revalidate setiap N detik (ISR behavior)
const data = await fetch('https://api.example.com/posts', {
  next: { revalidate: 3600 } // 1 jam
})

// ④ Revalidate berdasarkan tag
const data = await fetch('https://api.example.com/posts', {
  next: { tags: ['posts'] }
})

// Invalidasi manual berdasarkan tag
import { revalidateTag } from 'next/cache'
revalidateTag('posts') // Refresh semua fetch dengan tag 'posts'
```

---

## 10.2 ⚡ Parallel & Sequential Fetching

```tsx
// ❌ Sequential — lambat! (total: 300ms + 400ms = 700ms)
async function BlogPage() {
  const user  = await fetchUser()     // 300ms
  const posts = await fetchPosts()    // 400ms (mulai setelah user selesai)
  // Total: 700ms
}

// ✅ Parallel — cepat! (total: max(300ms, 400ms) = 400ms)
async function BlogPage() {
  const [user, posts] = await Promise.all([
    fetchUser(),   // 300ms  ┐ Mulai bersamaan!
    fetchPosts(),  // 400ms  ┘
  ])
  // Total: 400ms — hampir 2x lebih cepat!
}
```
