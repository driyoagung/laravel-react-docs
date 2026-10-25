import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Bagian III — Database & Eloquent ORM","description":"","frontmatter":{"title":"Bagian III — Database & Eloquent ORM"},"headers":[],"relativePath":"bagian-3/index.md","filePath":"bagian-3/index.md","lastUpdated":null}');
const _sfc_main = { name: "bagian-3/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="🟡-bagian-iii-—-database-eloquent-orm" tabindex="-1">🟡 BAGIAN III — Database &amp; Eloquent ORM <a class="header-anchor" href="#🟡-bagian-iii-—-database-eloquent-orm" aria-label="Permalink to &quot;🟡 BAGIAN III — Database &amp; Eloquent ORM&quot;">​</a></h1><blockquote><p>🎯 <strong>Tujuan Bagian Ini:</strong> Menguasai cara Laravel berinteraksi dengan database — dari migration, model, relasi, hingga query optimization. Ini adalah bagian yang paling banyak Anda gunakan sehari-hari.</p></blockquote><h2 id="📚-daftar-bab-di-bagian-ini" tabindex="-1">📚 Daftar Bab di Bagian Ini <a class="header-anchor" href="#📚-daftar-bab-di-bagian-ini" aria-label="Permalink to &quot;📚 Daftar Bab di Bagian Ini&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Bab</th><th>Topik</th><th>Status</th></tr></thead><tbody><tr><td>10</td><td><a href="/bagian-3/bab-10">Eloquent ORM &amp; Migration</a></td><td>✅ Tersedia</td></tr><tr><td>11</td><td><a href="/bagian-3/bab-11">Relasi Eloquent</a></td><td>✅ Tersedia</td></tr><tr><td>12</td><td><a href="/bagian-3/bab-12">Seeder, Factory &amp; Database Testing</a></td><td>✅ Tersedia</td></tr><tr><td>13</td><td><a href="/bagian-3/bab-13">Query Builder &amp; Raw Query</a></td><td>✅ Tersedia</td></tr></tbody></table><h2 id="🗺️-peta-konsep-bagian-iii" tabindex="-1">🗺️ Peta Konsep Bagian III <a class="header-anchor" href="#🗺️-peta-konsep-bagian-iii" aria-label="Permalink to &quot;🗺️ Peta Konsep Bagian III&quot;">​</a></h2><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Bab 10 — Eloquent &amp; Migration     ⭐⭐⭐ (KRITIS)</span></span>
<span class="line"><span>   │  (Dasar interaksi DB)</span></span>
<span class="line"><span>   ▼</span></span>
<span class="line"><span>Bab 11 — Relasi Eloquent</span></span>
<span class="line"><span>   │  (HasMany, BelongsTo, Many-to-Many)</span></span>
<span class="line"><span>   ▼</span></span>
<span class="line"><span>Bab 12 — Seeder &amp; Factory</span></span>
<span class="line"><span>   │  (Data dummy untuk testing)</span></span>
<span class="line"><span>   ▼</span></span>
<span class="line"><span>Bab 13 — Query Builder</span></span>
<span class="line"><span>   │  (Raw query untuk performa)</span></span>
<span class="line"><span>   ▼</span></span>
<span class="line"><span>Lanjut ke Bagian IV → Autentikasi</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><h2 id="⏱️-estimasi-waktu" tabindex="-1">⏱️ Estimasi Waktu <a class="header-anchor" href="#⏱️-estimasi-waktu" aria-label="Permalink to &quot;⏱️ Estimasi Waktu&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Bab</th><th>Estimasi</th></tr></thead><tbody><tr><td>Bab 10</td><td>60–90 menit</td></tr><tr><td>Bab 11</td><td>60–90 menit</td></tr><tr><td>Bab 12</td><td>30–45 menit</td></tr><tr><td>Bab 13</td><td>20–30 menit</td></tr><tr><td><strong>Total Bagian III</strong></td><td><strong>± 3–4 jam</strong></td></tr></tbody></table><div class="warning custom-block"><p class="custom-block-title">⚠️ Penting</p><p><strong>Bab 10 (Eloquent ORM) adalah salah satu bab PALING KRITIS</strong>. 90% pekerjaan Laravel sehari-hari ada di sini. Pastikan Anda menguasai query dasar dan model sebelum lanjut ke relasi.</p></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("bagian-3/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
