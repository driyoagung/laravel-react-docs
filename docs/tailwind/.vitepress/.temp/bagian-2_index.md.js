import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Bagian II — Layout & Spacing","description":"","frontmatter":{"title":"Bagian II — Layout & Spacing"},"headers":[],"relativePath":"bagian-2/index.md","filePath":"bagian-2/index.md","lastUpdated":null}');
const _sfc_main = { name: "bagian-2/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="🔵-bagian-ii-—-layout-spacing" tabindex="-1">🔵 BAGIAN II — Layout &amp; Spacing <a class="header-anchor" href="#🔵-bagian-ii-—-layout-spacing" aria-label="Permalink to &quot;🔵 BAGIAN II — Layout &amp; Spacing&quot;">​</a></h1><blockquote><p>🎯 <strong>Tujuan Bagian Ini:</strong> Menguasai sistem layout Tailwind — dari box model, Flexbox, hingga Grid — sehingga Anda bisa membangun struktur halaman apapun tanpa menulis CSS manual.</p></blockquote><h2 id="📚-daftar-bab-di-bagian-ini" tabindex="-1">📚 Daftar Bab di Bagian Ini <a class="header-anchor" href="#📚-daftar-bab-di-bagian-ini" aria-label="Permalink to &quot;📚 Daftar Bab di Bagian Ini&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Bab</th><th>Topik</th><th>Status</th></tr></thead><tbody><tr><td>4</td><td><a href="/bagian-2/bab-4">Box Model, Sizing &amp; Positioning</a></td><td>✅ Tersedia</td></tr><tr><td>5</td><td><a href="/bagian-2/bab-5">Flexbox dengan Tailwind</a></td><td>✅ Tersedia</td></tr><tr><td>6</td><td><a href="/bagian-2/bab-6">CSS Grid dengan Tailwind</a></td><td>✅ Tersedia</td></tr></tbody></table><h2 id="⏱️-estimasi-waktu" tabindex="-1">⏱️ Estimasi Waktu <a class="header-anchor" href="#⏱️-estimasi-waktu" aria-label="Permalink to &quot;⏱️ Estimasi Waktu&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Bab</th><th>Estimasi</th></tr></thead><tbody><tr><td>Bab 4</td><td>30–45 menit</td></tr><tr><td>Bab 5</td><td>60–90 menit</td></tr><tr><td>Bab 6</td><td>45–60 menit</td></tr><tr><td><strong>Total Bagian II</strong></td><td><strong>± 2.5–3 jam</strong></td></tr></tbody></table><div class="tip custom-block"><p class="custom-block-title">💡 Skill Harian</p><p>Flexbox &amp; Grid adalah 2 skill yang paling sering dipakai dalam web development sehari-hari. 80% layout bisa diselesaikan dengan hanya 2 utility: <code>flex</code> dan <code>grid</code>. Kuasai Bab 5 &amp; 6 dengan baik!</p></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("bagian-2/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
