---
title: 'Bab 12 — State Management di Next.js'
---

# Bab 12 — State Management di Next.js

## 12.1 🗄️ Zustand — State Management Ringan

```bash
npm install zustand
```

```typescript
// stores/useCartStore.ts — Contoh untuk blog: bookmark artikel
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface BookmarkStore {
  bookmarks: string[]         // Array of post IDs
  addBookmark:    (id: string) => void
  removeBookmark: (id: string) => void
  isBookmarked:   (id: string) => boolean
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set, get) => ({
      bookmarks: [],

      addBookmark: (id) =>
        set(state => ({ bookmarks: [...state.bookmarks, id] })),

      removeBookmark: (id) =>
        set(state => ({ bookmarks: state.bookmarks.filter(b => b !== id) })),

      isBookmarked: (id) => get().bookmarks.includes(id),
    }),
    { name: 'bookmarks-storage' } // Persist ke localStorage
  )
)
```

```tsx
// components/BookmarkButton.tsx
'use client'
import { useBookmarkStore } from '@/stores/useBookmarkStore'

export default function BookmarkButton({ postId }: { postId: string }) {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarkStore()
  const saved = isBookmarked(postId)

  return (
    <button onClick={() => saved ? removeBookmark(postId) : addBookmark(postId)}>
      {saved ? '🔖 Tersimpan' : '📌 Simpan'}
    </button>
  )
}
```
