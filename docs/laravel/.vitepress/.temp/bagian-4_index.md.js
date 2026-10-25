import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Bagian IV — Autentikasi & Keamanan","description":"","frontmatter":{"title":"Bagian IV — Autentikasi & Keamanan"},"headers":[],"relativePath":"bagian-4/index.md","filePath":"bagian-4/index.md","lastUpdated":null}');
const _sfc_main = { name: "bagian-4/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="🟠-bagian-iv-—-autentikasi-keamanan" tabindex="-1">🟠 BAGIAN IV — Autentikasi &amp; Keamanan <a class="header-anchor" href="#🟠-bagian-iv-—-autentikasi-keamanan" aria-label="Permalink to &quot;🟠 BAGIAN IV — Autentikasi &amp; Keamanan&quot;">​</a></h1><blockquote><p>🎯 <strong>Tujuan Bagian Ini:</strong> Implementasi autentikasi yang benar, aman, dan siap production — dari login biasa, role &amp; permission, hingga autentikasi API dengan Sanctum.</p></blockquote><h2 id="📚-daftar-bab-di-bagian-ini" tabindex="-1">📚 Daftar Bab di Bagian Ini <a class="header-anchor" href="#📚-daftar-bab-di-bagian-ini" aria-label="Permalink to &quot;📚 Daftar Bab di Bagian Ini&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Bab</th><th>Topik</th><th>Status</th></tr></thead><tbody><tr><td>14</td><td><a href="/bagian-4/bab-14">Autentikasi dengan Laravel Breeze</a></td><td>✅ Tersedia</td></tr><tr><td>15</td><td><a href="/bagian-4/bab-15">Role &amp; Permission</a></td><td>✅ Tersedia</td></tr><tr><td>16</td><td><a href="/bagian-4/bab-16">Keamanan Laravel</a></td><td>✅ Tersedia</td></tr></tbody></table><h2 id="🗺️-peta-konsep-bagian-iv" tabindex="-1">🗺️ Peta Konsep Bagian IV <a class="header-anchor" href="#🗺️-peta-konsep-bagian-iv" aria-label="Permalink to &quot;🗺️ Peta Konsep Bagian IV&quot;">​</a></h2><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Bab 14 — Breeze Setup</span></span>
<span class="line"><span>   │  (Login, register, forgot password)</span></span>
<span class="line"><span>   ▼</span></span>
<span class="line"><span>Bab 15 — Role &amp; Permission</span></span>
<span class="line"><span>   │  (Gate, Policy, Spatie)</span></span>
<span class="line"><span>   ▼</span></span>
<span class="line"><span>Bab 16 — Keamanan</span></span>
<span class="line"><span>   │  (CSRF, XSS, SQL Injection)</span></span>
<span class="line"><span>   ▼</span></span>
<span class="line"><span>Lanjut ke Bagian V → REST API</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><h2 id="⏱️-estimasi-waktu" tabindex="-1">⏱️ Estimasi Waktu <a class="header-anchor" href="#⏱️-estimasi-waktu" aria-label="Permalink to &quot;⏱️ Estimasi Waktu&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Bab</th><th>Estimasi</th></tr></thead><tbody><tr><td>Bab 14</td><td>30–45 menit</td></tr><tr><td>Bab 15</td><td>45–60 menit</td></tr><tr><td>Bab 16</td><td>30–45 menit</td></tr><tr><td><strong>Total Bagian IV</strong></td><td><strong>± 2–2.5 jam</strong></td></tr></tbody></table><div class="tip custom-block"><p class="custom-block-title">💡 Tips</p><p>Untuk API stateless (Bab 17–20), kita akan pakai <strong>Sanctum</strong> bukan Breeze. Tapi konsep autentikasi-nya tetap sama — bedanya hanya di session vs token.</p></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("bagian-4/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
