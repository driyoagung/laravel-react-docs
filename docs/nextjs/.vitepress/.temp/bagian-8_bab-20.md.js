import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Bab 20 — Deploy ke Vercel & Best Practices","description":"","frontmatter":{"title":"Bab 20 — Deploy ke Vercel & Best Practices"},"headers":[],"relativePath":"bagian-8/bab-20.md","filePath":"bagian-8/bab-20.md","lastUpdated":null}');
const _sfc_main = { name: "bagian-8/bab-20.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="bab-20-—-deploy-ke-vercel-best-practices" tabindex="-1">Bab 20 — Deploy ke Vercel &amp; Best Practices <a class="header-anchor" href="#bab-20-—-deploy-ke-vercel-best-practices" aria-label="Permalink to &quot;Bab 20 — Deploy ke Vercel &amp; Best Practices&quot;">​</a></h1><h2 id="_20-1-🚀-deploy-ke-vercel-cara-termudah" tabindex="-1">20.1 🚀 Deploy ke Vercel (Cara Termudah) <a class="header-anchor" href="#_20-1-🚀-deploy-ke-vercel-cara-termudah" aria-label="Permalink to &quot;20.1 🚀 Deploy ke Vercel (Cara Termudah)&quot;">​</a></h2><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}"># Install Vercel CLI</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6F42C1", "--shiki-dark": "#B392F0" })}">npm</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}"> install</span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}"> -g</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}"> vercel</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}"># Login</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6F42C1", "--shiki-dark": "#B392F0" })}">vercel</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}"> login</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}"># Deploy</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6F42C1", "--shiki-dark": "#B392F0" })}">vercel</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}"># Deploy ke production</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6F42C1", "--shiki-dark": "#B392F0" })}">vercel</span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}"> --prod</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><p><strong>Atau via GitHub:</strong></p><ol><li>Push ke GitHub</li><li>Buka vercel.com → Import project</li><li>Hubungkan repo → Vercel otomatis build &amp; deploy</li><li>Setiap push ke <code>main</code> → otomatis deploy ulang</li></ol><hr><h2 id="_20-2-⚙️-environment-variables-di-vercel" tabindex="-1">20.2 ⚙️ Environment Variables di Vercel <a class="header-anchor" href="#_20-2-⚙️-environment-variables-di-vercel" aria-label="Permalink to &quot;20.2 ⚙️ Environment Variables di Vercel&quot;">​</a></h2><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Di Vercel Dashboard → Project → Settings → Environment Variables:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DATABASE_URL          = postgresql://... (Production DB)</span></span>
<span class="line"><span>NEXTAUTH_URL          = https://blogcms.vercel.app</span></span>
<span class="line"><span>NEXTAUTH_SECRET       = [generate dengan: openssl rand -base64 32]</span></span>
<span class="line"><span>GOOGLE_CLIENT_ID      = ...</span></span>
<span class="line"><span>GOOGLE_CLIENT_SECRET  = ...</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><hr><h2 id="_20-3-📊-checklist-sebelum-deploy-production" tabindex="-1">20.3 📊 Checklist Sebelum Deploy Production <a class="header-anchor" href="#_20-3-📊-checklist-sebelum-deploy-production" aria-label="Permalink to &quot;20.3 📊 Checklist Sebelum Deploy Production&quot;">​</a></h2><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Performance:</span></span>
<span class="line"><span>☐ Semua gambar pakai &lt;Image&gt; component</span></span>
<span class="line"><span>☐ Font pakai next/font (bukan Google Fonts link)</span></span>
<span class="line"><span>☐ Strategi caching yang tepat (revalidate, tags)</span></span>
<span class="line"><span>☐ Parallel fetching dengan Promise.all</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SEO:</span></span>
<span class="line"><span>☐ metadata di setiap page</span></span>
<span class="line"><span>☐ generateMetadata untuk halaman dinamis</span></span>
<span class="line"><span>☐ sitemap.ts ada</span></span>
<span class="line"><span>☐ robots.ts ada</span></span>
<span class="line"><span>☐ OpenGraph image untuk setiap halaman penting</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Security:</span></span>
<span class="line"><span>☐ Environment variables tidak ada di kode</span></span>
<span class="line"><span>☐ API Routes ada validasi &amp; autentikasi</span></span>
<span class="line"><span>☐ Server Actions ada validasi input</span></span>
<span class="line"><span>☐ Middleware proteksi route yang perlu auth</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Database:</span></span>
<span class="line"><span>☐ Prisma connection pool dikonfigurasi</span></span>
<span class="line"><span>☐ Migration production sudah dijalankan</span></span>
<span class="line"><span>☐ Backup database ada</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("bagian-8/bab-20.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const bab20 = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  bab20 as default
};
