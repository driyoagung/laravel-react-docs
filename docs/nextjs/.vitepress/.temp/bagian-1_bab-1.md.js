import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Bab 1 — Mengenal Next.js & Ekosistemnya","description":"","frontmatter":{"title":"Bab 1 — Mengenal Next.js & Ekosistemnya"},"headers":[],"relativePath":"bagian-1/bab-1.md","filePath":"bagian-1/bab-1.md","lastUpdated":null}');
const _sfc_main = { name: "bagian-1/bab-1.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="bab-1-—-mengenal-next-js-ekosistemnya" tabindex="-1">Bab 1 — Mengenal Next.js &amp; Ekosistemnya <a class="header-anchor" href="#bab-1-—-mengenal-next-js-ekosistemnya" aria-label="Permalink to &quot;Bab 1 — Mengenal Next.js &amp; Ekosistemnya&quot;">​</a></h1><h2 id="🏗️-1-1-sejarah-evolusi-next-js" tabindex="-1">🏗️ 1.1 Sejarah &amp; Evolusi Next.js <a class="header-anchor" href="#🏗️-1-1-sejarah-evolusi-next-js" aria-label="Permalink to &quot;🏗️ 1.1 Sejarah &amp; Evolusi Next.js&quot;">​</a></h2><p>Next.js lahir pada tahun 2016 yang dibuat oleh tim <strong>Vercel</strong> (dulu bernama Zeit) sebagai solusi untuk masalah-masalah yang sering dihadapi developer React — terutama soal SEO, performa awal halaman, dan routing. Mari kita lihat bagaimana Next.js berkembang dari waktu ke waktu:</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Next.js 1-9   → Pages Router, SSR dasar</span></span>
<span class="line"><span>               → Solusi awal: HTML bisa di-render dari server</span></span>
<span class="line"><span>               → Routing masih berbasis folder pages/</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Next.js 10-12 → Image Optimization built-in (&lt;Image&gt;)</span></span>
<span class="line"><span>               → ISR (Incremental Static Regeneration) — game changer!</span></span>
<span class="line"><span>               → Middleware untuk intercept request</span></span>
<span class="line"><span>               → Performa &amp; bundle size yang jauh lebih baik</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Next.js 13    → ⭐ App Router diperkenalkan (masih beta)</span></span>
<span class="line"><span>               → React Server Components pertama kali hadir</span></span>
<span class="line"><span>               → Konsep Layouts, Loading UI, Error UI otomatis</span></span>
<span class="line"><span>               → Perubahan paradigma yang BESAR dari Pages Router</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Next.js 14    → ✅ App Router dinyatakan STABLE &amp; direkomendasikan</span></span>
<span class="line"><span>               → Server Actions stable (mutasi data tanpa API!)</span></span>
<span class="line"><span>               → Partial Prerendering (PPR) — experimental</span></span>
<span class="line"><span>               → Peningkatan performa build yang signifikan</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Next.js 15    → React 19 support</span></span>
<span class="line"><span>               → Perbaikan sistem caching (lebih predictable)</span></span>
<span class="line"><span>               → Turbopack sebagai bundler default</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br></div></div><blockquote><p>📌 <strong>Catatan Penting:</strong> Ebook ini fokus pada <strong>Next.js 14</strong> dengan <strong>App Router</strong>. Jika Anda pernah melihat tutorial Next.js lama yang menggunakan <code>getServerSideProps</code> atau <code>getStaticProps</code> — itu adalah era Pages Router yang berbeda caranya. Jangan campur aduk keduanya!</p></blockquote><hr><h2 id="🌐-1-2-ekosistem-next-js" tabindex="-1">🌐 1.2 Ekosistem Next.js <a class="header-anchor" href="#🌐-1-2-ekosistem-next-js" aria-label="Permalink to &quot;🌐 1.2 Ekosistem Next.js&quot;">​</a></h2><p>Next.js bukan hanya sebuah framework — ia hadir dengan ekosistem yang kaya. Berikut adalah gambaran besar dari apa yang akan kita gunakan:</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>NEXT.JS ECOSYSTEM</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── 🧩 Core Framework</span></span>
<span class="line"><span>│   ├── App Router        → Sistem routing berbasis file &amp; folder</span></span>
<span class="line"><span>│   ├── Server Components → Komponen yang di-render di server (React 18+)</span></span>
<span class="line"><span>│   ├── Client Components → Komponen yang di-render di browser</span></span>
<span class="line"><span>│   ├── Server Actions    → Fungsi server yang dipanggil langsung dari form</span></span>
<span class="line"><span>│   └── Middleware        → Kode yang berjalan SEBELUM request diproses</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── 🚀 Built-in Optimizations (Gratis! Tanpa config tambahan)</span></span>
<span class="line"><span>│   ├── next/image   → Kompresi otomatis, lazy load, format WebP</span></span>
<span class="line"><span>│   ├── next/font    → Font tanpa layout shift, di-host lokal</span></span>
<span class="line"><span>│   ├── next/link    → Prefetching halaman otomatis saat link terlihat</span></span>
<span class="line"><span>│   └── next/script  → Load script third-party dengan strategi optimal</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── 🗄️ Data Layer (Pilih salah satu)</span></span>
<span class="line"><span>│   ├── Prisma        → ORM paling populer, type-safe, mudah dipakai</span></span>
<span class="line"><span>│   ├── Drizzle ORM   → Alternatif ringan, SQL-first</span></span>
<span class="line"><span>│   └── fetch()       → Untuk REST API eksternal</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>└── 🔐 Auth &amp; Deploy</span></span>
<span class="line"><span>    ├── NextAuth.js (Auth.js) → Autentikasi lengkap (Google, GitHub, dll)</span></span>
<span class="line"><span>    ├── Clerk                → Auth sebagai layanan (lebih mudah, berbayar)</span></span>
<span class="line"><span>    └── Vercel               → Platform deploy resmi, gratis untuk proyek kecil</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br></div></div><hr><h2 id="📊-1-3-kapan-pilih-next-js-vs-react-biasa" tabindex="-1">📊 1.3 Kapan Pilih Next.js vs React Biasa? <a class="header-anchor" href="#📊-1-3-kapan-pilih-next-js-vs-react-biasa" aria-label="Permalink to &quot;📊 1.3 Kapan Pilih Next.js vs React Biasa?&quot;">​</a></h2><p>Pertanyaan yang sering muncul: <em>&quot;Kenapa tidak pakai React saja?&quot;</em> Jawabannya tergantung pada kebutuhan project Anda:</p><table tabindex="0"><thead><tr><th>Skenario</th><th>Pilihan Terbaik</th><th>Alasan</th></tr></thead><tbody><tr><td>🌐 Landing page produk</td><td><strong>Next.js</strong></td><td>SEO kritis, performa awal harus cepat</td></tr><tr><td>📝 Blog / portal artikel</td><td><strong>Next.js</strong></td><td>SEO sangat penting, konten harus terindeks</td></tr><tr><td>🛍️ E-commerce</td><td><strong>Next.js</strong></td><td>SEO produk + performa = konversi lebih tinggi</td></tr><tr><td>📊 Dashboard admin internal</td><td><strong>Next.js</strong> (atau React)</td><td>SEO tidak penting, tapi Next.js tetap lebih praktis</td></tr><tr><td>📱 Aplikasi mobile</td><td>React Native</td><td>Platform berbeda sama sekali</td></tr><tr><td>🧪 Prototype / eksperimen cepat</td><td>React (CRA/Vite)</td><td>Setup lebih sederhana untuk eksplorasi</td></tr></tbody></table><blockquote><p>💡 <strong>Kesimpulan Praktis:</strong> Jika Anda membangun sesuatu untuk internet yang butuh SEO atau performa halaman yang baik — pilih Next.js. Di dunia kerja saat ini, Next.js sudah menjadi <strong>standar industri</strong> untuk aplikasi web berbasis React.</p></blockquote><hr><h2 id="🆚-1-4-pages-router-vs-app-router-—-mana-yang-harus-dipelajari" tabindex="-1">🆚 1.4 Pages Router vs App Router — Mana yang Harus Dipelajari? <a class="header-anchor" href="#🆚-1-4-pages-router-vs-app-router-—-mana-yang-harus-dipelajari" aria-label="Permalink to &quot;🆚 1.4 Pages Router vs App Router — Mana yang Harus Dipelajari?&quot;">​</a></h2><p>Ini adalah sumber kebingungan terbesar bagi pemula Next.js. Ada <strong>dua sistem routing</strong> yang berbeda:</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Pages Router (LAMA — Next.js &lt; 13)       App Router (BARU — Next.js 13+)</span></span>
<span class="line"><span>────────────────────────────────         ──────────────────────────────────</span></span>
<span class="line"><span>pages/                                   app/</span></span>
<span class="line"><span>├── index.js       → /                   ├── page.tsx        → /</span></span>
<span class="line"><span>├── blog/                                ├── blog/</span></span>
<span class="line"><span>│   └── [slug].js  → /blog/:slug         │   ├── page.tsx    → /blog</span></span>
<span class="line"><span>└── api/                                 │   └── [slug]/</span></span>
<span class="line"><span>    └── posts.js   → /api/posts          │       └── page.tsx → /blog/:slug</span></span>
<span class="line"><span>                                         └── api/posts/</span></span>
<span class="line"><span>                                             └── route.ts    → /api/posts</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Cara fetch data:                         Cara fetch data:</span></span>
<span class="line"><span>getServerSideProps()  → SSR              async/await langsung di komponen</span></span>
<span class="line"><span>getStaticProps()      → SSG              generateStaticParams()</span></span>
<span class="line"><span>useRouter() dari      → navigasi         useRouter() dari &#39;next/navigation&#39;</span></span>
<span class="line"><span>  &#39;next/router&#39;                            (BEDA IMPORT!)</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div><blockquote><p>⚠️ <strong>Perhatian:</strong> Banyak tutorial di YouTube dan blog lama masih menggunakan Pages Router. <strong>Ebook ini 100% fokus pada App Router</strong> karena itulah masa depan Next.js. Semua fitur baru hanya dikembangkan untuk App Router.</p></blockquote><hr><h2 id="🧰-1-5-tech-stack-yang-akan-kita-gunakan" tabindex="-1">🧰 1.5 Tech Stack yang Akan Kita Gunakan <a class="header-anchor" href="#🧰-1-5-tech-stack-yang-akan-kita-gunakan" aria-label="Permalink to &quot;🧰 1.5 Tech Stack yang Akan Kita Gunakan&quot;">​</a></h2><p>Selama perjalanan belajar di ebook ini, kita akan menggunakan stack berikut:</p><table tabindex="0"><thead><tr><th>Tool</th><th>Versi</th><th>Fungsi dalam Project</th></tr></thead><tbody><tr><td><strong>Next.js</strong></td><td>14.x</td><td>Framework utama — routing, SSR, SSG, API</td></tr><tr><td><strong>React</strong></td><td>18.x</td><td>UI Library (sudah termasuk dalam Next.js)</td></tr><tr><td><strong>TypeScript</strong></td><td>5.x</td><td>Type safety — menghindari bug sebelum runtime</td></tr><tr><td><strong>Tailwind CSS</strong></td><td>3.x</td><td>Styling dengan utility classes</td></tr><tr><td><strong>Prisma</strong></td><td>5.x</td><td>ORM untuk query database secara type-safe</td></tr><tr><td><strong>PostgreSQL/SQLite</strong></td><td>Latest</td><td>Database (SQLite untuk dev, PostgreSQL untuk prod)</td></tr><tr><td><strong>NextAuth.js</strong></td><td>5.x</td><td>Sistem autentikasi lengkap</td></tr><tr><td><strong>Vercel</strong></td><td>—</td><td>Platform deployment yang terintegrasi dengan Next.js</td></tr></tbody></table><blockquote><p>📌 <strong>Catatan TypeScript:</strong> Semua kode di ebook ini ditulis dalam TypeScript. Jika Anda belum familiar dengan TypeScript, jangan khawatir — kita akan menjelaskan tipe-tipe yang digunakan. TypeScript sangat direkomendasikan karena Next.js sendiri ditulis dalam TypeScript dan memberikan DX (Developer Experience) yang jauh lebih baik.</p></blockquote></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("bagian-1/bab-1.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const bab1 = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  bab1 as default
};
