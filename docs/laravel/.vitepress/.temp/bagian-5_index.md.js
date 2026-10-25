import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Bagian V — REST API Development","description":"","frontmatter":{"title":"Bagian V — REST API Development"},"headers":[],"relativePath":"bagian-5/index.md","filePath":"bagian-5/index.md","lastUpdated":null}');
const _sfc_main = { name: "bagian-5/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="🔴-bagian-v-—-rest-api-development" tabindex="-1">🔴 BAGIAN V — REST API Development <a class="header-anchor" href="#🔴-bagian-v-—-rest-api-development" aria-label="Permalink to &quot;🔴 BAGIAN V — REST API Development&quot;">​</a></h1><blockquote><p>🎯 <strong>Tujuan Bagian Ini:</strong> Membangun REST API yang profesional, terdokumentasi, dan aman menggunakan Laravel — keahlian paling dicari di pasar kerja Laravel.</p></blockquote><h2 id="📚-daftar-bab-di-bagian-ini" tabindex="-1">📚 Daftar Bab di Bagian Ini <a class="header-anchor" href="#📚-daftar-bab-di-bagian-ini" aria-label="Permalink to &quot;📚 Daftar Bab di Bagian Ini&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Bab</th><th>Topik</th><th>Status</th></tr></thead><tbody><tr><td>17</td><td><a href="/bagian-5/bab-17">Dasar REST API dengan Laravel</a></td><td>✅ Tersedia</td></tr><tr><td>18</td><td><a href="/bagian-5/bab-18">API Response &amp; Error Handling</a></td><td>✅ Tersedia</td></tr><tr><td>19</td><td><a href="/bagian-5/bab-19">Autentikasi API dengan Sanctum</a></td><td>✅ Tersedia</td></tr><tr><td>20</td><td><a href="/bagian-5/bab-20">API Versioning &amp; Best Practices</a></td><td>✅ Tersedia</td></tr></tbody></table><h2 id="🗺️-peta-konsep-bagian-v" tabindex="-1">🗺️ Peta Konsep Bagian V <a class="header-anchor" href="#🗺️-peta-konsep-bagian-v" aria-label="Permalink to &quot;🗺️ Peta Konsep Bagian V&quot;">​</a></h2><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Bab 17 — Dasar REST API</span></span>
<span class="line"><span>   │  (Route, Resource, Controller)</span></span>
<span class="line"><span>   ▼</span></span>
<span class="line"><span>Bab 18 — Response &amp; Error Handling</span></span>
<span class="line"><span>   │  (Format response konsisten)</span></span>
<span class="line"><span>   ▼</span></span>
<span class="line"><span>Bab 19 — Sanctum Auth</span></span>
<span class="line"><span>   │  (Token-based authentication)</span></span>
<span class="line"><span>   ▼</span></span>
<span class="line"><span>Bab 20 — Versioning &amp; Best Practices</span></span>
<span class="line"><span>   ▼</span></span>
<span class="line"><span>Lanjut ke Bagian VI → Level Up</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><h2 id="⏱️-estimasi-waktu" tabindex="-1">⏱️ Estimasi Waktu <a class="header-anchor" href="#⏱️-estimasi-waktu" aria-label="Permalink to &quot;⏱️ Estimasi Waktu&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Bab</th><th>Estimasi</th></tr></thead><tbody><tr><td>Bab 17</td><td>60–90 menit</td></tr><tr><td>Bab 18</td><td>30–45 menit</td></tr><tr><td>Bab 19</td><td>45–60 menit</td></tr><tr><td>Bab 20</td><td>30–45 menit</td></tr><tr><td><strong>Total Bagian V</strong></td><td><strong>± 3–4 jam</strong></td></tr></tbody></table><div class="tip custom-block"><p class="custom-block-title">💡 Skill yang Dicari Industri</p><p>REST API adalah skill <strong>PALING DICARI</strong> untuk developer Laravel di industri. Backend engineer, fullstack developer, hampir semua posisi butuh kemampuan ini. Investasi waktu Anda di bagian ini akan terbayar lunas!</p></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("bagian-5/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
