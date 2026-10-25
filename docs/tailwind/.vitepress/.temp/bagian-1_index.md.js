import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Bagian I — Fondasi Tailwind CSS","description":"","frontmatter":{"title":"Bagian I — Fondasi Tailwind CSS"},"headers":[],"relativePath":"bagian-1/index.md","filePath":"bagian-1/index.md","lastUpdated":null}');
const _sfc_main = { name: "bagian-1/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_TailwindPreview = resolveComponent("TailwindPreview");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="🟢-bagian-i-—-fondasi-tailwind-css" tabindex="-1">🟢 BAGIAN I — Fondasi Tailwind CSS <a class="header-anchor" href="#🟢-bagian-i-—-fondasi-tailwind-css" aria-label="Permalink to &quot;🟢 BAGIAN I — Fondasi Tailwind CSS&quot;">​</a></h1><blockquote><p>🎯 <strong>Tujuan Bagian Ini:</strong> Di akhir Bagian I, Anda memahami apa itu Tailwind CSS, mengapa pendekatannya berbeda dari CSS konvensional, dan sudah bisa menulis markup Tailwind untuk komponen-komponen dasar.</p></blockquote><h2 id="📚-daftar-bab-di-bagian-ini" tabindex="-1">📚 Daftar Bab di Bagian Ini <a class="header-anchor" href="#📚-daftar-bab-di-bagian-ini" aria-label="Permalink to &quot;📚 Daftar Bab di Bagian Ini&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Bab</th><th>Topik</th><th>Status</th></tr></thead><tbody><tr><td>1</td><td><a href="/bagian-1/bab-1">Mengenal Tailwind CSS</a></td><td>✅ Tersedia</td></tr><tr><td>2</td><td><a href="/bagian-1/bab-2">Cara Berpikir Utility-First</a></td><td>✅ Tersedia</td></tr><tr><td>3</td><td><a href="/bagian-1/bab-3">Typography &amp; Text Utilities</a></td><td>✅ Tersedia</td></tr></tbody></table><h2 id="🗺️-peta-konsep-bagian-i" tabindex="-1">🗺️ Peta Konsep Bagian I <a class="header-anchor" href="#🗺️-peta-konsep-bagian-i" aria-label="Permalink to &quot;🗺️ Peta Konsep Bagian I&quot;">​</a></h2><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Bab 1 — Mengenal Tailwind</span></span>
<span class="line"><span>   │  (Apa &amp; kenapa)</span></span>
<span class="line"><span>   ▼</span></span>
<span class="line"><span>Bab 2 — Cara Berpikir Utility-First</span></span>
<span class="line"><span>   │  (Mindset)</span></span>
<span class="line"><span>   ▼</span></span>
<span class="line"><span>Bab 3 — Typography &amp; Text</span></span>
<span class="line"><span>   │  (Penggunaan pertama)</span></span>
<span class="line"><span>   ▼</span></span>
<span class="line"><span>Lanjut ke Bagian II → Layout &amp; Spacing</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div>`);
  _push(ssrRenderComponent(_component_TailwindPreview, { code: "Bab 1 — Mengenal Tailwind\n   │  (Apa & kenapa)\n   ▼\nBab 2 — Cara Berpikir Utility-First\n   │  (Mindset)\n   ▼\nBab 3 — Typography & Text\n   │  (Penggunaan pertama)\n   ▼\nLanjut ke Bagian II → Layout & Spacing\n" }, null, _parent));
  _push(`<h2 id="⏱️-estimasi-waktu" tabindex="-1">⏱️ Estimasi Waktu <a class="header-anchor" href="#⏱️-estimasi-waktu" aria-label="Permalink to &quot;⏱️ Estimasi Waktu&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Bab</th><th>Estimasi</th></tr></thead><tbody><tr><td>Bab 1</td><td>20–30 menit</td></tr><tr><td>Bab 2</td><td>30–45 menit</td></tr><tr><td>Bab 3</td><td>20–30 menit</td></tr><tr><td><strong>Total Bagian I</strong></td><td><strong>± 1.5–2 jam</strong></td></tr></tbody></table><div class="tip custom-block"><p class="custom-block-title">💡 Tips</p><p>Bagian I adalah fondasi. <strong>Bab 2 (Utility-First)</strong> adalah yang paling penting karena mengubah cara Anda menulis CSS secara fundamental. Luangkan waktu lebih untuk bab ini.</p></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("bagian-1/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
