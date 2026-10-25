import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Bab 21 — Project: Blog CMS dengan Next.js 14","description":"","frontmatter":{"title":"Bab 21 — Project: Blog CMS dengan Next.js 14"},"headers":[],"relativePath":"bagian-9/bab-21.md","filePath":"bagian-9/bab-21.md","lastUpdated":null}');
const _sfc_main = { name: "bagian-9/bab-21.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="bab-21-—-project-blog-cms-dengan-next-js-14" tabindex="-1">Bab 21 — Project: Blog CMS dengan Next.js 14 <a class="header-anchor" href="#bab-21-—-project-blog-cms-dengan-next-js-14" aria-label="Permalink to &quot;Bab 21 — Project: Blog CMS dengan Next.js 14&quot;">​</a></h1><h2 id="_21-1-🎯-fitur-yang-akan-dibangun" tabindex="-1">21.1 🎯 Fitur yang Akan Dibangun <a class="header-anchor" href="#_21-1-🎯-fitur-yang-akan-dibangun" aria-label="Permalink to &quot;21.1 🎯 Fitur yang Akan Dibangun&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Fitur</th><th>Teknologi</th></tr></thead><tbody><tr><td>✅ Halaman utama dengan featured posts</td><td>Server Components + Prisma</td></tr><tr><td>✅ Daftar artikel dengan filter &amp; search</td><td>SearchParams + Prisma</td></tr><tr><td>✅ Detail artikel dengan MDX support</td><td>next-mdx-remote</td></tr><tr><td>✅ Sitemap &amp; robots.txt otomatis</td><td>Next.js built-in</td></tr><tr><td>✅ SEO per halaman dengan OpenGraph</td><td>generateMetadata</td></tr><tr><td>✅ Login Google + Email/Password</td><td>NextAuth.js</td></tr><tr><td>✅ Dashboard penulis — CRUD artikel</td><td>Server Actions</td></tr><tr><td>✅ Upload cover image</td><td>UploadThing / Cloudinary</td></tr><tr><td>✅ Kategori &amp; tag artikel</td><td>Prisma relations</td></tr><tr><td>✅ Bookmark artikel (disimpan lokal)</td><td>Zustand + localStorage</td></tr><tr><td>✅ Dark/Light mode</td><td>next-themes</td></tr><tr><td>✅ Halaman admin — manage semua user</td><td>Role-based access</td></tr><tr><td>✅ ISR — konten fresh tanpa rebuild penuh</td><td>revalidateTag</td></tr><tr><td>✅ Deploy ke Vercel + Neon DB</td><td>Vercel + PostgreSQL</td></tr></tbody></table><hr><h2 id="_21-2-📁-struktur-project-final" tabindex="-1">21.2 📁 Struktur Project Final <a class="header-anchor" href="#_21-2-📁-struktur-project-final" aria-label="Permalink to &quot;21.2 📁 Struktur Project Final&quot;">​</a></h2><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>blog-cms/</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── app/</span></span>
<span class="line"><span>│   ├── (public)/              ← Route group: halaman publik</span></span>
<span class="line"><span>│   │   ├── layout.tsx         ← Layout dengan Navbar &amp; Footer</span></span>
<span class="line"><span>│   │   ├── page.tsx           ← Homepage: /</span></span>
<span class="line"><span>│   │   ├── blog/</span></span>
<span class="line"><span>│   │   │   ├── page.tsx       ← Daftar artikel: /blog</span></span>
<span class="line"><span>│   │   │   └── [slug]/</span></span>
<span class="line"><span>│   │   │       └── page.tsx   ← Detail artikel: /blog/:slug</span></span>
<span class="line"><span>│   │   └── kategori/</span></span>
<span class="line"><span>│   │       └── [slug]/</span></span>
<span class="line"><span>│   │           └── page.tsx   ← Artikel per kategori</span></span>
<span class="line"><span>│   │</span></span>
<span class="line"><span>│   ├── (auth)/                ← Route group: halaman auth</span></span>
<span class="line"><span>│   │   ├── login/page.tsx     ← /login</span></span>
<span class="line"><span>│   │   └── register/page.tsx  ← /register</span></span>
<span class="line"><span>│   │</span></span>
<span class="line"><span>│   ├── dashboard/             ← Area penulis (perlu login)</span></span>
<span class="line"><span>│   │   ├── layout.tsx         ← Layout dengan Sidebar</span></span>
<span class="line"><span>│   │   ├── page.tsx           ← Dashboard overview</span></span>
<span class="line"><span>│   │   ├── posts/</span></span>
<span class="line"><span>│   │   │   ├── page.tsx       ← Daftar post saya</span></span>
<span class="line"><span>│   │   │   ├── new/page.tsx   ← Buat post baru</span></span>
<span class="line"><span>│   │   │   └── [id]/</span></span>
<span class="line"><span>│   │   │       └── edit/page.tsx ← Edit post</span></span>
<span class="line"><span>│   │   └── profile/page.tsx   ← Edit profil</span></span>
<span class="line"><span>│   │</span></span>
<span class="line"><span>│   ├── admin/                 ← Area admin (perlu role ADMIN)</span></span>
<span class="line"><span>│   │   ├── layout.tsx</span></span>
<span class="line"><span>│   │   ├── page.tsx           ← Admin overview</span></span>
<span class="line"><span>│   │   ├── users/page.tsx     ← Manage users</span></span>
<span class="line"><span>│   │   └── posts/page.tsx     ← Manage semua posts</span></span>
<span class="line"><span>│   │</span></span>
<span class="line"><span>│   └── api/</span></span>
<span class="line"><span>│       ├── auth/[...nextauth]/route.ts</span></span>
<span class="line"><span>│       ├── posts/route.ts</span></span>
<span class="line"><span>│       ├── posts/[id]/route.ts</span></span>
<span class="line"><span>│       └── upload/route.ts</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── actions/</span></span>
<span class="line"><span>│   ├── post.actions.ts        ← CRUD post</span></span>
<span class="line"><span>│   ├── auth.actions.ts        ← Register, update profile</span></span>
<span class="line"><span>│   └── admin.actions.ts       ← Admin actions</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── components/</span></span>
<span class="line"><span>│   ├── layout/</span></span>
<span class="line"><span>│   │   ├── Navbar.tsx</span></span>
<span class="line"><span>│   │   ├── Footer.tsx</span></span>
<span class="line"><span>│   │   └── Sidebar.tsx</span></span>
<span class="line"><span>│   ├── blog/</span></span>
<span class="line"><span>│   │   ├── PostCard.tsx</span></span>
<span class="line"><span>│   │   ├── PostList.tsx</span></span>
<span class="line"><span>│   │   ├── PostContent.tsx    ← Render MDX</span></span>
<span class="line"><span>│   │   ├── PostForm.tsx       ← Form buat/edit post</span></span>
<span class="line"><span>│   │   └── CategoryBadge.tsx</span></span>
<span class="line"><span>│   └── ui/</span></span>
<span class="line"><span>│       ├── Button.tsx</span></span>
<span class="line"><span>│       ├── Input.tsx</span></span>
<span class="line"><span>│       ├── Skeleton.tsx</span></span>
<span class="line"><span>│       └── ThemeToggle.tsx</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── lib/</span></span>
<span class="line"><span>│   ├── db.ts                  ← Prisma client singleton</span></span>
<span class="line"><span>│   ├── auth.ts                ← NextAuth config</span></span>
<span class="line"><span>│   ├── utils.ts               ← Helper: slugify, formatDate, dll</span></span>
<span class="line"><span>│   └── validations.ts         ← Zod schemas</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── stores/</span></span>
<span class="line"><span>│   └── useBookmarkStore.ts    ← Zustand bookmark state</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── prisma/</span></span>
<span class="line"><span>│   ├── schema.prisma</span></span>
<span class="line"><span>│   └── seed.ts                ← Data awal</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>└── middleware.ts              ← Proteksi route</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br></div></div><hr><h2 id="_21-3-🚀-urutan-build-step-by-step" tabindex="-1">21.3 🚀 Urutan Build Step by Step <a class="header-anchor" href="#_21-3-🚀-urutan-build-step-by-step" aria-label="Permalink to &quot;21.3 🚀 Urutan Build Step by Step&quot;">​</a></h2><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Step 1 ─── Setup &amp; Database</span></span>
<span class="line"><span>           ├── Create Next.js project</span></span>
<span class="line"><span>           ├── Setup Prisma + schema</span></span>
<span class="line"><span>           ├── Setup NextAuth</span></span>
<span class="line"><span>           └── Seed data awal</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Step 2 ─── Public Pages (SSG/ISR)</span></span>
<span class="line"><span>           ├── Homepage dengan featured posts</span></span>
<span class="line"><span>           ├── Halaman /blog dengan search &amp; filter</span></span>
<span class="line"><span>           ├── Halaman detail /blog/[slug]</span></span>
<span class="line"><span>           └── Halaman kategori</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Step 3 ─── SEO &amp; Performance</span></span>
<span class="line"><span>           ├── generateMetadata per halaman</span></span>
<span class="line"><span>           ├── sitemap.ts &amp; robots.ts</span></span>
<span class="line"><span>           ├── Optimasi gambar dengan &lt;Image&gt;</span></span>
<span class="line"><span>           └── Loading skeleton UI</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Step 4 ─── Auth Pages</span></span>
<span class="line"><span>           ├── Halaman login (Google + Credentials)</span></span>
<span class="line"><span>           ├── Halaman register</span></span>
<span class="line"><span>           └── Middleware proteksi route</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Step 5 ─── Dashboard (Server Actions)</span></span>
<span class="line"><span>           ├── Form buat artikel</span></span>
<span class="line"><span>           ├── Form edit artikel</span></span>
<span class="line"><span>           ├── Hapus artikel</span></span>
<span class="line"><span>           └── Upload cover image</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Step 6 ─── Admin Panel</span></span>
<span class="line"><span>           ├── Daftar semua user</span></span>
<span class="line"><span>           ├── Manage semua artikel</span></span>
<span class="line"><span>           └── Role-based protection</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Step 7 ─── Polish &amp; Deploy</span></span>
<span class="line"><span>           ├── Dark/Light mode</span></span>
<span class="line"><span>           ├── Error boundaries</span></span>
<span class="line"><span>           ├── ISR configuration</span></span>
<span class="line"><span>           └── Deploy ke Vercel + Neon DB</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("bagian-9/bab-21.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const bab21 = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  bab21 as default
};
