import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Bagian I — Fondasi Laravel","description":"","frontmatter":{"title":"Bagian I — Fondasi Laravel"},"headers":[],"relativePath":"bagian-1/index.md","filePath":"bagian-1/index.md","lastUpdated":null}');
const _sfc_main = { name: "bagian-1/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="🟢-bagian-i-—-fondasi-laravel" tabindex="-1">🟢 BAGIAN I — Fondasi Laravel <a class="header-anchor" href="#🟢-bagian-i-—-fondasi-laravel" aria-label="Permalink to &quot;🟢 BAGIAN I — Fondasi Laravel&quot;">​</a></h1><blockquote><p>🎯 <strong>Tujuan Bagian Ini:</strong> Di akhir Bagian I, Anda sudah bisa menjalankan project Laravel pertama, memahami alur request dari browser hingga response, dan terbiasa dengan struktur folder Laravel yang terorganisir.</p></blockquote><h2 id="📚-daftar-bab-di-bagian-ini" tabindex="-1">📚 Daftar Bab di Bagian Ini <a class="header-anchor" href="#📚-daftar-bab-di-bagian-ini" aria-label="Permalink to &quot;📚 Daftar Bab di Bagian Ini&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Bab</th><th>Topik</th><th>Status</th></tr></thead><tbody><tr><td>1</td><td><a href="/bagian-1/bab-1">Mengenal Laravel &amp; Ekosistemnya</a></td><td>✅ Tersedia</td></tr><tr><td>2</td><td><a href="/bagian-1/bab-2">Setup &amp; Instalasi Project</a></td><td>✅ Tersedia</td></tr><tr><td>3</td><td><a href="/bagian-1/bab-3">MVC: Cara Berpikir Laravel</a></td><td>✅ Tersedia</td></tr><tr><td>4</td><td><a href="/bagian-1/bab-4">Routing &amp; Controller Dasar</a></td><td>✅ Tersedia</td></tr></tbody></table><h2 id="🗺️-peta-konsep-bagian-i" tabindex="-1">🗺️ Peta Konsep Bagian I <a class="header-anchor" href="#🗺️-peta-konsep-bagian-i" aria-label="Permalink to &quot;🗺️ Peta Konsep Bagian I&quot;">​</a></h2><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Bab 1 — Mengenal Laravel</span></span>
<span class="line"><span>   │  (Apa &amp; kenapa)</span></span>
<span class="line"><span>   ▼</span></span>
<span class="line"><span>Bab 2 — Setup &amp; Instalasi</span></span>
<span class="line"><span>   │  (Peralatan &amp; konfigurasi)</span></span>
<span class="line"><span>   ▼</span></span>
<span class="line"><span>Bab 3 — MVC Pattern</span></span>
<span class="line"><span>   │  (Cara berpikir Laravel)</span></span>
<span class="line"><span>   ▼</span></span>
<span class="line"><span>Bab 4 — Routing &amp; Controller</span></span>
<span class="line"><span>   ▼</span></span>
<span class="line"><span>Lanjut ke Bagian II → Core Concepts</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><h2 id="⏱️-estimasi-waktu" tabindex="-1">⏱️ Estimasi Waktu <a class="header-anchor" href="#⏱️-estimasi-waktu" aria-label="Permalink to &quot;⏱️ Estimasi Waktu&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Bab</th><th>Estimasi</th></tr></thead><tbody><tr><td>Bab 1</td><td>15–20 menit</td></tr><tr><td>Bab 2</td><td>30–45 menit</td></tr><tr><td>Bab 3</td><td>20–30 menit</td></tr><tr><td>Bab 4</td><td>45–60 menit</td></tr><tr><td><strong>Total Bagian I</strong></td><td><strong>± 2.5–3 jam</strong></td></tr></tbody></table><div class="tip custom-block"><p class="custom-block-title">💡 Tips</p><p>Jangan terburu-buru! Bagian I adalah fondasi. Pastikan Anda benar-benar memahami MVC sebelum lanjut ke Bagian II, karena konsep Service Container di Bab 5 akan jauh lebih mudah jika Anda sudah paham alur MVC.</p></div></div>`);
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
