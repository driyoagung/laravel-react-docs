---
title: Bagian IV — Autentikasi & Keamanan
---

# 🟠 BAGIAN IV — Autentikasi & Keamanan

> 🎯 **Tujuan Bagian Ini:**
> Implementasi autentikasi yang benar, aman, dan siap production —
> dari login biasa, role & permission, hingga autentikasi API dengan Sanctum.

## 📚 Daftar Bab di Bagian Ini

| Bab | Topik                                                       | Status         |
| --- | ----------------------------------------------------------- | -------------- |
| 14  | [Autentikasi dengan Laravel Breeze](/bagian-4/bab-14)       | ✅ Tersedia    |
| 15  | [Role & Permission](/bagian-4/bab-15)                       | ✅ Tersedia    |
| 16  | [Keamanan Laravel](/bagian-4/bab-16)                        | ✅ Tersedia    |

## 🗺️ Peta Konsep Bagian IV

```
Bab 14 — Breeze Setup
   │  (Login, register, forgot password)
   ▼
Bab 15 — Role & Permission
   │  (Gate, Policy, Spatie)
   ▼
Bab 16 — Keamanan
   │  (CSRF, XSS, SQL Injection)
   ▼
Lanjut ke Bagian V → REST API
```

## ⏱️ Estimasi Waktu

| Bab  | Estimasi    |
| ---- | ----------- |
| Bab 14 | 30–45 menit |
| Bab 15 | 45–60 menit |
| Bab 16 | 30–45 menit |
| **Total Bagian IV** | **± 2–2.5 jam** |

::: tip 💡 Tips
Untuk API stateless (Bab 17–20), kita akan pakai **Sanctum** bukan Breeze. Tapi konsep autentikasi-nya tetap sama — bedanya hanya di session vs token.
:::
