import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"⚛️ Ebook React — Dokumentasi Bahasa Indonesia","description":"","frontmatter":{},"headers":[],"relativePath":"README.md","filePath":"README.md","lastUpdated":null}');
const _sfc_main = { name: "README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="⚛️-ebook-react-—-dokumentasi-bahasa-indonesia" tabindex="-1">⚛️ Ebook React — Dokumentasi Bahasa Indonesia <a class="header-anchor" href="#⚛️-ebook-react-—-dokumentasi-bahasa-indonesia" aria-label="Permalink to &quot;⚛️ Ebook React — Dokumentasi Bahasa Indonesia&quot;">​</a></h1><p>Dokumentasi lengkap <strong>React 19</strong> dalam Bahasa Indonesia, dibuat dengan <a href="https://vitepress.dev/" target="_blank" rel="noreferrer">VitePress</a>. Bagian dari monorepo <strong>ebook-docs</strong>.</p><h2 id="🚀-quick-start" tabindex="-1">🚀 Quick Start <a class="header-anchor" href="#🚀-quick-start" aria-label="Permalink to &quot;🚀 Quick Start&quot;">​</a></h2><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}"># Dari root monorepo</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6F42C1", "--shiki-dark": "#B392F0" })}">npm</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}"> run</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}"> dev:react</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}"># Atau langsung</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">cd</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}"> docs/react</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6F42C1", "--shiki-dark": "#B392F0" })}">npm</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}"> install</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6F42C1", "--shiki-dark": "#B392F0" })}">npm</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}"> run</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}"> dev</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><h2 id="🌐-deploy-ke-vercel" tabindex="-1">🌐 Deploy ke Vercel <a class="header-anchor" href="#🌐-deploy-ke-vercel" aria-label="Permalink to &quot;🌐 Deploy ke Vercel&quot;">​</a></h2><ol><li>Push repo ke GitHub</li><li>Buka <a href="https://vercel.com/new" target="_blank" rel="noreferrer">vercel.com/new</a> → Import repository</li><li>Set <strong>Root Directory</strong> = <code>docs/react</code></li><li>Tambah custom domain di Settings → Domains (misal <code>react-docs.example.com</code>)</li></ol><h2 id="📁-struktur" tabindex="-1">📁 Struktur <a class="header-anchor" href="#📁-struktur" aria-label="Permalink to &quot;📁 Struktur&quot;">​</a></h2><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>docs/react/</span></span>
<span class="line"><span>├── .vitepress/config.mjs</span></span>
<span class="line"><span>├── public/ (logo + favicon)</span></span>
<span class="line"><span>├── index.md (homepage)</span></span>
<span class="line"><span>├── bagian-1/ ... bagian-7/ (7 bagian, 24 bab)</span></span>
<span class="line"><span>├── package.json</span></span>
<span class="line"><span>├── vercel.json</span></span>
<span class="line"><span>└── README.md</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><h2 id="📊-perintah-npm-dari-root" tabindex="-1">📊 Perintah NPM (dari root) <a class="header-anchor" href="#📊-perintah-npm-dari-root" aria-label="Permalink to &quot;📊 Perintah NPM (dari root)&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Perintah</th><th>Fungsi</th></tr></thead><tbody><tr><td><code>npm run dev:react</code></td><td>Dev server React</td></tr><tr><td><code>npm run build:react</code></td><td>Build static site</td></tr><tr><td><code>npm run preview:react</code></td><td>Preview hasil build</td></tr></tbody></table><hr><p>🇮🇩 Dibuat dengan ❤️ untuk komunitas developer Indonesia</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
